import json, os
TC = 5694
P = 220_000
M2 = 803
RENT_EFF = 0.80          # supuesto: superficie alquilable / construida
IMPREV = 0.10            # supuesto: aprobaciones e imprevistos sobre obra
FIJOS = 9_000_000 / TC   # supuesto: gastos fijos anuales del edificio
ADM, MAN, IRE = 0.08, 0.05, 0.10

def capex(rate):
    obra = M2 * rate
    return dict(rate=rate, obra=obra, imprev=obra * IMPREV, total=obra * (1 + IMPREV))

# Alternativa A: oficinas y locales
A_m2 = M2 * RENT_EFF
def altA(gs_m2):
    m = A_m2 * gs_m2
    return dict(lines=[('Oficinas y locales', f'{round(A_m2)} m² alquilables', m)], mes=m, iva=0.10, vac=0.10)
# Alternativa B: 10 unidades + 1 local
def altB(k):
    one, mono, loc = 2_200_000 * k, 1_800_000 * k, 2_700_000 * k
    deptos = 5 * one + 5 * mono
    m = deptos + loc
    w = loc / m
    return dict(lines=[('Dptos. 1 dormitorio', '5 unidades', 5 * one), ('Monoambientes', '5 unidades', 5 * mono), ('Local comercial en PB', '1 unidad', loc)],
                mes=m, iva=0.05 * (1 - w) + 0.10 * w, vac=0.04 * (1 - w) + 0.08 * w, one=one, mono=mono, loc=loc)

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

def evaluate(alt, cx):
    G = alt['mes'] * 12 / TC
    pre, net = neto(G, alt['iva'], alt['vac'])
    inv = P + cx['total']
    return dict(G=G, pre=pre, net=net, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv,
                iva_u=G * alt['iva'], vac_u=G * alt['vac'], adm_u=G * ADM, man_u=G * MAN, ire_u=pre * IRE,
                iva=alt['iva'], vac=alt['vac'], max_inv10=G / 0.10, max_price10=G / 0.10 - cx['total'])

out = dict(TC=TC, P=P, M2=M2, lot=268, A_m2=A_m2, FIJOS=FIJOS, usd_m2=P / M2,
           acm=dict(terreno=268 * 275, edif=803 * 200, mercado=234_325, competitivo=210_893, rapida=187_460, fuera=257_758),
           nuevo=M2 * 650)
cxA, cxB = capex(350), capex(450)
out['cxA'], out['cxB'] = cxA, cxB
for name, fn, base, ks in [('A', altA, 30_000, [22_000, 30_000, 40_000]), ('B', altB, 1.0, [0.85, 1.0, 1.15])]:
    cx = cxA if name == 'A' else cxB
    alt = fn(base)
    out[name] = dict(alt=alt, ev=evaluate(alt, cx), scen={str(k): evaluate(fn(k), cx) for k in ks})
# sensibilidad B: capex rate x alquiler
out['sensB'] = {f'{r}|{k}': evaluate(altB(k), capex(r)) for r in [250, 350, 450] for k in [0.85, 1.0, 1.15]}
out['sensA'] = {f'{r}|{k}': evaluate(altA(k), capex(r)) for r in [200, 350, 450] for k in [22_000, 30_000, 40_000]}
# proyección y TIR (alternativa B): año 1 obra sin renta, años 2-5 renta, venta al cierre del año 5
proj = {}
evB = out['B']['ev']; altB0 = out['B']['alt']
for nm, gr, val in [('Conservador', .03, .02), ('Base', .05, .035), ('Optimista', .08, .05)]:
    nets = [neto(evB['G'] * (1 + gr) ** k, altB0['iva'], altB0['vac'])[1] for k in range(4)]
    V = evB['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf = [-P, -cxB['total']] + nets[:3] + [nets[3] + V - ivav]
    proj[nm] = dict(nets=nets, V=V, plus=V - evB['inv'], ivav=ivav, acum=sum(nets), total=V - evB['inv'] - ivav + sum(nets), tir=irr(cf), gr=gr, val=val)
out['proj'] = proj
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)
for n in 'AB':
    e = out[n]['ev']; print(n, 'mes Gs', out[n]['alt']['mes'], 'G', round(e['G']), 'inv', round(e['inv']), 'bruta %.2f%% neta %.2f%% maxprice10 %d' % (e['bruta']*100, e['neta']*100, e['max_price10']))
    for k, s in out[n]['scen'].items(): print('   ', k, '%.2f%% / %.2f%%' % (s['bruta']*100, s['neta']*100))
for k, s in out['sensB'].items(): print('B', k, '%.2f / %.2f' % (s['bruta']*100, s['neta']*100))
for k, p in proj.items(): print(k, round(p['V']), round(p['acum']), round(p['total']), '%.1f%%' % (p['tir']*100))
print(cxA, cxB)
