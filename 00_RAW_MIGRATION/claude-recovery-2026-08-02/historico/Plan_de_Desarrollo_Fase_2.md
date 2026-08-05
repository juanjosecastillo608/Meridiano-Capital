# PLAN DE DESARROLLO — FASE 2

**Meridiano Capital + Urbannit · operada por Campo Agreste S.A.**
**De la arquitectura de conocimiento a la empresa en ejecución**
**Fecha:** 24 de julio de 2026

---

## 0. LA TESIS DE ESTA FASE

La Fase 0 organizó el conocimiento. La Fase 1 creó los contenedores. La Fase 2 **ejecuta**, y tiene una tesis que conviene enunciar antes de cualquier lista de tareas:

> **No te falta tecnología. Te falta orquestación y lógica de negocio codificada.**

Ya tenés conectados Canva, Gmail, Google Drive/Calendar, Higgsfield, HubSpot, Notion, Microsoft 365, Slack, Resend, Zapier, Jotform, Shutterstock, Lovable y más. Ya tenés en tu biblioteca decenas de skills de marketing, ventas, contenido, finanzas y operaciones. Y ya construiste una skill propia —`meridiano-capital-identity`— que demuestra que sabés convertir tu criterio en un sistema reutilizable.

El error clásico en tu posición sería salir a coleccionar más herramientas. La palanca real es la contraria: **encapsular tu experiencia de 16 años en cuatro o cinco skills propias**, y conectar las herramientas de ejecución que ya tenés. Eso —no un conector nuevo— es lo que convierte "Claude que ayuda" en "el sistema operativo de Meridiano Capital".

---

## 1. QUÉ SIGNIFICA "AGENTE DE IA" EN TU NEGOCIO — SIN HUMO

Pediste agentes de IA como vendedores y creadores de contenido. Vale ser preciso, porque hay una versión fantasía y una versión que genera plata.

**La versión fantasía:** un bot autónomo que cierra ventas de departamentos de USD 120.000 a un inversor extranjero sin intervención humana. Eso no existe de forma confiable hoy, y si existiera sería un riesgo — tu negocio se sostiene en confianza, referidos y acompañamiento personal en cédula, banco y sociedad. Automatizar el cierre destruiría exactamente lo que te hace referenciable.

**La versión que genera plata:** agentes que hacen el trabajo repetitivo de alto volumen que hoy te consume horas y que escala mal con esfuerzo humano.

| Agente | Qué hace de verdad | Qué NO hace |
|---|---|---|
| **Agente de Contenido** | Genera captions segmentadas por perfil, guiones de Reel, calendarios, adaptaciones por proyecto — todo dentro del sistema de marca | No publica sin tu OK ni inventa datos de propiedades |
| **Agente de Primer Contacto** | Responde consultas iniciales, califica leads, explica el journey del inversor (cédula→banco→SA→fiscal), agenda la llamada | No negocia precio ni cierra; te entrega el lead calificado |
| **Agente de Seguimiento** | Redacta secuencias de follow-up personalizadas, recuerda vencimientos de contratos, arma liquidaciones | No toma decisiones de cartera |
| **Agente de Análisis** | Corre modelos de rentabilidad contra la política P07, arma comparativos de inversión | No aprueba inversiones; te da el número para que decidas |

**El patrón común:** cada agente hace el 80% del trabajo mecánico y te entrega el 20% que requiere tu criterio. Multiplicás tu capacidad sin diluir lo que te diferencia. Eso es lo que hacen los mejores operadores — no reemplazan su juicio, reemplazan las horas alrededor de su juicio.

---

## 2. ARSENAL ACTUAL — LO QUE YA TENÉS

### 2.1 Conectores activos (no hay que instalar)

| Conector | Uso en Meridiano |
|---|---|
| **Canva** | Presentaciones de inversión, fichas de propiedad, piezas de redes |
| **Higgsfield** | Imagen y video de marca y contexto (P10) |
| **HubSpot** | CRM de inversores — pipeline, contactos, seguimiento |
| **Gmail + Resend** | Correo de inversores y campañas |
| **Google Drive/Calendar** | Documentos y agenda |
| **Notion** | Base de conocimiento operativa, wiki interna |
| **Microsoft 365** | SharePoint, Outlook, Teams si se usa |
| **Slack** | Coordinación de equipo, tag de Claude |
| **Zapier** | **Puente a WhatsApp e Instagram** — clave, ver 6.2 |
| **Jotform** | Formularios de captación de leads |
| **Shutterstock** | Stock de contexto |
| **Lovable / v0** | Apps web sin código |

### 2.2 Skills de biblioteca ya disponibles

No hay que crearlas — están en tu librería y se invocan cuando el contexto las pide:

- **Marketing:** campaign-plan · content-creation · draft-content · email-sequence · seo-audit · brand-review · performance-report · competitive-brief
- **Ventas:** draft-outreach · account-research · create-an-asset · forecast · pipeline-review · call-prep · call-summary
- **Contenido y datos:** data-analysis · create-viz · build-dashboard
- **Documentos:** docx · pptx · xlsx · pdf (creación profesional)
- **Diseño:** frontend-design · ui-ux-pro-max · banner-design · impeccable

### 2.3 Skills propias

- ✅ `meridiano-capital-identity` v1.1 — 20 módulos, fuente de verdad de marca

**La conclusión de esta sección:** el 90% de lo que necesitás ya está. Lo que sigue es orquestarlo y codificar tu lógica.

---

## 3. PLAN DE TRABAJO — LOS 5 PROYECTOS EXISTENTES

Cada proyecto con su objetivo de fase, sus entregables concretos y las herramientas que usa.

### PROYECTO 1 — GOBERNANZA Y ESTRUCTURA
**Objetivo de fase:** cerrar los pendientes societarios y volver operativo el journey del inversor.

| Entregable | Herramienta | Estado |
|---|---|---|
| Ampliación/verificación objeto social Campo Agreste | Escribano (externo) | Pendiente |
| Registro de marca en DINAPI a nombre de Campo Agreste | Abogado (externo) | Decidido, sin ejecutar |
| Documentar el journey completo del inversor como proceso | skill nueva `meridiano-investor-journey` | A construir |
| Plantilla de nota bancaria parametrizada | docx + activo Chat 08 | Existe |
| Checklist de constitución de S.A. para inversores | docx | A crear |

**Skill a construir:** `meridiano-investor-journey` — codifica cédula→banco→SA→fiscal con requisitos, tiempos, documentos y contactos de confianza. Con esto, cualquier agente responde el proceso igual y sin errores.

### PROYECTO 2 — ADMINISTRACIÓN DE RENTAS
**Objetivo de fase:** cargar las 53 unidades y activar el sistema de administración.

| Entregable | Herramienta | Estado |
|---|---|---|
| Carga de las 53 unidades en las 9 planillas | xlsx (activo Chat 06) | Planilla lista, datos faltan |
| Corrección Cláusula Vigésima (seguro) del contrato | docx | Pendiente |
| Calendario de entregas y de pagos de obra operativo | xlsx | A construir |
| Sincronización con HubSpot (inversor ↔ unidad) | HubSpot | A configurar |
| Dashboard de KPIs (Cap Rate, ROI, NOI, morosidad) | build-dashboard | A construir |

**Decisión de infraestructura:** cuando las 9 planillas se queden cortas —y con 53 unidades y 5 sociedades, va a pasar— el salto es convertirlas en una app real. Ahí entra `the-architect` (blueprint) + Lovable/Supabase (construcción). No ahora; cuando el volumen lo justifique.

### PROYECTO 3 — INVERSIÓN Y RENTABILIDAD
**Objetivo de fase:** definir la Política de Rentabilidad (P07) y aplicarla a Canarias (P08).

| Entregable | Herramienta | Estado |
|---|---|---|
| **P07 — Política de Rentabilidad Objetivo** | docx + xlsx | Charter listo, prioridad 1 |
| Skill que codifica la política | `meridiano-rentabilidad` | A construir tras P07 |
| P08 — Relevamiento y presupuesto de Canarias | xlsx | Depende de P07 |
| Modelo maestro de inversión por etapas | xlsx (metodología Chats 03/07) | Existe, a estandarizar |
| Comparador de escenarios de ocupación | create-viz | Metodología existe |

**Skill a construir:** `meridiano-rentabilidad` — una vez P07 fija los umbrales por clase de activo y etapa (bruto/neto), esta skill hace que todo modelo futuro use el mismo criterio. Elimina de raíz el Conflicto 01 (cinco umbrales sueltos).

### PROYECTO 4 — MARCA Y BRAND OS
**Objetivo de fase:** re-auditar el material pre-marca y cerrar el test del Módulo 13.

| Entregable | Herramienta | Estado |
|---|---|---|
| Re-auditoría de los 4 activos pre-marca | skill de marca + Módulo 15 | Pendiente (Conflicto 03) |
| Test del Módulo 13 sobre el portafolio | skill de marca | Pendiente (Conflicto 04) |
| Actualización Brand Guidelines v1.1 (Capa 1 societaria) | docx | Pendiente |
| Deck de propietarios (nunca producido) | pptx + skill de marca | Pendiente |
| **Brand OS 2.0** — cuando el resto cierre | — | Fase 3 |

### PROYECTO 5 — DIGITAL, IMAGEN Y COMERCIALIZACIÓN
**Objetivo de fase:** producir el banco de imagen (P10) y publicar la web (P09).

| Entregable | Herramienta | Estado |
|---|---|---|
| **P10 — Banco de imagen mínimo viable** | Higgsfield + fotógrafo + renders | Prioridad 2 |
| Solicitud de renders a 5 desarrolladoras (con autorización escrita) | Gmail | Pendiente |
| Fotografía real de Canarias + Habitalis Mburucuyá | Fotógrafo (externo) | Pendiente |
| Alojamiento del banco | Cloudinary (a conectar) | Recomendado |
| **P09 — Publicación de la web** | HTML aprobado + Claude Code | Depende de P10 |
| Motor de contenido segmentado | `meridiano-content-engine` | A construir |

---

## 4. PROYECTOS NUEVOS A CREAR

Tres proyectos que faltan para "crear la empresa, ejecutar y automatizar". No son genéricos: cada uno cubre una función real que hoy no tiene hogar.

### PROYECTO 6 — MOTOR DE ADQUISICIÓN DE INVERSORES `NUEVO`
**Por qué existe:** hoy la captación está partida —onboarding en Gobernanza, comercialización en Digital— y no hay un lugar que gestione el **embudo de inversores** de punta a punta. Es tu núcleo de ingresos (comisión 5,5% + honorarios) y no tiene proyecto propio.

**Contiene:**
- Pipeline de inversores en HubSpot (Argentina, Brasil, Europa)
- Los tres agentes de venta: Primer Contacto, Seguimiento, Análisis
- Secuencias de outreach por origen geográfico
- Material de captación por etapa (terreno / construcción / pozo / renta)
- Sistema de referidos — tu canal más valioso, hoy no sistematizado

**Herramientas:** HubSpot · Gmail/Resend · Zapier→WhatsApp · Calendly · las skills de ventas de biblioteca

### PROYECTO 7 — SISTEMA DE CONTENIDO Y REDES `NUEVO`
**Por qué existe:** el contenido segmentado que ya producís (captions, Reels, calendarios) es un activo recurrente que merece su propia fábrica, separada de la estrategia digital de P05.

**Contiene:**
- El Agente de Contenido (`meridiano-content-engine`)
- Calendario editorial mensual de los proyectos
- Producción de piezas en Canva
- Publicación vía Zapier→Instagram
- Métricas vía Supermetrics
- Auditoría de cada pieza contra la marca (Módulo 15)

**Herramientas:** Canva · Higgsfield · Zapier · Supermetrics (a conectar) · skill de marca · skills de contenido de biblioteca

### PROYECTO 8 — AUTOMATIZACIÓN Y AGENTES `NUEVO`
**Por qué existe:** los agentes y automatizaciones necesitan un banco de pruebas y un lugar donde se construyan y mantengan, sin ensuciar los proyectos operativos.

**Contiene:**
- Construcción y prueba de los 4 agentes antes de soltarlos a producción
- Automatizaciones Zapier (WhatsApp, Instagram, alertas de vencimientos)
- Integración con Cowork para tareas multi-paso
- Blueprints con `the-architect` para futuras apps (empezando por la de administración)
- Documentación de cada agente: qué hace, qué no, cuándo escala a humano

**Herramientas:** Zapier · Cowork · Claude Code · `the-architect` · Lovable/Supabase

---

## 5. SKILLS PROPIAS A CONSTRUIR

Este es el trabajo de mayor palanca de toda la Fase 2. Cinco skills que convierten tu experiencia en sistema.

| # | Skill | Qué codifica | Habilita | Prioridad |
|---|---|---|---|---|
| 1 | ✅ `meridiano-capital-identity` | Identidad de marca | Todo el material | Existe |
| 2 | `meridiano-rentabilidad` | Umbrales P07 por clase y etapa, bruto/neto | Agente de Análisis · resuelve Conflicto 01 | Tras P07 |
| 3 | `meridiano-content-engine` | Perfiles de comprador, tonos, formatos por canal | Agente de Contenido | Alta |
| 4 | `meridiano-investor-journey` | Proceso cédula→banco→SA→fiscal | Agente de Primer Contacto | Alta |
| 5 | `meridiano-portfolio` | Las 53 unidades como datos estructurados | Todos los agentes | Media |

**Cómo se construyen:** tenés instalada la skill `skill-creator`. Es la herramienta con la que se crean, prueban y optimizan skills nuevas. Cada una de estas cinco se arma con ella, igual que se armó la de marca.

**Regla de oro:** una skill se construye cuando la lógica ya está *decidida*, no antes. Por eso `meridiano-rentabilidad` va después de P07 — codificar una política que todavía no existe es codificar humo.

---

## 6. CONECTORES A EVALUAR

### 6.1 Recomendados

| Conector | Para qué | Decisión |
|---|---|---|
| **Cloudinary** | Alojar, transformar y servir el banco de imagen de P10 | Conectar al iniciar P10 |
| **Supermetrics** | Métricas de Instagram/Meta/TikTok en un lugar | Conectar al iniciar P07-redes |
| **Calendly** | Agendar llamadas con inversores | Conectar al iniciar P06 |

### 6.2 WhatsApp e Instagram — vía Zapier

No existen como conectores nativos MCP. **El puente es Zapier, que ya tenés.** Zapier conecta con WhatsApp Business API e Instagram, y Claude orquesta Zapier. Es la ruta estándar y no requiere instalar nada nuevo — solo configurar los "zaps" correspondientes dentro del Proyecto 8.

### 6.3 Lo que NO hace falta

No instales conectores de rubros ajenos (finanzas de fondos, legal litigioso, salud, etc.) que aparecen en la biblioteca. Ruido. Tu stack está casi completo.

---

## 7. SECUENCIA DE 90 DÍAS

El orden no es por gusto: respeta las dependencias reales.

### Mes 1 — Fundaciones que desbloquean
1. **P07 — Política de Rentabilidad** (Proyecto 3). Desbloquea toda decisión de capital. Sin esto, seguís decidiendo por intuición sobre 18 unidades en pozo.
2. **P10 — Banco de imagen mínimo** (Proyecto 5). Pedir renders a las 5 desarrolladoras hoy — es gratis y tarda en volver. Fotografía de Canarias y Habitalis.
3. **Carga de las 53 unidades** (Proyecto 2). El sistema de administración deja de estar vacío.

### Mes 2 — Los primeros agentes
4. Construir `meridiano-rentabilidad` (tras P07) y `meridiano-investor-journey`.
5. **P09 — Publicar la web** (Proyecto 5), ya con imágenes.
6. Levantar el Proyecto 6 (Adquisición) con el pipeline en HubSpot y el Agente de Primer Contacto.

### Mes 3 — Escala de contenido y automatización
7. Construir `meridiano-content-engine` y levantar el Proyecto 7 (Contenido).
8. Configurar Zapier→WhatsApp/Instagram en el Proyecto 8.
9. **P08 — Reposicionamiento de Canarias** (Proyecto 3), ya con P07 como criterio.

### Lo que queda para después de los 90 días
- Brand OS 2.0 (Fase 3) — cuando los conflictos 03/04/05 estén cerrados
- App de administración con `the-architect` — cuando el volumen supere las planillas
- Production Layer 2.1 → Claude Code + Cowork (Fase 4)

---

## 8. MAPA COMPLETO — 8 PROYECTOS

```
MERIDIANO CAPITAL  (Campo Agreste S.A.)
│
├── 1 · Gobernanza y Estructura          societario · journey del inversor
├── 2 · Administración de Rentas         53 unidades · planillas · KPIs
├── 3 · Inversión y Rentabilidad         P07 política · P08 Canarias
├── 4 · Marca y Brand OS                 identidad · re-auditoría · Módulo 13
├── 5 · Digital, Imagen y Comercialización  P09 web · P10 imagen
│
├── 6 · Motor de Adquisición de Inversores   NUEVO · embudo · 3 agentes de venta
├── 7 · Sistema de Contenido y Redes         NUEVO · agente de contenido
└── 8 · Automatización y Agentes             NUEVO · Zapier · Cowork · apps
```

---

## 9. LA PRIMERA ACCIÓN CONCRETA

Si mañana hacés una sola cosa, que sea esta: **abrir el Proyecto 3 y empezar P07.** Todo lo demás —los agentes, la web, el contenido, Canarias— depende de tener el criterio de rentabilidad definido. Es la pieza que convierte 16 años de intuición acertada en una política que un agente de IA puede aplicar mil veces sin equivocarse.

Cuando quieras, arrancamos P07 acá mismo y sale el primer borrador de la política.
