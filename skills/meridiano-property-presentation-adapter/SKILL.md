---
name: meridiano-property-presentation-adapter
description: Adapta archivos reales de presentaciones y documentación inmobiliaria al sistema institucional de Meridiano Capital y entrega PowerPoint editable, PDF, PNG de revisión e informe de validación. Usar únicamente cuando el usuario adjunte o indique una ruta válida hacia un archivo PPTX, PPT, PDF, DOCX, XLSX, CSV, plano o conjunto de imágenes de una propiedad (departamento, casa, oficina, local, edificio, terreno, desarrollo o pozo, nave, centro logístico, hotel, campo, activo de inversión o cartera) y pida crear, rediseñar, adaptar, normalizar o aplicar la marca o Brand OS de Meridiano a una presentación o deck comercial. No usar para solicitudes sin archivos, ideas o consejos sobre cómo presentar, redacción aislada de copies, preguntas sobre la identidad de Meridiano, edición fotográfica independiente ni presentaciones hipotéticas desde cero o con archivos que todavía no se enviaron.
compatibility: Requiere Python 3 con Pillow y lxml, Node con pptxgenjs, jszip y sharp, LibreOffice (Impress; Calc/Writer solo para convertir .xls/.doc) y Poppler (pdfinfo, pdftotext, pdfimages, pdftoppm, pdffonts).
---

# Adaptador de presentaciones inmobiliarias — Meridiano Capital

Convierte el material real de una propiedad en una presentación corporativa de Meridiano Capital: misma información aprobada, identidad vigente, imágenes sin deformar, datos verificados y trazables.

## Regla de entrada: sin archivo no hay proceso

Antes de hacer cualquier otra cosa, confirmar que existe al menos un archivo accesible:

```bash
python scripts/inspect_inputs.py <archivos o carpetas> --workdir <trabajo> --prepare-images --out <trabajo>/inventario.json
```

Si no hay archivos o el script sale con código 2, responder solo esto y detenerse (no generar nada, no inventar datos, fotos, planos ni precios):

> Para adaptar la presentación a Meridiano Capital necesito que adjuntes el archivo fuente. Puedes enviar una presentación PowerPoint, PDF, documento, planilla, plano o conjunto de imágenes de la propiedad.

Trabajar siempre sobre copias (`<trabajo>/fuentes/`); los originales no se tocan.

## Principios (por qué importan)

- **Los archivos del usuario son la única fuente de datos de la propiedad.** Una presentación comercial circula y compromete: un precio o una superficie inventados es un problema legal y de confianza. Nada de casos anteriores (Puerto Fénix, UON Calathea, Habitalis, Aura, WTC…) como contenido; sirven solo como ejemplo de estructura.
- **Cada dato tiene fuente y estado** (`confirmado`, `calculado`, `inferido`, `pendiente`). Lo inferido no se presenta como hecho; lo pendiente queda fuera y se registra.
- **Nunca corregir en silencio.** Las contradicciones se resuelven por jerarquía (`references/source_priority.md`) y se informan; las materiales de igual jerarquía se preguntan.
- **Tolerancia cero a la deformación** de fotos, planos, mapas, logos y retratos. Lo decide el script, no la vista.
- **Marca vigente, no de memoria.** El repo Meridiano-Capital (capa `CURRENT`) manda; esta skill trae un snapshot en `assets/` para trabajar fuera del repo.
- **Meridiano figura con su rol real** (captador, intermediario, asesor, desarrollador…), tomado de los documentos. Nunca como dueño o desarrollador de un activo de terceros sin respaldo.

## Flujo

Leer `references/workflow.md` (flujo completo y comandos) al empezar. Resumen:

1. **Preflight** — `inspect_inputs.py`. Convertir `.ppt`/`.xls` sobre la copia. Informar archivos dañados o protegidos.
2. **Extracción** — `extract_presentation_content.py` + lectura de imágenes y planos → `matriz.json` con fuente, `source_rank` y estado de cada dato. Clasificar activo, operación, audiencia y rol con `references/property_types.md`.
3. **Validación comercial** — `validate_property_data.py` (formato de la matriz y reglas en `references/commercial_validation.md`). Código 3 = preguntar solo lo material.
4. **Narrativa** — `references/narrative_patterns.md`: solo secciones respaldadas por los archivos; sin cantidad fija de diapositivas.
5. **Construcción** — script propio de la propiedad sobre `scripts/meridiano_deck_kit.js` (logos, tipografías, colores, recorte sin deformación, tablas, pies, cierre con la firma del rol).
6. **QA y entrega** — `validate.py` (skill `pptx`), `validate_image_aspect_ratios.py`, `render_presentation.py`, revisión de **cada** PNG y de la vista general con `references/visual_qa.md`, y `build_validation_report.py`. Corregir y repetir hasta que no haya defectos.

### Modo según los archivos

- **A — hay un .pptx/.ppt**: conservar toda la información aprobada (textos, cifras, advertencias, fotos, notas), reconstruir con el kit aplicando la marca y reordenar solo si hace falta, documentándolo.
- **B — PDF, Word, Excel o documentación técnica sin presentación**: extraer, organizar en una narrativa y construir una presentación nueva con trazabilidad en las notas del orador.
- **C — archivos mixtos (fotos, planos, planillas, documentos)**: inventariar, vincular cada dato con su imagen correcta, construir y señalar los datos faltantes que impidan una cotización o conclusión.

## Marca

Resolver las fuentes en este orden (detalle en `references/workflow.md` §1):
1. Repo Meridiano-Capital, si está disponible: `knowledge-base/brand/` (03 logo, 04 tipografía, 05 color, 09 cierres y firmas) y `governance/decisions/DECISION_REGISTER.md`. Si una decisión `CURRENT` contradice el snapshot, gana el repo.
2. Snapshot de esta skill: `assets/brand_tokens.json`, `assets/logos/` (isotipo D-034 y lockup vectorial), `assets/fonts/` (Fraunces y Poppins, OFL). Si las tipografías no están instaladas, instalar estas (`~/.fonts` + `fc-cache`) antes de renderizar.
3. Skill `meridiano-capital-identity` para tono, ADN y reglas de presentaciones. Sus logos y su tipografía de titulares son anteriores a D-034/D-036: no usarlos. Cualquier mención de Lora (en esa skill o en archivos del repo) está superada: Fraunces Regular, nunca en negrita.

Si falta un activo fundamental (logos vigentes, tokens, tipografías o sus sustitutos oficiales), detener la producción final e indicar exactamente qué falta. Lo que la marca no define se marca `[EXTENSION]` en el informe.

## Datos personales

Seguir `references/privacy_rules.md` (y `governance/PII_POLICY.md` si está el repo). Nada de documentos de identidad, firmas, datos bancarios, contratos completos ni datos de inquilinos en la presentación ni en las notas.

## Cuándo preguntar

Solo cuando falte o se contradiga algo que cambia materialmente la pieza: identidad del activo, tipo de operación, precio, superficie, moneda, rol de Meridiano, datos de contacto o condiciones legales o comerciales esenciales. Para todo lo demás, avanzar: dejar el campo fuera y registrarlo en el informe. Lo que el usuario dice en su pedido cuenta como dato (rank 1), y la firma sale de una regla (`signature_rules`): ninguna de las dos cosas se pregunta. Los datos faltantes nunca aparecen dentro de la presentación; van al informe (`questions`) y al resumen final.

## Entregables

- `Meridiano_Capital_[Propiedad]_[Operacion]_Final.pptx` (editable) y `.pdf` (fuentes incrustadas). Usar `deliverableName()` del kit con el nombre real del activo.
- `revision_[propiedad]/` con un PNG por diapositiva y `00_vista_general.png`.
- `VALIDACION_[PROPIEDAD].md`: archivos recibidos, skills y fuentes de marca consultadas, tipografías, logos, cantidad de diapositivas, datos verificados, contradicciones, advertencias, validación de imágenes y de editabilidad, resultado final.

No dar el trabajo por terminado con el informe en NO APROBADO ni sin haber mirado todas las diapositivas renderizadas. Al entregar, resumir en pocas líneas qué se adaptó, qué quedó fuera por falta de datos y qué requiere confirmación.
