# Control interno — Respuesta y contraoferta, Edificio Inox (República Argentina)

> **Documento interno de Meridiano Capital. NO se envía a las partes.**
> Acompaña a `Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx` / `.pdf`.
> Versión 3 (Ref. interna REPARG-001-CO01 · v3): 2026-10-22, con fecha de emisión **23 de octubre de 2026**.
> Generador: `contracts/cases/REPARG-001/generador/build_contraoferta.py`.

## 000. Versión 3.1: ajustes de firma y pie (2026-10-22, founder)

- **Juan José Castillo**: C.I. N.º 9289273, informada por el founder. Por pedido del founder, la firma se acorta a 3 renglones: "JUAN JOSÉ CASTILLO / C.I. N.º 9289273 · Broker Inmobiliario / INMOBILIARIA COLOCADORA". Se quitó "MERIDIANO CAPITAL" de la firma (la marca sigue en el membrete y en el cuadro de intervinientes). "Inmobiliaria colocadora" pasa a mayúsculas, como el rol de los demás firmantes. Esta excepción a la firma canónica del encargo inicial la pidió expresamente el founder.
- **Mabel Torrico**: C.I. N.º 2035707, informada por el founder. Queda resuelto ese pendiente.
- **Pie de página**: el número de página se generaba con un campo incompleto y salía con el tamaño por defecto del documento. Ahora el campo está completo (begin/separate/resultado/end) y todo el pie usa Poppins de 7 pt.

## 00. Versión 3: correcciones del founder (2026-10-22) y formato del modelo Casa Herrera

| Corrección pedida | Qué se hizo |
|---|---|
| "Señor Matías Manzato" aparecía 2 veces en el encabezado | Destinatario una sola vez: "Señor / Matías Manzato / Presente". Se eliminó el saludo repetido "Señor Matías Manzato:" (en la observación del founder figuraba "Constanzo"; el nombre correcto, Manzato, no cambió) |
| La frase "Meridiano Capital, a través de su broker inmobiliario Juan José Castillo, en su carácter de inmobiliaria colocadora, canaliza la respuesta comunicada por la parte vendedora" tenía demasiadas comas | Se dividió en frases cortas: "Por medio de la presente le transmitimos la respuesta de la parte vendedora a su propuesta formal de compra del 16 de octubre de 2026 por USD 700.000. Meridiano Capital actúa en esta operación como inmobiliaria colocadora a través de su broker inmobiliario Juan José Castillo." Se revisaron con el mismo criterio el párrafo del inmueble, el de intermediación, el del precio, la formalización y el alcance |
| Lugar y espacio de firma para todos los intervinientes, con sus datos (según el modelo de Casa Herrera) | Bloque de firmas 2×2 en la página 2, junto al cierre: **Mabel Torrico** (en representación de M.T. BAT S.A., C.I. a completar, parte vendedora); **Matías Manzato** (C.I. 9489984, comprador/oferente); **Juan José Castillo** (Broker Inmobiliario, MERIDIANO CAPITAL, inmobiliaria colocadora); **Lourdes Baratto** (C.I. 4480441, asesora inmobiliaria). Una línea aclara que la vendedora firma en conformidad y el comprador en toma de conocimiento |
| Formato del modelo | Título centrado con espaciado de letras, fecha y "Ref. interna" a la derecha, cuadro de intervinientes con etiquetas en petróleo, línea "Ref.:" centrada, secciones con títulos en serif ("Precio y forma de pago", "Condiciones de la operación", "Vigencia, respuesta y alcance"). Se agregó la página 3 **"Constancia de recepción"** + **"Respuesta de la parte compradora"** (acepta / rechaza / contrapropuesta, con firma, aclaración y C.I., fecha y hora), igual que en el modelo |

Resultado: 3 páginas A4 (carta y firmas en las páginas 1 y 2; recepción y respuesta en la página 3).

**El modelo `Carta oferta Modelo.pdf` (Casa Herrera) NO se versiona en este caso.** Contiene datos y la firma manuscrita de una clienta de otra operación (HERRERA-002). Solo se tomó su estructura; no se copió ningún dato, condición ni firma.

Pendientes que siguen abiertos: redacción del IVA (§5) y los puntos de §6. (La C.I. de Mabel Torrico quedó resuelta en la v3.1.)

## 0. Cambios de la versión 2 respecto de la versión 1 (borrador del 2026-10-22)

| Tema | v1 | v2 | Fuente |
|---|---|---|---|
| Fecha de emisión | Campo editable | **23 de octubre de 2026** | Instrucción del founder |
| Forma de pago | USD 250.000 de entrega inicial + USD 570.000 de saldo | **Reserva USD 82.000 + seña de trato USD 168.000 + saldo USD 570.000**, con plazos y transferencia bancaria | `CONDICION_DE_COMPRA.docx` |
| Vigencia | [pendiente de confirmación] | **30 días hábiles desde la fecha de emisión** | `CONDICION_DE_COMPRA.docx` |
| Comisión | 5,5 % a cargo de la vendedora | 5,5 %, **100 %** a cargo de la vendedora | `CONDICION_DE_COMPRA.docx` + carta de presentación |
| Gastos | De escrituración, 50/50 | **De transferencia**, 50/50 | `CONDICION_DE_COMPRA.docx` (ver §6.3) |
| IVA | "IVA e impuestos de la transferencia", a cargo de la vendedora | IVA de venta a tasa del 5 %, a cargo de la vendedora, "como lo establece la ley" | `CONDICION_DE_COMPRA.docx` (ver §5, **ALERTA**) |
| Nuevas condiciones | — | Impuestos inmobiliarios al día (vendedora); aprobación del banco interviniente | `CONDICION_DE_COMPRA.docx` |
| Intermediación | Meridiano como colocadora | Se cita la carta de presentación de cliente y la intermediación de **ambos asesores**: Lourdes Baratto y Meridiano Capital | Carta de presentación |
| Mención de Meridiano | "Meridiano Capital" | **"Meridiano Capital, a través de su broker inmobiliario Juan José Castillo"** en cada mención ligada a la intermediación | Regla del founder (§7) |
| Inmueble | Sin nombre propio | **Edificio Inox** | Carta de presentación |
| Marca de borrador | "BORRADOR PARA REVISIÓN" | Se quitó: la fecha y la vigencia ya están definidas | — |

## 1. Rol de Meridiano

- Meridiano Capital actúa como **inmobiliaria COLOCADORA**, a través de su broker inmobiliario Juan José Castillo, y canaliza las condiciones de la parte vendedora.
- La carta no atribuye representación legal de ninguna de las partes ni obliga a M.T. BAT S.A.
- Meridiano no recibe fondos: la reserva se transfiere a la cuenta que indique la vendedora.
- Firma: **JUAN JOSÉ CASTILLO · Broker Inmobiliario · MERIDIANO CAPITAL · Inmobiliaria colocadora**, sin firma manuscrita ni digital.

## 2. Fuentes y prioridad aplicada

| Prioridad | Fuente | Uso |
|---|---|---|
| 1 | Instrucciones del founder (encargo inicial + mensaje del 2026-10-22: fecha de emisión y regla "a través de su broker") | Marco general, fecha y redacción |
| 1 | `source-documents/CONDICION_DE_COMPRA.docx` — condiciones pactadas | **Prevalece sobre el encargo inicial** en forma de pago, vigencia, gastos, IVA, comisión, impuestos inmobiliarios y aprobación bancaria |
| 2 | `source-documents/Carta_Presentacion_Cliente_Edificio_Inox_Republica_Argentina.docx` | Nombre del edificio, asesores intervinientes, constancia de presentación del cliente |
| 2 | `Propuesta_Compra_Edificio_Republica_Argentina_Tobati.pdf` | **No disponible en la sesión.** Se usaron los datos transcritos en el encargo, que el founder validó (fecha, USD 700.000, 250.000 + 450.000, verificación de dominio) |
| 3 | `Carta oferta Modelo.pdf` (Casa Herrera) | **No disponible en la sesión.** Se usó el sistema visual oficial de Meridiano |

## 3. Datos utilizados

| Campo | Dato | Fuente |
|---|---|---|
| Inmueble | Edificio Inox, edificio mixto de departamentos y locales comerciales | Encargo + carta de presentación |
| Dirección | Avda. República Argentina esquina Tobatí, Asunción | Ídem |
| Cta. Cte. Catastral | 14-0322-17 | Ídem (coinciden) |
| Vendedora | M.T. BAT Sociedad Anónima; representante: Sra. Mabel Torrico | Ídem |
| Comprador | Matías Manzato, C.I. N.º 9489984 | Ídem (coinciden) |
| Asesores intervinientes | Lourdes Baratto y Juan José Castillo (Meridiano Capital) | Carta de presentación |

**No se incorporó a la carta**:
- La superficie de 664 m²: la carta de presentación no aclara si es de terreno o construida.
- El barrio (Hipódromo).
- La C.I. de Lourdes Baratto: no hace falta en una carta al comprador.
- El reparto 50/50 de la comisión entre asesores, que es un acuerdo interno entre ellos.
- La cláusula de no evasión.
- El precio histórico de USD 890.000.

## 4. Cálculos verificados

| Verificación | Resultado |
|---|---|
| Reserva + seña + saldo = precio | 82.000 + 168.000 + 570.000 = **820.000** ✔ |
| Reserva + seña frente a la entrega inicial de la oferta | 82.000 + 168.000 = **250.000**: coincide con el monto inicial de la oferta original, ahora en dos tramos ✔ |
| Reserva / precio | 82.000 / 820.000 = **10,0 %** |
| Saldo | No figura en `CONDICION_DE_COMPRA.docx`; se deduce del precio menos reserva y seña = **570.000**, igual al del encargo inicial ✔ |
| Letras | Ochenta y dos mil / Ciento sesenta y ocho mil / Quinientos setenta mil / Ochocientos veinte mil dólares estadounidenses ✔ |
| Comisión 5,5 % sobre USD 820.000 | **USD 45.100**. Interno, no figura en la carta |
| Comisión 5,5 % sobre USD 700.000 (base que dice la carta de presentación) | USD 38.500. **Diferencia de USD 6.600** (ver §6.1) |
| IVA de venta (mecanismo legal verificado, D-082) | 5 % × 30 % × 820.000 = **USD 12.300** (1,5 % efectivo) |
| IVA de venta si se lee "5 % del total" | 5 % × 820.000 = USD 41.000 (ver §5) |

## 5. ⚠️ ALERTA: redacción del IVA

`CONDICION_DE_COMPRA.docx` dice: *"El IVA equivalente al 5% del total del valor de venta será pagado por el vendedor como lo establece la ley."*

Según la metodología verificada del repo (`knowledge-base/investment/methodologies/iva-venta-de-inmuebles-paraguay.md`, D-082 y D-083; Ley 125/91, Art. 82 y 91), la venta de inmuebles por una persona jurídica tributa **5 % sobre una base imponible presunta del 30 % del precio, o sea 1,5 % efectivo**, y no 5 % sobre el total. "5 % del total" es justamente la interpretación que el repo corrigió el 2026-08-23.

**Cómo se resolvió en la carta.** Se mantuvo lo pactado (el IVA lo paga la vendedora, "como lo establece la ley", a la tasa del 5 %) y se quitó "del total del valor de venta":

> "El IVA correspondiente a la venta del inmueble, a la tasa del 5 % aplicable a la enajenación de inmuebles, será pagado por la parte vendedora, como lo establece la ley."

Así la carta no fija por escrito una base incorrecta. Para el comprador no cambia nada económicamente (lo paga la vendedora y no se suma al precio).

**Decisión del founder:**
- Si se prefiere copiar literalmente "equivalente al 5 % del total del valor de venta", hay que cambiar una línea del generador.
- En cualquier caso, la base y el monto deben confirmarlos el contador de la vendedora.

## 6. Inconsistencias detectadas en los documentos fuente (no frenan la carta)

1. **Carta de presentación desactualizada en la base de la comisión.** Calcula el 5,5 % "sobre el valor total de la operación (USD 700.000)" y lo hace pagadero "a la firma del contrato de compraventa y entrega de la seña de trato (USD 250.000)". Con lo pactado ahora:
   - El precio es USD 820.000.
   - La seña de trato es USD 168.000 y se firma en escribanía, dentro de los 30 días desde una reserva previa de USD 82.000.
   - Conviene actualizarla o hacer una adenda (base y momento de pago) antes de firmar el contrato privado.
2. **La carta de presentación tiene campos sin completar:**
   - C.I. de Mabel Torrico.
   - C.I. de Juan José Castillo.
   - Finca N.º.
   - Código o referencia.
   - Fecha.

   La carta de Meridiano dice que la presentación del cliente "consta" en esa carta, sin afirmar fecha ni firma. Confirmar que la carta esté firmada por la propietaria.
3. **Gastos de transferencia vs. gastos de escrituración.** Lo pactado dice "gastos de transferencia 50 % a cargo del comprador" (el 50 % de la vendedora se deduce). El encargo inicial hablaba de gastos de escrituración. La carta usa el término pactado, "gastos de transferencia", y explicita el 50/50.
4. **Acompañamiento de 6 meses y verificación documental.** No figuran en `CONDICION_DE_COMPRA.docx`; vienen del encargo inicial y de la oferta original. Se mantuvieron porque nada indica que se hayan dejado sin efecto. **Confirmar** con la vendedora que sigue vigente el acompañamiento.
5. **Naturaleza del documento.** `CONDICION_DE_COMPRA.docx` se redacta como "intención de compra" con "ACEPTA Precio de Venta". Parece la aceptación del comprador sobre USD 820.000. La carta mantiene el título "Respuesta a propuesta de compra y contraoferta" que fijó el encargo. Si las condiciones ya están aceptadas por ambas partes, podría retitularse "Confirmación de condiciones de la operación".

## 7. Regla del founder: "a través de su broker"

> "Siempre que se nombra a Meridiano y hay intermediación de venta se aclara que es a través de su broker inmobiliario Juan José Castillo."

En la v3 se aplica en cada una de las 4 menciones de Meridiano dentro del cuerpo:
- El cuadro de intervinientes ("Meridiano Capital, a través de Juan José Castillo · Broker inmobiliario", formato del modelo).
- La apertura.
- El párrafo de intermediación.
- "Vigencia, respuesta y alcance".

En la v3 se redactó en frases cortas, sin la cadena de incisos entre comas que señaló el founder. Excepciones deliberadas:
- El pie de página institucional (datos de contacto, no una mención de intermediación).
- El bloque de firma, que ya nombra a Juan José Castillo.

El cierre se reformuló para no nombrar a Meridiano sin necesidad. **[EXTENSION]**: esta regla no está todavía en `knowledge-base/brand/09-cierres-y-firmas.md`; conviene registrarla allí si debe aplicarse a todas las piezas futuras de intermediación.

## 8. Puntos pendientes

| # | Pendiente | Estado |
|---|---|---|
| 1 | Vigencia | ✔ Resuelto: 30 días hábiles desde el 23-10-2026. La fecha exacta de vencimiento depende de los feriados que se computen y no se fijó en la carta |
| 2 | Fecha de emisión y plazo para escriturar | ✔ Resuelto: 23-10-2026; escritura dentro de 180 días hábiles desde la seña |
| 3 | Desde cuándo corren los 6 meses de acompañamiento ("desde la compra") | Abierto (ver §6.4) |
| 4 | Comisión: base, IVA de honorarios, exigibilidad | Parcial: 5,5 %, 100 % vendedora, reparto 50/50 entre asesores (carta de presentación). Abierto: base USD 820.000 vs. 700.000 e IVA de honorarios (§6.1) |
| 5 | Entrega inicial: receptor y medio | ✔ Resuelto: reserva y seña por transferencia bancaria a la cuenta que indique la vendedora. Sigue abierto qué pasa con la reserva si la operación no se concreta |
| 6 | Respaldo de la vendedora y facultades del firmante | Abierto: facultades de Mabel Torrico (acta o poder) |
| 7 | **Redacción del IVA** | **Abierto, decisión del founder** (§5) |

## 9. Control de calidad realizado

- [x] Cifras y letras (§4); suma 82.000 + 168.000 + 570.000 = 820.000.
- [x] Fecha "Asunción, 23 de octubre de 2026" y vigencia de 30 días hábiles.
- [x] Nombres, C.I. 9489984, Cta. Catastral 14-0322-17, M.T. BAT S.A., Sra. Mabel Torrico, Edificio Inox.
- [x] Las 4 menciones de Meridiano en el cuerpo llevan "a través de su broker inmobiliario Juan José Castillo".
- [x] Firmas de los 4 intervinientes (vendedora, comprador, JJC, Lourdes Baratto) en la página 2, junto al cierre, sin quedar solas. Destinatario una sola vez. Constancia de recepción y respuesta en la página 3.
- [x] PDF A4 de 3 páginas (v3). Se revisaron visualmente las tres y coinciden con el .docx (mismo generador; PDF exportado con LibreOffice).
- [x] Sin errores de codificación; no aparecen USD 890.000, USD 45.100, Casa Herrera ni firmas de terceros.
- [x] Barrido de PII de los documentos fuente: solo nombre y C.I., permitidos en `contracts/` por `PII_POLICY.md`; sin domicilios, emails, teléfonos ni RUC.
- [ ] **No se envió a las partes**: queda para la decisión del founder (en particular §5).

### Brand Guardian (Matriz de Decisión)

1. Estrategia: APROBADO.
2. Identidad verbal: APROBADO.
3. Identidad visual: APROBADO (logo oficial).
4. Tipografía: APROBADO (Fraunces sin negrita / Poppins).
5. Color: APROBADO (petróleo y dorado oficiales).
6. Fotografía/imagen: no aplica.
7. Composición: APROBADO.
8. Experiencia: APROBADO.
9. Premiumización: APROBADO.
10. Coherencia: APROBADO.

**Veredicto: APROBADO.**

## 10. Reproducir

```bash
python3 contracts/cases/REPARG-001/generador/build_contraoferta.py
cd contracts/cases/REPARG-001/client-response
soffice --headless --convert-to pdf Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx
```

Requiere Poppins y una instancia estática de Fraunces (opsz 72, SOFT 24, WONK 0, wght 400). Con la fuente variable, LibreOffice embebe Fraunces como Type 3.
