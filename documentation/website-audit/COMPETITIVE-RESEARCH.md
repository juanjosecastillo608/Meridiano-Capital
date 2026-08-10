```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Competitive Research

## Limitación de alcance — declarada explícitamente, no oculta

Este ciclo de auditoría **no incluyó visitas en vivo a sitios de competidores o referencias internacionales** (real estate premium, investment firms, wealth management, arquitectura, hospitality de lujo) — sería necesario un paso de research activo con herramientas de navegación web, que no se ejecutó en esta pasada para mantener el foco en auditar lo que ya existe primero (regla del brief, sección 04: "auditar antes de modificar"). Lo que sigue son **estándares de categoría conocidos de forma general**, no hallazgos verificados contra sitios específicos — se marcan como tal siguiendo la misma disciplina de `ai/07-protocolo-analista-de-inversion.md` (nunca presentar una estimación con la certeza de un dato confirmado).

Si se quiere una comparación competitiva real y verificada, el siguiente paso natural es una pasada de research dedicada (con navegación en vivo a 4-6 sitios de referencia elegidos por el founder) antes de fijar dirección de arte definitiva.

## Patrones generales de la categoría (conocimiento general, no verificado en esta ronda)

| Patrón de la categoría | Presente en Meridiano hoy |
|---|---|
| Fotografía editorial como vehículo principal de sofisticación (arquitectura, detalle de materiales, retratos del equipo en contexto real) | ❌ No — sitio 100% CSS/SVG |
| Tipografía serif de carácter para titulares + sans neutra para cuerpo | ✅ Sí — Fraunces/Poppins, ya resuelto |
| Narrativa de "por qué confiar" apoyada en cifras de portfolio real (unidades gestionadas, AUM, proyectos entregados) | 🟡 Parcial — "16 años" sí, cifras de portfolio no |
| Presencia visible de las personas detrás de la firma (founder, equipo) | ❌ No — una sola mención textual del fundador, sin foto ni bio |
| Micro-interacciones sutiles (hover states discretos, transiciones de 200-300ms) | ✅ Sí — ya implementado (`.service-card:hover`, `.btn-primary:hover`, transiciones de 0.2-0.35s) |
| Multilenguaje para audiencia internacional | ❌ No — el propio plan de contenido de Meridiano ya lo pide (ES/EN/PT) |
| Catálogo de oportunidades/portfolio navegable | ❌ No existe todavía |
| Formulario de contacto segmentado por intención | ❌ No — genérico hoy |

## Lectura estratégica (no una copia de ningún sitio específico)

El brief pide explícitamente "no copies, descubre estándares" (sección 29). El estándar más consistente en la categoría de real estate/investment premium es que **la confianza se construye mostrando activos reales y personas reales**, no solo describiendo el proceso. Meridiano ya tiene ambos insumos (portfolio de 53 unidades documentado, Perfil Profesional del CEO ya construido) — el gap no es de estrategia, es de qué contenido ya existente todavía no llegó al sitio.

## Veredicto

Esta sección queda marcada explícitamente como **la de menor confianza de todo el audit** (research general, no verificado en vivo) — no se le asigna peso propio en el Quality Score porque el brief no lo pondera dentro del rubro de 100 puntos; se incluye por completitud del set de 14 archivos pedido.
