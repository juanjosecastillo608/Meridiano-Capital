# Edificio Sajonia — presentación comercial v3

Este deck sigue la plantilla maestra M4 / Barrio San José. Tiene 21 láminas y está adaptado a un activo **sin renta actual**: compara **tres alternativas** de puesta en valor (oficinas y locales, departamentos y mixto) a **dos precios de compra**.

- PDF: `Edificio_Sajonia_Meridiano_Capital_v3.pdf` (reemplaza la v2).
- Fuente: `fuente/` (modelo, generador, estilos, fuentes e imágenes). Se regenera con `../build_presentaciones.py`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).
- Estudio de mercado del 15/10/2026: `fuente/Estudio_mercado_Sajonia.md`, `fuente/Datos_mercado_Sajonia.json` e `fuente/Instrucciones_Claude_Code_Sajonia.md`. **Están redactados**: se quitaron el nombre de la agente y el del cliente vendedor.
- El ACM y el folleto de RE/MAX **no se versionan**, porque contienen datos de terceros.

## Cambios v2 → v3 (2026-10-15)
1. **Tercera alternativa, C · Mixto:**
   - Programa: local en PB, oficinas en los niveles 1 y 2 (368 m² alquilables) y, en el nivel 3, 1 departamento de 2 dormitorios, 1 de 1 dormitorio y 2 monoambientes.
   - Obra: 2 niveles a USD 262,5/m² y 1 nivel a USD 337,5/m². Supone 3 niveles de superficie similar (803 / 3 m²).
   - IVA y vacancia: ponderados por ingreso según el uso.
2. **Láminas de análisis** (alternativas, obra, ingresos, egresos, rentabilidad, sensibilidad y TIR): ahora muestran las tres alternativas a USD 220.000 y USD 185.000.
3. **Tipografía:**
   - Se carga Fraunces variable con el ajuste oficial de D-036 (`opsz 80 / SOFT 24 / WONK 0`).
   - J y j de Lora por `unicode-range`. Es una regla nueva, `[EXTENSION]`, registrada como P-008 PROPOSED.
   - La misma corrección se aplicó al deck de Barrio San José.
   - `fuente/fonts.css` documenta las fuentes; los archivos .woff2 no se versionan.

## Cambios v1 → v2 (instrucciones del founder, 2026-10-15)
1. **Costo de obra con 25% de descuento** sobre la tabla de Meridiano, por el estado actual del edificio:
   - Oficinas: USD 350 → 262,5/m².
   - Departamentos: USD 450 → 337,5/m².
2. **Dos precios:** USD 220.000 (precio de venta) y USD 185.000 (venta rápida), ambos confirmados por el founder.
3. **Alquileres del estudio de mercado** (fichas individuales, IDs O/M/D/T) en lugar del relevamiento por buscador de la v1.
4. **Programa B redefinido** para incluir 2 dormitorios: 2 de 2 dorm., 3 de 1 dorm., 5 monoambientes y 1 local.
5. **Fotos sin marca de agua.**
   - Fachada: frontal y lateral.
   - Interiores: imágenes con retoque digital, rotuladas "a verificar en la visita", y una foto de archivo de la sala de reuniones.
   - Renders de IA: rotulados como tales.

## Supuestos
- **Base de alquiler:**
  - Oficinas: Gs 45.000/m² (O3, 160 m² sin muebles: Gs 46.350/m²) sobre 642 m² alquilables (80% de 803 m²).
  - 2 dormitorios: Gs 3,0 M (piso de la banda estándar).
  - 1 dormitorio: Gs 2,5 M.
  - Monoambiente: Gs 2,2 M, por debajo de la banda M1–M2, porque el edificio no tiene cochera.
  - Local: Gs 2,7 M.
- **Ajustes:** el ajuste por falta de cochera es un supuesto de Meridiano, no un dato de mercado.
- **Obra:** 10% de imprevistos y 12 meses de obra sin renta.
- **Gastos:** vacancia de referencia de Meridiano; IVA del 10% en oficinas y locales y del 5% en vivienda; administración 8%, mantenimiento 5%, gastos fijos de Gs 9 M por año (supuesto) e IRE 10%.
- **TIR:** un año de obra, cuatro años de renta y venta al cierre del año 5. La valorización parte de la inversión total.

## Resultados (v3, TC Gs 5.698 del 14/10/2026)
| | A · Oficinas | B · Departamentos | C · Mixto |
|---|---|---|---|
| Puesta en valor | USD 231.866 | USD 298.114 | USD 253.949 |
| Bruta a USD 220.000 / 185.000 | 13,47% / 14,60% | 11,06% / 11,86% | 12,96% / 14,00% |
| Neta final a USD 220.000 / 185.000 | 7,81% / 8,47% | 7,40% / 7,93% | 7,97% / 8,61% |
| TIR base a 5 años, 220.000 / 185.000 | 9,7% / 10,4% | 9,5% / 10,1% | 9,9% / 10,6% |
| Bruta sin el descuento de obra (a 220.000) | 11,51% | 9,28% | 11,00% |

**Lectura:**
- **C · Mixto** tiene la mejor neta y la mejor TIR, con menos exposición a oficinas que A. Su contrapartida es separar accesos, medidores y seguridad contra incendio por uso.
- **A · Oficinas** tiene la mejor bruta, pero depende de alquilar 642 m² de oficinas sin cocheras.
- **B · Departamentos** es la más defensiva: más unidades, menos vacancia y menor IVA. A cambio, tiene la obra más cara y la rentabilidad más baja.

## Pendiente
- Presupuesto de obra sobre el edificio real e inspección técnica.
- Planos, mensura y superficie neta.
- Anteproyecto y factibilidad municipal del cambio de uso: Plan Regulador y Ordenanza 468/14 de seguridad contra incendio.
- Confirmar con los anunciantes la disponibilidad de los comparables.
- Confirmar si las fotos de interiores con retoque corresponden al edificio.
- Tipo de cambio: actualizar `../_config/meridiano.json` con el del día de envío (D-097).
- Identificación catastral; el folleto dice barrio Dr. Francia.
