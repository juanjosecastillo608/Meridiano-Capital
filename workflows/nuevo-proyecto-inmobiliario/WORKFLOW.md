# WF-03 · Nuevo Proyecto Inmobiliario Workflow

Capa WORKFLOWS. Es el "comando maestro" que pide el prompt maestro Real Estate Intelligence OS (§25): el punto de entrada de cualquier análisis nuevo, para que consuma `knowledge-base/investment/market-intelligence/` en vez de reconstruirlo desde cero — regla **"nuevo proyecto ≠ nueva base"** (§26), ya vigente de facto vía el patrón cross-cutting (D-063 a D-073) y ahora formalizada acá.

## INPUT

- **Tipo de proyecto** — el workflow arranca preguntando esto explícitamente (§25 del prompt maestro): "desarrollo nuevo", "compra de terreno", "compra de unidad terminada", "análisis de venta/tasación para un cliente que capta Meridiano".
- **Barrio/zona** del proyecto.
- Según el tipo: superficie, calidad target, tipología, o el precio que se quiere validar.

## PROCESS

1. **Diagnóstico de cobertura** — `python workflows/nuevo-proyecto-inmobiliario/iniciar_diagnostico.py --barrio "..." --tipo-proyecto "..."`, que corre `market-intelligence-lookup` (SK-11) sobre las 5 bases y devuelve qué ya existe vs. qué hay que relevar.
2. **Si hay cobertura suficiente** (`hay_suficiente_dato_real: true`): seguir directo a los motores —
   - `construction-cost-engine` (SK-12) para el costo de construcción.
   - `market-price-validation` (SK-13) para verificar cualquier precio de venta propuesto contra comparables reales.
   - `rentabilidad-calculator` (SK-03) para el modelo financiero de renta/reventa.
3. **Si falta cobertura**: relevar los datos faltantes (mismo método que `HERRERA-001` — búsqueda web, Century 21/RE/MAX/InfoCasas, o cotización directa) y **agregarlos primero a la base cross-cutting correspondiente** en `market-intelligence/`, no solo al archivo del caso nuevo. El caso nuevo cita la base, no la duplica.
4. **Documentar el proyecto** como `contracts/cases/<CASO-ID>/`, siguiendo el patrón ya establecido por D-054 (README índice, numeración secuencial de archivos de análisis).

## DECISION

1. ¿La cobertura de Market Intelligence es mayormente categoría A/B, o predominan C/D? Si predominan datos pendientes, cualquier recomendación debe presentarse explícitamente como **preliminar**, no firme.
2. ¿Alguna regla cross-cutting del `DECISION_REGISTER.md` (D-063 a D-073, IVA D-001/045, pisos de rentabilidad D-002/033) aplica directo, o el proyecto tiene una particularidad que requiere una decisión nueva del founder? Si es nueva, seguir el protocolo de `[EXTENSION]` (`knowledge-base/ai/02-protocolo-regla-no-definida.md`) — nunca asumir que una regla de otro caso aplica sin confirmar.
3. ¿El precio de venta propuesto clasifica MARKET/ABOVE MARKET/SIGNIFICANTLY ABOVE MARKET? Si es SIGNIFICANTLY ABOVE, señalarlo explícitamente antes de avanzar con esa política de precio.

## ACTION

Generar el caso completo en `contracts/cases/<CASO-ID>/`, con memorándum de inversión (mismo patrón que `HERRERA-001/34-...md`) cuando el análisis esté completo.

## VALIDATION

- Correr `market-price-validation` (SK-13) antes de fijar cualquier política de precio — nunca fijarla solo por comparación cualitativa.
- Verificar el estado vigente de `governance/decisions/DECISION_REGISTER.md` antes de asumir cualquier supuesto de modelo — usar `knowledge-base/investment/assumptions/ASSUMPTIONS_REGISTER.md` como índice rápido.
- Correr el Brand Guardian (`knowledge-base/ai/04-...md` + `05-matriz-de-decision.md`) antes de entregar cualquier pieza formal a un inversor (memorándum, presentación).

## OUTPUT

Caso completo en `contracts/cases/<CASO-ID>/` + memorándum de inversión + (opcional) presentación simplificada para inversores, siguiendo el patrón ya probado en `HERRERA-001`.

## LEARNING

**Este es el paso que cierra el ciclo del §27-28 del prompt maestro (Sistema de Aprendizaje Continuo / Market Intelligence Loop).** Antes de cerrar el caso:

1. Revisar qué dato nuevo generó este proyecto que sea reutilizable — cualquier costo, precio, comparable, tipología o metodología que el founder haya calificado como aplicable "a otros proyectos"/"para todos los casos".
2. Promoverlo a `market-intelligence/` (o `methodologies/`, si es un procedimiento) con su propio D-ID en `DECISION_REGISTER.md` — mismo patrón que D-063 a D-073.
3. **Nunca dejarlo solo en el archivo del caso** — si es reutilizable y queda solo ahí, el próximo proyecto lo va a tener que redescubrir de cero, que es exactamente el problema que este sistema existe para resolver.

## Precedente — HERRERA-001 como caso fundacional

`HERRERA-001` es el `FOUNDATIONAL PROJECT` de este sistema (ver su `README.md`) — todas las bases, metodologías y skills de `market-intelligence/` nacieron de ese caso. Este workflow formaliza, para el próximo proyecto, el proceso que en `HERRERA-001` se hizo manualmente conversación por conversación.
