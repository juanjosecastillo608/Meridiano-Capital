# HERRERA-001 — Índice del caso

Adquisición de edificio residencial inconcluso — Barrio Herrera, Asunción, Paraguay. Análisis de inversión (¿comprar, terminar y vender?), no negociación de un boleto ya firmado. Sigue el **prompt maestro "Investment Real Estate Analysis System"** (founder, 2026-08-12).

## Estado actual: 🟢 Corrección de doble conteo + plusvalía real de mercado confirmada (>20% anual)

El founder cerró casi todos los bloqueantes estructurales, y esta vuelta corrigió un **doble conteo real**: para el Ángulo 1, las líneas de "Proyecto" (honorarios de diseño) y "Aprobaciones" ya están incluidas en el precio de compra de USD 850.000 — no debían sumarse de nuevo. El costo de entrada baja de USD 1.781,07/m² a **USD 1.569,21/m²**, aunque sigue sin alcanzar el techo de USD 1.400/m² que sostiene el founder (queda una pregunta abierta sobre qué magnitud exacta compara contra ese techo). Se confirmó además la **plusvalía real de la zona: superior al 20% anual** — supera con margen el piso de plusvalía (15% bruto), validando el escenario de retención total. Se corrigió el criterio de marketing de la vuelta anterior: **no es prorrateable por unidad, es un costo de campaña completa** que solo baja a casi cero si la retención es ≥70%. Se confirmó el **régimen tributario del desarrollador (10% IVA + 10% renta sobre utilidad)**, completando el piso de plusvalía neto (~7,8%). Y se hizo una primera búsqueda real de renta de mercado (Barrio Herrera, Villa Morra) que valida el piso de renta tradicional con el costo corregido. Ver `08-...md` a `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md`.

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
| `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md` | **Nuevo (2026-08-15)**: corrección de doble conteo (Proyecto/Aprobaciones ya en el precio de compra, Ángulo 1), plusvalía real de mercado (>20% anual), corrección del criterio de marketing (umbral 70%, no prorrateable), régimen tributario del desarrollador (10%/10%), y primer dato real de renta de mercado |
| `source-documents/` | Brochure oficial, planos técnicos, y las 4 planillas Excel de referencia, sin modificar |

## Próximo paso

1. **Confirmar qué magnitud compara contra el techo de USD 1.400/m²** (costo real corregido USD 1.569,21 vs. costo de reposición desde cero USD 1.280–1.346) — `13-...md` §1.3.
2. **Recalcular con el costo de entrada corregido (USD 1.569,21/m²)** todos los márgenes y pisos de renta de `06-...md`/`08-...md`/`09-...md`.
3. Relevar tarifas de renta temporal/Airbnb reales de Barrio Herrera (ADR por noche) — la renta tradicional ya tiene un primer dato real (`13-...md` §5).
4. Mapear el ritmo de venta por etapa a meses concretos y cruzarlo contra la curva de egresos de construcción — el cronograma de caja mes a mes que falta para el flujo de fondos completo.
5. Con eso, construir los tres escenarios del flujo de fondos multi-año (venta mínima necesaria, venta agresiva, retención total con plusvalía) y recién ahí la recomendación final.
