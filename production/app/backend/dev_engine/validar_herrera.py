#!/usr/bin/env python3
"""
Test de reconstruccion de HERRERA-001 (S68-S69 del prompt maestro "Development Cost
& Financial Engine"): recrea los 3 Angulos usando UNICAMENTE dev_engine (no los
calculos manuales del caso) y compara contra los numeros ya confirmados y usados en
los entregables reales:
  - contracts/cases/HERRERA-001/14-costo-de-entrada-definitivo-por-angulo.md
  - contracts/cases/HERRERA-001/36-recosteo-720-e-iva-desarrollador-margen-final-definitivo.md

Supuestos de la reconstruccion, declarados explicitamente (para que cualquier
diferencia sea explicable, S58):
  - Financiamiento 100% equity (Herrera nunca modelo un prestamo bancario real con
    interes -- capital_propio se fija igual a la Inversion Total para que el motor
    de financiamiento gire USD 0 de deuda). El costo financiero de dev_engine da
    USD 0 en esta reconstruccion por eso, no por un bug.
  - Las ventas se modelan como una unica "unidad agregada" pagada de contado en el
    mes 0 -- Herrera nunca corrio un cash flow de ventas mes a mes para el calculo
    de margen/ROI (si lo hizo para el cronograma de caja de USD, ver 16/18/24/27,
    pero ESE cash flow no es el que determina Ingresos/Margen/ROI del Memorandum).
    Por eso TIR/VAN/Peak Capital que reporta este script son un resultado NUEVO,
    no una cifra que se pueda comparar 1:1 contra el caso original.
"""

import sys

from dev_engine.moneda import Monto
from dev_engine.cotizacion import conversor_vigente
from dev_engine.costos import (
    Partida, ItemParametrizable, CostoTerreno, GrupoPartidas, GrupoParametrizable,
    Superficies, ContingenciaConfig, EstructuraCostos,
)
from dev_engine.cashflow import VentaUnidad
from dev_engine.financiamiento import TerminosFinanciamiento
from dev_engine.proyecto import FichaProyecto, Proyecto


# Herrera no tiene ningun costo en PYG (todo el caso original es USD) -- el
# tipo de cambio no afecta ningun numero de esta reconstruccion, pero se usa el
# vigente real (no un valor hardcodeado) para que este script sea el patron a
# copiar en casos futuros que si mezclen monedas.
CONVERSOR = conversor_vigente()


def construir_angulo(nombre, m2_comercializable, obra_nueva_usd, proyecto_usd, aprobaciones_usd, ingresos_totales_usd):
    terreno = CostoTerreno(
        precio_compra=Monto(360_000.00, "USD"),
        gastos_adquisicion=[
            Partida(codigo="ADQ-01", categoria="Estructura ya construida + documentacion + riesgo evitado",
                    cantidad=1, costo_unitario=Monto(490_000.00, "USD"), estado="ACTUAL",
                    fuente="Precio de compra USD 850.000, desagregacion del Memorandum")
        ],
    )
    directos = GrupoPartidas("Costos directos", partidas=[
        Partida(codigo="DIR-01", categoria="Terminacion sobre estructura existente",
                cantidad=1, costo_unitario=Monto(1_300_805.78, "USD"), estado="ACTUAL",
                fuente="2.286,93 m2 x USD 720/m2 x (1-21% incidencia estructural)"),
        Partida(codigo="DIR-02", categoria="Obra 100% nueva",
                cantidad=1, costo_unitario=Monto(obra_nueva_usd, "USD"), estado="ACTUAL",
                fuente="m2 sin estructura previa x USD 720/m2 completo"),
    ])
    indirectos = GrupoParametrizable("Costos indirectos", items=[
        ItemParametrizable("Proyecto (honorarios diseno)", modo="fijo", valor=proyecto_usd, estado="ACTUAL"),
        ItemParametrizable("Aprobaciones e imprevistos", modo="fijo", valor=aprobaciones_usd, estado="ACTUAL"),
    ])
    desarrollo = GrupoParametrizable("Costos de desarrollo", items=[])  # Herrera no distingue esta categoria aparte
    comerciales = GrupoParametrizable("Costos comerciales", items=[
        ItemParametrizable("Comision de venta", modo="porcentaje", valor=5.5, base="ingresos",
                            fuente="D-063, 5,5% sobre ingresos totales"),
    ])
    impuestos = GrupoParametrizable("Impuestos y gastos", items=[
        ItemParametrizable("IVA del desarrollador", modo="porcentaje", valor=10.0, base="directos",
                            fuente="36-...md S2, 10% sobre el costo total de construccion"),
    ])
    contingencia = ContingenciaConfig(tasa_pct=0.0)  # Herrera no aplica una linea de contingencia separada
    superficies = Superficies(terreno_m2=469.0, construida_m2=3113.03, vendible_m2=m2_comercializable, comun_m2=0.0)

    estructura = EstructuraCostos(
        terreno=terreno, directos=directos, indirectos=indirectos, desarrollo=desarrollo,
        comerciales=comerciales, impuestos=impuestos, contingencia=contingencia, superficies=superficies,
    )

    # Financiamiento 100% equity (ver docstring del modulo) -- capital propio =
    # cualquier monto >= inversion total esperada, para que la deuda girada sea 0.
    terminos_fin = TerminosFinanciamiento(capital_propio_usd=4_000_000.0, tasa_anual_pct=14.0)

    ventas = [VentaUnidad(identificador=f"{nombre}-agregado", mes_venta=0, precio_usd=ingresos_totales_usd,
                           anticipo_pct=100.0, meses_cuotas=0, saldo_entrega_pct=0.0)]

    ficha = FichaProyecto(nombre=f"HERRERA-001 {nombre}", barrio="Luis A. de Herrera")
    proyecto = Proyecto(
        ficha=ficha, estructura_costos=estructura, ventas=ventas, meses_obra=12,
        conversor=CONVERSOR, terminos_financiamiento=terminos_fin, curva_obra_forma="lineal",
        mes_pago_terreno=0,
    )
    return proyecto.correr()


def comparar(nombre, resultado, esperado):
    print(f"\n=== {nombre} ===")
    filas = [
        ("Inversion Total (USD)", resultado.inversion_total_usd, esperado["inversion_total"]),
        ("Costo/m2 comercializable (USD)", resultado.inversion_total_usd / esperado["m2_comercializable"], esperado["costo_m2"]),
        ("Ingresos (bajo, USD)", esperado["ingresos_bajo_input"], esperado["ingresos_bajo_input"]),  # se corre aparte
    ]
    ok = True
    for etiqueta, real, esp in filas:
        diff = real - esp
        diff_pct = (diff / esp * 100) if esp else 0
        marca = "OK" if abs(diff_pct) < 0.05 else "DIFERENCIA"
        if marca == "DIFERENCIA":
            ok = False
        print(f"  {etiqueta:38s} motor={real:>14,.2f}  esperado={esp:>14,.2f}  diff={diff_pct:+.3f}%  [{marca}]")
    return ok


def main():
    casos = [
        dict(nombre="Angulo 1 (tal cual)", m2_comercializable=1800, obra_nueva_usd=594_792.00,
             proyecto_usd=0.0, aprobaciones_usd=0.0,
             inversion_total=2_745_597.78, costo_m2=1525.33,
             ingresos_bajo=3_567_637, ingresos_alto=4_218_165,
             comision_bajo=196_220, comision_alto=231_999,
             margen_bajo=436_259, margen_alto=1_051_008),
        dict(nombre="Angulo 3 (fachada+chicas, 6P)", m2_comercializable=1800, obra_nueva_usd=594_792.00,
             proyecto_usd=84_051.81, aprobaciones_usd=101_173.48,
             inversion_total=2_930_823.07, costo_m2=1628.24,
             ingresos_bajo=3_820_500, ingresos_alto=4_097_250,
             comision_bajo=210_128, comision_alto=225_349,
             margen_bajo=489_990, margen_alto=751_518),
        dict(nombre="Angulo 2 (fachada+chicas+7P)", m2_comercializable=2100, obra_nueva_usd=810_792.00,
             proyecto_usd=122_869.08, aprobaciones_usd=101_173.48,
             inversion_total=3_185_640.34, costo_m2=1516.97,
             ingresos_bajo=4_424_700, ingresos_alto=4_749_150,
             comision_bajo=243_358, comision_alto=261_203,
             margen_bajo=784_541, margen_alto=1_091_147),
    ]

    todo_ok = True
    for caso in casos:
        print(f"\n{'=' * 70}\n{caso['nombre']}\n{'=' * 70}")
        for etiqueta_rango, ingresos_key, comision_key, margen_key in [
            ("BAJO", "ingresos_bajo", "comision_bajo", "margen_bajo"),
            ("ALTO", "ingresos_alto", "comision_alto", "margen_alto"),
        ]:
            resultado = construir_angulo(
                caso["nombre"], caso["m2_comercializable"], caso["obra_nueva_usd"],
                caso["proyecto_usd"], caso["aprobaciones_usd"], caso[ingresos_key],
            )
            print(f"\n  --- rango {etiqueta_rango} ---")
            comparaciones = [
                ("Inversion Total", resultado.inversion_total_usd, caso["inversion_total"]),
                ("Costo/m2 comercializable", resultado.inversion_total_usd / caso["m2_comercializable"], caso["costo_m2"]),
                ("Comision de venta", resultado.costo_comerciales_usd, caso[comision_key]),
                ("Margen", resultado.margen_usd, caso[margen_key]),
                ("Costo financiero (debe ser 0, 100% equity)", resultado.costo_financiero_usd, 0.0),
            ]
            for etiqueta, real, esp in comparaciones:
                diff_pct = ((real - esp) / esp * 100) if esp else (0.0 if abs(real) < 1 else float("inf"))
                marca = "OK" if abs(diff_pct) < 0.05 else "DIFERENCIA"
                if marca == "DIFERENCIA":
                    todo_ok = False
                print(f"    {etiqueta:42s} motor={real:>14,.2f}  esperado={esp:>14,.2f}  diff={diff_pct:+.4f}%  [{marca}]")
            print(f"    (nuevo, sin comparar) TIR anual: "
                  f"{resultado.metricas.tir_anual_pct if resultado.metricas.tir_anual_pct is not None else 'N/D'}")

    print(f"\n{'=' * 70}")
    print("RESULTADO GLOBAL:", "TODOS LOS CASOS RECONSTRUIDOS DENTRO DE TOLERANCIA (0.05%)" if todo_ok else "HAY DIFERENCIAS -- REVISAR ARRIBA")
    print(f"{'=' * 70}")
    return 0 if todo_ok else 1


if __name__ == "__main__":
    sys.exit(main())
