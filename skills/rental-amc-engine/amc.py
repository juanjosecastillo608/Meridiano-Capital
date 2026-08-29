#!/usr/bin/env python3
"""
CLI de la skill rental-amc-engine (SK-14).

Implementa el motor de AMC (Analisis Comparativo de Mercado) de ALQUILER
descripto en documentation/investment-sales-rental-market-engine/00-especificacion-v1.md
SS18-33 (D-084). Este script NO busca en la web -- eso lo hace el agente
(WebSearch/WebFetch contra C21, RE/MAX e InfoCasas, SS19), que arma el pool de
candidatos como un JSON siguiendo el esquema de abajo. Este script recibe ese
pool YA RELEVADO y hace la parte determinista: score de comparabilidad,
seleccion de Top 3, log de descartados, rango de renta de mercado, status y
confianza, y el versionado del snapshot (nunca sobrescribe uno anterior).

Uso:
    python amc.py evaluar --pool pool_candidatos.json
    python amc.py evaluar --pool pool_candidatos.json --guardar
    python amc.py evaluar --pool pool_candidatos.json --guardar --slug uon-calathea-105

Esquema esperado de --pool (ver ejemplo-pool-candidatos.json en esta carpeta):
{
  "sujeto": {
    "proyecto": str, "unidad": str, "barrio": str, "tipologia": str,
    "dormitorios": int, "superficie_m2": float, "piso": int|null,
    "cochera": bool, "amoblado": bool, "amenities": [str, ...],
    "lat": float|null, "lon": float|null  # opcional -- SK-16/geocoding-engine,
        # ver project.json del proyecto (skills/project-unit-database). Si estan
        # presentes en sujeto Y en el candidato, la distancia real (Haversine)
        # reemplaza al texto de barrio/distancia_aprox_m en score_ubicacion.
  },
  "fuentes_status": {"C21": "AVAILABLE|PARTIAL|BLOCKED|NO_RESULTS|UNVERIFIED",
                      "RE/MAX": "...", "InfoCasas": "..."},
  "candidatos": [
    {"comp_id": str, "fuente": str, "url": str, "fecha_consulta": "YYYY-MM-DD",
     "direccion": str, "barrio": str, "distancia_aprox_m": float|null,
     "lat": float|null, "lon": float|null,  # opcional, ver nota de "sujeto" arriba
     "edificio": str|null, "tipologia": str, "dormitorios": int, "banos": int|null,
     "superficie_m2": float, "piso": int|null, "cochera": bool|null,
     "amoblado": bool|null, "amenities": [str, ...], "estado": str,
     "precio_publicado_usd": float, "observaciones": str}
    , ...
  ],
  "pesos": {opcional, ver PESOS_DEFAULT abajo}
}

Regla de seguridad (SS61): este script nunca inventa un candidato ni un precio.
Si "candidatos" viene vacio, el resultado es AMC_STATUS=NO_DATA -- el agente
que llamo con un pool vacio debe decirle eso al usuario, no rellenar a mano.
"""

import argparse
import json
import math
import statistics
import sys
import unicodedata
from datetime import date
from pathlib import Path

# Reutiliza -- no duplica -- la distancia real de geocoding-engine (SK-16, SS17)
# cuando el pool trae lat/lon. Mismo patron de import entre skills/paquetes que
# production/app/backend/dev_engine/cashflow.py usa con calculadora.py.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "geocoding-engine"))
from geocoder import haversine_m  # noqa: E402

SNAPSHOTS_DIR = (Path(__file__).resolve().parent.parent.parent / "knowledge-base" / "investment" /
                  "market-intelligence" / "rentals" / "amc-snapshots")

FUENTES_OBLIGATORIAS = ["C21", "RE/MAX", "InfoCasas"]  # SS19

# SS23 -- pesos configurables, NO reglas rigidas. Mapeo elegido para resolver
# la superposicion entre la lista de 11 criterios de SS22 y los 8 buckets del
# ejemplo de SS23: "caracteristicas" agrupa amoblamiento + antiguedad + calidad
# constructiva (SS22 #6/#10/#11); "estado" queda como su propio bucket (SS22 #5).
PESOS_DEFAULT = {
    "ubicacion": 30,
    "tipologia": 20,
    "superficie": 15,
    "caracteristicas": 10,
    "estado": 10,
    "amenities": 5,
    "cochera": 5,
    "piso_vista": 5,
}

SCORE_MINIMO_PARA_ENTRAR_AL_POOL = 35  # bajo este score, se descarta directamente (SS25)
UMBRAL_DISPERSION_RELATIVA_ALTA = 0.30  # sube LOW_CONFIDENCE si supera esto


def normalizar(s):
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode("ascii")
    return s.lower().strip()


def distancia_real_m(sujeto, c):
    """SS17/SK-16: distancia real (Haversine) si ambos traen lat/lon geocodificadas.
    None si falta alguna -- nunca se estima ni se inventa acá (SS6: no inventar coordenadas)."""
    for punto in (sujeto, c):
        if punto.get("lat") is None or punto.get("lon") is None:
            return None
    return haversine_m(sujeto["lat"], sujeto["lon"], c["lat"], c["lon"])


def score_ubicacion(sujeto, c):
    if not c.get("barrio") or not sujeto.get("barrio"):
        return 0.0, "sin barrio informado"
    mismo_barrio = normalizar(c["barrio"]) == normalizar(sujeto["barrio"])

    d_real = distancia_real_m(sujeto, c)
    if d_real is not None:
        # Con coordenadas reales (SK-16) la distancia manda sobre el texto del
        # barrio -- dos direcciones a 50m pueden estar en barrios con nombres
        # distintos (ver D-0NN, discrepancia OSM/registral de UON Calathea).
        if mismo_barrio or d_real <= 300:
            return 1.0, f"a {d_real:.0f}m (coordenadas reales) -- {'mismo barrio' if mismo_barrio else 'muy cerca pese a barrio distinto'}"
        if d_real <= 800:
            return 0.75, f"a {d_real:.0f}m (coordenadas reales), barrio distinto"
        if d_real <= 2000:
            return 0.45, f"a {d_real:.0f}m (coordenadas reales), zona cercana"
        return 0.2, f"a {d_real:.0f}m (coordenadas reales), zona lejana"

    if mismo_barrio:
        return 1.0, "mismo barrio"
    if c.get("distancia_aprox_m") is not None:
        d = c["distancia_aprox_m"]
        if d <= 800:
            return 0.75, f"barrio distinto pero a {d:.0f}m (estimado por el agente, sin geocoding)"
        if d <= 2000:
            return 0.45, f"a {d:.0f}m, zona cercana (estimado por el agente, sin geocoding)"
        return 0.2, f"a {d:.0f}m, zona lejana (estimado por el agente, sin geocoding)"
    return 0.4, "barrio distinto, distancia no informada"


def score_tipologia(sujeto, c):
    ds, dc = sujeto.get("dormitorios"), c.get("dormitorios")
    if ds is None or dc is None:
        return 0.3, "dormitorios no informados"
    diff = abs(ds - dc)
    return max(0.0, 1.0 - 0.35 * diff), f"{diff} dormitorio(s) de diferencia"


def score_superficie(sujeto, c):
    ss, sc = sujeto.get("superficie_m2"), c.get("superficie_m2")
    if not ss or not sc:
        return 0.3, "superficie no informada"
    diff_pct = abs(sc - ss) / ss
    if diff_pct <= 0.10:
        return 1.0, f"{diff_pct*100:.0f}% de diferencia"
    if diff_pct >= 0.50:
        return 0.0, f"{diff_pct*100:.0f}% de diferencia -- demasiado distinto"
    return round(1.0 - (diff_pct - 0.10) / 0.40, 2), f"{diff_pct*100:.0f}% de diferencia"


def score_caracteristicas(sujeto, c):
    # Agrupa amoblamiento + antiguedad/calidad -- ver nota de mapeo arriba.
    puntos, motivos = [], []
    if sujeto.get("amoblado") is not None and c.get("amoblado") is not None:
        puntos.append(1.0 if sujeto["amoblado"] == c["amoblado"] else 0.0)
        motivos.append("amoblamiento igual" if sujeto["amoblado"] == c["amoblado"] else "amoblamiento distinto")
    else:
        puntos.append(0.5)
        motivos.append("amoblamiento no informado en uno de los dos")
    return (sum(puntos) / len(puntos) if puntos else 0.5), "; ".join(motivos)


def score_estado(sujeto, c):
    if not c.get("estado"):
        return 0.5, "estado no informado"
    e = normalizar(c["estado"])
    if any(k in e for k in ("a estrenar", "nuevo", "excelente")):
        return 1.0, c["estado"]
    if any(k in e for k in ("muy bueno", "bueno")):
        return 0.75, c["estado"]
    if any(k in e for k in ("regular", "a refaccionar", "a reciclar")):
        return 0.3, c["estado"]
    return 0.5, c["estado"]


def score_amenities(sujeto, c):
    suj = set(normalizar(a) for a in (sujeto.get("amenities") or []))
    can = set(normalizar(a) for a in (c.get("amenities") or []))
    if not suj:
        return 0.5, "sujeto sin amenities declaradas para comparar"
    interseccion = suj & can
    return round(len(interseccion) / len(suj), 2), f"{len(interseccion)}/{len(suj)} amenities del sujeto presentes"


def score_cochera(sujeto, c):
    sc, cc = sujeto.get("cochera"), c.get("cochera")
    if cc is None:
        return 0.5, "cochera no informada en el comparable"
    if sc == cc:
        return 1.0, "misma condicion de cochera"
    return 0.3, "condicion de cochera distinta"


def score_piso_vista(sujeto, c):
    sp, cp = sujeto.get("piso"), c.get("piso")
    if sp is None or cp is None:
        return 0.5, "piso no informado en uno de los dos"
    diff = abs(sp - cp)
    return max(0.0, 1.0 - 0.15 * diff), f"{diff} piso(s) de diferencia"


CRITERIOS = {
    "ubicacion": score_ubicacion,
    "tipologia": score_tipologia,
    "superficie": score_superficie,
    "caracteristicas": score_caracteristicas,
    "estado": score_estado,
    "amenities": score_amenities,
    "cochera": score_cochera,
    "piso_vista": score_piso_vista,
}


def calcular_score(sujeto, candidato, pesos):
    detalle, total = {}, 0.0
    for clave, fn in CRITERIOS.items():
        sub_score, motivo = fn(sujeto, candidato)
        peso = pesos.get(clave, 0)
        aporte = sub_score * peso
        detalle[clave] = {"sub_score": round(sub_score, 2), "peso": peso,
                           "aporte": round(aporte, 2), "motivo": motivo}
        total += aporte
    return round(total, 2), detalle


def evaluar(pool, pesos_override=None):
    sujeto = pool.get("sujeto", {})
    candidatos = pool.get("candidatos", [])
    fuentes_status = pool.get("fuentes_status", {})
    pesos = dict(PESOS_DEFAULT)
    if pesos_override:
        pesos.update(pesos_override)

    advertencias = []
    for f in FUENTES_OBLIGATORIAS:
        if f not in fuentes_status:
            fuentes_status[f] = "UNVERIFIED"
            advertencias.append(f"Fuente obligatoria '{f}' sin SOURCE_STATUS declarado -- se marco UNVERIFIED (SS19/31).")

    if not candidatos:
        return {
            "amc_status": "NO_DATA",
            "sujeto": sujeto,
            "fuentes_status": fuentes_status,
            "pool_candidatos": 0,
            "evaluados": [],
            "top_3": [],
            "descartados": [],
            "renta_mercado": None,
            "confianza": "LOW",
            "advertencias": advertencias + ["Pool de candidatos vacio -- NO se genera un rango de renta. "
                                             "No inventar un valor (SS61)."],
        }

    evaluados = []
    for c in candidatos:
        score, detalle = calcular_score(sujeto, c, pesos)
        precio = c.get("precio_publicado_usd")
        superficie = c.get("superficie_m2")
        usd_m2 = round(precio / superficie, 2) if precio and superficie else None
        evaluados.append({**c, "comparability_score": score, "score_detalle": detalle, "usd_m2": usd_m2})

    evaluados.sort(key=lambda x: x["comparability_score"], reverse=True)

    aptos = [c for c in evaluados if c["comparability_score"] >= SCORE_MINIMO_PARA_ENTRAR_AL_POOL and c.get("usd_m2")]
    descartados = []
    for c in evaluados:
        if c not in aptos:
            motivo = (f"score de comparabilidad {c['comparability_score']}/100, bajo el minimo "
                      f"({SCORE_MINIMO_PARA_ENTRAR_AL_POOL})") if c["comparability_score"] < SCORE_MINIMO_PARA_ENTRAR_AL_POOL \
                else "precio o superficie insuficientes para calcular USD/m2"
            descartados.append({"comp_id": c.get("comp_id"), "fuente": c.get("fuente"), "url": c.get("url"),
                                 "comparability_score": c["comparability_score"], "motivo_descarte": motivo})

    top_3 = aptos[:3]

    if not aptos:
        return {
            "amc_status": "INSUFFICIENT_DATA",
            "sujeto": sujeto,
            "fuentes_status": fuentes_status,
            "pool_candidatos": len(candidatos),
            "evaluados": evaluados,
            "top_3": [],
            "descartados": descartados,
            "renta_mercado": None,
            "confianza": "LOW",
            "advertencias": advertencias + [f"Los {len(candidatos)} candidatos relevados no alcanzan el score minimo "
                                             f"o no tienen precio/superficie utilizable -- no se genera un rango de "
                                             f"renta (SS61)."],
        }

    usd_m2_valores = [c["usd_m2"] for c in aptos]
    scores = [c["comparability_score"] for c in aptos]
    media_ponderada = sum(v * s for v, s in zip(usd_m2_valores, scores)) / sum(scores)
    mediana = statistics.median(usd_m2_valores)
    base_usd_m2 = round((media_ponderada + mediana) / 2, 2)
    low_usd_m2, high_usd_m2 = min(usd_m2_valores), max(usd_m2_valores)

    media_simple = statistics.mean(usd_m2_valores)
    desvio = statistics.pstdev(usd_m2_valores) if len(usd_m2_valores) > 1 else 0.0
    dispersion_relativa = round(desvio / media_simple, 3) if media_simple else 0.0

    superficie_sujeto = sujeto.get("superficie_m2")
    renta_mercado = None
    if superficie_sujeto:
        renta_mercado = {
            "low_usd_mes": round(low_usd_m2 * superficie_sujeto, 2),
            "base_usd_mes": round(base_usd_m2 * superficie_sujeto, 2),
            "high_usd_mes": round(high_usd_m2 * superficie_sujeto, 2),
            "low_usd_m2": low_usd_m2,
            "base_usd_m2": base_usd_m2,
            "high_usd_m2": high_usd_m2,
            "dispersion_relativa": dispersion_relativa,
            "metodologia": ("BASE = promedio de (media ponderada por comparability_score) y (mediana) de USD/m2 "
                             "entre los comparables aptos, escalado a la superficie del sujeto. LOW/HIGH = minimo/"
                             "maximo observado entre los comparables aptos, escalado igual. No es un promedio "
                             "simple (SS27)."),
        }
    else:
        advertencias.append("Sujeto sin superficie_m2 -- no se pudo escalar el rango de USD/m2 a USD/mes.")

    fuentes_disponibles = sum(1 for v in fuentes_status.values() if v == "AVAILABLE")
    n_aptos = len(aptos)
    if n_aptos >= 5:
        confianza = "HIGH"
    elif n_aptos >= 3:
        confianza = "MEDIUM"
    else:
        confianza = "LOW"
    if dispersion_relativa > UMBRAL_DISPERSION_RELATIVA_ALTA and confianza == "HIGH":
        confianza = "MEDIUM"
        advertencias.append(f"Dispersion relativa alta ({dispersion_relativa*100:.0f}%) -- confianza bajada de HIGH a MEDIUM.")
    if fuentes_disponibles < 2 and confianza != "LOW":
        confianza = "MEDIUM" if confianza == "HIGH" else confianza
        advertencias.append(f"Solo {fuentes_disponibles}/3 fuentes obligatorias con status AVAILABLE.")

    amc_status = "LOW_CONFIDENCE" if confianza == "LOW" else "OK"

    return {
        "amc_status": amc_status,
        "sujeto": sujeto,
        "fuentes_status": fuentes_status,
        "pool_candidatos": len(candidatos),
        "evaluados": evaluados,
        "top_3": top_3,
        "descartados": descartados,
        "renta_mercado": renta_mercado,
        "confianza": confianza,
        "advertencias": advertencias,
    }


def slug_de(sujeto):
    base = f"{sujeto.get('proyecto','sin-proyecto')}-{sujeto.get('unidad','sin-unidad')}"
    base = normalizar(base).replace(" ", "-")
    return "".join(ch for ch in base if ch.isalnum() or ch == "-") or "amc"


def siguiente_version(slug):
    carpeta = SNAPSHOTS_DIR / slug
    carpeta.mkdir(parents=True, exist_ok=True)
    existentes = sorted(carpeta.glob("AMC-*.json"))
    if not existentes:
        return carpeta, "AMC-001"
    ultimo = existentes[-1].stem  # "AMC-003"
    n = int(ultimo.split("-")[1]) + 1
    return carpeta, f"AMC-{n:03d}"


def guardar_snapshot(resultado, slug, fecha=None):
    carpeta, amc_id = siguiente_version(slug)
    resultado_con_meta = {"amc_id": amc_id, "fecha": fecha or "SIN_FECHA_EXPLICITA", **resultado}
    destino = carpeta / f"{amc_id}.json"
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(resultado_con_meta, f, ensure_ascii=False, indent=2)
    return destino, amc_id, resultado_con_meta


def main():
    parser = argparse.ArgumentParser(description="rental-amc-engine (SK-14)")
    sub = parser.add_subparsers(dest="comando", required=True)

    p_eval = sub.add_parser("evaluar", help="Evalua un pool de candidatos ya relevado")
    p_eval.add_argument("--pool", required=True, help="Ruta al JSON del pool de candidatos")
    p_eval.add_argument("--guardar", action="store_true", help="Guarda un snapshot versionado (nunca sobrescribe)")
    p_eval.add_argument("--slug", default=None, help="Slug del snapshot (default: derivado de proyecto+unidad)")
    p_eval.add_argument("--fecha", default=None, help="Fecha explicita del AMC, YYYY-MM-DD (recomendado pasarla)")
    args = parser.parse_args()

    with open(args.pool, encoding="utf-8") as f:
        pool = json.load(f)

    resultado = evaluar(pool, pesos_override=pool.get("pesos"))

    if args.guardar:
        slug = args.slug or slug_de(pool.get("sujeto", {}))
        destino, amc_id, resultado = guardar_snapshot(resultado, slug, fecha=args.fecha or str(date.today()))
        resultado["_guardado_en"] = str(destino.relative_to(Path(__file__).resolve().parent.parent.parent))

    print(json.dumps(resultado, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
