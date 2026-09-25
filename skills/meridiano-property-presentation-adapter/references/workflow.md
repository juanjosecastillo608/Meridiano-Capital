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
   - Cualquier archivo (del repo o de otra skill) que todavía mencione **Lora** para titulares o firma está superado por D-036/D-040: titulares y nombre de firma en **Fraunces Regular**, nunca en negrita. "Isotipo inverso + MERIDIANO CAPITAL" en el cierre = el lockup inverso del kit.
3. **Skill `meridiano-capital-identity`** para lo verbal y estratégico (ADN, tono, módulo 10 de presentaciones, matriz de decisión). Atención: sus logos y su tipografía de titulares (triángulo simétrico / Lora) son **anteriores** a D-034/D-036 → para logo y tipografía usar siempre el snapshot o el repo, nunca esos archivos.
4. **Skill `pptx`** para la mecánica de PowerPoint (pptxgenjs, validate.py, edición XML).

"Brand OS 2.1" no existe como documento separado: la capa `CURRENT` del repo cumple ese rol. No inventar reglas: lo que no esté definido se marca `[EXTENSION]` en el informe.

Si faltan activos fundamentales (logos vigentes, tokens de color, tipografías o sus sustitutos oficiales), **detener la producción final** e informar exactamente qué archivo falta.

## 2. Fase 1 — Preflight

**Carpetas.** `<salida>` = la carpeta que indique el usuario; si no indica ninguna, una carpeta nueva junto a los archivos fuente (o dentro del directorio de trabajo) con el nombre del activo. `<trabajo>` = `<salida>/trabajo/` (inventario, contenido, matriz, validaciones, meta, copias, media). Dentro del repo Meridiano-Capital: `<salida>` = `projects/<slug>/entregables/` y el script de construcción va a `production/generadores/build_<slug>_presentacion.js`.

**Tipografías.** Si `fc-list | grep -i -e fraunces -e poppins` no devuelve ambas familias, copiar `assets/fonts/*.ttf` a `~/.fonts/` y correr `fc-cache -f`. Si ya hay otra instancia de Fraunces instalada, alcanza: el nombre de familia es el mismo.

```bash
python scripts/inspect_inputs.py <archivos o carpetas> --workdir <trabajo> --prepare-images --out <trabajo>/inventario.json
```

- Código 2 = no hay archivos válidos → responder con el mensaje de "sin archivo" y detenerse.
- Trabajar siempre sobre `<trabajo>/fuentes/` (copias). Nunca escribir sobre los originales.
- `.ppt`/`.xls` → convertir la copia: `soffice --headless --convert-to pptx|xlsx --outdir <trabajo>/fuentes <copia>`. La conversión de `.xls` necesita LibreOffice Calc y la de `.doc`, Writer; si faltan, pedir el archivo en formato moderno.
- Archivos `damaged`/`protected` → informar; si eran la fuente principal, pedir otra versión.
- Usar las imágenes de `<trabajo>/imagenes/` (orientación EXIF aplicada; WEBP/TIFF convertidos).
- Las imágenes **incrustadas** en un .pptx/.pdf/.docx salen en la Fase 2 con `--extract-media <trabajo>/media`. Normalizarlas igual que las sueltas: `python scripts/inspect_inputs.py <trabajo>/media --workdir <trabajo>/media_prep --prepare-images --out <trabajo>/inventario_media.json` y usar `<trabajo>/media_prep/imagenes/`.
- `suggested_mode`: A (hay .pptx/.ppt), B (solo documentos), C (fotos/planos sueltos + otros). Confirmar con el contenido real.

## 3. Fase 2 — Extracción y matriz de datos

```bash
python scripts/extract_presentation_content.py <trabajo>/fuentes/* --extract-media <trabajo>/media --out <trabajo>/contenido.json
```

Con `contenido.json` + lectura visual de imágenes/planos, armar `<trabajo>/matriz.json` (formato en `commercial_validation.md`). Cada dato lleva `source` (archivo + diapositiva/página/hoja/celda), `source_rank` (jerarquía, `source_priority.md`) y `status`: `confirmado` (literal en una fuente), `calculado` (derivado de datos confirmados), `inferido` (visual o deducido: nunca se presenta como hecho) o `pendiente` (falta: queda fuera de la presentación).

Clasificar la propiedad, la operación, la audiencia y el rol de Meridiano (`property_types.md`). El rol sale de los documentos **o del pedido del usuario** (lo que el usuario dice es evidencia de rank 1: "Meridiano actúa como intermediario", "tenemos en venta"). Solo si no surge de ninguno y cambia la propuesta (firma, cierre, honorarios), preguntar.

Planillas con fórmulas sin valor guardado (`uncached_formulas` en `contenido.json`): declararlas en `matriz.json` como `calculations` con la misma fórmula, o recalcular una copia con LibreOffice. Nunca dejar esas celdas como "sin dato".

## 4. Fase 3 — Validación comercial

```bash
python scripts/validate_property_data.py <trabajo>/matriz.json --out <trabajo>/validacion_datos.json
```

- 0 → continuar. 1 → hay errores: corregir la **matriz** si fue un error de transcripción propio; si la fuente misma tiene un cálculo inconsistente, mostrar el dato de la fuente, no "arreglarlo", y registrarlo. 3 → preguntar al usuario solo por los ítems de `needs_confirmation`.
- Un cálculo `*_no_confirmable` se presenta como estimación rotulada, o no se presenta.

## 5. Fase 4 — Arquitectura narrativa

Elegir secciones con `narrative_patterns.md`. Solo secciones respaldadas por datos o imágenes reales; sin cantidad fija de diapositivas.

**Datos faltantes: nunca dentro de la presentación.** Una pieza para clientes no muestra listas de "a confirmar" ni campos vacíos: la sección que no tiene datos no existe. Los faltantes van al informe (`questions` / `pending_fields`) y al resumen final para el usuario. Eso es lo que significa "señalar datos faltantes" en los modos B y C. En Modo A conservar la secuencia aprobada salvo que la narrativa tenga un error evidente (documentarlo).

## 6. Fase 5 — Construcción con el kit

`scripts/meridiano_deck_kit.js` (requiere `pptxgenjs`, `jszip`, `sharp`; si faltan, `npm install` en la carpeta de trabajo). Escribir un script de construcción propio de la propiedad en `<trabajo>/build_deck.js`:

```js
const K = require("<ruta-skill>/scripts/meridiano_deck_kit.js");
const d = K.createDeck({ title: "…", footerLabel: "Meridiano Capital  ·  <Propiedad>  ·  <Operación>" });
let s = d.cover({ photo: "<foto>", photoAlt: "…", eyebrow: "<tipo de operación>", title: "<Nombre del activo>",
                  subtitle: "<ubicación>", figures: [["<cifra>", "<etiqueta>"]],
                  footnote: "Comercialización a cargo de Meridiano Capital  ·  <fecha de la fuente>" });
// photoMode: "panel" si la foto tiene rótulos sobreimpresos cerca del borde o una proporción muy distinta del marco
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

Cierre: `signaturePreset` según `brand_tokens.json` → `signature_rules` (alquiler captado → C, D-096; venta/preventa/inversión/intermediación → A, D-039; IM → B). Es una regla, no una pregunta: registrarla en `decisions_applied`. Retrato: `brand_tokens.json` → `portrait` (usarlo solo si el archivo existe; si no, cierre sin foto).

`deliverableName(propiedad, operacion)`: propiedad = nombre comercial corto del activo tal como lo usa la fuente (2-4 palabras, sin códigos internos ni la palabra "Fixture/Borrador"); operación = Venta, Alquiler, Preventa, Inversion, Captacion, Desarrollo…

## 7. Fase 6 — QA y entregables

```bash
python <pptx-skill>/scripts/office/validate.py <salida>.pptx                      # estructura (skill pptx)
python scripts/validate_image_aspect_ratios.py <salida>.pptx --out <trabajo>/aspecto.json
python scripts/render_presentation.py <salida>.pptx --outdir <salida>/revision_<slug> --pdf <salida>.pdf > <trabajo>/render.json
python scripts/build_validation_report.py --pptx <salida>.pptx --pdf <salida>.pdf --inventory <trabajo>/inventario.json \
   --data <trabajo>/validacion_datos.json --aspect <trabajo>/aspecto.json --render <trabajo>/render.json \
   --meta <trabajo>/meta.json --out <salida>/VALIDACION_<PROPIEDAD>.md
```

Luego mirar **cada** PNG y la vista general con los criterios de `visual_qa.md`. Corregir → reconstruir → repetir todo el bloque hasta que el informe dé APROBADO o APROBADO CON OBSERVACIONES y la revisión visual no tenga defectos.

`meta.json` lleva lo que los scripts no pueden saber. Todas las claves son opcionales:

```json
{
  "property": "Casa Villa Morra", "operation": "Venta", "asset_type": "residencial",
  "audience": "comprador final", "meridiano_role": "intermediario (dicho por el usuario)", "mode": "A",
  "signature_preset": "A_venta_deck",
  "skills_consulted": ["meridiano-property-presentation-adapter", "pptx", "meridiano-capital-identity"],
  "brand_sources": ["knowledge-base/brand/05-sistema-cromatico.md", "assets/brand_tokens.json (snapshot)"],
  "decisions_applied": ["D-034 isotipo", "D-036/D-040 Fraunces sin negrita", "D-039 firma A (regla: venta)"],
  "contradictions": [{"field": "superficie", "detail": "240 m² (lista A) vs 255 m² (lista B)", "open": true}],
  "questions": ["¿La superficie correcta es 240 o 255 m²?"],
  "visual_qa": ["d1: recorte de portada anclado al edificio", "d4: tabla sin cortes; corregida tras el 1.er render"],
  "warnings": ["IVA no informado en la fuente"],
  "text_changes": ["'CI' → 'cédula de identidad'"],
  "limitations": ["Fotos de 480 px: aptas para pantalla, no para impresión grande"],
  "forbid": ["vendedor@inmobiliaria-x.com"], "allowed_emails": []
}
```

`contradictions[].open = true` bloquea el informe (NO APROBADO) hasta que el usuario responda; `questions` no bloquea (APROBADO CON OBSERVACIONES). Las preguntas de `needs_confirmation` de la validación de datos entran solas al informe: en `questions` poner solo las demás.

Aviso legal del cierre: usar el del repo si hay uno aprobado para el tipo de pieza; si no, `brand_tokens.json` → `disclaimers` (venta, alquiler, preventa/inversión), aprobados por el founder (D-098): registrarlo en `decisions_applied`.

Entregables: `Meridiano_Capital_[Propiedad]_[Operacion]_Final.pptx` y `.pdf`, `revision_[propiedad]/` (PNG + vista general), `VALIDACION_[PROPIEDAD].md`. Si se trabaja dentro del repo, guardarlos en `projects/<slug>/entregables/` y el script de construcción en `production/generadores/`.

## 8. Cuándo detenerse y preguntar

**Borrador mientras hay un bloqueante.** Si queda una pregunta bloqueante (contradicción material de igual jerarquía, dato esencial faltante), igual construir la pieza con todo lo confirmado, dejando fuera el dato en disputa: nombre `deliverableName(..., { draft: true })` → `_Borrador`, `"draft": true` en `meta.json` (el informe dice BORRADOR) y la pregunta en `contradictions[].open`. La versión `_Final` se genera recién cuando el usuario responde. Así el usuario ve el diseño sin esperar y nada disputado circula.


Solo si falta o se contradice algo que cambia materialmente la pieza: identidad del activo, tipo de operación, precio, superficie, moneda, rol de Meridiano, datos de contacto o condiciones legales/comerciales esenciales. Todo lo demás: dejar el campo fuera, registrarlo en el informe y seguir.
