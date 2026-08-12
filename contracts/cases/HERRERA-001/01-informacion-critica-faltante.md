Estado: CURRENT
Fuente original: prompt maestro "MERIDIANO CAPITAL — Investment Real Estate Analysis System" (founder, 2026-08-12), §29
Dominio: INVESTMENT / LEGAL (caso HERRERA-001)
Incorporado: 2026-08-12

# INFORMACIÓN CRÍTICA FALTANTE — HERRERA-001

Ninguno de los cálculos que pide el prompt maestro (costo total, rentabilidad, TIR/VAN, precio máximo de compra, sensibilidad) se puede hacer sin datos reales — hacerlo ahora significaría inventar precios de mercado, costos de construcción y superficies, exactamente lo que la regla §26 del propio prompt maestro prohíbe explícitamente. Esta lista es el punto de partida real del caso.

## Bloque 1 — Sin esto no se puede avanzar nada (P0)

1. **Precio solicitado por el vendedor** y condiciones de pago — sin esto no hay "costo de adquisición" que calcular.
2. **Superficie del terreno** (m²) y su documentación (plano de mensura o similar).
3. **Planos del proyecto** — plantas, cortes, fachadas, cantidad de unidades, superficies por unidad. Sin esto no se puede construir la tabla maestra de superficies (§8) ni saber cuánto hay para vender.
4. **Informe de avance de obra** — qué está ejecutado realmente (estructura, mampostería, instalaciones) más allá de "hasta el 4º piso", que el propio prompt maestro advierte que no equivale a un % de avance sin desglosar por componente.
5. **Presupuesto de terminación** aportado por el ingeniero — sin esto no hay costo de obra pendiente, que es el insumo más grande del costo total del proyecto.

## Bloque 2 — Necesario para el modelo financiero completo (P1)

6. Memoria descriptiva del proyecto (amenities, calidad de terminaciones previstas).
7. Situación jurídica del terreno y de la obra — título, gravámenes, hipotecas, embargos (§22, Due Diligence).
8. Comparables de mercado reales de Herrera y zonas cercanas — precio/m² de departamentos similares en venta o vendidos recientemente. Sin esto, cualquier "precio de venta esperado" sería inventado.
9. Costos ya ejecutados por el vendedor (para contexto, aunque el prompt maestro ya advierte — §10 — que el costo histórico del vendedor no determina el valor actual para Meridiano).
10. Impuestos, tasas y honorarios aplicables a esta operación específica (escribanía, registro, transferencia).

## Bloque 3 — Para due diligence antes de cualquier oferta (P1, en paralelo)

11. Documentación de aprobación municipal del proyecto.
12. Situación laboral/contractual de los contratistas actuales de la obra (si Meridiano continuaría con ellos o no).
13. Deudas asociadas al inmueble o al proyecto que deban cancelarse.

## Qué se puede hacer mientras tanto

Nada del análisis financiero (secciones 6 en adelante del prompt maestro) — pero si el founder puede aportar aunque sea el **Bloque 1 parcial** (por ejemplo, solo el precio del vendedor + los planos), ya se puede empezar el Data Room real (§5) y el análisis técnico del edificio existente (§7) sobre esa base, dejando el resto marcado explícitamente como `D — Pendiente de verificar`, tal como exige la regla de clasificación de datos del propio prompt maestro (§4).

## Siguiente paso

Que el founder adjunte la documentación real que tenga disponible del edificio de Herrera — no hace falta que esté completa; cada documento que llegue se registra en `00-data-room-index.md` con su clasificación de confiabilidad, y el análisis avanza incrementalmente sobre lo que sí exista, nunca sobre supuestos.
