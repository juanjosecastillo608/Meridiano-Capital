#!/usr/bin/env python3
"""
Paso LEARNING del workflow WF-02 (rentabilidad-evaluation).

Evalua una propiedad (via la skill rentabilidad-calculator / calculadora.py,
sin reimplementar la logica) y agrega el resultado a un historial local en
JSON Lines, para poder calibrar futuros ajustes de parametros con casos
reales -- el mismo patron que ya se uso a mano para auditar Habitalis 9A y
Edificio Austria.

El historial (historial_evaluaciones.jsonl) esta gitignored: puede contener
direcciones/precios de propiedades especificas, mismo tratamiento que
production/app/backend/data/*.jsonl.

Uso:
    python registrar_evaluacion.py --clase comercial --precio 100000 --renta 1000 --nota "..."
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent / "production" / "app" / "backend"
sys.path.insert(0, str(BACKEND_DIR))
from calculadora import Calculadora  # noqa: E402
from advertencias import advertencias_renta  # noqa: E402

HISTORIAL_FILE = Path(__file__).resolve().parent / "historial_evaluaciones.jsonl"


def main():
    parser = argparse.ArgumentParser(description="Registrar una evaluacion de rentabilidad (WF-02, paso LEARNING)")
    parser.add_argument("--clase", required=True)
    parser.add_argument("--precio", type=float, required=True)
    parser.add_argument("--renta", type=float, required=True)
    parser.add_argument("--nivel", type=int, default=3, choices=[1, 2, 3])
    parser.add_argument("--nota", default="", help="Contexto libre: direccion, fuente, fecha de visita, etc.")
    args = parser.parse_args()

    calc = Calculadora()
    resultado = calc.evaluar_renta(args.clase, args.precio, args.renta, nivel_neto=args.nivel)
    resultado["advertencias"] = advertencias_renta(calc, args.clase)

    entrada = {
        "registrado_en": datetime.now(timezone.utc).isoformat(),
        "nota": args.nota,
        "resultado": resultado,
    }
    HISTORIAL_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORIAL_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entrada, ensure_ascii=False) + "\n")

    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    print(f"\nRegistrado en {HISTORIAL_FILE}", file=sys.stderr)


if __name__ == "__main__":
    main()
