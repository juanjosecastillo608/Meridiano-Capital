# UON-001 — FACT REGISTER
Migrado desde `evidence/CASE_FACTS.md` (Step 3 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`). **Ningún dato se re-verificó** — es una reestructuración del mismo contenido, agregando `Categoría`, `Versión relevante` y `Estado` explícito (Blueprint Sección 5 / prompt maestro V2 Sección 17).

`evidence/CASE_FACTS.md` queda como está, sin borrar (regla de no-destrucción, igual que `governance/decisions/DECISION_REGISTER.md` de la raíz del repo) — este registro es, desde ahora, la fuente de consulta vigente para Facts de UON-001. Los reportes de Fase 0/1 (`UON-001_DISCOVERY_REPORT.md`, `UON-001_CONTRACT_AUDIT.md`) citan estos mismos `FACT-ID` — **no se renumeró nada** para no romper esas referencias.

**Estados posibles:** `VERIFIED` (evidencia directa, sin ambigüedad) · `PARTIALLY_VERIFIED` (evidencia real pero desactualizada, indirecta, o con un dato pendiente) · `CONFLICTED` (dos fuentes no coinciden) · `UNVERIFIED` · `SUPERSEDED` (reemplazado por un valor más nuevo, se conserva por trazabilidad).

---

| ID | Categoría | Dato | Valor | Fuente(s) | Versión relevante | Fecha | Evidencia | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|
| FACT-001 | SUPERFICIE | Superficie propia Depto. 201 | 63,36 m² | Boleto, Planilla de Copropiedad, docx | v1 y v2 (sin cambios) | Planilla aprob. 17/10/2024 | E1 | `VERIFIED` | — |
| FACT-002 | COPROPIEDAD | % copropiedad Depto. 201 | 4,64% | Boleto vigente, Planilla, docx | **v2 únicamente** — no figuraba en v1 (CHG-03) | Planilla aprob. 17/10/2024 | E1 | `VERIFIED` | — |
| FACT-003 | SUPERFICIE | Área propia terreno Cochera 10 | 18,70 m² | Boleto vigente, Planilla | **v2 únicamente** — v1 no detallaba el área (CHG-03) | Planilla aprob. 17/10/2024 | E1 | `VERIFIED` | — |
| FACT-004 | COPROPIEDAD | % copropiedad Cochera 10 | 0,40% | Boleto vigente, Planilla, docx | **v2 únicamente** (CHG-03) | Planilla aprob. 17/10/2024 | E1 | `VERIFIED` | — |
| FACT-005 | CADASTRAL | Cuenta Corriente Catastral (origen) | 15-0411-27 | Boleto, Planilla, Cómputo Métrico, Resolución 334, Impuesto Inmobiliario, Expediente municipal, Poder | v1 y v2 (sin cambios) | — | E1 (8 fuentes independientes) | `VERIFIED` | Máximo nivel de corroboración de todo el registro |
| FACT-006 | SUPERFICIE | Superficie del terreno | 648,20 m² (648 m² con 20 dm²) | Boleto, Planilla, Cómputo Métrico, Impuesto Inmobiliario, Escritura, Poder | v1 y v2 (sin cambios) | — | E1 | `VERIFIED` | — |
| FACT-007 | TECNICO | Superficie total a construir del edificio | 1.940,08 m² | Planilla de Copropiedad, Cómputo Métrico | N/A (no es dato del boleto) | Planilla aprob. 17/10/2024 | E2 | `VERIFIED` | 2 fuentes técnicas coincidentes |
| FACT-008 | TITULARIDAD | Propietario del inmueble | ADESA E.A.S. (RUC 80133023-8) | Escritura N°4, Poder N°29, Boleto, Impuesto Inmobiliario | v1 y v2 (sin cambios) | Escritura 22/05/2023 | E1 | `VERIFIED` | — |
| FACT-009 | PODER | Representante/apoderado firmante por el vendedor | Pablo Rodrigo Boyajian, CI 9.228.455, Poder Especial N°29 | Poder (texto completo), Boleto | v1 y v2 (sin cambios) | Poder 07/04/2026 | E1 | `VERIFIED` | Fecha y número de escritura coinciden exactamente entre Boleto y Poder |
| FACT-009B | PODER | Alcance del Poder N°29 | Faculta "ADMINISTRAR, VENDER Y DISPONER", incluyendo fijar precio/plazos/forma de pago, firmar escrituras y documentos privados — facultades enunciativas, no limitativas | Poder, páginas 4-5 (texto íntegro) | N/A | Poder 07/04/2026 | E1 | `VERIFIED` | Resuelve LRR-05 — el poder cubre la firma del boleto en los términos actuales |
| FACT-010 | COMPRADOR | Identidad de la compradora | Derci Plenamente Sakumoto, nacionalidad brasileña, CI paraguaya N° 9.381.885 | Boleto (ambas versiones) | v1 y v2 (sin cambios) | 11/08/2026 | E2 | `VERIFIED` | — |
| FACT-011 | PRECIO | Precio total de la operación | USD 112.000 (IVA incluido) | Boleto A y B, docx | v1 y v2 (**total sin cambios** — cambió el cronograma de cuotas, no el total) | 11/08/2026 | E1 | `VERIFIED` | — |
| FACT-012 | MUNICIPAL | Aprobación municipal de planos | Resolución N° 334 AP/P D.O.P., 17/10/2024 | Resolución (texto íntegro), Planilla, Boleto | N/A | 17/10/2024 | E1 | `VERIFIED` | — |
| FACT-013 | TITULARIDAD | Inscripción registral del inmueble (transferencia a ADESA) | **Finca N° 10.673**, Distrito Santísima Trinidad, inscripta bajo el N° 5, folio 26, 14/09/2023 | Escritura N°4 (texto), Poder N°29 (texto) | N/A | 14/09/2023 | E1 | `VERIFIED` | ⚠️ Ver nota de reconciliación abajo — corrige el valor citado en `UON-001_DISCOVERY_REPORT.md` |
| FACT-013B | TITULARIDAD | Antecedente de titularidad | Ariel Luis Debenedetti adquirió el inmueble de Hugo Raúl y Lorena María Cáceres Zaván (Escritura N°12, 25/07/2022, Finca 10.673, N°4, folio 06, 10/08/2022); luego lo aportó como capital a ADESA E.A.S. (Escritura N°4, 22/05/2023) | Escritura N°4, páginas 2-3 | N/A | 25/07/2022 → 22/05/2023 | E1 | `VERIFIED` | — |
| FACT-014 | PROPIEDAD_HORIZONTAL | Trámite de propiedad horizontal en curso | Expediente Municipal N° 04595/2026, iniciado 07/04/2026, "CO-PROPIEDAD / CCC N°15-0411-27" | Ticket de expediente, Orden de pago (30/03/2026), docx | N/A | 07/04/2026 (inicio) | E1 | `VERIFIED` | El hecho verificado es que el trámite **está en curso** — su resultado final sigue pendiente (ver `issues/`) |
| FACT-015 | DOCUMENTAL | Certificado de Condiciones de Dominio y Gravámenes | Entrada N°12834970 (18/04/2023): "no ha sufrido modificación, restricciones de dominio, ni reconoce gravamen alguno" | Escritura N°4, página 3 (texto íntegro) | N/A | 18/04/2023 | E1 | `PARTIALLY_VERIFIED` | Vigente **a esa fecha** — no hay certificado 2026 independiente en el expediente. No asumir que sigue libre de gravámenes 3 años después sin confirmarlo |
| FACT-016 | FISCAL | Certificado de Cumplimiento Tributario de ADESA E.A.S. | N°3066/2023 (18/05/2023): sin deuda de Impuesto Inmobiliario, Tasas Especiales ni Recolección de Basura | Escritura N°4, página 3 | N/A | 18/05/2023 | E1 | `PARTIALLY_VERIFIED` | Mismo criterio que FACT-015 — dato de 2023, no confirmado a la fecha actual |
| FACT-017 | FISCAL | Avalúo fiscal del inmueble | Gs. 1.510.000.000 | Escritura N°4, página 3 | N/A | 22/05/2023 | E1 | `PARTIALLY_VERIFIED` | Valor histórico a la fecha de la Escritura, no necesariamente el avalúo vigente hoy |
| FACT-018 | AMBIENTAL | Licencia ambiental | Poder N°29 declara expresamente "Licencia Ambiental Aprobada" | Poder N°29, página 3 (instrumento notarial) | N/A | 07/04/2026 | E1 | `PARTIALLY_VERIFIED` | Confirmada de forma indirecta (referencia notarial) — el certificado en sí no está en el expediente como archivo independiente |
| FACT-019 | FISCAL | Cumplimiento tributario de ADESA y de Pablo Rodrigo Boyajian (abril 2026) | Certificados N°4270224399298 (ADESA) y N°4270224391742 (Boyajian), ambos 07/04/2026, válidos hasta 07/05/2026; Boyajian no figura en el Registro de Deudores Alimentarios Morosos | Poder N°29, páginas 4-5 | N/A | 07/04/2026 | E1 | `VERIFIED` | Es el dato tributario más reciente de todo el registro |
| FACT-020 | TECNICO | Planta de Terraza aprobada | Quincho, piscina, gimnasio/coworking, solárium, bar exterior, deck | `Edificio Solar- Planos Aprobados.pdf`, lámina ARQ 03 | N/A | 17/10/2024 | E2 | `VERIFIED` | — |

---

## Nota de reconciliación (ejemplo real de por qué este registro existe)

**FACT-013** ilustra exactamente el problema que el Fact Register está diseñado para prevenir: `UON-001_DISCOVERY_REPORT.md` (Fase 0, redactado antes de leer el texto completo de la Escritura y el Poder) registra el número de finca como **"Finca 10613"** — una lectura preliminar de una anotación manuscrita en el sello de inscripción. Al leer en Fase 1 el texto **mecanografiado** de dos instrumentos notariales independientes (Escritura N°4 y Poder N°29), el número correcto resultó ser **Finca N° 10.673**.

- El Discovery Report **no se edita retroactivamente** — es una fotografía fiel de lo que se sabía en la Fase 0, y reescribirlo silenciosamente destruiría esa trazabilidad.
- Este registro (`FACT_REGISTER.md`) es, a partir de ahora, **la fuente de consulta vigente** — el valor correcto es `10.673`.
- Cualquier persona (o Claude, en una sesión futura) que necesite el número de finca debe consultar acá, no el Discovery Report.

## Info que quedaba "faltante" en el Discovery Report y su estado tras Fase 1 (migrado de `CASE_FACTS.md`)

| Punto | Estado |
|---|---|
| Certificado de dominio y gravámenes | `PARTIALLY_VERIFIED` — ver FACT-015 |
| Licencia ambiental | `PARTIALLY_VERIFIED` — ver FACT-018 |
| Plano técnico específico sellado del Depto. 201 + Cochera 10 | Sigue sin ningún Fact que lo respalde — pasa al Issue Register (Step 5) como pendiente documental, no como Fact |
| Finca N° 10.673 vs. lectura inicial "10613" | `RESOLVED` vía FACT-013 — ver nota de reconciliación arriba |
