```
Estado: AUDIT ONLY — recomendaciones de cierre, ninguna decisión se cierra unilateralmente en este documento
Parte de: FINAL-AUDIT.md
```

# Decision Closure — recomendaciones, no decisiones tomadas

Este documento **no cierra ninguna decisión** — per las reglas de esta auditoría (AUDIT ONLY) y la regla permanente del repo (nunca resolver una contradicción en silencio), cada ítem se deja con una recomendación y la pregunta exacta que hay que hacerle al founder. El cierre real ocurre en la Puerta 3, después de la respuesta.

## D-002 — Pisos de rentabilidad, bruto vs. neto (la más antigua, sigue abierta)

- **Estado actual**: D-033 resolvió el *mecanismo* (comparar bruto contra bruto). Los *valores* de los pisos (comercial 8%, casa 6%, etc.) no se recalibraron — siguen siendo los números originales, pensados para una comparación neta.
- **Recomendación**: no cerrar todavía. Recalibrar requiere la planilla de "Alquileres Amoblados Tradicionales" (mencionada por el founder, no recibida) y, idealmente, datos de las zonas reales del portfolio (Villa Morra, Recoleta, Los Laureles).
- **Pregunta exacta para el founder**: "¿Tenés la planilla de Alquileres Amoblados Tradicionales que mencionaste? Sin ella, los pisos actuales no reflejan bien el mercado real medido en bruto."

## ~~IVA — 5% vs. 10% en el motor de cálculo~~ ✅ CERRADO (2026-08-10)

- **Estado**: el hallazgo original de este documento era incorrecto — el IVA diferenciado ya estaba resuelto desde el 2026-08-02 (D-001/D-027, confirmado por el founder): **comercial 10%, residencial 5%**, ya implementado en `calculadora.py` y en el config real. Venía de una versión desactualizada de `investment/03-parametros-de-mercado.md`, ya corregida.
- **Sub-punto que sigue abierto**: si la renta temporal/Airbnb (Urbannit) debe usar el 5% residencial (hoy, por defecto/inferencia `[EXTENSION]`) o una tasa propia. Es MEDIUM, no CRITICAL — no bloquea nada hoy.
- **Pregunta pendiente (menor)**: "El motor asume que la renta temporal (Airbnb/Urbannit) paga el mismo 5% que el alquiler residencial tradicional — ¿es correcto, o debería tener un tratamiento distinto?"

## ~~"Castillo Real Estate & Desarrollo" vs. Meridiano Capital~~ ✅ CERRADO (2026-08-10, D-041/D-042)

- **Respuesta del founder**: alineado con la ideología de Meridiano Capital, no descartado. Se construye como el **perfil personal del CEO de Meridiano Capital** (título formal: CEO — D-042), no como una segunda marca pública. Se pidió además un entregable nuevo con este contenido, pensado como base de "Quiénes somos" y redes sociales — ver `production/generadores/build_perfil_ceo.js` (en construcción).
- **Implicancia de marca**: el Perfil Profesional NO introduce un logo, paleta ni tipografía propios — usa el sistema visual de Meridiano Capital ya existente (Fraunces/Poppins, petróleo/tierra/dorado), con JJC presentado como su CEO.

## ~~"Meridiano Inmobiliaria" y "STAY WISE"~~ ✅ CERRADO (2026-08-10, D-043)

- **Respuesta del founder**: son nombres alternativos de Meridiano Capital y Urbannit respectivamente — no entidades distintas. Las dos propuestas de gestión de alquiler temporal recibidas se tratan como material operativo de Urbannit.

## U-004 — Sin ticket mínimo explícito de coinversión

- **Recomendación**: cerrar como "no bloqueante, definir caso a caso" hasta que exista un primer vehículo de coinversión real (Fase 3 del plan de 90 días del Perfil Profesional) — no inventar un mínimo sin un caso real que lo valide.

## U-009 — Ownership ambiguo de `business/05-proyectos-inmobiliarios.md`

- **Recomendación**: mantener en BUSINESS con referencia cruzada desde BRAND (opción "a" de las tres presentadas en el propio documento) — es la opción de menor riesgo de desincronización, consistente con cómo se resolvió la relación entre `03-modelo-coinversion.md` y `01-dos-modelos-de-negocio.md` (ambos se mantienen, con nota explícita de sincronización).

## Resumen — qué necesita respuesta del founder vs. de un tercero

| Pregunta | A quién preguntar |
|---|---|
| ~~Planilla de alquileres faltante~~ | ✅ Recibida 2026-08-10 — pendiente aplicar |
| ~~IVA 5% vs 10%~~ | ✅ Ya estaba resuelto (D-001/D-027) |
| IVA renta temporal/Airbnb (sub-punto menor) | Contadora |
| Castillo Real Estate & Desarrollo | Founder |
| Meridiano Inmobiliaria / STAY WISE | Founder |
| Ley N° 6984/22 (ver `RESEARCH-REGISTER.md`) | Fuente legal / abogado |
