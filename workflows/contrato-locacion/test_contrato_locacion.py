#!/usr/bin/env python3
"""Tests de WF-04 con datos 100% FICTICIOS (sin PII). Correr:  python workflows/contrato-locacion/test_contrato_locacion.py"""
import copy
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generar_contrato as G          # noqa: E402
from motor import ficha as F          # noqa: E402
from motor import documento as D      # noqa: E402
from motor import numeros as N        # noqa: E402

BASE = {'campos': {
    'id_expediente': 'TEST-001', 'lugar_firma': 'Asunción, República del Paraguay', 'fecha_firma': '01/03/2027',
    'prop_razon_social': 'EJEMPLO INVERSIONES S.A.', 'prop_ruc': '80000000-0', 'prop_domicilio': 'Calle Ficticia N° 1, Asunción, Paraguay',
    'repr_nombre': 'Persona Representante Ficticia', 'repr_ci': '1.111.111', 'repr_caracter': 'Presidente',
    'repr_facultades': 'Acta de Directorio N° 1 de fecha 01/01/2027', 'prop_email_notif': 'propietario@ejemplo.test',
    'prop_tel_notif': '+595 000 000 001', 'inq_nombre': 'Locatario De Prueba', 'inq_nacionalidad': 'paraguaya',
    'inq_documento': 'C.I. N.º 2.222.222', 'inq_email': 'locatario@ejemplo.test', 'inq_tel': '+595 000 000 002',
    'posee_codeudor': 'NO', 'inm_edificio': 'Edificio Ejemplo', 'inm_unidad': 'Piso 3°, Departamento B',
    'inm_direccion': 'Avenida Ficticia N° 100, Asunción, Paraguay', 'inm_ctacte': '10-0000-01', 'inm_nis': '1000001',
    'inm_condicion': '100% amoblado', 'inm_cochera': '7', 'inm_primera_ocupacion': 'NO',
    'inm_destino': 'principalmente a vivienda personal', 'inm_autoriza_domicilio': 'NO', 'canon': 'USD 1.200',
    'iva': 'Incluido en el canon', 'iva_tasa': '5%', 'expensas': 'Incluidas en el canon', 'deposito': 'USD 2.400',
    'inicio': '01/03/2027', 'fin': '29/02/2028', 'duracion': '12 meses', 'reajuste': 'No aplica',
    'vencimiento': 'Del día 1 al 5 de cada mes', 'serv_energia': 'A cargo del inquilino', 'internet': 'A cargo del inquilino',
    'cta_beneficiario': 'EJEMPLO INVERSIONES SA', 'cta_banco': 'Banco Ficticio', 'cta_numero': '000111222',
    'contacto_principal': 'Contacto Uno · +595 000 000 003', 'contacto_alternativo': 'Contacto Dos · +595 000 000 004',
    'contacto_admin': 'Administración Ejemplo · +595 000 000 005'},
    'anexos': [], 'inventario': [{'SECTOR': 'Living', 'ARTICULO DESCRIPCION': 'Sofá 3 cuerpos', 'CANTIDAD': '1', 'ESTADO': 'Bueno'}],
    'no_reconocidos': [], 'estado_declarado': '', 'reglas': ['No incorporar a Tercero Excluido Ficticio como parte contractual.']}

FALLAS = []


def check(nombre, cond):
    print(('OK   ' if cond else 'FALLA'), nombre)
    if not cond:
        FALLAS.append(nombre)


def correr(campos=None, quitar=(), extra=None, base=False):
    f = copy.deepcopy(BASE)
    f['campos'].update(campos or {})
    for k in quitar:
        f['campos'].pop(k, None)
    if extra:
        f.update(extra)
    tmp = Path(tempfile.mkdtemp())
    (tmp / 'f.json').write_text(__import__('json').dumps(f, ensure_ascii=False), encoding='utf-8')
    r = G.generar(tmp / 'f.json', tmp / 'out', completar_con_base=base)
    c = tmp / 'out' / 'CONTRATO_TEST-001.docx'
    return r, (D.texto_docx(c) if c.exists() else '')


# Números en letras
check('letras 1.200', N.monto_letras(1200) == 'dólares estadounidenses mil doscientos')
check('letras 21 días', N.fecha_comparecencia(__import__('datetime').date(2027, 3, 21)).startswith('a los 21 (veintiuno) días'))

r, t = correr()
check('ficha completa → FICHA_VALIDADA', r['ficha'] == 'FICHA_VALIDADA')
check('ficha completa → CONTRATO_APTO_PARA_FIRMA', r['contrato'] == 'CONTRATO_APTO_PARA_FIRMA')
check('control final 100% OK', all(x['ok'] for x in r['control_final']) and len(r['control_final']) > 20)
check('sin resaltados', '⟦' not in t)
check('canon en letras', 'USD 1.200 (dólares estadounidenses mil doscientos)' in t)
check('depósito = dos (2) meses', 'dos (2) meses de alquiler' in t)
check('ocupación posterior 40 / 20 / 60', 'USD 40' in t and 'USD 20 por día' in t and 'USD 60 por día' in t)
check('tope de mora 5% del canon = USD 60', 'límite máximo de USD 60 por cada' in t)
check('plazo bisiesto 01/03/2027 → 29/02/2028', '29 de febrero de 2028' in t)
check('cuenta propia → sin cláusula de tercero', 'efecto cancelatorio' not in t)
check('sin autorización de domicilio comercial', 'domicilio comercial y administrativo' not in t)
check('cochera presente', 'Cochera N.º 7' in t)
check('no primera ocupación', 'primera ocupación' not in t.lower())
check('inventario de la ficha en Anexo I', 'Sofá 3 cuerpos' in t)
check('excluido no figura', 'Tercero Excluido' not in t)
check('expediente sin pendientes → cerrado', r['expediente'] == 'EXPEDIENTE_DOCUMENTALMENTE_CERRADO')

r, t = correr({'cta_beneficiario': 'Persona Titular Ficticia'})
check('cuenta de tercero → cláusula de autorización', 'efecto cancelatorio' in t and 'autoriza expresamente a su titular' in t)
check('cuenta de tercero → alerta', any('CUENTA_DE_TERCERO' in h['estado'] for h in r['hallazgos']))

r, t = correr({'fin': '01/03/2028'})
check('fin incoherente → NO_GENERABLE', r['contrato'] == 'CONTRATO_NO_GENERABLE' and t == '')
check('fin incoherente → INCONSISTENCIA', any(h['estado'] == 'INCONSISTENCIA' for h in r['hallazgos']))

r, _ = correr({'posee_codeudor': 'SI'})
check('codeudor SI → NO_GENERABLE (modelo sin cláusula)', r['contrato'] == 'CONTRATO_NO_GENERABLE')

r, _ = correr(quitar=['canon'])
check('sin canon → NO_GENERABLE', r['contrato'] == 'CONTRATO_NO_GENERABLE')

r, t = correr(quitar=['inm_destino'])
check('sin destino → APTO_PARA_REVISION con resaltado', r['contrato'] == 'CONTRATO_APTO_PARA_REVISION' and '⟦REVISIÓN REQUERIDA: Destino' in t)

r, t = correr(quitar=['inm_destino', 'iva_tasa', 'inm_primera_ocupacion', 'inm_cochera', 'inq_tel'], base=True)
check('modo contrato base: destino/IVA/primera ocupación tomados del base', 'principalmente a vivienda personal' in t
      and 'IVA del 5%' in t and 'para primera ocupación' in t)
check('modo contrato base: nunca completa datos del locatario ni la cochera',
      '⟦REVISIÓN REQUERIDA: Teléfono' in t and '⟦REVISIÓN REQUERIDA: Cochera' in t)
check('modo contrato base: lo tomado queda registrado', len(r['tomados_de_base']) == 3)

r, t = correr({'inm_ctacte': 'xx-xxxx-01'})
check('placeholder xx-xxxx-01 → faltante', 'xx-xxxx-01' not in t and r['contrato'] == 'CONTRATO_APTO_PARA_REVISION')

r, t = correr({'inm_cochera': 'NO'})
check('sin cochera → sin menciones de cochera', 'cochera' not in t.lower())

r, _ = correr({'iva_tasa': '10%'})
check('IVA 10% con vivienda → INCONSISTENCIA (D-001/D-045)', any('IVA' in h['campo'] and h['estado'] == 'INCONSISTENCIA' for h in r['hallazgos']))

r, _ = correr({'deposito': 'USD 1.000'})
check('depósito no entero en meses → INCONSISTENCIA', any(h['campo'] == 'Depósito' for h in r['hallazgos']))

r, _ = correr({'inicio': '08/03/2027', 'fin': '07/03/2028'})
check('inicio fuera de la ventana de pago → revisión primer pago', any(h['campo'] == 'Primer pago' for h in r['hallazgos']))

# Ida y vuelta de la Ficha v2 en .docx
tmp = Path(tempfile.mkdtemp())
F.escribir_docx(tmp / 'f.docx', dict(BASE['campos'], _reglas=BASE['reglas']))
leido_todo = F.leer(tmp / 'f.docx')
leido = leido_todo['campos']
check('ficha v2 .docx ida y vuelta', all(leido.get(k) == v for k, v in BASE['campos'].items()))
check('ficha v2 conserva instrucciones', leido_todo['reglas'] == BASE['reglas'])
F.escribir_docx(tmp / 'blanca.docx')
blanca = F.leer(tmp / 'blanca.docx')
check('ficha en blanco → ningún campo con valor', not any(not F.es_placeholder(v) for v in blanca['campos'].values()) and not blanca['reglas'])

# Protección PII: salida dentro del repo se rechaza
try:
    G.generar(tmp / 'f.docx', G.REPO / 'tmp_no_debe_existir')
    check('salida dentro del repo rechazada', False)
except SystemExit:
    check('salida dentro del repo rechazada', not (G.REPO / 'tmp_no_debe_existir').exists())

print(f'\n{"TODO OK" if not FALLAS else str(len(FALLAS)) + " FALLAS"}')
sys.exit(1 if FALLAS else 0)
