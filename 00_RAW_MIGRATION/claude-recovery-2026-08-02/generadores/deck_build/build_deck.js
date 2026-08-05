// Deck de Inversores — Meridiano Capital (dual-modelo, marca oficial)
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";

// ---- PALETA OFICIAL (Modulo 05) ----
const PETROLEO = "14313A", TIERRA = "8B3323", LAPACHO = "C9982E",
      CREMA = "F3EDE3", GREY = "6B6154", NAVY2 = "0D2226",
      FILA = "F7F4EE", LINEA = "DAD2C0", GOLD_D = "A87D22";
const LORA = "Lora", POP = "Poppins";

const W = 13.333, H = 7.5;
const ISO = "isotipo.png", ISO_INV = "isotipo_inverso.png", LOGO = "logo_horizontal.png";

// ---- helpers ----
function footer(s, n, dark) {
  const col = dark ? "9DA8AC" : GREY;
  s.addImage({ path: dark ? ISO_INV : ISO, x: 0.55, y: H-0.72, w: 0.32, h: 0.32 });
  s.addText("Meridiano Capital · Confidencial", { x: 0.95, y: H-0.72, w: 6, h: 0.32,
    fontFace: POP, fontSize: 8, color: col, valign: "middle" });
  s.addText(String(n).padStart(2,"0"), { x: W-1.1, y: H-0.72, w: 0.6, h: 0.32,
    fontFace: POP, fontSize: 8, color: col, align: "right", valign: "middle" });
}
function eyebrow(s, t, x, y, dark) {
  s.addText(t.toUpperCase(), { x, y, w: 8, h: 0.3, fontFace: POP, bold: true,
    fontSize: 11, color: dark ? LAPACHO : GOLD_D, charSpacing: 3, valign: "middle" });
}

// ============ SLIDE 1 — PORTADA (dark) ============
let s = p.addSlide(); s.background = { color: PETROLEO };
s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { type: "solid", color: PETROLEO } });
s.addImage({ path: ISO_INV, x: 0.6, y: 0.55, w: 0.6, h: 0.6 });
s.addText("MERIDIANO CAPITAL", { x: 1.35, y: 0.6, w: 8, h: 0.5, fontFace: LORA, bold: true,
  fontSize: 18, color: CREMA, charSpacing: 2, valign: "middle" });
eyebrow(s, "Asunción, Paraguay · 2026", 0.65, 2.5, true);
s.addText("Invertí en el mercado\ninmobiliario de Asunción", { x: 0.6, y: 2.9, w: 9.5, h: 1.9,
  fontFace: LORA, bold: true, fontSize: 44, color: CREMA, lineSpacing: 48 });
s.addText("Una oportunidad estructurada de inversión en renta y desarrollo, para inversores de Europa, Argentina y Brasil. Acompañamiento de punta a punta: de la cédula al alquiler.",
  { x: 0.65, y: 4.9, w: 8.2, h: 1.2, fontFace: POP, fontSize: 14, color: "C7CFD2", lineSpacing: 22 });
s.addText([
  { text: "Juan José Castillo", options: { bold: true, color: CREMA } },
  { text: "   |   Asesor y Desarrollador Inmobiliario   |   16 años de trayectoria", options: { color: "9DA8AC" } }
], { x: 0.65, y: 6.35, w: 11, h: 0.35, fontFace: POP, fontSize: 12 });
s.addText("Documento informativo para inversores — no constituye una oferta vinculante.",
  { x: 0.65, y: 6.75, w: 11, h: 0.3, fontFace: POP, fontSize: 9, color: "7C878B", italic: true });

// ============ SLIDE 2 — CONTEXTO MACRO (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Un mercado en consolidación", 0.6, 0.55);
s.addText("Paraguay 2026: el contexto que sostiene la oportunidad", { x: 0.6, y: 0.9, w: 12, h: 0.9,
  fontFace: LORA, bold: true, fontSize: 30, color: PETROLEO });
const stats = [
  ["Grado de Inversión", "Otorgado por Moody's al riesgo soberano paraguayo"],
  ["~4,4%", "Crecimiento económico anual proyectado"],
  ["~80.000", "Radicaciones de extranjeros proyectadas para 2026"],
  ["4 países", "Orígenes principales: Brasil, Argentina, Alemania y España"],
];
stats.forEach((st, i) => {
  const x = 0.6 + i * 3.05;
  s.addShape(p.ShapeType.rect, { x, y: 2.1, w: 2.8, h: 2.9, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addText(st[0], { x: x+0.15, y: 2.45, w: 2.5, h: 1.1, fontFace: LORA, bold: true,
    fontSize: st[0].length > 8 ? 20 : 30, color: TIERRA, valign: "middle" });
  s.addText(st[1], { x: x+0.15, y: 3.6, w: 2.5, h: 1.25, fontFace: POP, fontSize: 12, color: GREY, lineSpacing: 17, valign: "top" });
});
s.addText("En este contexto, la calidad constructiva y la estructuración legal-fiscal del proceso son cada vez más determinantes. No todos los desarrolladores están preparados para operar con ese nivel de exigencia.",
  { x: 0.6, y: 5.4, w: 12, h: 1, fontFace: POP, fontSize: 14, color: PETROLEO, italic: true, lineSpacing: 22 });
footer(s, 2);

// ============ SLIDE 3 — POR QUE MERIDIANO (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Por qué invertir con nosotros", 0.6, 0.55);
s.addText("16 años de trayectoria técnica, no solo intermediación", { x: 0.6, y: 0.9, w: 12, h: 0.9,
  fontFace: LORA, bold: true, fontSize: 28, color: PETROLEO });
const pilares = [
  ["Mirada de quien construye", "Formación en construcción aplicada a evaluar terrenos, obras y oportunidades de valor real — no solo comprar y vender."],
  ["Estructuración integral", "Acompañamiento de punta a punta: cédula, banco, Sociedad Anónima y estructura del vehículo de inversión."],
  ["Gestión activa post-inversión", "El activo se administra tras la compra, con portafolio dual de renta tradicional y temporal, para sostener la rentabilidad objetivo."],
];
pilares.forEach((pl, i) => {
  const x = 0.6 + i * 4.05;
  s.addShape(p.ShapeType.rect, { x, y: 2.3, w: 3.8, h: 3.4, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addShape(p.ShapeType.rect, { x: x+0.35, y: 2.65, w: 0.6, h: 0.6, fill: { color: PETROLEO } });
  s.addText(String(i+1), { x: x+0.35, y: 2.65, w: 0.6, h: 0.6, fontFace: LORA, bold: true, fontSize: 22, color: LAPACHO, align: "center", valign: "middle" });
  s.addText(pl[0], { x: x+0.35, y: 3.5, w: 3.1, h: 0.8, fontFace: LORA, bold: true, fontSize: 18, color: PETROLEO, lineSpacing: 21 });
  s.addText(pl[1], { x: x+0.35, y: 4.35, w: 3.1, h: 1.2, fontFace: POP, fontSize: 12.5, color: GREY, lineSpacing: 18 });
});
s.addText("“Acompañamos al inversor desde la cédula hasta el alquiler, con la mirada técnica de quien construye.”",
  { x: 0.6, y: 6.0, w: 12, h: 0.6, fontFace: LORA, italic: true, fontSize: 15, color: TIERRA });
footer(s, 3);

// ============ SLIDE 4 — DOS FORMAS DE INVERTIR (light) NUEVA ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Dos formas de invertir con Meridiano", 0.6, 0.55);
s.addText("Elegí según tu capital y tus objetivos", { x: 0.6, y: 0.9, w: 12, h: 0.9,
  fontFace: LORA, bold: true, fontSize: 30, color: PETROLEO });
const modelos = [
  [PETROLEO, "Inversión Individual", "Comprás tu propia unidad", [
    "Elegís la unidad (terminada o en pozo)",
    "Nosotros la administramos: renta tradicional o temporal",
    "Objetivo de rentabilidad neta sostenida",
    "Ideal para 1 o pocas propiedades",
  ]],
  [TIERRA, "Coinversión", "Varios inversores, un desarrollo", [
    "Ingresás a un vehículo común (S.A. o Fideicomiso)",
    "Participás del retorno de un proyecto de desarrollo",
    "Estructura con retorno preferente y reparto de ganancia",
    "Ideal para tickets grandes (desde USD 200.000)",
  ]],
];
modelos.forEach((m, i) => {
  const x = 0.6 + i * 6.15;
  s.addShape(p.ShapeType.rect, { x, y: 2.2, w: 5.9, h: 4.3, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addShape(p.ShapeType.rect, { x, y: 2.2, w: 5.9, h: 0.95, fill: { color: m[0] } });
  s.addText(m[1], { x: x+0.4, y: 2.28, w: 5.1, h: 0.5, fontFace: LORA, bold: true, fontSize: 20, color: CREMA, valign: "middle" });
  s.addText(m[2], { x: x+0.4, y: 2.72, w: 5.1, h: 0.35, fontFace: POP, fontSize: 12, color: "D8CFC2", valign: "middle" });
  const items = m[3].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, breakLine: j < m[3].length-1, paraSpaceAfter: 8 } }));
  s.addText(items, { x: x+0.45, y: 3.35, w: 5.0, h: 3, fontFace: POP, fontSize: 13, color: PETROLEO, lineSpacing: 18 });
});
footer(s, 4);

// ============ SLIDE 5 — EMPEZAR SIN CÉDULA (light) — EL DIFERENCIADOR ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Cómo empezás · el diferenciador");
s.addText("Empezá a invertir sin esperar tu cédula", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 29, color: PETROLEO });
// Statement destacado
s.addShape(p.ShapeType.rect, { x: 0.6, y: 2.05, w: 12.1, h: 1.15, fill: { color: PETROLEO } });
s.addText([
  { text: "Un extranjero puede comprar inmuebles en Paraguay a través de una S.A. ", options: { color: CREMA } },
  { text: "sin que ningún socio tenga cédula paraguaya.", options: { bold: true, color: LAPACHO } },
], { x: 0.95, y: 2.05, w: 11.4, h: 1.15, fontFace: LORA, fontSize: 19, valign: "middle", lineSpacing: 24 });
// Cómo funciona — 3 pasos
const pasos = [
  ["1", "Constituís tu S.A.", "Con socios 100% extranjeros. No hace falta que ninguno tenga cédula."],
  ["2", "Nosotros te representamos", "Meridiano actúa como representante legal y síndico de tu sociedad."],
  ["3", "Comprás de inmediato", "La S.A. adquiere inmuebles ya — sin esperar meses por un trámite."],
];
pasos.forEach((ps, i) => {
  const x = 0.6 + i * 4.05;
  s.addShape(p.ShapeType.rect, { x, y: 3.65, w: 3.8, h: 2.35, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addText(ps[0], { x: x+0.3, y: 3.85, w: 1, h: 0.85, fontFace: LORA, bold: true, fontSize: 36, color: LAPACHO });
  s.addText(ps[1], { x: x+0.3, y: 4.75, w: 3.2, h: 0.5, fontFace: LORA, bold: true, fontSize: 16, color: PETROLEO });
  s.addText(ps[2], { x: x+0.3, y: 5.25, w: 3.25, h: 0.7, fontFace: POP, fontSize: 11.5, color: GREY, lineSpacing: 15 });
});
s.addText("Tu cédula corre en paralelo, a tu ritmo. El acompañamiento como representante dura hasta que la obtengas — o para siempre, si lo preferís.",
  { x: 0.6, y: 6.25, w: 12, h: 0.5, fontFace: POP, fontSize: 13, color: TIERRA, italic: true, lineSpacing: 17 });
footer(s, 5);

// ============ SLIDE 6 — CÉDULA EN PARALELO (opcional) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Tu cédula · opcional, en paralelo");
s.addText("Si querés tu cédula, avanza mientras ya invertís", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 28, color: PETROLEO });
s.addText("No es requisito para invertir, pero si la querés, la tramitamos en paralelo. El camino depende del monto:",
  { x: 0.6, y: 1.75, w: 12, h: 0.5, fontFace: POP, fontSize: 14, color: GREY });
const caminos = [
  ["Camino Estándar", "Inversión menor a USD 200.000", ["Residencia temporal (2 años) — ya otorga cédula biométrica","Residencia permanente a los 24 meses","Opción: iniciar cédula y luego constituir tu S.A. propia","Ideal para la compra de una unidad"]],
  ["Investor Pass", "Inversión desde USD 200.000", ["Residencia permanente directa, sin espera de 2 años","Vía SUACE: constancia en ≤5 días hábiles","Una sola presencia física · cédula válida 10 años","Ideal para carteras y coinversión"]],
];
caminos.forEach((c, i) => {
  const x = 0.6 + i * 6.15;
  s.addShape(p.ShapeType.rect, { x, y: 2.5, w: 5.9, h: 3.75, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addText(c[0], { x: x+0.4, y: 2.72, w: 5.1, h: 0.5, fontFace: LORA, bold: true, fontSize: 20, color: PETROLEO });
  s.addText(c[1], { x: x+0.4, y: 3.2, w: 5.1, h: 0.4, fontFace: POP, bold: true, fontSize: 12.5, color: TIERRA });
  const items = c[2].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, breakLine: j < c[2].length-1, paraSpaceAfter: 8 } }));
  s.addText(items, { x: x+0.45, y: 3.72, w: 5.0, h: 2.4, fontFace: POP, fontSize: 12.5, color: PETROLEO, lineSpacing: 17 });
});
s.addText("Cuando obtenés tu cédula, podés asumir vos mismo la representación de tu S.A. · Aranceles: migraciones.gov.py",
  { x: 0.6, y: 6.45, w: 12, h: 0.35, fontFace: POP, fontSize: 10, color: GREY, italic: true });
footer(s, 6);

// ============ SLIDE 7 — VEHICULO DE COINVERSION (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Coinversión · el vehículo", 0.6, 0.55);
s.addText("Sociedad Anónima o Fideicomiso, según la escala", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 28, color: PETROLEO });
const vehic = [
  ["Sociedad Anónima", ["Persona jurídica propia, con accionistas","Directorio flexible — control activo del gestor","Costo y tiempo de constitución moderados","Familiar para el inversor extranjero","Recomendado para menor escala o grupos acotados"]],
  ["Fideicomiso de Administración", ["Patrimonio autónomo, fiduciario regulado","Mayor formalidad y separación patrimonial","Costo inicial más alto, estructura más robusta","Mayor protección para tickets grandes","Recomendado para mayor escala o inversores no relacionados"]],
];
vehic.forEach((v, i) => {
  const x = 0.6 + i * 6.15;
  s.addShape(p.ShapeType.rect, { x, y: 2.2, w: 5.9, h: 4.2, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addText(v[0], { x: x+0.4, y: 2.45, w: 5.1, h: 0.5, fontFace: LORA, bold: true, fontSize: 18, color: PETROLEO });
  const items = v[1].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, breakLine: j < v[1].length-1, paraSpaceAfter: 8 } }));
  s.addText(items, { x: x+0.45, y: 3.15, w: 5.0, h: 3, fontFace: POP, fontSize: 12.5, color: PETROLEO, lineSpacing: 17 });
});
footer(s, 7);

// ============ SLIDE 8 — ECONOMICS (dark, emphasis) ============
s = p.addSlide(); s.background = { color: PETROLEO };
eyebrow(s, "Coinversión · economics", 0.6, 0.55, true);
s.addText("Tres componentes, alineados con tu resultado", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 28, color: CREMA });
const fees = [
  ["Fee de Estructuración", "1,5% – 3%", "del capital comprometido, al cierre de la ronda"],
  ["Fee de Gestión de Obra", "2% – 4%", "del costo de obra, durante la construcción"],
  ["Carried Interest", "15% – 20%", "de la ganancia sobre el retorno preferente del 8% anual — solo si el inversor ya recuperó capital + hurdle"],
];
fees.forEach((f, i) => {
  const x = 0.6 + i * 4.05;
  s.addShape(p.ShapeType.rect, { x, y: 2.3, w: 3.8, h: 3.6, fill: { color: NAVY2 }, line: { color: "2A4A52", width: 1 } });
  s.addText(String(i+1), { x: x+0.35, y: 2.55, w: 1, h: 0.5, fontFace: POP, bold: true, fontSize: 13, color: LAPACHO });
  s.addText(f[0], { x: x+0.35, y: 3.05, w: 3.1, h: 0.7, fontFace: LORA, bold: true, fontSize: 17, color: CREMA, lineSpacing: 20 });
  s.addText(f[1], { x: x+0.35, y: 3.75, w: 3.1, h: 0.7, fontFace: LORA, bold: true, fontSize: 26, color: LAPACHO });
  s.addText(f[2], { x: x+0.35, y: 4.5, w: 3.2, h: 1.3, fontFace: POP, fontSize: 11.5, color: "C7CFD2", lineSpacing: 16 });
});
s.addText("El carry solo se cobra si vos ya recuperaste tu capital más el retorno preferente. Nuestra ganancia depende de la tuya.",
  { x: 0.6, y: 6.15, w: 12, h: 0.5, fontFace: POP, italic: true, fontSize: 13, color: "9DA8AC" });
footer(s, 8, true);

// ============ SLIDE 9 — WATERFALL (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Coinversión · orden de retornos (waterfall)", 0.6, 0.55);
s.addText("Caso ilustrativo — capital USD 500.000, 24 meses", { x: 0.6, y: 0.9, w: 12, h: 0.8, fontFace: LORA, bold: true, fontSize: 26, color: PETROLEO });
const rows = [
  ["1", "Devolución de capital a inversores", "500.000"],
  ["2", "Retorno preferente (hurdle 8% anual × 2 años)", "80.000"],
  ["3", "Ganancia remanente a repartir", "70.000"],
  ["4a", "80% del remanente → inversores", "56.000"],
  ["4b", "20% del remanente → carried interest", "14.000"],
];
const ty = 2.1, rh = 0.62;
s.addShape(p.ShapeType.rect, { x: 0.6, y: ty, w: 12.1, h: rh, fill: { color: PETROLEO } });
s.addText("Paso", { x: 0.75, y: ty, w: 1, h: rh, fontFace: POP, bold: true, fontSize: 12, color: CREMA, valign: "middle" });
s.addText("Descripción", { x: 1.9, y: ty, w: 7.5, h: rh, fontFace: POP, bold: true, fontSize: 12, color: CREMA, valign: "middle" });
s.addText("Monto (USD)", { x: 10, y: ty, w: 2.5, h: rh, fontFace: POP, bold: true, fontSize: 12, color: CREMA, align: "right", valign: "middle" });
rows.forEach((r, i) => {
  const y = ty + rh*(i+1);
  s.addShape(p.ShapeType.rect, { x: 0.6, y, w: 12.1, h: rh, fill: { color: i%2 ? FILA : "FFFFFF" }, line: { color: LINEA, width: 0.5 } });
  s.addText(r[0], { x: 0.75, y, w: 1, h: rh, fontFace: POP, bold: true, fontSize: 12, color: TIERRA, valign: "middle" });
  s.addText(r[1], { x: 1.9, y, w: 7.5, h: rh, fontFace: POP, fontSize: 12, color: PETROLEO, valign: "middle" });
  s.addText(r[2], { x: 10, y, w: 2.5, h: rh, fontFace: POP, bold: i>=3, fontSize: 12, color: PETROLEO, align: "right", valign: "middle" });
});
s.addText([
  { text: "El inversor recupera capital + hurdle + su parte del remanente = ", options: { color: PETROLEO } },
  { text: "USD 636.000 (27,2% en 24 meses).", options: { bold: true, color: TIERRA } },
], { x: 0.6, y: ty+rh*6+0.15, w: 12, h: 0.5, fontFace: POP, fontSize: 13, lineSpacing: 18 });
footer(s, 9);

// ============ SLIDE 10 — RETORNO PROYECTADO (dark, chart) ============
s = p.addSlide(); s.background = { color: PETROLEO };
eyebrow(s, "Coinversión · retorno proyectado", 0.6, 0.55, true);
s.addText("Composición del retorno al inversor", { x: 0.6, y: 0.9, w: 12, h: 0.8, fontFace: LORA, bold: true, fontSize: 28, color: CREMA });
s.addChart(p.ChartType.bar, [
  { name: "USD", labels: ["Capital", "Retorno preferente", "Parte del remanente"], values: [500000, 80000, 56000] }
], { x: 0.6, y: 2.1, w: 7, h: 4.4, barDir: "bar", chartColors: [LAPACHO, "3E6670", "6B8A92"],
   showValue: true, dataLabelPosition: "outEnd", dataLabelColor: CREMA, dataLabelFontFace: POP, dataLabelFontSize: 11,
   showLegend: false, showTitle: false, valAxisHidden: true, catAxisLabelColor: CREMA, catAxisLabelFontFace: POP,
   catAxisLabelFontSize: 12, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 600000 });
s.addShape(p.ShapeType.rect, { x: 8.1, y: 2.4, w: 4.6, h: 3.8, fill: { color: NAVY2 }, line: { color: "2A4A52", width: 1 } });
s.addText("USD 636.000", { x: 8.35, y: 2.9, w: 4.1, h: 0.8, fontFace: LORA, bold: true, fontSize: 34, color: LAPACHO });
s.addText("Retorno total al inversor\n(27,2% en 24 meses)", { x: 8.35, y: 3.8, w: 4.1, h: 0.8, fontFace: POP, fontSize: 14, color: CREMA, lineSpacing: 19 });
s.addText("~13,2%", { x: 8.35, y: 4.75, w: 4.1, h: 0.5, fontFace: LORA, bold: true, fontSize: 22, color: CREMA });
s.addText("Retorno anualizado simple estimado", { x: 8.35, y: 5.25, w: 4.1, h: 0.4, fontFace: POP, fontSize: 11.5, color: "9DA8AC" });
s.addText("Cifras ilustrativas. El retorno real depende del desempeño del proyecto y no está garantizado.",
  { x: 0.6, y: 6.6, w: 12, h: 0.35, fontFace: POP, fontSize: 9.5, color: "7C878B", italic: true });
footer(s, 10, true);

// ============ SLIDE 11 — GESTION POST-INVERSION (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Gestión patrimonial post-inversión", 0.6, 0.55);
s.addText("El acompañamiento no termina en el cierre", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 30, color: PETROLEO });
const renta = [
  ["Renta Tradicional", ["Contrato de locación de largo plazo, inquilino estable","Rentabilidad bruta de referencia: 6% – 10% anual","Baja intensidad operativa — gestión directa de nuestro equipo","Objetivo de rentabilidad neta de cartera: 10%"]],
  ["Renta Temporal", ["Estadías cortas en zonas de alta demanda","Rentabilidad bruta de referencia: 10% – 16%+ anual","Operada con aliado de 20+ años en el rubro","Nosotros originamos y reportamos; el aliado ejecuta"]],
];
renta.forEach((r, i) => {
  const x = 0.6 + i * 6.15;
  s.addShape(p.ShapeType.rect, { x, y: 2.2, w: 5.9, h: 4.1, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addText(r[0], { x: x+0.4, y: 2.45, w: 5.1, h: 0.5, fontFace: LORA, bold: true, fontSize: 19, color: TIERRA });
  const items = r[1].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, breakLine: j < r[1].length-1, paraSpaceAfter: 9 } }));
  s.addText(items, { x: x+0.45, y: 3.15, w: 5.0, h: 3, fontFace: POP, fontSize: 12.5, color: PETROLEO, lineSpacing: 17 });
});
footer(s, 11);

// ============ SLIDE 12 — RED DE ALIADOS (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Red de aliados profesionales", 0.6, 0.55);
s.addText("Cada etapa, respaldada por especialistas de confianza", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 28, color: PETROLEO });
const aliados = [
  ["Abogado", "Constitución societaria, revisión contractual, debida diligencia"],
  ["Escribano", "Escrituración y protocolización de actos societarios"],
  ["Contadora", "RUC, facturación, régimen impositivo, cumplimiento fiscal"],
  ["Operador de Renta Temporal", "20+ años — operación diaria del circuito de renta temporal"],
];
aliados.forEach((a, i) => {
  const x = 0.6 + i * 3.05;
  s.addShape(p.ShapeType.rect, { x, y: 2.3, w: 2.8, h: 3.2, fill: { color: "FFFFFF" }, line: { color: LINEA, width: 1 } });
  s.addShape(p.ShapeType.rect, { x: x+0.3, y: 2.6, w: 0.7, h: 0.7, fill: { color: PETROLEO } });
  s.addText(a[0].substring(0,2), { x: x+0.3, y: 2.6, w: 0.7, h: 0.7, fontFace: LORA, bold: true, fontSize: 18, color: LAPACHO, align: "center", valign: "middle" });
  s.addText(a[0], { x: x+0.3, y: 3.5, w: 2.3, h: 0.8, fontFace: LORA, bold: true, fontSize: 15, color: PETROLEO, lineSpacing: 18 });
  s.addText(a[1], { x: x+0.3, y: 4.25, w: 2.3, h: 1.1, fontFace: POP, fontSize: 11.5, color: GREY, lineSpacing: 16 });
});
footer(s, 12);

// ============ SLIDE 13 — RIESGOS (light) ============
s = p.addSlide(); s.background = { color: CREMA };
eyebrow(s, "Consideraciones de riesgo", 0.6, 0.55);
s.addText("Lo que todo inversor debe saber", { x: 0.6, y: 0.9, w: 12, h: 0.9, fontFace: LORA, bold: true, fontSize: 30, color: PETROLEO });
const riesgos = [
  "Toda inversión en etapa de desarrollo o preventa está sujeta a riesgos, incluyendo demoras de obra y variación de costos de construcción.",
  "Las condiciones de mercado al momento de vender o alquilar pueden diferir de las proyectadas en este documento.",
  "La coinversión presenta riesgo de iliquidez durante el horizonte del proyecto — no contempla rescate anticipado de capital, salvo acuerdo expreso.",
  "Las cifras de retorno presentadas son ilustrativas y no constituyen garantía de rentabilidad.",
  "Se recomienda a cada inversor evaluar la oportunidad con asesoría legal, impositiva y financiera propia, independiente de Meridiano Capital.",
];
const ri = riesgos.map((t, j) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: j < riesgos.length-1, paraSpaceAfter: 12 } }));
s.addText(ri, { x: 0.7, y: 2.2, w: 11.9, h: 4, fontFace: POP, fontSize: 14, color: PETROLEO, lineSpacing: 20 });
footer(s, 13);

// ============ SLIDE 14 — CIERRE / CTA (dark tierra) ============
s = p.addSlide(); s.background = { color: TIERRA };
s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: TIERRA } });
s.addImage({ path: ISO_INV, x: 0.6, y: 0.6, w: 0.55, h: 0.55 });
s.addText("MERIDIANO CAPITAL", { x: 1.28, y: 0.62, w: 8, h: 0.5, fontFace: LORA, bold: true, fontSize: 16, color: CREMA, charSpacing: 2, valign: "middle" });
s.addText("Hablemos de tu próxima\ninversión en Paraguay", { x: 0.6, y: 2.4, w: 11, h: 2, fontFace: LORA, bold: true, fontSize: 42, color: CREMA, lineSpacing: 46 });
s.addText("Juan José Castillo", { x: 0.6, y: 4.7, w: 11, h: 0.5, fontFace: LORA, bold: true, fontSize: 20, color: CREMA });
s.addText("Asesor y Desarrollador Inmobiliario · Asunción, Paraguay", { x: 0.6, y: 5.2, w: 11, h: 0.4, fontFace: POP, fontSize: 13, color: "F0DDD5" });
s.addText([
  { text: "juancastillo@meridianocapital.net", options: { bold: true } },
  { text: "     ·     +595 982 853 111     ·     www.meridianocapital.net" },
], { x: 0.6, y: 5.75, w: 12, h: 0.4, fontFace: POP, fontSize: 13, color: CREMA });
s.addText("Documento informativo preliminar y no vinculante. Los términos finales quedarán establecidos en el estatuto societario o contrato definitivo.",
  { x: 0.6, y: 6.7, w: 12, h: 0.5, fontFace: POP, fontSize: 9.5, color: "F0DDD5", italic: true });

p.writeFile({ fileName: "Meridiano_Deck_Inversores.pptx" }).then(f => console.log("OK:", f));
