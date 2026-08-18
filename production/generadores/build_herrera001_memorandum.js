const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, Header, Footer, PageNumber } = docx;
const fs = require("fs");

// Paleta e identidad Meridiano Capital (misma que build_p04.js)
const PET="14313A", TIE="8B3323", GOLD="C9982E", GREY="5A544C", LINEA="DAD2C0", FILA="F3EDE3", GOLD_D="A87D22";
const VERDE="2E5C3E", VERDE_F="E7EFE9", ROJO="9C3B2E", ROJO_F="F5E6E2", AMBAR="A87D22", AMBAR_F="F6EEDD";
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
function callout(title,body,{fill=FILA,border=TIE,titleColor=TIE}={}){
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],borders:allBorders(border,8),rows:[
    new TableRow({children:[new TableCell({shading:{type:ShadingType.CLEAR,fill},width:{size:TW,type:WidthType.DXA},margins:{top:140,bottom:140,left:200,right:200},children:[
      new Paragraph({spacing:{after:70},children:[new TextRun({text:title,font:POP,bold:true,size:20,color:titleColor})]}),
      new Paragraph({alignment:AlignmentType.JUSTIFIED,children:[new TextRun({text:body,font:POP,size:19,color:"3A342C"})]})
    ]})]})
  ]});
}
function allBorders(color,sz){const b={style:BorderStyle.SINGLE,size:sz,color};return {top:b,bottom:b,left:b,right:b,insideHorizontal:b,insideVertical:b};}
function cell(text,{w,head=false,bold=false,fill=null,align=AlignmentType.LEFT,color=null}={}){
  return new TableCell({width:{size:w,type:WidthType.DXA},shading:fill?{type:ShadingType.CLEAR,fill}:undefined,
    margins:{top:70,bottom:70,left:120,right:120},children:[
    new Paragraph({alignment:align,children:[new TextRun({text:text,font:POP,size:17,bold:head||bold,color:color||(head?"FFFFFF":"2A2620")})]})]});
}
function table(headers,rows,widths){
  const trs=[new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,{w:widths[i],head:true,fill:PET}))})];
  rows.forEach((r,ri)=>trs.push(new TableRow({children:r.map((c,i)=>{
    const val = typeof c === "string" ? c : c.text;
    const opts = typeof c === "string" ? {} : c;
    return cell(val,{w:widths[i],fill:opts.fill||(ri%2?FILA:null),bold:opts.bold,color:opts.color});
  })})));
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:widths,borders:allBorders(LINEA,4),rows:trs});
}
const sp=(after=120)=>new Paragraph({spacing:{after},children:[new TextRun({text:"",size:2})]});
const hr=()=>new Paragraph({spacing:{before:160,after:160},border:{top:{style:BorderStyle.SINGLE,size:6,color:LINEA}},children:[new TextRun({text:"",size:2})]});

const logo=fs.readFileSync(__dirname+"/isotipo.png");

// ---------- PORTADA ----------
const portada=[
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:1000,after:0},children:[new ImageRun({type:"png",data:logo,transformation:{width:64,height:64}})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:500},children:[new TextRun({text:"MERIDIANO CAPITAL",font:LORA,size:28,color:PET,characterSpacing:60})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new TextRun({text:"MEMORÁNDUM DE INVERSIÓN",font:LORA,size:40,color:PET})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:260},children:[new TextRun({text:"Caso HERRERA-001",font:POP,size:24,color:TIE,bold:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new TextRun({text:"Edificio Barrio Herrera / \"Edificio 4 de Julio\"",font:POP,size:22,color:"2A2620"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Asunción, Paraguay",font:POP,size:20,color:GREY})]}),
  // Badge de recomendacion
  new Table({width:{size:6200,type:WidthType.DXA},columnWidths:[6200],alignment:AlignmentType.CENTER,borders:allBorders(VERDE,10),rows:[
    new TableRow({children:[new TableCell({shading:{type:ShadingType.CLEAR,fill:VERDE_F},width:{size:6200,type:WidthType.DXA},margins:{top:160,bottom:160,left:200,right:200},children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[new TextRun({text:"RECOMENDACIÓN",font:POP,size:16,color:VERDE,bold:true,characterSpacing:40})]}),
      new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"NEGOCIAR / CONDICIONAR",font:LORA,size:26,color:VERDE})]}),
    ]})]})
  ]}),
  new Paragraph({children:[new PageBreak()]}),
  new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:600},children:[new TextRun({text:"Actualizado 2026-08-18 (v4) · Confidencial — uso interno de Meridiano Capital y sus socios",font:POP,size:16,color:GREY,italics:true})]}),
];

// ---------- RECOMENDACIÓN (portada de contenido) ----------
const sReco=[
  H1("","RECOMENDACIÓN: NEGOCIAR / CONDICIONAR"),
  P("No es un \"comprar\" sin condiciones, ni un \"no comprar\"."),
  callout("El caso financiero es sólido",
    "En los tres Ángulos analizados, incluso después de recalcular con el costo definitivo (USD 720/m², bajado de USD 750) y descontar el IVA del desarrollador (10% sobre el costo de construcción). El precio de compra ya se validó como favorable frente a múltiples referencias independientes de mercado. El déficit de caja detectado tiene solución viable con dos estructuras de financiamiento concretas. La zona tiene demanda y plusvalía reales, confirmadas por el founder y contrastadas contra fuentes de mercado.",
    {fill:VERDE_F,border:VERDE,titleColor:VERDE}),
  sp(80),
  callout("Un solo bloqueante real sigue sin resolver",
    "De los tres bloqueantes de due diligence identificados originalmente, dos ya se resolvieron: identidad del vendedor confirmada (Cristino Silva, mismo titular) y título/gravámenes verificados y en orden. Queda uno solo: la opinión estructural sobre si la estructura ya construida soporta el piso adicional del Ángulo 2. La tensión detectada en la política de precios de venta también quedó resuelta — se comparó cuantitativamente contra la alternativa de precio bajo y la política premium ganó en los cuatro escenarios probados.",
    {fill:ROJO_F,border:ROJO,titleColor:ROJO}),
  sp(80),
  P("La recomendación es avanzar a la etapa de negociación y cierre condicionado — negociar el precio y los términos finales mientras se resuelve, como condición suspensiva, la opinión estructural del piso adicional.",{b:true}),
];

// ---------- 1. RESUMEN EJECUTIVO ----------
const s1=[
  H1("1.","Resumen ejecutivo"),
  table(["",""],[
    [{text:"Activo",bold:true},"Edificio residencial inconcluso, Barrio Herrera (Luis A. de Herrera), Asunción — 73,5% de avance estructural"],
    [{text:"Terreno",bold:true},"469 m², Cuenta Catastral 14-502-04, zona de regulación AR2-B (confirmada)"],
    [{text:"Precio de compra",bold:true},"USD 850.000 (terreno USD 360.000 + estructura/documentación/riesgo evitado USD 490.000)"],
    [{text:"Financiamiento",bold:true},"Fondos propios — Sociedad Anónima, 2-3 socios, sin deuda bancaria, sin fideicomiso"],
    [{text:"Plazo de obra",bold:true},"12 meses"],
    [{text:"Mejor Ángulo",bold:true},"Ángulo 2 (fachada + tipologías chicas + piso adicional, 7 pisos) — mayor margen y mejor consistencia"],
    [{text:"Margen final, Ángulo 2",bold:true},"USD 784.541 – 1.091.147 (ROI 24,6% – 34,3%)"],
    [{text:"Déficit de caja detectado",bold:true},"Resuelto — dos escenarios de financiamiento viables (sección 6)"],
    [{text:"Mejor escenario venta/retención (Ángulo 3, ilustrativo)",bold:true},"Retener y esperar plusvalía: 33,4%/año, con riesgo de mercado real"],
    [{text:"Bloqueantes de due diligence sin resolver",bold:true},{text:"Uno solo: opinión estructural sobre el piso adicional (Ángulo 2)",color:ROJO,bold:true}],
  ],[2800,6200]),
];

// ---------- 2. EL ACTIVO ----------
const s2=[
  H1("2.","El activo"),
  bullet("Ubicación: esquina Concejal Vargas y 4 de Julio, Barrio Herrera (Luis A. de Herrera), Asunción — zona residencial de alta demanda, confirmada por el founder, cercana pero no en medio del tránsito de los principales centros comerciales de la ciudad."),
  bullet("Identidad verificada: \"Edificio 4 de Julio\" (nombre técnico/legal, planos 2023) y \"Herrera Town\" (nombre comercial) son el mismo predio — verificado por cuenta catastral, superficie y ubicación coincidentes."),
  bullet("Estado de avance: 73,5% de la estructura de hormigón ya construida (2.286,93 de 3.113,03 m² totales a construir) — exclusivamente estructura, 0% de mampostería, instalaciones o terminaciones."),
  bullet("Zonificación: AR2-B (Plan Regulador, Ordenanza 43/1994) — altura base 5 plantas/15 m, con incentivo confirmado a 7 plantas mediante mayor retiro. Permiso municipal para el piso adicional ya confirmado."),
  bullet("Mercado comparable directo: Filum Herrera (Century 21 Liberty), mismo barrio, entrega dic. 2026 — 1 dorm 38m²=USD 70.300 (USD 1.850/m²), 1 dorm Plus 48m²=USD 97.200 (USD 2.025/m²), 2 dorm 77m²=USD 142.500 (USD 1.851/m²)."),
];

// ---------- 3. LA OPORTUNIDAD ----------
const s3=[
  H1("3.","La oportunidad — tres Ángulos comparados"),
  P("Con el costo definitivo (USD 720/m²) e IVA del desarrollador ya descontado.",{i:true,color:GREY}),
  table(["","Ángulo 1 (tal cual)","Ángulo 3 (fachada+chicas, 6P)","Ángulo 2 (fachada+chicas+7P)"],[
    ["Unidades","21","29 (ilustrativo)","39 (ilustrativo)"],
    ["Área comercializable","1.800 m²","1.800 m²","2.100 m²"],
    ["Inversión Total","USD 2.745.598","USD 2.930.823",{text:"USD 3.185.640",bold:true}],
    ["Costo/m² comercializable","USD 1.525,33","USD 1.628,24",{text:"USD 1.516,97 (el más bajo)",bold:true}],
    ["Ingresos totales (bajo–alto)","3.567.637 – 4.218.165","3.820.500 – 4.097.250",{text:"4.424.700 – 4.749.150",bold:true}],
    ["IVA del desarrollador","189.560","189.560","211.160"],
    ["Margen final (bajo–alto)","436.259 – 1.051.008","489.990 – 751.518",{text:"784.541 – 1.091.147",bold:true,color:VERDE}],
    ["ROI sobre Inversión Total","15,9% – 38,3%","16,7% – 25,6%",{text:"24,6% – 34,3%",bold:true,color:VERDE}],
  ],[2600,2130,2130,2140]),
  sp(),
  callout("Política de precios confirmada, con respaldo cuantitativo",
    "Se mantiene el rango USD 1.900–2.050/m² por diferenciación de producto (calidad USD 720/m²) — comparado directamente contra la alternativa de bajar a calidad USD 650/m² + precio de mercado bajo (USD 1.576–1.809/m², comparables reales de Century 21), la política premium gana en los cuatro escenarios probados (2 Ángulos × 2 extremos de rango), con una diferencia de ROI de 6 a 12 puntos porcentuales. Reconfirmado 2026-08-18 con el AMC parametrizado: 9 comparables reales dentro del propio Barrio Herrera (antes 2), ajuste AMC de 2 dormitorios ~USD 1.509/m² — mismo hallazgo, muestra 4,5x mayor.",
    {fill:VERDE_F,border:VERDE,titleColor:VERDE}),
  sp(),
  P("El Ángulo 2 es la recomendación dentro de las tres opciones de diseño — mayor margen en dólares, mejor ROI en el extremo bajo del rango de precio (el escenario más conservador), y el costo/m² más bajo de los tres pese a tener el mayor % de Proyecto asignado (40%). El riesgo que le queda es técnico, no financiero: la opinión estructural sobre si la estructura ya construida soporta el piso adicional sin refuerzo mayor."),
  P("El Ángulo 1 (tal cual, sin modificaciones) ya no tiene ningún escenario negativo tras la corrección de costos — es la opción de menor riesgo de ejecución, aunque con menor margen absoluto que el Ángulo 2."),
];

// ---------- 4. ESTRUCTURA DE LA INVERSIÓN ----------
const s4=[
  H1("4.","Estructura de la inversión — confirmada"),
  bullet("Vehículo legal: Sociedad Anónima entre 2-3 socios, que aportan el 100% del capital necesario (terreno + construcción) — sin deuda bancaria, sin fideicomiso."),
  bullet("Comisión de venta: 5,5% del total de la venta (con IVA 10% incluido), con reparto según el canal — dos puntas propio (100% Meridiano), equipo interno (2,5%/3%), franquicia RE/MAX o Century 21 (0%/100% cedido), agente independiente (2,75%/2,75%). Política estándar de la empresa."),
  bullet("Esquema de financiamiento de compradores: 20% entrega + 70% cuotas decrecientes + 10% contra la entrega física — norma estándar de la empresa. Para este caso, se evaluó y se mantiene como alternativa viable una variante de plazo corto (40% entrega + 50% cuotas + 10% entrega)."),
  bullet("Régimen tributario del desarrollador: 10% IVA sobre el costo total de construcción + 10% impuesto a la renta sobre utilidad neta — ambas bases confirmadas, ya descontadas del margen final."),
];

// ---------- 5. MATRIZ DE SENSIBILIDAD ----------
const s5=[
  H1("5.","Matriz de sensibilidad — precio bajo vs. alto"),
  P("El rango de precio de venta (USD 1.900–2.050/m², calibrado contra el comparable Filum Herrera) es la variable de sensibilidad principal del caso — ya incorporada en la tabla de la sección 3. Los tres Ángulos dan margen positivo en todo el rango, incluido el extremo bajo."),
  H2("Variables de sensibilidad no cuantificadas todavía"),
  bullet("Plusvalía real de la zona a 2 años (se usó el 20%/año confirmado por el founder para el Escenario C de venta/retención) — es un dato de mercado del founder, no una tasación de tercero."),
  bullet("Costo de refuerzo estructural del Ángulo 2, si la opinión estructural pendiente determina que hace falta — la única variable de sensibilidad real que sigue sin resolver."),
];

// ---------- 6. FINANCIAMIENTO ----------
const s6=[
  H1("6.","Estructura de financiamiento — el déficit de timing y sus dos soluciones"),
  P("Se detectó un déficit real de timing de caja (no de fondos totales): el capital propio, aunque suma exactamente el 70% de la Inversión Total, se agota en el mes 9 de los 12 de obra, porque el cobro de las cuotas de los compradores es más lento que el gasto de construcción. Dos escenarios cierran este déficit por completo, ambos con el saldo de capital propio llegando a cero exactamente en el mes 11:"),
  table(["","Escenario 1 (20/70/10 sin cambios)","Escenario Mix (40/50/10)"],[
    ["Capital propio necesario (Ángulo 2)","USD 2.478.568 (75,71% de IT)",{text:"USD 2.423.544 (74,03% de IT)",bold:true}],
    ["Ahorro del Mix frente al Escenario 1","—",{text:"USD 55.024",bold:true,color:VERDE}],
  ],[3200,2900,2900]),
  sp(),
  P("Ambos escenarios siguen en paralelo — la recomendación final se presenta con las dos alternativas, no una sola. El esquema 40/50/10 queda registrado como variante para proyectos de plazo de obra corto, no reemplaza la norma general de la empresa."),
];

// ---------- 7. ESTRATEGIA DE VENTA Y RETENCIÓN ----------
const s7=[
  H1("7.","Estrategia de venta y retención"),
  H2("Mix de producto por tipología"),
  table(["Tipología","Solidez para retención"],[
    ["Monoambiente","La más sólida — supera el piso de renta en todas las combinaciones de producto probadas"],
    ["1 dormitorio","Sólida en tradicional/amoblado básico — calidades altas necesitan más dato de zona premium"],
    ["2 dormitorios","No alcanza el piso sin amoblar en Herrera — sí amoblada, comparada contra zonas cercanas"],
    ["3 dormitorios","Mismo patrón que 2 dormitorios, con demanda real de la zona ya confirmada para el segmento amoblado premium"],
  ],[2200,6800]),
  sp(),
  H2("Los tres escenarios de venta/retención (Ángulo 3, ilustrativo)"),
  table(["Escenario","Retorno anualizado"],[
    ["A — Venta mínima (30%) + retención perpetua","15,0%/año"],
    ["B — Venta agresiva (100%, liquidación total)","24,3%/año"],
    [{text:"C — Venta mínima (30%) + retención 2 años + reventa con plusvalía (20%/año)",bold:true},{text:"33,4%/año — el más alto, con más riesgo de mercado",bold:true,color:GOLD_D}],
  ],[6200,2800]),
  sp(),
  P("Recomendación de estrategia: partir del mínimo de venta necesario para cerrar el déficit de timing, concentrado en las tipologías de 2/3 dormitorios (las que menos se sostienen en retención sin apoyo de zona premium) — y retener agresivamente monoambiente y 1 dormitorio, que son las que mejor rentabilidad de alquiler sostienen con datos reales propios de la zona."),
];

// ---------- 8. MATRIZ DE RIESGOS ----------
const s8=[
  H1("8.","Matriz de riesgos y checklist de due diligence"),
  table(["Riesgo","Categoría","Estado"],[
    ["Identidad del vendedor actual","Legal",{text:"Resuelto — Cristino Silva confirmado como el mismo titular",color:VERDE,fill:VERDE_F}],
    ["Título, gravámenes, embargos","Legal",{text:"Resuelto — analizados, todo en orden. Se re-verifica antes del cierre",color:VERDE,fill:VERDE_F}],
    [{text:"Opinión estructural del piso adicional (Ángulo 2)",bold:true},"Técnico",{text:"SIN RESOLVER — el único bloqueante real que queda",color:ROJO,bold:true,fill:ROJO_F}],
    ["Desglose de avance de obra por componente","Técnico",{text:"Resuelto — 73,5% es exclusivamente estructura, 0% de mampostería/instalaciones",color:VERDE,fill:VERDE_F}],
    ["Base de cálculo del IVA del desarrollador","Fiscal",{text:"Resuelto — 10% sobre el costo total de construcción",color:VERDE,fill:VERDE_F}],
    ["Política de precios de venta vs. comparables","Mercado",{text:"Resuelto — rango premium confirmado con respaldo cuantitativo",color:VERDE,fill:VERDE_F}],
    ["Plusvalía de zona a 2 años","Mercado",{text:"Dato del founder, no tasación de tercero",color:AMBAR,fill:AMBAR_F}],
    ["Costo/plano real del Ángulo 2/3","Ejecución",{text:"El mix de tipologías chicas es ilustrativo, sin plano de arquitecto todavía",color:AMBAR,fill:AMBAR_F}],
    ["Precio de compra vs. mercado","Financiero",{text:"Validado — favorable frente a costo de reposición y comparables de zona",color:VERDE,fill:VERDE_F}],
    ["Valor de terreno dentro del precio de compra","Financiero",{text:"Resuelto — AMC de tercero sugeria USD 178.500-203.500 de terreno vacio; el founder explico la diferencia (~USD 170.000) aplicando la regla ya vigente D-071 (casa preexistente + demolicion). No cambia el precio total ni el margen",color:VERDE,fill:VERDE_F}],
    ["Márgenes financieros","Financiero",{text:"Positivos en los 3 Ángulos, en todo el rango de precio",color:VERDE,fill:VERDE_F}],
    ["Estructura de financiamiento","Financiero",{text:"Déficit de timing detectado y resuelto con dos escenarios viables",color:VERDE,fill:VERDE_F}],
    ["Demanda de mercado","Mercado",{text:"Confirmada por el founder y datos reales",color:VERDE,fill:VERDE_F}],
  ],[3400,1400,4200]),
];

// ---------- 9. RECOMENDACIÓN FINAL ----------
const s9=[
  H1("9.","Recomendación final, en detalle"),
  H2("9.1  Por qué no es un \"comprar\" incondicional"),
  P("De los tres ítems bloqueantes originales, dos ya se resolvieron (identidad del vendedor, título/gravámenes). Queda uno solo, pero sigue siendo suficiente para no recomendar un \"comprar\" sin condiciones: la opinión estructural sobre el piso adicional del Ángulo 2 — es capaz de cambiar la decisión por sí sola si determina que hace falta un refuerzo estructural mayor no presupuestado."),
  H2("9.2  Por qué no es un \"no comprar\""),
  P("Todo lo que sí se pudo verificar apunta a favor: el precio de compra total es defendible frente a costo de reposición y comparables directos de zona; los tres Ángulos de diseño dan margen positivo en todo el rango de sensibilidad de precio; el déficit de caja detectado tiene solución concreta y ya modelada; la demanda de la zona está confirmada con datos reales, no solo con el criterio del founder. Salvedad agregada y resuelta 2026-08-18: el AMC real de terreno había señalado que el desglose interno del precio (terreno USD 360.000) parecía por encima del valor de un lote vacío — el founder aclaró que la diferencia corresponde al valor de la casa preexistente más su demolición, aplicando la misma regla ya vigente del caso (D-071). No cambia el precio total ni el margen; se mantiene como buena práctica una tasación formal del terreno antes del cierre."),
  H2("9.3  La recomendación — negociar y condicionar el cierre"),
  new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:100},children:[new TextRun({text:"Avanzar a la etapa de negociación de términos finales del boleto de compraventa, sobre la base del Ángulo 2 como diseño objetivo, con el Ángulo 1 como alternativa de menor riesgo de ejecución si el rediseño no avanza a tiempo. El proceso de cierre sigue la secuencia estándar confirmada (certificados de dominio/inhibición → 20% de seña → boleto → escritura contra verificación final).",font:POP,size:20,color:"2A2620"})]}),
  new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:100},children:[new TextRun({text:"Condicionar el cierre (cláusula suspensiva) a la opinión estructural profesional sobre el piso adicional — el único ítem legal/técnico que sigue sin resolver.",font:POP,size:20,color:"2A2620"})]}),
  new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:100},children:[new TextRun({text:"Definir, antes del cierre, cuál de los dos escenarios de financiamiento (Escenario 1 o Mix) se usa — ambos son viables, la diferencia es cuánto capital propio adicional se compromete.",font:POP,size:20,color:"2A2620"})]}),
  new Paragraph({numbering:{reference:"pasos",level:0},spacing:{after:100},children:[new TextRun({text:"No comprometer el 100% de la estrategia de venta/retención a la plusvalía de 2 años (Escenario C) — usarla como objetivo para las unidades chicas, y mantener venta activa de 2/3 dormitorios salvo que se confirme demanda real de zona premium para esas tipologías en Herrera específicamente.",font:POP,size:20,color:"2A2620"})]}),
];

// ---------- 10. PENDIENTES ----------
const s10=[
  H1("10.","Qué queda pendiente, incluso después de este memorándum"),
  bullet("La opinión estructural sobre el piso adicional — el único bloqueante real que sigue sin resolver."),
  bullet("Replicar la comparación de escenarios de venta/retención para Ángulo 1 y Ángulo 2 (solo se cubrió Ángulo 3)."),
  bullet("Definir el mix real de unidades a retener por tipología, con precisión."),
  bullet("Confirmar las \"zonas definitivas\" del ranking de barrios, y seguir completando las tablas de tarifas de alquiler y valor de venta."),
  bullet("Si se pide: presentación simplificada para inversores — no se construyó en este documento."),
];

// ---------- CIERRE ----------
const cierre=[
  new Paragraph({children:[new PageBreak()]}),
  hr(),
  H2("Nota metodológica"),
  P("Este memorándum sigue el protocolo \"Investment Real Estate Analysis System\" — cada cifra está clasificada según su nivel de confirmación (dato confirmado, calculado, estimado o pendiente de verificar) en la documentación de trabajo completa del caso, disponible en contracts/cases/HERRERA-001/. Este documento es una síntesis para lectura ejecutiva; el respaldo detallado de cada número (39 documentos de trabajo) está disponible bajo pedido.",{i:true,size:18,color:GREY}),
  sp(200),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Juan José Castillo",font:LORA,size:22,color:PET})]}),
  new Paragraph({spacing:{after:20},children:[new TextRun({text:"Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay",font:POP,size:18,color:"2A2620"})]}),
  new Paragraph({children:[new TextRun({text:"+595 982 853 111 · juancastillo@meridianocapital.net · www.meridianocapital.net",font:POP,size:18,color:GREY})]}),
];

const doc=new Document({
  creator:"Meridiano Capital", title:"Memorándum de Inversión — HERRERA-001",
  numbering:{config:[{reference:"pasos",levels:[{level:0,format:"decimal",text:"%1.",alignment:AlignmentType.START,style:{run:{font:POP,bold:true,color:TIE}}}]}]},
  styles:{default:{document:{run:{font:POP,size:20}}}},
  sections:[{
    properties:{page:{margin:{top:1000,bottom:1100,left:1200,right:1200}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:"Meridiano Capital · Memorándum de Inversión HERRERA-001 · Confidencial · Página ",font:POP,size:15,color:GREY}),
      new TextRun({children:[PageNumber.CURRENT],font:POP,size:15,color:GREY})]})]})},
    children:[...portada,...sReco,...s1,...s2,...s3,...s4,...s5,...s6,...s7,...s8,...s9,...s10,...cierre],
  }],
});

const outDir = __dirname + "/../../contracts/cases/HERRERA-001/entregables";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
Packer.toBuffer(doc).then(b=>{
  fs.writeFileSync(outDir+"/HERRERA-001_Memorandum_de_Inversion.docx",b);
  console.log("OK docx generado en "+outDir);
});
