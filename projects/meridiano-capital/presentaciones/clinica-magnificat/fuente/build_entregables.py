"""Entregables Excel de la Clínica Magnificat (09/11/2026).

1. entregables/Planilla_Desglose_Gastos_Clinica_Magnificat.xlsx: para que la complete el propietario
   (desglose de los Gs 10.450.000 mensuales, impuesto inmobiliario, consultorios y documentos). Sin análisis de Meridiano.
2. entregables/Modelo_Inversion_Clinica_Magnificat.xlsx: modelo con fórmulas vivas por etapa (D-101), conciliado con model.py.
"""
import os, sys, json, shutil, subprocess, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import CFG, contacto_linea  # D-096 / D-097
from rentabilidad import IRE, IVA_G, DEP, PARTE_EDIF  # D-101
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

B = os.path.dirname(os.path.abspath(__file__))
OUTD = os.path.join(B, '..', 'entregables')
M = json.load(open(os.path.join(B, 'model.json')))
PET, TIE, CRE = '14313A', '8B3323', 'F3EDE3'
F_IN = Font(name='Calibri', color='1F4FBF', bold=True); FILL_IN = PatternFill('solid', fgColor=CRE)
F_H = Font(name='Calibri', color='FFFFFF', bold=True); FILL_H = PatternFill('solid', fgColor=PET)
F_T = Font(name='Calibri', color=PET, bold=True, size=14); F_B = Font(name='Calibri', bold=True)
F_NOTE = Font(name='Calibri', italic=True, color='6B6154', size=9); FILL_TOT = PatternFill('solid', fgColor='EFE6D5')
GS, USD, PCT = '#,##0', '"USD" #,##0', '0.00%'

def title(ws, t, sub):
    ws['A1'] = t; ws['A1'].font = F_T; ws['A2'] = sub; ws['A2'].font = F_NOTE
def hdr(ws, r, cols):
    for i, c in enumerate(cols, 1):
        x = ws.cell(r, i, c); x.font = F_H; x.fill = FILL_H; x.alignment = Alignment(wrap_text=True, vertical='center')
def widths(ws, w):
    for i, v in enumerate(w, 1): ws.column_dimensions[get_column_letter(i)].width = v
def inp(c, fmt=None):
    c.font = F_IN; c.fill = FILL_IN
    if fmt: c.number_format = fmt
def recalc(path):
    if shutil.which('soffice'):
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run(['soffice', f'-env:UserInstallation=file://{tmp}/perfil', '--headless', '--convert-to', 'xlsx', '--outdir', tmp, path], capture_output=True, timeout=180)
            rec = os.path.join(tmp, os.path.basename(path))
            if os.path.exists(rec): shutil.copyfile(rec, path)

os.makedirs(OUTD, exist_ok=True)

# =========================================================== 1. Planilla para el propietario
wb = Workbook(); ws = wb.active; ws.title = 'Instrucciones'
title(ws, 'CLÍNICA MAGNIFICAT – DESGLOSE DE GASTOS E INFORMACIÓN DEL EDIFICIO', 'Planilla para completar por el propietario · Meridiano Capital')
txt = ['Le pedimos completar las celdas en AZUL sobre fondo crema. El resto se calcula solo.',
       '1. Hoja "Gastos mensuales": el detalle de los Gs 10.450.000 que se informan como gastos de administración. Indique el monto de cada rubro y si tiene factura con IVA.',
       '2. Hoja "Impuesto inmobiliario": los datos de la boleta (valor fiscal y tasas incluidas) que suman los Gs 45.000.000 anuales informados.',
       '3. Hoja "Consultorios": superficie, vencimiento del contrato y estado de pago de cada consultorio (sin nombres de los profesionales).',
       '4. Hoja "Documentos": marque lo que puede compartir.',
       'Con esta información podemos mostrar al comprador el resultado real del edificio y detectar ahorros posibles.',
       f'Consultas: Lic. Juan José Castillo · Meridiano Capital · {contacto_linea()}']
for i, t in enumerate(txt, 4): ws.cell(i, 1, t).alignment = Alignment(wrap_text=True)
c = ws.cell(13, 1, 'Celda para completar'); inp(c)
widths(ws, [130])

g = wb.create_sheet('Gastos mensuales')
title(g, 'GASTOS MENSUALES DEL EDIFICIO (montos en guaraníes)', 'Detalle de los Gs 10.450.000 mensuales informados')
hdr(g, 3, ['Rubro', 'Monto mensual (Gs)', '¿Factura con IVA?', 'Frecuencia de pago', 'Proveedor (empresa)', '¿Se puede medir por consultorio?', 'Comprobante adjunto', 'Observaciones'])
rubros = ['Secretaria: sueldo', 'Secretaria: aporte patronal IPS', 'Secretaria: aguinaldo, vacaciones y reemplazos (mensualizado)', 'Personal de limpieza',
          'Insumos de limpieza e higiene', 'Electricidad de áreas comunes', 'Electricidad de los consultorios (aire acondicionado y equipos)', 'Agua (ESSAP u otro)',
          'Internet y telefonía', 'Seguridad, alarma y cámaras', 'Mantenimiento edilicio y reparaciones', 'Mantenimiento de aires acondicionados',
          'Residuos patológicos y sanitarios', 'Fumigación y control de plagas', 'Seguro del edificio', 'Contador y administración', 'Sistema de turnos o software',
          'Jardinería y exteriores', 'Gastos bancarios y comisiones', 'Otros (detallar)']
dv1 = DataValidation(type='list', formula1='"Sí,No,No sé"', allow_blank=True); dv2 = DataValidation(type='list', formula1='"Mensual,Bimestral,Trimestral,Anual,Eventual"', allow_blank=True)
dv3 = DataValidation(type='list', formula1='"Sí,No"', allow_blank=True); [g.add_data_validation(d) for d in (dv1, dv2, dv3)]
for i, rb in enumerate(rubros, 4):
    g.cell(i, 1, rb)
    for j in range(2, 9): inp(g.cell(i, j), GS if j == 2 else None)
    dv1.add(g.cell(i, 3)); dv2.add(g.cell(i, 4)); dv3.add(g.cell(i, 6)); dv3.add(g.cell(i, 7))
r = 4 + len(rubros)
g.cell(r, 1, 'TOTAL DETALLADO').font = F_B; c = g.cell(r, 2, f'=SUM(B4:B{r - 1})'); c.number_format = GS; c.font = F_B; c.fill = FILL_TOT
g.cell(r + 1, 1, 'Gastos de administración informados'); c = g.cell(r + 1, 2, 10_450_000); c.number_format = GS
g.cell(r + 2, 1, 'Diferencia sin explicar').font = F_B; c = g.cell(r + 2, 2, f'=B{r + 1}-B{r}'); c.number_format = GS; c.font = F_B; c.fill = FILL_TOT
g.cell(r + 3, 1, 'Total con factura e IVA'); c = g.cell(r + 3, 2, f'=SUMIF(C4:C{r - 1},"Sí",B4:B{r - 1})'); c.number_format = GS
g.cell(r + 5, 1, 'Si un gasto se paga cada varios meses, ingrese el equivalente mensual (por ejemplo, un seguro anual dividido por 12).').font = F_NOTE
widths(g, [52, 18, 14, 16, 26, 18, 14, 40]); g.freeze_panes = 'B4'

t = wb.create_sheet('Impuesto inmobiliario')
title(t, 'IMPUESTO INMOBILIARIO Y TASAS', 'Datos de la boleta municipal')
hdr(t, 3, ['Dato', 'Valor', 'Observaciones'])
for i, d in enumerate(['Cuenta corriente catastral', 'Año de la boleta', 'Valor fiscal del inmueble (Gs)', 'Impuesto inmobiliario anual (Gs)', 'Tasas incluidas en la boleta (recolección, alumbrado, otras) (Gs)',
                       'Total anual pagado (Gs)', '¿Se paga en cuotas? ¿Cuántas?', '¿Hay deudas o planes de pago pendientes?'], 4):
    t.cell(i, 1, d); inp(t.cell(i, 2), GS if '(Gs)' in d else None); inp(t.cell(i, 3))
t.cell(13, 1, 'Monto informado'); c = t.cell(13, 2, 45_000_000); c.number_format = GS
t.cell(14, 1, 'Diferencia con lo informado').font = F_B; c = t.cell(14, 2, '=IF(ISNUMBER(B9),B13-B9,"")'); c.number_format = GS
widths(t, [62, 20, 50])

k = wb.create_sheet('Consultorios')
title(k, 'CONSULTORIOS', 'Uno por fila · sin nombres de los profesionales')
hdr(k, 3, ['N.º', 'Planta', 'Superficie (m²)', 'Especialidad', 'Instalación para odontología', 'Alquiler mensual (Gs)', '¿Incluye IVA?', '¿Incluye luz del consultorio?', 'Vencimiento del contrato', 'Depósito en garantía (Gs)', 'Al día con los pagos', 'Antigüedad del inquilino (años)'])
for i in range(11):
    rr = 4 + i; k.cell(rr, 1, i + 1)
    for j in range(2, 13): inp(k.cell(rr, j), GS if j in (6, 10) else None)
    k.cell(rr, 6).value = 2_500_000
k.cell(16, 1, 'Total'); c = k.cell(16, 6, '=SUM(F4:F14)'); c.number_format = GS; c.font = F_B
k.cell(18, 1, 'Departamento del 2.º piso: superficie (m²)'); inp(k.cell(18, 3))
k.cell(19, 1, 'Departamento: ambientes y baños'); inp(k.cell(19, 3))
widths(k, [6, 10, 12, 18, 14, 16, 10, 14, 16, 16, 12, 14])

d = wb.create_sheet('Documentos')
dv4 = DataValidation(type='list', formula1='"Sí,No"', allow_blank=True); d.add_data_validation(dv4)
title(d, 'DOCUMENTOS SOLICITADOS', 'Marque "Sí" en lo que puede compartir')
hdr(d, 3, ['Documento', '¿Lo comparte?', 'Observaciones'])
for i, x in enumerate(['Comprobantes de los gastos de los últimos 3 meses', 'Boleta del impuesto inmobiliario del último año', 'Contratos de alquiler de los 11 consultorios',
                       'Planilla de cobros y atrasos de los últimos 12 meses', 'Facturas de alquiler emitidas (régimen de IVA)', 'Planos aprobados y habilitación municipal',
                       'Habilitación del Ministerio de Salud (si corresponde)', 'Cotizaciones del ascensor actualizadas', 'Plano y superficie del departamento del 2.º piso'], 4):
    d.cell(i, 1, x); inp(d.cell(i, 2)); inp(d.cell(i, 3)); dv4.add(d.cell(i, 2))
widths(d, [60, 14, 50])
P1 = os.path.join(OUTD, 'Planilla_Desglose_Gastos_Clinica_Magnificat.xlsx')
wb.save(P1); recalc(P1)

# =========================================================== 2. Modelo de inversión
wb = Workbook(); le = wb.active; le.title = 'Léame'
title(le, 'MODELO DE INVERSIÓN – CLÍNICA MAGNIFICAT (ASUNCIÓN)', 'Meridiano Capital · base de cálculo D-101 · cifras de referencia, no garantizadas')
for i, t_ in enumerate(['Cambie solo las celdas en AZUL (hoja Supuestos). Todo lo demás se recalcula.',
                        'Etapas: Hoy (E0), Etapa 1 (0-12 meses: renovación +10%, auditoría de gastos, mejoras y ascensor), Etapa 2 (12-24 meses: segundo ajuste), Etapa 3 (desde el mes 25: reconversión del 2.º piso).',
                        'D-101: el alquiler incluye IVA (10%); se paga el IVA contenido en lo cobrado menos el crédito fiscal de los gastos facturados. El IRE (10%) se aplica sobre el resultado menos la depreciación.',
                        'La administración informada (Gs 10.450.000) no tiene desglose: reemplácela con el total de la planilla que complete el propietario.',
                        f'Tipo de cambio inicial: BCP, {CFG["tipo_cambio"]["fecha"]}. Actualícelo antes de usar.'], 4):
    le.cell(i, 1, t_)
widths(le, [150])
sp = wb.create_sheet('Supuestos')
title(sp, 'SUPUESTOS', 'Azul = editable')
hdr(sp, 3, ['Supuesto', 'Valor', 'Unidad', 'Fuente'])
S = {}
rows = [('tc', 'Tipo de cambio', round(M['TC'], 2), 'Gs/USD', 'BCP'), ('p1', 'Precio de venta', M['PRICES']['pedido'], 'USD', 'Founder'), ('p2', 'Precio de venta rápida', M['PRICES']['rapida'], 'USD', 'Founder'),
        ('n', 'Consultorios actuales', M['N'], 'u.', 'Dato'), ('r0', 'Alquiler hoy (IVA y expensas incluidos)', M['RENT0'], 'Gs/mes', 'Dato'), ('r1', 'Alquiler etapa 1 (+10%)', M['RENT1'], 'Gs/mes', 'Supuesto'),
        ('r2', 'Alquiler etapa 2 y 3', M['RENT2'], 'Gs/mes', 'Supuesto; techo de mercado Gs 3,85 M con IVA'), ('a0', 'Administración hoy', M['ADMIN0'], 'Gs/mes', 'Dato, sin desglose'),
        ('a1', 'Administración tras la auditoría (−15%)', M['ADMIN1'], 'Gs/mes', 'Objetivo'), ('imp', 'Impuesto inmobiliario', M['IMP_INMO'], 'Gs/año', 'Informado; verificar'),
        ('iva', 'IVA del alquiler', 0.10, '%', 'Comercial (D-045)'), ('vac', 'Vacancia', M['VAC'], '%', 'Supuesto'), ('mant', 'Reserva de mantenimiento mayor', M['MANT'], '% del bruto', 'Supuesto'),
        ('fact', 'Parte de la administración con factura e IVA', M['FACTURABLE'], '%', 'Supuesto (la nómina no genera crédito)'), ('ivag', 'IVA de gastos (crédito)', IVA_G, '%', 'D-101'),
        ('ire', 'IRE', IRE, '%', 'D-101'), ('dept', 'Depreciación anual', DEP, '%', 'D-101'), ('pe', 'Parte de edificio en el precio', PARTE_EDIF, '%', 'D-101'),
        ('asc', 'Ascensor 3 paradas con obra', M['ASC_GS'], 'Gs', 'Cotización vencida +10% + obra'), ('mej', 'Mejoras de áreas comunes', M['MEJ_GS'], 'Gs', 'Supuesto'),
        ('ascm', 'Mantenimiento del ascensor', M['ASC_MANT'], 'Gs/mes', 'Supuesto, desde el año 2'), ('nn', 'Consultorios nuevos en el 2.º piso', M['N_NEW_BASE'], 'u.', 'Ilustrativo; definir con plano'),
        ('cn', 'Inversión por consultorio nuevo', M['CAPEX_NEW_USD'], 'USD', 'Supuesto'), ('an', 'Más administración con consultorios nuevos', 0.10, '%', 'Supuesto'),
        ('g', 'Suba anual de alquileres desde el año 4', 0.03, '%', 'Escenario base'), ('val', 'Valorización anual', 0.035, '%', 'Escenario base'), ('ivv', 'IVA de la venta futura', 0.015, '%', 'D-082')]
for i, (key, lab, v, u, f) in enumerate(rows, 4):
    sp.cell(i, 1, lab); c = sp.cell(i, 2, v); inp(c, '0.0%' if u.startswith('%') else ('#,##0.00' if key == 'tc' else GS)); sp.cell(i, 3, u); sp.cell(i, 4, f).font = F_NOTE
    S[key] = f'Supuestos!$B${i}'
widths(sp, [52, 18, 12, 50])

et = wb.create_sheet('Etapas')
title(et, 'RESULTADO ANUAL ESTABILIZADO POR ETAPA (USD)', 'Una tabla por precio de compra')
L = ['Consultorios', 'Alquiler por consultorio (Gs/mes)', 'Facturación mensual (Gs)', 'Facturación anual', 'Vacancia', 'IVA débito (contenido en lo cobrado)', 'Administración',
     'Impuesto inmobiliario', 'Reserva de mantenimiento', 'IVA crédito (gastos facturados)', 'IVA neto', 'Resultado antes de IRE', 'Inversión en obras acumulada',
     'Inversión total', 'Depreciación (base del IRE)', 'IRE', 'Neto anual', 'Rentabilidad bruta', 'Rentabilidad neta']
POS = {}
def bloque(r0, pkey, label):
    et.cell(r0, 1, label).font = Font(bold=True, color=TIE)
    hdr(et, r0 + 1, ['Concepto', 'Hoy', 'Etapa 1', 'Etapa 2', 'Etapa 3'])
    rr = {l: r0 + 2 + i for i, l in enumerate(L)}
    for l, r_ in rr.items(): et.cell(r_, 1, l)
    P = S[pkey]
    obra1 = f'({S["asc"]}+{S["mej"]})/{S["tc"]}'
    spec = {'B': (S['n'], S['r0'], S['a0'], '0', '0', '0'), 'C': (S['n'], S['r1'], S['a1'], '0', obra1, '0'),
            'D': (S['n'], S['r2'], S['a1'], S['ascm'], obra1, '0'), 'E': (f'{S["n"]}+{S["nn"]}', S['r2'], S['a1'], S['ascm'], f'{obra1}+{S["nn"]}*{S["cn"]}', S['nn'])}
    for col, (n_, r_, a_, am, ob, nn) in spec.items():
        R = lambda l: f'{col}{rr[l]}'
        f = {
            'Consultorios': f'={n_}', 'Alquiler por consultorio (Gs/mes)': f'={r_}', 'Facturación mensual (Gs)': f'={R("Consultorios")}*{R("Alquiler por consultorio (Gs/mes)")}',
            'Facturación anual': f'={R("Facturación mensual (Gs)")}*12/{S["tc"]}', 'Vacancia': f'={R("Facturación anual")}*{S["vac"]}',
            'IVA débito (contenido en lo cobrado)': f'=({R("Facturación anual")}-{R("Vacancia")})*{S["iva"]}/(1+{S["iva"]})',
            'Administración': f'=({a_}*(1+{S["an"]}*IF({nn}>0,1,0))+{am})*12/{S["tc"]}', 'Impuesto inmobiliario': f'={S["imp"]}/{S["tc"]}',
            'Reserva de mantenimiento': f'={R("Facturación anual")}*{S["mant"]}',
            'IVA crédito (gastos facturados)': f'=({R("Reserva de mantenimiento")}+{R("Administración")}*{S["fact"]})*{S["ivag"]}/(1+{S["ivag"]})',
            'IVA neto': f'=MAX(0,{R("IVA débito (contenido en lo cobrado)")}-{R("IVA crédito (gastos facturados)")})',
            'Resultado antes de IRE': f'={R("Facturación anual")}-{R("Vacancia")}-{R("IVA neto")}-{R("Administración")}-{R("Impuesto inmobiliario")}-{R("Reserva de mantenimiento")}',
            'Inversión en obras acumulada': f'={ob}', 'Inversión total': f'={P}+{R("Inversión en obras acumulada")}',
            'Depreciación (base del IRE)': f'={S["dept"]}*({R("Inversión en obras acumulada")}+{S["pe"]}*{P})',
            'IRE': f'={S["ire"]}*MAX(0,{R("Resultado antes de IRE")}-{R("Depreciación (base del IRE)")})', 'Neto anual': f'={R("Resultado antes de IRE")}-{R("IRE")}',
            'Rentabilidad bruta': f'={R("Facturación anual")}/{R("Inversión total")}', 'Rentabilidad neta': f'={R("Neto anual")}/{R("Inversión total")}'}
        for l, fx in f.items():
            c = et.cell(rr[l], ord(col) - 64, fx)
            c.number_format = PCT if 'Rentabilidad' in l else (GS if l in ('Alquiler por consultorio (Gs/mes)', 'Facturación mensual (Gs)', 'Consultorios') else USD)
            if l in ('Neto anual', 'Rentabilidad neta', 'Rentabilidad bruta'): c.font = F_B; c.fill = FILL_TOT
    POS[pkey] = rr
    return r0 + 3 + len(L)
nxt = bloque(4, 'p1', 'COMPRA A PRECIO DE VENTA')
bloque(nxt + 1, 'p2', 'COMPRA A PRECIO DE VENTA RÁPIDA')
widths(et, [44, 16, 16, 16, 16]); et.freeze_panes = 'B4'

fl = wb.create_sheet('Flujo y TIR')
title(fl, 'FLUJO A 5 AÑOS Y TIR (ESCENARIO BASE)', 'Año 1: mitad hoy y mitad etapa 1 · año 2: etapa 2 · año 3: mitad etapa 2 y mitad etapa 3 (obra del 2.º piso) · años 4-5: etapa 3 con suba · venta en el año 5')
r = 4
for pkey, lab in (('p1', 'Precio de venta'), ('p2', 'Venta rápida')):
    rr = POS[pkey]; E_ = lambda col, l: f"Etapas!{col}{rr[l]}"
    fl.cell(r, 1, lab).font = Font(bold=True, color=TIE); hdr(fl, r + 1, ['Concepto', 'Año 0', 'Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'])
    netr, ivar, ahr, cfr = r + 2, r + 3, r + 4, r + 5
    fl.cell(netr, 1, 'Neto de la operación'); fl.cell(ivar, 1, 'IVA neto del año'); fl.cell(ahr, 1, 'Ahorro por crédito fiscal de las obras'); fl.cell(cfr, 1, 'Flujo de caja')
    nets = [f"=0.5*{E_('B','Neto anual')}+0.5*{E_('C','Neto anual')}", f"={E_('D','Neto anual')}", f"=0.5*{E_('D','Neto anual')}+0.5*{E_('E','Neto anual')}",
            f"={E_('E','Neto anual')}*(1+{S['g']})", f"={E_('E','Neto anual')}*(1+{S['g']})^2"]
    ivas = [f"=0.5*{E_('B','IVA neto')}+0.5*{E_('C','IVA neto')}", f"={E_('D','IVA neto')}", f"={E_('E','IVA neto')}", f"={E_('E','IVA neto')}", f"={E_('E','IVA neto')}"]
    pool = f"{E_('E','Inversión en obras acumulada')}*{S['ivag']}/(1+{S['ivag']})"
    for i in range(5):
        col = get_column_letter(3 + i)
        fl.cell(netr, 3 + i, nets[i]).number_format = USD; fl.cell(ivar, 3 + i, ivas[i]).number_format = USD
        used = '0' if i == 0 else f'SUM($C{ahr}:{get_column_letter(2 + i)}{ahr})'
        fl.cell(ahr, 3 + i, f'=MIN({col}{ivar},{pool}-{used})').number_format = USD
        extra = f"-{S['nn']}*{S['cn']}" if i == 1 else ''
        venta = f"+{E_('E','Inversión total')}*(1+{S['val']})^5*(1-{S['ivv']})" if i == 4 else ''
        fl.cell(cfr, 3 + i, f'={col}{netr}+{col}{ahr}{extra}{venta}').number_format = USD
    fl.cell(cfr, 2, f"=-{S[pkey]}-{E_('C','Inversión en obras acumulada')}").number_format = USD
    fl.cell(cfr + 1, 1, 'TIR a 5 años').font = F_B; c = fl.cell(cfr + 1, 2, f'=IRR(B{cfr}:G{cfr})'); c.number_format = '0.0%'; c.font = F_B; c.fill = FILL_TOT
    r = cfr + 3
widths(fl, [40, 16, 16, 16, 16, 16, 16])
P2 = os.path.join(OUTD, 'Modelo_Inversion_Clinica_Magnificat.xlsx')
wb.calculation.fullCalcOnLoad = True; wb.save(P2); recalc(P2)
print('XLSX:', P1); print('XLSX:', P2)
import runpy; runpy.run_path(os.path.join(B, 'build_web.py'))
