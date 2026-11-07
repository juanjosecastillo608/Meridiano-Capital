# Edificio Barrio San Miguel — presentación comercial v1

Este deck sigue el maestro **Edificio Barrio San José**, con la misma estructura, el mismo diseño y el mismo método de cálculo. Tiene 21 láminas y se adapta a las reglas del paquete de estudio de mercado v2.0 del 17/10/2026 (`fuente/estudio/`):
- Analiza **dos precios**: el publicado y el de venta rápida.
- Separa el **saldo informado** de la **neta conservadora**.
- Muestra la TIR **solo como hipótesis explícita**.
- Presenta el **estacionamiento lindero** como un bloque opcional.
- Agrega una lámina de **referencias de venta**.

- PDF: `Edificio_Barrio_San_Miguel_Meridiano_Capital_v1.pdf`
- Fuente: `fuente/`. Se regenera con `../build_presentaciones.py`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).
- Estudio de mercado: `fuente/estudio/`. Contiene los datos, el informe, las instrucciones, `modelar_san_miguel.mjs` y el rent roll para completar. El nombre del cliente de un ACM anterior se omitió por PII_POLICY.

## Datos confirmados
- **Precio:** USD 350.000 publicado por el propietario. La venta rápida a USD 290.000 es una **sugerencia de Meridiano Capital**, basada en el estudio de mercado y las referencias de la zona.
- **Terreno:** 12 × 30 m (360 m²).
- **Unidades:** 12, con un total de **592 m²**. Las superficies, alquileres y distribución vienen de la planilla por unidad (paquete v2.0, 17/10/2026), con la condición **"Verificado por Meridiano, sujeto a constancia en planos municipales"**.
  - Planta baja: salón comercial de 40 m² (Gs 1.000.000) y 3 monoambientes de 30 m² (Gs 2.700.000 cada uno).
  - Piso 1: departamento de 4 dormitorios, 60 m² (Gs 2.000.000), y de 2 dormitorios, 58 m² (Gs 1.500.000).
  - Piso 2: departamento de 4 dormitorios, 65 m² (Gs 2.500.000), y de 2 dormitorios, 58 m² (Gs 1.500.000).
  - Piso 3: dos departamentos de 2 dormitorios, 58 m² (Gs 1.500.000 y Gs 1.400.000), y uno de 1 dormitorio, 40 m² (Gs 1.200.000).
  - Fondo: casa de 2 habitaciones, 65 m² (Gs 1.500.000).
- **Renta:** Gs 22.200.000 por mes. Los tres monoambientes aportan el 36,49%.
- **Gastos:** Gs 2.700.000 por mes, que **incluyen IVA, mantenimiento y administración**; faltan todos los demás.
- **Contratos:** los 12 están vigentes, verificados por el founder.
- **Etapas de obra:** 1998 (hasta el 1er piso) y 2016. Los planos municipales están aprobados según el propietario.
- **Ubicación:** https://maps.app.goo.gl/KJkB7gKmRfRJdXdA7, en Ciudad del Este (confirmado por el founder).
- **Opcional:** el estacionamiento lindero de 12 × 30 m cuesta USD 120.000.

## Supuestos
- **Tipo de cambio:** el vigente en `_config`. Al 07/11/2026: Gs 6.480,35 (BCP, cotización referencial del 06/11/2026). El estudio v2.0 usó Gs 5.770,91 (cierre interbancario del 16/10/2026).
- **Neta conservadora:** sobre el saldo, se descuentan vacancia 4%, otros gastos no informados (supuesto de Gs 6.000.000 por año) e IRE 10%. IVA, mantenimiento y administración no se descuentan dos veces.
- **TIR hipotética a 5 años:** la inversión es el precio, los flujos son la neta conservadora y la salida es al año 5, menos el IVA de venta de 1,5% (D-082). Escenarios (alquiler / valorización): 0/0%, 3/2% y 5/3,5%.
- **Costo de construcción nueva:** USD 650/m² sobre 592 m².

## Resultados (TC Gs 6.480,35 del 06/11/2026; regenerados el 07/11/2026)
| | USD 350.000 | USD 290.000 |
|---|---:|---:|
| Bruta | 11,75% | 14,18% |
| Saldo ÷ precio | 10,32% | 12,45% |
| Neta antes de IRE | 9,58% | 11,57% |
| Neta conservadora | 8,62% | 10,41% |
| TIR hipotética (conservador / base / optimista) | 8,4 / 10,5 / 12,1% | 10,2 / 12,4 / 14,0% |
| Con estacionamiento (caso mecánico, sin renta incremental): bruta / saldo | 8,75% / 7,68% | 10,03% / 8,81% |
| USD por m² de unidades | 591 | 490 |

Con el TC del 16/10 (Gs 5.770,91) eran 13,19% / 15,92% de bruta y 9,68% / 11,69% de neta conservadora. La baja se explica solo por el tipo de cambio.

## Discrepancias y pendientes
- **Composición:** la planilla (1 de 1 dormitorio, 4 de 2 y 2 de 4) reemplaza la composición enviada por mensaje el 16/10 (5 de 1, 1 de 2 y 1 de 4). **A confirmar por el founder.**
- **Superficies y niveles:** los 592 m² y los cuatro niveles deben constar en los planos municipales. Las circulaciones y áreas comunes no están desglosadas.
- **Gastos:** faltan los no incluidos en los Gs 2,7 M (impuesto inmobiliario, seguros y otros).
- **Contratos:** faltan vencimientos, reajustes e historial de cobro.
- **Monoambientes:** cobran Gs 90.000/m², muy por encima del resto. Hay que confirmar sus condiciones (mobiliario, servicios) antes de suponer que se repiten con un nuevo inquilino.
- **Comparables:** la referencia de Riachuelo no figura en el listado desde hace 14 días. Faltan referencias de monoambientes básicos, de 4 dormitorios compactos, de la casa y del salón.
- **Estacionamiento:** faltan capacidad, superficie techada, título, gastos y contratos.
- **Planilla original:** `Edificio-Barrio-San-Jose-Aliquileres-Octubre26.xlsx` todavía no se recibió; la extracción por celdas está en `fuente/estudio/`.

## Registro de cambios
- **2026-11-07:** se regeneró con el TC del BCP del 06/11/2026 (Gs 6.480,35). Las rentabilidades en dólares bajan por la suba del dólar; los datos del edificio no cambian.
- **2026-10-17 (v1, actualización 4):** paquete de estudio v2.0.
  - Planilla por unidad: 592 m² y Gs 22.200.000 por mes.
  - Composición 1/4/2 y cuatro niveles (planta baja y tres pisos).
  - Tipo de cambio Gs 5.770,91 (cierre BCP del 16/10).
  - Nueva lámina 6 con el detalle por unidad.
  - Sensibilidad con un monoambiente vacío.
  - Se mantienen las correcciones del founder del 16/10.
- **2026-10-16 (v1, actualización 3):** se quita de todo el análisis (láminas 12 y 20, README y datos del estudio) la rentabilidad publicada en el aviso. Meridiano Capital no la valida: el informe usa solo las cifras calculadas con su propia base de datos.
- **2026-10-16 (v1, actualización 2):** la lámina 3 usa la vista satelital de la ubicación. Se corrige el origen del precio de venta rápida: USD 290.000 es una sugerencia de Meridiano Capital, no del propietario.
- **2026-10-16 (v1, actualización):** datos confirmados por el founder.
  - Nueva ubicación: Ciudad del Este.
  - Tipologías: 3 monoambientes, 5 departamentos de 1 dormitorio, 1 de 2 y 1 de 4, y la casa de 2 habitaciones.
  - Los gastos incluyen IVA, mantenimiento y administración.
  - Contratos vigentes verificados.
  - La neta conservadora sube de 6,99% a 8,66% (con USD 350.000) porque ya no se descuentan dos veces IVA, administración y mantenimiento.
- **2026-10-16 (v1):** primera versión.
