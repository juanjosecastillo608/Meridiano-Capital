# Decisiones pendientes de confirmación

Ninguna de estas se resolvió unilateralmente. Mientras sigan abiertas, el
sistema se comporta de la forma más conservadora indicada.

| ID | Tema | Quién decide | Comportamiento actual (conservador) |
|---|---|---|---|
| PD-01 | **Edificio MONTEVIDEO** (confirmado en el anexo, D-097): falta su planilla. Hipótesis: "Hoja1" de la planilla FRM es Montevideo (1 salón + 10 deptos, igual al inventario declarado) pero muestra el salón ocupado mientras el anexo lo declara vacante. La hoja "Hoja1" del archivo FRM tiene otra nomenclatura de unidades (PB A, SS A…, GAR A…) e inquilinos distintos, con columnas de relevamiento de pérdidas de agua — ¿es el segundo edificio? | Founder | No se importa (no tiene alquileres ni pagos); se lista como hoja omitida |
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
| PD-13 | Archivos del anexo no incorporados: planilla Montevideo, poder de la sociedad, planos de Montevideo y FRM, mapa de ubicación, resolución de aprobación de planos | Founder | Ver `05-anexo-canarias.md`; `scripts/cargar-anexo-canarias.ts` los carga al estar disponibles |
| PD-14 | Áticos 15 y 16 de FRM: ¿son unidades alquilables (fuera del inventario declarado) o espacios sin uso? | Founder | Excluidos del inventario; filas OMITIDA |
| PD-15 | "Local 1 (PB)" del checklist = "Salon" de la planilla FRM? | Founder | Sector común sin vincular |
| PD-16 | Oferta del proveedor de G. 16.550.000: ¿solo mano de obra o con materiales? | Founder + proveedor | Cotización registrada; nada aprobado |
| PD-17 | ¿El usuario de la sociedad propietaria debe ver documentos sensibles (poder, representantes)? **[EXTENSION]** por defecto NO | Founder | PROPIETARIO_CONSULTA sin VER_DOCUMENTOS_SENSIBLES; ADMIN_SOCIEDAD sí |
| PD-18 | Pagos importados de planilla quedan SIN_RESPALDO pero sí reducen el saldo **[EXTENSION]**; ¿conciliar contra extracto de la cuenta corriente de la sociedad? | Founder + contador/a | Alerta con el total sin respaldo |
| PD-19 | Convención de cómputo del plazo contractual (aniversario inexistente → día 1 del mes siguiente) **[EXTENSION]** | Abogado/a | Implementada como default; ver `06-contrato-residencial-12m.md` |
| PD-20 | Revisión jurídica de la plantilla `RESIDENCIAL_12M_v1` y cláusulas restantes | Abogado/a | Borradores marcados "no firmado, no vigente"; paso obligatorio antes de activar |
| PD-21 | Validación del canon de las 7 unidades ocupadas de FRM y carga de la cuenta bancaria activa de la sociedad | Administración | Generación bloqueada hasta validar |
| PD-22 | Domicilio fiscal, direcciones de edificios, CI/domicilio de inquilinos, representante con poder vigente | Administración | `[PENDIENTE]` en los borradores |
| PD-23 | Quién firma la aprobación definitiva de fechas y la revisión jurídica (hoy: permiso `CONFIGURAR_SOCIEDAD`, es decir SUPERADMIN / ADMIN_GENERAL / ADMIN_SOCIEDAD) **[EXTENSION]** | Founder | Implementado así; ajustable por rol |
| PD-24 | Forma admitida de evidencia del acuerdo del inquilino con la fecha común (nota firmada, mensaje, acta) **[EXTENSION]**: hoy cualquier archivo PDF/imagen | Founder + abogado/a | Archivo obligatorio para aceptar |
