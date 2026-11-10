"""Regenera los 5 entregables del Edificio Catedral en ../entregables/ (D-097).

Orden: modelo → PPTX (kit de la skill, production/generadores) → PDF desde el PPTX final →
Excel con fórmulas → control interno y respuestas del asesor.
Lo invoca build_presentaciones.py para cualquier deck con fuente/build_entregables.py.
Variables opcionales: MC_DECK_KIT (ruta al kit de la skill) y NODE_PATH.
"""
import os, sys, shutil, subprocess, tempfile

B = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(B, '..', '..', '..', '..', '..'))
GEN = os.path.join(REPO, 'production', 'generadores')
OUT = os.path.join(B, '..', 'entregables')
PPTX = os.path.join(OUT, 'Edificio_Catedral_Meridiano_FINAL.pptx')


def run(cmd, **kw):
    subprocess.run(cmd, check=True, **kw)


run([sys.executable, 'model.py'], cwd=B, stdout=subprocess.DEVNULL)
env = dict(os.environ, NODE_PATH=os.pathsep.join(p for p in (os.path.join(GEN, 'node_modules'), os.environ.get('NODE_PATH')) if p))
run(['node', 'build_edificio_catedral_presentacion.js'], cwd=GEN, env=env, stdout=subprocess.DEVNULL)
with tempfile.TemporaryDirectory() as tmp:  # perfil aislado de LibreOffice: no se cuelga sin pantalla
    run(['soffice', f'-env:UserInstallation=file://{tmp}/perfil', '--headless', '--convert-to', 'pdf', '--outdir', tmp, PPTX],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=300)
    shutil.copyfile(os.path.join(tmp, os.path.basename(PPTX).replace('.pptx', '.pdf')), PPTX.replace('.pptx', '.pdf'))
run([sys.executable, 'build_excel.py'], cwd=B, stdout=subprocess.DEVNULL)
run([sys.executable, 'build_docs.py'], cwd=B, stdout=subprocess.DEVNULL)
print('  ✓ edificio-catedral/entregables (PPTX, PDF, XLSX, control interno, respuestas)')
