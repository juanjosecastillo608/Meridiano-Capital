Estado: CURRENT
Dominio: LEGAL / COMPLIANCE
Incorporado: 2026-08-02, dominio nuevo — no existía en la migración original de las 3 skills

# LEGAL — overview

Dominio nuevo, agregado en el re-procesamiento del paquete de recuperación de Claude Chat (`00_RAW_MIGRATION/claude-recovery-2026-08-02/`). Ninguna de las 3 skills originalmente migradas cubría compliance/PLA-FT — el manual P04 es contenido genuinamente nuevo, no una versión más completa de algo que ya existiera.

## Contenido

| Archivo | Qué cubre |
|---|---|
| `01-p04-manual-compliance.md` | Manual de Prevención de Lavado de Activos y Financiamiento del Terrorismo (PLA/FT) — por qué Meridiano es sujeto obligado ante SEPRELAD, marco legal paraguayo, obligaciones, DDC/KYC, señales de alerta, procedimiento de reporte |

## Por qué existe

Meridiano Capital —que desarrolla, intermedia y administra inmuebles, y estructura vehículos de coinversión para inversores extranjeros— es **sujeto obligado** ante SEPRELAD según la Res. 201/2020. No es opcional: es condición para operar, con consecuencias que incluyen multas, inhabilitación, responsabilidad penal de directivos y exclusión de financiamiento bancario.

**Origen del documento**: el manual originalmente reconstruido fue una adaptación de un manual de compliance **argentino** (UIF/CUIT/DNI) — inaplicable en Paraguay. Se reconstruyó desde cero como P04, basado en la normativa paraguaya real (SEPRELAD, no UIF).

## Relación con el resto del sistema

- El vector de mayor riesgo es exactamente el núcleo del negocio de Meridiano: canalizar capital de inversores extranjeros (Europa, Argentina, Brasil, Chile) hacia Paraguay — ver la sección "Atención especial" en `01-p04-manual-compliance.md`.
- Se relaciona con `knowledge-base/business/06-estructura-societaria-y-portfolio.md` (Campo Agreste S.A. es el sujeto obligado que debe designar e inscribir al Oficial de Cumplimiento).
- Se relaciona con `knowledge-base/business/02-camino-migratorio.md` y `knowledge-base/operations/01-onboarding-bancario.md` — el DDC/KYC del onboarding de un inversor extranjero debe seguir el proceso de este manual, no uno improvisado.
- `governance/decisions/REQUIREMENTS.md` — ver la nueva categoría REQ-LEGAL.
