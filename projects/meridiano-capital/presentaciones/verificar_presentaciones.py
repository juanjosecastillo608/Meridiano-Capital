#!/usr/bin/env python3
"""Verifica que las presentaciones usen el teléfono y el tipo de cambio centrales (D-096 / D-097).

Revisa los generadores (`*/fuente/*.py`) y, si existe `pdftotext`, el texto de cada PDF:
  - teléfono: cualquier número +595 9xx distinto del canónico es un error;
  - tipo de cambio: un PDF que mencione "TC Gs" o "por USD (BCP" con un valor
    distinto del de _config/meridiano.json es un error (deck desactualizado);
  - generadores: no deben contener el teléfono ni el TC escritos a mano.

Sale con status 1 si encuentra algo. Lo usan build_presentaciones.py y
scripts/pre-commit-checks.py.
"""
import glob
import os
import re
import shutil
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE, '_config'))
from comun import CFG, TC  # noqa: E402

TEL = CFG['contacto']['telefono']
TEL_RE = re.compile(r'\+?595[\s.-]*9\d{2}[\s.-]*\d{3}[\s.-]*\d{3}')
TC_RE = re.compile(r'(?:TC Gs|Gs)\s*([\d.]+)\s*(?:por USD)?\s*\(BCP')
TC_TXT = f"{TC:,.0f}".replace(',', '.')


def norm(t):
    return re.sub(r'\D', '', t)


def revisar_texto(nombre, texto, problemas, es_fuente):
    for m in TEL_RE.finditer(texto):
        if norm(m.group()) != norm(TEL):
            problemas.append(f'{nombre}: teléfono {m.group()!r} distinto del canónico {TEL}')
    if es_fuente:
        if norm(TEL) in norm(texto) and 'contacto_linea' not in texto:
            problemas.append(f'{nombre}: teléfono escrito a mano; usar contacto_linea() de _config/comun.py')
        if re.search(r'TC\s*=\s*5\d{3}\b|Gs 5\.\d{3} por USD|TC Gs 5\.\d{3}', texto):
            problemas.append(f'{nombre}: tipo de cambio escrito a mano; usar TC/tc_texto() de _config/comun.py')
    else:
        for m in TC_RE.finditer(texto):
            if m.group(1) != TC_TXT:
                problemas.append(f'{nombre}: tipo de cambio Gs {m.group(1)} distinto del vigente Gs {TC_TXT} (regenerar el deck)')


def main():
    problemas = []
    for f in glob.glob(os.path.join(BASE, '*', 'fuente', '*.py')):
        revisar_texto(os.path.relpath(f, BASE), open(f, encoding='utf-8').read(), problemas, True)
    if shutil.which('pdftotext'):
        for f in glob.glob(os.path.join(BASE, '*', '*.pdf')):
            txt = subprocess.run(['pdftotext', f, '-'], capture_output=True, text=True).stdout
            revisar_texto(os.path.relpath(f, BASE), re.sub(r'\s+', ' ', txt), problemas, False)
    else:
        print('Aviso: sin pdftotext no se revisa el texto de los PDF, solo los generadores.')
    for p in problemas:
        print('✗', p)
    if not problemas:
        print(f'✓ Presentaciones verificadas: teléfono {TEL} · TC Gs {TC_TXT} ({CFG["tipo_cambio"]["fecha"]})')
    return 1 if problemas else 0


if __name__ == '__main__':
    sys.exit(main())
