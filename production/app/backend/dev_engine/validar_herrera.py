#!/usr/bin/env python3
"""
Test de reconstruccion de HERRERA-001 con el IVA de venta CORREGIDO (D-082,
2026-08-23). Reconstruye los 3 Angulos usando UNICAMENTE dev_engine y compara
contra los numeros previamente confirmados:
  - contracts/cases/HERRERA-001/14-costo-de-entrada-definitivo-por-angulo.md
  - contracts/cases/HERRERA-001/36-recosteo-720-e-iva-desarrollador-margen-final-definitivo.md

Los items que NO dependen del IVA (Inversion Total, Costo/m2, Comision de venta)
deben seguir coincidiendo exactamente -- si no coinciden, hay un bug real. El IVA
y el Margen, en cambio, DEBEN diferir de esos numeros anteriores -- ese es
justamente el resultado de la correccion (ver knowledge-base/investment/
methodologies/iva-venta-de-inmuebles-paraguay.md): el IVA del desarrollador pasa
de 10% sobre el costo de construccion a 1,5% efectivo sobre el precio de venta
(30% de base imponible presunta x 5% de tasa reducida de inmuebles, Art. 82/91
Ley 125/91) -- el margen sube en los 3 Angulos, sustancialmente.

Supuestos de la reconstruccion, declarados explicitamente (para que cualquier
diferencia sea explicable, S58):
  - Financiamiento 100% equity (Herrera nunca modelo un prestamo bancario real con
    interes -- capital_propio se fija igual a la Inversion Total para que el motor
    de financiamiento gire USD 0 de deuda). El costo financiero de dev_engine da
    USD 0 en esta reconstruccion por eso, no por un bug.
  - Las ventas se modelan como una unica "unidad agregada" pagada de contado en el
    mes 0 -- Herrera nunca corrio un cash flow de ventas mes a mes para el calculo
    de margen/ROI. Por eso TIR/VAN/Peak Capital que reporta este script son un
    resultado NUEVO, no una cifra que se pueda comparar 1:1 contra el caso original.
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

IVA_VENTA_BASE_IMPONIBLE_PCT = 30.0
IVA_VENTA_TASA_PCT = 5.0
IVA_VENTA_EFECTIVA_PCT = IVA_VENTA_BASE_IMPONIBLE_PCT * IVA_VENTA_TASA_PCT / 100.0  # 1.5

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
        ItemParametrizable(
            "IVA del desarrollador", modo="porcentaje", valor=IVA_VENTA_EFECTIVA_PCT, base="ingresos",
            fuente="D-082, 2026-08-23: 30% base imponible presunta x 5% tasa reducida de inmuebles "
                   "(Art. 82/91 Ley 125/91) = 1,5% efectivo sobre el precio de venta -- CORRIGE el 10% "
                   "sobre costo de construccion que traia 36-...md",
        ),
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


def main():
    casos = [
        dict(nombre="Angulo 1 (tal cual)", m2_comercializable=1800, obra_nueva_usd=594_792.00,
             proyecto_usd=0.0, aprobaciones_usd=0.0,
             inversion_total=2_745_597.78, costo_m2=1525.33,
             ingresos_bajo=3_567_637, ingresos_alto=4_218_165,
             comision_bajo=196_220, comision_alto=231_999,
             iva_anterior=189_560,
             margen_bajo_anterior=436_259, margen_alto_anterior=1_051_008),
        dict(nombre="Angulo 3 (fachada+chicas, 6P)", m2_comercializable=1800, obra_nueva_usd=594_792.00,
             proyecto_usd=84_051.81, aprobaciones_usd=101_173.48,
             inversion_total=2_930_823.07, costo_m2=1628.24,
             ingresos_bajo=3_820_500, ingresos_alto=4_097_250,
             comision_bajo=210_128, comision_alto=225_349,
             iva_anterior=189_560,
             margen_bajo_anterior=489_990, margen_alto_anterior=751_518),
        dict(nombre="Angulo 2 (fachada+chicas+7P)", m2_comercializable=2100, obra_nueva_usd=810_792.00,
             proyecto_usd=122_869.08, aprobaciones_usd=101_173.48,
             inversion_total=3_185_640.34, costo_m2=1516.97,
             ingresos_bajo=4_424_700, ingresos_alto=4_749_150,
             comision_bajo=243_358, comision_alto=261_203,
             iva_anterior=211_160,
             margen_bajo_anterior=784_541, margen_alto_anterior=1_091_147),
    ]

    todo_ok = True
    for caso in casos:
        print(f"\n{'=' * 78}\n{caso['nombre']}\n{'=' * 78}")
        for etiqueta_rango, ingresos_key, comision_key, margen_ant_key in [
            ("BAJO", "ingresos_bajo", "comision_bajo", "margen_bajo_anterior"),
            ("ALTO", "ingresos_alto", "comision_alto", "margen_alto_anterior"),
        ]:
            resultado = construir_angulo(
                caso["nombre"], caso["m2_comercializable"], caso["obra_nueva_usd"],
                caso["proyecto_usd"], caso["aprobaciones_usd"], caso[ingresos_key],
            )
            print(f"\n  --- rango {etiqueta_rango} ---")
            # Items que NO dependen del IVA -- deben seguir coincidiendo exacto (bug si no)
            invariantes = [
                ("Inversion Total", resultado.inversion_total_usd, caso["inversion_total"]),
                ("Costo/m2 comercializable", resultado.inversion_total_usd / caso["m2_comercializable"], caso["costo_m2"]),
                ("Comision de venta", resultado.costo_comerciales_usd, caso[comision_key]),
            ]
            for etiqueta, real, esp in invariantes:
                diff_pct = ((real - esp) / esp * 100) if esp else (0.0 if abs(real) < 1 else float("inf"))
                marca = "OK" if abs(diff_pct) < 0.05 else "DIFERENCIA INESPERADA -- BUG"
                if marca != "OK":
                    todo_ok = False
                print(f"    {etiqueta:38s} motor={real:>14,.2f}  esperado={esp:>14,.2f}  diff={diff_pct:+.4f}%  [{marca}]")
            # IVA y Margen -- DEBEN diferir del numero anterior (ese es el punto de la correccion)
            iva_nuevo = resultado.costo_impuestos_usd
            margen_anterior = caso[margen_ant_key]
            print(f"    {'IVA del desarrollador (anterior, 10% s/costo)':38s} {'':>14}  esperado={caso['iva_anterior']:>14,.2f}")
            print(f"    {'IVA del desarrollador (corregido, 1,5% s/venta)':38s} motor={iva_nuevo:>14,.2f}  "
                  f"ahorro={caso['iva_anterior'] - iva_nuevo:>14,.2f}  [CORRECCION ESPERADA]")
            print(f"    {'Margen (anterior)':38s} {'':>14}  esperado={margen_anterior:>14,.2f}")
            print(f"    {'Margen (corregido)':38s} motor={resultado.margen_usd:>14,.2f}  "
                  f"aumento={resultado.margen_usd - margen_anterior:>14,.2f}  [CORRECCION ESPERADA]")
            print(f"    {'Costo financiero (debe ser 0, 100% equity)':38s} motor={resultado.costo_financiero_usd:>14,.2f}")

    print(f"\n{'=' * 78}")
    print("RESULTADO GLOBAL:",
          "Inversion Total / Costo m2 / Comision coinciden en los 6 casos (sin bug); "
          "IVA y Margen difieren del anterior como se esperaba de la correccion D-082."
          if todo_ok else "HAY UNA DIFERENCIA INESPERADA EN UN ITEM QUE NO DEBERIA CAMBIAR -- REVISAR ARRIBA")
    print(f"{'=' * 78}")
    return 0 if todo_ok else 1


if __name__ == "__main__":
    sys.exit(main())
