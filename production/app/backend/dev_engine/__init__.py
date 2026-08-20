"""
Development Cost & Financial Engine de Meridiano Capital.

Motor parametrizable de costos, precios, flujo de fondos y rentabilidad para
proyectos de desarrollo inmobiliario. Ver `documentation/development-financial-engine/`
para la auditoria y arquitectura completa, y `contracts/cases/HERRERA-001/47-...md`
para el test de reconstruccion contra un caso real ya confirmado.

Separacion estricta (mismo principio que production/app/backend/calculadora.py):
  - LOGICA (este paquete): metodologia de calculo. No cambia con el mercado.
  - PARAMETROS (config/parametros_dev_engine.json + knowledge-base/investment/
    market-intelligence/): variables de mercado y de proyecto. Si cambian.

Principio "unica fuente de verdad" (S51 del prompt maestro): este paquete LEE de
knowledge-base/investment/market-intelligence/ (via los Skills SK-11/12/13 ya
existentes) y de calculadora.py (TIR/VAN, cronograma de pagos) - nunca duplica
esos calculos ni esos datos.

Modulos:
  moneda          - capa de conversion USD/PYG, tipo de cambio versionado
  costos          - jerarquia de costos: Terreno+Directos+Indirectos+Desarrollo+
                    Financieros+Comerciales+Impuestos+Contingencia
  financiamiento  - Financing Cost Engine, interes sobre saldo real del cash flow
  cashflow        - Monthly Project Cash Flow (egresos+ingresos+neto+acumulado+peak capital)
  financiero      - ROI/TIR/VAN/Equity Multiple/Payback (envuelve calculadora.py)
  sensibilidad    - matrices de sensibilidad + Break-even Engine
  escenarios      - Scenario Engine (Conservador/Base/Optimista, combinables)
  investor_layer  - capa de datos segura para inversores + export JSON
  proyecto        - ficha maestra del proyecto + orquestador
"""
