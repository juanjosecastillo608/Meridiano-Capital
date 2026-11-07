# Edificio Ciudad Nueva (zona Mercado 4) — presentación comercial v2

Es la **plantilla maestra** de las presentaciones de Meridiano Capital: un edificio de renta de 1990 en 9 de Marzo c/ Mayor Bullo, barrio Ciudad Nueva, Asunción, a USD 340.000. Tiene 17 láminas. Esta v2 reconstruye lámina por lámina la v1, que se había armado en LibreOffice Impress, con el pipeline HTML → PDF común a todas las presentaciones.

- **PDF para enviar a inversores:** `Edificio_Ciudad_Nueva_13_Departamentos_zona_M4_v2.pdf`. Regenerado el **07/11/2026** con el tipo de cambio del BCP del 06/11/2026.
- **Fuente:** `fuente/`, con el modelo (recalcula todo desde los 15 conceptos de alquiler), el generador, los estilos, las fuentes y las imágenes.
- **Cómo regenerar:** `python projects/meridiano-capital/presentaciones/build_presentaciones.py edificio-ciudad-nueva-m4`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097). Antes de cada envío hay que verificar la cotización del BCP del día.

## Cifras vigentes (TC Gs 6.480,35, BCP referencial del 06/11/2026)
| Indicador | Valor |
|---|---:|
| Precio | USD 340.000 |
| Ingreso mensual (15 conceptos, 100% alquilado) | Gs 19.550.000 · USD 3.017 |
| Ingreso bruto anual | USD 36.202 |
| Rentabilidad bruta | **10,65%** |
| Neta antes de impuesto a la renta | 8,01% |
| Rentabilidad neta final | **7,21%** (USD 24.501 por año, USD 2.042 por mes) |
| Precio ÷ ingreso bruto anual | 9,4 veces |
| TIR estimada a 5 años (conservador / base / optimista) | 9,1% / **10,7%** / 12,4% |
| Neto del año 5 (conservador / base / optimista) | USD 27.712 / 30.014 / 33.723 |
| USD por m² construido | USD 307 (1.109 m²) |
| Precio frente al costo de construir hoy la misma superficie | 47% (USD 720.850 a USD 650/m², sin terreno) |

**Supuestos:**
- IVA ponderado de 5,49%: 5% en departamentos y 10% en "Cochera" y "Cochera y departamento".
- Vacancia 3%, administración 8%, mantenimiento 5%, gastos fijos de USD 1.200 por año e IRE 10%.
- Escenarios a 5 años: alquileres que suben 3%, 5% u 8% por año y valorización de 2%, 3,5% o 5%. Incluyen el IVA de la venta futura de 1,5% (D-082).
- Son cifras de referencia, no garantizadas.

**Efecto del tipo de cambio:** el precio está en dólares y la renta en guaraníes. Con el TC de la v1 (Gs 5.694, 09/10/2026) la bruta era 12,12%, la neta 8,25% y la TIR base 11,7%. La baja a 10,65%, 7,21% y 10,7% se explica solo por la suba del dólar; los datos del edificio no cambiaron.

| Fecha del TC (BCP) | Gs por USD | Bruta | Neta final |
|---|---:|---:|---:|
| 09/10/2026 (v1) | 5.694,47 | 12,12% | 8,25% |
| 14/10/2026 | 5.698,03 | 12,11% | 8,24% |
| 06/11/2026 (vigente) | 6.480,35 | 10,65% | 7,21% |

## Observaciones abiertas (al 07/11/2026)
1. **Local comercial:** el resumen y la portada dicen "13 departamentos y un local comercial", pero el detalle de alquileres no tiene ninguna línea "Local". Tiene 13 departamentos (6 de 1 dormitorio, 6 de 2 y 1 de 3), "Cochera" y "Cochera y departamento". Si "Cochera y departamento" incluye una vivienda, esa parte pagaría IVA del 5% y no del 10%.
2. **Distancias y avisos de Ciudad Nueva:** las distancias (90 / 320 / 480 m por calle) y los avisos del barrio (Gs 3,0–3,2 M para 1 dormitorio y Gs 2,1–6,3 M para 2 dormitorios) no se pudieron reverificar desde este entorno. Quedan como en la v1.
3. **Estudio de mercado:** Ciudad Nueva todavía no tiene un estudio con el estándar D-100 (`knowledge-base/investment/market-intelligence/estudios/`). Conviene relevarlo antes de la próxima versión, sobre todo para respaldar los alquileres de 1 y 2 dormitorios.

## Registro de cambios
- **2026-11-07:** regenerada con el TC del BCP del 06/11/2026 (Gs 6.480,35). La lámina 16 (riesgos) decía que "el dólar bajó frente al guaraní"; se corrigió, porque desde mediados de octubre el dólar subió y la renta en USD bajó.
- **2026-11-05:** regenerada con el TC del 03/11/2026 (Gs 6.060,86).
- **2026-10-15:** teléfono único +595 982 853 111 (D-096) y TC del 14/10/2026 (Gs 5.698,03).
- **2026-10-15 (v1 → v2):** tipografía corregida. Fraunces con el ajuste oficial de D-036 (`opsz 80 / SOFT 24 / WONK 0`); J y j de Lora, regla P-008 `[EXTENSION]`. En la v1, la J de "Juan José" se apoyaba sobre la línea base. Contenido sin cambios: mismos textos, cifras, fotos, mapa, enlace de ubicación y contacto.

**Verificación de la v2 al TC de la v1 (Gs 5.694):** las 15 cifras de alquiler (totales por nivel 5,30 / 7,35 / 2,90 / 4,00 millones; promedios de Gs 1.158.333 para 1 dormitorio y Gs 1.516.667 para 2) reproducen exactamente la v1: bruta 12,12%, neta 8,25% y TIR de 10,2% / 11,7% / 13,5%.
