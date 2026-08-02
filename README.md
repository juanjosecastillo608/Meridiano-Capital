# Meridiano Capital

Sistema operativo de conocimiento y desarrollo de Meridiano Capital (real estate & desarrollo en Paraguay para inversores extranjeros), migrado a Claude Code el 2026-08-02 desde 3 Claude Skills que ya destilaban el trabajo de conversaciones previas de Claude.ai.

## Mapa del repo

| Carpeta | Qué contiene |
|---|---|
| [`inventory/`](inventory/MIGRATION_INVENTORY.md) | Inventario completo del material fuente (35 recursos, 3 skills) + copia cruda sin tocar en `_raw-copies/` |
| [`knowledge-base/`](knowledge-base/) | Conocimiento reconstruido por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/` |
| [`decisions/DECISION_REGISTER.md`](decisions/DECISION_REGISTER.md) | Registro de decisiones con trazabilidad CURRENT / HISTORICAL / DEPRECATED / UNRESOLVED / PROPOSED |
| [`decisions/REQUIREMENTS.md`](decisions/REQUIREMENTS.md) | Requisitos explícitos e implícitos, por dominio |
| [`assets/`](assets/) | Logos fuente, brandbook, manual de marca oficial, sitio de referencia |
| [`app/`](app/README.md) | Software funcional: sitio + calculadora de rentabilidad conectada de verdad |
| [`CLAUDE.md`](CLAUDE.md) | Instrucciones de gobernanza para cualquier sesión de Claude Code que trabaje en este repo |

## Empezar

- Para entender el negocio: [`knowledge-base/business/00-overview.md`](knowledge-base/business/00-overview.md)
- Para entender la marca: [`knowledge-base/brand/00-overview.md`](knowledge-base/brand/00-overview.md)
- Para ver qué está pendiente o en riesgo: [`decisions/DECISION_REGISTER.md`](decisions/DECISION_REGISTER.md) (sección "UNRESOLVED de máxima prioridad" primero)
- Para correr la app: `cd app/backend && python server.py`, abrir `http://localhost:8000`

## ⚠️ Dos cosas que hay que resolver con el responsable de negocio antes de producción

1. IVA en el cálculo de renta neta: el código usa 5%, la política escrita dice 10% obligatorio.
2. Los "pisos de rentabilidad" están etiquetados como neto en un lugar y como bruto en otro del mismo archivo de configuración.

Detalle completo en `decisions/DECISION_REGISTER.md#D-001` y `#D-002`.
