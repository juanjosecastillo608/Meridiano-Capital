# UON-001 — CHANGE REQUESTS
Migrado desde `CONTRACT_CHANGE_LOG.md` (6 filas → 6 Change Requests individuales), Step 8 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`, formato de la Sección 14 del prompt maestro V2. `CONTRACT_CHANGE_LOG.md` se conserva sin editar (regla de no-destrucción), pero queda superado como fuente de consulta — mantener dos archivos con estado propio para el mismo cambio es exactamente el tipo de deriva que este sistema existe para evitar.

**Regla dura (Sección 14):** ningún cambio se incorpora directamente al contrato sin quedar registrado acá primero.

**Estados:** `PROPOSED` · `APPROVED` · `INCORPORATED` (el texto ya está en una versión del boleto) · `REJECTED`. **Un CR puede estar `INCORPORATED` en el texto sin estar `APPROVED` como definitivo** — es exactamente el caso de CR-004 y CR-006 abajo, y es la razón por la que ninguna versión del boleto es `CURRENT` todavía (ver `CONTRACT_VERSION_CONTROL.md`).

---

## CR-001
**Cláusula:** 1.3 (reserva del vendedor de modificar el reglamento de copropiedad a 5 años)
**Versión origen:** v1
**Propuesta:** Eliminar la cláusula completa.
**Motivo:** condición de venta en pozo, no aplica al edificio terminado.
**Solicitante:** Comprador (objeción Q-03) → aceptado por el Vendedor
**Impacto:** `LOW` (se elimina un derecho que el vendedor no pensaba ejercer)
**Riesgo:** alto si no se incorpora a tiempo — ya generó `UON-ISSUE-001` (P0) al descubrirse que seguía en v2 pese a estar acordada
**Contraparte:** Comprador — ya fue informada de la eliminación (carta `client-response/`)
**Estado:** `APPROVED`
**Aprobación:** Vendedor, confirmado por Juan José Castillo, 11/08/2026 → `DECISION-001`
**Validación legal:** pendiente confirmar la redacción final (`LRR-03`)
**Versión donde se incorporó:** v3 (`DRAFT`) — texto ejecutado, ninguna versión `CURRENT` todavía

---

## CR-002
**Cláusula:** 1.6 (unión de unidades / variación del número total)
**Versión origen:** v1
**Propuesta:** Eliminar la cláusula completa.
**Motivo:** misma razón que CR-001 — venta en pozo, no aplica al edificio terminado.
**Solicitante:** Comprador (objeción Q-04) → aceptado por el Vendedor
**Impacto:** `LOW`
**Riesgo:** mismo patrón que CR-001, agrupado en `UON-ISSUE-001`
**Contraparte:** Comprador — informada
**Estado:** `APPROVED`
**Aprobación:** Vendedor, confirmado 11/08/2026 → `DECISION-002`
**Validación legal:** pendiente (`LRR-03`)
**Versión donde se incorporó:** v3 (`DRAFT`)

---

## CR-003
**Cláusula:** 1.1 (objeto)
**Versión origen:** v1 (sin % de copropiedad; "cochera" sin especificar)
**Propuesta:** agregar 4,64% de copropiedad del depto., y de la cochera: área propia de terreno 18,70 m², 0,40% de copropiedad, especificar **"cochera descubierta"**.
**Motivo:** responder objeciones Q-01/Q-01B (superficie y copropiedad).
**Solicitante:** Comprador
**Impacto:** `MEDIUM` — aclara una característica material de la cochera (descubierta) que antes no constaba explícitamente
**Riesgo:** bajo — dato ya verificado contra la Planilla de Copropiedad (`FACT-001` a `004`)
**Contraparte:** Comprador
**Estado:** `INCORPORATED`
**Aprobación:** Meridiano/Vendedor
**Validación legal:** no requerida
**Versión donde se incorporó:** v2 — se mantiene sin cambios en v3

---

## CR-004
**Cláusula:** 2.1.2 / 2.1.3 (forma de pago)
**Versión origen:** v1 (40% a la firma + 60% antes del 2/09)
**Propuesta:** sustituir por seña USD 2.000 + USD 55.000 (5 días hábiles) + USD 55.000 (primeros 10 días de septiembre)
**Motivo:** responder a la negociación de pago iniciada por el comprador
**Solicitante:** Comprador (parcialmente — ver observación)
**Impacto:** `HIGH` — condición central de la operación
**Riesgo:** alto — **el texto ya incorporado no coincide exactamente con la contrapropuesta escrita del comprador** (pedía 50% final contra escritura, no 100% antes) — ver `UON-ISSUE-003`
**Contraparte:** Comprador — sin confirmar
**Estado:** `PROPOSED` — **aunque el texto ya está en v2/v3, no se considera `APPROVED` como definitivo** porque no hay confirmación del comprador de que acepta este esquema exacto. Coherente con `DECISION-003` (`UNDER_REVIEW`).
**Aprobación:** pendiente
**Validación legal:** no es un tema legal, es comercial (Gate 3)
**Versión donde se incorporó (texto, sujeto a revisión):** v2, v3

---

## CR-005
**Cláusula:** 8 (recepción de la unidad)
**Versión origen:** v1 (condicional — definía "habitabilidad" verificable)
**Propuesta:** reemplazar por declaración de hecho: "la unidad... se encuentra terminada y habitable, como el total del edificio"
**Motivo:** responder objeciones Q-02/Q-02A (¿está terminado el edificio?)
**Solicitante:** Comprador (indirectamente, vía la pregunta)
**Impacto:** `MEDIUM` — cambia la naturaleza jurídica de la cláusula, de condición verificable a declaración
**Riesgo:** medio — sin respaldo técnico anexo que sostenga la declaración (`UON-ISSUE-010`)
**Contraparte:** Comprador
**Estado:** `INCORPORATED`
**Aprobación:** Meridiano/Vendedor
**Validación legal:** pendiente (`LRR-04`)
**Versión donde se incorporó:** v2 — se mantiene en v3

---

## CR-006
**Cláusula:** 10.1 (escritura pública)
**Versión origen:** v1 (solo 90 días hábiles desde notificación, condicionado a habitabilidad)
**Propuesta:** mantener los 90 días + agregar plazo alternativo de 5 meses desde la protocolización del reglamento de copropiedad; quitar la condición de habitabilidad (redundante tras CR-005)
**Motivo:** responder objeción Q-05 (plazo de escritura)
**Solicitante:** Comprador
**Impacto:** `HIGH` — plazo crítico de la operación
**Riesgo:** alto — **quedó ambigüedad sobre cuál de los dos plazos prevalece** (`UON-ISSUE-005`)
**Contraparte:** Comprador
**Estado:** `INCORPORATED` — texto en v2/v3, **pero con un defecto de redacción sin resolver**, no equivalente a estar `APPROVED` sin reservas
**Aprobación:** Meridiano/Vendedor (redacción), pendiente validación de fondo
**Validación legal:** pendiente (`LRR-02`)
**Versión donde se incorporó:** v2 — se mantiene en v3

---

## Resumen por estado
| Estado | Change Requests |
|---|---|
| `APPROVED` | CR-001, CR-002 |
| `INCORPORATED` | CR-003, CR-005, CR-006 |
| `PROPOSED` | CR-004 |
| `REJECTED` | — |

**Lectura del conjunto:** de los 6 cambios entre v1 y v2, **solo CR-003 está limpio** (incorporado, sin pendiente legal ni comercial). Los otros 5 tienen algo abierto — es la misma conclusión a la que ya había llegado `UON-001_CONTRACT_AUDIT.md` por otro camino, ahora visible en un formato que se puede filtrar por estado.
