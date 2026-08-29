"""
Mathematical Audit (S57-S58 del prompt maestro).

Regla explicita del founder: cada cifra critica que el motor muestra debe
poder recalcularse por un camino de codigo independiente y coincidir -- si no
coincide, hay un bug real, no "ruido de redondeo". Este modulo no inventa una
tercera formula propia: reutiliza exactamente las mismas piezas que ya
existen (EstructuraCostos.cost_bridge(), calculadora.tir()/vpn()/anualizar(),
la propia serie flujo_neto de FlujoDeFondos.resumen_mensual()) pero las corre
de forma independiente del camino que uso Proyecto.correr(), para exponer
cualquier divergencia entre los dos caminos (S71 no duplicacion: se llama a
las mismas funciones, no se reescribe su logica).

Tolerancia: las comparaciones usan una tolerancia absoluta chica en vez de
igualdad exacta de floats -- no es indulgencia con errores reales, es
aritmetica de punto flotante acumulada sobre series largas (S58).
"""

import os
import sys
from typing import List

from .proyecto import ResultadoProyecto
from .cashflow import VentaUnidad

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from calculadora import tir, vpn, anualizar  # noqa: E402

TOLERANCIA_USD = 0.5    # medio dolar: tolera redondeo acumulado en series largas, no bugs reales
TOLERANCIA_PCT = 0.05   # medio punto porcentual en tasas


def auditar_costos(resultado: ResultadoProyecto) -> List[str]:
    """
    Compara la fila 'COSTO TOTAL' de cost_bridge() (sumada dentro de
    costos.EstructuraCostos) contra costo_total_proyecto_usd (sumado de forma
    independiente dentro de Proyecto.correr()). Dos caminos de codigo
    distintos que deben coincidir.
    """
    fila_total = next((f for f in resultado.cost_bridge if f["componente"] == "COSTO TOTAL"), None)
    if fila_total is None:
        return ["MODEL ERROR: cost_bridge no tiene fila 'COSTO TOTAL'"]

    diferencia = abs(fila_total["usd"] - resultado.costo_total_proyecto_usd)
    if diferencia > TOLERANCIA_USD:
        return [
            f"MODEL ERROR: cost_bridge['COSTO TOTAL']={fila_total['usd']:.2f} usd no coincide con "
            f"costo_total_proyecto_usd={resultado.costo_total_proyecto_usd:.2f} usd (diferencia {diferencia:.2f})"
        ]
    return []


def auditar_ventas(resultado: ResultadoProyecto, ventas: List[VentaUnidad]) -> List[str]:
    """Recalcula ingresos_totales_usd sumando `ventas` de forma independiente."""
    recalculado = sum(v.precio_usd for v in ventas)
    diferencia = abs(recalculado - resultado.ingresos_totales_usd)
    if diferencia > TOLERANCIA_USD:
        return [
            f"MODEL ERROR: sum(ventas.precio_usd)={recalculado:.2f} usd no coincide con "
            f"ingresos_totales_usd={resultado.ingresos_totales_usd:.2f} usd (diferencia {diferencia:.2f})"
        ]
    return []


def auditar_flujo(resultado: ResultadoProyecto) -> List[str]:
    """
    Recalcula el acumulado final sumando flujo_neto de cada fila de
    flujo_mensual, y lo compara contra el flujo_acumulado que ya trae la
    ULTIMA fila (calculado dentro de FlujoDeFondos.acumulado() -- un camino
    de codigo distinto a esta suma).
    """
    filas = resultado.flujo_mensual
    if not filas:
        return ["MODEL ERROR: flujo_mensual esta vacio"]

    recalculado = sum(f["flujo_neto"] for f in filas)
    reportado = filas[-1]["flujo_acumulado"]
    diferencia = abs(recalculado - reportado)
    if diferencia > TOLERANCIA_USD:
        return [
            f"MODEL ERROR: sum(flujo_neto)={recalculado:.2f} usd no coincide con el ultimo "
            f"flujo_acumulado reportado={reportado:.2f} usd (diferencia {diferencia:.2f})"
        ]
    return []


def auditar_tir_van(resultado: ResultadoProyecto, tasa_descuento_anual_pct: float) -> List[str]:
    """
    Recalcula TIR/VAN llamando directamente a calculadora.tir()/vpn()/
    anualizar() sobre la serie flujo_neto extraida de flujo_mensual, en vez de
    confiar en financiero.MetricasFinancieras -- valida que financiero.py no
    haya alterado la serie ni introducido una formula distinta.
    """
    errores = []
    flujo_neto = [f["flujo_neto"] for f in resultado.flujo_mensual]
    m = resultado.metricas

    tasa_periodica = tir(flujo_neto)
    tir_anual_recalculada = anualizar(tasa_periodica) * 100.0 if tasa_periodica is not None else None

    if (tir_anual_recalculada is None) != (m.tir_anual_pct is None):
        errores.append(
            f"MODEL ERROR: TIR recalculada ({tir_anual_recalculada}) y reportada ({m.tir_anual_pct}) "
            f"no coinciden en si existen (posible flujo sin cambio de signo)"
        )
    elif tir_anual_recalculada is not None:
        diferencia = abs(tir_anual_recalculada - m.tir_anual_pct)
        if diferencia > TOLERANCIA_PCT:
            errores.append(
                f"MODEL ERROR: TIR anual recalculada ({tir_anual_recalculada:.4f}%) no coincide con la "
                f"reportada ({m.tir_anual_pct:.4f}%) (diferencia {diferencia:.4f} pp)"
            )

    tasa_desc_mensual = (1.0 + tasa_descuento_anual_pct / 100.0) ** (1.0 / 12.0) - 1.0
    van_recalculado = vpn(tasa_desc_mensual, flujo_neto) if flujo_neto else None
    if van_recalculado is not None and m.van_usd is not None:
        diferencia = abs(van_recalculado - m.van_usd)
        if diferencia > TOLERANCIA_USD:
            errores.append(
                f"MODEL ERROR: VAN recalculado ({van_recalculado:.2f} usd) no coincide con el "
                f"reportado ({m.van_usd:.2f} usd) (diferencia {diferencia:.2f})"
            )
    return errores


def auditoria_completa(
    resultado: ResultadoProyecto, ventas: List[VentaUnidad], tasa_descuento_anual_pct: float
) -> List[str]:
    """Corre las 4 auditorias y devuelve la lista combinada (vacia = todo cuadra, S57)."""
    errores = []
    errores.extend(auditar_costos(resultado))
    errores.extend(auditar_ventas(resultado, ventas))
    errores.extend(auditar_flujo(resultado))
    errores.extend(auditar_tir_van(resultado, tasa_descuento_anual_pct))
    return errores
