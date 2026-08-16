Estado: CURRENT — cronograma de caja mes a mes (12 meses de obra), por Ángulo
Fuente original: instrucciones del founder, 2026-08-16
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-16

# Cronograma de caja mensual — 12 meses de obra

## 1. La regla, tal como la dio el founder

*"El cronograma de caja del mes 1 es el valor de compra del terreno + un 20% del total del presupuesto para iniciar el trabajo. Luego los costos totales del presupuesto se asignarán el mes 1, 2, 3 el 10% del presupuesto total cada mes. Y los meses restantes del 4 al 12 se dividirá el resto del presupuesto en partes iguales."*

## 2. Interpretación aplicada — con una ambigüedad señalada, no forzada

**Se leyó como dos componentes que se suman en el mes 1** (no uno reemplaza al otro): el 20% "para iniciar el trabajo" (movilización de obra) y el 10% del mes 1 (la primera cuota del ritmo regular de meses 1-3) son dos desembolsos distintos que caen en el mismo mes. Esto da: **mes 1 = adquisición + 30% del presupuesto de construcción**, mes 2 = 10%, mes 3 = 10%, y meses 4-12 (9 meses) se reparten el 50% restante en partes iguales (≈5,56%/mes).

**⚠️ Lectura alternativa no descartada**: si el 20% de "inicio de obra" fuera un desembolso aparte que NO forma parte del mismo presupuesto que se reparte 10%/10%/10% en los meses 1-3 (por ejemplo, si sale de una partida de movilización distinta a la de construcción), el mes 1 sería solo 10% (no 30%) y los meses 4-12 se repartirían un 70% en vez de un 50%. **Se usó la lectura literal** ("un 20% DEL TOTAL DEL PRESUPUESTO" — el mismo presupuesto que se reparte después) por ser la más directa del texto — si no es la que el founder quiso decir, hay que corregir.

**Qué cuenta como "el presupuesto"**: se interpretó como el **presupuesto de construcción** (Inversión Total menos la adquisición de USD 850.000) — no el total con adquisición incluida, porque el propio founder separa "el valor de compra del terreno" como un ítem aparte, sumado al 20%, no incluido dentro de él.

## 3. Cronograma por Ángulo — con el presupuesto de construcción definitivo (`14-...md`)

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Presupuesto de construcción (Inversión Total − adquisición) | USD 1.974.581,03 | USD 2.159.806,32 | USD 2.423.623,59 |
| **Mes 1** (adquisición USD 850.000 + 30% del presupuesto) | **USD 1.442.374,31** | **USD 1.497.941,90** | **USD 1.577.087,08** |
| **Mes 2** (10%) | USD 197.458,10 | USD 215.980,63 | USD 242.362,36 |
| **Mes 3** (10%) | USD 197.458,10 | USD 215.980,63 | USD 242.362,36 |
| **Meses 4 a 12** (50% ÷ 9, cada uno) | USD 109.698,95 | USD 119.989,24 | USD 134.645,76 |
| Total meses 4-12 (9 meses) | USD 987.290,52 | USD 1.079.903,16 | USD 1.211.811,79 |
| **Total 12 meses (verificación)** | USD 2.824.581,03 | USD 3.009.806,32 | USD 3.273.623,59 |

## 4. Para qué sirve — cruzarlo contra el ritmo de venta

Con esto ya se puede cruzar el egreso mensual contra el ingreso por ventas de `11-ritmo-de-venta-y-piso-de-plusvalia.md` (30% lanzamiento/40% durante obra/30% finalización) para ver si hay algún mes con déficit de caja pese a que el total cierre — el paso que quedaba pendiente desde `11-...md` §1.1 y `01-informacion-critica-faltante.md` ítem 26.

**Primer chequeo rápido, Ángulo 1/3**: el egreso del mes 1 (USD 1.442.374 / 1.497.942) es, por lejos, el mes más pesado del cronograma — mayor que el 70% de capital propio disponible por adelantado sobre la Inversión Total completa (`10-...md` §4: USD 2.244.149,05 para el Ángulo 1/3 con la Inversión Total de esa fecha; con el número definitivo de `14-...md` el 70% pasa a ser distinto — hay que recalcular ese 70/30 también con la Inversión Total definitiva). **Esto sugiere que puede haber, sí, una necesidad real de caja concentrada en el mes 1** (la compra del terreno/edificio más el arranque de obra) que el ritmo de venta (30% recién en el lanzamiento, no necesariamente todo cobrado el día 1) podría no cubrir a tiempo — hay que revisar si el 30% de "lanzamiento" se cobra efectivamente en el mes 1 completo, o si se cobra en cuotas (la planilla de referencia, `02-...md`, tiene un cronograma de cuotas típico de 20% entrega inicial + saldo en cuotas, lo que bajaría la caja real disponible en el mes 1 frente a asumir el 30% completo cobrado de una sola vez).

**No se resuelve del todo en este documento** — es la primera vez que se cruzan estos dos cronogramas, y ya aparece una tensión real de caja en el mes 1 que antes no era visible. Se deja como hallazgo explícito para el próximo paso (recalcular el 70/30 de capital de socios con la Inversión Total definitiva, y modelar el cobro real del 30% de lanzamiento con el cronograma de cuotas, no como un pago único).

## 5. Qué queda pendiente

1. **Recalcular el 70%/30% de capital de socios (`10-...md` §4) con la Inversión Total definitiva** de `14-...md` (el 70/30 se calculó sobre la Inversión Total de esa fecha, ya superada).
2. **Modelar el cobro real del 30% de "lanzamiento"** con el cronograma de cuotas típico (entrega inicial + cuotas), no como un pago único en el mes 1 — para saber si el déficit de caja detectado en la sección 4 es real o se diluye al modelar las cuotas.
3. Confirmar la lectura de la sección 2 (20% aparte vs. 20% incluido en el mismo presupuesto que el 10%/10%/10%) si la interpretación usada no es la correcta.
4. Con esto, recién armar el flujo de fondos mes a mes completo, cruzando ingresos y egresos reales.
