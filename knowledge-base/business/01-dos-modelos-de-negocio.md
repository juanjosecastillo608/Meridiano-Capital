Estado: CURRENT
Fuente original: meridiano-investor-journey/references/dos-modelos-de-negocio.md
Dominio: BUSINESS

# Los dos modelos de negocio de Meridiano Capital

Meridiano opera **dos negocios distintos, con economías distintas**. Confundirlos lleva a errores de cálculo y de propuesta. Antes de cualquier análisis o material comercial, se debe identificar cuál de los dos aplica al caso concreto.

## MODELO A — Inversión Individual (el negocio principal hoy)

El inversor compra **su propia unidad** y Meridiano se la administra.

| Dimensión | Detalle |
|---|---|
| Qué compra el inversor | Una unidad concreta (terminada o en pozo) — activo propio a su nombre / su S.A. |
| Rol de Meridiano | Asesora la compra, la administra (renta tradicional o temporal) |
| **Ingreso de Meridiano** | **Comisión de venta 5,5% + honorarios de administración y alquiler** |
| Retorno del inversor | **Renta + plusvalía** de su propia propiedad |
| Riesgo del inversor | El de su unidad (mercado de renta, plusvalía) |
| Liquidez | Alta — vende su unidad cuando quiere |
| Motor de cálculo | `evaluar_renta`, `evaluar_reventa`, `evaluar_reventa_temprana`, `evaluar_retorno_combinado` |
| Camino migratorio típico | Estándar (< USD 200k) o Investor Pass si son varias unidades |

## MODELO B — Coinversión (proyectos en cartera para desarrollar)

Varios inversores aportan a un **vehículo común** para financiar un desarrollo. Estructura estilo private equity.

| Dimensión | Detalle |
|---|---|
| Qué compra el inversor | Una **participación en un vehículo** (S.A. o Fideicomiso), no una unidad |
| Rol de Meridiano | Estructurador y gestor del proyecto de desarrollo |
| **Ingreso de Meridiano** | **Fee de estructuración (1,5–3%) + fee de gestión de obra (2–4%) + carried interest (15–20% sobre hurdle 8%)** |
| Retorno del inversor | Su parte del **waterfall**: capital + retorno preferente + parte del remanente |
| Riesgo del inversor | El del proyecto de desarrollo (obra, mercado, plazo) |
| Liquidez | **Baja** — iliquidez durante el horizonte, sin rescate anticipado salvo acuerdo |
| Motor de cálculo | `evaluar_coinversion` (waterfall completo) |
| Camino migratorio típico | Investor Pass (tickets ≥ USD 200k) + vehículo societario |

Ver detalle operativo del vehículo, fees, gobernanza y red de aliados en `03-modelo-coinversion.md` (fuente: `meridiano-investor-journey/references/modelo-coinversion.md`).

> UNRESOLVED: los valores de fees de coinversión (1,5–3%, 2–4%, 15–20%, hurdle 8%) están marcados en la fuente original como extraídos del "Deck de Inversores" y entre corchetes `[ ]`, indicando que son valores documentados pero pendientes de confirmación final antes de presentarse como definitivos. Ver `03-modelo-coinversion.md` para la nota completa.

## REGLA DE NO CONFUNDIR

Los dos modelos tienen economías incompatibles. Nunca mezclar:

- **Nunca** aplicar los pisos de renta del modelo individual a una coinversión, ni el waterfall a una compra individual.
- **Nunca** mostrar la comisión del 5,5% en una propuesta de coinversión — ahí el ingreso de Meridiano es fees + carry.
- **Nunca** mostrar fees/hurdle/carry en una propuesta individual — ahí el inversor es dueño directo y su retorno es renta + plusvalía.
- El **monto y el objetivo del inversor** definen el modelo: quien quiere ser dueño de una unidad → Modelo A; quien quiere entrar a un desarrollo con otros → Modelo B.

## Cómo se cruzan (no se excluyen)

Un mismo inversor puede empezar en el Modelo A (compra una unidad) y luego entrar al Modelo B (coinvierte en un desarrollo), o viceversa. Un inversor de cartera grande suele combinar ambos. La S.A. y el Investor Pass sirven a los dos modelos. **Lo que nunca se mezcla es la economía del cálculo**: cada operación se evalúa con el modelo que le corresponde, con su propio motor de cálculo.

## Regla del hurdle en coinversión (retorno preferente)

El tipo de hurdle define cuánto del remanente queda para repartir, y por lo tanto cuánto se lleva el inversor y cuánto Meridiano de carry.

- **Simple** (`hurdle = capital × tasa × años`): el preferente no gana interés sobre sí mismo. Favorece al estructurador (Meridiano), es más fácil de explicar. La diferencia con compuesto es mínima en plazos cortos.
- **Compuesto** (`hurdle = capital × ((1+tasa)^años − 1)`): el preferente capitaliza. Favorece al inversor, reconoce el valor tiempo del dinero. La diferencia se vuelve material en plazos largos.

**Regla Meridiano (automática en el motor):**

| Horizonte del proyecto | Tipo de hurdle |
|---|---|
| Hasta 24 meses | **Simple** |
| Más de 24 meses | **Compuesto** |

El motor elige solo según el plazo (`hurdle_tipo="auto"` en el config). Se puede forzar un tipo pasando `hurdle_tipo="simple"` o `"compuesto"` a `evaluar_coinversion`. Ejemplo del impacto documentado en la fuente: en un proyecto de 5 años, pasar de simple a compuesto transfiere aproximadamente **USD 7.000** (sobre USD 500.000 de capital) del carry de Meridiano al inversor — por eso en plazos largos el compuesto es "lo justo y lo esperado por inversores sofisticados" (afirmación textual de la fuente).

## Nota de reconciliación — dependencia hacia INVESTMENT

Este documento es la base de la que deriva la separación de motores de cálculo del dominio de matemática de inversión (`meridiano-rentabilidad` en el inventario original). Cualquier cambio a los porcentajes de comisión, fees o hurdle debe propagarse a ese dominio y viceversa — ver ítem de reconciliación en Decision Register.
