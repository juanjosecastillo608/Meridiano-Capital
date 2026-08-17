#!/usr/bin/env python3
"""
CLI de la skill construction-cost-engine (SK-12).

Implementa knowledge-base/investment/methodologies/motor-de-costos.md:
dado tipo de construccion + calidad target + superficie (+ opcionalmente
% de incidencia estructural para obra parcial), devuelve un costo estimado
bajo/base/alto usando las tasas reales de
knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md
(D-064) -- nunca un numero inventado.

Uso:
    python estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 3200
    python estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 3200 --incidencia-estructural 21
"""

import argparse
import json
import sys

# Tabla real de knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md (D-064)
# Fuente: founder, 2026-08-15, "Tabla de Costos M2 construccion segun Tipo de Construccion y calidad.xlsx"
TABLA_COSTOS = {
    "Tinglados / Depositos": {"Basica": 350},
    "Tinglados / Depositos con oficinas": {"Estandar": 400},
    "Depositos con oficinas y locales comerciales": {"Estandar": 450},
    "Edificios departamentos en altura": {"Basica": 650, "Estandar": 720, "Estandar+DVH": 750},
    "Casas / Duplex": {"Basica": 550, "Estandar": 650, "Estandar+DVH": 850},
    "Remodelacion sobre obra ya existente (casas/duplex/deptos)": {"Basica": 350, "Estandar": 450},
}

FUENTE = "knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md (D-064)"
FECHA_FUENTE = "2026-08-15"


def calcular_neto_de_incidencia(tasa, incidencia_pct):
    """netting-estructura-terminacion.md paso 2: tasa x (1 - % incidencia estructural)."""
    return round(tasa * (1 - incidencia_pct / 100), 2)


def main():
    parser = argparse.ArgumentParser(description="construction-cost-engine (SK-12)")
    parser.add_argument("--tipo", required=True, choices=list(TABLA_COSTOS.keys()))
    parser.add_argument("--calidad", required=True, help="Calidad target del proyecto (Basica/Estandar/Estandar+DVH)")
    parser.add_argument("--superficie", type=float, required=True, help="Superficie total a construir (m2)")
    parser.add_argument("--incidencia-estructural", type=float, default=None,
                         help="Solo si es obra sobre estructura parcial existente: %% de incidencia "
                              "estructural confirmado por un ingeniero del proyecto (NO un default del sistema)")
    args = parser.parse_args()

    calidades_disponibles = TABLA_COSTOS[args.tipo]
    if args.calidad not in calidades_disponibles:
        print(json.dumps({
            "error": f"Calidad '{args.calidad}' no esta en la tabla para '{args.tipo}'.",
            "calidades_disponibles": list(calidades_disponibles.keys()),
            "nota": "No se inventa una tasa para una calidad no confirmada por el founder.",
        }, ensure_ascii=False, indent=2))
        sys.exit(1)

    tasas = calidades_disponibles
    tasa_basica = tasas.get("Basica")
    tasa_target = tasas[args.calidad]
    tasa_alta = tasas.get("Estandar+DVH", tasa_target)

    confianza = "HIGH"
    if len(tasas) < 3:
        confianza = "MEDIUM"  # categoria sin las 3 calidades completas en la tabla real

    resultado = {
        "inputs": {
            "tipo_de_construccion": args.tipo,
            "calidad_target": args.calidad,
            "superficie_m2": args.superficie,
            "incidencia_estructural_pct": args.incidencia_estructural,
        },
        "tasas_usadas_usd_por_m2": {
            "bajo (Basica)": tasa_basica,
            "base (calidad target elegida)": tasa_target,
            "alto (Estandar+DVH, techo de referencia)": tasa_alta,
        },
        "fuente": FUENTE,
        "fecha_de_actualizacion_de_la_fuente": FECHA_FUENTE,
        "nivel_de_confianza": confianza,
    }

    if args.incidencia_estructural is not None:
        resultado["metodologia_aplicada"] = ("knowledge-base/investment/methodologies/"
                                              "netting-estructura-terminacion.md (obra sobre estructura parcial)")
        tasas_netas = {}
        for etiqueta, tasa in (("bajo", tasa_basica), ("base", tasa_target), ("alto", tasa_alta)):
            if tasa is None:
                continue
            tasas_netas[etiqueta] = calcular_neto_de_incidencia(tasa, args.incidencia_estructural)
        resultado["costo_de_terminacion_usd_por_m2"] = tasas_netas
        resultado["costo_de_terminacion_total_usd"] = {
            k: round(v * args.superficie, 2) for k, v in tasas_netas.items()
        }
        resultado["advertencia"] = (
            "El % de incidencia estructural NO es un supuesto del sistema -- requiere confirmacion de un "
            "ingeniero especifico de este proyecto. No reutilizar el valor de otro caso sin ese analisis."
        )
    else:
        resultado["metodologia_aplicada"] = "Costo directo (construccion 100% nueva, sin estructura previa)"
        resultado["costo_total_usd"] = {
            "bajo": round(tasa_basica * args.superficie, 2) if tasa_basica else None,
            "base": round(tasa_target * args.superficie, 2),
            "alto": round(tasa_alta * args.superficie, 2) if tasa_alta else None,
        }

    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
