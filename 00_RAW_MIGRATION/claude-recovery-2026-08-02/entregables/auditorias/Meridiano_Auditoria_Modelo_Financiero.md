# Auditoría del Modelo Financiero — `flujo_fondos_fideicomiso.xlsx`

> **Veredicto:** el modelo **recalcula sin errores de fórmula (0/939)** pero es **económicamente inviable y contiene errores de lógica**. No es presentable a inversores en su estado actual. Como base de Meridiano Capital, requiere reconstrucción, no ajuste.
>
> **Método:** doble lectura (fórmulas + valores recalculados con LibreOffice), rastreo celda por celda, y contraste con la lógica de `meridiano-rentabilidad`. Fecha: 30-jul-2026.

---

## 0. Nota de rigor — un error propio, corregido

En la primera pasada sumé, sin querer, la **columna de totales (AU)** junto con las 44 columnas mensuales, lo que hacía ver todos los rubros al doble. **El modelo NO está duplicado.** Detecté y corregí mi propio error antes de atribuirle al modelo uno que no tiene. Todo lo que sigue está verificado excluyendo la columna total.

---

## 1. El resultado calculado: el proyecto pierde plata

Valores tal como los arroja el modelo (hoja Resumen Ejecutivo, celdas únicas):

| Indicador | Valor del modelo |
|---|---|
| Ingreso bruto total (AU13) | USD 10.386.515 |
| Resultado neto del fideicomiso (AU49) | **USD −4.113.883** |
| Margen neto sobre ventas | **−40%** |
| Excedente para el desarrollador | **USD −983.704** |
| Saldo de caja final (AT50) | **USD −4.113.883** |

El modelo, tal como está, describe un proyecto que **termina con USD 4,1M de déficit**. Eso solo ya lo vuelve no presentable. Pero el número está distorsionado por errores que hay que separar para entender la realidad.

---

## 2. Errores de lógica matemática (confirmados, con celda)

### ERROR 1 — Retorno a inversores de obra inflado en ~USD 2,34M `crítico`

Fórmula de la celda `Resumen!B30` (Retorno total a inversores de obra):
```
= 'Flujo de Fondos'!AU43 − 'Flujo de Fondos'!AU44 − 'Flujo de Fondos'!AU45
   (aporte +2.340.000) (devolución −2.340.000) (preferente −1.502.142)
= 2.340.000 + 2.340.000 + 1.502.142 = 6.182.142
```
El **aporte de los inversores (AU43, +2.340.000) es su propio capital entrando al fideicomiso** — no es un retorno. La fórmula lo suma como si lo fuera, inflando el retorno a obra de los **USD 3.842.142 correctos** (capital devuelto 2,34M + preferente 1,50M) a **USD 6.182.142**. Sobrestimación: **USD 2.340.000**.

Verificación cruzada: el preferente de obra (AU45 = −1.502.142) sobre 2,34M de capital a 20% anual compuesto por 30 meses da 2,34M × ((1+0,20/12)^30 − 1) = 2,34M × 0,6407 = 1,50M. **El preferente está bien; lo que está mal es la suma que le agrega el aporte.**

El retorno al inversor del terreno (`B29`), en cambio, **está bien**: 2M capital + 1,63M preferente = 3,63M (≈18% anual compuesto sobre 40 meses). El error es solo en obra.

### ERROR 2 — Hard cost sobre superficie vendible, no construida `crítico`

`Supuestos!B20 = B11 × B19 = 5.200 m² (vendible) × 900 USD/m² = 4.680.000`. La nota de la propia celda dice "Superficie vendible". El área **construida** (circulaciones, cocheras, amenities, muros, subsuelos) es típicamente 1,20–1,35× la vendible → ~6.500 m² → obra real **~5,85–6,3M**. El modelo **subestima la construcción en ~USD 1,2–1,6M**. La curva S distribuye correctamente esa base subestimada, así que el error se propaga a todo el bloque C.

### ERROR 3 — Impuesto a las ganancias al 25%, cuando en Paraguay es 10% `de datos`

`Supuestos!B58 = 0,25`. El IRE/IRACIS paraguayo es **10%**, no 25%. No muerde en este modelo porque hay pérdida (impuesto = 0), pero en un modelo que se vende como Paraguay-específico es un dato equivocado que, con el proyecto en positivo, sobrestimaría el impuesto 2,5×.

### ERROR 4 — Los ingresos capturan solo ~82% de la venta teórica `a reconciliar`

Venta teórica: 80 u × 65 m² × 2.440 USD/m² ponderado = 12.688.000; neto de 5% de cancelación = 12.053.600. El modelo reconoce **10.386.515** (AU13). Faltan **~USD 1,67M** dentro de la ventana de 42 meses. Probable causa: saldos de escrituración de unidades tardías que se cobran fuera del horizonte del modelo. Si es así, deberían figurar como **cuenta por cobrar al cierre**, no desaparecer. Hay que reconciliarlo: como está, subestima el ingreso.

---

## 3. La conclusión económica: no es (solo) la estructura, es el proyecto

Aislando los errores para ver la realidad del proyecto **bajo los supuestos genéricos**:

| Ajuste | Efecto sobre el resultado |
|---|---|
| Resultado del modelo (con errores) | −4.113.883 |
| + Corregir el retorno de obra (quitar el aporte fantasma) | +2.340.000 → **−1.773.883** |
| − Corregir el hard cost a área construida (~+1,3M de obra) | −1.300.000 → **−3.073.883** |
| + Reconciliar ingresos no capturados (~+1,67M, si se cobran) | +1.670.000 → **−1.403.883** |

Aun corrigiendo todo, el proyecto **sigue en pérdida de ~USD 1,4–3,1M** con estos supuestos. **El problema de fondo no es el formato del modelo: es que los supuestos genéricos (80 u, $900/m², $2.200–2.800/m² de venta) no cierran un desarrollo que además promete 18–20% fijo a los inversores.** Este es el gap G-03 del reporte, ahora cuantificado.

---

## 4. Por qué esto valida la decisión de hurdle + carry

El modelo usa **TIR fija (18% terreno / 20% obra) + 30% del excedente**. Eso le **promete al inversor un retorno que el proyecto no genera** — de ahí el déficit. Es exactamente el riesgo que señalamos: con TIR fija, el desarrollador queda obligado a pagar aunque el proyecto no rinda, y el margen del desarrollador es lo primero que se consume (acá, hasta −984k).

**Con hurdle + carry el problema se autolimita:** el inversor cobra capital + 8% de hurdle + su parte del remanente *real*. Si el proyecto no genera excedente, no hay carry y no hay promesa incumplida — el reparto nunca puede exceder lo que el proyecto produce. La decisión ya tomada (Meridiano paga hurdle+carry, nunca TIR fija) es la correcta, y esta auditoría es su mejor argumento.

---

## 5. Qué hay que hacer con el modelo (recomendación)

**No ajustar este archivo: reconstruirlo** sobre bases correctas, porque los errores están en la arquitectura, no en celdas sueltas.

1. **Base de obra:** hard cost sobre área **construida** (definir factor vendible→construido del proyecto real, ~1,25–1,35).
2. **Retorno al inversor:** reemplazar TIR fija + excedente por el **waterfall de `evaluar_coinversion`** (devolución de capital → hurdle 8% → split 80/20). El Excel calcula el flujo del proyecto y arroja el valor distribuible **D**; la skill reparte **D**. Un solo idioma económico.
3. **Impuestos:** IRE 10% (no 25%); verificar ITI, sellos 1,8% e IVA según corresponda a la operación real.
4. **Ingresos:** cerrar la ventana de cobro o registrar la cuenta por cobrar al cierre; no perder ~$1,67M.
5. **Datos reales:** recién con superficie, precio de terreno, costo de obra y precios de venta por tipología del **proyecto concreto** (no genéricos), el modelo puede tocar a un inversor.
6. **Stress-test obligatorio antes de presentar:** base / adverso (venta −10%, obra +15%, absorción +6 meses) / favorable, reportando TIR del desarrollador y del inversor bajo hurdle+carry en cada escenario.

---

## 6. Estado del pendiente

| Ítem | Estado |
|---|---|
| Auditar `flujo_fondos_fideicomiso.xlsx` | ✅ **Resuelto** (este reporte) |
| Errores de lógica identificados | 4 (2 críticos, 1 de datos, 1 a reconciliar) |
| Viabilidad bajo supuestos genéricos | ❌ Negativa (−1,4 a −3,1M) |
| Decisión hurdle+carry | ✅ Validada por la auditoría |
| Próximo paso | Reconstruir el modelo con datos reales + motor de `meridiano-rentabilidad` |

*Auditoría interna — Meridiano Capital. El modelo original no debe presentarse a inversores en su estado actual.*
