# Clínica Magnificat (Asunción) — presentación, modelo y planilla para el propietario v1

**El inmueble:** clínica pediátrica en funcionamiento en Asunción. Barrio San Cristóbal (founder, 09/11/2026); esquina: frente corto de 9,60 m sobre calle Sucre (estacionamiento de clientes en una franja de 5 m, sin entradas) y lado largo sobre calle Juan Mota (único acceso peatonal, sin estacionamientos). Corrección del founder del 10/11/2026.
- **Precio de venta:** USD 500.000. **Venta rápida:** USD 420.000 (founder, 09/11/2026).
- **Planta baja y primer piso:** 11 consultorios con baño propio, todos alquilados, sin mobiliario. Cinco tienen instalaciones para odontología.
- **Alquiler:** Gs 2.500.000 por consultorio y por mes, con IVA y expensas incluidos.
- **Gastos informados:**
  - Administración: Gs 10.450.000 por mes, con secretaria y sin desglose.
  - Impuesto inmobiliario: Gs 45 M por año.
- **Segundo piso:** departamento que se entrega libre; se propone como vivienda del comprador durante dos años (sin renta) y luego su reconversión en consultorios.
- **Ascensor:** no está instalado. El hueco y la estructura están previstos, según el propietario.
- **Ubicación (QR):** https://maps.app.goo.gl/kKoH14evyzGWSrUP9, verificado al decodificarlo. El enlace no se pudo abrir desde el entorno.

## Entregables
- `Clinica_Magnificat_Meridiano_Capital_v1.pdf`: presentación para el inversor (27 láminas, con 9 de recorrido fotográfico y una de rentabilidad futura). Las láminas de fotos se arman solas a partir de `fuente/img/` y su `leyendas.json`.
- `web/index.html`: versión web hecha sobre el `index.html` del paquete. Tiene aviso, simulador de alquileres con la base D-101, filtros de galería y estilos de impresión. Se genera con `fuente/build_web.py`.
- `entregables/Modelo_Inversion_Clinica_Magnificat.xlsx`: modelo con fórmulas vivas por etapa y por precio, con flujo y TIR. Está conciliado al decimal con `model.py`.
- `entregables/Planilla_Desglose_Gastos_Clinica_Magnificat.xlsx`: **para enviar al propietario**. Pide el desglose de los Gs 10,45 M con factura sí/no, la boleta del impuesto inmobiliario, los datos de los consultorios (sin nombres) y los documentos. No contiene análisis de Meridiano.
- **Estudio de mercado (D-100):** `knowledge-base/investment/market-intelligence/estudios/ASU-CONSULTORIOS-2026-11-09/`.
- **Regeneración:** `python projects/meridiano-capital/presentaciones/build_presentaciones.py` (completo). El Excel y la web salen de `fuente/build_entregables.py`.

## Resultados (TC Gs 6.480,35, BCP del 06/11/2026; base D-101)
| Etapa | Facturación/mes | Bruta USD 500 k | Neta USD 500 k | Neta USD 420 k |
|---|---:|---:|---:|---:|
| Hoy | Gs 27,5 M | 10,18% | 3,27% | 3,87% |
| Etapa 1 (0–12 m): +10%, gastos −15%, mejoras y ascensor | Gs 30,25 M | 10,82% | 4,40% | 5,18% |
| Etapa 2 (12–24 m): Gs 3,0 M por consultorio | Gs 33 M | 11,81% | 5,00% | 5,89% |
| Etapa 3 (mes 25+): 6 consultorios nuevos (anteproyecto) | Gs 51 M | 16,02% | 8,48% | 9,79% |

- **D-103 (10/11/2026):**
  - La facturación incluye servicios. La bruta de renta pura (supuesto: el 60% de la administración son servicios) es 7,86% hoy a USD 500.000 y 9,36% a USD 420.000.
  - Hay alertas de coherencia abiertas: neta al 42% de la renta pura, administración sin desglose e impuesto inmobiliario sobre el 1% del precio.
  - Por eso el deck y la web muestran la neta como rango: hoy 3,27–3,95% a USD 500.000 y 3,87–4,85% a USD 420.000.
  - El rango se cierra con la planilla de desglose y la boleta.
- **TIR base a 5 años:** 9,7% a USD 500.000 y 10,8% a USD 420.000. Sin la reconversión del segundo piso: 7,8% y 8,6%.
- **Peso de los gastos:** la administración es el 38% de la facturación y el impuesto inmobiliario el 13,6%. Si el impuesto fuera la mitad, la neta de hoy sería 3,89% a USD 500.000.

## Supuestos principales (a validar)
- **Alquileres:** +10% al renovar (Gs 2,75 M) y +10% con ascensor y mejoras (Gs 3,0 M). El techo de mercado está en Gs 3,85 M con IVA, para un consultorio con secretaria en Villa Morra.
- **Administración:** baja 15% después de la auditoría.
- **Inversiones:**
  - Ascensor de 3 paradas: Gs 58 M + 10% por cotización vencida + Gs 15 M de obra eléctrica y civil.
  - Mejoras: Gs 35 M.
  - Mantenimiento del ascensor: Gs 500.000 por mes desde el año 2.
- **Reconversión del segundo piso:**
  - El anteproyecto del 10/11/2026 propone 6 consultorios (12 a 17, réplica funcional del primer piso); se usan 6 como base y 4 y 5 como escenarios, hasta tener el relevamiento del segundo piso.
  - USD 12.000 por consultorio y +10% de administración.
- **Base D-101:**
  - IVA 10% incluido en el alquiler.
  - Crédito fiscal sobre el 40% de la administración (supuesto: la nómina no genera crédito) y sobre la reserva de mantenimiento del 2%.
  - Vacancia del 5%.
  - IRE con depreciación.

## Material no versionado
El `index.html`, el Excel y el prompt del paquete, y los dos presupuestos de ascensor en PDF, que tienen datos de contacto del proveedor. Sus cifras están en el modelo y en la lámina 9.

## Pendiente
1. Fotos: completas (6 ZIP recibidos e incorporados al deck y a la galería web).
3. Planilla de desglose completada por el propietario, boleta del impuesto, contratos y cobranza.
4. Estado de los contratos: según el paquete, están vencidos hace cuatro meses. Revisión con el abogado.
5. Cotizaciones actualizadas del ascensor y factibilidad técnica.
6. Plano y superficie del segundo piso, para definir cuántos consultorios entran.

## Planos y superficies (09/11/2026)
- Superficies aproximadas de cada consultorio, con baño, leídas de las fotos de los planos impresos (escala 1:50): entre 12,3 y 20,7 m², unos 165 m² en total.
- Odontología: consultorios 1, 2, 3, 7 y 11, que tienen el sillón dibujado en el plano.
- **Hallazgo:** por m², los consultorios chicos ya cobran unos Gs 180.000–200.000, en línea con Villa Morra. Los grandes (6, 7 y 8) cobran Gs 121.000–135.000. La etapa 2 se plantea con alquiler según tamaño: Gs 3,5 M los grandes y Gs 2,8 M el resto, unos Gs 32,9 M por mes.

## Registro
- 09/11/2026: ZIP de fotos 2, 3 y 5 incorporados (salas de espera, consultorios y departamento); faltan los ZIP 1 y 4 (fachada y accesos). Las fotos de cocheras tienen patentes visibles: se difuminan si se usan.
- 09/11/2026: ZIP 1, 4 y 6 incorporados. La fachada pasa a la portada y a la lámina de ubicación; nuevas láminas "Fachada y accesos" (frente en esquina, lateral y estacionamiento de clientes) y "Circulaciones" (pasillos de PB y del primer piso, y la escalera, hoy único acceso a la planta alta). Privacidad: se difuminaron las patentes de los autos (frente y lateral), el cartel de profesionales de la escalera y las placas con nombres de los médicos en las puertas del pasillo de PB.
- 09/11/2026 (tarde): nueva lámina "Rentabilidad futura" con el 2.º piso reconvertido. Compara hoy, la etapa 2 y la etapa 3 a los dos precios. Con 4 consultorios nuevos, la reconversión agrega USD 15.602 netos por año sobre una inversión de USD 48.000: 32,5% neto sobre lo invertido, sin cargarle el ascensor de la etapa 1. Nuevas láminas de fotos: cocheras y patio de servicio, baños propios de los consultorios y una segunda lámina del departamento (living, dormitorio principal y baño). Se difuminaron las patentes de los dos autos de las cocheras.
- 10/11/2026: anexo de corrección del founder (anteproyecto en 3 hojas). Tres láminas nuevas de anteproyecto: planta baja (implantación y sanitarios, con el bloque de baños y depósito del fondo del pasillo, el sanitario junto a la espera y el de la escalera marcados sobre la foto del plano original, sin alterar su geometría), primer piso (consultorios 6 a 11) y segundo piso (propuesta de consultorios 12 a 17, con el render conceptual de la fachada junto a la foto real). Corregidos los textos y leyendas de accesos: ingreso peatonal solo por Juan Mota, estacionamiento de clientes solo sobre Sucre. La etapa 3 pasa de 4 a 6 consultorios nuevos (escenarios 4 a 6): neta de 8,48% a USD 500.000 y 9,79% a USD 420.000; la reconversión agrega USD 24.116 netos por año sobre USD 72.000 de inversión. El render no está presupuestado. No se versionaron las presentaciones HTML del anexo ni los renders anteriores. TC sin verificar el 10/11 (el sitio del BCP no es accesible desde el entorno): se mantuvo el del 06/11/2026.
