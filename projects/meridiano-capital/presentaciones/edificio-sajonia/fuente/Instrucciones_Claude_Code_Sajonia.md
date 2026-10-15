# Instrucciones para Claude Code: Edificio Sajonia

Este paquete contiene evidencia pública de oferta, no una tasación ni un proyecto aprobado. Leer primero Estudio_mercado_Sajonia.md y después Datos_mercado_Sajonia.json; usar Edificio-Sajonia.pdf solo para los datos recibidos y reconocer que sus imágenes de p. 6 son generadas con IA.

## Objetivo

Completar un modelo para inversor de Meridiano Capital que compare oficinas, conversión residencial y uso mixto en Asunción. Incluir monoambientes, uno y dos dormitorios como tipologías separadas; excluir el activo Barrio San José de Ciudad del Este.

## Contrato de datos

- **Moneda:** mantener PYG y USD separadas; una conversión exige tipo de cambio, fuente, fecha y criterio verificables. No elegir una cotización implícita a partir de anuncios contradictorios.
- **Vacíos:** null significa dato faltante, no cero. No mostrar rentabilidad como 0% cuando es indeterminada.
- **Precio del sujeto:** usar USD 220.000 como precio pedido confirmado y USD 185.000 como escenario de venta rápida indicado por el usuario. No volver a pedir estos precios ni adoptar USD 250.000 del texto público.
- **Área del sujeto:** el ACM recibido reporta 803 m² construidos; subject.reported_built_area conserva el dato documental sin validación técnica. subject.built_area_m2 y área neta siguen pendientes de planos. No convertir 803 m² en área rentable.
- **ACM histórico:** leer historical_acm y su auditoría. USD 234.325 es opinión histórica de marzo de 2025, no valor actual; sus 4 ventas de 2024 no están comprobadas independientemente. No reutilizar la columna por m² con moneda inconsistente ni el promedio mixto.
- **Superficies:** área propia, construida, cubierta y total no son equivalentes. Ninguna área construida es automáticamente área neta alquilable.
- **Precios de referencia:** asking_price es precio publicado, no precio de cierre. availability_confirmed=false para toda la muestra; confirmar antes de uso definitivo.
- **Homologación:** no aplicar porcentajes por cochera, antigüedad, muebles o amenities sin respaldo; mantener precio paquete si no se separan componentes. Registrar supuestos aparte.
- **Exclusiones:** S1 está etiquetado Vendido y queda fuera de oferta actual; O2 y T4 quedan fuera de estadística por m². No duplicar productos de excluded_or_duplicate_listings ni grupos duplicados.
- **Geografía:** etiquetas Sajonia de anunciantes no acreditan barrio catastral ni distancia al sujeto. S4 es contextual ampliado.

## Modelo a implementar

Crear pestañas o módulos para entrada del inmueble, rent roll, referencias, programa por nivel, CAPEX, gastos, escenarios, flujos y resumen del inversor. Solicitar las entradas required_inputs del JSON antes de cerrar valores.

Para cada alternativa, mantener:

1. Área construida confirmada, áreas comunes/no aprovechables y área neta por uso.
2. Unidades posibles según anteproyecto y aprobación, no división aritmética de 803 m².
3. Tamaño, estado, equipo y cochera de cada unidad; canon neto de IVA/expensas cuando pueda determinarse.
4. Renta potencial al 100%, ingreso efectivo con ocupación asumida, gastos del propietario y NOI separados.
5. Precio de compra, gastos de adquisición, CAPEX cotizado, contingencia, costos de colocación y cronograma.
6. Escenarios conservador/base/mejora con cada supuesto visible; bandas del estudio como referencias, no renta garantizada.
7. Rentabilidad bruta sobre compra y rendimiento neto sobre costo total con nombres distintos.
8. TIR únicamente con flujos temporales completos, plazo, inversión y salida explícita.

## Criterio de evaluación

Comparar incremento de NOI, inversión incremental, tiempo sin renta y riesgos técnicos frente a mantener oficinas. No seleccionar uso mixto solo porque diversifica; valorar separación de accesos, seguridad, privacidad y costos adicionales.

Para la conversión, solicitar planos, iluminación/ventilación, cocina y baño por unidad, accesibilidad, evacuación, estacionamiento y aprobación del uso. Consultar el [Plan Regulador municipal](https://www.asuncion.gov.py/plan-regulador) y la [Ordenanza 468/14](https://www.asuncion.gov.py/wp-content/uploads/2019/06/ord-2014-468.pdf) con profesional local; estos enlaces no prueban autorización para la parcela.

## Salidas esperadas

- **Cuadro por tipología:** alquiler actual, referencia publicada, objetivo justificado, brecha y confianza.
- **Cuadro por alternativa:** mix viable, renta potencial/efectiva, CAPEX, NOI, costo total y rendimiento.
- **Sensibilidades:** ocupación, renta, costo de obra, plazo de puesta en servicio y precio de compra; parámetros identificados como supuestos.
- **Valoración:** edificios completos separados de unidades; venta por departamentos solo si división está acreditada.
- **Resumen:** recomendación condicionada, datos pendientes y trazabilidad de todas las cifras.

## Pruebas obligatorias

Validar JSON, unicidad de IDs y unidades de moneda/período. No sumar rentas entre monedas ni confundir valor mensual con anual; no dividir por cero ni por null.

Los precios ya permiten sensibilidades matemáticas de renta necesaria, incluidas en yield_hurdle_sensitivity; esas cifras no son una previsión de alquiler. Bloquear el rendimiento operativo del edificio mientras falten renta/programa viable y moneda homologada. Comprobar que sumas de áreas no exceden área utilizable confirmada y que los costos trasladados no se sumen al NOI del propietario.

Mostrar advertencias visibles por fotografías IA, falta de cocheras, identidad del anuncio sin confirmar y texto público de precio discrepante (USD 250.000), resuelto para el encargo por confirmación del usuario. Mantener citas de cada referencia dentro del informe final, no solo una lista genérica.

## Actualización de precios y costos

Cruzar las tres alternativas de uso con price_scenarios: USD 220.000 y USD 185.000. El costo de adquisición efectivo sigue siendo un supuesto de compra, no una transacción cerrada.

El ACM utiliza 8,9% de gastos de venta (5,5% comisión, 2,4% impuesto y 1% escribanía). historical_expense_model_sensitivity reproduce la matemática condicional para el vendedor; no acredita impuestos vigentes ni costos del comprador. Exigir confirmación contractual/tributaria antes de incluirlos en un flujo definitivo.
