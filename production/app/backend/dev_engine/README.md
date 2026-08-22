# Development Cost & Financial Engine (`dev_engine`)

Motor parametrizable de costos, precios, flujo de fondos y rentabilidad para
proyectos de desarrollo inmobiliario de Meridiano Capital. Ver la auditoría y
arquitectura completa en
`documentation/development-financial-engine/00-auditoria-y-arquitectura-propuesta.md`
y el reporte final en `documentation/development-financial-engine/01-reporte-final.md`.

## Por qué existe

Antes de este motor, cada proyecto (empezando por `HERRERA-001`) calculaba su
jerarquía de costos, su cash flow mensual y su rentabilidad **a mano, en Markdown**
— con el riesgo real que eso implica: 4 versiones sucesivas de cronograma de caja
en el caso Herrera, cada una corrigiendo a la anterior. `dev_engine` es la versión
parametrizada y reutilizable de ese mismo trabajo: cambiar un parámetro (precio de
venta, costo de construcción, plazo de obra, tasa de financiamiento, tipo de
cambio) recalcula automáticamente todo lo que depende de él.

## Principio rector

- **Lógica vs. parámetros**: igual disciplina que `calculadora.py` — la lógica de
  cálculo (este paquete) no cambia con el mercado; los parámetros
  (`config/parametros_dev_engine.json`, `knowledge-base/investment/market-intelligence/`)
  sí.
- **No duplicar**: reutiliza `calculadora.py` (`tir()`, `vpn()`, `construir_cronograma()`)
  y los Skills SK-11/12/13 del Real Estate Intelligence OS — nunca reimplementa esa
  lógica.
- **Una sola fuente de verdad**: el motor lee de `knowledge-base/investment/market-intelligence/`,
  nunca copia esos valores a un archivo propio.
- **Nunca ocultar incertidumbre**: cada partida declara su `estado`
  (ACTUAL/ESTIMATE/ASSUMPTION/PROJECTION) — ver §65 del prompt maestro.

## Módulos

| Módulo | Qué hace |
|---|---|
| `moneda.py` | Capa USD/PYG — `Monto`, `TipoDeCambio` (versionado: valor+fecha+fuente), `ConversorMoneda` |
| `costos.py` | Jerarquía de costos: `CostoTerreno`, `GrupoPartidas` (directos), `GrupoParametrizable` (indirectos/desarrollo/comerciales/impuestos — fijo/%/por m²), `ContingenciaConfig`, `EstructuraCostos` |
| `cashflow.py` | `FlujoDeFondos` mensual, `curva_gasto_obra()` (lineal o S-curve), `flujo_ventas_usd()` (reutiliza `construir_cronograma` de `calculadora.py`), `peak_capital_requirement()` |
| `financiamiento.py` | `calcular_financiamiento()` — gira deuda solo cuando el equity se agotó y el flujo es negativo, interés sobre saldo real, amortiza con el primer flujo positivo |
| `financiero.py` | `calcular_metricas()` — ROI, ROIC, TIR (vía `tir()` de `calculadora.py`), VAN, Equity Multiple, Payback |
| `sensibilidad.py` | `correr_sensibilidad()` (matriz), `buscar_punto_de_equilibrio()` (break-even por bisección), `precio_maximo_terreno_por_roi_objetivo()` |
| `escenarios.py` | `correr_escenarios()` — Conservador/Base/Optimista o escenarios custom |
| `investor_layer.py` | `capa_inversor()` / `exportar_json()` — filtra qué datos son seguros para un inversor y exporta JSON |
| `proyecto.py` | `Proyecto` — orquestador único; `FichaProyecto`, `ResultadoProyecto` |
| `cotizacion.py` | Fuente de cotización USD/PYG real — `conversor_vigente()`, cache versionado, ver sección propia abajo |
| `exportar_herrera_completo.py` | Exporta los 3 Ángulos (bajo/alto) de HERRERA-001 a un JSON único — es lo que leen `build_herrera001_memorandum.js` y `build_herrera001_investor_book.js` |

## Cómo se arma un proyecto (patrón general)

```python
from dev_engine.moneda import Monto, TipoDeCambio, ConversorMoneda
from dev_engine.costos import (Partida, ItemParametrizable, CostoTerreno,
    GrupoPartidas, GrupoParametrizable, Superficies, ContingenciaConfig, EstructuraCostos)
from dev_engine.cashflow import VentaUnidad
from dev_engine.financiamiento import TerminosFinanciamiento
from dev_engine.proyecto import FichaProyecto, Proyecto

conversor = ConversorMoneda(TipoDeCambio(valor=7300.0, fecha="2026-08-19", fuente="BCP"))

terreno = CostoTerreno(precio_compra=Monto(360_000, "USD"))
directos = GrupoPartidas("Costos directos", partidas=[
    Partida(codigo="D1", categoria="Estructura", cantidad=1, costo_unitario=Monto(500_000, "USD")),
])
# ... indirectos/desarrollo/comerciales/impuestos como GrupoParametrizable ...

estructura = EstructuraCostos(terreno=terreno, directos=directos, ...)
ventas = [VentaUnidad("U1", mes_venta=0, precio_usd=1_000_000, anticipo_pct=20, meses_cuotas=12, saldo_entrega_pct=10)]
terminos = TerminosFinanciamiento(capital_propio_usd=800_000, tasa_anual_pct=14.0)

proyecto = Proyecto(FichaProyecto("Mi Proyecto", "Villa Morra"), estructura, ventas, meses_obra=12, conversor=conversor, terminos_financiamiento=terminos)
resultado = proyecto.correr()
print(resultado.margen_usd, resultado.metricas.roi_pct, resultado.metricas.tir_anual_pct)
```

## Scripts ejecutables

```bash
cd production/app/backend
python3 -m dev_engine.validar_herrera            # Test de reconstruccion S68 (3 Angulos, 6/6 OK)
python3 -m dev_engine.test_parametrizacion         # Test de parametrizacion S69 + sensibilidad + escenarios
python3 -m dev_engine.demo_flujo_realista_angulo2  # Demo de cash flow mensual realista, financiamiento mixto
```

## Cotización USD/PYG (`cotizacion.py`)

`conversor_vigente()` es la forma recomendada de obtener un `ConversorMoneda` en
cualquier script: lee `config/tipo_cambio_pyg_usd.json` (cache real, con
fecha+fuente), y si no existe o tiene más de 7 días, cae al valor de
`config/parametros_dev_engine.json` **avisando explícitamente** que está usando
un fallback — nunca reusa un valor viejo en silencio.

```bash
python3 -m dev_engine.refrescar_tipo_cambio                        # fetch en vivo (open.er-api.com)
python3 -m dev_engine.refrescar_tipo_cambio --bcp 7250 2026-08-22   # carga manual, cotización oficial BCP
```

**Fuente primaria: `open.er-api.com`** (respaldado por exchangerate-api.com) —
gratuito, sin API key, actualizado a diario. Es Nivel 3 de
`market-intelligence/sources/SOURCE_REGISTRY.md` (agregador de mercado), no el
Banco Central del Paraguay directamente — no se encontró un endpoint del BCP
navegable por script en el tiempo disponible de esta sesión (su sitio usa un
menú dinámico sin URLs estables); queda como pendiente real, ver abajo.
`fuente_bcp_manual()` permite cargar a mano la cotización oficial del BCP
cuando se tenga a la vista, sin esperar a que se automatice.

**Nota de entorno**: en esta sesión, el fetch en vivo por `urllib` falló con un
error de verificación SSL específico del sandbox de este agente (no de la
fuente) — se sembró el cache con el mismo dato real, obtenido vía el Browser
tool en la misma sesión. En un entorno normal (la máquina de Meridiano, un
servidor propio) `refrescar_tipo_cambio.py` debería funcionar sin este rodeo;
si no, revisar el CA bundle de `certifi` o la política de red del entorno.

## Qué NO incluye todavía (pendiente, ver el reporte final §15)

- **Cotización oficial del BCP automatizada** — hoy la fuente automatizable es
  un agregador de mercado (Nivel 3), no el Banco Central directamente (Nivel 1).
  `fuente_bcp_manual()` cubre el caso de uso real mientras tanto.
- **Price Escalation Engine (S25)** y **matriz de precio por etapa (S24)** como
  módulo propio — hoy se puede modelar manualmente variando `precio_usd` por
  `VentaUnidad`, pero no hay un motor dedicado que aplique el % de escalamiento
  automáticamente etapa por etapa.
- **Auditoría matemática automática (S57-S58)** como validador independiente —
  hoy la única verificación automática es el propio test de reconstrucción de
  Herrera.
- **Conexión de los otros generadores** (`build_herrera001_presentacion_inversores.js`,
  el Investment Summary de una página) al mismo JSON — solo se conectaron el
  Memorándum y el Investor Book, que fueron los pedidos explícitamente.
