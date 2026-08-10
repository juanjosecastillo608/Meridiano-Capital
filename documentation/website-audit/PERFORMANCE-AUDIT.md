```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Performance Audit

## Lo bueno, verificado por ausencia de lo malo

El sitio es deliberadamente liviano: **un solo archivo HTML de 872 líneas**, sin framework, sin build step, sin bundler, sin dependencias JS externas (el único script es vanilla JS inline, ~130 líneas, para el menú mobile, el formulario, la calculadora y el scroll-reveal). No hay imágenes rasterizadas que descargar (todo es CSS/SVG inline). Esto significa que, en su estado actual, el sitio probablemente ya tiene buenos Core Web Vitals — no hay layout shift por imágenes sin dimensiones (porque no hay imágenes), no hay JS pesado bloqueando el hilo principal.

**Esto no es casualidad ni deuda técnica — es una decisión de arquitectura correcta para esta etapa del proyecto**, coherente con la regla del brief (sección 26): "si el código actual es bueno, presérvalo."

## Dependencia externa única y real: Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:...&family=Poppins:...&display=swap" rel="stylesheet">
```

Ya usa `preconnect` (correcto, reduce la latencia de conexión) y `display=swap` en la URL (correcto, evita texto invisible mientras carga la fuente — FOIT). Esto ya está bien implementado, mejor que la mayoría de sitios que cargan Google Fonts sin estas dos optimizaciones.

**Lo que falta**: no hay `<link rel="preload">` para el archivo de fuente variable en sí (solo preconnect a los dominios) — en una conexión lenta, el navegador todavía debe esperar el CSS de Google Fonts antes de empezar a descargar el archivo `.woff2` real. Y no existe ningún fallback local — si Google Fonts está bloqueado (red corporativa, VPN, o simplemente caído), el sitio cae a Georgia/Segoe UI silenciosamente (aceptable visualmente, pero sin ningún control ni medición de cuán seguido pasa esto).

## Backend real, pero no production-grade todavía

`server.py` es un servidor `http.server` de la librería estándar de Python — deliberadamente sin dependencias (documentado así en su propio docstring). Esto es perfecto para desarrollo/demo local, pero **no es lo que sirve el sitio en producción hoy** (no hay decisión de hosting tomada — U-011, ya documentado en `governance/decisions/REQUIREMENTS.md`). El formulario de contacto guarda a un archivo `.jsonl` **local** — en cualquier despliegue real, sin un volumen persistente y sin ninguna notificación (email, Slack, CRM), los leads capturados quedarían atrapados en el filesystem del servidor, sin que nadie en Meridiano se entere de que llegaron. Este es el hallazgo de mayor riesgo de negocio de todo este audit de performance: **el formulario "funciona" técnicamente pero no está conectado a ningún flujo de notificación real todavía.**

## Core Web Vitals — estimación razonada, no medida (sin herramienta de medición en este entorno)

| Métrica | Estimación | Razón |
|---|---|---|
| LCP (Largest Contentful Paint) | Probablemente bueno | El elemento más grande es el H1 de texto (Fraunces), no una imagen — carga rápido una vez la fuente esté disponible |
| CLS (Cumulative Layout Shift) | Riesgo bajo-medio | Sin `font-display` con fallback de métrica ajustada (`size-adjust`), el swap de Georgia→Fraunces puede causar un salto de layout pequeño pero real, dado que Fraunces es más ancho que Georgia en varios pesos |
| FID/INP | Probablemente excelente | JS mínimo, sin frameworks, sin tareas largas detectables en el código |

**Nota de alcance**: esta auditoría no ejecutó Lighthouse ni ninguna herramienta de medición real contra el sitio desplegado — las estimaciones de arriba están razonadas desde el código fuente, no medidas. Correr Lighthouse/PageSpeed Insights contra el sitio una vez tenga hosting real es un paso obligatorio antes de declarar "Performance Ready" (sección 36 del brief).

## Veredicto

**Score de Performance: 4/5.** La arquitectura es genuinamente liviana y ya tiene buenas prácticas de carga de fuentes — pierde un punto por la falta de plan de contingencia de fuentes y, más importante, por el riesgo de negocio real (no técnico) de que el backend de contacto no notifica a nadie todavía.
