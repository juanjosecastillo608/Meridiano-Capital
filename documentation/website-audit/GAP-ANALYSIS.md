```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Gap Analysis — Current → Target

| Área | Actual | Objetivo | Gap | Acción |
|---|---|---|---|---|
| Fotografía | 0 imágenes reales, 100% CSS/SVG | Dirección fotográfica editorial en hero, proceso, portafolio | Total | Bloqueado por U-022 (banco de imagen no producido) — no se puede resolver desde el código |
| Perfil del CEO | 1 mención textual sin foto en el footer | Sección "Nosotros" con bio del CEO, usando `Meridiano_Perfil_Profesional_CEO.docx` ya construido | Alto, pero con contenido ya listo | Trasladar bios copy-ready al sitio — bajo esfuerzo, contenido ya existe |
| Portfolio visible | No se muestra ningún proyecto real | Mostrar cifras/casos del portfolio real (53 unidades, 11 edificios) respetando D-029 (invisibilidad societaria) | Alto, con dato ya disponible | Redactar sección "Portfolio" sin mencionar las 6 S.A. — dato ya en `business/06-estructura-societaria-y-portfolio.md` |
| Catálogo de oportunidades | No existe | Sección/página "Oportunidades de Inversión" navegable | Total | Requiere decisión de contenido (¿qué proyectos mostrar, con qué nivel de detalle público?) antes de construir |
| Meta tags sociales | Sin Open Graph ni Twitter Card | Preview correcto al compartir en LinkedIn/WhatsApp | Total, bajo esfuerzo | ~10-15 líneas de `<meta>`, cambio de bajo riesgo |
| Schema.org | Ausente | `Organization`/`RealEstateAgent` JSON-LD | Total, bajo esfuerzo | Bloque JSON-LD nuevo, no afecta nada existente |
| Multilenguaje | Solo español | ES/EN/PT según plan de contenido ya escrito | Total | Requiere traducción real, no solo código — esfuerzo de contenido, no solo técnico |
| Formulario segmentado | Genérico (nombre/email/país/mensaje) | Segmentado por tipo de consulta (Perfil Profesional, sección 6.7) | Medio | Cambio de UI + lógica de backend menor |
| Notificación de leads | Se guarda en `.jsonl` local, nadie se entera | Email/Slack/CRM al recibir un contacto real | Alto (riesgo de negocio, no solo técnico) | Requiere decisión de hosting (U-011) antes de poder resolverse en firme |
| Disclaimer del 10% en el hero | Ausente junto al stat | Presente, según RB-05 | Bajo, alto cumplimiento | Una línea de texto pequeño |
| Contraste `.eyebrow` sobre fondo claro | 3.21:1 (falla AA) | ≥4.5:1 | Bajo | Ajustar color o peso/tamaño de fuente — cambio de una línea CSS |
| Token `--radius` no usado | Botones usan `2px` hardcodeado | Usar `var(--radius)` consistentemente | Trivial | Una línea CSS |
| Sistema tipográfico formalizado | Tamaños hardcodeados por selector | Escala nombrada (tokens) documentada en `DESIGN-SYSTEM.md` | Medio | Refactor de CSS, sin cambio visual |
| Self-host / preload de fuentes | 100% dependiente de Google Fonts CDN | Preload + fallback verificado | Bajo-medio | Mejora de robustez, no crítico hoy |

## Precisión sobre U-002 y U-010 — dos archivos distintos, no un error de documentación

`governance/decisions/DECISION_REGISTER.md` registra U-002 (formulario sin backend) y U-010 (enlaces muertos) citando `technology/01-sitio-web-referencia.md` — que describe `assets/source-docs/meridiano-capital-sitio-web.html` (712 líneas), el **archivo de referencia archivado, congelado a propósito** (`CLAUDE.md`: "archivado — no editar"). Este audit cubrió `production/app/frontend/index.html` (872 líneas) — **"la copia viva"**, que ya resolvió ambos puntos. No es una corrección al estilo del hallazgo de IVA (ahí la documentación describía mal el config real); acá son dos archivos genuinamente distintos y ambas descripciones son correctas para el archivo que describen. Vale la pena, igual, dejarlo explícito para que nadie lea U-002/U-010 como aplicable al sitio en producción.
