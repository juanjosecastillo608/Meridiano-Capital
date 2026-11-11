import { d, sumar, Decimal, type MonedaCodigo } from "./money";
import type { Concepto } from "./obligaciones";

export interface ObligacionAbierta {
  id: string;
  concepto: Concepto;
  periodo: string;
  fechaVencimiento: Date;
  moneda: MonedaCodigo;
  saldo: Decimal;
  estado: string;
}

export interface Aplicacion {
  obligacionId: string;
  importe: Decimal;
}

export interface ResultadoAplicacion {
  aplicaciones: Aplicacion[];
  saldoAFavor: Decimal; // anticipo / pago en exceso
  errores: string[];
}

/**
 * Orden de imputación automática [EXTENSION — PD-04, a confirmar]:
 * 1) vencimiento más antiguo primero; 2) dentro del mismo vencimiento,
 * ALQUILER antes que EXPENSAS y el resto. El usuario siempre puede imputar
 * manualmente.
 */
export const PRIORIDAD_CONCEPTO: Concepto[] = ["ALQUILER", "EXPENSAS", "SERVICIOS", "REPARACION_IMPUTABLE", "PENALIDAD", "INTERESES", "OTRO"];

export function ordenarParaImputar(obls: ObligacionAbierta[]): ObligacionAbierta[] {
  return [...obls].sort(
    (a, b) =>
      a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime() ||
      PRIORIDAD_CONCEPTO.indexOf(a.concepto) - PRIORIDAD_CONCEPTO.indexOf(b.concepto),
  );
}

const imputables = (o: ObligacionAbierta) => (o.estado === "PENDIENTE" || o.estado === "PARCIAL") && o.saldo.greaterThan(0);

/**
 * Distribuye un pago entre obligaciones.
 * - Si `manual` viene, valida y respeta esa distribución exacta.
 * - Si no, imputa automáticamente según `ordenarParaImputar`.
 * Nunca imputa más que el saldo de una obligación ni más que el pago; el
 * remanente queda como saldo a favor. Nunca mezcla monedas.
 */
export function aplicarPago(
  importe: Decimal,
  moneda: MonedaCodigo,
  obligaciones: ObligacionAbierta[],
  manual?: { obligacionId: string; importe: Decimal | string }[],
): ResultadoAplicacion {
  const errores: string[] = [];
  if (importe.lessThanOrEqualTo(0)) return { aplicaciones: [], saldoAFavor: new Decimal(0), errores: ["El importe del pago debe ser mayor que cero."] };

  const porId = new Map(obligaciones.map((o) => [o.id, o]));
  const aplicaciones: Aplicacion[] = [];

  if (manual && manual.length) {
    for (const m of manual) {
      const o = porId.get(m.obligacionId);
      const imp = d(m.importe);
      if (!o) { errores.push(`Obligación ${m.obligacionId} no encontrada o no pertenece al inquilino.`); continue; }
      if (o.moneda !== moneda) { errores.push(`Moneda distinta (${o.moneda}) en ${o.concepto} ${o.periodo}: no se convierte automáticamente.`); continue; }
      if (!imputables(o)) { errores.push(`${o.concepto} ${o.periodo} no admite pagos (estado ${o.estado}).`); continue; }
      if (imp.lessThanOrEqualTo(0)) { errores.push("Importe imputado debe ser mayor que cero."); continue; }
      if (imp.greaterThan(o.saldo)) { errores.push(`Se imputa ${imp} a ${o.concepto} ${o.periodo} pero su saldo es ${o.saldo}.`); continue; }
      aplicaciones.push({ obligacionId: o.id, importe: imp });
    }
    const totalImp = sumar(aplicaciones.map((a) => a.importe));
    if (totalImp.greaterThan(importe)) errores.push(`La suma imputada (${totalImp}) supera el importe del pago (${importe}).`);
    return { aplicaciones: errores.length ? [] : aplicaciones, saldoAFavor: errores.length ? new Decimal(0) : importe.minus(totalImp), errores };
  }

  let restante = importe;
  for (const o of ordenarParaImputar(obligaciones.filter((o) => o.moneda === moneda && imputables(o)))) {
    if (restante.isZero()) break;
    const imp = Decimal.min(restante, o.saldo);
    aplicaciones.push({ obligacionId: o.id, importe: imp });
    restante = restante.minus(imp);
  }
  return { aplicaciones, saldoAFavor: restante, errores };
}

/** Clave anti-duplicado de transferencias: misma cuenta + comprobante + importe. */
export function claveDuplicadoPago(p: { cuentaBancariaId?: string | null; comprobante?: string | null; importe: Decimal; moneda: string }): string | null {
  if (!p.comprobante) return null;
  const comp = p.comprobante.replace(/[\s.\-]/g, "").toUpperCase();
  return `${p.cuentaBancariaId ?? "sin-cuenta"}:${comp}:${p.moneda}:${p.importe.toFixed(2)}`;
}

export interface ResumenDeuda {
  porConcepto: Record<string, Decimal>;
  total: Decimal;
}

export function resumirDeuda(obls: { concepto: string; saldo: Decimal; estado: string }[]): ResumenDeuda {
  const porConcepto: Record<string, Decimal> = {};
  for (const o of obls) {
    if (o.estado === "ANULADA") continue;
    porConcepto[o.concepto] = (porConcepto[o.concepto] ?? new Decimal(0)).plus(o.saldo);
  }
  return { porConcepto, total: sumar(Object.values(porConcepto)) };
}
