# VERIFICACIÓN CONSOLIDADA Y PLAN DE PROYECTOS

**Fecha:** 24 de julio de 2026
**Alcance:** auditoría de consistencia de los cuatro documentos producidos + plan de creación de Proyectos

---

## 1. AUDITORÍA DE CONSISTENCIA

### 1.1 — Verificaciones superadas

| # | Verificación | Resultado |
|---|---|---|
| 1 | Suma de unidades por vehículo = 53 | ✅ 9+1+3+32+8 |
| 2 | Calendario de entregas = unidades no-Canarias | ✅ 21 = 53−32 |
| 3 | Unidades por vehículo en el calendario | ✅ Jumacabe 9 · WICA 1 · ARL 8 · Quintero 3 |
| 4 | Distribución por año (5/9/4/3) suma 21 | ✅ |
| 5 | Operativas + en obra = total | ✅ 35+18=53 |
| 6 | Cronología por RUC | ✅ Campo Agreste < Jumacabe < ARL < Quintero < Canarias < WICA |
| 7 | Copropiedad en Habitalis Villa Morra | ✅ Jumacabe 4 + WICA 1 = 5 unidades |
| 8 | Rendimiento Habitalis: USD 950×12 ÷ 120.000 | ✅ 9,5% bruto, coherente con el 8,08% base del Chat 01 |
| 9 | Módulos citados existen en la skill | ✅ verificado contra `references/` |
| 10 | Cadenas de dependencia sin ciclos | ✅ P10→P09 y P07→P08, independientes entre sí |

### 1.2 — ⚠ Error encontrado y corregido

**Conteo de unidades sin cochera.** El documento decía *"al menos 21 unidades sin cochera"*. El número correcto es **15**.

| Vehículo | Sin cochera |
|---|---|
| Jumacabe | 4 — Habitalis Mburucuyá 16D · Habitalis Villa Morra 2E, 6D, 7D |
| WICA | 0 |
| Quintero | 3 |
| ARL | 8 |
| Canarias | sin datos |
| **Total** | **15** |

**Origen del error:** confusión con el número 21, que corresponde a las unidades no pertenecientes a Canarias (53−32). Dos magnitudes distintas que quedaron cruzadas. Corregido en el registro patrimonial, con una tabla de totales verificados agregada para que no vuelva a pasar.

### 1.3 — Corrección de identidad digital

| Elemento | Grafías erróneas descartadas | Valor definitivo |
|---|---|---|
| Dominio | `meridiadocapital.net` · `meridianocapitall.net` | **meridianocapital.net** |
| Email | `juancastillo@…` | **juanjosecastillo@meridianocapital.net** |

Corregido en los charters. Estos son los valores para tarjetas, decks, contratos, firma de correo y DINAPI.

### 1.4 — Verificaciones que siguen abiertas

Ninguna es bloqueante, pero conviene cerrarlas antes de cargar datos al sistema de administración:

1. **Nomenclatura de Ventura Hassler** — 7D figura en piso 1 y 4D en piso 7. Si la convención del edificio asocia el número al piso, podrían estar invertidos. Verificar contra escritura.
2. **Historial fiscal de Campo Agreste S.A.** de su etapa anterior.
3. **Desagregado de Canarias** — tipología, piso, superficie, cocheras y renta de las 32 unidades. Es el bloque de datos más grande que falta.

---

## 2. INVENTARIO DE LO PRODUCIDO

| Documento | Contenido | Estado |
|---|---|---|
| `Chat_Architecture_Report_01.md` | 7 chats fuera de Proyecto · mapa maestro inicial · conflictos | Vigente |
| `Capa_01_Registro_Patrimonial_v3.md` | Arquitectura de 3 capas · 53 unidades · calendario hasta 2029 | Vigente · corregido |
| `Chat_Architecture_Report_02.md` | Chat del Proyecto (parcial) · P09 y P10 detectados | Vigente · captura incompleta |
| `Project_Charters_P07_P08_P09_P10.md` | Charters · secuenciamiento · datos faltantes | Vigente · corregido |
| `Prompt_Transferencia_Proyecto.md` | Paquete para correr el Master Prompt dentro del Proyecto | Listo para usar |

**Chats procesados:** 8 de 8 accesibles fuera del Proyecto, más el fragmento del chat del Proyecto.
**Proyectos identificados:** 11 nodos (00 a 10).
**Conflictos:** 1 resuelto vía P07 · 3 abiertos.

---

## 3. PLAN DE CREACIÓN DE PROYECTOS `[EXTENSIÓN]`

Once nodos no significan once Proyectos de Claude. Un Proyecto rinde cuando su base de conocimiento es coherente y su contexto no se diluye. Recomiendo **cinco Proyectos**, agrupando por afinidad de conocimiento y no por número de nodo.

Esto es una recomendación, no una regla del Master Prompt. El mapa maestro sigue siendo el mapa; los Proyectos son su contenedor operativo.

### PROYECTO 1 — MERIDIANO CAPITAL · Gobernanza y Estructura
**Nodos:** 00 + 01
**Contiene:** arquitectura de tres capas · Campo Agreste · las 5 S.A. · registro patrimonial · flujo de onboarding de inversores extranjeros · nota de presentación bancaria
**Documentos base:** `Capa_01_Registro_Patrimonial_v3.md`

### PROYECTO 2 — MERIDIANO CAPITAL · Administración de Rentas
**Nodos:** 02 + 04
**Contiene:** las 9 planillas · contratos residencial y oficinas · anexos de inventario y acta de entrega · seguros · plantilla de reclamo a entes de servicios · carga de las 53 unidades
**Prioridad alta:** es el sistema que sostiene la operación diaria y hoy está vacío de datos reales

### PROYECTO 3 — MERIDIANO CAPITAL · Inversión y Rentabilidad
**Nodos:** 03 + 07 + 08
**Contiene:** Política de Rentabilidad Objetivo · modelos de adquisición y reposicionamiento · programa de Canarias · calendario de entregas y de pagos de obra
**Documentos base:** `Project_Charters_P07_P08_P09_P10.md` (secciones P07 y P08)

### PROYECTO 4 — MERIDIANO CAPITAL · Marca y Brand OS
**Nodos:** 06
**Contiene:** skill `meridiano-capital-identity` · Brand Guidelines · brand book · arquitectura Meridiano ↔ Urbannit · Matriz de Decisión · test del Módulo 13 sobre el portafolio
**Es el Proyecto donde debe correrse el prompt de transferencia**, si el chat *Estrategia de Rentabilidad Inmobiliaria* vive ahí

### PROYECTO 5 — MERIDIANO CAPITAL · Digital, Imagen y Comercialización
**Nodos:** 05 + 09 + 10
**Contiene:** sitio web · sistema de imagen · contenido comercial de ambas carteras · redes · Higgsfield
**Documentos base:** `Project_Charters_P07_P08_P09_P10.md` (secciones P09 y P10) · `Chat_Architecture_Report_02.md`

### Activos transversales — copiar en más de un Proyecto
- Skill `meridiano-capital-identity` → **todos**
- Registro patrimonial → Proyectos 1, 2, 3
- Calendario de entregas → Proyectos 2, 3, 5
- Charters → Proyectos 3 y 5

---

## 4. ESTADO DE PREPARACIÓN

| Ítem | Estado |
|---|---|
| Capa societaria definida | ✅ |
| Registro patrimonial completo y verificado | ✅ |
| Calendario de entregas hasta 2029 | ✅ |
| Identidad digital confirmada | ✅ |
| Charters de P07/P08/P09/P10 | ✅ |
| Secuenciamiento y rutas críticas | ✅ |
| Prompt de transferencia al Proyecto | ✅ |
| Chat *Estrategia de Rentabilidad Inmobiliaria* completo | ⬜ pendiente |
| Datos financieros por unidad | ⬜ pendiente |
| Cronograma de pagos de obra | ⬜ pendiente |

**Listo para crear los Proyectos.** Los tres pendientes no bloquean la creación: se cargan dentro de los Proyectos una vez creados.

---

## 5. SECUENCIA RECOMENDADA

1. Crear los cinco Proyectos y cargar en cada uno sus documentos base.
2. Dentro del **Proyecto 4**, abrir conversación nueva y correr `Prompt_Transferencia_Proyecto.md` para recuperar el chat completo.
3. Con lo que aparezca, iniciar **P07** — es el que desbloquea decisiones de capital.
4. En paralelo, iniciar **P10**, que bloquea todo el material comercial.
5. **P09** apenas P10 entregue el banco mínimo de imagen.
6. **P08** cuando P07 tenga umbrales definidos.
