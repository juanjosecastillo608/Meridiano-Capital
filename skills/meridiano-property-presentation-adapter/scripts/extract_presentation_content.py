#!/usr/bin/env python3
"""Extracción de contenido con trazabilidad (Fases 1-2).

Extrae de cada archivo fuente el texto, las notas, las imágenes, las tablas,
los gráficos, los hipervínculos y el orden, con la referencia exacta de
origen (archivo + diapositiva/página/hoja + forma), para construir la matriz
de datos de la propiedad sin perder la trazabilidad.

Formatos: .pptx (orden real de <p:sldIdLst>, grupos, tablas, gráficos, notas,
enlaces y geometría de cada imagen), .pdf (texto por página + inventario de
imágenes), .docx (párrafos, tablas, imágenes), .xlsx (celdas por hoja) y .csv.
.ppt/.xls deben convertirse antes a .pptx/.xlsx (ver inspect_inputs.py).

Uso:
  python extract_presentation_content.py ARCHIVO [...] [--extract-media DIR] [--out contenido.json]
"""
import argparse
import csv
import io
import json
import posixpath
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

from lxml import etree

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
    "asvg": "http://schemas.microsoft.com/office/drawing/2016/SVG/main",
}
EMU = 914400


def xml(z, name):
    return etree.fromstring(z.read(name))


def rels_of(z, part):
    d, b = posixpath.split(part)
    rp = posixpath.join(d, "_rels", b + ".rels")
    out = {}
    if rp in z.namelist():
        for r in xml(z, rp).findall("rel:Relationship", NS):
            tgt = r.get("Target")
            if r.get("TargetMode") != "External":
                # rutas absolutas del paquete ("/xl/worksheets/sheet1.xml") o relativas a la parte
                tgt = tgt.lstrip("/") if tgt.startswith("/") else posixpath.normpath(posixpath.join(d, tgt))
            out[r.get("Id")] = {"target": tgt, "type": r.get("Type").rsplit("/", 1)[-1], "external": r.get("TargetMode") == "External"}
    return out


def para_texts(el):
    out = []
    for p in el.iter("{%s}p" % NS["a"]):
        t = "".join(x.text or "" for x in p.iter("{%s}t" % NS["a"]))
        if t.strip():
            out.append(t)
    return out


def image_px(z, name):
    try:
        from PIL import Image
        data = z.read(name)
        if name.lower().endswith(".svg"):
            m = re.search(rb'viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)', data)
            return [float(m.group(1)), float(m.group(2))] if m else None
        with Image.open(io.BytesIO(data)) as im:
            return list(im.size)
    except Exception:  # noqa: BLE001
        return None


def xfrm_of(el):
    x = el.find(".//a:xfrm", NS)
    if x is None:
        return None
    off, ext = x.find("a:off", NS), x.find("a:ext", NS)
    if off is None or ext is None:
        return None
    return [int(off.get("x")), int(off.get("y")), int(ext.get("cx")), int(ext.get("cy"))]


def walk_shapes(z, slide_part, tree, rels, out, group_scale=(1.0, 1.0), path="",
                media_dir=None, slide_no=0):
    for i, el in enumerate(tree):
        tag = etree.QName(el).localname
        name_el = el.find(".//p:cNvPr", NS)
        name = name_el.get("name") if name_el is not None else tag
        sid = f"{path}{name}#{i}"
        if tag == "grpSp":
            gx = el.find("p:grpSpPr/a:xfrm", NS)
            sx, sy = group_scale
            if gx is not None:
                ext, chext = gx.find("a:ext", NS), gx.find("a:chExt", NS)
                if ext is not None and chext is not None and int(chext.get("cx")) and int(chext.get("cy")):
                    sx *= int(ext.get("cx")) / int(chext.get("cx"))
                    sy *= int(ext.get("cy")) / int(chext.get("cy"))
            walk_shapes(z, slide_part, el, rels, out, (sx, sy), sid + "/", media_dir, slide_no)
        elif tag == "sp":
            texts = para_texts(el)
            blip = el.find(".//a:blipFill/a:blip", NS)
            item = {"shape": sid, "type": "text" if texts else "shape", "xfrm_emu": xfrm_of(el)}
            if texts:
                item["paragraphs"] = texts
            if blip is not None:  # imagen como relleno de forma
                item["type"] = "shape_with_image_fill"
            links = [rels[h.get("{%s}id" % NS["r"])]["target"] for h in el.iter("{%s}hlinkClick" % NS["a"])
                     if h.get("{%s}id" % NS["r"]) in rels]
            if links:
                item["hyperlinks"] = links
            if texts or blip is not None or links:
                out.append(item)
        elif tag == "pic":
            blip = el.find(".//a:blip", NS)
            rid = blip.get("{%s}embed" % NS["r"]) if blip is not None else None
            svg = el.find(".//asvg:svgBlip", NS)
            if svg is not None:
                rid = svg.get("{%s}embed" % NS["r"])
            media = rels.get(rid, {}).get("target")
            sr = el.find(".//a:srcRect", NS)
            crop = {k: int(sr.get(k, 0)) / 1000 for k in "ltrb"} if sr is not None else {k: 0.0 for k in "ltrb"}
            xf = xfrm_of(el)
            px = image_px(z, media) if media else None
            item = {"shape": sid, "type": "image", "media": media, "alt": (name_el.get("descr") or "") if name_el is not None else "",
                    "xfrm_emu": xf, "crop_pct": crop, "source_px": px, "group_scale": [round(v, 5) for v in group_scale]}
            if xf and px:
                sw = px[0] * (1 - (crop["l"] + crop["r"]) / 100)
                sh = px[1] * (1 - (crop["t"] + crop["b"]) / 100)
                fw, fh = xf[2] * group_scale[0], xf[3] * group_scale[1]
                if sw > 0 and sh > 0 and fh > 0:
                    item["aspect_deviation_pct"] = round(abs((fw / fh) / (sw / sh) - 1) * 100, 3)
                item["frame_in"] = [round(fw / EMU, 3), round(fh / EMU, 3)]
                if not media.lower().endswith(".svg"):
                    item["effective_ppi"] = round(sw / (fw / EMU), 1) if fw else None
            links = [rels[h.get("{%s}id" % NS["r"])]["target"] for h in el.iter("{%s}hlinkClick" % NS["a"])
                     if h.get("{%s}id" % NS["r"]) in rels]
            if links:
                item["hyperlinks"] = links
            if media_dir and media:
                dst = Path(media_dir) / f"s{slide_no:02d}_{Path(media).name}"
                dst.write_bytes(z.read(media))
                item["extracted_to"] = str(dst)
            out.append(item)
        elif tag == "graphicFrame":
            tbl = el.find(".//a:tbl", NS)
            chart = el.find(".//c:chart", NS)
            if tbl is not None:
                rows = []
                for tr in tbl.findall("a:tr", NS):
                    rows.append([" ".join(para_texts(tc)) for tc in tr.findall("a:tc", NS)])
                out.append({"shape": sid, "type": "table", "rows": rows, "xfrm_emu": xfrm_of(el)})
            elif chart is not None:
                cpart = rels.get(chart.get("{%s}id" % NS["r"]), {}).get("target")
                series = []
                if cpart and cpart in z.namelist():
                    cx = xml(z, cpart)
                    for ser in cx.iter("{%s}ser" % NS["c"]):
                        nm = " ".join(t.text or "" for t in ser.findall("c:tx//c:v", NS))
                        cats = [v.text for v in ser.findall("c:cat//c:pt/c:v", NS)]
                        vals = [v.text for v in ser.findall("c:val//c:pt/c:v", NS)]
                        series.append({"name": nm, "categories": cats, "values": vals})
                out.append({"shape": sid, "type": "chart", "part": cpart, "series": series})
            else:
                out.append({"shape": sid, "type": "graphic_object", "note": "objeto no estándar (SmartArt/OLE): revisar manualmente"})


def extract_pptx(path, media_dir=None):
    z = zipfile.ZipFile(path)
    pres = xml(z, "ppt/presentation.xml")
    prels = rels_of(z, "ppt/presentation.xml")
    order = [prels[s.get("{%s}id" % NS["r"])]["target"] for s in pres.findall("p:sldIdLst/p:sldId", NS)]
    sz = pres.find("p:sldSz", NS)
    res = {"file": str(path), "format": "pptx",
           "slide_size_in": [round(int(sz.get("cx")) / EMU, 3), round(int(sz.get("cy")) / EMU, 3)] if sz is not None else None,
           "slides": []}
    fonts = set()
    for n, part in enumerate(order, 1):
        root = xml(z, part)
        rels = rels_of(z, part)
        for rpr in root.iter("{%s}latin" % NS["a"]):
            if rpr.get("typeface"):
                fonts.add(rpr.get("typeface"))
        shapes = []
        tree = root.find("p:cSld/p:spTree", NS)
        walk_shapes(z, part, tree, rels, shapes, media_dir=media_dir, slide_no=n)
        bg = root.find("p:cSld/p:bg//a:blip", NS)
        notes = ""
        for r in rels.values():
            if r["type"] == "notesSlide" and r["target"] in z.namelist():
                nroot = xml(z, r["target"])
                for sp in nroot.iter("{%s}sp" % NS["p"]):
                    ph = sp.find(".//p:ph", NS)
                    if ph is not None and ph.get("type") == "body":
                        notes = "\n".join(para_texts(sp))
        layout = next((r["target"] for r in rels.values() if r["type"] == "slideLayout"), None)
        res["slides"].append({
            "index": n, "part": part, "layout": layout, "background_image": bg is not None,
            "shapes": shapes, "notes": notes,
            "external_links": sorted({r["target"] for r in rels.values() if r["external"]}),
        })
    res["fonts_declared"] = sorted(fonts)
    return res


def extract_pdf(path, media_dir=None):
    res = {"file": str(path), "format": "pdf", "pages": []}
    info = subprocess.run(["pdfinfo", str(path)], capture_output=True, text=True).stdout
    m = re.search(r"Pages:\s+(\d+)", info)
    pages = int(m.group(1)) if m else 0
    lst = subprocess.run(["pdfimages", "-list", str(path)], capture_output=True, text=True).stdout.splitlines()[2:]
    imgs_by_page = {}
    for l in lst:
        p = l.split()
        if len(p) > 5 and p[0].isdigit():
            imgs_by_page.setdefault(int(p[0]), []).append({"index": int(p[1]), "type": p[2], "px": [int(p[3]), int(p[4])]})
    for pg in range(1, pages + 1):
        txt = subprocess.run(["pdftotext", "-layout", "-f", str(pg), "-l", str(pg), str(path), "-"],
                             capture_output=True, text=True).stdout
        res["pages"].append({"page": pg, "text": txt.strip(), "images": imgs_by_page.get(pg, []),
                             "text_layer": bool(txt.strip())})
    if media_dir:
        subprocess.run(["pdfimages", "-png", "-p", str(path), str(Path(media_dir) / (Path(path).stem + "_img"))])
        res["media_extracted_to"] = str(media_dir)
    if pages and not any(p["text_layer"] for p in res["pages"]):
        res["warning"] = "PDF sin capa de texto (escaneado): los datos deben leerse de las imágenes y marcarse como 'texto extraído de imagen'."
    return res


def extract_docx(path, media_dir=None):
    z = zipfile.ZipFile(path)
    root = xml(z, "word/document.xml")
    body = root.find("w:body", NS)
    blocks = []
    for el in body:
        tag = etree.QName(el).localname
        if tag == "p":
            t = "".join(x.text or "" for x in el.iter("{%s}t" % NS["w"]))
            style = el.find("w:pPr/w:pStyle", NS)
            if t.strip():
                blocks.append({"type": "paragraph", "style": style.get("{%s}val" % NS["w"]) if style is not None else None, "text": t})
        elif tag == "tbl":
            rows = []
            for tr in el.findall("w:tr", NS):
                rows.append(["".join(x.text or "" for x in tc.iter("{%s}t" % NS["w"])) for tc in tr.findall("w:tc", NS)])
            blocks.append({"type": "table", "rows": rows})
    media = [n for n in z.namelist() if n.startswith("word/media/")]
    if media_dir:
        for n in media:
            (Path(media_dir) / (Path(path).stem + "_" + Path(n).name)).write_bytes(z.read(n))
    rels = rels_of(z, "word/document.xml")
    return {"file": str(path), "format": "docx", "blocks": blocks, "media": media,
            "hyperlinks": sorted({r["target"] for r in rels.values() if r["external"]})}


def col_idx(ref):
    letters = re.match(r"([A-Z]+)", ref).group(1)
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n - 1


def extract_xlsx(path, max_rows=500):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in xml(z, "xl/sharedStrings.xml").findall("s:si", NS):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["s"])))
    wb = xml(z, "xl/workbook.xml")
    wrels = rels_of(z, "xl/workbook.xml")
    sheets = []
    for sh in wb.findall("s:sheets/s:sheet", NS):
        part = wrels[sh.get("{%s}id" % NS["r"])]["target"]
        root = xml(z, part)
        rows = []
        for row in root.findall("s:sheetData/s:row", NS)[:max_rows]:
            cells = {}
            for c in row.findall("s:c", NS):
                t, v = c.get("t"), c.find("s:v", NS)
                if t == "s" and v is not None:
                    val = shared[int(v.text)]
                elif t == "inlineStr":
                    val = "".join(x.text or "" for x in c.iter("{%s}t" % NS["s"]))
                else:
                    val = v.text if v is not None else None
                f = c.find("s:f", NS)
                cells[c.get("r")] = {"value": val, "formula": f.text if f is not None else None}
            if cells:
                width = max(col_idx(r) for r in cells) + 1
                line = [None] * width
                for r, cv in cells.items():
                    line[col_idx(r)] = cv["value"]
                rows.append({"row": int(row.get("r")), "values": line,
                             "formulas": {r: cv["formula"] for r, cv in cells.items() if cv["formula"]}})
        sheets.append({"name": sh.get("name"), "rows": rows})
    return {"file": str(path), "format": "xlsx", "sheets": sheets,
            "note": "Valores tal como están guardados; las fórmulas se listan para verificar cálculos."}


def extract_csv(path):
    raw = Path(path).read_bytes()
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    dialect = csv.Sniffer().sniff(text[:2000], delimiters=",;\t") if text.strip() else csv.excel
    return {"file": str(path), "format": "csv", "rows": list(csv.reader(io.StringIO(text), dialect))}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--extract-media")
    ap.add_argument("--out")
    a = ap.parse_args()
    if a.extract_media:
        Path(a.extract_media).mkdir(parents=True, exist_ok=True)
    results = []
    for p in a.paths:
        path = Path(p)
        ext = path.suffix.lower()
        try:
            if ext == ".pptx":
                results.append(extract_pptx(path, a.extract_media))
            elif ext == ".pdf":
                results.append(extract_pdf(path, a.extract_media))
            elif ext == ".docx":
                results.append(extract_docx(path, a.extract_media))
            elif ext == ".xlsx":
                results.append(extract_xlsx(path))
            elif ext == ".csv":
                results.append(extract_csv(path))
            elif ext in (".ppt", ".xls", ".doc"):
                results.append({"file": str(path), "error": "Formato heredado: convertir antes con LibreOffice sobre la copia de trabajo."})
            else:
                results.append({"file": str(path), "skipped": "Sin texto extraíble (imagen u otro); usar inspect_inputs.py para metadatos."})
        except Exception as e:  # noqa: BLE001
            results.append({"file": str(path), "error": f"{type(e).__name__}: {e}"})
    out = json.dumps(results, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
        print(f"OK: {a.out} ({len(results)} archivo(s))")
    else:
        print(out)
    sys.exit(1 if any("error" in r for r in results) else 0)


if __name__ == "__main__":
    main()
