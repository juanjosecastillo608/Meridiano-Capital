"""Modelo del Edificio Catedral (Ciudad del Este): cifras únicas para PPTX, Excel y documentos.

Fuentes: PDF "Edificio Departamentos Catedral" (documento de terceros, metadatos del 27/08/2026)
y pedido del founder del 05/11/2026 (hipótesis de los 3 locales). El tipo de cambio sale de
_config/meridiano.json (D-097); nunca se escribe a mano.
"""
import os, sys, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import CFG, TC, tc_texto, tc_corto, CONTACTO  # D-096 / D-097

B = os.path.dirname(os.path.abspath(__file__))

PRECIO_USD = 960_000
FRENTE_M, FONDO_M = 17.50, 40.00
TERRENO_M2 = 700                      # informado
CONSTRUIDO_M2 = 2_290                 # informado, pendiente de planos
DPTOS, LOCALES, COCHERAS = 12, 3, 12
CANON_DPTO = 3_000_000                # PDF: 12 unidades ocupadas
CANON_LOCAL = 3_000_000               # hipótesis comercial, sujeta a confirmación
MESES = 12

# Cifras publicadas por la fuente (solo para auditoría, nunca como resultado)
FUENTE = dict(tc_pdf=6_000, impuesto_anual=18_000_000, expensas=0, bruta_pdf=0.075, neta_pdf=0.0719,
              rent_comprobada=0.07, bruta_descripcion=0.0975)

assert abs(FRENTE_M * FONDO_M - TERRENO_M2) < 1e-9

res_m = DPTOS * CANON_DPTO
com_m = LOCALES * CANON_LOCAL
tot_m = res_m + com_m
res_a, com_a, tot_a = res_m * MESES, com_m * MESES, tot_m * MESES
precio_gs = PRECIO_USD * TC


def escenario(ingreso_anual, tc):
    p = PRECIO_USD * tc
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
    res=escenario(res_a, TC), tot=escenario(tot_a, TC),
    sens_fuente=[dict(n=n, tc=t, res=escenario(res_a, t)['bruta'], tot=escenario(tot_a, t)['bruta']) for n, t in tcs],
    # Sensibilidad para el inversor: valores ilustrativos + el vigente (sin cifras publicadas por la fuente)
    sens=[dict(n=n, tc=t, vigente=(t == TC), res=escenario(res_a, t)['bruta'], tot=escenario(tot_a, t)['bruta'])
          for n, t in sorted([('Ilustrativo', 5_800), ('Ilustrativo', 6_000), ('Vigente', TC), ('Ilustrativo', 6_300)], key=lambda x: x[1])],
    fuente=FUENTE,
    auditoria=dict(
        bruta_pdf_recalc=res_a / (PRECIO_USD * FUENTE['tc_pdf']),
        neta_pdf_recalc=(res_a - FUENTE['impuesto_anual']) / (PRECIO_USD * FUENTE['tc_pdf']),
        neta_fuente_tc_actual=(res_a - FUENTE['impuesto_anual']) / precio_gs,
        tc_implicito_975=tot_a / (PRECIO_USD * FUENTE['bruta_descripcion']),
    ),
)
json.dump(M, open(os.path.join(B, 'model.json'), 'w'), ensure_ascii=False, indent=1)
if __name__ == '__main__':
    print(f"TC {TC} | precio Gs {precio_gs:,.0f}")
    print(f"Residencial: Gs {res_m:,}/mes · bruta {M['res']['bruta']*100:.2f}% · recuperación {M['res']['recuperacion']:.2f} años")
    print(f"Total: Gs {tot_m:,}/mes · bruta {M['tot']['bruta']*100:.2f}% · recuperación {M['tot']['recuperacion']:.2f} años")
    for s in M['sens_fuente'] + M['sens']:
        print(f"  {s['n']}: TC {s['tc']:.2f} → res {s['res']*100:.2f}% · total {s['tot']*100:.2f}%")
    print('Auditoría', {k: round(v, 4) for k, v in M['auditoria'].items()})
