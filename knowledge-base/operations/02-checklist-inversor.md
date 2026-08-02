Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-investor-journey/assets/checklist-inversor.md
Dominio: OPERATIONS

# Checklist de Inversor — plantilla operativa

Esta es la herramienta de seguimiento que se personaliza por inversor para saber en qué etapa del journey está y qué falta. Es una **plantilla** (asset de la skill original `meridiano-investor-journey`), no un registro completado — se instancia con el nombre del inversor y se van marcando las casillas a medida que avanza. Cubre las seis etapas del journey descritas en `knowledge-base/business/04-etapas-del-inversor.md` más el acompañamiento continuo posterior a la compra.

## Estructura exacta de la plantilla (preservada de la fuente)

```
# Checklist de Inversor — [NOMBRE]

**Cómo empieza:** ☐ S.A. sin cédula (empieza ya, Meridiano rep. legal/síndico)   ☐ Con cédula propia
**Ruta de cédula (si aplica):** ☐ Estándar (< USD 200k)   ☐ Investor Pass (≥ USD 200k)   ☐ Sin cédula por ahora
**Origen:** ☐ Argentina  ☐ Brasil  ☐ Europa  ☐ Otro: ______
**Fecha de inicio:** ______
```

### Etapa 0 — Pre-inversión
- ☐ Perfil y objetivos definidos
- ☐ Capital y monto de inversión definido
- ☐ Ruta migratoria elegida
- ☐ Rentabilidad y opciones de cartera presentadas

### Etapa 1 — Residencia y Cédula
Documentos apostillados:
- ☐ Pasaporte vigente
- ☐ Certificado de nacimiento
- ☐ Antecedentes penales (origen + residencias últimos 3 años)
- ☐ Certificado matrimonio/divorcio (si aplica)

Trámite:
- ☐ *(Estándar)* Residencia temporal iniciada → cédula biométrica
- ☐ *(Investor Pass)* Desembolso ≥30% · CIE del SUACE · resolución Migraciones
- ☐ Cédula obtenida
- ☐ Presencia física realizada

### Etapa 2 — Cuentas bancarias
- ☐ Origen de fondos documentado
- ☐ Cuestionario bancario preparado
- ☐ Cuenta persona física abierta
- ☐ Cuenta persona jurídica abierta (si S.A.)

### Etapa 3 — Sociedad Anónima (si aplica)
- ☐ Decisión de constituir S.A.
- ☐ Escribano / abogado asignado
- ☐ S.A. constituida e inscripta

### Etapa 4 — Estructura fiscal
- ☐ Contadora asignada
- ☐ Alta e inscripción fiscal
- ☐ Planificación fiscal internacional (CRS/FATCA) revisada

### Etapa 5 — Inversión y administración
- ☐ Unidad(es) evaluada(s) con rentabilidad
- ☐ Compra cerrada
- ☐ Contrato de administración firmado
- ☐ Inquilino / plan de venta definido

### Acompañamiento
- ☐ Liquidaciones activas
- ☐ Próxima oportunidad de cartera identificada
- ☐ Referidos solicitados

## Cómo se usa (según el SKILL.md que gobierna esta plantilla)

- Se usa como plantilla para **generar el checklist personalizado** de un inversor concreto, marcando su ruta (S.A. sin cédula vs. con cédula propia; Estándar vs. Investor Pass) y el estado real de cada etapa.
- También sirve para responder "¿en qué etapa estoy?": ubicar al inversor en las seis etapas y decir el siguiente paso concreto.
- Etapa 1 en esta plantilla se llama "Residencia y Cédula" — corresponde a la "Etapa 1 — Estructura de entrada" del journey de negocio; el nombre difiere levemente entre los dos documentos fuente (`checklist-inversor.md` vs. `SKILL.md`/`etapas-detalle.md`), preservado tal cual sin armonizar.

## Gaps operativos de la plantilla

> UNRESOLVED: la plantilla no indica quién es responsable de mantener el checklist actualizado por inversor (¿Juan José, un asistente, el propio inversor?), ni en qué sistema vive una vez instanciado (documento por inversor, CRM, planilla compartida). El `SKILL.md` fuente dice usarlo "como plantilla" pero no define el flujo de archivo/actualización.
> UNRESOLVED: no hay campo en la plantilla para registrar fechas de cada hito (solo existe "Fecha de inicio" al comienzo). No se puede saber, mirando un checklist marcado, cuánto tiempo tomó cada etapa para ese inversor — dato que además falta a nivel general en `etapas-detalle.md` (campos `[COMPLETAR]` de duración por etapa).
> UNRESOLVED: la casilla "Cuenta persona jurídica abierta (si S.A.)" en la Etapa 2 depende de una decisión que formalmente se toma recién en la Etapa 3 ("Decisión de constituir S.A."). La plantilla no aclara el orden real cuando el inversor ya sabe que va a constituir S.A. antes de llegar al banco (caso más común, según `03-tarifario.md`, donde el Paquete Completo incluye "apertura de cuenta" como parte del mismo paquete que la S.A.). No está resuelto si en la práctica la cuenta jurídica se abre antes, durante o después de la inscripción societaria.
> UNRESOLVED: la sección "Acompañamiento" no tiene una condición de salida ni una cadencia definida (¿cada cuánto se revisan liquidaciones, se identifica "próxima oportunidad", se piden referidos?). Queda como lista de ítems recurrentes sin protocolo de frecuencia.
