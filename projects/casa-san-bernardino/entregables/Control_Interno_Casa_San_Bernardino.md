# Control interno — Casa familiar con piscina y casa de huéspedes | San Bernardino

> **Uso interno de Meridiano Capital. No enviar al comprador.**
> Fecha: 2026-09-29 · WEB ID 39903 · Operación: venta a comprador final (familia usuaria, no inversor).

## 1. Entregables

| Archivo | Uso |
|---|---|
| `Casa_San_Bernardino_Meridiano_Capital_FINAL.pptx` | Presentación editable (10 diapositivas, 16:9). Títulos, textos, cifras, tabla y contacto editables; solo las fotos y el logotipo son imágenes. Sin notas del orador (ver §6). |
| `Casa_San_Bernardino_Meridiano_Capital_FINAL.pdf` | Versión para el cliente (4,9 MB, 10 páginas, fuentes incrustadas). Apta para correo y WhatsApp. |
| `Respuestas_Rapidas_Asesor.md` | Guion breve para Juan José Castillo. Uso interno. |
| `../trabajo/` | Script de construcción (`build_deck.js`), fotos de trabajo, renders de QA (`revision_casa_san_bernardino/`), `aspecto.json`, `render.json`. |

## 2. Fuentes utilizadas

| Fuente | Qué aportó | Rango |
|---|---|---|
| Instrucción del asesor del 29/09/2026 ("Datos aprobados de la propiedad") | Todos los datos de la propiedad, el precio, el WEB ID, el contacto y el cargo | 1 (manda) |
| `Presentacion_Casa_Familiar_San_Bernardino_Meridiano_Capital_FINAL.pdf` (11 páginas) | Las 11 fotografías de la propiedad, el retrato del asesor y la estructura narrativa previa | 2 |
| Repo Meridiano-Capital: `knowledge-base/brand/03`, `04`, `05`, `09`, `DECISION_REGISTER.md` | Identidad vigente | Marca |
| Skill `meridiano-property-presentation-adapter` (kit, tokens y logotipos, snapshot D-098 del 2026-09-25) | Kit de construcción, logotipos vectoriales, tipografías y aviso legal de venta | Marca |

**No recibidos:** el pedido menciona como adjuntos un **PPTX** y el **Prompt Maestro de Presentaciones Comerciales**, pero solo llegó el PDF. En el repo no hay ningún PPTX ni Prompt Maestro de esta propiedad. Por eso la presentación editable se **reconstruyó a partir del PDF** (textos, fotos y estructura), aplicando la marca vigente con el kit oficial. Si el Prompt Maestro contiene reglas que no figuran en el Brand OS del repo, conviene revisarlo y hacer un ajuste fino.

## 3. Decisiones de marca

| Tema | Versión anterior (PDF) | Versión vigente aplicada | Respaldo |
|---|---|---|---|
| Logotipo | Texto "MERIDIANO CAPITAL" en una serif genérica; no era el logotipo | Lockup oficial horizontal (isotipo D-034 + wordmark vectorizado): la versión inversa en portada y cierre y el isotipo en los pies | `03-identidad-visual.md`, D-034; lockup `meridiano-primario-horizontal(-inverso)-trazado.svg` |
| Paleta | Terracota como color dominante en todo el documento | Petróleo `#14313A` en portada y ubicación, crema `#F3EDE3` en el contenido, tierra `#8B3323` en el cierre y las cifras, lapacho `#C9982E` como acento (solo sobre oscuro o como filete) y `#A87D22` en los antetítulos sobre claro | `05-sistema-cromatico.md`, `brand_tokens.json` |
| Tipografía | Serif y sans del sistema (DejaVu) | Fraunces Regular para titulares y cifras (nunca en negrita, D-036/D-040) y Poppins para el cuerpo; ambas incrustadas en el PDF | `04-tipografia.md`, D-036, D-040 |
| Grilla | Márgenes y numeración irregulares; el pie de la diapositiva 10 chocaba con la foto | Márgenes de 0,6", antetítulo, titular y pie con isotipo y numeración 02–09 (portada y cierre sin número) | Kit oficial |
| Cierre | Terracota, con el nombre de la marca en texto | Cierre canónico en tierra colorada, lockup inverso y retrato autorizado | `09-cierres-y-firmas.md` |
| Firma | — | "Lic. Juan José Castillo · Broker Inmobiliario \| Meridiano Capital", tal como lo indicó el asesor | Ver nota |

**Versiones de marca encontradas.** La skill `meridiano-capital-identity` trae un logotipo con triángulo simétrico y titulares en Lora, ambos **superados** por D-034 y D-036, así que no se usaron. El Brand OS vigente es la capa `CURRENT` del repo junto con el snapshot de la skill de presentaciones (D-098, del 2026-09-25). **Observación:** el `DECISION_REGISTER.md` del repo llega hasta D-095, mientras que el snapshot de la skill cita D-096 a D-098 (firma C, aviso legal y retrato). No hay contradicción de contenido, pero el repo quedó desactualizado respecto de esas decisiones y habría que registrarlas.

**Nota sobre la firma.** Para ventas, la regla del snapshot indica la variante A (D-039: "Operador Técnico y Legal de Inversiones Inmobiliarias"). Se aplicó en cambio el cargo que indicó expresamente el asesor ("Broker Inmobiliario | Meridiano Capital", que coincide con el título de la variante C, D-096), porque la instrucción del usuario es evidencia de rango 1. Además, la variante A orienta hacia la inversión, un argumento que este pedido excluye. Se omitió el pie institucional de la variante C ("…operadores técnicos y legales de inversiones inmobiliarias") por el mismo motivo. `[EXTENSION]`: firma C sin pie institucional, aplicada a una venta a comprador final.

**Aviso legal.** Se usa el aviso de venta aprobado (D-098) más la frase "Datos de la propiedad según la información recibida".

## 4. Auditoría del PDF original, diapositiva por diapositiva

| # | Diapositiva | Problemas detectados | Resolución |
|---|---|---|---|
| 1 | Portada | Logotipo en texto (no oficial). El título se cortaba en tres líneas desparejas ("Casa familiar con / piscina / y casa de huéspedes"). Un velo terracota apagaba la foto. El WEB ID en dorado sobre terracota tenía bajo contraste | Lockup oficial, título en 2 líneas, foto sin velo, WEB ID en el antetítulo |
| 2 | Resumen | La foto del quincho no tenía pie. "≈490 m²" usaba un símbolo en lugar de "aproximadamente" | Cifras con la etiqueta "aproximadamente" en una diapositiva propia; la foto pasó a Precio con su pie |
| 3 | Punto de encuentro | "Galería y jardín" mostraba en realidad el deck de la piscina. La foto del estar se repetía en la diapositiva 6 | Pies corregidos; cada foto se usa una sola vez |
| 4 | Exterior | **La misma foto del quincho, dos veces** (dos recortes casi idénticos). **Pie sobreimpreso incorrecto**: "Piscina con deck / Quincho… cancha… jardín" sobre la foto de la piscina, con texto sobre la imagen | Una sola foto de quincho, pies separados bajo cada imagen y lista de amenities en texto editable |
| 5 | Huéspedes | Sin pies de foto. Se presentaban tres dormitorios como si fueran de la casa de huéspedes, sin respaldo | Diapositiva "Dormitorios y huéspedes" con pies neutros, sin afirmar en qué casa está cada dormitorio (ver §7) |
| 6 | Interiores | Estar duplicado (misma foto que en la diapositiva 3). Pies en 7 pt, ilegibles en teléfono | Pies de 10,5 pt y cada foto una sola vez |
| 7 | Características | Etiquetas partidas ("SERVICIOS Y / SEGURIDAD"). Texto de 9–10 pt. La foto del quincho aparecía por tercera vez | Tabla nativa editable de 12,5 pt, sin foto repetida |
| 8 | Ubicación | Sin mapa. La foto de la galería ilustraba "el entorno" sin mostrarlo. Afirmaba "acceso a la ciudad" y "tranquilidad residencial", sin respaldo | Diapositiva tipográfica con la leyenda "Ubicación referencial" y sin afirmaciones no respaldadas (ver §5) |
| 9 | Etapas de la vida familiar | Contenido redundante con la diapositiva 2; foto del deck repetida (dos archivos iguales, 80 y 243) | Integrada a "La propuesta" (diapositiva 2) |
| 10 | Precio | El pie de la diapositiva quedaba encima de la foto | Rediseño: foto a sangre a la derecha y pie en la columna izquierda |
| 11 | Contacto | Logotipo en texto; disclaimer propio no aprobado; pie de 7 pt | Cierre canónico, aviso legal aprobado y enlaces tel:/mailto:/web |

En el PDF no había textos de otras propiedades, de Puerto Fénix, de alquileres ni de IVA de naves industriales. Como el PPTX original no llegó, no se pudo verificar si ese contenido estaba en sus notas o en diapositivas ocultas. Como el nuevo PPTX se reconstruyó desde cero, esos textos no pueden haberse arrastrado.

**Fotos duplicadas detectadas** (comparación de píxeles): 82≈106 (piscina), 108≈110 (quincho interior), 38≈182 (quincho exterior), 78≈156 (estar), 80≈243 (deck), 5≈220 (galería). En cada caso se usó la versión de mayor resolución. Quedan 11 fotos únicas de la propiedad más el retrato.

## 5. Ubicación: criterio aplicado

No se dispone de dirección, coordenadas ni mapa verificado de la Urbanización SADI III. El entorno de trabajo tampoco tiene acceso a OpenStreetMap ni a otros servicios de mapas, y no hay datos de San Bernardino en `geocoding-engine` (SK-16). **Por eso no se incluyó ningún mapa ni marcador**, y tampoco distancias ni tiempos de traslado. La diapositiva 7 indica "Ubicación referencial. La dirección exacta y la ubicación en el mapa se comparten al coordinar la visita". Si se consigue un mapa fiable, alcanza con reemplazar el recuadro derecho por el mapa (modo `contain`, con atribución).

## 6. Cambios de estructura y contenido

Nueva narrativa en 10 diapositivas: 1 Portada · 2 La propuesta (propuesta familiar) · 3 Resumen y superficies · 4 Espacios interiores · 5 Dormitorios y huéspedes · 6 Jardín y recreación · 7 Ubicación · 8 Ficha técnica · 9 Precio · 10 Coordinemos una visita.

- Se conservaron "aproximadamente" (490 m² y 750 m²) y "según la información recibida" (estado de conservación y datos de la propiedad).
- Todos los atributos aprobados figuran en la ficha técnica: muebles Achon, 4 vehículos, 2 accesos, tanque con motor, alarma, WiFi, TV cable y orientación norte.
- Sin rentabilidad, ROI, alquiler ni argumentos de inversión (verificado por búsqueda de texto en el PDF).
- **Sin notas del orador en el PPTX.** La trazabilidad que la skill ubica en las notas se trasladó a este documento, porque el PPTX editable podría llegarle al comprador.
- No se aplicó ningún retoque a las fotos; solo recortes proporcionales (`cover`), sin deformación.

## 7. Datos a confirmar (no respaldados en los archivos)

1. **Dirección exacta y ubicación en el mapa** (coordenadas o enlace verificado).
2. **Documentación**: título, catastro, situación dominial y deudas (impuesto inmobiliario, servicios, expensas de la urbanización, si las hay).
3. **Impuestos y gastos de la operación** a cargo de cada parte (validar con el escribano).
4. **Forma de pago** aceptada.
5. **Disponibilidad** (fecha de entrega, ocupación actual).
6. **Elementos muebles incluidos** (mobiliario visible en las fotos: sillones de mimbre, mesas del quincho, reposeras, equipamiento de cocina, aire acondicionado, heladera).
7. **Casa de huéspedes**: cantidad de dormitorios y baños propios; en qué casa está cada dormitorio fotografiado. La presentación no lo afirma.
8. **Superficies** de 490 m² y 750 m²: informadas y no verificadas (plano o mensura).
9. **Estado "excelente conservación"**: según la información comercial; no inspeccionado.
10. **Fotografías**: muestran un procesamiento digital intenso (saturación y nitidez de estilo HDR, texturas suavizadas). Hay que confirmar con el propietario o el fotógrafo que son fotos reales y que no se alteró la estructura, los materiales ni el mobiliario. Tampoco hay fotos de la cancha, la fachada principal ni el exterior de la casa de huéspedes; conviene conseguirlas.
11. **Uso del retrato**: se usó el retrato del asesor incluido en el PDF, como autorizó el pedido.

## 8. Verificaciones realizadas

| Control | Resultado |
|---|---|
| Estructura OOXML del PPTX (`pptx/scripts/office/validate.py`) | **PASSED** |
| Proporción de imágenes (`validate_image_aspect_ratios.py`, tolerancia 0,5 %) | **OK**: 22 imágenes (11 fotos, retrato y logotipos), desviación máxima 0,0012 % |
| PDF generado desde el PPTX con LibreOffice Impress (no a partir de capturas) | **OK**: 10 páginas, formato 16:9 |
| Coincidencia PPTX ↔ PDF | Igual cantidad (10) y orden. Cada texto de cada diapositiva del PPTX (incluidas las celdas de la tabla) aparece en su página del PDF: 0 diferencias |
| Fuentes del PDF | Fraunces-Regular, Poppins Regular, Bold e Italic, todas incrustadas (`pdffonts`) |
| Apertura de archivos | Ambos abren (python-pptx, PyMuPDF y LibreOffice) |
| Revisión visual | Las 10 diapositivas renderizadas se revisaron una por una, más la vista general: sin texto cortado ni superpuesto, sin fotos deformadas y cada pie coincide con el ambiente mostrado |
| Datos comerciales | Precio USD 179.000, WEB ID 39903, 1.100 m² en esquina, ~490 m², ~750 m², 6 dormitorios, 4 baños + social, 14 ambientes, 2 niveles, 4 vehículos y 2 accesos: iguales a la instrucción |
| Contenido prohibido | Sin "Puerto Fénix", "nave", "rentabilidad", "ROI", "alquiler", "inversión" ni "Asesor Inmobiliario" en el PDF |
| Legibilidad en teléfono | Cuerpo ≥ 12,5 pt, pies de foto 10,5 pt y aviso legal 9 pt (mínimo del kit) |

**Resultado:** APROBADO CON OBSERVACIONES. Las observaciones son los datos a confirmar del §7; ninguno figura como hecho en la presentación.
