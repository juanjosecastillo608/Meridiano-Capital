# Modelo de COINVERSIÓN — tickets grandes

> Meridiano opera **dos modelos** de inversor:
> - **Individual** (la mayoría): compra su unidad, se la administra, comisión de venta 5,5%. Ver el journey principal y `meridiano-rentabilidad`.
> - **Coinversión** (tickets grandes): varios inversores en un vehículo común para un desarrollo, con fees + hurdle + carried interest. Este documento.
>
> Datos extraídos del Deck de Inversores. Los valores en rango `[ ]` son los documentados en el deck — **confirmar los valores finales** antes de presentarlos como definitivos.

## Cuándo aplica

El modelo de coinversión es para proyectos donde se levanta capital de varios inversores para un desarrollo (tierra / construcción / preventa en pozo), no para la compra individual de una unidad terminada. Se cruza con el camino Investor Pass (≥ USD 200.000) y con la constitución de vehículo societario.

## El vehículo — dos opciones según escala

| | Sociedad Anónima | Fideicomiso de Administración |
|---|---|---|
| Naturaleza | Persona jurídica con accionistas | Patrimonio autónomo, fiduciario regulado |
| Control | Directorio flexible, control activo del gestor | Mayor formalidad y separación patrimonial |
| Costo | Constitución moderada | Costo inicial más alto, estructura más robusta |
| Familiaridad | Estructura equivalente en el país del inversor | Mayor sensación de protección para tickets grandes |
| Recomendado | Menor escala o grupos acotados de coinversores | Mayor escala o múltiples inversores no relacionados |

## Economics — tres componentes de retribución al estructurador

Alineados con el resultado del inversor: el carry solo se cobra si el inversor ya recuperó capital + hurdle.

| # | Componente | Valor `[deck]` | Cuándo se cobra |
|---|---|---|---|
| 1 | Fee de Estructuración | `[1,5%–3%]` del capital comprometido | Al cierre de la ronda de capital |
| 2 | Fee de Gestión de Construcción | `[2%–4%]` del costo de obra | Durante la construcción |
| 3 | Carried Interest | `[15%–20%]` de la ganancia sobre el hurdle | Solo tras devolver capital + hurdle |

Hurdle (retorno preferente): **`[8%]` anual**.

## Waterfall — orden de prelación de retornos

Caso ilustrativo: capital comprometido USD 500.000, horizonte 24 meses.

| Paso | Descripción | Monto (USD) |
|---|---|---|
| 1 | Devolución de capital a inversores | 500.000 |
| 2 | Retorno preferente (hurdle 8% anual × 2 años) | 80.000 |
| 3 | Ganancia remanente a repartir | 70.000 |
| 4a | 80% del remanente → inversores | 56.000 |
| 4b | 20% del remanente → carried interest | 14.000 |

- **Inversor:** recupera capital + hurdle + su parte del remanente = USD 636.000 → **27,2% en 24 meses (~13,2% anualizado simple)**.
- **Estructurador:** fee de estructuración + fee de gestión de obra + USD 14.000 de carry.

## Gobernanza y reporte

| Dimensión | Regla |
|---|---|
| Gestión operativa | El estructurador conserva las decisiones técnicas de obra y comercialización |
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

Siempre incluir: demoras de obra y variación de costos · condiciones de mercado al vender/alquilar pueden diferir · riesgo de iliquidez durante el horizonte (sin rescate anticipado salvo acuerdo expreso) · cifras de retorno ilustrativas, no garantizadas · recomendar al inversor evaluar con asesoría legal, impositiva y financiera propia e independiente del estructurador.

## Reconciliación con la rentabilidad de administración

El deck cita, para la gestión post-inversión: renta tradicional 6-10% bruta (objetivo 10% neto de cartera) y renta temporal 10-16%+ bruta. Es consistente con la política P07 (pisos netos por clase). Para cualquier número de renta, usar la skill `meridiano-rentabilidad`, que da bruto y neto por clase — no los rangos del deck.

## Regla del hurdle — simple vs compuesto `CRITERIO MERIDIANO`

El retorno preferente (hurdle 8%) se calcula distinto según el plazo:

- **Hasta 24 meses → hurdle SIMPLE** (8% × años). Favorece al estructurador, es más simple de explicar, y a plazos cortos la diferencia con el compuesto es mínima (a 2 años, solo ~3.200 sobre 500k).
- **Más de 24 meses → hurdle COMPUESTO** (capitaliza el 8% anual). Es más justo para el inversor por el valor tiempo del dinero: su capital estuvo inmovilizado más tiempo. A 5 años el compuesto le transfiere ~7.000 más sobre 500k.

La skill `meridiano-rentabilidad` aplica esta regla automáticamente (`hurdle_tipo="auto"` en el config). Se puede forzar simple o compuesto por operación si un inversor lo negocia distinto.
