# Catálogo — Issue
Poblado en Step 5, a partir de `cases/UON-001/issues/ISSUE_REGISTER.md` (prompt maestro V2, Secciones 5-8).

## Tipos de Issue (Sección 6) — usados hasta ahora en negrita
SURFACE · **PAYMENT** · DELIVERY (**usado**) · POSSESSION (**usado**) · TITLE (**usado**) · OWNERSHIP · CADASTRAL · **PROPERTY_HORIZONTAL** · COCHERA · COMMON_AREAS · **REGULATION** · CONSTRUCTION · SPECIFICATIONS · MUNICIPAL · ENVIRONMENTAL · TAX · DEED · **DEADLINE** · **PENALTY** · RESCISSION · WARRANTY · **REPRESENTATION** · **DOCUMENTATION** · COMMERCIAL · NEGOTIATION · **OTHER**

Ampliable — el sistema puede crear tipos nuevos cuando un Issue no encaje en ninguno de los existentes (Sección 6, última línea del prompt maestro).

## Prioridad (Sección 7) — nunca asignar sin justificar el motivo en el registro
| Prioridad | Significado | Criterio usado en UON-001 |
|---|---|---|
| `P0` | BLOQUEANTE | No puede circular ningún documento para firma mientras esté abierto |
| `P1` | CRÍTICO | Afecta una condición central de la operación (precio, pago, plazos) o requiere validación legal antes de avanzar |
| `P2` | IMPORTANTE | Debe resolverse antes de cerrar, pero no bloquea el trabajo en paralelo sobre otros Issues |
| `P3` | MENOR | (sin uso todavía en UON-001) |
| `P4` | INFORMATIVO | Ya resuelto o de solo registro — se documenta para no volver a plantearlo por desconocimiento |

## Estados de Issue
`OPEN` · `IN_ANALYSIS` · `RESOLUTION_PROPOSED` (hay una propuesta de solución, ej. incorporada en un borrador de contrato, pero no aprobada como versión firmable) · `RESOLVED` · `CLOSED`
