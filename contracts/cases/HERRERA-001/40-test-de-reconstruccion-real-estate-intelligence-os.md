Estado: CURRENT — Fase 13 del prompt maestro Real Estate Intelligence OS (§35-36), 2026-08-17
Fuente original: ejecución del test de reconstrucción pedido por el founder
Dominio: INVESTMENT (caso HERRERA-001) — resultado también documentado en `documentation/real-estate-os/00-...md`

# Test de reconstrucción — HERRERA-001 vs. Real Estate Intelligence OS

## Qué se probó

Re-derivar las conclusiones numéricas clave de `HERRERA-001` (costo de construcción, validación de precio de venta, consulta de mercado) usando **exclusivamente** las bases, metodologías y Skills nuevas del Real Estate Intelligence OS — sin releer el razonamiento de los archivos de caso — y comparar contra el resultado original ya publicado.

## 1. Costo de construcción — `construction-cost-engine` (SK-12) vs. `36-recosteo-720-...md`

Se corrió el motor de costos por separado para cada componente real del proyecto (terminación sobre estructura existente + obra 100% nueva, para los dos envolventes de 6 y 7 pisos):

```bash
python skills/construction-cost-engine/estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 2286.93 --incidencia-estructural 21
python skills/construction-cost-engine/estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 826.10
python skills/construction-cost-engine/estimar.py --tipo "Edificios departamentos en altura" --calidad Estandar --superficie 1126.10
```

| | Original (`36-...md`) | Reconstruido (SK-12) | ¿Coincide? |
|---|---|---|---|
| Terminación sobre estructura existente (2.286,93 m²) | USD 1.303.869,10 | **USD 1.300.805,78** | ❌ **No coincidía** — ver hallazgo abajo |
| Obra nueva, 6 pisos (826,10 m²) | USD 594.792,00 | USD 594.792,00 | ✅ |
| Obra nueva, 7 pisos (1.126,10 m²) | USD 810.792,00 | USD 810.792,00 | ✅ |
| **Costo de construcción, envolvente 6 pisos** | USD 1.895.597,78 | **USD 1.895.597,78** | ✅ |
| **Costo de construcción, envolvente 7 pisos** | USD 2.111.597,78 | **USD 2.111.597,78** | ✅ |

### Hallazgo — corregido en `36-...md`

La fila intermedia "Terminación sobre estructura existente" del archivo original tenía un **error de tipeo**: USD 1.303.869,10 en vez de USD 1.300.805,78 (2.286,93 × USD 720 × 0,79), una diferencia de USD 3.063,32. **No se propagó a ningún número final** — los dos totales de "Costo de construcción, envolvente" ya usaban internamente el valor correcto, así que la Inversión Total, el margen y el ROI de `36-...md` §1.2 y §3 son todos correctos tal cual estaban publicados. Era un error de visualización en una fila puntual, no de cálculo. **Corregido directamente en `36-...md`** al encontrarlo, con nota explicando el hallazgo.

### Qué queda fuera del alcance de esta reconstrucción (correctamente)

`construction-cost-engine` solo reconstruye el **costo de construcción**. La Inversión Total completa de cada Ángulo (`36-...md` §1.2) suma además Adquisición (USD 850.000), Proyecto (USD 90/m² × superficie total) y Aprobaciones/imprevistos (USD 101.173,48) — estos son costos específicos de la operación de Herrera (Project Data), no Market Intelligence, y correctamente **no** están en el motor de costos cross-cutting. La reconstrucción cubre exactamente lo que debía cubrir, ni más ni menos.

## 2. Validación de precio de venta — `market-price-validation` (SK-13) vs. `37-...md`/`38-...md`

```bash
python skills/market-price-validation/validar.py --barrio "Ycua Sati" --precio-m2 1950
python skills/market-price-validation/validar.py --barrio "Sati" --precio-m2 2050
```

| | Original (`37-...md` §2, análisis manual) | Reconstruido (SK-13) | ¿Coincide? |
|---|---|---|---|
| Comparables usados | 7 relevados, 1 outlier (3-dorm. piso alto, USD 2.212/m²) excluido a mano | 7 relevados, **mismo outlier excluido automáticamente vía IQR** | ✅ |
| Rango de mercado | USD 1.576 – 1.809/m² | USD 1.576 – 1.809/m² | ✅ |
| Precio USD 1.900/m² (piso de la política) | "por encima del rango, diferenciación de producto" (prosa, sin clasificación formal) | **ABOVE MARKET**, +7,8% sobre el techo | ✅ consistente |
| Precio USD 2.050/m² (techo de la política) | ídem | **ABOVE MARKET**, +13,3% sobre el techo | ✅ consistente, dentro del umbral provisional de 15% |

El motor automático llegó exactamente a la misma exclusión de outlier y a la misma conclusión cualitativa (ABOVE MARKET, no SIGNIFICANTLY ABOVE) que el análisis manual de `37-...md`/`38-...md` — sin haber leído esos archivos, solo con los datos crudos de `market-intelligence/comparables/`.

## 3. Consulta unificada — `market-intelligence-lookup` (SK-11) vs. el data room disperso del caso

```bash
python skills/market-intelligence-lookup/consultar.py --barrio "Herrera"
```

Devolvió, en una sola consulta, **16 registros con dato real** de Barrio Herrera repartidos entre las 5 bases (4 alquiler, 2 Airbnb, 7 venta, 2 comparables, 1 categoría de zona) — el mismo conjunto de datos que hasta ahora solo se podía recomponer leyendo manualmente `17-...md`, `21-...md`, `32-...md`, `37-...md`, `39-...md` y el `00-data-room-index.md`. Confirma que el objetivo del §36 del prompt maestro (tomar un edificio nuevo y obtener datos ya acumulados sin reconstruir manualmente el trabajo de Herrera) funciona en la práctica, al menos para lo que ya está cargado.

## Conclusión del test

**El sistema pasa el test de reconstrucción** con una salvedad y un hallazgo real:

- **Salvedad de alcance**: el sistema reconstruye correctamente Market Intelligence (costos, comparables, precios) — no reconstruye ni debería reconstruir Project Data específico de la operación (Adquisición, Proyecto, Aprobaciones, cronograma de caja, vehículo legal), que sigue viviendo exclusivamente en `contracts/cases/HERRERA-001/`.
- **Hallazgo real**: un error de tipeo de USD 3.063,32 en una fila intermedia de `36-...md`, sin impacto en ningún número final, encontrado y corregido gracias a este mismo test — evidencia directa de que la reconstrucción independiente aporta valor real de verificación, no es solo un ejercicio formal.
