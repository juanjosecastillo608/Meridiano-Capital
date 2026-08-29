---
name: target-yield-tools
description: >-
  Herramientas inversas de negociacion (SS45-47): dado un yield neto
  objetivo, calcula el MAXIMUM PURCHASE PRICE (precio maximo de compra); dado
  un precio de compra y un yield objetivo, calcula el RENT REQUIRED
  (alquiler necesario) y lo compara contra el MARKET RENT del AMC sin nunca
  ajustar el mercado para que "de bien" (SS47). USAR SIEMPRE que se pregunte
  "a que precio me conviene comprar esto", "que alquiler necesito para que
  rinda X%", o "el objetivo del inversor es realista contra el mercado".
---

# target-yield-tools (SK-17)

Skill de la capa SKILLS. Implementa SS45-47 de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`
(D-084) — quinto módulo construido de esa especificación, después de
`rental-amc-engine` (SK-14), `project-unit-database` (SK-15) y
`geocoding-engine` (SK-16).

## Principio rector

> **SS47 — no manipular el mercado.** Si `RENT REQUIRED > MARKET RENT`, se
> informa la brecha explícitamente. **Nunca** se ajusta el precio de mercado
> ni la renta de mercado para que el objetivo del inversor "dé bien".

## Qué hace y por qué no itera

Reutiliza — no duplica — `production/app/backend/calculadora.py`
(`Calculadora.evaluar_renta()`) para toda la lógica de gastos/impuestos, con
el mismo patrón de import entre paquetes que ya usa `dev_engine` con
`calculadora.py`. La inversión es **exacta, en un solo paso, sin buscar por
tanteo**, porque en `evaluar_renta()` todas las líneas de gasto son un
porcentaje de la renta (nunca del precio):

- `neto_anual` **no depende del precio de compra** → el precio máximo se
  despeja directo: `precio_max = neto_anual / (target_yield_neto% / 100)`.
- `neto_anual` **es lineal en la renta** → el alquiler requerido se despeja
  calibrando la pendiente con una corrida de referencia, sin iterar.

Cada resultado se verifica re-evaluando con `evaluar_renta()` al precio o
alquiler resultante — el `yield_neto_verificado_pct` del output siempre debe
coincidir con el objetivo pedido; si no coincide, es un bug de este script,
nunca del motor original (que no se tocó).

## Cuándo usar esta skill

- "¿A qué precio me convendría comprar esta unidad para que rinda X% neto?" → `precio-maximo`.
- "¿Qué alquiler necesito para que esta compra rinda X% neto?" → `alquiler-requerido`.
- Antes de decirle a un inversor que su objetivo de rentabilidad es alcanzable — comparar siempre contra la `renta_mercado` de un AMC real (`rental-amc-engine`, SK-14), no asumirlo.

## Cómo ejecutarla

```bash
python skills/target-yield-tools/herramientas.py precio-maximo \
  --clase departamento_amoblado --renta-mensual-mercado 618 --target-yield-neto 8 --nivel-neto 3

python skills/target-yield-tools/herramientas.py alquiler-requerido \
  --clase departamento_sin_muebles --precio-compra 110000 --target-yield-neto 8 --nivel-neto 3 \
  --renta-mercado-low 484 --renta-mercado-base 618 --renta-mercado-high 817
```

`--renta-mercado-base/low/high` en `alquiler-requerido` son opcionales — sin
ellos, el comando solo devuelve `rent_required_usd_mes`, sin la comparación
SS47. Pásalos siempre que exista un AMC real (`rental-amc-engine`) para esa
unidad, en vez de omitir la comparación.

## Probado contra un caso real — Unidad 105, UON Calathea

Con la renta de mercado real del AMC (D-086, `base_usd_mes` = 618) y un
objetivo de 8% neto: `precio-maximo` da **USD 55.759** — muy por debajo de
los USD 110.000 del precio real, consistente con el hallazgo ya documentado
de que esa unidad no pasa el piso a ese precio. `alquiler-requerido` al
precio real (USD 110.000) da **USD 1.219,17/mes** — muy por encima del
`MARKET RENT` base (USD 618), dispara la advertencia SS47 automáticamente.

## Reglas no negociables al presentar un resultado

1. **Mostrar siempre `yield_neto_verificado_pct`** junto al resultado — es la prueba de que el número no se inventó, se derivó y se verificó contra el mismo motor de cálculo real.
2. **Si `advertencia` viene poblada** (neto_anual o pendiente ≤ 0), decirlo explícitamente — no existe un precio/alquiler válido bajo esos supuestos, no forzar un número igual.
3. **Nunca ocultar `ss47_advertencia`** cuando aparece — es la regla central de esta skill (SS47), no un detalle opcional.
4. **`--gastos-reales` debe ser el mismo JSON de overrides que usaría `evaluar_renta()` directamente** — no inventar una sintaxis nueva, es un paso a través a `Calculadora.evaluar_renta(gastos_reales=...)`.

## Dependencias

- `production/app/backend/calculadora.py` (`Calculadora.evaluar_renta()`) — toda la lógica de gastos/impuestos vive ahí, esta skill solo la invierte.
- `skills/rental-amc-engine/` (SK-14) — fuente real de `renta_mensual_mercado`/`renta-mercado-*`, nunca inventarla acá.

## Relación con otras skills/workflows

- Quinta pieza construida de `documentation/investment-sales-rental-market-engine/00-especificacion-v1.md` (D-084).
- Complementa a `rentabilidad-calculator` (SK-03)/`calculadora.py` — ese motor va de (precio, renta) → yield; esta skill va de (yield objetivo, uno de los dos) → el otro.

## Qué queda pendiente, explícitamente

1. **SS48 (inversión en amoblamiento) no está integrado acá** — si la unidad es amoblada, el `precio_compra`/`renta_mensual` que se le pase a esta skill debe incluir ya el criterio de amueblamiento de `knowledge-base/investment/08-costos-de-amueblamiento.md` (D-068); esta skill no lo suma por sí sola.
2. **Sin comando que combine ambas herramientas en un solo informe** — hoy son dos comandos independientes; el informe de 30 puntos (SS51) todavía no las integra automáticamente.
