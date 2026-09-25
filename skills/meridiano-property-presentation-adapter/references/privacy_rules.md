# Datos personales y confidencialidad

Si el repo Meridiano-Capital está disponible, la política completa es `governance/PII_POLICY.md` y prevalece sobre este resumen.

## Nunca en una presentación comercial

- Documentos de identidad (CI, DNI, pasaporte, RG/CPF) y sus números.
- Firmas, sellos personales, escaneos de documentos firmados.
- Datos bancarios personales (cuentas, CBU/IBAN, alias).
- Contratos completos o transcripciones literales de documentos legales.
- Datos de inquilinos u ocupantes (nombre, contacto, montos individuales, historial).
- RUC de personas físicas; razón social de sociedades del cliente cuando no sea necesaria para la oferta.
- Sociedades internas de Meridiano protegidas por la regla de invisibilidad (p. ej. Campo Agreste S.A.).
- Cualquier dato confidencial que no haga falta para la decisión comercial.

## Cómo proceder

1. Separar el material interno (contratos, identidades, datos bancarios) del material comercial desde la Fase 2: esos datos no entran en `matriz.json` salvo como `partes` anonimizadas ("Propietario: persona física") si hace falta.
2. Contacto: el de Meridiano (`brand_tokens.json`) y, del tercero, solo el que la fuente presenta para uso comercial.
3. Fotos: evitar rostros identificables de terceros y datos visibles (patentes, documentos sobre escritorios). Si aparecen, recortar proporcionalmente o elegir otra foto; registrarlo.
4. `build_validation_report.py` hace un barrido (CI, RUC, cuentas, correos y teléfonos no autorizados). Es una ayuda, no una garantía: **leer el contexto de cada coincidencia** (un número puede ser una calle, un lote o una cifra comercial) y decidir.
5. Las notas del orador también se distribuyen con el `.pptx`: aplicar las mismas reglas.
6. Dentro del repo, nunca copiar material de `contracts/cases/` a una pieza comercial.
7. La versión para colegas (D-099) sale sin notas del orador y sin metadatos de Meridiano: las notas suelen tener trazabilidad interna (fuentes, decisiones, preguntas) que no debe circular fuera de Meridiano.
