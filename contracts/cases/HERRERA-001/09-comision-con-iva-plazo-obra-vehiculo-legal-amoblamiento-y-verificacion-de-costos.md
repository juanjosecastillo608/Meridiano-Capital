Estado: CURRENT — comisión con IVA + reparto agente independiente, plazo de obra, vehículo legal (SA), costos de amoblamiento, y verificación del costo/m² cuestionado por el founder
Fuente original: instrucciones del founder, 2026-08-15, + planilla adjunta "Tabla de Costos Amoblamiento según Tipología de Departamentos.xlsx"
Dominio: INVESTMENT (caso HERRERA-001) — el criterio de comisión (sección 1) se registra además como política CROSS-CUTTING, ver `governance/decisions/DECISION_REGISTER.md`, D-063
Incorporado: 2026-08-15

# Comisión con IVA, plazo de obra, vehículo legal, amoblamiento y verificación del costo cuestionado

## 1. Comisión de venta — el 5,5% ya incluye IVA (10%), y se cierra el reparto con el agente independiente

### 1.1 El 5,5% es la base CON IVA incluido

*"La base de pago es 5,5% con impuestos incluidos, el IVA es del 10%. Por eso puede haber casos que diga 5% porque no está incluido el IVA."*

Esto explica una fuente de confusión que no se había resuelto del todo en `08-...md`: cuando un documento o una parte cita "5%" de comisión, no es una tasa distinta — es la **misma tasa, antes de IVA**. La aritmética cierra exacto: 5% × 1,10 (IVA) = **5,5%**. Regla a partir de ahora, categoría **A (confirmado)**:

| | Neto (sin IVA) | Con IVA (10%) |
|---|---|---|
| Comisión de venta | 5% | **5,5%** |

Todos los cálculos de este caso (`06-...md`, `07-...md`, `08-...md`) ya venían usando 5,5% como la tasa efectiva a restar del ingreso — eso sigue siendo correcto, ahora con la aclaración explícita de que ese 5,5% es la cifra **con IVA**, la que efectivamente sale de la caja del proyecto.

### 1.2 Reparto con el Agente Inmobiliario Independiente — cierra el punto pendiente de `08-...md`

*"Meridiano siempre conserva la captación, que es una fuente de ingresos para Meridiano, y cuando vende el agente independiente se le da la colocación, una punta. Este sistema se comparte en partes iguales: el total de la comisión, el 2,75% para cada uno."*

Esto resuelve el ítem 17 de `01-informacion-critica-faltante.md` (antes `[D — pendiente]` en `08-...md`, sección 1). El 5,5% total se entiende como la suma de dos roles — **captación** (conseguir/listar la unidad, siempre de Meridiano) y **colocación** (conseguir al comprador, "una punta") — y cuando la colocación la hace un agente independiente, el reparto es **igual entre las dos partes**:

| Canal | Reparto del 5,5% (con IVA) |
|---|---|
| Meridiano vende "a dos puntas" (capta y coloca, sin equipo interno) | 100% Meridiano |
| Meridiano vende "a dos puntas" con equipo de ventas interno | 2,5% Meridiano / 3% el vendedor del equipo |
| Franquicia (RE/MAX, Century 21) bajo contrato | 0% Meridiano / 100% cedido a la franquicia |
| **Agente inmobiliario independiente** (capta Meridiano, coloca el agente) | **2,75% Meridiano / 2,75% el agente** ✅ resuelto |

Con esto, la tabla de comisión de `08-...md` sección 1 queda **completa, sin puntos pendientes**.

### 1.3 Esta política se registra como criterio CROSS-CUTTING, no solo de HERRERA-001

*"En nuestra política de ventas, este sistema de pago de comisiones debemos tenerlo estructurado y como regla de pago porque funciona para todos los casos de desarrollos y/o coinversión de la misma manera."*

El founder marcó explícitamente que este esquema de comisión (base 5,5% con IVA, repartida según el canal — dos puntas propio, equipo interno 2,5%/3%, franquicia 0%/100%, agente independiente 2,75%/2,75%) **no es específico de Herrera** — es la política de ventas que Meridiano usa en todos sus desarrollos y coinversiones. Por eso se registra también como decisión de gobernanza cross-cutting, **D-063** en `governance/decisions/DECISION_REGISTER.md`, y no solo como un archivo de este caso — cualquier otro caso futuro de desarrollo/coinversión debe consultar D-063 en vez de reconstruir este criterio desde cero.

---

## 2. Plazo de obra — 12 meses, igual para 6 o 7 pisos (categoría A, confirmado)

*"Hay un plazo de obra que no establecimos, que es de 12 meses de obra para finalizar el edificio, tanto para 6 pisos como para 7 no cambia el plazo de culminación."*

Dato nuevo, no existía antes en ningún archivo del caso. Resuelve parte del ítem 16 de `01-informacion-critica-faltante.md` (cronograma de obra, necesario para el flujo de fondos multi-año y para saber cuántas unidades hay que vender en qué etapa para financiar la construcción). **El plazo es el mismo para el Ángulo 1/3 (6 pisos) y el Ángulo 2 (7 pisos, piso adicional)** — agregar el piso extra no extiende el cronograma de obra, según el founder.

**Sigue pendiente, sub-punto de este mismo ítem 16**: el ritmo de avance mensual/por etapa dentro de esos 12 meses (para poder armar el cronograma de cobro por etapas — reserva/cuotas de obra/saldo escritura, tal como plantea la planilla de referencia en `02-...md`) y cuánto capital propio de los socios está disponible para adelantar sin depender de preventas.

---

## 3. Vehículo legal — Sociedad Anónima, 2-3 socios, 100% del capital (categoría A, confirmado — resuelve la pregunta abierta de `08-...md`)

*"El vehículo legal se va a constituir: una SA entre los socios, que serían 2/3 personas, las que aportarían el 100% del capital necesario para la compra del terreno y para la construcción del edificio."*

Esto responde la pregunta que había quedado explícitamente abierta en `08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 2 ("¿se usa fideicomiso como vehículo, sí o no?"): **no se usa fideicomiso — el vehículo es una Sociedad Anónima constituida entre 2-3 socios**, que aportan el 100% del capital (terreno + construcción) — consistente con "fondos propios" ya confirmado en `08-...md`.

**Consecuencia directa sobre los costos de la planilla de referencia (`02-...md` / `07-...md`, sección "Financieros, legales y fiduciarios")**:

| Ítem | ¿Aplica? |
|---|---|
| Honorarios del fiduciario (0,5%/año), Fideicomiso — constitución/estudio (2%) | **No aplican** — no hay fideicomiso como vehículo. Se descartan del cálculo de costos. |
| Comisión Financiera (2,5%) | Sigue sin aplicar (ya descartado en `08-...md`, no hay deuda bancaria). |
| Transferencia Escribanía (1%), Impuesto de sellos (1,8%), Gastos legales/notariales (USD 1.500/unidad), Impuesto a las ganancias/ITI | Siguen aplicando — no dependen del vehículo legal, sino de la operación de compraventa/escrituración en sí. **Sigue pendiente confirmar si el ITI (pensado para un fideicomiso en la planilla de referencia) es el régimen tributario correcto para una SA**, o si corresponde otro impuesto societario — no se asume, queda como **[D — pendiente]**. |
| Fee Desarrollador (8%) | Sigue siendo ingreso de Meridiano como desarrollador — no depende del vehículo legal usado por los socios inversores. |

**Actualizar `00-data-room-index.md`, categoría I**: se agrega, junto a "fondos propios" ya confirmado, que el vehículo es **SA con 2-3 socios**, no fideicomiso — cierra el sub-punto que había quedado abierto.

---

## 4. Costos de amoblamiento — nueva regla para la rentabilidad de alquileres amoblados

### 4.1 La planilla aportada

El founder adjuntó `Tabla de Costos Amoblamiento según Tipología de Departamentos.xlsx` — categoría **A (confirmado)**, dato real de costos, no una estimación:

| Tipo de amoblamiento | Monoambiente | 1 Dormitorio | 2 Dormitorios | 3 Dormitorios |
|---|---|---|---|---|
| Básico | USD 4.000 | USD 6.000 | USD 7.000 | USD 8.000 |
| Estándar | USD 5.000 | USD 8.000 | USD 9.000 | USD 10.000 |
| Premium | USD 7.000 | USD 10.000 | USD 12.000 | USD 14.000 |
| Lujo | USD 9.000 | USD 14.000 | USD 17.000 | USD 20.000 |

Notas de la propia planilla: valores en dólares, **IVA incluido**. **Premium/Lujo** se recomienda para Airbnb ("ya incluye todo lo necesario para operar"). **Básico/Estándar** se recomienda para alquiler tradicional amoblado.

### 4.2 La regla, confirmada por el founder

*"Para determinar la rentabilidad en el caso de alquiler amoblados debemos sumarle al costo del departamento el costo del amueblamiento, dependiendo de la tipología y la calidad del amueblamiento (...) también la vamos a tener como regla para determinar las rentabilidades de los alquileres en el caso de los amoblados."*

> **Costo de entrada de una unidad retenida para alquiler amoblado = Costo de construcción/adquisición de la unidad + Costo de amoblamiento según su tipología y la calidad elegida.**

Igual que el plazo de obra y la política de comisión, el founder marca esto como una **regla del sistema, no solo de Herrera** — aplica a cualquier unidad que Meridiano retenga y alquile amoblada, en cualquier caso futuro. Mapeo de calidad recomendado por producto (según la nota de la propia planilla): unidades bajo `temporal_departamento` (Airbnb, piso 15%) usan Premium o Lujo; unidades bajo `departamento_amoblado` (alquiler tradicional, piso 10%) usan Básico o Estándar.

### 4.3 Piso de alquiler mensual, recalculado con amoblamiento — Ángulo 3

Se actualiza la tabla de `08-comision-financiamiento-piso-renta-y-matriz-decision.md`, sección 3, sumando el costo de amoblamiento al costo de entrada antes de aplicar el piso de rentabilidad:

| Tipología | Costo depto (sin amoblar) | + Amoblamiento | Costo total de entrada | Piso anual | **Piso mensual (antes: sin amoblar)** |
|---|---|---|---|---|---|
| Monoambiente (30 m²) | USD 57.879 | + Premium USD 7.000 | USD 64.879 | 15% | **USD 811** (antes USD 723) |
| Monoambiente (30 m²) | USD 57.879 | + Lujo USD 9.000 | USD 66.879 | 15% | **USD 836** |
| 1 dormitorio (45 m²) | USD 86.818 | + Premium USD 10.000 | USD 96.818 | 15% | **USD 1.210** (antes USD 1.085) |
| 1 dormitorio (45 m²) | USD 86.818 | + Lujo USD 14.000 | USD 100.818 | 15% | **USD 1.260** |
| 2 dormitorios (75 m²) | USD 144.697 | + Básico USD 7.000 | USD 151.697 | 10% | **USD 1.264** (antes USD 1.206) |
| 2 dormitorios (75 m²) | USD 144.697 | + Estándar USD 9.000 | USD 153.697 | 10% | **USD 1.281** |
| 3 dormitorios (120 m²) | USD 231.515 | + Básico USD 8.000 | USD 239.515 | 10% | **USD 1.996** (antes USD 1.929) |
| 3 dormitorios (120 m²) | USD 231.515 | + Estándar USD 10.000 | USD 241.515 | 10% | **USD 2.013** |

**Esto sube el piso de alquiler mínimo en todas las tipologías** (entre 6% y 12% más alto que sin amoblar) — coherente: el amoblamiento es capital adicional invertido en la unidad, y el piso de rentabilidad se aplica sobre el costo total de entrada, no solo sobre la construcción. La matriz de decisión de `08-...md` sección 4 (que compara margen de venta vs. un año de alquiler) **sigue sosteniendo la misma conclusión** con estos números más altos — un año de alquiler amoblado al piso sigue superando ampliamente el margen de venta delgado de Herrera, ahora con un piso ligeramente más alto de lo ya calculado.

---

## 5. Verificación del costo de USD 1.929/m² — el founder pidió chequear si hay un error

*"Hay un error en el cálculo de los costos, debemos verificar (...) es matemáticamente imposible llegar a un costo de construcción de USD 1.929 si mi costo más representativo es el de USD 750, que incluye la construcción completa, materiales de primera calidad y mano de obra."*

Se revisó la cadena completa de cálculo. **Conclusión: no hay una duplicación de costos en sentido estricto, pero el founder tiene razón en que USD 1.929/m² no es directamente comparable a USD 750/m² — son dos números que responden preguntas distintas** (costo por m² *construido* vs. costo por m² *comercializable*, y costo de *solo construcción* vs. costo *todo incluido*). Se abre, además, un punto real que sí amerita una decisión del founder (§5.4).

### 5.1 Por qué USD 1.929/m² no es el mismo tipo de número que USD 750/m²

USD 720-750/m² es el costo de **construir** un m² (materiales + mano de obra), aplicado sobre los **3.113,03 m² totales a construir** (incluye subsuelo, PB, plantas tipo y roof top — `03-presupuesto-y-comparables.md`).

USD 1.929/m² es el costo **total de la inversión** (terreno + adquisición + construcción + honorarios de proyecto + aprobaciones), dividido por los **1.800 m² comercializables** del Ángulo 3 — es decir, solo la superficie que efectivamente se vende o se alquila, que es **menor** a la superficie construida porque el edificio también tiene subsuelo, circulaciones, muros y áreas comunes que no se venden. Ese cociente (1.800 / 3.113,03 = **57,8%**) es el "coeficiente de eficiencia" del edificio — típico en edificios con cochera en subsuelo, y **no es un error, es aritmética real de cualquier desarrollo inmobiliario**.

### 5.2 El puente completo, número por número

| Componente | Base | Monto | **÷ 1.800 m² comercializables** |
|---|---|---|---|
| Construcción (USD 720/m² × 3.113,03 m² totales) | conversión de área: 720 × (3.113,03/1.800) | USD 2.241.381,60 | **USD 1.245,21/m²** |
| Honorarios de proyecto (USD 90/m² × 3.113,03 m²) | — | USD 280.172,70 | **USD 155,65/m²** |
| Aprobaciones e imprevistos | — | USD 101.173,48 | **USD 56,21/m²** |
| Adquisición del edificio (terreno + estructura existente) | — | USD 850.000 | **USD 472,22/m²** |
| **Total** | | **USD 3.472.727,78** | **USD 1.929,29/m²** |

**El salto de USD 720 a USD 1.929 se explica así**: solo por convertir de "por m² construido" a "por m² comercializable", USD 720 ya sube a **USD 1.245/m²** (57,8% de eficiencia) — sin agregar ni un dólar de costo nuevo, es el mismo gasto repartido en menos metros vendibles. El resto de la suma (USD 684/m² más) es honorarios de proyecto + aprobaciones + el precio de compra del edificio (USD 850.000) — ítems reales, ya confirmados en archivos anteriores, que **no estaban incluidos** en los USD 720-750/m² del founder (ese número era explícitamente solo construcción, sin terreno ni honorarios ni aprobaciones).

### 5.3 Esto NO es circular: el costo de amoblamiento de la sección 4 se suma sobre este mismo costo de entrada

Importante aclarar: el costo de entrada de USD 1.929/m² (y sus variantes por tipología en la sección 4) es el que corresponde usar como base del piso de rentabilidad — es el costo real que le cuesta a Meridiano producir un m² vendible, no el costo de construcción en abstracto. Si se usara solo USD 750/m² como base del piso de renta, se estaría **subestimando** el costo real de la unidad retenida (faltaría contar el terreno, los honorarios y las aprobaciones), lo que infla artificialmente el yield calculado.

### 5.4 El punto que sí amerita una decisión — posible doble conteo del componente estructural en la porción ya construida

Al revisar la cadena completa, apareció un punto distinto al que el founder señaló, pero relacionado, que ya se había dejado como ambigüedad abierta en `04-comprar-vs-construir.md` y que el founder resolvió en ese momento a favor de la Interpretación A (no netear) — vale la pena repasarlo ahora que el founder está pidiendo específicamente verificar el cálculo de costos:

- El edificio ya tiene **73,5% de su estructura construida** (2.286,93 de 3.113,03 m²) — y esa estructura ya está pagada dentro del precio de adquisición de USD 850.000 (de los cuales USD 490.000 se le atribuyeron a la estructura existente, según `04-...md`).
- El cálculo vigente (Interpretación A) aplica la tasa completa de **USD 720/m²** también sobre esos 2.286,93 m² ya construidos — y esa tasa de USD 720/m² incluye, según la propia planilla del founder, un **componente estructural de USD 140/m² de incidencia**.
- Es decir: se está pagando el componente estructural del edificio **dos veces** en esa porción — una vez dentro del precio de adquisición (los USD 490.000) y otra vez dentro de la tasa de terminación (USD 140/m² × 2.286,93 m² = **USD 320.170,20**).

**Esto es exactamente la ambigüedad que ya se había presentado en `04-comprar-vs-construir.md`** como Interpretación A (sin netear, la que se usó) vs. Interpretación B (netear los USD 140/m² en la porción ya construida) — el founder ya la había resuelto a favor de A ("son todos costos totales de construcción... no se le resta el componente estructural"). Dado que el founder ahora está pidiendo específicamente revisar si hay algo duplicado, se recalcula qué cambiaría con la Interpretación B, para que la decisión quede tomada con el número real delante:

| | Interpretación A (vigente) | Interpretación B (neteando el componente estructural en la porción ya construida) |
|---|---|---|
| Construcción (total) | USD 2.241.381,60 | USD 1.921.211,40 |
| Inversión Total Ángulo 3 | USD 3.472.727,78 | USD 3.152.557,58 |
| **Costo/m² comercializable** | **USD 1.929,29** | **USD 1.751,42** |
| Diferencia | — | **USD 177,87/m² menos** (USD 320.170,20 en total — exactamente el valor de la estructura existente ya pagada en la adquisición) |

**No se cambia el número vigente sin que el founder lo confirme** — ya fue una decisión explícita una vez. Pero se deja planteada la pregunta de nuevo, ahora con el impacto exacto cuantificado: **¿la tasa de USD 720/m² debe aplicarse completa también sobre el 73,5% ya construido (Interpretación A, USD 1.929/m²), o debe aplicarse neta del componente estructural en esa porción, ya que esa estructura ya se pagó en el precio de compra (Interpretación B, USD 1.751/m²)?**

---

## 6. Escenarios de flujo de fondos — 100% aporte propio, con distintos niveles de venta de unidades

*"Para el flujo de fondos vamos a considerar escenarios de aporte del 100% del capital, con ventas de unidades — eso le va a impactar en la rentabilidad de la inversión."*

Esto confirma y afina lo que ya se había planteado como conclusión en `08-...md`, sección 4.4: con el vehículo definido (SA, 2-3 socios, 100% del capital, sin deuda ni fideicomiso — secciones 2 y 3 de este documento), el flujo de fondos multi-año debe construirse como una **familia de escenarios**, no un único número, variando el % de unidades vendidas (vs. retenidas) dentro de cada ángulo, y mostrando cómo cambia la rentabilidad de la inversión de los socios en cada uno — exactamente la lógica de la matriz de decisión de `08-...md` sección 4, ahora confirmada como el enfoque a seguir para el flujo de fondos formal, no solo como un ejercicio ilustrativo por tipología.

Con el plazo de obra ya confirmado (12 meses, sección 2) y el costo de entrada ya verificado (sección 5), **falta un solo insumo real** antes de poder construir esos escenarios con números completos: el cronograma de cobro dentro de esos 12 meses (qué % se vende en preventa/durante obra/al final) y cuánto capital de los 2-3 socios está disponible para adelantar sin depender de esas ventas — sigue siendo el ítem 16 de `01-informacion-critica-faltante.md`.

---

## 7. Qué queda pendiente después de este documento

1. **Confirmación del founder sobre Interpretación A vs. B del costo/m²** (sección 5.4) — determina si el costo de entrada vigente (USD 1.929/m² para el Ángulo 3) baja a USD 1.751/m².
2. **Régimen tributario correcto para una SA** (sección 3) — el Impuesto a las ganancias/ITI de la planilla de referencia estaba pensado para un fideicomiso; falta confirmar si aplica igual a una SA o corresponde otro impuesto societario.
3. **Cronograma de cobro dentro de los 12 meses de obra** y capital disponible por adelantado de los 2-3 socios (ítem 16, sigue siendo el insumo que falta para poder correr los escenarios de venta/retención del flujo de fondos con números reales).
4. Renta mensual real de mercado en Barrio Herrera (ítem 13, sigue pendiente) — para saber cuánto por encima de los pisos de la sección 4.3 se puede fijar el alquiler real.
