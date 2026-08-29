# Plan de prioridades — pendientes de Meridiano Capital

Creado 2026-08-28, a pedido del founder, al cerrar el geocoding real de SS6/SS17
(`D-088`) y la deuda técnica de `D-004`/`D-089`. Consolida **todo** lo que
`governance/decisions/DECISION_REGISTER.md` (secciones UNRESOLVED y PROPOSED)
y la tabla de estado de
`documentation/investment-sales-rental-market-engine/00-especificacion-v1.md`
tenían abierto a esa fecha, ordenado para ejecutar uno por uno. **Este
documento se actualiza a medida que se cierra cada ítem** — no se reescribe
desde cero, se tacha y se anota (mismo principio de no-destrucción que el
Decision Register).

Criterio de orden: (1) impacto financiero/riesgo directo primero; (2) dentro
de lo demás, lo que yo puedo ejecutar solo con ingeniería/investigación antes
que lo que necesita una decisión del founder; y eso antes que lo bloqueado por
una acción externa (abogado, fotógrafo, GoDaddy) que nadie puede acelerar
desde acá. Lo pausado explícitamente por el founder queda al final, no
descartado.

---

## ✅ Tier 0 — Cerrado en esta misma sesión (2026-08-28)

| Ítem | Resultado |
|---|---|
| Geocoding real (SS6/SS17) | `geocoding-engine` (SK-16), `D-088` — UON Calathea pasó a `VERIFIED_STREET_LEVEL` |
| D-004 (deuda técnica config/lógica) | `D-089` — `limpieza_pct` y `meses_hasta_pre_pozo_default` movidos a config, cero regresión |
| U-009 (ownership ambiguo de un doc) | Cerrado sin acción — era material de `inventory/`, no del `knowledge-base/` vigente |
| U-002/U-010 (sitio de referencia) | Cerrados sin acción — el sitio vigente (`production/app/frontend/`) ya resolvió el problema equivalente |
| §45-47 (target yield / max purchase price) | `target-yield-tools` (SK-17), `D-090` |
| §19 (fuentes obligatorias sistemáticas) | Revisado — ya cubierto por `amc.py`, era protocolo de ejecución, no gap de código |
| §51 (informe de inversor de 30 puntos) | `investor-report-30` (SK-18), `D-092` — **Tier 1 completo** |
| U-004, U-033 | `D-091` — ambos resueltos con el founder |

---

## Tier 1 — Motor/ingeniería, sin decisión de negocio pendiente

Puedo seguir ejecutando estos sin bloquear en el founder.

1. ~~§19 — Fuentes obligatorias sistemáticas.~~ **Revisado 2026-08-28 — no es un gap de código.** `amc.py` ya fuerza declarar `SOURCE_STATUS` de las 3 fuentes obligatorias incluso cuando una no se consultó (la marca `UNVERIFIED` con advertencia explícita, ver `evaluar()`). El gap real que señalaba la especificación es de **disciplina de ejecución del agente** en cada corrida (buscar en C21 + RE/MAX + InfoCasas siempre, no solo 1-2), no algo que un script pueda resolver por sí solo. Queda como recordatorio de protocolo, no como ítem de ingeniería pendiente.
2. ~~§45-47 — Precio máximo de compra / alquiler requerido.~~ ✅ **Hecho, 2026-08-28** — `target-yield-tools` (SK-17, `D-090`).
3. ~~§51 — Informe de inversor de 30 puntos como plantilla estándar.~~ ✅ **Hecho, 2026-08-28** — `investor-report-30` (SK-18, `D-092`). **Tier 1 completo.**
4. ~~U-002/U-010 — cerrar como housekeeping.~~ ✅ **Hecho, 2026-08-28** — ambos eran sobre el sitio de referencia archivado; el sitio real ya lo resolvió.

## Tier 2 — Necesitan una decisión rápida del founder (no bloqueadas por terceros)

Son elecciones, no investigación — se resuelven en un intercambio, no en días.

5. ~~U-026~~ — **Preguntado 2026-08-28, founder eligió seguir sin decidir por ahora** — sigue abierto, reconfirmado (no es un olvido).
6. ~~U-004~~ ✅ **Resuelto, 2026-08-28 (`D-091`)** — sin mínimo propio, solo el umbral migratorio de USD 200k cuando aplica.
7. **U-008** — términos de salida/cancelación del contrato de asesoría mensual de 1 año.
8. ~~U-033~~ ✅ **Resuelto, 2026-08-28 (`D-091`)** — no hace falta razón social/RUC en la Liquidación Mensual.
9. **U-017** — diseño del Club de Inversores (niveles Bronce/Plata/Oro) — identificado como de alto valor, nunca diseñado.
10. ~~P-001~~ — **Preguntado 2026-08-28, founder eligió "todavía no"** — vuelve a Tier 5, reconfirmado.

*(U-017 y U-008 son "decisión del founder" en el fondo, pero no son un pick rápido de 1 línea — son mini-diseños que conviene tratar en su propia conversación, no en un batch de preguntas cortas.)*

## Tier 3 — Bloqueadas por una acción externa real (no se resuelven con código)

Nadie puede acelerar esto desde la sesión — quedan explícitamente marcadas
"esperando al founder", no "sin avanzar por descuido".

12. **U-022 → U-023** — banco de imágenes reales (fotos de las 35 unidades operativas, renders autorizados de las 18 en pozo). Bloquea publicar el sitio, que ya está listo (score 88/100, `FINAL-QA.md`) salvo esto.
13. **Deploy real a `meridianocapital.net`** (GoDaddy) — Fase 08 del `WEBSITE-ROADMAP.md`, requiere credenciales de hosting que no están en este entorno.
14. **U-032** — enviar el paquete de papelería de Urbannit (`URB-CON-001/002/003/005`, `URB-REP-001`) a un abogado paraguayo real, en particular el seguro de responsabilidad civil (U-028) y el alcance de no registrar en SENATUR.
15. **U-015** — historial fiscal/contable de Campo Agreste S.A. de su etapa anterior — requiere a un contador/auditor real.
16. **U-020** — traer los 2 manuales originales de financiamiento/estructuración ("están en la otra cuenta") para reencuadrarlos a hurdle+carry.

## Tier 4 — Investigación/datos de alto esfuerzo, no bloqueante inmediato

No bloquean nada hoy, pero cerrarlos habilita análisis que hoy no se pueden
hacer bien (ej. rentabilidad real de toda la Cartera A).

17. **U-012/U-013/U-014** — completar los datos de la Cartera A: cronograma de pagos de las 18 unidades en pozo, superficie/valor/renta de la mayoría de las 53 unidades operativas, y en particular las 32 de Canarias (3 edificios completos, sin desagregar — el hueco más grande de toda la cartera).
18. **U-006** — completar el cuestionario bancario (4 campos + responsable sin nombrar).
19. **U-007/U-019** — operacionalizar CRS/FATCA (formulario, plazo, responsable) — el manual P04 nuevo cubre PLA/FT pero no esto.
20. **U-025** — reconstruir el modelo financiero de fideicomiso con datos reales de un proyecto concreto del pipeline.
21. **U-021** — instrucciones de web para Claude Design bajo el manual de marca corregido (aclarar relación con `production/app/frontend/` antes de duplicar trabajo).
22. **U-018** — honorarios de operación hotelera: requiere comparar con datos reales (caso Hotel Plaza Uruguaya) antes de fijar un número, no es una elección de 1 línea.

## Tier 5 — Pausados explícitamente o condicionales — no priorizar activamente

No se descartan, pero no se les dedica esfuerzo hasta que cambie la condición
que los pausa.

23. **P-004** — matriz completa de pisos/techos por zona×calidad — el founder pidió explícitamente no seguir investigando esto por ahora.
24. **U-024** — los 4 manuales faltantes (Comercial/Marketing/Desarrollo/Postventa) — esperar a que el volumen de operación lo justifique.
25. **U-003** — campaña publicitaria real — sin presupuesto ni plataforma definidos todavía.
26. **P-002/P-003** — frameworks propuestos (identidades de sub-marca por proyecto; arquitectura FastAPI) — sin caso concreto que los active todavía.
27. **P-006** — agente de IA de mercado vía WhatsApp — condicional a la iniciativa general de "Agentes de IA de Meridiano" y a confirmar de qué grupos ya existe consentimiento.
28. **P-001** — cuenta propia de Instagram/TikTok para Urbannit — reconfirmado "todavía no" el 2026-08-28.

---

## Cómo se va a ejecutar

Uno por uno, en el orden de arriba, salvo que el founder reordene. Cada ítem
cerrado se documenta en `DECISION_REGISTER.md` (D-0NN nuevo o U-0NN tachado) y
se tacha acá con la fecha y el ID de la decisión — igual que el resto del
sistema, nunca se borra una fila, se mueve de estado.
