```
Estado: CURRENT — especificación adoptada, arquitectura sin construir (ver estado de implementación al final)
Fuente: founder (Juan José Castillo), prompt maestro "MERIDIANO CAPITAL — INVESTMENT SALES & RENTAL MARKET ENGINE, VERSIÓN 1.0", 2026-08-24 — texto reproducido verbatim, sin resumir
Dominio: INVESTMENT/TECHNOLOGY
Decisión: governance/decisions/DECISION_REGISTER.md#D-084
```

# Investment Sales & Rental Market Engine — Versión 1.0

> Este documento reproduce **verbatim** la especificación que dio el founder. No es una interpretación ni un resumen — es el prompt maestro completo, con numeración y formato preservados, guardado como fuente de verdad antes de construir nada. Ver el pie de página para el estado real de implementación al 2026-08-24.

## 1. Misión del sistema

Construir dentro de Meridiano Capital un motor profesional para transformar una consulta de compra de un departamento en un análisis de inversión inmobiliaria basado en:

- precio real de adquisición;
- superficie;
- tipología;
- piso;
- cochera;
- ubicación;
- características del proyecto;
- mercado de alquiler;
- propiedades comparables;
- precio de alquiler estimado;
- costos operativos;
- vacancia;
- administración;
- rentabilidad;
- flujo de fondos;
- sensibilidad;
- escenarios.

El sistema debe permitir que un asesor de Meridiano Capital pueda seleccionar una unidad concreta y generar un análisis profesional para un potencial inversor.

## 2. Principio fundamental

**NO VENDER RENTABILIDAD. CALCULAR RENTABILIDAD.**

El sistema nunca debe introducir un porcentaje de rentabilidad previamente definido para que el resultado "dé bien". El precio de alquiler debe surgir del análisis de mercado. La rentabilidad debe ser una **consecuencia** de:

```
PRECIO DE COMPRA + COSTOS + RENTA ESTIMADA + VACANCIA + GASTOS + OTROS SUPUESTOS
```

## 3. Integración con Meridiano Capital

Este módulo forma parte de **Meridiano Capital · Real Estate Intelligence OS**. Debe integrarse conceptualmente con: Project Database, Unit Database, Contract OS, Investment Engine, Market Intelligence, CRM, Client Management, Reporting, Knowledge Base. **No crear una aplicación aislada.**

## 4. Flujo principal

```
PROYECTO → LISTA DE PRECIOS → TIPOLOGÍAS → UNIDADES → COCHERAS → UBICACIÓN
→ GOOGLE MAPS → CARACTERÍSTICAS DEL PROYECTO → ANÁLISIS DE MERCADO → COMPARABLES
→ AMC → RENTA DE MERCADO → MODELO DE INVERSIÓN → RENTABILIDAD → ESCENARIOS
→ INFORME DEL INVERSOR
```

## 5. Project Master Database

Cada proyecto debe tener una ficha maestra. Campos mínimos: `PROJECT_ID`, nombre del proyecto, nombre del edificio, desarrollador, dirección, barrio, ciudad, país, latitud, longitud, Google Maps URL, fecha de actualización, estado del proyecto, fecha de entrega, cantidad de pisos, cantidad de unidades, cantidad de cocheras, amenities, características constructivas, nivel de calidad.

Estado: `PREVENTA` · `POZO` · `OBRA` · `TERMINADO` · `ENTREGADO`.

## 6. Ubicación

Cuando se cargue el nombre y/o dirección del edificio: (1) identificar la ubicación; (2) obtener coordenadas cuando sea posible; (3) generar o registrar Google Maps; (4) identificar barrio; (5) identificar zona; (6) identificar subzona si corresponde; (7) utilizar esa ubicación como input del AMC.

**No inventar coordenadas.** Si la ubicación no puede verificarse: `LOCATION_STATUS = UNVERIFIED`.

## 7. Carga de lista de precios

La primera tarea comercial al incorporar un proyecto debe ser cargar la lista completa de precios. No cargar solamente las unidades disponibles que el cliente consulta. **Cargar toda la estructura.**

## 8. Unit Database

Cada departamento debe convertirse en un registro independiente. Campos: `UNIT_ID`, `PROJECT_ID`, unidad, piso, tipología, dormitorios, baños, superficie propia, superficie total, superficie cubierta, superficie semicubierta, superficie descubierta, balcón, orientación, vista, precio de lista, precio vigente, precio contado, precio financiado, moneda, forma de pago, estado (disponible/reservado/vendido/no disponible), observaciones.

## 9. Tipologías

Normalizar las tipologías. Ejemplo: `STUDIO`, `1D`, `1D_PLUS`, `2D`, `2D_PLUS`, `3D`, `4D`, `PENTHOUSE`, u otras que correspondan. **No asumir equivalencias.** La tipología debe surgir de la documentación del proyecto.

## 10. Precio por m²

Calcular automáticamente `PRECIO / M²`, pero conservar separados: precio total, superficie propia, superficie total, superficie vendible utilizada por el proyecto. **No elegir automáticamente cuál superficie utilizar para valoración.** Registrar `PRICE_M2_BASE` y `PRICE_M2_ANALYSIS`, y explicar la metodología utilizada.

## 11. Cocheras

Las cocheras deben tener una base independiente. Cada cochera: `PARKING_ID`, `PROJECT_ID`, número, piso, tipo, cubierta/descubierta, superficie, precio, moneda, estado (disponible/reservada/vendida), características.

## 12. Vinculación de cochera

Una cochera puede: estar incluida; ser obligatoria; ser opcional; venderse separadamente. El sistema debe registrar esta condición. **Nunca sumar automáticamente el precio de una cochera si el proyecto no establece que corresponda.**

## 13. Unidad + cochera

Crear `INVESTMENT_ASSET` que permita seleccionar "Departamento 201 + Cochera 10" o "Departamento 201 sin cochera". El sistema debe poder comparar ambas situaciones.

## 14. Client Purchase Scenario

Cuando el cliente consulta una unidad, el asesor debe poder ingresar: proyecto, unidad, cochera, precio de compra, plan de pago, entrega inicial, cuotas, fecha de entrega, amoblamiento, financiación, otros costos de adquisición.

## 15. Precio real de adquisición

No utilizar automáticamente el precio de lista. Determinar `LIST PRICE` vs. `NEGOTIATED PRICE` vs. `EFFECTIVE PURCHASE PRICE`. El análisis debe utilizar `EFFECTIVE PURCHASE PRICE` cuando exista una operación concreta.

## 16. Costo total de inversión

Crear `TOTAL INVESTMENT COST`, que puede incluir: precio departamento, cochera, impuestos, escribanía, honorarios, gastos de transferencia, gastos administrativos, equipamiento, amoblamiento, electrodomésticos, decoración, otros costos. Cada costo debe ser `KNOWN` / `ESTIMATED` / `NOT_INCLUDED`.

## 17. Google Maps + market area

Una vez cargada la ubicación, determinar el área relevante para el AMC, por prioridad: (1) mismo edificio; (2) mismo proyecto o complejo; (3) misma calle; (4) radio cercano; (5) misma subzona; (6) misma zona; (7) zonas comparables solamente cuando no exista suficiente oferta. **No comparar simplemente "Asunción".** El mercado debe ser geográficamente relevante.

## 18. AMC — Análisis Comparativo de Mercado

Crear `RENTAL AMC ENGINE`. Objetivo: determinar un rango razonable de alquiler para la unidad seleccionada.

## 19. Fuentes obligatorias

El sistema debe buscar información en: (1) CENTURY 21 Paraguay; (2) RE/MAX Paraguay; (3) InfoCasas Paraguay. Estas fuentes deben ser tratadas como fuentes de oferta publicada. **No asumir que el precio publicado equivale al precio efectivamente cerrado.**

## 20. Búsqueda web

Para cada análisis, buscar propiedades comparables activas usando: ubicación, barrio, calles, radio, dormitorios, superficie, piso, cochera, amenities, antigüedad, estado, amoblamiento, calidad.

## 21. Proceso de búsqueda

**No buscar solamente 3 propiedades.** Primero construir `COMPARABLE CANDIDATE POOL` — objetivo recomendado: 5 a 15 candidatos cuando la oferta lo permita. Después seleccionar `TOP 3 COMPARABLES`.

## 22. Criterios de comparabilidad

Por orden de peso: (1) ubicación; (2) tipología; (3) superficie; (4) cantidad de dormitorios; (5) estado; (6) amoblamiento; (7) amenities; (8) cochera; (9) piso; (10) antigüedad; (11) calidad constructiva.

## 23. Score de comparabilidad

Cada candidato recibe un `COMPARABILITY SCORE`. Ejemplo conceptual: ubicación 30%, tipología 20%, superficie 15%, características 10%, estado 10%, amenities 5%, cochera 5%, piso/vista 5%. **Estos pesos deben ser configurables — no convertirlos en reglas rígidas.**

## 24. Top 3 comparables

Para cada una de las tres propiedades seleccionadas, registrar: `COMP_ID`, fuente, URL, fecha de consulta, dirección, barrio, distancia aproximada, edificio, tipología, dormitorios, baños, superficie, piso, cochera, amoblamiento, amenities, estado, precio publicado, precio por m², observaciones, `COMPARABILITY SCORE`.

## 25. Regla de transparencia

Nunca ocultar un comparable descartado si su exclusión puede afectar el análisis. Registrar `DISCARDED COMPARABLES` con motivo: demasiado lejos; tipología distinta; superficie demasiado diferente; amoblamiento diferente; estado diferente; precio anómalo; información insuficiente; publicación inactiva; duplicado.

## 26. Precio de alquiler de mercado

A partir de los comparables, calcular `LOW MARKET RENT`, `BASE MARKET RENT`, `HIGH MARKET RENT`. El sistema debe recomendar `MARKET RENT` pero siempre mostrar el rango.

## 27. Metodología de valoración

No utilizar solamente promedio simple. Evaluar: mediana; promedio; precio por m²; similitud; dispersión; calidad de comparables. La renta recomendada debe surgir de una combinación de estos factores.

## 28. Ajustes

Si el departamento objeto tiene diferencias respecto de comparables, realizar ajustes cualitativos y, cuando exista suficiente evidencia, cuantitativos (mejor piso, mejor vista, balcón, cochera, amoblamiento, amenities / menor superficie, peor ubicación, menor calidad, sin cochera, peor estado). **No inventar porcentajes de ajuste.** Si no existe evidencia suficiente: `ADJUSTMENT = QUALITATIVE`.

## 29. Precio de mercado recomendado

El sistema debe entregar `RENTAL MARKET VALUE`. Ejemplo: rango observado USD 650–750, renta base recomendada USD 700, rango conservador USD 650, rango optimista USD 750 — y explicar por qué.

## 30. Control de calidad del AMC

Antes de utilizar el valor, verificar: mínimo de comparables suficientes · fuentes independientes · fechas recientes · propiedades realmente comparables · misma zona o zona justificadamente comparable · precios expresados correctamente · moneda · superficie · tipología · estado. Si no existe evidencia suficiente: `AMC_STATUS = LOW_CONFIDENCE`. No presentar el resultado como certeza.

## 31. Fuentes no disponibles

Si una fuente bloquea acceso, no permite consulta, no contiene resultados, requiere interacción no disponible, o devuelve información insuficiente: **no inventar datos.** Registrar `SOURCE_STATUS`: `AVAILABLE` / `PARTIAL` / `BLOCKED` / `NO_RESULTS` / `UNVERIFIED`. El sistema puede continuar con las otras fuentes, pero debe informar la limitación.

## 32. Fecha de los datos

Cada comparable debe tener `OBSERVATION_DATE`. El análisis debe mostrar "Datos consultados al [fecha]". Nunca presentar información de mercado como permanente.

## 33. Rental Market Confidence

Crear `HIGH` / `MEDIUM` / `LOW` según: cantidad de comparables; calidad; consistencia; recencia; fuentes; dispersión.

## 34. Investment Engine

Una vez determinado el alquiler, ejecutar el análisis de inversión. Inputs: precio de compra, cochera, costos de adquisición, amoblamiento, inversión total, renta mensual, vacancia, expensas, administración, mantenimiento, impuestos, otros costos.

## 35. Ingreso bruto

`GROSS ANNUAL RENT = MONTHLY MARKET RENT × 12`

## 36. Vacancy

Crear parámetro editable `VACANCY_RATE`. No asumir automáticamente 0%. Permitir 0% / 3% / 5% / 8% / 10% u otro valor editable.

## 37. Ingreso efectivo

`EFFECTIVE RENTAL INCOME = GROSS ANNUAL RENT × (1 − VACANCY RATE)`

## 38. Gastos operativos

Separar: expensas, administración, mantenimiento, seguro, impuestos, reparaciones, reposición, otros. **No duplicar gastos.**

## 39. Rentabilidad bruta

`GROSS YIELD = ANNUAL GROSS RENT / TOTAL INVESTMENT × 100`

## 40. Rentabilidad neta

`NET ANNUAL INCOME = EFFECTIVE RENTAL INCOME − OPERATING EXPENSES`
`NET YIELD = NET ANNUAL INCOME / TOTAL INVESTMENT × 100`

## 41. Rentabilidad del capital

Cuando exista financiación, separar `PROPERTY YIELD` de `EQUITY RETURN`. No confundir rentabilidad del activo con rentabilidad sobre capital propio.

## 42. Flujo de fondos

Crear `MONTHLY CASH FLOW` y `ANNUAL CASH FLOW`, contemplando: desembolso inicial, cuotas, ingresos, vacancia, gastos, mantenimiento, administración, financiación, saldo.

## 43. Escenarios

Generar como mínimo `CONSERVADOR` / `BASE` / `OPTIMISTA`:

- **Conservador**: menor renta, mayor vacancia, mayores gastos.
- **Base**: renta recomendada, vacancia media, gastos estimados.
- **Optimista**: renta superior, menor vacancia, gastos controlados.

Los parámetros deben ser editables.

## 44. Sensibilidad

Permitir modificar: precio de compra, renta, vacancia, gastos, amoblamiento, financiación. Mostrar cómo cambia: `GROSS YIELD`, `NET YIELD`, `CASH FLOW`, `EQUITY RETURN`.

## 45. Precio de compra vs. rentabilidad

Herramienta para responder: "¿A qué precio tendría que comprar esta unidad para obtener X%?" — dado `TARGET NET YIELD`, calcular `MAXIMUM PURCHASE PRICE` según la renta de mercado y los costos establecidos. Herramienta de negociación y adquisición.

## 46. Precio de alquiler vs. rentabilidad

También responder: "¿Qué alquiler necesito para obtener X%?" — mostrar `RENT REQUIRED` y compararlo contra `MARKET RENT`, para identificar si el objetivo de rentabilidad es realista.

## 47. No manipular el mercado

Si `RENT REQUIRED > MARKET RENT`, informar: *"El objetivo de rentabilidad requiere una renta superior a la estimada por el mercado."* **No modificar el precio de mercado para alcanzar el objetivo.**

## 48. Inversión en amoblamiento

Para unidades destinadas a alquiler amoblado, separar `PROPERTY INVESTMENT` / `FURNISHING INVESTMENT` / `TOTAL INVESTMENT`, y permitir comparar amoblado vs. sin amoblar.

## 49. Dos modelos de alquiler

Cuando corresponda analizar `TRADITIONAL RENTAL` y `FURNISHED / TEMPORARY RENTAL`, **no mezclar ambos mercados**. Cada uno debe tener comparables propios, renta propia, vacancia propia, costos propios, rentabilidad propia.

## 50. Market rent vs. investor target

El informe debe mostrar siempre `PRECIO DE MERCADO ESTIMADO` vs. `PRECIO NECESARIO PARA OBJETIVO DEL INVERSOR`. Ejemplo: Market Rent USD 700 vs. Rent Required USD 820 → conclusión: "El objetivo del inversor está por encima de la evidencia de mercado."

## 51. Informe para el inversor

Generar un **Meridiano Capital · Investment Analysis** con: 1. Proyecto — 2. Ubicación — 3. Google Maps — 4. Unidad seleccionada — 5. Tipología — 6. Piso — 7. Superficie — 8. Cochera — 9. Precio de compra — 10. Costos adicionales — 11. Inversión total — 12. AMC — 13. Comparables — 14. Rango de alquiler — 15. Alquiler recomendado — 16. Ingreso bruto — 17. Vacancia — 18. Gastos — 19. Ingreso neto — 20. Rentabilidad bruta — 21. Rentabilidad neta — 22. Flujo de fondos — 23. Escenario conservador — 24. Escenario base — 25. Escenario optimista — 26. Riesgos — 27. Supuestos — 28. Fuente de datos — 29. Fecha de actualización — 30. Conclusión.

## 52. Conclusión del inversor

No utilizar "Esta inversión garantiza X%." Utilizar: *"Con base en los datos de mercado disponibles y los supuestos establecidos, la rentabilidad estimada es…"*

## 53. Data sources

El informe debe identificar: C21, RE/MAX, InfoCasas, documentación del proyecto, lista de precios, información proporcionada por Meridiano. Cada dato debe poder rastrearse.

## 54. Market Data Snapshot

Guardar una copia lógica del análisis realizado, para comparar "AMC de agosto 2026" vs. "AMC posterior". Crear `MARKET SNAPSHOT ID`, fecha, zona, tipología, comparables, rentas, conclusión.

## 55. Historial del mercado

No sobrescribir AMC anteriores. Crear `AMC-001`, `AMC-002`, `AMC-003`… Así Meridiano podrá observar la evolución de alquileres, precios, rentabilidad, demanda, oferta.

## 56. Market Intelligence Database

Cada AMC debe alimentar una base general de conocimiento. Separar `CASE DATA` de `MARKET KNOWLEDGE`. Ejemplo: "Departamento 201 tiene 63,36 m²" es dato del caso; "Departamentos de 1 dormitorio de aproximadamente 60–65 m² en esta zona presentan determinado rango de alquiler" puede convertirse en conocimiento de mercado.

## 57. Alerta de datos antiguos

Si un AMC tiene más de X días: `MARKET_DATA_STALE`. El número de días debe ser configurable.

## 58. Actualización

Permitir `/update-amc` para actualizar el análisis de alquiler. No modificar el análisis histórico — crear una nueva versión.

## 59. Comandos

`/project-load` · `/unit-list` · `/parking-list` · `/investment` · `/location` · `/amc` · `/comparables` · `/market-rent` · `/yield` · `/cash-flow` · `/scenarios` · `/sensitivity` · `/target-yield` · `/max-purchase-price` · `/investor-report` · `/update-amc` · `/market-history`

## 60. Ejemplo de flujo

El asesor escribe: *"Analizar inversión: Proyecto UON Calathea, Unidad Departamento 201, Cochera 10"*. El sistema debe: 1. identificar proyecto; 2. identificar unidad; 3. verificar precio; 4. verificar superficie; 5. verificar tipología; 6. verificar piso; 7. verificar cochera; 8. obtener ubicación; 9. construir área de mercado; 10. buscar comparables; 11. consultar C21; 12. consultar RE/MAX; 13. consultar InfoCasas; 14. construir pool de candidatos; 15. seleccionar los 3 mejores; 16. calcular rango de alquiler; 17. recomendar renta de mercado; 18. calcular inversión total; 19. calcular rentabilidad; 20. generar escenarios; 21. mostrar supuestos; 22. generar informe.

## 61. Regla de seguridad

Nunca fabricar: precios, superficies, alquileres, comparables, URLs, ubicación, disponibilidad, datos de mercado. Si no se encuentra: `NO_DATA`. Si la información es insuficiente: `INSUFFICIENT_DATA`. Si una fuente está bloqueada: `SOURCE_BLOCKED`.

## 62. Regla de diferenciación

Distinguir `PRECIO PUBLICADO` / `PRECIO DE MERCADO ESTIMADO` / `PRECIO DE CIERRE REAL`. No asumir que son iguales. Cuando no exista información de cierre, indicar: *"El análisis se basa en precios de oferta publicados."*

## 63. Control de calidad final

Antes de presentar una rentabilidad, verificar: unidad verificada · precio verificado · superficie verificada · cochera verificada · ubicación verificada · comparables suficientes · fuentes identificadas · fechas verificadas · renta estimada · costos incluidos · vacancia definida · metodología visible · rentabilidad calculada · escenarios generados · supuestos documentados · limitaciones indicadas.

## 64. Principio Meridiano Capital

El objetivo no es decir "Esta unidad tiene 10% de rentabilidad." El objetivo es poder demostrar:

> "Esta unidad cuesta X. Tiene Y m². Está ubicada en Z. El mercado comparable muestra alquileres entre A y B. El valor de mercado estimado es C. La inversión total es D. Con estos costos y una vacancia de E%, el ingreso neto estimado es F. Por lo tanto, la rentabilidad estimada es G%. Si el precio cambia, la rentabilidad cambia. Si la renta cambia, la rentabilidad cambia. Si los costos cambian, la rentabilidad cambia. El motor debe mostrar esa relación."

## 65. Principio final

**Meridiano Capital no debe vender una rentabilidad. Debe construir una tesis de inversión.**

La tesis debe estar sustentada por:

```
PRECIO + MERCADO + UBICACIÓN + PRODUCTO + RENTA + COSTOS + RIESGO + FLUJO + RENTABILIDAD
```

y toda conclusión debe poder ser auditada.

---

## Estado de implementación (2026-08-24)

Esta especificación queda **adoptada como arquitectura vigente**, pero **no está construida todavía** — ninguna sección de este documento debe leerse como "ya implementado". Estado real al momento de guardarla:

| Pieza del §4 (flujo principal) | Existe hoy | Cómo | Brecha vs. esta especificación |
|---|---|---|---|
| Project/Unit/Parking Database (§5, 8, 11) | ✅ Construido — 2026-08-24, D-087 | `skills/project-unit-database/` (SK-15) — `project.json`/`units.csv`/`parking.csv` por proyecto, `INVESTMENT_ASSET` (§13) y `PRICE_M2_BASE`/`ANALYSIS` (§10) vía `consultar.py`. Poblado con datos reales de UON Calathea (2 unidades) | §7 (cargar TODA la lista de precios) sin cumplir — solo las 2 unidades conocidas, no el proyecto completo; sin geocoding (§6, `location_status=UNVERIFIED`); sin comando de alta, se edita el CSV a mano |
| Ubicación + Google Maps (§6, 17) | ✅ Construido — 2026-08-28, D-088 | `skills/geocoding-engine/` (SK-16) — el agente geocodifica vía Browser/WebFetch contra un proveedor real (Google Maps/OSM Nominatim, cruzando 2 fuentes cuando es posible), `geocoder.py` calcula distancia real (Haversine) y el tier de área de mercado de §17 (`area-tier`), y escribe `latitud`/`longitud`/`google_maps_url`/`location_status` en `project.json` (`registrar`). Probado con UON Calathea: dirección de calle real extraída del boleto (`Prof. Manuel Riquelme 1444`, fuente E1), geocodificada a `VERIFIED_STREET_LEVEL`, corroborada por 2 fuentes independientes (~95m de diferencia entre ellas). `rental-amc-engine` (SK-14) ya consume la distancia real cuando el pool trae `lat`/`lon` | `LOCATION_STATUS` con 3 valores (`UNVERIFIED`/`VERIFIED_STREET_LEVEL`/`VERIFIED_ROOFTOP`) es `[EXTENSION]` sobre el binario que pedía §6; los umbrales de metros de los tiers de §17 también son `[EXTENSION]` (§17 solo fija el orden, no las distancias); nadie confirmó todavía ningún proyecto a nivel `VERIFIED_ROOFTOP`; sin geocoding por API propia (limitación de entorno — mismo problema de `urllib`/SSL que `dev_engine/cotizacion.py`); el `AMC-001` ya guardado de UON Calathea 105 no se re-geocodificó (no se tocan snapshots existentes) — ver `skills/geocoding-engine/SKILL.md` §"Qué queda pendiente" y el hallazgo sin resolver sobre el barrio de UON Calathea (registral "Santísima Trinidad" vs. geodata "Las Lomas") |
| AMC Engine de alquiler (§18-33) | ✅ Construido — 2026-08-24, D-085 | `skills/rental-amc-engine/` (SK-14) — pool de 5-15 candidatos (agente, vía WebSearch/WebFetch), `comparability_score` configurable, Top 3 + `DISCARDED COMPARABLES` con motivo, `SOURCE_STATUS` por fuente, `AMC_STATUS`/confianza, snapshots versionados `AMC-001/002/...` en `knowledge-base/investment/market-intelligence/rentals/amc-snapshots/` | Geocoding real (hoy compara nombre de barrio como texto), ajustes cuantitativos explícitos, `MARKET_DATA_STALE` sin umbral parametrizado, búsqueda (paso 1) sigue siendo manual por el agente — ver `skills/rental-amc-engine/SKILL.md` §"Qué queda pendiente" |
| AMC Engine de **venta** (framework hermano, no parte de §18-33) | Parcial | `knowledge-base/investment/methodologies/amc-analisis-comparativo-de-mercado.md` (D-077) ya define un framework de 5 pasos y fue aplicado una vez en HERRERA-001 (venta, no alquiler) | No comparte código con `rental-amc-engine` — son mercados distintos (§49); podría beneficiarse del mismo patrón de score/versionado en el futuro |
| Fuentes obligatorias C21/RE-MAX/InfoCasas (§19) | Parcial | Búsquedas web puntuales han citado InfoCasas | Nunca se consultó sistemáticamente C21 + RE/MAX + InfoCasas juntos, con estado por fuente |
| Investment Engine (§34-42) | Sí, como motor de cálculo | `production/app/backend/calculadora.py` (`evaluar_renta()`) ya implementa yield bruto/neto, vacancia, gastos operativos, escenarios — ver `knowledge-base/investment/01-metodologia-calculo.md` | El motor de cálculo cumple gran parte de §34-44; lo que falta es todo lo que antecede (AMC real) y todo lo que rodea (Project/Unit DB, informe estructurado de 30 puntos) |
| Target yield / max purchase price (§45-47) | ✅ Construido — 2026-08-28, D-090 | `skills/target-yield-tools/` (SK-17) — reutiliza `calculadora.py` sin duplicar su lógica de gastos; resuelve `MAXIMUM PURCHASE PRICE` y `RENT REQUIRED` en un solo paso (sin iterar), cada resultado verificado re-evaluando con el motor real. `RENT REQUIRED` se compara siempre contra `MARKET RENT` del AMC, con la advertencia SS47 automática si lo supera. Probado contra Unidad 105/UON Calathea (D-086): reproduce y confirma el hallazgo ya documentado | Sin integrar SS48 (inversión en amoblamiento) automáticamente; sin comando único que combine ambas herramientas en el informe de 30 puntos (§51) |
| Informe del inversor de 30 puntos (§51) | ✅ Construido — 2026-08-28, D-092 | `skills/investor-report-30/` (SK-18) — ensamblador que arma los 30 puntos tirando de las 4 piezas ya construidas de esta especificación (SK-14/15/16/17), sin recalcular nada; probado reproduciendo exactamente los números ya publicados de la Unidad 105/UON Calathea (D-086) y agregando automáticamente riesgos que antes estaban dispersos. Los documentos client-ready de HERRERA-001 (Memorándum, Investor Book, etc.) siguen siendo el formato para Modelo B/desarrollo, no se tocaron | Sin render visual/branded (produce JSON, no docx/pptx); SS14/15 (Client Purchase Scenario) y SS16 (Total Investment Cost) sin fuente de datos real todavía, esos puntos quedan `NOT_INCLUDED`/con el precio tal cual está cargado |
| Comandos (§59) | No existen | — | Ninguno de los 16 comandos de §59 está implementado |

**Precedente inmediato que motiva esta especificación**: la ficha de rentabilidad de la Unidad 105, UON Calathea (2026-08-24, mismo día) se construyó **sin** este nivel de disciplina de AMC — un solo comparable real (InfoCasas, Avda. Santísima Trinidad) escalado por m², sin pool de candidatos, sin consultar C21/RE-MAX, sin `COMPARABILITY SCORE` ni log de descartados. Esa ficha queda marcada como **pre-engine / preliminar** frente a este estándar — no se retracta (los números y las fuentes citadas siguen siendo reales, no fabricados), pero no cumple el nivel de rigor que esta especificación exige de ahora en más para el mercado de alquiler.

**Actualización 2026-08-24, mismo día (D-085, D-086, D-087)**: el AMC Engine de alquiler (§18-33) ya está construido y corrido con datos reales — la ficha de la Unidad 105 se re-hizo con `rental-amc-engine`, relevando C21 (1 resultado, expirado) e intentando RE/MAX (`BLOCKED`, 4 URLs sin contenido) además de InfoCasas — y dio un hallazgo material: la renta de mercado real (USD 618/mes base) queda **por debajo** del piso de rentabilidad de Meridiano en los escenarios pesimista y base, corrigiendo la estimación preliminar de un solo comparable (USD 820/mes) que sí pasaba el piso. Ver D-086. El Project/Unit/Parking Master Database (§5, 8, 11) también está construido — `skills/project-unit-database/` (SK-15, D-087), poblado con las 2 unidades reales conocidas de UON Calathea. **Siguiente pieza de menos cobertura, no ejecutada todavía**: geocoding real (§6, §17) — hoy ambos motores nuevos dependen de comparar nombre de barrio como texto, sin coordenadas ni radio real.

**Actualización 2026-08-28 (D-088)**: geocoding real (§6, §17) construido — `skills/geocoding-engine/` (SK-16), ver la fila de la tabla arriba. UON Calathea pasó de `location_status=UNVERIFIED` a `VERIFIED_STREET_LEVEL`, y `rental-amc-engine` ya usa distancia real cuando hay coordenadas. **Siguiente pieza de menos cobertura, no ejecutada todavía**: fuentes obligatorias C21/RE-MAX/InfoCasas consultadas sistemáticamente juntas con `SOURCE_STATUS` por fuente (§19) — hoy sigue siendo consultas puntuales, no un barrido de las 3 en cada AMC.
