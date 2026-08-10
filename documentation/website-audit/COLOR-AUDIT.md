```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# Color Audit

## Regla del brief respetada: no se inventan colores — se audita contra la paleta oficial

`knowledge-base/brand/05-sistema-cromatico.md` es la fuente de verdad. Los 14 custom properties del sitio se verificaron uno por uno contra ese documento — **coinciden exactamente**, sin ninguna desviación de HEX.

## Sistema de color implementado (tal como existe hoy en `:root`)

| Token CSS | HEX | Rol |
|---|---|---|
| `--navy` | #14313A | Petróleo profundo — color primario de marca |
| `--navy-2` | #0D2226 | Petróleo más oscuro — fondos de máximo contraste (footer, hero gradient) |
| `--navy-tint` | #1D414D | Variante clara del navy — usada solo en el gradiente del hero |
| `--tierra` | #8B3323 | Tierra colorada — CTA final, acentos secundarios |
| `--tierra-2` | #6E2819 | Tierra oscura — gradiente del CTA final |
| `--gold` | #C9982E | Dorado — acentos sobre fondo oscuro |
| `--gold-d` | #A87D22 | Dorado oscuro — acentos sobre fondo claro (ver hallazgo de contraste abajo) |
| `--cream` | #F3EDE3 | Fondo cálido claro |
| `--cream-2` | #EDE4D4 | Variante de cream — no se detectó ningún uso real en el CSS actual |
| `--grey` | #6B6154 | Texto secundario sobre fondo claro |
| `--kaa` | #45573A | Verde Urbannit — solo en el panel de renta temporal |
| `--kaa-2` | #374630 | Variante oscura de kaa — no se detectó ningún uso real |
| `--sand` | #F1E8D8 | Fondo alterno claro (sección Aliados) |
| `--charcoal` | #3A2E22 | Texto sobre el warning de la calculadora |
| `--line` | #DAD2C0 | Bordes |

**Hallazgo menor**: `--cream-2` y `--kaa-2` están declarados pero no tienen ningún uso detectado en el CSS actual — no es un error, pero es señal de que el sistema se diseñó pensando en más variación de la que hoy se usa (posiblemente para hover states o gradientes futuros no implementados todavía).

## Hallazgo de accesibilidad, con cálculo — `--gold-d` sobre `--cream` no cumple WCAG AA

El `.eyebrow` (etiqueta pequeña en mayúsculas, presente en 7 secciones) usa `color: var(--gold-d)` sobre fondos claros (blanco/cream/sand). Calculado el contraste real:

**`#A87D22` sobre `#F3EDE3` → ratio 3.21:1.**

El mínimo WCAG AA para texto normal es 4.5:1. El `.eyebrow` es `font-weight:700` a `12.5px` — no alcanza el umbral de "texto grande" (que requiere 14px bold / 18.66px, según el estándar) que relajaría el mínimo a 3:1. **Este uso, tal como está hoy, no pasa WCAG AA.**

Esto es consistente con — y de hecho una instancia concreta de — la regla ya documentada `RB-03` ("Lapacho dorado nunca como texto de cuerpo — falla WCAG 4.5:1"): el `.eyebrow` no es "texto de cuerpo" en sentido estricto, pero el mismo problema de contraste aplica igual a este tamaño de fuente.

**Nota de alcance**: se verificó este par de colores en detalle porque es el de mayor riesgo visible (dorado oscuro sobre claro, en texto pequeño, usado 7 veces). No se recalculó cada combinación de color del sitio uno por uno en este ciclo — `ACCESSIBILITY-AUDIT.md` recomienda correr una herramienta automatizada de contraste (axe, Lighthouse) sobre la página completa antes de Production Ready.

## Uso de color por sección — consistente con la jerarquía de marca

- Hero y CTA final: fondos oscuros (navy/tierra) — correcto, coincide con "sandwich de fondos" (`marketing/02-presentaciones.md`, aunque ese documento está escrito para presentaciones, no para web — la misma lógica se aplica bien acá por analogía).
- Secciones de contenido: alternan blanco / cream / sand — dan ritmo sin saturar.
- Urbannit (panel kaa): único lugar donde aparece el verde — consistente con la regla de que kaa es exclusivo de la sub-marca, nunca de Meridiano Capital directamente.

## Veredicto

**Score de Color: 9/10.** Fidelidad perfecta a la paleta oficial — el único punto perdido es el hallazgo de contraste cuantificado arriba, que es puntual y fácil de corregir (subir el peso o el tamaño del `.eyebrow`, o usar un tono de dorado más oscuro solo para ese contexto) sin tocar la paleta de marca en sí.
