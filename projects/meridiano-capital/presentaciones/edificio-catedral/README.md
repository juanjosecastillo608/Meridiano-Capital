# Edificio Catedral (Ciudad del Este) — presentación para inversores

Edificio de renta de uso mixto en Pampliega casi Av. Mayor Rivas Ortellado, Barrio Catedral, en venta a USD 960.000. Meridiano Capital sugiere un precio de venta rápida de USD 800.000. La ubicación está confirmada: https://maps.app.goo.gl/uPDUSU5wzgi6K3iNA. Tiene 12 departamentos de 150 m², 3 salones (1 alquilado y 2 desocupados) y 12 cocheras sobre 700 m² de terreno, con 2.290 m² construidos informados.

## Entregables (`entregables/`)
| Archivo | Contenido |
|---|---|
| `Edificio_Catedral_Meridiano_FINAL.pptx` | Presentación editable de 16 láminas, dos de ellas de mercado (kit de la skill `meridiano-property-presentation-adapter`) |
| `Edificio_Catedral_Meridiano_FINAL.pdf` | PDF generado desde el PPTX final, con las fuentes incrustadas |
| `Edificio_Catedral_Rentabilidad.xlsx` | Parámetros, datos del PDF, hipótesis de locales, escenarios (informado, central, inferior y superior), sensibilidad al tipo de cambio y a cánones u ocupación, comparables con enlaces, auditoría de la fuente y gastos pendientes, todo con fórmulas |
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

## Resultados (TC Gs 6.480,35, BCP referencial del 06/11/2026)
| Bruta | Renta anual | USD 960.000 (publicado) | USD 800.000 (venta rápida sugerida) |
|---|---:|---:|---:|
| Actual: 12 dptos. y 1 salón (canon del salón: hipótesis) | Gs 468.000.000 | 7,52% · 13,3 años | 9,03% · 11,1 años |
| Solo los departamentos (informado) | Gs 432.000.000 | 6,94% · 14,4 años | 8,33% · 12,0 años |
| Potencial: con los 2 salones desocupados alquilados | Gs 540.000.000 | 8,68% · 11,5 años | 10,42% · 9,6 años |

Los años corresponden a la recuperación simple bruta. Los escenarios inferior y superior del estudio, a los dos precios, están en el Excel y en el control interno.

**Mercado** (estudio `CDE-CATEDRAL-2026-11-07`, en `knowledge-base/investment/market-intelligence/estudios/`):
- Departamentos de 3 dormitorios: mediana de Gs 5,1 M; las unidades estándar van de Gs 3,0 a 6,0 M. El canon del edificio está dentro del mercado, en la banda baja.
- Salones: mediana de Gs 3,0 M. La hipótesis de Gs 3.000.000 por salón está en la mediana.

La rentabilidad neta no se calcula hasta tener los gastos. Las cifras publicadas por la fuente (7% "comprobada" y 9,75%) se auditan en el control interno y no se presentan (D-099).

## Fuente
El PDF de terceros "Edificio Departamentos Catedral" no se versiona: su autor figura en los metadatos. Del PDF se tomaron:
- el texto (transcripto en el control interno);
- las imágenes del entorno y la vista desde altura (`fuente/img/`).

Se descartó una foto con una patente legible.
