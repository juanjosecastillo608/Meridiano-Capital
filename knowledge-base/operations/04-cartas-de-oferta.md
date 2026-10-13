```
Estado: CURRENT
Fuente original: cartas reales de Meridiano Capital aportadas por el founder el 2026-10-13 (oferta de alquiler de oficina, 10-09-2026; intención de compra de inmueble, 22-05-2026) + prompt maestro de carta de oferta (founder, 2026-10-13)
Dominio: OPERATIONS
```

# Cartas de oferta — compra y alquiler

**Estado: CURRENT (D-096).** Sin datos de clientes: los modelos originales no se versionan. Las cartas de cada operación viven en `contracts/cases/<CASO>/carta-oferta/`.

## Cómo se hacen

Siempre con el generador `production/generadores/cartas_oferta/` (ficha YAML → DOCX + PDF + control). No redactar a mano en Word salvo para ajustes finales sobre el DOCX generado.

## Reglas de contenido (prompt maestro)

1. **Papel de Meridiano explícito**: CAPTADOR (lado de la propiedad), COLOCADOR (aporta al comprador o inquilino) o AMBOS. Meridiano **presenta y canaliza**; no acepta, no firma por las partes y no recibe fondos por su sola intervención. No escribir "en representación de" sin mandato documentado.
2. **No inventar**: lo que falta va como `[PENDIENTE: ...]`; la carta no sale como LISTO PARA FIRMA con pendientes.
3. **Precio en cifras y letras**, moneda inequívoca; el precio pedido figura solo como referencia.
4. **Forma de pago en tabla**, que debe sumar el precio ofertado. Reserva, seña y anticipo **no son sinónimos**: se dice si cada uno se imputa al precio, quién lo recibe y cuándo se paga.
5. **Vigencia** en días corridos (o hábiles) contados desde la presentación. La constancia de recepción fija esa fecha, y la recepción **no es aceptación**.
6. **Formulario de respuesta** para la parte destinataria: acepta, rechaza o contraoferta. Una contraoferta no acepta los términos originales.
7. **Comisión**: solo si fue instruida, y en la sección que firma quien la paga, con IVA incluido o no explícito. El reparto entre inmobiliarias **nunca** va en la carta: es un acuerdo separado.
8. **Impuestos de la venta**: no fijar un porcentaje de IVA en la carta sin verificarlo con el contador. Uno de los modelos originales decía "IVA 2,4 %", cifra que no coincide con la regla vigente del 1,5 % efectivo para persona jurídica (D-082/D-083). Si vende una persona física, el encuadre es distinto y lo confirma el contador.
9. Lo legal, notarial, fiscal y bancario lo valida el profesional que corresponde (escribano, abogado, contador, banco). Meridiano coordina y acompaña.

## Rasgos de estilo de la casa (de los modelos reales)

- Título en mayúsculas ("CARTA DE OFERTA DE COMPRA / DE ALQUILER") y subtítulo con el inmueble.
- Bloque superior **PRESENTA / PROPONENTE** con etiquetas sobre fondo Petróleo.
- Destinatario con "Atte." cuando la carta va a una empresa o inmobiliaria.
- Tabla de condiciones económicas: canon por m², superficie, canon mensual e inicio/plazo en alquiler; precio y cronograma en compra.
- Cierre: "Sin otro particular y aguardando una respuesta favorable, saludamos atentamente."
- Firmas: Juan José Castillo y el proponente o su representante. **Juan José Castillo firma siempre como "Broker inmobiliario" — MERIDIANO CAPITAL** en intervenciones de venta y alquiler (D-097). El generador lo aplica solo: corrige "asesor inmobiliario" en cualquier texto que lo nombre y fija el cargo de su firma.
- Subtítulo bajo el título en la tipografía de cuerpo (Poppins → Calibri) sin cursiva. Párrafos del cuerpo en negro, incluido el de intervención.
- Pie: "Meridiano Capital · Asunción, Paraguay · meridianocapital.net".

## Hallazgo de marca (Brand Guardian)

La carta de alquiler original (sep-2026) usa el **isotipo histórico** (triángulo simétrico, v1.0 del manual), reemplazado por D-034. El generador usa el lockup vigente. Hay que revisar otras plantillas que se usen fuera del repo (Word o Canva) para que no reproduzcan el logo viejo.
