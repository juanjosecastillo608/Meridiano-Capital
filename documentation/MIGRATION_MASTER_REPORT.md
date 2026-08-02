# MERIDIANO CAPITAL — MIGRATION MASTER REPORT

**Estado: PROPUESTA — pendiente de tu aprobación antes de iniciar la fase de BUILD.**
Nada de lo que este reporte propone en las Fases 6-12 se ha implementado todavía. Lo único que existe físicamente en el repo a la fecha de este reporte es lo de las Fases 1-4 originales (`inventory/`, `knowledge-base/`, `governance/decisions/DECISION_REGISTER.md`, `governance/decisions/REQUIREMENTS.md`) y la app funcional (`app/`), todo generado en el turno anterior. Este reporte añade el análisis de las Fases 4 (reclasificada)-12 y dos carpetas nuevas de bajo riesgo (`00_RAW_MIGRATION/`, este mismo archivo) — no toca, mueve ni sobrescribe nada existente.

---

## 0 · Resumen ejecutivo

- Se migró y reconstruyó (no resumió) el conocimiento de las 3 Claude Skills disponibles: **35 recursos fuente**, **34 documentos de knowledge base** en 7 dominios, **26 decisiones CURRENT + 2 HISTORICAL + 3 PROPOSED + 11 UNRESOLVED**, **37 requisitos** (v1), y una **app funcional** (sitio + calculadora de rentabilidad conectada de verdad, probada en navegador).
- Esta fase añade: Requirements Register v2 (9 categorías), Contradiction Register (8 contradicciones, incluyendo **una nueva que no se había detectado antes** — ver C-007), Knowledge Classification, System Architecture propuesta, Source of Truth Map, Skill Registry (8 candidatas), Workflow Registry (4 candidatos), Memory Architecture (diseño), y el Implementation Roadmap de 10 fases.
- **Punto crítico que planteaste y que hay que resolver antes de seguir**: no tengo ninguna forma técnica de acceder a tus conversaciones de Claude.ai. Ver sección 1.
- **Nada se ha destruido ni sobrescrito.** Todo lo nuevo es aditivo. La reestructuración de carpetas que se propone en la Fase 7 (arquitectura) es solo una propuesta — no se ejecuta hasta que la apruebes.

---

## 1 · La pieza que falta: estrategia de material RAW

Tenés razón en señalar esto como el hueco más importante. Para ser preciso sobre lo que puedo y no puedo hacer:

- **No tengo ningún tool, conector o API en este entorno que me dé acceso al historial de conversaciones de Claude.ai.** No es una cuestión de permisos que puedas habilitarme — la capacidad simplemente no existe en este entorno de Claude Code. Todo lo migrado hasta ahora salió de las 3 skills ya destiladas (`meridiano-capital-identity`, `meridiano-investor-journey`, `meridiano-rentabilidad`), que son la mejor fuente disponible pero **no son las conversaciones originales** — son su resultado final, ya sin el razonamiento intermedio, las versiones descartadas ni el "por qué" completo de cada decisión (salvo cuando el propio material dejó rastro explícito, como los 10 refinamientos de rentabilidad).
- Creé `00_RAW_MIGRATION/` (vacía, con instrucciones) siguiendo exactamente el pipeline que propusiste: **Claude Chat → export → `00_RAW_MIGRATION/` → análisis → resto del pipeline**. Instrucciones detalladas de cómo exportar (Settings → Account → Export data en claude.ai, o copiar/pegar hilos puntuales) están en `00_RAW_MIGRATION/README.md`.
- **Regla de no-destrucción aplicada a esta carpeta**: nunca se edita ni se borra. Cuando pongas material ahí, lo proceso así: (a) si confirma algo ya migrado, anoto la fuente adicional sin duplicar; (b) si agrega contexto nuevo (el "por qué" de algo), lo sumo a `DECISION_REGISTER.md` como HISTORICAL; (c) si **contradice** algo ya migrado, lo documento en el Contradiction Register y te pregunto explícitamente cuál versión vale — nunca lo resuelvo solo.
- **Recomendación**: no esperes a tener el export completo para aprobar el resto de este reporte. La arquitectura, los registros y el roadmap de las Fases 4-12 son válidos independientemente de cuánto material RAW termine llegando — están diseñados para poder absorber material nuevo sin rehacerse.

---

## 2 · La visión más grande — nota sobre alcance

Registrado y reflejado en la Fase 7 (Arquitectura) y Fase 8 (Source of Truth): el destino no es solo Meridiano Capital, sino un **Business System** que eventualmente cubre Meridiano Capital + Urbannit + Marketing System + Investment System + Operations System + AI System + Production Layer + múltiples agentes/skills/workflows.

Aplico tu regla tal como la diste: **"Migrar el conocimiento, no necesariamente la estructura."** Por eso:
- El *conocimiento* ya migrado (`knowledge-base/`) es válido sin importar cómo se reorganicen las carpetas después.
- La *arquitectura* que propongo en la Fase 7 está diseñada para ser agnóstica de marca/negocio desde el día 1 — Meridiano Capital es la primera instancia de un patrón reutilizable, no el patrón en sí.
- Urbannit ya se trató en el material como una marca endosada distinta con su propia identidad parcial (`knowledge-base/brand/10-arquitectura-meridiano-urbannit.md`) — es la prueba de que el sistema ya necesita soportar más de una marca, incluso hoy.

---

## FASE 4 (v2) — REQUIREMENTS REGISTER

Reclasificación completa de los 37 requisitos ya extraídos (v1, en `governance/decisions/REQUIREMENTS.md`) en las 9 categorías pedidas, más los nuevos requisitos de SECURITY, SCALABILITY y FUTURE que v1 no cubría explícitamente. Cada fila enlaza a su origen real — nada se inventó de cero, salvo SEC/SCA/FUT donde se marca explícitamente como inferencia razonada, no como regla ya dicha en el material.

**Prioridad**: P0 crítico · P1 alto · P2 medio · P3 bajo · P4 archivo.
**Estado**: `IMPLEMENTADO` (ya construido y probado) · `VIGENTE` (regla activa, no requiere construcción) · `PENDIENTE` (por construir) · `BLOQUEADO` (requiere decisión externa primero).

### 4.1 BUSINESS REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| BUS-01 | Modelo A (comisión 5,5%) y Modelo B (fees+carry) nunca se mezclan en una misma propuesta/cálculo | RN-01, D-016 | P0 | VIGENTE | — |
| BUS-02 | Nunca mostrar comisión 5,5% en materiales de coinversión ni fees/carry en materiales de inversión individual | RN-02 | P0 | VIGENTE | BUS-01 |
| BUS-03 | Selección automática simple/compuesto del hurdle según horizonte (≤24 / >24 meses) | RN-03, D-018 | P1 | IMPLEMENTADO (en `knowledge-base/business/03-modelo-coinversion.md`, no en código todavía) | — |
| BUS-04 | Cédula desacoplada de la inversión vía S.A. + representación legal/síndico de Meridiano (USD 350/mes) | RN-05, D-017 | P0 | VIGENTE | — |
| BUS-05 | El journey de 6 etapas debe estar soportado por la red de aliados nombrada | RN-06 | P1 | PENDIENTE (ownership operativo sin definir, ver OPS-04) | OPS-04 |
| BUS-06 | Fijar ticket mínimo explícito para coinversión | U-004 | P2 | BLOQUEADO — requiere decisión del founder | — |
| BUS-07 | Confirmar cifras finales de fee/hurdle/carry (hoy marcadas "[deck]") | U-005 | P1 | BLOQUEADO — requiere confirmación de negocio | — |

### 4.2 FUNCTIONAL REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| FUN-01 | La app debe permitir calcular yield bruto/neto de una propiedad dado clase, precio y renta mensual | RT-01 | P0 | IMPLEMENTADO (`production/app/backend/server.py` → `/api/calcular/renta`, probado en navegador) | TEC-01 |
| FUN-02 | La app debe permitir capturar un lead (nombre, email, país, mensaje) y persistirlo | derivado de RT-03/U-002 | P0 | IMPLEMENTADO (`/api/contacto`, probado en navegador) | — |
| FUN-03 | Todo resultado de cálculo de renta debe mostrar las advertencias de integridad de datos (D-001/D-002) junto al número | RT-06 | P0 | IMPLEMENTADO (campo `advertencias` en la respuesta + banner visible en UI) | INV-related decisions |
| FUN-04 | Exponer también reventa, reventa-temprana y retorno-combinado como funciones de cálculo consultables | RT-01 (implícito, la calculadora ya los tiene) | P1 | IMPLEMENTADO en API (`/api/calcular/reventa`, `/reventa-temprana`, `/combinado`), SIN UI todavía | FUN-01 |
| FUN-05 | Presentar siempre 3 escenarios (pesimista/base/optimista) antes de mostrar cifras a un inversor | RI-03 | P1 | PENDIENTE (la API calcula un escenario por llamada; falta orquestar 3 llamadas + UI comparativa) | FUN-01 |
| FUN-06 | El formulario de contacto debe validar campos obligatorios antes de enviar | implícito en el sitio original | P1 | IMPLEMENTADO (validación cliente ya existente, preservada) | — |

### 4.3 TECHNICAL REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| TEC-01 | La calculadora debe implementar exactamente la metodología documentada (TIR doble, 4 niveles netos, período de trabajo variable) | RT-01 | P0 | IMPLEMENTADO — pero **con las contradicciones D-001/D-002/D-003 sin resolver dentro de esa misma lógica** | Resolver D-001, D-002, D-003 |
| TEC-02 | Todos los parámetros de mercado deben leerse desde config, nunca hardcodearse en la lógica | RT-02, D-004 | P1 | PENDIENTE — 2 violaciones activas (costo de limpieza, `meses_hasta_pre_pozo`) | — |
| TEC-03 | El servidor de la app no debe requerir dependencias externas (`pip install`) para la primera versión funcional | decisión tomada en el turno de BUILD anterior | P1 | IMPLEMENTADO (stdlib-only `http.server`) | — |
| TEC-04 | Preservar los custom properties CSS del sitio de referencia como design tokens | RT-04 | P1 | IMPLEMENTADO (CSS `:root` variables preservadas sin cambios) | — |
| TEC-05 | Reemplazar enlaces muertos del footer por rutas reales | RT-07, U-010 | P2 | PARCIALMENTE IMPLEMENTADO (Urbannit→#portafolio, Coinversión/Recursos→#contacto; no son páginas dedicadas reales todavía) | — |
| TEC-06 | Definir hosting/dominio/proveedor de formularios de producción | RT-08, U-011 | P2 | BLOQUEADO — decisión de negocio pendiente | — |
| TEC-07 | Reemplazar la persistencia de contactos en archivo plano (`contactos.jsonl`) por un sistema real (CRM/email) antes de producción | inferido del prototipo actual | P1 | PENDIENTE | TEC-06 |

### 4.4 BRAND REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| BRA-01 | Nunca recrear el logo — usar únicamente los SVG fuente | RB-01 | P0 | VIGENTE | — |
| BRA-02 | Respetar clearspace, tamaño mínimo, 6 violaciones prohibidas | RB-02 | P0 | VIGENTE | — |
| BRA-03 | Lapacho dorado nunca como texto de cuerpo (falla WCAG) | RB-03, D-013 | P1 | VIGENTE | — |
| BRA-04 | Todo documento/deck cierra con firma canónica + pantalla tierra-colorada | RB-04 | P1 | VIGENTE | — |
| BRA-05 | Disclaimer "cifras ilustrativas, no constituyen garantía" en slides de retorno | RB-05 | P0 | VIGENTE | — |
| BRA-06 | Emails/teléfono de firma correctos (`juancastillo@...`, `urbannit@meridianocapital.net`, `+595 982 853 111`) | RB-06 | P1 | VIGENTE — **ver contradicción histórica C-005/C-006** | — |
| BRA-07 | Lista de países de origen debe leer "Europa, Argentina, Brasil, Chile" | RB-07 | P1 | **NO VIGENTE EN LA APP ACTUAL — ver C-007, contradicción nueva encontrada en este reporte** | Corregir `production/app/frontend/index.html` |
| BRA-08 | Sub-identidad de proyecto inmobiliario sigue Marca Endosada | RB-08, D-019 | P2 | VIGENTE (framework, sin proyecto activo todavía) | — |
| BRA-09 | Sitio/presentación de Urbannit debe mostrar el endoso "gestionado por Meridiano Capital" | RB-09, U-001 | P1 | PENDIENTE — no implementado en el material de referencia disponible | — |

### 4.5 OPERATIONAL REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| OPS-01 | Cartera B nunca se llama "Administración" | RB-10, D-020 | P1 | VIGENTE | — |
| OPS-02 | Tarifario solo se comparte en etapa avanzada del journey | RN-04, D-021 | P1 | VIGENTE | — |
| OPS-03 | Completar 4 campos vacíos del cuestionario bancario (bancos, requisitos, tiempo, monto mínimo) | U-006 | P1 | BLOQUEADO — requiere al founder/aliado bancario | — |
| OPS-04 | Nombrar responsable operativo de cada etapa del journey (falta en Etapa 2) | U-006 (relacionado) | P2 | BLOQUEADO | — |
| OPS-05 | Operacionalizar procedimiento CRS/FATCA (formulario, plazo, responsable) | U-007 | P1 | BLOQUEADO — requiere contadora | — |
| OPS-06 | Definir términos de salida/cancelación del contrato de asesoría mensual | U-008 | P2 | BLOQUEADO | — |

### 4.6 AI REQUIREMENTS

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| AIR-01 | Consultar el sistema de enrutamiento antes de producir/auditar cualquier activo | RA-01 | P0 | VIGENTE (documentado en CLAUDE.md) | — |
| AIR-02 | Toda regla debe ser trazable como OFICIAL o etiquetada `[EXTENSION]` | RA-02, D-025 | P0 | VIGENTE | — |
| AIR-03 | Resolver conflictos de reglas con el orden de prioridad definido | RA-03, D-026 | P0 | VIGENTE | — |
| AIR-04 | Correr el audit de Brand Guardian (4 pasos + matriz de 10 criterios) antes de entregar contenido creativo | RA-04 | P1 | VIGENTE COMO PROTOCOLO, PENDIENTE COMO SKILL AUTOMATIZADA (ver SK-01) | SK-01 |
| AIR-05 | Usar el Prompt Engine de 5 bloques para prompts de imagen/video | RA-05 | P2 | VIGENTE COMO PROTOCOLO, PENDIENTE COMO SKILL (ver SK-02) | SK-02 |
| AIR-06 | Nunca presentar una recomendación creativa como regla oficial | RA-06, D-025 | P0 | VIGENTE | — |
| AIR-07 | Cualquier decisión nueva tomada en sesión debe registrarse en `DECISION_REGISTER.md` con el protocolo CURRENT/HISTORICAL | definido en el cierre de `DECISION_REGISTER.md` | P1 | VIGENTE COMO PROTOCOLO, PENDIENTE COMO SKILL AUTOMATIZADA (ver SK-06) | SK-06 |

### 4.7 SECURITY REQUIREMENTS *(nuevo — inferido, no dicho literalmente en el material original; marcado [EXTENSION])*

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| SEC-01 `[EXTENSION]` | Los datos de contacto/leads (`contactos.jsonl`) contienen PII (nombre, email) — no deben commitearse a git ni exponerse públicamente | Inferido de buenas prácticas + ya implementado vía `.gitignore` | P0 | IMPLEMENTADO (`production/app/backend/data/*.jsonl` en `.gitignore`) | — |
| SEC-02 `[EXTENSION]` | Datos bancarios/fiscales del onboarding (origen de fondos, CRS/FATCA) son información sensible — necesitan un canal de manejo distinto a un archivo de texto plano | Inferido de `knowledge-base/operations/01-onboarding-bancario.md` | P1 | PENDIENTE (no hay ningún sistema de manejo de esos datos todavía, ni bueno ni malo) | OPS-05 |
| SEC-03 `[EXTENSION]` | El tarifario y las cifras de fee/carry son información competitivamente sensible — la regla "solo etapa avanzada" (OPS-02) es también un control de seguridad de información, no solo una regla de venta | Inferido de D-021 | P2 | VIGENTE (regla ya existe, reencuadrada) | — |
| SEC-04 `[EXTENSION]` | El servidor de la app (`server.py`) no tiene autenticación en ningún endpoint — aceptable para prototipo local, no para producción pública | Inferido del código actual | P1 | PENDIENTE — bloqueante antes de exponer la app fuera de `localhost` | TEC-06 |
| SEC-05 `[EXTENSION]` | El manual de marca oficial (`.docx`) y los parámetros de mercado (`.json`) son activos de negocio — deben tener control de acceso una vez el sistema tenga múltiples usuarios/equipos | Inferido del objetivo "múltiples equipos, múltiples usuarios" del propio pedido de migración | P3 | FUTURE (no aplica con un solo usuario hoy) | Fase de multi-usuario |

### 4.8 SCALABILITY REQUIREMENTS *(nuevo — inferido; marcado [EXTENSION])*

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| SCA-01 `[EXTENSION]` | La arquitectura de conocimiento debe soportar más de una marca (Meridiano + Urbannit hoy; otras a futuro) sin reescribirse | Inferido del pedido explícito de visión multi-marca | P1 | PARCIAL — `knowledge-base/brand/10-arquitectura-meridiano-urbannit.md` ya modela 2 marcas; estructura de carpetas todavía es de una sola marca-proyecto | Fase 7 (Arquitectura) |
| SCA-02 `[EXTENSION]` | `parametros_mercado.json` debe poder tener variantes por mercado/país si el negocio se expande fuera de Paraguay | Inferido del pedido "múltiples mercados" | P3 | FUTURE | Expansión internacional confirmada |
| SCA-03 `[EXTENSION]` | El motor de cálculo (`calculadora.py`) está desacoplado de moneda/impuestos locales solo parcialmente — el bloque `fiscal` asume Paraguay (IVA, IRE) | Inferido del código | P3 | FUTURE | SCA-02 |
| SCA-04 `[EXTENSION]` | La app debe poder evolucionar de "1 servidor stdlib" a un stack con más capacidad si el volumen de leads/cálculos crece | Inferido de TEC-03 | P3 | FUTURE — no urgente al volumen actual | — |
| SCA-05 `[EXTENSION]` | El Decision Register y Contradiction Register deben poder escalar a múltiples negocios sin perder trazabilidad cruzada | Inferido del pedido de visión Business System | P2 | PENDIENTE — diseño en Fase 7/8 de este reporte, no implementado | Fase 7 |

### 4.9 FUTURE REQUIREMENTS *(explícitamente fuera de alcance inmediato — no construir todavía)*

| ID | Descripción | Origen | Prioridad | Estado | Dependencia |
|---|---|---|---|---|---|
| FUT-01 | Cuenta propia de redes sociales para Urbannit | P-001 | P3 | PROPOSED, condicional | Decisión de negocio |
| FUT-02 | Identidades de sub-marca por proyecto inmobiliario específico | P-002 | P3 | PROPOSED, sin proyecto activo aún | Primer proyecto a escala |
| FUT-03 | Envoltura FastAPI + arquitectura ampliada para la app | P-003 | P3 | PROPOSED — deliberadamente no elegido en el prototipo actual (se prefirió stdlib) | Validación de que el prototipo no alcanza |
| FUT-04 | Multi-agente: varios skills/workflows operando juntos en el Business System completo | Pedido explícito del usuario en este turno | P2 | PROPOSED — es literalmente el objetivo final declarado, pero requiere las Fases 1-9 del roadmap primero | Implementation Roadmap completo |
| FUT-05 | Integración con sistemas externos (CRM, banca, contable) | Pedido explícito ("integración con sistemas externos") | P3 | PROPOSED | Connector Map (Fase 5 del roadmap) |
| FUT-06 | Analítica sobre el negocio (dashboards de conversión de leads, performance de cartera) | Pedido explícito ("analítica") | P3 | PROPOSED | Datos operativos reales acumulados |

---

## FASE 5 — CONTRADICTION REGISTER

Formato exigido: (1) Contradicción · (2) Fuentes · (3) Decisión más reciente aparente · (4) Impacto · (5) Recomendación · (6) Confirmación requerida.

**Ninguna de estas contradicciones se resolvió unilateralmente.** Las C-001 a C-003 ya estaban documentadas como UNRESOLVED en `DECISION_REGISTER.md` (D-001 a D-003); C-004 a C-006 estaban implícitas en las reglas de marca pero no se habían registrado formalmente como contradicción histórica; **C-007 es un hallazgo nuevo de este reporte** (no se había detectado en la extracción anterior); C-008 ya estaba anotada como ambigüedad de ownership.

> **✅ RESOLUCIÓN (2026-08-02)**: el founder confirmó la regla — IVA 10% para alquileres comerciales, 5% para alquileres residenciales, 5% para venta/reventa. Implementado en `production/app/config/parametros_mercado.json` (bloque `fiscal`) y `production/app/backend/calculadora.py` como `D-027`. Las clases `temporal_*` (Urbannit) usan el residencial 5% por inferencia `[EXTENSION]` no confirmada explícitamente — ver advertencia en la API. Entrada original preservada sin editar por trazabilidad.

### C-001 · IVA: 5% (código) vs. 10% (política) — ✅ RESUELTA, ver D-027
1. **Contradicción**: `calculadora.py` usa `fiscal.iva_pct = 5.0` para calcular renta neta; la política declara `supuestos_operativos_default.iva_pct = 10.0` como obligatorio ("SIEMPRE aplicarlo").
2. **Fuentes**: `production/app/backend/calculadora.py` (código) vs. `production/app/config/parametros_mercado.json` bloque `supuestos_operativos_default` (política).
3. **Decisión más reciente aparente**: ninguna — el propio bloque `fiscal` está anotado "A CONFIRMAR CON CONTADORA", es decir, el propio material admite que nunca se cerró.
4. **Impacto**: **alto** — todo yield neto mostrado hoy puede estar sobrestimado, afecta directamente decisiones de inversión reales.
5. **Recomendación**: fijar 10% (la política) como valor por defecto hasta que la contadora confirme lo contrario, ya que la política es explícita ("SIEMPRE") y el código es el que está marcado como no confirmado.
6. **Confirmación requerida**: sí — del founder + contadora, antes de usar la calculadora con inversores reales.

### C-002 · Pisos de rentabilidad: NETO (uso en código) vs. BRUTO (etiqueta del refinamiento #10)
1. **Contradicción**: `pisos_renta_neta` se usa en el código como piso neto; `pisos_base_bruto_o_neto` (mismo archivo de config) etiqueta esos mismos números como brutos, con rangos netos más bajos.
2. **Fuentes**: `parametros_mercado.json` bloques `pisos_renta_neta` vs. `pisos_base_bruto_o_neto`.
3. **Decisión más reciente aparente**: `pisos_base_bruto_o_neto` está descrito como resultado de una "auditoría" posterior — sugiere que es la corrección más reciente, pero el código nunca se actualizó para usarla.
4. **Impacto**: **alto** — el veredicto `pasa_piso` puede aprobar oportunidades que en términos netos reales no alcanzan el piso.
5. **Recomendación**: adoptar la interpretación de `pisos_base_bruto_o_neto` (post-auditoría) y actualizar `pisos_renta_neta` o el código para que dejen de contradecirse.
6. **Confirmación requerida**: sí — del founder, antes de confiar en cualquier veredicto `pasa_piso` ya emitido.

### C-003 · Ocupación temporal: 3% genérico (código) vs. 55-65% realista (refinamiento #8)
1. **Contradicción**: la rama de alquiler temporal en `evaluar_renta()` usa `vacancia_pct` genérico (3%), no el rango de ocupación realista que el refinamiento #8 introdujo específicamente para corregir el error de Edificio Austria (que usaba 93%).
2. **Fuentes**: `calculadora.py` función `evaluar_renta()` vs. `parametros_mercado.json` bloque `renta_temporal_default`.
3. **Decisión más reciente aparente**: el refinamiento #8 (posterior, auditado contra un caso real).
4. **Impacto**: **medio-alto** — riesgo de reintroducir el mismo error que el refinamiento dice haber resuelto, específicamente en la línea de negocio Urbannit (temporal).
5. **Recomendación**: la rama temporal debe leer `renta_temporal_default.ocupacion_realista_pct`, no el `vacancia_pct` genérico.
6. **Confirmación requerida**: técnica (no de negocio) — es un bug de implementación, no una decisión pendiente.

### C-004 · Ownership documental de proyectos inmobiliarios: BUSINESS vs. BRAND
1. **Contradicción**: `13-proyectos-inmobiliarios.md` define tanto la decisión de negocio (qué proyectos ameritan identidad propia) como su ejecución de marca (cómo se ve esa identidad) — vive simultáneamente referenciado desde ambos dominios sin una única fuente de verdad.
2. **Fuentes**: `knowledge-base/business/05-proyectos-inmobiliarios.md` vs. referencias cruzadas desde `knowledge-base/brand/`.
3. **Decisión más reciente aparente**: no aplica — es una ambigüedad estructural, no una decisión reemplazada.
4. **Impacto**: **bajo-medio** — riesgo de que futuras ediciones diverjan entre las dos copias/referencias si no se trata como una sola fuente.
5. **Recomendación**: fijar `knowledge-base/business/05-proyectos-inmobiliarios.md` como fuente de verdad única (la decisión de negocio manda) y que brand/ solo la enlace, nunca la duplique.
6. **Confirmación requerida**: no bloqueante — se puede resolver como criterio editorial sin involucrar al founder.

### C-005 · Email de firma personal: "juanjosecastillo@..." (histórico, incorrecto) vs. "juancastillo@meridianocapital.net" (correcto)
1. **Contradicción**: el material de marca corrige explícitamente un email anterior con el nombre completo por uno abreviado — evidencia de que en algún momento se usó el primero.
2. **Fuentes**: `knowledge-base/brand/09-cierres-y-firmas.md` (regla correctiva).
3. **Decisión más reciente aparente**: `juancastillo@meridianocapital.net` (la regla vigente es explícitamente correctiva: "no juanjosecastillo").
4. **Impacto**: **bajo** — pero real: cualquier plantilla o documento antiguo que aún tenga el email largo enviaría comunicación con la firma incorrecta.
5. **Recomendación**: auditar documentos/plantillas existentes fuera de este repo (decks, PDFs ya distribuidos) que puedan tener el email viejo.
6. **Confirmación requerida**: no bloqueante para este repo (ya usa el correcto en `app/`), pero sí vale una revisión externa de materiales ya circulando.

### C-006 · Email Urbannit: "Urbannit4@gmail.com" (prohibido) vs. "urbannit@meridianocapital.net" (correcto)
1. **Contradicción**: mismo patrón que C-005 — la regla de marca prohíbe explícitamente una dirección de Gmail, lo que implica que se usó en algún momento.
2. **Fuentes**: `knowledge-base/brand/09-cierres-y-firmas.md`.
3. **Decisión más reciente aparente**: `urbannit@meridianocapital.net`.
4. **Impacto**: **bajo-medio** — un email de Gmail para una marca "gestionada por Meridiano Capital" (RB-09) debilita justo el endoso institucional que la arquitectura de marca busca reforzar.
5. **Recomendación**: verificar que ningún material de Urbannit en circulación (fuera de este repo) siga usando la dirección de Gmail.
6. **Confirmación requerida**: no bloqueante para este repo; sí vale auditoría externa.

> **✅ RESOLUCIÓN (2026-08-02)**: el founder confirmó que Chile es mercado activo. Corregido en `production/app/frontend/index.html` (hero + dropdown de país del formulario de contacto), `knowledge-base/brand/02-identidad-verbal.md` (one-liner + posicionamiento formal) y `knowledge-base/brand/08-sistema-de-imagen.md`. Registrado como `D-028`. `assets/source-docs/meridiano-capital-sitio-web.html` (referencia archivada) e `inventory/_raw-copies/` quedan sin tocar — son material histórico/archivo, no la copia viva.

### C-007 · Países de origen de clientes: "Europa, Argentina y Brasil" (copy real del sitio) vs. "Europa, Argentina, Brasil, Chile" (regla de marca documentada) — ✅ RESUELTA, ver D-028
1. **Contradicción**: el copy del hero del sitio (heredado sin cambios del sitio de referencia original hacia `production/app/frontend/index.html`) dice *"Ayudamos a inversores de Europa, Argentina y Brasil..."* — **tres orígenes, sin Chile**. La regla de marca ya documentada (RB-07, `knowledge-base/brand/00-overview.md`) dice explícitamente que las listas de origen de clientes deben leer *"Europa, Argentina, Brasil, Chile"* — **cuatro orígenes**.
2. **Fuentes**: `production/app/frontend/index.html` (hero, heredado de `assets/source-docs/meridiano-capital-sitio-web.html`) vs. `knowledge-base/brand/00-overview.md` (regla RB-07).
3. **Decisión más reciente aparente**: no se puede determinar con el material disponible — podría ser que la regla de 4 países sea posterior al copy del sitio (sitio desactualizado), o que el copy del sitio sea deliberadamente distinto de la regla general de "listas de origen" (por ejemplo, si Chile se agregó como mercado después de escribir el hero). El material no lo aclara.
4. **Impacto**: **medio** — es la primera línea que lee cualquier visitante del sitio; si Chile es un mercado real y activo, el sitio actual lo está excluyendo del mensaje principal.
5. **Recomendación**: actualizar el hero de `production/app/frontend/index.html` a "Europa, Argentina, Brasil y Chile" para alinear con RB-07 — **pendiente de tu confirmación antes de tocar el copy**, ya que no hay certeza de cuál versión es la vigente.
6. **Confirmación requerida**: **sí** — del founder. ¿Chile es un mercado activo? Si sí, corregir el sitio. Si no, la regla RB-07 debería ajustarse en vez del sitio.

### C-008 · Narrativa Urbannit: "15 años" (histórico) vs. "20+ años, origen Barcelona 2010" (vigente)
*(Ya documentada como H-001 en `DECISION_REGISTER.md`; se incluye aquí en formato de contradicción por completitud del registro.)*
1. **Contradicción**: cifra de años de experiencia del operador Urbannit inconsistente entre versiones del material.
2. **Fuentes**: `knowledge-base/brand/10-arquitectura-meridiano-urbannit.md`.
3. **Decisión más reciente aparente**: "20+ años, origen Barcelona (2010)" — es la que el material presenta como corrección.
4. **Impacto**: bajo — ya resuelto dentro del material, riesgo solo si queda algún documento externo con la cifra vieja.
5. **Recomendación**: ninguna acción adicional dentro de este repo (ya usa la cifra correcta).
6. **Confirmación requerida**: no.

---

## FASE 6 — KNOWLEDGE CLASSIFICATION

Cada elemento del repo clasificado en una de las 9 categorías. Esto determina cómo se debe tratar cada cosa (qué se carga en memoria persistente, qué es documentación de referencia, qué es material que ya no se usa activamente, etc.).

| Categoría | Qué incluye | Ejemplos concretos |
|---|---|---|
| **CORE MEMORY** | Lo mínimo, estable, que debería acompañar al sistema siempre — no todo el detalle, solo lo esencial | Brand Essence "Precisión con raíces"; los 4 pilares del ADN; los 2 modelos de negocio (a nivel concepto, no el detalle de %); el protocolo OFICIAL/`[EXTENSION]`; identidad del founder (Juan José Castillo) |
| **DOMAIN KNOWLEDGE** | El detalle especializado por dominio — la mayoría del repo | Los 34 documentos de `knowledge-base/` completos |
| **SKILL** | Capacidad reutilizable y estructurada (no todavía implementada como Claude Skill nativa de este entorno) | Las 8 candidatas de la Fase 9 |
| **WORKFLOW** | Proceso ejecutable con pasos de decisión | Los 4 candidatos de la Fase 10 |
| **PROJECT** | Contexto activo específico | "Meridiano Capital" como proyecto activo hoy; "Urbannit" como proyecto parcialmente activo (marca definida, sin sistema propio todavía) |
| **DOCUMENTATION** | Referencia sobre el sistema mismo, no sobre el negocio | `README.md`, `production/app/README.md`, `CLAUDE.md`, este mismo reporte |
| **CONFIGURATION** | Valores que cambian con el mercado/operación, no lógica | `production/app/config/parametros_mercado.json` |
| **HISTORICAL** | Ya reemplazado, se conserva por trazabilidad | H-001, H-002, C-005/C-006 (emails viejos), la versión pre-refinamientos del modelo P07 |
| **ARCHIVE** | Se conserva pero no se usa activamente | `inventory/_raw-copies/` completo (copia cruda de las 3 skills originales) |

**Regla de aplicación**: cuando algo puede clasificar en más de una categoría (por ejemplo, `parametros_mercado.json` es CONFIGURATION pero también alimenta DOMAIN KNOWLEDGE vía `knowledge-base/investment/03-parametros-de-mercado.md`), **CONFIGURATION es la fuente de verdad de los valores; DOMAIN KNOWLEDGE es la explicación legible de esos valores** — nunca deben duplicar el dato, solo uno lo declara y el otro lo explica.

---

## FASE 7 — SYSTEM ARCHITECTURE (propuesta, no implementada)

Arquitectura de 10 capas pedida, con la función de cada una aplicada a lo que ya existe y a lo que falta:

| Capa | Función | Estado hoy en el repo |
|---|---|---|
| **CORE** | Identidad mínima y no-negociables del sistema completo (no de un solo negocio) — lo que nunca cambia | No existe como capa separada todavía; vive disperso dentro de `knowledge-base/brand/01-adn-de-marca.md` y `CLAUDE.md` |
| **MEMORY** | Contexto persistente liviano entre sesiones (Fase 11) | No implementada — diseño en este reporte |
| **KNOWLEDGE** | Conocimiento de dominio organizado y con trazabilidad | ✅ `knowledge-base/` (existe, 7 dominios) |
| **SKILLS** | Capacidades reutilizables y estructuradas | Diseñadas (Fase 9), no implementadas como skills nativas de este entorno |
| **CONNECTORS** | Integraciones con sistemas externos (CRM, banca, email, etc.) | No existen — la app hoy es deliberadamente cero-dependencias |
| **WORKFLOWS** | Procesos ejecutables con decisión/validación | Diseñados (Fase 10); 1 parcialmente vivo (cálculo de rentabilidad, vía API) |
| **PROJECTS** | Contexto activo por unidad de negocio/marca | Implícito (todo el repo ES el proyecto Meridiano Capital); no hay separación explícita `projects/meridiano-capital/` vs `projects/urbannit/` |
| **DOCUMENTATION** | Referencia sobre el sistema mismo | ✅ `README.md`, `production/app/README.md`, `CLAUDE.md`, este reporte |
| **GOVERNANCE** | Control: decisiones, requisitos, contradicciones, reglas de comportamiento de IA | ✅ `decisions/`, `CLAUDE.md`, `knowledge-base/ai/` |
| **PRODUCTION** | El sistema real, en uso, de cara a inversores/usuarios | ✅ `app/` (prototipo funcional, probado) |

### Propuesta de reestructuración de carpetas (NO EJECUTAR sin tu aprobación)

Para que la arquitectura de 10 capas sea explícita en el filesystem (hoy varias capas están implícitas o mezcladas), la reestructuración natural sería:

```
Meridiano-Capital/                    (o renombrado a nivel holding, ver nota abajo)
├── 00_RAW_MIGRATION/                 ✅ ya existe (nuevo, vacío)
├── core/                             NUEVO — identidad mínima, extraída de brand/01 + CLAUDE.md
├── memory/                           NUEVO — Fase 11
├── knowledge-base/                   ✅ ya existe, sin cambios
├── skills/                           NUEVO — Fase 9 implementada
├── connectors/                       NUEVO — Fase 5 del roadmap (Connector Map)
├── workflows/                        NUEVO — Fase 10 implementada
├── projects/
│   ├── meridiano-capital/            (contenido específico de este negocio que no es "conocimiento" reusable)
│   └── urbannit/                     (cuando tenga sistema propio)
├── documentation/                    README.md, este reporte, etc. (hoy están en la raíz)
├── governance/                       decisions/ (renombrado/movido) + CLAUDE.md
└── production/
    └── app/                          ✅ ya existe, movido bajo production/
```

**Esto implica mover** `decisions/` → `governance/decisions/`, `app/` → `production/app/`, y crear varias carpetas nuevas vacías. Es un movimiento de archivos con git (`git mv`, preserva historial), no una reescritura — pero es exactamente el tipo de cambio estructural que pediste aprobar explícitamente antes de ejecutar. **No lo hice.**

**Nota sobre el nombre del repo**: si el destino real es un Business System que abarca más que Meridiano Capital, en algún momento el nombre `Meridiano-Capital/` como carpeta raíz deja de ser preciso (Urbannit y futuras marcas no son "parte de" Meridiano Capital de la misma manera que sus propios documentos). Es una decisión de naming, no técnica — la dejo abierta para que la definas vos, no la until propongo aquí.

---

## FASE 8 — SOURCE OF TRUTH MAP

| Área | Fuente de verdad única | Nunca duplicar en |
|---|---|---|
| Brand Identity | `knowledge-base/brand/` (el `.docx` oficial es la autoridad última) | Cualquier deck/web — deben *citar*, no *redefinir* |
| Business Strategy | `knowledge-base/business/` | — |
| Investment Methodology (concepto) | `knowledge-base/investment/` | — |
| Investment Calculation (ejecución) | `production/app/backend/calculadora.py` + `production/app/config/parametros_mercado.json` | `knowledge-base/investment/` solo lo *explica*, no debe tener sus propios números que puedan desincronizarse |
| Operational Processes | `knowledge-base/operations/` | — |
| Marketing/Channel Rules | `knowledge-base/marketing/` | — |
| AI Governance/Behavior | `knowledge-base/ai/` (contenido) + `CLAUDE.md` (el que lo carga automáticamente) | `CLAUDE.md` nunca debe copiar el contenido de `knowledge-base/ai/`, solo apuntar a él |
| Decisiones y trazabilidad | `governance/decisions/DECISION_REGISTER.md` | — |
| Requisitos | Este reporte (Fase 4 v2) pasa a ser la versión vigente; `governance/decisions/REQUIREMENTS.md` (v1) queda como HISTORICAL una vez apruebes este reporte | — |
| Contradicciones | Este reporte (Fase 5) — se propone que viva permanentemente en `governance/CONTRADICTION_REGISTER.md` tras la reestructuración | — |
| Parámetros de mercado (valores) | `production/app/config/parametros_mercado.json` | Ningún otro archivo debe tener su propia copia de estos números |
| Datos de contacto/leads | `production/app/backend/data/contactos.jsonl` (temporal — ver TEC-07) | — |
| Memoria persistente de IA | El sistema de memoria nativo de Claude Code (Fase 11) — no `knowledge-base/` | — |

---

## FASE 9 — SKILL DISCOVERY

No toda capacidad mencionada en el material es una skill — solo las que son reutilizables, con inputs/outputs claros y trigger identificable. 8 candidatas:

### SK-01 · `brand-guardian-audit`
- **Propósito**: auditar cualquier pieza de contenido (texto, brief de imagen, slide) contra la Matriz de Decisión de 10 criterios y el protocolo Brand Guardian.
- **Trigger**: "revisa esto contra la marca", "¿esto respeta a Meridiano?", antes de publicar cualquier cosa.
- **Inputs**: descripción o archivo del contenido a auditar.
- **Outputs**: veredicto (ALINEADO / REQUIERE AJUSTE / NO ALINEADO) + lista de fixes puntuales.
- **Dependencias**: `knowledge-base/brand/`, `knowledge-base/ai/04-director-creativo-y-brand-guardian.md`, `knowledge-base/ai/05-matriz-de-decision.md`.
- **Herramientas/Connectors**: ninguno externo — solo lectura de archivos.
- **Prioridad**: **P1**.
- **Relación**: complementa a SK-02 (prompt-engine); es un prerrequisito de WF-03 (Brand Content QA).

### SK-02 · `brand-prompt-engine`
- **Propósito**: generar prompts de imagen/video con IA siguiendo el motor de 5 bloques.
- **Trigger**: "generame un prompt para [escena de marca]".
- **Inputs**: brief de la escena, marca (Meridiano o Urbannit).
- **Outputs**: prompt estructurado listo para usar.
- **Dependencias**: `knowledge-base/ai/06-prompt-engine.md`, `knowledge-base/brand/07-direccion-de-arte.md`, `knowledge-base/brand/08-sistema-de-imagen.md`.
- **Prioridad**: **P2**.
- **Relación**: alimenta a SK-01 para auditar el resultado generado.

### SK-03 · `rentabilidad-calculator`
- **Propósito**: envolver `calculadora.py` como una capacidad consultable en lenguaje natural.
- **Trigger**: "¿cuál es la rentabilidad de esta propiedad?", cifras de clase/precio/renta.
- **Inputs**: clase de activo, precio de compra, renta mensual, nivel de neto.
- **Outputs**: yield bruto/neto, desglose, veredicto vs. piso, **advertencias D-001/D-002/D-003 siempre incluidas**.
- **Dependencias**: `production/app/backend/calculadora.py`, `production/app/config/parametros_mercado.json`.
- **Herramientas/Connectors**: ejecución Python o llamada HTTP a `production/app/backend/server.py`.
- **Prioridad**: **P0** — ya tiene código funcional, es "el corazón del negocio" según el propio docstring del archivo.
- **Relación**: alimenta a WF-02 (Rentabilidad Evaluation Workflow).

### SK-04 · `investor-journey-navigator`
- **Propósito**: dado el perfil/etapa de un inversor, indicar qué sigue, qué documentos hacen falta, qué checklist aplica.
- **Trigger**: "¿en qué etapa está este inversor y qué sigue?".
- **Inputs**: etapa actual, nacionalidad, tamaño de ticket.
- **Outputs**: próximos pasos, documentos requeridos, ítems de checklist.
- **Dependencias**: `knowledge-base/business/04-etapas-del-inversor.md`, `knowledge-base/operations/02-checklist-inversor.md`, `knowledge-base/operations/01-onboarding-bancario.md`.
- **Prioridad**: **P1**.
- **Relación**: alimenta a WF-01 (Investor Onboarding Workflow).

### SK-05 · `tarifario-lookup`
- **Propósito**: responder preguntas de precio respetando la regla de "solo etapa avanzada" (D-021) — no revelar cifras a un contacto de primer momento sin verificar la etapa.
- **Trigger**: "¿cuánto cobra Meridiano por X?".
- **Inputs**: pregunta de pricing + (idealmente) etapa del inversor.
- **Outputs**: cifra solicitada, o una respuesta que redirige a agendar consulta si la etapa es temprana.
- **Dependencias**: `knowledge-base/operations/03-tarifario.md`.
- **Prioridad**: **P2**.
- **Relación**: depende de SK-04 para saber la etapa.

### SK-06 · `decision-register-keeper`
- **Propósito**: cuando se toma o reemplaza una decisión durante una sesión, formatearla y añadirla correctamente a `DECISION_REGISTER.md` (moviendo lo reemplazado a HISTORICAL, nunca borrándolo).
- **Trigger**: "registra esta decisión", o automáticamente al detectar una decisión de negocio/marca/técnica nueva en la conversación.
- **Inputs**: la decisión, su motivo, qué reemplaza (si algo).
- **Outputs**: entrada añadida al registro con ID secuencial correcto.
- **Dependencias**: `governance/decisions/DECISION_REGISTER.md` (formato).
- **Prioridad**: **P1** — es lo que evita que el sistema completo se pudra con el tiempo.
- **Relación**: trabaja junto a SK-07.

### SK-07 · `contradiction-scanner`
- **Propósito**: re-escanear `knowledge-base/` en busca de contradicciones nuevas a medida que el corpus crece (especialmente cuando llegue material de `00_RAW_MIGRATION/`).
- **Trigger**: bajo demanda ("revisa contradicciones") o disparado automáticamente cuando entra material nuevo.
- **Inputs**: el corpus completo o el material nuevo a comparar contra el existente.
- **Outputs**: entradas nuevas al Contradiction Register, en el mismo formato de 6 campos.
- **Dependencias**: todo `knowledge-base/`, `governance/decisions/DECISION_REGISTER.md`.
- **Prioridad**: **P3** — valioso pero no urgente mientras el corpus es chico y manejable a mano (como en este mismo reporte).
- **Relación**: alimenta a SK-06.

### SK-08 · `project-brand-identity-designer`
- **Propósito**: aplicar el framework de Marca Endosada a un proyecto inmobiliario específico nuevo, produciendo un brief de sub-identidad coherente.
- **Trigger**: "necesito la identidad para el proyecto [X]".
- **Inputs**: nombre/naturaleza del proyecto, escala.
- **Outputs**: brief de sub-identidad (nombre, aplicación del mojón, paleta derivada).
- **Dependencias**: `knowledge-base/business/05-proyectos-inmobiliarios.md`, `knowledge-base/brand/10-arquitectura-meridiano-urbannit.md`.
- **Prioridad**: **P3** — condicional a FUT-02 (hoy ningún proyecto lo amerita).
- **Relación**: usa SK-01 para auditar el resultado.

---

## FASE 10 — WORKFLOW DISCOVERY

Formato INPUT → PROCESS → DECISION → ACTION → VALIDATION → OUTPUT → LEARNING para cada candidato.

### WF-01 · Investor Onboarding Workflow
- **INPUT**: envío del formulario de contacto (`app/api/contacto` — ya captura nombre/email/país/mensaje).
- **PROCESS**: clasificar por país/perfil → estimar modelo probable (A individual vs. B coinversión) → ubicar etapa del journey.
- **DECISION**: ¿ruta de cédula o S.A. rápida (D-017)? ¿ticket vs. umbral de coinversión (U-004, todavía sin definir)?
- **ACTION**: asignar el siguiente paso de la red de aliados, enviar checklist correspondiente.
- **VALIDATION**: completitud del cuestionario bancario — **hoy bloqueada por OPS-03 (4 campos sin completar)**.
- **OUTPUT**: perfil de inversor + checklist de próximos pasos.
- **LEARNING**: registrar en qué etapa se caen los inversores para encontrar puntos de fricción.
- **Prioridad para automatizar primero**: **alta en valor, pero bloqueada** — no tiene sentido automatizar un flujo con huecos operativos sin dueño (OPS-03, OPS-04, OPS-05) sin resolverlos primero.

### WF-02 · Rentabilidad Evaluation Workflow
- **INPUT**: datos de una propiedad (clase, precio, renta).
- **PROCESS**: ejecutar `evaluar_renta` / `evaluar_reventa` / `evaluar_retorno_combinado` (SK-03).
- **DECISION**: ¿pasa el piso? Si no, ¿la plusvalía combinada lo compensa?
- **ACTION**: generar tabla de 3 escenarios (RI-03) mostrando siempre neto (RI-01).
- **VALIDATION**: bloquear/advertir explícitamente si D-001/D-002/D-003 siguen sin resolver y el destino es material para un inversor externo.
- **OUTPUT**: resumen de rentabilidad listo para inversor.
- **LEARNING**: registrar propiedades evaluadas para calibrar futuros ajustes de parámetros (como ya se hizo manualmente con Habitalis 9A / Edificio Austria).
- **Prioridad para automatizar primero**: **la más alta — ya tiene código funcional y probado**. Es el candidato natural para ser el primer workflow real, una vez resueltas las contradicciones financieras.

### WF-03 · Brand Content QA Workflow
- **INPUT**: contenido en borrador (deck, post, ad, copy web).
- **PROCESS**: correr SK-01 (`brand-guardian-audit`).
- **DECISION**: ALINEADO / REQUIERE AJUSTE / NO ALINEADO.
- **ACTION**: auto-corregir issues menores, marcar bloqueantes duros (logo/color).
- **VALIDATION**: chequeo del estándar de cierre/firma (BRA-04/05/06).
- **OUTPUT**: contenido aprobado para publicar, o lista de fixes.
- **LEARNING**: registrar tipos de violación recurrentes para afinar la guía `[EXTENSION]`.
- **Prioridad para automatizar primero**: **media-alta**, después de WF-02.

### WF-04 · Contradiction & Decision Sync Workflow
- **INPUT**: contenido nuevo agregado a `knowledge-base/`, o una decisión nueva expresada en conversación.
- **PROCESS**: comparar contra `DECISION_REGISTER.md` y el Contradiction Register.
- **DECISION**: ¿nuevo / duplicado / contradice algo existente?
- **ACTION**: agregar entrada con el estado correcto; si contradice algo, **marcar para confirmación del usuario — nunca resolver solo**.
- **VALIDATION**: que la entrada tenga fuente, fecha, contexto y versión (sistema de trazabilidad).
- **OUTPUT**: registros actualizados.
- **LEARNING**: tipos de contradicción recurrentes indican qué áreas de conocimiento necesitan más rigor.
- **Prioridad para automatizar primero**: **alta en importancia estructural** (protege la integridad de todo lo demás), pero de menor urgencia inmediata que WF-02 mientras el corpus siga siendo manejable a mano.

**Orden recomendado de automatización**: WF-02 (ya funcional, corazón del negocio) → WF-04 (protege el resto del sistema mientras crece) → WF-03 (calidad de marca) → WF-01 (bloqueado por decisiones operativas externas, ver Fase 12 / PHASE 8 Operations OS).

---

## FASE 11 — MEMORY ENGINEERING (diseño, no implementado todavía)

Memoria limpia, no el historial completo. Lo que debería vivir en el sistema de memoria persistente de Claude Code (distinto de `knowledge-base/`, que es donde vive el detalle):

| Tipo de memoria | Contenido propuesto |
|---|---|
| **USER** | Juan José Castillo es el founder y decisor final de Meridiano Capital (real estate & desarrollo en Paraguay para inversores extranjeros). Las decisiones de marca/negocio requieren su aprobación explícita — no asumir autoridad para cerrarlas. |
| **PROJECT** | Meridiano Capital: conocimiento migrado a `Documentos/Meridiano-Capital` el 2026-08-02. Hay 2 contradicciones financieras activas sin resolver (IVA, definición de pisos) que bloquean confiar plenamente en la calculadora de rentabilidad para uso con inversores reales. El Migration Master Report (Fases 4-12) está esperando aprobación antes de iniciar cualquier reestructuración o construcción de skills/workflows. |
| **FEEDBACK** | *(vacío por ahora — se llena la primera vez que el usuario apruebe/corrija algo de este reporte o de decisiones tomadas durante el BUILD)* |
| **REFERENCE** | El repo canónico es `C:\Users\Usuario\OneDrive\Documentos\Meridiano-Capital\`. `CLAUDE.md` en la raíz contiene las reglas de gobernanza que debe cargar cualquier sesión futura que trabaje ahí. |

**Regla aplicada**: nada de esto se escribió todavía en el sistema de memoria real — es una propuesta de contenido, consistente con "no implementar antes de tu aprobación". Se implementa en la Fase 3 del Implementation Roadmap (abajo).

---

## FASE 12 — CLAUDE CODE IMPLEMENTATION PLAN

| Fase | Objetivo | Entregables | Dependencias | Prioridad | Criterio de finalización | Estado hoy |
|---|---|---|---|---|---|---|
| **1. Foundation** | Repo, inventario, preservación del material crudo, gobernanza raíz | Repo git, `inventory/`, `CLAUDE.md`, `00_RAW_MIGRATION/` | — | P0 | Repo existe, inventario completo, material crudo preservado sin tocar | ~90% — falta solo el export real del usuario |
| **2. Knowledge architecture** | Conocimiento de dominio organizado con trazabilidad | `knowledge-base/` (7 dominios), Source of Truth Map | Fase 1 | P0 | Todo el material de las 3 skills reconstruido, sin resumir, con fuente citada | Completo para las 3 skills disponibles; se re-abre si llega material de `00_RAW_MIGRATION/` |
| **3. Memory architecture** | Memoria persistente liviana (Fase 11) | Entradas de memoria USER/PROJECT/REFERENCE creadas en el sistema real | Fase 2 | P1 | Memoria contiene solo lo esencial, nunca duplica `knowledge-base/` | Diseñado, no implementado — pendiente de tu aprobación |
| **4. Skills** | Implementar las 8 candidatas de la Fase 9 como capacidades reales | Skills funcionando, empezando por SK-03 (rentabilidad, P0) | Fase 2, 3 | P1 (SK-03 es P0) | Cada skill responde a su trigger con el input/output especificado | No iniciado |
| **5. Connectors** | Mapear e ir conectando sistemas externos reales | Connector Map, primer connector real (ej. notificación por email de nuevo contacto) | Fase 1 | P2 | Al menos 1 connector real reemplaza un placeholder actual (ej. `contactos.jsonl`) | No iniciado — la app hoy es deliberadamente cero-dependencias |
| **6. Workflows** | Implementar los 4 candidatos de la Fase 10 | Workflows ejecutables, empezando por WF-02 (rentabilidad, ya con código base) | Fase 4, 5 | P1 (WF-02 es P0) | Cada workflow corre INPUT→...→LEARNING sin intervención manual en los pasos mecánicos | WF-02 parcialmente vivo (API existe); resto no iniciado |
| **7. Brand OS** | Brand Guardian como capa de QA siempre activa sobre cualquier contenido | WF-03 automatizado; resolución de U-001 (endoso Urbannit) y C-007 (Chile en el copy) | Fase 4 (SK-01), 6 | P1 | Ningún contenido se publica sin pasar el audit | Conocimiento existe (`knowledge-base/brand`, `ai/04-05`); automatización no construida |
| **8. Operations OS** | Cerrar huecos operativos (OPS-03/04/05/06) e implementar WF-01 | Cuestionario bancario completo, CRS/FATCA operacionalizado, términos de salida definidos, onboarding automatizado | Input del founder/contadora + Fase 6 | P1 (alto impacto, pero **bloqueado en decisiones externas**) | Los 6 requisitos OPS ya no están en estado BLOQUEADO | No iniciado — depende de vos y de tus aliados (contadora, banco) |
| **9. Production Layer** | Pasar `app/` de prototipo a sistema real de producción | Resolver D-001/D-002/D-003 (bloqueante), reemplazar `contactos.jsonl` por sistema real, decidir hosting, UI de reventa/combinado | Decisiones de negocio sobre D-001/D-002 | P0 (integridad financiera) / P2 (resto) | Ninguna cifra mostrada a un inversor real depende de un valor sin confirmar | Prototipo funcional y probado; hardening de producción no iniciado |
| **10. Continuous Improvement** | Mantener el sistema vivo: sync de decisiones/contradicciones, re-descubrimiento de skills/workflows a medida que crece (especialmente al incorporar Urbannit y material de `00_RAW_MIGRATION/`) | WF-04 corriendo, SK-06/SK-07 activas, cadencia de re-auditoría | Todas las anteriores | P2 | El sistema detecta y expone sus propias contradicciones nuevas sin intervención manual completa | Diseñado, no implementado |

---

## Checklist de "RESULTADO FINAL ESPERADO"

| # | Entregable | Estado |
|---|---|---|
| 01 | Knowledge Base estructurada | ✅ Hecho (34 docs, 7 dominios) |
| 02 | Memory Architecture | 🔶 Diseñada (Fase 11), no implementada |
| 03 | Decision Register | ✅ Hecho (26 CURRENT, 2 HISTORICAL, 3 PROPOSED, 11 UNRESOLVED) |
| 04 | Requirements Register | ✅ v1 hecho, ✅ v2 reclasificado en este reporte (9 categorías) |
| 05 | Contradiction Register | ✅ Nuevo en este reporte (8 contradicciones, 1 hallazgo nuevo: C-007) |
| 06 | Skill Registry | ✅ Diseñado en este reporte (8 candidatas), 🔶 no implementado |
| 07 | Workflow Registry | ✅ Diseñado en este reporte (4 candidatos), 🔶 1 parcialmente vivo |
| 08 | Connector Map | 🔶 Esbozado (Fase 5 del roadmap), sin connectors reales todavía |
| 09 | Project Architecture | 🔶 Propuesta en Fase 7, pendiente de tu aprobación para ejecutar |
| 10 | Source of Truth Map | ✅ Nuevo en este reporte |
| 11 | System Architecture | ✅ Nuevo en este reporte (10 capas) |
| 12 | Implementation Roadmap | ✅ Nuevo en este reporte (10 fases) |
| 13 | Governance System | 🔶 Parcial: `CLAUDE.md` + protocolos existen; sync automatizado (WF-04) no construido |
| 14 | Continuous Improvement System | 🔶 Diseñado (Fase 10 del roadmap), no corriendo todavía |

---

## Respuestas recibidas (2026-08-02) y estado de BUILD

1. **Material RAW**: en curso — el usuario va a exportar Claude.ai. Ver `00_RAW_MIGRATION/README.md` y el comando corto entregado para el caso de un chat que llegó a su límite de caracteres.
2. **C-007 (Chile)**: confirmado como mercado activo → **resuelta** (D-028). Sitio y knowledge-base corregidos.
3. **D-001 (IVA)**: confirmado por el founder — comercial 10%, residencial 5%, venta 5% → **resuelta** (D-027). Implementado y con tests de regresión pasando.
   **D-002 (pisos brutos/netos) sigue sin respuesta** — la contestación del usuario solo cubrió IVA. Pendiente de confirmación explícita antes de tratar cualquier veredicto `pasa_piso` como definitivo.
4. **Reestructuración de carpetas (Fase 7)**: aprobada — ejecutada con `git mv` (ver commit correspondiente).
5. **Orden de BUILD**: aprobado — arrancando por SK-03 (`rentabilidad-calculator`) + WF-02 (workflow de evaluación de rentabilidad).
