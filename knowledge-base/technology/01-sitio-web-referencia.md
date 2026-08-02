```
Estado: CURRENT
Fuente original: assets/source-docs/meridiano-capital-sitio-web.html
Dominio: TECHNOLOGY
```

# 01 — Sitio web de referencia: desglose técnico

## Qué es exactamente este archivo

Un **único archivo HTML autocontenido** (`meridiano-capital-sitio-web.html`), 712 líneas, que incluye:
- Todo el CSS dentro de un bloque `<style>` en el `<head>` (líneas 11–296).
- Todo el JavaScript dentro de un bloque `<script>` al final del `<body>` (líneas 641–708).
- Cero archivos externos propios (ni `.css`, ni `.js`, ni imágenes locales — todo el arte gráfico son SVG inline).

No es una "web app": es una **landing page de una sola página** (single-page marketing site, no SPA con router) con navegación por anclas internas (`#servicios`, `#proceso`, `#portafolio`, `#nosotros`, `#contacto`).

## Stack técnico

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| Markup | HTML5 plano | `<!DOCTYPE html>`, `lang="es"` |
| Estilos | CSS3 plano con **custom properties** (`:root { --navy:#14313A; ... }`) | Sin preprocesador (no Sass/Less), sin metodología de nombrado tipo BEM estricta, selectores por clase directa |
| Interactividad | JavaScript vanilla (ES6+), ~70 líneas | Sin frameworks (no React/Vue/Alpine), sin librerías (no jQuery) |
| Tipografía | Google Fonts vía CDN | `Lora` (serif, pesos 400/500/600/700 + itálica 500) y `Poppins` (sans, pesos 300–700), cargadas con `<link rel="preconnect">` + `<link ... rel="stylesheet">` desde `fonts.googleapis.com` / `fonts.gstatic.com` |
| Gráficos | SVG inline | Un `<symbol id="mojon">` y un `<symbol id="keyhole">` reutilizados vía `<use href="#...">` en el logo/marca (header, footer) y en el ícono de "renta temporal" del panel Urbannit |
| Build step | **Ninguno** | No hay `package.json`, no hay bundler (Webpack/Vite/Parcel), no hay transpilación — el archivo se abre/sirve tal cual |
| Dependencias externas | **Una sola**: Google Fonts CDN | No hay analytics (GA/GTM), no hay pixel de Meta/LinkedIn, no hay chat widget, no hay CMS, no hay CAPTCHA |

> No hay ningún `<script src="...">` externo aparte de las fuentes (que son solo CSS, no JS). Todo el comportamiento corre en el bloque `<script>` propio.

## Estructura de secciones (orden real en el DOM)

1. **SVG defs globales** (líneas 300–311) — símbolos reutilizables `#mojon` (el ícono "mojón"/hito, marca de Meridiano) y `#keyhole` (ícono de Urbannit).
2. **Skip link** (línea 313) — `<a href="#main-content" class="skip-link">Saltar al contenido</a>`, accesibilidad de teclado.
3. **Header fijo** `<header class="site" id="siteHeader">` (315–333) — logo + nav (`Servicios`, `Proceso`, `Portafolio`, `Nosotros`, `Contacto`) + CTA "Agendar consulta" + botón hamburguesa (`#navToggle`, solo visible <880px).
4. **Panel de menú móvil** `<div class="mobile-panel" id="mobilePanel">` (335–343) — overlay a pantalla completa, `role="dialog" aria-modal="true"`.
5. **`<main id="top">`** contiene:
   - **Hero** (`.hero`, 350–374): eyebrow + H1 con énfasis en `<em>` + lede + 2 CTAs (`Agendar una consulta de inversión` primario, `Ver el proceso completo` ghost) + 3 stats destacados (16 años, grado de inversión Moody's, 10% rentabilidad neta objetivo) + marca SVG animada (`mojon-draw`, se dibuja con `stroke-dashoffset`).
   - **`#nosotros`** — "El concepto" / DNA (377–409): 4 "pilares" en grid (`.pillars`): 01 Técnica antes que venta, 02 Estructura legal-fiscal como producto, 03 Gestión activa no abandono, 04 Raíz paraguaya mirada internacional.
   - **`#proceso`** (bg-cream, 412–442): timeline de 4 pasos numerados (círculos 1–4): Cédula paraguaya → Apertura bancaria → Constitución de SA → Selección y cierre.
   - **`#servicios`** (445–490): dos `.services-group`:
     - "Antes de invertir": Unidad 01 (Originación & Asesoría de Inversión), Unidad 02 (Onboarding Legal-Bancario-Fiscal).
     - "Después de invertir": Unidad 03 (Gestión Patrimonial), Unidad 04 (Desarrollo & Coinversión), Unidad 05 (Value-Add / Reposicionamiento).
   - **`#portafolio`** (492–518): panel dual `.split` a pantalla completa — panel navy "Renta tradicional" (6%–10% bruto anual) vs panel kaki "urbannit — hospitalidad" / renta temporal (10%–16%+ bruto anual).
   - **Aliados** (bg-sand, 520–550): grid de 4 `.ally` — Abogado, Escribano, Contadora, Operador Urbannit.
   - **`#contacto`** / CTA final (552–594): título + lede + **formulario de contacto** (`#contactForm`) + email de contacto en texto plano.
6. **`<footer>`** (598–639): 4 columnas (marca+tagline, Navegación, Empresa [Urbannit/Coinversión/Recursos — enlaces `href="#"` sin destino real], Contacto) + barra inferior con copyright "© 2026 Meridiano Capital" y nota "Urbannit es una marca gestionada por Meridiano Capital".
7. **`<script>`** (641–708): lógica de menú móvil, validación de formulario, header que cambia de fondo al hacer scroll, y scroll-reveal con `IntersectionObserver`.

## El formulario de contacto — detalle importante

Campos: `name` (texto, requerido), `email` (requerido, `type="email"`), `country` (`<select>` requerido: España / Alemania / Otro país europeo / Argentina / Brasil / Otro), `message` (textarea, opcional).

Comportamiento real del JS (líneas 666–696):
```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // valida required/email con checkValidity() nativo del navegador
  // si es válido: form.hidden = true; successMsg.hidden = false;
  // NO HAY fetch(), NO HAY envío de datos a ningún lado.
});
```
El propio código lo documenta explícitamente en un comentario:
> `// Sin backend conectado todavia: mostrar confirmacion visual. // Reemplazar este bloque por un fetch() real a un servicio de formularios (Formspree, Netlify Forms, backend propio).`

**Es decir: hoy el formulario no envía ningún dato a ningún lugar.** Simula éxito visualmente y no persiste ni transmite la consulta del inversor. Esto es central para cualquier plan de "app funcional".

## Accesibilidad y responsive — lo que hace bien

- Skip link a `#main-content`.
- `aria-label`, `aria-expanded`, `aria-controls`, `aria-modal`, `role="dialog"`, `role="alert"` (errores de campo), `role="status"` (mensaje de éxito) usados correctamente.
- `:focus-visible` con outline dorado consistente en toda la página.
- `prefers-reduced-motion: reduce` respetado — desactiva la animación de dibujo del SVG del hero.
- Objetivos táctiles ≥44px (`min-height:44px; min-width:44px`) en botones de nav/menú/inputs — cumple guía táctil estándar.
- `scroll-margin-top` en `section[id]` para compensar el header fijo al navegar por anclas.
- Responsive vía CSS Grid + Flexbox con breakpoints en 980px, 880px, 780px, 560px — mobile-first no es estricto (usa `max-width` media queries, approach desktop-first), pero cubre bien los rangos.
- Navegación de escritorio se oculta <880px y se reemplaza por el panel móvil a pantalla completa.

## Qué le falta para ser una web app real y mantenida

1. **Backend de formulario real.** Hoy no hay ningún receptor de datos — es la brecha #1. Se necesita como mínimo un endpoint (propio o de terceros tipo Formspree/Netlify Forms) que reciba, valide server-side y notifique (email/CRM).
2. **Separación de archivos.** Todo el CSS y JS vive inline en un solo HTML. Para mantenimiento real conviene extraer a `styles.css` / `script.js` (o a componentes, si se adopta un framework), aunque **no es obligatorio** — un sitio estático de una sola página puede seguir siendo un solo archivo si el equipo lo prefiere así por simplicidad de despliegue.
3. **Multi-página / CMS si el contenido va a crecer.** Hoy todo es anclas dentro de una sola página. Los enlaces de footer a "Urbannit", "Coinversión" y "Recursos" apuntan a `href="#"` (no van a ningún lado) — son placeholders de contenido que no existe todavía. Si esas van a ser páginas reales, hace falta o (a) archivos HTML adicionales, o (b) un generador de sitio estático / CMS headless.
4. **Ningún build step hoy — no es obligatorio agregarlo.** El archivo funciona sirviéndolo tal cual desde cualquier hosting estático (Netlify, Vercel, GitHub Pages, S3). Un framework (Next.js, Astro, etc.) solo se justifica si se necesita: rutas dinámicas, integración de datos (ej. mostrar resultados de la calculadora), o un CMS.
5. **Sin analítica ni tracking.** No hay forma de medir tráfico, conversión del formulario, ni origen de leads. Es una decisión consciente hoy (cero dependencias de terceros más allá de Google Fonts) pero limita la capacidad de negocio de medir el sitio como canal de leads.
6. **Sin conexión con la calculadora de rentabilidad.** El sitio no expone ninguna herramienta interactiva de cálculo — es puramente informativo/institucional. Ver `03-arquitectura-propuesta.md` para una propuesta de integración.
7. **Dominio, hosting y despliegue no definidos.** No hay ningún archivo de configuración de deploy (`netlify.toml`, `vercel.json`, `.github/workflows/*`) en el material fuente.

## Veredicto de estado

Es una **maqueta de referencia visualmente terminada y de calidad de producción en su capa de presentación** (marca, copy, accesibilidad, responsive), pero **funcionalmente es un mockup**: el único punto de interacción real (el formulario) no hace nada más que simular éxito en el navegador. No requiere un framework para existir — puede seguir siendo HTML/CSS/JS plano — pero si va a ser el sitio real de captación de inversores, el paso obligatorio es conectar el formulario a un destino real.

> UNRESOLVED: no se especifica en el material fuente qué proveedor de hosting, dominio o servicio de formularios usará Meridiano Capital. Se necesita esa decisión antes de desplegar el sitio en producción.
