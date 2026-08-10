// Perfil Profesional — Juan José Castillo, CEO de Meridiano Capital.
// Base para posicionamiento, "Quiénes somos" y redes sociales (D-041/D-042, 2026-08-10).
// Alineado con la ideología de Meridiano Capital -- no introduce marca, logo ni
// paleta propios; usa el sistema visual ya oficial (Fraunces/Poppins, D-036/D-040).
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Footer, PageNumber } = docx;
const fs = require("fs");

const PET="14313A", TIE="8B3323", GOLD="C9982E", GREY="5A544C", LINEA="DAD2C0", FILA="F3EDE3", GOLD_D="A87D22";
const LORA="Fraunces", POP="Poppins";
const TW=9000;

function H1(n,t){return new Paragraph({spacing:{before:340,after:140},keepNext:true,children:[
  new TextRun({text:n+"  ",font:LORA,bold:false,size:30,color:GOLD_D}),
  new TextRun({text:t,font:LORA,bold:false,size:30,color:PET})]});}
function H2(t){return new Paragraph({spacing:{before:220,after:100},keepNext:true,children:[
  new TextRun({text:t,font:LORA,bold:false,size:23,color:PET})]});}
function P(t,opts={}){return new Paragraph({spacing:{after:120},alignment:AlignmentType.JUSTIFIED,children:[
  new TextRun({text:t,font:POP,size:opts.size||20,color:opts.color||"2A2620",italics:opts.i||false,bold:opts.b||false})]});}
function bullet(t){return new Paragraph({bullet:{level:0},spacing:{after:70},children:[new TextRun({text:t,font:POP,size:20,color:"2A2620"})]});}
function allBorders(color,sz){const b={style:BorderStyle.SINGLE,size:sz,color};return {top:b,bottom:b,left:b,right:b,insideHorizontal:b,insideVertical:b};}
function cell(text,{w,head=false,bold=false,fill=null,align=AlignmentType.LEFT}={}){
  return new TableCell({width:{size:w,type:WidthType.DXA},shading:fill?{type:ShadingType.CLEAR,fill}:undefined,
    margins:{top:60,bottom:60,left:110,right:110},children:[
    new Paragraph({alignment:align,children:[new TextRun({text:text,font:POP,size:17,bold:head||bold,color:head?"FFFFFF":"2A2620"})]})]});
}
function table(headers,rows,widths){
  const trs=[new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,{w:widths[i],head:true,fill:PET}))})];
  rows.forEach((r,ri)=>trs.push(new TableRow({children:r.map((c,i)=>cell(c,{w:widths[i],fill:ri%2?FILA:null}))})));
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:widths,borders:allBorders(LINEA,4),rows:trs});
}
function callout(title,body){
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],borders:allBorders(TIE,8),rows:[
    new TableRow({children:[new TableCell({shading:{type:ShadingType.CLEAR,fill:"F4E9E5"},width:{size:TW,type:WidthType.DXA},margins:{top:120,bottom:120,left:180,right:180},children:[
      new Paragraph({spacing:{after:60},children:[new TextRun({text:title,font:POP,bold:true,size:19,color:TIE})]}),
      new Paragraph({children:[new TextRun({text:body,font:POP,size:19,color:"3A342C"})]})
    ]})]})
  ]});
}
const sp=(after=120)=>new Paragraph({spacing:{after},children:[new TextRun({text:"",size:2})]});

const logo=fs.readFileSync("isotipo.png");

// ---------- PORTADA ----------
const portada=[
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:1200,after:0},children:[new ImageRun({type:"png",data:logo,transformation:{width:70,height:70}})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:500},children:[new TextRun({text:"MERIDIANO CAPITAL",font:LORA,bold:false,size:30,color:PET,characterSpacing:60})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"PERFIL PROFESIONAL",font:LORA,bold:false,size:40,color:PET})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"Juan José Castillo — CEO de Meridiano Capital",font:POP,size:24,color:TIE,bold:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Base de posicionamiento para \"Quiénes Somos\", LinkedIn, Instagram y presentaciones institucionales",font:POP,size:20,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Documento de trabajo interno — Asunción, Paraguay",font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Agosto 2026",font:POP,size:18,color:GREY})]}),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- 1. POSICIONAMIENTO ----------
const s1=[
  H1("1.","Posicionamiento y biografía"),
  P("Los bloques de esta sección son de copia directa (\"copy-ready\") para web, LinkedIn, Instagram y cualquier pieza institucional. Mantienen la identidad verbal oficial de Meridiano Capital (capas de mensaje, tono preciso-cálido-seguro-directo) — no reemplazan al Golden Circle de marca, lo aplican en primera persona a través de su CEO.",{i:true,size:18,color:GREY}),

  H2("1.1 One-liner (headline de LinkedIn, bio de Instagram, hero del sitio)"),
  callout("Versión larga","\"CEO de Meridiano Capital. Ayudo a inversores de Europa, Argentina, Brasil y Chile a construir y proteger patrimonio inmobiliario en Paraguay — desde la cédula y la cuenta bancaria hasta la gestión de la renta, con la mirada técnica de 16 años desarrollando y construyendo.\""),
  sp(80),
  callout("Versión corta (un renglón)","\"CEO de Meridiano Capital — Real Estate & Desarrollo en Paraguay para inversores extranjeros. De la cédula al alquiler, con base técnica en construcción.\""),

  H2("1.2 Bio corta (~50 palabras) — firma de email, tarjetas, \"About\" resumido"),
  P("Juan José Castillo es CEO y fundador de Meridiano Capital, con 16 años de trayectoria en desarrollo y gestión inmobiliaria en Asunción. Guía a inversores de Europa, Argentina, Brasil y Chile en todo el proceso: cédula, apertura bancaria, constitución societaria, selección de oportunidades y gestión de renta. Formación técnica en construcción aplicada a identificar valor real."),

  H2("1.3 Bio media (~150 palabras) — sección \"Quién soy\" del sitio, LinkedIn About"),
  P("Juan José Castillo es el CEO y fundador de Meridiano Capital, con 16 años desarrollando y comercializando proyectos inmobiliarios en Asunción, Paraguay. Bajo su liderazgo, Meridiano Capital acompaña a inversores extranjeros —principalmente de Europa, Argentina, Brasil y Chile— en el ciclo completo de inversión: obtención de la cédula paraguaya, apertura de cuentas bancarias, constitución de Sociedades Anónimas cuando el volumen lo justifica, selección de oportunidades en distintas etapas del desarrollo, y gestión activa del activo una vez adquirido."),
  P("A diferencia de un agente tradicional, su formación técnica en construcción le permite evaluar terrenos, obras y oportunidades de reposicionamiento con criterio de desarrollador, no solo de intermediario. Lidera una red estable de aliados profesionales —abogado, escribano y contadora— que garantiza que cada operación quede correctamente estructurada desde el punto de vista legal, notarial y fiscal."),

  H2("1.4 Bio larga (~350 palabras) — página \"Sobre Nosotros\" completa"),
  P("Desde hace 16 años, Juan José Castillo trabaja en el sector inmobiliario y de desarrollo en Asunción, Paraguay — hoy como CEO y fundador de Meridiano Capital, un mercado que en 2026 atraviesa un momento de consolidación: grado de inversión otorgado por Moody's, crecimiento económico sostenido cercano al 4,4% anual y un flujo creciente de capital extranjero."),
  P("En ese contexto, Meridiano Capital se especializó en acompañar a inversores extranjeros que quieren participar de ese crecimiento pero no conocen el terreno operativo, legal ni fiscal paraguayo. El servicio no empieza ni termina en la firma de una escritura: empieza con la obtención de la cédula de identidad paraguaya, continúa con la apertura de cuentas bancarias o la constitución de una Sociedad Anónima con el respaldo de la Red de Aliados Profesionales, y sigue con la selección de la oportunidad de inversión más adecuada al perfil de riesgo y horizonte de cada cliente."),
  P("Una vez concretada la inversión, Meridiano Capital no se retira de la relación: administra el activo, busca inquilinos o compradores, y monitorea que la propiedad sostenga el objetivo de rentabilidad neta o capture la plusvalía adecuada al momento de la venta."),
  P("El diferencial más importante de Juan José Castillo frente a otros agentes es su formación técnica en construcción — le permite identificar oportunidades que un intermediario tradicional no detecta: terrenos con potencial de desarrollo mal valuados, propiedades con potencial de refacción y reposicionamiento, y proyectos donde la calidad constructiva hace la diferencia entre una inversión rentable y una que solo parece rentable en el papel."),
  P("Todo el proceso se apoya en la Red de Aliados Profesionales de Meridiano Capital —abogado, escribano y contadora— que garantiza que cada inversor opere en Paraguay con total respaldo legal, notarial e impositivo."),
];

// ---------- 2. ARQUITECTURA DE LA EMPRESA ----------
const s2=[
  H1("2.","Arquitectura de Meridiano Capital — cinco unidades"),
  P("Meridiano Capital opera como una empresa con cinco unidades de negocio diferenciadas, cada una con su propia lógica — esto es lo que sostiene el crecimiento más allá de la venta puntual."),
  table(
    ["Unidad","Qué hace"],
    [
      ["1. Originación & Asesoría de Inversión","Capta inversores, selecciona oportunidades (tierra, construcción, preventa en pozo), estructura la operación de compra"],
      ["2. Onboarding Legal-Bancario-Fiscal","Cédula, cuenta bancaria, constitución de S.A., coordinación con la Red de Aliados Profesionales"],
      ["3. Gestión Patrimonial (Property Management)","Administración de alquiler tradicional y renta temporal (Urbannit), sosteniendo la rentabilidad objetivo"],
      ["4. Desarrollo & Coinversión","Estructuración de vehículos (S.A./fideicomiso) para proyectos propios o coliderados"],
      ["5. Value-Add / Reposicionamiento","Identificación, refacción y reposicionamiento de propiedades con potencial subvaluado"],
    ],
    [3200,5800]
  ),
  sp(160),
  H2("2.1 Portafolio dual de gestión patrimonial: renta tradicional y renta temporal"),
  P("No toda propiedad bajo gestión va al mismo circuito. Parte del portafolio se destina a renta tradicional (contrato de largo plazo, inquilino estable) y otra parte a renta temporal, operada bajo la sub-marca Urbannit, con su propio equipo especializado en la operativa diaria (check-in/check-out, limpieza, plataformas de reserva, precios dinámicos). Meridiano Capital conserva el rol de originador de la propiedad, la relación con el inversor y la estrategia general del portafolio; Urbannit ejecuta la operación intensiva en logística — el inversor ve un solo interlocutor y un reporte consolidado."),
  P("Los honorarios exactos de cada nivel de servicio se comparten en etapa avanzada del contacto con el inversor, nunca en el primer mensaje (regla operativa vigente, ver operations/03-tarifario.md) — este documento no reproduce cifras de tarifario por ese motivo.",{i:true,size:17,color:GREY}),

  H2("2.2 Red de Aliados Profesionales"),
  P("Un activo de marca, no solo un dato operativo interno — comunicarla genera confianza inmediata en un inversor extranjero que no puede verificar por sí mismo la seriedad de un profesional paraguayo."),
  bullet("Abogado — constitución societaria, revisión contractual, debida diligencia de títulos"),
  bullet("Escribano / Notario — escrituración, protocolización de actos societarios"),
  bullet("Contadora — RUC, facturación, régimen impositivo, cumplimiento fiscal anual"),
  bullet("Urbannit — operación diaria del circuito de renta temporal"),
];

// ---------- 3. CÓMO TRABAJAMOS ----------
const s3=[
  H1("3.","Cómo trabajamos — el proceso"),
  P("El recorrido completo del inversor extranjero, tal como ya está validado en el journey operativo de Meridiano Capital (ver business/04-etapas-del-inversor.md) — la misma estructura que sostiene cualquier pieza comercial de la empresa."),
  table(
    ["Etapa","Qué incluye"],
    [
      ["0 · Pre-inversión","Perfil, objetivos, capital y ruta migratoria del inversor"],
      ["1 · Estructura de entrada","Cédula (opcional, en paralelo) y/o S.A. sin cédula — Meridiano como representante legal y síndico"],
      ["2 · Cuentas bancarias","Apertura persona física y/o jurídica, origen de fondos documentado"],
      ["3 · Sociedad Anónima","Constitución con la Red de Aliados, si el volumen lo justifica"],
      ["4 · Estructura fiscal","Alta impositiva con la contadora, planificación fiscal internacional"],
      ["5 · Inversión y administración","Compra evaluada con el motor de rentabilidad propio, gestión activa post-cierre"],
    ],
    [2600,6400]
  ),
];

// ---------- 4. REDES SOCIALES ----------
const s4=[
  H1("4.","Guía de contenido — LinkedIn e Instagram"),
  P("Mismo mensaje central (Golden Circle de marca, ver brand/01-adn-de-marca.md), formatos distintos: LinkedIn es el canal de autoridad profesional y de proceso; Instagram es el canal de autoridad técnica y prueba visual (obras, avances, resultados). Evitar republicar el mismo contenido sin adaptar el formato."),
  H2("4.1 Pilares de contenido (ambos canales)"),
  table(
    ["Pilar","Frecuencia sugerida","Ejemplo"],
    [
      ["Educación de proceso","1x/semana","\"Los 4 pasos para que un inversor invierta en Paraguay sin conocer el terreno\""],
      ["Análisis de mercado","1x/semana","Grado de inversión, radicaciones, rentabilidad por zona (siempre con la distinción bruto/neto)"],
      ["Caso / detrás de escena de obra","1x cada 2 semanas","Avance de un proyecto en construcción, lectura técnica del CEO"],
      ["Prueba social","1x/mes","Testimonio o resultado de un inversor, con autorización"],
    ],
    [2700,2200,4100]
  ),
  sp(120),
  H2("4.2 Reglas de tono (heredadas de la identidad verbal oficial)"),
  bullet("Primera persona del CEO en el pilar de autoridad técnica; nunca jerga, memes ni exceso de exclamaciones"),
  bullet("Nunca prometer rentabilidad como garantía — siempre \"objetivo\" o \"de referencia\""),
  bullet("Nunca desacreditar competencia por nombre"),
  bullet("Máximo un emoji por pieza en contenido de Meridiano, y solo si aporta"),
  bullet("Toda cifra de retorno lleva la nota \"cifras ilustrativas, no constituyen garantía de rentabilidad\""),
];

// ---------- CIERRE ----------
const cierre=[
  new Paragraph({children:[new PageBreak()]}),
  new Paragraph({spacing:{before:200,after:200},border:{top:{style:BorderStyle.SINGLE,size:8,color:LINEA}},children:[new TextRun({text:"",size:2})]}),
  new Paragraph({spacing:{after:80},children:[new TextRun({text:"Nota de uso",font:LORA,bold:false,size:23,color:PET})]}),
  P("Este documento es la fuente de verdad para el perfil profesional del CEO — cualquier bio, post o sección \"Quiénes Somos\" que se publique debe partir de estos bloques, no reescribirlos desde cero. Actualizar acá primero, luego propagar a los canales."),
  P("\"Castillo Real Estate & Desarrollo\", nombre que originó este perfil, queda alineado a la ideología de Meridiano Capital (D-041) — este documento lo traduce como el perfil personal del CEO, sin introducir una segunda marca pública.",{i:true,size:17,color:GREY}),
  sp(200),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Juan José Castillo",font:LORA,bold:false,size:22,color:PET})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"CEO · Meridiano Capital · Asunción, Paraguay",font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({children:[new TextRun({text:"+595 982 853 111 · juancastillo@meridianocapital.net · www.meridianocapital.net",font:POP,size:18,color:GREY})]}),
];

const doc=new Document({
  creator:"Meridiano Capital", title:"Perfil Profesional — CEO Meridiano Capital",
  styles:{default:{document:{run:{font:POP,size:20}}}},
  sections:[{
    properties:{page:{margin:{top:1000,bottom:1100,left:1200,right:1200}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:"Meridiano Capital · Perfil Profesional CEO · Documento interno · Página ",font:POP,size:15,color:GREY}),
      new TextRun({children:[PageNumber.CURRENT],font:POP,size:15,color:GREY})]})]})},
    children:[...portada,...s1,...s2,...s3,...s4,...cierre],
  }],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Meridiano_Perfil_Profesional_CEO.docx",b);console.log("OK docx generado: Meridiano_Perfil_Profesional_CEO.docx");});
