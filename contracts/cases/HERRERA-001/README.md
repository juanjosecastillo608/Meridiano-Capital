# HERRERA-001 — Índice del caso

Adquisición de edificio residencial inconcluso — Barrio Herrera, Asunción, Paraguay. Análisis de inversión (¿comprar, terminar y vender?), no negociación de un boleto ya firmado. Sigue el **prompt maestro "Investment Real Estate Analysis System"** (founder, 2026-08-12).

## Estado actual: 🟢 Comisión de venta, financiamiento y piso de renta cerrados — matriz de decisión venta/retención construida

El founder cerró tres bloqueantes: la comisión de venta es **5,5% siempre**, con un reparto que varía según el canal (dos puntas propio, equipo interno, franquicia RE/MAX o Century 21, agente independiente); el financiamiento del trato es **con fondos propios**, sin deuda; y el alquiler de las unidades retenidas tiene que respetar un **piso** formalizado como % de rentabilidad anual sobre el costo de entrada. Con esos tres criterios, se construyó una matriz de decisión que compara el margen de vender una unidad contra el ingreso de un año de alquiler al piso — el hallazgo es que, dado que el margen de desarrollador de Herrera es estructuralmente delgado, **retener casi siempre supera a vender en pura rentabilidad**, y el límite real al % de retención no es la rentabilidad sino cuánta caja hace falta vender para financiar la obra (dato que todavía falta). Ver `08-comision-financiamiento-piso-renta-y-matriz-decision.md`.

## Archivos de este caso

| Archivo | Contenido |
|---|---|
| `00-data-room-index.md` | Data Room (categorías A–J): terreno, proyecto, mercado, los 3 ángulos de análisis |
| `01-informacion-critica-faltante.md` | Qué se resolvió y qué sigue pendiente |
| `02-plantillas-de-referencia.md` | Las 2 planillas Excel de metodología aportadas el 2026-08-12 |
| `03-presupuesto-y-comparables.md` | Presupuesto de terminación real, avance de obra (73,5%), comparable de mercado real (Filum Herrera) |
| `04-comprar-vs-construir.md` | Comparación comprar-y-terminar vs. terreno crudo + construcción desde cero |
| `05-angulo-2-y-3-tipologias-chicas.md` | Costeo ilustrativo del Ángulo 2 y Ángulo 3 (mix de unidades propuesto) |
| `06-margen-neto-comision-y-precios-por-piso.md` | Permiso municipal confirmado, precio por piso, cocheras, margen neto de comisión de venta |
| `07-costos-desagregados-y-estrategia-venta-renta.md` | Costos desagregados por ítem, estrategia híbrida venta/retención con demostración del mecanismo vía `calculadora.py`, propuesta preliminar de % por ángulo (superada parcialmente por `08-...md`) |
| `08-comision-financiamiento-piso-renta-y-matriz-decision.md` | **Nuevo (2026-08-14)**: política definitiva de comisión de venta (5,5%, reparto por canal), financiamiento confirmado (fondos propios), piso de alquiler formalizado por tipología, matriz de decisión venta vs. retención |
| `source-documents/` | Brochure oficial, planos técnicos, y las 2 planillas Excel de referencia, sin modificar |

## Próximo paso

1. Relevar renta mensual real esperada por tipo de unidad en Barrio Herrera (ya hay un piso formalizado, `08-...md` §3, pero falta el dato de mercado real).
2. Definir el cronograma de obra y el capital propio disponible por adelantado — determina cuánto hay que vender para financiar la construcción, que es hoy el verdadero límite al % de retención por ángulo (`08-...md` §4.4).
3. Con eso, construir el flujo de fondos multi-año completo (venta + renta + todos los costos desagregados) y recién ahí la recomendación final.
