const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "V", width: 7.5, height: 13.333 });
p.layout = "V";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3";
const LORA="Lora", POP="Poppins";
let s = p.addSlide();
s.background = { color: PETROLEO };
s.addImage({ path: "isotipo_inverso.png", x: 0.55, y: 0.55, w: 0.55, h: 0.55 });
s.addText("MERIDIANO CAPITAL", { x: 1.2, y: 0.58, w: 6, h: 0.5, fontFace: LORA, bold: true, fontSize: 15, color: CREMA, charSpacing: 2, valign: "middle" });
s.addText("ASUNCIÓN, PARAGUAY", { x: 0.6, y: 2.15, w: 6.3, h: 0.4, fontFace: POP, bold: true, fontSize: 13, color: LAPACHO, charSpacing: 3 });
s.addText("Paraguay ya es\ngrado de inversión.", { x: 0.55, y: 2.7, w: 6.5, h: 2.0, fontFace: LORA, bold: true, fontSize: 40, color: CREMA, lineSpacing: 44 });
s.addText("Y Asunción es donde ese crecimiento se convierte en renta y plusvalía.", { x: 0.6, y: 4.75, w: 6.2, h: 0.95, fontFace: POP, fontSize: 17, color: "C7CFD2", lineSpacing: 25 });
const datos = [
  ["Grado de inversión", "calificación soberana otorgada por Moody's"],
  ["IRP 10%", "sin impuesto a la ganancia de capital"],
  ["~4,4% anual", "crecimiento económico proyectado 2026"],
];
let y = 6.0;
datos.forEach((d) => {
  s.addShape(p.ShapeType.line, { x: 0.6, y: y, w: 6.3, h: 0, line: { color: "2A4A52", width: 1 } });
  s.addText(d[0], { x: 0.6, y: y+0.1, w: 6.3, h: 0.5, fontFace: LORA, bold: true, fontSize: 23, color: LAPACHO });
  s.addText(d[1], { x: 0.6, y: y+0.64, w: 6.3, h: 0.4, fontFace: POP, fontSize: 13, color: "C7CFD2" });
  y += 1.25;
});
s.addShape(p.ShapeType.line, { x: 0.6, y: y, w: 6.3, h: 0, line: { color: "2A4A52", width: 1 } });
s.addText("Te acompañamos de la cédula al alquiler: renta administrada y plusvalía real.",
  { x: 0.6, y: y+0.3, w: 6.3, h: 0.9, fontFace: POP, fontSize: 15.5, color: CREMA, lineSpacing: 22 });
const cy = 11.4;
s.addShape(p.ShapeType.rect, { x: 0.6, y: cy, w: 6.3, h: 1.05, fill: { color: TIERRA } });
s.addText("Agendá una llamada de 15 minutos", { x: 0.6, y: cy+0.14, w: 6.3, h: 0.5, fontFace: LORA, bold: true, fontSize: 19, color: CREMA, align: "center" });
s.addText("Respondé este mensaje y coordinamos.", { x: 0.6, y: cy+0.63, w: 6.3, h: 0.35, fontFace: POP, fontSize: 13, color: "F0DDD5", align: "center" });
s.addText("Juan José Castillo  ·  +595 982 853 111  ·  juancastillo@meridianocapital.net",
  { x: 0.4, y: 12.8, w: 6.7, h: 0.35, fontFace: POP, fontSize: 10.5, color: "9DA8AC", align: "center" });
p.writeFile({ fileName: "Meridiano_WhatsApp_Frio.pptx" }).then(f => console.log("OK:", f));
