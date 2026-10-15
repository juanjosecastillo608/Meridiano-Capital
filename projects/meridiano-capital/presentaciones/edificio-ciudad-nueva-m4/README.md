# Edificio Ciudad Nueva (zona Mercado 4) — presentación comercial v2

Es la **plantilla maestra** de las presentaciones de Meridiano Capital. La v1 se armó en LibreOffice Impress y su archivo fuente no está en el repo. Esta v2 la reconstruye lámina por lámina (17 láminas) con el mismo pipeline HTML → PDF que Barrio San José y Sajonia. Mantiene el mismo contenido y el mismo diseño, con la tipografía corregida.

- PDF: `Edificio_Ciudad_Nueva_13_Departamentos_zona_M4_v2.pdf`
- Fuente: `fuente/` (modelo que recalcula todo desde el detalle de alquileres, generador, estilos, fuentes e imágenes). Se regenera con `../build_presentaciones.py`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).

## Cambios v1 → v2 (2026-10-15)
- **Tipografía:**
  - Fraunces con el ajuste oficial de D-036 (`opsz 80 / SOFT 24 / WONK 0`).
  - J y j de Lora, regla P-008 `[EXTENSION]`.
  - En la v1, la J de "Juan José" se apoyaba sobre la línea base por el diseño propio de Fraunces.
- **Contenido:** sin cambios. Mismos textos, cifras, fotos, mapa, enlace de ubicación y contacto.

## Verificación de cifras al TC de la v1 (Gs 5.694), recalculadas desde los 15 conceptos de alquiler
Todas coinciden con la v1:
- **Ingresos:**
  - Totales por nivel: 5,30 / 7,35 / 2,90 / 4,00 millones.
  - Ingreso mensual: Gs 19.550.000.
  - Ingreso anual: USD 41.201 al TC de 5.694.
- **IVA ponderado:** 5,49%, con el 10% aplicado a "Cochera" y "Cochera y departamento".
- **Gastos:** vacancia 3%, administración 8%, mantenimiento 5%, gastos fijos USD 1.200 e IRE 10%.
- **Rentabilidad:** bruta 12,12%, neta antes de IRE 9,16%, neta final 8,25% y 8,3 veces.
- **Promedios de alquiler:** 1 dormitorio Gs 1.158.333; 2 dormitorios Gs 1.516.667.
- **Superficies:** USD 307/m², costo de construcción nueva USD 720.850 (el precio equivale al 47%) y USD 24.286 por unidad (14 unidades).
- **Escenarios a 5 años:** neto del año 5 de USD 31.688 / 34.308 / 38.529 y TIR de 10,2% / 11,7% / 13,5%.

## Observaciones a confirmar
1. **Local comercial:** el resumen dice "13 departamentos y un local comercial", pero el detalle de alquileres no tiene ninguna línea "Local". Hay 13 departamentos (6 de 1 dorm., 6 de 2 dorm. y 1 de 3 dorm.), "Cochera" y "Cochera y departamento". Si "Cochera y departamento" incluye una vivienda, esa parte pagaría IVA del 5% y no del 10%.
2. **Distancias** (90 / 320 / 480 m por calle) y **avisos de Ciudad Nueva** (Gs 3,0–3,2 M y 2,1–6,3 M): no se pudieron reverificar desde este entorno; quedan como en la v1.
3. **Teléfono:** resuelto — +595 982 853 111 en todas las presentaciones (D-096).
4. **Tipo de cambio:** actualizado a Gs 5.698,03 (BCP, referencial del 14/10/2026; antes Gs 5.694 del 09/10). Con el nuevo TC:
   - Ingreso anual: USD 41.172.
   - Rentabilidad: bruta 12,11%, neta 8,24% y neta antes de IRE 9,15%; 8,3 veces.
   - Escenarios a 5 años: TIR 10,2% / 11,7% / 13,5%, sin cambios.
