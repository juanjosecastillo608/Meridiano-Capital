Estado: D-033 (mecanismo) CURRENT · D-044 (valores generales por clase) CURRENT · matriz por zona/calidad (P-004) sigue PROPOSED, incompleta
Fuente original: Tabla Rentabilidad Alquiler Mono y 1 Dormitorio.xlsx (2026-08-09) + Tabla de Rentabilidades Alquiler.xlsx (2026-08-10), ambas planillas reales del founder
Dominio: INVESTMENT
Incorporado: 2026-08-09, actualizado 2026-08-10

# Matriz de pisos y techos de rentabilidad — siempre en BRUTO

## Decisión de fondo (D-033, CURRENT)

Confirmado por el founder el 2026-08-09: **tanto los pisos como los techos de rentabilidad se miden siempre en BRUTO**, nunca en neto. La matriz debe distinguir, como mínimo:

1. **Comercial vs. Residencial** — pisos/techos distintos.
2. **Alquiler Tradicional vs. Temporal** — pisos/techos distintos (ya existía esta distinción parcialmente en `pisos_base_bruto_o_neto.renta_temporal` vs `.tradicional`, pero etiquetada en neto — hay que rehacerla en bruto).
3. **Rangos de precio según zona y calidad** — el mismo yield bruto significa cosas distintas según la zona (una zona premium justifica un piso más bajo por menor riesgo/mayor liquidez; una zona periférica necesita un piso más alto para compensar mayor riesgo).

**Lo que esto reemplaza**: el esquema actual de `pisos_renta_neta` en `production/app/config/parametros_mercado.json` es **un solo número por clase de activo** (comercial 8, casa 6, depto s/muebles 6, amoblado 7,5, temporal depto 14, temporal casa 12), sin distinguir zona ni calidad. Bajo la decisión de D-033 ese esquema queda obsoleto en su forma actual — ver "Estado de la implementación" más abajo.

## Dato real #1 — zona Eje Corporativo, amoblado, monoambiente y 1 dormitorio

Única planilla recibida hasta ahora con datos reales de mercado por zona. Rentabilidad **bruta** anual = alquiler mensual × 12 / precio de compra. Alquileres son **valores finales, IVA y expensas incluidas** (dato de mercado observado, no supuesto de underwriting).

| Precio compra (USD) | Mono 650 | Mono 700 | Mono 750 | 1D 800 | 1D 850 | 1D 900 | 1D 950 |
|---|---|---|---|---|---|---|---|
| 90.000 | 8,67% | 9,33% | 10,00% | 10,67% | 11,33% | 12,00% | 12,67% |
| 95.000 | 8,21% | 8,84% | 9,47% | 10,11% | 10,74% | 11,37% | 12,00% |
| 100.000 | 7,80% | 8,40% | 9,00% | 9,60% | 10,20% | 10,80% | 11,40% |
| 105.000 | 7,43% | 8,00% | 8,57% | 9,14% | 9,71% | 10,29% | 10,86% |
| 110.000 | 7,09% | 7,64% | 8,18% | 8,73% | 9,27% | 9,82% | 10,36% |
| 115.000 | 6,78% | 7,30% | 7,83% | 8,35% | 8,87% | 9,39% | 9,91% |
| 120.000 | 6,50% | 7,00% | 7,50% | 8,00% | 8,50% | 9,00% | 9,50% |
| 125.000 | 6,24% | 6,72% | 7,20% | 7,68% | 8,16% | 8,64% | 9,12% |
| 130.000 | 6,00% | 6,46% | 6,92% | 7,38% | 7,85% | 8,31% | 8,77% |

**Lectura**: en esta zona, un monoambiente amoblado con alquiler de mercado típico ronda 6-10% bruto según el precio de entrada; un 1 dormitorio con cochera ronda 7,4-12,7% bruto. Esto ya es un dato mucho más granular que un solo número "piso 7,5" para toda la clase "departamento amoblado".

## Dato real #2 (D-044, 2026-08-10) — pisos generales por clase, Asunción, bruto Y neto

Segunda planilla real del founder (`Tabla de Rentabilidades Alquiler.xlsx`), sin desagregar por zona pero con las **7 clases más granulares** que existían hasta ahora, y por primera vez con el piso **neto** explícito junto al bruto (no solo un mecanismo de comparación).

| Clase | Piso Bruto | Piso Neto |
|---|---|---|
| Tinglados / Depósitos | 9% | 7% |
| Locales Comerciales | 10% | 8% |
| Casas Tradicional — Sin Muebles | 7% | 5% |
| Casas Tradicional — Con Muebles | 11% | 8% |
| Departamento Tradicional — Sin Muebles | 8% | 5% |
| Departamento Tradicional — Con Muebles | 10% | 7% |
| Departamentos AIRBNB | 15% | 12% |

**Esto reemplaza los valores (no el mecanismo) de `pisos_renta_neta`** en `production/app/config/parametros_mercado.json` — ver "Estado de la implementación" más abajo. La clave del config sigue llamándose `pisos_renta_neta` por compatibilidad con el código existente, pero desde D-044 sus valores son los **brutos** de esta tabla (no una estimación neta desactualizada).

**Cerrado (D-045, 2026-08-10)**: la planilla no traía "Casas AIRBNB", pero el founder confirmó que el piso es el mismo que "Departamentos AIRBNB" — **15% bruto / 12% neto**, sin diferenciación casa/depto en renta temporal. `temporal_casa` en el config quedó actualizado de 12.0 a 15.0.

**También D-045**: el IVA de renta temporal/Airbnb (Urbannit) es **10%**, no el 5% residencial que se aplicaba antes por inferencia `[EXTENSION]` sin confirmar — ver `03-parametros-de-mercado.md`, bloque `fiscal.iva_alquiler_temporal_pct`.

**Las 3 clasificaciones que el founder confirmó** (2026-08-10) como estructura de la matriz — Tradicional / Amoblado / Airbnb — se reflejan en esta tabla como "Sin Muebles" (Tradicional), "Con Muebles" (Amoblado) y "AIRBNB" respectivamente, tanto para casa como para departamento.

## Estructura propuesta de la matriz completa `[PROPOSED — P-004, incompleta]`

```
piso_bruto[tipo_operación][clase][zona][calidad] → rango (mínimo aceptable, techo de referencia)

tipo_operación: tradicional | temporal
clase:          comercial | monoambiente | 1_dormitorio | 2_dormitorio | casa | ...
zona:           Eje Corporativo | [pendiente: resto de zonas de Asunción]
calidad:        [pendiente: criterio de calidad — ¿antigüedad? ¿amenities? ¿categoría de edificio?]
```

**Por qué no se completa todavía**: el founder mencionó una segunda planilla ("Alquileres Amoblados Tradicionales") que no llegó adjunta a este mensaje — solo se recibió la de Mono/1 Dormitorio de la zona Eje Corporativo. Completar la matriz con una sola zona y sin definir el criterio de "calidad" sería inventar las demás celdas — exactamente lo que `ai/07-protocolo-analista-de-inversion.md` prohíbe (nunca inventar un dato faltante).

**Estado final de P-004 (2026-08-10, decisión explícita del founder)**:
1. ~~Los pisos generales por clase (comercial, casa, depto, Airbnb)~~ — ✅ **cerrado** (D-044 + D-045). Las 6 clases del motor de cálculo tienen piso confirmado, sin gaps.
2. **Datos por zona y criterio de calidad — PENDIENTE, sin trabajo activo por decisión explícita del founder** (2026-08-10): "vamos a dejar anotado todo como pendiente la matriz de pisos por zona/calidad". No se sigue investigando este eje hasta que llegue nuevo dato o el founder lo retome — no es un bloqueante, es una decisión consciente de alcance. Sigue disponible el Dato real #1 (Eje Corporativo, desagregado por precio) como única referencia de zona.
3. Techos — sin dato todavía, ni real ni estimado, mismo estado que los pisos por zona (pendiente, sin trabajo activo).

## Estado de la implementación en el motor de cálculo

`production/app/backend/calculadora.py`, función `evaluar_renta()`: el veredicto `pasa_piso` compara **`yield_bruto_pct`** contra `pisos_renta_neta[clase]`. **Actualizado 2026-08-10 (D-044/D-045)**: las 6 clases del motor tienen piso confirmado por el founder — `comercial` (10), `residencial_casa` (7), `departamento_sin_muebles` (8), `departamento_amoblado` (10), `temporal_departamento` (15) y `temporal_casa` (15, igual a temporal_departamento). El config también guarda la tabla completa de 8 clases (bruto y neto, incluye "casas_airbnb") bajo `_pisos_reales_2026_08_10_bruto_y_neto`, para cuando el motor extienda su taxonomía de `clase` a distinguir casa sin/con muebles y comercial en sus dos subtipos (tinglados/depósitos vs. locales).

**`pasa_piso` ya es confiable para las 6 clases del motor.** Lo único que falta —deliberadamente pendiente, sin trabajo activo (ver arriba)— es la dimensión de zona/calidad: un mismo piso "comercial 10%" no distingue todavía entre una zona premium y una periférica.

## Techos (nuevo concepto, sin implementar)

D-033 introduce por primera vez el concepto de **techo** (además del piso) — un yield bruto demasiado alto para ser realista puede señalar un error de dato (precio de lista mal cargado, alquiler de mercado sobreestimado) en vez de una oportunidad genuina. **No existe ningún código ni parámetro de techo todavía** — es P-004 también, a definir junto con los pisos.
