const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4", width: 8.27, height: 11.69 });
p.layout = "A4";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", LINEA="DAD2C0", GOLD_D="A87D22";
const LORA="Lora", POP="Poppins";
const W=8.27;
let s = p.addSlide();
s.background = { color: CREMA };

// Header band petroleo
s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W, h: 1.5, fill: { color: PETROLEO } });
s.addImage({ path: "isotipo_inverso.png", x: 0.55, y: 0.5, w: 0.5, h: 0.5 });
s.addText("MERIDIANO CAPITAL", { x: 1.15, y: 0.5, w: 5, h: 0.5, fontFace: LORA, bold: true, fontSize: 15, color: CREMA, charSpacing: 2, valign: "middle" });
s.addText("Inversión inmobiliaria en Asunción, Paraguay", { x: 4.7, y: 0.5, w: 3.1, h: 0.5, fontFace: POP, fontSize: 10.5, color: "9DA8AC", align: "right", valign: "middle" });

// Hook
s.addText("PARAGUAY · GRADO DE INVERSIÓN", { x: 0.6, y: 1.9, w: 7, h: 0.35, fontFace: POP, bold: true, fontSize: 12, color: GOLD_D, charSpacing: 3 });
s.addText("El momento de invertir en Asunción es ahora.", { x: 0.55, y: 2.3, w: 7.2, h: 1.0, fontFace: LORA, bold: true, fontSize: 30, color: PETROLEO, lineSpacing: 34 });
s.addText("Paraguay alcanzó el grado de inversión y crece a ~4,4% anual, con la carga fiscal más baja de la región. Asunción es donde ese crecimiento se convierte en renta y plusvalía — y nosotros te acompañamos en todo el camino.",
  { x: 0.6, y: 3.35, w: 7.1, h: 1.0, fontFace: POP, fontSize: 13, color: PETROLEO, lineSpacing: 20 });

// 3 datos en fila
const datos = [["Grado de inversión","Calificación soberana (Moody's)"],["IRP 10%","Sin impuesto a la ganancia de capital"],["~80.000","Radicaciones de extranjeros en 2026"]];
datos.forEach((d,i)=>{
  const x=0.6+i*2.42;
  s.addShape(p.ShapeType.rect,{x,y:4.55,w:2.25,h:1.35,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(d[0],{x:x+0.2,y:4.72,w:1.95,h:0.5,fontFace:LORA,bold:true,fontSize:d[0].length>8?17:22,color:TIERRA,valign:"middle"});
  s.addText(d[1],{x:x+0.2,y:5.25,w:1.9,h:0.55,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});
});

// Como trabajamos
s.addText("Acompañamiento de punta a punta", { x: 0.6, y: 6.2, w: 7, h: 0.45, fontFace: LORA, bold: true, fontSize: 18, color: PETROLEO });
s.addText([
  {text:"De la cédula al alquiler: ",options:{bold:true,color:PETROLEO}},
  {text:"gestionamos tu residencia y cédula paraguaya, la apertura bancaria, la estructura societaria y fiscal, y la administración de tu propiedad para sostener la rentabilidad. Con 16 años de trayectoria técnica y una red de aliados (abogado, escribano, contadora).",options:{color:GREY}},
], { x: 0.6, y: 6.65, w: 7.1, h: 0.9, fontFace: POP, fontSize: 12, lineSpacing: 18 });

// Dos formas
s.addText("Dos formas de invertir", { x: 0.6, y: 7.65, w: 7, h: 0.45, fontFace: LORA, bold: true, fontSize: 18, color: PETROLEO });
const modelos=[["Inversión Individual","Comprás tu unidad (terminada o en pozo). La administramos con renta tradicional o temporal para sostener tu rentabilidad neta."],["Coinversión","Ingresás con otros inversores a un vehículo para desarrollar un proyecto. Ideal para tickets grandes, desde USD 200.000."]];
modelos.forEach((m,i)=>{
  const x=0.6+i*3.65;
  s.addShape(p.ShapeType.rect,{x,y:8.1,w:3.5,h:1.5,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(m[0],{x:x+0.25,y:8.28,w:3.05,h:0.4,fontFace:LORA,bold:true,fontSize:14,color:TIERRA});
  s.addText(m[1],{x:x+0.25,y:8.72,w:3.05,h:0.85,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});
});

// CTA
s.addShape(p.ShapeType.rect,{x:0.6,y:9.95,w:7.07,h:1.05,fill:{color:TIERRA}});
s.addText("Agendá una llamada de 15 minutos",{x:0.8,y:10.12,w:4.5,h:0.7,fontFace:LORA,bold:true,fontSize:18,color:CREMA,valign:"middle"});
s.addText([
  {text:"+595 982 853 111\n",options:{bold:true}},
  {text:"juancastillo@meridianocapital.net",options:{}},
],{x:4.6,y:10.1,w:3.0,h:0.75,fontFace:POP,fontSize:11,color:CREMA,align:"right",valign:"middle",lineSpacing:16});

s.addText("Documento informativo · no constituye oferta vinculante · las rentabilidades dependen del mercado y no están garantizadas.",{x:0.6,y:11.15,w:7.1,h:0.35,fontFace:POP,fontSize:8.5,color:GREY,italic:true,align:"center"});

p.writeFile({ fileName: "Meridiano_OnePager_Frio.pptx" }).then(f => console.log("OK:", f));
