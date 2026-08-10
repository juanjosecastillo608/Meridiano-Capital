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
| Hero H1: ~~"No mostramos departamentos..."~~ → **"No mostramos propiedades: construimos, estructuramos y gestionamos tu inversión."** (D-049, 2026-08-10) | ✅ Sí | ✅ Sí — es el mensaje de marca de mayor fuerza de todo el sitio | ❌ No — frase única, imposible de confundir con un competidor genérico |
| Hero lede: "Ayudamos a inversores de Europa, Argentina, Brasil y Chile..." — actualizado a "cédula de identidad paraguaya y la cuenta bancaria" (D-049) | ✅ Sí | ✅ Sí | ❌ No — específico, con datos (16 años, cédula, cuenta bancaria) |
| Pilares (4 principios del ADN) | ✅ Sí | ✅ Sí | ❌ No — lenguaje propio, coherente con el Manifiesto de marca |
| ~~Sección Proceso — títulos de los 4 pasos ("Cédula paraguaya", "Apertura bancaria"...)~~ | ✅ **Resuelto 2026-08-10** (D-049) — "Cédula de identidad paraguaya", "Apertura de cuenta bancaria" (corrige un error de redacción señalado por el founder). Sigue siendo un bloque correcto pero genérico en tono — no bloqueante, no requiere más trabajo en este ciclo | — | — |
| Sección Servicios — las 5 unidades | ✅ Sí — Unidad 02 ("Cédula de identidad paraguaya, apertura de cuenta bancaria..."), Unidad 04 ("números claros", D-049/D-050) y Unidad 05 ("criterio técnico de construcción propio", D-050) corregidas 2026-08-10 | ✅ Sí | ❌ No — específico y bien diferenciado |
| Portafolio dual (renta tradicional/temporal) | ✅ Sí | ✅ Sí | ❌ No |
| ~~Red de Aliados — descripciones~~ | ✅ **Reescrita 2026-08-10** (Fase 02) | ✅ | Pasó de listado de tareas a lenguaje de acompañamiento ("Constituye la sociedad y revisa cada contrato antes de que lo firmes — sin sorpresas después.") |
| CTA final: "Hablemos de tu próxima inversión en Paraguay" | ✅ Sí | 🟡 Parcial | 🟡 Es un CTA correcto pero bastante estándar — cumple, no destaca |

## ~~Hallazgo — falta el "por qué 16 años importa", no solo la cifra~~

✅ **Resuelto 2026-08-10 (Fase 02).** La sección "Quiénes somos" ahora respalda los "16 años" con la bio del CEO y 4 cifras reales de portfolio (53 unidades / 11 edificios / 35 operativas / 18 en obra) — sin mencionar ninguna de las 6 S.A. (regla de invisibilidad, D-029).

## ~~Hallazgo — la cifra "10% rentabilidad neta anual objetivo" en el hero no lleva su disclaimer junto~~

✅ **Resuelto 2026-08-10 (Fase 01).** El hero ya lleva `<p class="hero-disclaimer">Cifra ilustrativa, no constituye garantía de rentabilidad.</p>` junto al stat "10%", cumpliendo RB-05 con el texto exacto de la regla.

## Frases prohibidas — verificación

Se revisó el sitio completo contra la lista de `brand/02-identidad-verbal.md` ("Somos los mejores del mercado", "Inversión 100% segura", superlativos vacíos, comparaciones directas con competidores). **Ninguna frase prohibida detectada.** El copy respeta bien el tono "seguro, no arrogante" en toda la página.

## Veredicto

**Score de Content original: 7/10** (auditoría inicial). Tras Fase 01 (disclaimer del 10%), Fase 02 (Quiénes Somos con bio/portfolio, Red de Aliados reescrita) y Fase 03 — terminología (D-049/D-050: "no mostramos propiedades", cédula de identidad paraguaya, cuenta bancaria, apertura de cuenta bancaria, Unidad 04/05, calculadora) — los tres hallazgos concretos de este documento están cerrados. No se re-puntúa formalmente sin una nueva pasada completa, pero no quedan pendientes abiertos de este audit.
