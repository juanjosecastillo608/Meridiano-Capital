# Modulo 09 — Aplicacion Digital (Website + UX/UI)

**Estado: [EXTENSION]** derivada de Modulos 03/04/05/06 y de la Parte 6 del Brand Guidelines, **verificada contra una implementacion real**: `meridiano-capital-sitio-web.html`. Cada regla de este archivo fue auditada contra ese archivo — donde la auditoria encontro una brecha (menu mobile roto, falta de formulario real, scroll bajo header fijo, falta de skip-link), la regla ya refleja la version corregida, no la aspiracional. Si el sitio cambia, este archivo debe re-auditarse.

## Indice
1. Arquitectura · 2. UX (principios) · 3. UI (sistema visual de interfaz) · 4. Navegacion · 5. Jerarquia · 6. Componentes · 7. CTAs · 8. Formularios · 9. Animaciones · 10. Microinteracciones · 11. Responsive

---

## 1. Arquitectura

**Modelo actual:** sitio de una sola pagina (single-page) con secciones ancladas por ID — Home/Hero, Nosotros (ADN), Proceso, Servicios, Portafolio Dual, Aliados, Contacto. Navegacion por scroll + anchors, sin recarga de pagina.

**Cuando migrar a multi-pagina:** si el catalogo de oportunidades de inversion crece (fichas individuales de propiedad/proyecto), pasar a una arquitectura de rutas:
```
/                      → home (resumen + anchors a secciones clave)
/servicios             → detalle de las 5 unidades de negocio
/proceso                → detalle del proceso de 4 pasos
/oportunidades          → catalogo de proyectos activos
/oportunidades/[slug]   → ficha individual de propiedad/proyecto (Modulo 13)
/nosotros               → Sobre Meridiano Capital + manifiesto
/urbannit               → landing propia de la sub-marca (Modulo 11/13)
/contacto               → formulario dedicado
```
Regla de profundidad: ningun contenido relevante para un inversor debe estar a mas de 2 clics de la home.

**Stack:** el sitio actual es HTML/CSS/JS sin build process — deliberado, para que cualquier desarrollador lo tome sin fricción y lo integre a un CMS o lo porte a React/Next.js sin reescritura conceptual (la logica de componentes ya esta separada por clases CSS reutilizables). Al migrar a un framework, preservar exactamente las variables de diseño (custom properties CSS) como design tokens.

## 2. UX — principios de diseño

1. **Claridad antes que ingenio** — un usuario nunca deberia dudar que hacer despues (tono "directo, no brusco", Modulo 02).
2. **Un H1 por vista, un CTA primario dominante por seccion** (ver Jerarquia y CTAs abajo).
3. **Contenido real siempre** — nunca lorem ipsum ni testimonios inventados (Modulo 02).
4. **Numeracion solo si hay secuencia real** (Modulo 06) — el proceso de 4 pasos se numera, los 5 servicios no.
5. **Prevencion de errores sobre correccion de errores** — validacion de formulario inline en tiempo real (ver Formularios), no solo al enviar.
6. **Reconocimiento sobre recuerdo** — navegacion persistente (header sticky), breadcrumbs si se migra a multi-pagina.
7. **Control del usuario** — ninguna animacion bloquea la lectura; `prefers-reduced-motion` siempre respetado (ver Animaciones).
8. **Accesibilidad de teclado como requisito, no extra** — cada version del sitio debe incluir un **skip-link** ("Saltar al contenido") visible al enfocar con Tab, que salte el header y lleve directo al contenido principal. Verificado presente en la version actual.

## 3. UI — sistema visual de interfaz
Ver Modulos 04 (tipografia) y 05 (color) para los valores exactos. Reglas especificas de UI:
- Radio de borde: 1-3px en toda la interfaz (botones, cards, inputs) — nunca "pill" muy redondeado ni esquinas 100% cuadradas.
- Sombras: minimas y funcionales (una leve elevacion en hover de card vía `transform`, nunca `box-shadow` pesado ni decorativo) — coherente con la prohibicion de sombras del logo (Modulo 03) extendida a toda la UI.
- Bordes finos (1-1.5px) como recurso primario de separacion visual, no lineas gruesas ni dobles.

## 4. Navegacion

**Header:** fijo (`position:fixed`), transparente sobre el hero, pasa a solido (petroleo profundo + blur) al hacer scroll (`scroll > 40px`).

**Desktop (>880px):** enlaces de texto horizontales (Poppins Medium) + CTA primario.

**Mobile (≤880px) — patron verificado y corregido:** los enlaces de texto se ocultan y son reemplazados por un boton hamburguesa (`aria-label`, `aria-expanded`, `aria-controls` correctamente enlazados) que abre un panel de navegacion a pantalla completa en petroleo profundo, con los mismos enlaces en tipografia Lora grande, boton de cierre visible, cierre con tecla Escape, y bloqueo de scroll del body mientras esta abierto (`body.no-scroll`). **Bug corregido:** la version anterior ocultaba los enlaces en mobile sin ningun reemplazo funcional — un usuario mobile perdia acceso a Servicios/Proceso/Portafolio/Nosotros. No repetir ese error en versiones futuras.

**Scroll a anclas:** todo elemento `section[id]` lleva `scroll-margin-top` (88px desktop / 76px mobile) igual a la altura aproximada del header fijo, para que al navegar a una seccion esta no quede parcialmente tapada. **Bug corregido:** la version anterior no compensaba el header fijo.

## 5. Jerarquia
- Un unico `<h1>` por pagina (el titular del hero). `<h2>` para titulo de cada seccion. `<h3>`/`<h4>` para subtitulos internos (ej. cada card de servicio). Nunca saltar niveles (un `h4` no puede aparecer sin un `h3` antes en esa rama del contenido).
- Orden de lectura: eyebrow (Poppins Bold, tracking) → titular (Lora) → lede (Poppins Regular, grey calido) → contenido/CTA.

## 6. Componentes (libreria base)
Boton primario / secundario-ghost · Card de servicio · Card de estadistica (numero grande + label) · Timeline de pasos (con conector y circulos numerados) · Split-panel de dos marcas (Portafolio Dual) · Tarjeta de aliado (icono circular + texto) · Formulario (inputs, select, textarea, boton, mensajes de error/exito) · Footer con grid de 4 columnas · Panel de navegacion mobile.

Cada componente nuevo que se cree debe reusar las variables de color/tipografia (Modulos 04/05) — nunca declarar un color o fuente inline fuera del sistema de variables CSS.

## 7. CTAs
- **Un CTA primario dominante por vista/seccion** — evitar competir con multiples botones dorados en la misma pantalla.
- Jerarquia: primario (fondo lapacho dorado, texto petroleo profundo oscuro — nunca texto blanco sobre dorado, falla contraste segun Modulo 05) > secundario/ghost (borde, sin relleno).
- Copy de CTA: verbo de accion directo, coherente con Modulo 02 ("Agendar consulta", "Enviar consulta") — nunca "Submit" o "Click aqui".
- Un CTA primario se repite en momentos naturales de decision: header (siempre visible), hero, cierre de pagina — nunca mas de una vez por viewport visible simultaneamente.

## 8. Formularios
**Estado verificado:** el sitio incluye un formulario de contacto real (nombre, email, pais de origen, mensaje opcional) en la seccion de Contacto — reemplaza la version anterior que solo ofrecia un enlace `mailto:` sin captura de datos estructurada.

Reglas:
- Validacion **inline y en el submit**: campos requeridos marcados con `required`, tipo `email` validado por el navegador + JS que marca visualmente el campo (borde en tono calido de error, nunca rojo puro fuera de paleta) y muestra un mensaje de error especifico y accionable en la voz de marca (Modulo 02) — nunca "Error" generico.
- Mensajes de error viven en un elemento con `role="alert"` junto al campo, para lectores de pantalla.
- Estado de exito: al enviar correctamente, el formulario se reemplaza por un mensaje de confirmacion (`role="status"`) — nunca un `alert()` de navegador.
- Nota de privacidad obligatoria bajo el boton de envio (que se hace con los datos).
- Alternativa de contacto directo (email visible) siempre presente junto al formulario, para quien prefiera no completarlo.
- **Pendiente de produccion:** el formulario actual valida en el cliente pero no esta conectado a un backend/servicio de envio real (Formspree, Netlify Forms, o backend propio) — el codigo deja marcado con un comentario donde conectar ese servicio. No dar por resuelta la captura de leads hasta conectar un endpoint real.

## 9. Animaciones
- Reveals de scroll: fade + slide sutil (translateY 20-24px, opacity 0→1), disparados por `IntersectionObserver` al 12% de visibilidad — nunca bounce ni easings elasticos.
- Momento de marca protagonista: el isotipo (mojon) dibujandose con `stroke-dashoffset` (~2.1s) + fade-in del punto dorado (~0.6s) — reservado para el hero y aperturas de video (Modulo 08), no repetir en cada seccion o pierde impacto.
- `prefers-reduced-motion: reduce` siempre respetado — desactiva el trazo del isotipo y los reveals, mostrando el contenido final directamente.

## 10. Microinteracciones
- Hover de enlaces/nav: color de texto pasa a lapacho dorado, transicion 0.2s.
- Hover de cards: borde pasa a dorado + leve `translateY(-3px)` (nunca sombra pesada).
- Focus visible (teclado): outline solido en lapacho dorado, offset 2-3px, en todo elemento interactivo (enlaces, botones, inputs) — nunca remover el outline por defecto sin reemplazo equivalente.
- Header: transicion de fondo transparente→solido con blur, 0.35s ease, al cruzar el umbral de scroll.

## 11. Responsive
**Breakpoints verificados en el sitio real:**
| Breakpoint | Rango | Comportamiento |
|---|---|---|
| Mobile | < 560px | 1 columna en todos los grids; menu hamburgues; CTAs a ancho completo si es necesario |
| Tablet chico | 560-880px | Grids de 2 columnas donde el desktop usa 3-4; menu hamburgues activo |
| Desktop | 880-1180px | Layout completo de escritorio, grids de 3-4 columnas |
| Wide | > 1180px | Contenido centrado con `max-width: 1180px`, nunca estirado a todo el ancho de pantallas ultra anchas |

- **Touch targets:** minimo 44x44px en cualquier elemento interactivo en mobile (botones, boton hamburgues, inputs) — corregido en la version actual (el CTA de header mobile media menos de 44px de alto en la version anterior).
- Tipografia con `clamp()` en titulares principales para escalar fluido entre mobile y desktop sin saltos bruscos por media query.
- Imagenes/SVG: siempre `max-width:100%` y `height:auto` — nunca dimensiones fijas en px que rompan en pantallas chicas.
