# Actualización contractual 03 — Plazo residencial de 12 meses (Canarias Inversiones S.A.)

Fecha: 2026-11-11. Decisión de registro: **D-098**.

## Decisión comercial aprobada (founder)

Valores predeterminados para **nuevos contratos residenciales** de Canarias
Inversiones S.A. (edificios MONTEVIDEO y FRM). **No se aplican a locales comerciales.**

| Parámetro (configuración versionada) | Valor v1 |
|---|---|
| `residentialLeaseDefaultTermMonths` | 12 |
| `residentialLeaseInitialIncreasePercent` | 0 |
| `residentialLeaseRentPolicy` | `KEEP_VALIDATED_CURRENT_RENT` |
| `residentialLeaseAutoAdjustment` | false |
| Alertas internas de vencimiento | 90 / 60 / 30 días y día del vencimiento |

Cada cambio crea una **versión nueva** (`ConfiguracionContractual`): nunca se
edita la anterior; quedan usuario, fecha, quién autorizó y motivo, y un registro
de auditoría. Se edita desde la ficha de la sociedad (permiso `CONFIGURAR_SOCIEDAD`).

## Cálculo de vigencia — `calculateLeaseEndDate(startDate, termMonths)`

`src/domain/plazos.ts`. Fechas de calendario `YYYY-MM-DD` sin zona horaria;
inicio y fin inclusivos; meses calendario:

> fin = (mismo día del mes, N meses después) − 1 día; si ese día no existe en el mes de destino, el aniversario es el día 1 del mes siguiente.

| Inicio | Plazo | Fin |
|---|---|---|
| 01/12/2026 | 12 | **30/11/2027** (ejemplo del anexo) |
| 15/03/2026 | 12 | 14/03/2027 |
| 01/02/2026 | 12 | 31/01/2027 |
| 01/03/2027 | 12 | 29/02/2028 (bisiesto) |
| 29/02/2028 | 12 | 28/02/2029 |
| 31/01/2026 | 1 | 28/02/2026 |

Excepciones: solo con fecha de fin expresa, motivo y quién autorizó, por un
usuario con permiso de configuración; quedan auditadas
(`CONTRATO_EXCEPCION_PLAZO`). La vista previa muestra inicio, fin, días,
canon y faltantes **antes** de generar, y la generación exige reconfirmar la
fecha de fin mostrada.

## Reglas del canon

| ID | Regla |
|---|---|
| RN-CR-01 | El canon nuevo es exactamente el **último alquiler mensual validado** del contrato actual: una `CondicionContrato` marcada `validado` por un usuario con `VALIDAR_CANON`, que debe reescribir el importe (doble control) e indicar el respaldo. |
| RN-CR-02 | Nunca se toma como canon un pago (parcial o anticipo), una bonificación, expensas, servicios, intereses ni deuda: el canon sale solo de la condición contractual. |
| RN-CR-03 | Si alguna planilla importada muestra un importe de alquiler distinto al del contrato, la validación y la generación **se detienen** hasta resolverlo administrativamente. |
| RN-CR-04 | Incremento inicial 0 %; reajuste `SIN_REAJUSTE` y no validado (no hay reajuste automático). |
| RN-CR-05 | Moneda del contrato actual; cuenta receptora elegida explícitamente entre las activas de la sociedad (misma moneda). Con varias cuentas activas no se elige por defecto. |
| RN-CR-06 | Fecha de inicio individual, obligatoria; no se asume. La fecha de firma puede diferir: el plazo se computa desde el inicio. |
| RN-CR-07 | Depósito: se verifica individualmente; si no se informa, queda pendiente. |
| RN-CR-08 | Unidades no residenciales (locales comerciales, vacantes o no) quedan excluidas. Unidades sin inquilino actual también. |
| RN-CR-09 | Un contrato anterior VENCIDO admite renovación con inicio posterior a su fin (se advierte el período sin contrato); nunca superposición. |
| RN-CR-10 | Un contrato actual genera como máximo un contrato nuevo (`contratoAnteriorId` único). El anterior y su historial no se modifican. |
| RN-CR-11 | El contrato generado es **BORRADOR / PENDIENTE_REVISION**. No pasa a pendiente de firma ni a vigente sin: inicio confirmado, cuenta, depósito verificado, revisión jurídica aprobada (permiso de configuración) y, para vigente, el contrato firmado incorporado. |
| RN-CR-12 | Las alertas 90/60/30/0 días son recordatorios internos: no renuevan, no rescinden ni modifican el contrato. |

## Plantilla `RESIDENCIAL_12M_v1` (DOCX)

`src/server/plantillas/contrato-residencial.ts`. Incluye literalmente la
cláusula de plazo del anexo con las fechas en formato dd/mm/aaaa, el canon en
número y letras, la moneda, el día de vencimiento y la cuenta receptora. Todo
dato desconocido se imprime como `[PENDIENTE: …]` (resaltado) y se lista al
pie; nunca se completa con supuestos. El encabezado dice **"BORRADOR — NO
FIRMADO — NO VIGENTE"** y que la redacción es provisional y requiere revisión
jurídica. Las cláusulas restantes (expensas, servicios, garantes, mora,
rescisión) quedan como `[PENDIENTE]` hasta esa revisión.

## Pruebas obligatorias (todas en verde)

| Caso del anexo | Test |
|---|---|
| Inicio el primer día del mes | `plazos.test.ts`, `contrato-residencial.test.ts` |
| Inicio a mitad de mes | ídem |
| Inicio en febrero | `plazos.test.ts` |
| Años bisiestos | ídem + borrador con inicio 29/02/2028 |
| Diferencia firma / inicio | `contrato-residencial.test.ts` |
| Conservación exacta del canon | ídem (incluye anticipo y alquiler + expensas rechazado como canon) |
| Cuentas bancarias múltiples | ídem (sin cuentas, varias, otra moneda) |
| Contratos anteriores vencidos | ídem |
| Unidades sin documentación completa | ídem (borrador con `[PENDIENTE]`) |
| Exclusión de locales comerciales vacantes | ídem |

## Estado en Canarias Inversiones S.A. (datos reales)

Configuración v1 cargada. En FRM, las **7 unidades con inquilino** quedan como
candidatas pero **bloqueadas hasta validar el canon**: hoy sus importes salen
de la planilla de cobro, no de contratos originales; validarlos es un acto
administrativo con respaldo que el sistema no hace solo. Unidades vacantes y el
local comercial quedan excluidos. Montevideo, sin planilla todavía.

## Decisiones pendientes

| ID | Tema |
|---|---|
| PD-19 | Convención de cómputo del plazo (aniversario inexistente → día 1 del mes siguiente) **[EXTENSION]**: confirmar con el abogado contra el Código Civil paraguayo. |
| PD-20 | Revisión jurídica de la plantilla `RESIDENCIAL_12M_v1` y redacción de las cláusulas restantes. |
| PD-21 | Validación del canon de las 7 unidades ocupadas de FRM (con contrato original o recibo) y carga de la cuenta bancaria activa de la sociedad (la planilla menciona una cuenta corriente que no se cargó por no estar confirmada). |
| PD-22 | Domicilio fiscal de la sociedad, dirección de los edificios, CI y domicilio de los inquilinos y representante con poder vigente: hoy quedan `[PENDIENTE]` en los borradores. |
