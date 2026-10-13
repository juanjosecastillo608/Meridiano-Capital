import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = 5694
P = M['P']; G = M['G']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(x)

PROJ = 'Edificio Barrio San José'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = 'Gs 5.694 por USD (BCP, 09/10/2026)'

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

S = []
# 01 COVER
S.append(f'''<section class="s cover">
<div class="cl">{logo(True)}
<div class="eb g" style="margin-top:96px">Edificio de renta en venta</div>
<h1>Edificio<br>Barrio San José</h1>
<div class="addr">Barrio San José · Ciudad del Este, Alto Paraná</div>
<div class="cvk"><div><div class="v">Gs 1.600 M</div><div class="l">Precio de venta · {usd(P)}</div></div>
<div><div class="v">600 m²</div><div class="l">Construidos sobre 459 m² de terreno</div></div></div>
<div class="cf">Construido en 2006 · Datos informados, pendientes de verificación documental · TC Gs 5.694 (BCP, 09/10/2026)</div></div>
<div class="cr"><img src="img/facade.jpg" style="object-position:28% 50%"></div></section>''')

# 02 RESUMEN
kp = [(gs(1_600_000_000).replace('Gs ', 'Gs '), f'Precio de venta · {usd(P)}'), ('600 m²', 'Superficie construida'), ('459 m²', 'Terreno de 13,5 × 34 m'), ('8·1·2', 'Dptos. monoambiente · casa · habitaciones'),
      ('Gs 11.000.000', f'Ingreso mensual · {usd(M["up_act"]["usd"])}'), (pct(M['bruta']), 'Rentabilidad bruta sobre precio'), (pct(M['neta']), 'Rentabilidad neta final'), (pct(M['proj']['Base']['tir'], 1), 'TIR estimada a 5 años (base)')]
kh = ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in kp)
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de renta con 8 departamentos, una casa y dos habitaciones')}
<p class="lead">Edificio construido en 2006 en el barrio San José de Ciudad del Este, con renta activa en sus 8 departamentos monoambiente y la casa de planta baja, y margen para optimizar los alquileres e incorporar las dos habitaciones independientes.</p>
<div class="kgrid">{kh}</div>
<div class="box">Ocupación: renta activa en 8 dptos. y casa, según información recibida · Contratos pendientes de verificación documental · Tipo de cambio {TCTXT}</div>''', 2))

# 03 UBICACION
loc = [('Ciudad', 'Ciudad del Este, departamento de Alto Paraná'), ('Barrio', 'San José'), ('Dirección declarada', 'Av. Senador Long, frente a la vía, según la publicación del inmueble'), ('Cocheras', '4, según la publicación; a verificar en la visita')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Barrio San José, Ciudad del Este')}
<div class="two"><div class="mapimg"><img src="img/aerial.jpg"><div class="cap">Vista aérea del entorno · el edificio, señalado</div></div>
<div class="locr">{lh}
<a class="glink" href="https://maps.app.goo.gl/jtpSEDXhJ8mzXVPY8">Abrir en Google Maps</a>
<p class="note">Ubicación del edificio en Google Maps. La parcela exacta se confirma con el título y el plano antes de la oferta.</p></div></div>''', 3))

# 04 ZONA
pts = [('Demanda de alquiler accesible', 'Monoambientes y casa orientados a quienes trabajan en el comercio y los servicios de la ciudad. En el barrio se publican desde habitaciones con baño hasta departamentos de 2 dormitorios.'),
       ('Renta diversificada', '11 unidades de renta: la salida de un inquilino afecta solo una parte del ingreso total.'),
       ('Margen de optimización', 'El canon promedio actual es Gs 1.000.000 por departamento; la proyección recibida plantea Gs 1.800.000, sujeta a validación.')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('La zona para el inversor', 'Ciudad del Este: el polo comercial de la frontera')}
<div class="two z"><div class="ztext"><p>Ciudad del Este, capital del departamento de Alto Paraná, es la segunda ciudad del Paraguay y uno de los principales centros comerciales de la región. Se une con Foz do Iguaçu (Brasil) por el Puente de la Amistad y forma, con Puerto Iguazú (Argentina), la Triple Frontera.</p>
<p>Su economía gira en torno al comercio de frontera, los servicios y la actividad vinculada a la represa de Itaipú. Esa base de trabajo sostiene una demanda de vivienda en alquiler de escala accesible, como la que ofrece este edificio.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{ph}</div></div>
<div class="src">Contexto general de Ciudad del Este. Referencias de alquiler publicadas en InfoCasas, ViaParaguay, MercadoProp, Asuncion.estate y Century 21, consultadas el 13/10/2026 (ver lámina 15). Vacancia del barrio: sin dato publicado.</div>''', 4))

# 05 SUPERFICIES
sv = [('600 m²', 'Superficie construida · 1,3 veces el terreno'), ('2006', 'Año de construcción · 20 años'),
      (usd(M['usd_m2']), 'Por m² construido, terreno incluido'), (usd(M['costo_nuevo']), 'Costo de construir hoy 600 m² (USD 650/m², sin terreno)'),
      (pct(M['pct_costo'], 0), 'El precio frente a ese costo de construcción nueva'), (usd(M['usd_unidad']), 'Por unidad de renta (11 unidades)')]
svh = ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in sv)
S.append(slide(f'''{head('Superficies y valor', '459 m² de terreno y 600 m² construidos')}
<div class="sup"><div class="lot"><div class="rect" style="width:120px;height:302px"><span>459 m²</span></div><div class="dimr">34 m de fondo</div><div class="dimb">13,5 m de frente</div></div>
<div><div class="kgrid k2">{svh}</div>
<div class="src" style="position:static;margin-top:14px">Referencia: tabla de costos de construcción de Meridiano Capital (edificio de departamentos, calidad básica). Edificios publicados en Ciudad del Este: uno en esquina de 720 m² a USD 275.000 (USD 382/m²) y uno con renta activa de 8 dptos. y 3 locales en Ciudad Nueva a USD 780.000 (InfoCasas, 13/10/2026); difieren en ubicación, composición y estado. Valores de referencia, no tasación: el costo de construcción nueva no descuenta los 20 años del edificio ni su estado de conservación.</div></div></div>''', 5))

# 06 DISTRIBUCION
rows = [('Primer y segundo piso', '8 dptos. monoambiente (4 + 4)', 'Gs 8.000.000', usd(8e6 / TC)), ('Planta baja', 'Casa', 'Gs 3.000.000', usd(3e6 / TC)),
        ('Habitaciones', '1 terminada · 1 a terminar', 'No informado', '—')]
rh = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in rows)
rh += f'<tr class="tot"><td>Total</td><td>8 dptos., casa y 2 habitaciones</td><td>Gs 11.000.000</td><td>{usd(11e6/TC)}</td></tr>'
bars = [('8 dptos.', 8000), ('Casa', 3000), ('Habit.', 0)]
mx = 8000; bh = ''
for i, (l, v) in enumerate(bars):
    h = 170 * v / mx; x = 30 + i * 80
    bh += f'<rect x="{x}" y="{200-h}" width="44" height="{h}" fill="#14313A"/><text x="{x+22}" y="{194-h}" class="bl">{n(v) if v else "s/d"}</text><text x="{x+22}" y="218" class="bx">{l}</text>'
S.append(slide(f'''{head('Distribución de las unidades', 'Casa en planta baja y dos niveles de departamentos')}
<div class="two d6"><table class="t"><tr><th>Nivel</th><th>Composición</th><th>Gs por mes</th><th>USD por mes</th></tr>{rh}</table>
<div class="chart"><div class="ct">Alquiler mensual por componente, miles de Gs</div><svg viewBox="0 0 270 225">{bh}</svg></div></div>
<p class="note2">Los 8 departamentos se informan en conjunto (promedio Gs 1.000.000 por unidad); la renta por piso no está desagregada. Composición y montos informados, pendientes de verificar contra contratos.</p>''', 6))

# 07-09 FOTOS
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada y áreas exteriores')}
<div class="ph"><figure style="width:620px"><img src="img/facade.jpg" style="height:412px"><figcaption>Fachada del edificio y balcones</figcaption></figure>
<figure style="width:390px"><img src="img/patio.jpg" style="height:412px"><figcaption>Patio y cocheras dentro del predio</figcaption></figure></div>''', 7, dark=True))
S.append(slide(f'''{head('Recorrido fotográfico', 'Ambientes interiores')}
<div class="ph"><figure style="width:560px"><img src="img/living.jpg" style="height:412px"><figcaption>Sala de estar</figcaption></figure>
<div class="stack" style="width:300px"><figure><img src="img/ambiente.jpg" style="height:190px"><figcaption>Ambiente con ventana interior</figcaption></figure><figure><img src="img/dorm_rosa.jpg" style="height:190px"><figcaption>Dormitorio con placard</figcaption></figure></div>
<figure style="width:180px"><img src="img/cocina.jpg" style="height:412px"><figcaption>Cocina</figcaption></figure></div>''', 8))
S.append(slide(f'''{head('Recorrido fotográfico', 'Dormitorios, baño y circulación')}
<div class="ph"><figure style="width:330px"><img src="img/dormitorio.jpg" style="height:412px"><figcaption>Dormitorio</figcaption></figure>
<figure style="width:330px"><img src="img/bano.jpg" style="height:412px"><figcaption>Baño con ducha</figcaption></figure>
<figure style="width:330px"><img src="img/pasillo.jpg" style="height:412px"><figcaption>Pasillo de circulación</figcaption></figure></div>''', 9, dark=True))

# 10 ALQUILERES VIGENTES
ar = [('Primer y segundo piso', '8 dptos. monoambiente', 'Gs 8.000.000', usd(8e6 / TC)), ('', 'Promedio por departamento', 'Gs 1.000.000', usd(1e6 / TC)),
      ('Planta baja', 'Casa', 'Gs 3.000.000', usd(3e6 / TC)), ('Independiente', 'Habitación terminada', 'No informado', '—'), ('Independiente', 'Habitación a terminar', 'Sin renta · en obra', '—')]
arh = ''.join(f'<tr class="{"sub" if a=="" else ""}"><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in ar)
arh += f'<tr class="tot"><td>Total</td><td>Renta activa informada</td><td class="r">Gs 11.000.000</td><td class="r">{usd(11e6/TC)}</td></tr>'
crit = [('Fuente', 'Montos informados por el propietario o su asesor.'), ('Pendiente', 'Contratos, depósitos e historial de cobro, a revisar antes de la oferta.'),
        ('Habitaciones', 'La renta de la habitación terminada no se informó; no se incluye en el ingreso actual.'), ('Tipo de cambio', TCTXT + '.')]
ch = ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in crit)
S.append(slide(f'''{head('Alquileres vigentes', f'Ingreso mensual: Gs 11.000.000 · {usd(11e6/TC)}')}
<div class="two d10"><table class="t"><tr><th>Nivel</th><th>Concepto</th><th>Gs por mes</th><th>USD</th></tr>{arh}</table>
<div class="crit"><div class="eb sm">Estado de la información</div>{ch}</div></div>''', 10))

# 11 INGRESOS Y EGRESOS
pre, net = M['pre'], M['net']
er = [('Ingreso bruto anual', '100%', usd(G), 'b'), ('IVA (5% alquiler residencial)', pct(.05, 1), '– ' + usd(M['iva']), ''), ('Vacancia', pct(.04, 1), '– ' + usd(M['vac']), ''),
      ('Administración', pct(.08, 1), '– ' + usd(M['adm']), ''), ('Mantenimiento', pct(.05, 1), '– ' + usd(M['man']), ''), ('Gastos fijos del edificio', pct(M['F'] / G, 1), '– ' + usd(M['F']), ''),
      ('Resultado antes de impuesto a la renta', pct(pre / G, 1), usd(pre), 'b'), ('Impuesto a la renta estimado (IRE 10%)', pct(M['ire'] / G, 1), '– ' + usd(M['ire']), ''),
      ('Resultado neto anual', pct(net / G, 1), usd(net), 'tot')]
erh = ''.join(f'<tr class="{c}"><td>{a}</td><td>{b}</td><td>{d}</td></tr>' for a, b, d, c in er)
cr = [('IVA', '5% sobre alquiler residencial: departamentos, casa y habitaciones.'), ('Vacancia 4%', 'Supuesto de referencia para departamentos; a validar con datos del barrio.'),
      ('Administración 8%', 'Cobranza, contratos e inquilinos.'), ('Mantenimiento 5%', 'Reparaciones menores y recambios entre inquilinos.'),
      ('Gastos fijos', 'Supuesto de Gs 6.000.000 por año; no informados por el propietario.'), ('Impuesto a la renta', '10% estimado si se compra por sociedad; el contador define la base real.')]
crh = ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in cr)
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two d11"><table class="t big"><tr><th>Concepto</th><th>% del bruto</th><th>USD por año</th></tr>{erh}</table>
<div class="crit"><div class="eb sm">Criterios</div>{crh}</div></div>''', 11))

# 12 RENTABILIDAD
S.append(slide(f'''{head('Rentabilidad', 'Indicadores sobre el precio de venta')}<div class="rule"></div>
<div class="rg"><div><div class="bigv">{pct(M['bruta'])}</div><div class="bl2">Rentabilidad bruta</div><div class="bs">Gs 132.000.000 de ingreso bruto anual ÷ Gs 1.600.000.000</div></div>
<div><div class="bigv">{pct(M['neta'])}</div><div class="bl2">Rentabilidad neta final</div><div class="bs">Gs {n(net*TC)} de resultado neto ÷ Gs 1.600.000.000</div></div>
<div class="rg2"><div><div class="midv">{pct(M['neta_pre'])}</div><div class="bs">Neta antes de impuesto a la renta</div></div><div><div class="midv">{n(M['veces'],1)} veces</div><div class="bs">Precio ÷ ingreso bruto anual</div></div></div>
<div class="bs how"><b>Cómo leer estas cifras.</b> Calculadas sobre la renta actual informada, sin la proyección de optimización. La neta final descuenta IVA, vacancia, administración, mantenimiento, gastos fijos e impuesto a la renta estimado. El denominador es el precio de venta, sin gastos de adquisición. Cifras de referencia, no garantizadas.</div></div>''', 12, dark=True))

# 13 PROYECCION
pr = M['proj']; cols = {'Conservador': '#6B6154', 'Base': '#14313A', 'Optimista': '#8B3323'}
y0, y1 = 14000, 22000; W, H = 560, 250; L = 70
def Y(v): return 10 + H - (v - y0) / (y1 - y0) * H
def X(i): return L + 30 + i * (W - 60) / 4
sv_ = ''
for k in range(y0, y1 + 1, 1000):
    sv_ += f'<line x1="{L}" x2="{L+W}" y1="{Y(k)}" y2="{Y(k)}" stroke="#DAD2C0" stroke-width="0.8"/><text x="{L-6}" y="{Y(k)+3}" class="ya">USD {n(k)}</text>'
for i in range(5): sv_ += f'<text x="{X(i)}" y="{H+30}" class="xa">Año {i+1}</text>'
for name, c in cols.items():
    p = ' '.join(f'{X(i)},{Y(v)}' for i, v in enumerate(pr[name]['nets']))
    sv_ += f'<polyline points="{p}" fill="none" stroke="{c}" stroke-width="2.2"/>' + ''.join(f'<circle cx="{X(i)}" cy="{Y(v)}" r="3.6" fill="{c}"/>' for i, v in enumerate(pr[name]['nets']))
leg = ''.join(f'<span><i style="background:{c}"></i>{k}</span>' for k, c in cols.items())
ptab = ''.join(f'<tr><td>{k}</td><td>+{g} anual</td><td>{usd(pr[k]["nets"][4])}</td></tr>' for k, g in [('Conservador', '3,0%'), ('Base', '5,0%'), ('Optimista', '8,0%')])
S.append(slide(f'''{head('Proyección de alquiler', 'Resultado neto anual proyectado a cinco años')}
<div class="two d13"><div><svg viewBox="0 0 {L+W+10} {H+45}" class="lc">{sv_}</svg><div class="leg">{leg}</div></div>
<div><table class="t"><tr><th>Escenario</th><th>Alquileres</th><th>Neto año 5</th></tr>{ptab}</table>
<p class="bs dk"><b>Margen de ajuste.</b> Hoy el promedio es Gs 1.000.000 por departamento. La proyección recibida plantea Gs 1.800.000 por unidad e incorporar las dos habitaciones (ver lámina siguiente): por eso la base parte de la renta actual y el ajuste se valida en cada renovación, según el mercado y el estado de cada unidad.</p></div></div>
<div class="src">Proyección ilustrativa en USD al tipo de cambio del día constante; gastos fijos constantes; no garantizada.</div>''', 13))

# 14 OPTIMIZACION
U = [M['up_act'], M['up_int'], M['up_inf'], M['up_sup']]
def rowo(lbl, f): return '<tr><td>' + lbl + '</td>' + ''.join(f'<td>{f(u)}</td>' for u in U) + '</tr>'
ot = rowo('Ingreso mensual', lambda u: gs(u['m'])) + rowo('Ingreso mensual en USD', lambda u: usd(u['usd'])) + rowo('Ingreso anual', lambda u: gs(u['anual'])) + rowo('Rentabilidad bruta', lambda u: pct(u['bruta'])) + rowo('Recuperación simple bruta', lambda u: n(u['ret'], 1) + ' años')
S.append(slide(f'''{head('Potencial de optimización', 'La proyección recibida lleva la bruta de 8,25% a 14,5–14,9%')}
<table class="t big"><tr><th>Indicador</th><th>Actual informado</th><th>Etapa intermedia</th><th>Proyección inferior</th><th>Proyección superior</th></tr>{ot}
<tr class="sub"><td>Supuesto</td><td>8 dptos. a Gs 1,0 M · casa Gs 3,0 M</td><td>8 dptos. a Gs 1,8 M · casa · 1 habitación</td><td>8 dptos. a Gs 1,8 M · casa · 2 habitaciones</td><td>Ídem inferior · casa a Gs 3,5 M</td></tr></table>
<p class="note2"><b>Lo que debe validarse.</b> Un canon de Gs 1.800.000 implica +80% sobre el promedio actual por departamento: requiere comparables de alquiler verificados del barrio. Las habitaciones suponen Gs 1.000.000 cada una; la segunda necesita terminación, con costo de obra aún no presupuestado. Escenarios brutos: no equivalen a renta neta ni garantizan ocupación o precio.</p>''', 14))

# 15 REFERENCIAS DE ALQUILER
cmp = [('Habitación con baño', '18 m²', 'Barrio San José', 'Gs 1.000.000', 'MercadoProp'),
       ('Monoambiente', '25 m²', 'Ciudad del Este', 'Gs 1.500.000', 'Asuncion.estate'),
       ('Dúplex 2 dorm.', '—', 'Barrio San José', 'Gs 2.300.000', 'MercadoProp'),
       ('Depto. 1 dorm.', '60 m²', 'KM 9 Acaray', 'Gs 2.300.000', 'Asuncion.estate'),
       ('Depto. 1 dorm.', '32 m²', 'Ciudad del Este', 'Gs 2.700.000', 'Asuncion.estate'),
       ('Monoambiente, Zuba 12', '28 m²', 'KM 8', 'Gs 3.000.000', 'InfoCasas'),
       ('Depto. amoblado', '36 m²', 'Barrio San José', 'USD 700', 'ViaParaguay')]
cmh = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td></tr>' for a, b, c, d, e in cmp)
lec = [('Canon actual', 'Gs 1.000.000 por departamento: en línea con la referencia más básica del barrio, una habitación con baño de 18 m².'),
       ('Objetivo recibido', 'Gs 1.800.000 se ubica entre esa referencia y los monoambientes de 25 a 28 m² (Gs 1,5 a 3,0 M), que en su mayoría son edificios nuevos o de la zona KM 8.'),
       ('Lo que falta', 'Superficie y estado de cada unidad del edificio: sin ese dato el objetivo no se confirma ni se descarta.'),
       ('Confianza', 'Baja: muestra pública heterogénea; precios publicados, no contratos cerrados.')]
lch = ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in lec)
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres publicados en Ciudad del Este')}
<div class="two d11 cmp"><table class="t"><tr><th>Oferta</th><th>Superficie</th><th>Ubicación</th><th>Precio por mes</th><th>Fuente</th></tr>{cmh}</table>
<div class="crit"><div class="eb sm">Lectura para este edificio</div>{lch}</div></div>
<div class="src">Ofertas consultadas el 13/10/2026 en portales inmobiliarios; disponibilidad no confirmada. Selección de monoambientes, estudios y unidades de 1 a 2 dormitorios del estudio de mercado preliminar de Meridiano Capital.</div>''', 15))

# 15 PLUSVALIA
def rowp(lbl, f, cls=''): return f'<tr class="{cls}"><td>{lbl}</td>' + ''.join(f'<td>{f(pr[k])}</td>' for k in ['Conservador', 'Base', 'Optimista']) + '</tr>'
vals = {'Conservador': '2,0%', 'Base': '3,5%', 'Optimista': '5,0%'}
pt_ = '<tr><td>Valorización anual supuesta</td>' + ''.join(f'<td>{vals[k]}</td>' for k in vals) + '</tr>'
pt_ += rowp('Valor estimado al año 5', lambda p: usd(p['V'])) + rowp('Plusvalía estimada', lambda p: usd(p['plus'])) + rowp('IVA de la venta futura (1,5%)', lambda p: '– ' + usd(p['ivav'])) + rowp('Renta neta acumulada 5 años', lambda p: usd(p['acum'])) + rowp('Ganancia total estimada', lambda p: usd(p['total']), 'b') + rowp('TIR estimada a 5 años', lambda p: pct(p['tir'], 1), 'tot')
S.append(slide(f'''{head('Plusvalía y retorno total', 'Escenarios a cinco años')}
<div class="two d15"><table class="t big"><tr><th>Concepto</th><th>Conservador</th><th>Base</th><th>Optimista</th></tr>{pt_}</table>
<div class="dbox"><div class="bigv bv2">{pct(pr['Base']['tir'],1)}</div><div class="bs">TIR estimada, escenario base</div><p>Compra a Gs 1.600.000.000 ({usd(P)}), cinco años de renta neta creciente sobre la renta actual y venta al valor estimado del año 5.</p><p class="gold">Punto de partida: el precio equivale al {pct(M['pct_costo'],0)} del costo de construir hoy la misma superficie, sin contar el terreno.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen la optimización de alquileres, gastos de adquisición ni comisión de venta. El valor futuro depende del mercado, del estado del edificio y de su ocupación al vender.</div>''', 16))

# 16 PRECIO
info = [('Activo', '8 departamentos monoambiente, 1 casa y 2 habitaciones independientes (una a terminar); 4 cocheras según la publicación. 600 m² construidos en 2006 sobre 459 m² de terreno.'),
        ('Ocupación', 'Renta activa en los 8 departamentos y la casa, según información recibida. Pendiente de verificación documental.'),
        ('Ingreso', f'Gs 11.000.000 por mes · Gs 132.000.000 por año ({usd(G)} al tipo de cambio del día).'),
        ('Título y forma de pago', 'Inmueble titulado, según información recibida; el escribano lo verifica. Forma de pago y entrega a acordar en el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">Gs 1.600.000.000</div><div class="bs">Precio de venta · aprox. {usd(P)}</div><p>Edificio construido en 2006</p><p>Precio y alquileres en guaraníes. Equivalente en dólares: {TCTXT}.</p><div class="dfoot">{pct(M['bruta'])} bruta · {pct(M['neta'])} neta final · Gs {n(round(net*TC/12,-3))} netos por mes</div></div>
<div class="info">{ih}</div></div>''', 17))

# 17 PROCESO
steps = [('Visita al edificio', 'Recorrido de los departamentos, la casa y las habitaciones, con inspección técnica de estructura, instalaciones e impermeabilización.'),
         ('Oferta y reserva', 'Propuesta de precio y forma de pago; reserva con documentación de respaldo.'),
         ('Revisión notarial', 'Título, informe de condiciones de dominio e impuesto inmobiliario al día, a cargo del escribano.'),
         ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto y escritura', 'Firma del boleto de compraventa y escritura pública ante el escribano.'),
         ('Administración', 'Traspaso de los contratos vigentes, ajuste de alquileres y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.</div>''', 18))

# 18 CONSIDERACIONES
rk = [('Canon proyectado', 'La proyección de Gs 1.800.000 por departamento (+80%) no está validada con comparables del barrio; la base de este análisis es la renta actual.'),
      ('Información de cobro', 'Contratos, depósitos e historial de cobro y ocupación aún no revisados: son condición previa a la oferta.'),
      ('Tipo de cambio', 'Precio y alquileres en guaraníes. Para el inversor que mide en dólares, el retorno en USD depende de la evolución del guaraní.'),
      ('Costos de operación', 'Un edificio de 2006 con 11 unidades requiere mantenimiento continuo; la habitación a terminar implica una obra aún no presupuestada.'),
      ('Impuestos', 'El impuesto a la renta depende de la estructura de compra y lo determina el contador.'),
      ('Valor de reventa', 'La plusvalía presentada son escenarios: el valor futuro depende del mercado y del estado del activo.')]
rkh = ''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar en un edificio de renta')}<div class="rks">{rkh}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', 19))

# 19 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo(True)}
<h2 class="ch">Coordinemos su visita al edificio</h2>
<p class="cp">Le presentamos el detalle de ingresos, la documentación del inmueble y una simulación ajustada a su estrategia de renta, y lo acompañamos en cada paso de la compra.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">+595 981 257 217 &nbsp;·&nbsp; juancastillo@meridianocapital.net &nbsp;·&nbsp; www.meridianocapital.net</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. No constituye una garantía de rentabilidad.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
html = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio de renta en venta</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>'
open(os.path.join(B, 'deck.html'), 'w').write(html)
print('slides', len(S))
