# Catálogo — Contract Version
Poblado en Step 7, a partir de `cases/UON-001/contract-versions/CONTRACT_VERSION_CONTROL.md` (prompt maestro V2, Sección 12).

## Estados
`DRAFT` · `PROPOSED` · `UNDER_REVIEW` · `APPROVED` · `CURRENT` · `SUPERSEDED` · `ARCHIVED`

## Regla dura
Debe existir siempre una única versión `CURRENT` — **o ninguna**, si ninguna versión pasó por el Gate 4 (Contract Change, Sección 11). Nunca asumir que la versión más reciente en circulación es la `CURRENT` de hecho: eso fue exactamente el error que produjo `UON-ISSUE-001`/`002` en UON-001 (v2 circulaba como "vigente" sin haber pasado por una aprobación formal).

## Cómo calcular el hash
`sha256sum <archivo>` — se registra completo en el propio archivo del caso (acá se abrevia a 16 caracteres por legibilidad). Sirve para detectar si un documento que circula por fuera del repo (ej. adjunto de un email) es exactamente el mismo que el registrado acá, o fue alterado.
