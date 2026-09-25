// Kit de construcción de presentaciones Meridiano Capital (pptxgenjs).
// Centraliza lo que toda presentación de propiedad repite: tokens de marca
// (assets/brand_tokens.json), logos vectoriales vigentes con respaldo PNG real,
// tipografías Fraunces/Poppins (Fraunces nunca en negrita, D-040), recorte de
// imágenes SIN deformación, pies y numeración, tablas de marca y cierre canónico
// con la firma que corresponde al rol (D-039 / D-096).
//
// Uso mínimo:
//   const K = require("<skill>/scripts/meridiano_deck_kit.js");
//   const d = K.createDeck({ title: "Casa en Villa Morra — Venta", footerLabel: "Casa Villa Morra · Propuesta de venta" });
//   let s = d.slide("dark"); d.lockup(s, { x: d.M, y: 0.6, w: 2.5, dark: true }); ...
//   await d.save("salida.pptx");
// Ver references/workflow.md (Fase 5) para el patrón completo.
"use strict";
const fs = require("fs");
const path = require("path");

function req(name) {
  try { return require(name); } catch (e) {
    const { execSync } = require("child_process");
    for (const root of [process.env.NODE_PATH, (() => { try { return execSync("npm root -g").toString().trim(); } catch { return null; } })()]) {
      if (!root) continue;
      for (const r of root.split(path.delimiter)) { try { return require(path.join(r, name)); } catch { /* sigue */ } }
    }
    throw new Error(`Falta el módulo "${name}". Instalar con: npm install ${name}`);
  }
}

const SKILL_DIR = path.resolve(__dirname, "..");
const ASSETS = path.join(SKILL_DIR, "assets");
const TOKENS = JSON.parse(fs.readFileSync(path.join(ASSETS, "brand_tokens.json"), "utf8"));
const C = Object.assign({}, TOKENS.colors.official, TOKENS.colors.utility);

// ---- dimensiones de imagen (PNG/JPEG/GIF/SVG) sin dependencias ----
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(0, 8).toString("hex") === "89504e470d0a1a0a") return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.slice(0, 3).toString() === "GIF") return [b.readUInt16LE(6), b.readUInt16LE(8)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  const s = b.slice(0, 4000).toString();
  const vb = s.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (vb) return [parseFloat(vb[1]), parseFloat(vb[2])];
  throw new Error(`No se pudo leer el tamaño de ${file}. Convertir a PNG/JPEG con inspect_inputs.py --prepare-images (respeta la orientación EXIF).`);
}

function createDeck(opt = {}) {
  const pptxgen = req("pptxgenjs");
  const p = new pptxgen();
  const W = 13.333, H = 7.5, M = 0.6, R = W - M;
  p.defineLayout({ name: "MC_WIDE", width: W, height: H });
  p.layout = "MC_WIDE";
  p.title = opt.title || "Meridiano Capital";
  p.subject = opt.subject || "";
  p.author = "Meridiano Capital";
  p.company = "Meridiano Capital";
  const SERIF = TOKENS.typography.headline, SANS = TOKENS.typography.body;
  const logo = (k) => path.join(ASSETS, TOKENS.logos[k]);
  const BG = { dark: C.petroleo, light: C.crema, white: C.white, closing: C.tierra };

  const d = { pres: p, C, W, H, M, R, SERIF, SANS, TOKENS, imageSize };

  d.slide = (bg = "light") => { const s = p.addSlide(); s.background = { color: BG[bg] || bg }; s._mcDark = bg === "dark" || bg === "closing"; return s; };

  d.text = (s, text, o = {}) => {
    const opts = Object.assign({ isTextBox: true, margin: 0, fontFace: SANS, fontSize: 13, color: s._mcDark ? C.crema : C.petroleo, valign: "top" }, o);
    if (opts.fontFace === SERIF) opts.bold = false; // D-040: Fraunces nunca en negrita
    s.addText(text, opts);
  };
  d.eyebrow = (s, text, o = {}) => d.text(s, String(text).toUpperCase(), Object.assign(
    { x: M, y: 0.6, w: 11.5, h: 0.3, fontSize: 11, bold: true, color: s._mcDark ? C.lapacho : C.gold_d, charSpacing: 3, valign: "middle" }, o));
  d.title = (s, text, o = {}) => d.text(s, text, Object.assign(
    { x: M, y: 0.98, w: 11.5, h: 0.75, fontFace: SERIF, fontSize: 30, lineSpacingMultiple: 1.05 }, o));
  d.figure = (s, value, label, o = {}) => { // cifra destacada + etiqueta
    const { x, y, w = 3, size = 26, color } = o;
    d.text(s, value, { x, y, w, h: size / 50, fontFace: SERIF, fontSize: size, color: color || (s._mcDark ? C.lapacho : C.tierra) });
    d.text(s, label, { x, y: y + size / 50 + 0.04, w, h: 0.3, fontSize: 10.5, color: s._mcDark ? C.crema : C.grey, transparency: s._mcDark ? 20 : 0 });
  };
  d.hair = (s, x, y, w, color) => s.addShape(p.ShapeType.line, { x, y, w, h: 0, line: { color: color || (s._mcDark ? C.navy_tint : C.linea), width: 0.75 } });

  // Imagen sin deformación. mode "cover": llena el marco con recorte proporcional (ancla ax/ay);
  // mode "contain": imagen completa centrada dentro del marco (planos, mapas, documentos).
  d.photo = (s, file, box, o = {}) => {
    const [pw, ph] = o.px || imageSize(file);
    const { x, y, w, h } = box;
    const mode = o.mode || "cover";
    const extra = {};
    if (o.hyperlink) extra.hyperlink = typeof o.hyperlink === "string" ? { url: o.hyperlink } : o.hyperlink;
    const alt = o.alt || path.basename(file);
    if (mode === "contain") {
      const k = Math.min(w / pw, h / ph), vw = pw * k, vh = ph * k;
      const ax = o.ax ?? 0.5, ay = o.ay ?? 0.5;
      s.addImage(Object.assign({ path: file, x: x + (w - vw) * ax, y: y + (h - vh) * ay, w: vw, h: vh, altText: alt }, extra));
      return { x: x + (w - vw) * ax, y: y + (h - vh) * ay, w: vw, h: vh };
    }
    const k = Math.max(w / pw, h / ph), vw = pw * k, vh = ph * k;
    const ax = o.ax ?? 0.5, ay = o.ay ?? 0.5;
    s.addImage(Object.assign({ path: file, x, y, w: vw, h: vh, altText: alt,
      sizing: { type: "crop", x: (vw - w) * ax, y: (vh - h) * ay, w, h } }, extra));
    return { x, y, w, h, cropPct: { x: (1 - w / vw) * 100, y: (1 - h / vh) * 100 } };
  };

  d.lockup = (s, o = {}) => {
    const w = o.w || 2.5, dark = o.dark ?? s._mcDark;
    s.addImage({ path: logo(dark ? "lockup_dark_bg" : "lockup_light_bg"), x: o.x ?? M, y: o.y ?? 0.6, w, h: w / TOKENS.logos.lockup_aspect, altText: "Meridiano Capital" });
  };
  d.isotipo = (s, o = {}) => {
    const w = o.w || 0.3, dark = o.dark ?? s._mcDark;
    s.addImage({ path: logo(dark ? "isotipo_dark_bg" : "isotipo_light_bg"), x: o.x, y: o.y, w, h: w, altText: "Isotipo Meridiano Capital" });
  };
  d.footer = (s, n, o = {}) => {
    const dark = o.dark ?? s._mcDark, col = dark ? C.crema : C.grey, tr = dark ? 30 : 0;
    d.isotipo(s, { x: M, y: 6.93, w: 0.3, dark });
    d.text(s, o.label || opt.footerLabel || "Meridiano Capital", { x: M + 0.45, y: 6.93, w: 9.5, h: 0.3, fontSize: 9, color: col, transparency: tr, valign: "middle" });
    if (n != null) d.text(s, String(n).padStart(2, "0"), { x: R - 0.8, y: 6.93, w: 0.8, h: 0.3, fontSize: 9, color: col, transparency: tr, align: "right", valign: "middle" });
  };

  // Tabla de marca: encabezado petróleo/crema, filas alternas FILA, bordes LINEA. rows[0] = encabezado.
  d.table = (s, rows, o = {}) => {
    const body = rows.map((r, i) => r.map((cell) => {
      const c = typeof cell === "object" && cell !== null && "text" in cell ? cell : { text: String(cell ?? "") };
      const base = i === 0 ? { bold: true, color: C.crema, fill: { color: C.petroleo }, fontSize: (o.fontSize || 12.5) - 1 }
        : { fill: { color: i % 2 === 0 ? C.fila : C.white } };
      return { text: c.text, options: Object.assign(base, c.options || {}) };
    }));
    s.addTable(body, Object.assign({ fontFace: SANS, fontSize: 12.5, color: C.petroleo, valign: "middle", rowH: 0.5,
      margin: [0, 0.14, 0, 0.14], border: { type: "solid", pt: 0.75, color: C.linea } }, o));
  };

  // Cierre canónico (09-cierres-y-firmas.md): tierra colorada, lockup inverso, titular propio de la pieza,
  // firma según preset (A/B D-039, C D-096), aviso legal y pie institucional si el preset lo define.
  d.closing = (o = {}) => {
    const preset = TOKENS.signature_presets[o.signaturePreset];
    if (!preset) throw new Error(`signaturePreset inválido: ${o.signaturePreset}. Opciones: ${Object.keys(TOKENS.signature_presets).join(", ")}`);
    const ct = Object.assign({}, TOKENS.contact, o.contact || {});
    const s = d.slide("closing");
    const colW = o.photo ? 7.6 : 11.5;
    if (o.photo) d.photo(s, o.photo, { x: 8.55, y: 0, w: W - 8.55, h: H }, { alt: o.photoAlt || ct.name, ax: 0.5, ay: 0 });
    d.lockup(s, { x: M, y: 0.6, w: 2.4, dark: true });
    d.text(s, o.headline || "", { x: M, y: 1.8, w: colW, h: 1.6, fontFace: SERIF, fontSize: 38, lineSpacingMultiple: 1.02 });
    if (o.lead) d.text(s, o.lead, { x: M, y: 3.5, w: colW - 0.2, h: 0.8, fontSize: 14, transparency: 10, lineSpacingMultiple: 1.25 });
    d.hair(s, M, 4.5, colW - 0.25, C.lapacho);
    let y = 4.66;
    if (preset.brand_above) { d.text(s, "MERIDIANO CAPITAL", { x: M, y, w: colW, h: 0.3, fontSize: 10, bold: true, charSpacing: 2 }); y += 0.34; }
    d.text(s, ct.name, { x: M, y, w: colW, h: 0.5, fontFace: SERIF, fontSize: 22 }); y += 0.5;
    d.text(s, preset.title, { x: M, y, w: colW, h: 0.35, fontSize: 13 }); y += 0.4;
    if (preset.representation_line) { d.text(s, preset.representation_line, { x: M, y, w: colW, h: 0.35, fontSize: 13 }); y += 0.4; }
    d.text(s, [ct.phone, ct.email, ct.web].filter(Boolean).join("  ·  "), { x: M, y, w: colW, h: 0.35, fontSize: 12.5 }); y += 0.46;
    if (o.disclaimer) d.text(s, o.disclaimer, { x: M, y, w: colW - 0.1, h: 0.5, fontSize: 9, italic: true, transparency: 25, lineSpacingMultiple: 1.15 });
    if (preset.institutional_footer) {
      d.hair(s, M, 6.78, colW - 0.25, C.crema);
      d.text(s, preset.institutional_footer.toUpperCase(), { x: M, y: 6.9, w: colW, h: 0.3, fontSize: 9, bold: true, charSpacing: 1.2, valign: "middle" });
    }
    if (o.notes) s.addNotes(o.notes);
    return s;
  };

  // Guardado: respaldo PNG real para cada SVG (pptxgenjs copia el SVG como si fuera PNG) y
  // colores de hipervínculo de marca en el tema (en lugar del azul por defecto).
  d.save = async (out) => {
    const JSZip = req("jszip");
    const sharp = req("sharp");
    const buf = await p.write({ outputType: "nodebuffer" });
    const zip = await JSZip.loadAsync(buf);
    for (const svg of Object.keys(zip.files).filter((f) => /^ppt\/media\/.*\.svg$/.test(f))) {
      const m = svg.match(/image-(\d+)-(\d+)\.svg$/);
      if (!m) continue;
      const png = svg.replace(/image-(\d+)-(\d+)\.svg$/, `image-${m[1]}-${Number(m[2]) - 1}.png`);
      if (!zip.files[png]) continue;
      const raster = await sharp(await zip.file(svg).async("nodebuffer"), { density: 600 }).resize({ width: 1600 }).png().toBuffer();
      zip.file(png, raster);
    }
    for (const th of Object.keys(zip.files).filter((f) => /^ppt\/theme\/theme\d+\.xml$/.test(f))) {
      let x = await zip.file(th).async("string");
      x = x.replace(/<a:hlink>[\s\S]*?<\/a:hlink>/, `<a:hlink><a:srgbClr val="${C.tierra}"/></a:hlink>`)
           .replace(/<a:folHlink>[\s\S]*?<\/a:folHlink>/, `<a:folHlink><a:srgbClr val="${C.grey}"/></a:folHlink>`);
      zip.file(th, x);
    }
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    return out;
  };
  return d;
}

// Nombre de archivo de entrega: Meridiano_Capital_[Propiedad]_[Operacion]_Final
function deliverableName(property, operation) {
  const clean = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `Meridiano_Capital_${clean(property)}_${clean(operation)}_Final`;
}

module.exports = { createDeck, deliverableName, imageSize, TOKENS, C, ASSETS };
