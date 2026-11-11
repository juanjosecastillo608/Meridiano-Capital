# Informe de carga — Fase 3 (Canarias Inversiones S.A.)

Fecha: 2026-11-11. **Este informe no contiene datos personales**: los nombres,
teléfonos y emails de inquilinos y del representante del propietario solo
existen en el archivo original (fuera de git, `data/imports/`) y en la base de
datos. El informe completo fila por fila se ve en la interfaz
(`/importaciones/<id>`) o en `data/imports/informes/` (ignorado por git).

## Archivos recibidos

| Archivo | Contenido | Uso |
|---|---|---|
| Cédula Tributaria RUC (PDF) | Razón social oficial "CANARIAS INVERSIONES SOCIEDAD ANÓNIMA" y RUC | Sociedad creada con RUC → `estadoDato = VALIDADO` |
| Planilla de cobro de alquileres — Edificio FRM (xlsx, 12 hojas) | 3 hojas mensuales (jun/jul/ago 2026) + 8 hojas de presupuesto de reparaciones por unidad + "Hoja1" | Importación analizada y validada; **pendiente de confirmación** |
| Cotización reforma completa — primera etapa (xlsx) | Materiales y mano de obra con precio bajo/objetivo/alto **estimados**, escenarios y criterios de pago | Insumo del módulo de remodelaciones (siguiente fase) |
| Checklist de proveedor — Edificio Fulgencio R. Moreno (xlsx) | Alcance de obra por unidad (4, 10, 13-14 unificada, 6, 12, terraza, local, fachada) | Insumo del módulo de remodelaciones |
| Matrícula de comerciante WICA S.A. (PDF) | Otra sociedad | No cargada (PD-03) |

## Resultado del análisis de la planilla FRM

- 3 hojas procesadas (períodos 2026-06, 2026-07, 2026-08, detectados por la fecha en la celda O7); 9 hojas omitidas (presupuestos por unidad sin formato tabular y "Hoja1" sin datos económicos).
- 16 unidades (salón comercial, deptos 2 a 14, 2 áticos), 7 inquilinos, 48 filas.
- Pagos detectados: jun G. 8.900.000 · jul G. 7.220.000 · **ago G. 0** (ver duplicados).

### Inconsistencias reportadas (no corregidas)

| Código | Detalle |
|---|---|
| PAGO_DUPLICADO_PROBABLE (6) | La hoja de agosto repite los 6 pagos de julio con las mismas fechas e importes. No se registran dos veces; las obligaciones de agosto sí se importan y quedan pendientes. |
| PERIODO_INCONSISTENTE (2) | La hoja de agosto tiene encabezados "Pago Mes Julio" / "Pago Expensas Julio": hoja copiada sin actualizar. |
| FECHA_PAGO_FUERA_DE_PERIODO (1) | Unidad 5, hoja de agosto: fecha de pago de junio. |
| MARCA_OK_SIN_PAGO (2) | Una unidad (jul y ago): marca "OK" con pago 0. |
| ALQUILER_CAMBIA (2) | Salón: 2.500.000 (jun) → 2.800.000 (jul) → 2.500.000 (ago), sin adenda. |
| CANTIDAD_UNIDADES_NO_COINCIDE (3) | La planilla declara "13 departamentos más 1 salón" (14) y lista 16 filas. |
| MEDIDOR_COMPARTIDO (9) | Mismo NIS ANDE en unidades 2-3, 6-7 y 13-14. |
| FORMULAS_IVA_DISTINTAS (3) | La columna IVA mezcla `=E*0.05`, valores fijos y `=I*0.1` (unidad 16). |
| IVA_TRATAMIENTO_A_CONFIRMAR | IVA calculado al 5 % sobre el alquiler pero no sumado al monto facturado (PD-02). |
| INQUILINO_PARECE_DESCRIPCION (6) | "ATICO" en la columna de inquilino (unidades 15 y 16): se tratan como unidades sin inquilino. |
| ALQUILER_CERO (6) | Áticos con alquiler 0. |
| BLOQUE_NO_TABULAR | Debajo de la tabla: saldo deudor, deuda judicial, impuesto municipal, ESSAP, limpieza y mantenimiento (egresos) — se revisan a mano, no se importan automáticamente. |

### Ensayo de confirmación (en base de prueba, borrada después)

Para verificar el camino completo con los datos reales sin escribir en la base
de trabajo, se confirmó la importación en la base `*_test` y luego se vació:

| Resultado | Valor |
|---|---|
| Unidades creadas | 16 |
| Inquilinos creados (sin documento) | 7 |
| Contratos BORRADOR (sin fechas) | 7 |
| Obligaciones históricas (alquiler + expensas, 3 meses) | 42 |
| Pagos registrados (sin duplicados) | 13 |
| Saldo pendiente jun / jul / ago | G. 0 / G. 1.680.000 / G. 8.900.000 |

El saldo de julio (G. 1.680.000 = alquiler + expensas de la única unidad sin pago ese mes)
coincide con la celda "Saldo deudor Mes de Julio" que calcula la propia planilla.

## Cómo confirmar

1. Iniciar sesión → **Importar Excel** → abrir la importación pendiente.
2. Revisar mapeo e informe (detalle fila por fila).
3. En "4 · Confirmación": crear la propiedad nueva (código sugerido `FRM`,
   nombre "Edificio Fulgencio R. Moreno"), elegir la cuenta receptora si ya
   está registrada en la sociedad, marcar "Revisé el informe y confirmo".
4. Después: completar contratos originales (PD-06), documentos de inquilinos
   (PD-08) y decidir PD-02 con el/la contador/a.
