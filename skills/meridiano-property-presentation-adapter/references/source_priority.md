# Jerarquía de fuentes y contradicciones

Los archivos del usuario son la única fuente de datos de la propiedad. Nada de propiedades anteriores (Puerto Fénix, UON Calathea, Habitalis, Aura, WTC u otras) se usa como dato predeterminado: esos casos sirven solo como ejemplo de estructura o diseño.

## `source_rank` (menor = más autoridad)

| Rank | Fuente |
|---|---|
| 1 | Dato corregido directamente por el usuario en la conversación |
| 2 | Planillas comerciales vigentes y documentos contractuales (cotización firmada, lista de precios, contrato) |
| 3 | Planos y documentación técnica |
| 4 | Presentación fuente |
| 5 | Documentos complementarios (brochures, fichas, correos) |
| 6 | Texto extraído de imágenes (OCR, rótulos sobre fotos, capturas) |
| 7 | Inferencia visual (lo que "se ve" en una foto o se deduce) |

Si el usuario indica otra jerarquía para un caso, esa instrucción manda.

## Reglas

- Una inferencia (rank 7) nunca reemplaza en silencio un dato documental. Si solo existe la inferencia, el dato es `inferido` y no se presenta como hecho.
- Dos fuentes con **distinto rank** en contradicción: gana la de menor rank; `validate_property_data.py` la lista en `resolved_by_hierarchy` y el informe la muestra. Nunca silencioso.
- Dos fuentes con **igual rank** en contradicción:
  - Si el campo es material (`precio`, `superficie`, `rentabilidad`, `condiciones`, `partes`, `legal`, `tecnica`, `contacto`, `moneda`, `operacion`) → preguntar al usuario antes de cerrar la pieza (exit 3).
  - Si no es material → elegir el más reciente o el más específico, registrarlo como advertencia y seguir.
- Mantener las unidades originales. Una conversión (ha → m², pies → m) se muestra como conversión, junto al dato original.
- Superficie calculada desde dimensiones de un plano: se muestra como cálculo (fórmula y resultado exacto), separada de la cifra comercial redondeada, con la fuente de cada una. Ejemplo de estructura: "Medidas del plano 100,00 × 179,80 m → 17.980 m² (cálculo) · capacidad comunicada ≈ 18.000 m²".
- Una fecha de vigencia (validez de oferta, lista de precios) se conserva con su referencia. No extender ni reinterpretar plazos.
- Datos de contacto: los de la fuente solo si están autorizados para uso comercial; los de Meridiano, desde `brand_tokens.json` o el repo. Un contacto antiguo en la fuente (otro correo u otra inmobiliaria) se reemplaza y se registra el cambio.
