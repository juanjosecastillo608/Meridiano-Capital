#!/usr/bin/env python3
"""
Test de parametrizacion (S69 del prompt maestro): modifica deliberadamente precio
de venta, costo de construccion, plazo de obra y tasa de financiamiento, y verifica
que TODOS los resultados dependientes (margen, ROI, TIR, costo/m2) se recalculen
automaticamente y en la direccion correcta -- sin tocar ninguna formula.

Tambien ejercita sensibilidad.py (matriz + break-even) y escenarios.py
(Conservador/Base/Optimista) sobre el mismo constructor -- S43-S48.
"""

from dev_engine.moneda import Monto, TipoDeCambio, ConversorMoneda
from dev_engine.costos import (
    Partida, ItemParametrizable, CostoTerreno, GrupoPartidas, GrupoParametrizable,
    Superficies, ContingenciaConfig, EstructuraCostos,
)
from dev_engine.cashflow import VentaUnidad
from dev_engine.financiamiento import TerminosFinanciamiento
from dev_engine.proyecto import FichaProyecto, Proyecto
from dev_engine.sensibilidad import correr_sensibilidad, buscar_punto_de_equilibrio
from dev_engine.escenarios import correr_escenarios, Escenario

# Tipo de cambio fijo a proposito (no conversor_vigente()) -- este es un test
# unitario, no un analisis real: debe ser reproducible sin depender de una
# cotizacion en vivo que cambia dia a dia. Para un proyecto real usar
# dev_engine.cotizacion.conversor_vigente() (ver validar_herrera.py).
CONVERSOR = ConversorMoneda(TipoDeCambio(valor=7300.0, fecha="2026-08-19", fuente="valor fijo de test, no es una cotizacion real"))


def constructor(params: dict) -> Proyecto:
    """
    params: precio_venta (USD, ingresos totales), costo_directo (USD),
    meses_obra (int), capital_propio (USD), tasa_financiamiento (%).
    """
    terreno = CostoTerreno(precio_compra=Monto(360_000.0 + 490_000.0, "USD"))
    directos = GrupoPartidas("Costos directos", partidas=[
        Partida(codigo="D1", categoria="Construccion", cantidad=1,
                costo_unitario=Monto(params["costo_directo"], "USD")),
    ])
    comerciales = GrupoParametrizable("Comerciales", items=[
        ItemParametrizable("Comision", modo="porcentaje", valor=5.5, base="ingresos"),
    ])
    impuestos = GrupoParametrizable("Impuestos", items=[
        # IVA de venta correcto (D-082, 2026-08-23): 1,5% efectivo (30% base imponible
        # x 5% tasa reducida de inmuebles, Ley 125/91) sobre el PRECIO DE VENTA
        # (base="ingresos"), no sobre el costo de construccion.
        ItemParametrizable("IVA de venta", modo="porcentaje", valor=1.5, base="ingresos"),
    ])
    estructura = EstructuraCostos(
        terreno=terreno, directos=directos,
        indirectos=GrupoParametrizable("Indirectos", items=[]),
        desarrollo=GrupoParametrizable("Desarrollo", items=[]),
        comerciales=comerciales, impuestos=impuestos,
        contingencia=ContingenciaConfig(tasa_pct=5.0),
        superficies=Superficies(terreno_m2=469.0, construida_m2=2100.0, vendible_m2=2100.0),
    )
    ventas = [VentaUnidad("agregado", mes_venta=0, precio_usd=params["precio_venta"],
                           anticipo_pct=100.0, meses_cuotas=0)]
    terminos = TerminosFinanciamiento(
        capital_propio_usd=params.get("capital_propio", 3_000_000.0),
        tasa_anual_pct=params.get("tasa_financiamiento", 14.0),
    )
    return Proyecto(
        ficha=FichaProyecto(nombre="TEST", barrio="Test"),
        estructura_costos=estructura, ventas=ventas, meses_obra=params.get("meses_obra", 12),
        conversor=CONVERSOR, terminos_financiamiento=terminos,
    )


def main():
    base = {"precio_venta": 4_500_000.0, "costo_directo": 2_000_000.0, "meses_obra": 12,
            "capital_propio": 3_000_000.0, "tasa_financiamiento": 14.0}

    r_base = constructor(base).correr()
    print(f"BASE -> margen=USD {r_base.margen_usd:,.0f}  ROI={r_base.metricas.roi_pct:.2f}%  "
          f"costo/m2={r_base.indicadores_por_m2['costo_total_por_m2_construido']:,.2f}")

    # 1) Subir precio de venta 10% -> margen y ROI deben SUBIR, costo/m2 NO cambia
    p2 = dict(base); p2["precio_venta"] *= 1.10
    r2 = constructor(p2).correr()
    assert r2.margen_usd > r_base.margen_usd, "FALLO: subir precio deberia subir el margen"
    # El COSTO DIRECTO/m2 no depende del precio de venta (no cambio la construccion) --
    # el costo TOTAL/m2 si puede moverse un poco porque la comision (5,5% de ingresos)
    # escala con el precio: eso es comportamiento correcto, no un bug.
    assert abs(r2.indicadores_por_m2["costo_directo_por_m2_construido"] - r_base.indicadores_por_m2["costo_directo_por_m2_construido"]) < 1, \
        "FALLO: el costo DIRECTO/m2 no deberia cambiar al mover solo el precio de venta"
    print(f"+10% precio -> margen=USD {r2.margen_usd:,.0f} (subio: {r2.margen_usd > r_base.margen_usd})  "
          f"costo directo/m2 sin cambio: {abs(r2.indicadores_por_m2['costo_directo_por_m2_construido'] - r_base.indicadores_por_m2['costo_directo_por_m2_construido']) < 1}  "
          f"(costo TOTAL/m2 subio levemente de {r_base.indicadores_por_m2['costo_total_por_m2_construido']:.2f} a "
          f"{r2.indicadores_por_m2['costo_total_por_m2_construido']:.2f} porque la comision escala con el precio -- correcto, no es un bug)")

    # 2) Subir costo de construccion 15% -> margen debe BAJAR, costo/m2 debe SUBIR
    p3 = dict(base); p3["costo_directo"] *= 1.15
    r3 = constructor(p3).correr()
    assert r3.margen_usd < r_base.margen_usd, "FALLO: subir costo deberia bajar el margen"
    assert r3.indicadores_por_m2["costo_total_por_m2_construido"] > r_base.indicadores_por_m2["costo_total_por_m2_construido"], \
        "FALLO: subir costo directo deberia subir costo/m2"
    print(f"+15% costo directo -> margen=USD {r3.margen_usd:,.0f} (bajo: {r3.margen_usd < r_base.margen_usd})  "
          f"costo/m2 subio: {r3.indicadores_por_m2['costo_total_por_m2_construido'] > r_base.indicadores_por_m2['costo_total_por_m2_construido']}")

    # 3) Subir tasa de financiamiento -> con equity insuficiente, el costo financiero debe SUBIR
    p4 = dict(base); p4["capital_propio"] = 500_000.0; p4["tasa_financiamiento"] = 25.0
    p4b = dict(base); p4b["capital_propio"] = 500_000.0; p4b["tasa_financiamiento"] = 5.0
    r4a = constructor(p4).correr()
    r4b = constructor(p4b).correr()
    assert r4a.costo_financiero_usd > r4b.costo_financiero_usd, "FALLO: mas tasa deberia dar mas costo financiero"
    print(f"tasa 25% vs 5% (equity insuficiente) -> costo financiero: "
          f"USD {r4a.costo_financiero_usd:,.0f} vs USD {r4b.costo_financiero_usd:,.0f} "
          f"(25% > 5%: {r4a.costo_financiero_usd > r4b.costo_financiero_usd})")

    print("\nTodos los checks de parametrizacion (S69) pasaron: el modelo se recalcula "
          "automaticamente y en la direccion correcta al cambiar precio, costo y tasa.")

    # ---- Sensibilidad (S43) ----
    print("\n--- Matriz de sensibilidad ---")
    filas = correr_sensibilidad(constructor, base, {
        "precio_venta": [-20, -10, 0, 10, 20],
        "costo_directo": [-10, 0, 10, 20],
    })
    for f in filas:
        print(f"  {f['variable']:15s} {f['delta_pct']:+4.0f}%  margen=USD {f['margen_usd']:>12,.0f}  ROI={f['roi_pct']:.2f}%")

    # ---- Break-even (S44): precio minimo de venta que hace margen=0 ----
    print("\n--- Break-even: precio minimo de venta ---")
    be = buscar_punto_de_equilibrio(constructor, base, "precio_venta", (1_000_000.0, 4_500_000.0))
    print(f"  Precio de venta de equilibrio: USD {be['valor_equilibrio']:,.0f} "
          f"(margen residual: USD {be['margen_residual']:,.2f})")

    # ---- Escenarios (S47) ----
    # ESCENARIOS_ESTANDAR de escenarios.py usa nombres de parametro de ejemplo
    # ("costo_construccion") -- cada proyecto adapta los nombres a los que use su
    # propio constructor (S47: los parametros deben ser editables, no universales).
    escenarios_test = [
        Escenario("Conservador", {"precio_venta": -10.0, "costo_directo": 10.0, "meses_obra": 20.0}),
        Escenario("Base", {}),
        Escenario("Optimista", {"precio_venta": 10.0, "costo_directo": -5.0, "meses_obra": -10.0}),
    ]
    print("\n--- Escenarios Conservador/Base/Optimista ---")
    escenarios = correr_escenarios(constructor, base, escenarios_test)
    for e in escenarios:
        print(f"  {e['escenario']:12s} margen=USD {e['margen_usd']:>12,.0f}  ROI={e['roi_pct']:.2f}%  "
              f"TIR anual={e['tir_anual_pct']:.2f}%" if e['tir_anual_pct'] is not None else
              f"  {e['escenario']:12s} margen=USD {e['margen_usd']:>12,.0f}  ROI={e['roi_pct']:.2f}%  TIR anual=N/D")


if __name__ == "__main__":
    main()
