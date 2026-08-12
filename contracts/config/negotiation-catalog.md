# Catálogo — Negotiation Case
Poblado en Step 9, a partir de `cases/UON-001/negotiation/NEGOTIATION_CASES.md` (prompt maestro V2, Secciones 19-22).

## Estados
`OPEN` (identificado, análisis armado, sin propuesta cruzada a la contraparte) · `IN_NEGOTIATION` (ya se cruzó una propuesta) · `AGREED` (ambas partes aceptaron) · `CLOSED` (incorporado a una Decision y a un Change Request)

## Reglas duras
1. **No ceder sin contrapartida** (Sección 20) — toda concesión propuesta debe venir acompañada de qué se pide a cambio. La contrapartida no tiene que ser monetaria: puede ser plazo, documentación, firma, condición, renuncia, claridad o compromiso.
2. **Separar objeción expresada de interés real** (Sección 21) — no responder solo a la frase textual del cliente, resolver la preocupación de fondo.
3. **El campo "Mensaje recomendado" es la única parte de un Negotiation Case pensada para salir del documento** — nunca compartir línea roja, margen ni estrategia con ninguna de las partes.
4. Un Negotiation Case **no decide** — prepara la decisión. La decisión formal vive en `resolution/DECISION_LOG.md`, y requiere Gate 3 (Sección 44, Human-in-the-loop).
