# Instrucciones para Claude Code: Edificio Barrio San Miguel

Este paquete es la fuente de trabajo del edificio San Miguel / Área 2, Alto Paraná, analizado el 16/10/2026 para Meridiano Capital. Debe mantenerse separado de San José y de Sajonia: no reutilizar sus precios, documentos, imágenes, supuestos ni modelos.

## Archivos y orden de lectura

- **`README_San_Miguel.md`:** inventario, ejecución y alcance.
- **`Datos_mercado_San_Miguel.json`:** entradas originales, confirmaciones del propietario, fuente cambiaria, comparables, exclusiones y faltantes.
- **`estudio-mercado-san-miguel.pplx.md`:** informe completo, fuentes junto a los datos y conclusiones condicionadas.
- **`Modelo_inversion_San_Miguel.json`:** cálculos derivados; no editar a mano porque se regeneran.
- **`Rent_roll_San_Miguel_para_completar.csv`:** doce unidades de trabajo para completar con documentación.
- **`modelar_san_miguel.mjs`:** generador reproducible con controles automáticos.

## Hechos que no deben modificarse sin nueva evidencia

1. Terreno del edificio: 12 × 30 m = 360 m²; construcción total aproximada informada: 400 m².
2. Tres pisos; primera etapa de 1998 hasta primer piso y segunda etapa terminada en 2016.
3. Planos municipales aprobados según propietario; no revisados.
4. Siete departamentos de uno, dos y cuatro dormitorios; no se conoce cuántos hay de cada tipología.
5. Tres monoambientes adicionales a los siete departamentos, confirmado expresamente.
6. Un salón comercial frontal y una casa independiente posterior de dos dormitorios.
7. Doce unidades en total: once residenciales y una comercial.
8. Ocupación del 100%, ingresos Gs. 20.000.000/mes y gastos Gs. 2.700.000/mes, declarados y no auditados.
9. Precios: USD 350.000 publicado por el propietario; USD 290.000 de venta rápida es una sugerencia de Meridiano Capital según el estudio de mercado y las referencias de la zona (corrección del founder, 16/10/2026).
10. Estacionamiento techado lindero: opción independiente, terreno 360 m² y precio USD 120.000; no incluido en los alquileres actuales ni en el caso base.

## Tipo de cambio y presentación

La referencia es Gs. 5.750 por USD, BCP, 16/10/2026 a las 09:00 Paraguay, promedio acumulado intradía; no debe describirse como cierre ni como tipo minorista ([BCP](https://www.bcp.gov.py/webapps/web/cotizacion/referencial-fluctuante-interbancario)). Utilizar esta única referencia para todas las conversiones de esta versión y no las equivalencias automáticas de los portales.

Al actualizar la fecha del informe, verificar nuevamente el tipo de cambio y recalcular todo: ingresos, gastos, rendimientos, precios en PYG, comparables y umbrales del estacionamiento. Conservar moneda original, fuente, fecha y hora de la referencia utilizada.

Usar UTF-8, tipografía regular legible y encabezados en texto real, sin caracteres Unicode decorativos. Si se genera PDF, emplear una fuente estándar con soporte español, incrustarla y revisar visualmente los títulos, especialmente la letra “j”, los acentos y “San Miguel”.

## Reglas de interpretación

- **Precio solicitado no es valor de mercado:** mantener el valor independiente de venta como `null` hasta respaldarlo; no convertir automáticamente USD 290.000–350.000 en un rango de tasación.
- **Saldo informado no es beneficio neto auditado:** Gs. 17.300.000 mensuales es la diferencia entre ingresos y gastos recibidos; no renombrarlo como NOI validado sin revisar la composición de gastos.
- **Dato desconocido no es cero:** `null` y las celdas vacías indican falta de información. Solo un escenario explícito puede utilizar cero como hipótesis.
- **Sin reparto uniforme:** no distribuir Gs. 20.000.000 ni 400 m² entre doce unidades; tampoco asignar arbitrariamente los siete departamentos a tipologías.
- **Sin aumento automático:** el 10% de mejora es una sensibilidad, no una oportunidad de renta demostrada por el mercado.
- **Sin TIR ficticia:** no calcular TIR sin horizonte, flujos temporales, inversión y salida.
- **Sin ventas por unidades:** no asumir propiedad horizontal, subdivisión o comercialización separada.
- **Sin mezcla de muestras:** separar ofertas de cierres, amoblados de básicos, terrenos de construcciones, superficie propia de cubierta/edificada, temporal de tradicional y contextuales de directos.
- **Sin falsas disponibilidades:** un aviso accesible no prueba que el inmueble esté disponible hoy.

## Modelo de inversión que debe preservarse

El escenario principal es el edificio solo, calculado para ambos precios. La opción de estacionamiento debe mostrarse en un bloque separado, desactivada por defecto.

| Caso base | Rentabilidad bruta | Saldo anual informado / precio |
|---|---:|---:|
| Edificio USD 350.000 | 11,93% | 10,32% |
| Edificio USD 290.000 | 14,39% | 12,45% |
| Edificio 350.000 + estacionamiento: USD 470.000 | 8,88% | 7,68% |
| Edificio 290.000 + estacionamiento: USD 410.000 | 10,18% | 8,81% |

Las dos filas conjuntas son casos mecánicos sin renta incremental y antes de gastos adicionales del estacionamiento; no son rentabilidades netas conjuntas verificadas. Las rentas y los gastos reales del estacionamiento permanecen desconocidos.

Mantener las sensibilidades conservadora, estrés y mejora hipotética del generador. Presentarlas como variaciones agregadas de ingresos y gastos, no como una cantidad inferida de unidades vacantes.

## Completar datos sin contaminar la evidencia

### Rent roll

Completar cada fila del CSV con número real de unidad, tipología, dormitorios, superficie y su base de medición, renta, moneda, IVA, expensas, servicios, mobiliario, cochera, ocupación, cobros, vencimiento, reajuste y fuente documental. Los IDs DEP/MON/COM/CAS son identificadores creados para este estudio, no números oficiales del inmueble.

Conciliar once unidades residenciales más una comercial, ocupación declarada y suma de rentas. Si el total difiere de Gs. 20.000.000, registrar discrepancia y fecha; no sobrescribir silenciosamente el dato anterior. Los vacíos no se convierten en cero para forzar el cierre.

### Gastos y estado físico

Obtener desglose de Gs. 2.700.000 y separar operación, tributos, costos recuperados de inquilinos, administración, seguros, mantenimiento y financiación. Obtener inspección y presupuesto de CAPEX antes de calcular inversión integral o rendimiento neto.

Verificar si los 400 m² incluyen casa posterior, salón, circulaciones y ampliaciones. No estimar áreas de unidades mediante porcentajes arbitrarios.

### Ubicación y documentación

El punto resuelto de Maps tiene etiqueta de Presidente Franco, distinta de la ciudad comercial declarada; verificar con finca, padrón y catastro antes de definir municipio legal o normativa ([ubicación recibida](https://maps.app.goo.gl/b1ppbnL6vLtBu2d39)). No inferir la jurisdicción del nombre del barrio ni de la etiqueta de Google por sí sola.

### Comparables y valoración

Priorizar nuevas referencias de San Miguel / Área 2 con superficies, estado y condiciones similares. Los vacíos principales son monoambientes básicos, departamentos básicos de cuatro dormitorios, casa de dos dormitorios y salón frontal.

Registrar URL, fecha de consulta, fecha de publicación acreditada, ubicación, moneda nativa, superficie y conceptos incluidos. Deduplicar V01 y las variantes R02; mantener Zuba 54572 fuera de cálculos hasta resolver sus precios y título. No usar avisos marcados “alquilado” como oferta vigente ni como prueba de renta cerrada.

No descartar los edificios publicados por debajo del precio del sujeto solo porque perjudican la conclusión comercial. Confirmar precio, documentación, estado y condiciones de V02, V07 y V08 antes de construir ajustes.

Asignar alquileres objetivo y calcular brechas únicamente cuando se conozca la renta comparable actual de cada unidad. Si falta esa información, conservar `null`; no redactar un potencial total de incremento como hecho.

### Estacionamiento

Solicitar capacidad, área efectivamente techada, accesos, título, gastos y eventuales contratos. Si se desarrolla una hipótesis de explotación, mostrar plazas × tarifa × ocupación, gastos e inversiones con evidencia o rótulo de supuesto; no incorporar esa renta al edificio base.

## Ejecución y controles

Requiere Node.js con soporte ES modules, sin paquetes externos. Desde la carpeta del paquete:

```bash
node modelar_san_miguel.mjs
```

El comando regenera el modelo JSON, crea el CSV de doce unidades solo si no existe y ejecuta aserciones sobre unidades, flujo, precios y opción de estacionamiento. Un rent roll existente se conserva sin sobrescribir; mantener además una copia del archivo completado.

Comprobar manualmente, además de las aserciones:

- **Entradas:** 12 unidades y estacionamiento fuera del caso base.
- **Aritmética:** saldo mensual Gs. 17.300.000; bruto anual Gs. 240.000.000; saldo anual Gs. 207.600.000.
- **Rendimientos:** reproducir los cuatro casos de la tabla con el mismo FX.
- **Evidencia:** cada nueva afirmación de mercado debe tener una URL consultada que la respalde.
- **Etiquetas:** ningún `null` convertido silenciosamente en cero; ninguna sensibilidad presentada como valor de mercado.
- **Entrega al inversor:** mostrar limitaciones junto a los resultados, no solo en una nota final.

## Salida que debe preparar Claude Code

Preparar un memorando de inversión con edificio solo como caso principal, ambos precios de compra, escenarios explícitos y estacionamiento en anexo opcional. Integrar rent roll y documentación que se reciban, conservando sus fuentes y fechas, y actualizar brechas y valoración solo cuando haya evidencia suficiente.

Mantener una lista de pendientes y un registro de cambios. El memorando no debe describirse como tasación certificada, auditoría ni promesa de rentabilidad.
