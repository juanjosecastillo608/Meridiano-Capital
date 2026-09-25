# Meridiano Capital — instrucciones para Claude Code

Este repo es el sistema operativo de conocimiento y desarrollo de Meridiano Capital, migrado desde conversaciones previas de Claude.ai (vía 3 Claude Skills ya destiladas) el 2026-08-02. Ver `inventory/MIGRATION_INVENTORY.md` para el origen completo.

## Antes de hacer cualquier trabajo de marca, negocio o inversión

1. **Consultar `knowledge-base/ai/03-sistema-de-consulta.md`** para saber qué archivos de `knowledge-base/` leer según el tipo de tarea. No respondas de memoria — este repo existe precisamente para no depender de eso.
2. **Regla de prioridad ante conflicto de reglas** (`knowledge-base/ai/01-protocolo-de-prioridad.md`): Manual de marca oficial > identidad visual > identidad verbal > estrategia/ADN > reglas de canal > recomendaciones creativas.
3. **Toda regla nueva no cubierta por el material existente debe etiquetarse `[EXTENSION]` explícitamente** — nunca presentarse como si fuera oficial, ni siquiera si "parece obvia". Protocolo completo en `knowledge-base/ai/02-protocolo-regla-no-definida.md`.
4. **Antes de entregar cualquier pieza de marca** (deck, web, post, ad, prompt de imagen/video), correr el audit de Brand Guardian: `knowledge-base/ai/04-director-creativo-y-brand-guardian.md` + Matriz de Decisión de 10 criterios (`knowledge-base/ai/05-matriz-de-decision.md`). Un veredicto NO ALINEADO en reglas duras de logo/color bloquea la entrega.
5. **Prompts de imagen/video con IA**: usar siempre el Prompt Engine de 5 bloques (`knowledge-base/ai/06-prompt-engine.md`), nunca improvisar paleta.
6. **Antes de analizar un proyecto inmobiliario nuevo** (desarrollo, compra, tasación), correr `workflows/nuevo-proyecto-inmobiliario/` (WF-03) — consulta `knowledge-base/investment/market-intelligence/` (costos, ventas, alquiler, Airbnb, comparables, zonas) antes de investigar desde cero. Regla **"nuevo proyecto ≠ nueva base"** — ver `documentation/real-estate-os/`.

## Bloqueantes financieros activos — no ignorar

Antes de confiar en o mostrar cualquier cifra de rentabilidad (propia o generada por `production/app/backend/calculadora.py`), ver `governance/decisions/DECISION_REGISTER.md`:

- **D-001/D-045 — RESUELTA (2026-08-02, ampliada 2026-08-10), fila de venta CORREGIDA 2026-08-23 (D-082/D-083)**: IVA diferenciado, confirmado por Juan José Castillo (founder): alquiler comercial 10%, alquiler residencial 5%, **renta temporal/Airbnb 10%** (D-045, ya no el 5% residencial). **Venta/reventa de inmuebles: 1,5% efectivo sobre el precio de venta** (30% base imponible presunta × 5% tasa reducida de inmuebles, Ley 125/91 Art. 82/91 — verificado contra la DNIT) — **no 5% directo, y mucho menos el 10% sobre costo de construcción que usó HERRERA-001 hasta el 2026-08-17**. Aplica tanto cuando vende Meridiano (Modelo B — coinversión/desarrollador) como cuando vende la S.A. del inversor (Modelo A, ~90% de los casos — D-083, ver `business/01-dos-modelos-de-negocio.md`), porque en ambos el vendedor factura como persona jurídica. Ver `knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md`.
- **D-002/D-044/D-045 — RESUELTA (2026-08-09/10)**: los pisos de rentabilidad se comparan siempre en BRUTO, con valores reales de mercado (`Tabla de Rentabilidades Alquiler.xlsx`) para las 6 clases del motor, incluida `temporal_casa` (= `temporal_departamento`, 15%, D-045). **Pendiente, sin trabajo activo por decisión del founder**: la matriz por zona/calidad (P-004) más allá de Eje Corporativo — ver `knowledge-base/investment/05-matriz-pisos-techos.md`.
- **D-003/D-046 — RESUELTA (2026-08-10)**: `evaluar_renta()` ya descuenta la ocupación real (55-65%, 60% por defecto) en la rama de alquiler temporal, vía el nuevo parámetro `ocupacion_pct`. Baja materialmente el yield neto reportado de `temporal_departamento`/`temporal_casa` frente al cálculo anterior — no es un bug, es el comportamiento correcto.
- **D-004/D-089 — RESUELTA (2026-08-28)**: los dos valores que mezclaban lógica y config en `calculadora.py` (`limpieza_pct` de renta temporal, `meses_hasta_pre_pozo` de reventa) ya viven en `parametros_mercado.json`. No quedan UNRESOLVED de impacto financiero directo a esta fecha — ver `governance/PRIORITY_PLAN.md` para todo lo demás que sigue abierto (no financiero).

## Protocolo de PII y seguridad — obligatorio antes de cualquier commit

Ver `governance/PII_POLICY.md` para la política completa (qué puede/no puede
contener cada capa, esquema de alias, regla de mínimo privilegio). Antes de
cualquier commit nuevo que agregue o modifique archivos dentro de
`contracts/cases/<CASO>/`, y en especial dentro de
`contracts/cases/<CASO>/extracted-data/`, correr un barrido buscando **como
mínimo**: nombres completos, apellidos, CI, RUC, emails, teléfonos,
domicilios, transcripciones literales de documentos legales, datos bancarios
personales, y cualquier otro identificador personal.

**No depender de una sola expresión regular** — probar variantes de formato
(con/sin puntos, con/sin prefijo "CI"/"C.I."/"RUC", nombre completo vs.
apellido solo) y, sobre todo, **leer el contexto de cada coincidencia antes
de decidir qué hacer con ella**: un patrón puede coincidir con PII real, con
el nombre de una calle, con el nombre de una empresa, o con un dato jurídico
legítimo que no es personal (ver `D-093` — el caso real donde "Cirilo
Caceres Zorrilla" era PII en 2 archivos y una referencia legítima a la calle
del inmueble en otros 6, y solo la lectura del contexto lo distinguía).

**Además del barrido de PII, antes de cualquier commit nuevo** (no solo en
`contracts/`) verificar también:

- **Secretos**: sin `.env`, claves privadas (`-----BEGIN...PRIVATE KEY-----`),
  API keys, tokens (AWS, GitHub, Slack u otro), passwords en texto plano, ni
  archivos de credenciales.
- **Archivos pesados**: cualquier archivo nuevo o modificado que supere ~50MB
  requiere confirmación explícita antes de commitear — considerar si
  realmente necesita versionarse o si conviene Git LFS (ver `git fsck`/
  auditoría de blobs grandes en `governance/decisions/DECISION_REGISTER.md`
  para el diagnóstico ya hecho sobre los binarios existentes de `contracts/`).
- **Tests**: si el cambio toca `production/app/backend/calculadora.py`,
  `production/app/backend/dev_engine/`, o cualquiera de las skills del Real
  Estate Intelligence OS (`skills/*-engine/`, `skills/target-yield-tools/`,
  `skills/investor-report-30/`), correr antes de commitear:
  `python production/app/backend/test_calculadora.py` y
  `python -m dev_engine.test_parametrizacion` (desde
  `production/app/backend/`) — ambos deben terminar en verde. Si algún
  resultado cambia sin que ese fuera el objetivo del cambio, es una
  regresión: detenerse y reportarla, nunca commitear "corrigiéndola" sin
  entender la causa.

## Nota sobre otras copias de este repo en esta máquina

Puede existir, fuera de esta carpeta, una copia histórica archivada (con PII
sin limpiar, sin remote configurado) y un backup espejo (`.git` bare, sin
remote) — ambos son snapshots de contingencia de la limpieza de PII de
`D-093` (2026-08-29), **nunca workspaces de trabajo**. Si alguna vez aparecen
en el filesystem de esta máquina, no commitear, no hacer push ni conectar
remotes ahí — el único workspace oficial es esta carpeta, con `origin`
apuntando a `https://github.com/juanjosecastillo608/Meridiano-Capital.git`.

## Estructura del repo

Reestructurada el 2026-08-02 según la arquitectura de 10 capas aprobada en `documentation/MIGRATION_MASTER_REPORT.md` (Fase 7). Los movimientos se hicieron con `git mv` — el historial se conserva. Ampliada a 11 capas el 2026-08-11 (ver `contracts/` abajo, D-054).

- `00_RAW_MIGRATION/` — depósito para el export real de Claude.ai cuando llegue (vacío hasta entonces, ver su `README.md`). Solo lectura para el proceso de migración, nunca se edita.
- `inventory/` — Fase 1: inventario de todo el material fuente + copias crudas sin modificar (`_raw-copies/`, ARCHIVE).
- `knowledge-base/` — capa KNOWLEDGE: conocimiento reconstruido (no resumido) por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/`. Dentro de `investment/`: `market-intelligence/` (costos de construcción, ventas, alquiler, Airbnb, comparables, zonas, fuentes — cross-cutting, reutilizable por cualquier proyecto, nunca contaminado con datos de un caso puntual), `methodologies/` (procesos reutilizables) y `assumptions/` (supuestos de modelo vigentes) — arquitectura del **Real Estate Intelligence OS**, ver `documentation/real-estate-os/`.
- `governance/decisions/` — capa GOVERNANCE: `DECISION_REGISTER.md` (CURRENT/HISTORICAL/DEPRECATED/UNRESOLVED/PROPOSED) y `REQUIREMENTS.md`. `governance/PRIORITY_PLAN.md` (2026-08-28) consolida y ordena por prioridad todo lo que sigue abierto en UNRESOLVED/PROPOSED — consultarlo antes de preguntar "¿qué falta?" o de elegir en qué seguir trabajando.
- `assets/` — logos fuente (`.svg`), brandbook (`.png`), manual de marca oficial (`.docx`), sitio de referencia (`.html`, archivado — no editar, la copia viva está en `production/app/frontend/`).
- `production/app/` — capa PRODUCTION: software funcional. Ver `production/app/README.md` para cómo correrlo.
- `contracts/` — capa CONTRACTS (agregada 2026-08-11, D-054): gestión operativa de casos contractuales inmobiliarios reales, uno por operación, en `contracts/cases/<CASO>/` (p. ej. `UON-001/`). Cada caso sigue el protocolo Meridiano Capital Real Estate Contract & Negotiation Intelligence — documento fuente → extracción → hechos verificados → conflictos → versionado de boleto (`contract-versions/CONTRACT_CHANGE_LOG.md`) → decisiones (`resolution/DECISION_HISTORY.md`) → revisión legal (`legal-review/`). Contiene PII real de clientes (cédula, domicilio, cifras de la operación) — **no tratar como `knowledge-base/` ni citar en piezas públicas de marca**; ver `governance/PII_POLICY.md` para la política exacta de qué dato puede vivir acá y cuál no. Ver el `README.md` de cada caso como índice.
- `core/`, `memory/`, `skills/`, `connectors/`, `workflows/`, `projects/` — resto de la arquitectura de 10 capas. Se van poblando durante el Implementation Roadmap (`documentation/MIGRATION_MASTER_REPORT.md`, Fase 12); `skills/` tiene `rentabilidad-calculator` (SK-03) + 3 skills del Real Estate Intelligence OS (`market-intelligence-lookup` SK-11, `construction-cost-engine` SK-12, `market-price-validation` SK-13) + `rental-amc-engine` (SK-14, D-085 — AMC de **alquiler**, primer módulo construido de `documentation/investment-sales-rental-market-engine/`; usar siempre antes de recomendarle a un inversor un alquiler de mercado, nunca fijarlo con un solo comparable suelto) + `project-unit-database` (SK-15, D-087 — Project/Unit/Parking Master Database, segundo módulo; consultar antes de armar cualquier ficha de inversión de una unidad, ya tiene datos reales de UON Calathea cargados en `knowledge-base/investment/projects/uon-calathea/`) + `geocoding-engine` (SK-16, D-088 — geocoding real de SS6/SS17: distancia real, tier de área de mercado, `location_status` de un proyecto; usar antes de fijar coordenadas o de asumir "cerca"/"lejos" en un AMC) + `target-yield-tools` (SK-17, D-090 — SS45-47: precio máximo de compra y alquiler requerido para un yield objetivo, siempre comparado contra el AMC real, nunca manipulando el mercado) + `investor-report-30` (SK-18, D-092 — ensambla el informe de inversor de 30 puntos de SS51 tirando de las 5 skills anteriores del Real Estate Intelligence OS, sin recalcular nada; usar siempre antes de armar a mano una ficha de inversión) + `meridiano-property-presentation-adapter` (SK-19, D-097 — adapta presentaciones y documentación **real** de cualquier propiedad al sistema institucional de Meridiano: PPTX editable + PDF + PNG de revisión + informe de validación; solo se activa con archivos adjuntos; usar siempre en vez de rearmar a mano un deck como se hizo con Puerto Fénix); `workflows/` tiene `rentabilidad-evaluation` (WF-02) + `nuevo-proyecto-inmobiliario` (WF-03, el punto de entrada para cualquier análisis inmobiliario nuevo — consultar antes de investigar mercado desde cero).
- `production/app/backend/dev_engine/` — **Development Cost & Financial Engine (D-079)**: motor parametrizable de jerarquía de costos, cash flow mensual, financiamiento y rentabilidad (ROI/TIR/VAN/sensibilidad/escenarios) para cualquier proyecto de desarrollo nuevo. Antes de armar a mano el costeo/cash flow/margen de un proyecto nuevo, usar este motor en vez de recalcular en Markdown — ver `production/app/backend/dev_engine/README.md`. Reutiliza `calculadora.py` y los Skills SK-11/12/13, nunca los duplica. Validado por reconstrucción completa de `HERRERA-001` (`documentation/development-financial-engine/01-reporte-final.md`).
- `documentation/investment-sales-rental-market-engine/` — **Investment Sales & Rental Market Engine v1.0 (D-084), especificación adoptada, todavía sin construir.** Motor de análisis de inversión por alquiler para consultas de compra unidad por unidad: AMC de alquiler con disciplina estricta (pool de 5-15 comparables → Top 3 con score → fuentes obligatorias C21/RE-MAX/InfoCasas → log de descartados → `AMC_STATUS`/`SOURCE_STATUS`, nunca fabricar datos), Project/Unit/Parking Database, herramientas inversas (precio máximo de compra para un yield objetivo; alquiler requerido vs. mercado, sin manipular el mercado para que "dé bien"), informe de inversor de 30 puntos. Principio rector: **"No vender rentabilidad. Calcular rentabilidad."** Antes de construir cualquier pieza de este motor o de repetir un análisis de rentabilidad de alquiler ad hoc, leer `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (incluye la tabla real de qué existe hoy y qué falta).
- `documentation/` — capa DOCUMENTATION: `MIGRATION_MASTER_REPORT.md` y demás referencia sobre el sistema mismo. (`README.md` y este `CLAUDE.md` quedan en la raíz por convención — GitHub y Claude Code los cargan desde ahí.)

## Cómo mantener este repo vigente

Cuando tomes o reemplaces una decisión de negocio/marca/producto durante el trabajo en este repo:
1. Agrégala a `governance/decisions/DECISION_REGISTER.md` con ID secuencial y estado correcto.
2. Si reemplaza una decisión CURRENT, mueve la anterior a HISTORICAL — nunca la borres.
3. Actualiza el archivo de `knowledge-base/` correspondiente para que quede como fuente de verdad vigente.
4. Nunca trates una cifra de `production/app/backend/calculadora.py` como definitiva si toca D-001 o D-002 sin haberlas resuelto primero.
