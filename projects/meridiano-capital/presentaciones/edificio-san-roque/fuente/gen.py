import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; P = M['PRICES']['pedido']; PR = M['PRICES']['rapida']
evr = {a: M[a]['ev']['rapida'] for a in 'ABC'}
cx = M['cx']
ev = {a: M[a]['ev']['pedido'] for a in 'ABC'}
BV = M['B_vend']['pedido']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(round(x, -3))
def gsm(x): return 'Gs ' + n(x / 1e6, 1) + ' M'

PROJ = 'Edificio San Roque'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
MAPS = 'https://maps.app.goo.gl/dc9bF3eS4CBVMc8h7'   # ubicación exacta enviada por el founder, 07/11/2026

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
ALT_NAMES = {'A': 'A · Local y oficinas', 'B': 'B · Local y departamentos', 'C': 'C · Clínica de consultorios'}
best = max('ABC', key=lambda a: ev[a]['neta'])

num()
# 01 PORTADA
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Edificio con salón comercial y potencial de ampliación · en venta</div>
<h1>Edificio<br>San Roque</h1>
<div class="addr">Luis Alberto de Herrera casi Brasil · San Roque, Asunción</div>
<div class="cvk"><div><div class="v">{usd(P)}</div><div class="l">Precio de venta · venta rápida {usd(PR)}</div></div>
<div><div class="v">499 m²</div><div class="l">Construidos sobre 585,80 m² de terreno</div></div></div>
<div class="cf">Cerca del Ministerio de Salud y de sanatorios · Tres opciones de renta · Potencial de ampliación · {tc_corto()}</div></div>
<div class="cr"><img src="img/fachada.jpg" style="object-position:47% 50%"></div></section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de tres niveles para terminar y poner en renta')}
<p class="lead">Edificio en el centro de Asunción, barrio San Roque, con salón comercial terminado en planta baja, dos plantas altas por terminar, terraza de 160 m² y estacionamiento con tinglado en el fondo del lote. Está cerca del Ministerio de Salud Pública y de varios sanatorios. Se analizan tres opciones de renta excluyentes entre sí (local y oficinas, local y departamentos, o clínica de consultorios médicos) a dos precios: el de venta y el de venta rápida.</p>
{kgrid([(usd(P), 'Precio de venta'), (usd(PR), 'Precio de venta rápida (−32%)'), ('499,4 m²', 'Construidos · terreno de 585,80 m²'), ('Hasta 5', 'Pisos posibles según el aviso, a verificar'),
        (pct(ev['A']['neta']) + ' · ' + pct(evr['A']['neta']), 'A · Local y oficinas: neta a USD 250.000 · 170.000'), (pct(ev['B']['neta']) + ' · ' + pct(evr['B']['neta']), 'B · Local y departamentos: neta a cada precio'),
        (pct(ev['C']['neta']) + ' · ' + pct(evr['C']['neta']), 'C · Clínica: neta a cada precio'), (pct(evr['B']['bruta']), 'Mejor bruta: B a USD 170.000')], 'kgrid ks')}
<div class="box">Rentabilidades sobre el precio más la obra para terminar el edificio, con alquileres del estudio de mercado de Meridiano Capital · Sin contratos de alquiler verificados · Tipo de cambio {TCTXT}</div>''', num()))

# 03 UBICACIÓN
loc = [('Dirección', 'Luis Alberto de Herrera casi Brasil, barrio San Roque, Asunción'), ('Zona', 'Centro de Asunción · barrio San Roque'),
       ('Entorno comercial', 'Zona de comercios y servicios del centro, con alto tránsito vehicular y peatonal'),
       ('Entorno de salud', 'Ministerio de Salud Pública, sobre la misma calle Brasil (Av. Pettirossi y Brasil), Sanatorio Adventista, Hospital Universitario Nuestra Señora de la Asunción y Sanatorio San Roque')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
pts = [('Frente', '9 m sobre Luis Alberto de Herrera, con salón comercial terminado'), ('Fondo', '69 m: estacionamiento para varios vehículos y tinglado de 60 m²'), ('Altura', '3 niveles construidos y terraza de 160 m²')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('Ubicación', 'Luis Alberto de Herrera casi Brasil, San Roque')}
<div class="two z"><div class="locr">{lh}<a class="glink" href="{MAPS}">Ubicación en Google Maps: {MAPS.replace("https://", "")}</a></div>
<div><div class="eb sm">El lote</div>{ph}<p class="note">Lote angosto y profundo, con acceso vehicular lateral: el fondo permite estacionamiento propio, poco habitual en el centro, y es la base del potencial de un segundo bloque.</p></div></div>
<div class="src">Dirección y enlace de ubicación confirmados por el founder el 07/11/2026; identificación catastral a confirmar. Direcciones del Ministerio y de los sanatorios según directorios públicos; distancias a pie a medir.</div>''', num()))

# 04 ZONA
zp = [('Demanda comercial', 'Salones de 200 a 600 m² sobre la Av. Eusebio Ayala se publican entre Gs 14.000 y 30.000 por m² por mes.'),
      ('Ministerio de Salud', 'Su sede atrae a diario a profesionales de la salud, proveedores, laboratorios y gestores con trámites de registro y habilitación.'),
      ('Demanda médica', 'San Roque concentra sanatorios y edificios de consultorios: hay oferta y demanda de consultorios en el barrio (K1).'),
      ]
zh = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(zp))
S.append(slide(f'''{head('La zona para el inversor', 'San Roque: comercio, salud y vivienda en el centro')}
<div class="two z"><div class="ztext"><p>San Roque es uno de los barrios centrales de Asunción, entre el microcentro y los ejes de las avenidas Eusebio Ayala y Mariscal López. El edificio está sobre Luis Alberto de Herrera casi Brasil, la calle que lleva a la sede del Ministerio de Salud. Combina comercio sobre avenida, oficinas y el polo de salud que forman el Ministerio de Salud Pública y los sanatorios del barrio.</p>
<p>Ese polo sostiene la demanda de consultorios y de oficinas para el sector salud; la vivienda de 2 dormitorios se alquila entre Gs 2,3 y 2,8 millones sin muebles. Por normativa, la clínica de consultorios no puede compartir el edificio con oficinas ni con viviendas: cada opción es un uso para todo el edificio.</p></div>
<div><div class="eb sm">Por qué importa para la renta</div>{zh}</div></div>
<div class="src">Estudio de mercado de Meridiano Capital del 07/11/2026 (ASU-SAN-ROQUE-2026-11-07) en InfoCasas, Amambay Propiedades, Century 21 y otros portales. Precios pedidos; disponibilidad no confirmada. Vacancia del barrio: sin dato publicado.</div>''', num()))

# 05 SUPERFICIES Y VALOR
S.append(slide(f'''{head('Superficies y valor', '585,80 m² de terreno y 499,4 m² construidos')}
<div class="two d5"><div><div class="sup2"><div class="lot"><div class="rect" style="width:74px;height:320px"><span style="font-size:15px;line-height:1.2;text-align:center">585,80<br>m²</span></div><div class="dimr">69 m<br>de fondo</div><div class="dimb" style="top:342px">9 m de frente</div></div>
{kgrid([('499,4 m²', 'Construidos en 3 niveles'), ('USD ' + n(P / M['M2']), 'Por m² construido'), ('USD ' + n(P / M['TERRENO']), 'Por m² de terreno'), (pct(P / M['nuevo'], 0), f'Del costo de construir hoy 499,4 m² ({usd(M["nuevo"])}, USD 650/m², sin terreno)')], 'kgrid k2')}</div></div>
<div>{crit('Cómo leer el precio', [('Terreno', 'Lote de 585,80 m² en el centro, con fondo libre: buena parte del valor está en el suelo y en lo que permita construir.'), ('Superficie a confirmar', '9 × 69 m da 621 m², no 585,80 m²: la diferencia se aclara con la mensura y el título.'), ('Potencial', 'El aviso indica que se puede edificar hasta 5 pisos; depende del Plan Regulador y de la estructura existente.'), ('Venta rápida', f'A {usd(PR)}: USD {n(PR / M["M2"])} por m² construido y {pct(PR / M["nuevo"], 0)} del costo de construir hoy la misma superficie.')])}</div></div>
<div class="src">Superficies según el aviso del inmueble; sin planos ni mensura verificados. Costo de construcción nueva: tabla de Meridiano Capital.</div>''', num()))

# 06 EL EDIFICIO HOY
lv = [(['Planta baja', 'Salón comercial con doble altura, entrepiso de oficina y baño, terminado. Al fondo, estacionamiento para varios vehículos y tinglado de 60 m²'], ''),
      (['Piso 1', 'Salón grande con baño, sin terminar'], ''), (['Piso 2', 'Salón grande con baño'], ''), (['Terraza', 'Losa de 160 m², base para ampliar'], '')]
ft = [('Estado', 'Planta baja terminada; plantas altas en obra gris o con terminación parcial, según las fotos.'), ('Estacionamiento', 'Propio, en el fondo del lote, con tinglado de 60 m².'),
      ('Renta', 'El aviso informa ingresos posibles; no hay contratos de alquiler verificados.'), ('Planos', 'Planos actuales y proyectados a revisar con el arquitecto.')]
S.append(slide(f'''{head('El edificio hoy', 'Planta baja terminada y dos plantas por terminar')}
<div class="two d10">{table(['Nivel', 'Estado según el aviso'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">El aviso dice que el piso 1 está sin terminar y, en otro texto, que tiene un departamento de 2 dormitorios: se toma el estado de las fotos, por terminar. A verificar en la inspección técnica.</p>''', num()))

# 07 FOTOS
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada y planta baja')}
<div class="ph"><figure style="width:560px"><img src="img/fachada.jpg" style="height:412px;object-position:47% 50%"><figcaption>Fachada sobre Luis Alberto de Herrera y acceso lateral al estacionamiento</figcaption></figure>
<figure style="width:450px"><img src="img/planta_baja.jpg" style="height:412px"><figcaption>Salón de planta baja con entrepiso · a verificar en la visita</figcaption></figure></div>''', num(), dark=True))
S.append(slide(f'''{head('Recorrido fotográfico', 'Fondo del lote y plantas altas')}
<div class="ph"><figure style="width:640px"><img src="img/tinglado.jpg" style="height:412px"><figcaption>Fondo del lote: estacionamiento y tinglado</figcaption></figure>
<figure style="width:370px"><img src="img/interior.jpg" style="height:412px;object-position:50% 55%"><figcaption>Planta alta por terminar</figcaption></figure></div>''', num(), dark=True))


# 09 ALTERNATIVAS
def alt_card(a, rows, gold=False):
    return f'<div><div class="altt{" gold" if gold else ""}">{ALT_NAMES[a]}</div>{table(["", ""], rows, "t nohead sm")}</div>'
rA = [(['Programa', f'Salón en PB y oficinas en los pisos 1 y 2 ({round(M["OF_M2"])} m² alquilables), para proveedores y gestores del sector salud'], ''), (['Obra', 'Terminación de las plantas altas como oficinas: pisos, sanitarios, instalaciones y climatización'], ''), (['Costo', 'USD 350/m² sobre 320 m² (tabla básica)'], 'b')]
rB = [(['Programa', f'Salón en PB y {M["N_D2"]} departamentos de 2 dormitorios, 2 por planta'], ''), (['Obra', 'Terminación como vivienda: cocinas y baños por unidad, instalaciones individuales'], ''), (['Costo', 'USD 450/m² sobre 320 m² (tabla estándar)'], 'b')]
rC = [(['Programa', f'{M["N_CONS"]} consultorios (4 por nivel), recepción y sala de espera; uso exclusivo de salud'], ''), (['Obra', 'Todo el edificio: consultorios con lavamanos, sanitarios accesibles, ascensor y habilitación sanitaria'], ''), (['Costo', f'USD 450/m² sobre 499,4 m² + ascensor {usd(M["ASCENSOR"])}'], 'b')]
S.append(slide(f'''{head('Opciones de renta', 'Tres caminos para poner el edificio en renta')}
<div class="two alt3">{alt_card('A', rA)}{alt_card('B', rB, True)}{alt_card('C', rC)}</div>
<p class="note2"><b>Tres usos que no se mezclan.</b> Por normativa, los consultorios médicos no pueden compartir el edificio con oficinas ni con departamentos (a confirmar en la habilitación). A y B conservan el salón de PB, que puede seguir rentando durante la obra de las plantas altas. C convierte todo el edificio y requiere la obra más cara. El aviso propone 1 departamento por planta; Meridiano propone 2 por planta, de unos 65 m², más cerca del producto que se alquila en San Roque. Programas preliminares: deben validarse con un arquitecto, la Municipalidad y, en C, el Ministerio de Salud.</p>''', num()))

# 10 CAPEX
def cxrows(a):
    c = cx[a]
    rows = [(['Obra', usd(c['obra'] - c.get('ascensor', 0))], '')]
    if a == 'C': rows.append((['Ascensor (supuesto)', usd(c['ascensor'])], ''))
    return rows + [(['Imprevistos (10%)', usd(c['imprev'])], ''), (['Obra total', usd(c['total'])], 'b'), (['Inversión a ' + usd(P), usd(c['total'] + P)], 'tot'), (['Inversión a ' + usd(PR), usd(c['total'] + PR)], 'tot')]
S.append(slide(f'''{head('Costo de la obra', 'Inversión total por opción y precio de compra')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT_NAMES[a]}</div>{table(["Concepto", "USD"], cxrows(a), "t big")}</div>' for a in 'ABC')}</div>
<p class="note2 sm"><b>Criterios.</b> Tabla de Meridiano Capital de "remodelación sobre obra existente" aplicada a la superficie que se interviene: 320 m² de plantas altas en A y B, y todo el edificio en C. Sin presupuesto sobre el edificio real. Imprevistos: supuesto de 10%. Plazo: supuesto de 12 meses. Excluye gastos de adquisición, mobiliario y comisión de alquiler.</p>''', num()))

# 11 INGRESOS
def inc_rows(a, lbl=''):
    alt = M[a]['alt']
    return [([l, d, gs(c), usd(c / TC)], '') for l, d, c in alt['lines']] + [(['Total', lbl, gs(alt['mes']), usd(alt['mes'] / TC)], 'tot')]
sup = [('Salón de PB', f"{gs(M['PB_RENT'])}: valor del aviso, dentro de la banda de salones de la zona (L1–L4)."),
       ('Oficinas', f"Gs {n(M['OF_BASE'])}/m²: entre O1 (Gs 36.000/m²) y K1 (Gs 25.000/m²)."),
       ('2 dormitorios', f"{gs(M['D2_RENT'])}: techo de la banda sin muebles (R1–R4), por el estacionamiento propio."),
       ('Consultorio', f"{gs(M['CONS_RENT'])} por unidad vacía, sin servicios: supuesto de Meridiano (lámina 13).")]
S.append(slide(f'''{head('Ingresos estimados', 'Alquiler mensual tras la obra')}
<div class="two cx2 cmp"><div><div class="altt">{ALT_NAMES['A']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('A'), 't xs')}
<div class="altt gold" style="margin-top:8px">{ALT_NAMES['B']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('B', str(M['N_D2'] + 1) + ' unidades'), 't xs')}
<div class="altt" style="margin-top:8px">{ALT_NAMES['C']}</div>{table(['Concepto', 'Detalle', 'Gs por mes', 'USD'], inc_rows('C', str(M['N_CONS']) + ' consultorios'), 't xs')}</div>
{crit('Base de mercado (estudio 07/11/2026)', sup)}</div>''', num()))

# 12 REFERENCIAS
rc = [('L1', 'Salón comercial', 'Eusebio Ayala y Gral. Santos', '200 m²', 'Gs 6.000.000', '30.000'), ('L2', 'Local comercial, IVA incluido', 'Eusebio Ayala y Gral. Santos', '595 m²', 'Gs 16.500.000', '27.731'),
      ('L3', 'Salón comercial (figura alquilado)', 'Eusebio Ayala, zona Comisaría 7.ª', '520 m²', 'Gs 7.200.000', '13.846'), ('L4', 'Local', 'San Roque', '76 m²', 'Gs 2.500.000', '32.895'),
      ('O1', 'Oficina (aviso de 2024)', 'Centro', '50 m²', 'Gs 1.800.000', '36.000'), ('R1', '2 dormitorios amoblado', 'San Roque', '—', 'Gs 4.200.000', '—'),
      ('R2', '2 dormitorios', 'San Roque', '—', 'Gs 2.400.000', '—'), ('R3', '2 dormitorios', 'San Roque', '—', 'Gs 2.800.000', '—'), ('R4', '2 dormitorios', 'Centro, San Roque', '—', 'Gs 2.300.000–2.500.000', '—')]
S.append(slide(f'''{head('Referencias de mercado', 'Alquileres publicados en San Roque y la Av. Eusebio Ayala')}
{table(['ID', 'Tipología', 'Ubicación anunciada', 'Superficie', 'Precio por mes', 'Gs/m²'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Bandas observadas.</b> Salones grandes sobre Eusebio Ayala Gs 14.000–30.000/m² · locales chicos en San Roque desde Gs 33.000/m² · oficinas Gs 25.000–36.000/m² · 2 dormitorios Gs 2,3–2,8 M sin muebles y Gs 4,2 M amoblado. El aviso del inmueble propone Gs 3,5 M por departamento de 2 dormitorios: por encima de la banda sin muebles.</p>
<div class="src">Estudio de mercado de Meridiano Capital, consulta del 07/11/2026 en InfoCasas, Amambay Propiedades y s126. Precios pedidos, no contratos cerrados; disponibilidad no confirmada; varios avisos sin fecha ni superficie.</div>''', num()))

# 13 CONSULTORIOS
req = M['req']
S.append(slide(f'''{head('Mercado de consultorios', 'Demanda médica en San Roque')}
<div class="two cx2 cmp"><div>{table(['ID', 'Tipología', 'Barrio', 'Superficie', 'Precio por mes', 'Gs/m²'], [(['K1', 'Consultorio en edificio médico, 4.º piso', 'San Roque', '70 m²', 'Gs 1.750.000', '25.000'], ''), (['K2', 'Consultorio en clínica, con secretaria y limpieza', 'Bernardino Caballero', '120 m²', 'Gs 2.150.000', '17.917'], ''), (['K3', 'Consultorio', 'Villa Aurelia', '148 m²', 'Gs 5.000.000', '33.784'], '')], 't sm refs')}
<p class="note2 sm"><b>Base del modelo.</b> {gs(M['CONS_RENT'])} por consultorio de 15 a 18 m², vacío y sin servicios: supuesto de Meridiano, el mismo que para el Edificio Sajonia. Vacancia de 10%, menor que en Sajonia por la cercanía del Ministerio de Salud y de los sanatorios (supuesto).</p>
<p class="note2 sm"><b>Alquiler que haría falta.</b> Para igualar la neta de A, cada consultorio debería alquilarse en {gs(req['A|pedido'])} por mes; para igualar la de B, en {gs(req['B|pedido'])}. Es una herramienta inversa, no un precio de mercado.</p></div>
{crit('Entorno de salud', [('Ministerio de Salud Pública', 'Sede central en Av. Pettirossi y Brasil: profesionales, proveedores y gestores con trámites a diario.'), ('Sanatorio Adventista', 'Av. Silvio Pettirossi y Paí Pérez, barrio San Roque.'), ('Hospital Universitario N. S. de la Asunción', 'Eligio Ayala y Curupayty, San Roque.'), ('Lectura', 'Es la zona con más demanda médica de las analizadas; el desafío de la clínica es su obra, la más cara de las tres.')])}</div>
<div class="src">Estudios de mercado de Meridiano Capital del 07/11/2026 (ASU-SAN-ROQUE y ASU-SAJONIA). Direcciones de centros de salud según directorios públicos, a verificar; distancias no medidas.</div>''', num()))

# 14 INGRESOS Y EGRESOS
def er(a):
    e, alt = ev[a], M[a]['alt']
    G = e['G']
    return [(['Ingreso bruto anual', '100%', usd(G)], 'b'), (['IVA', pct(alt['iva'], 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia', pct(alt['vac'], 1), '– ' + usd(e['vac_u'])], ''), (['Administración', '8,0%', '– ' + usd(e['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(e['man_u'])], ''),
            (['Gastos fijos', pct(M['FIJOS'] / G, 1), '– ' + usd(M['FIJOS'])], ''), (['Antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'),
            (['IRE estimado (10%)', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two alt3">{''.join(f'<div><div class="altt{" gold" if a == "B" else ""}">{ALT_NAMES[a]}</div>{table(["Concepto", "%", "USD/año"], er(a), "t sm ie")}</div>' for a in 'ABC')}</div>
<p class="note2 sm">IVA: 10% en locales, oficinas y consultorios, 5% en vivienda. Vacancia de referencia de Meridiano: 8% locales, 10% oficinas, 4% vivienda y 10% consultorios (supuesto), ponderada por ingreso. Gastos fijos: supuesto de Gs 7.000.000 por año. IRE: 10% estimado si se compra por sociedad; el contador define la base real.</p>''', num()))

# 15 RENTABILIDAD
cols = [(a, e[a], ' gold' if a == 'B' else '', lab) for a in 'ABC' for e, lab in ((ev, '250'), (evr, '170'))]
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{g}">{k} · USD {lab} mil</div>' for k, _, g, lab in cols)
def rowr(lbl, key, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{usd(e["inv"]) if key == "inv" else pct(e[key])}</div>' for _, e, _, _ in cols)
S.append(slide(f'''{head('Rentabilidad estimada', 'Tres opciones de renta a dos precios de compra')}<div class="rule"></div>
<div class="rg6">{hdr}{rowr('Bruta sobre inversión total', 'bruta', 'bigv m6')}{rowr('Neta antes de IRE', 'neta_pre', 'midv')}{rowr('Neta final', 'neta', 'midv')}{rowr('Inversión total', 'inv', 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> El denominador es el precio más la obra para terminar el edificio, sin gastos de adquisición. A = local y oficinas; B = local y departamentos; C = clínica. Con el esquema del aviso (2 departamentos a Gs 3,5 M), B daría {pct(BV['bruta'])} bruta a USD 250.000 y {pct(M['B_vend']['rapida']['bruta'])} a USD 170.000. Con el dólar a {TCTXT.split(' (')[0]}, la renta en guaraníes rinde menos sobre un precio en dólares. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 16 SENSIBILIDAD
def srow(a, f):
    lbl = f'{ALT_NAMES[a].split(" · ")[1]} · obra {"de tabla" if f == 1.0 else "+25%"}'
    return ([lbl] + [pct(M['sens'][f'{a}|{f}|{k}|pedido'][0]) + ' · ' + pct(M['sens'][f'{a}|{f}|{k}|pedido'][1]) for k in ('0.85', '1.0', '1.15')], 'b' if f == 1.0 else '')
srows = [srow(a, f) for a in 'ABC' for f in (1.0, 1.25)]
S.append(slide(f'''{head('Qué mueve el resultado', 'Sensibilidad: costo de obra y alquiler')}
<div class="two cx2"><div><div class="altt">Bruta · neta final sobre inversión total, compra a USD 250.000</div>{table(['Opción y obra', 'Alquiler −15%', 'Alquiler base', 'Alquiler +15%'], srows, 't big')}</div>
{crit('Lectura', [('El alquiler', 'Es la palanca principal: un 15% más o menos mueve la bruta alrededor de un punto en cada opción.'), ('La obra', 'Si la obra cuesta un 25% más que la tabla, la bruta cae entre 0,5 y 0,6 puntos en cada opción.'), ('El precio', 'Comprar a USD 170.000 suma entre 1,0 y 1,7 puntos brutos según la opción.'), ('Presupuesto real', 'Antes de ofertar: presupuesto de obra sobre el edificio real con arquitecto o constructor.')])}</div>''', num()))

# 17 AMPLIACIÓN
amp = M['amp']
S.append(slide(f'''{head('Potencial de ampliación', 'Terraza de 160 m² y fondo del lote')}
<div class="two cx2"><div>{kgrid([(str(amp['m2']) + ' m²', 'Dos pisos más sobre la losa de 160 m² (pisos 3 y 4)'), (usd(amp['capex']), f'Obra estimada a USD {amp["rate"]}/m² más 10% de imprevistos'), (f"{amp['n']} deptos.", f"De 2 dormitorios, a {gs(M['D2_RENT'])} por mes"), (pct(amp['bruta']) + ' · ' + pct(amp['neta']), 'Bruta · neta de la ampliación, sobre su propia obra')], 'kgrid k2')}
<p class="note2 sm">La ampliación rinde más que el edificio actual porque no paga terreno: el suelo ya está en el precio. Es una segunda etapa, no está incluida en las rentabilidades de las láminas anteriores.</p></div>
{crit('Condiciones', [('Estructura', 'Confirmar con un ingeniero que la estructura soporta dos pisos más.'), ('Normativa', 'Altura, FOS y FOT según el Plan Regulador de Asunción; el aviso dice hasta 5 pisos.'), ('Bloque posterior', 'El fondo del lote podría alojar un segundo bloque de departamentos, sujeto a factibilidad; hoy es estacionamiento.'), ('Ascensor', 'A partir de 4 o 5 niveles conviene sumar ascensor; no está incluido en esta estimación.')])}</div>
<div class="src">Estimación de referencia con la tabla de construcción nueva de Meridiano Capital. No hay proyecto ni presupuesto de la ampliación.</div>''', num()))

# 18 TIR
pr = M['proj']
trows = [([ALT_NAMES[a] + ' · ' + usd(M['PRICES'][p])] + [pct(pr[a][p][k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [usd(pr[a][p]['Base']['total'])], 'b' if p == 'pedido' else '') for a in 'ABC' for p in ('pedido', 'rapida')]
bt = max('ABC', key=lambda a: pr[a]['pedido']['Base']['tir'])
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años por opción')}
<div class="two d15">{table(['Opción · precio de compra', 'Conservador', 'Base', 'Optimista', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr[bt]['pedido']['Base']['tir'], 1)} · {pct(pr[bt]['rapida']['Base']['tir'], 1)}</div><div class="bs">TIR base de {ALT_NAMES[bt].split(' · ')[1].lower()}, a USD 250.000 y a USD 170.000: la más alta de las tres</div><p>Compra, un año de obra (en A y B el salón de PB renta durante la obra), cuatro años de renta neta y venta al valor estimado del año 5. Escenarios: alquileres +3/+5/+8% y valorización 2/3,5/5% anual.</p><p class="gold">Supuesto clave: el valor del edificio terminado parte de la inversión total y se valoriza desde el fin de la obra. La ampliación no está incluida.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. Ganancia base = plusvalía − IVA de la venta futura (1,5%) + renta neta acumulada. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 19 PRECIO
info = [('Activo', 'Edificio de 3 niveles, 499,4 m² construidos sobre 585,80 m² de terreno, con estacionamiento propio y tinglado de 60 m².'),
        ('Ocupación', 'Sin contratos de alquiler verificados; el aviso informa ingresos posibles de Gs 11 M por mes.'),
        ('Venta rápida', f'{usd(PR)} (−32%): escenario de cierre ágil; las condiciones se definen en la negociación.'),
                ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">{usd(P)}</div><div class="bs">Precio de venta · {gs(P * TC)}</div><div class="bigv sm2">{usd(PR)}</div><div class="bs">Precio de venta rápida</div><p>Precio en dólares; alquileres futuros estimados en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Neta final a USD 170.000: A {pct(evr['A']['neta'])} · B {pct(evr['B']['neta'])} · C {pct(evr['C']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 20 PROCESO
steps = [('Visita e inspección', 'Recorrido con inspección técnica de estructura, losas, instalaciones y de la capacidad para ampliar.'), ('Proyecto y presupuesto', 'Anteproyecto de la opción elegida, presupuesto de obra y consulta de normativa municipal.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título, mensura, condiciones de dominio e impuesto inmobiliario, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto, escritura y obra', 'Firma ante el escribano y ejecución de la obra con seguimiento de plazos y costos.'), ('Comercialización y administración', 'Alquiler de las unidades, contratos y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 21 CONSIDERACIONES
rk = [('Rentabilidad sobre la inversión', 'Con la obra incluida, las netas estimadas quedan por debajo del 10% de referencia de Meridiano aun a USD 170.000; la ampliación es la vía para mejorarlas.'),
      ('Costo de obra', 'Tabla de Meridiano sin presupuesto sobre el edificio real; en C se suma un ascensor estimado.'),
      ('Renta sin verificar', 'El aviso informa ingresos posibles, no contratos. Gs 3,5 M por departamento está por encima de la banda del barrio.'),
      ('Normativa y uso exclusivo', 'Consultorios: habilitación del Ministerio de Salud y uso exclusivo. Ampliación: altura, FOS y FOT del Plan Regulador.'),
      ('Superficies', 'Terreno de 585,80 m² frente a 9 × 69 m = 621 m²: aclarar con la mensura y el título.'),
      ('Tipo de cambio e impuestos', 'Precio en dólares y alquileres en guaraníes; el IRE depende de la estructura de compra y lo determina el contador.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar antes de ofertar')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 22 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita al edificio</h2>
<p class="cp">Recorremos el edificio con una inspección técnica, preparamos el anteproyecto y el presupuesto de la opción que elija, y lo acompañamos en cada paso de la compra, la obra y la administración.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones posteriores a una obra aún no presupuestada y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio con renta y potencial</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
