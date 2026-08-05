# Meridiano Capital — Repositorio de trabajo

Sistema empresarial de **Meridiano Capital** (inmobiliaria de Juan José Castillo, Asunción, Paraguay, para inversores extranjeros) y su sub-marca **Urbannit** (renta temporal). Listo para abrir en **Claude Code**.

## Por dónde empezar
1. **Leé `CLAUDE.md`** — es el archivo de recuperación completo (Claude Code lo carga solo al abrir el repo). Contiene todo el estado del proyecto + la transcripción cronológica de las 4 sesiones.
2. Las **skills** viven en `skills/` — son la fuente de verdad viva (marca, rentabilidad, journey).

## Estructura
- `CLAUDE.md` / `MERIDIANO_RECUPERACION.md` — estado completo del proyecto + transcripción (mismo contenido; `CLAUDE.md` es para auto-carga).
- `skills/` — las 3 skills:
  - `meridiano-capital-identity/` — marca (incluye Módulo 16 cierres/firmas y arquitectura Urbannit).
  - `meridiano-rentabilidad/` — motor P07 en Python + `config/parametros_mercado.json` (v1.4). Corré `scripts/test_calculadora.py` para verificar (21 tests).
  - `meridiano-investor-journey/` — onboarding, dos modelos, tarifario.
- `entregables/` — piezas terminadas:
  - `decks/` — Programa de Ingreso, Coinversión, Misión/Visión/Valores, Presentación Urbannit.
  - `legal/` — P04 Manual de Compliance (Paraguay).
  - `outreach/` — pieza de WhatsApp en frío (imagen + one-pager).
  - `auditorias/` — auditoría integral, del modelo financiero, y el plan de la desarrolladora.
- `generadores/` — scripts que producen los decks (`build_*.js`) + assets (isotipos).
- `historico/` — bitácora del proceso (mapas, charters, borradores de P07). Referencia, no fuente de verdad.

## Reglas críticas (ver CLAUDE.md §2 y §14)
- **Nunca confundir las economías de los dos modelos** (Individual 5,5% vs Coinversión hurdle 8% + carry 15-20%).
- Reportar siempre **neto**, nunca solo bruto. Nunca prometer rentabilidad garantizada.
- Clientes: Europa, Argentina, Brasil, Chile (no "Alemania").
- Contacto: juancastillo@meridianocapital.net · +595 982 853 111.

## Motor de rentabilidad (correr localmente)
```bash
cd skills/meridiano-rentabilidad/scripts
python3 test_calculadora.py   # debe imprimir: los 16/21 casos base pasan
```

## Pendientes (ver CLAUDE.md §12)
Reencuadrar los 2 manuales a hurdle+carry · estructura del Investment Memorandum · instrucciones de web para Claude Design · skill `meridiano-portfolio` · Club de Inversores.
