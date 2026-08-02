```
Estado: PROPOSED [EXTENSION]
Fuente original: ninguna — propuesta razonada del agente de migración a partir de assets/source-docs/meridiano-capital-sitio-web.html e inventory/_raw-copies/meridiano-rentabilidad/
Dominio: TECHNOLOGY
```

> **Todo el contenido de este archivo es `[EXTENSION]`/PROPUESTA.** No existe en el material fuente ninguna decisión de arquitectura ya tomada por Meridiano Capital. Esto es una recomendación razonada del agente de migración, pensada para que la fase de desarrollo ("software funcional", tarea #6 del plan) tenga un punto de partida concreto y acotado — no una especificación cerrada. Cualquier afirmación aquí debe tratarse como propuesta a validar, no como hecho.

# 03 — Propuesta de arquitectura para `app/`

## Punto de partida: qué hay para combinar

Solo dos activos funcionales reales (ver `00-overview.md`, `01-sitio-web-referencia.md`, `02-calculadora-rentabilidad.md`):

1. Un **sitio estático de una sola página** (HTML/CSS/JS inline, sin backend, formulario que no envía nada a ningún lado).
2. Una **librería Python pura** (`Calculadora`) que calcula rentabilidad, sin interfaz de usuario ni API.

La propuesta se limita deliberadamente a **conectar estos dos activos existentes** — no inventa features nuevas (no CRM, no portal de inversores, no autenticación, no pagos) que no estén ya insinuadas por el material fuente.

## Objetivo mínimo viable

Convertir "sitio + calculadora" en **una sola app funcional** con dos capacidades nuevas sobre lo que ya existe:

1. El **formulario de contacto del sitio envía datos de verdad** a algún lugar que Meridiano pueda ver (email y/o hoja de cálculo y/o CRM simple).
2. El sitio expone una **calculadora de rentabilidad interactiva** (aunque sea una versión simplificada, ej. solo `evaluar_renta`) que llama al motor Python existente en vez de que un inversor tenga que pedirle el número a alguien manualmente.

Todo lo demás (multi-página, CMS, portal de inversor logueado, dashboard interno) queda fuera de este MVP propuesto y se puede evaluar como fase 2 una vez que el MVP esté validado.

## Estructura de carpetas propuesta bajo `app/`

```
app/
├── frontend/                      # el sitio (parte del HTML de referencia, extraído)
│   ├── index.html                 # mismo contenido que meridiano-capital-sitio-web.html
│   ├── styles.css                 # CSS extraído del <style> inline
│   ├── script.js                  # JS extraído del <script> inline
│   └── calculadora.js             # nuevo: llama al backend, pinta el resultado en el DOM
│
├── backend/
│   ├── main.py                    # API (FastAPI o Flask) — capa fina sobre calculadora.py
│   ├── calculadora/
│   │   ├── calculadora.py         # el motor, movido tal cual (sin reescribir lógica)
│   │   └── parametros_mercado.json
│   ├── requirements.txt           # nuevo — hoy no existe
│   └── tests/
│       └── test_calculadora.py    # el test existente, movido tal cual
│
└── README.md                      # cómo correr todo localmente
```

Nota: mover `calculadora.py` y `parametros_mercado.json` **sin tocar su lógica** — la separación lógica/config que ya tienen es correcta y debe preservarse intacta. Lo único que cambia es que además de importarse desde una Skill de Claude, también se importa desde `main.py`.

## Backend: envolver `Calculadora` en una API delgada

Recomendación: **FastAPI** (no Flask) porque genera validación de tipos y documentación OpenAPI automática gratis a partir de la firma de las funciones — encaja bien con una librería ya tipada por convención (`clase: str`, `precio_compra: float`, etc.) y da un `/docs` interactivo sin trabajo extra, útil para que el propio equipo de Meridiano pruebe la calculadora sin frontend.

Endpoints propuestos (mapeo 1:1 con los métodos ya existentes de `Calculadora` — no se inventa lógica nueva, solo se expone la que ya existe):

| Método | Ruta | Mapea a |
|---|---|---|
| `POST` | `/api/renta` | `Calculadora.evaluar_renta(...)` |
| `POST` | `/api/reventa` | `Calculadora.evaluar_reventa(...)` |
| `POST` | `/api/reventa-temprana` | `Calculadora.evaluar_reventa_temprana(...)` |
| `POST` | `/api/retorno-combinado` | `Calculadora.evaluar_retorno_combinado(...)` |
| `GET` | `/api/pisos` | `piso_terreno()` + `piso_aporte()` + `pisos_renta_neta` del config, para poblar selects del frontend |
| `POST` | `/api/contacto` | recibe el formulario del sitio, lo persiste/reenvía (ver debajo) |

Antes de exponer esto públicamente: **resolver primero el hallazgo de IVA duplicado** documentado en `02-calculadora-rentabilidad.md` (`fiscal.iva_pct=5.0` vs `supuestos_operativos_default.iva_pct=10.0`, con el código usando el valor no confirmado). Publicar números de rentabilidad a inversores reales con una cifra fiscal marcada "A CONFIRMAR CON CONTADORA" es un riesgo de negocio, no solo técnico.

## Formulario de contacto: la brecha #1 a cerrar

Tres caminos razonables, del más simple al más flexible:

1. **Formspree / Netlify Forms** (sin backend propio): cambiar el `fetch()` faltante del JS del sitio para postear a un servicio externo de formularios. Es literalmente lo que el propio comentario del código fuente sugiere (`01-sitio-web-referencia.md`). Cero infraestructura propia, resultado en minutos.
2. **Endpoint propio simple** (`POST /api/contacto` en el mismo backend FastAPI): guarda el lead en una tabla/CSV/hoja y opcionalmente dispara un email (ej. vía SendGrid/Resend). Más control, más trabajo.
3. **Integración directa a un CRM** si Meridiano ya usa uno (HubSpot, Airtable, etc.) — fuera del alcance de lo que el material fuente confirma que existe hoy; no asumir que hay un CRM en uso.

Recomendación para el MVP: **opción 1 o 2**, decidir según si Meridiano quiere depender de un tercero (rápido, gratis en volumen bajo) o tener el dato propio desde el día uno (más control, requiere DB mínima aunque sea SQLite).

## Frontend: cuánto tocar el sitio existente

El sitio de referencia (`01-sitio-web-referencia.md`) es visualmente sólido y no necesita reescribirse. Cambios mínimos propuestos:

- Extraer CSS/JS inline a archivos separados (mejora mantenibilidad, cero cambio de comportamiento).
- Agregar una nueva sección/página con un formulario simple (clase de activo, precio de compra, renta mensual) que llame a `/api/renta` y muestre el desglose bruto/neto — reutilizando el lenguaje visual ya definido (`--gold`, `--navy`, tarjetas `.service-card`, etc.) para que no desentone.
- Reemplazar el `e.preventDefault()` mock del formulario de contacto por un `fetch()` real al endpoint elegido.
- **No** se propone agregar un framework de frontend (React/Vue) para esto: el volumen de interactividad nueva (un formulario más) no lo justifica. JS vanilla adicional es consistente con lo que ya existe y evita una migración de stack innecesaria.

## Despliegue — dos rutas razonables

**Ruta A (recomendada para MVP, menor fricción operativa):** desplegar `frontend/` como sitio estático (Netlify o Vercel) y `backend/` como servicio Python separado (Render, Railway, o Vercel Serverless Functions con Python runtime). Ambos gratuitos o de bajo costo en el tier inicial, sin servidor que administrar.

**Ruta B (más simple de operar, un solo despliegue):** FastAPI sirve tanto la API como los archivos estáticos del frontend (`StaticFiles` de FastAPI), todo en un solo proceso/contenedor. Menos piezas móviles, pero acopla el ciclo de deploy del sitio al del backend.

No hay información en el material fuente sobre presupuesto, preferencia de proveedor de hosting, o si ya existe un dominio/cuenta de algún proveedor cloud — esa decisión queda pendiente de quien ejecute la fase de desarrollo.

## Testing en la app futura

- Mantener y correr `test_calculadora.py` tal cual en CI antes de cualquier deploy — es la única red de seguridad real del motor financiero. Migrarlo a `pytest` es opcional (mejora integración con CI estándar) pero no obligatorio; el script standalone ya es determinístico y falla con código de salida no-cero.
- Agregar tests de la capa API nueva (que `/api/renta` devuelve lo mismo que llamar `Calculadora.evaluar_renta` directamente) — esto es lógica nueva que no existe hoy y sí necesita cobertura desde cero.

## Qué queda explícitamente fuera de este MVP propuesto

- Autenticación / portal de inversor logueado.
- Multi-idioma (el sitio fuente está solo en español).
- CMS o edición de contenido sin tocar código.
- Analítica/tracking (el sitio fuente no tiene ninguno hoy; agregarlo es una decisión de negocio, no técnica, y debería resolverse junto con una política de privacidad/cookies si se agrega).
- Cualquier flujo de pago o transacción financiera real — la calculadora es una herramienta de **evaluación**, no procesa dinero.

## Recomendación resumida (para planificar la fase de desarrollo)

Envolver `calculadora.py` sin modificarlo en una API FastAPI delgada, extraer el CSS/JS del sitio de referencia a archivos separados sin rediseñar nada, y conectar ambos con dos piezas nuevas: un endpoint de contacto real (reemplazando el mock actual) y un pequeño formulario de calculadora interactiva en el sitio. Es el camino de menor esfuerzo que convierte los dos activos ya "listos" en una sola app funcional, sin inventar alcance que el material fuente no respalda.
