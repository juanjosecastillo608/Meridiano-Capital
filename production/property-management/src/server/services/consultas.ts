import { prisma } from "../db";
import { exigir, filtroSociedad, type Sesion } from "../authz";
import { filtroPersonaVisible } from "./nucleo";
import { alertasVencimiento } from "./contratos";
import { d, sumar, Decimal } from "../../domain/money";
import { hoyAsuncion, inicioPeriodo, finPeriodo, periodoDe } from "../../domain/periodo";
import { estadoOcupacion } from "../../domain/ocupacion";
import { montoVigente } from "../../domain/contratos";
import { calcularIndicadores } from "../../domain/indicadores";

export interface FiltrosPanel {
  sociedadId?: string;
  propiedadId?: string;
  periodo?: string;
  moneda?: "PYG" | "USD";
}

/**
 * Panel general. Todos los importes se agrupan por moneda (nunca se suman
 * PYG y USD). Indicadores con fórmula y origen (ver domain/indicadores).
 */
export async function panel(s: Sesion, f: FiltrosPanel = {}) {
  if (f.sociedadId) exigir(s, "LEER", f.sociedadId);
  const periodo = f.periodo ?? periodoDe(hoyAsuncion());
  const moneda = f.moneda ?? "PYG";
  const hoy = hoyAsuncion();
  const soc = { ...filtroSociedad(s), ...(f.sociedadId ? { sociedadId: f.sociedadId } : {}) };
  const prop = { ...soc, ...(f.propiedadId ? { propiedadId: f.propiedadId } : {}) };

  const [sociedades, propiedades, unidades, obligaciones, aplicaciones, egresos, remodelaciones, facturasPend] = await Promise.all([
    prisma.sociedad.count({ where: { deletedAt: null, ...(f.sociedadId ? { id: f.sociedadId } : filtroSociedad(s, "id")) } }),
    prisma.propiedad.count({ where: { deletedAt: null, ...soc, ...(f.propiedadId ? { id: f.propiedadId } : {}) } }),
    prisma.unidad.findMany({
      where: { deletedAt: null, propiedad: { ...soc, deletedAt: null }, ...(f.propiedadId ? { propiedadId: f.propiedadId } : {}) },
      include: { contratos: { include: { contrato: { include: { condiciones: true } } } } },
    }),
    prisma.obligacion.findMany({ where: { ...prop, periodo, moneda, estado: { not: "ANULADA" } } }),
    prisma.aplicacionPago.findMany({ where: { revertidaAt: null, pago: { estado: "REGISTRADO" }, obligacion: { ...prop, periodo, moneda } }, include: { obligacion: { select: { concepto: true } } } }),
    prisma.egreso.findMany({ where: { ...prop, periodo, moneda, deletedAt: null } }),
    prisma.proyectoRemodelacion.count({ where: { ...prop, estado: { in: ["APROBADO", "EN_EJECUCION"] } } }),
    prisma.obligacion.count({ where: { ...prop, moneda, estado: { not: "ANULADA" }, itemsFactura: { none: {} } } }),
  ]);

  const ref = inicioPeriodo(periodo) > hoy ? inicioPeriodo(periodo) : finPeriodo(periodo) < hoy ? finPeriodo(periodo) : hoy;
  let ocupadas = 0, fuera = 0;
  let contractual = new Decimal(0);
  const contados = new Set<string>(); // un contrato con varias unidades se cuenta una sola vez
  for (const u of unidades) {
    const cs = u.contratos.map((x) => x.contrato).filter((c) => c.fechaInicio && c.fechaFin);
    const est = estadoOcupacion(u.estadoOperativo, cs.map((c) => ({ estado: c.estado, fechaInicio: c.fechaInicio!, fechaFin: c.fechaFin!, fechaRescision: c.fechaRescision, fechaEntrega: c.fechaEntrega, fechaDevolucion: c.fechaDevolucion })), ref);
    if (est === "OCUPADA") ocupadas++;
    if (est === "FUERA_DE_SERVICIO") fuera++;
    for (const c of cs) {
      if (contados.has(c.id) || !["VIGENTE", "VENCIDO"].includes(c.estado) || c.moneda !== moneda || c.fechaInicio! > finPeriodo(periodo) || c.fechaFin! < inicioPeriodo(periodo)) continue;
      const m = montoVigente(c.condiciones.map((x) => ({ vigenteDesde: x.vigenteDesde, montoAlquiler: x.montoAlquiler.toString() })), periodo);
      if (m) { contractual = contractual.plus(m); contados.add(c.id); }
    }
  }
  const conRef = unidades.filter((u) => u.alquilerReferencia && u.alquilerReferenciaMoneda === moneda && u.alquilerReferenciaFuente);
  const potencial = unidades.length && conRef.length === unidades.length ? sumar(conRef.map((u) => u.alquilerReferencia!.toString())) : null;

  const devengado = sumar(obligaciones.map((o) => o.importeTotal.toString()));
  const cobrado = sumar(aplicaciones.map((a) => a.importe.toString()));
  const vencidas = obligaciones.filter((o) => (o.estado === "PENDIENTE" || o.estado === "PARCIAL") && o.fechaVencimiento < hoy);
  const porConcepto = (c: string) => ({
    devengado: sumar(obligaciones.filter((o) => o.concepto === c).map((o) => o.importeTotal.toString())),
    cobrado: sumar(aplicaciones.filter((a) => a.obligacion.concepto === c).map((a) => a.importe.toString())),
    pendiente: sumar(obligaciones.filter((o) => o.concepto === c).map((o) => o.saldo.toString())),
  });
  const opex = sumar(egresos.filter((e) => e.naturaleza === "OPEX").map((e) => e.importe.toString()));
  const capex = sumar(egresos.filter((e) => e.naturaleza === "CAPEX").map((e) => e.importe.toString()));

  const indicadores = calcularIndicadores({
    periodo, unidadesTotales: unidades.length, unidadesOcupadas: ocupadas, unidadesFueraDeServicio: fuera, ingresoContractual: contractual, ingresoPotencial: potencial,
    facturado: new Decimal(0), devengado, cobrado, saldoVencido: sumar(vencidas.map((o) => o.saldo.toString())), gastosOperativos: opex, capex, valorInmueble: null,
  });

  return {
    periodo, moneda,
    totales: { sociedades, propiedades, unidades: unidades.length, ocupadas, disponibles: unidades.length - ocupadas - fuera, fueraDeServicio: fuera },
    alquiler: porConcepto("ALQUILER"),
    expensas: porConcepto("EXPENSAS"),
    devengado, cobrado,
    vencido: { cantidad: vencidas.length, importe: sumar(vencidas.map((o) => o.saldo.toString())) },
    sinFacturar: facturasPend,
    gastos: { opex, capex },
    remodelacionesActivas: remodelaciones,
    alertas: (await alertasVencimiento(s, hoy)).filter((a) => !f.sociedadId || a.contrato.sociedadId === f.sociedadId).slice(0, 20),
    pendientesRevision: await prisma.unidad.count({ where: { estadoDato: "PENDIENTE_REVISION", deletedAt: null, propiedad: soc } }),
    indicadores,
  };
}

/** Rentabilidad por propiedad (solo si existe valor documentado con fuente). */
export async function resultadoPorPropiedad(s: Sesion, periodo: string, moneda: "PYG" | "USD" = "PYG") {
  const props = await prisma.propiedad.findMany({ where: { deletedAt: null, ...filtroSociedad(s) }, select: { id: true, codigo: true, nombre: true, valorEstimado: true, valorEstimadoMoneda: true, valorEstimadoFuente: true } });
  const out = [];
  for (const p of props) {
    const obl = await prisma.obligacion.findMany({ where: { propiedadId: p.id, periodo, moneda, estado: { not: "ANULADA" } } });
    const cobrado = await prisma.aplicacionPago.aggregate({ _sum: { importe: true }, where: { revertidaAt: null, pago: { estado: "REGISTRADO" }, obligacion: { propiedadId: p.id, periodo, moneda } } });
    const egr = await prisma.egreso.aggregate({ _sum: { importe: true }, where: { propiedadId: p.id, periodo, moneda, naturaleza: "OPEX", deletedAt: null } });
    const devengado = sumar(obl.map((o) => o.importeTotal.toString()));
    const opex = d(egr._sum.importe?.toString() ?? 0);
    const valor = p.valorEstimado && p.valorEstimadoFuente && p.valorEstimadoMoneda === moneda ? d(p.valorEstimado.toString()) : null;
    out.push({ ...p, devengado, cobrado: d(cobrado._sum.importe?.toString() ?? 0), opex, resultado: devengado.minus(opex), rentabilidadAnualizadaPct: valor ? devengado.minus(opex).times(12).div(valor).times(100).toDecimalPlaces(2) : null });
  }
  return out;
}

/** Buscador global con aislamiento por sociedad. */
export async function buscar(s: Sesion, q: string) {
  const t = q.trim();
  if (t.length < 2) return { sociedades: [], propiedades: [], unidades: [], personas: [], contratos: [] };
  const ci = { contains: t, mode: "insensitive" as const };
  const [sociedades, propiedades, unidades, personas, contratos] = await Promise.all([
    prisma.sociedad.findMany({ where: { deletedAt: null, ...filtroSociedad(s, "id"), OR: [{ razonSocial: ci }, { ruc: ci }] }, take: 10 }),
    prisma.propiedad.findMany({ where: { deletedAt: null, ...filtroSociedad(s), OR: [{ nombre: ci }, { codigo: ci }, { direccion: ci }] }, take: 10 }),
    prisma.unidad.findMany({ where: { deletedAt: null, propiedad: filtroSociedad(s), identificador: ci }, include: { propiedad: { select: { codigo: true } } }, take: 20 }),
    prisma.persona.findMany({ where: { deletedAt: null, ...filtroPersonaVisible(s), OR: [{ nombre: ci }, { documentoNumero: ci }] }, take: 20 }),
    prisma.contrato.findMany({ where: { deletedAt: null, ...filtroSociedad(s), codigo: ci }, take: 10 }),
  ]);
  return { sociedades, propiedades, unidades, personas, contratos };
}
