# Catálogo — Change Request
Poblado en Step 8, a partir de `cases/UON-001/contract-versions/CHANGE_REQUESTS.md` (prompt maestro V2, Sección 14).

## Estados
| Estado | Significado |
|---|---|
| `PROPOSED` | Hay una redacción propuesta, incluso si ya está en el texto de una versión del contrato — pero sin confirmación de la contraparte o aprobación formal |
| `APPROVED` | Aprobado por quien corresponde, pendiente solo de que la versión del contrato que lo incorpora pase a `CURRENT` |
| `INCORPORATED` | El texto ya está en una versión del contrato, con aprobación de redacción de Meridiano/Vendedor — puede tener validación legal pendiente sin que eso cambie el estado (se nota aparte, en el campo "Validación legal") |
| `REJECTED` | Se propuso y se descartó explícitamente |

## Impacto
`LOW` · `MEDIUM` · `HIGH` · `CRITICAL` — evaluado sobre la operación, no sobre la dificultad de redactar el cambio.

## Regla dura
Un Change Request puede estar `INCORPORATED` en el texto sin estar aprobado como definitivo (ver CR-004 y CR-006 de UON-001) — **el estado del texto y el estado de la aprobación no son lo mismo.** Confundirlos es exactamente el error que ya se cometió una vez con las cláusulas 1.3/1.6.
