```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Brand Audit

## Cumplimiento del sistema de marca oficial (verificado línea por línea contra `knowledge-base/brand/`)

| Elemento | Estado | Evidencia |
|---|---|---|
| Isotipo "partido por el meridiano" (D-034) | ✅ Correcto | `<symbol id="mojon">` en el SVG inline, usado en nav, hero y footer |
| Isotipo Urbannit "cerradura" (D-035) | ✅ Correcto | `<symbol id="keyhole">` en la sección de portafolio dual |
| Tipografía Fraunces/Poppins (D-036) | ✅ Correcto | Google Fonts cargado con los pesos correctos; `font-variation-settings` con `opsz 80, SOFT 24` tal como especifica `brand/04-tipografia.md` |
| Paleta oficial | ✅ Correcto | Los 14 custom properties de color (`--navy`, `--tierra`, `--gold`, `--kaa`, etc.) coinciden con los HEX de `brand/05-sistema-cromatico.md` |
| Regla de invisibilidad Capa 1 (D-029) | ✅ Correcto | Ningún RUC, ninguna de las 6 S.A. aparece en el sitio — solo "Meridiano Capital" |
| Endorsed Brand de Urbannit (D-019/D-035) | ✅ Correcto | El footer dice explícitamente "Urbannit es una marca gestionada por Meridiano Capital"; la sección de portafolio dual también lo refuerza |
| Origen de clientes "Europa, Argentina, Brasil, Chile" (RB-07) | ✅ Correcto | Coincide textualmente en el hero |
| Golden Circle (POR QUÉ → CÓMO → QUÉ) | 🟡 Parcial | El hero abre con la Capa 2A de identidad verbal (~~"No mostramos departamentos..."~~ → "No mostramos propiedades...", D-049, 2026-08-10) — correcto para hero/captación según `brand/02-identidad-verbal.md`; la sección "Nosotros" (que debería llevar el peso del POR QUÉ) sigue sin el Manifiesto ni la Misión/Visión completos, pero ya incluye bio del CEO y portfolio real (ver hallazgo siguiente, resuelto en Fase 02) |

## ~~Hallazgo — el sitio no incluye al fundador/CEO~~

✅ **Resuelto 2026-08-10 (Fase 02).** La sección "Quiénes somos" ahora incluye bio del CEO (monograma "JJC", 16 años de trayectoria, formación técnica) con el título canónico "CEO · Meridiano Capital" (D-042). El footer, por su parte, usaba "Fundada por Juan José Castillo" — un título genérico que no correspondía a ninguna de las dos firmas oficiales de marca; corregido 2026-08-10 (D-049/D-050) a "Juan José Castillo — Operador Técnico y Legal de Inversiones Inmobiliarias · Asunción, Paraguay" (el título de firma institucional de `brand/09-cierres-y-firmas.md`, D-039, correcto para un contexto de cierre/pie de página — distinto del "CEO" usado en la bio de "Quiénes somos", D-042).

## ~~Hallazgo — falta la sección "Nosotros" real (Quiénes Somos)~~

✅ **Resuelto 2026-08-10 (Fase 02).** La sección `id="nosotros"` ahora abre con bio real del CEO y 4 cifras de portfolio (53 unidades / 11 edificios / 35 operativas / 18 en obra), sin violar la regla de invisibilidad societaria (D-029) — ninguna de las 6 S.A. se menciona. Los 4 Pilares del ADN de marca (contenido original de esta sección) se preservaron íntegros, movidos a la nueva sección `id="concepto"`.

## Verificación contra las 9 preguntas de posicionamiento (sección 05 del brief)

| Pregunta | ¿La responde el sitio hoy? |
|---|---|
| ¿Quiénes somos? | ✅ **Resuelto Fase 02** — bio del CEO + portfolio real en "Quiénes somos" (antes: 🟡 solo el ADN, sin identidad humana) |
| ¿Qué hacemos? | ✅ Sí — sección Servicios clara, 5 unidades bien explicadas |
| ¿Para quién? | ✅ Sí — "inversores de Europa, Argentina, Brasil y Chile" repetido consistentemente |
| ¿Por qué somos diferentes? | ✅ Sí — "no mostramos propiedades" (D-049), técnica antes que venta |
| ¿Por qué confiar? | ✅ **Mejorado Fase 02** — Red de Aliados con descripciones reescritas + 4 cifras de portfolio visibles (53/11/35/18); sigue sin testimonios/casos reales (fuera de alcance sin material fuente) |
| ¿Qué experiencia tenemos? | ✅ **Mejorado Fase 02** — "16 años" ahora respaldado por la bio del CEO y el portfolio real, no solo la frase suelta del hero |
| ¿Qué resultado busca el inversor? | ✅ **Resuelto Fase 01** — el hero ya lleva `<p class="hero-disclaimer">` junto al stat "10%" ("Cifra ilustrativa, no constituye garantía de rentabilidad") |
| ¿Qué pasa después de la compra? | ✅ Sí — sección de portafolio dual (renta tradicional/temporal) lo cubre bien |
| ¿Por qué Meridiano y no una inmobiliaria tradicional? | ✅ Sí — es el mensaje más fuerte y mejor ejecutado del sitio |

## Riesgo de marca — RN-04 en el espíritu, no en la letra

La calculadora de rentabilidad (sección `#calculadora`) es pública, sin ningún gate de calificación — cualquier visitante anónimo puede ver el motor de cálculo real y sus resultados de yield. `operations/03-tarifario.md` (RN-04) exige que el tarifario de honorarios se comparta solo en etapa avanzada — la calculadora no muestra honorarios explícitos, así que no viola la letra de la regla, pero sí expone un activo interno valioso (el motor de cálculo propietario) sin ninguna captura de lead previa. Es una decisión de producto a validar con el founder, no un error a corregir unilateralmente.

## Veredicto

**Score de marca: 13/15.** El sistema de marca en sí está impecablemente aplicado — el gap no es de ejecución de reglas existentes, es de **contenido faltante** (CEO, portfolio, prueba social) que ya existe en otros documentos del repo y solo falta trasladar.
