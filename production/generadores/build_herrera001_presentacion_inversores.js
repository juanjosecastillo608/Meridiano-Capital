// Presentación simplificada para inversores — Caso HERRERA-001 (§25 del prompt maestro)
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", FILA="F7F4EE", LINEA="DAD2C0", GOLD_D="A87D22", VERDE="2E5C3E";
const LORA="Fraunces", POP="Poppins";
const W=13.333, H=7.5, ISO="isotipo.png", ISO_INV="isotipo_inverso.png";

function footer(s,n,dark){const col=dark?"9DA8AC":GREY;
  s.addImage({path:dark?ISO_INV:ISO,x:0.55,y:H-0.72,w:0.32,h:0.32});
  s.addText("Meridiano Capital · Herrera-001 · Confidencial",{x:0.95,y:H-0.72,w:8,h:0.32,fontFace:POP,fontSize:8,color:col,valign:"middle"});
  s.addText(String(n).padStart(2,"0"),{x:W-1.1,y:H-0.72,w:0.6,h:0.32,fontFace:POP,fontSize:8,color:col,align:"right",valign:"middle"});}
function eyebrow(s,t,dark){s.addText(t.toUpperCase(),{x:0.6,y:0.55,w:11.5,h:0.3,fontFace:POP,bold:true,fontSize:11,color:dark?LAPACHO:GOLD_D,charSpacing:3,valign:"middle"});}
function title(s,t,dark,sz){s.addText(t,{x:0.6,y:0.9,w:12.1,h:0.95,fontFace:LORA,bold:false,fontSize:sz||29,color:dark?CREMA:PETROLEO,lineSpacing:(sz||29)+3});}
function twoCards(s,arr,y,h){arr.forEach((c,i)=>{const x=0.6+i*6.15;
  s.addShape(p.ShapeType.rect,{x,y,w:5.9,h,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(c[0],{x:x+0.4,y:y+0.25,w:5.1,h:0.5,fontFace:LORA,bold:false,fontSize:19,color:PETROLEO});
  if(c[1])s.addText(c[1],{x:x+0.4,y:y+0.75,w:5.1,h:0.4,fontFace:POP,bold:true,fontSize:12.5,color:TIERRA});
  const items=c[2].map((t,j)=>({text:t,options:{bullet:{indent:15},breakLine:j<c[2].length-1,paraSpaceAfter:8}}));
  s.addText(items,{x:x+0.45,y:y+(c[1]?1.25:0.85),w:5.0,h:h-1.4,fontFace:POP,fontSize:12.5,color:PETROLEO,lineSpacing:17});});}

// 1 — PORTADA
let s=p.addSlide(); s.background={color:PETROLEO};
s.addImage({path:ISO_INV,x:0.6,y:0.55,w:0.6,h:0.6});
s.addText("MERIDIANO CAPITAL",{x:1.35,y:0.6,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:18,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("ASUNCIÓN, PARAGUAY · OPORTUNIDAD DE INVERSIÓN",{x:0.65,y:2.4,w:9,h:0.35,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,charSpacing:2});
s.addText("Edificio\nBarrio Herrera",{x:0.6,y:2.85,w:11,h:1.8,fontFace:LORA,bold:false,fontSize:46,color:CREMA,lineSpacing:50});
s.addText("Adquisición y terminación de un edificio residencial al 73,5% de avance, en una de las zonas de mayor demanda de Asunción.",{x:0.65,y:4.9,w:9.5,h:0.9,fontFace:POP,fontSize:14,color:"C7CFD2",lineSpacing:22});
s.addShape(p.ShapeType.rect,{x:0.65,y:6.0,w:3.4,h:0.55,fill:{color:NAVY2},line:{color:LAPACHO,width:1}});
s.addText("NEGOCIAR / CONDICIONAR",{x:0.65,y:6.0,w:3.4,h:0.55,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,align:"center",valign:"middle"});
s.addText("Documento preliminar para inversores calificados — no constituye una oferta vinculante.",{x:0.65,y:6.85,w:11,h:0.4,fontFace:POP,italic:true,fontSize:11,color:"9DA8AC"});

// 2 — POR QUÉ BARRIO HERRERA
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"La zona"); title(s,"Por qué Barrio Herrera");
const st=[["469 m²","Terreno — esquina Concejal Vargas y 4 de Julio"],[">20%/año","Plusvalía real de la zona, confirmada por Meridiano"],["73,5%","De la estructura ya construida — menos riesgo, menos tiempo"],["12 meses","Plazo de obra para terminar el edificio"]];
st.forEach((d,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.1,w:2.8,h:2.9,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(d[0],{x:x+0.2,y:2.45,w:2.45,h:1.05,fontFace:LORA,bold:false,fontSize:d[0].length>7?22:29,color:TIERRA,valign:"middle"});
  s.addText(d[1],{x:x+0.2,y:3.55,w:2.45,h:1.3,fontFace:POP,fontSize:12,color:GREY,lineSpacing:17});});
s.addText("Barrio Herrera es una zona residencial consolidada, cercana a los principales centros comerciales de Asunción sin estar en medio del tránsito — con demanda real y confirmada para departamentos amoblados de todas las tipologías.",{x:0.6,y:5.4,w:12,h:1,fontFace:POP,fontSize:14,color:PETROLEO,italic:true,lineSpacing:22});
footer(s,2);

// 3 — EL ACTIVO
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El activo"); title(s,"Un edificio con la estructura ya de pie");
s.addText("Comprar un edificio parcialmente construido, en vez de un terreno vacío, elimina buena parte del riesgo y el tiempo de una obra desde cero — sin pagar de más por eso.",{x:0.6,y:1.85,w:12,h:0.8,fontFace:POP,fontSize:15,color:PETROLEO,lineSpacing:23});
twoCards(s,[
  ["El edificio hoy",null,["73,5% de la estructura de hormigón ya construida","Zonificación AR2-B — permiso municipal confirmado para un piso adicional (de 6 a 7 plantas)","Título y titularidad del vendedor verificados y en orden"],
  ],
  ["El comparable directo",null,["Filum Herrera (Century 21), mismo barrio, entrega dic. 2026","1 dormitorio 38m² = USD 70.300 (USD 1.850/m²)","2 dormitorios 77m² = USD 142.500 (USD 1.851/m²)","Confirma que la zona sostiene el rango de precio del proyecto"],
  ],
],2.9,3.3);
footer(s,3);

// 4 — LA OPORTUNIDAD (3 diseños)
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"La oportunidad"); title(s,"Tres formas de terminar el edificio");
const ang=[["Ángulo 1","Tal cual","Terminar el edificio exactamente como está diseñado hoy — 21 unidades. Menor riesgo de ejecución."],["Ángulo 3","Fachada + tipologías chicas","Nueva fachada y un mix más parejo de unidades más pequeñas — 29 unidades, mismo edificio."],["Ángulo 2 — Recomendado","+ Piso adicional","Suma un 7º piso, ya con permiso municipal — 39 unidades. El mayor margen y el costo por m² más bajo."]];
ang.forEach((a,i)=>{const x=0.6+i*4.05; const rec=i===2;
  s.addShape(p.ShapeType.rect,{x,y:2.2,w:3.8,h:3.9,fill:{color:rec?PETROLEO:"FFFFFF"},line:{color:rec?LAPACHO:LINEA,width:rec?2:1}});
  s.addText(a[0],{x:x+0.3,y:2.45,w:3.2,h:0.5,fontFace:POP,bold:true,fontSize:12,color:rec?LAPACHO:TIERRA,charSpacing:1});
  s.addText(a[1],{x:x+0.3,y:2.95,w:3.2,h:0.6,fontFace:LORA,bold:false,fontSize:19,color:rec?CREMA:PETROLEO});
  s.addText(a[2],{x:x+0.3,y:3.65,w:3.25,h:2.3,fontFace:POP,fontSize:12,color:rec?"C7CFD2":GREY,lineSpacing:17});});
footer(s,4);

// 5 — LOS NÚMEROS (Ángulo 2)
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Los números",true); title(s,"Ángulo 2 — el escenario recomendado",true);
const nums=[["USD 3.185.640","Inversión Total"],["USD 4.424.700 – 4.749.150","Ingresos totales proyectados"],["USD 784.541 – 1.091.147","Margen final, neto de comisión e IVA"],["24,6% – 34,3%","ROI sobre la Inversión Total"]];
nums.forEach((n,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.2,w:2.8,h:3.4,fill:{color:NAVY2},line:{color:"2A4A52",width:1}});
  s.addText(n[0],{x:x+0.2,y:2.5,w:2.45,h:1.7,fontFace:LORA,bold:false,fontSize:n[0].length>14?16:24,color:LAPACHO,valign:"middle",lineSpacing:n[0].length>14?18:26});
  s.addText(n[1],{x:x+0.2,y:4.35,w:2.45,h:1,fontFace:POP,fontSize:12,color:"C7CFD2",lineSpacing:16});});
s.addText("Cifras verificadas con el costo de construcción definitivo, comisión de venta e IVA del desarrollador ya descontados. Margen positivo en todo el rango de precio de venta analizado.",{x:0.6,y:6.05,w:12,h:0.7,fontFace:POP,italic:true,fontSize:12,color:"9DA8AC",lineSpacing:17});
footer(s,5,true);

// 6 — ESTRATEGIA VENTA/RETENCIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Estrategia"); title(s,"No todo se vende — parte se retiene y renta");
s.addText("Una porción de las unidades se vende para financiar la obra y capturar ganancia inmediata. El resto se retiene y se alquila — con un retorno de renta más alto del que obtendría un comprador individual, porque el costo de entrada de Meridiano es más bajo.",{x:0.6,y:1.85,w:12,h:1,fontFace:POP,fontSize:14,color:PETROLEO,lineSpacing:22});
const esc=[["Venta mínima + retención","15,0%/año","Se vende solo lo necesario para financiar la obra; el resto se retiene y alquila de forma indefinida."],["Venta agresiva (100%)","24,3%/año","Se liquida la totalidad del proyecto apenas está disponible para la venta."],["Venta mínima + retención 2 años","33,4%/año","Se retiene, se alquila, y se vende después de 2 años capturando la plusvalía de zona — mayor retorno, con más riesgo de mercado."]];
esc.forEach((e,i)=>{const x=0.6+i*4.05; const best=i===2;
  s.addShape(p.ShapeType.rect,{x,y:3.15,w:3.8,h:3.0,fill:{color:best?PETROLEO:"FFFFFF"},line:{color:best?LAPACHO:LINEA,width:best?2:1}});
  s.addText(e[0],{x:x+0.3,y:3.4,w:3.2,h:0.7,fontFace:LORA,bold:false,fontSize:15,color:best?CREMA:PETROLEO,lineSpacing:17});
  s.addText(e[1],{x:x+0.3,y:4.1,w:3.2,h:0.6,fontFace:LORA,bold:false,fontSize:24,color:best?LAPACHO:TIERRA});
  s.addText(e[2],{x:x+0.3,y:4.75,w:3.25,h:1.3,fontFace:POP,fontSize:11,color:best?"C7CFD2":GREY,lineSpacing:15});});
footer(s,6);

// 7 — ESTRUCTURA DE LA INVERSIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Estructura de la inversión"); title(s,"Cómo se financia y se administra el proyecto");
twoCards(s,[
  ["Vehículo y capital",null,["Sociedad Anónima entre 2-3 socios","100% fondos propios — sin deuda bancaria, sin fideicomiso","Capital propio disponible durante toda la obra, sin depender solo de las ventas"],],
  ["Comercialización",null,["Comisión de venta: 5,5% del total de la venta","Financiamiento del comprador: 20% entrega + cuotas durante obra + saldo contra la entrega","Régimen tributario del desarrollador confirmado: 10% IVA + 10% impuesto a la renta"],],
],2.2,3.6);
footer(s,7);

// 8 — CRONOGRAMA
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Cronograma"); title(s,"12 meses de obra, con ventas desde el mes 4");
const crono=[["Mes 1","Cierre de la operación e inicio de obra"],["Meses 2–3","Continúa la obra — se recupera la confianza del mercado tras el parate previo"],["Mes 4","Arranca la comercialización — lanzamiento"],["Meses 5–11","Obra en curso, ventas durante obra"],["Mes 12","Finalización de la obra"],["Mes 13","Entrega de las unidades vendidas"]];
crono.forEach((c,i)=>{const x=0.6+i*2.05;
  s.addShape(p.ShapeType.rect,{x,y:2.6,w:1.85,h:3.1,fill:{color:i===2||i===5?PETROLEO:"FFFFFF"},line:{color:i===2||i===5?LAPACHO:LINEA,width:1}});
  s.addText(c[0],{x:x+0.15,y:2.8,w:1.55,h:0.5,fontFace:LORA,bold:false,fontSize:15,color:i===2||i===5?LAPACHO:TIERRA});
  s.addText(c[1],{x:x+0.15,y:3.35,w:1.6,h:2.2,fontFace:POP,fontSize:10,color:i===2||i===5?"C7CFD2":GREY,lineSpacing:14});});
footer(s,8);

// 9 — RIESGOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Consideraciones de riesgo"); title(s,"Lo que todo inversor debe saber");
const ri=["El proyecto ya está en negociación condicionada a un único punto pendiente: la opinión estructural profesional sobre si el edificio soporta el piso adicional sin refuerzo mayor.","La identidad del vendedor y el título de la propiedad ya fueron verificados y están en orden.","Un análisis de mercado de terreno (AMC de un tercero) sugería un valor de terreno vacío menor al asignado dentro del precio de compra — la diferencia se explica por el valor de una construcción preexistente en el lote más su demolición (no hay lotes vacíos en la zona); no cambia el precio total ni el margen del proyecto.","Toda inversión en desarrollo está sujeta a riesgos de demora de obra y variación de costos de construcción.","Las condiciones de mercado al momento de vender o alquilar pueden diferir de las proyectadas en este documento.","Las cifras de retorno presentadas son ilustrativas y no constituyen garantía de rentabilidad — se recomienda evaluar la oportunidad con asesoría propia."].map((t,j)=>({text:t,options:{bullet:{indent:18},breakLine:j<5,paraSpaceAfter:12}}));
s.addText(ri,{x:0.7,y:2.2,w:11.9,h:4,fontFace:POP,fontSize:14,color:PETROLEO,lineSpacing:20});
footer(s,9);

// 10 — CIERRE
s=p.addSlide(); s.background={color:TIERRA};
s.addImage({path:ISO_INV,x:0.6,y:0.6,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.28,y:0.62,w:8,h:0.5,fontFace:LORA,bold:false,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Sumate al desarrollo del\nEdificio Barrio Herrera",{x:0.6,y:2.3,w:11,h:1.9,fontFace:LORA,bold:false,fontSize:38,color:CREMA,lineSpacing:44});
s.addText("Juan José Castillo",{x:0.6,y:4.7,w:11,h:0.5,fontFace:LORA,bold:false,fontSize:20,color:CREMA});
s.addText("Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",{x:0.6,y:5.2,w:11,h:0.4,fontFace:POP,fontSize:13,color:"F0DDD5"});
s.addText("+595 982 853 111     ·     juancastillo@meridianocapital.net     ·     www.meridianocapital.net",{x:0.6,y:5.75,w:12,h:0.4,fontFace:POP,fontSize:13,color:CREMA});
s.addText("Documento preliminar y no vinculante. Sujeto a confirmación de la opinión estructural pendiente y a los términos finales del boleto de compraventa.",{x:0.6,y:6.7,w:12,h:0.5,fontFace:POP,fontSize:9.5,color:"F0DDD5",italic:true});

const outDir = __dirname + "/../../contracts/cases/HERRERA-001/entregables";
const fs = require("fs");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
p.writeFile({fileName:outDir+"/HERRERA-001_Presentacion_Inversores.pptx"}).then(f=>console.log("OK:",f));
