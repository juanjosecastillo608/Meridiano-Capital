Estado: CURRENT
Fuente original: meridiano-capital-identity/SKILL.md
Dominio: AI

# Dominio AI — Vision general

## Que cubre este dominio

Este dominio (`knowledge-base/ai/`) gobierna **como debe comportarse cualquier agente de IA** (Claude Code, Claude.ai, o cualquier otro asistente) cuando actua en nombre de Meridiano Capital y su sub-marca Urbannit. No es un dominio de contenido de marca (eso vive en `knowledge-base/brand/` y `knowledge-base/marketing/`) — es el **dominio de gobernanza del comportamiento del agente**: los protocolos, la jerarquia de prioridad, el sistema de enrutamiento de consultas, los roles que el agente debe asumir, y las herramientas de auditoria (matriz de decision, motor de prompts) que el agente usa para producir y validar trabajo de marca.

Existe como dominio propio, separado de "brand" y "marketing", porque estas reglas no describen *que es* la marca (eso es contenido) sino *como debe operar un agente* cuando produce o audita cualquier activo de marca. Son reglas procedimentales, no reglas de contenido.

## Por que este dominio existe y por que importa tanto como un equipo humano

En Meridiano Capital, los agentes de IA no son una herramienta auxiliar ocasional: son uno de los **metodos de produccion primarios** de contenido, diseño, copy, presentaciones, prompts de imagen/video, y auditoria de marca. Cualquier output que un agente de IA produzca para la marca — un post de Instagram, un brochure, un prompt de generacion de imagen, un veredicto sobre si una pieza esta alineada — tiene el mismo peso y la misma exposicion publica que el trabajo de un diseñador, copywriter o brand manager humano.

Por eso, el comportamiento de un agente de IA actuando para Meridiano Capital debe estar gobernado con el mismo rigor — o mayor — que el de un miembro humano del equipo de marca: reglas explicitas de prioridad cuando hay conflicto, protocolos obligatorios cuando algo no esta definido, roles claros que debe asumir, y una auditoria de calidad obligatoria antes de entregar cualquier pieza. Sin este dominio, cada agente (o cada sesion del mismo agente) podria improvisar reglas, inventar excepciones, o entregar trabajo sin auditar — erosionando exactamente la coherencia de marca que el resto del sistema (`brand/`, `marketing/`) existe para proteger.

## Contenido de este dominio

| Archivo | Contenido | Fuente (Modulo original) |
|---|---|---|
| `01-protocolo-de-prioridad.md` | Orden de resolucion cuando hay contradicciones entre fuentes o reglas | Modulo 16 |
| `02-protocolo-regla-no-definida.md` | Protocolo obligatorio de 4 pasos cuando una decision no esta cubierta por el manual oficial (OFICIAL vs [EXTENSION]) | Seccion "Estado de cada regla" del SKILL.md |
| `03-sistema-de-consulta.md` | Tabla de enrutamiento: que modulos/dominios consultar segun el tipo de pedido | Modulo 17 |
| `04-director-creativo-y-brand-guardian.md` | Los tres roles simultaneos que debe asumir el agente al crear (Director Creativo, Brand Strategist, Brand Guardian) y el protocolo de auditoria previo a cualquier entrega | Modulos 18 y 19 |
| `05-matriz-de-decision.md` | Los 10 criterios de auditoria de alineacion de marca, con formato de salida y regla de veredicto | `references/15-matriz-de-decision.md` |
| `06-prompt-engine.md` | Motor de construccion de prompts de IA (imagen/video) alineados a la Direccion de Arte y Paleta de marca | `references/14-prompt-engine-de-marca.md` |

## Principio rector heredado

El principio que gobierna todo el sistema de marca aplica integramente a este dominio:

> "Toda pieza, diseño, experiencia, comunicacion o contenido que represente a la marca debe respetar y aplicar la identidad definida en esta skill."

El **Manual de Marca oficial** (`Meridiano_Capital_Brand_Guidelines_v1.docx`) sigue siendo la fuente de autoridad principal. Este dominio organiza, interpreta y aplica ese manual — nunca lo contradice ni inventa reglas oficiales nuevas. Un agente de IA que actua para Meridiano Capital nunca improvisa una regla oficial; cuando algo no esta definido, sigue el protocolo de `02-protocolo-regla-no-definida.md` sin excepcion.

> UNRESOLVED: los dominios `knowledge-base/brand/` y `knowledge-base/marketing/` todavia no tienen archivos migrados (carpetas vacias al momento de esta migracion). Las rutas propuestas en `03-sistema-de-consulta.md` son la estructura destino recomendada, pendiente de que esos dominios se migren desde `inventory/_raw-copies/meridiano-capital-identity/references/`.
