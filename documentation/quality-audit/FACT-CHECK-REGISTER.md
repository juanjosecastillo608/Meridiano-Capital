```
Estado: AUDIT ONLY
Parte de: FINAL-AUDIT.md
```

# Fact-Check Register

Clasificación: **VERIFIED** (comprobado contra fuente confiable) · **UNVERIFIED** (sin verificación suficiente) · **OUTDATED** (cambió) · **CONTEXTUAL** (válido solo bajo condiciones) · **OPINION** (criterio estratégico) · **ESTIMATE** (estimación).

Ninguna claim de este registro se investigó externamente en este ciclo (modo AUDIT ONLY) — se clasifica según el estado de evidencia **ya presente o ausente** en las fuentes del propio repo.

## Legal / fiscal / migratorio

| Claim | Clasificación | Nota |
|---|---|---|
| S.A. con socios 100% extranjeros, sin cédula obligatoria | VERIFIED (internamente) | Confirmado explícitamente por el founder (D-038), consistente en `business/02-camino-migratorio.md`, `operations/03-tarifario.md` y el nuevo `Perfil Profesional...docx` |
| Capital social mínimo legal ₲900.000.000 | UNVERIFIED | Nunca se citó la ley/artículo específico que fija este monto — viene de material de trabajo, no de una fuente legal primaria citada |
| Investor Pass ≥ USD 200.000, CIE en ≤5 días hábiles vía SUACE | UNVERIFIED | Consistente entre múltiples documentos internos, pero ninguno cita el artículo de ley exacto |
| "Régimen SUACE... Ley N° 6984/22" | UNVERIFIED — **nuevo, requiere verificación antes de citarse externamente** | Citado por primera vez en `Modelo Paraguay para Inversión extranjero.docx`. Ver DO NEXT #7 en FINAL-AUDIT |
| IRP (Impuesto a la Renta Personal) máximo ~10% en Paraguay | CONTEXTUAL | Consistente en 3 fuentes independientes (política P07, `etapas-del-inversor.md`, `Modelo Paraguay...docx`) pero depende del tipo de renta — no es una tasa plana universal sin matices |
| IRE (Impuesto a la Renta Empresarial) 10% | VERIFIED (internamente, alta confianza) | Citado consistentemente en 5+ documentos distintos del repo, incluida la auditoría financiera real (939 fórmulas) que corrigió explícitamente un modelo que usaba 25% por error |
| IVA Paraguay 10% (Ley 125/91) — para consumo general | VERIFIED (internamente) | Correcto como tasa general citada en comparaciones de marketing (`Paraguay vs. España/Italia/Chile/Argentina`) — **y ya confirmado que coincide con la tasa comercial del motor de cálculo** (comercial 10% / residencial 5%, D-001/D-027, confirmado 2026-08-02 y verificado 2026-08-10). Antes documentado como posible contradicción por un error de este mismo registro — corregido |
| España: IRPF hasta ~47%, Impuesto de Sociedades 25%, IVA 21% | UNVERIFIED | Cifras plausibles y consistentes con conocimiento público general, pero sin cita de fuente en el documento fuente |
| "La reventa NO se grava como actividad habitual" (Paraguay) | VERIFIED (internamente) | Marcado explícitamente "confirmado" en la Política P07 y reflejado en el config (`grava_ganancia_capital: false`) |
| Residencia fiscal Paraguay: regla de 183 días o centro de intereses económicos | UNVERIFIED | Consistente con el criterio internacional estándar (mismo criterio que España), pero sin cita a la ley paraguaya específica |

## Rentabilidad / mercado inmobiliario

| Claim | Clasificación | Nota |
|---|---|---|
| Rentabilidad tradicional Paraguay 6-10% bruto | VERIFIED (internamente, con dato real) | Confirmado con datos reales de mercado (zona Eje Corporativo, `investment/05-matriz-pisos-techos.md`) — rango 6-12,7% bruto según precio, consistente |
| Rentabilidad temporal Paraguay 10-16%+ bruto | ESTIMATE | Viene del deck de inversores original, sin el mismo nivel de validación de dato real que la tradicional |
| "Rentabilidad Paraguay 8-12% anual en USD" (los 4 docs comparativos) | ESTIMATE, **sin distinción bruto/neto** | Riesgo: se presenta como cifra única sin el par bruto/neto obligatorio (RI-01) — ver DO NEXT #8 en FINAL-AUDIT |
| Rentabilidad España 3-5% bruto residencial | UNVERIFIED | Cifra de mercado plausible, sin fuente citada en el documento |
| Rentabilidad Italia 2-4% (residencial tradicional) | UNVERIFIED | Ídem |
| Rentabilidad Chile 4-7% bruto | UNVERIFIED | Ídem |
| Argentina: "rentabilidad por alquiler baja/inconsistente por distorsiones regulatorias" | OPINION con base razonable | Afirmación cualitativa, coherente con la reputación pública del mercado argentino, pero no cuantificada ni citada |
| Paraguay "grado de inversión" otorgado por Moody's, crecimiento ~4,4% anual | VERIFIED (internamente, ya usado en entregables) | Ya validado y usado consistentemente en los decks regenerados esta semana (`Meridiano_WhatsApp_Frio`, etc.) |
| ~80.000 radicaciones de extranjeros proyectadas para 2026 | ESTIMATE | Cifra de proyección, no de resultado cerrado — tratarla como tal en cualquier pieza |

## Operativo / tarifario (nuevos documentos)

| Claim | Clasificación | Nota |
|---|---|---|
| Fee gestión patrimonial: Esencial 8% / Integral 10% / Portfolio 12%+fijo | CONTEXTUAL | Consistente con el 10% ya confirmado en `operations/03-tarifario.md` para el nivel medio — los niveles Esencial/Portfolio son una propuesta nueva de segmentación, no contradicen el dato existente, lo amplían |
| Fee renta temporal total 20-25%, retención operador 14-18%, retención Meridiano 5-8% | CONTEXTUAL | Consistente entre `Perfil Profesional...docx` y las dos propuestas STAY WISE/genérica (ejemplo numérico con 20% de comisión de agencia) — buena señal de coherencia cruzada entre documentos independientes |
| Limpieza de renta temporal USD 20-30/estancia, "la paga el huésped" | CONTEXTUAL | Consistente entre ambos documentos de gestión temporal — dato operativo de mercado, no verificado contra fuente externa pero coherente internamente |
| Comisión Airbnb ~3% | UNVERIFIED | Airbnb cobra comisiones variables según tipo de cuenta/host — 3% es plausible para "Airbnb-only host fee" pero no es universal; debe tratarse como referencia, no como tasa fija |

## Recomendación general

Ningún claim de este registro requiere bloquear el uso del material — la mayoría son ESTIMATE/CONTEXTUAL, lo cual es esperable y aceptable en material comercial **siempre que se presente como tal** (ver `ai/07-protocolo-analista-de-inversion.md`: nunca presentar una estimación con la certeza de un dato confirmado). El único ítem que sí bloquea es la cita nueva de la Ley N° 6984/22 antes de usarla en cualquier pieza dirigida a un inversor real.
