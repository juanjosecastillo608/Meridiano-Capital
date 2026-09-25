# Proyecto: Centro Logístico Puerto Fénix (comercialización B2B)

Naves industriales en alquiler dentro del complejo portuario Puerto Fénix (Mariano Roque Alonso, Paraguay), comercializadas por Meridiano Capital. Puerto Fénix es el activo ofrecido; Meridiano Capital actúa como comercializador.

| Carpeta | Contenido |
|---|---|
| `fuente/` | Presentación v7 aprobada (contenido, cálculos e imágenes). Solo lectura, nunca editar |
| `entregables/` | **Para clientes de Meridiano:** presentación final `.pptx` (editable) y `.pdf`, `revision/` (PNG + vista general) y `VALIDACION_PRESENTACION_PUERTO_FENIX.md` |
| `entregables/para_colegas/` | **Para colegas del sector (marca blanca, D-099):** `.pptx` y `.pdf` sin datos de Meridiano, listos para reenviar. Revisión en `entregables/revision_colegas/` y control en `entregables/VALIDACION_PUERTO_FENIX_COLEGAS.md` |

**Regenerar la presentación** (por ejemplo, si cambia un dato):

```bash
cd production/generadores && npm install && node build_puerto_fenix_presentacion.js            # versión clientes
node build_puerto_fenix_presentacion.js --colegas                                              # versión colegas
```

Después, exportar el PDF y volver a correr el QA descrito en el informe de validación. Para editar el PPTX a mano hacen falta las fuentes Fraunces y Poppins (Google Fonts).

Firma y cierre según **D-096**: "Broker Inmobiliario" (captación de propiedades en alquiler) + pie institucional "Operadores técnicos y legales de inversiones inmobiliarias". Ubicación: https://maps.app.goo.gl/jHo2dQB1tqhid7nAA
