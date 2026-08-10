```
Estado: AUDIT ONLY — roadmap propuesto, ninguna fase ejecutada todavía. Espera aprobación (Etapa 2).
Parte de: WEBSITE-AUDIT.md
```

# Website Improvement Roadmap

Diez fases, en el orden del brief (sección 34), con el contenido real de esta auditoría — priorizadas dentro de cada fase según el criterio 80/20 de la sección 32.

## PHASE 01 — Critical corrections (bajo esfuerzo, alto impacto o riesgo de compliance)

1. ✅ **Hecho (2026-08-10)** — Disclaimer de RB-05 agregado junto al stat "10% rentabilidad neta anual objetivo" del hero.
2. ✅ **Hecho (2026-08-10)** — Contraste de `.eyebrow` sobre fondo claro corregido (3.21:1 → 6.95:1, `--gold-d` → `--tierra`).
3. ✅ **Hecho (2026-08-10)** — Token `--radius` ahora usado consistentemente (6 instancias corregidas, no solo `.btn`).
4. 🟡 **Parcial (2026-08-10, D-048)** — El founder confirmó la vía: **integración con un CRM, todavía sin elegir cuál** (U-026). Se preparó el punto de integración en `server.py` (`_notificar_crm()`, hoy no-op documentado) para que conectar el CRM sea un cambio acotado el día que se elija — el guardado local (`contactos.jsonl`) sigue siendo el respaldo confiable mientras tanto. **No queda cerrado del todo** — falta elegir el CRM y escribir la llamada real.

## PHASE 02 — Brand refinement ✅ COMPLETA (2026-08-10)

5. ✅ **Hecho** — Nueva sección "Quiénes somos" (`#nosotros`) con bio del CEO (adaptada de `Meridiano_Perfil_Profesional_CEO.docx`, D-041/042): monograma "JJC" (sin fabricar una foto falsa — bloqueado por U-022, se usó el mismo lenguaje visual de círculos con iniciales que ya existía en Aliados), rol "CEO · Meridiano Capital", bio de ~50 palabras. La sección de los 4 Pilares (ADN) se preservó intacta, ahora en su propia `<section id="concepto">` inmediatamente después — no se destruyó nada, se reordenó y se sumó contenido.
6. ✅ **Hecho** — Cifras de portfolio real agregadas (53 unidades / 11 edificios / 35 operativas / 18 en obra, entregas hasta 2029) — **sin mencionar ninguna de las 6 S.A.** (Campo Agreste, Jumacabe, WICA, Quintero, Canarias, ARL), respetando D-029 de forma más estricta que el propio `Meridiano_Info_Completa.pptx` (que sí menciona "5 sociedades propietarias" en una nota al pie — el sitio web, al ser una pieza pública permanente, no repite ni esa mención agregada).
7. ✅ **Hecho** — Sección "Aliados" reescrita con voz de marca: nuevo lede ("Un inversor extranjero no tiene forma de verificar por sí mismo..."), y las 4 descripciones de tarjeta pasaron de listas de tareas a lenguaje de acompañamiento ("Constituye la sociedad y revisa cada contrato antes de que lo firmes — sin sorpresas después.").

**Extra, descubierto al ejecutar la Fase 02**: se encontraron 2 instancias más del mismo problema de contraste de la Fase 01 (`.pillar .num` y `.service-card .tag`, ambos `--gold-d` sobre fondo claro) — corregidas con el mismo criterio (`--tierra`), sin esperar a una futura pasada de accesibilidad dedicada.

## PHASE 03 — Typography & color

8. Formalizar el sistema tipográfico como tokens nombrados (`DESIGN-SYSTEM.md`) — sin cambiar ningún valor visual.
9. Unificar `.tag`/`.split-badge`/`.eyebrow` en un componente `.label` único con variantes.
10. Agregar `<link rel="preload">` para el archivo de fuente variable, además del `preconnect` ya existente.

## PHASE 04 — UX/UI

11. Rediseñar el formulario de contacto con segmentación por tipo de consulta (Perfil Profesional, sección 6.7).
12. Agregar selector de idioma (ES/EN/PT) — requiere decisión de alcance (¿traducción completa o solo hero/CTAs inicialmente?).
13. Evaluar si la calculadora debe llevar algún paso de calificación previo (decisión de producto, no ejecutar sin validar con el founder).
14. Variar el ritmo visual entre secciones (hoy casi todas tienen el mismo peso).

## PHASE 05 — Copywriting

15. Reescribir los 4 títulos de pasos de "Proceso" con más voz técnica (hoy son genéricos, ver `CONTENT-AUDIT.md`).
16. Desarrollar la narrativa de "16 años" con evidencia concreta, no solo la cifra suelta.

## PHASE 06 — Photography

17. **Bloqueada por U-022** (banco de imagen no producido) — no se puede ejecutar desde el código. Es la fase de mayor impacto perceptual de todo el roadmap, y la única que no depende de trabajo de desarrollo.
18. Una vez exista el banco de imagen: definir el sistema de tratamiento (crops, proporción, filtro de color) como parte de `DESIGN-SYSTEM.md`.

## PHASE 07 — Design System

19. Documentar formalmente el Design System ya real (este ciclo ya produjo la base en `DESIGN-SYSTEM.md` — falta la costura de imagen e iconografía, dependiente de Fase 06).

## PHASE 08 — Performance

20. Verificar `font-display`/fallback real con una prueba de red bloqueada.
21. Medir Core Web Vitals reales con Lighthouse una vez el sitio tenga hosting (bloqueado por U-011).
22. Resolver el hosting/dominio del backend (U-011) — condición previa para que el formulario de contacto sea productivo de verdad, no solo funcional localmente.

## PHASE 09 — SEO

23. Agregar Open Graph + Twitter Card (bajo esfuerzo, cambio de alto impacto para compartir en LinkedIn/WhatsApp).
24. Agregar schema.org (`Organization`/`RealEstateAgent`) en JSON-LD.
25. `sitemap.xml` y `robots.txt` — de baja prioridad mientras el sitio siga siendo de una sola página, pero preparar la estructura antes de que exista más de una página real (catálogo de oportunidades, blog).

## PHASE 10 — Final QA

26. Segunda auditoría completa (protocolo de cierre, sección 35 del brief): BEFORE / AFTER / WHY / IMPACT / SCORE, comparando contra el score inicial de 74/100 de `WEBSITE-AUDIT.md`.
27. Verificación cruzada del Brand Guardian (`ai/04-director-creativo-y-brand-guardian.md`) sobre la versión final, como exige `CLAUDE.md` para cualquier pieza de marca antes de considerarse entregada.

## Regla de ejecución

Ninguna fase se ejecuta sin aprobación explícita — este roadmap es el mapa, no la autorización. Siguiendo el modo de dos etapas pedido: la Etapa 2 (Implementation) arranca ítem por ítem, priorizando Fase 01 primero por ser la de menor esfuerzo y mayor riesgo/impacto de negocio (especialmente el ítem 4, notificación de leads).
