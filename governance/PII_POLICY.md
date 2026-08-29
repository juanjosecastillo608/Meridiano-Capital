# Política de PII — Meridiano Capital

Formalizada el 2026-08-29 a raíz de la limpieza histórica de PII del caso
`UON-001` (dos personas físicas afectadas — ver `D-093` en
`governance/decisions/DECISION_REGISTER.md` para el registro completo del
hallazgo y la remediación). Este documento es la referencia permanente de
cómo tratar datos personales en este repo de acá en adelante.

## Clasificación por capa

### `contracts/`

**Puede** contener PII real, estrictamente la necesaria para trazabilidad
legal y debida diligencia de una operación concreta:

- Nombre completo de las partes.
- Rol (comprador, vendedor, apoderado, representante).
- CI/documento de identidad.
- Hechos jurídicos vinculados (poder, escritura, fecha, escribanía).

**No permitido** como contenido derivado — es decir, en cualquier documento
de análisis/registro operativo que no sea la fuente legal original en sí
(ver más abajo):

- Domicilio personal.
- Email personal.
- Teléfono personal.
- RUC personal.
- Cualquier otro dato de contacto personal.

### Fuente legal original (boletos, escrituras, contratos transcriptos)

La transcripción literal de un documento legal que contiene PII completa de
las partes:

- **No se versiona en git.**
- Puede conservarse localmente o en almacenamiento cifrado autorizado —
  fuera del repositorio.
- Los documentos derivados (`facts/FACT_REGISTER.md`, `evidence/`,
  `UON-001_DISCOVERY_REPORT.md` o su equivalente en cada caso) citan esa
  fuente por ID de evidencia (`E1`, `E2`, ...) y por el nombre del archivo
  fuente, sin necesidad de que el archivo mismo esté versionado.

### `knowledge-base/`

**Regla absoluta: `knowledge-base/` no contiene PII real de clientes.**

Nunca copiar nombres reales, teléfonos, emails, domicilios, CI u otros
identificadores personales de clientes a esta capa — sin excepción, sin
importar cuán conveniente parezca en el momento. Cuando haga falta vincular
información de un cliente/operación real, usar una referencia cruzada al
caso y al `FACT` correspondiente:

```
ver contracts/cases/<CASE-ID>/facts/FACT_REGISTER.md, FACT-0NN
```

## Alias — convención estándar

Para documentos operativos secundarios (registros de acciones, compromisos,
issues, documentos de arquitectura) donde la identidad real no aporta valor
adicional al que ya da la referencia al `FACT` correspondiente, usar alias
consistentes en vez de repetir el nombre real:

| Alias | Uso |
|---|---|
| `COMPRADOR-A` / `COMPRADORA-A` | Parte compradora de un caso, sin distinguir cuál si hay varias |
| `VENDEDOR-A` | Parte vendedora |
| `APODERADO-VENDEDOR-A` / `APODERADO-COMPRADOR-A` | Representante/apoderado firmante en nombre de una parte |

Si un caso tiene más de una persona en el mismo rol, sufijar `-B`, `-C`, etc.
El alias siempre debe ir acompañado de la referencia al `FACT` real
(`COMPRADORA-A, ver FACT-010`) para no perder trazabilidad.

## Regla de mínimo privilegio

La información personal solo debe existir donde sea necesaria para cumplir
una función documental concreta. Antes de escribir un dato personal en
cualquier archivo, preguntar: *¿este documento necesita el dato real, o le
alcanza con una referencia al lugar donde el dato real ya vive?* Si alcanza
con la referencia, usar la referencia.

## Antes de commitear un caso nuevo o material nuevo de un caso existente

Correr el barrido de PII descripto en `CLAUDE.md` (sección de protocolo de
trabajo) — nunca depender de una sola expresión regular, y diferenciar
explícitamente PII real de referencias legítimas no personales (nombres de
calles, de empresas, de proyectos) antes de decidir qué hacer con cada
coincidencia.

**Limitación conocida de un barrido basado solo en texto (agregada tras
`D-095`)**: un `grep` sobre archivos de texto/markdown NO detecta (a) PDF
escaneados sin capa de texto extraíble (`pdftotext` da ~0 caracteres) — estos
requieren inspección visual u OCR antes de dar por limpio un documento
binario; (b) el mismo archivo con PII duplicado bajo un nombre de archivo
distinto en otra carpeta — esto se detecta por **hash de blob** (`git ls-tree`),
nunca solo por nombre. Un barrido de PII "completo" debe cubrir ambos casos,
no solo grep de texto.

## Historial de aplicación

- **2026-08-29 (`D-093`)**: primera aplicación — caso `UON-001`, 2 personas
  físicas (Boyajian, Sakumoto), 8 archivos con PII redundante anonimizados, 2
  archivos (boletos, transcripción de texto) eliminados del historial
  completo mediante `git-filter-repo`, 3 archivos de trazabilidad legal
  (`FACT_REGISTER.md`, `CASE_FACTS.md`, `UON-001_DISCOVERY_REPORT.md`)
  conservados intactos por ser la fuente de
  verdad de hechos del caso.
- **2026-08-29 (`D-095`)**: segunda aplicación, mismo caso — un barrido
  binario (no solo de texto) encontró un **tercer afectado** (Ariel Luis
  Debenedetti, `FACT-013B`) en un PDF escaneado, y confirmó que los PDF/DOCX
  **originales** del boleto (con la misma PII que `D-093` creía haber
  purgado) seguían publicados sin tocar, incluyendo 2 copias duplicadas bajo
  nombres de archivo distintos. 8 rutas (6 blobs únicos) eliminadas del
  historial completo. Ver `DECISION_REGISTER.md` para el detalle completo.
