Estado: CURRENT
Fuente original: founder, 2026-08-15 — planilla "Tabla de Costos M2 construcción según Tipo de Construcción y calidad.xlsx"
Dominio: INVESTMENT

# Costos de construcción por m² — tabla general de referencia

**Uso**: costo de referencia (materiales + mano de obra, construcción **terminada**) para cualquier análisis de inversión/desarrollo de Meridiano, no solo un caso puntual — el founder pidió explícitamente guardar esta tabla "para todas las bases de análisis de Meridiano". Primer caso que la usa en la práctica: `contracts/cases/HERRERA-001/` (ver `10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md` de ese caso para la metodología aplicada).

## Tabla — categoría A (confirmado por el founder)

| Tipo de construcción | Calidad | USD/m² |
|---|---|---|
| Tinglados / Depósitos | Básica | 350 |
| Tinglados / Depósitos con oficinas | Estándar | 400 |
| Depósitos con oficinas y locales comerciales | Estándar | 450 |
| **Edificios departamentos en altura** | **Básica** | **650** |
| **Edificios departamentos en altura** | **Estándar** | **720** |
| **Edificios departamentos en altura** | **Estándar + Vidrio DVH** | **750** |
| Casas / Dúplex | Básica | 550 |
| Casas / Dúplex | Estándar | 650 |
| Casas / Dúplex | Estándar + Vidrio DVH | 850 |
| Remodelación sobre obra ya existente (casas/dúplex/deptos) | Básica | 350 |
| Remodelación sobre obra ya existente (casas/dúplex/deptos) | Estándar | 450 |

## Regla de aplicación para obras sin terminar

Cita textual de la fuente: *"Para los cálculos de obras sin terminar utilizo, para cada categoría, el valor del m² básico."* — es decir, cuando se está evaluando la adquisición de una construcción parcial/inconclusa (como `HERRERA-001`), la tasa **Básica** de la categoría correspondiente es la base de referencia para calcular el valor de lo ya construido, no la tasa Estándar ni Estándar+DVH.

## Metodología para separar estructura de terminación (validada con un caso real)

Cuando se necesita descomponer un costo "todo incluido" (Básica/Estándar/DVH) en su componente **estructural** (cimientos, columnas, losas — el esqueleto) vs. su componente de **terminación** (mampostería, instalaciones, revoques, pisos, etc.), la metodología confirmada por el founder es:

1. Usar la tasa **Básica** de la categoría como base para cuantificar el componente estructural — el % de incidencia lo da un análisis de ingeniero específico del proyecto (en `HERRERA-001`, 21%).
2. Para calcular el costo real de terminación (el que se usa en el presupuesto de inversión), aplicar ese mismo % de incidencia estructural, pero **restándolo de la tasa de calidad target de venta** (no de la tasa Básica) — la lógica del founder: *"para establecer el costo de la estructura uso como base de cálculo la tasa Básica. Pero para la construcción del edificio y su cálculo para los inversores, ya sí uso la tasa de calidad target."*
3. La porción sin ninguna construcción previa usa la tasa de calidad target completa, sin descuento.

Ver el caso real aplicado en `contracts/cases/HERRERA-001/10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md`, sección 2.

## Relación con `comision_intermediacion` (`03-parametros-de-mercado.md`)

Esta tabla es de **costo de construcción**, no de comisión de venta — no confundir con el parámetro `comision_intermediacion` ya existente en `03-parametros-de-mercado.md` (5,5% total, 2,75% solo punta compradora, 5,5% si Meridiano tiene ambas puntas). El caso `HERRERA-001` amplía ese marco simple de 2 puntas con canales adicionales (equipo interno, franquicia, agente independiente) — ver `governance/decisions/DECISION_REGISTER.md`, D-063.
