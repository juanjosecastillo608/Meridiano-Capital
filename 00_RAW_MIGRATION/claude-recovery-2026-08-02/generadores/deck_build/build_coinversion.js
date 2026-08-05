// Deck de Coinversión Inmobiliaria — Meridiano Capital (puro, sin mezclar con Programa/Individual)
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226", FILA="F7F4EE", LINEA="DAD2C0", GOLD_D="A87D22";
const LORA="Lora", POP="Poppins";
const W=13.333, H=7.5, ISO="isotipo.png", ISO_INV="isotipo_inverso.png";

function footer(s,n,dark){const col=dark?"9DA8AC":GREY;
  s.addImage({path:dark?ISO_INV:ISO,x:0.55,y:H-0.72,w:0.32,h:0.32});
  s.addText("Meridiano Capital · Coinversión · Confidencial",{x:0.95,y:H-0.72,w:8,h:0.32,fontFace:POP,fontSize:8,color:col,valign:"middle"});
  s.addText(String(n).padStart(2,"0"),{x:W-1.1,y:H-0.72,w:0.6,h:0.32,fontFace:POP,fontSize:8,color:col,align:"right",valign:"middle"});}
function eyebrow(s,t,dark){s.addText(t.toUpperCase(),{x:0.6,y:0.55,w:11.5,h:0.3,fontFace:POP,bold:true,fontSize:11,color:dark?LAPACHO:GOLD_D,charSpacing:3,valign:"middle"});}
function title(s,t,dark,sz){s.addText(t,{x:0.6,y:0.9,w:12.1,h:0.95,fontFace:LORA,bold:true,fontSize:sz||29,color:dark?CREMA:PETROLEO,lineSpacing:(sz||29)+3});}
function twoCards(s,arr,y,h){arr.forEach((c,i)=>{const x=0.6+i*6.15;
  s.addShape(p.ShapeType.rect,{x,y,w:5.9,h,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(c[0],{x:x+0.4,y:y+0.25,w:5.1,h:0.5,fontFace:LORA,bold:true,fontSize:19,color:PETROLEO});
  if(c[1])s.addText(c[1],{x:x+0.4,y:y+0.75,w:5.1,h:0.4,fontFace:POP,bold:true,fontSize:12.5,color:TIERRA});
  const items=c[2].map((t,j)=>({text:t,options:{bullet:{indent:15},breakLine:j<c[2].length-1,paraSpaceAfter:8}}));
  s.addText(items,{x:x+0.45,y:y+(c[1]?1.25:0.85),w:5.0,h:h-1.4,fontFace:POP,fontSize:12.5,color:PETROLEO,lineSpacing:17});});}

// 1 — PORTADA
let s=p.addSlide(); s.background={color:PETROLEO};
s.addImage({path:ISO_INV,x:0.6,y:0.55,w:0.6,h:0.6});
s.addText("MERIDIANO CAPITAL",{x:1.35,y:0.6,w:8,h:0.5,fontFace:LORA,bold:true,fontSize:18,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("ASUNCIÓN, PARAGUAY · 2026",{x:0.65,y:2.5,w:8,h:0.35,fontFace:POP,bold:true,fontSize:12,color:LAPACHO,charSpacing:3});
s.addText("Coinversión\nInmobiliaria",{x:0.6,y:2.95,w:11,h:1.8,fontFace:LORA,bold:true,fontSize:46,color:CREMA,lineSpacing:50});
s.addText("Participá, junto a otros inversores, en el desarrollo de proyectos inmobiliarios en Asunción, con estructuración profesional y retorno alineado.",{x:0.65,y:5.0,w:9,h:0.9,fontFace:POP,fontSize:14,color:"C7CFD2",lineSpacing:22});
s.addText("Documento para inversores calificados — no constituye una oferta vinculante.",{x:0.65,y:6.3,w:11,h:0.4,fontFace:POP,italic:true,fontSize:12,color:"9DA8AC"});

// 2 — CONTEXTO MACRO
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Un mercado en consolidación"); title(s,"Paraguay 2026: el contexto que sostiene la oportunidad");
const st=[["Grado de Inversión","Otorgado por Moody's al riesgo soberano paraguayo"],["~4,4%","Crecimiento económico anual proyectado"],["~80.000","Radicaciones de extranjeros proyectadas para 2026"],["4 países","Orígenes principales: Brasil, Argentina, Alemania y España"]];
st.forEach((d,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.1,w:2.8,h:2.9,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(d[0],{x:x+0.2,y:2.45,w:2.45,h:1.05,fontFace:LORA,bold:true,fontSize:d[0].length>8?19:29,color:TIERRA,valign:"middle"});
  s.addText(d[1],{x:x+0.2,y:3.55,w:2.45,h:1.3,fontFace:POP,fontSize:12,color:GREY,lineSpacing:17});});
s.addText("En este contexto, la calidad constructiva y la estructuración legal-financiera de cada proyecto son determinantes. La coinversión permite acceder a desarrollos que, individualmente, quedarían fuera de alcance.",{x:0.6,y:5.4,w:12,h:1,fontFace:POP,fontSize:14,color:PETROLEO,italic:true,lineSpacing:22});
footer(s,2);

// 3 — QUÉ ES LA COINVERSIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El concepto"); title(s,"Qué es la coinversión inmobiliaria");
s.addText("Varios inversores aportan capital a un vehículo común para desarrollar un proyecto inmobiliario que, por su escala, ninguno emprendería en soledad. Meridiano origina el proyecto, estructura el vehículo y gestiona la obra y la comercialización. Cada inversor participa del retorno según su aporte.",{x:0.6,y:1.85,w:12,h:1.2,fontFace:POP,fontSize:15,color:PETROLEO,lineSpacing:23});
const tres=[["Acceso","Entrás a proyectos de mayor escala y potencial que una compra individual."],["Gestión profesional","Meridiano estructura, construye y comercializa, con 16 años de trayectoria técnica."],["Interés alineado","Meridiano cobra su carry solo si vos ya recuperaste tu capital más el retorno preferente."]];
tres.forEach((t,i)=>{const x=0.6+i*4.05;
  s.addShape(p.ShapeType.rect,{x,y:3.5,w:3.8,h:2.6,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(t[0],{x:x+0.35,y:3.8,w:3.1,h:0.5,fontFace:LORA,bold:true,fontSize:18,color:TIERRA});
  s.addText(t[1],{x:x+0.35,y:4.4,w:3.15,h:1.5,fontFace:POP,fontSize:12.5,color:GREY,lineSpacing:18});});
footer(s,3);

// 4 — EL PROCESO DE COINVERSIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El proceso de coinversión"); title(s,"De la originación a la distribución");
const fases=[["1","Originación","Meridiano identifica y evalúa el proyecto de desarrollo"],["2","Estructuración","Se constituye el vehículo (S.A. o Fideicomiso) y sus reglas"],["3","Ronda de capital","Los inversores aportan y se cierra el capital comprometido"],["4","Desarrollo","Gestión de obra y comercialización durante la construcción"],["5","Distribución","Salida y reparto según el waterfall acordado"]];
fases.forEach((f,i)=>{const x=0.6+i*2.44;
  s.addShape(p.ShapeType.rect,{x,y:2.7,w:2.24,h:2.7,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(f[0],{x:x+0.25,y:2.9,w:0.9,h:0.9,fontFace:LORA,bold:true,fontSize:34,color:LAPACHO});
  s.addText(f[1],{x:x+0.25,y:3.85,w:1.85,h:0.55,fontFace:LORA,bold:true,fontSize:14,color:PETROLEO,lineSpacing:16});
  s.addText(f[2],{x:x+0.25,y:4.4,w:1.85,h:0.9,fontFace:POP,fontSize:10,color:GREY,lineSpacing:13});
  if(i<4)s.addText("›",{x:x+2.22,y:3.6,w:0.28,h:0.5,fontFace:POP,fontSize:20,color:TIERRA,align:"center",valign:"middle"});});
footer(s,4);

// 5 — EL VEHÍCULO
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"El vehículo"); title(s,"Sociedad Anónima o Fideicomiso, según la escala");
twoCards(s,[
  ["Sociedad Anónima",null,["Persona jurídica propia, con accionistas","Directorio flexible — control activo del gestor","Costo y tiempo de constitución moderados","Familiar para el inversor extranjero","Recomendado para menor escala o grupos acotados"]],
  ["Fideicomiso de Administración",null,["Patrimonio autónomo, fiduciario regulado","Mayor formalidad y separación patrimonial","Costo inicial más alto, estructura más robusta","Mayor protección para tickets grandes","Recomendado para mayor escala o inversores no relacionados"]],
],2.2,4.2);
footer(s,5);

// 6 — ECONOMICS (dark)
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Economics del vehículo",true); title(s,"Tres componentes, alineados con tu resultado",true);
const fees=[["Fee de Estructuración","1,5% – 3%","del capital comprometido, al cierre de la ronda"],["Fee de Gestión de Obra","2% – 4%","del costo de obra, durante la construcción"],["Carried Interest","15% – 20%","de la ganancia sobre el retorno preferente del 8% anual — solo tras devolver capital + hurdle"]];
fees.forEach((f,i)=>{const x=0.6+i*4.05;
  s.addShape(p.ShapeType.rect,{x,y:2.3,w:3.8,h:3.6,fill:{color:NAVY2},line:{color:"2A4A52",width:1}});
  s.addText(String(i+1),{x:x+0.35,y:2.55,w:1,h:0.5,fontFace:POP,bold:true,fontSize:13,color:LAPACHO});
  s.addText(f[0],{x:x+0.35,y:3.05,w:3.1,h:0.7,fontFace:LORA,bold:true,fontSize:17,color:CREMA,lineSpacing:20});
  s.addText(f[1],{x:x+0.35,y:3.75,w:3.1,h:0.7,fontFace:LORA,bold:true,fontSize:26,color:LAPACHO});
  s.addText(f[2],{x:x+0.35,y:4.5,w:3.2,h:1.3,fontFace:POP,fontSize:11.5,color:"C7CFD2",lineSpacing:16});});
s.addText("El carry solo se cobra si vos ya recuperaste tu capital más el retorno preferente. Nuestra ganancia depende de la tuya.",{x:0.6,y:6.15,w:12,h:0.5,fontFace:POP,italic:true,fontSize:13,color:"9DA8AC"});
footer(s,6,true);

// 7 — WATERFALL
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Orden de retornos (waterfall)"); title(s,"Caso ilustrativo — capital USD 500.000, 24 meses",false,26);
const rows=[["1","Devolución de capital a inversores","500.000"],["2","Retorno preferente (hurdle 8% anual × 2 años)","80.000"],["3","Ganancia remanente a repartir","70.000"],["4a","80% del remanente → inversores","56.000"],["4b","20% del remanente → carried interest","14.000"]];
const ty=2.1,rh=0.62;
s.addShape(p.ShapeType.rect,{x:0.6,y:ty,w:12.1,h:rh,fill:{color:PETROLEO}});
s.addText("Paso",{x:0.75,y:ty,w:1,h:rh,fontFace:POP,bold:true,fontSize:12,color:CREMA,valign:"middle"});
s.addText("Descripción",{x:1.9,y:ty,w:7.5,h:rh,fontFace:POP,bold:true,fontSize:12,color:CREMA,valign:"middle"});
s.addText("Monto (USD)",{x:10,y:ty,w:2.5,h:rh,fontFace:POP,bold:true,fontSize:12,color:CREMA,align:"right",valign:"middle"});
rows.forEach((r,i)=>{const y=ty+rh*(i+1);
  s.addShape(p.ShapeType.rect,{x:0.6,y,w:12.1,h:rh,fill:{color:i%2?FILA:"FFFFFF"},line:{color:LINEA,width:0.5}});
  s.addText(r[0],{x:0.75,y,w:1,h:rh,fontFace:POP,bold:true,fontSize:12,color:TIERRA,valign:"middle"});
  s.addText(r[1],{x:1.9,y,w:7.5,h:rh,fontFace:POP,fontSize:12,color:PETROLEO,valign:"middle"});
  s.addText(r[2],{x:10,y,w:2.5,h:rh,fontFace:POP,bold:i>=3,fontSize:12,color:PETROLEO,align:"right",valign:"middle"});});
s.addText([{text:"El inversor recupera capital + hurdle + su parte del remanente = ",options:{color:PETROLEO}},{text:"USD 636.000 (27,2% en 24 meses).",options:{bold:true,color:TIERRA}}],{x:0.6,y:ty+rh*6+0.15,w:12,h:0.5,fontFace:POP,fontSize:13,lineSpacing:18});
footer(s,7);

// 8 — RETORNO PROYECTADO (dark chart)
s=p.addSlide(); s.background={color:PETROLEO};
eyebrow(s,"Retorno proyectado",true); title(s,"Composición del retorno al inversor",true);
s.addChart(p.ChartType.bar,[{name:"USD",labels:["Capital","Retorno preferente","Parte del remanente"],values:[500000,80000,56000]}],
  {x:0.6,y:2.1,w:7,h:4.4,barDir:"bar",chartColors:[LAPACHO,"3E6670","6B8A92"],showValue:true,dataLabelPosition:"outEnd",dataLabelColor:CREMA,dataLabelFontFace:POP,dataLabelFontSize:11,showLegend:false,showTitle:false,valAxisHidden:true,catAxisLabelColor:CREMA,catAxisLabelFontFace:POP,catAxisLabelFontSize:12,valGridLine:{style:"none"},catGridLine:{style:"none"},valAxisMaxVal:600000});
s.addShape(p.ShapeType.rect,{x:8.1,y:2.4,w:4.6,h:3.8,fill:{color:NAVY2},line:{color:"2A4A52",width:1}});
s.addText("USD 636.000",{x:8.35,y:2.9,w:4.1,h:0.8,fontFace:LORA,bold:true,fontSize:34,color:LAPACHO});
s.addText("Retorno total al inversor\n(27,2% en 24 meses)",{x:8.35,y:3.8,w:4.1,h:0.8,fontFace:POP,fontSize:14,color:CREMA,lineSpacing:19});
s.addText("~13,2%",{x:8.35,y:4.75,w:4.1,h:0.5,fontFace:LORA,bold:true,fontSize:22,color:CREMA});
s.addText("Retorno anualizado simple estimado",{x:8.35,y:5.25,w:4.1,h:0.4,fontFace:POP,fontSize:11.5,color:"9DA8AC"});
s.addText("Cifras ilustrativas. El retorno real depende del desempeño del proyecto y no está garantizado.",{x:0.6,y:6.6,w:12,h:0.35,fontFace:POP,fontSize:9.5,color:"7C878B",italic:true});
footer(s,8,true);

// 9 — GESTIÓN POST-INVERSIÓN
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Renta del proyecto desarrollado"); title(s,"Al terminar la obra: vender o rentar");
twoCards(s,[
  ["Renta Tradicional",null,["Contrato de locación de largo plazo, inquilino estable","Rentabilidad bruta de referencia: 6% – 10% anual","Gestión directa del equipo de Meridiano","Objetivo de rentabilidad neta de cartera: 10%"]],
  ["Renta Temporal",null,["Estadías cortas en zonas de alta demanda","Rentabilidad bruta de referencia: 10% – 16%+ anual","Operada con aliado de 20+ años en el rubro","Meridiano origina y reporta; el aliado ejecuta"]],
],2.2,4.1);
footer(s,9);

// 10 — GOBERNANZA Y REPORTE
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Gobernanza y reporte"); title(s,"Transparencia durante todo el horizonte");
const gob=[["Gestión operativa","El estructurador conserva las decisiones técnicas de obra y comercialización."],["Decisiones reservadas a inversores","Cambios materiales de presupuesto · extensión de plazo · venta anticipada del proyecto completo."],["Reporte trimestral","Informe de avance de obra y estado financiero del vehículo, cada trimestre."],["Auditoría","Estados financieros por la contadora de la red, con acceso de inversores a la documentación."]];
gob.forEach((g,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*6.15,yy=2.2+row*2.05;
  s.addShape(p.ShapeType.rect,{x,y:yy,w:5.9,h:1.8,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addText(g[0],{x:x+0.35,y:yy+0.25,w:5.2,h:0.5,fontFace:LORA,bold:true,fontSize:16,color:PETROLEO});
  s.addText(g[1],{x:x+0.35,y:yy+0.8,w:5.25,h:0.9,fontFace:POP,fontSize:12,color:GREY,lineSpacing:16});});
footer(s,10);

// 11 — RED DE ALIADOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Red de aliados profesionales"); title(s,"Cada etapa, respaldada por especialistas");
const al=[["Abogado","Constitución del vehículo, revisión contractual, debida diligencia"],["Escribano","Escrituración y protocolización de los actos"],["Contadora","RUC, facturación, régimen impositivo, cumplimiento fiscal"],["Operador Renta Temporal","20+ años — operación del circuito de renta temporal"]];
al.forEach((a,i)=>{const x=0.6+i*3.05;
  s.addShape(p.ShapeType.rect,{x,y:2.3,w:2.8,h:3.2,fill:{color:"FFFFFF"},line:{color:LINEA,width:1}});
  s.addShape(p.ShapeType.rect,{x:x+0.3,y:2.6,w:0.7,h:0.7,fill:{color:PETROLEO}});
  s.addText(a[0].substring(0,2),{x:x+0.3,y:2.6,w:0.7,h:0.7,fontFace:LORA,bold:true,fontSize:18,color:LAPACHO,align:"center",valign:"middle"});
  s.addText(a[0],{x:x+0.3,y:3.5,w:2.35,h:0.8,fontFace:LORA,bold:true,fontSize:15,color:PETROLEO,lineSpacing:18});
  s.addText(a[1],{x:x+0.3,y:4.3,w:2.35,h:1.1,fontFace:POP,fontSize:11.5,color:GREY,lineSpacing:15});});
footer(s,11);

// 12 — RIESGOS
s=p.addSlide(); s.background={color:CREMA};
eyebrow(s,"Consideraciones de riesgo"); title(s,"Lo que todo coinversor debe saber");
const ri=["Toda inversión en etapa de desarrollo está sujeta a riesgos, incluyendo demoras de obra y variación de costos de construcción.","Las condiciones de mercado al momento de vender o alquilar pueden diferir de las proyectadas en este documento.","La coinversión presenta riesgo de iliquidez durante el horizonte del proyecto — no contempla rescate anticipado de capital, salvo acuerdo expreso.","Las cifras de retorno presentadas son ilustrativas y no constituyen garantía de rentabilidad.","Se recomienda a cada inversor evaluar la oportunidad con asesoría legal, impositiva y financiera propia, independiente de Meridiano Capital."].map((t,j)=>({text:t,options:{bullet:{indent:18},breakLine:j<4,paraSpaceAfter:12}}));
s.addText(ri,{x:0.7,y:2.2,w:11.9,h:4,fontFace:POP,fontSize:14,color:PETROLEO,lineSpacing:20});
footer(s,12);

// 13 — CIERRE
s=p.addSlide(); s.background={color:TIERRA};
s.addImage({path:ISO_INV,x:0.6,y:0.6,w:0.55,h:0.55});
s.addText("MERIDIANO CAPITAL",{x:1.28,y:0.62,w:8,h:0.5,fontFace:LORA,bold:true,fontSize:16,color:CREMA,charSpacing:2,valign:"middle"});
s.addText("Coinvertí en el desarrollo\ninmobiliario de Asunción",{x:0.6,y:2.3,w:11,h:1.9,fontFace:LORA,bold:true,fontSize:40,color:CREMA,lineSpacing:44});
s.addText("Juan José Castillo",{x:0.6,y:4.7,w:11,h:0.5,fontFace:LORA,bold:true,fontSize:20,color:CREMA});
s.addText("Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",{x:0.6,y:5.2,w:11,h:0.4,fontFace:POP,fontSize:13,color:"F0DDD5"});
s.addText([{text:"+595 982 853 111",options:{bold:true}},{text:"     ·     juancastillo@meridianocapital.net     ·     www.meridianocapital.net"}],{x:0.6,y:5.75,w:12,h:0.4,fontFace:POP,fontSize:13,color:CREMA});
s.addText("Documento preliminar y no vinculante. Los términos finales quedarán establecidos en el estatuto societario o contrato de fideicomiso definitivo.",{x:0.6,y:6.7,w:12,h:0.5,fontFace:POP,fontSize:9.5,color:"F0DDD5",italic:true});

p.writeFile({fileName:"Meridiano_Deck_Coinversion.pptx"}).then(f=>console.log("OK:",f));
