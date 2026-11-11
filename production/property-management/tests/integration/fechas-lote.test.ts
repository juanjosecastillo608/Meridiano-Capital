/**
 * Actualización contractual 04 — fechas individuales, fecha común por lote,
 * aprobación definitiva, versiones y calendario. Datos ficticios.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { limpiar, admin, sesionDe, prisma } from "./db";
import { crearSociedad, crearPropiedad, crearUnidad, crearPersona, crearCuentaBancaria } from "@/server/services/nucleo";
import { crearContrato } from "@/server/services/contratos";
import { nuevaVersionConfiguracion, validarCanon, previsualizarBorrador, generarBorradorResidencial, registrarPasoValidacion } from "@/server/services/renovacion";
import { editarFechasContrato, aprobarFechasContrato, motivosNoAprobable, crearLote, registrarAcuerdo, registrarRevisionJuridica, confirmarLote, obtenerLote, calendarioVencimientos } from "@/server/services/fechas";

let soc: string, prop: string, cuenta: string;
const U: Record<string, string> = {};
const previo: Record<string, string> = {};
const evidencia = { nombre: "acuerdo.pdf", buffer: Buffer.from("%PDF-1.4 acuerdo de prueba") };

beforeAll(async () => {
  await limpiar();
  soc = (await crearSociedad(admin(), { razonSocial: "SOCIEDAD FECHAS S.A.", ruc: "80000002-9" })).id;
  prop = (await crearPropiedad(admin(), { sociedadId: soc, codigo: "EDF", nombre: "Edificio Fechas" })).id;
  cuenta = (await crearCuentaBancaria(admin(), { sociedadId: soc, banco: "BANCO PRUEBA", numero: "100", moneda: "PYG" })).id;
  await nuevaVersionConfiguracion(admin(), soc, { residentialLeaseDefaultTermMonths: 12, residentialLeaseInitialIncreasePercent: "0", residentialLeaseRentPolicy: "KEEP_VALIDATED_CURRENT_RENT", residentialLeaseAutoAdjustment: false, alertasDias: [90, 60, 30, 0], autorizadoPor: "Founder (prueba)", motivo: "Prueba" });
  const datos: [string, string, string | null, boolean][] = [["A", "1000000", "2000001", true], ["B", "1100000", "2000002", true], ["C", "1200000", "2000003", true], ["D", "1300000", "2000004", true], ["E", "1400000", "2000005", false], ["F", "1500000", null, true]];
  for (const [id, monto, ci, validar] of datos) {
    U[id] = (await crearUnidad(admin(), { propiedadId: prop, identificador: id, tipo: "DEPARTAMENTO" })).id;
    const per = (await crearPersona(admin(), soc, { tipo: "FISICA", nombre: `INQUILINO ${id}`, documentoTipo: ci ? "CI" : null, documentoNumero: ci })).id;
    // contrato histórico importado: su "inicio" histórico NO debe usarse como inicio del nuevo
    const c = await crearContrato(admin(), { codigo: `EDF-${id}-H`, propiedadId: prop, unidadIds: [U[id]], inquilinoIds: [per], categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", montoAlquiler: monto, estado: "BORRADOR" });
    previo[id] = c.id;
    if (validar) await validarCanon(admin(), c.id, { montoConfirmado: monto, motivo: "Contrato original (prueba)" });
  }
});

describe("fechas individuales", () => {
  it("cada contrato con su propia fecha de inicio y fin; firma independiente; sin inicio por defecto", async () => {
    await expect(previsualizarBorrador(admin(), { unidadId: U.A } as never)).rejects.toThrow(/fecha de inicio/i);
    const a = await generarBorradorResidencial(admin(), { unidadId: U.A, fechaInicio: "2030-12-01", fechaFirma: "2030-11-25", cuentaBancariaId: cuenta, confirmoFechaFin: "2031-11-30" });
    const b = await generarBorradorResidencial(admin(), { unidadId: U.B, fechaInicio: "2031-01-15", cuentaBancariaId: cuenta, confirmoFechaFin: "2032-01-14" });
    const [ca, cb] = await Promise.all([prisma.contrato.findUniqueOrThrow({ where: { id: a.contrato.id } }), prisma.contrato.findUniqueOrThrow({ where: { id: b.contrato.id } })]);
    expect([ca.fechaInicio!.toISOString().slice(0, 10), ca.fechaFin!.toISOString().slice(0, 10), ca.fechaFirma!.toISOString().slice(0, 10)]).toEqual(["2030-12-01", "2031-11-30", "2030-11-25"]);
    expect([cb.fechaInicio!.toISOString().slice(0, 10), cb.fechaFin!.toISOString().slice(0, 10), cb.fechaFirma]).toEqual(["2031-01-15", "2032-01-14", null]);
    expect(ca.dateSelectionMode).toBe("INDIVIDUAL");
    expect(ca.plazoMeses).toBe(12); // termMonths
    expect(await prisma.contratoFechaVersion.count({ where: { contratoId: ca.id } })).toBe(1);
  });

  it("no aplica fechas retroactivas sin autorización expresa", async () => {
    const sinAut = await previsualizarBorrador(admin(), { unidadId: U.C, fechaInicio: "2020-01-01", cuentaBancariaId: cuenta });
    expect(sinAut.bloqueos.join(" ")).toMatch(/retroactivas sin autorización expresa/);
    const sinPermiso = await previsualizarBorrador(sesionDe(soc, "RESPONSABLE_PROPIEDAD"), { unidadId: U.C, fechaInicio: "2020-01-01", cuentaBancariaId: cuenta, autorizacionRetroactiva: { motivo: "Regularización", autorizadoPor: "Alguien" } });
    expect(sinPermiso.bloqueos.join(" ")).toMatch(/permiso de configuración/);
    const conAut = await previsualizarBorrador(admin(), { unidadId: U.C, fechaInicio: "2020-01-01", cuentaBancariaId: cuenta, autorizacionRetroactiva: { motivo: "Regularización de ocupación", autorizadoPor: "Founder (prueba)" } });
    expect(conAut.bloqueos).toEqual([]);
    expect(conAut.advertencias.join(" ")).toMatch(/RETROACTIVO/);
  });

  it("edición individual: nueva versión, la anterior se conserva, fin recalculado por meses calendario y aprobación anulada", async () => {
    const c = await prisma.contrato.findFirstOrThrow({ where: { contratoAnteriorId: previo.A } });
    await registrarPasoValidacion(admin(), c.id, "REVISION_JURIDICA", { motivo: "Dictamen (prueba)" });
    await aprobarFechasContrato(admin(), c.id, "Fechas aprobadas (prueba)");
    await expect(editarFechasContrato(admin(), c.id, { fechaInicio: "2020-03-01", motivo: "x" })).rejects.toThrow(/retroactivas/);
    await editarFechasContrato(admin(), c.id, { fechaInicio: "2032-02-29", fechaFirma: "2032-02-20", motivo: "Acordado con el inquilino" });
    const act = await prisma.contrato.findUniqueOrThrow({ where: { id: c.id }, include: { versionesFecha: { orderBy: { version: "asc" } }, condiciones: true } });
    expect(act.fechaFin!.toISOString().slice(0, 10)).toBe("2033-02-28");
    expect(act.dateApprovedAt).toBeNull();
    expect(act.versionesFecha.map((v) => [v.version, v.fechaInicio!.toISOString().slice(0, 10), v.fechaFin!.toISOString().slice(0, 10)])).toEqual([[1, "2030-12-01", "2031-11-30"], [2, "2032-02-29", "2033-02-28"]]);
    expect(act.condiciones.map((x) => x.montoAlquiler.toString())).toEqual(["1000000"]); // canon intacto
  });
});

describe("aprobación definitiva de fechas", () => {
  it("bloquea: sin revisión jurídica, inquilino sin CI, canon no validado, fin que no coincide con el plazo", async () => {
    const b = await prisma.contrato.findFirstOrThrow({ where: { contratoAnteriorId: previo.B } });
    expect(await motivosNoAprobable(b.id)).toEqual(["Falta la revisión jurídica obligatoria."]);
    await expect(aprobarFechasContrato(sesionDe(soc, "RESPONSABLE_PROPIEDAD"), b.id, "x")).rejects.toThrow(/permiso/);
    await registrarPasoValidacion(admin(), b.id, "REVISION_JURIDICA", { motivo: "Dictamen (prueba)" });
    await prisma.contrato.update({ where: { id: b.id }, data: { fechaFin: new Date("2032-01-31") } }); // manipulación del fin
    expect((await motivosNoAprobable(b.id)).join(" ")).toMatch(/no coincide con el plazo aprobado de 12 meses/);
    await prisma.contrato.update({ where: { id: b.id }, data: { fechaFin: new Date("2032-01-14") } });
    await aprobarFechasContrato(admin(), b.id, "Fechas aprobadas (prueba)");

    const f = await generarBorradorResidencial(admin(), { unidadId: U.F, fechaInicio: "2031-03-01", cuentaBancariaId: cuenta, confirmoFechaFin: "2032-02-29" });
    expect(await motivosNoAprobable(f.contrato.id)).toContain("Inquilino no identificado (falta CI/RUC).");
    const sinCanon = await previsualizarBorrador(admin(), { unidadId: U.E, fechaInicio: "2031-03-01", cuentaBancariaId: cuenta });
    expect(sinCanon.bloqueos.join(" ")).toMatch(/canon actual no está validado/);
  });
});

describe("lote con fecha común (ContractBatch)", () => {
  let lote: string;
  it("propone la fecha común mostrando fecha anterior y propuesta; no modifica nada por sí sola", async () => {
    const b = await crearLote(admin(), { propiedadId: prop, unidadIds: [U.C, U.D, U.E], fechaComun: "2031-06-01", motivo: "Unificar vencimientos (prueba)" });
    lote = b.id;
    const { lote: l, nombreUnidad } = await obtenerLote(admin(), lote);
    const por = Object.fromEntries(l.items.map((i) => [nombreUnidad[i.unidadId], i]));
    expect(por.C.inicioPropuesto.toISOString().slice(0, 10)).toBe("2031-06-01");
    expect(por.C.finPropuesto.toISOString().slice(0, 10)).toBe("2032-05-31");
    expect(por.C.inicioAnterior).toBeNull(); // el contrato histórico no tenía fechas: se muestra como "sin fecha"
    expect(por.E.estado).toBe("EXCLUIDO"); // canon no validado
    expect(await prisma.contrato.count({ where: { contractBatchId: lote } })).toBe(0); // la propuesta no crea ni cambia contratos
    await expect(crearLote(admin(), { propiedadId: prop, unidadIds: [U.C], fechaComun: "2020-01-01", motivo: "x" })).rejects.toThrow(/retroactiva/);
  });

  it("acuerdo individual con evidencia y revisión jurídica por contrato", async () => {
    const { lote: l, nombreUnidad } = await obtenerLote(admin(), lote);
    const it = (u: string) => l.items.find((i) => nombreUnidad[i.unidadId] === u)!.id;
    await expect(registrarAcuerdo(admin(), it("C"), { acepta: true, motivo: "Nota firmada" })).rejects.toThrow(/evidencia/);
    await registrarAcuerdo(admin(), it("C"), { acepta: true, motivo: "Nota firmada por el inquilino", evidencia });
    await registrarRevisionJuridica(admin(), it("C"), { aprobada: true, motivo: "Dictamen (prueba)" });
    // D: acepta pero la revisión jurídica observa
    await registrarAcuerdo(admin(), it("D"), { acepta: true, motivo: "Mensaje del inquilino", evidencia });
    await expect(registrarRevisionJuridica(sesionDe(soc, "RESPONSABLE_PROPIEDAD"), it("D"), { aprobada: true, motivo: "x" })).rejects.toThrow(/permiso/);
    await registrarRevisionJuridica(admin(), it("D"), { aprobada: false, motivo: "Observada: falta garante" });
  });

  it("confirma solo los autorizados, excluye el resto y genera los borradores individualmente", async () => {
    const r = await confirmarLote(admin(), lote, { cuentaBancariaId: cuenta });
    const nombres = (await obtenerLote(admin(), lote)).nombreUnidad;
    const por = Object.fromEntries(r.map((x) => [nombres[x.unidadId], x]));
    expect(por.C.estado).toBe("GENERADO");
    expect(por.D.estado).toBe("EXCLUIDO");
    expect(por.D.detalle).toMatch(/revisión jurídica/);
    expect(por.E.estado).toBe("EXCLUIDO");
    const c = await prisma.contrato.findUniqueOrThrow({ where: { id: por.C.contratoId! } });
    expect(c).toMatchObject({ dateSelectionMode: "COMUN", dateAgreementStatus: "ACEPTADO", legalReviewStatus: "APROBADA", contractBatchId: lote, estado: "BORRADOR" });
    expect(c.dateAgreementEvidenceId).toBeTruthy();
    expect(c.fechaFin!.toISOString().slice(0, 10)).toBe("2032-05-31");
    expect(await prisma.contrato.findFirst({ where: { contratoAnteriorId: previo.D } })).toBeNull(); // excluido: sin borrador
    await expect(confirmarLote(admin(), lote, {})).rejects.toThrow(/ya fue confirmado/);
    // aprobación definitiva de la fecha común: requiere el acuerdo registrado
    await aprobarFechasContrato(admin(), c.id, "Aprobado (prueba)");
    await prisma.contrato.update({ where: { id: c.id }, data: { dateAgreementEvidenceId: null, dateApprovedAt: null } });
    expect(await motivosNoAprobable(c.id)).toContain("Fecha común sin acuerdo del inquilino registrado.");
  });
});

describe("calendario de vencimientos", () => {
  it("vencimiento individual de cada contrato y recordatorios 90/60/30, por sociedad y edificio, aislado", async () => {
    const cal = await calendarioVencimientos(admin(), { sociedadId: soc, propiedadId: prop, desde: "2031-01-01", hasta: "2033-12-31" });
    const b = await prisma.contrato.findFirstOrThrow({ where: { contratoAnteriorId: previo.B } });
    const evB = cal.eventos.filter((e) => e.contratoId === b.id).map((e) => [e.tipo, e.fecha]);
    expect(evB).toEqual([["RECORDATORIO_90", "2031-10-16"], ["RECORDATORIO_60", "2031-11-15"], ["RECORDATORIO_30", "2031-12-15"], ["VENCIMIENTO", "2032-01-14"]]);
    const fines = new Set(cal.eventos.filter((e) => e.tipo === "VENCIMIENTO").map((e) => e.fecha));
    expect(fines.size).toBeGreaterThan(2); // fechas individuales distintas
    const otra = (await crearSociedad(admin(), { razonSocial: "OTRA SOCIEDAD S.A." })).id;
    const ajena = await calendarioVencimientos(sesionDe(otra), { desde: "2031-01-01", hasta: "2033-12-31" });
    expect(ajena.eventos).toHaveLength(0);
    await expect(calendarioVencimientos(sesionDe(otra), { sociedadId: soc, desde: "2031-01-01", hasta: "2033-12-31" })).rejects.toThrow(/permiso/);
  });
});
