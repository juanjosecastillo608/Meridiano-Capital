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

## Alertas abiertas

- Cuenta de tercero en EE.UU. mientras factura la S.A.: la contadora define el
  tratamiento fiscal (referencia D-001/D-045: IVA alquiler residencial 5%).
- El domicilio del locatario está en el exterior: el abogado decide si conviene
  constituir un domicilio en Paraguay.
