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

## 3. Cuotas decrecientes según mes de compra — dos lecturas, con una inconsistencia real entre ellas

El mensaje del founder da dos datos que, tomados juntos, **no son matemáticamente consistentes entre sí** — se presentan ambos sin forzar cuál es la correcta:

- **Dato 1** (afirmación general): *"el 70% restante en 12 cuotas los que compran en el mes 1"* → comprar en el mes 1 da 12 cuotas.
- **Dato 2** (ejemplo puntual): *"el que compra en el mes 6 tiene solo 6 cuotas"* → comprar en el mes 6 da 6 cuotas.

| Fórmula | Cuotas si compra en el mes 1 | Cuotas si compra en el mes 6 | ¿Coincide con el Dato 1? | ¿Coincide con el Dato 2? |
|---|---|---|---|---|
| **A**: cuotas = plazo de obra − mes de compra **+ 1** | 12 | 7 | ✅ Sí | ❌ No (da 7, no 6) |
| **B**: cuotas = plazo de obra − mes de compra | 11 | 6 | ❌ No (da 11, no 12) | ✅ Sí |

**Ninguna de las dos fórmulas satisface los dos datos al mismo tiempo.** La diferencia es de una cuota — probablemente una cuestión de si el mes de compra en sí mismo cuenta como la primera cuota (Fórmula A) o si la primera cuota es el mes siguiente al de la compra (Fórmula B), y el founder puede haber mezclado ambas convenciones sin darse cuenta al dar el ejemplo. **No se elige una por mi cuenta** — se necesita la confirmación del founder sobre cuál de las dos aplica (o una tercera regla, si ninguna de las dos es la intención real).

## 4. Tabla completa de cuotas por mes de compra (categoría B — calculado desde A, con la ambigüedad de la sección 3 sin resolver)

| Mes de compra | Cuotas — Fórmula A (compra=cuota 1) | Cuotas — Fórmula B (cuota 1 = mes siguiente) |
|---|---|---|
| 1 | 12 | 11 |
| 2 | 11 | 10 |
| 3 | 10 | 9 |
| 4 | 9 | 8 |
| 5 | 8 | 7 |
| 6 | 7 | **6** ← coincide con el ejemplo del founder |
| 7 | 6 | 5 |
| 8 | 5 | 4 |
| 9 | 4 | 3 |
| 10 | 3 | 2 |
| 11 | 2 | 1 |
| 12 | 1 | 0 — no alcanzaría a financiar ninguna cuota antes de la entrega |

**Regla ya confirmada, sin ambigüedad**: el máximo de cuotas es el plazo de obra (12), el mes de compra marca el inicio del conteo, y el plazo de cuotas nunca se extiende más allá del último mes de obra — quien compra más tarde en la obra tiene menos cuotas disponibles, nunca más, y nunca se extiende el financiamiento después de la entrega.

## 5. Por qué importa para el flujo de fondos de Herrera

Esto reemplaza el supuesto simplificado usado hasta ahora en `11-ritmo-de-venta-y-piso-de-plusvalia.md` §1.1 y `18-cronograma-de-caja-v2-capital-vs-ventas.md` (que trataban cada venta como si entrara de una sola vez, al momento de la venta) — con este esquema, **cada unidad vendida genera un flujo de cobro propio** (20% al momento de la venta + N cuotas mensuales, donde N depende de en qué mes de la obra se vendió), no un pago único. El cronograma de caja completo (ingresos reales mes a mes, no solo "ventas nominales") todavía no se modeló con este nivel de detalle — es el paso que sigue.

## 6. Qué queda pendiente

1. **Confirmar cuál de las dos fórmulas de cuotas es la correcta** (sección 3) — o si ninguna, cuál es la regla real. **Sigue sin resolver** — el mensaje que completó el 20/70/10 (sección 2) no tocó este punto específico.
2. ~~Confirmar si falta un 10% de saldo contra escritura~~ → ✅ **Resuelto (2026-08-16): el 10% final se cobra contra la entrega, no contra la escritura** — ver sección 2.
3. **Modelar el cobro real mes a mes** (no solo la venta nominal) combinando el ritmo de venta (`11-...md`), el cronograma de caja v2 (`18-...md`) y este esquema de cuotas — el flujo de fondos completo todavía no llega a este nivel de detalle.
4. **Incorporar el plazo de escritura (~6-8 meses post-obra)** al horizonte del caso — no afecta el cobro (ya resuelto en la sección 2), pero sí puede afectar cuándo se puede considerar "cerrada" la operación de cada unidad vendida, o cuándo aplican ciertos costos legales/notariales (`07-...md`, "gastos legales y notariales USD 1.500 por unidad escriturada").
