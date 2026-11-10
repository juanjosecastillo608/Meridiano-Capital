"""Excel editable del Edificio Catedral: entradas separadas de fórmulas.

Hojas: Parametros (tipo de cambio y precio), Datos_PDF (lo que dice la fuente), Hipotesis_Locales,
Escenarios (fórmulas), Escenarios_Mercado, Sensibilidad_TC, Sensibilidad_Canon, Comp_Residenciales, Comp_Comerciales,
Auditoria_Fuente y Gastos_Pendientes. Los comparables salen del estudio estándar CDE-CATEDRAL-2026-11-07 (D-100).
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
rows = [('Precio de venta publicado (USD)', M['precio_usd'], USD, True, 'Descripción comercial y PDF fuente'),
        ('Tipo de cambio (Gs por USD)', M['tc'], TCF, True, f"{tc['fuente']} del {tc['fecha'][8:]}/{tc['fecha'][5:7]}/{tc['fecha'][:4]}; verificado el {tc['verificado_el']}. Editable."),
        ('Fecha del tipo de cambio', f"{tc['fecha'][8:]}/{tc['fecha'][5:7]}/{tc['fecha'][:4]}", None, True, 'Actualizar junto con el valor'),
        ('Fuente del tipo de cambio', 'https://www.bcp.gov.py/webapps/web/cotizacion/monedas', None, True, 'Planilla de cotización referencial del BCP (obtenida vía buscador; el sitio no fue accesible desde el entorno de trabajo)'),
        ('Meses de ocupación por año', 12, '0', True, 'Hipótesis: ocupación de 12 meses'),
        ('Precio publicado en guaraníes', '=B4*B5', GS, False, 'Fórmula: precio USD × tipo de cambio'),
        ('Precio de venta rápida sugerido (USD)', M['precios']['rap']['P'], USD, True, 'Valor sugerido por Meridiano Capital (founder, 07/11/2026); sujeto a aceptación del propietario'),
        ('Precio de venta rápida en guaraníes', '=B10*B5', GS, False, 'Fórmula: precio de venta rápida × tipo de cambio'),
        ('Descuento de la venta rápida', '=1-B10/B4', PCT, False, 'Frente al precio publicado')]
for i, (a, v, f, inp, src) in enumerate(rows, start=4):
    label(p, f'A{i}', a); put(p, f'B{i}', v, f, inp); note(p, f'C{i}', src)
note(p, 'A14', 'Celdas en azul sobre crema: entradas editables. El resto del libro se recalcula con ellas.')

# --- Datos_PDF
d = sheet('Datos_PDF', 'Datos del inmueble (PDF "Edificio Departamentos Catedral" y founder)', [46, 22, 66])
header(d, 3, ['Dato', 'Valor', 'Estado'])
drows = [('Terreno: frente (m)', M['frente'], '0.00', 'Confirmado (PDF)'), ('Terreno: fondo (m)', M['fondo'], '0.00', 'Confirmado (PDF)'),
         ('Superficie del terreno informada (m²)', M['terreno'], '#,##0', 'Confirmado (PDF)'),
         ('Superficie del terreno calculada (m²)', '=B4*B5', '#,##0.00', 'Calculado: 17,50 × 40 = 700, coincide'),
         ('Superficie construida informada (m²)', M['construido'], '#,##0', 'Informado; pendiente de planos'),
         ('Niveles', 4, '0', 'Confirmado (PDF)'), ('Departamentos', M['dptos'], '0', 'Confirmado (PDF)'),
         ('Salones comerciales', M['locales'], '0', 'Confirmado (PDF)'), ('Plazas de estacionamiento cubiertas', M['cocheras'], '0', 'Confirmado (PDF)'),
         ('Canon mensual por departamento (Gs)', M['canon_dpto'], GS, 'Informado en el PDF; 12 unidades alquiladas. Fecha del relevamiento no informada (PDF del 27/08/2026 según metadatos)'),
         ('Departamentos alquilados', M['dptos'], '0', 'Informado en el PDF; contratos pendientes de revisión'),
         ('Superficie por departamento (m²)', M['sup_dpto'], '#,##0', 'Founder, 07/11/2026'),
         ('Salones alquilados', M['salones_alq'], '0', 'Founder, 07/11/2026; canon del alquilado no informado'),
         ('Salones desocupados', M['salones_vac'], '0', 'Founder, 07/11/2026'),
         ('Canon por m² del departamento (Gs)', '=B13/B15', GS, 'Calculado: canon ÷ 150 m²')]
for i, (a, v, f, st) in enumerate(drows, start=4):
    label(d, f'A{i}', a); put(d, f'B{i}', v, f, inp=not str(v).startswith('=')); note(d, f'C{i}', st)

# --- Hipotesis_Locales
h = sheet('Hipotesis_Locales', 'Hipótesis de renta de los salones comerciales', [46, 22, 66])
header(h, 3, ['Hipótesis', 'Valor', 'Condición'])
for i, (a, v, f, inp, st) in enumerate([('Salones alquilados', '=Datos_PDF!B16', '0', False, 'Founder, 07/11/2026'),
                                        ('Canon mensual por salón (Gs)', M['canon_local'], GS, True, 'Hipótesis: mediana del estudio de mercado; el canon del salón alquilado no fue informado'),
                                        ('Salones desocupados', '=Datos_PDF!B17', '0', False, 'Founder, 07/11/2026: renta potencial si se alquilan')], start=4):
    label(h, f'A{i}', a); put(h, f'B{i}', v, f, inp); note(h, f'C{i}', st)

# --- Escenarios (renta actual y potencial, a los dos precios)
e = sheet('Escenarios', 'Renta bruta actual y potencial, a los dos precios', [42, 20, 20, 20, 22, 20])
header(e, 3, ['Concepto', 'Departamentos (informado)', 'Salón alquilado', 'Actual estimado', 'Salones desocupados', 'Potencial'])
lab = ['Unidades', 'Canon mensual por unidad (Gs)', 'Renta mensual (Gs)', 'Renta anual (Gs)', 'Renta anual (USD)',
       'Bruta s/ precio publicado', 'Recuperación simple, publicado (años)', 'Bruta s/ venta rápida', 'Recuperación simple, venta rápida (años)']
f = {
    'B': ['=Datos_PDF!B14', '=Datos_PDF!B13', '=B4*B5', '=B6*Parametros!$B$8', '=B7/Parametros!$B$5', '=B7/Parametros!$B$9', '=Parametros!$B$9/B7', '=B7/Parametros!$B$11', '=Parametros!$B$11/B7'],
    'C': ['=Hipotesis_Locales!B4', '=Hipotesis_Locales!B5', '=C4*C5', '=C6*Parametros!$B$8', '=C7/Parametros!$B$5', '=C7/Parametros!$B$9', '', '=C7/Parametros!$B$11', ''],
    'D': ['=B4+C4', '', '=B6+C6', '=B7+C7', '=D7/Parametros!$B$5', '=D7/Parametros!$B$9', '=Parametros!$B$9/D7', '=D7/Parametros!$B$11', '=Parametros!$B$11/D7'],
    'E': ['=Hipotesis_Locales!B6', '=Hipotesis_Locales!B5', '=E4*E5', '=E6*Parametros!$B$8', '=E7/Parametros!$B$5', '=E7/Parametros!$B$9', '', '=E7/Parametros!$B$11', ''],
    'F': ['=D4+E4', '', '=D6+E6', '=D7+E7', '=F7/Parametros!$B$5', '=F7/Parametros!$B$9', '=Parametros!$B$9/F7', '=F7/Parametros!$B$11', '=Parametros!$B$11/F7'],
}
fmts = ['0', GS, GS, GS, USD, PCT, '0.00', PCT, '0.00']
for r, (l, fm) in enumerate(zip(lab, fmts), start=4):
    label(e, f'A{r}', l, bold=r >= 9)
    for col in 'BCDEF':
        put(e, f'{col}{r}', f[col][r - 4] or None, fm, bold=r >= 9 and col in 'DF')
note(e, 'A14', 'Actual = 12 departamentos + 1 salón alquilado (canon no informado: hipótesis). Potencial = además, los 2 salones desocupados alquilados. '
     'En las columnas de salones, la rentabilidad es su aporte. Bruta = renta anual en Gs ÷ precio en Gs; recuperación simple = precio ÷ renta anual, no es TIR. Sin gastos, impuestos, vacancia ni gastos de adquisición.')
e.row_dimensions[14].height = 48; e.merge_cells('A14:F14')

# --- Sensibilidad_TC (serie BCP, dos precios)
sv = sheet('Sensibilidad_TC', 'Sensibilidad de la rentabilidad bruta al tipo de cambio, a los dos precios', [30, 14, 16, 16, 16, 16, 16, 16])
header(sv, 3, ['Tipo de cambio (fecha)', 'Gs por USD', 'Actual · publicado', 'Actual · venta rápida', 'Residencial · publicado', 'Residencial · venta rápida', 'Potencial · publicado', 'Potencial · venta rápida'])
for i, s_ in enumerate(M['sens'], start=4):
    label(sv, f'A{i}', f"{s_['n']} (vigente = Parametros!B5)" if s_['vigente'] else f"{s_['n']} (BCP)")
    put(sv, f'B{i}', '=Parametros!B5' if s_['vigente'] else s_['tc'], TCF, inp=not s_['vigente'])
    for col, ref, pr in (('C', 'D', '$B$4'), ('D', 'D', '$B$10'), ('E', 'B', '$B$4'), ('F', 'B', '$B$10'), ('G', 'F', '$B$4'), ('H', 'F', '$B$10')):
        put(sv, f'{col}{i}', f'=Escenarios!${ref}$7/(Parametros!{pr}*B{i})', PCT)

# --- Escenarios_Mercado (estudio del 07/11/2026, actualizado con la ocupación real de los salones)
em = sheet('Escenarios_Mercado', 'Escenarios de mercado (brutos), a los dos precios', [36, 16, 8, 16, 9, 18, 20, 14, 12, 14, 12, 54])
header(em, 3, ['Escenario', 'Canon dpto (Gs)', 'Dptos', 'Canon salón (Gs)', 'Salones', 'Renta mensual (Gs)', 'Renta anual (Gs)', 'Bruta · publicado', 'Recup. · publ.', 'Bruta · venta rápida', 'Recup. · v. rápida', 'Condición'])
cond = {'Residencial informado': 'Dato informado por el vendedor; contratos y cobros sin revisar',
        'Actual estimado': '12 dptos + 1 salón alquilado (canon no informado: mediana del estudio)',
        'Potencial (salones vacantes alquilados)': 'Requiere alquilar los 2 salones desocupados; 12 meses de ocupación de las 15 unidades',
        'Inferior': 'Dptos en la parte baja de la muestra y el salón alquilado a Gs 2,5 M (piso del rango); salones vacíos sin renta',
        'Superior': 'Requiere renovar contratos con ajuste, buen estado y buen frente de los 3 salones: confianza baja'}
for i, e_ in enumerate(M['escenarios'], start=4):
    label(em, f'A{i}', e_['n'], bold=e_['n'] == 'Actual estimado')
    put(em, f'B{i}', e_['canon_dpto'], GS, inp=True); put(em, f'C{i}', e_['dptos'], '0', inp=True)
    put(em, f'D{i}', e_['canon_salon'], GS, inp=True); put(em, f'E{i}', e_['salones'], '0', inp=True)
    put(em, f'F{i}', f'=B{i}*C{i}+D{i}*E{i}', GS); put(em, f'G{i}', f'=F{i}*Parametros!$B$8', GS)
    put(em, f'H{i}', f'=G{i}/Parametros!$B$9', PCT); put(em, f'I{i}', f'=Parametros!$B$9/G{i}', '0.0')
    put(em, f'J{i}', f'=G{i}/Parametros!$B$11', PCT); put(em, f'K{i}', f'=Parametros!$B$11/G{i}', '0.0')
    note(em, f'L{i}', cond[e_['n']])

# --- Sensibilidad_Canon (cánones y ocupación, TC vigente, dos precios)
sc = sheet('Sensibilidad_Canon', 'Sensibilidad a cánones y ocupación (TC vigente), a los dos precios', [52, 16, 8, 16, 9, 18, 14, 12, 14, 12])
header(sc, 3, ['Variable (todo lo demás constante)', 'Canon dpto (Gs)', 'Dptos', 'Canon salón (Gs)', 'Salones', 'Renta anual (Gs)', 'Bruta · publicado', 'Recup. · publ.', 'Bruta · venta rápida', 'Recup. · v. rápida'])
filas = [('Canon dpto Gs 2.800.000 (con el salón alquilado)', 2_800_000, 12, 3_000_000, 1), ('Canon dpto Gs 3.000.000 (actual)', 3_000_000, 12, 3_000_000, 1),
         ('Canon dpto Gs 3.500.000 (con el salón alquilado)', 3_500_000, 12, 3_000_000, 1), ('Salón alquilado a Gs 2.200.000', 3_000_000, 12, 2_200_000, 1),
         ('Salón alquilado a Gs 4.500.000', 3_000_000, 12, 4_500_000, 1), ('Se alquila 1 salón desocupado más (2 de 3)', 3_000_000, 12, 3_000_000, 2),
         ('Se alquilan los 2 desocupados (3 de 3)', 3_000_000, 12, 3_000_000, 3), ('Ocupación 10 de 12 dptos (con el salón alquilado)', 3_000_000, 10, 3_000_000, 1),
         ('Ocupación 11 de 12 dptos (con el salón alquilado)', 3_000_000, 11, 3_000_000, 1)]
for i, (l, cd, nd, cs, ns) in enumerate(filas, start=4):
    label(sc, f'A{i}', l)
    for col, v, f_ in (('B', cd, GS), ('C', nd, '0'), ('D', cs, GS), ('E', ns, '0')):
        put(sc, f'{col}{i}', v, f_, inp=True)
    put(sc, f'F{i}', f'=(B{i}*C{i}+D{i}*E{i})*Parametros!$B$8', GS)
    put(sc, f'G{i}', f'=F{i}/Parametros!$B$9', PCT); put(sc, f'H{i}', f'=Parametros!$B$9/F{i}', '0.0')
    put(sc, f'I{i}', f'=F{i}/Parametros!$B$11', PCT); put(sc, f'J{i}', f'=Parametros!$B$11/F{i}', '0.0')
note(sc, 'A14', 'Los cánones distintos del informado son supuestos apoyados en la muestra de comparables; la ocupación variable es ilustrativa.')


def hoja_comp(nombre, titulo, uso):
    ws = sheet(nombre, titulo, [7, 54, 26, 8, 10, 9, 14, 20, 20, 12, 70])
    header(ws, 3, ['Cód.', 'Aviso', 'Zona', 'Dorm.', 'Sup. m²', 'Moneda', 'Publicado', 'En Gs (TC vigente)', 'Comparabilidad', 'Estadística', 'Fuente (enlace)'])
    cs = [c for c in M['mercado']['comparables'] if c['uso'] == uso]
    usados = []
    for i, c in enumerate(cs, start=4):
        label(ws, f'A{i}', c['codigo']); label(ws, f'B{i}', c['descripcion']); label(ws, f'C{i}', c['zona'])
        put(ws, f'D{i}', c.get('dormitorios'), '0'); put(ws, f'E{i}', c.get('superficie_m2'), '#,##0')
        put(ws, f'F{i}', 'USD' if c['moneda'] == 'USD' else 'Gs'); put(ws, f'G{i}', c['precio'], '#,##0', inp=True)
        put(ws, f'H{i}', f'=IF(F{i}="USD",G{i}*Parametros!$B$5,G{i})', GS)
        label(ws, f'I{i}', c['comparabilidad']); label(ws, f'J{i}', 'Sí' if c['usar_en_estadisticas'] else 'No')
        ws[f'K{i}'] = c['url']; ws[f'K{i}'].hyperlink = c['url']; ws[f'K{i}'].font = Font(name='Poppins', color='8B3323', underline='single')
        if c['usar_en_estadisticas']:
            usados.append(f'H{i}')
    r = 4 + len(cs) + 1
    label(ws, f'B{r}', 'Mediana de los avisos en estadística', bold=True); put(ws, f'H{r}', f'=MEDIAN({",".join(usados)})', GS, bold=True)
    label(ws, f'B{r+1}', 'Mínimo', bold=True); put(ws, f'H{r+1}', f'=MIN({",".join(usados)})', GS)
    label(ws, f'B{r+2}', 'Máximo', bold=True); put(ws, f'H{r+2}', f'=MAX({",".join(usados)})', GS)
    note(ws, f'B{r+4}', f"Avisos publicados consultados el {M['mercado']['fecha_consulta'][8:]}/{M['mercado']['fecha_consulta'][5:7]}/{M['mercado']['fecha_consulta'][:4]}; disponibilidad no confirmada; no son contratos. "
         "Base completa y estándar: knowledge-base/investment/market-intelligence/estudios/CDE-CATEDRAL-2026-11-07/.")
    return ws


hoja_comp('Comp_Residenciales', 'Comparables residenciales (estudio CDE-CATEDRAL-2026-11-07)', 'residencial')
hoja_comp('Comp_Comerciales', 'Comparables comerciales (estudio CDE-CATEDRAL-2026-11-07)', 'comercial')

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
         ('Tipo de cambio implícito en ese porcentaje', '=Escenarios!F7/(Parametros!B4*B10)', TCF, False, 'Coincide con el cierre interbancario BCP del 16/10/2026 (Gs 5.770,91): cálculo inverso, no prueba de cotización'),
         ('Bruta potencial (con los 3 salones) al tipo de cambio vigente, precio publicado', '=Escenarios!F9', PCT, False, 'La cifra que se presenta al inversor')]
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
label(g, 'A13', 'Renta neta anual estimada (renta actual)', bold=True); put(g, 'B13', '=IF(ISNUMBER(B12),Escenarios!D7-B12,"Pendiente")', GS, bold=True)
label(g, 'A14', 'Rentabilidad neta estimada · precio publicado', bold=True); put(g, 'B14', '=IF(ISNUMBER(B13),B13/Parametros!B9,"Pendiente")', PCT, bold=True)
label(g, 'A15', 'Rentabilidad neta estimada · venta rápida', bold=True); put(g, 'B15', '=IF(ISNUMBER(B13),B13/Parametros!B11,"Pendiente")', PCT, bold=True)
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
