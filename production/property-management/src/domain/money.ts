import Decimal from "decimal.js";

/**
 * Aritmética monetaria. Nunca usar `number` para importes.
 *
 * Redondeo: PYG a 0 decimales (el guaraní no tiene subunidad en circulación),
 * USD a 2 decimales, ROUND_HALF_UP. Ver docs/02-reglas-de-negocio.md (RN-DIN-01).
 */
Decimal.set({ precision: 34, rounding: Decimal.ROUND_HALF_UP });

export type MonedaCodigo = "PYG" | "USD";
export type DecimalLike = Decimal | string | number | { toString(): string };

export const DECIMALES: Record<MonedaCodigo, number> = { PYG: 0, USD: 2 };

export function d(v: DecimalLike | null | undefined): Decimal {
  if (v === null || v === undefined) return new Decimal(0);
  if (v instanceof Decimal) return v;
  return new Decimal(v.toString());
}

export function redondear(v: DecimalLike, moneda: MonedaCodigo): Decimal {
  return d(v).toDecimalPlaces(DECIMALES[moneda], Decimal.ROUND_HALF_UP);
}

export function sumar(valores: DecimalLike[]): Decimal {
  return valores.reduce<Decimal>((acc, v) => acc.plus(d(v)), new Decimal(0));
}

export function esCero(v: DecimalLike): boolean {
  return d(v).isZero();
}

export function formatear(v: DecimalLike, moneda: MonedaCodigo): string {
  const n = redondear(v, moneda);
  const [ent, dec] = n.abs().toFixed(DECIMALES[moneda]).split(".");
  const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const signo = n.isNegative() ? "-" : "";
  const pref = moneda === "PYG" ? "G. " : "USD ";
  return `${signo}${pref}${miles}${dec ? "," + dec : ""}`;
}

/**
 * Interpreta un importe escrito en formato local ("3.000.000", "1.500,50",
 * "G. 2.000.000", "USD 1,200.00"). Devuelve null si no es inequívoco.
 */
export function parsearImporte(raw: unknown): Decimal | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? new Decimal(raw) : null;
  if (raw instanceof Decimal) return raw;
  let s = String(raw).trim();
  s = s.replace(/^(gs?\.?|₲|usd|us\$|\$|u\$s)\s*/i, "").replace(/\s*(gs?\.?|usd)$/i, "").trim();
  if (!s) return null;
  const neg = /^-|^\(.*\)$/.test(s);
  s = s.replace(/[()\-\s]/g, "");
  if (!/^[\d.,]+$/.test(s)) return null;
  const puntos = (s.match(/\./g) || []).length;
  const comas = (s.match(/,/g) || []).length;
  let norm: string;
  if (puntos && comas) {
    // el separador que aparece último es el decimal
    norm = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (puntos > 1 || (puntos === 1 && /\.\d{3}$/.test(s))) {
    norm = s.replace(/\./g, ""); // 3.000.000 o 3.000 → miles (convención paraguaya)
  } else if (comas > 1 || (comas === 1 && /,\d{3}$/.test(s))) {
    norm = s.replace(/,/g, "");
  } else {
    norm = s.replace(",", ".");
  }
  try {
    const v = new Decimal(norm);
    return neg ? v.negated() : v;
  } catch {
    return null;
  }
}

export { Decimal };
