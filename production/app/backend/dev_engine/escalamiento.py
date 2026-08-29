"""
Price Escalation Engine (S24-S25 del prompt maestro).

Regla explicita del founder: el precio de venta NO es un numero fijo durante
toda la vida del proyecto -- sube por etapa comercial (preventa -> pozo ->
obra -> terminado). Este motor NO inventa una tasa nueva: lee el mismo
parametro que ya existia en config/parametros_dev_engine.json
("escalamiento_precio_por_etapa_pct_default"), que hasta ahora ningun modulo
de dev_engine consumia todavia.

Reutiliza el campo `etapa` que VentaUnidad (cashflow.py) ya tiene desde su
creacion -- este motor no agrega un campo nuevo, solo le da uso.
"""

from dataclasses import dataclass
from typing import Dict, List


ORDEN_ETAPAS = ["preventa", "pozo", "obra", "terminado"]


@dataclass
class Etapa:
    nombre: str                 # "preventa" | "pozo" | "obra" | "terminado"
    escalamiento_acumulado_pct: float  # % acumulado sobre el precio de "preventa" (0.0 para la primera etapa)


def etapas_default(config_escalamiento: Dict[str, float]) -> List[Etapa]:
    """
    Arma la cadena de 4 etapas a partir de escalamiento_precio_por_etapa_pct_default
    (config/parametros_dev_engine.json), acumulando los saltos entre etapas
    consecutivas. No hay tasa universal fija en codigo (misma regla S15 que
    costos.ContingenciaConfig).

    config_escalamiento esperado: {"preventa_a_pozo": 5.0, "pozo_a_obra": 5.0,
    "obra_a_terminado": 8.0}
    """
    saltos = [
        0.0,
        config_escalamiento.get("preventa_a_pozo", 0.0),
        config_escalamiento.get("pozo_a_obra", 0.0),
        config_escalamiento.get("obra_a_terminado", 0.0),
    ]
    acumulado = 0.0
    etapas = []
    for nombre, salto_pct in zip(ORDEN_ETAPAS, saltos):
        acumulado += salto_pct
        etapas.append(Etapa(nombre=nombre, escalamiento_acumulado_pct=acumulado))
    return etapas


def precio_en_etapa(precio_base_preventa_usd: float, etapa: str, etapas: List[Etapa]) -> float:
    """Precio de lista para una unidad vendida en `etapa`, a partir del precio de preventa."""
    if etapa not in ORDEN_ETAPAS:
        raise ValueError(f"Etapa '{etapa}' invalida. Debe ser una de {ORDEN_ETAPAS}")
    fila = next(e for e in etapas if e.nombre == etapa)
    return precio_base_preventa_usd * (1 + fila.escalamiento_acumulado_pct / 100.0)


def matriz_precios_por_etapa(precio_base_preventa_usd: float, etapas: List[Etapa]) -> Dict[str, float]:
    """S24 -- matriz de precio por etapa, para mostrar en el Investor Book."""
    return {e.nombre: round(precio_en_etapa(precio_base_preventa_usd, e.nombre, etapas), 2) for e in etapas}


def aplicar_escalamiento_a_ventas(ventas: list, precio_base_preventa_usd: float, etapas: List[Etapa]) -> list:
    """
    Devuelve una copia de `ventas` (lista de cashflow.VentaUnidad) con
    `precio_usd` recalculado segun la etapa de cada unidad (campo `etapa`,
    ya existente en VentaUnidad). No muta la lista original.
    """
    from dataclasses import replace

    return [
        replace(v, precio_usd=precio_en_etapa(precio_base_preventa_usd, v.etapa, etapas))
        for v in ventas
    ]
