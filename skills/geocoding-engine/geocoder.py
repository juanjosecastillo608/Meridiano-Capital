#!/usr/bin/env python3
"""
CLI de la skill geocoding-engine (SK-16).

Implementa SS6 (Ubicacion) y SS17 (Google Maps + market area) de
documentation/investment-sales-rental-market-engine/00-especificacion-v1.md
(D-084) -- la pieza que la propia especificacion senalo como "siguiente,
sin ejecutar todavia" al cerrar D-085/086/087 (2026-08-24).

Este script NO geocodifica por si mismo -- no hay llamada de red aca adentro
(el mismo problema de entorno que documenta
production/app/backend/dev_engine/cotizacion.py: urllib falla por
verificacion SSL en este sandbox). El geocoding real lo hace el agente, via
WebFetch/Browser contra un proveedor real (Nominatim/OpenStreetMap y/o Google
Maps), citando la fuente exacta. Este script recibe esas coordenadas YA
OBTENIDAS y hace la parte determinista: distancia real (Haversine), el nivel
de prioridad de zona de mercado de SS17, y el guardado versionado en
project.json -- nunca inventa una coordenada (SS6: "No inventar coordenadas").

Uso:
    python geocoder.py distancia --lat1 -25.2777 --lon1 -57.5661 --lat2 -25.2790 --lon2 -57.5633
    python geocoder.py area-tier --lat1 ... --lon1 ... --lat2 ... --lon2 ... [--mismo-edificio]
                        [--mismo-proyecto] [--misma-calle] [--misma-subzona] [--misma-zona] [--zona-comparable]
    python geocoder.py registrar --slug uon-calathea --lat -25.277717 --lon -57.5660923 \
                        --fuente "Google Maps, place resolution de 'Prof. Manuel Riquelme 1444, Asuncion'" \
                        --precision VERIFIED_STREET_LEVEL --guardar
"""

import argparse
import json
import math
from datetime import date
from pathlib import Path

PROJECTS_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge-base" / "investment" / "projects"

# SS17: prioridad del area de mercado, de mas a menos relevante. Los umbrales
# de distancia de los tiers 4/5/6 son [EXTENSION] -- la especificacion no fija
# metros concretos, solo el orden conceptual (D-025: se etiqueta explicitamente).
RADIO_CERCANO_M = 800      # ya usado como umbral en rental-amc-engine/amc.py score_ubicacion
RADIO_SUBZONA_M = 2000     # idem, coincide con el segundo umbral ya vigente en amc.py

# SS6 + [EXTENSION]: gradiente de confianza de ubicacion, mas honesto que un
# UNVERIFIED/VERIFIED binario. Etiquetado como extension porque la especificacion
# solo define el flag UNVERIFIED (D-025 -- toda regla nueva se marca como tal).
LOCATION_STATUS_VALIDOS = ["UNVERIFIED", "VERIFIED_STREET_LEVEL", "VERIFIED_ROOFTOP"]


def haversine_m(lat1, lon1, lat2, lon2):
    """Distancia real entre dos puntos (metros), formula de Haversine. Sin red, sin API key."""
    R = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def area_tier(distancia_m, mismo_edificio=False, mismo_proyecto=False, misma_calle=False,
              misma_subzona=False, misma_zona=False, zona_comparable=False):
    """
    SS17 -- prioridad del area relevante para el AMC, de 1 (maxima) a 7 (minima):
    1 mismo edificio -- 2 mismo proyecto/complejo -- 3 misma calle -- 4 radio cercano
    -- 5 misma subzona -- 6 misma zona -- 7 zonas comparables (solo si no alcanza oferta).
    Los primeros 3 y el ultimo son flags que solo el agente puede confirmar (no se
    derivan de coordenadas). El resto (4-6) sale de la distancia real, cuando hay
    coordenadas para ambos puntos.
    """
    if mismo_edificio:
        return 1, "mismo edificio", distancia_m
    if mismo_proyecto:
        return 2, "mismo proyecto o complejo", distancia_m
    if misma_calle:
        return 3, "misma calle", distancia_m
    if distancia_m is not None:
        if distancia_m <= RADIO_CERCANO_M:
            return 4, f"radio cercano ({distancia_m:.0f}m, [EXTENSION] umbral {RADIO_CERCANO_M}m)", distancia_m
        if misma_subzona:
            return 5, f"misma subzona (a {distancia_m:.0f}m)", distancia_m
        if distancia_m <= RADIO_SUBZONA_M:
            return 5, f"subzona probable por distancia ({distancia_m:.0f}m, [EXTENSION] umbral {RADIO_SUBZONA_M}m)", distancia_m
        if misma_zona:
            return 6, f"misma zona (a {distancia_m:.0f}m)", distancia_m
    if misma_subzona:
        return 5, "misma subzona (sin distancia real disponible)", distancia_m
    if misma_zona:
        return 6, "misma zona (sin distancia real disponible)", distancia_m
    if zona_comparable:
        return 7, "zona comparable -- usar solo si no alcanza la oferta de zonas mas cercanas (SS17)", distancia_m
    return None, "sin evidencia suficiente para ubicar el area de mercado (SS17) -- no asumir 'Asuncion' en general", distancia_m


def google_maps_url(lat, lon):
    return f"https://www.google.com/maps?q={lat},{lon}"


def cmd_distancia(args):
    d = haversine_m(args.lat1, args.lon1, args.lat2, args.lon2)
    print(json.dumps({"distancia_m": round(d, 1)}, ensure_ascii=False, indent=2))


def cmd_area_tier(args):
    d = None
    if args.lat1 is not None and args.lat2 is not None:
        d = haversine_m(args.lat1, args.lon1, args.lat2, args.lon2)
    tier, motivo, distancia = area_tier(
        d, mismo_edificio=args.mismo_edificio, mismo_proyecto=args.mismo_proyecto,
        misma_calle=args.misma_calle, misma_subzona=args.misma_subzona,
        misma_zona=args.misma_zona, zona_comparable=args.zona_comparable,
    )
    print(json.dumps({
        "tier": tier, "motivo": motivo,
        "distancia_m": round(distancia, 1) if distancia is not None else None,
    }, ensure_ascii=False, indent=2))


def cmd_registrar(args):
    if args.precision not in LOCATION_STATUS_VALIDOS:
        raise SystemExit(f"--precision debe ser uno de {LOCATION_STATUS_VALIDOS}")

    ruta = PROJECTS_DIR / args.slug / "project.json"
    if not ruta.exists():
        raise SystemExit(f"No existe {ruta} -- este comando no crea proyectos nuevos, solo geocodifica uno ya cargado "
                          f"por project-unit-database (SK-15).")

    with open(ruta, encoding="utf-8") as f:
        proyecto = json.load(f)

    barrio_registrado = proyecto.get("barrio")
    aviso_discrepancia = None
    if args.barrio_geodata and barrio_registrado and args.barrio_geodata.strip().lower() != barrio_registrado.strip().lower():
        aviso_discrepancia = (
            f"Discrepancia sin resolver: el proyecto tiene barrio='{barrio_registrado}' (fuente registral/catastral), "
            f"pero el geocoder real citado en 'fuente' asocia estas coordenadas al barrio/vecindario "
            f"'{args.barrio_geodata}'. No se sobrescribe barrio automaticamente -- queda documentado para "
            f"que un humano lo revise, en vez de resolverse en silencio."
        )

    cambios = {
        "latitud": args.lat,
        "longitud": args.lon,
        "google_maps_url": google_maps_url(args.lat, args.lon),
        "location_status": args.precision,
        "fecha_actualizacion": str(date.today()),
    }

    nota = (
        f"Geocodificado via geocoding-engine (SK-16) el {cambios['fecha_actualizacion']}. "
        f"Fuente: {args.fuente}. Precision: {args.precision} "
        f"({'coordenadas resueltas por un geocoder real a nivel de calle/direccion, sin confirmacion visual contra el poligono del edificio' if args.precision == 'VERIFIED_STREET_LEVEL' else 'confirmado visualmente contra la ubicacion real del edificio'})."
    )
    if aviso_discrepancia:
        nota += " " + aviso_discrepancia

    if args.dry_run or not args.guardar:
        print(json.dumps({"accion": "DRY_RUN -- no se escribio nada, pasar --guardar para persistir",
                           "cambios": cambios, "_nota_location_status": nota}, ensure_ascii=False, indent=2))
        return

    proyecto.update(cambios)
    proyecto["_nota_location_status"] = nota
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(proyecto, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(json.dumps({"accion": "GUARDADO", "archivo": str(ruta), "cambios": cambios,
                       "_nota_location_status": nota}, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description="geocoding-engine (SK-16) -- SS6/SS17")
    sub = parser.add_subparsers(dest="comando", required=True)

    p_dist = sub.add_parser("distancia", help="Distancia real (Haversine) entre dos coordenadas")
    for name in ("lat1", "lon1", "lat2", "lon2"):
        p_dist.add_argument(f"--{name}", type=float, required=True)
    p_dist.set_defaults(func=cmd_distancia)

    p_tier = sub.add_parser("area-tier", help="Prioridad de area de mercado (SS17) entre sujeto y candidato")
    p_tier.add_argument("--lat1", type=float, default=None)
    p_tier.add_argument("--lon1", type=float, default=None)
    p_tier.add_argument("--lat2", type=float, default=None)
    p_tier.add_argument("--lon2", type=float, default=None)
    p_tier.add_argument("--mismo-edificio", action="store_true")
    p_tier.add_argument("--mismo-proyecto", action="store_true")
    p_tier.add_argument("--misma-calle", action="store_true")
    p_tier.add_argument("--misma-subzona", action="store_true")
    p_tier.add_argument("--misma-zona", action="store_true")
    p_tier.add_argument("--zona-comparable", action="store_true")
    p_tier.set_defaults(func=cmd_area_tier)

    p_reg = sub.add_parser("registrar", help="Guarda coordenadas YA geocodificadas por el agente en project.json")
    p_reg.add_argument("--slug", required=True)
    p_reg.add_argument("--lat", type=float, required=True)
    p_reg.add_argument("--lon", type=float, required=True)
    p_reg.add_argument("--fuente", required=True, help="Cita exacta de donde salio la coordenada (SS6: no inventar)")
    p_reg.add_argument("--precision", required=True, choices=LOCATION_STATUS_VALIDOS)
    p_reg.add_argument("--barrio-geodata", default=None,
                        help="Barrio/vecindario que el geocoder asocia a estas coordenadas, si difiere del "
                             "'barrio' ya cargado en project.json (para declarar la discrepancia, nunca resolverla sola)")
    p_reg.add_argument("--guardar", action="store_true", help="Sin esto, es un dry run")
    p_reg.add_argument("--dry-run", action="store_true", help="Forzar dry run aunque se pase --guardar")
    p_reg.set_defaults(func=cmd_registrar)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
