// Presentación Urbannit — identidad propia (Endorsed Brand de Meridiano), datos corregidos
const pptxgen=require("pptxgenjs");
const p=new pptxgen();
p.defineLayout({name:"A4",width:8.27,height:11.69}); p.layout="A4";
const KAA="45573A", KAA_D="374630", SAND="F1E8D8", CARBON="3A2E22", GOLD="C9982E", CREAM="FBF7EF", GREY="7C7264", LINE="D8CDB8";
const POP="Poppins", W=8.27, H=11.69;
const ISO="urb_iso.png", ISO_L="urb_iso_claro.png";

function wm(s,x,y,sz,onDark){const col=onDark?SAND:CARBON;s.addText([
  {text:"URBAN",options:{fontFace:POP,bold:true,fontSize:sz,color:col,charSpacing:2}},
  {text:"N",options:{fontFace:POP,bold:true,fontSize:sz,color:GOLD,charSpacing:2}},
  {text:"IT",options:{fontFace:POP,bold:true,fontSize:sz,color:col,charSpacing:2}},
],{x,y,w:5,h:0.5,valign:"middle"});}
function eyebrow(s,t,x,y,col){s.addText(t.toUpperCase(),{x,y,w:6,h:0.3,fontFace:POP,bold:true,fontSize:10,color:col||GOLD,charSpacing:3});}
function head(s,t,x,y,col){s.addText(t,{x,y,w:6.8,h:1.2,fontFace:POP,fontSize:30,color:col||CARBON,lineSpacing:34});}
function endorso(s,x,y,onDark){s.addText([{text:"gestionado por ",options:{color:onDark?"A9B0A0":GREY,italic:true}},{text:"MERIDIANO CAPITAL",options:{color:onDark?SAND:CARBON,bold:true,charSpacing:1}}],{x,y,w:5,h:0.3,fontFace:POP,fontSize:9});}
function pageHdr(s,num,title){s.addText(num+" — "+title.toUpperCase(),{x:0.6,y:0.55,w:5,h:0.3,fontFace:POP,bold:true,fontSize:9,color:GREY,charSpacing:2});
  wm(s,6.0,0.5,13,false);
  s.addShape(p.ShapeType.line,{x:0.6,y:0.95,w:7.07,h:0,line:{color:LINE,width:1}});}

// ===== 1 PORTADA =====
let s=p.addSlide(); s.background={color:KAA_D};
s.addImage({path:ISO_L,x:0.6,y:0.55,w:0.42,h:0.42});
wm(s,1.12,0.56,15,true);
s.addShape(p.ShapeType.rect,{x:5.55,y:0.5,w:2.15,h:0.5,fill:{type:"solid",color:KAA_D},line:{color:GOLD,width:0.75}});
s.addText("CONFIDENCIAL 2026",{x:5.55,y:0.5,w:2.15,h:0.5,fontFace:POP,fontSize:8,color:GOLD,align:"center",valign:"middle",charSpacing:1});
s.addText("ALQUILERES TEMPORARIOS · ASUNCIÓN",{x:0.6,y:1.15,w:6,h:0.3,fontFace:POP,fontSize:9,color:"A9B0A0",charSpacing:2});
eyebrow(s,"Para propietarios exigentes",0.6,2.3,GOLD);
s.addText([{text:"Su propiedad,\n",options:{bold:true}},{text:"trabajando",options:{italic:true,color:GOLD}},{text:"\npor usted.",options:{bold:true}}],
  {x:0.55,y:2.7,w:7,h:2.6,fontFace:POP,fontSize:46,color:SAND,lineSpacing:50});
s.addShape(p.ShapeType.line,{x:0.62,y:5.55,w:1,h:0,line:{color:GOLD,width:1.5}});
s.addText("Gestión profesional de apartamentos turísticos en Asunción. Sistema con más de 20 años de experiencia, con origen en Barcelona (2010), aplicado al mercado más rentable de Sudamérica.",
  {x:0.6,y:5.9,w:6.4,h:1.1,fontFace:POP,bold:true,fontSize:12.5,color:SAND,lineSpacing:19});
// 4 stats
const st=[["69%","OCUPACIÓN MEDIA\nMERCADO ASUNCIÓN"],["86%","HUÉSPEDES\nINTERNACIONALES"],["8–11%","RENTABILIDAD NETA\nPROPIEDADES TOP"],["Top 1%","OCUPACIÓN EN\nSUDAMÉRICA"]];
st.forEach((d,i)=>{const x=0.6+i*1.78;
  s.addText(d[0],{x,y:7.7,w:1.7,h:0.6,fontFace:POP,fontSize:26,color:GOLD});
  s.addText(d[1],{x,y:8.35,w:1.7,h:0.6,fontFace:POP,fontSize:8,color:"A9B0A0",charSpacing:1,lineSpacing:11});
  if(i<3)s.addShape(p.ShapeType.line,{x:x+1.68,y:7.75,w:0,h:0.7,line:{color:"4E5B44",width:1}});});
endorso(s,0.6,H-0.7,true);

// ===== 2 QUIÉNES SOMOS =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"02","Quiénes somos");
eyebrow(s,"Nuestra historia",0.6,1.4);
head(s,"No somos una agencia más.",0.6,1.75);
s.addShape(p.ShapeType.line,{x:0.62,y:3.1,w:0.9,h:0,line:{color:GOLD,width:1.5}});
const hist=["Empezamos en 2010, en Barcelona, cuando el mercado de apartamentos turísticos era territorio inexplorado. Aprendimos de primera mano cómo funcionan realmente los precios, la demanda y la operativa.",
"Con el tiempo entendimos algo que pocas agencias aplican: no se trata solo de generar ingresos, sino de que el propietario comprenda exactamente de dónde vienen y adónde van. La transparencia es la base de cualquier relación seria.",
"En 2025 trajimos ese sistema a Asunción — uno de los mercados más atractivos de la región, y hoy mal gestionado."];
let y=3.5; hist.forEach(t=>{s.addText(t,{x:0.6,y,w:7,h:1,fontFace:POP,fontSize:12,color:CARBON,lineSpacing:19,align:"justify"});y+=1.25;});
s.addShape(p.ShapeType.rect,{x:0.6,y:7.5,w:7.07,h:1.5,fill:{color:KAA_D}});
s.addText([{text:"Hoy aplicamos un sistema de más de 20 años de experiencia real",options:{color:GOLD,bold:true}},{text:" con un objetivo claro: maximizar la rentabilidad de su propiedad con total transparencia. No gestionamos muchas propiedades — solo aquellas que sabemos hacer genuinamente rentables.",options:{color:SAND}}],
  {x:0.95,y:7.5,w:6.4,h:1.5,fontFace:POP,fontSize:12,valign:"middle",lineSpacing:18,align:"justify"});
const yrs=[["2010","FUNDACIÓN EN BARCELONA"],["+20","AÑOS DE EXPERIENCIA"],["2025","LLEGADA A ASUNCIÓN"]];
yrs.forEach((d,i)=>{const x=0.6+i*2.4;
  s.addText(d[0],{x,y:9.5,w:2.3,h:0.6,fontFace:POP,bold:true,fontSize:26,color:KAA});
  s.addText(d[1],{x,y:10.15,w:2.3,h:0.4,fontFace:POP,fontSize:8,color:GREY,charSpacing:1});});
endorso(s,0.6,H-0.6);

// ===== 3 EL MERCADO =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"03","El mercado");
eyebrow(s,"Datos reales · Airbtics, AirROI, AirDNA 2025",0.6,1.4);
head(s,"Asunción: el mercado que pocos conocen.",0.6,1.75);
const m=[["69%","OCUPACIÓN MEDIA\nDEL MERCADO (2024–25)","Fuente: Airbtics 2025"],["$50","TARIFA MEDIA DIARIA\n(ADR) EN ASUNCIÓN","Fuente: AirDNA 2025"],["86%","HUÉSPEDES\nINTERNACIONALES","Fuente: Airbtics 2025"]];
m.forEach((d,i)=>{const x=0.6+i*2.4;
  s.addShape(p.ShapeType.rect,{x,y:3.3,w:2.25,h:2.0,fill:{color:CREAM},line:{color:LINE,width:1}});
  s.addShape(p.ShapeType.line,{x:x+0.25,y:5.2,w:0.7,h:0,line:{color:GOLD,width:1.5}});
  s.addText(d[0],{x:x+0.22,y:3.5,w:2,h:0.6,fontFace:POP,bold:true,fontSize:28,color:KAA});
  s.addText(d[1],{x:x+0.22,y:4.15,w:2,h:0.7,fontFace:POP,fontSize:8.5,color:CARBON,charSpacing:1,lineSpacing:12});
  s.addText(d[2],{x:x+0.22,y:4.85,w:2,h:0.3,fontFace:POP,italic:true,fontSize:7.5,color:GREY});});
// banda oscura posicionamiento
s.addShape(p.ShapeType.rect,{x:0.6,y:5.6,w:7.07,h:1.5,fill:{color:KAA_D}});
s.addText("POSICIONAMIENTO DE ASUNCIÓN EN SUDAMÉRICA",{x:0.85,y:5.75,w:6,h:0.3,fontFace:POP,fontSize:8,color:"A9B0A0",charSpacing:2});
const pos=[["Top 1%","REVENUE\nVS SUDAMÉRICA"],["Top 25%",""],["1.579","ANUNCIOS ACTIVOS\nEN LA PLATAFORMA"],["252","NOCHES RESERVADAS\nAL AÑO (MEDIA)"]];
pos.forEach((d,i)=>{const x=0.85+i*1.72;
  s.addText(d[0],{x,y:6.15,w:1.7,h:0.5,fontFace:POP,bold:true,fontSize:20,color:GOLD});
  s.addText(d[1],{x,y:6.62,w:1.7,h:0.4,fontFace:POP,fontSize:7,color:"A9B0A0",charSpacing:1,lineSpacing:9});});
// tabla ocupación por segmento
const seg=[["Propiedades Top 10%","88%+",0.92],["Propiedades Top 25%","76%+",0.80],["Media del mercado","53–69%",0.60],["Propiedades sin gestión","26–42%",0.34]];
let sy=7.5;
s.addText("SEGMENTO",{x:0.6,y:sy,w:3,h:0.3,fontFace:POP,fontSize:8,color:GREY,charSpacing:1});
s.addText("OCUPACIÓN",{x:4.2,y:sy,w:1.3,h:0.3,fontFace:POP,fontSize:8,color:GREY,charSpacing:1});
sy+=0.45;
seg.forEach(d=>{
  s.addText(d[0],{x:0.6,y:sy,w:3.4,h:0.35,fontFace:POP,fontSize:11,color:CARBON,valign:"middle"});
  s.addText(d[1],{x:4.2,y:sy,w:1.3,h:0.35,fontFace:POP,bold:true,fontSize:11,color:CARBON,valign:"middle"});
  s.addShape(p.ShapeType.rect,{x:5.6,y:sy+0.08,w:2.0*d[2],h:0.16,fill:{color:d[2]>0.5?KAA:(d[2]>0.4?GOLD:"B5654D")}});
  s.addShape(p.ShapeType.line,{x:0.6,y:sy+0.42,w:7.07,h:0,line:{color:LINE,width:0.5}});
  sy+=0.52;});
s.addText("La diferencia entre el 26% y el 88% de ocupación no es el mercado. Es la gestión.",{x:0.6,y:sy+0.05,w:7,h:0.3,fontFace:POP,italic:true,fontSize:10,color:KAA});
endorso(s,0.6,H-0.5);

// ===== 4 RENTABILIDAD =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"04","Rentabilidad");
eyebrow(s,"Lo que su propiedad puede generar",0.6,1.4);
head(s,"Números reales, no promesas.",0.6,1.75);
s.addText("El alquiler turístico bien gestionado en Asunción puede generar entre un 50% y 80% más de ingresos que el alquiler tradicional. Estos son los rangos que registra el mercado (datos independientes 2024–2025).",
  {x:0.6,y:3.05,w:7,h:0.9,fontFace:POP,fontSize:11.5,color:CARBON,lineSpacing:18});
// dos paneles
s.addShape(p.ShapeType.rect,{x:0.6,y:4.2,w:3.45,h:2.6,fill:{color:CREAM},line:{color:LINE,width:1}});
s.addText("ALQUILER TRADICIONAL",{x:0.85,y:4.4,w:3,h:0.3,fontFace:POP,fontSize:8.5,color:GREY,charSpacing:1});
s.addText("5–7%",{x:0.82,y:4.75,w:3,h:0.7,fontFace:POP,bold:true,fontSize:34,color:GREY});
s.addText("Rentabilidad NETA anual",{x:0.85,y:5.5,w:3,h:0.3,fontFace:POP,fontSize:9,color:GREY});
s.addText("Contrato fijo · tarifa estática\nSin flexibilidad · gestión propia",{x:0.85,y:5.85,w:3,h:0.7,fontFace:POP,fontSize:9,color:GREY,lineSpacing:14});
s.addShape(p.ShapeType.rect,{x:4.22,y:4.2,w:3.45,h:2.6,fill:{color:KAA_D}});
s.addText("ALQUILER TURÍSTICO GESTIONADO",{x:4.47,y:4.4,w:3,h:0.3,fontFace:POP,fontSize:8.5,color:GOLD,charSpacing:1});
s.addText("8–11%",{x:4.44,y:4.75,w:3,h:0.7,fontFace:POP,bold:true,fontSize:34,color:GOLD});
s.addText("Rentabilidad NETA anual",{x:4.47,y:5.5,w:3,h:0.3,fontFace:POP,fontSize:9,color:SAND});
s.addText("Precios dinámicos · máxima ocupación\nFlexibilidad · gestión profesional 360°",{x:4.47,y:5.85,w:3,h:0.7,fontFace:POP,fontSize:9,color:SAND,lineSpacing:14});
// caso real
s.addShape(p.ShapeType.rect,{x:0.6,y:7.1,w:7.07,h:1.8,fill:{color:CREAM}});
const cr=[["$9.000","INGRESOS NETOS ANUALES\nCASO REAL DOCUMENTADO"],["9,3%","RENTABILIDAD NETA\nCON GESTIÓN OPTIMIZADA"],["92,8%","OCUPACIÓN ALCANZABLE\nCON MÉTODO PROFESIONAL"]];
cr.forEach((d,i)=>{const x=0.95+i*2.3;
  s.addText(d[0],{x,y:7.35,w:2.2,h:0.6,fontFace:POP,bold:true,fontSize:24,color:KAA});
  s.addText(d[1],{x,y:8.0,w:2.2,h:0.6,fontFace:POP,fontSize:8,color:GREY,charSpacing:1,lineSpacing:11});});
s.addText("* Datos basados en Airbtics, AirROI, AirDNA y ProInvest.com.py (2024–2025). La rentabilidad varía según ubicación, tamaño y equipamiento. Evaluamos su propiedad de forma personalizada.",
  {x:0.6,y:9.1,w:7.07,h:0.6,fontFace:POP,italic:true,fontSize:8,color:GREY,lineSpacing:12});
endorso(s,0.6,H-0.55);

// ===== 5 METODOLOGÍA =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"05","Metodología");
eyebrow(s,"Nuestro enfoque",0.6,1.4);
head(s,"Leemos el mercado en tiempo real.",0.6,1.75);
s.addText("Nuestro trabajo no es publicar un apartamento y esperar reservas. Es entender cómo se comporta el mercado cada semana y decidir con datos, no con intuición.",
  {x:0.6,y:3.0,w:7,h:0.7,fontFace:POP,fontSize:11.5,color:CARBON,lineSpacing:18});
const met=[["Análisis por zona","Monitorizamos precios y demanda en Villa Morra, Recoleta, Las Mercedes y zonas corporativas."],
["Precios dinámicos","Ajustamos tarifas según temporada, eventos y competencia. Julio–agosto son los meses de mayor demanda."],
["Posicionamiento competitivo","La calidad de los anuncios en Asunción es baja. Con fotografía profesional y copy optimizado, su propiedad destaca."],
["Mercado internacional","El 86% de los huéspedes son internacionales. Optimizamos para captar viajeros de negocios y turismo."]];
met.forEach((d,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*3.62,yy=4.0+row*2.1;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:3.45,h:1.9,fill:{color:CREAM},line:{color:LINE,width:1}});
  s.addShape(p.ShapeType.rect,{x:x+0.3,y:yy+0.3,w:0.18,h:0.18,fill:{color:GOLD}});
  s.addText(d[0],{x:x+0.65,y:yy+0.22,w:2.6,h:0.4,fontFace:POP,bold:true,fontSize:13,color:CARBON});
  s.addText(d[1],{x:x+0.3,y:yy+0.75,w:2.9,h:1.0,fontFace:POP,fontSize:9.5,color:GREY,lineSpacing:14});});
s.addShape(p.ShapeType.rect,{x:0.6,y:8.4,w:7.07,h:1.3,fill:{color:KAA_D}});
s.addText([{text:"Esto nos permite mantener cada propiedad en el ",options:{color:SAND,italic:true}},{text:"rango alto del mercado",options:{color:GOLD,italic:true}},{text:" — no como excepción, sino de forma consistente y medible.",options:{color:SAND,italic:true}}],
  {x:0.95,y:8.4,w:6.4,h:1.3,fontFace:POP,fontSize:12.5,valign:"middle",lineSpacing:18});
endorso(s,0.6,H-0.5);

// ===== 6 TRANSPARENCIA =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"06","Transparencia");
eyebrow(s,"Control total para el propietario",0.6,1.4);
head(s,"Sin sorpresas. Sin letra pequeña.",0.6,1.75);
const tr=[["Ingresos claros","Ve cada reserva, cada noche y cuánto genera en tiempo real. Sin agregados confusos ni cifras redondeadas."],
["Gastos detallados","Cada coste desglosado — limpieza, mantenimiento, plataformas. Sin costes ocultos ni sorpresas a fin de mes."],
["Reporting mensual","Informe mensual con ocupación, tarifa media, ingresos brutos y netos. Información que realmente le sirve."],
["Liquidación puntual","Sus ingresos transferidos cada mes, con el resumen completo del período. Sin retrasos ni explicaciones vagas."]];
tr.forEach((d,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*3.62,yy=3.3+row*2.3;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:3.45,h:2.1,fill:{color:CREAM},line:{color:LINE,width:1}});
  s.addShape(p.ShapeType.line,{x:x+0.3,y:yy+0.35,w:0.4,h:0,line:{color:GOLD,width:2}});
  s.addText(d[0],{x:x+0.3,y:yy+0.5,w:2.9,h:0.4,fontFace:POP,bold:true,fontSize:14,color:CARBON});
  s.addText(d[1],{x:x+0.3,y:yy+1.0,w:2.9,h:1.0,fontFace:POP,fontSize:9.5,color:GREY,lineSpacing:14});});
s.addShape(p.ShapeType.rect,{x:0.6,y:8.2,w:7.07,h:1.1,fill:{color:CREAM}});
s.addText("Sabe exactamente cómo está funcionando su propiedad en todo momento. Eso no es un servicio — es una obligación.",
  {x:0.9,y:8.2,w:6.4,h:1.1,fontFace:POP,italic:true,fontSize:12.5,color:KAA,valign:"middle",align:"center",lineSpacing:18});
endorso(s,0.6,H-0.5);

// ===== 7 POR QUÉ NOSOTROS =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"07","Por qué nosotros");
eyebrow(s,"La diferencia que importa",0.6,1.4);
head(s,"Menos propiedades. Más atención.",0.6,1.75);
s.addText("EL PROBLEMA HABITUAL",{x:0.6,y:3.1,w:3.4,h:0.3,fontFace:POP,bold:true,fontSize:9,color:"B5654D",charSpacing:1});
s.addText("NUESTRO ENFOQUE",{x:4.25,y:3.1,w:3.4,h:0.3,fontFace:POP,bold:true,fontSize:9,color:KAA,charSpacing:1});
const prob=["Agencias que gestionan cientos de propiedades sin diferenciación. La suya es un número más.","Falta de claridad en los números: no sabe si su propiedad rinde bien o mal.","Comunicación escasa. Solo sabe algo cuando sale mal.","Fotografías de baja calidad y anuncios sin optimizar. Ocupación del 26–42%.","Tarifas fijas que no se adaptan a la demanda real."];
const enf=["Cartera limitada de propiedades seleccionadas. Solo las que sabemos hacer rentables.","Reporting mensual detallado. Usted entiende de dónde vienen sus ingresos.","Contacto directo con el gestor de su propiedad. No un call center.","Fotografía profesional, SEO y anuncios optimizados en todas las plataformas.","Precios dinámicos que maximizan el ingreso sin sacrificar ocupación."];
let py=3.55;
prob.forEach((t,i)=>{
  s.addText("•",{x:0.6,y:py,w:0.25,h:0.5,fontFace:POP,fontSize:11,color:"B5654D"});
  s.addText(t,{x:0.85,y:py,w:3.1,h:0.9,fontFace:POP,fontSize:9.5,color:GREY,lineSpacing:13});
  s.addText("•",{x:4.25,y:py,w:0.25,h:0.5,fontFace:POP,fontSize:11,color:KAA});
  s.addText(enf[i],{x:4.5,y:py,w:3.1,h:0.9,fontFace:POP,fontSize:9.5,color:CARBON,lineSpacing:13});
  py+=1.15;});
endorso(s,0.6,H-0.5);

// ===== 8 SERVICIO 360 =====
s=p.addSlide(); s.background={color:SAND};
pageHdr(s,"08","Nuestro servicio");
eyebrow(s,"Gestión 360°",0.6,1.4);
head(s,"Nos encargamos de absolutamente todo.",0.6,1.75);
const serv=[["Fotografía y listing","Sesión fotográfica, descripción optimizada ES/EN y posicionamiento en Airbnb, Booking y plataformas."],
["Optimización de precios","Sistema de precios dinámicos ajustado semanalmente según demanda, estacionalidad y competencia."],
["Gestión de huéspedes","Atención 24/7, check-in y check-out coordinados, resolución de incidencias. Rating y reputación cuidados."],
["Limpieza y mantenimiento","Protocolo de limpieza profesional entre estancias. Control del inmueble y pequeñas reparaciones."],
["Análisis y reporting","Informe mensual con ocupación, ADR, ingresos brutos y netos, y comparativa de mercado."],
["Selección de huéspedes","Verificación y cribado de reservas. Priorizamos perfiles de alta calidad para proteger su propiedad."]];
serv.forEach((d,i)=>{const col=i%2,row=Math.floor(i/3);
  // 2 cols x 3 rows
  const x=0.6+ (i%2)*3.62, yy=3.25 + Math.floor(i/2)*1.55;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:3.45,h:1.4,fill:{color:CREAM},line:{color:LINE,width:1}});
  s.addShape(p.ShapeType.rect,{x:x+0.28,y:yy+0.28,w:0.16,h:0.16,fill:{color:GOLD}});
  s.addText(d[0],{x:x+0.6,y:yy+0.2,w:2.7,h:0.35,fontFace:POP,bold:true,fontSize:12,color:CARBON});
  s.addText(d[1],{x:x+0.28,y:yy+0.62,w:2.95,h:0.7,fontFace:POP,fontSize:8.5,color:GREY,lineSpacing:12});});
s.addShape(p.ShapeType.rect,{x:0.6,y:9.1,w:7.07,h:1.2,fill:{color:KAA_D}});
s.addText([{text:"Usted solo hace una cosa: ",options:{color:SAND,italic:true}},{text:"recibir sus ingresos.",options:{color:GOLD,bold:true}}],
  {x:0.9,y:9.1,w:6.4,h:1.2,fontFace:POP,fontSize:15,valign:"middle"});
endorso(s,0.6,H-0.45);

// ===== 9 CONTACTO =====
s=p.addSlide(); s.background={color:CARBON};
s.addImage({path:ISO_L,x:0.6,y:0.6,w:0.4,h:0.4});
wm(s,1.08,0.6,13,true);
s.addText("ASUNCIÓN",{x:3.0,y:0.62,w:3,h:0.35,fontFace:POP,fontSize:9,color:GOLD,charSpacing:2,valign:"middle"});
s.addText([{text:"Evaluamos\nsu propiedad\n",options:{bold:true}},{text:"sin compromiso.",options:{italic:true,color:GOLD}}],
  {x:0.55,y:3.2,w:7,h:2.6,fontFace:POP,fontSize:40,color:SAND,lineSpacing:46});
s.addText("Le damos una visión honesta y documentada del potencial real de su inmueble. Sin promesas infladas. Solo datos. Solo lo que su propiedad puede generar con una gestión profesional.",
  {x:0.6,y:5.9,w:5.6,h:1,fontFace:POP,fontSize:11.5,color:"C7C0B4",lineSpacing:18});
s.addText("EMAIL",{x:0.6,y:7.3,w:3,h:0.3,fontFace:POP,fontSize:9,color:GOLD,charSpacing:2});
s.addText("urbannit@meridianocapital.net",{x:0.6,y:7.6,w:5,h:0.4,fontFace:POP,fontSize:15,color:SAND});
s.addText("WHATSAPP",{x:0.6,y:8.2,w:3,h:0.3,fontFace:POP,fontSize:9,color:GOLD,charSpacing:2});
s.addText("+595 982 853 111",{x:0.6,y:8.5,w:5,h:0.4,fontFace:POP,fontSize:15,color:SAND});
s.addText("Solo trabajamos con propiedades que sabemos hacer genuinamente rentables. Si la suya es una de ellas, lo sabremos desde la primera conversación.",
  {x:0.6,y:9.7,w:6.6,h:0.7,fontFace:POP,italic:true,fontSize:10,color:"9A9284",lineSpacing:15});
endorso(s,0.6,H-0.7,true);

p.writeFile({fileName:"Urbannit_Presentacion.pptx"}).then(f=>console.log("OK:",f));
