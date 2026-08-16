Estado: CURRENT — primera versión, cobertura parcial (5 de 66 barrios con dato real)
Fuente original: founder, 2026-08-16 (plano de barrios de Asunción) + primera carga de datos vía búsqueda web
Dominio: INVESTMENT
Incorporado: 2026-08-16

# Tarifas de alquiler por barrio de Asunción

## Qué es y para qué sirve

Base de datos de referencia de valores de alquiler real de Asunción, desagregada por **barrio × tipología × tipo de alquiler**, pedida explícitamente por el founder como herramienta **cross-cutting**: *"Esta tabla tiene que ser dinámica y actualizable. También tiene que estar siempre disponible para otros proyectos con datos actualizados por zona, tipología y valores de los alquileres."* No es específica de `HERRERA-001` — nació de ese caso, pero vive acá porque cualquier proyecto futuro de Meridiano la necesita para fijar pisos de renta y validar precios de alquiler contra mercado real.

## Dónde está el dato

| Archivo | Contenido |
|---|---|
| `data/tarifas-alquiler-por-barrio-asuncion.csv` | **La fuente de verdad** de tarifas, versionada en git — formato largo (una fila por combinación Barrio × Tipología × Tipo de alquiler), fácil de diffear y actualizar con cualquier editor de texto o Excel |
| `data/categoria-de-zona-por-barrio-asuncion.csv` | **Nueva (2026-08-16)** — fuente de verdad de la categoría de zona de cada barrio (Residencial / Comercial / Zona Shopping / Eje Corporativo / Mixta) y una marca de rentabilidad relativa donde ya hay evidencia |
| `data/tarifas-alquiler-por-barrio-asuncion.xlsx` | Las dos fuentes de arriba, en una planilla Excel de 4 hojas (Metodología / Datos / Categoría de Zona / Resumen con dato real) — **este es el archivo para compartir con el equipo**, se regenera desde los CSV cuando cambian |

**El CSV es la fuente editable real** — el `.xlsx` es un derivado para lectura/uso en Excel. Si se actualiza un dato, actualizar primero el CSV (o directamente el Excel y después volcar el cambio al CSV para que quede versionado en git).

## Estructura de los datos (formato largo)

| Columna | Contenido |
|---|---|
| Barrio | Uno de los 66 barrios oficiales de Asunción (transcriptos del plano municipal aportado por el founder) |
| Tipología | Monoambiente / 1 dormitorio / 2 dormitorios / 3 dormitorios |
| Tipo de alquiler | Airbnb/temporal (USD/noche) · Tradicional sin muebles (USD/mes) · Amoblado largo plazo (USD/mes) |
| Valor bajo / Valor alto | Rango observado — cuando solo hay un dato puntual, bajo = alto |
| Categoría de dato | A/B/C/D, mismo protocolo del resto del sistema (ver abajo) |
| Fuente | Sitio o plataforma de origen del dato |
| Fecha de actualización | Cuándo se cargó/confirmó ese dato específico |
| Notas | Contexto — por ejemplo, si un valor es un extremo de lujo y no representativo del piso de la zona |

## Categorías de dato

| Categoría | Significado |
|---|---|
| **A** | Confirmado — dato real con fuente citable y verificable (contrato, tasación, cotización directa de una inmobiliaria) |
| **B** | Calculado — derivado matemáticamente de un dato A |
| **C** | Estimado — primer corte de búsqueda web sobre listados públicos (InfoCasas, Airbnb, RE/MAX, MercadoProp), **no es un relevamiento exhaustivo ni una tasación profesional** |
| **D** | Pendiente — sin dato todavía |

**Ningún valor de esta tabla debe tratarse como A hasta que se confirme con una fuente directa** — todo lo cargado en esta primera carga (2026-08-16) es categoría C, por venir de una búsqueda web de primer corte.

## Cobertura actual (2026-08-16)

**8 de 66 barrios con dato real (categoría C)**: Villa Morra, Luis A. de Herrera (Barrio Herrera), Las Lomas, Recoleta, Mburucuyá (Eje Corporativo/Shopping del Sol), Ycuá Satí, Vista Alegre, Salvador del Mundo. Los **58 barrios restantes están en categoría D**, con la estructura completa lista (todas las combinaciones de tipología × tipo de alquiler ya existen como filas) para completarse a medida que se releven.

**Por qué solo 8 y no los 66**: relevar los 66 barrios × 4 tipologías × 3 tipos de alquiler (792 combinaciones) con datos reales es un trabajo de campo/investigación sustancial, no algo que se complete de una sola búsqueda. Se priorizaron los barrios que el founder nombró explícitamente como referencia de plusvalía (`contracts/cases/HERRERA-001/13-...md` §2: Villa Morra, Eje Corporativo, Las Lomas, zonas Shopping del Sol) más el propio Barrio Herrera, y una segunda ronda con zonas vecinas de distinto nivel (Ycuá Satí, Vista Alegre como referencia más económica, Salvador del Mundo). **No se completaron los 58 restantes con valores inventados** — quedan como D, honestos sobre lo que falta, en vez de simular cobertura completa.

## Cómo se sigue completando

1. Búsquedas web adicionales, barrio por barrio (mismo método que la primera carga — ver `contracts/cases/HERRERA-001/13-...md` §5 y `17-tabla-tarifas-por-barrio.md` para el detalle de fuentes usadas).
2. Cotizaciones directas de inmobiliarias locales (RE/MAX, Century 21, InfoCasas) — subiría la categoría de C a A.
3. Datos que Meridiano/Urbannit ya tenga de su propia cartera operativa (Cartera A, `knowledge-base/investment/00-overview.md`) — esos son categoría A directa, con más peso que cualquier búsqueda web.

## Uso previsto

- **Fijar el piso de alquiler** de una unidad retenida (`08-comision-financiamiento-piso-renta-y-matriz-decision.md` §3 del caso HERRERA-001 usa el costo de entrada; esta tabla aporta el techo/referencia de mercado real para contrastar ese piso).
- **Validar el precio de venta** de zona en cualquier análisis de inversión nuevo (mismo rol que cumplió para Barrio Herrera en `03-presupuesto-y-comparables.md`).
- **Comparar zonas** para decidir dónde conviene desarrollar o dónde retener/alquilar en vez de vender.
