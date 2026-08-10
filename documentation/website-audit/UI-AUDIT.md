```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# UI Audit

## Grid, spacing, escala — auditado contra el CSS real

| Aspecto | Hallazgo |
|---|---|
| Grid | `.wrap{ max-width: 1180px }` consistente en todas las secciones — sin excepciones detectadas |
| Spacing vertical | `section{ padding: 108px 0 }` uniforme; `.section-head{ margin-bottom:56px }` — ritmo consistente, no arbitrario |
| Escala tipográfica | Usa `clamp()` para hero h1 (34px–58px) y section-head h2 (28px–40px) — responsive real, no solo `font-size` fijo con media queries repetidas |
| Radios | `--radius:3px` declarado como token pero **no se usa en ningún selector** — los botones usan `border-radius:2px` hardcodeado, no `var(--radius)`. Inconsistencia menor pero real |
| Sombras | Solo 2 usos de `box-shadow` en todo el CSS (header al hacer scroll, y ninguna en cards) — decisión deliberada de un diseño "flat con bordes", consistente en toda la página |
| Component consistency | `.service-card`, `.ally`, `.pillar` son tres variantes de "tarjeta" con tratamientos ligeramente distintos (border vs. sin border, hover vs. sin hover) — no está mal, pero no están documentadas como variantes deliberadas de un mismo componente (ver `DESIGN-SYSTEM.md`) |

## Hallazgo — token `--radius` declarado y no usado

```css
--radius: 3px;
...
.btn{ ... border-radius:2px; ... }
```
El botón usa `2px` hardcodeado en vez de `var(--radius)` (que es `3px`). Es una inconsistencia de una sola línea, pero es exactamente el tipo de deuda que un Design System real debe cerrar antes de escalar a más componentes (sección 12 del brief: "no aceptes inconsistencias visuales").

## Hallazgo — ausencia total de fotografía es el techo real del UI

Cada sección usa: SVG dibujado a mano (isotipos), gradientes CSS (hero, CTA final), bloques de color sólido (split panels), o iconos-de-texto en círculos (Red de Aliados: "Ab", "Es", "Co", "Op" en vez de iconos o fotos reales). Esto es coherente y disciplinado — no hay imágenes rotas ni placeholders de mala calidad — pero significa que **el techo de sofisticación visual del sitio hoy es el de un sistema gráfico, no el de una marca con dirección de arte fotográfica**. Las referencias del brief (real estate premium, investment firms, luxury hospitality) sin excepción usan fotografía editorial como su principal vehículo de sofisticación — un sitio 100% geométrico no puede alcanzar por sí solo el nivel "Signature" sin ese componente. Ver `PERFORMANCE-AUDIT.md` para el lado positivo (esto también es lo que mantiene el sitio liviano) y `COMPETITIVE-RESEARCH.md`.

## Jerarquía visual — evaluación honesta

La jerarquía funciona bien dentro de cada sección individual (eyebrow → h2 → lede → contenido, repetido consistentemente 7 veces). El punto débil es **entre** secciones: casi todas las secciones tienen el mismo peso visual (mismo padding, mismo max-width, mismo patrón de encabezado) — no hay una sección que se sienta claramente "más importante" que las demás salvo el hero y el CTA final (que sí usan tratamiento de color distintivo). Una home de nivel signature normalmente varía el ritmo — secciones "respiro" cortas intercaladas con secciones densas — algo que este sitio no hace todavía.

## Veredicto

**Score de UI: 9/15.** Ejecución disciplinada y consistente de un sistema puramente gráfico — el gap no es de calidad de craft, es de **falta de un segundo lenguaje visual (fotografía)** que complemente el sistema geométrico ya sólido, y de variación de ritmo entre secciones.
