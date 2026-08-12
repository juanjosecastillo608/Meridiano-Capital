# Catálogo — Fact
Primer catálogo poblado del sistema V2 (Step 3, a partir de `cases/UON-001/facts/FACT_REGISTER.md`). Se amplía a medida que un caso nuevo necesite una categoría que no está acá — nunca se restringe artificialmente.

## Categorías de Fact usadas hasta ahora
`SUPERFICIE` · `COPROPIEDAD` · `CADASTRAL` · `TITULARIDAD` · `PODER` · `COMPRADOR` · `PRECIO` · `MUNICIPAL` · `PROPIEDAD_HORIZONTAL` · `DOCUMENTAL` · `FISCAL` · `AMBIENTAL` · `TECNICO`

## Estados de Fact
| Estado | Significado |
|---|---|
| `VERIFIED` | Evidencia directa, sin ambigüedad — una o más fuentes coincidentes de nivel adecuado |
| `PARTIALLY_VERIFIED` | Hay evidencia real, pero es indirecta, está desactualizada, o falta un dato complementario para darla por cerrada |
| `CONFLICTED` | Dos o más fuentes no coinciden entre sí — nunca se resuelve eligiendo una arbitrariamente (pasa a `conflicts/CONFLICT_REGISTER.md`) |
| `UNVERIFIED` | Se menciona en algún documento pero no hay evidencia documental que lo respalde |
| `SUPERSEDED` | Reemplazado por un valor más nuevo — se conserva la fila vieja, nunca se borra (ver ejemplo real: FACT-013 de UON-001) |

## Niveles de fuente documental (jerarquía, no significa que un nivel bajo sea falso)
| Nivel | Descripción | Ejemplos |
|---|---|---|
| N1 | Jurídico/registral oficial | Escritura, título, certificado de dominio/gravámenes, documentación catastral oficial |
| N2 | Contractual vigente | Boleto de compraventa vigente, anexos, adendas |
| N3 | Técnico aprobado | Planos aprobados, planilla de copropiedad, memoria descriptiva, documentación municipal |
| N4 | Interno/administrativo | Correspondencia interna, docx de objeciones y respuestas |
| N5 | Comercial | Brochures, fichas comerciales, renders, publicaciones |
| N6 | Verbal / no documentado | — |

## Niveles de evidencia
`E1` documental primaria · `E2` documental técnica/secundaria (verificada en múltiples fuentes) · `E3` información proporcionada (no documental) · `E4` inferencia · `E5` no verificado

**Origen:** este catálogo formaliza el criterio que ya se usó de facto en `UON-001_DISCOVERY_REPORT.md` (Fase 0) — no introduce ningún criterio nuevo.
