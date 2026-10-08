# WF-04 · Contrato de Locación (Sistema de Contratos de Locación v1.0)

Capa WORKFLOWS. Adoptado el 2026-10-08 (D-096) y automatizado el mismo día (D-097) a partir del prompt maestro
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

## Automatización (v1.1, D-097)

Desde el 2026-10-08 el contrato **se genera automáticamente desde la ficha**, sobre el
modelo contractual aprobado por el founder (contrato base JUMACABE / Habitalis, 2026-09).

```bash
# 1. Ficha en blanco para un expediente nuevo (o copiar plantilla/FICHA_MAESTRA_LOCACION_v2_EN_BLANCO.docx)
python workflows/contrato-locacion/generar_contrato.py --plantilla-ficha ~/expedientes/LOC-002/FICHA.docx

# 2. Completar la ficha en Word y generar contrato + Anexos I–V + control
python workflows/contrato-locacion/generar_contrato.py ~/expedientes/LOC-002/FICHA.docx --salida ~/expedientes/LOC-002/

# Ficha v1 (formato LOC-001) → ficha v2 prellenada con los campos nuevos vacíos
python workflows/contrato-locacion/generar_contrato.py FICHA_v1.docx --migrar FICHA_v2.docx

# Tests (datos ficticios, sin PII)
python workflows/contrato-locacion/test_contrato_locacion.py
```

El generador **se niega a escribir dentro del repo** (PII). Salida por expediente:
`CONTRATO_<ref>.docx` (membrete Meridiano, cláusulas 1–25, Anexos I–V, firmas),
`CONTROL_<ref>.docx` (estados, VALIDACION_FICHA, CONTROL_FINAL_CONTRATO, resaltados,
pendientes, reglas escritas en la ficha) y `control_<ref>.json`.

| Archivo | Qué es |
|---|---|
| `modelo/MODELO_CONTRATO_LOCACION_v1.txt` | Texto del contrato aprobado con variables `{{ c.* }}` y bloques condicionales. Cambiar una cláusula = registrar decisión. |
| `modelo/parametros_modelo.json` | Constantes del modelo (mora 0,15%/día, tope, preavisos, devolución de depósito). |
| `plantilla/shell_meridiano.docx` | Membrete (logo + pie) del contrato base, sin contenido. |
| `plantilla/FICHA_MAESTRA_LOCACION_v2_EN_BLANCO.docx` | Ficha v2 (niveles C/R/O por campo). |
| `motor/ficha.py` | Esquema de la ficha, lector (.docx v1/v2 o .json) y escritor. |
| `motor/validacion.py` | VALIDACION_FICHA() + contexto del modelo. Nunca completa un dato faltante. |
| `motor/documento.py` | Render a .docx. Datos faltantes salen resaltados `⟦REVISIÓN REQUERIDA⟧`. |
| `generar_contrato.py` | CLI + CONTROL_FINAL_CONTRATO() + estados finales. |

### Reglas del motor

- Nivel **C** faltante, codeudor = SI (el modelo no tiene cláusula de codeudor), fechas
  incoherentes, IVA/expensas no incluidos, reajuste, moneda ≠ USD, inmueble no amoblado o
  servicios a cargo del propietario → **CONTRATO_NO_GENERABLE** (el modelo no cubre el caso;
  se necesita cláusula aprobada).
- Nivel **R** faltante → el contrato se genera con el punto resaltado → **APTO_PARA_REVISION**.
- Valores de relleno (`xx-xxxx-01`, `XXXX`, `[COMPLETAR]`, `000000`) = faltante.
- Sin hallazgos de revisión, sin resaltados y control final 100% → **APTO_PARA_FIRMA**.
- Cuenta cuyo titular ≠ propietario → cláusula de designación, autorización y efecto
  cancelatorio; si el titular mezcla sociedad y persona física, además pide confirmar el titular real.
- Tasa de IVA vs. destino contrastada con D-001/D-045 (vivienda 5%; comercial/temporal 10%).
- Inventario: si la ficha no trae ítems, el Anexo I sale como planilla por sectores sin bienes
  (nunca se copian bienes de otra unidad) y el expediente queda con pendiente documental.
- "No incorporar a X como parte" escrito en la ficha → el control verifica que X no figure.

### Diferencias deliberadas frente al contrato base (validadas por regresión)

Se regeneró el contrato base desde una ficha con sus mismos datos: el texto coincide salvo:

1. Comparecencia del representante: "por el Sr. *Nombre*, en su carácter de *Carácter*" (el
   carácter sale de la ficha en vez de ir fijo delante del nombre).
2. Pago: "Si el día de vencimiento fuera inhábil…" (sirve tanto para un día fijo como para una ventana 1–5).
3. Cuenta: se listan con etiqueta los datos bancarios que tenga la ficha (banco, titular,
   documento, número, routing, SWIFT, IBAN) y se agrega la cláusula de cuenta de tercero
   (regla 18 del sistema v1.0) cuando corresponde.
4. Correcciones de tipeo/puntuación: listas con "; " y minúscula, "del comprobante legal",
   "con posterioridad" (el base estaba cortado), tildes en títulos de anexos, comilla suelta eliminada.
5. Anexo I: los bienes del base (16 F) no se copian; se cargan desde la ficha de cada unidad.
6. **[EXTENSION]** Tope de la penalidad por mora = 5% del canon (en el base, USD 47,50 sobre
   USD 950). Ocupación posterior: canon/30 y 50%, con el mismo redondeo que el base.

### Hallazgo al construir el motor

El contrato base (16 F) ubica el edificio en **Avenida Molas López N.º 986** y la ficha de
LOC-001 (16 A) en **N° 2100**, y el base se firmó con Cta. Cte. Ctral. `xx-xxxx-01` (relleno).
El motor toma siempre lo que diga cada ficha: confirmar la numeración correcta del edificio.
