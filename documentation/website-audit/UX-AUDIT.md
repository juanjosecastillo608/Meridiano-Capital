```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# UX Audit

## Arquitectura actual: una sola página, seis anclas

```
#top (hero) → #nosotros (ADN) → #proceso → #servicios → #portafolio → (aliados, sin id) → #calculadora → #contacto
```

Todo vive en `index.html`, navegado por scroll+anchor. Es una arquitectura válida para un sitio de captación temprana, pero **no sostiene la profundidad de contenido que el propio negocio ya tiene**: no hay dónde alojar el catálogo de oportunidades, el detalle del proceso de inversión paso a paso (6 etapas reales, ver `business/04-etapas-del-inversor.md`, contra las 4 simplificadas que muestra el sitio), ni el perfil del CEO.

## Comparación contra la arquitectura pedida en la sección 10 del brief

`DISCOVER → UNDERSTAND → TRUST → EXPLORE → CONTACT → INVEST`

| Etapa pedida | Cómo la resuelve el sitio hoy |
|---|---|
| DISCOVER | Hero — cumple |
| UNDERSTAND | Pilares (ADN) + Proceso — cumple parcialmente, sin profundidad |
| TRUST | Red de Aliados — cumple parcialmente, sin prueba social ni portfolio |
| EXPLORE | **No existe** — no hay catálogo de oportunidades, no hay proyectos reales mostrados |
| CONTACT | Formulario — cumple bien, con backend real |
| INVEST | No hay siguiente paso post-contacto visible (¿qué pasa después de enviar el formulario, más allá del mensaje de éxito?) |

**El eslabón que falta es EXPLORE** — es la etapa que un inversor extranjero necesita antes de animarse a completar el formulario de contacto, y hoy el sitio salta directo de "conocernos" a "contactanos".

## Etapas del proceso: 4 en el sitio vs. 6 en el negocio real

El sitio muestra 4 pasos (Cédula → Banco → S.A. → Selección y cierre). El negocio real documentado (`business/04-etapas-del-inversor.md`) tiene 6 etapas, incluyendo Estructura Fiscal (Etapa 4) e Inversión y Administración (Etapa 5) como pasos formales — y ahora también el ángulo de residencia fiscal (`business/07-residencia-fiscal.md`, D-047) que ni siquiera está insinuado en el sitio. Simplificar de 6 a 4 para la home es una decisión editorial válida (no todo el detalle cabe en un timeline de home), pero deja fuera precisamente el paso que más le interesa al inversor extranjero sofisticado (fiscal) — candidato fuerte para una página de "Proceso" dedicada y más completa.

## Fricción identificada

1. **La calculadora es de acceso libre e inmediato** — sin ningún paso de calificación previo. Un inversor puede obtener un yield estimado sin dejar ningún dato de contacto. Esto reduce la fricción de uso (bueno para UX pura) pero también reduce la conversión a lead (malo para el objetivo de negocio #10, "generar contactos cualificados"). Decisión de producto a validar, no un error de UX en sí.
2. **El formulario de contacto no segmenta por tipo de consulta** — el formulario actual es genérico (nombre, email, país, mensaje libre), sin distinguir el motivo de contacto. **Corrección 2026-08-10**: la versión anterior de este hallazgo citaba "`Perfil Profesional`, sección 6.7" como fuente de una segmentación específica ("Quiero invertir / Ya soy propietario / Soy desarrollador") — esa cita es **incorrecta, no existe tal sección en ningún documento del repo** (verificado por grep en todo el repo). El hallazgo de fondo (falta de segmentación) sigue siendo válido y está señalado como pendiente en `knowledge-base/marketing/01-aplicacion-digital.md` §8, pero las 3 categorías de segmentación son una propuesta `[EXTENSION]` sin fuente oficial, pendiente de confirmar con el founder.
3. **Sin selector de idioma** — el propio plan de contenido (sección 6.1) especifica español/inglés/portugués dado el público de Europa, Brasil y Argentina. El sitio hoy es 100% español, sin ningún mecanismo de cambio de idioma. Para un inversor europeo que no hable español, esto es una barrera de entrada real, no cosmética.

## Mobile — verificado en el código, no solo "se ve responsive"

El CSS tiene breakpoints reales y deliberados (880px para nav/grids, 980px para hero-grid, 640px para calc-grid, 560px para pillars) — no es un `flex-wrap` genérico. El menú mobile tiene gestión de foco correcta (foco se mueve al botón de cierre al abrir, vuelve al toggle al cerrar) y bloquea el scroll del body. Esto ya cumple un estándar serio, no requiere trabajo adicional urgente — ver `PERFORMANCE-AUDIT.md` y `ACCESSIBILITY-AUDIT.md` para matices.

## Veredicto

**Score de UX: 10/15.** La experiencia dentro de lo que existe es sólida (accesible, con backend real, sin fricción técnica) — el gap es de **profundidad de arquitectura**, no de calidad de ejecución: falta el "EXPLORE" (catálogo de oportunidades) y falta segmentación (idioma, tipo de consulta) que el propio negocio ya definió como necesaria en otros documentos.
