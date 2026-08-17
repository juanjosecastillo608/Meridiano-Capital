Estado: CURRENT — primera carga de la tabla de tarifas por barrio (cross-cutting), con hallazgos aplicados a Herrera
Fuente original: founder, 2026-08-16 (plano de barrios de Asunción, adjunto) + primera búsqueda web
Dominio: INVESTMENT (caso HERRERA-001) — la tabla en sí es cross-cutting, ver `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md` y D-066

# Tabla de tarifas por barrio — primera carga

## 0. Qué pidió el founder

*"Vamos a generar una planilla para cada barrio de Asunción detallada por tipología Monoambientes, 1, 2 y 3 Dormitorios, tarifas de AIRBNB por zona. Y también tarifas de alquileres tradicionales y amoblados. Esta tabla tiene que ser dinámica y actualizable. También tiene que estar siempre disponible para otros proyectos con datos actualizados por zona, tipología y valores de los alquileres."*

Se construyó como recurso **cross-cutting** (no específico de Herrera) — ver `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md` para la documentación completa y `governance/decisions/DECISION_REGISTER.md`, **D-066**. Este archivo del caso solo recoge los hallazgos específicamente relevantes para Herrera de la primera carga.

## 1. Los 66 barrios de Asunción

Transcriptos del plano municipal aportado por el founder (imagen adjunta, 2026-08-16) — la lista completa está en el CSV/Excel de la tabla, no se repite acá.

## 2. Cobertura: 8 de 66 barrios, categoría C (ampliado 2026-08-16)

Primera carga: **Villa Morra, Luis A. de Herrera (Barrio Herrera), Las Lomas, Recoleta y Mburucuyá** — los barrios que el founder ya había nombrado como referencia de plusvalía en `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md` §2 (Eje Corporativo, Shopping del Sol, Las Lomas). Segunda ronda, a pedido del founder ("vamos también a completar más barrios de la tabla, son datos importantes"): **Ycuá Satí** (zona vecina consolidada), **Vista Alegre** (referencia de zona más económica) y **Salvador del Mundo**. Los 58 barrios restantes quedan en categoría D — **no se inventó ningún valor para completar la tabla artificialmente**.

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

**Lectura**: para 3 dormitorios específicamente, la renta real de Barrio Herrera (USD 1.100–1.400) **queda por debajo** del piso de renta calculado con amoblado Básico/Estándar (USD 1.739–1.755).

**⚠️ Corregido en `20-reconsideracion-3-dormitorios-mix-de-producto.md`**: el founder señaló, con razón, que esta única comparación no alcanza para concluir "conviene vender toda la tipología" — hay que revisar el piso bajo **todas** las combinaciones de producto (tradicional sin amoblar, amoblado en sus 4 calidades, Airbnb/temporal) antes de una conclusión binaria. Con amoblamiento de mayor calidad o posicionamiento Airbnb, y comparado contra zonas premium cercanas (Recoleta, Mburucuyá), el panorama cambia — ver `20-...md` para el análisis completo y la propuesta de mix (retener una porción bajo posicionamiento premium, vender el resto), en vez de la conclusión "conviene venderla" que se afirmó acá.

## 4. Qué queda pendiente

1. Completar los 61 barrios restantes — trabajo de investigación continuo, no de una sola carga (ver `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md` para el plan de cómo seguir completando).
2. Confirmar con cotizaciones directas de inmobiliarias (no solo listados web) para subir la categoría de C a A, al menos para Barrio Herrera específicamente, dado que es el caso activo.
3. Airbnb/temporal para Barrio Herrera específicamente — solo se relevó Villa Morra por ahora (USD 31–54/noche), no hay dato directo de Herrera todavía.
