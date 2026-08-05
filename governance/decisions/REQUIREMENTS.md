# REQUIREMENTS EXTRACTION — Meridiano Capital

Fase 4 del proceso de migración. Requisitos explícitos (dichos literalmente en el material) e implícitos (se derivan necesariamente de una regla o decisión existente aunque no se enuncien como "requisito"), clasificados por dominio y por tipo. Cada uno enlaza a su fuente en `knowledge-base/` o a su entrada en `governance/decisions/DECISION_REGISTER.md`.

## Cómo leer esta tabla

- **Tipo**: `Negocio` (regla comercial/legal) · `Marca` (cumplimiento de identidad) · `Técnico` (sistema/software) · `Operativo` (proceso) · `Gobernanza` (cómo debe comportarse cualquier agente/IA)
- **Explícito/Implícito**: si el material lo dice literalmente o si se deriva por necesidad de otra regla.

---

## REQ-BRAND — Requisitos de marca (aplican a cualquier pieza, canal o sistema)

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RB-01 | Nunca recrear el logo — usar únicamente los SVG fuente en `assets/logos/` | Marca | Explícito | `brand/03-identidad-visual.md` |
| RB-02 | Respetar clearspace, tamaño mínimo y las 6 violaciones prohibidas de uso del logo en cualquier aplicación (web, impreso, digital) | Marca | Explícito | `brand/03-identidad-visual.md` |
| RB-03 | Lapacho dorado nunca como texto de cuerpo (falla WCAG 4.5:1) | Marca | Explícito | `brand/05-sistema-cromatico.md`, D-013 |
| RB-04 | Todo documento/deck debe cerrar con el bloque de firma canónico y pantalla de cierre tierra-colorada | Marca | Explícito | `brand/09-cierres-y-firmas.md` |
| RB-05 | Slides con cifras de retorno deben llevar el disclaimer "cifras ilustrativas, no constituyen garantía" | Marca+Negocio | Explícito | `brand/09-cierres-y-firmas.md` |
| RB-06 | Email de firma correcto: `juancastillo@meridianocapital.net` (no juanjosecastillo); Urbannit: `urbannit@meridianocapital.net` (nunca `Urbannit4@gmail.com`); teléfono `+595 982 853 111` | Marca | Explícito | `brand/09-cierres-y-firmas.md` |
| RB-07 | Listas de origen de clientes deben leer "Europa, Argentina, Brasil, Chile" (nunca separar "Alemania" como línea propia, distinto de estadísticas de mercado que sí pueden nombrar países específicos) | Marca | Explícito | `brand/00-overview.md` |
| RB-08 | Cualquier sub-identidad de proyecto inmobiliario debe seguir el modelo de Marca Endosada: mojón/isotipo de Meridiano siempre presente, con la leyenda "Un desarrollo de Meridiano Capital" | Marca | Explícito | `business/05-proyectos-inmobiliarios.md`, D-019 |
| RB-09 | El sitio/presentación de Urbannit debe mostrar el endoso "gestionado por Meridiano Capital" | Marca | Explícito (pendiente, ver U-001) | `brand/10-arquitectura-meridiano-urbannit.md` |
| RB-10 | Cartera B (intermediación) nunca debe llamarse "Administración" en ninguna pieza de marca/ventas | Marca+Operativo | Explícito | `operations/03-tarifario.md`, D-020 |

## REQ-BUSINESS — Requisitos de negocio

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RN-01 | Modelo A (comisión 5,5%) y Modelo B (fees + carry) nunca deben mezclarse en una misma propuesta/cálculo | Negocio | Explícito | `business/01-dos-modelos-de-negocio.md`, D-016 |
| RN-02 | Nunca mostrar la comisión del 5,5% en materiales de coinversión, ni fees/carry en materiales de inversión individual | Negocio | Explícito | `business/00-overview.md` |
| RN-03 | Selección automática simple/compuesto del hurdle según horizonte (≤24 / >24 meses) | Negocio | Explícito | `business/03-modelo-coinversion.md`, D-018 |
| RN-04 | El tarifario solo se comparte en etapa avanzada del journey del inversor, nunca en primer contacto | Negocio | Explícito | `operations/03-tarifario.md`, D-021 |
| RN-05 | La S.A. sin cédula debe mantener representación legal/síndico de Meridiano mientras el inversor no tenga cédula propia (fee USD 350/mes) | Negocio | Explícito | `business/02-camino-migratorio.md` |
| RN-06 | El journey de 6 etapas debe estar soportado operativamente por la red de aliados nombrada (abogado, escribano, contadora, operador de renta temporal) | Negocio+Operativo | Implícito | `business/04-etapas-del-inversor.md` |
| RN-07 | ~~Pendiente~~ **RESUELTO 2026-08-02** (D-031): fee estructuración 1,5-3% + gestión de obra 2-4% + carried 15-20% sobre hurdle 8% son cifras firmes, validadas cuantitativamente por auditoría | Negocio | Implícito (deriva de D-031, resuelve U-005) | `governance/decisions/DECISION_REGISTER.md#D-031` |
| RN-08 | Ninguna de las 6 sociedades de la Capa 1 (Campo Agreste + 5 S.A. propietarias) puede aparecer en piezas públicas de marca — solo en contratos, facturas y documentación institucional | Negocio+Marca | Explícito `[EXTENSION]` | `business/06-estructura-societaria-y-portfolio.md`, D-029 |

## REQ-LEGAL — Requisitos de cumplimiento (PLA/FT)

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RL-01 | Meridiano/Campo Agreste S.A. debe designar e inscribir un Oficial de Cumplimiento ante SEPRELAD (plataforma SIRO) antes de que el programa P04 tenga plena aplicación | Negocio+Gobernanza | Explícito | `legal/01-p04-manual-compliance.md`, D-032 |
| RL-02 | Todo inversor extranjero (Europa/Argentina/Brasil/Chile) debe pasar por el proceso de DDC/KYC del manual P04 antes de recibir cualquier transferencia de fondos — es el vector de mayor riesgo del negocio | Negocio+Gobernanza | Explícito | `legal/01-p04-manual-compliance.md#2.3` |
| RL-03 | Ante cualquier señal de alerta, nunca informar al cliente (tipping off = delito) — comunicar solo al Oficial de Cumplimiento dentro de 24hs | Gobernanza | Explícito | `legal/01-p04-manual-compliance.md#3.3` |
| RL-04 | Remitir el Reporte de Operaciones (RO) anual dentro de los primeros 20 días de marzo | Operativo | Explícito | `legal/01-p04-manual-compliance.md#4.4` |
| RL-05 | Revisar y actualizar el manual P04 al menos anualmente o ante cambios normativos de SEPRELAD — nunca tratar sus umbrales/plazos como fijos sin verificar la resolución vigente | Gobernanza | Explícito | `legal/01-p04-manual-compliance.md#1.2` |

## REQ-INVESTMENT — Requisitos de cálculo/rentabilidad

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RI-01 | Mostrar siempre neto, nunca solo bruto ("regla de oro") | Negocio | Explícito | `investment/02-politica-de-rentabilidad.md`, D-024 |
| RI-02 | Mostrar siempre las dos TIR juntas (sobre precio total y sobre capital desembolsado) | Negocio | Explícito | `investment/02-politica-de-rentabilidad.md`, D-022 |
| RI-03 | Presentar 3 escenarios (pesimista/base/optimista) antes de mostrar cualquier cifra a un inversor | Negocio | Explícito | `investment/00-overview.md` |
| RI-04 | Las tres categorías de gestión (pasiva / Urbannit-temporal / operador hotelero) no deben mezclarse en materiales de venta | Negocio | Explícito | `investment/00-overview.md` |
| RI-05 | ~~Bloqueante~~ **RESUELTO 2026-08-02** (D-027): IVA diferenciado — comercial 10%, residencial 5%, venta 5% — implementado en `production/app/backend/calculadora.py` | Técnico+Negocio | Implícito (deriva de D-001) | `governance/decisions/DECISION_REGISTER.md#D-027` |
| RI-06 | **Bloqueante**: fijar si los pisos de rentabilidad son brutos o netos antes de confiar en cualquier veredicto `pasa_piso`. Al 2026-08-02 esto es MÁS urgente, no menos: el `CLAUDE.md` de recuperación afirma "BRUTO" pero los tests ya auditados contra un caso real (Habitalis 9A) solo tienen sentido bajo "NETO" — las dos fuentes del propio material se contradicen | Técnico+Negocio | Implícito (deriva de D-002) | `governance/decisions/DECISION_REGISTER.md#D-002` |
| RI-07 | La ocupación realista (55–65%) del refinamiento #8 debe aplicarse también a la rama de alquiler temporal, no solo al genérico | Técnico | Implícito (deriva de D-003) | `governance/decisions/DECISION_REGISTER.md#D-003` |

## REQ-TECH — Requisitos técnicos (para la fase de software funcional)

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RT-01 | La calculadora de la futura app debe implementar exactamente la metodología de `investment/01-metodologia-calculo.md` (TIR doble, 4 niveles netos acumulados, período de trabajo como variable) | Técnico | Explícito | `technology/02-calculadora-rentabilidad.md` |
| RT-02 | Todos los parámetros de mercado deben leerse desde config (`parametros_mercado.json` o su equivalente), nunca hardcodearse en la lógica — corregir las 2 violaciones ya detectadas (costo de limpieza, meses_hasta_pre_pozo) | Técnico | Explícito | D-004 |
| RT-03 | El formulario de contacto necesita un backend real (Formspree/Netlify Forms/custom) — hoy no envía nada | Técnico | Explícito | U-002 |
| RT-04 | Preservar los custom properties CSS del sitio de referencia como design tokens en cualquier reconstrucción — no reinventar la lógica de componentes | Técnico | Explícito | `marketing/01-aplicacion-digital.md` |
| RT-05 | Cualquier catálogo futuro de oportunidades debe estar a ≤2 clics de la home (regla de arquitectura de información) | Técnico | Explícito | `marketing/01-aplicacion-digital.md` |
| RT-06 | No considerar "fiel" ninguna migración de la calculadora hasta resolver RI-05 y RI-06 explícitamente con el responsable de negocio | Técnico+Gobernanza | Explícito | `investment/00-overview.md` |
| RT-07 | Reemplazar los enlaces muertos del footer (`href="#"`) por rutas reales al construir la app | Técnico | Implícito | U-010 |
| RT-08 | Decidir hosting/dominio/proveedor de formularios antes de publicar la app | Técnico | Explícito (pendiente) | U-011 |

## REQ-AI — Requisitos de gobernanza para cualquier agente de IA (incl. Claude Code) trabajando en Meridiano Capital

Estos requisitos deben trasladarse a un `CLAUDE.md` raíz del proyecto para que se apliquen automáticamente en cualquier sesión futura.

| ID | Requisito | Tipo | E/I | Fuente |
|---|---|---|---|---|
| RA-01 | Antes de producir/auditar cualquier activo de marca, consultar `knowledge-base/ai/03-sistema-de-consulta.md` para enrutar a los archivos correctos — nunca responder solo de memoria | Gobernanza | Explícito | `ai/03-sistema-de-consulta.md` |
| RA-02 | Toda regla aplicada debe ser trazable como OFICIAL (del manual docx) o estar explícitamente etiquetada `[EXTENSION]` — no negociable incluso si la extensión "parece obvia" | Gobernanza | Explícito | `ai/02-protocolo-regla-no-definida.md`, D-025 |
| RA-03 | Ante conflicto de reglas, resolver con el orden de prioridad de `ai/01-protocolo-de-prioridad.md` | Gobernanza | Explícito | D-026 |
| RA-04 | Antes de entregar cualquier pieza creativa, correr el audit interno de Brand Guardian (4 pasos) incluida la Matriz de Decisión de 10 criterios; un veredicto NO ALINEADO en reglas duras de logo/color bloquea la entrega sin importar el resto del puntaje | Gobernanza | Explícito | `ai/04-director-creativo-y-brand-guardian.md`, `ai/05-matriz-de-decision.md` |
| RA-05 | Al generar prompts de imagen/video con IA, usar siempre el Prompt Engine de 5 bloques, nunca improvisar paleta u omitir la lista de negativos/a-evitar | Gobernanza | Explícito | `ai/06-prompt-engine.md` |
| RA-06 | Nunca presentar una recomendación creativa nueva como si fuera una regla oficial ya establecida | Gobernanza | Explícito | D-025 |
| RA-07 | Al analizar cualquier oportunidad de inversión, distinguir explícitamente DATOS CONFIRMADOS / SUPUESTOS / ESTIMACIONES / RIESGOS — nunca presentar una estimación con la certeza de un dato confirmado | Gobernanza | Explícito | `ai/07-protocolo-analista-de-inversion.md` |
| RA-08 | Nunca inventar un dato faltante (superficie, renta vigente, valor de adquisición, etc.) — señalarlo explícitamente como faltante | Gobernanza | Explícito | `ai/07-protocolo-analista-de-inversion.md` |
| RA-09 | Nunca prometer rentabilidad garantizada — el 10% neto de cartera es objetivo de referencia, no garantía | Gobernanza | Explícito | `ai/07-protocolo-analista-de-inversion.md` |
| RA-10 | Nunca sustituir al abogado/escribano/contador — Meridiano acompaña y coordina, el acto profesional es siempre del especialista | Gobernanza | Explícito | `ai/07-protocolo-analista-de-inversion.md` |
| RA-11 | Tratar a Juan José Castillo como asesor+desarrollador+operador+estratega de inversión — nunca como corredor/intermediario tradicional que solo necesita precio y ubicación | Gobernanza | Explícito | `ai/07-protocolo-analista-de-inversion.md` |

---

## Resumen de bloqueantes antes de "sistema operativo empresarial completo"

Estos son los únicos ítems que, si no se resuelven, dejan a la futura app funcional produciendo cifras potencialmente incorrectas a inversores reales:

1. ~~RI-05 / D-001 — IVA 5% vs 10%.~~ **RESUELTO 2026-08-02**, ver D-027.
2. **RI-06 / D-002** — pisos de rentabilidad brutos vs. netos. **Sigue pendiente y ahora con evidencia contradictoria de las dos fuentes disponibles (ver D-002 en el Decision Register) — necesita respuesta directa del founder, ninguna fuente escrita alcanza para decidir.**
3. **RI-07 / D-003** — ocupación realista no aplicada a alquiler temporal.

Todo lo demás (formulario de contacto sin backend, enlaces muertos, hosting sin definir, etc.) es deuda de producto normal, no un riesgo de integridad financiera.

## Actualización 2026-08-02 — segunda ronda (paquete de recuperación)

- **RESUELTOS en esta ronda**: RN-07/U-005 (hurdle+carry confirmado y validado por auditoría).
- **NUEVOS bloqueantes de datos** (no de definición, sino de información faltante para poder modelar con precisión): U-012 (cronograma de pagos de obra), U-013 (datos por unidad), U-014 (desagregado de Canarias) — ver `governance/decisions/DECISION_REGISTER.md`. Ninguno bloquea el funcionamiento de la calculadora en sí (que sigue operando con supuestos de mercado), pero sí bloquean cualquier evaluación "en firme" del portfolio real de 53 unidades.
- **Nuevo dominio**: REQ-LEGAL (compliance PLA/FT), no existía en el Requirements Register v1.
