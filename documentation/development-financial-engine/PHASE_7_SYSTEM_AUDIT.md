# PHASE 7 — SYSTEM AUDIT (solo lectura, nada modificado)

Auditoría del estado real del repositorio antes de construir el "Meridiano
Capital Development Financial OS". **Hallazgo principal, antes que nada**:
gran parte de lo que este prompt pide **ya existe**, construido el
2026-08-19 bajo `D-079` a partir de un prompt maestro con la misma
numeración de secciones (`S01`, `S15`, `S18`, `S25`...) que aparece citada
textualmente en los docstrings del código actual. Este audit existe
precisamente para no reconstruir lo que ya está hecho y validado.

## 0. Estado real del repo (no asumido — verificado ahora)

| | Valor que asumía el prompt | Valor real verificado |
|---|---|---|
| HEAD local | `7bc9be8f03e86d6ad3be0ee65e445ac602be0afb` | **`49e58f14a2c99c85a46afd28fce221cc97793386`** (114 commits) |
| HEAD remoto (`origin/master`) | (no especificado) | `7bc9be8...` — **2 commits detrás del local, sin push** |
| PII | "GREEN" | 🔴 **NO GREEN** — hallazgo abierto sin resolver: `Poder Pablo Boyajian.pdf` y `Escritura Edificio UON .pdf` (escaneos sin capa de texto, con el nombre real en el propio nombre de archivo) siguen en el historial y ya publicados en GitHub. Ver el mensaje anterior de esta sesión. **No se toca en este audit** — es de solo lectura. |
| Tests | "GREEN" | ✅ Confirmado ahora mismo: `test_calculadora.py`, `dev_engine.test_parametrizacion`, `dev_engine.validar_herrera` — los tres en verde |

## 1. Arquitectura existente — mapa completo

### 1.1 `production/app/backend/dev_engine/` — YA ES el Development Cost & Financial Engine

Construido 2026-08-19 (`D-079`), extendido 2026-08-22 (`D-080`/`D-081`). Módulos y su función real (verificado leyendo el código, no solo el README):

| Módulo | Clases/funciones | Cubre de este prompt |
|---|---|---|
| `moneda.py` | `TipoDeCambio`, `Monto`, `ConversorMoneda` | **§7.23 Currency Engine** — completo |
| `costos.py` | `Partida`, `ItemParametrizable`, `CostoTerreno`, `GrupoPartidas`, `GrupoParametrizable`, `Superficies`, `ContingenciaConfig`, `EstructuraCostos` | **§7.4 Cost Database, §7.5 Direct Cost Engine, §7.6 Indirect Cost Engine, §7.7 Development Cost Engine, §08 Regla de Superficies** — todos cubiertos. `Superficies` ya tiene docstring literal "S18 — nunca usar un denominador sin decir cuál superficie es" |
| `cashflow.py` | `VentaUnidad`, `curva_gasto_obra()` (lineal o S-curve), `flujo_ventas_usd()`, `FlujoDeFondos` | **§7.12 Construction Cash Flow, §7.13 Spending Curve** — completo, incluida la curva no-lineal que pide §7.13 |
| `financiamiento.py` | `TerminosFinanciamiento`, `calcular_financiamiento()` | **§7.14 Financing Engine** — completo, interés ya calculado "sobre saldo real" del flujo, no desconectado (cumple la regla explícita de §7.14) |
| `financiero.py` | `MetricasFinancieras`, `calcular_metricas()` | **§7.16 Financial Engine** — ROI/ROIC/TIR/VAN/Equity Multiple/Payback, reutilizando `tir()`/`vpn()` de `calculadora.py` |
| `sensibilidad.py` | `correr_sensibilidad()`, `buscar_punto_de_equilibrio()`, `precio_maximo_terreno_por_roi_objetivo()` | **§7.19 Sensitivity Engine, §7.20 Break-even Engine, §7.21 Maximum Land Price** — los tres ya construidos |
| `escenarios.py` | `Escenario`, `ESCENARIOS_ESTANDAR` (Conservador/Base/Optimista), `correr_escenarios()` | **§7.18 Scenario Engine** — completo |
| `investor_layer.py` | `capa_inversor()`, `exportar_json()`, `exportar_json_interno()` | **§7.27 Investor Data Layer** — completo, ya filtra qué se oculta del inversor |
| `proyecto.py` | `FichaProyecto`, `ResultadoProyecto`, `Proyecto` (orquestador único) | **§7.29 Integration Architecture** — ya es el orquestador que encadena costos→cash flow→financiero, un solo punto de entrada |
| `cotizacion.py` | `conversor_vigente()`, cache versionado | Parte de §7.23, con fuente real (`open.er-api.com`) + fallback declarado explícitamente |
| `validar_herrera.py` | Script ejecutable | **§7.30 Herrera Validation** — ya existe, corrido ahora mismo: **Inversión Total/Costo por m²/Comisión coinciden en los 6 casos**; IVA/Margen difieren del valor histórico exactamente como espera la corrección `D-082` |
| `test_parametrizacion.py` | Script ejecutable | **§7.31 Parametrization Test** — ya existe, corrido ahora mismo: ✅ verde |

### 1.2 `production/app/backend/calculadora.py` — reutilizado, no duplicado

`dev_engine` importa directamente `tir()`, `vpn()`, `anualizar()`, `construir_cronograma()` de acá — exactamente la regla de "no duplicar" que pide este prompt (§02) ya se venía cumpliendo.

### 1.3 Real Estate Intelligence OS (`D-074`, 2026-08-17) — la capa de Market Intelligence que pide §01

| Pieza | Ubicación | Cubre |
|---|---|---|
| Market Intelligence (costos, ventas, alquiler, Airbnb, terreno, comparables) | `knowledge-base/investment/market-intelligence/{construction-costs,sales,rentals,airbnb,land,comparables,neighborhoods,sources}/` | La "Market Intelligence" que el prompt pide como capa de entrada — **ya existe, con fuentes y confianza declaradas por dato (A/B/C/D)** |
| `construction-cost-engine` (SK-12) | `skills/construction-cost-engine/` | Costo sugerido por m² desde la base real — insumo directo de §7.4 |
| `market-price-validation` (SK-13) | `skills/market-price-validation/` | **Market Price Validation** de §17 — ya compara precio propuesto vs. mercado (BELOW/MARKET/ABOVE) |
| `rental-amc-engine` (SK-14) | `skills/rental-amc-engine/` | Rental Market Intelligence de §01 |
| `project-unit-database` (SK-15) | `skills/project-unit-database/` | Base de Proyecto/Unidad/Cochera de §7.3 (Data Model) — ya cubre `PROJECT`, `UNIT`, `PARKING`, `TYPOLOGY`, `SURFACE` como CSV+JSON, no como clases Python, pero es la misma fuente de verdad |
| `target-yield-tools` (SK-17) | `skills/target-yield-tools/` | Precio máximo de compra / alquiler requerido — mismo patrón que pide §7.21 pero para **alquiler**, no para desarrollo (son motores hermanos, no el mismo) |
| `investor-report-30` (SK-18) | `skills/investor-report-30/` | Informe de 30 puntos — **para alquiler unidad-por-unidad**, no para desarrollo (`HERRERA-001` usa su propio set de 4-6 documentos vía `dev_engine`, no esta skill) |

**Precisión importante**: hay **dos motores hermanos, no uno solo** — `dev_engine` (desarrollo/coinversión, un proyecto entero) y las skills SK-14/17/18 (alquiler, unidad por unidad, Modelo A). Comparten `calculadora.py` y `market-intelligence/`, pero resuelven preguntas distintas. El prompt de esta Fase 7 describe el primero.

### 1.4 `HERRERA-001` — ya es el Golden Test Case (§7.30), con datos reales

`contracts/cases/HERRERA-001/` tiene 48+ documentos de trabajo, terreno real (USD 850.000), 3 Ángulos de tipologías, comparables reales de mercado, y es contra lo que `dev_engine` ya se validó. No hace falta "elegirlo" como golden case — ya lo es.

## 2. Qué existe / qué falta — tabla de clasificación exacta

| Ítem del prompt | Estado |
|---|---|
| §7.1 System Audit | Este documento |
| §7.2 Data Mapping | **NO EXISTE como documento formal** — la información está dispersa entre `market-intelligence/` (fuentes) y `project-unit-database` (dónde vive cada dato), nunca consolidada en una sola tabla |
| §7.3 Data Model (22 entidades nombradas) | **EXISTE PARCIALMENTE** — como clases Python (`costos.py`/`cashflow.py`/`proyecto.py`) para el lado de desarrollo, y como CSV (`project-unit-database`) para el lado de unidad/cochera. No hay un documento único que declare las 22 entidades con id/fuente/fecha/estado/unidad/moneda de forma uniforme |
| §7.4-7.7 Cost Engines (Directo/Indirecto/Desarrollo) | ✅ **EXISTE**, `costos.py`, validado contra Herrera |
| §08 Regla de Superficies | ✅ **EXISTE**, `Superficies` en `costos.py`, ya con la misma regla textual |
| §7.8 Cost/m² Engine | ✅ **EXISTE** (dentro de `proyecto.py`/`ResultadoProyecto`, ya usado en `validar_herrera.py`) |
| §7.9 Cost Adjustment Engine | 🟡 **EXISTE PARCIALMENTE** — se puede modificar cualquier parámetro y recalcula todo (probado en `test_parametrizacion.py`), pero no hay una vista dedicada de "antes/después/variación%/impacto" — hoy hay que comparar dos corridas a mano |
| §7.10 Sales Price Engine (por unidad, etapas) | 🟡 **EXISTE PARCIALMENTE** — `VentaUnidad` tiene precio/mes/anticipo/cuotas, pero no un campo de "etapa" nombrada (Preventa/Pozo/Obra/...) editable como catálogo propio |
| §16 Price Escalation | ❌ **DEBE CREARSE** — confirmado como pendiente explícito en el propio `01-reporte-final.md` desde el 2026-08-22, nunca construido |
| §17 Market Price Validation | ✅ **EXISTE**, `market-price-validation` (SK-13) — **DEBE CONECTARSE** a `dev_engine` (hoy son consultas separadas, no automáticas dentro de `Proyecto.correr()`) |
| §7.11 Pre-Sales Engine | ✅ **EXISTE**, `VentaUnidad`+`flujo_ventas_usd()` ya impacta cash flow/capital/financiación |
| §7.12/7.13 Cash Flow + Spending Curve | ✅ **EXISTE**, incluida curva no lineal (S-curve) |
| §7.14 Financing Engine | ✅ **EXISTE**, interés ya atado al flujo real (no independiente) |
| §7.15 Peak Capital Engine | ✅ **EXISTE** dentro de `cashflow.py` (`peak_capital_requirement()`) |
| §7.16 Financial Engine | ✅ **EXISTE** completo |
| §7.17 Rentabilidad por unidad | 🟡 **EXISTE PARCIALMENTE** — el motor da el resultado agregado del proyecto; asignar margen/ROI por unidad individual (por m²/coeficiente/tipología) no está construido como función propia |
| §7.18 Scenario Engine | ✅ **EXISTE**, Conservador/Base/Optimista + custom |
| §7.19 Sensitivity Engine | ✅ **EXISTE**, matriz completa |
| §7.20 Break-even | ✅ **EXISTE** |
| §7.21 Maximum Land Price | ✅ **EXISTE**, `precio_maximo_terreno_por_roi_objetivo()` |
| §7.22 Target Return Engine (CUMPLE/NO CUMPLE/REQUIERE NEGOCIACIÓN) | ❌ **DEBE CREARSE** — confirmado, no existe ningún string ni función con esta lógica de veredicto hoy |
| §7.23 Currency Engine | ✅ **EXISTE** completo |
| §7.24 Inflation Engine (general/construcción/materiales/mano de obra diferenciados) | ❌ **DEBE CREARSE** — hoy solo existe un `contingencia_pct` genérico, no una inflación proyectada por categoría |
| §7.25 Data Quality Engine | ❌ **DEBE CREARSE** — confirmado, no existe validación de superficies imposibles/%>100/duplicados |
| §7.26 Mathematical Audit | ❌ **DEBE CREARSE** — confirmado explícitamente como pendiente desde `D-080` ("Auditoría matemática automática... hoy solo existe el test puntual de Herrera") |
| §7.27 Investor Data Layer | ✅ **EXISTE** completo |
| §7.28 Investor Consistency | ✅ **EXISTE** — Memorándum/Investor Book/Presentación/Investment Summary de Herrera ya leen el mismo JSON (`D-080`/`D-081`), verificado con QA visual completa |
| §7.29 Integration Architecture | ✅ **EXISTE**, `Proyecto` es el orquestador único |
| §7.30 Herrera Validation | ✅ **EXISTE**, corrido ahora: verde |
| §7.31 Parametrization Test | ✅ **EXISTE**, corrido ahora: verde |
| §7.32 Integration Test (Market Intelligence → ... → Investor Output) | 🟡 **PARCIAL** — cada tramo está probado por separado; no hay un test único que atraviese las 7 capas de punta a punta en una sola corrida |
| §7.33 Versioning (historial de cambios de parámetro por escenario) | ❌ **DEBE CREARSE** — `Escenario` hoy es solo `{nombre, ajustes_pct}`, sin fecha/usuario/valor-anterior/motivo |
| §7.34 Documentation | 🟡 **PARCIAL** — existe y es buena (`README.md`, `01-reporte-final.md`), pero no cubre todavía metodología de asignación por unidad ni Target Return |
| §7.35 Executive Dashboard | ❌ **DEBE CREARSE**, confirmado pendiente desde `D-080` |
| §7.36 Cost Bridge | 🟡 **EXISTE el dato** (`EstructuraCostos` ya tiene cada grupo), **falta la representación** (visual/tabla con % de peso) |
| §7.37 Outputs 01-13 numerados | ❌ **DEBE CREARSE** como estructura formal — el dato existe disperso, no empaquetado en 13 salidas nombradas |

## 3. Duplicaciones detectadas

**Ninguna duplicación de lógica de cálculo.** El único riesgo de duplicación real es conceptual: `target-yield-tools` (SK-17, alquiler) y el futuro `Target Return Engine` (§7.22, desarrollo) resuelven una pregunta con la misma forma ("¿esto cumple el objetivo?") sobre dominios distintos — hay que documentar explícitamente que son dos motores hermanos, no fusionarlos ni confundirlos.

## 4. Riesgos identificados

1. **PII abierta sin resolver** (ver sección 0) — no bloquea el trabajo de esta fase (es de solo lectura, no toca `contracts/UON-001`), pero sigue pendiente y no debe olvidarse.
2. **2 commits locales sin push** (`8498c58`, `49e58f1`) — si se construye sobre este estado y luego se publica, hay que pushear esos primero o el historial remoto queda atrás.
3. **Ambigüedad de "Sales Price Intelligence" vs. "Market Price Validation"** — el prompt las nombra como si fueran cosas separadas; en el repo son la misma pieza (SK-13). Aclarar antes de "crear" una nueva.
4. **`market-price-validation` (SK-13) no está conectada a `dev_engine`** — hoy hay que llamarla aparte; conectarla es la única integración real que falta entre Market Intelligence y el Cost/Sales Engine.

## 5. Propuesta de arquitectura (para el Checkpoint — no implementada)

No hace falta una arquitectura nueva — la que pide el prompt (§53) **ya es, en gran parte, la arquitectura real de `dev_engine`**. La propuesta es **extender, no reemplazar**:

- Agregar los 6 módulos genuinamente faltantes (`escalamiento.py`, `target_return.py`, `inflacion.py`, `calidad_datos.py`, `auditoria_matematica.py`, `dashboard.py`) siguiendo el mismo patrón de los módulos existentes (dataclasses + funciones puras, config en `parametros_dev_engine.json`, nunca hardcodeado).
- Conectar `market-price-validation` (SK-13) como parte de `Proyecto.correr()`.
- Formalizar `PHASE_7_DATA_MAP.md` (§7.2) y el Data Model unificado (§7.3) como documentación — sin mover el código existente.

## 6. Propuesta de integración

`market-price-validation` (SK-13) se llama desde `costos.py`/`sensibilidad.py` para dar "Costo Sugerido vs. Costo Ingresado" (ítem 6 del pending list de `D-080`) — es la única conexión real que falta entre piezas ya existentes.
