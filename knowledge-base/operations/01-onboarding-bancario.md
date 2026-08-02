Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-investor-journey/references/onboarding-bancario.md
Dominio: OPERATIONS

# Onboarding bancario — cuestionario y preparación

El banco es donde más inversores se traban, porque la cédula no garantiza la cuenta: el banco corre su propio compliance, independiente de Migraciones. Preparar estas respuestas **antes** de ir al banco es lo que hace fluida la apertura. Este proceso ejecuta la **Etapa 2** del journey del inversor (ver `00-overview.md` y `knowledge-base/business/04-etapas-del-inversor.md`).

## Cuestionario estándar del banco

Basado en el proceso real de presentación bancaria (casos usados como precedente: **Jumacabe S.A.** y **Quintero Inversiones S.A.**):

| Pregunta del banco | Qué preparar |
|---|---|
| Actividad principal | Descripción clara de la actividad del inversor / de la S.A. |
| Productos a importar (si aplica) | Detalle, si la actividad lo incluye |
| Finalidad de la cuenta | Para qué se usará (inversión inmobiliaria, operación, etc.) |
| Tipo de cuenta | Física o jurídica · moneda (USD / Gs · a veces ambas) |
| **Origen de los fondos** | **El punto crítico.** Documentación que acredite de dónde vienen los fondos |

> UNRESOLVED: la fuente no especifica quién completa este cuestionario con el inversor (¿Juan José directamente, un asistente administrativo, el abogado de la Red de Aliados?), ni en qué formato se prepara (documento escrito, reunión previa, ambos). Tampoco especifica si el cuestionario varía por banco o es uniforme entre los bancos de trabajo de Meridiano.

## La declaración de origen de fondos

Es el corazón del compliance. El banco (y la UAF) necesitan trazar que los fondos provienen de fuentes legítimas. Ejemplos de respaldo aceptados:

- Venta de propiedades en el país de origen (con escritura/comprobante)
- Ingresos de actividad declarada
- Herencia, con documentación
- Cualquier fuente, con papel que la respalde

**Regla dura de la fuente:** "Sin origen de fondos documentado, no hay cuenta." Debe prepararse desde la **Etapa 0** (Pre-inversión) del journey — no se puede dejar para el momento de ir al banco.

> UNRESOLVED: no está documentado qué pasa operativamente si el origen de fondos del inversor no encaja en ninguno de los ejemplos listados (venta de propiedad, ingresos declarados, herencia). No hay un proceso de excepción ni un responsable de evaluar casos atípicos antes de presentarlos al banco.

## Marco de cumplimiento

- **UAF** (Unidad de Análisis Financiero, ex-SEPRELAD) — prevención de lavado de activos
- **BCP** (Banco Central del Paraguay) — normativa bancaria
- **CRS / FATCA** — reporte internacional; relevante para inversores de Europa y para inversores con cuentas en otros países

> UNRESOLVED: la fuente nombra los tres marcos regulatorios pero no detalla el procedimiento concreto de reporte CRS/FATCA que aplica a un inversor específico (qué formulario, qué plazo, quién lo presenta ante qué autoridad). Se marca como "relevante" sin procedimiento operativo asociado.

## Datos a completar

La fuente original deja esta tabla explícitamente sin completar. Se preserva tal cual, como gap operativo activo y no como error de esta migración:

| Ítem | Valor |
|---|---|
| Banco(s) de trabajo de Meridiano | `[COMPLETAR]` |
| Requisitos específicos de ese banco | `[COMPLETAR]` |
| Tiempo típico de apertura | `[COMPLETAR]` |
| Monto mínimo de apertura, si aplica | `[COMPLETAR]` |

> UNRESOLVED: los cuatro campos de la tabla anterior no tienen valor cargado en la fuente. Sin el nombre del/los banco(s) de trabajo, no se puede saber si el cuestionario documentado arriba aplica igual a todos los bancos posibles, ni cuánto tiempo o capital mínimo debe anticipar el inversor. Esta es la brecha operativa más directa de todo el dominio bancario: bloquea dar una respuesta precisa a la pregunta más común del inversor en esta etapa ("¿cuánto tarda?", "¿en qué banco?").
> UNRESOLVED: la fuente tampoco indica el responsable operativo de la Etapa 2 en sí (a diferencia de otras etapas del journey donde `etapas-detalle.md` sí nombra un responsable — p. ej. Etapa 0 "Juan José / Meridiano", Etapa 3 "Abogado + escribano de la Red de Aliados", Etapa 4 "Contadora de confianza"). No hay un responsable nombrado para acompañar físicamente al inversor al banco o para gestionar la relación bancaria.
