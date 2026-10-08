# LOC-001 · Locación — Habitalis Mburucuya 16° A

Primer caso de WF-04 (`workflows/contrato-locacion/`, D-096). Este README es
el único archivo versionado del caso: ficha maestra, contrato, Anexo I y
control de expediente tienen PII completa y se conservan **fuera de git**
(`governance/PII_POLICY.md`).

| Campo | Valor |
|---|---|
| Inmueble | Edificio Habitalis Mburucuya, Piso 16°, Departamento A (Asunción), amoblado |
| Locador | JUMACABE S.A. (persona jurídica, representada por el founder) |
| Locatario | `LOCATARIO-A` (persona física extranjera, sin codeudor) |
| Cuenta receptora | De tercero (`TERCERO-BENEFICIARIO-A`), autorizada por el locador en el contrato |
| Canon | USD 950/mes, IVA y expensas incluidos, sin reajuste |
| Depósito | USD 950 (1 mes), separado del canon |
| Plazo | 1 año, 08/10/2026 – 07/10/2027 (coherente: 365 días) |

## Estado al 2026-10-08

- **FICHA_VALIDADA**, con observaciones no críticas.
- **CONTRATO_APTO_PARA_REVISION**. Falta definir: destino del inmueble,
  primer canon (el contrato arranca el día 8 y la ventana de pago es del 1 al 5),
  entrega y restitución del depósito, a cargo de quién están el agua y las tasas,
  y cómo se consigna el carácter del representante (síndico o apoderado,
  lo confirma el escribano).
- **EXPEDIENTE_CON_PENDIENTES_DOCUMENTALES**: Anexo I – Inventario.

## Regeneración con el modelo aprobado (D-097, 2026-10-08)

Contrato regenerado automáticamente sobre el modelo base de Meridiano (WF-04 v1.1):
**FICHA_VALIDADA · CONTRATO_APTO_PARA_REVISION · EXPEDIENTE_CON_PENDIENTES_DOCUMENTALES**,
control final 32/32 OK. El modelo pide datos que la ficha v1 no tenía. Se entregó al
founder una ficha v2 prellenada (fuera de git) para completar: e-mail y WhatsApp del
propietario para notificaciones, cochera (N° o NO), primera ocupación, destino,
autorización de domicilio fiscal/comercial, tasa de IVA, los 3 contactos de urgencia y el
primer pago. Además, la dirección del edificio difiere de la del contrato base (N° 2100 vs. N.º 986): hay que confirmarla.

## Regeneración literal sobre el contrato base (D-098, 2026-10-08)

El founder indicó que el contrato base está completo y que solo deben cambiarse los datos por
los de la ficha, dejando tal cual lo que la ficha no trae. Se regeneró en modo
`--completar-con-base`. Se tomaron del base: destino, IVA 5%, primera ocupación,
autorización de domicilio fiscal/comercial, tratamiento del representante, medios de
notificación del propietario y contactos de urgencia. Resultado: **CONTRATO_APTO_PARA_REVISION**,
control final 38/38 OK. **Único dato abierto: la cochera de 16 A.** No se copió la Cochera N.º 54,
que figura en el base para el 16 F.

## Alertas abiertas

- Cuenta de tercero en EE.UU. mientras factura la S.A.: la contadora define el
  tratamiento fiscal (referencia D-001/D-045: IVA alquiler residencial 5%).
- El domicilio del locatario está en el exterior: el abogado decide si conviene
  constituir un domicilio en Paraguay.
