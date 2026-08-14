# HERRERA-001 — Índice del caso

Adquisición de edificio residencial inconcluso — Barrio Herrera, Asunción, Paraguay. Análisis de inversión (¿comprar, terminar y vender?), no negociación de un boleto ya firmado. Sigue el **prompt maestro "Investment Real Estate Analysis System"** (founder, 2026-08-12).

## Estado actual: 🟢 Costos desagregados + estrategia híbrida venta/renta introducida

El founder pidió desagregar los costos por ítem para la presentación, y planteó una estrategia nueva: no vender el 100% de las unidades — vender una parte y **retener el resto para generar renta**, aprovechando que el costo de entrada de una unidad retenida (costo de construcción de Meridiano) es más bajo que el precio de venta que pagaría un comprador individual, lo que da un yield de renta más alto. Se demostró el mecanismo con el motor real de rentabilidad del sistema (`calculadora.py`) y se propuso un % preliminar de venta/retención por ángulo. Ver `07-costos-desagregados-y-estrategia-venta-renta.md`.

## Archivos de este caso

| Archivo | Contenido |
|---|---|
| `00-data-room-index.md` | Data Room (categorías A–J): terreno, proyecto, mercado, los 3 ángulos de análisis |
| `01-informacion-critica-faltante.md` | Qué se resolvió y qué sigue pendiente |
| `02-plantillas-de-referencia.md` | Las 2 planillas Excel de metodología aportadas el 2026-08-12 |
| `03-presupuesto-y-comparables.md` | Presupuesto de terminación real, avance de obra (73,5%), comparable de mercado real (Filum Herrera) |
| `04-comprar-vs-construir.md` | Comparación comprar-y-terminar vs. terreno crudo + construcción desde cero |
| `05-angulo-2-y-3-tipologias-chicas.md` | Costeo ilustrativo del Ángulo 2 y Ángulo 3 (mix de unidades propuesto) |
| `06-margen-neto-comision-y-precios-por-piso.md` | Permiso municipal confirmado, precio por piso, cocheras, margen neto de comisión de venta |
| `07-costos-desagregados-y-estrategia-venta-renta.md` | **Nuevo (2026-08-13)**: costos desagregados por ítem, estrategia híbrida venta/retención con demostración del mecanismo vía `calculadora.py`, propuesta preliminar de % por ángulo |
| `source-documents/` | Brochure oficial, planos técnicos, y las 2 planillas Excel de referencia, sin modificar |

## Próximo paso

1. Relevar renta mensual real esperada por tipo de unidad en Barrio Herrera (hoy es un ejemplo ilustrativo, no un dato de mercado).
2. Confirmar la estructura de financiamiento (capital propio / deuda / fideicomiso) y el % de venta/retención real por ángulo.
3. Con eso, construir el flujo de fondos multi-año completo (venta + renta + todos los costos desagregados) y recién ahí la recomendación final.
