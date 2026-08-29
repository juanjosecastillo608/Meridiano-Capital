---
name: investor-report-30
description: >-
  Ensambla el informe de inversor de 30 puntos (SS51) para una unidad
  concreta, tirando datos YA REALES de project-unit-database, geocoding-
  engine, rental-amc-engine y calculadora.py -- nunca recalcula ni inventa
  nada, si falta una fuente el punto queda NO_DATA explicito. USAR SIEMPRE
  antes de armar a mano una ficha de inversion para un inversor, en vez de
  repetir el proceso manual que se usaba para la Unidad 105 de UON Calathea
  antes de este motor.
---

# investor-report-30 (SK-18)

Skill de la capa SKILLS. Implementa SS51 (Informe para el inversor) de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`
(D-084) — sexto módulo construido de esa especificación, después de
`rental-amc-engine` (SK-14), `project-unit-database` (SK-15),
`geocoding-engine` (SK-16) y `target-yield-tools` (SK-17).

## Qué es y qué NO es

**Es un ensamblador, no un motor nuevo.** Cada uno de los 30 puntos sale de
una llamada real a una skill/módulo ya construido y verificado — este script
no reimplementa ninguna lógica de cálculo, solo la organiza en la estructura
exacta que pide SS51:

| Puntos | Fuente real |
|---|---|
| 1–11 (proyecto, ubicación, unidad, cochera, precio) | `project-unit-database` (SK-15) + `geocoding-engine` (SK-16, para el punto 3) |
| 12–15 (AMC, comparables, rango de alquiler) | `rental-amc-engine` (SK-14) — snapshot ya guardado, `--amc-snapshot` |
| 16–22 (ingreso, vacancia, gastos, rentabilidad, flujo) | `calculadora.py` (`evaluar_renta()`) |
| 23–25 (escenarios pesimista/base/optimista) | `calculadora.py` x3, usando el rango LOW/BASE/HIGH del AMC como renta de cada escenario — mismo patrón que D-086 aplicó a mano |
| 26–30 (riesgos, supuestos, fuentes, fecha, conclusión) | Ensamblado — agrega **todas** las advertencias que ya generaron los pasos anteriores, no inventa una lista aparte |

Si se pasa `--target-yield-neto`, agrega además un bloque extra (fuera de los
30 puntos oficiales) con `target-yield-tools` (SK-17, SS45-47).

## Cuándo usar esta skill

- Antes de armar a mano la ficha de rentabilidad de una unidad para un inversor — correr esto primero, editar/redactar sobre el resultado, no repetir el proceso manual.
- "Armá el informe de inversión de [proyecto]/[unidad]."
- Para auditar si una ficha ya armada a mano (como la preliminar de la Unidad 105 antes de D-085/086/087) cumple el mismo nivel de disciplina que este ensamblador exige por diseño.

## Cómo ejecutarla

```bash
python skills/investor-report-30/informe.py generar \
  --slug uon-calathea --unidad 105 --cochera 10 \
  --clase departamento_sin_muebles --nivel-neto 3 \
  --amc-snapshot knowledge-base/investment/market-intelligence/rentals/amc-snapshots/uon-calathea-105/AMC-001.json \
  --target-yield-neto 8
```

Sin `--amc-snapshot`, los puntos 12-25 quedan `NO_DATA`/`null` explícito — el
script avisa en `26_riesgos` que hace falta correr `rental-amc-engine`
primero, nunca estima una renta a ojo. Sin `--precio-compra`, usa el precio
ya cargado en `project-unit-database` (combinado con cochera si se pasa
`--cochera`, sino el de la unidad sola) — si ninguno existe, devuelve
`NO_DATA`.

## Probado contra el caso real — Unidad 105, UON Calathea

Reproduce exactamente los números ya publicados en D-086 (yield neto 4,05%
en el escenario base, `pasa_piso=false`, `base_usd_mes=617,89`) y agrega
automáticamente al punto 26 (riesgos) cosas que antes solo estaban dispersas
en distintos archivos: la discrepancia de barrio de `geocoding-engine`
(`D-088`), que la tipología no está confirmada por el desarrollador, el
conflicto de datos de la Cochera N°10, y que solo 1/3 fuentes obligatorias
del AMC quedó `AVAILABLE`.

## Reglas no negociables al presentar un resultado

1. **El punto 30 (conclusión) es un borrador automático, nunca la redacción final** — el propio texto lo dice explícitamente; un humano debe revisarlo antes de mostrárselo a un inversor real.
2. **Nunca omitir el punto 26 (riesgos)** al presentar el informe — es la razón de ser de este ensamblador, agrega automáticamente advertencias que antes se perdían por estar dispersas.
3. **Punto 9 (precio de compra) no es todavía LIST/NEGOTIATED/EFFECTIVE PURCHASE PRICE (SS15)** — decirlo explícitamente si se le presenta a alguien que pregunte por el precio negociado real de una operación concreta.
4. **Punto 10/11 (costos adicionales/inversión total) hoy es solo el precio de la unidad** — nunca presentarlo como si incluyera escribanía/honorarios/transferencia sin verificar primero si hay datos reales para esa unidad.

## Dependencias

- `skills/project-unit-database/consultar.py` (`cargar_proyecto`, `investment_asset`) — import directo, sin re-implementar.
- `skills/target-yield-tools/herramientas.py` (`alquiler_requerido`) — import directo, solo si se pide `--target-yield-neto`.
- `production/app/backend/calculadora.py` (`Calculadora.evaluar_renta`) — import directo.
- Un snapshot ya guardado de `rental-amc-engine` (SK-14) — este script no corre un AMC nuevo, solo lee uno ya hecho.

## Relación con otras skills/workflows

- Sexta y última pieza construida (por ahora) de `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084) — cierra el Tier 1 (motor/ingeniería) de `governance/PRIORITY_PLAN.md`.

## Qué queda pendiente, explícitamente

1. **SS14/SS15 (Client Purchase Scenario, LIST/NEGOTIATED/EFFECTIVE PURCHASE PRICE)** no están construidos — el punto 9 usa el precio ya cargado en `project-unit-database`, tal cual.
2. **SS16 (TOTAL INVESTMENT COST)** no tiene fuente de datos real todavía para ninguna unidad cargada — los puntos 10/11 quedan `NOT_INCLUDED` siempre, por diseño, hasta que exista esa fuente.
3. **Sin render visual/branded** (docx/pptx con el manual de marca) — este ensamblador produce datos estructurados (JSON), no un documento client-ready. Producir la versión visual requiere `anthropic-skills:meridiano-capital-identity` y, si se necesitan fotos reales, sigue bloqueado por `U-022`.
4. **SS48 (inversión en amoblamiento)** no está integrado — si la unidad es amoblada, el precio/renta que se le pase deben incluir ya el criterio de `knowledge-base/investment/08-costos-de-amueblamiento.md` (D-068).
