import { celda, colLetra, filaValores, type Hoja, type Libro, type Celda } from "./libro";
import { proponerCampo, detectarMes, normalizarEncabezado, type CampoDestino } from "./diccionario";

export interface ColumnaDetectada {
  col: number;
  letra: string;
  encabezado: string;
  propuesta: CampoDestino;
  confianza: number;
  conFormulas: number;
  muestras: string[]; // valores de muestra (no se persisten en informes públicos)
}

export interface MetadatoDetectado {
  ref: string;
  clave: string; // edificio, cliente, cuenta, email, telefono, direccion, descripcion
  valor: string;
}

export interface TablaDetectada {
  hoja: string;
  filaEncabezado: number;
  filaInicio: number;
  filaFin: number;
  columnas: ColumnaDetectada[];
  columnasSinEncabezado: { letra: string; celdasConDatos: number; conFormulas: number }[];
  metadatos: MetadatoDetectado[];
  periodo: { valor: string | null; fuente: string; candidatos: { valor: string; fuente: string }[] };
  filaTotales: number | null;
  bloquesNoTabulares: { fila: number; texto: string }[];
  totalFormulas: number;
}

export interface AnalisisHoja {
  nombre: string;
  filas: number;
  columnas: number;
  combinadas: number;
  totalFormulas: number;
  tabla: TablaDetectada | null;
  motivoSinTabla?: string;
}

export interface AnalisisLibro {
  sha256: string;
  hojas: AnalisisHoja[];
}

const texto = (c?: Celda) => (c && c.valor !== null && c.valor !== undefined ? String(c.valor instanceof Date ? c.valor.toISOString().slice(0, 10) : c.valor).trim() : "");

/** La fila de encabezado es la de mayor cantidad de celdas de texto reconocibles en las primeras 40 filas. */
function detectarEncabezado(h: Hoja): number | null {
  let mejor: { fila: number; score: number } | null = null;
  for (let f = 1; f <= Math.min(h.filas, 40); f++) {
    const cs = filaValores(h, f).filter((c) => typeof c.valor === "string" && !c.formula);
    if (cs.length < 3) continue;
    const reconocidas = cs.filter((c) => proponerCampo(String(c.valor)).campo !== "ignorar").length;
    const score = reconocidas * 3 + cs.length;
    if (reconocidas >= 2 && (!mejor || score > mejor.score)) mejor = { fila: f, score };
  }
  return mejor?.fila ?? null;
}

const CLAVES_META: [RegExp, string][] = [
  [/cuenta con un total de/i, "descripcion"], // antes que "cuenta" (bancaria)
  [/^edificio\s*:?/i, "edificio"],
  [/^cliente\s*:?/i, "cliente"],
  [/^propietario\s*:?/i, "cliente"],
  [/^(cta\.?|cuenta)\s*(cte|corriente|de ahorro|ahorro)\b/i, "cuenta"],
  [/^mail|^e-?mail|^correo/i, "email"],
  [/^tel[eé]fono/i, "telefono"],
  [/^direcci[oó]n/i, "direccion"],
];

function detectarMetadatos(h: Hoja, hasta: number): MetadatoDetectado[] {
  const out: MetadatoDetectado[] = [];
  for (let f = 1; f < hasta; f++) {
    const cs = filaValores(h, f);
    for (let i = 0; i < cs.length; i++) {
      const t = texto(cs[i]);
      if (!t) continue;
      for (const [re, clave] of CLAVES_META) {
        if (re.test(t)) {
          let valor = t.replace(re, "").replace(/^[\s:]+/, "").trim();
          if (!valor && clave !== "descripcion" && cs[i + 1]) valor = texto(cs[i + 1]);
          if (clave === "descripcion") valor = t;
          if (clave === "cuenta" && !valor) valor = t;
          if (clave === "cuenta") valor = t; // conservar literal, ej. "Cta Cte 120-..."
          out.push({ ref: cs[i].ref, clave, valor });
          break;
        }
      }
      // "EDIFICIO Nombre" sin dos puntos
      if (/^edificio\s+[^:]/i.test(t) && !out.some((m) => m.ref === cs[i].ref)) out.push({ ref: cs[i].ref, clave: "edificio", valor: t.replace(/^edificio\s+/i, "") });
    }
  }
  return out;
}

function detectarPeriodo(h: Hoja, filaEnc: number, columnas: ColumnaDetectada[]): TablaDetectada["periodo"] {
  const candidatos: { valor: string; fuente: string }[] = [];
  for (let f = 1; f < filaEnc; f++) {
    for (const c of filaValores(h, f)) {
      if (c.valor instanceof Date) candidatos.push({ valor: c.valor.toISOString().slice(0, 7), fuente: `fecha en ${c.ref}` });
    }
  }
  const mh = detectarMes(h.nombre);
  if (mh) candidatos.push({ valor: mh.anio ? `${mh.anio}-${String(mh.mes).padStart(2, "0")}` : `????-${String(mh.mes).padStart(2, "0")}`, fuente: `nombre de hoja "${h.nombre}"` });
  for (const col of columnas) {
    const m = detectarMes(col.encabezado);
    if (m) candidatos.push({ valor: `????-${String(m.mes).padStart(2, "0")}`, fuente: `encabezado "${col.encabezado}" (${col.letra})` });
  }
  const completo = candidatos.find((c) => !c.valor.startsWith("????"));
  return { valor: completo?.valor ?? null, fuente: completo?.fuente ?? "no detectado", candidatos };
}

export function analizarHoja(h: Hoja): AnalisisHoja {
  const base = { nombre: h.nombre, filas: h.filas, columnas: h.columnas, combinadas: h.combinadas, totalFormulas: [...h.celdas.values()].filter((c) => c.formula).length };
  const filaEnc = detectarEncabezado(h);
  if (!filaEnc) return { ...base, tabla: null, motivoSinTabla: "No se detectó una fila de encabezados reconocible (lista simple o formato no tabular)." };

  const encabezados = filaValores(h, filaEnc).filter((c) => typeof c.valor === "string");
  const colsEnc = new Set(encabezados.map((c) => c.col));

  // Rango de datos: hasta fila "total" o 2 filas vacías seguidas en la columna clave
  let filaFin = filaEnc;
  let filaTotales: number | null = null;
  let vacias = 0;
  const primeraCol = encabezados[0]?.col ?? 1;
  for (let f = filaEnc + 1; f <= h.filas; f++) {
    const t = normalizarEncabezado(texto(celda(h, f, primeraCol)));
    if (/^(ingresos? )?totales?|^total/.test(t)) { filaTotales = f; break; }
    if (!t) { vacias++; if (vacias >= 2) break; continue; }
    vacias = 0;
    filaFin = f;
  }

  const columnas: ColumnaDetectada[] = encabezados.map((c) => {
    const { campo, confianza } = proponerCampo(String(c.valor));
    let conFormulas = 0;
    const muestras: string[] = [];
    for (let f = filaEnc + 1; f <= filaFin; f++) {
      const x = celda(h, f, c.col);
      if (x?.formula) conFormulas++;
      if (x && muestras.length < 3) muestras.push(texto(x));
    }
    return { col: c.col, letra: colLetra(c.col), encabezado: String(c.valor).trim(), propuesta: campo, confianza, conFormulas, muestras };
  });

  const sinEnc = new Map<number, { celdasConDatos: number; conFormulas: number }>();
  for (let f = filaEnc + 1; f <= filaFin; f++) {
    for (const c of filaValores(h, f)) {
      if (colsEnc.has(c.col)) continue;
      const e = sinEnc.get(c.col) ?? { celdasConDatos: 0, conFormulas: 0 };
      e.celdasConDatos++;
      if (c.formula) e.conFormulas++;
      sinEnc.set(c.col, e);
    }
  }

  const bloques: { fila: number; texto: string }[] = [];
  for (let f = (filaTotales ?? filaFin) + 1; f <= h.filas; f++) {
    const t = filaValores(h, f).map((c) => texto(c)).filter(Boolean).join(" | ");
    if (t) bloques.push({ fila: f, texto: t });
  }

  return {
    ...base,
    tabla: {
      hoja: h.nombre,
      filaEncabezado: filaEnc,
      filaInicio: filaEnc + 1,
      filaFin,
      columnas,
      columnasSinEncabezado: [...sinEnc.entries()].sort((a, b) => a[0] - b[0]).map(([col, v]) => ({ letra: colLetra(col), ...v })),
      metadatos: detectarMetadatos(h, filaEnc),
      periodo: detectarPeriodo(h, filaEnc, columnas),
      filaTotales,
      bloquesNoTabulares: bloques,
      totalFormulas: base.totalFormulas,
    },
  };
}

export function analizarLibro(l: Libro): AnalisisLibro {
  return { sha256: l.sha256, hojas: l.hojas.map(analizarHoja) };
}
