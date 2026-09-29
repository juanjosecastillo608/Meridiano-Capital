// Casa familiar con piscina y casa de huéspedes | San Bernardino — presentación de venta a comprador final.
// Construida con el kit de la skill meridiano-property-presentation-adapter (marca vigente D-034/D-036/D-040).
// Uso: NODE_PATH=<node_modules> node build_deck.js <ruta_kit> <salida.pptx>
"use strict";
const path = require("path");
const K = require(process.argv[2]);
const OUT = process.argv[3];
const F = (n) => path.join(__dirname, "fotos", n);

const d = K.createDeck({
  title: "Casa familiar con piscina y casa de huéspedes | San Bernardino",
  subject: "Presentación de venta · WEB ID 39903",
  footerLabel: "Casa familiar  ·  Urbanización SADI III, San Bernardino  ·  WEB ID 39903",
});
const { C, M, W, H, R, SERIF } = d;
const FUENTE = "Fuente de datos: instrucción aprobada del asesor (29/09/2026) y presentación PDF previa de la propiedad.";
// Notas de trazabilidad: se registran en Control_Interno_Casa_San_Bernardino.md, NO en el PPTX
// (el archivo editable puede llegar al comprador; la ficha interna no debe viajar con él).
const NOTA = () => {};
const caption = (s, t, x, y, w) => d.text(s, t, { x, y, w, h: 0.3, fontSize: 10.5, italic: true, color: C.grey });
const header = (s, eyebrow, title, o = {}) => { d.eyebrow(s, eyebrow); d.title(s, title, Object.assign({ w: 12.1 }, o)); };

// 1 · Portada
d.cover({
  photo: F("galeria-jardin-piscina.jpg"), photoAlt: "Galería techada con vista al jardín y la piscina", ax: 0.3,
  eyebrow: "En venta  ·  WEB ID 39903",
  title: "Casa familiar con piscina\ny casa de huéspedes", titleSize: 36,
  subtitle: "Urbanización SADI III  ·  San Bernardino, Cordillera",
  figures: [["USD 179.000", "precio de venta"], ["1.100 m²", "terreno en esquina"]],
  footnote: "Presentación comercial  ·  Meridiano Capital",
  _nota: `Portada. Precio, WEB ID, terreno y ubicación: instrucción aprobada. Foto: galería con jardín y piscina (misma foto que la portada anterior, versión de mayor resolución). ${FUENTE}`,
});

// 2 · Propuesta familiar
let s = d.slide("light");
header(s, "La propuesta", "Un lugar pensado para reunir a la familia");
d.photo(s, F("piscina-reposera.jpg"), { x: M, y: 1.95, w: 3.5, h: 4.4 }, { alt: "Deck junto a la piscina y jardín con palmeras", ay: 0.6 });
caption(s, "Deck de piscina y jardín", M, 6.4, 3.5);
d.text(s, "Residencia principal, casa independiente para huéspedes y una amplia área exterior, en un terreno en esquina de 1.100 m².",
  { x: 4.6, y: 1.95, w: 8.1, h: 0.85, fontSize: 15, lineSpacingMultiple: 1.2 });
[
  ["Reuniones familiares", "Quincho con parrilla, galerías y jardín para recibir a familiares y amigos con comodidad."],
  ["Fines de semana y vacaciones", "Piscina con deck, cancha y jardín concentran las actividades al aire libre sin salir de casa."],
  ["Huéspedes con independencia", "La segunda casa permite alojar a las visitas sin alterar la rutina de la residencia principal."],
  ["Familias numerosas", "Seis dormitorios y catorce ambientes para organizar la vida diaria con amplitud."],
].forEach(([h, b], i) => {
  const x = 4.6 + (i % 2) * 4.2, y = 3.1 + Math.floor(i / 2) * 1.7;
  d.hair(s, x, y, 3.8, C.lapacho);
  d.text(s, h, { x, y: y + 0.15, w: 3.9, h: 0.45, fontFace: SERIF, fontSize: 19, color: C.tierra });
  d.text(s, b, { x, y: y + 0.62, w: 3.8, h: 0.9, fontSize: 12.5, lineSpacingMultiple: 1.2 });
});
d.footer(s, 2);
NOTA(`Propuesta familiar: usos reorganizados desde las diapositivas 2 y 9 de la versión anterior. Foto: deck de piscina. ${FUENTE}`);

// 3 · Resumen y superficies
s = d.slide("light");
header(s, "Resumen y superficies", "La propiedad en cifras");
[
  ["1.100 m²", "terreno en esquina"], ["490 m²", "construcción, aproximadamente"],
  ["750 m²", "jardín, aproximadamente"], ["2", "niveles"],
  ["6", "dormitorios"], ["4 + social", "baños"], ["14", "ambientes"], ["4", "vehículos · 2 accesos vehiculares"],
].forEach(([v, l], i) => {
  const x = M + (i % 4) * 3.07, y = 2.1 + Math.floor(i / 4) * 1.85;
  d.hair(s, x, y, 2.8, C.linea);
  d.text(s, v, { x, y: y + 0.2, w: 2.9, h: 0.8, fontFace: SERIF, fontSize: 40, color: C.tierra });
  d.text(s, l, { x, y: y + 1.05, w: 2.8, h: 0.5, fontSize: 12.5, color: C.grey });
});
d.hair(s, M, 5.95, 12.1, C.linea);
d.text(s, "Configuración: residencia principal y segunda casa para huéspedes. Superficies aproximadas, según la información comercial recibida.",
  { x: M, y: 6.1, w: 12.1, h: 0.4, fontSize: 12.5 });
d.footer(s, 3);
NOTA(`Cifras: instrucción aprobada. 490 m² y 750 m² se conservan como aproximados (dato informado, no verificado documentalmente). ${FUENTE}`);

// 4 · Espacios interiores
s = d.slide("light");
header(s, "Espacios interiores", "Ambientes cálidos, con ladrillo visto y madera");
d.photo(s, F("cocina-achon.jpg"), { x: M, y: 1.95, w: 5.0, h: 4.3 }, { alt: "Cocina con muebles Achon", ax: 0.55 });
d.photo(s, F("estar.jpg"), { x: 5.8, y: 1.95, w: 4.0, h: 4.3 }, { alt: "Estar con salida al exterior", ax: 0.5 });
d.photo(s, F("bano.jpg"), { x: 10.0, y: 1.95, w: 2.733, h: 4.3 }, { alt: "Baño", ax: 0.4 });
caption(s, "Cocina con muebles Achon", M, 6.33, 5.0);
caption(s, "Estar con salida al exterior", 5.8, 6.33, 4.0);
caption(s, "Baño", 10.0, 6.33, 2.733);
d.footer(s, 4);
NOTA(`Fotos: cocina, estar y baño (las mismas de la versión anterior; se eliminó la foto duplicada del estar que aparecía en dos diapositivas). ${FUENTE}`);

// 5 · Dormitorios y huéspedes
s = d.slide("light");
header(s, "Dormitorios y huéspedes", "Espacio para la familia y para las visitas");
d.text(s, [
  { text: "La propiedad cuenta con 6 dormitorios y una segunda casa, independiente de la residencia principal, para alojar a familiares y amigos.", options: { breakLine: true } },
  { text: " ", options: { breakLine: true, fontSize: 8 } },
  { text: "Una solución práctica para recibir visitas con privacidad durante fines de semana, vacaciones y estadías prolongadas." },
], { x: M, y: 1.95, w: 3.5, h: 4.3, fontSize: 14, lineSpacingMultiple: 1.25 });
d.photo(s, F("dormitorio-dos-camas-a.jpg"), { x: 4.4, y: 1.95, w: 2.65, h: 4.3 }, { alt: "Dormitorio con dos camas", ax: 0.6 });
d.photo(s, F("dormitorio-dos-camas-b.jpg"), { x: 7.25, y: 1.95, w: 2.65, h: 4.3 }, { alt: "Dormitorio, vista hacia la puerta", ax: 0.5 });
d.photo(s, F("dormitorio-ladrillo.jpg"), { x: 10.1, y: 1.95, w: 2.633, h: 4.3 }, { alt: "Dormitorio con ladrillo visto", ax: 0.4 });
caption(s, "Dormitorio con dos camas", 4.4, 6.33, 2.65);
caption(s, "Dormitorio, vista hacia la puerta", 7.25, 6.33, 2.65);
caption(s, "Dormitorio con ladrillo visto", 10.1, 6.33, 2.633);
d.footer(s, 5);
NOTA(`Pies de foto neutros: los archivos no indican en qué casa está cada dormitorio (A CONFIRMAR con el propietario antes de afirmarlo). No hay fotos del exterior de la casa de huéspedes. ${FUENTE}`);

// 6 · Jardín y recreación
s = d.slide("light");
header(s, "Jardín y recreación", "La vida al aire libre, sin salir de casa");
d.photo(s, F("piscina-deck.jpg"), { x: M, y: 1.95, w: 6.6, h: 4.3 }, { alt: "Piscina con deck", ay: 0.55 });
d.photo(s, F("quincho-interior.jpg"), { x: 7.4, y: 1.95, w: 2.5, h: 4.3 }, { alt: "Quincho con parrilla", ay: 0.45 });
caption(s, "Piscina con deck", M, 6.33, 6.6);
caption(s, "Quincho con parrilla", 7.4, 6.33, 2.5);
[
  ["Piscina", "con deck"], ["Quincho", "con parrilla"], ["Cancha", "de fútbol y vóley, con iluminación"], ["Jardín", "de aprox. 750 m², empastado, con árboles y palmeras"],
].forEach(([h, b], i) => {
  const y = 1.95 + i * 1.08;
  d.hair(s, 10.2, y, 2.53, C.lapacho);
  d.text(s, h, { x: 10.2, y: y + 0.1, w: 2.53, h: 0.4, fontFace: SERIF, fontSize: 18, color: C.tierra });
  d.text(s, b, { x: 10.2, y: y + 0.5, w: 2.53, h: 0.5, fontSize: 11.5, lineSpacingMultiple: 1.1 });
});
d.footer(s, 6);
NOTA(`Exterior: instrucción aprobada. No hay fotografía de la cancha: se menciona solo en texto. Se reemplazó la doble foto idéntica del quincho y el pie "Piscina con deck / Quincho…" sobreimpreso de la versión anterior. ${FUENTE}`);

// 7 · Ubicación (sin mapa: no hay coordenadas ni mapa verificado)
s = d.slide("dark");
header(s, "Ubicación", "Urbanización SADI III, San Bernardino");
d.text(s, "Departamento de Cordillera, Paraguay", { x: M, y: 1.8, w: 8, h: 0.4, fontSize: 15, color: C.crema });
d.text(s, "La casa se encuentra en un terreno en esquina dentro de la Urbanización SADI III, en un entorno residencial con abundante vegetación, pensado para disfrutar de fines de semana y vacaciones.",
  { x: M, y: 2.6, w: 6.6, h: 1.4, fontSize: 15, lineSpacingMultiple: 1.3 });
[["Esquina", "terreno de 1.100 m²"], ["2", "accesos vehiculares"], ["Norte", "orientación"]].forEach(([v, l], i) => {
  const x = M + i * 2.3;
  d.hair(s, x, 4.45, 2.0, C.lapacho);
  d.text(s, v, { x, y: 4.6, w: 2.2, h: 0.65, fontFace: SERIF, fontSize: 30, color: C.lapacho });
  d.text(s, l, { x, y: 5.3, w: 2.2, h: 0.35, fontSize: 12, color: C.crema });
});
s.addShape(d.pres.ShapeType.rect, { x: 8.0, y: 2.6, w: 4.733, h: 3.1, fill: { color: C.navy_tint }, line: { color: C.lapacho, width: 0.75 } });
d.text(s, "UBICACIÓN REFERENCIAL", { x: 8.35, y: 2.9, w: 4.1, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: C.lapacho });
d.text(s, "La dirección exacta y la ubicación en el mapa se comparten al coordinar la visita.",
  { x: 8.35, y: 3.35, w: 4.1, h: 1.1, fontFace: SERIF, fontSize: 19, lineSpacingMultiple: 1.15 });
d.text(s, "Referencia: Urbanización SADI III · San Bernardino · Cordillera", { x: 8.35, y: 4.75, w: 4.1, h: 0.65, fontSize: 11.5, lineSpacingMultiple: 1.2 });
d.footer(s, 7);
NOTA("Ubicación: solo el dato aprobado (Urbanización SADI III, San Bernardino, Cordillera). Sin mapa ni marcador: no se dispone de dirección, coordenadas ni mapa verificado. Sin distancias ni tiempos de traslado. Se eliminó 'acceso a la ciudad' (afirmación no respaldada). La foto de galería que ilustraba esta diapositiva se quitó porque no mostraba el entorno.");

// 8 · Ficha técnica (tabla nativa editable)
s = d.slide("light");
header(s, "Ficha técnica", "Características principales");
d.table(s, [
  ["Característica", "Detalle"],
  ["Ubicación", "Urbanización SADI III, San Bernardino, Cordillera"],
  ["Terreno", "1.100 m², en esquina"],
  ["Construcción", "Aproximadamente 490 m²"],
  ["Jardín", "Aproximadamente 750 m², empastado, con árboles y palmeras"],
  ["Programa", "6 dormitorios · 4 baños + baño social · 14 ambientes · 2 niveles"],
  ["Configuración", "Residencia principal y segunda casa para huéspedes"],
  ["Exterior", "Piscina con deck · quincho con parrilla · cancha de fútbol y vóley con iluminación"],
  ["Cocina", "Con muebles Achon"],
  ["Estacionamiento", "4 vehículos · 2 accesos vehiculares"],
  ["Servicios y seguridad", "Tanque de agua con motor · alarma · WiFi · TV cable"],
  ["Orientación", "Norte"],
  ["Estado", "Excelente conservación, según la información recibida"],
], { x: M, y: 1.95, w: 12.133, colW: [3.1, 9.033], rowH: 0.37, fontSize: 12.5 });
d.footer(s, 8);
NOTA(`Ficha: todos los datos de la instrucción aprobada. 'Estado' se atribuye a la información recibida (no verificado). ${FUENTE}`);

// 9 · Precio
s = d.slide("light");
d.photo(s, F("quincho-exterior.jpg"), { x: 6.9, y: 0, w: W - 6.9, h: H }, { alt: "Quincho con parrilla y galería", ax: 0.55 });
d.eyebrow(s, "Precio de venta", { w: 6 });
d.text(s, "USD 179.000", { x: M, y: 1.2, w: 6, h: 1.2, fontFace: SERIF, fontSize: 58, color: C.tierra });
d.text(s, "Casa familiar con piscina, quincho, gran jardín y casa independiente para huéspedes, en Urbanización SADI III, San Bernardino.",
  { x: M, y: 2.6, w: 5.8, h: 1.0, fontSize: 15, lineSpacingMultiple: 1.25 });
d.hair(s, M, 3.95, 5.7, C.lapacho);
d.text(s, "A CONFIRMAR ANTES DE FORMALIZAR UNA OFERTA", { x: M, y: 4.15, w: 6, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.gold_d });
d.text(s, "Forma de pago · impuestos y gastos de la operación · documentación · disponibilidad · elementos muebles incluidos.",
  { x: M, y: 4.55, w: 5.8, h: 0.8, fontSize: 13, lineSpacingMultiple: 1.25 });
caption(s, "Fotografía: quincho con parrilla y galería.", M, 5.9, 5.8);
d.isotipo(s, { x: M, y: 6.93, w: 0.3 });
d.text(s, "WEB ID 39903", { x: M + 0.45, y: 6.93, w: 4.5, h: 0.3, fontSize: 9, color: C.grey, valign: "middle" });
d.text(s, "09", { x: 5.7, y: 6.93, w: 0.8, h: 0.3, fontSize: 9, color: C.grey, align: "right", valign: "middle" });
NOTA("Precio: USD 179.000 (instrucción aprobada). Condiciones no respaldadas en los archivos: forma de pago, impuestos, documentación, disponibilidad y muebles incluidos → A CONFIRMAR.");

// 10 · Cierre (tierra colorada, retrato autorizado)
s = d.slide("closing");
d.photo(s, F("retrato-jjc.jpg"), { x: 8.55, y: 0, w: W - 8.55, h: H }, { alt: "Lic. Juan José Castillo", ax: 0.5, ay: 0 });
d.lockup(s, { x: M, y: 0.6, w: 2.4, dark: true });
const cw = 7.4;
d.text(s, "Coordinemos una visita", { x: M, y: 1.75, w: cw, h: 0.9, fontFace: SERIF, fontSize: 40 });
d.text(s, "Conocé personalmente la amplitud de la casa, la independencia de la casa de huéspedes y sus espacios exteriores.",
  { x: M, y: 2.75, w: cw - 0.4, h: 0.9, fontSize: 15, lineSpacingMultiple: 1.25 });
d.hair(s, M, 3.95, cw - 0.3, C.lapacho);
d.text(s, "Lic. Juan José Castillo", { x: M, y: 4.12, w: cw, h: 0.5, fontFace: SERIF, fontSize: 24 });
d.text(s, "Broker Inmobiliario | Meridiano Capital", { x: M, y: 4.62, w: cw, h: 0.35, fontSize: 13.5 });
d.text(s, [
  { text: "+595 982 853 111", options: { hyperlink: { url: "tel:+595982853111" }, breakLine: true } },
  { text: "juancastillo@meridianocapital.net", options: { hyperlink: { url: "mailto:juancastillo@meridianocapital.net" }, breakLine: true } },
  { text: "www.meridianocapital.net", options: { hyperlink: { url: "https://www.meridianocapital.net" } } },
], { x: M, y: 5.1, w: cw, h: 1.0, fontSize: 13.5, color: C.crema, lineSpacingMultiple: 1.2 });
d.text(s, "WEB ID 39903", { x: M, y: 6.15, w: cw, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.lapacho });
d.text(s, "Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Datos de la propiedad según la información recibida.",
  { x: M, y: 6.55, w: cw - 0.2, h: 0.6, fontSize: 9, italic: true, transparency: 20, lineSpacingMultiple: 1.15 });
NOTA("Cierre: contacto y cargo exactamente como los indicó el asesor (rank 1). Aviso legal de venta aprobado (brand_tokens.json → disclaimers.venta, D-098) + atribución de datos. Se eliminaron textos heredados de otras operaciones.");

d.save(OUT).then((o) => console.log("OK", o));
