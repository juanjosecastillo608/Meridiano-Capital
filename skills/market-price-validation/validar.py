#!/usr/bin/env python3
"""
CLI de la skill market-price-validation (SK-13).

Implementa knowledge-base/investment/methodologies/comparable-selection-engine.md
+ market-price-validation-engine.md: filtra comparables reales de
knowledge-base/investment/market-intelligence/comparables/, calcula el rango
de mercado (excluyendo outliers por IQR), y clasifica un precio propuesto
contra ese rango.

Uso:
    python validar.py --barrio "Ycua Sati" --precio-m2 1950
    python validar.py --barrio "Herrera" --tipologia "1 dormitorio" --precio-m2 1900
"""

import argparse
import csv
import json
import unicodedata
from pathlib import Path

COMPARABLES_CSV = (Path(__file__).resolve().parent.parent.parent / "knowledge-base" / "investment" /
                    "market-intelligence" / "comparables" / "data" / "comparables-venta-en-pozo-asuncion.csv")

UMBRAL_ABOVE_MARKET_PCT = 15  # criterio provisional documentado en market-price-validation-engine.md


def normalizar(s):
    if s is None:
        return ""
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    return s.lower().strip()


def leer_comparables():
    with open(COMPARABLES_CSV, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def filtrar_por_iqr(valores):
    """Excluye outliers por rango intercuartilico (heuristica -- confirmar con criterio humano,
    ver comparable-selection-engine.md #3)."""
    if len(valores) < 4:
        return valores, []
    s = sorted(valores)
    n = len(s)
    q1 = s[n // 4]
    q3 = s[(3 * n) // 4]
    iqr = q3 - q1
    low_fence, high_fence = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    dentro = [v for v in valores if low_fence <= v <= high_fence]
    fuera = [v for v in valores if not (low_fence <= v <= high_fence)]
    return dentro, fuera


def clasificar(precio, mercado_bajo, mercado_alto):
    if precio < mercado_bajo:
        return "BELOW MARKET"
    if precio <= mercado_alto:
        return "MARKET"
    diferencia_pct = (precio - mercado_alto) / mercado_alto * 100
    if diferencia_pct <= UMBRAL_ABOVE_MARKET_PCT:
        return "ABOVE MARKET"
    return "SIGNIFICANTLY ABOVE MARKET"


def validar_precio(barrio, precio_m2, tipologia=None):
    """
    Funcion pura, reutilizable desde otros modulos (ej. dev_engine, S20/S26)
    sin pasar por el CLI. Extraida de main() sin cambiar ni un valor -- mismo
    patron ya usado en skills/project-unit-database/consultar.py
    (cmd_activo() -> investment_asset()).
    """
    rows = leer_comparables()
    barrio_n = normalizar(barrio)
    tip_n = normalizar(tipologia) if tipologia else None

    filtrados = []
    for r in rows:
        if barrio_n not in normalizar(r.get("Zona/Barrio", "")):
            continue
        if tip_n and tip_n not in normalizar(r.get("Tipologia", "")):
            continue
        usd_m2 = r.get("USD por m2", "").strip()
        if not usd_m2:
            continue
        filtrados.append({**r, "_usd_m2": float(usd_m2)})

    if not filtrados:
        return {
            "resultado": "SIN COMPARABLES",
            "nota": (f"No hay comparables reales en knowledge-base/investment/market-intelligence/comparables/ "
                     f"para barrio='{barrio}' tipologia='{tipologia}'. No se puede validar el precio "
                     f"contra mercado real -- no inventar un rango. Considerar ampliar el radio de busqueda a "
                     f"zonas vecinas de perfil similar, documentando el ajuste."),
        }

    valores = [f["_usd_m2"] for f in filtrados]
    dentro, fuera = filtrar_por_iqr(valores)
    if not dentro:
        dentro = valores  # muestra muy chica, no descartar todo

    mercado_bajo, mercado_alto = min(dentro), max(dentro)
    mercado_medio = round(sum(dentro) / len(dentro), 2)
    clasificacion = clasificar(precio_m2, mercado_bajo, mercado_alto)

    return {
        "precio_propuesto_usd_m2": precio_m2,
        "comparables_encontrados": len(filtrados),
        "comparables_usados_tras_excluir_outliers": len(dentro),
        "comparables_excluidos_como_outlier": fuera,
        "mercado_bajo_usd_m2": mercado_bajo,
        "mercado_medio_usd_m2": mercado_medio,
        "mercado_alto_usd_m2": mercado_alto,
        "diferencia_vs_techo_pct": round((precio_m2 - mercado_alto) / mercado_alto * 100, 1),
        "clasificacion": clasificacion,
        "nivel_de_confianza": "HIGH" if len(dentro) >= 5 else ("MEDIUM" if len(dentro) >= 3 else "LOW"),
        "metodologia": ("knowledge-base/investment/methodologies/comparable-selection-engine.md + "
                         "market-price-validation-engine.md"),
        "fuente_de_los_comparables": str(COMPARABLES_CSV.relative_to(Path(__file__).resolve().parent.parent.parent)),
        "advertencia": ("Los comparables son precio de LISTA, no de cierre. La exclusion de outliers usa un "
                         "criterio estadistico (IQR) -- confirmar con criterio humano antes de descartar un "
                         "comparable real, ver comparable-selection-engine.md #3."),
    }


def main():
    parser = argparse.ArgumentParser(description="market-price-validation (SK-13)")
    parser.add_argument("--barrio", required=True)
    parser.add_argument("--tipologia", default=None)
    parser.add_argument("--precio-m2", type=float, required=True, help="Precio propuesto, USD/m2")
    args = parser.parse_args()

    resultado = validar_precio(args.barrio, args.precio_m2, args.tipologia)
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
