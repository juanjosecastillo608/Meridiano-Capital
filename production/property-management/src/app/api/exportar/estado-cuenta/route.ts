import ExcelJS from "exceljs";
import { obtenerSesion } from "@/lib/sesion";
import { estadoDeCuenta } from "@/server/services/finanzas";
import { ErrorNegocio } from "@/server/db";
import { sumar } from "@/domain/money";

/** Estado de cuenta en Excel (por unidad o inquilino), respetando el aislamiento por sociedad. */
export async function GET(req: Request) {
  const s = await obtenerSesion();
  if (!s) return new Response("No autenticado", { status: 401 });
  const url = new URL(req.url);
  const unidadId = url.searchParams.get("unidadId") ?? undefined;
  const personaId = url.searchParams.get("personaId") ?? undefined;
  let ec;
  try {
    ec = await estadoDeCuenta(s, { unidadId, personaId });
  } catch (e) {
    return new Response(e instanceof ErrorNegocio ? e.message : "Error", { status: 400 });
  }
  const wb = new ExcelJS.Workbook();
  wb.creator = "Meridiano Capital | Property Management";
  const ws = wb.addWorksheet("Estado de cuenta");
  ws.addRow(["MERIDIANO CAPITAL — Estado de cuenta"]).font = { bold: true, size: 13 };
  ws.addRow([`Generado: ${new Date().toISOString().slice(0, 10)}`]);
  ws.addRow([]);
  const enc = ws.addRow(["Período", "Unidad", "Inquilino", "Concepto", "Vencimiento", "Moneda", "Total", "Pagado", "Saldo", "Estado", "Facturación", "IVA pendiente"]);
  enc.font = { bold: true };
  for (const o of ec.obligaciones) {
    ws.addRow([o.periodo, o.unidad?.identificador ?? "", o.persona.nombre, o.concepto, o.fechaVencimiento, o.moneda, Number(o.importeTotal.toString()), Number(sumar(o.aplicaciones.map((a) => a.importe.toString())).toString()), Number(o.saldo.toString()), o.vencida ? "VENCIDA" : o.estado, o.estadoFacturacion, o.ivaPendiente ? "sí" : "no"]);
  }
  ws.addRow([]);
  for (const [m, v] of Object.entries(ec.porMoneda)) {
    ws.addRow([`Deuda total ${m}`, "", "", "", "", m, "", "", Number(v.deuda.total.toString())]).font = { bold: true };
    ws.addRow([`Saldo a favor ${m}`, "", "", "", "", m, "", "", Number(v.saldoAFavor.toString())]);
  }
  ws.columns.forEach((c) => (c.width = 15));
  [7, 8, 9].forEach((i) => (ws.getColumn(i).numFmt = "#,##0"));
  const pagos = wb.addWorksheet("Pagos");
  pagos.addRow(["Fecha pago", "Acreditación", "Método", "Comprobante", "Moneda", "Importe", "Estado", "Conciliado"]).font = { bold: true };
  for (const p of ec.pagos) pagos.addRow([p.fechaPago, p.fechaAcreditacion, p.metodo, p.comprobante ?? "", p.moneda, Number(p.importe.toString()), p.estado, p.conciliado ? "sí" : "no"]);
  const buf = await wb.xlsx.writeBuffer();
  return new Response(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="estado-de-cuenta-${unidadId ?? personaId}.xlsx"`, "Cache-Control": "no-store" } });
}
