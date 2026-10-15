# Edificio Sajonia — presentación comercial v1

Este deck sigue la plantilla maestra M4 / Barrio San José. Tiene 20 láminas y está adaptado a un activo **sin renta actual**: agrega láminas de alternativas de puesta en valor, costo de obra, ingresos estimados, referencias de mercado y sensibilidad.

- PDF: `Edificio_Sajonia_Meridiano_Capital_v1.pdf`
- Fuente: `fuente/model.py` (calcula el modelo), `fuente/gen.py` y `fuente/style.css` (generan el HTML, que se imprime a PDF con Chromium).
- El ACM y el folleto de RE/MAX recibidos **no se versionan**: contienen datos de terceros (agente, cliente).

## Datos confirmados (recibidos)
- Precio: USD 220.000.
- 803 m² construidos; año de construcción 1980; lote de 8 × 33 m (268 m²; la escritura transcrita indica 8 × 33,44 m = 267,52 m²). Indicados por el founder el 2026-10-15.
- Dirección: Ygatimí 1351 c/ Alférez Silva, barrio Dr. Francia, zona Palacio de Justicia. Google Maps: https://maps.app.goo.gl/Wa5gk2sX1pQZpFn59
- Edificio de 3 niveles de oficinas, desocupado, sin renta y sin estacionamiento propio.
- ACM de RE/MAX Proactiva (marzo 2025): terreno a USD 275/m², edificación a USD 200/m², valor de mercado de USD 234.325 y precio competitivo de USD 210.893.

## Supuestos
- **Costo de obra** (tabla `06-costos-de-construccion.md`, fila "remodelación sobre obra existente"):
  - Oficinas: USD 350/m² (calidad básica).
  - Departamentos: USD 450/m² (calidad estándar, porque hay cambio de uso).
  - Se suma un 10% de aprobaciones e imprevistos. **No hay presupuesto real.**
- **Programa B:** 5 departamentos de 1 dormitorio, 5 monoambientes y 1 local en PB. Es preliminar: hay que validarlo con un arquitecto y con la normativa municipal, porque necesita patio de luz.
- **Alquileres:**
  - 1 dormitorio Gs 2.200.000; monoambiente Gs 1.800.000; local Gs 2.700.000.
  - Oficinas Gs 30.000/m² sobre 642 m² alquilables (80% de lo construido).
  - Rangos tomados de anuncios de InfoCasas y Jariton relevados por buscador el 15/10/2026 (confianza baja a media).
- **Gastos:** vacancia de referencia de Meridiano (oficina 10%, comercial 8%, departamento 4%); IVA del 10% en oficinas y locales y del 5% en vivienda; administración 8%, mantenimiento 5%, gastos fijos de Gs 9 M por año (supuesto) e IRE 10%.
- **Retorno:** TIR con un año de obra sin renta, cuatro años de renta y venta al cierre del año 5. La valorización parte de la inversión total, lo que supone que la obra se recupera en el valor del activo.

## Resultados
| | A · Oficinas y locales | B · Departamentos |
|---|---|---|
| Inversión total | USD 529.155 | USD 617.485 |
| Bruta | 7,68% | 7,75% |
| Neta final | 4,36% | 5,13% |
| TIR a 5 años (cons. / base / opt.) | — | 6,2% / 7,6% / 9,1% |

Con la obra a USD 250/m², la alternativa B llega a 10,85% bruta y 7,19% neta. **El costo de obra es la variable decisiva.**

## Pendiente
- Presupuesto de obra sobre el edificio real e inspección técnica.
- Anteproyecto de la alternativa B y factibilidad municipal del cambio de uso.
- Fotos actuales del interior (solo hay fachada e imágenes de IA).
- Las fotos y los renders recibidos tienen marca de agua de RE/MAX.
- AMC de alquiler con fichas individuales verificadas (SK-14).
- Tipo de cambio del día de envío.
