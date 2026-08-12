# Catálogo — Decision
Poblado en Step 6, a partir de `cases/UON-001/resolution/DECISION_LOG.md` (prompt maestro V2, Sección 10).

## Estados
| Estado | Significado |
|---|---|
| `PROPOSED` | Una parte puso una opción sobre la mesa — todavía no es una decisión |
| `UNDER_REVIEW` | Se está evaluando activamente (Meridiano y/o la contraparte) |
| `APPROVED` | Decisión tomada por quien tiene autoridad para tomarla — pasa a `resolution/DECISION_LOG.md` como vigente |
| `REJECTED` | Se consideró y se descartó explícitamente (se conserva, no se borra) |
| `SUPERSEDED` | Una decisión posterior la reemplaza — se conserva la fila vieja con el link a la nueva |

**Regla dura (Sección 10 del prompt maestro V2):** una Decisión NO es lo mismo que una Propuesta. Nunca registrar algo como `APPROVED` solo porque aparece redactado en un documento (ej. un boleto) — eso es, en el mejor de los casos, `PROPOSED`, hasta que quede una fuente explícita de quién decidió y cuándo.
