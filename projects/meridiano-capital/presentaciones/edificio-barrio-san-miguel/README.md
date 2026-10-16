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
- **Precio:** USD 350.000 publicado. La venta rápida a USD 290.000 es una **sugerencia de Meridiano Capital**, basada en el estudio de mercado y las referencias de la zona. No es un precio informado por el propietario.
- **Superficies:** terreno de 12 × 30 m (360 m²) y unos 400 m² construidos, en 3 pisos.
- **Etapas de obra:**
  - 1998: primera etapa, hasta el 1er piso.
  - 2016: se termina la segunda etapa.
  - Los planos municipales están aprobados según el propietario. No se revisaron.
- **Unidades:** 12 en total (confirmado por el founder el 16/10/2026).
  - 3 monoambientes.
  - 5 departamentos de 1 dormitorio, 1 de 2 dormitorios y 1 de 4 dormitorios.
  - 1 casa de 2 habitaciones en la parte de atrás.
  - 1 salón comercial al frente.
- **Renta y gastos:** ingresos de Gs 20.000.000 por mes y gastos de Gs 2.700.000 por mes. Los gastos **incluyen IVA, mantenimiento y administración**; faltan todos los demás.
- **Ocupación:** 100%. Todos los contratos están vigentes, verificados por el founder.
- **Opcional:** el estacionamiento techado lindero, en un terreno de 12 × 30 m, cuesta USD 120.000.
- **Ubicación:** https://maps.app.goo.gl/KJkB7gKmRfRJdXdA7, en Ciudad del Este (confirmado por el founder). Reemplaza el enlace anterior, que Google Maps rotulaba como Presidente Franco.

## Supuestos
- **Tipo de cambio:** se usa el vigente en `_config`, Gs 5.698,03 (BCP, referencial del 14/10/2026). Es el último dato oficial que se pudo verificar el 16/10/2026.
  - El estudio usó Gs 5.750 (BCP, intradía 16/10 09:00, no cierre). Por eso sus porcentajes (11,93% / 10,32%) difieren levemente de los del deck (12,03% / 10,41%).
- **Neta conservadora:** se calcula sobre el saldo informado. IVA, mantenimiento y administración no se vuelven a descontar, porque ya están en los Gs 2,7 M.
  - Vacancia de referencia: 4%.
  - Otros gastos no informados: **supuesto** de Gs 6.000.000 por año, igual que en San José.
  - IRE: 10%.
  - Los gastos informados se proyectan en proporción a la renta, porque IVA y administración son un % del alquiler.
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
| Neta antes de IRE | 9,63% | 11,62% |
| Neta conservadora | 8,66% | 10,46% |
| TIR hipotética (conservador / base / optimista) | 8,4 / 10,6 / 12,2% | 10,2 / 12,4 / 14,0% |
| Con estacionamiento (caso mecánico, sin renta incremental): bruta / saldo | 8,96% / 7,75% | 10,27% / 8,89% |

## Discrepancias y pendientes
- **Rentabilidad publicada:** el aviso publica "9% de rentabilidad anual" sin informar su base. Queda entre la neta antes de IRE (9,63%) y la neta final (8,66%).
- **Documentación pendiente:**
  - Renta por contrato, vencimientos y reajustes, para completar `fuente/estudio/Rent_roll_San_Miguel_para_completar.csv`. Las tipologías ya están cargadas.
  - Los gastos no incluidos en los Gs 2,7 M (impuesto inmobiliario, seguros y otros).
  - Inspección técnica y CAPEX.
  - Si los 400 m² incluyen la casa y las circulaciones.
- **Estacionamiento:** faltan capacidad, superficie techada, título, gastos y contratos.
- **Comparables:** faltan comparables de monoambientes básicos, de departamentos de 4 dormitorios, de una casa de 2 dormitorios y del salón. V02, V07 y V08 están por debajo del precio por m²: hay que confirmarlos antes de ajustar.
- **Fotos:** son del propietario y algunas parecen retocadas. En la foto de cocina y estar se recortó un retrato familiar que se veía en la pared.

## Registro de cambios
- **2026-10-16 (v1, actualización 2):** la lámina 3 usa la vista satelital de la ubicación. Se corrige el origen del precio de venta rápida: USD 290.000 es una sugerencia de Meridiano Capital, no del propietario.
- **2026-10-16 (v1, actualización):** datos confirmados por el founder.
  - Nueva ubicación: Ciudad del Este.
  - Tipologías: 3 monoambientes, 5 departamentos de 1 dormitorio, 1 de 2 y 1 de 4, y la casa de 2 habitaciones.
  - Los gastos incluyen IVA, mantenimiento y administración.
  - Contratos vigentes verificados.
  - La neta conservadora sube de 6,99% a 8,66% (con USD 350.000) porque ya no se descuentan dos veces IVA, administración y mantenimiento.
- **2026-10-16 (v1):** primera versión.
