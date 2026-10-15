import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG, tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; PR = M['PRICES']
A, Bm = M['A'], M['B']
cxA, cxB, cxC = M['cxA'], M['cxB'], M['cxC']
eA, eB, eC = A['ev'], Bm['ev'], M['C']['ev']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))
def rate(x): return 'USD ' + (n(x, 1) if x % 1 else n(x))

PROJ = 'Edificio Sajonia'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
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
<div class="cf">Construido en 1980 · Hoy desocupado, sin renta · Rentabilidad estimada tras la puesta en valor · {tc_corto()}</div></div>
<div class="cr"><img src="img/fachada_lat.jpg" style="object-position:52% 50%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de oficinas de tres niveles para reconvertir en renta')}
<p class="lead">Edificio construido en 1980 como sede de oficinas, a pasos del Parque Carlos Antonio López y en la zona del Palacio de Justicia. Hoy está desocupado y no genera renta: su valor está en la puesta en valor. Se analizan tres alternativas (oficinas y locales, departamentos y uso mixto) a dos precios: el de venta y el de venta rápida.</p>
{kgrid([('USD 220.000', 'Precio de venta'), ('USD 185.000', 'Precio de venta rápida (−15,9%)'), ('803 m²', 'Construidos · 3 niveles'), ('268 m²', 'Terreno de 8 × 33,44 m'),
        (pct(eA['pedido']['bruta']) + ' · ' + pct(eA['pedido']['neta']), 'A · Oficinas: bruta · neta a USD 220.000'), (pct(eB['pedido']['bruta']) + ' · ' + pct(eB['pedido']['neta']), 'B · Departamentos: bruta · neta a USD 220.000'), (pct(eC['pedido']['bruta']) + ' · ' + pct(eC['pedido']['neta']), 'C · Mixto: bruta · neta a USD 220.000'), (pct(eC['rapida']['neta']), 'Mejor neta: C a USD 185.000')], 'kgrid ks')}
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
ALT_NAMES = {'A': 'A · Oficinas y locales', 'B': 'B · Departamentos', 'C': 'C · Mixto'}
def alt_card(a, rows, gold=False):
    return f'<div><div class="altt{" gold" if gold else ""}">{ALT_NAMES[a]}</div>{table(["", ""], rows, "t nohead sm")}</div>'
altA_rows = [(['Programa', f'Plantas libres de oficinas y local; {round(M["A_m2"])} m² alquilables (80% de lo construido)'], ''),
             (['Obra', 'Puesta en valor del uso original: fachada, instalaciones, sanitarios, climatización y terminaciones'], ''),
             (['Costo', f'{rate(cxA["rate"])}/m² (tabla básica USD 350 − 25%)'], 'b')]
altB_rows = [(['Programa', '2 dptos. de 2 dorm., 3 de 1 dorm., 5 monoambientes y 1 local en PB'], ''),
             (['Obra', 'Cambio de uso: cocinas y baños por unidad, instalaciones individuales, patio de luz'], ''),
             (['Costo', f'{rate(cxB["rate"])}/m² (tabla estándar USD 450 − 25%)'], 'b')]
altC_rows = [(['Programa', f'Local en PB y oficinas en niveles 1 y 2 ({round(M["C_OF_M2"])} m²); nivel 3: 1 dpto. de 2 dorm., 1 de 1 dorm. y 2 monoambientes'], ''),
             (['Obra', 'Puesta en valor de oficinas y cambio de uso solo en el nivel 3; accesos y medidores separados'], ''),
             (['Costo', f'{rate(cxC["rate"])}/m² promedio (2 niveles a USD 262,5 + 1 a USD 337,5)'], 'b')]
S.append(slide(f'''{head('Alternativas de puesta en valor', 'Tres caminos para volver a generar renta')}
<div class="two alt3">{alt_card('A', altA_rows)}{alt_card('B', altB_rows, True)}{alt_card('C', altC_rows)}</div>
<p class="note2"><b>Cómo se comparan.</b> A conserva el uso original y requiere la obra más liviana, pero concentra todo el ingreso en oficinas sin cocheras. B diversifica en 10 unidades con menos vacancia e IVA más bajo, a cambio de la obra más cara. C combina ambos: menor obra que B y menor exposición a oficinas que A, pero exige separar accesos, medidores y seguridad contra incendio por uso. Los programas de B y C son preliminares y deben validarse con un arquitecto y con la Municipalidad.</p>''', num()))

# 11 CAPEX
def cxrows(cx):
    return [(['Obra', usd(cx['obra'])], ''), (['Imprevistos (10%)', usd(cx['imprev'])], ''), (['Puesta en valor', usd(cx['total'])], 'b'),
            (['Inversión a USD 220.000', usd(cx['total'] + PR['pedido'])], 'tot'), (['Inversión a USD 185.000', usd(cx['total'] + PR['rapida'])], 'tot')]
S.append(slide(f'''{head('Costo de puesta en valor', 'Inversión total por alternativa y precio de compra')}
<div class="two alt3"><div><div class="altt">{ALT_NAMES['A']} · {rate(cxA['rate'])}/m²</div>{table(['Concepto', 'USD'], cxrows(cxA), 't big')}</div>
<div><div class="altt gold">{ALT_NAMES['B']} · {rate(cxB['rate'])}/m²</div>{table(['Concepto', 'USD'], cxrows(cxB), 't big')}</div>
<div><div class="altt">{ALT_NAMES['C']} · {rate(round(cxC['rate'], 1))}/m²</div>{table(['Concepto', 'USD'], cxrows(cxC), 't big')}</div></div>
<p class="note2 sm"><b>Criterios.</b> Costos por m² de la tabla de Meridiano Capital ("remodelación sobre obra existente") con un 25% de descuento por el estado actual del edificio, aplicados sobre los 803 m². Imprevistos: supuesto de 10% por la antigüedad del edificio. Plazo: supuesto de 12 meses sin renta. Excluye gastos de adquisición, mobiliario y comisión de alquiler.</p>''', num()))

# 12 INGRESOS ESTIMADOS
def inc_rows(a, total_lbl=''):
    alt = M[a]['alt']
    return [([l, d, gs(c), usd(c / TC)], '') for l, d, c in alt['lines']] + [(['Total', total_lbl, gs(alt['mes']), usd(alt['mes'] / TC)], 'tot')]
sup = [('Oficinas', 'Gs 45.000/m²: O3, oficina de 160 m² sin muebles en Sajonia (Gs 46.350/m²).')] + \
      [(lbl, f"{gs(M['REF'][k])} · {M['REF_TXT'][k]}") for lbl, k in [('2 dormitorios', '2D'), ('1 dormitorio', '1D'), ('Monoambiente', 'MONO'), ('Local en PB', 'LOCAL')]]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual tras la puesta en valor')}
<div class="two cx2 cmp"><div><div class="altt">{ALT_NAMES['A']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('A'), 't xs')}
<div class="altt gold" style="margin-top:8px">{ALT_NAMES['B']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('B', '11 unidades'), 't xs')}
<div class="altt" style="margin-top:8px">{ALT_NAMES['C']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('C'), 't xs')}</div>
{crit('Base de mercado (estudio 15/10/2026)', sup)}</div>''', num()))

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
def er(a):
    e, alt = M[a]['ev']['pedido'], M[a]['alt']
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), (['IVA', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', '8,0%', '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two alt3"><div><div class="altt">{ALT_NAMES['A']}</div>{table(['Concepto', '%', 'USD/año'], er('A'), 't sm ie')}</div>
<div><div class="altt gold">{ALT_NAMES['B']}</div>{table(['Concepto', '%', 'USD/año'], er('B'), 't sm ie')}</div>
<div><div class="altt">{ALT_NAMES['C']}</div>{table(['Concepto', '%', 'USD/año'], er('C'), 't sm ie')}</div></div>
<p class="note2 sm">El resultado operativo no depende del precio de compra. IVA: 10% en oficinas y locales, 5% en vivienda; vacancia de referencia de Meridiano: 10% oficinas, 8% locales, 4% vivienda (ponderados por ingreso en B y C). Gastos fijos: supuesto de Gs 9.000.000 por año. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', num()))

# 15 RENTABILIDAD
def c(a, p, k): return pct(M[a]['ev'][p][k])
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{" gold" if a == "B" else ""}">{a} · USD {"220" if p == "pedido" else "185"} mil</div>' for a in 'ABC' for p in ('pedido', 'rapida'))
def rowr(lbl, k, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{c(a, p, k) if k != "inv" else usd(M[a]["ev"][p]["inv"])}</div>' for a in 'ABC' for p in ('pedido', 'rapida'))
S.append(slide(f'''{head('Rentabilidad estimada', 'Tres alternativas a dos precios de compra')}<div class="rule"></div>
<div class="rg6">{hdr}{rowr('Bruta sobre inversión total', 'bruta', 'bigv m6')}{rowr('Neta antes de IRE', 'neta_pre', 'midv')}{rowr('Neta final', 'neta', 'midv')}{rowr('Inversión total', 'inv', 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> A = oficinas y locales; B = departamentos; C = mixto. El denominador es el precio más la puesta en valor, sin gastos de adquisición. Son estimaciones posteriores a la obra, con alquileres del estudio de mercado: no hay renta actual que las respalde. La venta rápida suma entre 0,8 y 1,1 puntos brutos, porque la obra pesa más que el precio. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 16 SENSIBILIDAD
def srow(a, d):
    lbl = f'{ALT_NAMES[a].split(" · ")[1]} · obra {"−25%" if d else "sin descuento"}'
    return ([lbl] + [pct(M['sens'][f'{a}|{d}|{k}|pedido'][0]) + ' · ' + pct(M['sens'][f'{a}|{d}|{k}|pedido'][1]) for k in ('0.85', '1.0', '1.15')], 'b' if d else '')
srows = [srow(a, d) for a in 'ABC' for d in (M['DESC'], 0)]
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: costo de obra y alquiler')}
<div class="two cx2"><div><div class="altt">Bruta · neta final sobre inversión total, compra a USD 220.000</div>{table(['Alternativa y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], srows, 't big')}</div>
{crit('Lectura', [('La obra es la palanca', f"Sin el descuento del 25%, la bruta cae unos 2 puntos en cada alternativa: B queda en {pct(M['sens']['B|0|1.0|pedido'][0], 1)}, A en {pct(M['sens']['A|0|1.0|pedido'][0], 1)} y C en {pct(M['sens']['C|0|1.0|pedido'][0], 1)}."), ('El alquiler', 'Un 15% menos de alquiler resta entre 1,7 y 2 puntos brutos; las oficinas (A y C) son las más expuestas por su vacancia y por la falta de cocheras.'), ('El precio', 'Comprar a USD 185.000 suma entre 0,8 y 1,1 puntos brutos en cada alternativa.'), ('Presupuesto real', 'Antes de ofertar: presupuesto de obra sobre el edificio real con arquitecto o constructor.')])}</div>''', num()))

# 17 PLUSVALIA
pr = M['proj']
trows = []
for a in 'ABC':
    for p in ('pedido', 'rapida'):
        x = pr[a][p]
        trows.append(([f'{ALT_NAMES[a]} · USD {"220.000" if p == "pedido" else "185.000"}'] + [pct(x[k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [usd(x['Base']['total'])], 'b' if p == 'pedido' else ''))
best = max(((a, p) for a in 'ABC' for p in ('pedido', 'rapida')), key=lambda t: pr[t[0]][t[1]]['Base']['tir'])
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años por alternativa')}
<div class="two d15">{table(['Alternativa · precio', 'Conservador', 'Base', 'Optimista', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr['C']['pedido']['Base']['tir'],1)} · {pct(pr['C']['rapida']['Base']['tir'],1)}</div><div class="bs">TIR base del mixto (C), a USD 220.000 y a USD 185.000: la más alta de las tres</div><p>Compra, un año de obra sin renta, cuatro años de renta neta y venta al valor estimado del año 5. Escenarios: alquileres +3/+5/+8% y valorización 2/3,5/5% anual.</p><p class="gold">Supuesto clave: el valor del edificio terminado parte de la inversión total y se valoriza desde el fin de la obra.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. Ganancia base = plusvalía − IVA de la venta futura (1,5%) + renta neta acumulada, a USD 220.000 o USD 185.000 según la fila. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 18 PRECIO Y CONDICIONES
info = [('Activo', 'Edificio de oficinas de 3 niveles, 803 m² construidos en 1980 sobre 268 m² de terreno. Sin estacionamiento propio.'),
        ('Ocupación', 'Desocupado; no genera renta.'),
        ('Venta rápida', 'USD 185.000 (−15,9%): escenario de cierre ágil; las condiciones se definen en la negociación.'),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">USD 220.000</div><div class="bs">Precio de venta · {gs(PR['pedido'] * TC)}</div><div class="bigv sm2">USD 185.000</div><div class="bs">Precio de venta rápida</div><p>Edificio construido en 1980. Precio en dólares; alquileres futuros estimados en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Neta final a USD 220.000: A {pct(eA['pedido']['neta'])} · B {pct(eB['pedido']['neta'])} · C {pct(eC['pedido']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 19 PROCESO
steps = [('Visita e inspección', 'Recorrido del edificio con inspección técnica de estructura, losas, instalaciones e impermeabilización.'), ('Proyecto y presupuesto', 'Anteproyecto de la alternativa elegida, presupuesto de obra y consulta de normativa municipal.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la puesta en valor con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de las unidades, contratos y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 20 CONSIDERACIONES
rk = [('Costo de obra', 'Es la variable decisiva en las tres alternativas: tabla de Meridiano con 25% de descuento, sin presupuesto sobre el edificio real.'),
      ('Sin renta actual', 'Doce meses o más sin ingresos entre compra, permisos y obra, más el tiempo de alquilar las unidades.'),
      ('Normativa y cambio de uso', 'Departamentos, uso mixto (accesos y medidores separados), patio de luz, seguridad contra incendio y usos permitidos requieren aprobación municipal.'),
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
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio para poner en valor</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
