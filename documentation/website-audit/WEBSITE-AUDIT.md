```
Estado: AUDIT ONLY — ningún código ni contenido del sitio fue modificado
Alcance: production/app/frontend/index.html (872 líneas — HTML+CSS+JS en un solo archivo,
         sitio de una sola página) + production/app/backend/server.py (API real que consume)
Fecha: 2026-08-10
```

# MERIDIANO CAPITAL — SIGNATURE WEBSITE AUDIT

## Executive Summary

El sitio actual **no es una maqueta ni un MVP genérico** — es una implementación real, funcional, con backend propio (el formulario de contacto y la calculadora de rentabilidad llaman a una API Python real, no son simulaciones), design tokens correctamente extraídos como CSS custom properties, y ya aplicando el sistema de marca vigente (D-034/035/036: isotipo "partido por el meridiano", Fraunces/Poppins, paleta petróleo/tierra/dorado). Accesibilidad básica ya está presente (skip link, focus-visible, `prefers-reduced-motion`, aria-labels, menú mobile con foco gestionado).

**Lo que falta para el nivel "Signature/International" no es reconstruir — es un salto de calidad en tres ejes concretos**: dirección fotográfica real (hoy el sitio es 100% CSS/SVG, sin una sola fotografía — bloqueado por U-022, banco de imagen no producido), profundidad de contenido más allá de la home (todo vive en anclas de una sola página; no existen las páginas de "Oportunidades de Inversión" ni "Proceso de Inversión" detallado que el propio Perfil Profesional del CEO ya especifica como necesarias), y SEO/metadata técnica (sin Open Graph, sin schema.org, sin sitemap — el sitio es invisible para compartir en redes y para rich results de Google).

**Precisión sobre una auditoría anterior**: `governance/decisions/DECISION_REGISTER.md` registra U-002 ("formulario sin backend") y U-010 ("enlaces muertos href=#") — pero esos ítems describen `assets/source-docs/meridiano-capital-sitio-web.html`, el **archivo de referencia archivado a propósito**, no `production/app/frontend/index.html` (la copia viva que audita este documento). En la copia viva, **ambos puntos ya están resueltos**: el formulario llama a `/api/contacto` (persiste a `contactos.jsonl` vía `server.py`) y no queda ningún `href="#"` huérfano. No es un error de documentación (a diferencia del hallazgo de IVA de la auditoría de conocimiento) — son dos archivos distintos, cada uno correctamente descrito. Se detalla en `GAP-ANALYSIS.md`.

## Quality Score

| Criterio | Peso | Puntaje | Nota |
|---|---|---|---|
| Brand | 15 | 13 | Sistema de marca aplicado correctamente; falta reflejar D-041/042 (CEO, perfil personal) |
| Strategy | 15 | 10 | Golden Circle parcial; falta narrativa de autoridad más allá de "16 años" como dato suelto |
| UX | 15 | 10 | IA de una sola página limita profundidad; calculadora pública contradice RN-04 en espíritu |
| UI | 15 | 9 | Consistente pero sin fotografía — techo visual real de un sitio "signature" |
| Typography | 10 | 9 | Sistema correcto y ya verificado en navegador real sin el bug de D-040 (ver `TYPOGRAPHY-AUDIT.md`) |
| Color | 10 | 9 | Fiel a la paleta oficial, buen uso de contraste — un hallazgo de accesibilidad puntual |
| Content | 10 | 7 | Bien escrito, pero copy no diferenciado de home genérica de real estate premium en 2-3 bloques |
| Performance | 5 | 4 | Liviano (sin build, sin JS pesado) pero depende 100% de Google Fonts sin fallback local |
| SEO | 3 | 1 | Sin Open Graph, sin schema, sin sitemap |
| Accessibility | 2 | 2 | Buena base ya implementada |
| **TOTAL** | **100** | **74** | **Good but requires refinement (70-79)** |

**Lectura**: el sitio está por debajo del umbral "Premium/Production Ready" (80-89) por un margen concreto y cerrable — no por falencias estructurales. La mayoría del score perdido está concentrado en 3 áreas (Content, SEO, Performance/fuentes) que son ejecutables sin rehacer nada de lo que ya funciona bien.

## Top 20% of Changes → 80% of Perceived Quality (regla del brief, sección 32)

1. **Fotografía real** — el cambio de mayor impacto perceptual posible; hoy cero imágenes reales.
2. **Meta tags + Open Graph + schema.org** — invisible hoy al compartir en LinkedIn/WhatsApp o en resultados de Google.
3. **Profundizar "Nosotros"** con el Perfil Profesional del CEO ya construido (D-041/042) — hoy la home no menciona a Juan José Castillo en ningún lado visible.
4. **Página/sección de "Oportunidades de Inversión"** — el catálogo dinámico que el propio plan de contenido de Meridiano ya define (`Perfil Profesional`, sección 6.4) no existe todavía.
5. **Self-host de Fraunces/Poppins** (o al menos `font-display` + preload) — dependencia 100% de Google Fonts CDN sin red de seguridad.

## Estructura de esta auditoría

| Archivo | Contenido |
|---|---|
| `BRAND-AUDIT.md` | Alineación con ADN de marca, posicionamiento, Golden Circle |
| `UX-AUDIT.md` | Arquitectura de información, journey del inversor, fricción |
| `UI-AUDIT.md` | Grid, espaciado, jerarquía, consistencia de componentes |
| `TYPOGRAPHY-AUDIT.md` | Sistema tipográfico, incluye verificación en navegador real |
| `COLOR-AUDIT.md` | Sistema cromático, contraste, accesibilidad de color |
| `CONTENT-AUDIT.md` | Copywriting línea por línea + auditoría estratégica |
| `SEO-AUDIT.md` | Meta tags, schema, sitemap, SEO técnico |
| `PERFORMANCE-AUDIT.md` | Carga de fuentes, JS, imágenes, Core Web Vitals |
| `ACCESSIBILITY-AUDIT.md` | Contraste, navegación por teclado, semántica |
| `COMPETITIVE-RESEARCH.md` | Estándares de referencia (con limitación explícita de alcance) |
| `GAP-ANALYSIS.md` | Tabla actual → objetivo → acción, por área |
| `DESIGN-SYSTEM.md` | Formalización del sistema ya implícito en el CSS |
| `WEBSITE-ROADMAP.md` | 10 fases de implementación priorizadas |

## Regla de no-destrucción aplicada

Ningún hallazgo de esta auditoría implica que el sitio esté mal construido — la arquitectura técnica (tokens CSS, backend real, accesibilidad de base) se preserva íntegra en cualquier plan de implementación futuro. Ver `documentation/website-audit/DESIGN-SYSTEM.md` para lo que ya existe y debe mantenerse tal cual.

## Cierre — modo de ejecución

Esta es la **Etapa 1 (AUDIT ONLY)** del proceso de dos etapas pedido. No se modificó `index.html`, `server.py` ni ningún asset. La Etapa 2 (Implementation) espera aprobación explícita, punto por punto, siguiendo `WEBSITE-ROADMAP.md`.
