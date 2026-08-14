Estado: CURRENT — primer presupuesto de terminación real + comparable de mercado real
Fuente original: imágenes aportadas por el founder el 2026-08-13 (planilla de costos "Edificio Barrio Herrera", flyer comercial "Filum Herrera" de Century 21 Liberty, fotos de obra actual, renders adicionales de fachada)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-13

# Presupuesto de terminación y comparable real de mercado

**Esto resuelve, por primera vez con números reales, el bloqueante principal que veníamos arrastrando** (avance de obra + presupuesto de terminación, marcado pendiente por el founder el 2026-08-12). Sigue sin ser un informe formal del ingeniero — es una planilla de estimación de costos que el founder aportó — pero ya permite calcular, no solo dimensionar magnitud.

## 1. Superficies — reconciliación de las 3 cifras (importante, no confundirlas)

La planilla de costos trae **tres superficies totales distintas**, cada una con un significado diferente. No son errores entre sí — miden cosas distintas:

| Superficie | m² | Qué es |
|---|---|---|
| Superficie Total **Aprobada s/sellos** | 2.624 | La que figura en el plano municipal sellado — la misma que ya habíamos confirmado en `00-data-room-index.md` desde los planos técnicos y el brochure |
| Superficie Total **Proyecto Original** | 2.948,03 | Diseño original, antes o al margen del sellado municipal — **D, no está claro todavía por qué difiere de la aprobada** |
| Superficie Total **a Construir** | 3.113,03 | La que usa esta planilla de costos para calcular — desagregada así: Subsuelo 526,13 + Planta Baja 439,8 + Plantas tipo ×6 1.982,1 + Roof top estimado 165 = 3.113,03 ✓ |

**Corrección a lo que dijimos el 2026-08-12**: en la revisión de `Proyecto Ejecucion Edificio Herrera Tower.xlsx` señalamos el valor "3.113 m²" de la línea "Construcción Completa" como un placeholder genérico de la plantilla vieja (Mburucuyá), sin relación con Herrera. **Era un error de interpretación** — ese 3.113 m² sí es el dato real de Herrera (Superficie Total a Construir de esta misma planilla de costos), simplemente no lo reconocimos como tal en ese momento porque el resto de esa hoja estaba vacío. El resto de la observación sobre esa plantilla (áreas por tipo de unidad en cero, precio de venta placeholder de USD 1.700/m² no confirmado) sigue siendo válido.

## 2. Avance de obra — **A (Confirmado), en superficie de estructura, no en % genérico**

**Superficie de Estructura de Hormigón Existente: 2.286,93 m²**, sobre un total a construir de 3.113,03 m² → **73,5% de la superficie estructural total ya está construida** (B — calculado).

Esto es exactamente la distinción que pide el prompt maestro (§7): es avance de **estructura**, no de terminación, instalaciones ni obra total — el 73,5% mide hormigón levantado, no departamentos habitables. Sigue faltando (**D, pendiente**) el desglose de avance en mampostería, instalaciones eléctricas/sanitarias y terminaciones, que la planilla no separa.

**Evidencia visual (fotos de obra aportadas por el founder, 2026-08-13)**: se ven columnas y losas de hormigón expuestas hasta aproximadamente 4-5 niveles, con encofrado de madera todavía colocado en el nivel superior (sugiere una losa recién vaciada o en proceso), varillas de hierro expuestas en la parte superior (previstas para continuar la estructura), y cartelería de obra de "Cáceres Ocampo" y "BOLD" en el cerco perimetral — coincide con el equipo ya identificado en el brochure oficial. Es evidencia fotográfica cualitativa, consistente con el 73,5% de avance estructural de la planilla, pero **no reemplaza un informe técnico formal del ingeniero por componente**.

## 3. Presupuesto de terminación — **A (Confirmado por el founder), primera cifra real**

Metodología de la planilla: separa el costo por m² en dos porciones — el valor de lo **ya construido** (estructura existente) y el costo de **terminarlo**, más el costo de la porción **todavía sin construir** (obra nueva):

| Concepto | $/m² | m² | Total USD |
|---|---|---|---|
| Estructura Existente (valor de lo ya construido) | 140 | 2.286,93 | 320.170,20 |
| Terminación sobre estructura existente | 510 | 2.286,93 | 1.166.334,30 |
| Obra nueva (826,1 m² = 3.113,03 − 2.286,93) | 650 | 826,1 | 536.965,00 |
| **Total Costo Neto Obra** | | | **2.023.469,50** |
| Valor estimado del lote | | | 280.000,00 |
| Proyecto (honorarios de diseño/ingeniería) | 90 | 3.113,03 | 280.172,70 |
| Aprobaciones, costos indirectos e imprevistos | | | 101.173,48 |
| **Costo Total (6 pisos, diseño actual)** | | | **2.684.815,68** |
| **Costo Total / m²** | | | **862,44** |

**Nota de metodología, confirmada por el founder**: 140 + 510 = 650 exacto — la planilla arma el costo total de USD 650/m² como la suma de la porción "estructura" (140) más la porción "terminación" (510). Para lo ya construido solo se paga la porción de terminación (510/m²), no el total, porque la estructura ya existe. Para lo no construido (obra nueva) se paga el USD 650/m² completo.

**Actualización del founder sobre este valor (2026-08-13)**: *"Nosotros luego vamos a tomar un valor de USD 750 el m² de construcción porque la calidad constructiva de terminaciones es superior. Pero para los hechos de los cálculos de la estructura tomamos los USD 650."* Esto **reemplaza** el valor de USD 720/m² que había dado el día anterior (2026-08-12) — se toma **USD 750/m²** como la cifra vigente para calidad de terminación objetivo, manteniendo el desglose metodológico (140 estructura / resto terminación) de la planilla.

### Recálculo aplicando USD 750/m² — **B (Calculado por mí, aplicando la instrucción del founder — no es un dato de la planilla original)**

Manteniendo fija la porción de estructura existente (USD 140/m², no cambia porque ya está construida) y llevando el total a USD 750/m² (terminación = 750 − 140 = USD 610/m²; obra nueva = USD 750/m² completo):

| Concepto | $/m² | m² | Total USD |
|---|---|---|---|
| Estructura Existente (sin cambio) | 140 | 2.286,93 | 320.170,20 |
| Terminación sobre estructura existente | 610 | 2.286,93 | 1.395.027,30 |
| Obra nueva | 750 | 826,1 | 619.575,00 |
| **Total Costo Neto Obra (recalculado)** | | | **2.334.772,50** |
| Valor estimado del lote (sin cambio) | | | 280.000,00 |
| Proyecto (sin cambio) | | | 280.172,70 |
| Aprobaciones e imprevistos (sin cambio) | | | 101.173,48 |
| **Costo Total recalculado (6 pisos)** | | | **2.996.118,68** |
| **Costo Total / m² recalculado** | | | **962,44** |

## 4. Superficie comercializable y el escenario de un piso más — **A (Confirmado)**

- Superficie comercializable aproximada (6 pisos, diseño actual): **1.800 m²** — consistente (dentro de un margen de redondeo) con los 1.813,6 m² ya calculados a partir de la tabla de unidades del brochure.
- Cocheras a comercializar: **21** — coincide exactamente con lo ya confirmado.
- **Si el municipio y la estructura resistente lo permiten, superficie comercializable con 1 piso más (7 pisos): 2.100 m²** — es decir, **+300 m² vendibles** por agregar el piso adicional que el founder quiere evaluar.

**Hallazgo relevante para el Ángulo 2 (piso adicional) — D, pendiente de confirmar con el municipio**: la misma planilla trae datos de edificabilidad que sugieren que esto ya está contemplado en la normativa de la zona: *"Altura máxima: PB + 5 pisos"* en el régimen base, pero *"Con incentivo: PB + 7 pisos"* — con una condición de retiro mayor (6 m en uno de los lados, en vez de 3 m). El edificio ya diseñado tiene PB + 6 pisos, es decir, **ya está usando parte de ese incentivo municipal**. Esto sugiere que subir a PB + 7 pisos podría estar dentro de lo que la normativa ya permite (no requeriría una excepción nueva), pero **esto no está confirmado con la Municipalidad todavía** — es una lectura de esta planilla, no una verificación legal.

## 5. Comparable real de mercado — **A (Confirmado, primera fuente documentada, no solo estimación del founder)**

**"Filum Herrera"** — proyecto competidor real, mismo barrio (Herrera, Asunción), comercializado por Century 21 Liberty, entrega diciembre 2026. Flyer aportado por el founder:

| Tipología | m² | Precio desde (USD) | USD/m² implícito |
|---|---|---|---|
| 1 dormitorio | 38 | 70.300 | 1.850 |
| 1 dormitorio | 40 | 75.600 | 1.890 |
| 1 dormitorio Plus | 48 | 97.200 | 2.025 |
| 2 dormitorios | 77 | 142.500 | 1.851 |

Amenities: piscina infinita, quinchos equipados, gimnasio, coworking. Terminaciones: pisos de porcelanato, mesadas de granito, A/C split, iluminación LED. Financiación propia y bancaria.

**Esto valida con una fuente real (no solo el conocimiento de mercado del founder) el rango de USD 1.750–2.100/m² ya registrado** — los precios "desde" (probablemente preventa temprana) de Filum Herrera caen en el extremo bajo-medio de ese rango, coherente con la lógica de "precio según etapa de construcción" que ya se había anotado. También es evidencia directa de que **el mercado de la zona sí absorbe tipologías chicas (38-48 m², 1 dormitorio)** — relevante para el Ángulo 2, que contempla monoambientes de 30 m² y 1 dormitorio de 45 m².

## 6. Discrepancia a resolver — valor del terreno entre las dos planillas del founder

- `Proyecto Ejecucion Edificio Herrera Tower.xlsx` (revisado 2026-08-12): línea "Terreno" a USD 850/m² × 469 m² = **USD 398.650**.
- Esta planilla de costos (2026-08-13): "Valor estimado del lote" = **USD 280.000** plano, sin desagregar por m² (implica ≈USD 597/m²).

**D — pendiente de aclarar con el founder**: son dos estimaciones de valor de terreno distintas dentro de su propio material de referencia, ninguna es el precio real de compra ($850.000, que es el precio del predio completo con lo construido, no solo el terreno). No se usa ninguna de las dos para el cálculo de inversión total — se sigue usando el precio de adquisición real ($850.000) como el costo de entrada.

## 7. Primer cálculo de margen preliminar — Ángulo 1 (diseño actual, 6 pisos)

**Sigue siendo preliminar** — falta restar comisión de venta (5,5%, ya documentada en `02-plantillas-de-referencia.md`), impuestos, costos financieros y el fee de fideicomiso. Sirve para ver el orden de magnitud con datos ya mucho más sólidos que el cálculo del 2026-08-12.

**Inversión total de Meridiano** (adquisición USD 850.000 + costo de terminación, excluyendo la línea "Estructura Existente" y "Valor estimado del lote" de la planilla — porque esas dos ya están cubiertas por el precio de adquisición, no son un desembolso adicional):

| Escenario de costo | Terminación + obra nueva + proyecto + imprevistos | + Adquisición (USD 850.000) | Inversión total |
|---|---|---|---|
| USD 650/m² (planilla original) | 2.084.645,48 | | **2.934.645,48** |
| USD 750/m² (ajuste del founder) | 2.395.948,48 | | **3.245.948,48** |

**Ingresos brutos potenciales** (1.800 m² comercializables, rango USD 1.750–2.100/m², validado con el comparable Filum Herrera):
- Extremo bajo: 1.800 × 1.750 = **USD 3.150.000**
- Extremo alto: 1.800 × 2.100 = **USD 3.780.000**

**Margen bruto preliminar (ingresos − inversión total, ANTES de comisión de venta, impuestos y financiero)**:

| | Extremo bajo de venta (1.750/m²) | Extremo alto de venta (2.100/m²) |
|---|---|---|
| Costo a USD 650/m² | +215.355 | +845.355 |
| Costo a USD 750/m² | **−95.948** | +534.052 |

**⚠️ Hallazgo que hay que decir sin suavizar**: con el ajuste de calidad que el founder confirmó (USD 750/m²), el extremo bajo del rango de venta de la zona **da margen bruto negativo — antes de restar siquiera la comisión de venta (5,5%), que sola representa entre USD 173.000 y 208.000 más**. Esto no es una conclusión de "no comprar" — es exactamente la clase de resultado que el Ángulo 2 (piso adicional + tipologías más chicas, que suelen vender a USD/m² más alto, como muestra el comparable Filum Herrera) está pensado para mejorar. Pero con el diseño actual de 6 pisos tal cual está, en el extremo bajo del rango de venta, el proyecto no deja margen positivo una vez que se resta todo lo que falta restar.

## Qué sigue faltando

- Desglose de avance por componente (mampostería, instalaciones, terminaciones) — la planilla da avance de estructura (73,5%), no de obra total.
- Confirmación municipal real de si el incentivo de PB+7 pisos aplica tal cual se infiere acá.
- Aclarar la discrepancia de valor de terreno entre las dos planillas (punto 6).
- Costear los escenarios del Ángulo 2 (fachada nueva, tipologías de 30/45 m², piso adicional) — todavía no tienen su propio cómputo de superficies ni presupuesto; lo único costeado hasta ahora es el diseño original de 6 pisos.
- Restar comisión de venta, impuestos, costos financieros y fee de fideicomiso al margen preliminar de la sección 7, usando los porcentajes ya documentados en `02-plantillas-de-referencia.md`.
