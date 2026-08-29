# Plantilla de caso — contracts/cases/_template/

Copia de la estructura de carpetas de `cases/UON-001/` (Caso Fundador del sistema V2), sin ningún dato — lista para arrancar `UON-002` o el primer caso de otro proyecto sin reinventar el formato.

## Cómo usarla
1. Copiar esta carpeta completa a `cases/<CASO-ID>/` (ej. `cases/UON-002/`).
2. Poblar `source-documents/` con el expediente original, sin modificar.
3. Seguir el mismo flujo que documenta `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`, Sección 7 (DOCUMENTS → FACTS → ISSUES → … → LEARNING) — no saltar directo a resolver sin pasar por Facts/Issues/Conflicts.
4. Usar los formatos de `contracts/templates/` para cada registro nuevo — no inventar un formato distinto por caso.

## Estructura
```
source-documents/      expediente original, sin modificar
extracted-data/         texto/imágenes extraídas de PDFs para análisis
facts/                  FACT_REGISTER.md
issues/                 ISSUE_REGISTER.md
conflicts/              CONFLICT_REGISTER.md
resolution/             DECISION_HISTORY.md + RESOLUTION_RECORDS.md
negotiation/            NEGOTIATION_CASES.md
legal-review/           LEGAL_REVIEW_REQUESTS.md
contract-versions/      versiones del contrato + CONTRACT_VERSION_CONTROL.md + CHANGE_REQUESTS.md
client-response/        carta al cliente + anexo interno (Nivel 3, NUNCA se envía)
commitments/            COMMITMENT_REGISTER.md
actions/                ACTION_REGISTER.md
```

**Regla dura:** ningún dato de `cases/UON-001/` (ni de ningún otro caso) se copia acá. Esta carpeta se queda vacía para siempre — es plantilla, no un caso más.

## ⚠️ `extracted-data/` — zona potencialmente sensible

Ver `governance/PII_POLICY.md` para la política completa (origen: `D-093`,
limpieza histórica de PII de `UON-001`, 2026-08-29). Regla concreta para
cualquier caso nuevo que se arme desde esta plantilla:

- Las **transcripciones literales** de un instrumento legal (boleto, escritura,
  poder) que contengan PII completa de las partes (domicilio, email,
  teléfono, RUC personal — no solo nombre+CI) **no deben versionarse** acá.
  Conservarlas fuera de git (local o cifrado) y referenciarlas por nombre de
  archivo desde `facts/FACT_REGISTER.md`, sin necesidad de que el archivo
  mismo esté en el repo.
- Cada hecho relevante extraído de esa fuente debe quedar como un `FACT`
  verificable en `facts/FACT_REGISTER.md`, citando la fuente por nombre —
  eso es lo que se versiona, no la transcripción completa.
- Antes del primer commit que toque esta carpeta, correr el barrido de PII
  descripto en `CLAUDE.md` (sección "Protocolo de PII") — no depender de una
  sola expresión regular, y diferenciar PII real de referencias legítimas no
  personales (nombre de la calle del inmueble, nombre de la empresa
  vendedora, etc.) antes de decidir qué anonimizar.
