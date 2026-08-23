Estado: CURRENT — corrige un error conceptual real en el IVA de venta, presente desde `36-...md` (2026-08-17). Sube el margen y el ROI de los 3 Ángulos, sustancialmente
Fuente: founder, 2026-08-23, con verificación independiente contra la DNIT (Dirección Nacional de Ingresos Tributarios) y Ley 125/91 Art. 82/91 — ver `knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md` para el mecanismo completo y las fuentes
Dominio: INVESTMENT (caso HERRERA-001)

# Corrección — IVA de venta es 1,5% efectivo, no 10% sobre costo de construcción

## 0. Qué pidió el founder

*"Tenemos un error conceptual en el sistema impositivo al verificar cómo aplica el 10% de impuestos. (...) la venta de departamentos nuevos (primera venta) efectivamente utiliza una base imponible parcial del 30% del valor de la operación para el cálculo del IVA (...) la tasa del impuesto aplicable a los inmuebles es del 5% (y no del 10%), lo que arroja una incidencia efectiva del 1,5% sobre el precio total. (...) Corregimos todo el sistema de cálculo de Meridiano y también de Herrera."*

## 1. El error, verificado

`36-recosteo-720-e-iva-desarrollador-margen-final-definitivo.md` (2026-08-17) fijó "IVA del desarrollador = 10% × Costo de construcción" — **doblemente equivocado**: usaba la tasa general de IVA (10%, la de la mayoría de bienes/servicios) en vez de la tasa reducida específica de inmuebles (5%), y la aplicaba sobre el costo de construcción en vez de sobre el precio de venta.

**Mecanismo correcto** (Ley 125/91 Art. 82, mod. Ley 2421/04, y Art. 91 — verificado contra el Portal Institucional de la DNIT):

> Base imponible presunta = 30% del precio de venta. Tasa = 5% (tasa reducida de inmuebles). Efectivo = 30% × 5% = **1,5% sobre el 100% del precio de venta**.

Ver `knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md` para el detalle completo, las fuentes citadas, y el nuance sin resolver del todo sobre reventa de portafolio por un no-constructor (§2 de ese documento).

## 2. Impacto en los 3 Ángulos — antes vs. después

Reconstruido con `production/app/backend/dev_engine/validar_herrera.py` — Inversión Total, Costo/m² y Comisión de venta **no cambian** (no dependen del IVA); solo cambian el IVA y el Margen:

| | Ángulo 1 (bajo–alto) | Ángulo 3 (bajo–alto) | Ángulo 2 (bajo–alto) |
|---|---|---|---|
| IVA del desarrollador — **antes** (10% s/construcción, fijo) | USD 189.560 | USD 189.560 | USD 211.160 |
| IVA del desarrollador — **corregido** (1,5% s/venta) | USD 53.515 – 63.272 | USD 57.308 – 61.459 | USD 66.371 – 71.237 |
| **Ahorro de IVA** | USD 126.288 – 136.045 | USD 128.101 – 132.253 | USD 139.923 – 144.790 |
| Margen final — **antes** | USD 436.259 – 1.051.008 | USD 489.990 – 751.518 | USD 784.541 – 1.091.147 |
| Margen final — **corregido** | **USD 572.305 – 1.177.296** | **USD 622.242 – 879.619** | **USD 929.331 – 1.231.069** |
| ROI sobre Inversión Total — **antes** | 15,9% – 38,3% | 16,7% – 25,6% | 24,6% – 34,3% |
| ROI sobre Inversión Total — **corregido** | **20,8% – 42,9%** | **21,2% – 30,0%** | **29,2% – 38,6%** |

**El Ángulo 2 sigue siendo la recomendación** — la corrección no cambia el ranking relativo entre Ángulos (Ángulo 2 sigue con el mayor margen absoluto y mejor ROI en el extremo conservador), solo mejora los tres de forma pareja porque el IVA es proporcionalmente similar en los tres diseños.

## 3. Qué se actualizó en el sistema

- `knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md` — metodología nueva, con fuentes.
- `knowledge-base/investment/03-parametros-de-mercado.md` — tabla `fiscal` corregida.
- `production/app/config/parametros_mercado.json` — `iva_venta_pct` (5.0, base 100%) reemplazado por `iva_venta_base_imponible_pct` (30.0) + `iva_venta_tasa_pct` (5.0) + `iva_venta_efectiva_pct` (1.5).
- `production/app/backend/calculadora.py` — `evaluar_reventa()` y `evaluar_reventa_temprana()` recalculan con el mecanismo de dos factores. **Esto afecta cualquier análisis de rentabilidad de Meridiano que use estas funciones, no solo HERRERA-001** — el error estaba en el motor general, no en el caso.
- `production/app/backend/test_calculadora.py`, `advertencias.py` — actualizados y re-verificados (`python3 test_calculadora.py` → OK).
- `production/app/backend/dev_engine/` — `parametros_dev_engine.json`, `validar_herrera.py`, `exportar_herrera_completo.py` corregidos.
- Los 4 documentos client-ready (Memorándum, Investor Book, Presentación de 10 slides, Investment Summary) — regenerados desde el JSON corregido, verificados visualmente.
- `governance/decisions/DECISION_REGISTER.md` — D-082, corrige D-027.

## 4. Lo que NO se resolvió del todo — honestidad sobre el límite de esta corrección

El mecanismo de 1,5% efectivo está bien verificado (fuente Nivel 1, DNIT) para la **primera venta de obra nueva por una persona jurídica** — exactamente el caso de HERRERA-001. Para los escenarios de **reventa de portafolio** que modela `calculadora.py` (`evaluar_reventa`, unidades ya adquiridas y no necesariamente "obra nueva"), queda una duda real sin cerrar: podrían estar exentas de IVA por completo (régimen IRP en su lugar) si no califican como venta habitual de una constructora. Se aplicó igual el 1,5% como mejor valor disponible — **recomendación explícita: llevar este punto puntual a la contadora de Meridiano antes de confiar en el número para un caso de reventa de portafolio real**.
