# contracts/knowledge/

GENERAL_KNOWLEDGE del dominio de contratos y transacciones inmobiliarias (Blueprint, Sección 36-38 y punto 6 de la nota de diseño — separado de `knowledge-base/` de la raíz del repo, que es conocimiento de marca/negocio/inversión).

**Regla dura (Sección 41 del Blueprint):** nunca trasladar acá nombres, documentos personales, cuentas, cifras de una operación puntual ni cualquier dato identificatorio de un cliente. Solo el patrón, nunca el caso.

Ejemplo de lo que sí va acá: *"Cuando la superficie publicada en material comercial difiere de la superficie del boleto, verificar siempre contra la Planilla de Copropiedad aprobada antes de responder al comprador — no asumir cuál de las dos cifras es la correcta."*
Ejemplo de lo que NUNCA va acá: cualquier dato de UON-001 tal cual aparece en `cases/UON-001/`.

**Estado:** vacío. Se puebla recién cuando UON-001 (o cualquier caso) llegue a `CLOSED` y pase por el Knowledge Engine (Step 15 del Blueprint) — no antes, para no extraer aprendizaje de un caso todavía en movimiento.
