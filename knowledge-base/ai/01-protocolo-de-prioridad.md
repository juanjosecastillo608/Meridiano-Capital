Estado: CURRENT
Fuente original: meridiano-capital-identity/SKILL.md (Modulo 16 — Regla de Prioridad)
Dominio: AI

# Protocolo de Prioridad (Modulo 16 — Regla de Prioridad)

Cuando existan contradicciones entre fuentes o entre reglas, resolver siempre en este orden:

1. **Manual de Marca oficial** (`Meridiano_Capital_Brand_Guidelines_v1.docx`)
2. **Sistema de identidad visual** (logo, tipografia, sistema cromatico)
3. **Sistema de identidad verbal**
4. **Estrategia y posicionamiento**
5. **Reglas especificas de cada canal** (digital, presentaciones, redes sociales, publicidad, proyectos inmobiliarios)
6. **Recomendaciones creativas** ([EXTENSION] en cualquier modulo)

**Una recomendacion creativa nunca puede contradecir una regla oficial.** Si una idea creativa entra en conflicto con una regla de nivel 1-4, la idea se ajusta o se descarta — no la regla.

## Correspondencia con la nueva estructura del repositorio

La jerarquia original se referia a "Modulos 03, 04, 05" (identidad visual), "Modulo 02" (identidad verbal), "Modulo 01" (estrategia y posicionamiento) y "Modulos 09-13" (reglas especificas de canal). En la nueva estructura de `knowledge-base/`, estos niveles corresponden a:

1. Manual de Marca oficial — `inventory/_raw-copies/meridiano-capital-identity/assets/Meridiano_Capital_Brand_Guidelines_v1.docx` (fuente de autoridad primaria, no reemplazada por ningun archivo de `knowledge-base/`)
2. Identidad visual — `knowledge-base/brand/` (identidad visual: logo, tipografia, sistema cromatico)
3. Identidad verbal — `knowledge-base/brand/` (identidad verbal)
4. Estrategia y posicionamiento — `knowledge-base/brand/` (ADN de marca)
5. Reglas especificas de canal — `knowledge-base/marketing/` (digital, presentaciones, redes sociales, publicidad, proyectos inmobiliarios)
6. Recomendaciones creativas [EXTENSION] — cualquier seccion marcada como `[EXTENSION]` en cualquier archivo de `knowledge-base/brand/`, `knowledge-base/marketing/` o `knowledge-base/ai/`

> UNRESOLVED: `knowledge-base/brand/` y `knowledge-base/marketing/` aun no contienen los archivos migrados individuales (carpetas vacias al momento de esta migracion del dominio AI). Cuando se migren, este archivo deberia actualizarse para apuntar a los nombres de archivo definitivos dentro de esas carpetas.

## Regla de aplicacion

Este orden de prioridad es vinculante para cualquier agente de IA que produzca, audite o corrija una pieza de marca. Ante cualquier conflicto detectado — entre dos secciones del manual, entre una regla de canal y una regla visual, entre una idea creativa propuesta y una regla oficial — el agente debe resolver subiendo por esta lista hasta encontrar la fuente de mayor prioridad aplicable, y explicar brevemente por que se eligio esa resolucion cuando el conflicto no sea trivial.
