Estado: CURRENT — 20 registros (ampliado 2026-08-18 con 4 comparables reales de RE/MAX y Century 21, incluido el primer dato de la etapa "Terminado")
Fuente original: founder, 2026-08-17 — comparables Century 21 + Filum Herrera ya relevados en el caso HERRERA-001
Dominio: INVESTMENT

# Valor de m² de venta por barrio, calidad constructiva y etapa

## Qué es y en qué se distingue de la tabla de alquileres (D-066)

*"Todos estos datos debemos recopilar la información y construir nuestras tablas de valor del m² según barrio y el tipo de construcción, como así también diferenciar los valores del m² de construcción según la etapa constructiva y/o si el edificio ya se encuentra terminado y generando renta, para evaluar el valor del m² en esa etapa."*

Tabla cross-cutting nueva, **de venta** (no de alquiler) — complementa `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md` (D-066, que es de renta), no la reemplaza. Desagregada por:

| Dimensión | Valores |
|---|---|
| Barrio | Los 68 barrios oficiales de Asunción (ver `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md`) |
| Tipología | Monoambiente / 1 dormitorio / 2 dormitorios / 3 dormitorios |
| **Etapa constructiva** | Pre-lanzamiento / Pozo / En obra / **Terminado (generando renta)** |
| **Calidad constructiva** | Básica (USD 650/m²) / Estándar (USD 720/m²) / Estándar+DVH (USD 750/m²) — mismas categorías de `knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md` |

**La etapa "Terminado, generando renta" es una categoría nueva, sin equivalente en las etapas ya usadas del caso (pozo/durante obra/terminado)** — representa el valor de reventa de una unidad que ya tiene historial de renta (activo generando ingresos), que puede diferir del valor de una unidad recién entregada sin historial. **Todavía no hay datos cargados en esta etapa específica** — los 16 registros de la primera carga son de pozo/en obra/terminado sin historial de renta.

## Dónde está el dato

| Archivo | Contenido |
|---|---|
| `data/valor-m2-venta-por-barrio-calidad-etapa.csv` | Fuente de verdad, versionada en git |

## Cobertura actual (2026-08-18)

**20 registros, categoría A** (todos con fuente real citada: 7 comparables de Century 21 + 4 unidades de Filum Herrera + 5 precios "desde" de proyectos de C21 + 4 nuevos de RE/MAX/Century 21 — Invicta Herrera ×2, Pampidos, Forvm Herrera) — cubren **2 barrios** (Luis A. de Herrera, Ycuá Satí) y **ninguno tiene la calidad constructiva identificada** (los listados comerciales no publican el costo de construcción del desarrollador, solo el precio final) — la columna "Calidad constructiva" queda en "Sin dato específico" en toda la carga. **No se inventó ningún valor de calidad para completar esa columna.**

**Novedad 2026-08-18**: Pampidos aporta el primer dato real de la etapa "Terminado" (a estrenar) del caso — hasta ahora todos los registros eran pozo/en obra. Ver `contracts/cases/HERRERA-001/45-amc-terreno-y-nuevos-comparables-herrera.md` §1 para el análisis completo, incluido el ajuste AMC aplicado.

## Cómo se sigue completando

1. Relevar más barrios (mismo método que D-066 — búsqueda de listados de portales inmobiliarios como Century 21, InfoCasas).
2. Para la calidad constructiva: solo se puede confirmar con información directa del desarrollador (no está en los listados públicos) — o inferirse de forma aproximada comparando el precio de venta contra el costo de construcción típico de la zona, con la salvedad de que es una inferencia, no un dato confirmado.
3. **Relevar la etapa "Terminado, generando renta"** — necesita datos de reventa de unidades ya operando (no solo unidades nuevas en pozo/obra/entrega), un tipo de dato distinto al que se viene relevando hasta ahora en el caso.

## Uso previsto

- **Verificar la política de precios de venta** de cualquier proyecto nuevo (uso ya aplicado en `contracts/cases/HERRERA-001/37-...md` y `38-...md`) contra comparables reales del mercado, segmentados por la calidad de construcción que realmente sostiene cada rango de precio.
- **Comparar políticas de precio-calidad** (ver `38-comparacion-politicas-de-precio-650-vs-720.md` del caso HERRERA-001, primer uso real de esta comparación).
