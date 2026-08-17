Estado: CURRENT — primera versión formalizada, 2026-08-17 (Real Estate Intelligence OS). El criterio ya se venía aplicando de forma no escrita en `HERRERA-001/38-...md`
Fuente original: criterio aplicado por mí (Claude) en `HERRERA-001`, formalizado a pedido del prompt maestro Real Estate Intelligence OS (§15)
Dominio: INVESTMENT — METHODOLOGY

# Metodología: validación de precio contra mercado

## Qué resuelve

Dado un precio propuesto (de venta o de compra) para una unidad o un proyecto, ¿ese precio está alineado con lo que el mercado real está transando? Esta metodología estandariza el procedimiento que ya se usó, sin estar escrito como tal, en `HERRERA-001/38-comparacion-politicas-de-precio-650-vs-720.md`.

## Procedimiento (5 pasos, §15 del prompt maestro)

1. **Calcular el precio teórico** — el precio que da el modelo interno de Meridiano (costo + margen objetivo, o la política de precio ya definida para el proyecto).
2. **Buscar comparables** — aplicar `comparable-selection-engine.md` sobre `market-intelligence/comparables/` y las tablas de venta/alquiler correspondientes.
3. **Calcular el rango de mercado** — bajo/alto de los comparables filtrados, con outliers ya excluidos.
4. **Contrastar el precio teórico contra el rango de mercado.**
5. **Clasificar la posición del precio**, con las 4 categorías del prompt maestro:

| Categoría | Definición |
|---|---|
| **BELOW MARKET** | El precio propuesto está por debajo del rango de mercado — riesgo de estar regalando margen, o señal de que el proyecto tiene un problema no reflejado en el precio |
| **MARKET** | El precio propuesto cae dentro del rango de mercado observado |
| **ABOVE MARKET** | El precio propuesto está por encima del rango, pero dentro de una distancia justificable por diferenciación de producto |
| **SIGNIFICANTLY ABOVE MARKET** | El precio propuesto excede el rango de mercado en una magnitud que no se sostiene solo con diferenciación de producto — requiere revisión o justificación explícita y documentada |

**No hay todavía un umbral numérico único que separe ABOVE de SIGNIFICANTLY ABOVE** — el prompt maestro pide clasificar, no fija el corte, y este sistema tiene un solo caso real para calibrarlo. Criterio provisional aplicado en `HERRERA-001`: una diferencia de hasta ~10-15% sobre el techo del rango real, con una justificación de producto explícita (mejor fachada, mix de tipologías, terminaciones), se trató como ABOVE MARKET defendible; una diferencia mayor sin justificación específica pasaría a SIGNIFICANTLY ABOVE. Este umbral queda marcado como criterio propio, sujeto a ajuste con más casos.

## Output esperado de cada validación

Para que quede trazable y comparable entre proyectos, cada corrida de esta metodología debería reportar:

- Precio propuesto.
- Mercado bajo / mercado medio / mercado alto (del rango de comparables filtrados).
- Diferencia porcentual del precio propuesto contra cada extremo del rango.
- Nivel de confianza (según cuántos comparables entraron al rango y su categoría de dato).
- Clasificación final (una de las 4 categorías de arriba).

## Ejemplo aplicado — HERRERA-001 (`38-comparacion-politicas-de-precio-650-vs-720.md`)

| | Valor |
|---|---|
| Precio teórico (política vigente, Ángulo 2/3) | USD 1.900 – 2.050/m² |
| Rango de mercado (7 comparables Century 21, outlier excluido) | USD 1.576 – 1.809/m² |
| Diferencia vs. techo del rango real | +5% a +13% |
| Clasificación | **ABOVE MARKET**, justificado por diferenciación de producto — confirmado cuantitativamente al comparar los 4 escenarios de margen/ROI contra una política de precio+calidad más baja, ganando en los 4 por 6-12 puntos de ROI |

## Cómo se usa junto con el resto del sistema

Esta metodología es el paso posterior a `comparable-selection-engine.md` (que produce el rango de mercado) y alimenta directamente al futuro Skill de Sales Comparable Analysis / Investment Analysis (Fase 9). No reemplaza el criterio de negocio del founder — clasifica y cuantifica, la decisión final de mantener/ajustar el precio la toma el founder con esa información (mismo patrón que en `HERRERA-001/37-...md`: "no se ajusta la política de precios por cuenta propia — se deja la comparación completa y explícita para que el founder confirme").

## Referencias

- `comparable-selection-engine.md` — paso previo.
- `market-intelligence/comparables/00-comparables-venta-en-pozo-asuncion.md` — datos crudos.
- Aplicación real: `contracts/cases/HERRERA-001/37-...md`, `38-...md`.
