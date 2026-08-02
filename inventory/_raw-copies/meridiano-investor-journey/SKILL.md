---
name: meridiano-investor-journey
description: Proceso de onboarding del inversor extranjero de Meridiano Capital, de punta a punta. Usar SIEMPRE que un inversor extranjero (de Argentina, Brasil o Europa) pregunte como invertir en Paraguay, que necesita para empezar, como sacar la cedula, abrir cuentas bancarias, formar una sociedad, o cual es el proceso completo. Usar tambien para generar el checklist personalizado de un inversor, saber en que etapa esta, o explicar el camino migratorio (estandar vs Investor Pass). Codifica la ruta cedula -> banco -> sociedad -> estructura fiscal -> inversion -> administracion, con la logica de dos caminos segun el monto invertido. Es el proceso que diferencia a Meridiano, el acompanamiento total del inversor. Usar esta skill, no improvisar el proceso.
---

# Meridiano Investor Journey

El proceso de acompañamiento del inversor extranjero de Meridiano Capital. Es un diferenciador central del negocio: el inversor no compra solo un departamento, recibe acompañamiento de la mano en todo el camino legal, migratorio, bancario y fiscal para poder invertir en Paraguay.

## Principio rector

**El acompañamiento genera la cartera y el referido.** El objetivo no es solo cerrar una compra: es que el inversor mantenga su cartera y refiera a familiares y amigos. Cada etapa bien acompañada es una razón para que confíe y vuelva. No improvisar el proceso ni saltear etapas.

## Dos modelos de inversor

Meridiano opera dos modelos, y la primera pregunta —además del monto— es cuál aplica:

```
INVERSOR INDIVIDUAL  (la mayoría)
   Compra su propia unidad · se la administramos · comisión de venta 5,5%
   → Journey completo abajo · evaluar con skill meridiano-rentabilidad

COINVERSIÓN  (tickets grandes, desarrollo)
   Varios inversores en un vehículo común para un desarrollo
   Fees de estructuración/obra + hurdle 8% + carried interest
   → Ver references/modelo-coinversion.md · vehículo S.A. o Fideicomiso
```

Ambos comparten las mismas etapas de onboarding (cédula → banco → sociedad → fiscal); la coinversión suma la estructura del vehículo, el waterfall y la gobernanza del fondo.

## La cédula NO es requisito para invertir — la decisión que abre el camino

El diferenciador central: **un extranjero puede comprar inmuebles en Paraguay a través de una S.A. sin que ningún socio tenga cédula paraguaya.** La cédula y la inversión están desacopladas (detalle en `references/camino-migratorio.md`).

```
DECISIÓN 1 — ¿Cómo empieza a invertir?
  A) EMPEZAR YA · S.A. sin cédula
     S.A. con socios 100% extranjeros · Meridiano = representante legal y síndico
     Compra inmuebles de inmediato · acompañamiento con costo mensual
     Dura para siempre o hasta que el inversor obtenga su cédula · cualquier monto
  B) CON CÉDULA PROPIA · invierte a su nombre (requiere tramitar cédula primero)

DECISIÓN 2 — ¿Querés tu cédula? (opcional, EN PARALELO mientras ya invertís)
  < USD 200.000 → Camino Estándar (temporal 2 años → permanente)
                   opción de doble proceso: cédula y luego S.A. propia
  ≥ USD 200.000 → Investor Pass (permanente directa, SUACE, CIE ≤5 días)
  Al obtener la cédula, el inversor puede asumir rep. legal/síndico y liberar el acompañamiento.
```

**Este es el gancho comercial más fuerte:** el inversor puede empezar hoy, sin esperar meses por una cédula.

## Las seis etapas

Leer `references/etapas-detalle.md` para el detalle completo de cada etapa (documentos, tiempos, costos, responsables, errores comunes). Resumen:

### Etapa 0 — Pre-inversión (acompañamiento previo)
Entender el perfil del inversor, sus objetivos y su capital. Definir el monto → definir la ruta. Presentar la política de rentabilidad (usar skill `meridiano-rentabilidad`) y las opciones de cartera.

### Etapa 1 — Estructura de entrada (cédula OPCIONAL)
La cédula ya no es el paso obligado. Definir primero cómo empieza a invertir (Decisión 1) y si quiere cédula en paralelo (Decisión 2). Ver `references/camino-migratorio.md`. Caminos de cédula:
- **Estándar:** residencia temporal (2 años, ya otorga cédula biométrica) → permanente a los 24 meses.
- **Investor Pass:** inversión ≥ USD 200.000 → SUACE emite la Constancia de Inversionista Extranjero (≤5 días hábiles) → Migraciones otorga residencia permanente directa → cédula (una sola presencia física, validez 10 años).
- Documentos apostillados: pasaporte, certificado de nacimiento, antecedentes penales (país de origen + últimos 3 años).

### Etapa 2 — Apertura de cuentas bancarias
**La cédula NO abre automáticamente las cuentas.** El banco exige compliance y justificación de origen de fondos (UAF, ex-SEPRELAD; considerar CRS/FATCA del país de origen). Persona física, y persona jurídica cuando hay S.A. Ver el cuestionario bancario en `references/onboarding-bancario.md`.

### Etapa 3 — Estructura societaria (punto de decisión)
Si el inversor va por más de una o dos propiedades → **Sociedad Anónima**, con abogado y escribano de confianza. La S.A. permite operar como inversor y facturar por bienes y servicios. El inversor de +USD 200.000 que forma S.A. es también el que califica al Investor Pass — las dos decisiones coinciden.

### Etapa 4 — Estructura fiscal y contable
Contadora de confianza. Documentación fiscal e impositiva para cumplir la normativa. Datos clave: IRP 10%, la reventa no se grava como actividad habitual. Atender la residencia fiscal del país de origen (CRS/FATCA).

### Etapa 5 — Inversión y administración
La compra concreta (usar `meridiano-rentabilidad` para evaluar) y luego la administración de la propiedad: búsqueda de inquilino/comprador para sostener la rentabilidad objetivo. Aquí el inversor entra a la cartera administrada de Meridiano.

### Acompañamiento continuo y referidos
Después de la compra, el acompañamiento sigue: liquidaciones, renovaciones, nuevas oportunidades. Es lo que convierte un cliente en cartera recurrente y en fuente de referidos.

## Cómo usar esta skill

- **Inversor pregunta "¿cómo empiezo?"** → identificar monto probable → indicar la ruta (estándar o Investor Pass) → explicar las etapas en orden, sin abrumar.
- **Generar checklist personalizado** → usar `assets/checklist-inversor.md` como plantilla, marcando la ruta y el estado de cada etapa.
- **"¿En qué etapa estoy?"** → ubicar al inversor en las seis etapas y decir el siguiente paso concreto.
- **Duda sobre requisitos exactos o aranceles** → los aranceles migratorios se indexan al jornal mínimo y cambian; la fuente vinculante es migraciones.gov.py. No fijar montos de arancel de memoria.

## Reglas

1. **No sos abogado, escribano ni contador.** Guiás el proceso y derivás a los profesionales de confianza para el acto legal, notarial o fiscal. Decilo con claridad.
2. **El origen de fondos es el punto crítico del banco.** Prepararlo desde el inicio evita el rechazo de cuenta más común.
3. **Definir el monto antes de arrancar trámites.** Cambia toda la ruta.
4. Los tiempos y costos están en `references/tarifario.md` (pendientes de datos reales) y `etapas-detalle.md` — editables, se actualizan sin tocar esta lógica.
5. **El tarifario se envía en etapa avanzada**, cuando el inversor ya calificó y pide costos con alternativas — nunca en el primer contacto.
6. **Nunca informar montos de tarifario de memoria.** Si no están cargados, decir que se envían al avanzar.
