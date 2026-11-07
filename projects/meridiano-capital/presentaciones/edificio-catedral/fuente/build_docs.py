"""Control interno y respuestas del asesor del Edificio Catedral, generados desde model.json."""
import os, json, datetime as dt

B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
E = os.path.join(B, '..', 'entregables')


def n(x, d=0):
    return f"{x:,.{d}f}".replace(',', 'X').replace('.', ',').replace('X', '.')


def gs(x): return 'Gs ' + n(x)
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'


tc = M['tc_cfg']
f_tc = f"{tc['fecha'][8:]}/{tc['fecha'][5:7]}/{tc['fecha'][:4]}"
A = M['auditoria']
hoy = dt.date.today().strftime('%d/%m/%Y')
MK = M['mercado']
def fm(x): return 'Gs ' + n(x / 1e6, 1) + ' M'
def comp_linea(c):
    det = ', '.join(x for x in (f"{c['dormitorios']} dorm." if c.get('dormitorios') else '', f"{n(c['superficie_m2'])} m²" if c.get('superficie_m2') else '') if x)
    pub = ('USD ' + n(c['precio'])) if c['moneda'] == 'USD' else gs(c['precio'])
    uso = 'en estadísticas' if c['usar_en_estadisticas'] else f"excluido: {c.get('motivo_exclusion')}"
    return f"| {c['codigo']} | {c['descripcion'][:70]} | {c['zona']} | {det or '—'} | {pub} | {gs(round(c['gs']))} | {c['comparabilidad']} · {uso} | [{c['fuente'].split(' (')[0]}]({c['url']}) |"
SERIE = ' · '.join(f"{s['n']}: Gs {n(s['tc'], 2)} → {pct(s['res'])} / {pct(s['tot'])}" for s in M['sens'])
ESC = '\n'.join(f"| {e['n']} | {gs(e['canon_dpto'])} × {e['dptos']} | {gs(e['canon_salon']) + ' × ' + str(e['salones']) if e['salones'] else '—'} | {gs(e['mensual'])} | {gs(e['anual'])} | {pct(e['bruta'])} | {n(e['recuperacion'], 1)} años |" for e in M['escenarios'])
COMPS = '\n'.join(comp_linea(c) for c in MK['comparables'])

control = f"""# Edificio Catedral — Control interno

Uso interno de Meridiano Capital. Documento de trazabilidad de la presentación `Edificio_Catedral_Meridiano_FINAL` (PPTX y PDF) y del Excel `Edificio_Catedral_Rentabilidad.xlsx`. Generado el {hoy} desde `fuente/model.json`.

## 1. Archivos recibidos
| Archivo | Uso |
|---|---|
| `Edificio Departamentos Catedral.pdf` (6 páginas; metadatos del 27/08/2026) | Datos del inmueble, renta residencial, planilla de rentabilidad de la fuente e imágenes del entorno. Documento de terceros: no se versiona en el repo. |
| `Aerea Edificio`, `Frente Edificio`, `Lateral Edificio` | Fotos de las láminas 1, 6 y 7 |
| `Ubicacion.png` | Mapa de la lámina 3 (base Google Maps con rótulos agregados) |
| Pedido del founder (05/11/2026) | Hipótesis de los 3 locales, estructura de la pieza y entregables |
| Estudio de mercado de alquileres (07/11/2026) y su planilla | Comparables R1–R12 y C1–C14, escenarios y recomendaciones. Guardado con el estándar de estudios: `knowledge-base/investment/market-intelligence/estudios/CDE-CATEDRAL-2026-11-07/` (D-100) |

## 2. Tipo de cambio
- **Usado:** Gs {n(M['tc'], 2)} por USD. Fuente: {tc['fuente']} del **{f_tc}**, verificado el {tc['verificado_el']}. Página: https://www.bcp.gov.py/webapps/web/cotizacion/monedas
- **Cómo se obtuvo:** la planilla del BCP se leyó vía buscador y coincide con el estudio de mercado del 07/11/2026. El sitio del BCP no resuelve desde el entorno de trabajo (DNS/proxy).
- **Serie usada en la lámina 13:** {SERIE}.
- **Hallazgo cambiario:** el referencial pasó de Gs 5.833,41 (26/10) a Gs 6.388,47 (05/11), +9,5% en diez días, y a Gs 6.480,35 el 06/11 (contexto: resolución sobre Ueno Bank y tensión política, según ABC Color del 06/11/2026). Con el mismo edificio y la misma renta, la bruta total pasó de 9,75% (TC del 16/10) a {pct(M['tot']['bruta'])}. Antes de cada reunión hay que regenerar los materiales con el TC del día.
- **Fuente única:** el valor vive en `presentaciones/_config/meridiano.json` (D-097) y se edita en `Parametros!B5` del Excel.

## 3. Cálculos (todos reproducibles en el Excel)
| Concepto | Fórmula | Resultado |
|---|---|---:|
| Terreno | 17,50 × 40 | 700 m² (coincide con lo informado) |
| Precio en Gs | USD 960.000 × {n(M['tc'], 2)} | {gs(M['precio_gs'])} |
| Renta residencial mensual | 12 × Gs 3.000.000 | {gs(M['res_m'])} |
| Renta residencial anual | × 12 meses | {gs(M['res_a'])} ({usd(M['res']['ingreso_anual_usd'])}) |
| Renta comercial mensual (hipótesis) | 3 × Gs 3.000.000 | {gs(M['com_m'])} |
| Renta total anual proyectada | (36 + 9) M × 12 | {gs(M['tot_a'])} ({usd(M['tot']['ingreso_anual_usd'])}) |
| Bruta residencial | 432 M ÷ precio en Gs | **{pct(M['res']['bruta'])}** |
| Bruta total proyectada | 540 M ÷ precio en Gs | **{pct(M['tot']['bruta'])}** |
| Recuperación simple bruta | precio ÷ renta anual | {n(M['res']['recuperacion'], 2)} años (residencial) · {n(M['tot']['recuperacion'], 2)} años (total) |
| USD por m² construido informado | 960.000 ÷ 2.290 | {usd(M['usd_m2_construido'])} |

**Escenarios del estudio (internos, en el Excel; la presentación muestra el informado y el central):**

| Escenario | Departamentos | Salones | Mensual | Anual | Bruta | Recuperación |
|---|---|---|---:|---:|---:|---:|
{ESC}

Condiciones:
- **Inferior:** cánones en la parte baja de la muestra y salones sin renta. Es el piso de la muestra, no un caso garantizado.
- **Superior:** requiere renovar contratos con ajuste, buen estado de las unidades y buen frente de los salones. Ninguna de esas condiciones está comprobada (confianza baja).

## 3 bis. Estudio de mercado (consulta del 07/11/2026)
- **Departamentos de 3 dormitorios:**
  - Muestra de {MK['res']['n']} avisos: de {fm(MK['res']['min'])} a {fm(MK['res']['max'])}, con mediana de {fm(MK['res']['mediana'])}.
  - Unidades estándar sin amoblar ({MK['res']['std_n']} avisos): de {fm(MK['res']['std_min'])} a {fm(MK['res']['std_max'])}, mediana {fm(MK['res']['std_mediana'])}.
  - El canon de Gs 3.000.000 está **dentro del mercado, en la banda baja**. Rango preliminar: {fm(MK['res']['rango_prelim'][0])} a {fm(MK['res']['rango_prelim'][1])} (confianza media-baja).
- **Salones:**
  - Muestra de {MK['com']['n']} avisos con mediana de {fm(MK['com']['mediana'])}; los estándar van de {fm(MK['com']['std_min'])} a {fm(MK['com']['std_max'])}.
  - La hipótesis de Gs 3.000.000 queda **en la mediana**. Rango preliminar: {fm(MK['com']['rango_prelim'][0])} a {fm(MK['com']['rango_prelim'][1])} según superficie, frente y estado (confianza media-baja).
- **Contexto:**
  - Mediana de alquiler de departamento en CDE: USD 804 por mes (TuLugar).
  - Galerías del microcentro: hasta USD 50/m² (Última Hora, 16/10/2026).
  - Cellshop: 53.000 m², con apertura proyectada para el Black Friday 2026 según ABC Color del 15/07/2026. Es una proyección publicada, no confirmada.
- **Limitaciones:**
  - Ningún aviso informa su fecha de publicación y no se confirmó la disponibilidad.
  - La muestra del Barrio Catedral estricto es de un solo aviso (1 dormitorio).
  - No hay superficie individual de las unidades del edificio.
- **Equivalencias:** los montos en guaraníes de la tabla usan el TC vigente (Gs {n(M['tc'], 2)}).

| Código | Aviso | Zona | Detalle | Publicado | En Gs | Comparabilidad y uso | Fuente |
|---|---|---|---|---|---|---|---|
{COMPS}

Duplicado eliminado: A1613 = COD 1938 (R2). Descartados por no comparables: depósitos, salones de eventos, locales corporativos, clubes premium y avisos de 2025 que no se pudieron reverificar.

## 4. Auditoría de las cifras publicadas por la fuente
- **"Rentabilidad comprobada: 7%"** — **NO CONCILIADA.**
  - Base: la planilla del PDF usa Gs 36.000.000 por mes (solo departamentos), un tipo de cambio de **Gs 6.000 sin fecha ni fuente** y un solo gasto (impuesto anual Gs 18.000.000; expensas Gs 0).
  - Resultado: renta bruta {pct(A['bruta_pdf_recalc'])} y "neta" {pct(A['neta_pdf_recalc'])}. Reproducidas exactamente, pero la "neta" omite mantenimiento, administración, seguros, vacancia, IVA e impuesto a la renta.
  - El 7% no coincide con ninguno de los dos valores y no tiene respaldo de cobros: no se presenta como rentabilidad comprobada.
  - Con el tipo de cambio vigente, esa misma "neta" daría {pct(A['neta_fuente_tc_actual'])}.
- **"9,75% de rentabilidad bruta anual estimada"** (descripción comercial) — **no vigente.**
  - Con Gs 540.000.000 anuales, implica un tipo de cambio de Gs {n(A['tc_implicito_975'], 2)}, que coincide con el cierre interbancario del BCP del 16/10/2026 (Gs 5.770,91). Es un cálculo inverso, no prueba de la cotización usada.
  - Con el referencial del {f_tc}, la bruta total es **{pct(M['tot']['bruta'])}**.
  - No se reproduce en la presentación (criterio del founder: no mostrar rentabilidades publicadas que Meridiano no validó, aplicado en San Miguel el 16/10/2026). Queda en el Excel (`Auditoria_Fuente`) y en este control.

## 5. Datos y estado
| Dato | Valor | Estado |
|---|---|---|
| Precio | USD 960.000 | Confirmado (fuente y pedido) |
| Terreno | 17,50 × 40 m = 700 m² | Confirmado y verificado |
| Superficie construida | 2.290 m² | Informado; **pendiente de planos** |
| Niveles y composición | 4 niveles; 12 departamentos (4 por piso, pisos 1 a 3) y 3 salones en planta baja | Confirmado (fuente) |
| Estacionamiento | 12 plazas cubiertas en planta baja; 1 por departamento | Confirmado (fuente) |
| Servicios | Pozo artesiano | Confirmado (fuente); estado pendiente |
| Departamentos | 3 dormitorios (1 en suite + 2 con baño compartido) + habitación de servicio con baño, sala, comedor-cocina, lavadero, balcón | Confirmado (fuente); sin superficies por unidad |
| Renta residencial | 12 × Gs 3.000.000, 12 unidades ocupadas | Informado; fecha del relevamiento **no informada** (PDF del 27/08/2026 según metadatos) |
| Renta comercial | 3 × Gs 3.000.000 | **Hipótesis**, sujeta a confirmación |
| Planos aprobados y documentación en regla | — | Declaración de la fuente, sin respaldo adjunto |
| Ubicación | Pampliega casi Av. Mayor Rivas Ortellado | **Referencial**: el enlace https://maps.app.goo.gl/EA3DMnVUaTTddxLc9 no pudo abrirse desde el entorno; se usó el mapa recibido |
| Cellshop | Futuro centro comercial de 53.000 m² | Apertura proyectada para fines de 2026 según prensa (ABC Color, 15/07/2026); no confirmada |
| Impuesto anual | Gs 18.000.000 (planilla del PDF) | **Pendiente de validación**: sin comprobante, concepto ni período |

**Excluido de la pieza por falta de respaldo:**
- "Potencial de expansión o remodelación".
- "Sin necesidad de remodelaciones".
- "Valorización a largo plazo".
- Distancias y tiempos de traslado.

## 6. Pendientes antes de una oferta
1. Título, titularidad, cuenta corriente catastral e informe de condiciones de dominio.
2. Planos aprobados, superficies (2.290 m²) y permisos o situación municipal.
3. Contratos de los 12 departamentos: vencimientos, reajustes, depósitos, cobros y morosidad.
4. Situación real de los 3 salones: si están alquilados, a qué canon y con qué contratos.
5. Gastos operativos e impuestos, para calcular la renta neta.
6. Estado del pozo artesiano, las instalaciones y el mantenimiento (inspección técnica).
7. Condiciones de venta, forma de pago y gastos de escritura.
8. Confirmar la ubicación exacta del marcador y la fecha del relevamiento de alquileres.
9. Aclarar el impuesto de Gs 18.000.000 por año de la fuente: concepto, período y comprobantes.
10. Facturas de servicios y gastos comunes; habilitaciones y situación municipal de los salones.
11. Superficie, frente, estado e instalaciones de cada salón, para pasar de la hipótesis al canon real.
12. Regenerar los materiales con el TC del día antes de cada reunión (volatilidad alta).

## 7. Marca (Brand Guardian, matriz de 10 criterios)
1. Estrategia: APROBADO. Muestra a Meridiano como asesor que verifica y acompaña; no promete rentabilidad.
2. Identidad verbal: APROBADO. Tono sobrio; cifras rotuladas como informadas, estimadas o brutas.
3. Identidad visual: APROBADO. Lockup vigente (D-034) solo en portada y cierre e isotipo en los pies; sin deformación ni efectos.
4. Tipografía: APROBADO. Fraunces Regular en titulares, sin negrita (D-036/D-040), y Poppins en el cuerpo. J/j en Lora: P-008, [EXTENSION].
5. Color: APROBADO. HEX oficiales; dorado solo como acento, cifra aislada o texto sobre fondo oscuro.
6. Fotografía: APROBADO. Solo imágenes de la propiedad y del entorno recibidas, sin deformación (27 imágenes, desviación máxima 0,001%). Se descartaron la foto del PDF con una patente legible y una vista cenital duplicada.
7. Composición: APROBADO. Un mensaje por lámina y márgenes de 0,6".
8. Experiencia: APROBADO. PDF 16:9 legible en pantalla, enlace y QR funcionales al mapa.
9. Premiumización: APROBADO.
10. Coherencia general: APROBADO. Mismo sistema que los decks vigentes de M4, San José, Sajonia y San Miguel.

**Veredicto general: APROBADO.**

**Fuentes de marca consultadas:**
- `knowledge-base/ai/05-matriz-de-decision.md`.
- Reglas de logo y color en `inventory/_raw-copies/meridiano-capital-identity/references/03` y `05`.
- `DECISION_REGISTER.md` (D-034, D-036, D-040, D-096, D-097, D-098).
- Skill `meridiano-property-presentation-adapter`: kit de construcción, `brand_tokens.json`, fuentes Fraunces y Poppins.

**Firma:** "Broker Inmobiliario | Meridiano Capital", por pedido expreso del founder (rank 1). El preset por regla para una venta sería A (D-039).

**Aviso legal:** disclaimer de venta (D-098), más "no constituye una garantía de rentabilidad".

## 8. Validaciones técnicas
- PPTX: `validate.py` (skill pptx) superado; 16 diapositivas editables (textos, tablas y gráfico nativos), con dos láminas de mercado nuevas (11 y 12).
- Imágenes: `validate_image_aspect_ratios.py` superado, desviación máxima 0,001% sobre una tolerancia de 0,5%.
- PDF: generado desde el PPTX final con LibreOffice; 16 páginas; fuentes incrustadas Fraunces, Poppins y Lora (más OpenSymbol para las viñetas).
- Revisión visual de las 16 diapositivas: sin cortes ni superposiciones.
- Excel: recalculado con LibreOffice; coincide con `model.json`: bruta residencial y total, renta anual, escenarios, medianas de mercado y auditoría. Celdas de entrada en azul sobre crema.
- Presentación, Excel, control interno y respuestas usan el mismo TC, con la misma fecha y fuente: todos se generan desde `model.json`.
- Contacto: teléfono único {M['contacto']['telefono']} (D-096), leído de `_config`.
- Datos personales: no se incluyen nombres de terceros, patentes ni datos de inquilinos. El autor que figura en los metadatos del PDF fuente no se reproduce.

## 9. Limitaciones
- Las fotos del PDF tienen 640 a 1.600 px: aptas para pantalla, limitadas para impresión grande.
- Las fuentes Fraunces, Poppins y Lora están incrustadas en el PDF. Para editar el PPTX con el diseño exacto hay que instalarlas (Google Fonts, licencia OFL); sin ellas, PowerPoint usa sustitutos.
"""

respuestas = f"""# Edificio Catedral — Respuestas para el asesor

Respuestas breves para las consultas previsibles de un inversor. Cifras al tipo de cambio {M['tc_texto']}.

**¿Cuánto renta hoy el edificio?**
Según el documento recibido, los 12 departamentos estaban alquilados a Gs 3.000.000 cada uno: {gs(M['res_m'])} por mes y {gs(M['res_a'])} por año. Antes de la oferta revisamos contratos y cobros, y confirmamos la fecha de ese relevamiento, que no figura en la fuente.

**¿Y los locales?**
Proyectamos los 3 salones a Gs 3.000.000 por mes cada uno: {gs(M['com_m'])} por mes. Es una hipótesis: todavía no confirmamos si están alquilados ni a qué canon.

**¿Qué rentabilidad tiene?**
- Bruta sobre el precio, residencial: {pct(M['res']['bruta'])}.
- Bruta proyectada con los locales: {pct(M['tot']['bruta'])}.

Son brutas: no descuentan gastos, impuestos, vacancia ni gastos de compra. No la llamamos neta hasta tener los gastos.

**¿Los alquileres de los departamentos están en valores de mercado?**
Sí, dentro del mercado y en la banda baja.
- Los avisos de 3 dormitorios en CDE (consulta del 07/11/2026) van de {fm(MK['res']['min'])} a {fm(MK['res']['max'])}, con mediana de {fm(MK['res']['mediana'])}. La parte alta son unidades amobladas o premium.
- Los estándar sin amoblar se publican entre {fm(MK['res']['std_min'])} y {fm(MK['res']['std_max'])}.
- Un rango razonable para estos departamentos es {fm(MK['res']['rango_prelim'][0])} a {fm(MK['res']['rango_prelim'][1])}, según estado y superficie, que todavía no conocemos.

**¿Cuánto podrían generar los salones?**
- En {MK['com']['n']} avisos de salones de CDE, la mediana es {fm(MK['com']['mediana'])}; los estándar van de {fm(MK['com']['std_min'])} a {fm(MK['com']['std_max'])}.
- Los salones premium del microcentro se publican a USD 700–1.350 por 75 m².
- La hipótesis de Gs 3.000.000 por salón está en la mediana. El rango razonable es {fm(MK['com']['rango_prelim'][0])} a {fm(MK['com']['rango_prelim'][1])}, según superficie, frente y estado. No es una tasación: falta el dato de cada salón.

**¿El ingreso mensual total está comprobado?**
No.
- Lo residencial ({gs(M['res_m'])} por mes) es información del vendedor, sin fecha de relevamiento y sin contratos revisados.
- Lo comercial ({gs(M['com_m'])} por mes) es una hipótesis.
- El total de {gs(M['tot_m'])} es una proyección bruta.

**¿Qué margen de mejora tienen los alquileres?**
- Departamentos: moderado, hacia Gs 3,3–3,5 M por unidad según estado y superficie, y solo al renovar cada contrato.
- Salones: potencialmente mayor si tienen buen frente, hasta unos Gs 4,5 M según la muestra.

Ningún aumento es automático: depende de los contratos, la ley y la negociación.

**El aviso decía 9,75% y "7% comprobado". ¿Por qué ustedes muestran otra cifra?**
- El 9,75% se calculó con un dólar de unos Gs 5.770, el de mediados de octubre. Con la cotización del BCP del {f_tc} (Gs {n(M['tc'], 2)}), la misma cuenta da {pct(M['tot']['bruta'])}.
- El 7% surge de una planilla con dólar a Gs 6.000, solo los departamentos y un único gasto. No pudimos verificar su base, por eso trabajamos con nuestros propios cálculos.

**¿Por qué cambia la rentabilidad con el dólar?**
El precio está en dólares y los alquileres en guaraníes. Si sube el dólar, la renta medida en dólares baja, y al revés. Con la misma renta, la bruta total fue 9,75% con el dólar del 16/10 (Gs 5.770,91) y es {pct(M['tot']['bruta'])} con el del {f_tc} (Gs {n(M['tc'], 2)}). En el Excel se cambia el tipo de cambio y todo se recalcula.

**¿En cuánto tiempo recupero la inversión?**
Con la renta bruta, sin gastos: unos {n(M['res']['recuperacion'], 1)} años con los departamentos y {n(M['tot']['recuperacion'], 1)} años con los locales. Es una recuperación simple, no una TIR.

**¿Cuántos metros tiene?**
- Terreno: 700 m² (17,50 × 40 m).
- Superficie construida informada: 2.290 m², que confirmaremos con los planos.
- Precio por m² construido: {usd(M['usd_m2_construido'])}.

**¿Cómo son los departamentos?**
- Tres dormitorios: uno en suite y dos con baño compartido.
- Además, habitación de servicio con baño.
- Sala, comedor-cocina, lavadero y tendedero, balcón amplio y una cochera.

No tenemos todavía la superficie de cada unidad.

**¿Tiene la documentación en regla?**
El vendedor declara planos aprobados y documentación en regla. Lo verificamos con el escribano: título, catastro, planos y situación municipal.

**¿Dónde queda exactamente?**
Sobre Pampliega casi Av. Mayor Rivas Ortellado, Barrio Catedral, cerca de la Catedral San Blas, Shopping China y el Hotel Acaray. La ubicación exacta la confirmamos en la visita. El Cellshop es un proyecto futuro, sin fecha confirmada.

**¿Necesita obras?**
No lo afirmamos hasta hacer la inspección técnica: estructura, instalaciones, pozo artesiano y mantenimiento.

**¿Puedo comprar desde el exterior?**
Sí. Acompañamos la cédula paraguaya, la cuenta bancaria y, si conviene, la constitución de una sociedad. El abogado, el escribano y el contador realizan esas tareas; nosotros coordinamos.

**¿Qué pasa después de la compra?**
Si lo desea, administramos el edificio: contratos, cobranza, mantenimiento y reportes.

**Próximo paso:** coordinar la visita y pedir contratos, detalle de alquileres, gastos y documentación.
Juan José Castillo · {M['contacto']['telefono']} · {M['contacto']['email']}
"""
open(os.path.join(E, 'Edificio_Catedral_Control_Interno.md'), 'w').write(control)
open(os.path.join(E, 'Edificio_Catedral_Respuestas_Asesor.md'), 'w').write(respuestas)
print('MD: control interno y respuestas generados')
