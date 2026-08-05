Estado: CURRENT
Fuente original: meridiano-investor-journey/references/modelo-coinversion.md
Dominio: BUSINESS

# Modelo de COINVERSIÓN — tickets grandes

> Meridiano opera **dos modelos** de inversor (ver `01-dos-modelos-de-negocio.md`):
> - **Individual** (la mayoría): compra su unidad, se la administra, comisión de venta 5,5%.
> - **Coinversión** (tickets grandes): varios inversores en un vehículo común para un desarrollo, con fees + hurdle + carried interest. Este documento detalla el segundo.
>
> Datos extraídos del Deck de Inversores. Los valores marcados en la fuente original entre corchetes `[ ]` eran los documentados en el deck sin confirmar — **ya confirmados** (ver nota al final: `DECISIÓN FIRME`, resuelve U-005 del Requirements Register, con validación cuantitativa de una auditoría financiera real).

## Cuándo aplica

El modelo de coinversión es para proyectos donde se levanta capital de varios inversores para un desarrollo (tierra / construcción / preventa en pozo), **no** para la compra individual de una unidad terminada. Se cruza con el camino Investor Pass (≥ USD 200.000) y con la constitución de vehículo societario.

## El vehículo — dos opciones según escala

| | Sociedad Anónima | Fideicomiso de Administración |
|---|---|---|
| Naturaleza | Persona jurídica con accionistas | Patrimonio autónomo, fiduciario regulado |
| Control | Directorio flexible, control activo del gestor | Mayor formalidad y separación patrimonial |
| Costo | Constitución moderada | Costo inicial más alto, estructura más robusta |
| Familiaridad | Estructura equivalente en el país del inversor | Mayor sensación de protección para tickets grandes |
| Recomendado | Menor escala o grupos acotados de coinversores | Mayor escala o múltiples inversores no relacionados |

## Economics — tres componentes de retribución al estructurador

Alineados con el resultado del inversor: **el carry solo se cobra si el inversor ya recuperó capital + hurdle.**

| # | Componente | Valor `[deck]` | Cuándo se cobra |
|---|---|---|---|
| 1 | Fee de Estructuración | `[1,5%–3%]` del capital comprometido | Al cierre de la ronda de capital |
| 2 | Fee de Gestión de Construcción | `[2%–4%]` del costo de obra | Durante la construcción |
| 3 | Carried Interest | `[15%–20%]` de la ganancia sobre el hurdle | Solo tras devolver capital + hurdle |

Hurdle (retorno preferente): **`[8%]` anual**.

## Waterfall — orden de prelación de retornos

Caso ilustrativo documentado en la fuente: capital comprometido **USD 500.000**, horizonte **24 meses**.

| Paso | Descripción | Monto (USD) |
|---|---|---|
| 1 | Devolución de capital a inversores | 500.000 |
| 2 | Retorno preferente (hurdle 8% anual × 2 años) | 80.000 |
| 3 | Ganancia remanente a repartir | 70.000 |
| 4a | 80% del remanente → inversores | 56.000 |
| 4b | 20% del remanente → carried interest | 14.000 |

- **Inversor:** recupera capital + hurdle + su parte del remanente = **USD 636.000** → **27,2% en 24 meses (~13,2% anualizado simple)**.
- **Estructurador (Meridiano):** fee de estructuración + fee de gestión de obra + **USD 14.000** de carry.

## Gobernanza y reporte

| Dimensión | Regla |
|---|---|
| Gestión operativa | El estructurador (Meridiano) conserva las decisiones técnicas de obra y comercialización |
| Decisiones reservadas a inversores | Cambios materiales al presupuesto · extensión de plazo · venta anticipada del proyecto completo |
| Reporte | Informe trimestral de avance de obra y estado financiero del vehículo |
| Auditoría | Estados financieros por la contadora de la red, con acceso de inversores a la documentación |

## Red de aliados profesionales (confirmada)

| Aliado | Rol |
|---|---|
| Abogado | Constitución societaria, revisión contractual, debida diligencia |
| Escribano | Escrituración y protocolización de actos societarios |
| Contadora | RUC, facturación, régimen impositivo, cumplimiento fiscal |
| Operador de Renta Temporal | 20+ años de trayectoria — operación diaria del circuito de renta temporal |

## Consideraciones de riesgo (para todo material de coinversión)

Siempre incluir en material comercial de coinversión:
- Demoras de obra y variación de costos.
- Condiciones de mercado al vender/alquilar pueden diferir de lo proyectado.
- Riesgo de iliquidez durante el horizonte (sin rescate anticipado salvo acuerdo expreso).
- Cifras de retorno son ilustrativas, no garantizadas.
- Recomendar al inversor evaluar con asesoría legal, impositiva y financiera propia e independiente del estructurador.

## Reconciliación con la rentabilidad de administración

El deck cita, para la gestión post-inversión: renta tradicional 6-10% bruta (objetivo 10% neto de cartera) y renta temporal 10-16%+ bruta. Esto es consistente con la política P07 (pisos netos por clase) del dominio de rentabilidad/inversión. Para cualquier número de renta que se comunique a un inversor, usar el motor de cálculo del dominio INVESTMENT (que da bruto y neto por clase), **no los rangos del deck directamente**.

> Nota para Decision Register — posible overlap: este documento (coinversión) y `01-dos-modelos-de-negocio.md` describen la misma economía de fees/hurdle/carry en dos lugares. Se mantienen ambos porque `dos-modelos-de-negocio.md` es la comparación de alto nivel (para no confundir Modelo A con B) y este documento es el detalle operativo (vehículo, waterfall paso a paso, gobernanza, riesgo). Deben mantenerse sincronizados: cualquier cambio a los porcentajes de fee/hurdle/carry debe reflejarse en ambos.

## Regla del hurdle — simple vs. compuesto (CRITERIO MERIDIANO)

El retorno preferente (hurdle 8%) se calcula distinto según el plazo:

- **Hasta 24 meses → hurdle SIMPLE** (8% × años). Favorece al estructurador, es más simple de explicar, y a plazos cortos la diferencia con el compuesto es mínima (a 2 años, solo ~USD 3.200 sobre 500k).
- **Más de 24 meses → hurdle COMPUESTO** (capitaliza el 8% anual). Es más justo para el inversor por el valor tiempo del dinero: su capital estuvo inmovilizado más tiempo. A 5 años el compuesto le transfiere ~USD 7.000 más sobre 500k.

El motor de cálculo del dominio INVESTMENT (`meridiano-rentabilidad`) aplica esta regla automáticamente (`hurdle_tipo="auto"` en el config). Se puede forzar simple o compuesto por operación si un inversor lo negocia distinto.

## `DECISIÓN FIRME` — hurdle 8% + carried 15-20%, nunca TIR fija

Confirmado por Juan José Castillo. Los rangos de fee (1,5–3%, 2–4%, 15–20%) y el hurdle (8%) **ya no son `[deck]` pendiente** — resuelven `U-005` del Requirements Register.

**Por qué se descartó la alternativa (TIR fija 18% terreno / 20% obra) — evidencia cuantitativa:** un modelo financiero externo de 939 fórmulas (un "chat desarrollador" previo, no de Meridiano) se auditó celda por celda usando exactamente ese esquema de TIR fija. Resultado: el proyecto terminaba con **USD −4,1M de déficit**, en parte porque el 18-20% fijo es una obligación que el desarrollador debe pagar aunque el proyecto rinda menos — el margen del desarrollador es el primer amortiguador que se consume, y en este caso se volvió negativo (−USD 984k). Bajo hurdle+carry el inversor participa del **resultado real** del proyecto sobre un piso del 8%, y Meridiano nunca carga una obligación fija que no puede cumplir si el proyecto rinde menos de lo esperado. La auditoría completa (con las celdas y montos exactos) vive en `knowledge-base/investment/04-auditorias-financieras.md`.

**Trazabilidad:** este esquema de TIR fija fue una propuesta de un chat/documento externo previo (no una decisión de Meridiano que se haya revertido) — se registra como `HISTORICAL` en `governance/decisions/DECISION_REGISTER.md` únicamente porque circuló como alternativa considerada, no porque Meridiano la haya aplicado y luego abandonado.

**Fuente:** `00_RAW_MIGRATION/claude-recovery-2026-08-02/entregables/auditorias/Meridiano_Auditoria_Modelo_Financiero.md` y `Meridiano_Estructura_Desarrolladora_Analisis_Plan.md §1`.
