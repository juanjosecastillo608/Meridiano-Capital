# P07 — POLÍTICA DE RENTABILIDAD OBJETIVO

**Meridiano Capital · operada por Campo Agreste S.A.**
**Documento estratégico — Brand OS 2.0**
**Estado:** BORRADOR 5 · política completa · lista para skill
**Fecha:** 24 de julio de 2026
*Supersede al borrador 4.*

---

## 0. QUÉ RESUELVE

Cierra el Conflicto 01. Insumo directo de la skill `meridiano-rentabilidad` y del Agente de Análisis.

---

## 1. REGLA DE PRESENTACIÓN — no negociable

Toda rentabilidad se muestra en **cifras pareadas, nunca sueltas:**

- **Renta:** bruta + neta, juntas.
- **Capital (pozo, terreno, reventa):** plusvalía total + **dos TIR anualizadas** — sobre precio total y sobre capital desembolsado — juntas.

Un número solo, sin su par, no sale nunca. Es la regla que protege al inversor y te distingue del que vende humo.

---

## 2. RENTA — PISO NETO POR CLASE `CERRADO`

Medidos en **Neto Completo (Nivel 3)** para tradicional y **Neto Temporal (Nivel 4)** para estadía corta.

| Renta tradicional | Piso |  | Renta temporal | Piso |
|---|---|---|---|---|
| Comercial (local, tinglado, nave) | 8,0 % |  | Departamento | 14,0 % |
| Residencial — casas | 6,0 % |  | Casa | 12,0 % |
| Departamento sin muebles | 6,0 % |  | | |
| Departamento amoblado | 7,5 % |  | | |

10% neto = promedio-objetivo de cartera. El 14% temporal define el reparto Meridiano / Urbannit.

---

## 3. NETO — CUATRO NIVELES `CERRADO`

| Nivel | Quién | Descuenta (acumulativo) |
|---|---|---|
| 1 · Básico | Propietario autogestiona | Impuesto Inmobiliario · IVA · Impuesto a la Renta · Expensas |
| 2 · Administrado | Meridiano administra | + Honorarios administración · Honorarios alquiler |
| 3 · Completo | Según perfil y tipo | + Seguros (básico→incumplimiento) · Mantenimiento · Amortización · Vacancia |
| 4 · Temporal | Estadía corta | Bruta − impuestos · limpieza · seguros obligatorios · mantenimiento · canon agencia |

---

## 4. ETAPAS DE CAPITAL `CERRADO`

### 4.1 Escalera general

| Etapa | Piso | Métrica |
|---|---|---|
| Terreno | 30% anualizado | plusvalía anualizada + MOIC |
| Aporte de construcción | 22% preferencial anual | TIR por proyecto · % fijo · o participación |
| Pozo / reventa | según ingreso y plazo → 4.3 | plusvalía + doble TIR |

**Aporte por tipo de aportante:** proveedor (negociable) · constructora que ingresa (participación en utilidad) · casa de bolsa (retorno preferencial). *Si la constructora es socia de Campo Agreste → criterio de partes vinculadas.*

### 4.2 Las tres etapas de ingreso al pozo

```
   PRE-POZO           LANZAMIENTO          POZO DURANTE OBRA         ENTREGA
  −6/−8 meses        inicio de obra        obra en marcha          obra lista
  ──────────────────────────────────────────────────────────────────────────►
  MÁX descuento     descuento alto        descuento medio          sin descuento
  MÁX riesgo        riesgo alto           riesgo medio             riesgo cero
  MÁX plazo         plazo alto            plazo medio              —
```

El descuento es el precio del riesgo y del tiempo: el desarrollador vende barato temprano porque necesita capital para arrancar y preventas para el crédito bancario, y traslada el riesgo de obra al comprador. A medida que la obra avanza, esas presiones se alivian y el precio sube. Cuanto más temprano entra el inversor, más plusvalía captura, más riesgo carga y más tiempo compromete su capital. **No hay una etapa mejor en abstracto — hay una etapa correcta para cada perfil.**

### 4.3 Matriz de plusvalía por reventa

**Edificios tradicionales (hasta 8 pisos · obra ≈24 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| Pre-pozo | 25 % | 35 % o más + renta |
| Lanzamiento | ~22 % `[PROPUESTA]` | ~32 % `[PROPUESTA]` |
| Pozo durante obra | 20 % | 30 % + renta |

**Torres (hasta 18 pisos · obra 36–48 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| Pre-pozo | 45 % | 50 % + renta |
| Lanzamiento | ~37 % `[PROPUESTA]` | ~45 % `[PROPUESTA]` |
| Pozo durante obra | 30 % | 40 % + renta |

Pre-pozo y Pozo son números confirmados. **Lanzamiento** sigue interpolado `[PROPUESTA]`, a confirmar.

### 4.4 El plazo de obra es una VARIABLE, no una banda `DECISIÓN`

Los números de la tabla son anclas, no reglas fijas. La misma plusvalía rinde muy distinto según el plazo: **45% en una torre de 36 meses rinde ~10,9% anual; el mismo 45% en 48 meses rinde ~8,5%.** Por eso la skill toma el **plazo de obra como variable de entrada** y calcula la TIR caso por caso, en vez de meter todo en una banda "36–48".

Esto formaliza tu propia observación: a más plazo, más incertidumbre de mercado **y** más plusvalía necesaria para sostener el mismo retorno anual. La skill lo hace explícito — si un proyecto de 48 meses no proyecta plusvalía suficiente para superar el piso anualizado, la señal es no entrar, por más grande que suene el número absoluto.

### 4.5 La doble TIR — el argumento de venta cuantificado `REGLA`

Toda operación de capital se presenta con **dos TIR lado a lado**, porque cuentan historias distintas y las dos son verdad:

**Ejemplo — pre-pozo, edificio tradicional, vende al terminar (25% de plusvalía):**

| Método de cálculo | Qué asume | **TIR anual** |
|---|---|---|
| Sobre **precio total** | Todo el capital comprometido desde el día uno | **≈ 9 %** |
| Sobre **capital desembolsado** | Reserva + cuotas durante la obra (lo que realmente pusiste) | **≈ 14–15 %** |

La diferencia —unos 5 a 6 puntos— **no es un truco: es la financiación implícita que te da el desarrollador.** Controlás un activo de valor 100 habiendo desembolsado, en promedio, mucho menos durante casi toda la obra. Ese diferencial es probablemente tu argumento comercial más fuerte, y hasta ahora no estaba cuantificado.

El número exacto depende del cronograma de cuotas de cada proyecto —cuánto va en reserva, cuánto en cuotas, cuánto al final— por eso la skill lo toma como input. Pero la regla es fija: **las dos TIR siempre se muestran juntas.** La de precio total es la conservadora y honesta; la de capital desembolsado es la real que experimenta el inversor. Mostrar ambas es a la vez más transparente y más persuasivo.

---

## 5. LA ESCALERA COMPLETA

```
Terreno              30 % anualizado          ← entra primero, máximo riesgo
Aporte construcción  22 % preferencial
  Pozo pre-obra      ↑ + plusvalía / + plazo / + riesgo
  Pozo lanzamiento   ┊ intermedio
  Pozo durante obra  ↓ − plusvalía / − plazo → mayor TIR anual
Renta temporal       12–14 % neto
Renta tradicional    6–8 % neto               ← ingreso estable, bajo riesgo
```

---

## 6. VARIABLES QUE LA SKILL DEBE TOMAR COMO INPUT

Para calcular caso por caso, `meridiano-rentabilidad` recibe:

1. Clase de activo (comercial / casa / depto s-muebles / depto amoblado)
2. Modo de renta (tradicional / temporal)
3. Etapa de ingreso (pre-pozo / lanzamiento / pozo durante obra)
4. **Plazo de obra en meses** (variable, no banda)
5. Momento de salida (al terminar / +1 año / mantener en renta)
6. **Cronograma de cuotas** (reserva %, cuotas, saldo a entrega)
7. Nivel de neto aplicable (1 a 4)

Devuelve: plusvalía total, TIR sobre precio total, TIR sobre capital desembolsado, y veredicto contra el piso de la etapa.

---

## 7. ESTADO

**Cerrado:**
- ✅ Renta por clase en Neto Completo/Temporal
- ✅ Neto en 4 niveles
- ✅ Terreno 30% · Aporte 22% · descuento pozo 25%
- ✅ Tres etapas de ingreso con su lógica
- ✅ Matriz de reventa actualizada (torre 45/50 · 30/40)
- ✅ **Plazo de obra como variable**
- ✅ **Regla de doble TIR** (precio total + capital desembolsado)
- ✅ Lista de inputs de la skill

**Refinamiento cosmético (no bloquea):**
- 🟡 Fila Lanzamiento — 4 valores propuestos a confirmar cuando quieras

**La política está lista para convertirse en la skill `meridiano-rentabilidad`.**
