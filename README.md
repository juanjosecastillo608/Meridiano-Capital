# Meridiano Capital

**Este es el único workspace oficial** — `origin` apunta a `https://github.com/juanjosecastillo608/Meridiano-Capital.git`, rama `master`. Historial limpiado de PII el 2026-08-29 (`D-093`, ver `governance/PII_POLICY.md`); cualquier otra copia de esta carpeta en el sistema (histórica o de respaldo) no debe usarse para desarrollo.

Sistema operativo de conocimiento y desarrollo de Meridiano Capital (real estate & desarrollo en Paraguay para inversores extranjeros), migrado a Claude Code el 2026-08-02 desde 3 Claude Skills que ya destilaban el trabajo de conversaciones previas de Claude.ai.

Reestructurado el 2026-08-02 según la arquitectura de 10 capas del Migration Master Report (ver `documentation/MIGRATION_MASTER_REPORT.md`, Fase 7).

## Mapa del repo

| Carpeta | Capa | Qué contiene |
|---|---|---|
| [`00_RAW_MIGRATION/`](00_RAW_MIGRATION/README.md) | — | Depósito para el export real de Claude.ai (vacío hasta que llegue). Solo lectura. |
| [`inventory/`](inventory/MIGRATION_INVENTORY.md) | ARCHIVE | Inventario completo del material fuente (35 recursos, 3 skills) + copia cruda sin tocar en `_raw-copies/` |
| [`knowledge-base/`](knowledge-base/) | KNOWLEDGE | Conocimiento reconstruido por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/` |
| [`governance/decisions/`](governance/decisions/DECISION_REGISTER.md) | GOVERNANCE | `DECISION_REGISTER.md` (CURRENT/HISTORICAL/DEPRECATED/UNRESOLVED/PROPOSED) y `REQUIREMENTS.md` |
| [`skills/`](skills/) | SKILLS | Capacidades reutilizables — `rentabilidad-calculator` (SK-03) + las 6 skills del Real Estate Intelligence OS (SK-11 a SK-18: mercado, costos, geocoding, AMC de alquiler, Project/Unit/Parking DB, target yield, informe de inversor de 30 puntos) |
| [`workflows/`](workflows/) | WORKFLOWS | Procesos ejecutables (`rentabilidad-evaluation`, `nuevo-proyecto-inmobiliario`) |
| `core/`, `memory/`, `connectors/`, `projects/` | CORE / MEMORY / CONNECTORS / PROJECTS | Resto de la arquitectura — se van poblando según el Implementation Roadmap |
| [`assets/`](assets/) | — | Logos fuente, brandbook, manual de marca oficial, sitio de referencia (archivado) |
| [`production/app/`](production/app/README.md) | PRODUCTION | Software funcional: sitio + calculadora de rentabilidad conectada de verdad |
| [`documentation/MIGRATION_MASTER_REPORT.md`](documentation/MIGRATION_MASTER_REPORT.md) | DOCUMENTATION | Requirements v2, Contradiction Register, arquitectura, roadmap completo |
| [`CLAUDE.md`](CLAUDE.md) | GOVERNANCE | Instrucciones de gobernanza para cualquier sesión de Claude Code que trabaje en este repo |

## Empezar

- **Para saber en qué seguir trabajando ahora**: [`governance/PRIORITY_PLAN.md`](governance/PRIORITY_PLAN.md) — todo lo abierto (Decision Register + especificación del Real Estate Intelligence OS), ordenado por prioridad de ejecución y actualizado a medida que se cierra cada ítem. Es el punto de entrada de cualquier sesión nueva.
- Para entender el negocio: [`knowledge-base/business/00-overview.md`](knowledge-base/business/00-overview.md)
- Para entender la marca: [`knowledge-base/brand/00-overview.md`](knowledge-base/brand/00-overview.md)
- Para ver el historial completo de decisiones (qué se resolvió, cuándo y por qué): [`governance/decisions/DECISION_REGISTER.md`](governance/decisions/DECISION_REGISTER.md)
- Para correr la app: `cd production/app/backend && python server.py`, abrir `http://localhost:8000`

## Pendientes activos

Ninguna UNRESOLVED de impacto financiero directo queda abierta a la fecha
(la última, D-004, se cerró el 2026-08-28 — ver `D-089`). Todo lo demás que
sigue abierto —decisiones rápidas que le faltan al founder, trabajo
bloqueado por una acción externa (fotos, abogado, deploy), investigación de
datos pendiente, e ítems pausados a propósito— está consolidado y priorizado
en [`governance/PRIORITY_PLAN.md`](governance/PRIORITY_PLAN.md), no acá.
