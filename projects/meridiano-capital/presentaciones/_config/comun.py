"""Datos comunes de las presentaciones de Meridiano Capital (D-096, D-097).

Uso desde fuente/model.py o fuente/gen.py de cualquier deck:

    import os, sys
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
    from comun import CFG, TC, tc_texto, tc_corto, contacto_linea
"""
import datetime as _dt
import json as _json
import os as _os

_PATH = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'meridiano.json')
CFG = _json.load(open(_PATH, encoding='utf-8'))
TC = CFG['tipo_cambio']['gs_por_usd']
CONTACTO = CFG['contacto']


def _fecha():
    return _dt.date.fromisoformat(CFG['tipo_cambio']['fecha'])


def _n(x, d=0):
    return f"{x:,.{d}f}".replace(',', 'X').replace('.', ',').replace('X', '.')


def tc_corto():
    """'TC Gs 5.698 (BCP, 14/10/2026)'"""
    return f"TC Gs {_n(TC)} (BCP, {_fecha():%d/%m/%Y})"


def tc_texto():
    """'Gs 5.698 por USD (BCP, cotización referencial del 14/10/2026)'"""
    fuente = CFG['tipo_cambio']['fuente'].replace('BCP, ', '')
    return f"Gs {_n(TC)} por USD (BCP, {fuente} del {_fecha():%d/%m/%Y})"


def contacto_linea(sep=' &nbsp;·&nbsp; '):
    c = CONTACTO
    return sep.join([c['telefono'], c['email'], c['web']])


def dias_desde_tc(hoy=None):
    hoy = hoy or _dt.date.today()
    return (hoy - _fecha()).days
