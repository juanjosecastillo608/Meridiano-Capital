Estado: D-033 (mecanismo) CURRENT · matriz de valores PROPOSED (P-004), incompleta
Fuente original: C:\Users\Usuario\OneDrive\Escritorio\111\MERIDIANO CAPITAL + DESARROLLADORA INMOB\Tabla Rentabilidad Alquiler Mono y 1 Dormitorio.xlsx (planilla real del usuario, no del paquete de recuperación)
Dominio: INVESTMENT
Incorporado: 2026-08-09

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

## Estructura propuesta de la matriz completa `[PROPOSED — P-004, incompleta]`

```
piso_bruto[tipo_operación][clase][zona][calidad] → rango (mínimo aceptable, techo de referencia)

tipo_operación: tradicional | temporal
clase:          comercial | monoambiente | 1_dormitorio | 2_dormitorio | casa | ...
zona:           Eje Corporativo | [pendiente: resto de zonas de Asunción]
calidad:        [pendiente: criterio de calidad — ¿antigüedad? ¿amenities? ¿categoría de edificio?]
```

**Por qué no se completa todavía**: el founder mencionó una segunda planilla ("Alquileres Amoblados Tradicionales") que no llegó adjunta a este mensaje — solo se recibió la de Mono/1 Dormitorio de la zona Eje Corporativo. Completar la matriz con una sola zona y sin definir el criterio de "calidad" sería inventar las demás celdas — exactamente lo que `ai/07-protocolo-analista-de-inversion.md` prohíbe (nunca inventar un dato faltante).

**Lo que hace falta para cerrar P-004**:
1. La planilla de Alquileres Amoblados Tradicionales (mencionada, no recibida).
2. Datos equivalentes para las otras zonas donde Meridiano opera (ver el portfolio real en `business/06-estructura-societaria-y-portfolio.md` — Jumacabe, WICA, Quintero, Canarias y ARL están en zonas distintas a Eje Corporativo: Villa Morra, Recoleta, Los Laureles, etc.).
3. Un criterio explícito de "calidad" (¿categoría de edificio, antigüedad, amenities?) — todavía no definido por el founder.
4. Los rangos equivalentes para **comercial** (hoy solo hay dato de residencial/monoambiente-1dormitorio) y para **temporal** (hoy la matriz de `renta_temporal_default` sigue en neto, pendiente de rehacerse en bruto).

## Estado de la implementación en el motor de cálculo

`production/app/backend/calculadora.py`, función `evaluar_renta()`: el veredicto `pasa_piso` ahora compara **`yield_bruto_pct`** contra `pisos_renta_neta[clase]` (antes comparaba el neto) — ver commit de esta fecha. **Los valores numéricos del piso (comercial 8, casa 6, amoblado 7,5, etc.) NO se recalibraron todavía** — son los mismos números que antes, que fueron pensados/calibrados en un contexto de comparación neta. Con la comparación ahora en bruto, es esperable que **casi todas las evaluaciones "pasen el piso"** hasta que la matriz real (P-004) reemplace estos valores — la API ya devuelve una advertencia explícita sobre esto en cada respuesta (ver `production/app/backend/advertencias.py`).

**No usar el veredicto `pasa_piso` actual para decisiones reales** hasta que P-004 esté completo — solo sirve hoy para verificar que el mecanismo (bruto vs. bruto) funciona técnicamente.

## Techos (nuevo concepto, sin implementar)

D-033 introduce por primera vez el concepto de **techo** (además del piso) — un yield bruto demasiado alto para ser realista puede señalar un error de dato (precio de lista mal cargado, alquiler de mercado sobreestimado) en vez de una oportunidad genuina. **No existe ningún código ni parámetro de techo todavía** — es P-004 también, a definir junto con los pisos.
