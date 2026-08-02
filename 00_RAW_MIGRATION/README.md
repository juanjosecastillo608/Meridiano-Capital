# 00_RAW_MIGRATION — depósito de material fuente crudo

**Esta carpeta está vacía a propósito.** Todo lo que se migró hasta ahora (`inventory/`, `knowledge-base/`, `decisions/`) viene de 3 Claude Skills ya destiladas, **no de las conversaciones originales de Claude.ai**. Ningún tool de este entorno (Claude Code) tiene acceso al historial de chats de Claude.ai — no hay integración, API ni conector que permita leerlo directamente. Esa es una limitación real de la plataforma, no de permisos.

Si querés que la migración capture también el razonamiento, las versiones descartadas y el "por qué" de decisiones que las conversaciones originales tenían y que las skills ya destiladas perdieron, el material tiene que llegar aquí de alguna de estas formas:

## Opción A — Export completo de Claude.ai (recomendado si querés todo)
1. En claude.ai: **Settings → Account → Export data**.
2. Vas a recibir un email con un archivo descargable (incluye `conversations.json` con todas las conversaciones y los archivos adjuntos que hayas subido).
3. Descomprimí ese archivo acá dentro, por ejemplo:
   ```
   00_RAW_MIGRATION/
     claude-export-2026-08-02/
       conversations.json
       ...archivos adjuntos...
   ```

## Opción B — Copiar/pegar conversaciones puntuales (más rápido si solo importan algunas)
Si no querés esperar el export completo o solo te importan ciertos hilos (por ejemplo, el desarrollo original del brand book, o la conversación donde se definió el modelo de coinversión), copiá el texto completo de esas conversaciones a archivos `.md` o `.txt` acá, con un nombre descriptivo:
```
00_RAW_MIGRATION/
  chat-desarrollo-brand-book.md
  chat-modelo-coinversion-v1.md
  chat-definicion-p07-rentabilidad.md
```

## Qué pasa después de que pongas material acá

Esta carpeta es **solo de lectura para el proceso de migración** — nunca se edita, se sobreescribe ni se borra nada acá (regla de no-destrucción). Cuando haya contenido:

1. Se analiza contra lo que ya existe en `knowledge-base/` y `decisions/DECISION_REGISTER.md`.
2. Si confirma algo ya migrado → se anota la fuente adicional, no se duplica.
3. Si agrega contexto nuevo (el "por qué" de una decisión, una versión anterior reemplazada) → se añade a `decisions/DECISION_REGISTER.md` como entrada HISTORICAL, con trazabilidad a este archivo.
4. Si **contradice** algo ya migrado → se documenta en el Contradiction Register (ver `MIGRATION_MASTER_REPORT.md`) y se te pregunta explícitamente cuál versión es la correcta. Nunca se resuelve en silencio.

Hasta que haya material acá, todo lo migrado se apoya únicamente en las 3 skills ya destiladas — que es la mejor fuente disponible hoy, pero no es lo mismo que el historial completo de razonamiento.
