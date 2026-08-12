# Catálogo — Conflict
Poblado en Step 4, a partir de `cases/UON-001/conflicts/CONFLICT_REGISTER.md` (prompt maestro V2, Sección 18).

## Estados de Conflict
| Estado | Significado |
|---|---|
| `OPEN` | Detectado, sin acción de resolución iniciada |
| `INVESTIGATING` | Se envió la consulta a la parte que puede resolverlo (arquitecto, vendedor, municipalidad), respuesta pendiente |
| `RESOLVED` | La fuente correcta quedó confirmada por una acción externa (nunca por elección arbitraria de Claude) |
| `ACCEPTED` | Se documenta la discrepancia pero se decide convivir con ella (bajo riesgo, no vale la pena perseguirla) |
| `SUPERSEDED` | El conflicto quedó sin objeto por un cambio posterior (ej. una nueva versión de documento que unifica el dato) |

**Regla dura:** el estado nunca pasa a `RESOLVED` porque Claude decidió cuál fuente creer — solo cuando la parte responsable (Sección "Responsable" del registro) confirma el dato correcto.
