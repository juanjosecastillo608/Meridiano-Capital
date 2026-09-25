#!/usr/bin/env python3
"""Render completo para revisión visual y PDF de distribución.

Convierte el .pptx a PDF con LibreOffice (perfil aislado + timeout, para que
no quede colgado en entornos sin pantalla), rasteriza TODAS las diapositivas
a PNG y arma una vista general (hoja de contactos) para revisar el conjunto.
Verifica además que el PDF tenga tantas páginas como diapositivas y lista las
fuentes incrustadas (para detectar sustituciones tipográficas).

Uso:
  python render_presentation.py deck.pptx --outdir revision_propiedad [--pdf salida.pdf] [--dpi 110]
  python render_presentation.py deck.pdf  --outdir revision_propiedad          (solo rasteriza)

Salida: JSON con rutas, cantidad de páginas y fuentes del PDF.
Código 1 si falla la conversión o el número de páginas no coincide.
"""
import argparse
import json
import math
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path


def soffice_bin():
    for b in ("soffice", "libreoffice"):
        p = shutil.which(b)
        if p:
            return p
    for p in ("/usr/bin/soffice", "/Applications/LibreOffice.app/Contents/MacOS/soffice",
              r"C:\Program Files\LibreOffice\program\soffice.exe"):
        if Path(p).exists():
            return p
    return None


def to_pdf(pptx, outdir, timeout=300):
    sb = soffice_bin()
    if not sb:
        raise RuntimeError("LibreOffice (soffice) no está instalado: no se puede renderizar ni exportar el PDF.")
    with tempfile.TemporaryDirectory() as prof:
        cmd = [sb, f"-env:UserInstallation=file://{prof}", "--headless", "--norestore",
               "--convert-to", "pdf", "--outdir", str(outdir), str(pptx)]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    pdf = Path(outdir) / (Path(pptx).stem + ".pdf")
    if not pdf.exists():
        raise RuntimeError(f"La conversión a PDF falló: {r.stdout[-400:]} {r.stderr[-400:]}")
    return pdf


def slide_count(pptx):
    with zipfile.ZipFile(pptx) as z:
        pres = z.read("ppt/presentation.xml").decode("utf8", "ignore")
    return len(re.findall(r"<p:sldId ", pres))


def contact_sheet(pngs, out, cols=3):
    from PIL import Image
    ims = [Image.open(p) for p in pngs]
    w, h = ims[0].size
    scale = min(1.0, 1500 / (cols * w))
    tw, th, g = int(w * scale), int(h * scale), 16
    rows = math.ceil(len(ims) / cols)
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * g, rows * th + (rows + 1) * g), (218, 210, 192))
    for i, im in enumerate(ims):
        sheet.paste(im.convert("RGB").resize((tw, th)), (g + (i % cols) * (tw + g), g + (i // cols) * (th + g)))
    sheet.save(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source")
    ap.add_argument("--outdir", required=True)
    ap.add_argument("--pdf", help="ruta final del PDF de distribución")
    ap.add_argument("--dpi", type=int, default=110)
    a = ap.parse_args()
    src, outdir = Path(a.source), Path(a.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    report = {"source": str(src)}
    try:
        if src.suffix.lower() == ".pdf":
            pdf = src
        else:
            with tempfile.TemporaryDirectory() as tmp:
                tmp_pdf = to_pdf(src, tmp)
                final = Path(a.pdf) if a.pdf else outdir / tmp_pdf.name
                final.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(tmp_pdf, final)
                pdf = final
            report["expected_pages"] = slide_count(src)
        report["pdf"] = str(pdf)
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        pages = int(re.search(r"Pages:\s+(\d+)", info).group(1))
        report["pdf_pages"] = pages
        for old in outdir.glob("diapositiva-*.png"):
            old.unlink()
        subprocess.run(["pdftoppm", "-png", "-r", str(a.dpi), str(pdf), str(outdir / "diapositiva")], check=True)
        for p in outdir.glob("diapositiva-*.png"):  # numeración de dos dígitos siempre (orden correcto)
            n = int(p.stem.split("-")[-1])
            p.rename(outdir / f"diapositiva-{n:02d}.png")
        pngs = sorted(outdir.glob("diapositiva-*.png"))
        report["pngs"] = [str(p) for p in pngs]
        contact_sheet(pngs, outdir / "00_vista_general.png")
        report["overview"] = str(outdir / "00_vista_general.png")
        fonts = subprocess.run(["pdffonts", str(pdf)], capture_output=True, text=True).stdout.splitlines()[2:]
        report["pdf_fonts"] = sorted({re.sub(r"^[A-Z]{6}\+", "", l.split()[0]) for l in fonts if l.strip()})
        emb = [(l.split()[0], re.search(r"\s(yes|no)\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$", l)) for l in fonts if l.strip()]
        report["pdf_fonts_not_embedded"] = [n for n, m in emb if m and m.group(1) == "no"]
        ok = pages == report.get("expected_pages", pages) and len(pngs) == pages
        report["result"] = "OK" if ok else "FALLA: páginas del PDF ≠ diapositivas"
    except Exception as e:  # noqa: BLE001
        report["result"] = f"FALLA: {e}"
        ok = False
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
