# Edificio Humaitá (centro histórico de Asunción) — presentación y modelo v1

**El inmueble:**
- Casona de 2 plantas sobre la calle Humaitá, a metros de la Av. Colón.
- 541 m² de terreno (12,30 × 43 m).
- Distribución: edificio principal con 3 ambientes y un salón con baños sexados, y un área posterior con 13 habitaciones con baño alrededor de un patio.
- **Precio de venta: USD 160.000**, fijado por el founder el 09/11/2026. Antes se ofrecía en Gs 950.000.000.
- Está desocupada y necesita remodelación.
- **Demanda cercana**, según el founder: el Hospital Militar y la Universidad Autónoma de Asunción.

**Entregables:**
- `Edificio_Humaita_Meridiano_Capital_v1.pdf`: presentación para el inversor, 25 láminas desde el 09/11/2026. Se sumaron fotos de accesos y habitaciones, tres conceptos de fachada, un antes/después y la habitación tipo con patio. Compara tres usos:
  - A · Departamentos y salones: tabla de 19 unidades del propietario.
  - B · 20 habitaciones en alquiler mensual: planilla del propietario.
  - C · Hostel de 20 habitaciones con renta por noche.
- `entregables/Modelo_Inversion_Edificio_Humaita.xlsx`: modelo de Excel con fórmulas vivas, basado en la planilla del propietario. Tiene 7 hojas:
  - Léame.
  - Supuestos, con las entradas editables.
  - Inversión, con los ítems de la planilla y las cantidades ligadas a la superficie y a las habitaciones.
  - Ingresos A, con la tabla de unidades.
  - Resultados, con bruta, neta, precio máximo, alquiler requerido, flujo de caja y TIR.
  - Sensibilidad.
  - Observaciones a la planilla original.
- **Regeneración:** `python projects/meridiano-capital/presentaciones/build_presentaciones.py edificio-humaita` corre el modelo, el deck y el Excel (`fuente/build_entregables.py`, recalculado con LibreOffice). Se verificó que el Excel reproduce las cifras del deck.
- **Estudio de mercado (D-100):** `knowledge-base/investment/market-intelligence/estudios/ASU-CENTRO-HUMAITA-2026-11-08/`.

- `web/index.html`: presentación web autocontenida, con imágenes y fuentes locales. Se construyó el 09/11/2026 tomando como base el `index.html` del paquete que envió el founder, con la marca de Meridiano. Incluye:
  - Aviso fijo: «Propiedad ofrecida en su estado actual. Imágenes de transformación conceptuales.»
  - Navegación con la sección activa.
  - Filtros por ambiente, por tipo de imagen (fotografía o concepto IA) y por alternativa de fachada.
  - Fichas de materiales con paletas HEX, alcance y restricciones.
  - Comparador antes/después.
  - Tabla de inversión tomada de `model.json`.
  - QR de la ubicación.
  - Estilos de impresión a PDF.
  - Reemplazo local de imágenes con registro trazable, que se puede exportar como JSON. Los originales de `assets/` no se tocan.
  - Se genera con `fuente/build_web.py`, que llama `build_entregables.py`. Ese script corre solo en la regeneración completa (`build_presentaciones.py` sin argumentos) o a mano.
  - Revisado con Chromium en escritorio y en móvil: sin errores de consola y sin desborde horizontal.

**Ubicación (QR):** https://maps.app.goo.gl/4nMui8uvZ9RYb6EeA, verificado al decodificarlo.
- Referencias de demanda, enviadas por el founder: Hospital Militar (https://maps.app.goo.gl/nLyr38rbR7LSMgc58) y UAA (https://maps.app.goo.gl/L3SDhyebvBSkzJfA6).
- Ningún enlace se pudo abrir desde este entorno: las distancias quedan por medir.

**Paquete del founder (09/11/2026): diferencias con este proyecto**
- **Precio:** el paquete indicaba USD 160.000 y el founder lo confirmó el 09/11/2026. Reemplaza a los Gs 950 M anteriores.
- **Nombre:** se usa "Humaitá", el nombre de la calle. El paquete dice "Humitá".
- **Métricas:** el paquete pide no publicar ROI neto. Se mantiene el criterio de Meridiano: neta estimada con hipótesis explícitas y aviso de "no garantizada".
- **Imágenes:** los renders del paquete (`fuente/img/zip/`) se rotulan como "Concepto IA" en el deck y en la web.
- **No versionados:** `datos_proyecto.json` y `planilla.jpeg`, porque contienen un nombre propio en la columna de estado.

**Material no versionado:**
- La planilla original del propietario: se reprodujeron sus ítems y precios en el modelo nuevo.
- La captura de la tabla de unidades: su columna "Estado" incluye un nombre propio, y el edificio está desocupado.

## Resultados (precio USD 160.000; alquileres al TC Gs 6.480,35 del 06/11/2026)
| | A · Departamentos y salones | B · 20 habitaciones mensuales | C · Hostel |
|---|---|---|---|
| Obra total | USD 118.168 | USD 202.309 | USD 218.809 |
| Ingreso bruto mensual | Gs 15,6 M | Gs 28,0 M | Gs 47,7 M (USD 22 × 55%) |
| Bruta | 10,38% | 14,31% | 23,32% |
| Neta final | 5,00% | **6,57%** | 3,49% |
| TIR base a 5 años | 6,9% | **7,5%** | 5,2% |

**Lectura:**
- **B es la mejor opción**, con la mejor neta y la mejor TIR.
- **La bruta del hostel (C) engaña:** las plataformas, la limpieza y el personal se llevan casi todo. Para igualar a B necesita alrededor de 69% de ocupación sostenida.
- **A es la más simple**, con la obra más liviana.
- **Precio máximo para un 10% bruto con A:** unos USD 170.706. A USD 160.000, A y B ya superan el 10% bruto.

## Supuestos principales (a validar)
- **Superficie:**
  - El aviso dice 300 m² construidos; la tabla de unidades suma 610 m² y la planilla supone 600 m².
  - El presupuesto de B y C es el de la planilla (600 m², 20 habitaciones). En el Excel se reescala cambiando la superficie y las habitaciones.
- **Alquileres:**
  - A: alquiler proyectado de la tabla del propietario, dentro de la banda del centro.
  - B: Gs 1,4 M por habitación todo incluido, con vacancia del 10% y los gastos del edificio de la planilla (USD 1.470 por mes).
  - C: USD 22 por noche, 55% de ocupación, 15% de plataformas, 12% de limpieza y 3 recepcionistas.
- **Obra de A:** 50% de la tabla básica de remodelación sobre 511 m² y USD 6.000 por unidad nueva.
- **IVA:** 5% en vivienda y habitaciones, 10% en salones y hostel (D-045). IRE de 10%.

## Correcciones a la planilla original (detalle en la hoja Observaciones)
1. **Precio:** la planilla usa USD 175.000; el precio vigente es USD 160.000.
2. **Tipo de cambio:** estaba fijo en Gs 6.000.
3. **Superficie y habitaciones:** no coinciden con el aviso.
4. **Rentabilidad circular:** fija el alquiler para obtener 14% y después "verifica" ese mismo 14%. El alquiler resultante, unos Gs 2,1 M todo incluido, está por encima del mercado del centro.
5. **Sin IVA, IRE ni administración** en la rentabilidad.
6. **Gastos de más:** honorarios del 5% a cargo del comprador y 3% de gastos financieros sin respaldo.
7. **Sin plazo de obra ni TIR.**

## Pendiente
- Planos y mensura: superficie real y cantidad de habitaciones.
- Inspección de techos, humedad e instalaciones.
- Normativa del centro histórico.
- Medir las distancias al Hospital Militar y a la UAA.
- Sondear la demanda de habitaciones: residencias estudiantiles, convenios con la UAA y alojamiento de familias de pacientes.
- Para C: habilitación turística y operador.

## Registro de cambios
- **2026-11-09:**
  - Precio fijado en USD 160.000; regenerados el deck, la web y el Excel.
  - Revisión de la brecha bruta → neta registrada como P-009, pendiente de aprobación (`knowledge-base/investment/methodologies/revision-bruta-neta-2026-11-09.md`).
  - Las cifras del deck **no** aplican todavía esa propuesta.
