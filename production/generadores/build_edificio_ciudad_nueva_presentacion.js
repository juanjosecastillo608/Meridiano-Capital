// Edificio Ciudad Nueva — presentación para inversores, versión final para el cliente.
// Kit: skill meridiano-property-presentation-adapter (scripts/meridiano_deck_kit.js).
// Fuentes: detalle de alquileres y planilla del propietario (verificados por el founder el 03/10/2026),
// tipo de cambio del día (BCP, cierre interbancario 02/10/2026), ubicación real (OpenStreetMap/Overture,
// build_edificio_ciudad_nueva_ubicacion.py) y parámetros del founder y del motor de Meridiano.
// Todas las cifras coinciden con el Excel (build_edificio_ciudad_nueva_excel.py); el script frena si la suma no da.
// Uso: NODE_PATH=$PWD/node_modules node build_edificio_ciudad_nueva_presentacion.js [salida.pptx]
"use strict";
const fs = require("fs");
const path = require("path");
const KIT = process.env.MC_DECK_KIT ||
  "/root/.claude/skills/synced/03a6d187-4698-465a-8a04-848dbd055d31_cb762160-afd7-4e8c-b3e7-0ea718715011/meridiano-property-presentation-adapter/scripts/meridiano_deck_kit.js";
const K = require(KIT);

const ROOT = path.resolve(__dirname, "../..");
const IMG = (f) => path.join(__dirname, "assets-edificio-ciudad-nueva", f);
const RETRATO = path.join(__dirname, "assets-puerto-fenix", "jjc_retrato.jpg"); // D-099: retrato siempre en el cierre
const UBIC = JSON.parse(fs.readFileSync(path.join(ROOT, "projects/edificio-ciudad-nueva/trabajo/ubicacion.json"), "utf8"));
const OUT = process.argv[2] || path.join(ROOT, "projects/edificio-ciudad-nueva/entregables/Edificio_Ciudad_Nueva_Meridiano_FINAL.pptx");

// ---- parámetros (iguales a la hoja Parametros del Excel) ----
const PRECIO = 340000, TC = 5873, TC_FECHA = "02/10/2026";
const IVA_DPTO = 0.05, IVA_COM = 0.10, VAC = 0.03, ADM = 0.08, MANT = 0.05, FIJOS = 1200, IRE = 0.10, IVA_VENTA = 0.015;
const ESC = [["Conservador", 0.03, 0.02], ["Base", 0.05, 0.035], ["Optimista", 0.08, 0.05]];
const ALQ = [
  ["Tercer piso", "2 dorm.", 1500000, "D"], ["Tercer piso", "2 dorm.", 1500000, "D"], ["Tercer piso", "1 dorm.", 1200000, "D"], ["Tercer piso", "1 dorm.", 1100000, "D"],
  ["Segundo piso", "2 dorm.", 1600000, "D"], ["Segundo piso", "2 dorm.", 1500000, "D"], ["Segundo piso", "2 dorm.", 1500000, "D"], ["Segundo piso", "2 dorm.", 1500000, "D"], ["Segundo piso", "1 dorm.", 1250000, "D"],
  ["Primer piso", "1 dorm.", 1300000, "D"], ["Primer piso", "3 dorm.", 1600000, "D"],
  ["Planta baja", "1 dorm.", 1200000, "D"], ["Planta baja", "1 dorm.", 900000, "D"], ["Planta baja", "Cochera", 700000, "C"], ["Planta baja", "Cochera y departamento", 1200000, "C"],
];

// ---- cálculo (mismo método que el Excel y que calculadora.py: % sobre el bruto) ----
const GS_MES = ALQ.reduce((a, r) => a + r[2], 0);
if (GS_MES !== 19550000) throw new Error(`La suma del detalle (${GS_MES}) no coincide con el total indicado (19.550.000)`);
const IVA_GS_MES = ALQ.reduce((a, r) => a + r[2] * (r[3] === "D" ? IVA_DPTO : IVA_COM), 0);
const USD_MES = GS_MES / TC, BRUTO = USD_MES * 12, IVA = IVA_GS_MES * 12 / TC, IVA_EF = IVA / BRUTO;
const V = BRUTO * VAC, AD = BRUTO * ADM, MA = BRUTO * MANT;
const PRE = BRUTO - IVA - V - AD - MA - FIJOS, IR = PRE * IRE, NETO = PRE - IR;
const YB = BRUTO / PRECIO, YPRE = PRE / PRECIO, YN = NETO / PRECIO, MULT = PRECIO / BRUTO;
const netoAnio = (b) => (b * (1 - IVA_EF - VAC - ADM - MANT) - FIJOS) * (1 - IRE);
const irr = (cf) => { let lo = -0.9, hi = 1; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, v = cf.reduce((a, c, t) => a + c / (1 + m) ** t, 0); if (v > 0) lo = m; else hi = m; } return (lo + hi) / 2; };
const PROY = ESC.map(([n, g, a]) => {
  const brutos = [1, 2, 3, 4, 5].map((y) => BRUTO * (1 + g) ** (y - 1)), netos = brutos.map(netoAnio);
  const V5 = PRECIO * (1 + a) ** 5, ivaV = V5 * IVA_VENTA, rentaAc = netos.reduce((x, y) => x + y, 0);
  const cf = [-PRECIO, ...netos]; cf[5] += V5 - ivaV;
  return { n, g, a, brutos, netos, V5, plus: V5 - PRECIO, ivaV, rentaAc, total: V5 - PRECIO - ivaV + rentaAc, tir: irr(cf) };
});
const PISOS = ["Tercer piso", "Segundo piso", "Primer piso", "Planta baja"];
const porPiso = PISOS.map((p) => ALQ.filter((r) => r[0] === p).reduce((a, r) => a + r[2], 0));
const avg = (t) => { const r = ALQ.filter((x) => x[1] === t); return r.reduce((a, x) => a + x[2], 0) / r.length; };

// ---- formatos es-PY ----
const miles = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const gs = (n) => `Gs ${miles(n)}`;
const usd = (n) => `USD ${miles(n)}`;
const pct = (x, d = 2) => (x * 100).toFixed(d).replace(".", ",") + "%";
const dec = (x, d = 1) => x.toFixed(d).replace(".", ",");
const mts = (m) => `${Math.round(m / 10) * 10} m`;

const AV = (re) => UBIC.avenidas.find((a) => re.test(a.via));
const D_EA = AV(/Eusebio Ayala/).por_calle_m, D_RF = AV(/Rodriguez de Francia/).por_calle_m, D_M4 = UBIC.mercado4.por_calle_m;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${UBIC.punto_referencia.lat},${UBIC.punto_referencia.lon}`;
const TC_TXT = `Tipo de cambio: Gs ${miles(TC)} por USD (BCP, cierre interbancario del ${TC_FECHA}).`;
const FUENTES = `Fuentes: detalle de alquileres y planilla del propietario (verificados 03/10/2026); ${TC_TXT}`;

(async () => {
  // Firma pedida por el founder (rank 1): "Broker Inmobiliario | Meridiano Capital".
  K.TOKENS.signature_presets.U_brief_founder = { decision: "Pedido del founder 2026-10-02", title: "Broker Inmobiliario  |  Meridiano Capital", brand_above: false, institutional_footer: null };

  const d = K.createDeck({ title: "Edificio Ciudad Nueva — Edificio de renta en venta", subject: "Presentación para inversores",
    footerLabel: "Meridiano Capital  ·  Edificio Ciudad Nueva  ·  Venta" });
  const { C, M, R, SANS, SERIF } = d;
  const pres = d.pres;
  let n = 1;
  const block = (s, x, y, w, k, v, o = {}) => { // filete + rótulo + texto
    d.hair(s, x, y, w);
    d.text(s, k.toUpperCase(), { x, y: y + 0.13, w, h: 0.28, fontSize: 10, bold: true, color: s._mcDark ? C.lapacho : C.gold_d, charSpacing: 2 });
    d.text(s, v, Object.assign({ x, y: y + 0.43, w, h: 0.62, fontSize: 12.5, lineSpacingMultiple: 1.15 }, o));
  };

  // 1 — Portada
  d.cover({
    photo: IMG("vista-aerea-edificio.jpg"), photoMode: "panel", photoAlt: "Vista aérea del edificio con su contorno marcado en rojo",
    eyebrow: "Edificio de renta en venta", title: "Edificio\nCiudad Nueva", subtitle: "9 de Marzo c/ Mayor Bullo  ·  Ciudad Nueva, Asunción",
    figures: [[usd(PRECIO), "Precio de venta"], [pct(YB), "Rentabilidad bruta"]],
    footnote: `Datos informados con verificación documental  ·  TC Gs ${miles(TC)} (BCP, ${TC_FECHA})  ·  WEB ID 143028006-118`,
    notes: `Foto: vista aérea del edificio (sin recorte; el contorno rojo es de la fuente). ${FUENTES}`,
  });

  // 2 — Resumen
  let s = d.slide("light"); n++;
  d.eyebrow(s, "Resumen del inmueble");
  d.title(s, "Edificio de renta con 13 departamentos y un local comercial");
  d.text(s, "Activo en operación, 100% alquilado, a una cuadra de la Av. Eusebio Ayala y a pocos minutos a pie del Mercado 4, el principal polo comercial minorista del país.",
    { x: M, y: 1.85, w: 11.5, h: 0.6, fontSize: 13, color: C.grey, lineSpacingMultiple: 1.2 });
  [[usd(PRECIO), "Precio de venta"], ["6 · 6 · 1", "Dptos. de 1, 2 y 3 dormitorios + 1 local"], [gs(GS_MES), `Ingreso mensual  ·  ${usd(USD_MES)}`],
   [pct(YB), "Rentabilidad bruta sobre precio"], [pct(YN), "Rentabilidad neta final"], [pct(PROY[1].tir, 1), "TIR estimada a 5 años (escenario base)"]].forEach((f, i) => {
    const x = M + (i % 3) * 4.05, y = 2.85 + Math.floor(i / 3) * 1.6;
    d.hair(s, x, y - 0.12, 3.7);
    d.figure(s, f[0], f[1], { x, y, w: 3.8, size: 28 });
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 6.05, w: R - M, h: 0.58, fill: { color: C.white }, line: { color: C.linea, width: 0.75 } });
  d.text(s, `Ocupación: 100% alquilado  ·  Datos informados con verificación documental  ·  Tipo de cambio Gs ${miles(TC)} por USD (BCP, ${TC_FECHA})`,
    { x: M + 0.2, y: 6.05, w: R - M - 0.4, h: 0.58, fontSize: 11, valign: "middle" });
  d.footer(s, n);
  s.addNotes(`Neta final = después de IVA (5% dptos / 10% local y cocheras), vacancia 3%, administración 8%, mantenimiento 5%, gastos fijos USD 1.200 e IRE 10% estimado. ${FUENTES}`);

  // 3 — Ubicación (mapa real)
  s = d.slide("light"); n++;
  d.eyebrow(s, "Ubicación");
  d.title(s, "Una cuadra de Eusebio Ayala, cerca del Mercado 4");
  const mp = d.photo(s, IMG("mapa-ubicacion.png"), { x: M, y: 1.85, w: 6.6, h: 4.95 }, { mode: "contain", ax: 0, alt: "Mapa de ubicación del edificio (OpenStreetMap)", hyperlink: undefined });
  s.addShape(pres.ShapeType.rect, { x: mp.x, y: mp.y, w: mp.w, h: mp.h, fill: { type: "none" }, line: { color: C.linea, width: 0.75 } });
  const xr = M + mp.w + 0.45, wr = R - xr;
  [["Av. Eusebio Ayala", `${mts(D_EA)} por calle  ·  una cuadra`], ["Av. Rodríguez de Francia", `${mts(D_RF)} por calle  ·  unas tres cuadras`], ["Mercado 4", `${mts(D_M4)} por calle hasta su punto de referencia`]]
    .forEach(([k, v], i) => {
      const y = 1.95 + i * 1.02;
      d.hair(s, xr, y, wr);
      d.text(s, k.toUpperCase(), { x: xr, y: y + 0.13, w: wr, h: 0.28, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
      d.text(s, v, { x: xr, y: y + 0.43, w: wr, h: 0.5, fontSize: 13 });
    });
  d.hair(s, xr, 5.03, wr);
  d.text(s, "Dirección: 9 de Marzo c/ Mayor Bullo, barrio Ciudad Nueva, Asunción.", { x: xr, y: 5.15, w: wr, h: 0.5, fontSize: 11.5, lineSpacingMultiple: 1.15 });
  d.text(s, [{ text: "Abrir en Google Maps", options: { hyperlink: { url: MAPS }, color: C.tierra, bold: true } }], { x: xr, y: 5.72, w: wr, h: 0.3, fontSize: 11.5 });
  d.text(s, "Distancias por la red de calles, medidas desde la intersección de 9 de Marzo y Mayor Bullo. Cartografía: © OpenStreetMap contributors · Overture Maps.",
    { x: xr, y: 6.08, w: wr, h: 0.65, fontSize: 9.5, color: C.grey, lineSpacingMultiple: 1.15 });
  d.footer(s, n);
  s.addNotes(`Distancias calculadas con build_edificio_ciudad_nueva_ubicacion.py sobre Overture Maps release 2026-09-23.1 (OSM): Eusebio Ayala ${D_EA} m, Rodríguez de Francia / Próceres de Mayo ${D_RF} m, Silvio Pettirossi ${AV(/Pettirossi/).por_calle_m} m, punto 'Mercado 4 de Asuncion' ${D_M4} m. Punto de referencia: ${UBIC.punto_referencia.lat}, ${UBIC.punto_referencia.lon}. El círculo del mapa marca el punto de referencia del Mercado 4, no su perímetro.`);

  // 4 — El Mercado 4 y la zona
  s = d.slide("white"); n++;
  d.eyebrow(s, "La zona para el inversor");
  d.title(s, "Mercado 4: el corazón comercial de Asunción");
  d.text(s, [
    { text: "El Mercado Municipal N.º 4 funciona desde 1942 y es el principal polo comercial minorista del Paraguay. Concentra miles de comercios de alimentos, indumentaria, tecnología y servicios, y recibe a diario a decenas de miles de compradores de toda el área metropolitana.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "A su alrededor se formó un barrio de trabajo intenso: comerciantes, empleados y proveedores que buscan vivir cerca para evitar traslados largos. La Av. Eusebio Ayala, a una cuadra del edificio, es uno de los grandes ejes de transporte público hacia el este del área metropolitana." },
  ], { x: M, y: 1.95, w: 5.7, h: 3.6, fontSize: 13, lineSpacingMultiple: 1.3 });
  const why = [
    ["Demanda constante", "Unidades de 1 y 2 dormitorios buscadas por quienes trabajan en el comercio y los servicios de la zona."],
    ["Vacancia muy baja", "El alto tránsito y la demanda sostenida hacen que las unidades se vuelvan a alquilar rápido. El análisis usa una vacancia de solo 3%."],
    ["Valor del local", "El flujo peatonal y vehicular de la zona sostiene la demanda de locales comerciales en planta baja."],
  ];
  d.text(s, "POR QUÉ IMPORTA LA CERCANÍA", { x: 7.0, y: 1.95, w: R - 7.0, h: 0.3, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  why.forEach(([t, b], i) => {
    const y = 2.4 + i * 1.3;
    d.hair(s, 7.0, y, R - 7.0);
    d.text(s, String(i + 1).padStart(2, "0"), { x: 7.0, y: y + 0.12, w: 0.7, h: 0.45, fontFace: SERIF, fontSize: 22, color: C.tierra });
    d.text(s, t, { x: 7.7, y: y + 0.16, w: R - 7.7, h: 0.38, fontSize: 13, bold: true });
    d.text(s, b, { x: 7.7, y: y + 0.55, w: R - 7.7, h: 0.75, fontSize: 11, color: C.grey, lineSpacingMultiple: 1.15 });
  });
  d.text(s, "Fuentes: Municipalidad de Asunción (Mercado Municipal N.º 4, 84 años como principal polo comercial minorista del país); prensa local para el flujo diario de compradores.",
    { x: M, y: 6.4, w: R - M, h: 0.35, fontSize: 9.5, italic: true, color: C.grey });
  d.footer(s, n);
  s.addNotes("Reseña para inversores extranjeros. Vacancia baja: criterio del founder (zona de alto tránsito y demanda), modelada al 3%. No se citan cifras de visitantes exactas por no tener una fuente primaria verificada.");

  // 5 — Distribución
  s = d.slide("light"); n++;
  d.eyebrow(s, "Distribución de las unidades");
  d.title(s, "Cuatro niveles de departamentos más terraza");
  const tip = { "Tercer piso": "2 × 2 dorm.  ·  2 × 1 dorm.", "Segundo piso": "4 × 2 dorm.  ·  1 × 1 dorm.", "Primer piso": "1 × 1 dorm.  ·  1 × 3 dorm.", "Planta baja": "2 × 1 dorm.  ·  cochera  ·  cochera y depto." };
  const rows5 = [["Nivel", "Composición", "Gs por mes", "USD por mes"]];
  PISOS.forEach((p, i) => rows5.push([p, tip[p], gs(porPiso[i]), usd(porPiso[i] / TC)]));
  rows5.push([{ text: "Total", options: { bold: true } }, { text: "13 departamentos, local y cocheras", options: { bold: true } }, { text: gs(GS_MES), options: { bold: true } }, { text: usd(USD_MES), options: { bold: true } }]);
  d.table(s, rows5, { x: M, y: 1.95, w: 7.75, colW: [1.45, 3.1, 1.75, 1.45], rowH: 0.56, fontSize: 11 });
  s.addChart(pres.ChartType.bar, [{ name: "Alquiler mensual (miles de Gs)", labels: ["3.er piso", "2.º piso", "1.er piso", "P. baja"], values: porPiso.map((v) => v / 1e3) }], {
    x: 8.75, y: 1.85, w: R - 8.75, h: 3.6, barDir: "col", chartColors: [C.petroleo], showValue: true, dataLabelFormatCode: "#\\.##0", dataLabelFontSize: 10, dataLabelColor: C.petroleo,
    catAxisLabelFontFace: SANS, catAxisLabelFontSize: 10, catAxisLabelColor: C.grey, valAxisHidden: true, valGridLine: { style: "none" }, catAxisLineShow: false,
    showTitle: true, title: "Alquiler mensual por nivel, miles de Gs", titleFontFace: SANS, titleFontSize: 11, titleColor: C.petroleo, dataLabelFontFace: SANS,
  });
  d.text(s, "Terraza amplia en el cuarto nivel, con vistas abiertas sobre la ciudad. Composición y montos según el detalle de alquileres verificado.",
    { x: M, y: 5.6, w: R - M, h: 0.5, fontSize: 11, color: C.grey });
  d.footer(s, n);
  s.addNotes(`Montos del detalle de alquileres; USD al TC del día (Gs ${miles(TC)}, ${TC_FECHA}).`);

  // 6 — Recorrido fotográfico
  s = d.slide("dark"); n++;
  d.eyebrow(s, "Recorrido fotográfico");
  d.title(s, "Circulación común y terraza");
  [["escalera-circulacion-comun.jpg", "Escalera y circulación común", "Escalera con baranda metálica y revestimiento en las áreas comunes."],
   ["terraza.jpg", "Terraza superior", "Terraza amplia con vistas abiertas hacia el skyline de Asunción."]].forEach(([f, t, sub], i) => {
    const x = M + i * 6.15, w = 5.9, h = w * 2 / 3;
    d.photo(s, IMG(f), { x, y: 1.95, w, h }, { alt: t });
    d.text(s, t, { x, y: 1.95 + h + 0.14, w, h: 0.32, fontSize: 13, bold: true });
    d.text(s, sub, { x, y: 1.95 + h + 0.46, w, h: 0.32, fontSize: 11, transparency: 25 });
  });
  d.footer(s, n);
  s.addNotes("Fotos del edificio sin edición. La fachada y el volumen se ven en la vista aérea de la portada.");

  // 7 — Alquileres
  s = d.slide("light"); n++;
  d.eyebrow(s, "Alquileres vigentes");
  d.title(s, `Ingreso mensual: ${gs(GS_MES)}  ·  ${usd(USD_MES)}`);
  [ALQ.slice(0, 9), ALQ.slice(9)].forEach((part, i) => {
    const rows = [["Nivel", "Concepto", "Gs por mes", "USD"]].concat(part.map((r) => [r[0], r[1], gs(r[2]), usd(r[2] / TC)]));
    if (i === 1) rows.push([{ text: "Total", options: { bold: true } }, { text: "15 conceptos", options: { bold: true } }, { text: gs(GS_MES), options: { bold: true, color: C.tierra } }, { text: usd(USD_MES), options: { bold: true, color: C.tierra } }]);
    d.table(s, rows, { x: M + i * 6.15, y: 1.9, w: 5.9, colW: [1.4, 1.95, 1.45, 1.1], rowH: 0.42, fontSize: 10.5 });
  });
  d.text(s, `Montos en guaraníes según los contratos vigentes; equivalente en dólares al tipo de cambio del día: Gs ${miles(TC)} por USD (BCP, cierre interbancario del ${TC_FECHA}).`,
    { x: M + 6.15, y: 5.3, w: 5.9, h: 1.0, fontSize: 10.5, color: C.grey, lineSpacingMultiple: 1.2 });
  d.footer(s, n);
  s.addNotes(`Detalle de alquileres verificado (founder 03/10/2026). Sin datos de inquilinos. ${TC_TXT}`);

  // 8 — Ingresos y egresos
  s = d.slide("white"); n++;
  d.eyebrow(s, "Ingresos y egresos anuales");
  d.title(s, "Del ingreso bruto al resultado neto");
  const pc = (x) => pct(x / BRUTO, 1);
  const dark = (t) => ({ text: t, options: { bold: true, color: C.crema, fill: { color: C.petroleo } } });
  const bold = (t) => ({ text: t, options: { bold: true } });
  d.table(s, [["Concepto", "% del bruto", "USD por año"],
    [bold("Ingreso bruto anual"), "100%", bold(usd(BRUTO))],
    ["IVA (5% dptos. · 10% local y cocheras)", pc(IVA), `– ${usd(IVA)}`],
    ["Vacancia", pc(V), `– ${usd(V)}`],
    ["Administración", pc(AD), `– ${usd(AD)}`],
    ["Mantenimiento", pc(MA), `– ${usd(MA)}`],
    ["Gastos fijos del edificio", pc(FIJOS), `– ${usd(FIJOS)}`],
    [bold("Resultado antes de impuesto a la renta"), bold(pc(PRE)), bold(usd(PRE))],
    ["Impuesto a la renta estimado (IRE 10%)", pc(IR), `– ${usd(IR)}`],
    [dark("Resultado neto anual"), dark(pc(NETO)), dark(usd(NETO))]],
    { x: M, y: 1.9, w: 7.5, colW: [4.2, 1.45, 1.85], rowH: 0.47, fontSize: 11 });
  s.addShape(pres.ShapeType.rect, { x: 8.45, y: 1.9, w: R - 8.45, h: 4.7, fill: { color: C.crema }, line: { color: C.linea, width: 0.75 } });
  d.text(s, "CRITERIOS", { x: 8.7, y: 2.08, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  [["IVA", "5% departamentos; 10% local y cocheras."], ["Vacancia 3%", "Zona de alto tránsito y demanda: rotación rápida."],
   ["Administración 8%", "Cobranza, contratos e inquilinos."], ["Mantenimiento 5%", "Reparaciones menores y recambios entre inquilinos."],
   ["Impuesto a la renta", "10% estimado si se compra por sociedad; el contador define la base real."]].forEach(([k, v], i) => {
    const y = 2.5 + i * 0.8;
    d.text(s, k, { x: 8.7, y, w: R - 8.95, h: 0.3, fontSize: 11.5, bold: true, valign: "middle" });
    d.text(s, v, { x: 8.7, y: y + 0.3, w: R - 8.95, h: 0.45, fontSize: 10, color: C.grey, lineSpacingMultiple: 1.1 });
  });
  d.footer(s, n);
  s.addNotes(`Método del motor de Meridiano (calculadora.py): cada concepto como % del bruto. IVA efectivo ${pct(IVA_EF)}. Gastos fijos USD 1.200 de la planilla verificada. Obras mayores (impermeabilización, fachada) no incluidas en el 5% de mantenimiento: se presupuestan tras la inspección técnica. ${TC_TXT}`);

  // 9 — Rentabilidad
  s = d.slide("dark"); n++;
  d.eyebrow(s, "Rentabilidad");
  d.title(s, "Indicadores sobre el precio de venta");
  [[pct(YB), "Rentabilidad bruta", `${usd(BRUTO)} de ingreso bruto anual ÷ ${usd(PRECIO)}`],
   [pct(YN), "Rentabilidad neta final", `${usd(NETO)} de resultado neto ÷ ${usd(PRECIO)}`]].forEach((f, i) => {
    const x = M + i * 6.15;
    d.hair(s, x, 2.05, 5.6);
    d.text(s, f[0], { x, y: 2.25, w: 5.6, h: 1.1, fontFace: SERIF, fontSize: 54, color: C.lapacho });
    d.text(s, f[1], { x, y: 3.4, w: 5.6, h: 0.35, fontSize: 14, bold: true });
    d.text(s, f[2], { x, y: 3.8, w: 5.6, h: 0.35, fontSize: 12, transparency: 20 });
  });
  d.figure(s, pct(YPRE), "Neta antes de impuesto a la renta", { x: M, y: 4.6, w: 2.9, size: 26 });
  d.figure(s, `${dec(MULT)} veces`, "Precio ÷ ingreso bruto anual", { x: M + 3.0, y: 4.6, w: 2.9, size: 26 });
  d.text(s, [
    { text: "Cómo leer estas cifras. ", options: { bold: true } },
    { text: `La neta final descuenta IVA, vacancia, administración, mantenimiento, gastos fijos e impuesto a la renta estimado. El denominador es el precio de venta, sin gastos de adquisición. ${TC_TXT} Cifras de referencia, no garantizadas.` },
  ], { x: M + 6.15, y: 4.55, w: 5.95, h: 1.9, fontSize: 10.5, lineSpacingMultiple: 1.2, transparency: 5 });
  d.footer(s, n);
  s.addNotes(`Bruta ${(YB * 100).toFixed(4)}%; antes de IRE ${(YPRE * 100).toFixed(4)}%; neta final ${(YN * 100).toFixed(4)}%. Con el TC de la planilla original (Gs 6.100) la bruta era 11,31%: se reemplaza por el TC del día según la regla del founder.`);

  // 10 — Proyección de alquiler
  s = d.slide("light"); n++;
  d.eyebrow(s, "Proyección de alquiler");
  d.title(s, "Resultado neto anual proyectado a cinco años");
  s.addChart(pres.ChartType.line, PROY.map((p) => ({ name: p.n, labels: ["Año 1", "Año 2", "Año 3", "Año 4", "Año 5"], values: p.netos.map((v) => Math.round(v)) })), {
    x: M, y: 1.85, w: 7.3, h: 3.75, chartColors: [C.grey, C.petroleo, C.tierra], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 7,
    showLegend: true, legendPos: "b", legendFontFace: SANS, legendFontSize: 10, legendColor: C.petroleo,
    catAxisLabelFontFace: SANS, catAxisLabelFontSize: 10, catAxisLabelColor: C.grey, valAxisLabelFontFace: SANS, valAxisLabelFontSize: 9, valAxisLabelColor: C.grey,
    valAxisLabelFormatCode: '"USD "#\\.##0', valGridLine: { color: C.linea, style: "solid", size: 0.5 }, valAxisMinVal: 25000, catAxisLineShow: false,
  });
  d.table(s, [["Escenario", "Alquileres", "Neto año 5"]].concat(PROY.map((p) => [p.n, `+${dec(p.g * 100)}% anual`, usd(p.netos[4])])),
    { x: 8.3, y: 1.95, w: R - 8.3, colW: [1.55, 1.5, 1.38], rowH: 0.48, fontSize: 11 });
  d.text(s, [
    { text: "Margen de ajuste. ", options: { bold: true } },
    { text: `Hoy el promedio es ${gs(avg("1 dorm."))} en 1 dormitorio y ${gs(avg("2 dorm."))} en 2 dormitorios. Los avisos publicados en Ciudad Nueva van de Gs 2,5 a 3,0 millones (1 dorm.) y de Gs 2,1 a 4,2 millones (2 dorm.): hay espacio para ajustar en cada renovación, según el estado de cada unidad.` },
  ], { x: 8.3, y: 4.05, w: R - 8.3, h: 2.3, fontSize: 10.5, lineSpacingMultiple: 1.2 });
  d.text(s, "Proyección ilustrativa en USD al tipo de cambio del día constante; no garantizada.", { x: M, y: 6.3, w: 7.3, h: 0.35, fontSize: 9.5, italic: true, color: C.grey });
  d.footer(s, n);
  s.addNotes(`Crecimiento de alquileres en Gs: conservador 3% (bajo la inflación; IPC usado para el ajuste fiscal 2026: 4,1%), base 5%, optimista 8% (convergencia hacia avisos). Avisos: InfoCasas, consulta 03/10/2026, categoría C (avisos, no contratos; incluyen unidades más nuevas). Netos: ${PROY.map((p) => `${p.n} ${p.netos.map((v) => Math.round(v)).join("/")}`).join("; ")}.`);

  // 11 — Plusvalía y retorno total
  s = d.slide("white"); n++;
  d.eyebrow(s, "Plusvalía y retorno total");
  d.title(s, "Escenarios a cinco años");
  const cell = (t, b) => (b ? bold(t) : t);
  d.table(s, [["Concepto", ...PROY.map((p) => p.n)],
    ["Valorización anual supuesta", ...PROY.map((p) => `${dec(p.a * 100)}%`)],
    ["Valor estimado al año 5", ...PROY.map((p) => usd(p.V5))],
    ["Plusvalía estimada", ...PROY.map((p) => usd(p.plus))],
    ["IVA de la venta futura (1,5%)", ...PROY.map((p) => `– ${usd(p.ivaV)}`)],
    ["Renta neta acumulada 5 años", ...PROY.map((p) => usd(p.rentaAc))],
    [bold("Ganancia total estimada"), ...PROY.map((p) => cell(usd(p.total), true))],
    [dark("TIR estimada a 5 años"), ...PROY.map((p) => dark(pct(p.tir, 1)))]],
    { x: M, y: 1.9, w: 8.2, colW: [3.2, 1.65, 1.65, 1.7], rowH: 0.5, fontSize: 11.5 });
  s.addShape(pres.ShapeType.rect, { x: 9.2, y: 1.9, w: R - 9.2, h: 4.0, fill: { color: C.petroleo }, line: { color: C.petroleo, width: 0 } });
  s._mcDark = true;
  d.figure(s, pct(PROY[1].tir, 1), "TIR estimada, escenario base", { x: 9.5, y: 2.2, w: 3.1, size: 40 });
  d.text(s, `Compra a ${usd(PRECIO)}, cinco años de renta neta creciente y venta al valor estimado del año 5.`, { x: 9.5, y: 3.6, w: 3.1, h: 1.2, fontSize: 11.5, lineSpacingMultiple: 1.2 });
  s._mcDark = false;
  d.text(s, "Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición ni comisión de venta. El valor futuro depende del mercado, del estado del edificio y de su ocupación al vender.",
    { x: M, y: 6.05, w: R - M, h: 0.6, fontSize: 9.5, italic: true, color: C.grey, lineSpacingMultiple: 1.15 });
  d.footer(s, n);
  s.addNotes(`Valorización anual en USD: 2% / 3,5% / 5%. IVA de venta 1,5% efectivo (D-082/D-083). TIR con flujos: -precio en año 0, renta neta años 1-5 y venta neta de IVA en año 5. Ganancia total = plusvalía − IVA de venta + renta neta acumulada.`);

  // 12 — Precio y condiciones
  s = d.slide("light"); n++;
  d.eyebrow(s, "Precio y condiciones");
  d.title(s, "Venta del edificio completo");
  s.addShape(pres.ShapeType.rect, { x: M, y: 1.95, w: 5.2, h: 4.6, fill: { color: C.petroleo }, line: { color: C.petroleo, width: 0 } });
  s._mcDark = true;
  d.figure(s, usd(PRECIO), "Precio de venta", { x: M + 0.4, y: 2.35, w: 4.5, size: 44 });
  d.hair(s, M + 0.4, 3.75, 4.4, C.navy_tint);
  d.text(s, "Referencia WEB ID 143028006-118", { x: M + 0.4, y: 3.95, w: 4.4, h: 0.3, fontSize: 12 });
  d.text(s, "Precio en dólares estadounidenses. Alquileres cobrados en guaraníes.", { x: M + 0.4, y: 4.4, w: 4.4, h: 0.8, fontSize: 12, transparency: 15, lineSpacingMultiple: 1.2 });
  d.hair(s, M + 0.4, 5.55, 4.4, C.navy_tint);
  d.text(s, `${pct(YB)} bruta  ·  ${pct(YN)} neta final  ·  ${usd(NETO / 12)} netos por mes`, { x: M + 0.4, y: 5.7, w: 4.4, h: 0.6, fontSize: 11, color: C.lapacho, lineSpacingMultiple: 1.2 });
  s._mcDark = false;
  [["Activo", "Edificio de renta: 13 departamentos y 1 local comercial, más terraza."], ["Ocupación", "100% alquilado. Datos informados con verificación documental."],
   ["Ingreso", `${gs(GS_MES)} por mes  ·  ${usd(BRUTO)} por año al tipo de cambio del día.`],
   ["Forma de pago y entrega", "A acordar en la negociación y el boleto de compraventa."]].forEach(([k, v], i) => block(s, 6.3, 1.95 + i * 1.15, R - 6.3, k, v, { fontSize: 13 }));
  d.footer(s, n);
  s.addNotes(`${TC_TXT} Forma de pago y plazos: a acordar.`);

  // 13 — Proceso de compra
  s = d.slide("white"); n++;
  d.eyebrow(s, "Proceso de compra");
  d.title(s, "Cómo avanzamos, paso a paso");
  [["Visita al edificio", "Recorrido de las unidades, el local y la terraza, con inspección técnica de estructura, instalaciones e impermeabilización."],
   ["Oferta y reserva", "Propuesta de precio y forma de pago; reserva con documentación de respaldo."],
   ["Revisión notarial", "Título, informe de condiciones de dominio e impuesto inmobiliario al día, a cargo del escribano."],
   ["Estructura y fiscal", "Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador."],
   ["Boleto y escritura", "Firma del boleto de compraventa y escritura pública ante el escribano."],
   ["Administración", "Traspaso de los contratos vigentes y administración del edificio, si el inversor lo desea."]].forEach(([t, b], i) => {
    const x = M + (i % 3) * 4.05, y = 1.95 + Math.floor(i / 3) * 2.05;
    d.hair(s, x, y, 3.75);
    d.text(s, String(i + 1).padStart(2, "0"), { x, y: y + 0.12, w: 0.8, h: 0.5, fontFace: SERIF, fontSize: 24, color: C.tierra });
    d.text(s, t, { x: x + 0.75, y: y + 0.18, w: 3.0, h: 0.42, fontSize: 13, bold: true });
    d.text(s, b, { x, y: y + 0.7, w: 3.75, h: 1.2, fontSize: 11, color: C.grey, lineSpacingMultiple: 1.2 });
  });
  d.text(s, "Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.",
    { x: M, y: 6.05, w: R - M, h: 0.6, fontSize: 10.5, italic: true, color: C.grey, lineSpacingMultiple: 1.15 });
  d.footer(s, n);
  s.addNotes("Proceso de acompañamiento de Meridiano (captar → estructurar → invertir → administrar). No se afirman situación registral ni estado estructural: se verifican en los pasos 1 y 3.");

  // 14 — Riesgos
  s = d.slide("light"); n++;
  d.eyebrow(s, "Consideraciones");
  d.title(s, "Riesgos a evaluar en un edificio de renta");
  [["Rotación de inquilinos", "La vacancia de la zona es baja, pero no es cero: hay renovaciones, renegociaciones y meses de recambio."],
   ["Tipo de cambio", "Los alquileres se cobran en guaraníes y el precio está en dólares: la rentabilidad en USD varía con la cotización."],
   ["Costos de operación", "Un edificio de 13 unidades requiere mantenimiento continuo; obras mayores se presupuestan aparte."],
   ["Impuestos", "El impuesto a la renta depende de la estructura de compra y lo determina el contador."],
   ["Valor de reventa", "La plusvalía presentada son escenarios: el valor futuro depende del mercado y del estado del activo."]].forEach(([t, b], i) => {
    const y = 1.95 + i * 0.84;
    d.hair(s, M, y, R - M);
    d.text(s, t, { x: M, y: y + 0.18, w: 3.6, h: 0.55, fontSize: 13, bold: true });
    d.text(s, b, { x: 4.4, y: y + 0.18, w: R - 4.4, h: 0.6, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.15 });
  });
  d.text(s, "Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.", { x: M, y: 6.3, w: R - M, h: 0.35, fontSize: 10.5, italic: true, color: C.grey });
  d.footer(s, n);
  s.addNotes("Riesgos generales del tipo de operación.");

  // 15 — Cierre con retrato (D-099)
  d.closing({
    headline: "Coordinemos su visita al edificio",
    lead: "Le presentamos los contratos, el detalle de ingresos y la documentación del inmueble, y lo acompañamos en cada paso de la compra.",
    signaturePreset: "U_brief_founder",
    contact: { name: "Lic. Juan José Castillo" },
    photo: RETRATO, photoAlt: "Juan José Castillo",
    disclaimer: "Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. No constituye una garantía de rentabilidad.  ·  WEB ID 143028006-118",
    notes: "Retrato aprobado de Juan José Castillo (D-099: siempre en el cierre). Firma según el pedido del founder. Contacto: 09-cierres-y-firmas.md.",
  });

  const out = await d.save(OUT);
  console.log(out);
  console.log(JSON.stringify({ GS_MES, USD_MES, BRUTO, IVA, V, AD, MA, PRE, IR, NETO, YB, YPRE, YN, MULT, tir: PROY.map((p) => p.tir), netos5: PROY.map((p) => p.netos[4]), V5: PROY.map((p) => p.V5) }));
})();
