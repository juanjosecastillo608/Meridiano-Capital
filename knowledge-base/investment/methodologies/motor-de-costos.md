Estado: CURRENT — primera versión, 2026-08-17 (Real Estate Intelligence OS, §8 del prompt maestro)
Fuente original: combina `market-intelligence/construction-costs/06-costos-de-construccion.md` (D-064) con `netting-estructura-terminacion.md`
Dominio: INVESTMENT — METHODOLOGY

# Motor de costos de construcción

## Qué hace

Dado un proyecto nuevo, estima el costo de construcción esperado combinando los datos ya disponibles en `market-intelligence/`. **No es un modelo estadístico ni un cálculo automatizado todavía** (no hay Skill construido para esto, ver Fase 9) — es el procedimiento manual que cualquier análisis nuevo debería seguir, usando siempre los mismos datos base en vez de volver a preguntar precio de construcción desde cero.

## Inputs que recibe

| Input | De dónde sale |
|---|---|
| Barrio | El proyecto a evaluar |
| Superficie total a construir (m²) | Planos/proyecto |
| Tipo de construcción (edificio en altura / casa-dúplex / tinglado-depósito / remodelación) | El proyecto a evaluar |
| Calidad target (Básica / Estándar / Estándar+DVH) | Decisión de producto del founder o del inversor |
| ¿Construcción nueva o sobre estructura parcial existente? | El proyecto a evaluar — si es parcial, hace falta el % de incidencia estructural de un ingeniero |

## Output que devuelve

**Costo estimado bajo / base / alto**, usando los tres niveles de calidad reales de `market-intelligence/construction-costs/06-...md` como banda — no un ± inventado sobre un único número:

| Nivel | Tasa usada |
|---|---|
| **Bajo** | Tasa Básica de la categoría (USD 650/m² para edificios en altura) |
| **Base** | Tasa de la calidad target elegida para el proyecto (USD 720/m² Estándar, o la que corresponda) |
| **Alto** | Tasa Estándar+DVH de la categoría (USD 750/m² para edificios en altura), como techo de referencia si se sube el nivel de terminación |

Cada nivel se multiplica por la superficie total (con el ajuste de `netting-estructura-terminacion.md` si aplica), y el output se acompaña siempre de:

- **Fuente**: `market-intelligence/construction-costs/06-costos-de-construccion.md`, D-064 (Nivel 1 de confiabilidad — planilla directa del founder).
- **Fecha de actualización**: la del archivo de origen — 2026-08-15 al momento de escribir esto.
- **Nivel de confianza**: HIGH si el tipo de construcción/calidad ya está en la tabla; LOW si hay que extrapolar a un tipo no cubierto todavía (p. ej. oficinas, hoy sin fila propia en D-064).
- **Datos utilizados**: qué filas de la tabla se usaron, y si se aplicó el netting de estructura/terminación.

## Limitación honesta — no hay variación de costo de construcción por barrio

A diferencia del precio de **venta**/m² (que sí varía fuerte por zona, ver `market-intelligence/sales/`), el **costo de construcción** (materiales + mano de obra) no tiene, hasta ahora, ningún dato que lo diferencie por barrio dentro de Asunción — la tabla D-064 es una tabla única, ciudad-completa. Esto puede ser correcto (el costo de un albañil o del cemento no debería variar mucho por barrio) o puede ser una limitación real de cobertura de datos todavía no relevada — **no se asume ninguna de las dos cosas sin evidencia**, se documenta como pendiente.

## Ejemplo aplicado

`HERRERA-001` — edificio en altura, calidad Estándar (USD 720/m²), estructura parcial existente (73,5% de avance, 21% de incidencia estructural confirmado por ingeniero):

- **Bajo** (si se bajara a calidad Básica completa): USD 650/m² × (1 − 21%) = USD 513,50/m² de terminación.
- **Base** (calidad Estándar, la elegida): USD 720/m² × (1 − 21%) = USD 568,80/m² de terminación.
- **Alto** (si se subiera a Estándar+DVH): USD 750/m² × (1 − 21%) = USD 592,50/m² de terminación.

Ver el cálculo completo con superficie real y capital de socios en `contracts/cases/HERRERA-001/10-...md`.

## Cómo se sigue completando

1. Relevar si existe variación real de costo de construcción por barrio/zona de Asunción (mano de obra, logística de materiales) — hoy sin dato, categoría D.
2. Ampliar la tabla base (D-064) a tipos de construcción no cubiertos (oficinas, locales comerciales standalone) cuando aparezca un proyecto real que los necesite.
3. Una vez que este motor se use en 2-3 proyectos reales más, evaluar si conviene convertirlo en Skill (Fase 9) en vez de procedimiento manual.

## Referencias

- `market-intelligence/construction-costs/06-costos-de-construccion.md` (D-064).
- `netting-estructura-terminacion.md` — aplicar cuando el proyecto es sobre estructura parcial existente.
- `market-intelligence/sources/SOURCE_REGISTRY.md` — nivel de confiabilidad de la fuente.
