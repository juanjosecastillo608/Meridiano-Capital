#!/usr/bin/env python3
"""
Orquestador del workflow WF-03 (nuevo-proyecto-inmobiliario).

Corre en secuencia market-intelligence-lookup (SK-11) sobre el barrio del
proyecto nuevo, y arma un diagnostico de cobertura: que datos YA existen
en el sistema vs. que hace falta relevar -- antes de salir a investigar
desde cero (regla "nuevo proyecto != nueva base", D-063 a D-073).

No reemplaza el analisis completo -- es el primer paso automatizado del
WORKFLOW.md, para no reconstruir manualmente lo que ya esta en
knowledge-base/investment/market-intelligence/.

Uso:
    python iniciar_diagnostico.py --barrio "Villa Morra" --tipo-proyecto "desarrollo nuevo"
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
LOOKUP_SCRIPT = REPO_ROOT / "skills" / "market-intelligence-lookup" / "consultar.py"


def correr_lookup(barrio):
    proc = subprocess.run(
        [sys.executable, str(LOOKUP_SCRIPT), "--barrio", barrio],
        capture_output=True, text=True, check=True,
    )
    return json.loads(proc.stdout)


def main():
    parser = argparse.ArgumentParser(description="WF-03 — diagnostico inicial de un proyecto inmobiliario nuevo")
    parser.add_argument("--barrio", required=True)
    parser.add_argument("--tipo-proyecto", required=True,
                         help='Ej: "desarrollo nuevo", "compra de terreno", "compra de unidad terminada", '
                              '"analisis de venta/tasacion"')
    args = parser.parse_args()

    lookup = correr_lookup(args.barrio)

    cobertura = {}
    for dataset in ("rentals", "airbnb", "sales", "comparables", "neighborhoods"):
        info = lookup.get(dataset, {})
        cobertura[dataset] = info.get("total_filas_con_dato", 0)

    diagnostico = {
        "proyecto": {"barrio": args.barrio, "tipo_de_proyecto": args.tipo_proyecto},
        "cobertura_de_market_intelligence": cobertura,
        "hay_suficiente_dato_real": sum(cobertura.values()) >= 3,
        "siguiente_paso_recomendado": [],
    }

    if cobertura["comparables"] == 0:
        diagnostico["siguiente_paso_recomendado"].append(
            "Sin comparables de venta en pozo para esta zona -- relevar en Century 21/RE/MAX/InfoCasas "
            "(mismo metodo que HERRERA-001/37) y agregarlos a market-intelligence/comparables/, no solo "
            "al caso nuevo.")
    if cobertura["rentals"] == 0:
        diagnostico["siguiente_paso_recomendado"].append(
            "Sin tarifas de alquiler para esta zona -- relevar y agregar a market-intelligence/rentals/.")
    if cobertura["neighborhoods"] == 0:
        diagnostico["siguiente_paso_recomendado"].append(
            "Sin categoria de zona confirmada -- consultar Place Analyzer / ranking de barrios "
            "(ver market-intelligence/neighborhoods/) antes de posicionar el proyecto.")
    if not diagnostico["siguiente_paso_recomendado"]:
        diagnostico["siguiente_paso_recomendado"].append(
            "Cobertura de Market Intelligence suficiente para arrancar el analisis con datos ya existentes "
            "-- correr construction-cost-engine (SK-12) y market-price-validation (SK-13) con estos datos "
            "antes de investigar nada nuevo.")

    diagnostico["_detalle_completo_del_lookup"] = lookup

    print(json.dumps(diagnostico, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
