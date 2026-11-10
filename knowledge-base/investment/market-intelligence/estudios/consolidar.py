"""Valida los estudios de mercado estándar (estudios/<ID>/estudio.json) y regenera las bases consolidadas.

Salidas (no editar a mano; se regeneran):
  rentals/data/comparables-alquiler.csv
  sales/data/comparables-venta.csv

Uso:
  python knowledge-base/investment/market-intelligence/estudios/consolidar.py           # valida y regenera
  python knowledge-base/investment/market-intelligence/estudios/consolidar.py --check   # solo valida (CI / pre-commit)

Formato: ver estudios/README.md. Sale con código 1 si algún estudio no cumple el estándar.
"""
import csv, glob, json, os, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))
MI = os.path.dirname(BASE)
OUT = {'alquiler': os.path.join(MI, 'rentals', 'data', 'comparables-alquiler.csv'),
       'venta': os.path.join(MI, 'sales', 'data', 'comparables-venta.csv')}

META = ['estudio_id', 'titulo', 'ciudad', 'zona_sujeto', 'fecha_consulta', 'autor', 'tc', 'confianza_general', 'documento', 'comparables']
OPERACION = {'alquiler', 'venta'}
USO = {'residencial', 'comercial', 'mixto', 'terreno'}
MONEDA = {'PYG', 'USD'}
AMBITO = {'primaria', 'secundaria', 'ampliada'}
TEL = re.compile(r'\+?595[\s.-]*9\d{2}|\b09\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b')
MAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
SIN_ENLACE = 'Enlace no conservado'
FECHA = re.compile(r'^\d{4}-\d{2}-\d{2}$')

COLS = ['Estudio', 'Codigo', 'Ciudad', 'Zona', 'Ambito', 'Uso', 'Tipologia', 'Descripcion', 'Dormitorios', 'Banos', 'Superficie m2',
        'Base superficie', 'Terreno m2', 'Cochera', 'Amoblado', 'Moneda', 'Precio', 'Periodo', 'TC Gs/USD', 'Fecha TC', 'Precio Gs', 'Precio USD',
        'Gs por m2', 'USD por m2', 'Expensas/IVA', 'Fecha aviso', 'Fecha de relevamiento', 'Disponibilidad', 'Comparabilidad',
        'Usar en estadisticas', 'Motivo exclusion', 'Fuente', 'URL', 'Notas', 'Confianza estudio', 'Vigencia']


def textos(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            yield from textos(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from textos(v)
    elif isinstance(obj, str):
        yield obj


def validar(e, ruta):
    err = []
    for k in META:
        if k not in e or e[k] in (None, '', []):
            err.append(f'falta "{k}"')
    if os.path.basename(os.path.dirname(ruta)) != e.get('estudio_id'):
        err.append('la carpeta debe llamarse igual que estudio_id')
    tc = e.get('tc') or {}
    if not (isinstance(tc.get('gs_por_usd'), (int, float)) and tc['gs_por_usd'] > 0 and FECHA.match(str(tc.get('fecha', '')))):
        err.append('tc necesita gs_por_usd > 0 y fecha AAAA-MM-DD')
    if not FECHA.match(str(e.get('fecha_consulta', ''))):
        err.append('fecha_consulta debe ser AAAA-MM-DD')
    vistos = set()
    for c in e.get('comparables', []):
        cod = c.get('codigo')
        p = f'{cod}: '
        if cod in vistos: err.append(p + 'código repetido')
        vistos.add(cod)
        if c.get('operacion') not in OPERACION: err.append(p + f'operacion ∉ {OPERACION}')
        if c.get('uso') not in USO: err.append(p + f'uso ∉ {USO}')
        if c.get('moneda') not in MONEDA: err.append(p + f'moneda ∉ {MONEDA}')
        if c.get('ambito') not in AMBITO: err.append(p + f'ambito ∉ {AMBITO}')
        if not (isinstance(c.get('precio'), (int, float)) and c['precio'] > 0): err.append(p + 'precio > 0 obligatorio (nunca 0 por "sin dato")')
        for k in ('tipologia', 'zona', 'comparabilidad', 'fuente', 'disponibilidad'):
            if not c.get(k): err.append(p + f'falta {k}')
        if not isinstance(c.get('usar_en_estadisticas'), bool): err.append(p + 'usar_en_estadisticas debe ser true/false')
        if c.get('usar_en_estadisticas') is False and not c.get('motivo_exclusion'): err.append(p + 'excluido sin motivo_exclusion')
        url = c.get('url')
        if url and not str(url).startswith('https://'): err.append(p + 'url debe empezar con https://')
        if not url and SIN_ENLACE not in (c.get('notas') or ''): err.append(p + f'sin url: aclarar en notas "{SIN_ENLACE}..."')
    for t in textos(e):
        if TEL.search(t): err.append(f'teléfono en el texto (PII): "{t[:60]}"')
        if MAIL.search(t): err.append(f'correo en el texto (PII): "{t[:60]}"')
    return err


def filas(e):
    tc = e['tc']['gs_por_usd']
    for c in e['comparables']:
        gs = c['precio'] if c['moneda'] == 'PYG' else c['precio'] * tc
        usd = c['precio'] if c['moneda'] == 'USD' else c['precio'] / tc
        m2 = c.get('superficie_m2')
        yield c['operacion'], {
            'Estudio': e['estudio_id'], 'Codigo': c['codigo'], 'Ciudad': e['ciudad'], 'Zona': c['zona'], 'Ambito': c['ambito'],
            'Uso': c['uso'], 'Tipologia': c['tipologia'], 'Descripcion': c.get('descripcion', ''), 'Dormitorios': c.get('dormitorios', ''),
            'Banos': c.get('banos', ''), 'Superficie m2': m2 or '', 'Base superficie': c.get('base_superficie', ''), 'Terreno m2': c.get('terreno_m2', ''),
            'Cochera': c.get('cochera', ''), 'Amoblado': c.get('amoblado', ''), 'Moneda': c['moneda'], 'Precio': c['precio'], 'Periodo': c.get('periodo', ''),
            'TC Gs/USD': tc, 'Fecha TC': e['tc']['fecha'], 'Precio Gs': round(gs), 'Precio USD': round(usd, 2),
            'Gs por m2': round(gs / m2) if m2 else '', 'USD por m2': round(usd / m2, 2) if m2 else '',
            'Expensas/IVA': c.get('expensas_iva', ''), 'Fecha aviso': c.get('fecha_aviso') or 'No informada', 'Fecha de relevamiento': e['fecha_consulta'],
            'Disponibilidad': c['disponibilidad'], 'Comparabilidad': c['comparabilidad'], 'Usar en estadisticas': 'SI' if c['usar_en_estadisticas'] else 'NO',
            'Motivo exclusion': c.get('motivo_exclusion') or '', 'Fuente': c['fuente'], 'URL': c.get('url') or '', 'Notas': c.get('notas') or '',
            'Confianza estudio': e['confianza_general'], 'Vigencia': 'CURRENT'}


def main(argv):
    estudios, errores = [], 0
    for ruta in sorted(glob.glob(os.path.join(BASE, '*', 'estudio.json'))):
        e = json.load(open(ruta, encoding='utf-8'))
        err = validar(e, ruta)
        if err:
            errores += len(err)
            print(f'✗ {os.path.relpath(ruta, MI)}'); [print('   -', x) for x in err]
        estudios.append(e)
    if errores:
        return 1
    if '--check' in argv:
        print(f'✓ {len(estudios)} estudios de mercado cumplen el estándar')
        return 0
    rows = {'alquiler': [], 'venta': []}
    for e in estudios:
        for op, r in filas(e):
            rows[op].append(r)
    for op, path in OUT.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8', newline='') as f:
            w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(rows[op])
    for e in estudios:
        n = len(e['comparables']); u = sum(c['usar_en_estadisticas'] for c in e['comparables'])
        print(f"✓ {e['estudio_id']}: {n} comparables ({u} en estadísticas) · TC Gs {e['tc']['gs_por_usd']} del {e['tc']['fecha']}")
    print(f"→ {os.path.relpath(OUT['alquiler'], MI)}: {len(rows['alquiler'])} filas · {os.path.relpath(OUT['venta'], MI)}: {len(rows['venta'])} filas")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
