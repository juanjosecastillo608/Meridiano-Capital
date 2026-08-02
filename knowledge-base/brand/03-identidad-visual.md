```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-capital-identity/references/03-identidad-visual.md
Dominio: BRAND
```

# Identidad Visual (Sistema de Logotipo)

**Estado: OFICIAL.** Fuente: Brand Guidelines Parte 2 y 5. Archivos vectoriales en `inventory/_raw-copies/meridiano-capital-identity/assets/logos/`. Ejemplos renderizados en `inventory/_raw-copies/meridiano-capital-identity/assets/brandbook/`.

## Concepto (nunca ignorar al explicar o adaptar el logo)

El isotipo es **"el mojon"**: un punto de triangulacion geodesica que un agrimensor deja en el terreno para fijar una referencia exacta e inamovible. Se eligio por tres razones estrategicas:
1. Es un objeto real del oficio de construccion, no una metafora financiera prestada.
2. Contiene el significado de "Meridiano" sin ilustrarlo literalmente — un mojon fija un punto de referencia exacto, igual que un meridiano en un mapa.
3. Es geometricamente simple, lo que garantiza legibilidad de un favicon de 16px a una fachada de edificio.

**Construccion:** triangulo de trazo fino (estructura de medicion) + linea base horizontal (nivel del terreno) + punto solido dorado en el centroide (el valor/capital que se fija y se protege). El punto es el unico elemento que lleva el color de acento.

Isotipo de Urbannit: **"la cerradura"** — circulo + trapecio, en Ka'a verde. Ver `04-tipografia.md` y `05-sistema-cromatico.md` para las especificaciones de cada marca; ver `10-arquitectura-meridiano-urbannit.md` para las reglas de convivencia entre ambos isotipos.

## Archivos fuente vectoriales (usar siempre estos, no recrear desde cero)

- `assets/logos/meridiano-isotipo.svg` — mark solo, fondo claro
- `assets/logos/meridiano-isotipo-inverso.svg` — mark solo, fondo oscuro
- `assets/logos/meridiano-primario-horizontal.svg` — lockup completo con wordmark
- `assets/logos/urbannit-isotipo.svg` — cerradura
- `assets/logos/urbannit-primario-horizontal.svg` — lockup completo Urbannit

(Rutas relativas a `inventory/_raw-copies/meridiano-capital-identity/`.)

## Versiones del logotipo

| Version | Cuando usarla | Referencia (brandbook) |
|---|---|---|
| Primaria horizontal | Uso por defecto — 90% de las aplicaciones (web, papeleria, firma, documentos, presentaciones) | `01_logo_primary_light.png`, `02_logo_primary_dark.png` |
| Vertical / apilada | Espacios cuadrados o verticales (perfiles sociales, sellos, packaging) | `03_logo_stacked.png` |
| Isotipo solo | Favicon, avatar, marca de agua, tamaños pequeños | `04_logo_isotype.png` |
| Monocromatica | Grabado, bordado, fax, sellado en seco — un solo color | `05_logo_mono_navy.png`, `06_logo_mono_white_on_tierra.png` |

## Zona de proteccion (clear space)

Ningun elemento ajeno (texto, imagen, borde, otro logo) puede invadir el area de seguridad alrededor del logotipo. Unidad de medida X = altura del triangulo del isotipo en esa aplicacion especifica (se recalcula proporcionalmente, nunca es un valor fijo en px). Espacio libre minimo: X en los cuatro lados. Ver `07_clearspace.png`.

## Tamaño minimo

Por debajo de 32px de alto (o 24mm impreso): usar SOLO el isotipo, nunca el lockup con texto. Ver `08_minsize.png`.

## Usos correctos

El logotipo primario funciona sobre 4 fondos base: blanco, petroleo profundo, tierra colorada, crema.
- Fondos claros → version petroleo profundo con punto dorado.
- Fondos oscuros/saturados → version invertida en crema con punto dorado (constante en ambos casos).

Ver `14_usage_correct.png`.

## Las 6 violaciones prohibidas (regla dura, sin excepcion, aplica a cualquier pieza)

1. Deformar / estirar proporciones.
2. Rotar el logotipo.
3. Usar colores fuera de paleta.
4. Agregar sombras o efectos 3D (la identidad es deliberadamente plana/editorial).
5. Ubicar sobre fondos de bajo contraste.
6. Agregar contornos u ornamentos no especificados.

Ver `15_usage_incorrect.png` para los 6 ejemplos exactos marcados con X roja, y la tabla de justificacion de por que cada una esta prohibida en `Meridiano_Capital_Brand_Guidelines_v1.docx` Parte 5.2.

## Regla entre marcas

El isotipo de Meridiano (mojon) y el de Urbannit (cerradura) **nunca** se combinan en un simbolo hibrido — coexisten siempre separados y completos. Detalle completo en `10-arquitectura-meridiano-urbannit.md`.
