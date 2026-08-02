Estado: CURRENT
Fuente original: meridiano-capital-identity/SKILL.md (seccion "Estado de cada regla: OFICIAL vs. [EXTENSION]" y "Protocolo obligatorio cuando una decision no esta definida en el manual")
Dominio: AI

# Protocolo de Regla No Definida (OFICIAL vs. [EXTENSION])

Esta es una de las reglas de gobernanza mas importantes de todo el sistema de marca. Gobierna que debe hacer un agente de IA en el momento exacto en que descubre que el Manual de Marca oficial no cubre el caso que tiene enfrente. Se reconstruye aqui de forma precisa y completa, sin parafrasear su fuerza normativa.

## Los dos estados de cualquier regla

Todo contenido de marca (en `knowledge-base/brand/`, `knowledge-base/marketing/` o `knowledge-base/ai/`) debe marcarse explicitamente como uno de estos dos estados — a nivel de archivo completo, o seccion por seccion dentro de un archivo mixto:

- **OFICIAL** — viene literal o casi literal del Brand Guidelines v1.0 (`Meridiano_Capital_Brand_Guidelines_v1.docx`). No se contradice, no se reinterpreta, no se "mejora" por iniciativa propia del agente.
- **[EXTENSION]** — el manual no cubre ese caso explicitamente. Es una solucion coherente derivada de los principios generales de marca (ADN de marca, arquetipo, paleta, tono), presentada **siempre como recomendacion**, nunca como regla oficial cerrada.

## Protocolo obligatorio cuando una decision no esta definida en el manual

Cuando un agente de IA se encuentra ante una decision de marca que el Brand Guidelines oficial no resuelve explicitamente, debe ejecutar estos cuatro pasos, en este orden, sin excepcion:

1. **Identificar** explicitamente que la regla no esta definida en el Brand Guidelines oficial.
2. **Proponer** una solucion coherente usando los principios generales de marca (ADN de marca, arquetipo, paleta, tono — es decir, los modulos de fundamentos de identidad, no las reglas especificas de canal).
3. **Indicar con claridad** que se trata de una recomendacion o extension del sistema, no una regla oficial — usar literalmente la etiqueta **"[EXTENSION]"** o la frase **"esto es una recomendacion, no una regla oficial del manual"** en la respuesta al usuario.
4. **Nunca** presentar esa recomendacion nueva como si fuera una regla oficial ya establecida.

**Este protocolo aplica sin excepcion, incluso cuando la extension parezca obvia o de sentido comun.** No hay un umbral de "obviedad" que exima al agente de declarar el estado [EXTENSION] — la obligacion de declarar es incondicional.

## Por que esto es innegociable para un agente de IA

Un agente de IA que no distingue entre "esto lo dice el manual" y "esto lo estoy proponiendo yo" erosiona silenciosamente la autoridad del Manual de Marca: con el tiempo, recomendaciones no declaradas se tratan como reglas oficiales, se repiten en sesiones futuras como si fueran canon, y la marca termina gobernada por acumulacion de improvisaciones no auditadas en vez de por el manual real. Declarar el estado de cada regla es lo que mantiene auditable — y revertible — cualquier extension del sistema.

## Aplicacion practica

- Cualquier archivo o seccion de `knowledge-base/` que no derive literalmente del Brand Guidelines oficial debe llevar la etiqueta `Estado: [EXTENSION]` (ver por ejemplo `knowledge-base/ai/05-matriz-de-decision.md` y `knowledge-base/ai/06-prompt-engine.md`, ambos [EXTENSION] en su fuente original).
- Cuando un agente entrega una pieza de marca y parte de las decisiones tomadas caen bajo este protocolo, debe declararlo explicitamente en la entrega (ver tambien `knowledge-base/ai/04-director-creativo-y-brand-guardian.md`, paso 4 de la auditoria Brand Guardian).
- Este protocolo tiene precedencia sobre la conveniencia: un agente nunca debe omitir la declaracion [EXTENSION] para que una entrega "suene mas segura" o mas autorizada de lo que realmente es.
