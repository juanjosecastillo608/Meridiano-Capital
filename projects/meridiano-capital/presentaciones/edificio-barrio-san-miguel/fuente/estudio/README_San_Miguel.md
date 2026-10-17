# Paquete para Claude Code: Edificio Barrio San Miguel

Meridiano Capital | Versión 2.0 | 17 de octubre de 2026.

Paquete independiente de los estudios de San José y Sajonia. Incorpora el detalle de doce unidades, 592 m² y Gs. 22.200.000/mes, “Verificado por Meridiano, sujeto a constancia en planos municipales”, y trata el estacionamiento de USD 120.000 como opción separada.

> **Correcciones del founder aplicadas (Meridiano Capital, 16–17/10/2026), que prevalecen sobre este texto:**
> - **Ubicación:** Ciudad del Este, confirmada con el enlace https://maps.app.goo.gl/KJkB7gKmRfRJdXdA7.
> - **Gastos:** los Gs 2.700.000 incluyen IVA, mantenimiento y administración; faltan los demás.
> - **Contratos:** los doce están vigentes y fueron verificados por el founder.
> - **Venta rápida:** USD 290.000 es una sugerencia de Meridiano Capital, no un precio del propietario.
> - **Rentabilidad del aviso:** el 9% publicado queda excluido de todo el análisis.
> - **Derivados:** `Modelo_inversion_San_Miguel.json` y `Rent_roll_San_Miguel.csv` se regeneran con `node modelar_san_miguel.mjs` e incorporan estas correcciones.
> - **Planilla original:** `fuentes/Edificio-Barrio-San-Jose-Aliquileres-Octubre26.xlsx` todavía no se recibió en el repositorio; la extracción por celdas sí está incluida.

## Contenido

| Archivo | Función |
|---|---|
| `estudio-mercado-san-miguel.pplx.md` | Estudio A–K, comparables, flujos, escenarios, límites y tabla de decisión |
| `Datos_mercado_San_Miguel.json` | Datos fuente, doce unidades detalladas, condición de verificación, FX, comparables, historial y faltantes |
| `Modelo_inversion_San_Miguel.json` | Resultados calculados: edificio solo, estacionamiento opcional y sensibilidades |
| `Instrucciones_Claude_Code_San_Miguel.md` | Reglas de integración, pendientes, controles y salida esperada |
| `Rent_roll_San_Miguel.csv` | Doce unidades con áreas y rentas completas, procedencia por fila y métricas |
| `modelar_san_miguel.mjs` | Generador reproducible, sin dependencias externas |
| `Extraccion_planilla_San_Miguel.json` | Datos originales, celdas, fórmulas, totales y huella SHA-256 |
| `fuentes/Edificio-Barrio-San-Jose-Aliquileres-Octubre26.xlsx` | Planilla original sin modificar; usuario confirmó que corresponde a San Miguel |
| `Registro_cambios_San_Miguel.md` | Premisas sustituidas y consecuencias de la revisión |

## Uso recomendado

Entregar la carpeta completa a Claude Code y solicitar que lea primero las instrucciones, después los datos fuente y el estudio. No es necesario ejecutar el generador para consultar los resultados, porque el modelo ya está incluido.

Para regenerar y verificar:

```bash
node modelar_san_miguel.mjs
```

El comando regenera el modelo calculado y el CSV desde `Datos_mercado_San_Miguel.json`. Completar datos nuevos en el JSON fuente, no en las salidas derivadas; mantener copias y fuentes antes de actualizar. No modifica el Excel original.

## Alcance y precauciones

El paquete documental está completo para traspaso. Los alquileres y superficies se toman como verificados por Meridiano, sujetos a constancia en planos municipales; esa condición no equivale a auditoría de cobros o gastos ni a certificación municipal. El valor independiente de venta, alquiler de mercado agregado y brecha de renta siguen no determinados por falta de homologación, no por ausencia del detalle de unidades.

La cifra de USD 350.000 es precio solicitado y USD 290.000 es alternativa de venta rápida del propietario; no son extremos de un rango independiente de tasación. Los alquileres publicados son ofertas, no cierres, y no se confirmó disponibilidad con los anunciantes.

La referencia cambiaria es Gs. 5.770,91/USD, último cierre publicado disponible al consultar el sábado 17/10/2026, correspondiente al viernes 16/10/2026 a las 13:00; no se presenta como cotización del sábado ni precio minorista ([BCP](https://www.bcp.gov.py/webapps/web/cotizacion/referencial-fluctuante-interbancario)). El municipio legal debe verificarse porque la etiqueta del punto recibido difiere de la ciudad declarada ([ubicación recibida](https://maps.app.goo.gl/b1ppbnL6vLtBu2d39)).

Las fuentes se enlazan junto a los datos del estudio y se conservan en el JSON; se distingue la reconsulta del 17/10 de la referencia V05 conservada del 16/10 y la advertencia de disponibilidad de R01. La nueva planilla sí fue revisada, pero fotografías, planos y contratos de San Miguel no; no utilizar como respaldo los adjuntos de los otros edificios.
