# Proyecto: Centro Logístico Puerto Fénix (comercialización B2B)

Naves industriales en alquiler dentro del complejo portuario Puerto Fénix (Mariano Roque Alonso, Paraguay), comercializadas por Meridiano Capital. Puerto Fénix es el activo ofrecido; Meridiano Capital actúa como comercializador.

| Carpeta | Contenido |
|---|---|
| `fuente/` | Presentación v7 aprobada (contenido, cálculos e imágenes). Solo lectura, nunca editar |
| `entregables/` | Presentación final `.pptx` (editable) y `.pdf` (distribución), `revision/` (PNG por diapositiva + vista general) y `VALIDACION_PRESENTACION_PUERTO_FENIX.md` |

**Regenerar la presentación** (por ejemplo, si cambia un dato):

```bash
cd production/generadores && npm install && node build_puerto_fenix_presentacion.js
```

Después, exportar el PDF y volver a correr el QA descrito en el informe de validación. Para editar el PPTX a mano hacen falta las fuentes Fraunces y Poppins (Google Fonts).

Firma y cierre según **D-096**: "Broker Inmobiliario" (captación de propiedades en alquiler) + pie institucional "Operadores técnicos y legales de inversiones inmobiliarias". Ubicación: https://maps.app.goo.gl/jHo2dQB1tqhid7nAA
