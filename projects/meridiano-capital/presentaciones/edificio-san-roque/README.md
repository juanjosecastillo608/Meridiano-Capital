# Edificio San Roque — presentación comercial v1

**Inmueble:** edificio en el centro de Asunción, barrio San Roque, sobre Av. Eusebio Ayala, a metros de Luis A. de Herrera. Se vende a USD 250.000.
- Terreno de 585,80 m² (9 × 69 m) y 499,4 m² construidos en 3 niveles.
- Salón comercial terminado en planta baja, dos plantas altas por terminar y terraza de 160 m².
- Estacionamiento propio en el fondo del lote, con tinglado de 60 m².

**El deck:** sigue el esquema del Edificio Sajonia v4. Tiene 22 láminas y compara tres opciones de renta excluyentes:
- A · Local y oficinas.
- B · Local y departamentos.
- C · Clínica de consultorios.

Agrega una lámina sobre la ampliación de dos pisos en la terraza.

**Archivos:**
- **PDF para enviar a inversores:** `Edificio_San_Roque_Meridiano_Capital_v1.pdf`. Generado el **07/11/2026** con el TC del BCP del 06/11/2026 (Gs 6.480,35).
- **Fuente:** `fuente/`. Para regenerar: `python projects/meridiano-capital/presentaciones/build_presentaciones.py edificio-san-roque`.
- **Estudio de mercado (D-100):** `knowledge-base/investment/market-intelligence/estudios/ASU-SAN-ROQUE-2026-11-07/`.

**Fotos:**
- `tinglado.jpg`: foto del fondo del lote.
- `interior.jpg`: planta alta, recortada para que no aparezca la persona de la foto original.
- `render.jpg`: imagen generada con IA, rotulada como ilustrativa. Se recortó la pizarra, que decía "Plan de desarrollo San Luis".
- **No se usaron:** el folleto de RE/MAX (marca de terceros, renders de IA y rentabilidades no validadas, D-099) ni la foto con marca de agua de RE/MAX.

## Supuestos (todos a validar)
- **Superficies:** los 499,4 m² se reparten en PB con entrepiso (179,4 m²) y dos plantas de 160 m². Es un supuesto, porque no se recibieron planos.
- **Alquileres:**
  - Salón de PB: Gs 4,0 M, según el aviso; dentro de la banda de la Av. Eusebio Ayala.
  - Oficinas: Gs 32.000/m² sobre 256 m² alquilables.
  - Departamentos: 4 de 2 dormitorios (2 por planta, de unos 65 m²) a Gs 2,8 M, techo de la banda sin muebles, por el estacionamiento propio.
  - Consultorios: 12 (4 por nivel) a Gs 1,5 M, el mismo criterio que en Sajonia.
- **Obra:**
  - Plantas altas: tabla de Meridiano de USD 350/m² (oficinas) y USD 450/m² (vivienda), sobre 320 m².
  - Clínica: USD 450/m² sobre todo el edificio, más un ascensor de USD 45.000.
  - 10% de imprevistos y 12 meses de obra.
  - En A y B, el salón de PB renta durante la obra.
- **Gastos:**
  - IVA de 10% en locales, oficinas y consultorios, y de 5% en vivienda.
  - Vacancia de 8% en locales, 10% en oficinas, 4% en vivienda y 12% en consultorios.
  - Administración 8% y mantenimiento 5%.
  - Gastos fijos de Gs 7 M por año.
  - IRE 10%.
- **TIR:** un año de obra, cuatro años de renta y venta en el año 5. La valorización parte de la inversión total.

## Resultados (TC Gs 6.480,35 del 06/11/2026)
| | A · Local y oficinas | B · Local y departamentos | C · Clínica |
|---|---|---|---|
| Obra total | USD 123.200 | USD 158.400 | USD 296.703 |
| Ingreso mensual | Gs 12,2 M | Gs 15,2 M | Gs 18,0 M |
| Bruta | 6,05% | **6,89%** | 6,10% |
| Neta final | 3,42% | **4,45%** | 3,39% |
| TIR base a 5 años | 5,8% | **6,8%** | 5,9% |

**Contrastes:**
- **Esquema del aviso:** con 2 departamentos a Gs 3,5 M, B rinde 4,99% bruta y 3,12% neta. El esquema de Meridiano, con 4 departamentos más chicos, rinde más.
- **Ampliación de 2 pisos:** 4 departamentos más, con una obra de USD 228.800 a USD 650/m², rinden 9,06% bruta y 6,36% neta sobre su propia obra. Es una segunda etapa, no incluida en los resultados de arriba.
- **Alquiler que la clínica necesita** para igualar la neta de B: Gs 1,95 M por consultorio.

## Uso interno (no va en el deck)
**Precio de compra máximo** para una bruta objetivo, con la obra incluida (herramienta inversa):

| Bruta objetivo | A | B | C |
|---|---:|---:|---:|
| 10% | USD 102.566 | USD 123.066 | USD 36.612 |
| 8% | USD 159.007 | USD 193.433 | USD 119.941 |

Los USD 11 M por mes del aviso darían 8,15% bruto sobre el precio sin obra. No es comparable, porque supone las plantas altas terminadas y alquiladas. Esa cifra no se muestra (D-099).

## Pendiente
1. Confirmar la ubicación exacta: el enlace de Google Maps no se pudo abrir desde este entorno.
2. Recibir los planos actuales y proyectados. El mensaje los mencionaba, pero no llegaron entre los archivos adjuntos.
3. Aclarar la superficie del terreno, 585,80 m² frente a 9 × 69 = 621 m², con la mensura y el título.
4. Confirmar el estado real de las plantas altas y si hoy hay algún contrato de alquiler. El aviso menciona "3 unidades generadoras de ingresos", pero también un piso sin terminar.
5. Presupuesto de obra sobre el edificio real, verificación estructural para ampliar y normativa: altura, FOS y FOT.
6. Precio de venta rápida: el founder no lo definió. El modelo calcula internamente uno de referencia, USD 225.000 (−10%), que no figura en el deck.
7. Clínica: habilitación del Ministerio de Salud y criterio de uso exclusivo.
