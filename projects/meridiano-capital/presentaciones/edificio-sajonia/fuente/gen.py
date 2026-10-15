import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; P = M['P']
A, Bm = M['A'], M['B']
eA, eB = A['ev'], Bm['ev']
cxA, cxB = M['cxA'], M['cxB']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))

PROJ = 'Edificio Sajonia'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = 'Gs 5.694 por USD (BCP, 09/10/2026)'
MAPS = 'https://maps.app.goo.gl/Wa5gk2sX1pQZpFn59'

ISO_DARK = '<svg viewBox="0 0 120 120" class="iso"><path d="M60 6 L14 100 L106 100 Z" fill="none" stroke="#14313A" stroke-width="6" stroke-linejoin="round"/><line x1="4" y1="112" x2="116" y2="112" stroke="#14313A" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="72" r="9" fill="#C9982E"/></svg>'
ISO_LIGHT = ISO_DARK.replace('#14313A', '#F3EDE3')

def logo():
    return f'<div class="logo">{ISO_LIGHT}<div class="wm" style="color:#F3EDE3">MERIDIANO<br><span>CAPITAL</span></div></div>'
def foot(num, dark=False):
    return f'<div class="foot {"d" if dark else ""}">{ISO_LIGHT if dark else ISO_DARK}<span>{FOOT_TXT}</span><b>{num:02d}</b></div>'
def slide(inner, num, dark=False):
    return f'<section class="s {"dark" if dark else ""}">{inner}{foot(num, dark)}</section>'
def head(eb, title):
    return f'<div class="eb">{eb}</div><h2>{title}</h2>'
def kgrid(items, cls='kgrid'):
    return f'<div class="{cls}">' + ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in items) + '</div>'
def crit(title, items):
    return f'<div class="crit"><div class="eb sm">{title}</div>' + ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in items) + '</div>'
def table(hdr, rows, cls='t'):
    h = ''.join(f'<th>{x}</th>' for x in hdr)
    r = ''.join(f'<tr class="{c}">' + ''.join(f'<td>{x}</td>' for x in cells) + '</tr>' for cells, c in rows)
    return f'<table class="{cls}"><tr>{h}</tr>{r}</table>'

S = []
# 01 COVER
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Edificio para poner en valor · en venta</div>
<h1>Edificio<br>Sajonia</h1>
<div class="addr">Ygatimí c/ Alférez Silva · Zona Palacio de Justicia, Asunción</div>
<div class="cvk"><div><div class="v">USD 220.000</div><div class="l">Precio de venta</div></div>
<div><div class="v">803 m²</div><div class="l">Construidos sobre 268 m² de terreno</div></div></div>
<div class="cf">Construido en 1980 · Hoy desocupado, sin renta · Rentabilidad estimada tras la puesta en valor · TC Gs 5.694 (BCP, 09/10/2026)</div></div>
<div class="cr"><img src="img/fachada.jpg" style="object-position:42% 50%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de oficinas de tres niveles para reconvertir en renta')}
<p class="lead">Edificio construido en 1980 como sede de oficinas, a pasos del Parque Carlos Antonio López y en la zona del Palacio de Justicia. Hoy está desocupado y no genera renta: su valor está en la puesta en valor, ya sea como oficinas y locales o, como alternativa principal, en departamentos para alquiler.</p>
{kgrid([('USD 220.000', 'Precio de venta'), ('803 m²', 'Superficie construida · 3 niveles'), ('268 m²', 'Terreno de 8 × 33 m'), ('USD 274', 'Por m² construido, terreno incluido'),
        ('94%', 'Del valor de mercado del ACM (USD 234.325)'), (usd(cxB['total']), 'Puesta en valor estimada (departamentos)'), (pct(eB['bruta']), 'Bruta estimada sobre inversión total'), (pct(eB['neta']), 'Neta final estimada (departamentos)')])}
<div class="box">Sin renta actual: toda rentabilidad presentada es una estimación posterior a la obra · Costos de obra según la tabla de Meridiano Capital, a confirmar con presupuesto · Tipo de cambio {TCTXT}</div>''', 2))

# 03 UBICACION
loc = [('Dirección', 'Ygatimí 1351 c/ Alférez Silva, Asunción'), ('Zona', 'Sajonia · Palacio de Justicia · barrio Dr. Francia'), ('Av. Colón', '300 m sobre la Av. Ygatimí, según la ficha del inmueble'),
       ('Entorno', 'Parque Carlos Antonio López, Poder Judicial y acceso al centro histórico y a la Costanera')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Ygatimí y Alférez Silva, zona Palacio de Justicia')}
<div class="two"><div class="mapimg"><img src="img/mapa3d.jpg"><div class="cap">Contexto urbano: centro histórico, Costanera y Parque Carlos Antonio López</div></div>
<div class="locr">{lh}<a class="glink" href="{MAPS}">Abrir en Google Maps</a>
<p class="note">Sin estacionamiento propio. El terreno presenta declive hacia el norte y el edificio está por encima del nivel de la calle.</p></div></div>''', 3))

# 04 ZONA
pts = [('Demanda profesional', 'Estudios jurídicos, escribanías y oficinas técnicas buscan estar cerca del Poder Judicial.'),
       ('Demanda de vivienda en alquiler', 'Monoambientes y departamentos de 1 dormitorio para profesionales, empleados y estudiantes del centro.'),
       ('Ubicación consolidada', 'Barrio tradicional con transporte, comercios y servicios, a minutos del centro y de las oficinas de gobierno.')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('La zona para el inversor', 'Sajonia: entre el Palacio de Justicia y el centro')}
<div class="two z"><div class="ztext"><p>Sajonia es uno de los barrios tradicionales de Asunción, junto al centro histórico y a la Costanera. En su borde se ubica el Palacio de Justicia, que concentra la actividad del Poder Judicial y atrae a diario a abogados, escribanos, peritos y público.</p>
<p>Esa actividad sostiene dos demandas: oficinas pequeñas y medianas para profesionales, y vivienda en alquiler de escala chica para quienes trabajan o estudian en la zona. Los alquileres publicados en el barrio (lámina 12) muestran ambas.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{ph}</div></div>
<div class="src">Contexto general del barrio. Referencias de alquiler: anuncios publicados en InfoCasas y Jariton, relevados el 15/10/2026 (ver lámina 12). Vacancia del barrio: sin dato publicado.</div>''', 4))

# 05 SUPERFICIES Y VALOR (ACM)
acm = M['acm']
rows = [(['Terreno', '268 m²', 'USD 275', usd(acm['terreno'])], ''), (['Edificación', '803 m²', 'USD 200', usd(acm['edif'])], ''),
        (['Valor de mercado sugerido', '', '', usd(acm['mercado'])], 'tot'), (['Precio competitivo', '', '', usd(acm['competitivo'])], ''), (['Precio de venta rápida', '', '', usd(acm['rapida'])], '')]
S.append(slide(f'''{head('Superficies y valor', '268 m² de terreno y 803 m² construidos')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:96px;height:302px"><span>268 m²</span></div><div class="dimr">33 m de fondo</div><div class="dimb">8 m de frente</div></div>
{kgrid([('803 m²', 'Construidos · 3 veces el terreno'), ('1980', 'Año de construcción · 46 años'), ('USD 274', 'Por m² construido, terreno incluido'), (pct(P / M['nuevo'], 0), f'Del costo de construir hoy 803 m² ({usd(M["nuevo"])}, USD 650/m²)')], 'kgrid k2')}</div></div>
<div><div class="ct" style="text-align:left;margin-bottom:8px"><b>Análisis comparativo de mercado (ACM), marzo 2025</b></div>{table(['Componente', 'Superficie', 'USD/m²', 'Valor'], rows)}
<p class="bs dk">El precio de USD 220.000 se ubica entre el precio competitivo y el valor de mercado sugerido por el ACM: el 94% del valor de mercado.</p></div></div>
<div class="src">ACM elaborado por RE/MAX Proactiva (marzo 2025): terreno a USD 275/m² (promedio de Sajonia) y edificación a USD 200/m². Costo de construcción nueva: tabla de Meridiano Capital. Valores de referencia, no tasación.</div>''', 5))

# 06 EL EDIFICIO HOY
lv = [(['Nivel 1', 'Recepción y sala de cursos'], ''), (['Nivel 2', 'Hall, estar, oficinas con baño, sala de reuniones y salón para oficinas, con aire acondicionado central; baño, depósito y parrilla'], ''),
      (['Nivel 3', 'Salón para oficinas con aire acondicionado central, baño, terraza con galería cubierta, depósito y cocina'], '')]
ft = [('Estructura', 'Ladrillo cerámico con revoque; losas de hormigón armado; techo de losa y tejas.'), ('Instalaciones', 'Eléctrica trifásica embutida; ESSAP; desagüe pluvial.'),
      ('Terminaciones', 'Pisos de granito y cerámica; aberturas de metal con vidrio templado; fachada con revestimiento RevoColor.'), ('Estado', 'Desocupado; requiere puesta en valor integral.')]
S.append(slide(f'''{head('El edificio hoy', 'Tres niveles de oficinas, hoy desocupados')}
<div class="two d10">{table(['Nivel', 'Distribución original'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Distribución y materiales según la ficha del inmueble; a verificar en la inspección técnica. Sin estacionamiento propio.</p>''', 6))

# 07 FOTOS FACHADA
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada y lote')}
<div class="ph"><figure style="width:560px"><img src="img/fachada.jpg" style="height:412px"><figcaption>Fachada sobre Ygatimí, estado actual</figcaption></figure>
<figure style="width:450px"><img src="img/mapa.jpg" style="height:412px;object-position:20% 60%"><figcaption>Lote de 8 × 33 m frente al Parque Carlos Antonio López</figcaption></figure></div>''', 7, dark=True))

# 08 RENDER
S.append(slide(f'''{head('Potencial del espacio', 'Referencia de cómo podría verse tras la obra')}
<div class="ph"><figure style="width:760px"><img src="img/render.jpg" style="height:412px"><figcaption>Imágenes generadas con inteligencia artificial a modo ilustrativo; no son fotografías del estado actual</figcaption></figure>
<figure style="width:250px"><img src="img/fachada2.jpg" style="height:412px;object-position:45% 50%"><figcaption>Fachada, vista lateral</figcaption></figure></div>''', 8, dark=True))

# 09 DOS ALTERNATIVAS
altA_rows = [(['Uso', 'Oficinas y locales comerciales'], ''), (['Programa', f'Plantas libres por nivel; {round(M["A_m2"])} m² alquilables (80% de lo construido)'], ''),
             (['Obra', 'Remodelación sobre lo existente: fachada, instalaciones, sanitarios, climatización y terminaciones'], ''), (['Costo de referencia', 'USD 350/m² (remodelación, calidad básica)'], 'b')]
altB_rows = [(['Uso', 'Departamentos para alquiler y un local en planta baja'], ''), (['Programa', '5 dptos. de 1 dormitorio, 5 monoambientes y 1 local comercial'], ''),
             (['Obra', 'Cambio de uso: cocinas y baños por unidad, instalaciones individuales, patio de luz y terminaciones'], ''), (['Costo de referencia', 'USD 450/m² (remodelación, calidad estándar)'], 'b')]
S.append(slide(f'''{head('Alternativas de puesta en valor', 'Dos caminos para volver a generar renta')}
<div class="two alt"><div><div class="altt">A · Oficinas y locales</div>{table(['', ''], altA_rows, 't nohead')}</div>
<div><div class="altt gold">B · Departamentos para alquiler <span>alternativa principal</span></div>{table(['', ''], altB_rows, 't nohead')}</div></div>
<p class="note2"><b>Por qué B es la principal.</b> La demanda de alquiler residencial en la zona es amplia y estable, con menos vacancia que las oficinas y una tasa de IVA menor (5% frente a 10%). El programa de B es preliminar: la cantidad de unidades y el patio de luz deben validarse con un arquitecto y con la normativa municipal.</p>''', 9))

# 10 CAPEX
def cxrows(cx, label):
    return [([f'Obra: 803 m² × USD {cx["rate"]}', usd(cx['obra'])], ''), (['Aprobaciones e imprevistos (10%)', usd(cx['imprev'])], ''), ([f'Puesta en valor · {label}', usd(cx['total'])], 'b'),
            (['Precio de compra', usd(P)], ''), (['Inversión total', usd(P + cx['total'])], 'tot')]
S.append(slide(f'''{head('Costo de puesta en valor', 'La obra pesa más que el precio de compra')}
<div class="two cx"><div><div class="altt">A · Oficinas y locales</div>{table(['Concepto', 'USD'], cxrows(cxA, 'oficinas'), 't big')}</div>
<div><div class="altt gold">B · Departamentos</div>{table(['Concepto', 'USD'], cxrows(cxB, 'departamentos'), 't big')}</div>
{crit('Criterios', [('Costos por m²', 'Tabla de costos de construcción de Meridiano Capital, fila "remodelación sobre obra existente".'), ('Imprevistos', 'Supuesto de 10%: edificio de 46 años, con instalaciones a revisar.'), ('Plazo', 'Supuesto de 12 meses entre proyecto, permisos y obra, sin renta.'), ('Excluye', 'Gastos de adquisición, mobiliario y comisión de alquiler.')])}</div>''', 10))

# 11 INGRESOS ESTIMADOS
ra = [([a, b, gs(c), usd(c / TC)], '') for a, b, c in A['alt']['lines']] + [(['Total', '', gs(A['alt']['mes']), usd(A['alt']['mes'] / TC)], 'tot')]
rb = [([a, b, gs(c), usd(c / TC)], '') for a, b, c in Bm['alt']['lines']] + [(['Total', '11 unidades', gs(Bm['alt']['mes']), usd(Bm['alt']['mes'] / TC)], 'tot')]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual tras la puesta en valor')}
<div class="two cx2"><div><div class="altt">A · Oficinas y locales · Gs 30.000 por m²</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], ra)}
<div class="altt gold" style="margin-top:22px">B · Departamentos y local</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], rb)}</div>
{crit('Supuestos de alquiler', [('Oficinas', 'Gs 30.000 por m² al mes: las plantas grandes se publican por debajo de las oficinas chicas.'), ('1 dormitorio', 'Gs 2.200.000 por unidad, sin cochera.'), ('Monoambiente', 'Gs 1.800.000 por unidad, en línea con los anuncios del barrio.'), ('Local en PB', 'Gs 2.700.000, unos Gs 45.000 por m² en 60 m².'), ('Estado', 'Estimaciones a validar con un relevamiento de mercado (AMC).')])}</div>''', 11))

# 12 REFERENCIAS DE MERCADO
res = [('Monoambiente, 25 m², zona Poder Judicial', 'Gs 950.000', 'Incluye expensas e IVA'), ('Monoambiente amoblado, con A/A', 'Gs 1.800.000', ''), ('Monoambiente, zona Palacio de Justicia', 'Gs 1.800.000', ''),
       ('Monoambiente, 42 m², con cochera', 'Gs 2.500.000', ''), ('1 dormitorio, 50 m²', 'Gs 1.700.000', 'Jariton'), ('1 dormitorio, con A/A y estacionamiento', 'Gs 2.500.000', ''), ('1 dormitorio, con cochera', 'Gs 3.000.000', '')]
ofi = [('Oficina, 30 m²', 'Gs 2.000.000', '≈ Gs 67.000/m²'), ('Oficina, 35 m²', 'Gs 1.400.000 + GC', '≈ Gs 40.000/m²'), ('Oficina, 160 m²', 'Gs 7.416.000', '≈ Gs 46.000/m²'),
       ('Oficina, 314 m²', 'Gs 6.300.000', '≈ Gs 20.000/m²'), ('Salón comercial, 40 m²', 'Gs 2.200.000', '≈ Gs 55.000/m²'), ('Local, 750 m²', 'Gs 25.000.000 + IVA', '≈ Gs 33.000/m²')]
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres publicados en Sajonia')}
<div class="two cmp2">{table(['Vivienda', 'Precio por mes', 'Nota'], [([a, b, c], '') for a, b, c in res], 't sm')}{table(['Oficinas y locales', 'Precio por mes', 'Por m²'], [([a, b, c], '') for a, b, c in ofi], 't sm')}</div>
<p class="note2"><b>Lectura.</b> Los monoambientes se publican mayormente entre Gs 1,8 y 2,5 millones y los de 1 dormitorio entre Gs 1,7 y 3,0 millones; las oficinas, entre Gs 20.000 y 67.000 por m², con las plantas grandes en la parte baja del rango. Los supuestos de la lámina 11 se ubican en la zona media-baja de cada rango.</p>
<div class="src">Anuncios de InfoCasas y Jariton relevados el 15/10/2026 mediante buscador; precios publicados, no contratos cerrados, y disponibilidad no confirmada. Confianza: baja a media.</div>''', 12))

# 13 INGRESOS Y EGRESOS
def er(e, alt):
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), ([f'IVA ({pct(alt["iva"],1)} ponderado)', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            ([f'Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', '8,0%', '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos del edificio', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Resultado antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Resultado neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two cx3"><div><div class="altt">A · Oficinas y locales</div>{table(['Concepto', '% del bruto', 'USD por año'], er(eA, A['alt']), 't sm ie')}</div>
<div><div class="altt gold">B · Departamentos y local</div>{table(['Concepto', '% del bruto', 'USD por año'], er(eB, Bm['alt']), 't sm ie')}</div></div>
<p class="note2 sm">IVA: 10% en oficinas y locales; 5% en vivienda (ponderado en B). Vacancia: 10% en oficinas, 8% en locales y 4% en departamentos (valores de referencia de Meridiano Capital). Gastos fijos: supuesto de Gs 9.000.000 por año. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', 13))

# 14 RENTABILIDAD (dark)
S.append(slide(f'''{head('Rentabilidad estimada', 'Indicadores sobre la inversión total')}<div class="rule"></div>
<div class="rg3"><div></div><div class="bl2 c">A · Oficinas y locales</div><div class="bl2 c gold">B · Departamentos</div>
<div class="rl">Rentabilidad bruta</div><div class="bigv m">{pct(eA['bruta'])}</div><div class="bigv m">{pct(eB['bruta'])}</div>
<div class="rl">Neta antes de IRE</div><div class="midv">{pct(eA['neta_pre'])}</div><div class="midv">{pct(eB['neta_pre'])}</div>
<div class="rl">Neta final</div><div class="midv">{pct(eA['neta'])}</div><div class="midv">{pct(eB['neta'])}</div>
<div class="rl">Inversión total</div><div class="midv s2">{usd(eA['inv'])}</div><div class="midv s2">{usd(eB['inv'])}</div></div>
<div class="bs how"><b>Cómo leer estas cifras.</b> El denominador es el precio más la puesta en valor, sin gastos de adquisición. Son estimaciones posteriores a la obra, con alquileres supuestos a partir de anuncios publicados: no hay renta actual que las respalde. Cifras de referencia, no garantizadas.</div>''', 14, dark=True))

# 15 SENSIBILIDAD
def sens(key, rates, ks, klabel):
    hdr = ['Costo de obra'] + klabel
    rows = []
    for r in rates:
        rows.append(([f'USD {r}/m²'] + [pct(M[key][f'{r}|{k}']['bruta']) + ' · ' + pct(M[key][f'{r}|{k}']['neta']) for k in ks], 'b' if r == (450 if key == 'sensB' else 350) else ''))
    return table(hdr, rows, 't big')
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: costo de obra y alquiler')}
<div class="two cx2"><div><div class="altt gold">B · Departamentos · bruta · neta final</div>{sens('sensB', [250, 350, 450], ['0.85', '1.0', '1.15'], ['Alquiler −15%', 'Alquiler base', 'Alquiler +15%'])}
<div class="altt" style="margin-top:22px">A · Oficinas y locales · bruta · neta final</div>{sens('sensA', [200, 350, 450], ['22000', '30000', '40000'], ['Gs 22.000/m²', 'Gs 30.000/m²', 'Gs 40.000/m²'])}</div>
{crit('Lectura', [('La obra es la palanca', 'Con un costo de USD 250/m², la alternativa B supera el 10% bruto; con USD 450/m², queda en 7,75%.'), ('Presupuesto real', 'Antes de ofertar, conviene un presupuesto de obra con un arquitecto o constructor sobre el edificio real.'), ('Precio para 10% bruto', f'Con la obra estándar, un 10% bruto exigiría comprar a {usd(eB["max_price10"])}: la mejora debe venir de la obra, no solo del precio.')])}</div>''', 15))

# 16 PROYECCION / PLUSVALIA
pr = M['proj']
def rowp(lbl, f, cls=''): return ([lbl] + [f(pr[k]) for k in ['Conservador', 'Base', 'Optimista']], cls)
prow = [rowp('Alquileres, ajuste anual', lambda p: '+' + n(p['gr'] * 100, 1) + '%'), rowp('Valorización anual supuesta', lambda p: n(p['val'] * 100, 1) + '%'),
        rowp('Valor estimado al año 5', lambda p: usd(p['V'])), rowp('Plusvalía sobre inversión total', lambda p: usd(p['plus'])), rowp('IVA de la venta futura (1,5%)', lambda p: '– ' + usd(p['ivav'])),
        rowp('Renta neta acumulada (años 2 a 5)', lambda p: usd(p['acum'])), rowp('Ganancia total estimada', lambda p: usd(p['total']), 'b'), rowp('TIR estimada a 5 años', lambda p: pct(p['tir'], 1), 'tot')]
S.append(slide(f'''{head('Plusvalía y retorno total', 'Alternativa B: escenarios a cinco años')}
<div class="two d15">{table(['Concepto', 'Conservador', 'Base', 'Optimista'], prow, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr['Base']['tir'],1)}</div><div class="bs">TIR estimada, escenario base</div><p>Compra a USD 220.000, un año de obra sin renta ({usd(cxB['total'])}), cuatro años de renta neta y venta al valor estimado del año 5.</p><p class="gold">Supuesto clave: el valor del edificio terminado parte de la inversión total y se valoriza desde el fin de la obra.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición ni comisión de venta. El valor futuro depende del mercado, de la calidad de la obra y de la ocupación al vender.</div>''', 16))

# 17 PRECIO Y CONDICIONES
info = [('Activo', 'Edificio de oficinas de 3 niveles, 803 m² construidos en 1980 sobre 268 m² de terreno (8 × 33 m). Sin estacionamiento propio.'),
        ('Ocupación', 'Desocupado; no genera renta. Entrega inmediata, a confirmar.'),
        ('Valor de referencia', 'ACM de marzo 2025: valor de mercado sugerido USD 234.325; precio competitivo USD 210.893.'),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">USD 220.000</div><div class="bs">Precio de venta · {gs(P * TC)}</div><p>Edificio construido en 1980</p><p>Precio en dólares estadounidenses. Alquileres futuros estimados en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Inversión total estimada (B): {usd(eB['inv'])} · bruta {pct(eB['bruta'])} · neta final {pct(eB['neta'])}</div></div>
<div class="info">{ih}</div></div>''', 17))

# 18 PROCESO
steps = [('Visita e inspección', 'Recorrido del edificio con inspección técnica de estructura, losas, instalaciones e impermeabilización.'), ('Proyecto y presupuesto', 'Anteproyecto de la alternativa elegida, presupuesto de obra y consulta de normativa municipal.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la puesta en valor con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de las unidades, contratos y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', 18))

# 19 CONSIDERACIONES
rk = [('Costo de obra', 'Es la variable principal: estimado con la tabla de Meridiano; sin presupuesto sobre el edificio real, la rentabilidad puede variar varios puntos.'),
      ('Sin renta actual', 'Doce meses o más sin ingresos entre compra, permisos y obra, más el tiempo de alquilar las unidades.'),
      ('Normativa y cambio de uso', 'El programa de departamentos y el patio de luz requieren aprobación municipal y validación de un arquitecto.'),
      ('Sin estacionamiento', 'Limita el alquiler en algunos segmentos y puede reducir el canon frente a ofertas con cochera.'),
      ('Estado del edificio', 'Construcción de 1980: la inspección técnica define el alcance real en estructura, instalaciones e impermeabilización.'),
      ('Tipo de cambio e impuestos', 'Precio en dólares y alquileres en guaraníes; el IRE depende de la estructura de compra y lo determina el contador.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar en un edificio para poner en valor')}<div class="rks">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', 19))

# 20 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita al edificio</h2>
<p class="cp">Recorremos el edificio con una inspección técnica, preparamos el anteproyecto y el presupuesto de la alternativa que elija, y lo acompañamos en cada paso de la compra y de la obra.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">+595 981 257 217 &nbsp;·&nbsp; juancastillo@meridianocapital.net &nbsp;·&nbsp; www.meridianocapital.net</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio para poner en valor</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
