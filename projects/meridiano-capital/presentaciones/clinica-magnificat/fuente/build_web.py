"""Presentación web de la Clínica Magnificat (base: index.html del paquete del founder, 09/11/2026).

Genera ../web/index.html autocontenido. Cifras de model.json; simulador en JS con la misma base D-101.
Las fotos y planos se toman de img/ y planos/ cuando existan (ZIP de imágenes pendiente).
"""
import os, sys, json, shutil, html, glob
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, contacto_linea  # D-096 / D-097
from rentabilidad import IRE, IVA_G, DEP, PARTE_EDIF  # D-101

B = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(B, '..', 'web')
M = json.load(open(os.path.join(B, 'model.json')))
E, ER = M['etapas']['pedido'], M['etapas']['rapida']
def n(x, d=0): return f"{x:,.{d}f}".replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def gsm(x): return 'Gs ' + n(x / 1e6, 2).rstrip('0').rstrip(',') + ' M'

os.makedirs(os.path.join(WEB, 'assets'), exist_ok=True); os.makedirs(os.path.join(WEB, 'fonts'), exist_ok=True)
for f in os.listdir(os.path.join(B, 'fonts')):
    if f.endswith('.woff2'): shutil.copyfile(os.path.join(B, 'fonts', f), os.path.join(WEB, 'fonts', f))
LEY = json.load(open(os.path.join(B, 'img', 'leyendas.json'))) if os.path.exists(os.path.join(B, 'img', 'leyendas.json')) else {}
fotos = []
for f in sorted(os.listdir(os.path.join(B, 'img'))):
    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
        shutil.copyfile(os.path.join(B, 'img', f), os.path.join(WEB, 'assets', f))
        if f in LEY: fotos.append((f, LEY[f]))
fonts_css = open(os.path.join(B, 'fonts', 'fonts.css')).read()
MAPS = 'https://maps.app.goo.gl/kKoH14evyzGWSrUP9'
AVISO = 'Edificio en funcionamiento. Cifras de referencia, no garantizadas; propuestas de mejora conceptuales.'

def amb(nombre):
    t = nombre.lower()
    return 'departamento' if 'depto' in t or 'departamento' in t else ('consultorios' if 'consultorio' in t else ('exterior' if any(k in t for k in ('fachada', 'exterior', 'cochera', 'frente', 'lateral')) else 'comunes'))
gal = ''.join(f'<figure class="g" data-amb="{amb(f + c)}"><button class="zoom"><img src="assets/{f}" alt="{html.escape(c)} (fotografía)" loading="lazy"></button><figcaption>{html.escape(c)}</figcaption></figure>' for f, c in fotos) \
      or '<p class="note">Las fotografías del estado actual se incorporan con el ZIP de imágenes del propietario.</p>'
et_rows = ''.join(f'<tr><th scope="row">{nm}</th><td>{gsm(E[k]["fact_mes"])}</td><td>{usd(E[k]["inv"])}</td><td>{pct(E[k]["bruta"])}</td><td>{pct(E[k]["neta"])}</td><td>{pct(ER[k]["neta"])}</td></tr>'
                  for k, nm in (('E0', 'Hoy'), ('E1', 'Etapa 1 · 0 a 12 meses'), ('E2', 'Etapa 2 · 12 a 24 meses'), ('E3', f'Etapa 3 · desde el mes 25 ({M["N_NEW_BASE"]} consultorios nuevos, ilustrativo)')))
SIM = dict(tc=M['TC'], n=M['N'], rent=M['RENT0'], admin=M['ADMIN0'], imp=M['IMP_INMO'], vac=M['VAC'], mant=M['MANT'], fact=M['FACTURABLE'], ivag=IVA_G, ire=IRE, dep=DEP, pe=PARTE_EDIF, precio=M['PRICES']['pedido'], obra=0)

page = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Clínica Magnificat | Meridiano Capital</title><meta name="description" content="Clínica pediátrica en funcionamiento en Asunción, en venta, con plan de valorización por etapas.">
<style>{fonts_css}
:root{{--pet:#14313A;--tie:#8B3323;--lap:#C9982E;--cre:#F3EDE3;--gri:#6B6154;--lin:#DAD2C0;--ink:#1d2b30}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}@media(prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}}}
body{{margin:0;background:var(--cre);color:var(--ink);font:16px/1.65 Poppins,system-ui,sans-serif}}
h1,h2,h3{{font-family:FrauncesJ,Fraunces,Georgia,serif;font-weight:400;font-variation-settings:'opsz' 80,'SOFT' 24,'WONK' 0;color:var(--pet)}}
a{{color:var(--tie)}}:focus-visible{{outline:3px solid var(--lap);outline-offset:2px}}
.aviso{{position:sticky;top:0;z-index:20;background:var(--tie);color:#fff;text-align:center;font-size:13px;padding:6px 12px}}
header{{position:sticky;top:31px;z-index:19;background:#14313Af2;color:var(--cre);display:flex;justify-content:space-between;align-items:center;gap:16px;padding:10px 4%;flex-wrap:wrap}}
.brand{{display:flex;align-items:center;gap:10px;letter-spacing:.12em;font-size:12px}}.brand svg{{width:28px}}
nav{{display:flex;gap:16px;flex-wrap:wrap}}nav a{{color:#d9e0de;text-decoration:none;font-size:12.5px}}nav a:hover{{color:#fff}}
section{{scroll-margin-top:90px;padding:64px max(4%,calc((100vw - 1180px)/2));border-bottom:1px solid var(--lin)}}
.eb{{text-transform:uppercase;letter-spacing:.2em;color:var(--lap);font-size:12px;font-weight:600}}
h2{{font-size:clamp(30px,4vw,50px);line-height:1.1;margin:8px 0 18px}}h3{{font-size:22px;margin:6px 0 8px}}
.hero{{background:var(--pet);color:var(--cre)}}.hero h1{{color:var(--cre);font-size:clamp(46px,7vw,96px);line-height:.95;margin:0 0 18px}}.hero p{{max-width:780px;font-size:18px}}
.stats{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}}.stat{{background:#fff;border:1px solid var(--lin);padding:18px}}.hero .stat{{background:#ffffff10;border-color:#ffffff30}}
.stat strong{{display:block;font:28px FrauncesJ,Fraunces,serif;color:var(--tie)}}.hero .stat strong{{color:var(--lap)}}.stat small{{color:var(--gri)}}.hero .stat small{{color:#cfd6d7}}
.note{{border-left:3px solid var(--lap);background:#fff;padding:12px 18px;margin-top:18px;font-size:14px}}.warn{{border-left-color:var(--tie)}}
.tw{{overflow:auto}}table{{width:100%;border-collapse:collapse;background:#fff;font-size:14px}}th,td{{padding:10px 12px;border-bottom:1px solid var(--lin);text-align:left}}thead th{{background:var(--pet);color:#fff;font-weight:500}}
.steps{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}}.steps div{{background:#fff;border:1px solid var(--lin);padding:18px}}
.filters{{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}}.filters button{{border:1px solid var(--pet);background:#fff;color:var(--pet);padding:6px 14px;border-radius:30px;cursor:pointer;font:500 13px Poppins}}.filters button[aria-pressed=true]{{background:var(--pet);color:#fff}}
.gallery{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}}.g{{margin:0;background:#fff;border:1px solid var(--lin)}}.g[hidden]{{display:none}}.zoom{{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in}}.g img{{width:100%;height:240px;object-fit:cover;display:block}}figcaption{{padding:8px 12px;font-size:13.5px}}
.sim{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}.sim label{{display:block;font-size:13px;margin:10px 0 2px;color:var(--gri)}}.sim input{{width:100%}}.out{{background:var(--pet);color:#fff;padding:22px}}.out b{{font:34px FrauncesJ,Fraunces,serif;color:var(--lap);display:block}}
.loc{{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center}}.loc img{{width:150px}}
.close{{background:var(--tie);color:var(--cre)}}.close h2{{color:var(--cre)}}.close a{{color:#fff}}
.btn{{background:var(--lap);color:var(--pet);border:0;padding:10px 18px;cursor:pointer;font:600 13px Poppins}}
footer{{padding:26px 4%;font-size:12.5px;color:var(--gri)}}
dialog{{border:0;padding:10px;background:#0b1d22;max-width:96vw}}dialog img{{max-width:92vw;max-height:82vh;display:block}}
@media(max-width:820px){{header{{position:static}}.stats,.steps,.gallery,.sim,.loc{{grid-template-columns:1fr}}section{{padding:52px 16px}}}}
@media print{{.aviso{{position:static}}header,.filters,.noprint,dialog{{display:none!important}}body{{background:#fff}}section{{page-break-after:always;padding:16mm 12mm}}.hero,.out,.close,thead th{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.g[hidden]{{display:block!important}}}}
</style></head><body>
<div class="aviso" role="note">{AVISO}</div>
<header><div class="brand"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 6 L14 100 L106 100 Z" fill="none" stroke="#F3EDE3" stroke-width="6" stroke-linejoin="round"/><line x1="4" y1="112" x2="116" y2="112" stroke="#F3EDE3" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="72" r="9" fill="#C9982E"/></svg>MERIDIANO CAPITAL · CLÍNICA MAGNIFICAT</div>
<nav aria-label="Secciones"><a href="#hoy">Hoy</a><a href="#mercado">Mercado</a><a href="#plan">Plan</a><a href="#ascensor">Ascensor</a><a href="#rentabilidad">Rentabilidad</a><a href="#simulador">Simulador</a><a href="#galeria">Fotos</a></nav></header>
<main>
<section class="hero"><div class="eb">Edificio médico en renta · Asunción</div><h1>Clínica<br>Magnificat</h1>
<p>Clínica pediátrica en funcionamiento: 11 consultorios con baño propio, todos alquilados, cinco preparados para odontología, y un departamento en el segundo piso que se entrega libre: vivienda del comprador por dos años y luego reconversión en consultorios.</p>
<div class="stats"><div class="stat"><strong>{usd(M['PRICES']['pedido'])}</strong><small>Precio de venta</small></div><div class="stat"><strong>{usd(M['PRICES']['rapida'])}</strong><small>Venta rápida (−16%)</small></div>
<div class="stat"><strong>{gsm(E['E0']['fact_mes'])}</strong><small>Facturación mensual, IVA y expensas incluidos</small></div><div class="stat"><strong>11 / 11</strong><small>Consultorios alquilados, sin mobiliario</small></div></div></section>

<section id="hoy"><div class="eb">01 · Ingresos y gastos hoy</div><h2>Dos gastos se llevan más de la mitad de la facturación</h2>
<div class="stats"><div class="stat"><strong>{pct(M['peso_admin'], 0)}</strong><small>Administración: Gs 10.450.000 por mes, sin desglose (incluye secretaria)</small></div><div class="stat"><strong>{pct(M['peso_imp'], 0)}</strong><small>Impuesto inmobiliario informado: Gs 45 M por año, a verificar</small></div>
<div class="stat"><strong>{pct(E['E0']['bruta'])}</strong><small>Bruta hoy a USD 500.000 ({pct(ER['E0']['bruta'])} a USD 420.000)</small></div><div class="stat"><strong>{pct(E['E0']['neta'])}</strong><small>Neta hoy a USD 500.000 ({pct(ER['E0']['neta'])} a USD 420.000)</small></div></div>
<div class="note warn"><b>Contratos:</b> según el paquete recibido, los 11 contratos vencieron hace cuatro meses y no se renovaron. No se supone su renovación automática: deben revisarse con el abogado antes de comprar.</div>
<div class="note">Base de cálculo D-101 de Meridiano: el alquiler incluye IVA (10%); se paga el IVA contenido menos el crédito fiscal de los gastos facturados, y el IRE se aplica sobre el resultado menos la depreciación. Vacancia 5% y reserva de mantenimiento 2%: supuestos.</div></section>

<section id="mercado"><div class="eb">02 · Mercado</div><h2>Los alquileres actuales están en la parte baja del mercado</h2>
<div class="tw"><table><thead><tr><th>Aviso</th><th>Barrio</th><th>Precio por mes</th></tr></thead><tbody>
<tr><td>Consultorio de unos 20 m² con secretaria, limpieza y seguridad</td><td>Villa Morra</td><td>Gs 3.500.000 + IVA</td></tr><tr><td>Consultorio de 16 m², apto médicos u odontólogos</td><td>Villa Morra</td><td>Gs 2.500.000 + gastos comunes</td></tr>
<tr><td>Consultorio en clínica con secretaria, limpieza e internet</td><td>Bernardino Caballero</td><td>Gs 2.150.000</td></tr><tr><td>Consultorio en edificio médico profesional</td><td>San Roque</td><td>Gs 1.750.000</td></tr></tbody></table></div>
<p>Por m², los consultorios chicos (12–14 m²) ya cobran unos Gs 180.000–200.000, en línea con Villa Morra; los tres grandes (18–21 m²) cobran Gs 121.000–135.000: ahí está el margen. Propuesta: alquiler según tamaño ({gsm(M['TIER']['grande'])} los grandes y {gsm(M['TIER']['resto'])} el resto). Estudio de Meridiano del 09/11/2026; precios pedidos, no contratos.</p></section>

<section id="plan"><div class="eb">03 · Plan de valorización</div><h2>Tres etapas para aumentar la renta y bajar los costos</h2>
<div class="steps"><div><h3>Etapa 1 · 0 a 12 meses</h3><p>Renovación de contratos con ajuste a {gsm(M['RENT1'])}; auditoría de gastos con la planilla de desglose (objetivo −15%); mejoras de áreas comunes; ascensor de 3 paradas.</p></div>
<div><h3>Etapa 2 · 12 a 24 meses</h3><p>Segundo ajuste a {gsm(M['RENT2'])}; canon diferencial para los consultorios odontológicos; medidores de energía por consultorio si corresponde.</p></div>
<div><h3>Etapa 3 · desde el mes 25</h3><p>Reconversión del departamento en consultorios con baño propio; el anteproyecto propone 6 (consultorios 12 a 17, réplica del primer piso), a confirmar con el relevamiento (escenarios de 4 a 6).</p></div></div></section>

<section id="ascensor"><div class="eb">04 · Ascensor</div><h2>Conviene la cotización de tres paradas</h2>
<div class="tw"><table><thead><tr><th>Concepto</th><th>2 paradas</th><th>3 paradas</th></tr></thead><tbody><tr><td>Precio, IVA incluido</td><td>Gs 42.000.000</td><td>Gs 58.000.000</td></tr><tr><td>Capacidad · velocidad</td><td>500 kg · 0,25 m/s</td><td>630 kg · 1,00 m/s</td></tr><tr><td>Recorrido</td><td>7,20 m</td><td>10,50 m (llega al 2.º piso)</td></tr><tr><td>Plazo · garantía</td><td>30 días hábiles · 2 años</td><td>30 días hábiles · 2 años</td></tr></tbody></table></div>
<p>Cotizaciones del 17/08/2026 con validez de 10 días: hay que actualizarlas. La de 3 paradas es la condición para reconvertir el segundo piso.</p></section>

<section id="rentabilidad"><div class="eb">05 · Rentabilidad por etapa</div><h2>De la renta de hoy a la renta estabilizada</h2>
<div class="tw"><table><thead><tr><th>Etapa</th><th>Facturación mensual</th><th>Inversión total (USD 500.000)</th><th>Bruta</th><th>Neta · USD 500.000</th><th>Neta · USD 420.000</th></tr></thead><tbody>{et_rows}</tbody></table></div>
<p>TIR base a cinco años: {pct(M['proj']['pedido']['Base']['tir'], 1)} a USD 500.000 y {pct(M['proj']['rapida']['Base']['tir'], 1)} a USD 420.000. Alquileres en guaraníes al {tc_texto()}. Cifras de referencia, no garantizadas.</p></section>

<section id="simulador" class="noprint"><div class="eb">06 · Simulador</div><h2>Pruebe sus propios supuestos</h2>
<div class="sim"><div>
<label for="s_precio">Precio de compra (USD)</label><input id="s_precio" type="number" step="5000" value="{SIM['precio']}">
<label for="s_n">Consultorios</label><input id="s_n" type="number" min="1" max="30" value="{SIM['n']}">
<label for="s_rent">Alquiler por consultorio, IVA incluido (Gs/mes)</label><input id="s_rent" type="number" step="50000" value="{SIM['rent']}">
<label for="s_vac">Vacancia (%)</label><input id="s_vac" type="number" step="1" value="{SIM['vac'] * 100:g}">
<label for="s_admin">Administración (Gs/mes)</label><input id="s_admin" type="number" step="100000" value="{SIM['admin']}">
<label for="s_imp">Impuesto inmobiliario (Gs/año)</label><input id="s_imp" type="number" step="1000000" value="{SIM['imp']}">
<label for="s_obra">Inversión en obras (USD)</label><input id="s_obra" type="number" step="1000" value="0">
<label for="s_tc">Tipo de cambio (Gs/USD)</label><input id="s_tc" type="number" step="10" value="{SIM['tc']:.2f}"></div>
<div class="out" aria-live="polite"><span>Rentabilidad bruta</span><b id="o_b">—</b><span>Rentabilidad neta</span><b id="o_n">—</b><span>Neto anual</span><b id="o_net" style="font-size:26px">—</b>
<p style="font-size:12.5px;color:#cfd6d7">Misma base que la presentación (D-101): IVA 10% incluido con crédito fiscal sobre el {pct(SIM['fact'], 0)} de la administración y la reserva de mantenimiento ({pct(SIM['mant'], 0)}); IRE {pct(SIM['ire'], 0)} sobre el resultado menos la depreciación ({pct(SIM['dep'], 1)} de la obra y de la mitad del precio).</p></div></div></section>

<section id="galeria"><div class="eb">07 · Fotografías</div><h2>El edificio hoy</h2>
<div class="filters noprint" role="group" aria-label="Filtrar por ambiente"><button data-v="todos" aria-pressed="true">Todos</button><button data-v="exterior" aria-pressed="false">Exterior</button><button data-v="comunes" aria-pressed="false">Áreas comunes</button><button data-v="consultorios" aria-pressed="false">Consultorios</button><button data-v="departamento" aria-pressed="false">Departamento</button></div>
<div class="gallery">{gal}</div></section>

<section id="ubicacion"><div class="eb">08 · Ubicación</div><h2>Barrio San Cristóbal, Asunción</h2><div class="loc"><img src="assets/qr_ubicacion.png" alt="Código QR de la ubicación"><div><p><a href="{MAPS}">{MAPS.replace("https://", "")}</a></p><p>Barrio San Cristóbal, vecino de Villa Morra. Catastro a confirmar.</p></div></div></section>

<section class="close"><div class="eb">Contacto</div><h2>Coordinemos su visita</h2><p>Lic. Juan José Castillo · Broker Inmobiliario | Meridiano Capital</p><p>{contacto_linea()}</p><button class="btn noprint" type="button" onclick="window.print()">Imprimir o guardar en PDF</button></section>
</main><footer>{AVISO} Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</footer>
<dialog id="lb"><button class="btn" type="button" id="lbx">Cerrar ×</button><img id="lbi" alt=""></dialog>
<script>
(function(){{
var P={json.dumps(SIM)};
function v(id){{return parseFloat(document.getElementById(id).value)||0;}}
function f(x,d){{return x.toLocaleString('es-PY',{{minimumFractionDigits:d,maximumFractionDigits:d}});}}
function calc(){{var tc=v('s_tc'),pr=v('s_precio'),ob=v('s_obra');var G=v('s_n')*v('s_rent')*12/tc,vac=G*v('s_vac')/100,mant=G*P.mant;
var adm=v('s_admin')*12/tc,imp=v('s_imp')/tc;var deb=(G-vac)*0.10/1.10,cred=(mant+adm*P.fact)*P.ivag/(1+P.ivag),iva=Math.max(0,deb-cred);
var pre=G-vac-mant-iva-adm-imp,dep=P.dep*(ob+P.pe*pr),net=pre-P.ire*Math.max(0,pre-dep),inv=pr+ob;
document.getElementById('o_b').textContent=f(G/inv*100,2)+'%';document.getElementById('o_n').textContent=f(net/inv*100,2)+'%';document.getElementById('o_net').textContent='USD '+f(net,0);}}
document.querySelectorAll('.sim input').forEach(function(i){{i.addEventListener('input',calc);}});calc();
document.querySelectorAll('.filters button').forEach(function(b){{b.addEventListener('click',function(){{document.querySelectorAll('.filters button').forEach(function(x){{x.setAttribute('aria-pressed',x===b?'true':'false');}});
document.querySelectorAll('.g').forEach(function(g){{g.hidden=!(b.dataset.v==='todos'||g.dataset.amb===b.dataset.v);}});}});}});
var lb=document.getElementById('lb');document.querySelectorAll('.zoom').forEach(function(z){{z.addEventListener('click',function(){{var i=z.querySelector('img');document.getElementById('lbi').src=i.src;document.getElementById('lbi').alt=i.alt;lb.showModal();}});}});
document.getElementById('lbx').addEventListener('click',function(){{lb.close();}});
}})();
</script></body></html>'''
open(os.path.join(WEB, 'index.html'), 'w').write(page)
print('WEB:', os.path.abspath(os.path.join(WEB, 'index.html')))
