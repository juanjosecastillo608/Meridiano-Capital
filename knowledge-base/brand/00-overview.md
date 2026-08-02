```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-capital-identity/SKILL.md
Dominio: BRAND
```

# Overview — Sistema Operativo de Marca de Meridiano Capital

## Principio rector

> Toda pieza, diseño, experiencia, comunicacion o contenido que represente a la marca debe respetar y aplicar la identidad definida en esta base de conocimiento.

El **Manual de Marca oficial** (`Meridiano_Capital_Brand_Guidelines_v1.docx`, guardado en `inventory/_raw-copies/meridiano-capital-identity/assets/`) es la fuente de autoridad principal de todo lo que sigue. Esta base de conocimiento organiza, interpreta y aplica ese manual — nunca lo contradice ni inventa reglas oficiales nuevas.

El objetivo no es "recordar el manual". El objetivo es sostener un **Brand Operating System** que mantenga la marca coherente en todos los puntos de contacto: **Estrategia → Identidad → Diseño → Comunicacion → Digital → Marketing → Ventas → Experiencia.** La marca debe sentirse como una sola marca, sin importar quien diseñe, que herramienta se use, o que tipo de pieza se este creando.

Este dominio (`knowledge-base/brand/`) cubre identidad, posicionamiento, personalidad, tono, narrativa, arquitectura de marca, reglas y elementos visuales. Los dominios operativos de aplicacion por canal (digital, presentaciones, redes sociales, publicidad, proyectos inmobiliarios, prompt engine, matriz de decision) vivian en los modulos 09-15 del skill original y no forman parte de esta migracion — quedan disponibles en las copias raw en `inventory/_raw-copies/meridiano-capital-identity/references/` si se necesitan luego.

## El sistema de estados: OFICIAL vs. [EXTENSION]

Esta es la regla de gobernanza mas importante de todo el sistema de marca, y se preserva integramente porque el resto del sistema depende de ella.

Cada archivo de esta base de conocimiento (y cada seccion dentro de un archivo mixto) marca su contenido con uno de estos dos estados:

- **OFICIAL** — viene literal o casi literal del Brand Guidelines v1.0. No se contradice, no se reinterpreta, no se "mejora" por iniciativa propia.
- **[EXTENSION]** — el manual no cubre ese caso explicitamente. Es una solucion coherente derivada de los principios generales de marca (ADN de marca, Identidad Visual, Sistema Cromatico), presentada **siempre como recomendacion**, nunca como regla oficial cerrada.

### Protocolo obligatorio cuando una decision no esta definida en el manual

1. **Identificar** explicitamente que la regla no esta definida en el Brand Guidelines oficial.
2. **Proponer** una solucion coherente usando los principios generales de marca (ADN, arquetipo, paleta, tono).
3. **Indicar con claridad** que se trata de una recomendacion o extension del sistema, no una regla oficial — usar literalmente la etiqueta "[EXTENSION]" o la frase "esto es una recomendacion, no una regla oficial del manual".
4. **Nunca** presentar esa recomendacion nueva como si fuera una regla oficial ya establecida.

Este protocolo aplica sin excepcion, incluso cuando la extension parezca obvia o de sentido comun.

## Regla de prioridad (para resolver contradicciones)

Cuando existan contradicciones entre fuentes o entre reglas, resolver siempre en este orden:

1. **Manual de Marca oficial** (`Meridiano_Capital_Brand_Guidelines_v1.docx`)
2. **Sistema de identidad visual** (logo, tipografia, color)
3. **Sistema de identidad verbal** (tono, mensajes)
4. **Estrategia y posicionamiento** (ADN de marca)
5. **Reglas especificas de cada canal**
6. **Recomendaciones creativas** ([EXTENSION] en cualquier modulo)

**Una recomendacion creativa nunca puede contradecir una regla oficial.** Si una idea creativa entra en conflicto con una regla de nivel 1-4, la idea se ajusta o se descarta — no la regla.

## Resultado esperado

El resultado de aplicar este sistema nunca deberia ser "una pieza que sigue reglas" — deberia ser una pieza que un director de marca de Meridiano Capital firmaria sin dudar, y que se siente inconfundiblemente parte del mismo sistema que el sitio web, el brand book y el deck de inversores ya construidos. La prioridad absoluta es mantener consistencia, reconocimiento, diferenciacion y percepcion de valor de la marca — por encima de la conveniencia de producir algo rapido o generico.

**No improvisar reglas oficiales. No contradecir el Manual de Marca. Si algo no esta definido, decirlo con claridad y proponer una solucion coherente identificada como recomendacion.**

## Gobernanza

Fuente original: skill v1.1, reestructurada en 20 modulos a partir de `Meridiano_Capital_Brand_Guidelines_v1.docx` v1.0. Si el Brand Guidelines se actualiza, esta base de conocimiento debe actualizarse en el mismo momento. Responsable de marca: **Juan Jose Castillo** o quien el designe.

## Indice de archivos de este dominio

| Archivo | Contenido | Estado predominante |
|---|---|---|
| `01-adn-de-marca.md` | Brand Essence, Brand DNA (4 pilares), Brand Promise, arquetipo, Golden Circle, manifiesto, mision/vision/valores, fundador, arquitectura de marca (resumen) | OFICIAL |
| `02-identidad-verbal.md` | Tono de voz, sistema de mensajes (3 capas), posicionamiento formal, reglas de redaccion por formato, frases prohibidas | OFICIAL + [EXTENSION] |
| `03-identidad-visual.md` | Concepto del isotipo (el mojon), archivos fuente, versiones del logo, clear space, tamaño minimo, usos correctos, las 6 violaciones prohibidas | OFICIAL |
| `04-tipografia.md` | Lora + Poppins (Meridiano), Poppins unica (Urbannit), jerarquia de tamaños, tracking/interlineado | OFICIAL |
| `05-sistema-cromatico.md` | Paleta Meridiano (5 colores), paleta Urbannit (4 colores), accesibilidad WCAG, tonos utilitarios derivados, justificacion cultural | OFICIAL |
| `06-sistema-grafico.md` | Familia geometrica, iconografia, divisores, numeracion, supergrafismos, que NO forma parte del sistema | [EXTENSION] |
| `07-direccion-de-arte.md` | Referencia de nivel, mood general, que SI/NO representa a la marca, diferencia por sub-marca | [EXTENSION] |
| `08-sistema-de-imagen.md` | Reglas por categoria: inmobiliaria, arquitectonica, interiores, exterior/urbanismo, personas, IA, renders, video, motion graphics | [EXTENSION] |
| `09-cierres-y-firmas.md` | Firma canonica, estandar de cierre de documento, frase de posicionamiento, origen de clientes, checklist | [EXTENSION] |
| `10-arquitectura-meridiano-urbannit.md` | Modelo Endorsed Brand, reglas de convivencia, lockup combinado, sintesis comparativa, datos operativos de Urbannit | OFICIAL + datos operativos auditados |
