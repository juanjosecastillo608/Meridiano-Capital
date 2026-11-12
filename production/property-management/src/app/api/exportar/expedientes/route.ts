import ExcelJS from "exceljs";
import { obtenerSesion } from "@/lib/sesion";
import { expedientesPropiedad } from "@/server/services/expedientes";
import { ErrorNegocio } from "@/server/db";

/** Checklist de expedientes por edificio en Excel: resumen por unidad + detalle de faltantes/alertas. */
export async function GET(req: Request) {
  const s = await obtenerSesion();
  if (!s) return new Response("No autenticado", { status: 401 });
  const propiedadId = new URL(req.url).searchParams.get("propiedadId") ?? "";
  let ex;
  try { ex = await expedientesPropiedad(s, propiedadId); }
  catch (e) { return new Response(e instanceof ErrorNegocio ? "Sin acceso" : "Error", { status: e instanceof ErrorNegocio ? 404 : 500 }); }
  const wb = new ExcelJS.Workbook();
  wb.creator = "Meridiano Capital | Property Management";
  const r = wb.addWorksheet("Resumen");
  r.addRow([`MERIDIANO CAPITAL — Expedientes ${ex[0]?.edificio.codigo ?? ""} — ${new Date().toISOString().slice(0, 10)}`]).font = { bold: true };
  r.addRow([]);
  r.addRow(["Unidad", "Situación", "Inquilino(s)", "RUC", "CI", "Canon (IVA incl.)", "OK", "Falta", "Alertas", "Listo borrador", "Listo contrato real"]).font = { bold: true };
  for (const e of ex) r.addRow([e.unidad, e.situacion, e.inquilinos.map((i) => i.nombre).join(" / "), e.inquilinos.map((i) => i.ruc ?? "").join(" / "), e.inquilinos.map((i) => i.ci ?? "").join(" / "), e.canon ? Number(e.canon) : null, e.resumen.ok, e.resumen.falta, e.resumen.alerta, e.resumen.listoParaBorrador ? "sí" : "no", e.resumen.listoParaContratoReal ? "sí" : "no"]);
  r.getColumn(6).numFmt = "#,##0";
  r.columns.forEach((c) => (c.width = 16));
  const d = wb.addWorksheet("Checklist");
  d.addRow(["Unidad", "Grupo", "Ítem", "Estado", "Bloquea contrato real", "Detalle"]).font = { bold: true };
  for (const e of ex) for (const i of e.items) d.addRow([e.unidad, i.grupo, i.etiqueta, i.estado, i.bloqueaContrato && i.estado !== "OK" ? "sí" : "", i.detalle]);
  d.columns.forEach((c, k) => (c.width = k === 5 ? 90 : 22));
  const buf = await wb.xlsx.writeBuffer();
  return new Response(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="expedientes-${ex[0]?.edificio.codigo ?? "edificio"}.xlsx"`, "Cache-Control": "private, no-store" } });
}
