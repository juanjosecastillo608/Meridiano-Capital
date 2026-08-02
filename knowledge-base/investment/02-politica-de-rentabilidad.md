```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-rentabilidad/references/politica-completa.md
Dominio: INVESTMENT
```

# P07 — Política de Rentabilidad Objetivo (v7 FINAL)

> Documento maestro de referencia: *P07_Politica_Rentabilidad_borrador7* (entregables externos a este repositorio). Este archivo es la referencia embebida y es la fuente operativa vigente para el motor de cálculo.

Esta es la versión **v7 FINAL**, y dentro de ella hay un bloque explícito de "REFINAMIENTOS P07" incorporado *después* del cuerpo original de la política, tras auditar operaciones concretas (Habitalis 9A y Edificio Austria). Los refinamientos no reemplazan el cuerpo de la política — lo corrigen y precisan en puntos específicos donde se habían detectado errores en modelos reales. Se documentan ambos, en orden, y se marca explícitamente dónde un refinamiento corrige un valor o supuesto anterior.

---

## Concepto central — el momento de compra y el retorno combinado

A precio de lista la renta casi nunca llega al piso. El piso se alcanza comprando bien, en pozo. El inversor que compra en obra o terminada y renta, espera que la **plusvalía cubra la brecha de renta**, y con el tiempo recupera rentabilidad si el alquiler sube.

```
RETORNO COMBINADO = yield de renta (neto) + plusvalía
```

### Caso real validado — Habitalis Mburucuyá

- Compra pozo con cochera 90.000 + muebles 9.000 = costo 99.000.
- Valor de venta hoy 120.000 · renta 950/mes · tenencia 12 meses.
- Renta sola: 5,87% neto (piso 7,5% → NO llega sola).
- Plusvalía: +21,2% en el año.
- **Retorno combinado: 27,1%** → inversión sólida por el momento de compra.

**Regla:** si la renta sola no llega al piso pero la plusvalía cubre la brecha, la operación es sólida. No rechazar mirando solo la renta.

---

## Pisos de renta (Neto Completo / Temporal)

| Clase | Piso |
|---|---|
| Comercial | 8% |
| Casa | 6% |
| Departamento sin muebles | 6% |
| Departamento amoblado | 7,5% |
| Temporal departamento | 14% |
| Temporal casa | 12% |

> UNRESOLVED: el refinamiento #10 (más abajo) etiqueta estos mismos números como pisos **BRUTOS**, no netos, y da rangos netos distintos. Ver el análisis completo en `01-metodologia-calculo.md` sección 7 — es una contradicción sin resolver dentro del propio material fuente.

---

## Neto — 4 niveles: Básico / Administrado / Completo / Temporal (acumulativos)

Cada nivel incluye los descuentos del nivel anterior. Detalle de qué línea entra en cada nivel: ver `03-parametros-de-mercado.md` (bloque `conceptos_neto`) y `01-metodologia-calculo.md` sección 4.

---

## Fiscal (confirmado)

**La reventa NO se grava como actividad habitual. Plusvalía neta = plusvalía bruta.**

> Nota: este punto está marcado como "confirmado" en el documento fuente, a diferencia del tratamiento del IVA sobre renta, que en el config vive todavía bajo un bloque etiquetado "A CONFIRMAR CON CONTADORA" — ver `03-parametros-de-mercado.md`.

---

## Etapas de capital

- **Terreno:** 30% anualizado.
- **Aporte de construcción:** 22% preferencial (anual).
- Tres etapas de ingreso al pozo: **pre-pozo** / **lanzamiento** / **pozo durante obra**.
- Validado por mercado: descuento contra precio terminado — preventa (planos) 20-30%; en construcción 10-20%; terminado 0%.

---

## Matriz de plusvalía

Formato de cada celda: `al_terminar / +1_año_con_renta` (porcentaje de plusvalía **total**, no anual).

| Tipo edificio | Plazo obra ref. | pre-pozo | lanzamiento | pozo durante obra |
|---|---|---|---|---|
| Tradicional | 24 meses | 25% / 35% | 23% / 33% | 20% / 30% |
| Torre | 36-48 meses | 45% / 50% | 40% / 47% | 30% / 40% |

> Nota de la fuente: los valores de la columna "lanzamiento" son **valores propuestos a confirmar** (no validados con caso real como pre-pozo y pozo).

**Plazo de obra = variable.** El mismo 45% de plusvalía rinde 10,9% anual en una torre de 36 meses y 8,5% anual en una de 48 meses. El veredicto se hace siempre sobre **TIR anualizada**, nunca sobre la plusvalía total.

---

## Doble TIR

- **Precio total:** conservadora, CAGR sobre el precio completo pagado el día uno.
- **Capital desembolsado:** real, IRR sobre el flujo de caja efectivo, típicamente ~5-6 puntos más alta.

Ver fórmulas y verificación contra el código en `01-metodologia-calculo.md` sección 1.

---

## Reventa temprana (cesión de derechos)

- Apreciación post-lanzamiento: **10% base**; **15-20% en proyectos exitosos**.
- TIR sobre capital desembolsado: **~50-85%**.
- Es una **jugada de velocidad** (plusvalía absoluta chica, TIR altísima), no de magnitud.
- Riesgos: liquidez, que la apreciación efectivamente ocurra, y el contrato (que permita ceder).

---

## Tres estrategias de salida, por perfil de inversor

| Estrategia | TIR aproximada | Plusvalía | Riesgo / perfil |
|---|---|---|---|
| Reventa temprana | ~50%+ | Chica | Riesgo de liquidez → perfil capital-light |
| Vende al terminar | ~14-15% | ~25% | Perfil balanceado |
| Renta + vende a +1 año | Menor TIR + renta | — | Perfil conservador |

Para una compra en pozo, siempre calcular y presentar las tres salidas lado a lado y explicar para qué perfil de inversor es cada una.

---

## Refinamientos P07 — validados con casos reales (Habitalis 9A · Edificio Austria)

Diez políticas incorporadas tras auditar operaciones concretas. Los parámetros correspondientes viven en `config/parametros_mercado.json` (documentado en `03-parametros-de-mercado.md`).

### 1. Regla de oro — neto después de todo

El número que se presenta al inversor es **SIEMPRE el neto**: después de vacancia, expensas no cubiertas, IVA (10%), IRE (10%) y el honorario de administración de Meridiano (10%). **Nunca el bruto.**

*Origen del refinamiento:* detectado en el modelo Edificio Austria, que reportaba ~18,5% bruto sin descontar impuestos ni honorario; el neto real era ~14-15%.

### 2. Vacancia por tipología

El 3% único subestima edificios mixtos. Piso por clase: **departamento 4%, oficina 10%, comercial 8%**. El escalar `vacancia_pct` (3%) queda como default de departamento.

> UNRESOLVED: el propio texto de este refinamiento dice que 3% es el "default de departamento", pero la tabla de vacancia por tipología en el config asigna a `departamento` el valor **4%**, no 3%. Además, `calculadora.py` no usa en absoluto la tabla de vacancia por tipología — siempre aplica el escalar genérico `vacancia_pct` (3%) sin importar la clase de activo evaluada. Ver `01-metodologia-calculo.md`.

### 3. IVA e IRE siempre aplicados

Nunca dejarlos en 0. En Paraguay: **IVA 10% (Ley 125/91)** e **IRE 10%**.

*Origen del refinamiento:* el modelo auditado los tenía definidos pero en 0 — no los aplicaba.

> UNRESOLVED: a pesar de esta regla explícita, el bloque `fiscal` del config vigente tiene `iva_pct: 5.0` (no 10%), marcado internamente "A CONFIRMAR CON CONTADORA", y es ese valor de 5% — no el 10% de este refinamiento — el que efectivamente usa el código para calcular el descuento de IVA en cada evaluación de renta. Ver el detalle en `03-parametros-de-mercado.md` y `01-metodologia-calculo.md`.

### 4. Honorarios confirmados

Administración: **10% de la renta**. Colocación: **50% de un mes (0,5)**. Corrige el 8% / 1 mes que traía el config borrador anterior.

### 5. Comisiones con lógica de puntas (marco completo)

**Venta:** 5,5% total, la paga el vendedor.
- Meridiano con solo el comprador → 50% de la comisión (**2,75% efectivo**).
- Meridiano con la propiedad en su cartera de venta + el comprador → 100% (**5,5% efectivo**).

**Alquiler:** 1 mes de alquiler, financiado 50% dueño + 50% inquilino.
- Meridiano con un solo rol → 50% (**0,5 mes**).
- Meridiano administra la propiedad + aporta el inquilino → 100% (**1 mes**).
- En el neto del inversor se descuenta **solo su mitad (0,5 mes)**; el inquilino paga la otra.

### 6. Fondo de emergencia

**8% sobre expensas** en todo edificio administrado (Cartera A).

> UNRESOLVED: este parámetro (`fondo_emergencia_expensas_pct` = 8.0) existe en el config pero no se usa en ningún cálculo dentro de `calculadora.py` — no aparece en el desglose de `evaluar_renta()`. Puede ser intencional (aplica a un fondo de reserva del edificio, no al neto individual del inversor) pero no está documentado como tal.

### 7. Uplift por remodelación (value-add)

**+40% objetivo** de renta, con capex por fases: infraestructura → espacios que generan renta → residencial.

> Nota: no existe en `calculadora.py` un método que calcule este escenario de value-add; el parámetro (`uplift_remodelacion_objetivo_pct` = 40.0) vive en el config como una cifra objetivo de referencia, no consumida por ninguna fórmula del motor actual.

### 8. Renta temporal (Airbnb) con supuestos realistas

- Ocupación **55-65%** (NUNCA 90%+).
- Capex de amoblado ~**USD 4.500/depto**.
- Costos reales: limpieza, channel manager, premium de servicios.
- Mix recomendado: ~**40% largo plazo / 60% temporal** para residencial en zona de alta demanda.
- Usar los pisos temporales de P07 (depto 14%), no números crudos de un modelo optimista.

*Origen del refinamiento:* corrige un modelo (Edificio Austria) que usaba 93% de ocupación.

> UNRESOLVED: como se detalla en `01-metodologia-calculo.md` sección 4.1, `evaluar_renta()` en su rama de renta temporal **no aplica** la ocupación realista (55-65%) del config — usa el mismo `vacancia_pct` genérico de 3% que la renta tradicional. Es, potencialmente, el mismo error que este refinamiento dice haber corregido, reintroducido en el motor de cálculo.

### 9. Distinguir renta pasiva de operación

Tres categorías, cada una con su honorario y piso propios:

- **(a) Renta pasiva (Cartera A):** 10% de administración; piso por tipología (P07).
- **(b) Renta temporal Urbannit:** canon de agencia; piso temporal 14% (un edificio entero puede operarse 100% Airbnb bajo Urbannit).
- **(c) Operación hotelera:** honorarios de **OPERADOR** (no 10%), porque un hotel es un negocio operativo con opex 40-55%, no renta pasiva.

**No confundir las tres.**

> Ver nota relacionada en `01-metodologia-calculo.md`: el código actual calcula el "canon de agencia" de (b) reutilizando el mismo `honorarios_administracion_pct` (10%) de (a), sin una tarifa propia de canon temporal en el config.

### 10. Pisos etiquetados bruto/neto

Los pisos por tipología son **BRUTO** (mínimo por clase de activo); la cartera objetivo 10% es **NETO**.

- Renta temporal: **bruto 10-16% → neto 8-11%** (Urbannit comunica el neto al propietario).
- Ocupación temporal: underwriting base **55-69%** (conservador) vs Urbannit-gestionada **76-88%**; 90%+ es solo techo, nunca base.

> UNRESOLVED: este refinamiento es el origen directo de la contradicción bruto/neto documentada en `01-metodologia-calculo.md` sección 7. Etiqueta como "BRUTO" los mismos números (comercial 8, casa 6, depto s/muebles 6, amoblado 7.5, temporal depto 14, temporal casa 12) que en el resto de la política y en el código se tratan como netos. Requiere decisión de negocio para resolverse.

---

## Regla transversal

Antes de presentar cualquier operación a un inversor, **correr 3 escenarios (pesimista / base / optimista)**.

---

## Requisitos para el dominio de negocio (business / investor journey)

- Todo término, piso, nivel de neto y umbral usado en la comunicación con el inversor (propuestas, presentaciones, journey de inversión) debe usar exactamente esta terminología y estos números — sin redondeos ni simplificaciones que alteren el piso real.
- La "regla de oro" (refinamiento #1) es un requisito de comunicación, no solo de cálculo: el número mostrado al inversor es siempre el neto, nunca el bruto solo.
- La distinción entre renta pasiva (Cartera A), renta temporal (Urbannit) y operación hotelera (refinamiento #9) debe reflejarse en cómo se presenta cada producto al inversor — son ofertas distintas, con honorarios y pisos distintos, y no deben mezclarse en el discurso comercial.
- Los tres escenarios obligatorios (pesimista/base/optimista) deben aparecer en cualquier material que se entregue a un inversor antes de una decisión de compra.
