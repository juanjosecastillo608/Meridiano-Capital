#!/usr/bin/env python3
"""
CLI de la skill rentabilidad-calculator (SK-03).

Envuelve production/app/backend/calculadora.py sin reimplementar su logica.
Imprime JSON con el resultado + advertencias de integridad de datos
(governance/decisions/DECISION_REGISTER.md D-001/D-002/D-003).

Uso:
    python calcular.py renta --clase comercial --precio 100000 --renta 1000
    python calcular.py reventa --tipo tradicional --etapa pre_pozo --salida vende_al_terminar --precio 80000
    python calcular.py reventa-temprana --precio 80000 --meses-obra 24
    python calcular.py combinado --clase departamento_amoblado --precio 99000 --valor-actual 120000 --meses 12 --renta 950
"""

import argparse
import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent / "production" / "app" / "backend"
sys.path.insert(0, str(BACKEND_DIR))
from calculadora import Calculadora  # noqa: E402
from advertencias import advertencias_renta, advertencias_venta  # noqa: E402


def cmd_renta(calc, args):
    resultado = calc.evaluar_renta(args.clase, args.precio, args.renta, nivel_neto=args.nivel,
                                    ocupacion_pct=args.ocupacion)
    resultado["advertencias"] = advertencias_renta(calc, args.clase, resultado)
    return resultado


def cmd_reventa(calc, args):
    resultado = calc.evaluar_reventa(
        args.tipo, args.etapa, args.salida, args.precio,
        meses_obra=args.meses_obra, entrega_inicial_pct=args.entrega_inicial,
    )
    resultado["advertencias"] = advertencias_venta()
    return resultado


def cmd_reventa_temprana(calc, args):
    resultado = calc.evaluar_reventa_temprana(
        args.precio, args.meses_obra, mes_cesion=args.mes_cesion,
        apreciacion_pct=args.apreciacion, entrega_inicial_pct=args.entrega_inicial,
    )
    resultado["advertencias"] = advertencias_venta()
    return resultado


def cmd_combinado(calc, args):
    return calc.evaluar_retorno_combinado(
        args.clase, args.precio, args.valor_actual, args.meses, args.renta,
        nivel_neto=args.nivel,
    )


def main():
    parser = argparse.ArgumentParser(description="rentabilidad-calculator (SK-03)")
    sub = parser.add_subparsers(dest="comando", required=True)

    p_renta = sub.add_parser("renta", help="Yield bruto/neto de una operacion de renta")
    p_renta.add_argument("--clase", required=True, choices=[
        "comercial", "residencial_casa", "departamento_sin_muebles",
        "departamento_amoblado", "temporal_departamento", "temporal_casa"])
    p_renta.add_argument("--precio", type=float, required=True, help="Precio de compra (USD)")
    p_renta.add_argument("--renta", type=float, required=True, help="Renta mensual bruta (USD)")
    p_renta.add_argument("--nivel", type=int, default=3, choices=[1, 2, 3])
    p_renta.add_argument("--ocupacion", type=float, default=None,
                          help="Solo para clases temporal_*. Ocupacion real 0-100. "
                               "Si se omite, usa el punto medio del rango realista "
                               "(60%%, D-003/D-046).")
    p_renta.set_defaults(func=cmd_renta)

    p_reventa = sub.add_parser("reventa", help="Plusvalia + TIR doble de una reventa")
    p_reventa.add_argument("--tipo", required=True, choices=["tradicional", "torre"])
    p_reventa.add_argument("--etapa", required=True, choices=["pre_pozo", "lanzamiento", "pozo_durante_obra"])
    p_reventa.add_argument("--salida", required=True, choices=["vende_al_terminar", "vende_mas_un_ano"])
    p_reventa.add_argument("--precio", type=float, required=True)
    p_reventa.add_argument("--meses-obra", type=int, default=None)
    p_reventa.add_argument("--entrega-inicial", type=float, default=None)
    p_reventa.set_defaults(func=cmd_reventa)

    p_rt = sub.add_parser("reventa-temprana", help="Cesion de derechos antes de terminar de pagar")
    p_rt.add_argument("--precio", type=float, required=True)
    p_rt.add_argument("--meses-obra", type=int, required=True)
    p_rt.add_argument("--mes-cesion", type=int, default=None)
    p_rt.add_argument("--apreciacion", type=float, default=None)
    p_rt.add_argument("--entrega-inicial", type=float, default=None)
    p_rt.set_defaults(func=cmd_reventa_temprana)

    p_comb = sub.add_parser("combinado", help="Renta + plusvalia combinadas (momento de compra)")
    p_comb.add_argument("--clase", required=True)
    p_comb.add_argument("--precio", type=float, required=True)
    p_comb.add_argument("--valor-actual", type=float, required=True)
    p_comb.add_argument("--meses", type=int, required=True, help="Meses de tenencia")
    p_comb.add_argument("--renta", type=float, required=True)
    p_comb.add_argument("--nivel", type=int, default=3, choices=[1, 2, 3])
    p_comb.set_defaults(func=cmd_combinado)

    args = parser.parse_args()
    calc = Calculadora()
    resultado = args.func(calc, args)
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
