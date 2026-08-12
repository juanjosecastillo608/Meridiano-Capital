# UON-001 — NEGOTIATION CASES
Primer caso de negociación del sistema V2 (Step 9 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`), formato de la Sección 19 del prompt maestro V2. Vinculado a `UON-ISSUE-003`, `CR-004` y `DECISION-003` (`UNDER_REVIEW`) — este documento **estructura el análisis, no reemplaza la decisión**. La Sección 44 (Human-in-the-loop) exige aprobación humana explícita para decisiones comerciales críticas; nada de lo que sigue se marca como decidido.

**Regla dura (Sección 20):** no conceder sin contrapartida. La contrapartida no tiene que ser monetaria — puede ser plazo, documentación, firma, condición, renuncia, claridad o compromiso.

**Uso interno.** El campo "Mensaje recomendado" ya está filtrado para uso externo (no revela línea roja, margen ni estrategia) — el resto del documento no.

---

## NEG-001 — Cronograma de pago del saldo (Cláusula 2.1.2/2.1.3)

### Posición del comprador
Pagar el saldo final (~USD 55.000) recién contra la firma de la escritura pública, no antes.

### Interés del comprador
No quedar 100% expuesto financieramente sin haber recibido la titularidad legal. El boleto vigente le exige pagar la totalidad antes del 10/09/2026, mientras que la escritura (Cláusula 10.1) puede demorar hasta 5 meses adicionales por su propia redacción ambigua (`UON-ISSUE-005`) — desde la perspectiva del comprador, eso significa meses sin el dinero y sin el título.

### Posición del vendedor
Cronograma actual del boleto: seña USD 2.000 + USD 55.000 a los 5 días hábiles + USD 55.000 dentro de los primeros 10 días de septiembre (100% pagado antes de la escritura).

### Interés del vendedor
Flujo de caja — necesita el dinero disponible pronto, no atado a un trámite de escritura cuyo plazo no controla del todo (depende de la protocolización del reglamento de copropiedad, Cláusula 10.1). También busca reducir el riesgo de que el comprador tome posesión sin haber completado el pago.

### Posición de Meridiano Capital
Ninguna tomada todavía — es intermediario, no parte del cronograma en sí.

### Interés de Meridiano Capital
Cerrar la operación sin fricción; mantener la relación con ambas partes (el comprador es un cliente potencialmente recurrente — nacionalidad brasileña, ya vive en el mismo barrio del proyecto; el vendedor/ADESA es un desarrollador con el que Meridiano puede volver a trabajar); evitar exponerse a un reclamo si el cronograma finalmente pactado no es razonable para ninguna de las dos partes.

### Riesgo
Si no se resuelve: el comprador puede firmar bajo protesta (mala experiencia, riesgo reputacional) o directamente frenar la operación en este punto — es la única condición de pago que sigue sin confirmación después de 7 objeciones ya resueltas. Si se resuelve mal (a favor de una sola parte sin contrapartida): o el vendedor queda financiando la operación sin cobrar por meses, o el comprador paga el 100% muchas semanas antes de tener certeza jurídica — el mismo riesgo que motivó su objeción original.

### Margen
Está en el **momento y la certeza del último pago**, no en el monto total (USD 112.000 no está en discusión — `FACT-011`). El comprador ya aceptó tácitamente la seña de USD 2.000 y el primer pago de USD 55.000 a los 5 días hábiles (coincide con su propia contrapropuesta) — el único tramo en disputa real es el último ~USD 55.000.

### Concesión posible
Retener una porción del saldo final (no el 100%) hasta un hito más cercano a la seguridad jurídica del comprador, en vez de exigirlo todo antes de septiembre — por ejemplo, atar el último tramo a un plazo cierto y corto después de que el vendedor notifique estar en condiciones de escriturar (no a la escritura en sí, que hoy no tiene fecha firme por `UON-ISSUE-005`).

### Contrapartida necesaria (Sección 20 — no ceder sin contrapartida)
Si el vendedor concede en posponer parte del saldo, algo razonable a pedir a cambio:
- Que el comprador acepte un **plazo máximo cierto** para ese pago diferido (no "hasta la escritura" sin límite, que hoy podría estirarse por la ambigüedad de la Cláusula 10.1) — esto además obliga a resolver primero `UON-ISSUE-005`, lo cual conviene a ambas partes.
- Que el comprador confirme el "fondo de reserva" del 0,5% (`UON-ISSUE-004`) sin objeción, como parte del mismo paquete de cierre del cronograma.

### Línea roja
- **Del vendedor:** no diferir el 100% del saldo hasta una escritura sin fecha cierta — ya cedió considerablemente al bajar la seña de v1 (40%, USD 44.800) a v2 (USD 2.000 simbólicos).
- **Del comprador:** no pagar el saldo completo sin ningún tipo de certeza jurídica intermedia (ej. trámite de propiedad horizontal ya concluido, no solo "en trámite").

### Alternativa (recomendación para elevar a decisión, Gate 3)
Mantener la seña (USD 2.000) y el primer pago (USD 55.000 a 5 días hábiles) sin cambios — ahí no hay objeción real. Para el último tramo (~USD 55.000): en vez de "primeros 10 días de septiembre" (fecha fija, hoy sin relación clara con el estado real del trámite), atarlo a un hito verificable y más cercano a la seguridad del comprador — por ejemplo, la conclusión del trámite de propiedad horizontal (`FACT-014`, hoy en su etapa final) más un plazo corto y cierto, en lugar de la escritura completa (que puede demorar más por causas ajenas a ambas partes). Esto no es una decisión — es la opción que este análisis recomienda evaluar primero en el Gate 3.

### Estrategia
No abrir la negociación ofreciendo directamente la opción anterior — primero preguntarle al comprador, con la carta ya enviada (`client-response/`), si el esquema actual le genera un problema real o si es solo falta de confirmación. Si objeta activamente, tener la alternativa lista como contraoferta con su contrapartida (plazo cierto + fondo de reserva) ya empaquetada, no como dos pedidos separados.

### Mensaje recomendado (filtrado para uso externo — no revela línea roja ni margen)
*"Estamos terminando de confirmar el cronograma de pago para que el último tramo quede atado a un hito claro del trámite de la unidad, no solo a una fecha calendario. Te lo confirmamos en los próximos días junto con el resto de los puntos pendientes."* — coincide con lo ya enviado en `client-response/UON-001_Respuesta_Cliente_2026-08-11.docx`, sin necesidad de reemplazarlo todavía.

**Estado:** `OPEN` — pendiente de Gate 3 (decisión comercial de Meridiano/vendedor) antes de volver al comprador con una propuesta concreta.
