import { d, Decimal } from "./money";
import { diferenciaDias, inicioPeriodo, finPeriodo } from "./periodo";

export type EstadoContrato =
  | "BORRADOR"
  | "PENDIENTE_FIRMA"
  | "VIGENTE"
  | "VENCIDO"
  | "RENOVADO"
  | "RESCINDIDO"
  | "FINALIZADO";

/** Estados que "ocupan" jurídicamente una unidad y no pueden superponerse. */
export const ESTADOS_QUE_OCUPAN: EstadoContrato[] = ["PENDIENTE_FIRMA", "VIGENTE", "VENCIDO"];

export interface ContratoRango {
  id?: string;
  codigo?: string;
  estado: EstadoContrato;
  fechaInicio: Date;
  fechaFin: Date;
  fechaRescision?: Date | null;
  unidadIds: string[];
}

/** Fin efectivo: la rescisión anticipada acorta el rango. */
export function finEfectivo(c: Pick<ContratoRango, "fechaFin" | "fechaRescision">): Date {
  return c.fechaRescision && c.fechaRescision < c.fechaFin ? c.fechaRescision : c.fechaFin;
}

export interface Superposicion {
  contratoId?: string;
  codigo?: string;
  unidadId: string;
}

/**
 * RN-CON-01: no puede haber dos contratos activos para la misma unidad con
 * rangos de fechas superpuestos (extremos inclusive).
 */
export function detectarSuperposiciones(nuevo: ContratoRango, existentes: ContratoRango[]): Superposicion[] {
  if (!ESTADOS_QUE_OCUPAN.includes(nuevo.estado) && nuevo.estado !== "BORRADOR") return [];
  const out: Superposicion[] = [];
  for (const e of existentes) {
    if (e.id && e.id === nuevo.id) continue;
    if (!ESTADOS_QUE_OCUPAN.includes(e.estado)) continue;
    const solapa = nuevo.fechaInicio <= finEfectivo(e) && e.fechaInicio <= finEfectivo(nuevo);
    if (!solapa) continue;
    for (const u of nuevo.unidadIds) {
      if (e.unidadIds.includes(u)) out.push({ contratoId: e.id, codigo: e.codigo, unidadId: u });
    }
  }
  return out;
}

export function validarFechasContrato(c: { fechaInicio: Date; fechaFin: Date; diaVencimiento: number }): string[] {
  const errores: string[] = [];
  if (c.fechaFin < c.fechaInicio) errores.push("La fecha de finalización es anterior a la de inicio.");
  if (!Number.isInteger(c.diaVencimiento) || c.diaVencimiento < 1 || c.diaVencimiento > 31)
    errores.push("El día de vencimiento debe estar entre 1 y 31.");
  return errores;
}

/** Plazo contractual en meses completos (informativo). */
export function plazoMeses(inicio: Date, fin: Date): number {
  // fin inclusive: 2026-01-01 → 2026-12-31 = 12 meses
  const finExclusivo = new Date(fin.getTime() + 86_400_000);
  let meses = (finExclusivo.getUTCFullYear() - inicio.getUTCFullYear()) * 12 + (finExclusivo.getUTCMonth() - inicio.getUTCMonth());
  if (finExclusivo.getUTCDate() < inicio.getUTCDate()) meses -= 1;
  return meses;
}

// ─────────────── Alertas de vencimiento (no confundir con estado jurídico) ───────────────

// 90, 60, 30 días antes y el día del vencimiento (Actualización contractual 03). Son avisos internos: no modifican el contrato.
export const ALERTAS_DEFAULT = [90, 60, 30, 0];

export interface AlertaVencimiento {
  diasRestantes: number;
  umbral: number | null; // el menor umbral alcanzado, null si no alcanza ninguno
  vencido: boolean;
}

export function alertaVencimiento(fin: Date, hoy: Date, umbrales: number[] = ALERTAS_DEFAULT): AlertaVencimiento {
  const dias = diferenciaDias(hoy, fin);
  const alcanzados = [...umbrales].sort((a, b) => a - b).filter((u) => dias <= u);
  return { diasRestantes: dias, umbral: dias < 0 ? null : (alcanzados[0] ?? null), vencido: dias < 0 };
}

/**
 * Estado jurídico sugerido por fechas. Solo transiciona VIGENTE → VENCIDO
 * (plazo cumplido sin acción). RENOVADO/RESCINDIDO/FINALIZADO requieren acción
 * explícita de un usuario.
 */
export function estadoPorFechas(estado: EstadoContrato, fin: Date, hoy: Date): EstadoContrato {
  if (estado === "VIGENTE" && fin < hoy) return "VENCIDO";
  return estado;
}

// ─────────────── Historial de importes ───────────────

export interface Condicion {
  vigenteDesde: Date;
  montoAlquiler: Decimal | string;
}

/** Importe vigente al inicio del período: última condición con vigenteDesde <= inicio. */
export function montoVigente(condiciones: Condicion[], periodo: string): Decimal | null {
  const ini = inicioPeriodo(periodo);
  const fin = finPeriodo(periodo);
  const ordenadas = [...condiciones].sort((a, b) => a.vigenteDesde.getTime() - b.vigenteDesde.getTime());
  let vigente: Condicion | null = null;
  for (const c of ordenadas) if (c.vigenteDesde <= ini) vigente = c;
  // Si el contrato empieza a mitad de mes, la primera condición rige el período.
  if (!vigente) vigente = ordenadas.find((c) => c.vigenteDesde <= fin) ?? null;
  return vigente ? d(vigente.montoAlquiler) : null;
}

// ─────────────── Reajuste ───────────────

export interface ReglaReajuste {
  tipo: "SIN_REAJUSTE" | "PORCENTAJE_FIJO" | "INDICE" | "MANUAL";
  validado: boolean;
  porcentaje?: Decimal | string | null;
  frecuenciaMeses?: number | null;
}

/**
 * RN-CON-05: el reajuste automático solo se calcula si la fórmula está
 * registrada y validada. Índices externos (IPC, etc.) no se consultan
 * automáticamente: devuelve null con motivo.
 */
export function calcularReajuste(base: Decimal, regla: ReglaReajuste): { monto: Decimal | null; motivo?: string } {
  if (!regla.validado) return { monto: null, motivo: "Fórmula de reajuste no validada." };
  if (regla.tipo === "PORCENTAJE_FIJO" && regla.porcentaje != null) {
    return { monto: base.times(d(1).plus(d(regla.porcentaje).div(100))) };
  }
  if (regla.tipo === "SIN_REAJUSTE") return { monto: base };
  return { monto: null, motivo: `Reajuste tipo ${regla.tipo} requiere carga manual del valor.` };
}
