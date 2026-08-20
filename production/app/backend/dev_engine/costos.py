"""
Jerarquia de costos del Development Financial Engine (S03, S06-S17 del prompt maestro).

Principio rector: NUNCA una sola cifra "costo de construccion por m2". La estructura es:

    TERRENO
  + COSTOS DIRECTOS
  + COSTOS INDIRECTOS
  + COSTOS DE DESARROLLO
  + COSTOS FINANCIEROS      (lo calcula financiamiento.py, se inyecta despues)
  + COSTOS COMERCIALES
  + IMPUESTOS Y GASTOS
  + CONTINGENCIA
  = COSTO TOTAL DEL PROYECTO

Cada partida puede parametrizarse de 3 formas (S10): monto fijo, porcentaje de una
base, o costo/m2. Nunca se mezcla impuestos con costos de construccion (S14).
"""

from dataclasses import dataclass, field
from typing import List, Optional
from .moneda import Monto, ConversorMoneda


@dataclass
class Partida:
    """Una linea de costo (directo, indirecto, comercial o impuesto)."""
    codigo: str
    categoria: str
    subcategoria: str = ""
    unidad: str = "global"        # ej. "m2", "unidad", "global"
    cantidad: float = 1.0
    costo_unitario: Monto = field(default_factory=lambda: Monto(0.0, "USD"))
    fuente: str = ""
    etapa: str = ""
    estado: str = "ESTIMATE"      # ACTUAL | ESTIMATE | ASSUMPTION | PROJECTION (S65)
    observaciones: str = ""

    def costo_total_usd(self, conversor: ConversorMoneda) -> float:
        return self.cantidad * conversor.a_usd(self.costo_unitario)


@dataclass
class ItemParametrizable:
    """
    Partida indirecta/comercial/de desarrollo que puede definirse como monto fijo,
    porcentaje de una base, o costo/m2 (S10). El motor nunca hardcodea cual de los
    tres modos usar -- lo declara el parametro.
    """
    nombre: str
    modo: str                      # "fijo" | "porcentaje" | "por_m2"
    valor: float                   # USD (fijo/por_m2) o % 0-100 (porcentaje)
    base: Optional[str] = None     # clave de la base sobre la que aplica el %, si modo=="porcentaje"
    moneda: str = "USD"
    estado: str = "ESTIMATE"
    fuente: str = ""

    def calcular_usd(self, bases_usd: dict, superficie_m2: float, conversor: ConversorMoneda) -> float:
        if self.modo == "fijo":
            return conversor.a_usd(Monto(self.valor, self.moneda))
        if self.modo == "por_m2":
            return conversor.a_usd(Monto(self.valor, self.moneda)) * superficie_m2
        if self.modo == "porcentaje":
            if self.base not in bases_usd:
                raise ValueError(
                    f"Item '{self.nombre}': base '{self.base}' no encontrada en bases_usd "
                    f"(disponibles: {list(bases_usd.keys())})"
                )
            return bases_usd[self.base] * self.valor / 100.0
        raise ValueError(f"Modo '{self.modo}' invalido para item '{self.nombre}'")


@dataclass
class CostoTerreno:
    """Modulo LAND COST (S06)."""
    precio_compra: Monto
    gastos_adquisicion: List[Partida] = field(default_factory=list)  # honorarios, escritura, registro, comisiones

    def total_usd(self, conversor: ConversorMoneda) -> float:
        return conversor.a_usd(self.precio_compra) + sum(
            p.costo_total_usd(conversor) for p in self.gastos_adquisicion
        )

    def costo_por_m2_terreno_usd(self, conversor: ConversorMoneda, m2_terreno: float) -> Optional[float]:
        if m2_terreno <= 0:
            return None
        return self.total_usd(conversor) / m2_terreno

    def costo_por_m2_vendible_usd(self, conversor: ConversorMoneda, m2_vendible: float) -> Optional[float]:
        if m2_vendible <= 0:
            return None
        return self.total_usd(conversor) / m2_vendible


@dataclass
class GrupoPartidas:
    """Costos Directos, o cualquier grupo de partidas de tipo Partida (S07-S09)."""
    nombre: str
    partidas: List[Partida] = field(default_factory=list)

    def total_usd(self, conversor: ConversorMoneda) -> float:
        return sum(p.costo_total_usd(conversor) for p in self.partidas)

    def desglose_por_m2(self, conversor: ConversorMoneda, m2: float) -> List[dict]:
        """Partida / Costo total / Costo por m2 / % del grupo (S09)."""
        total = self.total_usd(conversor)
        filas = []
        for p in self.partidas:
            ct = p.costo_total_usd(conversor)
            filas.append({
                "partida": p.categoria + (f" - {p.subcategoria}" if p.subcategoria else ""),
                "costo_total_usd": ct,
                "costo_por_m2_usd": (ct / m2) if m2 > 0 else None,
                "pct_del_grupo": (ct / total * 100) if total > 0 else 0.0,
            })
        return filas


@dataclass
class GrupoParametrizable:
    """Costos Indirectos, de Desarrollo, Comerciales o Impuestos (S10-S14) -- cada
    item puede ser fijo/porcentaje/por_m2. Requiere las 'bases' (costo directo, etc.)
    ya calculadas para resolver los items en modo porcentaje."""
    nombre: str
    items: List[ItemParametrizable] = field(default_factory=list)

    def total_usd(self, bases_usd: dict, superficie_m2: float, conversor: ConversorMoneda) -> float:
        return sum(it.calcular_usd(bases_usd, superficie_m2, conversor) for it in self.items)

    def desglose(self, bases_usd: dict, superficie_m2: float, conversor: ConversorMoneda) -> List[dict]:
        total = self.total_usd(bases_usd, superficie_m2, conversor)
        filas = []
        for it in self.items:
            v = it.calcular_usd(bases_usd, superficie_m2, conversor)
            filas.append({
                "item": it.nombre, "modo": it.modo, "costo_usd": v,
                "pct_del_grupo": (v / total * 100) if total > 0 else 0.0,
            })
        return filas


@dataclass
class Superficies:
    """S18 -- nunca usar un denominador sin decir cual superficie es."""
    terreno_m2: float
    construida_m2: float
    vendible_m2: float
    comun_m2: float = 0.0
    cubierta_m2: Optional[float] = None
    semicubierta_m2: Optional[float] = None
    ponderada_m2: Optional[float] = None


@dataclass
class ContingenciaConfig:
    """S15 -- tasa editable, base de calculo explicita, nunca un % universal fijo en codigo."""
    tasa_pct: float
    base: str = "directos+indirectos+desarrollo"   # que grupos entran en la base de calculo


@dataclass
class EstructuraCostos:
    """
    Arma TERRENO + DIRECTOS + INDIRECTOS + DESARROLLO + COMERCIALES + IMPUESTOS +
    CONTINGENCIA = COSTO TOTAL (S03, S16). Los COSTOS FINANCIEROS se inyectan aparte
    (financiamiento.py) porque dependen del cash flow real, no se calculan de forma
    independiente (regla explicita del S12).
    """
    terreno: CostoTerreno
    directos: GrupoPartidas
    indirectos: GrupoParametrizable
    desarrollo: GrupoParametrizable
    comerciales: GrupoParametrizable
    impuestos: GrupoParametrizable
    contingencia: ContingenciaConfig
    superficies: Superficies

    def _bases(self, conversor: ConversorMoneda) -> dict:
        terreno_usd = self.terreno.total_usd(conversor)
        directos_usd = self.directos.total_usd(conversor)
        return {
            "terreno": terreno_usd,
            "directos": directos_usd,
            "costo_directo": directos_usd,   # alias comun
        }

    def costo_indirectos_usd(self, conversor: ConversorMoneda) -> float:
        bases = self._bases(conversor)
        return self.indirectos.total_usd(bases, self.superficies.construida_m2, conversor)

    def costo_desarrollo_usd(self, conversor: ConversorMoneda) -> float:
        bases = self._bases(conversor)
        bases["indirectos"] = self.costo_indirectos_usd(conversor)
        return self.desarrollo.total_usd(bases, self.superficies.construida_m2, conversor)

    def costo_comerciales_usd(self, ingresos_totales_usd: float, conversor: ConversorMoneda) -> float:
        bases = self._bases(conversor)
        bases["ingresos"] = ingresos_totales_usd
        return self.comerciales.total_usd(bases, self.superficies.vendible_m2, conversor)

    def costo_impuestos_usd(self, conversor: ConversorMoneda, ingresos_totales_usd: float = 0.0) -> float:
        bases = self._bases(conversor)
        bases["directos"] = self.directos.total_usd(conversor)
        bases["ingresos"] = ingresos_totales_usd
        return self.impuestos.total_usd(bases, self.superficies.construida_m2, conversor)

    def base_contingencia_usd(self, conversor: ConversorMoneda) -> float:
        partes = self.contingencia.base.split("+")
        mapa = {
            "terreno": self.terreno.total_usd(conversor),
            "directos": self.directos.total_usd(conversor),
            "indirectos": self.costo_indirectos_usd(conversor),
            "desarrollo": self.costo_desarrollo_usd(conversor),
        }
        return sum(mapa.get(p.strip(), 0.0) for p in partes)

    def costo_contingencia_usd(self, conversor: ConversorMoneda) -> float:
        return self.base_contingencia_usd(conversor) * self.contingencia.tasa_pct / 100.0

    def costo_total_sin_financieros_usd(self, conversor: ConversorMoneda, ingresos_totales_usd: float = 0.0) -> float:
        """Costo total EXCLUYENDO financieros -- estos se conocen recien tras correr
        el cash flow (S12). Usar costos.costo_total_con_financieros_usd() despues."""
        return (
            self.terreno.total_usd(conversor)
            + self.directos.total_usd(conversor)
            + self.costo_indirectos_usd(conversor)
            + self.costo_desarrollo_usd(conversor)
            + self.costo_comerciales_usd(ingresos_totales_usd, conversor)
            + self.costo_impuestos_usd(conversor, ingresos_totales_usd)
            + self.costo_contingencia_usd(conversor)
        )

    def cost_bridge(self, conversor: ConversorMoneda, costo_financiero_usd: float, ingresos_totales_usd: float = 0.0) -> List[dict]:
        """S61 -- COST BRIDGE visual: cada componente con su % del total."""
        componentes = {
            "Terreno": self.terreno.total_usd(conversor),
            "Costos directos": self.directos.total_usd(conversor),
            "Costos indirectos": self.costo_indirectos_usd(conversor),
            "Costos de desarrollo": self.costo_desarrollo_usd(conversor),
            "Costos financieros": costo_financiero_usd,
            "Costos comerciales": self.costo_comerciales_usd(ingresos_totales_usd, conversor),
            "Impuestos y gastos": self.costo_impuestos_usd(conversor, ingresos_totales_usd),
            "Contingencia": self.costo_contingencia_usd(conversor),
        }
        total = sum(componentes.values())
        return [
            {"componente": k, "usd": v, "pct": (v / total * 100 if total > 0 else 0.0)}
            for k, v in componentes.items()
        ] + [{"componente": "COSTO TOTAL", "usd": total, "pct": 100.0}]

    def indicadores_por_m2(self, conversor: ConversorMoneda, costo_financiero_usd: float, ingresos_totales_usd: float = 0.0) -> dict:
        """S17 -- distintos denominadores, cada uno explicito (S18)."""
        s = self.superficies
        directo = self.directos.total_usd(conversor)
        indirecto = self.costo_indirectos_usd(conversor)
        financiero = costo_financiero_usd
        total = self.costo_total_sin_financieros_usd(conversor, ingresos_totales_usd) + costo_financiero_usd
        def por(valor, m2):
            return (valor / m2) if m2 and m2 > 0 else None
        return {
            "costo_directo_por_m2_construido": por(directo, s.construida_m2),
            "costo_indirecto_por_m2_construido": por(indirecto, s.construida_m2),
            "costo_financiero_por_m2_construido": por(financiero, s.construida_m2),
            "costo_total_por_m2_construido": por(total, s.construida_m2),
            "costo_total_por_m2_vendible": por(total, s.vendible_m2),
        }
