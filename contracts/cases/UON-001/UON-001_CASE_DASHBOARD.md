# UON-001 — CASE DASHBOARD
Step 12 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`, formato de la Sección 30 del prompt maestro V2. **No agrega información nueva** — lee y organiza lo que ya está en los 8 registros de `cases/UON-001/`. Si algo de acá no coincide con el registro fuente, el registro fuente manda; este dashboard se regenera, no se edita a mano.

**Última actualización:** 11/08/2026, tras Step 11.

---

## CASO
**UON-001** — UON Calathea, Departamento 201 + Cochera 10. **Caso Fundador** del Meridiano Capital Real Estate Intelligence OS (V2) — no es un caso de prueba descartable, es la base del estándar operativo.

## ESTADO
`RESOLUTION_IN_PROGRESS` (Sección 4: DISCOVERY → DOCUMENTED → UNDER_ANALYSIS → ISSUES_IDENTIFIED → **RESOLUTION_IN_PROGRESS** → NEGOTIATION → CONTRACT_REVISION → LEGAL_REVIEW → READY_FOR_SIGNATURE → SIGNED → CLOSED → KNOWLEDGE_EXTRACTED)

- Negociación: **iniciada** (`NEG-001`), no como estado exclusivo todavía — falta Gate 3.
- Revisión legal: **preparada, no lanzada** (`legal-review/LEGAL_REVIEW_REQUESTS.md` armado, `ACTION-004` para enviarlo sigue `OPEN`).
- El estado no avanza a `NEGOTIATION` ni a `LEGAL_REVIEW` como fase propia hasta que esas dos acciones se completen — regla dura de la Sección 4: ninguna transición es automática.

## ISSUES
| Estado | Cantidad | IDs |
|---|---|---|
| `OPEN` | 10 | 003, 004, 005, 006, 007, 008, 009, 010, 012, 013 |
| `RESOLUTION_PROPOSED` | 2 | 001, 002 (ejecutados en v3, falta aprobación formal) |
| `CLOSED` | 1 | 011 |
| **Total** | **13** | — |

Por prioridad: `P0` 0 abiertos (001/002 ya resueltos en el texto) · `P1` 5 abiertos (003, 004, 005, 006, 012) · `P2` 5 abiertos (007, 008, 009, 010, 013) · `P4` 1 cerrado (011).

## CONFLICTOS
3, **todos `OPEN`**: `CONFLICT-001` (cantidad de cocheras del edificio), `CONFLICT-002` (calle transversal), `CONFLICT-003` (nombre "Solar" vs. "UON Calathea"). Ninguno bloquea directamente la unidad 201/cochera 10 — ver `conflicts/CONFLICT_REGISTER.md` para el detalle de impacto de cada uno.

## DOCUMENTOS FALTANTES
- Certificado de licencia ambiental como archivo independiente (`COMMITMENT-001`, `FACT-018` `PARTIALLY_VERIFIED`)
- Plano técnico municipal sellado de la unidad + cochera (`COMMITMENT-002`)
- Anexo I (plano de unidad, memoria descriptiva, plano de cocheras) sin confirmar que exista firmado (`UON-ISSUE-007`)
- Certificado de dominio y gravámenes actualizado a 2026 (hoy solo hay uno de 2023, `FACT-015`)

## CAMBIOS CONTRACTUALES
6 Change Requests (`contract-versions/CHANGE_REQUESTS.md`): `APPROVED` 2 (CR-001, CR-002) · `INCORPORATED` 3 (CR-003, CR-005, CR-006 — dos de estos con validación legal pendiente) · `PROPOSED` 1 (CR-004, forma de pago) · `REJECTED` 0.

## VALIDACIONES LEGALES
7 puntos en `legal-review/LEGAL_REVIEW_REQUESTS.md`: 1 `RESUELTO` (LRR-05, poder) · 6 **sin enviar al abogado todavía** (LRR-01, 02, 03, 04, 06, 07) — `ACTION-004` es el paso que los desbloquea a todos.

## DECISIONES PENDIENTES
1 — `DECISION-003` (cronograma de pago final), `UNDER_REVIEW`. Las otras 2 decisiones del caso (`DECISION-001`, `002`) ya están `APPROVED`.

## ACCIONES PENDIENTES
11, **todas `OPEN`**, ninguna `IN_PROGRESS` todavía (`actions/ACTION_REGISTER.md`). Las 5 de prioridad Alta: aprobar v3/v4 como `CURRENT` (001), decidir cronograma de pago (002), decidir el fondo de reserva (003), enviar el Legal Review Pack (004), decidir si enviar la carta al cliente ahora o esperar (009).

## RIESGO GENERAL
Evaluación cualitativa, no un score numérico (Sección 26 del prompt maestro V1, sigue vigente):

| Categoría | Nivel | Por qué |
|---|---|---|
| Legal | 🟠 Medio-Alto | 6 puntos sin enviar al abogado; incluye la asimetría de la Cláusula 3/5.5 y el rol de JJC en el preámbulo |
| Documental | 🟡 Medio | 4 documentos faltantes, ninguno bloqueante por sí solo |
| Económico | 🟡 Medio | precio total no está en discusión (`FACT-011`), pero el cronograma de pago sigue sin acuerdo |
| Contractual | 🟠 Medio-Alto | ninguna versión del boleto es `CURRENT` — no hay, hoy, ningún documento apto para firma |
| Comercial | 🟢 Bajo-Medio | 7 de las 8 objeciones originales del comprador ya tienen respuesta sustantiva; el punto abierto (pago) ya tiene un Negotiation Case armado |
| Operativo | 🟢 Bajo | expediente completo, trazabilidad alta, sin cuellos de botella de información |
| Reputacional | 🟡 Medio | la carta al cliente generaría 2 compromisos con fecha ambigua si se envía sin resolver antes los documentos faltantes (`ACTION-009`) |

**Lectura general:** el caso no está trabado — tiene 11 acciones concretas y ninguna depende de información que falte reunir desde cero. El riesgo está concentrado en que **nada pasó todavía por un Gate formal** (3, 4, 5 o 6), no en que falte análisis.

## READY FOR SIGNATURE
**NO.**
- No existe ninguna versión `CURRENT` del boleto (`CONTRACT_VERSION_CONTROL.md`).
- `DECISION-003` sigue `UNDER_REVIEW`.
- El Legal Review Pack no fue enviado.
- 2 compromisos con el cliente siguen sin documento que los respalde.

Ver `UON-001_CONTRACT_AUDIT.md`, sección "Resumen de acciones requeridas antes de la firma", para el detalle original de por qué — este Dashboard es la versión estructurada de esa misma conclusión.
