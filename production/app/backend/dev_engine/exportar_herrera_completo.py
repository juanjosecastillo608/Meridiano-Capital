#!/usr/bin/env python3
"""
Exporta un JSON consolidado de los 3 Angulos de HERRERA-001 (bajo/alto cada uno),
para que los generadores de Word/PowerPoint (production/generadores/build_herrera001_*.js)
lean estos numeros en vez de tenerlos tipeados a mano -- cierra S64 del prompt
maestro "Development Cost & Financial Engine": una sola fuente de verdad para el
modelo financiero y los documentos de inversor.

Reutiliza construir_angulo() de validar_herrera.py -- la misma estructura de costos
ya validada dentro de 0,05% de tolerancia contra el caso real (S68) -- no se
redefine la logica de costos acá.
"""

import json
import os

from dev_engine.validar_herrera import construir_angulo, CONVERSOR

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..",
                        "contracts", "cases", "HERRERA-001", "entregables")

CASOS = [
    dict(clave="angulo_1", nombre="Ángulo 1 (tal cual)", unidades=21,
         m2_comercializable=1800, obra_nueva_usd=594_792.00,
         proyecto_usd=0.0, aprobaciones_usd=0.0,
         ingresos_bajo=3_567_637, ingresos_alto=4_218_165),
    dict(clave="angulo_3", nombre="Ángulo 3 (fachada+chicas, 6P)", unidades=29,
         m2_comercializable=1800, obra_nueva_usd=594_792.00,
         proyecto_usd=84_051.81, aprobaciones_usd=101_173.48,
         ingresos_bajo=3_820_500, ingresos_alto=4_097_250),
    dict(clave="angulo_2", nombre="Ángulo 2 (fachada+chicas+7P)", unidades=39,
         m2_comercializable=2100, obra_nueva_usd=810_792.00,
         proyecto_usd=122_869.08, aprobaciones_usd=101_173.48,
         ingresos_bajo=4_424_700, ingresos_alto=4_749_150),
]


def correr_bajo_alto(caso):
    r_bajo = construir_angulo(caso["nombre"], caso["m2_comercializable"], caso["obra_nueva_usd"],
                               caso["proyecto_usd"], caso["aprobaciones_usd"], caso["ingresos_bajo"])
    r_alto = construir_angulo(caso["nombre"], caso["m2_comercializable"], caso["obra_nueva_usd"],
                               caso["proyecto_usd"], caso["aprobaciones_usd"], caso["ingresos_alto"])
    return {
        "nombre": caso["nombre"],
        "unidades": caso["unidades"],
        "area_comercializable_m2": caso["m2_comercializable"],
        "inversion_total_usd": round(r_bajo.inversion_total_usd, 2),
        "costo_m2_comercializable_usd": round(r_bajo.inversion_total_usd / caso["m2_comercializable"], 2),
        "ingresos_bajo_usd": round(r_bajo.ingresos_totales_usd, 2),
        "ingresos_alto_usd": round(r_alto.ingresos_totales_usd, 2),
        "comision_bajo_usd": round(r_bajo.costo_comerciales_usd, 2),
        "comision_alto_usd": round(r_alto.costo_comerciales_usd, 2),
        "iva_desarrollador_usd": round(r_bajo.costo_impuestos_usd, 2),
        "margen_bajo_usd": round(r_bajo.margen_usd, 2),
        "margen_alto_usd": round(r_alto.margen_usd, 2),
        "roi_bajo_pct": round(r_bajo.margen_usd / r_bajo.inversion_total_usd * 100, 2),
        "roi_alto_pct": round(r_alto.margen_usd / r_alto.inversion_total_usd * 100, 2),
        # Desagregacion por item del costo (46-...md) -- para el cost bridge/pie chart
        "cost_items": {
            "terreno_usd": 360_000.00,
            "estructura_ya_construida_usd": 490_000.00,
            "terminacion_usd": 1_300_805.78,
            "obra_nueva_usd": caso["obra_nueva_usd"],
            "proyecto_usd": caso["proyecto_usd"],
            "aprobaciones_usd": caso["aprobaciones_usd"],
        },
    }


def main():
    datos = {
        "_meta": {
            "fuente": "dev_engine — Development Cost & Financial Engine de Meridiano Capital",
            "caso": "HERRERA-001",
            "generado_por": "production/app/backend/dev_engine/exportar_herrera_completo.py",
            "validado_contra": "contracts/cases/HERRERA-001/36-recosteo-720-e-iva-desarrollador-margen-final-definitivo.md "
                                "(reconstruccion 6/6 dentro de 0,05% de tolerancia, ver validar_herrera.py)",
        },
        "moneda": CONVERSOR.resumen(),
        "angulos": {caso["clave"]: correr_bajo_alto(caso) for caso in CASOS},
    }
    os.makedirs(OUT_DIR, exist_ok=True)
    ruta = os.path.join(OUT_DIR, "HERRERA-001_dev_engine_3angulos.json")
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)
    print(f"Exportado: {ruta}")
    print(json.dumps(datos, indent=2, ensure_ascii=False))
    return ruta


if __name__ == "__main__":
    main()
