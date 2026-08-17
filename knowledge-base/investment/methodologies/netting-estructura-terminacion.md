Estado: CURRENT — extraída como metodología independiente el 2026-08-17 (Real Estate Intelligence OS), validada con un caso real desde 2026-08-15
Fuente original: founder, 2026-08-15; validada en `contracts/cases/HERRERA-001/10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md`
Dominio: INVESTMENT — METHODOLOGY

# Metodología: separar estructura de terminación en una construcción parcial

## Cuándo se usa

Cuando Meridiano evalúa adquirir un edificio **parcialmente construido** (no un terreno vacío, no un edificio terminado) y necesita descomponer el costo "todo incluido" de una categoría de construcción (Básica/Estándar/Estándar+DVH, ver `market-intelligence/construction-costs/06-...md`) en dos componentes:

- **Componente estructural**: cimientos, columnas, losas — el esqueleto ya construido, lo que el vendedor está entregando físicamente.
- **Componente de terminación**: mampostería, instalaciones, revoques, pisos, carpinterías, pintura, etc. — lo que Meridiano todavía tiene que construir.

## El procedimiento (3 pasos)

1. **Valorar el esqueleto ya construido**: usar la tasa **Básica** de la categoría de construcción correspondiente (nunca la Estándar ni la Estándar+DVH) como base de cálculo. El % de incidencia estructural sobre esa tasa Básica lo da un análisis de ingeniero específico del proyecto — no es un número fijo del sistema, varía caso a caso (en `HERRERA-001` fue 21%, confirmado por el ingeniero del proyecto).

   `Valor del esqueleto = % de incidencia estructural × Tasa Básica de la categoría`

2. **Calcular el costo real de terminación** (el que entra en el presupuesto de inversión del comprador): aplicar el mismo % de incidencia estructural, pero **restarlo de la tasa de calidad target de venta** — no de la tasa Básica usada en el paso 1. Cita textual del founder: *"para establecer el costo de la estructura uso como base de cálculo la tasa Básica. Pero para la construcción del edificio y su cálculo para los inversores, ya sí uso la tasa de calidad target."*

   `Costo de terminación por m² = Tasa de calidad target × (1 − % de incidencia estructural)`

3. **Porción sin ninguna construcción previa** (ampliaciones, pisos nuevos que se agregan sobre la estructura existente): usa la tasa de calidad target **completa**, sin ningún descuento — ahí no hay esqueleto heredado que restar.

## Por qué el paso 1 y el paso 2 usan tasas distintas (el error que esta metodología evita)

Es tentador aplicar el mismo % de incidencia sobre la misma tasa en los dos pasos — pero eso subvaloraría el costo real de terminación. La tasa Básica sirve para **tasar lo que ya existe** (un desarrollador que construye "a lo básico" hoy gastaría esa fracción en la estructura); la tasa de calidad target sirve para **presupuestar lo que falta construir** con el nivel de terminación que el proyecto realmente va a tener (Estándar, Estándar+DVH). Mezclar las dos bases en el mismo paso da un costo de terminación artificialmente bajo.

## Ejemplo aplicado (HERRERA-001, categoría Estándar, USD 720/m², 21% de incidencia estructural)

| Paso | Cálculo | Resultado |
|---|---|---|
| 1. Valor del esqueleto | 21% × USD 650 (tasa Básica) | USD 136,50/m² |
| 2. Costo de terminación | USD 720 (tasa Estándar) × (1 − 21%) | USD 568,80/m² |

Ver el detalle numérico completo, con el capital de socios resultante, en `contracts/cases/HERRERA-001/10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md`.

## Límites de esta metodología

- El % de incidencia estructural **no es un supuesto del sistema** — requiere un análisis de ingeniero específico del proyecto cada vez. No usar el 21% de Herrera como default para otro proyecto sin ese análisis.
- Asume que la tasa Básica de la tabla de costos (`market-intelligence/construction-costs/06-...md`) es representativa del costo real de una estructura equivalente — si el terreno/proyecto tiene condiciones estructurales atípicas (suelo malo, cimentación especial), esta metodología subestimaría el costo real y hace falta un ajuste específico, no cubierto acá.

## Referencias

- `market-intelligence/construction-costs/06-costos-de-construccion.md` (D-064) — tabla de tasas por categoría/calidad.
- `governance/decisions/DECISION_REGISTER.md`, D-064.
- Aplicación real: `contracts/cases/HERRERA-001/10-...md`.
