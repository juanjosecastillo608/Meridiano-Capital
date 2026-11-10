#!/usr/bin/env python3
"""
Tests de auto-verificacion del motor de rentabilidad.
Corren los casos base conocidos. Si alguno falla, el motor esta roto
y NO se debe confiar en ningun resultado.

    python3 scripts/test_calculadora.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from calculadora import Calculadora, tir, anualizar, cagr, construir_cronograma

def aprox(a, b, tol=0.15):
    return a is not None and abs(a - b) <= tol

fallos = []

# --- Nucleo TIR ---
t = anualizar(tir([-100] + [0]*23 + [121]))
if not aprox(t*100, 10.0, 0.2): fallos.append(f"TIR base: {t*100:.2f} != 10")

c = cagr(100, 125, 24)
if not aprox(c*100, 11.80, 0.1): fallos.append(f"CAGR 25%/24m: {c*100:.2f} != 11.8")

c = cagr(100, 140, 48)
if not aprox(c*100, 8.78, 0.1): fallos.append(f"CAGR 40%/48m: {c*100:.2f} != 8.78")

calc = Calculadora()

# --- Reventa pre-pozo tradicional ---
r = calc.evaluar_reventa("tradicional","pre_pozo","vende_al_terminar",80000,entrega_inicial_pct=20)
if r["plusvalia_total_pct"] != 25.0: fallos.append("reventa plusvalia != 25")
if not aprox(r["tir_precio_total_pct"], 9.0, 0.3): fallos.append(f"reventa TIR total {r['tir_precio_total_pct']}")
if not (13 <= r["tir_capital_desembolsado_pct"] <= 17): fallos.append(f"reventa TIR desemb {r['tir_capital_desembolsado_pct']}")

# --- Reventa temprana: TIR alta ---
rt = calc.evaluar_reventa_temprana(80000,24,mes_cesion=6,apreciacion_pct=10,entrega_inicial_pct=20)
if rt["ganancia"] != 8000.0: fallos.append(f"cesion ganancia {rt['ganancia']}")
if rt["tir_capital_desembolsado_pct"] < 40: fallos.append(f"cesion TIR baja {rt['tir_capital_desembolsado_pct']}")

# --- Renta: denominador importa (sobre el YIELD, que es lo que sigue siendo
# fiel a la metodologia). Las aserciones viejas sobre pasa_piso se retiraron:
# D-033 (2026-08-09, confirmado por el founder) cambio pasa_piso a comparar
# BRUTO vs BRUTO en vez de NETO vs BRUTO. El piso numerico (7.5 para amoblado)
# todavia no fue recalibrado para esa comparacion -- ver P-004,
# knowledge-base/investment/05-matriz-pisos-techos.md. Con bruto, ambos casos
# de abajo pasan el piso viejo (9.5% y 15.2% > 7.5) sin discriminar -- es el
# comportamiento esperado hasta que la matriz real reemplace el numero.
r_lista = calc.evaluar_renta("departamento_amoblado",120000,950,nivel_neto=3)
r_pozo  = calc.evaluar_renta("departamento_amoblado",75000,950,nivel_neto=3)
if not aprox(r_lista["yield_bruto_pct"], 9.5, 0.1): fallos.append("yield bruto lista mal")
if not aprox(r_pozo["yield_bruto_pct"], 15.2, 0.1): fallos.append("yield bruto pozo mal")
if r_lista["pasa_piso"] is None or r_pozo["pasa_piso"] is None:
    fallos.append("pasa_piso no deberia ser None mientras haya piso_pct definido")

# --- Torre 36 vs 48: el hallazgo ---
r36 = calc.evaluar_reventa("torre","pre_pozo","vende_al_terminar",100000,meses_obra=36,entrega_inicial_pct=20)
r48 = calc.evaluar_reventa("torre","pre_pozo","vende_al_terminar",100000,meses_obra=48,entrega_inicial_pct=20)
if not (r36["tir_precio_total_pct"] > r48["tir_precio_total_pct"]):
    fallos.append("36m deberia rendir mas por anio que 48m")

# --- Retorno combinado: caso real Habitalis ---
# renta_sola_pasa_piso y "lectura" dependen de pasa_piso -> con la comparacion
# en bruto (D-033) y el piso todavia sin recalibrar, Habitalis ahora "pasa"
# solo con la renta (11.5% bruto > 7.5) -- ya no discrimina hasta que P-004
# cierre. Se retiraron esas dos aserciones; se mantienen las de plusvalia y
# retorno combinado, que no dependen del piso y siguen siendo la aritmetica
# validada contra el caso real.
rc = calc.evaluar_retorno_combinado("departamento_amoblado",99000,120000,12,950,nivel_neto=3)
if not aprox(rc["plusvalia_total_pct"], 21.21, 0.1): fallos.append(f"Habitalis plusvalia {rc['plusvalia_total_pct']}")
if not (25 <= rc["retorno_combinado_periodo_pct"] <= 29): fallos.append(f"Habitalis combinado {rc['retorno_combinado_periodo_pct']}")

# --- IVA diferenciado (D-001) con la base D-101 (founder, 09/11/2026): IVA contenido en lo
# cobrado (bruto - vacancia 3%) menos el credito fiscal de las lineas facturadas
# (administracion 10% + colocacion 0,5 mes + mantenimiento 5% = USD 2.300 sobre 12.000 de bruto).
r_comercial = calc.evaluar_renta("comercial", 100000, 1000, nivel_neto=3)
esperado_com = 11640 * 0.10 / 1.10 - 2300 * 0.10 / 1.10
if not aprox(r_comercial["desglose_gastos"]["iva"], esperado_com, 1.0):
    fallos.append(f"IVA comercial D-101 deberia ser {esperado_com:.2f}: {r_comercial['desglose_gastos']['iva']}")
if not aprox(r_comercial["iva_debito"], 11640 * 0.10 / 1.10, 1.0):
    fallos.append("IVA debito comercial deberia ser 10/110 de lo cobrado")
r_residencial = calc.evaluar_renta("residencial_casa", 100000, 1000, nivel_neto=3)
esperado_res = 11640 * 0.05 / 1.05 - 2300 * 0.10 / 1.10
if not aprox(r_residencial["desglose_gastos"]["iva"], esperado_res, 1.0):
    fallos.append(f"IVA residencial D-101 deberia ser {esperado_res:.2f}: {r_residencial['desglose_gastos']['iva']}")
# IRE sobre el neto menos la depreciacion: 2,5% de la mitad del precio (USD 1.250)
neto_pre = 12000 - sum(v for k, v in r_comercial["desglose_gastos"].items() if k != "impuesto_a_la_renta")
if not aprox(r_comercial["desglose_gastos"]["impuesto_a_la_renta"], (neto_pre - 1250) * 0.10, 1.0):
    fallos.append("IRE D-101 deberia ser 10% de (neto - depreciacion)")
if not aprox(r_comercial["depreciacion_ire"], 1250.0, 0.01):
    fallos.append("depreciacion por defecto = 2,5% x 50% del precio")
r_obra = calc.evaluar_renta("comercial", 100000, 1000, nivel_neto=3, base_depreciable=150000)
if not (r_obra["neto_anual"] > r_comercial["neto_anual"]):
    fallos.append("una base depreciable mayor deberia bajar el IRE y subir el neto")

# --- IVA de venta (CORREGIDO 2026-08-23, D-082: 1,5% efectivo = 30% base x 5% tasa,
# no 5% directo -- ver knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md) ---
r_venta = calc.evaluar_reventa("tradicional", "pre_pozo", "vende_al_terminar", 80000, entrega_inicial_pct=20)
if not aprox(r_venta["iva_venta_pct"], 1.5, 0.01): fallos.append("IVA de venta deberia ser 1,5% efectivo (30% base x 5% tasa)")
if not aprox(r_venta["valor_salida_neto_iva"], r_venta["valor_salida"] * 0.985, 1.0):
    fallos.append("valor_salida_neto_iva deberia ser valor_salida menos 1,5%")
if r_venta["tir_precio_total_neto_iva_pct"] >= r_venta["tir_precio_total_pct"]:
    fallos.append("TIR neta de IVA de venta deberia ser menor a la TIR bruta")

# --- Resultado ---
if fallos:
    print("FALLOS DETECTADOS — el motor NO es confiable:")
    for f in fallos: print("  -", f)
    sys.exit(1)
else:
    print("OK — todos los casos base pasan. El motor es confiable.")
    sys.exit(0)
