"""Excel editable del Edificio Catedral: entradas separadas de fórmulas.

Hojas: Parametros (tipo de cambio y precio), Datos_PDF (lo que dice la fuente), Hipotesis_Locales,
Escenarios (fórmulas), Sensibilidad_TC, Auditoria_Fuente y Gastos_Pendientes.
Las celdas de entrada van en azul sobre crema; todo lo demás son fórmulas.
"""
import os, json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
OUT = os.path.join(B, '..', 'entregables', 'Edificio_Catedral_Rentabilidad.xlsx')

PET, CREMA, LINEA, TIERRA = '14313A', 'F3EDE3', 'DAD2C0', '8B3323'
H1 = Font(name='Poppins', bold=True, color='FFFFFF', size=11)
TIT = Font(name='Poppins', bold=True, color=PET, size=14)
INP = Font(name='Poppins', color='1F4E9E', bold=True)
TXT = Font(name='Poppins', color=PET)
NOTE = Font(name='Poppins', color='6B6154', italic=True, size=9)
FILL_H = PatternFill('solid', fgColor=PET)
FILL_IN = PatternFill('solid', fgColor=CREMA)
BORDER = Border(*(Side(style='thin', color=LINEA),) * 4)
GS = '#,##0'
USD = '"USD" #,##0'
PCT = '0.00%'
TCF = '#,##0.00'

wb = Workbook()


def sheet(name, title, widths):
    ws = wb.create_sheet(name)
    ws['A1'] = title; ws['A1'].font = TIT
    for i, w in enumerate(widths):
        ws.column_dimensions[chr(65 + i)].width = w
    ws.sheet_view.showGridLines = False
    return ws


def header(ws, row, cols):
    for i, c in enumerate(cols):
        cell = ws.cell(row=row, column=i + 1, value=c)
        cell.font, cell.fill, cell.border = H1, FILL_H, BORDER
        cell.alignment = Alignment(vertical='center', wrap_text=True)


def put(ws, ref, value, fmt=None, inp=False, bold=False):
    c = ws[ref]; c.value = value
    c.font = INP if inp else Font(name='Poppins', color=PET, bold=bold)
    if inp: c.fill = FILL_IN
    if fmt: c.number_format = fmt
    c.border = BORDER
    return c


def label(ws, ref, text, bold=False):
    c = ws[ref]; c.value = text; c.font = Font(name='Poppins', color=PET, bold=bold); c.border = BORDER
    c.alignment = Alignment(wrap_text=True, vertical='center')


def note(ws, ref, text):
    c = ws[ref]; c.value = text; c.font = NOTE; c.alignment = Alignment(wrap_text=True, vertical='top')


wb.remove(wb.active)

# --- Parametros
p = sheet('Parametros', 'Edificio Catedral · Parámetros editables', [44, 22, 70])
header(p, 3, ['Parámetro', 'Valor', 'Fuente / condición'])
tc = M['tc_cfg']
rows = [('Precio de venta (USD)', M['precio_usd'], USD, True, 'Descripción comercial y PDF fuente'),
        ('Tipo de cambio (Gs por USD)', M['tc'], TCF, True, f"{tc['fuente']} del {tc['fecha'][8:]}/{tc['fecha'][5:7]}/{tc['fecha'][:4]}; verificado el {tc['verificado_el']}. Editable."),
        ('Fecha del tipo de cambio', f"{tc['fecha'][8:]}/{tc['fecha'][5:7]}/{tc['fecha'][:4]}", None, True, 'Actualizar junto con el valor'),
        ('Fuente del tipo de cambio', 'https://www.bcp.gov.py/webapps/web/cotizacion/monedas', None, True, 'Planilla de cotización referencial del BCP (obtenida vía buscador; el sitio no fue accesible desde el entorno de trabajo)'),
        ('Meses de ocupación por año', 12, '0', True, 'Hipótesis: ocupación de 12 meses'),
        ('Precio en guaraníes', '=B4*B5', GS, False, 'Fórmula: precio USD × tipo de cambio')]
for i, (a, v, f, inp, src) in enumerate(rows, start=4):
    label(p, f'A{i}', a); put(p, f'B{i}', v, f, inp); note(p, f'C{i}', src)
note(p, 'A11', 'Celdas en azul sobre crema: entradas editables. El resto del libro se recalcula con ellas.')

# --- Datos_PDF
d = sheet('Datos_PDF', 'Datos del documento recibido (PDF "Edificio Departamentos Catedral")', [46, 22, 66])
header(d, 3, ['Dato', 'Valor', 'Estado'])
drows = [('Terreno: frente (m)', M['frente'], '0.00', 'Confirmado (PDF)'), ('Terreno: fondo (m)', M['fondo'], '0.00', 'Confirmado (PDF)'),
         ('Superficie del terreno informada (m²)', M['terreno'], '#,##0', 'Confirmado (PDF)'),
         ('Superficie del terreno calculada (m²)', '=B4*B5', '#,##0.00', 'Calculado: 17,50 × 40 = 700, coincide'),
         ('Superficie construida informada (m²)', M['construido'], '#,##0', 'Informado; pendiente de planos'),
         ('Niveles', 4, '0', 'Confirmado (PDF)'), ('Departamentos', M['dptos'], '0', 'Confirmado (PDF)'),
         ('Salones comerciales', M['locales'], '0', 'Confirmado (PDF)'), ('Plazas de estacionamiento cubiertas', M['cocheras'], '0', 'Confirmado (PDF)'),
         ('Canon mensual por departamento (Gs)', M['canon_dpto'], GS, 'Informado en el PDF; 12 unidades ocupadas. Fecha del relevamiento no informada (PDF del 27/08/2026 según metadatos)'),
         ('Departamentos ocupados', M['dptos'], '0', 'Informado en el PDF; contratos pendientes de revisión')]
for i, (a, v, f, st) in enumerate(drows, start=4):
    label(d, f'A{i}', a); put(d, f'B{i}', v, f, inp=not str(v).startswith('=')); note(d, f'C{i}', st)

# --- Hipotesis_Locales
h = sheet('Hipotesis_Locales', 'Hipótesis de renta de los salones comerciales', [46, 22, 66])
header(h, 3, ['Hipótesis', 'Valor', 'Condición'])
for i, (a, v, f, st) in enumerate([('Salones alquilados (supuesto)', M['locales'], '0', 'Sujeto a confirmación'),
                                   ('Canon mensual por salón (Gs)', M['canon_local'], GS, 'Instrucción comercial; sujeto a confirmación')], start=4):
    label(h, f'A{i}', a); put(h, f'B{i}', v, f, inp=True); note(h, f'C{i}', st)

# --- Escenarios
e = sheet('Escenarios', 'Escenarios de renta bruta', [40, 22, 22, 22])
header(e, 3, ['Concepto', 'Residencial informado', 'Comercial estimado', 'Total proyectado'])
lab = ['Unidades', 'Canon mensual por unidad (Gs)', 'Renta mensual (Gs)', 'Renta anual (Gs)', 'Renta anual (USD)',
       'Rentabilidad bruta anual', 'Recuperación simple bruta (años)']
f = {
    'B': ['=Datos_PDF!B14', '=Datos_PDF!B13', '=B4*B5', '=B6*Parametros!$B$8', '=B7/Parametros!$B$5', '=B7/Parametros!$B$9', '=Parametros!$B$9/B7'],
    'C': ['=Hipotesis_Locales!B4', '=Hipotesis_Locales!B5', '=C4*C5', '=C6*Parametros!$B$8', '=C7/Parametros!$B$5', '=C7/Parametros!$B$9', ''],
    'D': ['=B4+C4', '', '=B6+C6', '=B7+C7', '=D7/Parametros!$B$5', '=D7/Parametros!$B$9', '=Parametros!$B$9/D7'],
}
fmts = ['0', GS, GS, GS, USD, PCT, '0.00']
for r, (l, fm) in enumerate(zip(lab, fmts), start=4):
    label(e, f'A{r}', l, bold=r >= 9)
    for col in 'BCD':
        put(e, f'{col}{r}', f[col][r - 4] or None, fm, bold=r >= 9)
note(e, 'A12', 'En la columna comercial, la rentabilidad es su aporte a la bruta total. Rentabilidad bruta = renta anual en Gs ÷ precio en Gs. Recuperación simple bruta = precio ÷ renta anual: no es TIR. '
     'Sin gastos, impuestos, vacancia ni gastos de adquisición. Columna "Comercial estimado": hipótesis sujeta a confirmación.')
e.row_dimensions[12].height = 45; e.merge_cells('A12:D12')

# --- Sensibilidad_TC
sv = sheet('Sensibilidad_TC', 'Sensibilidad de la rentabilidad bruta al tipo de cambio', [34, 18, 22, 22])
header(sv, 3, ['Escenario de tipo de cambio', 'Gs por USD', 'Bruta residencial', 'Bruta total'])
for i, s in enumerate(M['sens'], start=4):
    label(sv, f'A{i}', 'Vigente (= Parametros!B5)' if s['vigente'] else 'Ilustrativo')
    put(sv, f'B{i}', '=Parametros!B5' if s['vigente'] else s['tc'], TCF, inp=not s['vigente'])
    put(sv, f'C{i}', f'=Escenarios!$B$7/(Parametros!$B$4*B{i})', PCT)
    put(sv, f'D{i}', f'=Escenarios!$D$7/(Parametros!$B$4*B{i})', PCT)

# --- Auditoria_Fuente
a = sheet('Auditoria_Fuente', 'Auditoría de las rentabilidades publicadas por la fuente', [52, 20, 74])
header(a, 3, ['Cifra / control', 'Valor', 'Lectura'])
arows = [('"Rentabilidad comprobada" publicada en el PDF', M['fuente']['rent_comprobada'], PCT, True, 'Sin base explícita en el texto; NO CONCILIADA como "comprobada"'),
         ('Tipo de cambio usado en la planilla del PDF', M['fuente']['tc_pdf'], TCF, True, 'Gs 6.000 sin fecha ni fuente'),
         ('Impuesto anual informado en la planilla del PDF (Gs)', M['fuente']['impuesto_anual'], GS, True, 'Único gasto informado; expensas Gs 0'),
         ('Renta bruta del PDF (recalculada)', '=Escenarios!B7/(Parametros!B4*B5)', PCT, False, 'Reproduce el 7,50% de la planilla con TC Gs 6.000'),
         ('Renta neta del PDF (recalculada)', '=(Escenarios!B7-B6)/(Parametros!B4*B5)', PCT, False, 'Reproduce el 7,19%: solo descuenta el impuesto anual; no es una neta completa'),
         ('Misma "neta" con el tipo de cambio vigente', '=(Escenarios!B7-B6)/Parametros!B9', PCT, False, 'Con TC de Parametros!B5'),
         ('Rentabilidad bruta de la descripción comercial', M['fuente']['bruta_descripcion'], PCT, True, 'Total proyectado con los locales; tipo de cambio no informado'),
         ('Tipo de cambio implícito en ese porcentaje', '=Escenarios!D7/(Parametros!B4*B10)', TCF, False, 'Coincide con el cierre interbancario BCP del 16/10/2026 (Gs 5.770,91): cálculo inverso, no prueba de cotización'),
         ('Bruta total con el tipo de cambio vigente', '=Escenarios!D9', PCT, False, 'La cifra que se presenta al inversor')]
for i, (l, v, fm, inp, txt) in enumerate(arows, start=4):
    label(a, f'A{i}', l); put(a, f'B{i}', v, fm, inp); note(a, f'C{i}', txt)

# --- Gastos_Pendientes
g = sheet('Gastos_Pendientes', 'Gastos pendientes: la renta neta no se calcula hasta completarlos', [44, 22, 60])
header(g, 3, ['Concepto (anual)', 'Monto anual (Gs)', 'Condición'])
items = ['Impuestos y tasas (inmobiliario, IVA de alquileres, impuesto a la renta)', 'Mantenimiento y reparaciones (incl. pozo artesiano)',
         'Administración', 'Seguros', 'Servicios a cargo del propietario', 'Vacancia y morosidad', 'Gastos de adquisición (prorrateados)',
         'Adecuaciones o inversiones adicionales']
for i, it in enumerate(items, start=4):
    label(g, f'A{i}', it); put(g, f'B{i}', None, GS, inp=True); note(g, f'C{i}', 'Pendiente: no informado')
dv = DataValidation(type='decimal', operator='greaterThanOrEqual', formula1='0', allow_blank=True)
g.add_data_validation(dv); dv.add('B4:B11')
label(g, 'A12', 'Total de gastos anuales', bold=True); put(g, 'B12', '=IF(COUNTBLANK(B4:B11)>0,"Pendiente",SUM(B4:B11))', GS, bold=True)
label(g, 'A13', 'Renta neta anual estimada (total proyectado)', bold=True); put(g, 'B13', '=IF(ISNUMBER(B12),Escenarios!D7-B12,"Pendiente")', GS, bold=True)
label(g, 'A14', 'Rentabilidad neta estimada', bold=True); put(g, 'B14', '=IF(ISNUMBER(B13),B13/Parametros!B9,"Pendiente")', PCT, bold=True)
note(g, 'C12', 'Se calcula solo cuando los ocho conceptos tienen monto (cero incluido, si corresponde).')

for ws in wb.worksheets:
    ws.freeze_panes = 'A4'
wb.active = 0
os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.calculation.fullCalcOnLoad = True
wb.save(OUT)
# Recalcular con LibreOffice para guardar los valores en caché (vista previa en teléfono y visores sin motor de cálculo).
import shutil, subprocess, tempfile
if shutil.which('soffice'):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['soffice', '--headless', '--convert-to', 'xlsx', '--outdir', tmp, OUT], capture_output=True, timeout=180)
        rec = os.path.join(tmp, os.path.basename(OUT))
        if os.path.exists(rec):
            shutil.copyfile(rec, OUT)
print('XLSX:', os.path.abspath(OUT))
