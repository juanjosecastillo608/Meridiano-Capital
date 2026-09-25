# Flujo completo (Fases 1–6)

Contenido
1. Resolución de fuentes de marca
2. Fase 1 — Preflight
3. Fase 2 — Extracción y matriz de datos
4. Fase 3 — Validación comercial
5. Fase 4 — Arquitectura narrativa
6. Fase 5 — Construcción con el kit
7. Fase 6 — QA y entregables
8. Cuándo detenerse y preguntar

---

## 1. Resolución de fuentes de marca

La marca tiene una fuente viva: el repo `Meridiano-Capital`. Esta skill trae un **snapshot** (`assets/brand_tokens.json`, `assets/logos/`, `assets/fonts/`) para poder trabajar fuera de ese repo. Orden de autoridad:

1. **Repo Meridiano-Capital**, si está en el filesystem (buscar `knowledge-base/brand/` y `governance/decisions/DECISION_REGISTER.md`):
   - `knowledge-base/ai/01-protocolo-de-prioridad.md` → regla de prioridad ante conflicto.
   - `knowledge-base/brand/03-identidad-visual.md`, `04-tipografia.md`, `05-sistema-cromatico.md` → logo, tipografía, color.
   - `knowledge-base/brand/09-cierres-y-firmas.md` → firma y cierre (variantes A/B D-039, C D-096).
   - `DECISION_REGISTER.md` → decisiones `CURRENT` posteriores al snapshot (fecha en `brand_tokens.json`). Si una contradice el snapshot, **gana el repo**: actualizar la pieza y avisar que el snapshot quedó desactualizado.
   - `governance/PII_POLICY.md` → datos personales.
2. **Snapshot de esta skill** (`assets/`), si el repo no está disponible.
3. **Skill `meridiano-capital-identity`** para lo verbal y estratégico (ADN, tono, módulo 10 de presentaciones, matriz de decisión). Atención: sus logos y su tipografía de titulares (triángulo simétrico / Lora) son **anteriores** a D-034/D-036 → para logo y tipografía usar siempre el snapshot o el repo, nunca esos archivos.
4. **Skill `pptx`** para la mecánica de PowerPoint (pptxgenjs, validate.py, edición XML).

"Brand OS 2.1" no existe como documento separado: la capa `CURRENT` del repo cumple ese rol. No inventar reglas: lo que no esté definido se marca `[EXTENSION]` en el informe.

Si faltan activos fundamentales (logos vigentes, tokens de color, tipografías o sus sustitutos oficiales), **detener la producción final** e informar exactamente qué archivo falta.

## 2. Fase 1 — Preflight

```bash
python scripts/inspect_inputs.py <archivos o carpetas> --workdir <trabajo> --prepare-images --out <trabajo>/inventario.json
```

- Código 2 = no hay archivos válidos → responder con el mensaje de "sin archivo" y detenerse.
- Trabajar siempre sobre `<trabajo>/fuentes/` (copias). Nunca escribir sobre los originales.
- `.ppt`/`.xls` → convertir la copia: `soffice --headless --convert-to pptx|xlsx --outdir <trabajo>/fuentes <copia>`. La conversión de `.xls` necesita LibreOffice Calc y la de `.doc`, Writer; si faltan, pedir el archivo en formato moderno.
- Archivos `damaged`/`protected` → informar; si eran la fuente principal, pedir otra versión.
- Usar las imágenes de `<trabajo>/imagenes/` (orientación EXIF aplicada; WEBP/TIFF convertidos).
- `suggested_mode`: A (hay .pptx/.ppt), B (solo documentos), C (fotos/planos sueltos + otros). Confirmar con el contenido real.

## 3. Fase 2 — Extracción y matriz de datos

```bash
python scripts/extract_presentation_content.py <trabajo>/fuentes/* --extract-media <trabajo>/media --out <trabajo>/contenido.json
```

Con `contenido.json` + lectura visual de imágenes/planos, armar `<trabajo>/matriz.json` (formato en `commercial_validation.md`). Cada dato lleva `source` (archivo + diapositiva/página/hoja/celda), `source_rank` (jerarquía, `source_priority.md`) y `status`: `confirmado` (literal en una fuente), `calculado` (derivado de datos confirmados), `inferido` (visual o deducido: nunca se presenta como hecho) o `pendiente` (falta: queda fuera de la presentación).

Clasificar la propiedad, la operación, la audiencia y el rol de Meridiano (`property_types.md`). El rol se toma de los documentos; si no surge y cambia la propuesta (firma, cierre, honorarios), preguntar.

## 4. Fase 3 — Validación comercial

```bash
python scripts/validate_property_data.py <trabajo>/matriz.json --out <trabajo>/validacion_datos.json
```

- 0 → continuar. 1 → hay errores: corregir la **matriz** si fue un error de transcripción propio; si la fuente misma tiene un cálculo inconsistente, mostrar el dato de la fuente, no "arreglarlo", y registrarlo. 3 → preguntar al usuario solo por los ítems de `needs_confirmation`.
- Un cálculo `*_no_confirmable` se presenta como estimación rotulada, o no se presenta.

## 5. Fase 4 — Arquitectura narrativa

Elegir secciones con `narrative_patterns.md`. Solo secciones respaldadas por datos o imágenes reales; sin cantidad fija de diapositivas. En Modo A conservar la secuencia aprobada salvo que la narrativa tenga un error evidente (documentarlo).

## 6. Fase 5 — Construcción con el kit

`scripts/meridiano_deck_kit.js` (requiere `pptxgenjs`, `jszip`, `sharp`; si faltan, `npm install` en la carpeta de trabajo). Escribir un script de construcción propio de la propiedad en `<trabajo>/build_deck.js`:

```js
const K = require("<ruta-skill>/scripts/meridiano_deck_kit.js");
const d = K.createDeck({ title: "…", footerLabel: "Meridiano Capital  ·  <Propiedad>  ·  <Operación>" });
let s = d.slide("dark");                                    // portada
d.photo(s, "<foto>", { x: 6.9, y: 0, w: d.W - 6.9, h: d.H }, { alt: "…", ax: 0.4 });
d.lockup(s, { x: d.M, y: 0.6, w: 2.55 });
d.eyebrow(s, "<tipo de operación>", { y: 2.3, w: 6 });
d.title(s, "<Nombre del activo>", { y: 2.7, w: 6, h: 1.8, fontSize: 44 });
s = d.slide("light"); d.eyebrow(s, "…"); d.title(s, "…"); /* contenido */ d.footer(s, 2);
d.closing({ headline: "…", lead: "…", signaturePreset: "C_captacion_alquiler", photo: "<retrato autorizado>",
            disclaimer: "…" });
await d.save(`<salida>/${K.deliverableName("<Propiedad>", "<Operacion>")}.pptx`);
```

Reglas del kit que no hay que romper:
- Imágenes siempre por `d.photo` (`cover` con ancla, o `contain` para planos/mapas/documentos). Nunca `addImage` con w/h arbitrarios.
- Títulos con `d.title`/`SERIF` (Fraunces, sin negrita). Cuerpo en Poppins. Colores solo de `d.C`.
- Márgenes 0,6"; pie y numeración con `d.footer` en todas las diapositivas de contenido (portada y cierre sin número).
- Lockup solo en portada y cierre; isotipo en los pies.
- Cifras destacadas con `d.figure`; tablas con `d.table` (tabla nativa, editable).
- Mapas: `hyperlink` con el enlace de la fuente cuando exista; mostrar además la URL corta para lectura impresa.
- Notas del orador (`s.addNotes`) con la fuente de cada dato y los cambios hechos: trazabilidad.
- **Modo A**: reconstruir con el kit a partir del contenido extraído (no editar el XML del original, salvo pedido explícito de conservar el archivo). Mantener todos los textos, cifras, advertencias y fotos aprobados.

Cierre: `signaturePreset` según el rol (`property_types.md` → tabla de firma). `A_venta_deck` para venta/inversión propia, `B_investment_memorandum` para un IM, `C_captacion_alquiler` cuando Meridiano capta propiedades en alquiler (D-096). Otro caso → aplicar A y marcarlo en el informe para confirmar.

## 7. Fase 6 — QA y entregables

```bash
python <pptx-skill>/scripts/office/validate.py <salida>.pptx                      # estructura (skill pptx)
python scripts/validate_image_aspect_ratios.py <salida>.pptx --out <trabajo>/aspecto.json
python scripts/render_presentation.py <salida>.pptx --outdir <salida>/revision_<slug> --pdf <salida>.pdf > <trabajo>/render.json
python scripts/build_validation_report.py --pptx <salida>.pptx --pdf <salida>.pdf --inventory <trabajo>/inventario.json \
   --data <trabajo>/validacion_datos.json --aspect <trabajo>/aspecto.json --render <trabajo>/render.json \
   --meta <trabajo>/meta.json --out <salida>/VALIDACION_<PROPIEDAD>.md
```

Luego mirar **cada** PNG y la vista general con los criterios de `visual_qa.md`. Corregir → reconstruir → repetir todo el bloque hasta que el informe dé APROBADO o APROBADO CON OBSERVACIONES y la revisión visual no tenga defectos. `meta.json` lleva lo que los scripts no pueden saber (skills consultadas, fuentes de marca, rol, firma, decisiones aplicadas, cambios de redacción, contradicciones, limitaciones).

Entregables: `Meridiano_Capital_[Propiedad]_[Operacion]_Final.pptx` y `.pdf`, `revision_[propiedad]/` (PNG + vista general), `VALIDACION_[PROPIEDAD].md`. Si se trabaja dentro del repo, guardarlos en `projects/<slug>/entregables/` y el script de construcción en `production/generadores/`.

## 8. Cuándo detenerse y preguntar

Solo si falta o se contradice algo que cambia materialmente la pieza: identidad del activo, tipo de operación, precio, superficie, moneda, rol de Meridiano, datos de contacto o condiciones legales/comerciales esenciales. Todo lo demás: dejar el campo fuera, registrarlo en el informe y seguir.
