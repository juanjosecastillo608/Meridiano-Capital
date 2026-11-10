# Presentaciones comerciales de Meridiano Capital

| Deck | PDF | Fuente |
|---|---|---|
| Edificio Ciudad Nueva (zona Mercado 4), **plantilla maestra** | `edificio-ciudad-nueva-m4/` | `fuente/` |
| Edificio Barrio San José (Ciudad del Este) | `edificio-barrio-san-jose/` | `fuente/` |
| Edificio Sajonia (Asunción) | `edificio-sajonia/` | `fuente/` |
| Edificio San Roque (Asunción) | `edificio-san-roque/` | `fuente/` |
| Edificio Barrio San Miguel (Ciudad del Este) | `edificio-barrio-san-miguel/` | `fuente/` |
| Galería San Blas (Ciudad del Este) | `galeria-san-blas-cde/` | `fuente/` |
| Clínica Magnificat (Asunción) — PDF, web, modelo XLSX y planilla para el propietario | `clinica-magnificat/` | `fuente/` |
| Edificio Humaitá (Asunción, centro histórico) — PDF y modelo XLSX | `edificio-humaita/` y `edificio-humaita/entregables/` | `fuente/` |
| Edificio Catedral (Ciudad del Este) — PPTX, PDF, XLSX y documentos | `edificio-catedral/entregables/` | `fuente/` + `production/generadores/build_edificio_catedral_presentacion.js` |

Cada `fuente/` contiene todo lo necesario para reconstruir el PDF:
- `model.py`: cálculo de las cifras.
- `gen.py`: generador del HTML.
- `style.css` y `fonts/`: estilos y fuentes Fraunces, Lora (J/j, P-008) y Poppins.
- `img/`: fotos.
- `deck.json`: nombre del PDF.

## Datos centrales (D-096 / D-097)
`_config/meridiano.json` es la **única** fuente del teléfono y del tipo de cambio. `_config/comun.py` los expone a los generadores:
- `TC`: valor numérico del tipo de cambio.
- `tc_texto()` / `tc_corto()`: texto con la fecha del tipo de cambio.
- `contacto_linea()`: línea de contacto.

- **Teléfono:** siempre **+595 982 853 111**.
- **Tipo de cambio:** en cada actualización se verifica la cotización del BCP del día, se actualiza el JSON (`gs_por_usd`, `fecha`, `fuente`, `verificado_el`) y se informa la fecha usada.

## Cómo actualizar
```bash
# 1. Verificar la cotización del BCP del día y editar _config/meridiano.json
# 2. Regenerar todo (modelo → HTML → PDF → verificación)
python build_presentaciones.py
#    o un solo deck:   python build_presentaciones.py edificio-sajonia
#    Chrome fuera de las rutas habituales:   CHROME=/ruta/chrome python build_presentaciones.py
```
- **Control del TC:** `build_presentaciones.py` se detiene si el tipo de cambio es anterior al último día hábil previo. El BCP publica después de las 13:00. Para construir igual hay que pasar `--aceptar-tc` e informar la fecha.
- **Verificación:** `verificar_presentaciones.py` revisa los generadores y el texto de los PDF. Corre automáticamente en el pre-commit (`scripts/pre-commit-checks.py`) y en CI.
  - Rechaza cualquier teléfono distinto del canónico.
  - Rechaza tipos de cambio escritos a mano.
  - Rechaza PDF generados con un tipo de cambio distinto del vigente.
  - **Alertas de coherencia (D-103):** lista las alertas de `model.json` > `coherencia` de cada deck y rechaza el deck que tenga alertas abiertas sin presentar la neta como rango.

## Renta pura y alertas de coherencia (D-103)
- **Activos con servicios incluidos** (consultorios con secretaria, coworking, habitaciones todo incluido, hostel, renta temporal):
  - se informa la facturación;
  - se informa también la **bruta de renta pura**: facturación menos el costo de los servicios, sobre la inversión.
- **Cada `model.py` registra sus escenarios** con `registrar(out, escenario, ingreso, neto, precio, servicios=..., gastos=..., impuesto_inmobiliario=...)`, que está en `_config/rentabilidad.py`. Usa la misma lógica que el motor (`production/app/backend/coherencia.py`).
- **Hay alerta cuando:**
  - la neta es menor que el 50% del ingreso de renta pura;
  - una línea de gasto supera el 15% de ese ingreso;
  - el impuesto inmobiliario supera el 1% del precio.
- **Con una alerta abierta, la neta va como rango:**
  - piso: el dato informado;
  - techo: los gastos alertados bajados a su umbral.
  - `gen.py` usa `pn(e)` y `deck.json` declara `"neta_en_rango_d103": true`.
  - La regla completa está en `knowledge-base/investment/methodologies/renta-pura-y-alertas-de-coherencia.md`.

## Tipo de cambio vigente
Gs 6.480,35 por USD: cotización referencial del BCP del **06/11/2026**, la última publicada al 07/11/2026.
- La cifra se tomó de la planilla del BCP vía buscador y coincide con el estudio de mercado de Catedral del 07/11. El sitio del BCP no es accesible desde el entorno de Claude Code.
- Serie reciente: 03/11 Gs 6.060,86 · 04/11 Gs 6.144,02 · 05/11 Gs 6.388,47. El guaraní se depreció cerca de 9,5% entre el 26/10 y el 05/11.
- Las presentaciones se regeneraron el 07/11/2026; San Roque (v1) se creó ese día. Los README de M4, San José, Sajonia y San Roque ya están al TC vigente.
