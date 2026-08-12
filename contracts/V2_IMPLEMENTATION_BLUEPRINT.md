# MERIDIANO CAPITAL
## V2 IMPLEMENTATION BLUEPRINT
### Real Estate Intelligence OS — Resolution & Transaction Engine

**Fecha:** 11/08/2026 · **Estado:** Blueprint para revisión — **no se modificó ningún componente crítico todavía**, por instrucción explícita del prompt maestro V2 (Sección 52).

> **Corrección de estatus registrada:** a partir de esta versión, UON-001 deja de tratarse como caso de prueba. Es el **Caso Fundador** — el expediente sobre el que se construye y valida el estándar operativo de Meridiano Capital. Esto cambia una decisión de diseño concreta (ver punto 6, Arquitectura V2): el modelo de datos y las plantillas que se diseñan acá no se descartan al cerrar UON-001, se promueven a `contracts/engine/` y `contracts/templates/` como el estándar para todo caso futuro.

---

## 1. QUÉ CONSTRUYÓ V1

Auditado directamente contra lo que existe hoy en disco (no de memoria):

| Artefacto | Ubicación | Qué es |
|---|---|---|
| Discovery Report | `cases/UON-001/UON-001_DISCOVERY_REPORT.md` | Inventario de 22 documentos, versionado del boleto, hechos verificados, 3 conflictos, riesgos |
| Contract Audit | `cases/UON-001/UON-001_CONTRACT_AUDIT.md` | Auditoría cláusula por cláusula del boleto vigente, 9 acciones requeridas |
| Case Facts | `cases/UON-001/evidence/CASE_FACTS.md` | 20 hechos (FACT-001 a 020) con fuente y nivel de evidencia — **formato informal**, sin campo de estado explícito |
| Decision History | `cases/UON-001/resolution/DECISION_HISTORY.md` | 3 decisiones registradas — **formato informal**, sin ID estandarizado ni estados PROPOSED/APPROVED |
| Contract Change Log | `cases/UON-001/contract-versions/CONTRACT_CHANGE_LOG.md` | 6 cambios de cláusula (CHG-01 a 06) — sin ID de Change Request separado de la entrada de log |
| Contract versions | `cases/UON-001/contract-versions/Boleto_v1/v2/v3.*` | v1 original, v2 vigente, v3 borrador con marcas de revisión — **sin estados formales (DRAFT/CURRENT/SUPERSEDED) ni marca de cuál es CURRENT** |
| Legal Review Requests | `cases/UON-001/legal-review/LEGAL_REVIEW_REQUESTS.md` | 7 puntos (LRR-01 a 07) listos para el escribano |
| Client Response | `cases/UON-001/client-response/*` | Carta al cliente (Nivel 1+2) + anexo interno Nivel 3 — incluye 2 compromisos pendientes registrados solo en texto libre |
| Source documents | `cases/UON-001/source-documents/` (22 archivos) | Expediente original, sin modificar |
| Extracted data | `cases/UON-001/extracted-data/*.txt` | Texto extraído de PDFs para análisis |
| Capa de repo | `CLAUDE.md`, `governance/decisions/DECISION_REGISTER.md` (D-054), `.gitignore` | `contracts/` documentada como 11ª capa del repo |

**Conclusión de V1:** el análisis y el contenido son sólidos y verificados (evidencia E1/E2 cruzada). Lo que falta no es "hacer mejor el análisis" — es **darle estructura de sistema** a lo que hoy son documentos narrativos independientes, cada uno con su propio formato ad hoc.

---

## 2. QUÉ FALTA (contra la especificación V2 completa)

| Componente del prompt maestro | Estado |
|---|---|
| Issue Engine (Sec. 5-8) con `ISSUE-ID` | ❌ No existe. Las 9 acciones del Contract Audit y los 7 LRR son, de hecho, Issues — pero no están modelados como tales (sin tipo, prioridad P0-P4, estado, responsable) |
| Fact Database con estados (Sec. 17) | 🟡 Parcial — existen los Facts, falta el campo `Estado` (VERIFIED/CONFLICTED/SUPERSEDED) |
| Conflict Database con estados (Sec. 18) | 🟡 Parcial — existen 3 conflictos narrados en el Discovery Report, sin `CONFLICT-ID` ni estado (OPEN/INVESTIGATING/RESOLVED) |
| Resolution Record (Sec. 9) | ❌ No existe como entidad separada de la Decision |
| Decision Log formal (Sec. 10) | 🟡 Parcial — existen 3 decisiones, sin estado PROPOSED/APPROVED/REJECTED/SUPERSEDED |
| Contract Version Control formal (Sec. 12) | 🟡 Parcial — existen las 3 versiones y el Change Log, sin estado por versión ni marca explícita de cuál es `CURRENT` |
| Change Request System (Sec. 14) | ❌ No existe — los cambios se registraron directo en el Change Log, no como CR-ID individuales con aprobación propia |
| Clause Diff Engine (Sec. 13) | 🟡 Se hizo una vez, manualmente (`diff` de texto v1↔v2) — no es un procedimiento repetible documentado |
| Contract Consistency Engine (Sec. 15) | 🟡 Se hizo una vez de forma puntual (ajuste de la referencia cruzada en la cláusula 7.1 al eliminar 1.3) — no es un chequeo sistemático de todo el contrato |
| Document Cross-Reference Engine (Sec. 16) | ❌ No existe como tabla explícita Documento→Página→Hecho→Issue→Decisión |
| Negotiation Engine / Negotiation Case (Sec. 19-20) | ❌ No existe — el punto de pago pendiente está descrito en prosa, no como caso de negociación estructurado |
| Commitment Register (Sec. 28) | ❌ No existe como registro — los 2 compromisos pendientes de la carta al cliente están solo en un párrafo del anexo interno |
| Action Register (Sec. 29) | ❌ No existe — las 9 acciones del audit y las 7 del legal review están en listas narrativas, no en un registro con estado OPEN/IN_PROGRESS/BLOCKED/DONE |
| Case Dashboard (Sec. 30) | ❌ No existe |
| Transaction Readiness Score (Sec. 34) | ❌ No existe |
| Closing Checklist formal (Sec. 35) | ❌ No existe como checklist con casillas — el equivalente más cercano es la sección "Acciones requeridas" del Contract Audit |
| Knowledge Engine — CASE_LEARNING vs GENERAL_KNOWLEDGE (Sec. 36-38) | ❌ No existe ninguna extracción todavía — es prematuro, UON-001 no cerró |
| Playbooks (Contract/Negotiation) | ❌ No existen — es el mismo motivo que el punto anterior |
| Arquitectura multi-caso `/engine /knowledge /playbooks /cases /templates /config` (Sec. 40) | ❌ Hoy `contracts/` solo tiene `cases/UON-001/` — no hay separación motor/caso |
| Commands (Sec. 46) | ❌ No existen como comandos formales — hoy todo se hace por instrucción en lenguaje natural |
| Audit Trail formal WHO/WHAT/WHEN/WHY/SOURCE/IMPACT/STATUS (Sec. 42) | 🟡 Parcial — los commits de git capturan WHO/WHAT/WHEN a nivel de archivo; el WHY vive en la prosa de cada documento, no en un campo estructurado consultable |
| Human Approval Gates formales (Sec. 11, 44) | 🟡 Se practicó el espíritu (pausé para pedir la decisión de arquitectura `contracts/` vs `projects/`, y para confirmar el tamaño del commit) pero no hay un registro `GATE-N: APPROVED/PENDING` explícito |

**Lectura honesta:** V1 generó el *contenido* correcto. V2 tiene que generarle *forma de sistema* a ese contenido — sin reescribir el trabajo de análisis, que ya está hecho y verificado.

---

## 3. QUÉ DEBE REUTILIZARSE (sin volver a analizar nada)

Ningún dato se re-verifica. Se **migra** de su formato narrativo actual a la entidad estructurada correspondiente:

| Contenido ya producido | Se convierte en |
|---|---|
| 20 filas de `CASE_FACTS.md` | 20 registros `FACT-001`…`FACT-020`, agregando el campo `Estado` (todas parten como `VERIFIED` salvo las marcadas "pendiente de confirmar", que pasan a `PARTIALLY_VERIFIED`) |
| 3 conflictos del Discovery Report (cocheras, calle transversal, nombre "Solar") | `CONFLICT-001`, `CONFLICT-002`, `CONFLICT-003` — estado `OPEN` los tres |
| 3 decisiones de `DECISION_HISTORY.md` | `DECISION-001`, `DECISION-002` (cláusulas 1.3/1.6, estado `APPROVED` — ya ejecutadas en v3) y una nueva `DECISION-003` para el punto de forma de pago (estado `PROPOSED`, sin decidir aún) |
| 6 filas de `CONTRACT_CHANGE_LOG.md` | 6 `CHANGE_REQUEST` (`CR-001`…`CR-006`), cada uno vinculado a la decisión que lo origina |
| v1/v2/v3 del boleto | 3 `CONTRACT_VERSION` — v1 `SUPERSEDED`, v2 `SUPERSEDED` (dejó de ser la vigente el día que se detectaron 1.3/1.6), v3 `DRAFT` (no `CURRENT` todavía — falta aprobación) |
| 9 acciones del Contract Audit + 7 LRR | 16 `ISSUE` — cada uno con tipo (Sec. 6), prioridad P0-P4 (Sec. 7) y estado |
| 2 compromisos del anexo interno del client-response | 2 `COMMITMENT` con fecha límite |
| Toda la evidencia documental (source-documents, extracted-data) | Sin cambios — es la fuente, no se toca |

---

## 4. QUÉ DEBE CORREGIRSE

1. **Ningún registro tiene campo de estado hoy.** Es la brecha más importante — sin estado, no se puede saber qué está realmente cerrado vs. qué solo tiene una respuesta preliminar (exactamente el riesgo que ya se materializó una vez con las cláusulas 1.3/1.6).
2. **`DECISION_HISTORY.md` no distingue decisión de propuesta.** El punto de forma de pago está descrito como si fuera un ítem más, cuando en realidad es una `PROPOSED` sin resolver — necesita vivir separado de las decisiones ya `APPROVED`.
3. **No hay una única fuente que diga "cuál versión del boleto es la vigente ahora mismo".** Hoy hay que leer el Change Log para inferirlo. Con v3 como borrador, técnicamente **no hay ninguna versión `CURRENT` aprobada** — v2 quedó inhabilitada para firma, v3 no está aprobada todavía. Esto debe quedar explícito, no inferido.
4. **Los compromisos con el cliente viven en un párrafo, no en un registro con fecha límite.** Si se acumulan más casos, esto se pierde.
5. **No hay separación motor/caso.** Si mañana aparece UON-002, hoy no hay dónde reutilizar el modelo de datos sin copiar y pegar desde UON-001 (y arrastrar sin querer datos personales de la parte compradora del caso).

---

## 5. MODELO DE DATOS PROPUESTO

Todo en Markdown con front-matter simple (tablas), no una base de datos real — consistente con el resto del repo, que ya usa este patrón (`DECISION_REGISTER.md`). Cada entidad es un archivo `.md` con una fila por registro, o un archivo por registro si el volumen lo justifica (a decidir en Step 2).

| Entidad | ID | Campos obligatorios | Estados |
|---|---|---|---|
| **Fact** | `FACT-NNN` | dato, valor, fuente, nivel de evidencia, fecha | `VERIFIED` · `PARTIALLY_VERIFIED` · `CONFLICTED` · `UNVERIFIED` · `SUPERSEDED` |
| **Conflict** | `CONFLICT-NNN` | dato, fuente A, fuente B, diferencia, impacto, acción requerida, responsable | `OPEN` · `INVESTIGATING` · `RESOLVED` · `ACCEPTED` · `SUPERSEDED` |
| **Issue** | `UON-ISSUE-NNN` | título, tipo (Sec. 6), origen, documentos/cláusulas relacionadas, prioridad P0-P4 con motivo, responsable | `OPEN` · `IN_ANALYSIS` · `RESOLUTION_PROPOSED` · `RESOLVED` · `CLOSED` |
| **Resolution Record** | `RES-NNN` | issue, evidencia, opciones, riesgos, recomendación, decisión, validación requerida | `DRAFT` · `PENDING_APPROVAL` · `APPROVED` · `EXECUTED` |
| **Decision** | `DECISION-NNN` | tema, opciones consideradas, decisión, motivo, quién decide, cláusula/documento afectado | `PROPOSED` · `UNDER_REVIEW` · `APPROVED` · `REJECTED` · `SUPERSEDED` |
| **Contract Version** | `CV-NNN` | versión, fecha, documento, cambios, origen, responsable, aprobación | `DRAFT` · `PROPOSED` · `UNDER_REVIEW` · `APPROVED` · `CURRENT` · `SUPERSEDED` · `ARCHIVED` |
| **Change Request** | `CR-NNN` | cláusula, versión origen, propuesta, motivo, solicitante, impacto (LOW/MEDIUM/HIGH/CRITICAL) | `PROPOSED` · `APPROVED` · `INCORPORATED` · `REJECTED` |
| **Negotiation Case** | `NEG-NNN` | posición/interés de cada parte, riesgo, concesión posible, contrapartida, línea roja | `OPEN` · `IN_NEGOTIATION` · `AGREED` · `CLOSED` |
| **Commitment** | `COMMIT-NNN` | origen, responsable, documento relacionado, fecha límite | `OPEN` · `FULFILLED` · `OVERDUE` · `CANCELLED` |
| **Action** | `ACTION-NNN` | descripción, responsable, prioridad, dependencia | `OPEN` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `CANCELLED` |

**Regla dura heredada de la Sección 42 (Audit Trail):** todo registro nuevo lleva WHO/WHEN/SOURCE. Si Claude no puede determinarlo con certeza, el campo dice literalmente `UNKNOWN` — nunca se completa por inferencia.

---

## 6. ARQUITECTURA V2

```
contracts/
  engine/              ← plantillas y lógica reutilizable (sin datos de ningún caso)
    schemas/           ← definición de cada entidad (Fact, Issue, Decision, etc.)
    procedures/         ← "cómo se hace un clause-diff", "cómo se arma un legal review pack", etc.
  knowledge/            ← GENERAL_KNOWLEDGE ya extraído de casos cerrados (vacío hasta que UON-001 cierre)
  playbooks/
    contract-playbook.md
    negotiation-playbook.md
  templates/             ← archivo en blanco de cada registro, listo para copiar a un caso nuevo
  cases/
    UON-001/             ← se queda exactamente donde está; se le agregan los registros nuevos (Sec. 15)
    _template/            ← copia vacía de la estructura de carpetas para UON-002, PROJECT-002, etc.
  config/                ← catálogo de tipos de Issue (Sec. 6), niveles de fuente, etc. — hoy fijos en prosa dentro del Discovery Report; se centralizan acá
```

**Nota de diseño (marcada para tu confirmación):** propongo anidar todo esto *dentro* de `contracts/`, no en la raíz del repo — para no crear una segunda `knowledge-base/` ni un segundo `playbooks/` que confundan con los que ya existen a nivel de todo el negocio (marca, inversión, etc.). `contracts/knowledge/` y `contracts/playbooks/` son específicos del dominio de contratos y transacciones inmobiliarias; no se mezclan con el conocimiento de marca/negocio del resto del repo. Si preferís otro criterio, lo ajusto antes del Step 2.

**Por qué no una base de datos real:** el repo entero ya funciona con el patrón "registro en Markdown + git como historial" (`DECISION_REGISTER.md`). Meter una base de datos (SQLite, etc.) para un volumen que hoy es un caso y mañana serán unos pocos rompe la Sección 51 (no crear complejidad innecesaria) sin necesidad real todavía. Si el volumen de casos crece mucho, se revisita — no antes.

---

## 7. FLUJO OPERATIVO (Sección 2, aplicado al estado real de UON-001 hoy)

```
DOCUMENTS ✅ (22 documentos inventariados)
  ↓
FACTS ✅ (20 hechos verificados)
  ↓
QUESTIONS ✅ (7 objeciones del comprador, Q-01 a Q-07)
  ↓
EVIDENCE ✅ (cruzada contra 6+ fuentes)
  ↓
CONFLICTS ✅ identificados (3) — ⚠️ ninguno resuelto todavía (todos quedarían OPEN)
  ↓
ANALYSIS ✅ (Contract Audit, cláusula por cláusula)
  ↓
DECISION 🟡 parcial — 2 decisiones aprobadas (1.3/1.6), 1 pendiente (forma de pago)
  ↓
ACTION 🟡 parcial — 9 + 7 acciones identificadas, ninguna con registro de seguimiento formal todavía
  ↓
CONTRACT CHANGE 🟡 parcial — incorporado en v3 (borrador), no aprobado como CURRENT
  ↓
VALIDATION ❌ no iniciada — LEGAL_REVIEW_REQUESTS.md está armado pero no consta que se haya enviado
  ↓
RESPONSE 🟡 parcial — carta a cliente redactada, no consta que se haya enviado
  ↓
CLOSURE ❌ muy lejos — quedan gates críticos abiertos
  ↓
LEARNING ❌ prematuro
```

**Esto en sí mismo ya es la primera utilidad del sistema V2:** hoy, sin dashboard, ya se puede ver que UON-001 está aproximadamente a mitad de camino — fuerte en discovery/análisis, débil en validación/cierre.

---

## 8. ESTRUCTURA DE CARPETAS (detalle dentro de `cases/UON-001/`)

Se agregan carpetas nuevas; **ninguna de las existentes se renombra ni se mueve**:

```
cases/UON-001/
  README.md                        (existente — se actualiza para linkear el dashboard)
  UON-001_DISCOVERY_REPORT.md       (existente, sin cambios)
  UON-001_CONTRACT_AUDIT.md         (existente, sin cambios)
  UON-001_CASE_DASHBOARD.md         ← NUEVO
  facts/FACT_REGISTER.md            ← NUEVO (migra evidence/CASE_FACTS.md)
  issues/ISSUE_REGISTER.md          ← NUEVO
  conflicts/CONFLICT_REGISTER.md    ← NUEVO
  resolution/DECISION_HISTORY.md    (existente — se le agrega campo Estado)
  resolution/RESOLUTION_RECORDS.md  ← NUEVO
  contract-versions/                (existente — se le agrega CONTRACT_VERSION_CONTROL.md)
  contract-versions/CHANGE_REQUESTS.md ← NUEVO
  negotiation/NEGOTIATION_CASES.md  ← NUEVO (carpeta ya existía, vacía)
  legal-review/                     (existente, sin cambios)
  client-response/                  (existente, sin cambios)
  commitments/COMMITMENT_REGISTER.md ← NUEVO
  actions/ACTION_REGISTER.md         ← NUEVO
  source-documents/, extracted-data/ (existente, sin cambios)
```

---

## 9. COMANDOS

Este entorno (Claude Code) no tiene una CLI de comandos propia del proyecto todavía. Dos caminos, a elegir:

- **A — Convención de lenguaje natural** (sin trabajo adicional): pedís "`/case-status UON-001`" o directamente "*dame el estado del caso UON-001*" y yo leo el Dashboard y respondo. Cero fricción, cero mantenimiento.
- **B — Slash commands reales de Claude Code**: crear `.claude/skills/` con un comando por cada uno de los 18 de la Sección 46. Más formal, pero es infraestructura nueva que hay que mantener.

**Recomendación:** empezar con A. Si el volumen de casos crece y la convención de lenguaje natural se siente lenta, migrar a B — no antes (mismo criterio de la Sección 51).

---

## 10. DEPENDENCIAS

Ninguna nueva. Todo lo usado en V1 alcanza: Python + PyMuPDF (lectura de PDFs), `docx` (npm) + LibreOffice (entregables Word), git (versionado y audit trail a nivel de archivo).

---

## 11. RIESGOS

| Riesgo | Mitigación propuesta |
|---|---|
| Los registros nuevos (Issue, Fact, etc.) se desactualizan si no se tocan en cada sesión | El Dashboard (Sec. 30) se recalcula leyendo los registros, no al revés — si un registro no se actualizó, el Dashboard lo muestra desactualizado, no oculta el problema |
| Sobre-burocratizar un caso que hoy maneja una sola persona (vos) | Mantener todo en Markdown simple, sin capas de aprobación que no correspondan al tamaño real del equipo — las Sección 44 (Human-in-the-loop) son puntos de pausa, no flujos de aprobación multi-persona |
| Filtrado de PII de UON-001 hacia `contracts/knowledge/` al extraer aprendizaje | Regla dura ya en la Sección 41: nunca trasladar nombres/documentos/cuentas a la capa general — se aplica recién en Step 16, y se audita explícitamente antes de escribir cualquier archivo de `knowledge/` |
| Este Blueprint es él mismo un documento más para mantener sincronizado | Se actualiza solo en los checkpoints de Step (Sección 50), no en cada sesión |

---

## 12. AUTOMATIZACIONES (sin aprobación humana previa)

Extracción de documentos · clasificación de tipo de Issue · comparación de versiones de contrato (clause diff) · generación de checklists · actualización de índices y del Dashboard · preparación (no envío) de respuestas al cliente · preparación (no envío) del Legal Review Pack.

## 13. HUMAN APPROVAL GATES (requieren tu aprobación explícita, nunca automáticas)

Decisiones comerciales críticas (ej. forma de pago) · cualquier cambio contractual que pase de `DRAFT` a `CURRENT` · aceptación de riesgo alto/crítico · cualquier compromiso nuevo con el cliente · respuesta final al cliente (enviar, no solo redactar) · validación legal (la hace el abogado, no Claude) · firma.

Mapeo a las 7 Gates de la Sección 11, estado actual de UON-001:

| Gate | Estado hoy |
|---|---|
| 1. Documentación | ✅ pasado |
| 2. Análisis | ✅ pasado |
| 3. Decisión comercial | 🟡 parcial (1.3/1.6 sí, forma de pago no) |
| 4. Cambio contractual | 🟡 parcial (incorporado en borrador v3, no aprobado como versión CURRENT) |
| 5. Validación legal | ❌ pendiente — LRR armado, no enviado |
| 6. Respuesta al cliente | 🟡 redactada, no enviada |
| 7. Firma | ❌ muy lejos |

---

## 14. ORDEN DE IMPLEMENTACIÓN (Sección 50, adaptado)

Step 1 (este documento) ya se ejecutó. Orden propuesto para lo que sigue, cada uno como una entrega separada con tu visto bueno antes de avanzar al siguiente (no todo de una sesión):

1. ~~Auditar V1~~ ✅ (este Blueprint)
2. Crear la estructura de carpetas de la Sección 8 (vacía, sin migrar datos todavía)
3. Migrar Facts → Fact Register
4. Migrar Conflicts → Conflict Register
5. Migrar Issues (9 del Audit + 7 del LRR) → Issue Register
6. Migrar Decisions → Decision Log con estados
7. Formalizar Contract Version Control (marcar v1/v2 `SUPERSEDED`, v3 `DRAFT`)
8. Migrar Change Log → Change Requests
9. Armar el primer Negotiation Case (forma de pago)
10. Armar Commitment Register (2 compromisos ya identificados)
11. Armar Action Register
12. Construir el Case Dashboard (lee todo lo anterior)
13. Calcular el Transaction Readiness (cualitativo, con justificación)
14. Cerrar la Closing Checklist (probablemente casi todo sin ✓ todavía — es correcto que así sea)
15. (Recién al cerrar el caso) Knowledge Engine + Playbooks

## 15. QUÉ SE APLICA INMEDIATAMENTE A UON-001

Todo el rango Step 2 a Step 14 — es exactamente lo que le da a UON-001 la trazabilidad que hoy le falta.

## 16. QUÉ QUEDA PREPARADO PARA FUTURAS OPERACIONES

`contracts/engine/`, `contracts/templates/`, `contracts/cases/_template/` y `contracts/config/` — vacíos de datos de UON-001, listos para que UON-002 (o el primer caso de otro proyecto) arranque copiando la plantilla en vez de reinventar el formato.

---

## Próximo paso

Este Blueprint no modificó ningún archivo existente. Si lo aprobás, arranco por el **Step 2** (crear la estructura de carpetas vacía) y voy avanzando Step por Step, mostrándote cada entrega antes de seguir — tal como pide la Sección 50 ("no implementar todo de golpe").

¿Confirmás el orden, y la nota de diseño del punto 6 (`contracts/knowledge/` y `contracts/playbooks/` separados de los `knowledge-base/`/`playbooks/` generales del repo)?
