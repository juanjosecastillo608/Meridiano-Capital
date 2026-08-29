---
name: project-unit-database
description: >-
  Consulta la ficha maestra de un proyecto y sus bases de unidades/cocheras
  (Project/Unit/Parking Master Database) -- precio, superficie, tipologia,
  vinculacion de cochera, y el activo combinado unidad+cochera (INVESTMENT_
  ASSET). USAR SIEMPRE antes de armar un analisis de inversion o una ficha de
  rentabilidad para una unidad concreta, en vez de repetir datos sueltos de
  memoria o de un caso de contracts/. Tambien usar cuando se pida "que
  unidades tenemos cargadas de [proyecto]", "cual es el precio por m2 de
  [unidad]", o para verificar si una cochera declarada corresponde realmente
  a la unidad antes de sumar su precio.
---

# project-unit-database (SK-15)

Skill de la capa SKILLS. Implementa el Project/Unit/Parking Master Database
(SS5, SS8, SS11-13, SS15 de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`,
D-084) — segunda pieza construida de esa especificación, después de
`rental-amc-engine` (SK-14, D-085).

## Principio rector

> "Nuevo proyecto ≠ nueva base" (regla ya vigente del Real Estate Intelligence OS) aplicada a nivel unidad: cada departamento y cada cochera es un registro propio, reutilizable por cualquier análisis futuro del mismo proyecto — no un dato suelto que se vuelve a escribir cada vez que alguien pregunta por esa unidad.

## Qué hace y qué NO hace

- **Lee** `knowledge-base/investment/projects/<slug>/{project.json,units.csv,parking.csv}`. **No escribe** — cargar un proyecto/unidad/cochera nuevo es editar esos archivos a mano (mismo patrón que `market-intelligence/*/data/*.csv`), no una función de este script.
- **Nunca inventa** un proyecto, unidad, cochera o precio que no esté en los archivos fuente (SS61) — si el slug no existe o la unidad no está cargada, devuelve `NO_DATA` explícito.
- **Nunca suma automáticamente el precio de una cochera** a una unidad si el vínculo no está declarado explícitamente en `parking.csv` (`vinculada_a_unidad`) — SS12.
- **Nunca elige por vos** si usar superficie propia o total para el precio por m² — devuelve ambos (`price_m2_base` / `price_m2_analysis`, SS10) y que el humano decida cuál citar.

## Cuándo usar esta skill

- Antes de armar cualquier ficha de rentabilidad o análisis de inversión para una unidad concreta — consultar primero si el proyecto/unidad ya está cargado.
- "¿Qué unidades tenemos cargadas de [proyecto]?"
- "¿Cuál es el precio por m² de [unidad]?"
- "¿La cochera N°[X] corresponde a esta unidad o a otra?"

## Cómo ejecutarla

```bash
python skills/project-unit-database/consultar.py proyecto --slug uon-calathea
python skills/project-unit-database/consultar.py unidades --slug uon-calathea
python skills/project-unit-database/consultar.py unidades --slug uon-calathea --unidad 105
python skills/project-unit-database/consultar.py cocheras --slug uon-calathea
python skills/project-unit-database/consultar.py activo --slug uon-calathea --unidad 105 --cochera 10
```

`activo` implementa `INVESTMENT_ASSET` (SS13) — devuelve la unidad, la cochera (si el vínculo existe), y el precio con/sin cochera, sin inventar una desagregación que la fuente no tiene.

## Reglas no negociables al presentar un resultado

1. **Si un campo viene vacío/null, decirlo así** — nunca completar a ojo un piso, una superficie o un precio que el CSV no tiene.
2. **Respetar `categoria_dato` y `tipologia_confirmada`** al citar un dato — un campo categoría C ("inferido") no se presenta con la misma seguridad que uno categoría A ("VERIFIED", instrumento notarial u oficial).
3. **Si `observaciones` contiene un conflicto de datos sin resolver** (ver el caso real de la Cochera N°10 de UON Calathea, cargado con esta misma advertencia en ambos registros), **repetirlo siempre que se cite esa unidad/cochera** — nunca resolverlo en silencio a favor de una de las dos versiones.
4. **Precio combinado (`precio_combinado_con_cochera_usd`) ≠ precio de la unidad sola** — si solo existe el combinado, decirlo explícitamente en vez de tratarlo como si fuera el precio del departamento solo.

## Esquema de datos

`project.json` — ver `knowledge-base/investment/projects/uon-calathea/project.json` como ejemplo real poblado (con `_nota_*` explicando cada supuesto). Campos clave: `project_id`, `nombre_proyecto`, `nombre_edificio` (nombre técnico/de planos, distinto del comercial — mismo patrón que HERRERA-001), dirección/barrio/ciudad/país, `latitud`/`longitud`/`google_maps_url` (null si no verificado — `location_status: UNVERIFIED`), `estado_proyecto` (`PREVENTA`/`POZO`/`OBRA`/`TERMINADO`/`ENTREGADO`), amenities, superficies del terreno/construcción.

`units.csv` — columnas: `unit_id, project_id, unidad, piso, tipologia, tipologia_confirmada, dormitorios, banos, superficie_propia_m2, superficie_total_m2, balcon, orientacion, vista, precio_lista_usd, precio_vigente_usd, precio_combinado_con_cochera_usd, precio_contado_usd, precio_financiado_usd, moneda, forma_de_pago, cochera_vinculacion (INCLUIDA/OBLIGATORIA/OPCIONAL/SEPARADA/DESCONOCIDA), estado (DISPONIBLE/RESERVADO/VENDIDO/NO_DISPONIBLE), categoria_dato (A/B/C/D), fuente, observaciones`.

`parking.csv` — columnas: `parking_id, project_id, numero, piso, tipo, cubierta, superficie_propia_m2, superficie_total_con_copropiedad_m2, precio_usd, moneda, estado, vinculada_a_unidad, categoria_dato, fuente, observaciones`.

## Dato real ya cargado — UON Calathea

Primera aplicación real: `knowledge-base/investment/projects/uon-calathea/` — 2 unidades (201, 105) y 2 cocheras, ambas "N°10" (ver el conflicto de datos documentado en `parking.csv`, sin resolver formalmente — D-086/D-087). Sirve como ejemplo de cómo declarar un dato incierto (`estado_proyecto`, `tipologia_confirmada=false` de la Unidad 105) sin fingir certeza que no existe.

## Dependencias

- `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084) — especificación que esta skill implementa (SS5/8/11-13/15).
- `contracts/cases/<CASO>/facts/FACT_REGISTER.md` — fuente primaria de hechos verificados para poblar `project.json`/`units.csv`/`parking.csv` cuando el proyecto tiene un caso de negociación activo.

## Relación con otras skills/workflows

- Alimenta a `rental-amc-engine` (SK-14) — el `sujeto` del pool de un AMC (barrio, tipología, superficie, cochera, amenities) debería venir de acá en vez de tipearse suelto cada vez.
- Alimenta a `rentabilidad-calculator` (SK-03) — `precio_vigente_usd`/`precio_combinado_con_cochera_usd` es el `precio_compra` real de `evaluar_renta()`.
- Tercera pieza construida de `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084), después de `rental-amc-engine` (SK-14, D-085).

## Qué queda pendiente, explícitamente

1. **`SS7` ("cargar TODA la lista de precios, no solo lo consultado")** — hoy `units.csv` de UON Calathea solo tiene las 2 unidades que aparecieron en conversaciones reales (201, 105), no la lista completa del proyecto. No se inventaron filas para las unidades restantes.
2. ~~Geocoding (`SS6`)~~ — ✅ **Parcialmente resuelto, 2026-08-28.** Nueva skill `geocoding-engine` (SK-16) geocodifica y escribe `latitud`/`longitud`/`google_maps_url`/`location_status` en `project.json` — probado con UON Calathea (`location_status: VERIFIED_STREET_LEVEL`, ver `skills/geocoding-engine/SKILL.md`). **Sigue pendiente**: los demás proyectos que se carguen a futuro siguen naciendo `UNVERIFIED` hasta que alguien corra `geocoder.py registrar` explícitamente — no es automático al crear el proyecto.
3. **Sin comando de escritura/alta** — cargar un proyecto nuevo es crear la carpeta y los 3 archivos a mano siguiendo este esquema; no hay `project-unit-database add-unit` todavía.
4. **`PRICE_M2_ANALYSIS`** casi nunca calculable hoy — la mayoría de los registros reales no tienen `superficie_total_m2` (solo área propia), por eso `price_m2_analysis` da `null` en la práctica.
