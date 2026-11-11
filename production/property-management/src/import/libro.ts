import ExcelJS from "exceljs";
import { createHash } from "node:crypto";

/** Representación neutral de un libro Excel: todas las hojas, valores, fórmulas. */
export interface Celda {
  ref: string;
  fila: number; // 1-based
  col: number; // 1-based
  valor: string | number | boolean | Date | null; // valor (o resultado cacheado si es fórmula)
  formula?: string;
}

export interface Hoja {
  nombre: string;
  filas: number;
  columnas: number;
  celdas: Map<string, Celda>; // clave `${fila}:${col}`
  combinadas: number;
}

export interface Libro {
  sha256: string;
  hojas: Hoja[];
}

export function colLetra(n: number): string {
  let s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function valorDe(v: ExcelJS.CellValue): { valor: Celda["valor"]; formula?: string } {
  if (v === null || v === undefined) return { valor: null };
  if (v instanceof Date) return { valor: v };
  if (typeof v === "object") {
    if ("formula" in v || "sharedFormula" in v) {
      const f = v as ExcelJS.CellFormulaValue & { sharedFormula?: string };
      const r = f.result as unknown;
      const res = r instanceof Date || typeof r === "number" || typeof r === "string" || typeof r === "boolean" ? r : null;
      return { valor: res as Celda["valor"], formula: f.formula ?? f.sharedFormula };
    }
    if ("richText" in v) return { valor: (v as ExcelJS.CellRichTextValue).richText.map((t) => t.text).join("") };
    if ("text" in v) return { valor: String((v as ExcelJS.CellHyperlinkValue).text) };
    if ("error" in v) return { valor: null };
  }
  return { valor: v as string | number | boolean };
}

export async function leerLibro(buffer: Buffer | ArrayBuffer): Promise<Libro> {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ArrayBuffer);
  const hojas: Hoja[] = [];
  wb.eachSheet((ws) => {
    const celdas = new Map<string, Celda>();
    let maxF = 0, maxC = 0;
    ws.eachRow({ includeEmpty: false }, (row, nf) => {
      row.eachCell({ includeEmpty: false }, (cell, nc) => {
        // celdas combinadas: exceljs repite el valor en cada celda; se conserva solo la principal
        if (cell.isMerged && cell.master && cell.master.address !== cell.address) return;
        const { valor, formula } = valorDe(cell.value);
        if (valor === null && !formula) return;
        if (typeof valor === "string" && !valor.trim() && !formula) return;
        celdas.set(`${nf}:${nc}`, { ref: `${colLetra(nc)}${nf}`, fila: nf, col: nc, valor, formula });
        maxF = Math.max(maxF, nf);
        maxC = Math.max(maxC, nc);
      });
    });
    const merges = (ws as unknown as { model?: { merges?: string[] } }).model?.merges ?? [];
    hojas.push({ nombre: ws.name, filas: maxF, columnas: maxC, celdas, combinadas: merges.length });
  });
  return { sha256: createHash("sha256").update(buf).digest("hex"), hojas };
}

export function celda(h: Hoja, fila: number, col: number): Celda | undefined {
  return h.celdas.get(`${fila}:${col}`);
}

export function filaValores(h: Hoja, fila: number): Celda[] {
  const out: Celda[] = [];
  for (let c = 1; c <= h.columnas; c++) { const x = celda(h, fila, c); if (x) out.push(x); }
  return out;
}
