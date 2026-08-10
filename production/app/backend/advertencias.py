#!/usr/bin/env python3
"""
Advertencias de integridad de datos sobre los resultados de la Calculadora.

Compartido entre server.py (API HTTP) y skills/rentabilidad-calculator/
(uso en lenguaje natural) para no duplicar el texto en dos lugares.

Ver governance/decisions/DECISION_REGISTER.md:
  - D-001/D-045 RESUELTAS (IVA diferenciado: comercial 10%, residencial 5%,
    renta temporal/Airbnb 10%) -> D-027 (2026-08-02) + D-045 (2026-08-10).
  - D-002/D-044/D-045 RESUELTAS (pisos y techos siempre en BRUTO, con
    valores reales para las 6 clases del motor, incluida "casa Airbnb" =
    "depto Airbnb") -> D-033 (mecanismo) + D-044/D-045 (valores, 2026-08-10).
    Sigue pendiente, deliberadamente sin trabajo activo, la matriz por
    zona/calidad (P-004, knowledge-base/investment/05-matriz-pisos-techos.md).
  - D-003/D-046 RESUELTA por el founder el 2026-08-10 (aplicar la ocupacion
    realista 55-65% en la rama de renta temporal de evaluar_renta(), en vez
    del vacancia_pct generico de 3% pensado para renta tradicional) ->
    implementada como D-046. Baja materialmente el yield neto reportado para
    temporal_departamento/temporal_casa frente al calculo anterior.
Se muestra siempre junto a cualquier resultado de renta.
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

NOTA_OCUPACION_TEMPORAL = (
    "Ocupacion real aplicada: {ocupacion}%. Regla confirmada por el founder el "
    "2026-08-10 (D-003/D-046): la renta temporal usa la brecha de ocupacion "
    "REAL (55-65%, nunca 90%+) como vacancia, no el 3% generico de renta "
    "tradicional. Si no se paso 'ocupacion_pct' explicito, se uso el punto "
    "medio del rango realista (60%) -- pasar el dato real de ocupacion del "
    "activo especifico si se conoce. Ver governance/decisions/"
    "DECISION_REGISTER.md#D-046."
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


def advertencias_renta(calc, clase, resultado=None):
    """
    Advertencias para un resultado de evaluar_renta().
    calc: instancia de Calculadora. resultado: dict devuelto por
    evaluar_renta() (opcional, permite reportar la ocupacion real usada).
    """
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
        ocupacion = resultado.get("ocupacion_pct") if resultado else None
        if ocupacion is None:
            rango = calc.p["renta_temporal_default"]["ocupacion_realista_pct"]
            ocupacion = sum(rango) / len(rango)
        advertencias.append(NOTA_OCUPACION_TEMPORAL.format(ocupacion=ocupacion))
    advertencias.append(ADVERTENCIA_PISOS)
    return advertencias


def advertencias_venta():
    """Advertencias para un resultado de evaluar_reventa() / evaluar_reventa_temprana()."""
    return list(ADVERTENCIAS_VENTA)
