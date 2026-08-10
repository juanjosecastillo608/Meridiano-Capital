# Meridiano Capital — instrucciones para Claude Code

Este repo es el sistema operativo de conocimiento y desarrollo de Meridiano Capital, migrado desde conversaciones previas de Claude.ai (vía 3 Claude Skills ya destiladas) el 2026-08-02. Ver `inventory/MIGRATION_INVENTORY.md` para el origen completo.

## Antes de hacer cualquier trabajo de marca, negocio o inversión

1. **Consultar `knowledge-base/ai/03-sistema-de-consulta.md`** para saber qué archivos de `knowledge-base/` leer según el tipo de tarea. No respondas de memoria — este repo existe precisamente para no depender de eso.
2. **Regla de prioridad ante conflicto de reglas** (`knowledge-base/ai/01-protocolo-de-prioridad.md`): Manual de marca oficial > identidad visual > identidad verbal > estrategia/ADN > reglas de canal > recomendaciones creativas.
3. **Toda regla nueva no cubierta por el material existente debe etiquetarse `[EXTENSION]` explícitamente** — nunca presentarse como si fuera oficial, ni siquiera si "parece obvia". Protocolo completo en `knowledge-base/ai/02-protocolo-regla-no-definida.md`.
4. **Antes de entregar cualquier pieza de marca** (deck, web, post, ad, prompt de imagen/video), correr el audit de Brand Guardian: `knowledge-base/ai/04-director-creativo-y-brand-guardian.md` + Matriz de Decisión de 10 criterios (`knowledge-base/ai/05-matriz-de-decision.md`). Un veredicto NO ALINEADO en reglas duras de logo/color bloquea la entrega.
5. **Prompts de imagen/video con IA**: usar siempre el Prompt Engine de 5 bloques (`knowledge-base/ai/06-prompt-engine.md`), nunca improvisar paleta.

## Bloqueantes financieros activos — no ignorar

Antes de confiar en o mostrar cualquier cifra de rentabilidad (propia o generada por `production/app/backend/calculadora.py`), ver `governance/decisions/DECISION_REGISTER.md`:

- **D-001 — RESUELTA (2026-08-02)**: IVA diferenciado, confirmado por Juan José Castillo (founder): alquiler comercial 10%, alquiler residencial 5%, venta/reventa 5%. Implementado como `D-027`. Las clases `temporal_*` (Urbannit) usan el residencial 5% por inferencia `[EXTENSION]` — no confirmado explícitamente para renta temporal/turística.
- **D-002 — RESUELTA (mecanismo D-033, 2026-08-09; valores reales D-044, 2026-08-10)**: los pisos de rentabilidad se comparan siempre en BRUTO, con valores reales de mercado (`Tabla de Rentabilidades Alquiler.xlsx`) para comercial, casa, departamento sin/con muebles y Airbnb-departamento. Sigue sin dato real "casa Airbnb" (`temporal_casa`, estimación sin cambios) y la matriz por zona/calidad (P-004) — ver `knowledge-base/investment/05-matriz-pisos-techos.md`.
- **D-003 — sigue UNRESOLVED**: la ocupación realista (55-65%) no se aplica en la rama de alquiler temporal de `evaluar_renta()`.

## Estructura del repo

Reestructurada el 2026-08-02 según la arquitectura de 10 capas aprobada en `documentation/MIGRATION_MASTER_REPORT.md` (Fase 7). Los movimientos se hicieron con `git mv` — el historial se conserva.

- `00_RAW_MIGRATION/` — depósito para el export real de Claude.ai cuando llegue (vacío hasta entonces, ver su `README.md`). Solo lectura para el proceso de migración, nunca se edita.
- `inventory/` — Fase 1: inventario de todo el material fuente + copias crudas sin modificar (`_raw-copies/`, ARCHIVE).
- `knowledge-base/` — capa KNOWLEDGE: conocimiento reconstruido (no resumido) por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/`.
- `governance/decisions/` — capa GOVERNANCE: `DECISION_REGISTER.md` (CURRENT/HISTORICAL/DEPRECATED/UNRESOLVED/PROPOSED) y `REQUIREMENTS.md`.
- `assets/` — logos fuente (`.svg`), brandbook (`.png`), manual de marca oficial (`.docx`), sitio de referencia (`.html`, archivado — no editar, la copia viva está en `production/app/frontend/`).
- `production/app/` — capa PRODUCTION: software funcional. Ver `production/app/README.md` para cómo correrlo.
- `core/`, `memory/`, `skills/`, `connectors/`, `workflows/`, `projects/` — resto de la arquitectura de 10 capas. Se van poblando durante el Implementation Roadmap (`documentation/MIGRATION_MASTER_REPORT.md`, Fase 12); `skills/` y `workflows/` ya tienen su primer contenido real (`rentabilidad-calculator`, `rentabilidad-evaluation`).
- `documentation/` — capa DOCUMENTATION: `MIGRATION_MASTER_REPORT.md` y demás referencia sobre el sistema mismo. (`README.md` y este `CLAUDE.md` quedan en la raíz por convención — GitHub y Claude Code los cargan desde ahí.)

## Cómo mantener este repo vigente

Cuando tomes o reemplaces una decisión de negocio/marca/producto durante el trabajo en este repo:
1. Agrégala a `governance/decisions/DECISION_REGISTER.md` con ID secuencial y estado correcto.
2. Si reemplaza una decisión CURRENT, mueve la anterior a HISTORICAL — nunca la borres.
3. Actualiza el archivo de `knowledge-base/` correspondiente para que quede como fuente de verdad vigente.
4. Nunca trates una cifra de `production/app/backend/calculadora.py` como definitiva si toca D-001 o D-002 sin haberlas resuelto primero.
