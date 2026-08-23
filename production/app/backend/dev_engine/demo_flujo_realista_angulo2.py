#!/usr/bin/env python3
"""
Demo de capacidad NUEVA del motor (no existia en el analisis manual de HERRERA-001):
un cash flow mensual realista para el Angulo 2 (el escenario recomendado), usando
el ritmo de venta ya confirmado del caso (D-065: 30% lanzamiento / 40% obra / 30%
final) y la variante de financiamiento de comprador de plazo corto ya confirmada
(D-067, 40/50/10 -- entrega + cuotas + saldo contra entrega), y una estructura de
capital mixta (40% equity / 60% deuda) para mostrar el Financing Cost Engine (S12)
funcionando de verdad (interes sobre saldo real, no un numero suelto).

Esto es lo que faltaba en el caso original: Herrera calculo Ingresos/Margen/ROI de
forma agregada (sin fecha), y por separado corrio 4 versiones manuales de cronograma
de caja (16/18/24/27-...md) sin conectarlas al margen ni al ROI. Este script muestra
el flujo, el capital pico y el TIR/VAN de UNA sola corrida coherente.
"""

from dev_engine.moneda import Monto
from dev_engine.cotizacion import conversor_vigente
from dev_engine.costos import (
    Partida, ItemParametrizable, CostoTerreno, GrupoPartidas, GrupoParametrizable,
    Superficies, ContingenciaConfig, EstructuraCostos,
)
from dev_engine.cashflow import VentaUnidad, construir_cronograma
from dev_engine.financiamiento import TerminosFinanciamiento
from dev_engine.proyecto import FichaProyecto, Proyecto

CONVERSOR = conversor_vigente()

INGRESOS_MEDIO = 4_586_925.0  # Angulo 2, valor medio del rango bajo/alto (46-...md)
MESES_OBRA = 12


def main():
    terreno = CostoTerreno(
        precio_compra=Monto(360_000.00, "USD"),
        gastos_adquisicion=[Partida(codigo="ADQ-01", categoria="Estructura ya construida + doc. + riesgo evitado",
                                     cantidad=1, costo_unitario=Monto(490_000.00, "USD"), estado="ACTUAL")],
    )
    directos = GrupoPartidas("Costos directos", partidas=[
        Partida(codigo="DIR-01", categoria="Terminacion sobre estructura existente",
                cantidad=1, costo_unitario=Monto(1_300_805.78, "USD"), estado="ACTUAL"),
        Partida(codigo="DIR-02", categoria="Obra 100% nueva (7 pisos)",
                cantidad=1, costo_unitario=Monto(810_792.00, "USD"), estado="ACTUAL"),
    ])
    indirectos = GrupoParametrizable("Costos indirectos", items=[
        ItemParametrizable("Proyecto (honorarios diseno)", modo="fijo", valor=122_869.08, estado="ACTUAL"),
        ItemParametrizable("Aprobaciones e imprevistos", modo="fijo", valor=101_173.48, estado="ACTUAL"),
    ])
    comerciales = GrupoParametrizable("Costos comerciales", items=[
        ItemParametrizable("Comision de venta", modo="porcentaje", valor=5.5, base="ingresos"),
    ])
    impuestos = GrupoParametrizable("Impuestos y gastos", items=[
        # IVA de venta correcto (D-082, 2026-08-23): 1,5% efectivo (30% base imponible
        # x 5% tasa reducida de inmuebles, Ley 125/91) sobre el precio de venta.
        ItemParametrizable("IVA del desarrollador", modo="porcentaje", valor=1.5, base="ingresos"),
    ])
    estructura = EstructuraCostos(
        terreno=terreno, directos=directos, indirectos=indirectos,
        desarrollo=GrupoParametrizable("Costos de desarrollo", items=[]),
        comerciales=comerciales, impuestos=impuestos,
        contingencia=ContingenciaConfig(tasa_pct=0.0),
        superficies=Superficies(terreno_m2=469.0, construida_m2=3113.03, vendible_m2=2100.0),
    )

    # Ritmo de venta D-065: 30% lanzamiento (mes 0) / 40% durante obra (mes 5) / 30% final (mes 11)
    # Financiamiento de comprador D-067, variante corta: 40% entrega + 50% cuotas + 10% saldo a entrega
    tramos = [(0, 0.30), (5, 0.40), (11, 0.30)]
    ventas = []
    for mes_venta, fraccion in tramos:
        meses_cuotas = MESES_OBRA - mes_venta
        ventas.append(VentaUnidad(
            identificador=f"tramo-mes{mes_venta}", mes_venta=mes_venta,
            precio_usd=INGRESOS_MEDIO * fraccion, anticipo_pct=40.0,
            meses_cuotas=meses_cuotas, saldo_entrega_pct=10.0,
        ))

    # Estructura de capital mixta: 40% equity, resto deuda -- para mostrar el
    # Financing Cost Engine (S12) actuando de verdad, no solo el caso 100% equity.
    inversion_total_aprox = 3_185_640.34
    capital_propio = inversion_total_aprox * 0.40
    terminos_fin = TerminosFinanciamiento(
        capital_propio_usd=capital_propio, tasa_anual_pct=14.0,
        comision_apertura_pct=1.0, periodo_gracia_meses=6,
    )

    ficha = FichaProyecto(nombre="HERRERA-001 Angulo 2 -- demo cash flow realista", barrio="Luis A. de Herrera")
    proyecto = Proyecto(
        ficha=ficha, estructura_costos=estructura, ventas=ventas, meses_obra=MESES_OBRA,
        conversor=CONVERSOR, terminos_financiamiento=terminos_fin, curva_obra_forma="s_curve",
        mes_pago_terreno=0,
    )
    r = proyecto.correr()

    print("=" * 78)
    print("HERRERA-001 -- Angulo 2, cash flow realista (ritmo D-065 + financiamiento D-067)")
    print("=" * 78)
    print(f"Capital propio (40% de Inversion Total): USD {capital_propio:,.2f}")
    print(f"Ingresos totales:                        USD {r.ingresos_totales_usd:,.2f}")
    print(f"Inversion Total:                         USD {r.inversion_total_usd:,.2f}")
    print(f"Costo financiero (deuda real girada):     USD {r.costo_financiero_usd:,.2f}")
    print(f"Costo total del proyecto:                 USD {r.costo_total_proyecto_usd:,.2f}")
    print(f"Margen:                                   USD {r.margen_usd:,.2f}")
    print(f"ROI sobre Inversion Total:                {r.metricas.roi_pct:.2f}%")
    print(f"ROIC (margen / capital propio):           {r.metricas.roic_pct:.2f}%")
    print(f"TIR anual:                                {r.metricas.tir_anual_pct:.2f}%" if r.metricas.tir_anual_pct is not None else "TIR anual: N/D")
    print(f"VAN (@12% anual):                         USD {r.metricas.van_usd:,.2f}")
    print(f"Equity Multiple:                          {r.metricas.equity_multiple:.2f}x" if r.metricas.equity_multiple else "N/D")
    print(f"Payback (mes):                            {r.metricas.payback_mes}")
    print(f"Pico de deuda girada:                     USD {r.financiamiento['pico_deuda_usd']:,.2f}")
    print(f"Interes total pagado:                     USD {r.financiamiento['interes_total_usd']:,.2f}")

    print("\nFlujo neto mensual (primeros 13 meses):")
    print(f"{'Mes':>4} {'Egresos':>14} {'Ingresos':>14} {'Flujo neto':>14} {'Acumulado':>14}")
    for fila in r.flujo_mensual[:13]:
        print(f"{fila['mes']:>4} {fila['egresos_totales']:>14,.0f} {fila['ingreso_ventas']:>14,.0f} "
              f"{fila['flujo_neto']:>14,.0f} {fila['flujo_acumulado']:>14,.0f}")

    peak = min(f["flujo_acumulado"] for f in r.flujo_mensual)
    mes_peak = [f["mes"] for f in r.flujo_mensual if f["flujo_acumulado"] == peak][0]
    print(f"\nPeak Capital Requirement (equity + deuda, caja minima acumulada): "
          f"USD {-peak:,.2f} en el mes {mes_peak}")

    return r


if __name__ == "__main__":
    main()
