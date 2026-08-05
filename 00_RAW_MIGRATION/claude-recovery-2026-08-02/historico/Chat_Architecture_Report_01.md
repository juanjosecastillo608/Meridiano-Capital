# CHAT ARCHITECTURE REPORT — PASADA 01

**Sistema:** Chat Architecture & Knowledge Migration System 2.0
**Alcance de esta pasada:** 7 conversaciones accesibles fuera de Proyectos (2 jun – 14 jul 2026)
**Fecha de análisis:** 24 de julio de 2026
**Prioridad declarada:** resolución de la arquitectura Jumacabe / Meridiano Capital / Urbannit

---

## PARTE A — RESOLUCIÓN DE LA ARQUITECTURA

### A.1 — Hallazgo: la pregunta estaba mal formulada

La relación **Meridiano Capital ↔ Urbannit ya está resuelta oficialmente** y no es una decisión pendiente. Está documentada en `Meridiano_Capital_Brand_Guidelines_v1.docx`, Parte 7, y sistematizada en `references/urbannit-y-arquitectura.md`:

| Modelo | Estado |
|---|---|
| Branded House | Descartado — diluiría la seriedad institucional |
| House of Brands | Descartado — Urbannit partiría de cero en credibilidad |
| **Endorsed Brand** | **ADOPTADO** |

Lockup oficial: *Urbannit, gestionado por Meridiano Capital*.

Lo que **no** está definido en ninguna parte del sistema oficial es **Jumacabe S.A.** Verificado por búsqueda exhaustiva: la entidad no aparece en ninguno de los 16 archivos de referencia de la skill de marca, ni en el Manual de Marca.

**Diagnóstico:** Jumacabe S.A. no es un problema de arquitectura de marca. Es una capa distinta que el sistema actual no contempla. El Brand Guidelines resolvió el plano de marca y dejó sin documentar el plano societario.

### A.2 — Propuesta de arquitectura en tres capas `[EXTENSIÓN]`

> Lo siguiente es una recomendación, no una regla oficial del Manual de Marca. Requiere validación y, si se aprueba, incorporación formal al Brand Guidelines v1.1.

```
CAPA 1 — SOCIETARIA / PATRIMONIAL  (no es marca, nunca es marca)
│
├── JUMACABE S.A.  — vehículo patrimonial propio
│   RUC 80160350-1 · Síndico: Juan José Castillo
│   Titular registral de activos (ej. Habitalis Mburucuyá 16°F + cochera 52)
│
├── S.A. de inversores  — constituidas por cliente (ej. Quintero Inversiones S.A.)
│   Vehículos de terceros que Meridiano Capital asesora y administra
│
└── Persona física  — Juan José Castillo (fundador, firma de autoridad de marca)

        ↓ opera comercialmente bajo ↓

CAPA 2 — MARCA  (Endorsed Brand — OFICIAL, Brand Guidelines Parte 7)
│
├── MERIDIANO CAPITAL  — marca madre
│   Inversores institucionales y particulares extranjeros
│   Titular del contrato con el propietario
│
└── URBANNIT  — sub-marca operativa endosada
    Huéspedes de estadía corta · circuito de renta temporal

        ↓ comercializa y administra ↓

CAPA 3 — ACTIVOS Y PROYECTOS
│
├── UON Calathea           (entrega inminente · Shopping del Sol / Las Lomas)
├── Habitalis Mburucuyá    (entrega julio 2026 · Av. Molas López 2100)
├── Park Lofts Tower       (entrega junio 2028 · Av. Santa Teresa)
├── 01 SYNC                (terminado · Villa Morra)
├── Edificio multifamiliar 2.600 m² (en evaluación · USD 530.000)
├── Conversión 20 habitaciones 600 m² (en evaluación · USD 175.000)
└── Víctor Haedo 919 (activo en gestión · ISSAN AA8991)
```

### A.3 — Reglas de convivencia propuestas para la Capa 1 `[EXTENSIÓN]`

1. **Jumacabe S.A. nunca aparece en piezas públicas de marca.** Su lugar son contratos, escrituras, documentación bancaria y fiscal. Un inversor ve *Meridiano Capital*; un escribano ve *Jumacabe S.A.*
2. **La capa societaria no tiene identidad visual propia.** No se le diseña logo, paleta ni papelería de marca. Usa papelería corporativa neutra o, cuando corresponda institucionalmente, la de Meridiano Capital.
3. **Un mismo activo puede tener titular societario distinto del gestor de marca.** Habitalis 16°F es de Jumacabe S.A. y se comercializa bajo Meridiano Capital. Esto es normal y debe documentarse por activo, no resolverse fusionando capas.
4. **La nota de presentación bancaria es una pieza de Capa 1**, no de marca — pero al ser leída por un tercero institucional, debería alinearse al tono verbal de Meridiano Capital (Módulo 02) sin usar su identidad visual completa.

### A.4 — Decisión pendiente que bloquea el resto

**¿A qué marca pertenece cada activo del portafolio?**

El Módulo 13 define *cuándo* corresponde crear identidad de proyecto propia y cuándo usar directamente Meridiano Capital — pero **ninguno de los activos del portafolio pasó por ese test**. Y más grave: **Urbannit no tiene ningún activo asignado** en todo el conocimiento accesible.

Caso concreto detectado: Habitalis Mburucuyá 16°F se alquiló amoblado a 12 meses (contrato del 27/6/2026, USD 950/mes). Eso es renta residencial de largo plazo → **Meridiano Capital**, no Urbannit. Si el circuito de renta temporal que justifica la existencia de Urbannit todavía no tiene activos, Urbannit es hoy una marca sin operación.

Hasta que esto se resuelva, cualquier pieza comercial de los cuatro proyectos se produce sin saber qué sistema cromático, tipográfico y de tono le corresponde.

---

## PARTE B — CHAT ARCHITECTURE REPORTS

### CHAT 01 — "UON Calathea: últimas unidades a precio de lanzamiento"
**Fecha:** 14 jul 2026 · **Valor:** ALTO · **¿Múltiples proyectos?** SÍ

Es el chat más denso del conjunto. Contiene al menos tres unidades de conocimiento independientes:

- **Bloque A — Sistema de contenido comercial** para los 4 proyectos: posts de feed, captions segmentadas por perfil (ejecutivo local / expat / joven profesional) × 3 estrategias narrativas, mensajes de WhatsApp para grupos de colegas, secuencias de 3 stories, guiones de Reel de 30", calendarios mensuales de julio 2026 y packs de cierre de mes.
- **Bloque B — Modelo comparativo de inversión**: rendimientos de los 4 proyectos bajo 3 escenarios de ocupación (95% / 85% / 75%), con ranking por rendimiento ajustado por riesgo.
- **Bloque C — Activos Canva**: presentación de 9 slides + ficha de propiedad de 2 páginas.

**Asignación:** → PROYECTO 05 (contenido) + PROYECTO 03 (modelo de inversión) + ACTIVO transversal (metodología de escenarios de ocupación).

**Pendiente sin cerrar:** el set de 9 captions para 01 SYNC, equivalente al de Habitalis, quedó solicitado y no producido.

**⚠ CONFLICTO:** todo este material se produjo **fuera del sistema de marca**. Las presentaciones Canva se generaron con `style: elegant` genérico, sin paleta, tipografía ni tono de Meridiano Capital. Requiere auditoría con la Matriz de Decisión (Módulo 15) antes de reutilizarse.

---

### CHAT 02 — "Contrato de alquiler amoblado Asunción Paraguay"
**Fecha:** 28 jun 2026 · **Valor:** ALTO · **¿Múltiples proyectos?** NO (un proyecto + activos)

Contrato de locación residencial amoblada parametrizado para Jumacabe S.A. Incluye Anexo de inventario de muebles y enseres, y un análisis comparativo de pólizas de seguro sobre valor asegurado de USD 120.000 (cuatro opciones entre USD 432 y USD 840/año, con recomendación fundamentada).

**Asignación:** → PROYECTO 04 (Sistema Contractual y Legal).

**Activos extraíbles:** plantilla de contrato residencial amoblado · Anexo I (inventario) · cuadro comparativo de pólizas.

**Próximo paso registrado y no ejecutado:** la Cláusula Vigésima (seguro) fue diagnosticada como *potestativa y mejorable* — se recomendó reformularla con carácter obligatorio, plazo y consecuencias. Esa corrección nunca se aplicó.

---

### CHAT 03 — "Plan de gestión financiera y rentabilidad para edificio multifamiliar"
**Fecha:** 24 jun 2026 · **Valor:** MEDIO-ALTO · **¿Múltiples proyectos?** SÍ (2)

- **Bloque A:** modelo financiero de adquisición y reposicionamiento — edificio 2.600 m², USD 530.000 + USD 150.000 de obra, objetivo +40% de ingresos y esquema de expensas para cubrir USD 2.500/mes de costos fijos.
- **Bloque B:** plantilla de contrato de locación de **oficinas** con Anexo I (inventario) y Anexo II (acta de entrega-recepción) — temáticamente pertenece al Sistema Contractual, no a este modelo financiero.

**Asignación:** Bloque A → PROYECTO 03 · Bloque B → PROYECTO 04.

---

### CHATS 04 y 05 — "Reclamación de ajuste de facturas de agua ESSAP"
**Fecha:** 16 jun 2026 (17:26 y 17:33) · **Valor:** BAJO como proyecto, ALTO como activo

**🔁 DUPLICADO DETECTADO.** Dos conversaciones con prompt idéntico separadas por 7 minutos, que produjeron dos documentos casi equivalentes:

| | Chat 05 (17:26) | Chat 04 (17:33) |
|---|---|---|
| Archivo | `Nota_Reclamo_ESSAP_AA8991.docx` | `Reclamo_ESSAP_AA8991.docx` |
| Reserva de acciones | SEDECO | **ERSSAN + Defensa del Consumidor + judicial** |
| Cuadro comparativo | Sí | Sí, con ciclos reclamados resaltados |

**Single Source of Truth:** Chat 04 (17:33) — es posterior y su sección de reserva de acciones es más completa. Chat 05 pasa a INFORMACIÓN HISTÓRICA.

**Recomendación:** no crear proyecto propio. Convertir en **ACTIVO** dentro del Proyecto 02 — plantilla de reclamo administrativo ante entes de servicios, con la fundamentación legal reutilizable (Ley 1334/98 Defensa del Consumidor, Ley 1614/00 Marco Regulatorio de Agua, principio *in dubio pro consumidor*, carga de la prueba sobre el prestador).

---

### CHAT 06 — "Sistema integral de gestión inmobiliaria y administración de alquileres"
**Fecha:** 7 jun 2026 · **Valor:** ALTO · **¿Múltiples proyectos?** NO

Entregable único y sustancial: `Gestion_Inmobiliaria_Asuncion.xlsx` — 9 planillas formuladas y validadas (clientes y propiedades, inquilinos con requisitos legales de Asunción, contratos y vencimientos, ingresos/egresos a 12 meses, ajuste de alquileres por IPC, plan de remodelaciones 2025-2030, liquidación a propietarios, morosos con protocolo escalonado, tablero de KPIs con Cap Rate / ROI / NOI).

**Asignación:** → PROYECTO 02 (Sistema de Administración de Rentas). Es el activo operativo más maduro del conjunto.

---

### CHAT 07 — "Análisis de rentabilidad para conversión de edificio en viviendas de alquiler"
**Fecha:** 3 jun 2026 · **Valor:** MEDIO-ALTO · **¿Múltiples proyectos?** NO

Modelo de inversión por etapas: propiedad de 600 m² a USD 175.000 convertida en 20 habitaciones con baño independiente. El chat evolucionó hacia un modelo mayor de 3 etapas (adquisición + obra → ampliación de ~1.100 m² → 20 cocheras), con 5 hojas vinculadas y 215 fórmulas.

**Asignación:** → PROYECTO 03, como segunda instancia de la misma metodología del Chat 03.

**Activo transversal extraíble:** **metodología de modelado de inversión por etapas** — separar adquisición de desarrollo, asignar retorno propio a cada etapa, y registrar compras simultáneas en la etapa 1 aunque su construcción sea posterior.

---

### CHAT 08 — "Presentación comercial Jumacabe SA para institución bancaria"
**Fecha:** 2 jun 2026 · **Valor:** ALTO · **¿Múltiples proyectos?** NO (1 proyecto, 2 instancias)

Nota de presentación empresarial para departamento comercial bancario, respondiendo el cuestionario estándar de onboarding: actividad principal, productos a importar, finalidad de la cuenta, tipo de cuenta, origen de los fondos. Incluye declaración de cumplimiento BCP / SEPRELAD / DNA.

Se produjeron **dos instancias**: Jumacabe S.A. (fondos propios de venta de propiedades en España, 6 departamentos por USD 600.000) y Quintero Inversiones S.A. (importación de casas prefabricadas + inversión inmobiliaria, con justificación de doble cuenta USD/Gs).

**Asignación:** → PROYECTO 01 (Onboarding de Inversores Extranjeros).

**Observación estratégica:** este chat es la única evidencia documentada del flujo de servicio declarado (cédula → cuenta bancaria → S.A. → contadora), y solo cubre el eslabón bancario. Los eslabones de cédula, constitución societaria y estructura fiscal no tienen activos producidos.

---

## PARTE C — MAPA MAESTRO DE PROYECTOS

Construido desde el contenido real encontrado, no desde la plantilla de ejemplo del Master Prompt.

```
MERIDIANO CAPITAL + URBANNIT
│
├── 00 — GOBERNANZA Y ARQUITECTURA
│      Capa societaria · arquitectura de marca · política de rentabilidad
│      Estado: PARCIAL — marca resuelta, capa societaria sin definir
│
├── 01 — ONBOARDING DE INVERSORES EXTRANJEROS
│      Cédula → banco → S.A. → estructura fiscal
│      Estado: PARCIAL — solo eslabón bancario documentado
│      Origen: Chat 08
│
├── 02 — SISTEMA DE ADMINISTRACIÓN DE RENTAS
│      9 planillas · liquidaciones · morosos · KPIs · reclamos a entes
│      Estado: MADURO
│      Origen: Chat 06, Chats 04/05
│
├── 03 — MODELOS DE ADQUISICIÓN Y REPOSICIONAMIENTO
│      ├── Instancia A: multifamiliar 2.600 m² (USD 530k)
│      ├── Instancia B: conversión 20 habitaciones (USD 175k)
│      └── Instancia C: comparativo 4 proyectos por escenarios de ocupación
│      Estado: ACTIVO
│      Origen: Chats 03, 07, 01
│
├── 04 — SISTEMA CONTRACTUAL Y LEGAL
│      Contrato residencial amoblado · contrato oficinas · anexos · seguros
│      Estado: ACTIVO con corrección pendiente (Cláusula Vigésima)
│      Origen: Chats 02, 03
│
├── 05 — PORTAFOLIO DE PROYECTOS Y CONTENIDO COMERCIAL
│      ├── UON Calathea · Habitalis Mburucuyá · Park Lofts Tower · 01 SYNC
│      Estado: ACTIVO — desalineado del sistema de marca
│      Origen: Chat 01
│
└── 06 — BRAND OS  [NO ANALIZADO EN ESTA PASADA]
       Skill meridiano-capital-identity v1.1 (20 módulos) es el SSOT vigente
       Los chats de origen del branding no son accesibles desde este alcance
```

---

## PARTE D — ACTIVOS TRANSVERSALES

| Activo | Origen | Reutilizable en |
|---|---|---|
| Plantilla de nota de presentación bancaria | Chat 08 | P01 |
| Sistema de 9 planillas de administración (.xlsx) | Chat 06 | P02, P03 |
| Plantilla de contrato residencial amoblado | Chat 02 | P04, P05 |
| Plantilla de contrato de oficinas + Anexos I y II | Chat 03 | P04 |
| Plantilla de reclamo ante entes de servicios | Chat 04 | P02 |
| Metodología de modelado por etapas | Chat 07 | P03 |
| Metodología de escenarios de ocupación (95/85/75%) | Chat 01 | P03, P05 |
| Cuadro comparativo de pólizas de seguro | Chat 02 | P02, P04 |
| Skill `meridiano-capital-identity` (SSOT de marca) | — | Todos |

---

## PARTE E — MASTER COMPANY KNOWLEDGE BASE

**Nivel 1 — Público / operativo**

- Flujo de servicio al inversor extranjero: cédula paraguaya → apertura de cuentas (física y/o jurídica) → constitución de S.A. (con escribano y abogado de confianza) → estructura fiscal (contadora de confianza) → adquisición → administración.
- Umbral declarado para recomendar S.A.: inversor con más de una o dos propiedades.
- Precios de referencia del portafolio (jul 2026): Habitalis USD 120.000 sin cochera / USD 135.000 con cochera · UON Calathea alquiler USD 750 sin amoblar con cochera / USD 950 amoblado con cochera · 01 SYNC amoblado sin cochera · Park Lofts rendimiento proyectado >11% desde jun 2028.
- Contexto de mercado: ~97% de ocupación en barrios premium de Asunción.

**Nivel 2 — Restringido (datos societarios y catastrales)**

> Estos datos existen en los chats de origen y deben preservarse, pero se recomienda alojarlos en un documento de acceso restringido, no en el cuerpo general de la base de conocimiento.

- Jumacabe S.A.: RUC, síndico, domicilio, acta de directorio N° 2, poder de administración del 1/6/2026 (escritura matriz 14, folio 30, sección A, registro notarial 107).
- Habitalis Mburucuyá: Av. Molas López 2100 · unidad 16°F + cochera 52 · titular Jumacabe S.A.
- Víctor Haedo 919: ISSAN AA8991 · cuenta corriente catastral 10.0447.01.0003.

---

## PARTE F — CONFLICTOS DETECTADOS

### CONFLICTO 01 — Política de rentabilidad objetivo (crítico)

Circulan cinco valores distintos sin una política que los ordene:

| Fuente | Valor | Base |
|---|---|---|
| Perfil profesional declarado | 10% anual | Neto, alquiler |
| Chat 06 (7 jun) | 12% anual | Neto |
| Chat 07 (3 jun) | 14% anual | Bruto |
| Chat 03 (24 jun) | 15% anual | Bruto |
| Chat 01 (14 jul) | 8,08% base / 11,6% proyectado | Según activo |

No son necesariamente contradictorios — distintas clases de activo y perfiles de riesgo justifican distintos umbrales. El problema es que **no existe la política que lo explique**. Sin ella, dos modelos financieros producidos con seis días de diferencia le prometen cosas distintas al inversor.

**Recomendación:** redactar una *Política de Rentabilidad Objetivo* que defina umbral por clase de activo y por etapa de ingreso (terreno / aporte de construcción / preventa / renta / reventa), y que fije siempre si el número es bruto o neto.

### CONFLICTO 02 — Jumacabe S.A. fuera de la arquitectura

Detallado en la Parte A. Requiere decisión del responsable de marca.

### CONFLICTO 03 — Contenido comercial fuera del sistema de marca

Todo el material del Chat 01 (captions, calendarios, guiones, 2 diseños Canva) se produjo sin aplicar la skill de identidad. Requiere auditoría con el Módulo 15 antes de reutilizarse o publicarse.

### CONFLICTO 04 — Portafolio sin test de Módulo 13

Ninguno de los cuatro proyectos pasó por el criterio oficial que define si corresponde identidad de proyecto propia o uso directo de la marca Meridiano Capital.

### CONFLICTO 05 — Urbannit sin activos

La sub-marca existe con identidad completa y sin operación asignada.

---

## PARTE G — CLASIFICACIÓN BRAND OS

**BRAND OS 2.0 — CANDIDATOS** (estratégico)
- Definición de la capa societaria y sus reglas de convivencia con la marca `[EXTENSIÓN]`
- Política de Rentabilidad Objetivo por clase de activo
- Ficha oficial del portafolio con asignación de marca por activo (test Módulo 13)
- Flujo de servicio al inversor extranjero como propuesta de valor documentada

**BRAND OS 2.1 — PRODUCTION LAYER, CANDIDATOS FUTUROS** (operativo)
- Los 9 activos de la Parte D, sin excepción
- Sistema de contenido segmentado por perfil de comprador/inquilino
- Calendarios mensuales de contenido como plantilla replicable

**NOT READY**
- Eslabones de cédula, constitución societaria y estructura fiscal del Proyecto 01
- Asignación de activos a Urbannit
- Todo el Proyecto 06 (Brand OS), por falta de acceso a los chats de origen

---

## PARTE H — PRÓXIMOS PASOS

**Bloqueantes (requieren decisión, no producción)**
1. Validar o corregir la arquitectura de tres capas de la Parte A.
2. Definir la Política de Rentabilidad Objetivo.
3. Correr el test del Módulo 13 sobre los 4 proyectos del portafolio.
4. Decidir si Urbannit recibe activos o queda en reserva.

**Producción pendiente ya identificada**
5. Completar el set de 9 captions de 01 SYNC (Chat 01).
6. Reformular la Cláusula Vigésima del contrato de alquiler (Chat 02).
7. Auditar los 2 diseños Canva con la Matriz de Decisión (Módulo 15).

**Migración de conocimiento**
8. Recuperar los chats de branding — fuera del alcance actual de búsqueda.
9. Consolidar los dos chats ESSAP en un único activo.
