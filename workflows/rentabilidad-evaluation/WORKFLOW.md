# WF-02 · Rentabilidad Evaluation Workflow

Capa WORKFLOWS (`documentation/MIGRATION_MASTER_REPORT.md`, Fase 10 — Workflow Discovery). Es el workflow con mayor prioridad de automatización del roadmap: ya tenía código funcional y probado (`production/app/backend/calculadora.py`) antes de formalizarse como workflow.

## INPUT
Datos de una propiedad: `clase`, `precio_compra`, `renta_mensual_bruta` (y opcionalmente `valor_actual` + `meses_tenencia` si se evalúa retorno combinado).

## PROCESS
Ejecuta la skill `rentabilidad-calculator` (SK-03) — `skills/rentabilidad-calculator/calcular.py` — que a su vez llama a `Calculadora.evaluar_renta()` / `evaluar_retorno_combinado()` en `production/app/backend/calculadora.py`. Nunca recalcula a mano.

## DECISION
1. ¿`pasa_piso`? Si no, ¿la plusvalía combinada (`evaluar_retorno_combinado`) cubre la diferencia? (ver `_leer_combinado` en `calculadora.py`).
2. ¿El destino del resultado es material para un inversor externo? Si sí, ir a VALIDATION antes de ACTION.

## ACTION
Generar el resumen de rentabilidad: yield bruto + neto (regla de oro, nunca solo bruto), piso de referencia, veredicto, desglose de gastos.

**Pendiente `[EXTENSION — no implementado]`**: el diseño original (RI-03, FUN-05) pide presentar siempre 3 escenarios (pesimista/base/optimista) antes de mostrar cifras a un inversor. Este workflow **todavía no genera los 3 escenarios automáticamente** — no existe en el material fuente una metodología definida de cuánto varía cada escenario (% de vacancia, renta, etc.), y no corresponde inventar esos porcentajes sin confirmación de negocio. Hoy: correr `calcular.py` manualmente 3 veces con supuestos distintos si se necesita la tabla completa.

## VALIDATION
Antes de entregar el resultado a un inversor real (no interno/exploratorio), verificar el estado de `governance/decisions/DECISION_REGISTER.md`:
- **D-001 (IVA) — ✅ RESUELTA.** Ya no bloquea.
- **D-002 (pisos brutos/netos) — 🔴 UNRESOLVED.** Cualquier veredicto `pasa_piso` debe presentarse con esa reserva explícita.
- **D-003 (ocupación temporal) — 🔴 UNRESOLVED.** Para clases `temporal_*`, la ocupación realista (55-65%) del refinamiento #8 todavía no se aplica en `evaluar_renta()` — el resultado puede estar sobreestimado para esas clases.

El campo `advertencias` que devuelve la skill ya refleja este estado — nunca lo omitas ni lo resumas al presentar el resultado.

## OUTPUT
Resumen de rentabilidad (JSON de la skill) + advertencias, listo para conversación con un inversor o para registro interno.

## LEARNING
Cada evaluación se puede registrar en un historial local para calibrar futuros ajustes de parámetros — el mismo patrón que ya se usó manualmente para auditar Habitalis 9A y Edificio Austria (ver los refinamientos en `knowledge-base/investment/02-politica-de-rentabilidad.md`).

```bash
python workflows/rentabilidad-evaluation/registrar_evaluacion.py \
  --clase comercial --precio 100000 --renta 1000 --nota "Local X, visto en visita del 2026-08-02"
```

Guarda en `workflows/rentabilidad-evaluation/historial_evaluaciones.jsonl` (gitignored — puede contener direcciones/precios de propiedades específicas, tratado igual que `production/app/backend/data/*.jsonl`). No se analiza ni se resume automáticamente todavía — es acumulación cruda para una futura revisión manual o para alimentar `contradiction-scanner` (SK-07, no implementada) cuando el volumen lo justifique.

## Orden de automatización (recordatorio de la Fase 10 del reporte)
WF-02 (este) → WF-04 (Contradiction & Decision Sync) → WF-03 (Brand Content QA) → WF-01 (Investor Onboarding, bloqueado por OPS-03/04/05).
