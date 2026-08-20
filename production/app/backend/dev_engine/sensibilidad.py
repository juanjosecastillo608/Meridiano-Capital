"""
Sensitivity + Break-even Engine (S43-S45 del prompt maestro).

Trabaja sobre una funcion "constructor" que, dado un dict de parametros, devuelve
un Proyecto ya armado (typicamente una funcion que el caller define, ver
herrera_validation.py para un ejemplo real). Este modulo nunca conoce los detalles
de un proyecto puntual -- solo corre el mismo constructor bajo distintos parametros
y tabula margen/ROI/TIR, o busca por bisección el punto donde el margen es cero.
"""

from typing import Callable, Dict, List


def correr_sensibilidad(
    constructor: Callable[[dict], "Proyecto"],
    parametros_base: dict,
    variantes: Dict[str, List[float]],
) -> List[dict]:
    """
    constructor(params) -> Proyecto ya armado con esos parametros (ver proyecto.py).
    variantes: {"precio_venta_pct": [-20,-10,0,10,20], "costo_construccion_pct": [-10,0,10,20], ...}
      -- cada valor es un delta porcentual sobre el parametro base homónimo en
      parametros_base. El caller define que significa cada clave (S43: no hardcodear
      valores universales).
    Devuelve una fila por combinacion de variante × valor, con margen/ROI/TIR.
    """
    filas = []
    for variable, valores in variantes.items():
        for delta_pct in valores:
            params = dict(parametros_base)
            base_valor = params.get(variable)
            if base_valor is None:
                raise ValueError(f"'{variable}' no esta en parametros_base")
            params[variable] = base_valor * (1 + delta_pct / 100.0)
            proyecto = constructor(params)
            resultado = proyecto.correr()
            filas.append({
                "variable": variable,
                "delta_pct": delta_pct,
                "valor_parametro": params[variable],
                "margen_usd": resultado.margen_usd,
                "roi_pct": resultado.metricas.roi_pct,
                "tir_anual_pct": resultado.metricas.tir_anual_pct,
            })
    return filas


def buscar_punto_de_equilibrio(
    constructor: Callable[[dict], "Proyecto"],
    parametros_base: dict,
    variable: str,
    rango: tuple,
    tolerancia_usd: float = 100.0,
    max_iter: int = 60,
) -> dict:
    """
    S44 BREAK-EVEN ENGINE -- busca por biseccion el valor de `variable` (dentro de
    `rango`=(min,max)) que hace margen_usd == 0. Sirve tanto para "precio minimo de
    venta" (variable sube -> margen sube) como para "costo maximo de construccion"
    o "precio maximo de terreno" (variable sube -> margen baja) -- el signo se
    detecta automaticamente evaluando los extremos.
    """
    lo, hi = rango

    def margen_en(valor):
        params = dict(parametros_base)
        params[variable] = valor
        return constructor(params).correr().margen_usd

    m_lo, m_hi = margen_en(lo), margen_en(hi)
    if m_lo == 0:
        return {"variable": variable, "valor_equilibrio": lo, "margen_residual": m_lo}
    if m_hi == 0:
        return {"variable": variable, "valor_equilibrio": hi, "margen_residual": m_hi}
    if (m_lo > 0) == (m_hi > 0):
        raise ValueError(
            f"No hay cambio de signo de margen en el rango {rango} para '{variable}' "
            f"(margen en lo={m_lo:.0f}, margen en hi={m_hi:.0f}) -- ampliar el rango"
        )
    creciente = m_hi > m_lo
    for _ in range(max_iter):
        mid = (lo + hi) / 2.0
        m_mid = margen_en(mid)
        if abs(m_mid) < tolerancia_usd:
            return {"variable": variable, "valor_equilibrio": mid, "margen_residual": m_mid}
        if (m_mid > 0) == creciente:
            hi = mid
        else:
            lo = mid
    mid = (lo + hi) / 2.0
    return {"variable": variable, "valor_equilibrio": mid, "margen_residual": margen_en(mid)}


def precio_maximo_terreno_por_roi_objetivo(
    constructor: Callable[[dict], "Proyecto"],
    parametros_base: dict,
    variable_terreno: str,
    roi_objetivos_pct: List[float],
    rango_terreno: tuple,
) -> List[dict]:
    """S45 -- para cada ROI objetivo, el precio de terreno maximo que lo sostiene."""
    resultados = []
    for roi_obj in roi_objetivos_pct:
        lo, hi = rango_terreno

        def roi_en(valor):
            params = dict(parametros_base)
            params[variable_terreno] = valor
            return constructor(params).correr().metricas.roi_pct or 0.0

        m_lo, m_hi = roi_en(lo), roi_en(hi)
        if (m_lo - roi_obj) * (m_hi - roi_obj) > 0:
            resultados.append({"roi_objetivo_pct": roi_obj, "precio_terreno_maximo_usd": None,
                                "nota": "sin cambio de signo en el rango dado"})
            continue
        for _ in range(60):
            mid = (lo + hi) / 2.0
            r_mid = roi_en(mid)
            if abs(r_mid - roi_obj) < 0.01:
                break
            if (r_mid > roi_obj) == (m_hi > roi_obj):
                hi = mid
            else:
                lo = mid
        resultados.append({"roi_objetivo_pct": roi_obj, "precio_terreno_maximo_usd": mid})
    return resultados
