#!/usr/bin/env python3
"""
Motor de calculo de rentabilidad de Meridiano Capital.
Corazon del negocio: los calculos deben ser exactos.

Separacion estricta:
  - LOGICA (este archivo): metodologia de calculo. NO cambia con el mercado.
  - PARAMETROS (config/parametros_mercado.json): variables de mercado. SI cambian.

Uso:
    from calculadora import Calculadora
    calc = Calculadora()  # carga parametros_mercado.json
    calc.evaluar_reventa(...)
"""

import json
import os
from pathlib import Path

# ----------------------------------------------------------------------------
# NUCLEO FINANCIERO — TIR / IRR
# ----------------------------------------------------------------------------

def vpn(tasa_periodica, flujos):
    """Valor presente neto de una lista de flujos (flujo[0] en t=0)."""
    return sum(f / (1.0 + tasa_periodica) ** i for i, f in enumerate(flujos))


def tir(flujos, tol=1e-9, max_iter=500):
    """
    Tasa Interna de Retorno por periodo, via biseccion robusta.
    flujos: lista donde flujos[i] ocurre en el periodo i (negativos = egresos).
    Devuelve la tasa periodica, o None si no converge / no hay cambio de signo.
    """
    if not flujos or all(f >= 0 for f in flujos) or all(f <= 0 for f in flujos):
        return None
    # Buscar un intervalo con cambio de signo del VPN
    lo, hi = -0.9999, 10.0
    v_lo, v_hi = vpn(lo, flujos), vpn(hi, flujos)
    # Expandir hi si hace falta
    intentos = 0
    while v_lo * v_hi > 0 and intentos < 200:
        hi *= 1.5
        v_hi = vpn(hi, flujos)
        intentos += 1
    if v_lo * v_hi > 0:
        return None
    for _ in range(max_iter):
        mid = (lo + hi) / 2.0
        v_mid = vpn(mid, flujos)
        if abs(v_mid) < tol:
            return mid
        if v_lo * v_mid < 0:
            hi, v_hi = mid, v_mid
        else:
            lo, v_lo = mid, v_mid
    return (lo + hi) / 2.0


def anualizar(tasa_periodica, periodos_por_ano=12):
    """Convierte una tasa por periodo a tasa anual efectiva."""
    if tasa_periodica is None:
        return None
    return (1.0 + tasa_periodica) ** periodos_por_ano - 1.0


def cagr(valor_inicial, valor_final, meses):
    """Retorno anual compuesto (para TIR sobre precio total)."""
    if valor_inicial <= 0 or meses <= 0:
        return None
    anos = meses / 12.0
    return (valor_final / valor_inicial) ** (1.0 / anos) - 1.0


# ----------------------------------------------------------------------------
# CRONOGRAMA DE PAGOS
# ----------------------------------------------------------------------------

def construir_cronograma(precio, entrega_inicial_pct, meses_obra,
                         saldo_a_entrega_pct=0.0):
    """
    Devuelve una lista de pagos mensuales (positivos = lo que el inversor paga).
    Indice = mes. Entrega inicial en mes 0. Saldo en cuotas iguales sin interes
    durante la obra. Opcional balloon a la entrega.
    """
    pagos = [0.0] * (meses_obra + 1)
    entrega = precio * entrega_inicial_pct / 100.0
    balloon = precio * saldo_a_entrega_pct / 100.0
    en_cuotas = precio - entrega - balloon
    pagos[0] += entrega
    if meses_obra > 0 and en_cuotas > 0:
        cuota = en_cuotas / meses_obra
        for m in range(1, meses_obra + 1):
            pagos[m] += cuota
    if balloon > 0:
        pagos[meses_obra] += balloon
    return pagos


# ----------------------------------------------------------------------------
# CALCULADORA
# ----------------------------------------------------------------------------

class Calculadora:
    def __init__(self, ruta_config=None):
        if ruta_config is None:
            ruta_config = Path(__file__).resolve().parent.parent / "config" / "parametros_mercado.json"
        with open(ruta_config, encoding="utf-8") as f:
            self.p = json.load(f)

    def iva_alquiler_pct(self, clase):
        """
        IVA de alquiler segun clase: comercial 10% (D-001/D-027, 2026-08-02),
        residencial 5% (D-001/D-027), renta temporal/Airbnb 10% (D-045,
        confirmado por el founder 2026-08-10 -- ya NO usa el 5% residencial
        por defecto).
        """
        f = self.p["fiscal"]
        if clase == "comercial":
            return f["iva_alquiler_comercial_pct"]
        if clase.startswith("temporal"):
            return f["iva_alquiler_temporal_pct"]
        return f["iva_alquiler_residencial_pct"]

    # ---- RENTA ----
    def evaluar_renta(self, clase, precio_compra, renta_mensual_bruta,
                      nivel_neto=3, gastos_reales=None, ocupacion_pct=None):
        """
        Evalua una operacion de renta.

        IMPORTANTE: el yield se calcula sobre PRECIO DE COMPRA REAL (lo que
        pago el inversor), no sobre precio de lista. Ese es el retorno sobre
        el capital efectivamente invertido.

        clase: comercial | residencial_casa | departamento_sin_muebles |
               departamento_amoblado | temporal_departamento | temporal_casa
        nivel_neto: 1=basico, 2=administrado, 3=completo (temporal usa su stack)
        gastos_reales: dict opcional con lineas reales (en % de renta bruta) para
                       sobrescribir los defaults. Para evaluaciones en firme.
        ocupacion_pct: SOLO para clases temporal_*. Ocupacion real esperada
                       (0-100). Si no se pasa, usa el punto medio del rango
                       realista del config (renta_temporal_default.
                       ocupacion_realista_pct, 55-65% -> default 60%,
                       D-003/D-046, 2026-08-10). Se asume que
                       renta_mensual_bruta representa el ingreso a ocupacion
                       plena (100%); la brecha de ocupacion se descuenta como
                       vacancia real, no el vacancia_pct generico (3%) que
                       aplica a renta tradicional.

        Devuelve yield bruto, yield neto, desglose linea por linea y veredicto.
        """
        bruto_anual = renta_mensual_bruta * 12.0
        yield_bruto = bruto_anual / precio_compra * 100.0

        s = dict(self.p["supuestos_operativos_default"])
        if gastos_reales:
            s.update(gastos_reales)
        f = self.p["fiscal"]
        es_temporal = clase.startswith("temporal")
        amoblado = clase in ("departamento_amoblado",) or es_temporal

        desglose = {}
        # --- Nivel 1: siempre ---
        desglose["expensas"] = bruto_anual * s["expensas_pct"] / 100.0
        desglose["impuesto_inmobiliario"] = bruto_anual * s["impuesto_inmobiliario_pct"] / 100.0
        desglose["iva"] = bruto_anual * self.iva_alquiler_pct(clase) / 100.0

        if es_temporal:
            # Nivel 4: stack temporal propio
            desglose["limpieza"] = bruto_anual * 12.0 / 100.0
            desglose["seguros_obligatorios"] = bruto_anual * s["seguro_pct"] / 100.0
            desglose["mantenimiento"] = bruto_anual * s["mantenimiento_pct"] / 100.0
            desglose["canon_agencia"] = bruto_anual * s["honorarios_administracion_pct"] / 100.0
            desglose["amortizacion_muebles"] = bruto_anual * s["amortizacion_muebles_pct"] / 100.0
            # D-003/D-046 (resuelto 2026-08-10): la vacancia de renta temporal
            # es la brecha de OCUPACION REAL (55-65%, nunca el vacancia_pct
            # generico de 3% pensado para renta tradicional).
            if ocupacion_pct is None:
                rango = self.p["renta_temporal_default"]["ocupacion_realista_pct"]
                ocupacion_pct = sum(rango) / len(rango)
            vacancia_temporal_pct = max(0.0, 100.0 - ocupacion_pct)
            desglose["vacancia"] = bruto_anual * vacancia_temporal_pct / 100.0
            nivel_efectivo = 4
        else:
            if nivel_neto >= 2:
                desglose["honorarios_administracion"] = bruto_anual * s["honorarios_administracion_pct"] / 100.0
                desglose["honorarios_alquiler"] = renta_mensual_bruta * s["honorarios_alquiler_meses"]
            if nivel_neto >= 3:
                desglose["seguro"] = bruto_anual * s["seguro_pct"] / 100.0
                desglose["mantenimiento"] = bruto_anual * s["mantenimiento_pct"] / 100.0
                desglose["vacancia"] = bruto_anual * s["vacancia_pct"] / 100.0
                if amoblado:
                    desglose["amortizacion_muebles"] = bruto_anual * s["amortizacion_muebles_pct"] / 100.0
            nivel_efectivo = nivel_neto

        gastos_pre_impuesto_renta = sum(desglose.values())
        neto_antes_renta = bruto_anual - gastos_pre_impuesto_renta
        # Impuesto a la renta sobre el neto (solo si positivo)
        imp_renta = max(0.0, neto_antes_renta) * f["impuesto_renta_pct"] / 100.0
        desglose["impuesto_a_la_renta"] = imp_renta
        neto_anual = neto_antes_renta - imp_renta
        yield_neto = neto_anual / precio_compra * 100.0

        # D-033 (2026-08-09): pisos y techos SIEMPRE en bruto (decision del founder).
        # Comparamos yield_bruto contra el piso, no yield_neto. D-044/D-045
        # (2026-08-10): los valores de pisos_renta_neta ya son datos confirmados
        # por el founder para las 6 clases (temporal_casa = temporal_departamento,
        # sin diferenciacion casa/depto en renta temporal). Sigue pendiente,
        # deliberadamente sin trabajo activo, la matriz por zona/calidad (P-004)
        # mas alla de Eje Corporativo. Ver knowledge-base/investment/05-matriz-pisos-techos.md.
        piso = self.p["pisos_renta_neta"].get(clase)
        resultado = {
            "clase": clase,
            "precio_compra": precio_compra,
            "renta_mensual": renta_mensual_bruta,
            "yield_bruto_pct": round(yield_bruto, 2),
            "yield_neto_pct": round(yield_neto, 2),
            "nivel_neto": nivel_efectivo,
            "neto_anual": round(neto_anual, 2),
            "desglose_gastos": {k: round(v, 2) for k, v in desglose.items()},
            "total_gastos": round(gastos_pre_impuesto_renta + imp_renta, 2),
            "piso_pct": piso,
            "pasa_piso": None if piso is None else round(yield_bruto, 2) >= piso,
        }
        if es_temporal:
            resultado["ocupacion_pct"] = round(ocupacion_pct, 2)
        return resultado

    # ---- REVENTA (venta con unidad terminada) ----
    def evaluar_reventa(self, tipo_edificio, etapa_ingreso, salida,
                        precio_entrada, meses_obra=None,
                        entrega_inicial_pct=None, meses_hasta_pre_pozo=7):
        """
        tipo_edificio: tradicional | torre
        etapa_ingreso: pre_pozo | lanzamiento | pozo_durante_obra
        salida: vende_al_terminar | vende_mas_un_ano
        Devuelve plusvalia total + doble TIR + veredicto.
        """
        matriz = self.p["matriz_plusvalia_reventa"][tipo_edificio]
        if meses_obra is None:
            meses_obra = matriz["_plazo_obra_meses_referencia"]
        plusvalia_pct = matriz[etapa_ingreso][salida]
        valor_salida = precio_entrada * (1.0 + plusvalia_pct / 100.0)

        # Horizonte segun etapa y salida
        if etapa_ingreso == "pre_pozo":
            meses_hasta_entrega = meses_obra + meses_hasta_pre_pozo
        elif etapa_ingreso == "lanzamiento":
            meses_hasta_entrega = meses_obra
        else:  # pozo_durante_obra: asume entrada a mitad de obra
            meses_hasta_entrega = max(1, meses_obra // 2)
        meses_total = meses_hasta_entrega + (12 if salida == "vende_mas_un_ano" else 0)

        # TIR sobre precio total (como si pagara todo al inicio) -- BRUTO, sin IVA de venta
        tir_precio_total = cagr(precio_entrada, valor_salida, meses_total)

        # TIR sobre capital desembolsado (cuotas reales)
        if entrega_inicial_pct is None:
            entrega_inicial_pct = self.p["cronograma_cuotas_default"]["entrega_inicial_pct"]
        pagos = construir_cronograma(precio_entrada, entrega_inicial_pct,
                                     meses_hasta_entrega)
        # Extender el vector hasta el mes de salida
        flujos = [-x for x in pagos]
        while len(flujos) <= meses_total:
            flujos.append(0.0)
        flujos[meses_total] += valor_salida  # cobra la venta al salir
        tir_mensual = tir(flujos)
        tir_desembolsado = anualizar(tir_mensual)

        # IVA de venta (CORREGIDO 2026-08-23, D-082 -- resuelve D-001 para venta):
        # base imponible presunta = 30% del precio de venta (Art. 82 Ley 125/91),
        # tasa reducida de inmuebles = 5% (Art. 91), efectivo = 1,5% del precio total.
        # NO es 5% directo sobre el 100% (ese era el error de D-027, sobreestimaba
        # el IVA real en ~3,33x) -- ver knowledge-base/investment/methodologies/
        # iva-venta-de-inmuebles-paraguay.md. Figuras BRUTAS arriba se preservan sin
        # tocar (compatibilidad con los casos ya auditados); estas son adicionales,
        # netas de IVA.
        iva_venta_base_pct = self.p["fiscal"]["iva_venta_base_imponible_pct"]
        iva_venta_tasa_pct = self.p["fiscal"]["iva_venta_tasa_pct"]
        iva_venta_pct = iva_venta_base_pct * iva_venta_tasa_pct / 100.0  # % efectivo, ej. 30*5/100=1.5
        iva_venta_monto = valor_salida * iva_venta_pct / 100.0
        valor_salida_neto_iva = valor_salida - iva_venta_monto
        tir_precio_total_neto_iva = cagr(precio_entrada, valor_salida_neto_iva, meses_total)
        flujos_neto_iva = [-x for x in pagos]
        while len(flujos_neto_iva) <= meses_total:
            flujos_neto_iva.append(0.0)
        flujos_neto_iva[meses_total] += valor_salida_neto_iva
        tir_desembolsado_neto_iva = anualizar(tir(flujos_neto_iva))

        return {
            "tipo_edificio": tipo_edificio,
            "etapa_ingreso": etapa_ingreso,
            "salida": salida,
            "meses_total": meses_total,
            "plusvalia_total_pct": plusvalia_pct,
            "valor_salida": round(valor_salida, 2),
            "tir_precio_total_pct": round(tir_precio_total * 100, 2) if tir_precio_total else None,
            "tir_capital_desembolsado_pct": round(tir_desembolsado * 100, 2) if tir_desembolsado else None,
            "iva_venta_pct": iva_venta_pct,
            "iva_venta_monto": round(iva_venta_monto, 2),
            "valor_salida_neto_iva": round(valor_salida_neto_iva, 2),
            "tir_precio_total_neto_iva_pct": round(tir_precio_total_neto_iva * 100, 2) if tir_precio_total_neto_iva else None,
            "tir_capital_desembolsado_neto_iva_pct": round(tir_desembolsado_neto_iva * 100, 2) if tir_desembolsado_neto_iva else None,
        }

    # ---- REVENTA TEMPRANA (cesion de derechos) ----
    def evaluar_reventa_temprana(self, precio_entrada, meses_obra,
                                 mes_cesion=None, apreciacion_pct=None,
                                 entrega_inicial_pct=None):
        """
        Cesion del boleto antes de terminar de pagar, en edificio exitoso.
        Devuelve ganancia, capital desembolsado y TIR sobre ese capital.
        """
        s = self.p["supuestos_reventa_temprana"]
        if mes_cesion is None:
            mes_cesion = s["mes_cesion_tipico"]
        if apreciacion_pct is None:
            apreciacion_pct = s["apreciacion_post_lanzamiento_pct"]
        if entrega_inicial_pct is None:
            entrega_inicial_pct = self.p["cronograma_cuotas_default"]["entrega_inicial_pct"]

        pagos = construir_cronograma(precio_entrada, entrega_inicial_pct, meses_obra)
        desembolsado = sum(pagos[:mes_cesion + 1])
        total_pagado_teorico = sum(pagos[:mes_cesion + 1])
        saldo_pendiente = precio_entrada - sum(pagos[:mes_cesion + 1])

        valor_posicion = precio_entrada * (1.0 + apreciacion_pct / 100.0)
        # El cesionario asume el saldo; el cedente cobra valor - saldo
        cobra_cedente = valor_posicion - saldo_pendiente
        ganancia = cobra_cedente - desembolsado

        # TIR sobre capital desembolsado -- BRUTO, sin IVA de venta
        flujos = [-x for x in pagos[:mes_cesion + 1]]
        flujos[mes_cesion] += cobra_cedente
        tir_mensual = tir(flujos)
        tir_anual = anualizar(tir_mensual)

        # IVA de venta (CORREGIDO 2026-08-23, D-082): 1,5% efectivo (30% base
        # imponible x 5% tasa reducida de inmuebles) sobre lo que cobra el cedente --
        # no 5% directo (ver evaluar_reventa arriba para el detalle del error corregido).
        # Figuras BRUTAS arriba se preservan; estas son adicionales.
        iva_venta_base_pct = self.p["fiscal"]["iva_venta_base_imponible_pct"]
        iva_venta_tasa_pct = self.p["fiscal"]["iva_venta_tasa_pct"]
        iva_venta_pct = iva_venta_base_pct * iva_venta_tasa_pct / 100.0
        iva_venta_monto = cobra_cedente * iva_venta_pct / 100.0
        cobra_cedente_neto_iva = cobra_cedente - iva_venta_monto
        ganancia_neta_iva = cobra_cedente_neto_iva - desembolsado
        flujos_neto_iva = [-x for x in pagos[:mes_cesion + 1]]
        flujos_neto_iva[mes_cesion] += cobra_cedente_neto_iva
        tir_anual_neto_iva = anualizar(tir(flujos_neto_iva))

        return {
            "mes_cesion": mes_cesion,
            "apreciacion_pct": apreciacion_pct,
            "capital_desembolsado": round(desembolsado, 2),
            "saldo_que_asume_comprador": round(saldo_pendiente, 2),
            "cobra_cedente": round(cobra_cedente, 2),
            "ganancia": round(ganancia, 2),
            "ganancia_sobre_desembolsado_pct": round(ganancia / desembolsado * 100, 2) if desembolsado else None,
            "tir_capital_desembolsado_pct": round(tir_anual * 100, 2) if tir_anual else None,
            "iva_venta_pct": iva_venta_pct,
            "iva_venta_monto": round(iva_venta_monto, 2),
            "cobra_cedente_neto_iva": round(cobra_cedente_neto_iva, 2),
            "ganancia_neta_iva": round(ganancia_neta_iva, 2),
            "ganancia_neta_iva_sobre_desembolsado_pct": round(ganancia_neta_iva / desembolsado * 100, 2) if desembolsado else None,
            "tir_capital_desembolsado_neto_iva_pct": round(tir_anual_neto_iva * 100, 2) if tir_anual_neto_iva else None,
        }

    # ---- TERRENO / APORTE ----
    def piso_terreno(self):
        return self.p["pisos_capital"]["terreno_plusvalia_anual_min"]

    def piso_aporte(self):
        return self.p["pisos_capital"]["aporte_construccion_preferencial_anual"]

    # ---- RETORNO COMBINADO (renta + plusvalia) ----
    def evaluar_retorno_combinado(self, clase, precio_compra, valor_actual,
                                  meses_tenencia, renta_mensual_bruta,
                                  nivel_neto=3):
        """
        El concepto del momento de compra: cuando se compra bien (en pozo,
        por debajo del precio de lista), la renta sola puede quedar por debajo
        del piso, PERO la plusvalia cubre esa diferencia. El retorno real del
        inversor combina las dos.

        Devuelve: yield de renta (vs piso), plusvalia total y anualizada, y el
        retorno combinado del periodo de tenencia.

        Nota importante: la plusvalia es una ganancia que se realiza una vez.
        El retorno combinado es altisimo el primer periodo (captura el salto
        pozo->terminado) y luego se normaliza a: renta sobre costo + apreciacion
        de mercado futura. Si el mercado de alquileres sube, el yield sobre el
        costo original tambien sube con el tiempo.
        """
        renta = self.evaluar_renta(clase, precio_compra, renta_mensual_bruta, nivel_neto)
        plusvalia_total_pct = (valor_actual / precio_compra - 1.0) * 100.0
        pv_anual = cagr(precio_compra, valor_actual, meses_tenencia)
        plusvalia_anual_pct = pv_anual * 100.0 if pv_anual else None

        # Retorno del periodo de tenencia: renta neta cobrada + apreciacion, sobre el costo
        anos = meses_tenencia / 12.0
        renta_neta_acumulada = renta["neto_anual"] * anos
        apreciacion_abs = valor_actual - precio_compra
        retorno_periodo_pct = (renta_neta_acumulada + apreciacion_abs) / precio_compra * 100.0
        retorno_periodo_anual_pct = ((1 + retorno_periodo_pct/100.0) ** (1/anos) - 1) * 100.0 if anos > 0 else None

        piso = renta["piso_pct"]
        gap_renta = None if piso is None else round(renta["yield_neto_pct"] - piso, 2)

        return {
            "clase": clase,
            "precio_compra": precio_compra,
            "valor_actual": valor_actual,
            "meses_tenencia": meses_tenencia,
            "yield_renta_neto_pct": renta["yield_neto_pct"],
            "piso_renta_pct": piso,
            "gap_vs_piso_pct": gap_renta,
            "renta_sola_pasa_piso": renta["pasa_piso"],
            "plusvalia_total_pct": round(plusvalia_total_pct, 2),
            "plusvalia_anualizada_pct": round(plusvalia_anual_pct, 2) if plusvalia_anual_pct else None,
            "retorno_combinado_periodo_pct": round(retorno_periodo_pct, 2),
            "retorno_combinado_anualizado_pct": round(retorno_periodo_anual_pct, 2) if retorno_periodo_anual_pct else None,
            "lectura": self._leer_combinado(renta["pasa_piso"], plusvalia_total_pct, gap_renta),
        }

    @staticmethod
    def _leer_combinado(renta_pasa, plusvalia, gap):
        if renta_pasa:
            return "Renta sola ya supera el piso. La plusvalia es upside adicional."
        if gap is not None and plusvalia >= abs(gap):
            return ("Renta sola por debajo del piso, pero la plusvalia ya cubre la "
                    "diferencia con holgura. Inversion solida por el momento de compra.")
        return ("Renta por debajo del piso; la plusvalia aun no cubre del todo la "
                "diferencia. Depende de apreciacion futura o suba de alquileres.")


if __name__ == "__main__":
    print("Modulo calculadora. Importar la clase Calculadora. Ver tests/ para ejemplos.")
