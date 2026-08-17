Estado: CURRENT — el costo de amueblamiento se suma en TODOS los cálculos de rentabilidad y plusvalía (no solo rentabilidad), y la categoría de zona informa la calidad de amueblamiento
Fuente original: instrucciones del founder, 2026-08-16
Dominio: INVESTMENT (caso HERRERA-001) — ambas reglas son cross-cutting, ver `governance/decisions/DECISION_REGISTER.md`
Incorporado: 2026-08-16

# Amueblamiento en plusvalía y rentabilidad, y calidad de amueblamiento por zona

## 1. Regla — el costo de amueblamiento se suma en AMBOS cálculos, no solo en rentabilidad

*"Tanto para calcular la plusvalía como la rentabilidad del alquiler, siempre verificar que si el departamento se alquila y/o se vende amoblado, debemos sumar los costos del amueblamiento para dichos cálculos. Ya tenemos la planilla de costos de amueblamiento según tipología y calidad. Esto también debemos dejarlo registrado para utilizar siempre en los cálculos de rentabilidad."*

Hasta ahora, el costo de amueblamiento (`09-comision-con-iva-plazo-obra-vehiculo-legal-amoblamiento-y-verificacion-de-costos.md` §4) solo se había incorporado al **piso de renta** (rentabilidad de alquiler). El founder aclara que la misma regla aplica también al **piso de plusvalía** (`11-...md` §2) — **corrige y completa la metodología**, no la reemplaza:

> **Regla, cross-cutting**: siempre que una unidad se alquile y/o se venda amoblada, el costo de amueblamiento (según tipología y calidad, `Tabla de Costos Amoblamiento según Tipología de Departamentos.xlsx`) se suma a la base de cálculo — tanto para la rentabilidad de alquiler (ya vigente) como para la plusvalía (nuevo).

### 1.1 Piso de plusvalía recalculado, con amueblamiento incluido

El piso de plusvalía de `11-...md` §2 usaba el precio de venta de la unidad **terminada sin amoblar** como base del 15% anual. Corregido: si la unidad se retiene y se vende amoblada más adelante, el precio de referencia (hoy y en el futuro) debe incluir el costo de amueblamiento:

| Tipología | Precio venta terminada (sin amoblar) | + Amueblamiento | **Precio de referencia amoblado** | **Piso de plusvalía anual (15%)** |
|---|---|---|---|---|
| Monoambiente (30 m²) | USD 57.000–61.500 | Premium USD 7.000 | USD 64.000–68.500 | USD 9.600–10.275 |
| Monoambiente (30 m²) | USD 57.000–61.500 | Lujo USD 9.000 | USD 66.000–70.500 | USD 9.900–10.575 |
| 1 dormitorio (45 m²) | USD 85.500–92.250 | Premium USD 10.000 | USD 95.500–102.250 | USD 14.325–15.338 |
| 1 dormitorio (45 m²) | USD 85.500–92.250 | Lujo USD 14.000 | USD 99.500–106.250 | USD 14.925–15.938 |

**Comparado con el piso sin amueblar de `11-...md`** (USD 8.550–9.225 para monoambiente, USD 12.825–13.838 para 1 dormitorio): el piso sube al incluir el amueblamiento, consistente con que hay más capital invertido en la unidad. La **plusvalía neta de comisión** (`12-...md` §3, 1 año) también se recalcula sobre esta base amoblada — por ejemplo, monoambiente con amueblamiento Lujo: USD 6.116 neto de comisión (1 año), sobre una base de referencia de USD 70.500.

### 1.2 Se registra como regla permanente del sistema

Igual que la tabla de costos de amueblamiento ya está en `knowledge-base/investment/` (referenciada desde D-064), esta regla se agrega como nota explícita a esa referencia — **no se crea una decisión nueva**, se amplía la existente, porque es la misma tabla de costos, solo que ahora se usa en dos cálculos en vez de uno.

---

## 2. La categoría de zona informa la calidad de amueblamiento a usar

*"Es sumamente importante tener nuestra planilla de barrios de Asunción bien categorizada, porque nos va a permitir tomar, entre otras cosas, decisiones para la calidad del amueblamiento según la zona."*

Conecta explícitamente dos herramientas ya construidas: la tabla de tarifas/categoría de zona (`knowledge-base/investment/market-intelligence/rentals/07-tarifas-por-barrio-asuncion.md`, D-066) y la tabla de costos de amueblamiento (D-064). **Regla, cross-cutting**:

> La calidad de amueblamiento (Básico/Estándar/Premium/Lujo) a usar para una unidad retenida se decide **en función de la categoría y el posicionamiento de la zona** donde está el proyecto — no es una elección aislada por unidad.

**Ejemplo aplicado a Herrera** (`22-estudio-de-zonas-plusvalia-vs-rentabilidad-y-carmelitas.md` §2): Barrio Herrera está confirmado como zona residencial de alta demanda, cerca de las zonas premium de la ciudad (Villa Morra, Recoleta) pero sin el precio/m² más alto del ranking (esas zonas rondan USD 663–786/m², Herrera se maneja en el rango de venta general de USD 1.750–2.100 ya usado en este caso, que corresponde a otra referencia — no son directamente comparables sin más trabajo). Esto es consistente con la propuesta de mix de `20-reconsideracion-3-dormitorios-mix-de-producto.md`: **amueblamiento Premium/Lujo para el segmento que apunta a competir con zonas cercanas de mayor precio** (Recoleta, Mburucuyá), y Básico/Estándar para el resto — la categoría de zona es, justamente, el criterio que ya se venía usando implícitamente, ahora formalizado como regla explícita.

**No se fija una tabla exacta "zona → calidad de amueblamiento" en este documento** — falta terminar de confirmar las "zonas definitivas" (`22-...md` §2, pendiente) antes de poder construir esa tabla con precisión.

---

## 3. Qué queda pendiente

1. **Confirmar las "zonas definitivas"** del ranking (`22-...md` §2) — insumo necesario para construir la tabla zona → calidad de amueblamiento con precisión.
2. **Aplicar la corrección del piso de plusvalía con amueblamiento** (sección 1.1) al resto de las tipologías (2 y 3 dormitorios) — este documento solo recalculó monoambiente y 1 dormitorio como ejemplo.
3. Avanzar con el modelado del cobro real mes a mes (ritmo de venta + cronograma de caja + cuotas) — ver `24-flujo-de-caja-mensual-completo.md`.
