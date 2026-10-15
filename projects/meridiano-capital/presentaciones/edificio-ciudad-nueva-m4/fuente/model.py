import json, os
TC = 5694; P = 340_000
RENTS = [  # (nivel, concepto, Gs/mes, clase)
 ('Tercer piso','2 dorm.',1_500_000,'D'),('Tercer piso','2 dorm.',1_500_000,'D'),('Tercer piso','1 dorm.',1_200_000,'D'),('Tercer piso','1 dorm.',1_100_000,'D'),
 ('Segundo piso','2 dorm.',1_600_000,'D'),('Segundo piso','2 dorm.',1_500_000,'D'),('Segundo piso','2 dorm.',1_500_000,'D'),('Segundo piso','2 dorm.',1_500_000,'D'),('Segundo piso','1 dorm.',1_250_000,'D'),
 ('Primer piso','1 dorm.',1_300_000,'D'),('Primer piso','3 dorm.',1_600_000,'D'),
 ('Planta baja','1 dorm.',1_200_000,'D'),('Planta baja','1 dorm.',900_000,'D'),('Planta baja','Cochera',700_000,'C'),('Planta baja','Cochera y departamento',1_200_000,'C')]
mes = sum(r[2] for r in RENTS)
c10 = sum(r[2] for r in RENTS if r[3] == 'C')
IVA = 0.05 + 0.05 * c10 / mes
VAC, ADM, MAN, FIX, IRE = 0.03, 0.08, 0.05, 1200, 0.10
G = mes * 12 / TC
def neto(g):
    pre = g * (1 - IVA - VAC - ADM - MAN) - FIX
    return pre, pre * (1 - IRE)
pre, net = neto(G)
def irr(c):
    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2; v = sum(x / (1 + m) ** i for i, x in enumerate(c))
        lo, hi = (m, hi) if v > 0 else (lo, m)
    return m
proj = {}
for nm, gr, val in [('Conservador', .03, .02), ('Base', .05, .035), ('Optimista', .08, .05)]:
    nets = [neto(G * (1 + gr) ** k)[1] for k in range(5)]
    V = P * (1 + val) ** 5; iv = V * 0.015
    proj[nm] = dict(nets=nets, V=V, plus=V - P, ivav=iv, acum=sum(nets), total=V - P - iv + sum(nets), tir=irr([-P] + nets[:4] + [nets[4] + V - iv]), gr=gr, val=val)
lv = {}
for r in RENTS: lv[r[0]] = lv.get(r[0], 0) + r[2]
d1 = [r[2] for r in RENTS if r[1] == '1 dorm.']; d2 = [r[2] for r in RENTS if r[1] == '2 dorm.']
out = dict(TC=TC, P=P, RENTS=RENTS, mes=mes, G=G, IVA=IVA, iva_u=G*IVA, vac_u=G*VAC, adm_u=G*ADM, man_u=G*MAN, FIX=FIX, pre=pre, net=net, ire_u=pre*IRE,
           bruta=G/P, neta=net/P, neta_pre=pre/P, veces=P/G, lv=lv, avg1=sum(d1)/len(d1), avg2=sum(d2)/len(d2), n1=len(d1), n2=len(d2), proj=proj)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.json'), 'w'), indent=1)
if __name__ == '__main__':
    print('mes', mes, 'G', round(G), 'IVA %.4f' % IVA, 'iva', round(G*IVA), 'vac', round(G*VAC), 'adm', round(G*ADM), 'man', round(G*MAN), 'pre', round(pre), 'ire', round(pre*IRE), 'net', round(net))
    print('bruta %.4f neta %.4f pre %.4f veces %.2f' % (G/P, net/P, pre/P, P/G), 'lv', lv, 'avg1', out['avg1'], 'avg2', out['avg2'], len(d1), len(d2))
    for k, v in proj.items(): print(k, 'neto5', round(v['nets'][4]), 'V', round(v['V']), 'plus', round(v['plus']), 'iva', round(v['ivav']), 'acum', round(v['acum']), 'total', round(v['total']), 'tir %.4f' % v['tir'])
