```
Estado: AUDIT ONLY
Parte de: FINAL-AUDIT.md
```

# Knowledge Debt Register

Deuda de conocimiento = información incompleta que impide cerrar un componente. Clasificada por impacto real, no por cantidad — la regla del brief es explícita: **no convertir deuda LOW en prioridad.**

## CRITICAL — ninguna (0, actualizado 2026-08-10)

~~1. Pisos de rentabilidad: valores no recalibrados~~ — ✅ **RESUELTO** (D-044/D-045, 2026-08-10) — las 6 clases del motor tienen piso confirmado por el founder, `pasa_piso` ya es confiable.

~~2. IVA sobre renta de alquiler: el motor usa 5%, la política dice 10%~~ — ✅ **RESUELTO.** Ya estaba diferenciado (comercial 10% / residencial 5%) desde D-001/D-027 (2026-08-02); el hallazgo venía de documentación desactualizada, corregida el 2026-08-10.

## HIGH — ninguna (0, actualizado 2026-08-10)

~~3. Arquitectura de marca: "Castillo Real Estate & Desarrollo"~~ — ✅ **RESUELTO** (D-041/D-042).
~~4. Identidad de STAY WISE~~ — ✅ **RESUELTO** (D-043: = Urbannit; Meridiano Inmobiliaria = Meridiano Capital).
~~5. Matriz de pisos/techos por zona y calidad (P-004)~~ — pasa a MEDIUM: el founder decidió explícitamente dejarla **pendiente sin trabajo activo**, no es una deuda que bloquee nada — ver ítem 5 en MEDIUM.

## MEDIUM — mejora el sistema pero no bloquea

| # | Deuda |
|---|---|
| 6 | `marketing/02-presentaciones.md` sin actualizar (dice "Lora Bold") |
| 7 | Ownership ambiguo de `business/05-proyectos-inmobiliarios.md` entre BUSINESS y BRAND (U-009) |
| 8 | Sin condición de salida documentada para el Asesoramiento Mensual (USD 350/mes) cuando el inversor obtiene su cédula |
| 9 | Sin tabla de precio de cédula por nacionalidad (rango USD 2.200-2.500 "según nacionalidad", sin desglose) |
| 10 | Falta ángulo de **residencia fiscal** (distinto de residencia migratoria) como sección explícita del journey/marketing — gap señalado por el propio founder |
| 5 | Matriz de pisos/techos por zona y calidad (P-004) — **pendiente por decisión explícita del founder (2026-08-10), no por falta de trabajo**. No requiere acción hasta que llegue nuevo dato |
| 11 | Los 4 documentos "Paraguay vs. X" sin disclaimer RB-05 ni distinción bruto/neto antes de poder usarse como contenido publicado |

## LOW — información útil, no necesaria

| # | Deuda |
|---|---|
| 12-20 | Los campos `[COMPLETAR]` de duración/costo del journey de inversor (Etapas 1-4): tiempos de trámite, costos exactos, banco(s) de trabajo de Meridiano, monto mínimo de apertura bancaria — 9 campos en blanco, todos ya señalados explícitamente como gap conocido, ninguno bloquea una decisión hoy |
| 21 | Si el 50%-de-mes de colocación aplica en Cartera A además del 10% de administración, o si el 10% ya lo absorbe |
| 22 | Qué pasa si un mismo inversor participa de Modelo A y Modelo B a la vez (fees acumulados o negociados aparte) |
| 23 | Criterio de "calidad de edificio" para la futura matriz de pisos/techos (antigüedad, amenities, categoría) |
| 24 | Responsable operativo nombrado para la Etapa 2 (banco) del journey — sí está nombrado para las demás etapas |
| 25 | `connectors/`, `core/`, `memory/` — capas de la arquitectura de 10 capas sin poblar (placeholder), no bloqueante hasta que exista una necesidad concreta |

## Regla de aplicación

Solo los ítems 1-5 (CRITICAL + HIGH) están en el camino crítico de cierre de esta auditoría. El resto puede resolverse en el ritmo normal de operación del negocio, sin que eso signifique que el sistema está "incompleto" en un sentido que bloquee su uso.
