Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-investor-journey/references/tarifario.md
Dominio: OPERATIONS

# Tarifario de servicios — Meridiano Capital

> La fuente original está marcada **ESTADO: COMPLETO** — todos los datos cargados. Paquetes y datos societarios provienen del Programa de Ingreso; los honorarios de administración (10%) y colocación (50% de un mes) fueron confirmados vía la operación **Habitalis 9A**. Sin `[COMPLETAR]` pendientes en esta ficha.

**Regla de uso (heredada del `SKILL.md` de la skill original):** este tarifario se envía en etapa avanzada, cuando el inversor ya calificó y pide números con alternativas. **No va en el primer contacto.** Nunca informar estos montos de memoria si la fuente vigente no los tiene cargados — a la fecha de esta migración sí los tiene, pero la regla de verificación se preserva como práctica operativa permanente.

## Paquetes de ingreso al mercado paraguayo

Estos paquetes ejecutan las Etapas 1 y 3 del journey (estructura de entrada / cédula y Sociedad Anónima) empaquetadas comercialmente.

| Paquete | Precio | Incluye |
|---|---|---|
| **Asesoramiento Mensual** ⭐ *el más elegido* | **USD 350 / mes** (contrato 1 año) | Asesoramiento continuo + **síndico + representante legal + contador** |
| **Paquete Completo** (sin cédula) | **USD 6.000** | Constitución de S.A. + apertura de cuenta + ingreso de capital acompañado |
| **Completo + Cédula 2 años** | **USD 8.000** | Paquete completo + cédula paraguaya (2 años) para 1 socio |
| **Completo + Cédula 10 años** | **USD 10.000** | Paquete completo + cédula paraguaya (10 años) para 1 socio |
| **Solo trámite de cédula** | **USD 2.200 – 2.500** | Sin paquete societario · varía según nacionalidad |

**El modelo de ingresos, explícito en la fuente:** un cliente típico paga un paquete de setup por única vez (USD 6.000–10.000) **+** el asesoramiento mensual (USD 350) que mantiene la S.A. operativa. El mensual es lo que permite al extranjero operar sin cédula (Meridiano cubre síndico, representante legal y contador) y es el **ingreso recurrente** de Meridiano — distinto del ingreso de setup, que es único.

> UNRESOLVED: la fuente no indica qué pasa con el Asesoramiento Mensual (USD 350) cuando el inversor obtiene su cédula y, según el journey de negocio, "puede asumir rep. legal/síndico y liberar el acompañamiento" — ¿el contrato de 1 año se puede cancelar antes, se renueva automáticamente, hay penalidad? No hay condición de salida documentada para este ingreso recurrente.
> UNRESOLVED: "Solo trámite de cédula" da un rango (USD 2.200–2.500) que "varía según nacionalidad" pero no especifica la tabla de nacionalidad → precio exacto.

## Datos societarios y bancarios (confirmados)

| Dato | Valor |
|---|---|
| Composición societaria | **S.A. 100% extranjera** — no requiere socios paraguayos |
| Capital social mínimo legal | ₲ 900.000.000 (≈ USD 150.000) — **es capital nominal/autorizado, NO hay que integrarlo; no es un piso de inversión** |
| Capital social sugerido | ₲ 5.000.000.000 (≈ USD 834.000, al cambio ₲6.000/USD) — para posicionar al inversor; suele destinarse a la compra del inmueble |
| Cuenta bancaria | Doble moneda (Gs + USD), a nombre de la sociedad |
| Tope del primer ingreso acompañado | USD 200.000 |
| Roles obligatorios de la S.A. | Representante legal, síndico y contador — incluidos en el Asesoramiento Mensual |
| Cédula | validez 2 años o 10 años |

> UNRESOLVED: el "tope del primer ingreso acompañado" de USD 200.000 no está explicado — no queda claro si es un límite regulatorio (p. ej. relacionado al umbral del Investor Pass, que también es USD 200.000 en `04-etapas-del-inversor.md`) o un límite operativo propio de Meridiano para el acompañamiento del primer desembolso. La coincidencia con el umbral del Investor Pass sugiere relación pero no está confirmada en la fuente.
> UNRESOLVED: el tipo de cambio ₲6.000/USD usado para el capital social sugerido es una referencia puntual, no fechada — sujeta a variación cambiaria; no se indica con qué frecuencia se debe actualizar esta cifra en el material comercial.

## Servicios de administración y comercialización de propiedad

Estos servicios ejecutan la Etapa 5 del journey (Inversión y administración) y el Acompañamiento continuo posterior.

Meridiano distingue dos carteras, y **las comisiones NO son intercambiables**:

- **Cartera A** — unidades propias o del inversor que Meridiano **administra**.
- **Cartera B** — unidades de terceros que Meridiano **solo intermedia** (el administrador es un externo).

| Servicio | Costo | Base |
|---|---|---|
| Honorario de administración | **10% de la renta** | gestión mensual continua de la unidad (Cartera A) |
| Comisión de colocación / intermediación de renta | **50% de un mes de alquiler** | por colocar un inquilino (aplica a Cartera B; en Cartera A es el honorario de alquiler) |
| Comisión de venta | **5,5%** | confirmado |

**Regla de rol (restricción de marca — aplica también al dominio BRAND):** cuando la operación es de intermediación de terceros (Cartera B), Meridiano se presenta como **"Intermediación inmobiliaria"**, nunca como "Administración" — no debe atribuirse una gestión que no ejerce, y debe nombrarse al administrador real cuando corresponda. En Cartera B, Meridiano cobra la colocación (50% de un mes) **pero NO** el 10% de administración: esa gestión es del administrador externo.

> UNRESOLVED: la tabla no aclara si la "Comisión de colocación / intermediación de renta" (50% de un mes) en Cartera A es literal (se cobra una vez, al inicio del contrato de alquiler, además del 10% mensual recurrente) o si el 10% de administración ya la reemplaza / absorbe. El texto dice "en Cartera A es el honorario de alquiler", lo cual sugiere que en Cartera A el 50% de un mes no aplica como cargo separado, pero no está dicho de forma inequívoca.

## Economía de coinversión (Modelo B — no confundir)

Ver `modelo-coinversion.md` (fuente no incluida en el alcance de este dominio; pertenece a INVESTMENT/BUSINESS). Resumen preservado tal cual aparece en la fuente de este tarifario, sin expandir: fee de estructuración 1,5–3% · fee de gestión de obra 2–4% · carried interest 15–20% sobre hurdle 8%.

> UNRESOLVED: este tarifario advierte explícitamente "no confundir" el modelo de coinversión con los paquetes de ingreso individuales, pero no dice qué pasa si un mismo inversor participa de ambos modelos a la vez (p. ej., tiene una unidad propia en Cartera A y además participa como coinversor en un desarrollo) — si los fees se acumulan, se negocian aparte, o hay algún descuento cruzado.

## Cómo presentar el tarifario — opciones por tipo de cliente

Guía operativa de presentación, preservada de la fuente:

- **Quiere empezar a invertir ya, sin residir** → Paquete Completo (6.000) + mensual (350). Sin cédula.
- **Quiere invertir y tramitar su residencia** → Completo + Cédula 2 años (8.000) + mensual.
- **Quiere invertir y radicarse a largo plazo** → Completo + Cédula 10 años (10.000) + mensual.
- **Solo quiere la cédula** → Trámite suelto (2.200–2.500).

**Regla de presentación:** siempre separar el costo de setup (única vez) del recurrente mensual, para que el inversor vea su carga fija.

> UNRESOLVED: no hay una quinta fila para el inversor que participa en coinversión (Modelo B) — la guía de presentación por tipo de cliente cubre solo los cuatro perfiles del modelo de inversor individual. No está definido cómo se presenta el costo al perfil de coinversión en el mismo formato de "setup único vs. recurrente".
