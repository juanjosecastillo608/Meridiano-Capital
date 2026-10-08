# WF-04 · Contrato de Locación (Sistema de Contratos de Locación v1.0)

Capa WORKFLOWS. Adoptado el 2026-10-08 (D-096) a partir del prompt maestro
"SISTEMA DE CONTRATOS DE LOCACIÓN – MERIDIANO, Versión 1.0" del founder.
Primer caso: `contracts/cases/LOC-001/`.

## Principio

La **Ficha Maestra de Locación** es la única fuente de datos contractual.
Nunca se genera un contrato desde documentos sueltos (pasaportes, mensajes,
correos). Flujo obligatorio:

```
DOCUMENTACIÓN / DATOS → FICHA MAESTRA → VALIDACIÓN → CONTRATO → ANEXOS → CONTROL FINAL
```

La ficha es la capa de datos; el contrato es la capa jurídica. No mezclarlas.

## PROCESS

1. **¿Existe Ficha Maestra?**
   - **Sí (Caso A)**: leerla completa, identificar confirmados / faltantes /
     pendientes de confirmación / pendientes documentales / inconsistencias.
     No reinterpretar documentación original para reemplazar datos ya validados.
   - **No (Caso B)**: detener. Construir primero la ficha (estructura mínima
     A–J: expediente, locador, locatario, codeudor, inmueble, condiciones
     económicas, plazo, servicios, datos de pago, inventario/anexos) solo con
     datos respaldados o confirmados por el usuario.
2. **`VALIDACION_FICHA()`** — 19 puntos mínimos: identidad y representación
   del locador, identidad del locatario, codeudor SI/NO, inmueble, canon,
   moneda, depósito, plazo, inicio, fin, forma de pago, servicios, expensas,
   IVA, reajuste, anexos, cuenta receptora, coincidencia propietario vs.
   beneficiario. Más coherencia matemática y temporal (inicio + duración = fin).
3. **Contrato** — solo con datos CONFIRMADOS de la ficha + modelo contractual
   aprobado + instrucciones aprobadas para la operación. Lo que la ficha no
   define se marca como `[REVISIÓN REQUERIDA]` resaltado, nunca se rellena.
4. **Anexos** — Anexo I – Inventario si el inmueble se entrega amoblado. Si no
   fue suministrado: `PENDIENTE_DOCUMENTAL`, plantilla sin ítems (nunca
   inventar muebles, marcas, cantidades ni estado).
5. **`CONTROL_FINAL_CONTRATO()`** — contrato vs. ficha campo por campo + control
   matemático (montos únicos, depósito en meses, fechas) + partes y firmas.

## Estados de información

`CONFIRMADO` · `PENDIENTE_DE_CONFIRMACION` · `INFORMACION_FALTANTE` ·
`PENDIENTE_DOCUMENTAL` · `INCONSISTENCIA` · `REVISION_REQUERIDA`.
Nunca convertir un pendiente en CONFIRMADO automáticamente. Placeholders
(`XXXX`, `000000`, `[COMPLETAR]`) = `INFORMACION_FALTANTE`.

## Reglas duras

- Prioridad de fuentes: instrucción expresa más reciente del usuario > Ficha
  validada > documentación oficial > modelo aprobado > documentación auxiliar.
  Contradicción relevante → `INCONSISTENCIA / REVISION_REQUERIDA`, nunca
  resolver arbitrariamente.
- Prohibido inventar nombres, documentos, números, direcciones, RUC, NIS,
  Cta. Cte. Ctral., cuentas, porcentajes, multas, intereses, reajustes,
  plazos, garantías, obligaciones o condiciones comerciales.
- Sin codeudor → sin comparecencia, cláusulas ni firma de codeudor. Ninguna
  persona entra al contrato sin función contractual confirmada.
- Depósito separado del canon: no se presume pago del último mes, imputación
  unilateral, condiciones de devolución no pactadas ni intereses.
- IVA/expensas incluidos → se declaran comprendidos, nunca se suman.
- `REAJUSTE_APLICA: NO` → ninguna indexación.
- **Cuenta de tercero** (`BENEFICIARIO ≠ PROPIETARIO`): el propietario designa
  y autoriza la cuenta, los pagos correctos tienen efecto cancelatorio; nunca
  describirla como "cuenta del propietario" ni inferir relación entre titular
  y propietario.
- Meridiano acompaña y coordina: la validación jurídica es del abogado o
  escribano, y la fiscal de la contadora.

## Estados finales permitidos

`FICHA_EN_CONSTRUCCION` / `FICHA_PENDIENTE_DE_DATOS` / `FICHA_VALIDADA` ·
`CONTRATO_NO_GENERABLE` / `CONTRATO_BORRADOR` / `CONTRATO_APTO_PARA_REVISION` /
`CONTRATO_APTO_PARA_FIRMA` · `EXPEDIENTE_CON_PENDIENTES_DOCUMENTALES` /
`EXPEDIENTE_DOCUMENTALMENTE_CERRADO`.

Un contrato puede estar APTO_PARA_FIRMA con el expediente todavía
CON_PENDIENTES_DOCUMENTALES, pero nunca DOCUMENTALMENTE_CERRADO con un
pendiente abierto.

## PII — qué se versiona y qué no

Ficha Maestra, contrato, anexos y control de expediente contienen PII completa
(domicilio, email, teléfono, pasaporte, datos bancarios de terceros): **no se
versionan en git** (`governance/PII_POLICY.md`). Se conservan fuera del repo.
En `contracts/cases/LOC-NNN/` solo se versiona un `README.md` de estado, con
alias (`LOCATARIO-A`, `TERCERO-BENEFICIARIO-A`), sin datos de contacto ni
números de cuenta.

## Pendiente del sistema

No existe todavía en el repo un **modelo contractual de locación aprobado por
MERIDIANO**. Hasta que exista, las cláusulas generales que no salen de la
ficha (conservación, jurisdicción, domicilios) se marcan `[EXTENSION]` en el
control y quedan sujetas a revisión del abogado.
