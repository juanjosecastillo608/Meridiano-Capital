```
Estado: CURRENT
Fuente original: inventory/_raw-copies/meridiano-capital-identity/references/04-tipografia.md
Dominio: BRAND
```

# Tipografia

**Estado: OFICIAL.** Fuente: Brand Guidelines Parte 4.

## Meridiano Capital

- **Fraunces** (serif variable, ejes `opsz`/`SOFT`/`WONK`/`wght`) — SOLO para: nombre de marca, titulares H1/H2, citas destacadas. Reemplaza a Lora (D-036, 2026-08-09) — ver nota de reemplazo abajo. Alternativa de sistema: Georgia o Cambria (igual que Lora, no cambia la alternativa de respaldo).
- **Poppins** (sans geometrica, Light/Regular/Medium/Bold) — para: cuerpo de texto, UI, tablas, subtitulos, etiquetas, redes sociales. Sin cambios — se evaluo reemplazarla junto con Lora y se decidio mantenerla: concentrar el caracter distintivo en un solo lugar (el titular) es mas fuerte que dos tipografias compitiendo por atencion, y Poppins sigue siendo limpia, legible y gratuita. Alternativa de sistema: Calibri o Arial.
- Ambas son Google Fonts de codigo abierto (SIL Open Font License) — uso comercial gratuito, sin restriccion de instalacion.

### Por que Lora se reemplazo por Fraunces (D-036)

La auditoria de marca del 2026-08-09 encontro que Lora + Poppins, aunque funcionan bien tipograficamente, son de las combinaciones serif+sans mas usadas del mundo — no aportan distincion (cualquier competidor puede usar exactamente las mismas dos fuentes gratis). Fraunces es tambien una Google Font gratuita, pero con caracter editorial propio: contraste optico variable (`opsz`) que se ajusta segun el tamaño, y un eje de calidez (`SOFT`) que ningun otro serif "seguro" (Lora, Playfair, Merriweather) ofrece.

**Ajuste tipografico aplicado** (no son los valores por defecto de instalacion — es una decision deliberada, ver `production/app/frontend/index.html`):
- `opsz 80` — contraste optico alto, pensado para titulares grandes, no para texto corrido.
- `SOFT 24` — un toque de calidez en las curvas (coherente con "raices" del ADN de marca) sin perder formalidad.
- `WONK 0` en el logotipo y titulares — mantiene las letras en su forma estandar, mas seria. `WONK 1` reservado unicamente para el acento en `<em>` (la palabra destacada del hero) — una sola pincelada de personalidad, no en toda la pagina.

**No se toco Camino 1** (logotipo con letterforms 100% propios, dibujados a mano) — quedo evaluado y descartado por ahora en favor de este camino, que sube el techo de todo el sistema tipografico en vez de una sola pieza.

## Jerarquia de tamaños

| Nivel | Tipografia / peso | Web | Impreso | Uso |
|---|---|---|---|---|
| H1 | Lora Bold | 44px / 2.75rem | 32-36pt | Titulo principal |
| H2 | Lora SemiBold | 32px / 2rem | 22-24pt | Titulo de seccion |
| H3 | Lora SemiBold | 22px / 1.4rem | 16-18pt | Subtitulo / encabezado de bloque |
| Body | Poppins Regular | 16px / 1rem | 10-11pt | Parrafo estandar |
| Caption/label | Poppins Medium | 13px / 0.8rem | 8-9pt | Pie de foto, etiquetas, metadata |
| Eyebrow | Poppins Bold + tracking | 12px / 0.75rem | 8pt | Antetitulo en mayusculas |

## Tracking, interlineado, kerning

- Titulares (Lora): interlineado 1.05-1.15; tracking neutro salvo nombre de marca en mayusculas (+10 a +15).
- Cuerpo (Poppins): interlineado 1.5-1.6; tracking neutro.
- Eyebrows en mayusculas: tracking +20 a +30 obligatorio.
- Nunca comprimir/expandir tipografia manualmente (transformacion de ancho horizontal). Si una palabra no entra, ajustar tamaño de fuente o ancho de contenedor.

## Tipografia de Urbannit

Usa UNICAMENTE Poppins (sin componente serif), en distintos pesos. Diferencia deliberada frente a Meridiano: la marca madre combina serif+sans para autoridad editorial; Urbannit simplifica a una sola familia porque su lenguaje es el de una app de hospedaje moderna, no el de una firma de inversion.

Ver especimenes renderizados en `inventory/_raw-copies/meridiano-capital-identity/assets/brandbook/22_typography_meridiano.png` y `23_typography_urbannit.png`.
