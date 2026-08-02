# Meridiano Capital — App funcional

Primera versión funcional de la Fase 5 (software funcional) de la migración. Une los dos activos técnicos reales que existían (`knowledge-base/technology/`): el sitio de referencia y la calculadora de rentabilidad (`calculadora.py`), sin reinventar ninguno de los dos.

## Qué hace hoy

- Sirve el sitio (`frontend/index.html`) tal cual el diseño original, con dos cambios funcionales reales:
  - El formulario de contacto envía de verdad a `POST /api/contacto` (antes solo simulaba éxito en el cliente) y persiste cada envío en `backend/data/contactos.jsonl`.
  - Nueva sección **Calculadora de rentabilidad** que llama a `POST /api/calcular/renta`, que a su vez ejecuta la `Calculadora` real (`backend/calculadora.py`), sin ninguna modificación de su lógica.
- API JSON mínima (`backend/server.py`), stdlib-only — no requiere `pip install` ni Node.

## Cómo correrlo

```bash
cd app/backend
python server.py
```

Abre `http://localhost:8000`.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/` | Sitio (frontend/index.html) |
| GET | `/api/parametros` | Devuelve `config/parametros_mercado.json` completo |
| GET | `/api/salud` | Chequeo simple |
| POST | `/api/calcular/renta` | `Calculadora.evaluar_renta(**body)` |
| POST | `/api/calcular/reventa` | `Calculadora.evaluar_reventa(**body)` |
| POST | `/api/calcular/reventa-temprana` | `Calculadora.evaluar_reventa_temprana(**body)` |
| POST | `/api/calcular/combinado` | `Calculadora.evaluar_retorno_combinado(**body)` |
| POST | `/api/contacto` | Guarda `{name, email, country, message}` en `backend/data/contactos.jsonl` |

## ⚠️ Antes de usar esto con inversores reales

`POST /api/calcular/renta` devuelve un campo `advertencias` en cada respuesta. Estas no son cosméticas — señalan dos contradicciones reales sin resolver entre la política escrita y lo que el código efectivamente calcula (ver `../decisions/DECISION_REGISTER.md#D-001` y `#D-002`):

1. **IVA**: el código usa 5% (`fiscal.iva_pct`, marcado "A CONFIRMAR CON CONTADORA"), pero la política declara 10% obligatorio. El yield neto mostrado hoy puede estar sobrestimado.
2. **Pisos de rentabilidad**: se usan como netos en el código, pero otra parte del mismo config los etiqueta como brutos con rangos netos más bajos. El veredicto `pasa_piso` puede no ser confiable.

No se "corrigieron" estos valores unilateralmente porque son decisiones de negocio, no técnicas — ver `decisions/REQUIREMENTS.md` (RI-05, RI-06, RT-06).

## Qué falta (deuda de producto conocida, no bloqueante)

- Notificación real (email/Slack/CRM) al recibir un contacto — hoy solo se persiste en un archivo local.
- Hosting/dominio de producción.
- Endpoints de reventa/reventa-temprana/combinado no tienen UI todavía (sí funcionan vía API — ver tabla arriba).
- Tests: `backend/test_calculadora.py` es el mismo test suite original (16 asserts), no se agregaron tests del servidor HTTP en esta primera versión.

Ver `../knowledge-base/technology/03-arquitectura-propuesta.md` para la propuesta de evolución (envoltura FastAPI, etc.) — esta versión stdlib es deliberadamente más simple que esa propuesta para no introducir una dependencia de `pip install` en la primera iteración funcional.
