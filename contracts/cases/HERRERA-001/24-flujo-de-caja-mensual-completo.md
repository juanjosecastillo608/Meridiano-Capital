Estado: CURRENT — flujo de caja mensual completo (egresos de obra + cobro real de ventas con cuotas de compradores), primer modelo integrado del caso
Fuente original: combinación de `11-...md`, `18-...md` y `19-...md`, modelado propio a pedido del founder
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-16

# Flujo de caja mensual completo — egresos de obra + cobro real de ventas

## 0. Qué hace este documento, y un hallazgo que corrige la lectura anterior

Combina, por primera vez, los tres componentes que hasta ahora estaban en archivos separados: **egresos de construcción** (`18-cronograma-de-caja-v2-capital-vs-ventas.md`), **ritmo de venta por etapa** (`11-ritmo-de-venta-y-piso-de-plusvalia.md`) y **esquema de cuotas de compradores** (`19-esquema-de-financiamiento-de-compradores.md`). Al integrarlos, aparece un hallazgo real que **corrige la lectura de `18-...md` §2.2** (que decía "no hay tensión de caja real"):

> **`18-...md` trataba cada venta como si entrara en caja de una sola vez, al momento de la venta — pero con el esquema de cuotas real (20% inmediato + 70% en cuotas que se cobran mes a mes + 10% recién en la entrega), el dinero de las ventas entra mucho más lento de lo que ese modelo simplificado asumía.** Al modelarlo con el cobro real, sí aparece una tensión de caja — más adelante en el proyecto (meses 9 a 13), no en el mes 1 como se había detectado originalmente en `16-...md` (ya resuelto).

---

## 1. Metodología y supuestos — categoría B/C, no todos son datos confirmados

**Confirmado por el founder (categoría A)**: el cronograma de egresos (`18-...md`), el ritmo de venta 30/40/30 por etapa (`11-...md`), y el esquema de cuotas 20/70/10 (`19-...md`).

**Supuesto propio, no especificado por el founder con esta precisión (categoría C)** — cómo se distribuyen las etapas del ritmo de venta dentro de los 12 meses, dado que las ventas no pueden empezar antes del mes 4 (`18-...md` §2):

| Etapa | % de la meta de venta | Meses asignados (supuesto) |
|---|---|---|
| Lanzamiento | 30% | Mes 4 (un solo mes, evento de lanzamiento) |
| Durante obra | 40% | Meses 5 a 9 (5 meses, repartido en partes iguales) |
| Finalización | 30% | Meses 10 a 12 (3 meses, repartido en partes iguales) |

**Caso límite señalado, no una regla del founder**: comprar en el mes 12 (el último mes de obra) no deja ningún mes disponible para cuotas (`19-...md` §3: cuotas = plazo − mes de compra = 0). Se resolvió asumiendo que, en ese caso límite, el 20%+70% se cobran juntos en el mismo mes de compra (90% de una sola vez), y el 10% en la entrega — una resolución razonable del caso límite, no algo que el founder haya especificado.

---

## 2. Flujo de caja mensual — Ángulo 1

| Mes | Egreso (construcción) | Ingreso por ventas (cobro real) | Neto | Capital propio acumulado usado | **Saldo de capital propio** |
|---|---|---|---|---|---|
| 1 | 948.729 | 0 | 948.729 | 948.729 | 1.028.478 |
| 2 | 197.458 | 0 | 197.458 | 1.146.187 | 831.020 |
| 3 | 197.458 | 0 | 197.458 | 1.343.645 | 633.561 |
| 4 | 197.458 | 50.842 | 146.616 | 1.490.261 | 486.946 |
| 5 | 160.435 | 35.802 | 124.633 | 1.614.894 | 362.313 |
| 6 | 160.435 | 42.581 | 117.854 | 1.732.748 | 244.459 |
| 7 | 160.435 | 50.489 | 109.945 | 1.842.694 | 134.513 |
| 8 | 160.435 | 59.980 | 100.455 | 1.943.148 | 34.058 |
| **9** | 160.435 | 71.843 | 88.591 | 2.031.740 | **−54.533** |
| 10 | 160.435 | 91.050 | 69.384 | 2.101.124 | −123.917 |
| 11 | 160.435 | 120.708 | 39.726 | 2.140.850 | −163.644 |
| 12 | 160.435 | 239.341 | −78.906 | 2.140.850 | −163.644 |
| 13 (entrega) | 0 | 84.737 | −84.737 | 2.140.850 | **−163.644** |

**El capital propio (70% de la Inversión Total, USD 1.977.207) se agota en el mes 9** — y el déficit acumulado llega a **USD 163.644** hacia el final del proyecto (mes 12-13), incluso después de haber cobrado el 100% de la meta de ventas (verificado: el total cobrado en los 13 meses coincide exactamente con la meta de ventas, USD 847.374).

## 3. Ángulo 3 y Ángulo 2 — mismo patrón

| | Ángulo 1 | Ángulo 3 | Ángulo 2 |
|---|---|---|---|
| Capital propio (70%) | USD 1.977.207 | USD 2.106.864 | USD 2.291.537 |
| Meta de ventas (30%) | USD 847.374 | USD 902.942 | USD 982.087 |
| **Mes en que se agota el capital propio** | **Mes 9** | **Mes 9** | **Mes 9** |
| **Déficit máximo acumulado (mes 12-13)** | **USD 163.644** | **USD 169.846** | **USD 178.680** |

**Los tres Ángulos muestran el mismo patrón**: el capital propio alcanza cómodamente hasta el mes 8, se agota en el mes 9, y el déficit crece hasta terminar el proyecto en un rango de USD 164.000–179.000 — pese a que, en términos de monto total (no de timing), capital propio + ventas suman exactamente el 100% de la Inversión Total en los tres casos. **No es un problema de fondos insuficientes — es un problema de timing**: el dinero de las ventas entra más lento (por las cuotas) de lo que la obra necesita gastarlo.

---

## 4. Lectura y opciones para cerrar la brecha

El déficit de timing (~USD 164.000–179.000 según el Ángulo) puede resolverse, sin cambiar el monto total de fondeo, con alguna combinación de:

1. **Capital propio adicional de los socios** por encima del 70% original, como colchón para los meses 9-13 — la opción más directa, sujeta a cuánto capital adicional estén dispuestos a aportar.
2. **Acelerar el cobro** — por ejemplo, subir el % de entrega inicial (hoy 20%) o achicar la cantidad de cuotas, aunque esto se apartaría del esquema 20/70/10 ya estandarizado como norma (D-067) para todos los proyectos.
3. **Vender más del 30% mínimo**, o antes en el cronograma (adelantar parte del "durante obra"/"finalización" a meses más tempranos) — reduce el déficit, pero exige más ventas de las que la matriz de decisión (`08-...md` §4) recomienda por rentabilidad pura.
4. **Un puente de financiamiento de corto plazo** solo para los meses 9-13 — reintroduce deuda, algo que el trato había descartado (financiamiento con fondos propios, `08-...md` §2), a evaluar como excepción puntual y acotada, no como cambio de estructura.

**No se elige ninguna opción por cuenta propia** — es una decisión del founder, ahora con el tamaño exacto del problema cuantificado.

---

## 5. Qué queda pendiente

1. **Decisión del founder sobre cómo cerrar el déficit de timing** (sección 4).
2. **Confirmar la distribución de etapas dentro de los 12 meses** (sección 1) — es un supuesto propio razonable, no una especificación exacta del founder; si el founder tiene una distribución más precisa en mente, este modelo se puede recalcular fácilmente.
3. **Confirmar la resolución del caso límite del mes 12** (sección 1) — también es una resolución propia razonable, no una regla del founder.
4. Con la decisión de la sección 4 tomada, este flujo de caja mensual es la base directa para armar los tres escenarios completos del flujo de fondos (`10-...md` §5: venta mínima, venta agresiva, retención total) y, recién ahí, la recomendación final del caso.
