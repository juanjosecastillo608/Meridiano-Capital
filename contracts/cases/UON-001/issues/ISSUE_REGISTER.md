# UON-001 — ISSUE REGISTER
Migrado desde `UON-001_CONTRACT_AUDIT.md` (9 acciones) y `legal-review/LEGAL_REVIEW_REQUESTS.md` (7 puntos) — Step 5 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`. Sin re-analizar: 3 pares de ítems cubrían el mismo tema en ambos documentos y se fusionaron en un único Issue (nota en cada uno). 9 + 7 − 3 = **13 Issues**.

Catálogo de tipos y prioridades: ver `contracts/config/issue-catalog.md`.

---

## UON-ISSUE-001 — Cláusulas 1.3 y 1.6 pendientes de incorporar a una versión firmable
**Tipo:** REGULATION · **Origen:** Contract Audit acción #1 + LRR-03 (mismo tema, fusionado) · **Planteado por:** detectado por Meridiano al auditar el boleto vigente
**Documentos/cláusulas relacionadas:** Boleto v1/v2 (cláusulas 1.3, 1.6), Boleto v3 borrador
**Hechos relacionados:** — · **Conflictos relacionados:** —
**Riesgo:** si se firma la v2 vigente sin corregir, el comprador firma un documento que contradice lo que ya se le comunicó por escrito (docx de objeciones)
**Prioridad:** `P0 — BLOQUEANTE`. Motivo: no puede circular ningún boleto para firma mientras estas cláusulas sigan presentes — ya se comprometió su eliminación al comprador.
**Responsable:** Meridiano Capital (redacción) + Vendedor (aprobación)
**Acción:** ✅ ya ejecutada en `Boleto_v3_DRAFT_2026-08-11.docx` (tachadas, con nota a `DECISION-001`/`002`)
**Decisión vinculada:** `resolution/DECISION_HISTORY.md` — Decisiones 001 y 002 (`APPROVED`)
**Estado:** `RESOLUTION_PROPOSED` — ejecutado en borrador, falta que v3 pase a `CURRENT` (Gate 4)
**Fecha:** 11/08/2026

---

## UON-ISSUE-002 — Cláusula 6.3 vacía (defecto de forma)
**Tipo:** OTHER · **Origen:** Contract Audit acción #2 · **Planteado por:** detectado por Meridiano al auditar el boleto vigente
**Documentos/cláusulas relacionadas:** Boleto v2, Cláusula Sexta (6.3 numerada sin contenido)
**Riesgo:** bajo, pero un número de cláusula huérfano en un documento para firma es un defecto de presentación que un comprador atento puede notar
**Prioridad:** `P0 — BLOQUEANTE` (defecto de forma). Motivo: mismo criterio que UON-ISSUE-001 — no debería circular un boleto con un error de formato evidente.
**Responsable:** Meridiano Capital (redacción)
**Acción:** ✅ ya ejecutada en `Boleto_v3_DRAFT_2026-08-11.docx` (6.3 vacía eliminada, 6.4→6.3 renumerada)
**Estado:** `RESOLUTION_PROPOSED` — mismo gate pendiente que UON-ISSUE-001
**Fecha:** 11/08/2026

---

## UON-ISSUE-003 — Cronograma de pago sin confirmación del comprador
**Tipo:** PAYMENT · **Origen:** Contract Audit acción #3 · **Planteado por:** Meridiano, al comparar el boleto vigente contra la contrapropuesta del comprador
**Documentos/cláusulas relacionadas:** Boleto Cláusula 2.1.2/2.1.3; `docx` de objeciones (Q-07, sin respuesta escrita)
**Riesgo:** el boleto exige saldo 100% antes del 10/09/2026, mientras la escritura puede demorar meses — el comprador propuso 50% final contra escritura y nunca se le confirmó si eso se acepta
**Prioridad:** `P1 — CRÍTICO`. Motivo: es una condición de pago central de la operación, no un detalle — sin resolver, no se puede avanzar a Gate 3 (decisión comercial)
**Responsable:** Meridiano Capital (equipo comercial)
**Acción:** confirmar con el comprador y con Meridiano cuál cronograma rige; carta al cliente (`client-response/`) ya avisó que esto se está terminando de definir
**Estado:** `OPEN`
**Fecha:** 11/08/2026 → pasa a `negotiation/` en el Step 9 (es, de hecho, el primer Negotiation Case del sistema)

---

## UON-ISSUE-004 — "Fondo de reserva" (0,5%) sin confirmar ni comunicar
**Tipo:** PAYMENT · **Origen:** Contract Audit acción #4 · **Planteado por:** Meridiano, al auditar la Cláusula 7.3
**Documentos/cláusulas relacionadas:** Boleto Cláusula 7.3
**Riesgo:** cargo nuevo (~USD 560) que no aparece en el `docx` de objeciones ni en material comercial — comunicarlo tarde podría leerse como una sorpresa de último momento
**Prioridad:** `P1 — CRÍTICO`. Motivo: afecta directamente el monto final que paga el comprador; se decidió explícitamente NO incluirlo en la carta al cliente hasta confirmarlo internamente (ver `client-response/INTERNO_no_enviar_Nivel3_argumentacion.md`)
**Responsable:** Meridiano Capital (decisión comercial)
**Acción:** decidir si se mantiene, se elimina o se comunica, y en qué momento
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-005 — Cláusula 10.1: dos plazos de escritura sin jerarquía clara
**Tipo:** DEADLINE · **Origen:** Contract Audit acción #5 + LRR-02 (mismo tema, fusionado) · **Planteado por:** Meridiano, al auditar la Cláusula 10.1
**Documentos/cláusulas relacionadas:** Boleto Cláusula 10.1 (90 días hábiles desde notificación / 5 meses desde protocolización del reglamento de copropiedad)
**Riesgo:** disputa futura sobre incumplimiento de plazos de escritura si no queda claro cuál rige
**Prioridad:** `P1 — CRÍTICO` (🟣 Legal — bloquea Gate 5). Motivo: es una pregunta jurídica concreta, no una decisión que Meridiano pueda tomar sola
**Responsable:** Abogado/escribano interviniente
**Acción:** enviado como LRR-02 en `legal-review/LEGAL_REVIEW_REQUESTS.md`
**Estado:** `OPEN` — a la espera de respuesta del profesional jurídico
**Fecha:** 11/08/2026

---

## UON-ISSUE-006 — Asimetría entre Cláusula 3 (mora) y Cláusula 5.5 (rescisión)
**Tipo:** PENALTY · **Origen:** Contract Audit acción #6 + LRR-01 (mismo tema, fusionado) · **Planteado por:** Meridiano, al auditar las Cláusulas 3 y 5
**Documentos/cláusulas relacionadas:** Boleto Cláusulas 3.1 y 5.5
**Riesgo:** ante mora del comprador pierde el 100% de lo pagado sin intimación previa; ante incumplimiento del vendedor, el comprador solo recupera lo pagado (sin intereses) en hasta 120 días — objeción esperable del comprador o su abogado, eventual nulidad parcial si se judicializa
**Prioridad:** `P1 — CRÍTICO` (🟣 Legal — bloquea Gate 5)
**Responsable:** Abogado/escribano interviniente
**Acción:** enviado como LRR-01
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-007 — Anexo I (plano de unidad, memoria descriptiva, plano de cocheras) sin verificar
**Tipo:** DOCUMENTATION · **Origen:** Contract Audit acción #7 · **Planteado por:** Meridiano, al auditar la Cláusula 1.2
**Documentos/cláusulas relacionadas:** Boleto Cláusula 1.2 ("se adjunta como Anexo aI... debidamente suscriptos por las Partes")
**Riesgo:** la cláusula referencia un documento que no se confirmó que exista firmado en el expediente
**Prioridad:** `P2 — IMPORTANTE`. Motivo: es un requisito documental previo a la firma, pero no bloquea el resto del análisis mientras se resuelve
**Responsable:** Meridiano Capital (verificación) → Vendedor (si falta, debe producirlo)
**Acción:** confirmar existencia y firma del Anexo I antes de que el boleto circule para firma
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-008 — Fecha "septiembre" de la Cláusula 6.4 (antes 6.3) sin confirmar
**Tipo:** DELIVERY · **Origen:** Contract Audit acción #8 · **Planteado por:** Meridiano, al auditar la Cláusula Sexta
**Documentos/cláusulas relacionadas:** Boleto Cláusula 6.4/6.3 ("a partir del mes de septiembre será responsabilidad del COMPRADOR...")
**Riesgo:** posible resabio de plantilla o de otra negociación del edificio, no específicamente calculado para esta operación (firmada el 11/08/2026)
**Prioridad:** `P2 — IMPORTANTE`
**Responsable:** Meridiano Capital
**Acción:** confirmar que la fecha es correcta para esta unidad puntual
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-009 — Sentido de la "cesión de derechos" mencionada por el comprador
**Tipo:** OTHER · **Origen:** Contract Audit acción #9 · **Planteado por:** el comprador, en su contrapropuesta de pago (`docx`, Q-07)
**Documentos/cláusulas relacionadas:** Boleto Cláusula 12.1 (prohíbe cesión salvo autorización previa por escrito)
**Riesgo:** el comprador mencionó una "cesión de derechos debidamente firmada" sin que quede claro a qué se refiere — no asumir que ya está cubierta por 12.1 sin preguntar
**Prioridad:** `P2 — IMPORTANTE`
**Responsable:** Meridiano Capital (aclarar con el comprador)
**Acción:** preguntar directamente qué cesión tenía en mente
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-010 — Cláusula 8: habitabilidad declarada como hecho, sin respaldo técnico anexo
**Tipo:** POSSESSION · **Origen:** LRR-04 (no estaba en el resumen de 9 acciones del Contract Audit — se detectó en el análisis cláusula por cláusula pero no llegó a la tabla resumen; se corrige acá)
**Documentos/cláusulas relacionadas:** Boleto Cláusula 8
**Riesgo:** si la unidad presentara defectos de terminación al momento de la posesión, la declaración contractual de "terminada y habitable" sin respaldo técnico expone al vendedor
**Prioridad:** `P2 — IMPORTANTE` (🟣 Legal, pero de menor urgencia que UON-ISSUE-005/006 — es una sugerencia de refuerzo, no una ambigüedad activa)
**Responsable:** Abogado/escribano interviniente
**Acción:** enviado como LRR-04
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-011 — Alcance del Poder N°29 (APODERADO-VENDEDOR-A, ver FACT-009)
**Tipo:** REPRESENTATION · **Origen:** LRR-05
**Documentos/cláusulas relacionadas:** Poder N°29, Boleto (representación del vendedor)
**Hechos relacionados:** FACT-009, FACT-009B (`VERIFIED`)
**Riesgo:** ninguno — se registra este Issue ya **cerrado** para que no se vuelva a plantear la misma pregunta en una sesión futura por desconocimiento
**Prioridad:** `P4 — INFORMATIVO`
**Responsable:** —
**Acción:** ninguna — verificado en Fase 1
**Estado:** `CLOSED` — resuelto, ver FACT-009B
**Fecha:** 11/08/2026

---

## UON-ISSUE-012 — Rol de Juan José Castillo como "vendedor" en el preámbulo del Boleto
**Tipo:** REPRESENTATION · **Origen:** LRR-06 (originado en `UON-001_DISCOVERY_REPORT.md`, Sección 12, no en el Contract Audit)
**Documentos/cláusulas relacionadas:** Boleto, preámbulo ("interviene en esta operación como vendedor Juan José Castillo RUC 9289273-6")
**Riesgo:** atribución de responsabilidad contractual de "vendedor" no querida, si en realidad actúa como corredor/intermediario de Meridiano
**Prioridad:** `P1 — CRÍTICO` (🟣 Legal — expone a JJC/Meridiano a una responsabilidad no intencional)
**Responsable:** Abogado/escribano interviniente
**Acción:** enviado como LRR-06
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## UON-ISSUE-013 — Certificado de Dominio y Gravámenes desactualizado (2023)
**Tipo:** TITLE · **Origen:** LRR-07
**Documentos/cláusulas relacionadas:** Escritura N°4, página 3
**Hechos relacionados:** FACT-015 (`PARTIALLY_VERIFIED`)
**Riesgo:** bajo — no hay ningún indicio de gravamen nuevo, pero han pasado ~3 años desde el certificado disponible
**Prioridad:** `P2 — IMPORTANTE`
**Responsable:** Abogado/escribano interviniente
**Acción:** enviado como LRR-07
**Estado:** `OPEN`
**Fecha:** 11/08/2026

---

## Resumen por estado
| Estado | Issues |
|---|---|
| `OPEN` | 003, 004, 005, 006, 007, 008, 009, 010, 012, 013 (10) |
| `RESOLUTION_PROPOSED` | 001, 002 (2) |
| `CLOSED` | 011 (1) |

## Resumen por prioridad
| Prioridad | Issues |
|---|---|
| P0 — Bloqueante | 001, 002 |
| P1 — Crítico | 003, 004, 005, 006, 012 |
| P2 — Importante | 007, 008, 009, 010, 013 |
| P4 — Informativo | 011 |
