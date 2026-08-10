```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Content Audit

## Pasada 1 — gramática, ortografía, sintaxis

Revisado el texto completo del sitio (`index.html`, todo el contenido visible). **Sin errores ortográficos ni gramaticales.** Español correcto, tildes correctas, sin errores de concordancia. Consistente con la calidad editorial ya establecida en el resto del repo (`knowledge-base/` ya pasó por un proceso de depuración cuidadoso en sesiones anteriores).

**Un detalle de puntuación real**: en el CTA final ("Hablemos de tu próxima inversión en Paraguay") y en varios `<h3>` de servicios, se usa el guion largo (—) de forma consistente con la identidad verbal oficial — correcto, no requiere cambio.

## Pasada 2 — auditoría estratégica, bloque por bloque

Aplicando las 6 preguntas de la sección 8 del brief a cada bloque de copy relevante:

| Bloque | ¿Transmite autoridad? | ¿Diferencia? | ¿Podría ser de cualquier inmobiliaria? |
|---|---|---|---|
| Hero H1: "No mostramos departamentos: construimos, estructuramos y gestionamos tu inversión." | ✅ Sí | ✅ Sí — es el mensaje de marca de mayor fuerza de todo el sitio | ❌ No — frase única, imposible de confundir con un competidor genérico |
| Hero lede: "Ayudamos a inversores de Europa, Argentina, Brasil y Chile..." | ✅ Sí | ✅ Sí | ❌ No — específico, con datos (16 años, cédula, cuenta bancaria) |
| Pilares (4 principios del ADN) | ✅ Sí | ✅ Sí | ❌ No — lenguaje propio, coherente con el Manifiesto de marca |
| Sección Proceso — títulos de los 4 pasos ("Cédula paraguaya", "Apertura bancaria"...) | 🟡 Parcial | 🟡 Parcial | 🟡 **Podría pertenecer a cualquier consultora de radicación** — el texto es correcto pero genérico; no lleva la voz de "criterio técnico de construcción" que sí aparece en otras secciones |
| Sección Servicios — las 5 unidades | ✅ Sí | ✅ Sí | ❌ No — específico y bien diferenciado |
| Portafolio dual (renta tradicional/temporal) | ✅ Sí | ✅ Sí | ❌ No |
| ~~Red de Aliados — descripciones~~ | ✅ **Reescrita 2026-08-10** (Fase 02) | ✅ | Pasó de listado de tareas a lenguaje de acompañamiento ("Constituye la sociedad y revisa cada contrato antes de que lo firmes — sin sorpresas después.") |
| CTA final: "Hablemos de tu próxima inversión en Paraguay" | ✅ Sí | 🟡 Parcial | 🟡 Es un CTA correcto pero bastante estándar — cumple, no destaca |

## Hallazgo — falta el "por qué 16 años importa", no solo la cifra

El brief (sección 7) pide explícitamente convertir la experiencia en autoridad, no dejarla como frase promocional. El sitio menciona "16 años" tres veces (hero eyebrow implícito, hero lede, hero-foot stat) — siempre como número aislado, nunca como evidencia (un caso, un dato de portfolio, una cifra de unidades gestionadas). El repo ya tiene ese material (`business/06-estructura-societaria-y-portfolio.md`: 53 unidades, 11 edificios, portfolio real) y no está siendo usado en el sitio.

## Hallazgo — la cifra "10% rentabilidad neta anual objetivo" en el hero no lleva su disclaimer junto

`brand/09-cierres-y-firmas.md` (RB-05) exige: "toda cifra de retorno lleva la nota 'cifras ilustrativas, no constituyen garantía' visible en la misma pieza". En el hero-foot, el stat "10% — rentabilidad neta anual objetivo" no tiene ningún disclaimer visible cerca — la palabra "objetivo" sola cumple parcialmente la intención (no es una promesa absoluta) pero no es el texto de disclaimer que la regla especifica textualmente. Es el hallazgo de compliance de marca más concreto de todo este audit de contenido.

## Frases prohibidas — verificación

Se revisó el sitio completo contra la lista de `brand/02-identidad-verbal.md` ("Somos los mejores del mercado", "Inversión 100% segura", superlativos vacíos, comparaciones directas con competidores). **Ninguna frase prohibida detectada.** El copy respeta bien el tono "seguro, no arrogante" en toda la página.

## Veredicto

**Score de Content: 7/10.** La escritura es limpia y sin errores; el mensaje central (hero, servicios, portafolio) es fuerte y diferenciado. Pierde puntos en dos secciones concretas (Proceso, Aliados) que caen en tono genérico, y en un hallazgo de compliance puntual (disclaimer del 10%) — ambos correctos con ediciones específicas, no con una reescritura general.
