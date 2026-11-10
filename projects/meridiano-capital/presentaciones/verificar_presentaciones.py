#!/usr/bin/env python3
"""Verifica que las presentaciones usen el teléfono y el tipo de cambio centrales (D-096 / D-097).

Revisa los generadores (`*/fuente/*.py`) y, si existe `pdftotext`, el texto de cada PDF:
  - teléfono: cualquier número +595 9xx distinto del canónico es un error;
  - tipo de cambio: un PDF que mencione "TC Gs" o "por USD (BCP" con un valor
    distinto del de _config/meridiano.json es un error (deck desactualizado);
  - generadores: no deben contener el teléfono ni el TC escritos a mano.

Además (D-103, founder 10/11/2026) revisa las alertas de coherencia que cada model.py deja en
model.json > coherencia: un deck con alertas abiertas tiene que presentar la neta como rango y
declararlo en deck.json ("neta_en_rango_d103": true); si no, es un error. Las alertas se listan
siempre, para que se vean antes de enviar un deck.

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


def revisar_coherencia(problemas):
    """D-103: alertas de coherencia de cada deck (model.json > coherencia)."""
    import json
    for dj in sorted(glob.glob(os.path.join(BASE, '*', 'fuente', 'deck.json'))):
        src = os.path.dirname(dj)
        deck = os.path.basename(os.path.dirname(src))
        mj = os.path.join(src, 'model.json')
        meta = json.load(open(dj, encoding='utf-8'))
        coh = json.load(open(mj, encoding='utf-8')).get('coherencia') if os.path.exists(mj) else None
        if coh is None:
            print(f'Aviso: {deck} no registra control de coherencia (D-103) en model.json (deck sin neta o sin actualizar).')
            continue
        abiertas = [c for c in coh if c.get('alertas')]
        for c in abiertas:
            for a in c['alertas']:
                print(f'  ⚠ {deck} · {c.get("escenario", "")}: {a}')
        if abiertas and not meta.get('neta_en_rango_d103'):
            problemas.append(f'{deck}: {len(abiertas)} escenario(s) con alertas de coherencia abiertas y la neta no se presenta como rango '
                             '(D-103). Presentar la neta como rango en gen.py y declarar "neta_en_rango_d103": true en deck.json, '
                             'o verificar los datos que disparan la alerta.')


def main():
    problemas = []
    for f in glob.glob(os.path.join(BASE, '*', 'fuente', '*.py')):
        revisar_texto(os.path.relpath(f, BASE), open(f, encoding='utf-8').read(), problemas, True)
    if shutil.which('pdftotext'):
        for f in glob.glob(os.path.join(BASE, '*', '*.pdf')) + glob.glob(os.path.join(BASE, '*', 'entregables', '*.pdf')):
            txt = subprocess.run(['pdftotext', f, '-'], capture_output=True, text=True).stdout
            revisar_texto(os.path.relpath(f, BASE), re.sub(r'\s+', ' ', txt), problemas, False)
    else:
        print('Aviso: sin pdftotext no se revisa el texto de los PDF, solo los generadores.')
    revisar_coherencia(problemas)
    for p in problemas:
        print('✗', p)
    if not problemas:
        print(f'✓ Presentaciones verificadas: teléfono {TEL} · TC Gs {TC_TXT} ({CFG["tipo_cambio"]["fecha"]})')
    return 1 if problemas else 0


if __name__ == '__main__':
    sys.exit(main())
