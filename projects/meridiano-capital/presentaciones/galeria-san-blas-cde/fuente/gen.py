import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; P = M['P']; cx = M['cx']
ev = {a: M[a]['ev'] for a in 'ABC'}

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))

PROJ = 'Galería San Blas'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Ciudad del Este · Venta'
TCTXT = tc_texto()
MAPS_QR = 'https://maps.app.goo.gl/jszFoMyfd4agg5LfA'   # enviado por el founder, 07/11/2026

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
ALT = {'A': 'A · Galería de locales', 'B': 'B · Renta a un operador', 'C': 'C · Galería y oficinas'}
SUELO_RES = P - M['M2'] * 450   # precio menos la construcción valuada a costo nuevo (tabla: locales comerciales estándar)

num()
# 01 PORTADA
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Galería comercial de calle a calle · en venta</div>
<h1>Galería<br>San Blas</h1>
<div class="addr">Av. San Blas 519 y Camilo Recalde · Microcentro de Ciudad del Este</div>
<div class="cvk"><div><div class="v" style="font-size:30px;white-space:nowrap">{usd(P)}</div><div class="l">Precio de venta</div></div>
<div><div class="v">900 m²</div><div class="l">De terreno, 15 × 60 m, con 1.572 m² construidos</div></div></div>
<div class="cf">Doble frente · A 650 m del Puente de la Amistad según el aviso · Tres opciones de renta · {tc_corto()}</div></div>
<div class="cr"><img src="img/aerea_calles.jpg" style="object-position:50% 45%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Un lote pasante en el corazón del comercio de frontera')}
<p class="lead">Galería comercial de dos niveles que une la Av. San Blas con la calle Camilo Recalde, en el microcentro de Ciudad del Este. Hoy funciona en ella una casa de venta textil. El valor principal está en el suelo y en el doble frente; se analizan tres formas de ponerla en renta.</p>
{kgrid([(usd(P), 'Precio de venta'), ('900 m²', 'Terreno · 15 m de frente por 60 m de fondo'), ('1.572 m²', 'Construidos en 2 niveles'), ('2 frentes', 'Av. San Blas y Camilo Recalde'),
        (pct(ev['A']['bruta']) + ' · ' + pct(ev['A']['neta']), 'A · Galería de locales: bruta · neta'), (pct(ev['B']['bruta']) + ' · ' + pct(ev['B']['neta']), 'B · Renta a un operador: bruta · neta'),
        (pct(ev['C']['bruta']) + ' · ' + pct(ev['C']['neta']), 'C · Galería y oficinas: bruta · neta'), ('USD ' + n(P / M['TERRENO']), 'Por m² de terreno')], 'kgrid ks')}
<div class="box">Rentabilidades sobre el precio más la obra de cada opción, con alquileres del estudio de mercado de Meridiano Capital, en dólares · Contrato de la ocupación actual sin verificar · Tipo de cambio {TCTXT}</div>''', num()))

# 03 UBICACIÓN
loc = [('Dirección', 'Av. San Blas 519, con salida a Camilo Recalde · Microcentro, Ciudad del Este'), ('Puente de la Amistad', 'A 650 m del cruce fronterizo con Foz do Iguaçu, según el aviso'),
       ('Doble frente', 'Vidriera y acceso por las dos calles: doble flujo de compradores'), ('Entorno', 'Galerías, casas de electrónica, importadoras y hoteles del microcentro')]
lh = ''.join(f'<div class="li" style="padding:10px 0 11px"><div class="eb sm">{a}</div><div class="lt" style="font-size:14.5px">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Av. San Blas y Camilo Recalde, microcentro de CDE')}
<div class="two" style="margin-top:22px"><div><div class="mapimg"><img src="img/aerea_calles.jpg" style="height:300px;object-position:50% 40%"><div class="cap">Vista aérea: la galería ocupa el lote de calle a calle, entre la Av. San Blas y Camilo Recalde</div></div>
<div style="display:flex;gap:18px;align-items:center;margin-top:14px"><img src="img/qr_ubicacion.png" style="width:104px;height:104px"><div><div class="eb sm">Escanee para abrir la ubicación</div><a class="glink" style="margin-top:6px" href="{MAPS_QR}">{MAPS_QR.replace("https://", "")}</a></div></div></div>
<div class="locr">{lh}</div></div>
<div class="src">Dirección y enlace de ubicación enviados por el founder el 07/11/2026; distancia al puente según el aviso, a medir. Identificación catastral a confirmar.</div>''', num()))

# 04 ZONA
zp = [('Comercio de frontera', 'Temporadas fuertes: feriados de Brasil y Semana Santa 2026 con calles y hoteles llenos de compradores.'),
      ('Alquiler comercial', 'Las galerías del microcentro piden hasta USD 50 por m²; los salones grandes, entre USD 7 y 10.'),
      ('Riesgo a seguir', 'El nuevo control de compras de Brasil preocupa al comercio de CDE por una posible caída de compradores.')]
zh = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(zp))
S.append(slide(f'''{head('La zona para el inversor', 'El microcentro vive del comprador que cruza el puente')}
<div class="two z"><div class="ztext"><p>El microcentro de Ciudad del Este es el polo de compras de la frontera con Brasil. Sobre la Av. San Blas, el eje que llega al Puente de la Amistad, se concentran galerías, importadoras y comercios que dependen del flujo de compradores brasileños y argentinos.</p>
<p>Para un inmueble así, el valor tiene dos fuentes: la renta comercial, que acompaña el ciclo del comercio de frontera, y el suelo, escaso en el microcentro y con dos frentes en este caso.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{zh}</div></div>
<div class="src">Estudio de mercado de Meridiano Capital del 07/11/2026 (CDE-MICROCENTRO-2026-11-07) y prensa: Última Hora, La Nación, Noticde. Precios pedidos; disponibilidad no confirmada. Vacancia del microcentro: sin dato publicado.</div>''', num()))

# 05 SUPERFICIES Y VALOR
S.append(slide(f'''{head('Superficies y valor', '900 m² de terreno pasante y 1.572 m² construidos')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:84px;height:320px"><span style="font-size:15px;line-height:1.2;text-align:center">900<br>m²</span></div><div class="dimr">60 m<br>de fondo</div><div class="dimb" style="top:342px">15 m de frente</div></div>
{kgrid([('USD ' + n(P / M['TERRENO']), 'Por m² de terreno'), ('USD ' + n(P / M['M2']), 'Por m² construido'), (usd(SUELO_RES), 'Suelo implícito si la construcción se valúa a costo nuevo'), ('USD ' + n(SUELO_RES / M['TERRENO']), 'Suelo implícito por m²')], 'kgrid k2')}</div></div>
<div>{crit('Cómo leer el precio', [('El suelo es el activo', f'Aun valuando los 1.572 m² a costo de construcción nueva (USD 450/m², {usd(M["M2"] * 450)}), más de dos tercios del precio corresponden al suelo.'), ('Comparable', 'Otro edificio comercial del microcentro, de 1.561 m², se publica en USD 2.000.000: unos USD 1.281 por m² construido, frente a USD 1.590 de esta galería.'), ('Superficie a confirmar', 'El aviso indica 1.572 m² construidos y, en otro texto, 1.590 m²: se aclara con planos y mensura.'), ('Lectura', 'La renta sola no justifica el precio; lo justifican el suelo, el doble frente y lo que se pueda construir.')])}</div></div>
<div class="src">Superficies según el aviso; sin planos ni mensura verificados. Costo de construcción: tabla de Meridiano Capital. Precios de comparables: pedidos, no de cierre.</div>''', num()))

# 06 EL EDIFICIO HOY
lv = [(['Planta baja', 'Galería de calle a calle con pasillo central y locales a ambos lados, hoy ocupados por una casa textil'], ''),
      (['Planta alta', 'Salones comerciales con acceso por escalera; iluminación cenital'], ''), (['Frentes', '15 m sobre la Av. San Blas y salida a Camilo Recalde'], '')]
ft = [('Estado', 'En uso y, según el aviso, en buen estado; a verificar en una inspección técnica.'), ('Ocupación', 'Funciona una casa de venta textil: contrato, canon y plazo a confirmar.'),
      ('Accesos', 'Escaleras; sin ascensor ni escalera mecánica a la vista en las fotos.'), ('Potencial', 'Locales a la calle por los dos frentes y pisos superiores, sujetos a normativa y estructura.')]
S.append(slide(f'''{head('El edificio hoy', 'Una galería en funcionamiento, de calle a calle')}
<div class="two d10">{table(['Nivel', 'Descripción'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Si la casa textil es inquilina, su contrato define la renta del primer período y la posibilidad de reconvertir la galería: es el primer dato a pedir antes de ofertar.</p>''', num()))

# 07 FOTOS AÉREAS
S.append(slide(f'''{head('Recorrido fotográfico', 'El lote desde el aire')}
<div class="ph"><figure style="width:560px"><img src="img/aerea_calles.jpg" style="height:412px;object-position:50% 40%"><figcaption>De la Av. San Blas a Camilo Recalde</figcaption></figure>
<figure style="width:300px"><img src="img/aerea_900.jpg" style="height:412px;object-position:50% 55%"><figcaption>Techos de la galería sobre la avenida</figcaption></figure></div>''', num(), dark=True))

# 08 FOTOS INTERIOR
S.append(slide(f'''{head('Recorrido fotográfico', 'La galería por dentro')}
<div class="ph"><figure style="width:560px"><img src="img/interior.jpg" style="height:412px"><figcaption>Pasillo central y locales en uso</figcaption></figure>
<figure style="width:220px"><img src="img/pasillo.jpg" style="height:412px"><figcaption>Pasillo de calle a calle</figcaption></figure>
<figure style="width:220px"><img src="img/escalera.jpg" style="height:412px"><figcaption>Escalera a la planta alta</figcaption></figure></div>''', num(), dark=True))

# 09 OPCIONES
def card(a, rows, gold=False):
    return f'<div><div class="altt{" gold" if gold else ""}">{ALT[a]}</div>{table(["", ""], rows, "t nohead sm")}</div>'
rA = [(['Programa', f'Galería subdividida en locales: {n(M["RENT"]["PB"])} m² alquilables en PB y {n(M["RENT"]["PA"])} m² en planta alta (60% de lo construido)'], ''),
      (['Obra', 'Divisiones, vidrieras a las dos calles, instalaciones por local, sanitarios y climatización del pasillo'], ''), (['Costo', f'USD {n(M["REFAC_RATE"])}/m² sobre 1.572 m² (50% de la tabla básica de remodelación)'], 'b')]
rB = [(['Programa', 'El edificio completo, alquilado a un solo operador: casa textil, mayorista o cadena'], ''), (['Obra', 'Mantenimiento y adecuación mínima; la operación la asume el inquilino'], ''), (['Costo', usd(cx['B']['obra']) + ' (supuesto)'], 'b')]
rC = [(['Programa', f'La galería de A más 3 pisos de oficinas corporativas ({n(M["OF_NEW_M2"])} m², {n(M["OF_RENT_M2"])} m² alquilables) con acceso propio'], ''),
      (['Obra', 'Refacción de la galería, estructura nueva o reforzada, 2 ascensores y oficinas con vidrio DVH'], ''), (['Costo', f'USD {M["OF_NEW_RATE"]}/m² + 15% de refuerzo estructural en las oficinas'], 'b')]
S.append(slide(f'''{head('Opciones de renta', 'Tres caminos para poner la galería en renta')}
<div class="two alt3">{card('A', rA, True)}{card('B', rB)}{card('C', rC)}</div>
<p class="note2"><b>Cómo se comparan.</b> A maximiza el canon por m² con muchos locales chicos, a cambio de más gestión y vacancia. B es la más simple: un contrato, poca obra y menos vacancia, con un canon por m² más bajo. C suma oficinas corporativas para la demanda de empresas que llegan a Alto Paraná: la que más renta genera, pero también la que más capital, plazo y permisos exige. Los programas son preliminares y deben validarse con un arquitecto, un ingeniero estructural y la Municipalidad.</p>''', num()))

# 10 OBRA
def cxrows(a):
    c = cx[a]
    rows = []
    if a == 'C':
        rows += [(['Refacción de la galería', usd(c['refac'])], ''), (['Oficinas nuevas con refuerzo', usd(c['nueva'])], ''), (['Ascensores (supuesto)', usd(c['ascensores'])], '')]
    else:
        rows += [(['Obra', usd(c['refac'])], '')]
    return rows + [(['Imprevistos (10%)', usd(c['imprev'])], ''), (['Obra total', usd(c['total'])], 'b'), (['Inversión total', usd(c['total'] + P)], 'tot')]
S.append(slide(f'''{head('Costo de la obra', 'Inversión total por opción, con el precio de USD 2.500.000')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "A" else ""}">{ALT[a]}</div>{table(["Concepto", "USD"], cxrows(a), "t big")}</div>' for a in 'ABC')}</div>
<p class="note2 sm"><b>Criterios.</b> Tabla de Meridiano Capital: remodelación básica (USD 350/m²) al 50% por tratarse de un edificio en uso y, según el aviso, en buen estado; edificio en altura estándar con vidrio DVH (USD 750/m²) para las oficinas, más 15% de refuerzo estructural. Imprevistos: 10%. Plazos supuestos: 12 meses en A y 24 meses en C. Sin presupuesto sobre el edificio real. Excluye gastos de adquisición y comisiones.</p>''', num()))

# 11 INGRESOS
def inc_rows(a):
    alt = M[a]['alt']
    return [([l, d, usd(c), gs(c * TC)], '') for l, d, c in alt['lines']] + [(['Total', '', usd(alt['mes']), gs(alt['mes'] * TC)], 'tot')]
sup = [('Locales en PB', f"USD {n(M['PB_RATE'])}/m²: entre un salón premium del centro (USD 18/m²) y el techo de las galerías del microcentro (USD 50/m²)."),
       ('Planta alta', f"USD {n(M['PA_RATE'])}/m²: menos tránsito; como los salones grandes (USD 7–10/m²)."),
       ('Un operador', f"USD {n(M['BLOQUE_RATE'])}/m² sobre todo el edificio: banda de salones grandes."),
       ('Oficinas', f"USD {n(M['OF_RATE'])}/m²: oficinas publicadas en CDE entre USD 8 y 12/m².")]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual en dólares tras la obra')}
<div class="two cx2 cmp"><div><div class="altt gold">{ALT['A']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('A'), 't xs')}
<div class="altt" style="margin-top:8px">{ALT['B']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('B'), 't xs')}
<div class="altt" style="margin-top:8px">{ALT['C']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('C'), 't xs')}</div>
{crit('Base de mercado (estudio 07/11/2026)', sup)}</div>''', num()))

# 12 REFERENCIAS
rc = [('C1', 'Salón en esquina, casi Av. San Blas', 'Microcentro', '75 m²', 'USD 700', '9,3'), ('C2', 'Salón céntrico premium', 'Centro', '75 m²', 'USD 1.350', '18,0'),
      ('L1', 'Salón comercial', 'CDE', '150 m²', 'USD 1.500', '10,0'), ('L2', 'Salón comercial', 'Lago y Los Aztecas', '280 m²', 'USD 2.000', '7,1'),
      ('O1', 'Oficina corporativa con vista al puente', 'CDE', '149 m²', 'USD 1.800', '12,1'), ('O2', 'Oficina amoblada', 'CDE', '252 m²', 'USD 2.100', '8,3'),
      ('O3', 'Oficina en edificio corporativo', 'Supercarretera', '139 m²', 'USD 1.300', '9,4'), ('V1', 'Edificio comercial (venta)', 'Microcentro', '1.561 m²', 'USD 2.000.000', '1.281 por m²')]
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres y ventas publicados en Ciudad del Este')}
{table(['ID', 'Tipología', 'Ubicación anunciada', 'Superficie', 'Precio', 'USD/m²'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Bandas observadas.</b> Salones grandes USD 7–10/m² · salones chicos y premium USD 9–18/m² · galerías del microcentro hasta USD 50/m² (Última Hora, octubre de 2026) · oficinas USD 8–12/m². Una oficina de 102 m² en el microcentro a USD 5.000 (USD 49/m²) se excluyó por atípica.</p>
<div class="src">Estudios de mercado de Meridiano Capital del 07/11/2026 (CDE-MICROCENTRO y CDE-CATEDRAL) en InfoCasas, RE/MAX, Inmobiliaria.com, MercadoProp e Inova Inmobiliaria. Precios pedidos, no contratos ni cierres; disponibilidad no confirmada.</div>''', num()))

# 13 INGRESOS Y EGRESOS
def er(a):
    e, alt = ev[a], M[a]['alt']
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), (['IVA', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', '8,0%', '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "A" else ""}">{ALT[a]}</div>{table(["Concepto", "%", "USD/año"], er(a), "t sm ie")}</div>' for a in 'ABC')}</div>
<p class="note2 sm">IVA: 10% en alquiler comercial. Vacancia (supuesto): 15% en locales de galería y oficinas nuevas, 5% con un solo operador. Gastos fijos: supuesto de USD 12.000 por año; las expensas comunes se cobran a los inquilinos. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', num()))

# 14 RENTABILIDAD
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{" gold" if a == "A" else ""}">{ALT[a]}</div>' for a in 'ABC')
def rowr(lbl, key, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{usd(ev[a]["inv"]) if key == "inv" else pct(ev[a][key])}</div>' for a in 'ABC')
S.append(slide(f'''{head('Rentabilidad estimada', 'Tres opciones de renta a USD 2.500.000')}<div class="rule"></div>
<div class="rg4" style="grid-template-columns:250px repeat(3,1fr)">{hdr}{rowr('Bruta sobre inversión total', 'bruta', 'bigv m4')}{rowr('Neta antes de IRE', 'neta_pre', 'midv')}{rowr('Neta final', 'neta', 'midv')}{rowr('Inversión total', 'inv', 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> El denominador es el precio más la obra de cada opción, sin gastos de adquisición. Son estimaciones con alquileres pedidos del mercado: no hay contratos verificados que las respalden. La renta de una galería del microcentro rinde moderado sobre un precio que es, sobre todo, suelo; la tesis de inversión combina renta y valor del suelo. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 15 SENSIBILIDAD
def srow(a, f):
    lbl = f'{ALT[a].split(" · ")[1]} · obra {"de tabla" if f == 1.0 else "+25%"}'
    return ([lbl] + [pct(M['sens'][f'{a}|{f}|{k}'][0]) + ' · ' + pct(M['sens'][f'{a}|{f}|{k}'][1]) for k in ('0.85', '1.0', '1.15')], 'b' if f == 1.0 else '')
srows = [srow(a, f) for a in 'ABC' for f in (1.0, 1.25)]
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: alquiler y costo de obra')}
<div class="two cx2"><div><div class="altt">Bruta · neta final sobre inversión total, compra a USD 2.500.000</div>{table(['Opción y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], srows, 't big')}</div>
{crit('Lectura', [('El alquiler', 'Es la palanca principal: un 15% más o menos mueve la bruta alrededor de un punto en cada opción.'), ('La obra', 'Pesa sobre todo en C: si cuesta un 25% más, la bruta de C cae cerca de un punto.'), ('Canon de PB', f"Para que A llegue a 8% bruto, los locales de PB deberían alquilarse a USD {n(M['req_pb8'], 1)}/m² por mes."), ('Antes de ofertar', 'Contrato de la ocupación actual, presupuesto de obra y verificación estructural.')])}</div>''', num()))

# 16 TIR
pr = M['proj']
bt = max('ABC', key=lambda a: pr[a]['Base']['tir'])
trows = [([ALT[a]] + [pct(pr[a][k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [usd(pr[a]['Base']['total'])], 'b' if a == bt else '') for a in 'ABC']
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años por opción')}
<div class="two d15">{table(['Opción · compra a USD 2.500.000', 'Conservador', 'Base', 'Optimista', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr[bt]['Base']['tir'], 1)}</div><div class="bs">TIR base de {ALT[bt].split(' · ')[1].lower()}: la más alta de las tres</div><p>B renta desde el primer año; A tiene un año de obra; C, dos (la galería renta desde el segundo). Venta al valor estimado del año 5. Escenarios: alquileres +2/+3/+5% y valorización 2/3,5/5% anual.</p><p class="gold">Supuesto clave: el valor del inmueble parte de la inversión total y se valoriza desde el fin de la obra.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. Ganancia base = plusvalía − IVA de la venta futura (1,5%) + renta neta acumulada. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 17 PRECIO
info = [('Activo', 'Galería de 2 niveles y 1.572 m² construidos sobre 900 m² de terreno pasante, con frentes a la Av. San Blas y a Camilo Recalde.'),
        ('Ocupación', 'Funciona una casa de venta textil; contrato y canon a confirmar.'),
        ('Potencial', 'Locales por los dos frentes y desarrollo en altura, sujetos a normativa y estructura.'),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del inmueble completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">{usd(P)}</div><div class="bs">Precio de venta · {gs(P * TC)}</div><p>Precio y alquileres en dólares; los guaraníes son referenciales, al {TCTXT}.</p><div class="dfoot">Neta final: A {pct(ev['A']['neta'])} · B {pct(ev['B']['neta'])} · C {pct(ev['C']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 18 PROCESO
steps = [('Visita e inspección', 'Recorrido con inspección técnica de estructura, cubiertas, instalaciones y capacidad para crecer en altura.'), ('Ocupación y proyecto', 'Revisión del contrato de la casa textil, anteproyecto de la opción elegida y presupuesto de obra.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, mensura, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la obra con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de los locales u oficinas, contratos y administración de la galería, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 19 CONSIDERACIONES
rk = [('Rentabilidad sobre el precio', 'Con la obra incluida, las netas estimadas quedan muy por debajo del 10% de referencia de Meridiano: la tesis es suelo y ubicación, con renta moderada.'),
      ('Ocupación actual', 'Contrato, canon y plazo de la casa textil sin verificar: pueden limitar la reconversión o asegurar renta desde el día uno.'),
      ('Comercio de frontera', 'La renta depende del flujo de compradores de Brasil; el nuevo control de compras brasileño es un riesgo a seguir.'),
      ('Obra y normativa', 'Sin presupuesto ni verificación estructural; en C, altura, FOS y FOT según el Plan Regulador de Ciudad del Este.'),
      ('Superficies', '1.572 m² o 1.590 m² construidos según el texto del aviso: aclarar con planos y mensura.'),
      ('Liquidez', 'Un activo de USD 2,5 M tiene pocos compradores: la salida puede tomar más tiempo que una unidad residencial.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar antes de ofertar')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 20 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita a la galería</h2>
<p class="cp">Recorremos la galería con una inspección técnica, revisamos la ocupación actual, preparamos el anteproyecto y el presupuesto de la opción que elija, y lo acompañamos en la compra, la obra y la administración.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Galería comercial en Ciudad del Este</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
