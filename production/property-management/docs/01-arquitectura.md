# MERIDIANO CAPITAL | PROPERTY MANAGEMENT — Arquitectura (Fase 1)

Estado: **v0.1 — núcleo funcional** (Fases 1, 2, 3 parcial, 4 parcial). Decisión de registro: `D-096`.

## 1. Punto de partida (análisis del repo existente)

El repo ya tenía software funcional (`production/app/`: sitio + calculadora de
rentabilidad en Python stdlib, `dev_engine/`), pero **ningún sistema de
administración de propiedades**: no había modelo de sociedades, unidades,
contratos, cobranzas ni base de datos relacional. Se construyó como aplicación
nueva en `production/property-management/`, sin tocar el código existente.

Por qué no se extendió el backend Python stdlib: el requerimiento exige base
relacional con transacciones, migraciones, autenticación, permisos por rol con
aislamiento por sociedad e interfaz empresarial. Hacerlo en stdlib implicaría
reinventar ORM, sesiones y UI. Se adoptó el stack sugerido (§19), que cubre
todo eso con herramientas maduras.

## 2. Stack

| Capa | Elección | Motivo |
|---|---|---|
| App web | Next.js 15 (App Router) + React 19 + TypeScript estricto | Server Components + Server Actions: la lógica de permisos corre siempre en servidor; un solo despliegue |
| Base de datos | PostgreSQL 16 | Transacciones, `NUMERIC` exacto, bloqueos de fila (`FOR UPDATE`), advisory locks |
| ORM / migraciones | Prisma 6 | Esquema declarativo versionado (`prisma/migrations/`) |
| Dinero | `Decimal(18,2)` en base + `decimal.js` en dominio | **Nunca `float`** para importes |
| Excel | `exceljs` | Lee todas las hojas, fórmulas y su resultado cacheado, celdas combinadas |
| Auth | bcrypt (costo 12) + cookie JWT HS256 httpOnly (`jose`) | Roles se releen de la base en cada request |
| Validación | `zod` en el borde de cada servicio | |
| Estilos | Tailwind 4 con tokens del sistema cromático oficial | `knowledge-base/brand/05-sistema-cromatico.md` |
| Tests | Vitest (unitarios + integración contra Postgres real) | |

## 3. Capas del código

```
src/
  domain/      Reglas de negocio PURAS (sin base de datos): dinero, períodos,
               contratos, impuestos, obligaciones, pagos, expensas, ocupación,
               remodelaciones, indicadores. 100% testeables.
  import/      Importador de Excel: libro → análisis → mapeo → validación.
               Sin base de datos (se puede correr en seco por CLI).
  server/      Acceso a datos y procesos transaccionales:
    db.ts        Prisma + errores de negocio
    authz.ts     Roles, matriz de permisos, alcance por sociedad, filtroSociedad()
    audit.ts     Registro de auditoría dentro de la MISMA transacción
    auth.ts      Credenciales y sesión
    storage.ts   Almacenamiento privado de documentos (fuera de /public y de git)
    services/    nucleo, contratos, finanzas, importacion, consultas
  app/         Interfaz (Next.js). Solo llama a services/.
prisma/        schema.prisma, migraciones, seed de configuración
scripts/       CLI: crear usuario, analizar Excel en seco, cargar sociedad
tests/         unit/ (dominio + importador) e integration/ (flujo completo en Postgres)
```

Regla de dependencias: `app → server/services → domain|import`. El dominio no
conoce Prisma ni Next.js; los servicios no conocen la UI.

## 4. Modelo de datos (resumen)

```
Sociedad ─┬─ CuentaBancaria
          ├─ Propiedad ─┬─ Titularidad (n sociedades × %)
          │             └─ Unidad
          ├─ Contrato ──┬─ ContratoUnidad (n unidades)
          │             ├─ ContratoParte (Persona: INQUILINO/GARANTE/CODEUDOR)
          │             └─ CondicionContrato (historial de importes, nunca se edita)
          ├─ Obligacion ── AplicacionPago ── Pago
          ├─ Factura ── FacturaItem ── Obligacion        (+ Timbrado, NC/ND)
          ├─ Egreso (OPEX/CAPEX)
          └─ ImportBatch ── ImportRow, Documento (archivo original + SHA-256)
Propiedad ── GastoEdificio, LiquidacionExpensas(+Item), OrdenTrabajo, ProyectoRemodelacion(+PartidaRemodelacion)
ReglaFiscal (versionada) · ConfiguracionAlerta · Usuario · AsignacionRol · AuditLog
```

Puntos de diseño clave:

- **Persona única** para inquilinos y garantes (un inquilino puede tener contratos en varias sociedades); `documentoNormalizado` único evita duplicados.
- **Ocupación derivada**, no cargada: de contratos vigentes + entrega/devolución real (`domain/ocupacion.ts`). La unidad solo guarda su estado operativo manual (mantenimiento, remodelación, fuera de servicio, reservada).
- **Importe del contrato = historial** (`CondicionContrato`): adendas/reajustes agregan filas; nada se sobrescribe.
- **Estado "vencida" derivado**: una obligación PENDIENTE/PARCIAL con vencimiento pasado; no se persiste para que nunca quede desactualizado.
- **Saldo a favor derivado**: importe del pago − Σ aplicaciones vigentes.
- **Trazabilidad del dato**: `origenDato` (MANUAL / IMPORTADO / GENERADO / SEED_PRUEBA) + `estadoDato` (PENDIENTE_REVISION / VALIDADO) + `importBatchId`.
- **Eliminación lógica** (`deletedAt`) en entidades principales.

## 5. Seguridad y aislamiento por sociedad

- Roles (§18): SUPERADMIN, ADMIN_GENERAL, ADMIN_SOCIEDAD, RESPONSABLE_PROPIEDAD, COBRANZAS, FACTURACION, MANTENIMIENTO, PROPIETARIO_CONSULTA, AUDITOR. Matriz en `src/server/authz.ts`.
- Solo SUPERADMIN, ADMIN_GENERAL y AUDITOR pueden ser globales; el resto se asigna siempre a una sociedad (opcionalmente a una propiedad).
- **Toda** consulta de negocio pasa por `filtroSociedad(sesion)` y toda escritura por `exigir(sesion, permiso, sociedadId)`. Cubierto por tests de integración ("un usuario de la sociedad B no ve ni opera datos de A", incluida búsqueda, estado de cuenta y panel).
- Pendiente para producción (PD-10): **Row Level Security de PostgreSQL** como segunda barrera debajo de la capa de servicios.
- Auditoría en la misma transacción que la operación: cambio de alquiler, cambio de estado de contrato, registro/reversión de pagos, cuentas bancarias, generación/anulación de obligaciones, importaciones.
- Sin logs de queries (pueden contener PII). Contraseñas con bcrypt; archivos en `STORAGE_DIR` privado con permisos 0600.

## 6. Concurrencia e integridad

- Generación mensual: `claveIdempotencia` única + `createMany(skipDuplicates)` → dos ejecuciones (aun simultáneas) no duplican.
- Cobros: `SELECT … FOR UPDATE` de las obligaciones antes de imputar.
- Contratos: `pg_advisory_xact_lock` por unidad antes de verificar superposición.
- Pagos: `claveDuplicado` única (cuenta + comprobante normalizado + moneda + importe); la reversión la libera para registrar la versión corregida.
- Importación: confirmación dentro de una transacción; re-chequeo de estado adentro (doble clic); clave por archivo+hoja+fila para que reimportar no duplique pagos.

## 7. Fechas y monedas

- Fechas de negocio como `DATE` puro; "hoy" se calcula en `America/Asuncion`.
- PYG redondea a entero, USD a 2 decimales (HALF_UP). Nunca se suman ni convierten monedas automáticamente: el panel filtra por moneda.

## 8. Integraciones futuras (preparadas, no simuladas)

- **SIFEN**: `Timbrado.electronico`, `Factura.cdc`, estados PENDIENTE → EMITIDA → VALIDADA → ANULADA, `Factura.esPrueba = true` por defecto. No se emite nada real sin credenciales y homologación (PD-05).
- **Extractos bancarios**: `Pago.fechaAcreditacion` + `conciliado`; la conciliación manual existe (`conciliarPago`), la importación de extractos es la siguiente iteración.
- **Real Estate Intelligence OS**: `Unidad.alquilerReferenciaFuente` exige fuente (p. ej. AMC SK-14) para que un alquiler de mercado entre en indicadores.
