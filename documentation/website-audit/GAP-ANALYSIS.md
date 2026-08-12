```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Gap Analysis — Current → Target

| Área | Actual | Objetivo | Gap | Acción |
|---|---|---|---|---|
| Fotografía | 0 imágenes reales, 100% CSS/SVG (+ nuevo símbolo decorativo `#contornos`, D-053, 2026-08-10 — sigue sin ser fotografía) | Dirección fotográfica editorial en hero, proceso, portafolio | Total | **Sigue bloqueado por U-022** (banco de imagen no producido). Se evaluaron y descartaron 2 alternativas: IA simulando propiedades reales (prohibido por la propia regla de U-022) y el servicio pago de generación de imágenes disponible en esta sesión (descartado por costo) — no se puede resolver desde el código sin material fuente real |
| ~~Perfil del CEO~~ | ✅ **Resuelto 2026-08-10** — sección "Quiénes somos" con bio, rol y monograma "JJC" (sin fabricar foto falsa) | — | — | — |
| ~~Portfolio visible~~ | ✅ **Resuelto 2026-08-10** — 4 cifras reales (53/11/35/18) en la sección "Quiénes somos", sin mencionar ninguna de las 6 S.A. | — | — | — |
| Catálogo de oportunidades | No existe | Sección/página "Oportunidades de Inversión" navegable | Total | Requiere decisión de contenido (¿qué proyectos mostrar, con qué nivel de detalle público?) antes de construir |
| ~~Meta tags sociales~~ | ✅ **Resuelto 2026-08-11 (Fase 09)** — Open Graph + Twitter Card completos, con `og-image.png` real (1200×630, tarjeta de marca propia, no placeholder) | — | — | — |
| ~~Schema.org~~ | ✅ **Resuelto 2026-08-11 (Fase 09)** — `RealEstateAgent` JSON-LD, validado como JSON correcto en navegador | — | — | — |
| ~~Multilenguaje~~ | ✅ **Estructura resuelta 2026-08-10 (Fase 04)** — selector ES/EN/PT funcional, ~25 elementos con `data-i18n`, loader con fallback automático a español. **Sigue pendiente**: traducción real a EN/PT (`en.json`/`pt.json` son stubs vacíos a propósito, ver `production/app/frontend/i18n/README.md`) y etiquetar el resto del copy largo (pilares, servicios, aliados, formularios) | Traducción real + cobertura completa de `data-i18n` | Medio | Esfuerzo de contenido (conseguir/aprobar copy EN/PT), no de arquitectura — el mecanismo ya existe |
| ~~Formulario segmentado~~ | ✅ **Resuelto 2026-08-10 (Fase 04)** — 4 categorías elegidas por el founder ("Inversión / Gestión de mi propiedad / Coinversión o desarrollo / Otra consulta"), persistidas como `tipo_consulta` (**corrección**: la cita anterior a "Perfil Profesional, sección 6.7" era incorrecta, no existe esa sección en ningún documento del repo) | — | — | — |
| Notificación de leads | Se guarda en `.jsonl` local (2 archivos: `contactos.jsonl` y `calculadora_leads.jsonl` desde Fase 04 item 13, ambos con campo `origen`) + punto de integración de CRM ya preparado (`_notificar_crm()`, no-op) | CRM conectado y notificando en tiempo real | Medio — vía ya decidida (D-048), falta elegir el CRM (U-026) | Elegir CRM, implementar la llamada real en `_notificar_crm()`. Hosting ya resuelto (`meridianocapital.net`, GoDaddy, D-055) — falta el deploy real en sí para que sea productivo fuera de local |
| ~~Disclaimer del 10% en el hero~~ | ✅ **Resuelto 2026-08-10** — `<p class="hero-disclaimer">` agregado junto al stat | — | — | — |
| ~~Contraste `.eyebrow` sobre fondo claro~~ | ✅ **Resuelto 2026-08-10** — `--gold-d` (3.21:1) → `--tierra` (6.95:1), color ya oficial de marca | — | — | — |
| ~~Token `--radius` no usado~~ | ✅ **Resuelto 2026-08-10** — las 6 instancias de `border-radius:2px` ahora usan `var(--radius)` | — | — | — |
| ~~Sistema tipográfico formalizado~~ | ✅ **Resuelto 2026-08-10 (Fase 03)** — 7 tokens (`--font-*`) en `:root`, aplicados sin cambio visual; 2 valores del `DESIGN-SYSTEM.md` original se corrigieron contra el CSS real al implementar (ver `WEBSITE-ROADMAP.md` Fase 03, ítem 8) | — | — | — |
| Preload de fuentes | ✅ **Resuelto 2026-08-10 (Fase 03)** — `<link rel="preload">` agregado para el woff2 variable de Fraunces (URL versionada, requiere revisión si Google la rota) | Self-host completo (sin depender de Google Fonts CDN) | Bajo — el preload ya cubre la mayor parte del beneficio de performance | Sigue quedando la migración a self-host como mejora de robustez de menor prioridad, no crítica hoy |

## Precisión sobre U-002 y U-010 — dos archivos distintos, no un error de documentación

`governance/decisions/DECISION_REGISTER.md` registra U-002 (formulario sin backend) y U-010 (enlaces muertos) citando `technology/01-sitio-web-referencia.md` — que describe `assets/source-docs/meridiano-capital-sitio-web.html` (712 líneas), el **archivo de referencia archivado, congelado a propósito** (`CLAUDE.md`: "archivado — no editar"). Este audit cubrió `production/app/frontend/index.html` (872 líneas) — **"la copia viva"**, que ya resolvió ambos puntos. No es una corrección al estilo del hallazgo de IVA (ahí la documentación describía mal el config real); acá son dos archivos genuinamente distintos y ambas descripciones son correctas para el archivo que describen. Vale la pena, igual, dejarlo explícito para que nadie lea U-002/U-010 como aplicable al sitio en producción.
