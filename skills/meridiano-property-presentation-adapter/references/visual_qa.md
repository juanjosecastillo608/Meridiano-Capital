# QA visual y tratamiento de imágenes

## Imágenes permitidas

Solo imágenes adjuntas, contenidas en los documentos o expresamente autorizadas. Nada de internet salvo pedido explícito. Nunca IA para representar una propiedad real (un render de la fuente se usa rotulado como render).

Correcciones moderadas permitidas: exposición, balance de blancos, contraste, luces/sombras, dominantes, nitidez, ruido, perspectiva, encuadre. Aplicarlas con criterio documental y registrarlas en las notas y en el informe (qué imagen y qué ajuste).

Prohibido: cambiar materiales o arquitectura, agregar amenities o mobiliario, borrar defectos permanentes, cambiar vistas, cualquier cosa que genere una expectativa engañosa.

## Deformación: tolerancia cero

Nunca cambiar la relación de aspecto de fotos, planos, mapas, logos, renders, retratos o capturas. `validate_image_aspect_ratios.py` es el árbitro (tolerancia 0,5 %): si falla, no se entrega aunque "se vea bien".

Si varias imágenes no entran: cambiar la grilla, dividir en más diapositivas, una principal + secundarias o una secuencia. Reducir la cantidad de imágenes solo con autorización del usuario.

Collages de la fuente (varias fotos en un solo archivo): separarlos por los separadores con recortes exactos (PIL `crop`) y componer una grilla propia; nunca estirar el collage.

Recorte `cover`: anclar al sujeto (rostro arriba en retratos `ay: 0`; edificio centrado). El recorte no debe cortar información (rótulos, medidas). Si una foto trae texto o datos sobreimpresos que el recorte cortaría, usarla completa (`mode: "contain"` o `d.cover({photoMode: "panel"})`) o elegir otra foto para ese marco; nunca dejar un rótulo cortado a la mitad.

Orientación: `inspect_inputs.py --prepare-images` aplica la etiqueta EXIF (lo estándar en fotos de teléfono y cámara). Si el inventario marca `exif_check`, mirar la copia preparada: si el contenido quedó de costado, la etiqueta estaba mal; usar la copia de `fuentes/` sin rotar y registrarlo en `visual_qa`.

## Planos y documentación técnica

`contain` dentro de un panel blanco con filete `linea`. Conservar proporción, orientación, medidas, escala, referencias, accesos, norte y rotulación. Se permite limpiar el fondo y reforzar el contraste de las líneas (niveles), nunca redibujar ni editar medidas. Datos del plano y llamadas editoriales van **fuera** del plano, en la columna lateral.

## Mapas

Conservar la fuente del mapa (atribución visible si la trae), la proporción y la legibilidad. Enlace funcional (`hyperlink`) cuando exista. No agregar distancias ni tiempos de traslado no documentados.

## Resolución

`effective_ppi` < 100 → aviso en el informe (sirve en pantalla, limitado en impresión grande). No reescalar artificialmente con IA; pedir los originales si hacen falta.

## Checklist por diapositiva (mirar cada PNG, no el código)

1. Texto desbordado o cortado (primero esto).
2. Superposiciones: texto sobre filetes, pies que chocan con el contenido.
3. Márgenes ≥ 0,6" y alineación a la grilla.
4. Tipografía: titulares Fraunces sin negrita, cuerpo Poppins; nada < 9 pt.
5. Logo: lockup solo en portada y cierre, isotipo en los pies; versión correcta sobre fondo claro/oscuro; zona de protección.
6. Contraste suficiente (dorado nunca como texto largo sobre claro).
7. Imágenes: recorte correcto, sin deformación, sujeto visible.
8. Numeración consecutiva; pie coherente.
9. Datos: iguales a la matriz validada; unidades y formatos consistentes.
10. Contacto y firma según el preset; sin correos ni cargos antiguos.
11. **Versión colegas**: ningún logo, nombre, contacto, firma ni retrato de Meridiano; el cierre queda limpio, con espacio para el contacto del colega; ninguna foto de la fuente muestra la marca de Meridiano.

Luego la **vista general** (`00_vista_general.png`): ritmo de fondos, variedad de layouts, consistencia de márgenes entre diapositivas.

Primer render = casi siempre hay defectos. Corregir, reconstruir, volver a correr toda la Fase 6 y mirar de nuevo las diapositivas cambiadas.

## Editabilidad

Textos, cifras, tablas, gráficos, formas, líneas, contacto y pies deben quedar editables (el kit lo garantiza). Nunca aplanar diapositivas como imagen. Fotos y planos pueden ser imágenes, con resolución suficiente.
