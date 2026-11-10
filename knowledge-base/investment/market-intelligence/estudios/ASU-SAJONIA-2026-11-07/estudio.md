# Estudio de mercado por actividad — Edificio Sajonia (07/11/2026)

**Sujeto:** edificio de 803 m² en Av. Ygatimí, zona Palacio de Justicia, Sajonia, Asunción. Se evalúa para tres usos que, según el founder, **no se pueden mezclar** por reglamentación:
- una clínica de consultorios;
- oficinas para abogados;
- departamentos de alquiler.

**Estudio anterior:** este estudio complementa `ASU-SAJONIA-2026-10-15`, que sigue vigente para oficinas y vivienda.

**Ficha técnica del estudio:**
- **TC:** Gs 6.480,35 (BCP, cotización referencial del 06/11/2026).
- **Confianza:** MEDIA-BAJA.
- **Datos estructurados:** `estudio.json`.

## Método
- Búsqueda web por actividad en InfoCasas, Jariton e Inmobiliaria Cazzola, más prensa (Última Hora) y el listado de establecimientos del Ministerio de Salud.
- No se guardan teléfonos, correos ni nombres de anunciantes particulares.
- Las rentabilidades que publiquen los avisos no se cargan como dato (D-099).

## 1. Consultorios médicos

| ID | Aviso | Barrio | m² | Gs por mes | Gs/m² | En estadística |
|---|---|---|---:|---:|---:|---|
| K1 | Consultorio en edificio médico profesional, 4.º piso | San Roque | 70 | 1.750.000 | 25.000 | Sí |
| K2 | Consultorio en clínica; incluye secretaria, limpieza y servicios básicos | Bernardino Caballero | 120 | 2.150.000 | 17.917 | Sí |
| K3 | Consultorio, plazo mínimo de 6 meses | Villa Aurelia | 148 | 5.000.000 | 33.784 | Sí |
| K4 | Consultorio amoblado y equipado | Villa Aurelia | — | 4.500.000 | — | No: sin superficie, equipado |
| K5 | Consultorio en medical center | Ciudad Nueva | 193 | 6.000.000 | 31.088 | No: precio no confirmado |
| K6 | Consultorio en edificio médico | Barrio Jara | 20 | 3.650.000 | 182.500 | No: dato inconsistente |

**Contexto (no entra en estadística):**
- Una clínica alquila consultorios por hora: Gs 60.000 de mañana y Gs 80.000 de tarde, con IVA y expensas incluidos.
- Otro aviso ofrece consultorios montados por turno, a Gs 440.000–660.000 por mes por cada día semanal. Este dato surgió de un resumen de búsqueda y su enlace no se conservó.

**Lectura:**
- **Sin oferta en Sajonia:** no apareció ningún consultorio publicado en el barrio, así que todos los comparables son de ámbito secundario.
- **Base del modelo (supuesto de Meridiano):** un consultorio chico, de 15 a 18 m², en un edificio dedicado, vacío y sin servicios, se alquila en **Gs 1,5 M por mes**.
- **Por qué ese valor:** queda por debajo de K1, que tiene 70 m², y del alquiler a tiempo completo que implican los turnos de clínica.

## 2. Entorno de salud
- **Ex Hospital de Clínicas:**
  - El hospital se trasladó a San Lorenzo.
  - El edificio histórico de Sajonia conserva atención ambulatoria parcial; por ejemplo, el servicio de tuberculosis de lunes a viernes de 7 a 12 (Última Hora, julio de 2026).
- **Centro de Salud N.º 8 Sajonia (MSPyBS):** en Díaz de Guzmán y Orihuela.
- **Hospital de Barrio Obrero:** está en el barrio vecino y atiende unos 1.000 pacientes por día, con sobrecarga, según la Defensoría del Pueblo (Última Hora).
- **Lectura:**
  - El barrio tiene actividad de salud, pero perdió su gran generador de demanda médica.
  - No se midieron distancias a pie: queda pendiente con el geocoding (SK-16).

## 3. Oficinas para abogados (Palacio de Justicia)

| ID | Aviso | Zona | m² | Gs por mes | Gs/m² | En estadística |
|---|---|---|---:|---:|---:|---|
| O5 | Oficina | Sajonia | 30 | 1.100.000 | 36.667 | Sí |
| O6 | Local apto consultorios u oficinas, 1 ambiente y 2 baños | Zona CPJ | 117 | 7.000.000 | 59.829 | Sí |
| O7 | Casa de 15 ambientes ofrecida para bufete de abogados | Sajonia, cerca del Palacio | 629 | 6.500.000 | 10.334 | No: casa sin adecuar |

**Lectura:**
- La cercanía al Palacio de Justicia se usa como argumento comercial para estudios jurídicos.
- Las oficinas chicas logran más por m² que las plantas grandes:
  - O5: Gs 36.700/m².
  - O1 (estudio del 15/10): Gs 84.400/m².
  - O3, planta de 160 m²: Gs 46.350/m².
- El modelo mantiene la base de Gs 45.000/m².

**Competidor en la venta:** el V7 es un edificio de 3 niveles a pocas cuadras del Palacio, publicado en USD 250.000 sin superficie informada.

## 4. Departamentos

| ID | Aviso | Zona | m² | Gs por mes | En estadística |
|---|---|---|---:|---:|---|
| R5 | 1 dormitorio | Sajonia, zona ex Clínicas | 65 | 1.785.000 | Sí |
| R6 | 2 dormitorios | Sajonia, zona Facultad de Medicina | 40 | 1.890.000 | Sí (superficie a verificar) |

**Lectura:** estos avisos confirman la banda baja de 1 dormitorio. El modelo mantiene las bases del estudio del 15/10.

## Limitaciones
- Son precios pedidos, no contratos, y la disponibilidad no está confirmada. Varias fichas no informan la fecha de publicación.
- Los enlaces de O6, O7 y K6 no se conservaron: el dato surgió de resúmenes de búsqueda.
- La restricción de no mezclar consultorios con oficinas o viviendas la informó el founder (2026-11-07). Debe confirmarse con la habilitación del Ministerio de Salud y con la Municipalidad.
