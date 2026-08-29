"""
Executive Dashboard + Outputs 01-13 (S59-S60 del prompt maestro).

Empaqueta datos YA calculados (ResultadoProyecto + las 5 piezas nuevas del
motor: escalamiento/target_return/inflacion/calidad_datos/auditoria_matematica)
en 13 salidas numeradas y un resumen ejecutivo de una sola pantalla -- no
recalcula nada (regla S64, misma que investor_layer.py: "nunca crear una
cifra para la presentacion que no exista ya en el modelo").

Nota de transparencia (checkpoint de esta pieza): el prompt maestro original
pide "Outputs 01-13 numerados" (S59) pero el nombre y el contenido exacto de
cada uno de los 13 no quedo persistido en ningun archivo del repo -- ni en
documentation/development-financial-engine/, ni en el audit (solo se registro
que este item faltaba, PHASE_7_SYSTEM_AUDIT.md linea ~102). La enumeracion de
abajo es una PROPUESTA razonable armada a partir de lo que el motor ya produce
end-to-end (ficha -> superficies -> costos -> precios -> ventas -> flujo ->
financiamiento -> metricas -> objetivo -> sensibilidad -> calidad/auditoria ->
resumen). Debe confirmarse contra el texto original del prompt maestro antes
de darla por definitiva; se puede reordenar/renombrar sin tocar la logica de
calculo de ningun otro modulo (este archivo es una capa de presentacion pura).

Todos los parametros salvo `resultado` son opcionales: cada output que
depende de una pieza no provista simplemente no se incluye (nunca se rellena
con un valor inventado).
"""

from typing import List, Optional

from .proyecto import ResultadoProyecto
from .cashflow import VentaUnidad


def output_01_ficha_proyecto(resultado: ResultadoProyecto) -> dict:
    f = resultado.ficha
    return {
        "nombre": f.nombre,
        "barrio": f.barrio,
        "ciudad": f.ciudad,
        "segmento": f.segmento,
        "calidad": f.calidad,
        "estrategia_comercial": f.estrategia_comercial,
        "fecha_inicio_estimada": f.fecha_inicio_estimada,
        "fecha_fin_estimada": f.fecha_fin_estimada,
    }


def output_02_superficies(estructura_costos) -> dict:
    """S18 -- cada denominador explicito. `estructura_costos` es la EstructuraCostos
    original (no viaja dentro de ResultadoProyecto, solo sus derivados)."""
    from dataclasses import asdict

    return asdict(estructura_costos.superficies)


def output_03_cost_bridge(resultado: ResultadoProyecto) -> List[dict]:
    return resultado.cost_bridge


def output_04_costo_por_m2(resultado: ResultadoProyecto) -> dict:
    return resultado.indicadores_por_m2


def output_05_matriz_precios_por_etapa(matriz_precios: Optional[dict]) -> Optional[dict]:
    """De escalamiento.matriz_precios_por_etapa(). None si el proyecto no usa
    escalamiento por etapa (venta a precio unico)."""
    return matriz_precios


def output_06_plan_de_ventas(ventas: List[VentaUnidad]) -> List[dict]:
    from dataclasses import asdict

    return [asdict(v) for v in ventas]


def output_07_flujo_de_fondos(resultado: ResultadoProyecto) -> List[dict]:
    return resultado.flujo_mensual


def output_08_financiamiento(resultado: ResultadoProyecto) -> dict:
    return resultado.financiamiento


def output_09_metricas_financieras(resultado: ResultadoProyecto) -> dict:
    from dataclasses import asdict

    return asdict(resultado.metricas)


def output_10_evaluacion_objetivo(veredicto_objetivo: Optional[dict]) -> Optional[dict]:
    """De target_return.evaluar_objetivo(). None si el inversor no fijo umbrales."""
    return veredicto_objetivo


def output_11_sensibilidad_y_escenarios(sensibilidad: Optional[list], escenarios: Optional[list]) -> dict:
    """De sensibilidad.correr_sensibilidad() / escenarios.correr_escenarios(),
    corridos aparte por el llamador (dependen de reconstruir el proyecto N
    veces, no de ResultadoProyecto)."""
    return {"sensibilidad": sensibilidad, "escenarios": escenarios}


def output_12_calidad_y_auditoria(errores_calidad: Optional[List[str]], errores_auditoria: Optional[List[str]]) -> dict:
    """De calidad_datos.validar_*() y auditoria_matematica.auditoria_completa(),
    corridos aparte por el llamador. Lista vacia = sin errores; None = no corrido."""
    return {
        "errores_calidad_datos": errores_calidad,
        "errores_auditoria_matematica": errores_auditoria,
        "estado": "OK" if not (errores_calidad or errores_auditoria) else "REVISAR",
    }


def output_13_resumen_ejecutivo(resultado: ResultadoProyecto) -> dict:
    """S60 -- Executive Dashboard: una sola pantalla con los indicadores clave."""
    m = resultado.metricas
    margen_pct = (
        round(m.gross_development_profit_usd / m.gross_development_value_usd * 100, 2)
        if m.gross_development_value_usd
        else None
    )
    return {
        "proyecto": resultado.ficha.nombre,
        "barrio": resultado.ficha.barrio,
        "costo_total_proyecto_usd": round(resultado.costo_total_proyecto_usd, 2),
        "costo_total_por_m2_construido_usd": resultado.indicadores_por_m2.get("costo_total_por_m2_construido"),
        "ingresos_totales_usd": round(resultado.ingresos_totales_usd, 2),
        "margen_usd": round(resultado.margen_usd, 2),
        "margen_pct": margen_pct,
        "roi_pct": m.roi_pct,
        "roic_pct": m.roic_pct,
        "tir_anual_pct": m.tir_anual_pct,
        "van_usd": m.van_usd,
        "equity_multiple": m.equity_multiple,
        "payback_mes": m.payback_mes,
        "duracion_proyectada_meses": len(resultado.flujo_mensual),
        "moneda": resultado.moneda,
    }


def armar_dashboard(
    resultado: ResultadoProyecto,
    estructura_costos,
    ventas: List[VentaUnidad],
    matriz_precios_por_etapa: Optional[dict] = None,
    veredicto_objetivo: Optional[dict] = None,
    sensibilidad: Optional[list] = None,
    escenarios: Optional[list] = None,
    errores_calidad_datos: Optional[List[str]] = None,
    errores_auditoria_matematica: Optional[List[str]] = None,
) -> dict:
    """Ensambla los 13 outputs + el resumen ejecutivo en un unico dict, listo
    para inyectar en los generadores de Investor Book/Memorandum o en un
    dashboard web. No recalcula ningun numero -- solo organiza lo ya calculado."""
    return {
        "output_01_ficha_proyecto": output_01_ficha_proyecto(resultado),
        "output_02_superficies": output_02_superficies(estructura_costos),
        "output_03_cost_bridge": output_03_cost_bridge(resultado),
        "output_04_costo_por_m2": output_04_costo_por_m2(resultado),
        "output_05_matriz_precios_por_etapa": output_05_matriz_precios_por_etapa(matriz_precios_por_etapa),
        "output_06_plan_de_ventas": output_06_plan_de_ventas(ventas),
        "output_07_flujo_de_fondos": output_07_flujo_de_fondos(resultado),
        "output_08_financiamiento": output_08_financiamiento(resultado),
        "output_09_metricas_financieras": output_09_metricas_financieras(resultado),
        "output_10_evaluacion_objetivo": output_10_evaluacion_objetivo(veredicto_objetivo),
        "output_11_sensibilidad_y_escenarios": output_11_sensibilidad_y_escenarios(sensibilidad, escenarios),
        "output_12_calidad_y_auditoria": output_12_calidad_y_auditoria(errores_calidad_datos, errores_auditoria_matematica),
        "output_13_resumen_ejecutivo": output_13_resumen_ejecutivo(resultado),
    }
