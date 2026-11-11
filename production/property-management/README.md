# MERIDIANO CAPITAL | PROPERTY MANAGEMENT

Sistema web de administración inmobiliaria multi-sociedad: sociedades →
propiedades → unidades → contratos → inquilinos → obligaciones, facturación y
cobranzas, con importador de Excel, auditoría y aislamiento por sociedad.

Decisión de registro: `governance/decisions/DECISION_REGISTER.md` → **D-096**.

| Documento | Contenido |
|---|---|
| `docs/01-arquitectura.md` | Stack, capas, modelo de datos, seguridad, concurrencia |
| `docs/02-reglas-de-negocio.md` | Reglas implementadas (RN-*) con su código y su test |
| `docs/03-decisiones-pendientes.md` | Decisiones abiertas (PD-*) y comportamiento conservador mientras tanto |
| `docs/04-informe-carga-fase3.md` | Carga de Canarias Inversiones S.A. (sin datos personales) |
| `docs/05-anexo-canarias.md` | Anexo de implementación: estado de la primera entrega, reglas RN-ANX-*, archivos faltantes |

## Requisitos

Node.js 22, PostgreSQL 16.

## Puesta en marcha (desarrollo)

```bash
cd production/property-management
npm install
cp .env.example .env   # completar DATABASE_URL, SESSION_SECRET (openssl rand -base64 48), STORAGE_DIR
```

```bash
npx prisma migrate deploy
```

```bash
npm run db:seed        # reglas fiscales versionadas + alertas 90/60/30 (no crea datos de negocio)
```

```bash
NUEVA_PASSWORD='una-contraseña-larga' npm run user:create -- admin@dominio "Nombre" SUPERADMIN
```

```bash
npm run dev            # http://localhost:3100
```

## Carga de una sociedad y sus planillas (CLI)

Los archivos reales van en `data/imports/` (ignorado por git: contienen datos
personales). El script usa los mismos servicios que la interfaz y **no
confirma** salvo que se pida explícitamente:

```bash
npx tsx scripts/cargar-sociedad.ts --razon "RAZÓN SOCIAL S.A." --ruc 12345678-9 --moneda PYG --iva-control 5 --archivo data/imports/originales/planilla.xlsx
```

Carga del anexo de Canarias Inversiones S.A. (chequea los 11 archivos esperados, idempotente):

```bash
npx tsx scripts/cargar-anexo-canarias.ts --dir data/imports/originales --confirmar-frm
```

Análisis en seco, sin base de datos:

```bash
npx tsx scripts/import-analyze.ts data/imports/originales/planilla.xlsx --moneda PYG --iva-control 5
```

## Pruebas

Usan una base separada cuyo nombre debe terminar en `_test`
(`DATABASE_URL_TEST`, por defecto `meridiano_pm_test`); el helper se niega a
limpiar cualquier otra.

```bash
npm test               # unitarias (dominio + importador) + integración (Postgres)
```

```bash
npm run typecheck
```

Estado al 2026-11-11 (anexo D-097): **63 tests en verde**, `tsc` sin errores, `next build` OK.

## Plan por fases (§21)

| Fase | Estado |
|---|---|
| 1 · Análisis y arquitectura | ✅ `docs/01..03` |
| 2 · Núcleo inmobiliario (sociedades, propiedades, unidades, personas, contratos) | ✅ servicios + UI + tests |
| 3 · Importación Excel + carga Canarias | ✅ importador; ✅ FRM cargado (anexo D-097); ⏳ planilla de MONTEVIDEO no recibida (PD-01) |
| 4 · Gestión financiera (obligaciones, cobranzas, parciales, saldos, conciliación manual) | ✅ núcleo; ⏳ liquidación de expensas en UI, importación de extractos bancarios |
| 5 · Facturación | 🟡 modelo (timbrado, factura, NC/ND, estados, `esPrueba`) y motor de IVA versionado; ⏳ UI de emisión, SIFEN (PD-05) |
| 6 · Mantenimiento y remodelaciones | ✅ remodelaciones por etapas (estimado → cotización → aprobado → orden → gasto → comprobante → costo final), importadores de checklist y presupuesto; ⏳ órdenes de mantenimiento correctivo fuera de proyectos |
| 7 · Dashboards e informes | 🟡 panel con indicadores (fórmula + origen), estado de cuenta Excel por unidad/inquilino; ⏳ PDF, reporte mensual a propietarios |
| 8 · Pruebas y producción | ⏳ hosting, backups, RLS, almacenamiento cifrado (PD-10) |

## Criterios de aceptación (§22)

| # | Criterio | Cómo se demuestra |
|---|---|---|
| 1-2 | Crear Canarias Inversiones S.A. y sus edificios | Sociedad creada (RUC verificado) · edificio FRM se crea al confirmar la importación · el segundo edificio espera su planilla |
| 3-4 | Importar Excel, reconocer unidades e inquilinos | `scripts/cargar-sociedad.ts` sobre la planilla real: 16 unidades, 7 inquilinos |
| 5 | Contratos y vencimientos | `crearContrato`, alertas configurables; test "superposición" |
| 6 | Obligaciones mensuales sin duplicados | test "se ejecuta dos veces" |
| 7-9 | Pagos completos y parciales, saldos exactos, alquiler vs expensas | test con el ejemplo §10 (G. 2.000.000 → deuda G. 1.500.000) |
| 10 | Estado de facturación | columna "Facturación" del estado de cuenta (SIN_FACTURAR / EMITIDA / …) |
| 11 | Impuestos con reglas validadas | motor versionado; reglas no validadas no calculan |
| 12 | Gastos y presupuestos de remodelación | modelo + dominio; UI en Fase 6 |
| 13 | Estado de cuenta por unidad | `/unidades/[id]` + exportación Excel |
| 14 | Resultados por edificio y sociedad | panel con filtros; `resultadoPorPropiedad` |
| 15 | Historial y auditoría | `AuditLog` transaccional; `/auditoria` |
| 16 | Aislamiento entre sociedades | tests de integración "aislamiento por sociedad" |

## Operación (pendiente para producción — PD-10)

- Backups: `pg_dump` diario cifrado + retención y **prueba de restauración**; `STORAGE_DIR` incluido.
- Producción con `NODE_ENV=production` (cookie `secure`), HTTPS obligatorio, `SESSION_SECRET` en gestor de secretos.
- Nunca usar los datos de `tests/fixtures/` como datos productivos: son ficticios.
