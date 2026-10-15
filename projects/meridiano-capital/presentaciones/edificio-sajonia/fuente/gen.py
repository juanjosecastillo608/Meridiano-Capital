import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; PR = M['PRICES']
A, Bm = M['A'], M['B']
cxA, cxB = M['cxA'], M['cxB']
eA, eB = A['ev'], Bm['ev']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))
def rate(x): return 'USD ' + (n(x, 1) if x % 1 else n(x))

PROJ = 'Edificio Sajonia'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = 'Gs 5.694 por USD (BCP, 09/10/2026)'
MAPS = 'https://maps.app.goo.gl/9VVqh4HZrwiZkHqo9'

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

N = [0]
def num():
    N[0] += 1
    return N[0]
S = []
num()
# 01 COVER
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Edificio para poner en valor · en venta</div>
<h1>Edificio<br>Sajonia</h1>
<div class="addr">Av. Ygatimí 1351 · Zona Palacio de Justicia, Asunción</div>
<div class="cvk"><div><div class="v">USD 220.000</div><div class="l">Precio de venta · venta rápida USD 185.000</div></div>
<div><div class="v">803 m²</div><div class="l">Construidos sobre 268 m² de terreno</div></div></div>
<div class="cf">Construido en 1980 · Hoy desocupado, sin renta · Rentabilidad estimada tras la puesta en valor · TC Gs 5.694 (BCP, 09/10/2026)</div></div>
<div class="cr"><img src="img/fachada_lat.jpg" style="object-position:52% 50%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de oficinas de tres niveles para reconvertir en renta')}
<p class="lead">Edificio construido en 1980 como sede de oficinas, a pasos del Parque Carlos Antonio López y en la zona del Palacio de Justicia. Hoy está desocupado y no genera renta: su valor está en la puesta en valor, como oficinas y locales o, como alternativa principal, en departamentos para alquiler. El análisis se presenta a dos precios: el de venta y el de venta rápida.</p>
{kgrid([('USD 220.000', 'Precio de venta'), ('USD 185.000', 'Precio de venta rápida (−15,9%)'), ('803 m²', 'Construidos · 3 niveles'), ('268 m²', 'Terreno de 8 × 33,44 m'),
        (usd(cxB['total']), 'Puesta en valor estimada (departamentos)'), (pct(eB['pedido']['bruta']) , 'Bruta sobre inversión total · a USD 220.000'), (pct(eB['rapida']['bruta']), 'Bruta sobre inversión total · a USD 185.000'), (pct(eB['pedido']['neta']) + ' · ' + pct(eB['rapida']['neta']), 'Neta final (departamentos) · a cada precio')])}
<div class="box">Sin renta actual: toda rentabilidad es una estimación posterior a la obra · Obra según la tabla de Meridiano Capital con un 25% de descuento por el estado actual del edificio, a confirmar con presupuesto · Tipo de cambio {TCTXT}</div>''', num()))

# 03 UBICACION
loc = [('Dirección', 'Av. Ygatimí 1351 c/ Alférez Silva, Asunción'), ('Zona', 'Sajonia · Palacio de Justicia · barrio Dr. Francia (según el folleto)'), ('Av. Colón', '300 m sobre la Av. Ygatimí, según la ficha del inmueble'),
       ('Entorno', 'Parque Carlos Antonio López, Poder Judicial y acceso al centro histórico y a la Costanera')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Av. Ygatimí, frente al Parque Carlos Antonio López')}
<div class="two"><div class="mapimg"><img src="img/mapa.jpg" style="object-position:30% 50%"><div class="cap">Lote de 8 × 33 m y entorno inmediato</div></div>
<div class="locr">{lh}<a class="glink" href="{MAPS}">Abrir en Google Maps</a>
<p class="note">Sin estacionamiento propio. El terreno presenta declive hacia el norte y el edificio está por encima del nivel de la calle. Identificación catastral a confirmar.</p></div></div>''', num()))

# 04 ZONA
pts = [('Demanda profesional', 'Estudios jurídicos, escribanías y oficinas técnicas usan la cercanía al Poder Judicial como argumento comercial.'),
       ('Vivienda en alquiler', 'Se publican monoambientes y departamentos de 1 y 2 dormitorios entre Gs 1,4 y 5,5 millones (lámina 13).'),
       ('Ubicación consolidada', 'Barrio tradicional con transporte, comercios y servicios, a minutos del centro y de las oficinas de gobierno.')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('La zona para el inversor', 'Sajonia: entre el Palacio de Justicia y el centro')}
<div class="two z"><div class="ztext"><p>Sajonia es uno de los barrios tradicionales de Asunción, junto al centro histórico y a la Costanera. En su borde se ubica el Palacio de Justicia, que concentra la actividad del Poder Judicial y atrae a diario a abogados, escribanos, peritos y público.</p>
<p>Esa actividad sostiene dos demandas: oficinas para profesionales y vivienda en alquiler de escala chica para quienes trabajan o estudian en la zona. Los anuncios del estudio de mercado muestran oferta activa en ambos segmentos.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{ph}</div></div>
<div class="src">Estudio de mercado de Meridiano Capital, corte al 15/10/2026: 12 anuncios de alquiler y 8 de venta con precio, en InfoCasas, Jariton, Amambay Propiedades, TuCasaPY y UbicaProp. Precios pedidos; disponibilidad no confirmada. Vacancia del barrio: sin dato publicado.</div>''', num()))

# 05 SUPERFICIES Y VALOR
acm = M['acm']
rows = [(['Terreno', '268 m² × USD 275', usd(acm['terreno'])], ''), (['Edificación', '803 m² × USD 200', usd(acm['edif'])], ''),
        (['Valor de mercado sugerido (ACM)', '', usd(acm['mercado'])], 'b'), (['Precio de venta', '−6,1% frente al ACM', 'USD 220.000'], 'tot'),
        (['Venta rápida (ACM)', '', usd(acm['rapida'])], ''), (['Precio de venta rápida', '−1,3% frente al ACM', 'USD 185.000'], 'tot')]
S.append(slide(f'''{head('Superficies y valor', '268 m² de terreno y 803 m² construidos')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:96px;height:302px"><span>268 m²</span></div><div class="dimr">33,44 m<br>de fondo</div><div class="dimb">8 m de frente</div></div>
{kgrid([('803 m²', 'Construidos · 3 veces el terreno'), ('1980', 'Año de construcción · 46 años'), ('USD 274 · 230', 'Por m² construido, a cada precio'), (pct(PR['pedido'] / M['nuevo'], 0), f'Del costo de construir hoy 803 m² ({usd(M["nuevo"])}, USD 650/m²)')], 'kgrid k2')}</div></div>
<div><div class="ct" style="text-align:left;margin-bottom:8px"><b>Precios frente al ACM histórico (marzo 2025)</b></div>{table(['Concepto', 'Base', 'USD'], rows)}
<p class="bs dk">Edificios completos publicados en Sajonia: uno mixto de 548 m² a Gs 1.800 millones (Amambay Propiedades) y uno de oficinas amoblado de 458 m² a USD 230.000, unos USD 502/m² (TuCasaPY).</p></div></div>
<div class="src">El ACM de RE/MAX Proactiva es una opinión histórica de marzo 2025, no una tasación actual; sus 803 m² no están verificados con planos. Costo de construcción nueva: tabla de Meridiano Capital.</div>''', num()))

# 06 EL EDIFICIO HOY
lv = [(['Nivel 1', 'Recepción y sala de cursos'], ''), (['Nivel 2', 'Hall, estar, oficinas con baño, sala de reuniones y salón para oficinas, con aire acondicionado central; baño, depósito y parrilla'], ''),
      (['Nivel 3', 'Salón para oficinas con aire acondicionado central, baño, terraza con galería cubierta, depósito y cocina'], '')]
ft = [('Estructura', 'Ladrillo cerámico con revoque; losas de hormigón armado; techo de losa y tejas.'), ('Instalaciones', 'Eléctrica trifásica embutida; ESSAP; desagüe pluvial.'),
      ('Terminaciones', 'Pisos de granito y cerámica; aberturas de metal con vidrio templado; fachada con revestimiento RevoColor.'), ('Estado', 'Desocupado; requiere puesta en valor.')]
S.append(slide(f'''{head('El edificio hoy', 'Tres niveles de oficinas, hoy desocupados')}
<div class="two d10">{table(['Nivel', 'Distribución original'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Distribución y materiales según la ficha del inmueble; a verificar en la inspección técnica con planos y mensura. Sin estacionamiento propio.</p>''', num()))

# 07 FOTOS FACHADA
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada sobre la Av. Ygatimí')}
<div class="ph"><figure style="width:560px"><img src="img/fachada.jpg" style="height:412px"><figcaption>Fachada, vista frontal</figcaption></figure>
<figure style="width:450px"><img src="img/fachada_lat.jpg" style="height:412px;object-position:55% 50%"><figcaption>Fachada y vereda, vista lateral</figcaption></figure></div>''', num(), dark=True))

# 08 FOTOS INTERIOR
S.append(slide(f'''{head('Recorrido fotográfico', 'Interiores del edificio')}
<div class="ph"><figure style="width:660px"><img src="img/interior.jpg" style="height:412px"><figcaption>Escalera y plantas de oficinas · imágenes con retoque digital, a verificar en la visita</figcaption></figure>
<figure style="width:350px"><img src="img/archivo.jpg" style="height:412px;object-position:40% 60%"><figcaption>Sala de reuniones · fotografía de archivo</figcaption></figure></div>''', num(), dark=True))

# 09 RENDER
S.append(slide(f'''{head('Potencial del espacio', 'Referencia de cómo podría verse tras la obra')}
<div class="ph"><figure style="width:1020px"><img src="img/render.jpg" style="height:412px"><figcaption>Imágenes generadas con inteligencia artificial a modo ilustrativo; no son fotografías del estado actual</figcaption></figure></div>''', num(), dark=True))

# 10 ALTERNATIVAS
mixtxt = ' · '.join(f'{q} × {t.lower()}' for t, q, _, _, _ in M['MIX'])
altA_rows = [(['Uso', 'Oficinas y locales comerciales'], ''), (['Programa', f'Plantas libres por nivel; {round(M["A_m2"])} m² alquilables (80% de lo construido)'], ''),
             (['Obra', 'Puesta en valor sobre lo existente: fachada, instalaciones, sanitarios, climatización y terminaciones'], ''), (['Costo de obra', f'{rate(cxA["rate"])}/m² (tabla básica USD 350 − 25%)'], 'b')]
altB_rows = [(['Uso', 'Departamentos para alquiler y un local en planta baja'], ''), (['Programa', '2 dptos. de 2 dormitorios, 3 de 1 dormitorio, 5 monoambientes y 1 local'], ''),
             (['Obra', 'Cambio de uso: cocinas y baños por unidad, instalaciones individuales, patio de luz y terminaciones'], ''), (['Costo de obra', f'{rate(cxB["rate"])}/m² (tabla estándar USD 450 − 25%)'], 'b')]
S.append(slide(f'''{head('Alternativas de puesta en valor', 'Dos caminos para volver a generar renta')}
<div class="two alt"><div><div class="altt">A · Oficinas y locales</div>{table(['', ''], altA_rows, 't nohead')}</div>
<div><div class="altt gold">B · Departamentos para alquiler <span>alternativa principal</span></div>{table(['', ''], altB_rows, 't nohead')}</div></div>
<p class="note2"><b>Por qué B es la principal.</b> Diversifica el ingreso en 10 unidades, con menos vacancia que las oficinas y una tasa de IVA menor (5% frente a 10%). A rinde más en el papel, pero depende de alquilar 642 m² de oficinas sin cocheras con solo cuatro anuncios de referencia. El programa de B es preliminar: unidades, patio de luz y cambio de uso deben validarse con un arquitecto y con la Municipalidad.</p>''', num()))

# 11 CAPEX
def cxrows(cx, label):
    return [([f'Obra: 803 m² × {rate(cx["rate"])}', usd(cx['obra'])], ''), (['Aprobaciones e imprevistos (10%)', usd(cx['imprev'])], ''), ([f'Puesta en valor', usd(cx['total'])], 'b'),
            (['+ Precio de venta (USD 220.000)', usd(cx['total'] + PR['pedido'])], 'tot'), (['+ Venta rápida (USD 185.000)', usd(cx['total'] + PR['rapida'])], 'tot')]
S.append(slide(f'''{head('Costo de puesta en valor', 'Inversión total a cada precio de compra')}
<div class="two cx"><div><div class="altt">A · Oficinas y locales</div>{table(['Concepto', 'USD'], cxrows(cxA, 'oficinas'), 't big')}</div>
<div><div class="altt gold">B · Departamentos</div>{table(['Concepto', 'USD'], cxrows(cxB, 'departamentos'), 't big')}</div>
{crit('Criterios', [('Costos por m²', 'Tabla de Meridiano Capital, "remodelación sobre obra existente", con un 25% de descuento por el estado actual del edificio.'), ('Imprevistos', 'Supuesto de 10%: edificio de 46 años, con instalaciones a revisar.'), ('Plazo', 'Supuesto de 12 meses entre proyecto, permisos y obra, sin renta.'), ('Excluye', 'Gastos de adquisición, mobiliario y comisión de alquiler.')])}</div>''', num()))

# 12 INGRESOS ESTIMADOS
ra = [([a, b, gs(c), usd(c / TC)], '') for a, b, c in A['alt']['lines']] + [(['Total', '', gs(A['alt']['mes']), usd(A['alt']['mes'] / TC)], 'tot')]
rb = [([a, b, gs(c), usd(c / TC)], '') for a, b, c in Bm['alt']['lines']] + [(['Total', '11 unidades', gs(Bm['alt']['mes']), usd(Bm['alt']['mes'] / TC)], 'tot')]
sup = [('Oficinas', 'Gs 45.000/m²: O3, oficina de 160 m² sin muebles en Sajonia (Gs 46.350/m²).')] + [(t.replace('Departamento ', ''), f'{gs(c)} · {r}') for t, _, _, c, r in M['MIX']]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual tras la puesta en valor')}
<div class="two cx2 cmp"><div><div class="altt">A · Oficinas y locales</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], ra, 't sm')}
<div class="altt gold" style="margin-top:18px">B · Departamentos y local</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], rb, 't sm')}</div>
{crit('Base de mercado (estudio 15/10/2026)', sup)}</div>
<p class="note2 sm">Las unidades del edificio no tendrán cochera; todos los comparables de vivienda, salvo D1, la incluyen. Por eso los monoambientes se ubican por debajo de su banda y los 2 dormitorios en el piso de la suya.</p>''', num()))

# 13 REFERENCIAS DE MERCADO
rc = [('O1', 'Oficina', 'Av. C. A. López, zona Palacio', '32 m² · 1', 'Gs 2.700.000', '84.375'), ('O3', 'Oficina sin muebles', 'Sajonia', '160 m² · 1', 'Gs 7.416.000', '46.350'),
      ('O4', 'Oficina premium amoblada', 'Sajonia', '220 m² · 2', 'Gs 15.650.000', '71.136'), ('M1', 'Monoambiente', 'Juan de Garay', '42 m² · 1', 'Gs 2.500.000', '59.524'),
      ('M2', 'Monoambiente a estrenar', 'Zona Palacio', '30 m² · 1', 'Gs 3.000.000', '100.000'), ('D1', '1 dormitorio básico', 'Zona Parque C. A. López', '50 m² · 0', 'Gs 1.400.000', '28.000'),
      ('D2', '1 dormitorio', 'Edif. Alemania, zona Palacio', '47 m² · 1', 'Gs 3.000.000', '63.830'), ('T1', '2 dormitorios', 'Cnel. Panchito López', '70 m² · 1', 'Gs 3.000.000', '42.857'),
      ('T2', '2 dormitorios, cocina equipada', 'Mayor J. de J. Martínez', '83 m² · 1', 'Gs 4.500.000', '54.217'), ('T3', '2 dormitorios amoblado', 'Sajonia', '62 m² · 1', 'Gs 5.500.000', '88.710')]
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres publicados en Sajonia')}
{table(['ID', 'Tipología', 'Ubicación anunciada', 'm² · cocheras', 'Precio por mes', 'Gs/m²'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Bandas observadas.</b> Monoambientes Gs 2,5–3,0 M (ambos con cochera) · 1 dormitorio Gs 1,4–3,0 M · 2 dormitorios estándar Gs 3,0–4,5 M · oficinas Gs 46.000–84.000/m² según tamaño y equipamiento.</p>
<div class="src">Estudio de mercado de Meridiano Capital, consulta del 15/10/2026 en InfoCasas y Jariton. Precios pedidos, no contratos cerrados; disponibilidad no confirmada; O1 es un anuncio de 2023. Excluidos de la estadística: O2 (superficie inconsistente) y T4 (área de terraza ambigua).</div>''', num()))

# 14 INGRESOS Y EGRESOS
def er(e, alt):
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), ([f'IVA', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', '8,0%', '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos del edificio', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Resultado antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Resultado neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two cx3"><div><div class="altt">A · Oficinas y locales</div>{table(['Concepto', '% del bruto', 'USD por año'], er(eA['pedido'], A['alt']), 't sm ie')}</div>
<div><div class="altt gold">B · Departamentos y local</div>{table(['Concepto', '% del bruto', 'USD por año'], er(eB['pedido'], Bm['alt']), 't sm ie')}</div></div>
<p class="note2 sm">El resultado operativo no depende del precio de compra. IVA: 10% en oficinas y locales; 5% en vivienda (ponderado en B). Vacancia de referencia de Meridiano: 10% oficinas, 8% locales, 4% departamentos. Gastos fijos: supuesto de Gs 9.000.000 por año. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', num()))

# 15 RENTABILIDAD
def c(a, p, k, d=2): return pct(M[a]['ev'][p][k], d)
S.append(slide(f'''{head('Rentabilidad estimada', 'Indicadores sobre la inversión total, a cada precio')}<div class="rule"></div>
<div class="rg4"><div></div><div class="bl2 c">A · a USD 220.000</div><div class="bl2 c">A · a USD 185.000</div><div class="bl2 c gold">B · a USD 220.000</div><div class="bl2 c gold">B · a USD 185.000</div>
<div class="rl">Bruta sobre inversión total</div><div class="bigv m4">{c('A','pedido','bruta')}</div><div class="bigv m4">{c('A','rapida','bruta')}</div><div class="bigv m4">{c('B','pedido','bruta')}</div><div class="bigv m4">{c('B','rapida','bruta')}</div>
<div class="rl">Neta antes de IRE</div><div class="midv">{c('A','pedido','neta_pre')}</div><div class="midv">{c('A','rapida','neta_pre')}</div><div class="midv">{c('B','pedido','neta_pre')}</div><div class="midv">{c('B','rapida','neta_pre')}</div>
<div class="rl">Neta final</div><div class="midv">{c('A','pedido','neta')}</div><div class="midv">{c('A','rapida','neta')}</div><div class="midv">{c('B','pedido','neta')}</div><div class="midv">{c('B','rapida','neta')}</div>
<div class="rl">Inversión total</div><div class="midv s2">{usd(eA['pedido']['inv'])}</div><div class="midv s2">{usd(eA['rapida']['inv'])}</div><div class="midv s2">{usd(eB['pedido']['inv'])}</div><div class="midv s2">{usd(eB['rapida']['inv'])}</div></div>
<div class="bs how"><b>Cómo leer estas cifras.</b> El denominador es el precio más la puesta en valor, sin gastos de adquisición. Son estimaciones posteriores a la obra, con alquileres tomados del estudio de mercado: no hay renta actual que las respalde. La venta rápida mejora la bruta en alrededor de un punto: la obra pesa más que el precio. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 16 SENSIBILIDAD
def sens(a, rates, p):
    rows = []
    for t, d in rates:
        lbl = f'{rate(t * (1 - d))}/m²' + (' (sin descuento)' if d == 0 else '')
        cells = [pct(M['sens'][f'{a}|{t}|{d}|{k}|{p}'][0]) + ' · ' + pct(M['sens'][f'{a}|{t}|{d}|{k}|{p}'][1]) for k in ('0.85', '1.0', '1.15')]
        rows.append(([lbl] + cells, 'b' if (t, d) == rates[0] else ''))
    return table(['Costo de obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], rows, 't sm')
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: costo de obra y alquiler')}
<div class="two cx2"><div><div class="altt gold">B · Departamentos · a USD 220.000 · bruta · neta final</div>{sens('B', [(450, 0.25), (350, 0.25), (450, 0)], 'pedido')}
<div class="altt" style="margin-top:14px">A · Oficinas · a USD 220.000</div>{sens('A', [(350, 0.25), (450, 0.25), (350, 0)], 'pedido')}</div>
{crit('Lectura', [('La obra es la palanca', 'Sin el descuento del 25%, la alternativa B baja a 9,3% bruto; con él, llega a 11,1%.'), ('El precio suma menos', f'A USD 185.000 y obra base, B pasa a {pct(eB["rapida"]["bruta"])} bruta y {pct(eB["rapida"]["neta"])} neta: entre 0,8 y 1,1 puntos más en cada alternativa.'), ('Precio para 10% bruto (B)', f'Con estos supuestos, la alternativa B alcanza el 10% bruto comprando hasta {usd(eB["pedido"]["max_price10"])}.'), ('Presupuesto real', 'Antes de ofertar: presupuesto de obra sobre el edificio real con arquitecto o constructor.')])}</div>''', num()))

# 17 PLUSVALIA
prp, prr = M['proj']['pedido'], M['proj']['rapida']
def rowp(lbl, f, cls=''): return ([lbl] + [f(prp[k]) for k in ['Conservador', 'Base', 'Optimista']], cls)
prow = [rowp('Alquileres, ajuste anual', lambda p: '+' + n(p['gr'] * 100, 1) + '%'), rowp('Valorización anual supuesta', lambda p: n(p['val'] * 100, 1) + '%'),
        rowp('Valor estimado al año 5', lambda p: usd(p['V'])), rowp('Plusvalía sobre inversión total', lambda p: usd(p['plus'])), rowp('IVA de la venta futura (1,5%)', lambda p: '– ' + usd(p['ivav'])),
        rowp('Renta neta acumulada (años 2 a 5)', lambda p: usd(p['acum'])), rowp('Ganancia total estimada', lambda p: usd(p['total']), 'b'), rowp('TIR a 5 años · compra a USD 220.000', lambda p: pct(p['tir'], 1), 'tot'),
        (['TIR a 5 años · compra a USD 185.000'] + [pct(prr[k]['tir'], 1) for k in ['Conservador', 'Base', 'Optimista']], 'tot')]
S.append(slide(f'''{head('Plusvalía y retorno total', 'Alternativa B: escenarios a cinco años')}
<div class="two d15">{table(['Concepto', 'Conservador', 'Base', 'Optimista'], prow, 't big pv')}
<div class="dbox"><div class="bigv bv2">{pct(prp['Base']['tir'],1)} · {pct(prr['Base']['tir'],1)}</div><div class="bs">TIR estimada, escenario base, a USD 220.000 y a USD 185.000</div><p>Compra, un año de obra sin renta ({usd(cxB['total'])}), cuatro años de renta neta y venta al valor estimado del año 5.</p><p class="gold">Supuesto clave: el valor del edificio terminado parte de la inversión total y se valoriza desde el fin de la obra. Oficinas (A), escenario base: {pct(M['projA']['pedido']['tir'],1)} · {pct(M['projA']['rapida']['tir'],1)}.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición ni comisión de venta. El valor futuro depende del mercado, de la calidad de la obra y de la ocupación al vender.</div>''', num()))

# 18 PRECIO Y CONDICIONES
info = [('Activo', 'Edificio de oficinas de 3 niveles, 803 m² construidos en 1980 sobre 268 m² de terreno. Sin estacionamiento propio.'),
        ('Ocupación', 'Desocupado; no genera renta.'),
        ('Venta rápida', 'USD 185.000 (−15,9%): escenario de cierre ágil; las condiciones se definen en la negociación.'),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">USD 220.000</div><div class="bs">Precio de venta · {gs(PR['pedido'] * TC)}</div><div class="bigv sm2">USD 185.000</div><div class="bs">Precio de venta rápida</div><p>Edificio construido en 1980. Precio en dólares; alquileres futuros estimados en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Departamentos: inversión total {usd(eB['pedido']['inv'])} · bruta {pct(eB['pedido']['bruta'])} · neta {pct(eB['pedido']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 19 PROCESO
steps = [('Visita e inspección', 'Recorrido del edificio con inspección técnica de estructura, losas, instalaciones e impermeabilización.'), ('Proyecto y presupuesto', 'Anteproyecto de la alternativa elegida, presupuesto de obra y consulta de normativa municipal.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la puesta en valor con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de las unidades, contratos y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 20 CONSIDERACIONES
rk = [('Costo de obra', 'Es la variable decisiva: tabla de Meridiano con 25% de descuento, sin presupuesto sobre el edificio real.'),
      ('Sin renta actual', 'Doce meses o más sin ingresos entre compra, permisos y obra, más el tiempo de alquilar las unidades.'),
      ('Normativa y cambio de uso', 'Departamentos, patio de luz, seguridad contra incendio y usos permitidos requieren aprobación municipal.'),
      ('Sin estacionamiento', 'Casi todos los comparables incluyen cochera; puede reducir el canon o alargar la colocación.'),
      ('Referencias de mercado', 'Pocos anuncios por tipología, precios pedidos y disponibilidad sin confirmar: confianza baja a media.'),
      ('Estado del edificio', 'Construcción de 1980: la inspección técnica define el alcance real de la obra.'),
      ('Tipo de cambio e impuestos', 'Precio en dólares y alquileres en guaraníes; el IRE depende de la estructura de compra y lo determina el contador.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar en un edificio para poner en valor')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 21 CIERRE
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
