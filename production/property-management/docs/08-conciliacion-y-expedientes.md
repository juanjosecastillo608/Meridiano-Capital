# Conciliación de planillas y expediente por inquilino (Canarias Inversiones S.A.)

Fecha: 2026-11-12. Decisión de registro: **D-100**. Sin datos personales: nombres, RUC y teléfonos de inquilinos viven solo en la base y en los archivos originales (`data/imports/`, fuera de git).

## Definiciones del founder (2026-11-12) y cómo quedaron implementadas

| Definición | Implementación |
|---|---|
| El alquiler es con **IVA incluido** | `ReglaFiscal` v2 `IVA_ALQUILER_RESIDENCIAL` (5 %) e `IVA_ALQUILER_COMERCIAL` (10 %) con `ivaIncluido = true`. Las obligaciones importadas se desglosaron (neto + IVA) **sin cambiar el total ni el saldo** (`recalcularIvaPendiente`). Ej.: 630.000 = 600.000 + 30.000. |
| **Expensas exentas** de IVA (validado por la contadora) | `IVA_EXPENSAS` v2: tasa 0, `VALIDADA_CONTADOR`. |
| El canon de las unidades ocupadas es el de la planilla: se **comienza con el mismo canon** | El último "Monto Alquiler Actual" de cada ocupante actual quedó **validado** con esta definición como respaldo (16 departamentos). La comparación contra las planillas usa el importe con IVA incluido. |
| La columna **RUC** es el dato de factura; **CI = RUC sin guion ni dígito verificador** | Campo `Persona.ruc`; CI derivada; DV verificado con módulo 11 (DNIT). RUC sin DV en la planilla → la CI se deriva, el RUC queda incompleto y se alerta (no se inventa el DV). Un RUC ya asignado a otra persona con otro nombre **no se fusiona**: se alerta. |
| Expensas: **FRM Gs 180.000/mes**, **Montevideo Gs 70.000/mes** | `Propiedad.expensaMensualUnidad` + fuente. Interpretado como importe **por unidad y por mes** **[EXTENSION — confirmar, PD-25]**. Se contrasta con lo que cobra cada planilla. |
| **NIS ANDE propio** por departamento; la energía la paga cada inquilino (no incluida en el alquiler) | `Unidad.nisAnde`; contratos actuales con `responsabilidadServicios = INQUILINO`; cláusula de energía en la plantilla. **NIS compartido → alerta** permanente ("comparten el gasto de energía eléctrica"). |

## Importación de la planilla de Montevideo

Archivo recibido el 2026-11-12: hoja resumen + 7 hojas mensuales (marzo–septiembre 2026) + relevamiento de pérdidas de agua ("Hoja1") + "Local Plan de Alquileres". Mejoras al importador que surgieron de su formato real:

- Códigos de unidad normalizados (" PB B  Dpto" → "PB B") e iguales en todas las hojas.
- **Hoja de referencia** (sin período): aporta "Fecha Vencimiento Contrato" y "Contrato Vigente" como antecedente del contrato anterior; **no genera cobros** ni participa en los controles de pagos (antes marcaba como duplicados los pagos reales de marzo).
- Fin de tabla con filas "Ingresos Total" / "Saldo deudor" (antes leía el bloque de egresos como unidades).
- Columna **"Pago Agua"** → obligación de **servicio** (agua). Agua negativa (calculada como pago − alquiler con pagos parciales) no se toma como cargo; se alerta.
- Frases de estado en la columna inquilino ("Está desocupado en reparación", "Habitación sin baño") = unidad sin inquilino.
- Texto en columnas de importes ("No pagan") = advertencia, no error.
- RUC reunido de todas las hojas de cada inquilino (solo aparece en agosto/septiembre).
- **Ocupante actual = el del último período**; los anteriores quedan como contratos **FINALIZADO** con su deuda y pagos.
- La hoja "Local Plan de Alquileres" (bonificaciones y fechas de pago programadas del local) no tiene unidad: no se importa; se lista para revisión manual.

## Resultado de la conciliación (datos reales)

| | FRM | Montevideo |
|---|---|---|
| Departamentos del inventario declarado | 13 | 10 |
| Ocupados (último período) | 7 | 9 |
| Vacantes | 6 | 1 (GAR A, en reparación desde junio) |
| Local comercial | vacante (coincide) | **en juicio de desalojo con ocupante** — el anexo lo declara vacante (alerta) |
| Fuera del inventario | áticos 15 y 16 | "12" (habitación sin baño) |
| Ocupantes anteriores (históricos) | 0 | 4 contratos |
| Canon validado / listos para borrador | 7 / 7 | 9 / 9 |
| Listos para contrato real | 0 | 0 |

### Alertas a resolver

| Tema | Detalle |
|---|---|
| NIS compartido | FRM 2-3, 6-7, 13-14 comparten NIS: comparten hoy el gasto de energía. |
| Expensas FRM | Definida 180.000; la planilla cobra 120.000 (unidad 5) y 80.000 (8, 9, 11). |
| Expensas Montevideo | Definida 70.000; la planilla dice "No pagan" expensas y cobra **agua** por separado (35.000/70.000), mientras la hoja resumen dice "agua incluida en el valor del alquiler". ¿Las expensas de 70.000 son ese cargo? (PD-26) |
| RUC Montevideo | Varios RUC sin dígito verificador; dos unidades (1 A y PB C) con el mismo RUC y distinto nombre. |
| FRM sin RUC | La planilla de FRM no tiene columna RUC: falta para los 7 inquilinos. |
| Local Montevideo | Juicio de desalojo y negociación de un nuevo contrato (julio: "Gs 1.500.000 por mes"); plan de alquileres con bonificación del 25–30 %. Fuera del alcance residencial. |

### Qué falta para los contratos reales (todos los ocupados)

Fecha de inicio (individual), depósito verificado, cuenta bancaria activa de la sociedad, día de vencimiento mensual, domicilio de cada inquilino, poder del representante, domicilio fiscal de la sociedad, dirección de cada edificio y revisión jurídica de la plantilla. RUC: 7 en FRM y los incompletos/en conflicto de Montevideo. Responsable de expensas en Montevideo.

## Herramientas

- `/expedientes`: conciliación por edificio (situación, inquilino actual, canon con IVA incluido, OK / falta / alertas, listo para borrador / contrato real) y lista de faltantes agregada; exportación Excel (`/api/exportar/expedientes`).
- `/expedientes/[unidad]`: checklist por grupo (situación, identificación, condiciones económicas, servicios, contrato nuevo) y formulario para completar RUC (la CI se deriva), domicilio, email y teléfono, con fuente y auditoría.
- `scripts/aplicar-definiciones-2026-11-12.ts`: aplica estas definiciones a los datos (idempotente).
