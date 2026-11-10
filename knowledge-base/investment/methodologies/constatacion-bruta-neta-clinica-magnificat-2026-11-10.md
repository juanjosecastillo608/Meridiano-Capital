Estado: HISTÓRICO como diagnóstico. Las propuestas 1 y 2 de la sección 6 fueron **aprobadas y aplicadas el 10/11/2026 (D-103)**: ver `renta-pura-y-alertas-de-coherencia.md`. La propuesta 3 quedó cubierta por D-103 (rango calculado con la regla única del techo: 3,27–3,95% hoy a USD 500.000). La propuesta 4 (IDU) sigue pendiente de la contadora.
Dominio: INVESTMENT
Base: D-101 (`revision-bruta-neta-2026-11-09.md`, rama `claude/brave-bell-uo88qf`), modelo `projects/meridiano-capital/presentaciones/clinica-magnificat/fuente/model.py`.

# Constatación bruta → neta: ¿hay un error conceptual en D-101?

**Pedido del founder (10/11/2026):** constatar contra la realidad todos los parámetros de la neta (base D-101). Caso testigo: Clínica Magnificat a USD 500.000, con **10,18% bruta y 3,27% neta**. La neta es el 32% de la bruta.

## 1. Conclusión corta

- **D-101 no es la causa.** Los cuatro parámetros de D-101 (IVA, vacancia, mantenimiento e IRE) le restan a la clínica 1,65 puntos. Son el 16% del bruto, en línea con el motor y con los otros decks.
- **El 76% de la caída sale de dos datos del propietario que nadie verificó:**
  - Administración: Gs 10,45 M por mes, que restan 3,87 puntos.
  - Impuesto inmobiliario: Gs 45 M por año, que restan 1,39 puntos.
- **El error conceptual está en la comparación.** El 10,18% no es una bruta de alquiler. Es la facturación de un negocio de consultorios con servicios: secretaria, limpieza y expensas incluidos en el alquiler. Le pasa lo mismo que al hostel de Humaitá C (23% bruta y 4,8% neta), que D-101 ya había excluido de la comparación en bruto.

## 2. Cascada real del caso (USD 500.000, etapa "Hoy")

| Concepto | USD/año | Puntos sobre la inversión | % del bruto | Origen |
|---|---:|---:|---:|---|
| Facturación (11 × Gs 2,5 M × 12) | 50.923 | **10,18** | 100% | DATO |
| Vacancia 5% | −2.546 | −0,51 | 5,0% | SUPUESTO |
| IVA neto (débito 10/110 − crédito) | −3.602 | −0,72 | 7,1% | D-101 |
| Mantenimiento 2% | −1.018 | −0,20 | 2,0% | SUPUESTO |
| **Administración (Gs 10,45 M/mes)** | **−19.351** | **−3,87** | **38,0%** | DATO sin desglose |
| **Impuesto inmobiliario (Gs 45 M/año)** | **−6.944** | **−1,39** | **13,6%** | DATO sin boleta |
| IRE 10% (con depreciación de USD 6.250) | −1.121 | −0,22 | 2,2% | D-101 |
| **Neta** | **16.341** | **3,27** | **32%** | |

TC Gs 6.480,35 (BCP, 06/11/2026). Cifras reproducidas con `model.py`.

## 3. Constatación parámetro por parámetro

| Parámetro | Valor usado | ¿Coincide con la realidad? | Estado |
|---|---|---|---|
| IVA contenido en el alquiler (10/110) | 9,09% del cobrado | Sí: el alquiler informado es "con IVA incluido". | OK (D-101) |
| Crédito fiscal | 40% de la administración + mantenimiento | Conservador. Al 100% la neta sube solo a 3,46%. | OK; lo confirma la contadora |
| Vacancia | 5% | Hoy hay 100% de ocupación, pero los contratos están vencidos. Es razonable. | OK |
| Mantenimiento | 2% | Puede superponerse con la administración, que no tiene desglose. | Verificar con el desglose |
| **Administración** | **38% de la facturación** | **No es un honorario de administración (el del motor es 10%).** Incluye secretaria y, probablemente, limpieza, luz, agua e internet de las áreas comunes. Es costo de operar el servicio, no de administrar un alquiler. | **Sin verificar** |
| **Impuesto inmobiliario** | **Gs 45 M/año** | **Inconsistente con el precio.** El impuesto se calcula sobre la valuación fiscal del catastro. Con la tasa general del 1%, Gs 45 M supone una valuación fiscal de Gs 4.500 M (USD 694.000), mayor que el precio de venta de USD 500.000. Puede incluir deudas atrasadas, tasas municipales u otro concepto. | **Probable error de dato**: pedir la boleta |
| IRE con depreciación | 2,5% sobre el 50% del precio | Peso chico (0,22 puntos). | OK; lo confirma la contadora |
| Segundo piso | sin renta en "Hoy" | Se paga dentro del precio y no produce. Baja la bruta y la neta. | Correcto; la etapa 3 lo resuelve |

`[EXTENSION]`: que la tasa general del impuesto inmobiliario es del 1% y que la valuación fiscal suele quedar por debajo del valor de mercado son referencias generales que hay que confirmar con la boleta y la contadora. No son datos verificados de este inmueble.

## 4. Sensibilidad (ESTIMACIONES; la bruta no cambia: 10,18%)

| Administración (Gs/mes) | Neta con imp. Gs 45 M | Neta con imp. Gs 15 M |
|---|---:|---:|
| 10,45 M (informado) | 3,27% | 4,10% |
| 8,0 M | 4,06% | 4,89% |
| 6,0 M | 4,70% | 5,53% |
| 4,0 M | 5,34% | 6,17% |
| 2,75 M (10% de la facturación, como el motor) | 5,74% | 6,57% |

Aunque los dos datos se corrijan, la clínica no llega al 8% de neta a USD 500.000 en la etapa "Hoy". Ese resultado es real y no un problema de fórmula: el precio pedido es alto para la renta actual.

## 5. Contra el resto de los decks

| Caso | Neta / bruta |
|---|---:|
| Motor (`calculadora.py`, vivienda) | ≈ 63% |
| M4, San Miguel, San José, Sajonia | 59–75% |
| Humaitá A y B | 50–66% |
| San Roque, Galería San Blas | 55–73% |
| Humaitá C (hostel, negocio operativo) | 21% |
| **Clínica Magnificat (consultorios con servicios)** | **32%** |

Los alquileres puros quedan entre 50% y 75%, que es lo esperable. Los dos casos que caen por debajo del 35% son negocios con servicios.

## 6. Propuestas `[EXTENSION]` (1 y 2 aplicadas como D-103 el 10/11/2026)

1. **Separar la renta pura de los servicios** en todo activo que alquila "con servicios": consultorios con secretaria, oficinas equipadas, coworking, hostel o renta temporal.
   - Bruta de renta pura = (facturación − costo directo de los servicios) ÷ precio. Es la que se compara con el piso de bruta del mercado (D-002/D-044).
   - La facturación total se informa aparte, como dato del negocio.
   - Estimación para la clínica: si el 60% de la administración son servicios (Gs 6,3 M por mes), la bruta comparable sería de alrededor del 7,9% y no del 10,18%.
2. **Control de coherencia antes de presentar:**
   - Alerta si en un alquiler puro la neta cae debajo del 50% de la bruta.
   - Alerta si un gasto fijo supera el 15% del bruto.
   - Alerta si el impuesto inmobiliario supera el 1% del precio.
   - Mientras haya una alerta abierta, la cifra se presenta como rango y no como dato.
3. **Presentar la neta de la clínica como rango** (3,3% a 4,7% "hoy", según el desglose y la boleta) hasta recibir la planilla de desglose del propietario.
4. **Para la contadora (impuesto que falta en la cadena):** la neta actual se mide a nivel de la S.A. Si el inversor extranjero retira dividendos, se aplica además el impuesto a los dividendos y utilidades (IDU). Este impuesto bajaría la neta del inversor, no la subiría. Hay que confirmar su tasa y cómo se aplica.

## 7. Información faltante que cambia la decisión
- Desglose de los Gs 10,45 M, con factura sí o no. La planilla al propietario ya está lista.
- Boleta del impuesto inmobiliario con la valuación fiscal.
- Estado de los contratos (vencidos) y de la cobranza real.
- Confirmación de la contadora: crédito fiscal, depreciación e IDU.
