#!/usr/bin/env python3
"""
Servidor de la app funcional de Meridiano Capital.

Sirve el frontend estatico (production/app/frontend/) y expone una API JSON minima que
envuelve la Calculadora de rentabilidad ya existente (calculadora.py, sin
modificar su logica) y recibe envios reales del formulario de contacto.

Deliberadamente stdlib-only (http.server): corre con cualquier Python 3.8+
sin instalar dependencias.

Uso:
    python server.py            # sirve en http://localhost:8000
    python server.py 8080       # puerto custom
"""

import json
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
from calculadora import Calculadora  # noqa: E402
from advertencias import advertencias_renta, advertencias_venta  # noqa: E402

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = Path(__file__).resolve().parent / "data"
CONTACTOS_FILE = DATA_DIR / "contactos.jsonl"
CALC_LEADS_FILE = DATA_DIR / "calculadora_leads.jsonl"

calc = Calculadora()


def _notificar_crm(entrada):
    """
    Punto de integracion preparado para notificar un CRM cuando llega un
    contacto nuevo -- hoy es un no-op deliberado.

    PENDIENTE (ver governance/decisions/DECISION_REGISTER.md#D-048 y
    documentation/website-audit/WEBSITE-ROADMAP.md, Fase 01 item 4):
    el founder confirmo (2026-08-10) que la notificacion de leads va a
    ser via integracion con un CRM, todavia sin elegir. Mientras no se
    elija, cada lead sigue guardandose de forma confiable en su archivo
    local (CONTACTOS_FILE via _guardar_contacto, CALC_LEADS_FILE via
    _guardar_lead_calculadora desde Fase 04 item 13) -- esta funcion no
    debe fallar silenciosamente ni bloquear ese guardado si se implementa
    mas adelante y el CRM no responde. "entrada" trae un campo "origen"
    ("formulario_contacto" | "calculadora_rentabilidad") para que el CRM
    elegido pueda distinguir la fuente del lead.

    Cuando se elija el CRM, implementar aca la llamada real (API REST,
    webhook, etc.) y quitar el "pass". No inventar un proveedor ni una
    integracion sin que el founder confirme cual CRM se usa.
    """
    pass


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.end_headers()
    handler.wfile.write(body)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    # ---- CORS preflight ----
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # ---- GET: API de solo lectura + archivos estaticos ----
    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/parametros":
            return json_response(self, 200, calc.p)

        if path == "/api/salud":
            return json_response(self, 200, {"estado": "ok"})

        self._serve_static(path)

    # ---- POST: calculos y formulario de contacto ----
    def do_POST(self):
        path = urlparse(self.path).path
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            body = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError):
            return json_response(self, 400, {"error": "JSON invalido en el body."})

        try:
            if path == "/api/calcular/renta":
                # WEBSITE-ROADMAP.md Fase 04, item 13: el sitio pide email antes de
                # mostrar el resultado. "email" no es un parametro de evaluar_renta
                # (calculadora.py no se toca) -- se extrae del body antes de llamarla
                # y, si vino, se guarda como lead. La API sigue funcionando sin email
                # para otros consumidores (skill de CLI, tests) que no pasan por el
                # formulario del sitio.
                email = (body.pop("email", "") or "").strip()
                resultado = calc.evaluar_renta(**body)
                resultado["advertencias"] = advertencias_renta(calc, body.get("clase", ""), resultado)
                if email:
                    self._guardar_lead_calculadora(email, body, resultado)
                return json_response(self, 200, resultado)

            if path == "/api/calcular/reventa":
                resultado = calc.evaluar_reventa(**body)
                resultado["advertencias"] = advertencias_venta()
                return json_response(self, 200, resultado)

            if path == "/api/calcular/reventa-temprana":
                resultado = calc.evaluar_reventa_temprana(**body)
                resultado["advertencias"] = advertencias_venta()
                return json_response(self, 200, resultado)

            if path == "/api/calcular/combinado":
                return json_response(self, 200, calc.evaluar_retorno_combinado(**body))

            if path == "/api/contacto":
                return self._guardar_contacto(body)

        except TypeError as e:
            return json_response(self, 400, {"error": f"Parametros invalidos: {e}"})
        except KeyError as e:
            return json_response(self, 400, {"error": f"Falta parametro o clave de config: {e}"})

        json_response(self, 404, {"error": "Ruta no encontrada."})

    # ---- Contacto: persiste a un archivo local real (JSON Lines) ----
    def _guardar_contacto(self, body):
        nombre = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip()
        if not nombre or not email:
            return json_response(self, 400, {"error": "Nombre y email son obligatorios."})

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        entrada = {
            "origen": "formulario_contacto",
            "recibido_en": datetime.now(timezone.utc).isoformat(),
            "name": nombre,
            "email": email,
            "country": body.get("country", ""),
            # WEBSITE-ROADMAP.md Fase 04, item 11: segmentacion por tipo de consulta,
            # 4 categorias confirmadas por el founder el 2026-08-10. Opcional en el
            # backend (no bloquea el guardado) aunque el frontend lo pide siempre.
            "tipo_consulta": body.get("tipo_consulta", ""),
            "message": body.get("message", ""),
        }
        with open(CONTACTOS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entrada, ensure_ascii=False) + "\n")

        _notificar_crm(entrada)

        json_response(self, 200, {"ok": True})

    # ---- Calculadora: lead capturado antes de mostrar el resultado (Fase 04, item 13) ----
    def _guardar_lead_calculadora(self, email, payload_calculo, resultado):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        entrada = {
            "origen": "calculadora_rentabilidad",
            "recibido_en": datetime.now(timezone.utc).isoformat(),
            "email": email,
            "clase": payload_calculo.get("clase", ""),
            "precio_compra": payload_calculo.get("precio_compra"),
            "renta_mensual_bruta": payload_calculo.get("renta_mensual_bruta"),
            "nivel_neto": payload_calculo.get("nivel_neto"),
            "yield_bruto_pct": resultado.get("yield_bruto_pct"),
            "yield_neto_pct": resultado.get("yield_neto_pct"),
        }
        with open(CALC_LEADS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entrada, ensure_ascii=False) + "\n")

        _notificar_crm(entrada)

    # ---- Estaticos ----
    def _serve_static(self, path):
        if path == "/":
            path = "/index.html"
        file_path = (FRONTEND_DIR / path.lstrip("/")).resolve()

        if FRONTEND_DIR not in file_path.parents and file_path != FRONTEND_DIR:
            return json_response(self, 403, {"error": "Prohibido."})
        if not file_path.exists() or file_path.is_dir():
            return json_response(self, 404, {"error": "No encontrado."})

        content_type = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".svg": "image/svg+xml",
            ".json": "application/json; charset=utf-8",
            ".png": "image/png",
            # WEBSITE-ROADMAP.md Fase 09, item 26 (2026-08-11): sitemap.xml/robots.txt
            # faltaban aca -- caian a application/octet-stream (fuerza descarga en vez
            # de mostrarse como texto), lo que rastreadores como Googlebot no esperan.
            ".xml": "application/xml; charset=utf-8",
            ".txt": "text/plain; charset=utf-8",
        }.get(file_path.suffix, "application/octet-stream")

        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Meridiano Capital — app funcional corriendo en http://localhost:{port}")
    print(f"Frontend: {FRONTEND_DIR}")
    print(f"Config de mercado: {BASE_DIR / 'config' / 'parametros_mercado.json'}")
    print("Ctrl+C para detener.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDetenido.")


if __name__ == "__main__":
    main()
