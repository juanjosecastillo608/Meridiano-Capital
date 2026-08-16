Estado: CURRENT — los tres escenarios de venta/retención comparados (venta mínima, venta agresiva, retención con reventa a plusvalía), Ángulo 3 como caso representativo
Fuente original: pedido del founder (`10-...md` §5), retomado como tercer pendiente confirmado 2026-08-17
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-17

# Los tres escenarios de venta/retención

## 0. Qué hace este documento, y una aclaración de alcance importante

Compara los tres escenarios que el caso viene arrastrando desde `10-...md` §5: **venta mínima necesaria + retención perpetua**, **venta agresiva (liquidación total)**, y **venta mínima + retención con reventa futura capturando plusvalía**. Se usa **Ángulo 3 como caso representativo** (mismo criterio usado en otros análisis de este caso) — la misma metodología se puede replicar para Ángulo 1 y Ángulo 2.

**Aclaración importante**: esta comparación es **independiente** de cuál esquema de financiamiento/cobro se use (Escenario 1 o Mix, `27-...md`) — ambos esquemas cubren el mismo mínimo de venta (30% de la Inversión Total) con distinta estructura de cuotas de comprador; lo que cambia acá es **cuánto se vende y qué se hace con lo retenido**, no cómo se cobra lo que sí se vende. Los dos ejes (financiamiento y venta/retención) son decisiones separadas.

## 1. Supuestos usados — categoría C, ilustrativo, no el mix final por unidad

- **Piso de renta ponderado: 11% anual** sobre el costo retenido — un promedio ilustrativo entre las 4 tipologías (8% a 15%, `31-...md`), no un mix real por unidad (todavía no está definido cuántas unidades de cada tipología se retienen exactamente, `31-...md` §5).
- **Plusvalía anual: 20%**, la cifra confirmada por el founder para Barrio Herrera y zonas comparables (`13-...md` §2).
- **Comisión de venta: 5,5%**, escenario conservador (`06-...md`).
- **La cartera retenida se valúa a costo** (no a precio de mercado) mientras no se vende — es la valuación más conservadora posible, no asume una ganancia no realizada.
- **No incluye**: impuestos sobre la eventual reventa (`13-...md` §4.1, base de cálculo del IVA todavía sin confirmar), costos de mantenimiento/administración de la cartera retenida durante el período de tenencia, ni el cronograma de venta escalonada que en la práctica llevaría vender 70% de las unidades de una sola vez a los 2 años (acá se modela como venta instantánea, simplificación).

## 2. Los tres escenarios — Ángulo 3

| | **A — Venta mínima (30%) + retención perpetua** | **B — Venta agresiva (100%, liquidación total)** | **C — Venta mínima (30%) + retención 2 años + reventa con plusvalía** |
|---|---|---|---|
| Cash de venta inicial (neto de comisión) | USD 1.122.341 | USD 3.741.137 | USD 1.122.341 |
| Renta acumulada | USD 231.755 (1 año) | — | USD 463.510 (2 años) |
| Cash de reventa futura (neto de comisión) | — | — | USD 3.771.066 (a los 2 años, con 20%/año de plusvalía) |
| Valor de la cartera retenida (a costo, si no se vende) | USD 2.106.864 | — | — (ya vendida a los 2 años) |
| **Valor total** | **USD 3.460.961** (a 1 año) | **USD 3.741.137** (a 1 año) | **USD 5.356.917** (a 2 años) |
| **Ganancia sobre la Inversión Total** | USD 451.154 (+15,0%) | USD 731.331 (+24,3%) | USD 2.347.111 (+78,0%) |
| **Retorno anualizado equivalente** | **15,0%/año** | **24,3%/año** | **33,4%/año** |

## 3. Lectura — el Escenario C domina, con caveats reales

**En este análisis ilustrativo, el Escenario C (retener y esperar plusvalía) da el retorno más alto por un margen amplio** — consistente con todo lo que el caso ya venía encontrando: el margen de venta de Herrera es delgado (`08-...md` §4.3), mientras que la plusvalía real de la zona (20%/año, confirmada por el founder) es sustancialmente más alta que el margen de venta inmediato. Esto no es una sorpresa nueva — es la **cuantificación concreta** de un hallazgo que se venía repitiendo cualitativamente desde hace varios documentos.

**Por qué no se recomienda el Escenario C sin más, pese al número**:

1. **Es el escenario con más riesgo/incertidumbre** — depende de que la plusvalía real efectivamente se sostenga en 20%/año durante 2 años completos, un supuesto de mercado, no una garantía. El Escenario B (venta agresiva) no depende de ningún supuesto de apreciación futura — es el más conservador de los tres.
2. **Ignora costos reales de tenencia** (impuestos, administración, mantenimiento de 2 años de cartera retenida) que sí bajarían el número.
3. **Asume una venta instantánea del 70% retenido a los 2 años** — en la práctica, vender 70% de las unidades de una vez llevaría meses, con su propio ritmo de venta y cuotas, no un cobro único.
4. **El Escenario A subestima su propio resultado** (valúa la cartera retenida a costo, no a lo que realmente vale) — sirve como piso conservador, no como techo — el verdadero valor del "quedarse a rentar indefinidamente sin vender nunca" es más alto que el 15% mostrado, porque el activo retenido vale más que su costo.

## 4. Qué queda pendiente

1. **Replicar esta comparación para Ángulo 1 y Ángulo 2** — este documento solo cubrió Ángulo 3 como caso representativo.
2. **Definir el mix real por unidad/tipología** (`31-...md` §5) para reemplazar el piso ponderado ilustrativo (11%) por un número calculado desde el mix real.
3. **Incorporar impuestos y costos de tenencia** al Escenario C, una vez resuelta la base de cálculo del IVA del desarrollador (`13-...md` §4.1).
4. **Modelar el cronograma real de venta del 70% retenido** a los 2 años (no una venta instantánea) — mismo nivel de detalle que ya se hizo para la venta del 30% inicial (`24-...md`/`27-...md`).
5. Con esto, el caso queda con los tres pilares principales completos (costo definitivo, flujo de caja de financiamiento, y comparación de escenarios de venta/retención) — el paso que sigue es la síntesis final: recomendación (comprar/negociar/no comprar) y el Memorándum de Inversión, si el founder quiere avanzar con eso.
