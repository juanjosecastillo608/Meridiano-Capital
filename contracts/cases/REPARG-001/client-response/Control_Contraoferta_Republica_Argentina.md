# Control interno — Respuesta y contraoferta, Edificio República Argentina

> **Documento interno de Meridiano Capital. NO se envía a las partes.**
> Acompaña a `Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx` / `.pdf` (estado: **BORRADOR PARA REVISIÓN**).
> Generado el 2026-10-22 con `contracts/cases/REPARG-001/generador/build_contraoferta.py`.

## 1. Rol de Meridiano en esta pieza

- Meridiano Capital actúa como **inmobiliaria COLOCADORA** (del lado del comprador) y **canaliza** las condiciones que comunicó la parte vendedora.
- La carta no atribuye a Juan José Castillo representación legal de M.T. BAT S.A. ni del comprador, no dice que la vendedora quede obligada por la firma del broker y no autoriza a Meridiano a recibir fondos.
- El bloque de firma es de **JUAN JOSÉ CASTILLO, Broker Inmobiliario, MERIDIANO CAPITAL, Inmobiliaria colocadora**, sin firma manuscrita ni digital. Preparar el bloque no equivale a firmar.

## 2. Fuentes y prioridad aplicada

| Prioridad | Fuente | Uso | Estado |
|---|---|---|---|
| 1 | Instrucciones del encargo (prompt del usuario, 2026-10-22) | Condiciones económicas y comerciales de la contraoferta | Aplicadas tal cual |
| 2 | `Propuesta_Compra_Edificio_Republica_Argentina_Tobati.pdf` | Partes, inmueble y antecedente de la oferta | **El PDF no estaba disponible en esta sesión.** Se usaron los datos transcritos en el encargo, que el usuario declaró validados. No es una auditoría registral independiente. |
| 3 | `Carta oferta Modelo.pdf` (Casa Herrera) | Referencia visual | **El PDF no estaba disponible en esta sesión.** No se copió nada de esa operación. El estilo se resolvió con el sistema oficial de Meridiano (ver §6). |

Ningún PDF original se modificó: no estaban en el entorno.

## 3. Datos utilizados (confirmados por el usuario)

| Campo | Dato |
|---|---|
| Inmueble | Edificio mixto de departamentos y locales comerciales |
| Dirección | Avda. República Argentina esquina Tobatí, Asunción |
| Cuenta Corriente Catastral | 14-0322-17 |
| Parte vendedora | M.T. BAT Sociedad Anónima |
| Representante identificada | Sra. Mabel Torrico |
| Comprador y oferente | Matías Manzato, C.I. N.º 9489984 |
| Oferta recibida | 16-10-2026: USD 700.000 (USD 250.000 a la aceptación + USD 450.000 contra escritura), con vigencia de 7 días corridos y condición de verificación de dominio y de libre de gravámenes |

**No se incorporó** (no consta en el material del encargo): el nombre de la inmobiliaria captadora, RUC, documentos o poderes de Mabel Torrico, correos de las partes, datos bancarios, el precio histórico de USD 890.000, superficies ni características del edificio. El espacio de aceptación del antecedente **no** se trató como aceptación firmada.

## 4. Cálculos verificados

| Verificación | Resultado |
|---|---|
| Entrega inicial + saldo = precio | 250.000 + 570.000 = **820.000** ✔ |
| Saldo nuevo frente al antecedente | 570.000 reemplaza a 450.000 (+120.000). La entrega inicial no cambia. |
| Rebaja frente al precio pedido anterior | No se calcula: el precio anterior no consta en este encargo. |
| Distancia contraoferta–oferta | 820.000 − 700.000 = 120.000 (+17,1 % sobre la oferta). Dato interno, **no** figura en la carta. |
| Comisión 5,5 % sobre USD 820.000 | **USD 45.100**. Cálculo interno. **No figura en la carta** porque falta confirmar la base y el tratamiento de IVA de los honorarios. |
| Letras | Doscientos cincuenta mil / Quinientos setenta mil / Ochocientos veinte mil dólares estadounidenses ✔ |

## 5. Corrección del sujeto vendedor

El encargo decía *"la parte compradora ... acepta rebajar"*. Como quien rebaja su precio de venta es la parte vendedora, la instrucción se leyó como **PARTE VENDEDORA**. La corrección se registra aquí y no aparece como nota en la carta.

## 6. Decisiones de redacción y diseño

- **Condiciones**: precio y cuadro de pagos (1), comisión (2), escrituración 50/50 (3), IVA e impuestos de la transferencia a cargo de la vendedora, sin sumarlos al precio (4), acompañamiento de 6 meses (5), verificación documental (6) y formalización por escrito (7).
- **Aclaraciones incluidas para no ampliar las condiciones**:
  - La rebaja no compromete a la vendedora a ejecutar ni pagar las reformas.
  - La carta no acepta los USD 700.000 ni perfecciona la compraventa.
  - El reparto 50/50 cubre solo gastos de escrituración; los impuestos van aparte, sin doble imputación.
  - El acompañamiento no es garantía de renta ni administración.
  - La verificación documental no se presenta como hecha, y el comprador no renuncia a revisar el inmueble.
  - Las condiciones de la entrega inicial (receptor, medio de pago, tratamiento) se acordarán por escrito antes del desembolso.
- **No se agregaron** pérdida o duplicación de la seña, irrevocabilidad, tasas o montos tributarios, ni cláusulas jurídicas nuevas.
- **No se agregaron espacios de conformidad.** Son opcionales según el encargo, y en un borrador que viaja por el colocador podrían leerse como un instrumento ya listo para firmar. Si se quieren, conviene agregarlos en la versión final, por separado para comprador y vendedora, sin reemplazar el bloque del broker.
- **Color**: el encargo pedía "verde oscuro y dorado discretos como el modelo". El Manual de Marca (`knowledge-base/brand/05-sistema-cromatico.md`) reserva el verde Ka'a para Urbannit y prohíbe mezclarlo con Meridiano en una misma pieza. Por la regla de prioridad (Manual > recomendaciones creativas) se usó **Petróleo profundo #14313A** (oscuro, de matiz verde-azulado) con **Lapacho dorado #C9982E** solo en acentos. El texto en dorado usa el tono oscuro #A87D22 por la regla WCAG.
- **Tipografía**: Fraunces (título, sin negrita, D-040) y Poppins (cuerpo).
- **Logo**: el logo horizontal oficial de Meridiano (`production/generadores/logo_horizontal.png`), no el de Casa Herrera.
- **Firma**: el encargo fija "Broker Inmobiliario / Inmobiliaria colocadora". Prevalece sobre la firma canónica "Operador Técnico y Legal de Inversiones Inmobiliarias" de `knowledge-base/brand/09-cierres-y-firmas.md`, que es una regla [EXTENSION] del propio founder y está pensada para piezas de marca y no para comunicaciones de una operación de terceros. **[EXTENSION]**: excepción puntual de este caso, no una regla nueva.
- **Cierre**: no se usó la página de cierre en tierra colorada, pensada para decks y documentos de marca. Una carta comercial de dos páginas cierra con el bloque de firma.
- **Contacto institucional** en el pie: +595 982 853 111 · juancastillo@meridianocapital.net · www.meridianocapital.net (fuente: `09-cierres-y-firmas.md`).

## 7. Puntos pendientes (no frenan el borrador)

| # | Pendiente | Impacto |
|---|---|---|
| 1 | **Plazo y vencimiento de la contraoferta.** La carta muestra "Vigencia de esta contraoferta: [pendiente de confirmación]". La vigencia de 7 días de la oferta original no se trasladó. | Sin vigencia, la contraoferta queda abierta. Hay que definirla antes de enviar. |
| 2 | **Fecha de emisión** (campo editable en la carta) y **plazo para escriturar**, que no fue indicado. | El saldo es "contra escritura" sin fecha límite. |
| 3 | **Desde cuándo corren los 6 meses de acompañamiento.** Se mantuvo "desde la compra". Falta definir si cuentan desde el contrato, la escritura u otro hito. | Ambigüedad en la condición 5. |
| 4 | **Comisión**: base, IVA de los honorarios, beneficiarios y reparto entre inmobiliarias (captadora y colocadora), y cuándo es exigible. | La carta solo dice "5,5 % a cargo de la vendedora". |
| 5 | **Entrega inicial**: condiciones, devolución, quién recibe y medio de pago antes del desembolso. | Meridiano no está autorizado a recibir fondos. |
| 6 | **Respaldo escrito** de las condiciones que comunicó la vendedora (USD 820.000 y demás) y **facultades** de quien firme por M.T. BAT S.A. (acta o poder), sin poner en duda los datos que validó el usuario. | Debe quedar documentado antes de formalizar. |

## 8. Control de calidad realizado

- [x] Cifras y letras verificadas (§4); aparecen USD 820.000, 250.000 y 570.000.
- [x] Nombres, C.I. 9489984, Cuenta Catastral 14-0322-17, M.T. BAT S.A. y Sra. Mabel Torrico, revisados contra el encargo.
- [x] Meridiano figura como **colocadora** en el cuadro de partes, la apertura, la condición 7 y la firma.
- [x] Destinatario: Sr. Matías Manzato, C.I. N.º 9489984.
- [x] La firma de JUAN JOSÉ CASTILLO está presente y no queda sola en una página (va con el cierre, página 2).
- [x] El PDF tiene 2 páginas A4. Se revisaron visualmente las dos y el texto coincide con el .docx (mismo generador; el PDF sale del .docx con LibreOffice).
- [x] Sin errores de codificación (búsqueda de "Ã" en el PDF: 0 resultados).
- [x] No aparecen USD 890.000, USD 45.100, Casa Herrera ni firmas de terceros.
- [x] Documento marcado BORRADOR PARA REVISIÓN en cada página.
- [ ] **No se envió a las partes**: queda para revisión del founder.

### Brand Guardian (Matriz de Decisión, 10 criterios)

1. Estrategia: APROBADO. Presenta a Meridiano como operador que estructura la operación, no como simple intermediario.
2. Identidad verbal: APROBADO. Tono preciso y cordial, sin promesas de rentabilidad.
3. Identidad visual: APROBADO. Logo oficial sin alterar, con espacio de protección.
4. Tipografía: APROBADO. Fraunces sin negrita en el título y Poppins en el cuerpo.
5. Color: APROBADO. HEX oficiales; el dorado solo como acento o en su tono oscuro; sin verde Urbannit.
6. Fotografía/imagen: no aplica (sin imágenes).
7. Composición: APROBADO. Jerarquía clara, dos páginas, firma junto al cierre.
8. Experiencia: APROBADO. Formato de carta A4 imprimible.
9. Premiumización: APROBADO. Composición sobria y espacio en blanco.
10. Coherencia general: APROBADO.

**Veredicto: APROBADO**, como borrador. Antes de enviar hay que completar la fecha de emisión y la vigencia (§7.1–7.2).

## 9. Reproducir

```bash
python3 contracts/cases/REPARG-001/generador/build_contraoferta.py
cd contracts/cases/REPARG-001/client-response
soffice --headless --convert-to pdf Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx
```

Requiere Poppins y una instancia estática de Fraunces (opsz 72, SOFT 24, WONK 0, wght 400) instaladas. Con la fuente variable, LibreOffice embebe Fraunces como Type 3.
