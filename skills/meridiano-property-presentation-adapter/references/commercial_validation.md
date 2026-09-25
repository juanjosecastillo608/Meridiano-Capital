# Validación comercial y formato de la matriz

## `matriz.json`

```json
{
  "property": {
    "name": "Casa Villa Morra",
    "asset_type": "residencial",
    "operation": "venta",
    "audience": "comprador final",
    "meridiano_role": "intermediario"
  },
  "fields": [
    {"key": "precio", "value": "USD 250.000", "currency": "USD", "tax": "sin IVA informado",
     "unit": "USD", "category": "precio", "source": "ficha.pdf p.2", "source_rank": 5, "status": "confirmado"},
    {"key": "sup_cubierta", "value": "180", "unit": "m2", "category": "superficie",
     "source": "plano.pdf p.1", "source_rank": 3, "status": "confirmado"},
    {"key": "precio_m2", "value": "1.389", "currency": "USD", "tax": "sin IVA informado", "unit": "USD/m2",
     "category": "precio", "source": "calculado: precio / sup_cubierta", "source_rank": 5, "status": "calculado"}
  ],
  "calculations": [
    {"id": "precio_m2_check", "formula": "precio / sup_cubierta", "stated": "1.389", "tolerance_pct": 0.5}
  ]
}
```

- `key`: identificador válido (letras, números, guion bajo), porque las fórmulas lo usan.
- Una misma `key` puede aparecer varias veces (una por fuente); así se detectan las contradicciones.
- `category`: `precio`, `superficie`, `rentabilidad`, `condiciones`, `partes`, `legal`, `tecnica`, `contacto`, `moneda`, `operacion` (materiales), `entrega` (fecha de entrega: exigida en preventa) u otra libre.
- `tax`: siempre explícito para importes ("+ IVA", "IVA incluido", "exento", "sin IVA informado"). Nunca asumirlo.
- `numeric: false` para datos de texto (dirección, zonificación).
- `formula`: `+ - * / **`, paréntesis y `round/min/max/sum` sobre `key`s. Nada más.
- Las cifras se leen en formato es-PY ("11.000" = once mil; "5,50" = cinco con cincuenta). El script avisa cuando una lectura es ambigua.

## Qué verifica `validate_property_data.py`

- Estados válidos y fuente citada para todo dato no pendiente.
- Importes con moneda; alertas de monedas mixtas (no sumar sin tipo de cambio documentado).
- Superficies positivas; porcentajes entre 0 y 100; rentabilidades > 25 % marcadas para revisar.
- Contradicciones entre fuentes (por jerarquía o para confirmación).
- Recalcula cada `calculation`; si el valor declarado difiere más que la tolerancia → error.
- Cálculos que dependen de datos `inferido`/`pendiente` → `*_no_confirmable`: no se presentan como confirmados.
- Datos mínimos por operación (venta/alquiler: precio y superficie; preventa: + entrega; inversión: precio y rentabilidad).

## Cálculos típicos a declarar

- Alquiler mensual = superficie × canon por m²; expensas = superficie × expensas por m²; total = suma (misma base de IVA).
- Precio por m² = precio / superficie (indicar qué superficie: cubierta, total, propia, rentable).
- Totales y subtotales de tablas de tipologías; suma de cuotas = saldo del plan de pagos.
- Superficie desde dimensiones del plano (mostrarlo como cálculo, ver `source_priority.md`).
- Rentabilidad: solo si la fuente trae renta y precio; mostrar el método (bruta = renta anual / precio). Rentabilidad neta, TIR o plusvalía → skill `meridiano-rentabilidad` o el motor del repo, con sus supuestos; nunca improvisarlas.

## IVA y temas fiscales

No resolver criterios fiscales dentro de la presentación: mostrar el tratamiento que declara la fuente. Si el repo está disponible, las tasas vigentes están en `governance/decisions/DECISION_REGISTER.md` (D-001/D-045). Las cuestiones legales, fiscales, contables y migratorias se atribuyen al profesional correspondiente (abogado, escribano, contador), no a Meridiano.
