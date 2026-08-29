"""
Integracion con market-price-validation (SK-13) -- S20/S26 del prompt maestro.

Regla explicita del founder (S51, "unica fuente de verdad"): dev_engine no
duplica la logica de comparables de mercado -- la LEE del Skill SK-13 ya
existente (skills/market-price-validation/validar.py), que a su vez lee
knowledge-base/investment/market-intelligence/comparables/. Este archivo es
puramente un puente de import; toda la logica de filtrado IQR y clasificacion
vive en un unico lugar (SK-13).

Valida el precio de venta ASUMIDO por el proyecto (precio_usd/m2 de las
VentaUnidad, o el precio base de escalamiento.py) contra el rango de mercado
real -- distinto de calidad_datos.py, que valida consistencia INTERNA de los
datos, no su realismo contra el mercado.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / "skills" / "market-price-validation"))
from validar import validar_precio  # noqa: E402


def validar_precio_venta_vs_mercado(barrio: str, precio_usd_m2: float, tipologia: str = None) -> dict:
    """
    Envoltorio fino sobre SK-13 para uso desde dev_engine. Devuelve tal cual
    lo que valida_precio() de SK-13 devuelve (BELOW MARKET / MARKET /
    ABOVE MARKET / SIGNIFICANTLY ABOVE MARKET / SIN COMPARABLES) -- no se
    reinterpreta el veredicto aca.
    """
    return validar_precio(barrio, precio_usd_m2, tipologia)


def validar_precio_de_venta_del_proyecto(barrio: str, superficie_vendible_m2: float, precio_total_venta_usd: float, tipologia: str = None) -> dict:
    """
    Conveniencia para el caso de uso mas comun en dev_engine: se tiene un
    precio TOTAL de venta (VentaUnidad.precio_usd) y una superficie, no un
    USD/m2 directo. Deriva el USD/m2 (S18: denominador explicito) y delega en
    validar_precio_venta_vs_mercado().
    """
    if not superficie_vendible_m2 or superficie_vendible_m2 <= 0:
        return {
            "resultado": "SIN COMPARABLES",
            "nota": "superficie_vendible_m2 invalida ({}), no se puede derivar USD/m2".format(superficie_vendible_m2),
        }
    precio_usd_m2 = precio_total_venta_usd / superficie_vendible_m2
    return validar_precio_venta_vs_mercado(barrio, precio_usd_m2, tipologia)
