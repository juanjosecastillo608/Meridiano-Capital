# Presentaciones comerciales de Meridiano Capital

| Deck | PDF | Fuente |
|---|---|---|
| Edificio Ciudad Nueva (zona Mercado 4), **plantilla maestra** | `edificio-ciudad-nueva-m4/` | `fuente/` |
| Edificio Barrio San José (Ciudad del Este) | `edificio-barrio-san-jose/` | `fuente/` |
| Edificio Sajonia (Asunción) | `edificio-sajonia/` | `fuente/` |
| Edificio Barrio San Miguel (Ciudad del Este) | `edificio-barrio-san-miguel/` | `fuente/` |
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

## Tipo de cambio vigente
Gs 6.060,86 por USD: cotización referencial del BCP del **03/11/2026**, verificada el 05/11/2026.
- La cifra se tomó de la planilla del BCP vía buscador. El sitio del BCP no es accesible desde el entorno de Claude Code y no se encontró un referencial del 04/11 ni del 05/11.
- Reemplaza Gs 5.770,91 (cierre interbancario del 16/10/2026).
- Las cinco presentaciones se regeneraron el 05/11/2026. Las cifras de los README de M4, San José, Sajonia y San Miguel corresponden a tipos de cambio anteriores.
