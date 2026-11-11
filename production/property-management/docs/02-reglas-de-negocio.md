# Reglas de negocio implementadas

Cada regla indica dónde vive en el código y qué test la cubre. Las marcadas
**[EXTENSION]** no estaban definidas en el requerimiento ni en el repo: son
propuestas técnicas pendientes de confirmación (ver `03-decisiones-pendientes.md`).

## Dinero y fechas
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-DIN-01 | Importes en Decimal exacto; PYG a 0 decimales, USD a 2, HALF_UP | `domain/money.ts` | unit "money" |
| RN-DIN-02 | Importes en formato local ("3.000.000", "1.500,50") se interpretan sin ambigüedad o se rechazan | `parsearImporte` | unit |
| RN-DIN-03 | Nunca se convierten ni suman monedas distintas | `domain/pagos.ts`, `consultas.ts` | unit, integración |
| RN-FEC-01 | Día de vencimiento 29–31 se acota al último día del mes | `fechaVencimiento` | unit |
| RN-FEC-02 | "Hoy" = fecha en America/Asunción | `hoyAsuncion` | unit |

## Contratos
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-CON-01 | No puede haber dos contratos activos (pendiente de firma / vigente / vencido) superpuestos en la misma unidad | `detectarSuperposiciones` + advisory lock | unit, integración |
| RN-CON-02 | Rescisión anticipada acorta el rango ocupado | `finEfectivo` | unit |
| RN-CON-03 | Activar (VIGENTE/PENDIENTE_FIRMA) exige fechas de inicio/fin y día de vencimiento; BORRADOR puede no tenerlas | `validarParaActivar` | integración |
| RN-CON-04 | Cambios de importe = nueva `CondicionContrato` con motivo y referencia; nunca se edita la anterior | `modificarAlquiler` | integración |
| RN-CON-05 | Reajuste automático solo con fórmula registrada **y validada**; índices externos no se consultan solos | `calcularReajuste` | unit |
| RN-CON-06 | Alertas de vencimiento configurables (90/60/30 por defecto, por sociedad) y separadas del estado jurídico | `alertaVencimiento`, `ConfiguracionAlerta` | unit |
| RN-CON-07 | Transiciones de estado permitidas explícitas; RENOVADO/RESCINDIDO/FINALIZADO son terminales; todo cambio exige motivo | `cambiarEstadoContrato` | integración |

## Obligaciones
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-OBL-01 | Generación mensual de ALQUILER para contratos VIGENTE/VENCIDO dentro de rango, idempotente | `generarObligacionesAlquiler`, `generarObligacionesMensuales` | unit, integración |
| RN-OBL-02 | Mes parcial: importe completo **marcado para revisión**; no se inventa prorrateo [PD-07] | ídem | unit |
| RN-OBL-03 | Expensas no se generan desde el contrato: salen de liquidación aprobada y solo si el contrato las asigna al inquilino | `esTrasladable` | unit |
| RN-OBL-04 | Intereses moratorios solo con tasa pactada y validada; interés simple diario sobre saldo, después de vencimiento + gracia | `calcularMora` | unit |
| RN-OBL-05 | Anular una obligación exige motivo y que no tenga pagos imputados | `anularObligacion` | — |

## Cobranzas
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-COB-01 | Un pago puede distribuirse entre varias obligaciones; nunca más que el saldo de cada una ni más que el pago | `aplicarPago` | unit, integración (ejemplo §10) |
| RN-COB-02 | Una obligación es PAGADA solo con saldo exactamente cero | `estadoPorSaldo` | unit |
| RN-COB-03 | Remanente = saldo a favor (anticipo / exceso), imputable después | `imputarSaldoAFavor` | integración |
| RN-COB-04 | No se registra dos veces la misma transferencia (cuenta + comprobante + importe) | `claveDuplicadoPago` | unit, integración |
| RN-COB-05 | Reversión exige motivo, restaura saldos y queda auditada | `revertirPago` | integración |
| RN-COB-06 | Se registran fecha declarada y fecha real de acreditación por separado | `Pago.fechaPago` / `fechaAcreditacion` | — |
| RN-COB-07 **[EXTENSION]** | Imputación automática: vencimiento más antiguo primero; a igual vencimiento, ALQUILER antes que EXPENSAS [PD-04] | `ordenarParaImputar` | unit |
| RN-COB-08 | La cuenta receptora debe ser de la misma sociedad y moneda | `registrarPago` | — |

## Fiscal
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-FIS-01 | Reglas fiscales versionadas por categoría y vigencia, con fuente | `ReglaFiscal`, `resolverRegla` | unit |
| RN-FIS-02 | Regla PENDIENTE o inexistente ⇒ IVA no se calcula y la obligación queda `ivaPendiente` | `calcularIva` | unit |
| RN-FIS-03 | Alquiler residencial 5 %, comercial 10 %, renta temporal 10 % (founder, D-001/D-045); expensas, servicios, intereses, penalidades y reparaciones: **PENDIENTES** | `prisma/seed.ts` | integración |
| RN-FIS-04 | Facturación y cobranza son procesos separados; estado de facturación visible por obligación | `estadoDeCuenta` | — |
| RN-FIS-05 | Ningún comprobante es fiscal real: `esPrueba = true` hasta homologación SIFEN | `Factura.esPrueba` | — |

## Expensas
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-EXP-01 | Distribución por m², coeficiente, partes iguales, importe fijo o manual; la suma redondeada cuadra exacto (mayor resto) | `distribuir` | unit |
| RN-EXP-02 | Sin superficie/coeficiente en alguna unidad ⇒ no se distribuye | ídem | unit |
| RN-EXP-03 | Gasto del PROPIETARIO nunca se traslada; ordinario/extraordinario solo con respaldo contractual | `esTrasladable` | unit |

## Importación de Excel
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-IMP-01 | Se leen todas las hojas; se detectan encabezados, fórmulas (y su resultado), celdas combinadas, períodos, metadatos y bloques fuera de tabla | `import/analizar.ts` | unit |
| RN-IMP-02 | El mapeo se propone por sinónimos y el usuario lo corrige; un campo no puede venir de dos columnas | `diccionario.ts`, `procesar.ts` | unit |
| RN-IMP-03 | Sin moneda identificada ⇒ bloqueo; no se asume ni se convierte | `procesar` | unit, integración |
| RN-IMP-04 | Se conservan los períodos originales de cada hoja | ídem | unit |
| RN-IMP-05 | Inconsistencias se reportan, no se corrigen (ver lista de códigos abajo) | ídem | unit |
| RN-IMP-06 | Pago repetido entre períodos (mismo importe y fecha) ⇒ no se registra dos veces; la obligación del período sí | ídem + `confirmarImportacion` | unit, integración |
| RN-IMP-07 | Confirmación explícita; unidades existentes no se modifican; todo queda IMPORTADO / PENDIENTE_REVISION | `confirmarImportacion` | integración |
| RN-IMP-08 | Sin contrato original: se crea contrato BORRADOR **sin fechas** (no se inventan); el importe observado se registra con referencia al período | ídem | integración |
| RN-IMP-09 | Archivo original guardado con SHA-256; reimportar el mismo archivo se detecta y no duplica | `analizarArchivo` | integración |
| RN-IMP-10 | Texto en la columna "inquilino" que describe la unidad (ej. "ATICO") no crea una persona | `procesar` | caso real FRM |

Códigos de inconsistencia que reporta el importador: `MONEDA_NO_IDENTIFICADA`,
`PERIODO_INVALIDO`, `PERIODO_INCONSISTENTE`, `SIN_COLUMNA_UNIDAD`,
`CAMPO_MAPEADO_DOS_VECES`, `IMPORTE_INVALIDO`, `FECHA_INVALIDA`, `ALQUILER_CERO`,
`PAGO_EN_VACANTE`, `MARCA_OK_SIN_PAGO`, `PAGO_SIN_FECHA`,
`PAGO_DISTINTO_ESPERADO`, `FECHA_PAGO_FUERA_DE_PERIODO`,
`FACTURA_DISTINTA_PAGO`, `IVA_NO_COINCIDE`, `IVA_TRATAMIENTO_A_CONFIRMAR`,
`FORMULAS_IVA_DISTINTAS`, `CANTIDAD_UNIDADES_NO_COINCIDE`,
`COLUMNAS_SIN_ENCABEZADO`, `BLOQUE_NO_TABULAR`, `UNIDAD_DUPLICADA`,
`MEDIDOR_COMPARTIDO`, `ALQUILER_CAMBIA`, `INQUILINO_CAMBIA`,
`PAGO_DUPLICADO_PROBABLE`, `INQUILINO_PARECE_DESCRIPCION`.

## Remodelaciones e indicadores
| ID | Regla | Código | Test |
|---|---|---|---|
| RN-REM-01 | Cada partida lleva calidad del dato (recibido, cotización verificada, cálculo, supuesto, faltante, revisión técnica) | `PartidaRemodelacion.calidadDato` | unit |
| RN-REM-02 | Presupuesto con partidas sin precio o con revisión técnica pendiente no es aprobable | `resumirPresupuesto` | unit |
| RN-REM-03 | Impacto de remodelación siempre PROYECTADO; requiere fuente del alquiler posterior | `impactoRemodelacion` | unit |
| RN-IND-01 | Cada indicador expone fórmula, período y origen; sin dato base ⇒ "no calculable" | `calcularIndicadores` | — |
| RN-IND-02 | Rentabilidad sobre valor de inmueble solo si el valor tiene fuente documentada | ídem, `resultadoPorPropiedad` | — |
