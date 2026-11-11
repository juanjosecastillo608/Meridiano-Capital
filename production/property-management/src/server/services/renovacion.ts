import { z } from "zod";
import { prisma, ErrorNegocio, type Tx } from "../db";
import { exigir, puede, type Sesion } from "../authz";
import { auditar } from "../audit";
import { subirDocumento } from "./documentos";
import { calculateLeaseEndDate, aDate, desdeDate, diasInclusivos, parsear, type FechaCalendario } from "../../domain/plazos";
import { detectarSuperposiciones, finEfectivo } from "../../domain/contratos";
import { d } from "../../domain/money";
import { generarDocx, PLANTILLA_VERSION, type DatosContrato } from "../plantillas/contrato-residencial";

/**
 * Actualización contractual 03 — contratos residenciales de 12 meses.
 * Valores predeterminados por sociedad, versionados; nada se aplica a locales
 * comerciales; el canon sale SOLO de una condición contractual validada; el
 * contrato generado es BORRADOR pendiente de validación.
 */

export const POLITICA_CANON = "KEEP_VALIDATED_CURRENT_RENT" as const;
const TIPOS_RESIDENCIALES = ["DEPARTAMENTO"] as const;

// ───────────── Configuración versionada ─────────────

export const ConfigInput = z.object({
  residentialLeaseDefaultTermMonths: z.number().int().min(1).max(120),
  residentialLeaseInitialIncreasePercent: z.string().regex(/^-?\d+(\.\d{1,4})?$/),
  residentialLeaseRentPolicy: z.literal(POLITICA_CANON),
  residentialLeaseAutoAdjustment: z.boolean(),
  alertasDias: z.array(z.number().int().min(0).max(365)).min(1),
  autorizadoPor: z.string().trim().min(3, "Indique quién autorizó el cambio"),
  motivo: z.string().trim().min(3, "Indique el motivo / documento de la decisión"),
});

export async function configuracionVigente(sociedadId: string) {
  return prisma.configuracionContractual.findFirst({ where: { sociedadId }, orderBy: { version: "desc" } });
}

export async function historialConfiguracion(s: Sesion, sociedadId: string) {
  exigir(s, "LEER", sociedadId);
  return prisma.configuracionContractual.findMany({ where: { sociedadId }, orderBy: { version: "desc" } });
}

/** Cada cambio crea una versión nueva (nunca se edita la anterior), con usuario, fecha y autorización. */
export async function nuevaVersionConfiguracion(s: Sesion, sociedadId: string, input: z.input<typeof ConfigInput>) {
  exigir(s, "CONFIGURAR_SOCIEDAD", sociedadId);
  const data = ConfigInput.parse(input);
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"config:" + sociedadId}))`;
    const ultima = await tx.configuracionContractual.findFirst({ where: { sociedadId }, orderBy: { version: "desc" } });
    const c = await tx.configuracionContractual.create({ data: { ...data, sociedadId, version: (ultima?.version ?? 0) + 1, creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } });
    await tx.configuracionAlerta.upsert({ where: { sociedadId_tipo: { sociedadId, tipo: "CONTRATO_VENCIMIENTO" } }, update: { dias: data.alertasDias }, create: { sociedadId, tipo: "CONTRATO_VENCIMIENTO", dias: data.alertasDias } });
    await auditar(tx, s, "CONFIGURACION_CONTRACTUAL_VERSION", "Sociedad", sociedadId, { sociedadId, antes: ultima, despues: c, motivo: `${data.motivo} — autorizado por ${data.autorizadoPor}` });
    return c;
  });
}

// ───────────── Canon validado ─────────────

/** Importes de alquiler observados en planillas importadas para este contrato (importe contractual, sin bonificaciones). */
async function importesPlanilla(contratoId: string) {
  const obls = await prisma.obligacion.findMany({ where: { contratoId, concepto: "ALQUILER", origenDato: "IMPORTADO" }, orderBy: { periodo: "asc" }, select: { periodo: true, importeNeto: true } });
  return obls.map((o) => ({ periodo: o.periodo, monto: d(o.importeNeto.toString()) }));
}

/**
 * Valida administrativamente el último importe del contrato anterior.
 * Exige que quien valida escriba el importe (doble control) y DETIENE la
 * validación si las planillas muestran importes distintos.
 */
export async function validarCanon(s: Sesion, contratoId: string, input: { montoConfirmado: string; motivo: string }) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId }, include: { condiciones: { orderBy: { vigenteDesde: "desc" } } } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.", "NO_ENCONTRADO");
  exigir(s, "VALIDAR_CANON", c.sociedadId, c.propiedadId);
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique el respaldo de la validación (contrato original, recibo, adenda…).");
  const ultima = c.condiciones[0];
  if (!ultima) throw new ErrorNegocio("El contrato no tiene importe registrado.");
  if (!/^\d+(\.\d{1,2})?$/.test(input.montoConfirmado) || !d(input.montoConfirmado).equals(d(ultima.montoAlquiler.toString())))
    throw new ErrorNegocio(`El importe confirmado (${input.montoConfirmado}) no coincide con el último alquiler registrado (${ultima.montoAlquiler.toString()}). Corrija el contrato anterior antes de validar.`, "CANON_DIFERENTE");
  const difs = (await importesPlanilla(contratoId)).filter((x) => !x.monto.equals(d(ultima.montoAlquiler.toString())));
  if (difs.length) throw new ErrorNegocio(`Diferencias entre planillas y contrato: ${difs.map((x) => `${x.periodo}: ${x.monto}`).join(", ")} vs ${ultima.montoAlquiler.toString()}. Se requiere validación administrativa de la diferencia.`, "CANON_CONFLICTO", difs);
  return prisma.$transaction(async (tx) => {
    const act = await tx.condicionContrato.update({ where: { id: ultima.id }, data: { validado: true, validadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId, validadoAt: new Date(), validacionMotivo: input.motivo } });
    await auditar(tx, s, "CANON_VALIDAR", "Contrato", contratoId, { sociedadId: c.sociedadId, despues: { condicionId: ultima.id, monto: ultima.montoAlquiler.toString() }, motivo: input.motivo });
    return act;
  });
}

// ───────────── Candidatos y vista previa ─────────────

export interface Candidato {
  unidadId: string;
  identificador: string;
  tipo: string;
  elegible: boolean;
  motivos: string[]; // por qué no es elegible o qué falta validar
  contratoAnterior: { id: string; codigo: string; estado: string; fechaFin: Date | null; moneda: string } | null;
  inquilinos: { id: string; nombre: string; documento: string | null }[];
  canon: { monto: string; validado: boolean; condicionId: string; vigenteDesde: Date } | null;
  diferenciasPlanilla: { periodo: string; monto: string }[];
  renovacionExistente: { id: string; codigo: string; estado: string } | null;
}

async function contratoActualDeUnidad(unidadId: string) {
  const cs = await prisma.contrato.findMany({
    where: { deletedAt: null, unidades: { some: { unidadId } }, estado: { in: ["VIGENTE", "VENCIDO", "BORRADOR", "PENDIENTE_FIRMA"] }, plantillaVersion: null },
    include: { partes: { where: { rol: "INQUILINO" }, include: { persona: true } }, condiciones: { orderBy: { vigenteDesde: "desc" } }, renovacion: true },
    orderBy: [{ fechaInicio: "desc" }, { createdAt: "desc" }],
  });
  const orden = { VIGENTE: 0, VENCIDO: 1, PENDIENTE_FIRMA: 2, BORRADOR: 3 } as Record<string, number>;
  return cs.sort((a, b) => orden[a.estado] - orden[b.estado])[0] ?? null;
}

export async function candidatosRenovacion(s: Sesion, propiedadId: string): Promise<Candidato[]> {
  const p = await prisma.propiedad.findUnique({ where: { id: propiedadId }, include: { unidades: { where: { deletedAt: null } } } });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.", "NO_ENCONTRADO");
  exigir(s, "LEER", p.sociedadId, p.id);
  const out: Candidato[] = [];
  for (const u of p.unidades.sort((a, b) => a.identificador.localeCompare(b.identificador, "es", { numeric: true }))) {
    const motivos: string[] = [];
    const residencial = (TIPOS_RESIDENCIALES as readonly string[]).includes(u.tipo);
    if (!residencial) motivos.push(`Unidad ${u.tipo.replaceAll("_", " ").toLowerCase()}: las reglas residenciales no se aplican a locales comerciales ni a otros tipos.`);
    const c = residencial ? await contratoActualDeUnidad(u.id) : null;
    if (residencial && !c) motivos.push("Sin inquilino actual (unidad vacante o sin contrato registrado).");
    const ult = c?.condiciones[0];
    const difs = c && ult ? (await importesPlanilla(c.id)).filter((x) => !x.monto.equals(d(ult.montoAlquiler.toString()))) : [];
    if (c && !ult) motivos.push("El contrato actual no tiene importe registrado.");
    if (ult && !ult.validado) motivos.push("Canon actual NO validado administrativamente.");
    if (difs.length) motivos.push("Las planillas muestran importes distintos al contrato: requiere validación administrativa.");
    const ren = c?.renovacion ?? (c ? await prisma.contrato.findFirst({ where: { contratoAnteriorId: c.id } }) : null);
    if (ren) motivos.push(`Ya existe el contrato nuevo ${ren.codigo} (${ren.estado}).`);
    out.push({
      unidadId: u.id, identificador: u.identificador, tipo: u.tipo,
      elegible: residencial && !!c && !!ult && ult.validado && !difs.length && !ren,
      motivos,
      contratoAnterior: c ? { id: c.id, codigo: c.codigo, estado: c.estado, fechaFin: c.fechaFin, moneda: c.moneda } : null,
      inquilinos: c?.partes.map((x) => ({ id: x.persona.id, nombre: x.persona.nombre, documento: x.persona.documentoNumero })) ?? [],
      canon: ult ? { monto: ult.montoAlquiler.toString(), validado: ult.validado, condicionId: ult.id, vigenteDesde: ult.vigenteDesde } : null,
      diferenciasPlanilla: difs.map((x) => ({ periodo: x.periodo, monto: x.monto.toString() })),
      renovacionExistente: ren ? { id: ren.id, codigo: ren.codigo, estado: ren.estado } : null,
    });
  }
  return out;
}

export const BorradorInput = z.object({
  unidadId: z.string(),
  fechaInicio: z.string({ required_error: "Indique la fecha de inicio (no se asume)" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Indique la fecha de inicio (no se asume)"),
  fechaFirma: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  cuentaBancariaId: z.string().optional().nullable(),
  diaVencimiento: z.coerce.number().int().min(1).max(31).optional().nullable(),
  deposito: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().nullable(),
  /** Excepción expresamente aprobada a la fecha de fin calculada. */
  excepcionFin: z.object({ fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), motivo: z.string().trim().min(5), autorizadoPor: z.string().trim().min(3) }).optional().nullable(),
  /** Inicio anterior a hoy: solo con autorización expresa (Actualización contractual 04). */
  autorizacionRetroactiva: z.object({ motivo: z.string().trim().min(5), autorizadoPor: z.string().trim().min(3) }).optional().nullable(),
});

/** Opciones internas cuando el borrador sale de un lote con fecha común. */
export interface OpcionesLote {
  batchId: string;
  acuerdoEvidenciaId: string;
  revisionAprobada: true;
}

export interface VistaPrevia {
  unidad: string;
  contratoAnterior: string;
  inquilinos: string[];
  plazoMeses: number;
  fechaInicio: FechaCalendario;
  fechaFinCalculada: FechaCalendario;
  fechaFin: FechaCalendario;
  dias: number;
  excepcion: boolean;
  fechaFirma: FechaCalendario | null;
  canon: string;
  incrementoPct: string;
  moneda: string;
  cuenta: string | null;
  faltantes: string[];
  bloqueos: string[];
  advertencias: string[];
  configuracionVersion: number | null;
}

async function preparar(s: Sesion, input: z.input<typeof BorradorInput>) {
  const x = BorradorInput.parse(input);
  const u = await prisma.unidad.findUnique({ where: { id: x.unidadId }, include: { propiedad: { include: { sociedad: true } } } });
  if (!u) throw new ErrorNegocio("Unidad no encontrada.", "NO_ENCONTRADO");
  const soc = u.propiedad.sociedad;
  exigir(s, "GESTIONAR_CONTRATOS", soc.id, u.propiedadId);
  const bloqueos: string[] = [];
  const faltantes: string[] = [];
  const advertencias: string[] = [];
  parsear(x.fechaInicio); // valida que la fecha exista
  // Nunca se toma como inicio la fecha de importación ni el ingreso histórico: la fecha llega siempre explícita (no hay valor por defecto).
  const hoyISO = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Asuncion" }).format(new Date());
  if (x.fechaInicio < hoyISO) {
    if (!x.autorizacionRetroactiva) bloqueos.push(`El inicio (${x.fechaInicio}) es anterior a hoy (${hoyISO}): no se aplican fechas retroactivas sin autorización expresa.`);
    else if (!puede(s, "CONFIGURAR_SOCIEDAD", soc.id)) bloqueos.push("La autorización retroactiva requiere un usuario con permiso de configuración de la sociedad.");
    else advertencias.push(`Inicio RETROACTIVO autorizado por ${x.autorizacionRetroactiva.autorizadoPor}: ${x.autorizacionRetroactiva.motivo}.`);
  }
  const cfg = await configuracionVigente(soc.id);
  if (!cfg) bloqueos.push("La sociedad no tiene configuración contractual residencial vigente.");
  if (cfg && cfg.residentialLeaseRentPolicy !== POLITICA_CANON) bloqueos.push(`Política de canon no soportada: ${cfg.residentialLeaseRentPolicy}.`);
  if (cfg && !d(cfg.residentialLeaseInitialIncreasePercent.toString()).isZero()) bloqueos.push("La configuración vigente define un incremento inicial distinto de 0 %: este generador solo conserva el canon validado.");
  if (!(TIPOS_RESIDENCIALES as readonly string[]).includes(u.tipo)) bloqueos.push("Las reglas residenciales no se aplican a locales comerciales ni a otros tipos de unidad.");
  const ant = await contratoActualDeUnidad(u.id);
  if (!ant) bloqueos.push("La unidad no tiene inquilino actual con contrato registrado.");
  const ult = ant?.condiciones[0];
  if (ant && !ult) bloqueos.push("El contrato actual no tiene importe registrado.");
  if (ult && !ult.validado) bloqueos.push("El canon actual no está validado administrativamente.");
  if (ant) {
    const difs = ult ? (await importesPlanilla(ant.id)).filter((y) => !y.monto.equals(d(ult.montoAlquiler.toString()))) : [];
    if (difs.length) bloqueos.push(`Diferencias entre planillas y contrato anterior (${difs.map((y) => `${y.periodo}: ${y.monto}`).join(", ")}): detener y validar administrativamente.`);
    if (await prisma.contrato.findFirst({ where: { contratoAnteriorId: ant.id } })) bloqueos.push("Ya existe un contrato nuevo generado a partir del contrato actual.");
  }
  const plazo = cfg?.residentialLeaseDefaultTermMonths ?? 12;
  const finCalc = calculateLeaseEndDate(x.fechaInicio, plazo);
  let fin = finCalc;
  if (x.excepcionFin) {
    parsear(x.excepcionFin.fechaFin);
    if (x.excepcionFin.fechaFin < x.fechaInicio) bloqueos.push("La fecha de fin de la excepción es anterior al inicio.");
    if (!puede(s, "CONFIGURAR_SOCIEDAD", soc.id)) bloqueos.push("La excepción al plazo requiere un usuario con autorización de configuración de la sociedad.");
    fin = x.excepcionFin.fechaFin;
    advertencias.push(`Fecha de fin por EXCEPCIÓN aprobada por ${x.excepcionFin.autorizadoPor}: ${x.excepcionFin.motivo}.`);
  }
  if (ant?.fechaFin && ant.estado !== "BORRADOR") {
    const finAnt = desdeDate(finEfectivo({ fechaFin: ant.fechaFin, fechaRescision: ant.fechaRescision }));
    if (x.fechaInicio <= finAnt) bloqueos.push(`El inicio (${x.fechaInicio}) se superpone con el contrato actual, que finaliza el ${finAnt}.`);
    if (ant.estado === "VENCIDO") advertencias.push(`El contrato anterior está VENCIDO desde ${finAnt}: el período intermedio queda sin contrato.`);
  }
  if (x.fechaFirma && x.fechaFirma !== x.fechaInicio) advertencias.push(`La fecha de firma (${x.fechaFirma}) difiere del inicio (${x.fechaInicio}): el plazo se computa desde el inicio.`);
  // Cuenta: entre las activas de la sociedad; si hay varias, debe elegirse
  const cuentas = await prisma.cuentaBancaria.findMany({ where: { sociedadId: soc.id, activa: true, deletedAt: null } });
  let cuenta = x.cuentaBancariaId ? cuentas.find((c) => c.id === x.cuentaBancariaId) ?? null : null;
  if (x.cuentaBancariaId && !cuenta) bloqueos.push("La cuenta elegida no es una cuenta activa de la sociedad.");
  if (cuenta && ant && cuenta.moneda !== ant.moneda) bloqueos.push(`La cuenta elegida es en ${cuenta.moneda} y el canon en ${ant.moneda}.`);
  if (!x.cuentaBancariaId) {
    if (cuentas.length === 0) faltantes.push("cuenta bancaria receptora (la sociedad no tiene cuentas activas registradas)");
    else if (cuentas.length > 1) bloqueos.push("La sociedad tiene varias cuentas activas: seleccione explícitamente la receptora.");
    else faltantes.push("cuenta bancaria receptora (seleccionar la única cuenta activa)");
    cuenta = null;
  }
  if (!x.diaVencimiento && !ant?.diaVencimiento) faltantes.push("día de vencimiento mensual");
  if (!x.deposito) faltantes.push("depósito de garantía (verificar individualmente)");
  for (const p of ant?.partes ?? []) {
    if (!p.persona.documentoNumero) faltantes.push(`documento de identidad de ${p.persona.nombre}`);
    if (!p.persona.domicilio) faltantes.push(`domicilio de ${p.persona.nombre}`);
  }
  if (!soc.domicilioFiscal) faltantes.push("domicilio fiscal de la sociedad");
  if (!u.propiedad.direccion) faltantes.push("dirección del edificio");
  const rep = await prisma.representante.findFirst({ where: { sociedadId: soc.id, deletedAt: null, estadoDato: "VALIDADO", OR: [{ vigenteHasta: null }, { vigenteHasta: { gte: aDate(x.fechaFirma ?? x.fechaInicio) } }] } });
  if (!rep) faltantes.push("representante legal / apoderado con poder vigente");

  const vista: VistaPrevia = {
    unidad: `${u.propiedad.codigo} ${u.identificador}`, contratoAnterior: ant?.codigo ?? "—", inquilinos: ant?.partes.map((p) => p.persona.nombre) ?? [],
    plazoMeses: plazo, fechaInicio: x.fechaInicio, fechaFinCalculada: finCalc, fechaFin: fin, dias: diasInclusivos(x.fechaInicio, fin), excepcion: !!x.excepcionFin, fechaFirma: x.fechaFirma ?? null,
    canon: ult?.montoAlquiler.toString() ?? "—", incrementoPct: cfg?.residentialLeaseInitialIncreasePercent.toString() ?? "0", moneda: ant?.moneda ?? "—",
    cuenta: cuenta ? `${cuenta.banco} ${cuenta.numero} (${cuenta.moneda})` : null, faltantes, bloqueos, advertencias, configuracionVersion: cfg?.version ?? null,
  };
  return { x, u, soc, ant, ult, cfg, cuenta, rep, vista };
}

/** Muestra inicio, fin, canon y faltantes ANTES de generar. No escribe nada. */
export async function previsualizarBorrador(s: Sesion, input: z.input<typeof BorradorInput>): Promise<VistaPrevia> {
  return (await preparar(s, input)).vista;
}

/**
 * Genera el contrato nuevo en BORRADOR (pendiente de validación) + documento
 * DOCX provisional. Exige confirmación explícita de la vista previa: el fin
 * confirmado debe coincidir con el calculado (o con la excepción aprobada).
 */
export async function generarBorradorResidencial(s: Sesion, input: z.input<typeof BorradorInput> & { confirmoFechaFin: string }, lote?: OpcionesLote) {
  const { x, u, soc, ant, ult, cfg, cuenta, rep, vista } = await preparar(s, input);
  if (vista.bloqueos.length) throw new ErrorNegocio(`No se puede generar: ${vista.bloqueos.join(" ")}`, "BLOQUEADO", vista.bloqueos);
  if (input.confirmoFechaFin !== vista.fechaFin) throw new ErrorNegocio(`Confirme la vista previa: la fecha de fin calculada es ${vista.fechaFin}.`, "CONFIRMACION");
  const codigo = `${u.propiedad.codigo}-${u.identificador}-R${x.fechaInicio.slice(0, 4)}${x.fechaInicio.slice(5, 7)}`.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (await prisma.contrato.findUnique({ where: { codigo } })) throw new ErrorNegocio(`Ya existe el contrato ${codigo}.`, "DUPLICADO");
  const datos: DatosContrato = {
    codigo,
    sociedad: { razonSocial: soc.razonSocial, ruc: soc.ruc, domicilioFiscal: soc.domicilioFiscal, representante: rep ? `${rep.nombre} (${rep.cargo.toLowerCase()})` : null },
    inquilinos: ant!.partes.map((p) => ({ nombre: p.persona.nombre, documento: p.persona.documentoNumero ? `${p.persona.documentoTipo ?? ""} ${p.persona.documentoNumero}`.trim() : null, domicilio: p.persona.domicilio })),
    edificio: { nombre: u.propiedad.nombre, direccion: u.propiedad.direccion, ciudad: u.propiedad.ciudad },
    unidad: { identificador: u.identificador, piso: u.piso, dormitorios: u.dormitorios },
    plazoMeses: vista.plazoMeses, fechaInicio: x.fechaInicio, fechaFin: vista.fechaFin, fechaFirma: x.fechaFirma ?? null,
    canon: ult!.montoAlquiler.toString(), moneda: ant!.moneda, diaVencimiento: x.diaVencimiento ?? ant!.diaVencimiento ?? null,
    cuenta: cuenta ? { banco: cuenta.banco, numero: cuenta.numero, titular: cuenta.titular, moneda: cuenta.moneda } : null, deposito: x.deposito ?? null,
  };
  const { buffer, faltantes } = await generarDocx(datos);

  const contrato = await prisma.$transaction(async (tx: Tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"unidad:" + u.id}))`;
    const existentes = await tx.contrato.findMany({ where: { deletedAt: null, unidades: { some: { unidadId: u.id } }, fechaInicio: { not: null }, fechaFin: { not: null } }, include: { unidades: true } });
    const sup = detectarSuperposiciones({ estado: "BORRADOR", fechaInicio: aDate(x.fechaInicio), fechaFin: aDate(vista.fechaFin), unidadIds: [u.id] }, existentes.map((e) => ({ id: e.id, codigo: e.codigo, estado: e.estado, fechaInicio: e.fechaInicio!, fechaFin: e.fechaFin!, fechaRescision: e.fechaRescision, unidadIds: e.unidades.map((y) => y.unidadId) })));
    if (sup.length) throw new ErrorNegocio(`Se superpone con ${sup.map((y) => y.codigo).join(", ")}.`, "SUPERPOSICION");
    const c = await tx.contrato.create({
      data: {
        codigo, sociedadId: soc.id, propiedadId: u.propiedadId, estado: "BORRADOR", estadoDato: "PENDIENTE_REVISION", categoriaFiscal: "ALQUILER_RESIDENCIAL",
        fechaFirma: x.fechaFirma ? aDate(x.fechaFirma) : null, fechaInicio: aDate(x.fechaInicio), fechaFin: aDate(vista.fechaFin), plazoMeses: vista.plazoMeses,
        finExcepcion: !!x.excepcionFin, finExcepcionMotivo: x.excepcionFin?.motivo ?? null, finExcepcionAutorizadoPor: x.excepcionFin?.autorizadoPor ?? null,
        moneda: ant!.moneda, diaVencimiento: datos.diaVencimiento, deposito: x.deposito ?? null, cuentaBancariaId: cuenta?.id ?? null,
        reajusteTipo: "SIN_REAJUSTE", reajusteValidado: false, responsabilidadExpensas: ant!.responsabilidadExpensas, responsabilidadServicios: ant!.responsabilidadServicios,
        contratoAnteriorId: ant!.id, plantillaVersion: PLANTILLA_VERSION, configuracionVersion: cfg!.version,
        dateSelectionMode: lote ? "COMUN" : "INDIVIDUAL", dateAgreementStatus: lote ? "ACEPTADO" : "NO_REQUERIDO", dateAgreementEvidenceId: lote?.acuerdoEvidenciaId ?? null,
        legalReviewStatus: lote?.revisionAprobada ? "APROBADA" : "PENDIENTE", revisionJuridicaAprobada: !!lote?.revisionAprobada, contractBatchId: lote?.batchId ?? null,
        canonOrigen: `Condición ${ult!.id} del contrato ${ant!.codigo}, validada el ${ult!.validadoAt?.toISOString().slice(0, 10)}; incremento 0 %.`,
        observaciones: `Generado por la Actualización contractual 03 (config v${cfg!.version}). BORRADOR pendiente de validación: no firmado, no vigente, redacción sujeta a revisión jurídica.`,
        unidades: { create: { unidadId: u.id } },
        partes: { create: ant!.partes.map((p) => ({ personaId: p.personaId, rol: "INQUILINO" as const })) },
        condiciones: { create: { vigenteDesde: aDate(x.fechaInicio), montoAlquiler: ult!.montoAlquiler, motivo: "INICIAL", referencia: `Canon validado del contrato ${ant!.codigo} (sin incremento)`, creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } },
      },
    });
    await tx.contratoFechaVersion.create({ data: { contratoId: c.id, version: 1, fechaInicio: aDate(x.fechaInicio), fechaFin: aDate(vista.fechaFin), fechaFirma: x.fechaFirma ? aDate(x.fechaFirma) : null, plazoMeses: vista.plazoMeses, modo: lote ? "COMUN" : "INDIVIDUAL", motivo: lote ? `Fecha común del lote ${lote.batchId}` : "Fecha individual al generar el borrador", creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } });
    if (x.excepcionFin) await auditar(tx, s, "CONTRATO_EXCEPCION_PLAZO", "Contrato", c.id, { sociedadId: soc.id, despues: { fechaFinCalculada: vista.fechaFinCalculada, fechaFin: vista.fechaFin }, motivo: `${x.excepcionFin.motivo} — autorizado por ${x.excepcionFin.autorizadoPor}` });
    await auditar(tx, s, "CONTRATO_GENERAR_BORRADOR", "Contrato", c.id, { sociedadId: soc.id, despues: { codigo, fechaInicio: x.fechaInicio, fechaFin: vista.fechaFin, canon: ult!.montoAlquiler.toString(), contratoAnterior: ant!.codigo, faltantes } });
    return c;
  });
  const { documento } = await subirDocumento(s, { sociedadId: soc.id, propiedadId: u.propiedadId, entidad: "CONTRATO", entidadId: contrato.id, tipo: "CONTRATO_ALQUILER", titulo: `BORRADOR ${codigo} — ${PLANTILLA_VERSION} (no firmado)`, observaciones: `Datos pendientes: ${faltantes.join("; ")}` }, `${codigo}-BORRADOR.docx`, buffer);
  await prisma.contrato.update({ where: { id: contrato.id }, data: { documentoId: documento.id } });
  return { contrato, documentoId: documento.id, faltantes, vista };
}

// ───────────── Procedimiento de validación ─────────────

export type PasoValidacion = "INICIO_CONFIRMADO" | "DEPOSITO_VERIFICADO" | "REVISION_JURIDICA" | "CUENTA" | "FIRMADO";

/** Registra un paso del procedimiento. Ninguno activa el contrato por sí solo. */
export async function registrarPasoValidacion(s: Sesion, contratoId: string, paso: PasoValidacion, input: { motivo: string; deposito?: string | null; cuentaBancariaId?: string | null; archivoFirmado?: { nombre: string; buffer: Buffer } }) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.", "NO_ENCONTRADO");
  exigir(s, "GESTIONAR_CONTRATOS", c.sociedadId, c.propiedadId);
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique el respaldo del paso de validación.");
  if (c.estado !== "BORRADOR" && c.estado !== "PENDIENTE_FIRMA") throw new ErrorNegocio(`El contrato está ${c.estado}.`);
  const data: Record<string, unknown> = {};
  if (paso === "INICIO_CONFIRMADO") data.inicioConfirmado = true;
  if (paso === "DEPOSITO_VERIFICADO") {
    if (!input.deposito && !c.deposito) throw new ErrorNegocio("Indique el importe del depósito verificado (o 0 si no corresponde).");
    if (input.deposito && !/^\d+(\.\d{1,2})?$/.test(input.deposito)) throw new ErrorNegocio("Importe de depósito inválido.");
    data.depositoVerificado = true;
    if (input.deposito) data.deposito = input.deposito;
  }
  if (paso === "REVISION_JURIDICA") { exigir(s, "CONFIGURAR_SOCIEDAD", c.sociedadId); data.revisionJuridicaAprobada = true; data.legalReviewStatus = "APROBADA"; }
  if (paso === "CUENTA") {
    const cu = await prisma.cuentaBancaria.findUnique({ where: { id: input.cuentaBancariaId ?? "" } });
    if (!cu || cu.sociedadId !== c.sociedadId || !cu.activa || cu.deletedAt) throw new ErrorNegocio("Seleccione una cuenta activa de la sociedad.");
    if (cu.moneda !== c.moneda) throw new ErrorNegocio(`La cuenta es en ${cu.moneda} y el contrato en ${c.moneda}.`);
    data.cuentaBancariaId = cu.id;
  }
  if (paso === "FIRMADO") {
    if (!c.inicioConfirmado || !c.depositoVerificado || !c.revisionJuridicaAprobada) throw new ErrorNegocio("Antes de incorporar el contrato firmado: confirmar inicio, verificar depósito y aprobar la revisión jurídica.");
    if (!input.archivoFirmado) throw new ErrorNegocio("Adjunte el contrato firmado.");
    const { documento } = await subirDocumento(s, { sociedadId: c.sociedadId, propiedadId: c.propiedadId, entidad: "CONTRATO", entidadId: c.id, tipo: "CONTRATO_ALQUILER", titulo: `Contrato ${c.codigo} FIRMADO` }, input.archivoFirmado.nombre, input.archivoFirmado.buffer);
    data.documentoFirmadoId = documento.id;
  }
  return prisma.$transaction(async (tx) => {
    const act = await tx.contrato.update({ where: { id: contratoId }, data });
    await auditar(tx, s, "CONTRATO_VALIDACION_PASO", "Contrato", contratoId, { sociedadId: c.sociedadId, despues: { paso, ...data }, motivo: input.motivo });
    return act;
  });
}

export async function obtenerContrato(s: Sesion, id: string) {
  const c = await prisma.contrato.findFirst({
    where: { id, deletedAt: null },
    include: { propiedad: { select: { codigo: true, nombre: true } }, unidades: { include: { unidad: true } }, partes: { include: { persona: true } }, condiciones: { orderBy: { vigenteDesde: "asc" } }, cuentaBancaria: true, versionesFecha: { orderBy: { version: "asc" } }, contractBatch: { select: { id: true, fechaComunPropuesta: true } }, contratoAnterior: { select: { id: true, codigo: true, estado: true } }, renovacion: { select: { id: true, codigo: true, estado: true } } },
  });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.", "NO_ENCONTRADO");
  exigir(s, "LEER", c.sociedadId, c.propiedadId);
  return c;
}
