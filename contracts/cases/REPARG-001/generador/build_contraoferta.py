"""Genera la respuesta y contraoferta del caso REPARG-001 (Edificio Inox, República Argentina).

Salida: contracts/cases/REPARG-001/client-response/
  Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx
  (el PDF se obtiene con: soffice --headless --convert-to pdf <docx>)

Paleta e identidad Meridiano Capital (knowledge-base/brand/05 y 04). Fraunces nunca
en negrita literal (D-040): el peso del titular sale de tamaño y color.
"""
import io
from pathlib import Path

from PIL import Image
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

AQUI = Path(__file__).resolve().parent
REPO = AQUI.parents[3]
SALIDA = AQUI.parent / "client-response"
LOGO = REPO / "production/generadores/logo_horizontal.png"
NOMBRE = "Respuesta_Contraoferta_Republica_Argentina_Meridiano.docx"

PET, GOLD, GOLD_D, GREY, TEXTO = "14313A", "C9982E", "A87D22", "6B6154", "2A2620"
LINEA, FILA, CREMA = "DAD2C0", "F7F4EE", "F3EDE3"
SERIF, SANS = "Fraunces", "Poppins"

# ---------- Datos del caso ----------
# Fuentes: CONDICIÓN DE COMPRA.docx (condiciones pactadas) y Carta de Presentación de
# Cliente (Edificio Inox) — ver client-response/Control_Contraoferta_Republica_Argentina.md
FECHA_EMISION = "23 de octubre de 2026"
REF_INTERNA = "REPARG-001-CO01 · v3"
PRECIO, RESERVA, SENA, SALDO = 820_000, 82_000, 168_000, 570_000
assert RESERVA + SENA + SALDO == PRECIO
# Regla del founder: si se nombra a Meridiano en una intermediación de venta, siempre se
# aclara "a través de su broker inmobiliario Juan José Castillo" (frases cortas, sin incisos).


def usd(n):
    return "USD " + f"{n:,}".replace(",", ".")


def rgb(h):
    return RGBColor.from_string(h)


def run(p, text, *, font=SANS, size=10, color=TEXTO, bold=False, italic=False):
    r = p.add_run(text)
    r.font.name = font
    r._element.rPr.rFonts.set(qn("w:eastAsia"), font)
    r.font.size = Pt(size)
    r.font.color.rgb = rgb(color)
    r.bold = bold
    r.italic = italic
    return r


def para(doc_or_cell, text="", *, size=9, color=TEXTO, bold=False, italic=False,
         align=WD_ALIGN_PARAGRAPH.JUSTIFY, before=0, after=6, font=SANS, keep_next=False):
    p = doc_or_cell.add_paragraph()
    pf = p.paragraph_format
    pf.space_before, pf.space_after = Pt(before), Pt(after)
    pf.line_spacing = 1.04
    pf.alignment = align
    pf.keep_with_next = keep_next
    if text:
        run(p, text, font=font, size=size, color=color, bold=bold, italic=italic)
    return p


def shade(cell, fill):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tcPr.append(shd)


def borders(table, color=LINEA, sz=4, inside=True):
    tblPr = table._element.tblPr
    b = OxmlElement("w:tblBorders")
    edges = ["top", "left", "bottom", "right"] + (["insideH", "insideV"] if inside else [])
    for e in edges:
        el = OxmlElement(f"w:{e}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(sz))
        el.set(qn("w:color"), color)
        b.append(el)
    tblPr.append(b)


def cell_margins(table, top=60, bottom=60, left=110, right=110):
    tblPr = table._element.tblPr
    m = OxmlElement("w:tblCellMar")
    for k, v in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        el = OxmlElement(f"w:{k}")
        el.set(qn("w:w"), str(v))
        el.set(qn("w:type"), "dxa")
        m.append(el)
    tblPr.append(m)


def cant_split(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:cantSplit")
    trPr.append(el)


def widths(table, cms):
    # LibreOffice ignora el ancho de celda si la tabla no trae grilla y layout fijo.
    table.autofit = False
    tblPr = table._element.tblPr
    lay = OxmlElement("w:tblLayout")
    lay.set(qn("w:type"), "fixed")
    tblPr.append(lay)
    tblW = tblPr.find(qn("w:tblW"))
    if tblW is None:
        tblW = OxmlElement("w:tblW")
        tblPr.append(tblW)
    tblW.set(qn("w:w"), str(int(sum(cms) * 567)))
    tblW.set(qn("w:type"), "dxa")
    for col, w in zip(table.columns, cms):
        col.width = Cm(w)
    for row in table.rows:
        for c, w in zip(row.cells, cms):
            c.width = Cm(w)


def keep_together(table):
    # Todas las filas menos la última quedan unidas a la siguiente: la tabla no se parte.
    for row in table.rows[:-1]:
        for c in row.cells:
            for p in c.paragraphs:
                p.paragraph_format.keep_with_next = True


def cell_text(c, text, *, size=9, color=TEXTO, bold=False, align=WD_ALIGN_PARAGRAPH.LEFT, italic=False):
    c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.alignment = align
    run(p, text, size=size, color=color, bold=bold, italic=italic)
    return p


def rule(doc, color=GOLD, sz=6, before=2, after=8):
    p = para(doc, before=before, after=after)
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    bot.set(qn("w:val"), "single")
    bot.set(qn("w:sz"), str(sz))
    bot.set(qn("w:color"), color)
    bdr.append(bot)
    pPr.append(bdr)
    return p


def field(p, instr, placeholder="1", **kw):
    # Campo completo (begin / instr / separate / resultado / end), cada parte en su propio
    # run con la misma tipografía: si no, Word y LibreOffice muestran el número con el
    # tamaño por defecto del documento en vez del del pie.
    def parte(tag, attr=None, text=None):
        r = run(p, "", **kw)
        el = OxmlElement(tag)
        if attr:
            el.set(qn("w:fldCharType"), attr)
        if text is not None:
            el.set(qn("xml:space"), "preserve")
            el.text = text
        r._element.append(el)

    parte("w:fldChar", "begin")
    parte("w:instrText", text=f" {instr} ")
    parte("w:fldChar", "separate")
    run(p, placeholder, **kw)
    parte("w:fldChar", "end")


def logo_bytes():
    im = Image.open(LOGO)
    buf = io.BytesIO()
    im.crop(im.getbbox()).save(buf, format="PNG")
    buf.seek(0)
    return buf


def condicion(doc, n, titulo, cuerpo):
    p = para(doc, after=2)
    p.paragraph_format.left_indent = Cm(0.75)
    p.paragraph_format.first_line_indent = Cm(-0.75)
    run(p, f"{n}.\t", size=9, color=GOLD_D, bold=True)
    run(p, titulo + " ", size=9, color=PET, bold=True)
    run(p, cuerpo, size=9)
    p.paragraph_format.tab_stops.add_tab_stop(Cm(0.75))
    return p


def tracking(r, twips):
    # Espaciado entre letras del titular (estilo del modelo de carta de oferta).
    sp = OxmlElement("w:spacing")
    sp.set(qn("w:val"), str(twips))
    r._element.get_or_add_rPr().append(sp)


def heading(doc, text, before=6):
    # Encabezado de sección en serif, como el modelo ("Inmueble", "Precio", ...).
    p = para(doc, text, font=SERIF, size=12, color=PET, align=WD_ALIGN_PARAGRAPH.LEFT,
             before=before, after=3, keep_next=True)
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    for k, v in (("val", "single"), ("sz", "4"), ("color", LINEA), ("space", "2")):
        bot.set(qn(f"w:{k}"), v)
    bdr.append(bot)
    pPr.append(bdr)
    return p


def ficha(doc, filas, anchos=(5.0, 12.0), *, oscuro=True):
    # Tabla etiqueta/valor: etiqueta en petróleo (o crema) y valor en negrita, como el modelo.
    t = doc.add_table(rows=len(filas), cols=2)
    borders(t)
    cell_margins(t, top=30, bottom=30)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (k, v) in enumerate(filas):
        shade(t.cell(i, 0), PET if oscuro else CREMA)
        cell_text(t.cell(i, 0), k.upper(), size=7.5, color="FFFFFF" if oscuro else PET, bold=True)
        cell_text(t.cell(i, 1), v, size=8.5, bold=oscuro, color=PET if oscuro else TEXTO)
        cant_split(t.rows[i])
    widths(t, list(anchos))
    return t


def firma(cell, lineas):
    # Espacio en blanco para firmar + línea + datos del firmante.
    # lineas: [(texto, color, negrita)]; la primera es el nombre.
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(20)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.keep_with_next = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    top = OxmlElement("w:top")
    for k, v in (("val", "single"), ("sz", "6"), ("color", PET), ("space", "4")):
        top.set(qn(f"w:{k}"), v)
    bdr.append(top)
    pPr.append(bdr)
    texto, color, negrita = lineas[0]
    run(p, texto, size=9.5, color=color, bold=negrita)
    for i, (texto, color, negrita) in enumerate(lineas[1:], start=1):
        q = cell.add_paragraph()
        q.alignment = WD_ALIGN_PARAGRAPH.CENTER
        q.paragraph_format.space_after = Pt(0)
        q.paragraph_format.keep_with_next = i < len(lineas) - 1
        run(q, texto, size=8, color=color, bold=negrita)


def opcion(doc, texto):
    p = para(doc, after=3, align=WD_ALIGN_PARAGRAPH.LEFT)
    run(p, "☐  ", size=10, color=PET)
    run(p, texto, size=9)
    return p


def build():
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = SANS
    st.font.size = Pt(10)

    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.top_margin, sec.bottom_margin = Cm(1.8), Cm(1.5)
    sec.left_margin = sec.right_margin = Cm(2.0)
    sec.header_distance, sec.footer_distance = Cm(0.8), Cm(0.7)

    # ---------- Encabezado: logo ----------
    hdr = sec.header
    lp = hdr.paragraphs[0]
    lp.add_run().add_picture(logo_bytes(), height=Cm(1.0))
    hrule = hdr.add_paragraph()
    hrule.paragraph_format.space_after = Pt(0)
    pPr = hrule._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    for k, v in (("val", "single"), ("sz", "4"), ("color", GOLD)):
        bot.set(qn(f"w:{k}"), v)
    bdr.append(bot)
    pPr.append(bdr)

    # ---------- Pie: contacto institucional + paginación ----------
    fp = sec.footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(fp, "Meridiano Capital · Asunción, Paraguay · +595 982 853 111 · "
            "juancastillo@meridianocapital.net · www.meridianocapital.net", size=7, color=GREY)
    fp2 = sec.footer.add_paragraph()
    fp2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(fp2, "Página ", size=7, color=GREY)
    field(fp2, "PAGE", size=7, color=GREY)
    run(fp2, " de ", size=7, color=GREY)
    field(fp2, "NUMPAGES", size=7, color=GREY)

    # ---------- Título centrado (estilo del modelo) ----------
    p = para(doc, align=WD_ALIGN_PARAGRAPH.CENTER, before=4, after=1)
    tracking(run(p, "RESPUESTA A PROPUESTA DE COMPRA Y CONTRAOFERTA", font=SERIF, size=14.5,
                 color=PET), 30)
    para(doc, "Edificio Inox · Avda. República Argentina esquina Tobatí · Asunción",
         size=9.5, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, after=0)
    rule(doc, color=LINEA, sz=4, after=4)

    # ---------- Lugar, fecha y referencia ----------
    para(doc, f"Asunción, {FECHA_EMISION}", size=9.5, color=GOLD_D,
         align=WD_ALIGN_PARAGRAPH.RIGHT, after=0)
    para(doc, f"Ref. interna: {REF_INTERNA}", size=7.5, color=GREY,
         align=WD_ALIGN_PARAGRAPH.RIGHT, after=6)

    # ---------- Intervinientes ----------
    ficha(doc, [
        ("Comprador / oferente", "Matías Manzato · C.I. N.º 9489984"),
        ("Parte vendedora", "M.T. BAT Sociedad Anónima · representante: Sra. Mabel Torrico"),
        ("Inmobiliaria colocadora", "Meridiano Capital, a través de Juan José Castillo · "
                                    "Broker inmobiliario"),
        ("Asesora inmobiliaria", "Lourdes Baratto"),
    ])

    # ---------- Destinatario (una sola vez) ----------
    para(doc, "Señor", align=WD_ALIGN_PARAGRAPH.LEFT, before=8, after=0)
    para(doc, "Matías Manzato", color=PET, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, after=0)
    para(doc, "Presente", align=WD_ALIGN_PARAGRAPH.LEFT, after=6)
    para(doc, "Ref.: Respuesta a su propuesta de compra del 16 de octubre de 2026 – Edificio Inox, "
              "Asunción", color=PET, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, after=6)

    # ---------- Apertura (frases cortas, sin cadenas de incisos) ----------
    def cuerpo(texto, after=5):
        q = para(doc, texto, after=after)
        q.paragraph_format.first_line_indent = Cm(1.0)
        return q

    cuerpo("Por medio de la presente le transmitimos la respuesta de la parte vendedora a su "
           "propuesta formal de compra del 16 de octubre de 2026 por USD 700.000. "
           "Meridiano Capital actúa en esta operación como inmobiliaria colocadora a través de su "
           "broker inmobiliario Juan José Castillo.")
    cuerpo("Su propuesta se refiere al Edificio Inox, ubicado en Avda. República Argentina esquina "
           "Tobatí de Asunción e identificado con la Cuenta Corriente Catastral N.º 14-0322-17. "
           "El inmueble es propiedad de M.T. BAT Sociedad Anónima, representada por la señora "
           "Mabel Torrico.")
    cuerpo("Su presentación como interesado consta en la carta de presentación de cliente y "
           "reconocimiento de comisión dirigida a la parte vendedora. Esa carta deja constancia de "
           "la intermediación de los dos asesores inmobiliarios intervinientes: la señora Lourdes "
           "Baratto y Meridiano Capital a través de su broker inmobiliario Juan José Castillo.")
    cuerpo("La parte vendedora tuvo en cuenta los presupuestos y las necesidades de remodelación "
           "que usted planteó para regularizar los planos y realizar los arreglos básicos del "
           "edificio. En consideración de ello, acepta reducir el precio de venta a USD 820.000 "
           "(ochocientos veinte mil dólares estadounidenses) en las condiciones que se detallan a "
           "continuación. La reducción no implica que la parte vendedora asuma la ejecución ni el "
           "costo de esas reformas o regularizaciones.", after=2)

    # ---------- Precio y forma de pago ----------
    heading(doc, "Precio y forma de pago")
    filas_pago = [
        ("Reserva", "Ochenta y dos mil dólares estadounidenses",
         "Una vez aceptada la presente propuesta, mediante transferencia bancaria a la cuenta "
         "que indique la parte vendedora", RESERVA),
        ("Seña de trato", "Ciento sesenta y ocho mil dólares estadounidenses",
         "A la firma del contrato privado de compraventa en escribanía, en un lapso no mayor a "
         "30 días corridos desde la reserva, mediante transferencia bancaria", SENA),
        ("Saldo de la operación", "Quinientos setenta mil dólares estadounidenses",
         "A la firma de la escritura traslativa de dominio en escribanía, en un lapso de 180 días "
         "hábiles a partir de la seña de trato, mediante transferencia bancaria", SALDO),
    ]
    pagos = doc.add_table(rows=len(filas_pago) + 2, cols=3)
    borders(pagos)
    cell_margins(pagos, top=30, bottom=30)
    pagos.alignment = WD_TABLE_ALIGNMENT.CENTER
    for j, h in enumerate(("Concepto", "Oportunidad y forma de pago", "Importe")):
        shade(pagos.cell(0, j), PET)
        cell_text(pagos.cell(0, j), h.upper(), size=7.5, color="FFFFFF", bold=True,
                  align=WD_ALIGN_PARAGRAPH.RIGHT if j == 2 else WD_ALIGN_PARAGRAPH.LEFT)
    for i, (c, letras, o, imp) in enumerate(filas_pago, start=1):
        if i % 2 == 0:
            for j in range(3):
                shade(pagos.cell(i, j), FILA)
        cell_text(pagos.cell(i, 0), c, size=9, bold=True, color=PET)
        lq = pagos.cell(i, 0).add_paragraph()
        lq.paragraph_format.space_after = Pt(0)
        run(lq, letras, size=7.5, color=GREY, italic=True)
        cell_text(pagos.cell(i, 1), o, size=8.5)
        cell_text(pagos.cell(i, 2), usd(imp), size=9.5, bold=True, color=PET,
                  align=WD_ALIGN_PARAGRAPH.RIGHT)
    tot = len(filas_pago) + 1
    for j in range(3):
        shade(pagos.cell(tot, j), CREMA)
    cell_text(pagos.cell(tot, 0), "PRECIO TOTAL DE VENTA", size=8, bold=True, color=PET)
    cell_text(pagos.cell(tot, 1), "Ochocientos veinte mil dólares estadounidenses", size=8.5,
              color=GREY, italic=True)
    cell_text(pagos.cell(tot, 2), usd(PRECIO), size=10.5, bold=True, color=PET,
              align=WD_ALIGN_PARAGRAPH.RIGHT)
    for r in pagos.rows:
        cant_split(r)
    widths(pagos, [4.6, 9.2, 3.2])
    keep_together(pagos)
    para(doc, "La reserva y la seña de trato se imputan íntegramente al precio. El saldo de "
              "USD 570.000 sustituye al saldo de USD 450.000 previsto en su propuesta.",
         before=4, after=2)

    # ---------- Condiciones ----------
    heading(doc, "Condiciones de la operación")
    condicion(doc, 1, "Comisión inmobiliaria.",
              "La comisión inmobiliaria del 5,5 % (cinco coma cinco por ciento) será abonada en un "
              "100 % por la parte vendedora.")
    condicion(doc, 2, "Gastos de transferencia.",
              "Los gastos de transferencia serán pagados en un 50 % por la parte compradora y en un "
              "50 % por la parte vendedora. Este reparto es independiente de los impuestos "
              "indicados en los puntos siguientes.")
    condicion(doc, 3, "IVA.",
              "El IVA correspondiente a la venta del inmueble será pagado por la parte vendedora a "
              "la tasa del 5 % aplicable a la enajenación de inmuebles, como lo establece la ley. "
              "No se adiciona al precio de USD 820.000.")
    condicion(doc, 4, "Impuestos inmobiliarios.",
              "Los impuestos inmobiliarios deben estar al día y son a cargo de la parte vendedora, "
              "como lo establece la ley.")
    condicion(doc, 5, "Aprobación bancaria.",
              "Toda la operación y las transferencias estarán sujetas a la aprobación del banco "
              "interviniente. La parte vendedora se compromete a facilitar y gestionar de común "
              "acuerdo toda la información y la documentación que soliciten los bancos "
              "intervinientes en las transferencias.")
    condicion(doc, 6, "Acompañamiento de transición.",
              "La parte vendedora se compromete a acompañar a la parte compradora durante seis (6) "
              "meses desde la compra. Brindará toda la información y el conocimiento necesarios para "
              "el traspaso de la documentación y de la gestión de locación del edificio. Este "
              "acompañamiento es informativo y de transición: no constituye garantía de renta, "
              "administración del edificio ni cobranza, ni responsabilidad por las decisiones "
              "futuras de la parte compradora.")
    condicion(doc, 7, "Verificación documental.",
              "Conforme a su propuesta, la operación sigue sujeta a la verificación de la "
              "documentación de dominio del inmueble y de que se encuentre libre de gravámenes. "
              "La presente no implica que esa verificación ya se haya realizado.")
    condicion(doc, 8, "Formalización.",
              "Las condiciones aquí comunicadas deberán instrumentarse por escrito y ser firmadas "
              "por la parte compradora y por la parte vendedora. Por la parte vendedora firmará "
              "quien acredite facultades suficientes.")

    # ---------- Vigencia, respuesta y alcance ----------
    heading(doc, "Vigencia, respuesta y alcance")
    para(doc, "La presente propuesta tiene una validez de 30 (treinta) días hábiles a partir de su "
              f"fecha de emisión, el {FECHA_EMISION}. La parte compradora comunicará su respuesta "
              "por escrito mediante el formulario adjunto a la presente.", after=4)
    para(doc, "Meridiano Capital interviene como inmobiliaria colocadora a través de su broker "
              "inmobiliario Juan José Castillo, con la función de presentar y canalizar esta "
              "respuesta. Ninguno de los asesores inmobiliarios intervinientes representa "
              "legalmente a las partes ni está facultado para obligar a M.T. BAT Sociedad Anónima, "
              "aceptar en nombre de la parte compradora o recibir fondos de la operación.", after=4)
    para(doc, "Sin otro particular y aguardando una respuesta favorable, le saludamos "
              "atentamente.", after=3, keep_next=True)

    # ---------- Firmas de los intervinientes ----------
    para(doc, "Firmas de los intervinientes. La parte vendedora firma en conformidad con estas "
              "condiciones; la parte compradora, en toma de conocimiento.", size=8,
         color=GREY, italic=True, after=0, keep_next=True, align=WD_ALIGN_PARAGRAPH.LEFT)
    f = doc.add_table(rows=2, cols=2)
    f.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_margins(f, top=0, bottom=0, left=300, right=300)
    firma(f.cell(0, 0), [("MABEL TORRICO", PET, True),
                         ("En representación de M.T. BAT S.A.", TEXTO, False),
                         ("C.I. N.º 2035707", TEXTO, False),
                         ("PARTE VENDEDORA", GOLD_D, True)])
    firma(f.cell(0, 1), [("MATÍAS MANZATO", PET, True),
                         ("C.I. N.º 9489984", TEXTO, False),
                         ("COMPRADOR / OFERENTE", GOLD_D, True)])
    firma(f.cell(1, 0), [("JUAN JOSÉ CASTILLO", PET, True),
                         ("C.I. N.º 9289273 · Broker Inmobiliario", TEXTO, False),
                         ("INMOBILIARIA COLOCADORA", GOLD_D, True)])
    firma(f.cell(1, 1), [("LOURDES BARATTO", PET, True),
                         ("C.I. N.º 4480441", TEXTO, False),
                         ("ASESORA INMOBILIARIA", GOLD_D, True)])
    for r in f.rows:
        cant_split(r)
    widths(f, [8.5, 8.5])
    keep_together(f)

    # ---------- Página de recepción y respuesta de la parte compradora ----------
    # Salto con page_break_before (no un párrafo de salto): evita que el keep_with_next de
    # las firmas arrastre todo el bloque a la página siguiente.
    heading(doc, "Constancia de recepción", before=0).paragraph_format.page_break_before = True
    para(doc, "Recibí copia de esta respuesta y contraoferta. Esta constancia acredita únicamente "
              "la recepción y no implica aceptación.", after=5)
    ficha(doc, [
        ("Fecha y hora de recepción", "____ / ____ / ________ · ____ : ____ hs (hora de Asunción)"),
        ("Firma", ""),
        ("Aclaración y documento", "Matías Manzato · C.I. N.º 9489984"),
    ], oscuro=False)

    heading(doc, "Respuesta de la parte compradora", before=14)
    para(doc, "Marcar una sola opción:", after=3, align=WD_ALIGN_PARAGRAPH.LEFT)
    opcion(doc, "Acepto íntegramente la contraoferta en los términos de esta carta.")
    opcion(doc, "Rechazo la contraoferta.")
    opcion(doc, "Formulo la siguiente contrapropuesta (no implica aceptación de los términos de "
                "esta carta):")
    caja = doc.add_table(rows=1, cols=1)
    borders(caja, inside=False)
    caja.rows[0].height = Cm(3.2)
    widths(caja, [17.0])
    para(doc, "En caso de aceptación, las partes instrumentarán la operación por escrito conforme a "
              "las condiciones detalladas en esta carta, con la intervención de los asesores "
              "inmobiliarios y de la escribanía que corresponda.", before=8, after=5)
    ficha(doc, [
        ("Firma", ""),
        ("Aclaración y C.I. N.º", "Matías Manzato · C.I. N.º 9489984"),
        ("Fecha y hora", "____ / ____ / ________ · ____ : ____ hs (hora de Asunción)"),
    ], oscuro=False)
    for t in (doc.tables[-1], doc.tables[-3]):
        for r in t.rows:
            if r.cells[0].text.strip().upper() == "FIRMA":
                r.height = Cm(1.3)


    SALIDA.mkdir(parents=True, exist_ok=True)
    out = SALIDA / NOMBRE
    doc.save(out)
    return out


if __name__ == "__main__":
    print(build())
