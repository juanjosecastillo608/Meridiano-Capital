```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Typography Audit

## Regla del brief respetada: el Brand System ya define la tipografía — no se propone una nueva

`knowledge-base/brand/04-tipografia.md` (D-036, D-040) ya es la fuente de verdad: **Fraunces** (serif variable) para titulares, **Poppins** (sans) para cuerpo/UI. El sitio la implementa correctamente. Esta auditoría verifica la ejecución, no cuestiona la elección.

## Verificación crítica realizada hoy: ¿el bug de D-040 afecta al sitio?

D-040 (2026-08-09) documentó que **Fraunces en peso Bold (700) produce espaciado corrupto entre letras al renderizar en LibreOffice** — el motor usado para generar los PPTX/DOCX del pipeline `production/generadores/`. El CSS del sitio usa `font-weight:700` en todos los `h1,h2,h3,h4`, lo cual planteaba la pregunta obvia: ¿el sitio hereda el mismo bug?

**Se verificó en vivo, en un navegador real (Chromium), abriendo `index.html` directamente**: el H1 del hero ("No mostramos departamentos: construimos, estructuramos y gestionamos tu inversión.") renderiza con espaciado limpio y consistente, sin ningún rastro del defecto de LibreOffice.

**Conclusión, con evidencia**: el bug de D-040 es específico del motor de shaping de texto de LibreOffice, no un defecto de la fuente en sí — un navegador real (que usa HarfHuzz/DirectWrite/CoreText vía el motor del navegador, con una ruta de código distinta a la de LibreOffice) no lo reproduce. **El sitio puede seguir usando Fraunces Bold (700) sin riesgo** — D-040 sigue aplicando solo al pipeline de documentos (`production/generadores/`), tal como ya estaba documentado en `brand/04-tipografia.md` ("Excepción: peso Bold en el pipeline de generadores"), pero ahora con verificación directa en el canal web, no solo por inferencia.

## Sistema tipográfico implementado — auditoría de niveles

| Nivel del brief | Elemento real en el CSS | Family | Weight | Size | Line-height |
|---|---|---|---|---|---|
| Display / H1 | `.hero h1` | Fraunces | 700 | `clamp(34px, 4.6vw, 58px)` | 1.15 |
| H2 | `.section-head h2` | Fraunces | 700 | `clamp(28px, 3.4vw, 40px)` | 1.15 |
| H3 | `.pillar h3`, `.service-card h3`, etc. | Fraunces | 700 (heredado) | 15px–30px según contexto | 1.15 |
| Body Large | `.lede` | Poppins | 400 | 17–18px | 1.6 (heredado del body) |
| Body | `body` | Poppins | 400 | tamaño base navegador | 1.6 |
| Body Small | `.pillar p`, `.service-card p` | Poppins | 400 | 13.5–14.5px | 1.6 |
| Caption | `.eyebrow` | Poppins | 700 | 12.5px | — |
| Navigation | `.navlinks a` | Poppins | 500 | 14px | — |
| Button | `.btn` | Poppins | 600 | 15px | — |
| Numbers | `.hero-foot .stat b`, `.step .circle` | Fraunces | 700 | 22-26px | — |

**Hallazgo**: el sistema existe y es consistente, pero **no está documentado como sistema formal** — cada tamaño vive hardcodeado en su selector, sin una escala tipográfica nombrada (ej. `--text-h1`, `--text-body`) como sí existen los tokens de color. Ver `DESIGN-SYSTEM.md`.

## `font-variation-settings` — correctamente aplicado

```css
h1,h2,h3,h4{ font-variation-settings: 'opsz' 80, 'SOFT' 24, 'WONK' 0; }
em{ font-variation-settings: 'opsz' 80, 'SOFT' 30, 'WONK' 1; }
```
Coincide exactamente con la especificación de `brand/04-tipografia.md` — `opsz 80` para contraste óptico de titular, `SOFT 24` para calidez sin perder formalidad, `WONK` reservado para el acento en `<em>` del hero (una sola pincelada de personalidad, tal como especifica la regla oficial). **Correcto, sin desviación.**

## Riesgo real (no el de D-040): dependencia 100% de Google Fonts, sin fallback verificado

```css
--serif: 'Fraunces', Georgia, serif;
--sans: 'Poppins', 'Segoe UI', sans-serif;
```
El fallback existe en la declaración CSS (Georgia, Segoe UI) pero el `<link>` de Google Fonts no tiene `font-display: swap` explícito en la URL (aunque Google Fonts lo aplica por defecto en el CSS que devuelve, así que probablemente ya está cubierto — pero no está verificado explícitamente en este audit). Si Google Fonts no carga (bloqueo de red, adblock agresivo, o el propio inversor en un país con restricciones), el sitio cae a Georgia/Segoe UI — visualmente aceptable pero pierde por completo el carácter de marca (`opsz`/`SOFT`/`WONK` no existen en Georgia). Ver `PERFORMANCE-AUDIT.md`.

## Veredicto

**Score de Typography: 9/10.** Sistema correctamente ejecutado, fiel al Brand System oficial, y ahora verificado sin el riesgo que D-040 hacía temer. El único punto perdido es de documentación (sistema no formalizado con nombres/tokens) y de robustez de carga (sin self-hosting ni verificación de `font-display`).
