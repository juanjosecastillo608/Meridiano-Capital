Estado: CURRENT
Fuente original: meridiano-investor-journey/SKILL.md, meridiano-investor-journey/references/*, meridiano-capital-identity/references/13-proyectos-inmobiliarios.md
Dominio: BUSINESS

# Modelo de negocio de Meridiano Capital — vista general

Meridiano Capital es una firma de desarrollo y gestión inmobiliaria en Asunción, Paraguay, enfocada en **inversores extranjeros** (Argentina, Brasil, Europa). Su diferenciador central no es solo vender o administrar inmuebles: es el **acompañamiento total** del inversor a través de todo el camino legal, migratorio, bancario y fiscal necesario para invertir en Paraguay siendo extranjero.

> "El inversor no compra solo un departamento, recibe acompañamiento de la mano en todo el camino legal, migratorio, bancario y fiscal para poder invertir en Paraguay." — principio rector, `meridiano-investor-journey/SKILL.md`

## Principio rector del negocio

**El acompañamiento genera la cartera y el referido.** El objetivo de negocio no es solo cerrar una compra puntual: es que el inversor mantenga su cartera administrada por Meridiano en el tiempo y refiera a familiares y amigos. Cada etapa bien acompañada es una razón para que el inversor confíe y vuelva. Regla operativa explícita: no improvisar el proceso ni saltear etapas.

## Los dos negocios (no confundir)

Meridiano opera **dos modelos de negocio con economías distintas**. Ver detalle completo en `01-dos-modelos-de-negocio.md`.

1. **Modelo A — Inversión Individual** (el negocio principal hoy): el inversor compra su propia unidad, Meridiano la administra, cobra comisión de venta 5,5% + honorarios de administración/alquiler.
2. **Modelo B — Coinversión** (tickets grandes, desarrollo): varios inversores aportan a un vehículo común (S.A. o Fideicomiso), Meridiano estructura y gestiona, cobra fees de estructuración + gestión de obra + carried interest sobre un hurdle del 8%.

Ambos modelos comparten las mismas etapas de onboarding del inversor (cédula → banco → sociedad → estructura fiscal), documentadas en `04-etapas-del-inversor.md`.

## El diferenciador comercial más fuerte: cédula desacoplada de la inversión

El hallazgo/gancho comercial central del negocio: **un extranjero puede comprar inmuebles en Paraguay a través de una S.A. sin que ningún socio tenga cédula paraguaya**, con Meridiano actuando como representante legal y síndico. Esto elimina la fricción de entrada más grande para el inversor extranjero (no tiene que esperar meses de trámite migratorio para empezar a invertir). Detalle completo en `02-camino-migratorio.md`.

## Segmentación de clientes

| Segmento | Definición | Modelo de negocio aplicable | Camino migratorio típico |
|---|---|---|---|
| Inversor individual (la mayoría) | Compra 1-2 unidades para renta/plusvalía propia | Modelo A | Estándar (< USD 200k) |
| Inversor de cartera / +2 propiedades | Varias unidades, constituye S.A. | Modelo A (posiblemente escalando a B) | Investor Pass si ≥ USD 200k |
| Coinversor / ticket grande | Aporta capital a un vehículo de desarrollo | Modelo B | Investor Pass (≥ USD 200k) casi siempre |

> UNRESOLVED: no hay en el material fuente una definición explícita de tamaño de ticket mínimo para coinversión (más allá de que se cruza típicamente con Investor Pass, ≥ USD 200.000). No asumir que USD 200k es el mínimo de entrada a coinversión — es el umbral migratorio, una coincidencia funcional, no una regla de producto declarada como tal.

## Sistema de producto inmobiliario: marca corporativa vs. identidad de proyecto

Cuando Meridiano origina, coinvierte o gestiona un desarrollo (edificio, barrio, urbanización), ese desarrollo puede o no tener su propia identidad comercial (nombre, isotipo, paleta). Esta es una decisión de arquitectura de marca aplicada al producto/negocio — ver `05-proyectos-inmobiliarios.md` para el detalle completo, incluyendo cuándo SI y cuándo NO conviene una identidad de proyecto propia, y la regla de que Meridiano Capital nunca desaparece detrás del nombre del proyecto.

## Mapa de archivos de este dominio

- `01-dos-modelos-de-negocio.md` — las dos líneas de negocio, economía de cada una, regla de no confundirlas, regla del hurdle simple/compuesto.
- `02-camino-migratorio.md` — cómo empieza a invertir el extranjero; Decisión 1 (S.A. sin cédula vs. cédula propia) y Decisión 2 (camino estándar vs. Investor Pass).
- `03-modelo-coinversion.md` — detalle operativo del vehículo de coinversión: economics, waterfall, gobernanza, red de aliados, riesgo.
- `04-etapas-del-inversor.md` — las seis etapas operativas del investor journey con documentos, responsables y errores comunes.
- `05-proyectos-inmobiliarios.md` — sistema de marca/identidad para proyectos inmobiliarios individuales dentro del portafolio de Meridiano.

## Requisitos que este dominio impone a otros dominios

- **INVESTMENT (matemática de inversión)**: los motores de cálculo deben separarse exactamente según el modelo — `evaluar_renta`, `evaluar_reventa`, `evaluar_reventa_temprana`, `evaluar_retorno_combinado` para Modelo A; `evaluar_coinversion` (con waterfall completo y selección automática simple/compuesto de hurdle según plazo) para Modelo B. Nunca mezclar los pisos de renta del modelo individual con el waterfall de coinversión.
- **BRAND**: la identidad de proyectos inmobiliarios individuales debe seguir el modelo de Endorsed Brand ya definido para Urbannit (aplicado por analogía) — mención obligatoria "Un desarrollo de Meridiano Capital" y el isotipo del mojón siempre presente.
- **OPERATIONS**: debe soportar el journey de 6 etapas (pre-inversión → estructura de entrada → banco → sociedad → fiscal → inversión/administración) con red de aliados profesionales (abogado, escribano, contadora, operador de renta temporal) y el rol de Meridiano como representante legal/síndico interino.
- **MARKETING/VENTAS**: la comisión de venta (5,5%) y los fees de coinversión nunca deben mostrarse cruzados entre propuestas de los dos modelos; el tarifario solo se comparte en etapa avanzada del journey, nunca en el primer contacto.
