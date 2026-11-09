# Clínica Magnificat (Asunción) — presentación, modelo y planilla para el propietario v1

**El inmueble:** clínica pediátrica en funcionamiento en Asunción. El barrio está por confirmar; según las fotos, es una esquina con cocheras sobre dos calles.
- **Precio de venta:** USD 500.000. **Venta rápida:** USD 420.000 (founder, 09/11/2026).
- **Planta baja y primer piso:** 11 consultorios con baño propio, todos alquilados, sin mobiliario. Cinco tienen instalaciones para odontología.
- **Alquiler:** Gs 2.500.000 por consultorio y por mes, con IVA y expensas incluidos.
- **Gastos informados:**
  - Administración: Gs 10.450.000 por mes, con secretaria y sin desglose.
  - Impuesto inmobiliario: Gs 45 M por año.
- **Segundo piso:** departamento de la propietaria, que lo usa dos años más; no genera renta.
- **Ascensor:** no está instalado. El hueco y la estructura están previstos, según el propietario.
- **Ubicación (QR):** https://maps.app.goo.gl/kKoH14evyzGWSrUP9, verificado al decodificarlo. El enlace no se pudo abrir desde el entorno.

## Entregables
- `Clinica_Magnificat_Meridiano_Capital_v1.pdf`: presentación para el inversor (16 láminas). Las láminas de fotos se agregan solas cuando estén en `fuente/img/` con su `leyendas.json`.
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
| Etapa 3 (mes 25+): 4 consultorios nuevos, ilustrativo | Gs 45 M | 14,73% | 7,33% | 8,52% |

- **TIR base a 5 años:** 9,1% a USD 500.000 y 10,1% a USD 420.000. Sin la reconversión del segundo piso: 7,8% y 8,6%.
- **Peso de los gastos:** la administración es el 38% de la facturación y el impuesto inmobiliario el 13,6%. Si el impuesto fuera la mitad, la neta de hoy sería 3,89% a USD 500.000.

## Supuestos principales (a validar)
- **Alquileres:** +10% al renovar (Gs 2,75 M) y +10% con ascensor y mejoras (Gs 3,0 M). El techo de mercado está en Gs 3,85 M con IVA, para un consultorio con secretaria en Villa Morra.
- **Administración:** baja 15% después de la auditoría.
- **Inversiones:**
  - Ascensor de 3 paradas: Gs 58 M + 10% por cotización vencida + Gs 15 M de obra eléctrica y civil.
  - Mejoras: Gs 35 M.
  - Mantenimiento del ascensor: Gs 500.000 por mes desde el año 2.
- **Reconversión del segundo piso:**
  - Entre 3 y 5 consultorios; se usan 4 a modo ilustrativo, a definir con el plano.
  - USD 12.000 por consultorio y +10% de administración.
- **Base D-101:**
  - IVA 10% incluido en el alquiler.
  - Crédito fiscal sobre el 40% de la administración (supuesto: la nómina no genera crédito) y sobre la reserva de mantenimiento del 2%.
  - Vacancia del 5%.
  - IRE con depreciación.

## Material no versionado
El `index.html`, el Excel y el prompt del paquete, y los dos presupuestos de ascensor en PDF, que tienen datos de contacto del proveedor. Sus cifras están en el modelo y en la lámina 9.

## Pendiente
1. ZIP de fotos y planos: se incorporan como láminas y en la galería web.
2. Barrio del inmueble, para ajustar la comparación de mercado.
3. Planilla de desglose completada por el propietario, boleta del impuesto, contratos y cobranza.
4. Estado de los contratos: según el paquete, están vencidos hace cuatro meses. Revisión con el abogado.
5. Cotizaciones actualizadas del ascensor y factibilidad técnica.
6. Plano y superficie del segundo piso, para definir cuántos consultorios entran.
