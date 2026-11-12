/**
 * RUC paraguayo: "<base>-<dígito verificador>".
 * Regla del founder (2026-11-12): el RUC es el dato de facturación y la cédula
 * de identidad es el RUC sin el guion ni el dígito verificador.
 *   RUC 1234567-8 → CI 1234567
 * Las bases ≥ 80.000.000 corresponden en la práctica a personas jurídicas
 * (no tienen cédula): se marcan para revisión en vez de inventar una CI.
 */

export interface RucNormalizado {
  ruc: string; // "1234567-8"
  base: string; // "1234567"
  dv: number;
  dvCalculado: number;
  dvValido: boolean;
  ci: string | null; // null si parece persona jurídica
  probablePersonaJuridica: boolean;
  /** El dato vino sin dígito verificador ("1234567-" o "1234567"): la CI se deriva, el RUC queda INCOMPLETO (no se inventa el DV). */
  dvFaltante: boolean;
}

/** Dígito verificador módulo 11 (algoritmo de la DNIT/SET). */
export function calcularDV(base: string, baseMax = 11): number {
  const digitos = base.replace(/\D/g, "");
  let total = 0;
  let k = 2;
  for (let i = digitos.length - 1; i >= 0; i--) {
    total += Number(digitos[i]) * k;
    k = k < baseMax ? k + 1 : 2;
  }
  const r = total % 11;
  return r > 1 ? 11 - r : 0;
}

/** Interpreta "1.234.567-8", "1234567-8", "RUC 1234567 - 8". Devuelve null si no tiene el formato base-DV. */
export function normalizarRuc(raw: unknown): RucNormalizado | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).toUpperCase().replace(/^RUC\s*:?\s*/, "").replace(/[.\s]/g, "");
  // Con guion: base-DV (o "base-" sin DV). Sin guion: todo es la base (no se adivina un DV).
  const m = s.includes("-") ? /^(\d{5,9})-(\d)?$/.exec(s) : /^(\d{5,9})$/.exec(s);
  if (!m) return null;
  const base = m[1].replace(/^0+/, "") || "0";
  const dvCalculado = calcularDV(base);
  const probablePersonaJuridica = Number(base) >= 80_000_000;
  const ci = probablePersonaJuridica ? null : base;
  if (m[2] === undefined) return { ruc: `${base}-?`, base, dv: NaN, dvCalculado, dvValido: false, ci, probablePersonaJuridica, dvFaltante: true };
  const dv = Number(m[2]);
  return { ruc: `${base}-${dv}`, base, dv, dvCalculado, dvValido: dv === dvCalculado, ci, probablePersonaJuridica, dvFaltante: false };
}
