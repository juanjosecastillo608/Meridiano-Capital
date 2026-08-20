"""
Monthly Project Cash Flow Engine (S31-S36 del prompt maestro).

Unidad temporal: MES. Cada mes tiene ingresos (preventas/cuotas/ventas/saldo) y
egresos (terreno/obra/indirectos/comerciales/impuestos), y el modulo calcula el
flujo neto, el acumulado, y la Peak Capital Requirement (S36) -- el capital maximo
que el proyecto necesita antes de empezar a recuperar dinero.

Reutiliza construir_cronograma() de calculadora.py para el cronograma de pagos de
cada venta (S31 Regla de no duplicacion, S71) -- no reimplementa esa logica.
"""

import sys
from dataclasses import dataclass, field
from typing import List, Optional
import os

# Reutiliza la logica ya validada de calculadora.py (no duplicar, S71)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from calculadora import construir_cronograma  # noqa: E402


@dataclass
class VentaUnidad:
    """Una venta modelada para el cash flow de ingresos (S28-S30)."""
    identificador: str
    mes_venta: int              # mes (0-indexado) en que se firma/reserva
    precio_usd: float
    anticipo_pct: float
    meses_cuotas: int           # cuotas mensuales iguales durante este tramo
    saldo_entrega_pct: float = 0.0   # balloon pagado en el ultimo mes de cuotas
    etapa: str = "pozo"         # preventa | pozo | obra | avanzado | terminado (S23)


def curva_gasto_obra(costo_total_usd: float, meses_obra: int, forma: str = "s_curve") -> List[float]:
    """
    Distribuye el costo total de obra en meses_obra meses (S33 Construction Spending
    Curve). forma="lineal": partes iguales. forma="s_curve": arranca y termina mas
    lento, pico a mitad de obra (patron real de curva de inversion de construccion).
    """
    if meses_obra <= 0:
        return []
    if forma == "lineal":
        return [costo_total_usd / meses_obra] * meses_obra
    if forma == "s_curve":
        # Curva triangular normalizada (pico en la mitad) como aproximacion simple,
        # explicita y auditable de una curva S -- evita "inventar" una formula opaca.
        pesos = []
        mitad = meses_obra / 2.0
        for m in range(meses_obra):
            x = m + 0.5
            peso = x if x <= mitad else (meses_obra - x)
            pesos.append(peso)
        total_pesos = sum(pesos)
        return [costo_total_usd * (p / total_pesos) for p in pesos]
    raise ValueError(f"forma '{forma}' no soportada (usar 'lineal' o 's_curve')")


def flujo_ventas_usd(ventas: List[VentaUnidad], horizonte_meses: int) -> List[float]:
    """S34 SALES CASH FLOW -- suma el cronograma de pago de cada venta, mes a mes."""
    flujo = [0.0] * horizonte_meses
    for v in ventas:
        pagos = construir_cronograma(v.precio_usd, v.anticipo_pct, v.meses_cuotas, v.saldo_entrega_pct)
        for i, monto in enumerate(pagos):
            mes = v.mes_venta + i
            if 0 <= mes < horizonte_meses:
                flujo[mes] += monto
    return flujo


@dataclass
class FlujoDeFondos:
    """
    S31 MONTHLY PROJECT CASH FLOW. Todas las listas deben tener longitud == meses.
    Los egresos financieros NO estan acá -- se calculan en financiamiento.py sobre
    el flujo_operativo() de este objeto (S12: nunca independiente del flujo real).
    """
    meses: int
    egreso_terreno: List[float] = field(default_factory=list)
    egreso_obra: List[float] = field(default_factory=list)
    egreso_indirectos: List[float] = field(default_factory=list)
    egreso_comerciales: List[float] = field(default_factory=list)
    egreso_impuestos: List[float] = field(default_factory=list)
    ingreso_ventas: List[float] = field(default_factory=list)

    def __post_init__(self):
        for nombre in ("egreso_terreno", "egreso_obra", "egreso_indirectos",
                       "egreso_comerciales", "egreso_impuestos", "ingreso_ventas"):
            lista = getattr(self, nombre)
            if not lista:
                setattr(self, nombre, [0.0] * self.meses)
            elif len(lista) != self.meses:
                raise ValueError(f"{nombre} tiene {len(lista)} meses, se esperaban {self.meses}")

    def egresos_totales_mes(self) -> List[float]:
        return [
            t + o + ind + com + imp
            for t, o, ind, com, imp in zip(
                self.egreso_terreno, self.egreso_obra, self.egreso_indirectos,
                self.egreso_comerciales, self.egreso_impuestos,
            )
        ]

    def flujo_operativo(self) -> List[float]:
        """Ingresos - egresos operativos, SIN costos financieros (insumo de financiamiento.py)."""
        egresos = self.egresos_totales_mes()
        return [ing - eg for ing, eg in zip(self.ingreso_ventas, egresos)]

    @staticmethod
    def acumulado(flujo: List[float]) -> List[float]:
        acc, s = [], 0.0
        for f in flujo:
            s += f
            acc.append(s)
        return acc

    def peak_capital_requirement(self, flujo_neto: Optional[List[float]] = None) -> dict:
        """S36 -- capital maximo que el proyecto necesita antes de recuperar dinero."""
        flujo = flujo_neto if flujo_neto is not None else self.flujo_operativo()
        acumulado = self.acumulado(flujo)
        if not acumulado:
            return {"monto_usd": 0.0, "mes": None}
        minimo = min(acumulado)
        mes = acumulado.index(minimo)
        return {"monto_usd": max(0.0, -minimo), "mes": mes}

    def resumen_mensual(self, flujo_neto: List[float]) -> List[dict]:
        egresos = self.egresos_totales_mes()
        acumulado = self.acumulado(flujo_neto)
        filas = []
        for m in range(self.meses):
            filas.append({
                "mes": m,
                "egreso_terreno": self.egreso_terreno[m],
                "egreso_obra": self.egreso_obra[m],
                "egreso_indirectos": self.egreso_indirectos[m],
                "egreso_comerciales": self.egreso_comerciales[m],
                "egreso_impuestos": self.egreso_impuestos[m],
                "egresos_totales": egresos[m],
                "ingreso_ventas": self.ingreso_ventas[m],
                "flujo_neto": flujo_neto[m],
                "flujo_acumulado": acumulado[m],
            })
        return filas
