# `knowledge-base/`

Capa KNOWLEDGE de la arquitectura de 10 capas (`documentation/MIGRATION_MASTER_REPORT.md`, Fase 7). Conocimiento reconstruido, no resumido, por dominio: `business/`, `brand/`, `operations/`, `investment/`, `marketing/`, `technology/`, `ai/`, `legal/`.

## Regla absoluta de PII

**`knowledge-base/`, en cualquiera de sus subcarpetas, nunca contiene PII real de clientes.** Ver `governance/PII_POLICY.md` para la política completa (origen: `D-093`, limpieza histórica de PII de `UON-001`, 2026-08-29, donde el nombre real de una clienta se había filtrado hasta acá desde `contracts/`).

Nunca escribir en ningún archivo de esta capa el nombre real, CI, teléfono, email ni domicilio de un cliente, comprador, vendedor o apoderado — ni siquiera en un campo de notas u observaciones. Cuando haga falta dejar constancia de un vínculo con una operación real, referenciar el caso y el `FACT` correspondiente en `contracts/`:

```
ver contracts/cases/<CASE-ID>/facts/FACT_REGISTER.md, FACT-0NN
```

nunca el dato personal en sí. Ver también `knowledge-base/investment/projects/README.md` para la aplicación concreta de esta regla al Project/Unit/Parking Master Database.
