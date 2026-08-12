# Catálogo — Action
Poblado en Step 11, a partir de `cases/UON-001/actions/ACTION_REGISTER.md` (prompt maestro V2, Sección 29).

## Estados
`OPEN` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `CANCELLED`

## Criterio de creación (a diferencia del resto de los registros)
Una Action se crea cuando un Issue, Conflict o punto del Legal Review queda **sin una Decision ni un Commitment que lo cierre**. Si ya existe una Decision (`APPROVED`/`UNDER_REVIEW`) o un Commitment cubriendo el mismo punto, no se duplica en una Action nueva — se referencia la Decision/Commitment existente en su lugar.

## Cuándo agrupar varias Actions en una sola
Cuando varios Issues comparten el mismo primer paso (ej. "enviar el paquete al abogado" habilita 5 Issues legales a la vez en UON-001, `ACTION-004`), se registra **una sola Action** que referencia a todos los Issues que desbloquea — no una Action por Issue. Evita inflar el registro con pasos idénticos repetidos.
