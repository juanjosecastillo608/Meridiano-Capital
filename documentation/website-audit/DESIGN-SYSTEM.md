```
Estado: AUDIT ONLY — formaliza lo que ya existe en el CSS, no propone nada nuevo salvo donde se marca explícitamente
Parte de: WEBSITE-AUDIT.md
```

# Design System — formalización de lo ya implícito

## Colors (ya tokenizados — ver `COLOR-AUDIT.md` para el detalle)

`--navy`, `--navy-2`, `--navy-tint`, `--tierra`, `--tierra-2`, `--gold`, `--gold-d`, `--cream`, `--cream-2`, `--grey`, `--kaa`, `--kaa-2`, `--sand`, `--charcoal`, `--white`, `--line` — 16 tokens, ya declarados en `:root`, fieles a `brand/05-sistema-cromatico.md`.

## Typography ✅ IMPLEMENTADO (2026-08-10, Fase 03)

El sitio ya tenía un sistema de tamaños consistente (ver `TYPOGRAPHY-AUDIT.md`); ahora está tokenizado en `:root` de `index.html`, aplicado en los selectores correspondientes:

```css
--font-display: clamp(34px, 4.6vw, 58px);   /* .hero h1 */
--font-h2: clamp(28px, 3.4vw, 40px);        /* .section-head h2 */
--font-h3: 19px;                             /* .pillar h3, .service-card h3 */
--font-body-lg: 18px;                        /* .lede */
--font-body: 16px;                           /* body, tamaño base */
--font-body-sm: 14px;                        /* .service-card p */
--font-caption: 12.5px;                      /* .eyebrow */
```

**Corrección contra la propuesta original de este documento** (escrita de memoria antes de implementar, dos valores no coincidían con el CSS real): `--font-body-lg` es **18px**, no 17px — 17px es un override deliberado de `.hero .lede` en un solo contexto, se dejó como literal, no como token. `--font-body-sm` cubre `.service-card p` (14px exacto); `.pillar p` usa 14.5px real, medio píxel distinto a propósito, también dejado como literal. Ningún valor visual cambió al implementar — se corrigió el token contra la realidad, no al revés.

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
| Badge/Tag | `.label` + `.tag`/`.split-badge`/`.eyebrow` | ✅ **Unificado 2026-08-10 (Fase 03)** — `.label` es la clase base compartida (font-family, text-transform); `.tag`/`.split-badge`/`.eyebrow` quedan como modificadores con solo lo que realmente varía (tamaño, peso, letter-spacing, color, margen). 14 elementos del HTML llevan ambas clases (`class="label eyebrow"`, etc.) |
| Panel de color sólido | `.split-panel.navy`, `.split-panel.kaa` | 2 variantes, mismo componente base |

## Grid

`--maxw: 1180px` — único contenedor de ancho máximo, usado sin excepción vía `.wrap`. `--radius: 3px` — token de radio de borde, usado consistentemente desde la Fase 01 (las 6 instancias que tenían `2px` hardcodeado ya se corrigieron — ver `WEBSITE-ROADMAP.md` Fase 01, ítem 3).

## Iconography / Image System

**No existe todavía** — el sitio usa exclusivamente 2 símbolos SVG (`#mojon`, `#keyhole`) más iniciales de texto en círculos para la Red de Aliados. No hay un sistema de íconos de línea ni un sistema de imagen (crops, tratamiento de color, proporción) porque no hay fotografía. Este es el componente de mayor prioridad a construir, no a "auditar" — depende de que exista el banco de imagen (U-022).

## Responsive Rules (ya reales, ver `UI-AUDIT.md`)

Breakpoints: `560px`, `640px`, `780px`, `880px`, `980px` — 5 breakpoints deliberados por componente, no un único breakpoint genérico. Correcto y ya production-grade.

## Motion (ya real)

Transiciones de 0.2s–0.35s en hovers y el header al hacer scroll; animación de "dibujo" del isotipo del hero (2.1s, con `stroke-dasharray`/`stroke-dashoffset`) respetando `prefers-reduced-motion`. Sutil, con propósito, sin espectáculo — cumple exactamente el criterio de la sección 28 del brief ("nunca espectáculo, prioriza microinteracciones sutiles").

## States

`:hover`, `:focus-visible`, `[disabled]` (botón de envío), `.show`/`.open` (toggles de UI vía JS), `data-touched` (validación de formulario) — todos ya implementados de forma consistente.

## Veredicto

El sitio **ya tiene un Design System real**. La tipografía está tokenizada, las 3 variantes de "badge" están unificadas en `.label`, y el `--radius` se usa consistentemente — los tres pendientes de este documento quedaron resueltos el 2026-08-10 (Fase 03). Lo único que sigue sin construirse es el sistema de imagen (bloqueado por U-022, banco de imagen no producido).
