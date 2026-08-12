# UON-001 — Índice del caso
Proyecto UON Calathea · Departamento 201 + Cochera 10 · Meridiano Capital
**Caso Fundador** del Meridiano Capital Real Estate Intelligence OS — no es un caso de prueba, es la base del estándar operativo (ver `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`).

## Empezar por acá
👉 **`UON-001_CASE_DASHBOARD.md`** — estado del caso de un vistazo: issues abiertos, conflictos, riesgo general, ¿listo para firma?
👉 **`UON-001_TRANSACTION_READINESS.md`** — evaluación cualitativa por categoría (Documentation, Contract, Legal, Financial, Commercial, Delivery, Customer, Negotiation). Resultado general: `NOT READY`, con las 2 acciones puntuales que lo destraban.
👉 **`UON-001_CLOSING_CHECKLIST.md`** — 2 de 20 ítems marcados. No es un caso trabado, es un caso correctamente auditado: nada se marca sin evidencia que lo respalde.

## Estado actual: V2 Step 14 completo — **los 14 Steps del Blueprint original, terminados**

| Archivo/carpeta | Contenido |
|---|---|
| `UON-001_CASE_DASHBOARD.md` | Vista consolidada — leer primero |
| `UON-001_TRANSACTION_READINESS.md` | Evaluación de madurez por categoría — leer segundo |
| `UON-001_CLOSING_CHECKLIST.md` | 20 ítems de cierre, con la evidencia (o su ausencia) detrás de cada uno |
| `UON-001_DISCOVERY_REPORT.md` | Fase 0 (V1) — inventario documental original. Parcialmente superado por los registros de abajo |
| `UON-001_CONTRACT_AUDIT.md` | Fase 6 (V1) — auditoría cláusula por cláusula del Boleto vigente |
| `facts/FACT_REGISTER.md` | 22 Facts con `Estado` (`VERIFIED`/`PARTIALLY_VERIFIED`/etc.) — fuente vigente, reemplaza `evidence/CASE_FACTS.md` |
| `conflicts/CONFLICT_REGISTER.md` | 3 Conflicts, todos `OPEN` |
| `issues/ISSUE_REGISTER.md` | 13 Issues con tipo, prioridad P0-P4 y estado |
| `resolution/DECISION_LOG.md` | 3 Decisions con estado formal — fuente vigente, reemplaza `DECISION_HISTORY.md` |
| `contract-versions/CONTRACT_VERSION_CONTROL.md` | v1/v2 `SUPERSEDED`, v3 `DRAFT` — **ninguna versión es `CURRENT` hoy** |
| `contract-versions/CHANGE_REQUESTS.md` | 6 Change Requests con estado de aprobación propio — fuente vigente, reemplaza `CONTRACT_CHANGE_LOG.md` |
| `negotiation/NEGOTIATION_CASES.md` | `NEG-001` (cronograma de pago) — primer caso de negociación del sistema |
| `commitments/COMMITMENT_REGISTER.md` | 2 compromisos con el cliente — carta **no enviada todavía** |
| `actions/ACTION_REGISTER.md` | 11 acciones concretas, todas `OPEN` |
| `legal-review/LEGAL_REVIEW_REQUESTS.md` | 7 puntos para abogado/escribano — armado, **sin enviar** |
| `client-response/` | Carta al cliente (sin enviar) + anexo interno Nivel 3 (NUNCA se envía) |
| `source-documents/` | Los 22 documentos originales, sin modificar |
| `extracted-data/` | Texto extraído + renders de páginas escaneadas |
| `evidence/CASE_FACTS.md`, `resolution/DECISION_HISTORY.md`, `contract-versions/CONTRACT_CHANGE_LOG.md` | Versiones de V1, conservadas sin editar por trazabilidad — ver el aviso al tope de cada una |

## Próximos pasos
Los 14 Steps del `V2_IMPLEMENTATION_BLUEPRINT.md` están completos. Lo que sigue no es más andamiaje del sistema — es **avanzar las 11 acciones reales** de `actions/ACTION_REGISTER.md` para que el caso deje de estar `NOT READY`. Las 5 de prioridad Alta:
1. `ACTION-001` — aprobar v3 (o una v4) como `CURRENT`
2. `ACTION-002` — decidir el cronograma de pago (Gate 3, ver `negotiation/NEGOTIATION_CASES.md`)
3. `ACTION-003` — decidir el destino del fondo de reserva
4. `ACTION-004` — enviar el Legal Review Pack al abogado/escribano
5. `ACTION-009` — decidir si enviar la carta al cliente ahora o esperar los 2 documentos pendientes

Recién cuando el caso llegue a `CLOSED` corresponde el **Step 15** (Knowledge Engine + Playbooks, Sección 36-38 del prompt maestro V2) — extraer lo reutilizable de UON-001 sin trasladar ningún dato identificatorio a `contracts/knowledge/` ni `contracts/playbooks/`.

## Antes de cualquiera de esos steps, 5 acciones de prioridad alta ya identificadas
Ver `actions/ACTION_REGISTER.md` — ACTION-001 (aprobar v3/v4 como `CURRENT`), ACTION-002 (decisión de cronograma de pago), ACTION-003 (fondo de reserva), ACTION-004 (enviar Legal Review Pack), ACTION-009 (decidir si enviar la carta al cliente ahora o esperar).
