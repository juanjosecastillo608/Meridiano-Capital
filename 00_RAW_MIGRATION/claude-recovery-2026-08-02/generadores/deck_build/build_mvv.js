const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4", width: 8.27, height: 11.69 });
p.layout = "A4";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", LINEA="DAD2C0", GOLD_D="A87D22", FILA="F7F4EE";
const LORA="Lora", POP="Poppins";
const W=8.27;
let s=p.addSlide(); s.background={color:CREMA};

// Header petroleo
s.addShape(p.ShapeType.rect,{x:0,y:0,w:W,h:1.5,fill:{color:PETROLEO}});
s.addImage({path:"isotipo_inverso.png",x:0.55,y:0.5,w:0.5,h:0.5});
s.addText("MERIDIANO CAPITAL",{x:1.15,y:0.5,w:5,h:0.5,fontFace:LORA,bold:true,fontSize:15,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Misión · Visión · Valores",{x:4.5,y:0.5,w:3.3,h:0.5,fontFace:POP,fontSize:11,color:"9DA8AC",align:"right",valign:"middle"});

// MISIÓN
s.addText("MISIÓN",{x:0.6,y:1.85,w:7,h:0.35,fontFace:POP,bold:true,fontSize:12,color:GOLD_D,charSpacing:3});
s.addText("Convertir a inversores extranjeros en propietarios e inversores inmobiliarios paraguayos, acompañándolos de punta a punta —de la cédula al alquiler— con rigor técnico y legal, para que construyan y protejan su patrimonio en Asunción con tranquilidad.",
  {x:0.6,y:2.2,w:7.1,h:1.15,fontFace:LORA,fontSize:16,color:PETROLEO,lineSpacing:24});

// VISIÓN
s.addText("VISIÓN",{x:0.6,y:3.65,w:7,h:0.35,fontFace:POP,bold:true,fontSize:12,color:GOLD_D,charSpacing:3});
s.addText("Ser el operador técnico y legal de referencia para la inversión inmobiliaria extranjera en Paraguay: el nombre en el que un inversor de Europa, Argentina, Brasil o Chile confía su capital y su radicación, de principio a fin.",
  {x:0.6,y:4.0,w:7.1,h:1.1,fontFace:LORA,fontSize:16,color:PETROLEO,lineSpacing:24});

// VALORES
s.addText("VALORES",{x:0.6,y:5.4,w:7,h:0.35,fontFace:POP,bold:true,fontSize:12,color:GOLD_D,charSpacing:3});
const val=[
  ["Responsabilidad más allá de la firma","El compromiso empieza antes de la compra, no termina en el cierre, y cuida el capital del inversor como si fuera propio."],
  ["Rigor técnico y legal","Cada número y cada estructura se sostienen en datos y en la ley, nunca en promesas."],
  ["Acompañamiento integral","Un solo responsable para todo el camino: lo legal, lo bancario, lo migratorio y la renta."],
  ["Transparencia que gana confianza","El inversor entiende siempre en qué invierte, cuánto cuesta y qué riesgos corre; la reputación se construye con resultados y se sostiene con el referido."],
];
val.forEach((v,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*3.65,yy=5.8+row*1.95;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:3.5,h:1.75,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(String(i+1),{x:x+0.25,y:yy+0.2,w:0.6,h:0.5,fontFace:LORA,bold:true,fontSize:22,color:LAPACHO});
  s.addText(v[0],{x:x+0.75,y:yy+0.22,w:2.65,h:0.6,fontFace:LORA,bold:true,fontSize:13,color:PETROLEO,lineSpacing:15});
  s.addText(v[1],{x:x+0.25,y:yy+0.85,w:3.05,h:0.85,fontFace:POP,fontSize:9.5,color:GREY,lineSpacing:13});});

// Cierre / firma
s.addShape(p.ShapeType.rect,{x:0,y:9.95,w:W,h:1.74,fill:{color:TIERRA}});
s.addText("“Donde otros ven una comisión, yo veo una responsabilidad que empieza antes de la compra y no termina en la firma.”",
  {x:0.6,y:10.15,w:7.1,h:0.7,fontFace:LORA,italic:true,fontSize:14,color:CREMA,lineSpacing:19});
s.addText([{text:"Juan José Castillo",options:{bold:true}},{text:"  ·  Operador Técnico y Legal de Inversiones Inmobiliarias  ·  Asunción, Paraguay",options:{}}],
  {x:0.6,y:11.0,w:7.1,h:0.35,fontFace:POP,fontSize:10.5,color:"F0DDD5",valign:"middle"});
s.addText("+595 982 853 111  ·  juancastillo@meridianocapital.net  ·  www.meridianocapital.net",
  {x:0.6,y:11.3,w:7.1,h:0.3,fontFace:POP,fontSize:9.5,color:"F0DDD5"});

p.writeFile({fileName:"Meridiano_Mision_Vision_Valores.pptx"}).then(f=>console.log("OK:",f));
