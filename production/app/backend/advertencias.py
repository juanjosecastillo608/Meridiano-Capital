#!/usr/bin/env python3
"""
Advertencias de integridad de datos sobre los resultados de la Calculadora.

Compartido entre server.py (API HTTP) y skills/rentabilidad-calculator/
(uso en lenguaje natural) para no duplicar el texto en dos lugares.

Ver governance/decisions/DECISION_REGISTER.md:
  - D-001 fue RESUELTA por el founder el 2026-08-02 (IVA diferenciado por
    clase/operacion) -> implementada como D-027.
  - D-002 fue RESUELTA por el founder el 2026-08-09 (pisos y techos siempre
    en BRUTO) -> implementada como D-033. El MECANISMO ya compara bruto vs
    bruto; los VALORES numericos de piso son provisionales hasta que la
    matriz por zona/calidad (P-004, knowledge-base/investment/05-matriz-
    pisos-techos.md) este completa. Se muestra siempre junto a cualquier
    resultado de renta para que nadie tome el veredicto pasa_piso como final
    sin revisar.
"""

NOTA_IVA_RESUELTA = (
    "IVA aplicado: {iva}% ({detalle}). Regla confirmada por el founder el "
    "2026-08-02 (resuelve D-001): alquiler comercial 10%, alquiler residencial 5%, "
    "venta 5%. Ver governance/decisions/DECISION_REGISTER.md#D-001."
)
NOTA_IVA_TEMPORAL_EXTENSION = (
    "Esta clase es renta temporal (Urbannit). Se le aplico el IVA residencial (5%) "
    "por defecto -- no fue confirmado explicitamente para renta temporal/turistica, "
    "que en Paraguay puede tener tratamiento distinto. Marcado [EXTENSION]: "
    "confirmar con contadora antes de uso en firme."
)
ADVERTENCIA_PISOS = (
    "Piso comparado en BRUTO (resuelve D-002, confirmado por el founder el "
    "2026-08-09 como D-033: pisos y techos siempre en bruto). PERO el valor "
    "numerico del piso (pisos_renta_neta) todavia NO fue recalibrado para bruto "
    "-- son los mismos numeros pensados originalmente para comparacion neta, asi "
    "que casi cualquier propiedad va a 'pasar el piso' hasta que la matriz real "
    "por zona/calidad este lista. No usar 'pasa_piso' para decisiones reales "
    "todavia. Ver knowledge-base/investment/05-matriz-pisos-techos.md (P-004) y "
    "governance/decisions/DECISION_REGISTER.md#D-033."
)

ADVERTENCIAS_VENTA = [
    (
        "IVA de venta aplicado: 5% sobre el valor de salida/cesion, confirmado por el "
        "founder el 2026-08-02 (resuelve D-001 para venta). La BASE de calculo (precio "
        "total vs. solo el margen) es una interpretacion [EXTENSION] -- confirmar con "
        "contadora. Las cifras '_neto_iva' son adicionales; las originales (brutas, sin "
        "IVA) se preservan sin cambios para no alterar los casos ya auditados "
        "(Habitalis 9A, Edificio Austria)."
    ),
]


def advertencias_renta(calc, clase):
    """Advertencias para un resultado de evaluar_renta(). calc: instancia de Calculadora."""
    iva_pct = calc.iva_alquiler_pct(clase)
    detalle = "comercial" if clase == "comercial" else "residencial"
    advertencias = [NOTA_IVA_RESUELTA.format(iva=iva_pct, detalle=detalle)]
    if clase.startswith("temporal"):
        advertencias.append(NOTA_IVA_TEMPORAL_EXTENSION)
    advertencias.append(ADVERTENCIA_PISOS)
    return advertencias


def advertencias_venta():
    """Advertencias para un resultado de evaluar_reventa() / evaluar_reventa_temprana()."""
    return list(ADVERTENCIAS_VENTA)
