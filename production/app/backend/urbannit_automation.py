"""
Automatizacion de las propuestas de Urbannit para propietarios (D-057, 2026-08-12).

Cuando llega un contacto real por el formulario del sitio con
tipo_consulta == "gestion" ("Gestión de mi propiedad" — la categoria de Urbannit,
D-051), este modulo genera automaticamente, en segundo plano, las dos propuestas
personalizadas (Urbannit_Propuesta_Propietarios y Urbannit_Propuesta_Gestion_Temporal)
con el nombre real del contacto, en .docx y .pdf, listas para enviar.

Alcance deliberado de este ciclo (confirmado por el founder, 2026-08-12): se prepara
la GENERACION automatica del documento personalizado. El ENVIO real por email queda
pendiente -- mismo patron que el punto de integracion de CRM (D-048, server.py
_notificar_crm()): no se inventa un servicio de email sin que el founder elija uno.
Cada generacion se registra en urbannit_docs_generados.jsonl con "enviado": false.

Requisitos de entorno para que esto funcione en produccion (no bloqueantes para el
resto del sitio si faltan -- se detectan y se degradan con un log claro, nunca con
una excepcion que tumbe el request handler):
- Node.js (para correr los generadores docx.js de production/generadores/)
- LibreOffice (soffice, para convertir .docx a .pdf)
Si el hosting real (GoDaddy, D-055) no trae ninguno de los dos preinstalado, hay que
instalarlos ahi o mover esta automatizacion a un worker aparte -- fuera del alcance
de este modulo, que solo la ejecuta si estan disponibles.
"""

import json
import re
import shutil
import subprocess
import threading
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
GENERADORES_DIR = BACKEND_DIR.parent.parent / "generadores"
DATA_DIR = BACKEND_DIR / "data"
OUTPUT_ROOT = DATA_DIR / "urbannit_docs_generados"
MANIFEST_FILE = DATA_DIR / "urbannit_docs_generados.jsonl"

GENERADOR_PROPIETARIOS = "build_urbannit_propuesta_propietarios.js"
GENERADOR_GESTION_TEMPORAL = "build_urbannit_propuesta_gestion_temporal.js"


def _slug(nombre):
    """Espejo del slug que ya hacen los generadores .js, para nombrar la carpeta
    de salida de forma legible -- no se usa para nada que toque un shell."""
    if not nombre:
        return "contacto"
    n = unicodedata.normalize("NFD", nombre)
    n = "".join(c for c in n if unicodedata.category(c) != "Mn")
    n = re.sub(r"[^a-zA-Z0-9]+", "_", n).strip("_")
    return (n or "contacto")[:60]


def _correr_generador(script, nombre, out_dir):
    """Invoca el generador .js con subprocess.run en forma de LISTA de argumentos
    (nunca shell=True con un string interpolado) -- el nombre viene de un formulario
    publico y no debe poder inyectar nada en un comando de shell."""
    node = shutil.which("node")
    if not node:
        return {"ok": False, "error": "node no disponible en este entorno"}
    try:
        res = subprocess.run(
            [node, script, nombre, str(out_dir)],
            cwd=str(GENERADORES_DIR),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if res.returncode != 0:
            return {"ok": False, "error": f"{script} salio con codigo {res.returncode}: {res.stderr.strip()[:400]}"}
        return {"ok": True, "stdout": res.stdout.strip()}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": f"{script} tardo mas de 60s, se aborto"}
    except Exception as e:  # nunca dejar que esto tumbe el hilo de fondo
        return {"ok": False, "error": f"{script}: {e}"}


_SOFFICE_FALLBACKS = [
    # shutil.which() solo busca en PATH -- en Windows, el instalador de LibreOffice
    # no siempre lo agrega al PATH del sistema (verificado en esta maquina de
    # desarrollo). Se prueban las rutas de instalacion default antes de rendirse.
    r"C:\Program Files\LibreOffice\program\soffice.exe",
    r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    "/usr/bin/soffice",
    "/usr/bin/libreoffice",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
]


def _encontrar_soffice():
    return (
        shutil.which("soffice")
        or shutil.which("libreoffice")
        or next((p for p in _SOFFICE_FALLBACKS if Path(p).exists()), None)
    )


def _convertir_a_pdf(docx_path, out_dir):
    soffice = _encontrar_soffice()
    if not soffice:
        return {"ok": False, "error": "LibreOffice (soffice) no disponible en este entorno"}
    try:
        res = subprocess.run(
            [soffice, "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), str(docx_path)],
            capture_output=True,
            text=True,
            timeout=60,
        )
        pdf_path = out_dir / (docx_path.stem + ".pdf")
        if res.returncode != 0 or not pdf_path.exists():
            return {"ok": False, "error": f"conversion a PDF fallo: {res.stderr.strip()[:400]}"}
        return {"ok": True, "pdf": str(pdf_path)}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "conversion a PDF tardo mas de 60s, se aborto"}
    except Exception as e:
        return {"ok": False, "error": f"conversion a PDF: {e}"}


def _generar_sincrono(nombre, email, origen_id=None):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc)
    carpeta = OUTPUT_ROOT / f"{timestamp.strftime('%Y%m%d_%H%M%S')}_{_slug(nombre)}"
    carpeta.mkdir(parents=True, exist_ok=True)

    resultado = {
        "recibido_en": timestamp.isoformat(),
        "nombre": nombre,
        "email": email,
        "origen_id": origen_id,
        "carpeta": str(carpeta),
        "documentos": [],
        "enviado": False,
        "nota": "Generacion automatica (D-057). Envio por email pendiente -- falta elegir "
                "servicio de correo, mismo patron que el CRM (D-048/U-026). Enviar manualmente "
                "por ahora desde la carpeta indicada.",
    }

    for script, etiqueta in [
        (GENERADOR_PROPIETARIOS, "Propuesta de trabajo para propietarios"),
        (GENERADOR_GESTION_TEMPORAL, "Propuesta de Gestión de Alquiler Temporal"),
    ]:
        doc_entry = {"etiqueta": etiqueta}
        gen = _correr_generador(script, nombre, carpeta)
        if not gen["ok"]:
            doc_entry["ok"] = False
            doc_entry["error"] = gen["error"]
            resultado["documentos"].append(doc_entry)
            continue

        # El .js imprime "OK: <ruta absoluta>" -- se toma de ahi en vez de reconstruir
        # el nombre de archivo en Python (una sola fuente de verdad para el slug).
        docx_path = None
        for line in gen["stdout"].splitlines():
            if line.startswith("OK:"):
                docx_path = Path(line[len("OK:"):].strip())
        if not docx_path or not docx_path.exists():
            doc_entry["ok"] = False
            doc_entry["error"] = "el generador no reporto la ruta del .docx generado"
            resultado["documentos"].append(doc_entry)
            continue

        doc_entry["docx"] = str(docx_path)
        pdf = _convertir_a_pdf(docx_path, carpeta)
        if pdf["ok"]:
            doc_entry["pdf"] = pdf["pdf"]
            doc_entry["ok"] = True
        else:
            doc_entry["ok"] = False
            doc_entry["error"] = pdf["error"]
        resultado["documentos"].append(doc_entry)

    with open(MANIFEST_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(resultado, ensure_ascii=False) + "\n")

    return resultado


def generar_propuestas_urbannit_en_segundo_plano(nombre, email, origen_id=None):
    """Punto de entrada real desde server.py. Nunca bloquea el request HTTP que la
    llama -- corre en un hilo de fondo, con su propio manejo de errores, para que
    una falla de Node/LibreOffice no afecte la respuesta "gracias por tu consulta"
    que ya recibio el usuario."""
    def _run():
        try:
            _generar_sincrono(nombre, email, origen_id)
        except Exception as e:
            # Ultima red de seguridad -- ni siquiera un error inesperado acá debe
            # propagarse fuera del hilo de fondo.
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            with open(MANIFEST_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps({
                    "recibido_en": datetime.now(timezone.utc).isoformat(),
                    "nombre": nombre, "email": email, "origen_id": origen_id,
                    "ok": False, "error": f"excepcion no manejada: {e}",
                }, ensure_ascii=False) + "\n")

    threading.Thread(target=_run, daemon=True).start()
