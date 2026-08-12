// Urbannit — Términos y Condiciones de Estadía, para el huésped (URB-CON-005).
// Siguiente pieza del Master Document Index de la Fase A (proyecto Legal & Operations OS),
// a pedido explicito del founder despues de aprobar URB-CON-001/URB-CON-002 (2026-08-12).
//
// A diferencia de URB-CON-001 (contrato Urbannit<->Propietario), este documento no tiene
// benchmark de GoHost disponible (el PDF que aporto el founder no incluia sus propios T&C de
// huesped). El contenido combina: (a) datos ya confirmados en las propuestas comerciales de
// Urbannit (D-056) -- tarifa de limpieza cobrada aparte al huesped, 20-30 USD; (b) practica
// estandar de la industria de alquiler temporal (no se permiten fiestas, el huesped responde
// por daños, se exige documento de identidad) marcada como tal, nunca como requisito legal;
// (c) puntos genuinamente no decididos por el founder (horarios de check-in/out, politica de
// mascotas, horario de silencio, plazo de objetos olvidados) dejados como placeholder, NO
// inventados. Ver projects/urbannit/legal-operations-os/01-notas-urb-con-001.md para el
// criterio de por que no se inventan estos numeros.
//
// La aceptacion es digital (vía la reserva en la plataforma), no firma manuscrita -- por eso
// no lleva bloque de firmas como URB-CON-001/002; se deja un renglon opcional de acuse de
// recibo para check-in presencial si Urbannit decide usarlo.
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, Header, Footer, PageNumber } = docx;
const fs = require("fs");
const path = require("path");

const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

const CARBON = "2A2620", GREY = "6B6154", GOLD_D = "A87D22", LINE = "D8CDB8";
const POP = "Poppins";
const TW = 9000;

function H1(n, t) {
  return new Paragraph({ spacing: { before: 260, after: 100 }, keepNext: true, children: [
    new TextRun({ text: n + ": ", font: POP, bold: true, size: 21, color: GOLD_D }),
    new TextRun({ text: t, font: POP, bold: true, size: 21, color: CARBON }),
  ]});
}
function cl(n, t) {
  return new Paragraph({ spacing: { after: 110 }, alignment: AlignmentType.JUSTIFIED, children: [
    new TextRun({ text: n + ". ", font: POP, bold: true, size: 19, color: CARBON }),
    new TextRun({ text: t, font: POP, size: 19, color: CARBON }),
  ]});
}
const sp = (after = 100) => new Paragraph({ spacing: { after }, children: [new TextRun({ text: "", size: 2 })] });

const isoDark = fs.readFileSync(path.join(__dirname, "urb_iso.png"));

// ---------- ENCABEZADO ----------
const encabezado = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 0 }, children: [
    new ImageRun({ type: "png", data: isoDark, transformation: { width: 46, height: 46 } }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 90, after: 20 }, children: [
    new TextRun({ text: "URBANNIT", font: POP, bold: true, size: 24, color: CARBON, characterSpacing: 70 }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
    new TextRun({ text: "gestionado por Meridiano Capital", font: POP, italics: true, size: 15, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
    new TextRun({ text: "TÉRMINOS Y CONDICIONES DE ESTADÍA", font: POP, bold: true, size: 24, color: CARBON }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 340 }, children: [
    new TextRun({ text: "URB-CON-005 · versión 1.0 (borrador)", font: POP, italics: true, size: 15, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 260 }, children: [
    new TextRun({
      text: "Estos Términos y Condiciones rigen la estadía del huésped en la propiedad reservada a través de "
        + "Airbnb, Booking u otra plataforma de reserva, administrada por Urbannit (Campo Agreste S.A. — RUC "
        + "80093513-6), gestionado por Meridiano Capital. La confirmación de la reserva y el pago a través de la "
        + "plataforma implican la aceptación de estos Términos.",
      font: POP, size: 19, color: CARBON,
    }),
  ]}),
];

// ---------- CLÁUSULAS ----------
const s1 = [
  H1("PRIMERA", "RESERVA Y PAGO"),
  cl("1.1", "El pago de la estadía se realiza en su totalidad a través de la plataforma de reserva utilizada (Airbnb, Booking u otra). URBANNIT no solicita ni procesa cobros por fuera de la plataforma, salvo cargos adicionales expresamente informados en el anuncio o la reserva."),
];

const s2 = [
  H1("SEGUNDA", "CHECK-IN Y CHECK-OUT"),
  cl("2.1", "El check-in está disponible desde las [HORA] y el check-out hasta las [HORA], salvo coordinación previa con URBANNIT."),
  cl("2.2", "El huésped debe presentar un documento de identidad válido al momento del check-in."),
  cl("2.3", "El ingreso de personas no registradas en la reserva debe coordinarse previamente con URBANNIT."),
  cl("2.4", "Late check-out y early check-in están sujetos a disponibilidad y deben coordinarse con URBANNIT con la mayor anticipación posible."),
];

const s3 = [
  H1("TERCERA", "TARIFA DE LIMPIEZA"),
  cl("3.1", "La limpieza entre estadías se cobra como cargo independiente en la reserva y cubre limpieza, lavandería y reposición básica de EL INMUEBLE. No forma parte de la tarifa por noche."),
];

const s4 = [
  H1("CUARTA", "CANCELACIONES Y MODIFICACIONES"),
  cl("4.1", "Las cancelaciones y modificaciones de la reserva se rigen por la política de cancelación indicada en la plataforma utilizada al momento de reservar (Airbnb, Booking u otra)."),
];

const s5 = [
  H1("QUINTA", "NORMAS DE CONVIVENCIA"),
  cl("5.1", "No se permiten fiestas ni eventos en EL INMUEBLE."),
  cl("5.2", "Se debe respetar el descanso de los vecinos, especialmente entre las [HORA] y las [HORA]."),
  cl("5.3", "Mascotas: [PERMITIDO / NO PERMITIDO — según se indique en el anuncio de la propiedad]."),
  cl("5.4", "El huésped debe cumplir el reglamento interno del edificio o consorcio donde se encuentra EL INMUEBLE."),
];

const s6 = [
  H1("SEXTA", "DAÑOS Y RESPONSABILIDAD"),
  cl("6.1", "El huésped es responsable de los daños que cause a EL INMUEBLE o a los bienes detallados en el ANEXO I durante su estadía, más allá del desgaste normal de uso."),
  cl("6.2", "URBANNIT podrá reportar los daños a la plataforma de reserva utilizada para su gestión conforme a la política de esa plataforma, sin garantizar cobertura total o parcial del daño."),
];

const s7 = [
  H1("SÉPTIMA", "OBJETOS OLVIDADOS"),
  cl("7.1", "URBANNIT resguardará los objetos olvidados por un período de [PLAZO] desde el check-out y podrá coordinar su devolución al huésped, a cargo de este. Transcurrido ese plazo sin reclamo, URBANNIT podrá disponer de ellos."),
];

const s8 = [
  H1("OCTAVA", "EMERGENCIAS Y CONTACTO"),
  cl("8.1", "Ante cualquier emergencia o inconveniente durante la estadía, el huésped puede contactar a URBANNIT al +595 982 853 111 o a urbannit@meridianocapital.net."),
];

const s9 = [
  H1("NOVENA", "SOLUCIÓN DE CONTROVERSIAS"),
  cl("9.1", "Para los casos de controversias que pudieran surgir en relación con la estadía, las partes acuerdan la competencia y jurisdicción de los Tribunales de la Capital de la República del Paraguay, con exclusión de cualquier otra."),
];

// ---------- ACUSE DE RECIBO (opcional, check-in presencial) ----------
const acuse = [
  sp(300),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE }, left: { style: BorderStyle.SINGLE, size: 4, color: LINE }, right: { style: BorderStyle.SINGLE, size: 4, color: LINE } },
    rows: [new TableRow({ children: [new TableCell({ width: { size: TW, type: WidthType.DXA }, margins: { top: 180, bottom: 180, left: 220, right: 220 }, children: [
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Acuse de recibo (opcional, check-in presencial)", font: POP, bold: true, size: 17, color: CARBON })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "Confirmo haber leído y aceptado estos Términos y Condiciones de Estadía.", font: POP, size: 17, color: CARBON })] }),
      new Paragraph({ children: [new TextRun({ text: "Nombre del huésped: ______________________________  Firma: ______________________  Fecha: ____________", font: POP, size: 16, color: GREY })] }),
    ]})]})],
  }),
];

const doc = new Document({
  creator: "Urbannit — gestionado por Meridiano Capital", title: "Términos y Condiciones de Estadía (borrador URB-CON-005)",
  styles: { default: { document: { run: { font: POP, size: 19, color: CARBON } } } },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "URBANNIT — gestionado por Meridiano Capital · Términos y Condiciones de Estadía", font: POP, size: 14, color: GREY }),
    ]})]})},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Borrador · Página ", font: POP, size: 14, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: POP, size: 14, color: GREY }),
    ]})]})},
    children: [...encabezado, ...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7, ...s8, ...s9, ...acuse],
  }],
});

const outFile = path.join(OUT_DIR, "Urbannit_Terminos_Condiciones_Huesped_BORRADOR.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outFile, buf); console.log("OK:", outFile); });
