Estado: CURRENT — primera versión formalizada, 2026-08-17 (Real Estate Intelligence OS). El criterio ya se venía aplicando de forma no escrita desde `HERRERA-001/03-...md` y `37-...md`
Fuente original: criterio aplicado por mí (Claude) en `HERRERA-001`, formalizado a pedido del prompt maestro Real Estate Intelligence OS (§13)
Dominio: INVESTMENT — METHODOLOGY

# Metodología: selección de comparables de mercado

## Qué resuelve

Antes de usar un listado de otro proyecto como comparable de precio/mercado, hace falta un criterio explícito de qué tan comparable es realmente — comparar un monoambiente en pozo en Ycuá Satí contra un 3-dormitorio terminado en Carmelitas da un número, pero no un comparable válido. Esta metodología documenta el criterio que ya se aplicó (sin estar escrito) en `HERRERA-001/03-presupuesto-y-comparables.md` y `37-comparables-reales-de-venta-en-pozo-century21.md`.

## Los 7 factores evaluados (§13 del prompt maestro)

| Factor | Qué se mira | Peso relativo (criterio, no fórmula cerrada) |
|---|---|---|
| **Ubicación** | Mismo barrio > barrio vecino inmediato de perfil similar > mismo distrito > otro distrito | Alto — el factor más determinante |
| **Distancia** | Cuadras/km al proyecto evaluado, cuando aplica | Medio |
| **Superficie** | m² de la unidad comparable vs. la tipología evaluada | Alto — comparar m²/precio entre unidades de tamaño muy distinto distorsiona el USD/m² |
| **Tipología** | Monoambiente/1/2/3 dormitorios — comparar como con como | Alto |
| **Antigüedad/etapa constructiva** | Pozo vs. en obra vs. terminado vs. terminado-generando-renta (D-073) — no mezclar etapas sin ajustar | Alto |
| **Calidad** | Básica/Estándar/Estándar+DVH cuando se puede inferir — hoy casi nunca disponible en listados públicos (ver limitación abajo) | Medio, limitado por disponibilidad de dato |
| **Amenities/cochera** | Presencia y precio de cochera, amenities del edificio | Bajo-medio — ajusta el precio pero no descalifica un comparable |
| **Estado** | Vigente vs. histórico/vendido | Alto — un listado ya no vigente es referencia histórica, no de mercado actual |
| **Fecha** | Qué tan reciente es el relevamiento | Alto — un comparable de hace 2 años no representa el mercado actual sin ajuste por inflación/tendencia |

## Procedimiento

1. **Filtrar por ubicación y tipología** — descartar cualquier comparable de otro barrio sin perfil equivalente, o de tipología distinta a la que se está evaluando.
2. **Filtrar por etapa constructiva** — comparar pozo contra pozo, terminado contra terminado. Si no hay suficientes comparables en la misma etapa, se puede usar otra etapa **con el ajuste explícito documentado** (nunca sin avisar).
3. **Marcar outliers** — un comparable con USD/m² muy fuera del resto del grupo (p. ej. el 3-dormitorio de piso alto de Ventura Ycuá Satí en `market-intelligence/comparables/`, USD 2.212/m² vs. un grupo de USD 1.576-1.809/m²) se excluye del rango de referencia, pero se documenta igual — no se borra, se anota como outlier con la razón (tipología premium, piso alto, etc.).
4. **Calcular el rango de referencia** — bajo/alto del grupo filtrado, sin promediar a un solo número cuando el rango en sí es información útil (un rango angosto sugiere mercado más predecible que uno amplio).
5. **Declarar la categoría de dato y confianza** — cada comparable usado hereda su categoría A/B/C/D y su nivel de fuente (`market-intelligence/sources/SOURCE_REGISTRY.md`).

## Comparable Score — todavía no formalizado como número único

El prompt maestro (§13) pide un score numérico por comparable. **No se construyó todavía** — con un solo caso real (`HERRERA-001`) no hay base para calibrar los pesos relativos de los 7 factores de forma confiable; un score con pesos inventados sería peor que el criterio cualitativo actual (violaría la regla de no-invención del propio sistema). Se deja como paso siguiente cuando haya 2-3 casos reales más para calibrar contra resultados conocidos (p. ej. contra el precio de cierre real de una venta, cuando esté disponible).

## Ejemplo aplicado

`HERRERA-001/37-comparables-reales-de-venta-en-pozo-century21.md`: de 13 links aportados por el founder, se relevaron 7 proyectos únicos (6 eran duplicados del mismo proyecto con distinto ID de listado — filtrados por el factor "estado/vigencia"); de esos 7, uno (3-dormitorio piso alto de Ventura) se marcó como outlier y se excluyó del rango de referencia por tipología premium — ver `market-intelligence/comparables/00-comparables-venta-en-pozo-asuncion.md`.

## Referencias

- `market-intelligence/comparables/00-comparables-venta-en-pozo-asuncion.md` — datos crudos donde se aplica este criterio.
- `market-intelligence/sources/SOURCE_REGISTRY.md` — niveles de confiabilidad de fuente.
- `market-price-validation-engine.md` — el paso siguiente, qué se hace con el rango de referencia una vez calculado.
