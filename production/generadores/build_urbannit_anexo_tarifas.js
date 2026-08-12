// Urbannit — Anexo: Tarifas y Comisiones (URB-CON-003).
// Anexo integrante de URB-CON-001 (Contrato de Administracion de Alquiler Temporal, D-059).
//
// Objetivo: consolidar en un solo lugar todos los costos y comisiones que hoy estan dispersos
// entre distintas clausulas del contrato principal (Cuarta: honorarios: Sexta: reposicion de
// blanqueria/utensilios; Novena: seguro), para que el propietario tenga una sola hoja de
// referencia clara -- ninguna cifra nueva, todo tomado de URB-CON-001 y de la Propuesta de
// Gestion de Alquiler Temporal (D-056), incluido el ejemplo numerico ya aprobado en esa pieza
// comercial (70 USD/noche, 20 noches).
//
// Nota de gobernanza (RN-04, D-057): este documento se entrega directamente al propietario
// real que firma el contrato -- no es publicidad masiva, es la contraparte formal del 20% de
// comision que el sitio nunca publica. Coherente con como ya se maneja el resto de la
// papeleria formal de Urbannit.
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, Header, Footer, PageNumber } = docx;
const fs = require("fs");
const path = require("path");

const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

const CARBON = "2A2620", GREY = "6B6154", GOLD_D = "A87D22", LINE = "D8CDB8", SAND = "F1E8D8";
const POP = "Poppins";
const TW = 9000;

function H1(t) {
  return new Paragraph({ spacing: { before: 280, after: 100 }, keepNext: true, children: [
    new TextRun({ text: t, font: POP, bold: true, size: 21, color: GOLD_D }),
  ]});
}
function cell(text, { w, head = false, fill = null, align = AlignmentType.LEFT, bold = false } = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: [new Paragraph({ alignment: align, children: [
      new TextRun({ text, font: POP, size: 17, bold: head || bold, color: head ? "FFFFFF" : CARBON }),
    ]})],
  });
}
function allBorders(color, sz) { const b = { style: BorderStyle.SINGLE, size: sz, color }; return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b }; }
const sp = (after = 100) => new Paragraph({ spacing: { after }, children: [new TextRun({ text: "", size: 2 })] });

const isoDark = fs.readFileSync(path.join(__dirname, "urb_iso.png"));

// ---------- ENCABEZADO ----------
const encabezado = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 260, after: 0 }, children: [
    new ImageRun({ type: "png", data: isoDark, transformation: { width: 42, height: 42 } }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 20 }, children: [
    new TextRun({ text: "URBANNIT", font: POP, bold: true, size: 22, color: CARBON, characterSpacing: 60 }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 260 }, children: [
    new TextRun({ text: "gestionado por Meridiano Capital", font: POP, italics: true, size: 14, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
    new TextRun({ text: "ANEXO — TARIFAS Y COMISIONES", font: POP, bold: true, size: 23, color: CARBON }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
    new TextRun({ text: "URB-CON-003 · versión 1.0 (borrador) · Anexo integrante del Contrato de Administración de Alquiler Temporal (URB-CON-001)", font: POP, italics: true, size: 14, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 260 }, children: [
    new TextRun({
      text: "Este Anexo resume, en un solo lugar, todos los costos y comisiones aplicables a la gestión del inmueble "
        + "ubicado en [DIRECCIÓN COMPLETA], Asunción, en el marco del contrato entre [NOMBRE DEL PROPIETARIO] (EL "
        + "PROPIETARIO) y Campo Agreste S.A. — RUC 80093513-6 (URBANNIT), de fecha [FECHA]. No modifica ni reemplaza "
        + "ninguna cláusula del contrato principal — solo la consolida para consulta rápida.",
      font: POP, size: 18, color: CARBON,
    }),
  ]}),
];

// ---------- TABLA RESUMEN ----------
const W = [2600, 2200, 2200, 2000];
function fila(concepto, monto, aCargoDe, referencia) {
  return new TableRow({ children: [
    cell(concepto, { w: W[0] }),
    cell(monto, { w: W[1] }),
    cell(aCargoDe, { w: W[2] }),
    cell(referencia, { w: W[3] }),
  ]});
}
const tablaResumen = [
  H1("Resumen de costos y comisiones"),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: W, borders: allBorders(LINE, 4),
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell("Concepto", { w: W[0], head: true, fill: GOLD_D }),
        cell("Monto / base", { w: W[1], head: true, fill: GOLD_D }),
        cell("A cargo de", { w: W[2], head: true, fill: GOLD_D }),
        cell("Cláusula", { w: W[3], head: true, fill: GOLD_D }),
      ]}),
      fila("Honorarios de administración", "20% IVA incluido, sobre el bruto de ocupación mensual", "EL PROPIETARIO (se descuenta en la liquidación mensual)", "Cláusula 4.1"),
      fila("Tarifa de limpieza entre estadías", "Aprox. 20–30 USD por estadía (informativo — el monto exacto se fija en la reserva)", "EL HUÉSPED (no reduce el ingreso del propietario)", "Cláusula 4.4"),
      fila("Reposición de blanquería/utensilios dañados o perdidos", "Según costo real, con detalle e informe de URBANNIT", "EL PROPIETARIO (descontado de la siguiente liquidación) — salvo reclamo al huésped responsable o cobertura del seguro", "Cláusula 6.3"),
      fila("Seguro de responsabilidad civil", "[MONTO — PENDIENTE DE DEFINIR, ver Cláusula Novena]", "EL PROPIETARIO (reembolsa a URBANNIT)", "Cláusula 9.2"),
      fila("Registro SENATUR / Registur", "No aplica por el momento — el inmueble no se inscribe en esta etapa", "—", "N/A (decisión operativa, D-059)"),
    ],
  }),
  sp(200),
];

// ---------- EJEMPLO NUMÉRICO (ya usado y aprobado en la Propuesta de Gestión de Alquiler Temporal, D-056) ----------
const ejemplo = [
  H1("Ejemplo ilustrativo de liquidación"),
  new Paragraph({ spacing: { after: 100 }, children: [new TextRun({
    text: "Mismo ejemplo ya utilizado en la Propuesta de Gestión de Alquiler Temporal, con números simples para ilustrar la mecánica:",
    font: POP, size: 17, color: CARBON,
  })]}),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [5400, 3600], borders: allBorders(LINE, 4),
    rows: [
      new TableRow({ tableHeader: true, children: [cell("Concepto", { w: 5400, head: true, fill: GOLD_D }), cell("Monto", { w: 3600, head: true, fill: GOLD_D, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Precio por noche", { w: 5400, fill: SAND }), cell("70 USD", { w: 3600, fill: SAND, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Noches ocupadas en el mes", { w: 5400 }), cell("20", { w: 3600, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Total generado (70 × 20)", { w: 5400, fill: SAND }), cell("1.400 USD", { w: 3600, fill: SAND, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Comisión de la plataforma (Airbnb, aprox. 3%)", { w: 5400 }), cell("− 42 USD", { w: 3600, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Después de la plataforma", { w: 5400, fill: SAND }), cell("1.358 USD", { w: 3600, fill: SAND, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Comisión de URBANNIT (20% sobre 70 USD × 20 noches)", { w: 5400 }), cell("− 280 USD", { w: 3600, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Ingreso neto del PROPIETARIO en el mes", { w: 5400, fill: SAND, bold: true }), cell("1.078 USD", { w: 3600, fill: SAND, align: AlignmentType.CENTER, bold: true })] }),
    ],
  }),
  sp(120),
  new Paragraph({ children: [new TextRun({ text: "Cifra ilustrativa, no constituye garantía de rentabilidad. No incluye eventuales descuentos por reposición de blanquería/utensilios ni seguro, que se liquidan aparte si corresponden.", font: POP, italics: true, size: 15, color: GREY })] }),
];

const doc = new Document({
  creator: "Urbannit — gestionado por Meridiano Capital", title: "Anexo — Tarifas y Comisiones (borrador URB-CON-003)",
  styles: { default: { document: { run: { font: POP, size: 18, color: CARBON } } } },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "URBANNIT — gestionado por Meridiano Capital · Anexo — Tarifas y Comisiones", font: POP, size: 14, color: GREY }),
    ]})]})},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Borrador · Anexo de URB-CON-001 · Página ", font: POP, size: 14, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: POP, size: 14, color: GREY }),
    ]})]})},
    children: [...encabezado, ...tablaResumen, ...ejemplo],
  }],
});

const outFile = path.join(OUT_DIR, "Urbannit_Anexo_Tarifas_Comisiones_BORRADOR.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outFile, buf); console.log("OK:", outFile); });
