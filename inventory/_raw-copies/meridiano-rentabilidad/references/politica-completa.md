# P07 — POLÍTICA DE RENTABILIDAD OBJETIVO (v7 FINAL)

Ver documento maestro P07_Politica_Rentabilidad_borrador7 en los entregables.
Esta es la referencia embebida en la skill.

## CONCEPTO CENTRAL — El momento de compra y el retorno combinado

A precio de lista la renta casi nunca llega al piso. El piso se alcanza comprando bien, en pozo.
El inversor que compra en obra/terminada renta esperando que la PLUSVALIA cubra la brecha de renta,
y con el tiempo recupera rentabilidad si el alquiler sube.

    RETORNO COMBINADO = yield de renta (neto) + plusvalia

### Caso real validado — Habitalis Mburucuya
- Compra pozo c/cochera 90.000 + muebles 9.000 = costo 99.000
- Valor venta hoy 120.000 · renta 950/mes · tenencia 12 meses
- Renta sola: 5,87% neto (piso 7,5% -> NO llega sola)
- Plusvalia: +21,2% en el año
- RETORNO COMBINADO: 27,1% -> inversion solida por el momento de compra

Regla: si la renta sola no llega al piso pero la plusvalia cubre la brecha, la operacion es solida.
No rechazar mirando solo la renta.

## PISOS DE RENTA (Neto Completo / Temporal)
Comercial 8% · casa 6% · depto s/muebles 6% · depto amoblado 7,5% · temporal depto 14% · temporal casa 12%

## NETO — 4 niveles: Basico / Administrado / Completo / Temporal (acumulativos)

## FISCAL (confirmado): la reventa NO se grava como actividad habitual. Plusvalia neta = bruta.

## ETAPAS DE CAPITAL
- Terreno: 30% anualizado · Aporte construccion: 22% preferencial
- Tres etapas de ingreso al pozo: pre-pozo / lanzamiento / pozo durante obra
- Validado por mercado: preventa (planos) 20-30% descuento; en construccion 10-20%; terminado 0%

## MATRIZ DE PLUSVALIA
Tradicional (24m): pre-pozo 25/35 · lanzamiento 23/33 · pozo 20/30
Torre (36-48m):    pre-pozo 45/50 · lanzamiento 40/47 · pozo 30/40
(formato: al_terminar / +1_año_con_renta)

## PLAZO DE OBRA = VARIABLE. El mismo 45% rinde 10,9% anual en 36m y 8,5% en 48m.
Veredicto sobre TIR anualizada, no plusvalia total.

## DOBLE TIR: precio total (conservadora) + capital desembolsado (real, ~5-6 pts mas alta).

## REVENTA TEMPRANA (cesion): apreciacion post-lanzamiento 10% base, 15-20% en exitosos.
TIR sobre capital desembolsado ~50-85%. Jugada de velocidad. Riesgos: liquidez, apreciacion, contrato.

## TRES ESTRATEGIAS DE SALIDA POR PERFIL
- Reventa temprana: TIR ~50%+, plusvalia chica, riesgo liquidez -> capital-light
- Vende al terminar: TIR ~14-15%, plusvalia 25% -> balanceado
- Renta + vende +1 año: menor TIR + renta -> conservador

---

## REFINAMIENTOS P07 — validados con casos reales (Habitalis 9A · Edificio Austria)

Ocho políticas incorporadas tras auditar operaciones concretas. Los parámetros viven en `config/parametros_mercado.json`.

1. **REGLA DE ORO — neto después de todo.** El número que se presenta al inversor es SIEMPRE el neto: después de vacancia, expensas no cubiertas, IVA (10%), IRE (10%) y el honorario de administración de Meridiano (10%). Nunca el bruto. (Detectado en el modelo Edificio Austria, que reportaba ~18,5% bruto sin descontar impuestos ni honorario; el neto real era ~14-15%.)

2. **Vacancia por tipología.** El 3% único subestima edificios mixtos. Piso por clase: departamento 4%, oficina 10%, comercial 8%. El escalar `vacancia_pct` (3%) queda como default de departamento.

3. **IVA e IRE SIEMPRE aplicados.** Nunca dejarlos en 0. En Paraguay IVA 10% (Ley 125/91) e IRE 10%. (El modelo auditado los tenía definidos pero en 0 — no los aplicaba.)

4. **Honorarios confirmados.** Administración 10% de la renta; colocación 50% de un mes (0,5). Corrige el 8%/1-mes que traía el config borrador.

5. **Comisiones con lógica de puntas (marco completo).**
   - **Venta:** 5,5%, la paga el vendedor. Meridiano con solo el comprador → 50% (**2,75%**); con la propiedad en su cartera de venta + el comprador → 100% (**5,5%**).
   - **Alquiler:** 1 mes de alquiler, financiado 50% dueño + 50% inquilino. Meridiano con un solo rol → 50% (**0,5 mes**); administra la propiedad + aporta el inquilino → 100% (**1 mes**). En el neto del inversor se descuenta solo su mitad (0,5 mes); el inquilino paga la otra.

6. **Fondo de emergencia: 8% sobre expensas** en todo edificio administrado (Cartera A).

7. **Uplift por remodelación value-add: +40% objetivo** de renta, con capex por fases (infraestructura → espacios que generan renta → residencial).

8. **Renta temporal (Airbnb) con supuestos realistas.** Ocupación 55-65% (NUNCA 90%+), capex de amoblado ~USD 4.500/depto, y costos reales (limpieza, channel manager, premium de servicios). Mix recomendado ~40% largo plazo / 60% temporal para residencial en zona de alta demanda. Usar los pisos temporales de P07 (depto 14%), no números crudos de un modelo optimista.

9. **Distinguir renta pasiva de operación.** Tres categorías, cada una con su honorario y piso: (a) **renta pasiva (Cartera A)** → 10% de administración, piso por tipología; (b) **renta temporal Urbannit** → canon de agencia, piso temporal 14% (un edificio entero puede operarse 100% Airbnb bajo Urbannit); (c) **operación hotelera** → honorarios de OPERADOR (no 10%), porque un hotel es un negocio operativo con opex 40-55%, no renta pasiva. No confundir las tres.

10. **Pisos etiquetados bruto/neto.** Los pisos por tipología son **BRUTO** (mínimo por clase de activo); la cartera objetivo 10% es **NETO**. Renta temporal: **bruto 10-16% → neto 8-11%** (Urbannit comunica el neto al propietario). Ocupación temporal: underwriting base 55-69% (conservador) vs Urbannit-gestionada 76-88%; 90%+ solo techo, nunca base.

**Regla transversal:** antes de presentar cualquier operación a un inversor, correr 3 escenarios (pesimista / base / optimista).
