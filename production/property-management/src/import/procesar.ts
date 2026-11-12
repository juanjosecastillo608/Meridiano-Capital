import { celda, colLetra, type Libro, type Celda } from "./libro";
import type { AnalisisLibro, TablaDetectada } from "./analizar";
import type { CampoDestino } from "./diccionario";
import { parsearImporte, sumar, Decimal, type MonedaCodigo } from "../domain/money";
import { validarPeriodo, inicioPeriodo, finPeriodo, diferenciaDias } from "../domain/periodo";
import { normalizarTelefono } from "../domain/documentos";
import { normalizarRuc } from "../domain/ruc";

/** Mapeo confirmado por el usuario: por hoja, columna → campo. */
export interface MapeoHoja {
  hoja: string;
  incluir: boolean;
  periodo: string | null; // YYYY-MM, confirmado o corregido por el usuario
  columnas: Record<string, CampoDestino>; // letra → campo
  /** Hoja de REFERENCIA (sin período): aporta datos de unidad/contrato anterior, nunca cobros ni obligaciones. */
  referencia?: boolean;
}

/** " PB B  Dpto" → "PB B"; "Depto 7" → "7"; colapsa espacios. Mismo código en todas las hojas. */
export function normalizarIdentificadorUnidad(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().replace(/\s+(dpto|depto|departamento)\.?$/i, "").replace(/^(dpto|depto|departamento)\.?\s+/i, "").trim();
}

export interface OpcionesImport {
  moneda: MonedaCodigo | null; // obligatorio: nunca se asume
  /** Textos que en la columna de inquilino significan "unidad vacante". */
  marcasVacante: string[];
  /** Tasa de IVA vigente para comparar contra el IVA declarado en la planilla (solo control). */
  tasaIvaControlPct?: number | null;
}

export const OPCIONES_DEFAULT: Omit<OpcionesImport, "moneda"> = { marcasVacante: ["libre", "vacante", "desocupado", "disponible", "-"] };

export type Severidad = "ERROR" | "ADVERTENCIA" | "INFO";
export interface Problema {
  severidad: Severidad;
  codigo: string;
  mensaje: string;
  hoja?: string;
  ref?: string;
}

export interface RegistroFila {
  hoja: string;
  fila: number;
  periodo: string | null;
  unidad: { identificador: string; tipologia?: string; superficieM2?: string; piso?: string; medidorAnde?: string };
  inquilino: { nombre: string; telefono?: string; documento?: string; ruc?: string; email?: string } | null;
  vacante: boolean;
  alquiler: Decimal | null;
  expensas: Decimal | null;
  pagoTotal: Decimal | null;
  marcaPago: string | null;
  fechaPago: Date | null;
  fechaProgramada: Date | null;
  agua: Decimal | null; // servicio de agua cobrado en el mes
  contratoAnterior: { fechaFin: Date | null; estadoDeclarado: string | null } | null; // de hojas de referencia
  bonificacion: Decimal | null;
  montoFactura: Decimal | null;
  iva: Decimal | null;
  ivaFormula: string | null;
  observaciones: string | null;
  /** El pago de esta fila repite uno de otro período: se omite el pago, la obligación del período se conserva. */
  pagoDuplicado: boolean;
  problemas: Problema[];
  estado: "OK" | "ADVERTENCIA" | "ERROR" | "DUPLICADO" | "OMITIDA";
}

export interface InformeImport {
  hojasProcesadas: string[];
  hojasOmitidas: { hoja: string; motivo: string }[];
  registros: RegistroFila[];
  problemasGenerales: Problema[];
  resumen: {
    unidadesDetectadas: number;
    inquilinosDetectados: number;
    periodos: string[];
    filas: number;
    errores: number;
    advertencias: number;
    duplicados: number;
    pagosDetectados: number;
    montoPagosPorPeriodo: Record<string, string>;
  };
  bloqueante: boolean;
}

const txt = (c?: Celda) => (c && c.valor !== null && c.valor !== undefined ? (c.valor instanceof Date ? c.valor.toISOString().slice(0, 10) : String(c.valor)).trim() : "");

function aFecha(c?: Celda): Date | null {
  if (!c || c.valor === null) return null;
  if (c.valor instanceof Date) return new Date(Date.UTC(c.valor.getUTCFullYear(), c.valor.getUTCMonth(), c.valor.getUTCDate()));
  const s = String(c.valor).trim();
  const m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/.exec(s); // dd/mm/aaaa (convención local)
  if (m) return new Date(Date.UTC(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]));
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  return null;
}

/** Propuesta inicial de mapeo a partir del análisis (el usuario la corrige antes de validar). */
export function proponerMapeo(a: AnalisisLibro): MapeoHoja[] {
  return a.hojas.map((h) => ({
    hoja: h.nombre,
    // Solo hojas con unidad + algún dato económico (alquiler o pago); el resto se lista para revisión
    incluir: !!h.tabla && h.tabla.columnas.some((c) => c.propuesta === "unidad.identificador") && h.tabla.columnas.some((c) => c.propuesta === "contrato.alquiler" || c.propuesta === "periodo.pagoTotal"),
    periodo: h.tabla?.periodo.valor ?? null,
    // Sin período completo detectado: se propone como hoja de referencia (no genera cobros).
    referencia: !!h.tabla && !h.tabla.periodo.valor,
    // Una sola columna por campo: gana la de mayor confianza (y, a igualdad, la primera); el resto queda en "ignorar".
    columnas: (() => {
      const cols = h.tabla?.columnas ?? [];
      const ganadora = new Map<string, string>();
      for (const c of [...cols].sort((a, b) => b.confianza - a.confianza || a.col - b.col)) if (c.propuesta !== "ignorar" && !ganadora.has(c.propuesta)) ganadora.set(c.propuesta, c.letra);
      return Object.fromEntries(cols.map((c) => [c.letra, ganadora.get(c.propuesta) === c.letra ? c.propuesta : "ignorar"]));
    })(),
  }));
}

function letraACol(l: string): number {
  return l.split("").reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
}

export function procesar(libro: Libro, analisis: AnalisisLibro, mapeo: MapeoHoja[], opciones: OpcionesImport): InformeImport {
  const problemasGenerales: Problema[] = [];
  const registros: RegistroFila[] = [];
  const hojasProcesadas: string[] = [];
  const hojasOmitidas: InformeImport["hojasOmitidas"] = [];

  if (!opciones.moneda) problemasGenerales.push({ severidad: "ERROR", codigo: "MONEDA_NO_IDENTIFICADA", mensaje: "La moneda de los importes no está identificada en el archivo. Seleccione la moneda explícitamente: no se asume ni se convierte." });

  const vacantes = opciones.marcasVacante.map((m) => m.toLowerCase().trim());

  for (const m of mapeo) {
    const a = analisis.hojas.find((h) => h.nombre === m.hoja);
    const hoja = libro.hojas.find((h) => h.nombre === m.hoja);
    if (!m.incluir || !a?.tabla || !hoja) {
      hojasOmitidas.push({ hoja: m.hoja, motivo: !a?.tabla ? (a?.motivoSinTabla ?? "Sin tabla") : "Excluida por el usuario" });
      continue;
    }
    const t: TablaDetectada = a.tabla;
    hojasProcesadas.push(m.hoja);
    if (m.referencia) { m.periodo = null; problemasGenerales.push({ severidad: "INFO", codigo: "HOJA_REFERENCIA", hoja: m.hoja, mensaje: "Hoja de referencia (sin período): se usan datos de unidad y del contrato anterior; no genera obligaciones ni pagos." }); }
    else if (!m.periodo || !validarPeriodo(m.periodo)) problemasGenerales.push({ severidad: "ERROR", codigo: "PERIODO_INVALIDO", hoja: m.hoja, mensaje: `Período no identificado o inválido (${m.periodo ?? "vacío"}). Confírmelo manualmente.` });

    // Coherencia período ↔ encabezados (p. ej. hoja de agosto con columnas "Pago Mes Julio")
    if (m.periodo) {
      const mesHoja = Number(m.periodo.slice(5, 7));
      for (const cand of t.periodo.candidatos) {
        const mesC = Number(cand.valor.slice(5, 7));
        if (mesC && mesC !== mesHoja) problemasGenerales.push({ severidad: "ADVERTENCIA", codigo: "PERIODO_INCONSISTENTE", hoja: m.hoja, mensaje: `El período confirmado es ${m.periodo} pero ${cand.fuente} indica el mes ${mesC}. Posible hoja copiada sin actualizar.` });
      }
    }

    // Un campo no puede venir de dos columnas a la vez
    const usados = new Map<string, string[]>();
    for (const [l, c] of Object.entries(m.columnas)) if (c !== "ignorar") usados.set(c, [...(usados.get(c) ?? []), l]);
    for (const [c, ls] of usados) if (ls.length > 1) problemasGenerales.push({ severidad: "ERROR", codigo: "CAMPO_MAPEADO_DOS_VECES", hoja: m.hoja, mensaje: `El campo "${c}" está asignado a varias columnas (${ls.join(", ")}). Deje solo una.` });

    // Columnas por campo
    const colDe = (campo: CampoDestino) => Object.entries(m.columnas).filter(([, c]) => c === campo).map(([l]) => letraACol(l))[0];
    const cols = Object.fromEntries((["unidad.identificador", "unidad.tipologia", "unidad.superficieM2", "unidad.piso", "unidad.medidorAnde", "inquilino.nombre", "inquilino.telefono", "inquilino.documento", "inquilino.ruc", "inquilino.email", "contrato.alquiler", "periodo.pagoTotal", "periodo.expensas", "periodo.marcaPago", "periodo.fechaPago", "periodo.fechaProgramada", "periodo.bonificacion", "periodo.agua", "contrato.fechaFin", "contrato.estadoDeclarado", "periodo.montoFactura", "periodo.iva", "observaciones"] as CampoDestino[]).map((c) => [c, colDe(c)])) as Record<CampoDestino, number | undefined>;
    if (!cols["unidad.identificador"]) { problemasGenerales.push({ severidad: "ERROR", codigo: "SIN_COLUMNA_UNIDAD", hoja: m.hoja, mensaje: "No hay columna mapeada a Unidad." }); continue; }

    const formulasIva = new Map<string, number>();
    for (let f = t.filaInicio; f <= t.filaFin; f++) {
      const g = (campo: CampoDestino) => (cols[campo] ? celda(hoja, f, cols[campo]!) : undefined);
      const identRaw = txt(g("unidad.identificador"));
      if (/^total/i.test(identRaw.trim())) continue;
      const ident = normalizarIdentificadorUnidad(identRaw);
      if (!ident) continue;
      const problemas: Problema[] = [];
      const p = (severidad: Severidad, codigo: string, mensaje: string, c?: Celda) => problemas.push({ severidad, codigo, mensaje, hoja: m.hoja, ref: c?.ref ?? `fila ${f}` });

      const imp = (campo: CampoDestino) => {
        const c = g(campo);
        if (!c || c.valor === null || c.valor === "") return null;
        const v = parsearImporte(c.valor);
        if (v === null) {
          // Texto en una columna de importes ("No pagan", notas): se informa, no bloquea la fila.
          if (/[a-záéíóúñ]{3,}/i.test(txt(c))) p("ADVERTENCIA", "TEXTO_EN_COLUMNA_IMPORTE", `Texto en columna de importes ${c.ref}: "${txt(c)}" (no se toma como importe).`, c);
          else p("ERROR", "IMPORTE_INVALIDO", `Importe no interpretable en ${c.ref}: "${txt(c)}".`, c);
        }
        return v;
      };

      const nombreRaw = txt(g("inquilino.nombre"));
      const tipologia = txt(g("unidad.tipologia"));
      // "ATICO", "Salón", etc. en la columna de inquilino describen la unidad, no a una persona
      const pareceDescripcion = !!nombreRaw && (nombreRaw.toLowerCase() === tipologia.toLowerCase() || /^(a|á)tico|^sal(o|ó)n$|^local$|^cochera$|^dep(to|ósito|osito)$/i.test(nombreRaw));
      if (pareceDescripcion) p("ADVERTENCIA", "INQUILINO_PARECE_DESCRIPCION", `"${nombreRaw}" en la columna inquilino parece una descripción de la unidad: se trata como unidad sin inquilino.`, g("inquilino.nombre"));
      // Frases de estado en la columna de inquilino ("Esta desocupado en reparación", "Libre") = unidad sin inquilino.
      const fraseEstado = !!nombreRaw && /\b(libre|desocupad[oa]s?|vacante|disponible|en reparaci[oó]n|en refacci[oó]n)\b/i.test(nombreRaw);
      if (fraseEstado) p("INFO", "OCUPANTE_ES_ESTADO", `"${nombreRaw}" describe el estado de la unidad: se toma como unidad sin inquilino.`, g("inquilino.nombre"));
      const vacante = !nombreRaw || pareceDescripcion || fraseEstado || vacantes.includes(nombreRaw.toLowerCase());
      const alquiler = imp("contrato.alquiler");
      const expensas = imp("periodo.expensas");
      const pagoTotal = imp("periodo.pagoTotal");
      const montoFactura = imp("periodo.montoFactura");
      const ivaC = g("periodo.iva");
      const iva = imp("periodo.iva");
      const rucRaw = txt(g("inquilino.ruc"));
      if (rucRaw && !vacante) {
        const r = normalizarRuc(rucRaw);
        if (!r) p("ERROR", "RUC_FORMATO", `RUC "${rucRaw}" sin formato base-DV (ej. 1234567-8).`, g("inquilino.ruc"));
        else {
          if (r.dvFaltante) p("ADVERTENCIA", "RUC_SIN_DV", `RUC "${rucRaw}" sin dígito verificador: la CI (${r.ci ?? "—"}) se deriva, pero el RUC para facturar queda INCOMPLETO. Confirmar el DV con la constancia (el cálculo módulo 11 da ${r.dvCalculado}; no se completa automáticamente).`, g("inquilino.ruc"));
          else if (!r.dvValido) p("ADVERTENCIA", "RUC_DV_INVALIDO", `RUC ${r.ruc}: el dígito verificador calculado es ${r.dvCalculado}. Verificar con la constancia de RUC.`, g("inquilino.ruc"));
          if (r.probablePersonaJuridica) p("INFO", "RUC_PERSONA_JURIDICA", `RUC ${r.ruc} parece de persona jurídica: no se deriva cédula.`, g("inquilino.ruc"));
          const ci = txt(g("inquilino.documento")).replace(/\D/g, "");
          if (ci && r.ci && ci !== r.ci) p("ADVERTENCIA", "CI_DISTINTA_DE_RUC", `CI ${ci} no coincide con la base del RUC ${r.ruc}.`, g("inquilino.documento"));
        }
      }
      const bonificacion = imp("periodo.bonificacion");
      const aguaC = g("periodo.agua");
      let agua = imp("periodo.agua");
      if (agua && agua.isNegative()) { p("ADVERTENCIA", "AGUA_NEGATIVA", `Agua negativa (${agua}) en ${aguaC?.ref}${aguaC?.formula ? ` (fórmula =${aguaC.formula}: se calcula como pago − alquiler)` : ""}: probable pago parcial, no se toma como cargo.`, aguaC); agua = null; }
      else if (agua && aguaC?.formula && cols["periodo.pagoTotal"] && new RegExp(`\\b${colLetra(cols["periodo.pagoTotal"]!)}\\d`).test(aguaC.formula)) p("INFO", "AGUA_DERIVADA_DEL_PAGO", `El agua de ${aguaC.ref} se calcula como pago − alquiler (=${aguaC.formula}): confirmar el cargo real de agua.`, aguaC);
      const finAnt = aFecha(g("contrato.fechaFin"));
      const estDecl = txt(g("contrato.estadoDeclarado")) || null;
      const fechaProgC = g("periodo.fechaProgramada");
      const fechaProgramada = aFecha(fechaProgC);
      if (fechaProgC && fechaProgC.valor !== null && !fechaProgramada) p("ERROR", "FECHA_INVALIDA", `Fecha no interpretable en ${fechaProgC.ref}: "${txt(fechaProgC)}".`, fechaProgC);
      if (bonificacion && alquiler && bonificacion.abs().greaterThan(alquiler)) p("ERROR", "BONIFICACION_MAYOR_QUE_ALQUILER", `Bonificación ${bonificacion} mayor que el alquiler ${alquiler}.`, g("periodo.bonificacion"));
      if (bonificacion && !bonificacion.isZero()) p("INFO", "BONIFICACION", `Bonificación de ${bonificacion.abs()} sobre el alquiler contractual: se registra como ajuste, el importe contractual no cambia.`, g("periodo.bonificacion"));
      const fechaPagoC = g("periodo.fechaPago");
      const fechaPago = aFecha(fechaPagoC);
      if (fechaPagoC && fechaPagoC.valor !== null && !fechaPago) p("ERROR", "FECHA_INVALIDA", `Fecha no interpretable en ${fechaPagoC.ref}: "${txt(fechaPagoC)}".`, fechaPagoC);
      const marca = txt(g("periodo.marcaPago")) || null;

      if (ivaC?.formula) {
        const forma = ivaC.formula.replace(/\d+/g, "#");
        formulasIva.set(forma, (formulasIva.get(forma) ?? 0) + 1);
      }

      // Reglas de consistencia por fila (se reportan, no se corrigen)
      if (!vacante && alquiler && alquiler.isZero()) p("ADVERTENCIA", "ALQUILER_CERO", "Unidad con inquilino y alquiler 0.");
      if (vacante && pagoTotal && pagoTotal.greaterThan(0)) p("ADVERTENCIA", "PAGO_EN_VACANTE", "Unidad marcada como libre pero registra pago.");
      if (marca && /^ok$/i.test(marca) && (!pagoTotal || pagoTotal.isZero())) p("ADVERTENCIA", "MARCA_OK_SIN_PAGO", `Marca de pago "${marca}" pero el pago del mes es 0 o vacío.`, g("periodo.marcaPago"));
      if (pagoTotal && pagoTotal.greaterThan(0) && !fechaPago) p("ADVERTENCIA", "PAGO_SIN_FECHA", "Pago sin fecha: no se puede conciliar.");
      if (pagoTotal && pagoTotal.greaterThan(0) && alquiler) {
        const esperado = alquiler.minus(bonificacion?.abs() ?? 0).plus(expensas ?? 0).plus(agua ?? 0);
        if (!pagoTotal.equals(esperado)) p("ADVERTENCIA", "PAGO_DISTINTO_ESPERADO", `Pago ${pagoTotal} ≠ alquiler + expensas (${esperado}). Posible pago parcial, en exceso o concepto adicional.`);
      }
      if (fechaPago && m.periodo && validarPeriodo(m.periodo)) {
        const ini = inicioPeriodo(m.periodo), fin = finPeriodo(m.periodo);
        if (diferenciaDias(fin, fechaPago) > 0 || diferenciaDias(fechaPago, ini) > 31)
          p("ADVERTENCIA", "FECHA_PAGO_FUERA_DE_PERIODO", `Fecha de pago ${fechaPago.toISOString().slice(0, 10)} fuera del período ${m.periodo}. Posible copia de otro mes o pago adelantado/atrasado.`, fechaPagoC);
      }
      if (montoFactura && pagoTotal && !montoFactura.equals(pagoTotal)) p("ADVERTENCIA", "FACTURA_DISTINTA_PAGO", `Monto factura ${montoFactura} ≠ pago ${pagoTotal}.`);
      if (!vacante && iva && alquiler && opciones.tasaIvaControlPct != null && !alquiler.isZero()) {
        const ivaAdicional = alquiler.times(opciones.tasaIvaControlPct).div(100).toDecimalPlaces(0);
        const ivaIncluido = alquiler.minus(alquiler.div(1 + opciones.tasaIvaControlPct / 100)).toDecimalPlaces(0);
        if (!iva.equals(ivaAdicional) && !iva.equals(ivaIncluido)) p("ADVERTENCIA", "IVA_NO_COINCIDE", `IVA declarado ${iva} no coincide con ${opciones.tasaIvaControlPct}% (adicional ${ivaAdicional} / incluido ${ivaIncluido}).`, ivaC);
        else if (iva.equals(ivaAdicional) && montoFactura && pagoTotal && montoFactura.equals(pagoTotal) && expensas && pagoTotal.equals(alquiler.plus(expensas)))
          p("INFO", "IVA_TRATAMIENTO_A_CONFIRMAR", `IVA calculado como ${opciones.tasaIvaControlPct}% sobre el alquiler, pero el monto facturado no lo suma: confirmar si el alquiler es IVA incluido (PD-02).`, ivaC);
      }

      registros.push({
        hoja: m.hoja,
        fila: f,
        periodo: m.periodo,
        unidad: { identificador: ident, tipologia: txt(g("unidad.tipologia")) || undefined, superficieM2: txt(g("unidad.superficieM2")) || undefined, piso: txt(g("unidad.piso")) || undefined, medidorAnde: txt(g("unidad.medidorAnde")) || undefined },
        inquilino: vacante ? null : { nombre: nombreRaw, telefono: txt(g("inquilino.telefono")) || undefined, documento: txt(g("inquilino.documento")) || undefined, ruc: txt(g("inquilino.ruc")) || undefined, email: txt(g("inquilino.email")) || undefined },
        vacante,
        alquiler,
        expensas,
        pagoTotal,
        marcaPago: marca,
        fechaPago,
        fechaProgramada,
        agua,
        contratoAnterior: finAnt || estDecl ? { fechaFin: finAnt, estadoDeclarado: estDecl } : null,
        bonificacion: bonificacion ? bonificacion.abs() : null,
        montoFactura,
        iva,
        ivaFormula: ivaC?.formula ?? null,
        observaciones: txt(g("observaciones")) || null,
        pagoDuplicado: false,
        problemas,
        estado: "OK",
      });
    }
    if (formulasIva.size > 1) problemasGenerales.push({ severidad: "ADVERTENCIA", codigo: "FORMULAS_IVA_DISTINTAS", hoja: m.hoja, mensaje: `La columna IVA usa ${formulasIva.size} fórmulas distintas (${[...formulasIva.keys()].join("; ")}). Revisar filas que no siguen el patrón.` });

    // Descripción declarada vs. filas
    const desc = t.metadatos.find((x) => x.clave === "descripcion");
    if (desc) {
      const nums = [...desc.valor.matchAll(/(\d+)/g)].map((x) => Number(x[1]));
      const declaradas = nums.reduce((a, b) => a + b, 0);
      const filasHoja = registros.filter((r) => r.hoja === m.hoja).length;
      if (declaradas && declaradas !== filasHoja) problemasGenerales.push({ severidad: "ADVERTENCIA", codigo: "CANTIDAD_UNIDADES_NO_COINCIDE", hoja: m.hoja, ref: desc.ref, mensaje: `La planilla declara ${declaradas} unidades ("${desc.valor}") pero la tabla tiene ${filasHoja} filas.` });
    }
    if (t.columnasSinEncabezado.length) problemasGenerales.push({ severidad: "INFO", codigo: "COLUMNAS_SIN_ENCABEZADO", hoja: m.hoja, mensaje: `Columnas con datos sin encabezado (no se importan): ${t.columnasSinEncabezado.map((c) => c.letra).join(", ")}.` });
    if (t.bloquesNoTabulares.length) problemasGenerales.push({ severidad: "INFO", codigo: "BLOQUE_NO_TABULAR", hoja: m.hoja, mensaje: `${t.bloquesNoTabulares.length} filas fuera de la tabla (egresos, saldos, notas) — se listan para revisión manual, no se importan automáticamente.` });
  }

  // ─── Controles cruzados ───
  const porHoja = new Map<string, RegistroFila[]>();
  for (const r of registros) porHoja.set(r.hoja, [...(porHoja.get(r.hoja) ?? []), r]);
  for (const [hoja, rs] of porHoja) {
    const vistos = new Map<string, RegistroFila>();
    for (const r of rs) {
      const k = r.unidad.identificador.toLowerCase();
      if (vistos.has(k)) { r.estado = "DUPLICADO"; r.problemas.push({ severidad: "ERROR", codigo: "UNIDAD_DUPLICADA", hoja, ref: `fila ${r.fila}`, mensaje: `Unidad "${r.unidad.identificador}" repetida en la misma hoja (fila ${vistos.get(k)!.fila}).` }); }
      else vistos.set(k, r);
    }
    const medidores = new Map<string, string[]>();
    for (const r of rs) if (r.unidad.medidorAnde && r.unidad.medidorAnde !== "0") medidores.set(r.unidad.medidorAnde, [...(medidores.get(r.unidad.medidorAnde) ?? []), r.unidad.identificador]);
    for (const [med, us] of medidores) if (us.length > 1) problemasGenerales.push({ severidad: "ADVERTENCIA", codigo: "MEDIDOR_COMPARTIDO", hoja, mensaje: `El mismo NIS ANDE (${med}) figura en las unidades ${us.join(", ")}. Verificar si es medidor compartido o error de carga.` });
  }

  // Mismo RUC/CI para inquilinos de nombre distinto (o en unidades distintas)
  const porRuc = new Map<string, Set<string>>();
  for (const r of registros) {
    const base = r.inquilino?.ruc ? normalizarRuc(r.inquilino.ruc)?.base : null;
    if (base) porRuc.set(base, new Set([...(porRuc.get(base) ?? []), `${r.unidad.identificador}`]));
  }
  for (const [base, us] of porRuc) if (us.size > 1) problemasGenerales.push({ severidad: "ADVERTENCIA", codigo: "RUC_EN_VARIAS_UNIDADES", mensaje: `El RUC/CI ${base} figura en las unidades ${[...us].join(", ")}: verificar si es el mismo inquilino en dos unidades o un error de carga.` });

  // Entre períodos: cambios de alquiler, de inquilino, pagos repetidos
  const porUnidad = new Map<string, RegistroFila[]>();
  // Las hojas de referencia (sin período) no participan en controles de pagos/alquiler entre períodos.
  for (const r of registros) if (r.estado !== "DUPLICADO" && r.periodo) porUnidad.set(r.unidad.identificador.toLowerCase(), [...(porUnidad.get(r.unidad.identificador.toLowerCase()) ?? []), r]);
  for (const rs of porUnidad.values()) {
    rs.sort((a, b) => (a.periodo ?? "").localeCompare(b.periodo ?? ""));
    for (let i = 1; i < rs.length; i++) {
      const a = rs[i - 1], b = rs[i];
      if (a.alquiler && b.alquiler && !a.alquiler.equals(b.alquiler)) b.problemas.push({ severidad: "ADVERTENCIA", codigo: "ALQUILER_CAMBIA", hoja: b.hoja, ref: `fila ${b.fila}`, mensaje: `Alquiler de "${b.unidad.identificador}" cambia de ${a.alquiler} (${a.periodo}) a ${b.alquiler} (${b.periodo}) sin adenda registrada.` });
      if (a.inquilino && b.inquilino && a.inquilino.nombre.toLowerCase() !== b.inquilino.nombre.toLowerCase()) b.problemas.push({ severidad: "ADVERTENCIA", codigo: "INQUILINO_CAMBIA", hoja: b.hoja, ref: `fila ${b.fila}`, mensaje: `Cambio de inquilino en "${b.unidad.identificador}" entre ${a.periodo} y ${b.periodo}.` });
      if (a.pagoTotal && b.pagoTotal && a.fechaPago && b.fechaPago && a.pagoTotal.greaterThan(0) && a.pagoTotal.equals(b.pagoTotal) && a.fechaPago.getTime() === b.fechaPago.getTime()) {
        b.estado = "DUPLICADO";
        b.pagoDuplicado = true;
        b.problemas.push({ severidad: "ERROR", codigo: "PAGO_DUPLICADO_PROBABLE", hoja: b.hoja, ref: `fila ${b.fila}`, mensaje: `Mismo pago (${b.pagoTotal}, ${b.fechaPago.toISOString().slice(0, 10)}) ya figura en ${a.periodo}. El pago no se registra dos veces (la obligación del período sí se importa); confirme manualmente si es otro pago.` });
      }
    }
  }

  for (const r of registros) {
    if (r.estado === "DUPLICADO") continue;
    if (r.problemas.some((x) => x.severidad === "ERROR")) r.estado = "ERROR";
    else if (r.problemas.some((x) => x.severidad === "ADVERTENCIA")) r.estado = "ADVERTENCIA";
  }

  const periodos = [...new Set(registros.map((r) => r.periodo).filter(Boolean) as string[])].sort();
  const montoPagosPorPeriodo: Record<string, string> = {};
  for (const per of periodos) montoPagosPorPeriodo[per] = sumar(registros.filter((r) => r.periodo === per && r.estado !== "DUPLICADO" && r.pagoTotal).map((r) => r.pagoTotal!)).toString();
  const todos = [...problemasGenerales, ...registros.flatMap((r) => r.problemas)];
  const nombres = new Set(registros.filter((r) => r.inquilino).map((r) => `${r.inquilino!.nombre.toLowerCase()}|${normalizarTelefono(r.inquilino!.telefono) ?? ""}`));

  return {
    hojasProcesadas,
    hojasOmitidas,
    registros,
    problemasGenerales,
    resumen: {
      unidadesDetectadas: porUnidad.size,
      inquilinosDetectados: nombres.size,
      periodos,
      filas: registros.length,
      errores: todos.filter((x) => x.severidad === "ERROR").length,
      advertencias: todos.filter((x) => x.severidad === "ADVERTENCIA").length,
      duplicados: registros.filter((r) => r.estado === "DUPLICADO").length,
      pagosDetectados: registros.filter((r) => r.estado !== "DUPLICADO" && r.pagoTotal && r.pagoTotal.greaterThan(0)).length,
      montoPagosPorPeriodo,
    },
    bloqueante: problemasGenerales.some((x) => x.severidad === "ERROR"),
  };
}
