Estado: CURRENT — ritmo de venta por etapa (30/40/30) y piso de plusvalía anual (15% s/precio de venta terminado)
Fuente original: instrucciones del founder, 2026-08-15 (tercer mensaje del día)
Dominio: INVESTMENT (caso HERRERA-001) — ambos criterios se registran además como referencia cross-cutting, ver `governance/decisions/DECISION_REGISTER.md`, D-065
Incorporado: 2026-08-15

# Ritmo de venta por etapa y piso de plusvalía anual

## 0. Resumen de lo que resuelve este documento

1. **Ritmo de venta**: sobre el 100% de las unidades destinadas a la venta, 30% se vende en el lanzamiento, 40% durante la obra, 30% en la última etapa/al finalizar — resuelve el ítem 22 (parte del ritmo) de `01-informacion-critica-faltante.md`.
2. **Piso de plusvalía anual**: 15% sobre el precio de venta de la unidad terminada, como umbral mínimo para que valga la pena esperar y vender más tarde en vez de vender ahora — resuelve el ítem 24 de `01-informacion-critica-faltante.md` (el supuesto que faltaba para cuantificar el escenario de retención total de `10-...md` §5).

---

## 1. Ritmo de venta por etapa — categoría A (confirmado)

*"Para el ritmo de venta de los proyectos vamos a calcular que sobre el 100% de las unidades destinadas a la venta: el 30% se vende en el lanzamiento, el 40% se vende durante obra, y el 30% restante en la última etapa de obra y/o al finalizar la obra."*

El founder lo enuncia como criterio "de los proyectos" (en plural) — igual que la comisión de venta (D-063) y la tabla de costos (D-064), se trata como un criterio reutilizable de la metodología de Meridiano, no solo de Herrera, y se registra también como **D-065** en el Decision Register.

| Etapa | % de las unidades destinadas a la venta |
|---|---|
| Lanzamiento | 30% |
| Durante obra | 40% |
| Última etapa de obra / finalización | 30% |

**Distinto del `cronograma_cuotas_default`** ya existente en `knowledge-base/investment/03-parametros-de-mercado.md` (entrega inicial 20% + cuotas sin interés + saldo a entrega) — ese parámetro describe **cómo paga cada comprador** una unidad ya vendida (estructura de cuotas dentro de un contrato). Este nuevo criterio describe **cuántas unidades se venden en cada etapa** del proyecto (ritmo de colocación comercial). Son dos dimensiones distintas del mismo flujo de fondos — ambas hacen falta, no se reemplazan entre sí.

### 1.1 Aplicado al monto mínimo de venta ya confirmado (`10-...md`, sección 4)

Con el capital de los socios ya confirmado (70% adelantado / 30% a cubrir con venta), y asumiendo — de forma simplificada, como primer corte — que el precio de venta es razonablemente uniforme entre unidades para efectos de este cronograma (no es exacto, dado el precio por piso y la variación por tipología, pero es una aproximación razonable para dimensionar el flujo por etapa):

| Etapa | Ángulo 1/3 (30% mínimo = USD 961.778) | Ángulo 2 (30% mínimo = USD 1.037.378) |
|---|---|---|
| Lanzamiento (30%) | USD 288.533 | USD 311.213 |
| Durante obra (40%) | USD 384.711 | USD 414.951 |
| Finalización (30%) | USD 288.533 | USD 311.213 |

**Esto es un primer corte, no el cronograma de caja final** — falta todavía mapear estas tres etapas a meses concretos dentro de los 12 meses de obra (`09-...md` sección 2) y compararlas contra la curva de egresos de construcción mes a mes (que probablemente no es uniforme — la obra suele tener más gasto concentrado en ciertos tramos), para saber si hay algún mes con déficit de caja pese a que el total de 12 meses cierre. Ese cruce (ingresos por etapa vs. egresos por mes) es el paso que falta antes de dar por completo el flujo de fondos.

---

## 2. Piso de plusvalía anual — 15% sobre el precio de venta de la unidad terminada

*"La plusvalía anual que justifique la venta debería ser 15% sobre el precio de venta de la unidad terminada."*

### 2.1 La regla

> **Para que valga la pena esperar y vender más tarde (en vez de vender ahora), la unidad tiene que apreciarse al menos 15% anual, medido sobre su precio de venta de unidad terminada** — no sobre el costo de construcción de Meridiano.

**Importante no confundir esto con el piso de renta ya existente (D-033/D-044/D-045, 15% para `temporal_departamento`)** — son dos criterios distintos, con bases de cálculo distintas:

| | Piso de renta (`08-...md`/`09-...md`) | Piso de plusvalía (nuevo) |
|---|---|---|
| Mide | Ingreso de alquiler anual | Apreciación de precio anual |
| % | 15% (`temporal_departamento`) / 10% (`departamento_amoblado`) | **15%, único, para toda unidad** |
| Base de cálculo | **Costo de entrada de Meridiano** (construcción) | **Precio de venta de la unidad terminada** (lo que paga un comprador) |

Ambos criterios coinciden en el número (15%) para las tipologías chicas, pero al aplicarse sobre bases distintas dan cifras en dólares distintas — ver comparación en la sección 3.

### 2.2 Piso de plusvalía anual por tipología (categoría B — calculado desde A)

Sobre el rango de precio de venta ya establecido (USD 1.900–2.050/m², Ángulo 3):

| Tipología | Precio terminado (bajo–alto) | **Piso de plusvalía ANUAL (15%)** | Piso acumulado a 2 años (compuesto) |
|---|---|---|---|
| Monoambiente (30 m²) | USD 57.000 – 61.500 | USD 8.550 – 9.225 | USD 18.383 – 19.834 |
| 1 dormitorio (45 m²) | USD 85.500 – 92.250 | USD 12.825 – 13.838 | USD 27.574 – 29.751 |
| 2 dormitorios (75 m²) | USD 142.500 – 153.750 | USD 21.375 – 23.063 | USD 45.956 – 49.584 |
| 3 dormitorios (120 m²) | USD 228.000 – 246.000 | USD 34.200 – 36.900 | USD 73.530 – 79.335 |

**Lectura**: si Meridiano espera que Barrio Herrera aprecie menos del 15% anual, conviene vender ahora en vez de esperar — el piso está para evitar el error de "aguantar por las dudas" sin que la espera realmente compense. **No hay todavía un dato de mercado real de plusvalía esperada para Barrio Herrera** — no se asume ningún % de apreciación real sin que el founder lo confirme o se releve; este piso es el umbral de decisión, no una proyección.

### 2.3 Comparación con el piso de renta — por qué casi coinciden en dólares, pese a ser criterios distintos

Dado que el margen de desarrollador de Herrera es estructuralmente delgado (costo de entrada USD 1.781,07/m² vs. precio de venta USD 1.900–2.050/m², `10-...md` sección 2), el costo y el precio están muy cerca entre sí (ratio costo/precio ≈ 0,87). Esto hace que, en dólares, el piso de renta (15% sobre el costo, más bajo) y el piso de plusvalía (15% sobre el precio, más alto) **casi coincidan**, aunque miden cosas distintas:

| Tipología | Piso de renta anual (15% s/costo) | Piso de plusvalía anual (15% s/precio alto) |
|---|---|---|
| Monoambiente | USD 8.015 | USD 9.225 |
| 1 dormitorio | USD 12.022 | USD 13.838 |

**Esto es relevante para el escenario de retención total de `10-...md` sección 5**: si una unidad retenida ya cumple su piso de renta (15% anual sobre el costo), la barra para que ADEMÁS convenga esperar y vender más tarde (en vez de seguir alquilando indefinidamente) es apenas un poco más alta (15% sobre el precio, no sobre el costo) — no es una barra mucho más exigente. Dicho de otro modo: con los números de Herrera, **retener y alquilar ya casi alcanza el mismo nivel de exigencia que el piso de plusvalía que justificaría vender después de esperar** — la decisión entre "seguir alquilando indefinidamente" y "alquilar 1-2 años y vender" depende, en la práctica, de si Barrio Herrera realmente aprecia ≥15% anual (dato de mercado que sigue sin confirmarse) más que de una diferencia estructural entre los dos criterios.

---

## 3. Qué queda pendiente

1. **Cronograma de caja mes a mes** — cruzar el ritmo de venta por etapa (sección 1) contra la curva real de egresos de construcción dentro de los 12 meses (no necesariamente uniforme mes a mes) — el paso que falta para el flujo de fondos completo.
2. **Dato real de plusvalía esperada en Barrio Herrera** — sin esto, el escenario de retención total (`10-...md` sección 5) queda con el criterio de decisión definido (15% anual sobre precio) pero sin poder concluir si conviene o no en la práctica.
3. Renta mensual real de mercado en Barrio Herrera (ítem 13, sigue siendo el mismo pendiente de siempre).
4. Recalcular los márgenes/piso de renta de `06-...md`/`08-...md` con el costo de entrada nuevo (USD 1.781,07/m², `10-...md` sección 2) — sigue siendo el ítem 22 técnico pendiente.
