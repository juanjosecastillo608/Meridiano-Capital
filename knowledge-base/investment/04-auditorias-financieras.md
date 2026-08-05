Estado: CURRENT (como registro de hallazgos) / los modelos auditados son de terceros o pre-Meridiano, NO usar sus cifras
Fuente original: 00_RAW_MIGRATION/claude-recovery-2026-08-02/entregables/auditorias/*.md
Dominio: INVESTMENT
Incorporado: 2026-08-02

# Auditorías financieras reales — hallazgos que NO se deben repetir

> Estos tres modelos **no son de Meridiano** — son modelos de terceros o de un chat/documento previo que se auditaron para no arrastrar sus errores al motor propio (`meridiano-rentabilidad`). Se documentan acá como registro de errores conocidos, con la cifra corregida al lado, para que ninguna futura evaluación repita el mismo error.

## 1. Modelo de fideicomiso (`flujo_fondos_fideicomiso.xlsx`, 939 fórmulas)

**Veredicto**: recalcula sin errores de fórmula (0/939) pero es **económicamente inviable** y contiene errores de lógica. No presentable a inversores. Requiere reconstrucción, no ajuste. Auditado 30-jul-2026, doble lectura (fórmulas + valores recalculados) y rastreo celda por celda.

**Resultado tal como lo arroja el modelo**: ingreso bruto USD 10.386.515 · **resultado neto USD −4.113.883** · margen neto −40% · excedente para el desarrollador USD −983.704.

### Errores confirmados (con celda)

| # | Error | Celda | Efecto |
|---|---|---|---|
| 1 `crítico` | Retorno a inversores de obra inflado — la fórmula suma el aporte del inversor (que es SU capital entrando, no un retorno) al cálculo del retorno | `Resumen!B30` | Sobrestimación de **USD 2.340.000** |
| 2 `crítico` | Hard cost calculado sobre superficie **vendible** (5.200 m²), no **construida** (~6.500 m², factor 1,20-1,35×) | `Supuestos!B20` | Subestima la obra en **~USD 1,2–1,6M** |
| 3 `de datos` | Impuesto a las ganancias al 25% — en Paraguay el IRE/IRACIS es **10%** | `Supuestos!B58` | No muerde en este modelo (hay pérdida) pero sobrestimaría el impuesto 2,5× si el proyecto fuera positivo |
| 4 `a reconciliar` | Ingresos capturan solo ~82% de la venta teórica (faltan ~USD 1,67M, probablemente saldos de escrituración fuera del horizonte del modelo) | `AU13` | Subestima el ingreso si no se registra como cuenta por cobrar |

**Conclusión económica**: aislando los 4 errores, el proyecto sigue en pérdida de **~USD 1,4 a 3,1M** bajo los supuestos genéricos (80 unidades, USD 900/m² hard cost, USD 2.200-2.800/m² venta) — **no es (solo) un problema del formato del modelo, es que esos supuestos no cierran un desarrollo que además promete 18-20% fijo a los inversores.**

**Por qué esto valida hurdle+carry**: el modelo usaba TIR fija (18% terreno / 20% obra) + 30% del excedente — le promete al inversor un retorno que el proyecto no genera. Con hurdle+carry el reparto nunca puede exceder lo que el proyecto realmente produce. Ver `knowledge-base/business/03-modelo-coinversion.md`.

**Nota de rigor propia del auditor**: en la primera pasada se sumó por error la columna de totales (AU) junto con las 44 columnas mensuales, haciendo ver todo el doble. Corregido antes de atribuirle al modelo un error que no tenía — el modelo NO está duplicado.

## 2. Planillas Edificio Austria (modelo de cliente)

IVA/IRE definidos en la planilla pero **nunca aplicados** al cálculo. Ocupación Airbnb modelada al 93%, cuando la realista es **~62%**. Neto real recalculado: **~14-15%** (no el 18,5% que mostraba la planilla original). Este es exactamente el error que el refinamiento de ocupación temporal (`ocupacion_realista_pct: 55-65`, en `production/app/config/parametros_mercado.json`) existe para evitar — ver también `governance/decisions/DECISION_REGISTER.md#D-003` (todavía UNRESOLVED como bug de código: la rama temporal de `evaluar_renta()` no usa este parámetro).

## 3. Planilla Hotel Plaza Uruguaya (modelo de cliente)

La cifra de "inversión total" **omite los USD 370.000 del edificio** y no resta el opex operativo. Rendimiento operativo real recalculado: **~0-8%**, muy por debajo del piso de renta temporal (14% depto / 12% casa). **Reencuadre propuesto**: operar el activo 100% Airbnb bajo Urbannit en vez de como hotel/apart-hotel operado — ver `categorias_de_gestion.operacion_hotelera` en el config, que ya distingue explícitamente esta categoría del 10% de administración estándar.

## Método a aplicar en cualquier auditoría financiera futura

1. Doble lectura: fórmulas + valores recalculados (LibreOffice u otra herramienta independiente).
2. Rastreo celda por celda de cada cifra que alimenta el resultado final.
3. Contrastar contra la lógica de `production/app/backend/calculadora.py` — no inventar un segundo idioma económico.
4. Separar errores de lógica (fórmula rota) de errores de supuestos (dato de mercado equivocado) — requieren corrección distinta.
5. Nunca presentar un modelo a un inversor sin stress-test de 3 escenarios (base/adverso/favorable) reportando TIR del desarrollador **y** del inversor bajo hurdle+carry.

## Pendiente derivado

Reconstruir el modelo financiero de fideicomiso con datos reales de uno de los 3 proyectos del pipeline (ver `knowledge-base/business/06-estructura-societaria-y-portfolio.md`), usando el waterfall de `evaluar_coinversion` en vez de TIR fija, e IRE 10% (no 25%).
