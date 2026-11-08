import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG  # D-096 / D-097
import json

# Edificio Humaitá (centro histórico de Asunción) — v1, 2026-11-08.
# Precio en guaraníes (aviso); obra en USD (planilla del founder y tabla de Meridiano). Todo se evalúa en USD al TC vigente.
TC = TC_CFG
P_GS = 950_000_000
P = P_GS / TC
TERRENO, M2_AVISO, M2_TABLA = 541.0, 300.0, 610.0   # aviso: 300 m² construidos; tabla de unidades: 610 m²; planilla: 600 m²
M2 = M2_TABLA                # supuesto de trabajo: superficie de la tabla de unidades (a verificar con planos)
IMPREV, IRE = 0.10, 0.10

# ---------------- A · Departamentos, monoambientes y salones (tabla de unidades del founder, alquiler proyectado)
UNITS = [  # (planta, n.º, tipo, detalle, m², alquiler proyectado Gs, clase)
    ('PB frente', 1, 'Salón / oficina', 'Oficina con depósito en subsuelo', 90, 600_000, 'COM'),
    ('PB frente', 2, 'Departamento', '1 dormitorio', 46, 900_000, 'VIV'),
    ('PB frente', 3, 'Departamento', 'Monoambiente', 27, 800_000, 'VIV'),
    ('PB lateral', 4, 'Departamento', '2 dormitorios', 64, 1_300_000, 'VIV'),
] + [('PB interior', i, 'Departamento', 'Monoambiente', 20, 800_000, 'VIV') for i in range(5, 13)] + [
    ('PB interior', 13, 'Departamento', '1 dormitorio', 30, 800_000, 'VIV'),
    ('PA frente', 14, 'Salón / oficina', 'Monoambiente, baño compartido', 40, 800_000, 'COM'),
    ('PA frente', 15, 'Salón / oficina', 'Monoambiente, baño compartido', 30, 800_000, 'COM'),
    ('PA frente', 16, 'Salón / oficina', 'Monoambiente', 24, 800_000, 'COM'),
    ('PA fondo', 17, 'Departamento (proyecto)', '1 dormitorio, sin cocina ni baño', 36, 800_000, 'VIV'),
    ('PA fondo', 18, 'Departamento (proyecto)', 'Monoambiente, sin cocina ni baño', 27, 800_000, 'VIV'),
    ('PA fondo', 19, 'Departamento (proyecto)', '1 dormitorio, sin cocina ni baño', 36, 800_000, 'VIV')]
TAX = {'VIV': (0.05, 0.06), 'COM': (0.10, 0.10)}   # (IVA, vacancia): vivienda 5% (D-001/D-045); vacancia supuesta para unidades chicas del centro
A_REFAC = 175.0              # USD/m²: 50% de la tabla básica de remodelación (350), unidades que ya tienen cocina y baño (supuesto)
A_PROY = 6_000               # USD por unidad de proyecto: baño y kitchenette (supuesto; la tabla del founder estima Gs 10 M)
A_FIJOS = 6_000              # USD/año: seguro, impuesto inmobiliario y áreas comunes no trasladables (supuesto)

# ---------------- B · 20 habitaciones en alquiler mensual (planilla del founder), todo incluido
N_HAB = 20
B_RENT_GS = 1_400_000        # Gs por habitación con baño privado, amoblada y con aire, servicios incluidos (supuesto sobre el estudio)
B_VAC = 0.10                 # supuesto: rotación de estudiantes y profesionales por semestre
B_OPEX_MES = 1_470           # USD/mes: gastos del edificio de la planilla (servicios, seguro, mantenimiento, administración, impuestos, limpieza)
PLANILLA = {'obra_civil': 90_390, 'banos': 39_250, 'electrico': 15_800, 'pintura': 10_940, 'equipamiento': 24_200,
            'arquitecto': 7_819, 'permisos': 800, 'imprevistos': 12_510.4, 'seguros': 600}   # subtotales de la planilla (USD)
# ---------------- C · Hostel de 20 habitaciones privadas (renta por noche)
C_ADR = 22.0                 # USD por noche: habitaciones privadas de hostels del centro publicadas entre USD 7 y 31 (supuesto)
C_OCC = 0.55                 # ocupación de underwriting base de Meridiano (55–69%): se toma el piso
C_OTA = 0.15                 # comisión de plataformas (supuesto)
C_LIMP = 0.12                # limpieza, lavandería y amenities (supuesto)
C_STAFF = 3 * 3_000_000 * 13 / TC_CFG   # 3 recepcionistas a Gs 3,0 M con aguinaldo (supuesto)
C_OPEX = (B_OPEX_MES - 400) * 12 * 1.3 + 1_800   # gastos del edificio de la planilla sin administración, +30% de consumo hotelero, más software y marketing
C_EXTRA = 15_000             # USD: recepción, ropa blanca, TV, cerraduras, señalética y habilitación turística (supuesto)

def capexA(f=1.0):
    parts = [('Puesta en valor de 16 unidades existentes', (M2 - 99) * A_REFAC * f), ('Baño y kitchenette de 3 unidades de proyecto', 3 * A_PROY * f)]
    o = sum(v for _, v in parts); return dict(parts=parts, obra=o, imprev=o * IMPREV, total=o * (1 + IMPREV))
def capexB(f=1.0):
    base = sum(v for k, v in PLANILLA.items() if k not in ('arquitecto', 'permisos', 'imprevistos', 'seguros'))
    ind = PLANILLA['arquitecto'] + PLANILLA['permisos'] + PLANILLA['imprevistos'] + PLANILLA['seguros']
    parts = [('Obra civil, baños, electricidad y pintura (planilla)', (base - PLANILLA['equipamiento']) * f), ('Equipamiento de 20 habitaciones (planilla)', PLANILLA['equipamiento'] * f),
             ('Honorarios, permisos, imprevistos y seguros (planilla)', ind * f)]
    o = sum(v for _, v in parts); return dict(parts=parts, obra=o, imprev=0, total=o)   # la planilla ya incluye imprevistos (8%)
def capexC(f=1.0):
    b = capexB(f)
    parts = b['parts'] + [('Equipamiento de hostel y habilitación turística', C_EXTRA * 1.1 * f)]
    o = sum(v for _, v in parts); return dict(parts=parts, obra=o, imprev=0, total=o)

def incA(k=1.0):
    lines = [(f'{u[2]} n.º {u[1]}', f'{u[0]} · {u[3]} · {u[4]} m²', u[5] * k, u[6]) for u in UNITS]
    mes = sum(x[2] for x in lines)
    iva = sum(x[2] * TAX[x[3]][0] for x in lines) / mes; vac = sum(x[2] * TAX[x[3]][1] for x in lines) / mes
    G = mes * 12 / TC
    return dict(G=G, mes_gs=mes, pct={'IVA': iva, 'Vacancia': vac, 'Administración': 0.08, 'Mantenimiento': 0.05}, fijos={'Gastos fijos': A_FIJOS}, lines=lines)
def incB(k=1.0):
    mes = N_HAB * B_RENT_GS * k; G = mes * 12 / TC
    return dict(G=G, mes_gs=mes, pct={'IVA': 0.05, 'Vacancia': B_VAC}, fijos={'Gastos del edificio (planilla)': B_OPEX_MES * 12})
def incC(k=1.0):
    G = N_HAB * C_ADR * k * 365 * C_OCC
    return dict(G=G, mes_gs=G * TC / 12, pct={'IVA': 0.10, 'Comisión de plataformas': C_OTA, 'Limpieza y lavandería': C_LIMP, 'Mantenimiento': 0.05},
                fijos={'Personal de recepción': C_STAFF, 'Gastos del edificio y sistemas': C_OPEX})

def evaluate(inc, cx, price=P):
    G = inc['G']
    ded = {k: G * v for k, v in inc['pct'].items()}
    pre = G - sum(ded.values()) - sum(inc['fijos'].values())
    net = pre * (1 - IRE)
    inv = price + cx['total']
    return dict(G=G, ded=ded, fijos=inc['fijos'], pre=pre, net=net, ire=pre * IRE, inv=inv, bruta=G / inv, neta=net / inv, neta_pre=pre / inv,
                max10=G / 0.10 - cx['total'], max8=G / 0.08 - cx['total'], payback=inv / net if net > 0 else None)

def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m

ALTS = {'A': (incA, capexA, 0.5), 'B': (incB, capexB, 0.0), 'C': (incC, capexC, 0.0)}   # fracción de renta del año 1 (A: 6 meses de obra)
CX = {a: f() for a, (_, f, _) in ALTS.items()}
def proj(a, gr, val):
    fi, _, y1 = ALTS[a]
    ev = evaluate(fi(), CX[a])
    nets = [ev['net'] * (1 + gr) ** k for k in range(4)]
    V = ev['inv'] * (1 + val) ** 4; ivav = V * 0.015
    cf = [-ev['inv'], ev['net'] * y1] + nets[:3] + [nets[3] + V - ivav]
    return dict(tir=irr(cf), total=V - ev['inv'] - ivav + ev['net'] * y1 + sum(nets))

out = dict(TC=TC, P_GS=P_GS, P=P, TERRENO=TERRENO, M2=M2, M2_AVISO=M2_AVISO, UNITS=UNITS, N_HAB=N_HAB, B_RENT_GS=B_RENT_GS, C_ADR=C_ADR, C_OCC=C_OCC,
           A_REFAC=A_REFAC, cx=CX, sens={}, proj={}, planilla=PLANILLA)
for a, (fi, fc, _) in ALTS.items():
    out[a] = dict(inc=fi(), ev=evaluate(fi(), CX[a]))
    for f in (1.0, 1.25):
        for k in (0.85, 1.0, 1.15):
            e = evaluate(fi(k), fc(f)); out['sens'][f'{a}|{f}|{k}'] = [e['bruta'], e['neta']]
    out['proj'][a] = {nm: proj(a, gr, val) for nm, gr, val in [('Conservador', .02, .02), ('Base', .03, .035), ('Optimista', .05, .05)]}
# Hostel: sensibilidad a la ocupación (60% por defecto de D-046 y techo de 69%)
out['C_occ'] = {}
for occ in (0.45, 0.55, 0.60, 0.69):
    G = N_HAB * C_ADR * 365 * occ
    inc = incC(); inc['G'] = G
    out['C_occ'][str(occ)] = evaluate(inc, CX['C'])['neta']
# Planilla original: alquiler que pide para un 14% "bruto" y su precio todo incluido (auditoría)
out['planilla_rent_usd'], out['planilla_total_usd'] = 255.71, 329.21
out['B_req10'] = (0.10 * (P + CX['B']['total'])) / (N_HAB * 12) * TC   # Gs por habitación para 10% bruta (sobre ingreso bruto, sin vacancia)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1, default=float)

if __name__ == '__main__':
    print('P USD', round(P))
    for a in 'ABC':
        e = out[a]['ev']
        print(a, 'capex', round(CX[a]['total']), 'G', round(e['G']), 'mes Gs', round(out[a]['inc']['mes_gs']), 'bruta %.2f%% neta %.2f%%' % (e['bruta'] * 100, e['neta'] * 100),
              'TIR', {k: '%.1f%%' % (v['tir'] * 100) for k, v in out['proj'][a].items()}, 'max10', round(e['max10']), 'max8', round(e['max8']))
    print('C occ', {k: '%.2f%%' % (v * 100) for k, v in out['C_occ'].items()}, 'staff', round(C_STAFF), 'opex', round(C_OPEX))
    print('B req10 Gs', round(out['B_req10']))
