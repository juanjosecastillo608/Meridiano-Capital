# Edificio Barrio San José — presentación comercial v3

Este deck sigue la plantilla maestra del **Edificio Ciudad Nueva (zona M4)**: la misma estructura, el mismo diseño y el mismo método de cálculo. Tiene 19 láminas. Agrega una tercera lámina de fotos para incluir las fotos interiores nuevas y una lámina de **potencial de optimización** con la proyección recibida.

- PDF: `Edificio_Barrio_San_Jose_Meridiano_Capital_v3.pdf`
- Fuente: `fuente/model.py` (calcula el modelo), `fuente/gen.py` y `fuente/style.css` (generan el HTML, que se imprime a PDF con Chromium). Las imágenes y las fuentes tipográficas no se versionan.

## Datos confirmados (recibidos)
- Precio: Gs 1.600.000.000.
- Terreno: 13,5 × 34 m = 459 m².
- Superficie construida: 600 m² y año de construcción 2006 (indicados por el founder el 2026-10-13).
- Composición: casa en planta baja, 4 + 4 departamentos monoambiente y 2 habitaciones independientes (1 terminada, 1 a terminar).
- Renta actual informada: Gs 11.000.000 por mes (8 departamentos Gs 8.000.000 en conjunto, casa Gs 3.000.000). La renta de la habitación terminada no se informó.
- Título: titulado según la información recibida, sin revisar.

## Supuestos (mismo criterio que M4 salvo donde se indica)
- Tipo de cambio Gs 5.694 por USD (BCP, 09/10/2026), el mismo que usa M4. **El tipo de cambio de Gs 5.950 de la versión anterior se descartó porque no tenía fecha.**
- IVA 5% sobre alquiler residencial (D-001), administración 8%, mantenimiento 5% e IRE 10%, como en M4.
- Vacancia 4%: es el valor por defecto del repo para departamentos. M4 usó 3%, pero lo justificaba con la demanda de su zona, y para San José no hay datos del barrio.
- Gastos fijos: Gs 6.000.000 por año. **El propietario no los informó.**
- Costo de construcción nueva: USD 650/m² (edificio, calidad básica, `06-costos-de-construccion.md`).
- Plusvalía: valorización de 2,0%, 3,5% o 5,0% anual, alquileres que suben 3%, 5% u 8% anual e IVA de venta del 1,5% (D-082).

## Resultados (base = renta actual, sin optimización)
- Bruta 8,25% · neta antes de IRE 6,06% · neta final 5,45% · TIR estimada a 5 años 7,3% / 8,9% / 10,5%.
- La proyección recibida (Gs 19,4 a 19,9 M por mes, bruta de 14,5% a 14,9%) se muestra **solo como escenario a validar**. Supone +80% en el canon de los departamentos y no tiene un AMC del barrio.

## Pendiente antes del envío definitivo
- Dirección exacta, coordenadas y distancias. No se pudo resolver el enlace de Google Maps desde este entorno.
- Contratos, depósitos e historial de cobro.
- Renta de la habitación terminada y costo de obra de la habitación a terminar.
- AMC de alquiler del barrio San José (SK-14). No hay datos de mercado de Ciudad del Este en `knowledge-base/`.
