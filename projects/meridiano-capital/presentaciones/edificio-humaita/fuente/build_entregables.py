"""Modelo de inversión del Edificio Humaitá en Excel (fórmulas vivas), a partir de la planilla del propietario.

Genera entregables/Modelo_Inversion_Edificio_Humaita.xlsx. Las celdas azules sobre crema son entradas; todo lo demás
se recalcula. Se recalcula con LibreOffice para guardar los valores en caché.
"""
import os, sys, shutil, subprocess, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC, CFG  # D-096 / D-097
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

B = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(B, '..', 'entregables', 'Modelo_Inversion_Edificio_Humaita.xlsx')
PET, TIE, CRE, LIN = '14313A', '8B3323', 'F3EDE3', 'DAD2C0'
F_IN = Font(name='Calibri', color='1F4FBF', bold=True)
FILL_IN = PatternFill('solid', fgColor=CRE)
F_H = Font(name='Calibri', color='FFFFFF', bold=True)
FILL_H = PatternFill('solid', fgColor=PET)
F_T = Font(name='Calibri', color=PET, bold=True, size=14)
F_B = Font(name='Calibri', bold=True)
F_NOTE = Font(name='Calibri', italic=True, color='6B6154', size=9)
FILL_TOT = PatternFill('solid', fgColor='EFE6D5')
THIN = Border(bottom=Side(style='thin', color=LIN))
USD, GS, PCT, NUM = '"USD" #,##0', '"Gs" #,##0', '0.00%', '#,##0.00'

wb = Workbook()

def title(ws, t, sub):
    ws['A1'] = t; ws['A1'].font = F_T
    ws['A2'] = sub; ws['A2'].font = F_NOTE
def hdr(ws, r, cols):
    for i, c in enumerate(cols, 1):
        x = ws.cell(r, i, c); x.font = F_H; x.fill = FILL_H; x.alignment = Alignment(wrap_text=True, vertical='center')
def widths(ws, w):
    for i, v in enumerate(w, 1): ws.column_dimensions[get_column_letter(i)].width = v

# ------------------------------------------------------------------ Léame
ws = wb.active; ws.title = 'Léame'
title(ws, 'MODELO DE INVERSIÓN – EDIFICIO HUMAITÁ (CENTRO HISTÓRICO, ASUNCIÓN)', 'Meridiano Capital · basado en la planilla del propietario “Inversión y Remodelación Edificio 2P y 20 Habitaciones”')
lines = [
    'Cómo se usa',
    '1. Cambie solo las celdas en AZUL sobre fondo crema (hoja Supuestos e Inversión). Todo lo demás se recalcula.',
    '2. La hoja Resultados compara las tres opciones: A departamentos y salones, B 20 habitaciones mensuales, C hostel de 20 habitaciones.',
    '3. La rentabilidad bruta es ingreso bruto anual ÷ (precio + obra). La neta descuenta IVA, vacancia, gastos operativos e IRE.',
    '4. La hoja Observaciones explica qué se corrigió respecto de la planilla original.',
    '',
    f'Tipo de cambio inicial: Gs {TC:,.2f} por USD, {CFG["tipo_cambio"]["fuente"]} del {CFG["tipo_cambio"]["fecha"]}. Actualícelo en Supuestos antes de usar el modelo.'.replace(',', 'X').replace('.', ',').replace('X', '.'),
    'Cifras de referencia, no garantizadas. Los alquileres son precios pedidos del mercado (estudio ASU-CENTRO-HUMAITA-2026-11-08), no contratos.',
    'Lo fiscal (IVA, IRE) es una estimación: la base real la define el contador.']
for i, t in enumerate(lines, 4):
    ws.cell(i, 1, t).font = F_B if i == 4 else Font(name='Calibri')
ws.cell(15, 1, 'Leyenda:').font = F_B
c = ws.cell(16, 1, 'Entrada editable'); c.font = F_IN; c.fill = FILL_IN
ws.cell(17, 1, 'Fórmula (no editar)')
widths(ws, [120])

# ------------------------------------------------------------------ Supuestos
sp = wb.create_sheet('Supuestos')
title(sp, 'SUPUESTOS (entradas editables en azul)', 'Cada supuesto indica su fuente: aviso, planilla del propietario, tabla de unidades, estudio de mercado o criterio de Meridiano')
hdr(sp, 3, ['Supuesto', 'Valor', 'Unidad', 'Fuente / nota'])
S = {}
rows = [
    ('— GENERAL', None, None, None, None),
    ('tc', 'Tipo de cambio', round(TC, 2), 'Gs/USD', f'BCP, cotización referencial del {CFG["tipo_cambio"]["fecha"]}'),
    ('precio_gs', 'Precio de venta', 950_000_000, 'Gs', 'Aviso del inmueble'),
    ('terreno', 'Terreno', 541, 'm²', 'Aviso (12,30 × 43 m)'),
    ('m2_aviso', 'Construidos según el aviso', 300, 'm²', 'A verificar con planos'),
    ('m2_tabla', 'Construidos según la tabla de unidades', 610, 'm²', 'Suma de las 19 unidades'),
    ('m2_obra', 'Superficie que dimensiona la obra de B y C', 600, 'm²', 'Planilla original: 600 m². Ajustar a la superficie real'),
    ('ire', 'IRE estimado', 0.10, '%', 'Si se compra por sociedad; lo define el contador'),
    ('notarial', 'Gastos notariales / escrituración', 0.02, '% del precio', 'Planilla original'),
    ('transf', 'Impuestos de transferencia', 0.015, '% del precio', 'Planilla original'),
    ('hon', 'Honorarios inmobiliarios a cargo del comprador', 0.0, '% del precio', 'La planilla ponía 5%; la comisión de venta la paga el vendedor (criterio de Meridiano)'),
    ('obj', 'Rentabilidad bruta objetivo', 0.10, '%', 'Para el precio máximo de compra y el alquiler requerido'),
    ('g', 'Suba anual de alquileres (escenario base)', 0.03, '%', 'Escenario base de Meridiano'),
    ('val', 'Valorización anual (escenario base)', 0.035, '%', 'Escenario base de Meridiano'),
    ('iva_venta', 'IVA de la venta futura', 0.015, '% del precio de venta', 'D-082: 30% de base presunta × 5%'),
    ('— A · DEPARTAMENTOS Y SALONES', None, None, None, None),
    ('a_refac', 'Puesta en valor de unidades existentes', 175, 'USD/m²', '50% de la tabla básica de remodelación de Meridiano (USD 350/m²)'),
    ('a_m2', 'Superficie de unidades existentes', 511, 'm²', '610 m² de la tabla menos 99 m² de unidades nuevas'),
    ('a_nueva', 'Baño y kitchenette por unidad nueva', 6000, 'USD/unidad', 'La tabla del propietario estimaba Gs 10 M por unidad'),
    ('a_n_nuevas', 'Unidades nuevas (PA fondo)', 3, 'unidades', 'Tabla de unidades'),
    ('a_imprev', 'Imprevistos de obra', 0.10, '%', 'Criterio de Meridiano'),
    ('a_meses', 'Meses de obra', 6, 'meses', 'Supuesto'),
    ('a_iva_viv', 'IVA alquiler residencial', 0.05, '%', 'D-001/D-045'),
    ('a_iva_com', 'IVA alquiler comercial', 0.10, '%', 'D-001/D-045'),
    ('a_vac_viv', 'Vacancia de unidades residenciales', 0.06, '%', 'Supuesto: unidades chicas del centro'),
    ('a_vac_com', 'Vacancia de salones / oficinas', 0.10, '%', 'Supuesto'),
    ('a_adm', 'Administración', 0.08, '% del bruto', 'Criterio de Meridiano'),
    ('a_man', 'Mantenimiento', 0.05, '% del bruto', 'Criterio de Meridiano'),
    ('a_fijos', 'Gastos fijos no trasladables', 6000, 'USD/año', 'Seguro, impuesto inmobiliario, áreas comunes (supuesto)'),
    ('— B · 20 HABITACIONES EN ALQUILER MENSUAL (todo incluido)', None, None, None, None),
    ('hab', 'Cantidad de habitaciones', 20, 'habitaciones', 'Planilla original (el aviso indica 16: 3 + 13)'),
    ('b_rent', 'Alquiler por habitación, todo incluido', 1_400_000, 'Gs/mes', 'Estudio: habitación Gs 0,5–1,2 M; monoambiente del centro Gs 1,4–1,5 M'),
    ('b_vac', 'Vacancia / rotación', 0.10, '%', 'Supuesto (la planilla usaba 8%)'),
    ('b_iva', 'IVA', 0.05, '%', 'Alquiler residencial'),
    ('op_serv', 'Servicios (agua, luz, gas)', 350, 'USD/mes', 'Planilla original'),
    ('op_seg', 'Seguro del edificio', 100, 'USD/mes', 'Planilla original'),
    ('op_man', 'Mantenimiento / reparaciones', 200, 'USD/mes', 'Planilla original'),
    ('op_adm', 'Administración', 400, 'USD/mes', 'Planilla original'),
    ('op_imp', 'Impuestos y tasas municipales', 120, 'USD/mes', 'Planilla original'),
    ('op_limp', 'Limpieza', 300, 'USD/mes', 'Planilla original'),
    ('b_meses', 'Meses de obra', 12, 'meses', 'Supuesto'),
    ('— C · HOSTEL DE 20 HABITACIONES PRIVADAS', None, None, None, None),
    ('c_adr', 'Tarifa promedio por noche', 22, 'USD', 'Estudio: privadas del centro USD 7–31'),
    ('c_occ', 'Ocupación anual', 0.55, '%', 'Underwriting base de Meridiano 55–69% (D-046); se toma el piso'),
    ('c_ota', 'Comisión de plataformas', 0.15, '% del bruto', 'Supuesto'),
    ('c_limp', 'Limpieza, lavandería y amenities', 0.12, '% del bruto', 'Supuesto'),
    ('c_man', 'Mantenimiento', 0.05, '% del bruto', 'Criterio de Meridiano'),
    ('c_iva', 'IVA', 0.10, '%', 'Renta temporal (D-045)'),
    ('c_staff_n', 'Personal de recepción', 3, 'personas', 'Supuesto'),
    ('c_sueldo', 'Sueldo por persona', 3_000_000, 'Gs/mes', 'Supuesto; 13 sueldos por año con aguinaldo'),
    ('c_opex_f', 'Consumo hotelero sobre gastos del edificio (sin administración)', 1.3, 'factor', 'Supuesto: +30%'),
    ('c_soft', 'Software, plataformas y marketing', 1800, 'USD/año', 'Supuesto'),
    ('c_extra', 'Equipamiento de hostel y habilitación turística', 15000, 'USD', 'Recepción, ropa blanca, TV, cerraduras, señalética (supuesto)'),
]
r = 4
for key, lab, val, uni, nota in rows:
    if val is None:
        sp.cell(r, 1, lab).font = Font(name='Calibri', bold=True, color=TIE); r += 1; continue
    sp.cell(r, 1, lab)
    c = sp.cell(r, 2, val); c.font = F_IN; c.fill = FILL_IN
    if uni.startswith('%'): c.number_format = '0.0%'
    elif uni in ('Gs', 'Gs/mes'): c.number_format = '#,##0'
    elif uni == 'Gs/USD': c.number_format = '#,##0.00'
    else: c.number_format = '#,##0.##'
    sp.cell(r, 3, uni); sp.cell(r, 4, nota).font = F_NOTE
    S[key] = f'Supuestos!$B${r}'; r += 1
sp.cell(r + 1, 1, 'Precio de venta en USD'); c = sp.cell(r + 1, 2, f'={S["precio_gs"]}/{S["tc"]}'); c.number_format = USD; c.font = F_B
S['precio'] = f'Supuestos!$B${r + 1}'
widths(sp, [58, 18, 16, 80]); sp.freeze_panes = 'A4'

# ------------------------------------------------------------------ Inversión (planilla B y C, cantidades ligadas)
iv = wb.create_sheet('Inversión')
title(iv, 'INVERSIÓN – COMPRA Y OBRA', 'Ítems y precios unitarios de la planilla del propietario; las cantidades se ligan a la superficie y a las habitaciones de Supuestos')
hdr(iv, 3, ['#', 'Ítem', 'Unidad', 'Cantidad', 'Precio unit. (USD)', 'Total (USD)', 'Cómo se calcula la cantidad'])
m2f = f'{S["m2_obra"]}/600'
items = [
    ('B', 'OBRA CIVIL – REMODELACIÓN GENERAL', None),
    ('B.1', 'Demoliciones y retiro de escombros', ('M²', f'=600*{m2f}', 8, 'Superficie de obra')),
    ('B.2', 'Refuerzo estructura (vigas, columnas, losa)', ('Global', 1, 12000, '')),
    ('B.3', 'Tabiquería interior nueva', ('M²', f'=350*{m2f}', 35, 'Proporcional a la superficie')),
    ('B.4', 'Revoques y contrapisos', ('M²', f'=600*{m2f}', 18, 'Superficie de obra')),
    ('B.5', 'Pisos – habitaciones', ('M²', f'=480*{m2f}', 22, 'Proporcional a la superficie')),
    ('B.6', 'Pisos – pasillos / áreas comunes', ('M²', f'=120*{m2f}', 20, 'Proporcional a la superficie')),
    ('B.7', 'Cielorrasos / yeso', ('M²', f'=600*{m2f}', 14, 'Superficie de obra')),
    ('B.8', 'Puertas de habitaciones con cerradura', ('Unid.', f'={S["hab"]}', 280, 'Una por habitación')),
    ('B.9', 'Puertas de baños', ('Unid.', f'={S["hab"]}', 200, 'Una por habitación')),
    ('B.10', 'Ventanas (aluminio DVH)', ('Unid.', 24, 320, 'Planilla original')),
    ('B.11', 'Escaleras / pasamanos', ('Global', 1, 3500, '')),
    ('B.12', 'Fachada / frente exterior', ('M²', 120, 25, 'Planilla original')),
    ('B.13', 'Techo / impermeabilización', ('M²', f'=300*{m2f}', 18, 'Proporcional a la superficie')),
    ('C', 'INSTALACIONES SANITARIAS – BAÑOS PRIVADOS', None),
    ('C.1', 'Adaptación de cañerías existentes', ('Global', 1, 2500, '')),
    ('C.2', 'Cañería agua fría y caliente (por baño)', ('Unid.', f'={S["hab"]}', 400, 'Una por habitación')),
    ('C.3', 'Cañería de desagüe (por baño)', ('Unid.', f'={S["hab"]}', 350, 'Una por habitación')),
    ('C.4', 'Inodoro + mochila', ('Unid.', f'={S["hab"]}', 180, 'Una por habitación')),
    ('C.5', 'Lavatorio + grifería', ('Unid.', f'={S["hab"]}', 150, 'Una por habitación')),
    ('C.6', 'Ducha / cabina', ('Unid.', f'={S["hab"]}', 200, 'Una por habitación')),
    ('C.7', 'Termotanque compartido cada 4 habitaciones', ('Unid.', f'=ROUNDUP({S["hab"]}/4,0)', 350, '1 cada 4 habitaciones')),
    ('C.8', 'Revestimiento cerámico (12 m² por baño)', ('M²', f'=12*{S["hab"]}', 25, '12 m² por baño')),
    ('C.9', 'Accesorios de baño', ('Unid.', f'={S["hab"]}', 80, 'Una por habitación')),
    ('C.10', 'Ventilación mecánica de baños', ('Unid.', f'={S["hab"]}', 90, 'Una por habitación')),
    ('D', 'INSTALACIONES ELÉCTRICAS', None),
    ('D.1', 'Tablero general trifásico', ('Unid.', 1, 1800, '')),
    ('D.2', 'Subtableros por piso', ('Unid.', 2, 600, '')),
    ('D.3', 'Circuito individual por habitación', ('Unid.', f'={S["hab"]}', 280, 'Una por habitación')),
    ('D.4', 'Iluminación LED de habitaciones', ('Unid.', f'={S["hab"]}', 60, 'Una por habitación')),
    ('D.5', 'Iluminación de áreas comunes y emergencia', ('Global', 1, 1200, '')),
    ('D.6', 'Tomacorrientes y llaves', ('Unid.', f'={S["hab"]}', 90, 'Una por habitación')),
    ('D.7', 'Cableado estructurado (internet)', ('Global', 1, 1500, '')),
    ('D.8', 'Portero / intercomunicadores', ('Global', 1, 800, '')),
    ('D.9', 'Puesta a tierra y protecciones', ('Global', 1, 700, '')),
    ('E', 'PINTURA', None),
    ('E.1', 'Pintura interior – habitaciones y baños', ('M²', f'=48*{S["hab"]}', 5, '48 m² de pared por habitación')),
    ('E.2', 'Pintura interior – áreas comunes', ('M²', 240, 5, 'Planilla original')),
    ('E.3', 'Pintura exterior – fachada', ('M²', 180, 7, 'Planilla original')),
    ('E.4', 'Pintura de techos y cielorrasos', ('M²', f'=600*{m2f}', 4, 'Superficie de obra')),
    ('E.5', 'Pintura de aberturas', ('Unid.', 64, 20, 'Planilla original')),
    ('F', 'EQUIPAMIENTO DE HABITACIONES', None),
    ('F.1', 'Cama 1½ plaza + colchón', ('Unid.', f'={S["hab"]}', 250, 'Una por habitación')),
    ('F.2', 'Placard / ropero', ('Unid.', f'={S["hab"]}', 180, 'Una por habitación')),
    ('F.3', 'Escritorio + silla', ('Unid.', f'={S["hab"]}', 120, 'Una por habitación')),
    ('F.4', 'Cortinas / rollers', ('Unid.', f'={S["hab"]}', 60, 'Una por habitación')),
    ('F.5', 'Split frío/calor', ('Unid.', f'={S["hab"]}', 450, 'Una por habitación')),
    ('F.6', 'Cocina equipada de área común', ('Global', 1, 2000, '')),
    ('F.7', 'Lavarropas (1 por piso)', ('Unid.', 2, 500, '')),
]
r = 4; sub = {}; first = None
for code, lab, spec in items:
    if spec is None:
        if first:
            iv.cell(r, 2, f'Subtotal {cur}').font = F_B; c = iv.cell(r, 6, f'=SUM(F{first}:F{r - 1})'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT
            sub[cur] = f'F{r}'; r += 1
        iv.cell(r, 1, code).font = Font(bold=True, color=TIE); iv.cell(r, 2, lab).font = Font(bold=True, color=TIE); cur = code; r += 1; first = r; continue
    uni, q, pu, how = spec
    iv.cell(r, 1, code); iv.cell(r, 2, lab); iv.cell(r, 3, uni)
    c = iv.cell(r, 4, q); c.number_format = '#,##0.##'
    if not (isinstance(q, str) and q.startswith('=')): c.font = F_IN; c.fill = FILL_IN
    c = iv.cell(r, 5, pu); c.font = F_IN; c.fill = FILL_IN; c.number_format = USD
    c = iv.cell(r, 6, f'=D{r}*E{r}'); c.number_format = USD
    iv.cell(r, 7, how).font = F_NOTE; r += 1
iv.cell(r, 2, f'Subtotal {cur}').font = F_B; c = iv.cell(r, 6, f'=SUM(F{first}:F{r - 1})'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT; sub[cur] = f'F{r}'; r += 2
iv.cell(r, 1, 'G').font = Font(bold=True, color=TIE); iv.cell(r, 2, 'GASTOS INDIRECTOS').font = Font(bold=True, color=TIE); r += 1
bcde = f'({sub["B"]}+{sub["C"]}+{sub["D"]}+{sub["E"]})'
gi = [('G.1', 'Dirección técnica / arquitecto (5% de B a E)', 0.05, f'={bcde}*E{{r}}'), ('G.2', 'Permisos y habilitaciones', 800, '=E{r}'),
      ('G.3', 'Imprevistos (8% de B a E)', 0.08, f'={bcde}*E{{r}}'), ('G.4', 'Seguros de obra', 600, '=E{r}')]
g0 = r
for code, lab, val, f in gi:
    iv.cell(r, 1, code); iv.cell(r, 2, lab)
    c = iv.cell(r, 5, val); c.font = F_IN; c.fill = FILL_IN; c.number_format = '0%' if val < 1 else USD
    c = iv.cell(r, 6, f.format(r=r)); c.number_format = USD; r += 1
iv.cell(r, 2, 'Subtotal G').font = F_B; c = iv.cell(r, 6, f'=SUM(F{g0}:F{r - 1})'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT; sub['G'] = f'F{r}'; r += 2
iv.cell(r, 2, 'OBRA OPCIÓN B (B a G)').font = F_B; c = iv.cell(r, 6, f'={sub["B"]}+{sub["C"]}+{sub["D"]}+{sub["E"]}+{sub["F"]}+{sub["G"]}'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT
OBRA_B = f"Inversión!$F${r}"; r += 1
iv.cell(r, 2, 'OBRA OPCIÓN C (B + equipamiento de hostel con 10% de imprevistos)').font = F_B; c = iv.cell(r, 6, f'=F{r - 1}+{S["c_extra"]}*1.1'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT
OBRA_C = f"Inversión!$F${r}"; r += 1
iv.cell(r, 2, 'OBRA OPCIÓN A (puesta en valor + unidades nuevas + imprevistos)').font = F_B
c = iv.cell(r, 6, f'=({S["a_refac"]}*{S["a_m2"]}+{S["a_nueva"]}*{S["a_n_nuevas"]})*(1+{S["a_imprev"]})'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT
OBRA_A = f"Inversión!$F${r}"; r += 2
iv.cell(r, 2, 'COMPRA'); iv.cell(r, 2).font = Font(bold=True, color=TIE); r += 1
for lab, f in [('Precio de compra (USD)', f'={S["precio"]}'), ('Gastos notariales', f'={S["precio"]}*{S["notarial"]}'), ('Impuestos de transferencia', f'={S["precio"]}*{S["transf"]}'),
               ('Honorarios a cargo del comprador', f'={S["precio"]}*{S["hon"]}')]:
    iv.cell(r, 2, lab); c = iv.cell(r, 6, f); c.number_format = USD; r += 1
iv.cell(r, 2, 'Gastos de compra (sin el precio)').font = F_B; c = iv.cell(r, 6, f'=SUM(F{r - 3}:F{r - 1})'); c.number_format = USD; c.font = F_B; c.fill = FILL_TOT
GCOMPRA = f"Inversión!$F${r}"
widths(iv, [7, 52, 9, 11, 17, 17, 34]); iv.freeze_panes = 'A4'

# ------------------------------------------------------------------ Ingresos A (tabla de unidades)
ia = wb.create_sheet('Ingresos A')
title(ia, 'OPCIÓN A – TABLA DE UNIDADES (alquiler proyectado del propietario, editable)', 'Clase: VIV = vivienda (IVA 5%), COM = salón u oficina (IVA 10%)')
hdr(ia, 3, ['Planta', 'N.º', 'Tipo', 'Detalle', 'm²', 'Alquiler (Gs/mes)', 'Clase', 'IVA (Gs/mes)', 'Vacancia (Gs/mes)'])
sys.path.insert(0, B)
import model as MD  # noqa: E402
r = 4
for u in MD.UNITS:
    for j, v in enumerate(u[:5], 1): ia.cell(r, j, v)
    c = ia.cell(r, 6, u[5]); c.font = F_IN; c.fill = FILL_IN; c.number_format = '#,##0'
    c = ia.cell(r, 7, u[6]); c.font = F_IN; c.fill = FILL_IN
    c = ia.cell(r, 8, f'=F{r}*IF(G{r}="COM",{S["a_iva_com"]},{S["a_iva_viv"]})'); c.number_format = '#,##0'
    c = ia.cell(r, 9, f'=F{r}*IF(G{r}="COM",{S["a_vac_com"]},{S["a_vac_viv"]})'); c.number_format = '#,##0'
    r += 1
ia.cell(r, 1, 'Total').font = F_B
for col in (5, 6, 8, 9):
    L = get_column_letter(col); c = ia.cell(r, col, f'=SUM({L}4:{L}{r - 1})'); c.font = F_B; c.fill = FILL_TOT; c.number_format = '#,##0'
A_MES, A_IVA, A_VAC = f"'Ingresos A'!$F${r}", f"'Ingresos A'!$H${r}", f"'Ingresos A'!$I${r}"
ia.cell(r + 2, 1, 'Fuente: tabla de unidades del propietario (alquiler proyectado). Monoambientes de 20 m² a Gs 800.000, dentro de la banda del centro (Gs 0,7–1,65 M).').font = F_NOTE
widths(ia, [13, 6, 22, 34, 7, 17, 7, 14, 15]); ia.freeze_panes = 'A4'

# ------------------------------------------------------------------ Resultados
rs = wb.create_sheet('Resultados')
title(rs, 'RESULTADOS – COMPARACIÓN DE LAS TRES OPCIONES (USD por año)', 'Rentabilidad sobre precio + obra (criterio de Meridiano); se muestra también con los gastos de compra')
hdr(rs, 3, ['Concepto', 'A · Departamentos y salones', 'B · 20 habitaciones mensuales', 'C · Hostel 20 habitaciones', 'Nota'])
tc, ire = S['tc'], S['ire']
opexB = f'({S["op_serv"]}+{S["op_seg"]}+{S["op_man"]}+{S["op_adm"]}+{S["op_imp"]}+{S["op_limp"]})*12'
GA = f'{A_MES}*12/{tc}'
GB = f'{S["hab"]}*{S["b_rent"]}*12/{tc}'
GC = f'{S["hab"]}*{S["c_adr"]}*365*{S["c_occ"]}'
R = {}
spec = [
    ('G', 'Ingreso bruto anual', f'={GA}', f'={GB}', f'={GC}', 'A: tabla · B: habitaciones × alquiler · C: habitaciones × tarifa × 365 × ocupación'),
    ('iva', 'IVA', f'={A_IVA}*12/{tc}', f'=C{{G}}*{S["b_iva"]}', f'=D{{G}}*{S["c_iva"]}', ''),
    ('vac', 'Vacancia', f'={A_VAC}*12/{tc}', f'=C{{G}}*{S["b_vac"]}', '=0', 'C: la ocupación ya descuenta la vacancia'),
    ('adm', 'Administración', f'=B{{G}}*{S["a_adm"]}', '=0', '=0', 'B: incluida en gastos del edificio · C: personal'),
    ('man', 'Mantenimiento', f'=B{{G}}*{S["a_man"]}', '=0', f'=D{{G}}*{S["c_man"]}', 'B: incluido en gastos del edificio'),
    ('ota', 'Comisión de plataformas', '=0', '=0', f'=D{{G}}*{S["c_ota"]}', ''),
    ('limp', 'Limpieza y lavandería', '=0', '=0', f'=D{{G}}*{S["c_limp"]}', ''),
    ('fijos', 'Gastos fijos / del edificio', f'={S["a_fijos"]}', f'={opexB}', f'=({S["op_serv"]}+{S["op_seg"]}+{S["op_man"]}+{S["op_imp"]}+{S["op_limp"]})*12*{S["c_opex_f"]}+{S["c_soft"]}', 'B: planilla original · C: planilla sin administración, ×factor hotelero'),
    ('staff', 'Personal de recepción', '=0', '=0', f'={S["c_staff_n"]}*{S["c_sueldo"]}*13/{tc}', ''),
    ('pre', 'Resultado antes de IRE', '=B{G}-SUM(B{iva}:B{staff})', '=C{G}-SUM(C{iva}:C{staff})', '=D{G}-SUM(D{iva}:D{staff})', ''),
    ('ire', 'IRE estimado', f'=B{{pre}}*{ire}', f'=C{{pre}}*{ire}', f'=D{{pre}}*{ire}', ''),
    ('net', 'Neto anual', '=B{pre}-B{ire}', '=C{pre}-C{ire}', '=D{pre}-D{ire}', ''),
    (None,), ('obra', 'Obra total', f'={OBRA_A}', f'={OBRA_B}', f'={OBRA_C}', 'Hoja Inversión'),
    ('inv', 'Inversión (precio + obra)', f'={S["precio"]}+B{{obra}}', f'={S["precio"]}+C{{obra}}', f'={S["precio"]}+D{{obra}}', 'Base de las rentabilidades'),
    ('invg', 'Inversión con gastos de compra', f'=B{{inv}}+{GCOMPRA}', f'=C{{inv}}+{GCOMPRA}', f'=D{{inv}}+{GCOMPRA}', ''),
    (None,), ('bruta', 'Rentabilidad bruta', '=B{G}/B{inv}', '=C{G}/C{inv}', '=D{G}/D{inv}', 'Ingreso bruto ÷ inversión'),
    ('neta_pre', 'Neta antes de IRE', '=B{pre}/B{inv}', '=C{pre}/C{inv}', '=D{pre}/D{inv}', ''),
    ('neta', 'Neta final', '=B{net}/B{inv}', '=C{net}/C{inv}', '=D{net}/D{inv}', ''),
    ('netag', 'Neta final con gastos de compra', '=B{net}/B{invg}', '=C{net}/C{invg}', '=D{net}/D{invg}', ''),
    ('pay', 'Recupero simple (años, sobre el neto)', '=IF(B{net}>0,B{inv}/B{net},"—")', '=IF(C{net}>0,C{inv}/C{net},"—")', '=IF(D{net}>0,D{inv}/D{net},"—")', 'No es una TIR'),
    ('max', 'Precio máximo para la bruta objetivo (USD)', f'=B{{G}}/{S["obj"]}-B{{obra}}', f'=C{{G}}/{S["obj"]}-C{{obra}}', f'=D{{G}}/{S["obj"]}-D{{obra}}', 'Herramienta inversa'),
    ('maxgs', 'Precio máximo para la bruta objetivo (Gs)', f'=B{{max}}*{tc}', f'=C{{max}}*{tc}', f'=D{{max}}*{tc}', ''),
    ('req', 'Alquiler por habitación para la bruta objetivo (Gs/mes)', '="—"', f'={S["obj"]}*C{{inv}}*{tc}/({S["hab"]}*12)', '="—"', 'Sobre ingreso bruto (sin vacancia)'),
    (None,), ('ycf', 'Flujo de caja (escenario base)', None, None, None, 'Año 0 compra y obra; venta al cierre del año 5'),
]
r = 4
for sp_ in spec:
    if sp_[0] is None: r += 1; continue
    R[sp_[0]] = r; r += 1
r = 4
for sp_ in spec:
    if sp_[0] is None: r += 1; continue
    key, lab, fa, fb, fc, note = sp_
    rs.cell(r, 1, lab).font = F_B if key in ('G', 'pre', 'net', 'inv', 'bruta', 'neta', 'ycf') else Font(name='Calibri')
    if fa is not None:
        for j, f in enumerate((fa, fb, fc), 2):
            c = rs.cell(r, j, f.format(**R))
            c.number_format = PCT if key in ('bruta', 'neta_pre', 'neta', 'netag') else ('0.0' if key == 'pay' else ('#,##0' if key in ('maxgs', 'req') else USD))
            if key in ('G', 'net', 'inv', 'bruta', 'neta'): c.fill = FILL_TOT; c.font = F_B
    rs.cell(r, 5, note).font = F_NOTE; r += 1
# Flujo de caja y TIR
r0 = r
rs.cell(r, 1, 'Año'); [rs.cell(r, 2 + i, i) for i in range(6)]
y1 = {'B': f'{S["a_meses"]}', 'C': f'{S["b_meses"]}', 'D': f'{S["b_meses"]}'}
for k, col in enumerate('BCD'):
    rr = r + 1 + k
    rs.cell(rr, 1, ['A', 'B', 'C'][k] + ' · flujo (USD)')
    net, inv = f'{col}${R["net"]}', f'{col}${R["inv"]}'
    g, val, ivv = S['g'], S['val'], S['iva_venta']
    rs.cell(rr, 2, f'=-{inv}').number_format = USD
    rs.cell(rr, 3, f'={net}*MAX(0,12-{y1[col]})/12').number_format = USD
    for i in range(3): rs.cell(rr, 4 + i, f'={net}*(1+{g})^{i}').number_format = USD
    rs.cell(rr, 7, f'={net}*(1+{g})^3+{inv}*(1+{val})^4*(1-{ivv})').number_format = USD
rt = r + 5
rs.cell(rt, 1, 'TIR a 5 años (escenario base)').font = F_B
for k, col in enumerate('BCD'):
    c = rs.cell(rt, 2 + k, f'=IRR(B{r + 1 + k}:G{r + 1 + k})'); c.number_format = '0.0%'; c.font = F_B; c.fill = FILL_TOT
R['tir'] = rt
for i, t in enumerate(['A y B: renta desde el fin de la obra (meses de obra en Supuestos). La valorización parte de la inversión total.',
                       'Cifras de referencia, no garantizadas. IVA e IRE son estimaciones: los define el contador.'], rt + 2):
    rs.cell(i, 1, t).font = F_NOTE
widths(rs, [52, 24, 24, 24, 58]); rs.freeze_panes = 'B4'

# ------------------------------------------------------------------ Sensibilidad
se = wb.create_sheet('Sensibilidad')
title(se, 'SENSIBILIDAD – NETA FINAL SEGÚN ALQUILER Y OBRA', 'Factor sobre el alquiler (o la tarifa) y sobre el costo de obra; resto de supuestos sin cambios')
hdr(se, 3, ['Opción y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'])
r = 4
for k, (nm, col) in enumerate([('A', 'B'), ('B', 'C'), ('C', 'D')]):
    pct_cells = f"SUM(Resultados!{col}{R['iva']}:Resultados!{col}{R['limp']})/Resultados!{col}{R['G']}"
    fixed = f"(Resultados!{col}{R['fijos']}+Resultados!{col}{R['staff']})"
    for fobra in (1.0, 1.25):
        se.cell(r, 1, f'{nm} · obra {"base" if fobra == 1 else "+25%"}')
        for j, kk in enumerate((0.85, 1.0, 1.15), 2):
            G = f"Resultados!{col}{R['G']}*{kk}"
            f = f"=(({G})*(1-{pct_cells})-{fixed})*(1-{ire})/({S['precio']}+Resultados!{col}{R['obra']}*{fobra})"
            c = se.cell(r, j, f); c.number_format = PCT
        r += 1
r += 1
se.cell(r, 1, 'Hostel: neta final según la ocupación').font = F_B; r += 1
hdr(se, r, ['Ocupación', 'Neta final', '', '']); r += 1
for occ in (0.45, 0.55, 0.60, 0.69):
    c = se.cell(r, 1, occ); c.number_format = '0%'; c.font = F_IN; c.fill = FILL_IN
    G = f"{S['hab']}*{S['c_adr']}*365*A{r}"
    pc = f"({S['c_iva']}+{S['c_ota']}+{S['c_limp']}+{S['c_man']})"
    f = f"=(({G})*(1-{pc})-Resultados!D{R['fijos']}-Resultados!D{R['staff']})*(1-{ire})/Resultados!D{R['inv']}"
    c = se.cell(r, 2, f); c.number_format = PCT; r += 1
widths(se, [30, 18, 18, 18])

# ------------------------------------------------------------------ Observaciones a la planilla original
ob = wb.create_sheet('Observaciones')
title(ob, 'OBSERVACIONES A LA PLANILLA ORIGINAL Y CÓMO SE CORRIGIERON', 'Planilla “Inversión y Remodelación Edificio 2P y 20 Habitaciones” (2 hojas)')
hdr(ob, 3, ['#', 'Observación', 'Impacto', 'Corrección en este modelo'])
obs = [
    ('Precio de compra en USD 175.000, que no coincide con el aviso (Gs 950 M).', 'Gs 950 M son unos USD 146.600 al TC vigente (USD 158.300 al TC de Gs 6.000 de la planilla). La inversión quedaba sobrestimada en unos USD 28.000.', 'El precio se carga en guaraníes y se convierte con el TC de Supuestos.'),
    ('Tipo de cambio fijo en Gs 6.000.', 'Con el TC del BCP (Gs 6.480) cambian el precio en USD y los alquileres en USD.', 'TC editable en Supuestos, con fecha y fuente.'),
    ('Superficie: la planilla supone 600 m²; el aviso dice 300 m² y la tabla de unidades suma 610 m².', 'Las cantidades por m² (demolición, revoques, cielorrasos, pintura, techo) pueden estar duplicadas si el edificio tiene 300 m².', 'Las cantidades por m² se ligan a “Superficie que dimensiona la obra”: cambiándola, se reescala todo.'),
    ('Habitaciones: 20 en la planilla; el aviso describe 16 (3 + 13) y la tabla 19 unidades.', 'Puertas, baños, circuitos y equipamiento se multiplican por la cantidad de habitaciones.', 'Las cantidades por habitación se ligan a “Cantidad de habitaciones”.'),
    ('“Rentabilidad bruta” calculada sobre el ingreso ya ajustado por ocupación, y forzada al 14% objetivo.', 'Es circular: el alquiler se calcula para que dé 14% y luego se verifica el mismo 14%. No dice si el mercado paga ese alquiler.', 'El alquiler es una entrada de mercado y la rentabilidad es un resultado; el alquiler requerido para un objetivo se muestra aparte.'),
    ('El alquiler que pide la planilla es de USD 256 + USD 74 de expensas por habitación (unos Gs 2,1 M al mes, todo incluido).', 'Está muy por encima del mercado del centro: habitación Gs 0,5–1,2 M y monoambiente con cocina Gs 1,4–1,5 M.', 'Base de mercado: Gs 1,4 M por habitación todo incluido (estudio del 08/11/2026).'),
    ('No descuenta IVA, administración, IRE ni la vacancia en la rentabilidad.', 'La cifra mostrada no es ni bruta ni neta.', 'Se separan bruta, neta antes de IRE y neta final, con IVA de 5% (vivienda) o 10% (hostel).'),
    ('Honorarios inmobiliarios del 5% a cargo del comprador.', 'Suman USD 8.750 a la inversión.', 'Editable; por defecto 0%, porque la comisión de venta la paga el vendedor.'),
    ('Gastos financieros de 3% sobre toda la inversión, sin plazo ni tasa.', 'Suma unos USD 11.000 sin respaldo.', 'Se excluyen; si hay financiamiento, se modela aparte.'),
    ('No considera el plazo de obra sin renta ni la venta futura.', 'No permite calcular una TIR.', 'Flujo de caja a 5 años con meses de obra, suba de alquileres, valorización e IVA de la venta futura.'),
    ('Una sola opción (habitaciones).', 'No compara con otros usos.', 'Compara A departamentos y salones, B habitaciones mensuales y C hostel.'),
]
for i, (a, b, c_) in enumerate(obs, 4):
    ob.cell(i, 1, i - 3); ob.cell(i, 2, a); ob.cell(i, 3, b); ob.cell(i, 4, c_)
    for j in (2, 3, 4): ob.cell(i, j).alignment = Alignment(wrap_text=True, vertical='top')
widths(ob, [5, 55, 60, 60])

wb.active = 0
os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.calculation.fullCalcOnLoad = True
wb.save(OUT)
if shutil.which('soffice'):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['soffice', f'-env:UserInstallation=file://{tmp}/perfil', '--headless', '--convert-to', 'xlsx', '--outdir', tmp, OUT], capture_output=True, timeout=180)
        rec = os.path.join(tmp, os.path.basename(OUT))
        if os.path.exists(rec):
            shutil.copyfile(rec, OUT)
print('XLSX:', os.path.abspath(OUT))
import runpy, os; runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build_web.py'))
