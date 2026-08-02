Estado: CURRENT
Fuente original: meridiano-investor-journey/SKILL.md, meridiano-investor-journey/references/etapas-detalle.md
Dominio: BUSINESS

# Las seis etapas del Investor Journey — detalle operativo

> Nota de la fuente original: los campos marcados `[COMPLETAR]` esperan datos reales de Juan José Castillo (tiempos y costos de su experiencia directa). Hasta completarlos, se deben usar rangos generales e indicar explícitamente que son estimados — nunca presentarlos como datos confirmados.

## Principio rector del journey

**El acompañamiento genera la cartera y el referido.** El objetivo no es solo cerrar una compra: es que el inversor mantenga su cartera y refiera a familiares y amigos. Cada etapa bien acompañada es una razón para que confíe y vuelva. Regla: no improvisar el proceso ni saltear etapas.

Ambos modelos de negocio (Individual y Coinversión, ver `01-dos-modelos-de-negocio.md`) comparten estas mismas etapas de onboarding (cédula → banco → sociedad → fiscal); la coinversión suma sobre esta base la estructura del vehículo, el waterfall y la gobernanza del fondo (ver `03-modelo-coinversion.md`).

---

## ETAPA 0 — Pre-inversión

**Objetivo:** entender al inversor y definir la ruta.

| Ítem | Detalle |
|---|---|
| Qué se hace | Perfilar objetivos, capital, apetito de riesgo · presentar rentabilidades (dominio INVESTMENT / motor `meridiano-rentabilidad`) · definir monto → ruta |
| Duración | `[COMPLETAR]` |
| Costo | Sin costo (asesoría de Meridiano) |
| Responsable | Juan José Castillo / Meridiano |
| Salida | Monto definido · ruta elegida (estándar / Investor Pass) |

---

## ETAPA 1 — Estructura de entrada (la cédula es OPCIONAL)

**Principio:** el extranjero puede invertir SIN cédula, vía S.A. donde Meridiano es representante legal y síndico. La cédula corre en paralelo si el inversor la quiere. Ver detalle completo en `02-camino-migratorio.md`.

### Vía rápida — S.A. sin cédula

| Ítem | Detalle |
|---|---|
| Qué se hace | Constituir S.A. con socios 100% extranjeros (sin cédula) · Meridiano asume representante legal y síndico · la S.A. compra inmuebles de inmediato |
| Habilita | Comprar inmuebles ya, sin esperar la cédula |
| Costo | Constitución `[COMPLETAR]` + acompañamiento mensual rep. legal/síndico USD 350/mes |
| Duración del acompañamiento | Para siempre o hasta que el inversor obtenga su cédula |
| Aplica a | Cualquier monto |

### Vía cédula (opcional, en paralelo) — documentos apostillados

**Documentos requeridos (apostillados o legalizados):**
- Pasaporte vigente
- Certificado de nacimiento
- Antecedentes penales (país de origen + países de residencia de los últimos 3 años)
- Certificado de matrimonio/divorcio si aplica

### Camino ESTÁNDAR (< USD 200.000)

| Ítem | Detalle |
|---|---|
| Proceso | Residencia temporal (2 años, otorga cédula biométrica) → permanente a los 24 meses |
| Duración trámite | `[COMPLETAR]` |
| Costo | `[COMPLETAR]` (aranceles DNM indexados al jornal mínimo — ver migraciones.gov.py) |
| Presencia física | `[COMPLETAR]` |
| Doble proceso | Opción: iniciar cédula y, una vez obtenida, constituir S.A. propia (inversor como su propio representante legal/síndico) |

### Camino INVESTOR PASS (≥ USD 200.000)

| Ítem | Detalle |
|---|---|
| Proceso | SUACE emite Constancia de Inversionista Extranjero (CIE) en ≤5 días hábiles → Migraciones otorga residencia permanente directa → emisión de cédula |
| Requiere | Desembolso de al menos el 30% de la inversión para iniciar · declaración jurada de origen de fondos · documentos apostillados |
| Presencia física | Una sola vez, para la emisión de la cédula |
| Validez | Cédula y residencia permanente 10 años · sin estadía mínima (visita cada 3 años) |
| Duración total | `[COMPLETAR]` |
| Costo | `[COMPLETAR]` |

**Error común documentado:** documentos sin apostillar o antecedentes penales incompletos (falta algún país de residencia reciente).

---

## ETAPA 2 — Apertura de cuentas bancarias

**Objetivo:** que el inversor pueda operar en el mercado paraguayo.

| Ítem | Detalle |
|---|---|
| Clave | **La cédula NO abre cuentas automáticamente.** El banco exige compliance + justificación de origen de fondos |
| Cumplimiento | UAF (ex-SEPRELAD) · BCP · considerar CRS/FATCA del país de origen |
| Tipo | Persona física · persona jurídica si hay S.A. · a veces cuenta doble USD/Gs |
| Duración | `[COMPLETAR]` |
| Costo | `[COMPLETAR]` |
| Banco(s) de trabajo | `[COMPLETAR]` |

> UNRESOLVED: el cuestionario de onboarding bancario referenciado (`onboarding-bancario.md`) no formaba parte de los archivos leídos para esta migración de dominio BUSINESS — verificar si existe y si su contenido pertenece a BUSINESS o a OPERATIONS.

**Error común (el más frecuente, según la fuente):** no preparar el origen de fondos desde el inicio → rechazo o demora de la cuenta.

---

## ETAPA 3 — Estructura societaria (S.A.)

**Objetivo:** habilitar al inversor a operar y facturar; requisito del Investor Pass.

| Ítem | Detalle |
|---|---|
| Cuándo | Inversor con más de 1-2 propiedades, o inversión ≥ USD 200.000 |
| Qué habilita | Operar como inversor · comprar inmuebles sin cédula · facturar · calificar al Investor Pass |
| Representación | Si los socios no tienen cédula, Meridiano es representante legal y síndico (costo mensual). Al obtener cédula, el inversor puede asumir esos roles |
| Vehículo (coinversión) | S.A. o Fideicomiso de Administración según escala — ver `03-modelo-coinversion.md` |
| Responsable | Abogado + escribano de la Red de Aliados (abogado: constitución, revisión contractual, debida diligencia · escribano: escrituración y protocolización) |
| Duración | `[COMPLETAR]` |
| Costo | `[COMPLETAR]` |

---

## ETAPA 4 — Estructura fiscal y contable

**Objetivo:** cumplir la normativa fiscal paraguaya.

| Ítem | Detalle |
|---|---|
| Qué se hace | Documentación fiscal e impositiva · alta y cumplimiento tributario |
| Datos fiscales | IRP 10% · la reventa NO se grava como actividad habitual |
| Internacional | Atender residencia fiscal del país de origen (CRS/FATCA) |
| Responsable | Contadora de confianza |
| Costo | `[COMPLETAR]` (honorario mensual/anual) |

---

## ETAPA 5 — Inversión y administración

| Ítem | Detalle |
|---|---|
| Compra | Evaluar con el motor de cálculo del dominio INVESTMENT · cerrar la operación (comisión 5,5%, solo aplica a Modelo A — Inversión Individual) |
| Administración | Búsqueda de inquilino/comprador · liquidaciones · sostener la rentabilidad objetivo |
| Honorarios | Administración `[COMPLETAR]` · alquiler `[COMPLETAR]` |

Aquí el inversor entra formalmente a la cartera administrada de Meridiano.

---

## ACOMPAÑAMIENTO CONTINUO Y REFERIDOS

Liquidaciones periódicas · renovaciones de contrato · nuevas oportunidades de cartera · gestión de la relación para generar referidos. Es la etapa que convierte al cliente en cartera recurrente y en fuente de referidos — cierra el ciclo con el principio rector del negocio.

---

## Cómo usar este journey (guía operativa)

- **Inversor pregunta "¿cómo empiezo?"** → identificar monto probable → indicar la ruta (estándar o Investor Pass) → explicar las etapas en orden, sin abrumar.
- **Generar checklist personalizado** → existe una plantilla de checklist de inversor en el inventario original (`assets/checklist-inversor.md`), marcando la ruta y el estado de cada etapa.
- **"¿En qué etapa estoy?"** → ubicar al inversor en las seis etapas y comunicar el siguiente paso concreto.
- **Duda sobre requisitos exactos o aranceles** → los aranceles migratorios se indexan al jornal mínimo y cambian; la fuente vinculante es migraciones.gov.py. No fijar montos de arancel de memoria.

## Reglas operativas del journey

1. **Meridiano no es abogado, escribano ni contador.** Guía el proceso y deriva a los profesionales de confianza (Red de Aliados) para el acto legal, notarial o fiscal. Se debe comunicar esto con claridad al inversor.
2. **El origen de fondos es el punto crítico del banco.** Prepararlo desde el inicio evita el rechazo de cuenta más común.
3. **Definir el monto antes de arrancar trámites.** El monto cambia toda la ruta.
4. Los tiempos y costos exactos viven en un tarifario editable separado de esta lógica (pendiente de datos reales, ver campos `[COMPLETAR]` arriba).
5. **El tarifario se envía en etapa avanzada**, cuando el inversor ya calificó y pide costos con alternativas — nunca en el primer contacto.
6. **Nunca informar montos de tarifario de memoria.** Si no están cargados, se debe decir que se envían al avanzar.

> PROPOSED: la referencia a `assets/checklist-inversor.md` y `references/tarifario.md` como plantillas operativas activas se documenta aquí por completitud, pero su contenido detallado no formó parte de los archivos indicados para esta migración de dominio BUSINESS. Si existen con contenido sustantivo, deberían migrarse a OPERATIONS (checklist operativo) o BUSINESS/INVESTMENT (tarifario, si define precios de negocio) en una pasada posterior.
