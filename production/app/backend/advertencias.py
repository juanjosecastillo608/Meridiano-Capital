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
    bruto. Desde D-044 (2026-08-10) los VALORES numericos de piso tambien
    son datos reales (Tabla de Rentabilidades Alquiler.xlsx) para comercial,
    casa, departamento sin/con muebles y Airbnb -- sigue pendiente el piso
    de "casa Airbnb" (sin dato real) y la matriz por zona/calidad (P-004,
    knowledge-base/investment/05-matriz-pisos-techos.md), que sigue
    incompleta. Se muestra siempre junto a cualquier resultado de renta.
"""

NOTA_IVA_RESUELTA = (
    "IVA aplicado: {iva}% ({detalle}). Regla confirmada por el founder el "
    "2026-08-02 (resuelve D-001): alquiler comercial 10%, alquiler residencial 5%, "
    "venta 5%. Ver governance/decisions/DECISION_REGISTER.md#D-001."
)
NOTA_IVA_TEMPORAL_EXTENSION = (
    "Esta clase es renta temporal (Urbannit). Se le aplica IVA 10%, confirmado "
    "por el founder el 2026-08-10 (D-045) -- reemplaza la inferencia anterior "
    "que usaba el 5% residencial por defecto. Ver governance/decisions/"
    "DECISION_REGISTER.md#D-045."
)
ADVERTENCIA_PISOS = (
    "Piso comparado en BRUTO (resuelve D-002, D-033). Desde D-044/D-045 "
    "(2026-08-10) el piso numerico de las 6 clases ('comercial', "
    "'residencial_casa', 'departamento_sin_muebles', 'departamento_amoblado', "
    "'temporal_departamento', 'temporal_casa') es un dato confirmado por el "
    "founder -- 'temporal_casa' se fijo igual a 'temporal_departamento' (15%), "
    "sin diferenciacion casa/depto en renta temporal. Pendiente, sin trabajo "
    "activo hasta nuevo dato: la matriz por zona/calidad (P-004) mas alla de "
    "la zona Eje Corporativo. Ver knowledge-base/investment/05-matriz-pisos-"
    "techos.md y governance/decisions/DECISION_REGISTER.md#D-045."
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
    if clase == "comercial":
        detalle = "comercial"
    elif clase.startswith("temporal"):
        detalle = "renta temporal/Airbnb"
    else:
        detalle = "residencial"
    advertencias = [NOTA_IVA_RESUELTA.format(iva=iva_pct, detalle=detalle)]
    if clase.startswith("temporal"):
        advertencias.append(NOTA_IVA_TEMPORAL_EXTENSION)
    advertencias.append(ADVERTENCIA_PISOS)
    return advertencias


def advertencias_venta():
    """Advertencias para un resultado de evaluar_reventa() / evaluar_reventa_temprana()."""
    return list(ADVERTENCIAS_VENTA)
