# Metodología de cálculo — meridiano-rentabilidad

Este documento explica *cómo* y *por qué* se calcula cada número. Leerlo cuando haya que explicarle el cálculo a un inversor o auditar un resultado.

## 1. Las dos TIR — por qué son distintas y por qué van juntas

Toda operación de capital se presenta con dos TIR, porque cuentan historias distintas y las dos son verdad.

### TIR sobre precio total
Trata la inversión como si el inversor hubiera pagado el precio completo el día uno y cobrara la venta al salir. Es el retorno anual compuesto (CAGR):

```
TIR_precio_total = (valor_salida / precio_entrada) ^ (12 / meses) − 1
```

Es la cifra **conservadora y honesta**. No infla nada.

### TIR sobre capital desembolsado
Es la TIR real (IRR) del flujo de caja efectivo: el inversor no paga todo al inicio, paga una entrega y luego cuotas durante la obra. Su capital comprometido promedio es mucho menor que el precio total durante casi toda la obra.

Se calcula construyendo el flujo mensual real (entrega en el mes 0, cuotas mes a mes, y el cobro de la venta al salir) y hallando la tasa que hace su valor presente neto igual a cero (IRR), anualizada.

Es la cifra **real que experimenta el inversor**, y suele ser 5-6 puntos más alta. Esa diferencia es la **financiación implícita** que da el desarrollador: controlás un activo de valor 100 habiendo desembolsado, en promedio, mucho menos.

### Por qué juntas
Mostrar solo la de capital desembolsado parece humo; mostrar solo la de precio total subestima el negocio real. Juntas son a la vez transparentes y persuasivas. Es la misma filosofía del bruto+neto en renta.

## 2. Por qué el plazo de obra es una variable, no una banda

La plusvalía de la matriz es **total, no anual**. La misma plusvalía rinde muy distinto según cuánto tiempo estuvo el capital comprometido:

- 45% en una torre de 36 meses ≈ 10,9% anual
- 45% en una torre de 48 meses ≈ 8,5% anual

Por eso el motor toma el plazo de obra en meses como input y anualiza caso por caso. **El veredicto contra el piso se hace sobre la TIR anualizada, no sobre la plusvalía total.** Un número absoluto grande sobre un horizonte largo puede ser peor negocio anual que uno chico sobre un horizonte corto.

## 3. Por qué el yield de renta va sobre el precio de compra real

El retorno es sobre el capital que el inversor efectivamente puso, no sobre el precio de lista de mercado. Un mismo departamento que renta 950/mes "rinde" distinto según a qué precio se compró:

- Comprado a 120.000 (lista): ~4,8% neto → candidato a venta, no a renta
- Comprado a 75.000 (pozo temprano): ~7,8% neto → pasa el piso de renta

El denominador correcto es lo que revela si un activo es una estrella de renta o un candidato a plusvalía.

## 4. Los cuatro niveles de neto

El neto no es un número: es función del servicio que el cliente contrata. Cada nivel descuenta más y baja el yield, pero el cliente se despreocupa más. El motor descuenta línea por línea según el nivel (ver `evaluar_renta`), y el impuesto a la renta se aplica sobre el neto, no sobre el bruto. Detalle de qué entra en cada nivel: `politica-completa.md` sección 3.

## 5. Reventa temprana — la aritmética de la cesión

Cuando el inversor cede el boleto antes de terminar de pagar:
- Desembolsó solo entrega + cuotas hasta la fecha de cesión.
- La posición vale más (apreciación post-lanzamiento).
- El comprador de la cesión asume el saldo pendiente.
- El cedente cobra: valor de la posición − saldo pendiente.

La TIR se dispara porque la ganancia se mide sobre el capital chico efectivamente desembolsado, sobre un horizonte corto. Es una jugada de velocidad (plusvalía absoluta chica, TIR altísima), no de magnitud. Riesgos en `politica-completa.md` sección 4.6.

## 6. Auditoría del motor

La TIR se calcula por bisección robusta (busca cambio de signo del VPN y converge). Verificaciones de sanidad:
- Flujo −100 → +121 en 24 meses debe dar ≈10% anual.
- CAGR 100→125 en 24 meses ≈ 11,8%.
- CAGR 100→140 en 48 meses ≈ 8,8%.

Si estos casos base no dan estos valores, el motor está roto y no se debe confiar en ningún resultado.
