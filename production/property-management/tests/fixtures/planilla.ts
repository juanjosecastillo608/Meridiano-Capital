import ExcelJS from "exceljs";

/**
 * Planilla SINTÉTICA de prueba que reproduce la ESTRUCTURA de una planilla de
 * cobro mensual real (bloque de metadatos, encabezado en fila 10, fórmulas de
 * IVA, totales y bloque de egresos). Todos los nombres, teléfonos e importes
 * son ficticios — DATOS DE PRUEBA, nunca productivos.
 */
export async function planillaPrueba(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const meses: [string, string, number][] = [["Estructura Ing DetalladaMarzo26", "Marzo", 3], ["Estructura Ing DetalladaAbril26", "Abril", 4], ["Estructura Ing DetalleMayo26", "Abril", 5]];
  for (const [nombre, mesTxt, mes] of meses) {
    const ws = wb.addWorksheet(nombre);
    ws.getCell("B2").value = "Edificio: PRUEBA Asuncion";
    ws.getCell("B3").value = "Cliente:";
    ws.getCell("C3").value = "PROPIETARIO DE PRUEBA";
    ws.getCell("L3").value = "Cta Cte 000-00000-00";
    ws.getCell("B7").value = "EDIFICIO DE PRUEBA";
    ws.mergeCells("B7:N7");
    ws.getCell("O7").value = new Date(Date.UTC(2026, mes - 1, 1));
    ws.getCell("B8").value = "Cuenta con un total de 3 departamentos más 1 salón comercial.";
    const enc = ["Unidad", "Inquilino", "Telefono", "Monto Alquiler Actual", `Pago Mes ${mesTxt}`, `Pago Expensas ${mesTxt}`, "PAGO", "Monto FACTURA", "Monto IVA", "Fecha Pago", "Obs", "Tipologia", "M2", "NIS ANDE"];
    enc.forEach((t, i) => (ws.getCell(10, 2 + i).value = t));
    const filas: (string | number | Date | null)[][] = [
      ["Salon", "Libre", null, 2500000, 0, 180000, null, null, null, null, null, null, null, 9000001],
      [2, "INQUILINO PRUEBA UNO", "+595900000001", 700000, 880000, 180000, "OK", 880000, null, new Date(Date.UTC(2026, 2, 8)), null, "1 Dormitorio", null, 9000002],
      [3, "INQUILINO PRUEBA DOS", "+595900000002", 1600000, mes === 4 ? 0 : 1680000, 80000, "OK", 1680000, null, mes === 4 ? null : new Date(Date.UTC(2026, mes - 1, 5)), null, "2 Dormitorio", null, 9000003],
      [4, "Libre", null, 1100000, 0, 80000, null, 0, 0, null, "Pres. Reparaciones", "2 Dormitorio", null, 9000003],
    ];
    filas.forEach((f, r) => {
      f.forEach((v, c) => { if (v !== null) ws.getCell(11 + r, 2 + c).value = v as ExcelJS.CellValue; });
      const fila = 11 + r;
      if (r === 1 || r === 2) ws.getCell(fila, 10).value = { formula: `E${fila}*0.05`, result: Number(f[3]) * 0.05 };
    });
    // Fecha de pago de la unidad 2: en mayo se copió la de abril (para detectar duplicado)
    ws.getCell("K12").value = new Date(Date.UTC(2026, Math.min(mes, 4) - 1, 8));
    ws.getCell("B15").value = "Ingresos Totales";
    ws.getCell("E15").value = { formula: "SUM(E11:E14)", result: 5900000 };
    ws.getCell("B17").value = "ESSAP";
    ws.getCell("C17").value = 300000;
  }
  return Buffer.from(await wb.xlsx.writeBuffer());
}
