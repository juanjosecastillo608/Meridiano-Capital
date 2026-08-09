// Programa de Ingreso al Mercado Paraguayo — Meridiano Capital
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", FILA="F7F4EE", LINEA="DAD2C0", GOLD_D="A87D22";
const LORA="Fraunces", POP="Poppins";
const W=13.333, H=7.5, ISO="isotipo.png", ISO_INV="isotipo_inverso.png";

function footer(s,n,dark){const col=dark?"9DA8AC":GREY;
  s.addImage({path:dark?ISO_INV:ISO,x:0.55,y:H-0.72,w:0.32,h:0.32});
  s.addText("Meridiano Capital · Confidencial",{x:0.95,y:H-0.72,w:7,h:0.32,fontFace:POP,fontSize:8,color:col,valign:"middle"});
  s.addText(String(n).padStart(2,"0"),{x:W-1.1,y:H-0.72,w:0.6,h:0.32,fontFace:POP,fontSize:8,color:col,align:"right",valign:"middle"});}
function eyebrow(s,t,dark){s.addText(t.toUpperCase(),{x:0.6,y:0.55,w:11,h:0.3,fontFace:POP,bold:true,fontSize:11,color:dark?LAPACHO:GOLD_D,charSpacing:3,valign:"middle"});}
function title(s,t,dark){s.addText(t,{x:0.6,y:0.9,w:12.1,h:0.95,fontFace:LORA,bold:false,fontSize:29,color:dark?CREMA:PETROLEO,lineSpacing:32});}

// 1 — PORTADA
let s=p.addSlide(); s.background={color:PETROLEO};
s.addImage({path:ISO_INV,x:0.6,y:0.55,w:0.6,h:0.6});
s.addText("MERIDIANO CAPITAL",{x:1.35,y:0.6,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:18,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("PARAGUAY · MERCOSUR",{x:0.65,y:2.5,w:8,h:0.35,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,charSpacing:3});
s.addText("Programa de Ingreso\nal Mercado Paraguayo",{x:0.6,y:2.95,w:11,h:1.8,fontFace:LORA,bold:false,fontSize:42,color:CREMA,lineSpacing:46});
s.addText("Guía para inversores extranjeros: constitución de sociedad, apertura de cuenta, ingreso de capital y radicación en Paraguay.",{x:0.65,y:4.95,w:9,h:0.9,fontFace:POP,fontSize:14,color:"C7CFD2",lineSpacing:22});
s.addText("Asesoría legal, societaria y migratoria de principio a fin.",{x:0.65,y:6.2,w:11,h:0.4,fontFace:POP,italic:true,fontSize:13,color:"9DA8AC"});

// 2 — ¿QUÉ ES EL PROGRAMA?
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El programa"); title(s,"Un acompañamiento integral para operar en Paraguay");
s.addText("Del primer trámite legal a la radicación migratoria, con todo lo societario y bancario gestionado por nuestro equipo. El resultado: empresa constituida, cuenta operativa y, si se desea, cédula paraguaya como inversor.",{x:0.6,y:1.85,w:12,h:0.9,fontFace:POP,fontSize:13.5,color:PETROLEO,lineSpacing:20});
const comp=[["1","Sociedad Anónima","Constitución ante escribano público"],["2","Cuenta Corriente","En guaraníes y dólares, en banco paraguayo"],["3","Ingreso de Capital","Acompañamiento en la transferencia desde el exterior"],["4","Cédula Paraguaya","Radicación migratoria para los socios (opcional)"]];
comp.forEach((c,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:3.1,w:2.8,h:2.9,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addShape(p.ShapeType.rect,{x:x+0.3,y:3.4,w:0.6,h:0.6,fill:{color:PETROLEO}});
  s.addText(c[0],{x:x+0.3,y:3.4,w:0.6,h:0.6,fontFace:LORA,bold:false,fontSize:22,color:LAPACHO,align:"center",valign:"middle"});
  s.addText(c[1],{x:x+0.3,y:4.2,w:2.3,h:0.7,fontFace:LORA,bold:false,fontSize:16,color:PETROLEO,lineSpacing:19});
  s.addText(c[2],{x:x+0.3,y:4.9,w:2.35,h:0.95,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});});
footer(s,2);

// 3 — CAMINO EN 4 PASOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El camino en 4 pasos"); title(s,"Del ingreso de fondos a la radicación como inversor");
const pasos=[["1","Constitución de la S.A.","Escribano, capital social y roles legales"],["2","Apertura de Cuenta","Cuenta corriente en guaraníes y USD"],["3","Ingreso de Capital","Acompañamiento en la transferencia inicial"],["4","Cédula Paraguaya","Radicación migratoria de los socios (opcional)"]];
pasos.forEach((ps,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.6,w:2.8,h:2.7,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(ps[0],{x:x+0.3,y:2.85,w:1,h:1,fontFace:LORA,bold:false,fontSize:40,color:LAPACHO});
  s.addText(ps[1],{x:x+0.3,y:3.9,w:2.35,h:0.7,fontFace:LORA,bold:false,fontSize:15,color:PETROLEO,lineSpacing:18});
  s.addText(ps[2],{x:x+0.3,y:4.55,w:2.35,h:0.7,fontFace:POP,fontSize:11,color:GREY,lineSpacing:15});
  if(i<3)s.addText("›",{x:x+2.78,y:3.5,w:0.35,h:0.5,fontFace:POP,fontSize:24,color:TIERRA,align:"center",valign:"middle"});});
footer(s,3);

// 4 — CONSTITUCIÓN DE LA S.A.
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Paso 1 · Constitución de la Sociedad Anónima"); title(s,"Tu empresa paraguaya, 100% de tu propiedad");
// Dato destacado capital
s.addShape(p.ShapeType.rect,{x:0.6,y:2.05,w:5.9,h:2.15,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("CAPITAL SOCIAL MÍNIMO (NOMINAL)",{x:0.9,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:10.5,color:GOLD_D,charSpacing:2});
s.addText("₲ 900.000.000",{x:0.9,y:2.65,w:5.3,h:0.7,fontFace:LORA,bold:false,fontSize:30,color:TIERRA});
s.addText("≈ USD 150.000. Es el mínimo legal para abrir una S.A., pero es capital nominal: no hay que integrarlo. No es un piso de inversión.",{x:0.9,y:3.35,w:5.3,h:0.8,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});
// Puntos clave
const kv=[["Constitución ante escribano","La S.A. se constituye con escritura pública, conforme a la legislación societaria paraguaya."],["Composición societaria","Puede ser 100% de socios extranjeros — no requiere socios paraguayos."],["Roles obligatorios","Representante legal, síndico y contador, incluidos en el acompañamiento mensual."]];
let y=2.05; kv.forEach(k=>{
  s.addShape(p.ShapeType.rect,{x:6.8,y:y,w:5.9,h:0.66,fill:{color:FILA}});
  s.addText(k[0],{x:7.05,y:y+0.08,w:5.5,h:0.3,fontFace:LORA,bold:false,fontSize:13,color:PETROLEO});
  s.addText(k[1],{x:7.05,y:y+0.36,w:5.5,h:0.3,fontFace:POP,fontSize:10,color:GREY,lineSpacing:12});
  y+=0.75;});
footer(s,4);

// 5 — APERTURA DE CUENTA
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Paso 2 · Apertura de cuenta corriente"); title(s,"Cuenta operativa en Paraguay, en doble moneda");
s.addShape(p.ShapeType.rect,{x:0.6,y:2.05,w:5.9,h:2.15,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("TOPE DEL PRIMER INGRESO ACOMPAÑADO",{x:0.9,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:10.5,color:GOLD_D,charSpacing:2});
s.addText("USD 200.000",{x:0.9,y:2.65,w:5.3,h:0.7,fontFace:LORA,bold:false,fontSize:32,color:TIERRA});
s.addText("Monto máximo acompañado en el primer ingreso de dinero desde el exterior hacia la cuenta paraguaya.",{x:0.9,y:3.4,w:5.3,h:0.7,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});
const kv5=[["Doble moneda","La cuenta corriente se habilita en guaraníes y en dólares estadounidenses."],["A nombre de la sociedad","Apertura gestionada en una entidad bancaria local, a nombre de la S.A."],["Primera transferencia asistida","Acompañamos la primera transferencia de fondos desde el exterior."]];
y=2.05; kv5.forEach(k=>{
  s.addShape(p.ShapeType.rect,{x:6.8,y:y,w:5.9,h:0.66,fill:{color:FILA}});
  s.addText(k[0],{x:7.05,y:y+0.08,w:5.5,h:0.3,fontFace:LORA,bold:false,fontSize:13,color:PETROLEO});
  s.addText(k[1],{x:7.05,y:y+0.36,w:5.5,h:0.3,fontFace:POP,fontSize:10,color:GREY,lineSpacing:12});
  y+=0.75;});
footer(s,5);

// 6 — INGRESO DE CAPITAL
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Paso 3 · Ingreso de capital"); title(s,"Capitalización para posicionar al inversor");
s.addShape(p.ShapeType.rect,{x:0.6,y:2.05,w:5.9,h:2.15,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("CAPITAL SOCIAL SUGERIDO",{x:0.9,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:10.5,color:GOLD_D,charSpacing:2});
s.addText("₲ 5.000.000.000",{x:0.9,y:2.65,w:5.3,h:0.7,fontFace:LORA,bold:false,fontSize:28,color:TIERRA});
s.addText("≈ USD 834.000 al tipo de cambio de referencia (₲ 6.000 = USD 1, sujeto a variación diaria).",{x:0.9,y:3.4,w:5.3,h:0.7,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});
const kv6=[["Posiciona al inversor","Un capital robusto respalda la seriedad de la operación en Paraguay."],["Se destina a la inversión","Muchos inversores usan estos fondos, total o parcialmente, para comprar su inmueble."],["Flexible","El monto se ajusta al plan de cada inversor; la cifra sugerida es una referencia."]];
y=2.05; kv6.forEach(k=>{
  s.addShape(p.ShapeType.rect,{x:6.8,y:y,w:5.9,h:0.66,fill:{color:FILA}});
  s.addText(k[0],{x:7.05,y:y+0.08,w:5.5,h:0.3,fontFace:LORA,bold:false,fontSize:13,color:PETROLEO});
  s.addText(k[1],{x:7.05,y:y+0.36,w:5.5,h:0.3,fontFace:POP,fontSize:10,color:GREY,lineSpacing:12});
  y+=0.75;});
footer(s,6);

// 7 — CÉDULA
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Paso 4 · Cédula de identidad (opcional)"); title(s,"Radicación migratoria para los socios");
s.addText("La cédula NO es requisito para invertir — se puede operar la S.A. sin ella. Pero los socios que quieran radicarse pueden obtenerla como inversores.",{x:0.6,y:1.85,w:12,h:0.7,fontFace:POP,fontSize:13.5,color:PETROLEO,lineSpacing:19,italic:true});
const ced=[["Solo trámite de cédula","USD 2.200 – 2.500","Sin paquete societario. Varía según la nacionalidad del solicitante."],["Cédula 2 años","USD 8.000","Paquete completo con acompañamiento incluido, para 1 socio."],["Cédula 10 años","USD 10.000","Paquete completo con acompañamiento incluido, para 1 socio."]];
ced.forEach((c,i)=>{const x=0.6+i*4.05;
  s.addShape(p.ShapeType.rect,{x,y:2.8,w:3.8,h:2.85,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(c[0],{x:x+0.35,y:3.05,w:3.1,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:PETROLEO});
  s.addText(c[1],{x:x+0.35,y:3.6,w:3.1,h:0.6,fontFace:LORA,bold:false,fontSize:26,color:TIERRA});
  s.addText(c[2],{x:x+0.35,y:4.35,w:3.15,h:1.1,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});});
footer(s,7);

// 8 — PAQUETES Y COSTOS (por tipo de cliente)
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Paquetes y costos"); title(s,"Elegí según lo que necesitás");
const paq=[["Empezar a invertir","Paquete Completo","USD 6.000","Constitución de S.A., apertura de cuenta e ingreso de capital. Sin cédula."],["Invertir + residencia","Completo + Cédula 2 años","USD 8.000","El paquete completo más la cédula paraguaya (2 años) para 1 socio."],["Radicarte a largo plazo","Completo + Cédula 10 años","USD 10.000","El paquete completo más la cédula paraguaya (10 años) para 1 socio."]];
paq.forEach((c,i)=>{const x=0.6+i*4.05;
  s.addShape(p.ShapeType.rect,{x,y:2.1,w:3.8,h:2.95,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(c[0].toUpperCase(),{x:x+0.35,y:2.32,w:3.1,h:0.3,fontFace:POP,bold:true,fontSize:9.5,color:GOLD_D,charSpacing:1.5});
  s.addText(c[1],{x:x+0.35,y:2.62,w:3.1,h:0.6,fontFace:LORA,bold:false,fontSize:16,color:PETROLEO,lineSpacing:19});
  s.addText(c[2],{x:x+0.35,y:3.32,w:3.1,h:0.6,fontFace:LORA,bold:false,fontSize:24,color:TIERRA});
  s.addText(c[3],{x:x+0.35,y:4.0,w:3.15,h:0.95,fontFace:POP,fontSize:11,color:GREY,lineSpacing:15});});
// Barra mensual
s.addShape(p.ShapeType.rect,{x:0.6,y:5.35,w:12.1,h:1.0,fill:{color:PETROLEO}});
s.addText([{text:"Asesoramiento Mensual · USD 350/mes  ",options:{bold:true,color:LAPACHO}},{text:"(el más elegido) — incluye síndico, representante legal y contador. Es lo que mantiene tu S.A. operativa y te permite invertir sin cédula.",options:{color:CREMA}}],{x:0.95,y:5.35,w:11.4,h:1.0,fontFace:POP,fontSize:13,valign:"middle",lineSpacing:18});
s.addText("Solo trámite de cédula, sin paquete societario: USD 2.200 – 2.500 según nacionalidad.",{x:0.6,y:6.5,w:12,h:0.3,fontFace:POP,fontSize:9.5,color:GREY,italic:true});
footer(s,8);

// 9 — ¿POR QUÉ PARAGUAY?
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"¿Por qué Paraguay?"); title(s,"Un destino atractivo dentro del Mercosur");
const raz=[["Carga tributaria competitiva","Uno de los regímenes impositivos más bajos de la región."],["Ubicación estratégica","Posición central en el Mercosur, acceso a los mercados sudamericanos."],["Estabilidad macroeconómica","Moneda estable y reglas claras para la inversión extranjera."],["Radicación accesible","Vías migratorias diseñadas para inversores y sus socios."],["Acompañamiento integral","Un solo equipo gestiona lo legal, lo bancario y lo migratorio."],["Estructura societaria flexible","S.A. que puede ser 100% de propiedad extranjera."]];
raz.forEach((r,i)=>{const col=i%3, row=Math.floor(i/3); const x=0.6+col*4.05, yy=2.15+row*1.95;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:3.8,h:1.75,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText("✓",{x:x+0.3,y:yy+0.25,w:0.5,h:0.5,fontFace:POP,bold:true,fontSize:20,color:LAPACHO});
  s.addText(r[0],{x:x+0.85,y:yy+0.22,w:2.7,h:0.6,fontFace:LORA,bold:false,fontSize:13.5,color:PETROLEO,lineSpacing:16});
  s.addText(r[1],{x:x+0.85,y:yy+0.82,w:2.75,h:0.8,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});});
footer(s,9);

// 10 — ¿QUIÉN SOY?
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Quién soy",true); title(s,"El operador técnico y legal, no un agente tradicional",true);
s.addText("No soy un agente inmobiliario tradicional. Soy el operador técnico y legal que convierte a un extranjero en inversor inmobiliario paraguayo — de la cédula al alquiler, de punta a punta, con la mirada de 16 años construyendo en Asunción.",{x:0.6,y:1.95,w:8.1,h:1.7,fontFace:POP,fontSize:14,color:"C7CFD2",lineSpacing:22});
s.addText("“Donde otros ven una comisión, yo veo una responsabilidad que empieza antes de la compra y no termina en la firma.”",{x:0.6,y:3.9,w:8.1,h:1.2,fontFace:LORA,italic:true,fontSize:16,color:CREMA,lineSpacing:22});
// El proceso
s.addText("EL PROCESO, DE PUNTA A PUNTA",{x:0.6,y:5.4,w:8,h:0.35,fontFace:POP,bold:true,fontSize:11,color:LAPACHO,charSpacing:2});
s.addText([{text:"Cédula",options:{}},{text:"   ›   ",options:{color:LAPACHO}},{text:"Cuenta",options:{}},{text:"   ›   ",options:{color:LAPACHO}},{text:"Capital",options:{}},{text:"   ›   ",options:{color:LAPACHO}},{text:"Renta",options:{}}],{x:0.6,y:5.8,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:20,color:CREMA});
// Caja 16 años
s.addShape(p.ShapeType.rect,{x:9.1,y:1.95,w:3.6,h:4.35,fill:{color:NAVY2},line:{color:"2A4A52",width:1}});
s.addText("16",{x:9.1,y:2.6,w:3.6,h:1.2,fontFace:LORA,bold:false,fontSize:72,color:LAPACHO,align:"center"});
s.addText("AÑOS",{x:9.1,y:3.85,w:3.6,h:0.4,fontFace:POP,bold:true,fontSize:14,color:CREMA,align:"center",charSpacing:3});
s.addText("desarrollando y construyendo en el mercado paraguayo",{x:9.4,y:4.35,w:3.0,h:0.8,fontFace:POP,fontSize:12,color:"9DA8AC",align:"center",lineSpacing:16});
s.addText("Inversores de Europa · Argentina · Brasil · Chile",{x:9.35,y:5.35,w:3.1,h:0.7,fontFace:POP,fontSize:10.5,color:"C7CFD2",align:"center",lineSpacing:14});
footer(s,10,true);

// 11 — CTA
s=p.addSlide(); s.background={color:TIERRA};
s.addImage({path:ISO_INV,x:0.6,y:0.6,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.28,y:0.62,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Comencemos su ingreso\nal mercado paraguayo",{x:0.6,y:2.3,w:11,h:1.9,fontFace:LORA,bold:false,fontSize:40,color:CREMA,lineSpacing:44});
s.addText("Le acompañamos en cada paso: constitución societaria, apertura de cuenta, ingreso de capital y radicación migratoria.",{x:0.6,y:4.3,w:9,h:0.8,fontFace:POP,fontSize:14,color:"F0DDD5",lineSpacing:21});
s.addText("Juan José Castillo",{x:0.6,y:5.35,w:11,h:0.5,fontFace:LORA,bold:false,fontSize:20,color:CREMA});
s.addText("Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",{x:0.6,y:5.83,w:11,h:0.4,fontFace:POP,fontSize:13,color:"F0DDD5"});
s.addText([{text:"+595 982 853 111",options:{bold:true}},{text:"     ·     juancastillo@meridianocapital.net     ·     www.meridianocapital.net"}],{x:0.6,y:6.4,w:12,h:0.4,fontFace:POP,fontSize:13,color:CREMA});

p.writeFile({fileName:"Meridiano_Programa_Ingreso.pptx"}).then(f=>console.log("OK:",f));
