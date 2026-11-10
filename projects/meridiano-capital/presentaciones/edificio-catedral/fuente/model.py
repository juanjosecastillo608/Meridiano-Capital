"""Modelo del Edificio Catedral (Ciudad del Este): cifras únicas para PPTX, Excel y documentos.

Fuentes: PDF "Edificio Departamentos Catedral" (documento de terceros, metadatos del 27/08/2026),
pedido del founder del 05/11/2026 (hipótesis de los locales) y datos del founder del 07/11/2026:
precio de venta rápida sugerido USD 800.000, 1 salón alquilado y 2 desocupados, departamentos de 150 m²
y ubicación confirmada. El tipo de cambio sale de
_config/meridiano.json (D-097); nunca se escribe a mano.
"""
import os, sys, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import CFG, TC, tc_texto, tc_corto, CONTACTO  # D-096 / D-097

B = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(B, '..', '..', '..', '..', '..'))
# Estudio de mercado estándar (knowledge-base/investment/market-intelligence/estudios/, D-100)
ESTUDIO_ID = 'CDE-CATEDRAL-2026-11-07'
ESTUDIO = json.load(open(os.path.join(REPO, 'knowledge-base', 'investment', 'market-intelligence', 'estudios', ESTUDIO_ID, 'estudio.json'), encoding='utf-8'))
# Serie BCP para la sensibilidad (referencial salvo el 16/10, cierre interbancario); la última es la vigente de _config
SERIE_TC = [('16/10/2026', 5_770.91), ('03/11/2026', 6_060.86), ('04/11/2026', 6_144.02), ('05/11/2026', 6_388.47)]

PRECIO_USD = 960_000                  # precio publicado
PRECIOS = {'pub': 960_000, 'rap': 800_000}   # publicado / venta rápida sugerida por Meridiano Capital (07/11/2026)
MAPS = 'https://maps.app.goo.gl/uPDUSU5wzgi6K3iNA'   # ubicación confirmada por el founder (07/11/2026)
SUP_DPTO = 150                        # m² por departamento (founder, 07/11/2026)
SALONES_ALQ, SALONES_VAC = 1, 2       # founder, 07/11/2026: 1 salón alquilado, 2 desocupados
FRENTE_M, FONDO_M = 17.50, 40.00
TERRENO_M2 = 700                      # informado
CONSTRUIDO_M2 = 2_290                 # informado, pendiente de planos
DPTOS, LOCALES, COCHERAS = 12, 3, 12
CANON_DPTO = 3_000_000                # PDF: 12 unidades ocupadas
CANON_LOCAL = 3_000_000               # hipótesis: canon del salón alquilado no informado; mediana del estudio
MESES = 12

# Cifras publicadas por la fuente (solo para auditoría, nunca como resultado)
FUENTE = dict(tc_pdf=6_000, impuesto_anual=18_000_000, expensas=0, bruta_pdf=0.075, neta_pdf=0.0719,
              rent_comprobada=0.07, bruta_descripcion=0.0975)

assert abs(FRENTE_M * FONDO_M - TERRENO_M2) < 1e-9

assert SALONES_ALQ + SALONES_VAC == LOCALES
res_m = DPTOS * CANON_DPTO                       # 12 departamentos (informado)
com_m = LOCALES * CANON_LOCAL                    # 3 salones a la hipótesis (potencial)
act_m = res_m + SALONES_ALQ * CANON_LOCAL        # renta actual estimada: 12 dptos + 1 salón alquilado
tot_m = res_m + com_m                            # potencial: con los 2 salones vacantes alquilados
res_a, com_a, act_a, tot_a = res_m * MESES, com_m * MESES, act_m * MESES, tot_m * MESES
precio_gs = PRECIO_USD * TC


def escenario(ingreso_anual, tc, precio_usd=PRECIO_USD):
    p = precio_usd * tc
    return dict(ingreso_anual_gs=ingreso_anual, ingreso_anual_usd=ingreso_anual / tc,
                bruta=ingreso_anual / p, recuperacion=p / ingreso_anual)


tcs = [('Implícito en el 9,75% de la descripción', tot_a / (PRECIO_USD * FUENTE['bruta_descripcion'])),
       ('Usado en la planilla del PDF (sin fecha)', FUENTE['tc_pdf']),
       ('BCP, interbancario, cierre del 16/10/2026', 5_770.91),
       (f"BCP vigente en _config ({CFG['tipo_cambio']['fecha']})", TC)]

M = dict(
    tc=TC, tc_texto=tc_texto(), tc_corto=tc_corto(), tc_cfg=CFG['tipo_cambio'], contacto=CONTACTO,
    precio_usd=PRECIO_USD, precio_gs=precio_gs, frente=FRENTE_M, fondo=FONDO_M, terreno=TERRENO_M2,
    construido=CONSTRUIDO_M2, relacion_construido_terreno=CONSTRUIDO_M2 / TERRENO_M2,
    usd_m2_construido=PRECIO_USD / CONSTRUIDO_M2, usd_por_unidad=PRECIO_USD / (DPTOS + LOCALES),
    dptos=DPTOS, locales=LOCALES, cocheras=COCHERAS, canon_dpto=CANON_DPTO, canon_local=CANON_LOCAL,
    canon_dpto_usd=CANON_DPTO / TC,
    res_m=res_m, com_m=com_m, tot_m=tot_m, res_a=res_a, com_a=com_a, tot_a=tot_a,
    res=escenario(res_a, TC), act=escenario(act_a, TC), tot=escenario(tot_a, TC),
    act_m=act_m, act_a=act_a, salones_alq=SALONES_ALQ, salones_vac=SALONES_VAC, sup_dpto=SUP_DPTO, sup_dptos=SUP_DPTO * DPTOS,
    gs_m2_dpto=CANON_DPTO / SUP_DPTO, maps=MAPS,
    precios={k: dict(P=P, Pgs=P * TC, usd_m2=P / CONSTRUIDO_M2, usd_unidad=P / (DPTOS + LOCALES), desc=1 - P / PRECIOS['pub'],
                     res=escenario(res_a, TC, P), act=escenario(act_a, TC, P), tot=escenario(tot_a, TC, P)) for k, P in PRECIOS.items()},
    sens_fuente=[dict(n=n, tc=t, res=escenario(res_a, t)['bruta'], tot=escenario(tot_a, t)['bruta']) for n, t in tcs],
    # Sensibilidad para el inversor: valores ilustrativos + el vigente (sin cifras publicadas por la fuente)
    sens=[dict(n=f, tc=t, vigente=(t == TC), res=escenario(res_a, t)['bruta'], tot=escenario(tot_a, t)['bruta'],
               **{k: {x: escenario(a, t, P)['bruta'] for x, a in (('res', res_a), ('act', act_a), ('tot', tot_a))} for k, P in PRECIOS.items()})
          for f, t in [x for x in SERIE_TC if x[1] != TC] + [(f"{CFG['tipo_cambio']['fecha'][8:]}/{CFG['tipo_cambio']['fecha'][5:7]}/{CFG['tipo_cambio']['fecha'][:4]}", TC)]],
    fuente=FUENTE,
    auditoria=dict(
        bruta_pdf_recalc=res_a / (PRECIO_USD * FUENTE['tc_pdf']),
        neta_pdf_recalc=(res_a - FUENTE['impuesto_anual']) / (PRECIO_USD * FUENTE['tc_pdf']),
        neta_fuente_tc_actual=(res_a - FUENTE['impuesto_anual']) / precio_gs,
        tc_implicito_975=tot_a / (PRECIO_USD * FUENTE['bruta_descripcion']),
    ),
)


# ---- Mercado (estudio estándar), reconvertido al TC vigente
def gs_de(c):
    return c['precio'] if c['moneda'] == 'PYG' else c['precio'] * TC


def mediana(v):
    v = sorted(v); n = len(v)
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2


comps = [dict(c, gs=gs_de(c)) for c in ESTUDIO['comparables']]
res3 = [c for c in comps if c['uso'] == 'residencial' and c['usar_en_estadisticas']]
res_std = [c for c in res3 if c['codigo'] in ('R4', 'R5', 'R6', 'R7', 'R8')]   # estándar, según el estudio
com = [c for c in comps if c['uso'] == 'comercial' and c['usar_en_estadisticas']]
com_std = [c for c in com if c['codigo'] != 'C2']                                 # sin el premium
M['mercado'] = dict(
    estudio_id=ESTUDIO_ID, fecha_consulta=ESTUDIO['fecha_consulta'], tc_estudio=ESTUDIO['tc'], comparables=comps,
    res=dict(n=len(res3), min=min(c['gs'] for c in res3), max=max(c['gs'] for c in res3), mediana=mediana([c['gs'] for c in res3]),
             std_n=len(res_std), std_min=min(c['gs'] for c in res_std), std_max=max(c['gs'] for c in res_std), std_mediana=mediana([c['gs'] for c in res_std]),
             rango_prelim=(3_000_000, 3_500_000)),
    com=dict(n=len(com), mediana=mediana([c['gs'] for c in com]), max=max(c['gs'] for c in com),
             std_min=min(c['gs'] for c in com_std), std_max=max(c['gs'] for c in com_std), rango_prelim=(2_500_000, 4_500_000)),
    contexto=ESTUDIO.get('referencias_contexto', []))
# Gs/m² del canon frente a los comparables con superficie (R1: microcentro, 150 m²)
M['mercado']['res']['gs_m2_comparables'] = {c['codigo']: c['gs'] / c['superficie_m2'] for c in res3 if c.get('superficie_m2')}
# Escenarios (07/11/2026: 1 salón alquilado y 2 desocupados). Inferior adaptado: el salón alquilado se mantiene, a Gs 2,5 M (piso del rango)
ESC = [('Residencial informado', 3_000_000, 12, 0, 0), ('Actual estimado', 3_000_000, 12, 3_000_000, 1),
       ('Potencial (salones vacantes alquilados)', 3_000_000, 12, 3_000_000, 3),
       ('Inferior', 2_800_000, 12, 2_500_000, 1), ('Superior', 3_500_000, 12, 4_500_000, 3)]
M['escenarios'] = []
for n_, cd, d_, cs, sl in ESC:
    an = (cd * d_ + cs * sl) * 12
    M['escenarios'].append(dict(n=n_, canon_dpto=cd, dptos=d_, canon_salon=cs, salones=sl, mensual=cd * d_ + cs * sl, anual=an,
                                bruta=an / precio_gs, recuperacion=precio_gs / an,
                                **{k: dict(bruta=an / (P * TC), recuperacion=P * TC / an) for k, P in PRECIOS.items()}))
json.dump(M, open(os.path.join(B, 'model.json'), 'w'), ensure_ascii=False, indent=1)
if __name__ == '__main__':
    print(f"TC {TC} | precio Gs {precio_gs:,.0f}")
    print(f"Residencial: Gs {res_m:,}/mes · bruta {M['res']['bruta']*100:.2f}% · recuperación {M['res']['recuperacion']:.2f} años")
    print(f"Total: Gs {tot_m:,}/mes · bruta {M['tot']['bruta']*100:.2f}% · recuperación {M['tot']['recuperacion']:.2f} años")
    for s in M['sens_fuente'] + M['sens']:
        print(f"  {s['n']}: TC {s['tc']:.2f} → res {s['res']*100:.2f}% · total {s['tot']*100:.2f}%")
    print('Auditoría', {k: round(v, 4) for k, v in M['auditoria'].items()})
    mr = M['mercado']
    print('Mercado res', {k: (round(v) if isinstance(v, float) else v) for k, v in mr['res'].items()})
    print('Mercado com', {k: (round(v) if isinstance(v, float) else v) for k, v in mr['com'].items()})
    for e in M['escenarios']:
        print(f"  {e['n']}: Gs {e['mensual']:,}/mes · 960k {e['pub']['bruta']*100:.2f}% ({e['pub']['recuperacion']:.1f} a) · 800k {e['rap']['bruta']*100:.2f}% ({e['rap']['recuperacion']:.1f} a)")
    for k, p in M['precios'].items():
        print(k, p['P'], {x: round(p[x]['bruta'] * 100, 2) for x in ('res', 'act', 'tot')}, 'USD/m2', round(p['usd_m2']))
    print('Gs/m2 dpto', M['gs_m2_dpto'], {k: round(v) for k, v in M['mercado']['res']['gs_m2_comparables'].items()})
