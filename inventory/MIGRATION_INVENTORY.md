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

## Totales

- **3 skills**, **35 recursos** catalogados (18 Markdown/JSON de conocimiento, 1 DOCX oficial, 6 SVG, 24 PNG, 1 HTML de referencia, 2 scripts Python).
- **Estado**: 100% marcado como CURRENT — no se encontraron versiones HISTORICAL/DEPRECATED explícitas dentro del material disponible. Esto no significa que no existan decisiones anteriores reemplazadas durante las conversaciones originales — significa que **esas conversaciones no están disponibles para este proceso** (ver Fuentes en decisions/DECISION_REGISTER.md, ítem sobre limitación de trazabilidad).
- **Pendiente**: ninguno bloqueante para iniciar Fase 2. Pendientes de negocio se documentan en Fase 3 (Decision Register) como UNRESOLVED.
