// Urbannit — Propuesta de trabajo para propietarios.
// Fuente: "Propuesta de trabajo para propietarios.pdf" (aportado por el founder, 2026-08-12),
// reformateado con la identidad de marca de Urbannit (brand/10-arquitectura-meridiano-urbannit.md):
// Poppins unica familia, paleta Ka'a verde/sand/carbon/dorado, respaldo obligatorio "gestionado
// por Meridiano Capital" en toda pieza formal (regla que el propio documento fuente NO cumplia).
// Contenido: el mismo, sin inventar cifras nuevas -- se removieron las notas internas de guion
// ("Como explicarlo:") y se paso a voseo paraguayo consistente con el resto del sistema de marca
// (GRAMMAR-AUDIT.md ya habia señalado esta inconsistencia en el documento original).
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Footer, PageNumber } = docx;
const fs = require("fs");

const KAA="45573A", KAA_D="374630", SAND="F1E8D8", CARBON="3A2E22", GOLD="C9982E", GOLD_D="A87D22", CREAM="FBF7EF", GREY="7C7264", LINE="D8CDB8";
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
const isoDark=fs.readFileSync("urb_iso.png");

// ---------- PORTADA ----------
const portada=[
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:1000,after:0},children:[new ImageRun({type:"png",data:isoGold,transformation:{width:64,height:64}})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:40},children:[new TextRun({text:"URBANNIT",font:POP,bold:true,size:32,color:CARBON,characterSpacing:80})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:460},children:[new TextRun({text:"gestionado por Meridiano Capital",font:POP,italics:true,size:18,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"PROPUESTA DE TRABAJO",font:POP,bold:true,size:38,color:KAA})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:340},children:[new TextRun({text:"para propietarios",font:POP,size:26,color:CARBON,italics:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Cómo trabajamos tu propiedad en alquiler temporal, paso a paso: qué necesitamos de tu parte, qué hacemos nosotros, y cómo se organizan los pagos.",font:POP,size:20,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Documento confidencial preparado para [NOMBRE DEL PROPIETARIO]",font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Asunción, Paraguay",font:POP,size:18,color:GREY})]}),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- INTRODUCCIÓN ----------
const sIntro=[
  H1("","Cómo funcionaría la gestión de tu propiedad"),
  P("Esta propuesta te explica, en orden, cómo vamos a trabajar tu propiedad en alquiler temporal: qué necesitamos de tu parte, qué hacemos nosotros, cómo se gestionan los pagos, y cómo se organiza todo para que funcione bien desde el primer día."),
  quote("La idea es ayudarte a rentabilizar tu propiedad en alquiler temporal sin que tengas que ocuparte de toda la parte compleja del día a día. Nosotros organizamos la gestión para que el apartamento esté bien posicionado, bien presentado y bien llevado en las plataformas."),
  sp(80),
  P("Esto no es solo subir un anuncio: es trabajar tu propiedad de forma profesional para que genere más ingresos, con mejor ocupación y con una operativa organizada. Requiere preparación, cierto equipamiento, coordinación, y una estrategia de precios y gestión constante — el valor está en hacerlo bien para que funcione, no solo en publicarla."),
  H2("El proceso, de punta a punta"),
  bullet("1. Primera conversación y relevamiento de tu propiedad"),
  bullet("2. Recogida de información completa del apartamento"),
  bullet("3. Preparación y equipamiento"),
  bullet("4. Fotografía profesional"),
  bullet("5. Firma de contrato entre las partes"),
  bullet("6. Creación y publicación de anuncios en plataformas"),
  bullet("7. Configuración de precios, calendario y estrategia"),
  bullet("8. Gestión diaria de reservas y huéspedes"),
  bullet("9. Coordinación operativa: check-in, check-out, limpieza y mantenimiento"),
  bullet("10. Liquidación mensual, con el detalle completo de reservas e ingresos"),
];

// ---------- 1. INFORMACIÓN DE LA PROPIEDAD ----------
const s1=[
  H1("1.","Información que necesitamos de tu propiedad"),
  P("Antes de preparar el anuncio y definir la estrategia, necesitamos relevar tu propiedad con vos. Sin esta base no podemos posicionarla correctamente."),
  H2("Datos básicos"),
  bullet("Dirección exacta y barrio/zona"),
  bullet("Tipo de propiedad y metros aproximados"),
  bullet("Número de habitaciones y baños"),
  bullet("Capacidad máxima de huéspedes"),
  bullet("Si tiene balcón, terraza, patio o cochera"),
  H2("Datos del edificio"),
  bullet("Amenities: piscina, gimnasio, seguridad/portería, ascensor, lavandería, estacionamiento"),
  bullet("Normas del edificio"),
  H2("Datos prácticos"),
  bullet("Internet/wifi, aire acondicionado, agua caliente, televisión"),
  bullet("Sistema de cerradura/acceso y horario de entrada"),
  bullet("Si hay alguna restricción del edificio para alquiler temporal"),
  H2("Información comercial"),
  bullet("Qué tipo de huésped puede atraer tu propiedad — ejecutivos, parejas, turistas, estancias medias"),
  bullet("Si conviene alquilarla por noches, por semanas, por mensualidades, o combinar todo"),
];

// ---------- 2. PREPARACIÓN Y EQUIPAMIENTO ----------
const s2=[
  H1("2.","Preparación y equipamiento"),
  P("Tu propiedad tiene que estar equipada para recibir huéspedes con comodidad y para que la operativa funcione bien en la práctica. Un apartamento bien montado transmite calidad, mejora las reseñas y permite cobrar mejor."),
  H2("Ropa de cama y baño"),
  P("Recomendamos un mínimo de 3 juegos de sábanas, toallas de baño y toallas pequeñas — uno en uso, uno en lavado y uno de reemplazo. Esto evita problemas operativos y mejora mucho la organización. Sumá 1 toalla grande y 1 pequeña por huésped, alfombra de baño y, si es posible, toallas de pileta aparte."),
  H2("Cocina equipada"),
  P("La cocina tiene que estar lista para que alguien pueda quedarse unos días sin sentir que faltan cosas básicas:"),
  bullet("Ollas y sartenes de distintos tamaños"),
  bullet("Vajilla completa: platos llanos, hondos y de postre, vasos, copas, bowls, tazas"),
  bullet("Cubiertos completos, cuchillo de cocina bueno, tabla para cortar"),
  bullet("Abrelatas, sacacorchos, cucharón, espátula, colador, ensaladera, fuentes para servir"),
  bullet("Electrodomésticos: cafetera, hervidor, microondas, heladera, cocina/horno, tostadora si es posible"),
  H2("Baño"),
  bullet("Alfombra de baño, dispensador de jabón, papel higiénico, botiquín básico"),
  bullet("Dispensadores de champú, crema y jabón de ducha"),
  bullet("Secador de pelo, basurero, cepillo de inodoro, sopapa"),
  H2("Limpieza y mantenimiento"),
  bullet("Plancha y tabla de planchar, tendedero plegable"),
  bullet("Trapo de piso, repasadores, esponja, virulana, escoba, palita, plumero, mopa y balde"),
  bullet("Si hay parrilla: kit de limpieza y kit churrasquero"),
  H2("Lavado y secado"),
  P("Recomendamos también lavarropas, tendedero para secar ropa y broches — sobre todo si querés atraer ejecutivos o estancias medias, huéspedes que se quedan más de unos pocos días."),
  H2("Stock y almacenamiento"),
  P("Necesitamos un espacio — un armario cerrado, un pequeño depósito, o un lugar en el edificio — donde guardar sábanas y toallas extra, amenities de reposición, productos de limpieza e insumos operativos. Sin un lugar para guardar recambios, la gestión se complica y eso termina afectando el servicio."),
];

// ---------- 3. FOTOS Y PUBLICACIÓN ----------
const s3=[
  H1("3.","Fotografía y publicación"),
  H2("Antes de la sesión de fotos"),
  P("Tu propiedad debe estar limpia, ordenada, bien iluminada (con las luces encendidas), sin objetos personales a la vista, con las camas bien vestidas y con la decoración lo más neutra y agradable posible."),
  H2("Firma de contrato"),
  P("Antes de empezar a operar, firmamos un contrato entre las partes."),
  H2("Publicación en plataformas"),
  quote("Nosotros nos ocupamos de toda la parte digital y comercial de tu propiedad. Preparamos el anuncio, lo subimos a las plataformas y lo dejamos bien presentado para que compita de forma profesional."),
];

// ---------- 4. PRECIOS Y GESTIÓN ----------
const s4=[
  H1("4.","Precios, estrategia y gestión diaria"),
  H2("Configuración de precios"),
  P("Una vez creado el anuncio, el precio no queda fijo. Hay meses mejores y otros más flojos, y ajustamos las tarifas según mercado y demanda real, con la lógica de temporada baja, media y alta."),
  quote("No trabajamos con un precio fijo todo el año, porque eso hace perder dinero. La idea es adaptar la tarifa al mercado para intentar sacar el mejor rendimiento posible en cada momento."),
  sp(80),
  H2("Gestión diaria de reservas y huéspedes"),
  P("Una vez que tu propiedad está publicada y funcionando, seguimos trabajando encima de forma constante: respondemos mensajes, atendemos consultas, gestionamos solicitudes y reservas, revisamos el calendario, ajustamos precios si hace falta, controlamos la disponibilidad y mejoramos el anuncio cuando es necesario."),
  quote("Una vez que la propiedad está en marcha, nosotros seguimos trabajando encima: gestionamos mensajes, reservas, calendario, precios y todo lo que haga falta para que funcione bien."),
];

// ---------- 5. COORDINACIÓN OPERATIVA ----------
const s5=[
  H1("5.","Coordinación operativa"),
  P("Acá se conecta el trabajo online con la operativa local. Cada vez que entra una reserva, coordinamos check-in, check-out, limpieza, recambio de ropa de cama, revisión del apartamento y mantenimiento si hace falta."),
  H2("Sobre la limpieza"),
  P("La limpieza se plantea como un cargo independiente que paga el huésped — no como un costo que reduce tu ingreso como propietario. En Asunción, para un apartamento de 1 habitación, el valor habitual se mueve aproximadamente entre 20 y 30 USD por estancia, según el nivel y la operativa."),
  quote("La limpieza la paga el huésped como cargo aparte. No sale de tu ingreso como propietario. Eso nos permite mantener el apartamento bien presentado sin perjudicar tu rentabilidad."),
];

// ---------- 6. PAGOS Y LIQUIDACIÓN ----------
const s6=[
  H1("6.","Pagos y liquidación mensual"),
  P("Los pagos a los propietarios se hacen de forma mensual. Al cierre del mes hacemos la liquidación, te pasamos el detalle completo y realizamos el pago correspondiente."),
  H2("Qué te entregamos cada mes"),
  bullet("Reservas recibidas y fechas de cada estancia"),
  bullet("Precio cobrado en cada reserva"),
  bullet("Ingresos generados"),
  bullet("Comisiones y gastos aplicados, incluida la limpieza si corresponde"),
  bullet("Importe final que te corresponde cobrar"),
  quote("A final de cada mes te pasamos el detalle completo de las reservas y de los precios cobrados, para que veas exactamente qué se generó y cuánto te corresponde recibir."),
  sp(80),
  P("Los valores que presentamos a lo largo de esta propuesta son estimaciones prudentes, basadas en el mercado actual — preferimos ser conservadores en la previsión y trabajar después para mejorar esos resultados.",{i:true,size:18,color:GREY}),
  P("Cifra ilustrativa, no constituye garantía de rentabilidad.",{i:true,size:16,color:GREY}),
];

// ---------- 7. QUÉ APORTA CADA PARTE ----------
const s7=[
  H1("7.","Qué aporta cada parte"),
  H2("Vos aportás"),
  bullet("La propiedad"),
  bullet("El equipamiento necesario"),
  bullet("La autorización para trabajarla en alquiler temporal"),
  bullet("La colaboración inicial para dejar todo listo"),
  H2("Nuestro equipo de Operativa local aporta"),
  bullet("Contacto presencial y coordinación con vos"),
  bullet("Organización en terreno"),
  bullet("Limpieza, check-in y check-out"),
  bullet("Apoyo operativo y resolución local de incidencias"),
  H2("Nuestro equipo de Gestión digital aporta"),
  bullet("Publicación en plataformas y optimización del anuncio"),
  bullet("Estrategia de precios y calendario"),
  bullet("Mensajes y reservas"),
  bullet("Seguimiento y mejora continua"),
];

// ---------- CIERRE ----------
const cierre=[
  new Paragraph({children:[new PageBreak()]}),
  new Paragraph({spacing:{before:200,after:200},border:{top:{style:BorderStyle.SINGLE,size:8,color:LINE}},children:[new TextRun({text:"",size:2})]}),
  new Paragraph({spacing:{after:80},children:[new TextRun({text:"Empecemos a trabajar tu propiedad.",font:POP,bold:true,size:26,color:KAA})]}),
  P("Esta propuesta queda a tu disposición para conversarla con más detalle — cualquier duda sobre el proceso, el equipamiento o los pagos, escribinos directo."),
  sp(200),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"URBANNIT",font:POP,bold:true,size:20,color:CARBON,characterSpacing:40})]}),
  new Paragraph({spacing:{after:180},children:[new TextRun({text:"gestionado por Meridiano Capital",font:POP,italics:true,size:16,color:GREY})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Juan José Castillo",font:POP,bold:true,size:22,color:CARBON})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",font:POP,size:17,color:"2A2620"})]}),
  new Paragraph({children:[new TextRun({text:"+595 982 853 111 · urbannit@meridianocapital.net · www.meridianocapital.net",font:POP,size:17,color:GREY})]}),
];

const doc=new Document({
  creator:"Urbannit — gestionado por Meridiano Capital", title:"Propuesta de trabajo para propietarios",
  styles:{default:{document:{run:{font:POP,size:20}}}},
  sections:[{
    properties:{page:{margin:{top:900,bottom:900,left:1000,right:1000}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:"Urbannit, gestionado por Meridiano Capital · Propuesta de trabajo para propietarios · Página ",font:POP,size:15,color:GREY}),
      new TextRun({children:[PageNumber.CURRENT],font:POP,size:15,color:GREY})]})]})},
    children:[...portada,...sIntro,...s1,...s2,...s3,...s4,...s5,...s6,...s7,...cierre],
  }],
});

Packer.toBuffer(doc).then(buf=>{fs.writeFileSync("Urbannit_Propuesta_Propietarios.docx",buf);console.log("OK: Urbannit_Propuesta_Propietarios.docx");});
