Estado: CURRENT — costos de comercialización/marketing solo aplican a unidades vendidas, y el piso de plusvalía se recalcula neto de comisión
Fuente original: instrucciones del founder, 2026-08-15 (quinto mensaje del día)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-15

# Costos de comercialización por escenario, y piso de plusvalía neto de comisión

## 0. Resumen de lo que resuelve este documento

1. **Las unidades retenidas no cargan costo de comercialización** — corrige/formaliza la base de cálculo de la rentabilidad sobre costos totales para unidades retenidas.
2. **El escenario de retención total (`10-...md` §5) casi no tiene costos de marketing** — porque el objetivo de ese escenario específico es construir para rentar, no vender durante obra.
3. **El piso de plusvalía del 15% (`11-...md` §2) es BRUTO** — hay que restarle la comisión de comercialización (5,5%) e impuestos para saber qué le queda realmente al inversor.

---

## 1. Unidades retenidas: sin costo de comercialización — categoría A (confirmado)

*"Considerar que para el caso de retener las unidades no hay costos de comercialización para el inversor. Dato a tener en cuenta para el cálculo de la rentabilidad sobre los costos totales."*

**Regla**: al calcular la rentabilidad de una unidad **retenida** (renta), su costo de entrada **no** incluye ninguna porción de comisión de venta ni de marketing — esos costos solo existen si la unidad se vende. Esto ya era, de hecho, cómo se venía calculando el piso de renta en `08-...md`/`09-...md` (el costo de entrada usado ahí — construcción + proyecto + aprobaciones + adquisición, prorrateado por m² — nunca incluyó comercialización) — este mensaje lo **confirma como regla explícita**, no lo cambia.

**Dónde sí importa, y no se había explicitado hasta ahora**: en el presupuesto agregado del proyecto completo (`07-costos-desagregados-y-estrategia-venta-renta.md`, categoría "Marketing y comercialización"), el costo total de comisión/marketing **debe prorratearse solo sobre las unidades que efectivamente se venden**, no sobre el total de unidades del edificio. Si, por ejemplo, el Ángulo 3 retiene 15 de sus 29 unidades, la comisión de venta (5,5%) y el presupuesto de marketing se calculan sobre los ingresos y la cantidad de las 14 unidades que sí se venden — las 15 retenidas no aportan ni consumen ese costo.

**⚠️ Corregido por `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md`, sección 3**: el founder aclaró que el marketing no se puede prorratear por unidad (es un costo de campaña completa, no divisible) — "casi cero" solo aplica cuando la retención es **≥70%** de las unidades, no para cualquier nivel de venta reducida. Ver la sección 2 de abajo con esta salvedad en mente.

## 2. Escenario de retención total: marketing casi nulo — categoría A (confirmado)

*"También los costos de marketing son casi cero o nulos, porque en este caso el objetivo no es vender durante obra sino construir para rentar."*

Aplica específicamente al **tercer escenario** de `10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md`, sección 5 (retención total hasta terminar la obra, alquilar todo, vender recién después de 1-2 años). En este escenario específico, **se elimina — o se reduce a casi cero — el presupuesto de marketing** de `07-...md` (Marketing digital USD 80.000 + Showroom/renders/maqueta USD 35.000 + Eventos de lanzamiento USD 15.000 = **USD 130.000**), porque no hace falta correr una campaña comercial de preventa/durante-obra si el edificio no se está vendiendo en esa etapa.

**Esto mejora la economía del escenario de retención total**, adicionalmente al hallazgo ya documentado en `08-...md` §4.3 (retener supera a vender en rentabilidad pura) y al ahorro de comisión de venta de la sección 1 de este documento — **tres factores acumulados a favor de este escenario específico**, aunque sigue sin poder cuantificarse del todo hasta tener el dato real de plusvalía de mercado (ítem 25 de `01-informacion-critica-faltante.md`).

**Matiz importante — "casi cero", no cero**: el founder no dice que el marketing sea exactamente cero — probablemente porque incluso en este escenario hace falta algún gasto mínimo de comercialización cuando, después de 1-2 años, sí llega el momento de vender (o de alquilar activamente si se opera como renta temporal tipo Airbnb, que sí tiene un costo de canal/comisión de agencia distinto — ver `production/app/backend/calculadora.py`, `honorarios_alquiler_meses`). No se fija un número exacto sin que el founder lo precise.

---

## 3. Piso de plusvalía — bruto vs. neto de comisión e impuestos

*"Considerar que el inversor que tiene una plusvalía bruta del 15%, a eso debe restarle los gastos de comercialización que son 5,5% e impuestos."*

El piso de plusvalía de `11-ritmo-de-venta-y-piso-de-plusvalia.md` sección 2 (15% anual) es, como el propio founder aclara ahora, un piso **bruto** — para saber qué le queda realmente al inversor cuando efectivamente vende (al final del período de retención), hay que restarle:

1. **Comisión de venta (5,5%)** — se aplica sobre el precio de venta **ya apreciado** (no sobre el precio original), porque la comisión se paga sobre el monto real de la transacción de venta, que ocurre al valor futuro, no al valor de hoy.
2. **Impuestos** — el founder no especifica el % ni el impuesto exacto. **No se asume ningún número** — sigue siendo el mismo punto abierto ya señalado en `06-margen-neto-comision-y-precios-por-piso.md` y `09-...md` (qué régimen de IVA/impuesto a la renta aplica a la venta de unidades nuevas por parte del desarrollador — distinto del régimen de reventa de un inversor individual, ya resuelto en D-001/D-045, que no se debe asumir aplicable acá sin confirmar).

### 3.1 Piso de plusvalía neto de comisión (categoría B — calculado desde A)

| | Plusvalía BRUTA | Comisión (5,5% sobre el valor apreciado) | **Plusvalía NETA de comisión** (antes de impuestos) |
|---|---|---|---|
| 1 año | 15,000% | 6,325% (de la base original) | **8,675%** |
| 2 años (compuesto) | 32,250% | 7,274% (de la base original) | **24,976%** (≈ 11,79% anualizado) |

**La comisión no se resta linealmente (15% − 5,5% = 9,5%)** — se aplica sobre el valor ya apreciado, que es mayor a la base original, por eso el descuento efectivo (6,325% en 1 año) es mayor a 5,5 puntos porcentuales. **A esto todavía le falta restar impuestos** — el número final neto real es más bajo que 8,675%/24,976%, en una magnitud que no se puede fijar sin confirmar el régimen tributario aplicable (sigue como ítem pendiente).

### 3.2 Ejemplo en dólares — Monoambiente (30 m², precio terminado alto USD 61.500)

| | 1 año | 2 años |
|---|---|---|
| Precio futuro (con plusvalía bruta) | USD 70.725 | USD 81.334 |
| Comisión de venta (5,5%) | USD 3.890 | USD 4.473 |
| **Plusvalía neta de comisión** | **USD 5.335 (8,67%)** | **USD 15.360 (24,98%)** |
| Plusvalía bruta (referencia) | USD 9.225 (15%) | USD 19.834 (32,25%) |

### 3.3 Lectura — ¿sigue conviniendo el escenario de retención total?

Con este ajuste, el piso de plusvalía neto de comisión (8,675% el primer año) sigue siendo **más alto que el piso de renta (15% sobre el costo, no sobre el precio — bases distintas, ver `11-...md` §2.3)** en términos relativos al precio, pero la comparación relevante para decidir "seguir alquilando indefinidamente" vs. "alquilar y vender después de esperar plusvalía" no cambia de signo por este ajuste — **sigue dependiendo del dato real de plusvalía esperada en Barrio Herrera**, que no existe todavía. Lo que sí cambia es que la barra real para justificar la espera es **más alta de lo que el 15% bruto sugería** — hace falta una plusvalía de mercado mayor al 15% bruto anual (no solo igual) para que, neto de comisión e impuestos, la espera realmente convenga frente a otras alternativas.

---

## 4. Qué queda pendiente

1. **Régimen tributario exacto sobre la venta de unidades por parte del desarrollador/SA** — sigue siendo el mismo punto abierto de `06-...md`/`09-...md`/`10-...md`; sin esto, el piso de plusvalía neto de la sección 3 queda incompleto (falta la última resta).
2. **Dato real de plusvalía esperada en Barrio Herrera** (ítem 25 de `01-informacion-critica-faltante.md`) — sigue siendo el insumo que falta para aplicar el piso (ya neto) y concluir sobre el escenario de retención total.
3. **Presupuesto de marketing "casi nulo" para el escenario de retención total** — falta que el founder confirme un número aproximado en vez de "casi cero", si quiere que se cuantifique con precisión en vez de asumirlo en cero.
4. **Recalcular con la metodología de costos nueva (21%/650/750)** los márgenes de `06-...md` y el piso de renta de `08-...md`/`09-...md` — sigue siendo el mismo ítem técnico pendiente desde `10-...md`.
