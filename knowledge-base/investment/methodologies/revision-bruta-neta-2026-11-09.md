Estado: CURRENT (D-101), aprobada por el founder el 09/11/2026. Pendiente: confirmación de la contadora (crédito fiscal y depreciación).
Dominio: INVESTMENT

# Revisión de las bases de cálculo: de la rentabilidad bruta a la neta

**Pedido del founder (09/11/2026):** *"nos cae mucho la rentabilidad neta con respecto a la bruta, en algunos casos cae un 50%"*.

## 1. Diagnóstico: cuánto cae y por qué

En las presentaciones de Sajonia, San Roque, Galería San Blas y Humaitá, la neta final es **entre el 46% y el 69% de la bruta**. Excepción: el hostel, con 15%, porque es un negocio operativo y no un alquiler. El motor oficial (`calculadora.py`, nivel 3, departamento sin muebles) da una neta cercana al **60% de la bruta**.

**Una caída del 35–40% es normal y no es un error.** Ninguna presentación tiene errores de fórmula: se verificó línea por línea. Lo que sí hay son tres criterios demasiado conservadores y un caso de doble conteo.

**Desglose típico (% del ingreso bruto):**

| Concepto | Decks actuales | Motor oficial |
|---|---:|---:|
| IVA | 5–10 | 5 |
| Vacancia | 4–15 | 3 |
| Administración | 8 | 10 + 0,5 mes de colocación (≈ 4) |
| Mantenimiento | 5 | 5 |
| Seguro e impuesto inmobiliario / gastos fijos | 2,5–21 | 2 + 4 |
| IRE (10% del resultado) | 5–7 | ≈ 6,7 |
| **Neta / bruta** | **46–69%** | **≈ 60%** |

## 2. Observaciones

1. **IVA calculado sobre el alquiler como si fuera un precio sin IVA.**
   - Los alquileres de mercado se publican como precio final. El IVA contenido es alquiler × tasa ÷ (1 + tasa): 4,76% en vivienda y 9,09% en comercial. Hoy se usa 5% y 10%.
   - **Crédito fiscal no considerado.** Una S.A. inscripta descuenta del IVA cobrado el IVA pagado en administración, mantenimiento y, sobre todo, en la **obra**. En Humaitá B, el IVA de la obra (unos USD 18.400) cubre unos 7 años de IVA de los alquileres. En Sajonia A cubre unos 4 años.
   - Es el ajuste de mayor efecto en los proyectos con obra. **Lo debe confirmar la contadora** (D-001 fijó las tasas, no el crédito fiscal).
2. **IRE sin depreciación.**
   - Hoy el IRE es el 10% del resultado antes de impuestos.
   - La base real descuenta la depreciación del edificio y de las mejoras. Se supone 2,5% anual, a confirmar con la contadora.
3. **Doble conteo de gastos fijos (Humaitá A).**
   - Se cargaron USD 6.000 por año de gastos fijos, el 20,8% del bruto.
   - La tabla del propietario cobra expensas a los inquilinos (Gs 2,25 M por mes).
   - Si las expensas cubren las áreas comunes, al propietario solo le quedan el seguro y el impuesto inmobiliario.
4. **Mantenimiento del 5% en edificios recién remodelados.**
   - Es razonable a largo plazo. En los primeros años después de una obra integral podría bajar al 2–3%.
   - Queda como supuesto conservador; no se cambia sin decisión del founder.
5. **Criterios que no son errores:**
   - **Hostel:** la caída responde a sus costos reales de operación (plataformas, limpieza y personal). Por eso la bruta del hostel no se compara con la de un alquiler; se compara la neta.
   - **Vacancia de locales comerciales (10–15%):** es un supuesto de prudencia, distinto del 3% del motor, que está pensado para vivienda.

## 3. Efecto de la propuesta (ejemplos)

Escenario de la propuesta: IVA contenido en el precio con crédito fiscal de los gastos, gastos fijos sin doble conteo, e IRE con depreciación del 2,5% sobre la obra más el 50% del precio.

| Caso | Neta actual | Neta propuesta | Neta / bruta |
|---|---:|---:|---:|
| Humaitá A (USD 160.000) | 5,00% | 6,78% | 48% → 65% |
| Humaitá B (USD 160.000) | 6,57% | 6,95% | 46% → 49% |
| Sajonia A (USD 220.000) | 6,87% | 7,28% | 58% → 61% |

El crédito fiscal de la obra no entra en la neta anual estabilizada: es un beneficio de los primeros años. Debería sumarse al flujo de caja de la TIR.

## 4. Pendiente de decisión
- [x] Founder: aprobado el 09/11/2026 (D-101).
- [ ] Contadora: confirmar el crédito fiscal de la obra y de los gastos para una S.A. que alquila, y la vida útil y el método de depreciación en el IRE.
- [x] Humaitá A: se toma la tabla del propietario (expensas a cargo de los inquilinos).
- [x] Aplicado al Edificio Humaitá: A 6,82%, B 7,19%, C 4,81% de neta (antes 5,00 / 6,57 / 3,49%).
- [ ] Extender a `calculadora.py` (con tests) y al resto de los decks.
