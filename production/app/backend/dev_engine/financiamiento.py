"""
Financing Cost Engine (S12 del prompt maestro).

Regla explicita del founder: "El costo financiero debe estar conectado al flujo de
fondos. No calcular intereses independientemente del flujo real." Este motor NO
aplica una tasa sobre un monto fijo -- gira deuda mes a mes solo cuando el capital
propio ya se agoto y el flujo operativo es negativo, acumula interes sobre el saldo
realmente adeudado, y amortiza con el primer flujo positivo disponible (ventas).
"""

from dataclasses import dataclass
from typing import List


@dataclass
class TerminosFinanciamiento:
    capital_propio_usd: float
    tasa_anual_pct: float
    comision_apertura_pct: float = 0.0   # sobre cada desembolso girado
    periodo_gracia_meses: int = 0        # meses sin exigir repago aunque haya caja positiva
    plazo_maximo_meses: int = None       # None = sin tope explicito (se paga cuando hay caja)


def tasa_mensual_equivalente(tasa_anual_pct: float) -> float:
    """Tasa efectiva mensual equivalente a la tasa anual nominal efectiva dada."""
    return (1.0 + tasa_anual_pct / 100.0) ** (1.0 / 12.0) - 1.0


def calcular_financiamiento(flujo_operativo: List[float], terminos: TerminosFinanciamiento) -> dict:
    """
    flujo_operativo[i] = ingresos - egresos operativos del mes i (SIN financieros),
    de FlujoDeFondos.flujo_operativo(). Determina, mes a mes:
      1) si el flujo es negativo, se cubre primero con capital propio remanente;
      2) lo que sobra (si el equity ya se agoto) se gira como deuda;
      3) el interes se acumula sobre saldo de deuda realmente adeudado ese mes;
      4) si el flujo es positivo y hay deuda, se amortiza automaticamente (salvo
         en periodo de gracia).
    Devuelve series mensuales + totales, listas para inyectar en costos.py y en
    el flujo neto final (financiero.py).
    """
    n = len(flujo_operativo)
    tasa_m = tasa_mensual_equivalente(terminos.tasa_anual_pct)

    saldo_deuda = 0.0
    equity_disponible = terminos.capital_propio_usd
    equity_usado_acum = 0.0

    interes_mensual = [0.0] * n
    deuda_girada_mensual = [0.0] * n
    amortizacion_mensual = [0.0] * n
    saldo_deuda_mensual = [0.0] * n
    equity_usado_mensual = [0.0] * n
    comision_total = 0.0

    for m in range(n):
        # 1) interes sobre saldo adeudado al cierre del mes anterior
        interes = saldo_deuda * tasa_m
        interes_mensual[m] = interes
        saldo_deuda += interes  # capitalizado hasta que haya caja para pagarlo

        flujo = flujo_operativo[m]
        if flujo < 0:
            necesidad = -flujo
            uso_equity = min(equity_disponible, necesidad)
            equity_disponible -= uso_equity
            equity_usado_acum += uso_equity
            equity_usado_mensual[m] = uso_equity
            faltante = necesidad - uso_equity
            if faltante > 1e-9:
                deuda_girada_mensual[m] = faltante
                saldo_deuda += faltante
                comision_total += faltante * terminos.comision_apertura_pct / 100.0
        elif flujo > 0 and saldo_deuda > 0 and m >= terminos.periodo_gracia_meses:
            pago = min(flujo, saldo_deuda)
            amortizacion_mensual[m] = pago
            saldo_deuda -= pago

        saldo_deuda_mensual[m] = saldo_deuda

    return {
        "interes_mensual": interes_mensual,
        "interes_total_usd": sum(interes_mensual),
        "comision_apertura_total_usd": comision_total,
        "costo_financiero_total_usd": sum(interes_mensual) + comision_total,
        "deuda_girada_mensual": deuda_girada_mensual,
        "deuda_girada_acumulada_usd": sum(deuda_girada_mensual),
        "amortizacion_mensual": amortizacion_mensual,
        "saldo_deuda_mensual": saldo_deuda_mensual,
        "pico_deuda_usd": max(saldo_deuda_mensual) if saldo_deuda_mensual else 0.0,
        "equity_usado_mensual": equity_usado_mensual,
        "equity_usado_total_usd": equity_usado_acum,
        "equity_no_usado_usd": max(0.0, equity_disponible),
        "saldo_deuda_final_usd": saldo_deuda,  # si > 0 al final, el proyecto no terminó de pagar la deuda con su propia caja
    }
