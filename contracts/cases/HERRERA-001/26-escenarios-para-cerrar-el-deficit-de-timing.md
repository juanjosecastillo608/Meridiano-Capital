Estado: CURRENT — 3 escenarios para cerrar el déficit de timing (Camino 1 puro, Camino 2 puro con anticipo 40%, y Mix)
Fuente original: instrucciones del founder, 2026-08-16
Dominio: INVESTMENT (caso HERRERA-001) — el esquema de anticipo 40/50/10 es una variante del esquema estandarizado D-067
Incorporado: 2026-08-16

# Escenarios para cerrar el déficit de timing

## 0. Lo que pidió el founder

*"Vamos a hacer 2 escenarios y/o un mix entre los caminos 1 y 2. Para el camino 2, una opción inteligente para que las cuotas sean más bajas y además mejoremos el flujo es que el anticipo sea del 40%, manteniendo el resto de la regla igual."*

**Interpretación del "resto de la regla igual"**: el esquema de compradores pasa de **20% entrega / 70% cuotas / 10% entrega física** (D-067) a **40% entrega / 50% cuotas / 10% entrega física** — el anticipo sube 20 puntos, y esos 20 puntos salen de la porción de cuotas (70%→50%), no del 10% final (que se mantiene igual, contra la entrega física). La fórmula de cuotas decrecientes (cuotas = plazo − mes de compra, `19-...md` §3) **no cambia** — sigue igual, solo que ahora reparte un 50% en vez de un 70%, lo que efectivamente hace **cada cuota más baja** (menos monto total repartido entre la misma cantidad de cuotas).

## 1. Escenario 1 — Camino 1 puro (más capital propio, sin tocar el esquema de compradores)

Se mantiene el esquema 20/70/10 sin cambios. Se sube el capital propio lo justo para cubrir el déficit exacto detectado en `25-...md`:

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Déficit a cubrir (con 70% capital propio) | USD 170.849 | USD 177.524 | USD 187.031 |
| **Capital propio necesario (nuevo total)** | **USD 2.148.056** | **USD 2.284.389** | **USD 2.478.568** |
| **% de la Inversión Total** | **76,05%** | **75,90%** | **75,71%** |
| Ventas necesarias (sin cambios) | 30% de IT | 30% de IT | 30% de IT |

**Sube el capital propio de 70% a ~76% de la Inversión Total** — el esquema de compradores no cambia (las cuotas siguen siendo las mismas de siempre).

## 2. Escenario 2 — Camino 2 puro (anticipo 40%, capital propio en 70%)

Se cambia el esquema de compradores a 40/50/10, se mantiene el capital propio en 70% (sin aporte extra):

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Mes en que se agota el capital propio | Mes 10 (antes mes 9) | Mes 10 | Mes 10 |
| **Déficit residual** | **USD 123.373** | **USD 126.935** | **USD 132.008** |

**El anticipo del 40% mejora el flujo, pero no lo cierra del todo** — el déficit baja de ~USD 171.000–187.000 a ~USD 123.000–132.000 (una reducción de aproximadamente 28%), y el mes de agotamiento se corre un mes (de 9 a 10) — pero sigue quedando un déficit real que este escenario, por sí solo, no cubre.

## 3. Escenario Mix — Camino 2 (anticipo 40%) + el capital extra que todavía haga falta

Combina ambos caminos: primero se aplica el anticipo del 40% (Escenario 2), y sobre el déficit **residual** que queda (no sobre el déficit original) se suma el capital propio necesario:

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Déficit residual tras el anticipo 40% | USD 123.373 | USD 126.935 | USD 132.008 |
| **Capital propio necesario (nuevo total)** | **USD 2.100.580** | **USD 2.233.799** | **USD 2.423.544** |
| **% de la Inversión Total** | **74,37%** | **74,22%** | **74,03%** |
| Ventas necesarias (con anticipo 40%) | ~25,6% de IT | ~25,8% de IT | ~26,0% de IT |

## 4. Comparación de los tres escenarios

| | Escenario 1 (solo más capital) | Escenario 2 (solo anticipo 40%) | **Escenario Mix** |
|---|---|---|---|
| Esquema de compradores | 20/70/10 (sin cambios) | **40/50/10** | **40/50/10** |
| Capital propio necesario (Ángulo 1, referencia) | USD 2.148.056 (76,05% de IT) | USD 1.977.207 (70%, sin cambios) | **USD 2.100.580 (74,37% de IT)** |
| ¿Cierra el déficit por completo? | Sí | No (queda ~USD 123.000) | Sí |
| Cuotas mensuales del comprador | Sin cambios | **Más bajas** (50% repartido, no 70%) | **Más bajas** (igual que Escenario 2) |

**El Mix pide menos capital propio adicional que el Escenario 1 puro** (USD 123.373–132.008 de capital extra, contra USD 170.849–187.031 del Escenario 1) **y además logra el objetivo adicional que buscaba el founder con el Camino 2** (cuotas más bajas para el comprador) — es la combinación más eficiente de las tres, en el sentido de que resuelve el déficit con el menor aporte de capital propio adicional, sin dejar de mejorar la propuesta comercial para el comprador.

**No se elige un escenario por cuenta propia** — quedan los tres construidos y comparables, a la espera de que el founder confirme cuál usar (o si prefiere ajustar algún parámetro, como el % exacto de capital extra o el % de anticipo).

## 5. Qué queda pendiente

1. **Confirmación del founder sobre qué escenario usar** — Camino 1 puro, Camino 2 puro, o el Mix (sección 4).
2. **Si se elige el esquema 40/50/10**, decidir si reemplaza el 20/70/10 (D-067) como norma estándar para todos los proyectos de Meridiano, o si es una variante puntual solo para Herrera dado el déficit detectado — el founder lo planteó como "una opción inteligente" para este problema puntual, no necesariamente para reemplazar la norma general.
3. Con el escenario elegido, construir el flujo de caja mensual detallado (tabla mes a mes, como `24-...md`) del escenario final, y recién ahí armar los tres escenarios de venta/retención del flujo de fondos completo (`10-...md` §5).
