#!/usr/bin/env python3
"""
Demuestra investor_layer.py (S63-S64): corre el Angulo 2 con el cash flow realista
ya construido en demo_flujo_realista_angulo2.py y exporta el JSON que un generador
de Investor Book/Memorandum deberia consumir en vez de recibir numeros a mano.
"""

import json
from dev_engine.demo_flujo_realista_angulo2 import main as correr_angulo2
from dev_engine.investor_layer import capa_inversor, exportar_json, exportar_json_interno

OUT_DIR = "../../../contracts/cases/HERRERA-001/entregables"


def main():
    resultado = correr_angulo2()

    print("\n" + "=" * 78)
    print("Capa de datos para inversor (confidencial oculto: cost_bridge, financiamiento, flujo_mensual)")
    print("=" * 78)
    print(json.dumps(capa_inversor(resultado), indent=2, ensure_ascii=False))

    ruta_inversor = exportar_json(resultado, f"{OUT_DIR}/HERRERA-001_dev_engine_investor_export.json")
    ruta_interna = exportar_json_interno(resultado, f"{OUT_DIR}/HERRERA-001_dev_engine_export_interno.json")
    print(f"\nExportado (version inversor, sin datos confidenciales): {ruta_inversor}")
    print(f"Exportado (version interna, completa -- NUNCA enviar a un inversor): {ruta_interna}")


if __name__ == "__main__":
    main()
