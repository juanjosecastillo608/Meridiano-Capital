# P07 — POLÍTICA DE RENTABILIDAD OBJETIVO

**Meridiano Capital · operada por Campo Agreste S.A.**
**Documento estratégico — Brand OS 2.0**
**Estado:** BORRADOR 6 · reventa temprana incorporada · Lanzamiento recalibrado
**Fecha:** 24 de julio de 2026
*Supersede al borrador 5.*

---

## 0. QUÉ RESUELVE

Cierra el Conflicto 01. Insumo directo de la skill `meridiano-rentabilidad` y del Agente de Análisis.

---

## 1. REGLA DE PRESENTACIÓN — no negociable

- **Renta:** bruta + neta, juntas.
- **Capital:** plusvalía total + **TIR sobre precio total** + **TIR sobre capital desembolsado**, las tres juntas.

Un número solo, sin su par, no sale nunca.

---

## 2. RENTA — PISO NETO POR CLASE `CERRADO`

Medidos en **Neto Completo (Nivel 3)** para tradicional y **Neto Temporal (Nivel 4)** para estadía corta.

| Renta tradicional | Piso |  | Renta temporal | Piso |
|---|---|---|---|---|
| Comercial (local, tinglado, nave) | 8,0 % |  | Departamento | 14,0 % |
| Residencial — casas | 6,0 % |  | Casa | 12,0 % |
| Departamento sin muebles | 6,0 % |  | | |
| Departamento amoblado | 7,5 % |  | | |

---

## 3. NETO — CUATRO NIVELES `CERRADO`

| Nivel | Quién | Descuenta (acumulativo) |
|---|---|---|
| 1 · Básico | Propietario autogestiona | Impuesto Inmobiliario · IVA · Impuesto a la Renta · Expensas |
| 2 · Administrado | Meridiano administra | + Honorarios administración · Honorarios alquiler |
| 3 · Completo | Según perfil y tipo | + Seguros · Mantenimiento · Amortización · Vacancia |
| 4 · Temporal | Estadía corta | Bruta − impuestos · limpieza · seguros obligatorios · mantenimiento · canon agencia |

**Nota fiscal para reventa `A CONFIRMAR CON CONTADORA`:** se reporta que Paraguay no grava la ganancia de capital, lo que haría la plusvalía neta ≈ bruta. Pero la reventa frecuente puede tratarse como actividad habitual gravada, no como ganancia ocasional exenta. Define la contadora. Impacta de lleno en el neto de toda operación de reventa, sobre todo la temprana.

---

## 4. ETAPAS DE CAPITAL `CERRADO`

### 4.1 Escalera general

| Etapa | Piso | Métrica |
|---|---|---|
| Terreno | 30% anualizado | plusvalía anualizada + MOIC |
| Aporte de construcción | 22% preferencial anual | TIR por proyecto · % fijo · o participación |
| Pozo / reventa | según ingreso, plazo y salida → 4.3 / 4.6 | plusvalía + doble TIR |

### 4.2 Las tres etapas de ingreso

```
   PRE-POZO           LANZAMIENTO          POZO DURANTE OBRA         ENTREGA
  −6/−8 meses        inicio de obra        obra en marcha          obra lista
  ──────────────────────────────────────────────────────────────────────────►
  precio más bajo   ← inflexión: el precio sube al iniciar obra →  precio lista
  MÁX descuento     descuento alto        descuento medio          sin descuento
  MÁX riesgo        riesgo alto           riesgo medio             riesgo cero
```

Confirmado por el mercado: el precio de preventa es el más bajo del ciclo y sube después del inicio de obra. El lanzamiento es un punto de inflexión de precio, no un punto intermedio neutro.

### 4.3 Matriz de plusvalía por reventa (venta con unidad terminada)

**Edificios tradicionales (hasta 8 pisos · obra ≈24 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| Pre-pozo | 25 % | 35 % o más + renta |
| Lanzamiento | **23 %** `[PROPUESTA v2]` | **33 %** `[PROPUESTA v2]` |
| Pozo durante obra | 20 % | 30 % + renta |

**Torres (hasta 18 pisos · obra 36–48 meses)**

| Entrada | Vende al terminar | Vende +1 año (con renta) |
|---|---|---|
| Pre-pozo | 45 % | 50 % + renta |
| Lanzamiento | **40 %** `[PROPUESTA v2]` | **47 %** `[PROPUESTA v2]` |
| Pozo durante obra | 30 % | 40 % + renta |

### 4.4 Recalibración de Lanzamiento — por qué estos números

La primera interpolación (borrador 4) puso Lanzamiento en el punto medio simple. Era incorrecta por dos razones que el mercado aclara:

1. **Lanzamiento está temporalmente mucho más cerca de pre-pozo que de pozo.** Pre-pozo entra a −7 meses, lanzamiento al mes 0, pozo recién al mes 12-18. Por tiempo, lanzamiento debe parecerse más a pre-pozo.
2. **El lanzamiento es un salto de precio, no una transición suave.** El precio salta al iniciar la obra. Eso comprime un poco la plusvalía disponible desde lanzamiento — pero como sigue siendo muy temprano, queda cerca de pre-pozo.

Resultado: Lanzamiento se ubica **1-2 puntos por debajo de pre-pozo en tradicional (23% vs 25%) y ~5 puntos en torre (40% vs 45%)** — mucho más cerca del techo que del piso. Son propuestas; el que confirma con datos reales de tus proyectos sos vos.

### 4.5 El plazo de obra es una VARIABLE

Los números son anclas. El mismo 45% rinde ~10,9% anual en 36 meses y ~8,5% en 48 meses. La skill toma el **plazo de obra en meses como input** y calcula la TIR caso por caso. Si un proyecto largo no supera el piso anualizado, no se entra por más grande que sea el número absoluto.

### 4.6 REVENTA TEMPRANA — la cuarta estrategia de salida `NUEVO`

El caso de los **edificios exitosos**: durante pre-pozo y lanzamiento, cuando los inversores todavía están pagando cuotas, ya empiezan operaciones de reventa por **cesión de derechos (boleto)** — se vende la posición tomando plusvalía sin haber terminado de pagar.

**Por qué la TIR se dispara.** Con entrega del 20% + cuotas sin intereses, el inversor desembolsó una fracción del precio pero captura la apreciación sobre el valor completo del activo. Ejemplo con la estructura real de Habitalis (20% entrega):

| Concepto | Valor |
|---|---|
| Precio pre-pozo | 80 (unidad terminada vale 100) |
| Entrega 20% + 6 cuotas | desembolsado ≈ 32 |
| Valor de la posición al mes 6 (post-lanzamiento, +10%) | 88 |
| Saldo que asume el comprador de la cesión | 48 |
| El cedente recibe | 88 − 48 = 40 |
| **Ganancia** | 40 − 32 = **8** |
| **TIR sobre capital desembolsado** | 8/32 en 6 meses → **≈ 56 % anual** |

**El perfil de esta jugada:** plusvalía absoluta modesta (~8%), pero TIR sobre capital desembolsado altísima (~50%+), porque desembolsaste poco y saliste rápido. Es una jugada de **velocidad, no de magnitud**: comprás pre-pozo, cedés el boleto post-lanzamiento, y reciclás el capital al siguiente proyecto.

**Los riesgos, que hay que decir claros:**
- **Liquidez:** solo funciona en edificios exitosos con demanda de cesión. Si no hay comprador para el boleto, no hay salida.
- **Que la apreciación ocurra:** el ~10% post-lanzamiento no está garantizado; depende del éxito comercial del proyecto.
- **Contractual:** el contrato con el desarrollador tiene que permitir la cesión.
- **Fiscal:** reventa frecuente puede gravarse como actividad habitual (ver nota Sección 3).

### 4.7 Las tres estrategias de salida — mapeadas a perfil

Esta es la herramienta comercial que sale de todo lo anterior. Para una misma compra en pre-pozo, hay tres salidas, y cada una es para un inversor distinto:

| Salida | Plusvalía absoluta | TIR capital desembolsado | Riesgo | Para qué inversor |
|---|---|---|---|---|
| **Reventa temprana** (cesión) | ~8 % | ~50 %+ | Liquidez alta | Capital-light, tolera riesgo, quiere rotar rápido |
| **Vende al terminar** | 25 % | ~14–15 % | Medio | Balanceado |
| **Renta + vende +1 año** | 35 %+ y renta | menor, pero suma renta | Bajo | Conservador, quiere ingreso |

Ubicar a cada cliente en la salida que le corresponde según su capital y su apetito de riesgo es, exactamente, lo que genera confianza y referido. El Agente de Análisis calcula las tres para cualquier unidad y las presenta lado a lado.

---

## 5. LA ESCALERA COMPLETA

```
Terreno              30 % anualizado
Aporte construcción  22 % preferencial
  Pozo pre-obra      ↑ + plusvalía / + plazo / + riesgo
  Pozo lanzamiento   ┊ intermedio (cerca de pre-pozo)
  Pozo durante obra  ↓ − plusvalía → mayor TIR anual
  Reventa temprana   ⚡ TIR más alta sobre capital, plusvalía chica, riesgo liquidez
Renta temporal       12–14 % neto
Renta tradicional    6–8 % neto
```

---

## 6. INPUTS DE LA SKILL

`meridiano-rentabilidad` recibe: clase de activo · modo de renta · etapa de ingreso · plazo de obra (meses) · **estrategia de salida (temprana / al terminar / +1 año / renta)** · cronograma de cuotas (entrega % + saldo) · nivel de neto.

Devuelve: plusvalía total · TIR sobre precio total · TIR sobre capital desembolsado · veredicto contra el piso.

---

## 7. ESTADO

**Cerrado:**
- ✅ Renta por clase · Neto en 4 niveles
- ✅ Terreno 30% · Aporte 22% · descuento pozo 25%
- ✅ Tres etapas de ingreso
- ✅ Matriz de reventa (torre 45/50 · 30/40)
- ✅ **Reventa temprana como cuarta estrategia de salida**
- ✅ **Tres estrategias de salida mapeadas a perfil**
- ✅ Plazo de obra como variable · doble TIR

**A confirmar (no bloquea):**
- 🟡 Lanzamiento recalibrado (23/33 · 40/47) — 4 valores, tu palabra final
- 🟡 Tratamiento fiscal de la reventa — tu contadora
- 🟡 Supuesto de apreciación post-lanzamiento (~10%) — tu experiencia real

**Lista para convertirse en la skill `meridiano-rentabilidad`.**
