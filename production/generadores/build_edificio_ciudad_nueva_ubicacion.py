"""Edificio Ciudad Nueva — ubicación real: distancias por calle y mapa de marca.

Fuente cartográfica: Overture Maps Foundation (release 2026-09-23.1, temas transportation/places),
derivado de OpenStreetMap (© OpenStreetMap contributors, ODbL). Se lee directo del bucket público
s3://overturemaps-us-west-2 (los servidores de OSM/Nominatim están bloqueados en este entorno).

Salidas:
  production/generadores/assets-edificio-ciudad-nueva/mapa-ubicacion.png
  projects/edificio-ciudad-nueva/trabajo/ubicacion.json  (coordenadas y distancias, trazable)

Las distancias se miden desde la intersección de los ejes de 9 de Marzo y Mayor Sebastián Bullo
(referencia de la dirección "9 de Marzo c/ Mayor Bullo"); la parcela exacta puede estar a pocos
metros de ese punto. "Por calle" = camino más corto sobre la red vial (no línea recta).
Requiere: pyarrow shapely pyproj networkx matplotlib.
"""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx
import pyarrow.compute as pc
import pyarrow.dataset as ds
import pyarrow.fs as pafs
from matplotlib import font_manager
from pyproj import Transformer
from shapely import wkb
from shapely.geometry import LineString, Point
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
OUT_PNG = ROOT / "production/generadores/assets-edificio-ciudad-nueva/mapa-ubicacion.png"
OUT_JSON = ROOT / "projects/edificio-ciudad-nueva/trabajo/ubicacion.json"
RELEASE = "2026-09-23.1"
BBOX = (-57.650, -57.585, -25.320, -25.270)  # xmin, xmax, ymin, ymax
MERCADO4 = ("Mercado 4 de Asuncion", -57.62317, -25.298958)  # punto 'place' de Overture

C = dict(petroleo="#14313A", tierra="#8B3323", lapacho="#C9982E", crema="#F3EDE3", grey="#6B6154", linea="#DAD2C0", gold_d="#A87D22")
TO_M = Transformer.from_crs(4326, 32721, always_xy=True)  # UTM 21S
TO_LL = Transformer.from_crs(32721, 4326, always_xy=True)


def overture(theme, typ, cols):
    s3 = pafs.S3FileSystem(anonymous=True, region="us-west-2")
    d = ds.dataset(f"overturemaps-us-west-2/release/{RELEASE}/theme={theme}/type={typ}/", filesystem=s3, format="parquet")
    xmin, xmax, ymin, ymax = BBOX
    f = (pc.field("bbox", "xmin") > xmin) & (pc.field("bbox", "xmax") < xmax) & (pc.field("bbox", "ymin") > ymin) & (pc.field("bbox", "ymax") < ymax)
    return d.to_table(columns=cols, filter=f).to_pylist()


def proj(g):
    return LineString([TO_M.transform(x, y) for x, y in g.coords])


def main():
    roads = []
    for r in overture("transportation", "segment", ["names", "class", "subtype", "geometry", "bbox"]):
        g = wkb.loads(r["geometry"])
        if r["subtype"] != "road" or g.geom_type != "LineString":
            continue
        roads.append(((r["names"] or {}).get("primary") or "", r["class"], proj(g)))

    by = lambda name: unary_union([p for n, _, p in roads if n == name])
    pt = by("09 de Marzo").intersection(by("Mayor Sebastián Bullo"))
    pt = pt if pt.geom_type == "Point" else list(pt.geoms)[0]
    lon, lat = TO_LL.transform(pt.x, pt.y)

    key = lambda c: (round(c[0], 1), round(c[1], 1))
    G = nx.Graph()
    for _, _, p in roads:
        cs = list(p.coords)
        for a, b in zip(cs, cs[1:]):
            G.add_edge(key(a), key(b), w=Point(a).distance(Point(b)))
    src = min(G.nodes, key=lambda k: Point(k).distance(pt))
    L = nx.single_source_dijkstra_path_length(G, src, weight="w")

    majors = {}
    for n, c, p in roads:
        if c in ("trunk", "primary", "secondary") and n:
            majors.setdefault(n, []).append(p)
    dist = []
    for n, ps in majors.items():
        nodes = {key(c) for p in ps for c in p.coords}
        net = min([L[k] for k in nodes if k in L], default=None)
        dist.append({"via": n, "recta_m": round(unary_union(ps).distance(pt)), "por_calle_m": round(net) if net is not None else None})
    dist.sort(key=lambda d: d["recta_m"])
    m4 = Point(TO_M.transform(MERCADO4[1], MERCADO4[2]))
    m4k = min(G.nodes, key=lambda k: Point(k).distance(m4))
    res = {
        "fuente": f"Overture Maps Foundation release {RELEASE} (derivado de OpenStreetMap, ODbL)",
        "punto_referencia": {"descripcion": "intersección de ejes 9 de Marzo y Mayor Sebastián Bullo", "lat": round(lat, 6), "lon": round(lon, 6)},
        "avenidas": dist[:8],
        "mercado4": {"referencia": MERCADO4[0], "lat": MERCADO4[2], "lon": MERCADO4[1], "recta_m": round(m4.distance(pt)), "por_calle_m": round(L[m4k])},
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(res, ensure_ascii=False, indent=1))
    print(json.dumps(res, ensure_ascii=False, indent=1))

    # ---- mapa ----
    for f in Path.home().joinpath(".fonts").glob("*.ttf"):
        font_manager.fontManager.addfont(str(f))
    fig, ax = plt.subplots(figsize=(6.4, 5.6), dpi=250)
    fig.patch.set_facecolor(C["crema"]); ax.set_facecolor(C["crema"])
    R = 620  # radio visible en metros
    for n, c, p in roads:
        if p.distance(pt) > R * 1.6:
            continue
        x, y = p.xy
        if c in ("trunk", "primary"):
            ax.plot(x, y, color=C["petroleo"], lw=3.0, solid_capstyle="round", zorder=3)
        elif c in ("secondary", "tertiary"):
            ax.plot(x, y, color=C["petroleo"], lw=1.8, alpha=0.75, solid_capstyle="round", zorder=2)
        else:
            ax.plot(x, y, color="#BDB3A2", lw=0.9, solid_capstyle="round", zorder=1)
    ax.add_patch(plt.Circle((m4.x, m4.y), 150, color=C["lapacho"], alpha=0.18, lw=0, zorder=2))
    ax.text(m4.x - 40, m4.y + 70, "MERCADO 4", ha="center", va="center", fontsize=8.5, fontfamily="Poppins", fontweight="bold", color=C["gold_d"], zorder=6)
    ax.scatter([pt.x], [pt.y], s=170, color=C["tierra"], edgecolor="white", linewidth=1.8, zorder=7)
    ax.annotate("Edificio\n9 de Marzo c/ Mayor Bullo", (pt.x, pt.y), xytext=(14, -26), textcoords="offset points", fontsize=8, fontfamily="Poppins",
                fontweight="bold", color=C["tierra"], zorder=8, bbox=dict(boxstyle="round,pad=0.25", fc="white", ec=C["linea"], lw=0.6))
    # rótulos: cada vía se rotula en su tramo más cercano a un ancla (dx, dy en metros desde el edificio)
    import math
    labels = [("Avenida Doctor Eusebio Ayala", "Av. Eusebio Ayala", (300, -230), 3), ("Avenida Doctor José Gaspar Rodriguez de Francia y Velasco", "Av. Rodríguez de Francia", (-380, -170), 3),
              ("Silvio Pettirossi", "Av. Silvio Pettirossi", (-150, -470), 3),               ("09 de Marzo", "9 de Marzo", (-190, 120), 1), ("Mayor Sebastián Bullo", "Mayor Bullo", (70, 170), 1)]
    for full, short, (dx, dy), w in labels:
        lines = [p for n, _, p in roads if n == full]
        if not lines:
            continue
        anc = Point(pt.x + dx, pt.y + dy)
        g = min(lines, key=lambda g: g.distance(anc))
        d0 = g.project(anc)
        q = g.interpolate(d0)
        a_, b_ = g.interpolate(max(0, d0 - 10)), g.interpolate(min(g.length, d0 + 10))
        ang = math.degrees(math.atan2(b_.y - a_.y, b_.x - a_.x))
        ang = ang - 180 if ang > 90 else ang + 180 if ang < -90 else ang
        ax.text(q.x, q.y, short, rotation=ang, rotation_mode="anchor", ha="center", va="center", fontsize=7.5 if w == 3 else 6.5, fontfamily="Poppins",
                color=C["petroleo"] if w == 3 else C["grey"], fontweight="bold" if w == 3 else "normal", zorder=5,
                bbox=dict(boxstyle="round,pad=0.15", fc=C["crema"], ec="none"))
    ax.set_xlim(pt.x - R, pt.x + R); ax.set_ylim(pt.y - R * 0.875, pt.y + R * 0.875)
    ax.set_aspect("equal"); ax.axis("off")
    # escala 200 m
    sx, sy = pt.x - R + 40, pt.y - R * 0.875 + 45
    ax.plot([sx, sx + 200], [sy, sy], color=C["petroleo"], lw=2); ax.text(sx + 100, sy + 22, "200 m", ha="center", va="bottom", bbox=dict(boxstyle="round,pad=0.1", fc=C["crema"], ec="none"), fontsize=7, fontfamily="Poppins", color=C["petroleo"])
    ax.annotate("N", (pt.x + R - 45, pt.y + R * 0.875 - 40), xytext=(pt.x + R - 45, pt.y + R * 0.875 - 120), ha="center", fontsize=9, fontfamily="Poppins",
                fontweight="bold", color=C["petroleo"], arrowprops=dict(arrowstyle="-|>", color=C["petroleo"], lw=1.2))
    fig.text(0.985, 0.012, "© OpenStreetMap contributors · Overture Maps Foundation", ha="right", fontsize=6, fontfamily="Poppins", color=C["grey"])
    plt.subplots_adjust(0, 0.03, 1, 1)
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT_PNG, facecolor=C["crema"])
    print(OUT_PNG)


if __name__ == "__main__":
    main()
