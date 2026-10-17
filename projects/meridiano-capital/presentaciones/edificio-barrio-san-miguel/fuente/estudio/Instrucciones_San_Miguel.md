# Instrucciones para Claude Code: Edificio Barrio San Miguel

Este paquete versión 2.0 es la fuente de trabajo del edificio San Miguel / Área 2, Alto Paraná, actualizado el 17/10/2026 para Meridiano Capital. Debe mantenerse separado de San José y Sajonia; la única excepción de nombre es la nueva planilla titulada San José, confirmada expresamente por el usuario como correspondiente a San Miguel.

Usar obligatoriamente la condición “Verificado por Meridiano, sujeto a constancia en planos municipales” para alquileres, superficies y distribución de la planilla. No rebajar estos datos a “sin verificar” ni extender esa verificación a cobranzas, gastos, títulos, precios de mercado o planos que no se han revisado.

> **Correcciones del founder aplicadas (Meridiano Capital, 16–17/10/2026), que prevalecen sobre este texto:**
> - **Ubicación:** Ciudad del Este, confirmada con el enlace https://maps.app.goo.gl/KJkB7gKmRfRJdXdA7. La etiqueta "Presidente Franco" del enlace anterior queda sin efecto.
> - **Gastos:** los Gs 2.700.000 incluyen IVA, mantenimiento y administración; faltan los demás gastos.
> - **Contratos:** los doce están vigentes y fueron verificados por el founder.
> - **Venta rápida:** USD 290.000 es una sugerencia de Meridiano Capital según este estudio y las referencias de la zona, no un precio del propietario.
> - **Rentabilidad del aviso:** el 9% publicado queda excluido de todo el análisis.

## Archivos y orden de lectura

- **`README_San_Miguel.md`:** inventario, ejecución y alcance.
- **`Datos_mercado_San_Miguel.json`:** entradas originales, confirmaciones del propietario, fuente cambiaria, comparables, exclusiones y faltantes.
- **`estudio-mercado-san-miguel.pplx.md`:** informe completo, fuentes junto a los datos y conclusiones condicionadas.
- **`Modelo_inversion_San_Miguel.json`:** cálculos derivados; no editar a mano porque se regeneran.
- **`Rent_roll_San_Miguel.csv`:** doce unidades con áreas y rentas completas; campos contractuales no informados vacíos.
- **`modelar_san_miguel.mjs`:** generador reproducible con controles automáticos.
- **`Extraccion_planilla_San_Miguel.json`:** transcripción de las doce filas con direcciones de celdas, fórmulas y totales almacenados.
- **`fuentes/Edificio-Barrio-San-Jose-Aliquileres-Octubre26.xlsx`:** original intacto, no renombrado; corresponde a San Miguel por confirmación del usuario.
- **`Registro_cambios_San_Miguel.md`:** sustitución de premisas y consecuencias sobre todo el paquete.

## Hechos que no deben modificarse sin nueva evidencia

1. Terreno del edificio: 12 × 30 m = 360 m²; superficie base: 592 m², suma de unidades de `Hoja1!C3:C14`, total `Hoja1!C15`.
2. Planilla distribuida en PB y pisos 1, 2 y 3: cuatro niveles a constatar en planos, más casa posterior sin nivel indicado. Primera etapa de 1998 hasta primer piso y segunda etapa terminada en 2016.
3. Planos municipales aprobados según propietario; no revisados.
4. Siete departamentos: uno de un dormitorio, cuatro de dos dormitorios y dos de cuatro dormitorios.
5. Tres monoambientes adicionales a los siete departamentos, confirmado expresamente.
6. Un salón comercial frontal y una casa independiente posterior de dos dormitorios.
7. Doce unidades en total: once residenciales y una comercial.
8. Ocupación del 100% informada; renta mensual Gs. 22.200.000 en `Hoja1!D15`, verificada por Meridiano bajo condición de planos; gasto previo Gs. 2.700.000/mes mantenido, no actualizado por esta planilla.
9. Precios: USD 350.000 publicado por el propietario; USD 290.000 de venta rápida sugerido por Meridiano Capital.
10. Estacionamiento techado lindero: opción independiente, terreno 360 m² y precio USD 120.000; no incluido en los alquileres actuales ni en el caso base.

## Tipo de cambio y presentación

La referencia es Gs. 5.770,91 por USD: último cierre publicado disponible al consultar el sábado 17/10/2026, correspondiente al promedio acumulado interbancario del viernes 16/10/2026 a las 13:00; la página lo identifica como “Cierre 16/10” ([BCP](https://www.bcp.gov.py/webapps/web/cotizacion/referencial-fluctuante-interbancario)). No presentarlo como cotización propia del sábado ni como precio minorista, y no utilizar las equivalencias automáticas de los portales.

Al actualizar la fecha del informe, verificar nuevamente el tipo de cambio y recalcular todo: ingresos, gastos, rendimientos, precios en PYG, comparables y umbrales del estacionamiento. Conservar moneda original, fuente, fecha y hora de la referencia utilizada.

Usar UTF-8, tipografía regular legible y encabezados en texto real, sin caracteres Unicode decorativos. Si se genera PDF, emplear una fuente estándar con soporte español, incrustarla y revisar visualmente los títulos, especialmente la letra “j”, los acentos y “San Miguel”.

## Reglas de interpretación

- **Precio solicitado no es valor de mercado:** mantener el valor independiente de venta como `null` hasta respaldarlo; no convertir automáticamente USD 290.000–350.000 en un rango de tasación.
- **Saldo calculado no es beneficio neto auditado:** Gs. 19.500.000 mensuales es la diferencia entre renta de planilla y gasto previo mantenido; no renombrarlo como NOI validado sin revisar gastos y cobranzas.
- **Dato desconocido no es cero:** `null` y las celdas vacías indican falta de información. Solo un escenario explícito puede utilizar cero como hipótesis.
- **Sin reparto uniforme:** usar las áreas y cánones de cada unidad; no distribuir los totales por promedio ni alterar la tipología por parecer compacta.
- **Sin inflación de superficie:** los 592 m² incluyen salón y casa posterior; no volver a sumarlos ni añadir áreas comunes por porcentaje. Conservar que la base propia/cubierta/bruta está pendiente de constancia.
- **Sin reutilizar premisas sustituidas:** los 400 m² y Gs. 20.000.000 corresponden solo al historial de versión 1.0; no son entradas del modelo vigente.
- **Sin aumento automático:** el 10% de mejora es una sensibilidad, no una oportunidad de renta demostrada por el mercado.
- **Sin TIR ficticia:** no calcular TIR sin horizonte, flujos temporales, inversión y salida.
- **Sin ventas por unidades:** no asumir propiedad horizontal, subdivisión o comercialización separada.
- **Sin mezcla de muestras:** separar ofertas de cierres, amoblados de básicos, terrenos de construcciones, superficie propia de cubierta/edificada, temporal de tradicional y contextuales de directos.
- **Sin falsas disponibilidades:** un aviso accesible no prueba que el inmueble esté disponible hoy.

## Modelo de inversión que debe preservarse

El escenario principal es el edificio solo, calculado para ambos precios. La opción de estacionamiento debe mostrarse en un bloque separado, desactivada por defecto.

| Caso base | Rentabilidad bruta | Saldo anual informado / precio |
|---|---:|---:|
| Edificio USD 350.000 | 13,19% | 11,59% |
| Edificio USD 290.000 | 15,92% | 13,98% |
| Edificio 350.000 + estacionamiento: USD 470.000 | 9,82% | 8,63% |
| Edificio 290.000 + estacionamiento: USD 410.000 | 11,26% | 9,89% |

Las dos filas conjuntas son casos mecánicos sin renta incremental y antes de gastos adicionales del estacionamiento; no son rentabilidades netas conjuntas verificadas. Las rentas y los gastos reales del estacionamiento permanecen desconocidos.

Mantener las sensibilidades conservadora, estrés y mejora hipotética como variaciones agregadas, no como cantidades inferidas de unidades vacantes. Mantener además el nuevo caso de vacancia anual de un monoambiente de Gs. 2.700.000/mes: los tres aportan 36,49% de la renta.

## Completar datos sin contaminar la evidencia

### Rent roll

Las doce filas del CSV ya contienen piso, tipo, dormitorios, área y canon. Conservarlos como verificados por Meridiano y enriquecer en `Datos_mercado_San_Miguel.json > units` solo los datos nuevos: número real de puerta, baños, base de medición acreditada, IVA, expensas, servicios, mobiliario, cochera, cobros, vencimiento, reajuste y fuentes. Los IDs DEP/MON/COM/CAS son de trabajo; la casa tiene dos dormitorios según la descripción del propietario, no según la celda vacía `Hoja1!B14`.

Conciliar once unidades residenciales más una comercial, 592 m² y Gs. 22.200.000/mes con `Hoja1!C15:D15`. La diferencia con los datos anteriores está resuelta por la nueva fuente y registrada; no volver a pedir confirmación ni forzar el detalle a sumar Gs. 20.000.000. Ante nueva evidencia contradictoria, registrar fuente y fecha sin sobrescribir silenciosamente.

### Gastos y estado físico

Obtener desglose de Gs. 2.700.000 y separar operación, tributos, costos recuperados de inquilinos, administración, seguros, mantenimiento y financiación. Obtener inspección y presupuesto de CAPEX antes de calcular inversión integral o rendimiento neto.

Constatar los 592 m² en planos municipales y su correspondencia con obra ejecutada, los cuatro niveles indicados y la base de medición. Casa posterior y salón ya forman parte de la suma; circulaciones y áreas comunes no están individualizadas. No estimarlas mediante porcentajes arbitrarios.

### Ubicación y documentación

El punto resuelto de Maps tiene etiqueta de Presidente Franco, distinta de la ciudad comercial declarada; verificar con finca, padrón y catastro antes de definir municipio legal o normativa ([ubicación recibida](https://maps.app.goo.gl/b1ppbnL6vLtBu2d39)). No inferir la jurisdicción del nombre del barrio ni de la etiqueta de Google por sí sola.

### Comparables y valoración

Priorizar nuevas referencias de San Miguel / Área 2 con superficies, estado y condiciones similares. Los vacíos principales son monoambientes básicos, departamentos básicos de cuatro dormitorios, casa de dos dormitorios y salón frontal.

Registrar URL, fecha de consulta, fecha de publicación acreditada, ubicación, moneda nativa, superficie y conceptos incluidos. Deduplicar V01 y variantes R02; mantener Zuba 54572 fuera de cálculos. R01 contiene alerta de ausencia del listado desde hace 14 días y no es disponibilidad actual confirmada; V05 no pudo revalidarse el 17/10 y conserva fecha de consulta 16/10. No usar avisos “alquilado” como oferta vigente ni como prueba de renta cerrada.

No descartar los edificios publicados por debajo del precio del sujeto solo porque perjudican la conclusión comercial. Confirmar precio, documentación, estado y condiciones de V02, V07 y V08 antes de construir ajustes.

Las rentas actuales ya se conocen; el faltante es homologación de referencias y condiciones. Asignar objetivos y brechas solo después de comparar estado, servicios, equipamiento, ubicación y contrato. No convertir la diferencia nominal frente a una oferta en incremento capturable ni sumar diferencias sin ajustes acreditados.

### Estacionamiento

Solicitar capacidad, área efectivamente techada, accesos, título, gastos y eventuales contratos. Si se desarrolla una hipótesis de explotación, mostrar plazas × tarifa × ocupación, gastos e inversiones con evidencia o rótulo de supuesto; no incorporar esa renta al edificio base.

## Ejecución y controles

Requiere Node.js con soporte ES modules, sin paquetes externos. Desde la carpeta del paquete:

```bash
node modelar_san_miguel.mjs
```

El comando regenera el modelo JSON y `Rent_roll_San_Miguel.csv` desde los datos estructurados; ambos son salidas derivadas y se sobrescriben. No editar las salidas para cambiar premisas: incorporar datos nuevos en el JSON fuente, conservar copia y regenerar. El archivo Excel original y la extracción no se modifican.

Comprobar manualmente, además de las aserciones:

- **Entradas:** 12 unidades y estacionamiento fuera del caso base.
- **Aritmética:** 592 m²; renta mensual Gs. 22.200.000; saldo mensual Gs. 19.500.000; bruto anual Gs. 266.400.000; saldo anual Gs. 234.000.000.
- **Composición:** 1 departamento de 1 dormitorio, 4 de 2 dormitorios, 2 de 4 dormitorios, 3 monoambientes, salón y casa.
- **Rendimientos:** reproducir los cuatro casos de la tabla con el mismo FX.
- **Evidencia:** cada nueva afirmación de mercado debe tener una URL consultada que la respalde.
- **Etiquetas:** ningún `null` convertido silenciosamente en cero; ninguna sensibilidad presentada como valor de mercado.
- **Entrega al inversor:** mostrar limitaciones junto a los resultados, no solo en una nota final.

## Salida que debe preparar Claude Code

Preparar un memorando de inversión con edificio solo como caso principal, ambos precios de compra, rent roll ya completo en áreas y cánones, escenarios explícitos y estacionamiento en anexo opcional. Destacar la condición de verificación de Meridiano, las constancias municipales pendientes y la concentración de renta de los monoambientes; actualizar brechas y valoración solo con evidencia suficiente.

Mantener una lista de pendientes y un registro de cambios. El memorando no debe describirse como tasación certificada, auditoría ni promesa de rentabilidad.
