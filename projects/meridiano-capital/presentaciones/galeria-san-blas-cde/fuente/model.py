import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
import json

# Galería Av. San Blas – Camilo Recalde (Ciudad del Este) — v2, 2026-11-08.
# Alquileres comerciales de CDE se publican en USD: el modelo trabaja en USD; el TC solo convierte a guaraníes.
TC = TC_CFG
PRICES = {'pedido': 2_500_000, 'rapida': 1_700_000}   # pedido: aviso; rápida: sugerida por el founder (08/11/2026)
TERRENO, M2 = 900.0, 1572.0  # superficie construida confirmada por el founder: 1.572 m²
NIV = {'PB': 900.0, 'PA': M2 - 900.0}   # supuesto: PB ocupa el lote completo; la planta alta el resto
IMPREV = 0.10
FIJOS = 12_000               # USD/año: supuesto (seguros, impuesto inmobiliario, gastos no trasladables)
ADM, MAN, IRE = 0.08, 0.05, 0.10
TAX = {'COM': (0.10, 0.15), 'MASTER': (0.10, 0.03), 'OF': (0.10, 0.15)}   # (IVA, vacancia) supuestos

# --- A · Galería de locales (el propietario alquila cada local)
EFF_A = 0.60; PB_A = 22.0; PA_A = 10.0
REFAC_RATE = 175.0           # 50% de la tabla básica de remodelación: edificio en uso y en buen estado (supuesto)
# --- B · Shopping con un operador único (master lease): cafetería, restaurante, importados (electrónica, indumentaria)
EFF_B = 0.65                 # más superficie alquilable que A: pasillo integrado al patio de comidas (supuesto)
PB_B = 28.0                  # USD/m² subalquiler en PB: locales de importados con anclas gastronómicas (supuesto, banda USD 18–50)
PA_B = 15.0                  # USD/m² en planta alta con patio de comidas como ancla (supuesto)
SHARE = 0.60                 # el operador paga al propietario el 60% de su facturación de subalquiler (supuesto)
CONV_RATE = 0.75 * 450       # conversión a shopping: 75% de la tabla de locales comerciales estándar (USD 450/m²)
ESCALERAS, GASTRO = 80_000, 40_000   # escalera mecánica o ascensor; extracción, gas y grasas para gastronomía (supuestos)
# --- C · Galería y oficinas corporativas
OF_NEW_M2, OF_NEW_RATE, REFUERZO, ASCENSORES, OF_RATE = 3 * 600, 750, 0.15, 120_000, 11.0

def build(lines):
    mes = sum(x[2] for x in lines)
    iva = sum(x[2] * TAX[x[3]][0] for x in lines) / mes
    vac = sum(x[2] * TAX[x[3]][1] for x in lines) / mes
    return dict(lines=[x[:3] for x in lines], mes=mes, iva=iva, vac=vac)
def n0(x): return f'{x:,.0f}'.replace(',', '.')

def galeria(k=1.0, cls='COM'):
    return [('Locales en planta baja', f'{n0(NIV["PB"] * EFF_A)} m² × USD {PB_A * k:g}', NIV['PB'] * EFF_A * PB_A * k, cls),
            ('Locales en planta alta', f'{n0(NIV["PA"] * EFF_A)} m² × USD {PA_A * k:g}', NIV['PA'] * EFF_A * PA_A * k, cls)]
def sublet(k=1.0):
    return [('Subalquiler PB: importados y cafetería', f'{n0(NIV["PB"] * EFF_B)} m² × USD {PB_B * k:g}', NIV['PB'] * EFF_B * PB_B * k),
            ('Subalquiler PA: patio de comidas y locales', f'{n0(NIV["PA"] * EFF_B)} m² × USD {PA_B * k:g}', NIV['PA'] * EFF_B * PA_B * k)]
def altA(k=1.0): return build(galeria(k))
def altB(k=1.0):
    gross = sum(x[2] for x in sublet(k))
    return build([('Alquiler maestro del operador', f'{int(SHARE * 100)}% de USD {n0(gross)} de subalquiler', gross * SHARE, 'MASTER')])
def altC(k=1.0):
    of = OF_NEW_M2 * 0.80
    return build(galeria(k) + [('Oficinas corporativas, 3 pisos nuevos', f'{n0(of)} m² × USD {OF_RATE * k:g}', of * OF_RATE * k, 'OF')])

def mk(parts):
    o = sum(v for _, v in parts)
    return dict(parts=parts, obra=o, imprev=o * IMPREV, total=o * (1 + IMPREV))
def capexA(f=1.0): return mk([('Refacción y subdivisión en locales', M2 * REFAC_RATE * f)])
def capexB(f=1.0): return mk([('Conversión a shopping', M2 * CONV_RATE * f), ('Escalera mecánica o ascensor', ESCALERAS * f), ('Instalaciones gastronómicas', GASTRO * f)])
def capexC(f=1.0): return mk([('Refacción de la galería', M2 * REFAC_RATE * f), ('Oficinas nuevas con refuerzo', OF_NEW_M2 * OF_NEW_RATE * (1 + REFUERZO) * f), ('Ascensores', ASCENSORES * f)])

def neto(G, iva, vac, adm=ADM, man=MAN):
    pre = G * (1 - iva - vac - adm - man) - FIJOS
    return pre, pre * (1 - IRE)
# En B, el operador administra y mantiene el shopping: el propietario solo paga 2% de control y 1% de mantenimiento estructural (supuesto)
ADM_MAN = {'A': (ADM, MAN), 'B': (0.02, 0.01), 'C': (ADM, MAN)}

def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m

def evaluate(a, alt, cx, P):
    G = alt['mes'] * 12
    adm, man = ADM_MAN[a]
    pre, net = neto(G, alt['iva'], alt['vac'], adm, man)
    inv = P + cx['total']
    return dict(P=P, G=G, pre=pre, net=net, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv, adm=adm, man=man,
                iva_u=G * alt['iva'], vac_u=G * alt['vac'], adm_u=G * adm, man_u=G * man, ire_u=pre * IRE,
                max8=G / 0.08 - cx['total'], max10=G / 0.10 - cx['total'])

ALTS = {'A': (altA, capexA), 'B': (altB, capexB), 'C': (altC, capexC)}
CX = {a: f() for a, (_, f) in ALTS.items()}

# A y B: 1 año de obra; C: 2 años (la galería renta desde el año 2). Venta en el año 5.
def proj(a, P, gr, val):
    alt, cx = ALTS[a][0](), CX[a]
    ev = evaluate(a, alt, cx, P)
    adm, man = ADM_MAN[a]
    nets = [neto(ev['G'] * (1 + gr) ** k, alt['iva'], alt['vac'], adm, man)[1] for k in range(4)]
    if a == 'C':
        ga = altA(); na = neto(ga['mes'] * 12, ga['iva'], ga['vac'])[1]
        cf = [-P - cx['total'] * 0.5, -cx['total'] * 0.5, na, nets[0], nets[1], nets[2]]
        rent = [na] + nets[:3]
    else:
        cf = [-P - cx['total'], nets[0], nets[1], nets[2], nets[3]]
        rent = nets
    V = ev['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf[-1] += V - ivav
    return dict(tir=irr([cf[0], 0] + cf[1:]) if a != 'C' else irr(cf), total=V - ev['inv'] - ivav + sum(rent))

out = dict(TC=TC, PRICES=PRICES, TERRENO=TERRENO, M2=M2, NIV=NIV, FIJOS=FIJOS, EFF_A=EFF_A, PB_A=PB_A, PA_A=PA_A, EFF_B=EFF_B, PB_B=PB_B, PA_B=PA_B, SHARE=SHARE,
           CONV_RATE=CONV_RATE, REFAC_RATE=REFAC_RATE, OF_NEW_M2=OF_NEW_M2, OF_NEW_RATE=OF_NEW_RATE, OF_RATE=OF_RATE, TAX=TAX, ADM_MAN=ADM_MAN, cx=CX,
           sublet=[list(x) for x in sublet()], sublet_total=sum(x[2] for x in sublet()), sens={}, proj={})
for a, (fa, fcx) in ALTS.items():
    out[a] = dict(alt=fa(), ev={p: evaluate(a, fa(), CX[a], P) for p, P in PRICES.items()})
    for f in (1.0, 1.25):
        for k in (0.85, 1.0, 1.15):
            for p, P in PRICES.items():
                e = evaluate(a, fa(k), fcx(f), P)
                out['sens'][f'{a}|{f}|{k}|{p}'] = [e['bruta'], e['neta']]
    out['proj'][a] = {p: {nm: proj(a, P, gr, val) for nm, gr, val in [('Conservador', .02, .02), ('Base', .03, .035), ('Optimista', .05, .05)]} for p, P in PRICES.items()}

# --- Análisis comparativo de mercado (ACM): tres métodos, rangos (supuestos señalados)
COMP_EDIF = 2_000_000 / 1561.25          # V2: edificio comercial del microcentro, USD/m² construido (precio pedido)
acm_comp = (M2 * COMP_EDIF * 0.95, M2 * COMP_EDIF * 1.10)   # −5% negociación / +10% por doble frente y Av. San Blas
SUELO = (900, 1200)                      # USD/m²: sobre T1 (USD 540, esquina, 463 m²) y T2 (USD 917, Catedral, 1.200 m²), con prima por frente a San Blas y lote pasante
CONSTR_NEW = M2 * 450                    # tabla: locales comerciales estándar
DEPREC = (0.45, 0.35)                    # depreciación por antigüedad y estado (supuesto)
acm_cost = (TERRENO * SUELO[0] + CONSTR_NEW * (1 - DEPREC[0]), TERRENO * SUELO[1] + CONSTR_NEW * (1 - DEPREC[1]))
noi = {a: out[a]['ev']['pedido']['pre'] for a in 'AB'}
CAP = (0.09, 0.075)                      # tasa de capitalización comercial en CDE (supuesto)
acm_inc = (min(noi[a] / CAP[0] - CX[a]['total'] for a in 'AB'), max(noi[a] / CAP[1] - CX[a]['total'] for a in 'AB'))
out['acm'] = dict(comp=acm_comp, cost=acm_cost, inc=acm_inc, comp_m2=COMP_EDIF, suelo=SUELO, constr_new=CONSTR_NEW, deprec=DEPREC, cap=CAP, noi=noi,
                  rango=(acm_cost[1], acm_comp[0]))   # criterio de Meridiano: del techo del método del costo al piso de los comparables (los comparables son precios pedidos)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)

if __name__ == '__main__':
    for a in 'ABC':
        for p in PRICES:
            e = out[a]['ev'][p]
            print(a, p, 'capex', round(CX[a]['total']), 'mes', round(out[a]['alt']['mes']), 'bruta %.2f%% neta %.2f%%' % (e['bruta'] * 100, e['neta'] * 100),
                  'TIR', {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][a][p].items()})
    print('sublet', round(out['sublet_total']))
    print({k: (v if not isinstance(v, (tuple, list)) else [round(x) if x > 10 else x for x in v]) for k, v in out['acm'].items() if k != 'noi'})
