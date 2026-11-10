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
const MAPS = M.maps;   // ubicación confirmada por el founder (07/11/2026)

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
  figures: [[usd(M.precio_usd), "Precio de venta publicado"], [usd(M.precios.rap.P), "Venta rápida sugerida por Meridiano Capital"]],
  footnote: `Presentación de Meridiano Capital para inversores  ·  ${M.tc_corto}`,
  notes: "Fuente: PDF 'Edificio Departamentos Catedral' (metadatos 27/08/2026) y pedidos del founder (05 y 07/11/2026). Venta rápida USD 800.000: valor sugerido por Meridiano Capital (founder, 07/11/2026). Foto: Frente Edificio (adjunto del founder)."
});

// 02 RESUMEN
s = d.slide("light"); d.eyebrow(s, "Resumen del activo"); title(s, "Un edificio de renta de uso mixto en el microcentro");
d.text(s, "Edificio de cuatro niveles con 12 departamentos de tres dormitorios y 150 m², 3 salones comerciales y estacionamiento cubierto para 12 vehículos. Los 12 departamentos están alquilados según la documentación recibida; de los 3 salones, 1 está alquilado y 2 están desocupados.",
  { x: MG, y: 1.85, w: 12.1, h: 0.7, fontSize: 13.5, lineSpacingMultiple: 1.2 });
const kp = [[usd(M.precio_usd), `Precio publicado · aprox. ${gs(Math.round(M.precio_gs / 1e6) * 1e6)}`], [usd(M.precios.rap.P), "Venta rápida sugerida por Meridiano Capital"],
  ["700 m²", "Terreno de 17,50 × 40 m"], ["2.290 m²", "Superficie construida informada"],
  ["12 × 150 m²", "Departamentos de tres dormitorios"], ["12 cocheras", "Estacionamiento cubierto"],
  [gs(M.act_m), "Renta mensual actual estimada (12 dptos. y 1 salón)"], [gs(M.tot_m), "Con los 2 salones desocupados alquilados"]];
kp.forEach((k, i) => { const x = MG + (i % 4) * 3.07, y = 3.0 + Math.floor(i / 4) * 1.27; d.hair(s, x, y - 0.12, 2.8); d.figure(s, k[0], k[1], { x, y, w: 2.85, size: 24 }); });
card(s, MG, 5.6, 12.13, 1.05, C.white);
d.text(s, [{ text: "Propuesta para el inversor. ", options: { bold: true } },
  { text: `Comprar un activo con renta en curso y dos salones para alquilar, a ${usd(M.precio_usd)} o al precio de venta rápida sugerido de ${usd(M.precios.rap.P)}, con acompañamiento de Meridiano Capital en la revisión documental, la estructura de compra y la administración posterior.` }],
  { x: MG + 0.25, y: 5.7, w: 11.6, h: 0.85, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.2 });
d.footer(s, 2);
notes(s, "Precio, terreno, superficie, niveles, unidades y cocheras: PDF fuente. 2.290 m² informados, a corroborar con planos. Renta residencial: 12 × Gs 3.000.000 (PDF). Renta actual estimada: 12 dptos + 1 salón alquilado (canon no informado; hipótesis Gs 3.000.000). Potencial: con los 2 salones desocupados alquilados a la misma hipótesis. Departamentos de 150 m² y ocupación de los salones: founder, 07/11/2026. Venta rápida sugerida USD 800.000. Equivalencia en Gs al TC de _config.");

// 03 UBICACION
s = d.slide("light"); d.eyebrow(s, "Ubicación"); title(s, "Barrio Catedral, a pasos del microcentro");
d.photo(s, IMG("ubicacion.jpg"), { x: MG, y: 1.95, w: 7.0, h: 4.67 }, { mode: "contain", ax: 0, ay: 0, alt: "Mapa del entorno (Google Maps)", hyperlink: MAPS });
const xr = 8.0, wr = W - MG - xr;
d.text(s, "DIRECCIÓN", { x: xr, y: 1.95, w: wr, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, "Pampliega casi Av. Mayor Rivas Ortellado, Barrio Catedral, Ciudad del Este", { x: xr, y: 2.22, w: wr, h: 0.6, fontSize: 13 });
d.text(s, "ENTORNO", { x: xr, y: 3.0, w: wr, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, bullets(["Catedral San Blas", "Shopping China", "Hotel Acaray", "Futuro centro comercial Cellshop (apertura proyectada para fines de 2026 según prensa; no confirmada)"]),
  { x: xr, y: 3.27, w: wr, h: 1.5, fontSize: 12.5 });
d.photo(s, IMG("qr_ubicacion.png"), { x: xr, y: 4.95, w: 1.15, h: 1.15 }, { mode: "contain", alt: "Código QR de la ubicación en Google Maps", hyperlink: MAPS });
d.text(s, [{ text: "Abrir en Google Maps", options: { hyperlink: { url: MAPS }, bold: true, color: C.tierra } }, { text: "\n" + MAPS.replace("https://", ""), options: { fontSize: 10, color: C.grey } }],
  { x: xr + 1.3, y: 5.05, w: wr - 1.3, h: 0.7, fontSize: 12 });
d.text(s, "Ubicación confirmada por Meridiano Capital: punto exacto en el enlace y en el código QR. El mapa muestra el entorno.", { x: xr, y: 6.2, w: wr, h: 0.45, fontSize: 10, color: C.grey, italic: true });
d.footer(s, 3);
notes(s, "Mapa: Ubicacion.png (adjunto del founder, base Google Maps con rótulos agregados), como vista del entorno. Ubicación confirmada por el founder el 07/11/2026 con el enlace maps.app.goo.gl/uPDUSU5wzgi6K3iNA (enlace y QR). Sin distancias ni tiempos de traslado (no documentados). Cellshop: complejo de 53.000 m² con apertura proyectada para el Black Friday 2026 según ABC Color (15/07/2026); proyección publicada, no confirmada.");

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
d.figure(s, "12 × 150 m²", `Departamentos: ${n(M.sup_dptos)} m² de los 2.290 m² construidos`, { x: 4.5, y: 4.25, w: 3.6, size: 24 });
d.figure(s, `${usd(M.precios.pub.usd_m2)} · ${n(M.precios.rap.usd_m2)}`, "Por m² construido (publicado · venta rápida)", { x: 4.5, y: 5.35, w: 3.6, size: 24 });
d.table(s, [["Nivel", "Uso", "Unidades"], ["Planta baja", "Salones (1 alquilado, 2 desocupados) y estacionamiento", "3 salones · 12 plazas"],
  ["Primer piso", "Departamentos de 150 m²", "4"], ["Segundo piso", "Departamentos de 150 m²", "4"], ["Tercer piso", "Departamentos de 150 m²", "4"],
  [{ text: "Total", options: { bold: true } }, { text: "12 departamentos y 3 salones", options: { bold: true } }, { text: "15 unidades", options: { bold: true } }]],
  { x: 8.0, y: 2.05, w: 4.73, colW: [1.1, 2.38, 1.25], fontSize: 11, rowH: 0.62 });
d.footer(s, 5);
notes(s, "Terreno, superficie construida, niveles y distribución: PDF fuente. 17,50 × 40 = 700 m² recalculado. Departamentos de 150 m² (founder, 07/11/2026): 12 × 150 = 1.800 m². USD/m²: cálculos sobre la superficie informada, a los dos precios. Esquema del lote sin escala.");

// 06 DEPARTAMENTOS
s = d.slide("light"); d.eyebrow(s, "Departamentos"); title(s, "Doce departamentos de 150 m² y tres dormitorios");
d.text(s, "Cada departamento tiene 150 m² y, según la documentación recibida:", { x: MG, y: 1.9, w: 7, h: 0.35, fontSize: 13, color: C.grey });
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
notes(s, "Distribución por unidad: PDF fuente (texto). Se distinguen los tres dormitorios principales de la habitación de servicio. Superficie por departamento: 150 m² (founder, 07/11/2026); dimensiones de ambientes no informadas. Foto: Lateral Edificio (adjunto del founder).");

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
  [{ text: "Equivalente en dólares", options: { color: C.grey } }, "", usd(M.canon_dpto / M.tc), usd(M.res_m / M.tc), usd(M.res_a / M.tc)],
  [{ text: "Por m² del departamento", options: { color: C.grey } }, "150 m²", gs(M.gs_m2_dpto) + "/m²", "", ""]],
  { x: MG, y: 2.0, w: 12.13, colW: [3.0, 1.4, 2.5, 2.6, 2.63], fontSize: 13, rowH: 0.55 });
const st = [["Ocupación", "12 departamentos alquilados según el documento recibido."], ["Fecha", "Documento fechado el 27/08/2026 (metadatos del archivo); la fecha del relevamiento no fue informada."],
  ["Respaldo", "Contratos, cobros y depósitos se revisan antes de la oferta: la renta está sujeta a esa actualización."], ["Tipo de cambio", M.tc_texto + "."]];
st.forEach(([a, b], i) => { const x = MG + (i % 2) * 6.15, y = 4.45 + Math.floor(i / 2) * 1.1; d.hair(s, x, y - 0.1, 5.9);
  d.text(s, a.toUpperCase(), { x, y, w: 5.9, h: 0.25, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  d.text(s, b, { x, y: y + 0.3, w: 5.9, h: 0.65, fontSize: 12.5 }); });
d.footer(s, 9);
notes(s, "PDF fuente: 'Alquiler actual 3.000.000gs, con las 12 unidades ocupadas' y planilla de rentabilidad con alquiler mensual Gs 36.000.000. Cálculos: 12 × 3.000.000 = 36.000.000; × 12 meses = 432.000.000. USD al TC de _config.");

// 10 LOCALES Y RENTA ACTUAL / POTENCIAL (07/11/2026: 1 salón alquilado, 2 desocupados)
s = d.slide("light"); d.eyebrow(s, "Renta actual y potencial"); title(s, `Renta actual estimada: ${gs(M.act_m)} por mes`);
const TOT = (t) => ({ text: t, options: { bold: true, color: C.crema, fill: { color: C.petroleo } } });
const SUB = (t) => ({ text: t, options: { bold: true, fill: { color: C.crema } } });
d.table(s, [["Concepto", "Cant.", "Canon mensual", "Total mensual", "Total anual"],
  ["Departamentos (informado)", "12", gs(M.canon_dpto), gs(M.res_m), gs(M.res_a)],
  ["Salón alquilado (canon no informado)", "1", gs(M.canon_local), gs(M.salones_alq * M.canon_local), gs(M.salones_alq * M.canon_local * 12)],
  [SUB("Renta actual estimada"), SUB("13"), SUB("—"), SUB(gs(M.act_m)), SUB(gs(M.act_a))],
  ["Salones desocupados (potencial)", "2", gs(M.canon_local), gs(M.salones_vac * M.canon_local), gs(M.salones_vac * M.canon_local * 12)],
  [TOT("Renta potencial"), TOT("15"), TOT("—"), TOT(gs(M.tot_m)), TOT(gs(M.tot_a))]],
  { x: MG, y: 1.95, w: 7.9, colW: [2.55, 0.65, 1.45, 1.5, 1.75], fontSize: 10.5, rowH: 0.48 });
s.addChart(d.pres.ChartType.bar, [{ name: "Gs millones por mes", labels: ["Departamentos", "Salón alquilado", "Salones vacíos"], values: [M.res_m / 1e6, M.salones_alq * M.canon_local / 1e6, M.salones_vac * M.canon_local / 1e6] }],
  { x: 8.85, y: 1.95, w: 3.9, h: 2.75, barDir: "col", chartColors: [C.petroleo, C.tierra, C.lapacho], varyColors: true, showValue: true, dataLabelFormatCode: "0",
    dataLabelFontFace: SANS, dataLabelFontSize: 10, dataLabelColor: C.petroleo, catAxisLabelFontFace: SANS, catAxisLabelFontSize: 9.5, catAxisLabelColor: C.grey,
    valAxisHidden: true, valGridLine: { style: "none" }, showLegend: false, showTitle: true, title: "Renta mensual, millones de Gs", titleFontFace: SANS, titleFontSize: 11, titleColor: C.petroleo });
card(s, MG, 5.0, 12.13, 1.65, C.white);
d.text(s, [{ text: "Cómo leer estas cifras\n", options: { bold: true, fontSize: 13 } },
  { text: `De los 3 salones, 1 está alquilado y 2 están desocupados. El canon del salón alquilado no fue informado: se usa ${gs(M.canon_local)}, la mediana del mercado (lámina 12), sujeto a confirmar con su contrato. La renta potencial supone alquilar los 2 salones desocupados al mismo valor y 12 meses de ocupación. Son rentas brutas, antes de gastos, y no están garantizadas.` }],
  { x: MG + 0.3, y: 5.12, w: 11.5, h: 1.45, fontSize: 12, lineSpacingMultiple: 1.18 });
d.footer(s, 10);
notes(s, "Ocupación de los salones: founder, 07/11/2026 (1 alquilado, 2 desocupados). Canon del salón alquilado no informado: hipótesis Gs 3.000.000 (mediana del estudio CDE-CATEDRAL-2026-11-07). Actual: 36.000.000 + 3.000.000 = 39.000.000/mes; 468.000.000/año. Potencial: 45.000.000/mes; 540.000.000/año.");

// 11-12 MERCADO (estudio estándar CDE-CATEDRAL-2026-11-07, D-100)
const MK = M.mercado; const CP = Object.fromEntries(MK.comparables.map((c) => [c.codigo, c]));
const fmM = (x) => "Gs " + n(x / 1e6, 1) + " M";
const precioPub = (c) => c.moneda === "USD" ? usd(c.precio) : gs(c.precio);
const mktSlide = (num, eyebrowTxt, titleTxt, rowsSpec, figs, lectura, nota, notesTxt) => {
  const s = d.slide("light"); d.eyebrow(s, eyebrowTxt); title(s, titleTxt, { fontSize: 27 });
  const body = [["Aviso", "Zona", "Publicado", "En Gs"]].concat(rowsSpec.map(([cod, txt]) => [txt, CP[cod].zona.replace(", CDE", ""), precioPub(CP[cod]), gs(Math.round(CP[cod].gs))]));
  d.table(s, body, { x: MG, y: 1.95, w: 7.75, colW: [3.4, 1.5, 1.3, 1.55], fontSize: 10.5, rowH: 0.47 });
  figs.forEach(([v, l], i) => d.figure(s, v, l, { x: 8.75, y: 1.95 + i * 1.05, w: 4.0, size: 24 }));
  card(s, 8.75, 5.15, 3.98, 1.45, C.white);
  d.text(s, lectura, { x: 8.95, y: 5.25, w: 3.6, h: 1.28, fontSize: 10.5, lineSpacingMultiple: 1.15 });
  d.text(s, nota, { x: MG, y: 6.4, w: 7.75, h: 0.45, fontSize: 9, color: C.grey, italic: true });
  d.footer(s, num); notes(s, notesTxt);
};
mktSlide(11, "Mercado de alquileres · departamentos", "Gs 3.000.000 por departamento: dentro del mercado, en la banda baja",
  [["R1", "Edificio Oriental, 3 dorm., 150 m², cochera"], ["R2", "3 dorm. amoblado, suite y servicio, cochera"], ["R7", "3 suites, 270 m², semi amoblado"],
   ["R4", "3 hab., piso 3, sin ascensor ni cochera"], ["R5", "3 hab., semi amoblado, amenities"], ["R8", "Casa de 3 dorm., 120 m²"]],
  [[fmM(MK.res.mediana), `Mediana de ${MK.res.n} avisos de 3 dormitorios en CDE`], [`${fmM(MK.res.std_min)} a ${fmM(MK.res.std_max)}`, "Unidades estándar, sin amoblar"],
   [`${gs(M.gs_m2_dpto)}/m²`, `Canon del edificio: ${gs(M.canon_dpto)} por 150 m²`]],
  `Con 150 m², el canon equivale a ${gs(M.gs_m2_dpto)}/m², debajo de los avisos con superficie publicada (Gs ${n(Math.min(...Object.values(MK.res.gs_m2_comparables)))} a ${n(Math.max(...Object.values(MK.res.gs_m2_comparables)))}/m²). Rango preliminar por departamento: ${fmM(MK.res.rango_prelim[0])} a ${fmM(MK.res.rango_prelim[1])}, según estado (confianza media-baja); se negocia al renovar contratos.`,
  `Avisos publicados consultados el 07/11/2026 (InfoCasas, MercadoProp, UbicaProp): disponibilidad no confirmada, no son contratos. Equivalencias al ${M.tc_corto}.`,
  "Fuente: estudio de mercado CDE-CATEDRAL-2026-11-07 (knowledge-base/investment/market-intelligence/estudios/). Mediana de los 8 avisos de 3 dormitorios R1-R8; estándar sin amoblar R4-R8. Canon por m² con 150 m² por departamento (founder, 07/11/2026); comparables con superficie: R1 Edificio Oriental 150 m² (Gs 64.804/m²), R7 270 m² (Gs 22.222/m²), R8 casa 120 m² (Gs 25.000/m²).");
mktSlide(12, "Mercado comercial · salones", "Gs 3.000.000 por salón: en la mediana de los salones publicados",
  [["C1", "Esquina, Av. Cap. Emeterio Miranda, 75 m²"], ["C2", "Premium, doble Av. Eusebio Ayala, 75 m²"], ["C3", "Salón de 50 m²"],
   ["C8", "Av. Itaipú Oeste, 48 m², agua incluida"], ["C10", "Esquina sobre avenida, 100 m²"], ["C14", "Local Km 3½, 168 m²"]],
  [[fmM(MK.com.mediana), `Mediana de ${MK.com.n} avisos de salones en CDE`], [`${fmM(MK.com.std_min)} a ${fmM(MK.com.std_max)}`, "Salones estándar (sin el premium)"],
   [gs(M.canon_local), "Hipótesis por salón (1 alquilado, 2 desocupados)"]],
  `Rango preliminar por salón: ${fmM(MK.com.rango_prelim[0])} a ${fmM(MK.com.rango_prelim[1])}, según superficie, frente y estado, que todavía no conocemos. Es una hipótesis, no una tasación: 1 salón está alquilado (canon a confirmar) y 2 están desocupados.`,
  `Avisos publicados consultados el 07/11/2026 (RE/MAX, InfoCasas, ViaParaguay, MercadoProp): disponibilidad no confirmada, no son contratos. Equivalencias al ${M.tc_corto}.`,
  "Fuente: estudio de mercado CDE-CATEDRAL-2026-11-07. Mediana de los 14 avisos C1-C14; rango estándar sin el premium C2. Microcentro: galerías hasta USD 50/m² (Última Hora, 16/10/2026).");

// 13 RENTABILIDAD BRUTA A LOS DOS PRECIOS (publicado y venta rápida sugerida)
s = d.slide("dark"); d.eyebrow(s, "Rentabilidad bruta"); title(s, "Indicadores a los dos precios");
const PP = M.precios.pub, PR = M.precios.rap;
const colX = [MG, MG + 3.45, MG + 5.75];
d.text(s, `PUBLICADO · ${usd(PP.P)}`, { x: colX[1], y: 1.95, w: 2.2, h: 0.3, fontSize: 9.5, bold: true, color: C.lapacho, charSpacing: 0.5 });
d.text(s, `VENTA RÁPIDA · ${usd(PR.P)}`, { x: colX[2], y: 1.95, w: 2.3, h: 0.3, fontSize: 9.5, bold: true, color: C.lapacho, charSpacing: 0.5 });
[["Bruta actual estimada", `${gs(M.act_a)} por año: 12 dptos. y 1 salón`, (p) => pct(p.act.bruta)],
 ["Bruta residencial", `${gs(M.res_a)} por año: 12 dptos. informados`, (p) => pct(p.res.bruta)],
 ["Bruta potencial", `${gs(M.tot_a)} por año: con los 2 salones vacíos`, (p) => pct(p.tot.bruta)],
 ["Recuperación simple (actual)", "Precio ÷ renta bruta anual; no es TIR", (p) => n(p.act.recuperacion, 1) + " años"]].forEach(([a, b, f], i) => {
  const y = 2.35 + i * 0.74;
  d.hair(s, MG, y - 0.06, 7.85);
  d.text(s, a, { x: colX[0], y, w: 3.35, h: 0.3, fontSize: 13, bold: true });
  d.text(s, b, { x: colX[0], y: y + 0.3, w: 3.35, h: 0.3, fontSize: 9.5, transparency: 20 });
  serif(s, f(PP), { x: colX[1], y: y - 0.02, w: 2.2, h: 0.6, fontSize: i === 0 ? 30 : 24, color: C.lapacho });
  serif(s, f(PR), { x: colX[2], y: y - 0.02, w: 2.4, h: 0.6, fontSize: i === 0 ? 30 : 24, color: C.crema });
});
d.text(s, `Precio en Gs: ${usd(PP.P)} = ${gs(PP.Pgs)}; ${usd(PR.P)} = ${gs(PR.Pgs)}, al ${M.tc_texto}. La venta rápida es un valor sugerido por Meridiano Capital, ${n(PR.desc * 100, 1)}% debajo del publicado, sujeto a aceptación del propietario.`,
  { x: MG, y: 5.3, w: 7.85, h: 0.6, fontSize: 10, lineSpacingMultiple: 1.15, transparency: 10 });
const rows = [["Fecha BCP", "Gs/USD", "960 k", "800 k"]].concat(M.sens.map((t) => [t.n.slice(0, 5) + (t.vigente ? " (vigente)" : ""), n(t.tc, 2), pct(t.pub.act), pct(t.rap.act)]));
s.addTable(rows.map((r, i) => r.map((c) => ({ text: c, options: i === 0 ? { bold: true, color: C.petroleo, fill: { color: C.lapacho } } : { color: C.crema, bold: i > 0 && M.sens[i - 1].vigente, fill: { color: i > 0 && M.sens[i - 1].vigente ? C.navy_tint : C.navy2 } } }))),
  { x: 8.75, y: 1.95, w: 3.98, colW: [1.45, 0.93, 0.8, 0.8], fontFace: SANS, fontSize: 10.5, rowH: 0.42, border: { type: "solid", pt: 0.75, color: C.navy_tint }, margin: [0, 0.1, 0, 0.1], valign: "middle" });
d.text(s, "Bruta actual estimada según el tipo de cambio de cada día: el precio está en dólares y la renta en guaraníes; con la suba del dólar, la misma renta rinde menos.",
  { x: 8.75, y: 4.55, w: 3.98, h: 0.75, fontSize: 9.5, transparency: 20, lineSpacingMultiple: 1.15 });
d.hair(s, MG, 6.0, 12.13);
d.text(s, [{ text: "Cómo leer estas cifras. ", options: { bold: true } },
  { text: "Rentabilidades brutas: no descuentan gastos, impuestos, vacancia, morosidad, gastos de adquisición ni inversiones. Cifras de referencia, no garantizadas." }],
  { x: MG, y: 6.1, w: 12.13, h: 0.5, fontSize: 11, lineSpacingMultiple: 1.15 });
d.footer(s, 13);
notes(s, "Fórmulas: precio Gs = USD 960.000 × TC; bruta = ingreso anual Gs ÷ precio Gs; recuperación = precio Gs ÷ ingreso anual Gs. Precios: publicado USD 960.000 y venta rápida sugerida USD 800.000 (founder, 07/11/2026). Renta actual: 12 dptos + 1 salón (hipótesis Gs 3.000.000). Tabla: bruta actual a cada TC de la serie BCP (16/10 cierre interbancario; 03, 04, 05 y 06/11 referencial), para los dos precios. Las cifras publicadas por la fuente (7% 'comprobada', 9,75%) no se reproducen como resultado: ver Control Interno.");

// 14 GASTOS
s = d.slide("light"); d.eyebrow(s, "Del bruto al neto"); title(s, "Gastos a relevar antes de calcular la renta neta");
d.text(s, `Las rentas de ${gs(M.act_a)} (actual) y ${gs(M.tot_a)} (potencial) anuales son brutas. La renta neta se calcula cuando se conozcan estos conceptos:`, { x: MG, y: 1.9, w: 12.1, h: 0.4, fontSize: 13 });
const gst = [["Impuestos y tasas", "Impuesto inmobiliario, IVA de los alquileres e impuesto a la renta según la estructura de compra."],
  ["Mantenimiento", "Reparaciones, pozo artesiano, instalaciones y recambios."], ["Administración", "Cobranza, contratos e inquilinos."],
  ["Seguros", "Cobertura del edificio y responsabilidad civil."], ["Servicios del propietario", "Áreas comunes y servicios no recuperados de los inquilinos."],
  ["Vacancia y morosidad", "Rotación de inquilinos y atrasos de cobro."], ["Gastos de adquisición", "Escritura, impuestos de transferencia y honorarios."],
  ["Adecuaciones", "Inversiones que surjan de la inspección técnica."]];
gst.forEach(([a, b], i) => { const x = MG + (i % 2) * 6.15, y = 2.55 + Math.floor(i / 2) * 1.0; d.hair(s, x, y - 0.08, 5.9);
  d.text(s, a, { x, y, w: 2.2, h: 0.8, fontSize: 12.5, bold: true }); d.text(s, b, { x: x + 2.25, y, w: 3.65, h: 0.85, fontSize: 11.5, color: C.grey }); });
d.footer(s, 14);
notes(s, "La fuente solo informa un impuesto anual de Gs 18.000.000 y expensas Gs 0 en su planilla; no alcanza para una renta neta. Sin datos completos no se calcula ni se promete rentabilidad neta.");

// 15 DOCUMENTACION Y PROXIMOS PASOS
s = d.slide("light"); d.eyebrow(s, "Documentación y próximos pasos"); title(s, "Lo que revisamos antes de una oferta");
const docs = ["Título, titularidad y cuenta corriente catastral", "Planos aprobados y superficies", "Permisos y situación municipal",
  "Contratos de los 12 departamentos", "Contrato del salón alquilado y estado de los 2 desocupados", "Comprobantes de cobro, depósitos y morosidad",
  "Gastos operativos e impuestos", "Estado del pozo, instalaciones y mantenimiento", "Condiciones de venta, forma de pago y gastos de escritura"];
card(s, MG, 1.95, 7.3, 4.7);
d.text(s, "DOCUMENTACIÓN A REVISAR", { x: MG + 0.3, y: 2.1, w: 6.8, h: 0.28, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
d.text(s, bullets(docs), { x: MG + 0.3, y: 2.45, w: 6.8, h: 4.05, fontSize: 12.5 });
d.text(s, "La fuente declara planos aprobados y documentación en regla; los respaldos se verifican en esta etapa.", { x: MG + 0.3, y: 6.1, w: 6.8, h: 0.45, fontSize: 10, color: C.grey, italic: true });
const steps = [["01", "Visita e inspección técnica"], ["02", "Documentación y contratos"], ["03", "Estructura de compra y fiscal, con abogado, escribano y contador"], ["04", "Oferta, boleto y escritura"], ["05", "Administración del edificio, si el inversor lo desea"]];
steps.forEach(([k, t], i) => { const y = 2.0 + i * 0.92; serif(s, k, { x: 8.3, y, w: 0.6, h: 0.45, fontSize: 20, color: C.tierra }); d.text(s, t, { x: 9.0, y: y + 0.05, w: 3.73, h: 0.75, fontSize: 12.5 }); });
d.footer(s, 15);
notes(s, "Lista de documentación: pedido del founder. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.");

// 16 CIERRE (preset C: 'Broker Inmobiliario · Meridiano Capital', pedido del founder; J/j en Lora)
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
