#!/usr/bin/env python3
"""
CLI de la skill target-yield-tools (SK-17).

Implementa SS45-47 de
documentation/investment-sales-rental-market-engine/00-especificacion-v1.md
(D-084): las dos herramientas inversas de negociacion que la especificacion
pide y que no existian todavia --

  1. MAXIMUM PURCHASE PRICE (SS45): dado un yield neto objetivo y la renta de
     mercado, ¿a que precio tendria que comprar esta unidad?
  2. RENT REQUIRED (SS46): dado el precio de compra y un yield neto objetivo,
     ¿que alquiler necesito?, comparado siempre contra MARKET RENT (SS47 --
     "no manipular el mercado": si RENT REQUIRED > MARKET RENT, se informa la
     brecha, nunca se ajusta la renta de mercado para que "de bien").

Reutiliza -- no duplica -- production/app/backend/calculadora.py
(Calculadora.evaluar_renta): mismo patron de import entre paquetes que ya usa
production/app/backend/dev_engine/cashflow.py con calculadora.py.

Por que la inversion es exacta y no una aproximacion iterativa: en
evaluar_renta(), TODAS las lineas de gasto (expensas, impuesto inmobiliario,
IVA, limpieza, seguros, mantenimiento, honorarios, amortizacion, vacancia,
impuesto a la renta) son un porcentaje de bruto_anual o un multiplo de
renta_mensual_bruta -- nunca dependen de precio_compra. Eso implica dos cosas
utiles:
  - `neto_anual` NO depende de precio_compra en absoluto (solo de la renta y
    los supuestos de gasto) -- por eso "maximo precio de compra" se despeja
    en un solo paso, sin iterar: precio_max = neto_anual / (target_pct/100).
  - `neto_anual` es LINEAL en renta_mensual_bruta -- por eso "alquiler
    requerido" tambien se despeja en un paso, calibrando la pendiente con una
    corrida de referencia a renta=1000 (evaluar_renta ya hace todo el trabajo
    de gastos/impuestos real, esto solo lee el resultado, no reimplementa
    nada de esa logica).

Uso:
    python herramientas.py precio-maximo --clase departamento_amoblado \
        --renta-mensual-mercado 700 --target-yield-neto 8 --nivel-neto 3

    python herramientas.py alquiler-requerido --clase departamento_amoblado \
        --precio-compra 110000 --target-yield-neto 8 --nivel-neto 3 \
        --renta-mercado-base 618 --renta-mercado-low 484 --renta-mercado-high 817
"""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "production" / "app" / "backend"))
from calculadora import Calculadora  # noqa: E402

RENTA_DE_REFERENCIA_PARA_PENDIENTE = 1000.0  # ver nota de linealidad en el docstring


def _neto_anual(calc, clase, renta_mensual_bruta, nivel_neto, gastos_reales, ocupacion_pct):
    """neto_anual no depende de precio_compra (ver docstring) -- se usa un
    precio placeholder cualquiera, no afecta el resultado que se lee."""
    r = calc.evaluar_renta(clase, precio_compra=1.0, renta_mensual_bruta=renta_mensual_bruta,
                            nivel_neto=nivel_neto, gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct)
    return r["neto_anual"], r


def precio_maximo_compra(clase, renta_mensual_bruta, target_yield_neto_pct, nivel_neto=3,
                          gastos_reales=None, ocupacion_pct=None, ruta_config=None):
    if target_yield_neto_pct <= 0:
        raise ValueError("target_yield_neto_pct debe ser > 0")
    calc = Calculadora(ruta_config)
    neto_anual, r = _neto_anual(calc, clase, renta_mensual_bruta, nivel_neto, gastos_reales, ocupacion_pct)
    if neto_anual <= 0:
        return {
            "maximum_purchase_price": None,
            "advertencia": (f"neto_anual calculado es {neto_anual:.2f} (<=0) con esta renta y estos gastos -- "
                             f"no existe un precio de compra positivo que rinda {target_yield_neto_pct}% neto. "
                             f"No se inventa un numero (SS61)."),
            "neto_anual": round(neto_anual, 2),
        }
    precio_max = neto_anual / (target_yield_neto_pct / 100.0)
    # Verificacion exacta: re-evaluar al precio resultante debe reproducir el target (dentro de redondeo).
    verificacion = calc.evaluar_renta(clase, precio_compra=precio_max, renta_mensual_bruta=renta_mensual_bruta,
                                       nivel_neto=nivel_neto, gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct)
    return {
        "maximum_purchase_price": round(precio_max, 2),
        "target_yield_neto_pct": target_yield_neto_pct,
        "yield_neto_verificado_pct": verificacion["yield_neto_pct"],
        "renta_mensual_bruta_usada": renta_mensual_bruta,
        "neto_anual": round(neto_anual, 2),
        "metodologia": ("neto_anual no depende de precio_compra en evaluar_renta() (todas las lineas de gasto son "
                         "% de renta, no de precio) -- se despeja precio_max = neto_anual / (target/100) en un "
                         "solo paso, sin iterar. Verificado re-evaluando al precio resultante (SS45)."),
    }


def alquiler_requerido(clase, precio_compra, target_yield_neto_pct, nivel_neto=3,
                        gastos_reales=None, ocupacion_pct=None, ruta_config=None,
                        renta_mercado_low=None, renta_mercado_base=None, renta_mercado_high=None):
    if target_yield_neto_pct <= 0:
        raise ValueError("target_yield_neto_pct debe ser > 0")
    calc = Calculadora(ruta_config)
    neto_ref, _ = _neto_anual(calc, clase, RENTA_DE_REFERENCIA_PARA_PENDIENTE, nivel_neto, gastos_reales, ocupacion_pct)
    pendiente = neto_ref / RENTA_DE_REFERENCIA_PARA_PENDIENTE  # neto_anual = renta_mensual_bruta * pendiente (SS46)

    neto_objetivo = precio_compra * target_yield_neto_pct / 100.0
    if pendiente <= 0:
        return {
            "rent_required": None,
            "advertencia": (f"Con estos gastos/impuestos, cada USD de renta produce {pendiente:.4f} de neto anual "
                             f"(<=0) -- no existe un alquiler que rinda {target_yield_neto_pct}% neto sobre este "
                             f"precio. No se inventa un numero (SS61)."),
        }
    rent_required = neto_objetivo / pendiente

    # Verificacion exacta.
    verificacion = calc.evaluar_renta(clase, precio_compra=precio_compra, renta_mensual_bruta=rent_required,
                                       nivel_neto=nivel_neto, gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct)

    resultado = {
        "rent_required_usd_mes": round(rent_required, 2),
        "target_yield_neto_pct": target_yield_neto_pct,
        "yield_neto_verificado_pct": verificacion["yield_neto_pct"],
        "precio_compra_usado": precio_compra,
        "metodologia": ("neto_anual es lineal en renta_mensual_bruta en evaluar_renta() -- se calibra la pendiente "
                         "con una corrida de referencia y se despeja rent_required en un solo paso, sin iterar. "
                         "Verificado re-evaluando al alquiler resultante (SS46)."),
    }

    # SS47 -- nunca manipular el mercado. Si hay renta de mercado (del AMC), comparar y avisar, no ajustar.
    if renta_mercado_base is not None:
        resultado["market_rent"] = {"low": renta_mercado_low, "base": renta_mercado_base, "high": renta_mercado_high}
        if rent_required > renta_mercado_base:
            resultado["ss47_advertencia"] = (
                f"El objetivo de rentabilidad requiere una renta superior a la estimada por el mercado "
                f"(RENT REQUIRED USD {rent_required:.2f}/mes > MARKET RENT base USD {renta_mercado_base:.2f}/mes). "
                f"No se modifica el precio ni la renta de mercado para alcanzar el objetivo (SS47)."
            )
            if renta_mercado_high is not None and rent_required <= renta_mercado_high:
                resultado["ss47_advertencia"] += (
                    f" Sí está dentro del rango HIGH observado (USD {renta_mercado_high:.2f}/mes) -- "
                    f"posible solo en el escenario más optimista, no en el caso base."
                )
        else:
            resultado["ss47_conclusion"] = (
                f"El objetivo de rentabilidad es consistente con la evidencia de mercado "
                f"(RENT REQUIRED USD {rent_required:.2f}/mes <= MARKET RENT base USD {renta_mercado_base:.2f}/mes)."
            )

    return resultado


def main():
    parser = argparse.ArgumentParser(description="target-yield-tools (SK-17) -- SS45-47")
    sub = parser.add_subparsers(dest="comando", required=True)

    comunes = dict(clase=str, nivel_neto=int)

    p1 = sub.add_parser("precio-maximo", help="SS45 -- Maximum Purchase Price dado un yield neto objetivo")
    p1.add_argument("--clase", required=True)
    p1.add_argument("--renta-mensual-mercado", type=float, required=True, help="Renta de mercado (del AMC), USD/mes")
    p1.add_argument("--target-yield-neto", type=float, required=True, help="Porcentaje objetivo, ej. 8")
    p1.add_argument("--nivel-neto", type=int, default=3)
    p1.add_argument("--ocupacion-pct", type=float, default=None, help="Solo para clases temporal_*")
    p1.add_argument("--gastos-reales", default=None, help="Ruta a JSON opcional con overrides de gastos_reales")

    p2 = sub.add_parser("alquiler-requerido", help="SS46/47 -- Rent Required dado precio de compra y yield objetivo")
    p2.add_argument("--clase", required=True)
    p2.add_argument("--precio-compra", type=float, required=True)
    p2.add_argument("--target-yield-neto", type=float, required=True)
    p2.add_argument("--nivel-neto", type=int, default=3)
    p2.add_argument("--ocupacion-pct", type=float, default=None)
    p2.add_argument("--gastos-reales", default=None)
    p2.add_argument("--renta-mercado-low", type=float, default=None)
    p2.add_argument("--renta-mercado-base", type=float, default=None)
    p2.add_argument("--renta-mercado-high", type=float, default=None)

    args = parser.parse_args()
    gastos_reales = json.load(open(args.gastos_reales, encoding="utf-8")) if getattr(args, "gastos_reales", None) else None

    if args.comando == "precio-maximo":
        resultado = precio_maximo_compra(args.clase, args.renta_mensual_mercado, args.target_yield_neto,
                                          nivel_neto=args.nivel_neto, gastos_reales=gastos_reales,
                                          ocupacion_pct=args.ocupacion_pct)
    else:
        resultado = alquiler_requerido(args.clase, args.precio_compra, args.target_yield_neto,
                                        nivel_neto=args.nivel_neto, gastos_reales=gastos_reales,
                                        ocupacion_pct=args.ocupacion_pct,
                                        renta_mercado_low=args.renta_mercado_low,
                                        renta_mercado_base=args.renta_mercado_base,
                                        renta_mercado_high=args.renta_mercado_high)

    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
