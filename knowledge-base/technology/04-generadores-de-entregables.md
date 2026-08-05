Estado: CURRENT
Fuente original: 00_RAW_MIGRATION/claude-recovery-2026-08-02/generadores/
Dominio: TECHNOLOGY
Incorporado: 2026-08-02

# Pipeline de generación de entregables (`generadores/`)

Scripts Node.js que generan los decks y piezas comerciales programáticamente, con la identidad de marca codificada directamente en el script (colores, tipografía, isotipos) en vez de editarse a mano en Canva/PowerPoint. Copia preservada sin modificar en `00_RAW_MIGRATION/claude-recovery-2026-08-02/generadores/` — no se movió a `production/` todavía (ver pendiente al final).

## Stack técnico

- **Node.js** + paquete `pptxgenjs` — genera archivos `.pptx` mediante código, slide por slide.
- Assets de imagen (isotipos, PNG) referenciados desde `assets/` dentro del mismo paquete de generadores.
- Conversión a `.pdf` posterior al `.pptx` (no está scripteado dentro de estos archivos — paso manual o de otra herramienta).
- Paleta y tipografía **hardcodeadas como constantes** al inicio de cada script (ej. `KAA="45573A"`, `POP="Poppins"`) — coherente con las paletas ya documentadas en `knowledge-base/brand/05-sistema-cromatico.md`, pero **duplicadas en código** en vez de leerse desde una fuente de verdad compartida. Riesgo de desincronización si la paleta de marca cambia y estos scripts no se actualizan a la par — mismo patrón de riesgo que ya se señaló para `production/app/frontend/index.html` (CSS custom properties, también hardcodeadas).

## Scripts y qué generan

| Script | Genera | Identidad aplicada |
|---|---|---|
| `build_deck.js` | Deck base / helpers compartidos | Meridiano (petróleo/dorado) |
| `build_programa.js` | `Meridiano_Programa_Ingreso.pptx` (11 slides) | Meridiano |
| `build_coinversion.js` | `Meridiano_Deck_Coinversion.pptx` (13 slides) | Meridiano |
| `build_mvv.js` | `Meridiano_Mision_Vision_Valores.pptx` | Meridiano |
| `build_urbannit.js` | `Urbannit_Presentacion.pptx` (9 slides) | Urbannit (Ka'a verde, solo Poppins, isotipo cerradura, endoso "gestionado por Meridiano Capital") |
| `build_onepager.js` | One-pager de outreach en frío (PDF) | Meridiano |
| `build_whatsapp.js` | Pieza de WhatsApp en frío (imagen 1080×1920) | Meridiano |
| `build_p04.js` | `Meridiano_P04_Manual_Compliance.docx/.pdf` | Meridiano (documento legal, no de venta) |

`generadores/deck_build/` contiene una segunda copia de varios de estos scripts más los assets/renders intermedios (JPG por slide) — parece ser el directorio de trabajo activo donde se ejecutaron las últimas builds; `generadores/build_*.js` (raíz) son versiones más tempranas o de un solo entregable. No se investigó cuál es la versión canónica — ver pendiente.

## Por qué importa (relación con `RT-04`)

Este pipeline es la prueba de que **ya existe una implementación real** de "generar piezas de marca por código en vez de a mano" — el mismo principio que `RT-04` (`governance/decisions/REQUIREMENTS.md`) exige para el sitio web (preservar los design tokens, no reinventar). Cualquier futura skill de generación de contenido (`SK-02` / `brand-prompt-engine` u otras) debería apoyarse en este patrón ya validado, no reinventarlo.

## Pendientes técnicos (no bloqueantes, deuda de producto)

1. Decidir cuál de las dos copias (`generadores/` raíz vs. `generadores/deck_build/`) es la fuente de verdad, y mover el pipeline a `skills/` o `production/` según corresponda (hoy vive únicamente dentro de `00_RAW_MIGRATION/`, que es de solo lectura por regla de no-destrucción — cualquier uso activo del pipeline requiere primero copiarlo fuera de esa carpeta).
2. Extraer la paleta/tipografía a un archivo de config compartido (mismo principio que `production/app/config/parametros_mercado.json` aplica a los números de rentabilidad) en vez de constantes duplicadas en cada script.
3. No se verificó si estos scripts corren con `npm install` limpio (falta un `package.json` visible en la copia recibida) — confirmar antes de depender de ellos en producción.
