// Urbannit — Anexo I: Inventario del Inmueble (URB-CON-002).
// Anexo integrante de URB-CON-001 (Contrato de Administracion de Alquiler Temporal, D-059,
// Clausula 2.3: "el INMUEBLE cuenta con bienes y equipamiento... detallados en el documento
// individualizado como 'ANEXO I'").
//
// Contenido de las categorias de equipamiento (ropa de cama/baño, cocina, baño, limpieza,
// lavado/secado, stock) tomado tal cual del checklist ya redactado en la Propuesta de trabajo
// para propietarios (D-056, build_urbannit_propuesta_propietarios.js, seccion 2). Las
// categorias de Mobiliario, Electrodomesticos/climatizacion y Llaves y accesos son una
// extension operativa mia (no estaban en las dos propuestas comerciales ni en el contrato de
// GoHost, que no incluia su propio Anexo I) -- necesarias para que el acta de entrega cubra lo
// que de hecho hay que inventariar en una propiedad real. Ver
// projects/urbannit/legal-operations-os/01-notas-urb-con-001.md para el detalle.
//
// Formato: tabla por categoria (Item | Cant. entregada | Estado | Observaciones), Item
// pre-cargado con el checklist estandar, el resto en blanco para completar por propiedad --
// mismo criterio sobrio que URB-CON-001 (build_urbannit_contrato_administracion.js).
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Header, Footer, PageNumber } = docx;
const fs = require("fs");
const path = require("path");

const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

const CARBON = "2A2620", GREY = "6B6154", GOLD_D = "A87D22", LINE = "D8CDB8", SAND = "F1E8D8";
const POP = "Poppins";
const TW = 9000;
const W = [4600, 1400, 1400, 1600]; // Item / Cant. / Estado / Observaciones

function H1(t) {
  return new Paragraph({ spacing: { before: 300, after: 100 }, keepNext: true, children: [
    new TextRun({ text: t, font: POP, bold: true, size: 21, color: GOLD_D }),
  ]});
}
function cell(text, { w, head = false, fill = null, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ alignment: align, children: [
      new TextRun({ text, font: POP, size: 16, bold: head, color: head ? "FFFFFF" : CARBON }),
    ]})],
  });
}
function allBorders(color, sz) { const b = { style: BorderStyle.SINGLE, size: sz, color }; return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b }; }

function categoria(nombre, items) {
  const header = new TableRow({ tableHeader: true, children: [
    cell("Ítem", { w: W[0], head: true, fill: GOLD_D }),
    cell("Cant. entregada", { w: W[1], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
    cell("Estado", { w: W[2], head: true, fill: GOLD_D, align: AlignmentType.CENTER }),
    cell("Observaciones", { w: W[3], head: true, fill: GOLD_D }),
  ]});
  const rows = items.map((it, i) => new TableRow({ children: [
    cell(it, { w: W[0], fill: i % 2 ? SAND : null }),
    cell("", { w: W[1], fill: i % 2 ? SAND : null }),
    cell("", { w: W[2], fill: i % 2 ? SAND : null }),
    cell("", { w: W[3], fill: i % 2 ? SAND : null }),
  ]}));
  return [
    H1(nombre),
    new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: W, borders: allBorders(LINE, 4), rows: [header, ...rows] }),
    new Paragraph({ spacing: { after: 180 }, children: [new TextRun({ text: "", size: 2 })] }),
  ];
}

const isoDark = fs.readFileSync(path.join(__dirname, "urb_iso.png"));

// ---------- ENCABEZADO ----------
const encabezado = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 0 }, children: [
    new ImageRun({ type: "png", data: isoDark, transformation: { width: 42, height: 42 } }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 20 }, children: [
    new TextRun({ text: "URBANNIT", font: POP, bold: true, size: 22, color: CARBON, characterSpacing: 60 }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 260 }, children: [
    new TextRun({ text: "gestionado por Meridiano Capital", font: POP, italics: true, size: 14, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
    new TextRun({ text: "ANEXO I — INVENTARIO DEL INMUEBLE", font: POP, bold: true, size: 23, color: CARBON }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
    new TextRun({ text: "URB-CON-002 · versión 1.0 (borrador) · Anexo integrante del Contrato de Administración de Alquiler Temporal (URB-CON-001)", font: POP, italics: true, size: 14, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 260 }, children: [
    new TextRun({
      text: "Este Anexo forma parte integral del Contrato de Administración de Alquiler Temporal celebrado entre "
        + "[NOMBRE DEL PROPIETARIO] (EL PROPIETARIO) y Campo Agreste S.A. — RUC 80093513-6 (URBANNIT), respecto del "
        + "inmueble ubicado en [DIRECCIÓN COMPLETA], Asunción, de fecha [FECHA]. Detalla los bienes y el equipamiento "
        + "entregados por EL PROPIETARIO al inicio de la gestión, conforme a la Cláusula 2.3 de dicho contrato.",
      font: POP, size: 18, color: CARBON,
    }),
  ]}),
];

// ---------- CATEGORÍAS (contenido del checklist ya redactado en la Propuesta de trabajo
// para propietarios, D-056, mas las 3 categorias de extension operativa señaladas arriba) ----------
const catMobiliario = categoria("Mobiliario", [
  "Cama(s) con colchón", "Mesa(s) de luz", "Ropero / placard", "Sofá / sillones",
  "Mesa y sillas de comedor", "Escritorio (si aplica)",
]);
const catElectro = categoria("Electrodomésticos y climatización", [
  "Aire acondicionado (unidades)", "Televisor", "Heladera", "Cocina / horno", "Microondas",
  "Cafetera", "Hervidor", "Tostadora", "Lavarropas",
]);
const catCama = categoria("Ropa de cama y baño", [
  "Juegos de sábanas (mínimo 3)", "Toallas de baño", "Toallas pequeñas", "Toalla grande por huésped",
  "Toalla pequeña por huésped", "Alfombra de baño", "Toallas de pileta (si aplica)",
]);
const catCocina = categoria("Cocina equipada", [
  "Ollas y sartenes (varios tamaños)", "Platos llanos", "Platos hondos", "Platos de postre",
  "Vasos", "Copas", "Bowls", "Tazas", "Cubiertos completos", "Cuchillo de cocina",
  "Tabla para cortar", "Abrelatas", "Sacacorchos", "Cucharón", "Espátula", "Colador",
  "Ensaladera", "Fuentes para servir",
]);
const catBanio = categoria("Baño", [
  "Dispensador de jabón", "Botiquín básico", "Dispensador de champú", "Dispensador de crema",
  "Dispensador de jabón de ducha", "Secador de pelo", "Basurero", "Cepillo de inodoro", "Sopapa",
]);
const catLimpieza = categoria("Limpieza y mantenimiento", [
  "Plancha y tabla de planchar", "Trapo de piso", "Repasadores", "Esponja", "Virulana",
  "Escoba", "Palita", "Plumero", "Mopa y balde", "Kit de limpieza para parrilla (si aplica)",
  "Kit churrasquero (si aplica)",
]);
const catLavado = categoria("Lavado y secado", [
  "Tendedero para secar ropa", "Broches",
]);
const catLlaves = categoria("Llaves y accesos", [
  "Juegos de llaves entregados a URBANNIT", "Tipo de cerradura / sistema de acceso",
  "Código o control de portón / edificio (si aplica)",
]);

// ---------- ALMACENAMIENTO ----------
const sAlmacen = [
  H1("Espacio de almacenamiento"),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
    text: "¿EL INMUEBLE cuenta con un espacio (armario cerrado, depósito, o lugar en el edificio) para guardar sábanas y toallas extra, amenities de reposición y productos de limpieza?  Sí ☐   No ☐",
    font: POP, size: 18, color: CARBON,
  })]}),
  new Paragraph({ spacing: { after: 260 }, children: [new TextRun({ text: "Ubicación: ______________________________________________", font: POP, size: 18, color: CARBON })] }),
];

// ---------- FIRMAS ----------
const firmas = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 400 }, children: [
    new TextRun({ text: "EL PROPIETARIO entrega y URBANNIT recibe los bienes y el equipamiento detallados en este Anexo, en el estado indicado en cada categoría, en la fecha consignada en el encabezado.", font: POP, size: 19, color: CARBON }),
  ]}),
  sp(600),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW / 2, TW / 2],
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: TW / 2, type: WidthType.DXA }, children: [
        new Paragraph({ spacing: { before: 300, after: 20 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE } }, children: [new TextRun({ text: "", size: 2 })] }),
        new Paragraph({ children: [new TextRun({ text: "[NOMBRE DEL PROPIETARIO]", font: POP, size: 17, color: CARBON })] }),
        new Paragraph({ children: [new TextRun({ text: "C.I. N° [NÚMERO]", font: POP, size: 16, color: GREY })] }),
      ]}),
      new TableCell({ width: { size: TW / 2, type: WidthType.DXA }, children: [
        new Paragraph({ spacing: { before: 300, after: 20 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE } }, children: [new TextRun({ text: "", size: 2 })] }),
        new Paragraph({ children: [new TextRun({ text: "P/ Campo Agreste S.A. — RUC 80093513-6", font: POP, bold: true, size: 17, color: CARBON })] }),
        new Paragraph({ children: [new TextRun({ text: "(opera Urbannit, gestionado por Meridiano Capital)", font: POP, italics: true, size: 15, color: GREY })] }),
        new Paragraph({ children: [new TextRun({ text: "Juan José Castillo — Representante Legal", font: POP, size: 16, color: CARBON })] }),
      ]}),
    ]})],
  }),
];
function sp(after = 100) { return new Paragraph({ spacing: { after }, children: [new TextRun({ text: "", size: 2 })] }); }

const doc = new Document({
  creator: "Urbannit — gestionado por Meridiano Capital", title: "Anexo I — Inventario del Inmueble (borrador URB-CON-002)",
  styles: { default: { document: { run: { font: POP, size: 18, color: CARBON } } } },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "URBANNIT — gestionado por Meridiano Capital · Anexo I — Inventario del Inmueble", font: POP, size: 14, color: GREY }),
    ]})]})},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Borrador · Anexo de URB-CON-001 · Página ", font: POP, size: 14, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: POP, size: 14, color: GREY }),
    ]})]})},
    children: [
      ...encabezado,
      ...catMobiliario, ...catElectro, ...catCama, ...catCocina, ...catBanio, ...catLimpieza, ...catLavado, ...catLlaves,
      ...sAlmacen,
      ...firmas,
    ],
  }],
});

const outFile = path.join(OUT_DIR, "Urbannit_Anexo_I_Inventario_BORRADOR.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outFile, buf); console.log("OK:", outFile); });
