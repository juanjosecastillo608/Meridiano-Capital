Estado: CURRENT — motor construido, validado contra HERRERA-001 (6/6 dentro de tolerancia 0,05%), Fases 1-3 completas; generadores conectados y fuente de cotización real conectada (D-080, 2026-08-22)
Fuente original: prompt maestro "MERIDIANO CAPITAL — DEVELOPMENT COST & FINANCIAL ENGINE", founder, 2026-08-19
Dominio: TECHNOLOGY/INVESTMENT/GOVERNANCE

# Development Cost & Financial Engine — reporte final

Reporte final con las 16 secciones pedidas en §74 del prompt maestro. Código en
`production/app/backend/dev_engine/` (9 módulos + `README.md` propio + 3 scripts
ejecutables de test/demo). Config en `production/app/config/parametros_dev_engine.json`.

## 01 — SYSTEM AUDIT

Ver `00-auditoria-y-arquitectura-propuesta.md` §1. Resumen: 6 de los 14 módulos que
pedía el prompt maestro ya existían (`construction-cost-engine`, `market-price-validation`,
`market-intelligence-lookup`, `tir()`/`vpn()` de `calculadora.py`, `construir_cronograma()`,
`workflows/nuevo-proyecto-inmobiliario`) — se reutilizaron, no se duplicaron. Lo que
faltaba: jerarquía de costos estructurada, financing engine conectado al cash flow
real, cash flow mensual como motor (no como 4 tablas manuales sucesivas), capa
USD/PYG, e Investor Data Layer.

## 02 — DATA ARCHITECTURE

Paquete Python `production/app/backend/dev_engine/`, hermano de `calculadora.py`
(misma separación lógica/parámetros). 9 módulos: `moneda`, `costos`, `cashflow`,
`financiamiento`, `financiero`, `sensibilidad`, `escenarios`, `investor_layer`,
`proyecto` (orquestador). Dataclasses tipadas en cada módulo — nunca dicts sueltos
para datos estructurales. Ver `production/app/backend/dev_engine/README.md`.

## 03 — COST MODEL

`costos.py`: `EstructuraCostos` = Terreno + Directos + Indirectos + Desarrollo +
Comerciales + Impuestos + Contingencia (los Financieros se inyectan aparte, ver
§05). Cada partida indirecta/comercial/impuesto es un `ItemParametrizable` (fijo,
% de una base, o por m²) — nunca un número hardcodeado en el código.

## 04 — DIRECT COST MODEL

`GrupoPartidas` + `Partida` (código, categoría, cantidad, costo unitario con
moneda propia, fuente, estado). `costos.py` no reimplementa la tabla de costos de
construcción — para un proyecto nuevo, las partidas directas deberían poblarse
usando `skills/construction-cost-engine/estimar.py` (D-064) como fuente, no a mano.

## 05 — INDIRECT/FINANCING COST MODEL

Indirectos/Desarrollo: `GrupoParametrizable` (mismo patrón fijo/%/m² del punto 03).
Financieros: `financiamiento.py` — **nunca independiente del flujo real** (regla
explícita del founder, §12 del prompt maestro): gira deuda solo cuando el capital
propio ya se agotó ese mes, interés se acumula sobre saldo realmente adeudado,
amortiza automáticamente con el primer flujo positivo (ventas). Validado con tasas
25% vs. 5% → el motor de 25% da más costo financiero que el de 5%, con equity
insuficiente en ambos casos (`test_parametrizacion.py`).

## 06 — COST/m² MODEL

`EstructuraCostos.indicadores_por_m2()`: costo directo/indirecto/financiero/total
por m² construido, y costo total por m² **vendible** — cada uno con su superficie
explícita (`Superficies`), nunca un denominador ambiguo (S18).

## 07 — SALES PRICE MODEL

`cashflow.VentaUnidad` modela precio, etapa, anticipo/cuotas/saldo por unidad o
tramo de venta. El **Price Escalation Engine (S25)** y la **matriz de precio por
etapa (S24)** como módulos dedicados **no se construyeron todavía** — hoy se
modelan variando `precio_usd` manualmente por `VentaUnidad`. Pendiente real, ver §15.

## 08 — CASH FLOW MODEL

`cashflow.FlujoDeFondos`: egresos (terreno/obra/indirectos/comerciales/impuestos) +
ingresos (`flujo_ventas_usd`, reutiliza `construir_cronograma` de `calculadora.py`)
→ flujo operativo → `peak_capital_requirement()`. `curva_gasto_obra()` soporta
lineal o S-curve (triangular, explícita y auditable — no una fórmula opaca).
Demostrado con un cash flow mensual realista de 13 meses para Ángulo 2
(`demo_flujo_realista_angulo2.py`): Peak Capital Requirement de **USD 975.699 en el
mes 4**, con financiamiento mixto 40% equity/60% deuda.

## 09 — FINANCIAL MODEL

`financiero.calcular_metricas()`: ROI (sobre Inversión Total), ROIC (sobre
capital propio), TIR anual (reutiliza `tir()` de `calculadora.py`, bisección ya
validada), VAN (`vpn()`, tasa de descuento parametrizable), Equity Multiple,
Payback. En la demo de Ángulo 2: ROI 25,66%, ROIC 73,50%, TIR anual 136,97%
(proyecto corto, 12 meses, buen margen — plausible), VAN USD 760.946 @12% anual,
Equity Multiple 1,73x, payback mes 12.

## 10 — SCENARIO MODEL

`escenarios.py`: `correr_escenarios()` corre el mismo constructor bajo N sets de
parámetros nombrados. Probado con Conservador/Base/Optimista sobre un proyecto de
prueba: margen USD 447.250 → 1.102.500 → 1.642.750, dirección correcta en los 3.

## 11 — SENSITIVITY MODEL

`sensibilidad.py`: `correr_sensibilidad()` (matriz de variables × deltas %) y
`buscar_punto_de_equilibrio()` (break-even por bisección — probado: precio de
venta de equilibrio USD 3.333.405 sobre un caso de prueba, margen residual < USD
70). `precio_maximo_terreno_por_roi_objetivo()` implementado, no probado con datos
reales todavía (pendiente, §15).

## 12 — INVESTOR INTEGRATION

`investor_layer.py`: `capa_inversor()` filtra `cost_bridge`/`financiamiento`/
`flujo_mensual` por defecto (confidencial); `exportar_json()`/`exportar_json_interno()`
escriben a disco. Demostrado end-to-end: `HERRERA-001_dev_engine_investor_export.json`
(1,2 KB, sin datos confidenciales) y `_export_interno.json` (8,1 KB, completo) en
`contracts/cases/HERRERA-001/entregables/`.

**Cerrado (D-080, 2026-08-22)**: `exportar_herrera_completo.py` exporta los 3
Ángulos (bajo/alto + desagregación por ítem) a `HERRERA-001_dev_engine_3angulos.json`,
y `build_herrera001_memorandum.js`/`build_herrera001_investor_book.js` ahora leen
ese JSON — verificado visualmente (docx/pptx regenerados, sin ninguna diferencia
visible respecto de los números que ya estaban publicados). S64 cerrado para
estos dos entregables; los otros 4 documentos del set de 6 (`build_herrera001_presentacion_inversores.js`,
Investment Summary) siguen sin conectar — no fueron pedidos en esta pasada.

## 13 — HERRERA VALIDATION (S68)

`validar_herrera.py` reconstruye los 3 Ángulos (bajo y alto, 6 corridas) usando
**solo** `dev_engine`, contra los números ya confirmados de `14-...md`/`36-...md`:

| Ángulo | Rango | Inversión Total | Costo/m² | Comisión | Margen | Resultado |
|---|---|---|---|---|---|---|
| 1 | bajo | USD 2.745.597,78 ✓ | USD 1.525,33 ✓ | USD 196.220 ✓ | USD 436.259 ✓ | OK |
| 1 | alto | ídem | ídem | USD 231.999 ✓ | USD 1.051.008 ✓ | OK |
| 3 | bajo | USD 2.930.823,07 ✓ | USD 1.628,24 ✓ | USD 210.128 ✓ | USD 489.990 ✓ | OK |
| 3 | alto | ídem | ídem | USD 225.349 ✓ | USD 751.518 ✓ | OK |
| 2 | bajo | USD 3.185.640,34 ✓ | USD 1.516,97 ✓ | USD 243.358 ✓ | USD 784.541 ✓ | OK |
| 2 | alto | ídem | ídem | USD 261.203 ✓ | USD 1.091.147 ✓ | OK |

**6/6 dentro de 0,05% de tolerancia** (diferencias de centavos por redondeo). Costo
financiero da USD 0 en las 6 corridas — correcto y esperado: la reconstrucción usa
100% equity (Herrera nunca modeló un préstamo bancario real con interés), supuesto
declarado explícitamente en el docstring del script, no una limitación oculta.

**Diferencia real explicada (no oculta, S58)**: el TIR anual que reporta la
reconstrucción es negativo y no comparable — la reconstrucción usa una única venta
agregada pagada 100% de contado en el mes 0 (porque el caso original nunca fechó
sus ventas para el cálculo de margen/ROI), lo que invierte el signo normal de un
flujo de inversión. Por eso se construyó `demo_flujo_realista_angulo2.py` aparte,
con el ritmo de venta real ya confirmado del caso (D-065, 30/40/30) y el
financiamiento de comprador ya confirmado (D-067, 40/50/10) — ese sí da un TIR
interpretable (136,97% anual, proyecto corto y rentable).

## 14 — TEST RESULTS

- `validar_herrera.py`: **6/6 OK** (S68).
- `test_parametrizacion.py`: **todos los checks pasaron** — subir precio sube
  margen sin mover costo directo/m² (S69); subir costo directo baja margen y sube
  costo/m²; subir tasa de financiamiento con equity insuficiente sube el costo
  financiero. Matriz de sensibilidad, break-even y escenarios corridos sobre el
  mismo proyecto de prueba, todos coherentes entre sí.
- `demo_flujo_realista_angulo2.py`: cash flow de 13 meses generado correctamente,
  Peak Capital Requirement identificado en el mes correcto (el de mínimo acumulado).
- `demo_export_investor_json.py`: exportación JSON verificada, UTF-8 correcto,
  campos confidenciales excluidos por defecto.
- **Un bug real encontrado y corregido durante las pruebas**: `Proyecto` no
  redondeaba `meses_obra` a entero cuando llegaba como resultado de un ajuste
  porcentual (ej. "+20% de plazo" desde `escenarios.py`), causando un `TypeError`
  al indexar listas mensuales con un float — corregido en `proyecto.py`
  (`int(round(meses_obra))`), verificado con los 3 scripts re-corridos limpio.

## 15 — PENDING ITEMS

1. ~~Conectar los generadores `.js` del Investor Book/Memorandum al JSON~~ —
   ✅ **Cerrado 2026-08-22 (D-080)**, ver §12.
2. ~~Cotización de tipo de cambio real~~ — ✅ **Cerrado 2026-08-22 (D-080)**:
   `cotizacion.py` conecta `open.er-api.com` (Nivel 3), con
   `fuente_bcp_manual()` para cargar la cotización oficial del BCP (Nivel 1) a
   mano mientras no se automatice un endpoint estable de su sitio.
3. **Price Escalation Engine (S25) y matriz de precio por etapa (S24)** como
   módulos dedicados — hoy se simulan variando `precio_usd` a mano por venta.
4. **Auditoría matemática automática (S57-S58)** como validador reutilizable —
   hoy solo existe el test puntual de Herrera.
5. **Automatizar la cotización oficial del BCP** — el sitio (bcp.gov.py) no
   tiene un endpoint estable navegable por script encontrado en el tiempo
   disponible; `open.er-api.com` (Nivel 3) cubre el uso normal mientras tanto.
6. **Costo Sugerido vs. Costo Ingresado (S20)** — comparar un presupuesto cargado
   contra la base de `market-intelligence/` para detectar sobrecostos — no
   construido, aunque `construction-cost-engine` (SK-12) ya da el costo sugerido
   por separado.
7. **Dashboard ejecutivo (S60)** y **Output 01-13 formales (S59)** — el motor
   devuelve toda la información necesaria (`ResultadoProyecto`), pero no hay
   todavía un generador de reporte/PDF dedicado a la salida del motor en sí
   (distinto del Investor Book de un caso puntual).
8. ~~Conectar los otros 2 documentos~~ — ✅ **Cerrado 2026-08-22 (D-081)**:
   `build_herrera001_presentacion_inversores.js` y `build_herrera001_investment_summary.js`
   también leen `HERRERA-001_dev_engine_3angulos.json` — los 4 documentos
   principales del set de 6 (Memorándum, Investor Book, Presentación de 10
   slides, Investment Summary) ya comparten una única fuente de verdad. Además,
   D-081 hizo la QA visual completa (25/25 páginas del Investor Book) que
   faltaba — encontró y corrigió 1 bug real de layout.

## 16 — SYSTEM VERSION

**Development Cost & Financial Engine v1.0** — núcleo (costos, cash flow,
financiamiento, métricas financieras) + sensibilidad + escenarios + investor
layer, todo construido y validado contra HERRERA-001 en una sola sesión
(2026-08-19). Se apoya en, y no duplica, el Real Estate Intelligence OS v1.0
(2026-08-17/18) y `calculadora.py` (motor de rentabilidad de alquiler, en
producción desde antes). Ver `governance/decisions/DECISION_REGISTER.md`, D-079.
