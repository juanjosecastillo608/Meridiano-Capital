// Urbannit — Formato de Liquidación Mensual al Propietario (URB-REP-001).
// Formaliza lo que la Clausula 4.2 de URB-CON-001 y la Propuesta de Gestion de Alquiler
// Temporal (D-056) ya prometen narrativamente ("liquidacion mensual con el detalle completo:
// reservas, fechas, precio de cada estadia, ingresos, comisiones aplicadas e importe final") --
// ahora como una plantilla real que URBANNIT completa cada mes por propiedad.
//
// No es un contrato -- es un reporte operativo (Nivel 10 de la arquitectura de la Fase A). Sin
// firma; lleva un renglon de "preparado por / revisado por" para trazabilidad interna.
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
    margins: { top: 70, bottom: 70, left: 90, right: 90 },
    children: [new Paragraph({ alignment: align, children: [
      new TextRun({ text, font: POP, size: 16, bold: head || bold, color: head ? "FFFFFF" : CARBON }),
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
    new TextRun({ text: "LIQUIDACIÓN MENSUAL AL PROPIETARIO", font: POP, bold: true, size: 23, color: CARBON }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
    new TextRun({ text: "URB-REP-001 · versión 1.0 (borrador) · Conforme a la Cláusula 4.2 del Contrato de Administración de Alquiler Temporal (URB-CON-001)", font: POP, italics: true, size: 14, color: GREY }),
  ]}),
];

// ---------- DATOS DEL PERÍODO ----------
const W2 = [2250, 2250, 2250, 2250];
const datos = [
  H1("Datos del período"),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: W2, borders: allBorders(LINE, 4),
    rows: [
      new TableRow({ children: [cell("Propietario", { w: W2[0], bold: true, fill: SAND }), cell("[NOMBRE DEL PROPIETARIO]", { w: W2[1] }), cell("Inmueble", { w: W2[2], bold: true, fill: SAND }), cell("[DIRECCIÓN]", { w: W2[3] })] }),
      new TableRow({ children: [cell("Período liquidado", { w: W2[0], bold: true, fill: SAND }), cell("[MES / AÑO]", { w: W2[1] }), cell("Fecha de emisión", { w: W2[2], bold: true, fill: SAND }), cell("[FECHA]", { w: W2[3] })] }),
    ],
  }),
  sp(220),
];

// ---------- DETALLE DE RESERVAS ----------
const WR = [1300, 1300, 1300, 1300, 1400, 1400, 1300];
const detalleReservas = [
  H1("Detalle de reservas del período"),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: WR, borders: allBorders(LINE, 4),
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell("Check-in", { w: WR[0], head: true, fill: GOLD_D }),
        cell("Check-out", { w: WR[1], head: true, fill: GOLD_D }),
        cell("Plataforma", { w: WR[2], head: true, fill: GOLD_D }),
        cell("Noches", { w: WR[3], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
        cell("Tarifa/noche", { w: WR[4], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
        cell("Total estadía", { w: WR[5], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
        cell("Tarifa limpieza", { w: WR[6], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
      ]}),
      ...Array.from({ length: 5 }, (_, i) => new TableRow({ children: [
        cell("", { w: WR[0], fill: i % 2 ? SAND : null }), cell("", { w: WR[1], fill: i % 2 ? SAND : null }),
        cell("", { w: WR[2], fill: i % 2 ? SAND : null }), cell("", { w: WR[3], fill: i % 2 ? SAND : null }),
        cell("", { w: WR[4], fill: i % 2 ? SAND : null }), cell("", { w: WR[5], fill: i % 2 ? SAND : null }),
        cell("", { w: WR[6], fill: i % 2 ? SAND : null }),
      ]})),
    ],
  }),
  new Paragraph({ spacing: { before: 80, after: 220 }, children: [new TextRun({ text: "La tarifa de limpieza es un cargo al huésped y no forma parte de la base de cálculo de la comisión (Cláusula 4.4 de URB-CON-001) — se incluye en esta tabla solo a título informativo.", font: POP, italics: true, size: 14, color: GREY })] }),
];

// ---------- RESUMEN DE LIQUIDACIÓN ----------
const WL = [5400, 3600];
function filaLiq(concepto, monto, opts = {}) {
  return new TableRow({ children: [cell(concepto, { w: WL[0], ...opts }), cell(monto, { w: WL[1], align: AlignmentType.CENTER, ...opts })] });
}
const resumenLiquidacion = [
  H1("Resumen de la liquidación"),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: WL, borders: allBorders(LINE, 4),
    rows: [
      new TableRow({ tableHeader: true, children: [cell("Concepto", { w: WL[0], head: true, fill: GOLD_D }), cell("Monto", { w: WL[1], head: true, fill: GOLD_D, align: AlignmentType.CENTER })] }),
      filaLiq("Total generado por ocupación (bruto)", "[MONTO]"),
      filaLiq("Comisión de la(s) plataforma(s) de reserva", "− [MONTO]", { fill: SAND }),
      filaLiq("Honorarios de URBANNIT (20% IVA incluido, Cláusula 4.1)", "− [MONTO]"),
      filaLiq("Reposición de blanquería/utensilios (si corresponde, Cláusula 6.3)", "− [MONTO]", { fill: SAND }),
      filaLiq("Otros gastos del inmueble a cargo del PROPIETARIO (detallar)", "− [MONTO]"),
      filaLiq("Importe neto transferido al PROPIETARIO", "[MONTO]", { bold: true, fill: SAND }),
    ],
  }),
  sp(160),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Comprobantes de respaldo adjuntos: [SÍ / NO — detallar cuáles]", font: POP, size: 17, color: CARBON })] }),
  new Paragraph({ spacing: { after: 260 }, children: [new TextRun({ text: "Transferencia realizada a: [CUENTA BANCARIA INFORMADA POR EL PROPIETARIO], con fecha [FECHA].", font: POP, size: 17, color: CARBON })] }),
];

// ---------- PIE ----------
const pie = [
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [4500, 4500],
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 4500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Preparado por: ______________________", font: POP, size: 16, color: GREY })] })] }),
      new TableCell({ width: { size: 4500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Revisado por: ______________________", font: POP, size: 16, color: GREY })] })] }),
    ]})],
  }),
];

const doc = new Document({
  creator: "Urbannit — gestionado por Meridiano Capital", title: "Liquidación Mensual al Propietario (formato URB-REP-001)",
  styles: { default: { document: { run: { font: POP, size: 18, color: CARBON } } } },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 900, right: 900 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "URBANNIT — gestionado por Meridiano Capital · Liquidación Mensual", font: POP, size: 14, color: GREY }),
    ]})]})},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Formato interno · Página ", font: POP, size: 14, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: POP, size: 14, color: GREY }),
    ]})]})},
    children: [...encabezado, ...datos, ...detalleReservas, ...resumenLiquidacion, ...pie],
  }],
});

const outFile = path.join(OUT_DIR, "Urbannit_Liquidacion_Mensual_FORMATO.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outFile, buf); console.log("OK:", outFile); });
