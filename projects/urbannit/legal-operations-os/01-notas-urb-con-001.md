Estado: CURRENT — notas de redacción de URB-CON-001 v1.0 (borrador)
Fuente original: confirmaciones del founder (2026-08-12, respuesta a las 5 preguntas de cierre de la Fase A) + investigación web puntual sobre normativa paraguaya
Dominio: LEGAL / OPERATIONS (proyecto Urbannit)
Incorporado: 2026-08-12

# Notas de redacción — Contrato de Administración de Alquiler Temporal (URB-CON-001)

> Este documento **no es parte del contrato** que se le muestra al propietario ni al abogado — es la bitácora interna de qué está confirmado, qué es propuesta mía sin confirmar, y qué requiere validación legal, para que quien revise `production/entregables/Urbannit_Contrato_Administracion_BORRADOR.docx` sepa exactamente qué puede firmarse tal cual y qué no.

## 1. Confirmado explícitamente por el founder (D-059, 2026-08-12)

| Punto | Respuesta del founder | Dónde quedó en el contrato |
|---|---|---|
| Firmante en nombre de Urbannit | Campo Agreste S.A. | Encabezado + firma, Cláusula de encabezado |
| ¿Se contrata seguro de responsabilidad civil? | Sí | Cláusula Novena |
| ¿Registro SENATUR/Registur? | No, por el momento | No hay cláusula — se omitió a propósito, ver §3 |
| ¿El 20% de comisión incluye IVA? | Sí, es bruto e incluye IVA | Cláusula 4.1 |
| ¿Redactar ya el contrato? | Sí | Este documento |

## 2. Propuesto por mí, redactado por analogía con GoHost — el founder NO lo confirmó explícitamente todavía

Estos puntos están redactados en el borrador con contenido concreto (no placeholders) porque hacía falta un texto legible para poder avanzar, pero **son mi propuesta**, tomada de la práctica real de un competidor del mismo mercado (GoHost/LosBra SRL) — no una cifra ni un plazo que el founder haya fijado:

- **Cláusula Tercera (Plazo y exclusividad)** — el contrato usa placeholders de fecha `[FECHA]`/`[FECHA]`, pero la *estructura* (prórroga automática por períodos iguales salvo notificación de no renovación) es la misma que usa GoHost. **Falta que el founder confirme si quiere ese mecanismo (y el plazo exacto — GoHost usa 1 año) o uno distinto.**
- **Cláusula Quinta (Rescisión, 60 días sin penalidad)** — mismo caso: es el mecanismo de GoHost, no confirmado por el founder para Urbannit.
- **Cláusula Sexta (blanquería/utensilios, reposición a cargo del propietario)** — consistente con lo que las propuestas comerciales de Urbannit ya dicen para la limpieza ("no reduce tu ingreso"), pero la parte de *reposición de utensilios dañados/perdidos* es una extensión mía por analogía con GoHost — Urbannit no lo había definido antes.
- **Cláusula Séptima (relación laboral)** — protección estándar a favor del propietario, de sentido común, pero no es algo que el founder haya pedido explícitamente — se incluyó porque GoHost la trae y reduce un riesgo real (ver Fase A, §3).
- **Cláusula Octava (cesión del contrato)** — igual, cláusula estándar tomada de GoHost.
- **Cláusula Undécima (jurisdicción, Tribunales de Asunción)** — cláusula estándar/genérica, de sentido común para cualquier contrato en Paraguay, no específica de Urbannit.

## 3. Explícitamente NO incluido — decisión operativa del founder

**No hay cláusula de registro SENATUR/Registur en el contrato.** El founder confirmó que, por el momento, las propiedades gestionadas por Urbannit no se van a inscribir en el Registro Nacional de Turismo. Esto es una decisión operativa consciente del founder, no un olvido — se documenta acá y en `governance/decisions/DECISION_REGISTER.md` (D-059) para que quede trazable, pero **no se redactó ninguna cláusula que declare o niegue el cumplimiento** dentro del contrato mismo, para no dejar una admisión escrita de incumplimiento dentro de un documento legal que eventualmente firma un tercero. Si el founder cambia de opinión más adelante, esta es la cláusula que faltaría agregar (ver Fase A, `00-fase-a-diagnostico-y-arquitectura.md`, Master Document Index, fila `URB-POL-002`).

**Riesgo que esto deja abierto** (ya señalado en la Fase A, §3): si la obligación de registro aplica igual que a un competidor real del mismo mercado, operar sin inscripción expone al propietario, no solo a Urbannit — vale la pena que el founder lo tenga presente, más allá de la decisión ya tomada.

## 4. `[VALIDACIÓN LEGAL REQUERIDA]` — investigación hecha, sin confirmación de un abogado paraguayo real

### 4.1 Registro SENATUR/Registur (Cláusula omitida, ver §3)

Búsqueda web puntual (2026-08-12) confirma que la obligación citada en el contrato de GoHost es real y vigente, no inventada por el competidor:

- La **Resolución N° 170/2024 de SENATUR** establece el cobro de tasas por inscripción, habilitación y revalidación de prestadores de servicios turísticos en el Registro Nacional de Turismo (Registur), vigente desde el 1 de mayo de 2024. Fuente: [SENATUR — comunicado Registur](https://senatur.gov.py/noticias/comunicado-a-la-ciudadania-registur/), [La Nación](https://www.lanacion.com.py/negocios/2024/04/02/senatur-establece-pago-de-tasas-a-prestadores-de-servicios-turisticos/).
- SENATUR declara explícitamente que **"los alojamientos alternativos (Airbnb) deben por ley registrarse en el Registro Nacional de Turismo-Registur"**. Fuente: [SENATUR — formalización del alojamiento alternativo](https://senatur.gov.py/noticias/senatur-lleva-adelante-con-exito-la-formalizacion-del-sector-de-alojamiento-alternativo/), [Registur.gov.py](https://registur.gov.py/).

Esto no reemplaza la validación de un abogado paraguayo (alcance exacto, sanciones por incumplimiento, si aplica igual a un administrador tercero que a un propietario directo), pero confirma que **no es una cláusula inventada por GoHost** — es una norma real y activa del sector.

### 4.2 Seguro de responsabilidad civil (Cláusula Novena)

Búsqueda web puntual (2026-08-12) **no encontró evidencia de un mandato legal específico** para administradoras de alquiler temporal en Paraguay:

- El Código Civil paraguayo (art. 2151, citado en los resultados) regula la responsabilidad de administradores de **propiedad horizontal/consorcios** (ejecutar decisiones de la asamblea, rendir cuentas) — es un régimen distinto al de una administradora de renta temporal como Urbannit o GoHost.
- No se encontró una ley o resolución paraguaya que exija específicamente un seguro de responsabilidad civil para este tipo de actividad — a diferencia del registro SENATUR (§4.1), que sí tiene una norma citable.
- La práctica de GoHost (exigir el seguro, costo a cargo del propietario) parece ser **una decisión comercial de gestión de riesgo propia de esa empresa**, no una obligación legal comprobada.

**Conclusión de esta nota**: la Cláusula Novena del borrador se mantiene como **recomendación de buena práctica y cláusula propuesta** (no como "requisito legal" — distinción que exige el propio criterio de redacción de este proyecto), con el monto de la póliza como placeholder `[MONTO — PENDIENTE DE DEFINIR]`. **Antes de firmar cualquier contrato real, un abogado paraguayo debe confirmar** si existe alguna norma sectorial específica que no haya aparecido en esta búsqueda, y ayudar a fijar un monto de cobertura razonable.

### 4.3 PLA/FT (SEPRELAD) — no incluido en el contrato, nota aparte

No se agregó ninguna cláusula de PLA/FT al contrato con el propietario — esa es una obligación institucional de Campo Agreste S.A. frente a SEPRELAD (registro, debida diligencia, reportes), no un término contractual con el propietario. Búsqueda web puntual confirma que el sector inmobiliario paraguayo, sujeto obligado por la Ley N° 3783/09 (modifica la 1015/97), cubre explícitamente "el arrendamiento... la explotación por sí o por terceros o por cuenta de terceros, y la administración de bienes inmuebles" — lo que da soporte adicional a que la actividad de Urbannit encaja en el mismo régimen ya cubierto por `knowledge-base/legal/01-p04-manual-compliance.md`. Esto sigue siendo `URB-POL-003` en el Master Document Index de la Fase A — pendiente, pero de menor urgencia que el registro SENATUR o el seguro, porque no bloquea la firma de este contrato en particular.

## 5. Pendientes operativos, no bloqueantes para este borrador

- `URB-CON-002` (Anexo I — Inventario) todavía no se construyó. El contrato ya lo referencia ("se adjunta y forma parte integral de este contrato") pero el documento en sí queda para el siguiente paso.
- No se definió el domicilio legal exacto de Campo Agreste S.A. — el contrato lo deja como placeholder `[DOMICILIO LEGAL DE CAMPO AGRESTE S.A.]`. No se encontró una dirección física en ningún archivo del repo — no se inventó una.
- El plazo de vigencia (fechas exactas) y las cuentas bancarias del propietario son, por naturaleza, datos por-cliente — quedan como placeholders `[FECHA]`/`[BANCO / N° DE CUENTA / TITULAR / C.I.]`, igual que en el patrón que ya usa GoHost en su propio contrato tipo.

## 6. Siguiente paso sugerido

1. Founder revisa el borrador (`production/entregables/Urbannit_Contrato_Administracion_BORRADOR.docx`).
2. Confirmar o ajustar los puntos del §2 (plazo, rescisión, reposición de utensilios) que hoy son propuesta mía, no decisión suya.
3. Enviar el borrador a un abogado paraguayo real para: (a) validar la Cláusula Novena (seguro) y fijar un monto; (b) confirmar el alcance exacto de la obligación SENATUR/Registur y sus consecuencias de no inscribirse; (c) revisión general de forma antes de cualquier firma real.
4. Recién ahí, construir `URB-CON-002` (Anexo I — Inventario) y `URB-CON-005` (Términos y condiciones de estadía para el huésped), siguiendo el Master Document Index de la Fase A.
