#!/usr/bin/env python3
"""WF-04 · Generador de contratos de locación desde la Ficha Maestra.

Uso (desde la raíz del repo o desde esta carpeta):
  python workflows/contrato-locacion/generar_contrato.py FICHA.docx --salida CARPETA
  python workflows/contrato-locacion/generar_contrato.py --plantilla-ficha FICHA_EN_BLANCO.docx
  python workflows/contrato-locacion/generar_contrato.py FICHA_v1.docx --migrar FICHA_v2.docx

Salida: CONTRATO_<ref>.docx (contrato + Anexos I–V con membrete), CONTROL_<ref>.docx
(validación, control final, pendientes, alertas) y control_<ref>.json.
La ficha y los contratos tienen PII: NUNCA guardarlos dentro del repo (governance/PII_POLICY.md).
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from motor import ficha as F                     # noqa: E402
from motor.validacion import validar_y_contexto  # noqa: E402
from motor import documento as D                 # noqa: E402
from motor.ficha import _norm                    # noqa: E402

REPO = Path(__file__).resolve().parents[2]


def _dentro_del_repo(p: Path):
    try:
        p.resolve().relative_to(REPO)
        return True
    except ValueError:
        return False


def control_final(c, txt, hall):
    """CONTROL_FINAL_CONTRATO(): contrato generado vs. ficha, campo por campo."""
    f = c['_ficha']
    chk = []

    def ok(nombre, cond, det=''):
        chk.append({'control': nombre, 'ok': bool(cond), 'detalle': det})

    def norm_esp(s):
        return re.sub(r'\s+', ' ', s or '')
    T = norm_esp(txt)
    for k in ('prop_razon_social', 'prop_ruc', 'repr_nombre', 'repr_ci', 'repr_facultades', 'inq_nombre', 'inq_documento',
              'inq_nacionalidad', 'inq_email', 'inq_tel', 'inm_edificio', 'inm_unidad', 'inm_direccion', 'inm_ctacte', 'inm_nis',
              'cta_beneficiario', 'cta_banco', 'cta_numero', 'cta_routing', 'cta_swift', 'cta_iban', 'cta_doc_titular',
              'contacto_principal', 'contacto_alternativo', 'contacto_admin', 'prop_email_notif', 'prop_tel_notif'):
        v = f.get(k)
        if v:
            ok(f'Ficha → contrato: {F.CAMPO[k][2]}', norm_esp(v) in T, v)
    for k in ('canon_corto', 'deposito_corto', 'inicio_largo', 'fin_largo', 'iva_tasa'):
        v = c.get(k)
        if v and not v.startswith('⟦'):
            ok(f'Valor derivado presente: {k}', v in T, v)
    # Montos: todo "USD x" del contrato debe ser un importe calculado por el motor
    permitidos = {c.get(k) for k in ('canon_corto', 'deposito_corto', 'canon_diario', 'penalidad_diaria_ocupacion',
                                     'maximo_diario_ocupacion', 'tope_penalidad')}
    encontrados = set('USD ' + m for m in re.findall(r'USD ([\d\.]+(?:,\d{2})?)', T))
    ok('Montos: sin importes ajenos a la ficha/modelo', encontrados <= permitidos, ', '.join(sorted(encontrados)))
    ok('Codeudor/fiador/garante ausentes', not re.search(r'\b(codeudor|fiador|garante)\b', T, re.I))
    for nombre in c['_excluidos']:
        ok(f'Excluido por la ficha no figura: {nombre}', _norm(nombre) not in _norm(T))
    ok('Nunca "cuenta del propietario"', 'cuenta del propietario' not in T.lower())
    if c['cuenta_de_tercero']:
        ok('Cuenta de tercero: designación + efecto cancelatorio', 'efecto cancelatorio' in T and 'autoriza expresamente a su titular' in T)
    ok('Reajuste: canon fijo en el plazo original', 'El canon permanecerá fijo durante el plazo original' in T)
    ok('Firmas: propietario y locatario', T.count('EL PROPIETARIO') > 0 and T.count('EL LOCATARIO') > 0)
    ok('Anexo I referenciado', 'ANEXO I' in T)
    marcas = re.findall(r'⟦(.+?)⟧', T)
    return chk, marcas


def estados(hall, chk, marcas, c):
    if any(h['bloquea'] for h in hall):
        ficha_e, contrato_e = 'FICHA_PENDIENTE_DE_DATOS', 'CONTRATO_NO_GENERABLE'
    else:
        ficha_e = 'FICHA_VALIDADA'
        if any(not x['ok'] for x in chk):
            contrato_e = 'CONTRATO_BORRADOR'
        elif marcas or any(h['revision'] for h in hall):
            contrato_e = 'CONTRATO_APTO_PARA_REVISION'
        else:
            contrato_e = 'CONTRATO_APTO_PARA_FIRMA'
    exp_e = 'EXPEDIENTE_CON_PENDIENTES_DOCUMENTALES' if c['_pendientes_documentales'] else 'EXPEDIENTE_DOCUMENTALMENTE_CERRADO'
    return ficha_e, contrato_e, exp_e


def informe(path, ref, ficha, hall, chk, marcas, est, c, archivos):
    from docx.enum.text import WD_ALIGN_PARAGRAPH as A
    d = D.nuevo_documento()
    D.parrafo(d, 'CONTROL DE EXPEDIENTE DE LOCACIÓN — WF-04', A.CENTER, 14, True)
    D.parrafo(d, f"{c['inmueble_titulo']} · Locatario: {c['inq_nombre']} · Ref.: {ref}", A.CENTER, 10)
    D.parrafo(d, '**A. ESTADOS**', A.LEFT)
    D._tabla(d, ['Elemento', 'Estado'], [['Ficha Maestra', est[0]], ['Contrato', est[1]], ['Expediente', est[2]]], [5, 11.5], 10)
    if ficha.get('estado_declarado'):
        D.parrafo(d, f"Estado declarado en la ficha: {ficha['estado_declarado']}", A.LEFT, 9)
    D.parrafo(d, '**B. VALIDACION_FICHA() — hallazgos**', A.LEFT)
    if hall:
        D._tabla(d, ['Campo', 'Estado', 'Detalle', 'Efecto'],
                 [[h['campo'], h['estado'], h['detalle'], 'BLOQUEA' if h['bloquea'] else ('Revisión' if h['revision'] else 'Informativo')]
                  for h in hall], [3.5, 3.5, 7.5, 2], 8.5)
    else:
        D.parrafo(d, 'Sin hallazgos: todos los datos requeridos por el modelo están en la ficha y son coherentes.')
    D.parrafo(d, '**C. CONTROL_FINAL_CONTRATO()**', A.LEFT)
    if chk:
        D._tabla(d, ['Control', 'Resultado', 'Detalle'], [[x['control'], 'OK' if x['ok'] else 'FALLA', x['detalle']] for x in chk],
                 [7, 1.8, 7.7], 8.5)
        D.parrafo(d, f"Resultado: {sum(x['ok'] for x in chk)} de {len(chk)} controles OK.", A.LEFT, 10)
    else:
        D.parrafo(d, 'No se generó contrato: el control final no aplica.')
    D.parrafo(d, '**D. PUNTOS RESALTADOS EN EL CONTRATO (definir antes de firmar)**', A.LEFT)
    for m in dict.fromkeys(marcas):
        D.parrafo(d, '• ' + m, A.LEFT, 10, after=2)
    if not marcas:
        D.parrafo(d, 'Ninguno.', A.LEFT, 10)
    D.parrafo(d, '**E. PENDIENTES DOCUMENTALES**', A.LEFT)
    for a in c['_pendientes_documentales']:
        D.parrafo(d, f"• {a['documento']}: PENDIENTE_DOCUMENTAL. {a.get('observacion', '')}", A.LEFT, 10, after=2)
    if not c['_pendientes_documentales']:
        D.parrafo(d, 'Ninguno.', A.LEFT, 10)
    if ficha.get('reglas'):
        D.parrafo(d, '**F. REGLAS ESCRITAS EN LA FICHA (para verificación humana)**', A.LEFT)
        for r in ficha['reglas']:
            D.parrafo(d, '• ' + r, A.LEFT, 9, after=1)
    if ficha.get('no_reconocidos'):
        D.parrafo(d, '**G. FILAS DE LA FICHA NO RECONOCIDAS (no se usaron)**', A.LEFT)
        for r in ficha['no_reconocidos']:
            D.parrafo(d, '• ' + r, A.LEFT, 9, after=1)
    D.parrafo(d, '**H. ARCHIVOS**', A.LEFT)
    for a in archivos:
        D.parrafo(d, '• ' + a, A.LEFT, 10, after=1)
    D.parrafo(d, 'MERIDIANO acompaña y coordina: la validación jurídica final corresponde al abogado o escribano, '
                 'y el tratamiento fiscal a la contadora.', A.LEFT, 9)
    d.save(path)


def generar(ficha_path, salida, ref=None, permitir_repo=False):
    salida = Path(salida)
    if _dentro_del_repo(salida) and not permitir_repo:
        sys.exit(f'ERROR: {salida} está dentro del repo. La ficha y el contrato tienen PII: elegí una carpeta fuera del repo.')
    salida.mkdir(parents=True, exist_ok=True)
    ficha = F.leer(ficha_path)
    c, hall, p = validar_y_contexto(ficha)
    ref = ref or ficha['campos'].get('id_expediente') or re.sub(r'[^A-Za-z0-9]+', '_', f"{c['_ficha'].get('inm_unidad', '')}_{c['_ficha'].get('inq_nombre', '')}").strip('_')[:60] or 'EXPEDIENTE'
    archivos, chk, marcas = [], [], []
    bloqueado = any(h['bloquea'] for h in hall)
    contrato = salida / f'CONTRATO_{ref}.docx'
    if not bloqueado:
        D.renderizar(c, p, contrato)
        txt = D.texto_docx(contrato)
        chk, marcas = control_final(c, txt, hall)
        archivos.append(contrato.name)
    est = estados(hall, chk, marcas, c)
    if bloqueado and contrato.exists():
        contrato.unlink()
    control = salida / f'CONTROL_{ref}.docx'
    archivos.append(control.name)
    informe(control, ref, ficha, hall, chk, marcas, est, c, archivos + [f'control_{ref}.json'])
    res = {'ref': ref, 'ficha': est[0], 'contrato': est[1], 'expediente': est[2], 'hallazgos': hall,
           'control_final': chk, 'resaltados': list(dict.fromkeys(marcas)),
           'pendientes_documentales': c['_pendientes_documentales'], 'archivos': archivos}
    (salida / f'control_{ref}.json').write_text(json.dumps(res, ensure_ascii=False, indent=1, default=str), encoding='utf-8')
    return res


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('ficha', nargs='?', help='Ficha Maestra (.docx o .json)')
    ap.add_argument('--salida', help='Carpeta de salida (fuera del repo)')
    ap.add_argument('--ref', help='Referencia del expediente para los nombres de archivo')
    ap.add_argument('--plantilla-ficha', help='Escribe la Ficha Maestra v2 en blanco en esta ruta y termina')
    ap.add_argument('--migrar', help='Escribe la ficha leída en formato v2 (prellenada) en esta ruta y termina')
    a = ap.parse_args()
    if a.plantilla_ficha:
        F.escribir_docx(a.plantilla_ficha); print('Ficha v2 en blanco:', a.plantilla_ficha); return
    if not a.ficha:
        ap.error('falta la ficha')
    if a.migrar:
        if _dentro_del_repo(Path(a.migrar)):
            sys.exit('ERROR: la ficha prellenada tiene PII; guardala fuera del repo.')
        fi = F.leer(a.ficha)
        vals = {k: v for k, v in fi['campos'].items() if not F.es_placeholder(v)}
        vals['_anexos'] = fi['anexos']
        vals['_reglas'] = fi.get('reglas', [])
        F.escribir_docx(a.migrar, vals); print('Ficha migrada a v2:', a.migrar); return
    if not a.salida:
        ap.error('falta --salida')
    r = generar(a.ficha, a.salida, a.ref)
    print(f"FICHA: {r['ficha']}\nCONTRATO: {r['contrato']}\nEXPEDIENTE: {r['expediente']}")
    for h in r['hallazgos']:
        print(f"  - [{h['estado']}] {h['campo']}: {h['detalle']}" + ('  (BLOQUEA)' if h['bloquea'] else ''))
    if r['control_final']:
        print(f"Control final: {sum(x['ok'] for x in r['control_final'])}/{len(r['control_final'])} OK")
        for x in r['control_final']:
            if not x['ok']:
                print('  FALLA:', x['control'], x['detalle'])
    print('Archivos:', ', '.join(r['archivos']), '→', a.salida)
    sys.exit(0 if r['contrato'] != 'CONTRATO_NO_GENERABLE' else 2)


if __name__ == '__main__':
    main()
