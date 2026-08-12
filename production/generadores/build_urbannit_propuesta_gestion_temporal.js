// Urbannit — Propuesta de Gestión de Alquiler Temporal.
// Fuente: "Propuesta de Gestión de Alquiler Temporal.pdf" (aportado por el founder, 2026-08-12),
// reformateado con la identidad de marca de Urbannit (brand/10-arquitectura-meridiano-urbannit.md):
// Poppins unica familia, paleta Ka'a verde/sand/carbon/dorado, respaldo obligatorio "gestionado
// por Meridiano Capital". Contenido: el mismo del documento fuente (modelo de negocio, comision,
// ejemplo numerico de liquidacion), sin inventar cifras -- se removieron las notas internas de
// guion y se paso a voseo paraguayo consistente con el resto del sistema de marca.
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Footer, PageNumber } = docx;
const fs = require("fs");
const path = require("path");

// Automatizacion (2026-08-12, D-057): ver la nota identica en
// build_urbannit_propuesta_propietarios.js -- mismo mecanismo, mismas precauciones
// (nombre nunca inventado, nunca interpolado en shell).
const NOMBRE = (process.argv[2] || "").trim().slice(0, 120) || "[NOMBRE DEL PROPIETARIO]";
const OUT_DIR = process.argv[3] ? path.resolve(process.argv[3]) : __dirname;

const KAA="45573A", KAA_D="374630", SAND="F1E8D8", CARBON="3A2E22", GOLD="C9982E", GOLD_D="A87D22", GREY="7C7264", LINE="D8CDB8";
const POP="Poppins";
const TW=9000;

function H1(n,t){return new Paragraph({spacing:{before:340,after:140},keepNext:true,children:[
  new TextRun({text:n+"  ",font:POP,bold:true,size:26,color:GOLD_D}),
  new TextRun({text:t,font:POP,bold:true,size:26,color:CARBON})]});}
function H2(t){return new Paragraph({spacing:{before:220,after:100},keepNext:true,children:[
  new TextRun({text:t,font:POP,bold:true,size:21,color:KAA})]});}
function P(t,opts={}){return new Paragraph({spacing:{after:120},alignment:AlignmentType.JUSTIFIED,children:[
  new TextRun({text:t,font:POP,size:opts.size||20,color:opts.color||"2A2620",italics:opts.i||false,bold:opts.b||false})]});}
function bullet(t,level=0){return new Paragraph({bullet:{level},spacing:{after:70},children:[new TextRun({text:t,font:POP,size:19,color:"2A2620"})]});}
function num(n,t){return new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:70},children:[new TextRun({text:t,font:POP,size:19,color:"2A2620"})]});}
function allBorders(color,sz){const b={style:BorderStyle.SINGLE,size:sz,color};return {top:b,bottom:b,left:b,right:b,insideHorizontal:b,insideVertical:b};}
function cell(text,{w,head=false,bold=false,fill=null,align=AlignmentType.LEFT}={}){
  return new TableCell({width:{size:w,type:WidthType.DXA},shading:fill?{type:ShadingType.CLEAR,fill}:undefined,
    margins:{top:60,bottom:60,left:110,right:110},children:[
    new Paragraph({alignment:align,children:[new TextRun({text:text,font:POP,size:17,bold:head||bold,color:head?"FFFFFF":"2A2620"})]})]});
}
function table(headers,rows,widths){
  const trs=[new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,{w:widths[i],head:true,fill:KAA}))})];
  rows.forEach((r,ri)=>trs.push(new TableRow({children:r.map((c,i)=>cell(c,{w:widths[i],fill:ri%2?SAND:null}))})));
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:widths,borders:allBorders(LINE,4),rows:trs});
}
function quote(t){
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],borders:allBorders(GOLD_D,8),rows:[
    new TableRow({children:[new TableCell({shading:{type:ShadingType.CLEAR,fill:SAND},width:{size:TW,type:WidthType.DXA},margins:{top:140,bottom:140,left:200,right:200},children:[
      new Paragraph({children:[new TextRun({text:"“"+t+"”",font:POP,italics:true,size:20,color:CARBON})]})
    ]})]})
  ]});
}
const sp=(after=120)=>new Paragraph({spacing:{after},children:[new TextRun({text:"",size:2})]});

const isoGold=fs.readFileSync("urb_iso_gold.png");

// ---------- PORTADA ----------
const portada=[
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:1000,after:0},children:[new ImageRun({type:"png",data:isoGold,transformation:{width:64,height:64}})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:40},children:[new TextRun({text:"URBANNIT",font:POP,bold:true,size:32,color:CARBON,characterSpacing:80})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:460},children:[new TextRun({text:"gestionado por Meridiano Capital",font:POP,italics:true,size:18,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"PROPUESTA DE GESTIÓN",font:POP,bold:true,size:38,color:KAA})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:340},children:[new TextRun({text:"de alquiler temporal",font:POP,size:26,color:CARBON,italics:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Cómo funciona nuestro modelo de trabajo: de dónde vienen tus ingresos, cómo se calcula la comisión, y cómo te pagamos cada mes.",font:POP,size:20,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Documento confidencial preparado para "+NOMBRE,font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Asunción, Paraguay",font:POP,size:18,color:GREY})]}),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- INTRODUCCIÓN ----------
const sIntro=[
  H1("","Cómo trabajamos y cómo funciona el modelo"),
  P("Nos dedicamos a gestionar propiedades en alquiler temporal de forma profesional, con un objetivo muy claro: maximizar tus ingresos como propietario sin que tengas que ocuparte del día a día."),
  P("No se trata solo de alquilar el apartamento, sino de posicionarlo correctamente, optimizar precios, mantener buena ocupación y cuidar la experiencia del huésped."),
];

// ---------- 1. CÓMO FUNCIONA AIRBNB/BOOKING ----------
const s1=[
  H1("1.","Cómo funciona Airbnb/Booking"),
  P("Airbnb y Booking son plataformas donde los huéspedes reservan estancias por noches, de forma similar a un hotel. El proceso es el siguiente:"),
  bullet("Se publica el apartamento con un precio por noche"),
  bullet("Un huésped realiza una reserva"),
  bullet("La plataforma cobra el importe completo al huésped"),
  bullet("La plataforma aplica su comisión sobre la reserva"),
  bullet("El resto se convierte en ingreso generado por la estancia"),
  P("La comisión de la plataforma puede variar según la configuración de la cuenta o las herramientas utilizadas, pero en todos los casos está integrada dentro del precio que paga el huésped — no es un costo adicional directo para vos como propietario."),
];

// ---------- 2. CÓMO SE GENERAN LOS INGRESOS ----------
const s2=[
  H1("2.","Cómo se generan tus ingresos"),
  P("Tus ingresos dependen principalmente de dos factores: el precio por noche y la ocupación (cantidad de noches alquiladas). No todos los meses se comportan igual — hay temporadas más fuertes y otras más flojas. Por eso trabajamos con precios dinámicos, ajustes según demanda, y una estrategia continua."),
];

// ---------- 3. NUESTRO MODELO DE TRABAJO ----------
const s3=[
  H1("3.","Nuestro modelo de trabajo"),
  P("Trabajamos principalmente con un modelo a comisión. Esto significa que no existe un límite fijo de ingresos para vos: cuanto mejor se alquila la propiedad, más ingresos genera, y en consecuencia, mayor es el beneficio para ambas partes."),
  quote("Nuestros intereses están completamente alineados con los tuyos."),
  sp(80),
  H2("Sobre los números y estimaciones"),
  P("Los números que presentamos en esta propuesta son estimaciones basadas en el mercado actual — son prudentes, no inflados, y sirven como referencia. Pueden variar según la ocupación real, la demanda y el tipo de propiedad. La intención no es marcar un límite, sino una base sobre la que trabajar."),
  P("Cifra ilustrativa, no constituye garantía de rentabilidad.",{i:true,size:16,color:GREY}),
];

// ---------- 4. LIMPIEZA ----------
const s4=[
  H1("4.","Limpieza"),
  P("La limpieza se gestiona como un costo independiente: se cobra al huésped como un cargo adicional, no reduce tu ingreso como propietario, y cubre limpieza, lavandería y reposición básica. En Asunción, este cargo suele situarse entre 20 y 30 USD por estancia."),
];

// ---------- 5. QUÉ HACEMOS NOSOTROS ----------
const s5=[
  H1("5.","Qué hacemos nosotros"),
  H2("Parte digital y estratégica"),
  bullet("Publicación en Airbnb, Booking y otras plataformas"),
  bullet("Creación y optimización del anuncio"),
  bullet("Gestión de precios y de reservas"),
  bullet("Atención a huéspedes"),
  bullet("Control de calendario"),
  bullet("Mejora continua"),
  H2("Parte operativa (en paralelo)"),
  bullet("Check-in y check-out"),
  bullet("Limpieza"),
  bullet("Mantenimiento"),
  bullet("Coordinación diaria"),
  H2("Qué necesitamos de tu parte"),
  P("Para que la propiedad funcione correctamente, debe estar bien equipada, preparada para huéspedes y lista para operar — esto impacta directamente en el precio, la ocupación y la calidad del servicio."),
];

// ---------- 6. COBROS Y PAGOS ----------
const s6=[
  H1("6.","Cómo se cobran las reservas y cómo te pagamos"),
  H2("Cómo funciona el cobro"),
  bullet("El huésped realiza una reserva en Airbnb o Booking"),
  bullet("La plataforma cobra el importe completo al huésped"),
  bullet("Ese dinero se transfiere a la cuenta de gestión"),
  bullet("A partir de ahí, se realiza la distribución correspondiente"),
  H2("Nuestro modelo de cobro"),
  P("Centralizamos los cobros en una única cuenta de gestión. Desde ahí se descuentan las comisiones, se organizan los gastos operativos si aplica, y se liquida a cada propietario. Esto permite control total, claridad, evitar errores y llevar un seguimiento profesional."),
  H2("Tu pago"),
  P("Recibís tu dinero una vez al mes, con un resumen detallado que incluye las reservas realizadas, las fechas, el precio de cada estancia, los ingresos generados, las comisiones aplicadas y el importe final a cobrar — transparencia total."),
];

// ---------- 7. EJEMPLO ----------
const s7=[
  H1("7.","Ejemplo de liquidación"),
  P("Para que quede clara la mecánica del modelo, este es un ejemplo con números simples:"),
  H2("1. Antes de comisiones"),
  bullet("Precio por noche: 70 USD"),
  bullet("Noches ocupadas: 20"),
  bullet("Total generado: 70 × 20 = 1.400 USD"),
  H2("2. Comisión de la plataforma (Airbnb, aprox. 3%)"),
  bullet("3% de 70 USD = 2,10 USD por noche"),
  bullet("Queda después de la plataforma: 67,90 USD por noche"),
  bullet("En 20 noches: 67,90 × 20 = 1.358 USD"),
  H2("3. Comisión de Urbannit (20% sobre el precio de la noche)"),
  bullet("20% de 70 USD = 14 USD por noche"),
  bullet("En 20 noches: 14 × 20 = 280 USD"),
  H2("4. Resultado final"),
  table(
    ["Concepto","Monto"],
    [["Dinero después de la plataforma","1.358 USD"],["Comisión de Urbannit","− 280 USD"],["Tu ingreso neto del mes","1.078 USD"]],
    [6000,3000]
  ),
  sp(120),
  quote("Nosotros recibimos los pagos de las plataformas, organizamos todo y a fin de mes te hacemos una liquidación clara con todo el detalle."),
];

// ---------- CIERRE ----------
const cierre=[
  new Paragraph({children:[new PageBreak()]}),
  new Paragraph({spacing:{before:200,after:200},border:{top:{style:BorderStyle.SINGLE,size:8,color:LINE}},children:[new TextRun({text:"",size:2})]}),
  new Paragraph({spacing:{after:80},children:[new TextRun({text:"¿Charlamos sobre tu propiedad?",font:POP,bold:true,size:26,color:KAA})]}),
  P("Con esta propuesta y la de trabajo para propietarios tenés el panorama completo: cómo operamos tu propiedad día a día, y cómo funciona el modelo de ingresos detrás. Cualquier duda, estamos para conversarla."),
  sp(200),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"URBANNIT",font:POP,bold:true,size:20,color:CARBON,characterSpacing:40})]}),
  new Paragraph({spacing:{after:180},children:[new TextRun({text:"gestionado por Meridiano Capital",font:POP,italics:true,size:16,color:GREY})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Juan José Castillo",font:POP,bold:true,size:22,color:CARBON})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",font:POP,size:17,color:"2A2620"})]}),
  new Paragraph({children:[new TextRun({text:"+595 982 853 111 · urbannit@meridianocapital.net · www.meridianocapital.net",font:POP,size:17,color:GREY})]}),
];

const doc=new Document({
  creator:"Urbannit — gestionado por Meridiano Capital", title:"Propuesta de Gestión de Alquiler Temporal",
  styles:{default:{document:{run:{font:POP,size:20}}}},
  sections:[{
    properties:{page:{margin:{top:900,bottom:900,left:1000,right:1000}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:"Urbannit, gestionado por Meridiano Capital · Propuesta de Gestión de Alquiler Temporal · Página ",font:POP,size:15,color:GREY}),
      new TextRun({children:[PageNumber.CURRENT],font:POP,size:15,color:GREY})]})]})},
    children:[...portada,...sIntro,...s1,...s2,...s3,...s4,...s5,...s6,...s7,...cierre],
  }],
});

const slug = NOMBRE === "[NOMBRE DEL PROPIETARIO]" ? "" : "_" + NOMBRE.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60);
const outFile = path.join(OUT_DIR, `Urbannit_Propuesta_Gestion_Temporal${slug}.docx`);
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync(outFile,buf);console.log("OK:",outFile);});
