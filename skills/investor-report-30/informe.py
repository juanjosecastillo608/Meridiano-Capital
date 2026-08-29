#!/usr/bin/env python3
"""
CLI de la skill investor-report-30 (SK-18).

Implementa SS51 (Informe para el inversor) de
documentation/investment-sales-rental-market-engine/00-especificacion-v1.md
(D-084) -- adopta la estructura exacta de 30 puntos como plantilla estandar,
ensamblando datos YA REALES de las 4 piezas ya construidas de esta
especificacion, sin recalcular ni reimplementar nada de su logica:

  1-11  project-unit-database (SK-15) -- proyecto, ubicacion, unidad, cochera, precio
  2-3   geocoding-engine (SK-16) -- Google Maps, location_status
  12-15 rental-amc-engine (SK-14) -- AMC, comparables, rango de alquiler
  16-22 calculadora.py (evaluar_renta) -- ingreso, vacancia, gastos, rentabilidad
  23-25 calculadora.py x3 -- escenarios pesimista/base/optimista, usando el
        rango LOW/BASE/HIGH del AMC como renta de cada escenario (mismo
        patron que D-086 aplico a mano para la Unidad 105 de UON Calathea)
  26-30 ensamblado -- riesgos (agrega TODAS las advertencias de los pasos
        anteriores, no inventa una lista aparte), supuestos, fuentes, fecha,
        conclusion (borrador automatico, marcado como tal)

Este script es un ENSAMBLADOR, no un motor nuevo -- cada numero sale de una
llamada real a un modulo ya existente y verificado. Si un dato fuente falta,
el campo correspondiente queda NO_DATA explicito (SS61); nunca se completa a
mano por encima del resultado.

Uso:
    python informe.py generar --slug uon-calathea --unidad 105 --cochera 10 \
        --clase departamento_sin_muebles --nivel-neto 3 \
        --amc-snapshot knowledge-base/investment/market-intelligence/rentals/amc-snapshots/uon-calathea-105/AMC-001.json \
        --target-yield-neto 8
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "skills" / "project-unit-database"))
sys.path.insert(0, str(ROOT / "skills" / "target-yield-tools"))
sys.path.insert(0, str(ROOT / "production" / "app" / "backend"))
from consultar import cargar_proyecto, investment_asset  # noqa: E402
from herramientas import alquiler_requerido  # noqa: E402
from calculadora import Calculadora  # noqa: E402


def _precio_a_usar(activo, precio_override, con_cochera):
    if precio_override is not None:
        return precio_override, "precio pasado explicitamente por --precio-compra"
    if con_cochera and activo.get("con_cochera", {}).get("precio_usd"):
        return activo["con_cochera"]["precio_usd"], "con_cochera.precio_usd (project-unit-database)"
    if activo.get("sin_cochera", {}).get("precio_usd"):
        return activo["sin_cochera"]["precio_usd"], "sin_cochera.precio_usd (project-unit-database)"
    return None, None


def _cargar_amc(ruta):
    if not ruta:
        return None, ["Sin --amc-snapshot -- puntos 12-15 (AMC, comparables, rango de alquiler) quedan NO_DATA. "
                       "Correr rental-amc-engine (SK-14) antes de armar este informe (SS61: no inventar renta de mercado)."]
    p = Path(ruta)
    if not p.exists():
        return None, [f"--amc-snapshot '{ruta}' no existe -- puntos 12-15 quedan NO_DATA."]
    with open(p, encoding="utf-8") as f:
        return json.load(f), []


def generar(slug, unidad_id, cochera_num, clase, nivel_neto, amc_ruta,
            precio_override=None, ocupacion_pct=None, target_yield_neto=None,
            gastos_reales=None, ruta_config=None):
    riesgos, supuestos, fuentes = [], [], []

    # --- 1-11: project-unit-database + geocoding-engine ---
    proyecto = cargar_proyecto(slug)
    if proyecto is None:
        return {"resultado": "NO_DATA", "nota": f"Proyecto '{slug}' no existe en project-unit-database."}
    fuentes.append(f"knowledge-base/investment/projects/{slug}/project.json")

    activo = investment_asset(slug, unidad_id, cochera_num)
    if activo.get("resultado") in ("NO_DATA", "INSUFFICIENT_DATA"):
        return activo
    fuentes.append(f"knowledge-base/investment/projects/{slug}/units.csv (+ parking.csv si hay cochera)")

    precio_compra, fuente_precio = _precio_a_usar(activo, precio_override, con_cochera=bool(cochera_num))
    if precio_compra is None:
        return {"resultado": "NO_DATA", "nota": "Sin precio de compra disponible (ni en la fuente ni por --precio-compra) -- SS61."}
    precio_compra = float(precio_compra)

    if proyecto.get("location_status") == "UNVERIFIED":
        riesgos.append("Ubicación del proyecto sin geocodificar (location_status=UNVERIFIED) -- correr geocoding-engine (SK-16) antes de confiar en el área de mercado del AMC.")
    if proyecto.get("_nota_location_status") and "Discrepancia" in proyecto.get("_nota_location_status", ""):
        riesgos.append("Discrepancia de barrio sin resolver entre el dato registral y el geocoder real (ver project.json > _nota_location_status).")

    if activo["unidad"].get("tipologia_confirmada") in ("false", False):
        riesgos.append(f"Tipología '{activo['unidad'].get('tipologia')}' NO confirmada por el desarrollador (categoria_dato={activo['unidad'].get('categoria_dato')}) -- es una inferencia, no un dato verificado.")
    if activo["unidad"].get("observaciones"):
        riesgos.append(f"Observación registrada en la unidad: {activo['unidad']['observaciones']}")
    if activo.get("cochera", {}) and activo["cochera"].get("observaciones"):
        riesgos.append(f"Observación registrada en la cochera: {activo['cochera']['observaciones']}")

    bloque_1_11 = {
        "1_proyecto": proyecto.get("nombre_proyecto"),
        "2_ubicacion": {"direccion": proyecto.get("direccion"), "barrio": proyecto.get("barrio"), "ciudad": proyecto.get("ciudad")},
        "3_google_maps": {"url": proyecto.get("google_maps_url"), "location_status": proyecto.get("location_status")},
        "4_unidad_seleccionada": unidad_id,
        "5_tipologia": {"valor": activo["unidad"].get("tipologia"), "confirmada": activo["unidad"].get("tipologia_confirmada")},
        "6_piso": activo["unidad"].get("piso"),
        "7_superficie": {"propia_m2": activo["unidad"].get("superficie_propia_m2"), "total_m2": activo["unidad"].get("superficie_total_m2")},
        "8_cochera": activo.get("cochera") or "Sin cochera vinculada",
        "9_precio_de_compra": {"usd": precio_compra, "fuente": fuente_precio,
                                 "nota": "Este motor todavia no distingue LIST/NEGOTIATED/EFFECTIVE PURCHASE PRICE (SS15, Client Purchase Scenario SS14 no construido) -- es el precio ya cargado en project-unit-database, no necesariamente el precio negociado real de una operacion concreta."},
        "10_costos_adicionales": {"estado": "NOT_INCLUDED", "nota": "TOTAL INVESTMENT COST (SS16 -- escribania, honorarios, transferencia, amoblamiento) no tiene fuente cargada para esta unidad. No se estima ni se inventa (SS61)."},
        "11_inversion_total": {"usd": precio_compra, "nota": "= precio de compra solamente (ver punto 10, sin costos adicionales sumados)."},
    }

    # --- 12-15: rental-amc-engine ---
    amc, amc_avisos = _cargar_amc(amc_ruta)
    riesgos.extend(amc_avisos)
    renta_mensual = None
    bloque_12_15 = {"12_amc": None, "13_comparables": None, "14_rango_de_alquiler": None, "15_alquiler_recomendado": None}
    if amc:
        fuentes.append(str(amc_ruta))
        bloque_12_15["12_amc"] = {"amc_id": amc.get("amc_id"), "fecha": amc.get("fecha"), "amc_status": amc.get("amc_status"), "confianza": amc.get("confianza")}
        bloque_12_15["13_comparables"] = {"top_3": amc.get("top_3"), "descartados": amc.get("descartados"), "fuentes_status": amc.get("fuentes_status")}
        bloque_12_15["14_rango_de_alquiler"] = amc.get("renta_mercado")
        if amc.get("renta_mercado"):
            renta_mensual = amc["renta_mercado"]["base_usd_mes"]
            bloque_12_15["15_alquiler_recomendado"] = {"usd_mes": renta_mensual, "nota": "BASE del AMC -- ver rango LOW/HIGH completo en el punto 14, nunca mostrar solo este numero (SS26)."}
        riesgos.extend(amc.get("advertencias", []))
        if amc.get("confianza") == "LOW":
            riesgos.append("AMC de confianza LOW -- el alquiler recomendado no debe presentarse como certeza (SS30).")

    # --- 16-25: calculadora.py ---
    calc = Calculadora(ruta_config)
    bloque_16_25 = {k: None for k in (
        "16_ingreso_bruto", "17_vacancia", "18_gastos", "19_ingreso_neto",
        "20_rentabilidad_bruta", "21_rentabilidad_neta", "22_flujo_de_fondos",
        "23_escenario_conservador", "24_escenario_base", "25_escenario_optimista",
    )}
    if renta_mensual:
        r = calc.evaluar_renta(clase, precio_compra, renta_mensual, nivel_neto=nivel_neto,
                                gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct)
        bloque_16_25.update({
            "16_ingreso_bruto": round(renta_mensual * 12.0, 2),
            "17_vacancia": r["desglose_gastos"].get("vacancia"),
            "18_gastos": r["desglose_gastos"],
            "19_ingreso_neto": r["neto_anual"],
            "20_rentabilidad_bruta": r["yield_bruto_pct"],
            "21_rentabilidad_neta": r["yield_neto_pct"],
            "22_flujo_de_fondos": {"neto_mensual_usd": round(r["neto_anual"] / 12.0, 2),
                                    "nota": "Ingreso neto mensual simple -- no es un flujo de fondos multi-anual (eso es dev_engine, para proyectos de desarrollo, no para compra de una unidad existente)."},
        })
        if r.get("pasa_piso") is False:
            riesgos.append(f"No pasa el piso de rentabilidad de Meridiano para la clase '{clase}' (piso {r.get('piso_pct')}% bruto, yield bruto real {r['yield_bruto_pct']}%).")
        supuestos.append(f"nivel_neto={nivel_neto}, ocupacion_pct={ocupacion_pct if ocupacion_pct is not None else 'default de config'}, gastos_reales={'override pasado' if gastos_reales else 'default de config'}")

        rango = amc.get("renta_mercado") if amc else None
        if rango:
            for etiqueta, campo, clave in (("23_escenario_conservador", "low_usd_mes", "pesimista"),
                                            ("24_escenario_base", "base_usd_mes", "base"),
                                            ("25_escenario_optimista", "high_usd_mes", "optimista")):
                renta_e = rango.get(campo)
                if renta_e:
                    re_ = calc.evaluar_renta(clase, precio_compra, renta_e, nivel_neto=nivel_neto,
                                              gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct)
                    bloque_16_25[etiqueta] = {"renta_mensual_usd": renta_e, "yield_bruto_pct": re_["yield_bruto_pct"],
                                               "yield_neto_pct": re_["yield_neto_pct"], "neto_anual_usd": re_["neto_anual"],
                                               "pasa_piso": re_["pasa_piso"]}
    else:
        riesgos.append("Sin alquiler de mercado (AMC) -- puntos 16-25 (ingreso, gastos, rentabilidad, escenarios) quedan NO_DATA. No se estima una renta a ojo (SS61).")

    # --- target yield opcional (SS45-47), no es uno de los 30 puntos pero se agrega si se pide ---
    bloque_target_yield = None
    if target_yield_neto is not None and renta_mensual:
        rango = amc.get("renta_mercado") if amc else {}
        bloque_target_yield = alquiler_requerido(
            clase, precio_compra, target_yield_neto, nivel_neto=nivel_neto,
            gastos_reales=gastos_reales, ocupacion_pct=ocupacion_pct,
            renta_mercado_low=rango.get("low_usd_mes"), renta_mercado_base=rango.get("base_usd_mes"),
            renta_mercado_high=rango.get("high_usd_mes"), ruta_config=ruta_config,
        )
        if bloque_target_yield.get("ss47_advertencia"):
            riesgos.append(bloque_target_yield["ss47_advertencia"])

    # --- 26-30: ensamblado ---
    if renta_mensual:
        veredicto = "pasa" if r.get("pasa_piso") else "no pasa"
        resumen_rentabilidad = (f"Yield neto {r['yield_neto_pct']}% a un precio de USD {precio_compra:,.0f}, "
                                 f"{veredicto} el piso de rentabilidad de la clase '{clase}'. ")
    else:
        resumen_rentabilidad = "Sin AMC, no hay base para una conclusión de rentabilidad. "

    bloque_26_30 = {
        "26_riesgos": riesgos or ["Ninguno detectado automáticamente por este ensamblador -- no reemplaza el criterio humano."],
        "27_supuestos": supuestos or ["Ninguno explícito más allá de los defaults de config."],
        "28_fuente_de_datos": fuentes,
        "29_fecha_de_actualizacion": str(date.today()),
        "30_conclusion": (
            "BORRADOR AUTOMÁTICO -- no reemplaza la redacción final para el inversor. "
            + resumen_rentabilidad
            + f"{len(riesgos)} riesgo(s)/advertencia(s) detectados automáticamente, listados en el punto 26 -- revisar antes de presentar al inversor."
        ),
    }

    resultado = {**bloque_1_11, **bloque_12_15, **bloque_16_25, **bloque_26_30}
    if bloque_target_yield:
        resultado["target_yield_tools_ss45_47"] = bloque_target_yield
    return resultado


def main():
    parser = argparse.ArgumentParser(description="investor-report-30 (SK-18) -- SS51")
    sub = parser.add_subparsers(dest="comando", required=True)
    p = sub.add_parser("generar", help="Ensambla el informe de 30 puntos para una unidad")
    p.add_argument("--slug", required=True)
    p.add_argument("--unidad", required=True)
    p.add_argument("--cochera", default=None)
    p.add_argument("--clase", required=True)
    p.add_argument("--nivel-neto", type=int, default=3)
    p.add_argument("--amc-snapshot", default=None)
    p.add_argument("--precio-compra", type=float, default=None)
    p.add_argument("--ocupacion-pct", type=float, default=None)
    p.add_argument("--target-yield-neto", type=float, default=None)
    p.add_argument("--gastos-reales", default=None)
    args = parser.parse_args()

    gastos_reales = json.load(open(args.gastos_reales, encoding="utf-8")) if args.gastos_reales else None
    resultado = generar(args.slug, args.unidad, args.cochera, args.clase, args.nivel_neto,
                         args.amc_snapshot, precio_override=args.precio_compra,
                         ocupacion_pct=args.ocupacion_pct, target_yield_neto=args.target_yield_neto,
                         gastos_reales=gastos_reales)
    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
