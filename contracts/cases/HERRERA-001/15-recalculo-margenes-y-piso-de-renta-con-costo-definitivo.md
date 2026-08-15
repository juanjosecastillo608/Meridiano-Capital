Estado: CURRENT — recálculo de márgenes y piso de renta con el costo de entrada definitivo (cierra el ítem técnico pendiente desde `10-...md`)
Fuente original: recálculo propio, con el costo de entrada definitivo confirmado en `14-costo-de-entrada-definitivo-por-angulo.md`
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-15

# Recálculo de márgenes y piso de renta — costo de entrada definitivo

## 0. Qué hace este documento

Desde `10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md`, cada corrección al costo de entrada (metodología 21%/650/750, eliminación del doble conteo de Proyecto/Aprobaciones, % de Proyecto para Ángulo 2/3) quedó señalada como "deja con números superados" los márgenes de `06-margen-neto-comision-y-precios-por-piso.md` y el piso de renta de `08-...md`/`09-...md`, sin recalcularlos todavía. Con el costo de entrada ya definitivo (`14-...md` §3), este documento hace ese recálculo de una sola vez.

**Los ingresos NO cambian** — el precio de venta por piso, las cocheras y el rango de precio de zona (`06-...md` §2-3) no dependen del costo de construcción, siguen siendo los mismos. Lo único que cambia es la Inversión Total contra la que se comparan.

---

## 1. Márgenes recalculados — los tres Ángulos

| | Ángulo 1 (tal cual) | Ángulo 3 (fachada+chicas, 6P) | Ángulo 2 (fachada+chicas+7P) |
|---|---|---|---|
| Ingresos totales (bajo–alto, sin cambios de `06-...md`) | 3.567.637 – 4.218.165 | 3.820.500 – 4.097.250 | 4.424.700 – 4.749.150 |
| **Inversión Total (definitiva, `14-...md`)** | **2.824.581** | **3.009.806** | **3.273.624** |
| **Margen bruto (bajo–alto)** | 743.056 – 1.393.584 | 810.694 – 1.087.444 | 1.151.076 – 1.475.526 |
| Comisión de venta (5,5%, escenario conservador) | 196.220 – 231.999 | 210.128 – 225.349 | 243.359 – 261.203 |
| **Margen neto de comisión (bajo–alto)** | **546.836 – 1.161.585** | **600.566 – 862.095** | **907.718 – 1.214.323** |
| **ROI simple sobre Inversión Total (bajo–alto)** | **19,4% – 41,1%** | **20,0% – 28,6%** | **27,7% – 37,1%** |

### 1.1 Comparación contra el cálculo anterior (`06-...md`, con el costo de entrada previo — hoy superado)

| | Margen neto de comisión — antes | Margen neto de comisión — ahora |
|---|---|---|
| Ángulo 1 | −101.311 a +513.438 | **+546.836 a +1.161.585** |
| Ángulo 3 | +137.645 a +399.173 | **+600.566 a +862.095** |
| Ángulo 2 | +492.614 a +799.219 | **+907.718 a +1.214.323** |

**El Ángulo 1 pasa a ser positivo en todo el rango de venta**, incluso en el extremo bajo — antes daba negativo (−101.311) en ese escenario. Esto es consecuencia directa de la corrección del doble conteo (`13-...md`/`14-...md`): el costo de entrada real es más bajo de lo que se venía calculando, no un cambio en el diseño ni en el precio de venta.

### 1.2 Lectura — ¿sigue siendo el Ángulo 2 el más atractivo?

**Sí, en términos absolutos** (margen neto de comisión más alto en dólares, en todo el rango) — pero la brecha con los otros dos Ángulos se achica frente al cálculo anterior, porque el Ángulo 1 ya no tiene ningún escenario negativo. En términos de **ROI sobre inversión** (más relevante para comparar Ángulos de tamaño distinto), el Ángulo 2 también lidera en el extremo bajo (27,7% vs. 19,4%/20,0%), aunque el Ángulo 1 lo supera en el extremo alto (41,1% vs. 37,1%) — el Ángulo 1 tiene menos capital invertido, así que un buen resultado de venta le rinde proporcionalmente más. **El Ángulo 2 sigue siendo la recomendación más sólida** por ser el más consistente en todo el rango de precio (menor varianza entre el escenario bajo y alto), no solo por el número más alto en un extremo.

---

## 2. Piso de renta recalculado — Ángulo 3, con amoblamiento incluido

Usando el costo de entrada definitivo del Ángulo 3 (**USD 1.672,11/m²**, `14-...md` §3):

| Tipología | Costo depto | + Amoblamiento | Costo total | Piso anual | **Piso mensual** |
|---|---|---|---|---|---|
| Monoambiente (30 m²) | USD 50.163 | + Premium USD 7.000 | USD 57.163 | 15% | **USD 715** |
| Monoambiente (30 m²) | USD 50.163 | + Lujo USD 9.000 | USD 59.163 | 15% | **USD 740** |
| 1 dormitorio (45 m²) | USD 75.245 | + Premium USD 10.000 | USD 85.245 | 15% | **USD 1.066** |
| 1 dormitorio (45 m²) | USD 75.245 | + Lujo USD 14.000 | USD 89.245 | 15% | **USD 1.116** |
| 2 dormitorios (75 m²) | USD 125.409 | + Básico USD 7.000 | USD 132.409 | 10% | **USD 1.103** |
| 2 dormitorios (75 m²) | USD 125.409 | + Estándar USD 9.000 | USD 134.409 | 10% | **USD 1.120** |
| 3 dormitorios (120 m²) | USD 200.654 | + Básico USD 8.000 | USD 208.654 | 10% | **USD 1.739** |
| 3 dormitorios (120 m²) | USD 200.654 | + Estándar USD 10.000 | USD 210.654 | 10% | **USD 1.755** |

**Comparado con el piso de `09-...md` (costo de entrada anterior, USD 1.929,29/m² sin corregir)**: todos los pisos bajan — monoambiente de USD 811–836 a **USD 715–740**, 1 dormitorio de USD 1.210–1.260 a **USD 1.066–1.116**. Esto hace que el piso de renta sea **más fácil de alcanzar con renta real de mercado** — comparado contra el dato de `13-...md` §5 (Barrio Herrera 1 dormitorio USD 560–700, Villa Morra monoambiente USD 500–800), la brecha entre el piso (temporal, 15%) y la renta tradicional real sigue existiendo para 1 dormitorio, pero es menor que antes.

**Nota de alcance**: este piso usa la clase `temporal_departamento` (15%, producto Airbnb/Urbannit) para monoambiente/1 dormitorio, no la renta tradicional — la comparación válida contra los datos de mercado de `13-...md` §5 es la de esa sección (clase `departamento_amoblado`, 10%), no esta tabla. Esta tabla sigue siendo la referencia para el producto de renta temporal específicamente.

---

## 3. Qué queda pendiente

Con esto, el recálculo técnico que venía señalado como pendiente desde `10-...md` queda cerrado. Sigue pendiente lo que ya no depende de metodología sino de dato de mercado o de decisión del founder:

1. Tarifas de renta temporal/Airbnb reales de Barrio Herrera (ADR por noche) — `01-informacion-critica-faltante.md` ítem 33.
2. Cronograma de caja mes a mes (ritmo de venta por etapa vs. curva de egresos de obra) — ítem 26.
3. % de venta/retención final por Ángulo — depende del cronograma de caja (ítem 2 de arriba) y del capital disponible, ya no de la rentabilidad (que ya favorece retener, `08-...md` §4.3).
4. Base de cálculo del IVA del desarrollador (sobre utilidad vs. sobre precio total) — a confirmar con contadora, `13-...md` §4.1.
5. Con todo lo anterior, recién el flujo de fondos multi-año completo y la recomendación final (comprar/negociar/no comprar).
