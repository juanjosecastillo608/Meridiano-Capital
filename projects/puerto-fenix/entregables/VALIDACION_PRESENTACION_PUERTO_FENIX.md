# Validación de producción: presentación corporativa Puerto Fénix

**Pieza:** `Meridiano_Capital_Puerto_Fenix_Presentacion_Corporativa_Final.pptx` (+ `.pdf`)
**Fuente aprobada:** `../fuente/Presentacion_Corporativa_Puerto_Fenix_Meridiano_Capital_v7.pptx` (copia intacta del archivo recibido; el original no se modificó)
**Generador reproducible:** `production/generadores/build_puerto_fenix_presentacion.js` (assets en `production/generadores/assets-puerto-fenix/`)
**Fecha:** 2026-09-25 (rev. 3: versión para colegas D-099 + aviso legal D-098) · **Diapositivas:** 12 · **Formato:** 16:9 (13,333 × 7,5 in)

---

## 1. Skills y fuentes de identidad utilizadas

| Aspecto | Fuente aplicada | Estado |
|---|---|---|
| Sistema de marca (20 módulos, prioridad, Brand Guardian) | Skill `meridiano-capital-identity` (SKILL.md + `references/10-presentaciones.md`) | Oficial / [EXTENSION] según el módulo |
| Producción PPTX y QA | Skill `pptx` (pptxgenjs, `validate.py`, render con LibreOffice) | — |
| Consulta y protocolo | `knowledge-base/ai/03-sistema-de-consulta.md`, `01-protocolo-de-prioridad.md`, `02-protocolo-regla-no-definida.md` | CURRENT |
| Logo | `knowledge-base/brand/03-identidad-visual.md` + D-034 (isotipo "partido por el meridiano") | CURRENT |
| Tipografía | `knowledge-base/brand/04-tipografia.md` + D-036 (Fraunces) + D-040 (Fraunces sin negrita en generadores) | CURRENT |
| Color | `knowledge-base/brand/05-sistema-cromatico.md` (5 colores oficiales + tonos utilitarios registrados) | CURRENT |
| Cierre y firma | `knowledge-base/brand/09-cierres-y-firmas.md` + D-039 + **D-096** (Variante C: captación de propiedades en alquiler) | CURRENT |
| Referencia de deck vivo | `production/generadores/build_herrera001_presentacion_inversores.js` | Convenciones de layout ya en producción |

**Sobre "Brand OS 2.1":** no existe como tal en este repo (`documentation/quality-audit/PRODUCTION-READINESS.md` lo marca N/A). La fuente vigente de mayor jerarquía es `knowledge-base/brand/` (CURRENT) junto con las decisiones CURRENT del `DECISION_REGISTER`, que prevalecen sobre el manual `.docx` v1.0 en los puntos que ese manual todavía no actualizó (isotipo D-034, tipografía D-036).

## 2. Logos utilizados

- **Isotipo vigente (D-034):** `production/app/frontend/assets/logos/meridiano-isotipo.svg` y `meridiano-isotipo-inverso.svg`, incrustados como **SVG vectorial** (con respaldo PNG de 1600 px para visores sin soporte SVG). Los SVG de `assets/logos/` corresponden a la construcción histórica y **no** se usaron.
- **Lockup horizontal:** construido a partir del SVG oficial `meridiano-primario-horizontal.svg`, con la misma geometría, los mismos colores y el mismo wordmark Fraunces (wght 600, opsz 80, SOFT 24, WONK 0). El wordmark se **convirtió a trazos** con la fuente oficial, sin redibujar nada, para que el logo no dependa de que Fraunces esté instalada. La versión inversa (crema + punto dorado) aplica la regla oficial para fondos oscuros. El viewBox se ajustó al contenido (430 × 140) sin alterar la construcción.
- **Uso:** lockup completo solo en la portada (petróleo) y el cierre (tierra colorada); isotipo pequeño en el pie de las diapositivas de contenido (Módulo 10). No hay deformación, rotación, sombras ni contornos.
- **Puerto Fénix:** no se recibió un logo propio del activo y no se inventó uno. Se presenta tipográficamente como el activo ofrecido ("Centro Logístico Puerto Fénix"). Meridiano Capital figura como comercializador ("Comercialización a cargo de Meridiano Capital").

## 3. Tipografías

- **Fraunces**, siempre en peso Regular, para titulares, cifras destacadas y el nombre en la firma (D-036/D-040). Para el render se usó una instancia de la fuente variable oficial de Google Fonts con los ajustes de marca (opsz 80, SOFT 24, WONK 0).
- **Poppins** Regular/Bold/Italic para el cuerpo, las etiquetas, las tablas, los pies de página y el contacto.
- Ambas se descargaron de Google Fonts (licencia SIL OFL) y se instalaron para el render. **El PDF lleva las fuentes incrustadas** (verificado con `pdffonts`: Fraunces-Regular, Poppins-Regular/Bold/Italic).
- **Para editar el PPTX**, la computadora debe tener instaladas Fraunces y Poppins (gratuitas en fonts.google.com). Sin ellas, PowerPoint las reemplaza por el sustituto definido por el Brand OS (Georgia/Cambria y Calibri/Arial), y los anchos pueden variar levemente.

## 4. Estructura final (12 diapositivas; se conserva la secuencia aprobada)

| # | Diapositiva | Fondo |
|---|---|---|
| 01 | Portada: Naves industriales en Puerto Fénix | Petróleo profundo + fotografía |
| 02 | Ubicación en el corredor metropolitano (con enlace a Google Maps) | Crema |
| 03 | Escala para operaciones industriales y logísticas (4 fotografías) | Crema |
| 04 | Planta libre y subdivisión por demanda (plano) | Crema + panel blanco |
| 05 | Infraestructura incluida en el complejo | Blanco |
| 06 | Espacios listos para configurar (características de las naves) | Petróleo profundo |
| 07 | Integración portuaria y aduanera | Crema |
| 08 | Condiciones económicas de alquiler | Crema + panel petróleo |
| 09 | Servicios logísticos opcionales | Blanco |
| 10 | Proceso de contratación | Petróleo profundo |
| 11 | Operación de almacenamiento | Crema |
| 12 | Cierre y contacto + pie institucional | Tierra colorada (cierre canónico) |

## 5. Validaciones realizadas

| Control | Resultado |
|---|---|
| `validate.py` (esquema, relaciones, tipos de contenido) | ✅ All validations PASSED |
| Render completo a PDF y a PNG por diapositiva (LibreOffice + pdftoppm) | ✅ 12/12, revisadas una por una y en vista general (`revision/00_vista_general.png`) |
| Correcciones tras la 1.ª revisión visual | Diap. 3: se eliminó la franja negra residual del separador del collage. Diap. 4: se corrigió la superposición entre el antetítulo, el título y la columna de datos, y el choque con el pie. Diap. 8: se alineó "por m² + IVA" y se unificó el espaciado de las condiciones. Diap. 9: se evitó que la referencia comercial cortara la línea en "días" |
| Desbordes, superposiciones, márgenes (≥ 0,6 in), numeración 02–11 | ✅ Sin incidencias en el render final |
| **Deformación de imágenes** (script sobre el XML: marco mostrado vs. área de origen recortada, 27 imágenes) | ✅ **Desviación máxima de proporción: 0,001 %.** Ninguna imagen estirada ni comprimida |
| Diapositiva 3: 4 fotografías | ✅ El collage original (una sola imagen de 958 × 720) se separó en sus 4 fotografías con recortes exactos por los separadores negros, y se reorganizó en una grilla proporcional de 2 × 2. Recorte proporcional adicional ≤ 2 % del alto para igualar las celdas |
| Plano | ✅ Proporción original 1755 × 1240 sin recorte (0,000 %). Se conservan la orientación, las medidas, los accesos, la rotulación y la rosa de los vientos. Solo se limpió el fondo y se reforzó el contraste de las líneas (niveles). Se muestra a la máxima resolución disponible del archivo recibido |
| Capacidad "18.000 m² por nave" | ✅ Presente en las diapositivas 1, 3 y 4 |
| Fotografía de Juan José Castillo | ✅ Sin deformación. Recorte proporcional lateral de 2,2 % por lado, rostro completo, sin retoques |
| Editabilidad (reapertura con python-pptx) | ✅ El archivo abre sin errores: 149 cuadros de texto editables, 1 tabla nativa, líneas y formas nativas, 12 diapositivas con notas del orador. Ninguna diapositiva está aplanada como imagen |
| Tamaño | PPTX 4,5 MB · PDF 2,3 MB (apto para enviar por correo) |

## 6. Datos comerciales: coincidencia con la fuente

Verificado por búsqueda textual automática sobre el PPTX final (todos presentes):

- Centro Logístico Puerto Fénix · Mariano Roque Alonso, Paraguay · 80 hectáreas · 3.000 metros de muelle · altura mínima de 10 metros.
- 100,00 × 179,80 m · 17.980 m² · **18.000 m² por nave** · superficie mínima de 1.000 m² · subdivisión según el cliente.
- Ejemplo para 2.000 m²: **USD 5,50 por m² + IVA → USD 11.000 + IVA**; **USD 0,20 por m² + IVA → USD 400 + IVA**; **total mensual USD 11.400 + IVA**. Aritmética verificada: 2.000 × 5,50 = 11.000; 2.000 × 0,20 = 400; 11.000 + 400 = 11.400.
- Condiciones de ingreso: un mes de alquiler; un mes de alquiler en concepto de garantía; honorarios equivalentes al 50% de un mes de alquiler; validez de la oferta: 5 días.
- Servicios opcionales (sin cambios de valor): flete corto USD 20 por m² + IVA; movimiento de carga USD 32 por m² + IVA.
- Contacto: Juan José Castillo · Broker Inmobiliario · Meridiano Capital · +595 982 853 111 · juancastillo@meridianocapital.net.
- Pie institucional del cierre: "Meridiano Capital · Operadores técnicos y legales de inversiones inmobiliarias".
- Ubicación exacta: https://maps.app.goo.gl/jHo2dQB1tqhid7nAA, con hipervínculo en el mapa y en el texto "Ver ubicación exacta en Google Maps" de la diapositiva 2. Es clicable en el PDF (2 anotaciones verificadas) y la URL corta va impresa para quien lea el documento en papel. Los hipervínculos usan los colores de marca (tierra colorada / grey cálido una vez visitados) en lugar del azul por defecto.
- **Ausentes (verificado):** correo de Century 21, "Asesor Inmobiliario", juanjosecastillo@, textos de relleno.

## 7. Ajustes de redacción (sin cambio de significado)

- **"× m²" → "por m²"** en los servicios opcionales, para unificar el formato con la tarifa de alquiler. El valor y la unidad se mantienen; las notas del orador conservan la redacción original.
- **"según redacción del documento fuente"** se reemplazó por una advertencia equivalente, apta para el cliente: *"La unidad de facturación definitiva se formaliza en la cotización contractual"*. Es la misma advertencia que ya estaba en las notas de la v7.
- **"CI"** se reemplazó por "cédula de identidad" (regla verbal D-049).
- **"Documento comercial base"** se reemplazó por "Documento comercial", porque esta ya es la versión final. La fecha 24.09.2026 se conserva.
- Se agregaron datos que ya figuraban en la v7 donde la narrativa los pedía: altura de 10 m y módulo de 1.000 m² en la diapositiva 6; oficina aduanera y muelle de 3.000 m en la diapositiva 7. La nota *"servicios adicionales sujetos a cotización y disponibilidad"* pasó de las notas del orador a la diapositiva 5.
- **La nota interna de producción** de la diapositiva 2 (*"La localización exacta debe conservar el enlace del documento fuente…"*) era una instrucción de trabajo, no un texto para el cliente. Se trasladó a las notas del orador (ver §9).
- **[EXTENSION] Aviso legal del cierre** (exigido por el cierre canónico, `09-cierres-y-firmas.md`): *"Documento comercial de referencia. Valores en USD más IVA según la cotización de Puerto Fénix; las condiciones definitivas se formalizan en el contrato de locación. Oferta válida por 5 días."* No agrega condiciones nuevas. Conviene que el founder lo revise.

## 8. Firma y pie institucional: resuelto (D-096)

El encargo pedía el cargo **"Broker Inmobiliario"**, distinto de la firma canónica de D-039 ("Operador Técnico y Legal de Inversiones Inmobiliarias"). En la primera entrega esa diferencia quedó registrada como U-034. El founder la resolvió el 2026-09-25: **cuando Meridiano actúa como captador de propiedades en alquiler, la firma estándar es "Broker Inmobiliario"**, y la pieza cierra con un **pie institucional** que marca la diferencia frente al agente tradicional: *"Meridiano Capital · Operadores técnicos y legales de inversiones inmobiliarias"*. Quedó registrada como **D-096** (CURRENT) y como **Variante C** en `knowledge-base/brand/09-cierres-y-firmas.md`. U-034 figura como resuelta.

**Redacción del pie:** el founder lo expresó como "operadores técnicos y legales de *operaciones* inmobiliarias". Se usó "*inversiones* inmobiliarias" por coherencia con la fórmula ya establecida en el sistema de marca y para evitar la repetición "operadores… de operaciones". Si se prefiere la otra redacción, se cambia en una constante del generador (`PIE_INSTITUCIONAL`).

**Otras diferencias puramente visuales, resueltas a favor de la norma de marca:** se eliminaron las tarjetas con sombra y los bordes laterales de color de la v7; se unificó el pie con el isotipo en todas las diapositivas (la v7 no lo tenía en las diapositivas 6 y 11); el cierre pasó a tierra colorada, según el cierre canónico.

## 9. Limitaciones técnicas

1. **Enlace de localización:** incorporado en la rev. 2. El entorno de producción no pudo abrir el link corto de Google Maps (el dominio está bloqueado por el proxy), así que se usó tal como lo entregó el founder. Conviene hacer clic una vez para confirmar que abre el punto exacto del complejo.
2. **Resolución de origen:** las 4 fotografías del collage miden unos 470 × 359 px cada una (origen: 958 × 720 px en total). Se muestran a unos 150 ppp, correcto en pantalla y proyección, pero limitado para impresión grande. No se reescalaron artificialmente. Si Puerto Fénix entrega los originales, el generador los toma sin cambios de layout.
3. **Textos sobreimpresos en las fotografías de la diapositiva 3** ("160.000 m2 de depósitos tipo Triple A", "Mayor parque logístico en zona primaria del país") forman parte del material aprobado y no se editaron. Son afirmaciones de Puerto Fénix, no verificadas por Meridiano Capital.
4. **Correcciones fotográficas:** solo se aplicó autocontraste moderado (0,5 %) a las 3 fotografías del muelle, que estaban nubladas y planas. Al plano se le limpió el fondo y se le reforzó el contraste de las líneas. El resto de las fotografías se usa sin intervención. No se generaron ni se agregaron elementos con IA.
5. **Render de control con LibreOffice:** PowerPoint puede mostrar diferencias mínimas de interlineado. Todos los cuadros de texto tienen margen de holgura.
6. **Tipografías en el PPTX:** ver §3. El PDF es independiente de las fuentes instaladas.

## 10. Brand Guardian (Matriz de Decisión, 10 criterios)

Logo oficial vigente y sin alteraciones ✅ · Paleta oficial, sin HEX nuevos ni dorado como texto de cuerpo sobre fondo claro ✅ · Fraunces/Poppins según D-036/D-040 ✅ · Sándwich de fondos y cierre en tierra colorada ✅ · Un mensaje por diapositiva ✅ · Tono corporativo sin superlativos propios ni promesas de rentabilidad ✅ · Fotografías reales sin deformación ✅ · Roles Puerto Fénix (activo) / Meridiano (comercializador) claros ✅ · Aviso legal presente ✅ · Firma y pie institucional según D-096 ✅

**Veredicto:** ALINEADO en los 10 criterios.

## 11. Rev. 3: versión para colegas (marca blanca, D-099) y aviso legal aprobado (D-098)

**Versión para colegas:** `para_colegas/Centro_Logistico_Puerto_Fenix_Alquiler_Presentacion.pptx` y `.pdf`, con PNG de revisión en `revision_colegas/`. Sale del mismo generador con `node build_puerto_fenix_presentacion.js --colegas`. Las 12 diapositivas, los datos, las fotos, el plano, el mapa con su enlace y el aviso legal son los mismos que en la versión clientes. No lleva logo, isotipo, nombre, contacto, firma, retrato, pie institucional, notas del orador ni metadatos de Meridiano, y el cierre deja espacio libre para el contacto del colega.

**Control automático de marca blanca:** `VALIDACION_PUERTO_FENIX_COLEGAS.md` (§0), APROBADO. Sin rastros de Meridiano en el texto, las notas, los metadatos del PPTX y del PDF, los enlaces, el nombre de archivo, los logos incrustados (0 SVG) ni el retrato. Resto de los controles: `validate.py` PASSED, 14 imágenes con desviación máxima de 0,0009%, PDF de 12 páginas con Fraunces y Poppins incrustadas.

**Aviso legal (ambas versiones):** se reemplazó por el texto aprobado para alquiler (D-098), manteniendo las condiciones propias de esta cotización: *"Documento comercial de referencia. Valores y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el contrato de locación. Valores en USD más IVA según la cotización de Puerto Fénix. Oferta válida por 5 días."*

**Punto a confirmar:** la condición de ingreso *"Honorarios equivalentes al 50% de un mes de alquiler"* (diapositiva 8, también mencionada en el paso 4 del proceso) viene de la cotización y se conservó en la versión para colegas, según la regla de D-099. Si son honorarios propios de Meridiano y no deben figurar en lo que reenvía un colega, se quitan de esa versión.
