import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
import json

# Galería Av. San Blas – Camilo Recalde (Ciudad del Este) — v1, 2026-11-07.
# Alquileres comerciales de CDE se publican en USD: el modelo trabaja en USD; el TC solo convierte a guaraníes.
TC = TC_CFG
P = 2_500_000                # precio del aviso
TERRENO, M2 = 900.0, 1572.0  # aviso InfoCasas (el texto del aviso dice también 1.590 m²: a aclarar)
NIV = {'PB': 900.0, 'PA': M2 - 900.0}   # supuesto: PB ocupa el lote completo; la planta alta el resto
EFF = 0.60                   # supuesto: superficie alquilable de una galería con pasillo de calle a calle
IMPREV = 0.10
FIJOS = 12_000               # USD/año: supuesto (seguros, impuesto inmobiliario y gastos no trasladables)
ADM, MAN, IRE = 0.08, 0.05, 0.10
TAX = {'COM': (0.10, 0.15), 'BLOQUE': (0.10, 0.05), 'OF': (0.10, 0.15)}   # (IVA, vacancia) supuestos

# Bases de alquiler (USD/m² por mes), estudio CDE-MICROCENTRO-2026-11-07 + CDE-CATEDRAL-2026-11-07
PB_RATE = 22.0   # locales de galería en PB: entre C2 (USD 18, salón premium) y el techo de galerías del microcentro (USD 50)
PA_RATE = 10.0   # planta alta de galería: menos tránsito; como salones grandes (USD 7–10)
BLOQUE_RATE = 8.0  # un solo operador sobre todo el edificio: salones grandes USD 7–10/m²
OF_RATE = 11.0   # oficinas corporativas nuevas: anuncios de USD 8–12/m² en CDE
# Obra
REFAC_RATE = 175.0   # USD/m²: 50% de la tabla básica de remodelación (350), edificio en uso y en buen estado según el aviso (supuesto)
BLOQUE_OBRA = 30_000 # USD: mantenimiento y adecuación mínima para un operador único (supuesto)
OF_NEW_M2 = 3 * 600  # supuesto: 3 pisos de oficinas de 600 m² sobre la galería, sujeto a normativa y estructura
OF_NEW_RATE = 750    # tabla: edificio en altura estándar + vidrio DVH
REFUERZO = 0.15      # supuesto: refuerzo estructural sobre la obra nueva
ASCENSORES = 120_000 # supuesto: 2 ascensores para las oficinas

def build(lines):
    mes = sum(x[2] for x in lines)
    iva = sum(x[2] * TAX[x[3]][0] for x in lines) / mes
    vac = sum(x[2] * TAX[x[3]][1] for x in lines) / mes
    return dict(lines=[x[:3] for x in lines], mes=mes, iva=iva, vac=vac)

RENT = {k: v * EFF for k, v in NIV.items()}
OF_RENT_M2 = OF_NEW_M2 * 0.80
def n0(x): return f'{x:,.0f}'.replace(',', '.')
def altA(k=1.0):
    return build([('Locales en planta baja', f'{n0(RENT["PB"])} m² × USD {PB_RATE * k:g}', RENT['PB'] * PB_RATE * k, 'COM'),
                  ('Locales en planta alta', f'{n0(RENT["PA"])} m² × USD {PA_RATE * k:g}', RENT['PA'] * PA_RATE * k, 'COM')])
def altB(k=1.0):
    return build([('Edificio completo a un operador', f'{n0(M2)} m² × USD {BLOQUE_RATE * k:g}', M2 * BLOQUE_RATE * k, 'BLOQUE')])
def altC(k=1.0):
    return build([('Locales en planta baja', f'{n0(RENT["PB"])} m² × USD {PB_RATE * k:g}', RENT['PB'] * PB_RATE * k, 'COM'),
                  ('Locales en planta alta', f'{n0(RENT["PA"])} m² × USD {PA_RATE * k:g}', RENT['PA'] * PA_RATE * k, 'COM'),
                  ('Oficinas corporativas, 3 pisos nuevos', f'{n0(OF_RENT_M2)} m² × USD {OF_RATE * k:g}', OF_RENT_M2 * OF_RATE * k, 'OF')])

def mk(obra, extra=0, **kw):
    o = obra + extra
    d = dict(obra=o, imprev=o * IMPREV, total=o * (1 + IMPREV)); d.update(kw); return d
def capexA(f=1.0): return mk(M2 * REFAC_RATE * f, refac=M2 * REFAC_RATE * f)
def capexB(f=1.0): return mk(BLOQUE_OBRA * f, refac=BLOQUE_OBRA * f)
def capexC(f=1.0):
    nueva = OF_NEW_M2 * OF_NEW_RATE * (1 + REFUERZO) * f
    return mk(M2 * REFAC_RATE * f + nueva, ASCENSORES, refac=M2 * REFAC_RATE * f, nueva=nueva, ascensores=ASCENSORES)

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

def evaluate(alt, cx, price=P):
    G = alt['mes'] * 12
    pre, net = neto(G, alt['iva'], alt['vac'])
    inv = price + cx['total']
    return dict(G=G, pre=pre, net=net, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv,
                iva_u=G * alt['iva'], vac_u=G * alt['vac'], adm_u=G * ADM, man_u=G * MAN, ire_u=pre * IRE,
                max8=G / 0.08 - cx['total'], max10=G / 0.10 - cx['total'])

# Años sin renta plena: A 1 año de obra; B renta desde el año 1; C 2 años de obra (la galería renta desde el año 2)
def proj(a, gr, val):
    alt, cx = ALTS[a][0](), CX[a]
    ev = evaluate(alt, cx)
    nets = [neto(ev['G'] * (1 + gr) ** k, alt['iva'], alt['vac'])[1] for k in range(5)]
    if a == 'A':
        cf = [-P - cx['total']] + [0] + nets[:3] + [nets[3]]
        yrs_rent = nets[:4]
    elif a == 'B':
        cf = [-P - cx['total']] + nets[:5]
        yrs_rent = nets[:5]
    else:
        ga = altA(); na = [neto(ga['mes'] * 12 * (1 + gr) ** k, ga['iva'], ga['vac'])[1] for k in range(2)]
        cf = [-P - cx['total'] * 0.5, -cx['total'] * 0.5, na[1], nets[0], nets[1], nets[2]]
        yrs_rent = [na[1]] + nets[:3]
    V = ev['inv'] * (1 + val) ** 4
    ivav = V * 0.015
    cf[-1] += V - ivav
    return dict(tir=irr(cf), V=V, acum=sum(yrs_rent), total=V - ev['inv'] - ivav + sum(yrs_rent))

ALTS = {'A': (altA, capexA), 'B': (altB, capexB), 'C': (altC, capexC)}
CX = {a: f() for a, (_, f) in ALTS.items()}
out = dict(TC=TC, P=P, TERRENO=TERRENO, M2=M2, NIV=NIV, EFF=EFF, RENT=RENT, FIJOS=FIJOS, PB_RATE=PB_RATE, PA_RATE=PA_RATE, BLOQUE_RATE=BLOQUE_RATE,
           OF_RATE=OF_RATE, OF_NEW_M2=OF_NEW_M2, OF_RENT_M2=OF_RENT_M2, OF_NEW_RATE=OF_NEW_RATE, REFAC_RATE=REFAC_RATE, TAX=TAX, cx=CX, sens={}, proj={})
for a, (fa, fcx) in ALTS.items():
    out[a] = dict(alt=fa(), ev=evaluate(fa(), CX[a]))
    for f in (1.0, 1.25):
        for k in (0.85, 1.0, 1.15):
            e = evaluate(fa(k), fcx(f))
            out['sens'][f'{a}|{f}|{k}'] = [e['bruta'], e['neta']]
    out['proj'][a] = {nm: proj(a, gr, val) for nm, gr, val in [('Conservador', .02, .02), ('Base', .03, .035), ('Optimista', .05, .05)]}
# Alquiler de PB que haría falta en A para llegar a 8% bruto (herramienta inversa)
g8 = 0.08 * (P + CX['A']['total']) / 12
out['req_pb8'] = (g8 - RENT['PA'] * PA_RATE) / RENT['PB']
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)

if __name__ == '__main__':
    for a in 'ABC':
        e = out[a]['ev']
        print(a, 'capex', round(CX[a]['total']), 'mes USD', round(out[a]['alt']['mes']), 'inv', round(e['inv']), 'bruta %.2f%% neta %.2f%%' % (e['bruta'] * 100, e['neta'] * 100),
              'TIR', {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][a].items()}, 'max8', round(e['max8']), 'max10', round(e['max10']))
    print('req PB USD/m² para 8%%: %.1f' % out['req_pb8'])
