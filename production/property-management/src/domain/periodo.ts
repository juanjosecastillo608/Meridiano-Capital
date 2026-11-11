/**
 * Períodos YYYY-MM y fechas de calendario. Todas las fechas de negocio son
 * fechas puras (sin hora) en America/Asuncion; se representan como Date a
 * medianoche UTC para que @db.Date de Postgres las persista sin corrimiento.
 */
export const ZONA_HORARIA = "America/Asuncion";

export function fecha(y: number, m: number, dia: number): Date {
  return new Date(Date.UTC(y, m - 1, dia));
}

export function parsearFechaISO(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new Error(`Fecha inválida: ${s}`);
  return fecha(+m[1], +m[2], +m[3]);
}

export function aISO(f: Date): string {
  return f.toISOString().slice(0, 10);
}

/** "Hoy" en Asunción como fecha pura. */
export function hoyAsuncion(ahora = new Date()): Date {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA, year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
  return parsearFechaISO(partes);
}

export function periodoDe(f: Date): string {
  return f.toISOString().slice(0, 7);
}

export function validarPeriodo(p: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(p);
}

export function inicioPeriodo(p: string): Date {
  const [y, m] = p.split("-").map(Number);
  return fecha(y, m, 1);
}

export function finPeriodo(p: string): Date {
  const [y, m] = p.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0));
}

export function diasDelMes(p: string): number {
  return finPeriodo(p).getUTCDate();
}

export function sumarMeses(p: string, n: number): string {
  const [y, m] = p.split("-").map(Number);
  const idx = y * 12 + (m - 1) + n;
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`;
}

export function periodosEntre(desde: string, hasta: string): string[] {
  const out: string[] = [];
  for (let p = desde; p <= hasta; p = sumarMeses(p, 1)) out.push(p);
  return out;
}

/** Fecha de vencimiento: día pactado, acotado al último día del mes (p. ej. 31 → 28/29 feb). */
export function fechaVencimiento(p: string, dia: number): Date {
  const [y, m] = p.split("-").map(Number);
  return fecha(y, m, Math.min(dia, diasDelMes(p)));
}

export function diferenciaDias(desde: Date, hasta: Date): number {
  return Math.round((hasta.getTime() - desde.getTime()) / 86_400_000);
}

export function sumarDias(f: Date, n: number): Date {
  return new Date(f.getTime() + n * 86_400_000);
}
