# Edificio Catedral (Ciudad del Este) — presentación para inversores

Edificio de renta de uso mixto en Pampliega casi Av. Mayor Rivas Ortellado, Barrio Catedral, en venta a USD 960.000. Tiene 12 departamentos, 3 salones y 12 cocheras sobre 700 m² de terreno, con 2.290 m² construidos informados.

## Entregables (`entregables/`)
| Archivo | Contenido |
|---|---|
| `Edificio_Catedral_Meridiano_FINAL.pptx` | Presentación editable de 14 láminas (kit de la skill `meridiano-property-presentation-adapter`) |
| `Edificio_Catedral_Meridiano_FINAL.pdf` | PDF generado desde el PPTX final, con las fuentes incrustadas |
| `Edificio_Catedral_Rentabilidad.xlsx` | Parámetros, datos del PDF, hipótesis de locales, escenarios, sensibilidad al tipo de cambio, auditoría de la fuente y gastos pendientes, todo con fórmulas |
| `Edificio_Catedral_Control_Interno.md` | Fuentes, cálculos, supuestos, auditoría, pendientes y la matriz de marca de 10 criterios |
| `Edificio_Catedral_Respuestas_Asesor.md` | Respuestas breves a las consultas previsibles de un inversor |

## Cómo regenerar
```bash
python projects/meridiano-capital/presentaciones/build_presentaciones.py   # todas las presentaciones, Catedral incluida
python projects/meridiano-capital/presentaciones/edificio-catedral/fuente/build_entregables.py   # solo Catedral
```
- **Tipo de cambio y teléfono:** salen de `../_config/meridiano.json` (D-096/D-097).
- **Requisitos:**
  - Node con `pptxgenjs`, `jszip` y `sharp` en `production/generadores/` (`npm install`).
  - El kit de la skill: variable `MC_DECK_KIT` si no está en la ruta por defecto.
  - LibreOffice.
  - Las fuentes Fraunces, Poppins y Lora instaladas.
- **Archivos:**
  - `fuente/model.py`: cifras únicas.
  - `production/generadores/build_edificio_catedral_presentacion.js`: el PPTX.
  - `fuente/build_excel.py`: el Excel.
  - `fuente/build_docs.py`: los dos documentos.

## Resultados (TC Gs 6.060,86, BCP referencial del 03/11/2026)
| | Mensual | Anual | Bruta |
|---|---:|---:|---:|
| Residencial informado (12 × Gs 3.000.000) | Gs 36.000.000 | Gs 432.000.000 | 7,42% |
| Total proyectado con 3 locales a Gs 3.000.000 (hipótesis) | Gs 45.000.000 | Gs 540.000.000 | 9,28% |

La rentabilidad neta no se calcula hasta tener los gastos. Las cifras publicadas por la fuente (7% "comprobada" y 9,75%) se auditan en el control interno y no se presentan (D-099).

## Fuente
El PDF de terceros "Edificio Departamentos Catedral" no se versiona: su autor figura en los metadatos. Del PDF se tomaron:
- el texto (transcripto en el control interno);
- las imágenes del entorno y la vista desde altura (`fuente/img/`).

Se descartó una foto con una patente legible.
