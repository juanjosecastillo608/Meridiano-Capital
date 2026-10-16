# Edificio Barrio San Miguel — presentación comercial v1

Este deck sigue el maestro **Edificio Barrio San José**, con la misma estructura, el mismo diseño y el mismo método de cálculo. Tiene 21 láminas y se adapta a las reglas del paquete de estudio de mercado del 16/10/2026 (`fuente/estudio/`):
- Analiza **dos precios**: el publicado y el de venta rápida.
- Separa el **saldo informado** de la **neta conservadora**.
- Muestra la TIR **solo como hipótesis explícita**.
- Presenta el **estacionamiento lindero** como un bloque opcional.
- Agrega una lámina de **referencias de venta**.

- PDF: `Edificio_Barrio_San_Miguel_Meridiano_Capital_v1.pdf`
- Fuente: `fuente/`. Se regenera con `../build_presentaciones.py`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).
- Estudio de mercado: `fuente/estudio/`. Contiene los datos, el informe, las instrucciones, `modelar_san_miguel.mjs` y el rent roll para completar. El nombre del cliente de un ACM anterior se omitió por PII_POLICY.

## Datos confirmados (informados por el founder o el propietario, no auditados)
- **Precio:** USD 350.000 publicado. El propietario informa USD 290.000 para venta rápida.
- **Superficies:** terreno de 12 × 30 m (360 m²) y unos 400 m² construidos, en 3 pisos.
- **Etapas de obra:**
  - 1998: primera etapa, hasta el 1er piso.
  - 2016: se termina la segunda etapa.
  - Los planos municipales están aprobados según el propietario. No se revisaron.
- **Unidades:** 12 en total.
  - 7 departamentos de 1, 2 y 4 dormitorios. No se sabe cuántos hay de cada tipo.
  - 3 monoambientes, adicionales a los departamentos.
  - 1 salón comercial al frente.
  - 1 casa de 2 dormitorios en la parte de atrás.
- **Renta y gastos:** ingresos de Gs 20.000.000 por mes, gastos de Gs 2.700.000 por mes (sin desglose) y 100% de ocupación.
- **Opcional:** el estacionamiento techado lindero, en un terreno de 12 × 30 m, cuesta USD 120.000.
- **Ubicación:** https://maps.app.goo.gl/b1ppbnL6vLtBu2d39

## Supuestos
- **Tipo de cambio:** se usa el vigente en `_config`, Gs 5.698,03 (BCP, referencial del 14/10/2026). Es el último dato oficial que se pudo verificar el 16/10/2026.
  - El estudio usó Gs 5.750 (BCP, intradía 16/10 09:00, no cierre). Por eso sus porcentajes (11,93% / 10,32%) difieren levemente de los del deck (12,03% / 10,41%).
- **Neta conservadora:** se calcula sobre el saldo informado.
  - Se descuentan IVA 5%, vacancia 4%, administración 8%, mantenimiento 5% e IRE 10%, como en el maestro.
  - Puede duplicar partidas que ya estén incluidas en los Gs 2,7 M. Si es así, la neta real es mayor.
  - El salón tributa IVA 10%, pero su renta no está desagregada.
- **TIR hipotética a 5 años:**
  - Inversión: el precio de compra.
  - Flujos: la neta conservadora.
  - Salida: venta al año 5, menos el IVA de venta de 1,5% (D-082).
  - Escenarios (alquiler / valorización): 0/0%, 3/2% y 5/3,5%.
  - No incluye gastos de adquisición ni CAPEX.
- **Costo de construcción nueva:** USD 650/m² (calidad básica), como en el maestro.

## Resultados (TC Gs 5.698,03)
| | USD 350.000 | USD 290.000 |
|---|---:|---:|
| Bruta | 12,03% | 14,52% |
| Saldo informado ÷ precio | 10,41% | 12,56% |
| Neta conservadora | 6,99% | 8,43% |
| TIR hipotética (conservador / base / optimista) | 6,7 / 8,9 / 10,5% | 8,2 / 10,4 / 12,1% |
| Con estacionamiento (caso mecánico, sin renta incremental): bruta / saldo | 8,96% / 7,75% | 10,27% / 8,89% |

## Discrepancias y pendientes
- **Rentabilidad publicada:** el aviso publica "9% de rentabilidad anual" sin informar su base. No coincide con ninguno de los cálculos.
- **Ubicación:** Google Maps rotula el punto como **Presidente Franco**. Hay que confirmar el municipio con la finca, el padrón y el catastro.
- **Documentación pendiente:**
  - Rent roll por unidad (`fuente/estudio/Rent_roll_San_Miguel_para_completar.csv`), contratos, cobros y si el IVA está incluido.
  - Desglose de los gastos.
  - Inspección técnica y CAPEX.
  - Si los 400 m² incluyen la casa y las circulaciones.
- **Estacionamiento:** faltan capacidad, superficie techada, título, gastos y contratos.
- **Comparables:** faltan comparables de monoambientes básicos, de departamentos de 4 dormitorios, de una casa de 2 dormitorios y del salón. V02, V07 y V08 están por debajo del precio por m²: hay que confirmarlos antes de ajustar.
- **Fotos:** son del propietario y algunas parecen retocadas. En la foto de cocina y estar se recortó un retrato familiar que se veía en la pared.
