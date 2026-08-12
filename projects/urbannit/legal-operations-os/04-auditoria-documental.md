Estado: CURRENT — auditoría documental del primer lote de papelería de Urbannit
Fuente original: pedido explícito del founder (2026-08-12), "al final vamos a hacer una auditoria documental"
Dominio: LEGAL / OPERATIONS (proyecto Urbannit)
Incorporado: 2026-08-12

# Auditoría documental — primer lote de URB-CON-001/002/003/005 y URB-REP-001

Siguiendo el protocolo de "Control de Consistencia" del prompt maestro (§21): cláusulas contradictorias, nombres correctamente escritos, plazos/comisiones/responsabilidades que coincidan entre documentos, anexos correctamente referenciados, y que la documentación comercial ya aprobada no prometa algo que el contrato no contemple.

## Alcance

Los 5 documentos borrador construidos hasta ahora (todos en `production/entregables/`, todos v1.0):

| Código | Documento |
|---|---|
| `URB-CON-001` | Contrato de Administración de Alquiler Temporal |
| `URB-CON-002` | Anexo I — Inventario del Inmueble |
| `URB-CON-003` | Anexo — Tarifas y Comisiones |
| `URB-CON-005` | Términos y Condiciones de Estadía (huésped) |
| `URB-REP-001` | Formato de Liquidación Mensual |

Contra: el material fuente ya aprobado (Propuesta de trabajo para propietarios y Propuesta de Gestión de Alquiler Temporal, D-056), las reglas de marca (`brand/10-arquitectura-meridiano-urbannit.md`, D-014), y la sección pública del sitio (`#urbannit-detalle`, D-057 Parte B).

## Método

Verificación por `grep` directo sobre el código fuente de los 5 generadores (`production/generadores/build_urbannit_*.js`) — no sobre el PDF renderizado, para comparar el texto real, no una lectura visual que puede saltarse una palabra. Cada hallazgo se verificó con la línea exacta antes de reportarlo.

## Hallazgos

### 1. 🟡 Corregido — inconsistencia de nombre entre el contrato y su propio anexo

La Cláusula 2.3 de `URB-CON-001` llamaba al anexo **"ANEXO I — Inventario"**, mientras que el documento real (`URB-CON-002`) se titula **"ANEXO I — INVENTARIO DEL INMUEBLE"**. No es una contradicción de fondo — cualquiera entendería que se refieren al mismo documento — pero es exactamente el tipo de detalle que un abogado señalaría en la primera lectura.

**Corrección aplicada**: se actualizó la Cláusula 2.3 para decir "ANEXO I — Inventario del Inmueble", palabra por palabra igual al título real del documento. Contrato regenerado y verificado por lectura directa del XML del `.docx` (no solo visual) — confirmado que el texto nuevo está presente y el viejo ya no. Los archivos en `production/entregables/Urbannit_Contrato_Administracion_BORRADOR.docx/.pdf` ya reflejan la corrección.

### 2. ✅ Verificado — identidad legal consistente

`Campo Agreste S.A. — RUC 80093513-6` aparece exactamente igual (mismo RUC, mismo formato) en los cuatro documentos que necesitan identificar al firmante: el contrato, el Anexo I, el Anexo de Tarifas y los Términos y Condiciones de Estadía.

### 3. ✅ Verificado — comisión del 20% sin contradicciones

La cifra "20% IVA incluido" aparece igual en la Cláusula 4.1 del contrato, en el Anexo de Tarifas (que cita explícitamente "Cláusula 4.1") y en la Liquidación Mensual (que también cita "Cláusula 4.1"). Sin drift entre documentos.

### 4. ✅ Verificado — referencias cruzadas de cláusulas exactas

El Anexo de Tarifas y la Liquidación Mensual citan cláusulas específicas del contrato (4.1, 4.2, 4.4, 6.3, 9.2). Se comparó cada cita contra el texto real de esa cláusula en `URB-CON-001` — las cuatro coinciden exactamente, ninguna quedó desactualizada.

### 5. ✅ Verificado — ejemplo numérico recalculado

El ejemplo de liquidación (70 USD/noche × 20 noches) se repite en el Anexo de Tarifas, tomado de la Propuesta de Gestión de Alquiler Temporal (D-056, ya aprobada y enviada a prospectos reales vía la automatización D-057/058). Se recalculó de forma independiente: 1.400 USD generados − 42 USD de comisión de plataforma (3%) − 280 USD de comisión de Urbannit (20%) = **1.078 USD netos** — coincide exactamente con ambas fuentes.

### 6. ✅ Verificado — ortografía de marca y endoso obligatorio

Ningún documento usa una variante mal escrita de "Urbannit" (se buscó explícitamente "Urban" sin la segunda "n"). El endoso **"gestionado por Meridiano Capital"** (obligatorio por D-014) aparece en los 5 documentos, entre 3 y 6 veces cada uno según su extensión.

### 7. 🔵 Observación, no bloqueante — la Liquidación Mensual no cita la razón social

`URB-REP-001` (Liquidación Mensual) menciona "URBANNIT" y el endoso de marca, pero no cita "Campo Agreste S.A." ni el RUC en ningún lugar — a diferencia de los otros cuatro documentos. Es un criterio defendible (es un formato de reporte interno, sin firma de las partes, no un instrumento legal que necesite identificar al firmante), pero se deja anotado por transparencia — si el founder prefiere que también lleve la razón social completa, es un cambio menor.

### 8. ✅ Verificado — la documentación comercial ya aprobada no queda contradicha

Se revisó específicamente que nada de lo nuevo (contrato, anexos, T&C) contradiga lo que las dos propuestas comerciales de Urbannit (D-056) ya le prometieron a un prospecto real — proceso de 10 pasos, tarifa de limpieza a cargo del huésped, liquidación mensual con detalle completo, "qué aporta cada parte". No se encontró ninguna promesa comercial que el contrato no contemple o que contradiga.

### 9. ✅ Verificado — el sitio público sigue sin filtrar la comisión exacta

La sección `#urbannit-detalle` del sitio (D-057 Parte B) sigue sin publicar el 20% de comisión ni los checklists operativos granulares, consistente con RN-04. Los 5 documentos de este lote son de entrega directa al propietario/huésped real, no material de marketing masivo — no hay conflicto entre lo público y lo privado.

### 10. ✅ Verificado — Master Document Index actualizado y sin estados obsoletos

Se confirmó que ningún documento ya construido (`URB-CON-001/002/003/005`, `URB-REP-001`) sigue marcado como "Falta" en `00-fase-a-diagnostico-y-arquitectura.md` — el único ítem todavía en "Falta" relacionado es `URB-CON-004` (Acta de entrega), correctamente pendiente.

## Resumen

| Severidad | Cantidad | Detalle |
|---|---|---|
| 🟡 Corregido durante esta auditoría | 1 | Título del Anexo I (§1) |
| 🔵 Observación, sin acción tomada | 1 | Liquidación Mensual sin razón social (§7) |
| ✅ Verificado sin hallazgos | 8 | §2–6, 8–10 |

**No se encontraron contradicciones de fondo** (cifras, responsabilidades, plazos) entre los 5 documentos, ni entre estos y el material comercial ya aprobado y en uso real (D-056/057/058). El único hallazgo real era de redacción (nombre del anexo), ya corregido.

## Pendiente, fuera del alcance de esta auditoría

Esto audita **consistencia interna** entre los documentos ya construidos — no reemplaza la validación legal externa que sigue pendiente para `URB-POL-001` (seguro de responsabilidad civil) y `URB-POL-002` (registro SENATUR/Registur), ya señalada en `01-notas-urb-con-001.md`.
