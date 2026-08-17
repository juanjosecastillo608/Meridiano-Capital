Estado: CURRENT — primera versión, 2026-08-17
Fuente original: consolidación de supuestos ya usados en `production/app/backend/calculadora.py`, `knowledge-base/investment/` y `contracts/cases/HERRERA-001/`
Dominio: INVESTMENT/GOVERNANCE

# Registro de supuestos — Market Intelligence de Meridiano Capital

## Qué es y en qué se distingue de `DECISION_REGISTER.md`

`governance/decisions/DECISION_REGISTER.md` registra **decisiones de negocio** confirmadas por el founder. Este registro es más angosto: solo los **supuestos de modelo** — números que el motor financiero usa para *calcular* cuando no hay un dato de mercado específico disponible, y que hay que poder ubicar y versionar de un vistazo cuando alguien pregunte "¿de dónde sale este número?". Todo supuesto de acá tiene su origen y su D-ID de respaldo en el Decision Register — este archivo es un índice de consulta rápida, no una fuente nueva de verdad.

## Supuestos vigentes

| Supuesto | Valor | Dónde se usa | Respaldo | Es dato de mercado o solo un supuesto de modelo |
|---|---|---|---|---|
| Ocupación real de renta temporal/Airbnb | 55–65%, 60% por defecto | `calculadora.py` (`ocupacion_pct`), cualquier evaluación de `temporal_departamento`/`temporal_casa` | D-003/D-046 | **Supuesto de modelo genérico** — no varía por barrio todavía. `market-intelligence/airbnb/00-...md` está pensada para ir reemplazándolo con ocupación real por zona a medida que se releve |
| IVA renta comercial | 10% | `calculadora.py` | D-001/D-045 | Dato de norma tributaria, no de mercado |
| IVA renta residencial (tradicional) | 5% | `calculadora.py` | D-001/D-045 | Dato de norma tributaria |
| IVA renta temporal/Airbnb | 10% | `calculadora.py` | D-045 | Dato de norma tributaria |
| IVA venta/reventa | 5% | `calculadora.py` | D-001/D-045 | Dato de norma tributaria |
| Comisión de venta (dos puntas, sin equipo interno) | 5,5% (IVA incluido) | Cualquier análisis de venta de desarrollo | D-063 | Política comercial de Meridiano, cross-cutting |
| Ritmo de venta por etapa | 30% lanzamiento / 40% obra / 30% entrega | Flujo de caja de cualquier desarrollo nuevo | D-065 | Supuesto de modelo, cross-cutting — no es un dato de mercado observado, es una política de planificación |
| Piso de plusvalía anual que justifica esperar antes de vender | 15% sobre precio de venta de la unidad terminada | Decisión venta-ahora vs. retener | D-065 | Supuesto de modelo/política, cross-cutting |
| Piso de renta (`temporal_departamento`/`temporal_casa`) | 15% bruto | Matriz de pisos/techos | D-002/D-033/D-044/D-045 | Supuesto de modelo — la matriz de **valores concretos** por zona/calidad (P-004) sigue sin cerrar, solo el mecanismo (siempre bruto) está resuelto |
| Esquema de financiamiento de compradores por defecto | 20% entrega + 70% cuotas durante obra + 10% contra entrega física | Cualquier desarrollo nuevo, salvo excepción documentada | D-067 | Política comercial, cross-cutting |
| Variante de financiamiento para obras de plazo corto (≤12 meses) | 40% entrega + 50% cuotas + 10% entrega | Proyectos de plazo de obra corto (p. ej. `HERRERA-001`) | D-067 | Política comercial — **no reemplaza** el 20/70/10 general, es una excepción acotada explícitamente |
| Regla de aplicación de tasa de construcción para obra sin terminar | Usar la tasa **Básica** de la categoría, no la Estándar/DVH | Valuación de estructura parcial existente | D-064 | Metodología, no un supuesto numérico puntual — ver `methodologies/netting-estructura-terminacion.md` |
| Costo de amueblamiento se suma a rentabilidad Y a plusvalía | Sí, siempre que la unidad se alquile/venda amoblada | Cualquier cálculo de rentabilidad o plusvalía de unidad amoblada | D-068 | Regla de modelo, cross-cutting |

## Supuestos explícitamente NO cerrados (para no confundirlos con los de arriba)

| Ítem | Por qué sigue abierto |
|---|---|
| Matriz completa de pisos/techos por zona/calidad (más allá de Eje Corporativo) | P-004 — falta la planilla de "Alquileres Amoblados Tradicionales" y datos de más zonas/calidades |
| Ocupación real de Airbnb por barrio específico | Sin relevar todavía en casi todos los barrios — `market-intelligence/airbnb/00-...md` |
| Calidad constructiva de los comparables de venta (Century 21 y similares) | Los listados públicos no publican el costo del desarrollador — D-073 |

## Cómo se mantiene

1. Todo supuesto nuevo que se use en un cálculo (no solo un dato de mercado puntual) se agrega acá, con su D-ID de respaldo.
2. Si un supuesto cambia (p. ej. la ocupación de Airbnb pasa de "genérica 60%" a "dato real por barrio"), no se sobreescribe la fila — se agrega el cambio al `DECISION_REGISTER.md` primero, y esta tabla se actualiza para reflejar el estado vigente, dejando la versión anterior recuperable vía git.
