# Edificio Ciudad Nueva — Control interno (versión final cliente)

**Uso interno de Meridiano Capital. No enviar al inversor.**
Actualización: **2026-10-10** · Estado: **VERSIÓN FINAL PARA EL CLIENTE** · Informe automático: **APROBADO CON OBSERVACIONES**.
Historial: preliminar (02/10) → final (03/10) → **actualización (10/10): tipo de cambio del día, superficies y 3 fotos nuevas**.

---

## 1. Cambios del 10/10/2026

| Pedido del founder | Cómo se aplicó |
|---|---|
| Actualizar todos los datos a la fecha de hoy | **Tipo de cambio:** Gs **5.694** por USD, cierre interbancario del viernes **09/10/2026** (hoy es sábado). Fuente: BCP, informado por ABC Color el 09/10/2026; mercado minorista ~G. 5.720. La versión anterior usaba Gs 5.873 (02/10/2026). **Mercado:** avisos de alquiler y comparable de venta reconsultados el 10/10/2026 |
| Terreno 11 × 31 m, 340 m² | Cargado como dato confirmado. **Observación:** 11 × 31 = 341 m². Se usa la superficie informada (340 m²); la diferencia de 1 m² es redondeo de medidas |
| 1.109 m² construidos | Cargado. Nueva diapositiva 5 "Superficies y valor" y nueva hoja `Superficies_Valor` del Excel |
| Fotos nuevas | Fachada frontal en la portada (reemplaza a la vista aérea, que pasa al recorrido). Acceso principal y escalera vista hacia el lucernario. El recorrido se dividió en dos diapositivas: fachada y acceso / circulación y terraza |

## 2. Efecto del tipo de cambio (el mismo ingreso en guaraníes)

| Tipo de cambio | Rentabilidad bruta | Neta final |
|---|---|---|
| Planilla original, Gs 6.100 | 11,31 % | 7,68 % |
| 02/10/2026, Gs 5.873 | 11,75 % | 7,98 % |
| **09/10/2026, Gs 5.694 (vigente)** | **12,12 %** | **8,25 %** |
| Escenario, Gs 6.300 | 10,95 % | 7,42 % |

El guaraní se apreció frente al dólar en las últimas semanas. La pieza lo menciona como riesgo en la diapositiva 16: si la tendencia se revierte, la renta medida en USD baja.

## 3. Cálculo vigente (USD por año, TC Gs 5.694)

| Concepto | USD |
|---|---|
| Ingreso bruto (Gs 19.550.000 × 12 / 5.694) | **41.201,26** |
| IVA (5 % sobre 13 departamentos, 10 % sobre las 2 filas de cochera; Gs 1.072.500 por mes) | −2.260,27 |
| Vacancia 3 % | −1.236,04 |
| Administración 8 % | −3.296,10 |
| Mantenimiento 5 % | −2.060,06 |
| Gastos fijos (planilla verificada) | −1.200,00 |
| **Resultado antes de impuesto a la renta** | **31.148,79** |
| IRE estimado 10 % | −3.114,88 |
| **Resultado neto** | **28.033,91** (USD 2.336 por mes) |

**Rentabilidad sobre el precio de USD 340.000:**
- Bruta: **12,12 %**.
- Neta antes de impuesto a la renta: **9,16 %**.
- **Neta final: 8,25 %**.
- Múltiplo precio / ingreso bruto: **8,3 veces**.

**Proyección a 5 años** (alquileres en Gs +3 / 5 / 8 % anual; valorización en USD 2 / 3,5 / 5 % anual):

| Escenario | Neto año 5 | Ganancia total | TIR |
|---|---|---|---|
| Conservador | USD 31.688 | USD 178.926 | 10,2 % |
| Base | USD 34.308 | USD 213.229 | 11,7 % |
| Optimista | USD 38.529 | USD 252.826 | 13,5 % |

**Verificación cruzada, tres caminos que coinciden al centavo:**
- Fórmulas del Excel: 230, recalculadas sin errores.
- Script de la presentación.
- `validate_property_data.py`: 5 de 5 cálculos "coincide", incluido el precio por m².

## 4. Superficies y valor (diapositiva 5, hoja `Superficies_Valor`)

| Indicador | Valor | Base |
|---|---|---|
| Terreno | 340 m² (11 × 31 m) | Founder |
| Superficie construida | 1.109 m² | Founder |
| Índice de construcción | 3,3 veces el terreno | 1.109 / 340 |
| Precio por m² construido | USD 307 (terreno incluido) | 340.000 / 1.109 |
| Costo de construir hoy la misma superficie | USD 720.850 (sin terreno) | USD 650/m², edificio de departamentos calidad básica (`construction-costs/06-costos-de-construccion.md`, categoría A) |
| Precio frente a ese costo | **47 %** | 340.000 / 720.850 |
| Precio por unidad de renta | USD 24.286 | 340.000 / 14 |
| Comparable del barrio | USD 650.000 por 9 unidades (~USD 72.222 por unidad) | InfoCasas Ref #GB49D6, precio de oferta sin superficie publicada (categoría C) |

**Advertencias:**
- Son referencias, **no una tasación**.
- El edificio es usado y su antigüedad no fue informada, así que el costo de obra nueva no descuenta depreciación.
- El comparable es un precio pedido, no de cierre, y no informa calidad ni superficie.

**Pendiente:** cargar Ciudad Nueva en las bases de mercado del repo (alquiler y terreno), que hoy figuran en categoría D.

## 5. Fuentes

| Dato | Fuente | Estado |
|---|---|---|
| Precio, composición, ocupación, WEB ID, superficies | Founder (02, 03 y 10/10/2026) | Confirmado |
| Alquileres y gastos fijos | Detalle y planilla del propietario | Informados con verificación documental (03/10/2026) |
| Tipo de cambio Gs 5.694 | BCP, cierre interbancario del 09/10/2026; ABC Color 09/10/2026 ("Nueva baja en cotización del dólar, que cierra la semana por debajo de G. 5.700"); coincide con La Nación del 08/10 ("menos de G. 5.700") | Dato de mercado. La red del entorno bloquea bcp.gov.py y abc.com.py: **conviene confirmar el valor a la vista antes de enviar** |
| Alquileres de mercado | InfoCasas, Ciudad Nueva, consulta 10/10/2026: 1 dormitorio Gs 3,0–3,2 M (44–51 m²); 2 dormitorios Gs 2,1–6,3 M (77 avisos) | Categoría C (avisos, no contratos) |
| Ubicación | Overture Maps 2026-09-23.1 (OSM). Eusebio Ayala a 86 m, Rodríguez de Francia a 320 m, Mercado 4 a 477 m, todo por calle | Calculado (sin cambios) |
| Mercado 4 | Municipalidad de Asunción | Sin cambios |
| IVA, vacancia, administración, mantenimiento, IRE | D-001, D-101, `parametros_mercado.json` | Sin cambios |

## 6. Marca y fotos

- **Kit y marca:** kit de la skill `meridiano-property-presentation-adapter`. Fraunces y Poppins incrustadas; logotipos D-034.
- **Cierre:** tierra colorada con el retrato de Juan José Castillo (D-099) y firma "Lic. Juan José Castillo — Broker Inmobiliario | Meridiano Capital".
- **Fotos:** 8 fotos del edificio, sin edición. La de la portada lleva recorte proporcional (encuadre 0,45, edificio completo); las del recorrido van sin recorte.
- **Proporción:** 25 imágenes verificadas, desviación máxima 0,001 %.
- **Datos personales:** sin rostros de terceros ni patentes legibles en las fotos nuevas.

## 7. Verificaciones

| Control | Resultado |
|---|---|
| Excel (`recalc.py`) | 230 fórmulas, 0 errores (corregidas 2 referencias de la hoja nueva antes de entregar) |
| PPTX (`validate.py`) | Todas las validaciones pasan |
| PDF | 17 páginas generadas desde el PPTX; tipografías incrustadas |
| Revisión visual | 17 diapositivas + vista general. Se acortó la nota de la portada (cortaba el WEB ID) |
| Datos personales | Falsos positivos (WEB ID). Sin datos de inquilinos |
| Informe automático | **APROBADO CON OBSERVACIONES** (`trabajo/VALIDACION_EDIFICIO_CIUDAD_NUEVA.md`) |

**Pendientes, ninguno bloquea el envío:**
1. Confirmar qué fila del detalle es el local comercial (afecta solo el IVA de 10 %).
2. Confirmar a la vista el tipo de cambio del BCP del 09/10/2026.
3. Terreno: confirmar 340 vs. 341 m² con el título.
4. Antigüedad del edificio, para afinar el análisis de valor.
