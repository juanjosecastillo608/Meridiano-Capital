# Catálogo — Commitment
Poblado en Step 10, a partir de `cases/UON-001/commitments/COMMITMENT_REGISTER.md` (prompt maestro V2, Sección 28).

## Estados
`OPEN` · `FULFILLED` · `OVERDUE` · `CANCELLED`

## Regla dura
Un compromiso con el cliente (o cualquier contraparte) recién es exigible **desde que efectivamente se comunicó**, no desde que se redactó. Si no consta la fecha de envío/comunicación real, la "Fecha límite" no puede ser una fecha fija — se calcula como un plazo relativo ("X días desde el envío") hasta que esa fecha se confirme. Nunca inventar una fecha límite absoluta para completar el campo — dejarla condicional es preferible a una fecha inventada.
