// Urbannit — Contrato de Administración de Alquiler Temporal (URB-CON-001).
// Primer borrador del contrato Urbannit <-> Propietario, D-059 (2026-08-12).
//
// Fuentes de contenido:
// - Las dos propuestas comerciales ya construidas (D-056): alcance de servicio, modelo de
//   comisión (20% IVA incluido, D-059), tarifa de limpieza a cargo del huesped, liquidacion
//   mensual -- build_urbannit_propuesta_propietarios.js / build_urbannit_propuesta_gestion_temporal.js.
// - Benchmark de estructura: contrato real de un competidor del mismo mercado (GoHost / LosBra
//   SRL, "Contrato GOHOST - Prestacion Servicio 20.08.25.pdf", aportado por el founder
//   2026-08-12) -- SOLO se tomo la estructura de clausulas (practica de mercado real en
//   Asuncion), nunca su texto literal, que es propiedad de un tercero.
// - Confirmaciones directas del founder, D-059: firmante Campo Agreste S.A. (RUC 80093513-6,
//   ver business/06-estructura-societaria-y-portfolio.md); seguro de responsabilidad civil SI
//   se contrata (alcance/monto pendiente de validacion legal); NO se registra por ahora en
//   SENATUR/Registur (decision operativa consciente, por eso esta clausula se omite a
//   proposito); 20% de comision es bruto e incluye IVA.
//
// Documento SOBRIO a proposito -- a diferencia de las dos propuestas comerciales (Ka'a verde,
// cajas de cita, tablas de color), un contrato real prioriza la lectura legal por sobre el
// diseño de marca: texto justificado, clausulado numerado, un solo acento de color minimo
// (isotipo + titulo). Ver knowledge-base/ai/04-director-creativo-y-brand-guardian.md -- esto
// no es una pieza de venta, es papeleria formal (brand/10-arquitectura-meridiano-urbannit.md
// exige igual el endoso "gestionado por Meridiano Capital", que si se respeta).
//
// IMPORTANTE: este generador produce un BORRADOR. La primera pagina lo marca explicitamente
// como pendiente de revision por un abogado paraguayo real -- ningun contenido de este archivo
// debe tratarse como asesoria legal. Ver projects/urbannit/legal-operations-os/ para el detalle
// de que esta confirmado, que es propuesta mia (sin confirmar por el founder) y que requiere
// validacion legal.
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Footer, Header, PageNumber } = docx;
const fs = require("fs");
const path = require("path");

const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

// Paleta deliberadamente reducida frente a las propuestas comerciales: solo carbon (texto),
// gris (metadatos) y un dorado apagado como unico acento (isotipo + titulos de clausula) --
// consistente con el sistema Ka'a de Urbannit pero sin los bloques de color de una pieza de venta.
const CARBON = "2A2620", GREY = "6B6154", GOLD_D = "A87D22", LINE = "D8CDB8", ALERT = "8B3323";
const POP = "Poppins";
const TW = 9000;

function H1(n, t) {
  return new Paragraph({ spacing: { before: 260, after: 100 }, keepNext: true, children: [
    new TextRun({ text: n + ": ", font: POP, bold: true, size: 21, color: GOLD_D }),
    new TextRun({ text: t, font: POP, bold: true, size: 21, color: CARBON }),
  ]});
}
function cl(n, t) {
  // sub-clausula numerada (4.1, 4.2, ...)
  return new Paragraph({ spacing: { after: 110 }, alignment: AlignmentType.JUSTIFIED, children: [
    new TextRun({ text: n + ". ", font: POP, bold: true, size: 19, color: CARBON }),
    new TextRun({ text: t, font: POP, size: 19, color: CARBON }),
  ]});
}
function bullet(t) {
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [
    new TextRun({ text: t, font: POP, size: 18, color: CARBON }),
  ]});
}
const sp = (after = 100) => new Paragraph({ spacing: { after }, children: [new TextRun({ text: "", size: 2 })] });

const isoDark = fs.readFileSync(path.join(__dirname, "urb_iso.png"));

// ---------- AVISO DE BORRADOR (primera pagina) ----------
const aviso = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 0 }, children: [
    new ImageRun({ type: "png", data: isoDark, transformation: { width: 52, height: 52 } }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 40 }, children: [
    new TextRun({ text: "URBANNIT", font: POP, bold: true, size: 28, color: CARBON, characterSpacing: 80 }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [
    new TextRun({ text: "gestionado por Meridiano Capital", font: POP, italics: true, size: 16, color: GREY }),
  ]}),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
    borders: { top: { style: BorderStyle.SINGLE, size: 10, color: ALERT }, bottom: { style: BorderStyle.SINGLE, size: 10, color: ALERT }, left: { style: BorderStyle.SINGLE, size: 10, color: ALERT }, right: { style: BorderStyle.SINGLE, size: 10, color: ALERT } },
    rows: [new TableRow({ children: [new TableCell({ width: { size: TW, type: WidthType.DXA }, margins: { top: 220, bottom: 220, left: 260, right: 260 }, children: [
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "BORRADOR — PENDIENTE DE REVISIÓN LEGAL", font: POP, bold: true, size: 21, color: ALERT })] }),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [new TextRun({
        text: "Este documento es un primer borrador de trabajo (URB-CON-001) y NO debe firmarse en su estado actual. "
          + "Contiene puntos redactados por analogía con la práctica real de un competidor del mismo mercado, no verificados "
          + "de forma independiente por un abogado paraguayo, y al menos un punto (seguro de responsabilidad civil, Cláusula "
          + "Novena) queda expresamente pendiente de esa validación. Ver también las notas de redacción en "
          + "projects/urbannit/legal-operations-os/ del repositorio interno.",
        font: POP, size: 17, color: CARBON,
      })]}),
    ]})]})],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- ENCABEZADO DEL CONTRATO ----------
const encabezado = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 60 }, children: [
    new TextRun({ text: "CONTRATO DE ADMINISTRACIÓN DE ALQUILER TEMPORAL", font: POP, bold: true, size: 24, color: CARBON }),
  ]}),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 340 }, children: [
    new TextRun({ text: "URB-CON-001 · versión 1.0 (borrador)", font: POP, italics: true, size: 15, color: GREY }),
  ]}),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 260 }, children: [
    new TextRun({
      text: "En la ciudad de Asunción, capital de la República del Paraguay, siendo el [DÍA] de [MES] de [AÑO], entre el/la "
        + "Sr./Sra. [NOMBRE COMPLETO DEL PROPIETARIO], con C.I. N° [NÚMERO], en adelante denominado/a EL PROPIETARIO, y por la "
        + "otra, Campo Agreste S.A., con RUC 80093513-6, que opera la marca Urbannit (gestionado por Meridiano Capital), "
        + "representada en este acto por su Representante Legal, el Sr. Juan José Castillo, en adelante denominada URBANNIT, "
        + "convienen en celebrar el presente contrato de administración de alquiler temporal, que se regirá por las cláusulas "
        + "a continuación:",
      font: POP, size: 19, color: CARBON,
    }),
  ]}),
];

// ---------- PRIMERA: ANTECEDENTES ----------
const s1 = [
  H1("PRIMERA", "ANTECEDENTES"),
  cl("1.1", "EL PROPIETARIO declara ser titular del dominio del inmueble ubicado en [DIRECCIÓN COMPLETA], Asunción — [tipo de propiedad: departamento/casa] N° [N°], al que le corresponde el estacionamiento N° [N°], con ANDE NIS [N°], en adelante denominado EL INMUEBLE."),
];

// ---------- SEGUNDA: OBJETO ----------
const s2 = [
  H1("SEGUNDA", "OBJETO"),
  cl("2.1", "EL PROPIETARIO contrata los servicios de URBANNIT para que ésta, en exclusividad, se encargue de gestionar el alquiler temporal (diario/semanal/mensual) de EL INMUEBLE, incluyendo:"),
  bullet("Fotografía profesional de EL INMUEBLE;"),
  bullet("Creación, publicación y optimización del anuncio en plataformas digitales (Airbnb, Booking y otras);"),
  bullet("Gestión de precios, calendario y estrategia comercial;"),
  bullet("Comunicación y atención a huéspedes, y gestión de reservas;"),
  bullet("Gestión del proceso de check-in y check-out;"),
  bullet("Coordinación de la limpieza entre estadías;"),
  bullet("Coordinación de mantenimiento y notificación al PROPIETARIO de arreglos o gastos de conservación necesarios;"),
  bullet("Recepción de los pagos abonados por las plataformas y liquidación mensual al PROPIETARIO."),
  cl("2.2", "EL PROPIETARIO será responsable del pago de todos los gastos de EL INMUEBLE (expensas, internet, ANDE, y otros servicios), salvo lo dispuesto en la Cláusula Sexta respecto de la tarifa de limpieza."),
  cl("2.3", "EL INMUEBLE cuenta con bienes y equipamiento que se entregan en este acto, detallados en el documento individualizado como “ANEXO I — Inventario”, que se adjunta y forma parte integral de este contrato."),
  cl("2.4", "EL PROPIETARIO entiende que, debido al uso que se dará a EL INMUEBLE y a los bienes del ANEXO I, estos sufrirán un desgaste natural por el cual URBANNIT no será responsable."),
];

// ---------- TERCERA: PLAZO Y EXCLUSIVIDAD ----------
const s3 = [
  H1("TERCERA", "PLAZO. EXCLUSIVIDAD"),
  cl("3.1", "El presente contrato será válido desde el [FECHA] hasta el [FECHA], otorgando por dicho período a URBANNIT la exclusividad de la gestión de EL INMUEBLE."),
  cl("3.2", "El contrato será prorrogado automáticamente por períodos iguales, hasta que una de las partes notifique a la otra, por escrito, su intención de no renovarlo."),
];

// ---------- CUARTA: HONORARIOS ----------
const s4 = [
  H1("CUARTA", "HONORARIOS"),
  cl("4.1", "Los honorarios que abonará EL PROPIETARIO a URBANNIT por los servicios prestados serán del veinte por ciento (20%) IVA incluido, del bruto producido por la ocupación mensual de EL INMUEBLE."),
  cl("4.2", "URBANNIT realizará una liquidación mensual, descontando sus honorarios y los gastos realizados en EL INMUEBLE conforme a este contrato, entregando al PROPIETARIO el detalle completo de las reservas (fechas, precio de cada estadía, comisiones aplicadas) junto con los comprobantes de respaldo, y transfiriendo el saldo remanente a la cuenta bancaria que EL PROPIETARIO indique por escrito: cuenta en dólares [BANCO / N° DE CUENTA / TITULAR / C.I.] y/o cuenta en guaraníes [BANCO / N° DE CUENTA / TITULAR / C.I.]."),
  cl("4.3", "EL PROPIETARIO podrá disponer de EL INMUEBLE cuando lo desee, siempre y cuando se encuentre sin ocupación reservada."),
  cl("4.4", "La tarifa de limpieza entre estadías se cobra al huésped como cargo independiente y no reduce el ingreso de EL PROPIETARIO ni integra la base de cálculo de los honorarios de la Cláusula 4.1."),
];

// ---------- QUINTA: RESCISIÓN ----------
const s5 = [
  H1("QUINTA", "RESCISIÓN DEL CONTRATO"),
  cl("5.1", "El presente contrato podrá ser rescindido en cualquier momento por cualquiera de las partes, con una antelación de sesenta (60) días notificada por escrito, sin que ninguna de las partes pueda exigir indemnización ni cláusula penal a la otra, previa liquidación de las cuentas pendientes entre URBANNIT y EL PROPIETARIO."),
];

// ---------- SEXTA: EQUIPAMIENTO, BLANQUERÍA Y UTENSILIOS ----------
const s6 = [
  H1("SEXTA", "EQUIPAMIENTO, BLANQUERÍA Y UTENSILIOS"),
  cl("6.1", "EL PROPIETARIO entrega EL INMUEBLE equipado conforme al ANEXO I, con blanquería en buen estado apta para su uso. En caso de rescisión o no renovación, URBANNIT hará la devolución de EL INMUEBLE con la blanquería en el estado de uso correspondiente al desgaste natural de la actividad."),
  cl("6.2", "EL PROPIETARIO autoriza a URBANNIT a disponer de la blanquería que se encuentre en condiciones extremadamente dañadas, sin necesidad de solicitar permiso previo, notificando al PROPIETARIO sobre dicha disposición."),
  cl("6.3", "En caso de daño o pérdida de utensilios o artículos de EL INMUEBLE durante una estadía, URBANNIT informará al PROPIETARIO con el detalle correspondiente; la reposición será a cuenta del PROPIETARIO y se descontará de la siguiente liquidación, salvo que corresponda un reclamo al huésped responsable o a la cobertura del seguro de la Cláusula Novena."),
];

// ---------- SÉPTIMA: RELACIÓN CON EL PROPIETARIO ----------
const s7 = [
  H1("SÉPTIMA", "RELACIÓN CON EL PROPIETARIO"),
  cl("7.1", "La contratación del personal necesario para los servicios objeto de este contrato (limpieza, mantenimiento, coordinación operativa) corre por cuenta exclusiva de URBANNIT, no existiendo vínculo laboral de ninguna naturaleza entre dicho personal y EL PROPIETARIO. Los pagos de salarios y toda obligación de carácter patronal, emergente de la Legislación del Trabajo y de las Leyes de Seguridad Social, son responsabilidad exclusiva de URBANNIT."),
];

// ---------- OCTAVA: CESIÓN DEL CONTRATO ----------
const s8 = [
  H1("OCTAVA", "CESIÓN DEL CONTRATO"),
  cl("8.1", "URBANNIT no podrá ceder parcial ni totalmente los derechos y obligaciones emergentes del presente contrato sin consentimiento previo y por escrito de EL PROPIETARIO."),
];

// ---------- NOVENA: SEGURO DE RESPONSABILIDAD CIVIL ----------
const s9 = [
  H1("NOVENA", "SEGURO DE RESPONSABILIDAD CIVIL"),
  cl("9.1", "URBANNIT deberá contratar un seguro de responsabilidad civil que cubra los riesgos de daños a EL INMUEBLE y a los bienes detallados en el ANEXO I. El importe de la póliza será de [MONTO — PENDIENTE DE DEFINIR]."),
  cl("9.2", "El costo del seguro será asumido por EL PROPIETARIO, quien deberá reembolsar a URBANNIT cualquier gasto incurrido en su contratación."),
  cl("9.3", "URBANNIT se compromete a gestionar de manera oportuna y efectiva cualquier daño causado por huéspedes a EL INMUEBLE, en coordinación con la plataforma de reserva correspondiente y el seguro contratado. URBANNIT no garantiza a EL PROPIETARIO la cobertura parcial o total del daño — esa resolución queda a cargo de la aseguradora y de la plataforma de reserva."),
];

// ---------- DÉCIMA: DOMICILIOS ----------
const s10 = [
  H1("DÉCIMA", "DOMICILIOS"),
  cl("10.1", "Para todos los efectos legales, las partes fijan los siguientes domicilios: EL PROPIETARIO en EL INMUEBLE, teléfono [TELÉFONO] y correo electrónico [EMAIL]; y URBANNIT en [DOMICILIO LEGAL DE CAMPO AGRESTE S.A.], Asunción, teléfono +595 982 853 111 y correo electrónico urbannit@meridianocapital.net."),
  cl("10.2", "Las comunicaciones y notificaciones entre las partes, sean judiciales o extrajudiciales, deberán ser efectuadas por escrito en los domicilios y correos electrónicos denunciados, donde se tendrán por válidas y practicadas."),
];

// ---------- UNDÉCIMA: SOLUCIÓN DE CONTROVERSIAS ----------
const s11 = [
  H1("UNDÉCIMA", "SOLUCIÓN DE CONTROVERSIAS"),
  cl("11.1", "Para los casos de controversias que pudieran surgir como consecuencia del presente contrato, las partes acuerdan la competencia y jurisdicción de los Tribunales de la Capital de la República del Paraguay, con exclusión de cualquier otra."),
];

// ---------- FIRMAS ----------
const firmas = [
  sp(260),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 400 }, children: [
    new TextRun({ text: "En prueba de conformidad, las partes suscriben el presente contrato en dos (2) ejemplares de un mismo tenor y a un solo efecto, en el lugar y fecha que constan en el encabezado.", font: POP, size: 19, color: CARBON }),
  ]}),
  sp(700),
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW / 2, TW / 2], borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
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

const doc = new Document({
  creator: "Urbannit — gestionado por Meridiano Capital", title: "Contrato de Administración de Alquiler Temporal (borrador URB-CON-001)",
  styles: { default: { document: { run: { font: POP, size: 19, color: CARBON } } } },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "URBANNIT — gestionado por Meridiano Capital · Contrato de Administración de Alquiler Temporal", font: POP, size: 14, color: GREY }),
    ]})]})},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "BORRADOR — pendiente de revisión legal · Página ", font: POP, size: 14, color: ALERT }),
      new TextRun({ children: [PageNumber.CURRENT], font: POP, size: 14, color: ALERT }),
    ]})]})},
    children: [...aviso, ...encabezado, ...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7, ...s8, ...s9, ...s10, ...s11, ...firmas],
  }],
});

const outFile = path.join(OUT_DIR, "Urbannit_Contrato_Administracion_BORRADOR.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outFile, buf); console.log("OK:", outFile); });
