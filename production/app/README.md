# Meridiano Capital — App funcional

Primera versión funcional de la Fase 5 (software funcional) de la migración. Une los dos activos técnicos reales que existían (`knowledge-base/technology/`): el sitio de referencia y la calculadora de rentabilidad (`calculadora.py`), sin reinventar ninguno de los dos.

## Qué hace hoy

- Sirve el sitio (`frontend/index.html`) tal cual el diseño original, con dos cambios funcionales reales:
  - El formulario de contacto envía de verdad a `POST /api/contacto` (antes solo simulaba éxito en el cliente) y persiste cada envío en `backend/data/contactos.jsonl`.
  - Nueva sección **Calculadora de rentabilidad** que llama a `POST /api/calcular/renta`, que a su vez ejecuta la `Calculadora` real (`backend/calculadora.py`), sin ninguna modificación de su lógica.
- API JSON mínima (`backend/server.py`), stdlib-only — no requiere `pip install` ni Node.

## Cómo correrlo

```bash
cd production/app/backend
python server.py
```

Abre `http://localhost:8000`.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/` | Sitio (frontend/index.html) |
| GET | `/api/parametros` | Devuelve `config/parametros_mercado.json` completo |
| GET | `/api/salud` | Chequeo simple |
| POST | `/api/calcular/renta` | `Calculadora.evaluar_renta(**body)`. `email` es opcional y no se le pasa a `evaluar_renta` (se extrae antes) — si viene, se guarda como lead en `backend/data/calculadora_leads.jsonl` (Fase 04, item 13: el sitio lo pide antes de mostrar el resultado, la API sigue funcionando sin él para otros consumidores) |
| POST | `/api/calcular/reventa` | `Calculadora.evaluar_reventa(**body)` |
| POST | `/api/calcular/reventa-temprana` | `Calculadora.evaluar_reventa_temprana(**body)` |
| POST | `/api/calcular/combinado` | `Calculadora.evaluar_retorno_combinado(**body)` |
| POST | `/api/contacto` | Guarda `{name, email, tipo_consulta, modalidad_gestion, country, message}` en `backend/data/contactos.jsonl` (`tipo_consulta` agregado en Fase 04, item 11: segmentación por tipo de consulta; `modalidad_gestion` agregado en D-058, solo relevante cuando `tipo_consulta === "gestion"`). **D-057/D-058 (2026-08-12)**: si `tipo_consulta === "gestion"` **y** `modalidad_gestion === "temporal"`, además dispara en segundo plano `urbannit_automation.py`, que genera (no envía) las dos propuestas personalizadas de Urbannit — ver sección siguiente |

## Automatización de propuestas Urbannit (D-057, corregido por D-058)

Cuando un contacto real elige "Gestión de mi propiedad" **y** especifica que es para renta temporal/Airbnb (`tipo_consulta === "gestion" && modalidad_gestion === "temporal"`), `backend/urbannit_automation.py` genera en segundo plano, sin bloquear la respuesta del formulario, las dos propuestas de D-056 (`Urbannit_Propuesta_Propietarios`, `Urbannit_Propuesta_Gestion_Temporal`) personalizadas con el nombre real del contacto, en `.docx` y `.pdf`.

**D-058 (2026-08-12)**: "Gestión de mi propiedad" agrupa dos servicios distintos — renta tradicional (sin muebles o amoblada, la gestiona **Meridiano Capital directamente**) y renta temporal/Airbnb (la opera **Urbannit**). Las dos propuestas de D-056 son exclusivas de renta temporal; el formulario ahora pide un segundo campo condicional (`modalidad_gestion`) para no enviarlas a un contacto de renta tradicional, donde serían incorrectas.

- Corre `node production/generadores/build_urbannit_propuesta_*.js "<nombre>" "<carpeta_salida>"` (subprocess con argumentos en lista, nunca `shell=True` — el nombre viene de un formulario público) y convierte a PDF con LibreOffice headless (`soffice --headless --convert-to pdf`).
- Salida: `backend/data/urbannit_docs_generados/<timestamp>_<nombre_slug>/`, con un manifiesto acumulativo en `backend/data/urbannit_docs_generados.jsonl` (ambos con PII real, `.gitignore`d).
- **Envío por email: todavía NO** — mismo patrón de no-op que `_notificar_crm()` (D-048). Cada entrada del manifiesto queda con `"enviado": false`; por ahora hay que enviar el documento generado a mano desde la carpeta indicada.
- Si Node.js o LibreOffice no están disponibles en el entorno (p. ej. el hosting de producción, D-055, todavía sin confirmar si los trae), la automatización se degrada con un error claro en el manifiesto — nunca tumba el request del formulario de contacto.

## ⚠️ Antes de usar esto con inversores reales

`POST /api/calcular/renta` devuelve un campo `advertencias` en cada respuesta — no son cosméticas. Estado al 2026-08-02 (ver `../../governance/decisions/DECISION_REGISTER.md`):

1. **IVA — ✅ RESUELTO (D-027)**: el founder confirmó IVA diferenciado (comercial 10%, residencial 5%, venta 5%) el 2026-08-02. Ya implementado en `backend/calculadora.py` y `config/parametros_mercado.json`. Las clases `temporal_*` (Urbannit) usan el residencial 5% por inferencia `[EXTENSION]` no confirmada explícitamente — la advertencia lo sigue marcando.
2. **Pisos de rentabilidad — sigue UNRESOLVED (D-002)**: se usan como netos en el código, pero otra parte del mismo config los etiqueta como brutos con rangos netos más bajos. El veredicto `pasa_piso` puede no ser confiable hasta que el founder lo confirme.

No se "corrigen" estos valores unilateralmente porque son decisiones de negocio, no técnicas — ver `../../governance/decisions/REQUIREMENTS.md` (RI-05 resuelto, RI-06/RT-06 pendientes).

## Qué falta (deuda de producto conocida, no bloqueante)

- Notificación real (email/Slack/CRM) al recibir un contacto — hoy solo se persiste en un archivo local.
- Hosting/dominio de producción.
- Endpoints de reventa/reventa-temprana/combinado no tienen UI todavía (sí funcionan vía API, incluyendo los campos `_neto_iva` del IVA de venta — ver tabla arriba).
- Tests: `backend/test_calculadora.py` — test suite original más los casos de IVA diferenciado agregados el 2026-08-02.

Ver `../../knowledge-base/technology/03-arquitectura-propuesta.md` para la propuesta de evolución (envoltura FastAPI, etc.) — esta versión stdlib es deliberadamente más simple que esa propuesta para no introducir una dependencia de `pip install` en la primera iteración funcional.
