# Decisiones pendientes de confirmación

Ninguna de estas se resolvió unilateralmente. Mientras sigan abiertas, el
sistema se comporta de la forma más conservadora indicada.

| ID | Tema | Quién decide | Comportamiento actual (conservador) |
|---|---|---|---|
| PD-01 | **Segundo edificio de Canarias Inversiones S.A.**: no llegó su planilla. La hoja "Hoja1" del archivo FRM tiene otra nomenclatura de unidades (PB A, SS A…, GAR A…) e inquilinos distintos, con columnas de relevamiento de pérdidas de agua — ¿es el segundo edificio? | Founder | No se importa (no tiene alquileres ni pagos); se lista como hoja omitida |
| PD-02 | **Tratamiento de IVA**: (a) ¿el alquiler de la planilla es IVA incluido o adicional? La planilla calcula IVA = 5 % sobre el alquiler pero factura alquiler + expensas sin sumarlo; (b) IVA de expensas, servicios, intereses, penalidades y reparaciones imputables; (c) unidad 16 usa una fórmula de IVA al 10 % sobre el monto facturado | Contador/a | Obligaciones importadas con `ivaPendiente`; reglas no definidas en estado PENDIENTE (no se calcula IVA) |
| PD-03 | Matrícula de comerciante de **WICA S.A.** recibida junto a los archivos: ¿es una sociedad que debe administrarse en el sistema? | Founder | No cargada |
| PD-04 | Orden de imputación automática de pagos (más antiguo primero; alquiler antes que expensas) **[EXTENSION]** | Founder | Implementado como default; siempre se puede imputar manualmente |
| PD-05 | SIFEN: credenciales, certificado, homologación y proveedor (directo o vía integrador) | Founder + contador/a | Facturas `esPrueba`; sin emisión real |
| PD-06 | Contratos originales de las 7 ocupaciones de FRM (fechas, día de vencimiento, depósito, reajuste, mora, responsabilidad de expensas) | Administración | Contratos BORRADOR sin fechas; ocupación no se marca hasta activarlos |
| PD-07 | Prorrateo de meses parciales (inicio/fin a mitad de mes) | Founder | Importe completo marcado para revisión |
| PD-08 | Documento (CI/RUC) de los 7 inquilinos importados (la planilla no lo trae) | Administración | Personas creadas sin documento, PENDIENTE_REVISION; la deduplicación futura se hace por documento |
| PD-09 | Criterio de distribución de expensas del edificio FRM: la planilla usa montos fijos distintos por unidad (180.000 / 120.000 / 80.000) y divide algunos gastos "/12" aunque lista 16 unidades | Founder | Se importa el monto asignado por unidad tal cual; no se recalcula |
| PD-10 | Hosting de producción, backups (frecuencia/retención/restauración probada), Row Level Security en PostgreSQL, almacenamiento de documentos cifrado (S3/GCS) | Founder + técnico | Desarrollo local; ver README, sección Operación |
| PD-11 | Columnas sin campo propio: NIS ANDE (hoy se guarda en observaciones de la unidad); ignoradas: "Medidor", "ISAN ESSAP", "Monto Factura ANDE", "Agua/Impuesto municipal incluido en expensas", "Estado", proyecciones de alquiler +5/10/15 % e "Inversión estimada" | Founder | Se ignoran en la importación (quedan en el archivo original conservado) |
| PD-12 | Inconsistencias detectadas en la planilla FRM (ver `04-informe-carga-fase3.md`): ¿se corrigen en el Excel de origen o se ajustan en el sistema después de importar? | Administración | Se reportan; nada se corrige automáticamente |
