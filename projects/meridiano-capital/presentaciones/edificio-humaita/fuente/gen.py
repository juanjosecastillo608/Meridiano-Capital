import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; P = M['P']; PGS = M['P_GS']; cx = M['cx']
ev = {a: M[a]['ev'] for a in 'ABC'}
PROJ = 'Edificio Humaitá'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
MAPS_QR = 'https://maps.app.goo.gl/4nMui8uvZ9RYb6EeA'   # enviado por el founder, 08/11/2026
MAPS_HM = 'https://maps.app.goo.gl/nLyr38rbR7LSMgc58'   # Hospital Militar (referencia del founder)
MAPS_UAA = 'https://maps.app.goo.gl/L3SDhyebvBSkzJfA6'  # Universidad Autónoma de Asunción (referencia del founder)
def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))


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
ALT = {'A': 'A · Departamentos y salones', 'B': 'B · 20 habitaciones mensuales', 'C': 'C · Hostel de 20 habitaciones'}
def gsm(x): return 'Gs ' + n(x / 1e6, 1) + ' M'

num()
# 01 PORTADA
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Casona del centro histórico para poner en renta · en venta</div>
<h1>Edificio<br>Humaitá</h1>
<div class="addr">Humaitá 978, entre Colón y Montevideo · Centro de Asunción</div>
<div class="cvk"><div><div class="v" style="font-size:30px;white-space:nowrap">{usd(P)}</div><div class="l">Precio de venta · {gs(PGS)} al tipo de cambio vigente</div></div>
<div><div class="v">541 m²</div><div class="l">De terreno, 12,30 × 43 m</div></div></div>
<div class="cf">Hoy desocupado · Necesita remodelación · Tres opciones de renta · {tc_corto()}</div></div>
<div class="cr"><img src="img/fachada.jpg" style="object-position:45% 50%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Una casona del centro con 16 habitaciones para volver a rentar')}
<p class="lead">Casona de dos plantas sobre la calle Humaitá, a metros de la Av. Colón, con un edificio principal de tres ambientes y un salón con baños, y un área posterior de 13 habitaciones con baño privado alrededor de un patio. Hoy está desocupada y necesita una remodelación para generar renta. Se analizan tres usos: departamentos y salones, habitaciones en alquiler mensual y hostel.</p>
{kgrid([(usd(P), f'Precio de venta · {gs(PGS)}'), ('541 m²', 'Terreno · 12,30 × 43 m'), ('300 · 610 m²', 'Construidos según el aviso · según la tabla de unidades'), ('16 + 1', 'Habitaciones con baño + salón con baños sexados'),
        (pct(ev['A']['bruta']) + ' · ' + pct(ev['A']['neta']), 'A · Departamentos y salones: bruta · neta'), (pct(ev['B']['bruta']) + ' · ' + pct(ev['B']['neta']), 'B · 20 habitaciones mensuales: bruta · neta'),
        (pct(ev['C']['bruta']) + ' · ' + pct(ev['C']['neta']), 'C · Hostel: bruta · neta'), ('USD ' + n(P / M['TERRENO']), 'Por m² de terreno')], 'kgrid ks')}
<div class="box"><b>Propiedad ofrecida en su estado actual. Imágenes de transformación conceptuales.</b> Sin renta actual: toda rentabilidad es una estimación posterior a la obra, sobre el precio más la obra · Alquileres del estudio de mercado de Meridiano Capital · Tipo de cambio {TCTXT}</div>''', num()))

# 03 UBICACIÓN
loc = [('Dirección', 'Humaitá 978, entre Colón y Montevideo · Asunción'),
       ('Universidad Autónoma del Paraguay', 'La universidad más cercana, con su clínica, sobre la Av. Colón a pocas cuadras (ver mapa)'),
       ('Hospital Militar Central', 'Referencia de demanda: personal de salud, pacientes y familias'),
       ('Entorno', 'Centro de Asunción: oficinas públicas, comercio, bancos y atractivos turísticos')]
lh = ''.join(f'<div class="li" style="padding:7px 0 8px"><div class="eb sm">{a}</div><div class="lt" style="font-size:13.5px">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Humaitá 978, entre Colón y Montevideo')}
<div class="two" style="margin-top:18px;grid-template-columns:560px 1fr !important;gap:30px"><div><div class="mapimg"><img src="img/mapa_ubicacion.jpg" style="width:560px;height:262px;object-position:50% 40%"><div class="cap">Vista satelital: el marcador indica el edificio; arriba, la Universidad Autónoma del Paraguay sobre Colón · Imagen de Google Maps</div></div>
<div style="display:flex;gap:16px;align-items:center;margin-top:12px"><img src="img/qr_ubicacion.png" style="width:96px;height:96px"><div><div class="eb sm">Escanee para abrir la ubicación</div><a class="glink" style="margin-top:4px" href="{MAPS_QR}">{MAPS_QR.replace("https://", "")}</a></div></div></div>
<div><div class="mapimg"><img src="img/hospital_militar.jpg" style="width:100%;height:150px;object-position:50% 40%"><div class="cap">Hospital Militar Central · <a href="{MAPS_HM}" style="color:var(--tierra)">{MAPS_HM.replace("https://", "")}</a> · foto de un usuario de Google Maps (nov. 2021)</div></div>
<div class="locr" style="margin-top:6px">{lh}</div></div></div>
<div class="src">Dirección y enlaces enviados por el founder (08–09/11/2026); la UAP es la universidad más cercana, confirmada por el founder. Distancias a pie a medir. Identificación catastral a confirmar.</div>''', num()))

# 04 ZONA
zp = [('Estudiantes', 'La Universidad Autónoma del Paraguay, a pocas cuadras, y otros institutos del centro generan demanda de habitaciones y monoambientes por semestre.'),
      ('Salud', 'El Hospital Militar atrae personal médico, pacientes del interior y sus familias, que necesitan alojamiento cercano.'),
      ('Turismo y trabajo', 'El centro histórico concentra oficinas públicas y atractivos: base para estadías cortas y para oficinas o un centro de enseñanza.')]
zh = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(zp))
S.append(slide(f'''{head('La zona para el inversor', 'Tres demandas a pocas cuadras')}
<div class="two z"><div class="ztext"><p>El centro histórico de Asunción combina instituciones educativas, servicios de salud, oficinas públicas y turismo. Para una casona con muchas habitaciones con baño, esa mezcla abre dos caminos: el alquiler mensual a estudiantes y profesionales, y la estadía corta.</p>
<p>En el centro, un monoambiente se publica entre Gs 1,4 y 1,5 millones por mes y una habitación en casa de familia entre Gs 0,5 y 1,2 millones; una habitación privada de hostel, entre USD 7 y 31 por noche.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{zh}</div></div>
<div class="src">Estudio de mercado de Meridiano Capital del 08/11/2026 (ASU-CENTRO-HUMAITA-2026-11-08) en InfoCasas, Jariton, Hostelworld, Booking y Hostelz. Precios pedidos; disponibilidad no confirmada.</div>''', num()))

# 05 SUPERFICIES Y VALOR
S.append(slide(f'''{head('Superficies y valor', '541 m² de terreno en el centro histórico')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:110px;height:320px"><span style="font-size:15px;line-height:1.2;text-align:center">541<br>m²</span></div><div class="dimr" style="left:160px">43 m<br>de fondo</div><div class="dimb" style="top:342px">12,30 m de frente</div></div>
{kgrid([('USD ' + n(P / M['TERRENO']), 'Por m² de terreno'), ('USD ' + n(P / M['M2']), 'Por m² construido, sobre 610 m²'), (usd(P), f'Precio al {tc_corto()}'), ('2 plantas', 'Edificio principal y área posterior')], 'kgrid k2')}</div></div>
<div>{crit('Cómo leer el precio', [('Terreno', f'USD {n(P / M["TERRENO"])} por m² de terreno: entre un lote sobre Humaitá junto al Hospital Militar (USD 234/m²) y un lote sobre Humaitá entre Colón y Montevideo (USD 452/m², aviso de 2017).'), ('Superficie a confirmar', 'El aviso indica 300 m² construidos; la tabla de unidades suma 610 m² y la planilla de obra supone 600 m². Se aclara con planos y mensura.'), ('Precio en dólares', 'USD 160.000, fijado por el propietario; antes se ofrecía en Gs 950 M.'), ('Lectura', 'El valor está en el suelo del centro y en las habitaciones con baño ya construidas.')])}</div></div>
<div class="src">Superficies según el aviso y la tabla de unidades del propietario; sin planos ni mensura verificados. Comparables de venta: precios pedidos y antiguos (lámina 12).</div>''', num()))

# 06 EL EDIFICIO HOY
lv = [(['Edificio principal', '3 ambientes amplios, ideales para oficinas, y un gran salón con baños sexados'], ''), (['Área posterior', '13 habitaciones con baño privado alrededor de un patio con galería'], ''),
      (['Recepción y patio', 'Área de recepción y patio interior'], ''), (['Tabla de unidades', '19 unidades: 13 departamentos y monoambientes, 3 salones u oficinas y 3 unidades de proyecto en planta alta'], '')]
ft = [('Estado', 'Desocupado; necesita remodelación de terminaciones, instalaciones y fachada.'), ('Estilo', 'Casona colonial con techos altos, tirantes de madera y aberturas de doble hoja.'),
      ('Medidores', 'La mayoría de las unidades no tiene medidor propio de agua ni de luz, según la tabla.'), ('A verificar', 'Superficie construida, estado de techos e instalaciones, y normativa del centro histórico.')]
S.append(slide(f'''{head('El edificio hoy', 'Casona colonial desocupada, con habitaciones con baño')}
<div class="two d10">{table(['Sector', 'Descripción'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Distribución según el aviso y la tabla de unidades del propietario; a verificar en la inspección técnica.</p>''', num()))

# 07-08 FOTOS
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada e interiores')}
<div class="ph"><figure style="width:560px"><img src="img/fachada.jpg" style="height:412px"><figcaption>Fachada sobre la calle Humaitá</figcaption></figure>
<figure style="width:310px"><img src="img/interior_salon.jpg" style="height:412px"><figcaption>Ambiente del edificio principal</figcaption></figure></div>''', num(), dark=True))
S.append(slide(f'''{head('Recorrido fotográfico', 'Planta alta y patio')}
<div class="ph"><figure style="width:310px"><img src="img/planta_alta.jpg" style="height:412px"><figcaption>Salón de planta alta</figcaption></figure>
<figure style="width:310px"><img src="img/patio.jpg" style="height:412px"><figcaption>Galería y patio del área posterior</figcaption></figure></div>''', num(), dark=True))

# 08b FOTOS: ACCESOS Y HABITACIONES
S.append(slide(f'''{head('Recorrido fotográfico', 'Accesos y habitaciones, estado actual')}
<div class="ph"><figure style="width:235px"><img src="img/zip/acceso_original.jpg" style="height:412px"><figcaption>Acceso con piso calcáreo</figcaption></figure>
<figure style="width:235px"><img src="img/zip/habitacion_historica_1.jpg" style="height:412px"><figcaption>Ambiente con balcón a la calle</figcaption></figure>
<figure style="width:235px"><img src="img/zip/habitacion_posterior.jpg" style="height:412px"><figcaption>Habitación del área posterior</figcaption></figure>
<figure style="width:235px"><img src="img/zip/escalera_patio.jpg" style="height:412px"><figcaption>Escalera exterior al patio</figcaption></figure></div>''', num(), dark=True))

# 08c CONCEPTO: FACHADA
IA = 'Imágenes generadas con inteligencia artificial a partir de la foto actual, a modo ilustrativo: pueden diferir en detalles, no son planos ni obra presupuestada. Propiedad ofrecida en su estado actual.'
S.append(slide(f'''{head('Potencial del espacio · concepto', 'Tres lecturas para la fachada')}
<div class="ph"><figure style="width:330px"><img src="img/zip/fachada_concepto_a.jpg" style="height:250px"><figcaption>A · Patrimonial moderno: marfil, grafito y madera</figcaption></figure>
<figure style="width:330px"><img src="img/zip/fachada_concepto_b.jpg" style="height:250px"><figcaption>B · Boutique urbano: piedra cálida e iluminación rasante</figcaption></figure>
<figure style="width:330px"><img src="img/zip/fachada_concepto_c.jpg" style="height:250px"><figcaption>C · Contemporáneo cálido: arena, madera y verde</figcaption></figure></div>
<p class="note2" style="color:#cfd6d7;margin-top:22px">{IA}</p>''', num(), dark=True))

# 08d ANTES Y DESPUÉS
S.append(slide(f'''{head('Potencial del espacio · concepto', 'Antes y después de una puesta en valor')}
<div class="ph"><figure style="width:500px"><img src="img/zip/fachada_original.jpg" style="height:375px"><figcaption>Estado actual (fotografía)</figcaption></figure>
<figure style="width:500px"><img src="img/zip/fachada_residencia.jpg" style="height:375px"><figcaption>Concepto de residencia de habitaciones (ilustración)</figcaption></figure></div>
<p class="note2" style="color:#cfd6d7;margin-top:18px">{IA}</p>''', num(), dark=True))

# 08e HABITACIÓN TIPO Y PATIO
S.append(slide(f'''{head('Potencial del espacio · concepto', 'Habitación tipo y patio compartido')}
<div class="ph"><figure style="width:250px"><img src="img/zip/habitacion_concepto.jpg" style="height:380px"><figcaption>Habitación con baño, escritorio y guardado</figcaption></figure>
<figure style="width:400px"><img src="img/zip/patio_estudio.jpg" style="height:380px"><figcaption>Patio de estudio bajo el árbol existente</figcaption></figure>
<figure style="width:340px"><img src="img/zip/patio_lounge.jpg" style="height:380px"><figcaption>Patio lounge con pérgola</figcaption></figure></div>
<p class="note2" style="color:#cfd6d7;margin-top:18px">{IA}</p>''', num(), dark=True))

# 09 OPCIONES
def card(a, rows, gold=False):
    return f'<div><div class="altt{" gold" if gold else ""}">{ALT[a]}</div>{table(["", ""], rows, "t nohead sm")}</div>'
rA = [(['Programa', '19 unidades de la tabla del propietario: 13 departamentos y monoambientes, 3 salones u oficinas y 3 unidades nuevas'], ''), (['Renta', 'Mensual, sin muebles'], ''), (['Obra', f'Puesta en valor a USD {n(M["A_REFAC"])}/m² y baño y kitchenette en 3 unidades'], 'b')]
rB = [(['Programa', '20 habitaciones con baño privado, amobladas y con aire, para estudiantes y profesionales'], ''), (['Renta', 'Mensual, todo incluido: el propietario paga servicios y limpieza'], ''), (['Obra', 'Presupuesto detallado de la planilla del propietario'], 'b')]
rC = [(['Programa', '20 habitaciones privadas con recepción, cocina común y patio'], ''), (['Renta', 'Por noche, por plataformas; requiere personal y habilitación turística'], ''), (['Obra', 'La de B más equipamiento de hostel'], 'b')]
S.append(slide(f'''{head('Opciones de renta', 'Tres usos para el mismo edificio')}
<div class="two alt3">{card('A', rA)}{card('B', rB, True)}{card('C', rC)}</div>
<p class="note2"><b>Cómo se comparan.</b> A es la más simple: unidades que ya tienen cocina y baño, con la obra más liviana. B aprovecha las habitaciones con baño para la demanda de estudiantes y profesionales, con más ingreso y más gestión. C convierte la casona en un hostel: el mayor ingreso bruto, pero también los mayores costos operativos y la renta más variable. Programas preliminares, a validar con arquitecto y Municipalidad (centro histórico).</p>''', num()))

# 10 OBRA
def cxrows(a):
    c = cx[a]
    rows = [([l, usd(v)], '') for l, v in c['parts']]
    if c['imprev']: rows.append((['Imprevistos (10%)', usd(c['imprev'])], ''))
    return rows + [(['Obra total', usd(c['total'])], 'b'), (['Inversión total', usd(c['total'] + P)], 'tot')]
S.append(slide(f'''{head('Costo de la obra', 'Inversión total por opción, con el precio de USD 160.000')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT[a]}</div>{table(["Concepto", "USD"], cxrows(a), "t big")}</div>' for a in 'ABC')}</div>
<p class="note2 sm"><b>Criterios.</b> A: 50% de la tabla básica de remodelación (USD 350/m²) y USD 6.000 por unidad nueva, más 10% de imprevistos; 6 meses. B: presupuesto de la planilla del propietario, ya con imprevistos del 8% y sin gastos de compra; 12 meses. C: B más equipamiento hotelero. Sin presupuesto de un constructor.</p>''', num()))

# 11 INGRESOS
ua = M['UNITS']
grp = {}
for u in ua:
    k = ('Salón / oficina' if u[6] == 'COM' else ('Unidad nueva' if 'proyecto' in u[2] else u[3].split(',')[0]))
    g = grp.setdefault(k, [0, 0]); g[0] += 1; g[1] += u[5]
arows = [([k, f'{v[0]} unidades', gs(v[1]), usd(v[1] / TC)], '') for k, v in grp.items()] + [(['Total', '19 unidades', gs(M['A']['inc']['mes_gs']), usd(M['A']['inc']['mes_gs'] / TC)], 'tot')]
brows = [(['Habitaciones', f"20 × {gs(M['B_RENT_GS'])}", gs(M['B']['inc']['mes_gs']), usd(M['B']['inc']['mes_gs'] / TC)], 'tot')]
crows = [(['Habitaciones privadas', f"20 × USD {n(M['C_ADR'])} × {pct(M['C_OCC'], 0)} de ocupación", gs(M['C']['inc']['mes_gs']), usd(M['C']['inc']['G'] / 12)], 'tot')]
sup = [('Departamentos y salones', 'Alquileres proyectados de la tabla del propietario: monoambientes de 20 m² a Gs 800.000, dentro de la banda del centro (Gs 0,7–1,65 M).'),
       ('Habitaciones', f"{gs(M['B_RENT_GS'])} todo incluido: entre la habitación en casa de familia (Gs 0,5–1,2 M) y el monoambiente del centro (Gs 1,4–1,5 M)."),
       ('Hostel', f"USD {n(M['C_ADR'])} por noche: privadas del centro entre USD 7 y 31; ocupación de {pct(M['C_OCC'], 0)}, el piso de la banda de Meridiano (55–69%).")]
S.append(slide(f'''{head('Ingresos estimados', 'Ingreso bruto mensual tras la obra')}
<div class="two cx2 cmp"><div><div class="altt">{ALT['A']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], arows, 't xs')}
<div class="altt gold" style="margin-top:8px">{ALT['B']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], brows, 't xs')}
<div class="altt" style="margin-top:8px">{ALT['C']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], crows, 't xs')}</div>
{crit('Base de mercado (estudio 08/11/2026)', sup)}</div>''', num()))

# 12 REFERENCIAS
rc = [('M1', 'Monoambiente de 30 m²', 'Centro, Catedral', 'Gs 1.400.000 por mes'), ('M2', 'Monoambiente, edificio con portería', 'Centro', 'Gs 1.500.000 + expensas'),
      ('M3', 'Monoambiente amoblado', 'Catedral', 'Gs 1.500.000 por mes'), ('R1', 'Habitación en casa de familia (guía 2026)', 'Cerca de universidades', 'Gs 500.000–1.200.000'),
      ('H1', 'Hostels del centro, habitación privada', 'Hostelworld', 'Desde USD 6,8–13,7 por noche'), ('H2', 'Hostels de Asunción', 'Booking', 'Desde USD 20–31 por noche'),
      ('T1', 'Terreno sobre Humaitá, junto al Hospital Militar (venta)', '962 m²', 'USD 225.000 · USD 234/m²'), ('T2', 'Terreno sobre Humaitá, entre Colón y Montevideo (venta)', '553 m²', 'USD 250.000 · USD 452/m²')]
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres, hostels y terrenos publicados')}
{table(['ID', 'Tipología', 'Ubicación o fuente', 'Precio'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Lectura.</b> El precio pedido de la casona, unos USD 271 por m² de terreno, está entre los dos lotes sobre la misma calle. Las referencias de venta son antiguas (T2 es de 2017): se recomienda una tasación antes de cerrar.</p>
<div class="src">Estudio de mercado de Meridiano Capital, consulta del 08/11/2026. Precios pedidos, no contratos ni cierres; disponibilidad no confirmada; tarifas de hostels variables según temporada.</div>''', num()))

# 13 INGRESOS Y EGRESOS
def er(a):
    e = ev[a]; G = e['G']
    rows = [(['Ingreso bruto anual', '100%', usd(G)], 'b')] + [([k, pct(v / G, 1), '– ' + usd(v)], '') for k, v in e['ded'].items()] + [([k, pct(v / G, 1), '– ' + usd(v)], '') for k, v in e['fijos'].items()]
    return rows + [(['Antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'), (['IRE estimado (10%)', pct(e['ire'] / G, 1), '– ' + usd(e['ire'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT[a]}</div>{table(["Concepto", "%", "USD/año"], er(a), "t sm ie")}</div>' for a in 'ABC')}</div>
<p class="note2 sm"><b>Criterios (D-101).</b> IVA: el alquiler de mercado ya incluye el IVA (5% vivienda y habitaciones, 10% salones y hostel); se paga la diferencia entre ese IVA y el de los gastos con factura (crédito fiscal). El crédito del IVA de la obra cubre el IVA de los primeros años y se suma en la TIR. IRE: 10% sobre el resultado menos la depreciación (2,5% anual sobre la obra y la mitad del precio). A: las expensas las pagan los inquilinos; vacancia 6–10%. B: gastos del edificio de la planilla (USD 1.470/mes), vacancia 10%. C: ocupación 55% y 3 recepcionistas. La contadora define la base fiscal real.</p>''', num()))

# 14 RENTABILIDAD
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{" gold" if a == "B" else ""}">{ALT[a]}</div>' for a in 'ABC')
def rowr(lbl, key, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{usd(ev[a]["inv"]) if key == "inv" else pct(ev[a][key])}</div>' for a in 'ABC')
S.append(slide(f'''{head('Rentabilidad estimada', 'Tres usos, con el precio de USD 160.000')}<div class="rule"></div>
<div class="rg4" style="grid-template-columns:250px repeat(3,1fr)">{hdr}{rowr('Bruta sobre inversión total', 'bruta', 'bigv m4')}{rowr('Neta antes de IRE', 'neta_pre', 'midv')}{rowr('Neta final', 'neta', 'midv')}{rowr('Inversión total', 'inv', 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> El denominador es el precio más la obra, sin gastos de adquisición. La bruta del hostel es alta, pero sus costos (plataformas, limpieza, personal) se llevan la mayor parte: hay que comparar las netas. B es la de mejor neta. Estimaciones sin contratos que las respalden; cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 15 HOSTEL / HABITACIONES EN DETALLE
oc = M['C_occ']
orows = [([f'Ocupación {pct(float(k), 0)}', pct(v)], 'b' if k == '0.55' else '') for k, v in oc.items()]
S.append(slide(f'''{head('Habitaciones o hostel', 'Lo que decide entre B y C')}
<div class="two cx2"><div><div class="altt">Hostel: neta final según la ocupación</div>{table(['Escenario', 'Neta final'], orows, 't big')}
<p class="note2 sm">Con 55% de ocupación el hostel rinde menos que las habitaciones mensuales; necesita cerca de 65% sostenido para igualarlas. A 45%, la neta cae a {pct(oc['0.45'], 1)}.</p></div>
{crit('Lectura', [('Habitaciones mensuales (B)', 'Renta estable por semestre, demanda de estudiantes de la UAP y de personal del Hospital Militar, poca operación diaria.'), ('Hostel (C)', 'Ingreso bruto mayor, pero con plataformas, limpieza diaria, recepción y habilitación turística.'), ('Camino sugerido', 'Empezar con B y reservar algunas habitaciones para estadías cortas de familias de pacientes, si la demanda lo justifica.'), ('Alquiler de B', f"Con {gs(M['B_RENT_GS'])} por habitación, B rinde {pct(ev['B']['bruta'])} bruta; para un 10% bastaría con unos {gs(M['B_req10'])}.")])}</div>''', num()))

# 16 SENSIBILIDAD
CN0, CN15 = pct(M['sens']['C|1.0|1.0'][1], 1), pct(M['sens']['C|1.0|0.85'][1], 1)
def srow(a, f):
    lbl = f'{ALT[a].split(" · ")[1]} · obra {"base" if f == 1.0 else "+25%"}'
    return ([lbl] + [pct(M['sens'][f'{a}|{f}|{k}'][0]) + ' · ' + pct(M['sens'][f'{a}|{f}|{k}'][1]) for k in ('0.85', '1.0', '1.15')], 'b' if f == 1.0 else '')
srows = [srow(a, f) for a in 'ABC' for f in (1.0, 1.25)]
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: alquiler y costo de obra')}
<div class="two cx2"><div><div class="altt">Bruta · neta final sobre inversión total</div>{table(['Opción y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], srows, 't big')}</div>
{crit('Lectura', [('El alquiler', f'En el hostel, un 15% menos de tarifa baja la neta de {CN0} a {CN15}: sus costos fijos son altos.'), ('La obra', 'Un 25% más de obra resta entre 1,1 y 3,2 puntos brutos; pesa más en B y C.'), ('Presupuesto real', 'El presupuesto de la planilla supone 600 m² y 20 habitaciones: hay que ajustarlo a la superficie real.')])}</div>''', num()))

# 17 TIR
pr = M['proj']
bt = max('ABC', key=lambda a: pr[a]['Base']['tir'])
trows = [([ALT[a]] + [pct(pr[a][k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [usd(pr[a]['Base']['total'])], 'b' if a == bt else '') for a in 'ABC']
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años por opción')}
<div class="two d15">{table(['Opción · compra a USD 160.000', 'Conservador', 'Base', 'Optimista', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr[bt]['Base']['tir'], 1)}</div><div class="bs">TIR base de {ALT[bt].split(' · ')[1].lower()}: la más alta de las tres</div><p>A: 6 meses de obra. B y C: un año de obra. Luego renta neta y venta al valor estimado del año 5. Escenarios: alquileres +2/+3/+5% y valorización 2/3,5/5% anual. Incluye el ahorro de IVA por el crédito fiscal de la obra (D-101).</p><p class="gold">Supuesto clave: el valor del inmueble parte de la inversión total y se valoriza desde el fin de la obra.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. Ganancia base = plusvalía − IVA de la venta futura (1,5%) + renta neta acumulada. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 18 PRECIO
info = [('Activo', 'Casona de 2 plantas sobre 541 m² de terreno: edificio principal con salón y baños sexados, y 13 habitaciones con baño en el área posterior.'),
        ('Ocupación', 'Desocupado; entrega inmediata a confirmar.'),
        ('Precio de referencia', f"Con la opción A, la bruta se mantiene en 10% o más hasta un precio de {usd(ev['A']['max10'])}; a {usd(P)} ya lo supera, igual que B."),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del inmueble completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">{usd(P)}</div><div class="bs">Precio de venta · {gs(PGS)}</div><p>Precio y obra en dólares; alquileres en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Neta final: A {pct(ev['A']['neta'])} · B {pct(ev['B']['neta'])} · C {pct(ev['C']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 19 PROCESO
steps = [('Visita e inspección', 'Recorrido con inspección técnica de techos, estructura, instalaciones y humedad.'), ('Proyecto y presupuesto', 'Anteproyecto del uso elegido, presupuesto de obra ajustado a la superficie real y consulta de la normativa del centro histórico.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, mensura, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la obra con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de habitaciones o unidades, contratos y administración, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 20 CONSIDERACIONES
rk = [('Superficie y presupuesto', 'El aviso dice 300 m² construidos y la planilla de obra supone 600 m² y 20 habitaciones: el presupuesto debe rehacerse sobre planos.'),
      ('Estado del edificio', 'Casona antigua desocupada: techos, humedad e instalaciones definen el alcance real de la obra.'),
      ('Centro histórico', 'Fachada y reformas pueden requerir aprobación municipal especial.'),
      ('Sin renta actual', 'Seis a doce meses sin ingresos entre compra, permisos y obra, más el tiempo de ocupar las habitaciones.'),
      ('Operación', 'Habitaciones y hostel exigen administración activa; el hostel, además, habilitación turística y personal.'),
      ('Tipo de cambio', 'Precio y obra en dólares, alquileres en guaraníes: si sube el dólar, baja la renta medida en dólares.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar antes de ofertar')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 21 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita a la casona</h2>
<p class="cp">Recorremos el inmueble con una inspección técnica, ajustamos el presupuesto de obra a la superficie real y lo acompañamos en la compra, la obra, la comercialización y la administración.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Casona en el centro histórico</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
