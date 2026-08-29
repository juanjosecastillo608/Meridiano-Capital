"""
Data Quality Engine (S19-S20 del prompt maestro).

Regla explicita del founder: el motor no debe confiar ciegamente en los datos
de entrada -- tiene que poder decirle al usuario "MODEL ERROR: ..." cuando
algo no cierra, antes de que el error se propague a TIR/VAN/Investor Book.
Este modulo solo valida estructuras que YA existen en dev_engine (Superficies,
EstructuraCostos, VentaUnidad, FlujoDeFondos) -- no define entidades nuevas.

Cada validar_* devuelve una lista de strings "MODEL ERROR: ..." (vacia si no
hay errores) para que el llamador decida que hacer (log, abortar, mostrar en
dashboard.py).
"""

from typing import List

from .moneda import ConversorMoneda
from .costos import Superficies, EstructuraCostos
from .cashflow import VentaUnidad, FlujoDeFondos

ETAPAS_VALIDAS = {"preventa", "pozo", "obra", "terminado"}


def validar_superficies(sup: Superficies) -> List[str]:
    """S18 -- ninguna superficie negativa; vendible/comun no pueden superar la construida."""
    errores = []
    campos_no_negativos = {
        "terreno_m2": sup.terreno_m2,
        "construida_m2": sup.construida_m2,
        "vendible_m2": sup.vendible_m2,
        "comun_m2": sup.comun_m2,
        "cubierta_m2": sup.cubierta_m2,
        "semicubierta_m2": sup.semicubierta_m2,
        "ponderada_m2": sup.ponderada_m2,
    }
    for nombre, valor in campos_no_negativos.items():
        if valor is not None and valor < 0:
            errores.append(f"MODEL ERROR: Superficies.{nombre} es negativo ({valor})")

    if sup.vendible_m2 > sup.construida_m2:
        errores.append(
            f"MODEL ERROR: vendible_m2 ({sup.vendible_m2}) no puede superar construida_m2 ({sup.construida_m2})"
        )
    if sup.comun_m2 > sup.construida_m2:
        errores.append(
            f"MODEL ERROR: comun_m2 ({sup.comun_m2}) no puede superar construida_m2 ({sup.construida_m2})"
        )
    if sup.ponderada_m2 is not None and sup.ponderada_m2 > sup.construida_m2:
        errores.append(
            f"MODEL ERROR: ponderada_m2 ({sup.ponderada_m2}) no puede superar construida_m2 ({sup.construida_m2})"
        )
    return errores


def validar_ventas(ventas: List[VentaUnidad]) -> List[str]:
    """Cada VentaUnidad debe tener campos consistentes (identificador, no unidad_id)."""
    errores = []
    identificadores_vistos = set()
    for v in ventas:
        if v.identificador in identificadores_vistos:
            errores.append(f"MODEL ERROR: identificador de venta duplicado: '{v.identificador}'")
        identificadores_vistos.add(v.identificador)

        if v.precio_usd <= 0:
            errores.append(f"MODEL ERROR: venta '{v.identificador}' tiene precio_usd <= 0 ({v.precio_usd})")
        if v.mes_venta < 0:
            errores.append(f"MODEL ERROR: venta '{v.identificador}' tiene mes_venta negativo ({v.mes_venta})")
        if not (0.0 <= v.anticipo_pct <= 100.0):
            errores.append(
                f"MODEL ERROR: venta '{v.identificador}' tiene anticipo_pct fuera de [0,100] ({v.anticipo_pct})"
            )
        if not (0.0 <= v.saldo_entrega_pct <= 100.0):
            errores.append(
                f"MODEL ERROR: venta '{v.identificador}' tiene saldo_entrega_pct fuera de [0,100] ({v.saldo_entrega_pct})"
            )
        if v.anticipo_pct + v.saldo_entrega_pct > 100.0:
            errores.append(
                f"MODEL ERROR: venta '{v.identificador}' tiene anticipo_pct + saldo_entrega_pct > 100 "
                f"({v.anticipo_pct} + {v.saldo_entrega_pct})"
            )
        if v.meses_cuotas < 0:
            errores.append(f"MODEL ERROR: venta '{v.identificador}' tiene meses_cuotas negativo ({v.meses_cuotas})")
        if v.etapa not in ETAPAS_VALIDAS:
            errores.append(
                f"MODEL ERROR: venta '{v.identificador}' tiene etapa '{v.etapa}' invalida (debe ser una de {sorted(ETAPAS_VALIDAS)})"
            )
    return errores


def validar_estructura_costos(
    estructura: EstructuraCostos, conversor: ConversorMoneda, ingresos_totales_usd: float = 0.0
) -> List[str]:
    """Ningun grupo de costos puede resultar en un total negativo."""
    errores = []
    try:
        total = estructura.costo_total_sin_financieros_usd(conversor, ingresos_totales_usd)
    except Exception as exc:  # cualquier fallo aca ya es en si un MODEL ERROR
        return [f"MODEL ERROR: no se pudo calcular costo_total_sin_financieros_usd(): {exc}"]

    if total <= 0:
        errores.append(f"MODEL ERROR: costo_total_sin_financieros_usd() es <= 0 ({total})")

    errores.extend(validar_superficies(estructura.superficies))
    return errores


def validar_flujo(flujo: FlujoDeFondos) -> List[str]:
    """S19 -- las series mensuales deben ser consistentes entre si en longitud (ya
    forzado por FlujoDeFondos.__post_init__, pero se revalida aca por defensividad
    si el objeto llega de una fuente externa) y los ingresos totales no pueden ser
    negativos."""
    errores = []
    n = flujo.meses
    series = {
        "egreso_terreno": flujo.egreso_terreno,
        "egreso_obra": flujo.egreso_obra,
        "egreso_indirectos": flujo.egreso_indirectos,
        "egreso_comerciales": flujo.egreso_comerciales,
        "egreso_impuestos": flujo.egreso_impuestos,
        "ingreso_ventas": flujo.ingreso_ventas,
    }
    for nombre, serie in series.items():
        if len(serie) != n:
            errores.append(f"MODEL ERROR: FlujoDeFondos.{nombre} tiene longitud {len(serie)}, esperada {n}")
        if any(v < 0 for v in serie):
            errores.append(f"MODEL ERROR: FlujoDeFondos.{nombre} contiene un valor negativo")

    if sum(flujo.ingreso_ventas) <= 0:
        errores.append("MODEL ERROR: FlujoDeFondos.ingreso_ventas suma <= 0 (no hay ingresos proyectados)")
    return errores
