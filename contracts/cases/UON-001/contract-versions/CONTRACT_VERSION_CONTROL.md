# UON-001 — CONTRACT VERSION CONTROL
Formaliza lo que ya documentaban las "Notas de versionado" de `CONTRACT_CHANGE_LOG.md` (Step 7 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`), con el formato de la Sección 12 del prompt maestro V2 y hash SHA-256 real de cada archivo (primer registro del sistema que usa el campo hash).

**Regla dura:** debe existir siempre una única versión `CURRENT` — o ninguna, si ninguna versión está aprobada para firma. **Hoy no hay ninguna `CURRENT`.** No inferir que la "vigente" anterior (v2) sigue sirviendo solo porque es la más reciente aprobada alguna vez — quedó inhabilitada el mismo día que se detectaron las cláusulas 1.3/1.6 sin eliminar.

---

## CV-001
**Versión:** v1 (ORIGINAL) · **Fecha:** 10/08/2026 13:03 (metadato de creación del PDF)
**Documento:** `Boleto_v1_ORIGINAL_2026-08-10.pdf`
**Hash SHA-256:** `7e9ebc2d150ba03a…` (completo en el archivo, primeros 16 caracteres acá por brevedad)
**Cambios respecto de la versión anterior:** desconocido — es la primera versión disponible en el expediente. No se descarta que haya existido una versión previa no incluida (el `docx` de objeciones menciona "muebles" ya resuelto, tema que no aparece en ninguna cláusula de v1).
**Origen:** provisto por el vendedor/ADESA como parte del expediente inicial
**Responsable:** `UNKNOWN` — no consta en el expediente quién la redactó
**Aprobación:** ninguna registrada
**Observaciones:** contiene las cláusulas 1.3 y 1.6 sin eliminar (mismo defecto que v2 — ver DECISION-001/002)
**Estado:** `SUPERSEDED`

---

## CV-002
**Versión:** v2 (antes descripta como "VIGENTE") · **Fecha:** 11/08/2026 17:40 (metadato de creación del PDF)
**Documento:** `Boleto_v2_VIGENTE_2026-08-11.pdf`
**Hash SHA-256:** `ccd0a9a04d7dd42b…`
**Cambios respecto de v1:** CHG-03 (objeto: agrega % de copropiedad, "cochera descubierta"), CHG-04 (forma de pago), CHG-05 (recepción de la unidad, cláusula 8), CHG-06 (plazo de escritura, cláusula 10.1) — detalle completo en `CONTRACT_CHANGE_LOG.md`
**Origen:** redacción de Meridiano/ADESA en respuesta a la negociación con el comprador
**Responsable:** `UNKNOWN` — no consta el redactor específico
**Aprobación:** ninguna aprobación formal registrada — circuló como "vigente" de hecho, sin que mediara un Gate 4 explícito
**Observaciones:** **no debe usarse para la firma.** Sigue conteniendo las cláusulas 1.3 y 1.6 que ya se le había prometido al comprador eliminar (UON-ISSUE-001, P0) y la cláusula 6.3 vacía (UON-ISSUE-002, P0)
**Estado:** `SUPERSEDED` — dejó de ser válida para firma el 11/08/2026, el mismo día en que se detectó el defecto, no en una fecha posterior

---

## CV-003
**Versión:** v3 (BORRADOR con marcas de revisión) · **Fecha:** 11/08/2026 (generado)
**Documento:** `Boleto_v3_DRAFT_2026-08-11.docx` / `.pdf`
**Hash SHA-256 (.docx):** `63437f9602cbe8f7…`
**Cambios respecto de v2:** ejecuta DECISION-001 y DECISION-002 (elimina 1.3 y 1.6, tachadas con nota de la decisión), elimina la cláusula 6.3 vacía y renumera, propone un ajuste a la referencia cruzada de la cláusula 7.1. Deja marcados en recuadro amarillo, **sin resolver**, los 7 puntos que corresponden a UON-ISSUE-003, 004, 005, 006, 007, 008, 009, 012, 013 (cronograma de pago, fondo de reserva, plazo de escritura, asimetría de mora, Anexo I, fecha de septiembre, cesión de derechos, rol de JJC, certificado de dominio) — ver tabla "Resumen de cambios v2→v3" al final del propio documento.
**Origen:** Contract Audit (Fase 6) + Decisiones 001/002 ya aprobadas
**Responsable:** Meridiano Capital
**Aprobación:** ninguna — es explícitamente un documento de trabajo para revisión, no para firma
**Observaciones:** tampoco apto para firma. Es la base sobre la que se envió `legal-review/LEGAL_REVIEW_REQUESTS.md` al abogado/escribano
**Estado:** `DRAFT`

---

## Estado general de versionado
| Versión | Estado | ¿Apta para firma? |
|---|---|---|
| v1 | `SUPERSEDED` | No |
| v2 | `SUPERSEDED` | No |
| v3 | `DRAFT` | No |
| **CURRENT** | **ninguna** | — |

**Para que v3 (o una v4 derivada de ella) pueda pasar a `CURRENT`:** deben cerrarse los Issues `P0` (ya resueltos en el propio texto de v3, falta la aprobación formal) y avanzar sustancialmente los `P1` (Gate 3 comercial + Gate 5 legal) — ver `issues/ISSUE_REGISTER.md`. Este es exactamente el Gate 4 de la Sección 11 del prompt maestro V2, y hoy está `PENDING`.
