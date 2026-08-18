// Meridiano Capital — Información Completa (entregable institucional para clientes)
// Nuevo (2026-08-09). Cubre la empresa entera sin mezclar las economías de los dos
// modelos de negocio en una misma cifra (regla dura RN-01/RN-02/D-016) -- cuando
// se nombran los dos modelos, es solo para decir que existen, no sus numeros.
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", FILA="F7F4EE", LINEA="DAD2C0", GOLD_D="A87D22", KAA="45573A";
const LORA="Fraunces", POP="Poppins";
const W=13.333, H=7.5, ISO="isotipo.png", ISO_INV="isotipo_inverso.png", URB="urb_iso_claro.png";

function footer(s,n,dark){const col=dark?"9DA8AC":GREY;
  s.addImage({path:dark?ISO_INV:ISO,x:0.55,y:H-0.72,w:0.32,h:0.32});
  s.addText("Meridiano Capital · Información institucional",{x:0.95,y:H-0.72,w:7,h:0.32,fontFace:POP,fontSize:8,color:col,valign:"middle"});
  s.addText(String(n).padStart(2,"0"),{x:W-1.1,y:H-0.72,w:0.6,h:0.32,fontFace:POP,fontSize:8,color:col,align:"right",valign:"middle"});}
function eyebrow(s,t,dark){s.addText(t.toUpperCase(),{x:0.6,y:0.55,w:11,h:0.3,fontFace:POP,bold:true,fontSize:11,color:dark?LAPACHO:GOLD_D,charSpacing:3,valign:"middle"});}
function title(s,t,dark){s.addText(t,{x:0.6,y:0.9,w:12.1,h:0.95,fontFace:LORA,bold:false,fontSize:29,color:dark?CREMA:PETROLEO,lineSpacing:32});}

// 1 — PORTADA
let s=p.addSlide(); s.background={color:PETROLEO};
s.addImage({path:ISO_INV,x:0.6,y:0.55,w:0.6,h:0.6});
s.addText("MERIDIANO CAPITAL",{x:1.35,y:0.6,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:18,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("ASUNCIÓN, PARAGUAY",{x:0.65,y:2.5,w:8,h:0.35,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,charSpacing:3});
s.addText("Información institucional\npara inversores",{x:0.6,y:2.95,w:11,h:1.8,fontFace:LORA,bold:false,fontSize:42,color:CREMA,lineSpacing:46});
s.addText("Quiénes somos, cómo trabajamos y qué podés esperar de un acompañamiento de punta a punta: de la cédula al alquiler.",{x:0.65,y:4.95,w:9,h:0.9,fontFace:POP,fontSize:14,color:"C7CFD2",lineSpacing:22});
s.addText("Documento informativo — no constituye una oferta vinculante.",{x:0.65,y:6.2,w:11,h:0.4,fontFace:POP,italic:true,fontSize:13,color:"9DA8AC"});

// 2 — QUIÉNES SOMOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Quiénes somos"); title(s,"El operador técnico y legal, no un agente tradicional");
s.addText("No somos un agente inmobiliario tradicional. Somos el operador técnico y legal que convierte a un extranjero en inversor inmobiliario paraguayo — de la cédula al alquiler, de punta a punta.",{x:0.6,y:1.95,w:7.3,h:1.3,fontFace:POP,fontSize:14,color:PETROLEO,lineSpacing:22});
s.addText("“Donde otros ven una comisión, nosotros vemos una responsabilidad que empieza antes de la compra y no termina en la firma.”",{x:0.6,y:3.5,w:7.3,h:1.1,fontFace:LORA,italic:true,fontSize:15,color:TIERRA,lineSpacing:21});
s.addText("Juan José Castillo — asesor y desarrollador inmobiliario con 16 años de trayectoria técnica en construcción y evaluación de oportunidades reales, no solo intermediación.",{x:0.6,y:4.75,w:7.3,h:1.0,fontFace:POP,fontSize:12,color:GREY,lineSpacing:17});
s.addShape(p.ShapeType.rect,{x:8.3,y:1.95,w:4.4,h:4.35,fill:{color:PETROLEO}});
s.addText("16",{x:8.3,y:2.3,w:4.4,h:1.2,fontFace:LORA,bold:false,fontSize:64,color:LAPACHO,align:"center"});
s.addText("AÑOS DE TRAYECTORIA",{x:8.3,y:3.45,w:4.4,h:0.4,fontFace:POP,bold:true,fontSize:12,color:CREMA,align:"center",charSpacing:2});
s.addShape(p.ShapeType.line,{x:8.7,y:4.1,x2:11.9,y2:4.1,line:{color:"2A4A52",width:1}});
s.addText("53",{x:8.3,y:4.3,w:4.4,h:0.6,fontFace:LORA,bold:false,fontSize:26,color:CREMA,align:"center"});
s.addText("unidades en cartera propia (11 edificios)",{x:8.6,y:4.85,w:3.8,h:0.5,fontFace:POP,fontSize:10,color:"9DA8AC",align:"center",lineSpacing:13});
s.addText("Inversores de Europa · Argentina · Brasil · Chile",{x:8.5,y:5.6,w:4,h:0.6,fontFace:POP,fontSize:10.5,color:"C7CFD2",align:"center",lineSpacing:14});
footer(s,2);

// 3 — NUESTROS VALORES
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Misión y valores"); title(s,"Lo que no negociamos");
s.addText("Convertir a inversores extranjeros en propietarios e inversores inmobiliarios paraguayos, acompañándolos de punta a punta —de la cédula al alquiler— con rigor técnico y legal.",{x:0.6,y:1.9,w:12,h:0.7,fontFace:POP,italic:true,fontSize:13,color:PETROLEO,lineSpacing:19});
const val=[["1","Responsabilidad más allá de la firma","El compromiso empieza antes de la compra y no termina en el cierre."],["2","Rigor técnico y legal","Cada número y cada estructura se sostienen en datos y en la ley, nunca en promesas."],["3","Acompañamiento integral","Un solo responsable para todo el camino: lo legal, lo bancario, lo migratorio y la renta."],["4","Transparencia que gana confianza","El inversor entiende siempre en qué invierte, cuánto cuesta y qué riesgos corre."]];
val.forEach((v,i)=>{const col=i%2, row=Math.floor(i/2); const x=0.6+col*6.15, yy=2.85+row*1.95;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:5.9,h:1.75,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(v[0],{x:x+0.3,y:yy+0.2,w:0.6,h:0.6,fontFace:LORA,bold:false,fontSize:22,color:LAPACHO});
  s.addText(v[1],{x:x+1.0,y:yy+0.2,w:4.6,h:0.5,fontFace:LORA,bold:false,fontSize:14,color:PETROLEO,lineSpacing:17});
  s.addText(v[2],{x:x+1.0,y:yy+0.75,w:4.6,h:0.85,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});});
footer(s,3);

// 4 — TRAYECTORIA Y PORTFOLIO
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Trayectoria",true); title(s,"Una cartera real, no un proyecto en papel",true);
s.addText("Administramos patrimonio propio y de inversores en Asunción — no es una promesa, es una cartera operando hoy.",{x:0.6,y:1.9,w:11.5,h:0.6,fontFace:POP,fontSize:13,color:"C7CFD2",lineSpacing:19});
const stats=[["53","unidades en cartera (Cartera A)"],["11","edificios, 5 sociedades propietarias"],["35","unidades operativas hoy"],["18","en obra, entregas hasta 2029"]];
stats.forEach((st,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.75,w:2.8,h:1.9,fill:{color:NAVY2},line:{color:"2A4A52",width:1}});
  s.addText(st[0],{x:x+0.25,y:2.95,w:2.3,h:0.9,fontFace:LORA,bold:false,fontSize:38,color:LAPACHO});
  s.addText(st[1],{x:x+0.25,y:3.85,w:2.35,h:0.7,fontFace:POP,fontSize:10.5,color:CREMA,lineSpacing:14});});
s.addText("Caso real — Habitalis Mburucuyá: compra en pozo, entregado y en renta. La plusvalía del momento de compra cubrió la diferencia frente al piso de referencia — la prueba de que la mirada técnica de quien construye hace la diferencia.",{x:0.6,y:5.0,w:11.5,h:1.1,fontFace:POP,italic:true,fontSize:12,color:"9DA8AC",lineSpacing:18});
footer(s,4,true);

// 5 — CÓMO TRABAJAMOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Cómo trabajamos"); title(s,"El proceso, de punta a punta");
const pasos=[["1","Cédula Paraguaya","Requisito habilitante — opcional, puede correr en paralelo"],["2","Apertura Bancaria","Cuenta en guaraníes y dólares, con compliance de fondos"],["3","Estructura Societaria","S.A. 100% de propiedad extranjera cuando el volumen lo justifica"],["4","Selección y Renta","Elección de la unidad y gestión activa post-inversión"]];
pasos.forEach((ps,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.1,w:2.8,h:2.7,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(ps[0],{x:x+0.3,y:2.35,w:1,h:1,fontFace:LORA,bold:false,fontSize:40,color:LAPACHO});
  s.addText(ps[1],{x:x+0.3,y:3.4,w:2.35,h:0.7,fontFace:LORA,bold:false,fontSize:15,color:PETROLEO,lineSpacing:18});
  s.addText(ps[2],{x:x+0.3,y:4.05,w:2.35,h:0.7,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});
  if(i<3)s.addText("›",{x:x+2.78,y:3.0,w:0.35,h:0.5,fontFace:POP,fontSize:24,color:TIERRA,align:"center",valign:"middle"});});
s.addText("Toda la etapa se acompaña con la Red de Aliados Profesionales: abogado, escribano y contadora.",{x:0.6,y:5.15,w:12,h:0.4,fontFace:POP,italic:true,fontSize:12,color:GREY});
footer(s,5);

// 6 — DOS FORMAS DE INVERTIR (overview, sin mezclar economics)
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Dos formas de invertir"); title(s,"Elegí según tu capital y tus objetivos");
s.addShape(p.ShapeType.rect,{x:0.6,y:2.05,w:5.9,h:4.2,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("INVERSIÓN INDIVIDUAL",{x:0.9,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:11,color:GOLD_D,charSpacing:2});
s.addText("Comprás tu propia unidad",{x:0.9,y:2.65,w:5.3,h:0.5,fontFace:LORA,bold:false,fontSize:19,color:PETROLEO});
["Elegís la unidad, terminada o en pozo","La administramos: renta tradicional o temporal","Objetivo de rentabilidad neta sostenida","Ideal para 1 o pocas propiedades"].forEach((t,i)=>{
  s.addText("—",{x:0.9,y:3.35+i*0.5,w:0.3,h:0.4,fontFace:POP,color:TIERRA});
  s.addText(t,{x:1.2,y:3.35+i*0.5,w:5.0,h:0.4,fontFace:POP,fontSize:11.5,color:GREY,valign:"top"});});
s.addShape(p.ShapeType.rect,{x:6.8,y:2.05,w:5.9,h:4.2,fill:{color:PETROLEO}});
s.addText("COINVERSIÓN",{x:7.1,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:11,color:LAPACHO,charSpacing:2});
s.addText("Varios inversores, un desarrollo",{x:7.1,y:2.65,w:5.3,h:0.5,fontFace:LORA,bold:false,fontSize:19,color:CREMA});
["Ingresás a un vehículo común (S.A. o Fideicomiso)","Participás del retorno de un proyecto de desarrollo","Estructura con retorno preferente y reparto de ganancia","Ideal para tickets grandes, desde USD 200.000"].forEach((t,i)=>{
  s.addText("—",{x:7.1,y:3.35+i*0.5,w:0.3,h:0.4,fontFace:POP,color:LAPACHO});
  s.addText(t,{x:7.4,y:3.35+i*0.5,w:5.0,h:0.4,fontFace:POP,fontSize:11.5,color:"C7CFD2",valign:"top"});});
s.addText("Los detalles económicos de cada modelo se comparten en el material específico correspondiente, nunca combinados.",{x:0.6,y:6.55,w:12,h:0.3,fontFace:POP,italic:true,fontSize:9.5,color:GREY});
footer(s,6);

// 7 — GESTIÓN PATRIMONIAL POST-INVERSIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Gestión patrimonial"); title(s,"El acompañamiento no termina en el cierre");
s.addShape(p.ShapeType.rect,{x:0.6,y:2.05,w:5.9,h:3.9,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("RENTA TRADICIONAL",{x:0.9,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:11,color:GOLD_D,charSpacing:2});
s.addText("Contrato de locación de largo plazo",{x:0.9,y:2.65,w:5.3,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:PETROLEO});
s.addText("6% – 10%",{x:0.9,y:3.25,w:5.3,h:0.6,fontFace:LORA,bold:false,fontSize:30,color:TIERRA});
s.addText("rentabilidad bruta de referencia anual",{x:0.9,y:3.85,w:5.3,h:0.35,fontFace:POP,fontSize:10.5,color:GREY});
s.addText("Inquilino estable, baja intensidad operativa, gestión directa de nuestro equipo. Objetivo de rentabilidad neta de cartera: 10%.",{x:0.9,y:4.35,w:5.3,h:1.4,fontFace:POP,fontSize:11,color:GREY,lineSpacing:16});
s.addShape(p.ShapeType.rect,{x:6.8,y:2.05,w:5.9,h:3.9,fill:{color:KAA}});
s.addText("RENTA TEMPORAL · URBANNIT",{x:7.1,y:2.3,w:5.3,h:0.35,fontFace:POP,bold:true,fontSize:11,color:LAPACHO,charSpacing:2});
s.addText("Estadías cortas en zonas de alta demanda",{x:7.1,y:2.65,w:5.3,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:CREMA});
s.addText("10% – 16%+",{x:7.1,y:3.25,w:5.3,h:0.6,fontFace:LORA,bold:false,fontSize:30,color:LAPACHO});
s.addText("rentabilidad bruta de referencia anual",{x:7.1,y:3.85,w:5.3,h:0.35,fontFace:POP,fontSize:10.5,color:"C9C2B2"});
s.addText("Operada con un aliado de 20+ años en el rubro: nosotros originamos y reportamos, el aliado ejecuta la operación diaria.",{x:7.1,y:4.35,w:5.3,h:1.4,fontFace:POP,fontSize:11,color:"D8CDB8",lineSpacing:16});
footer(s,7);

// 8 — URBANNIT
s=p.addSlide(); s.background={color:KAA};
eyebrow(s,"Nuestra sub-marca",true); title(s,"Urbannit — renta temporal, gestionada por Meridiano Capital",true);
s.addText("Urbannit opera el circuito de renta temporal en alianza con un operador de 20+ años de trayectoria, con origen en Barcelona (2010). Nosotros originamos la propiedad y reportamos al inversor; el aliado ejecuta la operación diaria.",{x:0.6,y:2.0,w:8.0,h:1.3,fontFace:POP,fontSize:13.5,color:"F1E8D8",lineSpacing:20});
s.addText("Urbannit es una marca gestionada por Meridiano Capital.",{x:0.6,y:5.6,w:8,h:0.4,fontFace:POP,italic:true,fontSize:12,color:"C9C2B2"});
footer(s,8,true);

// 9 — RED DE ALIADOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Red de aliados profesionales"); title(s,"Cada etapa, respaldada por especialistas de confianza");
const aliados=[["Ab","Abogado","Constitución societaria, revisión contractual, debida diligencia"],["Es","Escribano","Escrituración y protocolización de actos societarios"],["Co","Contadora","RUC, facturación, régimen impositivo, cumplimiento fiscal"],["Op","Operador de Renta Temporal","20+ años — operación diaria del circuito de renta temporal"]];
aliados.forEach((a,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x:x+1.0,y:2.3,w:0.8,h:0.8,fill:{color:PETROLEO}});
  s.addText(a[0],{x:x+1.0,y:2.3,w:0.8,h:0.8,fontFace:LORA,bold:false,fontSize:18,color:LAPACHO,align:"center",valign:"middle"});
  s.addText(a[1],{x:x,y:3.3,w:2.8,h:0.5,fontFace:LORA,bold:false,fontSize:14,color:PETROLEO,align:"center"});
  s.addText(a[2],{x:x+0.15,y:3.85,w:2.5,h:1.0,fontFace:POP,fontSize:10,color:GREY,align:"center",lineSpacing:14});});
footer(s,9);

// 10 — COMPLIANCE Y TRANSPARENCIA
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Compliance y transparencia"); title(s,"El cumplimiento no es una carga, es parte del servicio");
s.addText("Como desarrollador e intermediario inmobiliario, somos sujeto obligado ante SEPRELAD (Res. 201/2020) y operamos con un programa formal de prevención de lavado de activos: verificación de identidad y origen de fondos para cada inversor, antes de cualquier operación.",{x:0.6,y:1.95,w:7.3,h:1.3,fontFace:POP,fontSize:13,color:PETROLEO,lineSpacing:20});
s.addText("Un programa de compliance sólido facilita el financiamiento bancario, cumple con lo que exigen los inversores extranjeros, y construye la reputación de transparencia que sostiene relaciones de largo plazo.",{x:0.6,y:3.4,w:7.3,h:1.1,fontFace:POP,italic:true,fontSize:12,color:GREY,lineSpacing:18});
s.addShape(p.ShapeType.rect,{x:8.3,y:1.95,w:4.4,h:3.55,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
["Verificación de identidad y origen de fondos","Reporte anual ante SEPRELAD","Oficial de Cumplimiento designado","Ninguna operación sin debida diligencia"].forEach((t,i)=>{
  s.addText("✓",{x:8.6,y:2.25+i*0.75,w:0.4,h:0.5,fontFace:POP,bold:true,fontSize:16,color:LAPACHO});
  s.addText(t,{x:9.05,y:2.25+i*0.75,w:3.4,h:0.6,fontFace:POP,fontSize:11,color:PETROLEO,lineSpacing:14,valign:"middle"});});
footer(s,10);

// 11 — CTA / FIRMA (Variante A)
s=p.addSlide(); s.background={color:TIERRA};
s.addImage({path:ISO_INV,x:0.6,y:0.6,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.28,y:0.62,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Hablemos de tu próxima\ninversión en Paraguay",{x:0.6,y:2.3,w:11,h:1.9,fontFace:LORA,bold:false,fontSize:40,color:CREMA,lineSpacing:44});
s.addText("Te acompañamos en cada paso: constitución societaria, apertura de cuenta, ingreso de capital, y la gestión de tu renta.",{x:0.6,y:4.3,w:9,h:0.8,fontFace:POP,fontSize:14,color:"F0DDD5",lineSpacing:21});
s.addText("Juan José Castillo",{x:0.6,y:5.35,w:11,h:0.5,fontFace:LORA,bold:false,fontSize:20,color:CREMA});
s.addText("Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",{x:0.6,y:5.83,w:11,h:0.4,fontFace:POP,fontSize:13,color:"F0DDD5"});
s.addText("+595 982 853 111     ·     juancastillo@meridianocapital.net     ·     www.meridianocapital.net",{x:0.6,y:6.4,w:12,h:0.4,fontFace:POP,fontSize:13,color:CREMA});

p.writeFile({fileName:"Meridiano_Info_Completa.pptx"}).then(f=>console.log("OK:",f));
