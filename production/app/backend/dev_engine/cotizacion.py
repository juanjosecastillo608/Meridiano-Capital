"""
Fuente de cotizacion USD/PYG real, conectada (cierra el pendiente de S53 del
prompt maestro "Development Cost & Financial Engine": "no hay una fuente de
cotizacion en tiempo real conectada todavia").

Fuente primaria elegida: open.er-api.com (respaldado por exchangerate-api.com),
actualizado diariamente, sin API key, gratuito -- Nivel 3 de la jerarquia de
`knowledge-base/investment/market-intelligence/sources/SOURCE_REGISTRY.md`
(agregador de mercado, no el Banco Central del Paraguay directamente). El sitio
del BCP (bcp.gov.py) es la fuente Nivel 1 preferible para Paraguay, pero no se
encontro un endpoint estable navegable por script en el tiempo disponible -- se
deja como pendiente real en el README, no oculto. `fuente_bcp_manual()` permite
cargar a mano la cotizacion oficial del BCP cuando el founder la tenga a la
vista, sin esperar a que se automatice.

Nunca se usa un valor sin fecha+fuente (S53) -- este modulo persiste ambos en el
cache junto con el valor, y `cargar_tipo_cambio()` rechaza un cache demasiado
viejo en vez de usarlo en silencio.
"""

import json
import os
import ssl
import urllib.request
from datetime import datetime, timezone

from .moneda import TipoDeCambio, ConversorMoneda

PARAMETROS_PATH_DEFAULT = os.path.join(
    os.path.dirname(__file__), "..", "..", "config", "parametros_dev_engine.json"
)

def _contexto_ssl():
    """
    Usa el CA bundle de certifi en vez del truststore del sistema -- en algunos
    entornos Windows/Python el truststore del sistema no valida correctamente
    cadenas de certificados modernas (falla con CERTIFICATE_VERIFY_FAILED aunque
    el sitio sea legitimo). Nunca se desactiva la verificacion SSL como atajo.
    """
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()

CACHE_PATH_DEFAULT = os.path.join(
    os.path.dirname(__file__), "..", "..", "config", "tipo_cambio_pyg_usd.json"
)
FUENTE_LIVE = "open.er-api.com (respaldado por exchangerate-api.com) -- Nivel 3, agregador de mercado, no BCP directo"


def obtener_cotizacion_live(timeout=10) -> dict:
    """
    Fetch en vivo. Devuelve {"valor": float, "fecha": "YYYY-MM-DD", "fuente": str,
    "actualizado_por_proveedor_utc": str}. Lanza excepcion si la fuente no responde
    o no incluye PYG -- nunca devuelve un valor inventado como respaldo silencioso.
    """
    url = "https://open.er-api.com/v6/latest/USD"
    with urllib.request.urlopen(url, timeout=timeout, context=_contexto_ssl()) as resp:
        datos = json.loads(resp.read().decode("utf-8"))
    if datos.get("result") != "success":
        raise RuntimeError(f"open.er-api.com no devolvio 'success': {datos}")
    pyg = datos.get("rates", {}).get("PYG")
    if pyg is None:
        raise RuntimeError("La respuesta de open.er-api.com no incluye PYG")
    return {
        "valor": float(pyg),
        "fecha": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "fuente": FUENTE_LIVE,
        "actualizado_por_proveedor_utc": datos.get("time_last_update_utc"),
    }


def fuente_bcp_manual(valor: float, fecha: str) -> dict:
    """
    Carga manual de la cotizacion oficial del BCP (Nivel 1) cuando el founder la
    tiene a la vista -- ver bcp.gov.py, seccion Estadisticas > Tipo de cambio.
    Uso: python3 -m dev_engine.refrescar_tipo_cambio --bcp 7250 2026-08-22
    """
    return {"valor": float(valor), "fecha": fecha,
             "fuente": "Banco Central del Paraguay (bcp.gov.py) -- Nivel 1, carga manual"}


def refrescar_cache(ruta_cache: str = CACHE_PATH_DEFAULT, dato: dict = None) -> str:
    """Escribe (o sobreescribe) el cache de cotizacion. `dato` opcional -- si no se
    pasa, hace fetch en vivo via obtener_cotizacion_live()."""
    dato = dato or obtener_cotizacion_live()
    os.makedirs(os.path.dirname(ruta_cache), exist_ok=True)
    with open(ruta_cache, "w", encoding="utf-8") as f:
        json.dump(dato, f, indent=2, ensure_ascii=False)
    return ruta_cache


def cargar_tipo_cambio(ruta_cache: str = CACHE_PATH_DEFAULT, max_antiguedad_dias: int = 7) -> TipoDeCambio:
    """
    Lee el cache y devuelve un TipoDeCambio listo para usar en ConversorMoneda.
    Rechaza (lanza FileNotFoundError/ValueError) si no hay cache o si esta vencido
    -- nunca reusa en silencio un valor stale mas alla del limite declarado.
    """
    if not os.path.exists(ruta_cache):
        raise FileNotFoundError(
            f"No hay cotizacion cacheada en {ruta_cache} -- correr "
            f"'python3 -m dev_engine.refrescar_tipo_cambio' primero"
        )
    with open(ruta_cache, "r", encoding="utf-8") as f:
        dato = json.load(f)
    fecha_dato = datetime.strptime(dato["fecha"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
    antiguedad_dias = (datetime.now(timezone.utc) - fecha_dato).days
    if antiguedad_dias > max_antiguedad_dias:
        raise ValueError(
            f"La cotizacion cacheada es de {dato['fecha']} ({antiguedad_dias} dias) -- "
            f"supera el maximo de {max_antiguedad_dias} dias. Refrescar antes de usar."
        )
    return TipoDeCambio(valor=dato["valor"], fecha=dato["fecha"], fuente=dato["fuente"])


def conversor_vigente(max_antiguedad_dias: int = 7, avisar=print) -> ConversorMoneda:
    """
    Forma recomendada de obtener un ConversorMoneda en cualquier script de
    dev_engine: intenta el cache real (cargar_tipo_cambio); si no existe o esta
    vencido, cae al valor estatico de config/parametros_dev_engine.json y AVISA
    explicitamente (nunca en silencio) que se esta usando un fallback, no el
    tipo de cambio vigente.
    """
    try:
        return ConversorMoneda(cargar_tipo_cambio(max_antiguedad_dias=max_antiguedad_dias))
    except (FileNotFoundError, ValueError) as e:
        with open(PARAMETROS_PATH_DEFAULT, "r", encoding="utf-8") as f:
            params = json.load(f)
        tc = params["tipo_de_cambio"]
        avisar(
            f"AVISO: usando el tipo de cambio de fallback de parametros_dev_engine.json "
            f"({tc['valor']} PYG/USD, {tc['fecha']}) porque {e} -- correr "
            f"'python3 -m dev_engine.refrescar_tipo_cambio' para tener el valor real vigente."
        )
        return ConversorMoneda(TipoDeCambio(valor=tc["valor"], fecha=tc["fecha"], fuente=tc["fuente"]))
