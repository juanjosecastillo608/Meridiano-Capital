const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Header, Footer, PageNumber } = docx;
const fs = require("fs");

const PET="14313A", TIE="8B3323", GOLD="C9982E", GREY="5A544C", LINEA="DAD2C0", FILA="F3EDE3", GOLD_D="A87D22";
const LORA="Lora", POP="Poppins";
const TW=9000; // table width DXA

function H1(n,t){return new Paragraph({spacing:{before:340,after:140},keepNext:true,children:[
  new TextRun({text:n+"  ",font:LORA,bold:true,size:30,color:GOLD_D}),
  new TextRun({text:t,font:LORA,bold:true,size:30,color:PET})]});}
function H2(t){return new Paragraph({spacing:{before:220,after:100},keepNext:true,children:[
  new TextRun({text:t,font:LORA,bold:true,size:23,color:PET})]});}
function P(t,opts={}){return new Paragraph({spacing:{after:120},alignment:AlignmentType.JUSTIFIED,children:[
  new TextRun({text:t,font:POP,size:opts.size||20,color:opts.color||"2A2620",italics:opts.i||false,bold:opts.b||false})]});}
function bullet(t){return new Paragraph({bullet:{level:0},spacing:{after:70},children:[new TextRun({text:t,font:POP,size:20,color:"2A2620"})]});}
function callout(title,body){
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],borders:allBorders(TIE,8),rows:[
    new TableRow({children:[new TableCell({shading:{type:ShadingType.CLEAR,fill:"F4E9E5"},width:{size:TW,type:WidthType.DXA},margins:{top:120,bottom:120,left:180,right:180},children:[
      new Paragraph({spacing:{after:60},children:[new TextRun({text:title,font:POP,bold:true,size:19,color:TIE})]}),
      new Paragraph({children:[new TextRun({text:body,font:POP,size:19,color:"3A342C"})]})
    ]})]})
  ]});
}
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
const sp=(after=120)=>new Paragraph({spacing:{after},children:[new TextRun({text:"",size:2})]});

const logo=fs.readFileSync("isotipo.png");

// ---------- PORTADA ----------
const portada=[
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:1400,after:0},children:[new ImageRun({type:"png",data:logo,transformation:{width:70,height:70}})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:600},children:[new TextRun({text:"MERIDIANO CAPITAL",font:LORA,bold:true,size:30,color:PET,characterSpacing:60})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"MANUAL DE PREVENCIÓN DE LAVADO DE ACTIVOS",font:LORA,bold:true,size:38,color:PET})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:300},children:[new TextRun({text:"Y FINANCIAMIENTO DEL TERRORISMO (PLA/FT)",font:LORA,bold:true,size:38,color:PET})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:"Programa de Cumplimiento · P04",font:POP,size:24,color:TIE,bold:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Sector Inmobiliario y de Desarrollo — Sujeto Obligado ante SEPRELAD",font:POP,size:20,color:GREY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Meridiano Capital · Campo Agreste S.A.",font:POP,size:20,color:"2A2620"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"Área Legal y Compliance · Versión 1.0 · Asunción, Paraguay",font:POP,size:18,color:GREY})]}),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- 1. MARCO NORMATIVO ----------
const s1=[
  H1("1.","Marco normativo y obligaciones"),
  H2("1.1  Por qué Meridiano es sujeto obligado"),
  P("El mercado inmobiliario es uno de los sectores de mayor riesgo de lavado de activos a nivel mundial, así reconocido por el GAFI (Grupo de Acción Financiera Internacional). Las transacciones son de alto valor unitario, la valuación de los inmuebles admite un componente subjetivo que permite manipular precios, y la cadena de intermediarios puede dificultar el rastreo del origen de los fondos."),
  P("En Paraguay, la Resolución SEPRELAD N° 201/2020 incorpora expresamente como sujetos obligados a las inmobiliarias, agentes inmobiliarios, corredores, comisionistas y desarrolladores inmobiliarios. Meridiano Capital —que desarrolla, intermedia y administra inmuebles, y estructura vehículos de coinversión para inversores extranjeros— queda comprendida en esa categoría y debe implementar un programa de PLA/FT basado en un sistema de gestión de riesgos."),
  callout("CONSECUENCIAS DEL INCUMPLIMIENTO","El incumplimiento de las obligaciones antilavado puede generar multas por parte de SEPRELAD, inhabilitación para operar, responsabilidad penal de los directivos, inclusión en listas que impidan el acceso a financiamiento bancario, y daño reputacional irreversible. El programa de compliance no es opcional: es condición para operar."),
  sp(),
  H2("1.2  Marco legal aplicable en Paraguay"),
  table(["Norma","Qué regula"],[
    ["Ley N° 1015/1997","Ley base: previene y reprime los actos ilícitos destinados a la legitimación de dinero o bienes."],
    ["Ley N° 3783/2009","Modifica la Ley 1015/97; faculta a SEPRELAD a reglamentar, supervisar y sancionar a los sujetos obligados sin regulador natural (art. 28)."],
    ["Ley N° 6497/2019","Modifica y actualiza la Ley 1015/97 conforme a estándares GAFI vigentes."],
    ["Res. SEPRELAD N° 201/2020","Reglamento de prevención de LA/FT del sector inmobiliario, basado en gestión de riesgos. Norma central para Meridiano."],
    ["Res. SEPRELAD N° 218/2011","Crea el Registro de Sujetos Obligados sin supervisión natural (donde se inscribe el sector inmobiliario)."],
    ["Res. SEPRELAD N° 483/2021","Inscripción y reinscripción de personas jurídicas del sector inmobiliario vía plataforma SIRO."],
    ["Res. SEPRELAD N° 241/2020","Formulario de remisión y actualización de datos del sector inmobiliario (reporte anual)."],
    ["Res. SEPRELAD N° 003/2025","Nuevo formato JSON para la remisión masiva de Reportes de Operaciones del sector inmobiliario."],
    ["Ley N° 921/1996 + Res. BCP N° 12/2011","Regulan el contrato fiduciario; el art. 45 de la Res. BCP 12/2011 establece el fideicomiso para proyectos de construcción (vehículo del Modelo B de Meridiano)."],
  ],[2600,6400]),
  P("Nota: las resoluciones de SEPRELAD se actualizan periódicamente. Los umbrales, formularios y plazos específicos deben verificarse contra la versión vigente de cada resolución con el asesor legal y el Oficial de Cumplimiento antes de cada ciclo.",{i:true,size:17,color:GREY}),
  sp(),
  H2("1.3  Obligaciones específicas del sujeto obligado"),
  table(["Obligación","Descripción"],[
    ["Designar Oficial de Cumplimiento","Responsable del programa, con acceso directo a la Dirección, independencia funcional y capacidad de reportar a SEPRELAD. Formalmente designado e inscripto ante SEPRELAD (plataforma SIRO)."],
    ["Debida Diligencia del Cliente (DDC/KYC)","Conocer a cada cliente e inversor: verificar identidad, entender el origen de sus fondos y evaluar la coherencia de la operación con su perfil económico y actividad declarada."],
    ["Conservar registros","Mantener la documentación de cada cliente y operación por el plazo mínimo legal (al menos 5 años), disponible para SEPRELAD."],
    ["Reportar operaciones sospechosas","Presentar el ROS ante SEPRELAD a través de la plataforma SIRO cuando se detecten señales de alerta, sin informar al cliente."],
    ["Reporte de Operaciones (RO)","Remitir el formulario anual del sector inmobiliario (Res. 241/2020) dentro de los primeros 20 días de marzo de cada año."],
    ["Capacitar al personal","Entrenar periódicamente a todo el personal que participe en operaciones sobre la normativa, las señales de alerta y el procedimiento de reporte."],
    ["Actualizar el programa","Revisar y actualizar el manual al menos anualmente o ante cambios normativos de SEPRELAD."],
  ],[3000,6000]),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- 2. KYC ----------
const s2=[
  H1("2.","Conocimiento del cliente (DDC / KYC)"),
  H2("2.1  Onboarding de compradores"),
  P("Cada comprador debe ser identificado y evaluado antes de cualquier operación. El proceso de debida diligencia comprende los siguientes pasos:"),
  table(["#","Ítem del proceso de DDC","Responsable"],[
    ["1","Verificación de identidad: Cédula de Identidad o pasaporte vigente; selfie o videollamada de verificación.","Asesor comercial"],
    ["2","Obtención del RUC y verificación en la base de la SET (Subsecretaría de Estado de Tributación).","Asesor / Compliance"],
    ["3","Verificación en listas de Personas Expuestas Políticamente (PEP) y listas de sanciones internacionales (OFAC, ONU).","Compliance"],
    ["4","Declaración jurada de origen de fondos para la compra de unidades.","Asesor / Legal"],
    ["5","Evaluación de coherencia entre el perfil económico declarado y el monto de la operación.","Compliance"],
    ["6","Verificación de domicilio: constancia a nombre del cliente o declaración jurada.","Asesor comercial"],
    ["7","Para personas jurídicas: estatuto, RUC, designación de autoridades y beneficiarios finales.","Legal / Compliance"],
    ["8","Para pagos en efectivo: declaración especial de origen de fondos y documentación respaldatoria adicional.","Compliance / Legal"],
    ["9","Firma de la declaración jurada de DDC por parte del cliente.","Asesor comercial"],
    ["10","Carga en el sistema de compliance y asignación de perfil de riesgo (bajo / medio / alto).","Compliance"],
  ],[500,6900,1600]),
  sp(),
  H2("2.2  Perfiles de riesgo y diligencia reforzada"),
  table(["Perfil","Características","Medidas"],[
    ["Riesgo bajo","Persona física con relación de dependencia verificable, operación coherente con ingresos declarados, medio de pago bancario, sin alertas en listas.","DDC estándar. Actualización cada 3 años."],
    ["Riesgo medio","Trabajador independiente, empresario o inversor con ingresos variables o difíciles de verificar; múltiples operaciones; persona jurídica de estructura simple.","DDC estándar + declaración de origen de fondos reforzada. Actualización anual."],
    ["Riesgo alto","PEP o familiar/asociado de PEP; persona jurídica de estructura compleja o beneficiario final difícil de determinar; operación con características inusuales; cliente o fondos del exterior de origen no claro.","Diligencia reforzada: aprobación del Oficial de Cumplimiento, documentación adicional de origen de fondos, monitoreo continuo. Puede requerir aprobación de la Dirección."],
  ],[1500,4300,3200]),
  sp(),
  H2("2.3  Onboarding de inversores del fideicomiso / vehículo de coinversión"),
  P("Los inversores del vehículo de coinversión (S.A. o fideicomiso) requieren una diligencia de mayor profundidad, dado el volumen de capital involucrado:"),
  bullet("Verificación de identidad completa (Cédula o pasaporte, RUC cuando corresponda, domicilio)."),
  bullet("Declaración jurada de origen de fondos con documentación respaldatoria: declaraciones ante la SET, estados contables y extractos bancarios de los 12 meses anteriores."),
  bullet("Verificación exhaustiva en listas PEP y de sanciones internacionales (OFAC, ONU)."),
  bullet("Para inversores personas jurídicas: identificación de los beneficiarios finales (personas físicas que poseen más del 10% del capital o ejercen el control final; verificar el umbral vigente en la Res. 201/2020 y normativa de beneficiario final)."),
  bullet("Entrevista personal o por videoconferencia con el Oficial de Cumplimiento para inversiones superiores a los umbrales establecidos."),
  bullet("Aprobación formal del Oficial de Cumplimiento antes de recibir cualquier transferencia de fondos."),
  sp(),
  callout("ATENCIÓN ESPECIAL — EL INVERSOR EXTRANJERO (NÚCLEO DEL NEGOCIO DE MERIDIANO)","Como Meridiano canaliza capital de inversores de Europa, Argentina, Brasil y Chile hacia Paraguay, el ingreso de fondos transfronterizo es el vector de mayor riesgo. Cada ingreso debe tener origen legítimo y trazable: transferencia bancaria desde una cuenta a nombre del propio inversor, con respaldo documental del origen. Los pagos desde cuentas de terceros, de jurisdicciones de alto riesgo, o sin respaldo, se tratan como riesgo alto y requieren aprobación del Oficial de Cumplimiento antes de aceptarse."),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- 3. SEÑALES DE ALERTA ----------
const s3=[
  H1("3.","Señales de alerta y operaciones sospechosas"),
  P("La presencia de una o más señales de alerta no implica automáticamente lavado, pero obliga a profundizar la investigación y, eventualmente, a reportar."),
  H2("3.1  Señales relacionadas con el cliente"),
  bullet("Muestra desinterés por las condiciones financieras de la operación (precio, tasa, plazos): solo le interesa cerrar rápido."),
  bullet("No puede o no quiere explicar con claridad el origen de sus fondos."),
  bullet("Propone pagar en efectivo, especialmente en montos elevados o fragmentados."),
  bullet("Opera a través de terceros que no pueden identificarse con claridad."),
  bullet("Es una Persona Expuesta Políticamente (funcionario, su cónyuge o familiares directos)."),
  bullet("Tiene una forma de vida o actividad declarada incompatible con el monto de la operación."),
  H2("3.2  Señales relacionadas con la operación"),
  bullet("Se propone un precio artificialmente alto o bajo respecto al valor de mercado de la unidad."),
  bullet("Se solicita cambiar el nombre del comprador en el boleto justo antes de la escrituración, sin justificación clara."),
  bullet("Los fondos provienen de múltiples fuentes no relacionadas o de jurisdicciones de alto riesgo."),
  bullet("Se solicita cancelar la operación y devolver los fondos a una cuenta distinta a la de origen."),
  bullet("Se compran múltiples unidades en efectivo por parte de personas vinculadas entre sí."),
  bullet("En la coinversión: aportes o cesiones de derechos que no coinciden con el perfil económico declarado del inversor."),
  H2("3.3  Procedimiento ante una operación sospechosa"),
  P("Cuando un miembro del equipo detecta una o más señales de alerta, sigue este procedimiento sin excepción:"),
  ...[
    "Documentar internamente las señales, con el mayor detalle posible: fecha, cliente, tipo de operación, descripción de la irregularidad.",
    "NO informar al cliente sobre la sospecha ni sobre el reporte (tipping off): es delito.",
    "Comunicar la situación de forma confidencial al Oficial de Cumplimiento dentro de las 24 horas de detectada la señal.",
    "El Oficial de Cumplimiento evalúa, puede pedir documentación adicional sin revelar el motivo, y decide si corresponde emitir el ROS.",
    "Si decide reportar, elabora el ROS y lo presenta ante SEPRELAD a través de la plataforma SIRO, dentro del plazo normativo.",
    "Mientras dura el análisis, la operación puede demorarse pero no cancelarse sin autorización del Oficial de Cumplimiento o la Dirección.",
    "Todo el proceso queda documentado en el sistema de compliance, con acceso restringido.",
  ].map((t,i)=>new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:70},children:[new TextRun({text:t,font:POP,size:20,color:"2A2620"})]})),
  sp(60),
  callout("PROHIBICIÓN ABSOLUTA — ALERTAR AL CLIENTE (TIPPING OFF)","Bajo ninguna circunstancia se debe informar al cliente que está siendo investigado, que se ha emitido un ROS o que existe una sospecha sobre sus fondos. Esta conducta está tipificada como delito y genera responsabilidad penal para el empleado y para la empresa. Ante cualquier duda, consultar al Oficial de Cumplimiento antes de hablar con el cliente."),
  new Paragraph({children:[new PageBreak()]}),
];

// ---------- 4. CAPACITACIÓN Y GESTIÓN ----------
const s4=[
  H1("4.","Programa de capacitación y gestión del compliance"),
  H2("4.1  Plan anual de capacitación"),
  table(["Tipo","Descripción"],[
    ["Inducción para nuevos integrantes","Antes de operar, todo nuevo integrante con contacto con clientes u operaciones recibe capacitación: marco normativo, DDC, señales de alerta y procedimiento de reporte. Mínimo 4 horas."],
    ["Capacitación anual obligatoria","Todo el personal que participa en operaciones se actualiza anualmente: cambios normativos de SEPRELAD, casos del sector, señales de alerta y simulacros. Mínimo 2 horas."],
    ["Capacitación del equipo comercial","Los asesores requieren entrenamiento específico en detección de señales durante la atención. Frecuencia semestral; 2 horas."],
    ["Capacitación de la Dirección","La Dirección y gerencias conocen las responsabilidades del sujeto obligado y las consecuencias del incumplimiento. Frecuencia anual; 2 horas."],
  ],[2700,6300]),
  sp(),
  H2("4.2  Auditoría y actualización del programa"),
  bullet("Revisión anual del manual y actualización ante cambios de la normativa de SEPRELAD."),
  bullet("Auditoría interna semestral de la DDC: verificar que los expedientes estén completos y actualizados."),
  bullet("Auditoría externa anual por un profesional independiente especializado en PLA/FT."),
  bullet("Revisión de umbrales y criterios de riesgo según la evolución del mercado y la tipología de operaciones."),
  bullet("Actualización de listas de consulta (PEP, sanciones) al menos mensualmente."),
  bullet("Reporte anual del Oficial de Cumplimiento a la Dirección sobre el estado del programa, operaciones reportadas y hallazgos de auditoría."),
  sp(),
  H2("4.3  Indicadores del programa"),
  table(["Indicador","Medición","Referencia"],[
    ["% de personal capacitado en el período","Capacitados / obligados × 100","Meta: 100%"],
    ["Tiempo promedio de onboarding (DDC) por cliente","Días desde inicio hasta aprobación","Meta: < 3 días"],
    ["% de expedientes de DDC completos y actualizados","Al día / total activos × 100","Meta: > 98%"],
    ["ROS presentados en el período","Cantidad reportada a SEPRELAD","Registro histórico"],
    ["Tiempo de respuesta ante señal de alerta","Horas desde detección hasta aviso al Oficial","Meta: < 24 hs"],
    ["Hallazgos de auditoría sin resolver","Observaciones abiertas / total","Meta: 0 críticas abiertas"],
  ],[3600,3600,1800]),
  sp(),
  H2("4.4  Reportería ante SEPRELAD"),
  bullet("ROS (Reporte de Operación Sospechosa): se remite a través de la plataforma SIRO cuando lo determina el Oficial de Cumplimiento."),
  bullet("RO (Reporte de Operaciones): remisión anual del formulario del sector inmobiliario (Res. 241/2020), dentro de los primeros 20 días de marzo."),
  bullet("Inscripción / reinscripción del sujeto obligado y del Oficial de Cumplimiento vía SIRO (Res. 483/2021)."),
  callout("EL COMPLIANCE COMO VENTAJA COMPETITIVA","Un programa de PLA/FT sólido permite acceder con mayor facilidad a financiamiento bancario e institucional, trabajar con inversores extranjeros que exigen estándares elevados de gobernanza, reducir la exposición a sanciones, y construir una reputación de transparencia. Para Meridiano —cuyo ADN es la responsabilidad que empieza antes de la compra y no termina en la firma— el cumplimiento no es una carga: es parte de la propuesta de valor."),
];

// ---------- CIERRE / FIRMA ----------
const cierre=[
  new Paragraph({children:[new PageBreak()]}),
  new Paragraph({spacing:{before:200,after:200},border:{top:{style:BorderStyle.SINGLE,size:8,color:LINEA}},children:[new TextRun({text:"",size:2})]}),
  new Paragraph({spacing:{after:80},children:[new TextRun({text:"Aprobación y vigencia",font:LORA,bold:true,size:23,color:PET})]}),
  P("El presente Programa de Cumplimiento (P04) entra en vigencia con su aprobación por la Dirección de Meridiano Capital y se revisa al menos anualmente. La designación e inscripción del Oficial de Cumplimiento ante SEPRELAD es condición para su plena aplicación."),
  P("Documento interno de Meridiano Capital. Los umbrales, plazos y formularios específicos deben verificarse contra las resoluciones vigentes de SEPRELAD y con asesoría legal antes de cada ciclo. No sustituye el asesoramiento profesional.",{i:true,size:17,color:GREY}),
  sp(200),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Juan José Castillo",font:LORA,bold:true,size:22,color:PET})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({children:[new TextRun({text:"+595 982 853 111 · juancastillo@meridianocapital.net · www.meridianocapital.net",font:POP,size:18,color:GREY})]}),
];

const doc=new Document({
  creator:"Meridiano Capital", title:"Manual PLA/FT — P04",
  numbering:{config:[{reference:"pasos",levels:[{level:0,format:"decimal",text:"%1.",alignment:AlignmentType.START,style:{run:{font:POP,bold:true,color:TIE}}}]}]},
  styles:{default:{document:{run:{font:POP,size:20}}}},
  sections:[{
    properties:{page:{margin:{top:1000,bottom:1100,left:1200,right:1200}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:"Meridiano Capital · Programa de Cumplimiento P04 · Confidencial · Página ",font:POP,size:15,color:GREY}),
      new TextRun({children:[PageNumber.CURRENT],font:POP,size:15,color:GREY})]})]})},
    children:[...portada,...s1,...s2,...s3,...s4,...cierre],
  }],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Meridiano_P04_Manual_Compliance.docx",b);console.log("OK docx generado");});
