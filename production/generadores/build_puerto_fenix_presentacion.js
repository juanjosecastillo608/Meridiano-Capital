// Presentación corporativa — Centro Logístico Puerto Fénix, comercializada por Meridiano Capital.
// Fuente aprobada (contenido, cálculos, imágenes): projects/puerto-fenix/fuente/Presentacion_Corporativa_Puerto_Fenix_Meridiano_Capital_v7.pptx
// Identidad: knowledge-base/brand/03-05 + 09 (logos D-034, Fraunces/Poppins D-036/D-040, paleta oficial).
// Salida: projects/puerto-fenix/entregables/Meridiano_Capital_Puerto_Fenix_Presentacion_Corporativa_Final.pptx
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.title = "Centro Logístico Puerto Fénix — Propuesta corporativa de alquiler";
p.author = "Meridiano Capital";
p.company = "Meridiano Capital";
p.subject = "Naves industriales en Puerto Fénix, Mariano Roque Alonso, Paraguay";

// Paleta oficial (knowledge-base/brand/05-sistema-cromatico.md) — sin HEX nuevos.
const PET = "14313A", TIE = "8B3323", LAP = "C9982E", CRE = "F3EDE3", GRY = "6B6154",
      FILA = "F7F4EE", LINEA = "DAD2C0", GOLD_D = "A87D22", NAVY2 = "0D2226", WHITE = "FFFFFF";
const SERIF = "Fraunces", SANS = "Poppins"; // Fraunces siempre Regular en generadores (D-040)
const W = 13.333, H = 7.5, M = 0.6, R = W - M;

const A = path.join(__dirname, "assets-puerto-fenix");
const a = (f) => path.join(A, f);
const LOCKUP = a("meridiano-primario-horizontal-trazado.svg"), LOCKUP_INV = a("meridiano-primario-horizontal-inverso-trazado.svg");
const ISO = a("meridiano-isotipo.svg"), ISO_INV = a("meridiano-isotipo-inverso.svg");
const LOCKUP_RATIO = 430 / 140; // viewBox del lockup
const MAPS_URL = "https://maps.app.goo.gl/jHo2dQB1tqhid7nAA"; // ubicación exacta aportada por el founder, 2026-09-25
// Pie institucional del cierre (D-096): diferenciador de Meridiano frente al agente tradicional.
const PIE_INSTITUCIONAL = "Meridiano Capital  ·  Operadores técnicos y legales de inversiones inmobiliarias";

// ---------- helpers ----------
// Imagen con recorte proporcional (nunca deforma): escala "cover" + ventana de recorte con ancla (ax, ay).
function photo(s, file, pw, ph, x, y, w, h, alt, ax = 0.5, ay = 0.5) {
  const k = Math.max(w / pw, h / ph);
  const vw = pw * k, vh = ph * k;
  s.addImage({ path: a(file), x, y, w: vw, h: vh, altText: alt,
    sizing: { type: "crop", x: (vw - w) * ax, y: (vh - h) * ay, w, h } });
}
// Imagen completa dentro de una caja (contain), centrada.
function photoContain(s, file, pw, ph, x, y, w, h, alt, url) {
  const k = Math.min(w / pw, h / ph);
  const vw = pw * k, vh = ph * k;
  s.addImage(Object.assign({ path: a(file), x: x + (w - vw) / 2, y: y + (h - vh) / 2, w: vw, h: vh, altText: alt },
    url ? { hyperlink: { url, tooltip: "Abrir la ubicación en Google Maps" } } : {}));
}
function t(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: SANS, color: PET, valign: "top" }, o)); }
function eyebrow(s, text, dark, x = M, y = 0.6, w = 11) {
  t(s, text.toUpperCase(), { x, y, w, h: 0.3, fontSize: 11, bold: true, color: dark ? LAP : GOLD_D, charSpacing: 3, valign: "middle" });
}
function title(s, text, dark, o = {}) {
  t(s, text, Object.assign({ x: M, y: 0.98, w: 11.5, h: 0.75, fontFace: SERIF, fontSize: 30, color: dark ? CRE : PET, valign: "top", lineSpacingMultiple: 1.05 }, o));
}
function footer(s, n, dark) {
  s.addImage({ path: dark ? ISO_INV : ISO, x: M, y: 6.93, w: 0.3, h: 0.3, altText: "Isotipo Meridiano Capital" });
  t(s, "Meridiano Capital  ·  Centro Logístico Puerto Fénix  ·  Propuesta corporativa de alquiler",
    { x: M + 0.45, y: 6.93, w: 9, h: 0.3, fontSize: 9, color: dark ? CRE : GRY, transparency: dark ? 30 : 0, valign: "middle" });
  t(s, String(n).padStart(2, "0"), { x: R - 0.8, y: 6.93, w: 0.8, h: 0.3, fontSize: 9, color: dark ? CRE : GRY, transparency: dark ? 30 : 0, align: "right", valign: "middle" });
}
function hair(s, x, y, w, color = LINEA) { s.addShape(p.ShapeType.line, { x, y, w, h: 0, line: { color, width: 0.75 } }); }

// =====================================================================
// 01 — PORTADA
// =====================================================================
let s = p.addSlide(); s.background = { color: PET };
photo(s, "pf_nave_exterior.jpg", 1600, 1200, 6.9, 0, W - 6.9, H, "Nave industrial del Centro Logístico Puerto Fénix, vista exterior", 0.32, 0.5);
s.addImage({ path: LOCKUP_INV, x: M, y: 0.6, w: 2.55, h: 2.55 / LOCKUP_RATIO, altText: "Meridiano Capital" });
eyebrow(s, "Propuesta corporativa de alquiler", true, M, 2.3, 6);
t(s, "Naves industriales\nen Puerto Fénix", { x: M, y: 2.72, w: 6, h: 1.75, fontFace: SERIF, fontSize: 44, color: CRE, lineSpacingMultiple: 1.0 });
t(s, "Centro Logístico Puerto Fénix · Mariano Roque Alonso, Paraguay", { x: M, y: 4.55, w: 6, h: 0.35, fontSize: 13, color: CRE });
[["18.000 m²", "Capacidad aproximada por nave"], ["1.000 m²", "Superficie mínima de alquiler"]].forEach((d, i) => {
  const x = M + i * 2.9;
  t(s, d[0], { x, y: 5.2, w: 2.7, h: 0.55, fontFace: SERIF, fontSize: 26, color: LAP });
  t(s, d[1], { x, y: 5.78, w: 2.7, h: 0.3, fontSize: 10.5, color: CRE, transparency: 20 });
});
t(s, "Comercialización a cargo de Meridiano Capital  ·  Documento comercial  ·  24.09.2026", { x: M, y: 6.9, w: 6.1, h: 0.3, fontSize: 9, color: CRE, transparency: 35, valign: "middle" });
s.addNotes("Fuente: Cotización Tinglado 1000 m2 Puerto Fénix MRA.pdf, páginas 2 a 5. Versión final adaptada a la identidad de Meridiano Capital a partir de la presentación aprobada v7 (sin cambios de contenido comercial). Puerto Fénix es el activo ofrecido; Meridiano Capital actúa como comercializador.");

// =====================================================================
// 02 — UBICACIÓN
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
eyebrow(s, "Acceso estratégico"); title(s, "Ubicación en el corredor metropolitano");
{ const mw = 6.03, mh = mw * 722 / 916;
  s.addShape(p.ShapeType.rect, { x: M, y: 2.0, w: mw, h: mh, fill: { color: WHITE }, line: { color: LINEA, width: 0.75 } });
  photoContain(s, "pf_mapa_ubicacion.jpg", 916, 722, M, 2.0, mw, mh, "Mapa de ubicación: Mariano Roque Alonso en el área metropolitana de Asunción", MAPS_URL); }
{ const x = 7.35, w = R - 7.35;
  t(s, "Mariano Roque Alonso", { x, y: 2.05, w, h: 0.55, fontFace: SERIF, fontSize: 26 });
  t(s, "Centro logístico y portuario con conexión al área metropolitana de Asunción.", { x, y: 2.75, w, h: 0.8, fontSize: 15, lineSpacingMultiple: 1.25 });
  ["Operación dentro del complejo Puerto Fénix", "Acceso funcional para transporte y distribución", "Infraestructura vinculada al muelle"].forEach((it, i) => {
    const y = 3.95 + i * 0.68;
    hair(s, x, y, w);
    t(s, String(i + 1).padStart(2, "0"), { x, y: y + 0.2, w: 0.55, h: 0.35, fontFace: SERIF, fontSize: 15, color: TIE });
    t(s, it, { x: x + 0.6, y: y + 0.2, w: w - 0.6, h: 0.4, fontSize: 13.5 });
  });
  hair(s, x, 3.95 + 3 * 0.68, w);
  t(s, [{ text: "Ver ubicación exacta en Google Maps", options: { bold: true, color: TIE, underline: { style: "sng" }, hyperlink: { url: MAPS_URL, tooltip: "Abrir la ubicación en Google Maps" } } },
        { text: "\nmaps.app.goo.gl/jHo2dQB1tqhid7nAA", options: { fontSize: 10.5, color: GRY } }],
    { x, y: 6.2, w, h: 0.62, fontSize: 12.5, lineSpacingMultiple: 1.2 }); }
footer(s, 2);
s.addNotes("Fuente: página 2 y mapa incorporado en el documento adjunto. No se agregaron tiempos de viaje ni distancias no informadas. Enlace de ubicación exacta aportado por el founder el 2026-09-25 (https://maps.app.goo.gl/jHo2dQB1tqhid7nAA): vinculado al mapa y al texto «Ver ubicación exacta en Google Maps».");

// =====================================================================
// 03 — ESCALA E INFRAESTRUCTURA (4 fotografías, grilla 2 × 2 proporcional)
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
eyebrow(s, "Puerto Fénix"); title(s, "Escala para operaciones industriales y logísticas");
{ const cw = 3.06, ch = 2.3, g = 0.12, x0 = M, y0 = 1.97;
  const q = [["pf_complejo_patio_contenedores.png", 477, 359, "Patio pavimentado de hormigón para almacenaje de contenedores"],
             ["pf_complejo_depositos_aereo.png", 468, 359, "Vista aérea de depósitos del complejo"],
             ["pf_complejo_interior_pallets.png", 477, 359, "Interior de depósito con mercadería paletizada"],
             ["pf_complejo_playa_maniobras.png", 478, 359, "Playa de maniobras techada para camiones"]];
  q.forEach((f, i) => photo(s, f[0], f[1], f[2], x0 + (i % 2) * (cw + g), y0 + Math.floor(i / 2) * (ch + g), cw, ch, f[3])); }
{ const x = 7.55, w = R - 7.55;
  t(s, "18.000 m²", { x, y: 1.95, w, h: 0.95, fontFace: SERIF, fontSize: 54, color: TIE });
  t(s, "Capacidad aproximada por nave", { x, y: 2.92, w, h: 0.35, fontSize: 13, color: GRY });
  const st = [["1.000 m²", "Superficie mínima de alquiler"], ["80 hectáreas", "Superficie del puerto"], ["3.000 metros", "Extensión del muelle"], ["10 metros", "Altura mínima de las naves"]];
  st.forEach((d, i) => { const cx = x + (i % 2) * (w / 2), cy = 3.62 + Math.floor(i / 2) * 1.12;
    if (i % 2 === 0) hair(s, x, cy - 0.12, w);
    t(s, d[0], { x: cx, y: cy, w: w / 2 - 0.15, h: 0.5, fontFace: SERIF, fontSize: 23 });
    t(s, d[1], { x: cx, y: cy + 0.52, w: w / 2 - 0.15, h: 0.3, fontSize: 11, color: GRY }); });
  hair(s, x, 3.62 + 2 * 1.12 - 0.12, w);
  t(s, "Planta divisible según la operación del cliente.", { x, y: 6.0, w, h: 0.35, fontSize: 13, italic: true }); }
footer(s, 3);
s.addNotes("Las cuatro fotografías del documento fuente (collage original) se presentan como cuatro imágenes independientes en una grilla proporcional de 2 × 2, sin deformación: cada una es un recorte exacto de su cuadrante original, con un recorte proporcional adicional (como máximo 2 % del alto) para igualar las celdas; la fotografía aérea se recortó además en su borde izquierdo para eliminar el separador negro del collage. Los textos sobreimpresos en las fotografías provienen del material original y no fueron modificados. La capacidad aproximada de 18.000 m² surge de las dimensiones del plano: 100,00 m por 179,80 m. Superficie mínima de contratación: 1.000 m².");

// =====================================================================
// 04 — PLANO Y SUBDIVISIÓN
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
{ const pw = 8.1, ph = pw * 1240 / 1755, pad = 0.12;
  s.addShape(p.ShapeType.rect, { x: M, y: 0.6, w: pw + 2 * pad, h: ph + 2 * pad, fill: { color: WHITE }, line: { color: LINEA, width: 0.75 } });
  s.addImage({ path: a("pf_plano_planta_arquitectonica.png"), x: M + pad, y: 0.6 + pad, w: pw, h: ph,
    altText: "Planta arquitectónica del depósito del Centro Logístico Puerto Fénix, 100,00 m × 179,80 m, escala 1/750" });
}
{ const x = 9.2, w = R - 9.2;
  t(s, "CONFIGURACIÓN ARQUITECTÓNICA", { x, y: 0.6, w, h: 0.3, fontSize: 10, bold: true, color: GOLD_D, charSpacing: 2, valign: "middle" });
  t(s, "Planta libre y subdivisión por demanda", { x, y: 0.98, w, h: 0.9, fontFace: SERIF, fontSize: 23, lineSpacingMultiple: 1.02 });
  const d = [["100,00 × 179,80 m", "Medidas aproximadas indicadas en el plano", PET, 19],
             ["17.980 m²", "Superficie resultante aproximada", PET, 19],
             ["18.000 m²", "Capacidad comercial comunicada por nave", TIE, 28],
             ["Desde 1.000 m²", "Subdivisión en módulos según la operación", PET, 19]];
  let y = 2.05;
  d.forEach((r) => { hair(s, x, y, w);
    const hh = r[3] > 20 ? 0.62 : 0.45;
    t(s, r[0], { x, y: y + 0.14, w, h: hh, fontFace: SERIF, fontSize: r[3], color: r[2] });
    t(s, r[1], { x, y: y + 0.14 + hh, w, h: 0.3, fontSize: 10.5, color: GRY });
    y += 0.14 + hh + 0.34; });
  hair(s, x, y, w);
  t(s, "La planta libre permite definir módulos según almacenamiento, circulación y operación del cliente.", { x, y: y + 0.14, w, h: 0.62, fontSize: 10.5, italic: true, lineSpacingMultiple: 1.1 }); }
footer(s, 4);
s.addNotes("Fuente visual: D15 PLANO - Planta Arquitectónica Puerto Fénix planta libre.pdf. El plano rotula dimensiones generales de 100,00 m por 179,80 m, equivalentes a aproximadamente 17.980 m². La presentación redondea la capacidad por nave a 18.000 m². Superficie mínima de alquiler: 1.000 m². El plano conserva su proporción, orientación, medidas, accesos, rotulación y rosa de los vientos originales; solo se limpió el fondo y se reforzó el contraste de las líneas. Planta arquitectónica del depósito, escala 1/750: documento técnico original, sin modificaciones de medidas ni rotulación.");

// =====================================================================
// 05 — SERVICIOS INCLUIDOS
// =====================================================================
s = p.addSlide(); s.background = { color: WHITE };
eyebrow(s, "Capacidad operativa"); title(s, "Infraestructura incluida en el complejo");
{ const it = [["Energía y servicios", "Agua, energía eléctrica en media tensión y medidor independiente."],
              ["Seguridad", "Seguridad integral, CCTV y control de entrada y salida."],
              ["Protección contra incendios", "Sistema de prevención y combate de incendios."],
              ["Movimiento de cargas", "Playa de maniobra para camiones y soporte logístico según pedido."],
              ["Equipos adicionales", "Montacargas y grúas de distintas capacidades como servicios opcionales."],
              ["Operación aduanera", "Oficina de la Aduana Paraguaya habilitada dentro del predio."]];
  const cw = 3.75, gx = (R - M - 3 * cw) / 2;
  it.forEach((d, i) => { const x = M + (i % 3) * (cw + gx), y = 2.15 + Math.floor(i / 3) * 2.15;
    hair(s, x, y, cw);
    t(s, String(i + 1).padStart(2, "0"), { x, y: y + 0.2, w: 1, h: 0.55, fontFace: SERIF, fontSize: 26, color: TIE });
    t(s, d[0], { x, y: y + 0.85, w: cw, h: 0.4, fontSize: 15, bold: true });
    t(s, d[1], { x, y: y + 1.27, w: cw, h: 0.75, fontSize: 12.5, color: GRY, lineSpacingMultiple: 1.2 }); }); }
t(s, "Los servicios adicionales están sujetos a cotización y disponibilidad.", { x: M, y: 6.45, w: 10, h: 0.3, fontSize: 10, italic: true, color: GRY });
footer(s, 5);
s.addNotes("Fuente: página 5. Los servicios adicionales están sujetos a cotización y disponibilidad, según el documento fuente.");

// =====================================================================
// 06 — CARACTERÍSTICAS DE LAS NAVES
// =====================================================================
s = p.addSlide(); s.background = { color: PET };
eyebrow(s, "Depósitos industriales", true); title(s, "Espacios listos para configurar", true);
{ const pw = 5.9, ph = pw * 9 / 16, y = 2.0, x2 = R - pw;
  photo(s, "pf_deposito_accesos.jpg", 960, 540, M, y, pw, ph, "Fachada del depósito con portones de acceso");
  photo(s, "pf_deposito_planta_libre.jpg", 800, 450, x2, y, pw, ph, "Interior del depósito en planta libre");
  t(s, "Accesos amplios", { x: M, y: y + ph + 0.2, w: pw, h: 0.35, fontSize: 14, bold: true, color: CRE });
  t(s, "Planta libre y altura operativa", { x: x2, y: y + ph + 0.2, w: pw, h: 0.35, fontSize: 14, bold: true, color: CRE });
  t(s, "Altura mínima de 10 metros  ·  Planta libre divisible desde 1.000 m²", { x: M, y: y + ph + 0.62, w: 11, h: 0.35, fontSize: 12.5, color: CRE, transparency: 20 });
  t(s, "Fotografías del depósito incluidas en la cotización de Puerto Fénix.", { x: M, y: 6.5, w: 11, h: 0.3, fontSize: 9.5, italic: true, color: CRE, transparency: 35 }); }
footer(s, 6, true);
s.addNotes("Fuente visual: página 6. La identificación definitiva del número de depósito está pendiente en el documento fuente. Altura mínima (10 m) y superficie mínima (1.000 m²) provienen de las diapositivas 3 y 4 de la versión aprobada.");

// =====================================================================
// 07 — INTEGRACIÓN PORTUARIA Y ADUANERA
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
{ const tw = 4.85;
  eyebrow(s, "Ventaja operativa", false, M, 0.6, tw);
  t(s, "Integración portuaria\ny aduanera", { x: M, y: 0.98, w: tw, h: 1.3, fontFace: SERIF, fontSize: 32, lineSpacingMultiple: 1.02 });
  t(s, "Posibilidad de aplicar variantes aduaneras y coordinar logística según el requerimiento del cliente.", { x: M, y: 2.55, w: tw, h: 1.1, fontSize: 15, lineSpacingMultiple: 1.25 });
  [["Aduana en el predio", "Oficina de la Aduana Paraguaya habilitada dentro del complejo."], ["Muelle de 3.000 metros", "Infraestructura del complejo vinculada al muelle."]].forEach((d, i) => {
    const y = 4.05 + i * 1.2; hair(s, M, y, tw);
    t(s, d[0], { x: M, y: y + 0.18, w: tw, h: 0.45, fontFace: SERIF, fontSize: 19, color: TIE });
    t(s, d[1], { x: M, y: y + 0.63, w: tw, h: 0.4, fontSize: 12.5, color: GRY }); });
  hair(s, M, 4.05 + 2 * 1.2, tw); }
{ const top = 0.6, bh = 5.95, g = 0.15, sh = (bh - g) / 2;
  const bw = bh * 1210 / 1613, sw = sh * 908 / 1210;
  const xs = R - sw, xb = xs - g - bw;
  photo(s, "pf_muelle_frente.jpg", 1210, 1613, xb, top, bw, bh, "Frente del muelle del complejo con grúa portuaria");
  photo(s, "pf_muelle_grua.jpg", 908, 1210, xs, top, sw, sh, "Grúa y equipos de operación portuaria en el muelle");
  photo(s, "pf_muelle_barcaza.jpg", 908, 1210, xs, top + sh + g, sw, sh, "Muelle sobre el río con barcaza"); }
footer(s, 7);
s.addNotes("Fuente: páginas 5 y 8. El documento indica que en el predio funciona una oficina de la Aduana Paraguaya y que pueden aplicarse variantes aduaneras. Extensión del muelle (3.000 m): diapositiva 3 de la versión aprobada. Fotografías con corrección moderada de contraste (autocontraste 0,5 %), sin cambios de encuadre, color ni contenido.");

// =====================================================================
// 08 — CONDICIONES ECONÓMICAS
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
eyebrow(s, "Propuesta comercial"); title(s, "Condiciones económicas de alquiler");
{ const lw = 7.3;
  t(s, "TARIFA DE REFERENCIA", { x: M, y: 2.0, w: 4, h: 0.3, fontSize: 10, bold: true, color: GOLD_D, charSpacing: 3 });
  t(s, "USD 5,50", { x: M, y: 2.3, w: 3.3, h: 0.95, fontFace: SERIF, fontSize: 50, color: TIE, valign: "bottom" });
  t(s, "por m² + IVA", { x: M + 3.3, y: 2.3, w: 3, h: 0.83, fontSize: 16, valign: "bottom" });
  const hdr = (x) => ({ text: x, options: { bold: true, color: CRE, fill: { color: PET }, fontSize: 11.5 } });
  const c = (x, o = {}) => ({ text: x, options: Object.assign({ fill: { color: WHITE } }, o) });
  const alt = (x, o = {}) => ({ text: x, options: Object.assign({ fill: { color: FILA } }, o) });
  const rows = [
    [hdr("Ejemplo para 2.000 m²"), hdr("Tarifa"), hdr("Importe mensual")],
    [c("Alquiler"), c("USD 5,50 por m² + IVA"), c("USD 11.000 + IVA")],
    [alt("Expensas"), alt("USD 0,20 por m² + IVA"), alt("USD 400 + IVA")],
    [c("Total mensual", { bold: true }), c(""), c("USD 11.400 + IVA", { bold: true, color: TIE })],
  ];
  s.addTable(rows, { x: M, y: 3.5, w: lw, colW: [2.3, 2.7, 2.3], rowH: 0.5, fontFace: SANS, fontSize: 12.5, color: PET, valign: "middle",
    margin: [0, 0.14, 0, 0.14], border: { type: "solid", pt: 0.75, color: LINEA } });
  t(s, "Cálculo del ejemplo: 2.000 m² × USD 5,50 de alquiler + 2.000 m² × USD 0,20 de expensas.", { x: M, y: 5.72, w: lw, h: 0.5, fontSize: 11, italic: true, color: GRY }); }
{ const x = 8.45, w = R - x, y = 2.0, h = 4.2, ix = x + 0.4, iw = w - 0.8;
  s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: PET }, line: { color: PET, width: 0 } });
  t(s, "Condiciones de ingreso", { x: ix, y: y + 0.35, w: iw, h: 0.5, fontFace: SERIF, fontSize: 22, color: CRE });
  ["Un mes de alquiler.", "Un mes de alquiler en concepto de garantía.", "Honorarios equivalentes al 50% de un mes de alquiler."].forEach((it, i) => {
    const yy = y + [1.1, 1.72, 2.55][i];
    t(s, String(i + 1).padStart(2, "0"), { x: ix, y: yy, w: 0.5, h: 0.4, fontFace: SERIF, fontSize: 15, color: LAP });
    t(s, it, { x: ix + 0.55, y: yy + 0.02, w: iw - 0.55, h: 0.7, fontSize: 13, color: CRE, lineSpacingMultiple: 1.15 }); });
  hair(s, ix, y + 3.38, iw, LAP);
  t(s, "Validez de la oferta: 5 días", { x: ix, y: y + 3.52, w: iw, h: 0.45, fontSize: 14, bold: true, color: LAP }); }
footer(s, 8);
s.addNotes("Fuente de alquiler: páginas 5 y 9. Expensas de USD 0,20 + IVA por m² informadas por el usuario. Para 2.000 m²: alquiler USD 11.000 + IVA, expensas USD 400 + IVA y total mensual USD 11.400 + IVA. Condiciones de ingreso: un mes de alquiler, un mes de alquiler en concepto de garantía, honorarios equivalentes al 50% de un mes de alquiler; oferta válida por 5 días.");

// =====================================================================
// 09 — SERVICIOS LOGÍSTICOS OPCIONALES
// =====================================================================
s = p.addSlide(); s.background = { color: WHITE };
eyebrow(s, "Cotización adicional"); title(s, "Servicios logísticos opcionales");
{ const ly = 2.45, nodes = [[M + 0.1, "Depósito del cliente"], [6.67, "Muelle"], [R - 0.1, "Barcaza"]], r = 0.1;
  for (let i = 0; i < 2; i++) s.addShape(p.ShapeType.line, { x: nodes[i][0], y: ly, w: nodes[i + 1][0] - nodes[i][0], h: 0, line: { color: PET, width: 1.25 } });
  nodes.forEach((n, i) => {
    s.addShape(p.ShapeType.ellipse, { x: n[0] - r, y: ly - r, w: 2 * r, h: 2 * r, fill: { color: i === 1 ? LAP : PET }, line: { color: i === 1 ? LAP : PET, width: 0 } });
    const al = i === 0 ? "left" : i === 2 ? "right" : "center", bw = 2.6;
    const bx = i === 0 ? n[0] - r : i === 2 ? n[0] + r - bw : n[0] - bw / 2;
    t(s, n[1].toUpperCase(), { x: bx, y: ly + 0.22, w: bw, h: 0.3, fontSize: 10, bold: true, charSpacing: 2, align: al, color: PET }); });
  const blocks = [[M, "Flete corto", "Desde el depósito del cliente hasta el muelle", "USD 20 por m² + IVA", "Por viaje. La unidad de facturación definitiva se formaliza en la cotización contractual."],
                  [6.67 + 0.45, "Movimiento de carga", "Desde el muelle hasta la barcaza", "USD 32 por m² + IVA", "Valor según la cotización de Puerto Fénix; se formaliza en la cotización contractual."]];
  blocks.forEach((b) => { const x = b[0], w = 5.2;
    t(s, b[1], { x, y: 3.3, w, h: 0.5, fontFace: SERIF, fontSize: 23 });
    t(s, b[2], { x, y: 3.82, w, h: 0.35, fontSize: 12.5, color: GRY });
    t(s, b[3], { x, y: 4.3, w, h: 0.7, fontFace: SERIF, fontSize: 32, color: TIE });
    t(s, b[4], { x, y: 5.05, w, h: 0.55, fontSize: 11, italic: true, color: GRY, lineSpacingMultiple: 1.15 }); }); }
s.addShape(p.ShapeType.rect, { x: M, y: 5.95, w: R - M, h: 0.62, fill: { color: CRE }, line: { color: CRE, width: 0 } });
t(s, [{ text: "Referencia comercial:  ", options: { bold: true } }, { text: "los valores de la cotización de Puerto Fénix corresponden al ejemplo solicitado de 2.000 m² y tienen una validez de 5 días." }],
  { x: M + 0.25, y: 5.95, w: R - M - 0.4, h: 0.62, fontSize: 11.5, valign: "middle" });
footer(s, 9);
s.addNotes("Fuente: página 7. Se conserva la unidad publicada en el documento fuente (USD 20 × m² + IVA y USD 32 × m² + IVA, expresadas aquí como «por m²»). El concepto de flete corto combina la expresión «por viaje» con una tarifa por m², por lo que su facturación definitiva debe formalizarse en la cotización contractual.");

// =====================================================================
// 10 — PROCESO DE CONTRATACIÓN
// =====================================================================
s = p.addSlide(); s.background = { color: PET };
eyebrow(s, "Ingreso corporativo", true); title(s, "Proceso de contratación", true);
{ const steps = [["Definición del módulo", "Superficie, disponibilidad, uso previsto y requerimientos logísticos."],
                 ["Documentación", "Estatuto social, copias de la cédula de identidad de los firmantes y los tres últimos formularios de IVA."],
                 ["Validación comercial", "Confirmación de tarifa, servicios opcionales y condiciones particulares."],
                 ["Formalización", "Pago inicial, garantía, honorarios y firma del contrato de locación."]];
  const ly = 2.55, cw = (R - M) / 4;
  s.addShape(p.ShapeType.line, { x: M, y: ly, w: R - M, h: 0, line: { color: CRE, width: 0.75, transparency: 55 } });
  steps.forEach((st, i) => { const x = M + i * cw;
    s.addShape(p.ShapeType.ellipse, { x, y: ly - 0.08, w: 0.16, h: 0.16, fill: { color: LAP }, line: { color: LAP, width: 0 } });
    t(s, String(i + 1).padStart(2, "0"), { x, y: ly + 0.35, w: 1.2, h: 0.7, fontFace: SERIF, fontSize: 36, color: LAP });
    t(s, st[0], { x, y: ly + 1.2, w: cw - 0.35, h: 0.4, fontSize: 15, bold: true, color: CRE });
    t(s, st[1], { x, y: ly + 1.68, w: cw - 0.4, h: 1.5, fontSize: 12.5, color: CRE, transparency: 15, lineSpacingMultiple: 1.25 }); });
  hair(s, M, 5.95, R - M, "1D414D");
  t(s, "Plazo de validez informado en la cotización: 5 días.", { x: M, y: 6.1, w: 11, h: 0.35, fontSize: 13, bold: true, color: LAP }); }
footer(s, 10, true);
s.addNotes("Fuente: página 9. El paso de definición del módulo y la validación comercial organizan el proceso comercial sin alterar los requisitos documentales del PDF. «CI» del documento fuente se expresa como «cédula de identidad».");

// =====================================================================
// 11 — OPERACIÓN DE ALMACENAMIENTO
// =====================================================================
s = p.addSlide(); s.background = { color: CRE };
eyebrow(s, "Configuración interior"); title(s, "Operación de almacenamiento");
{ const y = 2.0, h = 4.35, g = 0.15;
  const w1 = h * 864 / 1152, w2 = h * 1152 / 864;
  photo(s, "pf_almacenamiento_pasillo.jpg", 864, 1152, M, y, w1, h, "Pasillo de racks con mercadería y montacargas");
  photo(s, "pf_almacenamiento_racks.jpg", 1152, 864, M + w1 + g, y, w2, h, "Racks selectivos con circulación central");
  const x = M + w1 + g + w2 + 0.45, w = R - x;
  hair(s, x, y, w);
  t(s, "Ejemplo de aprovechamiento con racks, circulación central y operación con montacargas.", { x, y: y + 0.25, w, h: 2.2, fontFace: SERIF, fontSize: 19, lineSpacingMultiple: 1.15 });
  t(s, "Imágenes de referencia de configuración operativa, suministradas para esta propuesta.", { x, y: y + h - 0.75, w, h: 0.75, fontSize: 10, italic: true, color: GRY, valign: "bottom" }); }
footer(s, 11);
s.addNotes("Imágenes adicionales aportadas por el usuario el 24.09.2026. Se presentan como referencia de configuración operativa y almacenamiento.");

// =====================================================================
// 12 — CIERRE Y CONTACTO (cierre canónico en tierra colorada, knowledge-base/brand/09-cierres-y-firmas.md)
// =====================================================================
s = p.addSlide(); s.background = { color: TIE };
photo(s, "jjc_retrato.jpg", 1024, 1536, 8.55, 0, W - 8.55, H, "Juan José Castillo, Meridiano Capital", 0.5, 0.0);
s.addImage({ path: LOCKUP_INV, x: M, y: 0.6, w: 2.4, h: 2.4 / LOCKUP_RATIO, altText: "Meridiano Capital" });
t(s, "Coordinemos una visita\ny una propuesta a medida", { x: M, y: 1.8, w: 7.5, h: 1.6, fontFace: SERIF, fontSize: 38, color: CRE, lineSpacingMultiple: 1.02 });
t(s, "Acompañamiento comercial para empresas que buscan capacidad de almacenamiento, operación logística y acceso portuario.", { x: M, y: 3.5, w: 7.2, h: 0.8, fontSize: 14, color: CRE, transparency: 10, lineSpacingMultiple: 1.25 });
hair(s, M, 4.5, 7.35, "C9982E");
// Firma para captación de propiedades en alquiler (D-096): "Broker Inmobiliario".
t(s, "Juan José Castillo", { x: M, y: 4.66, w: 7.4, h: 0.5, fontFace: SERIF, fontSize: 22, color: CRE });
t(s, "Broker Inmobiliario · Meridiano Capital", { x: M, y: 5.16, w: 7.4, h: 0.35, fontSize: 13, color: CRE });
t(s, "+595 982 853 111  ·  juancastillo@meridianocapital.net  ·  www.meridianocapital.net", { x: M, y: 5.56, w: 7.6, h: 0.35, fontSize: 12.5, color: CRE });
t(s, "Documento comercial de referencia. Valores en USD más IVA según la cotización de Puerto Fénix; las condiciones definitivas se formalizan en el contrato de locación. Oferta válida por 5 días.",
  { x: M, y: 6.02, w: 7.5, h: 0.5, fontSize: 9, italic: true, color: CRE, transparency: 25, lineSpacingMultiple: 1.15 });
hair(s, M, 6.78, 7.35, "F3EDE3");
t(s, PIE_INSTITUCIONAL.toUpperCase(), { x: M, y: 6.9, w: 7.8, h: 0.3, fontSize: 9, bold: true, color: CRE, charSpacing: 1.2, valign: "middle" });
s.addNotes("Contacto comercial actualizado por el usuario: Juan José Castillo, Broker Inmobiliario, Meridiano Capital, +595 982 853 111, juancastillo@meridianocapital.net. Fotografía profesional incorporada en la versión aprobada, sin retoques. Firma «Broker Inmobiliario» = norma vigente cuando Meridiano actúa como captador de propiedades en alquiler (D-096, resuelve U-034), con el pie institucional «Operadores técnicos y legales de inversiones inmobiliarias» al cierre.");

// =====================================================================
// Escritura + respaldo PNG real para cada SVG (pptxgenjs copia el SVG como si fuera PNG;
// PowerPoint anterior a 2016 y otros visores usan ese respaldo).
// =====================================================================
const outDir = path.join(__dirname, "../../projects/puerto-fenix/entregables");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "Meridiano_Capital_Puerto_Fenix_Presentacion_Corporativa_Final.pptx");
(async () => {
  const buf = await p.write({ outputType: "nodebuffer" });
  const zip = await JSZip.loadAsync(buf);
  const svgs = Object.keys(zip.files).filter((f) => /^ppt\/media\/.*\.svg$/.test(f));
  for (const svg of svgs) {
    const m = svg.match(/image-(\d+)-(\d+)\.svg$/);
    const png = svg.replace(/image-(\d+)-(\d+)\.svg$/, `image-${m[1]}-${Number(m[2]) - 1}.png`);
    if (!zip.files[png]) continue;
    const src = await zip.file(svg).async("nodebuffer");
    const raster = await sharp(src, { density: 600 }).resize({ width: 1600, withoutEnlargement: false }).png().toBuffer();
    zip.file(png, raster);
  }
  // Hipervínculos con color de marca (tierra colorada / grey cálido visitado) en vez del azul por defecto del tema.
  const themes = Object.keys(zip.files).filter((f) => /^ppt\/theme\/theme\d+\.xml$/.test(f));
  for (const th of themes) {
    let x = await zip.file(th).async("string");
    x = x.replace(/<a:hlink>[\s\S]*?<\/a:hlink>/, `<a:hlink><a:srgbClr val="${TIE}"/></a:hlink>`)
         .replace(/<a:folHlink>[\s\S]*?<\/a:folHlink>/, `<a:folHlink><a:srgbClr val="${GRY}"/></a:folHlink>`);
    zip.file(th, x);
  }
  const final = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(out, final);
  console.log("OK:", out, `(${svgs.length} SVG con respaldo PNG)`);
})().catch((e) => { console.error(e); process.exit(1); });
