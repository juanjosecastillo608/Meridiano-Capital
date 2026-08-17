Estado: CURRENT — categoría de zona agregada a la tabla de tarifas, agenda de demanda mensual, e idea de Agente de IA de mercado (P-006, no construida todavía)
Fuente original: instrucciones del founder, 2026-08-16
Dominio: INVESTMENT (caso HERRERA-001) — la categoría de zona vive en la tabla cross-cutting, ver `knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md`
Incorporado: 2026-08-16

# Categoría de zona por barrio, agenda de demanda, y Agente de IA de mercado

**⚠️ Corregido por `22-estudio-de-zonas-plusvalia-vs-rentabilidad-y-carmelitas.md`**: la columna "Rentabilidad relativa" de la sección 1 de abajo mezclaba, por error, el concepto de plusvalía (ganancia de capital en la venta) con el de rentabilidad de alquiler (retorno de renta) — el founder corrigió esto explícitamente. Ver `22-...md` §1 para la separación correcta y §2 para el estudio de zonas ampliado con fuentes reales (no solo inferencia propia). La tabla ya está actualizada con la corrección — lo que sigue en esta sección se conserva por trazabilidad de cómo se llegó ahí.

## 1. Categoría de zona — nueva hoja en la tabla de tarifas

*"En nuestra tabla vamos a marcar los barrios por zonas más rentables, zonas residenciales, zonas comerciales, zonas shopping, zona eje corporativo."*

Se agregó una cuarta hoja a la planilla (`knowledge-base/investment/market-intelligence/rentals/market-intelligence/rentals/data/tarifas-alquiler-por-barrio-asuncion.xlsx`), **"Categoría de Zona"**, con un CSV fuente separado (`categoria-de-zona-por-barrio-asuncion.csv`) — es una dimensión del **barrio**, no de cada combinación tipología/tipo de alquiler, por eso vive en una hoja propia en vez de repetirse en cada fila de "Datos".

| Barrio | Categoría de zona | Rentabilidad relativa | Categoría de dato |
|---|---|---|---|
| Luis A. de Herrera | Residencial | Alta (plusvalía >20%/año, dato del founder) | **A** |
| Villa Morra | Eje Corporativo / Mixta | Alta (plusvalía >20%/año, dato del founder) | C |
| Mburucuyá | Eje Corporativo | Alta (plusvalía >20%/año, dato del founder) | C |
| Recoleta | Comercial / Zona Shopping | Alta (plusvalía >20%/año, dato del founder) | C |
| Las Lomas | Residencial (exclusivo) | Alta (plusvalía >20%/año, dato del founder) | C |
| Ycuá Satí | Residencial / Mixta | Media-Alta (sin confirmar) | C |
| Vista Alegre | Residencial (más económica) | Pendiente | C |
| Salvador del Mundo | Residencial / Mixta | Pendiente | C |

**Solo Barrio Herrera tiene categoría A** — es el único dato de zona directamente confirmado por el founder en este mensaje. El resto son inferencias propias de conocimiento general de Asunción (categoría C), consistentes con la caracterización que hace el founder en `13-...md`/`17-...md`, pero no confirmaciones explícitas del founder — a revisar/confirmar caso por caso.

**La columna "rentabilidad relativa" usa como criterio la plusvalía de zona ya confirmada (`13-...md` §2: >20% anual para las zonas nombradas explícitamente)** — no hay todavía datos de yield de alquiler comparados entre zonas para hacer un ranking más fino, solo esa confirmación cualitativa de apreciación de precio.

## 2. Barrio Herrera — confirmado como zona residencial con demanda real de 3 dormitorios amoblados

Ver `20-reconsideracion-3-dormitorios-mix-de-producto.md` §3.1 — este dato ya se aplicó ahí para resolver la pregunta pendiente sobre si existe demanda real de mercado para el segmento premium de 3 dormitorios.

## 3. Agenda — establecer la demanda real de alquileres mes a mes

*"Vamos a dejar agendado para establecer la demanda real de alquileres mes a mes."*

Anotado como pendiente de trabajo futuro, sin acción todavía — no hay un mecanismo hoy para medir demanda (a diferencia de precio, que sí se releva vía listados) mes a mes. Se conecta directamente con la idea de la sección 4.

## 4. Agente de IA de inteligencia de mercado — idea enunciada, no construida (P-006)

*"Generar un Agente de IA que lo vamos a alimentar con datos reales de pedidos de alquileres y también de compra de grupos de WhatsApp de agentes inmobiliarios. Esto nos va a permitir contar con información real, dinámica y actual para nuestros estudios de mercado, y podemos elaborar informes para nuestros inversores por zonas y en tiempo real."*

**Registrada como P-006 en `governance/decisions/DECISION_REGISTER.md`** (sección PROPOSED — ideas no aprobadas/condicionales), no como una decisión ya tomada — es una idea de producto/sistema real y valiosa, pero **no se construyó nada en este turno**, por tres razones:

1. **Requiere integración externa real** (WhatsApp Business API o un mecanismo de lectura de grupos) que no existe hoy en el repo ni tiene credenciales/acceso configurado.
2. **Necesita más especificación** antes de poder diseñarse en serio: ¿qué grupos específicos, con qué consentimiento/legalidad para usar esos datos comercialmente, con qué frecuencia se procesan, quién modera la calidad del dato antes de que entre a un informe para inversores?
3. **Es un sistema cross-cutting de mercado**, no específico de Herrera — encaja mejor como un proyecto de `production/app/` o una nueva skill/workflow (`skills/`, `workflows/`) del repo, no como un archivo de este caso.

**Qué sí se puede decir ya**: la tabla de tarifas por barrio (`knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md`, D-066) es la base de datos que este agente alimentaría — el diseño de esa tabla (formato largo, categorías A/B/C/D, actualizable) ya está pensado para poder recibir datos de una fuente automatizada en el futuro, no solo de búsquedas manuales.

## 5. Barrios agregados esta vuelta

*"Vamos a seguir completando barrios."*

Se sumó **Carmelitas** (monoambiente USD 390–750/mes, InfoCasas/Clasipar) — con una salvedad: **"Carmelitas" no aparece como barrio oficial separado en el plano municipal** que aportó el founder — es un nombre de zona muy usado comercialmente en los listados, probablemente una sub-zona de San Roque o Recoleta. Se anotó el dato en el script de generación de la tabla, pero **no se agregó como fila nueva** hasta reconciliar a qué barrio oficial corresponde — para no romper la estructura de 66 barrios ya establecida con un nombre que podría ser duplicado de otro barrio ya existente en la lista.

## 6. Qué queda pendiente

1. **Confirmar la categoría de zona de los barrios ya cargados** (sección 1) — solo Herrera está confirmado por el founder, el resto es inferencia propia.
2. **Reconciliar "Carmelitas" con su barrio oficial** (sección 5) antes de incorporar su dato a la tabla principal.
3. **Especificar el alcance del Agente de IA de mercado** (sección 4) si el founder quiere avanzar con el diseño — qué grupos, qué consentimiento, qué frecuencia, quién modera.
4. Seguir completando los 58 barrios restantes de la tabla — trabajo de investigación continuo.
