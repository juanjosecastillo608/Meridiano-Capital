import os, sys, glob
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, tc_corto, contacto_linea  # D-096 / D-097
import json
B = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(B, 'model.json')))
TC = M['TC']; PR = M['PRICES']
E = M['etapas']['pedido']; ER = M['etapas']['rapida']
PROJ = 'Clínica Magnificat'
FOOT_TXT = f'Meridiano Capital · {PROJ} · Venta'
TCTXT = tc_texto()
MAPS_QR = 'https://maps.app.goo.gl/kKoH14evyzGWSrUP9'   # enviado por el founder, 09/11/2026
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
def gsm(x): return 'Gs ' + n(x / 1e6, 2 if x % 1e6 else 0).rstrip('0').rstrip(',') + ' M'
def foto(nombre):   # fotos del ZIP de imágenes (pendiente): se usan si existen
    p = os.path.join(B, 'img', nombre)
    return p if os.path.exists(p) else None
NOMBRE_ET = {'E0': 'Hoy', 'E1': 'Etapa 1 · 0 a 12 meses', 'E2': 'Etapa 2 · 12 a 24 meses', 'E3': 'Etapa 3 · desde el mes 25'}

num()
# 01 PORTADA
cover_img = foto('portada.jpg')
right = f'<div class="cr"><img src="img/portada.jpg"></div>' if cover_img else f'<div class="cr" style="background:#F3EDE3;display:flex;align-items:center;justify-content:center"><div style="text-align:center;color:#14313A"><div style="font:400 92px Fraunces,serif;color:#8B3323">11</div><div style="font:600 15px Poppins;letter-spacing:.18em">CONSULTORIOS ALQUILADOS</div><div style="font:400 60px Fraunces,serif;margin-top:34px;color:#8B3323">5</div><div style="font:600 15px Poppins;letter-spacing:.18em">PREPARADOS PARA ODONTOLOGÍA</div><div style="font:400 60px Fraunces,serif;margin-top:34px;color:#8B3323">+1</div><div style="font:600 15px Poppins;letter-spacing:.18em">DEPARTAMENTO PARA RECONVERTIR</div></div></div>'
S.append(f'''<section class="s cover"><div class="cl">{logo()}
<div class="eb g" style="margin-top:96px">Edificio médico en renta · en venta</div>
<h1>Clínica<br>Magnificat</h1>
<div class="addr">Clínica pediátrica en funcionamiento · Asunción</div>
<div class="cvk"><div><div class="v" style="font-size:30px;white-space:nowrap">{usd(PR['pedido'])}</div><div class="l">Precio de venta · venta rápida {usd(PR['rapida'])}</div></div>
<div><div class="v">{gsm(E['E0']['fact_mes'])}</div><div class="l">Facturación mensual actual, IVA y expensas incluidos</div></div></div>
<div class="cf">Renta en curso · Plan de valorización en tres etapas · {tc_corto()}</div></div>{right}</section>''')

# 02 RESUMEN
S.append(slide(f'''{head('Resumen del inmueble', 'Una clínica pediátrica alquilada al 100%, con margen para crecer')}
<p class="lead">Edificio médico de tres plantas en Asunción. En planta baja y primer piso funciona la clínica, con 11 consultorios con baño propio, todos alquilados; cinco tienen instalaciones de agua y desagüe para odontología. En el segundo piso hay un departamento que se entrega libre: se propone que el nuevo propietario lo use como vivienda durante dos años. El núcleo del ascensor está previsto, pero el ascensor no está instalado.</p>
{kgrid([(usd(PR['pedido']), 'Precio de venta'), (usd(PR['rapida']), 'Precio de venta rápida (−16%)'), ('11 / 11', 'Consultorios alquilados, sin mobiliario'), ('Gs 2,5 M', 'Por consultorio, IVA y expensas incluidos'),
        (pct(E['E0']['bruta']) + ' · ' + pct(E['E0']['neta']), 'Hoy, a USD 500.000: bruta · neta'), (pct(ER['E0']['bruta']) + ' · ' + pct(ER['E0']['neta']), 'Hoy, a USD 420.000: bruta · neta'),
        (pct(E['E2']['neta']) + ' · ' + pct(ER['E2']['neta']), 'Neta tras la etapa 2, a cada precio'), (pct(E['E3']['neta']) + ' · ' + pct(ER['E3']['neta']), 'Neta con el 2.º piso reconvertido (ilustrativo)')], 'kgrid ks')}
<div class="box">Cifras de referencia, no garantizadas · Rentabilidad sobre el precio más las inversiones de cada etapa, con la base de cálculo D-101 de Meridiano · Gastos informados sin desglose · Tipo de cambio {TCTXT}</div>''', num()))

# 03 UBICACIÓN
loc = [('Ciudad', 'Asunción'), ('Barrio', 'San Cristóbal, vecino de Villa Morra'), ('Ubicación', 'Esquina: frente corto de 9,60 m sobre calle Sucre y lado largo sobre calle Juan Mota'),
       ('Accesos', 'Ingreso peatonal solo por Juan Mota; estacionamiento de clientes en una franja de 5 m sobre Sucre, sin entradas por esa calle'), ('Perfil', 'Clínica pediátrica con consultorios de distintas especialidades')]
lh = ''.join(f'<div class="li" style="padding:10px 0 11px"><div class="eb sm">{a}</div><div class="lt" style="font-size:14.5px">{b}</div></div>' for a, b in loc)
fimg = foto('fachada.jpg')
izq = f'<div class="mapimg"><img src="img/fachada.jpg" style="height:290px"><div class="cap">Fachada e ingreso de la clínica</div></div>' if fimg else ''
S.append(slide(f'''{head('Ubicación', 'Barrio San Cristóbal, Asunción')}
<div class="two" style="margin-top:22px"><div>{izq}<div style="display:flex;gap:18px;align-items:center;margin-top:14px"><img src="img/qr_ubicacion.png" style="width:120px;height:120px"><div><div class="eb sm">Escanee para abrir la ubicación</div><a class="glink" style="margin-top:6px" href="{MAPS_QR}">{MAPS_QR.replace("https://", "")}</a></div></div></div>
<div class="locr">{lh}</div></div>
<div class="src">Enlace de ubicación enviado por el founder el 09/11/2026; no se pudo abrir desde el entorno de trabajo. Barrio informado por el founder; catastro a confirmar.</div>''', num()))

# 04 EL EDIFICIO HOY
lv = [(['Planta baja', 'Clínica: recepción, sala de espera, consultorios con baño propio, baño infantil con cambiador y cocina del personal'], ''),
      (['Primer piso', 'Clínica: consultorios con baño propio y sala de espera'], ''),
      (['Segundo piso', 'Departamento que se entrega libre; propuesto como vivienda del comprador durante dos años, sin renta'], ''),
      (['Núcleo vertical', 'Escaleras; hueco y estructura previstos para un ascensor, según el propietario'], '')]
ft = [('Consultorios', '11, todos alquilados y con baño propio; se alquilan sin mobiliario.'), ('Odontología', '5 consultorios con agua y desagües previstos para sillones odontológicos.'),
      ('Alquiler', 'Gs 2.500.000 por consultorio por mes, IVA y expensas incluidos.'), ('Gastos', 'Administración Gs 10.450.000 por mes (con secretaria) e impuesto inmobiliario Gs 45 M por año, informados.')]
S.append(slide(f'''{head('El edificio hoy', 'Clínica en dos plantas y un departamento arriba')}
<div class="two d10">{table(['Nivel', 'Uso actual'], lv, 't big lv')}{crit('Ficha técnica', ft)}</div>
<p class="note2">Distribución según el propietario y los planos aportados; superficies a verificar con planos y mensura.</p>''', num()))

# 04b PLANOS Y SUPERFICIES
sup = M['SUP']
srows = [([f"Consultorio {c}", ('PB' if int(c) <= 5 else '1.er piso'), n(m, 1).replace(',0', '') + ' m²', ('Sí' if int(c) in M['ODONTO'] else ''), 'Gs ' + n(M['gs_m2_hoy'][c], 0)], 'b' if int(c) in M['GRANDES'] else '') for c, m in sup.items()]
S.append(slide(f'''{head('Planos y superficies', 'Once consultorios de 12 a 21 m², con baño propio')}
<div class="two" style="margin-top:16px;grid-template-columns:1fr 1fr !important;gap:26px"><div class="ph" style="margin-top:0;gap:10px"><figure style="width:280px"><img src="img/plano_pb.jpg" style="height:330px;object-fit:contain;background:#fff"><figcaption>Planta baja</figcaption></figure><figure style="width:280px"><img src="img/plano_pa.jpg" style="height:330px;object-fit:contain;background:#fff"><figcaption>Primer piso</figcaption></figure></div>
<div>{table(['Consultorio', 'Planta', 'Superficie aprox.', 'Odontología', 'Alquiler actual por m²'], srows, 't xs')}<p class="note2 sm">Total: unos {n(M['SUP_TOT'], 0)} m² de consultorios. En negrita, los tres más grandes.</p></div></div>
<div class="src">Superficies aproximadas, incluido el baño, leídas de fotos de los planos impresos (cotas a escala 1:50); a verificar con un relevamiento. Odontología: consultorios con sillón dibujado en el plano. Las marcas verdes del plano son modificaciones indicadas a mano.</div>''', num()))

# 05 FOTOS (si llegaron)
for titulo, sub, files in [('Recorrido fotográfico', 'Fachada y accesos', ['acceso.jpg', 'lateral.jpg', 'cocheras.jpg']), ('Recorrido fotográfico', 'Recepción y salas de espera', ['sala_espera_pb.jpg', 'sala_ascensor.jpg', 'sala_espera_1p.jpg']),
                           ('Recorrido fotográfico', 'Circulaciones', ['pasillo_pb.jpg', 'pasillo_1p.jpg', 'escalera.jpg']),
                           ('Recorrido fotográfico', 'Cocheras y patio de servicio', ['cochera_cliente.jpg', 'cochera_fondo.jpg', 'patio_servicio.jpg']),
                           ('Recorrido fotográfico', 'Consultorios', ['consultorio_a.jpg', 'consultorio_b.jpg', 'consultorio_c.jpg']),
                           ('Recorrido fotográfico', 'Baños y circulaciones', ['banio_a.jpg', 'banio_b.jpg', 'banio_c.jpg']),
                           ('Recorrido fotográfico', 'Baños propios de los consultorios', ['banio_d.jpg', 'banio_e.jpg']),
                           ('Recorrido fotográfico', 'Departamento del segundo piso', ['depto_a.jpg', 'depto_b.jpg', 'depto_c.jpg']),
                           ('Recorrido fotográfico', 'Departamento del segundo piso: dormitorios y baño', ['depto_d.jpg', 'depto_f.jpg', 'depto_e.jpg'])]:
    ok = [f for f in files if foto(f)]
    if ok:
        caps = json.load(open(os.path.join(B, 'img', 'leyendas.json'))) if os.path.exists(os.path.join(B, 'img', 'leyendas.json')) else {}
        w = {1: 760, 2: 500, 3: 330}[len(ok)]
        figs = ''.join(f'<figure style="width:{w}px"><img src="img/{f}" style="height:412px"><figcaption>{caps.get(f, "")}</figcaption></figure>' for f in ok)
        S.append(slide(head(titulo, sub) + '<div class="ph">' + figs + '</div>', num(), dark=True))

# 06 INGRESOS Y GASTOS HOY
def er(e):
    G = e['G']
    rows = [(['Facturación anual (IVA y expensas incluidos)', '100%', usd(G)], 'b'), (['IVA neto (10%, incluido en el alquiler)', pct(e['iva_u'] / G, 1), '– ' + usd(e['iva_u'])], ''),
            (['Vacancia (supuesto)', pct(e['vac_u'] / G, 1), '– ' + usd(e['vac_u'])], ''), (['Administración informada (con secretaria)', pct(e['adm_u'] / G, 1), '– ' + usd(e['adm_u'])], ''),
            (['Impuesto inmobiliario informado', pct(e['imp_u'] / G, 1), '– ' + usd(e['imp_u'])], ''), (['Reserva de mantenimiento mayor', pct(e['ded']['Mantenimiento'] / G, 1), '– ' + usd(e['ded']['Mantenimiento'])], ''),
            (['Resultado antes de IRE', pct(e['pre'] / G, 1), usd(e['pre'])], 'b'), (['IRE estimado', pct(e['ire_u'] / G, 1), '– ' + usd(e['ire_u'])], ''), (['Neto anual', pct(e['net'] / G, 1), usd(e['net'])], 'tot')]
    return rows
e0 = E['E0']
S.append(slide(f'''{head('Ingresos y gastos hoy', 'Dos gastos se llevan más de la mitad de la facturación')}
<div class="two cx2"><div>{table(['Concepto', '% de la facturación', 'USD por año'], er(e0), 't big')}</div>
{crit('Lectura', [('Administración', f"Gs 10.450.000 por mes: el {pct(M['peso_admin'], 0)} de la facturación, sin desglose. Una secretaria con aportes ronda Gs 3,4 M; el resto no está identificado."), ('Impuesto inmobiliario', f"Gs 45 M por año: el {pct(M['peso_imp'], 0)} de la facturación. Es alto para el valor del inmueble: hay que verificar la boleta. Si fuera la mitad, la neta de hoy subiría a {pct(M['imp_half']['pedido'])}."), ('Neta de hoy', f"{pct(e0['neta'])} a USD 500.000 y {pct(ER['E0']['neta'])} a USD 420.000. La bruta es {pct(e0['bruta'])} y {pct(ER['E0']['bruta'])}."), ('Conclusión', 'La mejora pasa por bajar gastos y ajustar alquileres, antes que por la obra.')])}</div>
<div class="src">Base D-101: IVA incluido, crédito fiscal sobre el 40% de la administración (supuesto facturado); IRE sobre el resultado menos la depreciación. Vacancia 5% y reserva 2%: supuestos.</div>''', num()))

# 07 MERCADO
rc = [('K1', 'Consultorio de unos 20 m² con secretaria, limpieza y seguridad', 'Villa Morra', 'Gs 3.500.000 + IVA (Gs 3.850.000)'),
      ('K2', 'Consultorio de 16 m², apto médicos u odontólogos', 'Villa Morra', 'Gs 2.500.000 + gastos comunes'),
      ('K3', 'Consultorio en clínica, con secretaria, limpieza e internet (120 m²)', 'Bernardino Caballero', 'Gs 2.150.000'),
      ('K4', 'Consultorio en edificio médico profesional (70 m²)', 'San Roque', 'Gs 1.750.000'),
      ('K5', 'Consultorio equipado de 15 m² (aviso de 2024)', 'Bella Vista', 'Gs 3.500.000'),
      ('K6', 'Consultorio montado por turno', 'Asunción', 'Gs 440.000–660.000 por cada día semanal')]
S.append(slide(f'''{head('Mercado de consultorios', 'Los alquileres actuales están en la parte baja del mercado')}
{table(['ID', 'Aviso', 'Barrio', 'Precio por mes'], [(list(r), '') for r in rc], 't sm refs')}
<p class="note2 sm"><b>Lectura por m².</b> Los consultorios de la clínica miden entre 12 y 21 m² con baño (lámina de planos). Los chicos ya cobran unos Gs 180.000–200.000 por m², en línea con Villa Morra (K1: Gs 192.500 por m² con IVA). Los grandes (6, 7 y 8, de 18 a 21 m²) cobran Gs 121.000–135.000 por m²: ahí está el margen. Propuesta: alquiler según tamaño, Gs {n(M['TIER']['grande'] / 1e6, 1)} M los grandes y Gs {n(M['TIER']['resto'] / 1e6, 1)} M el resto ({gsm(M['TIER_TOT'])} por mes en total).</p>
<div class="src">Estudio de mercado de Meridiano Capital del 09/11/2026 (ASU-CONSULTORIOS-2026-11-09) en InfoCasas y NIP. Precios pedidos, no contratos. Villa Morra es el barrio vecino de San Cristóbal.</div>''', num()))

# 08 PLAN GRADUAL
steps = [('Etapa 1 · 0 a 12 meses', f"Renovar los 11 contratos con un ajuste a {gsm(M['RENT1'])} (+10%); auditar los gastos con la planilla de desglose (objetivo −15%: {gsm(M['ADMIN1'])} por mes); pintura, iluminación LED, señalética pediátrica y salas de espera ({gsm(M['MEJ_GS'])}); instalar el ascensor de 3 paradas."),
         ('Etapa 2 · 12 a 24 meses', f"Con ascensor y mejoras, alquiler según tamaño: {gsm(M['TIER']['grande'])} los tres grandes y {gsm(M['TIER']['resto'])} el resto (promedio {gsm(M['RENT2'])}). Canon diferencial para los consultorios odontológicos. Medidores individuales de energía si la luz de los consultorios está dentro de las expensas."),
         ('Etapa 3 · desde el mes 25', f"Al liberarse el departamento, reconvertirlo en consultorios con baño propio. El anteproyecto propone {M['N_NEW_BASE']} (consultorios 12 a 17, réplica del primer piso), a confirmar con el relevamiento; escenarios de 4 a 6, con USD {n(M['CAPEX_NEW_USD'])} por consultorio.")]
sh = ''.join(f'<div class="st" style="grid-column:1/-1"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Plan de valorización', 'Tres etapas para aumentar la renta y bajar los costos')}<div class="steps">{sh}</div>
<div class="src">Todos los ajustes son propuestas de Meridiano Capital: dependen de la negociación con los médicos, de los contratos y de las cotizaciones de obra. No son resultados garantizados.</div>''', num()))

# 09 ASCENSOR
arows = [(['Precio, IVA incluido', 'Gs 42.000.000', 'Gs 58.000.000'], 'b'), (['Paradas', '2 (PB y 1.er piso)', '3 (hasta el 2.º piso)'], ''), (['Capacidad', '500 kg', '630 kg'], ''),
         (['Velocidad', '0,25 m/s', '1,00 m/s'], ''), (['Recorrido', '7,20 m', '10,50 m'], ''), (['Hueco mínimo', '1,50 × 1,50 m', '1,50 × 1,50 m'], ''), (['Plazo y garantía', '30 días hábiles · 2 años', '30 días hábiles · 2 años'], '')]
S.append(slide(f'''{head('Ascensor', 'Dos cotizaciones: conviene la de tres paradas')}
<div class="two cx2"><div>{table(['Concepto', '2 paradas', '3 paradas'], arows, 't big')}</div>
{crit('Recomendación', [('3 paradas', 'Llega al segundo piso: es la condición para reconvertir el departamento en consultorios. Diferencia: Gs 16 M.'), ('Velocidad', 'El de 2 paradas va a 0,25 m/s: lento para el flujo de pacientes con niños y cochecitos.'), ('Presupuesto', f"Se modela {gsm(M['ASC_GS'])}: la cotización vencida +10% y la obra eléctrica y civil a cargo del comprador."), ('A verificar', 'Hueco, foso de 50 cm, alimentación de 380 V, habilitación municipal y mantenimiento desde el segundo año.')])}</div>
<div class="src">Cotizaciones de un proveedor local del 17/08/2026, con validez de 10 días: hay que actualizarlas. Pago 50/25/25.</div>''', num()))

# 10 GASTOS
gl = [('Desglose de los Gs 10,45 M', 'Enviamos al propietario una planilla para detallar cada rubro con su comprobante y saber qué tiene factura con IVA.'),
      ('Energía de los consultorios', 'Si la luz y el aire de cada consultorio están dentro de las expensas, conviene medirlos por separado y cobrarlos aparte.'),
      ('Contratos de servicios', 'Licitar limpieza, seguridad, internet y mantenimiento; agrupar proveedores.'),
      ('Impuesto inmobiliario', 'Verificar la boleta, el valor fiscal y si incluye tasas municipales; Gs 45 M por año parece alto.'),
      ('Recepción', 'Mantener la secretaria (es un servicio valorado) y sumar un sistema de turnos para que atienda más consultorios.')]
S.append(slide(f'''{head('Palancas de costo', 'Dónde buscar el 15% de ahorro')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in gl)}</div>
<div class="src">El objetivo de −15% es una meta de Meridiano Capital a validar con el desglose real de los gastos.</div>''', num()))

# 11 RENTABILIDAD POR ETAPA
hdr = '<div></div>' + ''.join(f'<div class="bl2 c{" gold" if k == "E2" else ""}">{NOMBRE_ET[k]}</div>' for k in ('E0', 'E1', 'E2', 'E3'))
def rowr(lbl, f, cls):
    return f'<div class="rl">{lbl}</div>' + ''.join(f'<div class="{cls}">{f(k)}</div>' for k in ('E0', 'E1', 'E2', 'E3'))
S.append(slide(f'''{head('Rentabilidad por etapa', 'De la renta de hoy a la renta estabilizada')}<div class="rule"></div>
<div class="rg4">{hdr}{rowr('Facturación mensual', lambda k: gsm(E[k]['fact_mes']), 'midv s2')}{rowr('Bruta · USD 500.000', lambda k: pct(E[k]['bruta']), 'bigv m4')}{rowr('Neta · USD 500.000', lambda k: pct(E[k]['neta']), 'midv')}{rowr('Neta · USD 420.000', lambda k: pct(ER[k]['neta']), 'midv')}{rowr('Inversión total · USD 500.000', lambda k: usd(E[k]['inv']), 'midv s2')}</div>
<div class="bs how"><b>Cómo leer estas cifras.</b> Cada columna es un año estabilizado de esa etapa. El denominador es el precio más las inversiones acumuladas (mejoras, ascensor y, en la etapa 3, la reconversión). La etapa 3 supone {M['N_NEW_BASE']} consultorios nuevos, número ilustrativo a definir con el plano. Cifras de referencia, no garantizadas.</div>''', num(), dark=True))

# 11b ANTEPROYECTO (anexo de corrección del 10/11/2026: 3 hojas)
def fig(src, cap, w, h, fit='contain', bg='#fff'):
    return f'<figure style="width:{w}px;margin:0"><img src="img/{src}" style="width:{w}px;height:{h}px;object-fit:{fit};background:{bg};display:block"><figcaption style="font-size:11px;margin-top:6px">{cap}</figcaption></figure>'
S.append(slide(f"""{head('Anteproyecto · hoja 1 de 3', 'Planta baja: implantación y sanitarios')}
<div class="two" style="grid-template-columns:360px 1fr !important;gap:34px;margin-top:14px">{fig('plano_pb_anotado.jpg', 'PLANO ORIGINAL fotografiado, sin alterar cotas ni geometría. Marcas agregadas por Meridiano Capital.', 360, 395)}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-content:start">
{crit('Implantación', [('Calle Sucre', 'Frente corto de 9,60 m. Estacionamiento de clientes en una franja de 5,00 m de profundidad en planta baja, sujeto a maniobras, retiro y habilitación. Sin entradas desde Sucre.'), ('Calle Juan Mota', 'Lado largo: único frente de acceso peatonal a la clínica. Sin estacionamientos.'), ('Pulmones de luz', 'Hacia el lindero vecino, nunca hacia la calle.')])}
{crit('Sanitarios del plano original', [('Consultorios 1 a 5', 'Cada uno con su baño propio.'), ('A · Fondo del pasillo', 'Bloque adicional de sanitarios y depósito.'), ('B · Recepción y espera', 'Sanitario de uso común contiguo a la espera.'), ('C · Junto a la escalera', 'Sanitario marcado en verde en el plano.')])}</div></div>
<div class="src">Esquema de revisión, no plano ejecutivo ni aprobación municipal. La foto del plano no permite certificar todas las cotas ni dimensionar las plazas de estacionamiento. Las calles se ubican según la corrección del propietario: la orientación del papel no coincide con la orientación vial. Aberturas y accesos actuales a verificar en sitio.</div>""", num()))
S.append(slide(f"""{head('Anteproyecto · hoja 2 de 3', 'Primer piso: consultorios 6 a 11')}
<div class="two" style="grid-template-columns:360px 1fr !important;gap:34px;margin-top:14px">{fig('plano_pa.jpg', 'PLANO ORIGINAL fotografiado: referencia geométrica para el segundo piso.', 360, 395)}
<div>{crit('Elementos a preservar', [('Consultorios', 'Seis consultorios existentes: 6, 7, 8, 9, 10 y 11, cada uno con baño privado según el propietario; contrastar cada pieza con la planimetría.'), ('Circulación', 'Escalera, recepción, espera y pasillo central.'), ('Pulmones de luz', 'Patios interiores junto al lindero con el vecino.'), ('Núcleo vertical', 'Acceso desde calle Juan Mota; ascensor de 3 paradas como propuesta, sujeto a comprobación dimensional.'), ('A verificar', 'Ventilación de baños, bajadas, estructura, accesibilidad y ancho útil de puertas, en un relevamiento profesional.')])}</div></div>
<div class="src">No modificar el perímetro ni trasladar patios al frente de calle. Corrección documental de anteproyecto, no plano ejecutivo.</div>""", num()))
S.append(slide(f"""{head('Anteproyecto · hoja 3 de 3', 'Segundo piso: propuesta de consultorios 12 a 17')}
<div class="two" style="grid-template-columns:1fr 360px !important;gap:30px;margin-top:18px">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">{fig('render_fachada.jpg', 'RENDER CONCEPTUAL de la fachada propuesta: no es una foto ni una elevación medida.', 330, 150, 'cover')}{fig('fachada.jpg', 'FOTOGRAFÍA REAL de la fachada actual.', 330, 150, 'cover')}
<div style="grid-column:1/-1">{crit('Programa propuesto · réplica funcional, no calco ejecutivo', [('Consultorios', 'C12 ↔ C6 · C13 ↔ C7 · C14 ↔ C8 · C15 ↔ C9 · C16 ↔ C10 · C17 ↔ C11, cada uno con baño individual; alineación sanitaria a estudiar.'), ('Circulación y acceso', 'Pasillo central, recepción y espera como en el primer piso; acceso solo desde Juan Mota por el núcleo vertical común. Estacionamiento solo sobre Sucre.')])}</div></div>
{crit('Falta para un plano de ejecución', [('Relevamiento', 'Plano de la vivienda actual, perímetro del segundo piso, columnas, bajadas, núcleos húmedos, patios y cotas.'), ('Coordinación', 'Estructura, ventilación, desagües y habilitación sanitaria antes de fijar tabiques.'), ('Patios de luz', 'Sobre el lindero interior, nunca en la fachada de calle.'), ('Hasta entonces', 'No se pueden certificar seis consultorios con baño: la rentabilidad futura usa 6 como base y muestra también 4 y 5.')])}</div>
<div class="src">La fachada propuesta no representa la obra existente y no está presupuestada en el modelo. Anteproyecto conceptual: no es plano ejecutivo ni aprobación municipal.</div>""", num()))

# 12 RECONVERSIÓN
rv = M['reconv']
rrows = [([f'{k} consultorios', usd(int(k) * M['CAPEX_NEW_USD']), gsm(rv['pedido'][k]['fact_mes']), pct(rv['pedido'][k]['neta']), pct(rv['rapida'][k]['neta'])], 'b' if int(k) == M['N_NEW_BASE'] else '') for k in rv['pedido']]
S.append(slide(f'''{head('Reconversión del departamento', 'Nuevos consultorios en el segundo piso, desde el mes 25')}
<div class="two cx2"><div>{table(['Escenario', 'Inversión', 'Facturación mensual', 'Neta · USD 500.000', 'Neta · USD 420.000'], rrows, 't big')}</div>
{crit('Condiciones', [('Plano', 'La cantidad de consultorios depende de la superficie, los baños y la circulación del segundo piso: se define con un anteproyecto.'), ('Ascensor', 'Necesita el de 3 paradas para el acceso de pacientes.'), ('Habilitación', 'Ampliación de la habilitación sanitaria y municipal.'), ('Mientras tanto', 'Dos años como vivienda del comprador: no se computa renta en ese período. Si prefiere alquilarlo o reconvertirlo antes, la renta sube antes.')])}</div>
<div class="src">Inversión por consultorio: unos 25 m² a USD 450/m² (tabla de Meridiano) más baño, con 10% de imprevistos. Alquiler de los nuevos: {gsm(M['RENT2'])}. Supuestos a validar.</div>''', num()))

# 12b RENTABILIDAD FUTURA (2.º piso reconvertido)
E2p, E3p, E2r, E3r = E['E2'], E['E3'], ER['E2'], ER['E3']
d_net = E3p['net'] - E2p['net']; d_inv = E3p['inv'] - E2p['inv']; d_G = E3p['G'] - E2p['G']
r3, r5 = rv['pedido']['4'], rv['pedido']['5']; q3, q5 = rv['rapida']['4'], rv['rapida']['5']
frows = [(['Consultorios en renta', '11', '11', str(E3p.get('n', 11 + M['N_NEW_BASE']))], ''),
         (['Facturación mensual (IVA incluido)', gsm(E['E0']['fact_mes']), gsm(E2p['fact_mes']), gsm(E3p['fact_mes'])], ''),
         (['Ingreso bruto anual', usd(E['E0']['G']), usd(E2p['G']), usd(E3p['G'])], ''),
         (['Neto anual (base D-101)', usd(E['E0']['net']), usd(E2p['net']), usd(E3p['net'])], 'b'),
         (['Bruta · neta, compra a USD 500.000', pct(E['E0']['bruta']) + ' · ' + pct(E['E0']['neta']), pct(E2p['bruta']) + ' · ' + pct(E2p['neta']), pct(E3p['bruta']) + ' · ' + pct(E3p['neta'])], ''),
         (['Bruta · neta, compra a USD 420.000', pct(ER['E0']['bruta']) + ' · ' + pct(ER['E0']['neta']), pct(E2r['bruta']) + ' · ' + pct(E2r['neta']), pct(E3r['bruta']) + ' · ' + pct(E3r['neta'])], 'tot')]
S.append(slide(f'''{head('Rentabilidad futura', 'El edificio con el segundo piso convertido en consultorios')}
<div class="two d15">{table(['', 'Hoy', 'Tras la etapa 2', 'Con el 2.º piso reconvertido'], frows, 't big')}
<div class="dbox"><div class="bs">Lo que agrega la reconversión</div><div class="bigv bv2">+{usd(d_net)}</div><div class="bs">de neto por año, con {M['N_NEW_BASE']} consultorios nuevos</div>
<p>Inversión de la reconversión: {usd(d_inv)}. Rinde {pct(d_net / d_inv, 1)} neto por año sobre lo invertido (se recupera en unos {n(d_inv / d_net, 1)} años), porque usa la estructura, el ascensor y la administración que ya existen.</p>
<p class="gold">Si el relevamiento da menos: con 4 consultorios, neta de {pct(r3['neta'])} · {pct(q3['neta'])}; con 5, de {pct(r5['neta'])} · {pct(q5['neta'])} (a USD 500.000 · 420.000).</p></div></div>
<div class="src">Año estabilizado de cada etapa; el denominador es el precio más las inversiones acumuladas (mejoras, ascensor de 3 paradas y reconversión). La renta del 2.º piso empieza en el mes 25, cuando termina el uso como vivienda del comprador. Los consultorios nuevos se alquilan a {gsm(M['RENT2'])}. El ascensor no se carga a la reconversión porque ya se invierte en la etapa 1. No incluye la renta alternativa que daría el departamento como vivienda. Cifras de referencia, no garantizadas; supuestos a validar con el anteproyecto.</div>''', num()))

# 13 TIR
prj = M['proj']
trows = [([f"Compra a {usd(PR[p])}"] + [pct(prj[p][k]['tir'], 1) for k in ('Conservador', 'Base', 'Optimista')] + [pct(prj[p]['sin_reconv']['tir'], 1), usd(prj[p]['Base']['total'])], 'b' if p == 'rapida' else '') for p in ('pedido', 'rapida')]
S.append(slide(f'''{head('Plusvalía y retorno total', 'TIR estimada a cinco años, con el plan por etapas')}
<div class="two d15">{table(['Precio', 'Conservador', 'Base', 'Optimista', 'Base sin reconversión', 'Ganancia base'], trows, 't big')}
<div class="dbox"><div class="bigv bv2">{pct(prj['pedido']['Base']['tir'], 1)} · {pct(prj['rapida']['Base']['tir'], 1)}</div><div class="bs">TIR base a USD 500.000 y a USD 420.000</div><p>Año 1: medio año con la renta de hoy y medio con la etapa 1. Año 2: etapa 2. Año 3: reconversión desde el mes 25. Años 4 y 5: etapa 3. Venta al cierre del año 5. Incluye el crédito fiscal del IVA de las obras (D-101).</p><p class="gold">Escenarios: alquileres +2/+3/+5% desde el año 4 y valorización 2/3,5/5% anual sobre la inversión total.</p></div></div>
<div class="src">Escenarios hipotéticos: no constituyen garantía de plusvalía ni de rentabilidad. No incluyen gastos de adquisición ni comisión de venta.</div>''', num()))

# 14 PRECIO
info = [('Activo', 'Edificio médico de tres plantas: clínica en planta baja y primer piso con 11 consultorios alquilados, y departamento en el segundo piso.'),
        ('Ocupación', '11 consultorios alquilados; el departamento se entrega libre, para vivienda del comprador o para reconvertir.'),
        ('Venta rápida', f"{usd(PR['rapida'])} (−16%): escenario de cierre ágil."),
        ('Alquiler requerido', f"Para una neta de 8% en la etapa 2: unos {gsm(M['req8']['pedido'])} por consultorio a USD 500.000 y {gsm(M['req8']['rapida'])} a USD 420.000.")]
ih = ''.join(f'<div class="ii"><div class="eb sm">{a}</div><div>{b}</div></div>' for a, b in info)
S.append(slide(f'''{head('Precio y condiciones', 'Venta del edificio completo')}
<div class="two d16"><div class="dbox big"><div class="bigv">{usd(PR['pedido'])}</div><div class="bs">Precio de venta · {gs(PR['pedido'] * TC)}</div><div class="bigv sm2">{usd(PR['rapida'])}</div><div class="bs">Precio de venta rápida</div><p>Precio en dólares; alquileres en guaraníes, convertidos al {TCTXT}.</p><div class="dfoot">Neta hoy: {pct(E['E0']['neta'])} · {pct(ER['E0']['neta'])} · tras la etapa 2: {pct(E['E2']['neta'])} · {pct(ER['E2']['neta'])}</div></div>
<div class="info">{ih}</div></div>''', num()))

# 15 RIESGOS
rk = [('Contratos', 'Según el paquete recibido, los 11 contratos vencieron hace cuatro meses y siguen sin renovarse: hay que revisarlos con el abogado antes de comprar.'),
      ('Gastos sin desglose', 'Gs 10,45 M por mes sin detalle: la mejora depende de identificar qué se puede reducir.'),
      ('Impuesto inmobiliario', 'Gs 45 M por año a verificar con la boleta; pesa el 13,6% de la facturación.'),
      ('Ajuste de alquileres', 'Depende de la aceptación de los médicos; un ajuste brusco puede generar vacancia.'),
      ('Ascensor y reconversión', 'Cotización vencida, factibilidad técnica, habilitaciones y número real de consultorios del segundo piso.'),
      ('Tipo de cambio e impuestos', 'Precio en dólares y alquileres en guaraníes; el IRE y el crédito fiscal los confirma el contador.')]
S.append(slide(f'''{head('Consideraciones', 'Riesgos a evaluar antes de ofertar')}<div class="rks c7">{''.join(f'<div class="rk"><b>{a}</b><span>{b}</span></div>' for a, b in rk)}</div>
<div class="src">Cifras de referencia, no garantizadas. Se recomienda evaluar la operación con asesoría propia.</div>''', num()))

# 16 PROCESO
steps = [('Información', 'Desglose de gastos, boleta del impuesto inmobiliario, contratos y cobranza de los últimos 12 meses.'), ('Visita e inspección', 'Recorrido con inspección técnica de instalaciones, hueco del ascensor y segundo piso.'),
         ('Oferta y revisión notarial', 'Propuesta de precio y forma de pago; título y condiciones de dominio, a cargo del escribano.'), ('Estructura y fiscal', 'Compra a nombre propio o por sociedad (S.A.), IVA e impuesto a la renta, con el contador.'),
         ('Contratos', 'Renovación de los 11 contratos con el abogado, con el ajuste gradual acordado.'), ('Plan de valorización', 'Mejoras, ascensor y administración del edificio, si el inversor lo desea.')]
sh = ''.join(f'<div class="st"><div class="sth"><span class="pn">0{i+1}</span><b>{a}</b></div><p>{b}</p></div>' for i, (a, b) in enumerate(steps))
S.append(slide(f'''{head('Proceso de compra', 'Cómo avanzamos, paso a paso')}<div class="steps">{sh}</div>
<div class="src">Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div>''', num()))

# 17 CIERRE
S.append(f'''<section class="s close"><div class="cl2">{logo()}
<h2 class="ch">Coordinemos su visita a la clínica</h2>
<p class="cp">Recorremos el edificio, revisamos contratos y gastos con usted y preparamos el plan de valorización, el ascensor y la reconversión del segundo piso. Lo acompañamos en la compra y en la administración.</p>
<div class="crule"></div><div class="cn">Lic. Juan José Castillo</div><div class="cr2">Broker Inmobiliario &nbsp;|&nbsp; Meridiano Capital</div>
<div class="cc">{contacto_linea()}</div>
<div class="disc">Documento comercial de referencia. Precio y condiciones sujetos a confirmación y disponibilidad; las condiciones definitivas se formalizan en el boleto de compraventa. Las rentabilidades son estimaciones con gastos informados sin desglose y no constituyen una garantía.</div></div>
<div class="cimg"><img src="img/portrait.jpg"></div></section>''')

css = open(os.path.join(B, 'style.css')).read()
fonts = open(os.path.join(B, 'fonts', 'fonts.css')).read()
open(os.path.join(B, 'deck.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{PROJ} — Edificio médico en renta</title><style>{fonts}{css}</style></head><body>{"".join(S)}</body></html>')
print('slides', len(S))
