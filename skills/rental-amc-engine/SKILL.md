---
name: rental-amc-engine
description: >-
  Motor de AMC (Analisis Comparativo de Mercado) de ALQUILER -- determina un
  rango de renta de mercado (LOW/BASE/HIGH) para una unidad concreta a partir
  de un pool de comparables reales relevados en C21, RE/MAX e InfoCasas
  Paraguay, con score de comparabilidad configurable, log de descartados,
  status por fuente y nivel de confianza. USAR SIEMPRE antes de estimar o
  recomendar un alquiler de mercado para un inversor -- nunca fijar una renta
  "a ojo" ni con un solo comparable suelto. Tambien usar cuando se pida
  "cual es el alquiler de mercado de esta unidad", "arma el AMC de alquiler
  de [proyecto]", o para actualizar un AMC de alquiler anterior.
---

# rental-amc-engine (SK-14)

Skill de la capa SKILLS. Implementa el AMC Engine de alquiler (SS18-33 de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`,
D-084) -- el primer modulo construido de esa especificacion, elegido por ser
el que menos cobertura real tenia (confirmado por el founder, 2026-08-24).

## Principio rector

> **No vender rentabilidad. Calcular rentabilidad.** (SS2 de la especificacion.) El precio de alquiler tiene que surgir del AMC, nunca definirse primero para que el resultado "de bien". Si la evidencia es insuficiente, decilo (`LOW_CONFIDENCE`/`INSUFFICIENT_DATA`/`NO_DATA`) -- nunca inventes un comparable, un precio o una URL (SS61).

## Arquitectura -- dos pasos, dos responsables

Esta skill tiene una parte que **hace el agente** (buscar en la web, criterio humano) y una parte que **hace el script** (matematica determinista, versionado). No confundirlas:

1. **El agente releva el pool de candidatos** -- busca comparables reales de alquiler en las 3 fuentes obligatorias (SS19): **C21 Paraguay, RE/MAX Paraguay, InfoCasas Paraguay** (via WebSearch/WebFetch), y arma un JSON con el esquema de `ejemplo-pool-candidatos.json`. Meta: **5-15 candidatos** cuando la oferta lo permita (SS21) -- no conformarse con 2-3. Para cada fuente que no devuelva resultados o este bloqueada, registrar igual su `SOURCE_STATUS` (`AVAILABLE`/`PARTIAL`/`BLOCKED`/`NO_RESULTS`/`UNVERIFIED`, SS31) -- nunca omitirla en silencio.
2. **`amc.py` evalua el pool ya relevado** -- calcula el `comparability_score` de cada candidato (pesos configurables, SS23), separa Top 3 de descartados con motivo (SS24-25), calcula el rango LOW/BASE/HIGH de renta de mercado (SS26-27, combinando mediana + media ponderada por score, nunca un promedio simple), asigna `AMC_STATUS`/confianza (SS30/33), y guarda un snapshot versionado que nunca sobreescribe uno anterior (SS54-55/58).

## Cuando usar esta skill

- Antes de recomendar o mostrarle a un inversor un alquiler de mercado para cualquier unidad.
- "¿Cuál es el alquiler de mercado de [unidad/proyecto]?"
- "Armá el AMC de alquiler de [proyecto]."
- "Actualizá el AMC de alquiler de [proyecto]" (usar `/update-amc` conceptual -- correr de nuevo con `--guardar`, nunca pisar el snapshot anterior).

## Cómo ejecutarla

Paso 1 (agente, no este script) -- buscar candidatos reales en C21, RE/MAX e InfoCasas para la zona/tipología del sujeto, y armar el JSON del pool. Ver `ejemplo-pool-candidatos.json` para el esquema exacto de `sujeto`, `fuentes_status` y cada `candidato`.

Paso 2 -- correr el motor:

```bash
python skills/rental-amc-engine/amc.py evaluar --pool pool_candidatos.json
python skills/rental-amc-engine/amc.py evaluar --pool pool_candidatos.json --guardar --slug uon-calathea-105 --fecha 2026-08-24
```

`--guardar` escribe el snapshot en `knowledge-base/investment/market-intelligence/rentals/amc-snapshots/<slug>/AMC-NNN.json`, incrementando `NNN` automáticamente -- nunca sobrescribe `AMC-001` cuando ya existe (SS55). Sin `--guardar` es un dry run (para revisar antes de persistir).

## Reglas no negociables al presentar un resultado

1. **Mostrar siempre el rango LOW/BASE/HIGH**, nunca solo `BASE` (SS26/29). El rango existe para que el inversor vea la incertidumbre real, no para esconderla.
2. **Si `amc_status` es `NO_DATA` o `INSUFFICIENT_DATA`, decirlo explícitamente y no presentar ningún número de renta** -- el script ya se niega a inventar un rango en ese caso; no lo completes vos a mano por encima del resultado.
3. **Incluir siempre `confianza` (`HIGH`/`MEDIUM`/`LOW`) junto con el rango** -- un `LOW` con 1 comparable no tiene el mismo peso que un `HIGH` con 6. Nunca presentar un AMC de baja confianza como si fuera certeza (SS30).
4. **Mostrar el Top 3 con su `comparability_score` y el log de `descartados` con motivo** cuando se le entregue el resultado a un inversor o se guarde en un caso — la transparencia sobre qué se excluyó y por qué es una regla explícita (SS25), no opcional.
5. **Declarar el `fuentes_status` de las 3 fuentes obligatorias**, incluso cuando alguna no trajo nada — nunca dar a entender que se consultó una fuente que en realidad estaba bloqueada o sin resultados.
6. **Cada candidato lleva `fecha_consulta`** — nunca presentar un AMC viejo como si fuera de hoy (SS32). Si el snapshot guardado tiene más de ~60-90 días, avisar que puede estar `MARKET_DATA_STALE` (SS57 — el umbral concreto todavía no está parametrizado, marcar `[EXTENSION]` si se usa un número).
7. **Los pesos del score son configurables, no son ley** (SS23) — si el criterio humano difiere del score automático para un caso puntual, decirlo explícitamente en vez de forzar el número.

## Nota de diseño — mapeo de criterios SS22 vs. SS23

La especificación lista 11 criterios de comparabilidad en SS22 pero solo pesa 8 buckets en el ejemplo de SS23. Este script resuelve la superposición así: `caracteristicas` (10%) agrupa amoblamiento + antigüedad + calidad constructiva; `estado` (10%) queda como bucket propio (estado de conservación). Si en un caso real esta agrupación no alcanza para diferenciar candidatos importantes, ajustar `pesos` en el JSON de entrada en vez de tocar la lógica del script.

## Dependencias

- `skills/geocoding-engine/geocoder.py` (SK-16) — provee `haversine_m()` para la distancia real de `score_ubicacion` (import directo, mismo patrón que `dev_engine` reutiliza `calculadora.py`).
- `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084) — especificación completa que esta skill implementa (solo SS18-33).
- `knowledge-base/investment/methodologies/amc-analisis-comparativo-de-mercado.md` (D-077) — metodología AMC de **venta**, hermana de esta. Comparte principios (no inventar ajustes, categorizar fuentes por confiabilidad) pero es un dominio distinto — no mezclar comparables de venta con comparables de alquiler.
- `knowledge-base/investment/market-intelligence/rentals/data/tarifas-alquiler-por-barrio-asuncion.csv` — base de conocimiento de mercado cross-cutting (hoy vacía, categoría D en casi todos los barrios). Cuando un AMC de esta skill produzca un dato de confianza `HIGH`/`MEDIUM`, conviene promoverlo a esta tabla (SS56 — distinción `CASE DATA` vs. `MARKET KNOWLEDGE`), a mano, todavía no automatizado.
- `production/app/backend/calculadora.py` (`evaluar_renta()`) — consume la renta que este AMC recomienda como `renta_mensual_bruta`. Este script no calcula rentabilidad, solo el alquiler de mercado.

## Relación con otras skills/workflows

- Alimenta a `rentabilidad-calculator` (SK-03) — el `base_usd_mes` de este AMC es el input de `renta_mensual_bruta` de `evaluar_renta()`.
- Hermana de `market-price-validation` (SK-13), que hace lo mismo para precio de **venta** en vez de alquiler — mismo espíritu (no inventar, declarar confianza), scripts separados porque son mercados distintos (SS49).
- Primer módulo construido de `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084) — el resto de esa especificación (Project/Unit/Parking Database, geocoding, herramientas de precio máximo/alquiler requerido, informe de 30 puntos, comandos) sigue sin construir.

## Qué queda pendiente, explícitamente

1. ~~Geocoding y "misma zona/radio" real (SS17)~~ — ✅ **Parcialmente resuelto, 2026-08-28 (`geocoding-engine`, SK-16).** `score_ubicacion` ahora calcula distancia real (Haversine) cuando `sujeto` y el candidato traen `lat`/`lon` geocodificadas; si faltan, cae automáticamente al criterio de texto anterior — compatibilidad total, `AMC-001` de UON Calathea 105 no se tocó y sigue dando el mismo resultado. **Sigue pendiente**: el tier de área de mercado completo de SS17 (mismo edificio/proyecto/calle/zona comparable) vive en `geocoding-engine` como comando aparte (`area-tier`), todavía no está conectado automáticamente al score de este script — hoy solo aporta la distancia real, no el tier completo.
2. **Ajustes cuantitativos explícitos (SS28)** — el score de comparabilidad pondera la similitud pero no aplica un ajuste de precio explícito tipo "+5% por piso alto" como sí lo hace la metodología de venta (D-077, Paso 3). Si se necesita ese nivel de ajuste, hacerlo a mano sobre el resultado y documentarlo, no asumirlo.
3. **`MARKET_DATA_STALE` (SS57)** — sin umbral de días parametrizado todavía.
4. **Automatización del paso 1** — hoy la búsqueda en C21/RE-MAX/InfoCasas la hace el agente vía WebSearch/WebFetch cada vez; no hay scraping programado ni actualización periódica.
