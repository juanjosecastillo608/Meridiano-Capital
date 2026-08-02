Estado: CURRENT
Fuente original: meridiano-capital-identity/references/15-matriz-de-decision.md
Dominio: AI

# Matriz de Decision

**Nota sobre estados:** este archivo usa dos ejes de "estado" distintos que no deben confundirse. "Estado: CURRENT" (arriba) describe la **vigencia** de este archivo dentro del repositorio: es la version activa y en uso. Por separado, el **contenido** de la matriz esta marcado en su fuente original como **[EXTENSION]** en el sentido del protocolo OFICIAL vs [EXTENSION] (`ai/02-protocolo-regla-no-definida.md`): la matriz no es un texto literal del Brand Guidelines oficial, sino una herramienta de auditoria construida para responder rapido "¿esto esta alineado con la marca?", derivada de los principios generales de marca. Al aplicar esta matriz, un agente debe seguir tratandola como [EXTENSION] frente al usuario cuando corresponda declarar esa distincion (por ejemplo, si el usuario pregunta si la matriz misma es una regla oficial del manual).

Usar esta matriz cada vez que se evalue una pieza propia o de un tercero (diseñador, imprenta, agencia), y como paso final del Modo Brand Guardian (`ai/04-director-creativo-y-brand-guardian.md`, Modulo 19).

## Como usar

Evaluar la pieza en cada uno de los 10 criterios. Cada criterio se clasifica como:

- **APROBADO** — cumple sin reservas.
- **REQUIERE AJUSTE** — hay un problema puntual y corregible, se explica cual.
- **NO ALINEADO** — contradice una regla oficial o el ADN de marca; no debe publicarse sin corregir.

## Los 10 criterios

| # | Criterio | Pregunta guia | Archivo de referencia (`knowledge-base/`) |
|---|---|---|---|
| 1 | Estrategia | ¿Refuerza al menos uno de los tres puntos del Brand Promise? ¿Respeta el Brand DNA? | `brand/01-adn-de-marca.md` |
| 2 | Identidad verbal | ¿El tono cumple la tabla de tensiones? ¿Usa la capa correcta del sistema de mensajes? | `brand/02-identidad-verbal.md` |
| 3 | Identidad visual | ¿Usa el logo correcto, sin ninguna de las 6 violaciones? | `brand/03-identidad-visual.md` |
| 4 | Tipografia | ¿Usa Lora/Poppins (o alternativas de sistema) segun jerarquia? | `brand/04-tipografia.md` |
| 5 | Color | ¿Usa los HEX exactos? ¿Respeta la regla de accesibilidad del dorado? ¿No mezcla paletas de Meridiano y Urbannit sin ser el lockup oficial? | `brand/05-sistema-cromatico.md` |
| 6 | Fotografia/imagen | ¿Cumple la Direccion de Arte y evita la lista negativa? | `brand/07-direccion-de-arte.md`, `brand/08-sistema-de-imagen.md` |
| 7 | Composicion | ¿Jerarquia visual clara, un mensaje central, espacio en blanco respetado? | `brand/06-sistema-grafico.md`, `marketing/01-aplicacion-digital.md` |
| 8 | Experiencia | ¿La pieza es coherente en el punto de contacto especifico (web, red social, impreso) segun sus reglas propias? | `marketing/01-aplicacion-digital.md`, `marketing/02-presentaciones.md`, `marketing/03-redes-sociales.md`, `marketing/04-publicidad.md` |
| 9 | Premiumizacion | ¿Se siente "precision silenciosa" o se ve generico/corporativo de categoria financiera estandar? | `brand/07-direccion-de-arte.md` |
| 10 | Coherencia general | ¿Se sentiria como la misma marca si se pusiera al lado de las otras piezas ya producidas (sitio web, deck, brand book)? | Todos |

> Nota de migracion: la columna "Modulo de referencia" original usaba numeros de modulo (01, 02, 03, 04, 05, 07, 08, 06/09, 10/11/12, 07). Se rewritten aqui a rutas de `knowledge-base/` siguiendo el mismo mapeo de dominio usado en `ai/03-sistema-de-consulta.md`. Ver el UNRESOLVED de ese archivo respecto a la migracion pendiente de `brand/` y `marketing/`.

## Formato de salida recomendado al auditar una pieza

```
1. Estrategia: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
2. Identidad verbal: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
3. Identidad visual: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
4. Tipografia: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
5. Color: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
6. Fotografia/imagen: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
7. Composicion: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
8. Experiencia: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
9. Premiumizacion: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]
10. Coherencia general: [APROBADO/REQUIERE AJUSTE/NO ALINEADO] — [razon breve]

Veredicto general: APROBADO / REQUIERE AJUSTE / NO ALINEADO
Si requiere ajuste o no esta alineado: [que cambiar, especifico y accionable]
```

(El original usa iconos ✅/⚠️/❌ como abreviatura visual de APROBADO/REQUIERE AJUSTE/NO ALINEADO respectivamente; ambas notaciones son equivalentes y pueden usarse indistintamente.)

## Regla de veredicto general

- Si **cualquier** criterio da NO ALINEADO (❌) en Identidad Visual (criterio 3) o Color (criterio 5) por violar una de las 6 reglas duras del logo o la regla de accesibilidad del dorado, el veredicto general es **automaticamente NO ALINEADO**, sin importar como califiquen los demas criterios — estas son reglas oficiales del manual, no negociables.
- Si hay **3 o mas** criterios en REQUIERE AJUSTE (⚠️), el veredicto general no puede ser APROBADO — baja a REQUIERE AJUSTE como minimo.

Estas dos reglas de veredicto son absolutas: ningun agente debe emitir un veredicto APROBADO que las contradiga, incluso si el resto de la pieza es excelente.

> UNRESOLVED: "las 6 reglas duras del logo" y "la regla de accesibilidad del dorado" mencionadas en criterios 3 y 5 se definen en `brand/03-identidad-visual.md` y `brand/05-sistema-cromatico.md` respectivamente — archivos aun no migrados a `knowledge-base/`. Hasta esa migracion, consultar `inventory/_raw-copies/meridiano-capital-identity/references/03-identidad-visual.md` y `references/05-sistema-cromatico.md` directamente.
