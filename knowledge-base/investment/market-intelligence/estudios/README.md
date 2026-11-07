Estado: CURRENT — versión 1, 2026-11-07 (D-100)
Dominio: INVESTMENT

# Estudios de mercado: estándar y registro

Los estudios de mercado que encarga Meridiano Capital para un inmueble (presentaciones para inversores, análisis de compra) se guardan acá con un formato único. Así sirven de base para otros informes y presentaciones de la misma ciudad o zona: **nuevo proyecto ≠ nueva base**. Antes de relevar una zona, se consulta lo que ya existe:

```bash
python skills/market-intelligence-lookup/consultar.py --barrio "CDE" --tipologia "3 dormitorios" --dataset comparables_alquiler
```

## Cómo se guarda un estudio

Cada estudio va en su propia carpeta, `estudios/<CIUDAD>-<ZONA O ACTIVO>-<AAAA-MM-DD de consulta>/`, por ejemplo `CDE-CATEDRAL-2026-11-07/`. La carpeta contiene:

| Archivo | Contenido |
|---|---|
| `estudio.json` | Datos estructurados: obligatorio, con el esquema de abajo |
| `estudio.md` | Informe completo recibido, sin teléfonos ni correos de anunciantes. Opcional si el informe ya vive en el proyecto: en ese caso `documento` apunta a su ruta |

Después de agregar o corregir un estudio se regeneran las bases consolidadas:

```bash
python knowledge-base/investment/market-intelligence/estudios/consolidar.py           # valida y regenera
python knowledge-base/investment/market-intelligence/estudios/consolidar.py --check   # solo valida
```

| Base consolidada (no editar a mano) | Contenido |
|---|---|
| `rentals/data/comparables-alquiler.csv` | Todos los comparables de alquiler, residenciales y comerciales |
| `sales/data/comparables-venta.csv` | Todos los comparables de venta: edificios, unidades y terrenos |

El pre-commit (`scripts/pre-commit-checks.py`) y CI (`estudios-de-mercado`) validan el estándar y que las bases estén regeneradas.

## Esquema de `estudio.json`

**Datos del estudio (todos obligatorios salvo indicación):**
- `estudio_id`: igual al nombre de la carpeta.
- `titulo`, `ciudad`, `zona_sujeto`, `sujeto` (opcional), `proyecto` (ruta en el repo, opcional).
- `fecha_consulta`: AAAA-MM-DD, el día en que se consultaron los avisos.
- `autor`: quién hizo el relevamiento.
- `tc`: `{gs_por_usd, fecha, fuente, url}`. Es el tipo de cambio que usó el estudio. Queda congelado con el estudio; las presentaciones usan el del día (D-097).
- `confianza_general`: ALTA, MEDIA, MEDIA-BAJA o BAJA.
- `documento`: `estudio.md` o la ruta del informe en el repo.
- Opcionales: `metodologia`, `limitaciones`, `excluidos`, `referencias_contexto` (estadísticas o prensa, cada una con su `url`) y `conclusiones`.

**Cada comparable (`comparables[]`):**

| Campo | Regla |
|---|---|
| `codigo` | Único dentro del estudio (R1, C1, V01…) |
| `operacion` | `alquiler` o `venta` |
| `uso` | `residencial`, `comercial`, `mixto` o `terreno` |
| `tipologia`, `descripcion`, `zona` | Como los publica el aviso |
| `ambito` | `primaria` (barrio o zona del sujeto), `secundaria` (resto de la ciudad) o `ampliada` (solo techo de referencia) |
| `dormitorios`, `banos`, `superficie_m2`, `base_superficie`, `terreno_m2`, `cochera`, `amoblado` | Solo si el aviso los informa. Un dato que falta se deja vacío, nunca 0 |
| `moneda` y `precio` | Moneda **original** del aviso (`PYG` o `USD`) y precio mayor que 0 |
| `periodo` | `mensual` para alquiler y `total` para venta |
| `expensas_iva` | Qué incluye o no el precio, si se informa |
| `fecha_aviso` | Fecha de publicación o `null`, que se muestra como "No informada" |
| `disponibilidad` | Por ejemplo "Publicación activa, no confirmada". Un aviso visible no prueba que el inmueble esté disponible |
| `comparabilidad` | ALTA, MEDIA-ALTA, MEDIA, MEDIA-BAJA, BAJA, REFERENCIA o CONTEXTUAL |
| `usar_en_estadisticas` | `true`/`false`. Si es `false`, `motivo_exclusion` es obligatorio |
| `fuente` y `url` | Portal o inmobiliaria, y enlace `https://`. Si el estudio original no conservó el enlace, `url: null` y la nota "Enlace no conservado…" |
| `notas` | Duplicados, conflictos de precio, advertencias |

## Reglas
1. **Ofertas ≠ contratos.** Los precios publicados no son alquileres ni ventas cerrados. Ningún comparable se presenta como renta comprobada.
2. **Moneda original siempre.** Las bases convierten al tipo de cambio del estudio y guardan ese tipo de cambio y su fecha en cada fila. Para un informe nuevo se reconvierte con el tipo de cambio del día.
3. **Sin datos personales.** No se guardan teléfonos, correos ni nombres de anunciantes particulares (`governance/PII_POLICY.md`); `consolidar.py` rechaza teléfonos y correos.
4. **Sin cifras publicadas como resultado.** La rentabilidad que anuncia un aviso o un vendedor no se carga como dato (D-099).
5. **Duplicados y excluidos se documentan**, no se borran en silencio. Se cuentan una sola vez y van con `usar_en_estadisticas: false` y su motivo, o en `excluidos`.
6. **Vigencia.** Un estudio describe el mercado en su `fecha_consulta`. Para decidir con datos de más de 3 meses se recomienda reconsultar los comparables principales. Esta regla es [EXTENSION]: no está en el material oficial.

## Registro de estudios

| Estudio | Ciudad y zona | Consulta | TC del estudio | Comparables (en estadísticas) | Confianza | Usado en |
|---|---|---|---|---|---|---|
| `CDE-CATEDRAL-2026-11-07` | CDE, Barrio Catedral / microcentro | 07/11/2026 | Gs 6.480,35 (BCP, 06/11) | 26 (22): 12 residenciales y 14 comerciales | MEDIA | `projects/meridiano-capital/presentaciones/edificio-catedral/` |
| `CDE-SAN-MIGUEL-2026-10-17` | CDE, San Miguel / Área 2 | 17/10/2026 | Gs 5.770,91 (BCP, cierre 16/10) | 15 (11): 6 de alquiler, 8 de venta y 1 terreno | BAJA en mercado | `.../edificio-barrio-san-miguel/` |
| `CDE-SAN-JOSE-2026-10-13` | CDE, Barrio San José | 13/10/2026 | Gs 5.698,03 (BCP, 14/10) | 13 (13): 11 de alquiler y 2 de venta, sin enlaces por fila | BAJA | `.../edificio-barrio-san-jose/` y `rentals/08` |
| `ASU-SAN-ROQUE-2026-11-07` | Asunción, San Roque / Herrera casi Brasil | 07/11/2026 | Gs 6.480,35 (BCP, 06/11) | 14 (10): 6 salones y locales, 2 oficinas, 1 consultorio, 4 departamentos y 1 venta, más 4 referencias de salud (incluye el Ministerio de Salud) | MEDIA-BAJA | `.../edificio-san-roque/` |
| `ASU-SAJONIA-2026-11-07` | Asunción, Sajonia: consultorios, oficinas para abogados y vivienda | 07/11/2026 | Gs 6.480,35 (BCP, 06/11) | 12 (7): 6 consultorios, 3 oficinas, 2 departamentos y 1 edificio en venta, más 4 referencias de salud | MEDIA-BAJA | `.../edificio-sajonia/` (v4) |
| `ASU-SAJONIA-2026-10-15` | Asunción, Sajonia / Palacio de Justicia | 15/10/2026 | Gs 5.698,03 (BCP, 14/10) | 17 (15): 12 de alquiler y 5 de venta, sin enlaces por fila | MEDIA-BAJA | `.../edificio-sajonia/` y `rentals/09` |

**Pendiente de normalizar:** los enlaces por fila de San José y Sajonia. Están en los informes originales de cada deck, pero no se transcribieron a la base.
