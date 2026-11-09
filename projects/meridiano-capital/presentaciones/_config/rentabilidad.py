"""Base de cálculo bruta → neta de las presentaciones (D-101, founder 09/11/2026).

Lee los parámetros fiscales de production/app/config/parametros_mercado.json, la misma fuente que
calculadora.py, para que decks y motor no se separen.

    from rentabilidad import neto_d101, credito_obra, DEP, PARTE_EDIF
    r = neto_d101(G, iva=0.10, vac=0.10, pct={'Administración': 0.08, 'Mantenimiento': 0.05},
                  fijos=9000, base_dep=obra + PARTE_EDIF * precio)

- IVA: el alquiler de mercado incluye el IVA. Débito = cobrado × tasa/(1+tasa), con cobrado = bruto − vacancia.
  Crédito fiscal = gastos facturados × 10/110. IVA neto = máx(0, débito − crédito).
- IRE: 10% del resultado antes de IRE menos la depreciación (2,5% de la base depreciable).
- Crédito fiscal de la obra: compensa el IVA de los primeros años; se suma en el flujo de la TIR (credito_obra).
"""
import json as _json
import os as _os

_P = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..', '..', '..', 'production', 'app', 'config', 'parametros_mercado.json')
_F = _json.load(open(_P, encoding='utf-8'))['fiscal']
IRE = _F['impuesto_renta_pct'] / 100
IVA_G = _F['iva_credito_gastos_pct'] / 100
DEP = _F['depreciacion_anual_pct'] / 100
PARTE_EDIF = _F['parte_edificio_pct'] / 100
CRED_PCT = ('Administración', 'Mantenimiento', 'Comisión de plataformas', 'Limpieza y lavandería')   # líneas facturadas


def neto_d101(G, iva, vac, pct, fijos, base_dep, fijos_credito=0.0, debito=None):
    """G: ingreso bruto anual. iva: tasa del alquiler. vac: vacancia (fracción del bruto). pct: {línea: fracción del bruto}.
    fijos: gastos fijos anuales (sin crédito salvo fijos_credito). base_dep: base depreciable. debito: IVA débito ya calculado
    (opcional, para tasas mixtas unidad por unidad)."""
    vac_u = G * vac
    ded = {k: G * v for k, v in pct.items()}
    deb = (G - vac_u) * iva / (1 + iva) if debito is None else debito
    cred = (sum(v for k, v in ded.items() if k in CRED_PCT) + fijos_credito) * IVA_G / (1 + IVA_G)
    iva_n = max(0.0, deb - cred)
    pre = G - vac_u - sum(ded.values()) - iva_n - fijos
    dep = DEP * base_dep
    ire = IRE * max(0.0, pre - dep)
    return dict(G=G, iva_u=iva_n, iva_deb=deb, iva_cred=cred, vac_u=vac_u, ded=ded, fijos=fijos, pre=pre, dep=dep, ire_u=ire, net=pre - ire)


def credito_obra(obra):
    """IVA contenido en la obra (crédito fiscal), si toda la obra se factura con IVA 10%."""
    return obra * IVA_G / (1 + IVA_G)


def ahorro_iva(pool, iva_por_anio):
    """Reparte el crédito de la obra contra el IVA neto de cada año. Devuelve la lista de ahorros."""
    out = []
    for x in iva_por_anio:
        u = min(pool, max(0.0, x)); pool -= u; out.append(u)
    return out
