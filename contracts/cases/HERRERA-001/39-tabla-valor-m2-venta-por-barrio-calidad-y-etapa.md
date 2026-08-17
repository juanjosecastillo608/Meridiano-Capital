Estado: CURRENT — nueva tabla cross-cutting de valor de m² de venta (D-073), primera carga con 16 registros
Fuente original: instrucciones del founder, 2026-08-17
Dominio: INVESTMENT (caso HERRERA-001) — la tabla es cross-cutting, ver `knowledge-base/investment/10-valor-m2-venta-por-barrio-calidad-y-etapa.md` y D-073

# Tabla de valor de m² de venta por barrio, calidad y etapa

## 0. Qué pidió el founder, y qué se construyó

*"Todos estos datos debemos recopilar la información y construir nuestras tablas de valor del m² según barrio y el tipo de construcción, como así también diferenciar los valores del m² de construcción según la etapa constructiva y/o si el edificio ya se encuentra terminado y generando renta."*

Se construyó una tabla cross-cutting nueva — **de venta**, distinta de la tabla de alquileres ya existente (D-066) — con 4 dimensiones: barrio, tipología, etapa constructiva (pozo/en obra/terminado/**terminado y generando renta**), y calidad constructiva. Ver `knowledge-base/investment/10-...md` para la documentación completa.

## 1. Primera carga — 16 registros reales

Se cargaron los 7 comparables de Century 21 ya relevados (`37-...md`) más los 4 datos de Filum Herrera (`03-...md`), organizados en el nuevo formato — 2 barrios cubiertos (Luis A. de Herrera, Ycuá Satí), 16 registros en total, todos categoría A.

**Limitación real, señalada sin forzar un dato**: **ninguno de estos 16 registros tiene la calidad constructiva identificada** — los listados comerciales publican precio final, no el costo de construcción del desarrollador. La columna "Calidad constructiva" queda en "Sin dato específico" en toda la carga — completar esto exigiría información directa de cada desarrollador, no disponible desde listados públicos.

**Tampoco hay todavía ningún dato para la etapa "Terminado, generando renta"** — es una categoría nueva pedida por el founder, distinta de "pozo/en obra/terminado (recién entregado)" — representa el valor de reventa de una unidad con historial de renta, un tipo de dato que el caso no había relevado hasta ahora.

## 2. Qué queda pendiente

1. Seguir completando barrios y la calidad constructiva (donde sea posible confirmarla).
2. Relevar datos reales de la etapa "Terminado, generando renta" — requiere buscar reventas de unidades ya operando, no solo unidades nuevas.
3. Ver `38-comparacion-politicas-de-precio-650-vs-720.md` para el primer uso analítico real de este cruce (calidad vs. precio).
