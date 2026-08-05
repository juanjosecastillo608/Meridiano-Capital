# P07 — POLÍTICA DE RENTABILIDAD OBJETIVO

**Meridiano Capital · operada por Campo Agreste S.A.**
**Documento estratégico — Brand OS 2.0 candidate**
**Estado:** BORRADOR 1 · umbrales de renta definidos · dos decisiones abiertas
**Fecha:** 24 de julio de 2026

---

## 0. QUÉ RESUELVE ESTE DOCUMENTO

Cierra el Conflicto 01: los cinco umbrales de rentabilidad que circulaban sueltos (10% / 12% / 14% / 15% / 8,08%) sin una política que los ordenara. A partir de acá, todo modelo de inversión y toda promesa a un inversor se calcula igual, con el mismo criterio y la misma base.

Es también el insumo que habilita la skill `meridiano-rentabilidad` y, con ella, el Agente de Análisis.

---

## 1. REGLA DE PRESENTACIÓN — no negociable

**Toda rentabilidad se presenta siempre en dos cifras: bruta y neta.** Nunca una sola. El inversor ve el rendimiento antes y después de gastos, en la misma pantalla, en el mismo documento.

Esto no es cosmético: es lo que elimina el malentendido de raíz. La confusión que originó el Conflicto 01 fue mezclar cifras brutas y netas sin declararlo. La regla lo vuelve imposible.

**Consecuencia operativa:** todo modelo, ficha, presentación y caption que mencione un número de rentabilidad debe mostrar ambas cifras y etiquetar cuál es cuál. Un número solo, sin su par, no sale.

---

## 2. UMBRALES DE RENTA — PISO NETO POR CLASE DE ACTIVO `DEFINIDO`

Estos son los pisos. Por debajo de estos números, una operación de renta **no se recomienda al inversor**. Son el mínimo aceptable, no el objetivo — el objetivo es superarlos.

### 2.1 Renta tradicional (largo plazo)

| Clase de activo | Piso neto anual |
|---|---|
| Comercial — local, tinglado, nave industrial | **8,0 %** |
| Residencial — casas | **6,0 %** |
| Departamento sin muebles | **6,0 %** |
| Departamento amoblado | **7,5 %** |

### 2.2 Renta temporal (estadía corta)

| Clase de activo | Piso neto anual |
|---|---|
| Departamento | **14,0 %** |
| Casa | **12,0 %** |

### 2.3 La lógica detrás de los números

La estructura tiene una coherencia que conviene explicitar, porque es la que un agente de IA necesita entender para aplicarla bien:

- **Lo comercial rinde más piso que lo residencial** (8% vs 6%) porque el inquilino comercial es más volátil y el activo menos líquido — el piso más alto compensa ese riesgo.
- **Amoblar sube el piso 1,5 puntos** (6% → 7,5%) porque el mobiliario es capital inmovilizado adicional que tiene que rendir.
- **Lo temporal casi duplica el piso de lo tradicional** (14% vs 6% en departamentos) porque la operación de estadía corta tiene costos operativos y vacancia muy superiores: limpieza, canales, reputación, temporadas bajas. Ese 14% no es "ganar más", es *tener que* ganar más para que valga la pena el esfuerzo y el riesgo.

Este último punto **valida la tesis de Urbannit**: los monoambientes sin cochera de ARL y Quintero, destinados a estadía corta, tienen que despejar 14% neto. Es una vara exigente pero alcanzable en las ubicaciones premium donde están (Recoleta, Villa Morra, Los Laureles), con el ~97% de ocupación de mercado. Si un activo no llega a ese 14%, la señal es clara: va a renta tradicional bajo Meridiano, no a temporal bajo Urbannit.

### 2.4 Reconciliación del "10% neto"

Tu perfil declara un promedio de 10% neto anual en alquiler. Ahora se entiende cómo encaja: **el 10% no es un piso, es el promedio-objetivo de la cartera.** Los pisos van de 6% a 14% según la clase; el 10% es lo que apuntás a entregar en promedio ponderado. No hay contradicción — hay un piso (mínimo aceptable por clase) y un objetivo (promedio de cartera). El documento los distingue y ambos conviven.

---

## 3. DEFINICIÓN DE "NETO" `DECISIÓN ABIERTA — CRÍTICA`

Este es el punto más importante que falta, y bloquea todo lo demás.

Todos los pisos de la Sección 2 son "netos". Pero **neto no significa nada hasta que definamos qué se descuenta.** Si dos modelos restan cosas distintas, los pisos dejan de ser comparables y la política se vuelve papel.

Propongo esta definición para que la valides o corrijas. **Rentabilidad neta = ingreso por renta anual, menos:**

| Concepto a descontar | ¿Se descuenta? |
|---|---|
| Expensas / gastos comunes | a confirmar |
| Impuesto inmobiliario | a confirmar |
| Honorarios de administración (Campo Agreste) | a confirmar |
| Vacancia estimada | a confirmar |
| Mantenimiento y reparaciones | a confirmar |
| Seguro | a confirmar |
| IVA sobre la renta | a confirmar |
| Amortización del mobiliario (en amoblados/temporal) | a confirmar |

**Necesito que me marques cuáles entran.** Esa lista es la que hace que "6% neto" signifique lo mismo en enero que en julio, en un modelo tuyo y en uno de un agente de IA. Es la decisión de mayor palanca del documento.

---

## 4. UMBRALES POR ETAPA DE INGRESO `PROPUESTA — a definir juntos`

Confirmaste que pozo y construcción rinden distinto que la renta. Correcto — y la razón es que **no todas las etapas se miden con la misma vara.**

La renta se mide como rendimiento anual (%). Pero el terreno, el aporte de construcción y la reventa no producen renta: producen una ganancia de capital al final de un período. Comparar "un terreno que rinde X" con "un departamento que rinde 6%" es comparar cosas distintas — una es plusvalía sobre un horizonte, la otra es ingreso anual.

Por eso propongo medir cada etapa con la métrica que le corresponde:

| Etapa de ingreso | Qué mide | Métrica correcta | Piso propuesto |
|---|---|---|---|
| **Compra de terreno** | Plusvalía al desarrollar/vender | TIR anualizada sobre el horizonte | a definir |
| **Aporte de capital para construcción** | Retorno del capital durante la obra | TIR sobre el período de construcción | a definir |
| **Preventa / pozo** | Descuento vs. precio terminado + plusvalía a la entrega | % de plusvalía a la entrega | a definir |
| **Renta** | Ingreso anual | % neto anual | **Sección 2** ✅ |
| **Reventa / plusvalía** | Ganancia de capital vs. mercado | % de plusvalía | a definir |

**Lo que necesito de vos para cerrar esta sección:** los pisos de las cuatro etapas que faltan. Para orientar la conversación —no para imponerte números—, la lógica del mercado dice que cuanto más temprano entra el inversor y más riesgo toma, más alto debe ser el retorno: un aporte de construcción debería rendir bastante más que una renta terminada, porque el inversor carga el riesgo de obra y la inmovilización sin ingreso. ¿Manejás un piso de TIR para el aporte de construcción? ¿Un descuento mínimo esperado en pozo?

---

## 5. QUÉ HABILITA ESTE DOCUMENTO

Una vez cerradas las decisiones 3 y 4:

1. **Skill `meridiano-rentabilidad`** — codifica estos umbrales para que todo modelo los use automáticamente.
2. **Agente de Análisis** — corre cualquier oportunidad contra la política y dice si pasa o no el piso.
3. **Criterio de aprobación de P08 (Canarias)** — sin este umbral no hay forma de aprobar un presupuesto de remodelación; con él, la pregunta "¿esta obra vale la pena?" tiene respuesta objetiva.
4. **Decisión renta/venta de las 18 unidades en pozo** — cada unidad que entrega se evalúa contra el piso de su clase.
5. **Formato estándar de presentación al inversor** — el mismo número, calculado igual, siempre.

---

## 6. DECISIONES PENDIENTES — resumen

| # | Decisión | Prioridad |
|---|---|---|
| 1 | Definición operativa de "neto" (Sección 3) | 🔴 Crítica — bloquea todo |
| 2 | Pisos de las 4 etapas de ingreso (Sección 4) | 🟡 Alta |
| 3 | Relación bruto↔neto o método de cálculo del bruto | 🟡 Media |

---

## 7. LO QUE YA QUEDÓ FIRME

- ✅ Regla de doble cifra (bruto + neto) siempre
- ✅ Seis pisos netos por clase de activo en renta
- ✅ La lógica de riesgo que ordena los pisos
- ✅ Reconciliación del 10% como promedio-objetivo, no piso
- ✅ Validación de la tesis de Urbannit (14% temporal)
- ✅ Estructura de medición por etapa (cada una con su métrica)

Estás a dos decisiones de tener la política completa y de poder construir la skill que la codifica.
