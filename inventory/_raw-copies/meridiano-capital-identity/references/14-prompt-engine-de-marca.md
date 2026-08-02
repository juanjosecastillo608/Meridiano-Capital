# Modulo 14 — Prompt Engine de Marca

**Estado: [EXTENSION]** — sistema construido para traducir automaticamente los Modulos 05 (Color), 07 (Direccion de Arte) y 08 (Sistema de Imagen) en prompts de generacion. Usar este motor cada vez que se necesite un prompt para imagen, edicion fotografica, render, arquitectura, interiores, lifestyle, campaña publicitaria, video o motion graphics.

## Como funciona el motor
Todo prompt de marca se arma combinando 5 bloques. Los bloques 2-5 son **fijos** (se repiten en todo prompt de Meridiano Capital salvo que la pieza sea de Urbannit, en cuyo caso se usa el set de bloques "Urbannit" al final de este archivo). El bloque 1 es el unico que cambia segun el pedido especifico.

1. **Sujeto especifico** — lo que pide el usuario (ej. "fachada de edificio en construccion", "retrato del fundador", "interior de departamento amoblado").
2. **Direccion de arte** (Modulo 07) — luz calida/hora dorada, composicion editorial, contexto de Asuncion real.
3. **Paleta** (Modulo 05) — los HEX exactos traducidos a descripcion de color-grading.
4. **Nivel de lujo / tono editorial** — precision silenciosa, nunca ostentacion obvia (Modulo 07).
5. **Negative / avoid list** — lo que nunca debe aparecer (Modulo 07, lista negativa).

## Bloques fijos — Meridiano Capital

**Bloque 2 (direccion de arte):**
`warm golden-hour natural light, editorial architectural photography style, authentic Paraguayan urban context, shot on medium format camera, shallow depth of field, candid feel, no people looking directly at camera`

**Bloque 3 (paleta):**
`color grading favoring deep petrol blue-green shadows (#14313A), warm terracotta earth tones (#8B3323), muted gold accents (#C9982E) used sparingly, soft cream highlights (#F3EDE3)`

**Bloque 4 (nivel de lujo/tono):**
`quiet premium sophistication, precision over ostentation, real construction materials (exposed concrete, wood, brick), documentary editorial mood — not corporate stock`

**Bloque 5 (negative/avoid — aplicar siempre que la herramienta lo permita):**
`corporate stock photo, generic handshake, neon colors, cold blue studio lighting, futuristic sci-fi render, generic glass skyscraper skyline, oversaturated colors, cartoonish, metaverse aesthetic, fake posed smile, obvious luxury cliches (sports cars, champagne, watches)`

## Templates listos por caso de uso

### Fachada / construccion / arquitectura
```
[Bloque 1: ej. "Modern residential building facade under construction in Asuncion, Paraguay, showing exposed concrete structure"]
+ Bloque 2 + Bloque 3 + Bloque 4
--no [Bloque 5]
```

### Retrato (fundador, equipo)
```
Professional editorial portrait of a real estate developer in his 50s, confident and warm expression,
natural window light, shot in an office or construction site in Asuncion, Paraguay,
smart-casual attire, [Bloque 3], shallow depth of field, documentary style
--no artificial studio lighting, no forced smile, no green screen, [Bloque 5]
```

### Interiores (propiedad Meridiano — venta/inversion)
```
[Bloque 1: ej. "Bright unfurnished apartment interior, modern finishes"]
+ Bloque 2 (enfasis en luz natural difusa) + Bloque 3 + Bloque 4, aspirational but neutral styling
--no [Bloque 5]
```

### Renders / visualizacion arquitectonica
```
Architectural render of [Bloque 1 — proyecto especifico], daytime version,
[Bloque 3 applied as postproduction color grade to sky and shadows], real Asuncion urban context and vegetation,
discreet human silhouettes for scale (not hyperrealistic figures), photorealistic but warm, not sterile CGI look
--no floating building with no context, no generic stock sky, [Bloque 5]
```
Repetir con "atardecer / golden hour version" para el segundo momento del dia (Modulo 08).

### Campaña publicitaria / banner
```
[Bloque 1 — sujeto del anuncio] + Bloque 2 + Bloque 3 + Bloque 4,
composition with clear negative space at [top/side] for headline text overlay in Lora typeface,
--no [Bloque 5], no cluttered composition, no more than one focal subject
```

### Edicion fotografica (retoque/color grading de foto existente)
```
Apply color grading: shift shadows toward deep petrol blue-green (#14313A), warm highlights toward
terracotta/gold (#8B3323 / #C9982E), increase warmth in skin and wood tones, maintain natural skin texture,
avoid oversaturation, keep contrast editorial (not high-contrast HDR look)
```

### Video / motion (brief para herramienta de generacion de video con IA)
```
[Bloque 1 — escena], slow and precise camera movement (no fast cuts, no glitch transitions),
[Bloque 2] + [Bloque 3] color grade, calm and confident pacing,
--no fast whip pans, no flashy transitions, [Bloque 5]
```

## Bloques fijos — Urbannit (usar en vez de los de Meridiano cuando la pieza es del circuito de renta temporal)

**Direccion de arte Urbannit:** `warm inviting interior photography, natural daylight, lived-in but styled hospitality mood, similar to a boutique guesthouse editorial shoot`
**Paleta Urbannit:** `warm sage-green accents (#45573A), soft sand and cream tones (#F1E8D8), warm charcoal-brown details (#3A2E22)`
**Negative Urbannit:** `no sterile hotel-chain look, no cold blue lighting, no clutter, ` + lista general del Bloque 5.

## Regla de uso
Si el pedido no encaja exactamente en ninguno de estos templates, construir el prompt combinando manualmente Bloque 1 (especifico del pedido) con los Bloques 2-5 correspondientes a la marca — nunca omitir el negative list ni improvisar una paleta de color distinta a la del Modulo 05.
