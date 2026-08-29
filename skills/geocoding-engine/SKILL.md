---
name: geocoding-engine
description: >-
  Geocodifica la ubicacion real de un proyecto (SS6) y calcula la prioridad
  de area de mercado (SS17: mismo edificio > mismo proyecto > misma calle >
  radio cercano > subzona > zona > zona comparable) a partir de coordenadas
  reales, nunca inventadas. USAR SIEMPRE antes de fijar latitud/longitud en
  project.json, y antes de decidir que tan "cerca" esta un comparable de un
  AMC de venta o alquiler. Tambien usar cuando se pida "geocodifica
  [proyecto]", "cuanto dista [comparable] del sujeto", o "en que area de
  mercado entra este comparable".
---

# geocoding-engine (SK-16)

Skill de la capa SKILLS. Implementa SS6 (Ubicacion) y SS17 (Google Maps +
market area) de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`
(D-084) — la pieza que la propia especificación señaló como "siguiente, sin
ejecutar todavía" al cerrar `rental-amc-engine` (SK-14, D-085) y
`project-unit-database` (SK-15, D-087) el 2026-08-24.

## Principio rector

> **"No inventar coordenadas"** (SS6, literal). Si la ubicación no puede
> verificarse contra un geocoder real, `LOCATION_STATUS = UNVERIFIED` — nunca
> una coordenada aproximada "a ojo" ni el centro genérico de un barrio.

## Arquitectura — dos pasos, dos responsables (mismo patrón que rental-amc-engine)

1. **El agente geocodifica** — vía Browser/WebFetch contra un proveedor real
   (Google Maps, OpenStreetMap/Nominatim), citando la dirección exacta
   consultada y, idealmente, cruzando **dos fuentes independientes** para
   corroborar (ver el caso real de UON Calathea abajo: Google Maps y OSM
   coincidieron dentro de ~95m). Este script **no hace la llamada de red** —
   mismo problema de entorno que documenta
   `production/app/backend/dev_engine/cotizacion.py` (verificación SSL de
   `urllib` falla en este sandbox).
2. **`geocoder.py` hace la parte determinista** — distancia real (Haversine,
   sin API key), el tier de prioridad de área de mercado de SS17, y el
   guardado versionado en `project.json` (nunca escribe una coordenada que no
   se le haya pasado explícitamente).

## Cuándo usar esta skill

- Antes de cargar o corregir `latitud`/`longitud`/`google_maps_url` de un
  proyecto en `project-unit-database` (SK-15).
- Antes de decidir en un AMC (venta o alquiler) si un comparable está "cerca"
  del sujeto — no asumirlo por el nombre del barrio solamente (SS17: "no
  comparar simplemente 'Asunción'").
- "¿Geocodificá [proyecto]?", "¿A qué distancia real está este comparable?",
  "¿En qué tier de área de mercado entra?"

## Cómo ejecutarla

```bash
# Distancia real entre dos puntos ya geocodificados (Haversine, metros)
python skills/geocoding-engine/geocoder.py distancia --lat1 -25.2777 --lon1 -57.5661 --lat2 -25.2791 --lon2 -57.5633

# Tier de área de mercado (SS17) -- combina flags que solo el agente puede confirmar
# (mismo edificio/proyecto/calle/zona-comparable) con distancia real cuando hay coordenadas
python skills/geocoding-engine/geocoder.py area-tier --lat1 ... --lon1 ... --lat2 ... --lon2 ... --misma-subzona

# Guardar una coordenada YA geocodificada por el agente en project.json (SK-15)
python skills/geocoding-engine/geocoder.py registrar --slug uon-calathea \
  --lat -25.277717 --lon -57.5660923 \
  --fuente "Google Maps, place resolution de 'Prof. Manuel Riquelme 1444, Asuncion'" \
  --precision VERIFIED_STREET_LEVEL --barrio-geodata "Las Lomas" --guardar
```

`registrar` sin `--guardar` es un dry run — muestra qué cambiaría sin escribir
nada. `--barrio-geodata` sirve para declarar (nunca resolver en silencio) una
discrepancia entre el barrio ya cargado (fuente registral/catastral) y el
barrio/vecindario que el geocoder asocia a esas coordenadas.

## `LOCATION_STATUS` — `[EXTENSION]` sobre SS6

La especificación solo define el flag `UNVERIFIED`. Este script usa un
gradiente más honesto (D-025: toda regla nueva se etiqueta explícitamente):

- `UNVERIFIED` — sin coordenadas, tal como ya usaba `project-unit-database`.
- `VERIFIED_STREET_LEVEL` — un geocoder real resolvió coordenadas para la
  dirección exacta (calle + número), **sin** confirmación visual contra el
  polígono real del edificio. Es lo que hoy puede lograrse para Asunción, ya
  que Nominatim/OSM no tiene interpolación de numeración de puerta en la
  mayoría de sus calles (verificado empíricamente, ver caso real abajo).
- `VERIFIED_ROOFTOP` — coordenadas confirmadas visualmente contra la
  ubicación real del edificio (satelital/catastro). Ningún proyecto la usa
  todavía.

## Tiers de SS17 — `[EXTENSION]` sobre los umbrales de distancia

SS17 define el **orden** de prioridad (edificio > proyecto > calle > radio >
subzona > zona > zona comparable) pero no fija metros concretos para "radio
cercano" ni para "subzona". Este script reutiliza los umbrales que ya estaban
vigentes de facto en `rental-amc-engine/amc.py` (`score_ubicacion`, 800m /
2000m) para no introducir un segundo criterio de distancia divergente —
marcado `[EXTENSION]` explícitamente en el propio output de `area-tier`.

## Caso real ya geocodificado — UON Calathea

`knowledge-base/investment/projects/uon-calathea/project.json`: dirección
registral es solo "Finca N°10.673, Distrito Santísima Trinidad" (dato
catastral, no una dirección de calle). La dirección de calle real y
verificable viene de una fuente más confiable — el boleto de compraventa
(`contracts/cases/UON-001/extracted-data/boleto_A.txt`/`boleto_B.txt`, fuente
E1 del Fact Register): **"calle Profesor Manuel Riquelme número 1444"**.

Geocodificado el 2026-08-28: Google Maps resolvió un place real para "Prof.
Manuel Riquelme 1444, Asunción" en `-25.277717, -57.5660923`; OpenStreetMap
Nominatim, consultado independientemente, ubica esa misma calle a ~95m de
distancia (dos segmentos de la calle, sin interpolación de numeración
disponible) — **corrobora el punto sin depender de una sola fuente**.
`location_status` pasó de `UNVERIFIED` a `VERIFIED_STREET_LEVEL`.

**Hallazgo sin resolver, documentado explícitamente (no en silencio):**
tanto Google Maps como OSM asocian esa dirección al barrio/vecindario **"Las
Lomas"**, mientras que `project.json` tiene `barrio: "Santísima Trinidad"`
(de la inscripción registral del inmueble). Puede deberse a que el predio
está cerca del límite entre ambos barrios, o a que la clasificación
comercial/catastral difiere de la clasificación geográfica de OSM — **no se
asumió ninguna de las dos explicaciones**, ni se sobrescribió `barrio`. Esto
importa para el AMC: "Las Lomas" y "Santísima Trinidad" tienen categorías de
zona distintas en
`knowledge-base/investment/market-intelligence/neighborhoods/data/categoria-de-zona-por-barrio-asuncion.csv`
(Las Lomas: "Residencial (exclusivo)", ~USD 742/m² terreno; Santísima
Trinidad: "Emergente/Comercial", sin dato de Place Analyzer) — confundirlos
cambiaría la lectura de mercado de la zona.

## Dependencias

- `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084) — SS6, SS17.
- `skills/project-unit-database/` (SK-15) — dueño de `project.json`, donde `registrar` escribe.
- `knowledge-base/investment/market-intelligence/neighborhoods/data/` (D-069/D-070) — tablas de barrio/distrito/zona contra las que se puede cruzar una discrepancia de `--barrio-geodata`.

## Relación con otras skills/workflows

- `rental-amc-engine` (SK-14) — `score_ubicacion` en `amc.py` ahora usa la
  distancia real (Haversine, vía este módulo) cuando el pool trae `lat`/`lon`
  en `sujeto` y en el candidato; si faltan, cae automáticamente al criterio
  de texto anterior (compatibilidad total con snapshots ya guardados, como
  `AMC-001` de UON Calathea 105, que no se re-generó ni se tocó).
- Cuarta pieza construida de la especificación (D-084), después de
  `rental-amc-engine` (SK-14), `project-unit-database` (SK-15).

## Qué queda pendiente, explícitamente

1. **Geocoding a nivel de edificio (`VERIFIED_ROOFTOP`)** — hoy solo se
   verificó a nivel de calle/dirección; nadie confirmó todavía el punto
   contra el polígono real del edificio (satelital o catastro visual).
2. **No se re-geocodificaron los comparables de `AMC-001` (UON Calathea
   105)** — ese snapshot ya existente no se tocó (regla de no sobrescribir
   snapshots, SS55); la próxima corrida de `rental-amc-engine` sobre esa
   unidad sí puede traer `lat`/`lon` reales para cada comparable si el agente
   las releva.
3. **Discrepancia de barrio de UON Calathea sin resolver** — ver arriba;
   queda pendiente que un humano confirme cuál de las dos fuentes (registral
   vs. geodata) es la correcta para fines comerciales/AMC.
4. **Sin geocoding automático (API)** — cada geocode lo hace el agente a
   mano vía Browser/WebFetch; no hay un comando que llame a un proveedor
   real por sí solo (limitación de entorno, no de diseño — ver nota de
   `cotizacion.py`).
