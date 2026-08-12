# contracts/engine/

Capa ENGINE del sistema V2 (`contracts/V2_IMPLEMENTATION_BLUEPRINT.md`, Sección 6). Lógica y plantillas reutilizables entre casos — **nunca datos de un caso específico** (sin PII, sin cifras de una operación puntual).

- `schemas/` — definición de cada entidad (Fact, Issue, Conflict, Decision, Contract Version, Change Request, Negotiation Case, Commitment, Action). Se puebla en los Steps 3-11 del Blueprint, a medida que cada entidad se usa por primera vez en UON-001 (Caso Fundador) y su formato se estabiliza.
- `procedures/` — cómo se ejecuta cada operación repetible (clause-diff, contract-consistency-check, legal-review-pack, etc.), documentado a partir de cómo se hizo la primera vez en UON-001.

**Estado:** vacío — se puebla progresivamente mientras se trabaja UON-001, no antes.
