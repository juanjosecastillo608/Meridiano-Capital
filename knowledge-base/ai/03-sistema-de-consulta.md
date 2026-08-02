Estado: CURRENT
Fuente original: meridiano-capital-identity/SKILL.md (Modulo 17 — Sistema de Consulta)
Dominio: AI

# Sistema de Consulta (Modulo 17)

Ante cualquiera de estas consultas (u otras equivalentes), el agente de IA debe **recuperar automaticamente los archivos relevantes antes de responder** — no responder de memoria ni improvisar, incluso si el agente "recuerda" el contenido de una sesion anterior.

## Tabla de enrutamiento (rutas reescritas a la nueva estructura `knowledge-base/`)

| Consulta tipo | Modulos originales | Archivos a consultar en `knowledge-base/` |
|---|---|---|
| "Necesito crear una presentacion para inversores" | 01, 02, 10, 15 | `brand/01-adn-de-marca.md`, `brand/02-identidad-verbal.md`, `marketing/02-presentaciones.md`, `ai/05-matriz-de-decision.md` |
| "Necesito crear una landing page" | 01, 02, 03, 04, 05, 09 | `brand/01-adn-de-marca.md`, `brand/02-identidad-verbal.md`, `brand/03-identidad-visual.md`, `brand/04-tipografia.md`, `brand/05-sistema-cromatico.md`, `marketing/01-aplicacion-digital.md` |
| "Voy a diseñar un post de Instagram" | 02, 03, 05, 11 | `brand/02-identidad-verbal.md`, `brand/03-identidad-visual.md`, `brand/05-sistema-cromatico.md`, `marketing/03-redes-sociales.md` |
| "Voy a crear un brochure para un proyecto inmobiliario" | 02, 10, 13 | `brand/02-identidad-verbal.md`, `marketing/02-presentaciones.md`, `marketing/05-proyectos-inmobiliarios.md` |
| "Necesito un prompt para generar imagenes" | 07, 08, 14 | `brand/07-direccion-de-arte.md`, `brand/08-sistema-de-imagen.md`, `ai/06-prompt-engine.md` |
| "Voy a diseñar una campaña publicitaria" | 01, 02, 03, 05, 12 | `brand/01-adn-de-marca.md`, `brand/02-identidad-verbal.md`, `brand/03-identidad-visual.md`, `brand/05-sistema-cromatico.md`, `marketing/04-publicidad.md` |
| "Necesito crear una presentacion en Canva" | 04, 05, 10 | `brand/04-tipografia.md`, `brand/05-sistema-cromatico.md`, `marketing/02-presentaciones.md` |
| "¿Que tipografia debo utilizar?" | 04 | `brand/04-tipografia.md` |
| "¿Que colores debo utilizar?" | 05 | `brand/05-sistema-cromatico.md` |
| "¿Que version del logo corresponde?" | 03 | `brand/03-identidad-visual.md` |
| "¿Esta pieza respeta la identidad de marca?" | 15 (Matriz de Decision) + Modulo 19 (Brand Guardian) | `ai/05-matriz-de-decision.md` + `ai/04-director-creativo-y-brand-guardian.md` (seccion Brand Guardian) |

## Regla de enrutamiento por defecto

Si la consulta no calza exactamente en esta tabla, el agente debe:

1. Identificar de que dominio se trata (verbal, visual, digital, canal especifico, o comportamiento del propio agente).
2. Consultar el archivo correspondiente segun el indice de dominios:
   - Fundamentos de identidad (ADN, verbal, visual, tipografia, color, sistema grafico, direccion de arte, sistema de imagen) → `knowledge-base/brand/`
   - Aplicacion por canal (digital/web/UX, presentaciones, redes sociales, publicidad, proyectos inmobiliarios) → `knowledge-base/marketing/`
   - Comportamiento y gobernanza del propio agente de IA (prioridad, protocolo de regla no definida, roles, auditoria, matriz de decision, prompt engine) → `knowledge-base/ai/`
3. Consultar ese archivo **antes** de responder o producir la pieza, no despues.

## Nota sobre el estado de la migracion

Al momento de escribir este archivo, `knowledge-base/brand/` y `knowledge-base/marketing/` existen como carpetas pero aun no contienen los archivos individuales listados en la tabla de arriba (la migracion de esos dominios es una fase posterior, separada de esta migracion del dominio AI). Los nombres de archivo usados en la tabla (`brand/01-adn-de-marca.md`, `marketing/02-presentaciones.md`, etc.) son la **estructura destino propuesta**, consistente con la numeracion y nombres de los modulos originales en `inventory/_raw-copies/meridiano-capital-identity/references/`. Hasta que esa migracion ocurra, el contenido equivalente sigue disponible en:

- `inventory/_raw-copies/meridiano-capital-identity/references/01-adn-de-marca.md` … `references/13-proyectos-inmobiliarios.md`
- `inventory/_raw-copies/meridiano-capital-identity/references/16-cierres-y-firmas.md`
- `inventory/_raw-copies/meridiano-capital-identity/references/urbannit-y-arquitectura.md`

> UNRESOLVED: confirmar la asignacion definitiva de dominio para el Modulo 09 (Aplicacion Digital — web, UX/UI, apps) — aqui se propone `marketing/01-aplicacion-digital.md`, pero podria justificarse un dominio `digital/` o `technology/` separado dependiendo de como se organice el resto del knowledge-base. Igual criterio aplica a la ubicacion final de `16-cierres-y-firmas.md` y `urbannit-y-arquitectura.md`, no asignados explicitamente por el Modulo 17 original.
