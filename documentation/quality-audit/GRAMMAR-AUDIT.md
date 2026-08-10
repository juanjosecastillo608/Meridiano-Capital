```
Estado: AUDIT ONLY — hallazgos señalados, ningún documento corregido todavía
Parte de: FINAL-AUDIT.md
```

# Grammar & Expression Audit

**Contexto importante**: el `knowledge-base/` existente (48 documentos) ya pasó por un proceso editorial cuidadoso en sesiones anteriores — la prosa es limpia, consistente y sin errores relevantes. Este archivo no repite esa verificación línea por línea (sería reescribir sin mejora objetiva, contra la regla del propio brief, sección 17). Se concentra en los **9 archivos nuevos**, que sí son material crudo/borrador, y en un puñado de inconsistencias de tono detectadas por comparación cruzada.

## Hallazgos reales (no genéricos)

| # | Archivo | Hallazgo | Severidad |
|---|---|---|---|
| 1 | `Modelo Paraguay para Inversión extranjero.docx` | Encabezado "Fiscalidad en Paraguay y sus ventajas respecto a España-Italia-Estados Unidos-Chile y Argentina" promete comparación con 5 países; el cuerpo del texto solo desarrolla la comparación con España. Desajuste entre título y contenido | Media |
| 2 | `Modelo Paraguay para Inversión extranjero.docx` | Quedan dos marcadores de trabajo sin resolver, literales en el texto: "Rentabilidad de la Inversión ( FALTA DESARROLLAR ESTE TEMA)" y "5- Bancos en Paraguay y su Legislación ( FALTA DESARROLLAR ESTE TEMA)". No son errores de redacción — son recordatorios de borrador que no deben llegar a ninguna pieza publicada | Alta (si se usa el doc sin depurar) |
| 3 | `Modelo Paraguay para Inversión extranjero.docx` | Las secciones "residencia temporal" y "residencia permanente" repiten casi el mismo listado de 6-7 pasos con mínima diferenciación real — se puede sintetizar en una sola tabla comparativa temporal vs. permanente sin perder información | Baja — mejora de claridad, no error |
| 4 | `Paraguay vs 🇨🇱 Chile.docx` | Título/encabezado usa un emoji de bandera (🇨🇱) en un documento de análisis formal — la identidad verbal oficial (`brand/02-identidad-verbal.md`) permite como máximo un emoji por pieza *y solo si aporta*; un emoji de bandera en un título de análisis comparativo no cumple claramente ese criterio | Baja |
| 5 | Los 4 documentos "Paraguay vs. X" | Terminan con una línea de cierre en formato "👉 En síntesis: ..." — el emoji 👉 se repite en los 4 documentos como recurso retórico. Es un patrón de escritura de IA genérico (`ai/06` y la identidad verbal advierten contra "lenguaje genérico de IA") más que un recurso de marca Meridiano | Baja |
| 6 | `Propuesta de trabajo para propietarios.pdf` / `Propuesta de Gestión de Alquiler Temporal.pdf` | Ninguno de los dos usa consistentemente el voseo paraguayo ya establecido en el resto del material de marca (ej. "Agendá una llamada", "Comprás tu unidad" en los decks ya generados) — usan formas más neutras ("tu propiedad", "necesitamos"). No es incorrecto, pero es una variación de tono frente al resto del sistema | Baja |
| 7 | `Perfil Profesional y Plan de Negocio.docx` | Redacción de calidad consultoría, sin errores relevantes. Único señalamiento: usa profusamente corchetes `[ASÍ]` para datos a completar — coherente con su propósito de plantilla de trabajo, no es un defecto | — (informativo) |

## Lo que NO se encontró (y vale la pena decirlo)

- Sin errores ortográficos relevantes en ningún archivo.
- Sin anglicismos innecesarios — los términos técnicos en inglés que aparecen (hurdle, carried interest, Investor Pass) son términos de industria ya adoptados y explicados en su primera aparición, consistente con la regla oficial de identidad verbal.
- Sin afirmaciones sin fundamento del tipo "somos los mejores" — el material nuevo respeta la regla de frases prohibidas.
- Sin inconsistencia de tiempos verbales relevante.

## Recomendación

No se justifica una pasada de corrección línea por línea de estos 9 archivos hoy — son en su mayoría material de trabajo/borrador aportado por el usuario (parte del propósito explícito de "verificar antes de ingresar al sistema de Meridiano Capital"). La corrección editorial real debe aplicarse **después** de que se resuelvan las preguntas de arquitectura de marca (sección 8 de `FINAL-AUDIT.md`) y solo sobre las partes que efectivamente se incorporen al `knowledge-base/` — corregir texto que después se descarta es esfuerzo perdido.
