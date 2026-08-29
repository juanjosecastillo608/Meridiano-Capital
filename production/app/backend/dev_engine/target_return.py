"""
Target Return Engine (S44 del prompt maestro).

Regla explicita del founder: el motor no debe limitarse a *reportar* ROI/TIR/
VAN -- tiene que poder decir si un proyecto CUMPLE o NO CUMPLE el umbral que
el inversor exige. Este modulo no recalcula nada: solo compara
financiero.MetricasFinancieras (ya calculado por Proyecto.correr()) contra
umbrales configurables, y nunca contra un numero fijo en codigo (misma regla
S15 que costos.ContingenciaConfig).

Hermano de skills/target-yield-tools (SK-17): aquel resuelve el problema
inverso para alquiler unidad-por-unidad (que renta necesito para tal yield);
este resuelve "esta metrica ya calculada de un proyecto completo cumple el
umbral" -- no se fusionan porque atacan preguntas distintas sobre motores
distintos (ver documentation/development-financial-engine/PHASE_7_SYSTEM_AUDIT.md).
"""

from dataclasses import dataclass
from typing import Optional

from .financiero import MetricasFinancieras

CUMPLE = "CUMPLE"
NO_CUMPLE = "NO CUMPLE"
REQUIERE_NEGOCIACION = "REQUIERE NEGOCIACION"
SIN_UMBRALES_DEFINIDOS = "SIN UMBRALES DEFINIDOS"


@dataclass
class UmbralesObjetivo:
    """Todos opcionales: el inversor puede fijar solo los que le importan."""
    roi_pct_minimo: Optional[float] = None
    tir_anual_pct_minima: Optional[float] = None
    equity_multiple_minimo: Optional[float] = None
    payback_mes_maximo: Optional[int] = None
    # zona gris: si la metrica cae dentro de este margen por debajo del
    # umbral, no se declara NO CUMPLE de una sino REQUIERE NEGOCIACION.
    margen_negociacion_pct: float = 0.0


def _evaluar_metrica_minima(valor: Optional[float], minimo: Optional[float], margen_pct: float):
    """None = umbral no fijado -> no participa del veredicto. Devuelve (cumple: bool|None, detalle: dict)."""
    if minimo is None:
        return None, None
    piso_negociacion = minimo * (1 - margen_pct / 100.0)
    if valor >= minimo:
        estado = CUMPLE
    elif valor >= piso_negociacion:
        estado = REQUIERE_NEGOCIACION
    else:
        estado = NO_CUMPLE
    return estado, {"valor": valor, "umbral_minimo": minimo, "estado": estado}


def _evaluar_metrica_maxima(valor: Optional[float], maximo: Optional[float], margen_pct: float):
    """Para umbrales tipo 'a lo sumo N' (ej. payback). None = no fijado."""
    if maximo is None:
        return None, None
    techo_negociacion = maximo * (1 + margen_pct / 100.0)
    if valor <= maximo:
        estado = CUMPLE
    elif valor <= techo_negociacion:
        estado = REQUIERE_NEGOCIACION
    else:
        estado = NO_CUMPLE
    return estado, {"valor": valor, "umbral_maximo": maximo, "estado": estado}


def evaluar_objetivo(metricas: MetricasFinancieras, umbrales: UmbralesObjetivo) -> dict:
    """
    Compara metricas ya calculadas (financiero.calcular_metricas) contra
    umbrales.py. Devuelve un veredicto por metrica + un veredicto_general:
    NO_CUMPLE si cualquier metrica fijada no cumple, REQUIERE_NEGOCIACION si
    ninguna esta en NO_CUMPLE pero al menos una esta en zona gris, CUMPLE si
    todas las fijadas cumplen, SIN_UMBRALES_DEFINIDOS si no se fijo ninguna.
    """
    detalle = {}
    estados = []

    estado, det = _evaluar_metrica_minima(metricas.roi_pct, umbrales.roi_pct_minimo, umbrales.margen_negociacion_pct)
    if estado is not None:
        detalle["roi_pct"] = det
        estados.append(estado)

    estado, det = _evaluar_metrica_minima(
        metricas.tir_anual_pct, umbrales.tir_anual_pct_minima, umbrales.margen_negociacion_pct
    )
    if estado is not None:
        detalle["tir_anual_pct"] = det
        estados.append(estado)

    estado, det = _evaluar_metrica_minima(
        metricas.equity_multiple, umbrales.equity_multiple_minimo, umbrales.margen_negociacion_pct
    )
    if estado is not None:
        detalle["equity_multiple"] = det
        estados.append(estado)

    estado, det = _evaluar_metrica_maxima(
        metricas.payback_mes, umbrales.payback_mes_maximo, umbrales.margen_negociacion_pct
    )
    if estado is not None:
        detalle["payback_mes"] = det
        estados.append(estado)

    if not estados:
        veredicto_general = SIN_UMBRALES_DEFINIDOS
    elif NO_CUMPLE in estados:
        veredicto_general = NO_CUMPLE
    elif REQUIERE_NEGOCIACION in estados:
        veredicto_general = REQUIERE_NEGOCIACION
    else:
        veredicto_general = CUMPLE

    return {"veredicto_general": veredicto_general, "detalle": detalle}
