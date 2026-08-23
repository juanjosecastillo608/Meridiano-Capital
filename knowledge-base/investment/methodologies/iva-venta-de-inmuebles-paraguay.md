Estado: CURRENT — corrige un error conceptual que estaba vigente en todo el sistema (D-027 y HERRERA-001 file 36) desde 2026-08-02; ampliado el mismo día (D-083) con la aclaración de quién vende/factura en cada modelo de negocio, resolviendo la mayor parte de la duda del §2
Fuente: Ley N° 125/91 Art. 82 (modificado por Ley N° 2421/04) y Art. 91, consolidados por la Ley N° 6380/2019 "De Modernización y Simplificación del Sistema Tributario Nacional" — verificado contra el Portal Institucional de la DNIT (Dirección Nacional de Ingresos Tributarios) y TAXIT (blog de una firma de asesoría tributaria paraguaya que cita los artículos exactos), 2026-08-23
Dominio: INVESTMENT/METHODOLOGY/GOVERNANCE

# IVA sobre venta de inmuebles en Paraguay — mecanismo correcto

## 0. El error que corrige este documento

Todo el sistema (la calculadora general de Meridiano y el caso `HERRERA-001`) venía aplicando el IVA de venta de dos formas, **ninguna de las dos correcta**:

| Dónde | Qué aplicaba (incorrecto) | Efecto |
|---|---|---|
| `production/app/config/parametros_mercado.json` (`iva_venta_pct`, D-027, 2026-08-02) | **5% sobre el 100% del valor de venta** | Sobreestima el IVA real en ~3,33× |
| `contracts/cases/HERRERA-001/36-...md` ("IVA del desarrollador", 2026-08-17) | **10% sobre el costo de construcción** (no sobre el precio de venta) | Base de cálculo equivocada además de tasa equivocada — mezclaba la tasa general de IVA (10%, la que aplica a la mayoría de bienes y servicios) con la venta de inmuebles, que tiene una tasa reducida propia |

**El propio sistema ya había marcado esto como sospechoso** — la nota de `iva_venta_pct` en `knowledge-base/investment/03-parametros-de-mercado.md` decía explícitamente: *"la base de cálculo (precio total vs. solo el margen) es interpretación `[EXTENSION]`, a confirmar con contadora"*. Esta corrección resuelve esa duda pendiente — con una tercera opción que ninguna de las dos hipótesis anteriores (precio total, o solo margen) había contemplado: **una base presunta del 30% del precio**, fijada por ley, no por contabilidad real.

## 1. El mecanismo correcto

> **IVA de venta de inmuebles = 5% × 30% del precio de venta = 1,5% efectivo sobre el precio de venta total.**

- **Base imponible**: la ley presume que el **valor agregado mínimo es el 30% del precio de venta del inmueble transferido** (Art. 82, Ley 125/91, modificado por Ley 2421/04) — es una base *presunta*, no depende de la contabilidad de costos real del vendedor.
- **Tasa**: **5%**, la tasa reducida que aplica específicamente a la enajenación de inmuebles (Art. 91, Ley 125/91) — **no la tasa general del 10%** que aplica a la mayoría de bienes y servicios en Paraguay. Confundir ambas tasas es exactamente el error que traía el sistema.
- **Resultado**: 5% × 30% = **1,5% efectivo sobre el 100% del precio de venta**.
- **A quién aplica**: la venta de inmuebles por una **persona jurídica** (una S.A. como el vehículo de HERRERA-001, o cualquier empresa constructora/desarrolladora) está gravada. El 70% restante del precio queda exento — en la factura, el monto total se separa en una columna de operaciones gravadas (30%) y una de operaciones exentas (70%).

**Ejemplo**: una unidad que se vende a USD 150.000 paga IVA = USD 150.000 × 30% × 5% = **USD 2.250** (1,5% de USD 150.000) — no USD 7.500 (5% directo) y mucho menos USD 15.000 (10% directo).

## 2. Quién es el vendedor real — resuelto con el modelo de negocio de Meridiano (2026-08-23, D-083)

La duda original (§2, versión anterior de este documento) era si la reventa de una unidad de portafolio, al no ser necesariamente "primera venta de obra nueva" hecha por un constructor, podría estar exenta de IVA (régimen IRP en su lugar). **El founder aclaró el modelo de negocio real y esto queda mayormente resuelto**:

> *"Meridiano solo vende y factura la unidad cuando actúa como desarrollador y/o coinversión. Meridiano es un intermediario en el 90% de los casos. Porque son los inversores a través de las Sociedades Anónimas que creamos como vehículos para la inversión [quienes venden y facturan]."*

Cruzado con `knowledge-base/business/01-dos-modelos-de-negocio.md` (ya vigente, no se contradice — se confirma con más detalle fiscal):

| Modelo | Quién vende/factura | Ingreso de Meridiano | Motor de cálculo | Vendedor es persona jurídica (S.A.) |
|---|---|---|---|---|
| **A — Inversión Individual** (~90% de los casos) | **El inversor**, vía la S.A. que Meridiano le creó como vehículo de inversión | Comisión de venta 5,5% (servicio de intermediación, IVA 10% aparte — ver §3) | `evaluar_reventa`, `evaluar_reventa_temprana` | **Sí — casi siempre**, porque Meridiano estructura la inversión con un vehículo societario, no a nombre de la persona física directamente |
| **B — Coinversión / Desarrollador** (~10% de los casos, incluido HERRERA-001) | **Meridiano** (o el vehículo de coinversión que estructura y gestiona) | Fee de estructuración + gestión + carried interest (Modelo B) o margen del desarrollo (rol desarrollador) | `evaluar_coinversion` / `dev_engine` | Sí — Meridiano mismo es la persona jurídica vendedora |

**Conclusión práctica**: en los dos modelos, quien vende factura como **persona jurídica (una S.A.)** — nunca una persona física vendiendo a título propio sin vehículo. Esto **resuelve la mayor parte de la duda**: el régimen de IVA de inmuebles (1,5% efectivo) aplica de forma consistente en ambos modelos, sea Meridiano o el inversor (vía su S.A.) quien factura la venta — `iva_venta_efectiva_pct` sigue siendo el valor correcto para `evaluar_reventa`/`evaluar_reventa_temprana` (Modelo A) tanto como para `dev_engine`/HERRERA-001 (Modelo B).

**Lo que sí cambia con esta aclaración, y que el sistema no modelaba**: en el Modelo A, el 1,5% de IVA de venta es un costo que recae sobre la **S.A. del inversor**, no sobre Meridiano — Meridiano solo cobra su comisión (5,5%, con su propio IVA de servicio del 10%, ver §3). `calculadora.py` ya calcula el IVA de venta como una cifra informativa adicional (`iva_venta_monto`, `valor_salida_neto_iva`) sin mezclarla con el ingreso de Meridiano — esto ya era estructuralmente correcto, ahora queda documentado *por qué* es correcto.

**Remanente real, todavía sin verificar formalmente**: no se confirmó con la contadora si **cada** S.A.-vehículo que Meridiano crea para un inversor individual necesariamente califica como sujeto habitual de IVA sobre inmuebles desde su primera operación (podría haber un caso límite si la S.A. es de constitución muy reciente y esa es su única transacción) — se considera un riesgo residual bajo, no un `[EXTENSION]` activo como antes.

## 3. Dos impuestos distintos que nunca deben mezclarse — venta del inmueble vs. servicio de intermediación

Con la aclaración del §2, queda más claro por qué el sistema ya distinguía (correctamente) dos IVA distintos en HERRERA-001, y por qué esa separación importa todavía más en el Modelo A:

| | IVA de venta del inmueble | IVA de la comisión de Meridiano |
|---|---|---|
| Qué grava | La transferencia del inmueble en sí | El servicio de intermediación/venta que presta Meridiano |
| Tasa | 5% sobre base presunta del 30% → **1,5% efectivo** | **10%**, la tasa general de servicios (no la reducida de inmuebles — un servicio no es un inmueble) |
| Quién lo paga/factura | Quien vende el inmueble (Meridiano en Modelo B/HERRERA-001; la S.A. del inversor en Modelo A) | Meridiano, sobre su propia comisión (5,5% del total de la venta, D-063) |
| Dónde ya estaba bien modelado | `dev_engine` (HERRERA-001), `calculadora.py` (`iva_venta_*`) | Ya mencionado como "5,5% del total de la venta (con IVA 10% incluido)" en el Memorándum — la comisión de Meridiano YA se factura con la tasa general de servicios, no con la de inmuebles |

**Nunca calcular el 1,5% sobre la comisión de Meridiano, ni el 10% sobre el precio de venta del inmueble** — son bases y sujetos distintos.

## 4. Fuentes consultadas (2026-08-23)

| Fuente | Nivel | Qué confirma |
|---|---|---|
| [Portal Institucional DNIT — IVA Transferencia de Inmueble](https://www.dnit.gov.py/en/web/portal-institucional/w/iva-transferencia-de-inmueble) | **Nivel 1 — autoridad tributaria oficial** | Tasa 5% (Art. 91, Ley 125/91); base imponible = "valor agregado mínimo... 30% del precio de venta del inmueble transferido" (Art. 82, Ley 125/91, mod. Ley 2421/04) |
| [TAXIT — ¿La venta de inmuebles está gravada por el IVA?](https://blog.taxit.com.py/venta-de-inmuebles-esta-gravada-por-el-iva/) | Nivel 2 — firma de asesoría tributaria, cita artículos exactos | Confirma el mismo mecanismo, con método de cálculo del IVA incluido (dividir entre 101,5 y multiplicar por 1,5) |
| Búsqueda web general (Ley N° 6380/2019, texto de BACN) | Nivel 1 — texto de ley | Confirma que la Ley 6380/2019 consolidó/mantuvo este régimen |
| Fuentes sobre habitualidad/reventa por persona física (búsqueda general) | Nivel 4 — no verificado contra la DNIT directamente | Sugiere que la reventa por no-constructor puede estar exenta de IVA — en el modelo real de Meridiano esto queda mayormente resuelto (§2): las ventas siempre se facturan vía una S.A., no una persona física a título propio |

**Contraste explícito, para que quede registrado**: una guía inmobiliaria orientada a inversores extranjeros (Inmovia) afirma una tasa de 10% para "primera venta de inmuebles nuevos", sin mencionar la base del 30%. **Se descarta esa fuente como menos confiable** frente a la DNIT (autoridad oficial) y TAXIT (cita artículos de ley específicos) — es plausible que esa fuente esté confundiendo la tasa general de IVA en Paraguay (10%, la que aplica a la mayoría de bienes/servicios) con la tasa reducida específica de inmuebles (5%), que es exactamente el mismo error que tenía `HERRERA-001/36-...md`.

## 5. Dónde se corrige esto en el sistema

- `knowledge-base/business/01-dos-modelos-de-negocio.md` — confirma, sin contradecir, quién vende/factura en cada modelo (§2 de este documento).
- `production/app/config/parametros_mercado.json` — `fiscal.iva_venta_pct` reemplazado por `iva_venta_base_imponible_pct` (30.0) + `iva_venta_tasa_pct` (5.0), con `iva_venta_efectiva_pct` (1.5) calculado y documentado explícitamente.
- `production/app/backend/calculadora.py` — `evaluar_reventa()`/`evaluar_reventa_temprana()` recalculan el IVA con el mecanismo de dos factores, no un porcentaje plano.
- `production/app/backend/dev_engine/costos.py` / `parametros_dev_engine.json` — el ítem "IVA del desarrollador" pasa de `modo="porcentaje", base="directos"` (costo de construcción, incorrecto) a `base="ingresos"` (precio de venta) con la tasa efectiva de 1,5%.
- `contracts/cases/HERRERA-001/48-correccion-iva-venta-1-5-por-ciento-no-10-por-ciento.md` — recalcula Ángulo 1/2/3 con el IVA correcto y compara contra los márgenes anteriores.
- `governance/decisions/DECISION_REGISTER.md` — nueva decisión, corrige D-027 (venta/reventa 5%) y la base del "IVA del desarrollador" de HERRERA-001.
