import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
import json
# Edificio Barrio San Miguel (CDE), paquete de estudio v2.0 (17/10/2026).
# Rentas, áreas y distribución: planilla por unidad (estudio/Datos_mercado_San_Miguel.json > units),
# "Verificado por Meridiano, sujeto a constancia en planos municipales". El TC sale de _config (D-097).
B = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(B, 'estudio', 'Datos_mercado_San_Miguel.json')))
UNITS = D['units']
TC = TC_CFG
PRECIOS = {'pub': 350_000, 'rap': 290_000}       # publicado (propietario) / venta rápida (sugerencia de Meridiano Capital)
PARKING = 120_000                                # opción separada, fuera del caso base
AREA = sum(u['area_m2'] for u in UNITS)          # 592 m², suma de las 12 unidades
renta_m = sum(u['monthly_rent_pyg'] for u in UNITS)   # Gs 22.200.000
gastos_m = 2_700_000                             # incluyen IVA, mantenimiento y administración (founder, 16/10/2026)
assert (AREA, renta_m, len(UNITS)) == (592, 22_200_000, 12)
G = renta_m * 12 / TC                            # bruto anual USD
GI = gastos_m * 12 / TC                          # gastos informados anuales USD
SALDO = G - GI                                   # saldo (no NOI auditado)
# Ajustes Meridiano: vacancia 4% de referencia + otros gastos no informados (supuesto, igual que San José) + IRE 10%.
vac, ire = 0.04, 0.10
otros_gs = 6_000_000; OTROS = otros_gs / TC     # Gs 6 M por año (supuesto)

def neto(g):
    # IVA y administración son % del alquiler: los gastos informados escalan con la renta
    pre = g * (1 - vac) - GI * g / G - OTROS
    return pre, pre * (1 - ire)

pre, net = neto(G)

def irr(cfs):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2; v = sum(c / (1 + m) ** i for i, c in enumerate(cfs))
        if v > 0: lo = m
        else: hi = m
    return m

out = dict(TC=TC, G=G, GI=GI, SALDO=SALDO, pre=pre, net=net, OTROS=OTROS, AREA=AREA, renta_m=renta_m,
           vac=G * vac, ire=pre * ire,
           gastos_ratio=gastos_m / renta_m, desc_rapida=1 - PRECIOS['rap'] / PRECIOS['pub'],
           costo_nuevo=AREA * 650)
for k, P in PRECIOS.items():
    out[k] = dict(P=P, Pgs=P * TC, bruta=G / P, saldo=SALDO / P, neta_pre=pre / P, neta=net / P, veces=P / G,
                  usd_m2=P / AREA, usd_unidad=P / 12, pct_costo=P / (AREA * 650))
# Detalle por unidad y por tipología (sin promedios ni reparto uniforme)
out['units'] = [dict(u, usd=u['monthly_rent_pyg'] / TC, gs_m2=u['monthly_rent_pyg'] / u['area_m2'],
                     share=u['monthly_rent_pyg'] / renta_m) for u in UNITS]
grupos = [('Monoambientes', lambda u: u['unit_type'] == 'studio'),
          ('Dpto. 1 dormitorio', lambda u: u['unit_type'] == 'apartment' and u['bedrooms'] == 1),
          ('Dptos. 2 dormitorios', lambda u: u['unit_type'] == 'apartment' and u['bedrooms'] == 2),
          ('Dptos. 4 dormitorios', lambda u: u['unit_type'] == 'apartment' and u['bedrooms'] == 4),
          ('Casa posterior', lambda u: u['unit_type'] == 'rear_independent_house'),
          ('Salón comercial', lambda u: u['unit_type'] == 'commercial_front')]
out['grupos'] = []
for nm, f in grupos:
    us = [u for u in UNITS if f(u)]
    r = sum(u['monthly_rent_pyg'] for u in us)
    out['grupos'].append(dict(n=nm, count=len(us), area=sum(u['area_m2'] for u in us), renta=r, share=r / renta_m))
# Sensibilidades del estudio v2 (agregadas, más la vacancia anual de un monoambiente real)
sens = [('Base verificada', renta_m, gastos_m), ('Conservador', renta_m * .9, gastos_m * 1.1), ('Estrés', renta_m * .8, gastos_m),
        ('Mejora hipotética', renta_m * 1.1, gastos_m * 1.1), ('Un monoambiente vacío', renta_m - 2_700_000, gastos_m)]
out['sens'] = [dict(n=nm, ing=a, gas=b,
                    **{k: dict(bruta=a * 12 / TC / P, saldo=(a - b) * 12 / TC / P) for k, P in PRECIOS.items()})
               for nm, a, b in sens]
# Retorno total hipotético a 5 años: inversión = precio, flujos = neta conservadora, salida al año 5
proj = {}
for name, gr, val in [('Conservador', 0.0, 0.0), ('Base', .03, .02), ('Optimista', .05, .035)]:
    nets = [neto(G * (1 + gr) ** k)[1] for k in range(5)]
    proj[name] = {}
    for k, P in PRECIOS.items():
        V = P * (1 + val) ** 5; ivav = V * 0.015
        cfs = [-P] + nets[:4] + [nets[4] + V - ivav]
        proj[name][k] = dict(nets=nets, V=V, plus=V - P, ivav=ivav, acum=sum(nets), total=V - P - ivav + sum(nets), tir=irr(cfs))
    proj[name]['gr'], proj[name]['val'] = gr, val
out['proj'] = proj
# Estacionamiento lindero: caso mecánico sin renta incremental + umbrales
out['park'] = {k: dict(T=P + PARKING, bruta=G / (P + PARKING), saldo=SALDO / (P + PARKING)) for k, P in PRECIOS.items()}
out['park_hurdle'] = [dict(r=r, gs_mes=PARKING * r * TC / 12) for r in (.09, .10, .12)]
out['cap'] = [dict(r=r, P=SALDO / r) for r in (.08, .09, .10, .11, .12)]
json.dump(out, open(os.path.join(B, 'model.json'), 'w'))
print({k: {x: round(v * 100, 2) for x, v in out[k].items() if x in ('bruta', 'saldo', 'neta_pre', 'neta')} for k in PRECIOS},
      {n: (round(p['pub']['tir'] * 100, 1), round(p['rap']['tir'] * 100, 1)) for n, p in proj.items() if n != 'gr'})
