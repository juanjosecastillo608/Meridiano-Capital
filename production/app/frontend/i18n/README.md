# i18n — estructura preparada, sin traducir todavía

Construido en **Fase 04 (item 12) del `WEBSITE-ROADMAP.md`**, 2026-08-10. El founder eligió explícitamente el alcance "preparar la estructura i18n, sin traducir todavía" entre 3 opciones — este documento deja registrado qué se construyó y qué falta, para que quien retome la traducción real sepa exactamente dónde empezar.

## Qué existe hoy

- **Mecanismo funcional en `index.html`**: selector de idioma (ES/EN/PT) en el header desktop y en el panel mobile, un loader JS (`setLang()`) que hace `fetch('/i18n/{lang}.json')`, y atributos `data-i18n="clave"` en un subconjunto de elementos del sitio.
- **El español nunca se duplica.** No existe un `es.json` — el español real vive una sola vez, como contenido nativo del HTML. Al cargar la página, el JS captura el texto de cada elemento `[data-i18n]` en `el.dataset.i18nDefault` antes de tocar nada; ese es el fallback permanente. Esto evita exactamente el problema de "dos fuentes de verdad" que el resto de este repo ya viene resolviendo (`knowledge-base/` como única fuente de verdad de marca).
- **`en.json` y `pt.json` son stubs vacíos** (solo metadata `_status`/`_note`, sin claves de traducción reales). El loader filtra las claves que empiezan con `_` — si no encuentra ninguna clave de traducción real, no aplica ningún cambio de texto: deja el español y muestra una nota breve ("English version coming soon..." / "Versão em português em preparação...") que desaparece sola a los 6 segundos.
- **Nunca hay una página a medio traducir.** Si mañana alguien agrega `en.json` con solo 5 de las ~25 claves traducidas, esas 5 cambian a inglés y el resto cae al fallback en español automáticamente (`data[key] || el.dataset.i18nDefault` en el loader) — no rompe, no muestra `undefined`, no deja un hueco vacío.

## Qué elementos están etiquetados (`data-i18n`) hoy

Un subconjunto representativo, no el sitio completo — proporcional a "preparar estructura", no a "traducir todo":

- Navegación: los 6 links del header + su duplicado en el panel mobile + el footer (`nav.*`)
- CTA principal del header/mobile panel (`nav.cta`)
- Hero: eyebrow, lede, los 2 botones (`hero.*`) — **el `<h1>` queda fuera a propósito** (ver abajo)
- Los 7 eyebrows de sección (`section.*_eyebrow`)
- Los 3 títulos de columna del footer (`footer.*_title`) + 2 links de la columna "Empresa"

## Qué queda deliberadamente fuera de este ciclo

- **El `<h1>` del hero** — contiene `<em>` y `<br>` inline para el énfasis tipográfico de marca. `data-i18n` hoy reemplaza vía `textContent`, que perdería ese markup. Extenderlo a HTML seguro (`innerHTML` con una lista blanca de tags, o separar el h1 en spans) es trabajo adicional, no incluido en este ciclo.
- **El resto del copy largo**: descripciones de los 4 pilares, las 5 unidades de servicio, las descripciones de Aliados, el copy de Portafolio Dual, el formulario de contacto, la calculadora. Ninguno de estos tiene `data-i18n` todavía — es la mayor parte del trabajo de traducción real cuando llegue.
- **Traducción real a inglés o portugués.** Cero texto inventado o generado automáticamente — ni en este README ni en los JSON. Cuando el founder apruebe copy real en EN/PT, agregarlo a `en.json`/`pt.json` con las claves que ya existen en el HTML (`nav.servicios`, `hero.eyebrow`, etc.) y opcionalmente seguir agregando `data-i18n` a más elementos.

## Cómo agregar una traducción real

1. Confirmar el copy con el founder (o traductor aprobado) — nunca generarlo sin revisión, por las reglas de voz de marca de `knowledge-base/brand/02-identidad-verbal.md`.
2. Agregar las claves reales a `en.json` o `pt.json` (quitar o dejar `_status`/`_note`, no afecta la detección de contenido real).
3. Si el copy a traducir todavía no tiene `data-i18n` en el HTML, agregarlo primero (ver la lista de "qué está etiquetado hoy" arriba como referencia de patrón).
4. Probar los 3 idiomas en el navegador — el selector ES siempre debe volver exactamente al texto original (no debe haber drift, porque el fallback es el propio DOM, no una copia).
