"""
Inflation Engine (S26-S27 del prompt maestro).

Regla explicita del founder: la inflacion NO es una sola tasa universal --
"construccion" (materiales + mano de obra en el sitio) se mueve distinto que
el "costo de vida general" que erosiona el precio de venta real. Nunca una
tasa fija en codigo (misma regla S15 que costos.ContingenciaConfig):
las 4 tasas vienen de config/parametros_dev_engine.json o de
knowledge-base/investment/market-intelligence/ (SK-11), nunca hardcodeadas
aca.

Proyecta valores nominales mes a mes con capitalizacion compuesta mensual
equivalente a la tasa anual dada -- mismo patron que
financiamiento.tasa_mensual_equivalente(), para no introducir una segunda
formula de conversion anual->mensual en el repo.
"""

from dataclasses import dataclass


@dataclass
class TasasInflacion:
    general_anual_pct: float = 0.0        # costo de vida / poder adquisitivo del comprador
    construccion_anual_pct: float = 0.0   # costo directo de obra en su conjunto
    materiales_anual_pct: float = 0.0     # subcomponente de construccion, cuando se quiere aislar
    mano_de_obra_anual_pct: float = 0.0   # subcomponente de construccion, cuando se quiere aislar


def _tasa_mensual_equivalente(tasa_anual_pct: float) -> float:
    """Misma formula que financiamiento.tasa_mensual_equivalente -- no se duplica el import
    para evitar un acoplamiento circular; es una unica linea, no logica de negocio nueva."""
    return (1.0 + tasa_anual_pct / 100.0) ** (1.0 / 12.0) - 1.0


def proyectar_valor(valor_base: float, tasa_anual_pct: float, meses_desde_base: int) -> float:
    """Valor nominal de `valor_base` luego de `meses_desde_base` meses de inflacion compuesta."""
    if meses_desde_base <= 0:
        return valor_base
    tasa_m = _tasa_mensual_equivalente(tasa_anual_pct)
    return valor_base * (1 + tasa_m) ** meses_desde_base


def proyectar_costo_directo(costo_base_usd: float, tasas: TasasInflacion, meses_desde_base: int) -> float:
    """Costo directo de obra proyectado, usando la tasa de construccion (no la general)."""
    return proyectar_valor(costo_base_usd, tasas.construccion_anual_pct, meses_desde_base)


def proyectar_materiales(costo_base_usd: float, tasas: TasasInflacion, meses_desde_base: int) -> float:
    return proyectar_valor(costo_base_usd, tasas.materiales_anual_pct, meses_desde_base)


def proyectar_mano_de_obra(costo_base_usd: float, tasas: TasasInflacion, meses_desde_base: int) -> float:
    return proyectar_valor(costo_base_usd, tasas.mano_de_obra_anual_pct, meses_desde_base)


def proyectar_precio_venta(precio_base_usd: float, tasas: TasasInflacion, meses_desde_base: int) -> float:
    """Precio de venta erosionado/ajustado por inflacion general -- distinto del
    Price Escalation Engine (escalamiento.py), que sube el precio por etapa
    comercial y no por paso del tiempo/inflacion macro. Ambos son componibles:
    aplicar primero escalamiento.precio_en_etapa() y despues esta funcion."""
    return proyectar_valor(precio_base_usd, tasas.general_anual_pct, meses_desde_base)


def curva_costo_directo_mensual(costo_base_usd_por_mes: list, tasas: TasasInflacion) -> list:
    """
    Dada una curva de egreso de obra ya distribuida en el tiempo (ej. la que
    devuelve cashflow.curva_gasto_obra(), en USD constantes), devuelve la
    misma curva en USD nominales, con cada mes `i` inflado `i` meses desde
    el inicio de obra (mes 0 = sin inflacion todavia).
    """
    return [proyectar_costo_directo(monto, tasas, i) for i, monto in enumerate(costo_base_usd_por_mes)]
