#!/usr/bin/env python3
"""Validación comercial de la matriz de datos de la propiedad (Fase 3).

Lee la matriz JSON construida en la Fase 2 (formato en
references/commercial_validation.md) y verifica monedas, superficies,
porcentajes, estados y fuentes; recalcula subtotales y totales; detecta
contradicciones entre fuentes y las resuelve por jerarquía o las marca para
confirmación. NUNCA corrige datos: solo informa.

Códigos de salida:
  0 = sin errores ni contradicciones materiales abiertas
  1 = errores (cálculo que no coincide, dato inválido, campo sin fuente)
  3 = requiere confirmación del usuario (contradicción material de igual jerarquía)

Uso:
  python validate_property_data.py matriz.json [--out validacion_datos.json]
"""
import argparse
import ast
import json
import operator
import re
import sys
from pathlib import Path

STATUSES = {"confirmado", "calculado", "inferido", "pendiente"}
MATERIAL = {"precio", "superficie", "rentabilidad", "condiciones", "partes", "legal", "tecnica", "contacto", "moneda", "operacion"}
MONEY_UNITS = re.compile(r"^(USD|PYG|GS|EUR|BRL|ARS|CLP|U\$S|\$)", re.I)
AREA_UNITS = {"m2", "m²", "ha", "hectareas", "hectáreas", "m2/nave", "m²/nave"}
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv,
       ast.USub: operator.neg, ast.UAdd: operator.pos, ast.Pow: operator.pow}


def parse_number(raw):
    """Convierte cifras en formato es-PY/es-AR o en-US. Devuelve (valor, nota)."""
    if raw is None:
        return None, "vacío"
    if isinstance(raw, (int, float)):
        return float(raw), None
    s = str(raw).strip()
    s = re.sub(r"(?i)(usd|u\$s|pyg|gs\.?|eur|brl|ars|clp|\+\s*iva|iva incluido|m²|m2|ha|hect[aá]reas|%|/mes|por m²|por m2)", " ", s)
    s = s.replace("$", " ").replace(" ", " ").strip()
    m = re.search(r"-?[\d.,]+", s)
    if not m:
        return None, f"no numérico: {raw!r}"
    t = m.group(0).strip(".,")
    note = None
    if "," in t and "." in t:
        if t.rfind(",") > t.rfind("."):   # 1.234,56
            t = t.replace(".", "").replace(",", ".")
        else:                              # 1,234.56
            t = t.replace(",", "")
    elif "," in t:
        parts = t.split(",")
        if len(parts) == 2 and len(parts[1]) != 3:
            t = t.replace(",", ".")        # 5,50 -> decimal
        elif len(parts) == 2:
            note = f"'{m.group(0)}' interpretado como decimal es-PY (coma decimal)"
            t = t.replace(",", ".")
        else:
            t = t.replace(",", "")
    elif "." in t:
        parts = t.split(".")
        if all(len(p) == 3 for p in parts[1:]):
            t = t.replace(".", "")         # 11.000 -> miles es-PY
            if len(parts) == 2:
                note = f"'{m.group(0)}' interpretado como miles (formato es-PY)"
        # si no, punto decimal
    try:
        return float(t), note
    except ValueError:
        return None, f"no numérico: {raw!r}"


def safe_eval(expr, env):
    def ev(node):
        if isinstance(node, ast.Expression):
            return ev(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return float(node.value)
        if isinstance(node, ast.Name):
            if node.id not in env:
                raise KeyError(node.id)
            return env[node.id]
        if isinstance(node, ast.BinOp) and type(node.op) in OPS:
            return OPS[type(node.op)](ev(node.left), ev(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in OPS:
            return OPS[type(node.op)](ev(node.operand))
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in ("round", "min", "max", "sum"):
            args = [ev(a) for a in node.args]
            return {"round": round, "min": min, "max": max, "sum": lambda *x: sum(x)}[node.func.id](*args)
        raise ValueError(f"expresión no permitida: {ast.dump(node)[:60]}")
    return ev(ast.parse(expr, mode="eval"))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("matrix")
    ap.add_argument("--out")
    a = ap.parse_args()
    m = json.loads(Path(a.matrix).read_text(encoding="utf-8"))
    errors, warnings, needs_confirmation, resolved, parse_notes = [], [], [], [], []

    prop = m.get("property", {})
    for k in ("name", "asset_type", "operation", "meridiano_role"):
        if not prop.get(k):
            (needs_confirmation if k in ("name", "operation", "meridiano_role") else warnings).append(
                {"field": f"property.{k}", "issue": "no determinado en las fuentes"})

    by_key = {}
    for i, f in enumerate(m.get("fields", [])):
        key = f.get("key") or f"campo_{i}"
        st = (f.get("status") or "").lower()
        if st not in STATUSES:
            errors.append({"field": key, "issue": f"estado inválido {f.get('status')!r} (usar {sorted(STATUSES)})"})
        if st != "pendiente" and not f.get("source"):
            errors.append({"field": key, "issue": "dato sin fuente: todo dato presentado debe citar su archivo y ubicación"})
        val, note = parse_number(f.get("value")) if f.get("numeric", True) else (None, None)
        if note:
            parse_notes.append({"field": key, "note": note})
        f["_num"] = val
        unit = (f.get("unit") or "").strip()
        cat = (f.get("category") or "").lower()
        if val is not None:
            if unit.lower() in AREA_UNITS or cat == "superficie":
                if val <= 0:
                    errors.append({"field": key, "issue": f"superficie no positiva: {f.get('value')}"})
            if unit == "%" or cat == "rentabilidad":
                if val < 0 or val > 100:
                    errors.append({"field": key, "issue": f"porcentaje fuera de rango: {f.get('value')}"})
                elif cat == "rentabilidad" and val > 25:
                    warnings.append({"field": key, "issue": f"rentabilidad de {val}% atípica: verificar fuente y método (bruta/neta)"})
            if MONEY_UNITS.match(unit) or cat == "precio":
                if val < 0:
                    errors.append({"field": key, "issue": "importe negativo"})
                if not f.get("currency"):
                    errors.append({"field": key, "issue": "importe sin moneda explícita"})
                if not f.get("tax"):
                    warnings.append({"field": key, "issue": "no indica tratamiento de IVA (+IVA / IVA incluido / exento): no asumirlo"})
        by_key.setdefault(key, []).append(f)

    # Monedas
    currencies = sorted({f.get("currency").upper() for f in m.get("fields", []) if f.get("currency")})
    if len(currencies) > 1:
        warnings.append({"field": "moneda", "issue": f"monedas mixtas {currencies}: no convertir ni sumar sin tipo de cambio documentado"})

    # Contradicciones entre fuentes
    winners = {}
    for key, fs in by_key.items():
        vals = {(f["_num"] if f["_num"] is not None else str(f.get("value")).strip().lower()) for f in fs}
        if len(fs) > 1 and len(vals) > 1:
            ranked = sorted(fs, key=lambda f: f.get("source_rank", 99))
            top = ranked[0].get("source_rank", 99)
            tied = [f for f in ranked if f.get("source_rank", 99) == top]
            tied_vals = {(f["_num"] if f["_num"] is not None else str(f.get("value")).strip().lower()) for f in tied}
            detail = [{"value": f.get("value"), "source": f.get("source"), "rank": f.get("source_rank")} for f in fs]
            cat = (fs[0].get("category") or "").lower()
            if len(tied_vals) > 1:
                (needs_confirmation if cat in MATERIAL else warnings).append(
                    {"field": key, "issue": "contradicción entre fuentes de igual jerarquía", "values": detail})
                winners[key] = None
            else:
                norm = lambda f: f["_num"] if f["_num"] is not None else str(f.get("value")).strip().lower()  # noqa: E731
                win = norm(ranked[0])
                item = {"field": key, "used": ranked[0].get("value"), "source": ranked[0].get("source"),
                        "confirmed_by": [{"value": f.get("value"), "source": f.get("source"), "rank": f.get("source_rank")} for f in ranked[1:] if norm(f) == win],
                        "discarded": [{"value": f.get("value"), "source": f.get("source"), "rank": f.get("source_rank")} for f in ranked[1:] if norm(f) != win],
                        "rule": "jerarquía de fuentes (references/source_priority.md)"}
                if cat in MATERIAL:
                    item["confirm_suggested"] = True
                    warnings.append({"field": key, "issue": f"dato material resuelto por jerarquía ({ranked[0].get('value')} sobre {[d['value'] for d in item['discarded']]}): se usa, pero conviene confirmarlo con el usuario (pregunta no bloqueante)"})
                resolved.append(item)
                winners[key] = ranked[0]
        else:
            winners[key] = sorted(fs, key=lambda f: f.get("source_rank", 99))[0]

    # Cálculos
    env = {k: w["_num"] for k, w in winners.items() if w is not None and w["_num"] is not None}
    calc_results = []
    for c in m.get("calculations", []):
        cid = c.get("id", c.get("formula"))
        names = {n.id for n in ast.walk(ast.parse(c["formula"], mode="eval")) if isinstance(n, ast.Name) and n.id not in ("round", "min", "max", "sum")}
        weak = [n for n in names if n in winners and winners[n] is not None and winners[n].get("status") in ("inferido", "pendiente")]
        unresolved = [n for n in names if n in winners and winners[n] is None]
        try:
            val = safe_eval(c["formula"], env)
        except KeyError as e:
            calc_results.append({"id": cid, "status": "no_calculable", "missing": str(e)})
            warnings.append({"field": cid, "issue": f"falta el dato {e} para calcular: no presentar el resultado como confirmado"})
            continue
        except (ValueError, ZeroDivisionError) as e:
            errors.append({"field": cid, "issue": f"fórmula inválida: {e}"})
            continue
        res = {"id": cid, "formula": c["formula"], "computed": round(val, 6)}
        if c.get("stated") is not None:
            stated, _ = parse_number(c["stated"])
            tol = float(c.get("tolerance_pct", 0.5))
            res["stated"] = c["stated"]
            if stated is None:
                errors.append({"field": cid, "issue": f"valor declarado ilegible {c['stated']!r}"})
            else:
                diff = abs(val - stated) / (abs(stated) or 1) * 100
                res["diff_pct"] = round(diff, 4)
                if diff > tol:
                    res["status"] = "no_coincide"
                    errors.append({"field": cid, "issue": f"el cálculo da {val:,.4f} y la fuente declara {c['stated']} (dif. {diff:.3f}% > {tol}%)"})
                else:
                    res["status"] = "coincide"
        else:
            res["status"] = "calculado"
        if weak or unresolved:
            res["status"] = res.get("status", "calculado") + "_no_confirmable"
            res["depends_on_unconfirmed"] = weak + unresolved
            warnings.append({"field": cid, "issue": f"depende de datos no confirmados {weak + unresolved}: mostrarlo como estimación, nunca como confirmado"})
        calc_results.append(res)

    # Campos mínimos según el tipo de operación
    op = (prop.get("operation") or "").lower()
    expected = {"venta": ["precio", "superficie"], "alquiler": ["precio", "superficie"], "preventa": ["precio", "superficie", "entrega"],
                "inversion": ["precio", "rentabilidad"], "inversión": ["precio", "rentabilidad"]}.get(op, [])
    present = {(f.get("category") or "").lower() for f in m.get("fields", []) if (f.get("status") or "") != "pendiente"}
    for need in expected:
        if need not in present:
            (needs_confirmation if need in ("precio", "superficie") else warnings).append(
                {"field": need, "issue": f"sin dato de '{need}' para una operación de {op}: no inventarlo; omitir la sección o pedirlo"})
    missing = [f.get("key") for f in m.get("fields", []) if (f.get("status") or "") == "pendiente"]

    report = {
        "property": prop, "errors": errors, "needs_confirmation": needs_confirmation, "warnings": warnings,
        "resolved_by_hierarchy": resolved, "calculations": calc_results, "parse_notes": parse_notes,
        "pending_fields": missing, "currencies": currencies,
        "result": "ERROR" if errors else "REQUIERE_CONFIRMACION" if needs_confirmation else "OK",
    }
    out = json.dumps(report, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
        print(json.dumps({"out": a.out, "result": report["result"], "errors": errors, "needs_confirmation": needs_confirmation}, ensure_ascii=False, indent=2))
    else:
        print(out)
    sys.exit(1 if errors else 3 if needs_confirmation else 0)


if __name__ == "__main__":
    main()
