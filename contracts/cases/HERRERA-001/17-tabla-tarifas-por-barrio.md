Estado: CURRENT — primera carga de la tabla de tarifas por barrio (cross-cutting), con hallazgos aplicados a Herrera
Fuente original: founder, 2026-08-16 (plano de barrios de Asunción, adjunto) + primera búsqueda web
Dominio: INVESTMENT (caso HERRERA-001) — la tabla en sí es cross-cutting, ver `knowledge-base/investment/07-tarifas-por-barrio-asuncion.md` y D-066

# Tabla de tarifas por barrio — primera carga

## 0. Qué pidió el founder

*"Vamos a generar una planilla para cada barrio de Asunción detallada por tipología Monoambientes, 1, 2 y 3 Dormitorios, tarifas de AIRBNB por zona. Y también tarifas de alquileres tradicionales y amoblados. Esta tabla tiene que ser dinámica y actualizable. También tiene que estar siempre disponible para otros proyectos con datos actualizados por zona, tipología y valores de los alquileres."*

Se construyó como recurso **cross-cutting** (no específico de Herrera) — ver `knowledge-base/investment/07-tarifas-por-barrio-asuncion.md` para la documentación completa y `governance/decisions/DECISION_REGISTER.md`, **D-066**. Este archivo del caso solo recoge los hallazgos específicamente relevantes para Herrera de la primera carga.

## 1. Los 66 barrios de Asunción

Transcriptos del plano municipal aportado por el founder (imagen adjunta, 2026-08-16) — la lista completa está en el CSV/Excel de la tabla, no se repite acá.

## 2. Cobertura de la primera carga: 5 de 66 barrios, categoría C

Se priorizaron **Villa Morra, Luis A. de Herrera (Barrio Herrera), Las Lomas, Recoleta y Mburucuyá** — los barrios que el founder ya había nombrado como referencia de plusvalía en `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md` §2 (Eje Corporativo, Shopping del Sol, Las Lomas). Los 61 barrios restantes quedan en categoría D — **no se inventó ningún valor para completar la tabla artificialmente**.

## 3. Dato nuevo relevante para Herrera — 2 y 3 dormitorios, no relevados antes

`13-...md` §5 solo tenía dato real de monoambiente/1 dormitorio. Esta carga agrega:

| Zona | Tipología | Rango real (USD/mes, amoblado o según se indique) |
|---|---|---|
| Luis A. de Herrera | 2 dormitorios (sin amoblar) | desde USD 700 |
| Luis A. de Herrera | 3 dormitorios (amoblado) | USD 1.100 – 1.400 |
| Villa Morra | 2 dormitorios (amoblado) | USD 800 – 1.800 |
| Villa Morra | 3 dormitorios (amoblado) | USD 2.000 – 3.300 |
| Villa Morra | Monoambiente, Airbnb | USD 31 – 54/noche |

### 3.1 Comparación contra el piso de renta recalculado (`15-...md` §2)

| Tipología | Piso mensual (Ángulo 3, costo definitivo) | Renta real de mercado (Herrera/Villa Morra) | ¿Supera el piso? |
|---|---|---|---|
| 2 dormitorios (amoblado, piso 10%) | USD 1.103 – 1.120 | USD 700 (Herrera, sin amoblar) – 1.800 (Villa Morra, amoblado) | **Al límite** — Herrera sin amoblar no llega; Villa Morra amoblado sí, con margen |
| 3 dormitorios (amoblado, piso 10%) | USD 1.739 – 1.755 | USD 1.100 – 1.400 (Herrera) / 2.000 – 3.300 (Villa Morra) | **Herrera no llega; Villa Morra sí, con margen amplio** |

**Lectura**: para 3 dormitorios específicamente, la renta real de Barrio Herrera (USD 1.100–1.400) **queda por debajo** del piso de renta calculado (USD 1.739–1.755) — esto es un hallazgo relevante que no estaba visible antes de esta carga: **las unidades grandes (3 dormitorios) retenidas en Barrio Herrera, alquiladas tradicionalmente, no alcanzarían el piso de rentabilidad al valor de mercado actual de la zona** — el piso está calibrado para un desempeño mejor al que el mercado real de Herrera ofrece hoy para esa tipología específica. Villa Morra (zona más consolidada/premium, comparable pero no idéntica) sí lo supera. **Esto refuerza, con datos reales, lo que ya se venía sugiriendo desde `07-...md`: las unidades grandes son más fuertes candidatas para VENDER que para retener** — el margen de venta ya era mejor para esas unidades, y ahora también se confirma que su renta real de zona no cubre el piso esperado.

## 4. Qué queda pendiente

1. Completar los 61 barrios restantes — trabajo de investigación continuo, no de una sola carga (ver `knowledge-base/investment/07-...md` para el plan de cómo seguir completando).
2. Confirmar con cotizaciones directas de inmobiliarias (no solo listados web) para subir la categoría de C a A, al menos para Barrio Herrera específicamente, dado que es el caso activo.
3. Airbnb/temporal para Barrio Herrera específicamente — solo se relevó Villa Morra por ahora (USD 31–54/noche), no hay dato directo de Herrera todavía.
