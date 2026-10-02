// Edificio Ciudad Nueva — presentación para inversores (venta de edificio de renta).
// Kit: skill meridiano-property-presentation-adapter (scripts/meridiano_deck_kit.js).
// Fuentes: pedido del founder del 2026-10-02 + 5 imágenes adjuntas (3 fotos del edificio,
// detalle de alquileres y planilla de rentabilidad). Cifras = Excel
// projects/edificio-ciudad-nueva/entregables/Edificio_Ciudad_Nueva_Alquileres_Rentabilidad.xlsx.
// Uso: node build_edificio_ciudad_nueva_presentacion.js [salida.pptx]
"use strict";
const path = require("path");
const KIT = process.env.MC_DECK_KIT ||
  "/root/.claude/skills/synced/03a6d187-4698-465a-8a04-848dbd055d31_cb762160-afd7-4e8c-b3e7-0ea718715011/meridiano-property-presentation-adapter/scripts/meridiano_deck_kit.js";
const K = require(KIT);

const ROOT = path.resolve(__dirname, "../..");
const IMG = (f) => path.join(__dirname, "assets-edificio-ciudad-nueva", f);
const OUT = process.argv[2] || path.join(ROOT, "projects/edificio-ciudad-nueva/entregables/Edificio_Ciudad_Nueva_Meridiano_FINAL.pptx");

// ---- datos (rank 1: pedido del founder e imágenes recibidas) ----
const PRECIO = 340000, TC = 6100, IMP = 2764, GASTOS = 1200;
const ALQ = [
  ["Tercer piso", "2 dorm.", 1500000], ["Tercer piso", "2 dorm.", 1500000], ["Tercer piso", "1 dorm.", 1200000], ["Tercer piso", "1 dorm.", 1100000],
  ["Segundo piso", "2 dorm.", 1600000], ["Segundo piso", "2 dorm.", 1500000], ["Segundo piso", "2 dorm.", 1500000], ["Segundo piso", "2 dorm.", 1500000], ["Segundo piso", "1 dorm.", 1250000],
  ["Primer piso", "1 dorm.", 1300000], ["Primer piso", "3 dorm.", 1600000],
  ["Planta baja", "1 dorm.", 1200000], ["Planta baja", "1 dorm.", 900000], ["Planta baja", "Cochera", 700000], ["Planta baja", "Cochera y departamento", 1200000],
];
const GS_MES = ALQ.reduce((a, r) => a + r[2], 0);
if (GS_MES !== 19550000) throw new Error(`La suma del detalle (${GS_MES}) no coincide con el total indicado (19.550.000)`);
const USD_MES = GS_MES / TC, BRUTO = USD_MES * 12, NETO = BRUTO - IMP - GASTOS;
const YB = BRUTO / PRECIO, YN = NETO / PRECIO, MULT = PRECIO / BRUTO;
const PISOS = ["Tercer piso", "Segundo piso", "Primer piso", "Planta baja"];
const porPiso = PISOS.map((p) => ALQ.filter((r) => r[0] === p).reduce((a, r) => a + r[2], 0));

// ---- formatos es-PY ----
const miles = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const gs = (n) => `Gs ${miles(n)}`;
const usd = (n) => `USD ${miles(n)}`;
const pct = (x) => (x * 100).toFixed(2).replace(".", ",") + "%";

const MAPS = "https://www.google.com/maps/search/?api=1&query=9+de+Marzo+y+Mayor+Bullo%2C+Asunci%C3%B3n%2C+Paraguay";
const FUENTES = "Fuentes: descripción comercial, detalle de alquileres y planilla de rentabilidad recibidos el 2/10/2026 (WEB ID 143028006-118).";

(async () => {
  // Firma pedida por el founder en el brief (rank 1): título "Broker Inmobiliario | Meridiano Capital".
  K.TOKENS.signature_presets.U_brief_founder = { decision: "Pedido del founder 2026-10-02", title: "Broker Inmobiliario  |  Meridiano Capital", brand_above: false, institutional_footer: null };

  const d = K.createDeck({ title: "Edificio Ciudad Nueva — Edificio de renta en venta", subject: "Presentación para inversores · versión preliminar",
    footerLabel: "Meridiano Capital  ·  Edificio Ciudad Nueva  ·  Venta  ·  Versión preliminar" });
  const { C, M, R, W, SANS, SERIF } = d;
  const pres = d.pres;
  let n = 1;

  // 1 — Portada
  let s = d.cover({
    photo: IMG("vista-aerea-edificio.jpg"), photoMode: "panel",
    photoAlt: "Vista aérea del edificio con su contorno marcado en rojo (marca de la fuente)",
    eyebrow: "Edificio de renta en venta", title: "Edificio\nCiudad Nueva",
    subtitle: "9 de Marzo c/ Mayor Bullo  ·  Ciudad Nueva, Asunción",
    figures: [[usd(PRECIO), "Precio de venta"], ["13 + 1", "Departamentos + local comercial"]],
    footnote: "Versión preliminar  ·  Datos informados, sin verificación documental  ·  WEB ID 143028006-118",
    notes: `Foto: vista aérea recibida (5.jpg), sin recorte (modo panel). El contorno rojo viene de la fuente. Precio, dirección, composición y WEB ID: pedido del founder 2/10/2026. ${FUENTES}`,
  });

  // 2 — Resumen del inmueble
  s = d.slide("light"); n++;
  d.eyebrow(s, "Resumen del inmueble");
  d.title(s, "Edificio de renta con 13 departamentos y un local comercial");
  d.text(s, "Composición y ocupación según la información recibida del propietario. Las cifras de ingreso surgen del detalle de alquileres y de la planilla de rentabilidad entregados con la oferta.",
    { x: M, y: 1.85, w: 11.5, h: 0.6, fontSize: 13, color: C.grey, lineSpacingMultiple: 1.2 });
  const fig2 = [
    [usd(PRECIO), "Precio de venta"], ["6 · 6 · 1", "Dptos. de 1, 2 y 3 dormitorios"], ["1", "Local comercial"],
    [gs(GS_MES), "Ingreso mensual informado"], [pct(YB), "Rentabilidad bruta sobre precio"], [pct(YN), "Neta según gastos informados"],
  ];
  fig2.forEach((f, i) => {
    const x = M + (i % 3) * 4.05, y = 2.85 + Math.floor(i / 3) * 1.6;
    d.hair(s, x, y - 0.12, 3.7);
    d.figure(s, f[0], f[1], { x, y, w: 3.8, size: 28 });
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 6.05, w: R - M, h: 0.58, fill: { color: C.white }, line: { color: C.linea, width: 0.75 } });
  d.text(s, "Ocupación informada: todas las unidades y el local, alquilados. Ocupación verificada documentalmente: pendiente (contratos y cobros a revisar).",
    { x: M + 0.2, y: 6.05, w: R - M - 0.4, h: 0.58, fontSize: 11, valign: "middle" });
  d.footer(s, n);
  s.addNotes(`Mix y ocupación: descripción comercial. Ingreso: suma verificada del detalle (Gs 19.550.000). Rentabilidades recalculadas: bruta ${(YB * 100).toFixed(4)}%, neta según gastos informados ${(YN * 100).toFixed(4)}% sobre el precio. ${FUENTES}`);

  // 3 — Ubicación y entorno
  s = d.slide("light"); n++;
  d.eyebrow(s, "Ubicación y entorno");
  d.title(s, "Ciudad Nueva, en el entorno comercial del Mercado 4");
  const loc = [
    ["Dirección informada", "9 de Marzo c/ Mayor Bullo, barrio Ciudad Nueva, Asunción."],
    ["Entorno comercial", "Próximo al Mercado 4, según la descripción recibida."],
    ["Conectividad", "Aproximadamente a una cuadra de la Av. Eusebio Ayala, según la descripción recibida."],
    ["Terraza", "Terraza amplia en el cuarto nivel, con vistas abiertas sobre la ciudad."],
  ];
  loc.forEach(([k, v], i) => {
    const y = 2.0 + i * 1.08;
    d.hair(s, M, y, 6.6);
    d.text(s, k.toUpperCase(), { x: M, y: y + 0.14, w: 6.6, h: 0.28, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
    d.text(s, v, { x: M, y: y + 0.44, w: 6.6, h: 0.55, fontSize: 13.5, lineSpacingMultiple: 1.15 });
  });
  // Panel de mapa: enlace funcional + QR a la intersección (sin teselas cartográficas, ver control interno).
  s.addShape(pres.ShapeType.rect, { x: 7.75, y: 2.0, w: R - 7.75, h: 4.55, fill: { color: C.white }, line: { color: C.linea, width: 0.75 } });
  d.text(s, "UBICAR LA INTERSECCIÓN", { x: 8.05, y: 2.25, w: 4.4, h: 0.3, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  d.photo(s, IMG("qr-google-maps-interseccion.png"), { x: 8.05, y: 2.7, w: 2.1, h: 2.1 }, { mode: "contain", alt: "Código QR a Google Maps: 9 de Marzo y Mayor Bullo, Asunción" });
  d.text(s, "Escanear o hacer clic para abrir Google Maps en 9 de Marzo y Mayor Bullo.", { x: 10.35, y: 2.75, w: 2.3, h: 1.5, fontSize: 11, color: C.grey, lineSpacingMultiple: 1.2 });
  d.text(s, [{ text: "Abrir en Google Maps", options: { hyperlink: { url: MAPS }, color: C.tierra, bold: true } }], { x: 8.05, y: 5.05, w: 4.4, h: 0.3, fontSize: 12 });
  d.text(s, "La marca corresponde a la intersección informada, como referencia. La parcela exacta y las distancias al entorno se confirman en la visita.",
    { x: 8.05, y: 5.45, w: 4.4, h: 0.9, fontSize: 10, color: C.grey, lineSpacingMultiple: 1.2 });
  d.footer(s, n);
  s.addNotes(`Dirección, Mercado 4, 'una cuadra de Eusebio Ayala' y terraza en el cuarto piso: datos recibidos, no verificados en campo. No se incluyen distancias ni tiempos de traslado. Mapa: enlace + QR a búsqueda de la intersección en Google Maps (${MAPS}). No fue posible incrustar un mapa cartográfico: la red del entorno de producción bloqueó los servidores de mapas (ver control interno).`);

  // 4 — Distribución por piso y tipología
  s = d.slide("white"); n++;
  d.eyebrow(s, "Distribución de las unidades");
  d.title(s, "Cuatro niveles de departamentos más terraza");
  const tip = { "Tercer piso": "2 × 2 dorm.  ·  2 × 1 dorm.", "Segundo piso": "4 × 2 dorm.  ·  1 × 1 dorm.", "Primer piso": "1 × 1 dorm.  ·  1 × 3 dorm.",
    "Planta baja": "2 × 1 dorm.  ·  cochera  ·  cochera y departamento" };
  const rows4 = [["Nivel", "Composición según el detalle de alquileres", "Alquiler mensual"]];
  PISOS.forEach((p, i) => rows4.push([p, tip[p], gs(porPiso[i])]));
  rows4.push([{ text: "Total", options: { bold: true } }, { text: "15 conceptos del detalle", options: { bold: true } }, { text: gs(GS_MES), options: { bold: true } }]);
  d.table(s, rows4, { x: M, y: 1.95, w: 7.6, colW: [1.55, 4.1, 1.95], rowH: 0.52, fontSize: 11.5 });
  s.addChart(pres.ChartType.bar, [{ name: "Alquiler mensual (miles de Gs)", labels: ["3.er piso", "2.º piso", "1.er piso", "P. baja"], values: porPiso.map((v) => v / 1e3) }], {
    x: 8.55, y: 1.85, w: R - 8.55, h: 3.35, barDir: "col", chartColors: [C.petroleo], showValue: true, dataLabelFormatCode: "#\\.##0", dataLabelFontSize: 10, dataLabelColor: C.petroleo,
    catAxisLabelFontFace: SANS, catAxisLabelFontSize: 10, catAxisLabelColor: C.grey, valAxisHidden: true, valGridLine: { style: "none" }, catAxisLineShow: false,
    showTitle: true, title: "Alquiler mensual por nivel, miles de Gs", titleFontFace: SANS, titleFontSize: 11, titleColor: C.petroleo, dataLabelFontFace: SANS,
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 5.35, w: R - M, h: 1.25, fill: { color: C.fila }, line: { color: C.linea, width: 0.75 } });
  d.text(s, [
    { text: "Para conciliar antes de la compra. ", options: { bold: true } },
    { text: "Las 13 filas de departamentos coinciden con el mix informado (6 de 1, 6 de 2 y 1 de 3 dormitorios). El detalle agrega una cochera y una fila “cochera y departamento”, y no identifica por separado el local comercial. Se presenta el total como ingreso informado, sin dar por conciliada su composición." },
  ], { x: M + 0.2, y: 5.35, w: R - M - 0.4, h: 1.25, fontSize: 11, valign: "middle", lineSpacingMultiple: 1.2 });
  d.footer(s, n);
  s.addNotes("Composición por nivel transcrita del detalle de alquileres, en su orden original. 'Cochera y departamento' NO se interpreta como local ni como unidad adicional (pendiente). Gráfico nativo editable con los subtotales por nivel.");

  // 5 — Recorrido fotográfico
  s = d.slide("dark"); n++;
  d.eyebrow(s, "Recorrido fotográfico");
  d.title(s, "Circulación común y terraza");
  const ph = [["escalera-circulacion-comun.jpg", "Escalera y circulación común", "Escalera con baranda metálica y revestimiento en las áreas comunes."],
    ["terraza.jpg", "Terraza superior", "Terraza amplia con vistas abiertas hacia el skyline de Asunción."]];
  ph.forEach(([f, t, sub], i) => {
    const x = M + i * 6.15, w = 5.9, h = w * 2 / 3;
    d.photo(s, IMG(f), { x, y: 1.95, w, h }, { alt: t });
    d.text(s, t, { x, y: 1.95 + h + 0.14, w, h: 0.32, fontSize: 13, bold: true });
    d.text(s, sub, { x, y: 1.95 + h + 0.46, w, h: 0.32, fontSize: 11, transparency: 25 });
  });
  d.footer(s, n);
  s.addNotes("Fotos recibidas, sin edición ni recorte (proporción 3:2 en marco 3:2). No se atribuyen a un piso o unidad. La fachada se muestra en la vista aérea de la portada. No se recibieron fotos de interiores de las unidades ni del local comercial.");

  // 6 — Alquileres informados
  s = d.slide("light"); n++;
  d.eyebrow(s, "Alquileres informados");
  d.title(s, `Ingreso mensual informado: ${gs(GS_MES)}`);
  const half = [ALQ.slice(0, 9), ALQ.slice(9)];
  half.forEach((part, i) => {
    const rows = [["Nivel", "Concepto", "Mensual"]].concat(part.map((r) => [r[0], r[1], gs(r[2])]));
    if (i === 1) rows.push([{ text: "Total", options: { bold: true } }, { text: "15 conceptos", options: { bold: true } }, { text: gs(GS_MES), options: { bold: true, color: C.tierra } }]);
    d.table(s, rows, { x: M + i * 6.15, y: 1.9, w: 5.9, colW: [1.7, 2.35, 1.85], rowH: 0.42, fontSize: 11 });
  });
  d.text(s, `Montos mensuales en guaraníes, transcritos del detalle recibido. Equivalente de referencia: ${usd(USD_MES)} por mes al tipo de cambio de la planilla (Gs ${miles(TC)} por USD, fecha no informada; no es la cotización actual).`,
    { x: M + 6.15, y: 5.3, w: 5.9, h: 1.1, fontSize: 10.5, color: C.grey, lineSpacingMultiple: 1.2 });
  d.footer(s, n);
  s.addNotes(`Transcripción literal del detalle (texto 'Cochera y dpto' desarrollado como 'Cochera y departamento'). Suma recalculada = ${gs(GS_MES)} = total indicado. Sin datos de inquilinos. Estado: transcrito, sin contratos ni comprobantes de cobro.`);

  // 7 — Ingresos, egresos y resultado
  s = d.slide("white"); n++;
  d.eyebrow(s, "Ingresos y egresos informados");
  d.title(s, "Del ingreso bruto al resultado según la planilla");
  const rows7 = [["Concepto", "Base", "USD por año"],
    ["Ingreso mensual", `${gs(GS_MES)} ÷ ${miles(TC)}`, `${usd(USD_MES)} / mes`],
    [{ text: "Ingreso bruto anual", options: { bold: true } }, "Ingreso mensual × 12", { text: usd(BRUTO), options: { bold: true } }],
    ["Impuesto anual informado", "Planilla recibida", `– ${usd(IMP)}`],
    ["Gastos anuales informados", "Planilla recibida", `– ${usd(GASTOS)}`],
    [{ text: "Resultado neto según gastos informados", options: { bold: true, color: C.crema, fill: { color: C.petroleo } } }, { text: "Bruto – egresos informados", options: { color: C.crema, fill: { color: C.petroleo } } }, { text: usd(NETO), options: { bold: true, color: C.crema, fill: { color: C.petroleo } } }]];
  d.table(s, rows7, { x: M, y: 1.95, w: 7.4, colW: [3.55, 2.15, 1.7], rowH: 0.56, fontSize: 11 });
  s.addShape(pres.ShapeType.rect, { x: 8.3, y: 1.95, w: R - 8.3, h: 4.6, fill: { color: C.crema }, line: { color: C.linea, width: 0.75 } });
  d.text(s, "NO INCLUIDOS EN LA PLANILLA", { x: 8.55, y: 2.15, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
  ["Mantenimiento y reparaciones", "Administración", "Seguros", "Vacancia entre inquilinos", "Morosidad", "Reservas para reposiciones"].forEach((t, i) => {
    d.text(s, t, { x: 8.55, y: 2.6 + i * 0.37, w: 4, h: 0.32, fontSize: 12, valign: "middle" });
    if (i < 5) d.hair(s, 8.55, 2.6 + i * 0.37 + 0.355, 4.0);
  });
  d.text(s, "Estos egresos no fueron informados: no se asumen en cero. El alcance de los USD 2.764 de impuesto y de los USD 1.200 de gastos está pendiente de confirmación.",
    { x: 8.55, y: 4.95, w: 4.0, h: 1.4, fontSize: 10.5, color: C.grey, lineSpacingMultiple: 1.2 });
  d.footer(s, n);
  s.addNotes(`Recálculo con precisión completa: mensual ${USD_MES.toFixed(4)} USD; bruto ${BRUTO.toFixed(4)} USD; neto ${NETO.toFixed(4)} USD. El impuesto equivale al ${(IMP / BRUTO * 100).toFixed(2)}% del bruto (no coincide con 5% ni 10%): composición a confirmar. El ingreso supone 12 meses de cobro completo.`);

  // 8 — Rentabilidad
  s = d.slide("dark"); n++;
  d.eyebrow(s, "Rentabilidad según la planilla");
  d.title(s, "Indicadores sobre el precio de venta");
  [[pct(YB), "Rentabilidad bruta sobre precio", `${usd(BRUTO)} de ingreso bruto anual ÷ ${usd(PRECIO)}`],
   [pct(YN), "Neta según gastos informados, sobre precio", `${usd(NETO)} de resultado neto ÷ ${usd(PRECIO)}`]].forEach((f, i) => {
    const x = M + i * 6.15;
    d.hair(s, x, 2.05, 5.6);
    d.text(s, f[0], { x, y: 2.25, w: 5.6, h: 1.1, fontFace: SERIF, fontSize: 54, color: C.lapacho });
    d.text(s, f[1], { x, y: 3.4, w: 5.6, h: 0.35, fontSize: 14, bold: true });
    d.text(s, f[2], { x, y: 3.8, w: 5.6, h: 0.35, fontSize: 12, transparency: 20 });
  });
  d.figure(s, `${MULT.toFixed(1).replace(".", ",")} veces`, "Precio ÷ ingreso bruto anual informado", { x: M, y: 4.55, w: 5.6, size: 26 });
  d.text(s, [
    { text: "Cómo leer estas cifras. ", options: { bold: true } },
    { text: `El denominador es solo el precio de venta: no incluye gastos de adquisición. El neto descuenta únicamente impuesto y gastos informados. Tipo de cambio de la planilla: Gs ${miles(TC)} por USD. Los USD 34.500 y el 10,15% de la descripción del aviso corresponden al resultado neto según gastos informados, no al ingreso bruto ni a la rentabilidad bruta.` },
  ], { x: M + 6.15, y: 4.5, w: 5.95, h: 1.95, fontSize: 10.5, lineSpacingMultiple: 1.2, transparency: 5 });
  d.footer(s, n);
  s.addNotes(`Planilla recibida: bruta 11,3% y neta 10,15%. Recalculado: bruta ${(YB * 100).toFixed(4)}%, neta según gastos informados ${(YN * 100).toFixed(4)}%. No es rentabilidad neta definitiva ni retorno sobre inversión total. No garantizada.`);

  // 9 — Precio y condiciones conocidas
  s = d.slide("light"); n++;
  d.eyebrow(s, "Precio y condiciones conocidas");
  d.title(s, "Venta del edificio completo");
  s.addShape(pres.ShapeType.rect, { x: M, y: 1.95, w: 5.2, h: 4.6, fill: { color: C.petroleo }, line: { color: C.petroleo, width: 0 } });
  s._mcDark = true;
  d.figure(s, usd(PRECIO), "Precio de venta", { x: M + 0.4, y: 2.35, w: 4.5, size: 44 });
  d.hair(s, M + 0.4, 3.75, 4.4, C.navy_tint);
  d.text(s, "Referencia WEB ID 143028006-118", { x: M + 0.4, y: 3.95, w: 4.4, h: 0.3, fontSize: 12 });
  d.text(s, "Moneda de la oferta: dólares estadounidenses. Alquileres cobrados en guaraníes.", { x: M + 0.4, y: 4.4, w: 4.4, h: 0.8, fontSize: 12, transparency: 15, lineSpacingMultiple: 1.2 });
  d.hair(s, M + 0.4, 5.55, 4.4, C.navy_tint);
  d.text(s, `${pct(YB)} bruta  ·  ${pct(YN)} neta según gastos informados (sobre precio)`, { x: M + 0.4, y: 5.7, w: 4.4, h: 0.6, fontSize: 11, color: C.lapacho, lineSpacingMultiple: 1.2 });
  s._mcDark = false;
  [["Activo", "Edificio de renta: 13 departamentos y 1 local comercial, más terraza."],
   ["Ocupación", "Informada: 100% alquilado. Verificación documental pendiente."],
   ["Ingreso informado", `${gs(GS_MES)} por mes (${usd(BRUTO)} por año al TC de la planilla).`],
   ["Forma de pago y entrega", "No informadas en la oferta: a definir en la negociación y el boleto de compraventa."]].forEach(([k, v], i) => {
    const y = 1.95 + i * 1.15;
    d.hair(s, 6.3, y, R - 6.3);
    d.text(s, k.toUpperCase(), { x: 6.3, y: y + 0.14, w: R - 6.3, h: 0.28, fontSize: 10, bold: true, color: C.gold_d, charSpacing: 2 });
    d.text(s, v, { x: 6.3, y: y + 0.44, w: R - 6.3, h: 0.6, fontSize: 13, lineSpacingMultiple: 1.15 });
  });
  d.footer(s, n);
  s.addNotes("Precio y WEB ID: pedido del founder. Forma de pago, plazos, situación de los contratos ante la venta y gastos de transferencia: no informados.");

  // 10 — Información que debe revisar el inversor
  s = d.slide("white"); n++;
  d.eyebrow(s, "Revisión antes de decidir");
  d.title(s, "Información que debe revisar el inversor");
  const chk = [
    ["Contratos de locación", "Contratos vigentes de cada unidad, el local y las cocheras: plazos, montos, moneda, ajustes y vencimientos."],
    ["Ingresos cobrados", "Extractos o recibos de los últimos 12 meses y ocupación real, para pasar de ingreso informado a ingreso verificado."],
    ["Conciliación de unidades", "A qué unidad corresponde “cochera y departamento”, dónde se incluye el local y si algún concepto agrupa o duplica ingresos."],
    ["Impuestos y gastos", "Qué cubren los USD 2.764 y los USD 1.200, y los egresos no informados: mantenimiento, administración, seguros, reservas."],
    ["Documentación del inmueble", "Título, informe de condiciones de dominio, planos aprobados, superficies e impuesto inmobiliario al día."],
    ["Estado técnico", "Inspección de estructura, instalaciones e impermeabilización de la terraza antes de fijar la oferta."],
  ];
  chk.forEach(([t, b], i) => {
    const x = M + (i % 3) * 4.05, y = 1.95 + Math.floor(i / 3) * 2.05;
    d.hair(s, x, y, 3.75);
    d.text(s, String(i + 1).padStart(2, "0"), { x, y: y + 0.12, w: 0.8, h: 0.5, fontFace: SERIF, fontSize: 24, color: C.tierra });
    d.text(s, t, { x: x + 0.75, y: y + 0.18, w: 3.0, h: 0.42, fontSize: 13, bold: true });
    d.text(s, b, { x, y: y + 0.7, w: 3.75, h: 1.2, fontSize: 11, color: C.grey, lineSpacingMultiple: 1.2 });
  });
  d.text(s, "La revisión legal, notarial, contable e impositiva corresponde al abogado, escribano y contador; Meridiano Capital coordina y acompaña el proceso.",
    { x: M, y: 6.2, w: R - M, h: 0.45, fontSize: 10.5, italic: true, color: C.grey });
  d.footer(s, n);
  s.addNotes("Checklist de due diligence derivado de los vacíos de la auditoría (ver control interno). No se afirma la situación registral ni el estado estructural: no fueron informados.");

  // 11 — Consideraciones de riesgo
  s = d.slide("light"); n++;
  d.eyebrow(s, "Consideraciones");
  d.title(s, "Riesgos a evaluar en un edificio de renta");
  const rk = [
    ["Continuidad de la renta", "Los alquileres actuales no garantizan su continuidad: hay rotación, renegociación y meses de vacancia."],
    ["Cobro efectivo", "El ingreso presentado es el informado; la morosidad y el cobro real deben verificarse con comprobantes."],
    ["Tipo de cambio", "Los alquileres se cobran en guaraníes y el precio está en dólares: la rentabilidad en USD varía con la cotización."],
    ["Costos de operación", "Mantenimiento, administración y reposiciones de un edificio de 13 unidades reducen el resultado neto."],
    ["Valor de reventa", "No se presenta una proyección de plusvalía: el valor futuro depende del mercado y del estado del activo."],
  ];
  rk.forEach(([t, b], i) => {
    const y = 1.95 + i * 0.84;
    d.hair(s, M, y, R - M);
    d.text(s, t, { x: M, y: y + 0.18, w: 3.6, h: 0.55, fontSize: 13, bold: true });
    d.text(s, b, { x: 4.4, y: y + 0.18, w: R - 4.4, h: 0.6, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.15 });
  });
  d.text(s, "Cifras informadas por la parte vendedora, no garantizadas. Se recomienda evaluar la operación con asesoría propia.", { x: M, y: 6.3, w: R - M, h: 0.35, fontSize: 10.5, italic: true, color: C.grey });
  d.footer(s, n);
  s.addNotes("Riesgos generales del tipo de operación (narrative_patterns: diapositiva de riesgos obligatoria en inversión). Sin riesgos específicos inventados del activo.");

  // 12 — Cierre
  d.closing({
    headline: "Coordinemos la visita y la revisión documental",
    lead: "Solicite los contratos, el detalle de ingresos cobrados, los gastos y la documentación del inmueble para evaluar la compra con información verificada.",
    signaturePreset: "U_brief_founder",
    contact: { name: "Lic. Juan José Castillo" },
    disclaimer: "Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. No constituye una garantía de rentabilidad.  ·  WEB ID 143028006-118",
    notes: "Firma según el brief del founder (Lic. Juan José Castillo, Broker Inmobiliario | Meridiano Capital). Contacto: brand_tokens.json / 09-cierres-y-firmas.md. Retrato autorizado (jjc_retrato.jpg) no disponible en el repo: cierre sin foto. Aviso legal: 'venta' (D-098) + cláusula de no garantía de rentabilidad del aviso 'preventa_inversion'.",
  });

  const out = await d.save(OUT);
  console.log(out);
  console.log(JSON.stringify({ GS_MES, USD_MES, BRUTO, NETO, YB, YN, MULT, porPiso }));
})();
