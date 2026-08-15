# HERRERA-001 — Índice del caso

Adquisición de edificio residencial inconcluso — Barrio Herrera, Asunción, Paraguay. Análisis de inversión (¿comprar, terminar y vender?), no negociación de un boleto ya firmado. Sigue el **prompt maestro "Investment Real Estate Analysis System"** (founder, 2026-08-12).

## Estado actual: 🟢 Casi todos los criterios estructurales cerrados — falta solo el recálculo técnico y los datos de mercado

El founder cerró casi todos los bloqueantes estructurales que quedaban. Comisión de venta: **5,5% con IVA incluido**, reparto por canal completo — política cross-cutting **D-063**. Vehículo legal: **SA entre 2-3 socios, 100% del capital**. Plazo de obra: **12 meses**. Costo de entrada recalculado con una **tabla general de costos de construcción** (D-064) más el 21% de incidencia estructural — Inversión Total Ángulo 1/3 baja a **USD 3.205.927,21** (USD 1.781,07/m² comercializable). **Capital de los socios: 70% por adelantado, 30% a cubrir con venta**. **Ritmo de venta (D-065)**: 30% lanzamiento / 40% durante obra / 30% al finalizar. **Piso de plusvalía anual**: 15% bruto sobre el precio de venta terminado — ahora refinado a **neto de comisión** (≈8,68% el primer año, la comisión se paga sobre el valor ya apreciado, no sobre el original) más impuestos (sin confirmar todavía). Y se formalizó que **las unidades retenidas no cargan costo de comercialización**, y que el escenario de retención total tiene **marketing casi nulo** (no hay campaña de preventa si el objetivo es rentar, no vender durante obra) — dos ajustes más a favor de ese escenario. Ver `08-...md` a `12-costos-de-comercializacion-por-escenario-y-plusvalia-neta.md`.

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
| `07-costos-desagregados-y-estrategia-venta-renta.md` | Costos desagregados por ítem, estrategia híbrida venta/retención con demostración del mecanismo vía `calculadora.py`, propuesta preliminar de % por ángulo (superada parcialmente por `08-...md`) |
| `08-comision-financiamiento-piso-renta-y-matriz-decision.md` | Política definitiva de comisión de venta (5,5%, reparto por canal), financiamiento confirmado (fondos propios), piso de alquiler formalizado por tipología, matriz de decisión venta vs. retención |
| `09-comision-con-iva-plazo-obra-vehiculo-legal-amoblamiento-y-verificacion-de-costos.md` | Comisión con IVA + reparto con agente independiente (cierra D-063), plazo de obra (12 meses), vehículo legal (SA, 2-3 socios), costos de amoblamiento por tipología/calidad, y primera verificación del costo/m² de entrada a pedido del founder |
| `10-tabla-costos-m2-general-metodologia-650-21-750-y-capital-de-socios.md` | Tabla general de costos de construcción por tipo/calidad (D-064), metodología definitiva de costeo (21% de incidencia estructural), Inversión Total recalculada, verificación ±10% de los USD 490.000, capital de socios (70% adelantado/30% con venta), tercer escenario de retención total |
| `11-ritmo-de-venta-y-piso-de-plusvalia.md` | Ritmo de venta por etapa (30/40/30, D-065) aplicado al monto mínimo de venta ya confirmado, y piso de plusvalía anual (15% bruto sobre precio de venta terminado) |
| `12-costos-de-comercializacion-por-escenario-y-plusvalia-neta.md` | **Nuevo (2026-08-15)**: las unidades retenidas no cargan costo de comercialización, marketing casi nulo en el escenario de retención total, y el piso de plusvalía recalculado neto de comisión (≈8,68% el primer año, antes de impuestos) |
| `source-documents/` | Brochure oficial, planos técnicos, y las 4 planillas Excel de referencia, sin modificar |

## Próximo paso

1. **Recalcular con la metodología nueva** los márgenes de `06-...md` y el piso de alquiler/matriz de decisión de `08-...md`/`09-...md` — usaban el costo de entrada anterior (USD 1.929,29/m²), ahora USD 1.781,07/m² (`10-...md` §2).
2. Relevar renta mensual real esperada por tipo de unidad en Barrio Herrera (ya hay un piso formalizado con amoblamiento incluido, pero falta el dato de mercado real).
3. Relevar la plusvalía real esperada en Barrio Herrera (el criterio de 15% anual ya está confirmado, `11-...md` §2 — falta el dato de mercado para aplicarlo).
4. Mapear el ritmo de venta por etapa a meses concretos y cruzarlo contra la curva de egresos de construcción — el cronograma de caja mes a mes que falta para el flujo de fondos completo.
5. Con eso, construir los tres escenarios del flujo de fondos multi-año (venta mínima necesaria, venta agresiva, retención total con plusvalía) y recién ahí la recomendación final.
