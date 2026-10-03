# Edificio Ciudad Nueva — Control interno (versión final cliente)

**Uso interno de Meridiano Capital. No enviar al inversor.**
Fecha: 2026-10-03 · Estado: **VERSIÓN FINAL PARA EL CLIENTE** (aprobada por el founder: datos informados con verificación documental).
Versión anterior (preliminar, 2026-10-02) reemplazada; su historial queda en git.

---

## 1. Qué cambió respecto de la versión preliminar

| Pedido del founder (03/10/2026) | Cómo se aplicó |
|---|---|
| Recalcular al tipo de cambio del día, con fecha | Gs **5.873** por USD: cierre del mercado interbancario del viernes **02/10/2026**, el último día hábil al sábado 03/10 (BCP; informado por ABC Color). El TC de la planilla (Gs 6.100) queda solo como referencia en el Excel. La regla se registró como **D-100** |
| Datos informados con verificación de documentación | Rótulo en la portada, el resumen y la diapositiva de condiciones. Se quitó "según la información recibida" |
| Reseña del Mercado 4 y de la importancia de la cercanía | Nueva diapositiva 4: historia (1942), rol de principal polo comercial minorista del país (Municipalidad de Asunción), demanda, transporte y vacancia baja |
| Proximidad a las dos avenidas más importantes | Calculada por la red de calles real (§4): **Av. Eusebio Ayala, 86 m** (una cuadra) y **Av. Rodríguez de Francia, 320 m**, más el Mercado 4 a 477 m |
| IVA 5 % departamentos, 10 % local | Aplicado por fila en el Excel (§3) |
| Vacancia 3 %, administración 8 %, criterio de mantenimiento | Vacancia 3 % y administración 8 % (founder). Mantenimiento 5 % del bruto, criterio vigente del motor (`mantenimiento_pct`), que cubre reparaciones menores y recambios; las obras mayores se presupuestan tras la inspección técnica. Registrado como **D-101** |
| Proyección de alquiler según el mercado de Asunción, y plusvalía | Nuevas diapositivas 10 y 11, y hojas `Proyeccion` y `Plusvalia` del Excel (§5) |
| Foto de Juan José Castillo siempre al final | Cierre con el retrato aprobado; regla permanente **D-099**, también en `09-cierres-y-firmas.md` |

## 2. Fuentes

| Dato | Fuente | Estado |
|---|---|---|
| Precio, composición, ocupación, WEB ID | Founder | Confirmado |
| Alquileres por concepto (Gs 19.550.000/mes) y gastos fijos (USD 1.200/año) | Detalle y planilla del propietario | Informados con verificación documental (founder, 03/10/2026) |
| Tipo de cambio Gs 5.873 | BCP, Mercado Libre Fluctuante Interbancario, cierre del 02/10/2026; ABC Color 02/10/2026 ("en el mercado interbancario la divisa terminó la jornada en G. 5.873"; casas de cambio G. 5.780/5.860) | Dato de mercado. **Advertencia:** la red del entorno bloquea bcp.gov.py y abc.com.py; el valor se obtuvo de dos resultados de búsqueda coincidentes, no de la página original. Conviene confirmarlo a la vista antes de enviar |
| IVA 5/10 %, vacancia, administración | Founder (D-001, D-101) | Confirmado |
| Mantenimiento 5 %, IVA de venta 1,5 % | `parametros_mercado.json`, D-082/D-083 | Criterio vigente |
| Ubicación y distancias | Overture Maps release 2026-09-23.1 (derivado de OpenStreetMap), `trabajo/ubicacion.json` | Calculado |
| Alquileres de mercado | Avisos de InfoCasas en Ciudad Nueva, consulta 03/10/2026: 1 dorm. Gs 2,5–3,0 M; 2 dorm. Gs 2,1–4,2 M; locales desde Gs 2,7 M | Dato de mercado (categoría C: avisos, no contratos) |
| Mercado 4 | Municipalidad de Asunción (84 años como principal polo comercial minorista del país). Prensa para el flujo diario | Dato público. En la pieza se usan formulaciones cualitativas ("decenas de miles de compradores"), sin cifras exactas |

## 3. Cálculo (USD por año, TC Gs 5.873)

| Concepto | Base | USD |
|---|---|---|
| Ingreso bruto | Gs 19.550.000 × 12 / 5.873 | **39.945,51** |
| IVA | 13 dptos. Gs 17.650.000 × 5 % + cocheras Gs 1.900.000 × 10 % = Gs 1.072.500/mes | −2.191,38 (5,49 %) |
| Vacancia | 3 % | −1.198,37 |
| Administración | 8 % | −3.195,64 |
| Mantenimiento | 5 % | −1.997,28 |
| Gastos fijos | Planilla verificada | −1.200,00 |
| **Resultado antes de impuesto a la renta** | | **30.162,85** |
| IRE estimado | 10 % del resultado (S.A., sin depreciación: conservador) | −3.016,28 |
| **Resultado neto** | | **27.146,56** (USD 2.262/mes) |

Rentabilidad sobre el precio de USD 340.000:
- Bruta: **11,75 %**.
- Neta antes de impuesto a la renta: **8,87 %**.
- **Neta final: 7,98 %**.
- Múltiplo precio / ingreso bruto: **8,5 veces**.

Se verificaron con tres caminos independientes, que coinciden al centavo: fórmulas del Excel (211, 0 errores), script de la presentación y `validate_property_data.py` (4/4 cálculos "coincide").

Con el TC de la planilla original (Gs 6.100) la rentabilidad bruta era 11,31 % y la "neta" 10,15 %. Esa "neta" solo descontaba USD 2.764 de impuesto y USD 1.200 de gastos; ahora queda reemplazada por el cálculo completo. **Mensaje para el founder:** la neta final (7,98 %) está por debajo de la referencia de 10 % de cartera, porque ahora incluye vacancia, administración, mantenimiento e IRE. La TIR a 5 años del escenario base (11,5 %) sí la supera.

**Criterio sobre el IVA:** el local comercial no aparece con ese nombre en el detalle. Las filas "Cochera" (Gs 700.000) y "Cochera y dpto" (Gs 1.200.000) tributan 10 % por criterio conservador. Si el local resultara ser otra fila, el IVA cambia en pocos dólares; igual conviene confirmarlo (§7).

**Método:** igual que `calculadora.py`, con el IVA y los costos como % del bruto y el IVA tratado como costo del propietario (alquiler con IVA incluido). El IRE es una estimación: la base real (deducciones y depreciación) la define el contador.

## 4. Ubicación (script `production/generadores/build_edificio_ciudad_nueva_ubicacion.py`)

- Punto de referencia: intersección de los ejes de 9 de Marzo y Mayor Sebastián Bullo (−25,299977, −57,619090).
- Distancias por calle (camino más corto en la red vial; entre paréntesis, en línea recta):

| Vía o lugar | Por calle | En línea recta |
|---|---|---|
| Av. Eusebio Ayala | 86 m | 86 m |
| Av. Rodríguez de Francia / Próceres de Mayo | 320 m | 230 m |
| Av. Silvio Pettirossi | 365 m | 287 m |
| Av. Gral. Santos | 663 m | 582 m |
| Av. Mcal. López | 974 m | 974 m |
| Punto "Mercado 4 de Asuncion" | 477 m | 426 m |

- El mapa de la diapositiva 3 se dibujó con esos mismos datos, con atribución © OpenStreetMap contributors · Overture Maps. El círculo marca el **punto de referencia** del Mercado 4, no su perímetro.
- El edificio está "c/" (casi) la esquina, así que la parcela puede estar a pocos metros del punto.

## 5. Proyección y plusvalía (hipotéticas, rotuladas como tales)

| Escenario | Alquileres (Gs/año) | Valorización (USD/año) | Neto año 5 | Valor año 5 | Ganancia total 5 años | TIR |
|---|---|---|---|---|---|---|
| Conservador | +3 % | 2 % | USD 30.689 | USD 375.387 | USD 174.215 | 9,9 % |
| Base | +5 % | 3,5 % | USD 33.230 | USD 403.813 | USD 208.326 | 11,5 % |
| Optimista | +8 % | 5 % | USD 37.322 | USD 433.936 | USD 247.621 | 13,2 % |

**Fundamento:**
- **Alquileres:** el escenario conservador queda por debajo del IPC de 12 meses (4,1 %, ajuste fiscal 2026). El optimista refleja la brecha con el mercado: el promedio actual es Gs 1.158.333 en 1 dormitorio y Gs 1.516.667 en 2 dormitorios, contra avisos de Gs 2,1 a 4,2 millones. Esos avisos incluyen unidades más nuevas o con amenities, así que no son comparables directos.
- **Valorización:** son supuestos `[EXTENSION]`. La base de mercado del repo todavía no tiene dato de Ciudad Nueva (barrio en categoría D en `tarifas-alquiler-por-barrio-asuncion.csv`).

**Qué no incluye:** gastos de adquisición, comisión de venta ni variación del tipo de cambio (se mantiene el del día).

## 6. Marca y archivos

- **Marca:** kit de la skill `meridiano-property-presentation-adapter` (Fraunces/Poppins, lockup e isotipo D-034, colores oficiales) y `09-cierres-y-firmas.md` actualizado con D-099.
- **Retrato:** `production/generadores/assets-puerto-fenix/jjc_retrato.jpg`, traído al repo desde la rama de Puerto Fénix. Es la ruta que cita la ficha de marca y la misma foto que usa Casa San Bernardino.
- **Firma:** "Lic. Juan José Castillo — Broker Inmobiliario | Meridiano Capital", por pedido del founder (`[EXTENSION]` frente a la Variante A, D-039).
- **Avisos legales:** venta + no garantía de rentabilidad.
- **Pendiente:** registrar en el repo las decisiones D-096 y D-098 que cita el snapshot de la skill (anotado en D-099).

## 7. Verificaciones y pendientes

| Control | Resultado |
|---|---|
| Excel (`recalc.py`) | 211 fórmulas, 0 errores |
| PPTX (`validate.py`) | Todas las validaciones pasan |
| Proporción de imágenes | 20 imágenes, desviación máx. 0,001 % |
| PDF | 15 páginas generadas desde el PPTX; Fraunces y Poppins incrustadas |
| Revisión visual | 15 diapositivas + vista general. Se corrigieron rótulos del mapa (3 iteraciones), espaciados de las diapositivas 4 y 8 y la barra de la diapositiva 2 |
| Barrido de datos personales | Falsos positivos (WEB ID y nombre de la versión de Overture). Sin datos de inquilinos |
| Informe automático (`trabajo/VALIDACION_EDIFICIO_CIUDAD_NUEVA.md`) | Marca "NO APROBADO" solo porque la regla genérica de venta exige superficie. **Excepción documentada:** la superficie no fue informada y la pieza no la menciona; el founder aprobó la versión final |

**Pendientes, ninguno bloquea el envío:**
1. Confirmar qué fila del detalle es el local comercial (afecta solo la asignación del IVA de 10 %).
2. Confirmar a la vista el TC del BCP del 02/10/2026 (Gs 5.873), porque se obtuvo de resultados de búsqueda.
3. Superficie de terreno y construida, para una futura ficha técnica.
