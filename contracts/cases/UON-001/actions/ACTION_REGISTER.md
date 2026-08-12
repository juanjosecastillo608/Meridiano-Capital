# UON-001 — ACTION REGISTER
Step 11 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`, formato de la Sección 29 del prompt maestro V2. A diferencia de los Steps 3-10, este registro no migra un documento existente — se construye a partir de las acciones que quedaron abiertas en `issues/ISSUE_REGISTER.md`, `conflicts/CONFLICT_REGISTER.md` y `commitments/COMMITMENT_REGISTER.md` y que **todavía no tienen una Decision ni un Commitment que las cierre** (criterio del Blueprint, Sección 8).

**Estados:** `OPEN` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `CANCELLED`.

---

## ACTION-001 — Aprobar formalmente v3 (o una v4) y marcarla `CURRENT`
**Descripción:** cerrar el Gate 4 (Contract Change) — hoy ninguna versión del boleto es `CURRENT` (`CONTRACT_VERSION_CONTROL.md`).
**Responsable:** Meridiano Capital + Vendedor (ADESA)
**Prioridad:** Alta — cierra `UON-ISSUE-001`, `UON-ISSUE-002` (ambos `P0`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna estricta — puede aprobarse v3 tal cual (dejando los `P1` para una v5) o esperar a resolverlos primero para una versión más limpia; es una decisión de secuencia, no un bloqueo real
**Estado:** `OPEN`

---

## ACTION-002 — Tomar la decisión comercial sobre el cronograma de pago (Gate 3)
**Descripción:** decidir entre las opciones de `NEGOTIATION_CASES.md` (NEG-001) y cerrar `DECISION-003`.
**Responsable:** Meridiano Capital + Vendedor
**Prioridad:** Alta — cierra `UON-ISSUE-003` (`P1`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-003 — Decidir el destino del "fondo de reserva" (0,5%)
**Descripción:** mantener, eliminar o comunicar el cargo de la Cláusula 7.3 antes de que vuelva a aparecer en una versión que el comprador vea.
**Responsable:** Meridiano Capital
**Prioridad:** Alta — cierra `UON-ISSUE-004` (`P1`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-004 — Enviar el Legal Review Pack al abogado/escribano
**Descripción:** enviar `legal-review/LEGAL_REVIEW_REQUESTS.md` junto con `Boleto_v3_DRAFT_2026-08-11.docx`. Hoy está armado pero no consta que se haya enviado.
**Responsable:** Meridiano Capital
**Prioridad:** Alta — **una sola acción habilita el avance de 5 Issues a la vez**: `UON-ISSUE-005`, `006`, `010`, `012`, `013` (todos `OPEN`, esperando respuesta jurídica que ni siquiera se pidió formalmente todavía)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-005 — Verificar existencia y firma del Anexo I
**Descripción:** confirmar con el vendedor/estudio de arquitectura que el plano de unidad, memoria descriptiva y plano de cocheras referidos en la Cláusula 1.2 existen como Anexo I firmado.
**Responsable:** Meridiano Capital → Vendedor
**Prioridad:** Media — cierra `UON-ISSUE-007` (`P2`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-006 — Confirmar la fecha "septiembre" de la Cláusula 6.3 (antes 6.4)
**Descripción:** verificar con el vendedor que esa fecha es correcta para esta operación puntual, no un resabio de otra negociación del edificio.
**Responsable:** Meridiano Capital
**Prioridad:** Media — cierra `UON-ISSUE-008` (`P2`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-007 — Preguntar al comprador qué "cesión de derechos" tenía en mente
**Descripción:** aclarar directamente con COMPRADORA-A (ver FACT-010) a qué se refería su propuesta de pago (`docx`, Q-07) sobre una cesión de derechos firmada.
**Responsable:** Meridiano Capital
**Prioridad:** Media — cierra `UON-ISSUE-009` (`P2`)
**Fecha:** 11/08/2026
**Dependencia:** ninguna — puede resolverse en la misma comunicación que ACTION-002
**Estado:** `OPEN`

---

## ACTION-008 — Resolver los 3 conflictos documentales con el vendedor/estudio de arquitectura
**Descripción:** confirmar cantidad real de cocheras/motos del edificio, nombre correcto de la calle transversal, y si "Solar" y "UON Calathea" son el mismo proyecto.
**Responsable:** Meridiano Capital → Vendedor/Estudio de arquitectura (Zulmira Fernández)
**Prioridad:** Media-baja — cierra `CONFLICT-001`, `002`, `003` (ninguno bloquea la operación de Depto. 201/Cochera 10 directamente)
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-009 — Decidir si enviar la carta al cliente ahora o esperar los 2 documentos pendientes
**Descripción:** **confirmado por Juan José Castillo (11/08/2026): la carta a COMPRADORA-A (ver FACT-010) no fue enviada todavía** — sigue en revisión (Gate 6). Decidir si se envía tal cual (con los puntos 6 y 10 del índice marcados "en camino") o se espera a conseguir la licencia ambiental y el plano técnico primero.
**Responsable:** Meridiano Capital (Juan José Castillo)
**Prioridad:** Alta — es la puerta de entrada de `COMMITMENT-001` y `COMMITMENT-002`, y del Gate 6 en general
**Fecha:** 11/08/2026
**Dependencia:** ninguna estricta para enviarla; ACTION-010 y ACTION-011 son prerequisito solo si se decide esperar
**Estado:** `OPEN`

---

## ACTION-010 — Conseguir el certificado de licencia ambiental como documento independiente
**Descripción:** hoy solo está confirmada su aprobación de forma indirecta (`FACT-018`, vía Poder N°29). Satisface `COMMITMENT-001` cuando exista.
**Responsable:** Meridiano Capital → Vendedor/ADESA
**Prioridad:** Media
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## ACTION-011 — Conseguir el plano técnico municipal sellado del Depto. 201 + Cochera 10
**Descripción:** hoy solo existe el render comercial (`PHOTO-2026-08-10-13-18-45.jpg`). Satisface `COMMITMENT-002` cuando exista.
**Responsable:** Meridiano Capital → Vendedor/Estudio de arquitectura
**Prioridad:** Media
**Fecha:** 11/08/2026
**Dependencia:** ninguna
**Estado:** `OPEN`

---

## Resumen
| Prioridad | Acciones |
|---|---|
| Alta | 001, 002, 003, 004, 009 |
| Media | 005, 006, 007, 010, 011 |
| Media-baja | 008 |

**Ninguna acción está `IN_PROGRESS`, `BLOCKED`, `DONE` ni `CANCELLED` todavía** — es información real, no una omisión: hoy el caso tiene 11 acciones identificadas y ninguna iniciada formalmente. El Case Dashboard (Step 12) va a mostrar esto de un vistazo.
