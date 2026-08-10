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
| Golden Circle (POR QUÉ → CÓMO → QUÉ) | 🟡 Parcial | El hero abre con la Capa 2A de identidad verbal ("No mostramos departamentos...") — correcto para hero/captación según `brand/02-identidad-verbal.md`, pero la sección "Nosotros" (que debería llevar el peso del POR QUÉ) es más corta que el resto de secciones y no incluye el Manifiesto ni la Misión/Visión completos |

## Hallazgo — el sitio no incluye al fundador/CEO

El footer dice "Fundada por Juan José Castillo" — una sola mención, sin foto, sin bio, sin ningún vínculo a su perfil profesional. Con D-041/D-042 (2026-08-10) ya resueltos y el documento `Meridiano_Perfil_Profesional_CEO.docx` ya construido con bios copy-ready, el sitio tiene contenido listo para usar que hoy no está aprovechando. Esto contradice directamente la sección 39 de este mismo brief ("mi experiencia de 16 años... debe convertirse en un activo de posicionamiento") — hoy esa experiencia es una frase suelta en el hero ("con la mirada técnica de 16 años"), no una narrativa desarrollada.

## Hallazgo — falta la sección "Nosotros" real (Quiénes Somos)

La sección `id="nosotros"` del sitio actual **no es una sección "Quiénes Somos"** — es la sección de los 4 Pilares del ADN de marca (correcta y bien ejecutada, pero es "en qué creemos", no "quiénes somos"). No hay biografía del CEO, no hay historia de la empresa, no hay mención del portfolio real (53 unidades / 11 edificios, ya documentado en `business/06-estructura-societaria-y-portfolio.md` y perfectamente comunicable sin violar la regla de invisibilidad societaria).

## Verificación contra las 9 preguntas de posicionamiento (sección 05 del brief)

| Pregunta | ¿La responde el sitio hoy? |
|---|---|
| ¿Quiénes somos? | 🟡 Parcial — el ADN está, la identidad humana (CEO) no |
| ¿Qué hacemos? | ✅ Sí — sección Servicios clara, 5 unidades bien explicadas |
| ¿Para quién? | ✅ Sí — "inversores de Europa, Argentina, Brasil y Chile" repetido consistentemente |
| ¿Por qué somos diferentes? | ✅ Sí — "no mostramos departamentos", técnica antes que venta |
| ¿Por qué confiar? | 🟡 Parcial — Red de Aliados está, pero sin prueba social (testimonios, casos reales) ni portfolio visible |
| ¿Qué experiencia tenemos? | 🟡 Parcial — "16 años" mencionado 2 veces, nunca desarrollado con evidencia (proyectos, cifras de portfolio) |
| ¿Qué resultado busca el inversor? | ✅ Sí — "10% rentabilidad neta anual objetivo" en el hero, con el disclaimer correcto en el resto del sitio (aunque el hero mismo no lleva el disclaimer de "cifras ilustrativas" junto al 10% — ver `CONTENT-AUDIT.md`) |
| ¿Qué pasa después de la compra? | ✅ Sí — sección de portafolio dual (renta tradicional/temporal) lo cubre bien |
| ¿Por qué Meridiano y no una inmobiliaria tradicional? | ✅ Sí — es el mensaje más fuerte y mejor ejecutado del sitio |

## Riesgo de marca — RN-04 en el espíritu, no en la letra

La calculadora de rentabilidad (sección `#calculadora`) es pública, sin ningún gate de calificación — cualquier visitante anónimo puede ver el motor de cálculo real y sus resultados de yield. `operations/03-tarifario.md` (RN-04) exige que el tarifario de honorarios se comparta solo en etapa avanzada — la calculadora no muestra honorarios explícitos, así que no viola la letra de la regla, pero sí expone un activo interno valioso (el motor de cálculo propietario) sin ninguna captura de lead previa. Es una decisión de producto a validar con el founder, no un error a corregir unilateralmente.

## Veredicto

**Score de marca: 13/15.** El sistema de marca en sí está impecablemente aplicado — el gap no es de ejecución de reglas existentes, es de **contenido faltante** (CEO, portfolio, prueba social) que ya existe en otros documentos del repo y solo falta trasladar.
