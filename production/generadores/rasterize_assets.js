// Rasteriza los SVG fuente nuevos (mojon partido / cerradura de linea) a PNG
// para el pipeline de generadores/ (pptxgenjs y docx.js consumen PNG, no SVG).
const sharp = require("sharp");
const fs = require("fs");

// --- Meridiano: mojon partido por el meridiano (D-034) ---
function mojonSvg(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <path d="M52 6 L14 100 L56 100" fill="none" stroke="${stroke}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M68 6 L106 100 L64 100" fill="none" stroke="${stroke}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <line x1="4" y1="112" x2="49" y2="112" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/>
    <line x1="71" y1="112" x2="116" y2="112" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/>
    <line x1="60" y1="0" x2="60" y2="120" stroke="#C9982E" stroke-width="3"/>
    <circle cx="60" cy="60" r="6" fill="#C9982E"/>
  </svg>`;
}

// --- Urbannit: cerradura en trazo abierto (D-035) ---
function keyholeSvg(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="35" r="14" fill="none" stroke="${stroke}" stroke-width="6"/>
    <path d="M50 48 L64 80 L36 80 Z" fill="none" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>
  </svg>`;
}

async function run() {
  // Meridiano -- fondo claro (petroleo) y fondo oscuro (crema), 1200x1200 (igual que los PNG viejos)
  await sharp(Buffer.from(mojonSvg("#14313A"))).resize(1200, 1200).png().toFile("isotipo.png");
  await sharp(Buffer.from(mojonSvg("#F3EDE3"))).resize(1200, 1200).png().toFile("isotipo_inverso.png");

  // Urbannit -- Ka'a verde (fondo claro), crema (fondo oscuro/claro del icono), dorado (acento), 240x240
  await sharp(Buffer.from(keyholeSvg("#45573A"))).resize(240, 240).png().toFile("urb_iso.png");
  await sharp(Buffer.from(keyholeSvg("#F1E8D8"))).resize(240, 240).png().toFile("urb_iso_claro.png");
  await sharp(Buffer.from(keyholeSvg("#C9982E"))).resize(240, 240).png().toFile("urb_iso_gold.png");

  // Logotipo horizontal Meridiano (isotipo + wordmark Fraunces) -- 1200x319, mismo aspect que el viejo
  const wordmarkSvg = fs.readFileSync("../app/frontend/assets/logos/meridiano-primario-horizontal.svg", "utf-8");
  await sharp(Buffer.from(wordmarkSvg)).resize(1200, 319).png().toFile("logo_horizontal.png");

  console.log("OK -- assets rasterizados: isotipo.png, isotipo_inverso.png, urb_iso.png, urb_iso_claro.png, urb_iso_gold.png, logo_horizontal.png");
}
run().catch(e => { console.error(e); process.exit(1); });
