Estado: CURRENT — Fase 1-3 del "Real Estate Intelligence OS". Arquitectura confirmada por el founder el 2026-08-17 ("árbol completo propuesto", "de corrido sin pausas") y ejecutada en su totalidad — ver `documentation/real-estate-os/01-reporte-final.md` para el resultado completo de las Fases 4-14
Fuente original: prompt maestro "MERIDIANO CAPITAL — REAL ESTATE INTELLIGENCE OS", founder, 2026-08-17
Dominio: TECHNOLOGY/INVESTMENT/GOVERNANCE

# Real Estate Intelligence OS — Auditoría, inventario y arquitectura propuesta

## 0. Qué es este documento

El founder pidió convertir el conocimiento generado en `HERRERA-001` (y en el resto del repo) en la primera versión operativa de un sistema reutilizable: separar **Project Data** (Nivel 1) de **Market Intelligence** (Nivel 2), **Methodology** (Nivel 3) y **System** (Nivel 4), versionar todo, no borrar históricos, y dejar el sistema listo para que el próximo proyecto consuma conocimiento en vez de reconstruirlo desde cero.

Este documento cubre las **Fases 1-3** del prompt maestro (Auditoría, Inventario, Arquitectura propuesta) y termina con una propuesta concreta de ejecución para las Fases 4-14. **No se movió ni se creó ningún archivo de datos todavía** — el prompt maestro pide explícitamente presentar el diagnóstico antes de ejecutar cambios estructurales (§43), y este repo ya contiene años-persona de trabajo real (financiero, con PII de clientes en `contracts/`) que no conviene reorganizar sin confirmar el criterio primero.

**Hallazgo principal, antes de entrar en el detalle**: el sistema que pide el prompt maestro **ya existe parcialmente y funcionando** — no se está partiendo de cero. Gran parte de la disciplina de separación, versionado y trazabilidad que el prompt maestro especifica ya está en producción en este repo desde hace una semana, vía `governance/decisions/DECISION_REGISTER.md` y el patrón "cross-cutting" aplicado en `knowledge-base/investment/`. Lo que falta es formalizarlo en una arquitectura de carpetas explícita, cerrar los huecos de separación que sí existen, y construir la capa de Skills/Workflows que automatice lo que hoy hago manualmente cada vez.

---

## 1. SYSTEM AUDIT — qué existe realmente

### 1.1 Gobernanza y versionado (ya implementado, nivel alto de madurez)

`governance/decisions/DECISION_REGISTER.md` (196 líneas) ya funciona como el motor de versionado + audit trail que pide el prompt maestro en §20-21, aunque a nivel de **decisión**, no de dato puntual:

- Estados: CURRENT / HISTORICAL / PROPOSED / UNRESOLVED / DEPRECATED — equivalente funcional al ciclo de vigencia que pide §19 (CURRENT/AGING/OUTDATED/HISTORICAL), pero aplicado a decisiones de negocio, no a cada fila de una tabla de datos.
- 73 decisiones registradas (D-001 a D-073) más 7 ideas PROPUESTAS (P-001 a P-007), cada una con: qué se decidió, dominio, por qué, cita textual del founder, y los archivos fuente exactos que la implementan. Esto ya es, en esencia, el **Audit Trail** del §21.
- **Patrón "cross-cutting" ya establecido y usado 10 veces** (D-063 a D-073): cuando el founder dice que algo aplica "a todos los proyectos"/"para otros casos", ya se promueve de la conversación de un caso puntual a `knowledge-base/investment/` + una entrada en el Decision Register. Es exactamente la regla del §26-27 del prompt maestro ("nuevo proyecto ≠ nueva base"), ya en práctica.

### 1.2 Separación Project Data vs. Market Intelligence (parcialmente lograda)

`knowledge-base/investment/` (11 archivos + carpeta `data/` con 5 CSV/XLSX) ya cumple el rol de Nivel 2 (Market Intelligence) que pide el §23, con clasificación de dato A/B/C/D (equivalente reducido al CONFIRMED/CALCULATED/ESTIMATED/ASSUMPTION del §5) aplicada de forma consistente:

| Archivo | Contenido | D-ID que lo respalda |
|---|---|---|
| `00-overview.md` | Cartera propia de Meridiano/Urbannit (53 unidades) | — |
| `01-metodologia-calculo.md` | Metodología de cálculo de rentabilidad | D-001/002/003 |
| `02-politica-de-rentabilidad.md` | Política de pisos de rentabilidad | D-002/033 |
| `03-parametros-de-mercado.md` | Parámetros de mercado (comisión, cronograma cuotas) | — |
| `04-auditorias-financieras.md` | Auditorías reales | — |
| `05-matriz-pisos-techos.md` | Matriz pisos/techos (Eje Corporativo, resto PROPUESTO) | P-004 |
| `06-costos-de-construccion.md` | **Costo de construcción/m² por tipo y calidad** | D-064 |
| `07-tarifas-por-barrio-asuncion.md` | **Alquiler por barrio × tipología × tipo** (8/68 barrios) | D-066/069/070 |
| `08-costos-de-amueblamiento.md` | Costo de amueblamiento por calidad/tipología | D-068 |
| `09-plan-regulador-indicadores-urbanisticos.md` | Indicadores urbanísticos (Ordenanza 43/1994) | D-070 |
| `10-valor-m2-venta-por-barrio-calidad-y-etapa.md` | **Venta/m² por barrio × calidad × etapa** (16 registros, 2 barrios) | D-073 |

Esto ya implementa, en sustancia: la base de costos de construcción (§6-8), la base de alquileres tradicional (§9), la base de precios de venta (§12), y el sistema de calidad/amoblamiento estandarizado (§11) — con la salvedad de que **Airbnb no tiene base propia separada** todavía (§10 del prompt maestro pide una base distinta; hoy vive mezclada como una fila más de "tipo de alquiler" dentro de `07-...md`) y de que **no hay comparables crudos guardados como activo de mercado**, ver 1.3.

### 1.3 Fuga real de Nivel 2 dentro de Nivel 1 (el hueco de separación más concreto que encontré)

`contracts/cases/HERRERA-001/37-comparables-reales-de-venta-en-pozo-century21.md` contiene **7 comparables reales de Century 21** (Inarco Herrera, Sunset/Ayre/Livit/Matrisa/Marina/Ventura) con atributos completos y reutilizables — precio, m², condiciones de financiamiento durante obra, precio de cochera, fecha de entrega, developer — que son Market Intelligence genuina, no específica de la negociación de Herrera. Solo una versión reducida (16 filas, sin financiamiento/cochera/developer) llegó a `10-valor-m2-venta-por-barrio-calidad-y-etapa.md` / el CSV. **El detalle rico del comparable está atrapado en la carpeta de caso** en vez de vivir como activo de mercado de primer nivel. Mismo patrón, menor escala, en varios de los otros 39 archivos de HERRERA-001 (p. ej. `32-airbnb-real-de-barrio-herrera.md`).

### 1.4 Metodologías (documentadas, pero no todavía extraídas como unidades reutilizables)

Las metodologías más valiosas del caso ya están escritas y citadas correctamente hacia atrás (buena disciplina), pero viven **dentro de la narrativa de `06-costos-de-construccion.md` y de los archivos de caso**, no como documentos de metodología independientes que un futuro proyecto pueda invocar directo:

- **Netting estructura/terminación** (usar tasa Básica para valorar el esqueleto ya construido, restar de la tasa target — no de la Básica — para el costo real de terminación): documentada en `06-costos-de-construccion.md` §"Metodología para separar...", validada en `HERRERA-001/10-...md`.
- **Comparable Selection** (qué hace comparable a un comparable — zona, tipología, antigüedad, fuente): aplicada ad hoc en `HERRERA-001/03-...md` y `37-...md`, nunca escrita como criterio formal con un score.
- **Market Price Validation** (contrastar precio propuesto contra rango de mercado real y clasificar): aplicada ad hoc en `HERRERA-001/38-comparacion-politicas-de-precio-650-vs-720.md`, sin las 4 categorías del §15 (BELOW/MARKET/ABOVE/SIGNIFICANTLY ABOVE) ni un output estandarizado.
- **Motor de costos** (§8: barrio+superficie+calidad → costo estimado bajo/base/alto con fuente y confianza): existe el dato base (D-064) pero no el motor que lo combina con parámetros de un proyecto nuevo — hoy lo hago manualmente en cada caso.

### 1.5 Fuentes (citadas, pero sin registro central ni niveles de confiabilidad)

Cada archivo cita su fuente inline ("Founder, 2026-08-16", "Century 21", "Place Analyzer") — eso ya es mejor que la mayoría de sistemas de conocimiento reales. Pero no existe el `SOURCE_REGISTRY.md` centralizado del §16, ni la jerarquía Nivel 1-5 de confiabilidad de fuente, ni un `Confidence Score`/`Comparable Score` explícito (§13, §31) — la confiabilidad hoy se expresa en prosa ("no es una tasación profesional", "outlier de piso alto") en vez de en un campo estructurado y consultable.

### 1.6 Sistema (Nivel 4) — desigual entre dominios

- `production/generadores/` (JS + `docx`/`pptxgenjs`) es un motor de producción de entregables genuinamente maduro y reutilizado: 4 proyectos distintos (Meridiano, Urbannit, HERRERA-001, P04 compliance) ya lo usan.
- `skills/rentabilidad-calculator` + `production/app/backend/calculadora.py` ya cubren gran parte del **Skill 07 (Development Financial Model)** del §24.
- `workflows/rentabilidad-evaluation` es el único workflow real — no hay nada equivalente al "comando maestro" del §25 (arrancar preguntando "¿qué tipo de proyecto?" y jalar automáticamente Market Intelligence).
- **9 de las 10 Skills del §24 no existen como Skills** — la lógica de Market Intelligence, Construction Cost, Comparable Analysis, Rental Analysis, Airbnb Analysis, Valuation, Investment Analysis, Due Diligence e Investor Memorandum se ejecutó manualmente por mí, conversación por conversación, en los 39 archivos de `HERRERA-001`. Es exactamente el problema que el founder ya había anticipado y dejado agendado en **P-007** ("habilidad de Análisis Comparativo de Mercado permanente... agendar generar una habilidad que esté permanentemente actualizando y verificando valores de mercado") y en **P-006** (agente de inteligencia de mercado en tiempo real, con la salvedad de que la ingesta de WhatsApp queda condicionada/no se construye ahora). **Este prompt maestro es, en sustancia, la activación de P-007** — lo registro así en la sección 4.

### 1.7 Casos de contrato — arquitectura ya correcta, no tocar

`contracts/cases/` (HERRERA-001, UON-001, `_template/`) ya sigue el patrón Nivel 1 correcto por diseño (D-054): PII real, nunca citado en piezas de marca, separado de `knowledge-base/`. UON-001 es un caso de auditoría de contrato de compraventa ya firmado (no desarrollo/inversión) — estructuralmente distinto de HERRERA-001, no es Market Intelligence relevante para este sistema. No requiere cambios.

---

## 2. KNOWLEDGE INVENTORY — resumen por categoría

| Categoría (prompt maestro §4) | Dónde vive hoy | Estado |
|---|---|---|
| Project Data | `contracts/cases/HERRERA-001/` (39 archivos), `UON-001/` | ✅ Correctamente aislado |
| Market Data — costos construcción | `knowledge-base/investment/06-...md` (D-064) | ✅ Promovido, cross-cutting |
| Market Data — alquiler | `knowledge-base/investment/07-...md` + CSV (D-066/069/070) | ✅ Promovido, cobertura parcial (8/68 barrios) honesta |
| Market Data — venta | `knowledge-base/investment/10-...md` + CSV (D-073) | ✅ Promovido, cobertura parcial (16 registros/2 barrios) honesta |
| Market Data — Airbnb | Mezclado dentro de `07-...md` (una fila más de "tipo de alquiler") | ⚠️ Sin base propia separada, contra §10 |
| Comparables (detalle completo) | Atrapados en `HERRERA-001/37-...md` y `32-...md` | ⚠️ No promovidos como activo de mercado de primer nivel |
| Financial Models | `production/app/backend/calculadora.py`, `skills/rentabilidad-calculator/` | ✅ Ya es Sistema/Skill funcional |
| Methodology | Narrativa dentro de `06-...md` y archivos de caso | ⚠️ No extraída como documento independiente/invocable |
| Assumptions | Citadas inline por archivo, sin registro central de supuestos vigentes | ⚠️ Sin tabla propia |
| Sources | Citadas inline, sin registro central ni tiers | ⚠️ Falta `SOURCE_REGISTRY.md` |
| Legal | `knowledge-base/legal/`, `contracts/cases/*/legal-review/` | ✅ Ya separado correctamente |
| Templates | `contracts/templates/`, `contracts/cases/_template/` | ✅ Ya existen |
| Prompts | Este mismo prompt maestro, sin archivo propio todavía | ⚠️ Pendiente de archivar |
| System | `production/generadores/`, `skills/`, `workflows/` | ⚠️ Maduro en generación de documentos, incompleto en Skills de análisis |
| Historical/Obsolete | `HISTORICAL`/`DEPRECATED` en `DECISION_REGISTER.md` | ✅ Ya versionado, nunca borrado |

---

## 3. Arquitectura propuesta

**Principio: adaptar, no reemplazar.** El prompt maestro (§23) autoriza explícitamente adaptar la estructura existente en vez de crear el árbol `meridiano/` genérico que describe — y la instrucción general del repo (`CLAUDE.md`) es no destruir trabajo existente. La arquitectura de 11 capas ya cubre el 90% de lo que pide el prompt maestro; lo que se propone es **estructurar `knowledge-base/investment/` en sub-carpetas explícitas** (hoy es una lista plana de 11 archivos) y cerrar los 4 huecos reales identificados en la sección 1.

```
knowledge-base/investment/
├── 00-overview.md                     (sin cambios)
├── 01-metodologia-calculo.md          (sin cambios)
├── 02-politica-de-rentabilidad.md     (sin cambios)
├── 03-parametros-de-mercado.md        (sin cambios)
├── 04-auditorias-financieras.md       (sin cambios)
├── 05-matriz-pisos-techos.md          (sin cambios)
├── market-intelligence/               ← NUEVO — reagrupa 06/07/08/09/10 + data/, sin perder el número/historial git (git mv)
│   ├── construction-costs/            (06-costos-de-construccion.md + histórico)
│   ├── sales/                         (10-valor-m2-venta...md + CSV)
│   ├── rentals/                       (07-tarifas-por-barrio...md + CSV)
│   ├── airbnb/                        ← NUEVO, separa Airbnb de alquiler tradicional (cierra el hueco §10)
│   ├── comparables/                   ← NUEVO, promueve el detalle completo de comparables (cierra el hueco §1.3)
│   ├── neighborhoods/                 (categoria-de-zona + distritos + plan regulador, D-069/070)
│   └── sources/
│       └── SOURCE_REGISTRY.md         ← NUEVO, registro central con niveles de confiabilidad 1-5 (§16)
├── methodologies/                     ← NUEVO — extrae metodologías reutilizables como documentos propios
│   ├── netting-estructura-terminacion.md
│   ├── comparable-selection-engine.md
│   ├── market-price-validation-engine.md
│   └── motor-de-costos.md
└── assumptions/
    └── ASSUMPTIONS_REGISTER.md        ← NUEVO, registro central de supuestos vigentes/versionados (§20, complementa el Decision Register)
```

Cambios adicionales, fuera de `investment/`:
- `skills/` — agregar 3-4 Skills nuevas (ver Fase 9, no las 10 del prompt maestro de una — el §24 pide explícitamente no crear Skills innecesarias).
- `workflows/nuevo-proyecto-inmobiliario/` — el "comando maestro" del §25.
- `contracts/cases/HERRERA-001/README.md` — agregar el marcador **FOUNDATIONAL PROJECT** (§34).
- CSV existentes — agregar columnas `confianza` (HIGH/MEDIUM/LOW) y `vigencia` (CURRENT/AGING/OUTDATED/HISTORICAL) de forma aditiva, sin romper los consumidores actuales de esas tablas.
- `governance/decisions/DECISION_REGISTER.md` — P-007 pasa de PROPOSED a CURRENT (este prompt maestro es su activación), nueva entrada D-074 documentando la creación del propio sistema.

---

## 4. Plan de ejecución propuesto (Fases 4-14)

| Fase | Qué hace | Alcance propuesto |
|---|---|---|
| 4-6 · Extracción/normalización/bases maestras | `git mv` de 06-10 + `data/` a `market-intelligence/`, crear `airbnb/` y `comparables/` con el detalle rescatado de `HERRERA-001/37` y `32`, agregar columnas confianza/vigencia | Ejecutable ahora, bajo riesgo (solo mueve/agrega, no borra) |
| 7 · Metodologías | Extraer las 4 metodologías de la sección 1.4 a documentos propios en `methodologies/` | Ejecutable ahora |
| 9 · Skills | Construir 3-4 Skills (Market Intelligence lookup, Construction Cost Engine, Comparable/Price Validation Engine) — no las 10 | Requiere diseño, más trabajo |
| 10 · Workflow maestro | `workflows/nuevo-proyecto-inmobiliario/` | Requiere diseño |
| 13 · Test de reconstrucción | Re-derivar costo/precio/margen de HERRERA-001 usando solo las bases/metodologías/skills nuevas, diffear contra el resultado real (`34-memorandum...md`) | Depende de que 4-10 estén terminadas |
| 14 · Reporte final | Las 13 secciones del §41 | Última fase |

**Actualización (2026-08-17, post-ejecución)**: el founder confirmó la arquitectura completa de la sección 3 y pidió ejecutar las Fases 4-14 de corrido. Ejecutadas en su totalidad — ver `documentation/real-estate-os/01-reporte-final.md` para el resultado completo, incluido el test de reconstrucción de `HERRERA-001` (Fase 13) y los ítems pendientes (sección 12 del reporte final).
