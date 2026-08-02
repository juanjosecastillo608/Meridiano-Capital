```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-rentabilidad/config/parametros_mercado.json
Dominio: INVESTMENT
```

# Parámetros de mercado — `config/parametros_mercado.json`

Este documento es la versión legible del archivo de configuración que alimenta el motor de rentabilidad. **Es una config VIVA**: se edita únicamente este archivo (o su equivalente en el nuevo repo) cuando el mercado cambia — nunca la lógica de cálculo (`calculadora.py`).

> **Sincronización obligatoria:** este archivo debe copiarse (o su equivalente estructurado) a la configuración de la aplicación del nuevo repo, y ambos deben mantenerse sincronizados. Si se edita un parámetro acá porque cambió el mercado, hay que editarlo también en `config/parametros_mercado.json` de la app — o, mejor, la app debe consumir directamente una única fuente de verdad para evitar que los dos se desincronicen.

Metadatos de la versión fuente auditada: `version: "1.4"`, `fecha: "2026-07-31"`, `politica_origen: "P07 + refinamientos validados (Habitalis 9A, Edificio Austria)"`.

---

## Pisos de renta neta — `pisos_renta_neta`

Piso de rentabilidad neta anual por clase de activo. Tradicional se mide en Neto Completo (Nivel 3); temporal en Neto Temporal (Nivel 4).

| Clave | Valor | Significado |
|---|---|---|
| `comercial` | 8.0 | Piso % anual, local comercial |
| `residencial_casa` | 6.0 | Piso % anual, casa |
| `departamento_sin_muebles` | 6.0 | Piso % anual, depto sin amoblar |
| `departamento_amoblado` | 7.5 | Piso % anual, depto amoblado |
| `temporal_departamento` | 14.0 | Piso % anual, depto en renta temporal |
| `temporal_casa` | 12.0 | Piso % anual, casa en renta temporal |

> UNRESOLVED: ver `01-metodologia-calculo.md` sección 7 — el bloque `pisos_base_bruto_o_neto` (más abajo) etiqueta estos mismos valores como pisos BRUTOS, contradiciendo el nombre de esta clave (`..._neta`) y el uso que el código le da (los compara contra el yield neto).

## Objetivo de cartera — `promedio_objetivo_cartera_neto`

**10.0** — objetivo neto promedio de toda la cartera de Meridiano Capital.

## Pisos de capital — `pisos_capital`

Terreno y aporte se miden anualizados.

| Clave | Valor | Significado |
|---|---|---|
| `terreno_plusvalia_anual_min` | 30.0 | Plusvalía anualizada mínima aceptable para terreno |
| `aporte_construccion_preferencial_anual` | 22.0 | Retorno preferencial anual mínimo para aporte de construcción |

## Matriz de plusvalía de reventa — `matriz_plusvalia_reventa`

Plusvalía total (no anual) por tipo de edificio, etapa de ingreso y momento de salida. Editable según mercado. Los valores de `lanzamiento` están marcados en la fuente como **"propuestos a confirmar"**.

### `tradicional` (plazo obra de referencia: 24 meses)

| Etapa de ingreso | vende_al_terminar | vende_mas_un_ano |
|---|---|---|
| pre_pozo | 25.0% | 35.0% |
| lanzamiento | 23.0% | 33.0% |
| pozo_durante_obra | 20.0% | 30.0% |

### `torre` (plazo obra de referencia: 42 meses)

| Etapa de ingreso | vende_al_terminar | vende_mas_un_ano |
|---|---|---|
| pre_pozo | 45.0% | 50.0% |
| lanzamiento | 40.0% | 47.0% |
| pozo_durante_obra | 30.0% | 40.0% |

> Nota: la política (`02-politica-de-rentabilidad.md`) describe el plazo de obra de "torre" como un rango 36-48 meses; el config fija un único valor de referencia (42 meses, el punto medio) que el motor usa por defecto cuando no se especifica `meses_obra`.

## Supuestos de reventa temprana — `supuestos_reventa_temprana`

Cesión de derechos antes de terminar de pagar. Solo edificios exitosos con demanda de cesión.

| Clave | Valor | Significado |
|---|---|---|
| `apreciacion_post_lanzamiento_pct` | 10.0 | Apreciación default usada si no se especifica una puntual |
| `mes_cesion_tipico` | 6 | Mes típico en el que se cede el boleto |
| `apreciacion_rango_pct` | [10.0, 20.0] | Rango para armar escenarios (10% conservador; 15-20% en proyectos exitosos) |

## Cronograma de cuotas default — `cronograma_cuotas_default`

Estructura de pago típica del mercado de Asunción: entrega inicial + saldo en cuotas sin intereses durante la obra. Editable por proyecto.

| Clave | Valor | Significado |
|---|---|---|
| `entrega_inicial_pct` | 20.0 | % de entrega inicial |
| `cuotas_sin_interes` | true | Las cuotas no llevan interés |
| `saldo_a_entrega_pct` | 0.0 | % en forma de balloon (pago único) a la entrega — 0 por default |

## Conceptos por nivel de neto — `conceptos_neto`

Qué se descuenta en cada nivel. Acumulativo: cada nivel incluye los anteriores.

| Nivel | Conceptos |
|---|---|
| `nivel_1_basico` | impuesto_inmobiliario, iva, impuesto_renta, expensas |
| `nivel_2_administrado` | honorarios_administracion, honorarios_alquiler |
| `nivel_3_completo` | seguros, mantenimiento, amortizacion, vacancia |
| `nivel_4_temporal` | impuestos, limpieza, seguros_obligatorios, mantenimiento, canon_agencia |

## Supuestos operativos default — `supuestos_operativos_default`

Gastos operativos por defecto, expresados como % de la renta **bruta anual**. Vacancia calibrada al mercado real (~97% ocupación). Editar con valores reales para evaluaciones en firme.

| Clave | Valor | Significado |
|---|---|---|
| `expensas_pct` | 0.0 | 0 = las paga el inquilino (típico); si las paga el propietario, cargar el % real |
| `impuesto_inmobiliario_pct` | 4.0 | Impuesto inmobiliario, % de renta bruta anual |
| `vacancia_pct` | 3.0 | Vacancia genérica (default de departamento según el refinamiento #2 — aunque ver nota abajo) |
| `mantenimiento_pct` | 5.0 | Mantenimiento |
| `seguro_pct` | 2.0 | Seguro |
| `honorarios_administracion_pct` | 10.0 | Honorario de administración de Meridiano |
| `honorarios_alquiler_meses` | 0.5 | Colocación — medio mes de alquiler (la mitad que corresponde al propietario) |
| `amortizacion_muebles_pct` | 8.0 | Amortización de muebles — solo aplica a amoblado y temporal |
| `iva_pct` | 10.0 | IVA — nota: este valor **no** es el que usa el código; ver la sección "fiscal" abajo |
| `impuesto_renta_pct` | 10.0 | Impuesto a la renta |

> UNRESOLVED: hay dos claves `iva_pct` en el config completo — una acá (`supuestos_operativos_default.iva_pct = 10.0`) y otra en el bloque `fiscal` (`fiscal.iva_pct = 5.0`, marcada "A CONFIRMAR CON CONTADORA"). El código (`calculadora.py`) lee el IVA **del bloque `fiscal`**, es decir, usa 5%, no el 10% que aparece acá y que coincide con lo que dice la política ("IVA 10%, Ley 125/91"). Ver detalle completo en `01-metodologia-calculo.md` sección 4.1 y en el bloque "fiscal" más abajo.

> UNRESOLVED: `vacancia_pct` (3.0) está etiquetado en el refinamiento #2 de la política como "default de departamento", pero la tabla `vacancia_por_tipologia_pct` (ver abajo) asigna a `departamento` el valor 4.0, no 3.0. Y el código nunca consulta esa tabla de todos modos — siempre usa este escalar genérico de 3.0 sin importar la clase evaluada.

## Fiscal — `fiscal`

Bloque marcado internamente como **"A CONFIRMAR CON CONTADORA"**.

| Clave | Valor | Significado |
|---|---|---|
| `iva_pct` | 5.0 | IVA sobre la renta bruta — **este es el valor que efectivamente usa el código**, no el 10% de `supuestos_operativos_default` ni el 10% que declara la política |
| `impuesto_renta_pct` | 10.0 | IRP aplicado sobre la renta NETA (no bruta) |
| `grava_ganancia_capital` | false | Confirmado por el usuario: la reventa NO se grava como actividad habitual — plusvalía neta = plusvalía bruta |

> UNRESOLVED: `iva_pct = 5.0` está marcado "a confirmar con contadora" pero ya está en uso productivo por el motor de cálculo en toda evaluación de renta. La política P07 (refinamiento #3) es taxativa: "IVA e IRE SIEMPRE aplicados... IVA 10% (Ley 125/91)". Hay una discrepancia de 5 puntos porcentuales entre lo que dice la política que debe aplicarse y lo que el motor efectivamente aplica.

## Descuento por etapa de mercado — `descuento_por_etapa_mercado`

Descuento típico contra precio terminado, por etapa (dato de mercado Asunción 2026). Referencia para calibrar la matriz de plusvalía — no se consume directamente en las fórmulas del motor.

| Etapa | Descuento |
|---|---|
| `preventa_pozo_planos` | 20-30% |
| `en_construccion_obra_iniciada` | 10-20% |
| `terminado` | 0% |

## Vacancia por tipología — `vacancia_por_tipologia_pct`

Vacancia por clase de activo, validada con el Edificio Austria (mixto). El escalar `vacancia_pct` (3%) es el default de departamento; para oficinas/comercial/edificios mixtos, usar estos.

| Clase | Vacancia |
|---|---|
| `departamento` | 4.0% |
| `oficina` | 10.0% |
| `comercial` | 8.0% |

> UNRESOLVED: `calculadora.py` no lee esta tabla en ningún método — todas las evaluaciones de renta usan el escalar genérico `vacancia_pct` (3%), sin diferenciar por clase de activo. Ver `01-metodologia-calculo.md`.

## Regla de oro — `regla_neto_despues_de_todo`

`obligatorio: true`. El titular presentado al inversor es **siempre el neto**, después de vacancia, expensas no cubiertas, IVA, IRE y el 10% de administración de Meridiano. Nunca el bruto.

## Otros parámetros escalares

| Clave | Valor | Significado |
|---|---|---|
| `fondo_emergencia_expensas_pct` | 8.0 | Fondo de emergencia sobre expensas, en todo edificio administrado (Cartera A). No consumido por `calculadora.py` actualmente. |
| `uplift_remodelacion_objetivo_pct` | 40.0 | Uplift objetivo de renta por remodelación value-add. No consumido por `calculadora.py` actualmente — no existe un método de cálculo de escenario value-add en el motor. |

## Renta temporal default — `renta_temporal_default`

Supuestos para renta temporal / Airbnb. Ocupación **realista** 55-65% (nunca 90%+). Validado corrigiendo el Edificio Austria (que usaba 93%).

| Clave | Valor | Significado |
|---|---|---|
| `ocupacion_realista_pct` | [55.0, 65.0] | Rango de ocupación realista |
| `capex_amoblado_usd_por_depto` | 4500.0 | Capex de amoblado por unidad, en USD |
| `mix_largo_plazo_pct` | 40.0 | % recomendado de mix largo plazo |
| `mix_temporal_pct` | 60.0 | % recomendado de mix temporal |
| `ocupacion_underwriting_base_pct` | [55.0, 69.0] | Ocupación conservadora para underwriting (media de mercado) |
| `ocupacion_urbannit_gestionada_pct` | [76.0, 88.0] | Ocupación estabilizada bajo gestión Urbannit |

Nota de la fuente: 90%+ es solo un techo aspiracional, nunca una base de cálculo.

> UNRESOLVED: ninguno de estos parámetros de ocupación se usa en `evaluar_renta()` para la rama temporal — el motor no descuenta la brecha de ocupación del yield. Ver `01-metodologia-calculo.md` sección 4.1.

## Comisión de intermediación — `comision_intermediacion`

Marco completo de comisiones de intermediación de Meridiano. **Venta** la paga el vendedor; **alquiler** se financia 50% dueño + 50% inquilino. No se consume en `calculadora.py` (es un parámetro de negocio de intermediación, no de rentabilidad del inversor).

### `venta`

| Clave | Valor |
|---|---|
| `total_pct` | 5.5 |
| `la_paga` | "el vendedor" |
| `solo_comprador_pct` | 50.0 (de la comisión total) |
| `solo_comprador_efectivo_pct` | 2.75 |
| `propiedad_propia_mas_comprador_pct` | 100.0 |
| `propiedad_propia_mas_comprador_efectivo_pct` | 5.5 |

Regla: solo la punta compradora → 50% (2,75%). Propiedad en cartera de venta de Meridiano + comprador → 100% (5,5%).

### `alquiler`

| Clave | Valor |
|---|---|
| `total_meses` | 1.0 |
| `financiacion` | "50% dueño + 50% inquilino" |
| `un_rol_meses` | 0.5 |
| `administra_mas_inquilino_meses` | 1.0 |

Regla: comisión = 1 mes de alquiler, financiada 50% dueño + 50% inquilino. Un solo rol → 50% (0,5 mes). Meridiano administra la propiedad + aporta el inquilino → 100% (1 mes). En el cálculo del neto del inversor-propietario se descuenta **solo su parte** (0,5 mes = `honorarios_alquiler_meses` en `supuestos_operativos_default`), porque el inquilino paga la otra mitad. El mes completo es ingreso de Meridiano cuando tiene ambos roles.

## Escenarios obligatorios — `escenarios_obligatorios`

Antes de presentar a un inversor, correr 3 escenarios: **pesimista**, **base**, **optimista**.

## Categorías de gestión — `categorias_de_gestion`

El tipo de gestión define el honorario y el piso. No confundir renta pasiva con operación.

| Categoría | Honorario | Piso | Opex |
|---|---|---|---|
| `renta_pasiva_cartera_a` | 10% de la renta | Según tipología (comercial 8, depto s/muebles 6, amoblado 7,5) | Bajo — gestión de contratos de largo plazo |
| `renta_temporal_urbannit` | Canon de agencia temporal (Nivel 4) | Temporal depto 14 / temporal casa 12 | Medio — limpieza por turnover, channel manager, self check-in |
| `operacion_hotelera` | Honorarios de OPERADOR (a definir) — NO el 10% de administración | Debe superar el opex hotelero (40-55% de ingresos); típicamente exige mayor rendimiento bruto | Alto — personal, recepción 24h, limpieza diaria, OTAs, PMS |

Notas de la fuente:
- Un edificio entero puede operarse 100% Airbnb bajo Urbannit. Opex menor que un hotel (sin recepción diaria); capex de amoblado en todas las unidades (~USD 4.500/unidad).
- Hotel/apart-hotel operado = negocio operativo, no renta pasiva. El modelo de administración de renta (10%) no aplica; requiere estructura y honorarios de operador. Validado con el estudio Hotel Plaza Uruguaya (rendimiento operativo ~0-8%, muy por debajo del piso temporal).

## Pisos etiquetados bruto/neto — `pisos_base_bruto_o_neto`

Etiquetado de los pisos de rentabilidad (P07), agregado tras auditoría.

- `pisos_por_tipologia`: **BRUTO** — rendimiento bruto mínimo aceptable por clase de activo (comercial 8, casa 6, depto s/muebles 6, amoblado 7.5, temporal depto 14, temporal casa 12).
- `cartera_objetivo_10`: **NETO** — objetivo neto de cartera (10%).
- `renta_temporal`: bruto [10.0, 16.0] → neto [8.0, 11.0]. Temporal gestionada (Urbannit): Urbannit comunica el NETO al propietario.
- `tradicional`: neto [5.0, 7.0] — referencia de contraste para alquiler tradicional.

> UNRESOLVED: este bloque es la fuente directa de la contradicción documentada en `01-metodologia-calculo.md` sección 7 y en `02-politica-de-rentabilidad.md` refinamiento #10 — etiqueta como BRUTO exactamente los mismos números que `pisos_renta_neta` etiqueta (por nombre) como netos, y que el código compara contra el yield neto. Sin resolver.

---

## Requisitos para el dominio de tecnología

- Este archivo (o su equivalente estructurado) debe copiarse literalmente a la configuración de la app nueva; la calculadora de la app debe leer todos sus parámetros de mercado desde ahí, nunca hardcodeados en el código de la lógica.
- Antes de portar la lógica de cálculo, resolver explícitamente los `UNRESOLVED` de este documento — en particular la doble definición de `iva_pct` (10% vs. 5%, con el código usando 5%) y la contradicción bruto/neto de los pisos — porque de lo contrario la migración simplemente reproduce los mismos errores silenciosos en la nueva app.
- Si se corrige cualquiera de estos parámetros como parte de la migración (por ejemplo, decidir el IVA real o unificar la vacancia por tipología), la corrección debe registrarse como una decisión explícita (ver Fase 3, Decision Register) y no aplicarse silenciosamente.
