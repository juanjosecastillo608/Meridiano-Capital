# CAPA 1 — ARQUITECTURA SOCIETARIA Y REGISTRO PATRIMONIAL

**Addendum v3 al Chat Architecture Report 01**
**Fecha:** 24 de julio de 2026
**Actualizado:** 24 jul 2026 — fechas de entrega, cierre de verificaciones de Campo Agreste, calendario de entregas.
**Cambios respecto de v2:** incorporación de Campo Agreste S.A. · corrección del estado de obra de ARL y Quintero · revisión de la recomendación sobre Urbannit · resolución del rol en Habitalis Mburucuyá

---

## 1. ARQUITECTURA DEFINITIVA

```
JUAN JOSÉ CASTILLO  — persona física
│
├── Agente Inmobiliario          → comisión de venta 5,5%
├── Síndico de las 5 S.A.        → fiscalización societaria
└── Accionista 90% + representante legal de ↓

    CAMPO AGRESTE S.A.  ·  RUC 80093513-6
    │   Persona jurídica que opera la marca MERIDIANO CAPITAL
    │   Administra las propiedades de los 5 vehículos
    │   → honorarios de administración
    │
    └── administra ↓

        ├── JUMACABE S.A.             RUC 80160350-1   ·  9 unidades
        ├── WICA S.A.                 RUC 80171347-1   ·  1 unidad
        ├── QUINTERO INVERSIONES S.A. RUC 80167526-0   ·  3 unidades (en obra)
        ├── CANARIAS INVERSIONES S.A. RUC 80167528-6   ·  32 unidades / 3 edificios
        └── ARL S.A.                  RUC 80167525-1   ·  8 unidades (en obra)
```

### 1.1 — Los tres flujos de ingreso quedan separados

Esta es la virtud principal de la estructura adoptada. Cada función tiene su sujeto y su naturaleza:

| Función | Sujeto | Naturaleza | Ingreso |
|---|---|---|---|
| Administración de propiedades | Campo Agreste S.A. | Servicio recurrente | Honorarios mensuales |
| Corretaje / venta | JJC persona física | Transaccional | Comisión 5,5% |
| Fiscalización societaria | JJC persona física | Orgánica | Según estatuto |

**Consecuencia práctica a planificar con la contadora:** un mismo cliente puede recibir dos facturas de dos sujetos fiscales distintos. Jumacabe S.A., por ejemplo, recibe honorarios de administración facturados por Campo Agreste S.A. y comisión de venta facturada por Juan José Castillo persona física. Conviene que la estructura documental lo refleje desde el inicio y no como parche posterior.

### 1.2 — La dualidad síndico/administrador: mejora, no firewall

Con Campo Agreste S.A. la separación pasa a ser **formal**: quien administra es una persona jurídica y quien fiscaliza es una persona física. Son sujetos distintos y eso ya es una mejora sustantiva respecto del esquema anterior.

Ahora bien, conviene ser preciso: al ser Juan José Castillo accionista del 90% y representante legal de la administradora, en términos **sustantivos** sigue siendo la misma voluntad la que administra y la que fiscaliza. Es una separación de forma, no un muro de independencia.

En Jumacabe —vehículo propio— el punto es de bajo riesgo. En vehículos con inversores de terceros, o si en el futuro entra capital externo a alguna de las cinco S.A., la pregunta reaparece con otro peso. Corresponde definirlo con escribano y abogado; no es una opinión legal.

### 1.3 — Campo Agreste S.A.: verificaciones

El RUC 80093513-6 es numéricamente **anterior** a los cinco vehículos —Jumacabe, el más antiguo del grupo, es 80160350-1—. Campo Agreste es la sociedad más vieja de la estructura, y esa antigüedad es precisamente el motivo de su elección: aporta trayectoria y respaldo frente a bancos e inversores, a diferencia de una S.A. recién constituida.

Que el nombre no represente la actividad es irrelevante bajo la regla de invisibilidad de la Capa 1: Campo Agreste no aparece en ninguna pieza pública de marca. Solo aparece donde su antigüedad es un activo — banca, contratos, documentación institucional.

| # | Verificación | Estado |
|---|---|---|
| 1 | Objeto social cubre administración de inmuebles y prestación de servicios | ✅ **CONFIRMADO** |
| 2 | Registro de marca en DINAPI a nombre de Campo Agreste S.A. | ✅ **DECIDIDO** |
| 3 | Destino del 10% accionario | ✅ **RESERVA ESTRATÉGICA** — ver 1.3.1 |
| 4 | Historial fiscal y contable de la etapa anterior | ⬜ Sin verificar |

**1.3.1 — El 10% como reserva estratégica**

El 10% no distribuido está reservado para incorporar socios de capital y socios estratégicos, con dos perfiles previstos: una **constructora** y/o un **estudio de arquitectura**.

La lógica es sólida — integra verticalmente las dos capacidades que el negocio consume de forma recurrente. Y refuerza la decisión de registrar la marca bajo Campo Agreste: si se vende una porción de la sociedad, la marca debe ser un activo *de* la sociedad, no algo externo que la acompaña informalmente.

⚠ **Consideración de partes vinculadas que surge de esta decisión.** Si una constructora o un estudio de arquitectura pasa a ser accionista de la administradora, y esa administradora adjudica los presupuestos de obra del Proyecto 08 (reposicionamiento de los tres edificios de Canarias), aparece la misma cuestión de precios de transferencia que ya se resolvió bien en el corretaje con el 5,5%.

Conviene aplicar el mismo criterio antes de que el socio entre, no después: obra de partes vinculadas adjudicada con al menos dos presupuestos alternativos de terceros documentados, o con un margen pactado por escrito. Es más fácil pactarlo como condición de ingreso que renegociarlo cuando el socio ya está adentro.

`[EXTENSIÓN]` — recomendación de gobernanza, no regla oficial del Manual.

### 1.4 — Impacto sobre el Brand Guidelines `[EXTENSIÓN]`

El Manual de Marca vigente describe a Meridiano Capital como marca fundada por Juan José Castillo, sin una capa societaria operadora. Con esta decisión, la descripción cambia: **Meridiano Capital pasa de marca personal a marca corporativa operada por Campo Agreste S.A.**

La gobernanza de la skill `meridiano-capital-identity` establece que si el Brand Guidelines se actualiza, la skill debe actualizarse en el mismo momento. Esto implica:

- Brand Guidelines v1.0 → **v1.1**, incorporando la Capa 1 societaria.
- Skill `meridiano-capital-identity` v1.1 → **v1.2**, con un archivo de referencia nuevo para la arquitectura societaria.
- Mantener la regla de invisibilidad: Campo Agreste S.A. no aparece en piezas públicas de marca, igual que las cinco S.A. propietarias. Su lugar son contratos, facturas y documentación institucional.

Esto es una recomendación, no una regla oficial del Manual.

---

## 2. REGISTRO PATRIMONIAL CONSOLIDADO

### 2.1 — JUMACABE S.A. · RUC 80160350-1

| # | Edificio | Piso | Unidad | Tipología | Cochera | Estado |
|---|---|---|---|---|---|---|
| 1 | Habitalis Mburucuyá | 16 | F | 1 dorm + balcón | Sí (N° 52) | Entregado · alquilado |
| 2 | Habitalis Mburucuyá | 16 | A | 1 dorm + balcón | Sí | Entregado |
| 3 | Habitalis Mburucuyá | 16 | D | 1 dorm + balcón | No | Entregado |
| 4 | Ventura Hassler | 1 | 7D | 1 dorm + balcón | Sí | En obra · **oct 2026** |
| 5 | Ventura Hassler | 7 | 4D | 1 dorm + balcón | Sí | En obra · **oct 2026** |
| 6 | Habitalis Villa Morra | 1 | B | 1 dorm + balcón | Sí | En obra · **mar 2027** |
| 7 | Habitalis Villa Morra | 2 | E | 1 dorm + balcón | No | En obra · **mar 2027** |
| 8 | Habitalis Villa Morra | 6 | D | 1 dorm + balcón | No | En obra · **mar 2027** |
| 9 | Habitalis Villa Morra | 7 | D | 1 dorm + balcón | No | En obra · **mar 2027** |

**9 unidades · 3 edificios · 5 cocheras · 100% de 1 dormitorio con balcón**

⚠ Verificar contra escritura la nomenclatura de Ventura Hassler: la unidad *7D* está en piso 1 y la *4D* en piso 7. Si la convención del edificio asocia el número al piso, los datos podrían estar invertidos. Es el tipo de detalle que conviene corregir antes de cargarlo al sistema de administración.

### 2.2 — WICA S.A. · RUC 80171347-1

| # | Edificio | Piso | Unidad | Tipología | Cochera | Estado |
|---|---|---|---|---|---|---|
| 1 | Habitalis Villa Morra | 1 | E | 1 dorm + balcón | Sí | En obra · **mar 2027** |

**1 unidad · 1 cochera**

WICA y Jumacabe son copropietarias en Habitalis Villa Morra, ambas con unidad en piso 1. Relevante para el cómputo de votos en asamblea de copropietarios: entre las dos suman 5 de las unidades del edificio.

### 2.3 — QUINTERO INVERSIONES S.A. · RUC 80167526-0

| # | Edificio | Piso | Tipología | Cochera | Estado |
|---|---|---|---|---|---|
| 1 | Veralta Los Laureles Torre 2 | 12 | Monoambiente | No | **En construcción** |
| 2 | Veralta Los Laureles Torre 2 | 13 | Monoambiente | No | **En construcción** |
| 3 | Veralta Los Laureles Torre 2 | 14 | Monoambiente | No | **En construcción** |

**3 unidades · pisos consecutivos · 0 cocheras**

Sin identificador de unidad: se asigna recién en la entrega. No es un dato faltante sino una etapa no alcanzada.

**Destino previsto:** administración de rentas al entregarse, con evaluación de venta de algunas unidades.

### 2.4 — CANARIAS INVERSIONES S.A. · RUC 80167528-6

| Edificio | Departamentos | Locales | Total |
|---|---|---|---|
| Montevideo | 11 | 1 | 12 |
| FRM | 14 | 1 | 15 |
| Ygatimy | 3 | 2 | 5 |
| **Total** | **28** | **4** | **32** |

**3 edificios completos · terminados · todos generando renta**

**Este vehículo opera bajo un modelo distinto al resto.** Al ser propietaria de edificios enteros no hay condominio ni expensas de terceros: Canarias *es* el condominio. Fija sus propias expensas, controla los costos fijos, decide obras sin asamblea y captura la totalidad del upside de una remodelación.

**Los tres edificios fueron adquiridos con objetivo explícito de reposicionamiento.** Está pendiente presupuestar y ejecutar obras de remodelación para incrementar las rentas actuales. Esto convierte a Canarias en el caso de aplicación directa de la metodología ya desarrollada en el Chat 03 (edificio de 2.600 m², objetivo +40% de ingresos) y el Chat 07 (modelado por etapas).

⚠ Sin desagregar: tipología, piso, superficie, cocheras y renta vigente de cada una de las 32 unidades. Es el bloque de datos más grande que falta en toda la cartera.

### 2.5 — ARL S.A. · RUC 80167525-1

| # | Edificio | Piso | Unidad | Tipología | Cochera | Estado |
|---|---|---|---|---|---|---|
| 1 | CIVIS XI | 13 | H | Monoambiente + balcón | No | **En construcción** |
| 2 | CIVIS XI | 16 | D | Monoambiente + balcón | No | **En construcción** |
| 3 | Marina 11 | 3 | F | Monoambiente + balcón | No | **En construcción** |
| 4 | Marina 11 | 3 | G | 1 dorm + balcón | No | **En construcción** |
| 5 | Ventura Villa Morra | 4 | 05 | Monoambiente + balcón | No | **En construcción** |
| 6 | Ventura Villa Morra | 4 | 06 | Monoambiente + balcón | No | **En construcción** |
| 7 | Invicta Recoleta | 4 | B | Monoambiente + balcón | No | **En construcción** |
| 8 | Invicta Recoleta | 7 | L | 1 dorm + balcón | No | **En construcción** |

**8 unidades · 4 edificios · 0 cocheras · 6 monoambientes + 2 de 1 dormitorio**

Patrón deliberado: exactamente 2 unidades por edificio en cuatro edificios distintos. Es diversificación de riesgo de obra y de riesgo de zona, no acumulación oportunista.

**Destino previsto:** administración de rentas al entregarse, con evaluación de venta de algunas unidades.

### 2.6 — Consolidado por estado de madurez

| Estado | Unidades | Detalle |
|---|---|---|
| Terminado y en renta | 32 | Canarias — 3 edificios completos |
| Entregado (3 en venta activa) | 3 | Jumacabe — Habitalis Mburucuyá |
| En obra · entrega **oct 2026** | 2 | Jumacabe — Ventura Hassler |
| En obra · entrega **mar 2027** | 5 | Jumacabe (4) + WICA (1) — Habitalis Villa Morra |
| En obra · entrega **sin fecha** | 11 | ARL (8) + Quintero (3) |
| **TOTAL** | **53** | |

### 2.6.0 — Totales verificados

| Métrica | Valor |
|---|---|
| Unidades totales | **53** (49 departamentos + 4 locales) |
| Edificios distintos | **11**, de los cuales 3 son íntegramente propios |
| Operativas | 35 |
| En obra | 18 |
| Cocheras identificadas | **6** (Jumacabe 5 · WICA 1) · Canarias sin datos |
| **Unidades sin cochera** | **15** — Jumacabe 4 · Quintero 3 · ARL 8 · Canarias sin datos |

**35 unidades operativas · 18 unidades en obra.** Un tercio de la cartera todavía no existe físicamente. Esto reclasifica el portafolio: no es una cartera de renta madura sino una cartera con un componente fuerte de pozo, coherente con la actividad declarada de compra en preventa.

### 2.6.1 — Calendario de entregas `COMPLETO`

| Fecha | Edificio | Unidades | Vehículo | Estado |
|---|---|---|---|---|
| jul 2026 | Habitalis Mburucuyá | 3 | Jumacabe | ✅ Entregado |
| **oct 2026** | Ventura Hassler | 2 | Jumacabe | En obra |
| **mar 2027** | Habitalis Villa Morra | 5 | Jumacabe (4) + WICA (1) | En obra |
| **dic 2027** | Marina 11 | 2 | ARL | En obra |
| **dic 2027** | Invicta Recoleta | 2 | ARL | En obra |
| **mar 2028** | Ventura Villa Morra | 2 | ARL | En obra |
| **dic 2028** | CIVIS XI | 2 | ARL | En obra |
| **ene 2029** | Veralta Los Laureles T2 | 3 | Quintero | En obra |

**Distribución por año:** 2026 → 5 unidades · 2027 → 9 · 2028 → 4 · 2029 → 3

**Dos picos de concentración:**
- **marzo 2027** — 5 unidades de un solo golpe (Habitalis Villa Morra). Es la oleada más grande del pipeline.
- **diciembre 2027** — 4 unidades en dos edificios simultáneos (Marina 11 + Invicta Recoleta).

**Horizonte:** el pipeline se extiende hasta enero de 2029. Dos años y medio de entregas escalonadas.

**Lectura de las carteras por vehículo:**
- **ARL** diversifica también en el tiempo: sus 8 unidades llegan en 4 fechas distintas entre dic 2027 y dic 2028. No es solo diversificación de zona y de desarrollador, también de ciclo de obra.
- **Quintero** es la posición de horizonte más largo: sus 3 unidades son las últimas en entregar.

### 2.6.2 — El calendario espejo que falta `CRÍTICO`

Un calendario de entregas tiene siempre un reverso que aquí no está documentado: **el calendario de pagos de obra.**

18 unidades en pozo implican cuotas de construcción corriendo simultáneamente durante dos años y medio. Eso no es un activo esperando: es una obligación de caja mensual. Sin ese cronograma no hay forma de saber si el flujo de las 35 unidades operativas cubre los compromisos del pipeline, ni cuánto capital propio hay que aportar y cuándo.

Y hay un segundo costo asociado a cada entrega: **el equipamiento.** Si las unidades van a renta amoblada —como Habitalis Mburucuyá, alquilada a USD 950 amoblado— cada entrega dispara un desembolso de mobiliario. En marzo de 2027 son 5 unidades a equipar al mismo tiempo.

**Cada fecha del calendario de arriba es, en realidad, tres eventos:** fin de pagos de obra, desembolso de equipamiento, e inicio de ingreso por renta. Modelarlos juntos es el trabajo pendiente.

### 2.7 — Hipótesis de cronología societaria

Ordenando por RUC: **Campo Agreste (…93513-6) → Jumacabe (…60350-1) → [ARL …7525-1 + Quintero …7526-0 + Canarias …7528-6] → WICA (…71347-1)**.

Los tres del medio tienen numeración casi consecutiva: se constituyeron en el mismo lote. Es una inferencia a partir de la numeración, no un dato confirmado — verificable con las escrituras.

---

## 3. HABITALIS MBURUCUYÁ: ROL RESUELTO

El Chat 01 produjo material comercial de Habitalis mientras Jumacabe posee tres unidades ahí. Queda aclarado:

**Juan José Castillo actúa como agente vendedor de unidades propias de Jumacabe S.A., cobrando la misma comisión del 5,5% que a cualquier cliente. Mientras no se concrete la venta, se administran los alquileres.**

Dos observaciones:

**Sobre el precio de transferencia.** Cobrar a un vehículo propio la misma comisión que a un tercero es la práctica correcta —*arm's length*— y evita el cuestionamiento fiscal clásico de subvaluación de servicios entre partes vinculadas. Vale documentarlo explícitamente en el contrato de corretaje con Jumacabe, porque es la clase de cosa que una fiscalización pregunta y que conviene tener escrita de antemano, no reconstruida después.

**Sobre la divulgación al comprador.** El planteo que hice en la versión anterior era exagerado y lo corrijo: que un agente represente al vendedor es lo normal en corretaje, no una anomalía. El único punto residual es que el agente es además síndico de la sociedad vendedora. En una operación con un comprador extranjero asesorado por su propio abogado, mencionarlo de entrada es más simple que explicarlo después.

**Conciliación de cifras de Habitalis (aún sin cerrar):** precio de venta USD 120.000 sin cochera / USD 135.000 con cochera (Chat 01) · alquiler efectivo USD 950/mes amoblado con cochera (contrato 27/6/2026) · valor asegurado USD 120.000 (Chat 02). El alquiler sobre el precio da ~9,5% bruto anual antes de vacancia y gastos, coherente con el 8,08% base del Chat 01.

---

## 4. URBANNIT: RECOMENDACIÓN REVISADA

**La versión anterior de este documento contenía un error.** Se propuso asignar a Urbannit las 11 unidades de ARL y Quintero como circuito de renta temporal, sobre el supuesto de que eran activos operativos. Están en construcción. La recomendación no era ejecutable en el plazo en que se planteó.

El razonamiento de fondo sigue en pie, pero con dos correcciones:

**Sigue siendo válido** que el perfil de esas unidades —monoambientes sin cochera en Recoleta, Villa Morra, Los Laureles— es producto natural de estadía corta. Sin cochera, el inquilino de largo plazo con vehículo se descarta solo; para un huésped temporal la cochera es irrelevante y la ubicación lo es todo. Las tres de Quintero en Veralta Torre 2, en pisos 12, 13 y 14 consecutivos, son un mini-circuito de tres llaves en un mismo edificio, operable como una sola unidad de gestión.

**Corrección 1 — es una decisión de lanzamiento, no de asignación inmediata.** Urbannit no puede operar hasta que entregue la primera obra. La decisión relevante hoy no es *qué unidades van a Urbannit* sino *si Urbannit se lanza con la entrega de ARL/Quintero o antes, con otra cartera*.

**Corrección 2 — parte de ese inventario se va a vender.** Está previsto evaluar la venta de algunas unidades al entregarse. Una unidad destinada a venta no debería incorporarse a un circuito de renta temporal: la operación de estadía corta exige equipamiento, montaje de canales y construcción de reputación, inversión que se pierde si la unidad sale de la cartera a los pocos meses.

**Consecuencia:** la asignación a Urbannit debe decidirse **unidad por unidad y recién al momento de la entrega**, después de resolver el destino renta/venta de cada una. Antes de eso es prematuro.

`[EXTENSIÓN]` — recomendación de asignación de cartera, no regla oficial del Manual. Sujeta al test del Módulo 13.

---

## 5. PROYECTOS NUEVOS DETECTADOS

### P07 — POLÍTICA DE RENTABILIDAD OBJETIVO `APROBADO`

Resuelve el Conflicto 01 del reporte v1 (cinco umbrales distintos circulando sin política que los ordene).

Debe definir umbral por **clase de activo** y por **etapa de ingreso**, fijando siempre si la cifra es bruta o neta:

| Etapa de ingreso | Umbral | Base |
|---|---|---|
| Compra de terreno | a definir | a definir |
| Aporte de capital para construcción | a definir | a definir |
| Preventa / pozo | a definir | a definir |
| Renta | a definir | a definir |
| Reventa / plusvalía | a definir | a definir |

Insumos disponibles: 10% neto (perfil declarado), 12% neto (Chat 06), 14% bruto (Chat 07), 15% bruto (Chat 03), 8,08% base y 11,6% proyectado (Chat 01).

Clases de activo a distinguir, según lo que muestra el inventario: monoambiente sin cochera · 1 dormitorio con cochera · local comercial · edificio completo · unidad en pozo.

**Candidato Brand OS 2.0** — es documento estratégico, no plantilla operativa.

### P08 — CANARIAS: PROGRAMA DE REPOSICIONAMIENTO `NUEVO`

Tres edificios completos adquiridos con objetivo de remodelación, hoy generando renta sin intervenir. Requiere: relevamiento del estado de las 32 unidades, presupuesto de obra por edificio, cronograma que minimice vacancia durante la ejecución, y proyección de renta post-remodelación.

Metodología ya disponible en el Proyecto 03 (Chats 03 y 07). Es la primera aplicación de esa metodología sobre activos propios en cartera y no sobre adquisiciones en evaluación.

Depende de P07: sin umbral de rentabilidad definido no hay criterio para aprobar o rechazar un presupuesto de obra.

---

## 6. PENDIENTES

**Cerrados en esta ronda**
- ~~Objeto social de Campo Agreste~~ → confirmado
- ~~Registro de marca en DINAPI~~ → decidido a nombre de Campo Agreste S.A.
- ~~Destino del 10% accionario~~ → reserva estratégica para socios de capital / constructora / estudio de arquitectura
- ~~Estado de obra de Ventura Hassler y Habitalis Villa Morra~~ → oct 2026 y mar 2027

**Bloqueantes para modelar rentabilidad**
1. ~~Fechas de entrega de ARL y Quintero~~ → completadas. **Nuevo pendiente derivado: cronograma de pagos de obra y de equipamiento** (ver 2.6.2).
2. Superficie (m²), valor de adquisición y fecha de compra de cada unidad.
3. Renta vigente y estado de ocupación por unidad.
4. Desagregado completo de las 32 unidades de Canarias.

**Bloqueante para lanzar la web**
5. **Fotografía real del sitio.** El sitio está aprobado por marca con 0 imágenes. Ver Chat Architecture Report 02.

**Correcciones registrales**
6. Verificar nomenclatura de Ventura Hassler (7D en piso 1 / 4D en piso 7).
7. Cocheras de Canarias.

**Gobernanza**
8. Historial fiscal y contable de Campo Agreste de su etapa anterior.
9. Criterio de partes vinculadas para obra, a pactar antes del ingreso de un socio constructor.
10. Actualización de Brand Guidelines v1.0 → v1.1 y de la skill de marca v1.1 → v1.2.
11. Momento de lanzamiento de Urbannit y destino renta/venta unidad por unidad.

## 7. IMPACTO EN EL MAPA MAESTRO

```
MERIDIANO CAPITAL  (operada por Campo Agreste S.A.)
│
├── 00 — GOBERNANZA Y ARQUITECTURA          Capa 1 CERRADA · pendiente objeto social
├── 01 — ONBOARDING DE INVERSORES           PARCIAL — solo eslabón bancario
├── 02 — ADMINISTRACIÓN DE RENTAS           PRIORIDAD MÁXIMA — 53 unidades a cargar
├── 03 — MODELOS DE ADQUISICIÓN             ACTIVO — 2 casos en evaluación
├── 04 — SISTEMA CONTRACTUAL Y LEGAL        ACTIVO — cláusula de seguro pendiente
├── 05 — COMERCIALIZACIÓN
│      ├── 05.A Cartera propia (Habitalis Mburucuyá + futuras ventas ARL/Quintero)
│      └── 05.B Terceros (UON Calathea · Park Lofts · 01 SYNC)
├── 06 — BRAND OS                           BLOQUEADO — falta chat del Proyecto
├── 07 — POLÍTICA DE RENTABILIDAD OBJETIVO  NUEVO · aprobado
└── 08 — CANARIAS: REPOSICIONAMIENTO        NUEVO · depende de 07
```
