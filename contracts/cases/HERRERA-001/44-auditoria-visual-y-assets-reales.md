Estado: CURRENT — auditoría visual completa (§3-4 del prompt maestro "Investor Book + Investment Memorandum Visual"), assets reales confirmados por el founder
Fuente original: `Town Herrera Brochure VERSION 2.0.pdf` (desarrollador original, compartido 2026-08-12) + 8 imágenes reales aportadas por el founder en el chat, 2026-08-17
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

## 3. Imagen descartada del Investor Book — `Proyecto Alternativa Fachada.png`

Render de fachada curva, sin marca ni etiqueta visible, aportado junto con las fotos de obra. **El founder confirmó explícitamente (2026-08-17) que es una referencia de inspiración sin relación directa con el proyecto** — pese a que el nombre del archivo ("Proyecto Alternativa Fachada") coincide con uno de los archivos listados como pendientes en `01-informacion-critica-faltante.md` §"Archivos que siguen sin compartirse". Se deja esta nota por transparencia, pero **se respeta la palabra del founder y no se usa esta imagen en ninguna parte del Investor Book** como representación de Herrera — ni como render del edificio, ni como propuesta de fachada alternativa. Queda guardada en `fotos-obra-2026-08-17/` únicamente como archivo recibido, sin uso.

## 4. Comparable real — flyer de Century 21, `Filum Herrera`

`WhatsApp Image 2026-08-14 at 11.24.11 AM (1).jpeg` es el flyer comercial real de **Filum Herrera** (Century 21 Liberty) — el comparable ya usado en `03-presupuesto-y-comparables.md` y `37-...md`. **No es el edificio del caso** — se usa exclusivamente en la sección de comparables/mercado del Investor Book, con su fuente citada (Century 21 Liberty, flyer comercial) y nunca mezclado visualmente con las fotos o planos de Herrera Town.

## 5. Lo que sigue sin existir como archivo real

- Fotos aéreas/dron del edificio completo.
- Planos arquitectónicos técnicos completos en formato visualizable (los `.dwg` de `Xr-Plantas.zip` existen pero no hay herramienta disponible para abrirlos — solo se pudo usar el plano simplificado del brochure).
- Cualquier render o foto de las unidades chicas (monoambiente/1 dormitorio) que Ángulo 2/3 proponen — no se inventó ninguna.
- Fotos de interior de unidades terminadas (no existen, el edificio no está terminado).
