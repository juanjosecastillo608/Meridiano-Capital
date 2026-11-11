# Actualización contractual 04 — Fechas individuales y fechas comunes

Fecha: 2026-11-11. Decisión de registro: **D-099**. Complementa la Actualización 03 (D-098, `06-contrato-residencial-12m.md`).

## Configuración predeterminada (sin cambios respecto de la v1 de D-098)

Plazo residencial 12 meses · canon = importe mensual actual validado · incremento 0 % · inicio **individual por inquilino** · fin calculado por meses calendario · **fecha común** como opción administrativa para contratos seleccionados.

## Modelo de datos — `LeaseContract` = `Contrato`

| Campo del anexo | Campo | Notas |
|---|---|---|
| startDate | `fechaInicio` | obligatoria para aprobar; nunca por defecto |
| endDate | `fechaFin` | siempre `calculateLeaseEndDate(startDate, termMonths)` salvo excepción autorizada |
| signatureDate | `fechaFirma` | independiente del inicio |
| termMonths | `plazoMeses` | |
| dateSelectionMode | `dateSelectionMode` | `INDIVIDUAL` / `COMUN` |
| dateAgreementStatus | `dateAgreementStatus` | `NO_REQUERIDO` / `PENDIENTE` / `ACEPTADO` / `RECHAZADO` |
| dateAgreementEvidenceId | `dateAgreementEvidenceId` | documento del acuerdo del inquilino |
| legalReviewStatus | `legalReviewStatus` | `PENDIENTE` / `APROBADA` / `OBSERVADA` |
| dateApprovedBy / dateApprovedAt | `dateApprovedBy` / `dateApprovedAt` | aprobación definitiva de fechas |
| — | `contractBatchId` | lote de origen (si lo hay) |

Entidades nuevas: **`ContractBatch`** (lote: edificio, fecha común propuesta, plazo, motivo, estado) con **`ContractBatchItem`** (por unidad: fecha anterior, propuesta, acuerdo + evidencia, revisión jurídica, estado, contrato generado) y **`ContratoFechaVersion`** (historial de fechas de cada contrato: toda edición agrega una versión; ninguna se pisa).

## Reglas

| ID | Regla |
|---|---|
| RN-F-01 | Cada contrato tiene sus propias fechas de inicio, fin y firma; la firma es independiente del inicio. |
| RN-F-02 | El inicio nunca se toma de la fecha de importación del Excel ni del ingreso histórico del inquilino: siempre se informa explícitamente (sin valor por defecto en servicio ni en pantalla). |
| RN-F-03 | Fechas anteriores a hoy (individuales, de lote o en edición) solo con autorización retroactiva expresa (motivo + quién autoriza) por un usuario con permiso de configuración. |
| RN-F-04 | Edición individual: crea una versión nueva, recalcula el fin por meses calendario, verifica superposición y anula la aprobación de fechas y la confirmación de inicio. |
| RN-F-05 | La fecha común de un lote es una **propuesta**: crear el lote no crea ni modifica contratos. Muestra, por unidad, la fecha anterior (contrato actual) y la propuesta. |
| RN-F-06 | Cada unidad del lote necesita el **acuerdo individual del inquilino con evidencia** y la **revisión jurídica aprobada**. Al confirmar, solo esas se autorizan; las demás quedan EXCLUIDAS con su motivo. |
| RN-F-07 | Los borradores del lote se generan **individualmente** (un fallo en una unidad no afecta a las demás), cada uno con sus fechas, autorizaciones, `dateSelectionMode = COMUN` y referencia al lote. |
| RN-F-08 | La aprobación definitiva de fechas se bloquea si: falta el inicio; el fin no coincide con el plazo aprobado; el inquilino no está identificado (sin CI/RUC); el canon no fue validado; falta la revisión jurídica; o es fecha común sin acuerdo registrado con evidencia. |
| RN-F-09 | Un contrato generado desde plantilla no pasa a pendiente de firma ni a vigente sin la aprobación definitiva de fechas (además de los pasos de D-098). |
| RN-F-10 | Recordatorios a 90, 60 y 30 días (y día del vencimiento, D-098) calculados sobre la fecha final individual de cada contrato; calendario general filtrable por sociedad y edificio, con aislamiento entre sociedades. |

## Interfaz

- `/contratos/calendario`: calendario mensual de vencimientos y recordatorios por sociedad y edificio, más la lista de próximos vencimientos.
- `/contratos/lotes` → `/contratos/lotes/[id]`: preparación masiva (selección de unidades, fecha común, acuerdo por inquilino con evidencia, revisión jurídica, confirmación y generación individual).
- `/contratos/[id]`: campos de fechas del anexo, edición individual (con versiones) y aprobación definitiva con la lista de motivos que la bloquean.

## Pruebas (`tests/integration/fechas-lote.test.ts`, 8 casos; total 96 en verde)

Contratos con fechas individuales diferentes y firma independiente; sin inicio por defecto; retroactividad sin/ con autorización; edición individual con versiones conservadas y fin recalculado (29/02/2032 → 28/02/2033); bloqueos de la aprobación definitiva (revisión jurídica, fin manipulado, inquilino sin CI, canon no validado, fecha común sin acuerdo); lote con fecha común: propuesta sin efectos, evidencia obligatoria, revisión jurídica por permiso, confirmación que genera solo los autorizados y excluye el resto; calendario con recordatorios 90/60/30 correctos y aislamiento entre sociedades.

## Estado con datos reales (Canarias, FRM)

Las 7 unidades ocupadas siguen bloqueadas hasta validar su canon (PD-21) y sus contratos actuales no tienen fechas (vienen de la planilla), por lo que "fecha anterior" se muestra como "sin fecha". Además, sus inquilinos no tienen CI cargado: la aprobación definitiva quedará bloqueada hasta completarlo (PD-22).
