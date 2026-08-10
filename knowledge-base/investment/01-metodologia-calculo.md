```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-rentabilidad/references/metodologia-calculo.md (cotejado contra inventory/_raw-copies/meridiano-rentabilidad/scripts/calculadora.py)
Dominio: INVESTMENT
```

# Metodología de cálculo — meridiano-rentabilidad

Este documento explica *cómo* y *por qué* se calcula cada número del motor de rentabilidad. Léase cuando haya que explicarle el cálculo a un inversor o auditar un resultado.

Reconstruido a partir del documento de metodología original **y verificado línea por línea contra la implementación real** (`scripts/calculadora.py`) para asegurar que la documentación describe exactamente lo que el código hace. Donde documentación y código no coinciden, se marca `> UNRESOLVED: doc/code mismatch`.

---

## 1. Las dos TIR — por qué son distintas y por qué van juntas

Toda operación de capital se presenta con dos TIR, porque cuentan historias distintas y las dos son verdad.

### TIR sobre precio total

Trata la inversión como si el inversor hubiera pagado el precio completo el día uno y cobrara la venta al salir. Es el retorno anual compuesto (CAGR):

```
TIR_precio_total = (valor_salida / precio_entrada) ^ (12 / meses) − 1
```

Es la cifra **conservadora y honesta**. No infla nada.

Implementación real (`cagr()` en `calculadora.py`):

```python
def cagr(valor_inicial, valor_final, meses):
    anos = meses / 12.0
    return (valor_final / valor_inicial) ** (1.0 / anos) - 1.0
```

Coincide exactamente con la fórmula documentada.

### TIR sobre capital desembolsado

Es la TIR real (IRR) del flujo de caja efectivo: el inversor no paga todo al inicio, paga una entrega y luego cuotas durante la obra. Su capital comprometido promedio es mucho menor que el precio total durante casi toda la obra.

Se calcula construyendo el flujo mensual real (entrega en el mes 0, cuotas mes a mes, y el cobro de la venta al salir) y hallando la tasa que hace su valor presente neto igual a cero (IRR), anualizada.

Es la cifra **real que experimenta el inversor**, y suele ser 5-6 puntos más alta que la TIR sobre precio total. Esa diferencia es la **financiación implícita** que da el desarrollador: el inversor controla un activo de valor 100 habiendo desembolsado, en promedio, mucho menos.

Implementación real: `construir_cronograma()` genera el vector de pagos mensuales (entrega inicial en el mes 0 + cuotas iguales sin interés durante la obra), se le antepone el signo negativo (egresos), se agrega el cobro de la venta en el mes de salida, y `tir()` calcula la tasa periódica por bisección robusta sobre ese flujo; `anualizar()` la convierte a tasa anual efectiva: `(1 + tasa_mensual)^12 − 1`.

### Por qué van juntas

Mostrar solo la de capital desembolsado parece humo; mostrar solo la de precio total subestima el negocio real. Juntas son a la vez transparentes y persuasivas. Es la misma filosofía del bruto+neto en renta.

---

## 2. Por qué el plazo de obra es una variable, no una banda

La plusvalía de la matriz (ver `02-politica-de-rentabilidad.md`) es **total, no anual**. La misma plusvalía rinde muy distinto según cuánto tiempo estuvo el capital comprometido:

- 45% en una torre de 36 meses ≈ 10,9% anual
- 45% en una torre de 48 meses ≈ 8,5% anual

Por eso el motor toma el plazo de obra en meses como input y anualiza caso por caso. **El veredicto contra el piso se hace sobre la TIR anualizada, no sobre la plusvalía total.** Un número absoluto grande sobre un horizonte largo puede ser peor negocio anual que uno chico sobre un horizonte corto.

En el código, `evaluar_reventa()` recibe `meses_obra` como parámetro opcional; si no se pasa, usa el default `_plazo_obra_meses_referencia` de la matriz (24 para `tradicional`, 42 para `torre` — ver `03-parametros-de-mercado.md`). El horizonte total (`meses_total`) depende además de la etapa de ingreso:

- `pre_pozo`: `meses_obra + meses_hasta_pre_pozo` (default `meses_hasta_pre_pozo = 7`)
- `lanzamiento`: `meses_obra`
- `pozo_durante_obra`: `max(1, meses_obra // 2)` — asume entrada a mitad de obra

Y si la salida es `vende_mas_un_ano`, se suman 12 meses adicionales al horizonte antes de calcular ambas TIR.

> UNRESOLVED: doc/code mismatch (violación de arquitectura). El parámetro `meses_hasta_pre_pozo = 7` está hardcodeado como *default de función* dentro de `calculadora.py`, no vive en `config/parametros_mercado.json`. La política declarada en `SKILL.md` es que **todo** número de mercado vive únicamente en el archivo de configuración y que la lógica "no se toca al cambiar el mercado" — este valor rompe esa separación: si el mercado cambia el tiempo típico entre pre-pozo y lanzamiento, hay que editar el script, no el config.

---

## 3. Por qué el yield de renta va sobre el precio de compra real

El retorno es sobre el capital que el inversor efectivamente puso, no sobre el precio de lista de mercado. Un mismo departamento que renta 950/mes "rinde" distinto según a qué precio se compró:

- Comprado a 120.000 (lista): ~4,8% neto → candidato a venta, no a renta
- Comprado a 75.000 (pozo temprano): ~7,8% neto → pasa el piso de renta

El denominador correcto es lo que revela si un activo es una estrella de renta o un candidato a plusvalía.

En el código: `yield_bruto = (renta_mensual_bruta * 12) / precio_compra * 100`, y `precio_compra` es siempre un parámetro explícito de entrada — nunca se deriva de una lista de precios interna. Coincide con lo documentado.

---

## 4. Los cuatro niveles de neto

El neto no es un número: es función del servicio que el cliente contrata. Cada nivel descuenta más y baja el yield, pero el cliente se despreocupa más. El motor descuenta línea por línea según el nivel, y **el impuesto a la renta se aplica sobre el neto, no sobre el bruto**.

Estructura acumulativa (cada nivel incluye los descuentos del anterior), tal como implementada en `evaluar_renta()`:

- **Nivel 1 — Básico** (siempre, todos los niveles y clases): expensas, impuesto inmobiliario, IVA.
- **Nivel 2 — Administrado** (si `nivel_neto >= 2`): + honorarios de administración, honorarios de alquiler (0,5 mes).
- **Nivel 3 — Completo** (si `nivel_neto >= 3`): + seguro, mantenimiento, vacancia, y amortización de muebles si la clase es amoblada.
- **Nivel 4 — Temporal** (automático si la clase empieza con `temporal_`, ignora el parámetro `nivel_neto` recibido): stack propio — limpieza, seguros obligatorios, mantenimiento, canon de agencia, amortización de muebles, vacancia.

El impuesto a la renta (`impuesto_renta_pct`) se calcula siempre al final, sobre `max(0, neto_antes_de_impuesto)`, después de todos los demás descuentos — es decir, sobre el neto, tal como documentado. Coincide con lo documentado en cuanto a estructura y orden.

Detalle de qué entra en cada nivel según la política: `02-politica-de-rentabilidad.md` sección "Conceptos por nivel de neto".

### 4.1 Hallazgos al auditar la implementación del Nivel 4 (renta temporal)

> UNRESOLVED: doc/code mismatch — costo de limpieza hardcodeado. En la rama temporal de `evaluar_renta()`, el código calcula:
> ```python
> desglose["limpieza"] = bruto_anual * 12.0 / 100.0
> ```
> El `12.0` es un **número literal dentro de la lógica**, no un parámetro leído de `config/parametros_mercado.json` (no existe una clave `limpieza_pct` en el config). Esto contradice directamente el principio rector de arquitectura ("la lógica de cálculo NO se toca al cambiar el mercado"; "todos los parámetros de mercado viven en config"). Si el costo real de limpieza cambia, hoy solo se puede corregir editando el script.

> UNRESOLVED: doc/code mismatch — la ocupación realista NO se aplica al yield. La Política P07 (refinamiento #8, ver `02-politica-de-rentabilidad.md`) es explícita: la renta temporal debe modelarse con **ocupación realista 55-65% (nunca 90%+)**, y esto fue precisamente la corrección de un error detectado en un modelo auditado (Edificio Austria, que usaba 93%). Sin embargo, `evaluar_renta()` en su rama temporal **no usa en ningún momento** `renta_temporal_default.ocupacion_realista_pct` ni `ocupacion_underwriting_base_pct` del config. En su lugar, aplica el mismo `vacancia_pct` genérico (3% por defecto) que usa la renta tradicional:
> ```python
> desglose["vacancia"] = bruto_anual * s["vacancia_pct"] / 100.0
> ```
> Esto significa que, tal como está implementado hoy, una evaluación de `temporal_departamento` o `temporal_casa` **sobreestima materialmente el yield neto**, porque no descuenta la brecha entre ocupación de mercado real (55-65%) y ocupación asumida — a menos que quien llama a `evaluar_renta()` le pase manualmente un `renta_mensual_bruta` ya ajustado por ocupación (algo que ni la firma de la función ni la documentación del skill indican como obligatorio). Es el mismo tipo de error que la política dice haber corregido en el Edificio Austria, reintroducido en el motor.

> UNRESOLVED: doc/code mismatch (ambigüedad de política) — canon de agencia igual al honorario de administración pasiva. El código usa el mismo parámetro para ambos:
> ```python
> desglose["canon_agencia"] = bruto_anual * s["honorarios_administracion_pct"] / 100.0
> ```
> es decir, el "canon de agencia" de renta temporal (Urbannit) se calcula con el mismo 10% que el honorario de administración de renta pasiva tradicional (Cartera A). La política (refinamiento #9) distingue explícitamente estas dos categorías como negocios distintos con honorarios propios ("no confundir renta pasiva con operación"), y el config no define una clave separada de canon temporal — solo reutiliza `honorarios_administracion_pct`. No está claro si esto es intencional (el canon de agencia temporal *es* 10%, igual al de administración pasiva) o un parámetro faltante en el config.

> UNRESOLVED: capex de amoblado no modelado como flujo de caja inicial. `renta_temporal_default.capex_amoblado_usd_por_depto` (USD 4.500) existe en el config pero no se usa en `evaluar_renta()` ni en ningún otro método de `calculadora.py`. El yield neto solo descuenta `amortizacion_muebles_pct` (8% anual) como proxy del capex, sin modelar el desembolso inicial de amoblado como un egreso de capital. Puede ser una simplificación aceptada, pero no está documentada como tal en `metodologia-calculo.md` ni en la política.

---

## 5. Reventa temprana — la aritmética de la cesión

Cuando el inversor cede el boleto antes de terminar de pagar:

- Desembolsó solo entrega + cuotas hasta la fecha de cesión.
- La posición vale más (apreciación post-lanzamiento).
- El comprador de la cesión asume el saldo pendiente.
- El cedente cobra: valor de la posición − saldo pendiente.

La TIR se dispara porque la ganancia se mide sobre el capital chico efectivamente desembolsado, sobre un horizonte corto. Es una jugada de velocidad (plusvalía absoluta chica, TIR altísima), no de magnitud.

Implementación real (`evaluar_reventa_temprana()`), verificada contra la descripción:

```
capital_desembolsado   = suma de pagos (entrega + cuotas) hasta el mes de cesión (inclusive)
saldo_pendiente         = precio_entrada − capital_desembolsado
valor_posicion          = precio_entrada * (1 + apreciacion_pct / 100)
cobra_cedente            = valor_posicion − saldo_pendiente
ganancia                 = cobra_cedente − capital_desembolsado
```

La TIR sobre capital desembolsado se calcula construyendo el flujo `[-pago_mes_0, -pago_mes_1, ..., -pago_mes_cesión + cobra_cedente]` y aplicando `tir()` + `anualizar()`. Coincide exactamente con lo documentado.

Riesgos a advertir siempre: requiere edificio exitoso con demanda de cesión, que la apreciación ocurra, que el contrato permita ceder, y verificar el tratamiento fiscal (ver `02-politica-de-rentabilidad.md`).

---

## 6. Retorno combinado (renta + plusvalía) — el momento de compra

El concepto más importante para activos ya comprados: a precio de lista, la renta sola casi nunca llega al piso. El inversor que compró bien (en pozo) usa la **plusvalía para cubrir la brecha de renta**, y con el tiempo, si el alquiler sube, el yield sobre su costo original también sube.

```
RETORNO COMBINADO = yield de renta (neto) + plusvalía
```

Caso real validado (Habitalis Mburucuyá): compra pozo con cochera 90.000 + muebles 9.000 = costo 99.000; valor de venta hoy 120.000; renta 950/mes; tenencia 12 meses. Renta sola: 5,87% neto (piso 7,5% → no llega sola). Plusvalía: +21,2% en el año. Retorno combinado: 27,1% — inversión sólida por el momento de compra.

**Regla de interpretación:** si la renta sola no llega al piso pero la plusvalía cubre la diferencia, la operación es sólida — no rechazarla por mirar solo la renta.

Implementación real (`evaluar_retorno_combinado()`):

```
plusvalia_total_pct        = (valor_actual / precio_compra − 1) * 100
plusvalia_anualizada_pct   = cagr(precio_compra, valor_actual, meses_tenencia) * 100
renta_neta_acumulada        = neto_anual_de_renta * (meses_tenencia / 12)
apreciacion_absoluta        = valor_actual − precio_compra
retorno_periodo_pct         = (renta_neta_acumulada + apreciacion_absoluta) / precio_compra * 100
retorno_periodo_anualizado  = (1 + retorno_periodo_pct/100) ^ (12/meses_tenencia) − 1
```

El veredicto (`lectura`) sigue esta lógica, tal como está en el código:
1. Si la renta sola ya supera el piso → "Renta sola ya supera el piso. La plusvalía es upside adicional."
2. Si no, pero `plusvalia_total_pct >= |gap_vs_piso|` → "Renta sola por debajo del piso, pero la plusvalía ya cubre la diferencia con holgura. Inversión sólida por el momento de compra."
3. Si no → "Renta por debajo del piso; la plusvalía aún no cubre del todo la diferencia. Depende de apreciación futura o suba de alquileres."

Nota importante (documentada y coherente con el código): la plusvalía es una ganancia que se realiza una vez. El retorno combinado es altísimo el primer período (captura el salto pozo→terminado) y luego se normaliza a: renta sobre costo + apreciación de mercado futura. Si el mercado de alquileres sube, el yield sobre el costo original también sube con el tiempo.

---

## 7. Contradicción crítica: ¿los pisos de `pisos_renta_neta` son bruto o neto? — ✅ RESUELTA (D-033 + D-044)

> **Resuelta.** D-033 (2026-08-09) fijó el mecanismo: se compara siempre bruto vs. bruto. D-044 (2026-08-10) reemplazó los valores numéricos por datos reales ya en bruto (`Tabla de Rentabilidades Alquiler.xlsx`). Esta sección se conserva como registro histórico de la auditoría que detectó el problema — ver `investment/05-matriz-pisos-techos.md` para el estado vigente.

Este es el hallazgo más consecuente de la auditoría, porque afecta el veredicto `pasa_piso` que el motor le da a **toda** evaluación de renta.

**Evidencia de que son NETOS** (mayoritaria):
- La clave en el config se llama literalmente `pisos_renta_neta`.
- `SKILL.md` los llama explícitamente "Neto Completo" y "Neto Temporal".
- El caso validado Habitalis Mburucuyá compara "renta 5,87% **neto** (piso 7,5%)" — comparación net-vs-net.
- El código (`evaluar_renta()`) calcula `pasa_piso` comparando `yield_neto_pct >= piso`, es decir, compara el piso contra el yield **neto**, nunca contra el bruto.

**Evidencia de que son BRUTOS** (contradictoria, dentro del mismo archivo de config):
- El bloque `pisos_base_bruto_o_neto` del config, agregado como parte del refinamiento #10 de la política, dice literalmente: *"pisos_por_tipologia: BRUTO — rendimiento bruto mínimo aceptable por clase de activo (comercial 8, casa 6, depto s/muebles 6, amoblado 7.5, temporal depto 14, temporal casa 12)"* — son los mismos números, exactos, que `pisos_renta_neta`.
- Ese mismo bloque da, para renta temporal, un rango NETO separado y distinto: 8-11% neto (vs. bruto 10-16%) — y 14% (el piso "temporal_departamento") cae dentro del rango **bruto** (10-16%), no del rango neto (8-11%).
- Para renta tradicional, el mismo bloque da una referencia de contraste "neto 5-7%" — más bajo que los pisos 6/6/7,5/8 de `pisos_renta_neta`, sugiriendo de nuevo que esos pisos no son la cifra neta de referencia del propio config.

**Conclusión:** el material fuente se contradice a sí mismo. El código y la mayoría de los ejemplos tratan `pisos_renta_neta` como netos; el refinamiento #10, agregado después y validado con casos reales, los etiqueta como brutos y da una cifra neta distinta y más baja. No se puede resolver esta ambigüedad desde la documentación — requiere una decisión de negocio.

> UNRESOLVED: decidir con el dueño de la política (Meridiano Capital) si `pisos_renta_neta` en el config representa un piso BRUTO o NETO, y corregir la nomenclatura y/o la comparación en el código en consecuencia. Mientras no se resuelva, todo veredicto `pasa_piso` que produce el motor debe tomarse con esta reserva.

---

## 8. Auditoría del motor — casos de sanidad

La TIR se calcula por bisección robusta (busca cambio de signo del VPN y converge). Verificaciones de sanidad declaradas en la fuente original:

- Flujo −100 → +121 en 24 meses debe dar ≈10% anual.
- CAGR 100→125 en 24 meses ≈ 11,8%. (Verificado: `1.25^(1/2) − 1 = 0,1180`.)
- CAGR 100→140 en 48 meses ≈ 8,8%. (Verificado: `1.40^(1/4) − 1 = 0,0878`.)

Si estos casos base no dan estos valores, el motor está roto y no se debe confiar en ningún resultado. Estas verificaciones son consistentes con las fórmulas de `cagr()` y `tir()`/`anualizar()` mostradas arriba.

---

## Requisitos para el dominio de tecnología

La calculadora de la nueva app **debe implementar exactamente esta metodología**, incluyendo:

- Doble TIR (precio total vía CAGR + capital desembolsado vía IRR/bisección) mostradas siempre juntas para operaciones de capital.
- Yield bruto y neto siempre juntos para operaciones de renta, calculado sobre precio de compra real.
- Los cuatro niveles de neto acumulativos, con impuesto a la renta aplicado sobre el neto.
- Plazo de obra como input variable, nunca una constante embebida en la lógica.
- Todos los parámetros de mercado (incluyendo el costo de limpieza temporal, `meses_hasta_pre_pozo`, y cualquier otro número usado en las fórmulas) deben leerse de configuración — no hardcodearse en la lógica, corrigiendo los dos casos detectados en `calculadora.py`.
- La rama de renta temporal debe descontar la ocupación realista (55-65%) del config, no reutilizar el `vacancia_pct` genérico de 3%.
- Antes de dar por migrada la calculadora, resolver explícitamente la contradicción bruto/neto de la sección 7 con el negocio, y documentar la decisión.
