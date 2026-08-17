Estado: CURRENT — recosteo a USD 720/m² (baja de 750), IVA del desarrollador confirmado sobre costo de construcción, margen final definitivo
Fuente original: instrucciones del founder, 2026-08-17
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-17

# Recosteo a USD 720/m², IVA del desarrollador, y margen final definitivo

## 1. Ajuste del precio objetivo — de USD 750/m² a USD 720/m²

*"Vamos a hacer un planteamiento de costos de construcción para comparar también con Filum, dado que la calidad que da Filum se obtiene con costos de construcción de USD 650. Vamos a pedir un ajuste a nuestro precio de USD 750 por m² de construcción, y para este caso vamos a tomar USD 720 por m² de construcción."*

El comparable Filum Herrera (Century 21 Liberty, mismo barrio) logra su nivel de calidad competitivo con un costo de construcción de USD 650/m² (la tasa "Básica" de `knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md`) — el founder ajusta el objetivo de Herrera de **USD 750/m² (Estándar+DVH) a USD 720/m² (Estándar)**, un escalón por debajo, para este caso específico.

**Esto reemplaza, de forma definitiva, el USD 750/m² usado en `10-...md`/`14-...md`** como tasa objetivo de terminación — la metodología (21% de incidencia estructural, `10-...md` §2) no cambia, solo la tasa a la que se aplica.

### 1.1 Costo de construcción recalculado

| | Con $750/m² (superado) | **Con $720/m² (definitivo)** |
|---|---|---|
| Terminación sobre estructura existente (2.286,93 m² × tasa × 0,79) | USD 1.355.006,02 | **USD 1.300.805,78** |
| Obra 100% nueva, 6 pisos (826,10 m²) | USD 619.575,00 | **USD 594.792,00** |
| Obra 100% nueva, 7 pisos (1.126,10 m²) | USD 844.575,00 | **USD 810.792,00** |
| **Costo de construcción, envolvente 6 pisos** | USD 1.974.581,03 | **USD 1.895.597,78** |
| **Costo de construcción, envolvente 7 pisos** | USD 2.199.581,03 | **USD 2.111.597,78** |

### 1.2 Inversión Total y costo/m² definitivos, por Ángulo

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Inversión Total (con $720/m²) | **USD 2.745.597,78** | **USD 2.930.823,07** | **USD 3.185.640,34** |
| Costo/m² comercializable | **USD 1.525,33** | **USD 1.628,24** | **USD 1.516,97** |
| (Referencia, con $750/m², superado) | USD 2.824.581,03 (1.569,21) | USD 3.009.806,32 (1.672,11) | USD 3.273.623,59 (1.558,87) |

**El costo de entrada baja entre USD 42–88 mil según el Ángulo** — el Ángulo 2 sigue siendo el de menor costo/m² comercializable de los tres.

> **Corrección (2026-08-17, test de reconstrucción del Real Estate Intelligence OS, Fase 13)**: la fila "Terminación sobre estructura existente" tenía un error de tipeo (USD 1.303.869,10) que no coincidía con 2.286,93 m² × USD 720 × 0,79 = **USD 1.300.805,78** (diferencia de USD 3.063,32) — corregido arriba. **No afectó ningún número final**: los totales "Costo de construcción, envolvente 6/7 pisos" (USD 1.895.597,78 / USD 2.111.597,78) y todo lo calculado a partir de ellos en las secciones 1.2 y 3 de este archivo ya usaban el valor correcto — era un error de visualización en esa fila puntual, no de cálculo. Verificado corriendo `skills/construction-cost-engine/estimar.py` de forma independiente contra la tabla real (D-064): reproduce exactamente los mismos totales.

---

## 2. IVA del desarrollador — base de cálculo confirmada

*"La base de cálculo del IVA del desarrollador es sobre los costos totales de construcción."*

Cierra el punto que había quedado como `[EXTENSION]`/estimado en `13-...md` §4.1 (donde se había asumido, sin confirmar, que el IVA aplicaba sobre la utilidad) — **categoría A, confirmado**: el 10% de IVA del desarrollador se calcula **sobre el costo total de construcción**, no sobre el precio de venta ni sobre la utilidad.

> **IVA del desarrollador = 10% × Costo de construcción**

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Costo de construcción (con USD 720/m²) | USD 1.895.597,78 | USD 1.895.597,78 (misma envolvente 6P) | USD 2.111.597,78 |
| **IVA del desarrollador (10%)** | **USD 189.559,78** | **USD 189.559,78** | **USD 211.159,78** |

**Esto se suma como una línea de costo real, no se venía descontando en ningún cálculo anterior de margen del caso** (`06-...md`, `08-...md`, `13-...md`, `15-...md` quedan con el margen sin este descuento — superados en este punto específico).

---

## 3. Margen final definitivo — con USD 720/m² e IVA del desarrollador ya descontado

| | Ángulo 1 | Ángulo 3 | **Ángulo 2** |
|---|---|---|---|
| Ingresos totales (bajo–alto, sin cambios) | 3.567.637 – 4.218.165 | 3.820.500 – 4.097.250 | 4.424.700 – 4.749.150 |
| Inversión Total (definitiva) | 2.745.598 | 2.930.823 | 3.185.640 |
| Comisión de venta (5,5%) | 196.220 – 231.999 | 210.128 – 225.349 | 243.358 – 261.203 |
| IVA del desarrollador (10% s/construcción) | 189.560 | 189.560 | 211.160 |
| **Margen final (bajo–alto)** | **436.259 – 1.051.008** | **489.990 – 751.518** | **784.541 – 1.091.147** |
| **ROI simple sobre Inversión Total** | **15,9% – 38,3%** | **16,7% – 25,6%** | **24,6% – 34,3%** |

**Los tres Ángulos siguen dando margen positivo en todo el rango de precio, incluso con el costo de IVA del desarrollador ya restado** — el Ángulo 2 sigue siendo el más atractivo en términos absolutos y de ROI en el extremo bajo (el escenario más conservador).

**Comparado contra el margen presentado en el Memorándum (`34-...md` §3, que no incluía el IVA del desarrollador)**: el ROI baja entre 3 y 4 puntos porcentuales en el extremo bajo de cada Ángulo — un ajuste real, no cosmético, pero que no cambia la conclusión cualitativa (los tres Ángulos siguen siendo viables).

---

## 4. Qué queda pendiente

1. **Actualizar el piso de renta y el piso de plusvalía** (`08-...md`, `09-...md`, `11-...md`, `23-...md`) con el costo de entrada recalculado a USD 720/m² — sigue el mismo patrón de "números superados" ya visto varias veces en el caso.
2. **Actualizar el Memorándum de Inversión** (`34-...md`) con estos márgenes finales definitivos.
3. Con esto, el costo de entrada del caso queda en su versión **final** (no debería haber más ajustes de tasa de construcción, salvo nueva instrucción del founder).
