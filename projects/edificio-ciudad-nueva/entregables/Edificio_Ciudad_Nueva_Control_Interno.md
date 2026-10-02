# Edificio Ciudad Nueva — Control interno

**Uso interno de Meridiano Capital. No enviar al inversor.**
Fecha: 2026-10-02 · Estado: **VERSIÓN PRELIMINAR**: la composición de unidades no está conciliada (ver §4).
Los nombres de archivo llevan `_FINAL` porque así se pidieron; la presentación dice "Versión preliminar" en la portada y en cada pie de página.

---

## 1. Fuentes recibidas

| # | Archivo | Contenido | Uso |
|---|---|---|---|
| 1 | `1.jpg` (1536×1024) | Terraza superior con vistas a la ciudad | Diap. 5 |
| 2 | `2.jpg` | Planilla "RENTABILIDAD EDIFICIO DE APARTAMENTOS" | Transcrita (Excel › Datos_Originales), auditada |
| 3 | `3.jpg` (1500×1000) | Escalera y circulación común | Diap. 5 |
| 4 | `4.jpg` | Detalle de alquileres por departamento | Transcrito (Excel › Datos_Originales / Alquileres_Unidad) |
| 5 | `5.jpg` (1125×750) | Vista aérea con el contorno del edificio en rojo (marca de la fuente) | Portada (sin recorte) |
| — | Mensaje del founder | Precio, dirección, entorno, mix, ocupación, terraza, WEB ID, asesor | Dato de rango 1 |

Las fotos se usaron sin edición. Ninguna se atribuye a un piso o a una unidad. No se recibieron fotos de interiores ni del local comercial.

## 2. Archivos de marca y skills utilizados

| Recurso | Ruta | Uso |
|---|---|---|
| Sistema de consulta | `knowledge-base/ai/03-sistema-de-consulta.md` | Enrutamiento para presentación de inversores |
| Identidad visual / logo | `knowledge-base/brand/03-identidad-visual.md` | Versiones de logo |
| Tipografía | `knowledge-base/brand/04-tipografia.md` + D-036/D-040 | Fraunces Regular (sin negrita) en titulares, Poppins en el cuerpo |
| Color | `knowledge-base/brand/05-sistema-cromatico.md` | Petróleo 14313A, tierra 8B3323, lapacho C9982E, crema F3EDE3, gris 6B6154 |
| Cierres y firmas | `knowledge-base/brand/09-cierres-y-firmas.md` | Cierre en tierra colorada, contacto |
| Skill **meridiano-property-presentation-adapter** | `scripts/meridiano_deck_kit.js`, `assets/brand_tokens.json` (snapshot 2026-09-25, D-098) | Kit de construcción, recorte sin deformación, validadores |
| Logos | snapshot de la skill: `meridiano-primario-horizontal-trazado.svg`, `…-inverso-trazado.svg`, `meridiano-isotipo.svg`, `meridiano-isotipo-inverso.svg` (isotipo D-034; equivalentes a `assets/logos/` del repo con el wordmark convertido a trazos) | Lockup en portada y cierre; isotipo en los pies |
| Tipografías | `assets/fonts/` de la skill (Fraunces-Regular, Poppins Regular/Medium/Bold/Italic, OFL) | Instaladas e incrustadas en el PDF |
| Skills **pptx** / **xlsx** | `validate.py`, `recalc.py` | Validación estructural y recálculo de fórmulas |

No existe en el repo un documento llamado "Prompt Maestro de Presentaciones Comerciales" ni "Brand OS". Según la propia skill, ese rol lo cumplen la capa `CURRENT` del repo y la skill del adaptador de presentaciones, que fue lo que se aplicó. No se inventaron logos, colores ni nombres de skills.

**Recursos faltantes. Por eso no se declara cumplimiento completo de la marca:**
- **Retrato del asesor**: `brand_tokens.json` apunta a `production/generadores/assets-puerto-fenix/jjc_retrato.jpg`, que **no está en el repo**. El cierre va sin foto.
- **Registro de decisiones del repo**: llega hasta D-095. Las decisiones D-096 y D-098 que cita el snapshot de la skill (firma C y avisos legales) no figuran en `DECISION_REGISTER.md`, así que el snapshot es posterior al repo. Hay que registrarlas.
- **Mapa**: ver §6.

### Decisión de firma `[EXTENSION]`
`09-cierres-y-firmas.md` (Variante A, D-039) fija para decks de venta el título "Operador Técnico y Legal de Inversiones Inmobiliarias". En el brief, el founder pidió explícitamente **"Lic. Juan José Castillo — Broker Inmobiliario | Meridiano Capital"**, y eso fue lo que se aplicó (instrucción directa del founder, rango 1). El título coincide con la Variante C (D-096). **Pendiente**: confirmar si esta firma pasa a ser la regla para las fichas de venta con WEB ID y, si es así, registrarla.
Contacto (de `09-cierres-y-firmas.md`, verificado para Juan José Castillo): +595 982 853 111 · juancastillo@meridianocapital.net · www.meridianocapital.net.
Aviso legal: texto "venta" (D-098) más la cláusula "No constituye una garantía de rentabilidad" del aviso "preventa_inversion" (D-098).

## 3. Cálculos (precisión completa; redondeo solo para mostrar)

| Indicador | Fórmula | Resultado completo | Se muestra | Planilla recibida |
|---|---|---|---|---|
| Suma del detalle | Σ 15 filas | Gs 19.550.000 | Gs 19.550.000 | Gs 19.550.000 ✔ |
| Ingreso mensual USD | 19.550.000 / 6.100 | 3.204,918033 | USD 3.205 | USD 3.205 ✔ |
| Ingreso bruto anual | × 12 | 38.459,016393 | USD 38.459 | USD 38.459 ✔ |
| Resultado neto según gastos informados | 38.459,02 − 2.764 − 1.200 | 34.495,016393 | USD 34.495 | USD 34.495 ✔ |
| Rentabilidad bruta sobre precio | 38.459,02 / 340.000 | 11,3115 % | 11,31 % | "11,3 %" ✔ (redondeo) |
| Rentabilidad neta según gastos informados | 34.495,02 / 340.000 | 10,1456 % | 10,15 % | 10,15 % ✔ |
| Múltiplo precio / bruto | 340.000 / 38.459,02 | 8,8406 | 8,8 veces | — (cálculo propio) |
| Impuesto / bruto | 2.764 / 38.459,02 | 7,19 % | solo interno | — |

Subtotales por nivel: 3.er piso Gs 5.300.000 · 2.º piso Gs 7.350.000 · 1.er piso Gs 2.900.000 · planta baja Gs 4.000.000.
Se verificaron con tres caminos independientes, que coinciden: fórmulas del Excel recalculadas con LibreOffice (102 fórmulas, 0 errores), el script de la presentación (que frena si la suma no da 19.550.000) y `validate_property_data.py` (4 cálculos, todos "coincide").

**Corrección de la descripción comercial**: los "USD 34.500 de ingresos anuales" y la "relación bruta de 10,15 %" corresponden al **resultado neto según gastos informados** y a su rentabilidad. El ingreso bruto anual es **USD 38.459** y la rentabilidad bruta es **11,31 %**. La presentación lo aclara en la diapositiva 8.

**Motor del repo**: no se usó `calculadora.py` para calcular una renta neta propia de Meridiano. Faltan los egresos reales (mantenimiento, administración, vacancia, etc.) y usarlo obligaría a cargar supuestos que no se recibieron. Lo que se presenta es la cifra de la planilla, auditada. El 10,15 % no es una "rentabilidad neta definitiva" ni un retorno sobre la inversión total: el denominador es solo el precio y no incluye gastos de adquisición.

**Observación fiscal (no concluyente)**: USD 2.764 equivale al 7,19 % del bruto. No coincide con el IVA de alquiler residencial (5 %) ni con el comercial (10 %) de D-001/D-045. Podría ser una combinación de impuestos u otra base, pero no se presume nada: lo tiene que confirmar el contador.

## 4. Diferencias y conciliación (punto pendiente concreto)

| Concepto | Mix informado | Detalle de alquileres | Resultado |
|---|---|---|---|
| Dptos. 1 dormitorio | 6 | 6 | Coincide |
| Dptos. 2 dormitorios | 6 | 6 | Coincide |
| Dptos. 3 dormitorios | 1 | 1 | Coincide |
| Local comercial | 1 | **0** (no identificado) | **Diferencia** |
| Cochera (sola) | — | 1 (Gs 700.000) | No mencionada en el mix |
| "Cochera y dpto" | — | 1 (Gs 1.200.000) | **Sin interpretar** |

La fila "Cochera y dpto" no se interpretó como local ni como unidad adicional. Si incluyera un departamento, habría 14 departamentos y no 13. Mientras no se aclare, el total se presenta como **ingreso mensual informado**, sin afirmar que su composición está conciliada.

**Hay que pedir al propietario:**
1. A qué unidad corresponde "Cochera y dpto".
2. Dónde está incluido el alquiler del local comercial.
3. Si algún concepto agrupa unidades o duplica ingresos.
4. La fecha de vigencia de los alquileres y del tipo de cambio Gs 6.100.
5. Contratos vigentes, ocupación real y cobro efectivo de los últimos 12 meses.
6. Qué cubren los USD 2.764 de impuesto y los USD 1.200 de gastos.
7. Si la cochera (Gs 700.000) se alquila a un tercero y si está incluida en la venta.

## 5. Datos faltantes (no inventados; fuera de la presentación)

Superficie de terreno y construida · antigüedad · ascensor · cantidad real de cocheras · estado estructural · situación registral y catastral · numeración real de las unidades · forma de pago y plazos · tratamiento de los contratos vigentes en la venta · gastos de transferencia · egresos operativos (mantenimiento, administración, seguros, vacancia, morosidad, reservas). En el Excel figuran como PENDIENTE, con la celda vacía; nunca como cero.

Ocupación: **informada** 100 %; **verificada documentalmente**: no. La presentación lo distingue en las diapositivas 2 y 9.

## 6. Ubicación y mapa

- Dirección, "próximo al Mercado 4" y "a una cuadra de Av. Eusebio Ayala" se presentan como **datos recibidos**, sin verificar en campo. No se agregaron distancias ni tiempos de traslado.
- **No se pudo incrustar un mapa cartográfico.** La política de red del entorno bloqueó OpenStreetMap (teselas y Nominatim) y otros servidores de mapas (CARTO, ArcGIS, Stadia). En su lugar, la diapositiva 3 lleva un enlace funcional y un QR a la búsqueda de "9 de Marzo y Mayor Bullo, Asunción" en Google Maps, como **referencia de intersección**: la parcela exacta no está verificada. **Pendiente**: agregar una captura de mapa autorizada con atribución (desde un equipo con acceso), o registrar las coordenadas con `skills/geocoding-engine` cuando se verifiquen.

## 7. Verificaciones realizadas

| Control | Resultado |
|---|---|
| Fórmulas del Excel (`recalc.py`) | 102 fórmulas, 0 errores |
| Estructura del PPTX (`validate.py`, skill pptx) | Todas las validaciones pasan |
| Proporción de imágenes (`validate_image_aspect_ratios.py`) | 16 imágenes, desviación máx. 0,001 % (tolerancia 0,5 %) |
| PDF generado desde el PPTX final (LibreOffice) | 12 páginas; Fraunces y Poppins incrustadas; sin OpenSymbol |
| Revisión visual de las 12 diapositivas + vista general | Defectos corregidos en un 2.º render: QR ausente (d3), etiqueta superpuesta (d8), viñetas (d7), formato del gráfico (d4) |
| Coincidencia de cifras Excel = PPTX = PDF | Gs 19.550.000 · USD 3.205 · USD 38.459 · USD 2.764 · USD 1.200 · USD 34.495 · 11,31 % · 10,15 % · 8,8 veces |
| Validación de datos (`validate_property_data.py`) | 4/4 cálculos coinciden; 1 confirmación pendiente (superficie) |
| Barrido de datos personales | Las coincidencias del informe automático son falsos positivos: WEB ID y montos en Gs leídos como CI o teléfono. Revisado el contexto de cada una. Sin datos de inquilinos (la fuente solo dice "Inquilino") |
| Contacto | Solo juancastillo@meridianocapital.net / +595 982 853 111; sin correos ni cargos antiguos |
| Editabilidad | Textos, tablas (nativas) y gráfico de barras (nativo) editables; notas del orador con la fuente de cada dato |

Informe automático completo: `projects/edificio-ciudad-nueva/trabajo/VALIDACION_EDIFICIO_CIUDAD_NUEVA.md`. Su resultado es **BORRADOR**, por la superficie no informada y la conciliación pendiente.
Renders de revisión: `projects/edificio-ciudad-nueva/trabajo/revision/`.

## 8. Estructura de la presentación (12 diapositivas)

1 Portada · 2 Resumen del inmueble · 3 Ubicación y entorno · 4 Distribución por nivel (tabla + gráfico) · 5 Recorrido fotográfico · 6 Alquileres informados · 7 Ingresos, egresos y resultado · 8 Rentabilidad · 9 Precio y condiciones conocidas · 10 Información que debe revisar el inversor · 11 Riesgos · 12 Cierre y contacto.
La diapositiva 11 (riesgos) se agregó a las 11 secciones pedidas porque la skill la exige en piezas de inversión. Contiene solo riesgos generales del tipo de operación, ninguno inventado para este activo.

## 9. Reproducir

```bash
python3 production/generadores/build_edificio_ciudad_nueva_excel.py   # luego recalc.py de la skill xlsx
cd production/generadores && NODE_PATH=$PWD/node_modules node build_edificio_ciudad_nueva_presentacion.js
# PDF + PNG: scripts/render_presentation.py de la skill meridiano-property-presentation-adapter
```
