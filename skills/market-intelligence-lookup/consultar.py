#!/usr/bin/env python3
"""
CLI de la skill market-intelligence-lookup (SK-11).

Consulta unificada sobre TODAS las bases de knowledge-base/investment/market-intelligence/
(rentals, airbnb, sales, comparables, neighborhoods) filtrando por barrio y,
opcionalmente, tipologia -- sin tener que abrir CSV por CSV a mano.

Nunca inventa un dato que no este en los CSV: si no hay filas que matcheen,
lo dice explicitamente en vez de devolver un resultado vacio sin contexto.

Uso:
    python consultar.py --barrio "Luis A. de Herrera"
    python consultar.py --barrio "Ycua Sati" --tipologia "1 dormitorio"
    python consultar.py --barrio "Herrera" --dataset comparables
"""

import argparse
import csv
import json
import sys
import unicodedata
from pathlib import Path

MI_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge-base" / "investment" / "market-intelligence"

DATASETS = {
    "rentals": MI_DIR / "rentals" / "data" / "tarifas-alquiler-por-barrio-asuncion.csv",
    "airbnb": MI_DIR / "airbnb" / "data" / "tarifas-airbnb-por-barrio-asuncion.csv",
    "sales": MI_DIR / "sales" / "data" / "valor-m2-venta-por-barrio-calidad-etapa.csv",
    "comparables": MI_DIR / "comparables" / "data" / "comparables-venta-en-pozo-asuncion.csv",
    "neighborhoods": MI_DIR / "neighborhoods" / "data" / "categoria-de-zona-por-barrio-asuncion.csv",
}

# columna que trae el nombre de barrio en cada dataset (no es siempre la misma)
BARRIO_COL = {
    "rentals": "Barrio",
    "airbnb": "Barrio",
    "sales": "Barrio",
    "comparables": "Zona/Barrio",
    "neighborhoods": "Barrio",
}
TIPOLOGIA_COL = {
    "rentals": "Tipologia",
    "airbnb": "Tipologia",
    "sales": "Tipologia",
    "comparables": "Tipologia",
    "neighborhoods": None,
}


def normalizar(s):
    if s is None:
        return ""
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    return s.lower().strip()


def leer_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def filtrar(rows, barrio_col, tipologia_col, barrio, tipologia):
    barrio_n = normalizar(barrio)
    tip_n = normalizar(tipologia) if tipologia else None
    out = []
    for r in rows:
        campo_barrio = normalizar(r.get(barrio_col, ""))
        if barrio_n not in campo_barrio:
            continue
        if tip_n and tipologia_col:
            if tip_n not in normalizar(r.get(tipologia_col, "")):
                continue
        # descartar filas categoria D sin ningun valor cargado -- no aportan nada a la consulta.
        # Columnas descriptivas (no son "el dato" en si) se excluyen del chequeo de vacio.
        COLS_DESCRIPTIVAS = ("Categoria de dato", "Barrio", "Zona/Barrio", "Tipologia", "Tipo de alquiler",
                              "Unidad", "Proyecto", "Fecha de actualizacion", "Fecha de relevamiento",
                              "Notas", "Confianza", "Vigencia")
        if r.get("Categoria de dato", "").strip().upper() == "D" and not any(
            v.strip() for k, v in r.items() if k not in COLS_DESCRIPTIVAS
        ):
            continue
        out.append(r)
    return out


def main():
    parser = argparse.ArgumentParser(description="market-intelligence-lookup (SK-11)")
    parser.add_argument("--barrio", required=True, help="Nombre (o parte) del barrio a buscar")
    parser.add_argument("--tipologia", default=None, help="Filtrar ademas por tipologia (monoambiente, 1 dormitorio, etc.)")
    parser.add_argument("--dataset", default=None, choices=list(DATASETS.keys()),
                         help="Limitar la consulta a un solo dataset. Si se omite, consulta los 5.")
    args = parser.parse_args()

    datasets_a_consultar = [args.dataset] if args.dataset else list(DATASETS.keys())
    resultado = {}
    for nombre in datasets_a_consultar:
        path = DATASETS[nombre]
        if not path.exists():
            resultado[nombre] = {"error": f"archivo no encontrado: {path}"}
            continue
        rows = leer_csv(path)
        matches = filtrar(rows, BARRIO_COL[nombre], TIPOLOGIA_COL[nombre], args.barrio, args.tipologia)
        resultado[nombre] = {
            "total_filas_con_dato": len(matches),
            "filas": matches,
        }

    total = sum(v.get("total_filas_con_dato", 0) for v in resultado.values() if isinstance(v, dict))
    resultado["_resumen"] = {
        "barrio_consultado": args.barrio,
        "tipologia_consultada": args.tipologia,
        "total_resultados_con_dato_real": total,
        "nota": ("Sin resultados con dato real para este barrio/tipologia en ninguna base — "
                 "no inventar un valor, marcar como pendiente de relevar." if total == 0 else
                 "Filas categoria D (pendientes, sin ningun valor cargado) fueron omitidas del resultado."),
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
