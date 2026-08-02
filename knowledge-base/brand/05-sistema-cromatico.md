```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-capital-identity/references/05-sistema-cromatico.md
Dominio: BRAND
```

# Sistema Cromatico

**Estado: OFICIAL.** Fuente: Brand Guidelines Parte 3.

## Meridiano Capital (marca madre)

| Nombre | HEX | RGB | CMYK aprox. | Contraste vs. blanco | Uso |
|---|---|---|---|---|---|
| Petroleo profundo | #14313A | 20,49,58 | 66,16,0,77 | 13.7:1 | Dominante — tipografia, iconografia, estructura, fondos oscuros (30%) |
| Tierra colorada | #8B3323 | 139,51,35 | 0,63,75,45 | 8.1:1 | Secundario fuerte — CTAs, fondos de alto impacto |
| Lapacho dorado | #C9982E | 201,152,46 | 0,24,77,21 | 2.6:1 | SOLO acento (ver regla de accesibilidad abajo) |
| Crema | #F3EDE3 | 243,237,227 | 0,2,7,5 | 1.2:1 | Fondo dominante claro (60%) |
| Grey calido | #6B6154 | 107,97,84 | 0,9,21,58 | 6.1:1 | Texto secundario, captions |

**Proporcion de uso recomendada: 60% crema/blanco, 30% petroleo profundo, 10% lapacho dorado.** Ver `inventory/_raw-copies/meridiano-capital-identity/assets/brandbook/24_color_ratio.png`.

## Urbannit (sub-marca — paleta propia, NO mezclar con la de Meridiano en una misma pieza)

| Nombre | HEX | RGB | CMYK aprox. | Contraste vs. blanco | Uso |
|---|---|---|---|---|---|
| Ka'a verde | #45573A | 69,87,58 | 21,0,33,66 | 7.8:1 | Dominante |
| Arena | #F1E8D8 | 241,232,216 | 0,4,10,5 | 1.2:1 | Fondo claro |
| Carbon calido | #3A2E22 | 58,46,34 | 0,21,41,77 | 13.2:1 | Texto sobre arena |
| Lapacho dorado | #C9982E | 201,152,46 | 0,24,77,21 | 2.6:1 | Unico color compartido con Meridiano — solo en lockup combinado o acentos minimos |

## Accesibilidad (WCAG) — regla dura

Petroleo profundo, Tierra colorada, Grey calido y Ka'a verde superan 4.5:1 — pueden usarse como texto de cuerpo sobre fondo claro sin restriccion.

**Lapacho dorado NO cumple el minimo (2.6:1) ni para texto grande (exige 3:1).** Nunca usar dorado como color de texto de cuerpo ni titulares largos sobre fondo claro — solo como acento grafico puntual (punto del isotipo, borde, icono, dato numerico grande y aislado).

## Tonos utilitarios derivados

Estos NO son colores de marca nuevos — son tintes/mezclas de los colores oficiales, para uso exclusivo de UI/tablas.

| Nombre | HEX | Derivado de | Uso permitido |
|---|---|---|---|
| Linea de referencia | #DAD2C0 | Grey calido aclarado ~80% hacia Crema | Divisores, bordes de tabla, bordes de card — nunca como color solido de fondo o texto |
| Tinte de fila alterna | #F7F4EE | Crema aclarado ligeramente | Filas alternadas en tablas de datos — nunca fuera de ese contexto |
| Petroleo oscuro (navy-2) | #0D2226 | Petroleo profundo oscurecido ~15% | Fondo de footer, texto sobre fondo dorado (maximo contraste), variante mas oscura de fondo oscuro |
| Petroleo claro (navy-tint) | #1D414D | Petroleo profundo aclarado ~15% | Gradientes sutiles de fondo oscuro (ej. hero), nunca como color solido aislado |
| Tierra oscura (tierra-2) | #6E2819 | Tierra colorada oscurecida ~15% | Gradientes de fondo tierra colorada (ej. CTA final), hover de elementos en tierra colorada |
| Ka'a oscuro (kaa-2) | #374630 | Ka'a verde oscurecido ~15% | Gradientes/hover dentro de piezas Urbannit unicamente |
| Dorado oscuro (gold-d) | #A87D22 | Lapacho dorado oscurecido ~20% | Texto de eyebrow sobre fondo claro (mejora contraste vs. el dorado puro, que falla WCAG como texto) |
| Dorado hover (gold-hover) | #DCAE47 | Lapacho dorado aclarado ~15% | Unicamente estado :hover de botones primarios — nunca color base |
| Error suave (borde) | #E7A090 | Tierra colorada muy aclarada, no derivado de dorado ni dato "rojo" externo | Borde de campo de formulario invalido — nunca como color de marca fuera de estados de error |
| Error suave (texto) | #F3B7A6 | Version mas clara del anterior | Texto de mensaje de error sobre fondo oscuro (cta-final) |

Cualquier tono utilitario nuevo que se necesite (ej. un hover state, un overlay) debe derivarse por opacidad o mezcla de los 5 colores oficiales de Meridiano (o los 4 de Urbannit) y agregarse a esta tabla — nunca introducir un HEX nuevo sin registrarlo aqui primero.

## Por que esta paleta (justificacion cultural — usar si se pregunta o para brief de terceros)

- Petroleo profundo = el cielo de Asuncion al atardecer sobre el Rio Paraguay (no un azul marino generico de fondo de inversion internacional).
- Tierra colorada = el color literal del suelo paraguayo bajo cualquier obra en construccion — ningun competidor puede reclamarlo con la misma honestidad.
- Lapacho dorado = el arbol nacional del Paraguay en floracion.
- Ka'a verde = la yerba, primer gesto de hospitalidad paraguaya, anterior a cualquier palabra.

**Regla de oro:** nunca reemplazar esta paleta por "azul marino + dorado" generico de fondo de inversion (Blackstone, JP Morgan, etc.) — esa combinacion fue evaluada y descartada explicitamente por ser la paleta por defecto de toda la categoria financiera internacional.
