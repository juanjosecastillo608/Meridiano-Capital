```
Estado: CURRENT
Fuente original: assets/source-docs/meridiano-capital-sitio-web.html; inventory/_raw-copies/meridiano-rentabilidad/
Dominio: TECHNOLOGY
```

# 00 — Resumen de activos tecnológicos (technology overview)

Este documento inventaría, sin adornos, lo que **existe hoy** como activo tecnológico de Meridiano Capital. No incluye planes ni aspiraciones salvo que estén explícitamente marcados como `[EXTENSION]`/PROPOSED en `03-arquitectura-propuesta.md`.

## Inventario de activos

| # | Activo | Tipo | Ubicación fuente | Estado real |
|---|--------|------|-------------------|--------------|
| 1 | Sitio web de referencia | 1 archivo HTML autocontenido (HTML+CSS+JS inline) | `assets/source-docs/meridiano-capital-sitio-web.html` | Maqueta de referencia / diseño final, **no desplegado**, sin backend |
| 2 | Motor de cálculo de rentabilidad (`calculadora.py`) | Librería Python pura (stdlib only) | `inventory/_raw-copies/meridiano-rentabilidad/scripts/calculadora.py` | Código funcional y testeado, **sin interfaz de usuario ni API** — se usa hoy importándolo desde una sesión/skill de Claude |
| 3 | Suite de auto-verificación (`test_calculadora.py`) | Script de test standalone (no framework) | `inventory/_raw-copies/meridiano-rentabilidad/scripts/test_calculadora.py` | Funcional, 16 aserciones, ejecutable con `python3 scripts/test_calculadora.py` |
| 4 | Parámetros de mercado (`parametros_mercado.json`) | Config JSON | `inventory/_raw-copies/meridiano-rentabilidad/config/parametros_mercado.json` | Activo y en uso (v1.4, 2026-07-31); contiene al menos una inconsistencia interna (ver `02-calculadora-rentabilidad.md`) |
| 5 | Documentación de metodología y política | Markdown (`metodologia-calculo.md`, `politica-completa.md`) | `inventory/_raw-copies/meridiano-rentabilidad/references/` | Documentación viva, referenciada por el propio motor y por la Claude Skill |
| 6 | Skill de Claude "meridiano-rentabilidad" | `SKILL.md` + los tres activos anteriores empaquetados | `inventory/_raw-copies/meridiano-rentabilidad/SKILL.md` | Es la **única interfaz de uso actual** del motor de cálculo — se invoca dentro de conversaciones de Claude, no como app independiente |
| 7 | Directorio `app/` en este repo | Carpeta vacía | `app/` (raíz del repo) | Existe como placeholder; **sin código todavía** — destino natural de la futura app (ver `03-arquitectura-propuesta.md`) |

## Qué NO existe hoy (para evitar sobre-interpretar)

- No hay backend, servidor, base de datos ni API desplegados en ningún lado.
- No hay build system, framework de frontend (React/Vue/etc.), ni gestor de paquetes (`package.json`) para el sitio.
- No hay `requirements.txt` ni entorno virtual definido para el código Python.
- No hay integración real del formulario de contacto del sitio (es un mock client-side; ver `01-sitio-web-referencia.md`).
- No hay CI/CD, hosting, dominio conectado, analítica ni pixel de tracking visibles en el HTML fuente.
- No hay conexión entre el sitio web de referencia y la calculadora de rentabilidad — son dos activos completamente aislados hoy.
- El directorio `app/` de este repo está vacío: cualquier "app funcional" de Meridiano Capital es trabajo futuro, no un hecho actual.

## Cómo se relacionan los dos activos principales

```
sitio-web (HTML/CSS/JS estático)          calculadora.py (motor Python)
        │                                          │
        │  presenta la marca, el proceso,          │  calcula TIR, plusvalía,
        │  el formulario de contacto               │  yield neto/bruto, pisos
        │                                          │
        └──────────────── sin conexión hoy ────────┘
```

Ambos son insumos de calidad — uno de diseño/marca, otro de lógica financiera — pero **ninguno es hoy una aplicación web funcional**. Unirlos es la propuesta de `03-arquitectura-propuesta.md`.

## Índice de este dominio

- `01-sitio-web-referencia.md` — desglose técnico completo del HTML de referencia.
- `02-calculadora-rentabilidad.md` — desglose técnico completo del motor de rentabilidad, su testing y hallazgos.
- `03-arquitectura-propuesta.md` — `[EXTENSION]`/PROPOSED: cómo combinar ambos activos en una app real bajo `app/`.

> UNRESOLVED: no se encontró ningún documento de "arquitectura objetivo" o "stack decidido" en el material fuente migrado. Todo lo dicho sobre arquitectura futura en este dominio es propuesta razonada del agente de migración, no una decisión ya tomada por Meridiano Capital.
