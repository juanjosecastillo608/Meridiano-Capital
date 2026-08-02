```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-rentabilidad/SKILL.md
Dominio: INVESTMENT
```

# Meridiano Rentabilidad — Motor de cálculo de rentabilidad inmobiliaria

## Qué es

El motor financiero que aplica la **Política de Rentabilidad Objetivo (P07)** de Meridiano Capital. Convierte el criterio de inversión de la empresa en cálculos exactos y reproducibles para evaluar operaciones inmobiliarias en Asunción: renta (tradicional o temporal), compra en pozo, reventa, reventa temprana por cesión de derechos, aporte de construcción o terreno.

Es, en palabras de la fuente original, **"el corazón financiero del negocio"**: no se improvisan números de rentabilidad. Toda cifra debe salir de este motor, con metodología fija y parámetros de mercado versionados en configuración.

## Principio rector

**No improvisar números de rentabilidad.** Un número inventado o mal calculado le cuesta una venta —o la confianza— a Meridiano Capital.

## Arquitectura — separación estricta

Esta separación es el principio de diseño más importante del sistema:

```
config/parametros_mercado.json   ← VARIABLES de mercado. Se editan cuando el mercado cambia.
scripts/calculadora.py           ← LÓGICA de cálculo. NO se toca al cambiar el mercado.
references/                      ← La política completa y la metodología.
```

Cuando el mercado cambia (suben los pisos, cambia el descuento de pozo, cambia una estructura de cuotas), **se edita únicamente el archivo de configuración**. La lógica de cálculo nunca cambia. Esta separación es lo que permite adaptarse sin romper nada.

> UNRESOLVED: el código fuente (`calculadora.py`) no respeta esta separación en al menos dos puntos: (1) el costo de limpieza para renta temporal está hardcodeado como `12.0` dentro de la lógica en vez de leerse de un parámetro de configuración; (2) el default `meses_hasta_pre_pozo=7` de `evaluar_reventa` vive como default de función en el código, no en `parametros_mercado.json`. Ver `01-metodologia-calculo.md` para el detalle completo y las implicancias.

## Los cuatro documentos de este dominio

| Documento | Contenido |
|---|---|
| `01-metodologia-calculo.md` | Cómo y por qué se calcula cada número: doble TIR, plazo de obra como variable, yield sobre precio real, niveles de neto, reventa temprana, auditoría del motor — y los hallazgos de discrepancia doc/código detectados al comparar contra `calculadora.py`. |
| `02-politica-de-rentabilidad.md` | La Política de Rentabilidad Objetivo P07 completa: concepto de retorno combinado, pisos por clase de activo, niveles de neto, tratamiento fiscal, matriz de plusvalía, las tres estrategias de salida, y los diez refinamientos validados con casos reales. |
| `03-parametros-de-mercado.md` | Documentación legible de `config/parametros_mercado.json` — qué significa cada parámetro, su valor actual, y su rol como config viva que debe mantenerse sincronizada con la app. |

## Reglas de presentación — no negociables

1. **Renta:** mostrar siempre yield **bruto Y neto**, juntos.
2. **Capital** (pozo, reventa, terreno): mostrar siempre plusvalía total + **TIR sobre precio total** + **TIR sobre capital desembolsado**, las tres juntas.
3. El yield de renta se calcula **sobre el precio de compra real** del inversor, no sobre precio de lista.
4. Nunca mostrar un número sin su par. Es lo que protege al inversor y distingue a Meridiano del que vende humo.

## Los pisos — resumen ejecutivo

- **Renta tradicional** (Neto Completo): comercial 8% · casa 6% · depto s/muebles 6% · depto amoblado 7,5%
- **Renta temporal** (Neto Temporal): departamento 14% · casa 12%
- **Terreno:** 30% anualizado · **Aporte de construcción:** 22% preferencial anual

Si una operación no supera el piso de su clase/etapa, la señal es **no recomendarla** —por más atractivo que suene el número absoluto—. Para capital, el piso se evalúa contra la **TIR anualizada**, no contra la plusvalía total: un número grande sobre un horizonte largo puede rendir menos por año que uno chico.

> UNRESOLVED: existe una contradicción interna en el material fuente sobre si estos pisos son BRUTOS o NETOS. Ver la sección "Contradicción crítica: ¿los pisos son bruto o neto?" en `01-metodologia-calculo.md` — afecta el veredicto `pasa_piso` de cada evaluación de renta que produce el motor.

## Regla final sobre datos reales del cliente

Los parámetros del config son la fuente de verdad de los números de mercado. Si el usuario da un número real distinto (un descuento de pozo real, una estructura de cuotas concreta, un gasto real), usar ese número para el cálculo puntual y ofrecer actualizarlo en el config si es un cambio permanente de mercado.

## Requisitos que este dominio impone a otros dominios

Ver el cierre de cada uno de los tres documentos siguientes para el detalle. En resumen:

- **Sobre el dominio de negocio (business / investor journey):** cualquier término, umbral o cifra de rentabilidad comunicado al inversor (pisos, niveles de neto, TIR, plusvalía) debe coincidir exactamente con lo definido aquí — no se puede simplificar ni redondear en la comunicación comercial sin que dejen de ser "los números de Meridiano".
- **Sobre el dominio de tecnología (technology / calculadora):** la calculadora de la app nueva debe implementar exactamente esta metodología (fórmulas, niveles de neto, doble TIR, matriz de plusvalía) leyendo los parámetros desde configuración — nunca hardcodeando valores de mercado en la lógica — y debe resolver los mismos `UNRESOLVED` marcados aquí antes de considerarse una migración fiel del motor original.
