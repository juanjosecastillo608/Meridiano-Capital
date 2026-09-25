# Clasificación: activo, operación, audiencia y rol

Clasificar desde los documentos, no desde el pedido. Registrar la clasificación en `meta.json` y en el informe.

## Tipo de activo → qué mirar primero

| Tipo | Ejemplos | Datos clave que buscar | Imagen dominante |
|---|---|---|---|
| Residencial | departamento, casa, dúplex | superficie cubierta/total, dormitorios, baños, cochera, amenities, expensas, estado | interiores luminosos, planta de la unidad |
| Corporativa | oficina, piso corporativo | m² rentables, planta tipo, cocheras por m², certificación, infraestructura (grupo electrógeno, climatización) | planta libre, fachada, lobby |
| Comercial | local, salón, galería | frente, m², altura, flujo/tránsito si está documentado, rubro permitido | fachada a la calle, vidriera |
| Industrial / logística | nave, depósito, centro logístico | m² por nave, altura libre, portones/andenes, carga de piso, patio de maniobra, energía, módulos mínimos | exterior de la nave, interior de planta libre, plano |
| Terreno | lote, fracción | superficie, frente/fondo, zonificación y FOT/FOS si constan, servicios, topografía | foto del terreno, plano/mensura, mapa |
| Desarrollo / pozo | edificio en construcción, preventa | tipologías, precios por unidad, formas de pago, avance y fecha de entrega, desarrollador | renders rotulados como tales, planos, avance de obra |
| Hotelera | hotel, apart | habitaciones, ocupación y ADR solo si están documentados | habitaciones, áreas comunes |
| Rural | campo, estancia | hectáreas, aptitud, mejoras, agua, accesos | aérea, mapa |
| Inversión / cartera | varias unidades, activo con renta | renta actual, contratos vigentes (sin datos personales), rentabilidad con método explícito | una imagen por activo + tabla resumen |
| Mixta | uso combinado | separar cada componente con sus datos | según componente |

## Tipo de operación → énfasis narrativo

| Operación | Énfasis | Sección económica |
|---|---|---|
| Venta | activo + ubicación + precio | precio, m², forma de pago |
| Alquiler | capacidad/uso + condiciones de ingreso | canon, expensas, garantía, honorarios, validez |
| Inversión | tesis + números con supuestos visibles | rentabilidad (bruta/neta y método), escenarios si existen, riesgos |
| Captación | servicio de Meridiano + activo del propietario | condiciones del servicio documentadas |
| Desarrollo / preventa | proyecto + etapa + plazos | tipologías, lista de precios, plan de pagos, entrega |
| Búsqueda de capital | uso de fondos + estructura | capital requerido, participación, plazos, salida, riesgos |
| Presentación institucional | quién es Meridiano + caso | sin cifras comerciales salvo que las haya |
| Administración | servicio + reporte | honorarios y alcance documentados |

Inversión y búsqueda de capital llevan **siempre** una diapositiva de riesgos y el aviso de que las cifras no son rentabilidad garantizada. Nunca calcular rentabilidad nueva en la presentación sin pasar por la skill `meridiano-rentabilidad` o el motor del repo; si la fuente trae una rentabilidad, mostrarla como dato de la fuente con su método.

## Audiencia → densidad y tono

| Audiencia | Densidad | Nota |
|---|---|---|
| Comprador final | baja | fotos grandes, pocas cifras, beneficios concretos |
| Inversor / fondo / banco / comité | alta | tablas, supuestos, fuentes y riesgos explícitos |
| Empresa (B2B) | media | capacidad operativa, condiciones, proceso de contratación |
| Desarrollador | alta | potencial constructivo, costos si están documentados |
| Propietario | media | propuesta de servicio, proceso, reporte |
| Intermediario | media | ficha técnica y condiciones de colaboración |
| Cliente extranjero | media | contexto del país y del proceso, sin jerga local sin explicar |

## Rol de Meridiano Capital → firma y cierre

El rol sale de los documentos (quién firma la cotización, quién es el desarrollador, quién cobra honorarios). No atribuir a Meridiano la propiedad ni el desarrollo de un activo de terceros.

| Rol | Cómo figura | `signaturePreset` |
|---|---|---|
| Captador / colocador de propiedad en alquiler | "Comercialización a cargo de Meridiano Capital" | `C_captacion_alquiler` (D-096) |
| Intermediario / captador en venta | "Comercialización a cargo de Meridiano Capital" | `A_venta_deck`, y marcar en el informe para confirmar si corresponde C |
| Asesor / operador del inversor | "Presentado por Meridiano Capital" | `A_venta_deck` |
| Desarrollador / coinversor | Meridiano como titular del proyecto (solo si está documentado) | `A_venta_deck`; `B_investment_memorandum` si la pieza es un IM |
| Administrador | "Administrado por Meridiano Capital" | `A_venta_deck` |

Si el repo está disponible, confirmar el preset contra `knowledge-base/brand/09-cierres-y-firmas.md` antes de cerrar.

## Marcas de terceros (activo, edificio, desarrolladora)

- El activo conserva su identidad: nombre y logo propio, si existen en versión de calidad (vector o PNG grande). No redibujar ni recolorear. No usar un logo de baja calidad extraído de una captura si hay una versión mejor; si solo hay baja calidad, usar el nombre tipográfico y registrarlo.
- Nunca fusionar logos ni ponerlos en un mismo bloque como si fueran una sola marca. El logo del tercero va en su propia zona (portada o diapositiva del activo), con la zona de protección de Meridiano respetada.
- Meridiano figura con su rol (tabla de arriba), nunca como dueño o desarrollador sin respaldo documental.
