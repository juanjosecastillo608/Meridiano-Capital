#!/usr/bin/env python3
"""
Renta pura vs. servicios y alertas de coherencia (D-103, founder 10/11/2026).

Una sola implementacion para el motor (calculadora.py), la API, las skills y los
decks (projects/meridiano-capital/presentaciones/_config/rentabilidad.py).

1. Separacion renta pura / servicios: en un activo que alquila con servicios
   incluidos (consultorios con secretaria, coworking, hostel, renta temporal,
   habitaciones todo incluido) la facturacion no es una bruta de alquiler.
   ingreso_renta_pura = ingreso - costo directo de los servicios.
2. Alertas antes de presentar:
   - neta / ingreso de renta pura < neta_sobre_bruta_min_pct (50%);
   - una linea de gasto > gasto_fijo_max_pct_bruto (15%) del ingreso de renta pura;
   - impuesto inmobiliario > impuesto_inmobiliario_max_pct_precio (1%) del precio.
   Con una alerta abierta la neta se presenta como RANGO, no como dato.
3. Rango: piso = neta con los datos informados; techo (ESTIMACION) = neta si cada linea alertada
   bajara a su umbral (15% del ingreso de renta pura; el impuesto inmobiliario, a lo menor entre ese
   15% y el 1% del precio), con el ahorro neto de IRE. Nunca supera los datos informados.

Umbrales en production/app/config/parametros_mercado.json > alertas_coherencia.
"""
import json
from pathlib import Path

IMP = "Impuesto inmobiliario"
_RUTA = Path(__file__).resolve().parent.parent / "config" / "parametros_mercado.json"


def _n(x, d=1):
    return f"{x:,.{d}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def umbrales(p=None):
    if p is None:
        with open(_RUTA, encoding="utf-8") as f:
            p = json.load(f)
    a = p["alertas_coherencia"]
    return {k: a[k] for k in ("neta_sobre_bruta_min_pct", "gasto_fijo_max_pct_bruto", "impuesto_inmobiliario_max_pct_precio")}


def evaluar_coherencia(ingreso, neto, precio, servicios=0.0, gastos=None, impuesto_inmobiliario=None, p=None):
    """
    ingreso: ingreso anual (facturacion; en temporal, a ocupacion real).
    neto: resultado anual despues de IVA e IRE.
    precio: base de la rentabilidad (precio o precio + obra).
    servicios: costo directo anual de los servicios incluidos en el precio del alquiler.
    gastos: {linea: monto anual} de gastos operativos a controlar (sin IVA, IRE,
            vacancia ni lineas de servicio).
    impuesto_inmobiliario: monto anual, si se conoce por separado.
    p: config ya cargada (opcional).

    Devuelve un dict con la renta pura, los ratios y la lista de alertas (texto).
    """
    if p is None:
        with open(_RUTA, encoding="utf-8") as f:
            p = json.load(f)
    u = umbrales(p)
    ire = p["fiscal"]["impuesto_renta_pct"] / 100.0
    gastos = dict(gastos or {})
    pura = ingreso - servicios
    alertas, codigos = [], []
    ratio = (neto / pura * 100.0) if pura > 0 else None
    if pura <= 0:
        alertas.append("Los servicios consumen todo el ingreso: no hay renta pura.")
        codigos.append("sin_renta_pura")
    elif ratio < u["neta_sobre_bruta_min_pct"]:
        alertas.append(f"La neta es el {_n(ratio, 0)}% del ingreso de renta pura (mínimo {_n(u['neta_sobre_bruta_min_pct'], 0)}%): "
                       "revisar los datos de gastos antes de presentar.")
        codigos.append("neta_baja")
    if impuesto_inmobiliario is not None and IMP not in gastos:
        gastos[IMP] = impuesto_inmobiliario
    exceso = 0.0
    if pura > 0:
        for linea, monto in gastos.items():
            pct = monto / pura * 100.0
            tope = u["gasto_fijo_max_pct_bruto"] / 100.0 * pura
            if linea == IMP and precio > 0:
                tope = min(tope, u["impuesto_inmobiliario_max_pct_precio"] / 100.0 * precio)
            exceso += max(0.0, monto - tope)
            if pct > u["gasto_fijo_max_pct_bruto"]:
                alertas.append(f"«{linea}» es el {_n(pct)}% del ingreso de renta pura (máximo {_n(u['gasto_fijo_max_pct_bruto'], 0)}%): "
                               "pedir el desglose y los comprobantes.")
                codigos.append("gasto_alto:" + linea)
    neto_techo = neto + exceso * (1.0 - ire)
    if impuesto_inmobiliario is not None and precio > 0:
        pct = impuesto_inmobiliario / precio * 100.0
        if pct > u["impuesto_inmobiliario_max_pct_precio"]:
            alertas.append(f"El impuesto inmobiliario es el {_n(pct, 2)}% del precio (máximo {_n(u['impuesto_inmobiliario_max_pct_precio'], 0)}%): "
                           "dato inconsistente con la valuación fiscal; pedir la boleta.")
            codigos.append("impuesto_alto")
    return {
        "ingreso": round(ingreso, 2),
        "servicios": round(servicios, 2),
        "ingreso_renta_pura": round(pura, 2),
        "facturacion_pct": round(ingreso / precio * 100.0, 2) if precio else None,
        "bruta_renta_pura_pct": round(pura / precio * 100.0, 2) if precio else None,
        "neta_sobre_renta_pura_pct": None if ratio is None else round(ratio, 1),
        "neta_pct": round(neto / precio * 100.0, 2) if precio else None,
        "neta_techo_pct": round(neto_techo / precio * 100.0, 2) if precio else None,
        "alertas": alertas,
        "codigos": codigos,
        "presentar_como_rango": bool(alertas),
    }
