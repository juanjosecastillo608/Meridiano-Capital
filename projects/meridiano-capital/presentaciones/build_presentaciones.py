#!/usr/bin/env python3
"""Regenera todas las presentaciones de Meridiano Capital (D-096 / D-097).

Para cada carpeta `<deck>/fuente/` con `deck.json`:
  1. corre model.py (recalcula cifras con el tipo de cambio de _config/meridiano.json),
  2. corre gen.py (arma deck.html con el teléfono y el TC centrales),
  3. imprime el PDF con Chromium y lo deja en `<deck>/<pdf>`,
  4. corre verificar_presentaciones.py sobre el resultado.

Antes de construir controla la antigüedad del tipo de cambio: por regla del
founder (D-097) se verifica el TC del BCP del día en cada actualización.
Si el TC de _config/meridiano.json no es de hoy (o del último día hábil),
se detiene, salvo que se pase --aceptar-tc con el motivo documentado.

Uso:
    python build_presentaciones.py                      # todos los decks
    python build_presentaciones.py edificio-sajonia     # uno solo
    python build_presentaciones.py --aceptar-tc         # construir con TC no actualizado
    CHROME=/ruta/a/chrome python build_presentaciones.py
"""
import datetime as dt
import glob
import json
import os
import shutil
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE, '_config'))
from comun import CFG, tc_texto  # noqa: E402

CANDIDATOS = [os.environ.get('CHROME', ''), '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', 'google-chrome', 'chromium', 'chromium-browser',
              r'C:\Program Files\Google\Chrome\Application\chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']


def chrome():
    for c in CANDIDATOS:
        if c and (os.path.isfile(c) or shutil.which(c)):
            return shutil.which(c) or c
    sys.exit('No se encontró Chrome/Chromium. Definir la variable CHROME con la ruta al ejecutable.')


def ultimo_habil(hoy):
    d = hoy
    while d.weekday() >= 5:
        d -= dt.timedelta(days=1)
    return d


def control_tc(aceptar):
    fecha = dt.date.fromisoformat(CFG['tipo_cambio']['fecha'])
    hoy = dt.date.today()
    # el BCP publica después de las 13:00: se acepta el día hábil anterior al de hoy
    minimo = ultimo_habil(ultimo_habil(hoy) - dt.timedelta(days=1))
    print(f'Tipo de cambio en uso: {tc_texto()} · verificado el {CFG["tipo_cambio"]["verificado_el"]}')
    if fecha < minimo and not aceptar:
        sys.exit(f'TC del {fecha:%d/%m/%Y} desactualizado (hoy {hoy:%d/%m/%Y}). Verificar la cotización del BCP del día, '
                 'actualizar _config/meridiano.json (gs_por_usd, fecha, verificado_el) y volver a correr. '
                 'Para construir igual: --aceptar-tc (e informar la fecha del TC usado).')


def build(deck, exe):
    src = os.path.join(BASE, deck, 'fuente')
    meta = json.load(open(os.path.join(src, 'deck.json')))
    for script in ('model.py', 'gen.py'):
        subprocess.run([sys.executable, script], cwd=src, check=True)
    out = os.path.join(BASE, deck, meta['pdf'])
    subprocess.run([exe, '--headless', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer',
                    f'--print-to-pdf={out}', 'file://' + os.path.join(src, 'deck.html').replace('\\', '/')],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f'  ✓ {deck}/{meta["pdf"]}')
    return out


def main(argv):
    aceptar = '--aceptar-tc' in argv
    decks = [a for a in argv if not a.startswith('--')] or sorted(os.path.basename(os.path.dirname(os.path.dirname(p)))
                                                                    for p in glob.glob(os.path.join(BASE, '*', 'fuente', 'deck.json')))
    control_tc(aceptar)
    exe = chrome()
    for d in decks:
        build(d, exe)
    return subprocess.call([sys.executable, os.path.join(BASE, 'verificar_presentaciones.py')])


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
