Estado: CURRENT — costos desagregados por ítem + estrategia venta/renta híbrida
Fuente original: instrucciones del founder, 2026-08-13 (sexto mensaje del día)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-13

# Costos desagregados por ítem + estrategia venta/renta híbrida

## 1. Costos desagregados por ítem (para la presentación)

**Ítems ya confirmados para Herrera específicamente** (`03-presupuesto-y-comparables.md`, `06-margen-neto-comision-y-precios-por-piso.md`) — categoría **A**:

| Ítem | Base | Monto/tasa |
|---|---|---|
| Estructura existente (valor de lo ya construido, informativo) | USD 140/m² × 2.286,93 m² | USD 320.170,20 |
| Terminación + obra nueva (Ángulo 1, calidad USD 720/m²) | USD 720/m² × 3.113,03 m² | USD 2.241.381,60 |
| Terminación + obra nueva (Ángulo 2, incluye piso adicional) | + 300 m² × USD 720/m² | + USD 216.000 |
| Proyecto (honorarios de diseño/ingeniería) | USD 90/m² × 3.113,03 m² | USD 280.172,70 |
| Aprobaciones, costos indirectos e imprevistos | — | USD 101.173,48 |
| Cocheras (ingreso, no costo) | USD 15.000 × 21 | USD 315.000 |
| Comisión de venta | 5,5% de ingresos por venta | variable, ya aplicada en `06-...md` |

**Ítems de las dos planillas de referencia** (`02-plantillas-de-referencia.md`) — categoría **C, plantilla genérica, no confirmados para Herrera todavía**, agrupados por función para la presentación:

### Trámites, tasas e impuestos (planilla "Proyecto Ejecución")
| Ítem | Base |
|---|---|
| Impuesto de Construcción Municipal | 3,5% sobre m² |
| Impuesto de Fraccionamiento (Catastro) | 1% del cómputo métrico |
| Gastos de escribanía/transferencia del terreno | monto fijo (placeholder) |
| Inscripción cuenta catastral en escribanía | monto fijo (placeholder) |
| Tasa de inscripción en Registro | por unidad (placeholder) |
| Arancel SNC / copias | por unidad (placeholder) |
| Reglamento de copropiedad | monto fijo (placeholder) |
| Gestor de trámite de copropiedad | monto fijo (placeholder) |
| Medidores ANDE / ESSAP, factibilidad ANDE | por unidad / monto fijo (placeholder) |
| Estudio de suelos | sin valor cargado |
| Gastos Generales de obra | 3% sobre construcción |

### Marketing y comercialización (ambas planillas, con cifras distintas — ver nota de discrepancia abajo)
| Ítem | Base (planilla "Proyecto Ejecución") | Base (planilla "Fideicomiso") |
|---|---|---|
| Comisión de venta | 5,5% sobre ingresos | 3% canal interno + 5% canal externo (mix 40/60 → ≈4,2% ponderado) |
| Marketing digital | — | USD 80.000 total del proyecto |
| Showroom, renders, maqueta | — | USD 35.000 |
| Eventos de lanzamiento | — | USD 15.000 |

**✅ Resuelto (2026-08-14)**: el 5,5% es la tasa real y única — el ≈4,2% ponderado era el modelo de reparto de otro proyecto genérico, no aplica a Herrera. Lo que sí varía es **quién se queda con cuánto de ese 5,5%** según el canal de venta (Meridiano a dos puntas, equipo interno, franquicia RE/MAX o Century 21, agente independiente) — ver el detalle completo en `08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 1.

### Financieros, legales y fiduciarios (planilla "Fideicomiso")
| Ítem | Base |
|---|---|
| Fee Desarrollador | 8% sobre costo total — **nota: esto es la compensación de Meridiano como desarrollador, no un costo a restar del retorno del inversor; se factura contra el proyecto pero es ingreso de Meridiano, no una pérdida de valor** |
| Honorarios del fiduciario | 0,5% anual sobre activos |
| Fideicomiso (constitución/estudio) | 2% |
| Transferencia Escribanía | 1% |
| Comisión Financiera | 2,5% (si se usa financiamiento bancario) |
| Gastos legales y notariales | USD 1.500 por unidad escriturada |
| Impuesto de sellos | 1,8% sobre precio de venta |
| Impuesto a las ganancias / ITI | 10% sobre la utilidad del fideicomiso |
| Gastos administrativos | USD 8.000/mes |

**Ninguno de estos ítems de "Financieros, legales y fiduciarios" se restó todavía del margen.** **Actualizado 2026-08-14**: el financiamiento ya se confirmó como fondos propios (categoría I del Data Room) — esto descarta la Comisión Financiera (2,5%, condicionada a deuda bancaria). Los ítems ligados a fideicomiso (Honorarios del fiduciario, Fideicomiso 2%) siguen pendientes de si se usa o no ese vehículo legal para administrar el capital propio. Ver `08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 2.

---

## 2. Estrategia híbrida: vender una parte, retener y rentar el resto

El founder introdujo una consideración estratégica nueva: **el comprador del edificio no tiene que vender el 100% de las unidades** — puede vender una parte y retener el resto para generar renta. Esto cambia la lógica de retorno de forma importante:

### El mecanismo, explicado con números reales del sistema

Una unidad que Meridiano **retiene** (no vende) entra a su cartera de renta al **costo de construcción/adquisición** (lo que Meridiano efectivamente desembolsó), no al **precio de venta de mercado** que pagaría un comprador individual. Esa unidad tampoco paga comisión de venta ni parte de los costos de marketing (esos costos son solo de las unidades que sí se venden). Como el yield de renta se calcula como *ingreso de alquiler ÷ costo de entrada*, un costo de entrada más bajo da, para el mismo ingreso de alquiler, un **yield más alto** que el que obtendría un inversor comprando una unidad ya terminada al precio de mercado.

**Demostración con el motor real de Meridiano** (`production/app/backend/calculadora.py`, el mismo que usa el resto del sistema — no una estimación aparte):

Unidad ilustrativa: 45 m² (tipo "1 dormitorio" del mix del Ángulo 3), clase `temporal_departamento` (renta vía Urbannit — es exactamente el producto que ya vende Meridiano, y las unidades chicas de este mix son del tamaño que le queda bien a ese modelo).

| | Costo de entrada RETENIDA (Meridiano) | Costo de entrada RETAIL (comprador individual) |
|---|---|---|
| Base de cálculo | USD 1.929,29/m² (Inversión Total Ángulo 3 ÷ 1.800 m²) | USD 1.975/m² (punto medio del rango de venta del Ángulo 3) |
| Precio de compra equivalente (45 m²) | USD 86.818 | USD 88.875 |
| Yield bruto anual (misma renta mensual ilustrativa) | **17,42%** | **17,01%** |

**⚠️ Esto es una demostración del mecanismo, no una proyección de renta real todavía**: la renta mensual usada (USD 1.260, de un ADR ilustrativo de USD 70/noche al 60% de ocupación) es la misma que ya se usó como ejemplo en las propuestas comerciales de Urbannit (D-056) — **no es un dato de mercado específico de Barrio Herrera**, que todavía no se relevó. El resultado neto de este ejemplo dio negativo para ambos casos (el ADR ilustrativo es bajo para el costo de esta unidad) — lo relevante acá no es el signo del resultado, sino que **confirma el mecanismo**: a igual renta, el costo de entrada más bajo de Meridiano (retenida) siempre da un yield mayor que el costo de entrada de un comprador retail — la diferencia crece cuanto más grande sea la brecha entre costo de construcción y precio de venta.

### Comparación de yield-piso existentes por clase (ya confirmados en el sistema, D-033/D-044/D-045)

| Clase | Piso de rentabilidad (bruto) |
|---|---|
| `temporal_departamento` / `temporal_casa` (vía Urbannit) | 15% |
| `departamento_amoblado` | 10% |
| `comercial` | 10% |
| `departamento_sin_muebles` | 8% |
| `residencial_casa` | 7% |

**Esto es relevante para decidir qué se retiene y qué se vende**: las unidades chicas (monoambiente/1 dormitorio) encajan en el producto de renta temporal (piso más alto, 15%, y es exactamente lo que ya opera Urbannit) — son las candidatas más fuertes para retener. Las unidades grandes (2/3 dormitorios) tienen pisos de renta más bajos si se alquilan tradicionalmente, y atan más capital por unidad retenida — son más fuertes candidatas para vender.

## 3. Propuesta preliminar de % venta/retención por ángulo

**⚠️ Actualizado por `08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 4**: la matriz de decisión construida ahí muestra que el techo de retención razonable es más alto que lo que se propone abajo — el límite real no es cuánto conviene retener por rentabilidad (conviene retener casi todo, dado el margen de venta delgado de Herrera), sino cuánto hace falta vender para financiar la obra. Se conserva esta sección por trazabilidad del razonamiento original.

**Esto es una propuesta razonada, no una decisión ya tomada** — el founder pidió sugerir un porcentaje, y esto es un punto de partida para discutir, no la palabra final.

| Ángulo | Sugerencia | Razonamiento |
|---|---|---|
| **Ángulo 1** (mix actual, 15 de 2 dorm / 3 de 1 dorm / 3 de 3 dorm) | Vender ~80%, retener ~20% (las 3 unidades de 1 dormitorio + 1 de 2 dormitorios, aprox.) | Pocas unidades chicas en este mix — la base retenible para renta temporal de alto piso es chica |
| **Ángulo 3** (29 unidades, mix parejo) | Vender el 100% de 2/3 dormitorios (13 unidades), **retener el 60-70% de monoambientes y 1 dormitorio** (16 unidades → retener ~10-11) | El mix está diseñado justo para esto — monoambiente/1 dormitorio calzan con renta temporal (piso 15%) |
| **Ángulo 2** (39 unidades, +10 monoambientes sin cochera en el piso extra) | Mismo criterio que Ángulo 3, **más el 100% del piso adicional retenido** (10 monoambientes) — son las unidades con menor costo marginal (USD 720/m², sin arrastrar el costo de terreno/estructura existente) | El piso adicional es, unidad por unidad, lo más barato de producir — máximo beneficio de retenerlo en vez de venderlo |

## 4. Próximo paso — el flujo de fondos completo

El founder pidió elaborar un **flujo de fondos** que incorpore todas estas consideraciones — venta de una parte, renta de la otra, costos desagregados, comisiones, impuestos. Esto es un modelo multi-año (no un cálculo estático como los anteriores). **Actualizado 2026-08-14** — de los tres puntos que faltaban acá, dos ya se resolvieron:

1. ~~Renta mensual real esperada por tipo de unidad~~ → **Parcialmente resuelto**: se formalizó un piso de alquiler mínimo por tipología (`08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 3). Sigue faltando el dato real de mercado de Barrio Herrera.
2. ~~Definir la estructura de financiamiento~~ → ✅ **Resuelto: fondos propios** (`08-...md`, sección 2).
3. ~~Confirmar el % de venta/retención real por ángulo~~ → **Parcialmente resuelto**: hay una matriz de decisión (`08-...md`, sección 4) que muestra que conviene retener casi todo por rentabilidad — el % final todavía depende del cronograma de obra y el capital propio disponible por adelantado, que es el nuevo dato pendiente (`01-informacion-critica-faltante.md`, ítem 16).

La estructura de categorías del flujo mensual ya está definida en la planilla de referencia (`02-plantillas-de-referencia.md`): Ingresos (por etapa de cobro) → Egresos de inversión inicial → Egresos de construcción → Egresos de marketing → Egresos financieros/administrativos → Retorno a inversores → Resultado neto. Se puede adaptar directamente a Herrera una vez resuelto el cronograma de obra/capital disponible (ítem 16).
