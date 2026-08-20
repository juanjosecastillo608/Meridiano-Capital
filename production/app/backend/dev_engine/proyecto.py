"""
Ficha maestra del proyecto + orquestador (S05, S51 del prompt maestro).

Encadena: EstructuraCostos -> FlujoDeFondos -> Financiamiento -> Metricas
Financieras, en el orden MARKET DATABASE -> PROJECT INPUTS -> COST ENGINE ->
SALES ENGINE -> CASH FLOW -> FINANCIAL ENGINE -> INVESTMENT ANALYSIS (S51).

Este es el UNICO lugar donde se combinan todos los modulos -- para cambiar como se
calcula el proyecto se cambia un modulo (costos/cashflow/financiamiento/financiero),
nunca este orquestador (S52 parametrizacion, S71 no duplicacion).
"""

from dataclasses import dataclass, field
from typing import List, Optional

from .moneda import ConversorMoneda
from .costos import EstructuraCostos
from .cashflow import FlujoDeFondos, VentaUnidad, curva_gasto_obra, flujo_ventas_usd
from .financiamiento import TerminosFinanciamiento, calcular_financiamiento
from .financiero import calcular_metricas, MetricasFinancieras


@dataclass
class FichaProyecto:
    """S05 -- datos identificatorios del proyecto."""
    nombre: str
    barrio: str
    ciudad: str = "Asunción"
    segmento: str = ""
    calidad: str = ""
    estrategia_comercial: str = ""
    fecha_inicio_estimada: str = ""
    fecha_fin_estimada: str = ""


@dataclass
class ResultadoProyecto:
    ficha: FichaProyecto
    ingresos_totales_usd: float
    inversion_total_usd: float          # terreno+directos+indirectos+desarrollo+contingencia (SIN comercial/impuestos/financieros)
    costo_comerciales_usd: float
    costo_impuestos_usd: float
    costo_financiero_usd: float
    costo_total_proyecto_usd: float     # inversion_total + comerciales + impuestos + financieros (S16 completo)
    margen_usd: float
    cost_bridge: List[dict]
    indicadores_por_m2: dict
    financiamiento: dict
    flujo_mensual: List[dict]
    metricas: MetricasFinancieras
    moneda: dict


class Proyecto:
    def __init__(
        self,
        ficha: FichaProyecto,
        estructura_costos: EstructuraCostos,
        ventas: List[VentaUnidad],
        meses_obra: int,
        conversor: ConversorMoneda,
        terminos_financiamiento: TerminosFinanciamiento,
        curva_obra_forma: str = "s_curve",
        tasa_descuento_anual_pct: float = 12.0,
        mes_pago_terreno: int = 0,
        horizonte_meses: Optional[int] = None,
    ):
        self.ficha = ficha
        self.costos = estructura_costos
        self.ventas = ventas
        # meses_obra puede llegar como float si viene de un ajuste porcentual
        # (sensibilidad.py/escenarios.py, ej. "+20% de plazo") -- se redondea a
        # entero porque el resto del motor indexa listas mensuales con este valor.
        self.meses_obra = int(round(meses_obra))
        self.conversor = conversor
        self.terminos_financiamiento = terminos_financiamiento
        self.curva_obra_forma = curva_obra_forma
        self.tasa_descuento_anual_pct = tasa_descuento_anual_pct
        self.mes_pago_terreno = mes_pago_terreno
        fin_ventas = max((v.mes_venta + v.meses_cuotas + 1 for v in ventas), default=self.meses_obra)
        self.horizonte_meses = horizonte_meses or max(self.meses_obra + 1, fin_ventas) + 1

    def correr(self) -> ResultadoProyecto:
        conv = self.conversor
        ingresos_totales = sum(v.precio_usd for v in self.ventas)

        # ---- 1) Costos (sin financieros, sin comerciales/impuestos aun -- dependen de ingresos ya calculado)
        terreno_usd = self.costos.terreno.total_usd(conv)
        directos_usd = self.costos.directos.total_usd(conv)
        indirectos_usd = self.costos.costo_indirectos_usd(conv)
        desarrollo_usd = self.costos.costo_desarrollo_usd(conv)
        contingencia_usd = self.costos.costo_contingencia_usd(conv)
        inversion_total = terreno_usd + directos_usd + indirectos_usd + desarrollo_usd + contingencia_usd

        comerciales_usd = self.costos.costo_comerciales_usd(ingresos_totales, conv)
        impuestos_usd = self.costos.costo_impuestos_usd(conv, ingresos_totales)

        # ---- 2) Cash flow operativo (sin financieros)
        n = self.horizonte_meses
        egreso_terreno = [0.0] * n
        if 0 <= self.mes_pago_terreno < n:
            egreso_terreno[self.mes_pago_terreno] = terreno_usd
        egreso_obra_curva = curva_gasto_obra(directos_usd, self.meses_obra, self.curva_obra_forma)
        egreso_obra = [0.0] * n
        for i, v in enumerate(egreso_obra_curva):
            if i < n:
                egreso_obra[i] = v
        # indirectos + desarrollo distribuidos linealmente durante la obra (supuesto declarado)
        egreso_indirectos = [0.0] * n
        if self.meses_obra > 0:
            cuota_ind = (indirectos_usd + desarrollo_usd + contingencia_usd) / self.meses_obra
            for i in range(self.meses_obra):
                egreso_indirectos[i] = cuota_ind
        ingreso_ventas = flujo_ventas_usd(self.ventas, n)
        # comisión e IVA se pagan cuando se percibe cada ingreso (supuesto: proporcional al ingreso del mes)
        egreso_comerciales = [0.0] * n
        egreso_impuestos = [0.0] * n
        if ingresos_totales > 0:
            for i in range(n):
                proporcion = ingreso_ventas[i] / ingresos_totales
                egreso_comerciales[i] = comerciales_usd * proporcion
                egreso_impuestos[i] = impuestos_usd * proporcion

        flujo = FlujoDeFondos(
            meses=n,
            egreso_terreno=egreso_terreno,
            egreso_obra=egreso_obra,
            egreso_indirectos=egreso_indirectos,
            egreso_comerciales=egreso_comerciales,
            egreso_impuestos=egreso_impuestos,
            ingreso_ventas=ingreso_ventas,
        )
        flujo_operativo = flujo.flujo_operativo()

        # ---- 3) Financiamiento sobre el flujo real (S12)
        fin = calcular_financiamiento(flujo_operativo, self.terminos_financiamiento)
        costo_financiero_usd = fin["costo_financiero_total_usd"]

        # flujo neto final = operativo, menos el interes efectivamente devengado ese mes
        # (el capital de deuda girado/amortizado es un movimiento de financiamiento, no
        # un costo del proyecto en si -- el COSTO es el interes + comision)
        flujo_neto = [
            flujo_operativo[i] - fin["interes_mensual"][i]
            - (fin["comision_apertura_total_usd"] / n if n else 0.0)
            for i in range(n)
        ]

        costo_total_proyecto = inversion_total + comerciales_usd + impuestos_usd + costo_financiero_usd
        margen = ingresos_totales - costo_total_proyecto

        metricas = calcular_metricas(
            flujo_neto_mensual=flujo_neto,
            gross_development_value_usd=ingresos_totales,
            total_development_cost_usd=costo_total_proyecto,
            capital_propio_usd=self.terminos_financiamiento.capital_propio_usd,
            tasa_descuento_anual_pct=self.tasa_descuento_anual_pct,
        )

        return ResultadoProyecto(
            ficha=self.ficha,
            ingresos_totales_usd=ingresos_totales,
            inversion_total_usd=inversion_total,
            costo_comerciales_usd=comerciales_usd,
            costo_impuestos_usd=impuestos_usd,
            costo_financiero_usd=costo_financiero_usd,
            costo_total_proyecto_usd=costo_total_proyecto,
            margen_usd=margen,
            cost_bridge=self.costos.cost_bridge(conv, costo_financiero_usd, ingresos_totales),
            indicadores_por_m2=self.costos.indicadores_por_m2(conv, costo_financiero_usd, ingresos_totales),
            financiamiento=fin,
            flujo_mensual=flujo.resumen_mensual(flujo_neto),
            metricas=metricas,
            moneda=conv.resumen(),
        )
