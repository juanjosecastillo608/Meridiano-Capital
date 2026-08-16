Estado: CURRENT — metodología de valuación de terreno en zonas sin lotes vacantes, propuesta de habilidad AMC (P-007), y confirmación de zona AR2-B para Herrera
Fuente original: instrucciones del founder, 2026-08-17
Dominio: INVESTMENT (caso HERRERA-001) — la metodología de valuación y la propuesta de AMC son cross-cutting
Incorporado: 2026-08-17

# Valuación de terreno sin lotes vacantes, habilidad de AMC, y confirmación AR2-B

## 1. Metodología de valuación de terreno cuando no hay lotes vacantes disponibles — nueva regla cross-cutting

*"Probablemente, como en muchos otros casos, no hay terrenos sin edificación disponibles. En muchos casos hay que considerar comprar casas y demoler para construir nuevo (...) el costo total del terreno es el costo de la compra de la casa + la demolición y limpieza del terreno. En muchos casos, cuando las casas son muy antiguas y su estado de conservación es malo o regular, su valor se toma como valor de terreno — no se le asigna un valor a la construcción. Estas particularidades las vamos a tomar como reglas para otros casos."*

El founder confirma un hallazgo real de mercado (por qué Barrio Herrera y zonas similares no tienen dato de Place Analyzer para lotes vacantes: **en las zonas de mayor demanda, ya no quedan terrenos sin construcción disponibles para la venta**) y lo convierte en **regla de valuación cross-cutting**, aplicable a cualquier caso futuro:

> **Cuando se evalúa adquirir un terreno en una zona sin lotes vacantes disponibles, la compra real es de una casa/estructura existente para demoler:**
> - **Costo total del terreno = precio de compra de la casa + costo de demolición y limpieza del terreno.**
> - **Excepción — casa muy antigua, estado de conservación malo o regular**: el valor total de compra se toma directamente **como** valor de terreno — no se le asigna valor separado a la construcción (la estructura ya no aporta valor propio, distinto del caso donde sí se descuenta o suma un valor de demolición).

**No se aplica retroactivamente al costeo ya cerrado de HERRERA-001** (que compra una estructura al 73,5% de avance, un caso distinto — terminar, no demoler) — se registra como regla general para casos futuros de adquisición de lotes en zonas consolidadas.

## 2. Habilidad de Análisis Comparativo de Mercado (AMC) permanente — agendado, P-007

*"Agendar generar una habilidad que esté permanentemente actualizando y verificando valores de mercado, dado que necesitamos hacer siempre un AMC (Análisis Comparativo de Mercado) — esto nos permite darle el valor de mercado a las propiedades que Meridiano Capital vaya a captar para la venta y/o realizar un análisis de compra para un inversor."*

**Registrado como P-007** (propuesta, no aprobada/construida) en `governance/decisions/DECISION_REGISTER.md` — mismo criterio que P-006 (Agente de IA de mercado): es una idea de producto/sistema valiosa y explícitamente agendada para más adelante ("agendar generar"), no un pedido de construir ahora. Alcance descripto por el founder: mantener actualizados y verificados los valores de mercado (terreno + departamento, por zona), para dos usos concretos — **tasar propiedades que Meridiano capta para vender**, y **análisis de compra para un inversor**. Se conecta directamente con la tabla de tarifas/zona (D-066/D-069/D-070) ya construida — sería la evolución "viva" de esa tabla, con actualización sistemática en vez de cargas manuales puntuales.

**No se construyó nada** — falta especificación técnica (qué fuentes, con qué frecuencia, quién audita la calidad del dato) antes de poder diseñarse en serio, igual que P-006.

## 3. Plan Regulador — zona AR2-B de Herrera, CONFIRMADA

*"Ya está verificado la zona de regulación real del terreno de Herrera contra el catastro municipal: sí es AR2-B. Cierra perfecto, dato confirmado."*

**Actualiza `29-plan-regulador-y-correccion-68-barrios.md` §3.2** — lo que ahí se presentó como hipótesis (no confirmada) queda ahora **confirmado, categoría A**: el terreno de Herrera (cuenta catastral 14-502-04) está en zona de regulación **AR2-B** — coeficiente de edificabilidad 3,25, densidad 600 hab/Ha, tasa de ocupación máxima 70% (VU) / 65% (VM-CH), altura base "5 plantas o 15 m" — coincide exactamente con el permiso ya confirmado (base PB+5, con incentivo a PB+7 vía mayor retiro).

### 3.1 Un cruce numérico que queda abierto — no contradice la confirmación, pero vale la pena entenderlo

Aplicando la misma metodología del ejemplo de Ycuá Satí (`09-plan-regulador-indicadores-urbanisticos.md`) al terreno de Herrera:

> Área edificable = 469 m² × 3,25 (coef. AR2-B) = **1.524,25 m²**
> Número de pisos ≈ 1.524,25 ÷ (0,65 × 469) ≈ **5,0 pisos** — coincide exactamente con la altura base de AR2-B (5 plantas)

**Esto valida la altura base**, pero el **área edificable de 1.524,25 m²** que da el coeficiente base de AR2-B es bastante menor que la **superficie total real que tiene planeado construir Herrera** (3.113,03 m² en 6 pisos, o 3.413,03 m² en 7 — más del doble). **No es una contradicción del dato ya confirmado** (la zona SÍ es AR2-B) — es una pregunta técnica abierta sobre **por qué el proyecto real excede el área que el coeficiente base de AR2-B permitiría**, con algunas explicaciones plausibles, ninguna confirmada:

1. La ordenanza de incentivo que habilita el 7º piso (retiro de 6 m) probablemente también **incrementa el coeficiente de edificabilidad**, no solo la altura — algo común en este tipo de bonificaciones, pero no confirmado con los datos disponibles.
2. El **subsuelo** (526,13 m² de los 3.113,03 totales) podría no computar dentro del "área edificable" de la ordenanza — muchos códigos urbanísticos excluyen o cuentan distinto los niveles semienterrados.
3. Puede haber otra ordenanza específica aplicable al predio (fuera de las 6 zonas "AR" ya cargadas) que no está en la primera carga de la planilla.

**No se resuelve esta pregunta en este documento** — se deja anotada como algo a entender, sin que afecte la confirmación ya dada de que la zona es AR2-B.

## 4. Qué queda pendiente

1. **Entender la diferencia entre el área edificable del coeficiente base de AR2-B (1.524 m²) y la superficie real planeada (3.113-3.413 m²)** — sección 3.1, tres hipótesis planteadas, ninguna confirmada.
2. Si el founder quiere avanzar con la habilidad de AMC (P-007) o el Agente de IA de mercado (P-006), definir alcance técnico antes de construir.
3. Seguir con el orden de pendientes que confirmó el founder: (1) mix de producto para las demás tipologías, (2) renta/Airbnb real de Barrio Herrera, (3) armar los tres escenarios de venta/retención — ver los archivos siguientes del caso.
