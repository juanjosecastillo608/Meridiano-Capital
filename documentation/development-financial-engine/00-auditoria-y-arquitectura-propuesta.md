Estado: DRAFT — pendiente de confirmación del founder antes de ejecutar (mismo protocolo del Real Estate Intelligence OS, `documentation/real-estate-os/00-...md`)
Fuente original: prompt maestro "MERIDIANO CAPITAL — DEVELOPMENT COST & FINANCIAL ENGINE", founder, 2026-08-19
Dominio: TECHNOLOGY/INVESTMENT/GOVERNANCE

# Development Cost & Financial Engine — auditoría y arquitectura propuesta

## 0. Qué pide el founder

Convertir el conocimiento financiero disperso en `HERRERA-001` (jerarquía de costos, cash flow mensual, sensibilidad, escenarios) en un **motor parametrizable** — cambiar un parámetro (cemento, mano de obra, inflación, precio de venta, velocidad de obra, % preventa) debe recalcular automáticamente todo el modelo y, cuando corresponda, los entregables para inversores. Con manejo explícito de **USD/PYG** (costos en ambas monedas, precio de venta siempre en USD).

## 1. Auditoría — qué ya existe (mucho más de lo esperado, otra vez)

| Módulo del prompt maestro | Ya existe | Dónde |
|---|---|---|
| §7-9 Direct Cost Engine | ✅ **Sí** — `construction-cost-engine` (SK-12) ya estima costo bajo/base/alto desde la tabla real (D-064), incluida la metodología de netting estructura/terminación | `skills/construction-cost-engine/estimar.py` |
| §19-20 Cost DB + costo sugerido vs. ingresado | ✅ Parcial — la tabla real (D-064) y `market-intelligence/` ya existen; falta el paso de comparar contra un presupuesto ingresado | `knowledge-base/investment/market-intelligence/construction-costs/` |
| §26-27 Sales Price Engine + validación | ✅ **Sí** — `market-price-validation` (SK-13) ya clasifica BELOW/MARKET/ABOVE/SIGNIFICANTLY ABOVE contra comparables reales | `skills/market-price-validation/validar.py` |
| §39 TIR/VAN | ✅ **Sí, robusto** — `tir()` (bisección) y `vpn()` ya implementados y en uso en producción | `production/app/backend/calculadora.py:24-57` |
| §31-35 Cronograma de pagos del comprador | ✅ Parcial — `construir_cronograma()` ya arma pagos mensuales con entrega inicial + cuotas + balloon | `production/app/backend/calculadora.py:79-97` |
| §49 Conexión con Market Intelligence | ✅ **Sí** — `market-intelligence-lookup` (SK-11) + `workflows/nuevo-proyecto-inmobiliario` (WF-03) ya son el punto de entrada obligatorio (`CLAUDE.md` §"Antes de analizar...") | `skills/market-intelligence-lookup/`, `workflows/nuevo-proyecto-inmobiliario/` |
| §03 Jerarquía de costos (Terreno+Directos+Indirectos+...=Total) | ⚠️ **No existe como modelo** — se calculó ad hoc en Markdown para `HERRERA-001` (`14-...md`, `36-...md`, `46-...md`), nunca como estructura de datos reutilizable | — |
| §10-11 Indirect Cost Engine (Proyecto, Aprobaciones) | ⚠️ Ad hoc — % fijo por Ángulo calculado a mano, no parametrizado | `contracts/cases/HERRERA-001/14-...md` §2 |
| §12 Financing Cost Engine conectado al cash flow real | ❌ **No existe** — el caso nunca modeló financiamiento bancario real con intereses sobre saldo, solo IVA/comisión como % flat | — |
| §31-36 Cash Flow Engine mensual + Peak Capital | ⚠️ Ad hoc — 4 versiones sucesivas calculadas a mano en el caso (`16-...md`, `18-...md`, `24-...md`, `27-...md`), cada una superando a la anterior — exactamente el problema que el founder quiere resolver: "no debe haber una cifra para el modelo y otra para la presentación" | `contracts/cases/HERRERA-001/16/18/24/27-...md` |
| §43-45 Sensitivity + Break-even Engine | ⚠️ Ad hoc — probado una vez en `19-...md` del Investor Book, sin motor reutilizable | — |
| §47-48 Scenario Engine | ⚠️ Parcial — los "3 Ángulos" de Herrera SON escenarios, pero corridos a mano, no con un motor que permita combinar variables libremente | — |
| §53-54 Moneda USD/PYG + inflación | ❌ **No existe en absoluto** — todo el sistema actual asume USD implícito, sin capa de conversión | — |
| §63 Investor Data Layer (capa que alimenta Investor Book/Memorandum sin duplicar cifras) | ❌ **No existe** — hoy yo copio números a mano desde el Markdown del caso hacia los generadores `.js` del Investor Book/Memorandum — es exactamente la duplicación que el prompt maestro prohíbe (§64) | — |

**Conclusión de la auditoría**: no hay que construir todo desde cero. Hay que construir **la jerarquía de costos + el cash flow engine + el manejo de moneda + la capa de datos para inversores** — el resto (costo directo, validación de precio, TIR/VAN, cronograma de pagos) ya existe y se **reutiliza**, no se duplica (regla §71 del propio prompt maestro).

## 2. Arquitectura propuesta

**Ubicación**: nuevo paquete `production/app/backend/dev_engine/`, hermano de `calculadora.py` (mismo patrón: lógica en Python, parámetros en JSON separado, nunca mezclados) — no un Skill de un solo script, porque este motor mantiene estado (el árbol de costos completo de un proyecto) y se compone de varios módulos que se llaman entre sí.

```
production/app/backend/dev_engine/
├── __init__.py
├── moneda.py           # FX layer: USD<->PYG, registro de fecha/fuente del tipo de cambio (§53)
├── costos.py           # Jerarquia de costos: Terreno/Directos/Indirectos/Desarrollo/
│                        #   Financieros/Comerciales/Impuestos/Contingencia (§03, §06-16)
│                        #   — envuelve construction-cost-engine (SK-12) para Directos,
│                        #   nunca reimplementa la tabla de costos
├── financiamiento.py    # Financing Cost Engine: interes sobre saldo real segun el
│                        #   cash flow mensual, no independiente de el (§12)
├── cashflow.py          # Monthly Project Cash Flow: egresos (obra por curva S) +
│                        #   ingresos (preventa/pozo/obra/terminado) + neto + acumulado +
│                        #   Peak Capital Requirement (§31-36)
├── financiero.py        # ROI/TIR/VAN/Equity Multiple/Payback — reutiliza tir()/vpn()
│                        #   de calculadora.py, no los reimplementa (§39)
├── sensibilidad.py      # Matrices de sensibilidad (precio/costo/plazo/preventa) +
│                        #   Break-even Engine (precio minimo, terreno maximo) (§43-45)
├── escenarios.py        # Corre el mismo proyecto bajo N sets de parametros
│                        #   (Conservador/Base/Optimista o custom) (§47-48)
├── investor_layer.py    # Selecciona que datos del modelo interno son seguros para
│                        #   mostrar a un inversor (oculta margenes internos, negociacion
│                        #   de terreno) y exporta JSON consumible por los generadores
│                        #   build_*.js del Investor Book/Memorandum (§63-64)
└── proyecto.py          # Ficha maestra del proyecto (§05) + orquestador que llama a
                         #   los modulos anteriores en orden y arma el reporte final
```

**Principio de moneda (§53, el requisito nuevo del founder)**: cada partida de costo se ingresa con su propia moneda nativa (`{"monto": 3_800_000, "moneda": "PYG"}` o `{"monto": 15_000, "moneda": "USD"}`) — `moneda.py` normaliza todo a USD para el modelo financiero (el precio de venta ya es siempre USD, D-045/D-063 y todo el caso Herrera), usando un `ExchangeRateParameter` versionado (valor, fecha, fuente) igual que cualquier otro parámetro del sistema — nunca un tipo de cambio hardcodeado dentro de una fórmula.

**Fuente de verdad única (§51)**: `dev_engine` **lee** de `knowledge-base/investment/market-intelligence/` (vía los Skills SK-11/12/13 ya existentes) y **nunca** copia esos valores a un archivo propio — si mañana cambia D-064 (costo de construcción), el motor lo ve automáticamente en la siguiente corrida.

## 3. Validación — test de reconstrucción con HERRERA-001 (§68)

Una vez construido el motor, se recorre `HERRERA-001` con `dev_engine` en vez de los cálculos manuales, y se compara contra los números ya confirmados y usados en los entregables reales (`14-...md`, `36-...md`, `46-...md`, el Investor Book): Inversión Total, Costo/m², Ingresos, Margen, ROI por los 3 Ángulos. Cualquier diferencia se explica, no se oculta (§58 auditoría matemática) — este test ya tiene un estándar de comparación real y auditado con el que contrastar, no un resultado hipotético.

## 4. Alcance propuesto para esta primera construcción — y lo que se deja para después

**Fase 1 (esta sesión, si se confirma)**: `moneda.py` + `costos.py` + `cashflow.py` + `financiero.py` (reutilizando `tir()`/`vpn()`) + `proyecto.py` orquestador + test de reconstrucción de Herrera. Esto ya cubre el núcleo real del prompt maestro (jerarquía de costos → costo/m² → cash flow → TIR/VAN/ROI, parametrizable, con USD/PYG) y es lo más valioso y verificable de una sola vez.

**Fase 2 (siguiente)**: `sensibilidad.py` (matrices + break-even) + `escenarios.py` (Conservador/Base/Optimista combinables).

**Fase 3 (siguiente)**: `investor_layer.py` — la capa que de verdad conecta el motor con los generadores `.js` del Investor Book/Memorandum, para que dejen de recibir números tipeados a mano. Es la pieza más valiosa a largo plazo (resuelve §64, la regla de "nunca una cifra para el modelo y otra para el inversor") pero también la que más toca los generadores ya construidos — conviene hacerla con el núcleo ya validado contra Herrera, no antes.

## 5. Confirmación necesaria antes de ejecutar

1. **¿La ubicación/arquitectura de la sección 2 te sirve?** (paquete Python en `production/app/backend/dev_engine/`, reutilizando calculadora.py y los 3 Skills ya construidos, en vez de un Skill nuevo de un solo script).
2. **¿Arrancamos por la Fase 1 (núcleo: costos+cashflow+financiero+validación con Herrera) ahora, y dejamos sensibilidad/escenarios/investor-layer para las próximas sesiones?** — dado que acá sí hay fórmulas financieras nuevas (financiamiento bancario real, conversión de moneda) que vale la pena validar bien antes de encadenar todo el resto encima.
