Estado: CURRENT — corrige un error conceptual que estaba vigente en todo el sistema (D-027 y HERRERA-001 file 36) desde 2026-08-02
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

## 2. Nuance sin resolver del todo — reventa por un no-constructor

Durante la verificación (2026-08-23) apareció una distinción que el sistema **no tenía documentada** y que **no se resuelve en este documento**: varias fuentes tributarias (no la DNIT directamente, sino firmas de asesoría) indican que **el IVA no alcanza la venta de inmuebles hecha por alguien que no es una empresa constructora/no actúa con habitualidad** — en ese caso, la operación queda exenta de IVA y en cambio tributa IRP (Impuesto a la Renta Personal, ~2,4% vía retención del escribano en al menos una fuente consultada), un régimen distinto.

**Por qué esto importa para Meridiano, específicamente**: `calculadora.py` usa `iva_venta_pct` tanto para ventas de unidades recién construidas (claramente "primera venta", el caso sin ambigüedad) como para escenarios de reventa de unidades ya adquiridas del portafolio propio (`evaluar_reventa`, `evaluar_reventa_temprana`) — donde Meridiano actúa como vendedor habitual de inmuebles (su actividad de negocio), lo cual **probablemente** la mantiene dentro del régimen de IVA de todas formas, pero esto es una interpretación, no una confirmación. **Se aplica la misma corrección (1,5% efectivo) a ambos casos como el mejor valor disponible hoy**, pero se deja marcado `[EXTENSION]` para el caso específico de reventa de una unidad ya terminada tiempo atrás — recomendación explícita: confirmar con la contadora de Meridiano si esos escenarios de reventa de portafolio califican para el régimen de IVA de inmuebles (1,5%) o si, al no ser "primera venta de obra nueva" ni necesariamente con habitualidad clara, podrían quedar exentos de IVA y sujetos a IRP en su lugar — lo cual bajaría el costo fiscal todavía más.

## 3. Fuentes consultadas (2026-08-23)

| Fuente | Nivel | Qué confirma |
|---|---|---|
| [Portal Institucional DNIT — IVA Transferencia de Inmueble](https://www.dnit.gov.py/en/web/portal-institucional/w/iva-transferencia-de-inmueble) | **Nivel 1 — autoridad tributaria oficial** | Tasa 5% (Art. 91, Ley 125/91); base imponible = "valor agregado mínimo... 30% del precio de venta del inmueble transferido" (Art. 82, Ley 125/91, mod. Ley 2421/04) |
| [TAXIT — ¿La venta de inmuebles está gravada por el IVA?](https://blog.taxit.com.py/venta-de-inmuebles-esta-gravada-por-el-iva/) | Nivel 2 — firma de asesoría tributaria, cita artículos exactos | Confirma el mismo mecanismo, con método de cálculo del IVA incluido (dividir entre 101,5 y multiplicar por 1,5) |
| Búsqueda web general (Ley N° 6380/2019, texto de BACN) | Nivel 1 — texto de ley | Confirma que la Ley 6380/2019 consolidó/mantuvo este régimen |
| Fuentes sobre habitualidad/reventa por persona física (búsqueda general) | Nivel 4 — no verificado contra la DNIT directamente | Sugiere que la reventa por no-constructor puede estar exenta de IVA — **no confirmado formalmente**, ver §2 |

**Contraste explícito, para que quede registrado**: una guía inmobiliaria orientada a inversores extranjeros (Inmovia) afirma una tasa de 10% para "primera venta de inmuebles nuevos", sin mencionar la base del 30%. **Se descarta esa fuente como menos confiable** frente a la DNIT (autoridad oficial) y TAXIT (cita artículos de ley específicos) — es plausible que esa fuente esté confundiendo la tasa general de IVA en Paraguay (10%, la que aplica a la mayoría de bienes/servicios) con la tasa reducida específica de inmuebles (5%), que es exactamente el mismo error que tenía `HERRERA-001/36-...md`.

## 4. Dónde se corrige esto en el sistema

- `production/app/config/parametros_mercado.json` — `fiscal.iva_venta_pct` reemplazado por `iva_venta_base_imponible_pct` (30.0) + `iva_venta_tasa_pct` (5.0), con `iva_venta_efectiva_pct` (1.5) calculado y documentado explícitamente.
- `production/app/backend/calculadora.py` — `evaluar_reventa()`/`evaluar_reventa_temprana()` recalculan el IVA con el mecanismo de dos factores, no un porcentaje plano.
- `production/app/backend/dev_engine/costos.py` / `parametros_dev_engine.json` — el ítem "IVA del desarrollador" pasa de `modo="porcentaje", base="directos"` (costo de construcción, incorrecto) a `base="ingresos"` (precio de venta) con la tasa efectiva de 1,5%.
- `contracts/cases/HERRERA-001/48-correccion-iva-venta-1-5-por-ciento-no-10-por-ciento.md` — recalcula Ángulo 1/2/3 con el IVA correcto y compara contra los márgenes anteriores.
- `governance/decisions/DECISION_REGISTER.md` — nueva decisión, corrige D-027 (venta/reventa 5%) y la base del "IVA del desarrollador" de HERRERA-001.
