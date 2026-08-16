Estado: CURRENT — esquema de financiamiento de compradores durante obra (cuotas decrecientes según mes de compra), estandarizado
Fuente original: instrucciones del founder, 2026-08-16
Dominio: INVESTMENT (caso HERRERA-001) — este esquema es cross-cutting, ver `governance/decisions/DECISION_REGISTER.md`, D-067
Incorporado: 2026-08-16

# Esquema de financiamiento de compradores — cuotas decrecientes según mes de compra

## 1. La regla, en palabras del founder

*"Los departamentos tendrán financiación durante obra que será de 12 meses, con una entrega del 20%, el 70% restante en 12 cuotas los que compran en el mes 1, y así vamos restando cuotas de acuerdo en qué mes de obra compra. Ejemplo: el que compra en el mes 6 tiene solo 6 cuotas de financiación. Este esquema de pagos lo vamos a dejar estandarizado para tomar en otros proyectos. Lo mismo con las cuotas, el máximo de cuotas es el plazo de obra. Y el mes que compra marca el inicio de la cuota, y solo tiene plazo de cuotas hasta el último mes de obra."*

Confirmado explícitamente como **cross-cutting** ("este esquema de pagos lo vamos a dejar estandarizado para tomar en otros proyectos") — se registra como **D-067** en `governance/decisions/DECISION_REGISTER.md`, no solo en este caso.

## 2. Estructura de cobro por unidad — completa, 20/70/10 (categoría A, confirmado 2026-08-16)

*"El esquema es 20/70/10. Esto es 20% a la firma del boleto, 70% se financia durante obra (criterio de cuota decreciente según el mes de obra) y 10% se paga contra la entrega del departamento, no contra escritura. La escritura, al ser departamentos en construcción, tarda aproximadamente unos 6-8 meses más luego de terminada la obra."*

| Componente | % | Momento |
|---|---|---|
| Entrega inicial | 20% | Firma del boleto |
| Cuotas durante obra | 70% | Mensuales, cantidad decreciente según el mes de compra (sección 3) |
| Saldo final | **10%** | **Contra la entrega física del departamento — no contra la escritura** |
| **Suma** | **100%** | |

**Cierra el punto que había quedado abierto** (20%+70%=90%, sin el 10% restante) — el 10% final se cobra en la **entrega**, un hito distinto y anterior a la escritura. La **escritura** llega aparte, ~6-8 meses después de terminada la obra (departamentos en construcción/pozo) — no condiciona el cobro del 10% final, que ya se hace efectivo en la entrega.

**Confirmado como norma estándar**: *"Todos estos datos aplican para la mayoría de los departamentos en construcción, lo vamos a dejar como norma, y se aclara en el momento de la venta."* — consistente con el registro ya hecho como D-067 (cross-cutting).

## 3. Cuotas decrecientes según mes de compra — resuelto (2026-08-16)

*"Tenemos un problema de explicación. Si la obra dura 12 meses y la venta se realiza en el mes 1, tiene 11 cuotas — porque la entrega del 20% se realiza el mes 1. La primera cuota la paga en el mes 2, y así sucesivamente hasta el mes 12, que paga la última cuota. Si el edificio está en tiempo de obra y se entrega en plazo, al mes siguiente se entrega el departamento y paga el 10% restante, donde cancela el 100% del departamento."*

El founder aclaró que la afirmación inicial ("12 cuotas comprando en el mes 1") fue un error de explicación — **la fórmula correcta es la que ya coincidía con el ejemplo puntual del mes 6**:

> **Cuotas = plazo de obra − mes de compra.** La primera cuota se paga el mes siguiente al de la compra (el mes de compra en sí solo paga el 20% de entrega), y la última cuota cae siempre en el último mes de obra — nunca se extiende el financiamiento más allá de ese mes.

| Mes de compra | Cuotas (plazo 12 meses) | Primera cuota | Última cuota |
|---|---|---|---|
| 1 | 11 | Mes 2 | Mes 12 |
| 2 | 10 | Mes 3 | Mes 12 |
| 3 | 9 | Mes 4 | Mes 12 |
| 4 | 8 | Mes 5 | Mes 12 |
| 5 | 7 | Mes 6 | Mes 12 |
| 6 | 6 | Mes 7 | Mes 12 |
| 7 | 5 | Mes 8 | Mes 12 |
| 8 | 4 | Mes 9 | Mes 12 |
| 9 | 3 | Mes 10 | Mes 12 |
| 10 | 2 | Mes 11 | Mes 12 |
| 11 | 1 | Mes 12 | Mes 12 |
| 12 | 0 — sin cuotas financiadas, pasa directo al 10% de entrega | — | — |

**El hito de entrega y el saldo del 10%**: si la obra termina en el plazo previsto (mes 12), la entrega del departamento ocurre **al mes siguiente** (mes 13) — ahí se paga el 10% restante y se cancela el 100% del valor de la unidad. La escritura llega después (~6-8 meses más, sección 2) y no forma parte de este cronograma de cobro.

## 4. Por qué importa para el flujo de fondos de Herrera

Esto reemplaza el supuesto simplificado usado hasta ahora en `11-ritmo-de-venta-y-piso-de-plusvalia.md` §1.1 y `18-cronograma-de-caja-v2-capital-vs-ventas.md` (que trataban cada venta como si entrara de una sola vez, al momento de la venta) — con este esquema, **cada unidad vendida genera un flujo de cobro propio** (20% al momento de la venta + N cuotas mensuales, donde N depende de en qué mes de la obra se vendió), no un pago único. El cronograma de caja completo (ingresos reales mes a mes, no solo "ventas nominales") todavía no se modeló con este nivel de detalle — es el paso que sigue.

## 5. Variante 40/50/10 — solo para proyectos de plazo de obra corto (2026-08-16)

Frente al déficit de timing detectado en el flujo de caja mensual de Herrera (`24-...md`/`25-...md`), se evaluó una variante con anticipo más alto: **40% entrega + 50% cuotas + 10% entrega física** (misma fórmula de cuotas de la sección 3, solo que reparte 50% en vez de 70%) — construida y comparada en `26-escenarios-para-cerrar-el-deficit-de-timing.md`, adoptada como el "Escenario Mix" en `27-flujo-de-caja-definitivo-escenario-1-y-mix.md`.

*"El esquema 40/50/10 del Mix no reemplaza el 20/70/10 para todos los proyectos de Meridiano. Es una variante puntual solo para estos casos donde se analizan proyectos de corto plazo de obra."*

**El 20/70/10 sigue siendo la norma general (D-067)** — el 40/50/10 queda registrado como variante reconocida, aplicable específicamente a proyectos de plazo de obra corto (como Herrera, 12 meses), donde un anticipo más alto ayuda a evitar que el gasto de obra se adelante demasiado al cobro de cuotas.

## 6. Qué queda pendiente

~~1. Confirmar cuál de las dos fórmulas de cuotas es la correcta~~ → ✅ **Resuelto (2026-08-16): cuotas = plazo de obra − mes de compra**, primera cuota el mes siguiente a la compra — ver sección 3.
~~2. Confirmar si falta un 10% de saldo contra escritura~~ → ✅ **Resuelto: el 10% final se cobra contra la entrega, no contra la escritura** — ver sección 2.
~~3. Modelar el cobro real mes a mes~~ → ✅ **Resuelto: flujo de caja mensual definitivo construido para el Escenario 1 (20/70/10) y el Escenario Mix (40/50/10)** — ver `27-flujo-de-caja-definitivo-escenario-1-y-mix.md`.
4. **Incorporar el plazo de escritura (~6-8 meses post-obra)** al horizonte del caso — no afecta el cobro (ya resuelto en la sección 2), pero sí puede afectar cuándo se puede considerar "cerrada" la operación de cada unidad vendida, o cuándo aplican ciertos costos legales/notariales (`07-...md`, "gastos legales y notariales USD 1.500 por unidad escriturada").
5. **Definir el criterio exacto de "plazo de obra corto"** que activa la variante 40/50/10 en futuros proyectos (¿cuántos meses o menos?) — el founder la acotó a "proyectos de corto plazo de obra" sin fijar un umbral numérico.
