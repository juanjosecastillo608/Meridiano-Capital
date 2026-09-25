#!/usr/bin/env python3
"""Preflight de archivos de entrada (Fase 1).

Verifica que existan archivos reales y legibles, identifica formato, tamaño,
páginas/diapositivas/hojas y resolución, detecta archivos dañados o protegidos
y genera un inventario JSON. Con --workdir copia cada archivo válido a una
carpeta de trabajo (los originales nunca se modifican) y, con
--prepare-images, deja además copias normalizadas de las imágenes
(orientación EXIF aplicada; WEBP/TIFF convertidos a PNG/JPEG) listas para
PowerPoint.

Salida: JSON por stdout (o --out). Código de salida:
  0 = hay al menos un archivo válido
  2 = no hay ningún archivo válido -> el flujo debe detenerse

Uso:
  python inspect_inputs.py ARCHIVO_O_CARPETA [...] [--workdir DIR] [--prepare-images] [--out inventario.json]
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

VALID_EXT = {
    ".pptx": "presentation", ".ppt": "presentation_legacy",
    ".pdf": "pdf", ".docx": "document", ".xlsx": "spreadsheet", ".xls": "spreadsheet_legacy",
    ".csv": "table", ".jpg": "image", ".jpeg": "image", ".png": "image", ".webp": "image",
    ".tif": "image", ".tiff": "image", ".dwg": "technical", ".dxf": "technical", ".svg": "vector",
}
NO_FILES_MESSAGE = (
    "Para adaptar la presentación a Meridiano Capital necesito que adjuntes el archivo fuente. "
    "Puedes enviar una presentación PowerPoint, PDF, documento, planilla, plano o conjunto de "
    "imágenes de la propiedad."
)


def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:12]


def run(cmd):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        return r.returncode, r.stdout + r.stderr
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return 1, str(e)


def inspect_zip_office(path, kind):
    info = {}
    try:
        z = zipfile.ZipFile(path)
    except zipfile.BadZipFile:
        # Los archivos Office cifrados son contenedores OLE, no ZIP.
        with open(path, "rb") as f:
            head = f.read(8)
        if head.startswith(b"\xd0\xcf\x11\xe0"):
            return {"status": "protected", "error": "Archivo Office cifrado/protegido con contraseña (contenedor OLE)."}
        return {"status": "damaged", "error": "No es un contenedor ZIP válido."}
    names = z.namelist()
    bad = z.testzip()
    if bad:
        return {"status": "damaged", "error": f"Entrada ZIP corrupta: {bad}"}
    media = [n for n in names if re.search(r"/media/", n)]
    info["embedded_media"] = len(media)
    if kind == "presentation":
        slides = [n for n in names if re.match(r"ppt/slides/slide\d+\.xml$", n)]
        info["slides"] = len(slides)
        info["notes"] = len([n for n in names if re.match(r"ppt/notesSlides/notesSlide\d+\.xml$", n)])
        info["charts"] = len([n for n in names if re.match(r"ppt/charts/chart\d+\.xml$", n)])
        pres = z.read("ppt/presentation.xml").decode("utf8", "ignore")
        m = re.search(r'<p:sldSz cx="(\d+)" cy="(\d+)"', pres)
        if m:
            cx, cy = int(m.group(1)), int(m.group(2))
            info["slide_size_in"] = [round(cx / 914400, 3), round(cy / 914400, 3)]
        links = set()
        for n in names:
            if n.endswith(".rels") and n.startswith("ppt/slides/_rels/"):
                links.update(re.findall(r'Target="(https?://[^"]+)"', z.read(n).decode("utf8", "ignore")))
        info["hyperlinks"] = sorted(links)
    elif kind == "document":
        doc = z.read("word/document.xml").decode("utf8", "ignore")
        info["paragraphs"] = doc.count("<w:p>") + doc.count("<w:p ")
        info["tables"] = doc.count("<w:tbl>")
        rels = z.read("word/_rels/document.xml.rels").decode("utf8", "ignore") if "word/_rels/document.xml.rels" in names else ""
        info["hyperlinks"] = sorted(set(re.findall(r'Target="(https?://[^"]+)"', rels)))
    elif kind == "spreadsheet":
        wb = z.read("xl/workbook.xml").decode("utf8", "ignore")
        info["sheets"] = re.findall(r'<sheet [^>]*name="([^"]+)"', wb)
    info["status"] = "ok"
    return info


def inspect_pdf(path):
    code, out = run(["pdfinfo", str(path)])
    if code != 0:
        if "Incorrect password" in out or "encrypted" in out.lower():
            return {"status": "protected", "error": out.strip()[:200]}
        return {"status": "damaged", "error": out.strip()[:200]}
    info = {"status": "ok"}
    m = re.search(r"Pages:\s+(\d+)", out)
    info["pages"] = int(m.group(1)) if m else None
    m = re.search(r"Page size:\s+([\d.]+) x ([\d.]+) pts", out)
    if m:
        info["page_size_pt"] = [float(m.group(1)), float(m.group(2))]
    if re.search(r"Encrypted:\s+yes", out):
        info["encrypted_flag"] = True
    code, imgs = run(["pdfimages", "-list", str(path)])
    if code == 0:
        rows = [l for l in imgs.splitlines()[2:] if l.strip()]
        info["embedded_images"] = len(rows)
        dims = []
        for l in rows:
            p = l.split()
            try:
                dims.append([int(p[3]), int(p[4])])
            except (IndexError, ValueError):
                pass
        if dims:
            info["largest_image_px"] = max(dims, key=lambda d: d[0] * d[1])
    code, txt = run(["pdftotext", "-l", "3", str(path), "-"])
    info["has_text_layer"] = bool(code == 0 and txt.strip())
    return info


def inspect_image(path):
    try:
        from PIL import Image, ImageOps
    except ImportError:
        return {"status": "unchecked", "error": "Pillow no instalado"}
    try:
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            w, h = im.size
            exif_orient = im.getexif().get(0x0112, 1) if hasattr(im, "getexif") else 1
            if exif_orient in (5, 6, 7, 8):
                w, h = h, w  # dimensiones tal como se ven
            dpi = im.info.get("dpi")
            return {
                "status": "ok", "format": im.format, "mode": im.mode, "px": [w, h],
                "orientation": "vertical" if h > w else "horizontal" if w > h else "cuadrada",
                "aspect_ratio": round(w / h, 4), "exif_orientation": exif_orient,
                "dpi": [round(float(d)) for d in dpi] if dpi else None,
                "megapixels": round(w * h / 1e6, 2),
                "low_resolution": w * h < 800 * 600,
            }
    except Exception as e:  # noqa: BLE001 - cualquier fallo de decodificación = dañado
        return {"status": "damaged", "error": str(e)[:200]}


def inspect_csv(path):
    try:
        text = Path(path).read_text(encoding="utf-8-sig")
    except UnicodeDecodeError:
        text = Path(path).read_text(encoding="latin-1")
    lines = [l for l in text.splitlines() if l.strip()]
    sep = ";" if lines and lines[0].count(";") > lines[0].count(",") else ","
    return {"status": "ok", "rows": len(lines), "columns": len(lines[0].split(sep)) if lines else 0, "separator": sep}


def prepare_image(src, dst_dir):
    """Copia normalizada para PowerPoint: EXIF aplicado, formatos no soportados convertidos."""
    from PIL import Image, ImageOps
    with Image.open(src) as im:
        rotated = im.getexif().get(0x0112, 1) not in (1, None)
        fixed = ImageOps.exif_transpose(im) if rotated else im
        ext = src.suffix.lower()
        needs = ext in (".webp", ".tif", ".tiff") or rotated
        if not needs:
            dst = dst_dir / src.name
            shutil.copy2(src, dst)
            return dst, "copia sin cambios"
        has_alpha = fixed.mode in ("RGBA", "LA", "P")
        out_ext = ".png" if has_alpha else ".jpg"
        dst = dst_dir / (src.stem + out_ext)
        if out_ext == ".jpg":
            fixed.convert("RGB").save(dst, quality=95, subsampling=0)
        else:
            fixed.save(dst)
        note = []
        if rotated:
            note.append("orientación EXIF aplicada")
        if ext in (".webp", ".tif", ".tiff"):
            note.append(f"convertida de {ext} a {out_ext}")
        return dst, ", ".join(note)


def collect(paths):
    files, missing = [], []
    for p in paths:
        pp = Path(p).expanduser()
        if pp.is_dir():
            files.extend(sorted(f for f in pp.rglob("*") if f.is_file() and not f.name.startswith(".")))
        elif pp.is_file():
            files.append(pp)
        else:
            missing.append(str(p))
    return files, missing


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--workdir", help="carpeta de copias de trabajo (los originales no se tocan)")
    ap.add_argument("--prepare-images", action="store_true")
    ap.add_argument("--out")
    a = ap.parse_args()

    files, missing = collect(a.paths)
    inv = {"inputs": [], "missing_paths": missing, "ignored": [], "summary": {}}
    workdir = Path(a.workdir) if a.workdir else None
    if workdir:
        (workdir / "fuentes").mkdir(parents=True, exist_ok=True)
        if a.prepare_images:
            (workdir / "imagenes").mkdir(parents=True, exist_ok=True)

    for f in files:
        ext = f.suffix.lower()
        kind = VALID_EXT.get(ext)
        if not kind:
            inv["ignored"].append({"path": str(f), "reason": f"formato no admitido ({ext or 'sin extensión'})"})
            continue
        entry = {"path": str(f.resolve()), "name": f.name, "ext": ext, "kind": kind,
                 "size_bytes": f.stat().st_size, "sha1": sha1(f)}
        if f.stat().st_size == 0:
            entry.update(status="damaged", error="archivo vacío")
        elif kind in ("presentation", "document", "spreadsheet"):
            entry.update(inspect_zip_office(f, kind))
        elif kind == "pdf":
            entry.update(inspect_pdf(f))
        elif kind == "image":
            entry.update(inspect_image(f))
        elif kind == "table":
            entry.update(inspect_csv(f))
        elif kind in ("presentation_legacy", "spreadsheet_legacy"):
            entry.update(status="needs_conversion",
                         note="Convertir con LibreOffice (soffice --headless --convert-to pptx/xlsx) sobre la copia de trabajo.")
        elif kind == "vector":
            entry.update(status="ok", note="SVG: tratar como imagen vectorial; verificar viewBox.")
        else:
            entry.update(status="needs_conversion", note="Documento técnico CAD: pedir exportación a PDF/PNG o convertir antes de usar.")

        if workdir and entry.get("status") in ("ok", "needs_conversion"):
            dst = workdir / "fuentes" / f.name
            if dst.exists():
                dst = workdir / "fuentes" / f"{f.stem}_{entry['sha1']}{f.suffix}"
            shutil.copy2(f, dst)
            entry["working_copy"] = str(dst)
            if a.prepare_images and kind == "image" and entry.get("status") == "ok":
                p, note = prepare_image(dst, workdir / "imagenes")
                entry["prepared_image"] = str(p)
                entry["preparation"] = note
        inv["inputs"].append(entry)

    ok = [e for e in inv["inputs"] if e.get("status") in ("ok", "needs_conversion")]
    by_kind = {}
    for e in ok:
        by_kind[e["kind"]] = by_kind.get(e["kind"], 0) + 1
    hashes = {}
    for e in inv["inputs"]:
        hashes.setdefault(e["sha1"], []).append(e["name"])
    inv["summary"] = {
        "valid_files": len(ok),
        "by_kind": by_kind,
        "problem_files": [{"name": e["name"], "status": e["status"], "error": e.get("error")} for e in inv["inputs"] if e.get("status") not in ("ok", "needs_conversion")],
        "duplicates": [v for v in hashes.values() if len(v) > 1],
        # A = hay presentación editable; C = hay fotos/planos sueltos; B = solo documentos.
        "suggested_mode": None if not ok else ("A" if by_kind.get("presentation") or by_kind.get("presentation_legacy")
                           else "C" if by_kind.get("image") or by_kind.get("vector") else "B"),
        "can_proceed": bool(ok),
    }
    if not ok:
        inv["summary"]["message"] = NO_FILES_MESSAGE

    out = json.dumps(inv, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
    print(out)
    if not ok:
        print("\n" + NO_FILES_MESSAGE, file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
