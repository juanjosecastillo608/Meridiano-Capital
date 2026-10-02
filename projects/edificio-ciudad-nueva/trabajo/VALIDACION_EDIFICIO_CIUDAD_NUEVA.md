# Validación: Edificio Ciudad Nueva

**Resultado: BORRADOR (NO APROBADO hasta resolver los bloqueantes)**

| Campo | Valor |
|---|---|
| Operación | Venta |
| Tipo de activo | edificio de renta (13 departamentos + 1 local comercial) |
| Audiencia | inversor |
| Rol de Meridiano Capital | comercialización y asesoramiento al inversor (pedido del founder) |
| Modo de trabajo | C |
| Firma aplicada | U_brief_founder (título pedido por el founder: Broker Inmobiliario | Meridiano Capital) |
| PowerPoint | `Edificio_Ciudad_Nueva_Meridiano_FINAL.pptx` |
| PDF | `Edificio_Ciudad_Nueva_Meridiano_FINAL.pdf` |
| Diapositivas | 12 |

## Bloqueantes
- ❌ Datos materiales que requieren confirmación del usuario: 1

## Observaciones
- ⚠️ Posibles datos personales: revisar el contexto de cada coincidencia (puede ser un dato legítimo como una calle o un número de lote).
- ⚠️ Sin mapa cartográfico incrustado: la red del entorno bloqueó OpenStreetMap/Nominatim y otros servidores de teselas; se usó enlace + QR a Google Maps de la intersección.
- ⚠️ Tipo de cambio Gs 6.100 de la planilla, sin fecha: no es cotización actual; no hay TC alternativo autorizado.
- ⚠️ No hay fotos de interiores ni del local comercial.

## 1. Archivos recibidos

| Archivo | Tipo | Estado | Detalle |
|---|---|---|---|
| 1.jpg | image | ok | px: [1536, 1024] |
| 2.jpg | image | ok | px: [660, 201] |
| 3.jpg | image | ok | px: [1500, 1000] |
| 4.jpg | image | ok | px: [282, 461] |
| 5.jpg | image | ok | px: [1125, 750] |

## 2. Skills y fuentes de marca consultadas

- Skill: meridiano-property-presentation-adapter
- Skill: pptx
- Skill: xlsx
- Skill: meridiano-capital-identity (solo tono)
- Fuente: knowledge-base/brand/03-identidad-visual.md
- Fuente: knowledge-base/brand/04-tipografia.md
- Fuente: knowledge-base/brand/05-sistema-cromatico.md
- Fuente: knowledge-base/brand/09-cierres-y-firmas.md
- Fuente: knowledge-base/ai/03-sistema-de-consulta.md
- Fuente: assets/brand_tokens.json (snapshot 2026-09-25, D-098)
- Fuente: assets/logos/ (lockup trazado + isotipo D-034)
- Fuente: assets/fonts/ Fraunces Regular + Poppins (OFL)
- Decisión aplicada: D-034 isotipo vigente
- Decisión aplicada: D-036/D-040 Fraunces Regular sin negrita
- Decisión aplicada: Cierre tierra colorada (09-cierres-y-firmas)
- Decisión aplicada: Aviso legal 'venta' (D-098) + cláusula de no garantía de rentabilidad (aviso 'preventa_inversion', D-098)
- Decisión aplicada: [EXTENSION] título de firma según el brief del founder en lugar del título de la Variante A (D-039)
- Tokens de marca: `assets/brand_tokens.json` (snapshot 2026-09-25 (D-098))

## 3. Tipografía, logos y editabilidad

- Tipografías declaradas: Fraunces, Poppins
- Fuentes incrustadas en el PDF: Fraunces-Regular, Poppins-Bold, Poppins-Italic, Poppins-Regular
- Logos vectoriales (SVG) en el archivo: 12
- Elementos editables: 150 textos, 4 tablas, 1 gráficos, 40 formas; 16 imágenes
- Diapositivas aplanadas: ninguna

## 4. Imágenes

- Verificadas: 16 · desviación máxima de proporción: **0.0010%** (tolerancia 0.5%) · resultado: **OK**

## 5. Datos comerciales

- Resultado de la validación: **REQUIERE_CONFIRMACION** · monedas: PYG, USD
- `bruto_check`: alquiler_mensual_gs / tc * 12 = 38459.016393 → coincide (declarado 38.459)
- `neto_check`: alquiler_mensual_gs / tc * 12 - impuesto_anual - gastos_anuales = 34495.016393 → coincide (declarado 34.495)
- `rent_bruta_check`: (alquiler_mensual_gs / tc * 12) / precio * 100 = 11.311475 → coincide (declarado 11,31)
- `rent_neta_check`: (alquiler_mensual_gs / tc * 12 - impuesto_anual - gastos_anuales) / precio * 100 = 10.145593 → coincide (declarado 10,15)
- ❓ superficie: sin dato de 'superficie' para una operación de venta: no inventarlo; omitir la sección o pedirlo
- ⚠️ moneda: monedas mixtas ['PYG', 'USD']: no convertir ni sumar sin tipo de cambio documentado
- Campos pendientes (fuera de la presentación): ['superficie']

## 6. Contradicciones

- ✅ resuelta · composicion: Mix informado: 13 dptos + 1 local. Detalle de alquileres: 13 filas de dptos + 'Cochera' + 'Cochera y dpto'; el local no figura expresamente.
- ✅ resuelta · descripcion_ingresos: La descripción llama 'ingreso anual' a USD 34.500 y 'bruta' al 10,15%: son el resultado neto según gastos informados (USD 34.495) y su rentabilidad. Bruto recalculado: USD 38.459 / 11,31%.

## 7. Cambios de redacción (sin cambio de significado)
- 'Cochera y dpto' → 'Cochera y departamento' (presentación); texto literal conservado en el Excel

## 8. Barrido de datos personales (revisión humana obligatoria)

- diap. 1: teléfono no autorizado → `143028006-118`
- diap. 2: número con formato de CI/RUC → `19.550.000`
- diap. 4: número con formato de CI/RUC → `5.300.000`
- diap. 4: número con formato de CI/RUC → `7.350.000`
- diap. 4: número con formato de CI/RUC → `2.900.000`
- diap. 4: número con formato de CI/RUC → `4.000.000`
- diap. 4: número con formato de CI/RUC → `19.550.000`
- diap. 6: número con formato de CI/RUC → `19.550.000`
- diap. 6: número con formato de CI/RUC → `1.500.000`
- diap. 6: número con formato de CI/RUC → `1.500.000`
- diap. 6: número con formato de CI/RUC → `1.200.000`
- diap. 6: número con formato de CI/RUC → `1.100.000`
- diap. 6: número con formato de CI/RUC → `1.600.000`
- diap. 6: número con formato de CI/RUC → `1.500.000`
- diap. 6: número con formato de CI/RUC → `1.500.000`
- diap. 6: número con formato de CI/RUC → `1.500.000`
- diap. 6: número con formato de CI/RUC → `1.250.000`
- diap. 6: número con formato de CI/RUC → `1.300.000`
- diap. 6: número con formato de CI/RUC → `1.600.000`
- diap. 6: número con formato de CI/RUC → `1.200.000`
- diap. 6: número con formato de CI/RUC → `1.200.000`
- diap. 6: número con formato de CI/RUC → `19.550.000`
- diap. 7: número con formato de CI/RUC → `19.550.000`
- diap. 9: teléfono no autorizado → `143028006-118`
- diap. 9: número con formato de CI/RUC → `19.550.000`
- diap. 12: teléfono no autorizado → `143028006-118`
- diap. notas 1: teléfono no autorizado → `143028006-118). 1`
- diap. notas 2: número con formato de CI/RUC → `19.550.000`
- diap. notas 2: teléfono no autorizado → `143028006-118). 2`
- diap. notas 6: número con formato de CI/RUC → `19.550.000`

## 9. Render

- PDF: 12 páginas / 12 diapositivas · OK
- PNG de revisión: 12 + vista general `00_vista_general.png`

## 10. Revisión visual (diapositiva por diapositiva)
- d1: vista aérea en modo panel (sin recorte) para conservar el contorno rojo de la fuente
- d3: el QR con hipervínculo hacía desaparecer imágenes al renderizar; se quitó el hipervínculo de la imagen y se mantuvo el enlace de texto
- d4: rótulos del gráfico pasados a miles de Gs con separador es-PY; fila total acortada
- d7: viñetas reemplazadas por lista con filetes (evita OpenSymbol en el PDF); última fila de la tabla en petróleo sin cortes
- d8: etiqueta de rentabilidad neta acortada (se superponía con la línea de base)
- d11: espaciado de filas reducido para separar la nota final
- Revisión final de las 12 diapositivas y de la vista general sin defectos

## 11. Preguntas para el usuario
1. superficie: sin dato de 'superficie' para una operación de venta: no inventarlo; omitir la sección o pedirlo
2. ¿A qué unidad corresponde 'Cochera y dpto' (Gs 1.200.000) y dónde está incluido el alquiler del local comercial?
3. ¿Algún concepto agrupa unidades o duplica ingresos?
4. Fecha de vigencia de los alquileres y del tipo de cambio Gs 6.100.
5. Contratos vigentes, ocupación real y cobros efectivos (12 meses).
6. ¿Qué cubren los USD 2.764 de impuesto y los USD 1.200 de gastos?
7. Superficie de terreno y construida, antigüedad, situación registral (no informadas: fuera de la presentación).
8. Retrato autorizado jjc_retrato.jpg no está en el repo: cierre sin foto.

## 12. Limitaciones
- Fotos de 1125–1536 px de ancho: aptas para pantalla y PDF; impresión grande limitada
