"""
Investor Data Layer (S63-S64 del prompt maestro).

Selecciona, desde un ResultadoProyecto completo, solo los datos seguros para
mostrar a un inversor -- y los exporta a JSON para que los generadores de
Investor Book / Investment Memorandum (production/generadores/build_*.js) lo
consuman directo, en vez de recibir numeros tipeados a mano. Esto es lo que
resuelve la regla S64: "los numeros del Investor Book y el Memorandum deben
salir del mismo modelo. Nunca crear una cifra para el modelo y otra para la
presentacion."

Que se OCULTA (S63): negociacion del terreno, supuestos estrategicos internos,
desglose linea por linea de costos indirectos/financieros si asi lo pide el caso.
Que se MUESTRA: inversion total, costo/m2, ingresos, margen agregado, ROI/TIR,
capital maximo requerido, escenarios, riesgos.
"""

import json
from dataclasses import asdict
from typing import Optional

from .proyecto import ResultadoProyecto


CAMPOS_CONFIDENCIALES_POR_DEFECTO = (
    "cost_bridge",          # desagregacion linea por linea -- confidencial salvo que el caso pida mostrarlo
    "financiamiento",       # estructura de deuda/equity detallada
    "flujo_mensual",        # cash flow mes a mes -- suele ser interno
)


def capa_inversor(resultado: ResultadoProyecto, ocultar: Optional[tuple] = None) -> dict:
    """Devuelve el subconjunto de datos apto para un Investor Book/Memorandum."""
    ocultar = ocultar if ocultar is not None else CAMPOS_CONFIDENCIALES_POR_DEFECTO
    m = resultado.metricas
    datos = {
        "proyecto": {
            "nombre": resultado.ficha.nombre,
            "barrio": resultado.ficha.barrio,
            "ciudad": resultado.ficha.ciudad,
            "segmento": resultado.ficha.segmento,
        },
        "resumen_ejecutivo": {
            "inversion_total_usd": round(resultado.inversion_total_usd, 2),
            "costo_total_proyecto_usd": round(resultado.costo_total_proyecto_usd, 2),
            "ingresos_totales_usd": round(resultado.ingresos_totales_usd, 2),
            "margen_usd": round(resultado.margen_usd, 2),
            "roi_pct": round(m.roi_pct, 2) if m.roi_pct is not None else None,
            "tir_anual_pct": round(m.tir_anual_pct, 2) if m.tir_anual_pct is not None else None,
            "van_usd": round(m.van_usd, 2) if m.van_usd is not None else None,
            "payback_mes": m.payback_mes,
            "equity_multiple": round(m.equity_multiple, 2) if m.equity_multiple else None,
        },
        "indicadores_por_m2": {
            k: (round(v, 2) if v is not None else None)
            for k, v in resultado.indicadores_por_m2.items()
        },
        "moneda": resultado.moneda,
        "_fuente": "dev_engine — Development Cost & Financial Engine de Meridiano Capital",
        "_advertencia": (
            "Cifras generadas por el motor parametrizable. Distinguir siempre "
            "ACTUAL/CONFIRMED de ESTIMATE/PROJECTION/ASSUMPTION segun la fuente de "
            "cada parametro de entrada (S65) antes de presentar a un inversor."
        ),
    }
    if "cost_bridge" not in ocultar:
        datos["cost_bridge"] = resultado.cost_bridge
    if "financiamiento" not in ocultar:
        datos["financiamiento"] = {
            "capital_propio_usado_usd": round(resultado.financiamiento["equity_usado_total_usd"], 2),
            "deuda_girada_usd": round(resultado.financiamiento["deuda_girada_acumulada_usd"], 2),
            "pico_deuda_usd": round(resultado.financiamiento["pico_deuda_usd"], 2),
            "costo_financiero_total_usd": round(resultado.costo_financiero_usd, 2),
        }
    if "flujo_mensual" not in ocultar:
        datos["flujo_mensual"] = resultado.flujo_mensual
    return datos


def exportar_json(resultado: ResultadoProyecto, ruta_archivo: str, ocultar: Optional[tuple] = None) -> str:
    """Escribe la capa de inversor a un archivo JSON. Devuelve la ruta escrita."""
    datos = capa_inversor(resultado, ocultar=ocultar)
    with open(ruta_archivo, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)
    return ruta_archivo


def exportar_json_interno(resultado: ResultadoProyecto, ruta_archivo: str) -> str:
    """
    Version SIN ocultar nada -- uso interno de Meridiano (nunca para un inversor).
    Incluye financiamiento y flujo mensual completos.
    """
    return exportar_json(resultado, ruta_archivo, ocultar=())
