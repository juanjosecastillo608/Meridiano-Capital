Estado: CURRENT — primera versión parametrizada, activa P-007
Fuente original: framework metodológico adaptado de Roomix ("Qué es un ACM: Análisis Comparativo de Mercado Inmobiliario", roomix.ai, consultado 2026-08-18) + patrón de cross-check de múltiples fuentes observado en el dossier AMC real de ARKA Desarrollos Inmobiliarios (`contracts/cases/HERRERA-001/source-documents/amc-terreno-arka/AMC_Dossier_Herrera.pdf`, abril 2026) + founder, 2026-08-18
Dominio: INVESTMENT/METHODOLOGY

# AMC — Análisis Comparativo de Mercado (metodología parametrizada)

## 0. Qué es y por qué existe este documento

Esta es la primera versión construida de la **habilidad de AMC permanente** que quedó agendada como **P-007** (`contracts/cases/HERRERA-001/30-...md`): *"agendar generar una habilidad que esté permanentemente actualizando y verificando valores de mercado (...) esto nos permite darle el valor de mercado a las propiedades que Meridiano Capital vaya a captar para la venta y/o realizar un análisis de compra para un inversor."* El founder activó su construcción el 2026-08-18, aportando un framework metodológico de referencia (Roomix) y un dossier AMC real de un tercero (ARKA) como ejemplo del estándar de la industria a igualar o superar.

**AMC ≠ tasación formal.** Un AMC es un análisis de referencia (lo hace un corredor, un analista, o el propio interesado) sin validez legal — sirve para fijar precio de publicación, negociar, o evaluar una oferta. Una tasación formal la firma un tasador matriculado y tiene validez legal (créditos, sucesiones, juicios). Meridiano usa AMC internamente; nunca debe presentarse como tasación oficial.

## 1. Los 5 pasos del AMC

### Paso 1 — Identificar la propiedad sujeto

Registrar, como mínimo: ubicación exacta (barrio, calle, entrecalles), tipo de propiedad, superficie (cubierta/semicubierta/total), antigüedad, estado de conservación, ambientes y distribución, amenities, y características especiales (balcón, orientación, vista, piso).

### Paso 2 — Buscar comparables

**Meta: 5-10 comparables**, priorizando ventas cerradas recientes (idealmente últimos 3-6 meses) sobre listados activos. Fuentes por nivel de confiabilidad (`market-intelligence/sources/SOURCE_REGISTRY.md`): ventas propias de Meridiano/Urbannit (Nivel 1, las más confiables cuando existan), portales inmobiliarios (Nivel 3 — Century 21, RE/MAX, InfoCasas), registros notariales/escribanías (Nivel 1, no accesible sistemáticamente hoy).

### Paso 3 — Comparar y ajustar (el corazón del AMC)

Cada comparable se ajusta hacia la propiedad sujeto por las variables que lo diferencian. Tabla de ajustes estándar para Meridiano:

| Variable | Regla de ajuste |
|---|---|
| Superficie | El precio/m² decrece a medida que la superficie aumenta — no es lineal; ajustar comparables mucho más grandes/chicos con cautela |
| Antigüedad | 1-2% por año de diferencia (más nuevo = vale más) |
| Estado de conservación | A reciclar/regular resta; excelente/a estrenar suma |
| Piso (edificios) | Pisos altos valen más (vista, menos ruido) — Meridiano ya aplica esto en HERRERA-001 vía el escalado +1%/piso confirmado por el founder, `41-unit-price-matrix.md` |
| Amenities | Sumar/restar el valor de mercado de lo que el comparable tiene y el sujeto no, o viceversa |
| Cochera | Ajustar por el valor de mercado de la cochera si un comparable la incluye en el precio y el sujeto no, o viceversa — Meridiano ya tiene un valor de referencia validado (USD 15.000, rango real 12.000-15.000, `37-comparables-reales-de-venta-en-pozo-century21.md`) |
| Precio publicado vs. cerrado | Los precios de publicación suelen tener un margen de negociación del 5-15% — nunca tratar un precio de lista como precio de cierre sin esta salvedad |

**No inventar el ajuste** — cuando no hay dato suficiente para justificar un % concreto, se dejar el comparable sin ajustar y se lo marca explícitamente como "comparable bruto, sin ajustar por [variable]", nunca se estima el ajuste a ojo.

### Paso 4 — Analizar la absorción del mercado

Más allá del precio: tiempo promedio de venta en la zona, stock disponible de comparables, tendencia de precios (¿suben, bajan, estables?), velocidad de absorción (ventas/mes vs. stock total). **Meridiano no tiene todavía un mecanismo sistemático para este paso** — pendiente, ver §4.

### Paso 5 — Elaborar el informe

Estructura mínima: datos del sujeto, tabla de comparables con ajustes explícitos, rango de valor sugerido (mínimo/medio/máximo — nunca un solo número sin rango), análisis de mercado local, recomendación de precio, fuentes citadas con nivel de confiabilidad.

## 2. Patrón de cross-check de múltiples fuentes (del dossier ARKA)

El dossier AMC real de ARKA Desarrollos Inmobiliarios (terreno de Barrio Herrera, abril 2026) usa un patrón valioso que Meridiano adopta: **cruzar 2-3 fuentes de valoración independientes y verificar que converjan**, en vez de confiar en una sola:

1. **Muestra propia de transacciones cerradas** (si existe — ARKA cita 12 ventas de un "sistema confidencial", categoría no verificable externamente, se trata como referencia interna del tercero, no como dato propio de Meridiano).
2. **Herramienta de tasación automática/IA** (ARKA usa `tasaciononline.com.py` — herramienta externa, útil como segunda opinión, nunca como única fuente).
3. **Comparables públicos verificables** (portales — la única categoría que Meridiano puede citar con fuente y link verificable de forma independiente).

**Regla de Meridiano**: solo la categoría 3 (comparables públicos con fuente citable) se registra como dato propio categoría A/B. Las categorías 1-2, cuando provienen de un informe de tercero (como el dossier ARKA), se citan como "referencia de tercero, no verificable independientemente" — nunca se adoptan como si fueran datos propios confirmados.

## 3. Aplicación real — ver el caso HERRERA-001

Primera aplicación completa de esta metodología: `contracts/cases/HERRERA-001/45-amc-terreno-y-nuevos-comparables-herrera.md` — incluye el ajuste de comparables de venta (Paso 3) y una nueva base de valor de terreno construida a partir de un AMC real de terreno de un tercero.

## 4. Qué queda pendiente para que esta sea la "habilidad AMC permanente" completa de P-007

1. **Paso 4 (absorción de mercado)** no tiene todavía ningún dato ni mecanismo en Meridiano — ni tiempo de venta, ni stock, ni velocidad de absorción por zona.
2. **Actualización sistemática, no manual** — hoy cada AMC se arma cargando comparables a mano por caso; P-007 pedía una habilidad que se mantenga "permanentemente actualizando y verificando" — eso todavía no existe como automatización, solo como metodología documentada y una Skill de consulta (`skills/market-price-validation`) que aplica la clasificación BELOW/MARKET/ABOVE MARKET sobre datos ya cargados.
3. **Fuente de ventas cerradas propias de Meridiano** — hoy no existe (0 operaciones cerradas todavía); cuando exista, sube a Nivel 1 automáticamente.
