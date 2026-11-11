import { celda, filaValores, type Libro, type Hoja, type Celda } from "./libro";
import { normalizarEncabezado } from "./diccionario";
import { parsearImporte, Decimal } from "../domain/money";

/**
 * Lectores de documentos de obra. Nunca convierten un precio estimado en una
 * cotización ni una cotización en un presupuesto aprobado: devuelven cada
 * dato con su etapa y calidad para que el usuario decida.
 */

const txt = (c?: Celda) => (c && c.valor !== null && c.valor !== undefined ? String(c.valor).trim() : "");

// ─────────────────────────── Checklist de alcance ───────────────────────────

export interface ItemAlcance {
  sector: string; // tal como figura en el encabezado ("4", "13-14", "Terraza")
  item: string;
  incluido: boolean;
  hoja: string;
  ref: string;
}

export interface ResultadoChecklist {
  items: ItemAlcance[];
  sectores: string[];
  notas: string[];
  advertencias: string[];
}

const MARCA_SI = /^(☐|☑|✓|✔|x|si|sí)$/i;
const MARCA_NO = /^(—|-|–|no|)$/i;

/** Checklist con encabezado "Ítem | <sector> | <sector> …" y celdas ☐ (incluido) / — (no aplica). */
export function leerChecklist(libro: Libro): ResultadoChecklist {
  const items: ItemAlcance[] = [];
  const advertencias: string[] = [];
  const notas: string[] = [];
  let sectores: string[] = [];
  for (const h of libro.hojas) {
    let filaEnc = 0;
    for (let f = 1; f <= Math.min(h.filas, 20); f++) {
      const primera = filaValores(h, f)[0];
      if (primera && /^[ií]tem$/i.test(txt(primera))) { filaEnc = f; break; }
    }
    if (!filaEnc) continue;
    const enc = filaValores(h, filaEnc);
    const colItem = enc[0].col;
    const cols = enc.slice(1).map((c) => ({ col: c.col, sector: txt(c) }));
    sectores = [...new Set([...sectores, ...cols.map((c) => c.sector)])];
    for (let f = filaEnc + 1; f <= h.filas; f++) {
      const it = txt(celda(h, f, colItem));
      if (!it) continue;
      const marcas = cols.map((c) => ({ ...c, v: txt(celda(h, f, c.col)) }));
      if (marcas.every((m) => !m.v)) { notas.push(it); continue; } // texto de nota al pie
      for (const m of marcas) {
        if (MARCA_SI.test(m.v)) items.push({ sector: m.sector, item: it, incluido: true, hoja: h.nombre, ref: `${h.nombre}!${String.fromCharCode(64 + m.col)}${f}` });
        else if (!MARCA_NO.test(m.v)) advertencias.push(`Marca no reconocida "${m.v}" en ${h.nombre} fila ${f}, sector ${m.sector}.`);
      }
    }
  }
  if (!items.length) advertencias.push("No se encontró una tabla de checklist (encabezado 'Ítem').");
  return { items, sectores, notas, advertencias };
}

/** Hojas "Departamento N" / "Terraza" con "Detalle | Importe": listado de trabajos por sector, sin precios confirmados. */
export function leerListadosPorSector(libro: Libro): { sector: string; item: string; importe: Decimal | null; hoja: string }[] {
  const out: { sector: string; item: string; importe: Decimal | null; hoja: string }[] = [];
  for (const h of libro.hojas) {
    let filaEnc = 0, colDet = 0, colImp = 0;
    for (let f = 1; f <= Math.min(h.filas, 6); f++) {
      for (const c of filaValores(h, f)) {
        const t = normalizarEncabezado(txt(c));
        if (t === "detalle") { filaEnc = f; colDet = c.col; }
        if (t === "importe" && f === filaEnc) colImp = c.col;
      }
      if (filaEnc) break;
    }
    if (!filaEnc || !colDet || !colImp) continue;
    const titulo = txt(filaValores(h, 1)[0]) || txt(filaValores(h, 2)[0]) || h.nombre;
    const m = /(\d+)/.exec(titulo.replace(/\s+/g, " "));
    const sector = /depart|depto|dpto/i.test(titulo) && m ? m[1] : h.nombre;
    for (let f = filaEnc + 1; f <= h.filas; f++) {
      const det = txt(celda(h, f, colDet));
      if (!det) continue;
      const c = celda(h, f, colImp);
      const imp = c?.formula ? null : parsearImporte(c?.valor);
      out.push({ sector, item: det, importe: imp && !imp.isZero() ? imp : null, hoja: h.nombre });
    }
  }
  return out;
}

// ─────────────────────────── Presupuesto / cotización ───────────────────────────

export type RubroObra = "AGUA_SANITARIA" | "ELECTRICIDAD" | "PINTURA" | "OBRA_CIVIL" | "VARIOS";

export function clasificarRubro(rubroOriginal: string, item = ""): RubroObra {
  const t = normalizarEncabezado(`${rubroOriginal} ${item}`);
  if (/plomer|sanitar|agua|desag|cano|grifer|ducha/.test(t)) return "AGUA_SANITARIA";
  if (/electr|tomacorr|ventilador/.test(t)) return "ELECTRICIDAD";
  if (/pintur|sellador|lija/.test(t)) return "PINTURA";
  if (/albanil|hierro|revest|techo|cielorraso|pared|piso|ceramic|demolic|revoque|mamposter/.test(t)) return "OBRA_CIVIL";
  return "VARIOS";
}

export interface PartidaLeida {
  etapa: "ESTIMADO" | "COTIZACION_PROVEEDOR";
  tipo: "MATERIAL" | "MANO_DE_OBRA" | "CONTINGENCIA";
  rubroOriginal: string;
  rubro: RubroObra;
  descripcion: string;
  cantidad: Decimal | null;
  unidadMedida: string | null;
  precioBajo: Decimal | null;
  precioUnitario: Decimal | null; // escenario objetivo
  precioAlto: Decimal | null;
  total: Decimal | null;
  confianza: string | null;
  calidadDato: "DATO_RECIBIDO" | "SUPUESTO" | "REVISION_TECNICA_REQUERIDA" | "INFORMACION_FALTANTE";
  fuente: string;
}

export interface ResultadoPresupuesto {
  partidas: PartidaLeida[];
  advertencias: string[];
  criterios: string[];
}

function encabezados(h: Hoja, maxFila = 6): { fila: number; cols: Map<string, number> } | null {
  for (let f = 1; f <= Math.min(h.filas, maxFila); f++) {
    const cs = filaValores(h, f);
    if (cs.length >= 3) {
      const cols = new Map<string, number>();
      for (const c of cs) cols.set(normalizarEncabezado(txt(c)), c.col);
      return { fila: f, cols };
    }
  }
  return null;
}

const num = (c?: Celda) => (c?.valor === null || c?.valor === undefined ? null : parsearImporte(c.valor));

/**
 * Lee un presupuesto de obra con hojas de materiales (precio bajo/objetivo/alto),
 * mano de obra (unitario bajo/objetivo/alto) y resumen con oferta del proveedor.
 * - Precios "bajo/objetivo/alto" = ESTIMADO, calidad SUPUESTO (son referencias, no cotizaciones).
 * - Confianza de lectura "Baja" o "a confirmar" en la nota ⇒ REVISION_TECNICA_REQUERIDA.
 * - Oferta del proveedor (texto "oferta") = COTIZACION_PROVEEDOR, calidad DATO_RECIBIDO.
 */
export function leerPresupuesto(libro: Libro, nombreArchivo: string): ResultadoPresupuesto {
  const partidas: PartidaLeida[] = [];
  const advertencias: string[] = [];
  const criterios: string[] = [];
  for (const h of libro.hojas) {
    const e = encabezados(h);
    if (!e) continue;
    const c = (re: RegExp) => [...e.cols.entries()].find(([k]) => re.test(k))?.[1];
    const colPrecioObj = c(/^(precio|unitario) objetivo/);
    const colBajo = c(/^(precio|unitario) bajo/);
    const colAlto = c(/^(precio|unitario) alto/);
    const colCant = c(/^cantidad/);
    const colUni = c(/^unidad$/);
    const colItem = c(/^item$/) ?? c(/^trabajo$/);
    const colRubro = c(/^rubro$/);
    const colConf = c(/^confianza/);
    const colObs = c(/^observacion|^nota$/);
    if (colPrecioObj && colItem) {
      const esMO = !!c(/^trabajo$/);
      for (let f = e.fila + 1; f <= h.filas; f++) {
        const item = txt(celda(h, f, colItem));
        if (!item || /^total|^rango/i.test(item)) continue;
        const cant = num(celda(h, f, colCant ?? 0));
        const pu = num(celda(h, f, colPrecioObj));
        const conf = colConf ? txt(celda(h, f, colConf)) || null : null;
        const obs = colObs ? txt(celda(h, f, colObs)) : "";
        const rubroOriginal = colRubro ? txt(celda(h, f, colRubro)) : esMO ? "Mano de obra" : "";
        const dudoso = /^baja$/i.test(conf ?? "") || /confirmar|dudos|provisori|interpret/i.test(`${item} ${obs}`);
        partidas.push({
          etapa: "ESTIMADO",
          tipo: esMO ? "MANO_DE_OBRA" : "MATERIAL",
          rubroOriginal,
          rubro: clasificarRubro(rubroOriginal, item),
          descripcion: obs ? `${item} — ${obs}` : item,
          cantidad: cant,
          unidadMedida: colUni ? txt(celda(h, f, colUni)) || null : txt(celda(h, f, c(/^unidad/) ?? 0)) || null,
          precioBajo: colBajo ? num(celda(h, f, colBajo)) : null,
          precioUnitario: pu,
          precioAlto: colAlto ? num(celda(h, f, colAlto)) : null,
          total: cant && pu ? cant.times(pu) : null,
          confianza: conf,
          calidadDato: !cant || !pu ? "INFORMACION_FALTANTE" : dudoso ? "REVISION_TECNICA_REQUERIDA" : "SUPUESTO",
          fuente: `${nombreArchivo} › ${h.nombre} fila ${f}`,
        });
      }
      continue;
    }
    // Hoja resumen: oferta del proveedor y criterios de contratación
    let enCriterios = false;
    for (let f = 1; f <= h.filas; f++) {
      if (/criterio/i.test(txt(celda(h, f, 1)))) enCriterios = true;
      const a = txt(celda(h, f, 1));
      const b = celda(h, f, 2);
      if (/oferta/i.test(a) && b && !b.formula) {
        const v = num(b);
        if (v) partidas.push({ etapa: "COTIZACION_PROVEEDOR", tipo: /mano de obra/i.test(a) ? "MANO_DE_OBRA" : "MATERIAL", rubroOriginal: "Oferta", rubro: "VARIOS", descripcion: a, cantidad: new Decimal(1), unidadMedida: "global", precioBajo: null, precioUnitario: v, precioAlto: null, total: v, confianza: null, calidadDato: "DATO_RECIBIDO", fuente: `${nombreArchivo} › ${h.nombre} fila ${f}` });
        if (/\//.test(a)) advertencias.push(`"${a}": no queda claro si la oferta del proveedor es solo mano de obra o incluye materiales. Confirmar antes de aprobar.`);
      }
      if (enCriterios && /^\d+$/.test(a) && b && typeof b.valor === "string" && b.valor.length > 20) criterios.push(b.valor);
    }
  }
  if (!partidas.length) advertencias.push("No se reconocieron partidas de presupuesto.");
  const faltantes = partidas.filter((p) => p.calidadDato === "INFORMACION_FALTANTE").length;
  if (faltantes) advertencias.push(`${faltantes} partida(s) sin cantidad o precio.`);
  return { partidas, advertencias, criterios };
}
