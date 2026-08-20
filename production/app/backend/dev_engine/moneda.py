"""
Capa de moneda del Development Financial Engine.

Paraguay: costos de construccion/mano de obra/tasas municipales a veces vienen en
guaranies (PYG); el precio de venta SIEMPRE se expresa en USD (D-045, D-063 y todo
el caso HERRERA-001). Este modulo normaliza cualquier monto a USD para que el resto
del motor trabaje en una sola moneda, sin mezclar nunca PYG y USD sin conversion
explicita (S53 del prompt maestro).

El tipo de cambio es un PARAMETRO versionado (valor + fecha + fuente), igual que
cualquier otro dato del sistema -- nunca un numero hardcodeado dentro de una formula.
"""

from dataclasses import dataclass, field

MONEDAS_VALIDAS = ("USD", "PYG")


@dataclass(frozen=True)
class TipoDeCambio:
    """PYG por 1 USD. Versionado: toda corrida del motor debe declarar cual usa."""
    valor: float          # ej. 7300.0 = 1 USD -> 7300 PYG
    fecha: str             # "2026-08-19"
    fuente: str            # ej. "BCP (Banco Central del Paraguay), cotizacion referencial"

    def __post_init__(self):
        if self.valor <= 0:
            raise ValueError(f"Tipo de cambio invalido: {self.valor}")


@dataclass(frozen=True)
class Monto:
    """Un valor monetario con su moneda nativa explicita. Nunca un float suelto."""
    valor: float
    moneda: str = "USD"

    def __post_init__(self):
        if self.moneda not in MONEDAS_VALIDAS:
            raise ValueError(
                f"Moneda '{self.moneda}' no soportada -- usar una de {MONEDAS_VALIDAS}"
            )


class ConversorMoneda:
    """Normaliza cualquier Monto a USD usando un TipoDeCambio dado."""

    def __init__(self, tipo_cambio: TipoDeCambio):
        self.tipo_cambio = tipo_cambio

    def a_usd(self, monto) -> float:
        """Acepta un Monto, o un float/int (asumido ya en USD, para compatibilidad)."""
        if isinstance(monto, (int, float)):
            return float(monto)
        if monto.moneda == "USD":
            return monto.valor
        if monto.moneda == "PYG":
            return monto.valor / self.tipo_cambio.valor
        raise ValueError(f"Moneda no soportada: {monto.moneda}")

    def a_pyg(self, monto) -> float:
        if isinstance(monto, (int, float)):
            monto = Monto(monto, "USD")
        if monto.moneda == "PYG":
            return monto.valor
        if monto.moneda == "USD":
            return monto.valor * self.tipo_cambio.valor
        raise ValueError(f"Moneda no soportada: {monto.moneda}")

    def resumen(self) -> dict:
        return {
            "tipo_cambio_pyg_por_usd": self.tipo_cambio.valor,
            "fecha": self.tipo_cambio.fecha,
            "fuente": self.tipo_cambio.fuente,
        }
