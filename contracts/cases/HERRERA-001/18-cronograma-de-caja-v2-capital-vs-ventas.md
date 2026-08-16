Estado: CURRENT — cronograma de caja v2 (ajuste del founder), y hasta qué mes cubre el capital propio antes de necesitar ventas
Fuente original: instrucciones del founder, 2026-08-16 (ajuste sobre `16-cronograma-de-caja-mensual.md`)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-16

# Cronograma de caja v2 — capital propio vs. ingreso por ventas

## 1. El ajuste, reemplaza a `16-cronograma-de-caja-mensual.md`

*"Al mes 1 solo cargamos el valor de compra más un 5% del total del presupuesto para arrancar. (...) Ahora vamos a distribuir los meses 2, 3, 4 un 10% del total del presupuesto cada mes. Seguimos en los meses 5 al 12 distribuyendo en partes iguales el aporte de capital hasta finalizar el proyecto."*

Corrige `16-...md` (que tenía mes 1 = 20%+10%=30%, meses 2-3=10%, meses 4-12 repartiendo el resto). **Nuevo cronograma de gasto**, sobre el presupuesto de construcción (Inversión Total menos adquisición, `14-...md`):

| Mes | % del presupuesto de construcción |
|---|---|
| 1 | Adquisición + **5%** |
| 2, 3, 4 | **10%** cada uno (30% total) |
| 5 a 12 (8 meses) | resto (65%) repartido en partes iguales → **8,125%** cada uno |

## 2. Cuándo se necesita el ingreso de ventas — la pregunta que pidió marcar el founder

*"Siempre vamos a controlar nuestro horizonte de que los inversores con el 70% del aporte del capital podamos distribuirlo en los 12 meses, y ese 30% restante lo vamos a distribuir con ingresos por ventas desde el mes 4 — dado que los primeros meses, al ser una obra que se inició y luego no continuó, tenemos que generar la confianza primero y luego vendrán las ventas."*

Dos reglas de fondeo, distintas del cronograma de gasto de la sección 1: **capital propio = 70% de la Inversión Total**, disponible para distribuirse en cualquier momento de los 12 meses; **ingreso por ventas = 30% de la Inversión Total**, pero **no disponible antes del mes 4** — el founder explica por qué: siendo una obra que ya se había iniciado y quedó parada, hace falta mostrar avance real primero (recuperar la confianza del comprador) antes de que las ventas empiecen a entrar.

### 2.1 Hasta qué mes cubre el capital propio (categoría B — calculado)

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Inversión Total | USD 2.824.581,03 | USD 3.009.806,32 | USD 3.273.623,59 |
| Capital propio (70%) | USD 1.977.206,72 | USD 2.106.864,42 | USD 2.291.536,51 |
| Meta de ventas (30%) | USD 847.374,31 | USD 902.941,90 | USD 982.087,08 |
| **Gasto acumulado a fin de mes 6** | USD 1.861.972,78 (65,9% de IT) | USD 1.956.900,74 (65,0%) | USD 2.092.107,09 (63,9%) |
| **Gasto acumulado a fin de mes 7** | USD 2.022.407,49 (71,6% de IT) | USD 2.132.385,00 (70,8%) | USD 2.289.026,51 (69,9%) |
| **Mes en que el gasto acumulado supera el 70% (capital propio)** | **Mes 7** | **Mes 7** | **Mes 8** |

**Con este cronograma de gasto, el capital propio (70%) alcanza para cubrir todo el proyecto hasta el mes 7 (Ángulo 1/3) o mes 8 (Ángulo 2), sin necesitar todavía ni un dólar de venta.** Como las ventas ya están disponibles desde el mes 4 (sección 2), hay un **margen real de 3 a 4 meses** entre cuándo las ventas empiezan a poder entrar (mes 4) y cuándo el capital propio realmente se termina (mes 7-8) — el proyecto no depende de que las ventas arranquen puntualmente en el mes 4 para no quedarse sin caja; si las ventas se demoran (razonable, dado que hay que "generar confianza" primero), el capital propio solo tiene que cubrir 3-4 meses más de lo mínimo, no todo el proyecto.

### 2.2 Lectura

**No hay una tensión de caja real bajo este cronograma ajustado** — a diferencia de `16-...md` (que sí mostraba una posible tensión en el mes 1 con el esquema anterior de 20%+10%), el ajuste a 5% en el mes 1 resuelve ese problema: el gasto de arranque es mucho más liviano, y el capital propio solo se termina de agotar recién en el mes 7-8, bien después de que las ventas empiecen a estar disponibles (mes 4). **Desde el mes 7 (Ángulo 1/3) o mes 8 (Ángulo 2) en adelante, el proyecto sí depende de que las ventas hayan entrado** — si para ese mes las ventas todavía no alcanzaron el monto necesario, ahí sí habría un problema real de caja.

## 3. Qué queda pendiente

1. **Confirmar si "ese 30% restante lo vamos a distribuir con ingresos por ventas desde el mes 4" significa que las ventas deben cubrir exactamente el 30% acumulado desde el mes 4 en adelante**, o si es más flexible (las ventas entran cuando entran, mientras el capital cubra el resto) — la sección 2.2 asume lo segundo (más realista), no una obligación estricta de que el 30% completo esté disponible ya en el mes 4.
2. **Cruzar esto contra el ritmo de venta ya confirmado** (`11-ritmo-de-venta-y-piso-de-plusvalia.md`: 30% lanzamiento/40% obra/30% finalización) — el "lanzamiento" ahora tendría que ubicarse a partir del mes 4, no en el mes 1, dado que las ventas no arrancan antes de generar confianza. Esto todavía no se modeló en detalle mes a mes.
3. Con el esquema de financiamiento de compradores (`19-...md`), recién se puede modelar el COBRO real (no solo la venta nominal) mes a mes, porque cada venta trae consigo un flujo de cuotas, no un pago único.
