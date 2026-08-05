# MIGRATION INVENTORY — Meridiano Capital

Fase 1 del proceso de migración. Fuente única confirmada por el usuario: los 3 skills de Claude listados abajo, ya instalados en este entorno. No se detectó material adicional (chats exportados, documentos sueltos) en `Documentos` ni en `.claude`.

**Nota sobre fechas**: el sistema de archivos solo reporta `2026-08-01` para todo el material (fecha de sincronización del plugin de skills en este equipo), no la fecha real de creación durante las conversaciones originales de Claude.ai. Se marca como "sync: 2026-08-01" en vez de fecha de autoría real, que se desconoce.

Copia cruda preservada sin modificar en `inventory/_raw-copies/` como respaldo antes de cualquier reconstrucción.

## Skill: meridiano-capital-identity (Brand Operating System)

| ID | Recurso | Tipo | Fecha | Relevancia | Estado | Dependencias |
|---|---|---|---|---|---|---|
| BRD-00 | SKILL.md | Documento maestro / governance | sync 2026-08-01 | Alta | CURRENT | Referencia todos los módulos 01-16 + Módulos 16-20 (protocolos de comportamiento) |
| BRD-01 | 01-adn-de-marca.md | Estrategia de marca | sync 2026-08-01 | Alta | CURRENT | Base de todos los demás módulos |
| BRD-02 | 02-identidad-verbal.md | Tono, voz, mensajes | sync 2026-08-01 | Alta | CURRENT | Depende de BRD-01 |
| BRD-03 | 03-identidad-visual.md | Logo, uso, clearspace | sync 2026-08-01 | Alta | CURRENT | Depende de BRD-01; usa assets/logos/*.svg |
| BRD-04 | 04-tipografia.md | Sistema tipográfico | sync 2026-08-01 | Media-Alta | CURRENT | Depende de BRD-03 |
| BRD-05 | 05-sistema-cromatico.md | Paleta de color | sync 2026-08-01 | Alta | CURRENT | Depende de BRD-01 |
| BRD-06 | 06-sistema-grafico.md | Elementos gráficos | sync 2026-08-01 | Media | CURRENT | Depende de BRD-03, BRD-05 |
| BRD-07 | 07-direccion-de-arte.md | Dirección de arte | sync 2026-08-01 | Media-Alta | CURRENT | Depende de BRD-01, BRD-05 |
| BRD-08 | 08-sistema-de-imagen.md | Foto/render/video | sync 2026-08-01 | Media | CURRENT | Depende de BRD-07 |
| BRD-09 | 09-aplicacion-digital.md | Web, UX/UI | sync 2026-08-01 | Alta | CURRENT | Depende de BRD-03/04/05; verificado contra sitio de referencia |
| BRD-10 | 10-presentaciones.md | Canva/PPT/Slides/Keynote | sync 2026-08-01 | Media | CURRENT | Depende de BRD-04/05 |
| BRD-11 | 11-redes-sociales.md | Social por plataforma | sync 2026-08-01 | Media | CURRENT | Depende de BRD-02/03/05 |
| BRD-12 | 12-publicidad.md | Campañas/ads/banners | sync 2026-08-01 | Media | CURRENT | Depende de BRD-01/02/03/05 |
| BRD-13 | 13-proyectos-inmobiliarios.md | Sistema para proyectos inmobiliarios | sync 2026-08-01 | Alta | CURRENT | Depende de BRD-02, BRD-10 |
| BRD-14 | 14-prompt-engine-de-marca.md | Prompts IA imagen/video | sync 2026-08-01 | Media-Alta | CURRENT | Depende de BRD-07, BRD-08 |
| BRD-15 | 15-matriz-de-decision.md | Auditoría de alineación (10 criterios) | sync 2026-08-01 | Alta | CURRENT | Usado por Módulo 19 (Brand Guardian) |
| BRD-16 | 16-cierres-y-firmas.md | Estándar de cierre/firma de documentos | sync 2026-08-01 | Media | CURRENT | — |
| BRD-17 | urbannit-y-arquitectura.md | Arquitectura de marca Meridiano↔Urbannit | sync 2026-08-01 | Alta | CURRENT | Transversal; referenciado desde BRD-01 y BRD-13 |
| BRD-18 | Meridiano_Capital_Brand_Guidelines_v1.docx | Manual de marca oficial (fuente de autoridad) | sync 2026-08-01 | Crítica | CURRENT | Fuente de la que derivan BRD-01 a BRD-17 |
| BRD-19 | assets/logos/*.svg (6 archivos) | Logos vectoriales fuente | sync 2026-08-01 | Alta | CURRENT | Usado por BRD-03 |
| BRD-20 | assets/brandbook/*.png (24 archivos) | Ejemplos renderizados de brandbook | sync 2026-08-01 | Media | CURRENT | Índice en BRD-03 |
| BRD-21 | assets/meridiano-capital-sitio-web.html | Implementación de referencia del sitio web | sync 2026-08-01 | Alta | CURRENT | Fuente de verificación de BRD-09; insumo directo para Fase de software funcional |

## Skill: meridiano-investor-journey

| ID | Recurso | Tipo | Fecha | Relevancia | Estado | Dependencias |
|---|---|---|---|---|---|---|
| INV-00 | SKILL.md | Documento maestro | sync 2026-08-01 | Alta | CURRENT | Referencia los 6 archivos siguientes |
| INV-01 | camino-migratorio.md | Proceso/estrategia (inversión ligada a migración) | sync 2026-08-01 | Alta | CURRENT | Relacionado con INV-03, INV-04 |
| INV-02 | dos-modelos-de-negocio.md | Modelo de negocio (2 líneas) | sync 2026-08-01 | Crítica | CURRENT | Base de BRD-13 y de módulo INVESTMENT |
| INV-03 | etapas-detalle.md | Etapas del customer/investor journey | sync 2026-08-01 | Alta | CURRENT | Depende de INV-02 |
| INV-04 | modelo-coinversion.md | Modelo de coinversión | sync 2026-08-01 | Alta | CURRENT | Depende de INV-02 |
| INV-05 | onboarding-bancario.md | Proceso operativo (banca) | sync 2026-08-01 | Media-Alta | CURRENT | Depende de INV-01 |
| INV-06 | tarifario.md | Tarifas/pricing | sync 2026-08-01 | Alta | CURRENT | Depende de INV-02 |
| INV-07 | assets/checklist-inversor.md | Checklist operativo | sync 2026-08-01 | Media-Alta | CURRENT | Depende de INV-03, INV-05 |

## Skill: meridiano-rentabilidad

| ID | Recurso | Tipo | Fecha | Relevancia | Estado | Dependencias |
|---|---|---|---|---|---|---|
| REN-00 | SKILL.md | Documento maestro | sync 2026-08-01 | Alta | CURRENT | Referencia los archivos siguientes |
| REN-01 | metodologia-calculo.md | Metodología de cálculo de rentabilidad | sync 2026-08-01 | Crítica | CURRENT | Base de REN-03 (calculadora) |
| REN-02 | politica-completa.md | Política de rentabilidad completa | sync 2026-08-01 | Crítica | CURRENT | Depende de INV-02, INV-06 |
| REN-03 | config/parametros_mercado.json | Parámetros de mercado (config viva) | sync 2026-08-01 | Alta | CURRENT | Usado por REN-04 |
| REN-04 | scripts/calculadora.py | Calculadora funcional de rentabilidad | sync 2026-08-01 | Crítica | CURRENT | Implementa REN-01; depende de REN-03 |
| REN-05 | scripts/test_calculadora.py | Tests de la calculadora | sync 2026-08-01 | Media | CURRENT | Depende de REN-04 |

## Addendum — Segunda fuente: paquete de recuperación (2026-08-02)

El usuario entregó un segundo paquete (157 archivos, 11MB), producido por él en otra sesión de Claude, con la intención explícita de recuperar contexto que la migración original (3 skills) no capturaba. Depositado sin modificar en `00_RAW_MIGRATION/claude-recovery-2026-08-02/` (regla de no-destrucción del pipeline RAW). Re-procesado siguiendo el mismo rigor de Fase 2-5.

**Hallazgo clave del diff**: las carpetas `skills/` de este paquete son **byte-idénticas** a `inventory/_raw-copies/` (verificado con `diff -q` sobre los 3 SKILL.md, todos los `references/*.md` y `scripts/*.py`) — no aportan nada nuevo por sí mismas. Todo el valor agregado real está en `historico/`, `entregables/` y `generadores/`, que no tienen equivalente en la migración original.

| ID | Recurso | Tipo | Relevancia | Estado | Dependencias |
|---|---|---|---|---|---|
| REC-00 | `CLAUDE.md` / `MERIDIANO_RECUPERACION.md` (idénticos) | Síntesis + transcripción destilada de 4 sesiones (~52 turnos) | Crítica | CURRENT | Fuente de la mayoría de las decisiones nuevas registradas en esta ronda |
| REC-01 | `historico/Master_Project_Map.md` | Índice maestro, Fase 0 cerrada | Alta | CURRENT (histórico, 24-jul) | Consolidado por REC-00 |
| REC-02 | `historico/Capa_01_Registro_Patrimonial_v3.md` | Estructura societaria + portfolio 53 unidades | Crítica | CURRENT | Migrado a `knowledge-base/business/06-*.md` |
| REC-03 | `historico/Chat_Architecture_Report_01/02/03_Marca.md` | Reportes intermedios, superados por Master_Project_Map | Media | HISTORICAL | No releídos línea por línea — consolidados en REC-01 |
| REC-04 | `historico/P07_Politica_Rentabilidad_borrador1..6` + `_FINAL` + `_referencia_v7.md` | Evolución de la política de rentabilidad | Alta (trazabilidad) | HISTORICAL | Superados por `skills/meridiano-rentabilidad` (ya migrado); no releídos en detalle esta ronda — quedan como rastro de auditoría disponible si hace falta reconstruir el "por qué" de un valor puntual |
| REC-05 | `historico/Project_Charters_P07_P08_P09_P10.md`, `Verificacion_y_Plan_de_Proyectos.md`, `Plan_de_Desarrollo_Fase_2.md`, `Prompt_Transferencia_Proyecto.md` | Planificación interna de la sesión de recuperación | Baja para este repo | ARCHIVE | No releídos — son meta-proceso de cómo se armó el paquete, no conocimiento de negocio |
| REC-06 | `entregables/auditorias/*.md` (3 archivos) | Auditorías financieras reales | Crítica | CURRENT | Migrado a `knowledge-base/investment/04-auditorias-financieras.md` |
| REC-07 | `entregables/legal/Meridiano_P04_Manual_Compliance.pdf/.docx` | Manual de compliance PLA/FT | Crítica | CURRENT | Migrado a `knowledge-base/legal/` (dominio nuevo) |
| REC-08 | `entregables/decks/*.pptx/.pdf` (4 piezas) | Entregables de marca terminados | Alta | CURRENT | Migrado a `knowledge-base/marketing/05-entregables-producidos.md` |
| REC-09 | `entregables/outreach/*` | Piezas de outreach en frío | Media | CURRENT | Migrado a `knowledge-base/marketing/05-entregables-producidos.md` |
| REC-10 | `generadores/*.js` + `deck_build/` | Pipeline Node.js de generación de decks | Alta | CURRENT | Migrado a `knowledge-base/technology/04-generadores-de-entregables.md` |
| REC-11 | `skills/*` (3 skills completas) | Idéntico a `inventory/_raw-copies/` | — | DUPLICADO CONFIRMADO | Ya migrado — no reprocesado |

## Totales

### Fuente 1 — 3 skills originales (2026-08-02, primera entrega)
- **3 skills**, **35 recursos** catalogados (18 Markdown/JSON de conocimiento, 1 DOCX oficial, 6 SVG, 24 PNG, 1 HTML de referencia, 2 scripts Python).
- **Estado**: 100% marcado como CURRENT al momento de esa entrega — no se encontraron versiones HISTORICAL/DEPRECATED explícitas.

### Fuente 2 — paquete de recuperación (2026-08-02, segunda entrega, ver Addendum arriba)
- **157 archivos, 11MB.** De estos, ~65 archivos (las 3 carpetas `skills/`) son duplicado confirmado de la Fuente 1. El resto (~92 archivos: `historico/`, `entregables/`, `generadores/`) es contenido genuinamente nuevo.
- **Con esta segunda fuente, ya no es cierto que "no existan versiones HISTORICAL"** — `historico/` contiene 6 borradores + 1 versión de referencia de la política de rentabilidad (P07), y la transcripción de sesión documenta explícitamente decisiones descartadas (ver `governance/decisions/DECISION_REGISTER.md`).
- **Pendiente**: ninguno bloqueante. Los `historico/P07_Politica_Rentabilidad_borrador*.md` y los `Chat_Architecture_Report_*.md` no se releyeron línea por línea en esta ronda (quedaron consolidados por `Master_Project_Map.md` y el propio `CLAUDE.md` de recuperación) — disponibles para una relectura futura si hace falta reconstruir el detalle de una decisión puntual.
