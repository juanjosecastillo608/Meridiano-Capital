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

# --- IVA diferenciado (resuelve D-001, confirmado por el founder 2026-08-02) ---
r_comercial = calc.evaluar_renta("comercial", 100000, 1000, nivel_neto=3)
if not aprox(r_comercial["desglose_gastos"]["iva"], 1200.0, 1.0):
    fallos.append(f"IVA comercial deberia ser 10% de 12000 bruto = 1200: {r_comercial['desglose_gastos']['iva']}")
r_residencial = calc.evaluar_renta("residencial_casa", 100000, 1000, nivel_neto=3)
if not aprox(r_residencial["desglose_gastos"]["iva"], 600.0, 1.0):
    fallos.append(f"IVA residencial deberia ser 5% de 12000 bruto = 600: {r_residencial['desglose_gastos']['iva']}")

# --- IVA de venta (nuevo, adicional a las cifras brutas ya auditadas) ---
r_venta = calc.evaluar_reventa("tradicional", "pre_pozo", "vende_al_terminar", 80000, entrega_inicial_pct=20)
if r_venta["iva_venta_pct"] != 5.0: fallos.append("IVA de venta deberia ser 5%")
if not aprox(r_venta["valor_salida_neto_iva"], r_venta["valor_salida"] * 0.95, 1.0):
    fallos.append("valor_salida_neto_iva deberia ser valor_salida menos 5%")
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
