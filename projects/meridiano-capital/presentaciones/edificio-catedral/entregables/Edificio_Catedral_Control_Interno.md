# Edificio Catedral — Control interno

Uso interno de Meridiano Capital. Documento de trazabilidad de la presentación `Edificio_Catedral_Meridiano_FINAL` (PPTX y PDF) y del Excel `Edificio_Catedral_Rentabilidad.xlsx`. Generado el 07/11/2026 desde `fuente/model.json`.

## 1. Archivos recibidos
| Archivo | Uso |
|---|---|
| `Edificio Departamentos Catedral.pdf` (6 páginas; metadatos del 27/08/2026) | Datos del inmueble, renta residencial, planilla de rentabilidad de la fuente e imágenes del entorno. Documento de terceros: no se versiona en el repo. |
| `Aerea Edificio`, `Frente Edificio`, `Lateral Edificio` | Fotos de las láminas 1, 6 y 7 |
| `Ubicacion.png` | Mapa de la lámina 3 (base Google Maps con rótulos agregados) |
| Pedido del founder (05/11/2026) | Hipótesis de los 3 locales, estructura de la pieza y entregables |
| Datos del founder (07/11/2026) | Precio de venta rápida sugerido de USD 800.000; 1 salón alquilado y 2 desocupados; departamentos de 150 m²; ubicación confirmada (https://maps.app.goo.gl/uPDUSU5wzgi6K3iNA) |
| Estudio de mercado de alquileres (07/11/2026) y su planilla | Comparables R1–R12 y C1–C14, escenarios y recomendaciones. Guardado con el estándar de estudios: `knowledge-base/investment/market-intelligence/estudios/CDE-CATEDRAL-2026-11-07/` (D-100) |

## 2. Tipo de cambio
- **Usado:** Gs 6.480,35 por USD. Fuente: BCP, cotización referencial del **06/11/2026**, verificado el 2026-11-07. Página: https://www.bcp.gov.py/webapps/web/cotizacion/monedas
- **Cómo se obtuvo:** la planilla del BCP se leyó vía buscador y coincide con el estudio de mercado del 07/11/2026. El sitio del BCP no resuelve desde el entorno de trabajo (DNS/proxy).
- **Serie usada en la lámina 13:** 16/10/2026: Gs 5.770,91 → 7,80% / 9,75% · 03/11/2026: Gs 6.060,86 → 7,42% / 9,28% · 04/11/2026: Gs 6.144,02 → 7,32% / 9,16% · 05/11/2026: Gs 6.388,47 → 7,04% / 8,80% · 06/11/2026: Gs 6.480,35 → 6,94% / 8,68%.
- **Hallazgo cambiario:** el referencial pasó de Gs 5.833,41 (26/10) a Gs 6.388,47 (05/11), +9,5% en diez días, y a Gs 6.480,35 el 06/11 (contexto: resolución sobre Ueno Bank y tensión política, según ABC Color del 06/11/2026). Con el mismo edificio y la misma renta, la bruta total pasó de 9,75% (TC del 16/10) a 8,68%. Antes de cada reunión hay que regenerar los materiales con el TC del día.
- **Fuente única:** el valor vive en `presentaciones/_config/meridiano.json` (D-097) y se edita en `Parametros!B5` del Excel.

## 3. Cálculos (todos reproducibles en el Excel)
| Concepto | Fórmula | Resultado |
|---|---|---:|
| Terreno | 17,50 × 40 | 700 m² (coincide con lo informado) |
| Precio publicado en Gs | USD 960.000 × 6.480,35 | Gs 6.221.136.000 |
| Precio de venta rápida en Gs (sugerido por Meridiano) | USD 800.000 × 6.480,35 | Gs 5.184.280.000 (16,7% menos que el publicado) |
| Renta residencial mensual | 12 × Gs 3.000.000 | Gs 36.000.000 |
| Renta residencial anual | × 12 meses | Gs 432.000.000 (USD 66.663) |
| Salón alquilado (canon no informado; hipótesis) | 1 × Gs 3.000.000 | Gs 3.000.000 |
| Renta actual estimada | 36 M + 3 M | Gs 39.000.000 por mes · Gs 468.000.000 por año (USD 72.218) |
| Renta potencial (con los 2 salones desocupados) | 36 M + 9 M | Gs 45.000.000 por mes · Gs 540.000.000 por año (USD 83.329) |
| Bruta residencial | 432 M ÷ precio en Gs | **6,94%** publicado · **8,33%** venta rápida |
| Bruta actual estimada | 468 M ÷ precio en Gs | **7,52%** publicado · **9,03%** venta rápida |
| Bruta potencial | 540 M ÷ precio en Gs | **8,68%** publicado · **10,42%** venta rápida |
| Canon por m² del departamento | 3.000.000 ÷ 150 m² | Gs 20.000/m² |
| Recuperación simple bruta (renta actual) | precio ÷ renta anual | 13,3 años publicado · 11,1 años venta rápida |
| USD por m² construido informado | precio ÷ 2.290 | USD 419 publicado · USD 349 venta rápida |

**Escenarios (internos, en el Excel; la presentación muestra el residencial, el actual y el potencial a los dos precios):**

| Escenario | Departamentos | Salones | Mensual | Anual | USD 960.000 | USD 800.000 |
|---|---|---|---:|---:|---:|---:|
| Residencial informado | Gs 3.000.000 × 12 | — | Gs 36.000.000 | Gs 432.000.000 | 6,94% · 14,4 años | 8,33% · 12,0 años |
| Actual estimado | Gs 3.000.000 × 12 | Gs 3.000.000 × 1 | Gs 39.000.000 | Gs 468.000.000 | 7,52% · 13,3 años | 9,03% · 11,1 años |
| Potencial (salones vacantes alquilados) | Gs 3.000.000 × 12 | Gs 3.000.000 × 3 | Gs 45.000.000 | Gs 540.000.000 | 8,68% · 11,5 años | 10,42% · 9,6 años |
| Inferior | Gs 2.800.000 × 12 | Gs 2.500.000 × 1 | Gs 36.100.000 | Gs 433.200.000 | 6,96% · 14,4 años | 8,36% · 12,0 años |
| Superior | Gs 3.500.000 × 12 | Gs 4.500.000 × 3 | Gs 55.500.000 | Gs 666.000.000 | 10,71% · 9,3 años | 12,85% · 7,8 años |

Condiciones:
- **Actual:** 12 departamentos y el salón alquilado, cuyo canon no fue informado (se usa la mediana del estudio).
- **Inferior:** departamentos en la parte baja de la muestra y el salón alquilado a Gs 2,5 M, piso del rango. Se adaptó al dato del 07/11: el salón alquilado se mantiene. Es el piso de la muestra, no un caso garantizado.
- **Superior:** requiere renovar contratos con ajuste, buen estado de las unidades y buen frente de los salones. Ninguna de esas condiciones está comprobada (confianza baja).

## 3 bis. Estudio de mercado (consulta del 07/11/2026)
- **Departamentos de 3 dormitorios:**
  - Muestra de 8 avisos: de Gs 3,0 M a Gs 9,7 M, con mediana de Gs 5,1 M.
  - Unidades estándar sin amoblar (5 avisos): de Gs 3,0 M a Gs 6,0 M, mediana Gs 4,9 M.
  - El canon de Gs 3.000.000 está **dentro del mercado, en la banda baja**. Rango preliminar: Gs 3,0 M a Gs 3,5 M (confianza media-baja).
- **Salones:**
  - Muestra de 14 avisos con mediana de Gs 3,0 M; los estándar van de Gs 1,5 M a Gs 5,0 M.
  - La hipótesis de Gs 3.000.000 queda **en la mediana**. Rango preliminar: Gs 2,5 M a Gs 4,5 M según superficie, frente y estado (confianza media-baja).
- **Contexto:**
  - Mediana de alquiler de departamento en CDE: USD 804 por mes (TuLugar).
  - Galerías del microcentro: hasta USD 50/m² (Última Hora, 16/10/2026).
  - Cellshop: 53.000 m², con apertura proyectada para el Black Friday 2026 según ABC Color del 15/07/2026. Es una proyección publicada, no confirmada.
- **Limitaciones:**
  - Ningún aviso informa su fecha de publicación y no se confirmó la disponibilidad.
  - La muestra del Barrio Catedral estricto es de un solo aviso (1 dormitorio).
  - Superficie de los departamentos: 150 m² cada uno (founder, 07/11/2026). El canon equivale a Gs 20.000/m², por debajo de los avisos con superficie publicada (Gs 22.222 a 64.804/m²). El más parecido es el Edificio Oriental: 150 m² en el microcentro, a USD 1.500.
- **Equivalencias:** los montos en guaraníes de la tabla usan el TC vigente (Gs 6.480,35).

| Código | Aviso | Zona | Detalle | Publicado | En Gs | Comparabilidad y uso | Fuente |
|---|---|---|---|---|---|---|---|
| R1 | Edificio Oriental, 2º piso (RE/MAX) | Microcentro, CDE | 3 dorm., 150 m² | USD 1.500 | Gs 9.720.525 | ALTA · en estadísticas | [RE/MAX vía InfoCasas](https://www.infocasas.com.py/alquiler/departamentos/alto-parana/ciudad-del-este) |
| R2 | Depto amoblado, 3 dorm. (1 suite), área de servicio con cuarto y baño, | Centro, CDE | 3 dorm. | USD 800 | Gs 5.184.280 | ALTA · en estadísticas | [MercadoProp](https://www.mercadoprop.net/py/departamentos-alquiler-ciudad_del_este-alto_parana) |
| R3 | Dúplex amoblado, 3 dorm. (1 suite), cochera, terraza con quincho — COD | Barrio San José, CDE | 3 dorm. | USD 1.200 | Gs 7.776.420 | MEDIA-ALTA · en estadísticas | [MercadoProp](https://www.mercadoprop.net/py/departamentos-alquiler-ciudad_del_este-alto_parana) |
| R4 | Penthouse frente al Área 8, 3 hab. (1 suite), piso 3, sin ascensor ni  | Área 8, CDE | 3 dorm. | Gs 5.000.000 | Gs 5.000.000 | MEDIA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/inmuebles/alto-parana/ciudad-del-este/baratos/pagina3) |
| R5 | Depto Km 5,5, 3 hab. (1 suite), semi amoblado, cochera, amenities y se | Km 5,5, CDE | 3 dorm. | Gs 4.500.000 | Gs 4.500.000 | MEDIA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/departamentos/alto-parana/ciudad-del-este/3-dormitorios/baratos) |
| R6 | Depto 3 dorm., expensas incluidas (visto en índice de búsqueda; no vis | CDE (zona no informada) | 3 dorm. | Gs 4.900.000 | Gs 4.900.000 | MEDIA-BAJA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/departamentos/alto-parana/ciudad-del-este/3-dormitorios/baratos) |
| R7 | Depto Av. San José, 3 suites, semi amoblado, cochera | Av. San José, CDE | 3 dorm., 270 m² | Gs 6.000.000 | Gs 6.000.000 | MEDIA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/departamentos/alto-parana/ciudad-del-este) |
| R8 | Casa Km 7 Barrio Mburucuyá, 3 dorm. — casa, no departamento | Km 7 Mburucuyá, CDE | 3 dorm., 120 m² | Gs 3.000.000 | Gs 3.000.000 | BAJA-MEDIA · en estadísticas | [UbicaProp](https://ubicaprop.com.py/propiedad/casa-en-alquiler-3/) |
| R9 | Depto CDE — COD 3713 | CDE | — | Gs 2.800.000 | Gs 2.800.000 | BAJA · excluido: Dormitorios no informados: fuera de la muestra de 3 dormitorios | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| R10 | Depto cerca de UNINTER, con ascensor | CDE | — | Gs 2.200.000 | Gs 2.200.000 | BAJA · excluido: Dormitorios no informados: fuera de la muestra de 3 dormitorios | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| R11 | Depto Área 4 | Área 4, CDE | — | Gs 3.000.000 | Gs 3.000.000 | BAJA · excluido: Dormitorios no informados: fuera de la muestra de 3 dormitorios | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| R12 | Depto 1 dorm., sala, cocina-comedor, lavadero, estacionamiento | Barrio Catedral, CDE | 1 dorm. | Gs 1.700.000 | Gs 1.700.000 | REFERENCIA · excluido: 1 dormitorio: referencia de zona, no comparable directo | [MercadoProp](https://www.mercadoprop.net/py/departamentos-alquiler-ciudad_del_este-alto_parana) |
| C1 | Salón en esquina, Av. Cap. Emeterio Miranda, a metros de rotonda Oasis | Microcentro, CDE | 75 m² | USD 700 | Gs 4.536.245 | ALTA · en estadísticas | [RE/MAX](https://www.remax.com.py/143050056-103) |
| C2 | Salón céntrico premium, doble Av. Eusebio Ayala esq. Curupayty, frente | Centro, CDE | 75 m² | USD 1.350 | Gs 8.748.472 | ALTA (extremo superior) · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/locales-comerciales/alto-parana/ciudad-del-este) |
| C3 | Salón comercial 50 m² | Bernardino Caballero, CDE | 50 m² | Gs 3.000.000 | Gs 3.000.000 | MEDIA-ALTA · en estadísticas | [ViaParaguay](https://viaparaguay.com/es/propiedades/alquiler/comerciales/ciudad/ciudad-del-este) |
| C4 | Sala comercial Km 3½ | Área 1, CDE | — | Gs 2.200.000 | Gs 2.200.000 | MEDIA · en estadísticas | [ViaParaguay](https://viaparaguay.com/es/propiedades/alquiler/comerciales/ciudad/ciudad-del-este) |
| C5 | Sala comercial | Área 1, CDE | — | Gs 5.000.000 | Gs 5.000.000 | MEDIA · en estadísticas | [ViaParaguay](https://viaparaguay.com/es/propiedades/alquiler/comerciales/ciudad/ciudad-del-este) |
| C6 | Salón comercial | Bernardino Caballero, CDE | — | Gs 2.500.000 | Gs 2.500.000 | MEDIA · en estadísticas | [ViaParaguay](https://viaparaguay.com/es/propiedades/alquiler/comerciales/ciudad/ciudad-del-este) |
| C7 | Salón comercial | Bernardino Caballero, CDE | — | Gs 2.800.000 | Gs 2.800.000 | MEDIA · en estadísticas | [ViaParaguay](https://viaparaguay.com/es/propiedades/alquiler/comerciales/ciudad/ciudad-del-este) |
| C8 | Salón Av. Itaipú Oeste, a 1 cuadra de Arena Shop (incluye agua y basur | Área 1, CDE | 48 m² | USD 450 | Gs 2.916.158 | ALTA (pequeño) · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/inmuebles/alto-parana/ciudad-del-este/monoambiente/1-bano) |
| C9 | Salón Km 8 Acaray: PB 120 m² + planta alta con balcón, cochera, agua y | Km 8 Acaray, CDE | 120 m² | Gs 3.000.000 | Gs 3.000.000 | MEDIA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/inmuebles/alto-parana/ciudad-del-este/baratos) |
| C10 | Salón en esquina sobre avenida asfaltada, alto flujo vehicular | Km 9 Acaray, CDE | 100 m² | Gs 4.000.000 | Gs 4.000.000 | MEDIA · en estadísticas | [InfoCasas](https://www.infocasas.com.py/alquiler/locales-comerciales/alto-parana/ciudad-del-este) |
| C11 | Salón a metros de la ruta | CDE | — | Gs 2.500.000 | Gs 2.500.000 | BAJA-MEDIA · en estadísticas | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| C12 | Salón zona concurrida | CDE | — | Gs 2.300.000 | Gs 2.300.000 | BAJA-MEDIA · en estadísticas | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| C13 | Salón comercial | CDE | — | Gs 1.500.000 | Gs 1.500.000 | BAJA · en estadísticas | [Clasipar](https://clasipar.paraguay.com/alquiler/inmuebles/alto-parana) |
| C14 | Local Km 3½, cerca del centro | Km 3½, CDE | 168 m² | Gs 3.000.000 | Gs 3.000.000 | MEDIA · en estadísticas | [MercadoProp](https://www.mercadoprop.net/py/propiedades-alquiler-ciudad_del_este-alto_parana) |

Duplicado eliminado: A1613 = COD 1938 (R2). Descartados por no comparables: depósitos, salones de eventos, locales corporativos, clubes premium y avisos de 2025 que no se pudieron reverificar.

## 4. Auditoría de las cifras publicadas por la fuente
- **"Rentabilidad comprobada: 7%"** — **NO CONCILIADA.**
  - Base: la planilla del PDF usa Gs 36.000.000 por mes (solo departamentos), un tipo de cambio de **Gs 6.000 sin fecha ni fuente** y un solo gasto (impuesto anual Gs 18.000.000; expensas Gs 0).
  - Resultado: renta bruta 7,50% y "neta" 7,19%. Reproducidas exactamente, pero la "neta" omite mantenimiento, administración, seguros, vacancia, IVA e impuesto a la renta.
  - El 7% no coincide con ninguno de los dos valores y no tiene respaldo de cobros: no se presenta como rentabilidad comprobada.
  - Con el tipo de cambio vigente, esa misma "neta" daría 6,65%.
- **"9,75% de rentabilidad bruta anual estimada"** (descripción comercial) — **no vigente.**
  - Con Gs 540.000.000 anuales, implica un tipo de cambio de Gs 5.769,23, que coincide con el cierre interbancario del BCP del 16/10/2026 (Gs 5.770,91). Es un cálculo inverso, no prueba de la cotización usada.
  - Con el referencial del 06/11/2026, la bruta total es **8,68%**.
  - No se reproduce en la presentación (criterio del founder: no mostrar rentabilidades publicadas que Meridiano no validó, aplicado en San Miguel el 16/10/2026). Queda en el Excel (`Auditoria_Fuente`) y en este control.

## 5. Datos y estado
| Dato | Valor | Estado |
|---|---|---|
| Precio | USD 960.000 | Confirmado (fuente y pedido) |
| Terreno | 17,50 × 40 m = 700 m² | Confirmado y verificado |
| Superficie construida | 2.290 m² | Informado; **pendiente de planos** |
| Superficie por departamento | 150 m² (1.800 m² en total) | Founder, 07/11/2026; a constatar en planos |
| Precio de venta rápida | USD 800.000 | **Sugerido por Meridiano Capital** (founder, 07/11/2026); sujeto a aceptación del propietario |
| Niveles y composición | 4 niveles; 12 departamentos (4 por piso, pisos 1 a 3) y 3 salones en planta baja | Confirmado (fuente) |
| Estacionamiento | 12 plazas cubiertas en planta baja; 1 por departamento | Confirmado (fuente) |
| Servicios | Pozo artesiano | Confirmado (fuente); estado pendiente |
| Departamentos | 3 dormitorios (1 en suite + 2 con baño compartido) + habitación de servicio con baño, sala, comedor-cocina, lavadero, balcón | Confirmado (fuente); sin superficies por unidad |
| Renta residencial | 12 × Gs 3.000.000, 12 unidades ocupadas | Informado; fecha del relevamiento **no informada** (PDF del 27/08/2026 según metadatos) |
| Salones | 1 alquilado y 2 desocupados | Founder, 07/11/2026. El canon del alquilado no fue informado: hipótesis de Gs 3.000.000; los 2 desocupados son renta potencial |
| Planos aprobados y documentación en regla | — | Declaración de la fuente, sin respaldo adjunto |
| Ubicación | Pampliega casi Av. Mayor Rivas Ortellado | **Confirmada** por el founder el 07/11/2026: https://maps.app.goo.gl/uPDUSU5wzgi6K3iNA (enlace y QR de la lámina 3). El mapa de la lámina es la vista del entorno recibida |
| Cellshop | Futuro centro comercial de 53.000 m² | Apertura proyectada para fines de 2026 según prensa (ABC Color, 15/07/2026); no confirmada |
| Impuesto anual | Gs 18.000.000 (planilla del PDF) | **Pendiente de validación**: sin comprobante, concepto ni período |

**Excluido de la pieza por falta de respaldo:**
- "Potencial de expansión o remodelación".
- "Sin necesidad de remodelaciones".
- "Valorización a largo plazo".
- Distancias y tiempos de traslado.

## 6. Pendientes antes de una oferta
1. Título, titularidad, cuenta corriente catastral e informe de condiciones de dominio.
2. Planos aprobados, superficies (2.290 m²) y permisos o situación municipal.
3. Contratos de los 12 departamentos: vencimientos, reajustes, depósitos, cobros y morosidad.
4. Contrato y canon del salón alquilado; estado y condiciones para alquilar los 2 desocupados.
5. Gastos operativos e impuestos, para calcular la renta neta.
6. Estado del pozo artesiano, las instalaciones y el mantenimiento (inspección técnica).
7. Condiciones de venta, forma de pago y gastos de escritura.
8. Confirmar la fecha del relevamiento de alquileres. La ubicación ya fue confirmada el 07/11/2026.
9. Aclarar el impuesto de Gs 18.000.000 por año de la fuente: concepto, período y comprobantes.
10. Facturas de servicios y gastos comunes; habilitaciones y situación municipal de los salones.
11. Superficie, frente, estado e instalaciones de cada salón, para pasar de la hipótesis al canon real.
13. Aceptación del propietario del precio de venta rápida sugerido (USD 800.000) y condiciones de pago.
12. Regenerar los materiales con el TC del día antes de cada reunión (volatilidad alta).

## 7. Marca (Brand Guardian, matriz de 10 criterios)
1. Estrategia: APROBADO. Muestra a Meridiano como asesor que verifica y acompaña; no promete rentabilidad.
2. Identidad verbal: APROBADO. Tono sobrio; cifras rotuladas como informadas, estimadas o brutas.
3. Identidad visual: APROBADO. Lockup vigente (D-034) solo en portada y cierre e isotipo en los pies; sin deformación ni efectos.
4. Tipografía: APROBADO. Fraunces Regular en titulares, sin negrita (D-036/D-040), y Poppins en el cuerpo. J/j en Lora: P-008, [EXTENSION].
5. Color: APROBADO. HEX oficiales; dorado solo como acento, cifra aislada o texto sobre fondo oscuro.
6. Fotografía: APROBADO. Solo imágenes de la propiedad y del entorno recibidas, sin deformación (27 imágenes, desviación máxima 0,001%). Se descartaron la foto del PDF con una patente legible y una vista cenital duplicada.
7. Composición: APROBADO. Un mensaje por lámina y márgenes de 0,6".
8. Experiencia: APROBADO. PDF 16:9 legible en pantalla, enlace y QR funcionales al mapa.
9. Premiumización: APROBADO.
10. Coherencia general: APROBADO. Mismo sistema que los decks vigentes de M4, San José, Sajonia y San Miguel.

**Veredicto general: APROBADO.**

**Fuentes de marca consultadas:**
- `knowledge-base/ai/05-matriz-de-decision.md`.
- Reglas de logo y color en `inventory/_raw-copies/meridiano-capital-identity/references/03` y `05`.
- `DECISION_REGISTER.md` (D-034, D-036, D-040, D-096, D-097, D-098).
- Skill `meridiano-property-presentation-adapter`: kit de construcción, `brand_tokens.json`, fuentes Fraunces y Poppins.

**Firma:** "Broker Inmobiliario | Meridiano Capital", por pedido expreso del founder (rank 1). El preset por regla para una venta sería A (D-039).

**Aviso legal:** disclaimer de venta (D-098), más "no constituye una garantía de rentabilidad".

## 8. Validaciones técnicas
- PPTX: `validate.py` (skill pptx) superado; 16 diapositivas editables (textos, tablas y gráfico nativos), con dos láminas de mercado nuevas (11 y 12).
- Imágenes: `validate_image_aspect_ratios.py` superado, desviación máxima 0,001% sobre una tolerancia de 0,5%.
- PDF: generado desde el PPTX final con LibreOffice; 16 páginas; fuentes incrustadas Fraunces, Poppins y Lora (más OpenSymbol para las viñetas).
- Revisión visual de las 16 diapositivas: sin cortes ni superposiciones.
- Excel: recalculado con LibreOffice; coincide con `model.json`: bruta residencial y total, renta anual, escenarios, medianas de mercado y auditoría. Celdas de entrada en azul sobre crema.
- Presentación, Excel, control interno y respuestas usan el mismo TC, con la misma fecha y fuente: todos se generan desde `model.json`.
- Contacto: teléfono único +595 982 853 111 (D-096), leído de `_config`.
- Datos personales: no se incluyen nombres de terceros, patentes ni datos de inquilinos. El autor que figura en los metadatos del PDF fuente no se reproduce.

## 9. Limitaciones
- Las fotos del PDF tienen 640 a 1.600 px: aptas para pantalla, limitadas para impresión grande.
- Las fuentes Fraunces, Poppins y Lora están incrustadas en el PDF. Para editar el PPTX con el diseño exacto hay que instalarlas (Google Fonts, licencia OFL); sin ellas, PowerPoint usa sustitutos.
