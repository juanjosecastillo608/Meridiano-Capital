```
Estado: AUDIT ONLY
Parte de: WEBSITE-AUDIT.md
```

# SEO Audit

## Lo que ya existe (correcto)

```html
<title>Meridiano Capital — Real Estate & Desarrollo en Paraguay para Inversores Extranjeros</title>
<meta name="description" content="Meridiano Capital: desarrollo, estructuración legal-fiscal y gestión de inversiones inmobiliarias en Paraguay para inversores extranjeros. 16 años de trayectoria en Asunción.">
```

El `<title>` usa exactamente la Capa 1 de mensaje oficial ("Real Estate & Desarrollo en Paraguay para Inversores Extranjeros", `brand/02-identidad-verbal.md`) — coincidencia perfecta, no arbitraria. La meta description es concisa, con keywords relevantes (desarrollo, estructuración legal-fiscal, gestión de inversiones, Paraguay, inversores extranjeros) de forma natural, sin keyword-stuffing.

`<html lang="es">` correcto. `<meta name="viewport">` correcto.

## Lo que falta — hallazgos concretos, verificados por ausencia en el código

| Elemento | Estado | Impacto |
|---|---|---|
| Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) | ❌ Ausente | Al compartir el link en LinkedIn/WhatsApp (canales explícitamente prioritarios del negocio, ver `Perfil Profesional`), no se genera ninguna tarjeta de preview — el link se comparte "pelado" |
| Twitter Card | ❌ Ausente | Mismo problema en X/Twitter |
| `<link rel="canonical">` | ❌ Ausente | Sin URL canónica declarada — riesgo si el sitio llega a tener versiones duplicadas (con/sin www, http/https) |
| Schema.org (JSON-LD) | ❌ Ausente | Sin marcado de `RealEstateAgent`, `Organization` u `Corporation` — Google no puede generar rich results (sitelinks, panel de conocimiento) |
| `robots.txt` | ❌ No verificado en el repo (no existe en `frontend/`) | Sin control explícito de crawling — no bloquea nada, pero tampoco guía nada |
| `sitemap.xml` | ❌ No existe | Sin problema hoy (una sola página), se vuelve necesario en cuanto exista más de una página real |
| Headings — jerarquía semántica | ✅ Correcta | Un solo `h1` (hero), `h2` por sección, `h3` dentro de cards — jerarquía limpia, sin saltos de nivel |
| URLs / rutas | 🟡 N/A | Sitio de una sola página — no aplica todavía, pero bloquea cualquier estrategia de contenido/blog futura (`marketing/01-aplicacion-digital.md` ya prevé un blog en 3 idiomas) |

## Local SEO — Asunción / Paraguay

No hay ninguna señal de local SEO más allá del texto plano ("Asunción, Paraguay" en el footer). Sin `LocalBusiness` schema, sin dirección estructurada, sin Google Business Profile vinculado (fuera del alcance de este audit de código, pero relevante para el roadmap).

## Keywords — cobertura observada vs. objetivo de negocio

El copy cubre naturalmente: "real estate Paraguay", "inversión extranjera", "desarrollo inmobiliario", "Asunción". No cubre explícitamente términos de intención transaccional que un inversor podría buscar: "invertir en Paraguay como extranjero", "residencia fiscal Paraguay", "grado de inversión Paraguay" (esta última sí aparece como frase, "Grado de inversión" en el hero-foot, pero no está optimizada como texto indexable de valor — es un stat visual corto).

## Veredicto

**Score de SEO: 1/3.** El `<title>` y la meta description ya están bien resueltos (raro encontrar eso ya correcto en una auditoría inicial) — pero la ausencia total de Open Graph y schema.org es el hallazgo de mayor impacto/menor esfuerzo de todo este audit completo: son ~15 líneas de HTML que hoy cuestan puntos de percepción cada vez que alguien comparte el link.
