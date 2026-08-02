---
name: rentabilidad-calculator
description: >-
  Calcula la rentabilidad (yield bruto/neto, TIR, plusvalia, retorno
  combinado) de una propiedad para Meridiano Capital, envolviendo el motor
  real de calculo (production/app/backend/calculadora.py) -- nunca recalcula
  a mano ni de memoria. USAR SIEMPRE que se pida evaluar, calcular o estimar
  la rentabilidad, el yield, la TIR, la plusvalia o el retorno de una
  propiedad, oportunidad o inversion inmobiliaria de Meridiano Capital o
  Urbannit; o que se pida verificar si una propiedad "pasa el piso" de
  rentabilidad. Incluye siempre las advertencias de integridad de datos
  (D-002 sigue sin resolver) junto con cualquier cifra.
---

# rentabilidad-calculator (SK-03)

Skill de la capa SKILLS (`documentation/MIGRATION_MASTER_REPORT.md`, Fase 9 — Skill Discovery). Envuelve el motor de calculo real de Meridiano Capital para responder en lenguaje natural, sin reimplementar ni aproximar la lógica.

## Principio rector

> Nunca calcules rentabilidad "a ojo" ni repitas de memoria una cifra que ya viste antes. Corré el motor real (`production/app/backend/calculadora.py` vía `Calculadora`) y devolvé lo que efectivamente calculó, con sus advertencias.

## Cuándo usar esta skill

- "¿Cuál es la rentabilidad de esta propiedad?" / "¿Cuánto rinde neto esto?"
- "¿Esta propiedad pasa el piso de [clase]?"
- "Calculame el yield bruto y neto de [precio]/[renta]."
- "¿Qué TIR da esta reventa / cesión de derechos / retorno combinado?"

## Cómo ejecutarla

Opción A — script directo (no requiere que el servidor esté corriendo):

```bash
python skills/rentabilidad-calculator/calcular.py renta \
  --clase comercial --precio 100000 --renta 1000 --nivel 3
```

Subcomandos disponibles: `renta`, `reventa`, `reventa-temprana`, `combinado` — cada uno expone los mismos parámetros que `Calculadora` en `production/app/backend/calculadora.py`. Correr `--help` en cualquiera para ver los argumentos exactos.

Opción B — si `production/app/backend/server.py` ya está corriendo, usar la API HTTP (`POST /api/calcular/renta`, etc. — ver `production/app/README.md`).

## Reglas no negociables al presentar un resultado

1. **Nunca mostrar solo el yield bruto.** Mostrar siempre bruto y neto juntos (`RI-01`, regla de oro de `knowledge-base/investment/02-politica-de-rentabilidad.md`).
2. **Incluir siempre el campo `advertencias`** que devuelve el script/API, sin resumirlo ni omitirlo. Al día de hoy contiene:
   - Confirmación de la regla de IVA vigente (D-027, resuelta 2026-08-02).
   - Si la clase es `temporal_*`: aviso de que el IVA residencial se aplicó por inferencia `[EXTENSION]`, no confirmado para renta temporal.
   - **D-002 (pisos brutos vs. netos) sigue UNRESOLVED** — cualquier veredicto `pasa_piso` debe presentarse con esa reserva explícita, nunca como cifra cerrada.
3. **Para reventa/reventa-temprana**: presentar tanto las cifras brutas (auditadas contra Habitalis 9A / Edificio Austria) como las `_neto_iva` (nuevas, IVA de venta 5%) — nunca solo una de las dos.
4. Si el usuario pide una cifra para un documento/deck externo a un inversor, recordar el disclaimer de marca ("cifras ilustrativas, no constituyen garantía" — `RB-05`, `knowledge-base/brand/09-cierres-y-firmas.md`).

## Dependencias

- `production/app/backend/calculadora.py` — lógica de cálculo (no tocar sin resolver D-002/D-003 primero si el cambio los toca).
- `production/app/backend/advertencias.py` — texto de advertencias, compartido con `server.py`.
- `production/app/config/parametros_mercado.json` — parámetros de mercado vigentes.
- `governance/decisions/DECISION_REGISTER.md` — estado real de D-001/D-002/D-003.

## Relación con otras skills/workflows

- Alimenta a `workflows/rentabilidad-evaluation/` (WF-02) — este es el paso de cálculo dentro de ese proceso más amplio.
- Complementa a `brand-guardian-audit` (SK-01, todavía no implementada) cuando el resultado se va a usar en una pieza de marca.
