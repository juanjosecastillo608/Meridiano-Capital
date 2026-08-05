# PROJECT CHARTERS — P07 · P08 · P09 · P10

**Fase:** organización previa a ejecución
**Fecha:** 24 de julio de 2026
**Regla de esta fase:** ningún proyecto se ejecuta hasta que los cuatro estén definidos. No se construye la web todavía.

---

## 0. ACLARACIÓN PREVIA: EL MÓDULO 14 NO ES UN PROYECTO

El Módulo 14 — *Prompt Engine de Marca* — es uno de los 15 archivos de referencia de la skill `meridiano-capital-identity`. Es un **activo ya existente**, no un proyecto a construir.

Su lugar en esta arquitectura es como **insumo de P10**: es el motor que genera prompts de imagen y video alineados a la identidad. P10 lo consume y, en el proceso, probablemente lo expanda. Pero no tiene objetivo ni entregables propios separados de P10.

**Lo mismo vale para los Módulos 07 (Dirección de Arte) y 08 (Sistema de Imagen):** son doctrina ya escrita que P10 ejecuta.

```
Módulo 07 (Dirección de Arte)  ┐
Módulo 08 (Sistema de Imagen)  ├──→  P10 — Sistema de Imagen
Módulo 14 (Prompt Engine)      ┘      (producción)
```

---

## 1. SECUENCIAMIENTO Y RUTAS CRÍTICAS

Hay **dos cadenas independientes** que pueden correr en paralelo:

```
CADENA COMERCIAL / DIGITAL
P10 (imagen) ──────────→ P09 (web) ──────→ publicación

CADENA FINANCIERA / OPERATIVA
P07 (política) ────────→ P08 (Canarias) ──→ ejecución de obra
```

**Ninguna de las dos cadenas se puede invertir.**

- P09 sin P10 produce un sitio aprobado por marca que no puede cumplir su función comercial.
- P08 sin P07 significa aprobar presupuestos de obra sin criterio de qué rentabilidad los justifica.

**Orden de prioridad recomendado**

| Prioridad | Proyecto | Razón |
|---|---|---|
| 1 | **P07** | Es el único que desbloquea decisiones de capital. Con 18 unidades en pozo y un pipeline hasta 2029, cada mes sin política es un mes decidiendo por intuición. |
| 2 | **P10** | Bloquea todo el material comercial, no solo la web. |
| 3 | **P09** | Rápido una vez resuelto P10 — el HTML ya está aprobado. |
| 4 | **P08** | Alto valor pero requiere P07 y trabajo de campo sobre 32 unidades. |

---

## 2. P07 — POLÍTICA DE RENTABILIDAD OBJETIVO

**Estado:** aprobado · sin iniciar
**Clasificación:** Brand OS 2.0 — documento estratégico

### Objetivo
Establecer una política única que defina el umbral de rentabilidad exigido por clase de activo y por etapa de ingreso, declarando siempre si la cifra es bruta o neta.

### Contexto
Hoy circulan cinco valores distintos sin una política que los ordene: 10% neto (perfil declarado), 12% neto (Chat 06), 14% bruto (Chat 07), 15% bruto (Chat 03), 8,08% base y 11,6% proyectado (Chat 01). No son necesariamente contradictorios —distintas clases de activo y perfiles de riesgo justifican umbrales distintos— pero sin la política que lo explique, dos modelos producidos con seis días de diferencia le prometen cosas distintas al mismo inversor.

### Alcance

**Matriz a completar — etapas de ingreso**

| Etapa | Umbral | Base | Horizonte |
|---|---|---|---|
| Compra de terreno | a definir | bruto / neto | |
| Aporte de capital para construcción | a definir | bruto / neto | |
| Preventa / pozo | a definir | bruto / neto | |
| Renta | a definir | bruto / neto | |
| Reventa / plusvalía | a definir | bruto / neto | |

**Clases de activo a distinguir** — surgen del inventario real, no de una taxonomía teórica:

- Monoambiente sin cochera
- 1 dormitorio con cochera
- 1 dormitorio sin cochera
- Local comercial
- Edificio completo
- Unidad en pozo (subclasificada por años hasta entrega)

### Entregables
1. Documento de política con umbrales fundamentados.
2. Criterio de aprobación / rechazo de una oportunidad de inversión.
3. Formato estándar de presentación de rentabilidad al inversor — el mismo número, calculado igual, siempre.
4. Definición operativa de "neto": qué gastos se descuentan (expensas, IVA, honorarios de administración, vacancia, mantenimiento, impuesto inmobiliario).

### Insumos disponibles
Inventario de 53 unidades · calendario de entregas hasta ene 2029 · los cinco umbrales históricos · escenarios de ocupación 95/85/75% (Chat 01) · contexto de ~97% de ocupación en barrios premium.

### Datos que faltan
Superficie, valor de adquisición y fecha de compra por unidad. Renta vigente y ocupación. Desagregado de las 32 unidades de Canarias.

### Fuera de alcance
No modela activos individuales. Define el criterio contra el cual se modelan.

### Bloquea
P08 · todo material de inversores · las decisiones de renta/venta de las 18 unidades en pozo.

---

## 3. P08 — CANARIAS: PROGRAMA DE REPOSICIONAMIENTO

**Estado:** nuevo · sin iniciar
**Depende de:** P07

### Objetivo
Presupuestar y ejecutar la remodelación de los tres edificios de Canarias Inversiones S.A. para incrementar las rentas actuales, que es el objetivo con el que fueron adquiridos.

### Contexto
32 unidades —28 departamentos y 4 locales— en tres edificios completos: Montevideo (11+1), FRM (14+1) e Ygatimy (3+2). Todos terminados y generando renta hoy, sin intervenir.

La particularidad estructural: al ser dueña de los edificios enteros, Canarias *es* el condominio. Fija sus propias expensas, decide obras sin asamblea y captura la totalidad del upside. Es el vehículo con mayor grado de libertad de los cinco.

### Alcance
1. Relevamiento del estado de las 32 unidades y de las áreas comunes.
2. Presupuesto de obra por edificio, con ítems desagregados.
3. Cronograma que minimice vacancia durante la ejecución — el edificio genera renta mientras se remodela.
4. Proyección de renta post-remodelación y validación contra el umbral de P07.
5. Criterio de adjudicación de obra ante partes vinculadas.

### Metodología disponible
Ya desarrollada en el Chat 03 (edificio de 2.600 m², objetivo +40% de ingresos, esquema de expensas) y el Chat 07 (modelado por etapas, 5 hojas vinculadas, 215 fórmulas). **Es la primera aplicación de esa metodología sobre activos propios en cartera y no sobre adquisiciones en evaluación.**

### Riesgo de gobernanza a resolver antes de empezar
El 10% accionario de Campo Agreste S.A. está reservado para socios estratégicos, con una constructora entre los perfiles previstos. Si esa constructora entra y luego se le adjudica la obra de Canarias, aparece la cuestión de precios de transferencia.

Recomendación: pactar el criterio como condición de ingreso del socio, no después. Dos presupuestos alternativos de terceros documentados, o margen acordado por escrito. `[EXTENSIÓN]`

---

## 4. P09 — SITIO WEB MERIDIANO CAPITAL

**Estado:** activo bloqueado
**Depende de:** P10

### Objetivo
Publicar el sitio institucional de Meridiano Capital, ya aprobado por la Matriz de Decisión.

### Estado de los componentes

| Componente | Estado |
|---|---|
| HTML del sitio | ✅ auditado y **APROBADO** (Matriz de Decisión, Módulo 15) |
| Dominio | ✅ `meridianocapital.net` — GoDaddy |
| Email corporativo | ✅ `juanjosecastillo@meridianocapital.net` |
| Sitio en Higgsfield | ✅ creado, vacío · `website_id: ba7f5480-0846-429e-b3f3-5de4c2940d8d` |
| Subdominio Higgsfield | ✅ `meridiano-capital` reservado |
| Repositorio Git | ✅ generado, inaccesible desde el entorno de chat |
| Imágenes | ❌ **cero** — bloqueante |

### Dominio e identidad digital — CONFIRMADO

| Elemento | Valor definitivo |
|---|---|
| Dominio | **meridianocapital.net** |
| Email | **juanjosecastillo@meridianocapital.net** |
| Registrador | GoDaddy |

Las grafías divergentes que circulaban (`meridiadocapital.net`, `meridianocapitall.net`, `juancastillo@`) eran errores de tipeo y quedan descartadas. Estos son los valores que deben usarse en tarjetas, decks, contratos, firma de correo y el expediente de DINAPI.

### Alcance

**Matriz a completar — etapas de ingreso**

| Etapa | Umbral | Base | Horizonte |
|---|---|---|---|
| Compra de terreno | a definir | bruto / neto | |
| Aporte de capital para construcción | a definir | bruto / neto | |
| Preventa / pozo | a definir | bruto / neto | |
| Renta | a definir | bruto / neto | |
| Reventa / plusvalía | a definir | bruto / neto | |

**Clases de activo a distinguir** — surgen del inventario real, no de una taxonomía teórica:

- Monoambiente sin cochera
- 1 dormitorio con cochera
- 1 dormitorio sin cochera
- Local comercial
- Edificio completo
- Unidad en pozo (subclasificada por años hasta entrega)

### Entregables
1. Documento de política con umbrales fundamentados.
2. Criterio de aprobación / rechazo de una oportunidad de inversión.
3. Formato estándar de presentación de rentabilidad al inversor — el mismo número, calculado igual, siempre.
4. Definición operativa de "neto": qué gastos se descuentan (expensas, IVA, honorarios de administración, vacancia, mantenimiento, impuesto inmobiliario).

### Insumos disponibles
Inventario de 53 unidades · calendario de entregas hasta ene 2029 · los cinco umbrales históricos · escenarios de ocupación 95/85/75% (Chat 01) · contexto de ~97% de ocupación en barrios premium.

### Datos que faltan
Superficie, valor de adquisición y fecha de compra por unidad. Renta vigente y ocupación. Desagregado de las 32 unidades de Canarias.

### Fuera de alcance
No modela activos individuales. Define el criterio contra el cual se modelan.

### Bloquea
P08 · todo material de inversores · las decisiones de renta/venta de las 18 unidades en pozo.

---

## 3. P08 — CANARIAS: PROGRAMA DE REPOSICIONAMIENTO

**Estado:** nuevo · sin iniciar
**Depende de:** P07

### Objetivo
Presupuestar y ejecutar la remodelación de los tres edificios de Canarias Inversiones S.A. para incrementar las rentas actuales, que es el objetivo con el que fueron adquiridos.

### Contexto
32 unidades —28 departamentos y 4 locales— en tres edificios completos: Montevideo (11+1), FRM (14+1) e Ygatimy (3+2). Todos terminados y generando renta hoy, sin intervenir.

La particularidad estructural: al ser dueña de los edificios enteros, Canarias *es* el condominio. Fija sus propias expensas, decide obras sin asamblea y captura la totalidad del upside. Es el vehículo con mayor grado de libertad de los cinco.

### Alcance
1. Relevamiento del estado de las 32 unidades y de las áreas comunes.
2. Presupuesto de obra por edificio, con ítems desagregados.
3. Cronograma que minimice vacancia durante la ejecución — el edificio genera renta mientras se remodela.
4. Proyección de renta post-remodelación y validación contra el umbral de P07.
5. Criterio de adjudicación de obra ante partes vinculadas.

### Metodología disponible
Ya desarrollada en el Chat 03 (edificio de 2.600 m², objetivo +40% de ingresos, esquema de expensas) y el Chat 07 (modelado por etapas, 5 hojas vinculadas, 215 fórmulas). **Es la primera aplicación de esa metodología sobre activos propios en cartera y no sobre adquisiciones en evaluación.**

### Riesgo de gobernanza a resolver antes de empezar
El 10% accionario de Campo Agreste S.A. está reservado para socios estratégicos, con una constructora entre los perfiles previstos. Si esa constructora entra y luego se le adjudica la obra de Canarias, aparece la cuestión de precios de transferencia.

Recomendación: pactar el criterio como condición de ingreso del socio, no después. Dos presupuestos alternativos de terceros documentados, o margen acordado por escrito. `[EXTENSIÓN]`

---

## 4. P09 — SITIO WEB MERIDIANO CAPITAL

**Estado:** activo bloqueado
**Depende de:** P10

### Objetivo
Publicar el sitio institucional de Meridiano Capital, ya aprobado por la Matriz de Decisión.

### Estado de los componentes

| Componente | Estado |
|---|---|
| HTML del sitio | ✅ auditado y **APROBADO** (Matriz de Decisión, Módulo 15) |
| Dominio | ✅ `meridianocapital.net` — GoDaddy |
| Email corporativo | ✅ `juanjosecastillo@meridianocapital.net` |
| Sitio en Higgsfield | ✅ creado, vacío · `website_id: ba7f5480-0846-429e-b3f3-5de4c2940d8d` |
| Subdominio Higgsfield | ✅ `meridiano-capital` reservado |
| Repositorio Git | ✅ generado, inaccesible desde el entorno de chat |
| Imágenes | ❌ **cero** — bloqueante |

### ⚠ Verificación de dominio — prioridad inmediata

En la documentación aportada aparecen dos grafías distintas del mismo dominio:

- `meridiadocapital.net` — falta una **n** (*meridia**do*** en lugar de *meridia**no***)
- `meridianocapitall.net` — **doble l** en *capital*

Ambas difieren de la forma esperada `meridianocapital.net`. Es probable que sean errores de tipeo al escribir el mensaje, pero **hay que confirmarlo en el panel de GoDaddy antes de avanzar**, porque el dominio y el email tienen que coincidir entre sí y con lo que se imprima en tarjetas, decks, contratos y el registro de marca en DINAPI.

Si el dominio efectivamente registrado tuviera un error de grafía, corregirlo hoy cuesta el precio de un dominio. Corregirlo después de que esté en material impreso, en la firma de correo de los contratos y en el expediente de DINAPI cuesta bastante más.

### Alcance
1. Decidir hosting: publicación directa del HTML (Netlify, Vercel, Cloudflare Pages) o vía Higgsfield.
2. Publicar con las imágenes de P10 integradas.
3. Configurar DNS de meridianocapital.net, certificado SSL y correo corporativo.
4. Definir plan de evolución.

### Sobre las tres opciones de despliegue
No compiten, se ordenan. El HTML aprobado puede estar online apenas se resuelva P10 — es la ruta corta. Higgsfield vía Claude Code local queda como evolución posterior, cuando el sitio necesite dejar de ser estático.

**Limitación técnica confirmada:** el flujo de edición de Higgsfield exige clonar `apps-repos.higgsfield.ai`, host que no está en la lista de egreso permitido del entorno de chat. Esto no se resuelve desde acá; se resuelve con Claude Code local.

### Fuera de alcance
Rediseño del sitio. Está aprobado por la Matriz de Decisión y no se toca sin motivo de marca.

---

## 5. P10 — SISTEMA DE IMAGEN

**Estado:** nuevo · sin iniciar
**Bloquea:** P09 y todo el material comercial

### Objetivo
Construir el banco de imagen de Meridiano Capital y los criterios de uso, aplicando la doctrina ya definida en los Módulos 07, 08 y 14.

### Contexto
El sitio está aprobado por marca con cero imágenes. Pero el vacío no es de la web: alcanza fichas de propiedad, decks de inversores y propietarios, redes sociales y publicidad. Meridiano Capital le vende a inversores que no pueden visitar las propiedades — la imagen no es decoración, es el sustituto de la visita.

### 5.1 Segmentación por tipo de activo — la decisión estructural

No todo el portafolio admite el mismo tratamiento visual, y confundirlos tiene consecuencias legales, no solo estéticas.

| Tipo de activo | Unidades | Medio correcto |
|---|---|---|
| Terminado y en renta | 35 | **Fotografía real** |
| En pozo | 18 | **Render del desarrollador**, identificado como render |
| Ciudad, barrio, contexto | — | Fotografía real o imagen generada |
| Marca, atmósfera, abstracto | — | Imagen generada vía Módulo 14 |

### 5.2 Regla dura propuesta `[EXTENSIÓN]`

> **Ninguna imagen generada por IA puede presentarse como fotografía de un activo real, terminado o en construcción.**

El render arquitectónico de una unidad en pozo es práctica estándar y legítima **siempre que se identifique como render**. Una imagen generada por IA que aparente ser la fotografía de un departamento existente es publicidad engañosa, y el riesgo es mayor con un comprador extranjero que decide sin visitar y que puede reclamar al recibir algo distinto de lo que vio.

Con 18 de 53 unidades en pozo hasta 2029, esta distinción no es teórica: es el régimen visual de un tercio de la cartera durante los próximos dos años y medio.

Esto es una recomendación de gobernanza, no una regla oficial del Manual. Corresponde incorporarla al Módulo 08 si se aprueba.

### 5.3 Alcance
1. Definir el inventario de tomas necesarias por categoría.
2. Producir la fotografía real de los 3 edificios de Canarias y de Habitalis Mburucuyá.
3. Recopilar y catalogar los renders oficiales de los desarrolladores de las 18 unidades en pozo.
4. Producir la imagen de marca y contexto vía Módulo 14.
5. Definir criterios de uso, formatos y nomenclatura; cargarlos al Módulo 08.
6. Entregar el **banco mínimo viable** que desbloquea P09.

### 5.4 Herramienta disponible
La conexión con Higgsfield —que quedó bloqueada para el flujo web— sí está operativa para generación de imagen y video. Es la herramienta natural para el punto 4, alimentada por los prompts del Módulo 14.

### Entregables
Banco de imagen catalogado · criterios de uso incorporados al Módulo 08 · biblioteca de prompts de marca derivada del Módulo 14 · regla de honestidad visual, si se aprueba.

---

## 6. DATOS FALTANTES CONSOLIDADOS

**Bloquean P07**
- Superficie (m²) por unidad
- Valor y fecha de adquisición por unidad
- Renta vigente y estado de ocupación
- Desagregado de las 32 unidades de Canarias

**Bloquean el modelo financiero completo**
- Cronograma de pagos de obra de las 18 unidades en pozo
- Presupuesto de equipamiento por unidad a entregar

**Bloquean P09**
- Banco mínimo de imagen (P10)

**Verificaciones abiertas**
- Nomenclatura de Ventura Hassler (7D en piso 1 / 4D en piso 7)
- Historial fiscal de Campo Agreste S.A. de su etapa anterior

---

## 7. MAPA MAESTRO ACTUALIZADO

```
MERIDIANO CAPITAL  (operada por Campo Agreste S.A. · RUC 80093513-6)
│
├── 00 — GOBERNANZA Y ARQUITECTURA          Capa 1 CERRADA
├── 01 — ONBOARDING DE INVERSORES           PARCIAL — solo eslabón bancario
├── 02 — ADMINISTRACIÓN DE RENTAS           PRIORIDAD — 53 unidades a cargar
├── 03 — MODELOS DE ADQUISICIÓN             ACTIVO
├── 04 — SISTEMA CONTRACTUAL Y LEGAL        ACTIVO
├── 05 — COMERCIALIZACIÓN
│      ├── 05.A Cartera propia
│      └── 05.B Terceros
├── 06 — BRAND OS                           skill v1.1 vigente
├── 07 — POLÍTICA DE RENTABILIDAD           CHARTER LISTO · prioridad 1
├── 08 — CANARIAS: REPOSICIONAMIENTO        CHARTER LISTO · depende de 07
├── 09 — SITIO WEB                          CHARTER LISTO · depende de 10
└── 10 — SISTEMA DE IMAGEN                  CHARTER LISTO · prioridad 2
```
