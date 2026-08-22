// HERRERA-001 — Documento 06: Investment Summary, one-pager para WhatsApp/email
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const p = new pptxgen();
p.defineLayout({ name: "V", width: 7.5, height: 13.333 });
p.layout = "V";
const PETROLEO="14313A", TIERRA="8B3323", LAPACHO="C9982E", CREMA="F3EDE3", GREY="6B6154", NAVY2="0D2226";
const LORA="Fraunces", POP="Poppins";
const AH = __dirname + "/assets-herrera001/brochure/";

// ---------- Fuente unica de verdad: dev_engine (D-079/D-080) ----------
const ANGULOS=JSON.parse(fs.readFileSync(__dirname+"/../../contracts/cases/HERRERA-001/entregables/HERRERA-001_dev_engine_3angulos.json","utf-8")).angulos;
function fmt0(n){ return Math.round(n).toLocaleString("es-PY"); }
function fmtP1(n){ return n.toLocaleString("es-PY",{minimumFractionDigits:1,maximumFractionDigits:1})+"%"; }

let s = p.addSlide();
s.background = { color: PETROLEO };
s.addImage({ path: AH+"00-portada-fachada.png", x:0, y:0, w:7.5, h:4.7, sizing:{type:"cover",w:7.5,h:4.7} });
s.addShape(p.ShapeType.rect,{x:0.4,y:4.4,w:6.7,h:0.32,fill:{color:"F6EEDD"},line:{color:"A87D22",width:0.75}});
s.addText("VISUALIZACIÓN — DESARROLLADOR ORIGINAL, SUJETA A CAMBIOS",{x:0.4,y:4.4,w:6.7,h:0.32,fontFace:POP,bold:true,fontSize:8,color:"A87D22",align:"center",valign:"middle"});

s.addImage({ path: "isotipo_inverso.png", x: 0.55, y: 4.9, w: 0.4, h: 0.4 });
s.addText("MERIDIANO CAPITAL", { x: 1.05, y: 4.92, w: 5.5, h: 0.36, fontFace: LORA, fontSize: 13, color: CREMA, charSpacing: 2, valign: "middle" });
s.addText("Edificio Barrio Herrera", { x: 0.55, y: 5.4, w: 6.6, h: 0.55, fontFace: LORA, fontSize: 23, color: CREMA });
s.addText("Asunción, Paraguay · Oportunidad de inversión inmobiliaria", { x: 0.55, y: 5.95, w: 6.6, h: 0.3, fontFace: POP, fontSize: 11, color: "C7CFD2" });

const a2s=ANGULOS.angulo_2;
const nums = [
  ["Inversión Total", "USD "+fmt0(a2s.inversion_total_usd)],
  ["Ingresos proyectados", "USD "+fmt0(a2s.ingresos_bajo_usd)+" – "+fmt0(a2s.ingresos_alto_usd)],
  ["Margen final, neto de comisión e IVA", "USD "+fmt0(a2s.margen_bajo_usd)+" – "+fmt0(a2s.margen_alto_usd)],
  ["ROI sobre Inversión Total", fmtP1(a2s.roi_bajo_pct)+" – "+fmtP1(a2s.roi_alto_pct)],
  ["Plazo estimado", "12 meses de obra + entrega"],
];
let y = 6.35;
nums.forEach(n=>{
  s.addShape(p.ShapeType.line,{x:0.55,y,w:6.4,h:0,line:{color:"2A4A52",width:1}});
  s.addText(n[0],{x:0.55,y:y+0.07,w:6.4,h:0.27,fontFace:POP,fontSize:10,color:"9DA8AC"});
  s.addText(n[1],{x:0.55,y:y+0.33,w:6.4,h:0.38,fontFace:LORA,fontSize:16,color:LAPACHO});
  y+=0.78;
});
s.addShape(p.ShapeType.line,{x:0.55,y,w:6.4,h:0,line:{color:"2A4A52",width:1}});

s.addShape(p.ShapeType.rect,{x:0.55,y:y+0.13,w:6.4,h:0.42,fill:{color:NAVY2},line:{color:LAPACHO,width:1}});
s.addText("RECOMENDACIÓN: NEGOCIAR / CONDICIONAR",{x:0.55,y:y+0.13,w:6.4,h:0.42,fontFace:POP,bold:true,fontSize:10.5,color:LAPACHO,align:"center",valign:"middle"});

s.addText("73,5% de la estructura ya construida · precio validado contra comparables reales · único punto pendiente: opinión estructural sobre el piso adicional.",
  {x:0.55,y:y+0.62,w:6.4,h:0.55,fontFace:POP,italic:true,fontSize:9,color:"C7CFD2",lineSpacing:12});

s.addShape(p.ShapeType.rect,{x:0.55,y:y+1.28,w:6.4,h:0.58,fill:{color:TIERRA}});
s.addText("Investor Book completo disponible a pedido",{x:0.6,y:y+1.35,w:6.3,h:0.3,fontFace:LORA,fontSize:13,color:CREMA,align:"center"});
s.addText("Respondé este mensaje y coordinamos.",{x:0.6,y:y+1.65,w:6.3,h:0.2,fontFace:POP,fontSize:9,color:"F0DDD5",align:"center"});

s.addText("Juan José Castillo  ·  +595 982 853 111  ·  juancastillo@meridianocapital.net",
  {x:0.4,y:y+2.0,w:6.7,h:0.28,fontFace:POP,fontSize:8.5,color:"9DA8AC",align:"center"});
s.addText("Documento preliminar, no vinculante. Sujeto a la opinión estructural pendiente.",
  {x:0.4,y:y+2.28,w:6.7,h:0.35,fontFace:POP,fontSize:7,italic:true,color:"6B7477",align:"center"});

const outDir = __dirname + "/../../contracts/cases/HERRERA-001/entregables";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
p.writeFile({fileName: outDir+"/HERRERA-001_Investment_Summary.pptx"}).then(f=>console.log("OK:",f));
