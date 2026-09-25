#!/usr/bin/env python3
"""Informe de validación final VALIDACION_[PROPIEDAD].md (Fase 6).

Reúne los resultados de los demás scripts y ejecuta los controles finales
sobre el .pptx: reapertura y editabilidad (texto, tablas, gráficos, formas;
detecta diapositivas aplanadas como imagen), tipografías declaradas
(Fraunces/Poppins; Fraunces nunca en negrita, D-040), colores fuera de la
paleta registrada, texto residual de plantilla, cadenas prohibidas (correo o
cargo antiguos, marcas de terceros no autorizadas) y un barrido de datos
personales para revisión humana.

Entradas (todas opcionales salvo --pptx y --out):
  --inventory     salida de inspect_inputs.py
  --data          salida de validate_property_data.py
  --aspect        salida de validate_image_aspect_ratios.py --out
  --render        salida JSON de render_presentation.py
  --meta          JSON con: property, operation, audience, meridiano_role, mode,
                  skills_consulted[], brand_sources[], signature_preset,
                  decisions_applied[], contradictions[], warnings[],
                  text_changes[], limitations[], forbid[], allowed_emails[]

Resultado: APROBADO / APROBADO CON OBSERVACIONES / NO APROBADO (código 1).

Uso:
  python build_validation_report.py --pptx deck.pptx --out VALIDACION_X.md [--inventory ...] [--data ...] [--aspect ...] [--render ...] [--meta ...]
"""
import argparse
import json
import re
import sys
import zipfile
from pathlib import Path

from lxml import etree

NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
TOKENS = json.loads((Path(__file__).resolve().parent.parent / "assets" / "brand_tokens.json").read_text(encoding="utf-8"))
PALETTE = {v.upper() for grp in ("official", "utility") for v in TOKENS["colors"][grp].values()}
BRAND_FONTS = {TOKENS["typography"]["headline"], TOKENS["typography"]["body"]}
FALLBACK_FONTS = {f for lst in TOKENS["typography"]["fallbacks"].values() for f in lst}
PLACEHOLDER = re.compile(r"lorem|ipsum|\bxxx+\b|\bTODO\b|\[insert|\[completar|click to (add|edit)|haga clic para", re.I)
PII = [
    ("documento de identidad", re.compile(r"(?i)\b(c\.?\s?i\.?|c[ée]dula|dni|pasaporte|rg|cpf)\b[^\n]{0,20}?\d[\d.\-]{5,}")),
    ("RUC", re.compile(r"(?i)\bruc\b[^\n]{0,10}?\d{5,}-?\d")),
    ("número con formato de CI/RUC", re.compile(r"\b\d{1,2}\.\d{3}\.\d{3}\b(?!\s*(m²|m2|usd|gs|pyg|%))", re.I)),
    ("cuenta bancaria", re.compile(r"(?i)\b(cuenta|cta\.?|cbu|iban|swift|alias)\b[^\n]{0,25}?\d{6,}")),
    ("firma o sello", re.compile(r"(?i)\bfirma(do)? por\b|\bsello\b")),
]
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
PHONE = re.compile(r"\+?\d[\d\s().-]{8,}\d")


def load(p):
    return json.loads(Path(p).read_text(encoding="utf-8")) if p and Path(p).exists() else None


def inspect_pptx(path):
    z = zipfile.ZipFile(path)
    pres = etree.fromstring(z.read("ppt/presentation.xml"))
    sz = pres.find("p:sldSz", NS)
    sw, sh = int(sz.get("cx")), int(sz.get("cy"))
    rels = etree.fromstring(z.read("ppt/_rels/presentation.xml.rels"))
    rmap = {r.get("Id"): (r.get("Target").lstrip("/") if r.get("Target").startswith("/") else "ppt/" + r.get("Target")) for r in rels}
    order = [rmap[s.get("{%s}id" % NS["r"])] for s in pres.findall("p:sldIdLst/p:sldId", NS)]
    res = {"slides": len(order), "text_shapes": 0, "tables": 0, "charts": 0, "pictures": 0, "shapes": 0,
           "flattened_slides": [], "fonts": set(), "fraunces_bold": [], "off_palette": {}, "placeholders": [],
           "texts": [], "notes": []}
    for n, part in enumerate(order, 1):
        root = etree.fromstring(z.read(part))
        tree = root.find("p:cSld/p:spTree", NS)
        n_text = n_pic = 0
        big_pic = False
        for sp in tree.iter("{%s}sp" % NS["p"]):
            t = " ".join(x.text or "" for x in sp.iter("{%s}t" % NS["a"])).strip()
            if t:
                n_text += 1
                res["texts"].append((n, t))
            else:
                res["shapes"] += 1
        for pic in tree.iter("{%s}pic" % NS["p"]):
            n_pic += 1
            ext = pic.find("p:spPr/a:xfrm/a:ext", NS)
            if ext is not None and int(ext.get("cx")) * int(ext.get("cy")) > 0.85 * sw * sh:
                big_pic = True
        for gf in tree.iter("{%s}graphicFrame" % NS["p"]):
            if gf.find(".//a:tbl", NS) is not None:
                res["tables"] += 1
                n_text += 1
                res["texts"].append((n, " ".join(x.text or "" for x in gf.iter("{%s}t" % NS["a"]))))
            elif "chart" in etree.tostring(gf).decode():
                res["charts"] += 1
        res["text_shapes"] += n_text
        res["pictures"] += n_pic
        if big_pic and n_text == 0:
            res["flattened_slides"].append(n)
        for r in root.iter("{%s}rPr" % NS["a"], "{%s}defRPr" % NS["a"]):
            lat = r.find("a:latin", NS)
            face = lat.get("typeface") if lat is not None else None
            if face:
                res["fonts"].add(face)
                if face == "Fraunces" and r.get("b") == "1":
                    res["fraunces_bold"].append(n)
        for c in root.iter("{%s}srgbClr" % NS["a"]):
            v = c.get("val", "").upper()
            if v and v not in PALETTE:
                res["off_palette"].setdefault(v, set()).add(n)
        # notas
        srels = part.replace("slides/", "slides/_rels/") + ".rels"
        if srels in z.namelist():
            for r in etree.fromstring(z.read(srels)):
                if r.get("Type", "").endswith("/notesSlide"):
                    npart = "ppt/notesSlides/" + Path(r.get("Target")).name
                    if npart in z.namelist():
                        nt = " ".join(x.text or "" for x in etree.fromstring(z.read(npart)).iter("{%s}t" % NS["a"]))
                        res["notes"].append((n, nt))
    for n, t in res["texts"]:
        if PLACEHOLDER.search(t):
            res["placeholders"].append((n, t[:80]))
    res["fonts"] = sorted(res["fonts"])
    res["off_palette"] = {k: sorted(v) for k, v in res["off_palette"].items()}
    return res


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    for k in ("pptx", "pdf", "inventory", "data", "aspect", "render", "meta", "out"):
        ap.add_argument(f"--{k}")
    a = ap.parse_args()
    if not a.pptx or not a.out:
        ap.error("--pptx y --out son obligatorios")
    inv, data, aspect, render, meta = (load(a.inventory), load(a.data), load(a.aspect), load(a.render), load(a.meta) or {})

    blockers, observations = [], []
    try:
        px = inspect_pptx(a.pptx)
    except Exception as e:  # noqa: BLE001
        px = None
        blockers.append(f"El .pptx final no se pudo reabrir: {e}")

    if px:
        if px["text_shapes"] == 0:
            blockers.append("El archivo no tiene texto editable.")
        if px["flattened_slides"]:
            (blockers if len(px["flattened_slides"]) > px["slides"] / 2 else observations).append(
                f"Diapositivas aplanadas como imagen (sin texto editable): {px['flattened_slides']}")
        non_brand = [f for f in px["fonts"] if f not in BRAND_FONTS]
        if [f for f in non_brand if f not in FALLBACK_FONTS]:
            blockers.append(f"Tipografías fuera del sistema: {[f for f in non_brand if f not in FALLBACK_FONTS]}")
        elif non_brand:
            observations.append(f"Se usan sustitutos oficiales de tipografía: {non_brand}")
        if px["fraunces_bold"]:
            blockers.append(f"Fraunces en negrita (prohibido por D-040) en diapositivas {sorted(set(px['fraunces_bold']))}")
        if px["off_palette"]:
            observations.append(f"Colores fuera de la paleta registrada: {px['off_palette']} (verificar: solo se admiten los de 05-sistema-cromatico.md)")
        if px["placeholders"]:
            blockers.append(f"Texto residual de plantilla: {px['placeholders']}")
        alltext = "\n".join(t for _, t in px["texts"] + px["notes"])
        forbid = TOKENS["contact"]["forbidden"] + meta.get("forbid", [])
        hits = sorted({f for f in forbid if f.lower() in alltext.lower()})
        if hits:
            blockers.append(f"Cadenas prohibidas presentes (correo/cargo/marca antiguos): {hits}")
        allowed_emails = {TOKENS["contact"]["email"].lower(), *[e.lower() for e in meta.get("allowed_emails", [])]}
        pii = []
        for n, t in px["texts"] + [(f"notas {n}", t) for n, t in px["notes"]]:
            for label, rx in PII:
                for mm in rx.finditer(t):
                    pii.append((n, label, mm.group(0)[:60]))
            for e in EMAIL.findall(t):
                e = e.rstrip(".")
                if e.lower() not in allowed_emails:
                    pii.append((n, "correo no autorizado", e))
            for ph in PHONE.findall(t):
                digits = re.sub(r"\D", "", ph)
                if digits != re.sub(r"\D", "", TOKENS["contact"]["phone"]) and len(digits) >= 9 and not re.search(r"\d\.\d{3}", ph):
                    pii.append((n, "teléfono no autorizado", ph.strip()))
        if pii:
            observations.append("Posibles datos personales: revisar el contexto de cada coincidencia (puede ser un dato legítimo como una calle o un número de lote).")

    if aspect and aspect.get("result") != "OK":
        blockers.append(f"Imágenes deformadas: {len(aspect.get('deformed', []))}")
    if aspect and aspect.get("svg_fallback_problems"):
        observations.append("Respaldo PNG de algún SVG inválido.")
    if render and render.get("result") != "OK":
        blockers.append(f"Render/PDF: {render.get('result')}")
    if render and render.get("pdf_fonts_not_embedded"):
        observations.append(f"Fuentes no incrustadas en el PDF: {render['pdf_fonts_not_embedded']}")
    if data:
        if data.get("errors"):
            blockers.append(f"Errores en datos comerciales: {len(data['errors'])}")
        if data.get("needs_confirmation"):
            blockers.append(f"Datos materiales que requieren confirmación del usuario: {len(data['needs_confirmation'])}")
    for c in meta.get("contradictions", []):
        if c.get("open"):
            blockers.append(f"Contradicción abierta: {c.get('field')}")

    result = "NO APROBADO" if blockers else "APROBADO CON OBSERVACIONES" if observations or meta.get("warnings") else "APROBADO"
    L = []
    w = L.append
    w(f"# Validación: {meta.get('property', Path(a.pptx).stem)}\n")
    w(f"**Resultado: {result}**\n")
    w("| Campo | Valor |\n|---|---|")
    for k, lab in (("operation", "Operación"), ("asset_type", "Tipo de activo"), ("audience", "Audiencia"),
                   ("meridiano_role", "Rol de Meridiano Capital"), ("mode", "Modo de trabajo"), ("signature_preset", "Firma aplicada")):
        if meta.get(k):
            w(f"| {lab} | {meta[k]} |")
    w(f"| PowerPoint | `{Path(a.pptx).name}` |")
    if a.pdf or (render and render.get("pdf")):
        w(f"| PDF | `{Path(a.pdf or render['pdf']).name}` |")
    if px:
        w(f"| Diapositivas | {px['slides']} |")
    w("")
    if blockers:
        w("## Bloqueantes\n" + "\n".join(f"- ❌ {b}" for b in blockers) + "\n")
    if observations or meta.get("warnings"):
        w("## Observaciones\n" + "\n".join(f"- ⚠️ {o}" for o in observations + meta.get("warnings", [])) + "\n")
    if inv:
        w("## 1. Archivos recibidos\n\n| Archivo | Tipo | Estado | Detalle |\n|---|---|---|---|")
        for e in inv.get("inputs", []):
            det = ", ".join(f"{k}: {e[k]}" for k in ("slides", "pages", "px", "sheets", "embedded_media") if k in e)
            w(f"| {e['name']} | {e['kind']} | {e['status']} | {det} |")
        for i in inv.get("ignored", []):
            w(f"| {Path(i['path']).name} | — | ignorado | {i['reason']} |")
        w("")
    w("## 2. Skills y fuentes de marca consultadas\n")
    for s in meta.get("skills_consulted", []):
        w(f"- Skill: {s}")
    for s in meta.get("brand_sources", []):
        w(f"- Fuente: {s}")
    for d in meta.get("decisions_applied", []):
        w(f"- Decisión aplicada: {d}")
    w(f"- Tokens de marca: `assets/brand_tokens.json` (snapshot {TOKENS['_provenance']['snapshot_date']})\n")
    if px:
        w("## 3. Tipografía, logos y editabilidad\n")
        w(f"- Tipografías declaradas: {', '.join(px['fonts']) or '—'}")
        if render:
            w(f"- Fuentes incrustadas en el PDF: {', '.join(render.get('pdf_fonts', [])) or '—'}")
        logos = [i for i in (aspect or {}).get("images", []) if str(i.get("media", "")).endswith(".svg")]
        w(f"- Logos vectoriales (SVG) en el archivo: {len(logos)}")
        w(f"- Elementos editables: {px['text_shapes']} textos, {px['tables']} tablas, {px['charts']} gráficos, {px['shapes']} formas; {px['pictures']} imágenes")
        w(f"- Diapositivas aplanadas: {px['flattened_slides'] or 'ninguna'}\n")
    if aspect:
        w("## 4. Imágenes\n")
        w(f"- Verificadas: {aspect['images_checked']} · desviación máxima de proporción: **{aspect['max_deviation_pct']:.4f}%** (tolerancia {aspect['tolerance_pct']}%) · resultado: **{aspect['result']}**")
        for d in aspect.get("deformed", []):
            w(f"  - ❌ diap. {d['slide']} {d['shape']}: {d['aspect_deviation_pct']}% ({d['axis']})")
        for d in aspect.get("low_resolution", []):
            w(f"  - ⚠️ diap. {d['slide']} {d.get('alt') or d['shape']}: {d['resolution_warning']}")
        for d in aspect.get("unchecked", []):
            w(f"  - ⚠️ diap. {d['slide']} {d['shape']}: {d.get('note')}")
        w("")
    if data:
        w("## 5. Datos comerciales\n")
        w(f"- Resultado de la validación: **{data['result']}** · monedas: {', '.join(data.get('currencies', [])) or '—'}")
        for c in data.get("calculations", []):
            w(f"- `{c['id']}`: {c.get('formula', '')} = {c.get('computed')} → {c.get('status')}" + (f" (declarado {c['stated']})" if c.get("stated") else ""))
        for r in data.get("resolved_by_hierarchy", []):
            w(f"- Resuelto por jerarquía: `{r['field']}` = {r['used']} ({r['source']}); descartado: {r['discarded']}")
        for e in data.get("errors", []):
            w(f"- ❌ {e['field']}: {e['issue']}")
        for e in data.get("needs_confirmation", []):
            w(f"- ❓ {e['field']}: {e['issue']}" + (f" {e.get('values')}" if e.get("values") else ""))
        for e in data.get("warnings", []):
            w(f"- ⚠️ {e['field']}: {e['issue']}")
        if data.get("pending_fields"):
            w(f"- Campos pendientes (fuera de la presentación): {data['pending_fields']}")
        w("")
    if meta.get("contradictions"):
        w("## 6. Contradicciones\n")
        for c in meta["contradictions"]:
            w(f"- {'❓ ABIERTA' if c.get('open') else '✅ resuelta'} · {c.get('field')}: {c.get('detail')}")
        w("")
    if meta.get("text_changes"):
        w("## 7. Cambios de redacción (sin cambio de significado)\n" + "\n".join(f"- {t}" for t in meta["text_changes"]) + "\n")
    if px and pii:
        w("## 8. Barrido de datos personales (revisión humana obligatoria)\n")
        for n, lab, s in pii:
            w(f"- diap. {n}: {lab} → `{s}`")
        w("")
    if render:
        w("## 9. Render\n")
        w(f"- PDF: {render.get('pdf_pages')} páginas / {render.get('expected_pages', '—')} diapositivas · {render.get('result')}")
        w(f"- PNG de revisión: {len(render.get('pngs', []))} + vista general `{Path(render.get('overview', '')).name}`\n")
    if meta.get("limitations"):
        w("## 10. Limitaciones\n" + "\n".join(f"- {t}" for t in meta["limitations"]) + "\n")
    Path(a.out).write_text("\n".join(L), encoding="utf-8")
    print(f"{result}: {a.out}")
    for b in blockers:
        print(f"  ❌ {b}")
    for o in observations:
        print(f"  ⚠️ {o}")
    sys.exit(1 if blockers else 0)


if __name__ == "__main__":
    main()
