# Validación: Edificio Ciudad Nueva

**Resultado: NO APROBADO**

| Campo | Valor |
|---|---|
| Operación | Venta |
| Tipo de activo | edificio de renta (13 departamentos + 1 local comercial) |
| Audiencia | inversor |
| Rol de Meridiano Capital | comercialización y asesoramiento al inversor (pedido del founder) |
| Modo de trabajo | C |
| Firma aplicada | U_brief_founder (Broker Inmobiliario | Meridiano Capital) + retrato JJC (D-099) |
| PowerPoint | `Edificio_Ciudad_Nueva_Meridiano_FINAL.pptx` |
| PDF | `Edificio_Ciudad_Nueva_Meridiano_FINAL.pdf` |
| Diapositivas | 15 |

## Bloqueantes
- ❌ Datos materiales que requieren confirmación del usuario: 1

## Observaciones
- ⚠️ Posibles datos personales: revisar el contexto de cada coincidencia (puede ser un dato legítimo como una calle o un número de lote).
- ⚠️ TC del día obtenido de resultados de búsqueda (BCP/ABC Color); las páginas originales están bloqueadas por la red del entorno
- ⚠️ Datos de mercado de alquiler: avisos InfoCasas (categoría C)
- ⚠️ Plusvalía y proyección: escenarios hipotéticos rotulados

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
- Decisión aplicada: D-099 retrato de JJC en el cierre
- Decisión aplicada: D-100 tipo de cambio del día con fecha
- Decisión aplicada: D-101 supuestos del caso (vacancia 3%, administración 8%, mantenimiento 5%, IVA 5/10)
- Decisión aplicada: D-001 IVA alquiler
- Decisión aplicada: D-082/D-083 IVA de venta 1,5%
- Decisión aplicada: Aviso legal 'venta' + no garantía de rentabilidad (D-098 snapshot)
- Decisión aplicada: [EXTENSION] título de firma según el brief del founder
- Tokens de marca: `assets/brand_tokens.json` (snapshot 2026-09-25 (D-098))

## 3. Tipografía, logos y editabilidad

- Tipografías declaradas: Fraunces, Poppins
- Fuentes incrustadas en el PDF: Fraunces-Regular, Poppins-Bold, Poppins-Italic, Poppins-Regular
- Logos vectoriales (SVG) en el archivo: 15
- Elementos editables: 184 textos, 6 tablas, 2 gráficos, 38 formas; 20 imágenes
- Diapositivas aplanadas: ninguna

## 4. Imágenes

- Verificadas: 20 · desviación máxima de proporción: **0.0010%** (tolerancia 0.5%) · resultado: **OK**

## 5. Datos comerciales

- Resultado de la validación: **REQUIERE_CONFIRMACION** · monedas: PYG, USD
- `bruto_check`: alquiler_mensual_gs / tc * 12 = 39945.513366 → coincide (declarado 39.946)
- `neto_check`: (alquiler_mensual_gs / tc * 12 * (1 - 0.03 - 0.08 - 0.05) - iva_mensual_gs / tc * 12 - gastos_anuales) * 0.9 = 27146.562234 → coincide (declarado 27.147)
- `rent_bruta_check`: (alquiler_mensual_gs / tc * 12) / precio * 100 = 11.74868 → coincide (declarado 11,75)
- `rent_neta_check`: ((alquiler_mensual_gs / tc * 12 * (1 - 0.03 - 0.08 - 0.05) - iva_mensual_gs / tc * 12 - gastos_anuales) * 0.9) / precio * 100 = 7.984283 → coincide (declarado 7,98)
- ❓ superficie: sin dato de 'superficie' para una operación de venta: no inventarlo; omitir la sección o pedirlo
- ⚠️ moneda: monedas mixtas ['PYG', 'USD']: no convertir ni sumar sin tipo de cambio documentado
- Campos pendientes (fuera de la presentación): ['superficie']

## 6. Contradicciones

- ✅ resuelta · local_comercial: El detalle de alquileres no nombra el local comercial; 'Cochera' y 'Cochera y dpto' se tratan a IVA 10% (criterio conservador).

## 7. Cambios de redacción (sin cambio de significado)
- 'Cochera y dpto' → 'Cochera y departamento' (presentación); texto literal conservado en el Excel

## 8. Barrido de datos personales (revisión humana obligatoria)

- diap. 1: teléfono no autorizado → `143028006-118`
- diap. 2: número con formato de CI/RUC → `19.550.000`
- diap. 7: número con formato de CI/RUC → `19.550.000`
- diap. 10: número con formato de CI/RUC → `1.158.333`
- diap. 10: número con formato de CI/RUC → `1.516.667`
- diap. 12: teléfono no autorizado → `143028006-118`
- diap. 12: número con formato de CI/RUC → `19.550.000`
- diap. 15: teléfono no autorizado → `143028006-118`
- diap. notas 3: teléfono no autorizado → `2026-09-23.1`

## 9. Render

- PDF: 15 páginas / 15 diapositivas · OK
- PNG de revisión: 15 + vista general `00_vista_general.png`

## 10. Revisión visual (diapositiva por diapositiva)
- d3: mapa propio desde OSM/Overture, rótulos corregidos en 3 iteraciones
- d4/d8: espaciados corregidos tras el 1.er render
- d2: barra inferior acortada a una línea
- Revisión de las 15 diapositivas y vista general sin defectos

## 11. Preguntas para el usuario
1. superficie: sin dato de 'superficie' para una operación de venta: no inventarlo; omitir la sección o pedirlo
2. Confirmar cuál fila del detalle corresponde al local comercial (impacta solo en la asignación del IVA 10%).
3. Superficie de terreno y construida (no informada; fuera de la presentación).

## 12. Limitaciones
- Fotos de 1125–1536 px de ancho: aptas para pantalla y PDF; impresión grande limitada
