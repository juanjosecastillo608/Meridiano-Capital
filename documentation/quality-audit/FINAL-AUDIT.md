```
Estado: AUDIT ONLY — informe de auditoría, no modifica ningún documento original
Alcance: knowledge-base/, governance/, skills/, workflows/, production/entregables/, + 9 archivos nuevos aportados el 2026-08-10
Ubicación: documentation/quality-audit/ (equivalente de "09_DOCUMENTATION/quality-audit/" del brief, adaptado a la convención real de este repo — no existe una carpeta "09_DOCUMENTATION")
Fecha: 2026-08-10
```

# MERIDIANO CAPITAL — FINAL KNOWLEDGE VALIDATION REPORT

## 1. Executive Summary

El repo tiene **8 semanas-persona equivalentes de trabajo real, no especulativo**: identidad de marca completa y oficial, dos modelos de negocio con economía validada cuantitativamente (auditoría de un modelo de fideicomiso de 939 fórmulas), un motor de cálculo de rentabilidad funcional, un manual de compliance PLA/FT completo, y 8 entregables comerciales regenerados y verificados visualmente esta semana. Esto **no es un sistema que necesite más investigación** — necesita cierre editorial y la resolución de un puñado de contradicciones técnicas conocidas desde hace tiempo.

**Veredicto en una frase**: la mayoría del sistema (marca, journey del inversor, compliance, entregables) está en 🟢/🟡 — listo o casi listo para producción. El bloqueante técnico real, tras corrección (ver nota de la 2026-08-10 más abajo), queda reducido a **uno solo**: los pisos de rentabilidad en `production/app/config/parametros_mercado.json` cambiaron de mecanismo (D-033, ya en bruto) pero sus valores no se recalibraron. Todo lo demás es depuración editorial, no investigación.

> **Corrección post-publicación (2026-08-10)**: la primera versión de este informe listaba el IVA (5% vs. 10%) como bloqueante CRITICAL sin resolver. Al verificar el código real (`calculadora.py`) y el config real (`production/app/config/parametros_mercado.json`) contra la respuesta del founder, se confirmó que **el IVA diferenciado ya estaba resuelto desde el 2026-08-02** (D-001/D-027: alquiler comercial 10%, residencial 5%) y correctamente implementado en el motor. El hallazgo original venía de `knowledge-base/investment/03-parametros-de-mercado.md`, que documentaba una versión desactualizada del config (anterior a D-001) — ya corregido. Se deja esta nota en vez de borrar el hallazgo original, siguiendo la misma regla de no-destrucción que rige el Decision Register.

Los 9 archivos nuevos que trajiste **no introducen contradicciones graves con lo ya construido** — en su mayoría lo confirman (cifras de coinversión, fiscalidad, journey) — pero sí abren **una pregunta de arquitectura de marca que no estaba planteada**: ¿"Meridiano Capital" es la única marca corporativa, o convive con "Castillo Real Estate & Desarrollo" (nombre personal propuesto) y/o "Meridiano Inmobiliaria" (nombre de carpeta en tus archivos, nunca antes visto en el repo)? Ver sección 8.

## 2. What Is Complete (🟢 FINAL — no seguir investigando)

| Área | Por qué está cerrada |
|---|---|
| ADN de marca, misión/visión/valores, Golden Circle, arquetipo | Fuente: Brand Guidelines oficial v1.0, sin contradicciones, ya gobierna toda pieza producida en este repo |
| Identidad verbal (tono, capas de mensaje, posicionamiento) | Oficial, aplicada consistentemente en los 8 entregables regenerados |
| Compliance PLA/FT (P04) | Manual completo, marco legal citado, procedimiento operativo claro. Único pendiente real es administrativo (inscribir Oficial de Cumplimiento — RL-01), no de contenido |
| Protocolo de gobernanza de IA (`ai/00-07`) | Coherente, ya en uso activo en esta misma sesión |
| Economía de coinversión (fees, hurdle, carry, waterfall) | `DECISIÓN FIRME` validada cuantitativamente contra una auditoría real (939 fórmulas). Los 9 archivos nuevos (Perfil Profesional) citan exactamente los mismos rangos — confirmación cruzada independiente |
| Los 8 entregables regenerados (`production/entregables/`) | Verificados visualmente a 180-200dpi el 2026-08-09, marca nueva aplicada (D-034/035/036/039/040), sin el bug tipográfico |
| Regla de invisibilidad Capa 1 societaria (D-029) | Confirmada como aplicada correctamente en un documento operativo real (`Respaldo_Ingresos_Habitalis_9A.pdf` no menciona ninguna S.A., usa "Meridiano Capital · Intermediación Inmobiliaria") |
| Distinción Cartera A / Cartera B (administración vs. intermediación) | El mismo documento real de Habitalis 9A la aplica correctamente (dice "Intermediación", nombra a la administradora real del inmueble) — evidencia de que la regla funciona en el terreno, no solo en el papel |

## 3. What Is Almost Complete (🟡 FINAL CON OBSERVACIONES)

| Área | Qué falta (menor, no bloqueante) |
|---|---|
| Dos modelos de negocio (A/B) | Sólido, pero U-004 (sin ticket mínimo explícito de coinversión) sigue abierto, y `01-dos-modelos-de-negocio.md` / `03-modelo-coinversion.md` deben mantenerse sincronizados manualmente (mismo dato en dos lugares) |
| Journey del inversor (6 etapas) + checklist | Estructura completa y usada; varios campos `[COMPLETAR]` (duración, costo, banco) son gaps *documentados*, no errores — bajo impacto porque no bloquean ninguna decisión hoy |
| Tarifario | Sin `[COMPLETAR]` en los montos — pero 4 `UNRESOLVED` de letra chica (condición de salida del USD 350/mes, tabla de precio de cédula por nacionalidad, si el 50%-de-mes de colocación aplica en Cartera A además del 10%, qué pasa si un inversor está en Modelo A y B a la vez) |
| Identidad visual / tipografía | D-034/035/036/040 resueltos y verificados — pero `marketing/02-presentaciones.md` todavía dice "Lora Bold" (tipografía y peso ya reemplazados). Es un doc de referencia, no un entregable — bajo riesgo, pero debe corregirse antes de que alguien lo use como guía |
| Skill/Workflow de rentabilidad | Funcional end-to-end, pero hereda los dos bloqueantes técnicos de la sección 8 |

## 4. What Requires Validation (🟠 REQUIERE VALIDACIÓN)

| Ítem | Qué hay que comprobar | Con quién |
|---|---|---|
| Matriz de pisos/techos en BRUTO (D-033/P-004) | El mecanismo de comparación ya se corrigió (bruto vs. bruto), pero los **valores** de los pisos no se recalibraron — siguen siendo los mismos números pensados originalmente para comparación en neto. Falta la planilla "Alquileres Amoblados Tradicionales" (mencionada, no recibida) y datos de las otras zonas del portfolio real | Founder |
| Relación STAY WISE / "empresa aliada 20+ años" / Urbannit / "Meridiano Inmobiliaria" | Ver sección 8 — cuatro nombres para lo que podría ser una, dos o tres entidades distintas | Founder |
| Cifras de rentabilidad "8-12% USD" en los 4 documentos comparativos (Paraguay vs. Argentina/España/Italia/Chile) | No especifican si son brutas o netas — riesgo de violar la "regla de oro" (RI-01) si se publican tal cual | Nadie externo — es una corrección editorial interna |
| Ley N° 6984/22 citada en `Modelo Paraguay para Inversión extranjero.docx` como base legal del régimen SUACE | No estaba citada en ningún documento anterior del repo — nueva referencia, sin verificar | Abogado / fuente oficial (ver Research Register) |

## 5. What Requires Research (🔵 REQUIERE INVESTIGACIÓN — la lista corta, deliberadamente)

Aplicando el principio del brief ("no investigar por investigar, solo si cambia una decisión real"), esta lista es corta a propósito:

| Pregunta | Por qué SÍ vale la pena investigar (cambia algo concreto) |
|---|---|
| ¿Existe realmente la Ley N° 6984/22 y dice lo que el documento nuevo afirma? | Si Meridiano cita una ley incorrecta a un inversor extranjero en un documento de venta, es un riesgo reputacional y legal directo — cambia si se puede o no citar esa ley en material comercial |
| Confirmar con la contadora: IVA 5% o 10% sobre renta de alquiler (bloqueante técnico ya conocido, D-002 hermano) | Cambia directamente el neto que se le muestra a cada inversor — es el bloqueante financiero más antiguo del repo |

Todo lo demás marcado como incompleto en este informe es **cierre editorial o decisión de negocio**, no investigación externa — no se lista acá.

## 6. What Should Be Archived (⚪ ARCHIVO)

| Ítem | Por qué |
|---|---|
| `connectors/README.md` | Placeholder sin implementación real — no bloquea nada, no es prioridad hasta que exista una necesidad concreta de integración |
| `00_RAW_MIGRATION/` y `inventory/_raw-copies/` | Ya cumplieron su función de fuente de migración — se mantienen como archivo histórico de solo lectura, correctamente, no requieren acción |

## 7. What Should Be Removed (⚫ Ninguno)

No se identificó ningún documento que deba eliminarse. El repo no tiene contenido obsoleto sin marcar — todo lo reemplazado ya está correctamente movido a HISTORICAL en el Decision Register, no duplicado como basura activa. Esto es una señal de higiene documental fuerte, no un hallazgo negativo.

## 8. Critical Contradictions

Ordenadas por severidad real (impacto en una cifra o decisión que un inversor real vería):

1. **Pisos bruto/neto (D-002, técnico, la más antigua)** — el mecanismo de comparación ya se corrigió (D-033), pero los valores de piso no se recalibraron. Efecto práctico: hoy casi cualquier evaluación "pasa el piso" aunque no debería, porque se compara un número bruto contra un piso que fue calibrado para comparación neta. **No usar `pasa_piso` para decisiones reales todavía** (esto ya está advertido en el propio código, per `investment/05-matriz-pisos-techos.md`).
2. ~~IVA 5% vs. 10% en el motor de cálculo~~ — ✅ **RESUELTO, ya estaba resuelto desde el 2026-08-02 (D-001/D-027)**: comercial 10%, residencial 5%, correctamente implementado. El hallazgo original de este informe era incorrecto (documentación desactualizada) — corregido el mismo día. Queda un sub-punto genuinamente abierto y menor: si la renta temporal/Airbnb debe usar el 5% residencial (hoy, por defecto/inferencia) o una tasa propia.
3. ~~Nueva — arquitectura de marca ("Castillo Real Estate & Desarrollo" / "Meridiano Inmobiliaria")~~ — ✅ **RESUELTO 2026-08-10 (D-041)**: alineado con Meridiano Capital, se construye como perfil personal del CEO, no como marca separada.
4. ~~Relación STAY WISE / "empresa aliada de renta temporal" / Urbannit~~ — ✅ **RESUELTO 2026-08-10 (D-043)**: STAY WISE = Urbannit, Meridiano Inmobiliaria = Meridiano Capital.
5. **`marketing/02-presentaciones.md` sigue diciendo "Lora Bold"** — desactualizado desde D-036/D-040 (Fraunces, nunca Bold literal). Menor severidad (documento de referencia interna, no un entregable), pero real.

## 9. Knowledge Debt

Ver `KNOWLEDGE-DEBT.md` para el detalle completo clasificado. Resumen:

- **CRITICAL**: 1 (pisos bruto/neto) — el IVA se retiró de esta categoría tras confirmarse resuelto.
- **HIGH**: 3 (arquitectura de marca personal/Meridiano Inmobiliaria, identidad de STAY WISE, matriz de pisos/techos incompleta — P-004).
- **MEDIUM**: ~6 (ver registro).
- **LOW**: ~15 (mayormente campos `[COMPLETAR]` del journey, aranceles migratorios puntuales — no bloquean nada hoy).

## 10. Recommended Actions — priorizadas

### DO NOW (necesario para cerrar)
1. Preguntar al founder: ¿"Castillo Real Estate & Desarrollo" es una dirección a adoptar, una idea descartada, o algo que convive con Meridiano Capital de otra forma? (bloquea cualquier trabajo futuro de marca personal)
2. Preguntar al founder: ¿qué es STAY WISE en relación con Urbannit y con la "empresa aliada de 20+ años"? (bloquea poder usar las dos propuestas de gestión temporal como material operativo real)
3. Corregir `marketing/02-presentaciones.md` (Lora Bold → Fraunces, sin bold literal) — 5 minutos, cero ambigüedad, ya resuelto en el resto del sistema.
4. Genericizar `Respaldo_Ingresos_Habitalis_9A.pdf` en una plantilla operativa reutilizable (sin PII real) — es la "carpeta del inquilino" que pediste estandarizar.

### DO NEXT (importante, no bloqueante)
5. Llevar la recalibración de pisos bruto/neto (con la planilla ya recibida) y la pregunta de IVA sobre renta temporal/Airbnb a la contadora — bloqueante financiero real, pero no depende de este ciclo de auditoría para avanzar en paralelo.
6. Incorporar el ángulo de **residencia fiscal** (no solo migratoria) como sección explícita del journey/marketing — gap real, señalado por vos mismo, con contenido de base ya disponible en `Modelo Paraguay para Inversión extranjero.docx`.
7. Verificar la Ley N° 6984/22 antes de citarla en cualquier pieza pública.
8. Revisar los 4 documentos "Paraguay vs. X" para agregar la distinción bruto/neto y el disclaimer obligatorio (RB-05) antes de usarlos como contenido de blog/LinkedIn.

### DO LATER (mejora futura)
9. Completar la matriz de pisos/techos por zona y tipología (P-004) — depende de que llegue la planilla faltante.
10. Cerrar los `[COMPLETAR]` de duración/costo del journey con datos reales de experiencia de JJC.
11. Definir el criterio de "calidad de edificio" para la matriz de pisos/techos.

### DON'T DO
12. No recalibrar los valores numéricos de los pisos unilateralmente — es decisión de negocio, no técnica.
13. No publicar `Respaldo_Ingresos_Habitalis_9A.pdf` ni ningún dato de él tal cual — contiene PII real de terceros (inquilinas, garante: cédulas, cuentas bancarias, ingresos).
14. No inventar una tabla de precio de cédula por nacionalidad ni bancos de trabajo — quedan como gap documentado hasta tener el dato real.

## 11. Final Closure Plan

1. **Puerta 2 (Validación)** — este informe define exactamente qué revisar: las 4 preguntas de la sección 5, la arquitectura de marca (sección 8, punto 3-4), y el par bruto/neto-IVA. Nada más requiere ida y vuelta con el founder para cerrar.
2. **Puerta 3 (Cierre)** — una vez resueltas esas preguntas: corregir `marketing/02-presentaciones.md`, crear la plantilla genérica de respaldo de ingresos, incorporar residencia fiscal al journey, y decidir el estado de STAY WISE/Meridiano Inmobiliaria/Castillo REI en el Decision Register (con ID nuevo, sin sobrescribir nada existente).
3. **Puerta 4 (Producción)** — con eso cerrado, el sistema completo (marca, journey, compliance, entregables, calculadora una vez resueltos D-002/IVA) queda en condición de **sistema operativo empresarial utilizable**, no de investigación permanente.

**Conclusión operativa**: esta etapa de aprendizaje está, en efecto, suficientemente validada para cerrarse en la mayoría de sus áreas. Los dos bloqueantes técnicos y las dos preguntas de arquitectura de marca son el 100% de lo que falta para decir "cerrado" — todo lo demás ya lo está.
