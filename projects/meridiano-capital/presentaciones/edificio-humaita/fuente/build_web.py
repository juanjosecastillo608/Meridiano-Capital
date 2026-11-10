"""Presentación web del Edificio Humaitá (base: index.html del paquete del founder, 09/11/2026).

Genera ../web/index.html con imágenes y fuentes locales (sin servidores externos). Las cifras salen de model.json,
el teléfono y el tipo de cambio de _config/meridiano.json (D-096/D-097).
"""
import os, sys, json, shutil, html
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_config'))
from comun import tc_texto, contacto_linea  # D-096 / D-097

B = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(B, '..', 'web')
M = json.load(open(os.path.join(B, 'model.json')))
ev = {a: M[a]['ev'] for a in 'ABC'}

def n(x, d=0):
    s = f"{x:,.{d}f}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')
def usd(x): return 'USD ' + n(round(x))
def pct(x, d=2): return n(x * 100, d) + '%'
def pn(e, d=2):   # D-103: con alertas de coherencia abiertas, la neta se presenta como rango y no como dato
    if e.get('alertas') and e.get('neta_alta', e['neta']) - e['neta'] >= 0.0005:
        return n(e['neta'] * 100, d) + '–' + pct(e['neta_alta'], d)
    return pct(e['neta'], d)

# ---- archivos locales
os.makedirs(os.path.join(WEB, 'assets'), exist_ok=True)
os.makedirs(os.path.join(WEB, 'fonts'), exist_ok=True)
for f in os.listdir(os.path.join(B, 'img', 'zip')):
    shutil.copyfile(os.path.join(B, 'img', 'zip', f), os.path.join(WEB, 'assets', f))
for f in ('qr_ubicacion.png', 'patio.jpg', 'planta_alta.jpg', 'portrait.jpg', 'mapa_ubicacion.jpg', 'hospital_militar.jpg'):
    shutil.copyfile(os.path.join(B, 'img', f), os.path.join(WEB, 'assets', f))
for f in os.listdir(os.path.join(B, 'fonts')):
    if f.endswith('.woff2'):
        shutil.copyfile(os.path.join(B, 'fonts', f), os.path.join(WEB, 'fonts', f))
fonts_css = open(os.path.join(B, 'fonts', 'fonts.css')).read()

MAPS = 'https://maps.app.goo.gl/4nMui8uvZ9RYb6EeA'
MAPS_HM = 'https://maps.app.goo.gl/nLyr38rbR7LSMgc58'
MAPS_UAA = 'https://maps.app.goo.gl/L3SDhyebvBSkzJfA6'
AVISO = 'Propiedad ofrecida en su estado actual. Imágenes de transformación conceptuales.'

# ---- galería: (archivo, título, ambiente, tipo, alternativa)
G = [('fachada_original.jpg', 'Fachada sobre Humaitá', 'fachada', 'real', ''),
     ('acceso_original.jpg', 'Acceso con piso calcáreo', 'interiores', 'real', ''),
     ('habitacion_historica_1.jpg', 'Ambiente con balcón a la calle', 'interiores', 'real', ''),
     ('salon_alto.jpg', 'Ambiente del edificio principal', 'interiores', 'real', ''),
     ('salon_vigas.jpg', 'Salón de planta alta', 'interiores', 'real', ''),
     ('habitacion_posterior.jpg', 'Habitación del área posterior', 'habitaciones', 'real', ''),
     ('habitacion_bano.jpg', 'Habitación con baño, a reparar', 'habitaciones', 'real', ''),
     ('patio_original.jpg', 'Patio arbolado', 'patio', 'real', ''),
     ('patio.jpg', 'Galería del área posterior', 'patio', 'real', ''),
     ('escalera_patio.jpg', 'Escalera exterior', 'patio', 'real', ''),
     ('fachada_concepto_a.jpg', 'Fachada A · Patrimonial moderno', 'fachada', 'concepto', 'A'),
     ('fachada_concepto_b.jpg', 'Fachada B · Boutique urbano', 'fachada', 'concepto', 'B'),
     ('fachada_concepto_c.jpg', 'Fachada C · Contemporáneo cálido', 'fachada', 'concepto', 'C'),
     ('fachada_residencia.jpg', 'Fachada de residencia de habitaciones', 'fachada', 'concepto', ''),
     ('habitacion_concepto.jpg', 'Habitación tipo', 'habitaciones', 'concepto', ''),
     ('patio_estudio.jpg', 'Patio de estudio', 'patio', 'concepto', ''),
     ('patio_lounge.jpg', 'Patio lounge con pérgola', 'patio', 'concepto', ''),
     ('panel_conceptual.jpg', 'Panel de conceptos', 'interiores', 'concepto', '')]
def fig(f, t, amb, tipo, alt):
    badge = 'Fotografía' if tipo == 'real' else 'Concepto IA'
    return (f'<figure class="g" data-amb="{amb}" data-tipo="{tipo}" data-alt="{alt}" data-src="assets/{f}">'
            f'<button class="zoom" aria-label="Ampliar: {html.escape(t)}"><img src="assets/{f}" alt="{html.escape(t)} ({badge.lower()})" loading="lazy"></button>'
            f'<figcaption><span class="badge {tipo}">{badge}</span> {html.escape(t)}<span class="ref">assets/{f}</span>'
            f'<label class="repl">Reemplazar<input type="file" accept="image/*"></label></figcaption></figure>')
gal = ''.join(fig(*g) for g in G)

MAT = {'A': ('Patrimonial moderno', 'Conserva molduras y balcones; contraste marfil y grafito con acentos de madera en la planta baja.',
             [('Marfil', '#EFE8DA', 'Pintura acrílica elastomérica exterior'), ('Grafito', '#3A3D40', 'Carpintería de aluminio o hierro pintado'), ('Roble', '#9C6B3F', 'Listones de madera tratada o símil madera'), ('Bronce', '#8C6A43', 'Herrería y apliques')]),
       'B': ('Boutique urbano', 'Zócalo de piedra cálida en la planta baja, cartelería sobria e iluminación rasante sobre la fachada histórica.',
             [('Piedra cálida', '#B9A88F', 'Revestimiento de piedra o porcelanato símil piedra'), ('Marfil', '#F2EBDD', 'Pintura acrílica elastomérica'), ('Grafito', '#2F3236', 'Carpinterías y cartel'), ('Luz cálida', '#F6C97A', 'Luminarias de 2.700 K, IP65')]),
       'C': ('Contemporáneo cálido', 'Tonos arena y madera con jardineras al frente; la opción más amable para una residencia de estudiantes.',
             [('Arena', '#D8C3A0', 'Pintura texturada exterior'), ('Teca', '#8A5A35', 'Madera dura tratada o compuesto WPC'), ('Follaje', '#5C7A4A', 'Jardineras con especies nativas'), ('Hueso', '#F4EFE6', 'Molduras y cornisas')])}
def matcard(k):
    name, txt, sw = MAT[k]
    chips = ''.join(f'<li><span class="sw" style="background:{h}"></span><b>{nm}</b> <code>{h}</code><br><small>{d}</small></li>' for nm, h, d in sw)
    return (f'<article class="mat" data-alt="{k}"><img src="assets/fachada_concepto_{k.lower()}.jpg" alt="Fachada {k}: {name} (concepto IA)" loading="lazy">'
            f'<div class="mc"><span class="badge concepto">Concepto IA</span><h3>{k} · {name}</h3><p>{txt}</p><ul class="pal">{chips}</ul>'
            f'<p class="small"><b>Alcance:</b> pintura, carpinterías, iluminación, cartelería y planta baja. <b>Restricciones:</b> fachada del centro histórico sujeta a aprobación municipal; materiales y precios a verificar en plaza.</p></div></article>')

ALTN = {'A': 'A · Departamentos y salones', 'B': 'B · 20 habitaciones mensuales', 'C': 'C · Hostel de 20 habitaciones'}
rows = ''.join(f'<tr><th scope="row">{ALTN[a]}</th><td>{usd(M["cx"][a]["total"])}</td><td>{usd(ev[a]["inv"])}</td><td>{usd(ev[a]["G"] / 12)}</td><td>{pct(ev[a]["bruta"])}</td><td>{pn(ev[a])}</td><td>{pct(M["proj"][a]["Base"]["tir"], 1)}</td></tr>' for a in 'ABC')

page = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Edificio Humaitá | Meridiano Capital</title><meta name="description" content="Casona del centro histórico de Asunción en venta, con tres opciones de renta. Documento de referencia de Meridiano Capital.">
<style>{fonts_css}
:root{{--pet:#14313A;--tie:#8B3323;--lap:#C9982E;--cre:#F3EDE3;--gri:#6B6154;--lin:#DAD2C0;--ink:#1d2b30}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}@media(prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}*{{transition:none!important}}}}
body{{margin:0;background:var(--cre);color:var(--ink);font:16px/1.65 Poppins,system-ui,sans-serif}}
h1,h2,h3{{font-family:FrauncesJ,Fraunces,Georgia,serif;font-weight:400;font-variation-settings:'opsz' 80,'SOFT' 24,'WONK' 0;color:var(--pet)}}
a{{color:var(--tie)}}:focus-visible{{outline:3px solid var(--lap);outline-offset:2px}}
.skip{{position:absolute;left:-999px}}.skip:focus{{left:12px;top:12px;z-index:50;background:#fff;padding:8px}}
.aviso{{position:sticky;top:0;z-index:20;background:var(--tie);color:#fff;text-align:center;font-size:13px;padding:6px 12px}}
header{{position:sticky;top:31px;z-index:19;background:#14313Af2;color:var(--cre);display:flex;justify-content:space-between;align-items:center;gap:16px;padding:10px 4%;flex-wrap:wrap}}
.brand{{display:flex;align-items:center;gap:10px;letter-spacing:.12em;font-size:12px}}.brand svg{{width:28px}}
nav{{display:flex;gap:16px;flex-wrap:wrap}}nav a{{color:#d9e0de;text-decoration:none;font-size:12.5px;padding:4px 0;border-bottom:2px solid transparent}}nav a.on,nav a:hover{{color:#fff;border-color:var(--lap)}}
section{{scroll-margin-top:90px;padding:72px max(4%,calc((100vw - 1180px)/2));border-bottom:1px solid var(--lin)}}
.eb{{text-transform:uppercase;letter-spacing:.2em;color:var(--lap);font-size:12px;font-weight:600}}
h2{{font-size:clamp(30px,4vw,52px);line-height:1.1;margin:8px 0 18px}}h3{{font-size:24px;margin:6px 0 8px}}
.hero{{min-height:88vh;display:flex;align-items:flex-end;background:linear-gradient(0deg,#0b1d22 0%,#0b1d22b0 40%,transparent 80%),url('assets/fachada_original.jpg') center/cover;color:var(--cre)}}
.hero .eb,.hero p{{text-shadow:0 1px 6px #000c}}.hero h1{{color:var(--cre);font-size:clamp(48px,8vw,110px);line-height:.95;margin:0 0 18px}}.hero p{{max-width:760px;font-size:19px}}
.pill{{display:inline-block;border:1px solid #ffffff80;border-radius:30px;padding:5px 12px;font-size:12px;margin:4px 6px 4px 0}}
.stats{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}}.stat{{background:#fff;border:1px solid var(--lin);padding:20px}}
.stat strong{{display:block;font:30px FrauncesJ,Fraunces,serif;color:var(--tie)}}.stat small{{color:var(--gri)}}
.note{{border-left:3px solid var(--lap);background:#fff;padding:12px 18px;margin-top:20px;font-size:14px}}
.filters{{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}}.filters button{{border:1px solid var(--pet);background:#fff;color:var(--pet);padding:6px 14px;border-radius:30px;cursor:pointer;font:500 13px Poppins,sans-serif}}
.filters button[aria-pressed=true]{{background:var(--pet);color:#fff}}.fl{{font-size:12px;color:var(--gri);align-self:center;margin-right:4px}}
.gallery{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}}.g{{margin:0;background:#fff;border:1px solid var(--lin)}}.g[hidden]{{display:none}}
.zoom{{display:block;width:100%;padding:0;border:0;cursor:zoom-in;background:none}}.g img{{display:block;width:100%;height:240px;object-fit:cover}}
figcaption{{padding:10px 12px;font-size:13.5px}}.ref{{display:block;color:var(--gri);font-size:11px;font-family:monospace}}
.badge{{font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px;margin-right:4px}}.badge.real{{background:#e3ece9;color:var(--pet)}}.badge.concepto{{background:#f5e3d0;color:var(--tie)}}
.repl{{display:inline-block;margin-top:6px;font-size:11.5px;color:var(--tie);cursor:pointer;text-decoration:underline}}.repl input{{position:absolute;left:-999px}}
.mats{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}}.mat{{background:#fff;border:1px solid var(--lin)}}.mat[hidden]{{display:none}}.mat img{{width:100%;height:200px;object-fit:cover;display:block}}.mc{{padding:16px}}
.pal{{list-style:none;padding:0;margin:10px 0;display:grid;gap:8px}}.pal li{{font-size:13px}}.sw{{display:inline-block;width:22px;height:22px;border-radius:3px;border:1px solid #0002;vertical-align:middle;margin-right:6px}}.pal code{{color:var(--gri)}}.small{{font-size:12.5px;color:var(--gri)}}
.cmp{{position:relative;aspect-ratio:4/3;max-width:1000px;overflow:hidden;background:#000}}.cmp img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}.cmp .after{{clip-path:inset(0 0 0 50%)}}
.cmp .tags{{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;color:#fff;font-weight:600;font-size:13px;text-shadow:0 1px 4px #000}}
.cmp input{{position:absolute;bottom:14px;left:5%;width:90%}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}}.two img{{width:100%;max-height:560px;object-fit:cover}}
.tw{{overflow:auto}}table{{width:100%;border-collapse:collapse;background:#fff;font-size:14px}}th,td{{padding:11px 12px;border-bottom:1px solid var(--lin);text-align:left}}thead th{{background:var(--pet);color:#fff;font-weight:500}}
.steps{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}}.steps div{{background:#fff;border:1px solid var(--lin);padding:18px}}
.loc{{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center}}.loc img{{width:150px}}
.close{{background:var(--tie);color:var(--cre)}}.close h2{{color:var(--cre)}}.close a{{color:#fff}}
footer{{padding:28px 4%;font-size:12.5px;color:var(--gri)}}
#log{{font-size:12px;background:#fff;border:1px solid var(--lin);padding:10px;max-height:180px;overflow:auto}}
dialog{{border:0;padding:10px;background:#0b1d22;max-width:96vw}}dialog img{{max-width:92vw;max-height:82vh;display:block}}dialog p{{color:#fff;font-size:13px;margin:6px 0}}dialog button{{float:right}}
.btn{{background:var(--pet);color:#fff;border:0;padding:9px 16px;cursor:pointer;font:500 13px Poppins,sans-serif}}
@media(max-width:820px){{header{{top:0;position:static}}.stats,.gallery,.mats,.two,.steps{{grid-template-columns:1fr}}section{{padding:56px 16px}}.hero{{min-height:70vh}}.loc{{grid-template-columns:1fr}}}}
@media print{{.aviso{{position:static}}header,.filters,.repl,.noprint,dialog,.cmp input{{display:none!important}}body{{background:#fff;font-size:11pt}}
section{{padding:18mm 12mm;page-break-after:always;border:0}}.hero{{min-height:auto;height:180mm;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.g[hidden],.mat[hidden]{{display:block!important}}.gallery,.mats{{grid-template-columns:repeat(3,1fr)}}.g img{{height:55mm}}.cmp .after{{clip-path:none;left:50%;width:50%}}.cmp img:first-child{{width:50%}}
.sw,.badge,thead th,.close{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}a{{text-decoration:none}}}}
</style></head><body>
<a class="skip" href="#main">Saltar al contenido</a>
<div class="aviso" role="note">{AVISO}</div>
<header><div class="brand"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 6 L14 100 L106 100 Z" fill="none" stroke="#F3EDE3" stroke-width="6" stroke-linejoin="round"/><line x1="4" y1="112" x2="116" y2="112" stroke="#F3EDE3" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="72" r="9" fill="#C9982E"/></svg>MERIDIANO CAPITAL · EDIFICIO HUMAITÁ</div>
<nav aria-label="Secciones"><a href="#oportunidad">Oportunidad</a><a href="#ubicacion">Ubicación</a><a href="#galeria">Galería</a><a href="#arquitectura">Arquitectura</a><a href="#comparador">Antes / después</a><a href="#habitaciones">Habitación y patio</a><a href="#inversion">Inversión</a><a href="#pasos">Próximos pasos</a></nav></header>
<main id="main">
<section class="hero"><div><div class="eb">Casona del centro histórico · venta en estado actual</div><h1>Edificio<br>Humaitá</h1>
<p>Una casona de dos plantas con 16 habitaciones con baño, salón y patio arbolado, a metros de la Av. Colón. Hoy desocupada; con potencial de renta para estudiantes y profesionales.</p>
<span class="pill">{usd(M["P"])} · precio de venta</span><span class="pill">541 m² de terreno</span><span class="pill">100% desocupado</span></div></section>

<section id="oportunidad"><div class="eb">01 · La oportunidad</div><h2>Comprar el presente, evaluar el potencial</h2>
<p>El inmueble se vende en su estado actual. Su configuración de habitaciones con baño, salón y patio permite estudiar tres usos de renta, sujetos a verificación técnica, normativa y comercial.</p>
<div class="stats"><div class="stat"><strong>{usd(M["P"])}</strong><small>Precio de venta en su estado actual</small></div><div class="stat"><strong>541 m²</strong><small>Terreno · 12,30 × 43 m</small></div>
<div class="stat"><strong>300 · 610 m²</strong><small>Construidos según el aviso · suma de la tabla de unidades (a conciliar con planos)</small></div><div class="stat"><strong>0%</strong><small>Ocupación actual: no hay renta vigente</small></div></div>
<div class="note">Capacidad a conciliar: el aviso describe 3 ambientes + salón + 13 habitaciones posteriores; la tabla del propietario lista 19 unidades (3 en proyecto) y la planilla de obra supone 20 habitaciones.</div></section>

<section id="ubicacion"><div class="eb">02 · Ubicación</div><h2>Humaitá, a metros de la Av. Colón</h2>
<div class="two" style="margin-bottom:24px"><figure class="g" style="margin:0"><img src="assets/mapa_ubicacion.jpg" alt="Vista satelital con el marcador del edificio en Humaitá 978 y la UAP sobre Colón" style="height:300px"><figcaption><span class="badge real">Mapa</span> Humaitá 978, entre Colón y Montevideo · imagen de Google Maps</figcaption></figure><figure class="g" style="margin:0"><img src="assets/hospital_militar.jpg" alt="Hospital Militar Central" style="height:300px"><figcaption><span class="badge real">Fotografía</span> Hospital Militar Central · foto de un usuario de Google Maps (nov. 2021)</figcaption></figure></div>
<div class="loc"><img src="assets/qr_ubicacion.png" alt="Código QR de la ubicación en Google Maps"><div>
<p><b>Dirección:</b> Humaitá 978, entre Colón y Montevideo, Asunción (−25,28227, −57,64337).</p><p><b>Ubicación del inmueble:</b> <a href="{MAPS}">{MAPS.replace("https://", "")}</a></p>
<p><b>Referencias de demanda:</b> la Universidad Autónoma del Paraguay (UAP), la más cercana, con su clínica sobre la Av. Colón, y el Hospital Militar Central (<a href="{MAPS_HM}">mapa</a>).</p>
<p class="small">Las distancias a pie a estas instituciones todavía no se midieron y deben verificarse.</p></div></div></section>

<section id="galeria"><div class="eb">03 · Galería</div><h2>El edificio hoy y su potencial</h2>
<p>Las fotografías muestran el estado actual. Las imágenes marcadas <span class="badge concepto">Concepto IA</span> son ilustraciones generadas a partir de esas fotos: pueden diferir en detalles y no son planos ni obra presupuestada.</p>
<div class="filters" role="group" aria-label="Filtrar por ambiente"><span class="fl">Ambiente</span>
<button data-f="amb" data-v="todos" aria-pressed="true">Todos</button><button data-f="amb" data-v="fachada" aria-pressed="false">Fachada</button><button data-f="amb" data-v="interiores" aria-pressed="false">Interiores</button><button data-f="amb" data-v="habitaciones" aria-pressed="false">Habitaciones</button><button data-f="amb" data-v="patio" aria-pressed="false">Patio</button></div>
<div class="filters" role="group" aria-label="Filtrar por tipo de imagen"><span class="fl">Imagen</span>
<button data-f="tipo" data-v="todos" aria-pressed="true">Todas</button><button data-f="tipo" data-v="real" aria-pressed="false">Fotografías</button><button data-f="tipo" data-v="concepto" aria-pressed="false">Conceptos</button></div>
<div class="gallery" id="gal">{gal}</div>
<div class="note noprint"><b>Reemplazar imágenes.</b> Cada imagen tiene “Reemplazar”: carga una foto o un render nuevo solo en este navegador, sin modificar los originales de <code>assets/</code>. Cada cambio queda registrado con el archivo original y el nuevo.
<div id="log" aria-live="polite">Sin reemplazos.</div><button class="btn" id="exp" type="button" style="margin-top:8px">Descargar registro (JSON)</button></div></section>

<section id="arquitectura"><div class="eb">04 · Arquitectura</div><h2>Tres lecturas para la fachada</h2>
<p>Las tres conservan la fachada histórica (molduras, balcones y vanos) y actualizan terminaciones, iluminación y planta baja. Paletas y materiales elegidos por durabilidad en el clima de Asunción (sol, lluvias intensas y humedad); disponibilidad y precios a verificar.</p>
<div class="filters" role="group" aria-label="Filtrar por alternativa"><span class="fl">Alternativa</span>
<button data-f="alt" data-v="todos" aria-pressed="true">Todas</button><button data-f="alt" data-v="A" aria-pressed="false">A</button><button data-f="alt" data-v="B" aria-pressed="false">B</button><button data-f="alt" data-v="C" aria-pressed="false">C</button></div>
<div class="mats">{matcard("A")}{matcard("B")}{matcard("C")}</div>
<div class="note"><b>Restricciones técnicas comunes:</b> tratamiento de humedad ascendente con revoques hidrófugos antes de pintar; pinturas elastoméricas exteriores; mantenimiento anual de maderas exteriores; luminarias exteriores IP65; cableado aéreo frente a la fachada a coordinar con la distribuidora.</div></section>

<section id="comparador"><div class="eb">05 · Antes / después</div><h2>Fachada actual y concepto de residencia</h2>
<div class="cmp"><img src="assets/fachada_original.jpg" alt="Fachada actual (fotografía)"><img class="after" id="after" src="assets/fachada_residencia.jpg" alt="Concepto de residencia (ilustración IA)">
<div class="tags"><span>Estado actual</span><span>Concepto IA</span></div>
<input type="range" min="0" max="100" value="50" aria-label="Deslizar para comparar la fachada actual con el concepto" id="rng"></div>
<p class="small">La ilustración no es una comparativa exacta: puede alterar detalles de la fachada. No equivale a planos aprobados ni a obra ejecutada.</p></section>

<section id="habitaciones"><div class="eb">06 · Habitación tipo y patio</div><h2>Habitaciones con baño alrededor de un patio</h2>
<div class="two"><img src="assets/habitacion_posterior.jpg" alt="Habitación posterior, estado actual (fotografía)"><div><span class="badge real">Fotografía</span><h3>Base de transformación</h3><p>Habitaciones del área posterior con baño. La intervención prioriza humedad, terminaciones, instalaciones, iluminación, mobiliario y climatización.</p></div></div>
<div class="two" style="margin-top:28px"><div><span class="badge concepto">Concepto IA</span><h3>Habitación tipo</h3><p>Cama, escritorio, guardado, aire acondicionado y baño. Paleta marfil, arena y roble claro. El amoblamiento final se ajusta a las medidas reales de cada habitación.</p></div><img src="assets/habitacion_concepto.jpg" alt="Habitación tipo (ilustración IA)"></div>
<div class="two" style="margin-top:28px"><img src="assets/patio_estudio.jpg" alt="Patio de estudio (ilustración IA)"><div><span class="badge concepto">Concepto IA</span><h3>Patio compartido</h3><p>Áreas de estudio y descanso bajo el árbol existente, con iluminación cálida y recepción hacia el acceso. El patio actual se ve en la galería.</p></div></div></section>

<section id="inversion"><div class="eb">07 · Inversión</div><h2>Tres usos, con los números del estudio de mercado</h2>
<div class="tw"><table><thead><tr><th>Uso</th><th>Obra estimada</th><th>Inversión (precio + obra)</th><th>Ingreso bruto mensual</th><th>Bruta</th><th>Neta final</th><th>TIR base 5 años</th></tr></thead><tbody>{rows}</tbody></table></div>
<div class="note"><b>Hipótesis:</b> precio USD 160.000; alquileres en guaraníes al {tc_texto()}. A: alquileres proyectados de la tabla del propietario, vacancia 6–10%, administración 8%, mantenimiento 5%. B: Gs {n(M["B_RENT_GS"])} por habitación todo incluido, vacancia 10%, gastos del edificio USD 1.470 por mes. C: USD {n(M["C_ADR"])} por noche y {pct(M["C_OCC"], 0)} de ocupación, plataformas 15%, limpieza 12%, 3 recepcionistas. IVA incluido en el alquiler de mercado (5% vivienda, 10% salones y hostel), con crédito fiscal de gastos y obra; IRE 10% sobre el resultado menos la depreciación (D-101). Obra B y C: presupuesto de la planilla del propietario (600 m², 20 habitaciones), sin presupuesto de un constructor.<br>
<b>No es una rentabilidad garantizada.</b> No hay contratos ni renta vigente; los alquileres son precios pedidos del mercado (estudio de Meridiano del 08/11/2026). Las rentas del comercializador (Gs 13,2 M base y Gs 15,6 M proyectada) y su inversión declarada (Gs 14,2 M + Gs 30 M de obra) no son un presupuesto técnico.</div></section>

<section id="pasos"><div class="eb">08 · Próximos pasos</div><h2>De activo existente a producto de renta</h2>
<div class="steps"><div><h3>01 · Relevar</h3><p>Planos, mensura, superficie real, habitaciones, humedad, techos, instalaciones y normativa del centro histórico.</p></div>
<div><h3>02 · Diseñar</h3><p>Uso elegido, tipologías, fachada y presupuesto de obra verificable con arquitecto y constructor.</p></div>
<div><h3>03 · Operar</h3><p>Demanda y tarifas validadas, comercialización, contratos y administración, si el inversor lo desea.</p></div></div>
<div class="note">Las tareas legales, notariales, contables y de obra las realizan el abogado, el escribano, el contador y el arquitecto; Meridiano Capital coordina y acompaña.</div></section>

<section class="close"><div class="eb">Contacto</div><h2>Coordinemos su visita</h2><p>Lic. Juan José Castillo · Broker Inmobiliario | Meridiano Capital</p><p>{contacto_linea()}</p>
<button class="btn noprint" type="button" onclick="window.print()" style="background:var(--lap);color:#14313A">Imprimir o guardar en PDF</button></section>
</main>
<footer>{AVISO} Documento comercial de referencia de Meridiano Capital; precio y condiciones sujetos a confirmación. Las cifras son estimaciones, no garantías.</footer>
<dialog id="lb" aria-label="Imagen ampliada"><button class="btn" type="button" id="lbx">Cerrar ×</button><p id="lbc"></p><img id="lbi" alt=""></dialog>
<script>
(function(){{
var st={{amb:'todos',tipo:'todos',alt:'todos'}};
function apply(){{document.querySelectorAll('.g').forEach(function(g){{var ok=(st.amb==='todos'||g.dataset.amb===st.amb)&&(st.tipo==='todos'||g.dataset.tipo===st.tipo);g.hidden=!ok;}});
document.querySelectorAll('.mat').forEach(function(m){{m.hidden=!(st.alt==='todos'||m.dataset.alt===st.alt);}});}}
document.querySelectorAll('.filters button').forEach(function(b){{b.addEventListener('click',function(){{st[b.dataset.f]=b.dataset.v;
document.querySelectorAll('.filters button[data-f="'+b.dataset.f+'"]').forEach(function(x){{x.setAttribute('aria-pressed',x===b?'true':'false');}});apply();}});}});
var lb=document.getElementById('lb');
document.querySelectorAll('.zoom').forEach(function(z){{z.addEventListener('click',function(){{var im=z.querySelector('img');document.getElementById('lbi').src=im.src;document.getElementById('lbi').alt=im.alt;document.getElementById('lbc').textContent=im.alt;lb.showModal();}});}});
document.getElementById('lbx').addEventListener('click',function(){{lb.close();}});
document.getElementById('rng').addEventListener('input',function(){{document.getElementById('after').style.clipPath='inset(0 0 0 '+this.value+'%)';}});
var log=[];try{{log=JSON.parse(localStorage.getItem('humaita_reemplazos')||'[]');}}catch(e){{log=[];}}
function draw(){{var el=document.getElementById('log');el.textContent=log.length?'':'Sin reemplazos.';log.forEach(function(r){{var d=document.createElement('div');d.textContent=r.fecha+' · '+r.original+' → '+r.nuevo+' (solo en este navegador)';el.appendChild(d);}});}}
draw();
document.querySelectorAll('.repl input').forEach(function(inp){{inp.addEventListener('change',function(){{var f=inp.files[0];if(!f)return;var fig=inp.closest('figure');var img=fig.querySelector('img');
img.src=URL.createObjectURL(f);var b=fig.querySelector('.badge');b.textContent='Reemplazada';b.className='badge concepto';
log.push({{fecha:new Date().toISOString().slice(0,16).replace('T',' '),original:fig.dataset.src,nuevo:f.name}});try{{localStorage.setItem('humaita_reemplazos',JSON.stringify(log));}}catch(e){{}}draw();}});}});
document.getElementById('exp').addEventListener('click',function(){{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(log,null,1)],{{type:'application/json'}}));a.download='registro_reemplazos_humaita.json';a.click();}});
var links=document.querySelectorAll('nav a');if('IntersectionObserver' in window){{var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{links.forEach(function(l){{l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id);}});}}}});}},{{rootMargin:'-40% 0px -55% 0px'}});
document.querySelectorAll('section[id]').forEach(function(s){{io.observe(s);}});}}
}})();
</script></body></html>'''
open(os.path.join(WEB, 'index.html'), 'w').write(page)
print('WEB:', os.path.abspath(os.path.join(WEB, 'index.html')))
