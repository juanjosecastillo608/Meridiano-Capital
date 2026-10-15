# Edificio Sajonia — presentación comercial v2

Este deck sigue la plantilla maestra M4 / Barrio San José. Tiene 21 láminas y está adaptado a un activo **sin renta actual**: compara dos alternativas de puesta en valor a **dos precios de compra**.

- PDF: `Edificio_Sajonia_Meridiano_Capital_v2.pdf` (reemplaza la v1).
- Fuente: `fuente/model.py` (calcula el modelo), `fuente/gen.py` y `fuente/style.css` (generan el HTML, que se imprime a PDF con Chromium).
- Estudio de mercado del 15/10/2026: `fuente/Estudio_mercado_Sajonia.md`, `fuente/Datos_mercado_Sajonia.json` e `fuente/Instrucciones_Claude_Code_Sajonia.md`. **Están redactados**: se quitaron el nombre de la agente y el del cliente vendedor.
- El ACM y el folleto de RE/MAX **no se versionan**, porque contienen datos de terceros.

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

## Resultados
| | A · Oficinas a USD 220.000 | A · a USD 185.000 | B · Departamentos a USD 220.000 | B · a USD 185.000 |
|---|---|---|---|---|
| Inversión total | USD 451.866 | USD 416.866 | USD 518.114 | USD 483.114 |
| Bruta sobre inversión total | 13,48% | 14,61% | 11,06% | 11,87% |
| Neta final | 7,82% | 8,47% | 7,40% | 7,94% |
| TIR a 5 años, base | 9,7% | 10,4% | 9,5% | 10,1% |

**Lectura de los resultados:**
- **Oficinas (A) rinde más en el papel, pero con más riesgo.** Depende de colocar 642 m² de oficinas sin cocheras, y solo hay 4 anuncios de referencia.
- **Departamentos (B) sigue como alternativa principal.** Diversifica el ingreso en 10 unidades, con menos vacancia y un IVA menor.
- **Sin el descuento del 25%, B baja a 9,3% bruta.**

## Pendiente
- Presupuesto de obra sobre el edificio real e inspección técnica.
- Planos, mensura y superficie neta.
- Anteproyecto y factibilidad municipal del cambio de uso: Plan Regulador y Ordenanza 468/14 de seguridad contra incendio.
- Confirmar con los anunciantes la disponibilidad de los comparables.
- Confirmar si las fotos de interiores con retoque corresponden al edificio.
- Tipo de cambio del día de envío.
- Identificación catastral; el folleto dice barrio Dr. Francia.
