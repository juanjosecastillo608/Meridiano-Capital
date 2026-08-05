# P07 — POLÍTICA DE RENTABILIDAD OBJETIVO

**Meridiano Capital · operada por Campo Agreste S.A.**
**Documento estratégico — Brand OS 2.0**
**Estado:** BORRADOR 4 · política completa con 3 etapas de ingreso · un dato por confirmar
**Fecha:** 24 de julio de 2026
*Supersede al borrador 3.*

---

## 0. QUÉ RESUELVE

Cierra el Conflicto 01. Toda rentabilidad se calcula y se presenta igual. Insumo directo de la skill `meridiano-rentabilidad` y del Agente de Análisis.

---

## 1. REGLA DE PRESENTACIÓN — no negociable

Toda rentabilidad se muestra en **dos cifras, bruta y neta**, etiquetadas, juntas. En etapas de capital, además **plusvalía total + TIR anualizada**, juntas. Un número solo nunca sale.

---

## 2. RENTA — PISO NETO POR CLASE `CERRADO`

Medidos en **Neto Completo (Nivel 3)** para tradicional y **Neto Temporal (Nivel 4)** para estadía corta.

| Renta tradicional | Piso |  | Renta temporal | Piso |
|---|---|---|---|---|
| Comercial (local, tinglado, nave) | 8,0 % |  | Departamento | 14,0 % |
| Residencial — casas | 6,0 % |  | Casa | 12,0 % |
| Departamento sin muebles | 6,0 % |  | | |
| Departamento amoblado | 7,5 % |  | | |

10% neto = promedio-objetivo de cartera, no piso. El 14% temporal define el reparto Meridiano / Urbannit.

---

## 3. NETO — CUATRO NIVELES `CERRADO`

| Nivel | Quién | Descuenta (acumulativo) |
|---|---|---|
| 1 · Básico | Propietario autogestiona | Impuesto Inmobiliario · IVA · Impuesto a la Renta · Expensas |
| 2 · Administrado | Meridiano administra | + Honorarios administración · Honorarios alquiler |
| 3 · Completo | Según perfil y tipo | + Seguros (básico→incumplimiento) · Mantenimiento · Amortización · Vacancia |
| 4 · Temporal | Estadía corta | Bruta − impuestos · limpieza · seguros obligatorios · mantenimiento · canon agencia |

Al inversor se le muestra el neto del nivel que compra.

---

## 4. ETAPAS DE CAPITAL `CERRADO con un dato por confirmar`

### 4.1 Las tres etapas de la escalera general

| Etapa | Piso | Métrica |
|---|---|---|
| Terreno | 30% anualizado | plusvalía anualizada + MOIC |
| Aporte de construcción | 22% preferencial anual | TIR por proyecto · o % fijo · o participación |
| Pozo / reventa | según momento de ingreso → 4.3 | descuento · plusvalía · TIR |

**Aporte de construcción — estructura por aportante:**

| Aportante | Estructura |
|---|---|
| Proveedor | Negociable, ligada a provisión + retorno |
| Constructora que ingresa | Participación en utilidad |
| Casa de bolsa | Retorno preferencial / instrumento estructurado |

*Gobernanza:* si la constructora aportante es socia de Campo Agreste (el 10% reservado), aplica criterio de partes vinculadas.

---

### 4.2 EL EJE DEL NEGOCIO DE POZO — el momento de ingreso lo es todo

La plusvalía de un departamento comprado antes de terminarse **no es un número fijo: es una función del momento en que el inversor entra.** Hay tres momentos bien marcados, y entenderlos es la diferencia entre asesorar y adivinar.

```
   PRE-POZO           LANZAMIENTO          POZO DURANTE OBRA         ENTREGA
   │                  │                    │                        │
  −6/−8 meses        mes 0              obra en marcha            obra lista
  obra NO empezó    obra arranca         (mes 6 al 18/36)         precio de lista
  ───────────────────────────────────────────────────────────────────────────►
  MÁX. descuento    descuento alto      descuento medio           sin descuento
  MÁX. riesgo       riesgo alto         riesgo medio              riesgo cero
  MÁX. plazo        plazo alto          plazo medio               —
```

**Por qué el descuento existe y por qué se achica con el tiempo.** El desarrollador vende barato al principio porque *necesita* al inversor temprano: necesita capital para arrancar, necesita preventas para conseguir el crédito bancario, y le traslada al comprador el riesgo de que la obra se complete. A medida que la obra avanza, esas tres presiones se alivian —hay capital, hay financiación, el edificio se ve crecer— y el precio sube hacia el valor del producto terminado.

**Las tres variables se mueven juntas.** Cuanto más temprano entra el inversor:
- más descuento captura (más plusvalía potencial),
- más riesgo carga (la obra puede no completarse, retrasarse, cambiar),
- más tiempo tiene el capital comprometido.

Entrar más tarde es la imagen espejo: menos plusvalía, menos riesgo, menos plazo. **No hay una etapa "mejor" en abstracto — hay una etapa correcta para cada perfil de inversor**, y ese es justamente el trabajo del asesor: hacer coincidir el momento de entrada con el apetito de riesgo y la situación de capital del cliente.

---

### 4.3 Matriz de plusvalía por reventa — tres etapas

**Edificios tradicionales (hasta 8 pisos · obra 24 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| **Pre-pozo** (−6/−8 meses) | 25 % | 35 % o más + renta |
| **Lanzamiento** (inicio de obra) | ~22 % `[PROPUESTA]` | ~32 % `[PROPUESTA]` |
| **Pozo durante obra** | 20 % | 30 % + renta |

**Torres (hasta 18 pisos · obra 36–48 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| **Pre-pozo** (−6/−8 meses) | 40 % | ⬜ *por definir* |
| **Lanzamiento** (inicio de obra) | ~32 % `[PROPUESTA]` | ~40 % `[PROPUESTA]` |
| **Pozo durante obra** | 25 % | 35 % + renta |

Las filas **Pre-pozo** y **Pozo durante obra** son tus números confirmados. La fila **Lanzamiento** la interpolé entre las otras dos como punto de partida `[PROPUESTA]` — sitúa el descuento y la plusvalía en el punto intermedio, coherente con que el riesgo y el plazo también son intermedios. **Confirmá o ajustá esos cuatro valores** y la matriz queda cerrada.

---

### 4.4 EL HALLAZGO — más plusvalía no siempre es mejor negocio

Las cifras de la matriz son **plusvalía total, no anual.** Como cada etapa tiene un horizonte distinto, hay que anualizar para comparar de verdad. Ilustrativo, edificio tradicional, venta al terminar, sobre precio total:

| Entrada | Plusvalía | Horizonte aprox. | **Rinde por año** |
|---|---|---|---|
| Pre-pozo | 25 % | ~2,6 años | **≈ 8,9 %** |
| Lanzamiento | ~22 % | ~2,0 años | **≈ 10,5 %** |
| Pozo durante obra | 20 % | ~1,0 año | **≈ 20 %** |

Leído por año, **la entrada más tardía puede ser la de mayor retorno anual** — porque el capital estuvo comprometido mucho menos tiempo. El inversor que solo mira "25% vs 20%" elige la etapa equivocada.

**Pero hay un contrapeso decisivo, y es tu mejor argumento de venta:** en pozo no pagás todo al inicio, pagás en cuotas durante la obra. El inversor de pre-pozo desembolsa poco capital al principio y captura la apreciación completa — así que **medido sobre el capital efectivamente desembolsado, su TIR real sube muy por encima** del cálculo simple sobre precio total, y la ventaja se inclina de nuevo hacia la entrada temprana. Cuál etapa gana depende de dos cosas que la skill tiene que modelar: el **cronograma de pago en cuotas** y la **fecha exacta de entrada**.

La conclusión práctica: no existe "la mejor etapa". Existe la mejor etapa **para este inversor, con este capital, con este apetito de riesgo**. Presentar las tres con su plusvalía total y su TIR real es lo que te permite ubicar a cada cliente donde le conviene — y eso es exactamente lo que genera el referido.

---

## 5. LA ESCALERA COMPLETA

```
Terreno              30 % anualizado         ← entra primero, máximo riesgo
Aporte construcción  22 % preferencial       ← riesgo de obra, sin ingreso
  Pozo pre-obra      ↑ más plusvalía / +plazo / +riesgo
  Pozo lanzamiento   ┊ intermedio
  Pozo durante obra  ↓ menos plusvalía / −plazo / −riesgo → mayor TIR anual
Renta temporal       12–14 % neto            ← alto esfuerzo operativo
Renta tradicional    6–8 % neto              ← ingreso estable, bajo riesgo
```

---

## 6. QUÉ HABILITA

1. Skill `meridiano-rentabilidad` — pisos, 4 niveles de neto, matriz de 3 etapas, calculadora de TIR sobre capital desembolsado
2. Agente de Análisis
3. Criterio de aprobación de P08 (Canarias)
4. Decisión renta/venta de las 18 unidades en pozo
5. Presentación estándar al inversor: bruto+neto en renta, plusvalía+TIR en capital

---

## 7. ESTADO

**Cerrado:**
- ✅ Renta: pisos por clase en Neto Completo/Temporal
- ✅ Neto en 4 niveles
- ✅ Terreno 30% · Aporte 22% · descuento pozo 25% pre-pozo
- ✅ **Tres etapas de ingreso definidas con su lógica riesgo-descuento-plazo**
- ✅ Matriz de reventa a 3 filas (Pre-pozo y Pozo confirmados)
- ✅ Escalera completa · método de anualización TIR

**Por confirmar (no bloquea la skill):**
- 🟡 Fila **Lanzamiento** de ambas matrices — 4 valores propuestos a confirmar
- 🟡 Torre pre-pozo, plusvalía +1 año — una celda
- 🟡 Cronograma de cuotas y fecha de entrada como variables de la skill

La política está lista para convertirse en skill. Los tres puntos abiertos se afinan durante la construcción.
