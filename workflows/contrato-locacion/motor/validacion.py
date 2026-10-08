"""VALIDACION_FICHA() y construcción del contexto del modelo — sin inventar datos.

Cada hallazgo: {'campo', 'estado', 'detalle', 'bloquea', 'revision'}
  bloquea=True  → CONTRATO_NO_GENERABLE (dato crítico ausente o el modelo no cubre la situación)
  revision=True → impide CONTRATO_APTO_PARA_FIRMA (queda APTO_PARA_REVISION)
"""
import datetime as dt
import json
import re
from decimal import Decimal
from pathlib import Path

from . import numeros as N
from .ficha import CAMPOS, CAMPO, es_placeholder, _norm

AQUI = Path(__file__).resolve().parent.parent
FALTA = '⟦REVISIÓN REQUERIDA: {} — no consta en la Ficha Maestra⟧'


def cargar_parametros():
    p = json.loads((AQUI / 'modelo' / 'parametros_modelo.json').read_text(encoding='utf-8'))
    p['penalidad_diaria_txt'] = _pct_letras(p['penalidad_diaria_pct'])
    for k in ('preaviso_rescision_dias', 'preaviso_cambio_cuenta_dias_habiles', 'devolucion_deposito_dias'):
        p[k + '_letras'] = f"{N.letras_pleno(p[k])} ({p[k]})"
    return p


def _pct_letras(x):
    ent, dec = str(x).split('.') if '.' in str(x) else (str(x), '')
    txt = N.letras_pleno(int(ent)) + (f' coma {N.letras_pleno(int(dec))}' if dec else '')
    return f"{str(x).replace('.', ',')}% ({txt} por ciento)"


def _fecha(s):
    m = re.search(r'(\d{1,2})/(\d{1,2})/(\d{4})', s or '')
    return dt.date(int(m.group(3)), int(m.group(2)), int(m.group(1))) if m else None


def _monto(s):
    """'USD 950 (equivalente…)' → ('USD', Decimal('950'))."""
    if not s:
        return None, None
    mon = 'USD' if re.search(r'USD|US\$|D[OÓ]LAR', s, re.I) else ('PYG' if re.search(r'Gs\.?|PYG|GUARAN', s, re.I) else None)
    m = re.search(r'(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?', s)
    if not m:
        return mon, None
    return mon, Decimal(m.group(1).replace('.', '') + ('.' + m.group(2) if m.group(2) else ''))


def _meses(s):
    m = re.search(r'(\d+)\s*(a[nñ]o|mes)', (s or '').lower())
    if not m:
        return None
    return int(m.group(1)) * (12 if m.group(2).startswith('a') else 1)


def _si_no(s):
    t = _norm(s)
    if t.startswith('SI') or t in ('S', 'YES'):
        return True
    if t.startswith('NO') or t in ('N',):
        return False
    return None


def _minuscula_inicial(s):
    return s[:1].lower() + s[1:] if s else s


def validar_y_contexto(ficha):
    f = {k: (v or '').strip() for k, v in ficha.get('campos', {}).items()}
    hall = []

    def H(campo, estado, detalle, bloquea=False, revision=True):
        hall.append({'campo': campo, 'estado': estado, 'detalle': detalle, 'bloquea': bloquea, 'revision': revision})

    def val(k):
        v = f.get(k, '')
        return '' if es_placeholder(v) else v

    # 1. Presencia por nivel
    for clave, sec, etq, nivel, _ay, _al in CAMPOS:
        if val(clave):
            continue
        if f.get(clave) and es_placeholder(f[clave]):
            det = f'Valor de relleno "{f[clave]}" → tratado como faltante'
        else:
            det = 'No consta en la ficha'
        if nivel == 'C':
            H(etq, 'INFORMACION_FALTANTE', det + ' (dato crítico).', bloquea=True)
        elif nivel == 'R':
            H(etq, 'INFORMACION_FALTANTE', det + ' (requerido por el modelo; queda resaltado en el contrato).')

    def ph(k):
        return val(k) or FALTA.format(CAMPO[k][2])

    p = cargar_parametros()
    c = {}

    # 2. Partes
    c['prop_razon_social'] = ph('prop_razon_social')
    c['prop_ruc'] = ph('prop_ruc')
    c['prop_domicilio'] = ph('prop_domicilio')
    c['repr_ci'] = ph('repr_ci')
    c['repr_facultades'] = ph('repr_facultades')
    trat = val('repr_tratamiento')
    c['repr_nombre'] = ph('repr_nombre')
    art_r = {'SR': 'el', 'SRA': 'la', 'SRTA': 'la'}.get(_norm(trat).replace(' ', ''), '')
    c['repr_presentacion'] = f"{(art_r + ' ') if art_r else ''}{(trat + ' ') if trat else ''}{c['repr_nombre']}, en su carácter de {ph('repr_caracter')}"

    trat_i = val('inq_tratamiento')
    art = {'SR': 'el', 'SRA': 'la', 'SRTA': 'la'}.get(_norm(trat_i).replace(' ', ''), '')
    partes = [f"{(art + ' ') if art else ''}{(trat_i + ' ') if trat_i else ''}**{ph('inq_nombre')}**",
              f"de nacionalidad {ph('inq_nacionalidad')}"]
    if val('inq_estado_civil'):
        partes.append(f"de estado civil {val('inq_estado_civil').lower()}")
    if val('inq_fecha_nac'):
        partes.append(f"con fecha de nacimiento {val('inq_fecha_nac')}")
    if val('inq_lugar_nac'):
        partes.append(f"lugar de nacimiento {val('inq_lugar_nac')}")
    doc = ph('inq_documento')
    es_pasaporte = 'PASAPORTE' in _norm(doc)
    partes.append(f"titular del {doc}" if es_pasaporte else f"con {doc}")
    if val('inq_pais_emisor'):
        partes.append(f"emitido por {val('inq_pais_emisor')}")
    elif es_pasaporte:
        H('País emisor del pasaporte', 'PENDIENTE_DE_CONFIRMACION', 'No consta; no se deduce de la nacionalidad. El contrato no lo menciona.', revision=False)
    if val('inq_nro_personal'):
        partes.append(f"número personal {val('inq_nro_personal')}")
    ev = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', val('inq_exp_venc'))
    if len(ev) == 2:
        partes.append(f"expedido el {ev[0]} y con vencimiento el {ev[1]}")
        venc_doc = _fecha(ev[1])
        fin_d = _fecha(val('fin'))
        if venc_doc and fin_d and venc_doc < fin_d:
            H('Vencimiento del documento', 'REVISION_REQUERIDA', f'El documento del locatario vence ({ev[1]}) antes del fin del contrato.')
    if val('inq_ruc'):
        partes.append(f"RUC N.º {val('inq_ruc')}")
    if val('inq_domicilio'):
        partes.append(f"con domicilio en {val('inq_domicilio')}")
    partes.append(f"teléfono N.º {ph('inq_tel')}")
    partes.append(f"correo electrónico {ph('inq_email')}")
    c['inq_presentacion'] = ', '.join(partes)
    c['inq_nombre'] = ph('inq_nombre')
    c['inq_documento'] = doc
    c['inq_email'] = ph('inq_email')
    c['inq_tel'] = ph('inq_tel')

    cod = _si_no(f.get('posee_codeudor', ''))
    if cod is True:
        H('Codeudor', 'REVISION_REQUERIDA', 'La ficha indica codeudor y el modelo vigente no tiene cláusulas de codeudor. '
          'Requiere cláusula aprobada antes de generar.', bloquea=True)
    elif cod is None and val('posee_codeudor'):
        H('Codeudor', 'INCONSISTENCIA', f'Valor no interpretable: "{f["posee_codeudor"]}" (usar SI / NO).', bloquea=True)

    # 3. Inmueble
    c['inm_edificio'] = ph('inm_edificio')
    c['inm_direccion'] = ph('inm_direccion')
    c['inm_ctacte'] = ph('inm_ctacte')
    c['inm_nis'] = ph('inm_nis')
    coch = val('inm_cochera')
    if coch and _si_no(coch) is False:
        c['tiene_cochera'] = False
        cochera_txt = ''
    else:
        c['tiene_cochera'] = True
        num = re.sub(r'^(cochera\s*)?(n[°º\.]*\s*º?)?\s*', '', coch, flags=re.I) if coch else ''
        cochera_txt = f" y Cochera N.º {num}" if coch else f" y Cochera {FALTA.format('Cochera (N° o NO)')}"
    c['cochera_txt'] = cochera_txt
    unidad = ph('inm_unidad')
    c['unidad_y_cochera'] = unidad + cochera_txt
    c['inmueble_titulo'] = f"{c['inm_edificio']} – {unidad}{cochera_txt}"
    ciudad_pais = ', '.join(val('inm_direccion').split(',')[1:]).strip() if ',' in val('inm_direccion') else ''
    c['inmueble_ref'] = f"{c['inm_edificio']}, {unidad}{cochera_txt}" + (f" – {ciudad_pais}" if ciudad_pais else '')
    po = _si_no(f.get('inm_primera_ocupacion', ''))
    c['primera_ocupacion'] = bool(po)
    cond = val('inm_condicion')
    if cond and 'AMOBLAD' not in _norm(cond) or 'NO AMOBLAD' in _norm(cond):
        H('Condición del inmueble', 'REVISION_REQUERIDA', f'"{cond}": el modelo vigente es para inmueble amoblado.', bloquea=True)
    dest = val('inm_destino')
    if dest:
        d0 = _minuscula_inicial(dest)
        c['inm_destino'] = d0 if re.match(r'^(a |al |principalmente|exclusivamente)', d0) else 'a ' + d0
    else:
        c['inm_destino'] = FALTA.format('Destino')
    ad = _si_no(f.get('inm_autoriza_domicilio', ''))
    c['autoriza_domicilio'] = bool(ad)
    if ad is None and val('inm_autoriza_domicilio'):
        H('Autoriza domicilio fiscal/comercial', 'REVISION_REQUERIDA',
          f'Valor no interpretable ("{val("inm_autoriza_domicilio")}", usar SI / NO): se omitió el párrafo de autorización de domicilio fiscal/comercial (Cláusula SÉPTIMA).')

    # 4. Económicas
    mon, canon = _monto(val('canon'))
    if val('canon') and canon is None:
        H('Canon mensual', 'INCONSISTENCIA', f'No se pudo leer un importe en "{val("canon")}".', bloquea=True)
    if canon is not None and mon != 'USD':
        H('Moneda', 'REVISION_REQUERIDA', 'El modelo vigente está redactado en USD (con opción de pago en guaraníes).', bloquea=True)
    if canon is not None:
        c['canon_corto'] = f'USD {N.monto(canon)}'
        c['canon_txt'] = f'USD {N.monto(canon)} ({N.monto_letras(canon)})'
        diario = N.redondear(canon / Decimal(p['ocupacion_posterior_divisor_dias']))
        pen = N.redondear(diario * Decimal(p['ocupacion_posterior_penalidad_pct']) / 100)
        c['canon_diario'] = f'USD {N.monto(diario)}'
        c['penalidad_diaria_ocupacion'] = f'USD {N.monto(pen)}'
        c['maximo_diario_ocupacion'] = f'USD {N.monto(diario + pen)}'
        c['tope_penalidad'] = f"USD {N.monto(canon * Decimal(p['tope_penalidad_pct_del_canon']) / 100)}"
    else:
        for k in ('canon_corto', 'canon_txt', 'canon_diario', 'penalidad_diaria_ocupacion', 'maximo_diario_ocupacion', 'tope_penalidad'):
            c[k] = FALTA.format('Canon mensual')
    iva = val('iva')
    if iva and 'INCLUID' not in _norm(iva):
        H('IVA', 'REVISION_REQUERIDA', f'"{iva}": el modelo vigente solo cubre IVA incluido en el canon.', bloquea=True)
    exp = val('expensas')
    if exp and 'INCLUID' not in _norm(exp):
        H('Expensas', 'REVISION_REQUERIDA', f'"{exp}": el modelo vigente solo cubre expensas ordinarias incluidas.', bloquea=True)
    tasa = val('iva_tasa')
    m = re.search(r'(\d+)\s*%', tasa)
    c['iva_tasa'] = f'{m.group(1)}%' if m else FALTA.format('Tasa de IVA')
    if m and dest:
        t = int(m.group(1)); dn = _norm(dest)
        esperado = 10 if ('COMERCIAL' in dn or 'TEMPORAL' in dn or 'OFICINA' in dn) else (5 if 'VIVIENDA' in dn else None)
        if esperado and t != esperado:
            H('Tasa de IVA vs. destino', 'INCONSISTENCIA', f'Destino "{dest}" y tasa {t}%: según D-001/D-045 correspondería {esperado}%. Confirmar con la contadora.')
    if val('reajuste') and not re.search(r'\bNO\b', _norm(val('reajuste'))):
        H('Reajuste', 'REVISION_REQUERIDA', f'"{val("reajuste")}": el modelo fija el canon durante el plazo original.', bloquea=True)
    for k, etq in (('serv_energia', 'Servicios energéticos'), ('internet', 'Internet')):
        if val(k) and 'INQUILIN' not in _norm(val(k)) and 'LOCATARI' not in _norm(val(k)):
            H(etq, 'REVISION_REQUERIDA', f'"{val(k)}": el modelo los pone a cargo del locatario.', bloquea=True)

    dmon, dep = _monto(val('deposito'))
    if dep is not None:
        c['deposito_txt'] = f'USD {N.monto(dep)} ({N.monto_letras(dep)})'
        c['deposito_corto'] = f'USD {N.monto(dep)}'
        if canon:
            meses = dep / canon
            if meses == meses.to_integral_value():
                n = int(meses)
                c['deposito_meses_txt'] = f"{N.letras(n)} ({n}) {'mes' if n == 1 else 'meses'}"
            else:
                c['deposito_meses_txt'] = FALTA.format('equivalencia del depósito en meses')
                H('Depósito', 'INCONSISTENCIA', f'USD {N.monto(dep)} no equivale a un número entero de cánones (USD {N.monto(canon)}).')
        decl = re.search(r'(\d+)\s*mes', val('deposito'))
        if decl and canon and Decimal(decl.group(1)) * canon != dep:
            H('Depósito', 'INCONSISTENCIA', f'La ficha dice "{val("deposito")}", pero {decl.group(1)} × canon ≠ depósito.', bloquea=True)
    else:
        c['deposito_txt'] = c['deposito_meses_txt'] = FALTA.format('Depósito en garantía')
        c['deposito_corto'] = None

    # 5. Plazo y fechas
    ff, ini, fin, meses = _fecha(val('fecha_firma')), _fecha(val('inicio')), _fecha(val('fin')), _meses(val('duracion'))
    for etq, raw, d in (('Fecha de firma', val('fecha_firma'), ff), ('Inicio', val('inicio'), ini), ('Finalización', val('fin'), fin)):
        if raw and not d:
            H(etq, 'INCONSISTENCIA', f'Fecha ilegible: "{raw}" (usar dd/mm/aaaa).', bloquea=True)
    if val('duracion') and not meses:
        H('Duración', 'INCONSISTENCIA', f'No se pudo leer la duración "{val("duracion")}".', bloquea=True)
    if ini and fin and meses:
        esperado = N.sumar_meses(ini, meses) - dt.timedelta(days=1)
        if esperado != fin:
            H('Plazo', 'INCONSISTENCIA', f'Inicio {ini:%d/%m/%Y} + {meses} meses termina el {esperado:%d/%m/%Y}, '
              f'pero la ficha dice {fin:%d/%m/%Y}. No se corrige automáticamente.', bloquea=True)
    if ini and fin and fin <= ini:
        H('Plazo', 'INCONSISTENCIA', 'La finalización es anterior o igual al inicio.', bloquea=True)
    c['fecha_firma_letras'] = N.fecha_comparecencia(ff) if ff else FALTA.format('Fecha de firma')
    c['fecha_cierre_letras'] = N.fecha_cierre(ff) if ff else FALTA.format('Fecha de firma')
    c['fecha_firma_larga'] = N.fecha_larga(ff) if ff else FALTA.format('Fecha de firma')
    c['inicio_largo'] = N.fecha_larga(ini) if ini else FALTA.format('Inicio')
    c['fin_largo'] = N.fecha_larga(fin) if fin else FALTA.format('Finalización')
    c['duracion_letras'] = f"{N.letras(meses)} ({meses}) {'mes' if meses == 1 else 'meses'}" if meses else FALTA.format('Duración')
    lugar = val('lugar_firma')
    c['lugar_firma'] = lugar or FALTA.format('Lugar de firma')
    c['ciudad_firma'] = lugar.split(',')[0].strip() if lugar else FALTA.format('Lugar de firma')
    venc = val('vencimiento')
    c['vencimiento'] = _minuscula_inicial(venc) if venc else FALTA.format('Vencimiento mensual')
    c['primer_pago'] = val('primer_pago')
    dias = [int(x) for x in re.findall(r'\b(\d{1,2})\b', venc)]
    if ini and dias and not c['primer_pago']:
        lo, hi = min(dias), max(dias)
        if not (lo <= ini.day <= hi):
            H('Primer pago', 'REVISION_REQUERIDA', f'El contrato inicia el día {ini.day} y el vencimiento es {venc.lower()}: '
              'definir en la ficha ("Primer pago") cuándo se paga el primer canon. El modelo hace devengar el canon desde la entrega formal.')

    # 6. Cuenta
    ben = val('cta_beneficiario')
    c['cta_beneficiario'] = ph('cta_beneficiario')
    filas = []
    for k, etq in (('cta_banco', 'Banco'), ('cta_dir_banco', 'Dirección del banco'), ('cta_beneficiario', 'Titular de la cuenta'),
                   ('cta_doc_titular', 'Documento del titular'), ('cta_moneda', 'Moneda / plataforma'), ('cta_tipo', 'Tipo de cuenta'),
                   ('cta_numero', 'Número de cuenta'), ('cta_routing', 'Routing (Wire/ACH)'), ('cta_swift', 'Código SWIFT/BIC'),
                   ('cta_iban', 'IBAN')):
        if val(k) or CAMPO[k][3] == 'C':
            filas.append((etq, ph(k)))
    c['cuenta_filas'] = filas
    rs = _norm(val('prop_razon_social')).replace(' S A', '').replace(' SA', '').strip()
    bn = _norm(ben).replace(' S A', '').replace(' SA', '').strip()
    c['cuenta_de_tercero'] = bool(ben) and bn != rs
    if c['cuenta_de_tercero']:
        mixto = rs and rs in bn
        H('Cuenta receptora', 'CUENTA_DE_TERCERO: SI',
          f'Titular "{ben}" ≠ propietario. Se incluyó la cláusula de designación, autorización y efecto cancelatorio.'
          + (' El titular mezcla a la sociedad con una persona física: confirmar quién es el titular real de la cuenta.' if mixto else '')
          + ' Fiscal: la factura la emite el propietario aunque el cobro entre a cuenta de un tercero → contadora.',
          revision=bool(mixto))

    # 7. Contactos / notificaciones
    for k in ('contacto_principal', 'contacto_alternativo', 'contacto_admin', 'prop_email_notif', 'prop_tel_notif'):
        c[k] = ph(k)

    # 8. Reglas de texto libre de la ficha ("No incorporar a X como parte")
    excluidos = []
    for r in ficha.get('reglas', []):
        m2 = re.search(r'no incorporar a (.+?) como', r, re.I)
        if m2:
            excluidos.append(m2.group(1).strip())
    c['_excluidos'] = excluidos

    # 9. Anexos
    pend = [a for a in ficha.get('anexos', []) if 'PENDIENTE' in _norm(a.get('estado', ''))]
    inv = ficha.get('inventario', [])
    c['inventario'] = inv
    if not inv and not any('ANEXO I' in _norm(a['documento']) and 'ANEXO II' not in _norm(a['documento']) for a in pend):
        pend.append({'documento': 'Anexo I – Inventario', 'estado': 'PENDIENTE_DOCUMENTAL', 'observacion': 'Sin ítems en la ficha.'})
    c['_pendientes_documentales'] = pend
    c['_ficha'] = {k: val(k) for k in CAMPO}
    c['_canon'], c['_deposito'] = canon, dep
    return c, hall, p
