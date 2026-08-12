# UON-001 — COMMITMENT REGISTER
Migrado desde `client-response/INTERNO_no_enviar_Nivel3_argumentacion.md` (Step 10 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`), formato de la Sección 28 del prompt maestro V2.

**Nota honesta que corrige una imprecisión del documento de origen:** el anexo interno decía *"la carta enviada al cliente"* — pero, verificado contra el `UON-001_CASE_DASHBOARD` (Step 12, en preparación) y el propio flujo del caso, **no consta que la carta se haya enviado realmente a COMPRADORA-A (ver FACT-010)**, solo que se redactó y se entregó a Meridiano para su revisión (Gate 6, Sección 11, sigue pendiente). Los dos compromisos de abajo quedan registrados igual — son compromisos reales una vez que la carta salga — pero la "Fecha límite" se calcula **desde el envío**, no desde la redacción, porque hoy esa fecha de envío es `UNKNOWN`.

**Estados:** `OPEN` · `FULFILLED` · `OVERDUE` · `CANCELLED`.

---

## COMMITMENT-001 — Constancia de la licencia ambiental
**Origen:** `client-response/UON-001_Respuesta_Cliente_2026-08-11.docx`, punto 6 del índice de documentación ("Licencia ambiental — Aprobada. Te acercamos la constancia en los próximos días")
**Fecha del compromiso (redacción):** 11/08/2026
**Responsable:** Meridiano Capital
**Documento relacionado:** `FACT-018` (`PARTIALLY_VERIFIED`) — no se generó un Issue dedicado en el Step 5 porque en ese momento este compromiso concreto con el cliente todavía no existía; queda la referencia cruzada acá para no perderla
**Fecha límite:** "en los próximos días" desde el **envío real** de la carta — sin fecha exacta porque el envío mismo todavía no está confirmado (`UNKNOWN`)
**Estado:** `OPEN` — y **no puede pasar a `FULFILLED` sin que primero se confirme que la carta salió**, porque hasta entonces el compromiso no es exigible frente al cliente, solo una intención interna

---

## COMMITMENT-002 — Copia del plano técnico municipal (Depto. 201 + Cochera 10)
**Origen:** `client-response/UON-001_Respuesta_Cliente_2026-08-11.docx`, punto 10 del índice de documentación ("Entregado el plano de distribución de la unidad — te acercamos también la copia del plano técnico municipal")
**Fecha del compromiso (redacción):** 11/08/2026
**Responsable:** Meridiano Capital
**Documento relacionado:** hoy solo existe el render comercial (`PHOTO-2026-08-10-13-18-45.jpg`) — no hay plano técnico sellado específico de la unidad en el expediente
**Fecha límite:** mismo criterio que COMMITMENT-001 — "en los próximos días" desde el envío real, hoy `UNKNOWN`
**Estado:** `OPEN`

---

## Regla de cierre de ambos compromisos
Ninguno de los dos puede marcarse `FULFILLED` sin que exista, en `source-documents/` o `extracted-data/`, el archivo concreto que lo satisface (el certificado de licencia ambiental como documento independiente; el plano técnico municipal sellado). No alcanza con la referencia notarial indirecta que ya existe (`FACT-018`) — eso fue lo que motivó el compromiso, no lo que lo cierra.

## Acción recomendada antes de enviar la carta (si todavía no salió)
Confirmar con el vendedor/ADESA si estos dos documentos pueden conseguirse antes del envío — evitaría generar un compromiso con fecha límite ambigua desde el principio. Si se decide enviar la carta igual sin ellos, este registro ya deja la trazabilidad necesaria para no perder el seguimiento.
