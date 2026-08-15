Estado: CURRENT — costo de entrada definitivo por Ángulo (cierra la corrección de doble conteo de `13-...md`)
Fuente original: instrucciones del founder, 2026-08-15 (séptimo mensaje del día)
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-15

# Costo de entrada definitivo por Ángulo

## 0. Resumen de lo que resuelve este documento

1. **Confirma que el techo de USD 1.400/m² (`13-...md` §1.3) es sobre el costo de REPOSICIÓN**, no sobre el costo real que paga Meridiano — son dos magnitudes distintas, ninguna reemplaza a la otra.
2. **Fija el % de costo de Proyecto que sí aplica al Ángulo 2/3**: 30% sin piso adicional, 40% con piso adicional — cierra el ítem 31 de `01-informacion-critica-faltante.md`.
3. Deja el **costo de entrada definitivo por Ángulo**, listo para usar en el recálculo de márgenes/piso de renta pendiente desde `10-...md`.

---

## 1. El techo de USD 1.400/m² es sobre costo de reposición — confirmado

*"Los USD 1.400 se refieren al costo de reposición."*

Esto confirma la segunda interpretación presentada en `13-correccion-doble-conteo-proyecto-plusvalia-real-y-renta-de-mercado.md`, sección 1.3 — el techo de USD 1.400/m² es un **chequeo de razonabilidad** (¿es más barato comprar este edificio parcialmente construido que construir el mismo edificio 100% desde cero?), no el costo real que Meridiano paga por el trato. **El costo de reposición ya calculado (USD 1.279,71–1.345,62/m², según qué referencia de terreno se use) cae bajo el techo en las tres variantes** — el trato pasa este chequeo con margen, igual que ya había pasado el chequeo ±10% de los USD 490.000 (`10-...md` §3).

**Importante no confundir esto con el costo de entrada real** (`13-...md`, USD 1.569,21/m² para el Ángulo 1) — ese es el número que sí se usa para calcular márgenes, piso de renta y todo el resto del modelo financiero. El costo de reposición de USD 1.400 es solo la validación de que el precio del trato es razonable frente a la alternativa de construir desde cero — no reemplaza al costo de entrada real en ningún cálculo de rentabilidad.

## 2. % de costo de Proyecto para Ángulo 2/3 — confirmado

*"Para los porcentajes sería un 30% para el caso del proyecto sin piso adicional, y 40% para el caso de sumar un piso adicional."*

| Ángulo | % del costo de Proyecto de referencia que aplica |
|---|---|
| Ángulo 1 (tal cual, sin modificaciones) | 0% — ya incluido en el precio de compra (`13-...md` §1.1) |
| Ángulo 3 (fachada + tipologías chicas, sin piso adicional) | **30%** |
| Ángulo 2 (fachada + tipologías chicas + piso adicional) | **40%** |

**Nota — la línea de "Aprobaciones e imprevistos" no fue parte de esta corrección**: el founder habló específicamente del "valor del proyecto" (honorarios de diseño/ingeniería), no de las tasas municipales de aprobación — esa línea se mantiene igual que antes de `13-...md` para el Ángulo 2/3 (sin reducir), a diferencia del Ángulo 1 donde sí se eliminó completa. **Queda como pregunta abierta**: ¿el rediseño del Ángulo 2/3 también requiere un trámite municipal nuevo (por el cambio de fachada/subdivisión/piso adicional) que debería sumarse aparte, o la línea de Aprobaciones ya vigente lo cubre? No se asume una respuesta.

## 3. Costo de entrada definitivo por Ángulo (categoría B — calculado desde A)

| | Ángulo 1 (tal cual) | Ángulo 3 (fachada+chicas, 6P) | Ángulo 2 (fachada+chicas+7P) |
|---|---|---|---|
| Adquisición | USD 850.000,00 | USD 850.000,00 | USD 850.000,00 |
| Construcción (21%/650/750, `10-...md` §2) | USD 1.974.581,03 | USD 1.974.581,03 | USD 2.199.581,03 |
| Proyecto | — (0%, ya en adquisición) | USD 84.051,81 (30% de USD 280.172,70) | USD 122.869,08 (40% de USD 307.172,70) |
| Aprobaciones e imprevistos | — (ya en adquisición) | USD 101.173,48 (sin reducir) | USD 101.173,48 (sin reducir) |
| **Inversión Total** | **USD 2.824.581,03** | **USD 3.009.806,32** | **USD 3.273.623,59** |
| Área comercializable | 1.800 m² | 1.800 m² | 2.100 m² |
| **Costo/m² comercializable** | **USD 1.569,21** | **USD 1.672,11** | **USD 1.558,87** |

**Lectura**: con la corrección completa, el Ángulo 2 (7 pisos, con piso adicional) vuelve a ser el de menor costo por m² comercializable de los tres — más área vendible diluye mejor los costos fijos de adquisición, incluso pagando un % de Proyecto más alto (40% vs. 30%). Esto es consistente con la lectura que ya venía sosteniéndose desde `05-...md`/`06-...md` (el Ángulo 2 es el escenario más atractivo en número), ahora con el costo de entrada corregido.

**Este es el costo de entrada que reemplaza, de forma definitiva (hasta el próximo dato nuevo), a los usados en `06-margen-neto-comision-y-precios-por-piso.md` (USD 1.929,29/m², Ángulo 3), `08-...md`/`09-...md` (mismo valor) y `10-...md` (USD 1.781,07/m², Ángulo 1/3)** — todos esos archivos quedan con números superados en este punto específico, sin recalcular todavía número por número (sigue siendo el mismo ítem técnico pendiente, ahora con el costo definitivo para hacerlo de una sola vez).

---

## 4. Qué queda pendiente

1. **Recalcular con estos costos definitivos** los márgenes de `06-...md`, el piso de renta de `08-...md`/`09-...md` (con amoblamiento incluido, `09-...md` §4.3) y la matriz de decisión de `08-...md` §4 — ahora sí con el costo de entrada final por Ángulo, no uno provisorio.
2. **Confirmar si el Ángulo 2/3 necesita una línea de Aprobaciones adicional** por el trámite municipal del rediseño, o si la línea ya vigente (sin reducir) lo cubre (sección 2, nota).
3. Los pendientes ya conocidos de `13-...md` §6: base de cálculo del IVA del desarrollador, tarifas de renta temporal/Airbnb reales, cronograma de caja mes a mes.
