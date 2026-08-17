Estado: CURRENT — primera versión, 2026-08-17
Fuente original: consolidación de las fuentes ya citadas en `knowledge-base/investment/` y `contracts/cases/HERRERA-001/`
Dominio: INVESTMENT/GOVERNANCE

# Registro de fuentes — Market Intelligence de Meridiano Capital

## Qué es y para qué sirve

Hasta el 2026-08-17 cada archivo de `knowledge-base/investment/` cita su fuente inline (buena práctica que se mantiene) pero no existía un lugar único para responder, de un vistazo, dos preguntas: **¿qué tan confiable es esta fuente en general?** y **¿qué archivos dependen de ella?** Este registro no reemplaza la cita inline de cada archivo — la complementa.

## Jerarquía de confiabilidad (§16 del prompt maestro Real Estate Intelligence OS)

| Nivel | Definición | Ejemplos en este sistema |
|---|---|---|
| **Nivel 1** | Datos oficiales / documentación primaria | Catastro municipal (usado para confirmar zona AR2-B, D-071), Ordenanza 43/1994 — Plan Regulador de Asunción (D-070), planillas del founder con datos reales de su propia cartera (`00-overview.md`, Cartera A) |
| **Nivel 2** | Fuentes profesionales especializadas | Place Analyzer (algoritmo, >300 variables, ranking de precio de terreno — D-070), tabla de costos de construcción del founder (`Tabla de Costos M2...xlsx`, D-064) |
| **Nivel 3** | Portales inmobiliarios | Century 21 (comparables de venta, D-073, `market-intelligence/comparables/`), RE/MAX, InfoCasas, MercadoProp |
| **Nivel 4** | Publicaciones/comparables secundarios | Yulia Traidova (precio de departamento/m² por zona), Capadei, Inmovia, Revista FOCO (usados en el ranking de 21 barrios, D-069) |
| **Nivel 5** | Estimaciones | Búsquedas web de primer corte sin cotización directa (la mayoría de la carga inicial de `rentals/`, `airbnb/` — categoría de dato C) |

**Relación con la categoría de dato A/B/C/D**: son ejes distintos que se combinan. El nivel de fuente mide *qué tipo* de fuente es; la categoría A/B/C/D mide *si ese dato específico* ya fue confirmado con esa fuente o sigue pendiente. Una fuente Nivel 3 (Century 21) puede dar datos categoría A cuando el listado está vigente y citado (como los comparables de `market-intelligence/comparables/`) — el nivel de fuente no baja automáticamente la categoría del dato, pero sí contextualiza cuánto peso darle frente a una fuente Nivel 1.

## Registro de fuentes activas

| Fuente | Nivel | Tipo | Usada en | Confiabilidad declarada |
|---|---|---|---|---|
| Founder (Juan José Castillo) — planillas y confirmaciones directas | 1 | Documentación primaria del negocio | `governance/decisions/DECISION_REGISTER.md` (toda decisión CURRENT), costos de construcción (D-064), amueblamiento (D-068), esquema de financiamiento (D-067), comisiones (D-063) | Máxima — es la fuente de la mayoría de las reglas cross-cutting del sistema |
| Catastro municipal de Asunción | 1 | Registro oficial | Confirmación de zona AR2-B del terreno de Herrera (D-071) | Máxima, verificación puntual (no hay acceso sistemático, solo consultas caso por caso) |
| Ordenanza 43/1994 (Plan Regulador de Asunción) | 1 | Norma oficial | Indicadores urbanísticos (D-070, `market-intelligence/neighborhoods/09-...md`) | Máxima |
| Place Analyzer | 2 | Algoritmo especializado (>300 variables) | Precio de terreno/m² por zona (D-069/D-070) | Alta — fuente de referencia estándar confirmada por el founder, pero es un modelo, no una tasación caso por caso |
| Century 21 (century21.com.py) | 3 | Portal inmobiliario / franquicia | Comparables de venta en pozo (D-073, `market-intelligence/comparables/`) | Alta para el dato puntual citado (listado vigente, precio real) — **no tratar como precio de cierre**, es precio de lista |
| RE/MAX | 3 | Portal inmobiliario / franquicia | Mencionado como fuente a consultar (D-063, canal de comisión), sin comparables cargados todavía | Sin calibrar — pendiente de primer uso real |
| InfoCasas, MercadoProp | 3 | Portales inmobiliarios | Búsquedas de primer corte para `rentals/`, `airbnb/` | Media — agregadores de terceros, sin verificación directa del listado original |
| Yulia Traidova | 4 | Publicación/comparable secundario | Precio de departamento/m² por zona (D-069) | Media — una fuente entre varias del ranking de 21 barrios, no exclusiva |
| Capadei, Inmovia, Revista FOCO | 4 | Publicaciones/comparables secundarios | Ranking de 21 barrios (D-069) | Media |
| Búsqueda web genérica (sin cotización directa) | 5 | Estimación | La mayoría de `rentals/07-...md` y `airbnb/00-...md` (categoría C) | Baja — declarado explícitamente como "no es un relevamiento exhaustivo ni una tasación profesional" en los propios archivos |

## Cómo se mantiene

1. Cuando se incorpore una fuente nueva a cualquier tabla de `market-intelligence/`, agregarla acá con su nivel — no dejarla solo citada inline.
2. Si una fuente resulta poco confiable en la práctica (dato que después se contradice con una fuente de nivel más alto), documentar el conflicto en `assumptions/ASSUMPTIONS_REGISTER.md` o en `governance/decisions/DECISION_REGISTER.md` según corresponda — no bajar el nivel de la fuente en silencio.
3. Este registro no reemplaza la cita puntual de cada archivo (founder, fecha, documento específico) — es el resumen de nivel de confiabilidad, no el detalle de cada cita.
