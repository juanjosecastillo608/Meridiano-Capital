# Meridiano Capital — Estructura Desarrolladora: Análisis, Decisiones e Integración

> **Encuadre:** La "Empresa Desarrolladora Inmobiliaria" del segundo chat **es Meridiano Capital en etapa de originación (pre-operativa)** — aún no ejecutó ningún desarrollo, pero **tiene un pipeline real de 3 proyectos en análisis simultáneo** para compra de terreno y desarrollo: uno contempla un terreno con un edificio de construcción interrumpida por falta de fondos del propietario, y los otros dos son compras de terreno. La estructura de 16 roles es el modelo operativo objetivo; la operación arranca con estos proyectos. Este documento define cómo se llega, qué se audita antes, y en qué orden se integra.
>
> **Fuente:** Chat Architecture Report — Desarrolladora Inmobiliaria (29-jul-2026). 9 proyectos (P-A…P-I), 16 entregables, modelo financiero de 939 fórmulas.
>
> **Límite de alcance:** este análisis se hizo sobre el *reporte*, no sobre los 16 documentos ni el `.xlsx`, que están en otra cuenta. Las validaciones celda-por-celda quedan pendientes de los archivos.

---

## 1. DECISIÓN RESUELTA — Economía del inversor en coinversión

**Meridiano, en coinversión (Modelo B), paga hurdle 8% + carried interest 15–20% vía waterfall. Nunca TIR fija.** `CONFIRMADO`

Queda **superado** el esquema de TIR fija del chat desarrollador (18% al inversor del terreno, 20% al de obra). Son dos economías incompatibles y no pueden convivir para el mismo inversor en el mismo proyecto:

| | TIR fija (esquema desarrollador, descartado) | Hurdle + carry (Meridiano, vigente) |
|---|---|---|
| Qué cobra el inversor | Un rendimiento pactado, tipo cuasi-deuda | Su parte del resultado real, sobre un piso del 8% |
| Quién absorbe el downside | El desarrollador (obligación fija) | Se comparte — no hay pasivo fijo |
| Quién se queda el upside | El desarrollador | Se reparte (80/20 sobre el remanente) |
| Riesgo para Meridiano | Alto (paga fijo aunque el proyecto rinda menos) | Acotado (gana sobre el excedente del hurdle) |
| Motor de cálculo | — | `meridiano-rentabilidad → evaluar_coinversion` |

**Por qué es la decisión correcta, con rigor:** bajo TIR fija, si el proyecto rinde por debajo de lo proyectado, Meridiano igual debe pagar 18–20% — el margen del desarrollador es el primer amortiguador que se consume, y puede volverse negativo. Bajo hurdle+carry, el inversor participa del resultado real y Meridiano no carga una obligación fija: el proyecto es estructuralmente más robusto.

**Matiz a tener presente:** algún aportante puntual (típicamente el dueño del terreno) puede negociar un retorno preferente fijo como condición de entrada. Eso es admisible como *tramo* específico, pero el **estándar de Meridiano es hurdle+carry**, y cualquier tramo preferente se modela aparte, no como regla general.

**Implicancia operativa:** cuando se integren el modelo financiero (P-E) y el Investment Memorandum (P-F), su bloque de "retorno al inversor" debe **reescribirse de TIR fija a waterfall**. El motor ya lo calcula; el trabajo es de conversión, no de invención.

---

## 2. CAPÍTULO DE ANÁLISIS — Auditoría del modelo financiero `PENDIENTE`

> **Estado:** pendiente de recibir `flujo_fondos_fideicomiso.xlsx` (939 fórmulas, en la otra cuenta). Este capítulo deja documentado **qué auditar, qué riesgos ya se detectan sobre los supuestos, y con qué método** — para que la auditoría, cuando llegue el archivo, sea de ejecución, no de descubrimiento.

### 2.1 Supuestos del modelo (según el reporte)

80 unidades · 65 m² prom · 5.200 m² vendibles. Preventa 8 m (24 u @ $2.200/m²) · construcción 30 m (48 u @ $2.500/m²) · entrega 6 m (8 u @ $2.800/m²). Hard cost $900/m² (curva S, 30 m). Soft costs: arquitecto 6% + permisos 2,5% + gerenciamiento 4% + contingencia 12%. Inversor terreno $2.000.000 (devolución mes 41). Inversores de obra: 50% del costo de construcción (mes 9). Fee fiduciario 0,5% anual. Comisiones: interno 3% (40% u) + brokers 4% (60% u). Sellos 1,8%. Admin $8.000/mes. Escrituración $1.500/u.

### 2.2 Los dos riesgos graves detectados sobre los supuestos

**RIESGO A — Base de cálculo del hard cost (crítico, verificar primero).**
$900/m² × 5.200 m² **vendibles** = $4,68M. Pero el **área construida** real (circulaciones, cocheras, amenities, muros, subsuelos) suele ser 1,20–1,30× el área vendible → 6.240–6.760 m² → obra real **$5,6–6,1M**. Si en el `.xlsx` el $900/m² está aplicado sobre vendible y no sobre construido, el modelo **subestima la obra en ~$0,9–1,4M** y sobreestima el margen en la misma magnitud. Es la primera celda a verificar.

**RIESGO B — Fragilidad del margen del desarrollador.**
Sanity-check grueso sobre los supuestos: ingresos ~$12,7M − costos ~$9,3M = ~$3,4M bruto. Bajo el esquema de TIR fija original, los inversores se llevaban ~$2,5M de rendimiento → quedaban ~$0,8M al desarrollador (~6% s/ventas): fino y frágil. **Bajo la decisión vigente (hurdle+carry), esto mejora estructuralmente:** ya no hay un pasivo fijo de $2,5M; el reparto depende del resultado real. Pero cambia el pitch: el inversor deja de tener retorno "garantizado" y pasa a tener retorno "participativo sobre un piso del 8%". El modelo debe reflejar esto.

### 2.3 Checklist de auditoría (cuando llegue el `.xlsx`)

1. **Hard cost:** confirmar base (vendible vs construido). Recalcular si aplica.
2. **Conversión a waterfall:** reescribir el bloque "Retorno a inversores": devolución de capital → hurdle 8% → split 80/20 del remanente. Alimentar `evaluar_coinversion` con el valor distribuible (D) que arroje el flujo.
3. **Fasedo de precios ($2.200 → $2.500 → $2.800):** contrastar con mercado de la zona. El salto de +27% es coherente con la matriz de plusvalía de P07 (preventa → terminado), pero debe validarse contra data real (UbicaProp / comparables).
4. **Absorción:** verificar que vender 24/48/8 unidades en las fases es realista para la zona y el plazo (el riesgo aquí es de *absorción*, no de vacancia).
5. **Timing de caja:** revisar que el saldo acumulado no se vuelva negativo en ningún mes entre el ingreso de obra (mes 9) y la devolución del terreno (mes 41). Si lo hace, falta modelar **financiamiento puente** y su costo.
6. **Tasas vigentes:** sellos 1,8%, comisiones 3–4%, fee fiduciario 0,5% anual, escrituración $1.500/u, admin $8.000/mes — confirmar contra valores 2026.
7. **Soft costs 24,5%:** verificar bases de cada componente y que la contingencia 12% se aplique sobre el total correcto.
8. **Validación técnica:** `validate.py` / `recalc.py` → 0 errores; reconciliar totales entre las 3 hojas.

### 2.4 Método y stress-test

Al recibir el archivo: (a) validar técnicamente; (b) recomputar el waterfall con `evaluar_coinversion` contra el D del flujo; (c) correr **3 escenarios** — base, adverso (precio venta −10%, costo obra +15%, absorción +6 meses) y favorable; (d) reportar **TIR del desarrollador y del inversor bajo hurdle+carry** en cada escenario. El modelo no toca a un inversor hasta pasar este filtro (cierra el gap G-03 del reporte).

### 2.5 Cómo se conecta con `meridiano-rentabilidad`

No se pisan, se complementan: **el `.xlsx` calcula el flujo del proyecto** (ingresos, costos, curva S, saldo) y produce el **valor distribuible D**; **`evaluar_coinversion` reparte ese D** vía waterfall (capital → hurdle → carry). El Excel es el motor del *proyecto*; la skill es el motor del *reparto al inversor*. Auditar significa asegurar que ambos hablan el mismo idioma económico (hurdle+carry, no TIR fija).

---

## 3. PLAN DE INTEGRACIÓN DEL BACK-OFFICE

El chat aporta 9 proyectos (P-A…P-I). Como la desarrolladora **es Meridiano aspiracional**, integrarlos es construir la operación objetivo por capas, priorizando lo que sirve al negocio de hoy (Modelo B) y lo que toca riesgo.

### 3.1 Mapa: qué es cada proyecto y a dónde va en Meridiano

| Proyecto del chat | Qué es | Destino en Meridiano | Prioridad |
|---|---|---|---|
| **P-F** Club de Inversores + IM + Due Diligence | Front-office de captación de inversores | Capa operativa del Modelo B — el IM es el hermano mayor del deck de Coinversión | **Alta** |
| **P-C** Legal/Compliance (fideicomisos, escrituración, compliance) | Manuales legales | Reconciliar con P04 — riesgo regulatorio | **Alta** |
| **P-E** Modelo financiero fideicomiso | Motor de flujo de fondos | Auditoría del Capítulo 2 | **Alta (tras archivo)** |
| **P-D** Financiero (financiamiento, estructuración) | Cómo se estructura el capital | Sustento de la economía del Modelo B | Media |
| **P-B** Desarrollo | Ciclo de desarrollo de proyecto | Ejecución del Modelo B | Media |
| **P-G** Comercial | Manual de ventas | Comercialización (toca P05) | Media |
| **P-I** Marketing | Manual de marketing/producto | Alimenta el IM y las piezas | Media |
| **P-H** Postventa | Atención al cliente post-venta | Fidelización / referido | Baja |
| **P-A** RRHH / Organigrama 16 roles | Estructura organizacional | **Hoja de ruta de contratación** (aspiracional) | Baja |

### 3.2 Fases de integración

**Fase 1 — Reconciliación y fundamentos (toca decisiones ya tomadas y riesgo).**
- Reconciliar **P-C compliance** con el **P04** de Meridiano: cotejar SEPRELAD / Ley 1015/97 / Ley 3783/09; donde diverjan, prevalece el más actualizado. Sin esto, hay dos manuales de PLA/FT posiblemente contradictorios en la misma operación — vulnerabilidad regulatoria.
- Convertir el **Investment Memorandum (P-F)** a economía **hurdle+carry** (no TIR fija). Es la versión extendida del deck de Coinversión: mismo contenido, más profundidad (6 secciones, dataroom).
- Adaptar el **Due Diligence / KYC (P-F)** como el proceso de onboarding de inversor del Modelo B: alimenta directamente el journey y el P04 (KYC personas físicas/jurídicas, PEP, beneficiario final, señales de alerta del mercado paraguayo).

**Fase 2 — El Club de Inversores (concepto nuevo, alto valor estratégico).**
- El Club (Bronce / Plata / Oro, con Comité Consultivo de inversores Oro) es un concepto que Meridiano **no tenía** y que encaja perfecto con tu ADN: "responsabilidad después de la firma" + el referido como motor. Es un sistema de **recurrencia y fidelización** del inversor de cartera. Diseñarlo como la capa de relación de largo plazo con los inversores del Modelo A y B.

**Fase 3 — Modelo financiero auditado (depende del Capítulo 2).**
- Recibir el `.xlsx`, auditarlo, convertirlo a hurdle+carry, calibrarlo con datos reales de un proyecto concreto. Recién ahí es presentable.

**Fase 4 — Manuales operativos y organización (cuando la operación escale).**
- Generar los `.docx` faltantes (gap G-02 del reporte): Comercial (P-G), Marketing (P-I), Desarrollo (P-B), Postventa (P-H).
- Tratar el **organigrama de 16 roles (P-A)** como **hoja de ruta de contratación**, no como estado actual: define qué rol se incorpora primero a medida que Meridiano crece de "JJC + aliados" a estructura.

### 3.3 Dependencias y regla de oro

- Fase 1 antes que todo lo demás (resuelve riesgo regulatorio y alinea el pitch con la decisión de economía).
- Fase 3 depende de recibir el archivo.
- Fase 4 depende de que la operación real lo justifique — no construir estructura antes de tener el volumen que la sostenga (coherente con el módulo 13 de tu marca: no fragmentar antes de tiempo).
- **Regla de oro:** como no tengo los 16 documentos, "integrar" significa **reconstruirlos en la marca y la economía de Meridiano** cuando toque, o que vos re-compartas los archivos. No se copian a ciegas: se auditan y se adaptan (sobre todo el compliance y la economía del inversor).

---

## 4. Pendientes registrados

| # | Pendiente | Depende de |
|---|---|---|
| 1 | Reconstruir el modelo financiero sobre bases correctas **con datos reales de uno de los 3 proyectos concretos** (auditoría del genérico ya hecha) | Datos del proyecto |
| 2 | ✅ Manual de compliance re-basado en Paraguay = **P04 de Meridiano** (`Meridiano_P04_Manual_Compliance.docx`) | Resuelto |
| 3 | Convertir el Investment Memorandum a hurdle+carry | Fase 1 |
| 4 | Diseñar el Club de Inversores para Meridiano | Fase 2 |
| 5 | Generar los 4 manuales faltantes (G-02) | Fase 4 / volumen real |

*Documento de trabajo interno — Meridiano Capital. No es material para inversores.*
