// Edificio Catedral (Ciudad del Este) — presentación para inversores.
// Kit: skill meridiano-property-presentation-adapter (scripts/meridiano_deck_kit.js).
// Cifras: projects/meridiano-capital/presentaciones/edificio-catedral/fuente/model.json
// (generado por model.py con el tipo de cambio central de _config, D-097).
// Uso: node build_edificio_catedral_presentacion.js
"use strict";
const path = require("path");
const fs = require("fs");
const KIT = process.env.MC_DECK_KIT ||
  "/root/.claude/skills/synced/03a6d187-4698-465a-8a04-848dbd055d31_cb762160-afd7-4e8c-b3e7-0ea718715011/meridiano-property-presentation-adapter/scripts/meridiano_deck_kit.js";
const K = require(KIT);

const ROOT = path.resolve(__dirname, "../../projects/meridiano-capital/presentaciones/edificio-catedral");
const IMG = (f) => path.join(ROOT, "fuente/img", f);
const M = JSON.parse(fs.readFileSync(path.join(ROOT, "fuente/model.json"), "utf8"));
const OUT = path.join(ROOT, "entregables/Edificio_Catedral_Meridiano_FINAL.pptx");
const MAPS = "https://maps.app.goo.gl/EA3DMnVUaTTddxLc9";

const n = (x, d = 0) => Number(x).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const gs = (x) => "Gs " + n(x);
const usd = (x) => "USD " + n(Math.round(x));
const pct = (x, d = 2) => n(x * 100, d) + "%";

const d = K.createDeck({ title: "Edificio Catedral — Edificio de renta en venta",
  footerLabel: "Meridiano Capital  ·  Edificio Catedral, Ciudad del Este  ·  Venta" });
const { C, M: MG, W, H, SERIF, SANS } = d;

// P-008 [EXTENSION]: J/j de los titulares en Lora (la J de Fraunces se lee mal; mismo criterio que los decks HTML).
const runs = (t) => String(t).split(/([Jj])/).filter(Boolean).map((p) => /^[Jj]$/.test(p) ? { text: p, options: { fontFace: "Lora" } } : { text: p, options: {} });
const title = (s, t, o = {}) => d.title(s, runs(t), o);
const serif = (s, t, o = {}) => d.text(s, runs(t), Object.assign({ fontFace: SERIF }, o));
const notes = (s, t) => s.addNotes(t);
const bullets = (items, o = {}) => items.map((t, i) => ({ text: t, options: Object.assign({ bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 4 }, o) }));
const card = (s, x, y, w, h, fill) => s.addShape(d.pres.ShapeType.rect, { x, y, w, h, fill: { color: fill || C.white }, line: { color: C.linea, width: 0.75 } });

// 01 PORTADA
let s = d.cover({
  photo: IMG("frente.jpg"), photoAlt: "Frente del Edificio Catedral", ax: 0.45, ay: 0.5,
  eyebrow: "Edificio de renta en venta", title: "Edificio\nCatedral",
  subtitle: "Pampliega casi Av. Mayor Rivas Ortellado · Ciudad del Este",
  figures: [[usd(M.precio_usd), "Precio de venta"], ["15 unidades", "12 departamentos y 3 salones"]],
  footnote: `Presentación de Meridiano Capital para inversores  ·  ${M.tc_corto}`,
  notes: "Fuente: PDF 'Edificio Departamentos Catedral' (metadatos 27/08/2026) y pedido del founder (05/11/2026). Foto: Frente Edificio (adjunto del founder)."
});

// 02 RESUMEN
s = d.slide("light"); d.eyebrow(s, "Resumen del activo"); title(s, "Un edificio de renta de uso mixto en el microcentro");
d.text(s, "Edificio de cuatro niveles con 12 departamentos de tres dormitorios, 3 salones comerciales y estacionamiento cubierto para 12 vehículos. Según la documentación recibida, los 12 departamentos estaban alquilados al momento de su elaboración.",
  { x: MG, y: 1.85, w: 12.1, h: 0.7, fontSize: 13.5, lineSpacingMultiple: 1.2 });
const kp = [[usd(M.precio_usd), `Precio de venta · aprox. ${gs(Math.round(M.precio_gs / 1e6) * 1e6)}`], ["700 m²", "Terreno de 17,50 × 40 m"],
  ["2.290 m²", "Superficie construida informada"], ["4 niveles", "Planta baja y tres pisos"],
  ["12 + 3", "Departamentos y salones comerciales"], ["12 cocheras", "Estacionamiento cubierto"],
  [gs(M.res_m), "Renta residencial mensual informada"], [gs(M.tot_m), "Proyección mensual con los locales"]];
kp.forEach((k, i) => { const x = MG + (i % 4) * 3.07, y = 2.8 + Math.floor(i / 4) * 1.32; d.hair(s, x, y - 0.12, 2.8); d.figure(s, k[0], k[1], { x, y, w: 2.85, size: 24 }); });
card(s, MG, 5.6, 12.13, 1.05, C.white);
d.text(s, [{ text: "Propuesta para el inversor. ", options: { bold: true } },
  { text: "Comprar un activo con renta residencial en curso y una renta comercial por confirmar, con acompañamiento de Meridiano Capital en la revisión documental, la estructura de compra y la administración posterior." }],
  { x: MG + 0.25, y: 5.7, w: 11.6, h: 0.85, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.2 });
d.footer(s, 2);
notes(s, "Precio, terreno, superficie, niveles, unidades y cocheras: PDF fuente. 2.290 m² informados, a corroborar con planos. Renta residencial: 12 × Gs 3.000.000 (PDF). Proyección total: suma la hipótesis de 3 locales × Gs 3.000.000 (pedido del founder, sin confirmar). Equivalencia en Gs al TC de _config.");

// 03 UBICACION
s = d.slide("light"); d.eyebrow(s, "Ubicación"); title(s, "Barrio Catedral, a pasos del microcentro");
d.photo(s, IMG("ubicacion.jpg"), { x: MG, y: 1.95, w: 7.0, h: 4.67 }, { mode: "contain", ax: 0, ay: 0, alt: "Mapa de ubicación referencial (Google Maps)", hyperlink: MAPS });
const xr = 8.0, wr = W - MG - xr;
d.text(s, "DIRECCIÓN", { x: xr, y: 1.95, w: wr, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, "Pampliega casi Av. Mayor Rivas Ortellado, Barrio Catedral, Ciudad del Este", { x: xr, y: 2.22, w: wr, h: 0.6, fontSize: 13 });
d.text(s, "ENTORNO", { x: xr, y: 3.0, w: wr, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, bullets(["Catedral San Blas", "Shopping China", "Hotel Acaray", "Futuro centro comercial Cellshop (proyecto anunciado; fecha no confirmada)"]),
  { x: xr, y: 3.27, w: wr, h: 1.5, fontSize: 12.5 });
d.photo(s, IMG("qr_ubicacion.png"), { x: xr, y: 4.95, w: 1.15, h: 1.15 }, { mode: "contain", alt: "Código QR de la ubicación en Google Maps", hyperlink: MAPS });
d.text(s, [{ text: "Abrir en Google Maps", options: { hyperlink: { url: MAPS }, bold: true, color: C.tierra } }, { text: "\nmaps.app.goo.gl/EA3DMnVUaTTddxLc9", options: { fontSize: 10, color: C.grey } }],
  { x: xr + 1.3, y: 5.05, w: wr - 1.3, h: 0.7, fontSize: 12 });
d.text(s, "Ubicación referencial: el marcador corresponde al mapa recibido y se confirma en la visita y con el título.", { x: xr, y: 6.2, w: wr, h: 0.45, fontSize: 10, color: C.grey, italic: true });
d.footer(s, 3);
notes(s, "Mapa: Ubicacion.png (adjunto del founder, base Google Maps con rótulos agregados). El enlace no pudo abrirse desde el entorno de trabajo: ubicación referencial. Sin distancias ni tiempos de traslado (no documentados). Cellshop: proyecto futuro, sin fecha ni estado de obra respaldados.");

// 04 ENTORNO
s = d.slide("light"); d.eyebrow(s, "Entorno"); title(s, "Microcentro de Ciudad del Este");
d.photo(s, IMG("entorno_mapa.jpg"), { x: MG, y: 1.95, w: 5.6, h: 4.6 }, { mode: "contain", ax: 0, ay: 0, alt: "Vista satelital con referencias del entorno (documento fuente)" });
d.photo(s, IMG("entorno_2.jpg"), { x: 6.55, y: 1.95, w: 6.18, h: 2.2 }, { ax: 0.5, ay: 0.5, alt: "Vista aérea del microcentro" });
d.photo(s, IMG("entorno_3.jpg"), { x: 6.55, y: 4.35, w: 6.18, h: 2.2 }, { ax: 0.5, ay: 0.5, alt: "Vista aérea del microcentro" });
d.text(s, "Vista satelital con referencias y vistas aéreas del entorno incluidas en el documento recibido.", { x: MG, y: 6.6, w: 12.1, h: 0.28, fontSize: 9.5, color: C.grey, italic: true });
d.footer(s, 4);
notes(s, "Imágenes extraídas del PDF fuente (páginas 4 y 6). Se muestran como contexto del entorno; no se agregan distancias.");

// 05 TERRENO Y NIVELES
s = d.slide("light"); d.eyebrow(s, "Terreno y superficies"); title(s, "700 m² de terreno y cuatro niveles construidos");
s.addShape(d.pres.ShapeType.rect, { x: 1.1, y: 2.05, w: 1.6, h: 3.66, fill: { color: C.white }, line: { color: C.petroleo, width: 1.5 } });
serif(s, "700 m²", { x: 1.1, y: 3.6, w: 1.6, h: 0.45, fontSize: 18, align: "center", color: C.tierra });
d.text(s, "17,50 m de frente", { x: 0.75, y: 5.8, w: 2.3, h: 0.3, fontSize: 10.5, align: "center", color: C.grey });
d.text(s, "40 m de fondo", { x: 2.8, y: 3.7, w: 1.4, h: 0.3, fontSize: 10.5, color: C.grey });
d.figure(s, "700 m²", "Terreno: 17,50 × 40 m = 700 m² (verificado)", { x: 4.5, y: 2.05, w: 3.6, size: 24 });
d.figure(s, "2.290 m²", "Superficie construida informada, a corroborar con planos", { x: 4.5, y: 3.15, w: 3.6, size: 24 });
d.figure(s, n(M.relacion_construido_terreno, 2) + " veces", "Superficie construida sobre terreno", { x: 4.5, y: 4.25, w: 3.6, size: 24 });
d.figure(s, usd(M.usd_m2_construido), "Precio por m² construido informado", { x: 4.5, y: 5.35, w: 3.6, size: 24 });
d.table(s, [["Nivel", "Uso", "Unidades"], ["Planta baja", "Salones comerciales y estacionamiento cubierto", "3 salones · 12 plazas"],
  ["Primer piso", "Departamentos", "4"], ["Segundo piso", "Departamentos", "4"], ["Tercer piso", "Departamentos", "4"],
  [{ text: "Total", options: { bold: true } }, { text: "12 departamentos y 3 salones", options: { bold: true } }, { text: "15 unidades", options: { bold: true } }]],
  { x: 8.0, y: 2.05, w: 4.73, colW: [1.2, 2.13, 1.4], fontSize: 11, rowH: 0.62 });
d.footer(s, 5);
notes(s, "Terreno, superficie construida, niveles y distribución: PDF fuente. 17,50 × 40 = 700 m² recalculado. Relación y USD/m²: cálculos sobre la superficie informada. Esquema del lote sin escala.");

// 06 DEPARTAMENTOS
s = d.slide("light"); d.eyebrow(s, "Departamentos"); title(s, "Doce departamentos de tres dormitorios");
d.text(s, "Cada departamento, según la documentación recibida:", { x: MG, y: 1.9, w: 7, h: 0.35, fontSize: 13, color: C.grey });
card(s, MG, 2.4, 3.55, 3.4); card(s, MG + 3.75, 2.4, 3.55, 3.4);
serif(s, "Tres dormitorios", { x: MG + 0.3, y: 2.6, w: 3.0, h: 0.45, fontSize: 19 });
d.text(s, bullets(["1 dormitorio en suite", "2 dormitorios con baño familiar compartido"]), { x: MG + 0.3, y: 3.15, w: 3.0, h: 1.2, fontSize: 12.5 });
d.hair(s, MG + 0.3, 4.45, 2.95);
serif(s, "Servicio", { x: MG + 0.3, y: 4.6, w: 3.0, h: 0.45, fontSize: 19 });
d.text(s, bullets(["Habitación de servicio con baño, aparte de los tres dormitorios"]), { x: MG + 0.3, y: 5.1, w: 3.0, h: 1.0, fontSize: 12.5 });
serif(s, "Áreas comunes de la unidad", { x: MG + 4.05, y: 2.6, w: 3.1, h: 0.45, fontSize: 19 });
d.text(s, bullets(["Sala de estar", "Comedor y cocina", "Lavadero y tendedero amplio", "Balcón amplio", "1 estacionamiento"]), { x: MG + 4.05, y: 3.15, w: 3.0, h: 2.6, fontSize: 12.5 });
d.photo(s, IMG("lateral.jpg"), { x: 8.15, y: 1.9, w: W - MG - 8.15, h: 4.75 }, { ax: 0.35, ay: 0.5, alt: "Vista lateral con los balcones de los departamentos" });
d.footer(s, 6);
notes(s, "Distribución por unidad: PDF fuente (texto). Se distinguen los tres dormitorios principales de la habitación de servicio. No se informan superficies por unidad ni dimensiones de ambientes: no se agregan. Foto: Lateral Edificio (adjunto del founder).");

// 07 FOTOS EXTERIORES
s = d.slide("dark"); d.eyebrow(s, "Recorrido fotográfico"); title(s, "El edificio");
d.photo(s, IMG("aerea.jpg"), { x: MG, y: 1.95, w: 4.1, h: 4.55 }, { ax: 0.48, ay: 0.5, alt: "Vista aérea con el contorno del terreno" });
d.photo(s, IMG("frente.jpg"), { x: 4.85, y: 1.95, w: 4.1, h: 4.55 }, { ax: 0.55, ay: 0.5, alt: "Frente sobre Pampliega" });
d.photo(s, IMG("lateral.jpg"), { x: 9.1, y: 1.95, w: W - MG - 9.1, h: 4.55 }, { ax: 0.3, ay: 0.5, alt: "Vista lateral" });
[["Vista aérea: contorno del terreno marcado", MG, 4.1], ["Frente: salones en planta baja y acceso", 4.85, 4.1], ["Lateral y fondo del edificio", 9.1, W - MG - 9.1]].forEach(([t, x, w]) =>
  d.text(s, t, { x, y: 6.55, w, h: 0.28, fontSize: 10, transparency: 15 }));
d.footer(s, 7);
notes(s, "Fotos adjuntas por el founder: Aerea Edificio, Frente Edificio, Lateral Edificio. Sin retoques adicionales.");

// 08 FOTOS DESDE ALTURA
s = d.slide("light"); d.eyebrow(s, "Recorrido fotográfico"); title(s, "Vistas desde altura");
d.photo(s, IMG("vista_altura.jpg"), { x: MG, y: 1.95, w: 6.0, h: 4.55 }, { ax: 0.5, ay: 0.5, alt: "Vista del edificio desde altura" });
d.photo(s, IMG("entorno_1.jpg"), { x: 6.75, y: 1.95, w: W - MG - 6.75, h: 4.55 }, { ax: 0.5, ay: 0.5, alt: "Vista aérea del entorno urbano" });
d.text(s, "Edificio y terreno lindero, vistos desde altura", { x: MG, y: 6.55, w: 6, h: 0.28, fontSize: 10, color: C.grey });
d.text(s, "Entorno urbano del microcentro", { x: 6.75, y: 6.55, w: 5.9, h: 0.28, fontSize: 10, color: C.grey });
d.footer(s, 8);
notes(s, "Imágenes extraídas del PDF fuente (páginas 5 y 6). Se descartó la foto del frente del PDF con un vehículo de patente legible (privacidad) y la vista cenital duplicada.");

// 09 INGRESOS RESIDENCIALES
s = d.slide("light"); d.eyebrow(s, "Ingresos residenciales"); title(s, `Renta informada: ${gs(M.res_m)} por mes`);
d.table(s, [["Concepto", "Cantidad", "Canon mensual", "Total mensual", "Total anual"],
  ["Departamentos", "12", gs(M.canon_dpto), gs(M.res_m), gs(M.res_a)],
  [{ text: "Equivalente en dólares", options: { color: C.grey } }, "", usd(M.canon_dpto / M.tc), usd(M.res_m / M.tc), usd(M.res_a / M.tc)]],
  { x: MG, y: 2.0, w: 12.13, colW: [3.0, 1.4, 2.5, 2.6, 2.63], fontSize: 13, rowH: 0.6 });
const st = [["Ocupación", "12 departamentos ocupados según el documento recibido."], ["Fecha", "Documento fechado el 27/08/2026 (metadatos del archivo); la fecha del relevamiento no fue informada."],
  ["Respaldo", "Contratos, cobros y depósitos se revisan antes de la oferta: la renta está sujeta a esa actualización."], ["Tipo de cambio", M.tc_texto + "."]];
st.forEach(([a, b], i) => { const x = MG + (i % 2) * 6.15, y = 4.2 + Math.floor(i / 2) * 1.15; d.hair(s, x, y - 0.1, 5.9);
  d.text(s, a.toUpperCase(), { x, y, w: 5.9, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  d.text(s, b, { x, y: y + 0.3, w: 5.9, h: 0.65, fontSize: 12.5 }); });
d.footer(s, 9);
notes(s, "PDF fuente: 'Alquiler actual 3.000.000gs, con las 12 unidades ocupadas' y planilla de rentabilidad con alquiler mensual Gs 36.000.000. Cálculos: 12 × 3.000.000 = 36.000.000; × 12 meses = 432.000.000. USD al TC de _config.");

// 10 LOCALES Y RENTA TOTAL
s = d.slide("light"); d.eyebrow(s, "Proyección con los locales"); title(s, `Renta total estimada: ${gs(M.tot_m)} por mes`);
d.table(s, [["Concepto", "Cant.", "Canon mensual", "Total mensual", "Total anual"],
  ["Departamentos (informado)", "12", gs(M.canon_dpto), gs(M.res_m), gs(M.res_a)],
  ["Salones comerciales (estimado)", "3", gs(M.canon_local), gs(M.com_m), gs(M.com_a)],
  [{ text: "Total proyectado", options: { bold: true, color: C.crema, fill: { color: C.petroleo } } }, { text: "15", options: { bold: true, color: C.crema, fill: { color: C.petroleo } } },
   { text: "—", options: { color: C.crema, fill: { color: C.petroleo } } }, { text: gs(M.tot_m), options: { bold: true, color: C.crema, fill: { color: C.petroleo } } }, { text: gs(M.tot_a), options: { bold: true, color: C.crema, fill: { color: C.petroleo } } }]],
  { x: MG, y: 2.0, w: 7.9, colW: [2.3, 0.85, 1.45, 1.55, 1.75], fontSize: 11, rowH: 0.6 });
s.addChart(d.pres.ChartType.bar, [{ name: "Gs millones por mes", labels: ["Departamentos", "Salones"], values: [M.res_m / 1e6, M.com_m / 1e6] }],
  { x: 8.85, y: 1.95, w: 3.9, h: 2.55, barDir: "col", chartColors: [C.petroleo, C.lapacho], varyColors: true, showValue: true, dataLabelFormatCode: "0",
    dataLabelFontFace: SANS, dataLabelFontSize: 10, dataLabelColor: C.petroleo, catAxisLabelFontFace: SANS, catAxisLabelFontSize: 10, catAxisLabelColor: C.grey,
    valAxisHidden: true, valGridLine: { style: "none" }, showLegend: false, showTitle: true, title: "Renta mensual, millones de Gs", titleFontFace: SANS, titleFontSize: 11, titleColor: C.petroleo });
card(s, MG, 4.75, 12.13, 1.85, C.white);
d.text(s, [{ text: "Cómo leer esta proyección\n", options: { bold: true, fontSize: 13 } },
  { text: "Los 3 salones se suponen alquilados a Gs 3.000.000 mensuales cada uno: el canon y la ocupación de los locales están sujetos a confirmación. La proyección supone 12 meses de ocupación de las 15 unidades y es bruta, antes de gastos. No es una renta garantizada." }],
  { x: MG + 0.3, y: 4.9, w: 11.5, h: 1.55, fontSize: 12.5, lineSpacingMultiple: 1.2 });
d.footer(s, 10);
notes(s, "Hipótesis de locales: instrucción comercial del founder (05/11/2026), no informada en el PDF. 3 × 3.000.000 = 9.000.000/mes; 108.000.000/año. Total 45.000.000/mes; 540.000.000/año.");

// 11 RENTABILIDAD BRUTA
s = d.slide("dark"); d.eyebrow(s, "Rentabilidad bruta"); title(s, "Indicadores sobre el precio de venta");
d.hair(s, MG, 1.9, 12.13);
[[pct(M.res.bruta), "Rentabilidad bruta residencial", `${gs(M.res_a)} anuales informados ÷ precio`, `Recuperación simple bruta: ${n(M.res.recuperacion, 1)} años`],
 [pct(M.tot.bruta), "Rentabilidad bruta proyectada total", `${gs(M.tot_a)} anuales estimados ÷ precio`, `Recuperación simple bruta: ${n(M.tot.recuperacion, 1)} años`]].forEach((r, i) => {
  const x = MG + i * 4.1;
  serif(s, r[0], { x, y: 2.15, w: 3.8, h: 0.9, fontSize: 46, color: C.lapacho });
  d.text(s, r[1], { x, y: 3.1, w: 3.8, h: 0.32, fontSize: 13.5, bold: true });
  d.text(s, r[2], { x, y: 3.45, w: 3.8, h: 0.3, fontSize: 11, transparency: 20 });
  d.text(s, r[3], { x, y: 3.78, w: 3.8, h: 0.3, fontSize: 11, transparency: 20 });
});
d.text(s, `Precio: ${usd(M.precio_usd)} × Gs ${n(M.tc, 2)} = ${gs(M.precio_gs)}.\nTipo de cambio: ${M.tc_texto}.`,
  { x: MG, y: 4.35, w: 7.9, h: 0.65, fontSize: 11.5, lineSpacingMultiple: 1.2, transparency: 10 });
const rows = [["Tipo de cambio", "Residencial", "Total"]].concat(M.sens.map((t) => [`Gs ${n(t.tc, t.vigente ? 2 : 0)}${t.vigente ? " (vigente)" : ""}`, pct(t.res), pct(t.tot)]));
s.addTable(rows.map((r, i) => r.map((c) => ({ text: c, options: i === 0 ? { bold: true, color: C.petroleo, fill: { color: C.lapacho } } : { color: C.crema, bold: i > 0 && M.sens[i - 1].vigente, fill: { color: i > 0 && M.sens[i - 1].vigente ? C.navy_tint : C.navy2 } } }))),
  { x: 8.6, y: 2.15, w: 4.13, colW: [1.73, 1.25, 1.15], fontFace: SANS, fontSize: 11, rowH: 0.48, border: { type: "solid", pt: 0.75, color: C.navy_tint }, margin: [0, 0.1, 0, 0.1], valign: "middle" });
d.text(s, "Sensibilidad al tipo de cambio: el precio está en dólares y la renta en guaraníes. Valores ilustrativos alrededor de la cotización vigente.",
  { x: 8.6, y: 4.65, w: 4.13, h: 0.75, fontSize: 9.5, transparency: 20, lineSpacingMultiple: 1.15 });
d.hair(s, MG, 5.45, 12.13);
d.text(s, [{ text: "Cómo leer estas cifras. ", options: { bold: true } },
  { text: "Son rentabilidades brutas: no descuentan gastos, impuestos, vacancia, morosidad, gastos de adquisición ni inversiones. La recuperación simple no es una TIR. Cifras de referencia, no garantizadas." }],
  { x: MG, y: 5.6, w: 12.13, h: 0.8, fontSize: 11.5, lineSpacingMultiple: 1.2 });
d.footer(s, 11);
notes(s, "Fórmulas: precio Gs = USD 960.000 × TC; bruta = ingreso anual Gs ÷ precio Gs; recuperación = precio Gs ÷ ingreso anual Gs. Tabla de sensibilidad: valores ilustrativos de Gs 5.800, 6.000 y 6.300 más el referencial BCP vigente en _config. Las cifras publicadas por la fuente (7% 'comprobada', 9,75%) no se reproducen como resultado: ver Control Interno.");

// 12 GASTOS
s = d.slide("light"); d.eyebrow(s, "Del bruto al neto"); title(s, "Gastos a relevar antes de calcular la renta neta");
d.text(s, "La proyección de Gs 540.000.000 anuales es bruta. La renta neta se calcula cuando se conozcan estos conceptos:", { x: MG, y: 1.9, w: 12.1, h: 0.4, fontSize: 13 });
const gst = [["Impuestos y tasas", "Impuesto inmobiliario, IVA de los alquileres e impuesto a la renta según la estructura de compra."],
  ["Mantenimiento", "Reparaciones, pozo artesiano, instalaciones y recambios."], ["Administración", "Cobranza, contratos e inquilinos."],
  ["Seguros", "Cobertura del edificio y responsabilidad civil."], ["Servicios del propietario", "Áreas comunes y servicios no recuperados de los inquilinos."],
  ["Vacancia y morosidad", "Rotación de inquilinos y atrasos de cobro."], ["Gastos de adquisición", "Escritura, impuestos de transferencia y honorarios."],
  ["Adecuaciones", "Inversiones que surjan de la inspección técnica."]];
gst.forEach(([a, b], i) => { const x = MG + (i % 2) * 6.15, y = 2.55 + Math.floor(i / 2) * 1.0; d.hair(s, x, y - 0.08, 5.9);
  d.text(s, a, { x, y, w: 2.2, h: 0.8, fontSize: 12.5, bold: true }); d.text(s, b, { x: x + 2.25, y, w: 3.65, h: 0.85, fontSize: 11.5, color: C.grey }); });
d.footer(s, 12);
notes(s, "La fuente solo informa un impuesto anual de Gs 18.000.000 y expensas Gs 0 en su planilla; no alcanza para una renta neta. Sin datos completos no se calcula ni se promete rentabilidad neta.");

// 13 DOCUMENTACION Y PROXIMOS PASOS
s = d.slide("light"); d.eyebrow(s, "Documentación y próximos pasos"); title(s, "Lo que revisamos antes de una oferta");
const docs = ["Título, titularidad y cuenta corriente catastral", "Planos aprobados y superficies", "Permisos y situación municipal",
  "Contratos de los 12 departamentos", "Ocupación y alquileres de los 3 locales", "Comprobantes de cobro, depósitos y morosidad",
  "Gastos operativos e impuestos", "Estado del pozo, instalaciones y mantenimiento", "Condiciones de venta, forma de pago y gastos de escritura"];
card(s, MG, 1.95, 7.3, 4.7);
d.text(s, "DOCUMENTACIÓN A REVISAR", { x: MG + 0.3, y: 2.1, w: 6.8, h: 0.28, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, bullets(docs), { x: MG + 0.3, y: 2.45, w: 6.8, h: 4.05, fontSize: 12.5 });
d.text(s, "La fuente declara planos aprobados y documentación en regla; los respaldos se verifican en esta etapa.", { x: MG + 0.3, y: 6.1, w: 6.8, h: 0.45, fontSize: 10, color: C.grey, italic: true });
const steps = [["01", "Visita e inspección técnica"], ["02", "Documentación y contratos"], ["03", "Estructura de compra y fiscal, con abogado, escribano y contador"], ["04", "Oferta, boleto y escritura"], ["05", "Administración del edificio, si el inversor lo desea"]];
steps.forEach(([k, t], i) => { const y = 2.0 + i * 0.92; serif(s, k, { x: 8.3, y, w: 0.6, h: 0.45, fontSize: 20, color: C.tierra }); d.text(s, t, { x: 9.0, y: y + 0.05, w: 3.73, h: 0.75, fontSize: 12.5 }); });
d.footer(s, 13);
notes(s, "Lista de documentación: pedido del founder. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.");

// 14 CIERRE (preset C: 'Broker Inmobiliario · Meridiano Capital', pedido del founder; J/j en Lora)
s = d.slide("closing");
const colW = 7.6;
d.photo(s, IMG("retrato_jjc.jpg"), { x: 8.55, y: 0, w: W - 8.55, h: H }, { ax: 0.5, ay: 0, alt: "Juan José Castillo" });
d.lockup(s, { x: MG, y: 0.6, w: 2.4, dark: true });
serif(s, "Coordinemos su visita al edificio", { x: MG, y: 1.8, w: colW, h: 1.4, fontSize: 38, lineSpacingMultiple: 1.02 });
d.text(s, "Le acercamos los contratos, el detalle de alquileres, los gastos y la documentación del inmueble, y lo acompañamos en cada paso de la compra.",
  { x: MG, y: 3.3, w: colW - 0.2, h: 0.9, fontSize: 14, transparency: 10, lineSpacingMultiple: 1.25 });
d.hair(s, MG, 4.45, colW - 0.25, C.lapacho);
serif(s, "Juan José Castillo", { x: MG, y: 4.6, w: colW, h: 0.5, fontSize: 22 });
d.text(s, "Broker Inmobiliario  |  Meridiano Capital", { x: MG, y: 5.1, w: colW, h: 0.35, fontSize: 13 });
d.text(s, [M.contacto.telefono, M.contacto.email, M.contacto.web].join("  ·  "), { x: MG, y: 5.5, w: colW, h: 0.35, fontSize: 12.5 });
d.text(s, K.TOKENS.disclaimers.venta + " No constituye una garantía de rentabilidad.", { x: MG, y: 5.95, w: colW - 0.1, h: 0.55, fontSize: 9, italic: true, transparency: 25, lineSpacingMultiple: 1.15 });
d.hair(s, MG, 6.78, colW - 0.25, C.crema);
d.text(s, "MERIDIANO CAPITAL  ·  OPERADORES TÉCNICOS Y LEGALES DE INVERSIONES INMOBILIARIAS", { x: MG, y: 6.9, w: colW, h: 0.3, fontSize: 9, bold: true, charSpacing: 1.2, valign: "middle" });
notes(s, "Contacto: _config/meridiano.json (D-096): teléfono único +595 982 853 111. Cargo pedido por el founder: 'Broker Inmobiliario | Meridiano Capital'. Retrato: el mismo de las presentaciones vigentes. Aviso legal: disclaimer de venta (D-098) + no garantía de rentabilidad.");

d.save(OUT).then((f) => console.log("PPTX:", f));
