"""
Metricas financieras (S39 del prompt maestro): ROI, ROIC, TIR, VAN, margenes,
Gross Development Value/Profit, Equity Multiple, Payback.

Reutiliza tir()/vpn()/anualizar() de calculadora.py -- ya implementados, probados y
en uso en produccion. No se reimplementan (S71 no duplicacion).
"""

import sys
import os
from dataclasses import dataclass
from typing import List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from calculadora import tir, vpn, anualizar  # noqa: E402


@dataclass
class MetricasFinancieras:
    gross_development_value_usd: float      # ingresos totales (S62)
    total_development_cost_usd: float        # costo total del proyecto (con financieros)
    gross_development_profit_usd: float      # GDV - TDC
    capital_propio_usd: float
    roi_pct: Optional[float]                 # margen / costo total
    roic_pct: Optional[float]                # margen / capital invertido (equity)
    tir_mensual: Optional[float]
    tir_anual_pct: Optional[float]
    van_usd: Optional[float]
    equity_multiple: Optional[float]         # (equity + margen atribuible a equity) / equity
    payback_mes: Optional[int]


def calcular_metricas(
    flujo_neto_mensual: List[float],
    gross_development_value_usd: float,
    total_development_cost_usd: float,
    capital_propio_usd: float,
    tasa_descuento_anual_pct: float = 12.0,
) -> MetricasFinancieras:
    """
    flujo_neto_mensual: flujo de fondos neto del proyecto completo (incluye
    financieros), flujo_neto_mensual[0] en el mes 0. Se usa tal cual para TIR/VAN
    -- exactamente la regla del S12 (nada de intereses fuera del flujo real).
    """
    gdp = gross_development_value_usd - total_development_cost_usd
    roi = (gdp / total_development_cost_usd * 100.0) if total_development_cost_usd > 0 else None
    roic = (gdp / capital_propio_usd * 100.0) if capital_propio_usd > 0 else None

    tasa_periodica = tir(flujo_neto_mensual)
    tir_anual = anualizar(tasa_periodica) * 100.0 if tasa_periodica is not None else None

    tasa_desc_mensual = (1.0 + tasa_descuento_anual_pct / 100.0) ** (1.0 / 12.0) - 1.0
    van = vpn(tasa_desc_mensual, flujo_neto_mensual) if flujo_neto_mensual else None

    equity_multiple = None
    if capital_propio_usd > 0:
        # Ingresos totales recibidos por el equity = capital devuelto + ganancia
        # aproximado por el ultimo valor del flujo acumulado + capital ya invertido
        acumulado = 0.0
        for f in flujo_neto_mensual:
            acumulado += f
        equity_multiple = (capital_propio_usd + acumulado) / capital_propio_usd if acumulado is not None else None

    payback = None
    acumulado = 0.0
    for i, f in enumerate(flujo_neto_mensual):
        acumulado += f
        if acumulado >= 0 and payback is None:
            payback = i
            break

    return MetricasFinancieras(
        gross_development_value_usd=gross_development_value_usd,
        total_development_cost_usd=total_development_cost_usd,
        gross_development_profit_usd=gdp,
        capital_propio_usd=capital_propio_usd,
        roi_pct=roi,
        roic_pct=roic,
        tir_mensual=tasa_periodica,
        tir_anual_pct=tir_anual,
        van_usd=van,
        equity_multiple=equity_multiple,
        payback_mes=payback,
    )
