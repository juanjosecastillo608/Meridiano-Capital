import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; P = M['PRICES']['pedido']; PR = M['PRICES']['rapida']; cx = M['cx']
ev = {a: M[a]['ev']['pedido'] for a in 'ABC'}
evr = {a: M[a]['ev']['rapida'] for a in 'ABC'}
ACM = M['acm']

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
ALT = {'A': 'A · Galería de locales', 'B': 'B · Shopping con operador', 'C': 'C · Galería y oficinas'}
def mill(x): return 'USD ' + n(x / 1e6, 2) + ' M'


num()
# 01 PORTADA
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Galería comercial de calle a calle · en venta</div>
<h1>Galería<br>San Blas</h1>
<div class="addr">Av. San Blas 519 y Camilo Recalde · Microcentro de Ciudad del Este</div>
<div class="cvk"><div><div class="v" style="font-size:30px;white-space:nowrap">{usd(P)}</div><div class="l">Precio de venta · venta rápida {usd(PR)}</div></div>
<div><div class="v">900 m²</div><div class="l">De terreno, 15 × 60 m, con 1.572 m² construidos</div></div></div>
<div class="cf">Doble frente · A 650 m del Puente de la Amistad según el aviso · Tres opciones de renta · {tc_corto()}</div></div>
<div class="cr"><img src="img/aerea_calles.jpg" style="object-position:50% 45%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Un lote pasante en el corazón del comercio de frontera')}
<p class="lead">Galería comercial de dos niveles que une la Av. San Blas con la calle Camilo Recalde, en el microcentro de Ciudad del Este. Hoy la ocupa la casa textil del propietario. Se analiza su valor de mercado y tres formas de ponerla en renta, a dos precios: el de venta y el de venta rápida.</p>
{kgrid([(usd(P), 'Precio de venta'), (usd(PR), 'Precio de venta rápida (−32%)'), (mill(ACM['rango'][0]) + ' – ' + n(ACM['rango'][1] / 1e6, 2) + ' M', 'Rango de valor de mercado estimado (lámina 6)'), ('900 · 1.572 m²', 'Terreno · construidos en 2 niveles'),
        (pct(ev['A']['neta']) + ' · ' + pct(evr['A']['neta']), 'A · Galería de locales: neta a cada precio'), (pct(ev['B']['neta']) + ' · ' + pct(evr['B']['neta']), 'B · Shopping con operador: neta a cada precio'),
        (pct(ev['C']['neta']) + ' · ' + pct(evr['C']['neta']), 'C · Galería y oficinas: neta a cada precio'), (pct(M['ruta'][-1]['pedido'][0]) + ' · ' + pct(M['ruta'][-1]['rapida'][0]), 'C ajustada: bruta a cada precio (lámina 20)')], 'kgrid ks')}
<div class="box">Rentabilidades sobre el precio más la obra de cada opción, con alquileres del estudio de mercado de Meridiano Capital, en dólares · Sin renta actual: la casa textil es del propietario · Tipo de cambio {TCTXT}</div>''', num()))

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
<div class="src">Estudio de mercado de Meridiano Capital (CDE-MICROCENTRO, 07–08/11/2026) y prensa: Última Hora, La Nación, Noticde. Precios pedidos; disponibilidad no confirmada. Vacancia del microcentro: sin dato publicado.</div>''', num()))

# 05 SUPERFICIES
S.append(slide(f'''{head('Superficies', '900 m² de terreno pasante y 1.572 m² construidos')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:84px;height:320px"><span style="font-size:15px;line-height:1.2;text-align:center">900<br>m²</span></div><div class="dimr">60 m<br>de fondo</div><div class="dimb" style="top:342px">15 m de frente</div></div>
{kgrid([('USD ' + n(P / M['TERRENO']) + ' · ' + n(PR / M['TERRENO']), 'Por m² de terreno, a cada precio'), ('USD ' + n(P / M['M2']) + ' · ' + n(PR / M['M2']), 'Por m² construido, a cada precio'), ('2 niveles', 'PB de calle a calle y planta alta'), ('2 frentes', 'Av. San Blas y Camilo Recalde')], 'kgrid k2')}</div></div>
<div>{crit('El inmueble', [('Terreno', '900 m² (15 × 60 m) que atraviesan la manzana: vidriera y acceso por dos calles.'), ('Construcción', '1.572 m² en dos niveles, confirmados por el propietario; galería con pasillo central e iluminación cenital.'), ('Ocupación', 'La casa textil que funciona hoy es del propietario: no hay contrato de alquiler que limite el uso.'), ('Potencial', 'Locales por los dos frentes y crecimiento en altura, sujetos a normativa y estructura.')])}</div></div>
<div class="src">Superficies según el aviso y el propietario; planos y mensura a verificar.</div>''', num()))

# 06 ACM
acm = ACM
mrows = [(['Comparables de venta', f"Edificio comercial del microcentro a USD {n(acm['comp_m2'])}/m² construido, −5% de negociación y +10% por doble frente", mill(acm['comp'][0]) + ' – ' + n(acm['comp'][1] / 1e6, 2) + ' M'], ''),
         (['Costo de reposición', f"Suelo a USD {n(acm['suelo'][0])}–{n(acm['suelo'][1])}/m² + construcción a USD 450/m² depreciada entre 35% y 45%", mill(acm['cost'][0]) + ' – ' + n(acm['cost'][1] / 1e6, 2) + ' M'], ''),
         (['Capitalización de renta', f"Resultado antes de IRE de A y B, capitalizado al {pct(acm['cap'][1], 1)}–{pct(acm['cap'][0], 1)}, menos la obra", mill(acm['inc'][0]) + ' – ' + n(acm['inc'][1] / 1e6, 2) + ' M'], ''),
         (['Rango de referencia', 'Del techo del costo de reposición al piso de los comparables', mill(acm['rango'][0]) + ' – ' + n(acm['rango'][1] / 1e6, 2) + ' M'], 'tot')]
S.append(slide(f'''{head('Análisis comparativo de mercado', '¿Cuánto vale la galería? Tres métodos')}
<div class="two cx2"><div>{table(['Método', 'Base', 'Valor estimado'], mrows, 't big')}
<p class="note2 sm">Los comparables son precios pedidos y tienden a sobrestimar; el costo de reposición no captura toda la prima de ubicación; la capitalización muestra cuánto vale la galería solo por su renta. El rango de referencia combina los dos primeros.</p></div>
<div class="dbox"><div class="bs">Precio de venta</div><div class="bigv bv2" style="font-size:40px">{usd(P)}</div><div class="bs">{pct(P / acm['rango'][1] - 1, 0)} sobre el techo del rango</div><div class="bs" style="margin-top:18px">Venta rápida</div><div class="bigv bv2" style="font-size:40px">{usd(PR)}</div><div class="bs">Dentro del rango de referencia</div><p class="gold">La venta rápida de USD 1.700.000 está respaldada por el mercado; el precio de USD 2.500.000 se apoya en el potencial de desarrollo más que en los comparables.</p></div></div>
<div class="src">Estimación de referencia de Meridiano Capital, no una tasación de perito matriculado. Suelo, depreciación y tasas de capitalización son supuestos explicados en la lámina 7.</div>''', num()))

# 07 COMPARABLES DE VENTA
vc = [('V2', 'Edificio comercial', 'Microcentro', '1.561 m² construidos', 'USD 2.000.000', 'USD 1.281 por m² construido'),
      ('V4', 'Edificio de renta', 'Pablo Rojas', '3.727 m² útiles · 529 m² terreno', 'USD 1.800.000', 'USD 483 por m² útil'),
      ('T1', 'Terreno en esquina', 'Microcentro', '463 m²', 'USD 250.000', 'USD 540 por m²'),
      ('T2', 'Terreno', 'Barrio Catedral, cerca del centro', '1.200 m²', 'USD 1.100.000', 'USD 917 por m²'),
      ('T3', 'Terreno', 'Área 2, a metros del microcentro', '484 m²', 'USD 135.000', 'USD 279 por m²')]
S.append(slide(f'''{head('Comparables de venta', 'Edificios y terrenos publicados en Ciudad del Este')}
{table(['ID', 'Tipología', 'Ubicación anunciada', 'Superficie', 'Precio pedido', 'Valor unitario'], [(list(r), '') for r in vc], 't sm refs')}
<div class="two" style="grid-template-columns:1fr 1fr !important;gap:30px;margin-top:18px">{crit('Supuestos del análisis', [('Suelo', f"USD {n(acm['suelo'][0])}–{n(acm['suelo'][1])}/m²: por encima de T1 y en línea con T2, por el frente a la Av. San Blas y el lote pasante."), ('Construcción', 'USD 450/m² nueva (tabla de Meridiano), depreciada 35–45%.'), ('Capitalización', f"{pct(acm['cap'][1], 1)}–{pct(acm['cap'][0], 1)} para renta comercial en CDE.")])}
{crit('Lectura', [('Por m² construido', f'La galería pide USD {n(P / M["M2"])}; el comparable más parecido, USD 1.281. A la venta rápida, USD {n(PR / M["M2"])}.'), ('Muestra chica', 'Pocos edificios comerciales publicados en el microcentro; precios pedidos, no de cierre. Antes de cerrar: tasación de un perito matriculado.')])}</div>
<div class="src">Estudio CDE-MICROCENTRO-2026-11-07 (consultas del 07 y 08/11/2026) en InfoCasas, Inova Inmobiliaria, Funhome, Plano Inmobiliaria y MercadoProp. V3 (USD 20 M en la rotonda Oasis) se excluyó por datos no verificables.</div>''', num()))

# 08 EL EDIFICIO HOY
lv = [(['Planta baja', 'Galería de calle a calle con pasillo central y locales a ambos lados, hoy usados por la casa textil del propietario'], ''),
      (['Planta alta', 'Salones comerciales con acceso por escalera doble; iluminación cenital'], ''), (['Frentes', '15 m sobre la Av. San Blas y salida a Camilo Recalde'], '')]
ft = [('Estado', 'En uso y, según el aviso, en buen estado; a verificar en una inspección técnica.'), ('Ocupación', 'La casa textil es del propietario: sin contrato de alquiler; la fecha de entrega se acuerda en la negociación.'),
      ('Accesos', 'Escaleras; sin ascensor ni escalera mecánica a la vista en las fotos.'), ('Superficie', '1.572 m² construidos, confirmados por el propietario.')]
S.append(slide(f'''{head('El edificio hoy', 'Una galería en funcionamiento, de calle a calle')}
<div class="two d10">{table(['Nivel', 'Descripción'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Al no haber inquilinos, el comprador puede reconvertir la galería desde el primer día, sin esperar el vencimiento de contratos.</p>''', num()))

# 09 FOTOS AÉREAS
S.append(slide(f'''{head('Recorrido fotográfico', 'El lote desde el aire')}
<div class="ph"><figure style="width:330px"><img src="img/aerea_900.jpg" style="height:412px;object-position:50% 45%"><figcaption>Techos de la galería: 900 m² de terreno</figcaption></figure>
<figure style="width:400px"><img src="img/aerea_calles.jpg" style="height:412px;object-position:50% 40%"><figcaption>De la Av. San Blas a Camilo Recalde</figcaption></figure>
<figure style="width:290px"><img src="img/aerea_avenida.jpg" style="height:412px;object-position:50% 40%"><figcaption>Frente sobre la Av. San Blas</figcaption></figure></div>''', num(), dark=True))

# 10 FOTOS INTERIOR
S.append(slide(f'''{head('Recorrido fotográfico', 'La galería por dentro')}
<div class="ph"><figure style="width:500px"><img src="img/interior2.jpg" style="height:412px"><figcaption>Pasillo central con locales a ambos lados</figcaption></figure>
<figure style="width:300px"><img src="img/escalera2.jpg" style="height:412px;object-position:50% 50%"><figcaption>Escalera doble a la planta alta</figcaption></figure>
<figure style="width:220px"><img src="img/pasillo.jpg" style="height:412px"><figcaption>Pasillo de calle a calle</figcaption></figure></div>''', num(), dark=True))

# 10b FOTOS LOCALES
S.append(slide(f'''{head('Recorrido fotográfico', 'Locales, vidrieras y accesos')}
<div class="ph"><figure style="width:430px"><img src="img/acceso.jpg" style="height:412px"><figcaption>Acceso con locales a ambos lados</figcaption></figure>
<figure style="width:360px"><img src="img/local_vidriera.jpg" style="height:412px;object-position:60% 50%"><figcaption>Local con vidriera sobre el pasillo</figcaption></figure>
<figure style="width:220px"><img src="img/pasillo2.jpg" style="height:412px"><figcaption>Pasillo y locales con cortina</figcaption></figure></div>''', num(), dark=True))

# 11 OPCIONES
def card(a, rows, gold=False):
    return f'<div><div class="altt{" gold" if gold else ""}">{ALT[a]}</div>{table(["", ""], rows, "t nohead sm")}</div>'
rA = [(['Programa', f'Galería subdividida en locales que alquila el propietario: {n(M["NIV"]["PB"] * M["EFF_A"])} m² en PB y {n(M["NIV"]["PA"] * M["EFF_A"])} m² en planta alta'], ''),
      (['Obra', 'Divisiones, vidrieras a las dos calles e instalaciones por local'], ''), (['Costo', f'USD {n(M["REFAC_RATE"])}/m² (50% de la tabla básica de remodelación)'], 'b')]
rB = [(['Programa', 'Shopping con un solo operador que lo alquila entero y subalquila: cafetería, restaurante y locales de importados (electrónica, indumentaria)'], ''),
      (['Obra', 'Conversión a shopping, escalera mecánica o ascensor e instalaciones gastronómicas'], ''), (['Costo', f'USD {n(M["CONV_RATE"], 1)}/m² + USD 120.000 en accesos y gastronomía'], 'b')]
rC = [(['Programa', 'La galería de A más 3 pisos de oficinas corporativas (1.800 m²) con acceso propio'], ''),
      (['Obra', 'Refacción de la galería, estructura nueva o reforzada, 2 ascensores y oficinas con vidrio DVH'], ''), (['Costo', 'USD 750/m² + 15% de refuerzo en las oficinas'], 'b')]
S.append(slide(f'''{head('Opciones de renta', 'Tres caminos para poner la galería en renta')}
<div class="two alt3">{card('A', rA)}{card('B', rB, True)}{card('C', rC)}</div>
<p class="note2"><b>Cómo se comparan.</b> A deja la gestión de muchos locales en manos del propietario. B traslada la operación a un solo operador con contrato largo: menos gestión y menos vacancia para el propietario, a cambio de compartir la renta de los subalquileres. C suma oficinas corporativas: más renta, pero también más capital, plazo y permisos. Programas preliminares, a validar con arquitecto, ingeniero estructural y Municipalidad.</p>''', num()))

# 12 SHOPPING
sub = M['sublet']
srows = [([l, d, usd(c)], '') for l, d, c in sub] + [(['Facturación del operador', '', usd(M['sublet_total'])], 'b'), ([f"Alquiler maestro al propietario ({int(M['SHARE'] * 100)}%)", 'Contrato largo con ajuste anual', usd(M['B']['alt']['mes'])], 'tot')]
S.append(slide(f'''{head('Opción B en detalle', 'Shopping con un operador único que subalquila')}
<div class="two cx2"><div><div class="altt gold">Cómo se forma la renta del propietario (USD por mes)</div>{table(['Concepto', 'Detalle', 'USD por mes'], srows, 't big')}
<p class="note2 sm">Subalquiler supuesto en PB a USD {n(M['PB_B'])}/m², por encima de una galería común, por las anclas gastronómicas y los importados; planta alta a USD {n(M['PA_B'])}/m² con el patio de comidas como atractivo. El {100 - int(M['SHARE'] * 100)}% restante cubre la vacancia, la gestión, el marketing y el margen del operador.</p></div>
{crit('Reparto de roles', [('Propietario', 'Hace la conversión base (accesos, sanitarios, gastronomía, fachadas) y cobra un alquiler maestro con vacancia baja.'), ('Operador', 'Equipa, comercializa y administra: cafetería, restaurante y locales de electrónica e indumentaria importada.'), ('Contrato', 'Plazo largo (8 a 10 años, supuesto), garantía y ajuste anual; carencia inicial a negociar.'), ('Riesgo clave', 'Depende de la solvencia del operador: se pide experiencia, garantías y un plan comercial.')])}</div>''', num()))

# 13 OBRA
def cxrows(a):
    c = cx[a]
    return [([l, usd(v)], '') for l, v in c['parts']] + [(['Imprevistos (10%)', usd(c['imprev'])], ''), (['Obra total', usd(c['total'])], 'b'),
            (['Inversión a ' + usd(P), usd(c['total'] + P)], 'tot'), (['Inversión a ' + usd(PR), usd(c['total'] + PR)], 'tot')]
S.append(slide(f'''{head('Costo de la obra', 'Inversión total por opción y precio de compra')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT[a]}</div>{table(["Concepto", "USD"], cxrows(a), "t big")}</div>' for a in 'ABC')}</div>
<p class="note2 sm"><b>Criterios.</b> Tabla de Meridiano Capital: remodelación básica (USD 350/m²) al 50% en A, por tratarse de un edificio en uso y en buen estado; locales comerciales estándar (USD 450/m²) al 75% para la conversión a shopping en B; edificio en altura con vidrio DVH (USD 750/m²) más 15% de refuerzo para las oficinas de C. Imprevistos: 10%. Plazos supuestos: 12 meses en A y B, 24 meses en C. Sin presupuesto sobre el edificio real.</p>''', num()))

# 14 INGRESOS
def inc_rows(a):
    alt = M[a]['alt']
    return [([l, d, usd(c), gs(c * TC)], '') for l, d, c in alt['lines']] + [(['Total', '', usd(alt['mes']), gs(alt['mes'] * TC)], 'tot')]
sup = [('Locales de galería', f"PB a USD {n(M['PB_A'])}/m² y planta alta a USD {n(M['PA_A'])}/m²: entre un salón premium del centro (USD 18) y el techo de las galerías del microcentro (USD 50)."),
       ('Shopping', f"Subalquiler a USD {n(M['PB_B'])} y {n(M['PA_B'])}/m²; el propietario cobra el {int(M['SHARE'] * 100)}%."),
       ('Oficinas', f"USD {n(M['OF_RATE'])}/m²: oficinas publicadas en CDE entre USD 8 y 12/m².")]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual del propietario, en dólares, tras la obra')}
<div class="two cx2 cmp"><div><div class="altt">{ALT['A']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('A'), 't xs')}
<div class="altt gold" style="margin-top:8px">{ALT['B']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('B'), 't xs')}
<div class="altt" style="margin-top:8px">{ALT['C']}</div>{table(['Concepto', 'Detalle', 'USD por mes', 'Gs'], inc_rows('C'), 't xs')}</div>
{crit('Base de mercado', sup)}</div>''', num()))

# 15 REFERENCIAS DE ALQUILER
rc = [('C1', 'Salón en esquina, casi Av. San Blas', 'Microcentro', '75 m²', 'USD 700', '9,3'), ('C2', 'Salón céntrico premium', 'Centro', '75 m²', 'USD 1.350', '18,0'),
      ('G1', 'Local gastronómico, Shopping Arena', 'Área 1', '50 m²', 'USD 440 + expensas', '8,8'), ('G2', 'Local comercial, Shopping Arena', 'Área 1', '72 m²', 'USD 635 + expensas', '8,8'),
      ('L1', 'Salón comercial', 'CDE', '150 m²', 'USD 1.500', '10,0'), ('L2', 'Salón comercial', 'Lago y Los Aztecas', '280 m²', 'USD 2.000', '7,1'),
      ('O1', 'Oficina corporativa con vista al puente', 'CDE', '149 m²', 'USD 1.800', '12,1'), ('O4', 'Oficina en edificio corporativo', 'Supercarretera', '139 m²', 'USD 1.300', '9,4')]
S.append(slide(f'''{head('Referencias de alquiler', 'Locales, shopping y oficinas publicados en Ciudad del Este')}
{table(['ID', 'Tipología', 'Ubicación anunciada', 'Superficie', 'Precio por mes', 'USD/m²'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Bandas observadas.</b> Salones grandes USD 7–10/m² · locales de shopping fuera del microcentro USD 9/m² más expensas · salones premium USD 18/m² · galerías del microcentro hasta USD 50/m² (Última Hora, octubre de 2026) · oficinas USD 8–12/m². Las rentas de A y B son supuestos dentro de la banda alta, por la ubicación sobre la Av. San Blas: es la variable que más pesa.</p>
<div class="src">Estudios de mercado de Meridiano Capital (CDE-MICROCENTRO y CDE-CATEDRAL) en InfoCasas, RE/MAX, Inova Inmobiliaria, Inmobiliaria.com y MercadoProp. Precios pedidos, no contratos; disponibilidad no confirmada.</div>''', num()))

# 16 INGRESOS Y EGRESOS
def er(a):
    e, alt = ev[a], M[a]['alt']
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), (['IVA', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', pct(e['adm'], 1), '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', pct(e['man'], 1), '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto del propietario')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT[a]}</div>{table(["Concepto", "%", "USD/año"], er(a), "t sm ie")}</div>' for a in 'ABC')}</div>
<p class="note2 sm">IVA: 10% en alquiler comercial. Vacancia (supuesto): 15% en locales de galería y oficinas; 3% en B, porque la vacancia de los subalquileres la absorbe el operador. En B el operador administra y mantiene: el propietario solo reserva 2% de control y 1% de mantenimiento estructural. Gastos fijos: USD 12.000 por año. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', num()))

# 17 RENTABILIDAD
cols = [(a, e[a], ' gold' if a == 'B' else '', lab) for a in 'ABC' for e, lab in ((ev, '2,5 M'), (evr, '1,7 M'))]
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{g}">{k} · USD {lab}</div>' for k, _, g, lab in cols)
def rowr(lbl, key, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{usd(e["inv"]) if key == "inv" else pct(e[key])}</div>' for _, e, _, _ in cols)
S.append(slide(f'''{head('Rentabilidad estimada', 'Tres opciones de renta a dos precios de compra')}<div class="rule"></div>
<div class="rg6">{hdr}{rowr('Bruta sobre inversión total', 'bruta', 'bigv m6')}{rowr('Neta antes de IRE', 'neta_pre', 'midv')}{rowr('Neta final', 'neta', 'midv')}{rowr('Inversión total', 'inv', 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> A = galería de locales; B = shopping con operador único; C = galería y oficinas. El denominador es el precio más la obra, sin gastos de adquisición. Son estimaciones con alquileres pedidos del mercado, sin contratos que las respalden. A la venta rápida de USD 1.700.000, la galería de locales llega a {pct(evr['A']['bruta'])} bruta. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 17b RUTA AL 10%
ru = M['ruta']; co = M['Copt']
rrows = [([('' if i == 0 else '+ ') + r['nombre'], usd(r['mes']), usd(r['obra']), pct(r['pedido'][0]) + ' · ' + pct(r['pedido'][1]), pct(r['rapida'][0]) + ' · ' + pct(r['rapida'][1])], 'tot' if i == len(ru) - 1 else ('b' if i == 0 else '')) for i, r in enumerate(ru)]
S.append(slide(f'''{head('Opción C ajustada', 'Cómo acercar la galería con oficinas al 10% bruto')}
<div class="two cx2"><div>{table(['Palanca (acumulada)', 'Alquiler mensual', 'Obra total', 'Bruta · neta a USD 2,5 M', 'Bruta · neta a USD 1,7 M'], rrows, 't big')}
<p class="note2 sm">Con las cuatro palancas, C llega a {pct(ru[-1]['pedido'][0])} bruta al precio de venta y a {pct(ru[-1]['rapida'][0])} a la venta rápida. Alcanza exactamente el 10% bruto con una compra de {usd(co['p10'])}. TIR base de C ajustada: {pct(co['proj']['pedido']['Base']['tir'], 1)} a USD 2,5 M y {pct(co['proj']['rapida']['Base']['tir'], 1)} a USD 1,7 M.</p></div>
{crit('Condiciones de cada palanca', [('Vidrieras a la calle', 'Abrir locales con frente a la Av. San Blas y a Camilo Recalde: 240 m² que se alquilan USD 8/m² por encima de los locales interiores.'), ('Cuarto piso', 'Sujeto al FOT del Plan Regulador y a que la estructura lo soporte: es la condición decisiva.'), ('Obra más eficiente', 'Oficinas estándar (USD 720/m²) con vidrio común y refuerzo de 10%, según el cálculo estructural.'), ('Canon de oficinas', 'USD 12/m²: techo de la banda publicada, para un edificio nuevo con ascensor y vista al puente.')])}</div>
<div class="src">Escenario optimista de Meridiano Capital: cada palanca es un supuesto a validar con arquitecto, ingeniero estructural, Municipalidad y sondeo de inquilinos. No es una rentabilidad garantizada.</div>''', num()))

# 18 SENSIBILIDAD
def srow(a, f):
    lbl = f'{ALT[a].split(" · ")[1]} · obra {"de tabla" if f == 1.0 else "+25%"}'
    return ([lbl] + [pct(M['sens'][f'{a}|{f}|{k}|rapida'][0]) + ' · ' + pct(M['sens'][f'{a}|{f}|{k}|rapida'][1]) for k in ('0.85', '1.0', '1.15')], 'b' if f == 1.0 else '')
srows = [srow(a, f) for a in 'ABC' for f in (1.0, 1.25)]
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: alquiler y costo de obra')}
<div class="two cx2"><div><div class="altt">Bruta · neta final sobre inversión total, compra a USD 1.700.000</div>{table(['Opción y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], srows, 't big')}</div>
{crit('Lectura', [('El alquiler', 'Es la palanca principal: un 15% más o menos mueve la bruta entre 1 y 1,5 puntos.'), ('La obra', 'Pesa sobre todo en C: si cuesta un 25% más, su bruta cae más de un punto.'), ('El precio', 'Pasar de USD 2.500.000 a 1.700.000 suma entre 1,7 y 2,7 puntos brutos según la opción.'), ('Antes de ofertar', 'Presupuesto de obra, verificación estructural y, en B, un operador con propuesta firme.')])}</div>''', num()))

# 19 TIR
pr = M['proj']
bt = max('ABC', key=lambda a: pr[a]['rapida']['Base']['tir'])
trows = [([ALT[a] + ' · ' + usd(M['PRICES'][p])] + [pct(pr[a][p][k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [usd(pr[a][p]['Base']['total'])], 'b' if p == 'rapida' else '') for a in 'ABC' for p in ('pedido', 'rapida')]
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años por opción')}
<div class="two d15">{table(['Opción · precio de compra', 'Conservador', 'Base', 'Optimista', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr[bt]['rapida']['Base']['tir'], 1)}</div><div class="bs">TIR base de {ALT[bt].split(' · ')[1].lower()} a USD 1.700.000: la más alta</div><p>A y B: un año de obra y cuatro de renta. C: dos años de obra (la galería renta desde el segundo). Venta al valor estimado del año 5. Escenarios: alquileres +2/+3/+5% y valorización 2/3,5/5% anual.</p><p class="gold">Supuesto clave: el valor del inmueble parte de la inversión total y se valoriza desde el fin de la obra.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. Ganancia base = plusvalía − IVA de la venta futura (1,5%) + renta neta acumulada. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 20 PRECIO
info = [('Activo', 'Galería de 2 niveles y 1.572 m² construidos sobre 900 m² de terreno pasante, con frentes a la Av. San Blas y a Camilo Recalde.'),
        ('Ocupación', 'La usa la casa textil del propietario; sin contratos de alquiler. Fecha de entrega a acordar.'),
        ('Venta rápida', f'{usd(PR)} (−32%): dentro del rango de valor de mercado estimado; escenario de cierre ágil.'),
        ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del inmueble completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">{usd(P)}</div><div class="bs">Precio de venta · {gs(P * TC)}</div><div class="bigv sm2">{usd(PR)}</div><div class="bs">Precio de venta rápida</div><p>Valor de mercado estimado: {mill(ACM['rango'][0])} a {n(ACM['rango'][1] / 1e6, 2)} M. Precios en dólares; los guaraníes son referenciales, al {TCTXT}.</p><div class="dfoot">Neta final a USD 1.700.000: A {pct(evr['A']['neta'])} · B {pct(evr['B']['neta'])} · C {pct(evr['C']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 21 PROCESO
steps = [('Visita e inspección', 'Recorrido con inspección técnica de estructura, cubiertas, instalaciones y capacidad para crecer en altura.'), ('Proyecto y operador', 'Anteproyecto de la opción elegida, presupuesto de obra y, en B, búsqueda del operador del shopping.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, mensura, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la obra con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Contratos con el operador o con cada inquilino, y administración del inmueble, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 22 CONSIDERACIONES
rk = [('Precio y valor', 'El precio de USD 2.500.000 está por encima del rango de valor estimado; la venta rápida de USD 1.700.000 está dentro.'),
      ('Rentabilidad', 'Las brutas de dos dígitos solo aparecen con la venta rápida o con la opción C ajustada; las netas quedan por debajo del 10% de referencia de Meridiano.'),
      ('Comercio de frontera', 'La renta depende del flujo de compradores de Brasil; el nuevo control de compras brasileño es un riesgo a seguir.'),
      ('Operador del shopping', 'B depende de encontrar un operador solvente y de su contrato: plazo, garantías y ajuste.'),
      ('Obra y normativa', 'Sin presupuesto ni verificación estructural; en C, altura, FOS y FOT según el Plan Regulador de Ciudad del Este.'),
      ('Liquidez', 'Un activo de este tamaño tiene pocos compradores: la salida puede tomar más tiempo.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar antes de ofertar')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. El análisis comparativo no reemplaza una tasación de perito matriculado. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 23 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita a la galería</h2>
<p class="cp">Recorremos la galería con una inspección técnica, preparamos el anteproyecto y el presupuesto de la opción que elija, buscamos el operador si opta por el shopping, y lo acompañamos en la compra, la obra y la administración.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Galería comercial en Ciudad del Este</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
