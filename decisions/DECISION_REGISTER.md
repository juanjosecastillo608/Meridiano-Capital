# DECISION REGISTER — Meridiano Capital

Fase 3 del proceso de migración. Compilado a partir de la extracción por dominio (`knowledge-base/`). Cada decisión enlaza a su fuente. Estados: **CURRENT** (vigente) · **HISTORICAL** (reemplazada, se conserva por trazabilidad) · **DEPRECATED** (no debe usarse) · **UNRESOLVED** (pendiente) · **PROPOSED** (idea no aprobada).

**Limitación de trazabilidad conocida**: el material disponible (3 skills) es la versión ya destilada y "ganadora" de las conversaciones originales de Claude.ai. Esas conversaciones no están accesibles en este entorno, así que **no podemos reconstruir el "por qué se descartó" de decisiones anteriores que las conversaciones originales hayan superado**, salvo cuando el propio material dejó rastro explícito (ej. la corrección del "15 años" de Urbannit, o los 10 refinamientos de rentabilidad). Todo lo que sigue como HISTORICAL es HISTORICAL *documentado dentro del propio material*, no inferido.

---

## 🔴 UNRESOLVED de máxima prioridad — impacto financiero directo

Estas dos contradicciones existen ahora mismo entre la política escrita y el código que efectivamente calcula lo que se le muestra a un inversor. Se recomienda resolverlas con el responsable de negocio/contadora antes de dar por buena cualquier cifra de rentabilidad ya entregada o de lanzar la app funcional.

### D-001 · IVA aplicado en el cálculo de renta neta — CONTRADICCIÓN DOC vs. CÓDIGO
- **Qué dice la política**: `supuestos_operativos_default.iva_pct = 10.0` en `parametros_mercado.json`, anotado explícitamente "SIEMPRE aplicarlo" (Ley 125/91).
- **Qué hace el código**: `calculadora.py`, función `evaluar_renta()`, lee `fiscal.iva_pct = 5.0` — un bloque marcado en el propio config como `"A CONFIRMAR CON CONTADORA"`.
- **Efecto**: toda `yield_neto_pct` calculada hoy usa 5% de IVA en vez de 10%, es decir, **el neto mostrado está sobrestimado**.
- **Estado**: UNRESOLVED — requiere decisión del responsable de negocio + confirmación de contadora.
- **Fuente**: `knowledge-base/technology/02-calculadora-rentabilidad.md`, `knowledge-base/investment/03-parametros-de-mercado.md`.
- **Acción antes de producción**: no publicar/usar la calculadora en la app funcional hasta fijar este valor.

### D-002 · Pisos de rentabilidad — ¿son BRUTOS o NETOS?
- **Qué dice una parte del material**: `pisos_renta_neta` (comercial 8%, casa 6%, etc.) se usa en el código (`pasa_piso`) y se documenta en SKILL.md y en el ejemplo Habitalis 9A como pisos **NETOS**.
- **Qué dice otra parte del mismo material**: el refinamiento #10 (`pisos_base_bruto_o_neto`) etiqueta esos mismos números como pisos **BRUTOS**, y da rangos netos distintos (más bajos).
- **Efecto**: cada veredicto `pasa_piso` que la calculadora produce hoy puede estar comparando un yield neto contra un piso que en realidad fue pensado como bruto — lo que aprobaría oportunidades que en términos netos reales no alcanzan el piso.
- **Estado**: UNRESOLVED.
- **Fuente**: `knowledge-base/investment/01-metodologia-calculo.md`, `knowledge-base/investment/02-politica-de-rentabilidad.md`.
- **Acción antes de producción**: fijar una sola definición y corregir `parametros_mercado.json` + el código en consecuencia.

### D-003 · Ocupación temporal (Airbnb) no usa la ocupación realista corregida
- El refinamiento #8 corrigió el modelo de ocupación a 55–65% (vs. el 93% que causó el error de Edificio Austria), pero la rama de alquiler temporal en `evaluar_renta()` sigue reutilizando el `vacancia_pct` genérico del 3%, reintroduciendo potencialmente el mismo error que el refinamiento dice haber resuelto.
- **Estado**: UNRESOLVED.
- **Fuente**: `knowledge-base/technology/02-calculadora-rentabilidad.md`, `knowledge-base/investment/02-politica-de-rentabilidad.md`.

### D-004 · Violaciones de arquitectura config/lógica en la calculadora
- El principio declarado es "la lógica nunca cambia, solo el config" — pero el costo de limpieza para alquiler temporal está hardcodeado (`12.0`) dentro del código sin clave de config, y `meses_hasta_pre_pozo=7` es un default de función Python, no un valor de config.
- **Estado**: UNRESOLVED (deuda técnica, no bloqueante para negocio pero sí para mantenibilidad).
- **Fuente**: `knowledge-base/technology/02-calculadora-rentabilidad.md`.

---

## CURRENT — Decisiones vigentes de mayor relevancia

| ID | Decisión | Dominio | Por qué (si consta) | Fuente |
|---|---|---|---|---|
| D-010 | Brand Essence = "Precisión con raíces" | BRAND | El isotipo es un mojón geodésico (precisión); 16 años de conocimiento real del terreno paraguayo (raíces) | `brand/01-adn-de-marca.md` |
| D-011 | Arquetipo Sabio + Gobernante (se rechaza explícitamente Explorador y Héroe) | BRAND | La promesa de protección choca con el framing de riesgo/aventura de esos arquetipos | `brand/01-adn-de-marca.md` |
| D-012 | Paleta cultural propia (atardecer de Asunción, tierra colorada, lapacho, ka'a) en vez del "navy + dorado" genérico financiero | BRAND | Rechazo deliberado del código visual "Blackstone/JP Morgan" para diferenciarse | `brand/05-sistema-cromatico.md` |
| D-013 | Lapacho dorado solo como acento, nunca texto de cuerpo | BRAND | Falla WCAG 4.5:1 (da 2.6:1) | `brand/05-sistema-cromatico.md` |
| D-014 | Urbannit sigue el modelo de Marca Endosada (Endorsed Brand), no Branded House ni House of Brands | BRAND | Balancea seriedad institucional de Meridiano con calidez hotelera de Urbannit, heredando credibilidad del fundador | `brand/10-arquitectura-meridiano-urbannit.md` |
| D-015 | Narrativa operador Urbannit estandarizada a "20+ años, origen Barcelona (2010)" | BRAND | Reemplaza una cifra de "15 años" inconsistente | `brand/10-arquitectura-meridiano-urbannit.md` — **ver H-001 abajo** |
| D-016 | Dos modelos de negocio estructuralmente separados: Modelo A (Individual, comisión 5,5%) vs. Modelo B (Coinversión, fees + carry 15–20% sobre hurdle 8%) | BUSINESS | Economías incompatibles; mezclarlos genera errores de cálculo y de propuesta | `business/01-dos-modelos-de-negocio.md` |
| D-017 | Cédula desacoplada de la inversión: S.A. con 100% accionistas extranjeros + Meridiano como representante legal/síndico (USD 350/mes) permite invertir de inmediato | BUSINESS | Presentado como el gancho comercial más fuerte | `business/02-camino-migratorio.md` |
| D-018 | Selección automática de tipo de hurdle: ≤24 meses = simple, >24 meses = compuesto | BUSINESS | Favorece al inversor en horizontes largos (~USD 7.000 de diferencia en ejemplo 5 años/500k) | `business/03-modelo-coinversion.md` |
| D-019 | Identidad de marca a nivel de proyecto sigue el modelo Endosado de Urbannit | BUSINESS/BRAND | Solo se justifica a escala; la marca corporativa (Meridiano) debe estar siempre presente como respaldo | `business/05-proyectos-inmobiliarios.md` |
| D-020 | Cartera A (Meridiano administra) vs. Cartera B (Meridiano solo intermedia) — comisiones no intercambiables; Cartera B debe llamarse siempre "Intermediación inmobiliaria", nunca "Administración" | OPERATIONS/BRAND | Evita confundir el rol y la responsabilidad frente al cliente | `operations/03-tarifario.md` |
| D-021 | Tarifario solo se entrega en etapa avanzada del journey, nunca en primer contacto | OPERATIONS | — | `operations/03-tarifario.md` |
| D-022 | Dos figuras de TIR (sobre precio total vs. sobre capital desembolsado) se muestran siempre juntas | INVESTMENT | Decisión deliberada de transparencia, no redundancia | `investment/02-politica-de-rentabilidad.md` |
| D-023 | Ganancias de reventa no tributan como actividad habitual (plusvalía neta = bruta) | INVESTMENT | — | `investment/02-politica-de-rentabilidad.md` |
| D-024 | Regla de oro: mostrar siempre neto, nunca solo bruto | INVESTMENT | Requisito de comunicación, no solo de cálculo | `investment/02-politica-de-rentabilidad.md` |
| D-025 | Toda regla nueva no cubierta por el manual oficial debe etiquetarse `[EXTENSION]` explícitamente, nunca presentarse como oficial | AI/BRAND | Protocolo de gobernanza no negociable, incluso si la extensión "parece obvia" | `ai/02-protocolo-regla-no-definida.md` |
| D-026 | Orden de prioridad ante conflicto de reglas: Manual oficial > identidad visual > identidad verbal > estrategia/ADN > reglas de canal > recomendaciones creativas | AI | — | `ai/01-protocolo-de-prioridad.md` |

## HISTORICAL — Reemplazadas, documentadas dentro del propio material

| ID | Decisión anterior | Reemplazada por | Por qué | Fuente |
|---|---|---|---|---|
| H-001 | Narrativa operador Urbannit: "15 años de experiencia" | D-015: "20+ años, origen Barcelona (2010)" | Corrección de inconsistencia factual encontrada en el material fuente | `brand/10-arquitectura-meridiano-urbannit.md` |
| H-002 | Modelo de rentabilidad P07 (versión previa a los refinamientos) | Refinamientos #1–#10, auditados contra operaciones reales (Habitalis 9A, Edificio Austria) | El modelo anterior mostraba ~18,5% bruto cuando el neto real auditado fue ~14–15%; otro refinamiento corrigió una ocupación asumida de 93% a un rango realista de 55–65% | `investment/02-politica-de-rentabilidad.md` |

*(Nota: H-002 es la evidencia más clara de que sí existieron iteraciones/decisiones previas reemplazadas durante el desarrollo original — el material conservó el rastro de auditoría, a diferencia de la mayoría del resto del contenido que solo llegó en su forma "final".)*

## PROPOSED — Ideas no aprobadas / condicionales

| ID | Propuesta | Dominio | Condición | Fuente |
|---|---|---|---|---|
| P-001 | Cuenta propia de Instagram/TikTok para Urbannit | MARKETING | "si se crea cuenta propia" — condicional, no confirmada | `marketing/03-redes-sociales.md` |
| P-002 | Identidades de sub-marca por proyecto inmobiliario específico | BUSINESS/BRAND | Es un *framework* de decisión, no una identidad ya en uso — hoy ningún proyecto tiene identidad propia activa | `business/05-proyectos-inmobiliarios.md` |
| P-003 | Arquitectura técnica propuesta: envolver `calculadora.py` en una API FastAPI + extraer CSS/JS del sitio de referencia sin rediseñarlo | TECHNOLOGY | Marcado explícitamente `[EXTENSION]`/PROPOSED — no hubo especificación de arquitectura objetivo en el material original | `technology/03-arquitectura-propuesta.md` |

## UNRESOLVED — Resto de pendientes (no financieros / menor severidad)

| ID | Pendiente | Dominio | Fuente |
|---|---|---|---|
| U-001 | Sitio de referencia de Urbannit no muestra el endoso "gestionado por Meridiano Capital" requerido — "debe corregirse" según el propio material | BRAND | `brand/10-arquitectura-meridiano-urbannit.md` |
| U-002 | Formulario de contacto del sitio de referencia no envía datos a ningún backend real (el propio código lo admite en un comentario) | MARKETING/TECHNOLOGY | `marketing/01-aplicacion-digital.md`, `technology/01-sitio-web-referencia.md` |
| U-003 | No existe campaña publicitaria real todavía — toda la guía de Módulo 12 es preventiva/derivada, sin presupuestos, plataforma principal, ni KPIs definidos | MARKETING | `marketing/04-publicidad.md` |
| U-004 | Sin ticket mínimo explícito para coinversión (solo el umbral migratorio de USD 200k, que puede ser coincidental) | BUSINESS | `business/03-modelo-coinversion.md` |
| U-005 | Porcentajes de fee/hurdle/carry (1,5–3%, 2–4%, 15–20%, 8%) marcados "[deck]" — pendientes de confirmación final, no deben tratarse como cifras cerradas | BUSINESS | `business/01-dos-modelos-de-negocio.md` |
| U-006 | Cuestionario bancario: sin responsable nombrado; 4 campos sin completar (bancos con los que trabaja Meridiano, requisitos, tiempo de apertura, monto mínimo) | OPERATIONS | `operations/01-onboarding-bancario.md` |
| U-007 | Procedimiento CRS/FATCA nombrado pero no operacionalizado (sin formulario, plazo, ni responsable) | OPERATIONS | `operations/01-onboarding-bancario.md` |
| U-008 | Sin términos de salida/cancelación para el contrato de asesoría mensual de 1 año una vez obtenida la cédula | OPERATIONS | `operations/03-tarifario.md` |
| U-009 | Ownership ambiguo de `13-proyectos-inmobiliarios.md` entre BUSINESS y BRAND — se mantuvo en ambos con referencia cruzada | BUSINESS/BRAND | `business/05-proyectos-inmobiliarios.md` |
| U-010 | Enlaces del footer del sitio de referencia (Urbannit/Coinversión/Recursos) son placeholders muertos (`href="#"`) | TECHNOLOGY | `technology/01-sitio-web-referencia.md` |
| U-011 | Sin decisión de hosting/dominio/proveedor de formularios para la futura app | TECHNOLOGY | `technology/03-arquitectura-propuesta.md` |

## DEPRECATED

Ninguna decisión encontrada en el material está explícitamente marcada como "ya no debe usarse" — el material entregado es, en su totalidad, la versión vigente. Sección se deja abierta para futuras entradas.

---

## Cómo mantener este registro

Cuando se tome o se reemplace una decisión desde este momento en adelante (dentro de Claude Code):
1. Agregar una fila nueva con ID secuencial (`D-0NN`, `H-0NN`, `P-0NN`, `U-0NN`).
2. Si reemplaza una decisión CURRENT existente, mover esa fila a HISTORICAL y enlazarla explícitamente ("Reemplazada por D-0NN").
3. Nunca borrar una fila HISTORICAL o DEPRECATED — solo mover de sección.
4. Citar la fuente real (archivo + sección) siempre, no solo "se decidió que...".
