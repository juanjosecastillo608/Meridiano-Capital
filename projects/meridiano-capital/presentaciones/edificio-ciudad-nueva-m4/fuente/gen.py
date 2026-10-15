import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import TC as TC_CFG, tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json, os
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC, P = M['TC'], M['P']

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gs(x): return 'Gs ' + n(x)

PROJ = 'Edificio Ciudad Nueva'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
MAPS = 'https://www.google.com/maps/search/?api=1&query=-25.299977,-57.61909'
ISO_DARK = '<svg viewBox="0 0 120 120" class="iso"><path d="M60 6 L14 100 L106 100 Z" fill="none" stroke="#14313A" stroke-width="6" stroke-linejoin="round"/><line x1="4" y1="112" x2="116" y2="112" stroke="#14313A" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="72" r="9" fill="#C9982E"/></svg>'
ISO_LIGHT = ISO_DARK.replace('#14313A', '#F3EDE3')
def logo(): return f'<div class="logo">{ISO_LIGHT}<div class="wm" style="color:#F3EDE3">MERIDIANO<br><span>CAPITAL</span></div></div>'
def foot(num, dark=False): return f'<div class="foot {"d" if dark else ""}">{ISO_LIGHT if dark else ISO_DARK}<span>{FOOT_TXT}</span><b>{num:02d}</b></div>'
def slide(inner, num, dark=False): return f'<section class="s {"dark" if dark else ""}">{inner}{foot(num, dark)}</section>'
def head(eb, title): return f'<div class="eb">{eb}</div><h2>{title}</h2>'
def kgrid(items, cls='kgrid'): return f'<div class="{cls}">' + ''.join(f'<div class="k"><div class="v">{v}</div><div class="l">{l}</div></div>' for v, l in items) + '</div>'
def crit(title, items): return f'<div class="crit"><div class="eb sm">{title}</div>' + ''.join(f'<div class="ci"><b>{a}</b><span>{b}</span></div>' for a, b in items) + '</div>'
def table(hdr, rows, cls='t'):
    h = ''.join(f'<th>{x}</th>' for x in hdr)
    return f'<table class="{cls}"><tr>{h}</tr>' + ''.join(f'<tr class="{c}">' + ''.join(f'<td>{x}</td>' for x in cells) + '</tr>' for cells, c in rows) + '</table>'

G, net, pre = M['G'], M['net'], M['pre']
S = []
# 01
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Edificio de renta en venta</div>
<h1>Edificio<br>Ciudad Nueva</h1>
<div class="addr">9 de Marzo c/ Mayor Bullo · Ciudad Nueva, Asunción</div>
<div class="cvk"><div><div class="v">USD 340.000</div><div class="l">Precio de venta</div></div><div><div class="v">1.109 m²</div><div class="l">Construidos sobre 340 m² de terreno</div></div></div>
<div class="cf">Construido en 1990 · Datos con verificación documental · {tc_corto()}</div></div>
<div class="cr"><img src="img/fachada.jpg" style="object-position:50% 40%"></div></section>''')
# 02
S.append(slide(f'''{head('Resumen del inmueble', 'Edificio de renta con 13 departamentos y un local comercial')}
<p class="lead">Edificio construido en 1990, en operación y 100% alquilado, a una cuadra de la Av. Eusebio Ayala y a pocos minutos a pie del Mercado 4, el principal polo comercial minorista del país.</p>
{kgrid([('USD 340.000', 'Precio de venta'), ('1.109 m²', 'Superficie construida'), ('340 m²', 'Terreno de 11 × 31 m'), ('6 · 6 · 1', 'Dptos. de 1, 2 y 3 dorm. + 1 local'),
        (gs(M['mes']), f"Ingreso mensual · {usd(M['mes'] / TC)}"), (pct(M['bruta']), 'Rentabilidad bruta sobre precio'), (pct(M['neta']), 'Rentabilidad neta final'), (pct(M['proj']['Base']['tir'], 1), 'TIR estimada a 5 años (base)')])}
<div class="box">Ocupación: 100% alquilado · Datos informados con verificación documental · Tipo de cambio {TCTXT}</div>''', 2))
# 03
loc = [('Av. Eusebio Ayala', '90 m por calle · una cuadra'), ('Av. Rodríguez de Francia', '320 m por calle · unas tres cuadras'), ('Mercado 4', '480 m por calle hasta su punto de referencia')]
lh = ''.join(f'<div class="li"><div class="eb sm">{a}</div><div class="lt">{b}</div></div>' for a, b in loc)
S.append(slide(f'''{head('Ubicación', 'Una cuadra de Eusebio Ayala, cerca del Mercado 4')}
<div class="two"><div class="mapimg"><img src="img/mapa.jpg" style="object-fit:contain;background:#efe7d6"></div>
<div class="locr">{lh}<p class="lt" style="margin-top:18px">Dirección: 9 de Marzo c/ Mayor Bullo, barrio Ciudad Nueva, Asunción.</p>
<a class="glink" href="{MAPS}">Abrir en Google Maps</a>
<p class="note">Distancias por la red de calles, medidas desde la intersección de 9 de Marzo y Mayor Bullo. Cartografía: © OpenStreetMap contributors · Overture Maps.</p></div></div>''', 3))
# 04
pts = [('Demanda constante', 'Unidades de 1 y 2 dormitorios buscadas por quienes trabajan en el comercio y los servicios de la zona.'),
       ('Vacancia muy baja', 'El alto tránsito y la demanda sostenida hacen que las unidades se vuelvan a alquilar rápido. El análisis usa una vacancia de solo 3%.'),
       ('Valor del local', 'El flujo peatonal y vehicular de la zona sostiene la demanda de locales comerciales en planta baja.')]
ph = ''.join(f'<div class="pt"><div class="pn">0{i+1}</div><div><div class="pth">{a}</div><div class="ptt">{b}</div></div></div>' for i, (a, b) in enumerate(pts))
S.append(slide(f'''{head('La zona para el inversor', 'Mercado 4: el corazón comercial de Asunción')}
<div class="two z"><div class="ztext"><p>El Mercado Municipal N.º 4 funciona desde 1942 y es el principal polo comercial minorista del Paraguay. Concentra miles de comercios de alimentos, indumentaria, tecnología y servicios, y recibe a diario a decenas de miles de compradores de toda el área metropolitana.</p>
<p>A su alrededor se formó un barrio de trabajo intenso: comerciantes, empleados y proveedores que buscan vivir cerca para evitar traslados largos. La Av. Eusebio Ayala, a una cuadra del edificio, es uno de los grandes ejes de transporte público hacia el este del área metropolitana.</p></div>
<div><div class="eb sm">Por qué importa la cercanía</div>{ph}</div></div>
<div class="src">Fuentes: Municipalidad de Asunción (Mercado Municipal N.º 4, 84 años como principal polo comercial minorista del país); prensa local para el flujo diario de compradores.</div>''', 4))
# 05
S.append(slide(f'''{head('Superficies y valor', '340 m² de terreno y 1.109 m² construidos')}
<div class="sup"><div class="lot"><div class="rect" style="width:110px;height:310px"><span>340 m²</span></div><div class="dimr" style="left:176px">31 m de fondo</div><div class="dimb">11 m de frente</div></div>
<div>{kgrid([('1.109 m²', 'Superficie construida · 3,3 veces el terreno'), ('1990', 'Año de construcción · 36 años'), (usd(P / 1109), 'Por m² construido, terreno incluido'), (usd(1109 * 650), 'Costo de construir hoy 1.109 m² (USD 650/m², sin terreno)'), (pct(P / (1109 * 650), 0), 'El precio frente a ese costo de construcción nueva'), (usd(P / 14), 'Por unidad de renta (14 unidades)')], 'kgrid k2')}
<div class="src" style="position:static;margin-top:14px">Referencia del barrio: un edificio de 9 unidades en Ciudad Nueva se publica en USD 650.000 (unos USD 72.222 por unidad). Valores de referencia, no tasación: el costo de construcción nueva no descuenta los 36 años del edificio ni su estado de conservación.</div></div></div>''', 5))
# 06
lv = M['lv']
order = [('Tercer piso', '2 × 2 dorm. · 2 × 1 dorm.', '3.er piso'), ('Segundo piso', '4 × 2 dorm. · 1 × 1 dorm.', '2.º piso'), ('Primer piso', '1 × 1 dorm. · 1 × 3 dorm.', '1.er piso'), ('Planta baja', '2 × 1 dorm. · cochera · cochera y depto.', 'P. baja')]
rows = [([a, b, gs(lv[a]), usd(lv[a] / TC)], '') for a, b, _ in order] + [(['Total', '13 departamentos, local y cocheras', gs(M['mes']), usd(M['mes'] / TC)], 'tot')]
mx = max(lv.values()); bh = ''
for i, (a, _, lab) in enumerate(order):
    v = lv[a] / 1000; h = 170 * lv[a] / mx; x = 24 + i * 64
    bh += f'<rect x="{x}" y="{200-h}" width="38" height="{h}" fill="#14313A"/><text x="{x+19}" y="{194-h}" class="bl">{n(v)}</text><text x="{x+19}" y="218" class="bx">{lab}</text>'
S.append(slide(f'''{head('Distribución de las unidades', 'Cuatro niveles de departamentos más terraza')}
<div class="two d6">{table(['Nivel', 'Composición', 'Gs por mes', 'USD por mes'], rows)}
<div class="chart"><div class="ct">Alquiler mensual por nivel, miles de Gs</div><svg viewBox="0 0 280 225">{bh}</svg></div></div>
<p class="note2">Terraza amplia en el cuarto nivel, con vistas abiertas sobre la ciudad. Composición y montos según el detalle de alquileres verificado.</p>''', 6))
# 07
S.append(slide(f'''{head('Recorrido fotográfico', 'Fachada y acceso')}
<div class="ph"><figure style="width:620px"><img src="img/aerea.jpg" style="height:412px"><figcaption>Vista aérea del edificio y su entorno</figcaption></figure>
<figure style="width:310px"><img src="img/acceso.jpg" style="height:412px"><figcaption>Acceso principal</figcaption></figure></div>''', 7, dark=True))
# 08
S.append(slide(f'''{head('Recorrido fotográfico', 'Circulación común y terraza')}
<div class="ph"><figure style="width:620px"><img src="img/terraza.jpg" style="height:412px"><figcaption>Terraza superior con vistas abiertas sobre la ciudad</figcaption></figure>
<div class="stack" style="width:300px"><figure><img src="img/escalera1.jpg" style="height:190px"><figcaption>Escalera y circulación común</figcaption></figure><figure><img src="img/escalera2.jpg" style="height:190px"></figure></div></div>''', 8))
# 09
R = M['RENTS']
def rr(r): return [r[0], r[1], gs(r[2]), usd(r[2] / TC)]
left = [(rr(r), '') for r in R[:9]]
right = [(rr(r), '') for r in R[9:]] + [(['Total', f'{len(R)} conceptos', gs(M['mes']), usd(M['mes'] / TC)], 'tot')]
S.append(slide(f'''{head('Alquileres vigentes', f"Ingreso mensual: {gs(M['mes'])} · {usd(M['mes'] / TC)}")}
<div class="two cmp2">{table(['Nivel', 'Concepto', 'Gs por mes', 'USD'], left, 't sm')}<div>{table(['Nivel', 'Concepto', 'Gs por mes', 'USD'], right, 't sm')}
<p class="note2 sm">Montos en guaraníes según los contratos vigentes; equivalente en dólares al tipo de cambio del día: {TCTXT}.</p></div></div>''', 9))
# 10
er = [(['Ingreso bruto anual', '100%', usd(G)], 'b'), ([f'IVA (5% dptos. · 10% local y cocheras)', pct(M['IVA'], 1), '– ' + usd(M['iva_u'])], ''), (['Vacancia', '3,0%', '– ' + usd(M['vac_u'])], ''),
      (['Administración', '8,0%', '– ' + usd(M['adm_u'])], ''), (['Mantenimiento', '5,0%', '– ' + usd(M['man_u'])], ''), (['Gastos fijos del edificio', pct(M['FIX'] / G, 1), '– ' + usd(M['FIX'])], ''),
      (['Resultado antes de impuesto a la renta', pct(pre / G, 1), usd(pre)], 'b'), (['Impuesto a la renta estimado (IRE 10%)', pct(M['ire_u'] / G, 1), '– ' + usd(M['ire_u'])], ''), (['Resultado neto anual', pct(net / G, 1), usd(net)], 'tot')]
S.append(slide(f'''{head('Ingresos y egresos anuales', 'Del ingreso bruto al resultado neto')}
<div class="two d11">{table(['Concepto', '% del bruto', 'USD por año'], er, 't big')}
{crit('Criterios', [('IVA', '5% departamentos; 10% local y cocheras.'), ('Vacancia 3%', 'Zona de alto tránsito y demanda: rotación rápida.'), ('Administración 8%', 'Cobranza, contratos e inquilinos.'), ('Mantenimiento 5%', 'Reparaciones menores y recambios entre inquilinos.'), ('Impuesto a la renta', '10% estimado si se compra por sociedad; el contador define la base real.')])}</div>''', 10))
# 11
S.append(slide(f'''{head('Rentabilidad', 'Indicadores sobre el precio de venta')}<div class="rule"></div>
<div class="rg"><div><div class="bigv">{pct(M['bruta'])}</div><div class="bl2">Rentabilidad bruta</div><div class="bs">{usd(G)} de ingreso bruto anual ÷ USD 340.000</div></div>
<div><div class="bigv">{pct(M['neta'])}</div><div class="bl2">Rentabilidad neta final</div><div class="bs">{usd(net)} de resultado neto ÷ USD 340.000</div></div>
<div class="rg2"><div><div class="midv">{pct(M['neta_pre'])}</div><div class="bs">Neta antes de impuesto a la renta</div></div><div><div class="midv">{n(M['veces'], 1)} veces</div><div class="bs">Precio ÷ ingreso bruto anual</div></div></div>
<div class="bs how"><b>Cómo leer estas cifras.</b> La neta final descuenta IVA, vacancia, administración, mantenimiento, gastos fijos e impuesto a la renta estimado. El denominador es el precio de venta, sin gastos de adquisición. Tipo de cambio: {TCTXT}. Cifras de referencia, no garantizadas.</div></div>''', 11, dark=True))
# 12
pr = M['proj']; cols = {'Conservador': '#6B6154', 'Base': '#14313A', 'Optimista': '#8B3323'}
y0, y1 = 25000, 41000; W, H = 560, 250; L = 70
def Y(v): return 10 + H - (v - y0) / (y1 - y0) * H
def X(i): return L + 30 + i * (W - 60) / 4
sv = ''
for k in range(y0, y1 + 1, 2000): sv += f'<line x1="{L}" x2="{L+W}" y1="{Y(k)}" y2="{Y(k)}" stroke="#DAD2C0" stroke-width="0.8"/><text x="{L-6}" y="{Y(k)+3}" class="ya">USD {n(k)}</text>'
for i in range(5): sv += f'<text x="{X(i)}" y="{H+30}" class="xa">Año {i+1}</text>'
for nm, c in cols.items():
    pts = ' '.join(f'{X(i)},{Y(v)}' for i, v in enumerate(pr[nm]['nets']))
    sv += f'<polyline points="{pts}" fill="none" stroke="{c}" stroke-width="2.2"/>' + ''.join(f'<circle cx="{X(i)}" cy="{Y(v)}" r="3.6" fill="{c}"/>' for i, v in enumerate(pr[nm]['nets']))
leg = ''.join(f'<span><i style="background:{c}"></i>{k}</span>' for k, c in cols.items())
ptab = [([k, '+' + n(pr[k]['gr'] * 100, 1) + '% anual', usd(pr[k]['nets'][4])], '') for k in cols]
S.append(slide(f'''{head('Proyección de alquiler', 'Resultado neto anual proyectado a cinco años')}
<div class="two d13"><div><svg viewBox="0 0 {L+W+10} {H+45}" class="lc">{sv}</svg><div class="leg">{leg}</div></div>
<div>{table(['Escenario', 'Alquileres', 'Neto año 5'], ptab)}
<p class="bs dk"><b>Margen de ajuste.</b> Hoy el promedio es {gs(round(M['avg1']))} en 1 dormitorio y {gs(round(M['avg2']))} en 2 dormitorios. Los avisos publicados hoy en Ciudad Nueva van de Gs 3,0 a 3,2 millones (1 dorm.) y de Gs 2,1 a 6,3 millones (2 dorm.): hay espacio para ajustar en cada renovación, según el estado de cada unidad.</p></div></div>
<div class="src">Proyección ilustrativa en USD al tipo de cambio del día constante; no garantizada.</div>''', 12))
# 13
def rowp(lbl, f, cls=''): return ([lbl] + [f(pr[k]) for k in cols], cls)
prow = [rowp('Valorización anual supuesta', lambda p: n(p['val'] * 100, 1) + '%'), rowp('Valor estimado al año 5', lambda p: usd(p['V'])), rowp('Plusvalía estimada', lambda p: usd(p['plus'])),
        rowp('IVA de la venta futura (1,5%)', lambda p: '– ' + usd(p['ivav'])), rowp('Renta neta acumulada 5 años', lambda p: usd(p['acum'])), rowp('Ganancia total estimada', lambda p: usd(p['total']), 'b'),
        rowp('TIR estimada a 5 años', lambda p: pct(p['tir'], 1), 'tot')]
S.append(slide(f'''{head('Plusvalía y retorno total', 'Escenarios a cinco años')}
<div class="two d15">{table(['Concepto', 'Conservador', 'Base', 'Optimista'], prow, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(pr['Base']['tir'], 1)}</div><div class="bs">TIR estimada, escenario base</div><p>Compra a USD 340.000, cinco años de renta neta creciente y venta al valor estimado del año 5.</p><p class="gold">Punto de partida: el precio equivale al {pct(P / (1109 * 650), 0)} del costo de construir hoy la misma superficie, sin contar el terreno.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición ni comisión de venta. El valor futuro depende del mercado, del estado del edificio y de su ocupación al vender.</div>''', 13))
# 14
info = [('Activo', '13 departamentos y 1 local comercial, más terraza. 1.109 m² construidos en 1990 sobre 340 m² de terreno.'), ('Ocupación', '100% alquilado. Datos informados con verificación documental.'),
        ('Ingreso', f"{gs(M['mes'])} por mes · {usd(G)} por año al tipo de cambio del día."), ('Forma de pago y entrega', 'A acordar en la negociación y el boleto de compraventa.')]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">USD 340.000</div><div class="bs">Precio de venta</div><p>Edificio construido en 1990</p><p>Precio en dólares estadounidenses. Alquileres cobrados en guaraníes.</p><div class="dfoot">{pct(M['bruta'])} bruta · {pct(M['neta'])} neta final · {usd(net / 12)} netos por mes</div></div>
<div class="info">{ih}</div></div>''', 14))
# 15
steps = [('Visita al edificio', 'Recorrido de las unidades, el local y la terraza, con inspección técnica de estructura, instalaciones e impermeabilización.'), ('Oferta y reserva', 'Propuesta de precio y forma de pago; reserva con documentación de respaldo.'),
         ('Revisión notarial', 'Título, informe de condiciones de dominio e impuesto inmobiliario al día, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Boleto y escritura', 'Firma del boleto de compraventa y escritura pública ante el escribano.'), ('Administración', 'Traspaso de los contratos vigentes y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Para inversores del exterior acompañamos también la cédula de identidad paraguaya y la apertura de cuenta bancaria. Las tareas legales, notariales y contables las realizan el abogado, el escribano y el contador; Meridiano Capital coordina y acompaña.</div>''', 15))
# 16
rk = [('Rotación de inquilinos', 'La vacancia de la zona es baja, pero no es cero: hay renovaciones, renegociaciones y meses de recambio.'),
      ('Tipo de cambio', 'Los alquileres se cobran en guaraníes y el precio está en dólares. En las últimas semanas el dólar bajó frente al guaraní; si la tendencia se revierte, la renta en USD baja.'),
      ('Costos de operación', 'Un edificio de 1990 con 13 unidades requiere mantenimiento continuo; la inspección técnica define si conviene actualizar instalaciones o impermeabilización.'),
      ('Impuestos', 'El impuesto a la renta depende de la estructura de compra y lo determina el contador.'), ('Valor de reventa', 'La plusvalía presentada son escenarios: el valor futuro depende del mercado y del estado del activo.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar en un edificio de renta')}<div class="rks">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', 16))
# 17
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita al edificio</h2>
<p class="cp">Le presentamos los contratos, el detalle de ingresos y la documentación del inmueble, y lo acompañamos en cada paso de la compra.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. No constituye una garantía de rentabilidad.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio de renta en venta</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
