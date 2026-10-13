# Ficha de operación — Oferta de compra HERRERA-002-OF01

> **Documento interno.** No se envía a las partes. Las etiquetas de estado (RECIBIDO, VERIFICADO, CÁLCULO, PENDIENTE, CONTRADICTORIO) no se vuelcan en la carta.
> Código administrativo creado por Meridiano Capital (fecha + inmueble). **No es un dato registral.**
> Caso distinto de `HERRERA-001` (edificio inconcluso, otro vendedor): no se usó ningún dato de ese caso.
> PII según `governance/PII_POLICY.md`: solo nombre, rol y documento de identidad de las partes. Sin domicilios, teléfonos, emails ni fecha de nacimiento personales.

## Documentos fuente (no versionados en git)

| ID | Documento | Qué aporta | Limitación |
|---|---|---|---|
| E1 | `MCA_Casa_Herrera.pdf` (1 pág., escaneo sin capa de texto — leído visualmente) | Boleta municipal de **Impuesto Inmobiliario**, Municipalidad de Asunción, año 2016, cuota 1/6, factura 36-1063168-1, vencimiento 29/02/2016. Contribuyente, cuenta catastral, ubicación, superficies, valores fiscales 2016. | Documento de **2016**: no acredita titularidad registral actual, ni que el impuesto esté al día, ni ausencia de gravámenes. El nombre del archivo dice "MCA", pero el contenido **no es** un análisis comparativo de mercado. |
| E2 | Foto de cédula de identidad paraguaya de la oferente | Nombre y número de CI de la oferente | Solo identificación. Estado civil y domicilio no figuran. |
| E3 | Instrucciones del founder en el chat (2026-10-13) | Precio pedido, oferta, moneda, financiamiento, gastos, comisión, impuestos, rol de cada agente | Datos declarados, sin respaldo documental adjunto |

## A. Operación

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Código | HERRERA-002-OF01 (versión 1) | administrativo | CÁLCULO |
| Ciudad / fecha de emisión | Asunción, 13 de octubre de 2026 | E3 | RECIBIDO |
| Tipo de operación | Compraventa de inmueble (casa) | E3 | RECIBIDO |
| Rol de Meridiano | **CAPTADOR** (lado de la parte vendedora) | E3 | RECIBIDO — autorización de venta / contrato de captación **PENDIENTE** de adjuntar |
| Jurisdicción | República del Paraguay | E1 | RECIBIDO |
| Naturaleza de la carta | Oferta de compra formulada por la oferente | E3 | RECIBIDO |
| Efecto de la aceptación | — | — | **PENDIENTE** (ver Control, P-07) |

## B. Parte vendedora

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Nombre | Andrea Elizabeth Cáceres de Ruiz (como **contribuyente** en 2016) | E1 | RECIBIDO — **no verificado como titular registral vigente** |
| Documento | No consta (casillero RUC vacío en E1) | — | PENDIENTE |
| Titulares / porcentajes / cónyuge | El apellido "de Ruiz" sugiere estado civil casada → podría requerirse asentimiento conyugal. **No verificado.** | E1 (inferencia, no dato) | PENDIENTE |
| Representante y facultades | No informado | — | PENDIENTE |

## C. Oferente / parte compradora

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Nombre | Ana Liesel Guggiari Niederberger | E2 | VERIFICADO contra documento |
| Documento | C.I. N° 3.209.470 — República del Paraguay | E2 | VERIFICADO contra documento |
| Estado civil | No consta | — | PENDIENTE (relevante si el préstamo o la escritura requieren intervención del cónyuge) |
| Domicilio / contacto | No se registran en esta ficha (política PII) | — | — |
| Futuro adquirente = oferente = pagador | Se asume la misma persona; pagador parcial = banco (préstamo) | E3 | RECIBIDO. No se autoriza sustitución de adquirente. |

## D. Inmueble

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Tipo | Casa | E3 | RECIBIDO |
| Dirección | Gral. Carlos Díaz León N° 3126, entre Gral. Rogelio Benítez y [segunda calle cortada en el escaneo] | E1 | RECIBIDO (2ª entrecalle ilegible) |
| Barrio / ciudad | Barrio Herrera (declarado por el founder; E1 solo muestra el código municipal "BARRIO: 143") — Asunción, Capital | E1 + E3 | RECIBIDO — correspondencia código 143 ↔ Herrera no verificada |
| Cuenta corriente catastral | 14-0504-18-0 (R.M.C. 6616073) | E1 | RECIBIDO |
| Finca / matrícula | No consta | — | **PENDIENTE** (necesaria para la escritura y para el banco) |
| Superficie de terreno | 402 m² | E1 (2016) | RECIBIDO |
| Superficie edificada | 112 m² | E1 (2016) | RECIBIDO — puede no reflejar ampliaciones posteriores |
| Valor fiscal 2016 | Gs 63.253.100 (terreno 26.966.200 + edificio 36.286.900) | E1 | RECIBIDO — referencia fiscal, **no** valor de mercado |
| Bienes incluidos/excluidos | No informado | — | PENDIENTE |
| Ocupación / alquileres | No informado | — | PENDIENTE |
| Gravámenes / deudas | No informado. Impuesto inmobiliario al día: no verificado | — | PENDIENTE |

## E. Agentes

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Captador | **Meridiano Capital** — agente: Juan José Castillo | E3 | RECIBIDO. Sin facultad para aceptar por la vendedora ni para recibir fondos (no documentada) |
| Colocador | **Supremo EAS** — agente: Mario Luis Dávalos Díaz | E3 | RECIBIDO. "Representación" de la compradora: no documentada → se lo nombra como colocador, no como apoderado |
| Entidad operadora de Meridiano | No indicada para esta operación (no se usa Campo Agreste S.A. — D-029) | — | — |
| Acuerdo de comisión | 5,5 % a cargo de la parte vendedora | E3 | RECIBIDO — base, IVA, exigibilidad y reparto PENDIENTES |
| Acuerdo entre inmobiliarias (reparto) | No informado | — | PENDIENTE (documento separado, no va en la carta) |

## F. Importes y condiciones

| Campo | Valor | Fuente | Estado |
|---|---|---|---|
| Precio solicitado | USD 220.000 | E3 | RECIBIDO (fecha/fuente del precio no informada) |
| Precio ofertado | **Gs 1.000.000.000 (mil millones de guaraníes)** | E3 | RECIBIDO |
| Moneda de toda la operación | Guaraníes (la compradora tiene préstamo pre-aprobado en Gs) | E3 | RECIBIDO |
| Equivalencia de la oferta en USD | ≈ USD 169.400 con Gs 5.904/USD | Ver Control §2 | **ESTIMACIÓN** — tipo de cambio de hoy (13-10-2026) **PENDIENTE** |
| Financiación | Préstamo bancario **pre-aprobado** en Gs | E3 | RECIBIDO — banco, importe, aprobación definitiva y plazo PENDIENTES |
| Fondos propios | No informado | — | PENDIENTE |
| Reserva / seña / anticipo | No informado | — | PENDIENTE (no se agrega por defecto) |
| Gastos de escritura | A cargo de la compradora | E3 | RECIBIDO |
| Impuesto a las transacciones e IVA de la venta | A cargo de la vendedora | E3 | RECIBIDO — encuadre tributario a confirmar por contador (ver Control) |
| Comisión de intermediación | 5,5 % a cargo de la vendedora | E3 | RECIBIDO |
| Plazos (boleto, escritura, posesión) | No informados | — | PENDIENTE |
| Vigencia de la oferta | No informada | — | **PENDIENTE** |
| Canal de respuesta | No informado | — | PENDIENTE |

## Bloque de carga rápida (YAML)

```yaml
operacion:
  codigo: HERRERA-002-OF01
  ciudad_emision: Asunción
  fecha_emision: 2026-10-13
  jurisdiccion: Paraguay
  rol_meridiano: CAPTADOR
  naturaleza_oferta: oferta de compra de la oferente
  efecto_aceptacion: # PENDIENTE
propietario:
  nombre_o_razon_social: Andrea Elizabeth Cáceres de Ruiz  # contribuyente 2016, titularidad no verificada
  documento_o_ruc:   # PENDIENTE
  representante_y_facultades:  # PENDIENTE
oferente:
  nombre_o_razon_social: Ana Liesel Guggiari Niederberger
  documento_o_ruc: C.I. 3.209.470 (Paraguay)
  futuro_adquirente_si_es_distinto: no
propiedad:
  tipo: casa
  direccion: Gral. Carlos Díaz León 3126 e/ Gral. Rogelio Benítez y [ilegible]
  barrio_ciudad_departamento: Herrera (declarado; cód. municipal 143), Asunción, Capital
  finca_matricula_padron_cuenta_catastral: Cta. Cte. Ctral. 14-0504-18-0; finca PENDIENTE
  superficies_y_fuentes: terreno 402 m2, edificada 112 m2 (boleta municipal 2016)
agentes:
  captador_inmobiliaria_agente_contactos: Meridiano Capital — Juan José Castillo
  colocador_inmobiliaria_agente_contactos: Supremo EAS — Mario Luis Dávalos Díaz
  acuerdos_de_intermediacion_y_comision: 5,5% a cargo de la vendedora (IVA/base/reparto PENDIENTE)
economia:
  moneda: PYG
  precio_venta_solicitado: USD 220.000
  precio_ofertado: Gs 1.000.000.000
  impuestos: impuesto a las transacciones e IVA a cargo de la vendedora
  pagos: # PENDIENTE desglose fondos propios / préstamo
  financiacion_o_permuta: préstamo bancario pre-aprobado en Gs (banco PENDIENTE)
condiciones:
  gastos_e_impuestos: escritura a cargo de la compradora
vigencia: # PENDIENTE
```
