```
Estado: AUDIT ONLY
Parte de: FINAL-AUDIT.md
```

# Document Status — inventario completo con estado y calidad

Escala de estado: 🟢 FINAL · 🟡 FINAL CON OBSERVACIONES · 🟠 REQUIERE VALIDACIÓN · 🔴 REQUIERE DESARROLLO · 🔵 REQUIERE INVESTIGACIÓN · ⚫ OBSOLETO · ⚪ ARCHIVO

Score sobre 100 (ver metodología en `PRODUCTION-READINESS.md`). Solo se puntúan documentos sustantivos — los `README.md` placeholder de capas vacías (`core/`, `memory/`) no se puntúan, se marcan ⚪.

## BUSINESS

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `business/00-overview.md` | 🟢 FINAL | 92 | Mapa de dominio claro |
| `business/01-dos-modelos-de-negocio.md` | 🟡 FINAL CON OBSERVACIONES | 88 | Debe mantenerse sincronizado a mano con `03-modelo-coinversion.md` |
| `business/02-camino-migratorio.md` | 🟡 FINAL CON OBSERVACIONES | 85 | UNRESOLVED sobre integración del capital mínimo legal |
| `business/03-modelo-coinversion.md` | 🟢 FINAL | 93 | Economics validadas cuantitativamente (auditoría 939 fórmulas) |
| `business/04-etapas-del-inversor.md` | 🟡 FINAL CON OBSERVACIONES | 80 | Varios `[COMPLETAR]` de duración/costo — gaps documentados, no errores |
| `business/05-proyectos-inmobiliarios.md` | 🟡 FINAL CON OBSERVACIONES | 78 | Ownership ambiguo BUSINESS/BRAND, sin resolver (U-009) |
| `business/06-estructura-societaria-y-portfolio.md` | 🟠 REQUIERE VALIDACIÓN | 75 | Bloqueado por U-012/U-013/U-014 (datos por unidad, cronograma de obra) |

## BRAND

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `brand/00-overview.md` | 🟢 FINAL | 90 | — |
| `brand/01-adn-de-marca.md` | 🟢 FINAL | 96 | Oficial, fuente directa del Brand Guidelines |
| `brand/02-identidad-verbal.md` | 🟢 FINAL | 94 | Oficial + extensiones bien marcadas |
| `brand/03-identidad-visual.md` | 🟢 FINAL | 90 | Actualizado con D-034/035 esta semana |
| `brand/04-tipografia.md` | 🟢 FINAL | 92 | Actualizado con D-036/D-040 hoy mismo, incluye la excepción de peso Bold documentada |
| `brand/05-sistema-cromatico.md` | 🟢 FINAL | 90 | — |
| `brand/06-sistema-grafico.md` | 🟢 FINAL | 88 | — |
| `brand/07-direccion-de-arte.md` | 🟢 FINAL | 88 | — |
| `brand/08-sistema-de-imagen.md` | 🟢 FINAL | 85 | Depende de banco de imagen aún no producido (U-022) para aplicación real |
| `brand/09-cierres-y-firmas.md` | 🟢 FINAL | 93 | Actualizado con D-039 (firma institucional) esta semana |
| `brand/10-arquitectura-meridiano-urbannit.md` | 🟠 REQUIERE VALIDACIÓN | 75 | U-001 sin resolver + nueva ambigüedad STAY WISE/Meridiano Inmobiliaria (ver FINAL-AUDIT §8) |

## OPERATIONS

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `operations/00-overview.md` | 🟢 FINAL | 88 | — |
| `operations/01-onboarding-bancario.md` | 🟡 FINAL CON OBSERVACIONES | 70 | Tabla de bancos/tiempos en blanco (`[COMPLETAR]`) |
| `operations/02-checklist-inversor.md` | 🟡 FINAL CON OBSERVACIONES | 82 | Plantilla operativa completa, sin campo de fechas por hito |
| `operations/03-tarifario.md` | 🟡 FINAL CON OBSERVACIONES | 87 | Sin `[COMPLETAR]` en montos, pero 4 UNRESOLVED de letra chica |
| **(nuevo, no existe)** plantilla de respaldo de ingresos/inquilino | 🔴 REQUIERE DESARROLLO | — | Gap real — existe un caso real (Habitalis 9A) pero no una plantilla genérica reutilizable. Ver DO NOW #4 en FINAL-AUDIT |

## INVESTMENT

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `investment/00-overview.md` | 🟢 FINAL | 88 | — |
| `investment/01-metodologia-calculo.md` | 🟠 REQUIERE VALIDACIÓN | 70 | Documenta honestamente las discrepancias doc/código (bruto-neto, IVA) — el documento en sí está bien escrito, el problema es lo que describe |
| `investment/02-politica-de-rentabilidad.md` | 🟠 REQUIERE VALIDACIÓN | 75 | Política P07 completa y bien razonada, pero hereda las mismas dos contradicciones críticas |
| `investment/03-parametros-de-mercado.md` | 🟡 FINAL CON OBSERVACIONES | 82 | Corregido el 2026-08-10: reflejaba una versión desactualizada del IVA (5% único) — ya documenta el diferenciado real (comercial 10% / residencial 5%, D-001/D-027). Sigue con el sub-punto de renta temporal/Airbnb abierto |
| `investment/04-auditorias-financieras.md` | 🟢 FINAL | 95 | Excelente — registro de errores ajenos con metodología clara, ya cumplió su función |
| `investment/05-matriz-pisos-techos.md` | 🟠 REQUIERE VALIDACIÓN | 68 | D-033 resuelve el mecanismo, pero P-004 (valores reales) sigue incompleto — documento honesto sobre su propio estado |

## LEGAL

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `legal/00-overview.md` | 🟢 FINAL | 88 | — |
| `legal/01-p04-manual-compliance.md` | 🟢 FINAL | 94 | Completo, marco legal citado, único pendiente es administrativo (RL-01, inscripción del Oficial de Cumplimiento) |

## AI

| Documento | Estado | Score |
|---|---|---|
| `ai/00-overview.md` | 🟢 FINAL | 90 |
| `ai/01-protocolo-de-prioridad.md` | 🟢 FINAL | 92 |
| `ai/02-protocolo-regla-no-definida.md` | 🟢 FINAL | 92 |
| `ai/03-sistema-de-consulta.md` | 🟢 FINAL | 90 |
| `ai/04-director-creativo-y-brand-guardian.md` | 🟢 FINAL | 90 |
| `ai/05-matriz-de-decision.md` | 🟢 FINAL | 88 |
| `ai/06-prompt-engine.md` | 🟢 FINAL | 88 |
| `ai/07-protocolo-analista-de-inversion.md` | 🟢 FINAL | 93 |

## MARKETING

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `marketing/00-overview.md` | 🟢 FINAL | 87 | — |
| `marketing/01-aplicacion-digital.md` | 🟠 REQUIERE VALIDACIÓN | 72 | Sitio auditado pero sin publicar (U-023, bloqueado por U-022 banco de imagen); formulario sin backend real (U-002) |
| `marketing/02-presentaciones.md` | 🟡 FINAL CON OBSERVACIONES | 65 | **Desactualizado**: dice "Lora Bold", debe decir Fraunces sin bold literal (D-036/D-040). Corrección DO NOW #3 |
| `marketing/03-redes-sociales.md` | 🟢 FINAL | 85 | — |
| `marketing/04-publicidad.md` | 🔵 REQUIERE INVESTIGACIÓN (parcial) | 60 | U-003: preventiva/derivada, sin campaña real, presupuesto ni KPI todavía — normal en esta etapa, no bloqueante |
| `marketing/05-entregables-producidos.md` | 🟢 FINAL | 93 | Actualizado hoy, refleja el estado real regenerado |

## TECHNOLOGY

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `technology/00-overview.md` | 🟢 FINAL | 87 | — |
| `technology/01-sitio-web-referencia.md` | 🟡 FINAL CON OBSERVACIONES | 75 | U-010 (enlaces muertos), U-002 (form sin backend) |
| `technology/02-calculadora-rentabilidad.md` | 🟠 REQUIERE VALIDACIÓN | 70 | Hereda D-002/IVA |
| `technology/03-arquitectura-propuesta.md` | 🟡 FINAL CON OBSERVACIONES | 78 | Hosting/dominio sin decidir (U-011) |
| `technology/04-generadores-de-entregables.md` | 🟢 FINAL | 92 | Actualizado hoy — pipeline funcional documentado con precisión |

## GOVERNANCE

| Documento | Estado | Score |
|---|---|---|
| `governance/decisions/DECISION_REGISTER.md` | 🟢 FINAL | 95 |
| `governance/decisions/REQUIREMENTS.md` | 🟢 FINAL | 93 |

## SKILLS / WORKFLOWS / CONNECTORS / PROJECTS

| Documento | Estado | Score | Nota |
|---|---|---|---|
| `skills/rentabilidad-calculator/SKILL.md` + `calcular.py` | 🟡 FINAL CON OBSERVACIONES | 78 | Funcional, hereda D-002/D-003/IVA |
| `workflows/rentabilidad-evaluation/WORKFLOW.md` | 🟡 FINAL CON OBSERVACIONES | 76 | Ídem |
| `connectors/README.md` | ⚪ ARCHIVO | — | Placeholder, sin implementación, no bloqueante |
| `core/README.md`, `memory/README.md` | ⚪ ARCHIVO | — | Placeholders de la arquitectura de 10 capas, sin poblar todavía — no bloqueante |
| `projects/meridiano-capital/README.md`, `projects/urbannit/README.md` | ⚪ ARCHIVO | — | Placeholders |

## PRODUCTION (entregables regenerados 2026-08-09)

| Documento | Estado | Score |
|---|---|---|
| `production/entregables/Meridiano_Programa_Ingreso.pptx/.pdf` | 🟢 FINAL | 93 |
| `production/entregables/Meridiano_Deck_Coinversion.pptx/.pdf` | 🟢 FINAL | 93 |
| `production/entregables/Meridiano_Mision_Vision_Valores.pptx/.pdf` | 🟢 FINAL | 92 |
| `production/entregables/Urbannit_Presentacion.pptx/.pdf` | 🟢 FINAL | 90 |
| `production/entregables/Meridiano_Info_Completa.pptx/.pdf` | 🟢 FINAL | 91 |
| `production/entregables/Meridiano_OnePager_Frio.pptx/.pdf` | 🟢 FINAL | 92 |
| `production/entregables/Meridiano_WhatsApp_Frio.pptx/.pdf/.png` | 🟢 FINAL | 92 |
| `production/entregables/Meridiano_P04_Manual_Compliance.docx/.pdf` | 🟢 FINAL | 93 |

## 9 ARCHIVOS NUEVOS (2026-08-10) — clasificación de origen

| Archivo | Naturaleza | Estado |
|---|---|---|
| `Perfil Profesional y Plan de Negocio.docx` | Documento editable de JJC, con corchetes `[ASÍ]` sin completar — explícitamente un borrador de trabajo | 🔴 REQUIERE DESARROLLO — antes de incorporar, resolver la pregunta de arquitectura de marca (FINAL-AUDIT §8, punto 3) |
| `Modelo Paraguay para Inversión extranjero.docx` | Notas de investigación, dos secciones explícitamente marcadas "FALTA DESARROLLAR ESTE TEMA" | 🔴 REQUIERE DESARROLLO — bien encaminado, útil como base para incorporar residencia fiscal |
| `Paraguay vs Argentina/España/Italia/Chile.docx` (4) | Contenido de marketing/comparación, terminado en redacción | 🟡 FINAL CON OBSERVACIONES — falta disclaimer RB-05, distinción bruto/neto, y branding Meridiano antes de publicar |
| ~~`Propuesta de trabajo para propietarios.pdf` (STAY WISE)~~ | ✅ **RESUELTO 2026-08-12 (D-056)** — STAY WISE=Urbannit ya confirmado (D-043); el founder aportó el PDF de nuevo en el chat y se reformateó como `Urbannit_Propuesta_Propietarios.docx/.pdf`, con identidad de marca completa | 🟢 FINAL — ver `production/entregables/` |
| ~~`Propuesta de Gestión de Alquiler Temporal.pdf`~~ | ✅ **RESUELTO 2026-08-12 (D-056)** — reformateado como `Urbannit_Propuesta_Gestion_Temporal.docx/.pdf`, contenido distinto y complementario del anterior (foco en modelo de negocio/comisión vs. foco en proceso operativo), no una versión previa del mismo documento | 🟢 FINAL — ver `production/entregables/` |
| `Respaldo_Ingresos_Habitalis_9A.pdf` | Documento operativo real, ya ejecutado, con PII de terceros | 🟢 FINAL como caso — 🔴 REQUIERE DESARROLLO como plantilla genérica reutilizable (no existe todavía) |
