# contracts/config/

Catálogos centralizados que hoy viven como prosa dispersa dentro de los reportes de UON-001 y que el sistema V2 necesita como referencia única (Blueprint, Sección 6):

- Tipos de Issue (Blueprint Sección 6: SURFACE, PRICE, PAYMENT, DELIVERY, POSSESSION, TITLE, OWNERSHIP, CADASTRAL, PROPERTY_HORIZONTAL, COCHERA, COMMON_AREAS, REGULATION, CONSTRUCTION, SPECIFICATIONS, MUNICIPAL, ENVIRONMENTAL, TAX, DEED, DEADLINE, PENALTY, RESCISSION, WARRANTY, REPRESENTATION, DOCUMENTATION, COMMERCIAL, NEGOTIATION, OTHER — ampliable)
- Niveles de fuente documental (Nivel 1 jurídico/registral … Nivel 6 verbal, ya usados en el Discovery Report de UON-001)
- Niveles de evidencia (E1-E5)
- Estados válidos por entidad (Fact, Issue, Conflict, Decision, Contract Version, etc.)

**Estado:**
- `fact-catalog.md` ✅ creado (Step 3) — categorías de Fact, estados, niveles de fuente y de evidencia.
- `conflict-catalog.md` ✅ creado (Step 4) — estados de Conflict.
- `issue-catalog.md` ✅ creado (Step 5) — tipos, prioridad P0-P4 y estados de Issue.
- `decision-catalog.md` ✅ creado (Step 6) — estados de Decision.
- `contract-version-catalog.md` ✅ creado (Step 7) — estados de Contract Version, cómo calcular el hash.
- `change-request-catalog.md` ✅ creado (Step 8) — estados de Change Request, escala de impacto.
- Resto (Negotiation/Commitment/Action) pendiente, se centraliza a medida que cada entidad se estabiliza (Steps 9-11).
