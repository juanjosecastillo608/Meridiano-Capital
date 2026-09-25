#!/usr/bin/env python3
"""Control de deformación de imágenes en un .pptx (obligatorio antes de entregar).

Para cada imagen del archivo (fotografías, planos, mapas, logos SVG, retratos,
fondos e imágenes usadas como relleno de formas) compara la proporción del
área de origen realmente mostrada (píxeles o viewBox, descontando el recorte
srcRect) con la proporción del marco en la diapositiva (incluida la escala de
grupos). Si la diferencia supera la tolerancia, la imagen está estirada o
comprimida y la validación FALLA. No depende de cómo "se ve" el render.

También informa la resolución efectiva (ppp) de cada foto en su marco.

Códigos de salida: 0 = sin deformaciones; 1 = hay al menos una deformación.

Uso:
  python validate_image_aspect_ratios.py deck.pptx [--tolerance 0.5] [--min-ppi 100] [--out aspecto.json]
"""
import argparse
import io
import json
import posixpath
import re
import sys
import zipfile
from pathlib import Path

from lxml import etree

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
    "asvg": "http://schemas.microsoft.com/office/drawing/2016/SVG/main",
}
EMU = 914400


def rels_of(z, part):
    d, b = posixpath.split(part)
    rp = posixpath.join(d, "_rels", b + ".rels")
    out = {}
    if rp in z.namelist():
        for r in etree.fromstring(z.read(rp)).findall("rel:Relationship", NS):
            if r.get("TargetMode") != "External":
                t = r.get("Target")
                out[r.get("Id")] = t.lstrip("/") if t.startswith("/") else posixpath.normpath(posixpath.join(d, t))
    return out


def media_size(z, name):
    data = z.read(name)
    if name.lower().endswith(".svg"):
        m = re.search(rb'viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)', data)
        if m:
            return float(m.group(1)), float(m.group(2)), "svg"
        m = re.search(rb'<svg[^>]*width="([\d.]+)[a-z]*"[^>]*height="([\d.]+)', data)
        return (float(m.group(1)), float(m.group(2)), "svg") if m else (None, None, "svg")
    from PIL import Image
    try:
        with Image.open(io.BytesIO(data)) as im:
            return im.size[0], im.size[1], "raster"
    except Exception:  # noqa: BLE001 (EMF/WMF u otro formato no ráster)
        return None, None, "unknown"


def check_blip(z, rels, blipfill, frame_w, frame_h, ctx, results, tol, min_ppi):
    blip = blipfill.find("a:blip", NS)
    if blip is None:
        return
    rid = blip.get("{%s}embed" % NS["r"])
    svg = blip.find(".//asvg:svgBlip", NS)
    media = rels.get(svg.get("{%s}embed" % NS["r"]) if svg is not None else rid)
    fallback = rels.get(rid) if svg is not None else None
    if not media:
        return
    iw, ih, kind = media_size(z, media)
    if blipfill.find("a:tile", NS) is not None:
        results.append(dict(ctx, media=media, status="tile", note="relleno en mosaico: no se estira"))
        return
    sr = blipfill.find("a:srcRect", NS)
    crop = {k: (int(sr.get(k, 0)) / 1e5 if sr is not None else 0.0) for k in "ltrb"}
    entry = dict(ctx, media=media, kind=kind, source_size=[iw, ih],
                 crop_pct={k: round(v * 100, 3) for k, v in crop.items()},
                 frame_in=[round(frame_w / EMU, 3), round(frame_h / EMU, 3)])
    if fallback and fallback != media:
        fw_, fh_, fk = media_size(z, fallback)
        entry["svg_fallback"] = {"media": fallback, "kind": fk, "size": [fw_, fh_]}
        if fk != "raster":
            entry["svg_fallback"]["warning"] = "el respaldo PNG del SVG no es un raster válido (visores sin SVG mostrarán vacío)"
    if not iw or not ih or not frame_w or not frame_h:
        entry.update(status="unchecked", note="dimensiones no legibles (EMF/WMF o dato faltante): revisar manualmente")
        results.append(entry)
        return
    sw, sh = iw * (1 - crop["l"] - crop["r"]), ih * (1 - crop["t"] - crop["b"])
    if sw <= 0 or sh <= 0:
        entry.update(status="error", note="recorte inválido")
        results.append(entry)
        return
    dev = abs((frame_w / frame_h) / (sw / sh) - 1) * 100
    entry["aspect_deviation_pct"] = round(dev, 4)
    entry["axis"] = None if dev <= tol else ("estirada horizontalmente" if (frame_w / frame_h) > (sw / sh) else "estirada verticalmente")
    if kind == "raster":
        ppi = sw / (frame_w / EMU)
        entry["effective_ppi"] = round(ppi, 1)
        if ppi < min_ppi:
            entry["resolution_warning"] = f"{ppi:.0f} ppp en el marco (< {min_ppi}): puede verse pixelada en proyección o impresión"
    entry["status"] = "ok" if dev <= tol else "DEFORMADA"
    results.append(entry)


def walk(z, rels, tree, slide_no, results, tol, min_ppi, scale=(1.0, 1.0), path=""):
    for i, el in enumerate(tree):
        tag = etree.QName(el).localname
        nv = el.find(".//p:cNvPr", NS)
        name = f"{path}{nv.get('name') if nv is not None else tag}"
        if tag == "grpSp":
            gx = el.find("p:grpSpPr/a:xfrm", NS)
            sx, sy = scale
            if gx is not None and gx.find("a:chExt", NS) is not None:
                ext, ch = gx.find("a:ext", NS), gx.find("a:chExt", NS)
                if int(ch.get("cx")) and int(ch.get("cy")):
                    sx *= int(ext.get("cx")) / int(ch.get("cx"))
                    sy *= int(ext.get("cy")) / int(ch.get("cy"))
            walk(z, rels, el, slide_no, results, tol, min_ppi, (sx, sy), name + "/")
            continue
        bf = None
        if tag == "pic":
            bf = el.find("p:blipFill", NS)
        elif tag == "sp":
            bf = el.find("p:spPr/a:blipFill", NS)
        if bf is None:
            continue
        x = el.find("p:spPr/a:xfrm", NS)
        if x is None or x.find("a:ext", NS) is None:
            results.append({"slide": slide_no, "shape": name, "status": "unchecked", "note": "sin xfrm propio (hereda del diseño): revisar"})
            continue
        ext = x.find("a:ext", NS)
        fw, fh = int(ext.get("cx")) * scale[0], int(ext.get("cy")) * scale[1]
        rot = int(x.get("rot", 0))
        ctx = {"slide": slide_no, "shape": name, "alt": nv.get("descr", "") if nv is not None else ""}
        if rot and rot % (90 * 60000) == 0 and (rot // (90 * 60000)) % 2 == 1:
            fw, fh = fh, fw
            ctx["rotation_deg"] = rot / 60000
        check_blip(z, rels, bf, fw, fh, ctx, results, tol, min_ppi)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pptx")
    ap.add_argument("--tolerance", type=float, default=0.5, help="desviación máxima de proporción en %% (default 0.5)")
    ap.add_argument("--min-ppi", type=float, default=100)
    ap.add_argument("--out")
    a = ap.parse_args()
    z = zipfile.ZipFile(a.pptx)
    pres = etree.fromstring(z.read("ppt/presentation.xml"))
    prels = rels_of(z, "ppt/presentation.xml")
    sz = pres.find("p:sldSz", NS)
    slide_w, slide_h = int(sz.get("cx")), int(sz.get("cy"))
    order = [prels[s.get("{%s}id" % NS["r"])] for s in pres.findall("p:sldIdLst/p:sldId", NS)]
    results = []
    for n, part in enumerate(order, 1):
        root = etree.fromstring(z.read(part))
        rels = rels_of(z, part)
        walk(z, rels, root.find("p:cSld/p:spTree", NS), n, results, a.tolerance, a.min_ppi)
        bg = root.find("p:cSld/p:bg/p:bgPr/a:blipFill", NS)
        if bg is not None:
            check_blip(z, rels, bg, slide_w, slide_h, {"slide": n, "shape": "fondo de diapositiva"}, results, a.tolerance, a.min_ppi)
    checked = [r for r in results if "aspect_deviation_pct" in r]
    deformed = [r for r in results if r.get("status") == "DEFORMADA"]
    report = {
        "file": a.pptx, "tolerance_pct": a.tolerance, "images_checked": len(checked),
        "max_deviation_pct": max((r["aspect_deviation_pct"] for r in checked), default=0.0),
        "deformed": deformed, "unchecked": [r for r in results if r.get("status") == "unchecked"],
        "low_resolution": [r for r in results if "resolution_warning" in r],
        "svg_fallback_problems": [r for r in results if r.get("svg_fallback", {}).get("warning")],
        "result": "FALLA" if deformed else "OK", "images": results,
    }
    out = json.dumps(report, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
    summary = f"{report['result']}: {len(checked)} imágenes verificadas, desviación máxima {report['max_deviation_pct']:.4f}% (tolerancia {a.tolerance}%)"
    if deformed:
        summary += "\n" + "\n".join(f"  - diap. {r['slide']} · {r['shape']} · {r['media']}: {r['aspect_deviation_pct']}% ({r['axis']})" for r in deformed)
    if report["low_resolution"]:
        summary += f"\n  aviso: {len(report['low_resolution'])} imagen(es) con resolución efectiva < {a.min_ppi} ppp"
    print(summary)
    sys.exit(1 if deformed else 0)


if __name__ == "__main__":
    main()
