Estado: CURRENT — Fase A (Auditoría y Descubrimiento), primera entrega
Fuente original: prompt maestro "URBANNIT — LEGAL & OPERATIONS OS" (founder, 2026-08-12) + `Contrato GOHOST - Prestación Servicio 20.08.25.pdf` (aportado por el founder, 2026-08-12)
Dominio: LEGAL / OPERATIONS / BUSINESS (proyecto Urbannit)
Incorporado: 2026-08-12

# Urbannit — Legal & Operations OS · Fase A: Diagnóstico y Arquitectura

> **Regla seguida en todo este documento** (punto 27 y 30 del prompt maestro): esto es una auditoría, no un set de contratos. No se redacta ninguna cláusula contractual todavía. Donde falta información se marca explícitamente `[DECISIÓN URBANNIT PENDIENTE]`, `[VALIDACIÓN LEGAL REQUERIDA]`, `[VARIABLE ECONÓMICA PENDIENTE]` u `[DECISIÓN OPERATIVA PENDIENTE]` — nunca se completa por suposición. Donde una afirmación es un hecho legal citado por un tercero (no verificado por un abogado paraguayo a pedido de Meridiano), se lo señala así explícitamente (punto 19 del prompt maestro: requisito legal vs. recomendación de buena práctica vs. decisión comercial vs. cláusula propuesta).

## Fuentes analizadas en esta Fase A

1. **`Contrato GOHOST - Prestación Servicio 20.08.25.pdf`** — contrato BORRADOR de prestación de servicio entre un propietario y **GoHost** (nombre comercial de **LosBra SRL**, RUC 80090133-9), administradora de renta temporal que opera en el mismo mercado (Asunción) que Urbannit. Aportado por el founder el 2026-08-12, encontrado en la misma carpeta que otros materiales de "STAY WISE". **Es un documento de un tercero/competidor** — se usa aquí como referencia de estructura y de qué exige el mercado paraguayo real, nunca se copia ni se adapta literalmente (no es propiedad de Meridiano/Urbannit).
2. Las dos propuestas comerciales de Urbannit ya construidas y commiteadas (D-056, 2026-08-12): `Urbannit_Propuesta_Propietarios` y `Urbannit_Propuesta_Gestion_Temporal` — leídas completas desde sus generadores (`production/generadores/build_urbannit_propuesta_*.js`), no solo el PDF final.
3. `knowledge-base/brand/10-arquitectura-meridiano-urbannit.md` — arquitectura de marca, reglas de convivencia, endoso obligatorio (D-014).
4. `knowledge-base/business/06-estructura-societaria-y-portfolio.md` — estructura societaria real de Meridiano/Urbannit.
5. `knowledge-base/operations/03-tarifario.md` — tarifario vigente de administración tradicional de Meridiano.
6. `knowledge-base/legal/01-p04-manual-compliance.md` — manual PLA/FT de Meridiano Capital ante SEPRELAD.
7. `governance/decisions/DECISION_REGISTER.md` — D-014, D-043, D-045, D-051, D-056, D-057, D-058.

**Nota sobre "STAY WISE"**: la carpeta de origen del contrato GOHOST también contiene material rotulado "STAY WISE" (incluyendo un logo propio). Esto **ya está resuelto en el repo**, no es una duda nueva: por D-043, "STAY WISE" y "Meridiano Inmobiliaria" son nombres de trabajo alternativos usados en material interno para Urbannit y Meridiano Capital respectivamente — no son marcas ni entidades distintas (`brand/10-arquitectura-meridiano-urbannit.md`). Cualquier documento de esa carpeta se trata como material de Urbannit. No se leyeron los demás archivos de esa carpeta (`Presentacion Urbannit.pdf`, `Propuesta de gestión.pdf`, la variante "STAY WISE (MODELO 1)", etc.) porque no fueron adjuntados a este pedido — si el founder quiere que se incorporen a la próxima fase, hay que aportarlos explícitamente.

---

## 1. DIAGNÓSTICO — qué tenemos

### 1.1 Clasificación de la documentación existente

| Documento | Clasificación | Por qué |
|---|---|---|
| Contrato GOHOST (competidor) | **Recomendable como benchmark** — no aplicable como propio | Es de un tercero (LosBra SRL); no se puede adoptar ni adaptar sin reescritura legal propia. Sirve para ver qué cláusulas exige la práctica real del mercado paraguayo de renta temporal |
| `Urbannit_Propuesta_Propietarios` | **Vigente pero incompleto** | Es un documento **comercial** (explica el proceso paso a paso) — no tiene fuerza vinculante, no asigna responsabilidad legal, no define plazo, rescisión, seguro ni jurisdicción |
| `Urbannit_Propuesta_Gestion_Temporal` | **Vigente pero incompleto** | Explica el modelo económico (comisión, ejemplo numérico de liquidación) pero tampoco es un contrato |
| Contrato de administración de alquiler temporal (Urbannit ↔ Propietario) | **Faltante** | No existe ningún documento contractual real — confirmado por ausencia total en el repo |
| Anexo de inventario | **Faltante** | Las propuestas mencionan equipamiento (ropa de cama, cocina, etc.) como recomendación, no como anexo firmado con valor probatorio |
| Reglamento/T&C de huéspedes | **Faltante** | No existe ningún documento para el huésped (check-in/out, daños, cancelaciones, conducta) |
| Política de seguro de responsabilidad civil | **Faltante** | No existe — GoHost sí lo exige contractualmente (cláusula 10ª) |
| Constancia de registro SENATUR/Registur | **Faltante / potencialmente riesgoso** | No hay evidencia en el repo de que las propiedades gestionadas o a gestionar por Urbannit estén (o vayan a estar) inscriptas |
| `knowledge-base/legal/01-p04-manual-compliance.md` (PLA/FT) | **Vigente pero incompleto respecto de Urbannit** | Cubre la actividad de Meridiano Capital en general (desarrollo, intermediación, administración) pero no menciona explícitamente huéspedes/inquilinos de renta temporal como sujetos de debida diligencia |

### 1.2 Hechos societarios ya confirmados en el repo (no se inventa nada acá)

- **Urbannit no es una sociedad aparte.** Opera bajo **Campo Agreste S.A., RUC 80093513-6** — la misma entidad que opera la marca Meridiano Capital (`business/06-estructura-societaria-y-portfolio.md`). Por analogía directa con cómo firma GoHost ("P/ LosBra SRL, RUC 80090133-9" — nombre comercial GoHost, firmante real LosBra SRL), el firmante legal de cualquier contrato de Urbannit con un propietario **debería ser Campo Agreste S.A.**, actuando bajo el nombre comercial "Urbannit, gestionado por Meridiano Capital". Esto es una **inferencia directa de un hecho ya registrado** en el repo, no una decisión nueva — pero **debe confirmarla el founder explícitamente** antes de que aparezca en un contrato real, por eso se mantiene en la lista de decisiones pendientes de este documento (ver §6, D-URB-01).
- Urbannit figura explícitamente como **"sub-marca endosada, sin activos asignados todavía"** dentro de la Cartera A de 53 unidades — es decir, hoy Urbannit apunta a **propietarios externos (terceros)**, no a unidades propias del portfolio de Meridiano.
- Campo Agreste S.A. es **sujeto obligado ante SEPRELAD** (Res. 201/2020, sector inmobiliario) por su actividad de desarrollo/intermediación/administración (`legal/01-p04-manual-compliance.md`). La actividad de Urbannit (administración de renta temporal de terceros) encaja dentro de esa misma actividad regulada, aunque el manual P04 no la nombra explícitamente todavía.

### 1.3 Comparación económica con el mercado real (uso interno — ver nota RN-04 abajo)

| | Urbannit | GoHost (competidor real, mismo mercado) |
|---|---|---|
| Comisión | **20% sobre el precio de la noche** (D-056/D-057, ejemplo interno con 70 USD/noche) | **11% IVA incluido**, sobre el bruto de ocupación mensual |
| Tarifa de limpieza | A cargo del huésped, 20–30 USD por estadía, no reduce el ingreso del propietario | No especifica un monto — la trata como parte del servicio a huéspedes (cláusula 2.3) |
| Reposición de blanquería/utensilios dañados | No definido en las propuestas actuales | A cargo del propietario, con informe detallado de GoHost (cláusula 6.3) |
| Seguro de responsabilidad civil | No mencionado | Obligatorio, GoHost lo contrata, el propietario reembolsa el costo (cláusula 10ª) |
| Plazo / exclusividad | No mencionado | 1 año, renovación automática, exclusividad a favor de GoHost (cláusula 3ª) |
| Rescisión | No mencionado | Cualquiera de las partes, 60 días de preaviso, sin penalidad (cláusula 5ª) |

La comisión de Urbannit es **casi el doble** de la de GoHost. No es mi lugar recomendar cambiarla — es una decisión comercial del founder — pero es un dato relevante para justificar frente al propietario el valor diferencial de Urbannit (respaldo de Meridiano Capital, transparencia, etc.), y debería quedar documentado internamente por qué la diferencia existe.

> **Nota de gobernanza (RN-04, ya vigente y reconfirmada el 2026-08-12 en D-057):** este dato (comisión exacta, comparación con competidores) es de **uso interno** — nunca se publica en el sitio web ni en material comercial masivo. Este documento vive en `projects/`, no en una pieza de marca pública.

---

## 2. QUÉ FALTA

### Legal / contractual
- **El contrato real de administración de alquiler temporal (Urbannit ↔ Propietario)** — el vacío más grande y más urgente. Hoy solo existen documentos comerciales sin fuerza vinculante.
- Anexo de inventario con valor probatorio (equivalente al "ANEXO I" de GoHost).
- Cláusula/política de seguro de responsabilidad civil.
- Cláusula de plazo y exclusividad.
- Cláusula de rescisión.
- Cláusula de cesión del contrato.
- Cláusula de relación laboral (dejar explícito que el personal de Urbannit no tiene vínculo con el propietario — GoHost lo hace en su cláusula 8ª, es una protección legal real para el propietario y para la empresa).
- Reglamento/T&C para huéspedes (check-in/out, daños, cancelaciones, conducta, mascotas, fiestas, objetos olvidados).
- Confirmación formal de quién firma en nombre de Urbannit (ver D-URB-01 abajo).

### Regulatorio / compliance
- `[VALIDACIÓN LEGAL REQUERIDA]` Estado de inscripción SENATUR/Registur de las propiedades que Urbannit ya gestiona o va a gestionar. El contrato de GoHost cita explícitamente la **Resolución N° 170/2024 de la Secretaría Nacional de Turismo (SENATUR)**, que exige inscribir en el Registro Nacional de Turismo (Registur) todo inmueble destinado a alojamiento temporal. Esta cita proviene del contrato de un tercero — no fue verificada de forma independiente por un abogado paraguayo a pedido de Meridiano, pero es una norma real y específica del rubro que Urbannit debe confirmar si le aplica igual.
- `[VALIDACIÓN LEGAL REQUERIDA]` Si el manual P04 (PLA/FT) debe extenderse explícitamente a huéspedes/inquilinos de renta temporal, o si ya los cubre por el alcance general de "sujeto obligado" de Campo Agreste S.A.
- `[VALIDACIÓN LEGAL REQUERIDA]` Si aplica alguna normativa específica de seguros para renta temporal en Paraguay, más allá de lo que GoHost hace por decisión comercial propia (no necesariamente por obligación legal — el contrato de GoHost no cita una norma para esa cláusula, a diferencia de la cláusula SENATUR que sí cita una resolución específica).

### Operativo
- Proceso de alta de propietario formalizado con responsables (hoy está descrito como experiencia comercial en la Propuesta de trabajo para propietarios, no como proceso interno con checklist y dueño de cada paso).
- Sistema de rendición de cuentas con formato fijo (hoy es una promesa de transparencia en la propuesta comercial, no un formato de liquidación estandarizado y versionado).
- Definición de quién asume el costo de reposición de blanquería/utensilios dañados o perdidos por huéspedes — GoHost lo resuelve explícitamente a favor de sí mismo (cláusula 6ª); Urbannit no lo tiene definido.

### Económico
- `[VARIABLE ECONÓMICA PENDIENTE]` Si el 20% de comisión de Urbannit ya incluye IVA o es neto de impuestos — GoHost es explícito ("11% IVA incluido"); la documentación interna de Urbannit no lo aclara. Esto es relevante porque D-045 ya fijó el IVA de renta temporal en 10%, y esa cifra debería conciliar con cómo se presenta la comisión en el futuro contrato.
- `[VARIABLE ECONÓMICA PENDIENTE]` Quién asume el costo del seguro de responsabilidad civil, si se decide exigirlo (en GoHost lo asume el propietario, quien reembolsa a GoHost).

---

## 3. RIESGOS — primer barrido

*(No es la Matriz de Riesgos completa del punto 13 del prompt maestro — esa es un entregable de una fase posterior, una vez que exista al menos un borrador de contrato sobre el cual evaluar riesgo por cláusula. Esto es una lista de alerta temprana.)*

| Riesgo | Por qué importa ahora |
|---|---|
| **Legal — operar sin contrato formal** | Urbannit ya tiene dos documentos comerciales listos para enviar a propietarios reales (D-057 los automatiza) pero ningún contrato vinculante. Si un propietario real acepta la propuesta hoy, no hay marco legal que resuelva una disputa por daños, impago o uso indebido. |
| **Regulatorio — registro SENATUR/Registur** | Si las propiedades no están inscriptas y esa obligación aplica igual que a GoHost, Urbannit podría estar exponiendo a sus propietarios a sanciones sin haberlos advertido. |
| **Responsabilidad civil** | Sin cláusula de seguro definida, un daño a huéspedes o de huéspedes hacia la propiedad no tiene vía de cobertura clara ni un responsable económico designado. |
| **Laboral** | Si Urbannit contrata personal de limpieza/logística sin dejar por escrito (como hace GoHost) que no hay vínculo laboral con el propietario, el propietario podría quedar expuesto a un reclamo laboral que no le corresponde. |
| **Marca** | Cualquier contrato de Urbannit que no incluya el endoso "gestionado por Meridiano Capital" viola una regla ya vigente (D-014, `brand/10-arquitectura-meridiano-urbannit.md`) — riesgo bajo en sí, pero real si se redacta un contrato fuera de este proceso. |
| **Consistencia comercial** | La Propuesta de Gestión de Alquiler Temporal ya comunica públicamente (a nivel comercial, al propietario) el ejemplo numérico con comisión del 20%. El futuro contrato no puede fijar una comisión distinta a la ya comunicada, o hay riesgo de reclamo por incumplimiento de expectativas. |

---

## 4. ARQUITECTURA — los 10 niveles (propuesta de estructura, sin poblar todavía)

| Nivel | Qué es | Estado hoy en el repo |
|---|---|---|
| 01 — Estrategia | Qué es Urbannit y cómo funciona | Existe parcialmente — `brand/10-arquitectura-meridiano-urbannit.md` (marca) + introducción de las dos propuestas comerciales (proceso) |
| 02 — Modelo de negocio | Cómo gana dinero Urbannit | Existe — `Urbannit_Propuesta_Gestion_Temporal` lo explica completo, con ejemplo numérico (uso interno, no público por RN-04) |
| 03 — Organización | Quién hace qué | Existe parcialmente — la propuesta de propietarios distingue "Operativa local" vs. "Gestión digital", pero no hay organigrama ni matriz de responsabilidades formal |
| 04 — Procesos | Cómo se ejecuta cada operación | Existe como narrativa comercial (10 pasos en la introducción de la Propuesta de trabajo para propietarios), no como proceso interno con checklists y responsables |
| 05 — Contratos | Cómo se formaliza cada relación | **Falta por completo** — ver §2 |
| 06 — Reglamentos | Cómo se regulan las operaciones | **Falta por completo** |
| 07 — Políticas | Qué reglas internas existen | **Falta por completo** (salvo el manual P04 de PLA/FT, que es de Meridiano en general) |
| 08 — Formularios | Qué información se recopila | Existe parcialmente — el formulario de contacto del sitio (D-051/D-057/D-058) capta la primera consulta, pero no hay ficha de relevamiento de propiedad ni ficha de huésped |
| 09 — Checklists | Cómo se controla la ejecución | **Falta por completo** como documento operativo — el contenido existe como texto corrido en la Propuesta de trabajo para propietarios (equipamiento, preparación) pero no como checklist accionable |
| 10 — Reportes | Cómo se mide y documenta la operación | Existe como promesa comercial ("liquidación mensual con el detalle completo") pero no como formato de reporte definido |

---

## 5. MASTER DOCUMENT INDEX

Nomenclatura propuesta (punto 20 del prompt maestro), consistente con el resto del repo: `URB-<categoría>-<número>`.

| Código | Documento | Categoría | Estado | Prioridad |
|---|---|---|---|---|
| URB-CORP-001 | Manual de organización de Urbannit (Nivel 03) | Corporativo | Falta | P1 |
| URB-CORP-002 | Matriz de responsabilidades (RACI) | Corporativo | Falta | P1 |
| URB-CORP-003 | Política de confidencialidad y datos personales | Corporativo | Falta | P2 |
| URB-CON-001 | **Contrato de administración de alquiler temporal** (Urbannit ↔ Propietario) | Contrato — propietario | ✅ **Borrador v1.0** (D-059, 2026-08-12) — `production/entregables/Urbannit_Contrato_Administracion_BORRADOR.docx/.pdf`. **No firmar** — ver `01-notas-urb-con-001.md` para qué está confirmado vs. propuesto vs. pendiente de validación legal | **P0** |
| URB-CON-002 | Anexo I — Inventario del inmueble | Contrato — propietario | Falta — referenciado por URB-CON-001, siguiente paso natural | P0 |
| URB-CON-003 | Anexo — Tarifas y comisiones | Contrato — propietario | Falta | P0 |
| URB-CON-004 | Acta de entrega / recepción del inmueble | Contrato — propietario | Falta | P1 |
| URB-CON-005 | Términos y condiciones de estadía (huésped) | Contrato — huésped | Falta | P0 |
| URB-CON-006 | Contrato/acuerdo con proveedores de limpieza y mantenimiento | Contrato — proveedor | Falta | P1 |
| URB-REG-001 | Reglamento de huéspedes | Reglamento | Falta | P0 |
| URB-REG-002 | Reglamento de mantenimiento e inventario | Reglamento | Falta | P2 |
| URB-POL-001 | Política de seguro de responsabilidad civil | Política | Falta — depende de `[VALIDACIÓN LEGAL REQUERIDA]` | P0 |
| URB-POL-002 | Política de registro SENATUR/Registur | Política | Falta — depende de `[VALIDACIÓN LEGAL REQUERIDA]` | P0 |
| URB-POL-003 | Extensión del manual P04 (PLA/FT) a huéspedes de renta temporal | Política | Falta — depende de `[VALIDACIÓN LEGAL REQUERIDA]` | P1 |
| URB-FOR-001 | Ficha de relevamiento de propiedad | Formulario | Falta (existe como narrativa en la Propuesta de propietarios, no como formulario estructurado) | P1 |
| URB-FOR-002 | Ficha de alta de huésped | Formulario | Falta | P1 |
| URB-CHK-001 | Checklist de preparación y equipamiento de la propiedad | Checklist | Falta (contenido existe como texto en la Propuesta de propietarios) | P1 |
| URB-CHK-002 | Checklist de check-in / check-out | Checklist | Falta | P1 |
| URB-CHK-003 | Checklist de turnover (limpieza entre estadías) | Checklist | Falta | P2 |
| URB-REP-001 | Formato de liquidación mensual al propietario | Reporte | Falta (contenido descrito en la Propuesta de Gestión de Alquiler Temporal, sin formato fijo) | P0 |

---

## 6. DECISIONES DEL FOUNDER — ✅ resueltas 2026-08-12 (D-059)

Siguiendo el punto 31 del prompt maestro ("al finalizar cada fase: identifica decisiones pendientes, solicita aprobación, solo después continúa"), el founder respondió las 5 preguntas el mismo día. Registradas en `governance/decisions/DECISION_REGISTER.md` como D-059 (resuelve U-027, U-029, U-030, U-031; avanza parcialmente U-028):

- **D-URB-01** — ✅ Campo Agreste S.A. (RUC 80093513-6) firma en nombre de "Urbannit, gestionado por Meridiano Capital".
- **D-URB-02** — ✅ Sí se contrata seguro de responsabilidad civil. El founder pidió verificar qué corresponde en Paraguay antes de fijar el detalle — investigado (ver `01-notas-urb-con-001.md` §4.2): no se encontró mandato legal específico, el monto queda como placeholder pendiente de validación por un abogado paraguayo real.
- **D-URB-03** — ✅ NO se registran las propiedades en SENATUR/Registur por el momento — decisión operativa consciente, no un olvido. La cláusula se omitió del contrato a propósito.
- **D-URB-04** — ✅ El 20% de comisión es bruto e incluye IVA.
- **D-URB-05** — ✅ Redactar el contrato ahora, sin esperar a resolver el resto de las validaciones legales.

**Resultado**: primer borrador de `URB-CON-001` construido y verificado visualmente — ver `01-notas-urb-con-001.md` para el detalle completo de qué quedó confirmado, qué es propuesta sin confirmar, y qué sigue pendiente de validación legal.

---

## 7. ROADMAP propuesto

Siguiendo el orden del prompt maestro (punto 26), adaptado al alcance real disponible hoy:

1. ~~**Fase A — Auditoría**~~ ✅ Esta entrega.
2. **Fase B — Arquitectura completa**: organigrama, matriz de responsabilidades (RACI), matriz de autorizaciones — no depende de las validaciones legales pendientes, se puede avanzar en paralelo.
3. **Fase C — Modelo operativo**: formalizar los procesos que hoy solo existen como narrativa comercial (alta de propietario, alta de huésped, turnover, rendición de cuentas) en checklists y formularios accionables.
4. **Fase D — Mapa de riesgos completo**: matriz de riesgos formal (probabilidad/impacto/responsable/prevención), una vez exista al menos un borrador de contrato sobre el cual evaluar cláusula por cláusula.
5. **Fase E — Mapa contractual**: relaciones Urbannit↔Propietario, Urbannit↔Huésped, Urbannit↔Proveedor, con objeto/responsabilidades/pagos/riesgos para cada una.
6. **Fase F — Diseño de contratos**: recién acá se redacta el primer borrador de `URB-CON-001` (contrato de administración) — **bloqueada** hasta resolver D-URB-01, D-URB-02, D-URB-03, D-URB-04 (o decidir avanzar con placeholders, D-URB-05).
7. **Fase G–L** — reglamentos, políticas, formularios, checklists, protocolos, auditoría final — según el prompt maestro, en ese orden.

**No se avanza a la Fase B sin antes recibir del founder las decisiones de la sección 6**, o al menos una indicación explícita de cuáles de ellas se quieren dejar como `[DECISIÓN URBANNIT PENDIENTE]` / `[VALIDACIÓN LEGAL REQUERIDA]` dentro del propio borrador (D-URB-05).
