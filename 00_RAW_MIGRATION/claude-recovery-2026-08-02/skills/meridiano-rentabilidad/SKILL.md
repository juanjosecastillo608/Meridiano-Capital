---
name: meridiano-rentabilidad
description: Motor de calculo de rentabilidad inmobiliaria de Meridiano Capital. Usar SIEMPRE que se evalue una inversion inmobiliaria en Asuncion — renta (tradicional o temporal), compra en pozo, reventa, reventa temprana por cesion de derechos, aporte de construccion o terreno. Usar cuando se pida rentabilidad, TIR, plusvalia, si una operacion pasa el piso, comparar etapas de ingreso al pozo, o presentar numeros a un inversor. Aplica la Politica de Rentabilidad Objetivo P07, con pisos por clase de activo, cuatro niveles de neto, matriz de plusvalia por etapa, y doble TIR sobre precio total y sobre capital desembolsado. Es el corazon financiero del negocio, no improvisar numeros, usar esta skill.
---

# Meridiano Rentabilidad

Motor financiero que aplica la Política de Rentabilidad Objetivo (P07) de Meridiano Capital. Convierte el criterio de inversión en cálculos exactos y reproducibles.

## Principio rector

**No improvisar números de rentabilidad.** Toda cifra sale de este motor, con la metodología fija y los parámetros de mercado del archivo de configuración. Un número inventado o mal calculado le cuesta una venta —o la confianza— a Meridiano Capital.

## Arquitectura — separación estricta

```
config/parametros_mercado.json   ← VARIABLES de mercado. Se editan cuando el mercado cambia.
scripts/calculadora.py           ← LOGICA de calculo. NO se toca al cambiar el mercado.
references/                      ← La politica completa y la metodologia.
```

Cuando el mercado cambia (suben los pisos, cambia el descuento de pozo, cambia una estructura de cuotas), **se edita únicamente `config/parametros_mercado.json`**. La lógica de cálculo nunca cambia. Esta separación es lo que permite adaptarse sin romper nada.

## Reglas de presentación — no negociables

1. **Renta:** mostrar siempre yield **bruto Y neto**, juntos.
2. **Capital (pozo, reventa, terreno):** mostrar siempre plusvalía total + **TIR sobre precio total** + **TIR sobre capital desembolsado**, las tres juntas.
3. El yield de renta se calcula **sobre el precio de compra real** del inversor, no sobre precio de lista.
4. Nunca mostrar un número sin su par. Es lo que protege al inversor y distingue a Meridiano del que vende humo.

## Cómo usar el motor

Para cualquier cálculo, ejecutar la calculadora en Python:

```python
import sys; sys.path.insert(0, "scripts")
from calculadora import Calculadora
calc = Calculadora()   # carga config/parametros_mercado.json
```

### Evaluar RENTA

```python
r = calc.evaluar_renta(
        clase="departamento_amoblado",   # comercial | residencial_casa |
                                          # departamento_sin_muebles | departamento_amoblado |
                                          # temporal_departamento | temporal_casa
        precio_compra=75000,             # PRECIO DE COMPRA REAL, no lista
        renta_mensual_bruta=950,
        nivel_neto=3)                    # 1 basico | 2 administrado | 3 completo
# Devuelve yield bruto y neto, desglose linea por linea, piso, y si pasa.
```

Para evaluaciones en firme, pasar los gastos reales del cliente:
```python
r = calc.evaluar_renta(..., gastos_reales={"vacancia_pct": 2, "mantenimiento_pct": 4})
```

### Evaluar REVENTA (venta con unidad terminada)

```python
r = calc.evaluar_reventa(
        tipo_edificio="tradicional",     # tradicional | torre
        etapa_ingreso="pre_pozo",        # pre_pozo | lanzamiento | pozo_durante_obra
        salida="vende_al_terminar",      # vende_al_terminar | vende_mas_un_ano
        precio_entrada=80000,
        meses_obra=24,                   # VARIABLE — calcula caso por caso
        entrega_inicial_pct=20)          # % de entrega; el resto en cuotas
# Devuelve plusvalia total, TIR sobre precio total, TIR sobre capital desembolsado.
```

### Evaluar REVENTA TEMPRANA (cesión de derechos)

```python
r = calc.evaluar_reventa_temprana(
        precio_entrada=80000,
        meses_obra=24,
        mes_cesion=6,                    # cuando cede el boleto
        apreciacion_pct=10,              # apreciacion de la posicion a esa fecha
        entrega_inicial_pct=20)
# Devuelve ganancia, capital desembolsado, y TIR (alta) sobre ese capital.
```

Advertir siempre los riesgos de la reventa temprana: requiere edificio exitoso con demanda de cesión, que la apreciación ocurra, que el contrato permita ceder, y verificar el tratamiento fiscal (ver `references/politica-completa.md`).

### Las tres estrategias de salida

Para una compra en pozo, calcular y presentar las tres salidas lado a lado (reventa temprana / vende al terminar / renta + vende a +1 año) y explicar para qué perfil de inversor es cada una. Ver `references/politica-completa.md` sección 4.7.

### Evaluar RETORNO COMBINADO (renta + plusvalía) — el momento de compra

El concepto más importante para activos ya comprados: a precio de lista, la renta sola casi nunca llega al piso. El inversor que compró bien (en pozo) usa la **plusvalía para cubrir la brecha de renta**, y con el tiempo, si el alquiler sube, el yield sobre su costo original también sube.

```python
r = calc.evaluar_retorno_combinado(
        clase="departamento_amoblado",
        precio_compra=99000,     # costo real (pozo + muebles)
        valor_actual=120000,     # valor de venta hoy
        meses_tenencia=12,
        renta_mensual_bruta=950,
        nivel_neto=3)
# Devuelve: yield de renta vs piso, plusvalia total y anualizada,
# retorno combinado del periodo, y una lectura del veredicto.
```

**Regla de interpretación:** si la renta sola no llega al piso pero la plusvalía cubre la diferencia, la operación es sólida — no rechazarla por mirar solo la renta. Ejemplo real (Habitalis Mburucuyá): renta 5,87% neto (piso 7,5%, no llega sola) + plusvalía 21% = retorno combinado 27% en el año. Inversión sólida por el momento de compra.

## Los pisos (resumen — detalle en config y política)

- **Renta tradicional** (Neto Completo): comercial 8% · casa 6% · depto s/muebles 6% · depto amoblado 7,5%
- **Renta temporal** (Neto Temporal): departamento 14% · casa 12%
- **Terreno:** 30% anualizado · **Aporte de construcción:** 22% preferencial anual

Si una operación no supera el piso de su clase/etapa, la señal es no recomendarla —por más atractivo que suene el número absoluto—. Para capital, evaluar el piso contra la **TIR anualizada**, no contra la plusvalía total: un número grande sobre un horizonte largo puede rendir menos por año que uno chico.

## Cuándo leer las referencias

- `references/politica-completa.md` — la política P07 entera (las 4 estrategias de salida, la lógica de cada piso, los niveles de neto, la matriz completa). Leer cuando haga falta el fundamento o un caso no cubierto arriba.
- `references/metodologia-calculo.md` — cómo funciona la doble TIR y por qué. Leer cuando haya que explicarle el cálculo a un inversor o auditar un resultado.

## Regla final

Los parámetros del config son la fuente de verdad de los números de mercado. Si el usuario da un número real distinto (un descuento de pozo real, una estructura de cuotas concreta, un gasto real), usar ese número para el cálculo puntual y ofrecer actualizarlo en el config si es un cambio permanente de mercado.
