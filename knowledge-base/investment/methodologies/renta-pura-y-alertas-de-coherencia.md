Estado: CURRENT (D-103), aprobada por el founder el 10/11/2026.
Dominio: INVESTMENT
Origen: `constatacion-bruta-neta-clinica-magnificat-2026-11-10.md` (constatación de la base D-101).

# Renta pura vs. servicios y alertas de coherencia

## 1. Regla

**1. Separar la renta pura de los servicios.**
- Aplica a los activos que alquilan con servicios incluidos en el precio: consultorios con secretaria, coworking, habitaciones todo incluido, hostel y renta temporal.
- La facturación de esos activos no es una bruta de alquiler.
- **Bruta de renta pura = (ingreso − costo directo de los servicios) ÷ inversión.**
- Los servicios son los costos que existen porque se presta un servicio al inquilino: secretaria, limpieza, lavandería, consumos (luz, agua, internet), personal de recepción y comisiones de plataformas.
- La administración del activo, el mantenimiento, el seguro y el impuesto inmobiliario no son servicios.

**2. ¿Contra qué se compara el piso?**

| Clase | Piso de mercado (D-033/D-044) | Por qué |
|---|---|---|
| Comercial, residencial, departamentos | Bruta de renta pura | El piso es de alquiler puro |
| `temporal_*` (Airbnb) | Facturación | El piso del 15% ya está calibrado sobre la facturación de Airbnb. La renta pura se informa al lado, con base en el ingreso a ocupación real (D-046) menos la limpieza |

**3. Alertas de coherencia antes de presentar** `[EXTENSION]`. Los umbrales los propuso Meridiano y los aprobó el founder; hay que recalibrarlos con casos reales.

| Alerta | Umbral |
|---|---|
| Neta ÷ ingreso de renta pura | menor que 50% |
| Cualquier línea de gasto (sin IVA, IRE, vacancia ni servicios) | mayor que 15% del ingreso de renta pura |
| Impuesto inmobiliario | mayor que 1% del precio |

**4. Con una alerta abierta, la neta se presenta como rango**, no como dato.
- **Piso del rango:** la neta con los datos informados.
- **Techo del rango (estimación):** la neta si cada gasto alertado bajara a su umbral, después del IRE. El impuesto inmobiliario baja a lo menor entre el 15% de la renta pura y el 1% del precio.
- El techo nunca supone gastos menores que los umbrales.

## 2. Dónde vive

| Pieza | Archivo |
|---|---|
| Lógica única | `production/app/backend/coherencia.py` (`evaluar_coherencia`) |
| Umbrales y nota de servicios | `production/app/config/parametros_mercado.json` > `alertas_coherencia`, `renta_con_servicios` |
| Motor | `calculadora.py` > `evaluar_renta(..., costo_servicios_mensual=, impuesto_inmobiliario_anual=)`. Devuelve `yield_bruto_renta_pura_pct`, `piso_comparado_con`, `alertas_coherencia`, `yield_neto_techo_pct` y `presentar_como_rango` |
| Advertencias (API y skill) | `advertencias.py` |
| Skill | `skills/rentabilidad-calculator/calcular.py renta --servicios ... --impuesto-inmobiliario ...` |
| Decks | `presentaciones/_config/rentabilidad.py` > `registrar()`, `gastos_de()`. Cada `model.py` deja la lista `coherencia` en `model.json` |
| Control | `presentaciones/verificar_presentaciones.py` (pre-commit y CI): lista las alertas y falla si un deck con alertas no declara `"neta_en_rango_d103": true` en `deck.json` |
| Tests | `production/app/backend/test_calculadora.py`, bloque D-103 |

Sin servicios y sin datos fuera de umbral, el motor y los decks devuelven exactamente las mismas cifras que con D-101. Se verificó deck por deck: ningún valor existente de `model.json` cambió.

## 3. Estado de los decks (10/11/2026, TC Gs 6.480,35)

| Deck | Alertas | Neta presentada |
|---|---|---|
| San José, M4, San Miguel, Sajonia A/B/C, San Roque A/B/C, Galería San Blas A/B/C, Humaitá A | Ninguna | Dato (sin cambios) |
| Clínica Magnificat (USD 500.000) | Hoy: neta al 42% de la renta pura, administración sin desglose, impuesto inmobiliario. Etapas 1 a 3: impuesto inmobiliario | Hoy 3,27–3,95% · E1 4,40–4,71% · E2 5,00–5,30% · E3 8,48–8,64% |
| Clínica Magnificat (USD 420.000) | Las mismas | Hoy 3,87–4,85% · E1 5,18–5,71% · E2 5,89–6,41% · E3 9,79–10,11% |
| Humaitá B (habitaciones todo incluido) | Gastos del edificio sin desglose (20,5%) | 7,19–7,78% |
| Humaitá C (hostel) | Neta al 49% de la renta pura; gastos del edificio (24,9%) | 4,81–5,68% |
| Catedral | Sin neta (gastos pendientes) | — |

Bruta de renta pura:
- **Clínica:** hoy 7,86% a USD 500.000, contra una facturación del 10,18%.
- **Humaitá:** B 11,88% (facturación 14,31%) y C 9,82% (facturación 23,32%).

**SUPUESTOS que hay que reemplazar con datos:**
- **Clínica:** el 60% de la administración son servicios (`SERVICIOS` en `model.py`). Se reemplaza con la planilla de desglose que se envió al propietario.
- **Humaitá B y C:** el 50% de los gastos del edificio de la planilla son servicios (`SERV_OPEX`).

## 4. Hallazgo no aplicado (P-010)

Las clases `temporal_*` del motor calculan dos líneas sobre la facturación a ocupación plena, aunque el ingreso real es el 60% (D-046):
- el canon de agencia (10%);
- la amortización de muebles (8%).

Con los valores por defecto, la neta queda en el 32% del ingreso de renta pura y siempre dispara alertas. Cambiarlo modificaría el yield neto de toda la renta temporal, así que queda como propuesta P-010 hasta que decida el founder.
