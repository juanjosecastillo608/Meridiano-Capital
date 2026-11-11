# Anexo de implementación — Canarias Inversiones S.A. (estado de la primera entrega)

Fecha: 2026-11-11. Decisión de registro: **D-097**. Sin datos personales: los
nombres de inquilinos y representantes solo viven en la base de datos y en los
archivos originales (`data/imports/`, fuera de git).

## Contexto confirmado por el founder

| Dato | Valor |
|---|---|
| Sociedad | CANARIAS INVERSIONES SOCIEDAD ANÓNIMA — RUC 80167528-6 (verificado contra la Cédula Tributaria) |
| Edificio `FRM` | Fulgencio R. Moreno — inventario declarado 13 deptos + 1 local comercial (PB, vacante) |
| Edificio `MONTEVIDEO` | Montevideo — inventario declarado 10 deptos + 1 local comercial (PB, vacante) |
| Uso | Alquileres residenciales mensuales sin muebles, centro de Asunción |

## Archivos del anexo (comprobados en el entorno)

| # | Archivo | Estado | Uso |
|---|---|---|---|
| 1 | Planilla Cobro Alquileres Edificio Montevideo.xlsx | ❌ **falta** | Unidades e inquilinos de Montevideo |
| 2 | Planilla Cobro Alquileres Edificio FRM.xlsx | ✅ | Importada (14 unidades, 7 inquilinos, jun–ago 2026) + listados de trabajos por depto |
| 3 | RUC Canarias Inversiones SA.pdf | ✅ | Expediente (tipo RUC) |
| 4 | Poder Canarias Inversiones SA.pdf | ❌ **falta** | Expediente (PODER, sensible) + representantes con vigencia |
| 5 | Planos Montevideo.pdf | ❌ **falta** | Expediente MONTEVIDEO (PLANO) |
| 6 | Mapa Ubicacion Propiedad Montevideo.jpg | ❌ **falta** | Expediente MONTEVIDEO (MAPA_UBICACION) |
| 7 | Plano 1 Edificio FRM.jpeg | ❌ **falta** | Expediente FRM (PLANO) |
| 8 | Plano 2 Edificio FRM.jpeg | ❌ **falta** | Expediente FRM (PLANO) |
| 9 | Resolucion de Aprobacion Plano Edificio FRM.jpeg | ❌ **falta** | Expediente FRM (RESOLUCION_MUNICIPAL) |
| 10 | Checklist_Proveedor_Edificio_Fulgencio_R_Moreno.xlsx | ✅ | Alcance del proyecto FRM-REM-2026-01 |
| 11 | Primera Etapa cotizacion_reforma_completa.xlsx | ✅ | Presupuesto estimado + cotización del proveedor de FRM-REM-2026-01 |

`scripts/cargar-anexo-canarias.ts` imprime este mismo chequeo y carga lo que
exista. Al incorporar los archivos faltantes se vuelve a correr (es idempotente).

## Primera entrega funcional — estado por punto

| # | Requisito | Estado |
|---|---|---|
| 1 | Iniciar sesión como Meridiano Capital | ✅ SUPERADMIN global |
| 2 | Iniciar sesión como usuario de Canarias | ✅ rol PROPIETARIO_CONSULTA acotado a la sociedad |
| 3 | Ver ambos edificios | ✅ FRM y MONTEVIDEO |
| 4 | Inventario de 25 unidades | 🟡 **14 de 25**: FRM completo (13 + 1). Montevideo (10 + 1) declarado pero sin unidades: no se inventan identificadores sin su planilla |
| 5 | Locales comerciales vacantes | 🟡 Local de FRM declarado VACANTE (coincide con la planilla). El de Montevideo, al importar su planilla |
| 6 | Importar planillas históricas | ✅ FRM; ⏳ Montevideo |
| 7 | Inquilinos por unidad | ✅ (vínculo desde planilla, contrato BORRADOR — no definitivo) |
| 8 | Obligaciones y pagos respaldados | ✅ cada pago con nivel de respaldo: SIN_RESPALDO (planilla) / COMPROBANTE / CONCILIADO |
| 9 | Registrar cobros y pagos parciales | ✅ |
| 10 | Saldos por unidad y edificio | ✅ ficha del edificio + estado de cuenta por unidad |
| 11 | Documentos, planos y presupuestos | ✅ expediente con descarga protegida; planos pendientes de incorporar |
| 12 | Proyectos de remodelación | ✅ etapas separadas (ver abajo) |
| 13 | Alertas de faltantes e inconsistencias | ✅ `/alertas` |
| 14 | Aislamiento entre sociedades | ✅ servicios + páginas + descargas; probado por tests y por navegador |

## Reglas implementadas por el anexo

| ID | Regla |
|---|---|
| RN-ANX-01 | Unidad identificada por sociedad + edificio (código) + identificador de unidad (`@@unique([propiedadId, identificador])`). |
| RN-ANX-02 | Inventario declarado (con fuente) en el edificio; se concilia contra las unidades registradas y se alerta toda diferencia. |
| RN-ANX-03 | Unidades fuera del inventario declarado (p. ej. los 2 áticos de FRM) se excluyen explícitamente al confirmar; sus filas quedan OMITIDA con motivo. |
| RN-ANX-04 | "Fecha programada / vencimiento" es un campo distinto de "fecha de pago": solo fija el vencimiento, **nunca** crea un pago. |
| RN-ANX-05 | Bonificación = ajuste negativo de la obligación; el importe contractual no cambia. |
| RN-ANX-06 | Pago con nivel de respaldo: planilla ⇒ SIN_RESPALDO; con nº de comprobante ⇒ COMPROBANTE; conciliado con extracto ⇒ CONCILIADO. Se alerta el total sin respaldo. |
| RN-ANX-07 | Una lista de inquilinos no crea contratos definitivos: solo BORRADOR sin fechas, alertado hasta incorporar el contrato original. |
| RN-ANX-08 | Ocupación declarada (con fuente) se contrasta con la planilla y con los contratos; la contradicción se alerta, no se resuelve sola. |
| RN-ANX-09 | Expediente: poderes, actas y estatutos son sensibles por defecto; listado y descarga exigen VER_DOCUMENTOS_SENSIBLES; vencimientos documentales y de representación alertados a 60 días. |
| RN-ANX-10 | URL con id ajeno o inexistente ⇒ misma respuesta "Sin acceso" (404); los parámetros de sociedad en la URL solo se aceptan si están autorizados. |
| RN-ANX-11 | Remodelación: ESTIMADO ≠ COTIZACIÓN DE PROVEEDOR ≠ APROBADO ≠ ORDEN DE TRABAJO ≠ GASTO EJECUTADO ≠ PAGADO (comprobante) ≠ COSTO FINAL. Aprobar exige permiso APROBAR_PRESUPUESTO, motivo y partidas con precio y sin revisión técnica pendiente; órdenes y gastos solo sobre presupuesto aprobado; el costo final se fija al finalizar. |
| RN-ANX-12 | Sectores del checklist: números ⇒ unidades ("13-14" ⇒ unidades 13 y 14, anotado como unificadas); textos ⇒ sector común. "Local 1" **no** se vincula al "Salon" sin confirmación (vínculo manual disponible). |
| RN-ANX-13 | Precios "bajo/objetivo/alto" de un presupuesto = ESTIMADO calidad SUPUESTO; lectura "Baja" o "a confirmar" ⇒ REVISIÓN TÉCNICA REQUERIDA; la oferta del proveedor = COTIZACIÓN, DATO RECIBIDO. |

## Proyecto FRM-REM-2026-01 (cargado, nada aprobado)

| Etapa | Importe | Nota |
|---|---|---|
| Presupuesto estimado (objetivo) | G. 26.014.681 | 28 materiales + 12 trabajos de mano de obra; rango bajo–alto G. 18.907.150 – 36.090.500; 16 partidas para revisión técnica; sin contingencia |
| Cotización del proveedor | G. 16.550.000 | Oferta manuscrita. **No queda claro si es solo mano de obra o incluye materiales** |
| Presupuesto aprobado | — | Requiere aprobación explícita |
| Alcance | 284 ítems | Checklist (deptos 4, 6, 10, 12, 13-14; terraza, local 1, fachada) + listados por depto de la planilla FRM (sin importes) |

## Contradicciones detectadas con el anexo

1. **Áticos**: la planilla FRM lista 16 filas (salón + deptos 2–14 + 2 áticos); el inventario declarado es 13 + 1. Áticos excluidos.
2. **"Hoja1" de la planilla FRM**: 1 salón + 10 departamentos (PB A–C, 1 A–B, SS A–D, GAR A–B), exactamente el inventario declarado de Montevideo, con un relevamiento de pérdidas de agua. Muy probablemente es Montevideo — **pero allí el salón figura con un ocupante**, mientras el anexo dice que el local de Montevideo está vacante. No se importó.
3. **Locales**: el checklist de obra llama "Local 1 (PB)" al local; la planilla lo llama "Salon". Probablemente el mismo, sin vincular hasta confirmar.
4. Las inconsistencias de la planilla FRM ya reportadas (`04-informe-carga-fase3.md`): hoja de agosto copia de julio, alquiler del salón cambiante, medidores compartidos, fórmulas de IVA distintas.
