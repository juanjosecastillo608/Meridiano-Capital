"""
Scenario Engine (S47-S48 del prompt maestro).

Corre el mismo proyecto bajo distintos sets de parametros con nombre
(Conservador/Base/Optimista, o custom). Reutiliza la misma logica de
sensibilidad.correr_sensibilidad pero con combinaciones nombradas en vez de un eje
por variable.
"""

from dataclasses import dataclass
from typing import Callable, Dict, List


@dataclass
class Escenario:
    nombre: str
    ajustes_pct: Dict[str, float]   # {"precio_venta": -10, "costo_construccion": 10, "plazo_meses": 3, ...}


ESCENARIOS_ESTANDAR = [
    Escenario("Conservador", {"precio_venta": -10.0, "costo_construccion": 10.0, "meses_obra": 20.0}),
    Escenario("Base", {}),
    Escenario("Optimista", {"precio_venta": 10.0, "costo_construccion": -5.0, "meses_obra": -10.0}),
]


def correr_escenarios(
    constructor: Callable[[dict], "Proyecto"],
    parametros_base: dict,
    escenarios: List[Escenario] = None,
) -> List[dict]:
    escenarios = escenarios or ESCENARIOS_ESTANDAR
    filas = []
    for esc in escenarios:
        params = dict(parametros_base)
        for variable, delta_pct in esc.ajustes_pct.items():
            if variable not in params:
                raise ValueError(f"Escenario '{esc.nombre}': '{variable}' no esta en parametros_base")
            params[variable] = params[variable] * (1 + delta_pct / 100.0)
        resultado = constructor(params).correr()
        filas.append({
            "escenario": esc.nombre,
            "ajustes": esc.ajustes_pct,
            "ingresos_usd": resultado.ingresos_totales_usd,
            "costo_total_usd": resultado.costo_total_proyecto_usd,
            "margen_usd": resultado.margen_usd,
            "roi_pct": resultado.metricas.roi_pct,
            "tir_anual_pct": resultado.metricas.tir_anual_pct,
            "van_usd": resultado.metricas.van_usd,
            "peak_capital_usd": max(
                (-min((f["flujo_acumulado"] for f in resultado.flujo_mensual), default=0)), 0
            ),
        })
    return filas
