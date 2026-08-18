Estado: CURRENT — auditoría visual completa (§3-4 del prompt maestro "Investor Book + Investment Memorandum Visual"), assets reales confirmados por el founder. **Corregido 2026-08-18**: §3 tenía una interpretación equivocada sobre `Proyecto Alternativa Fachada.png`, ver §3 y §6
Fuente original: `Town Herrera Brochure VERSION 2.0.pdf` (desarrollador original, compartido 2026-08-12) + 8 imágenes reales aportadas por el founder en el chat, 2026-08-17 + `QUBO Brochure ARQUITECTURA.pdf` y listado real de Coldwell Banker Paraguay, 2026-08-18
Dominio: INVESTMENT (caso HERRERA-001) — assets técnicos, no financieros

# Auditoría visual y assets reales — HERRERA-001

## 0. Qué es este documento

Registro de trazabilidad de **cada imagen real usada en el Investor Book** (`entregables/HERRERA-001_Investor_Book.pptx`) — de dónde salió, qué categoría le corresponde (§4 del prompt maestro "Investor Book + Investment Memorandum Visual"), y qué etiqueta de autenticidad lleva en el documento final (§5). Ningún archivo de imagen se generó ni se inventó — todo lo listado abajo es un archivo real recibido del founder o extraído directamente del brochure comercial real del desarrollador.

Copias de trabajo en `production/generadores/assets-herrera001/` (`brochure/` y `fotos-obra/`), usadas por `build_herrera001_investor_book.js`.

## 1. Brochure real del desarrollador — `Town Herrera Brochure VERSION 2.0.pdf` (29 páginas, categoría A/C/D/E del data room)

El propio desarrollador etiqueta **cada página de render/plano** con *"Imágenes y planos preliminares sujetos a cambios"* — esa etiqueta se traslada literalmente a cada uso en el Investor Book, nunca se presenta como fotografía del estado terminado.

| Página extraída | Contenido real | Categoría §4 | Etiqueta usada en el Investor Book |
|---|---|---|---|
| `00-portada-fachada.png` | Render de fachada nocturna, "Herrera Town" | **E — Render existente del desarrollador** | "Visualización arquitectónica — desarrollador original, sujeta a cambios" |
| `02-amenities-cocina.png` | Render de cocina/amenities + lista (8 niveles, 21 departamentos, 21 cocheras) | **E** | Idéntica |
| `04-ubicacion-mapa.png` | Mapa real de ubicación (Concejal Vargas / 4 de Julio, referencias reales del barrio) | **C — Plano/mapa real** | "Mapa de ubicación — material del desarrollador" |
| `06-unidades-por-nivel.png` | Planilla real de tipologías por nivel (A/B/C/D/E1/E2, m² por unidad) | **C — Plano/dato real** | "Planilla de unidades — desarrollador original" |
| `07-plano-base.png` | Plantas tipo 1/2/3, distribución de unidades por planta | **C** | "Plano de planta — preliminar, sujeto a cambios" |
| `08-tipo-a.png` | Planta interna de la tipología A con m² por ambiente | **C** | Idéntica |
| `27-amenities-rooftop.png` | Render de amenities de azotea | **E** | "Visualización — desarrollador original" |

**Verificación cruzada del terreno**: la cuenta catastral 14-502-04 y la dirección Concejal Vargas Esq. 4 de Julio del brochure coinciden exactamente con las confirmadas en `30-...md` (D-071) — es el mismo terreno, no un comparable. El nombre interno de proyecto del arquitecto ("4 de Julio"/"E4DJ", ver `Recibidos Planos PDF...zip`) es el mismo desarrollo que se comercializa como "Herrera Town".

**Discrepancia detectada, no resuelta acá**: la propuesta de honorarios del arquitecto (2023) cita zona de regulación **AR3**; `30-valuacion-de-terreno-sin-lotes-vacantes-y-confirmacion-AR2-B.md` (D-071) confirmó **AR2-B** contra catastro municipal en 2026-08-17. Puede deberse a una re-zonificación entre 2023 y hoy, o a un error en el documento de 2023 — no se investigó más a fondo, se deja anotado.

**Discrepancia de producto, ya resuelta con el founder (este mismo intercambio)**: el brochure real muestra 6 pisos / 21 unidades, todas de 2-3 dormitorios (A-E2) — el mix que el caso reconsideró en `20-...md`/`31-...md` (monoambientes de 30 m², 1 dormitorio de 45 m², Ángulo 2 con un piso adicional) **no tiene plano ni render real**. El founder confirmó (2026-08-17) presentar los 3 Ángulos en paralelo, cada uno con su nivel real de respaldo visual: Ángulo 1 ilustrado con este brochure real; Ángulo 2/3 con la etiqueta explícita "propuesta de rediseño de mix — sin plano arquitectónico confirmado todavía", sin inventar ningún plano para las unidades chicas.

## 2. Fotografías reales de obra — aportadas por el founder, 2026-08-17

| Archivo de trabajo | Contenido | Fecha real | Categoría §4 |
|---|---|---|---|
| `01-formwork-nivel-superior.jpeg` | Encofrado de madera en el nivel superior en construcción, losas de hormigón visto | **Julio 2026** (confirmado por el founder) | **A — Fotografía real, estado actual** |
| `02-vista-skyline-desde-obra.jpeg` | Vista desde una planta alta hacia el entorno — techos de tejas, skyline de Asunción de fondo | Fecha exacta no confirmada explícitamente (mismo relevamiento) | **B — Entorno**, tomada desde el propio edificio |
| `03-fachada-calle-01.jpeg` | Fachada completa desde la calle, estructura de hormigón visto, cerco perimetral | **Julio 2026** | **A** |
| `04-fachada-calle-02.jpeg` | Misma fachada, ángulo más cercano, persona de referencia de escala | **Julio 2026** | **A** |
| `05-interior-planta-columnas.jpeg` | Vista desde adentro de una planta — columnas, losa, charco de agua, entorno de fondo | **Julio 2026** | **A/B** |
| `06-esquina-cerco-obra.jpeg` | Vista de esquina, cerco de chapa perimetral con cartelería de obra visible | Fecha exacta no confirmada explícitamente (mismo relevamiento) | **A** |

**Todas etiquetadas en el Investor Book como**: "Fotografía real — estado de obra, julio 2026" (o "fecha exacta no confirmada" para las dos sin fecha explícita) — nunca presentadas junto a un render sin la distinción clara de cuál es cuál.

**Consistencia verificada**: el avance visible en las fotos (estructura de hormigón hasta varios niveles, sin mampostería/terminaciones) es consistente con el dato ya confirmado en el caso — 73,5% de avance en superficie de estructura (`01-informacion-critica-faltante.md`, `03-...md`).

## 3. `Proyecto Alternativa Fachada.png` — CORRECCIÓN (2026-08-18)

**La versión anterior de este documento (2026-08-17) estaba equivocada** — decía que el founder había confirmado que esta imagen era "una referencia de inspiración sin relación directa con el proyecto" y que por eso no se usaba. El founder corrigió esto el 2026-08-18: la imagen **sí tiene relación directa** — es la **sugerencia real de estilo de fachada del estudio Tambone Arquitectura**, el estudio que Meridiano Capital propuso contratar para el rediseño de fachada y el diseño de las nuevas tipologías chicas de `HERRERA-001` (Ángulo 2/3). El nombre del archivo ("Proyecto Alternativa Fachada") sí era una pista correcta, tal como se había anotado en la versión anterior de este documento — la interpretación equivocada fue mía, no del archivo.

**Corrección de categoría y uso**: pasa de "descartada, sin uso" a **categoría G — Visualización nueva/propuesta de diseño**, con la etiqueta explícita "Sugerencia de fachada — estudio Tambone Arquitectura, propuesta para Ángulo 2/3, no es el diseño confirmado de Herrera". Se usa en la sección 9 del Investor Book (Ángulo 2/3) como referencia de estilo, nunca presentada como el render final del edificio.

## 3.1 Tambone Arquitectura — estudio propuesto para el rediseño (nuevo, 2026-08-18)

El founder confirmó que **Tambone Arquitectura** (`tambonearquitectura.wixsite.com/misitio/quienes-somos`) es el estudio propuesto por Meridiano Capital para: (1) el rediseño de fachada de `HERRERA-001`, y (2) el diseño de las nuevas tipologías chicas de Ángulo 2/3 (monoambiente, 1 dormitorio). Este mismo estudio diseñó **Edificio Qubo** ("el primer Aparta Office de Paraguay"), sobre calle Senador Long, Asunción — **ya revisado y con tipologías sugeridas como referencia directa para Herrera**. Ver §3.2.

**Esto no es todavía un plano de Herrera** — es la referencia de diseño del mismo estudio en un proyecto real y comparable (unidades chicas, formato apart-hotel/aparta-office), aportada explícitamente por el founder para ilustrar el estilo y las tipologías, no un plano arquitectónico específico de Herrera. Sigue sin existir un plano propio de Herrera para Ángulo 2/3 — la distinción entre "referencia de diseño de Qubo" y "plano confirmado de Herrera" se mantiene explícita en el Investor Book.

## 3.2 Edificio Qubo — brochure real, tipologías de referencia

Fuente: `QUBO Brochure ARQUITECTURA.pdf` (28 páginas, aportado por el founder 2026-08-18) + listado real de Coldwell Banker Paraguay (`coldwellbanker.com.py/propiedad/departamento-en-venta-1-dormitorio-en-barrio-villa-morra-asuncion-edificio-qubo--4425025`, consultado 2026-08-18). **Corrección**: el primer relevamiento usó un listado de Century 21 Platinum cuyo dato de precio/m² tenía un error (founder, 2026-08-18) — se reemplazó por completo por la fuente de Coldwell Banker, sin conservar ningún dato de precio de Century 21 para Qubo.

| Página extraída | Contenido real | Categoría §4 | Etiqueta usada en el Investor Book |
|---|---|---|---|
| `00-fachada-sugerida-tambonea.png` | Render de fachada curva — sugerencia de Tambone Arquitectura | **G — Visualización nueva/propuesta** | "Sugerencia de fachada — Tambone Arquitectura, propuesta para Ángulo 2/3" |
| `03-fachada-real-qubo.png` | Fachada real de Edificio Qubo construido, Senador Long, Asunción | **E — Render existente, proyecto de referencia (no es Herrera)** | "Referencia de diseño — Edificio Qubo, mismo estudio de arquitectura, no es Herrera" |
| `05-lobby-qubo.png` | Render de lobby/amenities de Qubo | **E — Referencia** | Idéntica |
| `18-tipologia-1-amoblada-qubo.png` | Planta isométrica amoblada, Tipología 1 de Qubo (monoambiente + home office) | **E — Referencia de tipología y mobiliario** | "Referencia de tipología y amoblamiento — Edificio Qubo" |
| `22-tipologia-2-amoblada-qubo.png` | Planta isométrica amoblada, Tipología 2 de Qubo | **E** | Idéntica |
| `26-tipologia-3-amoblada-qubo.png` / `28-interior-tipologia3-vista-qubo.png` | Planta isométrica y vista interior renderizada, Tipología 3 de Qubo (con vista a skyline de Asunción) | **E** | Idéntica |

**Dato real de mercado de Qubo, vía Coldwell Banker Paraguay (2026-08-18, corregido)**: ubicación Senador Long, **Villa Morra** (no Barrio Herrera — zona distinta, ya usada como referencia de plusvalía en el caso); unidad 1 dormitorio de 42 m² totales; precio USD 68.080 (~**USD 1.621/m²**); entrega diciembre 2026; gastos comunes ~USD 63/mes; amenities aire acondicionado individual, seguridad 24 h, piscina, solarium, SUM, parrilla, pet-friendly — formato "Aparta Office", no residencial puro (8 niveles, según el brochure real del proyecto). **Precio por debajo del rango objetivo de Herrera (USD 1.900–2.050/m²)** — se incorpora como referencia de diseño y de un formato de producto (unidades chicas + coworking), no como comparable de precio directo, dado que Villa Morra y el concepto Aparta Office difieren de la propuesta residencial de Herrera. Se agrega a `42-market-comparables.md` con esta salvedad explícita.

## 4. Comparable real — flyer de Century 21, `Filum Herrera`

`WhatsApp Image 2026-08-14 at 11.24.11 AM (1).jpeg` es el flyer comercial real de **Filum Herrera** (Century 21 Liberty) — el comparable ya usado en `03-presupuesto-y-comparables.md` y `37-...md`. **No es el edificio del caso** — se usa exclusivamente en la sección de comparables/mercado del Investor Book, con su fuente citada (Century 21 Liberty, flyer comercial) y nunca mezclado visualmente con las fotos o planos de Herrera Town.

## 5. Lo que sigue sin existir como archivo real

- Fotos aéreas/dron del edificio completo.
- Planos arquitectónicos técnicos completos en formato visualizable (los `.dwg` de `Xr-Plantas.zip` existen pero no hay herramienta disponible para abrirlos — solo se pudo usar el plano simplificado del brochure).
- **Un plano o render propio de Herrera para las unidades chicas de Ángulo 2/3** — lo que sí existe ahora (2026-08-18) es la referencia de diseño de Edificio Qubo del mismo estudio propuesto (Tambone Arquitectura, §3.1-3.2), pero no es un plano específico de Herrera. Se mantiene la distinción explícita en el Investor Book.
- Fotos de interior de unidades terminadas (no existen, el edificio no está terminado).

## 6. Corrección registrada — nota de proceso

La versión 2026-08-17 de este documento contenía un error de interpretación (§3) sobre la imagen de fachada, corregido acá mismo el 2026-08-18 a pedido directo del founder. Se deja visible la corrección en vez de reescribir la sección como si el error no hubiera ocurrido — mismo criterio de trazabilidad que ya se aplica en el resto del caso (`16-...md`, `21-...md`, ambos "reemplazados, se conservan por trazabilidad").
