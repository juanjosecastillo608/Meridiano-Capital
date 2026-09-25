#!/usr/bin/env python3
"""Pruebas funcionales de los scripts de la skill sobre fixtures controlados.

Uso: python run_functional_tests.py FIXTURES_DIR WORK_DIR
Genera WORK_DIR/functional_results.json y .md. Código 1 si alguna prueba falla.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

SK = Path(__file__).resolve().parent.parent / "scripts"
FX, WK = Path(sys.argv[1]), Path(sys.argv[2])
WK.mkdir(parents=True, exist_ok=True)
results = []


def run(*args):
    r = subprocess.run([sys.executable, *map(str, args)], capture_output=True, text=True, timeout=600)
    return r.returncode, r.stdout, r.stderr


def js(out):
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def check(name, cond, detail):
    results.append({"test": name, "passed": bool(cond), "detail": detail})


def matrix(path, fields, calcs=None, prop=None):
    m = {"property": prop or {"name": "Fixture", "asset_type": "residencial", "operation": "venta", "meridiano_role": "intermediario"},
         "fields": fields, "calculations": calcs or []}
    path.write_text(json.dumps(m, ensure_ascii=False), encoding="utf-8")
    return path


# 1) Presentación residencial existente
c, o, _ = run(SK / "inspect_inputs.py", FX / "01_residencial", "--workdir", WK / "t01", "--prepare-images")
inv = js(o)
check("01 residencial: inventario y modo A", c == 0 and inv["summary"]["suggested_mode"] == "A" and inv["inputs"][0]["slides"] == 2,
      f"exit {c}, modo {inv['summary']['suggested_mode']}, diapositivas {inv['inputs'][0].get('slides')}")
check("01 residencial: copia de trabajo sin tocar el original", Path(inv["inputs"][0]["working_copy"]).exists(), inv["inputs"][0]["working_copy"])
c, o, _ = run(SK / "extract_presentation_content.py", FX / "01_residencial" / "Depto_Las_Lomas.pptx")
ex = js(o)[0]
texts = " ".join(p for s in ex["slides"] for sh in s["shapes"] for p in sh.get("paragraphs", []))
imgs = [sh for s in ex["slides"] for sh in s["shapes"] if sh["type"] == "image"]
check("01 residencial: extrae textos, notas e imágenes con origen", "USD 185.000" in texts and ex["slides"][0]["notes"] and len(imgs) == 2,
      f"{len(imgs)} imágenes; nota: {ex['slides'][0]['notes'][:40]}")
c, o, _ = run(SK / "validate_image_aspect_ratios.py", FX / "01_residencial" / "Depto_Las_Lomas.pptx")
check("01 residencial: imágenes correctas pasan", c == 0, o.strip())

# 2) Presentación corporativa existente (tabla + gráfico)
c, o, _ = run(SK / "extract_presentation_content.py", FX / "02_corporativa" / "Torre_Norte.pptx")
ex = js(o)[0]
tables = [sh for sh in ex["slides"][0]["shapes"] if sh["type"] == "table"]
charts = [sh for sh in ex["slides"][0]["shapes"] if sh["type"] == "chart"]
check("02 corporativa: tabla y gráfico extraídos", tables and tables[0]["rows"][3][3] == "15.120" and charts and charts[0]["series"][0]["values"] == ["420", "420"],
      f"tabla fila total {tables[0]['rows'][3] if tables else None}; serie {charts[0]['series'] if charts else None}")
m = matrix(WK / "m02.json", [
    {"key": "m2_piso", "value": "420", "unit": "m2", "category": "superficie", "source": "Torre_Norte.pptx d1 tabla", "source_rank": 4, "status": "confirmado"},
    {"key": "canon_m2", "value": "18", "currency": "USD", "tax": "+ IVA", "unit": "USD/m2", "category": "precio", "source": "Torre_Norte.pptx d1 tabla", "source_rank": 4, "status": "confirmado"}],
    [{"id": "canon_mensual_piso", "formula": "m2_piso * canon_m2", "stated": "7.560"},
     {"id": "canon_total", "formula": "2 * m2_piso * canon_m2", "stated": "15.120"}],
    {"name": "Torre Norte", "asset_type": "corporativa", "operation": "alquiler", "meridiano_role": "captador"})
c, o, _ = run(SK / "validate_property_data.py", m)
v = js(o)
check("02 corporativa: recalcula la tabla (7.560 / 15.120)", c == 0 and all(x["status"] == "coincide" for x in v["calculations"]),
      [(x["id"], x["computed"], x.get("status")) for x in v["calculations"]])

# 3) PDF con fotografías y precios
pdf = FX / "03_pdf_desarrollo" / "Mburucuya.pdf"
c, o, _ = run(SK / "inspect_inputs.py", pdf)
inv = js(o)
check("03 PDF: páginas, imágenes y capa de texto", c == 0 and inv["inputs"][0]["pages"] >= 1 and inv["inputs"][0]["embedded_images"] >= 1 and inv["inputs"][0]["has_text_layer"],
      {k: inv["inputs"][0].get(k) for k in ("pages", "embedded_images", "has_text_layer")})
c, o, _ = run(SK / "extract_presentation_content.py", pdf, "--extract-media", WK / "t03_media")
ex = js(o)[0]
check("03 PDF: precios extraídos y media exportada", "104.000" in ex["pages"][0]["text"] and any((WK / "t03_media").iterdir()),
      f"texto p1 contiene 104.000: {'104.000' in ex['pages'][0]['text']}")

# 4) Planilla con tipologías y formas de pago
c, o, _ = run(SK / "extract_presentation_content.py", FX / "04_planilla" / "Mburucuya_precios.xlsx")
ex = js(o)[0]
rows = ex["sheets"][0]["rows"]
check("04 planilla: celdas y fórmulas extraídas", rows[1]["values"][2] == "72000" and rows[1]["formulas"].get("D2") == "C2*0.3",
      f"fila 2: {rows[1]['values']} fórmulas {rows[1]['formulas']}")
m = matrix(WK / "m04.json", [
    {"key": "precio_1d", "value": "72.000", "currency": "USD", "tax": "IVA incluido", "unit": "USD", "category": "precio", "source": "Mburucuya_precios.xlsx C2", "source_rank": 2, "status": "confirmado"},
    {"key": "anticipo_pct", "value": "30", "unit": "%", "category": "condiciones", "source": "Mburucuya_precios.xlsx D1", "source_rank": 2, "status": "confirmado"},
    {"key": "cuotas", "value": "24", "category": "condiciones", "source": "Mburucuya_precios.xlsx E2", "source_rank": 2, "status": "confirmado"},
    {"key": "sup_1d", "value": "45", "unit": "m2", "category": "superficie", "source": "Mburucuya_precios.xlsx B2", "source_rank": 2, "status": "confirmado"}],
    [{"id": "cuota_1d", "formula": "precio_1d * (1 - anticipo_pct/100) / cuotas", "stated": "2.100"},
     {"id": "precio_m2_1d", "formula": "precio_1d / sup_1d"}],
    {"name": "Mburucuyá", "asset_type": "desarrollo", "operation": "preventa", "meridiano_role": "intermediario"})
c, o, _ = run(SK / "validate_property_data.py", m)
v = js(o)
check("04 planilla: plan de pagos recalculado; falta 'entrega' se pide", v["calculations"][0]["status"] == "coincide" and v["calculations"][1]["computed"] == 1600.0 and any(w["field"] == "entrega" for w in v["warnings"] + v["needs_confirmation"]),
      [(x["id"], x["computed"], x["status"]) for x in v["calculations"]])

# 5) Plano + fotografías (modo C)
c, o, _ = run(SK / "inspect_inputs.py", FX / "05_plano_fotos", "--workdir", WK / "t05", "--prepare-images")
inv = js(o)
check("05 plano+fotos: modo C, 3 imágenes + CSV", c == 0 and inv["summary"]["suggested_mode"] == "C" and inv["summary"]["by_kind"] == {"table": 1, "image": 3},
      inv["summary"])
m = matrix(WK / "m05.json", [
    {"key": "frente", "value": "24,00", "unit": "m", "category": "tecnica", "source": "plano_local.png cota superior", "source_rank": 3, "status": "confirmado"},
    {"key": "fondo", "value": "12,50", "unit": "m", "category": "tecnica", "source": "plano_local.png cota lateral", "source_rank": 3, "status": "confirmado"},
    {"key": "superficie", "value": "300", "unit": "m2", "category": "superficie", "source": "datos.csv", "source_rank": 5, "status": "confirmado"},
    {"key": "canon", "value": "USD 3.600", "currency": "USD", "tax": "+ IVA", "unit": "USD", "category": "precio", "source": "datos.csv", "source_rank": 5, "status": "confirmado"}],
    [{"id": "sup_desde_plano", "formula": "frente * fondo", "stated": "300"}],
    {"name": "Local Fixture", "asset_type": "comercial", "operation": "alquiler", "meridiano_role": "captador"})
c, o, _ = run(SK / "validate_property_data.py", m)
v = js(o)
check("05 plano: superficie calculada desde cotas (24,00 × 12,50 = 300)", c == 0 and v["calculations"][0]["computed"] == 300.0 and v["calculations"][0]["status"] == "coincide",
      v["calculations"])

# 6) Datos contradictorios
m = matrix(WK / "m06.json", [
    {"key": "precio", "value": "USD 185.000", "currency": "USD", "tax": "sin IVA informado", "unit": "USD", "category": "precio", "source": "ficha.docx", "source_rank": 5, "status": "confirmado"},
    {"key": "precio", "value": "179000", "currency": "USD", "tax": "sin IVA informado", "unit": "USD", "category": "precio", "source": "lista_a.xlsx A2", "source_rank": 2, "status": "confirmado"},
    {"key": "superficie", "value": "240", "unit": "m2", "category": "superficie", "source": "lista_a.xlsx B2", "source_rank": 2, "status": "confirmado"},
    {"key": "superficie", "value": "255", "unit": "m2", "category": "superficie", "source": "lista_b.xlsx B2", "source_rank": 2, "status": "confirmado"}])
c, o, _ = run(SK / "validate_property_data.py", m)
v = js(o)
check("06 contradicciones: precio resuelto por jerarquía (lista > ficha) y superficie a confirmar",
      c == 3 and v["resolved_by_hierarchy"][0]["used"] == "179000" and v["resolved_by_hierarchy"][0]["discarded"][0]["source"] == "ficha.docx" and any(x["field"] == "superficie" for x in v["needs_confirmation"]),
      {"exit": c, "resuelto": v["resolved_by_hierarchy"], "confirmar": [x["field"] for x in v["needs_confirmation"]]})
m = matrix(WK / "m06b.json", [
    {"key": "alquiler", "value": "11.000", "currency": "USD", "tax": "+ IVA", "unit": "USD", "category": "precio", "source": "x", "source_rank": 2, "status": "confirmado"},
    {"key": "sup", "value": "2.000", "unit": "m2", "category": "superficie", "source": "x", "source_rank": 2, "status": "confirmado"},
    {"key": "canon_m2", "value": "5,50", "currency": "USD", "tax": "+ IVA", "unit": "USD/m2", "category": "precio", "source": "x", "source_rank": 2, "status": "confirmado"}],
    [{"id": "alquiler_check", "formula": "sup * canon_m2", "stated": "11.500"}])
c, o, _ = run(SK / "validate_property_data.py", m)
check("06b cálculo de la fuente que no cierra -> error, sin corregir", c == 1 and "11.500" in json.dumps(js(o)["errors"], ensure_ascii=False), js(o)["errors"])

# 7) Fotografías con distintas orientaciones
c, o, _ = run(SK / "inspect_inputs.py", FX / "07_orientaciones", "--workdir", WK / "t07", "--prepare-images")
inv = {Path(e["path"]).name: e for e in js(o)["inputs"]}
from PIL import Image  # noqa: E402
prep = Image.open(inv["vertical_exif6.jpg"]["prepared_image"])
check("07 orientaciones: EXIF aplicado (1200x900 rotada -> 900x1200 vertical)",
      inv["vertical_exif6.jpg"]["orientation"] == "vertical" and prep.size == (900, 1200), f"{inv['vertical_exif6.jpg']['px']} -> preparada {prep.size}")
check("07 orientaciones: WEBP y TIFF convertidos (sin falso aviso de EXIF)", inv["cuadrada.webp"]["prepared_image"].endswith((".jpg", ".png")) and inv["panoramica.tif"]["prepared_image"].endswith((".jpg", ".png"))
      and "EXIF" not in inv["cuadrada.webp"]["preparation"] and inv["baja_resolucion.jpg"]["preparation"] == "copia sin cambios",
      [inv["cuadrada.webp"]["preparation"], inv["panoramica.tif"]["preparation"]])
check("07 orientaciones: baja resolución detectada", inv["baja_resolucion.jpg"]["low_resolution"], inv["baja_resolucion.jpg"]["px"])

# 8) Presentación con imagen deformada
c, o, _ = run(SK / "validate_image_aspect_ratios.py", FX / "08_deformada" / "Deformada.pptx", "--out", WK / "t08_aspect.json")
check("08 deformada: la validación FALLA", c == 1 and "estirada" in o, o.strip())

# 9) Archivo sin datos comerciales
c, o, _ = run(SK / "extract_presentation_content.py", FX / "09_sin_datos" / "fotos.pdf")
m = matrix(WK / "m09.json", [
    {"key": "precio", "value": None, "category": "precio", "status": "pendiente"},
    {"key": "superficie", "value": None, "category": "superficie", "status": "pendiente"}],
    prop={"name": "Sin datos", "asset_type": "residencial", "operation": "venta", "meridiano_role": "intermediario"})
c, o, _ = run(SK / "validate_property_data.py", m)
v = js(o)
check("09 sin datos: no inventa; precio y superficie se piden", c == 3 and {"precio", "superficie"} <= {x["field"] for x in v["needs_confirmation"]} and v["pending_fields"] == ["precio", "superficie"],
      {"exit": c, "confirmar": [x["field"] for x in v["needs_confirmation"]]})

# 10) Solicitud sin archivos
c, o, e = run(SK / "inspect_inputs.py", FX / "10_sin_archivos")
check("10 sin archivos: se detiene con el mensaje exacto", c == 2 and "necesito que adjuntes el archivo fuente" in e, f"exit {c}")
c, o, e = run(SK / "inspect_inputs.py")
check("10b sin argumentos: se detiene", c == 2, f"exit {c}")

# 11) Archivo dañado
c, o, e = run(SK / "inspect_inputs.py", FX / "11_danado")
check("11 dañado: detectado y no se procede", c == 2 and js(o)["inputs"][0]["status"] == "damaged", js(o)["summary"]["problem_files"])

# 12) Dos versiones (D-099): clientes con Meridiano y colegas en marca blanca
import shutil  # noqa: E402
nm = None
for cand in [os.environ.get("NODE_PATH", "")] + [str(p) for p in Path(__file__).resolve().parents[3].glob("production/generadores/node_modules")]:
    if cand and Path(cand, "pptxgenjs").exists():
        nm = cand
        break
if not nm or not shutil.which("node"):
    check("12 dos versiones: requiere node + pptxgenjs", False, "definir NODE_PATH con pptxgenjs, jszip y sharp")
else:
    kit = SK / "meridiano_deck_kit.js"
    img = WK / "t05" / "imagenes"
    dual = WK / "t12"
    (dual).mkdir(exist_ok=True)
    js_src = f"""
const K = require({json.dumps(str(kit))});
K.buildBoth(async (d) => {{
  let s = d.cover({{ photo: {json.dumps(str(img / 'fachada.jpg'))}, eyebrow: "Propuesta de alquiler", title: "Local Fixture",
    figures: [["300 m²","Superficie"]], footnote: "Comercialización a cargo de Meridiano Capital  ·  25.09.2026" }});
  s.addNotes("Nota interna de Meridiano Capital");
  s = d.slide("light"); d.title(s, "Plano"); d.forClientes(() => d.text(s, "Relevamiento de Meridiano Capital", {{ x: 1, y: 3, w: 5, h: 0.4 }}));
  d.footer(s, 2);
  d.closing({{ headline: "Coordinemos una visita", signaturePreset: "C_captacion_alquiler", disclaimer: K.TOKENS.disclaimers.alquiler }});
}}, {{ property: "Local Fixture", operation: "Alquiler", outDir: {json.dumps(str(dual))}, title: "Local Fixture — Meridiano Capital",
      footerLabel: "Meridiano Capital  ·  Local Fixture  ·  Alquiler" }}).then(r => console.log(JSON.stringify(r)));
"""
    (dual / "build.js").write_text(js_src, encoding="utf-8")
    env = dict(os.environ, NODE_PATH=nm)
    r = subprocess.run(["node", str(dual / "build.js")], capture_output=True, text=True, env=env, timeout=300)
    paths = json.loads(r.stdout.strip().splitlines()[-1]) if r.returncode == 0 else {}
    col, cli = paths.get("colegas", ""), paths.get("clientes", "")
    check("12 dos versiones: nombres y carpetas", cli.endswith("para_clientes/Meridiano_Capital_Local_Fixture_Alquiler_Final.pptx")
          and col.endswith("para_colegas/Local_Fixture_Alquiler_Presentacion.pptx"), paths or r.stderr[-300:])
    c, o, _ = run(SK / "build_validation_report.py", "--pptx", col, "--variant", "colegas", "--out", dual / "V_colegas.md")
    check("12 colegas: marca blanca sin rastros de Meridiano (APROBADO)", c == 0, o.strip()[:200])
    c, o, _ = run(SK / "build_validation_report.py", "--pptx", cli, "--variant", "colegas", "--out", dual / "V_cruzado.md")
    txt = (dual / "V_cruzado.md").read_text(encoding="utf-8")
    check("12 control cruzado: la versión clientes NO pasa como marca blanca", c == 1 and "logo de Meridiano" in txt and "notas del orador" in txt and "docProps" in txt,
          o.strip()[:200])
    bad = dual / "bad.js"
    bad.write_text(f"""const K=require({json.dumps(str(kit))});const d=K.createDeck({{variant:"colegas"}});const s=d.slide();
try{{d.text(s,"Contacto: Juan José Castillo",{{x:1,y:1,w:5,h:1}});console.log("NO_BLOQUEO")}}catch(e){{console.log("BLOQUEADO")}}""", encoding="utf-8")
    r = subprocess.run(["node", str(bad)], capture_output=True, text=True, env=env, timeout=120)
    check("12 freno: un texto con Meridiano en la versión colegas detiene el armado", "BLOQUEADO" in r.stdout, r.stdout.strip() or r.stderr[-200:])

passed = sum(r["passed"] for r in results)
(WK / "functional_results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
md = ["| Prueba | Resultado | Detalle |", "|---|---|---|"] + [
    f"| {r['test']} | {'✅' if r['passed'] else '❌'} | {str(r['detail'])[:160].replace('|', '/')} |" for r in results]
(WK / "functional_results.md").write_text("\n".join(md), encoding="utf-8")
print("\n".join(md))
print(f"\n{passed}/{len(results)} pruebas superadas")
sys.exit(0 if passed == len(results) else 1)
