import { z } from "zod";
import { prisma, ErrorNegocio, type Tx } from "../db";
import { exigir, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { detectarSuperposiciones, validarFechasContrato, alertaVencimiento, ALERTAS_DEFAULT, type EstadoContrato } from "../../domain/contratos";
import { hoyAsuncion, parsearFechaISO } from "../../domain/periodo";
import { d } from "../../domain/money";

const fechaOpc = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable();

export const ContratoInput = z.object({
  codigo: z.string().trim().min(3),
  propiedadId: z.string(),
  unidadIds: z.array(z.string()).min(1),
  inquilinoIds: z.array(z.string()).min(1),
  garanteIds: z.array(z.string()).default([]),
  categoriaFiscal: z.enum(["ALQUILER_RESIDENCIAL", "ALQUILER_COMERCIAL", "RENTA_TEMPORAL"]),
  fechaFirma: fechaOpc,
  fechaInicio: fechaOpc,
  fechaFin: fechaOpc,
  moneda: z.enum(["PYG", "USD"]),
  diaVencimiento: z.coerce.number().int().min(1).max(31).optional().nullable(),
  montoAlquiler: z.string().regex(/^\d+(\.\d{1,2})?$/, "Importe sin separadores de miles, punto decimal"),
  deposito: z.string().optional().nullable(),
  reajusteTipo: z.enum(["SIN_REAJUSTE", "PORCENTAJE_FIJO", "INDICE", "MANUAL"]).default("SIN_REAJUSTE"),
  reajusteFrecuenciaMeses: z.coerce.number().int().positive().optional().nullable(),
  reajustePorcentaje: z.string().optional().nullable(),
  responsabilidadExpensas: z.enum(["INQUILINO", "PROPIETARIO", "COMPARTIDO", "NO_DEFINIDO"]).default("NO_DEFINIDO"),
  responsabilidadServicios: z.enum(["INQUILINO", "PROPIETARIO", "COMPARTIDO", "NO_DEFINIDO"]).default("NO_DEFINIDO"),
  penalidadesTexto: z.string().optional().nullable(),
  moraTasaDiariaPct: z.string().optional().nullable(),
  periodoGraciaDias: z.coerce.number().int().min(0).default(0),
  condicionesRenovacion: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  estado: z.enum(["BORRADOR", "PENDIENTE_FIRMA", "VIGENTE"]).default("BORRADOR"),
});

const f = (x?: string | null) => (x ? parsearFechaISO(x) : null);

/** Bloqueo por unidad para que dos altas simultáneas no se superpongan (RN-CON-01). */
async function bloquearUnidades(tx: Tx, unidadIds: string[]) {
  for (const id of [...unidadIds].sort()) await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"unidad:" + id}))`;
}

async function verificarSuperposicion(tx: Tx, c: { id?: string; estado: EstadoContrato; fechaInicio: Date | null; fechaFin: Date | null; fechaRescision?: Date | null; unidadIds: string[] }) {
  if (!c.fechaInicio || !c.fechaFin) return;
  const existentes = await tx.contrato.findMany({
    where: { deletedAt: null, unidades: { some: { unidadId: { in: c.unidadIds } } }, NOT: c.id ? { id: c.id } : undefined, fechaInicio: { not: null }, fechaFin: { not: null } },
    include: { unidades: true },
  });
  const sup = detectarSuperposiciones(
    { ...c, fechaInicio: c.fechaInicio, fechaFin: c.fechaFin },
    existentes.map((e) => ({ id: e.id, codigo: e.codigo, estado: e.estado, fechaInicio: e.fechaInicio!, fechaFin: e.fechaFin!, fechaRescision: e.fechaRescision, unidadIds: e.unidades.map((u) => u.unidadId) })),
  );
  if (sup.length) throw new ErrorNegocio(`El período se superpone con contrato(s) activos: ${[...new Set(sup.map((x) => x.codigo))].join(", ")}.`, "SUPERPOSICION", sup);
}

function validarParaActivar(c: { fechaInicio: Date | null; fechaFin: Date | null; diaVencimiento: number | null }) {
  const errores: string[] = [];
  if (!c.fechaInicio || !c.fechaFin) errores.push("Faltan fechas de inicio y fin contractuales.");
  if (!c.diaVencimiento) errores.push("Falta el día de vencimiento mensual.");
  if (c.fechaInicio && c.fechaFin && c.diaVencimiento) errores.push(...validarFechasContrato({ fechaInicio: c.fechaInicio, fechaFin: c.fechaFin, diaVencimiento: c.diaVencimiento }));
  if (errores.length) throw new ErrorNegocio(`No se puede activar el contrato: ${errores.join(" ")}`, "VALIDACION", errores);
}

export async function crearContrato(s: Sesion, input: z.input<typeof ContratoInput>) {
  const data = ContratoInput.parse(input);
  const prop = await prisma.propiedad.findUnique({ where: { id: data.propiedadId } });
  if (!prop) throw new ErrorNegocio("Propiedad no encontrada.");
  exigir(s, "GESTIONAR_CONTRATOS", prop.sociedadId, prop.id);
  const fechaInicio = f(data.fechaInicio), fechaFin = f(data.fechaFin);
  if (data.estado !== "BORRADOR") validarParaActivar({ fechaInicio, fechaFin, diaVencimiento: data.diaVencimiento ?? null });

  return prisma.$transaction(async (tx) => {
    const unidades = await tx.unidad.findMany({ where: { id: { in: data.unidadIds }, deletedAt: null } });
    if (unidades.length !== data.unidadIds.length || unidades.some((u) => u.propiedadId !== prop.id)) throw new ErrorNegocio("Todas las unidades deben existir y pertenecer a la propiedad del contrato.");
    await bloquearUnidades(tx, data.unidadIds);
    await verificarSuperposicion(tx, { estado: data.estado, fechaInicio, fechaFin, unidadIds: data.unidadIds });

    const c = await tx.contrato.create({
      data: {
        codigo: data.codigo, sociedadId: prop.sociedadId, propiedadId: prop.id, estado: data.estado, categoriaFiscal: data.categoriaFiscal,
        fechaFirma: f(data.fechaFirma), fechaInicio, fechaFin, moneda: data.moneda, diaVencimiento: data.diaVencimiento ?? null,
        deposito: data.deposito || null, reajusteTipo: data.reajusteTipo, reajusteFrecuenciaMeses: data.reajusteFrecuenciaMeses ?? null, reajustePorcentaje: data.reajustePorcentaje || null,
        responsabilidadExpensas: data.responsabilidadExpensas, responsabilidadServicios: data.responsabilidadServicios, penalidadesTexto: data.penalidadesTexto ?? null,
        moraTasaDiariaPct: data.moraTasaDiariaPct || null, periodoGraciaDias: data.periodoGraciaDias, condicionesRenovacion: data.condicionesRenovacion ?? null, observaciones: data.observaciones ?? null,
        unidades: { create: data.unidadIds.map((unidadId) => ({ unidadId })) },
        partes: { create: [...data.inquilinoIds.map((personaId) => ({ personaId, rol: "INQUILINO" as const })), ...data.garanteIds.map((personaId) => ({ personaId, rol: "GARANTE" as const }))] },
        condiciones: { create: { vigenteDesde: fechaInicio ?? hoyAsuncion(), montoAlquiler: data.montoAlquiler, motivo: "INICIAL", creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } },
      },
    });
    await auditar(tx, s, "CONTRATO_CREAR", "Contrato", c.id, { sociedadId: c.sociedadId, despues: { ...c, montoAlquiler: data.montoAlquiler } });
    return c;
  });
}

export async function cambiarEstadoContrato(s: Sesion, contratoId: string, nuevo: EstadoContrato, opts: { motivo: string; fechaRescision?: string | null; fechaDevolucion?: string | null }) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId }, include: { unidades: true } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.");
  exigir(s, "GESTIONAR_CONTRATOS", c.sociedadId, c.propiedadId);
  if (!opts.motivo?.trim()) throw new ErrorNegocio("Indique el motivo del cambio de estado.");
  const permitidas: Record<EstadoContrato, EstadoContrato[]> = {
    BORRADOR: ["PENDIENTE_FIRMA", "VIGENTE"],
    PENDIENTE_FIRMA: ["VIGENTE", "BORRADOR"],
    VIGENTE: ["VENCIDO", "RESCINDIDO", "FINALIZADO", "RENOVADO"],
    VENCIDO: ["FINALIZADO", "RENOVADO", "RESCINDIDO"],
    RENOVADO: [],
    RESCINDIDO: [],
    FINALIZADO: [],
  };
  if (!permitidas[c.estado].includes(nuevo)) throw new ErrorNegocio(`Transición no permitida: ${c.estado} → ${nuevo}.`);
  if (nuevo === "VIGENTE" || nuevo === "PENDIENTE_FIRMA") validarParaActivar(c);
  // Contratos generados desde plantilla: no pasan a firma/vigencia sin completar el procedimiento (Actualización contractual 03).
  if (c.plantillaVersion && (nuevo === "PENDIENTE_FIRMA" || nuevo === "VIGENTE")) {
    const faltan = [!c.inicioConfirmado && "fecha de inicio confirmada", !c.depositoVerificado && "depósito verificado", !c.revisionJuridicaAprobada && "revisión jurídica de la redacción", !c.cuentaBancariaId && "cuenta bancaria receptora"].filter(Boolean);
    if (!c.dateApprovedAt) faltan.push("aprobación definitiva de fechas");
    if (nuevo === "VIGENTE" && !c.documentoFirmadoId) faltan.push("contrato firmado incorporado");
    if (faltan.length) throw new ErrorNegocio(`Procedimiento incompleto: falta ${faltan.join(", ")}.`, "VALIDACION", faltan);
  }
  if (nuevo === "RESCINDIDO" && !opts.fechaRescision) throw new ErrorNegocio("La rescisión requiere fecha de rescisión.");
  return prisma.$transaction(async (tx) => {
    await bloquearUnidades(tx, c.unidades.map((u) => u.unidadId));
    if (nuevo === "VIGENTE" || nuevo === "PENDIENTE_FIRMA") await verificarSuperposicion(tx, { id: c.id, estado: nuevo, fechaInicio: c.fechaInicio, fechaFin: c.fechaFin, unidadIds: c.unidades.map((u) => u.unidadId) });
    const act = await tx.contrato.update({ where: { id: c.id }, data: { estado: nuevo, fechaRescision: f(opts.fechaRescision) ?? c.fechaRescision, fechaDevolucion: f(opts.fechaDevolucion) ?? c.fechaDevolucion } });
    await auditar(tx, s, "CONTRATO_CAMBIAR_ESTADO", "Contrato", c.id, { sociedadId: c.sociedadId, antes: { estado: c.estado }, despues: { estado: nuevo, fechaRescision: opts.fechaRescision }, motivo: opts.motivo });
    return act;
  });
}

/** Adenda / cambio de importe: agrega una condición nueva, nunca edita la anterior. */
export async function modificarAlquiler(s: Sesion, contratoId: string, input: { vigenteDesde: string; montoAlquiler: string; motivo: "ADENDA" | "REAJUSTE" | "CORRECCION"; referencia: string }) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId }, include: { condiciones: { orderBy: { vigenteDesde: "desc" }, take: 1 } } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.");
  exigir(s, "MODIFICAR_ALQUILER", c.sociedadId, c.propiedadId);
  if (!input.referencia?.trim()) throw new ErrorNegocio("Indique la referencia (nº de adenda, fórmula aplicada o motivo de corrección).");
  if (d(input.montoAlquiler).lessThanOrEqualTo(0)) throw new ErrorNegocio("Importe inválido.");
  return prisma.$transaction(async (tx) => {
    const cond = await tx.condicionContrato.create({ data: { contratoId, vigenteDesde: parsearFechaISO(input.vigenteDesde), montoAlquiler: input.montoAlquiler, motivo: input.motivo, referencia: input.referencia, creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } });
    await auditar(tx, s, "CONTRATO_MODIFICAR_ALQUILER", "Contrato", contratoId, { sociedadId: c.sociedadId, antes: c.condiciones[0] ?? null, despues: cond, motivo: input.referencia });
    return cond;
  });
}

export async function listarContratos(s: Sesion, filtros: { sociedadId?: string; propiedadId?: string; estado?: EstadoContrato } = {}) {
  if (filtros.sociedadId) exigir(s, "LEER", filtros.sociedadId);
  return prisma.contrato.findMany({
    where: { deletedAt: null, ...filtroSociedad(s), ...filtros },
    include: { propiedad: { select: { codigo: true, nombre: true } }, unidades: { include: { unidad: { select: { identificador: true } } } }, partes: { include: { persona: { select: { id: true, nombre: true } } } }, condiciones: { orderBy: { vigenteDesde: "desc" }, take: 1 } },
    orderBy: [{ fechaFin: "asc" }],
  });
}

/** Alertas de vencimiento según configuración (por sociedad o global), separadas del estado jurídico. */
export async function alertasVencimiento(s: Sesion, hoy = hoyAsuncion()) {
  const contratos = await prisma.contrato.findMany({ where: { deletedAt: null, estado: { in: ["VIGENTE", "VENCIDO"] }, fechaFin: { not: null }, ...filtroSociedad(s) }, include: { propiedad: { select: { codigo: true } }, unidades: { include: { unidad: { select: { identificador: true } } } } } });
  const configs = await prisma.configuracionAlerta.findMany({ where: { tipo: "CONTRATO_VENCIMIENTO" } });
  const umbralesDe = (soc: string) => configs.find((c) => c.sociedadId === soc)?.dias ?? configs.find((c) => c.sociedadId === null)?.dias ?? ALERTAS_DEFAULT;
  return contratos
    .map((c) => ({ contrato: c, alerta: alertaVencimiento(c.fechaFin!, hoy, umbralesDe(c.sociedadId)) }))
    .filter((x) => x.alerta.umbral !== null || x.alerta.vencido)
    .sort((a, b) => a.alerta.diasRestantes - b.alerta.diasRestantes);
}
