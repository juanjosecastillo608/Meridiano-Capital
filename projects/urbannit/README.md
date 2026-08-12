# Proyecto: Urbannit

Urbannit es la marca de renta temporal/hospitalidad, gestionada por Meridiano Capital bajo el modelo de Marca Endosada (`knowledge-base/brand/10-arquitectura-meridiano-urbannit.md`, decisión D-014). Su conocimiento de marca/negocio de base sigue viviendo en `knowledge-base/brand/` y `knowledge-base/business/` como parte del proyecto Meridiano Capital.

**Estado**: activo desde 2026-08-12 — primer contenido propio en `legal-operations-os/`.

## `legal-operations-os/`

Sistema jurídico-operativo de Urbannit (contratos, reglamentos, políticas, formularios, checklists), iniciado el 2026-08-12 a pedido del founder ("URBANNIT LEGAL & OPERATIONS OS", prompt maestro) tras aportar como referencia el contrato real de un competidor (`Contrato GOHOST - Prestación Servicio 20.08.25.pdf`, LosBra SRL).

- `00-fase-a-diagnostico-y-arquitectura.md` — Fase A (Auditoría): diagnóstico, qué falta, riesgos, arquitectura de 10 niveles, Master Document Index, prioridades y roadmap.
- `01-notas-urb-con-001.md` — bitácora de redacción del primer contrato real (`URB-CON-001`, ver abajo): qué quedó confirmado por el founder, qué es propuesta mía sin confirmar, y qué requiere validación de un abogado paraguayo.
- `02-notas-anexo-i-y-terminos-huesped.md` — misma bitácora para `URB-CON-002` y `URB-CON-005`.
- `03-notas-anexo-tarifas-y-liquidacion.md` — misma bitácora para `URB-CON-003` y `URB-REP-001`.
- `04-auditoria-documental.md` — auditoría de consistencia entre los 5 documentos del lote (nombres, cifras, referencias cruzadas contra el material comercial ya aprobado). 1 inconsistencia real encontrada y corregida (título del Anexo I).

**Documentos borrador construidos hasta ahora** (todos en `production/entregables/`, generados desde `production/generadores/build_urbannit_*.js`, **ninguno para firmar sin revisión legal**):

| Código | Documento | Decisión |
|---|---|---|
| `URB-CON-001` | Contrato de Administración de Alquiler Temporal | D-059 (2026-08-12) — aprobado por el founder |
| `URB-CON-002` | Anexo I — Inventario del Inmueble | D-060 (2026-08-12) |
| `URB-CON-003` | Anexo — Tarifas y Comisiones | D-061 (2026-08-12) |
| `URB-CON-005` | Términos y Condiciones de Estadía (huésped) | D-060 (2026-08-12) |
| `URB-REP-001` | Formato de Liquidación Mensual al propietario | D-061 (2026-08-12) |

**Auditoría documental (D-062, 2026-08-12)**: ✅ completada. 1 inconsistencia real corregida (título del Anexo I, distinto entre la Cláusula 2.3 del contrato y el propio documento). Sin contradicciones de fondo en cifras, plazos ni responsabilidades entre los 5 documentos, ni contra el material comercial ya aprobado (D-056/057/058). Ver `04-auditoria-documental.md`.

**Pendiente**: `URB-REG-001` (reglamento de huéspedes) descartado por ahora — el founder confirmó que `URB-CON-005` ya alcanza. Sigue bloqueado por validación legal externa: `URB-POL-001` (seguro) y `URB-POL-002` (SENATUR).

**Agendado como pendiente (2026-08-12)** — ver `governance/decisions/DECISION_REGISTER.md`:
- **U-032**: enviar el paquete completo (5 documentos, ya auditado) a un abogado paraguayo real — validar seguro de responsabilidad civil y alcance de SENATUR/Registur. Ninguno de los 5 documentos debe firmarse antes de esto.
- **U-033**: decidir si `URB-REP-001` (Liquidación Mensual) debe incluir la razón social/RUC de Campo Agreste S.A.
