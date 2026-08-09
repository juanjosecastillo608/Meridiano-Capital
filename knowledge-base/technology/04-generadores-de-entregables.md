Estado: CURRENT
Fuente original: 00_RAW_MIGRATION/claude-recovery-2026-08-02/generadores/
Dominio: TECHNOLOGY
Incorporado: 2026-08-02
Actualizado: 2026-08-09 — pipeline movido a `production/generadores/`, marca nueva aplicada

# Pipeline de generación de entregables (`generadores/`)

Scripts Node.js que generan los decks y piezas comerciales programáticamente, con la identidad de marca codificada directamente en el script (colores, tipografía, isotipos) en vez de editarse a mano en Canva/PowerPoint. **Vive en `production/generadores/`** (Node.js + LibreOffice instalados, `npm install` corrido, pipeline funcional de punta a punta: `.pptx`/`.docx` → `.pdf`). Copia original preservada sin modificar en `00_RAW_MIGRATION/claude-recovery-2026-08-02/generadores/` por regla de no-destrucción. Los entregables finales listos para enviar están en `production/entregables/` (ver `knowledge-base/marketing/05-entregables-producidos.md`).

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
| `build_info_completa.js` | `Meridiano_Info_Completa.pptx/.pdf` (nuevo, 2026-08-09) | Meridiano — entregable integral para clientes, 11 slides |
| `build_deck.RETIRADO.js.txt` | — (no se ejecuta) | Deck híbrido retirado — mezclaba modelos, título personal incorrecto. Ver `H-005` |

Todos los scripts comparten la constante `LORA="Fraunces"` para el titular — **siempre usado en peso Regular** (`bold:false`), nunca Bold literal, por el bug documentado en `D-040` (`governance/decisions/DECISION_REGISTER.md`).

## Por qué importa (relación con `RT-04`)

Este pipeline es la prueba de que **ya existe una implementación real** de "generar piezas de marca por código en vez de a mano" — el mismo principio que `RT-04` (`governance/decisions/REQUIREMENTS.md`) exige para el sitio web (preservar los design tokens, no reinventar). Cualquier futura skill de generación de contenido (`SK-02` / `brand-prompt-engine` u otras) debería apoyarse en este patrón ya validado, no reinventarlo.

## Pendientes técnicos (no bloqueantes, deuda de producto)

1. ~~Decidir cuál de las dos copias es la fuente de verdad y mover el pipeline a `production/`~~ — ✅ **RESUELTO 2026-08-09**. `production/generadores/` es la fuente de verdad; corre con `npm install` limpio (Node.js LTS + LibreOffice instalados vía `winget`).
2. Extraer la paleta/tipografía a un archivo de config compartido (mismo principio que `production/app/config/parametros_mercado.json` aplica a los números de rentabilidad) en vez de constantes duplicadas en cada script. Sigue pendiente.
3. ~~No se verificó si estos scripts corren con `npm install` limpio~~ — ✅ **RESUELTO 2026-08-09**, ver punto 1.
4. **Nuevo (2026-08-09)**: los assets de logo se generan desde SVG fuente vía `rasterize_assets.js` (usa `sharp`) — si se vuelve a tocar el isotipo (`production/app/frontend/assets/logos/`), correr ese script de nuevo antes de regenerar los decks, o los PNG quedan desincronizados con la marca vigente.
