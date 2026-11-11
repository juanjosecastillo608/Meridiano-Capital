/** Normaliza CI/RUC para detectar duplicados: sin puntos, espacios ni prefijos. */
export function normalizarDocumento(tipo: string | null | undefined, numero: string | null | undefined): string | null {
  if (!numero) return null;
  const limpio = String(numero).toUpperCase().replace(/^(C\.?\s?I\.?|RUC)\s*[:Nº°#]*\s*/i, "").replace(/[\s.]/g, "");
  if (!limpio) return null;
  return `${(tipo ?? "OTRO").toUpperCase()}:${limpio}`;
}

/** Normaliza un nombre para sugerir coincidencias (no para afirmar identidad). */
export function normalizarNombre(n: string): string {
  return n.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Similitud simple por tokens (Jaccard) para alertar posibles duplicados de personas. */
export function similitudNombres(a: string, b: string): number {
  const A = new Set(normalizarNombre(a).split(" ").filter(Boolean));
  const B = new Set(normalizarNombre(b).split(" ").filter(Boolean));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Normaliza teléfono a dígitos (para comparar, no para mostrar). */
export function normalizarTelefono(t: string | null | undefined): string | null {
  if (!t) return null;
  const dig = String(t).replace(/\D/g, "");
  return dig || null;
}
