```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-rentabilidad/scripts/calculadora.py; inventory/_raw-copies/meridiano-rentabilidad/scripts/test_calculadora.py; inventory/_raw-copies/meridiano-rentabilidad/config/parametros_mercado.json
Dominio: TECHNOLOGY
```

# 02 — Motor de cálculo de rentabilidad: desglose técnico

## Qué es

Una **librería Python pura** (`scripts/calculadora.py`, 354 líneas), sin dependencias externas (solo `json`, `os`, `pathlib` de la stdlib), diseñada explícitamente para separar **lógica** (el `.py`, fija) de **parámetros de mercado** (`config/parametros_mercado.json`, editable). No es un servicio, no expone API HTTP, no tiene CLI real: **se usa importándola** desde otro proceso Python — hoy, en la práctica, desde la ejecución de la Claude Skill `meridiano-rentabilidad`.

## Requisitos de ejecución

- **Python**: no hay versión pinneada en ningún archivo. `test_calculadora.py` usa f-strings (`f"..."`), lo que fija un piso real de **Python 3.6+**. No hay `pyproject.toml`, `setup.py` ni `requirements.txt` en el directorio.
- **Dependencias**: ninguna de terceros. Solo `json`, `os`, `pathlib.Path` (stdlib). Esto significa que el motor puede correr en cualquier entorno Python moderno sin instalar nada.
- **Runnable standalone**: parcialmente.
  - `calculadora.py` tiene un bloque `if __name__ == "__main__":` (línea 352-353), pero solo imprime un mensaje informativo: `"Modulo calculadora. Importar la clase Calculadora. Ver tests/ para ejemplos."` — **no ejecuta ningún cálculo por sí solo**. No es un CLI funcional.
  - `test_calculadora.py` sí es completamente ejecutable de forma standalone: `python3 scripts/test_calculadora.py`, con salida por consola y `sys.exit(1)` si algo falla, `sys.exit(0)` si todo pasa. Este es el único "modo de uso directo" real del código hoy.
  - Para uso real de negocio, el patrón documentado (en `SKILL.md`) es:
    ```python
    import sys; sys.path.insert(0, "scripts")
    from calculadora import Calculadora
    calc = Calculadora()
    ```

## Funciones de nivel módulo (núcleo financiero)

| Función | Firma | Qué hace |
|---|---|---|
| `vpn` | `vpn(tasa_periodica, flujos)` | Valor presente neto de una lista de flujos, `flujo[0]` en `t=0`. `sum(f / (1+tasa)**i for i,f in enumerate(flujos))`. |
| `tir` | `tir(flujos, tol=1e-9, max_iter=500)` | TIR/IRR por **bisección robusta** (no Newton-Raphson). Retorna `None` si no hay flujos, o si todos son ≥0 o todos ≤0 (no hay cambio de signo). Busca intervalo `[-0.9999, 10.0]` y lo expande multiplicando `hi *= 1.5` hasta 200 intentos si no hay cambio de signo de VPN. Converge cuando `abs(v_mid) < tol` o agota `max_iter`. |
| `anualizar` | `anualizar(tasa_periodica, periodos_por_ano=12)` | Convierte tasa periódica a tasa anual efectiva: `(1+tasa)**periodos - 1`. Retorna `None` si `tasa_periodica is None`. |
| `cagr` | `cagr(valor_inicial, valor_final, meses)` | Retorno anual compuesto: `(valor_final/valor_inicial)**(1/anos) - 1`, con `anos = meses/12`. Retorna `None` si `valor_inicial <= 0` o `meses <= 0`. |
| `construir_cronograma` | `construir_cronograma(precio, entrega_inicial_pct, meses_obra, saldo_a_entrega_pct=0.0)` | Devuelve lista de pagos mensuales (positivos = lo que paga el inversor). Entrega inicial en mes 0, saldo en cuotas iguales sin interés durante la obra, balloon opcional a la entrega (mes `meses_obra`). |

## Clase `Calculadora`

`__init__(self, ruta_config=None)`: si no se pasa ruta, carga `config/parametros_mercado.json` relativo a la ubicación del propio archivo (`Path(__file__).resolve().parent.parent / "config" / "parametros_mercado.json"`) — es decir, asume la estructura de carpetas `scripts/` + `config/` como hermanas. Carga todo el JSON a `self.p`.

### `evaluar_renta(self, clase, precio_compra, renta_mensual_bruta, nivel_neto=3, gastos_reales=None)`

- `clase`: uno de `comercial | residencial_casa | departamento_sin_muebles | departamento_amoblado | temporal_departamento | temporal_casa`.
- `nivel_neto`: 1=básico, 2=administrado, 3=completo (temporal usa su propio stack, nivel efectivo 4 siempre).
- `gastos_reales`: dict opcional que sobreescribe (`s.update(gastos_reales)`) los defaults de `supuestos_operativos_default` — para evaluaciones "en firme" con datos reales del cliente.
- **Clave metodológica explícita en el docstring**: el yield se calcula **sobre el precio de compra real** pagado por el inversor, no sobre precio de lista.
- Construye un `desglose` línea por línea de gastos (expensas, impuesto inmobiliario, IVA siempre; luego según nivel: honorarios de administración/alquiler, seguro, mantenimiento, vacancia, amortización de muebles si amoblado; si es temporal, un stack propio de 6 líneas: limpieza, seguros obligatorios, mantenimiento, canon de agencia, amortización de muebles, vacancia).
- Calcula `neto_antes_renta = bruto_anual - gastos_pre_impuesto_renta`, luego `imp_renta = max(0, neto_antes_renta) * impuesto_renta_pct/100`, y `neto_anual = neto_antes_renta - imp_renta`.
- Compara `yield_neto_pct` contra `pisos_renta_neta[clase]` del config y devuelve `pasa_piso: bool | None`.
- Devuelve: `clase, precio_compra, renta_mensual, yield_bruto_pct, yield_neto_pct, nivel_neto, neto_anual, desglose_gastos, total_gastos, piso_pct, pasa_piso`.

### `evaluar_reventa(self, tipo_edificio, etapa_ingreso, salida, precio_entrada, meses_obra=None, entrega_inicial_pct=None, meses_hasta_pre_pozo=7)`

- `tipo_edificio`: `tradicional | torre`. `etapa_ingreso`: `pre_pozo | lanzamiento | pozo_durante_obra`. `salida`: `vende_al_terminar | vende_mas_un_ano`.
- Lee `plusvalia_pct` de `matriz_plusvalia_reventa[tipo_edificio][etapa_ingreso][salida]` en el config.
- Calcula horizonte en meses según etapa (pre_pozo: `meses_obra + meses_hasta_pre_pozo`; lanzamiento: `meses_obra`; pozo_durante_obra: `meses_obra // 2`), más 12 meses extra si `salida == "vende_mas_un_ano"`.
- Calcula **dos TIR**: `tir_precio_total_pct` (vía `cagr`, como si el inversor pagara todo el día 1) y `tir_capital_desembolsado_pct` (vía `tir()` sobre el flujo real de cuotas construido con `construir_cronograma`, anualizado con `anualizar`).
- Esto implementa literalmente la "regla de oro" documentada en `references/metodologia-calculo.md` §1: mostrar siempre las dos TIR juntas.

### `evaluar_reventa_temprana(self, precio_entrada, meses_obra, mes_cesion=None, apreciacion_pct=None, entrega_inicial_pct=None)`

- Modela la cesión de derechos (boleto) antes de terminar de pagar. Defaults desde `supuestos_reventa_temprana` del config (`mes_cesion_tipico`, `apreciacion_post_lanzamiento_pct`).
- `desembolsado` = suma de cuotas pagadas hasta el mes de cesión. `saldo_pendiente` = precio total - lo pagado. `cobra_cedente = valor_posicion - saldo_pendiente`. `ganancia = cobra_cedente - desembolsado`.
- TIR sobre el capital efectivamente desembolsado (no sobre el precio total).

### `piso_terreno(self)` / `piso_aporte(self)`

Simples getters de `pisos_capital.terreno_plusvalia_anual_min` y `pisos_capital.aporte_construccion_preferencial_anual` del config. No hay lógica de cálculo propia para terreno/aporte más allá de estos pisos de referencia — son valores de comparación, no un método de evaluación completo.

### `evaluar_retorno_combinado(self, clase, precio_compra, valor_actual, meses_tenencia, renta_mensual_bruta, nivel_neto=3)`

- Combina renta (llamando internamente a `evaluar_renta`) + plusvalía (`valor_actual` vs `precio_compra`, vía `cagr`) sobre el período de tenencia.
- `retorno_periodo_pct = (renta_neta_acumulada + apreciacion_abs) / precio_compra * 100`, anualizado con la fórmula compuesta estándar.
- `gap_vs_piso_pct = yield_neto_pct - piso_pct` de la clase.
- Usa `_leer_combinado` (staticmethod) para generar un veredicto textual en 3 ramas: (a) renta sola ya pasa el piso → "la plusvalía es upside adicional"; (b) renta no pasa pero plusvalía cubre la brecha → "inversión sólida por el momento de compra"; (c) ni renta ni plusvalía cubren → "depende de apreciación futura o suba de alquileres".

## Testing — `test_calculadora.py`

- **No usa ningún framework de testing** (no pytest, no unittest). Es un script imperativo: acumula fallos en una lista `fallos = []` y al final imprime y sale con código de proceso `1` (falla) o `0` (éxito).
- Helper `aprox(a, b, tol=0.15)` para comparaciones con tolerancia (por el método de bisección de `tir`, no hay igualdad exacta).
- **16 aserciones** (el mensaje final dice literalmente "OK — los 16 casos base pasan"), cubriendo:
  1. `tir()` + `anualizar()` sobre flujo −100→121 en 24 meses ≈10% anual.
  2. `cagr(100,125,24)` ≈ 11.8%.
  3. `cagr(100,140,48)` ≈ 8.78%.
  4-6. `evaluar_reventa` tradicional/pre_pozo/vende_al_terminar: plusvalía == 25.0, TIR precio total ≈9.0%, TIR capital desembolsado entre 13–17%.
  7-8. `evaluar_reventa_temprana`: ganancia == 8000.0, TIR capital desembolsado ≥40%.
  9-11. `evaluar_renta` departamento_amoblado: a 120k NO debe pasar el piso, a 75k SÍ debe pasar, yield bruto a 120k ≈9.5%.
  12. Torre 36 meses debe rendir más TIR anualizada que torre 48 meses (mismo % de plusvalía, distinto horizonte) — el "hallazgo" documentado en `metodologia-calculo.md` §2.
  13-16. `evaluar_retorno_combinado` (caso real "Habitalis 9A"): renta sola NO pasa el piso, plusvalía ≈21.21%, retorno combinado del período entre 25–29%, lectura debe contener "solida".
- **Cómo correrlo**: `python3 scripts/test_calculadora.py` desde el directorio `meridiano-rentabilidad/` (usa `sys.path.insert(0, os.path.dirname(__file__))` para poder importar `calculadora` sin instalación).
- No hay tests de casos límite explícitos (valores negativos, `precio_compra=0`, listas de flujos vacías más allá de lo que ya cubren los `None` guard-clauses del propio código) ni tests de la clase `residencial_casa`, `comercial`, `departamento_sin_muebles`, ni de `piso_terreno`/`piso_aporte`. Cobertura funcional fuerte en los casos de negocio documentados como referencia, pero no es cobertura exhaustiva de todas las combinaciones de parámetros.

## Config `parametros_mercado.json` — claves exactas relevantes

- `pisos_renta_neta`: `comercial=8.0, residencial_casa=6.0, departamento_sin_muebles=6.0, departamento_amoblado=7.5, temporal_departamento=14.0, temporal_casa=12.0`.
- `promedio_objetivo_cartera_neto`: `10.0`.
- `pisos_capital`: `terreno_plusvalia_anual_min=30.0, aporte_construccion_preferencial_anual=22.0`.
- `matriz_plusvalia_reventa.tradicional` (`_plazo_obra_meses_referencia=24`): pre_pozo 25/35, lanzamiento 23/33, pozo_durante_obra 20/30 (vende_al_terminar / vende_mas_un_ano).
- `matriz_plusvalia_reventa.torre` (`_plazo_obra_meses_referencia=42`): pre_pozo 45/50, lanzamiento 40/47, pozo_durante_obra 30/40.
- `supuestos_reventa_temprana`: `apreciacion_post_lanzamiento_pct=10.0, mes_cesion_tipico=6, apreciacion_rango_pct=[10.0,20.0]`.
- `cronograma_cuotas_default`: `entrega_inicial_pct=20.0, cuotas_sin_interes=true, saldo_a_entrega_pct=0.0`.
- `supuestos_operativos_default`: `expensas_pct=0.0, impuesto_inmobiliario_pct=4.0, vacancia_pct=3.0, mantenimiento_pct=5.0, seguro_pct=2.0, honorarios_administracion_pct=10.0, honorarios_alquiler_meses=0.5, amortizacion_muebles_pct=8.0, iva_pct=10.0, impuesto_renta_pct=10.0`.
- `fiscal`: `iva_pct=5.0 ("A CONFIRMAR CON CONTADORA"), impuesto_renta_pct=10.0, grava_ganancia_capital=false`.
- Config version: `"1.4"`, fecha `"2026-07-31"`, origen `"P07 + refinamientos validados (Habitalis 9A, Edificio Austria)"`.

## Hallazgo de inconsistencia — IVA duplicado con valores distintos

> UNRESOLVED (hallazgo técnico, alta prioridad): el archivo de configuración define el IVA en **dos lugares distintos con valores distintos**:
> - `supuestos_operativos_default.iva_pct = 10.0`, con nota explícita: `"Paraguay: IVA 10% (Ley 125/91) e IRE 10%. SIEMPRE aplicarlos — no dejarlos en 0 (error detectado en el modelo Edificio Austria)."`
> - `fiscal.iva_pct = 5.0`, con nota: `"IVA sobre la renta bruta. Verificar tratamiento real."` bajo el meta-comentario `"_nota": "A CONFIRMAR CON CONTADORA"`.
>
> El código de `evaluar_renta` (línea 143) construye `f = self.p["fiscal"]` y luego calcula `desglose["iva"] = bruto_anual * f["iva_pct"] / 100.0` (línea 143 del bloque "Nivel 1: siempre"). **Es decir, el motor usa el 5% no confirmado de `fiscal.iva_pct`, no el 10% que el propio config marca como "SIEMPRE aplicarlos".** Esto significa que todo `yield_neto_pct` calculado hoy podría estar sobreestimado si el 10% es el valor fiscal correcto — la línea de IVA en el desglose sale a la mitad de lo que la nota del propio archivo dice que debería ser.
> Se necesita: (a) que Meridiano confirme con su contadora cuál es el IVA real aplicable sobre renta de alquiler, y (b) que se unifique a una sola clave en el config (eliminar la duplicación `supuestos_operativos_default.iva_pct` vs `fiscal.iva_pct`) para que este tipo de bug de "dos fuentes de verdad" no pueda volver a ocurrir.

## Comparación con la metodología documentada (`references/metodologia-calculo.md`)

El código coincide fielmente con la metodología descrita en el documento hermano: las dos TIR (precio total vs capital desembolsado), el plazo de obra como variable no como banda fija, el yield sobre precio de compra real, los cuatro niveles de neto acumulativos, y la aritmética de la cesión temprana. No se detectaron discrepancias entre el código y `metodologia-calculo.md` más allá del hallazgo de IVA arriba (que es una inconsistencia **interna al config**, no entre el código y la metodología).

> UNRESOLVED: no fue posible comparar contra `knowledge-base/investment/01-metodologia-calculo.md` porque ese archivo no existía todavía en el repo al momento de escribir este documento (el directorio `knowledge-base/investment/` estaba vacío). Se recomienda que quien complete ese documento (dominio INVESTMENT) revise este archivo (`02-calculadora-rentabilidad.md`) y `references/metodologia-calculo.md` original para confirmar que no haya discrepancias de fórmulas entre lo documentado en el dominio de negocio y lo efectivamente implementado en código.

## Veredicto de estado

El motor de cálculo es **código correcto, testeado y confiable dentro de los casos que cubre su suite de tests**, con una separación lógica/parámetros bien diseñada. No es hoy una aplicación: es una librería sin interfaz (ni CLI real, ni API, ni UI). El único bug real detectado es la inconsistencia de IVA en el config (no en la lógica del código, que simplemente lee lo que el JSON le da). Es un candidato directo para envolver en una API y/o UI — ver `03-arquitectura-propuesta.md`.
