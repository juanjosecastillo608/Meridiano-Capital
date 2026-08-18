Estado: CURRENT — primera versión, 1 barrio (Luis A. de Herrera), 5 registros reales
Fuente original: AMC de terreno de ARKA Desarrollos Inmobiliarios (`AMC_Dossier_Herrera.pdf`, abril 2026) + metodología `knowledge-base/investment/methodologies/amc-analisis-comparativo-de-mercado.md`, aportado por el founder 2026-08-18
Dominio: INVESTMENT

# Valor de terreno por barrio — Asunción

## Qué es y en qué se distingue de las otras tablas de `market-intelligence/`

Primera base de **valor de terreno** (suelo, no unidad construida) de Meridiano — complementa `sales/10-...md` (venta de departamentos) y `rentals/07-...md` (alquiler), que nunca cubrieron terreno. Nace de la aplicación real de la metodología AMC (`methodologies/amc-analisis-comparativo-de-mercado.md`) al caso `HERRERA-001` — ver `contracts/cases/HERRERA-001/45-amc-terreno-y-nuevos-comparables-herrera.md` para el análisis completo, incluida una discrepancia material detectada (sin resolver) entre el valor de terreno implícito de ese caso y el valor de mercado real de esta tabla.

## Dónde está el dato

| Archivo | Contenido |
|---|---|
| `data/valor-terreno-por-barrio.csv` | Fuente de verdad, versionada en git |

## Cobertura actual (2026-08-18)

**5 registros, categoría A** (comparables públicos con fuente citable — Century 21 ×1, RE/MAX ×3, InfoCasas ×1) — **1 barrio cubierto** (Luis A. de Herrera). Promedio: **USD 380/m²**.

**No incluidos como dato propio** (regla de la metodología AMC, §2): la muestra de "12 ventas cerradas" y la herramienta "Tasaciones Online" que cita el AMC de ARKA como fuentes adicionales — son afirmaciones de un tercero sobre su propia base de datos, sin forma de verificación independiente. Se mencionan en `contracts/cases/HERRERA-001/45-...md` §3.2 solo como contexto, no se cargan acá.

## Cómo se sigue completando

1. Mismo método que el resto de `market-intelligence/`: relevar más barrios vía portales (Century 21, RE/MAX, InfoCasas) o AMCs reales de terceros cuando estén disponibles, siempre separando dato propio (comparable público verificable) de referencia de tercero (no verificable).
2. Cuando Meridiano tenga transacciones de terreno cerradas propias, esas suben a categoría A/Nivel 1 automáticamente.

## Uso previsto

- **Validar el componente de terreno** de cualquier análisis de adquisición nuevo — mismo rol que cumplió por primera vez en `HERRERA-001` (`45-...md` §4).
- **Insumo del motor de costos** (`methodologies/motor-de-costos.md`) para casos donde el terreno se compra vacío o con estructura a demoler (`30-valuacion-de-terreno-sin-lotes-vacantes-y-confirmacion-AR2-B.md`, regla cross-cutting).
