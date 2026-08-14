Estado: CURRENT — primer análisis comparativo comprar-y-terminar vs. construir desde cero
Fuente original: instrucciones del founder, 2026-08-13 (tercer mensaje del día)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-13

# Comprar y terminar vs. comprar terreno y construir desde cero

## Objetivo explícito de esta sección (palabras del founder)

*"Hay que evaluar y sugerir al inversor por qué le conviene comprar así y no comprar un terreno y luego construir. [...] Aún no sabemos qué conviene, ese es el objetivo también de este análisis."*

Esto **no es un supuesto a favor del trato** — es una pregunta abierta que este documento intenta responder con números, no con la conclusión ya decidida de antemano.

## 1. Parámetros de costo fijados por el founder (2026-08-13)

| Parámetro | Valor | Para qué se usa |
|---|---|---|
| Costo de construcción base | **USD 650/m²** | Cálculos de estructura y otros costos que NO dependen de la estética/calidad de terminaciones — es la base que ya trae la planilla original (`03-presupuesto-y-comparables.md`), sin cambios |
| Costo objetivo de terminación/construcción de m² faltantes | **USD 720/m²** | Reemplaza el USD 750/m² que se había usado el 2026-08-12 (que a su vez había reemplazado el USD 720 original del 2026-08-12 temprano — la cifra vigente hoy es USD 720/m², confirmada explícitamente por el founder en este mensaje) |
| "Costo para venta" a la calidad objetivo | USD 750/m² | Mencionado por el founder como referencia de calidad objetivo — **no se usa como tasa operativa en este cálculo**, se registra para no perderlo, ver nota abajo |

**⚠️ Supuesto que estoy marcando explícitamente porque la instrucción admite más de una lectura** (regla del prompt maestro §26: "cuando existan dos interpretaciones posibles, muestra ambas"):

El founder dijo: *"compramos m² a USD 650 que en la planilla le damos un valor USD 140 según su porcentaje de incidencia en el total. [...] para el cálculo de construcción de los m² faltantes y terminaciones tomamos USD 720."*

Interpreté esto como: el valor de **USD 140/m²** (estructura ya existente, dentro del USD 650 base) se mantiene fijo y **separado** — es una valuación informativa de lo ya construido, no un desembolso adicional de Meridiano (ese ya está cubierto por el precio de adquisición). El **USD 720/m²** se aplica como tasa **completa** (no se le resta el USD 140) tanto a la superficie que falta terminar sobre la estructura existente como a la superficie de obra nueva. Es la lectura que evita pagar el componente estructural dos veces.

- **Si esta lectura es correcta** (Interpretación A): Costo Neto de Obra = USD 720/m² × 3.113,03 m² totales = **USD 2.241.381,60**
- **Si en cambio la obra nueva (826,1 m², sin ninguna estructura todavía) debe llevar el componente estructural adicional** (Interpretación B, USD 140 + USD 720 = USD 860/m² solo para esa porción): Costo Neto de Obra = (USD 720 × 2.286,93) + (USD 860 × 826,1) = **USD 2.357.035,60**

**Uso la Interpretación A como base de este documento** — diferencia con la B: USD 115.654. Corregime si me equivoqué.

## 2. Costo Total de terminación (Escenario Base — 6 pisos, diseño tal cual aprobado en la municipalidad)

| Concepto | Total USD |
|---|---|
| Costo Neto de Obra (terminación + obra nueva, Interpretación A) | 2.241.381,60 |
| Proyecto (honorarios de diseño/ingeniería) | 280.172,70 |
| Aprobaciones, costos indirectos e imprevistos | 101.173,48 |
| **Costo Total de terminación** | **2.622.727,78** |

**D — pendiente de confirmar**: si "Proyecto" y "Aprobaciones e imprevistos" son costos que Meridiano todavía debe pagar, o si ya están cubiertos (sunk) por el desarrollador actual y forman parte de lo que se compra con los USD 850.000. Se incluyen acá de forma conservadora (asumiendo que Meridiano los paga) — si están sunk, el costo total baja en USD 381.346,18.

## 3. El terreno — la parte que pidió el founder: valorar el riesgo y el tiempo evitados

El founder pidió usar **USD 360.000** como costo atribuido al terreno dentro de los USD 850.000 totales — explícitamente **más alto** que un terreno crudo comparable, porque ese número tiene que absorber el valor de los riesgos y el tiempo que Meridiano **ya no corre** por comprar una estructura en pie en vez de un lote vacío.

Con esto, se puede calcular a qué valor implícito queda la estructura existente dentro del precio de compra, y comparar esa cifra contra su costo de reposición puro:

| | USD |
|---|---|
| Precio de adquisición total | 850.000 |
| (−) Terreno, según instrucción del founder | 360.000 |
| **= Valor implícito de la estructura existente dentro del trato** | **490.000** |
| (−) Costo de reposición puro de la estructura (USD 140/m² × 2.286,93 m²) | 320.170,20 |
| **= Valor atribuible al riesgo evitado + tiempo ganado** | **≈ USD 169.830** |

**Esto responde, en parte, a lo que pidió el founder**: comprar la estructura ya en pie (73,5% de avance estructural, ver `03-presupuesto-y-comparables.md`) implica pagar un premio de aproximadamente **USD 170.000** por sobre el costo de reposición puro de esa estructura — ese premio es la cifra que representa el riesgo de obra (estructural, climático, de cronograma) y el tiempo que Meridiano se ahorra al no empezar desde cero. Es una cifra derivada de la instrucción del founder, no un dato de mercado independiente — **C, estimado**, sujeto a que el founder confirme si USD 360.000 es el número correcto para el terreno.

## 4. Comparación: Escenario Base (comprar y terminar) vs. comprar terreno crudo y construir desde cero

### Escenario Base — comprar y terminar (el trato actual, USD 850.000)

| | USD |
|---|---|
| Adquisición (terreno + estructura existente) | 850.000 |
| Costo Total de terminación (sección 2) | 2.622.727,78 |
| **Inversión total** | **3.472.727,78** |

### Alternativa — comprar terreno equivalente y construir el mismo edificio desde cero

**Importante**: para esta alternativa se usa un valor de terreno **crudo**, no el de USD 360.000 (ese ya incluye el premio de riesgo/tiempo que en esta alternativa no aplicaría, porque en esta alternativa sí se corren esos riesgos y ese tiempo). Se usan los dos valores de referencia ya registrados en `03-presupuesto-y-comparables.md`, sin un comparable de terreno crudo independiente todavía — **D, pendiente**:

| | USD (extremo bajo, USD 280.000 de referencia) | USD (extremo alto, USD 398.650 de referencia) |
|---|---|---|
| Terreno | 280.000 | 398.650 |
| Construcción 100% desde cero (estructura USD 140/m² + terminación a calidad objetivo USD 720/m², sobre los 3.113,03 m² totales = USD 860/m²) | 2.677.205,80 | 2.677.205,80 |
| Proyecto + Aprobaciones/imprevistos (mismos montos que el Escenario Base, aproximado) | 381.346,18 | 381.346,18 |
| **Inversión total** | **3.338.551,98** | **3.457.201,98** |

### Comparación directa

| Escenario | Inversión total |
|---|---|
| Comprar y terminar (Escenario Base, USD 850.000) | **USD 3.472.727,78** |
| Comprar terreno crudo y construir desde cero | **USD 3.338.552 – 3.457.202** |

**Hallazgo importante, sin suavizar**: con los supuestos actuales, **comprar y terminar NO sale más barato que construir desde cero** — sale entre USD 15.500 y 134.200 más caro, según qué valor de terreno crudo se use de referencia. La diferencia es chica en términos relativos (menos del 4% de la inversión total), pero **el argumento de "conviene comprar así" no se sostiene solo en el costo total** con los números que hay hoy.

**Lo que este cálculo todavía NO captura — y es donde probablemente esté la verdadera ventaja del trato**:
- **Tiempo**: construir desde cero implica ~2 años más de cronograma antes de llegar al mismo punto de avance (73,5% de estructura) que ya tiene este edificio. Ese tiempo tiene un costo de oportunidad real (capital inmovilizado más tiempo, exposición más tiempo a variación de precios/inflación de materiales) que este cálculo estático todavía no descuenta — hace falta el flujo de fondos con TIR/VAN (§18 del prompt maestro) para capturarlo correctamente, comparando los dos escenarios con sus cronogramas reales, no solo el costo total nominal.
- **Riesgo de obra evitado**: el 73,5% de la estructura ya superó la etapa de mayor riesgo técnico/climático de una obra nueva (excavación, fundaciones, estructura) sin incidentes conocidos — ese riesgo evitado tiene valor aunque no cambie el costo nominal total.
- El terreno crudo de referencia (USD 280.000–398.650) **no está confirmado con un comparable real** — si el valor real de un terreno equivalente en Herrera es más alto, la alternativa "desde cero" se encarece y la comparación favorece más al Escenario Base.

## 5. Los tres escenarios de producto a evaluar (aclaración de nomenclatura, reemplaza "Ángulo 1/Ángulo 2" de los mensajes anteriores)

El founder confirmó tres escenarios distintos, no dos:

- **Escenario Base**: terminar el proyecto tal cual está presentado en la Municipalidad — 6 pisos, 21 unidades, diseño y fachada actuales. **Ya tiene costo calculado** (secciones 2 y 4 de este documento).
- **Opción 1**: mantener los mismos 6 pisos (misma envolvente aprobada), pero con **tipologías más chicas** (para aumentar los ingresos totales por m² vendible) y **cambio de fachada estética**. Sin piso adicional. **Todavía sin cómputo propio de superficies ni presupuesto.**
- **Opción 2**: **Opción 1 + solicitar los permisos para un piso más** (7 pisos en vez de 6) — combina tipologías nuevas, fachada nueva, y la superficie adicional (+300 m² comercializables aproximados, según `03-presupuesto-y-comparables.md`, sujeto a confirmación municipal del incentivo de altura). **Todavía sin cómputo propio.**

## 6. Conclusión de esta etapa — todavía no es LA conclusión

**No se puede responder todavía** "¿es válido pagar USD 850.000 por todo?" de forma definitiva — el founder fue explícito en que esa conclusión depende del análisis completo de los tres escenarios, y hoy solo el Escenario Base tiene número. Lo que sí se puede decir con lo que hay:

- El Escenario Base, comparado contra construir desde cero, da un costo total **similar** (Meridiano no está pagando una prima grande por comprar ya construido, con los supuestos actuales) — la ventaja real del trato probablemente esté en tiempo y riesgo evitado, no en costo nominal.
- El margen bruto del Escenario Base, en el extremo bajo del rango de venta de la zona, **sigue dando negativo** (ver `03-presupuesto-y-comparables.md`, ahora con el costo total actualizado a USD 3.472.727,78 el resultado es más negativo que el cálculo anterior, no menos).
- Esto refuerza por qué las Opciones 1 y 2 (tipologías más chicas, fachada nueva, posible piso adicional) importan para la decisión final — son las palancas que podrían mejorar el ingreso por m² lo suficiente como para justificar el precio de compra.

## Próximo paso

Costear Opción 1 y Opción 2 con la misma metodología (superficie × tasas confirmadas acá) para poder comparar los tres escenarios cabeza a cabeza y recién ahí construir la recomendación final (comprar / negociar / no comprar) que pide el prompt maestro.
