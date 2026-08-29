# `knowledge-base/investment/projects/`

Bases de proyecto real del Project/Unit/Parking Master Database (`skills/project-unit-database/`, SK-15, D-087) — un `project.json` + `units.csv` + `parking.csv` por proyecto, consultados vía `consultar.py` para armar cualquier ficha de inversión o informe de 30 puntos (`skills/investor-report-30/`, SK-18).

## Regla absoluta de PII

**`knowledge-base/investment/projects/` — como el resto de `knowledge-base/` — nunca debe contener PII real de clientes.** Ver `governance/PII_POLICY.md` para la política completa (origen: `D-093`, limpieza histórica de PII de `UON-001`, 2026-08-29, donde el nombre real de una clienta se había filtrado a `units.csv` desde `contracts/`).

Nunca escribir en `project.json`/`units.csv`/`parking.csv` el nombre real, CI, teléfono, email ni domicilio de un comprador/vendedor/apoderado, ni siquiera en un campo de `observaciones`. Cuando haga falta dejar constancia de que una unidad tiene un comprador identificado, un boleto real, o cualquier otro vínculo con una operación concreta, referenciar el caso y el `FACT` correspondiente en `contracts/`:

```
ver contracts/cases/<CASE-ID>/facts/FACT_REGISTER.md, FACT-0NN
```

nunca el dato personal en sí.
