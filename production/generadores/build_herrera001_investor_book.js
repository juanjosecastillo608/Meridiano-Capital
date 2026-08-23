// HERRERA-001 — Investor Book visual (Documento 02 del set de 6 entregables)
// "Investor Sales & Investment Book" — combina análisis financiero con activos visuales REALES
// (brochure del desarrollador original + fotos reales de obra, julio 2026). Ningún render fue
// generado por IA para este documento — ver contracts/cases/HERRERA-001/44-auditoria-visual-y-assets-reales.md
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", FILA="F7F4EE", LINEA="DAD2C0", GOLD_D="A87D22", VERDE="2E5C3E", VERDE_F="E7EFE9", ROJO="9C3B2E", ROJO_F="F5E6E2", AMBAR="A87D22", AMBAR_F="F6EEDD";
const LORA="Fraunces", POP="Poppins";
const W=13.333, H=7.5, ISO="isotipo.png", ISO_INV="isotipo_inverso.png";
const AH = __dirname + "/assets-herrera001";
const BR = AH + "/brochure/";
const FO = AH + "/fotos-obra/";
const QB = AH + "/qubo-referencia/";

// ---------- Fuente unica de verdad: dev_engine (D-079) ----------
// Generado por production/app/backend/dev_engine/exportar_herrera_completo.py --
// validado 6/6 dentro de 0,05% de tolerancia contra el caso real. Nunca tipear
// estos numeros a mano de nuevo (S64 del prompt maestro "Development Cost &
// Financial Engine"): si cambia un supuesto, correr el exportador y regenerar.
const ANGULOS = JSON.parse(fs.readFileSync(__dirname + "/../../contracts/cases/HERRERA-001/entregables/HERRERA-001_dev_engine_3angulos.json", "utf-8")).angulos;
function fmt0(n){ return Math.round(n).toLocaleString("es-PY"); }
function fmt2(n){ return n.toLocaleString("es-PY",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtP1(n){ return n.toLocaleString("es-PY",{minimumFractionDigits:1,maximumFractionDigits:1})+"%"; }
function medio(lo,hi){ return (lo+hi)/2; }

let n = 0;
function footer(s,dark){n++;const col=dark?"9DA8AC":GREY;
  s.addImage({path:dark?ISO_INV:ISO,x:0.55,y:H-0.72,w:0.32,h:0.32});
  s.addText("Meridiano Capital · Herrera-001 · Investor Book · Confidencial",{x:0.95,y:H-0.72,w:8,h:0.32,fontFace:POP,fontSize:8,color:col,valign:"middle"});
  s.addText(String(n).padStart(2,"0"),{x:W-1.1,y:H-0.72,w:0.6,h:0.32,fontFace:POP,fontSize:8,color:col,align:"right",valign:"middle"});}
function eyebrow(s,t,dark){s.addText(t.toUpperCase(),{x:0.6,y:0.5,w:11.5,h:0.3,fontFace:POP,bold:true,fontSize:11,color:dark?LAPACHO:GOLD_D,charSpacing:3,valign:"middle"});}
function title(s,t,dark,sz){s.addText(t,{x:0.6,y:0.82,w:12.1,h:0.85,fontFace:LORA,bold:false,fontSize:sz||26,color:dark?CREMA:PETROLEO,lineSpacing:(sz||26)+3});}
function tag(s,t,x,y,w,kind){ // kind: 'real' | 'render' | 'plan'
  const c = kind==="real" ? VERDE : (kind==="render" ? GOLD_D : TIERRA);
  const cf = kind==="real" ? VERDE_F : (kind==="render" ? AMBAR_F : "F5E6E2");
  s.addShape(p.ShapeType.rect,{x,y,w,h:0.32,fill:{color:cf},line:{color:c,width:0.75}});
  s.addText(t,{x,y,w,h:0.32,fontFace:POP,bold:true,fontSize:8.5,color:c,align:"center",valign:"middle",charSpacing:0.5});}
function table(s,headers,rows,x,y,w,colW,opts){
  const hd = headers.map(h=>({text:h,options:{bold:true,fill:{color:PETROLEO},color:CREMA,fontFace:POP,fontSize:9.5,align:"center",valign:"middle"}}));
  const body = rows.map((r,i)=>r.map((c,j)=>({text:String(c),options:{fill:{color:i%2===0?"FFFFFF":FILA},color:PETROLEO,fontFace:POP,fontSize:opts&&opts.fs||9.5,align:j===0?"left":"center",valign:"middle",bold:opts&&opts.boldFirst&&j===0}})));
  s.addTable([hd,...body],{x,y,w,colW,border:{type:"solid",color:LINEA,pt:0.5},autoPage:false,rowH:opts&&opts.rowH||0.34});}

// ============ 1 — PORTADA ============
let s=p.addSlide(); s.background={color:PETROLEO};
s.addImage({path:BR+"00-portada-fachada.png",x:6.9,y:0,w:6.433,h:7.5,sizing:{type:"cover",w:6.433,h:7.5}});
s.addShape(p.ShapeType.rect,{x:0,y:0,w:7.1,h:7.5,fill:{color:PETROLEO,transparency:8}});
tag(s,"VISUALIZACIÓN ARQUITECTÓNICA — DESARROLLADOR ORIGINAL, SUJETA A CAMBIOS",6.95,7.05,6.33,"render");
s.addImage({path:ISO_INV,x:0.6,y:0.55,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.3,y:0.6,w:5,h:0.45,fontFace:LORA,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("OPORTUNIDAD DE INVERSIÓN",{x:0.62,y:2.5,w:6,h:0.35,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,charSpacing:3});
s.addText("Edificio Residencial\nHerrera, Asunción",{x:0.6,y:2.95,w:6.1,h:1.9,fontFace:LORA,fontSize:38,color:CREMA,lineSpacing:42});
s.addText("Investor Book — de la estructura actual al producto terminado: activo, ubicación, tipologías, precios, forma de pago, mercado y rentabilidad.",{x:0.62,y:5.0,w:5.9,h:1.1,fontFace:POP,fontSize:12.5,color:"C7CFD2",lineSpacing:19});
s.addShape(p.ShapeType.rect,{x:0.62,y:6.25,w:3.1,h:0.5,fill:{color:NAVY2},line:{color:LAPACHO,width:1}});
s.addText("NEGOCIAR / CONDICIONAR",{x:0.62,y:6.25,w:3.1,h:0.5,fontFace:POP,bold:true,fontSize:10.5,color:LAPACHO,align:"center",valign:"middle"});

// ============ 2 — EXECUTIVE SUMMARY ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Resumen ejecutivo"); title(s,"La oportunidad en una página");
const a2es=ANGULOS.angulo_2;
const es=[["Precio de adquisición","USD 850.000"],["Inversión Total (Ángulo 2, recomendado)","USD "+fmt0(a2es.inversion_total_usd)],["Superficie comercializable","1.800 – 2.100 m² según diseño"],["Unidades","21 (tal cual) a 39 (con piso adicional, ilustrativo)"],["Precio de venta objetivo","USD 1.900 – 2.050 / m²"],["Ingresos potenciales (Ángulo 2)","USD "+fmt0(a2es.ingresos_bajo_usd)+" – "+fmt0(a2es.ingresos_alto_usd)],["Margen final, neto de comisión e IVA","USD "+fmt0(a2es.margen_bajo_usd)+" – "+fmt0(a2es.margen_alto_usd)],["ROI sobre Inversión Total",fmtP1(a2es.roi_bajo_pct)+" – "+fmtP1(a2es.roi_alto_pct)],["Plazo estimado","12 meses de obra + 1 mes de entrega"],["Recomendación","Negociar / condicionar — 1 punto técnico pendiente"]];
table(s,["Concepto","Valor"],es,0.6,1.85,12.1,[5.5,6.6],{rowH:0.385});
s.addText("Cifras del Ángulo 2 (recomendado). Ver la sección 17 para los tres Ángulos comparados. Ninguna cifra mostrada carece de respaldo en el modelo financiero del caso.",{x:0.6,y:6.28,w:12,h:0.32,fontFace:POP,italic:true,fontSize:8.5,color:GREY,lineSpacing:11});
footer(s);

// ============ 3 — LA OPORTUNIDAD ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"La oportunidad"); title(s,"Qué estamos adquiriendo y por qué");
s.addText([
  {text:"Qué se adquiere: ",options:{bold:true,color:TIERRA}},
  {text:"un edificio residencial con el 73,5% de su estructura de hormigón ya construida, en una esquina de alta demanda de Barrio Herrera — no un terreno vacío ni un proyecto en papel.\n\n",options:{breakLine:true}},
  {text:"La oportunidad: ",options:{bold:true,color:TIERRA}},
  {text:"comprar la estructura existente a un costo por debajo del de construir desde cero, terminar el edificio en 12 meses, y vender/retener con el respaldo de comparables reales de la misma zona.\n\n",options:{breakLine:true}},
  {text:"La tesis de inversión: ",options:{bold:true,color:TIERRA}},
  {text:"el precio de entrada ya validado, más el ahorro de tiempo y riesgo de una obra parcialmente avanzada, produce un margen positivo en los tres diseños analizados — incluso en el escenario de precio más conservador."},
],{x:0.6,y:1.9,w:12.1,h:2.85,fontFace:POP,fontSize:13,color:PETROLEO,lineSpacing:20});
s.addShape(p.ShapeType.rect,{x:0.6,y:4.85,w:12.1,h:1.6,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("Verificación de identidad del predio",{x:0.9,y:5.0,w:11.5,h:0.35,fontFace:LORA,fontSize:14,color:PETROLEO});
s.addText("El nombre técnico del proyecto (\"Edificio 4 de Julio\", planos de 2023) y el nombre comercial (\"Herrera Town\") corresponden al mismo predio — verificado por cuenta catastral (14-502-04), superficie (469 m²) y ubicación (esquina Concejal Vargas y 4 de Julio) coincidentes en ambas fuentes.",{x:0.9,y:5.4,w:11.5,h:0.95,fontFace:POP,fontSize:11,color:GREY,lineSpacing:15});
footer(s);

// ============ 4 — ESTADO ACTUAL ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Estado actual"); title(s,"ESTADO ACTUAL DEL PROYECTO — julio 2026");
const fotos=[FO+"04-fachada-calle-02.jpeg",FO+"01-formwork-nivel-superior.jpeg",FO+"05-interior-planta-columnas.jpeg"];
fotos.forEach((f,i)=>{const x=0.6+i*4.05;
  s.addImage({path:f,x,y:1.95,w:3.85,h:3.3,sizing:{type:"cover",w:3.85,h:3.3}});
  s.addShape(p.ShapeType.rect,{x,y:1.95,w:3.85,h:3.3,fill:{color:"000000",transparency:100},line:{color:LINEA,width:1}});
  tag(s,"FOTOGRAFÍA REAL — JULIO 2026",x+0.08,1.95+3.3-0.4,3.69,"real");});
const av=[["73,5%","Avance de estructura de hormigón"],["2.286,93 m²","Construidos, de 3.113,03 m² totales"],["0%","Mampostería, instalaciones y terminaciones — pendiente en su totalidad"]];
av.forEach((a,i)=>{const x=0.6+i*4.05;
  s.addText(a[0],{x,y:5.5,w:3.85,h:0.5,fontFace:LORA,fontSize:22,color:TIERRA});
  s.addText(a[1],{x,y:6.0,w:3.85,h:0.6,fontFace:POP,fontSize:10.5,color:GREY,lineSpacing:14});});
footer(s);

// ============ 5 — QUÉ SE VA A TERMINAR ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"De hoy al producto terminado"); title(s,"DEL ESTADO ACTUAL AL PRODUCTO FINAL — Ángulo 1");
s.addImage({path:FO+"03-fachada-calle-01.jpeg",x:0.6,y:1.85,w:5.85,h:3.95,sizing:{type:"cover",w:5.85,h:3.95}});
tag(s,"FOTOGRAFÍA REAL — HOY, JULIO 2026",0.68,1.85+3.95-0.4,5.7,"real");
s.addImage({path:BR+"00-portada-fachada.png",x:6.85,y:1.85,w:5.85,h:3.95,sizing:{type:"cover",w:5.85,h:3.95}});
tag(s,"VISUALIZACIÓN — DESARROLLADOR ORIGINAL, SUJETA A CAMBIOS",6.93,1.85+3.95-0.4,5.7,"render");
s.addText("Se conserva la estructura existente y la envolvente ya aprobada. Se completa mampostería, instalaciones, fachada y terminaciones — sin modificar el diseño original en el escenario Ángulo 1 (\"tal cual\"). Los Ángulos 2 y 3 proponen cambios de diseño que todavía no tienen un plano o render propio — ver sección 9.",{x:0.6,y:5.95,w:12.1,h:0.75,fontFace:POP,italic:true,fontSize:10,color:GREY,lineSpacing:13});
footer(s);

// ============ 6 — PROYECTO ARQUITECTÓNICO ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Proyecto arquitectónico"); title(s,"Distribución — diseño original (Ángulo 1)");
s.addImage({path:BR+"07-plano-base.png",x:0.6,y:1.95,w:6.5,h:4.6,sizing:{type:"contain",w:6.5,h:4.6}});
tag(s,"PLANO DEL DESARROLLADOR — PRELIMINAR, SUJETO A CAMBIOS",0.65,6.35,6.4,"plan");
const stats2=[["8","Niveles"],["21","Departamentos"],["21","Cocheras"]];
stats2.forEach((d,i)=>{const y=2.0+i*0.85;
  s.addText(d[0],{x:7.4,y,w:1.1,h:0.7,fontFace:LORA,fontSize:26,color:TIERRA,valign:"middle"});
  s.addText(d[1],{x:8.55,y,w:4,h:0.7,fontFace:POP,fontSize:12,color:PETROLEO,valign:"middle"});});
s.addText("Amenities: salón multiuso climatizado, parrilla, piscina, solarium, parque infantil, ascensor, área de descanso.",{x:7.4,y:4.6,w:5.2,h:1.0,fontFace:POP,fontSize:11,color:GREY,lineSpacing:16});
s.addText("Fuente: brochure comercial real del desarrollador original (\"Herrera Town\"), verificado contra la cuenta catastral del predio.",{x:7.4,y:5.9,w:5.2,h:0.8,fontFace:POP,italic:true,fontSize:9.5,color:GREY,lineSpacing:14});
footer(s);

// ============ 7 — TIPOLOGÍAS (Ángulo 1, real) ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Tipologías — Ángulo 1"); title(s,"6 tipologías, del diseño original real");
const tip=[["A","2 dormitorios","77,1 m²","Pisos 1–6 (6 unidades)"],["B","2 dormitorios","95,8 m²","Pisos 1–6 (6 unidades)"],["C","1 dormitorio","54,5 m²","Pisos 1–3 (3 unidades)"],["D","2 dormitorios","77,2 m²","Pisos 1–3 (3 unidades)"],["E1","3 dormitorios","132,3 m²","Piso 4 (1 unidad)"],["E2","3 dormitorios","124,4 m²","Pisos 5–6 (2 unidades)"]];
table(s,["Tipología","Dormitorios","Área propia","Distribución"],tip,0.6,1.95,12.1,[1.8,3.2,3.1,4.0],{rowH:0.44});
s.addText("21 unidades en total — área propia total ≈ 1.813,6 m², consistente con los 1.800 m² de área comercializable usados en el modelo financiero del Ángulo 1.",{x:0.6,y:5.55,w:12.1,h:0.5,fontFace:POP,italic:true,fontSize:10.5,color:GREY});
tag(s,"PLANILLA REAL DEL DESARROLLADOR ORIGINAL",0.6,6.15,4.2,"plan");
footer(s);

// ============ 8 — FICHA TIPO A ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Ficha de tipología"); title(s,"Tipo A — 2 dormitorios, 77,1 m²");
s.addImage({path:BR+"08-tipo-a.png",x:0.6,y:1.9,w:6.0,h:4.9,sizing:{type:"contain",w:6.0,h:4.9}});
tag(s,"PLANO DEL DESARROLLADOR — PRELIMINAR, SUJETO A CAMBIOS",0.65,6.4,5.9,"plan");
const ambientes=[["Habitación principal","13,03 m²"],["Habitación 1","9,91 m²"],["Baño principal","3,19 m²"],["Baño 1","2,76 m²"],["Sala/comedor","22,16 m²"],["Cocina","5,69 m²"],["Balcón","5,1 m²"]];
table(s,["Ambiente","m²"],ambientes,7.0,2.0,5.7,[4.2,1.5],{rowH:0.42});
s.addText("Ejemplo de ficha disponible por cada una de las 6 tipologías (A-E2) a partir del mismo material real del desarrollador.",{x:7.0,y:5.15,w:5.7,h:0.9,fontFace:POP,italic:true,fontSize:10.5,color:GREY,lineSpacing:15});
footer(s);

// ============ 9 — ÁNGULO 2/3: MIX PROPUESTO ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Ángulo 2 y Ángulo 3"); title(s,"Propuesta de rediseño de mix — sin plano confirmado");
s.addShape(p.ShapeType.rect,{x:0.6,y:1.9,w:12.1,h:0.75,fill:{color:AMBAR_F},line:{color:AMBAR,width:1}});
s.addText("Estos dos escenarios reconsideran el mix de unidades del diseño original — todavía no tienen un plano arquitectónico ni un render propio. No se ilustra ninguna unidad de estas con material inventado.",{x:0.85,y:1.9,w:11.6,h:0.75,fontFace:POP,bold:true,fontSize:11.5,color:AMBAR,valign:"middle"});
const props=[["Ángulo 3","Fachada nueva + tipologías chicas","6 pisos, 29 unidades (ilustrativo)","Monoambiente (30 m²), 1 dormitorio (45 m²) y 2/3 dormitorios en proporciones más parejas — mejor perfil de retención en renta."],["Ángulo 2 — recomendado","+ piso adicional (7º)","7 pisos, 39 unidades (ilustrativo)","Mismo mix de Ángulo 3, más un piso adicional ya con incentivo de altura municipal confirmado — mayor margen, costo/m² más bajo de los tres diseños."]];
props.forEach((a,i)=>{const x=0.6+i*6.15; const rec=i===1;
  s.addShape(p.ShapeType.rect,{x,y:2.9,w:5.9,h:3.6,fill:{color:rec?PETROLEO:"FFFFFF"},line:{color:rec?LAPACHO:LINEA,width:rec?2:1}});
  s.addText(a[0],{x:x+0.35,y:3.15,w:5.2,h:0.4,fontFace:POP,bold:true,fontSize:11,color:rec?LAPACHO:TIERRA,charSpacing:1});
  s.addText(a[1],{x:x+0.35,y:3.55,w:5.2,h:0.5,fontFace:LORA,fontSize:18,color:rec?CREMA:PETROLEO});
  s.addText(a[2],{x:x+0.35,y:4.1,w:5.2,h:0.4,fontFace:POP,bold:true,fontSize:11,color:rec?LAPACHO:TIERRA});
  s.addText(a[3],{x:x+0.35,y:4.55,w:5.3,h:1.8,fontFace:POP,fontSize:11,color:rec?"C7CFD2":GREY,lineSpacing:15});});
footer(s);

// ============ 9B — REFERENCIAS DE DISEÑO (TAMBONE ARQUITECTURA / QUBO) ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Referencias de diseño — Ángulo 2/3"); title(s,"Tambone Arquitectura — estudio propuesto para el rediseño");
s.addText("Estudio propuesto por Meridiano para la fachada y las tipologías chicas de Ángulo 2/3 — diseñó Edificio Qubo (Senador Long, Asunción), ya revisado como referencia directa de tipología y amoblamiento. Ningún plano de estas imágenes es de Herrera todavía.",{x:0.6,y:1.85,w:12.1,h:0.6,fontFace:POP,fontSize:11.5,color:PETROLEO,lineSpacing:16});
const qimgs=[[QB+"00-fachada-sugerida-tambonea.png","SUGERENCIA DE FACHADA — TAMBONE ARQUITECTURA","render"],[QB+"18-tipologia-1-amoblada-qubo.png","REFERENCIA DE TIPOLOGÍA — EDIFICIO QUBO, NO ES HERRERA","render"],[QB+"26-tipologia-3-amoblada-qubo.png","REFERENCIA DE AMOBLAMIENTO — EDIFICIO QUBO, NO ES HERRERA","render"]];
qimgs.forEach((qi,i)=>{const x=0.6+i*4.05;
  s.addImage({path:qi[0],x,y:2.55,w:3.85,h:3.55,sizing:{type:"cover",w:3.85,h:3.55}});
  tag(s,qi[1],x+0.08,2.55+3.55-0.45,3.69,qi[2]);});
s.addText("Edificio Qubo — Villa Morra, 1 dormitorio 42 m² desde USD 68.080 (~USD 1.621/m², Coldwell Banker Paraguay, 2026-08-18). Formato \"Aparta Office\" con coworking; no es un comparable de precio directo para Herrera, ver `42-market-comparables.md` §1.1.",{x:0.6,y:6.3,w:12.1,h:0.4,fontFace:POP,italic:true,fontSize:9.5,color:GREY});
footer(s);

// ============ 10 — MATRIZ DE UNIDADES (Ángulo 1) ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Matriz de unidades — Ángulo 1"); title(s,"MATRIZ DE PRECIO POR UNIDAD — precio por tipología, +1%/piso");
const upm=[["A","6","77,1 m²","Pisos 1-6","USD 146.490 – 165.958"],["B","6","95,8 m²","Pisos 1-6","USD 182.020 – 206.210"],["C","3","54,5 m²","Pisos 1-3","USD 103.550 – 113.960"],["D","3","77,2 m²","Pisos 1-3","USD 146.680 – 161.425"],["E1","1","132,3 m²","Piso 4","USD 258.911 – 279.351"],["E2","2","124,4 m²","Pisos 5-6","USD 245.814 – 267.771"]];
table(s,["Tipología","Unidades","Área propia","Distribución","Precio de venta (rango)"],upm,0.6,1.95,12.1,[1.6,1.5,2.0,2.3,4.7],{rowH:0.42});
s.addText("El rango de cada tipología ya incorpora el escalado de +1% por piso sobre la base USD 1.900–2.050/m² — el precio exacto depende del piso, ver `41-...md` para el detalle unidad por unidad. + cochera: USD 15.000 por unidad, sin escalar.",{x:0.6,y:5.35,w:12.1,h:0.4,fontFace:POP,fontSize:9.5,color:GREY,lineSpacing:12});
s.addShape(p.ShapeType.rect,{x:0.6,y:5.8,w:12.1,h:0.9,fill:{color:AMBAR_F},line:{color:AMBAR,width:1}});
s.addText([{text:"Nota de consistencia (§41), actualizada: ",options:{bold:true}},{text:"con el escalado de +1%/piso confirmado por el founder, el extremo bajo de esta matriz (sin cochera) casi coincide con el memorándum (±1,0%, antes ±3,4%); el extremo alto (con cochera) también mejora (±2,2%, antes ±4,4%) — pero ninguna combinación cierra ambos extremos a la vez. Detalle completo y brecha sin resolver en `41-unit-price-matrix.md` §3."}],{x:0.85,y:5.85,w:11.6,h:0.8,fontFace:POP,fontSize:9,color:AMBAR,lineSpacing:12,valign:"middle"});
footer(s);

// ============ 11 — PRECIO VS MERCADO ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Justificación del precio"); title(s,"Precio del proyecto vs. mercado comparable");
const pvm=[["Monoambiente/1 dorm chico","1.900 – 2.050","1.576 – 1.809","SOBRE MERCADO"],["2 dormitorios","1.900 – 2.050","1.580 – 1.851","SOBRE MERCADO"],["3 dormitorios","1.900 – 2.050","1.850 – 2.212 (Filum)","EN MERCADO"]];
table(s,["Tipología","Precio proyecto USD/m²","Mercado (comparables reales)","Posición"],pvm,0.6,1.95,12.1,[3.6,3.0,3.5,2.0],{rowH:0.48});
s.addText("El precio objetivo está por encima del rango de mercado y en línea con Filum Herrera (comparable directo del mismo barrio, mejores terminaciones). AMC parametrizado (2026-08-18, 9 comparables reales del propio barrio): promedio ajustado ~USD 1.509/m² para 2 dormitorios — confirma el hallazgo con muestra 4,5x mayor. La diferenciación de producto (calidad USD 720/m² vs. 650/m² del rango bajo) fue evaluada cuantitativamente y sostiene el precio premium — ver sección 19.",{x:0.6,y:4.05,w:12.1,h:1.3,fontFace:POP,fontSize:11.5,color:PETROLEO,lineSpacing:17});
footer(s);

// ============ 12 — COMPARABLES REALES ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Comparables de mercado"); title(s,"11 comparables reales — 9 dentro del propio Barrio Herrera",null,22);
const comp=[["Inarco Herrera","Barrio Herrera","1 dorm, 44 m²","USD 69.800","USD 1.586"],["Filum Herrera","Barrio Herrera","1 dorm, 38 m²","USD 70.300","USD 1.850"],["Invicta Herrera","Barrio Herrera (Concejal Vargas)","1 dorm, 44 m²","USD 80.000","USD 1.818"],["Invicta Herrera","Barrio Herrera","2 dorm, 72,5 m² (c/cochera)","USD 113.700","USD 1.569"],["Pampidos","Barrio Herrera","2 dorm, 86 m² (terminado, c/cochera)","USD 128.000","USD 1.488"],["Forvm Herrera","Barrio Herrera (Concejal Vargas)","3 dorm, 172,8 m² propia","USD 229.800","USD 1.330"],["Sunset Santa Teresa","Ycuá Satí","1 dorm, 45,2 m²","USD 73.689","USD 1.631"],["Ayre Santa Teresa","Ycuá Satí","Mono, 35,6 m²","USD 64.404","USD 1.809"],["Marina 11","Ycuá Satí","2 dorm, 72,8 m²","USD 115.000","USD 1.580"],["Livit Santa Teresa","Ycuá Satí","1 dorm, 43,8 m²","USD 79.200","USD 1.807"],["Ventura Ycuá Satí","Ycuá Satí","1 dorm, 49,5 m²","USD 83.062","USD 1.677"]];
table(s,["Proyecto","Zona","Tipología","Precio","USD/m²"],comp,0.6,1.85,12.1,[2.6,2.7,3.0,2.0,1.8],{rowH:0.335,fs:8.3});
s.addText("Fuente: listados públicos de Century 21 y RE/MAX, relevados 2026-08-17/18 (categoría A — dato real con fuente citable). Filum Herrera: flyer comercial de Century 21 Liberty. AMC completo y ajuste por tipología: Data Room.",{x:0.6,y:6.0,w:12.1,h:0.55,fontFace:POP,italic:true,fontSize:9,color:GREY,lineSpacing:12});
footer(s);

// ============ 13 — MARKET SNAPSHOT ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Panorama de mercado — Herrera"); title(s,"Venta y alquiler, lado a lado");
s.addShape(p.ShapeType.rect,{x:0.6,y:1.95,w:5.9,h:4.2,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("VENTA",{x:0.9,y:2.15,w:5.3,h:0.4,fontFace:POP,bold:true,fontSize:12,color:TIERRA,charSpacing:2});
s.addText([
  {text:"USD 1.576 – 1.809/m²  ",options:{bold:true,color:PETROLEO}},{text:"rango de 7 comparables reales (Century 21)\n",options:{breakLine:true}},
  {text:"USD 1.850 – 2.025/m²  ",options:{bold:true,color:PETROLEO}},{text:"Filum Herrera, comparable directo del barrio\n",options:{breakLine:true}},
  {text:"USD 1.900 – 2.050/m²  ",options:{bold:true,color:PETROLEO}},{text:"precio objetivo del proyecto (calidad diferenciada)"},
],{x:0.9,y:2.65,w:5.3,h:3.3,fontFace:POP,fontSize:12,color:GREY,lineSpacing:20});
s.addShape(p.ShapeType.rect,{x:6.85,y:1.95,w:5.9,h:4.2,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
s.addText("ALQUILER",{x:7.15,y:2.15,w:5.3,h:0.4,fontFace:POP,bold:true,fontSize:12,color:TIERRA,charSpacing:2});
s.addText([
  {text:"Monoambiente  ",options:{bold:true,color:PETROLEO}},{text:"el más sólido — supera su piso de renta en todas las combinaciones probadas\n",options:{breakLine:true}},
  {text:"1 dormitorio  ",options:{bold:true,color:PETROLEO}},{text:"sólido en tradicional/amoblado básico\n",options:{breakLine:true}},
  {text:"2-3 dormitorios  ",options:{bold:true,color:PETROLEO}},{text:"necesitan amoblado o zona premium para superar el piso"},
],{x:7.15,y:2.65,w:5.3,h:3.3,fontFace:POP,fontSize:12,color:GREY,lineSpacing:20});
s.addText("Fuente: knowledge-base/investment/market-intelligence/ (D-066, D-073) — datos reales relevados de Century 21, RE/MAX y portales, categoría A/C según el registro.",{x:0.6,y:6.3,w:12.1,h:0.4,fontFace:POP,italic:true,fontSize:9.5,color:GREY});
footer(s);

// ============ 14 — UBICACIÓN ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Ubicación"); title(s,"UBICACIÓN Y MAPA DE MERCADO");
s.addImage({path:BR+"04-ubicacion-mapa.png",x:0.6,y:1.9,w:8.0,h:4.9,sizing:{type:"contain",w:8.0,h:4.9}});
tag(s,"MAPA REAL DEL DESARROLLADOR",0.65,6.35,4.0,"plan");
const ubic=["Esquina Concejal Vargas y 4 de Julio, Barrio Herrera","A 500 m de Av. Mariscal López","Cercano a Superseis, Biggie, Shopping Mariscal, Paseo La Galería","A pocas cuadras de la Municipalidad de Asunción","Lindante con Barrio Villa Morra y San Cristóbal"];
const ubicItems = ubic.map((t,j)=>({text:t,options:{bullet:{indent:14},breakLine:j<ubic.length-1,paraSpaceAfter:10}}));
s.addText(ubicItems,{x:8.9,y:2.1,w:3.85,h:4.5,fontFace:POP,fontSize:11.5,color:PETROLEO,lineSpacing:16});
footer(s);

// ============ 15 — FORMA DE PAGO ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Forma de pago"); title(s,"Cómo se puede comprar");
const fp=[["Norma estándar Meridiano","20% anticipo (firma boleto)","70% cuotas mensuales decrecientes durante obra","10% contra la entrega física"],["Variante de plazo corto (este proyecto)","40% anticipo","50% cuotas durante obra","10% contra la entrega física"]];
fp.forEach((f,i)=>{const x=0.6+i*6.15;
  s.addShape(p.ShapeType.rect,{x,y:2.0,w:5.9,h:3.5,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(f[0],{x:x+0.35,y:2.2,w:5.2,h:0.55,fontFace:LORA,fontSize:15,color:PETROLEO});
  [f[1],f[2],f[3]].forEach((t,j)=>{
    s.addText(t,{x:x+0.35,y:2.9+j*0.75,w:5.2,h:0.6,fontFace:POP,fontSize:12.5,color:TIERRA,bold:true});});});
s.addText("No se financia directamente contra la escritura — el 10% final se cobra contra la entrega física del departamento, ~6-8 meses antes de la escritura. Ambos esquemas conviven; la variante de plazo corto ayuda a cerrar el déficit de timing de este proyecto específico (12 meses de obra).",{x:0.6,y:5.75,w:12.1,h:1.0,fontFace:POP,italic:true,fontSize:11,color:GREY,lineSpacing:16});
footer(s);

// ============ 16 — FINANCIACIÓN ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Financiación"); title(s,"Del comprador vs. estructura de inversión de Meridiano");
const fin=[["Sunset Santa Teresa","Hasta 24 meses sin interés, escalones 30/50/90%"],["Ayre Santa Teresa","Planes 20-80, 20-50-30, 30-50-20"],["Livit Santa Teresa","20% + cuotas de USD 500"],["Matrisa Lillo","27 meses sin interés + financiación post-obra hasta 5 años"],["Ventura Ycuá Satí","Hasta 36 meses"]];
table(s,["Comparable real","Condición de financiamiento observada"],fin,0.6,1.95,5.9,[2.2,3.7],{rowH:0.4,fs:9.5});
s.addShape(p.ShapeType.rect,{x:6.85,y:1.95,w:5.9,h:4.3,fill:{color:PETROLEO}});
s.addText("ESTRUCTURA DE INVERSIÓN — MERIDIANO",{x:7.15,y:2.15,w:5.3,h:0.4,fontFace:POP,bold:true,fontSize:11,color:LAPACHO,charSpacing:1});
const einv=["Vehículo: Sociedad Anónima, 2-3 socios","100% fondos propios — sin deuda bancaria, sin fideicomiso","Capital propio cubre el 74-76% de la Inversión Total según escenario","Déficit de timing de caja identificado y resuelto (mes 9→11)"].map((t,j)=>({text:t,options:{bullet:{indent:14},breakLine:j<3,paraSpaceAfter:10}}));
s.addText(einv,{x:7.15,y:2.7,w:5.3,h:3.3,fontFace:POP,fontSize:11.5,color:"C7CFD2",lineSpacing:16});
footer(s);

// ============ 17 — ESTRATEGIA + RETORNO POR ÁNGULO ============
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Estrategia y retorno",true); title(s,"Capital → Obra → Producto terminado → Venta → Ganancia",true,21);
const {angulo_1:a1t,angulo_3:a3t,angulo_2:a2t}=ANGULOS;
const ang3=[
  ["Ángulo 1",a1t.unidades+" uds","USD "+fmt0(a1t.inversion_total_usd),fmt0(a1t.margen_bajo_usd)+" – "+fmt0(a1t.margen_alto_usd),fmtP1(a1t.roi_bajo_pct)+" – "+fmtP1(a1t.roi_alto_pct)],
  ["Ángulo 3",a3t.unidades+" uds (ilustr.)","USD "+fmt0(a3t.inversion_total_usd),fmt0(a3t.margen_bajo_usd)+" – "+fmt0(a3t.margen_alto_usd),fmtP1(a3t.roi_bajo_pct)+" – "+fmtP1(a3t.roi_alto_pct)],
  ["Ángulo 2 ★",a2t.unidades+" uds (ilustr.)","USD "+fmt0(a2t.inversion_total_usd),fmt0(a2t.margen_bajo_usd)+" – "+fmt0(a2t.margen_alto_usd),fmtP1(a2t.roi_bajo_pct)+" – "+fmtP1(a2t.roi_alto_pct)],
];
ang3.forEach((a,i)=>{const x=0.6+i*4.05; const rec=i===2;
  s.addShape(p.ShapeType.rect,{x,y:2.3,w:3.8,h:4.1,fill:{color:rec?NAVY2:"1B3D45"},line:{color:rec?LAPACHO:"2A4A52",width:rec?2:1}});
  s.addText(a[0],{x:x+0.3,y:2.5,w:3.2,h:0.4,fontFace:POP,bold:true,fontSize:12,color:rec?LAPACHO:CREMA});
  s.addText(a[1],{x:x+0.3,y:2.9,w:3.2,h:0.35,fontFace:POP,fontSize:10.5,color:"9DA8AC"});
  s.addText("Inversión Total",{x:x+0.3,y:3.4,w:3.2,h:0.3,fontFace:POP,fontSize:9.5,color:"9DA8AC"});
  s.addText(a[2],{x:x+0.3,y:3.65,w:3.2,h:0.45,fontFace:LORA,fontSize:16,color:CREMA});
  s.addText("Margen (bajo–alto)",{x:x+0.3,y:4.25,w:3.2,h:0.3,fontFace:POP,fontSize:9.5,color:"9DA8AC"});
  s.addText(a[3],{x:x+0.3,y:4.5,w:3.2,h:0.55,fontFace:LORA,fontSize:13,color:CREMA,lineSpacing:15});
  s.addText("ROI",{x:x+0.3,y:5.2,w:3.2,h:0.3,fontFace:POP,fontSize:9.5,color:"9DA8AC"});
  s.addText(a[4],{x:x+0.3,y:5.45,w:3.2,h:0.6,fontFace:LORA,fontSize:19,color:rec?LAPACHO:CREMA});});
s.addText("★ Ángulo 2 recomendado — mayor margen, mejor ROI en el extremo conservador, y el costo/m² más bajo de los tres.",{x:0.6,y:6.45,w:12.1,h:0.3,fontFace:POP,italic:true,fontSize:10,color:"9DA8AC"});
footer(s,true);

// ============ 18 — POTENCIAL DE ALQUILER ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Potencial de alquiler"); title(s,"También un producto de renta, no solo de venta");
const esc2=[["Venta mínima + retención perpetua","15,0%/año","Se vende solo lo necesario para financiar la obra"],["Venta agresiva (100%)","24,3%/año","Se liquida la totalidad apenas disponible"],["Venta mínima + retención 2 años + reventa","33,4%/año — ESTIMATED","El más alto, con más riesgo de mercado (plusvalía 20%/año no es una tasación de tercero)"]];
esc2.forEach((e,i)=>{const x=0.6+i*4.05; const best=i===2;
  s.addShape(p.ShapeType.rect,{x,y:2.1,w:3.8,h:3.9,fill:{color:best?PETROLEO:"FFFFFF"},line:{color:best?LAPACHO:LINEA,width:best?2:1}});
  s.addText(e[0],{x:x+0.3,y:2.35,w:3.2,h:0.9,fontFace:LORA,fontSize:14,color:best?CREMA:PETROLEO,lineSpacing:16});
  s.addText(e[1],{x:x+0.3,y:3.3,w:3.2,h:0.6,fontFace:LORA,fontSize:best>1?15:22,color:best?LAPACHO:TIERRA});
  s.addText(e[2],{x:x+0.3,y:4.0,w:3.25,h:1.9,fontFace:POP,fontSize:10.5,color:best?"C7CFD2":GREY,lineSpacing:15});});
footer(s);

// ============ 19 — SENSIBILIDAD + PRECIO DE ENTRADA ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Sensibilidad y precio de entrada"); title(s,"Cómo cambia el margen — y hasta cuánto conviene pagar");
s.addText("El rango de precio de venta (USD 1.900-2.050/m²) es la variable de sensibilidad principal — los tres Ángulos dan margen positivo en todo ese rango, incluido el extremo bajo.",{x:0.6,y:1.9,w:12.1,h:0.7,fontFace:POP,fontSize:12.5,color:PETROLEO,lineSpacing:18});
const pe=[["Precio solicitado por el vendedor","USD 850.000"],["Precio pagado / a pagar (validado)","USD 850.000"],["Precio máximo económicamente justificable","No cuantificado en este documento — PENDING, ver Data Room"]];
table(s,["Concepto","Valor"],pe,0.6,2.8,12.1,[6.5,5.6],{rowH:0.45});
s.addShape(p.ShapeType.rect,{x:0.6,y:4.7,w:12.1,h:1.5,fill:{color:AMBAR_F},line:{color:AMBAR,width:1}});
s.addText([{text:"Variables de sensibilidad pendientes de cuantificar (PROJECTION, no ESTIMATED): ",options:{bold:true}},{text:"costo de refuerzo estructural del Ángulo 2 si la opinión estructural lo exige — la única variable de sensibilidad real que sigue abierta."}],{x:0.85,y:4.85,w:11.6,h:1.2,fontFace:POP,fontSize:11.5,color:AMBAR,lineSpacing:17,valign:"middle"});
footer(s);

// ============ 19B — COMPOSICIÓN DEL COSTO POR ÍTEM ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"De USD 650/720 por m² a USD 1.525-1.628/m²"); title(s,"Composición del costo por m² comercializable",null,22);
const costoColors=[TIERRA,PETROLEO,GOLD_D,LAPACHO,GREY,LINEA];
function costoVals(ci){
  const base=[ci.terreno_usd,ci.estructura_ya_construida_usd,ci.terminacion_usd,ci.obra_nueva_usd];
  return (ci.proyecto_usd>0||ci.aprobaciones_usd>0) ? base.concat([ci.proyecto_usd,ci.aprobaciones_usd]) : base;
}
const costoLabelsFull=["Terreno","Estructura ya construida+doc.+riesgo","Terminación s/estructura existente","Obra 100% nueva","Proyecto (honorarios)","Aprobaciones e imprevistos"];
const costoAngulos=[
  {t:"Ángulo 1 — USD "+fmt2(a1t.costo_m2_comercializable_usd)+"/m²",labels:costoLabelsFull.slice(0,4),vals:costoVals(a1t.cost_items),x:0.5},
  {t:"Ángulo 3 — USD "+fmt2(a3t.costo_m2_comercializable_usd)+"/m²",labels:costoLabelsFull,vals:costoVals(a3t.cost_items),x:4.75},
  {t:"Ángulo 2 — USD "+fmt2(a2t.costo_m2_comercializable_usd)+"/m²",labels:costoLabelsFull,vals:costoVals(a2t.cost_items),x:9.0},
];
costoAngulos.forEach(a=>{
  s.addText(a.t,{x:a.x,y:1.75,w:3.85,h:0.35,fontFace:POP,bold:true,fontSize:11.5,color:PETROLEO,align:"center"});
  s.addChart(p.ChartType.pie,[{name:"Costo",labels:a.labels,values:a.vals}],{
    x:a.x,y:2.1,w:3.85,h:3.6,chartColors:costoColors.slice(0,a.vals.length),
    showLegend:false,showPercent:true,showLabel:false,dataLabelColor:"FFFFFF",dataLabelFontSize:10,dataLabelFontBold:true,
    dataLabelPosition:"bestFit",
  });
});
// leyenda compartida
const costoLeg=["Terreno","Estructura ya construida + doc. + riesgo evitado","Terminación sobre estructura existente","Obra 100% nueva","Proyecto (honorarios diseño) — solo Ángulo 2/3","Aprobaciones e imprevistos — solo Ángulo 2/3"];
costoLeg.forEach((t,i)=>{
  const col=i%2===0?0.6:6.9, row=Math.floor(i/2), yy=5.85+row*0.26;
  s.addShape(p.ShapeType.rect,{x:col,y:yy+0.03,w:0.13,h:0.13,fill:{color:costoColors[i]}});
  s.addText(t,{x:col+0.21,y:yy,w:6.0,h:0.24,fontFace:POP,fontSize:8.2,color:PETROLEO,valign:"middle"});
});
footer(s);

// ============ 19C — COMPOSICIÓN DEL PRECIO DE VENTA ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"De Ingresos a Margen"); title(s,"Composición del precio de venta — valor medio del rango",null,20);
const precioColors=[PETROLEO,GOLD_D,TIERRA,VERDE];
const precioLabelsFull=["Inversión Total","Comisión (5,5%)","IVA desarrollador","Margen neto"];
function precioVals(a){ return [a.inversion_total_usd, medio(a.comision_bajo_usd,a.comision_alto_usd), medio(a.iva_desarrollador_bajo_usd,a.iva_desarrollador_alto_usd), medio(a.margen_bajo_usd,a.margen_alto_usd)]; }
const precioAngulos=[
  {t:"Ángulo 1",sub:"Ingresos USD "+fmt0(a1t.ingresos_bajo_usd)+"–"+fmt0(a1t.ingresos_alto_usd),labels:precioLabelsFull,vals:precioVals(a1t),x:0.5},
  {t:"Ángulo 3",sub:"Ingresos USD "+fmt0(a3t.ingresos_bajo_usd)+"–"+fmt0(a3t.ingresos_alto_usd),labels:precioLabelsFull,vals:precioVals(a3t),x:4.75},
  {t:"Ángulo 2",sub:"Ingresos USD "+fmt0(a2t.ingresos_bajo_usd)+"–"+fmt0(a2t.ingresos_alto_usd),labels:precioLabelsFull,vals:precioVals(a2t),x:9.0},
];
precioAngulos.forEach(a=>{
  s.addText(a.t,{x:a.x,y:1.7,w:3.85,h:0.35,fontFace:POP,bold:true,fontSize:12.5,color:PETROLEO,align:"center"});
  s.addText(a.sub,{x:a.x,y:2.02,w:3.85,h:0.3,fontFace:POP,fontSize:8.5,italic:true,color:GREY,align:"center"});
  s.addChart(p.ChartType.pie,[{name:"Precio",labels:a.labels,values:a.vals}],{
    x:a.x,y:2.35,w:3.85,h:3.6,chartColors:precioColors,
    showLegend:false,showPercent:true,showLabel:false,dataLabelColor:"FFFFFF",dataLabelFontSize:10,dataLabelFontBold:true,
    dataLabelPosition:"bestFit",
  });
});
const precioLeg=["Inversión Total (costo)","Comisión de venta (5,5%)","IVA del desarrollador (1,5% efectivo s/venta)","Margen neto"];
precioLeg.forEach((t,i)=>{
  const xx=0.6+i*3.1;
  s.addShape(p.ShapeType.rect,{x:xx,y:6.15,w:0.14,h:0.14,fill:{color:precioColors[i]}});
  s.addText(t,{x:xx+0.22,y:6.12,w:2.8,h:0.42,fontFace:POP,fontSize:8.3,color:PETROLEO,valign:"top"});
});
footer(s);

// ============ 20 — RIESGOS ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Riesgos clave"); title(s,"Lo que todo inversor debe saber");
const riesgos=[
  ["Estructural","🔴","Opinión profesional pendiente sobre si la estructura soporta el piso adicional del Ángulo 2, sin refuerzo mayor."],
  ["Terreno","🟢","Resuelto — el AMC sugería un terreno vacío de ~USD 380/m² (~2x menos que el implícito, ~768/m²); el founder explicó la diferencia como valor de casa preexistente + demolición (regla D-071 ya vigente)."],
  ["Mercado","🟡","La plusvalía de zona a 2 años (20%/año) es un dato del founder, no una tasación de tercero."],
  ["Ejecución","🟡","El mix de unidades chicas de Ángulo 2/3 es ilustrativo — falta un arquitecto que confirme que entra en la envolvente aprobada."],
  ["Construcción","🟢","Obra parcialmente construida (73,5%) reduce el riesgo frente a un terreno vacío."],
  ["Financiero","🟢","Márgenes positivos en los 3 diseños, en todo el rango de precio, con IVA del desarrollador ya descontado."],
];
table(s,["Categoría","Estado","Detalle"],riesgos,0.6,1.95,12.1,[2.0,1.0,9.1],{rowH:0.56,fs:10});
footer(s);

// ============ 21 — DUE DILIGENCE + TESIS ============
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Due diligence y tesis de inversión"); title(s,"Qué está confirmado, y por qué conviene");
const dd=[["Identidad del vendedor","VERIFICADO"],["Título, gravámenes y embargos","VERIFICADO"],["Base del IVA del desarrollador","VERIFICADO"],["Política de precios vs. comparables","VERIFICADO"],["Opinión estructural (piso adicional)","CRÍTICO ANTES DE INVERTIR"]];
table(s,["Ítem","Estado"],dd,0.6,1.95,5.6,[3.6,2.0],{rowH:0.42,fs:10});
const tesis=["Estructura ya construida al 73,5% — menos riesgo y tiempo que empezar de cero","Precio de entrada validado contra múltiples referencias independientes de mercado","Margen positivo en los 3 diseños, en todo el rango de precio analizado","Demanda y plusvalía reales de la zona, confirmadas con datos de mercado","Déficit de caja detectado con solución concreta ya modelada"].map((t,j)=>({text:t,options:{bullet:{indent:14},breakLine:j<4,paraSpaceAfter:9}}));
s.addText(tesis,{x:6.85,y:1.95,w:5.9,h:4.6,fontFace:POP,fontSize:11.5,color:PETROLEO,lineSpacing:16});
footer(s);

// ============ 22 — CIERRE ============
s=p.addSlide(); s.background={color:TIERRA};
s.addImage({path:ISO_INV,x:0.6,y:0.6,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.28,y:0.62,w:8,h:0.5,fontFace:LORA,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Sumate al desarrollo del\nEdificio Barrio Herrera",{x:0.6,y:2.3,w:11,h:1.9,fontFace:LORA,fontSize:36,color:CREMA,lineSpacing:42});
s.addText("Juan José Castillo",{x:0.6,y:4.6,w:11,h:0.5,fontFace:LORA,fontSize:19,color:CREMA});
s.addText("Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",{x:0.6,y:5.1,w:11,h:0.4,fontFace:POP,fontSize:12.5,color:"F0DDD5"});
s.addText("+595 982 853 111     ·     juancastillo@meridianocapital.net     ·     www.meridianocapital.net",{x:0.6,y:5.6,w:12,h:0.4,fontFace:POP,fontSize:12.5,color:CREMA});
s.addText("Documento preliminar y no vinculante. Contiene visualizaciones y planos preliminares del desarrollador original, sujetos a cambios, e información ilustrativa para los diseños Ángulo 2/3. Sujeto a la opinión estructural pendiente y a los términos finales del boleto de compraventa. Ver el apéndice Data Room (contracts/cases/HERRERA-001/) para el detalle completo y las fuentes.",{x:0.6,y:6.35,w:12.1,h:0.85,fontFace:POP,fontSize:9,color:"F0DDD5",italic:true,lineSpacing:12});

const outDir = __dirname + "/../../contracts/cases/HERRERA-001/entregables";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
p.writeFile({fileName:outDir+"/HERRERA-001_Investor_Book.pptx"}).then(f=>console.log("OK:",f));
