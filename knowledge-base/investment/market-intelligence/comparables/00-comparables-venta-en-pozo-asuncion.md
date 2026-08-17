Estado: CURRENT — promovido desde `contracts/cases/HERRERA-001/37-comparables-reales-de-venta-en-pozo-century21.md` el 2026-08-17 (Real Estate Intelligence OS)
Fuente original: 13 links de Century 21 aportados por el founder, 2026-08-17; relevados vía Browser (7 proyectos únicos, 6 duplicados descartados)
Dominio: INVESTMENT

# Comparables reales de venta en pozo — Asunción

## Qué es esto y por qué existe como base propia

`contracts/cases/HERRERA-001/37-...md` releva 7 comparables reales de Century 21 (Inarco Herrera, Sunset/Ayre/Livit/Marina/Ventura Santa Teresa/Ycuá Satí, Matrisa Lillo) para verificar la política de precios de venta de ese caso puntual. Cada comparable trae **atributos completos** — no solo USD/m², sino condiciones de financiamiento durante obra, precio de cochera, etapa de entrega — que son Market Intelligence genuina, reutilizable por cualquier proyecto futuro en esas zonas, no solo por `HERRERA-001`. Hasta el 2026-08-17 solo una versión reducida (sin financiamiento/cochera) había llegado a la tabla cross-cutting de venta (`market-intelligence/sales/10-...md`, D-073) — este archivo promueve el detalle completo como activo de mercado de primer nivel, cerrando ese hueco de separación.

**El caso `HERRERA-001/37-...md` sigue existiendo tal cual** — ahora funciona como el registro narrativo de cómo y por qué se usaron estos comparables en la negociación de Herrera específicamente (la tensión con la política de precios, resuelta en `38-comparacion-politicas-de-precio-650-vs-720.md`), mientras que este archivo es la fuente de verdad reutilizable del dato crudo.

## Dónde está el dato

| Archivo | Contenido |
|---|---|
| `data/comparables-venta-en-pozo-asuncion.csv` | Fuente de verdad — 12 filas: 7 proyectos con m²/precio/USD por m² confirmados + 4 filas de Matrisa Lillo (precio "desde" por tipología, sin m² exacto) + 1 fila del 3-dormitorio outlier de Ventura |

## Estructura de los datos

| Columna | Contenido |
|---|---|
| Proyecto | Nombre comercial del desarrollo |
| Zona/Barrio | Barrio de Asunción, con referencia de ubicación cuando la fuente la da |
| Tipología | Monoambiente / 1-2-3 dormitorios / sin especificar |
| m² | Superficie de la unidad — vacío cuando la fuente solo da precio "desde" sin m² por unidad |
| Precio USD | Precio de lista |
| USD por m² | Precio ÷ m² — vacío cuando no hay m² confirmado |
| Cochera USD | Precio de cochera, cuando la fuente lo separa del precio de la unidad |
| Financiamiento durante obra | Condiciones de pago publicadas |
| Entrega/Etapa | Etapa constructiva y fecha de entrega, cuando está disponible |
| Categoría de dato | A/B/C/D — todas las filas son **A** (fuente real citable, listado comercial vigente al momento del relevamiento) |
| Fuente | Century 21 |
| Fecha de relevamiento | 2026-08-17 |
| Notas | Contexto — outliers, precios "desde" sin m² exacto |

## Rango de referencia (uso ya validado en HERRERA-001)

**USD 1.576 – 1.809/m²**, excluyendo el 3-dormitorio de piso alto de Ventura (USD 2.212/m², outlier de tipología premium). Este rango fue el que se usó en `HERRERA-001/38-comparacion-politicas-de-precio-650-vs-720.md` para validar cuantitativamente que la política de precio premium (USD 1.900-2.050/m²) sigue siendo superior incluso comparada contra el escenario de precio bajo alineado a este rango real.

**Dato especialmente relevante — Inarco Herrera es el único comparable dentro del propio Barrio Herrera** (los otros 6 son de Ycuá Satí, zona vecina). Cuando se evalúe un proyecto nuevo en Barrio Herrera, este es el comparable de mayor peso.

## Comparable Selection — criterio aplicado (primera versión, no formalizada aún como score)

Los 7 proyectos se seleccionaron/filtraron por: (1) estar en pozo o en obra, no terminados — para comparar contra un desarrollo también en pozo; (2) zona — Barrio Herrera o barrios vecinos inmediatos (Ycuá Satí); (3) vigencia — listados activos al momento del relevamiento, no históricos. No hay todavía un **Comparable Score** numérico (§13 del prompt maestro Real Estate Intelligence OS) — la metodología completa de selección/scoring queda pendiente en `knowledge-base/investment/methodologies/comparable-selection-engine.md`.

## Cómo se sigue completando

1. Relevar comparables de otros barrios a medida que se analicen proyectos nuevos en esas zonas (mismo método: Century 21, RE/MAX, InfoCasas).
2. Agregar comparables de proyectos **terminados y generando renta** — la etapa nueva que pidió el founder en D-073, todavía sin datos en ninguna base.
3. Formalizar el Comparable Score una vez que haya más de un análisis real usándolo (por ahora, un solo caso — HERRERA-001 — no alcanza para calibrar pesos de un score).

## Uso previsto

- Insumo directo del futuro **Skill de Sales Comparable Analysis / Market Price Validation Engine** (Fase 9).
- Referencia de condiciones de financiamiento reales (no solo precio) para diseñar el esquema de pago de un proyecto nuevo — ya usado así en `HERRERA-001/19-esquema-de-financiamiento-de-compradores.md` (D-067) para validar que el 20/70/10 y la variante 40/50/10 están dentro de lo que el mercado ofrece.
