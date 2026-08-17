---
name: market-price-validation
description: >-
  Valida un precio de venta propuesto (USD/m2) contra los comparables reales
  de knowledge-base/investment/market-intelligence/comparables/, clasificando
  el resultado como BELOW MARKET / MARKET / ABOVE MARKET / SIGNIFICANTLY
  ABOVE MARKET. USAR SIEMPRE que se pida verificar si un precio de venta
  esta alineado con el mercado, o antes de fijar/confirmar una politica de
  precios para un desarrollo nuevo.
---

# market-price-validation (SK-13)

Skill de la capa SKILLS. Implementa `knowledge-base/investment/methodologies/market-price-validation-engine.md` sobre los comparables reales de `market-intelligence/comparables/`.

## Principio rector

> Nunca declarar que un precio "está bien" o "está caro" de memoria o por intuición — correr la validación contra los comparables reales, mostrar el rango completo y la clasificación, y dejar la decisión final de negocio al founder (esta skill clasifica, no decide).

## Cuándo usar esta skill

- "¿El precio que estamos usando está alineado con el mercado?"
- Antes de cerrar la política de precios de un proyecto nuevo.
- Cuando aparezcan comparables nuevos y haga falta re-verificar una política ya vigente (mismo patrón que `HERRERA-001/37-...md` → `38-...md`).

## Cómo ejecutarla

```bash
python skills/market-price-validation/validar.py --barrio "Ycua Sati" --precio-m2 1950
python skills/market-price-validation/validar.py --barrio "Herrera" --tipologia "1 dormitorio" --precio-m2 1900
```

Filtra `market-intelligence/comparables/data/comparables-venta-en-pozo-asuncion.csv` por barrio (y tipología si se pasa), excluye outliers estadísticos (rango intercuartílico) y clasifica el precio propuesto contra el rango resultante.

## Reglas no negociables al presentar un resultado

1. **Si `comparables_encontrados` es 0, decirlo explícitamente** — "sin comparables reales de esta zona" — nunca clasificar sin datos.
2. **Mostrar siempre `comparables_excluidos_como_outlier`** — la exclusión automática (IQR) es una heurística estadística, no un juicio humano; el analista debe confirmar que tiene sentido excluir ese comparable específico (ver `comparable-selection-engine.md` §3) antes de aceptar la clasificación final.
3. El umbral que separa `ABOVE MARKET` de `SIGNIFICANTLY ABOVE MARKET` (15%) es un **criterio provisional documentado**, no una regla del founder — decirlo así si se pregunta de dónde sale ese número.
4. Recordar siempre que los comparables son **precio de lista**, no de cierre real.

## Dependencias

- `knowledge-base/investment/market-intelligence/comparables/data/comparables-venta-en-pozo-asuncion.csv`
- `knowledge-base/investment/methodologies/comparable-selection-engine.md`
- `knowledge-base/investment/methodologies/market-price-validation-engine.md`

## Relación con otras skills/workflows

- Se corre después de `market-intelligence-lookup` (SK-11).
- Complementa a `rentabilidad-calculator` (SK-03): esta skill valida el precio de venta contra mercado, la otra calcula el retorno una vez fijado el precio.
