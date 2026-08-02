# Meridiano Capital — instrucciones para Claude Code

Este repo es el sistema operativo de conocimiento y desarrollo de Meridiano Capital, migrado desde conversaciones previas de Claude.ai (vía 3 Claude Skills ya destiladas) el 2026-08-02. Ver `inventory/MIGRATION_INVENTORY.md` para el origen completo.

## Antes de hacer cualquier trabajo de marca, negocio o inversión

1. **Consultar `knowledge-base/ai/03-sistema-de-consulta.md`** para saber qué archivos de `knowledge-base/` leer según el tipo de tarea. No respondas de memoria — este repo existe precisamente para no depender de eso.
2. **Regla de prioridad ante conflicto de reglas** (`knowledge-base/ai/01-protocolo-de-prioridad.md`): Manual de marca oficial > identidad visual > identidad verbal > estrategia/ADN > reglas de canal > recomendaciones creativas.
3. **Toda regla nueva no cubierta por el material existente debe etiquetarse `[EXTENSION]` explícitamente** — nunca presentarse como si fuera oficial, ni siquiera si "parece obvia". Protocolo completo en `knowledge-base/ai/02-protocolo-regla-no-definida.md`.
4. **Antes de entregar cualquier pieza de marca** (deck, web, post, ad, prompt de imagen/video), correr el audit de Brand Guardian: `knowledge-base/ai/04-director-creativo-y-brand-guardian.md` + Matriz de Decisión de 10 criterios (`knowledge-base/ai/05-matriz-de-decision.md`). Un veredicto NO ALINEADO en reglas duras de logo/color bloquea la entrega.
5. **Prompts de imagen/video con IA**: usar siempre el Prompt Engine de 5 bloques (`knowledge-base/ai/06-prompt-engine.md`), nunca improvisar paleta.

## Bloqueantes financieros activos — no ignorar

Antes de confiar en o mostrar cualquier cifra de rentabilidad (propia o generada por `app/backend/calculadora.py`), ver `decisions/DECISION_REGISTER.md` sección "UNRESOLVED de máxima prioridad":

- **D-001**: el código usa IVA 5%, la política declara 10% obligatorio — el neto mostrado puede estar sobrestimado.
- **D-002**: los "pisos de rentabilidad neta" están etiquetados como NETO en el código pero como BRUTO en otra parte del mismo config.

No corrijas estos valores unilateralmente — son decisiones de negocio que requieren al responsable (Juan José Castillo) y a la contadora. Si el usuario te pide trabajar con cifras de rentabilidad, menciona estas advertencias.

## Estructura del repo

- `inventory/` — Fase 1: inventario de todo el material fuente + copias crudas sin modificar (`_raw-copies/`).
- `knowledge-base/` — Fase 2: conocimiento reconstruido (no resumido) por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/`.
- `decisions/` — Fase 3-4: `DECISION_REGISTER.md` (CURRENT/HISTORICAL/DEPRECATED/UNRESOLVED/PROPOSED) y `REQUIREMENTS.md`.
- `assets/` — logos fuente (`.svg`), brandbook (`.png`), manual de marca oficial (`.docx`), sitio de referencia (`.html`).
- `app/` — Fase 5: software funcional. Ver `app/README.md` para cómo correrlo.

## Cómo mantener este repo vigente

Cuando tomes o reemplaces una decisión de negocio/marca/producto durante el trabajo en este repo:
1. Agrégala a `decisions/DECISION_REGISTER.md` con ID secuencial y estado correcto.
2. Si reemplaza una decisión CURRENT, mueve la anterior a HISTORICAL — nunca la borres.
3. Actualiza el archivo de `knowledge-base/` correspondiente para que quede como fuente de verdad vigente.
4. Nunca trates una cifra de `app/backend/calculadora.py` como definitiva si toca D-001 o D-002 sin haberlas resuelto primero.
