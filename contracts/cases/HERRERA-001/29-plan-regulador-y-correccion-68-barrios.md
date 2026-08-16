Estado: CURRENT — 68 barrios (corrección), Place Analyzer como regla de terreno, y Plan Regulador (Ordenanza 43/1994) aplicado como hipótesis a Herrera
Fuente original: instrucciones del founder, 2026-08-17 + planilla "Indicadores Plan Regulador PR.xlsx"
Dominio: INVESTMENT (caso HERRERA-001) — las tres piezas son cross-cutting, ver `knowledge-base/investment/07-...md` y `09-plan-regulador-indicadores-urbanisticos.md`
Incorporado: 2026-08-17

# Plan Regulador, corrección a 68 barrios, y Place Analyzer como regla

## 1. Asunción tiene 68 barrios, no 66 — corregido

*"Correcto, Asunción tiene 68 barrios, no 66 como en tu plano. Corregimos ese dato en nuestra planilla."*

Se corrigió la lista base de la tabla de tarifas y de la tabla de categoría de zona, ahora con 68 barrios (816 filas en la hoja "Datos": 68 × 4 tipologías × 3 tipos de alquiler). **Se agregaron "Jukyty" y "San Cayetano"** — los dos barrios que habían aparecido en el ranking de Place Analyzer (`28-...md` §3.2) sin estar en la transcripción original del plano de 66. **Hipótesis razonable, no confirmada**: dado que la diferencia es exactamente de 2 barrios y estos 2 nombres son justamente los que faltaban reconciliar, es plausible que sean los 2 barrios que faltaban — pero no se verificó contra un mapa catastral oficial. Se deja anotado como hipótesis, no como hecho confirmado.

## 2. Place Analyzer — regla confirmada para el valor de mercado de terrenos

*"Tomar como regla, para el valor de los terrenos real, Place Analyzer como un dato — cuando queremos saber, por ejemplo en este caso, el terreno de Barrio Herrera. Place Analyzer va a ser un dato que vamos a utilizar para obtener los valores promedios de mercado de los terrenos."*

**Regla cross-cutting, categoría A (confirmado)**: Place Analyzer (algoritmo con >300 variables, ya usado en `28-...md`) queda establecido como la fuente de referencia estándar para el **valor promedio de mercado de terrenos** en cualquier análisis de Meridiano — no solo para el ranking de zona, sino como el dato a consultar puntualmente cuando se necesita valorar un terreno específico.

**Por qué el precio de terreno importa, aunque sea una magnitud distinta al precio de departamento** (aclaración del founder, resuelve la duda que había quedado abierta sobre por qué mantener ambas columnas separadas si igual se usan juntas): *"El precio del terreno es un indicador para darle a la zona una calificación, y es un indicador que nos permite entender el precio del mercado de los departamentos."* — es decir, terreno y departamento **no se mezclan en el cálculo** (siguen siendo magnitudes distintas, `22-...md` §1), pero el precio de terreno funciona como **señal/indicador de la calidad de zona**, que a su vez ayuda a interpretar y contextualizar el precio de departamento de esa misma zona — una relación de referencia, no una sustitución.

### 2.1 Barrio Herrera — primer intento de aplicar la regla

No se encontró un valor específico de Place Analyzer para Barrio Herrera (no aparece en el top 10 ni en el bottom 5 ya relevados, `28-...md` §3.1-3.2) — se buscó una referencia alternativa de mercado:

**Listados activos de mercado (InfoCasas, Coldwell Banker, Red Exclusivos, 2026-08-17)**: terreno en Barrio Herrera cotiza entre **USD 1.200 y 1.500/m²** — **⚠️ esto NO es un dato de Place Analyzer**, es precio de lista (asking price) de anuncios activos, una metodología distinta (no calibrada contra 300 variables, muestra chica) — no se debe comparar directamente contra el ranking de la sección 3 de `28-...md`.

**Comparación contra el terreno del trato**: el trato de HERRERA-001 le asigna USD 360.000 al terreno (`04-comprar-vs-construir.md`) sobre 469 m² = **USD 767,59/m²** — **muy por debajo** del rango de listados actuales (USD 1.200-1.500/m²). Esto **refuerza, con un dato de mercado más reciente, el mismo hallazgo que ya se había encontrado** en `04-...md` y `10-...md` §3 (el trato es favorable frente al valor de reponer el terreno por separado).

## 3. Plan Regulador (Ordenanza 43/1994) — indicadores urbanísticos, y una hipótesis sobre la zona de Herrera

*"Aquí vamos a hacer una aclaración: hay zonas donde los terrenos toman valor según su clasificación de uso (Industrial, Comercial y Residencial), y dentro de esa clasificación está la normativa municipal que determina, por zona, qué tipo de construcciones se pueden realizar y los pisos y/o metros de altura que se permiten. Adjunto una planilla donde están los indicadores según la zona que permiten construir. Con esta planilla vamos a tenerla para el estudio de todos los terrenos, porque nos permite saber qué se puede construir y qué no."*

Se registró la tabla completa como referencia cross-cutting en `knowledge-base/investment/09-plan-regulador-indicadores-urbanisticos.md` — 6 zonas de "Áreas Residenciales" (AR1-A a AR3-B), cada una con densidad, coeficiente de edificabilidad, tasa de ocupación máxima y altura máxima permitida.

### 3.1 Metodología, validada con un ejemplo real (Ycuá Satí) que trae la propia planilla

> Área edificable = Superficie del terreno × Coeficiente de edificabilidad
> Número de pisos ≈ Área edificable ÷ (Tasa de ocupación máxima × Superficie del terreno)

### 3.2 Zona AR2-B — CONFIRMADA (2026-08-17)

**✅ Actualizado — resuelto en `30-valuacion-de-terreno-sin-lotes-vacantes-y-confirmacion-AR2-B.md` §3**: el founder verificó la zona de regulación del terreno de Herrera (cuenta catastral 14-502-04) contra el catastro municipal — **es AR2-B, confirmado, categoría A**. Coincide exactamente con el permiso municipal ya confirmado (base PB+5 pisos, con incentivo a PB+7 vía mayor retiro) y con el perfil de AR2-B en la tabla (altura base "5 plantas o 15 m").

Queda una pregunta técnica abierta, sin resolver (no contradice la confirmación de zona): el área edificable que da el coeficiente base de AR2-B (469 m² × 3,25 = 1.524,25 m²) es menos de la mitad de la superficie real que tiene planeado construir Herrera (3.113-3.413 m²) — ver `30-...md` §3.1 para las hipótesis planteadas, ninguna confirmada.

## 4. Qué queda pendiente

1. **Verificar la hipótesis AR2-B para el terreno de Herrera** contra el mapa catastral municipal (cuenta catastral 14-502-04) — confirmaría (o descartaría) la coincidencia señalada en la sección 3.2.
2. **Confirmar si "Jukyty" y "San Cayetano" son realmente los 2 barrios que faltaban** en la transcripción de 66→68 (sección 1), o si son otros.
3. **Completar el resto de las zonas del Plan Regulador** (más allá de las 6 "AR" ya cargadas) si el founder tiene la planilla completa.
4. Buscar un valor de Place Analyzer específico para Barrio Herrera (no encontrado todavía) para poder comparar con el mismo criterio que el ranking de `28-...md`, en vez de solo listados de mercado.
