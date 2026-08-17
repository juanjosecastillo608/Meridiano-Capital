Estado: CURRENT — separada de la tabla de alquiler tradicional el 2026-08-17 (Real Estate Intelligence OS, ver `documentation/real-estate-os/00-auditoria-inventario-arquitectura-propuesta.md`)
Fuente original: extraído de `market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md` (D-066), primera carga founder 2026-08-16
Dominio: INVESTMENT

# Airbnb / renta temporal por barrio de Asunción

## Por qué esta base es distinta de la de alquiler tradicional

El prompt maestro del Real Estate Intelligence OS es explícito: *"No mezclar directamente Airbnb con alquiler tradicional. Son mercados diferentes."* Hasta el 2026-08-17 las 272 filas de Airbnb/temporal vivían mezcladas en formato largo dentro de `market-intelligence/rentals/data/tarifas-alquiler-por-barrio-asuncion.csv` (D-066), junto a las filas de alquiler tradicional y amoblado. Se separaron a su propia base — mismo origen de dato (búsqueda web de primer corte, 2026-08-16), mismas categorías A/B/C/D, pero en su propio archivo porque el mercado de renta temporal tiene una dinámica y variables propias que el tradicional no tiene (ocupación, estacionalidad, tarifa por noche vs. por mes).

## Dónde está el dato

| Archivo | Contenido |
|---|---|
| `data/tarifas-airbnb-por-barrio-asuncion.csv` | Fuente de verdad, versionada en git — mismo formato largo (Barrio × Tipología) que la tabla de alquiler tradicional, con 7 columnas adicionales específicas de renta temporal |

## Columnas propias de esta tabla (no existen en la de alquiler tradicional)

| Columna | Contenido | Cobertura actual |
|---|---|---|
| Capacidad (huéspedes) | Cuántas personas aloja la unidad | D — sin dato, 0/272 filas |
| Tarifa semanal (USD) | Precio por semana, cuando difiere de 7× la tarifa diaria | D — sin dato |
| Ocupación estimada (%) | % de noches ocupadas al año — **no confundir con la ocupación de 55-65% ya usada en `calculadora.py` (D-046)**, que es un supuesto de modelo, no un dato de mercado por barrio | D — sin dato |
| Ingreso bruto mensual estimado (USD) | Tarifa × ocupación × 30 | D — sin dato |
| Costos operativos estimados (USD/mes) | Limpieza, comisión de plataforma, mantenimiento | D — sin dato |
| Ingreso neto estimado (USD/mes) | Bruto − costos | D — sin dato |

También trae, igual que el resto de las tablas de `market-intelligence/`, las columnas **Confianza** (HIGH/MEDIUM/LOW, §31 del prompt maestro) y **Vigencia** (CURRENT/AGING/OUTDATED/HISTORICAL, §19), derivadas mecánicamente de la categoría de dato A/B/C/D — ver `../sources/SOURCE_REGISTRY.md`.

**Se agregaron las columnas con la estructura lista pero vacía, no con valores inventados** — ninguna de las 272 filas heredadas de la primera carga (D-066) traía esta información, porque nunca se relevó a ese nivel de detalle. El día que se releven tarifas de Airbnb reales de un barrio (mismo método que `contracts/cases/HERRERA-001/32-airbnb-real-de-barrio-herrera.md`, que sí trae capacidad/tarifa/ocupación real de 4 comparables), esos datos entran acá con categoría A y confianza asignada.

## Relación con la ocupación real ya usada en el motor financiero

`production/app/backend/calculadora.py` ya descuenta una ocupación real (55-65%, 60% por defecto, D-046/D-003) al calcular el yield neto de `temporal_departamento`/`temporal_casa` — ese es un **supuesto de modelo**, aplicado igual en cualquier zona. La columna "Ocupación estimada (%)" de esta tabla, cuando se releve, sería un dato de **mercado por barrio específico** — más preciso que el supuesto genérico, pero no lo reemplaza automáticamente: hace falta relevar barrio por barrio antes de que valga más que el supuesto de 60%.

## Uso previsto

- Fijar el piso de renta temporal de una unidad retenida con datos reales de la zona, en vez del supuesto genérico de ocupación.
- Insumo directo para el futuro **Skill de Airbnb / Temporary Rental Analysis** (Fase 9).
- Contrastar contra `contracts/cases/HERRERA-001/32-airbnb-real-de-barrio-herrera.md`, que ya tiene 4 comparables reales de Barrio Herrera con capacidad/tarifa/ocupación — pendiente de promover esos 4 registros reales a esta tabla (ver `comparables/`, mismo patrón que se aplicó con los comparables de venta Century 21).

## Cómo se sigue completando

1. Relevar tarifas reales de Airbnb por barrio (plataforma Airbnb/Booking directamente, no solo agregadores) — mismo criterio de honestidad que D-066: no completar los 68 barrios con valores inventados.
2. Promover los 4 comparables reales de Barrio Herrera (`HERRERA-001/32-...md`) a esta tabla con categoría A.
3. Cuando P-006 (agente de IA de inteligencia de mercado en tiempo real) se construya, esta es la tabla que alimentaría con datos de grupos de WhatsApp con consentimiento confirmado.
