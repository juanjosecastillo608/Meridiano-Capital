import json, os
TC = 5694                  # Gs por USD (BCP, 09/10/2026)
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
# Alquiler base: estudio de mercado de Sajonia (15/10/2026)
OF_BASE = 45_000            # Gs/m²/mes: O3, oficina de 160 m² sin muebles (Gs 46.350/m²), redondeado
MIX = [  # (tipología, cantidad, m² aprox., canon base Gs/mes, referencia)
    ('Departamento 2 dormitorios', 2, 70, 3_000_000, 'T1–T2: Gs 3,0–4,5 M; piso de la banda estándar'),
    ('Departamento 1 dormitorio', 3, 50, 2_500_000, 'D1–D2: Gs 1,4–3,0 M; punto medio-alto'),
    ('Monoambiente', 5, 35, 2_200_000, 'M1–M2: Gs 2,5–3,0 M con cochera; por debajo de la banda'),
    ('Local comercial en PB', 1, 60, 2_700_000, 'Unos Gs 45.000/m² en 60 m²'),
]

def altA(k=1.0):
    m = A_m2 * OF_BASE * k
    return dict(lines=[('Oficinas y locales', f'{round(A_m2)} m² alquilables', m)], mes=m, iva=0.10, vac=0.10)

def altB(k=1.0):
    lines = [(t, f'{q} × {n_(c * k)}', q * c * k) for t, q, _, c, _ in MIX]
    m = sum(x[2] for x in lines)
    loc = lines[-1][2]; w = loc / m
    return dict(lines=lines, mes=m, iva=0.05 * (1 - w) + 0.10 * w, vac=0.04 * (1 - w) + 0.08 * w)

def n_(x):
    return 'Gs ' + f"{round(x, -3):,.0f}".replace(',', '.')

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
    return dict(P=P, G=G, pre=pre, net=net, inv=inv, bruta=G / inv, bruta_compra=G / P, neta=net / inv, neta_pre=pre / inv,
                iva_u=G * alt['iva'], vac_u=G * alt['vac'], adm_u=G * ADM, man_u=G * MAN, ire_u=pre * IRE,
                max_inv10=G / 0.10, max_price10=G / 0.10 - cx['total'])

def proj(alt, cx, P, gr, val):
    ev = evaluate(alt, cx, P)
    nets = [neto(ev['G'] * (1 + gr) ** k, alt['iva'], alt['vac'])[1] for k in range(4)]
    V = ev['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf = [-P, -cx['total']] + nets[:3] + [nets[3] + V - ivav]
    return dict(nets=nets, V=V, plus=V - ev['inv'], ivav=ivav, acum=sum(nets), total=V - ev['inv'] - ivav + sum(nets), tir=irr(cf), gr=gr, val=val)

cxA, cxB = capex(TABLA['basica']), capex(TABLA['estandar'])
out = dict(TC=TC, PRICES=PRICES, M2=M2, A_m2=A_m2, FIJOS=FIJOS, DESC=DESC, OF_BASE=OF_BASE, MIX=MIX, cxA=cxA, cxB=cxB,
           cxA_full=capex(TABLA['basica'], 0), cxB_full=capex(TABLA['estandar'], 0), nuevo=M2 * 650,
           acm=dict(terreno=73_645, edif=160_680, mercado=234_325, competitivo=210_893, rapida=187_460))
out['A'] = dict(alt=altA(), ev={p: evaluate(altA(), cxA, P) for p, P in PRICES.items()})
out['B'] = dict(alt=altB(), ev={p: evaluate(altB(), cxB, P) for p, P in PRICES.items()})
out['scen'] = {f'{a}|{k}|{p}': evaluate(fa(k), cx, P)['bruta'] for a, fa, cx in [('A', altA, cxA), ('B', altB, cxB)]
               for k in (0.85, 1.0, 1.15) for p, P in PRICES.items()}
# sensibilidad B y A: costo de obra (tabla con y sin descuento) × alquiler, a ambos precios
out['sens'] = {}
for a, fa, rates in [('B', altB, [(450, DESC), (350, DESC), (450, 0)]), ('A', altA, [(350, DESC), (450, DESC), (350, 0)])]:
    for t, d in rates:
        for k in (0.85, 1.0, 1.15):
            for p, P in PRICES.items():
                e = evaluate(fa(k), capex(t, d), P)
                out['sens'][f'{a}|{t}|{d}|{k}|{p}'] = [e['bruta'], e['neta']]
out['proj'] = {p: {nm: proj(altB(), cxB, P, gr, val) for nm, gr, val in [('Conservador', .03, .02), ('Base', .05, .035), ('Optimista', .08, .05)]}
               for p, P in PRICES.items()}
out['projA'] = {p: proj(altA(), cxA, P, .05, .035) for p, P in PRICES.items()}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)

if __name__ == '__main__':
    print('capex A', cxA, '\ncapex B', cxB)
    for a in 'AB':
        print(a, 'mes Gs', round(out[a]['alt']['mes']))
        for p in PRICES:
            e = out[a]['ev'][p]
            print('  ', p, 'inv', round(e['inv']), 'bruta inv %.2f%%  neta %.2f%%  bruta s/compra %.2f%%' % (e['bruta'] * 100, e['neta'] * 100, e['bruta_compra'] * 100), 'maxprice10', round(e['max_price10']))
    for p in PRICES:
        print(p, {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][p].items()}, 'A base %.1f%%' % (out['projA'][p]['tir'] * 100))
