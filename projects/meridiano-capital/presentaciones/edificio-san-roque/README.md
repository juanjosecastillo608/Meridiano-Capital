# Edificio San Roque — presentación comercial v1

**Inmueble:** edificio en el centro de Asunción, barrio San Roque, sobre **Luis Alberto de Herrera casi Brasil** (dirección confirmada por el founder el 07/11/2026). Se vende a USD 250.000; la venta rápida es de USD 170.000 (founder, 07/11/2026). Está cerca de la sede del Ministerio de Salud Pública (Av. Pettirossi y Brasil) y de varios sanatorios.
- Ubicación exacta: https://maps.app.goo.gl/dc9bF3eS4CBVMc8h7. Referencia del Ministerio, enviada por el founder: https://maps.app.goo.gl/JMMxZ6GZyqhGWvjQ6. Ningún enlace se puede abrir desde este entorno, así que las distancias quedan por medir.
- Terreno de 585,80 m² (9 × 69 m) y 499,4 m² construidos en 3 niveles.
- Salón comercial terminado en planta baja, dos plantas altas por terminar y terraza de 160 m².
- Estacionamiento propio en el fondo del lote, con tinglado de 60 m².

**El deck:** sigue el esquema del Edificio Sajonia v4. Tiene 22 láminas y compara tres opciones de renta excluyentes, cada una a **dos precios** (USD 250.000 y USD 170.000):
- A · Local y oficinas.
- B · Local y departamentos.
- C · Clínica de consultorios.

Agrega una lámina sobre la ampliación de dos pisos en la terraza.

**Archivos:**
- **PDF para enviar a inversores:** `Edificio_San_Roque_Meridiano_Capital_v1.pdf`. Generado el **07/11/2026** con el TC del BCP del 06/11/2026 (Gs 6.480,35).
- **Fuente:** `fuente/`. Para regenerar: `python projects/meridiano-capital/presentaciones/build_presentaciones.py edificio-san-roque`.
- **Estudio de mercado (D-100):** `knowledge-base/investment/market-intelligence/estudios/ASU-SAN-ROQUE-2026-11-07/`.

**Fotos:**
- `fachada.jpg`: fachada actual, enviada por el founder el 07/11. Se difuminaron las caras de los dos peatones; la patente del auto no es legible. Es la imagen de portada.
- `planta_baja.jpg`: salón de PB con entrepiso, enviado por el founder el 07/11. Rotulado "a verificar en la visita".
- `mapa.jpg`: vista aérea de Google Maps enviada por el founder, con el marcador del edificio (aprox. −25,2905, −57,6267). Se recortó la barra de captura de pantalla.
- `qr_ubicacion.png`: QR de https://maps.app.goo.gl/BqVMt7V2gT9mkx5J6, con los colores de la marca. Se verificó que al escanearlo abre ese enlace.
- `tinglado.jpg`: foto del fondo del lote.
- `interior.jpg`: planta alta, recortada para que no aparezca la persona de la foto original.
- **Retirado:** el render de IA de la v1 inicial, porque mostraba el mismo salón de PB retocado y ahora hay foto real.
- **No se usaron:** el folleto de RE/MAX (marca de terceros, renders de IA y rentabilidades no validadas, D-099) ni la foto con marca de agua de RE/MAX.

## Supuestos (todos a validar)
- **Superficies:** los 499,4 m² se reparten en PB con entrepiso (179,4 m²) y dos plantas de 160 m². Es un supuesto, porque no se recibieron planos.
- **Alquileres:**
  - Salón de PB: Gs 4,0 M, según el aviso; dentro de la banda de salones de la zona (L1–L4).
  - Oficinas: Gs 32.000/m² sobre 256 m² alquilables.
  - Departamentos: 4 de 2 dormitorios (2 por planta, de unos 65 m²) a Gs 2,8 M, techo de la banda sin muebles, por el estacionamiento propio.
  - Consultorios: 12 (4 por nivel) a Gs 1,5 M, el mismo criterio que en Sajonia.
  - Oficinas de A: orientadas a proveedores y gestores del sector salud, por la cercanía del Ministerio.
- **Obra:**
  - Plantas altas: tabla de Meridiano de USD 350/m² (oficinas) y USD 450/m² (vivienda), sobre 320 m².
  - Clínica: USD 450/m² sobre todo el edificio, más un ascensor de USD 45.000.
  - 10% de imprevistos y 12 meses de obra.
  - En A y B, el salón de PB renta durante la obra.
- **Gastos:**
  - IVA de 10% en locales, oficinas y consultorios, y de 5% en vivienda.
  - Vacancia de 8% en locales, 10% en oficinas, 4% en vivienda y 10% en consultorios (más baja que en Sajonia por la cercanía del Ministerio de Salud y de los sanatorios; supuesto).
  - Administración 8% y mantenimiento 5%.
  - Gastos fijos de Gs 7 M por año.
  - IRE 10%.
- **TIR:** un año de obra, cuatro años de renta y venta en el año 5. La valorización parte de la inversión total.

## Resultados (TC Gs 6.480,35 del 06/11/2026)
| | A · Local y oficinas | B · Local y departamentos | C · Clínica |
|---|---|---|---|
| Obra total | USD 123.200 | USD 158.400 | USD 296.703 |
| Ingreso mensual | Gs 12,2 M | Gs 15,2 M | Gs 18,0 M |
| Bruta a USD 250.000 / 170.000 | 6,05% / 7,70% | **6,89% / 8,57%** | 6,10% / 7,14% |
| Neta final a USD 250.000 / 170.000 | 3,42% / 4,36% | **4,45% / 5,54%** | 3,50% / 4,10% |
| TIR base, 250.000 / 170.000 | 5,8% / 6,8% | **6,8% / 7,9%** | 6,0% / 6,7% |

**Contrastes:**
- **Esquema del aviso:** con 2 departamentos a Gs 3,5 M, B rinde 4,99% bruta a USD 250.000 y 6,20% a USD 170.000.
- **Ampliación de 2 pisos:** 4 departamentos más, con una obra de USD 228.800, rinden 9,06% bruta y 6,36% neta sobre su propia obra. No está incluida en los resultados de arriba.
- **Alquiler que la clínica necesita** para igualar la neta de B: Gs 1,89 M por consultorio a USD 250.000 y Gs 2,0 M a USD 170.000.

## Uso interno (no va en el deck)
**Precio de compra máximo** para una bruta objetivo, con la obra incluida (herramienta inversa):

| Bruta objetivo | A | B | C |
|---|---:|---:|---:|
| 10% | USD 102.566 | USD 123.066 | USD 36.612 |
| 8% | USD 159.007 | USD 193.433 | USD 119.941 |

A USD 170.000, B supera el 8% bruto, pero no llega al 10%.

Los Gs 11 M por mes del aviso darían 8,15% bruto sobre USD 250.000 sin obra. No es comparable, porque supone las plantas altas terminadas y alquiladas, y no se muestra (D-099).

## Pendiente
1. Medir la distancia exacta a pie al Ministerio de Salud (según el mapa, menos de dos cuadras) y a los sanatorios con el geocoding (SK-16). Los enlaces de Google Maps no se pueden abrir desde este entorno.
2. Recibir los planos actuales y proyectados. El mensaje los mencionaba, pero no llegaron entre los archivos adjuntos.
3. Aclarar la superficie del terreno, 585,80 m² frente a 9 × 69 = 621 m², con la mensura y el título.
4. Confirmar el estado real de las plantas altas y si hoy hay algún contrato de alquiler. El aviso menciona "3 unidades generadoras de ingresos", pero también un piso sin terminar.
5. Presupuesto de obra sobre el edificio real, verificación estructural para ampliar y normativa: altura, FOS y FOT.
6. Clínica: habilitación del Ministerio de Salud y criterio de uso exclusivo.

## Registro de cambios
- **2026-11-07 (segunda entrega):**
  - Venta rápida de USD 170.000 confirmada por el founder; el análisis muestra ahora los dos precios.
  - Ubicación exacta y cercanía al Ministerio de Salud.
  - Fotos reales de la fachada y de la planta baja; sale el render de IA.
  - Lámina 3 rehecha con el mapa aéreo y el QR de la ubicación. Según el mapa, el Ministerio de Salud está sobre Brasil, entre Herrera y Pettirossi, a menos de dos cuadras. En la misma cuadra de Herrera hay consultorios médicos.
  - Dirección corregida a Luis Alberto de Herrera casi Brasil, sobre la misma calle que la sede del Ministerio de Salud. El enlace de ubicación figura como texto en la lámina 3. Los salones de Eusebio Ayala (L1–L3) pasan a ser comparables de la zona, no del frente del edificio.
  - Vacancia de consultorios en 10%.
