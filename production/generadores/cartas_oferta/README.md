# Generador de cartas de oferta — compra y alquiler

Automatiza el **prompt maestro de carta de oferta de Meridiano Capital**: a partir de una ficha YAML
genera la carta con marca (DOCX + PDF) y un control automático. Origen y reglas: `D-096`
(`governance/decisions/DECISION_REGISTER.md`) y `knowledge-base/operations/04-cartas-de-oferta.md`.

## Uso

```bash
python production/generadores/cartas_oferta/generar_carta_oferta.py <ficha.yaml> [--salida <carpeta>] [--sin-pdf]
```

Requiere `python-docx` y `pyyaml`; el PDF se genera con LibreOffice (`soffice`) si está instalado.
Genera, junto a la ficha (o en `--salida`):

| Archivo | Contenido |
|---|---|
| `02_Carta_Oferta_<codigo>_v<version>.docx` | Carta editable con membrete oficial |
| `02_Carta_Oferta_<codigo>_v<version>.pdf` | Misma versión, para revisión/firma |
| `03_Control_Oferta_<codigo>_v<version>.md` | Estado calculado, bloqueos, controles automáticos, [PENDIENTE] y observaciones |

**Nunca sobrescribe**: si ya existe esa versión, se detiene. Para una nueva versión, copiar la ficha y subir `version`.

## Flujo recomendado

1. Copiar `ejemplos/compra_colocador_ejemplo.yaml` o `ejemplos/alquiler_ejemplo.yaml` a `contracts/cases/<CASO>/carta-oferta/ficha_<codigo>_v1.yaml`.
2. Completar con los datos de la operación. **Lo que no se sabe va como `[PENDIENTE: qué falta]`** — nunca inventarlo.
3. Correr el generador → revisar el control y el PDF página por página.
4. Responder los pendientes → nueva ficha con `version` + 1 → regenerar.
5. Barrido de PII de `CLAUDE.md` antes de commitear (en `contracts/` solo nombre, rol y documento de las partes).

## Qué valida automáticamente

- Campos obligatorios por tipo (`compra`: `precio`, `pagos`; `alquiler`: `canon`).
- `rol_meridiano` ∈ CAPTADOR / COLOCADOR / AMBOS; aviso si el texto dice "en representación de" sin `mandato_documentado: true`.
- **Cifras vs. letras** del precio ofertado (conversor propio a letras en español).
- **Suma del cronograma = precio ofertado**; si hay importes "a convenir" (`complementa_al_total: true`) lo informa.
- Comisión: importe, neto e IVA (si `iva_incluido: true`, separa el 10 %).
- Vigencia: fecha de vencimiento si hay `fecha_presentacion` y días corridos; los días hábiles se calculan a mano (feriados).
- Estado: **BORRADOR INCOMPLETO** (hay [PENDIENTE] o bloqueos) → **BORRADOR PARA REVISIÓN** (completo, sin revisión jurídica) → **LISTO PARA FIRMA** (solo con `revision_juridica_ok: true`). El estado se imprime como banda en la carta salvo en LISTO PARA FIRMA.

## Estructura de la carta (modelo de la casa)

Tomada de las cartas reales de Meridiano (oferta de alquiler de oficina, sep-2026; intención de compra, may-2026):
membrete → título + subtítulo → fecha y ref. interna → bloque **PRESENTA / PROPONENTE** (+ captador/colocador) →
destinatario → Ref. → introducción → inmueble → precio + **forma de pago** (compra) o **canon** (alquiler) →
condiciones numeradas → vigencia, efecto de la aceptación e intervención → firmas → página de
**constancia de recepción** (no es aceptación; fija desde cuándo corre la vigencia) + **formulario de respuesta**
(acepto / rechazo / contraoferta) con, si corresponde, el reconocimiento de comisión de la parte que paga.

## Regla de firma del founder (D-097)

Juan José Castillo interviene y firma siempre como **Broker inmobiliario** (MERIDIANO CAPITAL) en ventas y alquileres. `aplicar_reglas_founder()` lo aplica al cargar cualquier ficha: en todo texto que lo nombre, "asesor inmobiliario" pasa a "broker inmobiliario", y su bloque de firma lleva ese cargo aunque la ficha diga otra cosa. No toca a otros agentes.

## Marca

- Membrete: `../logo_horizontal.png`, lockup oficial vigente (isotipo "partido por el meridiano" D-034 + wordmark Fraunces D-036), rasterizado por `../rasterize_assets.js`. **No usar el triángulo simétrico viejo** (histórico, v1.0 del manual).
- Paleta `knowledge-base/brand/05-sistema-cromatico.md`: Petróleo profundo (bloques y títulos), Lapacho dorado solo como filete del membrete, dorado oscuro `#A87D22` para texto, Línea de referencia y Tinte de fila alterna en tablas, Tierra colorada solo en la banda de estado.
- Tipografía: Cambria/Calibri, alternativas de sistema oficiales de Fraunces/Poppins (`04-tipografia.md`); se usan porque el PDF se arma con LibreOffice y en servidor no siempre están las Google Fonts. Si se instalan Fraunces/Poppins, cambiar `SERIF`/`SANS`. Sin negrita en el serif de titulares (D-040).
- Nunca "Campo Agreste S.A." en la carta salvo que sea la entidad operadora contractual de esa operación (D-029).

## Ejemplos

`ejemplos/` tiene dos fichas **ficticias** (alias, sin datos reales): alquiler de oficina presentando a un inquilino (COLOCADOR) y compra con reserva + seña + saldo (COLOCADOR). Sirven de plantilla y de prueba de humo:

```bash
for f in production/generadores/cartas_oferta/ejemplos/*.yaml; do
  python production/generadores/cartas_oferta/generar_carta_oferta.py "$f" --salida /tmp/cartas-prueba
done
```
