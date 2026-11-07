# Galería San Blas (Ciudad del Este) — presentación comercial v1

**El inmueble:**
- Galería comercial de 2 niveles en Av. San Blas 519, con salida a Camilo Recalde, en el microcentro de Ciudad del Este.
- Terreno pasante de 900 m² (15 × 60 m) y 1.572 m² construidos.
- Según el aviso, está a 650 m del Puente de la Amistad.
- Precio de venta: USD 2.500.000.
- Hoy funciona en ella una casa de venta textil.

**La presentación:** 20 láminas, mismo esquema que Sajonia y San Roque. Compara tres opciones de renta:
- A · Galería de locales.
- B · Renta a un solo operador.
- C · Galería con 3 pisos de oficinas corporativas.

**Archivos:**
- **PDF para enviar a inversores:** `Galeria_San_Blas_CDE_Meridiano_Capital_v1.pdf`. Generado el **07/11/2026** con el TC del BCP del 06/11/2026 (Gs 6.480,35).
- **Fuente:** `fuente/`. Se regenera con `python projects/meridiano-capital/presentaciones/build_presentaciones.py galeria-san-blas-cde`.
- **Estudio de mercado (D-100):** `knowledge-base/investment/market-intelligence/estudios/CDE-MICROCENTRO-2026-11-07/`, complementado por los comerciales de `CDE-CATEDRAL-2026-11-07`.
- **Ubicación (QR):** https://maps.app.goo.gl/jszFoMyfd4agg5LfA. El QR se verificó decodificándolo.

**Material de terceros:**
- La presentación de otra broker que envió el founder **no se versiona**, porque contiene sus datos de contacto.
- Sus cifras de suelo y comparables no se usaron, porque no traen enlaces verificables.
- **Fotos:** cuadros de un video aéreo con sus rótulos ("Propiedad de calle a calle", "Av. San Blas") y fotos interiores de la casa textil. En la foto interior se difuminaron las caras de las personas.

## Supuestos (todos a validar)
- **Superficies:** se reparten en PB de 900 m² y planta alta de 672 m². Lo alquilable en la galería es el 60% de lo construido, por el pasillo de calle a calle.
- **Alquileres, en USD:**
  - Locales de PB: USD 22/m², entre un salón premium del centro (USD 18) y el techo de las galerías del microcentro (USD 50).
  - Planta alta: USD 10/m².
  - Un solo operador: USD 8/m² sobre los 1.572 m².
  - Oficinas nuevas: USD 11/m² sobre el 80% de 1.800 m².
- **Obra:**
  - A: USD 175/m², el 50% de la tabla básica de remodelación, porque el edificio está en uso y en buen estado según el aviso.
  - B: USD 30.000.
  - C: la obra de A, más oficinas a USD 750/m² con un 15% de refuerzo estructural y 2 ascensores por USD 120.000.
  - Imprevistos del 10% en las tres.
- **Gastos:**
  - IVA 10%.
  - Vacancia de 15% en galería y oficinas, y de 5% con un solo operador.
  - Administración 8% y mantenimiento 5%.
  - Gastos fijos de USD 12.000 por año.
  - IRE 10%.
- **TIR:**
  - Obra: 1 año en A y 2 años en C, con la galería rentando desde el año 2. B renta desde el año 1.
  - Venta en el año 5.
  - Escenarios de alquiler (+2/+3/+5%) y de valorización (2/3,5/5%).

## Resultados (precio de USD 2.500.000)
| | A · Galería de locales | B · Un operador | C · Galería y oficinas |
|---|---|---|---|
| Obra total | USD 302.610 | USD 33.000 | USD 2.142.360 |
| Alquiler mensual | USD 15.912 | USD 12.576 | USD 31.752 |
| Bruta | 6,81% | 5,96% | **8,21%** |
| Neta final | 3,42% | 3,43% | **4,35%** |
| TIR base a 5 años | 5,1% | **6,0%** | 5,6% |

**Lectura:**
- La renta rinde moderado sobre un precio que es, sobre todo, suelo.
- Valuando los 1.572 m² a costo nuevo (USD 450/m²), el suelo implícito es de unos USD 1,79 M, es decir, unos USD 1.992/m² de terreno.
- C da la mejor bruta y la mejor neta, pero necesita USD 2,1 M más de capital, permisos y 2 años de obra.
- B tiene la mejor TIR, porque renta desde el primer año con poca obra.

## Uso interno (no va en el deck)
**Precio máximo de compra** para una bruta objetivo, con la obra incluida:

| Bruta objetivo | A | B | C |
|---|---:|---:|---:|
| 8% | USD 2,08 M | USD 1,85 M | USD 2,62 M |
| 10% | USD 1,61 M | USD 1,48 M | USD 1,67 M |

Para que A llegue al 8% bruto, los locales de PB tendrían que alquilarse a USD 27,1/m².

## Pendiente
1. **Ocupación actual:** ¿la casa textil es inquilina o propietaria? Hace falta el contrato, el canon y el plazo, porque definen la renta inicial y la posibilidad de reconvertir.
2. **Venta rápida:** el founder no indicó un precio de venta rápida.
3. **Superficie:** aclarar 1.572 m² frente a 1.590 m² construidos, con planos y mensura.
4. **Estructura y normativa:** verificación estructural y normativa de altura, FOS y FOT de CDE para la opción C.
5. **Distancia al Puente de la Amistad:** medirla. Los 650 m vienen del aviso.
6. **Locales de galería:** relevar locales del microcentro con superficie y precio, para confirmar los USD 22/m² de PB, la cifra que más pesa en el resultado.
