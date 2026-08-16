Estado: CURRENT
Fuente original: founder, 2026-08-17 — planilla "Indicadores Plan Regulador PR.xlsx" (Ordenanza N° 43/1994 Plan Regulador de Asunción y sus modificaciones)
Dominio: INVESTMENT

# Plan Regulador de Asunción — indicadores urbanísticos por zona

**Uso**: tabla de referencia cross-cutting, no específica de un caso — pedida explícitamente por el founder para "el estudio de todos los terrenos, porque nos permite saber qué se puede construir y qué no. En función de esos indicadores, los terrenos, según la zona, tienen su valor." Primer caso que la usa: `contracts/cases/HERRERA-001/` (ver `29-plan-regulador-y-correccion-68-barrios.md`).

## Qué es

Planilla oficial de indicadores urbanísticos de la Ordenanza N° 43/1994 (Plan Regulador de Asunción y sus modificaciones) — define, por zona de regulación, **qué usos están permitidos** (vivienda, comercio, industria, etc.) y **qué se puede construir** (densidad, coeficiente de edificabilidad, altura máxima, retiros). Esto es lo que, en última instancia, determina el valor de un terreno: un terreno en una zona que permite más altura/densidad vale más que uno idéntico en una zona más restrictiva.

## Tabla — Áreas Residenciales (AR), categoría A (confirmado, ordenanza oficial)

| Zona | Usos permitidos | Usos condicionados (relevantes) | Densidad (hab/Ha) | Coef. de edificabilidad | Tasa de ocupación máxima | Altura máxima | Retiro frente |
|---|---|---|---|---|---|---|---|
| AR1-A | VU, VB, CH | VM, Apart Hotel y otros | 250 | 1,5 | Hasta 60% del terreno | 3 plantas o 9 m | 3 m (calle) / 6 m (avenida) |
| AR1-B | VU, VB, CH | VM, Apart Hotel y otros (ver Anexo 1 y Ord. 53/02) | 250 | 1,5 | Hasta 60% del terreno | 3 plantas o 9 m | 3 m / 6 m |
| AR2-A | VU, VM, BM, CH | Apart Hotel y otros; CS 1-2; EQ 1; I1 P | 600 | 2,4 | VU: 65% · VM/CH: 60% | 4 plantas o 12 m | 3 m / 6 m |
| AR2-B | VU, VM, BM, CH | Apart Hotel y otros; CS 1-2; EQ 1; I1 P | 600 | 3,25 | VU: 70% · VM/CH: 65% | **5 plantas o 15 m** | 3 m / 6 m |
| AR3-A | VU, VM, BM, CH | Apart Hotel y otros; CS 1-2-3; EQ 1-2; I1 P; D1-D2 | 1.000 | 3,25 | VU: 75% AE · VM/CH: 65% | 5 plantas o 15 m | 3 m / 6 m |
| AR3-B | VU, VM, BM, CH | Apart Hotel y otros; CS 1-2-3; EQ 1-2; I1 P; D1-2-3 | 1.000 | 5,25 | VU: 75% · VM/CH: 75% | **7 plantas o 21 m** | 3 m / 6 m |

**Abreviaturas de la ordenanza, sin expandir con certeza** (no confirmadas más allá de lo que dice la planilla, para no inventar): VU, VB, VM, BM, CH (probablemente distintos tipos de vivienda — unifamiliar, bifamiliar, multifamiliar, y otras), CS (comercio/servicios, en 3 niveles), EQ (equipamiento), I1 P (industria tipo 1), D (depósito, en 3 niveles). Retiros laterales y de fondo: remiten a la Ordenanza 386/09, no están tabulados con un valor único.

## Metodología de edificabilidad — validada con un caso real aportado por el founder

La misma planilla trae un ejemplo real de aplicación ("Estudio de Edificabilidad", propiedad en Ycuá Satí, zona AR1-A, terreno 1.023 m²):

> **Área edificable = Superficie del terreno × Coeficiente de edificabilidad**
> **Número de pisos edificable ≈ Área edificable ÷ (Tasa de ocupación máxima × Superficie del terreno)**

Ejemplo verificado: terreno 1.023 m², zona AR1-A (coef. 1,5) → área edificable = 1.023 × 1,5 = 1.534,5 m². Con tasa de ocupación 60% → 1.534,5 ÷ (0,60 × 1.023) = 1.534,5 ÷ 613,8 ≈ **2,5 pisos** edificables.

**Esta es la metodología a aplicar para cualquier terreno nuevo que se evalúe** — una vez que se sepa su zona de regulación (AR1-A a AR3-B u otra no incluida en esta primera carga), da directamente el área edificable y el número de pisos permitido, sin depender de una consulta municipal caso por caso.

## Qué falta

1. **Solo están cargadas las 6 zonas "AR" (Áreas Residenciales)** — la ordenanza completa probablemente tiene más categorías (comerciales, industriales, mixtas) no incluidas en esta primera carga del founder.
2. **No hay un mapa que indique qué zona de regulación (AR1-A a AR3-B) corresponde a cada barrio** — hace falta consultar catastro/mapa municipal para cada terreno específico, como se hizo en el ejemplo de Ycuá Satí.
3. Expandir las abreviaturas de usos (VU/VB/VM/BM/CH/CS/EQ/I1/D) con una fuente oficial, en vez de dejarlas sin traducir.
