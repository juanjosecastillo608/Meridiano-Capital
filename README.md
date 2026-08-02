# Meridiano Capital

Sistema operativo de conocimiento y desarrollo de Meridiano Capital (real estate & desarrollo en Paraguay para inversores extranjeros), migrado a Claude Code el 2026-08-02 desde 3 Claude Skills que ya destilaban el trabajo de conversaciones previas de Claude.ai.

Reestructurado el 2026-08-02 según la arquitectura de 10 capas del Migration Master Report (ver `documentation/MIGRATION_MASTER_REPORT.md`, Fase 7).

## Mapa del repo

| Carpeta | Capa | Qué contiene |
|---|---|---|
| [`00_RAW_MIGRATION/`](00_RAW_MIGRATION/README.md) | — | Depósito para el export real de Claude.ai (vacío hasta que llegue). Solo lectura. |
| [`inventory/`](inventory/MIGRATION_INVENTORY.md) | ARCHIVE | Inventario completo del material fuente (35 recursos, 3 skills) + copia cruda sin tocar en `_raw-copies/` |
| [`knowledge-base/`](knowledge-base/) | KNOWLEDGE | Conocimiento reconstruido por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/` |
| [`governance/decisions/`](governance/decisions/DECISION_REGISTER.md) | GOVERNANCE | `DECISION_REGISTER.md` (CURRENT/HISTORICAL/DEPRECATED/UNRESOLVED/PROPOSED) y `REQUIREMENTS.md` |
| [`skills/`](skills/) | SKILLS | Capacidades reutilizables (`rentabilidad-calculator`) |
| [`workflows/`](workflows/) | WORKFLOWS | Procesos ejecutables (`rentabilidad-evaluation`) |
| `core/`, `memory/`, `connectors/`, `projects/` | CORE / MEMORY / CONNECTORS / PROJECTS | Resto de la arquitectura — se van poblando según el Implementation Roadmap |
| [`assets/`](assets/) | — | Logos fuente, brandbook, manual de marca oficial, sitio de referencia (archivado) |
| [`production/app/`](production/app/README.md) | PRODUCTION | Software funcional: sitio + calculadora de rentabilidad conectada de verdad |
| [`documentation/MIGRATION_MASTER_REPORT.md`](documentation/MIGRATION_MASTER_REPORT.md) | DOCUMENTATION | Requirements v2, Contradiction Register, arquitectura, roadmap completo |
| [`CLAUDE.md`](CLAUDE.md) | GOVERNANCE | Instrucciones de gobernanza para cualquier sesión de Claude Code que trabaje en este repo |

## Empezar

- Para entender el negocio: [`knowledge-base/business/00-overview.md`](knowledge-base/business/00-overview.md)
- Para entender la marca: [`knowledge-base/brand/00-overview.md`](knowledge-base/brand/00-overview.md)
- Para ver qué está pendiente o en riesgo: [`governance/decisions/DECISION_REGISTER.md`](governance/decisions/DECISION_REGISTER.md) (sección "UNRESOLVED de máxima prioridad" primero)
- Para correr la app: `cd production/app/backend && python server.py`, abrir `http://localhost:8000`

## ⚠️ Pendiente con el responsable de negocio antes de producción

1. ~~IVA en el cálculo de renta neta~~ — **resuelto el 2026-08-02** (D-027): comercial 10%, residencial 5%, venta 5%.
2. Los "pisos de rentabilidad" están etiquetados como neto en un lugar y como bruto en otro del mismo archivo de configuración — **sigue sin resolver**.

Detalle completo en `governance/decisions/DECISION_REGISTER.md#D-002`.
