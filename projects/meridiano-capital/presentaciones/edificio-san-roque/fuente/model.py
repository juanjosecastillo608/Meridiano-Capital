import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
from rentabilidad import neto_d101, credito_obra, ahorro_iva, PARTE_EDIF  # D-101
import json

# Edificio San Roque (Asunción) — v1, 2026-11-07. Mismo esquema que Edificio Sajonia v4.
TC = TC_CFG                 # Gs por USD: _config/meridiano.json (D-097)
PRICES = {'pedido': 250_000, 'rapida': 170_000}   # confirmados por el founder, 07/11/2026
TERRENO, M2 = 585.80, 499.4                          # según el aviso (9 × 69 m = 621 m²: diferencia a aclarar con la mensura)
# supuesto de reparto de los 499,4 m²: PB con entrepiso + 2 plantas de 160 m² (la losa de terraza es de 160 m²)
NIV = {'PB': M2 - 320, 'P1': 160, 'P2': 160}
RENT_EFF = 0.80             # supuesto: superficie alquilable / construida
IMPREV = 0.10               # supuesto
FIJOS = 7_000_000 / TC      # supuesto: gastos fijos anuales (edificio más chico que Sajonia)
ADM, MAN, IRE = 0.08, 0.05, 0.10
TABLA = {'basica': 350, 'estandar': 450, 'nueva': 650}   # 06-costos-de-construccion.md
TAX = {'OF': (0.10, 0.10), 'LOCAL': (0.10, 0.08), 'VIV': (0.05, 0.04), 'MED': (0.10, 0.10)}   # (IVA, vacancia); consultorios 10%: cerca del Ministerio de Salud y de sanatorios (supuesto)

# Bases de alquiler (estudio ASU-SAN-ROQUE-2026-11-07)
PB_RENT = 4_000_000         # aviso del vendedor para el salón de PB; dentro de la banda de Eusebio Ayala (Gs 14.000–30.000/m²)
OF_BASE = 32_000            # Gs/m²: entre O1 (Gs 36.000/m², 50 m², 2024) y K1 (Gs 25.000/m², 70 m²)
D2_RENT = 2_800_000         # 2 dormitorios de ~65 m²: techo de la banda sin muebles de San Roque (Gs 2,3–2,8 M), con estacionamiento
N_D2 = 4                    # supuesto de Meridiano: 2 departamentos por planta de 160 m²
N_D2_VEND = 2               # esquema del aviso: 1 departamento por planta
D2_VEND = 3_500_000         # aviso del vendedor, no verificado
N_CONS, CONS_NIV, CONS_RENT = 12, [4, 4, 4], 1_500_000   # mismo criterio que Sajonia: ~40 m² construidos por consultorio
ASCENSOR = 45_000           # supuesto: USD

def build(comps, k):
    lines, mes, iva, vac = [], 0, 0, 0
    for label, detail, gs_mes, cls in comps:
        m = gs_mes * k
        lines.append((label, detail, m)); mes += m
        iva += m * TAX[cls][0]; vac += m * TAX[cls][1]
    return dict(lines=lines, mes=mes, iva=iva / mes, vac=vac / mes)

OF_M2 = (NIV['P1'] + NIV['P2']) * RENT_EFF
def fmt(x): return f'{x:,.0f}'.replace(',', '.')
def altA(k=1.0):
    return build([('Salón comercial en PB', 'Con entrepiso de oficina y baño', PB_RENT, 'LOCAL'),
                  ('Oficinas, pisos 1 y 2', f'{round(OF_M2)} m² × Gs {fmt(OF_BASE * k)}', OF_M2 * OF_BASE, 'OF')], k)
def altB(k=1.0, d2=D2_RENT, n=N_D2):
    return build([('Salón comercial en PB', 'Con entrepiso de oficina y baño', PB_RENT, 'LOCAL'),
                  ('Departamentos de 2 dormitorios', f'{n} × Gs {fmt(d2 * k)}', n * d2, 'VIV')], k)
def altC(k=1.0):
    return build([(['Consultorios, PB', 'Consultorios, piso 1', 'Consultorios, piso 2'][i], f'{q} × Gs {fmt(CONS_RENT * k)}', q * CONS_RENT, 'MED') for i, q in enumerate(CONS_NIV)], k)

def mk(obra, detail, extra=0):
    o = obra + extra
    return dict(obra=o, imprev=o * IMPREV, total=o * (1 + IMPREV), detail=detail)
UP = NIV['P1'] + NIV['P2']
def capexA(f=1.0): return mk(UP * TABLA['basica'] * f, f'{UP:g} m² × USD {TABLA["basica"] * f:g} (básica)')
def capexB(f=1.0): return mk(UP * TABLA['estandar'] * f, f'{UP:g} m² × USD {TABLA["estandar"] * f:g} (estándar)')
def capexC(f=1.0):
    c = mk(M2 * TABLA['estandar'] * f, f'{M2:g} m² × USD {TABLA["estandar"] * f:g} (estándar)', ASCENSOR)
    c.update(obra_m2=M2 * TABLA['estandar'] * f, ascensor=ASCENSOR); return c

def neto_r(G, iva, vac, base_dep=0.0, fijos=None):
    # D-101: IVA contenido con crédito fiscal de administración y mantenimiento; IRE con depreciación
    return neto_d101(G, iva=iva, vac=vac, pct={'Administración': ADM, 'Mantenimiento': MAN}, fijos=FIJOS if fijos is None else fijos, base_dep=base_dep)
def neto(G, iva, vac, base_dep=0.0):
    r = neto_r(G, iva, vac, base_dep); return r['pre'], r['net']

def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m

def evaluate(alt, cx, P):
    G = alt['mes'] * 12 / TC
    R = neto_r(G, alt['iva'], alt['vac'], cx['total'] + PARTE_EDIF * P)
    pre, net = R['pre'], R['net']
    inv = P + cx['total']
    return dict(P=P, G=G, pre=pre, net=net, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv,
                iva_u=R['iva_u'], iva_deb=R['iva_deb'], iva_cred=R['iva_cred'], dep=R['dep'], vac_u=G * alt['vac'], adm_u=G * ADM, man_u=G * MAN, ire_u=R['ire_u'])

# El salón de PB está terminado: en A y B renta durante la obra de los pisos altos (año 1). En C toda la planta entra en obra.
PB_NET_Y1 = neto(PB_RENT * 12 / TC, *TAX["LOCAL"])[1]
def proj(alt, cx, P, gr, val, pb_y1):
    ev = evaluate(alt, cx, P)
    bd = cx['total'] + PARTE_EDIF * P
    rs_ = [neto_r(ev['G'] * (1 + gr) ** k, alt['iva'], alt['vac'], bd) for k in range(4)]
    ah = ahorro_iva(credito_obra(cx['total']), [r['iva_u'] for r in rs_])   # D-101: crédito fiscal de la obra
    nets = [r['net'] + a_ for r, a_ in zip(rs_, ah)]
    y1 = PB_NET_Y1 if pb_y1 else 0
    V = ev['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf = [-P, -cx['total'] + y1] + nets[:3] + [nets[3] + V - ivav]
    return dict(nets=nets, y1=y1, V=V, ivav=ivav, acum=sum(nets) + y1, total=V - ev['inv'] - ivav + sum(nets) + y1, tir=irr(cf))

ALTS = {'A': (altA, capexA, True), 'B': (altB, capexB, True), 'C': (altC, capexC, False)}
cx = {a: f() for a, (_, f, _) in ALTS.items()}
out = dict(TC=TC, PRICES=PRICES, TERRENO=TERRENO, M2=M2, NIV=NIV, OF_M2=OF_M2, FIJOS=FIJOS, PB_RENT=PB_RENT, OF_BASE=OF_BASE, D2_RENT=D2_RENT, D2_VEND=D2_VEND,
           N_D2=N_D2, N_D2_VEND=N_D2_VEND, N_CONS=N_CONS, CONS_NIV=CONS_NIV, CONS_RENT=CONS_RENT, ASCENSOR=ASCENSOR, TAX=TAX, nuevo=M2 * TABLA['nueva'], cx=cx, sens={}, proj={})
for a, (fa, fcx, pb) in ALTS.items():
    out[a] = dict(alt=fa(), ev={p: evaluate(fa(), cx[a], P) for p, P in PRICES.items()})
    for f in (1.0, 1.25):
        for k in (0.85, 1.0, 1.15):
            for p, P in PRICES.items():
                e = evaluate(fa(k), fcx(f), P)
                out['sens'][f'{a}|{f}|{k}|{p}'] = [e['bruta'], e['neta']]
    out['proj'][a] = {p: {nm: proj(fa(), cx[a], P, gr, val, pb) for nm, gr, val in [('Conservador', .03, .02), ('Base', .05, .035), ('Optimista', .08, .05)]}
                      for p, P in PRICES.items()}
for a in 'ABC':
    for p in PRICES:
        e = out[a]['ev'][p]; e['max10'] = e['G'] / 0.10 - cx[a]['total']; e['max8'] = e['G'] / 0.08 - cx[a]['total']
# B con el alquiler del aviso del vendedor (Gs 3,5 M por departamento), solo como contraste
out['B_vend'] = {p: evaluate(altB(d2=D2_VEND, n=N_D2_VEND), cx['B'], P) for p, P in PRICES.items()}
# Ingreso del aviso del vendedor (Gs 11 M/mes) sobre el precio, sin obra: solo para auditoría interna, no se muestra como rentabilidad
out['aviso_bruta_sin_obra'] = 11_000_000 * 12 / TC / PRICES['pedido']

# Ampliación: pisos 3 y 4 sobre la losa de 160 m² (2 departamentos de 2 dormitorios por piso no: 1 por piso, como los existentes)
AMP_M2 = 2 * 160
amp_cx = AMP_M2 * TABLA['nueva'] * (1 + IMPREV)
amp_G = 2 * 2 * D2_RENT * 12 / TC   # 2 pisos × 2 departamentos
amp_net = neto_r(amp_G, *TAX['VIV'], base_dep=amp_cx, fijos=0)['net']   # incremental: sin gastos fijos adicionales (D-101)
out['amp'] = dict(n=4, m2=AMP_M2, rate=TABLA['nueva'], capex=amp_cx, G=amp_G, bruta=amp_G / amp_cx, neta=amp_net / amp_cx)

# Alquiler por consultorio que iguala la neta de A y de B (herramienta inversa)
out['req'] = {}
for p, P in PRICES.items():
    for ref in 'AB':
        target = out[ref]['ev'][p]['neta'] * (P + cx['C']['total'])
        lo, hi = 0.0, 1e7   # D-101: bisección sobre el neto (IVA con crédito e IRE con depreciación)
        for _ in range(200):
            G = (lo + hi) / 2
            lo, hi = (G, hi) if neto(G, *TAX['MED'], cx['C']['total'] + PARTE_EDIF * P)[1] < target else (lo, G)
        out['req'][f'{ref}|{p}'] = G * TC / 12 / N_CONS
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)

if __name__ == '__main__':
    for a in 'ABC':
        print(a, 'capex', round(cx[a]['total']), 'mes Gs', round(out[a]['alt']['mes']), 'iva %.3f vac %.3f' % (out[a]['alt']['iva'], out[a]['alt']['vac']))
        for p in PRICES:
            e = out[a]['ev'][p]
            print('  ', p, 'inv', round(e['inv']), 'bruta %.2f%% neta %.2f%%' % (e['bruta'] * 100, e['neta'] * 100),
                  'TIR', {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][a][p].items()})
    print('B vendedor', {p: '%.2f%% / %.2f%%' % (e['bruta'] * 100, e['neta'] * 100) for p, e in out['B_vend'].items()})
    print('amp', {k: round(v, 4) for k, v in out['amp'].items()})
    print('req', {k: round(v) for k, v in out['req'].items()})
    print('max', {a: (round(out[a]['ev']['pedido']['max10']), round(out[a]['ev']['pedido']['max8'])) for a in 'ABC'})
    print('aviso sin obra %.2f%%' % (out['aviso_bruta_sin_obra'] * 100))
