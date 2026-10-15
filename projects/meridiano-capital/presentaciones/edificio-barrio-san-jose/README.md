# Edificio Barrio San José — presentación comercial v3

Este deck sigue la plantilla maestra del **Edificio Ciudad Nueva (zona M4)**: la misma estructura, el mismo diseño y el mismo método de cálculo. Tiene 20 láminas. Agrega una tercera lámina de fotos para incluir las fotos interiores nuevas una lámina de **potencial de optimización** con la proyección recibida y una de **referencias de mercado** (alquileres publicados en Ciudad del Este), tomada del estudio de mercado preliminar del 2026-10-13 (`fuente/Estudio_de_mercado_Edificio_Barrio_San_Jose_2026-10-13.pdf`).

- PDF: `Edificio_Barrio_San_Jose_Meridiano_Capital_v3.pdf`
- Fuente: `fuente/` (modelo, generador, estilos, fuentes e imágenes). Se regenera con `../build_presentaciones.py`. El teléfono y el tipo de cambio salen de `../_config/meridiano.json` (D-096/D-097).

## Datos confirmados (recibidos)
- Precio: Gs 1.600.000.000.
- Terreno: 13,5 × 34 m = 459 m².
- Superficie construida: 600 m² y año de construcción 2006 (indicados por el founder el 2026-10-13).
- Composición: casa en planta baja, 4 + 4 departamentos monoambiente y 2 habitaciones independientes (1 terminada, 1 a terminar).
- Renta actual informada: Gs 11.000.000 por mes (8 departamentos Gs 8.000.000 en conjunto, casa Gs 3.000.000). La renta de la habitación terminada no se informó.
- Título: titulado según la información recibida, sin revisar.

## Supuestos (mismo criterio que M4 salvo donde se indica)
- Tipo de cambio: el vigente en `../_config/meridiano.json`. Al 15/10/2026: Gs 5.698,03 (BCP, referencial del 14/10/2026); el precio equivale a USD 280.799. Antes se usaba Gs 5.694 (BCP, 09/10/2026). **El Gs 5.950 de la versión anterior se descartó porque no tenía fecha.**
- IVA 5% sobre alquiler residencial (D-001), administración 8%, mantenimiento 5% e IRE 10%, como en M4.
- Vacancia 4%: es el valor por defecto del repo para departamentos. M4 usó 3%, pero lo justificaba con la demanda de su zona, y para San José no hay datos del barrio.
- Gastos fijos: Gs 6.000.000 por año. **El propietario no los informó.**
- Costo de construcción nueva: USD 650/m² (edificio, calidad básica, `06-costos-de-construccion.md`).
- Plusvalía: valorización de 2,0%, 3,5% o 5,0% anual, alquileres que suben 3%, 5% u 8% anual e IVA de venta del 1,5% (D-082).

## Resultados (base = renta actual, sin optimización)
- Bruta 8,25% · neta antes de IRE 6,06% · neta final 5,45% · TIR estimada a 5 años 7,3% / 8,9% / 10,5%.
- La proyección recibida (Gs 19,4 a 19,9 M por mes, bruta de 14,5% a 14,9%) se muestra **solo como escenario a validar**. Supone +80% en el canon de los departamentos y no tiene un AMC del barrio.

## Discrepancias detectadas por el estudio de mercado (2026-10-13)
- Antigüedad: el founder indica 2006; la publicación en InfoCasas dice de 9 a 15 años. El deck usa 2006.
- Terraza de 200 m²: según la publicación. No está claro si está incluida en los 600 m².
- Dirección declarada en la publicación: Av. Senador Long. El punto de Google Maps no está vinculado a la parcela.
- 4 cocheras y 10 baños: según la publicación, sin verificar.

## Pendiente antes del envío definitivo
- Teléfono unificado a +595 982 853 111 (D-096); el +595 981 257 217 del Excel quedó descartado.
- Dirección escrita y distancias por calle. El enlace de Google Maps del edificio (https://maps.app.goo.gl/jtpSEDXhJ8mzXVPY8) ya está en la lámina de ubicación.
- Contratos, depósitos e historial de cobro.
- Renta de la habitación terminada y costo de obra de la habitación a terminar.
- Superficie de cada unidad: sin ese dato, el alquiler de mercado no se puede estimar y el objetivo de Gs 1.800.000 no se confirma ni se descarta (confianza baja).
- Rango de venta del edificio completo: las referencias reunidas no alcanzan.
- Referencias de alquiler de Ciudad del Este guardadas en `knowledge-base/investment/market-intelligence/rentals/08-referencias-alquiler-ciudad-del-este.md`.
