# Registro de cambios: Edificio Barrio San Miguel

Versión 2.0 | 17 de octubre de 2026.

La nueva planilla sustituye las superficies y los alquileres agregados de la versión 1.0. El usuario confirmó que pertenece a San Miguel pese a que el nombre del archivo dice San José y determinó la condición “Verificado por Meridiano, sujeto a constancia en planos municipales”.

> **Correcciones del founder aplicadas (Meridiano Capital, 16–17/10/2026), que prevalecen sobre este texto:**
> - **Ubicación:** Ciudad del Este, confirmada con el enlace https://maps.app.goo.gl/KJkB7gKmRfRJdXdA7.
> - **Gastos:** los Gs 2.700.000 incluyen IVA, mantenimiento y administración; faltan los demás.
> - **Contratos:** los doce están vigentes y fueron verificados por el founder.
> - **Venta rápida:** USD 290.000 es una sugerencia de Meridiano Capital, no un precio del propietario.
> - **Rentabilidad del aviso:** el 9% publicado queda excluido de todo el análisis.
> - **Derivados:** `Modelo_inversion_San_Miguel.json` y `Rent_roll_San_Miguel.csv` se regeneran con `node modelar_san_miguel.mjs` e incorporan estas correcciones.
> - **Planilla original:** `fuentes/Edificio-Barrio-San-Jose-Aliquileres-Octubre26.xlsx` todavía no se recibió en el repositorio; la extracción por celdas sí está incluida.

## Premisas sustituidas y mantenidas

| Campo | Versión anterior | Versión actual | Procedencia |
|---|---:|---:|---|
| Superficie base | 400 m² aproximados | 592 m² de unidades | `Hoja1!C3:C15` |
| Renta mensual | Gs. 20.000.000 | Gs. 22.200.000 | `Hoja1!D3:D15` |
| Gastos mensuales | Gs. 2.700.000 | Gs. 2.700.000, mantenidos | Dato anterior; nueva planilla sin gastos |
| Saldo mensual | Gs. 17.300.000 | Gs. 19.500.000 | Renta nueva menos gasto mantenido |
| Saldo anual | Gs. 207.600.000 | Gs. 234.000.000 | Anualización |
| Composición de siete departamentos | Cantidad por dormitorios desconocida | 1 de un dormitorio, 4 de dos y 2 de cuatro | `Hoja1!B7:B13` |
| Niveles | Tres pisos descriptos | PB, 1, 2 y 3; constatar en planos | `Hoja1!A3:A13` |
| Monoambientes | 3 adicionales | Sin cambio; 30 m² y Gs. 2.700.000 cada uno | `Hoja1!A4:D6` |
| Salón / casa | Áreas y alquileres desconocidos | 40 m² y Gs. 1.000.000 / 65 m² y Gs. 1.500.000 | Filas 3 y 14 |
| Precios del edificio | USD 350.000 / USD 290.000 | Sin cambio | Confirmación anterior del propietario |
| Estacionamiento | Opción USD 120.000 | Sin cambio; fuera del flujo actual | Confirmación anterior del propietario |

La nueva superficie es 48% mayor y la renta 11% mayor. No debe interpretarse que la compra incluye el estacionamiento ni que la planilla actualiza gastos o acredita cobranzas.

## Tipo de cambio y consecuencias

La versión anterior utilizaba una referencia intradía de Gs. 5.750/USD del 16/10 a las 09:00. Esta versión utiliza Gs. 5.770,91/USD, cierre acumulado del 16/10 a las 13:00 y último publicado disponible al consultar el sábado 17/10, según el BCP; se recalcularon todas las conversiones y no se atribuye una cotización propia al sábado ([BCP](https://www.bcp.gov.py/webapps/web/cotizacion/referencial-fluctuante-interbancario)).

| Indicador | Resultado actual |
|---|---:|
| Bruta anual a USD 350.000 | 13,19% |
| Bruta anual a USD 290.000 | 15,92% |
| Saldo anual / precio a USD 350.000 | 11,59% |
| Saldo anual / precio a USD 290.000 | 13,98% |
| Precio por m² de unidades a USD 350.000 | USD 591,22 |
| Precio por m² de unidades a USD 290.000 | USD 489,86 |
| Renta de tres monoambientes / ingreso total | 36,49% |

Las rentabilidades no son netas auditadas. Cambian por la renta nueva y por el FX; el menor precio por m² se explica por un denominador de superficie mayor, no por una reducción del precio solicitado.

## Cambios de evidencia y archivos

- **Rent roll:** reemplaza la plantilla vacía por doce unidades completas en sus datos de área y canon; se mantiene la trazabilidad por fila y celda. Los IDs siguen siendo identificadores de trabajo.
- **Planilla original:** se conserva intacta y con su nombre de carga; la extracción incluye su huella SHA-256 y los totales/formulas de Excel.
- **Superficie:** la suma ya incluye salón y casa; base propia/cubierta/bruta y áreas comunes no desglosadas quedan pendientes de planos, sin adiciones porcentuales.
- **Flujos y escenarios:** se regeneran ambos precios, opciones de estacionamiento y sensibilidades; se agrega vacancia de un monoambiente real.
- **Mercado:** las referencias se reconsultan, manteniendo faltantes y sin inventar cierres. R01 presenta alerta de ausencia del listado de la inmobiliaria; V05 conserva consulta del 16/10 tras un fallo de reconsulta el 17/10.
- **Conclusiones pendientes:** el alquiler de mercado y la valoración independiente siguen sin determinar por falta de homologación de condiciones y evidencia, no por falta de rentas y áreas.
- **Archivos derivados:** modelo JSON y CSV se generan desde el JSON fuente; la plantilla vacía anterior deja de formar parte de la entrega.

La condición de verificación se aplica a la planilla según la instrucción del usuario. El paquete conserva separadas la validación municipal pendiente, la auditoría de cobros/gastos y la evaluación de mercado.
