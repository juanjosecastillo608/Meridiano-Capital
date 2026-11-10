import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
from rentabilidad import neto_d101, credito_obra, ahorro_iva, PARTE_EDIF  # D-101
import json

# Clínica Magnificat (pediatría, Asunción) — v1, 2026-11-09. Datos del founder y del paquete del propietario.
TC = TC_CFG
PRICES = {'pedido': 500_000, 'rapida': 420_000}          # founder, 09/11/2026
N = 11                                                    # consultorios alquilados (5 con instalaciones para odontología)
N_ODONTO = 5
RENT0 = 2_500_000                                         # Gs/mes por consultorio, IVA y expensas incluidos (dato)
ADMIN0 = 10_450_000                                       # Gs/mes, global sin desglose; incluye secretaria (dato)
IMP_INMO = 45_000_000                                     # Gs/año, informado; a verificar con la boleta
IVA = 0.10                                                # alquiler comercial (D-045)
VAC = 0.05                                                # supuesto: hoy 100% ocupado, pero los contratos están vencidos
MANT = 0.02                                               # supuesto: reserva de mantenimiento mayor (% del bruto)
FACTURABLE = 0.40                                         # supuesto: parte de la administración con factura e IVA (la nómina no genera crédito)
# Etapas (supuestos de Meridiano, a validar)
RENT1, RENT2 = 2_750_000, 3_000_000                       # +10% al renovar; +10% con ascensor y mejoras (Villa Morra con secretaria: Gs 3,85 M)
ADMIN1 = round(ADMIN0 * 0.85, -4)                         # −15% tras la auditoría de gastos (objetivo)
ASC_GS = 58_000_000 * 1.10 + 15_000_000                   # 3 paradas: cotización vencida +10% y obra eléctrica y civil (supuesto)
MEJ_GS = 35_000_000                                       # pintura, iluminación LED, señalética pediátrica y salas de espera (supuesto)
ASC_MANT = 500_000                                        # Gs/mes de mantenimiento del ascensor desde el año 2 (supuesto)
N_NEW = (4, 5, 6)                                         # consultorios del 2.º piso: el anteproyecto (10/11/2026) propone 6 (C12-C17, réplica del 1.er piso), sin medición todavía
N_NEW_BASE = 6
CAPEX_NEW_USD = 12_000                                    # por consultorio nuevo: ~25 m² a USD 450/m² + baño, +10% (supuesto)
ADMIN_NEW = 0.10                                          # +10% de administración al sumar consultorios (supuesto)

# Superficies aproximadas por consultorio (m², incluido el baño), leídas de las fotos de los planos (09/11/2026); a verificar con relevamiento
SUP = {1: 12.3, 2: 12.5, 3: 12.5, 4: 13.6, 5: 13.5, 6: 20.7, 7: 20.2, 8: 18.5, 9: 13.7, 10: 13.9, 11: 13.9}
ODONTO = (1, 2, 3, 7, 11)                                  # sillón odontológico dibujado en el plano (5, coincide con el dato)
GRANDES = (6, 7, 8)                                        # ~18–21 m²
# Cómo llegar a la etapa 2 por tamaño (supuesto): grandes Gs 3,5 M y el resto Gs 2,8 M ≈ Gs 33 M por mes
TIER = {'grande': 3_500_000, 'resto': 2_800_000}
def etapa(n, rent, admin, asc_mant=0, obra_usd=0.0, P=500_000, n_new=0):
    G = (n + n_new) * rent * 12 / TC
    adm = (admin * (1 + ADMIN_NEW * (n_new > 0)) + asc_mant) * 12 / TC
    fijos = adm + IMP_INMO / TC
    r = neto_d101(G, iva=IVA, vac=VAC, pct={'Mantenimiento': MANT}, fijos=fijos, base_dep=obra_usd + PARTE_EDIF * P,
                  fijos_credito=adm * FACTURABLE)
    inv = P + obra_usd
    r.update(n=n + n_new, rent=rent, admin=admin, adm_u=adm, imp_u=IMP_INMO / TC, inv=inv, obra=obra_usd, bruta=G / inv, neta=r['net'] / inv,
             neta_pre=r['pre'] / inv, fact_mes=(n + n_new) * rent)
    return r

OBRA1 = (ASC_GS + MEJ_GS) / TC
out = dict(TC=TC, PRICES=PRICES, N=N, N_ODONTO=N_ODONTO, RENT0=RENT0, ADMIN0=ADMIN0, IMP_INMO=IMP_INMO, VAC=VAC, MANT=MANT, FACTURABLE=FACTURABLE,
           RENT1=RENT1, RENT2=RENT2, ADMIN1=ADMIN1, ASC_GS=ASC_GS, MEJ_GS=MEJ_GS, ASC_MANT=ASC_MANT, N_NEW=N_NEW, N_NEW_BASE=N_NEW_BASE,
           CAPEX_NEW_USD=CAPEX_NEW_USD, OBRA1=OBRA1, etapas={}, reconv={}, proj={})
for p, P in PRICES.items():
    E = {
        'E0': etapa(N, RENT0, ADMIN0, P=P),
        'E1': etapa(N, RENT1, ADMIN1, obra_usd=OBRA1, P=P),
        'E2': etapa(N, RENT2, ADMIN1, ASC_MANT, obra_usd=OBRA1, P=P),
        'E3': etapa(N, RENT2, ADMIN1, ASC_MANT, obra_usd=OBRA1 + N_NEW_BASE * CAPEX_NEW_USD, P=P, n_new=N_NEW_BASE),
    }
    out['etapas'][p] = E
    out['reconv'][p] = {str(k): etapa(N, RENT2, ADMIN1, ASC_MANT, obra_usd=OBRA1 + k * CAPEX_NEW_USD, P=P, n_new=k) for k in N_NEW}

def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m

# Flujo a 5 años por etapas: año 1 = medio año E0 + medio año E1 (mejoras y ascensor en el año 1);
# año 2 = E2; año 3 = E2 + reconversión desde el mes 25 (6 meses de obra) con medio año de E3; años 4-5 = E3 con suba de alquiler.
def proj(P, gr, val, reconv=True):
    E = {k: v for k, v in out['etapas'][[k for k, x in PRICES.items() if x == P][0]].items()}
    obra3 = N_NEW_BASE * CAPEX_NEW_USD if reconv else 0.0
    e3 = E['E3'] if reconv else E['E2']
    nets = [0.5 * E['E0']['net'] + 0.5 * E['E1']['net'], E['E2']['net'], 0.5 * E['E2']['net'] + 0.5 * e3['net'],
            e3['net'] * (1 + gr), e3['net'] * (1 + gr) ** 2]
    ivas = [0.5 * E['E0']['iva_u'] + 0.5 * E['E1']['iva_u'], E['E2']['iva_u'], e3['iva_u'], e3['iva_u'], e3['iva_u']]
    ah = ahorro_iva(credito_obra(OBRA1 + obra3), ivas)                  # crédito fiscal de la obra (D-101)
    nets = [a + b for a, b in zip(nets, ah)]
    inv = P + OBRA1 + obra3
    V = inv * (1 + val) ** 5; ivav = V * 0.015
    cf = [-P - OBRA1, nets[0], nets[1] - obra3, nets[2], nets[3], nets[4] + V - ivav]
    return dict(tir=irr(cf), total=V - inv - ivav + sum(nets), nets=nets, V=V)
for p, P in PRICES.items():
    out['proj'][p] = {nm: proj(P, gr, val) for nm, gr, val in [('Conservador', .02, .02), ('Base', .03, .035), ('Optimista', .05, .05)]}
    out['proj'][p]['sin_reconv'] = proj(P, .03, .035, reconv=False)
# Punto de equilibrio de gastos: cuánto pesan administración e impuesto sobre la facturación actual
F0 = N * RENT0 * 12
out['peso_admin'] = ADMIN0 * 12 / F0
out['peso_imp'] = IMP_INMO / F0
out['secretaria_ref'] = 2_899_048 * 1.165                   # salario mínimo vigente (supuesto) + aporte patronal IPS 16,5%
# Sensibilidad del impuesto inmobiliario informado (Gs 45 M/año): si fuera la mitad
_imp = IMP_INMO
IMP_INMO = _imp / 2
out['imp_half'] = {p: etapa(N, RENT0, ADMIN0, P=P)['neta'] for p, P in PRICES.items()}
IMP_INMO = _imp
# Herramienta inversa: alquiler por consultorio para 8% de neta en E2 a cada precio
out['req8'] = {}
for p, P in PRICES.items():
    lo, hi = 1e6, 1e7
    for _ in range(100):
        r_ = (lo + hi) / 2
        lo, hi = (r_, hi) if etapa(N, r_, ADMIN1, ASC_MANT, obra_usd=OBRA1, P=P)['neta'] < 0.08 else (lo, r_)
    out['req8'][p] = r_
out['SUP'] = SUP; out['SUP_TOT'] = sum(SUP.values()); out['ODONTO'] = ODONTO; out['GRANDES'] = GRANDES; out['TIER'] = TIER
out['TIER_TOT'] = sum(TIER['grande'] if c in GRANDES else TIER['resto'] for c in SUP)
out['gs_m2_hoy'] = {c: RENT0 / m for c, m in SUP.items()}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1, default=float)

if __name__ == '__main__':
    for p in PRICES:
        for k, e in out['etapas'][p].items():
            print(p, k, 'fact/mes Gs', e['fact_mes'], 'G USD', round(e['G']), 'iva', round(e['iva_u']), 'adm', round(e['adm_u']), 'imp', round(e['imp_u']), 'net', round(e['net']), 'inv', round(e['inv']), 'bruta %.2f%% neta %.2f%%' % (e['bruta']*100, e['neta']*100))
        print(p, {k: ('%.1f%%' % (v['tir']*100)) for k, v in out['proj'][p].items()}, {k: '%.2f%%' % (v['neta']*100) for k, v in out['reconv'][p].items()})
    print('peso admin %.1f%% imp %.1f%%' % (out['peso_admin']*100, out['peso_imp']*100), 'req8', {k: round(v) for k, v in out['req8'].items()}, 'obra1 USD', round(OBRA1))
