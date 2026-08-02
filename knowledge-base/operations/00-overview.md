Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-investor-journey/SKILL.md, inventory/_raw-copies/meridiano-investor-journey/references/etapas-detalle.md, inventory/_raw-copies/meridiano-investor-journey/references/onboarding-bancario.md, inventory/_raw-copies/meridiano-investor-journey/assets/checklist-inversor.md, inventory/_raw-copies/meridiano-investor-journey/references/tarifario.md
Dominio: OPERATIONS

# Overview — Dominio Operations

Este dominio contiene los procesos operativos que ejecutan el acompañamiento del inversor extranjero: el trámite bancario, la herramienta de seguimiento (checklist) y la ficha de precios/comisiones que rige cada cobro. Son la capa de "cómo se hace, paso a paso, quién lo hace y cuánto cuesta" — complementaria a la narrativa de negocio en `knowledge-base/business/04-etapas-del-inversor.md`, que explica el journey completo del inversor (las seis etapas: Pre-inversión → Estructura de entrada/cédula → Cuentas bancarias → Sociedad Anónima → Estructura fiscal → Inversión y administración) y las dos decisiones que lo abren (S.A. sin cédula vs. cédula propia; camino Estándar vs. Investor Pass).

## Cómo se relacionan los tres documentos de este dominio con el journey de negocio

- **`knowledge-base/business/04-etapas-del-inversor.md`** (dominio BUSINESS, escrito por un agente paralelo) — la narrativa completa de las seis etapas, los dos modelos de inversor (individual vs. coinversión) y las dos decisiones de entrada. Es el mapa. Referenciar esa fuente para entender el journey de punta a punta.
- **`01-onboarding-bancario.md`** (este dominio) — el procedimiento operativo detallado de la **Etapa 2** del journey (Apertura de cuentas bancarias). Es la pieza donde más inversores se traban, porque la cédula no garantiza la cuenta: el banco corre su propio compliance independiente.
- **`02-checklist-inversor.md`** (este dominio) — la herramienta operativa de seguimiento que atraviesa **todas las etapas** (0 a 5 + acompañamiento continuo). Es la plantilla que se personaliza por inversor para saber en qué etapa está y qué falta.
- **`03-tarifario.md`** (este dominio) — la ficha de precios y comisiones que rige las Etapas 1, 3, 4 (paquetes de ingreso) y 5 (administración/comercialización de propiedad). Es un hecho operativo (qué se cobra, cuándo, a quién), no una pieza de negociación comercial.

## Regla de negocio que gobierna estos tres documentos

Según el `SKILL.md` fuente (`meridiano-investor-journey`):

- **El origen de fondos es el punto crítico del banco.** Prepararlo desde la Etapa 0 evita el motivo de rechazo/demora de cuenta más frecuente. Ver `01-onboarding-bancario.md`.
- **El tarifario se envía en etapa avanzada**, cuando el inversor ya calificó y pide números con alternativas — **nunca en el primer contacto**. Ver `03-tarifario.md`.
- **Nunca informar montos de tarifario de memoria.** Si los datos no están cargados en la fuente vigente, decir que se envían al avanzar. (Nota: a la fecha de esta migración, `tarifario.md` está marcado `ESTADO: COMPLETO`, sin `[COMPLETAR]` pendientes — ver `03-tarifario.md`.)
- **No sos abogado, escribano ni contador.** El proceso operativo guía al inversor y deriva a los profesionales de confianza (abogado, escribano, contadora) para el acto legal, notarial o fiscal — ninguno de estos roles lo ejecuta Meridiano directamente salvo cuando actúa como representante legal/síndico de la S.A. sin cédula (ver `03-tarifario.md`, rol incluido en el Asesoramiento Mensual).

## Gaps operativos heredados de la fuente

> UNRESOLVED: la fuente original (`etapas-detalle.md`) marca explícitamente que varios campos de tiempos y costos por etapa están pendientes de los datos reales de Juan José ("hasta completarlos, usar rangos generales e indicar que son estimados"). Los campos `[COMPLETAR]` específicos del dominio Operations están detallados en `01-onboarding-bancario.md`. Este overview no reconstruye `etapas-detalle.md` completo porque el detalle etapa-por-etapa pertenece al dominio BUSINESS (`04-etapas-del-inversor.md`); aquí solo se documentan los tres artefactos operativos asignados a este dominio.

## Requisitos que este dominio impone a otros dominios

- **BUSINESS** — la narrativa de etapas debe mantener consistencia con la secuencia operativa real: Etapa 0 (Pre-inversión) → Etapa 1 (Estructura de entrada / cédula opcional) → Etapa 2 (Bancario, detallado acá) → Etapa 3 (S.A.) → Etapa 4 (Fiscal) → Etapa 5 (Inversión y administración). Cualquier cambio a la secuencia de negocio debe reflejarse en el checklist (`02-checklist-inversor.md`).
- **BRAND** — la "Regla de rol" del tarifario (Cartera A = "Administración" vs. Cartera B = "Intermediación inmobiliaria", nunca presentar como administración cuando el administrador real es un tercero) es una restricción de marca que debe respetarse en cualquier material comercial o de comunicación. Ver `03-tarifario.md`.
- **INVESTMENT** — el modelo de coinversión (fee de estructuración 1,5–3%, fee de gestión de obra 2–4%, carried interest 15–20% sobre hurdle 8%) se menciona en `03-tarifario.md` pero su fuente completa es `modelo-coinversion.md`, fuera del alcance de este dominio. No duplicar esos números aquí sin verificar contra esa fuente.
