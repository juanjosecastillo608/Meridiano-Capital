import { prisma, ErrorNegocio } from "../db";
import { exigir, puede, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { subirDocumento } from "./documentos";
import { candidatosRenovacion, generarBorradorResidencial } from "./renovacion";
import { calculateLeaseEndDate, aDate, desdeDate, parsear, type FechaCalendario } from "../../domain/plazos";
import { alertaVencimiento } from "../../domain/contratos";
import { hoyAsuncion, diferenciaDias } from "../../domain/periodo";

/**
 * Actualización contractual 04 — fechas individuales y fechas comunes.
 * - Cada contrato tiene sus propias fechas (inicio, fin, firma) y su historial de versiones.
 * - La fecha común de un lote es una PROPUESTA: solo se aplica a los contratos con acuerdo
 *   individual del inquilino (con evidencia) y revisión jurídica aprobada; el resto se excluye.
 * - La aprobación definitiva de fechas valida: inicio, fin = plazo aprobado, inquilino
 *   identificado, canon validado, revisión jurídica y acuerdo (si es fecha común).
 */

const hoyISO = () => desdeDate(hoyAsuncion());
const usuario = (s: Sesion) => (s.usuarioId === "sistema" ? null : s.usuarioId);

// ───────────── Edición individual (con versiones) ─────────────

export async function editarFechasContrato(s: Sesion, contratoId: string, input: { fechaInicio: FechaCalendario; fechaFirma?: FechaCalendario | null; motivo: string; autorizacionRetroactiva?: { motivo: string; autorizadoPor: string } | null }) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId }, include: { unidades: true, versionesFecha: { orderBy: { version: "desc" }, take: 1 } } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.", "NO_ENCONTRADO");
  exigir(s, "GESTIONAR_CONTRATOS", c.sociedadId, c.propiedadId);
  if (c.estado !== "BORRADOR") throw new ErrorNegocio("Solo se editan fechas de contratos en BORRADOR.");
  if (!c.plazoMeses) throw new ErrorNegocio("El contrato no tiene plazo aprobado.");
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique el motivo del cambio de fechas.");
  parsear(input.fechaInicio);
  if (input.fechaFirma) parsear(input.fechaFirma);
  if (input.fechaInicio < hoyISO()) {
    if (!input.autorizacionRetroactiva?.motivo || !input.autorizacionRetroactiva.autorizadoPor) throw new ErrorNegocio("No se aplican fechas retroactivas sin autorización expresa.", "RETROACTIVO");
    exigir(s, "CONFIGURAR_SOCIEDAD", c.sociedadId);
  }
  const fin = calculateLeaseEndDate(input.fechaInicio, c.plazoMeses);
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"unidad:" + c.unidades[0].unidadId}))`;
    const otros = await tx.contrato.findMany({ where: { id: { not: c.id }, deletedAt: null, estado: { in: ["VIGENTE", "VENCIDO", "PENDIENTE_FIRMA"] }, unidades: { some: { unidadId: { in: c.unidades.map((u) => u.unidadId) } } }, fechaInicio: { not: null }, fechaFin: { not: null } } });
    const choca = otros.find((o) => aDate(input.fechaInicio) <= (o.fechaRescision ?? o.fechaFin!) && o.fechaInicio! <= aDate(fin));
    if (choca) throw new ErrorNegocio(`Las nuevas fechas se superponen con el contrato ${choca.codigo}.`, "SUPERPOSICION");
    const version = (c.versionesFecha[0]?.version ?? 0) + 1;
    await tx.contratoFechaVersion.create({ data: { contratoId: c.id, version, fechaInicio: aDate(input.fechaInicio), fechaFin: aDate(fin), fechaFirma: input.fechaFirma ? aDate(input.fechaFirma) : null, plazoMeses: c.plazoMeses, modo: "INDIVIDUAL", motivo: input.autorizacionRetroactiva ? `${input.motivo} — retroactivo autorizado por ${input.autorizacionRetroactiva.autorizadoPor}` : input.motivo, creadoPorId: usuario(s) } });
    // Cambiar fechas invalida la aprobación previa, el acuerdo de fecha común y la confirmación de inicio.
    const act = await tx.contrato.update({ where: { id: c.id }, data: { fechaInicio: aDate(input.fechaInicio), fechaFin: aDate(fin), fechaFirma: input.fechaFirma ? aDate(input.fechaFirma) : null, finExcepcion: false, dateSelectionMode: "INDIVIDUAL", dateAgreementStatus: "NO_REQUERIDO", dateApprovedBy: null, dateApprovedAt: null, inicioConfirmado: false } });
    await tx.condicionContrato.updateMany({ where: { contratoId: c.id, motivo: "INICIAL" }, data: { vigenteDesde: aDate(input.fechaInicio) } });
    await auditar(tx, s, "CONTRATO_FECHAS_EDITAR", "Contrato", c.id, { sociedadId: c.sociedadId, antes: { fechaInicio: c.fechaInicio, fechaFin: c.fechaFin, fechaFirma: c.fechaFirma, version: version - 1 }, despues: { fechaInicio: input.fechaInicio, fechaFin: fin, fechaFirma: input.fechaFirma, version }, motivo: input.motivo });
    return act;
  });
}

// ───────────── Aprobación definitiva de fechas ─────────────

export async function motivosNoAprobable(contratoId: string): Promise<string[]> {
  const c = await prisma.contrato.findUniqueOrThrow({ where: { id: contratoId }, include: { partes: { where: { rol: "INQUILINO" }, include: { persona: true } }, condiciones: true, contratoAnterior: { include: { condiciones: { orderBy: { vigenteDesde: "desc" }, take: 1 } } } } });
  const m: string[] = [];
  if (!c.fechaInicio) m.push("Falta la fecha de inicio.");
  if (c.fechaInicio && c.plazoMeses && !c.finExcepcion && (!c.fechaFin || desdeDate(c.fechaFin) !== calculateLeaseEndDate(desdeDate(c.fechaInicio), c.plazoMeses))) m.push(`La fecha final no coincide con el plazo aprobado de ${c.plazoMeses} meses.`);
  if (!c.plazoMeses) m.push("Falta el plazo aprobado.");
  if (!c.partes.length || c.partes.some((p) => !p.persona.documentoNormalizado)) m.push("Inquilino no identificado (falta CI/RUC).");
  const canonValidado = c.contratoAnterior ? !!c.contratoAnterior.condiciones[0]?.validado : c.condiciones.some((x) => x.validado);
  if (!canonValidado) m.push("El canon no fue validado.");
  if (c.legalReviewStatus !== "APROBADA") m.push("Falta la revisión jurídica obligatoria.");
  if (c.dateSelectionMode === "COMUN" && (c.dateAgreementStatus !== "ACEPTADO" || !c.dateAgreementEvidenceId)) m.push("Fecha común sin acuerdo del inquilino registrado.");
  return m;
}

export async function aprobarFechasContrato(s: Sesion, contratoId: string, motivo: string) {
  const c = await prisma.contrato.findUnique({ where: { id: contratoId } });
  if (!c) throw new ErrorNegocio("Contrato no encontrado.", "NO_ENCONTRADO");
  exigir(s, "CONFIGURAR_SOCIEDAD", c.sociedadId);
  if (!motivo?.trim()) throw new ErrorNegocio("Indique el respaldo de la aprobación.");
  const m = await motivosNoAprobable(contratoId);
  if (m.length) throw new ErrorNegocio(`No se puede aprobar: ${m.join(" ")}`, "NO_APROBABLE", m);
  return prisma.$transaction(async (tx) => {
    const act = await tx.contrato.update({ where: { id: contratoId }, data: { dateApprovedBy: usuario(s) ?? "sistema", dateApprovedAt: new Date(), inicioConfirmado: true } });
    await auditar(tx, s, "CONTRATO_FECHAS_APROBAR", "Contrato", contratoId, { sociedadId: c.sociedadId, despues: { fechaInicio: c.fechaInicio, fechaFin: c.fechaFin, modo: c.dateSelectionMode }, motivo });
    return act;
  });
}

// ───────────── Lote con fecha común (ContractBatch) ─────────────

export async function crearLote(s: Sesion, input: { propiedadId: string; unidadIds: string[]; fechaComun: FechaCalendario; motivo: string; autorizacionRetroactiva?: { motivo: string; autorizadoPor: string } | null }) {
  const prop = await prisma.propiedad.findUnique({ where: { id: input.propiedadId } });
  if (!prop) throw new ErrorNegocio("Propiedad no encontrada.", "NO_ENCONTRADO");
  exigir(s, "GESTIONAR_CONTRATOS", prop.sociedadId, prop.id);
  if (!input.unidadIds.length) throw new ErrorNegocio("Seleccione al menos una unidad.");
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique el motivo de la fecha común.");
  parsear(input.fechaComun);
  if (input.fechaComun < hoyISO() && !(input.autorizacionRetroactiva && puede(s, "CONFIGURAR_SOCIEDAD", prop.sociedadId))) throw new ErrorNegocio("La fecha común es anterior a hoy: requiere autorización retroactiva expresa.", "RETROACTIVO");
  const cfg = await prisma.configuracionContractual.findFirst({ where: { sociedadId: prop.sociedadId }, orderBy: { version: "desc" } });
  if (!cfg) throw new ErrorNegocio("La sociedad no tiene configuración contractual residencial.");
  const fin = calculateLeaseEndDate(input.fechaComun, cfg.residentialLeaseDefaultTermMonths);
  const cands = await candidatosRenovacion(s, prop.id);
  return prisma.$transaction(async (tx) => {
    const b = await tx.contractBatch.create({ data: { sociedadId: prop.sociedadId, propiedadId: prop.id, fechaComunPropuesta: aDate(input.fechaComun), plazoMeses: cfg.residentialLeaseDefaultTermMonths, motivo: input.autorizacionRetroactiva ? `${input.motivo} — retroactivo autorizado por ${input.autorizacionRetroactiva.autorizadoPor}` : input.motivo, creadoPorId: usuario(s) } });
    for (const uid of [...new Set(input.unidadIds)]) {
      const c = cands.find((x) => x.unidadId === uid);
      if (!c) throw new ErrorNegocio("Alguna unidad no pertenece al edificio.");
      const ant = c.contratoAnterior ? await tx.contrato.findUnique({ where: { id: c.contratoAnterior.id } }) : null;
      await tx.contractBatchItem.create({
        data: {
          batchId: b.id, unidadId: uid, contratoAnteriorId: ant?.id ?? null, inicioAnterior: ant?.fechaInicio ?? null, finAnterior: ant?.fechaFin ?? null,
          inicioPropuesto: aDate(input.fechaComun), finPropuesto: aDate(fin),
          estado: c.elegible ? "PENDIENTE" : "EXCLUIDO", motivoExclusion: c.elegible ? null : c.motivos.join(" "),
        },
      });
    }
    await auditar(tx, s, "LOTE_CREAR", "ContractBatch", b.id, { sociedadId: prop.sociedadId, despues: { fechaComun: input.fechaComun, fin, unidades: input.unidadIds.length }, motivo: input.motivo });
    return b;
  });
}

async function itemConAcceso(s: Sesion, itemId: string, permiso: Parameters<typeof exigir>[1]) {
  const it = await prisma.contractBatchItem.findUnique({ where: { id: itemId }, include: { batch: true } });
  if (!it) throw new ErrorNegocio("Ítem no encontrado.", "NO_ENCONTRADO");
  exigir(s, permiso, it.batch.sociedadId, it.batch.propiedadId);
  if (it.batch.estado !== "PREPARACION") throw new ErrorNegocio("El lote ya no está en preparación.");
  if (it.estado === "EXCLUIDO" && it.motivoExclusion && !it.motivoExclusion.startsWith("Acuerdo")) throw new ErrorNegocio("Unidad excluida del lote.");
  return it;
}

/** Registra el acuerdo INDIVIDUAL del inquilino con la fecha común (con evidencia si acepta). */
export async function registrarAcuerdo(s: Sesion, itemId: string, input: { acepta: boolean; motivo: string; evidencia?: { nombre: string; buffer: Buffer } }) {
  const it = await itemConAcceso(s, itemId, "GESTIONAR_CONTRATOS");
  if (!input.motivo?.trim()) throw new ErrorNegocio("Describa el acuerdo (medio, fecha, quién lo recibió).");
  if (input.acepta && !input.evidencia) throw new ErrorNegocio("Adjunte la evidencia del acuerdo del inquilino (nota firmada, mensaje, acta).");
  const doc = input.evidencia ? (await subirDocumento(s, { sociedadId: it.batch.sociedadId, propiedadId: it.batch.propiedadId, entidad: "LOTE_CONTRATOS", entidadId: it.id, tipo: "OTRO", titulo: `Acuerdo de fecha común — lote ${it.batchId.slice(-6)}`, sensible: false }, input.evidencia.nombre, input.evidencia.buffer)).documento : null;
  return prisma.$transaction(async (tx) => {
    const act = await tx.contractBatchItem.update({ where: { id: itemId }, data: { acuerdoEstado: input.acepta ? "ACEPTADO" : "RECHAZADO", acuerdoEvidenciaId: doc?.id ?? null, acuerdoRegistradoPorId: usuario(s), acuerdoAt: new Date(), acuerdoMotivo: input.motivo } });
    await auditar(tx, s, "LOTE_ACUERDO", "ContractBatchItem", itemId, { sociedadId: it.batch.sociedadId, despues: { acepta: input.acepta, evidencia: doc?.id }, motivo: input.motivo });
    return act;
  });
}

export async function registrarRevisionJuridica(s: Sesion, itemId: string, input: { aprobada: boolean; motivo: string }) {
  const it = await itemConAcceso(s, itemId, "CONFIGURAR_SOCIEDAD");
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique el dictamen / referencia de la revisión jurídica.");
  return prisma.$transaction(async (tx) => {
    const act = await tx.contractBatchItem.update({ where: { id: itemId }, data: { revisionEstado: input.aprobada ? "APROBADA" : "OBSERVADA", revisionMotivo: input.motivo, revisionPorId: usuario(s), revisionAt: new Date() } });
    await auditar(tx, s, "LOTE_REVISION_JURIDICA", "ContractBatchItem", itemId, { sociedadId: it.batch.sociedadId, despues: { aprobada: input.aprobada }, motivo: input.motivo });
    return act;
  });
}

/**
 * Confirma el lote: autoriza solo los ítems con acuerdo ACEPTADO (con evidencia) y
 * revisión APROBADA; excluye el resto con su motivo; y genera los borradores
 * INDIVIDUALMENTE (un fallo en una unidad no afecta a las demás).
 */
export async function confirmarLote(s: Sesion, batchId: string, input: { cuentaBancariaId?: string | null; diaVencimiento?: number | null; fechaFirma?: FechaCalendario | null; autorizacionRetroactiva?: { motivo: string; autorizadoPor: string } | null }) {
  const b = await prisma.contractBatch.findUnique({ where: { id: batchId }, include: { items: true } });
  if (!b) throw new ErrorNegocio("Lote no encontrado.", "NO_ENCONTRADO");
  exigir(s, "CONFIGURAR_SOCIEDAD", b.sociedadId, b.propiedadId);
  if (b.estado !== "PREPARACION") throw new ErrorNegocio("El lote ya fue confirmado o cancelado.");
  const fechaComun = desdeDate(b.fechaComunPropuesta);
  const resultado: { unidadId: string; estado: string; detalle: string; contratoId?: string }[] = [];
  for (const it of b.items) {
    if (it.estado === "EXCLUIDO") { resultado.push({ unidadId: it.unidadId, estado: "EXCLUIDO", detalle: it.motivoExclusion ?? "" }); continue; }
    const falta = [it.acuerdoEstado !== "ACEPTADO" || !it.acuerdoEvidenciaId ? "sin acuerdo del inquilino registrado" : null, it.revisionEstado !== "APROBADA" ? "sin revisión jurídica aprobada" : null].filter(Boolean);
    if (falta.length) {
      await prisma.contractBatchItem.update({ where: { id: it.id }, data: { estado: "EXCLUIDO", motivoExclusion: `Acuerdo/revisión: ${falta.join(", ")}` } });
      resultado.push({ unidadId: it.unidadId, estado: "EXCLUIDO", detalle: falta.join(", ") });
      continue;
    }
    await prisma.contractBatchItem.update({ where: { id: it.id }, data: { estado: "AUTORIZADO" } });
    try {
      const r = await generarBorradorResidencial(s, { unidadId: it.unidadId, fechaInicio: fechaComun, fechaFirma: input.fechaFirma ?? null, cuentaBancariaId: input.cuentaBancariaId ?? null, diaVencimiento: input.diaVencimiento ?? null, autorizacionRetroactiva: input.autorizacionRetroactiva ?? null, confirmoFechaFin: desdeDate(it.finPropuesto) }, { batchId: b.id, acuerdoEvidenciaId: it.acuerdoEvidenciaId!, revisionAprobada: true });
      await prisma.contractBatchItem.update({ where: { id: it.id }, data: { estado: "GENERADO", contratoGeneradoId: r.contrato.id } });
      resultado.push({ unidadId: it.unidadId, estado: "GENERADO", detalle: r.contrato.codigo, contratoId: r.contrato.id });
    } catch (e) {
      if (!(e instanceof ErrorNegocio)) throw e;
      await prisma.contractBatchItem.update({ where: { id: it.id }, data: { estado: "EXCLUIDO", motivoExclusion: `Generación: ${e.message}` } });
      resultado.push({ unidadId: it.unidadId, estado: "EXCLUIDO", detalle: e.message });
    }
  }
  await prisma.$transaction(async (tx) => {
    await tx.contractBatch.update({ where: { id: batchId }, data: { estado: "CONFIRMADO", confirmadoPorId: usuario(s), confirmadoAt: new Date() } });
    await auditar(tx, s, "LOTE_CONFIRMAR", "ContractBatch", batchId, { sociedadId: b.sociedadId, despues: resultado });
  });
  return resultado;
}

export async function obtenerLote(s: Sesion, batchId: string) {
  const b = await prisma.contractBatch.findUnique({ where: { id: batchId }, include: { items: { orderBy: { createdAt: "asc" } } } });
  if (!b) throw new ErrorNegocio("Lote no encontrado.", "NO_ENCONTRADO");
  exigir(s, "LEER", b.sociedadId, b.propiedadId);
  const unidades = await prisma.unidad.findMany({ where: { id: { in: b.items.map((i) => i.unidadId) } }, select: { id: true, identificador: true } });
  return { lote: b, nombreUnidad: Object.fromEntries(unidades.map((u) => [u.id, u.identificador])) };
}

export async function listarLotes(s: Sesion) {
  return prisma.contractBatch.findMany({ where: filtroSociedad(s), orderBy: { createdAt: "desc" }, include: { _count: { select: { items: true } } } });
}

// ───────────── Calendario de vencimientos ─────────────

export interface EventoCalendario {
  fecha: FechaCalendario;
  tipo: "VENCIMIENTO" | "RECORDATORIO_90" | "RECORDATORIO_60" | "RECORDATORIO_30";
  contratoId: string;
  codigo: string;
  edificio: string;
  unidades: string;
  estado: string;
}

/** Vencimientos de cada contrato (fecha final INDIVIDUAL) y sus recordatorios a 90/60/30 días. */
export async function calendarioVencimientos(s: Sesion, f: { sociedadId?: string; propiedadId?: string; desde: FechaCalendario; hasta: FechaCalendario }) {
  if (f.sociedadId) exigir(s, "LEER", f.sociedadId);
  const cs = await prisma.contrato.findMany({
    where: { deletedAt: null, fechaFin: { not: null }, estado: { in: ["BORRADOR", "PENDIENTE_FIRMA", "VIGENTE", "VENCIDO"] }, ...filtroSociedad(s), ...(f.sociedadId ? { sociedadId: f.sociedadId } : {}), ...(f.propiedadId ? { propiedadId: f.propiedadId } : {}) },
    include: { propiedad: { select: { codigo: true } }, unidades: { include: { unidad: { select: { identificador: true } } } } },
  });
  const ev: EventoCalendario[] = [];
  for (const c of cs) {
    const fin = desdeDate(c.fechaFin!);
    const base = { contratoId: c.id, codigo: c.codigo, edificio: c.propiedad.codigo, unidades: c.unidades.map((u) => u.unidad.identificador).join(", "), estado: c.estado };
    ev.push({ ...base, fecha: fin, tipo: "VENCIMIENTO" });
    for (const d of [90, 60, 30] as const) {
      const dt = new Date(c.fechaFin!.getTime() - d * 86_400_000);
      ev.push({ ...base, fecha: desdeDate(dt), tipo: `RECORDATORIO_${d}` });
    }
  }
  const hoy = hoyAsuncion();
  return {
    eventos: ev.filter((e) => e.fecha >= f.desde && e.fecha <= f.hasta).sort((a, b) => a.fecha.localeCompare(b.fecha)),
    proximos: cs.map((c) => ({ id: c.id, codigo: c.codigo, edificio: c.propiedad.codigo, fin: c.fechaFin!, alerta: alertaVencimiento(c.fechaFin!, hoy, [90, 60, 30]), dias: diferenciaDias(hoy, c.fechaFin!) })).sort((a, b) => a.dias - b.dias),
  };
}
