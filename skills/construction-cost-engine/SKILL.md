---
name: construction-cost-engine
description: >-
  Estima el costo de construccion (bajo/base/alto, USD/m2 y total) de un
  proyecto nuevo usando la tabla real de costos de Meridiano Capital
  (D-064) y, si aplica, la metodologia de netting estructura/terminacion
  para obras sobre una construccion parcial existente. USAR SIEMPRE que se
  pida estimar, presupuestar o calcular el costo de construccion de un
  proyecto o edificio -- nunca inventar un USD/m2 de memoria ni aproximar
  a ojo.
---

# construction-cost-engine (SK-12)

Skill de la capa SKILLS. Implementa `knowledge-base/investment/methodologies/motor-de-costos.md` — envuelve la tabla real de costos, nunca reimplementa cifras de memoria.

## Principio rector

> El costo de construcción sale siempre de la tabla real (D-064), nunca de una estimación genérica. Si el tipo de construcción o la calidad pedida no están en la tabla, el script lo dice explícitamente en vez de aproximar.

## Cuándo usar esta skill

- "¿Cuánto cuesta construir [tipo de edificio] en Asunción?"
- "Estimame el costo de terminar esta estructura parcial."
- Cualquier presupuesto de inversión que necesite un costo de construcción de base.

## Cómo ejecutarla

```bash
# Construcción 100% nueva
python skills/construction-cost-engine/estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 3200

# Sobre estructura parcial existente (requiere % de incidencia estructural de un ingeniero real del proyecto)
python skills/construction-cost-engine/estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 3200 --incidencia-estructural 21
```

Tipos de construcción disponibles en la tabla (D-064): `Tinglados / Depositos`, `Tinglados / Depositos con oficinas`, `Depositos con oficinas y locales comerciales`, `Edificios departamentos en altura`, `Casas / Duplex`, `Remodelacion sobre obra ya existente (casas/duplex/deptos)`.

## Reglas no negociables al presentar un resultado

1. **Siempre mostrar bajo/base/alto**, no solo un número — el rango es información real (usa las 3 tasas de calidad reales de la tabla, no un ± inventado).
2. **`--incidencia-estructural` nunca se completa con un default** — si el usuario no lo tiene confirmado por un ingeniero del proyecto, no correr esa rama; usar el costo directo (obra 100% nueva) y aclarar que la obra parcial requiere ese dato antes de presupuestar bien.
3. Presentar siempre `fuente` y `fecha_de_actualizacion_de_la_fuente` junto con la cifra.
4. Si `nivel_de_confianza` es `MEDIUM` (categoría con menos de 3 calidades en la tabla real), avisar explícitamente que el rango bajo/alto es más angosto de lo ideal.

## Dependencias

- Tabla de costos embebida (misma fuente que `knowledge-base/investment/market-intelligence/construction-costs/06-costos-de-construccion.md`, D-064) — si la tabla real cambia, actualizar ambos lugares juntos.
- `knowledge-base/investment/methodologies/netting-estructura-terminacion.md` — metodología de la rama `--incidencia-estructural`.

## Relación con otras skills/workflows

- Se corre después de `market-intelligence-lookup` (SK-11) al arrancar un proyecto nuevo.
- Alimenta al modelo financiero (`rentabilidad-calculator`, SK-03) como input de costo de entrada.
