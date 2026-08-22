#!/usr/bin/env python3
"""
CLI para refrescar el cache de cotizacion USD/PYG que usa dev_engine.

Uso:
  python3 -m dev_engine.refrescar_tipo_cambio                  # fetch en vivo (open.er-api.com)
  python3 -m dev_engine.refrescar_tipo_cambio --bcp 7250 2026-08-22   # carga manual, cotizacion oficial BCP

Correr esto antes de un analisis real con costos en PYG, o periodicamente (el
cache se rechaza automaticamente si tiene mas de 7 dias, ver cotizacion.py).
"""

import sys

from dev_engine.cotizacion import (
    obtener_cotizacion_live, fuente_bcp_manual, refrescar_cache, CACHE_PATH_DEFAULT,
)


def main():
    if len(sys.argv) >= 4 and sys.argv[1] == "--bcp":
        valor, fecha = float(sys.argv[2]), sys.argv[3]
        dato = fuente_bcp_manual(valor, fecha)
        print(f"Cargando cotizacion MANUAL del BCP: {valor} PYG/USD ({fecha})")
    else:
        print("Consultando open.er-api.com...")
        try:
            dato = obtener_cotizacion_live()
        except Exception as e:
            print(f"ERROR: no se pudo obtener la cotizacion en vivo ({e}).")
            print("Alternativa: cargar a mano la cotizacion del BCP con:")
            print("  python3 -m dev_engine.refrescar_tipo_cambio --bcp <valor> <YYYY-MM-DD>")
            return 1
        print(f"Obtenido: {dato['valor']:.2f} PYG/USD (fuente: {dato['fuente']})")

    ruta = refrescar_cache(CACHE_PATH_DEFAULT, dato)
    print(f"Cache actualizado: {ruta}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
