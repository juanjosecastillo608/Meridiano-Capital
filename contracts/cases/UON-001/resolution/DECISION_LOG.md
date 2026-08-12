# UON-001 — DECISION LOG
Migrado desde `DECISION_HISTORY.md` (Step 6 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`), con el formato completo del prompt maestro V2 (Sección 10) y estados formales. Mismo contenido — no se re-decide nada, solo se reestructura.

`DECISION_HISTORY.md` se conserva sin editar (regla de no-destrucción) — este registro es, desde ahora, la fuente de consulta vigente. **Regla dura repetida a propósito:** una Decisión NO es lo mismo que una Propuesta — DECISION-003 lo ilustra en este mismo caso.

**Estados:** `PROPOSED` · `UNDER_REVIEW` · `APPROVED` · `REJECTED` · `SUPERSEDED`.

---

## DECISION-001
**Caso:** UON-001 · **Fecha:** anterior al 11/08/2026 (fecha exacta de la conversación original con el vendedor: `UNKNOWN` — no consta en el expediente, solo su confirmación posterior)
**Tema:** Eliminación de la reserva del vendedor para modificar el reglamento de copropiedad y administración dentro de los 5 años posteriores a la escritura.
**Problema:** la Cláusula 1.3 del boleto es una condición típica de venta "en pozo" (obra no terminada); el comprador la objetó (`docx`, Q-03) porque el edificio ya está terminado.
**Opciones consideradas:** (a) mantener la cláusula sin cambios; (b) eliminarla por completo; (c) reescribirla acotando su alcance solo a ajustes normativos obligatorios. Se optó por (b).
**Decisión tomada:** Eliminar la Cláusula 1.3 del boleto.
**Motivo:** era una condición propia de una venta en pozo; no aplica a la situación actual del edificio, ya terminado.
**Quién decide:** el vendedor (ADESA E.A.S.), confirmado directamente por Juan José Castillo (founder de Meridiano Capital) el 11/08/2026: *"ya se acordó con el vendedor sacar esas cláusulas del boleto"*.
**Documentos afectados:** Boleto (v1 → v2 → v3)
**Cláusula afectada:** 1.3
**Impacto:** bajo en el fondo (se elimina un derecho que el vendedor no pensaba ejercer sobre un edificio terminado) — el impacto real estuvo en el **retraso de su ejecución**, que generó `UON-ISSUE-001` (P0, porque la cláusula seguía en el boleto que se le iba a mandar a firmar al comprador pese a esta decisión ya tomada)
**Pendientes:** que `Boleto_v3_DRAFT` pase de `DRAFT` a `CURRENT` (Contract Version Control, Step 7)
**Estado:** `APPROVED`

---

## DECISION-002
**Caso:** UON-001 · **Fecha:** misma que DECISION-001 (mismo origen: respuesta del vendedor a la objeción Q-04 del `docx`)
**Tema:** Eliminación de la posibilidad de unir unidades / variar el número total de unidades del proyecto.
**Problema:** la Cláusula 1.6 es otra condición de venta en pozo, objetada por el comprador (`docx`, Q-04: "¿podrían afectar áreas comunes, cantidad de unidades...?").
**Opciones consideradas:** mismas tres que DECISION-001, aplicadas a esta cláusula. Se optó por eliminarla.
**Decisión tomada:** Eliminar la Cláusula 1.6 del boleto.
**Motivo:** misma razón que DECISION-001 — condición de venta en pozo, no aplica al edificio terminado.
**Quién decide:** el vendedor, confirmado por Juan José Castillo, 11/08/2026.
**Documentos afectados:** Boleto (v1 → v2 → v3)
**Cláusula afectada:** 1.6
**Impacto:** mismo perfil que DECISION-001 — generó `UON-ISSUE-001` (agrupado junto con 1.3, mismo Issue por ser el mismo patrón de error)
**Pendientes:** mismo que DECISION-001
**Estado:** `APPROVED`

---

## DECISION-003
**Caso:** UON-001 · **Fecha:** propuesta del comprador sin fecha exacta registrada (`UNKNOWN`) — recibida antes del cierre del `docx` de objeciones; en revisión activa desde el 11/08/2026 (carta al cliente, `client-response/`)
**Tema:** Cronograma final de pago del saldo del precio.
**Problema:** el boleto vigente exige el saldo pagado 100% antes del 10/09/2026 (semanas antes de que pueda haber escritura). El comprador propuso (`docx`, Q-07): seña USD 2.000 + cesión de derechos firmada, 50% del saldo a los 5 días, **50% restante contra la escritura**. El campo de respuesta del vendedor a esta propuesta específica quedó vacío en el `docx`.
**Opciones consideradas:**
  1. Mantener el cronograma actual del boleto (saldo 100% antes de escritura) — favorece el flujo de caja del vendedor, no refleja lo que pidió el comprador.
  2. Aceptar la propuesta del comprador tal cual (50% final contra escritura) — alinea el riesgo del comprador con el momento de la transferencia de dominio, reduce el flujo de caja anticipado del vendedor.
  3. Punto intermedio (ej. un porcentaje menor retenido hasta la escritura, no el 50%).
  Ninguna de las tres fue seleccionada todavía.
**Decisión tomada:** **Ninguna.** Sigue siendo una propuesta, no una decisión — no confundir con lo que aparece redactado en el boleto vigente, que no fue confirmado como aceptado por el comprador.
**Motivo:** —
**Quién decide:** pendiente — requiere decisión comercial de Meridiano/ADESA (Gate 3) y confirmación del comprador.
**Documentos afectados:** Boleto, Cláusula 2.1.2/2.1.3 (si se decide un cambio)
**Cláusula afectada:** 2.1.2 / 2.1.3
**Impacto:** alto — condición de pago central de la operación (ver `UON-ISSUE-003`, `P1`)
**Pendientes:** decisión comercial de Meridiano; confirmación del comprador; reflejar el resultado en una nueva versión del boleto (Change Request nuevo, Step 8)
**Estado:** `UNDER_REVIEW` — carta al cliente (11/08/2026) ya avisó que "estamos terminando de definir el cronograma de pago"

---

## Resumen por estado
| Estado | Decisiones |
|---|---|
| `APPROVED` | 001, 002 |
| `UNDER_REVIEW` | 003 |

**Instrucción para el futuro (heredada de `DECISION_HISTORY.md`):** no reabrir la discusión sobre si las cláusulas 1.3/1.6 deben eliminarse — ya está `APPROVED` y ejecutado en el borrador v3. No asumir que el cronograma de pago del boleto actual fue aceptado por el comprador solo porque aparece redactado así — DECISION-003 sigue `UNDER_REVIEW`.
