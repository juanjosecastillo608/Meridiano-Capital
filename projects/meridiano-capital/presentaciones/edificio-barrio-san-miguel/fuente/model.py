import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
import json
# Edificio Barrio San Miguel (CDE). Datos del propietario, no auditados: ver estudio/Datos_mercado_San_Miguel.json.
# El estudio de mercado del 16/10/2026 usó Gs 5.750 (BCP intradía 09:00); este modelo usa el TC central (D-097)
# y recalcula todo con él, como pide estudio/Instrucciones_San_Miguel.md.
TC = TC_CFG
PRECIOS = {'pub': 350_000, 'rap': 290_000}       # publicado / venta rápida (propietario)
PARKING = 120_000                                # opción separada, fuera del caso base
renta_m, gastos_m = 20_000_000, 2_700_000        # declarados, sin desglose
G = renta_m * 12 / TC                            # bruto anual USD
GI = gastos_m * 12 / TC                          # gastos informados anuales USD
SALDO = G - GI                                   # saldo informado (no NOI auditado)
# Ajustes de referencia Meridiano (conservadores; pueden duplicar partidas incluidas en los Gs 2,7 M)
iva, vac, adm, man, ire = 0.05, 0.04, 0.08, 0.05, 0.10

def neto(g):
    pre = g * (1 - iva - vac - adm - man) - GI
    return pre, pre * (1 - ire)

pre, net = neto(G)

def irr(cfs):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2; v = sum(c / (1 + m) ** i for i, c in enumerate(cfs))
        if v > 0: lo = m
        else: hi = m
    return m

out = dict(TC=TC, G=G, GI=GI, SALDO=SALDO, pre=pre, net=net,
           iva=G * iva, vac=G * vac, adm=G * adm, man=G * man, ire=pre * ire,
           gastos_ratio=gastos_m / renta_m, desc_rapida=1 - PRECIOS['rap'] / PRECIOS['pub'],
           costo_nuevo=400 * 650)
for k, P in PRECIOS.items():
    out[k] = dict(P=P, Pgs=P * TC, bruta=G / P, saldo=SALDO / P, neta_pre=pre / P, neta=net / P, veces=P / G,
                  usd_m2=P / 400, usd_unidad=P / 12, pct_costo=P / (400 * 650))
# Sensibilidades del estudio (agregadas; no son unidades vacantes)
sens = [('Base informada', 1, 1), ('Conservador', .9, 1.1), ('Estrés', .8, 1), ('Mejora hipotética', 1.1, 1.1)]
out['sens'] = [dict(n=nm, ing=renta_m * a, gas=gastos_m * b,
                    **{k: dict(bruta=renta_m * a * 12 / TC / P, saldo=(renta_m * a - gastos_m * b) * 12 / TC / P)
                       for k, P in PRECIOS.items()}) for nm, a, b in sens]
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
print(json.dumps(out, indent=1)[:1500])
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'))
