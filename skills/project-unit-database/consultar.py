#!/usr/bin/env python3
"""
CLI de la skill project-unit-database (SK-15).

Implementa el Project/Unit/Parking Master Database descripto en
documentation/investment-sales-rental-market-engine/00-especificacion-v1.md
SS5, SS8, SS11, SS12, SS13, SS15 (D-084). Lee (no genera) los datos de
knowledge-base/investment/projects/<slug>/{project.json,units.csv,parking.csv}
-- cargar datos nuevos es tarea del agente/humano editando esos archivos a
mano, siguiendo el mismo patron que las otras bases de
knowledge-base/investment/market-intelligence/ (esta skill NO escribe).

Uso:
    python consultar.py proyecto --slug uon-calathea
    python consultar.py unidades --slug uon-calathea
    python consultar.py unidades --slug uon-calathea --unidad 105
    python consultar.py cocheras --slug uon-calathea
    python consultar.py activo --slug uon-calathea --unidad 105 --cochera 10
    python consultar.py activo --slug uon-calathea --unidad 105 --sin-cochera

Regla de seguridad (SS61): este script nunca inventa un proyecto, unidad,
cochera o precio que no este en los archivos fuente. Si un slug no existe,
devuelve NO_DATA explicito.
"""

import argparse
import csv
import json
from pathlib import Path

PROJECTS_DIR = (Path(__file__).resolve().parent.parent.parent / "knowledge-base" / "investment" / "projects")


def ruta_proyecto(slug):
    return PROJECTS_DIR / slug


def cargar_proyecto(slug):
    ruta = ruta_proyecto(slug) / "project.json"
    if not ruta.exists():
        return None
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)


def cargar_csv(slug, nombre):
    ruta = ruta_proyecto(slug) / nombre
    if not ruta.exists():
        return []
    with open(ruta, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def cargar_unidades(slug):
    return cargar_csv(slug, "units.csv")


def cargar_cocheras(slug):
    return cargar_csv(slug, "parking.csv")


def price_m2(unidad):
    """SS10 -- calcula PRICE_M2_BASE (sobre superficie propia) y
    PRICE_M2_ANALYSIS (sobre superficie total) por separado, sin elegir
    automaticamente cual usar para valoracion. No se calcula sobre el precio
    combinado con cochera (SS12: nunca sumar la cochera si no corresponde)."""
    precio = unidad.get("precio_vigente_usd") or unidad.get("precio_lista_usd")
    resultado = {"price_m2_base": None, "price_m2_analysis": None, "metodologia": None}
    if not precio:
        resultado["metodologia"] = ("Sin precio_vigente_usd/precio_lista_usd propio -- el precio disponible es "
                                     "precio_combinado_con_cochera_usd (incluye cochera), no se puede calcular "
                                     "un USD/m2 puro del departamento sin desagregar la cochera primero (SS12).")
        return resultado
    precio = float(precio)
    sup_propia = unidad.get("superficie_propia_m2")
    sup_total = unidad.get("superficie_total_m2")
    if sup_propia:
        resultado["price_m2_base"] = round(precio / float(sup_propia), 2)
    if sup_total:
        resultado["price_m2_analysis"] = round(precio / float(sup_total), 2)
    resultado["metodologia"] = ("price_m2_base = precio / superficie propia. price_m2_analysis = precio / "
                                 "superficie total (si esta disponible). Ninguno de los dos se elige "
                                 "automaticamente como 'el' precio por m2 -- se muestran ambos (SS10).")
    return resultado


def cmd_proyecto(args):
    p = cargar_proyecto(args.slug)
    if p is None:
        print(json.dumps({"resultado": "NO_DATA", "nota": f"No existe knowledge-base/investment/projects/{args.slug}/project.json"}, ensure_ascii=False, indent=2))
        return
    print(json.dumps(p, ensure_ascii=False, indent=2))


def cmd_unidades(args):
    unidades = cargar_unidades(args.slug)
    if not unidades:
        print(json.dumps({"resultado": "NO_DATA", "nota": f"No hay unidades cargadas para '{args.slug}'"}, ensure_ascii=False, indent=2))
        return
    if args.unidad:
        unidades = [u for u in unidades if u.get("unidad") == args.unidad]
        if not unidades:
            print(json.dumps({"resultado": "NO_DATA", "nota": f"Unidad '{args.unidad}' no encontrada en '{args.slug}'"}, ensure_ascii=False, indent=2))
            return
    salida = []
    for u in unidades:
        salida.append({**u, "_price_m2": price_m2(u)})
    print(json.dumps(salida, ensure_ascii=False, indent=2))


def cmd_cocheras(args):
    cocheras = cargar_cocheras(args.slug)
    if not cocheras:
        print(json.dumps({"resultado": "NO_DATA", "nota": f"No hay cocheras cargadas para '{args.slug}'"}, ensure_ascii=False, indent=2))
        return
    if args.numero:
        cocheras = [c for c in cocheras if c.get("numero") == args.numero]
        if not cocheras:
            print(json.dumps({"resultado": "NO_DATA", "nota": f"Cochera '{args.numero}' no encontrada en '{args.slug}'"}, ensure_ascii=False, indent=2))
            return
    print(json.dumps(cocheras, ensure_ascii=False, indent=2))


def investment_asset(slug, unidad_id, cochera_num=None):
    """SS13 -- INVESTMENT_ASSET: unidad sola vs. unidad+cochera. Funcion pura,
    reutilizable por otras skills (ver skills/investor-report-30, SK-18) sin
    pasar por el CLI ni reimplementar esta logica."""
    unidades = cargar_unidades(slug)
    unidad = next((u for u in unidades if u.get("unidad") == unidad_id), None)
    if unidad is None:
        return {"resultado": "NO_DATA", "nota": f"Unidad '{unidad_id}' no encontrada en '{slug}'"}

    cochera = None
    if cochera_num:
        cocheras = cargar_cocheras(slug)
        cochera = next((c for c in cocheras if c.get("numero") == cochera_num and c.get("vinculada_a_unidad") == unidad_id), None)
        if cochera is None:
            return {
                "resultado": "INSUFFICIENT_DATA",
                "nota": (f"Cochera '{cochera_num}' no esta registrada como vinculada a la unidad "
                         f"'{unidad_id}' en parking.csv -- no se arma el activo combinado sin ese "
                         f"vinculo explicito (SS12: nunca sumar una cochera si el proyecto no establece "
                         f"que corresponda)."),
            }

    precio_unidad_sola = unidad.get("precio_vigente_usd") or unidad.get("precio_lista_usd")
    precio_combinado = unidad.get("precio_combinado_con_cochera_usd")

    return {
        "unidad": unidad,
        "cochera": cochera,
        "vinculacion_declarada": unidad.get("cochera_vinculacion") or "DESCONOCIDA",
        "con_cochera": {
            "incluida_en_precio": bool(precio_combinado) and not precio_unidad_sola,
            "precio_usd": precio_combinado or None,
            "nota": ("El precio combinado ya incluye la cochera segun el dato fuente -- no se suma nada "
                     "aparte." if precio_combinado else "Sin precio combinado registrado."),
        },
        "sin_cochera": {
            "precio_usd": precio_unidad_sola or None,
            "nota": ("Precio propio de la unidad, sin cochera." if precio_unidad_sola else
                     "No hay un precio de la unidad SOLA registrado -- el unico precio disponible esta "
                     "combinado con la cochera (precio_combinado_con_cochera_usd), y este script NO lo "
                     "desagrega inventando un valor de cochera (SS61)."),
        },
        "_price_m2": price_m2(unidad),
    }


def cmd_activo(args):
    resultado = investment_asset(args.slug, args.unidad, args.cochera)
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description="project-unit-database (SK-15)")
    sub = parser.add_subparsers(dest="comando", required=True)

    p1 = sub.add_parser("proyecto", help="Ficha maestra del proyecto (SS5)")
    p1.add_argument("--slug", required=True)
    p1.set_defaults(func=cmd_proyecto)

    p2 = sub.add_parser("unidades", help="Unit Database (SS8)")
    p2.add_argument("--slug", required=True)
    p2.add_argument("--unidad", default=None)
    p2.set_defaults(func=cmd_unidades)

    p3 = sub.add_parser("cocheras", help="Parking Database (SS11)")
    p3.add_argument("--slug", required=True)
    p3.add_argument("--numero", default=None)
    p3.set_defaults(func=cmd_cocheras)

    p4 = sub.add_parser("activo", help="INVESTMENT_ASSET -- unidad +/- cochera (SS13)")
    p4.add_argument("--slug", required=True)
    p4.add_argument("--unidad", required=True)
    p4.add_argument("--cochera", default=None)
    p4.set_defaults(func=cmd_activo)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
