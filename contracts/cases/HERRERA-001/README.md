# HERRERA-001 — Índice del caso

Adquisición de edificio residencial inconcluso — Barrio Herrera, Asunción, Paraguay. Análisis de inversión (¿comprar, terminar y vender?), no negociación de un boleto ya firmado. Sigue el **prompt maestro "Investment Real Estate Analysis System"** (founder, 2026-08-12).

## Estado actual: 🟢 Cronograma de caja mensual + tabla de tarifas por barrio (cross-cutting, D-066)

El costo de entrada quedó definitivo por Ángulo, y los márgenes/piso de renta ya están recalculados con ese costo (el Ángulo 1 ya no tiene ningún escenario negativo). Esta vuelta se sumaron dos piezas nuevas: un **cronograma de caja mensual** para los 12 meses de obra (mes 1 = adquisición + 30% del presupuesto de construcción; meses 2-3, 10% cada uno; meses 4-12, el 50% restante repartido en partes iguales) — que ya reveló una posible tensión de caja real en el mes 1, sin resolver todavía. Y una **tabla de tarifas de alquiler por barrio de Asunción** (66 barrios, por tipología y tipo de alquiler — Airbnb/tradicional/amoblado), pedida explícitamente como herramienta **cross-cutting** para todos los proyectos de Meridiano, no solo Herrera — registrada como **D-066**, con una primera carga real de 5 barrios (Villa Morra, Herrera, Las Lomas, Recoleta, Mburucuyá) y un hallazgo nuevo: la renta real de 3 dormitorios en Barrio Herrera no alcanza el piso de rentabilidad calculado, reforzando que esa tipología es más candidata a venta que a retención. Ver `16-cronograma-de-caja-mensual.md`, `17-tabla-tarifas-por-barrio.md` y `knowledge-base/investment/07-tarifas-por-barrio-asuncion.md`.

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
| `12-costos-de-comercializacion-por-escenario-y-plusvalia-neta.md` | Las unidades retenidas no cargan comisión de venta, y el piso de plusvalía recalculado neto de comisión (≈8,68% el primer año) — **corregido parcialmente por `13-...md`, ver nota al inicio del archivo** |
| `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md` | Corrección de doble conteo (Proyecto/Aprobaciones ya en el precio de compra, Ángulo 1), plusvalía real de mercado (>20% anual), corrección del criterio de marketing (umbral 70%, no prorrateable), régimen tributario del desarrollador (10%/10%), y primer dato real de renta de mercado |
| `14-costo-de-entrada-definitivo-por-angulo.md` | Confirma que el techo de USD 1.400/m² es sobre costo de reposición (no sobre el costo real), fija el % de Proyecto para Ángulo 2/3 (30%/40%), y deja el costo de entrada definitivo por los 3 Ángulos |
| `15-recalculo-margenes-y-piso-de-renta-con-costo-definitivo.md` | Recálculo de márgenes por Ángulo con el costo definitivo (el Ángulo 1 ya no tiene ningún escenario negativo) y piso de renta actualizado con amoblamiento incluido |
| `16-cronograma-de-caja-mensual.md` | **Nuevo (2026-08-16)**: cronograma de caja mes a mes para los 12 meses de obra, por Ángulo — con un hallazgo de posible tensión de caja en el mes 1, sin resolver todavía |
| `17-tabla-tarifas-por-barrio.md` | **Nuevo (2026-08-16)**: primera carga de la tabla de tarifas por barrio (cross-cutting, D-066) y su aplicación a Herrera — renta real de 3 dormitorios no alcanza el piso calculado |
| `source-documents/` | Brochure oficial, planos técnicos, y las 4 planillas Excel de referencia, sin modificar |

## Próximo paso

1. **Resolver la tensión de caja del mes 1** (`16-...md` §4) — modelar el cobro real del 30% de "lanzamiento" con cuotas, no como pago único, y recalcular el 70%/30% de capital de socios con la Inversión Total definitiva.
2. Confirmar la lectura de la regla de cronograma de caja (`16-...md` §2, ambigüedad del 20%/10% del mes 1) si la interpretación usada no es la correcta.
3. Relevar tarifas de renta temporal/Airbnb reales de Barrio Herrera específicamente (solo se relevó Villa Morra por ahora).
4. Confirmar el % de venta/retención final por Ángulo, con el cronograma de caja ya resuelto.
5. Con eso, construir los tres escenarios del flujo de fondos multi-año (venta mínima necesaria, venta agresiva, retención total con plusvalía) y recién ahí la recomendación final.
