Estado: CURRENT
Fuente original: "Proyecto Ejecucion Edificio Herrera Tower.xlsx" y "Modele Flujo Fondos Fideicomiso.xlsx", aportados por el founder el 2026-08-12
Dominio: INVESTMENT (caso HERRERA-001)
Incorporado: 2026-08-12

# Plantillas de referencia — no son datos de Herrera

El founder aportó dos planillas Excel aclarando explícitamente: *"además de contener información básica... vamos a generar nuestras propias planillas de cálculo"*. Se revisaron ambas por completo. Confirmación: **ninguna de las dos contiene datos reales de Herrera** — son plantillas metodológicas de otros proyectos/genéricas, con las categorías de costo y las estructuras de fee ya armadas pero sin las cantidades del edificio de Herrera cargadas. Se documentan acá como referencia de metodología, no como Data Room de este caso — nada de esto se usa como dato `A` de Herrera.

## 1. `Proyecto Ejecucion Edificio Herrera Tower.xlsx`

**Es una plantilla heredada de otro proyecto real de Meridiano ("MBURUCUYÁ", nombre que figura en la pestaña "Área Construcción")**, reutilizada como punto de partida. Casi todas las celdas de cantidad/superficie están en cero — no hay ninguna unidad, m² o piso de Herrera cargado todavía.

**Lo que sí es útil como referencia de metodología (no confirmado para Herrera — C, estimado/plantilla)**:

| Concepto | Valor en la plantilla |
|---|---|
| Tipo de cambio | ₲5.950 / USD |
| Fee Desarrollador | 8% |
| Transferencia Escribanía | 1% |
| Fideicomiso | 2% |
| Comisión Venta | 5,5% |
| Comisión Financiera | 2,5% |
| Gastos Generales de obra | 3% sobre el costo de construcción |
| Impuesto de Construcción Municipalidad | 3,5% sobre m² |
| Impuesto de Fraccionamiento (Catastro) | 1% sobre el cómputo métrico |

**⚠️ Punto que hay que aclarar con el founder — posible confusión de cifras, no una conclusión**: la plantilla trae una línea "Terreno" con un precio unitario de **USD 850 por m²** (469 m² × 850 = USD 398.650). Esto es un placeholder de la plantilla vieja, y por coincidencia usa el mismo número "850" que el precio total de adquisición que dio el founder (**USD 850.000**, para todo el predio con lo ya construido). Son dos cosas distintas — **no deben confundirse**: 850 USD/m² de solo terreno vs. 850.000 USD por el predio completo con el edificio en construcción. Se señala explícitamente para que no se mezclen sin querer al armar la planilla propia.

**Otro punto que confirma que es una plantilla genérica, no Herrera**: la línea "Construcción Completa (Llave en Mano)" asume 3.113 m² a USD 750/m² — ninguno de los dos números coincide con lo ya confirmado para Herrera (2.624 m² de superficie total construida según plano, USD 720/m² según el founder). Tampoco el precio de venta placeholder de la plantilla (USD 1.700/m²) coincide con el rango real que dio el founder para la zona (USD 1.750–2.100/m²).

## 2. `Modele Flujo Fondos Fideicomiso.xlsx`

**Es un modelo genérico de fideicomiso inmobiliario, de escala completamente distinta a Herrera** (80 unidades, 5.200 m² vendibles — Herrera tiene 21 unidades, 1.813,6 m²). No contiene ningún dato de Herrera. Su valor es la **estructura metodológica**, reutilizable para armar el modelo propio de Herrera una vez que haya presupuesto de terminación:

**Estructura de flujo de fondos mensual (hoja "Flujo de Fondos"), por categoría:**
- A. Ingresos (reservas, cuotas en obra, saldo escrituración — separado por unidades en preventa vs. vendidas durante obra vs. post-obra)
- B. Egresos — inversión inicial (terreno, due diligence, aporte inversores de obra)
- C. Egresos — construcción y obra (hard cost en curva S, honorarios de arquitecto, permisos, gerenciamiento, contingencia)
- D. Egresos — marketing, ventas y comercialización
- E. Egresos — financieros, legales y administrativos (fiduciario, legales/notariales, sellos, administrativos)
- F. Retorno a inversores (devolución de capital + retorno preferente, separado por tramo terreno/obra)
- G. Resultado neto y saldo acumulado del fideicomiso

**Parámetros de referencia (plantilla genérica, no confirmados para Herrera)**:
- Estructura de cobro: 3% reserva / 87% cuotas durante obra / 10% saldo a la escrituración
- Precio de venta por etapa: preventa USD 1.900/m², en obra USD 2.300/m², a la entrega USD 2.600/m²
- Soft costs sobre construcción: arquitecto 6%, permisos 2,5%, gerenciamiento de obra 4%, contingencia 12%
- Inversor de terreno: TIR objetivo 12% anual (hoja "Supuestos") — **la propia plantilla trae una inconsistencia interna**: la hoja "Flujo de Fondos" etiqueta la misma fila como "TIR 18% a/a", no 12%. No es un dato de Herrera, pero vale la nota si esta plantilla se reutiliza.
- Inversores de obra: aportan 50% del costo de construcción, TIR objetivo 20% anual + 30% de retorno preferente adicional sobre el excedente
- Honorarios del fiduciario: 0,5% anual sobre activos
- Gastos legales/notariales: USD 1.500 por unidad escriturada
- Impuesto de sellos: 1,8% sobre el precio de venta
- Impuesto a las ganancias / ITI: 10% sobre la utilidad del fideicomiso

## Conclusión de esta revisión

Ninguno de los dos archivos resuelve el bloqueante ya identificado (avance de obra real + presupuesto de terminación) — siguen pendientes exactamente igual que antes. Lo que sí aportan es un punto de partida metodológico real de cómo Meridiano estructura estos proyectos (fees, waterfall de inversores, curva de cobros) para cuando se arme la planilla propia de Herrera, una vez que exista el presupuesto de terminación real.
