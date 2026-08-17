---
name: market-intelligence-lookup
description: >-
  Consulta unificada sobre TODAS las bases de Market Intelligence de Meridiano
  Capital (alquiler tradicional, Airbnb, precio de venta, comparables reales,
  categoria de zona) filtrando por barrio y tipologia -- sin tener que abrir
  CSV por CSV a mano ni releer los 39 archivos de un caso anterior. USAR
  SIEMPRE al arrancar el analisis de un proyecto nuevo, antes de salir a
  investigar de cero: primero preguntale al sistema que ya sabe de esa zona.
  Tambien usar cuando se pida "que datos tenemos de [barrio]", "hay
  comparables de [zona]", o para verificar cobertura antes de reportar un
  dato como pendiente.
---

# market-intelligence-lookup (SK-11)

Skill de la capa SKILLS. Es la puerta de entrada a `knowledge-base/investment/market-intelligence/` — la regla **"nuevo proyecto ≠ nueva base"** (§26 del prompt maestro Real Estate Intelligence OS, ya vigente en el patrón "cross-cutting" del `DECISION_REGISTER.md`) se cumple concretamente corriendo esta consulta antes de investigar nada desde cero.

## Principio rector

> Antes de salir a buscar en la web o de re-derivar un dato que YA está en el sistema, consultá primero. Si la consulta no trae nada, ahí sí hay que investigar — y lo que se encuentre se agrega a la base correspondiente (no se deja solo en el caso puntual), siguiendo el patrón cross-cutting ya establecido.

## Cuándo usar esta skill

- Al arrancar el análisis de cualquier proyecto nuevo — primer paso, antes de cualquier otra investigación.
- "¿Qué datos tenemos de [barrio]?"
- "¿Hay comparables reales de [zona]?"
- Para verificar honestamente si un dato es realmente D (pendiente) o ya existe en otra base y no se consultó.

## Cómo ejecutarla

```bash
python skills/market-intelligence-lookup/consultar.py --barrio "Luis A. de Herrera"
python skills/market-intelligence-lookup/consultar.py --barrio "Ycua Sati" --tipologia "1 dormitorio"
python skills/market-intelligence-lookup/consultar.py --barrio "Herrera" --dataset comparables
```

Busca sin distinguir tildes/mayúsculas, por coincidencia parcial del nombre de barrio, sobre los 5 datasets de `market-intelligence/`: `rentals`, `airbnb`, `sales`, `comparables`, `neighborhoods`. Filtra automáticamente las filas categoría D vacías (sin dato real) para no ensuciar el resultado — el campo `_resumen.nota` avisa cuando eso pasó.

## Reglas no negociables al presentar un resultado

1. **Si `total_resultados_con_dato_real` es 0, decirlo explícitamente** — "no hay datos cargados de esta zona todavía" — nunca inventar un valor ni asumir que se parece a otra zona sin decirlo.
2. **Presentar siempre la `Categoria de dato`, `Confianza` y `Fuente` de cada fila**, no solo el número — un dato categoría C/LOW no tiene el mismo peso que uno A/HIGH.
3. Si el resultado viene de `comparables`, recordar que son precios de **lista**, no de cierre (ver `knowledge-base/investment/market-intelligence/sources/SOURCE_REGISTRY.md`).
4. Cuando la consulta no trae nada y hay que salir a investigar, **el dato nuevo se agrega al CSV correspondiente** (no solo a un archivo de caso) — mismo patrón cross-cutting de D-063 a D-073.

## Dependencias

- `knowledge-base/investment/market-intelligence/*/data/*.csv` — las 5 bases que consulta.
- `knowledge-base/investment/market-intelligence/sources/SOURCE_REGISTRY.md` — para interpretar el nivel de confiabilidad de la fuente de cada resultado.

## Relación con otras skills/workflows

- Primer paso de `workflows/nuevo-proyecto-inmobiliario/` (WF-03, el "comando maestro").
- Alimenta a `construction-cost-engine` (SK-12) y `market-price-validation` (SK-13) cuando la consulta trae comparables o costos.
