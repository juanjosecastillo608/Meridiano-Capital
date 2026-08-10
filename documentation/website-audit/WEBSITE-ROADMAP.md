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

## Batch de terminología (pre-Fase 03) ✅ COMPLETO (2026-08-10)

Pedido directo del founder antes de arrancar la Fase 03 formal — corrección de 7 términos/errores de copy, aplicados en simultáneo al sitio (`index.html`) y a la fuente de verdad de marca (`knowledge-base/brand/`). Registrado como **D-049** (cambios directos + oficiales) y **D-050** (los 3 términos donde el founder eligió entre 3 opciones presentadas):

1. ✅ "No mostramos departamentos" → **"No mostramos propiedades"** — modifica la Capa 2A oficial de `identidad-verbal.md` (hero H1, Manifiesto de marca).
2. ✅ "cédula" (suelta) → **"cédula de identidad paraguaya"** — hero lede, Pilar 02, Proceso paso 1, Servicios Unidad 02.
3. ✅ "cuenta" (suelta) → **"cuenta bancaria"** — hero lede, Pilar 02.
4. ✅ Error de redacción: "apertura bancaria" → **"apertura de cuenta bancaria"** — Proceso paso 2, Servicios Unidad 02.
5. ✅ Error en Unidad 04: "economics" → **"números claros"** (se mantiene "y reporte periódico").
6. ✅ Unidad 05, término poco claro "coordinación técnica de obra propia" → **"criterio técnico de construcción propio"** (elegido por el founder entre 3 opciones, D-050).
7. ✅ Campo de calculadora "Nivel de neto" (mal comprendido) → **"Profundidad del descuento"** (elegido por el founder entre 3 opciones, D-050; solo el label visible, sin tocar `id`/lógica).

**Extra, descubierto al ejecutar este batch**: el pie de firma del footer decía "Fundada por Juan José Castillo. Real Estate & Desarrollo..." — un título genérico que no correspondía a ninguna firma oficial de marca. Corregido a la firma institucional canónica de `brand/09-cierres-y-firmas.md` (D-039): "Juan José Castillo — Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay". Este hallazgo estaba señalado también en `BRAND-AUDIT.md` y quedó resuelto en el mismo movimiento.

## PHASE 03 — Typography & color ✅ COMPLETA (2026-08-10)

8. ✅ **Hecho** — Sistema tipográfico formalizado como 7 tokens nombrados en `:root` (`--font-display`, `--font-h2`, `--font-h3`, `--font-body-lg`, `--font-body`, `--font-body-sm`, `--font-caption`), aplicados en `.hero h1`, `.section-head h2`, `.pillar h3`/`.service-card h3`, `.lede`, `body`, `.service-card p`, `.eyebrow`. Dos valores del `DESIGN-SYSTEM.md` original no coincidían con el CSS real (`.lede` es 18px, no 17px — el 17px es un override deliberado de `.hero .lede`; `.pillar p` es 14.5px, no 14px) — se corrigieron los tokens contra el valor real y `DESIGN-SYSTEM.md` en vez de forzar un cambio visual; ambos overrides quedaron como literales documentados, no como token. **Cero cambios visuales.**
9. ✅ **Hecho** — `.tag`/`.split-badge`/`.eyebrow` unificados: nueva clase base `.label` (font-family + text-transform, lo único 100% compartido) agregada a los 14 elementos que usan estas 3 clases; cada selector conserva solo lo que realmente varía (tamaño, peso, letter-spacing, color, margen). Verificado visualmente — sin cambios.
10. ✅ **Hecho** — `<link rel="preload" as="font">` agregado para el archivo variable de Fraunces (peso 400-700 normal, subset latin — el usado por h1-h4 y `.brand .word`), con la URL real tomada de la respuesta de `fonts.googleapis.com`. Es una URL versionada (Google Fonts no publica una URL estable) — si Google rota la versión, el preload deja de acertar el archivo exacto pero no rompe nada, solo pierde el beneficio de performance hasta la próxima revisión.

## PHASE 04 — UX/UI ✅ COMPLETA (2026-08-10)

11. ✅ **Hecho** — Formulario de contacto segmentado: nuevo campo `<select id="f-tipo">` ("Inversión / Gestión de mi propiedad / Coinversión o desarrollo / Otra consulta", las 4 categorías elegidas por el founder), validado igual que los demás campos requeridos, persistido como `tipo_consulta` en `contactos.jsonl`. **Corrección 2026-08-10**: la cita "Perfil Profesional, sección 6.7" de la versión anterior de este ítem era incorrecta — no existe esa sección en ningún documento del repo (corregido también en `UX-AUDIT.md`, `GAP-ANALYSIS.md`, `WEBSITE-AUDIT.md`).
12. ✅ **Hecho** — Estructura i18n (ES/EN/PT) preparada sin traducir, alcance elegido explícitamente por el founder entre 3 opciones. Selector de idioma funcional en header desktop + panel mobile, loader JS (`data-i18n` + `en.json`/`pt.json`), ~25 elementos etiquetados (nav, hero eyebrow/lede/CTAs, 7 eyebrows de sección, footer). El español nunca se duplica — vive una sola vez en el HTML, es el fallback automático. `en.json`/`pt.json` son stubs vacíos: seleccionar EN/PT muestra una nota breve ("coming soon") y deja el sitio en español, nunca una traducción a medias o inventada. Detalle completo de alcance y cómo continuar en `production/app/frontend/i18n/README.md`.
13. ✅ **Hecho** — La calculadora pide email antes de mostrar el resultado (elegido por el founder sobre mantenerla abierta). Nuevo campo `c-email` (requerido, nativo HTML5), el backend lo extrae del body antes de llamar a `evaluar_renta()` (que no lo espera como parámetro) y lo guarda como lead en `backend/data/calculadora_leads.jsonl` vía `_guardar_lead_calculadora()`; la API sigue funcionando sin email para otros consumidores (CLI de `skills/rentabilidad-calculator/`). Ambos archivos de leads ahora comparten un campo `origen` para que el futuro CRM (D-048) distinga la fuente.
14. ✅ **Hecho** — Ritmo visual variado: nuevo token `--space-section-sm` (72px) vs. `--space-section` (108px, ya existente). Proceso y Aliados —las 2 secciones más livianas en contenido— usan el padding corto ("respiro"), intercaladas entre las secciones densas (Nosotros, Concepto, Servicios, Calculadora), tal como pedía el hallazgo de `UI-AUDIT.md`.

**Bug encontrado y corregido durante la implementación**: agregar el selector de idioma al header desbordaba el botón "Agendar consulta" fuera del viewport en el rango 881-1180px (verificado con medición real en navegador, no solo visual) — se angostó el propio nav en ese rango (gaps y tamaños de fuente reducidos) en vez de esconder el selector.

## PHASE 05 — Copywriting ✅ COMPLETA (2026-08-10)

15. ✅ **Hecho (D-052)** — Reescritura de "Proceso" con voz técnica, **ampliada a corrección de secuencia**: se encontró que la versión anterior decía "siempre en este orden" con cédula como paso 1, contradiciendo `business/02-camino-migratorio.md` (D-038) — la cédula es opcional/paralela, la vía real es S.A. sin cédula (Meridiano como representante legal y síndico, compra inmediata sin trámite migratorio). Founder eligió explícitamente corregir la secuencia, no solo el tono, entre 2 opciones presentadas. Nuevo orden: (1) Constitución de SA sin cédula, (2) Apertura de cuenta bancaria, (3) Cédula de identidad paraguaya (opcional, en paralelo), (4) Selección y cierre — última a propósito para conservar el círculo dorado de cierre del diseño existente.
16. ✅ **Hecho (2026-08-10, Fase 02)** — La narrativa de "16 años" ahora tiene evidencia concreta: bio del CEO + portfolio real (53/11/35/18) en "Quiénes somos".

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
