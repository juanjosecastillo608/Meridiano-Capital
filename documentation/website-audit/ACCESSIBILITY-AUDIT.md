```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Accessibility Audit

## Lo que ya está bien implementado (verificado en el código, no asumido)

| Práctica | Evidencia |
|---|---|
| Skip link | `<a href="#main-content" class="skip-link">Saltar al contenido</a>`, visible al recibir foco |
| Foco gestionado en el menú mobile | Al abrir, el foco se mueve a `mobileClose`; al cerrar, vuelve a `navToggle` — patrón correcto de foco de diálogo modal |
| `aria-modal`, `role="dialog"`, `aria-label` en el panel mobile | Presentes y correctos |
| `aria-expanded` / `aria-controls` en el botón de menú | Presentes, se actualiza dinámicamente vía JS |
| `prefers-reduced-motion` | La animación de dibujo del isotipo del hero se desactiva completamente si el usuario lo prefiere — implementación real, no un comentario vacío |
| `focus-visible` con outline visible | `a:focus-visible, button:focus-visible{ outline: 2px solid var(--gold); outline-offset: 3px; }` — outline de alto contraste, no el `outline:none` que rompe accesibilidad en tantos sitios |
| Labels de formulario | Cada `input`/`select`/`textarea` tiene un `<label for="">` asociado correctamente — sin placeholders usados como reemplazo de label |
| Errores de formulario anunciados | `role="alert"` en los mensajes de error de campo y de envío; `role="status"` en el mensaje de éxito — se anuncian a lectores de pantalla |
| Tamaño de objetivo táctil | Botones y campos usan `min-height:44px` consistentemente — cumple el criterio WCAG 2.5.5 (Target Size) |
| `<html lang="es">` | Correcto |
| Jerarquía de encabezados | Un solo `h1`, sin saltos de nivel — buena semántica |

Este es, en conjunto, un nivel de accesibilidad **por encima del promedio** de sitios corporativos que llegan a una primera auditoría — no es un área que requiera reconstrucción.

## Hallazgo cuantificado — contraste de `.eyebrow` no cumple WCAG AA

Ver `COLOR-AUDIT.md` para el cálculo completo: `#A87D22` (gold-d) sobre `#F3EDE3` (cream) da **3.21:1**, por debajo del mínimo de 4.5:1 para texto normal. Afecta a la etiqueta `.eyebrow` en las 5 secciones sobre fondo claro (no afecta a `.eyebrow.on-dark`, que usa `--gold` sobre navy y sí cumple, ~5.24:1).

## Hallazgo — íconos "Ab", "Es", "Co", "Op" de la Red de Aliados no tienen texto alternativo adicional

```html
<div class="ico">Ab</div>
<h3>Abogado</h3>
```
El texto "Ab" es una abreviatura visual (no un ícono real) seguida inmediatamente por el `<h3>` "Abogado" — un lector de pantalla leería "Ab. Abogado", una redundancia menor pero no un error de accesibilidad real (no hay información perdida, solo una repetición audible). Bajo impacto, mencionado por completitud.

## Hallazgo — el SVG decorativo del hero no está oculto de forma completamente consistente

El `.hero-mark` sí tiene `aria-hidden="true"` en su contenedor — correcto. Los `<svg class="mark">` del logo en nav/footer, en cambio, no llevan `aria-hidden`, pero están envueltos en un `<a>` con `aria-label="Meridiano Capital — inicio"` — el patrón es correcto (el label del link ya describe el conjunto), aunque técnicamente el SVG interno sigue siendo "visible" para tecnología asistiva sin agregar valor. No es un error, es un matiz de refinamiento.

## No verificado en este ciclo (fuera de alcance de una revisión de código estática)

- Contraste real medido con herramienta automatizada (axe-core, Lighthouse) sobre la página renderizada completa — se recomendó ya en `COLOR-AUDIT.md`.
- Navegación completa por teclado de principio a fin en un navegador real, incluyendo el formulario y la calculadora (el código sugiere que funciona correctamente — inputs nativos, sin custom widgets que requieran manejo de teclado especial — pero no se probó interactivamente tecla por tecla).
- Comportamiento con lector de pantalla real (NVDA/VoiceOver) — no disponible en este entorno de auditoría.

## Veredicto

**Score de Accessibility: 2/2** en la rúbrica del brief (que le da solo 2 puntos de 100 a este criterio) — pero el hallazgo de contraste cuantificado es real y debe corregirse independientemente del peso bajo que tiene en el score total; accesibilidad no es negociable por el tamaño de su ponderación.
