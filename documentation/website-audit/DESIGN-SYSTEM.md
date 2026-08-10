```
Estado: AUDIT ONLY — formaliza lo que ya existe en el CSS, no propone nada nuevo salvo donde se marca explícitamente
Parte de: WEBSITE-AUDIT.md
```

# Design System — formalización de lo ya implícito

## Colors (ya tokenizados — ver `COLOR-AUDIT.md` para el detalle)

`--navy`, `--navy-2`, `--navy-tint`, `--tierra`, `--tierra-2`, `--gold`, `--gold-d`, `--cream`, `--cream-2`, `--grey`, `--kaa`, `--kaa-2`, `--sand`, `--charcoal`, `--white`, `--line` — 16 tokens, ya declarados en `:root`, fieles a `brand/05-sistema-cromatico.md`.

## Typography (hoy implícita, no tokenizada — propuesta de formalización)

El sitio ya tiene un sistema de tamaños consistente (ver `TYPOGRAPHY-AUDIT.md`), pero vive hardcodeado por selector. Formalización propuesta, **sin cambiar ningún valor real, solo nombrándolos**:

```css
--font-display: clamp(34px, 4.6vw, 58px);   /* .hero h1 */
--font-h2: clamp(28px, 3.4vw, 40px);        /* .section-head h2 */
--font-h3: 19px;                             /* .pillar h3, .service-card h3 */
--font-body-lg: 17px;                        /* .lede */
--font-body: 16px;                           /* body, tamaño base */
--font-body-sm: 14px;                        /* .pillar p, .service-card p */
--font-caption: 12.5px;                      /* .eyebrow */
```

## Spacing (ya consistente — formalización propuesta)

```css
--space-section: 108px;   /* padding vertical de section */
--space-head: 56px;       /* margin-bottom de .section-head */
--space-card: 30px;       /* padding interno de .service-card */
```

## Componentes ya existentes (inventario, no propuesta)

| Componente | Selector | Variantes reales hoy |
|---|---|---|
| Botón | `.btn` | `.btn-primary`, `.btn-ghost`, `.btn-ghost-dark` |
| Card | `.service-card`, `.pillar`, `.ally` | 3 variantes visualmente distintas sin documentar como sistema — ver hallazgo en `UI-AUDIT.md` |
| Badge/Tag | `.tag`, `.split-badge`, `.eyebrow` | 3 tratamientos de "etiqueta pequeña", ligeramente distintos entre sí |
| Panel de color sólido | `.split-panel.navy`, `.split-panel.kaa` | 2 variantes, mismo componente base |

**Recomendación de implementación** (no ejecutada en este ciclo): unificar `.tag`/`.split-badge`/`.eyebrow` en un solo componente `.label` con variantes de color — hoy son 3 implementaciones CSS distintas para el mismo concepto visual (texto pequeño, mayúsculas, letter-spacing amplio, color de acento).

## Grid

`--maxw: 1180px` — único contenedor de ancho máximo, usado sin excepción vía `.wrap`. `--radius: 3px` — token de radio de borde, declarado pero **no usado consistentemente** (ver hallazgo en `UI-AUDIT.md`, `.btn` usa `2px` hardcodeado).

## Iconography / Image System

**No existe todavía** — el sitio usa exclusivamente 2 símbolos SVG (`#mojon`, `#keyhole`) más iniciales de texto en círculos para la Red de Aliados. No hay un sistema de íconos de línea ni un sistema de imagen (crops, tratamiento de color, proporción) porque no hay fotografía. Este es el componente de mayor prioridad a construir, no a "auditar" — depende de que exista el banco de imagen (U-022).

## Responsive Rules (ya reales, ver `UI-AUDIT.md`)

Breakpoints: `560px`, `640px`, `780px`, `880px`, `980px` — 5 breakpoints deliberados por componente, no un único breakpoint genérico. Correcto y ya production-grade.

## Motion (ya real)

Transiciones de 0.2s–0.35s en hovers y el header al hacer scroll; animación de "dibujo" del isotipo del hero (2.1s, con `stroke-dasharray`/`stroke-dashoffset`) respetando `prefers-reduced-motion`. Sutil, con propósito, sin espectáculo — cumple exactamente el criterio de la sección 28 del brief ("nunca espectáculo, prioriza microinteracciones sutiles").

## States

`:hover`, `:focus-visible`, `[disabled]` (botón de envío), `.show`/`.open` (toggles de UI vía JS), `data-touched` (validación de formulario) — todos ya implementados de forma consistente.

## Veredicto

El sitio **ya tiene un Design System real, solo que no está documentado como tal en un solo lugar**. Este archivo es esa documentación — no se requiere construir el sistema desde cero, se requiere nombrarlo, unificar las 3 variantes de "badge" en un componente, y construir el sistema de imagen que hoy no existe.
