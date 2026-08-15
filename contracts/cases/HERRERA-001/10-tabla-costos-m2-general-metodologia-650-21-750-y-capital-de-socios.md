Estado: CURRENT — tabla general de costos m² (cross-cutting), metodología definitiva de costeo (21% de $650 + $750 neto), desagregación del $850.000, capital de socios (70/30), y escenario de retención total
Fuente original: instrucciones del founder, 2026-08-15 (segundo mensaje del día), + planilla adjunta "Tabla de Costos M2 construcción según Tipo de Construcción y calidad.xlsx"
Dominio: INVESTMENT (caso HERRERA-001) — la tabla de costos (sección 1) se registra además como referencia cross-cutting, ver `knowledge-base/investment/`
Incorporado: 2026-08-15

# Tabla de costos m² general, metodología 21%/$650/$750, desagregación del $850.000 y capital de socios

## 0. Resumen de lo que resuelve este documento

1. Una **tabla general de costo de construcción por m², por tipo de edificación y calidad** — el founder pidió guardarla "para todas las bases de análisis de Meridiano", no solo Herrera.
2. **Explica de dónde salen los tres números $650/$720/$750** que se venían usando desde el inicio del caso: son tres **niveles de calidad de la misma tabla**, no tres conceptos distintos como se había asumido.
3. Una **metodología definitiva y precisa** (21% de incidencia estructural, sobre base $650, neteado del $750 para la porción ya construida) que resuelve la ambigüedad Interpretación A/B que había quedado abierta en `04-comprar-vs-construir.md` y `09-...md` §5.4 — **esto reemplaza el uso de $720/m² uniforme en los cálculos de `03-...md` a `09-...md`.**
4. Un **criterio de validación** (±10%) sobre si los USD 490.000 no-terreno del trato son razonables frente al costo de reproducir esa estructura por separado.
5. **Capital de los socios: 70% disponible por adelantado, 30% a evaluar con venta de unidades** — resuelve buena parte del ítem 16/21 de `01-informacion-critica-faltante.md`.
6. Un **tercer escenario** para el flujo de fondos: no vender nada hasta terminar el edificio, rentar todo, y vender después de 1-2 años esperando plusvalía.

---

## 1. Tabla general de costos de construcción por m² — categoría A, cross-cutting

El founder aportó `Tabla de Costos M2 construcción según Tipo de Construcción y calidad.xlsx` — valores de m² de construcción **terminado** (materiales + mano de obra), por tipo de edificación y nivel de calidad:

| Tipo de construcción | Calidad | USD/m² |
|---|---|---|
| Tinglados / Depósitos | Básica | 350 |
| Tinglados / Depósitos con oficinas | Estándar | 400 |
| Depósitos con oficinas y locales comerciales | Estándar | 450 |
| **Edificios departamentos en altura** | **Básica** | **650** |
| **Edificios departamentos en altura** | **Estándar** | **720** |
| **Edificios departamentos en altura** | **Estándar + Vidrio DVH** | **750** |
| Casas / Dúplex | Básica | 550 |
| Casas / Dúplex | Estándar | 650 |
| Casas / Dúplex | Estándar + Vidrio DVH | 850 |
| Remodelación sobre obra ya existente (casas/dúplex/deptos) | Básica | 350 |
| Remodelación sobre obra ya existente (casas/dúplex/deptos) | Estándar | 450 |

**Regla metodológica propia de la tabla, aplicable a Herrera**: *"Para los cálculos de obras sin terminar utilizo, para cada categoría, el valor del m² básico."* Herrera es exactamente esto — una obra sin terminar — por eso el founder usa **$650 (Edificios en altura, Básica)** como base de referencia para la porción ya construida.

**Corrección de lo que se había asumido hasta `09-...md`**: no son "$650 = solo estructura, $720 = terminación, $750 = calidad target" como tres conceptos en capas — son **tres niveles de calidad de construcción completa** (Básica / Estándar / Estándar+DVH) de la misma categoría "Edificios departamentos en altura". La lectura correcta, según la metodología que da el founder en la sección 2, es: $650 se usa como **base de referencia** (por ser obra sin terminar, regla de la tabla) para calcular qué parte de esa base es estructura; $750 (la calidad target para la venta) es la que efectivamente se usa para calcular el costo real de construir/terminar el edificio.

**Guardar esta tabla para todas las bases de análisis de Meridiano** — se copia a `contracts/cases/HERRERA-001/source-documents/` y se referencia como fuente de costos de construcción del sistema en general, no solo de este caso.

---

## 2. Metodología definitiva de costeo — 21% de incidencia estructural

### 2.1 La regla, en las palabras del founder

*"Para los pisos de Subsuelo hasta el 4º piso tengo la estructura, por lo cual el costo lo considero tomando como base $650 el m² de construcción. Lo construido se considera, según el análisis del ingeniero, el 21% sobre el costo total del m². Que en este caso calculo el 21% sobre los $650 m². (...) Del piso 5/6 y 7 no tengo construcción existente, por lo cual considero el costo total de construcción que es $750. Para el cálculo de costos de PB hasta el piso 4 considero $750 menos el 21%, que es el porcentaje de incidencia de la estructura existente sobre el costo total. (...) Para establecer el costo de la estructura uso como base de cálculo los $650. Pero para la construcción del edificio y su cálculo para los inversores, ya sí uso el costo de $750."*

### 2.2 Traducido a la metodología de cálculo

1. **Valor de la estructura ya construida** (para comparar contra el costo de reproducirla — sección 3): 21% × USD 650/m² = **USD 136,50/m²**. Aplicado sobre los 2.286,93 m² ya construidos (Subsuelo–Piso 4, cifra ya confirmada en `03-presupuesto-y-comparables.md`) = **USD 312.166** — refina, con precisión, la cifra de USD 320.170,20 que se venía usando desde `03-...md` (que usaba un valor plano de USD 140/m², no el 21% exacto sobre $650 — 140/650=21,5%, prácticamente el mismo número, ahora con base metodológica explícita).
2. **Costo de terminar lo ya construido, para el cálculo real de inversión**: se parte del costo target de venta ($750/m², calidad Estándar+DVH) y se le resta el mismo 21% de incidencia estructural (ya pagado, ya está de pie): **USD 750 × (1 − 21%) = USD 592,50/m²**, aplicado sobre los 2.286,93 m² ya construidos.
3. **Costo de la obra 100% nueva** (Piso 5/6, y Piso 7 en el Ángulo 2 — no hay nada construido ahí): tasa completa, **USD 750/m²**.

**Esto resuelve la Interpretación A vs. B que había quedado abierta en `04-comprar-vs-construir.md` y `09-...md` §5.4** — la respuesta del founder es, en esencia, la Interpretación B (netear el componente estructural en la porción ya construida), pero con una base metodológica más precisa (21% exacto del ingeniero, aplicado sobre $750 en vez de sobre $720) que la que se había estado usando. **Esta metodología reemplaza el uso de USD 720/m² uniforme sobre toda la superficie, que se venía aplicando desde `03-...md` hasta `09-...md`.**

### 2.3 Costo de construcción recalculado — Ángulo 1/3 (6 pisos, 3.113,03 m² totales)

| Componente | Cálculo | Monto |
|---|---|---|
| Terminación sobre estructura existente (2.286,93 m²) | USD 592,50/m² × 2.286,93 | USD 1.355.006,02 |
| Obra 100% nueva (826,10 m²) | USD 750/m² × 826,10 | USD 619.575,00 |
| **Costo de construcción TOTAL** | | **USD 1.974.581,03** |

Comparado con el cálculo anterior (USD 720/m² uniforme sobre toda la superficie = USD 2.241.381,60), **la construcción baja USD 266.800,57** — porque ahora se reconoce correctamente que la porción ya construida cuesta menos terminar (no hay que rehacer la estructura) de lo que costaría construirla de cero.

### 2.4 Inversión Total recalculada — Ángulo 1/3

| Componente | Monto (metodología nueva) | Monto (metodología anterior, `04-...md`/`06-...md`) |
|---|---|---|
| Adquisición del edificio | USD 850.000,00 | USD 850.000,00 |
| Construcción | USD 1.974.581,03 | USD 2.241.381,60 |
| Proyecto (USD 90/m² × 3.113,03 m²) | USD 280.172,70 | USD 280.172,70 |
| Aprobaciones e imprevistos | USD 101.173,48 | USD 101.173,48 |
| **Inversión Total** | **USD 3.205.927,21** | USD 3.472.727,78 |
| **Costo por m² comercializable (Ángulo 3, 1.800 m²)** | **USD 1.781,07** | USD 1.929,29 |

**El costo de entrada baja USD 266.800,57 en total, USD 148,22 menos por m² comercializable.** Esto mejora directamente todos los márgenes calculados en `06-margen-neto-comision-y-precios-por-piso.md` y `08-comision-financiamiento-piso-renta-y-matriz-decision.md` (que usaban USD 1.929,29/m² como costo de entrada) — **⚠️ esos archivos quedan con números superados en este punto específico, sin recalcular todavía número por número** — el próximo paso es correr de nuevo la matriz de márgenes y el piso de renta con este costo de entrada actualizado (ver sección 5).

### 2.5 Inversión Total recalculada — Ángulo 2 (7 pisos, 3.413,03 m² totales, +300 m² del piso adicional)

| Componente | Monto |
|---|---|
| Terminación sobre estructura existente (2.286,93 m², igual que Ángulo 1/3) | USD 1.355.006,02 |
| Obra 100% nueva (1.126,10 m² — los 826,10 m² de siempre + los 300 m² del piso adicional) | USD 750/m² × 1.126,10 = USD 844.575,00 |
| **Costo de construcción TOTAL** | **USD 2.199.581,03** |
| Proyecto (USD 90/m² × 3.413,03 m²) | USD 307.172,70 |
| Aprobaciones e imprevistos | USD 101.173,48 |
| Adquisición | USD 850.000,00 |
| **Inversión Total** | **USD 3.457.927,21** |
| **Costo por m² comercializable (2.100 m²)** | **USD 1.646,63** |

---

## 3. Verificación de los USD 490.000 — criterio ±10%

*"Esa diferencia de USD 490.000 no debe ser superior a la compra por separado del terreno más la construcción de los m² de estructura existente. Ese porcentaje superior debemos establecer como criterio +/- 10%."*

**Se marca explícitamente una ambigüedad de lectura, no se asume una sola interpretación**: la frase admite más de una combinación de términos según qué tasa se use para "la construcción de los m² de estructura existente" (el valor del esqueleto, USD 136,50/m², o el costo completo de levantar esa estructura de cero, USD 650/m²) y qué cifra de terreno usar (los USD 360.000 que el propio trato le asigna al terreno, o el rango de mercado de referencia USD 280.000–398.650 de `03-...md`/`02-...md`). Se corren las combinaciones razonables:

| Base de comparación | Terreno usado | Total de referencia | Banda ±10% | ¿USD 490.000 dentro? |
|---|---|---|---|---|
| Esqueleto (USD 136,50/m² × 2.286,93) = USD 312.166 | USD 360.000 (del trato) | USD 672.166 | USD 604.949 – 739.383 | **No — 490.000 está por debajo** |
| Esqueleto (USD 312.166) | USD 280.000 (ref. baja) | USD 592.166 | USD 532.949 – 651.383 | **No — por debajo** |
| Esqueleto (USD 312.166) | USD 398.650 (ref. alta) | USD 710.816 | USD 639.734 – 781.898 | **No — por debajo** |
| Estructura completa (USD 650/m² × 2.286,93) = USD 1.486.505 | cualquiera de los tres | USD 1,77M – 1,89M | muy por encima de USD 490.000 | **No — por debajo, por mucho** |

**En las cuatro combinaciones razonables, USD 490.000 queda por debajo de la banda de ±10%, no por encima** — el trato pasa el criterio del founder con margen amplio: pagar USD 490.000 por la estructura + documentación + aprobaciones + riesgo/tiempo evitado sale más barato que reproducir esa misma estructura por separado, incluso en el escenario más conservador (esqueleto solo + terreno de referencia alto). **Esto refuerza, con una metodología más precisa, el mismo hallazgo de `04-comprar-vs-construir.md`** (valor de riesgo evitado + tiempo ganado). Dicho esto, **se le devuelve la pregunta al founder** sobre cuál de las combinaciones de arriba refleja mejor lo que quiso decir con "compra por separado del terreno más la construcción de los m² de estructura existente" — el resultado cualitativo (el trato es favorable) no cambia entre combinaciones, pero el número exacto de holgura sí.

---

## 4. Capital de los socios — 70% por adelantado, 30% a evaluar con venta

*"El capital de los socios disponibles por adelantado es del 70% del valor total del proyecto. El otro 30% vamos a evaluar obtener con la venta de los departamentos."*

Esto resuelve buena parte del ítem 16/21 de `01-informacion-critica-faltante.md` — categoría **A (confirmado)**:

- **70% de la Inversión Total** está disponible como capital propio de los 2-3 socios, sin depender de ventas.
- **30% restante** se busca cubrir con venta de unidades durante o después de la obra — esto ya no es una suposición mía (como se había dejado en `08-...md` §4.4), es un dato confirmado del founder.

**Aplicado a la Inversión Total recalculada de la sección 2**:

| Ángulo | Inversión Total | 70% capital propio | 30% a cubrir con ventas |
|---|---|---|---|
| Ángulo 1/3 | USD 3.205.927,21 | USD 2.244.149,05 | **USD 961.778,16** |
| Ángulo 2 | USD 3.457.927,21 | USD 2.420.549,05 | **USD 1.037.378,16** |

**Esto ya permite calcular, de forma directa, cuántas unidades hay que vender como mínimo** en cada ángulo — la venta mínima necesaria es la que cubra esos ~USD 962.000–1.037.000, no una elección libre. El resto (todo lo que se venda o retenga por encima de ese mínimo) queda gobernado por la lógica de la matriz de decisión de `08-...md` §4 (retener supera a vender en rentabilidad pura). Falta todavía el **ritmo** de esa venta mínima dentro de los 12 meses de obra (sigue siendo el ítem 16/21 sin cerrar del todo) — pero el **monto** total ya está confirmado.

---

## 5. Escenario nuevo — retención total hasta terminar la obra, vender después de 1-2 años esperando plusvalía

*"También se va a considerar un escenario de no vender hasta luego de terminado el edificio, y así maximizar las ganancias — rentando los departamentos y esperando plusvalía luego de 1/2 años para vender."*

Se agrega un **tercer escenario** a la familia de escenarios del flujo de fondos (ya venían dos, de `08-...md` §4.4 y §6): 

1. **Venta mínima necesaria (30% del valor del proyecto) durante la obra + retención del resto** — el escenario ya venía siendo el implícito hasta ahora.
2. **Venta agresiva** (mucho más del 30%, para maximizar liquidez inmediata) — bookend opuesto, ya estaba latente en la matriz de `08-...md`.
3. **Retención total hasta terminar la obra — nuevo**: no vender NADA durante los 12 meses de construcción (los 2-3 socios cubren el 100% con capital propio en este escenario específico, sin depender del 30% de ventas), alquilar el 100% de las unidades una vez entregado el edificio, y recién vender después de 1-2 años, apostando a que la plusvalía post-entrega (edificio terminado, con historial de alquiler, en una zona en desarrollo) suba el precio de venta por encima del rango actual (USD 1.900–2.100/m²) usado en todos los cálculos de este caso.

**Esto es coherente con, y profundiza, el hallazgo de `08-...md` §4.3** (retener supera a vender en rentabilidad pura, dado el margen de venta delgado de Herrera) — el escenario 3 lo lleva al extremo: en vez de vender lo mínimo necesario, no vender nada y capturar además la plusvalía de "edificio terminado y con historial" en vez de "unidad en pozo". **No se cuantifica todavía** — falta un supuesto de plusvalía post-entrega (% esperado a 1-2 años), que no está confirmado y no debe inventarse; queda como el insumo pendiente para correr este escenario específico en el flujo de fondos.

---

## 6. Qué falta para cerrar el flujo de fondos completo

1. **Recalcular con la metodología nueva (sección 2)** los márgenes de `06-margen-neto-comision-y-precios-por-piso.md`, el piso de alquiler de `08-...md`/`09-...md` (usaban USD 1.929,29/m² como costo de entrada, ahora USD 1.781,07/m²) y la matriz de decisión de `08-...md` §4 — el próximo paso técnico antes de construir el flujo de fondos final.
2. **Confirmar qué combinación de términos** aplica al criterio de verificación de los USD 490.000 (sección 3) — no cambia la conclusión cualitativa, pero si el founder quiere un número de holgura específico, falta precisar la base.
3. **Ritmo de venta del 30%** dentro de los 12 meses de obra (cuánto se vende en qué mes/etapa) — el monto total ya está confirmado (sección 4), falta el cronograma.
4. **Supuesto de plusvalía post-entrega** (% a 1-2 años) para poder cuantificar el escenario 3 de la sección 5 — no se asume ningún número sin que el founder lo confirme o se releve de mercado.
5. Renta mensual real de mercado en Barrio Herrera (ítem 13, sigue pendiente).
