import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG, tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
D = json.load(open(os.path.join(B, 'estudio', 'Datos_mercado_San_Miguel.json')))
TC = TC_CFG
G = M['G']; PUB = M['pub']; RAP = M['rap']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(x)

PROJ = 'Edificio Barrio San Miguel'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
MAPS = D['subject']['maps_url']

ISO_DARK = '<svg viewBox="0 0 120 120" class="iso"><path d="M60 6 L14 100 L106 100 Z" fill="none" stroke="#14313A" stroke-width="6" stroke-linejoin="round"/><line x1="4" y1="112" x2="116" y2="112" stroke="#14313A" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="72" r="9" fill="#C9982E"/></svg>'
ISO_LIGHT = ISO_DARK.replace('#14313A', '#F3EDE3')

def logo(light=True):
    c = '#F3EDE3' if light else '#14313A'
    return f'''<div class="logo">{ISO_LIGHT if light else ISO_DARK}<div class="wm" style="color:{c}">MERIDIANO<br><span>CAPITAL</span></div></div>'''

def foot(num, dark=False):
    return f'<div class="foot {"d" if dark else ""}">{ISO_LIGHT if dark else ISO_DARK}<span>{FOOT_TXT}</span><b>{num:02d}</b></div>'

def slide(inner, num, dark=False, cls=''):
    return f'<section class="s {"dark" if dark else ""} {cls}">{inner}{foot(num, dark) if num else ""}</section>'

def head(eyebrow, title):
    return f'<div class="eb">{eyebrow}</div><h2>{title}</h2>'

def crit(items):
    return ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in items)

S = []
# 01 COVER
S.append(f'''<section class="s cover">
<div class="cl">{logo(True)}
<div class="eb g" style="margin-top:96px">Edificio de renta en venta</div>
<h1>Edificio<br>Barrio San Miguel</h1>
<div class="addr">Barrio San Miguel, Área 2 · Ciudad del Este, Alto Paraná</div>
<div class="cvk" style="gap:40px"><div><div class="v" style="white-space:nowrap">USD 350.000</div><div class="l">Precio de venta publicado</div></div>
<div><div class="v">400 m²</div><div class="l">Construidos sobre 360 m² de terreno</div></div>
<div><div class="v">12 rentas</div><div class="l">100% alquilado, contratos vigentes</div></div></div>
<div class="cf">Etapas de 1998 y 2016 · Datos informados, pendientes de verificación documental · {tc_corto()}</div></div>
<div class="cr"><img src="img/facade.jpg" style="object-position:50% 40%"></div></section>''')

# 02 RESUMEN
kp = [('USD 350.000', f'Precio publicado · {gs(round(PUB["Pgs"], -6))}'), ('400 m²', 'Construcción total aproximada'), ('360 m²', 'Terreno de 12 × 30 m'), ('12', 'Rentas: 7 dptos. · 3 monoambientes · salón · casa'),
      ('Gs 20.000.000', f'Ingreso mensual informado · {usd(20e6 / TC)}'), (pct(PUB['bruta']), 'Rentabilidad bruta sobre USD 350.000'), (pct(PUB['saldo']), 'Saldo después de gastos informados ÷ precio'), (pct(PUB['neta']), 'Neta conservadora Meridiano')]
kh = ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in kp)
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de tres pisos con doce unidades de renta')}
<p class="lead">Edificio en el barrio San Miguel (Área 2) de Ciudad del Este, construido en dos etapas (1998 y 2016), con planos municipales aprobados según el propietario. Informa 100% de ocupación e ingresos de Gs 20.000.000 por mes, con gastos de Gs 2.700.000 que incluyen IVA, mantenimiento y administración. Contratos vigentes verificados. Analizamos el precio publicado y un precio de venta rápida de USD 290.000 sugerido por Meridiano Capital.</p>
<div class="kgrid">{kh}</div>
<div class="box">Contratos vigentes verificados por Meridiano Capital · Gastos sin desglose completo (faltan los no incluidos en los Gs 2,7 M) · Tipo de cambio {TCTXT}</div>''', 2))

# 03 UBICACION
loc = [('Ciudad', 'Ciudad del Este, departamento de Alto Paraná · ubicación confirmada'), ('Barrio', 'San Miguel, Área 2'), ('Edificio', 'Tres pisos sobre terreno de 12 × 30 m, con salón comercial al frente'),
       ('Opcional', 'Estacionamiento techado lindero, de las mismas medidas, en venta por separado')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
pin = '<img src="img/ubicacion.jpg" style="object-position:84% 50%">'
S.append(slide(f'''{head('Ubicación', 'Barrio San Miguel, Área 2, Ciudad del Este')}
<div class="two"><div class="mapimg">{pin}<div class="cap">Vista satelital del entorno (Google Maps) · el edificio, señalado con el marcador rojo</div></div>
<div class="locr">{lh}
<a class="glink" href="{MAPS}">Abrir en Google Maps</a>
<p class="note">Ubicación confirmada por Meridiano Capital. Los datos de la parcela se cotejan con el título y el plano antes de la escritura.</p></div></div>''', 3))

# 04 ZONA
pts = [('Demanda de alquiler accesible', 'Departamentos de 1 y 2 dormitorios y monoambientes orientados a quienes trabajan en el comercio y los servicios de la ciudad.'),
       ('Renta diversificada', '12 unidades de renta, una de ellas comercial: la salida de un inquilino afecta solo una parte del ingreso total.'),
       ('Mezcla de producto', 'Cinco departamentos de 1 dormitorio, uno de 2, uno de 4, tres monoambientes, un salón y una casa: atienden demandas distintas.')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('La zona para el inversor', 'Ciudad del Este: el polo comercial de la frontera')}
<div class="two z"><div class="ztext"><p>Ciudad del Este, capital del departamento de Alto Paraná, es la segunda ciudad del Paraguay y uno de los principales centros comerciales de la región. Se une con Foz do Iguaçu (Brasil) por el Puente de la Amistad y forma, con Puerto Iguazú (Argentina), la Triple Frontera.</p>
<p>Su economía gira en torno al comercio de frontera, los servicios y la actividad vinculada a la represa de Itaipú. Esa base de trabajo sostiene una demanda de vivienda en alquiler de escala accesible, como la que ofrece este edificio.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{ph}</div></div>
<div class="src">Contexto general de Ciudad del Este. Referencias de alquiler y venta publicadas en Vía Paraguay, InfoCasas e Inova Inmobiliaria, consultadas el 16/10/2026 (láminas 15 y 16). Vacancia del barrio: sin dato publicado.</div>''', 4))

# 05 SUPERFICIES
sv = [('400 m²', 'Construcción total aproximada · 1,1 veces el terreno'), ('1998 · 2016', 'Primera etapa hasta el primer piso · segunda etapa'),
      (f"{usd(PUB['usd_m2'])} · {n(RAP['usd_m2'])}", 'Por m² construido, terreno incluido (publicado · venta rápida)'), (usd(M['costo_nuevo']), 'Costo de construir hoy 400 m² (USD 650/m², sin terreno)'),
      (f"{pct(PUB['pct_costo'], 0)} · {pct(RAP['pct_costo'], 0)}", 'Precio frente a ese costo de construcción nueva'), (f"{usd(PUB['usd_unidad'])} · {n(RAP['usd_unidad'])}", 'Por unidad de renta (12 unidades)')]
svh = ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in sv)
S.append(slide(f'''{head('Superficies y valor', '360 m² de terreno y 400 m² construidos')}
<div class="sup"><div class="lot"><div class="rect" style="width:120px;height:300px"><span>360 m²</span></div><div class="dimr">30 m de fondo</div><div class="dimb">12 m de frente</div></div>
<div><div class="kgrid k2">{svh}</div>
<div class="src" style="position:static;margin-top:14px">Referencia: tabla de costos de construcción de Meridiano Capital (edificio de departamentos, calidad básica). Valores de referencia, no tasación: el costo de construcción nueva no descuenta la antigüedad ni el estado de conservación, y los 400 m² son un total aproximado (falta confirmar si incluye la casa posterior y las circulaciones).</div></div></div>''', 5))

# 06 DISTRIBUCION
rows = [('Monoambientes', '3', 'Ambiente único', 'Residencial'), ('Dptos. de 1 dormitorio', '5', '1 dormitorio', 'Residencial'), ('Dpto. de 2 dormitorios', '1', '2 dormitorios', 'Residencial'),
        ('Dpto. de 4 dormitorios', '1', '4 dormitorios', 'Residencial'), ('Casa independiente', '1', '2 habitaciones, al fondo', 'Residencial'), ('Salón comercial', '1', 'Al frente del edificio', 'Comercial (IVA 10%)')]
rh = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in rows)
rh += '<tr class="tot"><td>Total</td><td>12</td><td>11 residenciales · 1 comercial</td><td>Gs 20.000.000 / mes</td></tr>'
bars = [('Mono.', 3), ('1 dorm.', 5), ('2 dorm.', 1), ('4 dorm.', 1), ('Casa', 1), ('Salón', 1)]
bh = ''
for i, (l, v) in enumerate(bars):
    h = 170 * v / 5; x = 8 + i * 44
    bh += f'<rect x="{x}" y="{200-h}" width="32" height="{h}" fill="#14313A"/><text x="{x+16}" y="{194-h}" class="bl">{v}</text><text x="{x+16}" y="218" class="bx">{l}</text>'
S.append(slide(f'''{head('Distribución de las unidades', 'Tres pisos, salón al frente y casa al fondo')}
<div class="two d6"><table class="t sm"><tr><th>Unidad</th><th>Cant.</th><th>Composición</th><th>Observación</th></tr>{rh}</table>
<div class="chart"><div class="ct">Unidades de renta por tipo</div><svg viewBox="0 0 270 225">{bh}</svg></div></div>
<p class="note2">Composición confirmada y contratos vigentes verificados. La renta se presenta como total del edificio, sin repartirla en partes iguales entre las doce unidades: el detalle por contrato se entrega en la etapa de oferta.</p>''', 6))

# 07-08 FOTOS
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada y circulación exterior')}
<div class="ph"><figure style="width:330px"><img src="img/facade.jpg" style="height:412px;object-position:50% 45%"><figcaption>Fachada con escalera exterior</figcaption></figure>
<figure style="width:680px"><img src="img/cocina_living.jpg" style="height:412px"><figcaption>Cocina y estar de una de las unidades</figcaption></figure></div>''', 7, dark=True))
S.append(slide(f'''{head('Recorrido fotográfico', 'Dormitorios y cocinas')}
<div class="ph"><figure style="width:540px"><img src="img/dorm_balcon.jpg" style="height:412px"><figcaption>Dormitorio con balcón y aire acondicionado</figcaption></figure>
<div class="stack" style="width:300px"><figure><img src="img/dormitorio.jpg" style="height:190px"><figcaption>Dormitorio</figcaption></figure><figure><img src="img/cocina.jpg" style="height:190px"><figcaption>Cocina comedor con lavadero</figcaption></figure></div>
<div style="width:150px;font-size:12px;line-height:1.6;color:var(--grey)">Fotografías recibidas del propietario. Algunas pueden tener retoque digital de luz y color: el estado real de cada unidad se confirma en la visita.</div></div>''', 8))

# 09 ETAPAS
et = [('1998', 'Primera etapa', 'Construcción hasta el primer piso, según el propietario.'), ('2016', 'Segunda etapa', 'Ampliación terminada, completando los tres pisos, según el propietario.'),
      ('Planos', 'Aprobación municipal', 'Planos municipales aprobados, según el propietario; no revisados todavía.')]
eh = ''.join(f'<div class="st"><div class="sth"><span class="pn">{a}</span><b>{b}</b></div><p>{c}</p></div>' for a, b, c in et)
S.append(slide(f'''{head('Historia constructiva', 'Dos etapas de obra: 1998 y 2016')}<div class="steps">{eh}</div>
<div class="two d10" style="margin-top:26px"><div class="crit">{crit([('Edad mixta', 'Parte de la estructura tiene 28 años y parte 10: instalaciones, impermeabilización y la junta entre etapas se revisan en la inspección técnica.'), ('Documentación', 'Comparar planos aprobados con lo construido: los 400 m² son un total aproximado.')])}</div>
<div class="crit">{crit([('CAPEX', 'Sin inspección ni presupuesto de mantenimiento: la inversión integral se calcula después de la visita técnica.'), ('Planos', 'La aprobación municipal de Ciudad del Este se coteja con la escribanía antes de la escritura.')])}</div></div>''', 9))

# 10 ALQUILERES VIGENTES
ar = [('Ingreso mensual informado', 'Gs 20.000.000', usd(20e6 / TC)), ('Gastos mensuales informados', '– Gs 2.700.000', '– ' + usd(2.7e6 / TC)), ('Saldo mensual informado', 'Gs 17.300.000', usd(17.3e6 / TC))]
arh = ''.join(f'<tr class="{"tot" if i == 2 else ""}"><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for i, (a, b, c) in enumerate(ar))
arh += f'<tr class="sub"><td>Gastos sobre ingreso</td><td>{pct(M["gastos_ratio"], 1)}</td><td>Incluye IVA, mantenimiento y administración</td></tr><tr class="sub"><td>Ocupación</td><td>100%</td><td>12 de 12 unidades con contrato vigente</td></tr>'
S.append(slide(f'''{head('Alquileres vigentes', f'Ingreso mensual: Gs 20.000.000 · {usd(20e6/TC)}')}
<div class="two d10"><table class="t big"><tr><th>Concepto</th><th>Gs por mes</th><th>USD por mes</th></tr>{arh}</table>
<div class="crit"><div class="eb sm">Estado de la información</div>{crit([('Contratos', 'Los 12 contratos están vigentes y fueron verificados por Meridiano Capital.'), ('Gastos', 'Los Gs 2.700.000 incluyen IVA, mantenimiento y administración. Faltan los demás gastos (impuesto inmobiliario, seguros, servicios no recuperados).'), ('Pendiente', 'Historial de cobro y vencimientos, para el análisis de la oferta.'), ('Tipo de cambio', TCTXT + '.')])}</div></div>''', 10))

# 11 INGRESOS Y EGRESOS
pre, net = M['pre'], M['net']
er = [('Ingreso bruto anual', '100%', usd(G), 'b'), ('Gastos informados (IVA, mant. y administración)', pct(M['GI'] / G, 1), '– ' + usd(M['GI']), ''), ('Saldo anual informado', pct(M['SALDO'] / G, 1), usd(M['SALDO']), 'b'),
      ('Vacancia de referencia', pct(.04, 1), '– ' + usd(M['vac']), ''), ('Otros gastos no informados (supuesto)', pct(M['OTROS'] / G, 1), '– ' + usd(M['OTROS']), ''),
      ('Resultado antes de impuesto a la renta', pct(pre / G, 1), usd(pre), 'b'), ('Impuesto a la renta estimado (IRE 10%)', pct(M['ire'] / G, 1), '– ' + usd(M['ire']), ''), ('Resultado neto conservador', pct(net / G, 1), usd(net), 'tot')]
erh = ''.join(f'<tr class="{c}"><td>{a}</td><td>{b}</td><td>{d}</td></tr>' for a, b, d, c in er)
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto conservador')}
<div class="two d11"><table class="t big"><tr><th>Concepto</th><th>% del bruto</th><th>USD por año</th></tr>{erh}</table>
<div class="crit"><div class="eb sm">Criterios</div>{crit([('Gastos informados', 'Gs 2.700.000 por mes, que ya incluyen IVA, mantenimiento y administración: no se vuelven a descontar.'), ('Vacancia 4%', 'Reserva prudente para rotación de inquilinos, aunque hoy los 12 contratos están vigentes.'), ('Otros gastos', 'Supuesto de Gs 6.000.000 por año (impuesto inmobiliario, seguros y otros), igual que en San José, hasta recibir el detalle.'), ('Impuesto a la renta', '10% estimado si se compra por sociedad; el contador define la base real.')])}</div></div>''', 11))

# 12 RENTABILIDAD (dos precios)
def rrow(lbl, k, d=2, sub=''):
    f = (lambda x: n(x, 1) + ' veces') if k == 'veces' else (lambda x: pct(x, d))
    return f'<div style="display:grid;grid-template-columns:330px 1fr 1fr;align-items:baseline;padding:13px 0;border-bottom:1px solid rgba(243,237,227,.18)"><div><div style="font-size:15px;font-weight:600">{lbl}</div><div class="bs" style="margin-top:3px">{sub}</div></div><div class="midv" style="color:var(--gold)">{f(PUB[k])}</div><div class="midv">{f(RAP[k])}</div></div>'
S.append(slide(f'''{head('Rentabilidad', 'Indicadores sobre los dos precios')}<div class="rule"></div>
<div style="display:grid;grid-template-columns:330px 1fr 1fr;margin-top:14px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8"><div></div><div>Publicado · USD 350.000</div><div>Venta rápida · USD 290.000</div></div>
{rrow('Rentabilidad bruta', 'bruta', sub='Gs 240.000.000 de ingreso anual ÷ precio')}
{rrow('Saldo informado ÷ precio', 'saldo', sub='Después de IVA, mantenimiento y administración')}
{rrow('Neta conservadora Meridiano', 'neta', sub='Con ajustes de referencia e impuesto a la renta')}
{rrow('Precio ÷ ingreso bruto anual', 'veces', sub='Múltiplo estático, no plazo de recuperación')}
<div class="bs how" style="margin-top:18px"><b>Cómo leer estas cifras.</b> Calculadas por Meridiano Capital sobre la renta y los gastos informados, al tipo de cambio del día. La neta antes de impuesto a la renta es {pct(PUB['neta_pre'])} a USD 350.000 y {pct(RAP['neta_pre'])} a USD 290.000. La neta incluye vacancia 4% y otros gastos supuestos; no incluye gastos de adquisición ni CAPEX (aún sin inspección). Referencia, no garantía.</div>''', 12, dark=True))

# 13 SENSIBILIDADES
sr = ''.join(f'<tr class="{"b" if i == 0 else ""}"><td>{s["n"]}</td><td>{gs(s["ing"])}</td><td>{gs(s["gas"])}</td><td>{pct(s["pub"]["bruta"])}</td><td>{pct(s["pub"]["saldo"])}</td><td>{pct(s["rap"]["bruta"])}</td><td>{pct(s["rap"]["saldo"])}</td></tr>' for i, s in enumerate(M['sens']))
mx = max(s['rap']['saldo'] for s in M['sens']); bh = ''
for i, s in enumerate(M['sens']):
    for j, (k, c) in enumerate([('pub', '#14313A'), ('rap', '#C9982E')]):
        v = s[k]['saldo']; h = 150 * v / mx; x = 20 + i * 92 + j * 34
        bh += f'<rect x="{x}" y="{180-h}" width="30" height="{h}" fill="{c}"/><text x="{x+15}" y="{174-h}" class="bl">{n(v*100,1)}</text>'
    bh += f'<text x="{20+i*92+32}" y="198" class="bx">{s["n"].split()[0]}</text>'
S.append(slide(f'''{head('Sensibilidades', 'Qué pasa si cambian los ingresos o los gastos')}
<table class="t sm" style="margin-top:8px"><tr><th>Escenario</th><th>Ingreso mensual</th><th>Gasto mensual</th><th>Bruta 350 k</th><th>Saldo 350 k</th><th>Bruta 290 k</th><th>Saldo 290 k</th></tr>{sr}</table>
<div class="two d13" style="margin-top:18px"><div class="chart"><div class="ct">Saldo informado ÷ precio, % · <span style="color:#14313A">■</span> USD 350.000 · <span style="color:#C9982E">■</span> USD 290.000</div><svg viewBox="0 0 380 205" style="width:420px;height:226px">{bh}</svg></div>
<div class="crit">{crit([('Conservador', 'Ingresos −10% y gastos +10%.'), ('Estrés', 'Ingresos −20% con gastos constantes.'), ('Mejora hipotética', 'Ingresos +10% y gastos +10%: solo sensibilidad, sin comparables que respalden el aumento.'), ('Lectura', 'Variaciones agregadas del total: no representan una cantidad concreta de unidades vacantes.')])}</div></div>''', 13))

# 14 RETORNO TOTAL (TIR hipotética)
pr = M['proj']; ks = ['Conservador', 'Base', 'Optimista']
def rowp(lbl, f, cls=''): return f'<tr class="{cls}"><td>{lbl}</td>' + ''.join(f'<td>{f(pr[k])}</td>' for k in ks) + '</tr>'
pt_ = rowp('Ajuste anual del alquiler', lambda p: pct(p['gr'], 1)) + rowp('Valorización anual supuesta', lambda p: pct(p['val'], 1))
pt_ += rowp('Valor estimado al año 5 (desde USD 350.000)', lambda p: usd(p['pub']['V'])) + rowp('IVA de la venta futura (1,5%)', lambda p: '– ' + usd(p['pub']['ivav'])) + rowp('Renta neta acumulada 5 años', lambda p: usd(p['pub']['acum']))
pt_ += rowp('Ganancia total estimada · USD 350.000', lambda p: usd(p['pub']['total']), 'b') + rowp('TIR hipotética · USD 350.000', lambda p: pct(p['pub']['tir'], 1), 'tot') + rowp('TIR hipotética · USD 290.000', lambda p: pct(p['rap']['tir'], 1), 'tot')
S.append(slide(f'''{head('Plusvalía y retorno total', 'Escenarios hipotéticos a cinco años')}
<div class="two d15"><table class="t big"><tr><th>Concepto</th><th>Conservador</th><th>Base</th><th>Optimista</th></tr>{pt_}</table>
<div class="dbox"><div class="bigv bv2">{pct(pr['Base']['pub']['tir'],1)}</div><div class="bs">TIR hipotética, escenario base, a USD 350.000</div><p>Inversión: precio de compra. Flujos: resultado neto conservador de la lámina 11. Salida: venta al valor estimado del año 5, menos IVA de 1,5%.</p><p class="gold">A USD 290.000 la base sube a {pct(pr['Base']['rap']['tir'],1)}. El conservador supone renta y valor sin cambios.</p></div></div>
<div class="src">Escenarios hipotéticos con supuestos explícitos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición, CAPEX, comisión de venta ni el estacionamiento lindero. Flujos en USD al tipo de cambio del día constante.</div>''', 14))

# 15 REFERENCIAS DE ALQUILER
R = {c['id']: c for c in D['rental_comparables']}
cmp = [('Depto. 2 dorm. con cochera', '65 m²', 'Riachuelo, San Miguel / Área 2', 'Gs 2.700.000', 'Vía Paraguay'),
       ('Depto. 1 dorm.', '35 m²', 'Centro de CDE', f'USD 230 + USD 20 expensas ({gs(round(230*TC,-3))})', 'InfoCasas'),
       ('Depto. 2 dorm.', '42 m²', 'Km 9 Acaray', 'Gs 2.500.000', 'InfoCasas'),
       ('Depto. 2 dorm. amoblado', '74,5 m²', 'Km 7 Ciudad Nueva', 'Gs 4.500.000 + Gs 150.000 expensas', 'Inova Inmobiliaria')]
assert all(R[i] for i in ('R01', 'R02', 'R03', 'R04'))
cmh = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td></tr>' for a, b, c, d, e in cmp)
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres publicados en Ciudad del Este')}
<div class="two d11 cmp"><table class="t"><tr><th>Oferta</th><th>Superficie</th><th>Ubicación</th><th>Precio por mes</th><th>Fuente</th></tr>{cmh}</table>
<div class="crit"><div class="eb sm">Lectura para este edificio</div>{crit([('Más cercana', 'La referencia de Riachuelo, en el mismo barrio: Gs 2,7 M por un 2 dormitorios de 65 m² con cochera.'), ('Lo que falta', 'Renta y superficie de cada unidad para compararlas una a una: sin ese detalle no se estima una brecha de alquiler.'), ('Sin referencia', 'Monoambientes básicos, el departamento de 4 dormitorios, la casa de 2 habitaciones y el salón frontal.'), ('Confianza', 'Baja: muestra pequeña de ofertas publicadas, no contratos cerrados.')])}</div></div>
<div class="src">Ofertas consultadas el 16/10/2026; disponibilidad no confirmada. Excluidas del análisis: un departamento premium amoblado con amenities (USD 1.600) y un tinglado con oficina. Equivalencias en guaraníes al tipo de cambio del día.</div>''', 15))

# 16 REFERENCIAS DE VENTA
V = D['sale_comparables']
def vusd(c): return c['price'] if c['currency'] == 'USD' else c['price'] / TC
vdesc = {'V01': '8 dptos. y 3 locales', 'V02': 'Vivienda y salones, a mantener', 'V03': '16 dptos., comercial y estacionamiento', 'V04': '12 dptos. y 3 salones',
         'V05': 'Showroom, oficinas y taller', 'V06': 'Casa con local frontal', 'V07': '4 dptos. amoblados', 'V08': 'Edificio residencial, 8 dorm.'}
vloc = {'V01': 'Km 7, Ciudad Nueva', 'V02': 'San Roque', 'V03': 'Centro', 'V04': 'Pampliega', 'V05': 'Boquerón', 'V06': 'San Miguel', 'V07': 'Ciudad Nueva', 'V08': 'Pablo Rojas'}
vr = ''
for c in V:
    u = vusd(c); b = c.get('built_area_m2')
    vr += f'<tr><td>{vloc[c["id"]]}</td><td>{vdesc[c["id"]]}</td><td>{n(b) + " m²" if b else "s/d"}</td><td>{usd(u)}</td><td>{usd(u / b) if b else "—"}</td></tr>'
vr += f'<tr class="tot"><td>Este edificio</td><td>12 rentas, 100% alquilado</td><td>400 m²</td><td>USD 350.000 · 290.000</td><td>USD 875 · 725</td></tr>'
S.append(slide(f'''{head('Referencias de venta', 'Edificios y casas con renta publicados en Ciudad del Este')}
<div class="two d11 cmp"><table class="t xs"><tr><th>Zona</th><th>Inmueble</th><th>Construido</th><th>Precio pedido</th><th>USD/m²</th></tr>{vr}</table>
<div class="crit"><div class="eb sm">Lectura para este edificio</div>{crit([('Rango amplio', 'Entre USD 240 y 1.150 por m² construido: la muestra mezcla tipologías, escalas y estados.'), ('Por debajo', 'Tres avisos publican por debajo del sujeto por m² (San Roque, Ciudad Nueva, Pablo Rojas): precio, documentación y estado se confirman antes de comparar.'), ('Sin tasación', 'Los precios del propietario no equivalen a un valor de mercado: no hay comparable homologable con renta verificada.')])}</div></div>
<div class="src">Precios pedidos en avisos consultados el 16/10/2026 (InfoCasas y Vía Paraguay), no cierres; superficies declaradas o derivadas, a verificar. San Roque publicado en guaraníes en 2024. Equivalencias al tipo de cambio del día.</div>''', 16))

# 17 ESTACIONAMIENTO LINDERO
pk = M['park']; ph_ = M['park_hurdle']
pkr = ''.join(f'<tr><td>Edificio {k} + estacionamiento</td><td>{usd(pk[c]["T"])}</td><td>{pct(pk[c]["bruta"])}</td><td>{pct(pk[c]["saldo"])}</td></tr>' for k, c in [('USD 350.000', 'pub'), ('USD 290.000', 'rap')])
hr = ''.join(f'<tr><td>{pct(h["r"], 0)} anual sobre USD 120.000</td><td>{gs(round(h["gs_mes"], -3))}</td></tr>' for h in ph_)
S.append(slide(f'''{head('Opción adicional', 'Estacionamiento techado lindero: USD 120.000')}
<div class="two d11"><div><table class="t"><tr><th>Caso mecánico</th><th>Precio total</th><th>Bruta</th><th>Saldo ÷ precio</th></tr>{pkr}</table>
<table class="t" style="margin-top:18px"><tr><th>Para sostener su propio rendimiento</th><th>Saldo mensual necesario</th></tr>{hr}</table></div>
<div class="crit"><div class="eb sm">Cómo se lee</div>{crit([('Compra opcional', 'Terreno de 12 × 30 m (360 m²) que linda con el edificio; no forma parte del caso base ni de los alquileres actuales.'), ('Caso mecánico', 'Suma el precio del estacionamiento sin sumarle renta: por eso los rendimientos bajan. No es una neta conjunta.'), ('Umbrales', 'Saldo mensual que el estacionamiento debería generar por sí solo; no es una estimación de mercado.'), ('Pendiente', 'Capacidad, superficie techada, accesos, título, gastos y contratos.')])}</div></div>''', 17))

# 18 PRECIO
info = [('Activo', '3 monoambientes, 5 departamentos de 1 dormitorio, 1 de 2 y 1 de 4, 1 casa de 2 habitaciones atrás y 1 salón comercial al frente. 400 m² sobre 360 m² de terreno, en tres pisos.'),
        ('Ocupación e ingreso', f'100% alquilado, contratos vigentes verificados · Gs 20.000.000 por mes ({usd(20e6/TC)}) · gastos de Gs 2.700.000 con IVA, mantenimiento y administración.'),
        ('Venta rápida', f'Precio de USD 290.000 ({pct(M["desc_rapida"], 1)} menos) sugerido por Meridiano Capital según el estudio de mercado y las referencias de la zona, para una operación en plazo corto; sujeto a aceptación del propietario.'),
        ('Título y forma de pago', 'Planos municipales aprobados según el propietario; título y dominio los verifica el escribano. Forma de pago en el boleto.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">USD 350.000</div><div class="bs">Precio publicado · aprox. {gs(round(PUB['Pgs'], -6))}</div><p>Venta rápida sugerida por Meridiano Capital: USD 290.000</p><p>Precio en dólares; alquileres en guaraníes. Equivalencias: {TCTXT}.</p><div class="dfoot">{pct(PUB['bruta'])} bruta · {pct(PUB['saldo'])} saldo ÷ precio · {pct(PUB['neta'])} neta conservadora</div></div>
<div class="info">{ih}</div></div>''', 18))

# 19 PROCESO
steps = [('Visita e inspección', 'Recorrido de las doce unidades, el salón y la casa, con inspección técnica de estructura, instalaciones, impermeabilización y la unión entre etapas.'),
         ('Renta y gastos', 'Detalle de renta por contrato, historial de cobro y los gastos no incluidos en los Gs 2.700.000.'),
         ('Revisión notarial', 'Título, municipio, informe de condiciones de dominio, planos aprobados e impuesto inmobiliario al día, a cargo del escribano.'),
         ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Oferta y escritura', 'Propuesta de precio y forma de pago; boleto de compraventa y escritura pública ante el escribano.'),
         ('Administración', 'Traspaso de los contratos vigentes y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.</div>''', 19))

# 20 CONSIDERACIONES
rk = [('Gastos incompletos', 'Los Gs 2,7 M incluyen IVA, mantenimiento y administración; los demás gastos se estiman con un supuesto hasta recibir el detalle.'),
      ('Vencimientos', 'Contratos vigentes hoy: su plazo y reajuste definen la estabilidad del ingreso en los próximos años.'),
      ('Estado y CAPEX', 'Etapas de 1998 y 2016, sin inspección técnica ni presupuesto de mantenimiento todavía.'),
      ('Tipo de cambio', 'Precio en dólares y alquileres en guaraníes: el retorno en USD depende de la evolución del guaraní.'),
      ('Impuestos y reventa', 'El impuesto a la renta depende de la estructura de compra (contador). La plusvalía presentada son escenarios.')]
rkh = ''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar en un edificio de renta')}<div class="rks">{rkh}</div>
<div class="src">Cifras de referencia, no garantizadas. Este documento no es una tasación ni una auditoría. Se recomienda evaluar la operación con asesoría propia.</div>''', 20))

# 21 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo(True)}
<h2 class="ch">Coordinemos su visita al edificio</h2>
<p class="cp">Le presentamos el detalle de ingresos, la documentación del inmueble y una simulación ajustada a su estrategia de renta, y lo acompañamos en cada paso de la compra.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. No constituye una garantía de rentabilidad.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
html = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio de renta en venta</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>'
open(os.path.join(B, 'deck.html'), 'w').write(html)
print('slides', len(S))
