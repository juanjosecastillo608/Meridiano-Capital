```
Estado: AUDIT ONLY
Parte de: FINAL-AUDIT.md
```

# Knowledge Debt Register

Deuda de conocimiento = información incompleta que impide cerrar un componente. Clasificada por impacto real, no por cantidad — la regla del brief es explícita: **no convertir deuda LOW en prioridad.**

## CRITICAL — impide avanzar

| # | Deuda | Bloquea | Dueño de la resolución |
|---|---|---|---|
| 1 | Pisos de rentabilidad: mecanismo ya corregido a BRUTO (D-033), pero los **valores** no se recalibraron — siguen siendo los mismos números pensados para comparación en neto | Cualquier veredicto `pasa_piso` confiable de la calculadora | Founder — planilla ya recibida 2026-08-10, pendiente de aplicar |

~~2. IVA sobre renta de alquiler: el motor usa 5%, la política dice 10%~~ — ✅ **RESUELTO.** Ya estaba diferenciado (comercial 10% / residencial 5%) desde D-001/D-027 (2026-08-02); el hallazgo venía de documentación desactualizada, corregida el 2026-08-10. Bajado a MEDIUM (ver abajo, ítem de renta temporal).

## HIGH — puede afectar una decisión importante

| # | Deuda | Afecta |
|---|---|---|
| 3 | Arquitectura de marca: ¿"Castillo Real Estate & Desarrollo" coexiste con Meridiano Capital? | Cualquier trabajo futuro de marca personal de JJC, y el propio Manual de Marca si hay que incorporar una segunda entidad |
| 4 | Identidad de STAY WISE / "empresa aliada 20+ años" / relación con Urbannit | Si Meridiano puede usar las dos propuestas de gestión de renta temporal recibidas como material operativo real, y cómo se comunica el circuito de renta temporal al inversor |
| 5 | Matriz de pisos/techos por zona y calidad (P-004) incompleta — falta la planilla "Alquileres Amoblados Tradicionales" y datos de zonas fuera de Eje Corporativo | Precisión de cualquier evaluación de renta fuera de la única zona con dato real |

## MEDIUM — mejora el sistema pero no bloquea

| # | Deuda |
|---|---|
| 6 | `marketing/02-presentaciones.md` sin actualizar (dice "Lora Bold") |
| 7 | Ownership ambiguo de `business/05-proyectos-inmobiliarios.md` entre BUSINESS y BRAND (U-009) |
| 8 | Sin condición de salida documentada para el Asesoramiento Mensual (USD 350/mes) cuando el inversor obtiene su cédula |
| 9 | Sin tabla de precio de cédula por nacionalidad (rango USD 2.200-2.500 "según nacionalidad", sin desglose) |
| 10 | Falta ángulo de **residencia fiscal** (distinto de residencia migratoria) como sección explícita del journey/marketing — gap señalado por el propio founder |
| 11 | Los 4 documentos "Paraguay vs. X" sin disclaimer RB-05 ni distinción bruto/neto antes de poder usarse como contenido publicado |
| 11b | Si la renta temporal/Airbnb debe tributar el 5% residencial (hoy, por defecto) o una tasa propia — sub-punto que sobrevive de la corrección del ítem CRITICAL #2 original |

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
