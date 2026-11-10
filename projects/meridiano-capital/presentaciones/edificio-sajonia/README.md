# Edificio Sajonia — presentación comercial v4

Este deck sigue la plantilla maestra M4 / Barrio San José. Tiene 22 láminas y está adaptado a un activo **sin renta actual**. Compara **tres usos excluyentes** para todo el edificio, cada uno a **dos precios de compra**:
- A · Oficinas para abogados.
- B · Departamentos de alquiler.
- C · Clínica de consultorios médicos.

- **PDF para enviar a inversores:** `Edificio_Sajonia_Meridiano_Capital_v4.pdf` (reemplaza la v3). Regenerado el **07/11/2026** con el tipo de cambio del BCP del 06/11/2026 (Gs 6.480,35).
- **Fuente:** `fuente/` (modelo, generador, estilos, fuentes e imágenes). Se regenera con `python projects/meridiano-capital/presentaciones/build_presentaciones.py edificio-sajonia`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).
- **Estudios de mercado (estándar D-100):**
  - `knowledge-base/investment/market-intelligence/estudios/ASU-SAJONIA-2026-11-07/`: consultorios, oficinas para abogados, departamentos y entorno de salud.
  - `ASU-SAJONIA-2026-10-15/`: oficinas y vivienda; sigue vigente.
  - Informe original del 15/10: `fuente/Estudio_mercado_Sajonia.md`, `fuente/Datos_mercado_Sajonia.json` e `fuente/Instrucciones_Claude_Code_Sajonia.md`. **Están redactados**: se quitaron el nombre de la agente y el del cliente vendedor.
- El ACM y el folleto de RE/MAX **no se versionan**, porque contienen datos de terceros.

## Cambios v3 → v4 (instrucciones del founder, 2026-11-07)
1. **El mixto (C de la v3) sale del análisis.** Según el founder, la reglamentación no permite que los consultorios médicos compartan edificio con oficinas de abogados ni con departamentos. Cada alternativa es un uso para todo el edificio. Este criterio debe confirmarse con la habilitación del Ministerio de Salud y con la Municipalidad.
2. **Nueva C · Clínica de consultorios:**
   - **Programa:** 20 consultorios (6 en PB y 7 en cada nivel superior), con recepción y sala de espera por nivel.
   - **Obra:** tabla estándar de cambio de uso (USD 450 − 25% = USD 337,5/m²), más un ascensor para pacientes de USD 45.000 (supuesto) y 10% de imprevistos.
   - **Alquiler:** Gs 1,5 M por consultorio por mes, vacío y sin servicios. Es un supuesto de Meridiano sobre los comparables K1–K3; en Sajonia no hay consultorios publicados.
   - **IVA y vacancia:** IVA del 10% y vacancia del 15% (supuesto: producto nuevo en la zona, sin el Hospital de Clínicas).
3. **A se reorienta a estudios jurídicos y escribanías** por la cercanía al Palacio de Justicia. El programa y el canon (Gs 45.000/m²) no cambian.
4. **Lámina nueva 14, "Mercado de consultorios":**
   - Comparables K1–K3 y O6.
   - Entorno de salud: ex Hospital de Clínicas, Centro de Salud N.º 8 y Hospital de Barrio Obrero.
   - **Alquiler requerido por consultorio** para igualar la neta de A o de B. Es una herramienta inversa, no un precio de mercado.
5. **Nota sobre el pedido del founder:** el pedido mencionaba el "Palacio de López" como lugar de abogados. El Palacio de López es la sede del Gobierno, en el centro. El polo de abogados junto a Sajonia es el **Palacio de Justicia**, y el deck usa ese nombre. Si el founder se refería a otra cosa, hay que corregirlo.

## Cambios v2 → v3 (2026-10-15, histórico: el mixto se retiró en la v4)
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
  - 2 dormitorios: Gs 3,0 M.
  - 1 dormitorio: Gs 2,5 M.
  - Monoambiente: Gs 2,2 M, por debajo de la banda porque el edificio no tiene cochera.
  - Local: Gs 2,7 M.
  - Consultorio: Gs 1,5 M por unidad.
- **Obra:** tabla de Meridiano con 25% de descuento, 10% de imprevistos y 12 meses de obra sin renta. La clínica suma un ascensor de USD 45.000 (supuesto).
- **Gastos:**
  - IVA del 10% en oficinas, locales y consultorios, y del 5% en vivienda.
  - Vacancia de 10% en oficinas, 8% en locales, 4% en vivienda y 15% en consultorios.
  - Administración 8%, mantenimiento 5%, gastos fijos de Gs 9 M por año (supuesto) e IRE 10%.
- **TIR:** un año de obra, cuatro años de renta y venta al cierre del año 5. La valorización parte de la inversión total.

## Resultados (v4, TC Gs 6.480,35 del 06/11/2026; regenerados el 07/11/2026)
| | A · Oficinas para abogados | B · Departamentos | C · Clínica de consultorios |
|---|---|---|---|
| Puesta en valor | USD 231.866 | USD 298.114 | USD 347.614 |
| Ingreso mensual | Gs 28,9 M | Gs 27,2 M | Gs 30,0 M |
| Bruta a USD 220.000 / 185.000 | 11,85% / 12,84% | 9,72% / 10,43% | 9,79% / 10,43% |
| Neta final a USD 220.000 / 185.000 | 6,87% / 7,44% | 6,50% / 6,98% | 5,24% / 5,59% |
| TIR base a 5 años, 220.000 / 185.000 | 8,9% / 9,5% | 8,7% / 9,2% | 7,7% / 8,1% |
| Bruta sin el descuento de obra (a 220.000) | 10,12% | 8,16% | 8,33% |

**Alquiler por consultorio necesario para igualar la neta, a USD 220.000:**
- La de A: Gs 1,95 M.
- La de B: Gs 1,85 M.

**Lectura:**
- **A · Oficinas para abogados** tiene la mejor bruta, la mejor neta y la mejor TIR, con la obra más liviana. Depende de colocar 642 m² de oficinas sin cocheras.
- **B · Departamentos** es la opción más defensiva: más unidades, menos vacancia y menor IVA.
- **C · Clínica de consultorios** genera el mayor ingreso bruto mensual, pero tiene la obra más cara, la vacancia más alta y la mayor incertidumbre de demanda. El Hospital de Clínicas se trasladó y no hay consultorios publicados en Sajonia.
  - Solo supera a las otras dos si cada consultorio se alquila en Gs 1,95 M o más.
  - Conviene validar esa cifra con médicos o con un operador de clínica antes de elegirla.
- **Ganancia base de C:** en la lámina de TIR, C muestra una ganancia base mayor que A. Es un efecto del supuesto de valorización, que parte de la inversión total: a más obra, más valor proyectado. No es una ventaja verificada.

## Pendiente
- Presupuesto de obra sobre el edificio real e inspección técnica.
- Planos, mensura y superficie neta.
- Anteproyecto y factibilidad municipal del cambio de uso: Plan Regulador y Ordenanza 468/14 de seguridad contra incendio.
- Clínica: confirmar con el Ministerio de Salud la habilitación y el criterio de uso exclusivo, y validar el alquiler por consultorio con médicos o con un operador de clínica.
- Medir las distancias a pie a los centros de salud y al Palacio de Justicia con el geocoding (SK-16).
- Confirmar con los anunciantes la disponibilidad de los comparables.
- Confirmar si las fotos de interiores con retoque corresponden al edificio.
- Tipo de cambio: actualizar `../_config/meridiano.json` con el del día de envío (D-097).
- Identificación catastral; el folleto dice barrio Dr. Francia.

## D-101: nueva base bruta → neta (09/11/2026)
La neta y la TIR de este README anteriores a esta fecha usaban la base vieja. Cifras vigentes, regeneradas con D-101 (IVA incluido en el alquiler con crédito fiscal, IRE con depreciación y crédito de la obra en la TIR):

| Deck | Precio | Bruta | Neta antes | Neta D-101 | TIR base antes | TIR base D-101 |
|---|---|---:|---:|---:|---:|---:|
| Sajonia A | USD 220.000 | 11,85% | 6,87% | **7,38%** | 8,9% | 10,1% |
| Sajonia B | USD 220.000 | 9,72% | 6,50% | **6,85%** | 8,7% | 9,3% |
| Sajonia C | USD 220.000 | 9,79% | 5,24% | **5,75%** | 7,7% | 8,7% |
