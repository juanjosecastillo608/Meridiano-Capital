```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-capital-identity/SKILL.md (contexto general) + references/09-12
Dominio: MARKETING
```

# Marketing — Overview

Este directorio (`knowledge-base/marketing/`) contiene el conocimiento de ejecucion de canal para Meridiano Capital: como la marca se aplica en digital/web, presentaciones, redes sociales y publicidad. Es una migracion 1:1 en contenido (no un resumen) de los Modulos 09-12 del Brand Operating System original ("meridiano-capital-identity" Skill de Claude), reorganizados para vivir como base de conocimiento permanente fuera de esa skill.

## Regla de dependencia: MARKETING nunca contradice BRAND

Este dominio es **subordinado** al dominio `knowledge-base/brand/` (identidad de marca: ADN, identidad verbal, identidad visual/logo, tipografia, sistema cromatico, sistema grafico, direccion de arte, sistema de imagen). La skill de origen define un orden de prioridad explicito (Modulo 16 — Regla de Prioridad) que este dominio hereda tal cual:

1. Manual de Marca oficial (fuente de autoridad maxima)
2. Sistema de identidad visual (tipografia, color, logo)
3. Sistema de identidad verbal (tono, mensajes)
4. Estrategia y posicionamiento (ADN de marca)
5. **Reglas especificas de cada canal (este dominio: web, presentaciones, redes, publicidad)**
6. Recomendaciones creativas puntuales ([EXTENSION] en cualquier documento)

Consecuencias practicas para quien use este dominio:
- Ninguna regla de aqui (dimensiones de banner, formato de post, estructura de deck, etc.) puede introducir un color, tipografia, tono de voz o uso de logo que no este ya definido en `knowledge-base/brand/`. Si un archivo de marketing menciona un color o fuente, es referencia a lo ya definido en brand — nunca una fuente nueva de verdad.
- Cuando una pieza de marketing exige una decision que el dominio brand no cubre explicitamente, la resolucion correcta es la misma que en el sistema original: identificarlo como **[EXTENSION]**, proponer una solucion coherente con los principios de marca, y jamas presentarla como regla oficial cerrada.
- Si en el futuro una regla de canal (marketing) entra en conflicto con una regla de identidad (brand), la regla de identidad gana siempre. La pieza o campaña se ajusta; el sistema de marca no se dobla para acomodar una campaña.

## Relacion con el dominio TECHNOLOGY

El Modulo 09 (Aplicacion Digital) en particular impone requisitos que technology debe resolver, no solo diseño:
- El sitio actual es HTML/CSS/JS sin build process, deliberadamente simple para portabilidad — cualquier migracion a un framework (React/Next.js, CMS) debe preservar las variables de diseño (custom properties CSS) como design tokens, sin reescritura conceptual de la logica de componentes.
- El formulario de contacto del sitio valida en cliente pero **no esta conectado a un backend/servicio de envio real** (Formspree, Netlify Forms o backend propio) — esto es una tarea pendiente de implementacion tecnica, no de diseño ni copy. Ver detalle en `01-aplicacion-digital.md`.
- Regla de arquitectura de informacion (profundidad de clics, rutas cuando el sitio crezca a multi-pagina) condiciona como se estructura el catalogo de oportunidades de inversion — ver Modulo 13 (Sistema para Proyectos Inmobiliarios, dominio brand/business, no incluido en esta migracion).

## Archivos de este dominio

| Archivo | Contenido | Fuente original |
|---|---|---|
| `01-aplicacion-digital.md` | Sitio web, UX/UI, navegacion, formularios, animaciones, responsive | `references/09-aplicacion-digital.md` |
| `02-presentaciones.md` | Reglas para decks (Canva, PowerPoint, Google Slides, Keynote), tipos de presentacion | `references/10-presentaciones.md` |
| `03-redes-sociales.md` | Reglas por plataforma: Instagram, LinkedIn, Facebook, TikTok, YouTube | `references/11-redes-sociales.md` |
| `04-publicidad.md` | Principios de campaña, Meta Ads/Google Ads, banners, tipos de campaña | `references/12-publicidad.md` |

## Notas de migracion

- Todo el contenido fuente esta marcado **[EXTENSION]** en origen (no hay contenido OFICIAL literal del Brand Guidelines en los Modulos 09-12) — es decir, son soluciones coherentes derivadas de los principios de marca (Modulos 01/02/03/05 del sistema original), presentadas como recomendacion, no como regla oficial cerrada. Esta distincion se preserva en cada archivo migrado.
- Referencias cruzadas a "Modulo XX" del sistema original se mantienen en el texto migrado para trazabilidad, con una nota de a que dominio de este repo corresponderia cada modulo quedo documentada aqui:
  - Modulos 01,02,03,04,05,06,07,08 → dominio `brand/` (ADN, verbal, visual/logo, tipografia, color, sistema grafico, direccion de arte, sistema de imagen)
  - Modulo 13 (Proyectos Inmobiliarios), 14 (Prompt Engine IA), 15 (Matriz de Decision), 16 (Cierres y Firmas) → no migrados en esta tarea (fuera de alcance de MARKETING)
  - Modulos 17-20 (Sistema de Consulta, Director Creativo, Brand Guardian, Resultado Final) → protocolos de comportamiento de la skill original, no contenido de dominio; no migrados como archivo de conocimiento.
