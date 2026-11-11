/**
 * Actualización contractual 03 — contratos residenciales de 12 meses.
 * Datos ficticios (DATOS DE PRUEBA).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { limpiar, admin, sesionDe, prisma } from "./db";
import { crearSociedad, crearPropiedad, crearUnidad, crearPersona, crearCuentaBancaria } from "@/server/services/nucleo";
import { crearContrato, cambiarEstadoContrato } from "@/server/services/contratos";
import { nuevaVersionConfiguracion, configuracionVigente, validarCanon, candidatosRenovacion, previsualizarBorrador, generarBorradorResidencial, registrarPasoValidacion } from "@/server/services/renovacion";
import { registrarPago } from "@/server/services/finanzas";
import { alertasVencimiento } from "@/server/services/contratos";
import { obtenerArchivo } from "@/server/services/documentos";

let soc: string, prop: string, uFirma: string, uMitad: string, uVencido: string, uLocal: string, uSinDoc: string, uConflicto: string;
const contratos: Record<string, string> = {};
const CFG = { residentialLeaseDefaultTermMonths: 12, residentialLeaseInitialIncreasePercent: "0", residentialLeaseRentPolicy: "KEEP_VALIDATED_CURRENT_RENT" as const, residentialLeaseAutoAdjustment: false, alertasDias: [90, 60, 30, 0], autorizadoPor: "Founder (prueba)", motivo: "Actualización contractual 03 (prueba)" };

async function contratoPrevio(unidadId: string, codigo: string, persona: string, monto: string, opts: { inicio?: string; fin?: string; estado?: "VIGENTE" | "BORRADOR" } = {}) {
  const c = await crearContrato(admin(), { codigo, propiedadId: prop, unidadIds: [unidadId], inquilinoIds: [persona], categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", fechaInicio: opts.inicio ?? null, fechaFin: opts.fin ?? null, diaVencimiento: opts.inicio ? 10 : null, montoAlquiler: monto, estado: opts.estado ?? "BORRADOR" });
  contratos[codigo] = c.id;
  return c;
}

beforeAll(async () => {
  await limpiar();
  soc = (await crearSociedad(admin(), { razonSocial: "SOCIEDAD CONTRATOS S.A.", ruc: "80000001-0" })).id;
  prop = (await crearPropiedad(admin(), { sociedadId: soc, codigo: "ED1", nombre: "Edificio Uno" })).id;
  const u = async (id: string, tipo: "DEPARTAMENTO" | "LOCAL_COMERCIAL" = "DEPARTAMENTO") => (await crearUnidad(admin(), { propiedadId: prop, identificador: id, tipo })).id;
  [uFirma, uMitad, uVencido, uLocal, uSinDoc, uConflicto] = [await u("2"), await u("3"), await u("4"), await u("Salon", "LOCAL_COMERCIAL"), await u("5"), await u("6")];
  const per = async (n: string, doc?: string) => (await crearPersona(admin(), soc, { tipo: "FISICA", nombre: n, documentoTipo: doc ? "CI" : null, documentoNumero: doc ?? null, domicilio: doc ? "Domicilio de prueba" : null })).id;
  await contratoPrevio(uFirma, "ED1-2-A", await per("INQUILINO DOS", "1000002"), "700000");
  await contratoPrevio(uMitad, "ED1-3-A", await per("INQUILINO TRES", "1000003"), "1600000");
  await contratoPrevio(uVencido, "ED1-4-A", await per("INQUILINO CUATRO", "1000004"), "1300000", { inicio: "2025-06-01", fin: "2026-05-31", estado: "VIGENTE" });
  await contratoPrevio(uSinDoc, "ED1-5-A", await per("INQUILINO SIN DOCUMENTO"), "1700000");
  await contratoPrevio(uConflicto, "ED1-6-A", await per("INQUILINO SEIS", "1000006"), "2800000");
  // Planilla con un importe distinto para la unidad 6 (2.500.000 un mes)
  await prisma.obligacion.create({ data: { sociedadId: soc, propiedadId: prop, unidadId: uConflicto, contratoId: contratos["ED1-6-A"], personaId: (await prisma.contratoParte.findFirstOrThrow({ where: { contratoId: contratos["ED1-6-A"] } })).personaId, periodo: "2026-08", concepto: "ALQUILER", fechaVencimiento: new Date("2026-08-31"), moneda: "PYG", importeNeto: "2500000", iva: "0", importeTotal: "2500000", saldo: "2500000", claveIdempotencia: "test:planilla:6", origenDato: "IMPORTADO" } });
  await cambiarEstadoContrato(admin(), contratos["ED1-4-A"], "VENCIDO", { motivo: "Plazo cumplido (prueba)" });
});

describe("configuración versionada", () => {
  it("cada cambio es una versión nueva con autorización, usuario y fecha; nunca se edita la anterior", async () => {
    await expect(nuevaVersionConfiguracion(sesionDe(soc, "PROPIETARIO_CONSULTA"), soc, CFG)).rejects.toThrow(/permiso/);
    await expect(nuevaVersionConfiguracion(admin(), soc, { ...CFG, autorizadoPor: "" })).rejects.toThrow();
    const v1 = await nuevaVersionConfiguracion(admin(), soc, { ...CFG, residentialLeaseDefaultTermMonths: 24 });
    const v2 = await nuevaVersionConfiguracion(admin(), soc, CFG);
    expect([v1.version, v2.version]).toEqual([1, 2]);
    expect((await prisma.configuracionContractual.findUniqueOrThrow({ where: { id: v1.id } })).residentialLeaseDefaultTermMonths).toBe(24);
    const vig = await configuracionVigente(soc);
    expect(vig).toMatchObject({ version: 2, residentialLeaseDefaultTermMonths: 12, residentialLeaseRentPolicy: "KEEP_VALIDATED_CURRENT_RENT", residentialLeaseAutoAdjustment: false });
    expect(vig!.residentialLeaseInitialIncreasePercent.toString()).toBe("0");
    expect(await prisma.auditLog.count({ where: { accion: "CONFIGURACION_CONTRACTUAL_VERSION", entidadId: soc } })).toBe(2);
    expect((await prisma.configuracionAlerta.findFirstOrThrow({ where: { sociedadId: soc } })).dias).toEqual([90, 60, 30, 0]);
  });
});

describe("canon validado", () => {
  it("no se genera nada sin canon validado; la validación exige confirmar el importe exacto", async () => {
    const v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01" });
    expect(v.bloqueos.join(" ")).toMatch(/no está validado/);
    await expect(validarCanon(admin(), contratos["ED1-2-A"], { montoConfirmado: "880000", motivo: "Recibo" })).rejects.toThrow(/no coincide/); // 880.000 = alquiler + expensas: no es canon
    await validarCanon(admin(), contratos["ED1-2-A"], { montoConfirmado: "700000", motivo: "Contrato original (prueba)" });
    for (const [c, m] of [["ED1-3-A", "1600000"], ["ED1-4-A", "1300000"], ["ED1-5-A", "1700000"]]) await validarCanon(admin(), contratos[c], { montoConfirmado: m, motivo: "Contrato original (prueba)" });
  });

  it("diferencias entre planilla y contrato DETIENEN la validación", async () => {
    await expect(validarCanon(admin(), contratos["ED1-6-A"], { montoConfirmado: "2800000", motivo: "x" })).rejects.toThrow(/Diferencias entre planillas/);
    const c = (await candidatosRenovacion(admin(), prop)).find((x) => x.identificador === "6")!;
    expect(c.elegible).toBe(false);
    expect(c.diferenciasPlanilla).toEqual([{ periodo: "2026-08", monto: "2500000" }]);
  });

  it("pagos parciales, anticipos y expensas no cambian el canon", async () => {
    const persona = (await prisma.contratoParte.findFirstOrThrow({ where: { contratoId: contratos["ED1-3-A"] } })).personaId;
    await registrarPago(admin(), { sociedadId: soc, personaId: persona, fechaPago: "2026-11-01", metodo: "EFECTIVO", moneda: "PYG", importe: "500000" }); // anticipo/parcial
    const v = await previsualizarBorrador(admin(), { unidadId: uMitad, fechaInicio: "2026-11-16" });
    expect(v.canon).toBe("1600000");
  });
});

describe("cuentas bancarias", () => {
  it("sin cuentas: faltante; con varias: hay que elegir explícitamente; moneda y sociedad verificadas", async () => {
    let v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01" });
    expect(v.faltantes.some((f) => /no tiene cuentas activas/.test(f))).toBe(true);
    const c1 = await crearCuentaBancaria(admin(), { sociedadId: soc, banco: "BANCO PRUEBA A", numero: "001", moneda: "PYG" });
    await crearCuentaBancaria(admin(), { sociedadId: soc, banco: "BANCO PRUEBA B", numero: "002", moneda: "PYG" });
    const usd = await crearCuentaBancaria(admin(), { sociedadId: soc, banco: "BANCO PRUEBA C", numero: "003", moneda: "USD" });
    v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01" });
    expect(v.bloqueos.join(" ")).toMatch(/varias cuentas activas/);
    v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", cuentaBancariaId: usd.id });
    expect(v.bloqueos.join(" ")).toMatch(/USD/);
    v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", cuentaBancariaId: c1.id });
    expect(v.bloqueos).toEqual([]);
    expect(v.cuenta).toMatch(/BANCO PRUEBA A/);
  });
});

describe("generación de borradores", () => {
  const cuenta = async () => (await prisma.cuentaBancaria.findFirstOrThrow({ where: { sociedadId: soc, numero: "001" } })).id;

  it("inicio el primer día del mes, firma distinta del inicio, canon exacto, 0 % y sin reajuste; BORRADOR pendiente", async () => {
    const v = await previsualizarBorrador(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", fechaFirma: "2026-11-20", cuentaBancariaId: await cuenta(), diaVencimiento: 10 });
    expect(v).toMatchObject({ fechaInicio: "2026-12-01", fechaFin: "2027-11-30", plazoMeses: 12, canon: "700000", incrementoPct: "0", moneda: "PYG" });
    expect(v.advertencias.join(" ")).toMatch(/firma.*difiere del inicio/);
    await expect(generarBorradorResidencial(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", cuentaBancariaId: await cuenta(), confirmoFechaFin: "2027-12-01" })).rejects.toThrow(/Confirme la vista previa/);
    const r = await generarBorradorResidencial(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", fechaFirma: "2026-11-20", cuentaBancariaId: await cuenta(), diaVencimiento: 10, confirmoFechaFin: "2027-11-30" });
    const c = await prisma.contrato.findUniqueOrThrow({ where: { id: r.contrato.id }, include: { condiciones: true } });
    expect(c.estado).toBe("BORRADOR");
    expect(c.estadoDato).toBe("PENDIENTE_REVISION");
    expect(c.fechaInicio!.toISOString().slice(0, 10)).toBe("2026-12-01");
    expect(c.fechaFin!.toISOString().slice(0, 10)).toBe("2027-11-30");
    expect(c.fechaFirma!.toISOString().slice(0, 10)).toBe("2026-11-20");
    expect(c.condiciones.map((x) => x.montoAlquiler.toString())).toEqual(["700000"]);
    expect(c.reajusteTipo).toBe("SIN_REAJUSTE");
    expect(c.reajusteValidado).toBe(false);
    expect(c.contratoAnteriorId).toBe(contratos["ED1-2-A"]);
    expect(c.configuracionVersion).toBe(2);
    expect(c.cuentaBancariaId).toBe(await cuenta());
    // historial: el contrato anterior y su condición siguen intactos
    const ant = await prisma.contrato.findUniqueOrThrow({ where: { id: contratos["ED1-2-A"] }, include: { condiciones: true } });
    expect(ant.estado).toBe("BORRADOR");
    expect(ant.condiciones.map((x) => x.montoAlquiler.toString())).toEqual(["700000"]);
    // documento DOCX provisional
    const doc = await obtenerArchivo(admin(), r.documentoId);
    expect(doc.documento.tipo).toBe("CONTRATO_ALQUILER");
    expect(doc.contenido.subarray(0, 2).toString()).toBe("PK"); // zip/docx
    // no se genera dos veces
    await expect(generarBorradorResidencial(admin(), { unidadId: uFirma, fechaInicio: "2026-12-01", cuentaBancariaId: await cuenta(), confirmoFechaFin: "2027-11-30" })).rejects.toThrow(/Ya existe un contrato nuevo/);
  });

  it("inicio a mitad de mes", async () => {
    const r = await generarBorradorResidencial(admin(), { unidadId: uMitad, fechaInicio: "2026-11-16", cuentaBancariaId: await cuenta(), confirmoFechaFin: "2027-11-15" });
    expect(r.contrato.fechaFin!.toISOString().slice(0, 10)).toBe("2027-11-15");
  });

  it("contrato anterior vencido: no se superpone y se advierte el período sin contrato", async () => {
    const v1 = await previsualizarBorrador(admin(), { unidadId: uVencido, fechaInicio: "2026-05-01", cuentaBancariaId: await cuenta() });
    expect(v1.bloqueos.join(" ")).toMatch(/superpone/);
    const v2 = await previsualizarBorrador(admin(), { unidadId: uVencido, fechaInicio: "2027-02-01", cuentaBancariaId: await cuenta() });
    expect(v2.bloqueos).toEqual([]);
    expect(v2.advertencias.join(" ")).toMatch(/VENCIDO/);
    expect(v2.fechaFin).toBe("2028-01-31");
  });

  it("inicio en febrero de año bisiesto", async () => {
    const v = await previsualizarBorrador(admin(), { unidadId: uVencido, fechaInicio: "2028-02-29", cuentaBancariaId: await cuenta() });
    expect(v.fechaFin).toBe("2029-02-28");
  });

  it("unidad sin documentación completa: se genera el borrador con datos PENDIENTES, nunca supuestos", async () => {
    const r = await generarBorradorResidencial(admin(), { unidadId: uSinDoc, fechaInicio: "2027-01-01", cuentaBancariaId: await cuenta(), confirmoFechaFin: "2027-12-31" });
    for (const f of ["documento de identidad de INQUILINO SIN DOCUMENTO", "domicilio de INQUILINO SIN DOCUMENTO", "día de vencimiento mensual", "depósito de garantía", "representante legal / apoderado con poder vigente"]) expect(r.faltantes.some((x) => x.includes(f))).toBe(true);
    const c = await prisma.contrato.findUniqueOrThrow({ where: { id: r.contrato.id } });
    expect(c.diaVencimiento).toBeNull();
    expect(c.deposito).toBeNull();
  });

  it("los locales comerciales (vacantes) quedan excluidos", async () => {
    const cands = await candidatosRenovacion(admin(), prop);
    const local = cands.find((x) => x.identificador === "Salon")!;
    expect(local.elegible).toBe(false);
    expect(local.motivos.join(" ")).toMatch(/locales comerciales/);
    const v = await previsualizarBorrador(admin(), { unidadId: uLocal, fechaInicio: "2026-12-01" });
    expect(v.bloqueos.join(" ")).toMatch(/no se aplican a locales comerciales/);
  });

  it("excepción al plazo solo con autorización expresa, auditada", async () => {
    const v = await previsualizarBorrador(admin(), { unidadId: uVencido, fechaInicio: "2027-02-01", cuentaBancariaId: await cuenta(), excepcionFin: { fechaFin: "2028-02-29", motivo: "Ajuste a fin de mes acordado", autorizadoPor: "Founder (prueba)" } });
    expect(v).toMatchObject({ excepcion: true, fechaFinCalculada: "2028-01-31", fechaFin: "2028-02-29" });
    const sinAut = await previsualizarBorrador(sesionDe(soc, "RESPONSABLE_PROPIEDAD"), { unidadId: uVencido, fechaInicio: "2027-02-01", cuentaBancariaId: await cuenta(), excepcionFin: { fechaFin: "2028-02-29", motivo: "Ajuste a fin de mes", autorizadoPor: "Alguien" } });
    expect(sinAut.bloqueos.join(" ")).toMatch(/autorización/);
  });
});

describe("procedimiento: nada es firmado ni vigente sin completar los pasos", () => {
  it("no pasa a firma/vigente sin inicio confirmado, depósito, revisión jurídica, cuenta y contrato firmado", async () => {
    const c = await prisma.contrato.findFirstOrThrow({ where: { contratoAnteriorId: contratos["ED1-2-A"] } });
    await expect(cambiarEstadoContrato(admin(), c.id, "VIGENTE", { motivo: "x" })).rejects.toThrow(/Procedimiento incompleto/);
    await expect(registrarPasoValidacion(admin(), c.id, "FIRMADO", { motivo: "x", archivoFirmado: { nombre: "f.pdf", buffer: Buffer.from("%PDF") } })).rejects.toThrow(/Antes de incorporar/);
    await registrarPasoValidacion(admin(), c.id, "INICIO_CONFIRMADO", { motivo: "Confirmado con el inquilino" });
    await expect(registrarPasoValidacion(sesionDe(soc, "RESPONSABLE_PROPIEDAD"), c.id, "REVISION_JURIDICA", { motivo: "x" })).rejects.toThrow(/permiso/);
    await registrarPasoValidacion(admin(), c.id, "DEPOSITO_VERIFICADO", { motivo: "Recibo de depósito", deposito: "700000" });
    await registrarPasoValidacion(admin(), c.id, "REVISION_JURIDICA", { motivo: "Dictamen del abogado (prueba)" });
    await expect(cambiarEstadoContrato(admin(), c.id, "VIGENTE", { motivo: "x" })).rejects.toThrow(/contrato firmado/);
    await registrarPasoValidacion(admin(), c.id, "FIRMADO", { motivo: "Firmado", archivoFirmado: { nombre: "firmado.pdf", buffer: Buffer.from("%PDF-1.4") } });
    const vig = await cambiarEstadoContrato(admin(), c.id, "VIGENTE", { motivo: "Procedimiento completo" });
    expect(vig.estado).toBe("VIGENTE");
  });

  it("las alertas de vencimiento (90/60/30/día) no modifican el contrato", async () => {
    const c = await prisma.contrato.findFirstOrThrow({ where: { contratoAnteriorId: contratos["ED1-2-A"] } });
    const antes = await prisma.contrato.findUniqueOrThrow({ where: { id: c.id } });
    const a = await alertasVencimiento(admin(), new Date("2027-11-30"));
    expect(a.find((x) => x.contrato.id === c.id)?.alerta.umbral).toBe(0);
    const despues = await prisma.contrato.findUniqueOrThrow({ where: { id: c.id } });
    expect(despues.estado).toBe(antes.estado);
    expect(despues.updatedAt.getTime()).toBe(antes.updatedAt.getTime());
  });
});
