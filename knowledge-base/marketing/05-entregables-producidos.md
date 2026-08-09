Estado: CURRENT
Fuente original: 00_RAW_MIGRATION/claude-recovery-2026-08-02/entregables/, CLAUDE.md §10
Dominio: MARKETING
Incorporado: 2026-08-02
Regenerado: 2026-08-09 (marca nueva D-034/035/036, firma D-039, ownership D-038, fix tipográfico D-040)

# Entregables ya producidos (inventario)

Piezas terminadas, auditadas contra la Matriz de Decisión y verificadas línea por línea antes de entregarse. **Versión vigente en `production/entregables/`** (copia lista para enviar); código fuente que las genera en `production/generadores/*.js`. Copia original (marca vieja, pre-2026-08-09) preservada sin modificar en `00_RAW_MIGRATION/claude-recovery-2026-08-02/entregables/` por regla de no-destrucción.

## Regenerado el 2026-08-09 — qué cambió respecto a la versión original

Los 7 entregables existentes se regeneraron completos contra `Origen Borrador programa ingreso paraguay.pptx` y `Meridiano_Deck_Inversores.pptx` (archivos aportados por el founder), aplicando:
- Isotipo nuevo ("partido por el meridiano" D-034, "línea coherente con el mojón" para Urbannit D-035).
- Tipografía Fraunces en vez de Lora (D-036), **siempre en peso Regular** — nunca Bold literal, ver `D-040` (bug de espaciado en el pipeline de render de documentos, no en el sitio web).
- Composición societaria corregida: S.A. 100% extranjera, sin tope de 50% (D-038, resuelve `D-037`).
- Firma institucional nueva: "MERIDIANO CAPITAL" como respaldo arriba de la firma personal de JJC (Variante A, D-039) — Campo Agreste S.A. nunca aparece en estas piezas (D-029).
- El viejo título "Asesor y Desarrollador Inmobiliario" (hallado en el deck híbrido retirado, ver `H-005`) no aparece en ninguna pieza vigente.

## Decks

| Pieza | Formato | Detalle |
|---|---|---|
| `Meridiano_Programa_Ingreso` | .pptx + .pdf | 11 slides, modelo Individual puro (sin mezclar con coinversión) |
| `Meridiano_Deck_Coinversion` | .pptx + .pdf | 13 slides, modelo Coinversión puro, economía hurdle+carry |
| `Meridiano_Mision_Vision_Valores` | .pptx + .pdf | MVV final (4 valores) |
| `Urbannit_Presentacion` | .pptx + .pdf | 9 slides, identidad Ka'a correcta (verde, solo Poppins, isotipo cerradura), con endoso "gestionado por Meridiano Capital" |
| `Meridiano_Info_Completa` | .pptx + .pdf | **Nuevo (2026-08-09).** 11 slides, entregable integral para clientes: quiénes somos, valores, trayectoria (53 unidades / 11 edificios), cómo trabajamos, dos formas de invertir (sin mezclar economías de Modelo A/B), gestión patrimonial, Urbannit, compliance, cierre con firma institucional |

**Nota importante — deck híbrido retirado**: hubo una versión anterior que mezclaba el modelo Individual y el de Coinversión (y los caminos migratorios) en una sola pieza. Se **retiró explícitamente** por violar la regla dura de nunca mezclar las economías de los dos modelos (`RN-01`/`D-016`), y además contenía el título personal incorrecto "Asesor y Desarrollador Inmobiliario" (`H-005`). Queda como `production/generadores/build_deck.RETIRADO.js.txt`, excluido del pipeline activo — nunca se ejecuta. Los decks actuales (Programa Ingreso / Coinversión / Info Completa) son la versión correcta, separada y verificada.

## Outreach en frío

| Pieza | Formato | Uso |
|---|---|---|
| Pieza de WhatsApp en frío | Imagen vertical 1080×1920 (+ .pptx/.pdf) | Primer contacto — "vende la conversación, no la inversión" |
| One-pager de outreach en frío | .pptx + .pdf | Acompaña o sigue al mensaje de WhatsApp |

## Legal

| Pieza | Formato |
|---|---|
| `Meridiano_P04_Manual_Compliance` | .docx + .pdf — ver `knowledge-base/legal/01-p04-manual-compliance.md` para el contenido completo. Única pieza donde Campo Agreste S.A. sí aparece (documento legal/institucional, no de venta — D-029 solo prohíbe la mención en piezas públicas) |

## Regla de verificación aplicada a todos estos entregables

Antes de darse por terminada cada pieza se corrió una verificación explícita (0 menciones de nombres de marca viejos, contacto correcto, firma canónica homogénea, sin gaps tipográficos) — el mismo estándar que exige el audit de Brand Guardian (`knowledge-base/ai/04-director-creativo-y-brand-guardian.md`). Cualquier entregable nuevo debe pasar el mismo nivel de verificación antes de considerarse terminado.
