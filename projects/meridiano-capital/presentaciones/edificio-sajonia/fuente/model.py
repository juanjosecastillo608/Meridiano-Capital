import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG, tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json, os
TC = TC_CFG                # Gs por USD: _config/meridiano.json (D-097)
PRICES = {'pedido': 220_000, 'rapida': 185_000}   # confirmados por el founder, 15/10/2026
M2 = 803                   # construidos, según ACM (sin verificación técnica)
RENT_EFF = 0.80            # supuesto: superficie alquilable / construida
DESC = 0.25                # descuento del founder sobre la tabla de obra por el estado actual
IMPREV = 0.10              # supuesto: aprobaciones e imprevistos sobre obra
FIJOS = 9_000_000 / TC     # supuesto: gastos fijos anuales del edificio
ADM, MAN, IRE = 0.08, 0.05, 0.10
TABLA = {'basica': 350, 'estandar': 450}   # remodelación sobre obra existente (06-costos-de-construccion.md)

def capex(table_rate, desc=DESC):
    rate = table_rate * (1 - desc)
    obra = M2 * rate
    return dict(table=table_rate, rate=rate, obra=obra, imprev=obra * IMPREV, total=obra * (1 + IMPREV))

A_m2 = M2 * RENT_EFF
LEVEL_M2 = M2 / 3                       # supuesto: 3 niveles de superficie similar
OF_BASE = 45_000            # Gs/m²/mes: O3, oficina de 160 m² sin muebles (Gs 46.350/m²), redondeado
REF = {'2D': 3_000_000, '1D': 2_500_000, 'MONO': 2_200_000, 'LOCAL': 2_700_000}
REF_TXT = {'2D': 'T1–T2: Gs 3,0–4,5 M; piso de la banda estándar', '1D': 'D1–D2: Gs 1,4–3,0 M; punto medio-alto',
           'MONO': 'M1–M2: Gs 2,5–3,0 M con cochera; por debajo de la banda', 'LOCAL': 'Unos Gs 45.000/m² en 60 m²'}
TAX = {'OF': (0.10, 0.10), 'LOCAL': (0.10, 0.08), 'VIV': (0.05, 0.04)}   # (IVA, vacancia)
MIX = [('Departamento 2 dormitorios', 2, '2D'), ('Departamento 1 dormitorio', 3, '1D'), ('Monoambiente', 5, 'MONO'), ('Local comercial en PB', 1, 'LOCAL')]

def build(comps, k):
    lines, mes, iva, vac = [], 0, 0, 0
    for label, detail, gs_mes, cls in comps:
        m = gs_mes * k
        lines.append((label, detail, m)); mes += m
        iva += m * TAX[cls][0]; vac += m * TAX[cls][1]
    return dict(lines=lines, mes=mes, iva=iva / mes, vac=vac / mes)

def altA(k=1.0):
    return build([('Oficinas y locales', f'{round(A_m2)} m² alquilables', A_m2 * OF_BASE, 'OF')], k)

def altB(k=1.0):
    return build([(t, f'{q} × Gs {REF[c] * k:,.0f}'.replace(',', '.'), q * REF[c], 'LOCAL' if c == 'LOCAL' else 'VIV') for t, q, c in MIX], k)

# C · Mixto: nivel 1 local + oficinas, nivel 2 oficinas, nivel 3 viviendas (1 × 2D, 1 × 1D, 2 mono)
C_OF_M2 = 2 * LEVEL_M2 * RENT_EFF - 60
def altC(k=1.0):
    return build([('Oficinas, niveles 1 y 2', f'{round(C_OF_M2)} m² alquilables', C_OF_M2 * OF_BASE, 'OF'),
                  ('Local comercial en PB', '1 unidad', REF['LOCAL'], 'LOCAL'),
                  ('Departamentos, nivel 3', '1 × 2 dorm. · 1 × 1 dorm. · 2 monoamb.', REF['2D'] + REF['1D'] + 2 * REF['MONO'], 'VIV')], k)

def capexC(desc=DESC):
    of, viv = capex(TABLA['basica'], desc), capex(TABLA['estandar'], desc)
    obra = 2 / 3 * of['obra'] + 1 / 3 * viv['obra']
    return dict(table='mixto', rate=obra / M2, obra=obra, imprev=obra * IMPREV, total=obra * (1 + IMPREV),
                detail=f"2 niveles × USD {of['rate']:g} + 1 nivel × USD {viv['rate']:g}")
def neto(G, iva, vac):
    pre = G * (1 - iva - vac - ADM - MAN) - FIJOS
    return pre, pre * (1 - IRE)

def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m

def evaluate(alt, cx, P):
    G = alt['mes'] * 12 / TC
    pre, net = neto(G, alt['iva'], alt['vac'])
    inv = P + cx['total']
    return dict(P=P, G=G, pre=pre, net=net, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv,
                iva_u=G * alt['iva'], vac_u=G * alt['vac'], adm_u=G * ADM, man_u=G * MAN, ire_u=pre * IRE,
                max_price10=G / 0.10 - cx['total'])

def proj(alt, cx, P, gr, val):
    ev = evaluate(alt, cx, P)
    nets = [neto(ev['G'] * (1 + gr) ** k, alt['iva'], alt['vac'])[1] for k in range(4)]
    V = ev['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf = [-P, -cx['total']] + nets[:3] + [nets[3] + V - ivav]
    return dict(nets=nets, V=V, plus=V - ev['inv'], ivav=ivav, acum=sum(nets), total=V - ev['inv'] - ivav + sum(nets), tir=irr(cf), gr=gr, val=val)

cxA, cxB, cxC = capex(TABLA['basica']), capex(TABLA['estandar']), capexC()
ALTS = {'A': (altA, cxA, lambda d: capex(TABLA['basica'], d)), 'B': (altB, cxB, lambda d: capex(TABLA['estandar'], d)), 'C': (altC, cxC, capexC)}
out = dict(TC=TC, PRICES=PRICES, M2=M2, A_m2=A_m2, C_OF_M2=C_OF_M2, LEVEL_M2=LEVEL_M2, FIJOS=FIJOS, DESC=DESC, OF_BASE=OF_BASE, REF=REF, REF_TXT=REF_TXT, MIX=MIX,
           cxA=cxA, cxB=cxB, cxC=cxC, nuevo=M2 * 650,
           acm=dict(terreno=73_645, edif=160_680, mercado=234_325, competitivo=210_893, rapida=187_460))
out['sens'], out['proj'] = {}, {}
for a, (fa, cx, fcx) in ALTS.items():
    out[a] = dict(alt=fa(), ev={p: evaluate(fa(), cx, P) for p, P in PRICES.items()})
    for d in (DESC, 0):
        for k in (0.85, 1.0, 1.15):
            for p, P in PRICES.items():
                e = evaluate(fa(k), fcx(d), P)
                out['sens'][f'{a}|{d}|{k}|{p}'] = [e['bruta'], e['neta']]
    out['proj'][a] = {p: {nm: proj(fa(), cx, P, gr, val) for nm, gr, val in [('Conservador', .03, .02), ('Base', .05, .035), ('Optimista', .08, .05)]}
                      for p, P in PRICES.items()}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)

if __name__ == '__main__':
    for a in 'ABC':
        print(a, 'capex', round(out['cx' + a]['total']), 'mes Gs', round(out[a]['alt']['mes']), 'iva %.3f vac %.3f' % (out[a]['alt']['iva'], out[a]['alt']['vac']))
        for p in PRICES:
            e = out[a]['ev'][p]
            print('  ', p, 'inv', round(e['inv']), 'bruta %.2f%% neta %.2f%%' % (e['bruta'] * 100, e['neta'] * 100),
                  'TIR', {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][a][p].items()})
        print('   sin desc', '%.2f%%' % (out['sens'][f'{a}|0|1.0|pedido'][0] * 100))
