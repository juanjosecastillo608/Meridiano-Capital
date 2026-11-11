/**
 * Cálculo de vigencia contractual con FECHAS DE CALENDARIO (sin zona horaria).
 *
 * Una fecha contractual es un triple año-mes-día; nunca un instante. Se
 * representa como string ISO "YYYY-MM-DD" en esta API para que ninguna zona
 * horaria pueda correr el día.
 *
 * Convención por defecto (inicio inclusivo, fin inclusivo), Actualización
 * contractual 03:
 *   fin = (mismo día del mes, N meses después) − 1 día.
 * Si ese "mismo día" no existe en el mes de destino (31 → mes de 30 días,
 * 29/30/31 de enero → febrero, 29-feb → año no bisiesto), el aniversario es
 * el día 1 del mes siguiente, de modo que [inicio, fin] cubre exactamente N
 * meses calendario completos.
 *   01/12/2026 + 12 m → 30/11/2027
 *   15/03/2026 + 12 m → 14/03/2027
 *   31/01/2026 +  1 m → 28/02/2026   (aniversario inexistente 31/02 → 01/03)
 *   29/02/2028 + 12 m → 28/02/2029   (aniversario inexistente 29/02/2029 → 01/03)
 *   01/03/2027 + 12 m → 29/02/2028   (año bisiesto)
 * Esta convención es [EXTENSION] técnica sujeta a revisión jurídica (cómputo
 * de plazos del Código Civil paraguayo); cualquier otro fin solo como
 * excepción expresamente aprobada.
 */

export type FechaCalendario = string; // "YYYY-MM-DD"

const RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function esBisiesto(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function diasEnMes(y: number, m: number): number {
  return [31, esBisiesto(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

export function parsear(f: FechaCalendario): { y: number; m: number; d: number } {
  const x = RE.exec(f);
  if (!x) throw new Error(`Fecha de calendario inválida: "${f}" (formato YYYY-MM-DD).`);
  const y = +x[1], m = +x[2], d = +x[3];
  if (m < 1 || m > 12 || d < 1 || d > diasEnMes(y, m)) throw new Error(`Fecha inexistente: ${f}.`);
  return { y, m, d };
}

const fmt = (y: number, m: number, d: number): FechaCalendario => `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function diaAnterior(y: number, m: number, d: number): FechaCalendario {
  if (d > 1) return fmt(y, m, d - 1);
  if (m > 1) return fmt(y, m - 1, diasEnMes(y, m - 1));
  return fmt(y - 1, 12, 31);
}

/** Fin inclusivo de un plazo de `termMonths` meses calendario que empieza (inclusive) en `startDate`. */
export function calculateLeaseEndDate(startDate: FechaCalendario, termMonths: number): FechaCalendario {
  if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 600) throw new Error("La duración debe ser un número entero de meses (1–600).");
  const { y, m, d } = parsear(startDate);
  const idx = y * 12 + (m - 1) + termMonths;
  const ty = Math.floor(idx / 12), tm = (idx % 12) + 1;
  // Aniversario: mismo día del mes destino; si no existe, día 1 del mes siguiente.
  if (d <= diasEnMes(ty, tm)) return diaAnterior(ty, tm, d);
  return fmt(ty, tm, diasEnMes(ty, tm)); // = (1 del mes siguiente) − 1
}

/** Cantidad de días del período inclusivo (informativo para la vista previa). */
export function diasInclusivos(inicio: FechaCalendario, fin: FechaCalendario): number {
  const a = parsear(inicio), b = parsear(fin);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000) + 1;
}

/** dd/mm/aaaa para documentos. */
export function formatoLocal(f: FechaCalendario): string {
  const { y, m, d } = parsear(f);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

/** Fecha de calendario → Date a medianoche UTC (solo para persistir en columnas @db.Date). */
export function aDate(f: FechaCalendario): Date {
  const { y, m, d } = parsear(f);
  return new Date(Date.UTC(y, m - 1, d));
}

export function desdeDate(dt: Date): FechaCalendario {
  return dt.toISOString().slice(0, 10);
}

// ───────────── Importe en letras (para la plantilla) ─────────────

const U = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUNO", "VEINTIDÓS", "VEINTITRÉS", "VEINTICUATRO", "VEINTICINCO", "VEINTISÉIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
const D = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const C = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

function hasta999(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "CIEN";
  const c = Math.floor(n / 100), r = n % 100;
  const dec = r < 30 ? U[r] : `${D[Math.floor(r / 10)]}${r % 10 ? ` Y ${U[r % 10]}` : ""}`;
  return [C[c], dec].filter(Boolean).join(" ");
}

/** Entero en letras (mayúsculas), hasta 999.999.999.999. */
export function numeroALetras(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999_999_999_999) throw new Error("Fuera de rango para letras.");
  if (n === 0) return "CERO";
  const miles = (x: number) => (x === 1 ? "MIL" : `${hasta999(x)} MIL`);
  const bloque = (x: number) => {
    const mi = Math.floor(x / 1000), r = x % 1000;
    return [mi ? miles(mi) : "", hasta999(r)].filter(Boolean).join(" ");
  };
  const millones = Math.floor(n / 1_000_000), resto = n % 1_000_000;
  const parteMillones = millones ? (millones === 1 ? "UN MILLÓN" : `${bloque(millones).replace(/UNO$/, "UN")} MILLONES`) : "";
  return [parteMillones, bloque(resto)].filter(Boolean).join(" ").replace(/VEINTIUNO MIL/g, "VEINTIÚN MIL").replace(/VEINTIUN MILLONES/g, "VEINTIÚN MILLONES").replace(/UNO MIL/g, "UN MIL").replace(/ +/g, " ").trim();
}
