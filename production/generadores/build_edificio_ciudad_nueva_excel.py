"""Edificio Ciudad Nueva — transcripción y análisis de alquileres/rentabilidad.

Genera projects/edificio-ciudad-nueva/entregables/Edificio_Ciudad_Nueva_Alquileres_Rentabilidad.xlsx
con fórmulas editables. Fuentes: dos imágenes enviadas por el founder el 2026-10-02
("Detalle de Alquileres por departamento" y "Planilla de Rentabilidad Edificio Ciudad Nueva M4").
Todo lo que no está en esas imágenes figura como PENDIENTE, nunca como cero confirmado.
Recalcular después con la skill xlsx (scripts/recalc.py).
"""
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

OUT = Path(__file__).resolve().parents[2] / "projects/edificio-ciudad-nueva/entregables/Edificio_Ciudad_Nueva_Alquileres_Rentabilidad.xlsx"
if len(sys.argv) > 1:
    OUT = Path(sys.argv[1])

PETROLEO, CREMA, FILA, LINEA = "14313A", "F3EDE3", "F7F4EE", "DAD2C0"
F = "Arial"
H_FONT = Font(name=F, bold=True, color=CREMA, size=10)
H_FILL = PatternFill("solid", fgColor=PETROLEO)
INPUT = Font(name=F, color="0000FF", size=10)        # dato recibido (editable)
CALC = Font(name=F, color="000000", size=10)         # fórmula
LINK = Font(name=F, color="008000", size=10)         # vínculo a otra hoja
PEND = Font(name=F, color="8B3323", italic=True, size=10)
BOLD = Font(name=F, bold=True, size=10)
TITLE = Font(name=F, bold=True, size=13, color=PETROLEO)
NOTE = Font(name=F, italic=True, size=9, color="6B6154")
PEND_FILL = PatternFill("solid", fgColor="FBEFE9")
thin = Side(style="thin", color=LINEA)
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
GS = '"₲" #,##0'
USD = '"USD" #,##0'
USD2 = '"USD" #,##0.00'
PCT = "0.00%"

wb = Workbook()


def sheet(name, title, widths):
    ws = wb.create_sheet(name)
    ws["A1"] = title
    ws["A1"].font = TITLE
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.sheet_view.showGridLines = False
    return ws


def header(ws, row, labels):
    for i, t in enumerate(labels, 1):
        c = ws.cell(row=row, column=i, value=t)
        c.font, c.fill, c.border = H_FONT, H_FILL, BOX
        c.alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[row].height = 30


def put(ws, ref, value, font=CALC, fmt=None, fill=None):
    c = ws[ref]
    c.value = value
    c.font = font
    c.border = BOX
    if fmt:
        c.number_format = fmt
    if fill:
        c.fill = fill
    return c


def legend(ws, row):
    ws.cell(row=row, column=1, value="Leyenda: azul = dato recibido (fuente: imágenes enviadas 2026-10-02); negro = fórmula; "
            "verde = vínculo a otra hoja; rojo itálica = PENDIENTE de confirmar (no es cero).").font = NOTE


# ---------------------------------------------------------------- Parametros
wb.remove(wb.active)
P = sheet("Parametros", "Parámetros — datos recibidos (sin modificar)", [44, 18, 16, 58])
legend(P, 2)
header(P, 4, ["Parámetro", "Valor", "Estado", "Fuente / observación"])
params = [
    ("Precio de venta (USD)", 340000, USD, "Recibido", "Pedido del founder + planilla de rentabilidad (celda 'Precio USD')."),
    ("Tipo de cambio de la planilla (Gs por USD)", 6100, '#,##0', "Recibido", "Planilla de rentabilidad y detalle de alquileres. Fecha de vigencia NO informada; no es cotización actual."),
    ("Total mensual indicado en el detalle (Gs)", 19550000, GS, "Recibido", "Fila 'TOTAL' del detalle de alquileres."),
    ("Impuesto anual informado (USD)", 2764, USD, "Recibido", "Planilla de rentabilidad. Qué impuesto(s) cubre: PENDIENTE."),
    ("Gastos anuales informados (USD)", 1200, USD, "Recibido", "Planilla de rentabilidad. Qué conceptos cubre: PENDIENTE."),
    ("Ingreso mensual USD indicado en planilla", 3205, USD, "Recibido", "Planilla de rentabilidad (redondeado en la fuente)."),
    ("Ingreso bruto anual USD indicado en planilla", 38459, USD, "Recibido", "Planilla de rentabilidad, columna 'USD Anual'."),
    ("Renta neta anual USD indicada en planilla", 34495, USD, "Recibido", "Planilla de rentabilidad."),
    ("Rentabilidad bruta indicada en planilla", 0.113, "0.0%", "Recibido", "Texto 'Bruta (11,3%)' de la planilla."),
    ("Rentabilidad neta indicada en planilla", 0.1015, PCT, "Recibido", "Celda 'Renta Anual Neta 10,15%' de la planilla."),
    ("Ingreso anual mencionado en la descripción comercial (USD)", 34500, USD, "Recibido", "Descripción del aviso: 'ingresos anuales aprox. USD 34.500' — corresponde al resultado NETO de la planilla, no al bruto."),
    ("Departamentos de 1 dormitorio (mix comercial)", 6, "0", "Recibido", "Descripción comercial."),
    ("Departamentos de 2 dormitorios (mix comercial)", 6, "0", "Recibido", "Descripción comercial."),
    ("Departamentos de 3 dormitorios (mix comercial)", 1, "0", "Recibido", "Descripción comercial."),
    ("Locales comerciales (mix comercial)", 1, "0", "Recibido", "Descripción comercial."),
    ("Tipo de cambio alternativo autorizado (Gs por USD)", None, '#,##0', "PENDIENTE", "Vacío a propósito: cargar solo una cotización autorizada y verificable, con fuente y fecha en la fila siguiente."),
    ("Fuente y fecha del tipo de cambio alternativo", None, None, "PENDIENTE", "Ej.: 'BCP, cotización de referencia, dd/mm/aaaa'."),
]
for i, (name, val, fmt, st, src) in enumerate(params, 5):
    put(P, f"A{i}", name, BOLD)
    if val is None:
        put(P, f"B{i}", None, INPUT, fmt, PEND_FILL)
    else:
        put(P, f"B{i}", val, INPUT, fmt)
    put(P, f"C{i}", st, PEND if st == "PENDIENTE" else CALC)
    put(P, f"D{i}", src, CALC).alignment = Alignment(wrap_text=True)
PR = {k: f"Parametros!$B${i}" for k, i in zip(
    ["precio", "tc", "total_ind", "imp", "gastos", "usd_mes_pl", "bruto_pl", "neto_pl", "yb_pl", "yn_pl",
     "desc", "mix1", "mix2", "mix3", "mixloc", "tc_alt", "tc_alt_src"], range(5, 22))}

# ---------------------------------------------------------- Datos_Originales
D = sheet("Datos_Originales", "Datos originales — transcripción literal de las imágenes recibidas", [16, 16, 18, 16, 16])
D["A2"] = "Texto y orden conservados tal como aparecen en las imágenes. Sin cálculos en esta hoja."
D["A2"].font = NOTE
D["A4"] = "Imagen 1 — Detalle de alquileres (columnas B, C, D de la captura)"
D["A4"].font = BOLD
header(D, 5, ["Columna B", "Columna C", "Columna D"])
orig = [
    (None, "Edificio de departamentos", None), (None, "Tercer piso", None),
    ("Inquilino", "2 dorm.", 1500000), ("Inquilino", "2 dorm.", 1500000), ("Inquilino", "1 dorm.", 1200000), ("Inquilino", "1 dorm.", 1100000),
    (None, "Segundo piso", None),
    ("Inquilino", "2 dorm.", 1600000), ("Inquilino", "2 dorm.", 1500000), ("Inquilino", "2 dorm.", 1500000), ("Inquilino", "2 dorm.", 1500000), ("Inquilino", "1 dorm.", 1250000),
    (None, "Primer piso", None),
    ("Inquilino", "1 dorm.", 1300000), ("Inquilino", "3 dorm.", 1600000),
    (None, "Planta Baja", None),
    ("Inquilino", "1 dorm.", 1200000), ("Inquilino", "1 dorm.", 900000), ("Inquilino", "Cochera", 700000), ("Inquilino", "Cochera y dpto", 1200000),
    (None, "TOTAL", 19550000), ("Cambio", 6100, 3205),
]
r = 6
for b, c, dval in orig:
    put(D, f"A{r}", b, INPUT)
    put(D, f"B{r}", c, INPUT if not isinstance(c, (int, float)) else INPUT, '#,##0' if isinstance(c, int) else None)
    put(D, f"C{r}", dval, INPUT, GS if (dval and dval > 10000) else ('"₲" #,##0' if dval else None))
    r += 1
D.cell(row=r, column=1, value="Nota: la última fila de la captura muestra 'Cambio | 6100 | ₲ 3.205'; el '₲' delante de 3.205 es de la fuente (es un valor en USD).").font = NOTE

r += 2
D[f"A{r}"] = "Imagen 2 — Planilla 'RENTABILIDAD EDIFICIO DE APARTAMENTOS'"
D[f"A{r}"].font = BOLD
r += 1
header(D, r, ["Precio USD", "Renta Anual", "USD Mensual", "Gs Mensual", "Cambio / USD Anual"])
plan = [
    (340000, "Bruta (11,3%)", 3205, 19550000, "6100 / 38.459"),
    (None, "Impuesto anual", 2764, None, "2.764"),
    (None, "Gastos anuales", 1200, None, "1.200"),
    (None, "Renta Neta", None, None, "34.495"),
    (None, "Renta Anual Neta", "10,15%", None, None),
    ("340.000 | 100% | 34.495", "34.495 | X | 340.000", None, None, "(regla de tres de la fuente)"),
]
for row in plan:
    r += 1
    for j, v in enumerate(row, 1):
        put(D, f"{get_column_letter(j)}{r}", v, INPUT)
D.cell(row=r + 1, column=1, value="Nota: en la planilla, 'Impuesto anual' y 'Gastos anuales' aparecen en la columna 'USD Mensual' pero sus valores son anuales (se repiten en 'USD Anual').").font = NOTE

# -------------------------------------------------------- Alquileres_Unidad
A = sheet("Alquileres_Unidad", "Alquileres por unidad — transcripción estructurada (estado: TRANSCRITO, no verificado)",
          [6, 12, 13, 22, 13, 24, 8, 16, 14, 26, 50])
legend(A, 2)
header(A, 4, ["N°", "Ref. provisoria", "Piso", "Texto original (col. C)", "Tipología", "Concepto", "Moneda",
              "Alquiler mensual (Gs)", "Equivalente USD (TC planilla)", "Estado de verificación", "Observación"])
units = [
    ("P3-01", "Tercer piso", "2 dorm.", "2 dormitorios", "Departamento", 1500000, ""),
    ("P3-02", "Tercer piso", "2 dorm.", "2 dormitorios", "Departamento", 1500000, ""),
    ("P3-03", "Tercer piso", "1 dorm.", "1 dormitorio", "Departamento", 1200000, ""),
    ("P3-04", "Tercer piso", "1 dorm.", "1 dormitorio", "Departamento", 1100000, ""),
    ("P2-01", "Segundo piso", "2 dorm.", "2 dormitorios", "Departamento", 1600000, ""),
    ("P2-02", "Segundo piso", "2 dorm.", "2 dormitorios", "Departamento", 1500000, ""),
    ("P2-03", "Segundo piso", "2 dorm.", "2 dormitorios", "Departamento", 1500000, ""),
    ("P2-04", "Segundo piso", "2 dorm.", "2 dormitorios", "Departamento", 1500000, ""),
    ("P2-05", "Segundo piso", "1 dorm.", "1 dormitorio", "Departamento", 1250000, ""),
    ("P1-01", "Primer piso", "1 dorm.", "1 dormitorio", "Departamento", 1300000, ""),
    ("P1-02", "Primer piso", "3 dorm.", "3 dormitorios", "Departamento", 1600000, ""),
    ("PB-01", "Planta baja", "1 dorm.", "1 dormitorio", "Departamento", 1200000, ""),
    ("PB-02", "Planta baja", "1 dorm.", "1 dormitorio", "Departamento", 900000, ""),
    ("PB-03", "Planta baja", "Cochera", "No aplica", "Cochera", 700000,
     "Concepto no incluido en el mix comercial informado (13 dptos + 1 local). Confirmar qué es y si está incluido en el precio."),
    ("PB-04", "Planta baja", "Cochera y dpto", "A confirmar", "Mixto — a confirmar", 1200000,
     "NO interpretado como local comercial ni como unidad adicional. Confirmar a qué unidad corresponde y si agrupa o duplica ingresos."),
]
first = 5
for i, (ref, piso, txt, tip, conc, gs, obs) in enumerate(units):
    rr = first + i
    put(A, f"A{rr}", i + 1)
    put(A, f"B{rr}", ref)
    put(A, f"C{rr}", piso)
    put(A, f"D{rr}", txt, INPUT)
    put(A, f"E{rr}", tip, PEND if tip == "A confirmar" else CALC)
    put(A, f"F{rr}", conc, PEND if "confirmar" in conc else CALC)
    put(A, f"G{rr}", "PYG")
    put(A, f"H{rr}", gs, INPUT, GS)
    put(A, f"I{rr}", f"=H{rr}/{PR['tc']}", LINK, USD2)
    put(A, f"J{rr}", "Transcrito — sin contrato ni comprobante de cobro", PEND)
    put(A, f"K{rr}", obs or None, CALC).alignment = Alignment(wrap_text=True)
last = first + len(units) - 1
tot = last + 1
put(A, f"G{tot}", "TOTAL", BOLD)
put(A, f"H{tot}", f"=SUM(H{first}:H{last})", BOLD, GS)
put(A, f"I{tot}", f"=SUM(I{first}:I{last})", BOLD, USD2)
A.cell(row=tot + 2, column=1, value="La 'Ref. provisoria' es un identificador de trabajo de Meridiano según el orden de la captura; "
       "no corresponde a la numeración real de las unidades (no informada).").font = NOTE
A.cell(row=tot + 3, column=1, value="Ningún dato de inquilinos (nombres, contactos) se registra en este archivo: la fuente solo dice 'Inquilino'.").font = NOTE
A.freeze_panes = "A5"
RNG = lambda col: f"Alquileres_Unidad!${col}${first}:${col}${last}"

# ------------------------------------------------------------- Conciliacion
C = sheet("Conciliacion", "Conciliación — composición informada vs. detalle de alquileres", [46, 16, 16, 16, 14, 50])
legend(C, 2)
header(C, 4, ["Concepto", "Mix comercial informado", "Filas en el detalle", "Diferencia", "Resultado", "Observación"])
rows = [
    ("Departamentos 1 dormitorio", PR["mix1"], f'=COUNTIFS({RNG("E")},"1 dormitorio")', ""),
    ("Departamentos 2 dormitorios", PR["mix2"], f'=COUNTIFS({RNG("E")},"2 dormitorios")', ""),
    ("Departamentos 3 dormitorios", PR["mix3"], f'=COUNTIFS({RNG("E")},"3 dormitorios")', ""),
    ("Local comercial", PR["mixloc"], f'=COUNTIFS({RNG("F")},"Local comercial")', "El local comercial no aparece identificado expresamente en el detalle."),
    ("Cochera (sola)", 0, f'=COUNTIFS({RNG("F")},"Cochera")', "Concepto no mencionado en la composición comercial."),
    ("'Cochera y dpto' (concepto mixto)", 0, f'=COUNTIFS({RNG("F")},"Mixto — a confirmar")', "Si incluye un departamento, el total de dptos sería 14, no 13."),
]
for i, (lab, mix, cnt, obs) in enumerate(rows, 5):
    put(C, f"A{i}", lab, BOLD)
    put(C, f"B{i}", f"={mix}" if isinstance(mix, str) else mix, LINK if isinstance(mix, str) else INPUT, "0")
    put(C, f"C{i}", cnt, CALC, "0")
    put(C, f"D{i}", f"=C{i}-B{i}", CALC, "0;-0;0")
    put(C, f"E{i}", f'=IF(D{i}=0,"Coincide","DIFERENCIA")', CALC)
    put(C, f"F{i}", obs or None, CALC).alignment = Alignment(wrap_text=True)
put(C, "A11", "Total departamentos (filas 'Departamento')", BOLD)
put(C, "B11", "=SUM(B5:B7)", CALC, "0")
put(C, "C11", f'=COUNTIFS({RNG("F")},"Departamento")', CALC, "0")
put(C, "D11", "=C11-B11", CALC, "0;-0;0")
put(C, "E11", '=IF(D11=0,"Coincide","DIFERENCIA")', CALC)
put(C, "F11", "Las 13 filas con tipología coinciden con el mix 6 + 6 + 1.", CALC)

put(C, "A13", "Control de suma del detalle", TITLE)
header(C, 14, ["Control", "Valor", "", "", "Resultado", "Observación"])
put(C, "A15", "Suma recalculada de las 15 filas (Gs)", BOLD)
put(C, "B15", f"=Alquileres_Unidad!H{tot}", LINK, GS)
put(C, "A16", "Total indicado en la fuente (Gs)", BOLD)
put(C, "B16", f"={PR['total_ind']}", LINK, GS)
put(C, "A17", "Diferencia (Gs)", BOLD)
put(C, "B17", "=B15-B16", CALC, GS)
put(C, "E17", '=IF(B17=0,"Suma correcta","DIFERENCIA")', CALC)
put(C, "F17", "Verifica la aritmética, no la composición ni el cobro efectivo.", CALC)

put(C, "A19", "Subtotal por piso (Gs)", TITLE)
header(C, 20, ["Piso", "Filas", "Alquiler mensual (Gs)", "% del total", "", "Observación"])
for i, piso in enumerate(["Tercer piso", "Segundo piso", "Primer piso", "Planta baja"], 21):
    put(C, f"A{i}", piso, BOLD)
    put(C, f"B{i}", f'=COUNTIFS({RNG("C")},A{i})', CALC, "0")
    put(C, f"C{i}", f'=SUMIFS({RNG("H")},{RNG("C")},A{i})', CALC, GS)
    put(C, f"D{i}", f"=C{i}/$C$25", CALC, "0.0%")
put(C, "A25", "Total", BOLD)
put(C, "B25", "=SUM(B21:B24)", BOLD, "0")
put(C, "C25", "=SUM(C21:C24)", BOLD, GS)
put(C, "D25", "=SUM(D21:D24)", BOLD, "0.0%")

put(C, "A27", "Estado de la conciliación", TITLE)
put(C, "A28", '=IF(AND(B17=0,D8=0),"CONCILIADA","PRELIMINAR — composición no conciliada (ver preguntas abajo)")', BOLD)
qs = [
    "1. ¿A qué unidad corresponde la fila 'Cochera y dpto' (Gs 1.200.000)? ¿Es un departamento adicional, el local comercial u otro concepto?",
    "2. ¿Dónde está incluido el alquiler del local comercial?",
    "3. ¿Algún concepto agrupa varias unidades o duplica ingresos?",
    "4. ¿Cuál es la fecha de vigencia de los alquileres y del tipo de cambio de Gs 6.100?",
    "5. Contratos vigentes, ocupación real y cobro efectivo de los últimos 12 meses (extractos o recibos).",
    "6. ¿La 'Cochera' (Gs 700.000) se alquila a un tercero ajeno al edificio? ¿Está incluida en la venta?",
]
for i, q in enumerate(qs, 30):
    put(C, f"A{i}", q, PEND)
    C.merge_cells(f"A{i}:F{i}")
put(C, "A29", "Preguntas abiertas", BOLD)

# ---------------------------------------------------------- Ingresos_Gastos
G = sheet("Ingresos_Gastos", "Ingresos y egresos — informados vs. pendientes", [46, 18, 18, 20, 56])
legend(G, 2)
header(G, 4, ["Concepto", "Mensual", "Anual (USD)", "Estado", "Fuente / observación"])
put(G, "A5", "Ingreso mensual informado (Gs)", BOLD)
put(G, "B5", f"=Alquileres_Unidad!H{tot}", LINK, GS)
put(G, "D5", "Recibido (transcrito)", CALC)
put(G, "E5", "Suma de la tabla; composición no conciliada (ver Conciliacion).", CALC)
put(G, "A6", "Ingreso mensual USD (TC planilla)", BOLD)
put(G, "B6", f"=B5/{PR['tc']}", CALC, USD2)
put(G, "D6", "Calculado", CALC)
put(G, "E6", "Gs mensual / tipo de cambio de la planilla (6.100).", CALC)
put(G, "A7", "Ingreso bruto anual informado (USD)", BOLD)
put(G, "C7", "=B6*12", CALC, USD2)
put(G, "D7", "Calculado", CALC)
put(G, "E7", "Supone 12 meses de cobro completo: sin vacancia ni morosidad (no verificado).", CALC)

put(G, "A9", "Egresos informados en la planilla", TITLE)
put(G, "A10", "Impuesto anual", BOLD)
put(G, "C10", f"={PR['imp']}", LINK, USD)
put(G, "D10", "Recibido — alcance a confirmar", PEND)
put(G, "E10", "No se informa qué impuesto(s) cubre (IVA, IRP, inmobiliario u otro). Ver Rentabilidad: equivale al 7,19% del bruto.", CALC)
put(G, "A11", "Gastos anuales", BOLD)
put(G, "C11", f"={PR['gastos']}", LINK, USD)
put(G, "D11", "Recibido — alcance a confirmar", PEND)
put(G, "E11", "No se informa qué conceptos cubre.", CALC)
put(G, "A12", "Total egresos informados", BOLD)
put(G, "C12", "=SUM(C10:C11)", BOLD, USD)

put(G, "A14", "Egresos NO informados (pendientes — no son cero)", TITLE)
pend = ["Mantenimiento y reparaciones", "Administración del edificio / gestión de alquileres", "Seguros",
        "Vacancia (meses sin inquilino)", "Morosidad / incobrables", "Reserva para reposiciones (CAPEX)",
        "Servicios a cargo del propietario (áreas comunes, agua, luz)", "Impuesto inmobiliario (si no está incluido arriba)"]
for i, p in enumerate(pend, 15):
    put(G, f"A{i}", p, BOLD)
    put(G, f"C{i}", None, PEND, USD, PEND_FILL)
    put(G, f"D{i}", "PENDIENTE", PEND)
    put(G, f"E{i}", "Celda vacía a propósito: completar con dato documentado.", NOTE)
pe = 15 + len(pend) - 1
put(G, f"A{pe+1}", "Cantidad de egresos pendientes de dato", BOLD)
put(G, f"C{pe+1}", f"=COUNTBLANK(C15:C{pe})", CALC, "0")

put(G, f"A{pe+3}", "Resultado neto según gastos informados (USD/año)", BOLD)
put(G, f"C{pe+3}", "=C7-C12", BOLD, USD2)
put(G, f"E{pe+3}", "Solo descuenta los dos egresos de la planilla. NO es una renta neta definitiva.", PEND)
put(G, f"A{pe+4}", "Resultado neto incluyendo egresos pendientes cargados (USD/año)", BOLD)
put(G, f"C{pe+4}", f'=IF(C{pe+1}>0,"Incompleto: faltan "&C{pe+1}&" egresos",C7-C12-SUM(C15:C{pe}))', CALC, USD2)
NETO = f"Ingresos_Gastos!$C${pe+3}"

# -------------------------------------------------------------- Rentabilidad
Rr = sheet("Rentabilidad", "Rentabilidad — recálculo con precisión completa", [52, 18, 18, 16, 50])
legend(Rr, 2)
header(Rr, 4, ["Indicador", "Recalculado", "Planilla recibida", "Diferencia", "Base de cálculo"])
lines = [
    ("Ingreso mensual (USD)", "=Ingresos_Gastos!B6", PR["usd_mes_pl"], USD2, "Gs 19.550.000 / 6.100"),
    ("Ingreso bruto anual (USD)", "=Ingresos_Gastos!C7", PR["bruto_pl"], USD2, "Ingreso mensual USD × 12"),
    ("Resultado neto según gastos informados (USD)", f"={NETO}", PR["neto_pl"], USD2, "Bruto − impuesto (2.764) − gastos (1.200)"),
    ("Rentabilidad bruta sobre precio", f"=B6/{PR['precio']}", PR["yb_pl"], "0.00%", "Bruto anual / precio de venta (USD 340.000)"),
    ("Rentabilidad neta según gastos informados, sobre precio", f"=B7/{PR['precio']}", PR["yn_pl"], "0.00%", "Resultado neto / precio de venta. Sin gastos de adquisición en el denominador."),
]
for i, (lab, f, pl, fmt, base) in enumerate(lines, 5):
    put(Rr, f"A{i}", lab, BOLD)
    put(Rr, f"B{i}", f, CALC, fmt)
    put(Rr, f"C{i}", f"={pl}", LINK, fmt)
    put(Rr, f"D{i}", f"=B{i}-C{i}", CALC, "0.00%" if "%" in fmt else USD2)
    put(Rr, f"E{i}", base, CALC).alignment = Alignment(wrap_text=True)
Rr["D8"].comment = Comment("La planilla muestra 'Bruta (11,3%)' con un decimal; el recálculo da 11,31%. Diferencia solo de redondeo.", "Meridiano Capital")

put(Rr, "A11", "Observaciones de la auditoría", TITLE)
put(Rr, "A12", "Impuesto anual / ingreso bruto anual", BOLD)
put(Rr, "B12", f"={PR['imp']}/B6", CALC, "0.00%")
put(Rr, "E12", "No coincide con 5% ni 10% del bruto: la composición del impuesto debe confirmarse.", CALC)
put(Rr, "A13", "Ingreso anual de la descripción comercial (USD)", BOLD)
put(Rr, "B13", f"={PR['desc']}", LINK, USD)
put(Rr, "C13", "=B7", CALC, USD2)
put(Rr, "D13", "=B13-C13", CALC, USD2)
put(Rr, "E13", "Los USD 34.500 de la descripción son el resultado NETO redondeado, no el ingreso bruto (USD 38.459).", PEND)
put(Rr, "A14", "Relación 'bruta' de la descripción (10,15%)", BOLD)
put(Rr, "B14", "=B9", CALC, "0.00%")
put(Rr, "E14", "El 10,15% es rentabilidad NETA según gastos informados, no bruta. La bruta es 11,31%.", PEND)
put(Rr, "A15", "Precio implícito por departamento (USD, referencia)", BOLD)
put(Rr, "B15", f"={PR['precio']}/Conciliacion!C11", CALC, USD)
put(Rr, "E15", "Precio total / 13 departamentos. Solo referencia aritmética: no es tasación ni valor por unidad.", CALC)
put(Rr, "A16", "Múltiplo precio / ingreso bruto anual (veces)", BOLD)
put(Rr, "B16", f"={PR['precio']}/B6", CALC, "0.00")
put(Rr, "E16", "Años de ingreso bruto informado equivalentes al precio, sin egresos ni vacancia.", CALC)

put(Rr, "A17", "Escenario de tipo de cambio", TITLE)
header(Rr, 18, ["Escenario", "TC (Gs/USD)", "Bruto anual (USD)", "Rent. bruta", "Rent. neta según gastos informados / Fuente"])
put(Rr, "A19", "Original — planilla recibida", BOLD)
put(Rr, "B19", f"={PR['tc']}", LINK, "#,##0")
put(Rr, "C19", f"=Ingresos_Gastos!B5*12/B19", CALC, USD2)
put(Rr, "D19", f"=C19/{PR['precio']}", CALC, "0.00%")
put(Rr, "E19", f"=(C19-Ingresos_Gastos!C12)/{PR['precio']}", CALC, "0.00%")
put(Rr, "A20", "Actualizado — TC autorizado (pendiente)", BOLD)
put(Rr, "B20", f'=IF(ISBLANK({PR["tc_alt"]}),"PENDIENTE",{PR["tc_alt"]})', LINK, "#,##0")
put(Rr, "C20", f'=IF(ISNUMBER(B20),Ingresos_Gastos!B5*12/B20,"PENDIENTE")', CALC, USD2)
put(Rr, "D20", f'=IF(ISNUMBER(C20),C20/{PR["precio"]},"PENDIENTE")', CALC, "0.00%")
put(Rr, "E20", f'=IF(ISNUMBER(C20),"Fuente: "&{PR["tc_alt_src"]},"Cargar TC y fuente en Parametros!B20:B21")', CALC)
Rr.cell(row=21, column=1, value="Nota: impuesto y gastos se mantienen en USD fijos en ambos escenarios (así figuran en la planilla). "
        "Las cifras son indicadores sobre el precio de venta, no retorno sobre inversión total ni rentabilidad garantizada.").font = NOTE

wb._sheets = [wb["Datos_Originales"], wb["Alquileres_Unidad"], wb["Conciliacion"], wb["Ingresos_Gastos"], wb["Rentabilidad"], wb["Parametros"]]
for ws in wb.worksheets:
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print(OUT)
