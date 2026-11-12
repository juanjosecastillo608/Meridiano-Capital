/**
 * Criterios de aceptación §22 sobre una base real de prueba.
 * Todos los datos son ficticios (DATOS DE PRUEBA).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { limpiar, admin, sesionDe, prisma } from "./db";
import { crearSociedad, crearPropiedad, crearUnidad, crearPersona, crearCuentaBancaria, listarPropiedades, obtenerPropiedad, listarPersonas } from "@/server/services/nucleo";
import { crearContrato, cambiarEstadoContrato, modificarAlquiler } from "@/server/services/contratos";
import { generarObligacionesMensuales, registrarPago, revertirPago, estadoDeCuenta, imputarSaldoAFavor } from "@/server/services/finanzas";
import { analizarArchivo, validarImportacion, confirmarImportacion } from "@/server/services/importacion";
import { panel, buscar } from "@/server/services/consultas";
import { planillaPrueba } from "../fixtures/planilla";
import type { MapeoHoja } from "@/import/procesar";

let socA: string, socB: string, propA: string, propB: string, u1: string, u2: string, inq: string, cuenta: string, contrato: string;

beforeAll(async () => {
  await limpiar();
  const a = await crearSociedad(admin(), { razonSocial: "SOCIEDAD PRUEBA A S.A.", monedaOperacion: "PYG" });
  const b = await crearSociedad(admin(), { razonSocial: "SOCIEDAD PRUEBA B S.A." });
  socA = a.id; socB = b.id;
  cuenta = (await crearCuentaBancaria(admin(), { sociedadId: socA, banco: "BANCO PRUEBA", numero: "0000-1", moneda: "PYG" })).id;
  propA = (await crearPropiedad(admin(), { sociedadId: socA, codigo: "PA-1", nombre: "Edificio Prueba A", cuentaBancariaId: cuenta })).id;
  propB = (await crearPropiedad(admin(), { sociedadId: socB, codigo: "PB-1", nombre: "Edificio Prueba B" })).id;
  u1 = (await crearUnidad(admin(), { propiedadId: propA, identificador: "1A", tipo: "DEPARTAMENTO", superficieM2: "45.5" })).id;
  u2 = (await crearUnidad(admin(), { propiedadId: propA, identificador: "PB", tipo: "LOCAL_COMERCIAL" })).id;
  inq = (await crearPersona(admin(), socA, { tipo: "FISICA", nombre: "INQUILINO PRUEBA", documentoTipo: "CI", documentoNumero: "9.999.991" })).id;
});

describe("núcleo inmobiliario", () => {
  it("evita personas duplicadas por documento", async () => {
    await expect(crearPersona(admin(), socA, { tipo: "FISICA", nombre: "Otro nombre", documentoTipo: "CI", documentoNumero: "9999991" })).rejects.toThrow(/Ya existe/);
  });

  it("registra contrato vigente y rechaza contratos superpuestos en la misma unidad", async () => {
    const c = await crearContrato(admin(), { codigo: "PA-1-C001", propiedadId: propA, unidadIds: [u1], inquilinoIds: [inq], categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", fechaInicio: "2026-01-01", fechaFin: "2026-12-31", diaVencimiento: 10, montoAlquiler: "3000000", responsabilidadExpensas: "INQUILINO", estado: "VIGENTE" });
    contrato = c.id;
    await expect(crearContrato(admin(), { codigo: "PA-1-C002", propiedadId: propA, unidadIds: [u1], inquilinoIds: [inq], categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", fechaInicio: "2026-06-01", fechaFin: "2027-05-31", diaVencimiento: 10, montoAlquiler: "3000000", estado: "VIGENTE" })).rejects.toThrow(/superpone/);
    // Un borrador sin fechas sí se permite
    await expect(crearContrato(admin(), { codigo: "PA-1-C003", propiedadId: propA, unidadIds: [u1], inquilinoIds: [inq], categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", montoAlquiler: "1", estado: "BORRADOR" })).resolves.toBeTruthy();
  });

  it("no permite activar un contrato sin fechas ni día de vencimiento", async () => {
    const borr = await prisma.contrato.findUniqueOrThrow({ where: { codigo: "PA-1-C003" } });
    await expect(cambiarEstadoContrato(admin(), borr.id, "VIGENTE", { motivo: "prueba" })).rejects.toThrow(/Faltan fechas/);
  });
});

describe("obligaciones, cobranzas y saldos", () => {
  it("genera obligaciones mensuales sin duplicados aunque se ejecute dos veces", async () => {
    const r1 = await generarObligacionesMensuales(admin(), socA, "2026-03");
    const r2 = await generarObligacionesMensuales(admin(), socA, "2026-03");
    expect(r1.creadas).toBe(1);
    expect(r2.creadas).toBe(0);
    expect(r2.yaExistentes).toBe(1);
    const o = await prisma.obligacion.findFirstOrThrow({ where: { contratoId: contrato, periodo: "2026-03" } });
    // Founder 2026-11-12 (D-100): alquiler con IVA INCLUIDO → total = canon; neto = 3.000.000 / 1,05
    expect(o.importeTotal.toString()).toBe("3000000");
    expect(o.importeNeto.toString()).toBe("2857143");
    expect(o.iva.toString()).toBe("142857");
    expect(o.fechaVencimiento.toISOString().slice(0, 10)).toBe("2026-03-10");
  });

  it("pago parcial: G. 2.000.000 contra alquiler G. 3.000.000 + expensas G. 500.000 deja deuda G. 1.500.000", async () => {
    // Para reproducir exactamente el ejemplo del requerimiento se usa una obligación de alquiler sin IVA y una de expensas.
    const base = { sociedadId: socA, propiedadId: propA, unidadId: u1, contratoId: contrato, personaId: inq, periodo: "2026-04", fechaVencimiento: new Date("2026-04-10"), moneda: "PYG" as const, iva: "0", origenDato: "MANUAL" as const };
    await prisma.obligacion.create({ data: { ...base, concepto: "ALQUILER", importeNeto: "3000000", importeTotal: "3000000", saldo: "3000000", claveIdempotencia: "test:alq:04" } });
    await prisma.obligacion.create({ data: { ...base, concepto: "EXPENSAS", importeNeto: "500000", importeTotal: "500000", saldo: "500000", claveIdempotencia: "test:exp:04" } });
    const alq = await prisma.obligacion.findUniqueOrThrow({ where: { claveIdempotencia: "test:alq:04" } });
    await registrarPago(admin(), { sociedadId: socA, personaId: inq, cuentaBancariaId: cuenta, fechaPago: "2026-04-09", metodo: "TRANSFERENCIA", comprobante: "TRX-1", moneda: "PYG", importe: "2000000", aplicaciones: [{ obligacionId: alq.id, importe: "2000000" }] });
    const ec = await estadoDeCuenta(admin(), { personaId: inq });
    const abril = ec.obligaciones.filter((o) => o.periodo === "2026-04");
    expect(abril.find((o) => o.concepto === "ALQUILER")!.saldo.toString()).toBe("1000000");
    expect(abril.find((o) => o.concepto === "ALQUILER")!.estado).toBe("PARCIAL");
    expect(abril.find((o) => o.concepto === "EXPENSAS")!.saldo.toString()).toBe("500000");
    const deudaAbril = abril.reduce((s, o) => s + Number(o.saldo.toString()), 0);
    expect(deudaAbril).toBe(1500000);
  });

  it("evita registrar dos veces la misma transferencia", async () => {
    await expect(registrarPago(admin(), { sociedadId: socA, personaId: inq, cuentaBancariaId: cuenta, fechaPago: "2026-04-09", metodo: "TRANSFERENCIA", comprobante: "TRX-1", moneda: "PYG", importe: "2000000" })).rejects.toThrow(/No se registra dos veces/);
  });

  it("anticipo/exceso queda como saldo a favor y se imputa después", async () => {
    const r = await registrarPago(admin(), { sociedadId: socA, personaId: inq, cuentaBancariaId: cuenta, fechaPago: "2026-04-20", metodo: "TRANSFERENCIA", comprobante: "TRX-2", moneda: "PYG", importe: "5000000" });
    // Debía: marzo 3.000.000 (IVA incluido) + abril 1.000.000 + 500.000 = 4.500.000 → saldo a favor 500.000
    expect(r.saldoAFavor.toString()).toBe("500000");
    const marzo = await prisma.obligacion.findFirstOrThrow({ where: { contratoId: contrato, periodo: "2026-03" } });
    expect(marzo.estado).toBe("PAGADA");
    await generarObligacionesMensuales(admin(), socA, "2026-05");
    const imp = await imputarSaldoAFavor(admin(), r.pago.id);
    expect(imp.aplicaciones[0].importe.toString()).toBe("500000");
    const mayo = await prisma.obligacion.findFirstOrThrow({ where: { contratoId: contrato, periodo: "2026-05" } });
    expect(mayo.saldo.toString()).toBe("2500000"); // 3.000.000 − 500.000
    expect(mayo.estado).toBe("PARCIAL");
  });

  it("revertir un pago restaura saldos y queda auditado", async () => {
    const p = await prisma.pago.findFirstOrThrow({ where: { comprobante: "TRX-2" } });
    await expect(revertirPago(admin(), p.id, "")).rejects.toThrow(/motivo/);
    await revertirPago(admin(), p.id, "Transferencia rechazada por el banco (prueba)");
    const marzo = await prisma.obligacion.findFirstOrThrow({ where: { contratoId: contrato, periodo: "2026-03" } });
    expect(marzo.saldo.toString()).toBe("3000000");
    expect(marzo.estado).toBe("PENDIENTE");
    const audit = await prisma.auditLog.findFirst({ where: { accion: "PAGO_REVERTIR", entidadId: p.id } });
    expect(audit?.motivo).toMatch(/rechazada/);
  });

  it("adenda de importe agrega historial sin borrar el anterior", async () => {
    await modificarAlquiler(admin(), contrato, { vigenteDesde: "2026-07-01", montoAlquiler: "3300000", motivo: "ADENDA", referencia: "Adenda 1 (prueba)" });
    await generarObligacionesMensuales(admin(), socA, "2026-07");
    const julio = await prisma.obligacion.findFirstOrThrow({ where: { contratoId: contrato, periodo: "2026-07" } });
    expect(julio.importeTotal.toString()).toBe("3300000");
    expect(julio.importeNeto.toString()).toBe("3142857");
    expect(await prisma.condicionContrato.count({ where: { contratoId: contrato } })).toBe(2);
  });
});

describe("aislamiento por sociedad", () => {
  it("un usuario de la sociedad B no ve ni opera datos de A", async () => {
    const sB = sesionDe(socB);
    const props = await listarPropiedades(sB);
    expect(props.map((p) => p.id)).toEqual([propB]);
    await expect(obtenerPropiedad(sB, propA)).rejects.toThrow(/permiso/);
    await expect(registrarPago(sB, { sociedadId: socA, personaId: inq, fechaPago: "2026-04-01", metodo: "EFECTIVO", moneda: "PYG", importe: "1" })).rejects.toThrow(/permiso/);
    await expect(generarObligacionesMensuales(sB, socA, "2026-08")).rejects.toThrow(/permiso/);
    expect((await listarPersonas(sB)).length).toBe(0);
    const ec = await estadoDeCuenta(sB, { personaId: inq });
    expect(ec.obligaciones).toHaveLength(0);
    const res = await buscar(sB, "Prueba A");
    expect(res.propiedades).toHaveLength(0);
    const pnl = await panel(sB, { periodo: "2026-03" });
    expect(pnl.totales.propiedades).toBe(1);
  });

  it("un rol de solo lectura no puede registrar pagos", async () => {
    await expect(registrarPago(sesionDe(socA, "PROPIETARIO_CONSULTA"), { sociedadId: socA, personaId: inq, fechaPago: "2026-04-01", metodo: "EFECTIVO", moneda: "PYG", importe: "1" })).rejects.toThrow(/permiso/);
  });
});

describe("importación de Excel", () => {
  it("analiza, valida, exige confirmación explícita, importa sin sobrescribir y es idempotente", async () => {
    const buf = await planillaPrueba();
    const { batch } = await analizarArchivo(admin(), socA, "planilla-prueba.xlsx", buf);
    const mapeo = batch.mapeo as unknown as MapeoHoja[];

    // Sin moneda: bloquea
    const sinMoneda = await validarImportacion(admin(), batch.id, mapeo, { moneda: null });
    expect(sinMoneda.informe.bloqueante).toBe(true);
    await expect(confirmarImportacion(admin(), batch.id, { propiedad: { modo: "NUEVA", codigo: "IMP-1", nombre: "Edificio importado" }, confirmacionExplicita: true })).rejects.toThrow(/Valide/);

    const val = await validarImportacion(admin(), batch.id, mapeo, { moneda: "PYG", tasaIvaControlPct: 5 });
    expect(val.informe.bloqueante).toBe(false);
    await expect(confirmarImportacion(admin(), batch.id, { propiedad: { modo: "NUEVA", codigo: "IMP-1", nombre: "Edificio importado" } } as never)).rejects.toThrow();

    const res = await confirmarImportacion(admin(), batch.id, { propiedad: { modo: "NUEVA", codigo: "IMP-1", nombre: "Edificio importado" }, cuentaBancariaId: cuenta, confirmacionExplicita: true });
    expect(res.unidadesCreadas).toBe(4);
    expect(res.personasCreadas).toBe(2);
    expect(res.contratosBorrador).toBe(2);
    expect(res.pagosRegistrados).toBe(4); // 2 + 2 marzo/abril/mayo menos el pago 0 de abril y el duplicado de mayo
    const unidades = await prisma.unidad.findMany({ where: { propiedadId: res.propiedadId }, orderBy: { identificador: "asc" } });
    expect(unidades.every((u) => u.origenDato === "IMPORTADO" && u.estadoDato === "PENDIENTE_REVISION")).toBe(true);
    expect(unidades.find((u) => u.identificador === "Salon")!.tipo).toBe("LOCAL_COMERCIAL");
    const contratos = await prisma.contrato.findMany({ where: { propiedadId: res.propiedadId } });
    expect(contratos.every((c) => c.estado === "BORRADOR" && c.fechaInicio === null)).toBe(true); // no se inventan fechas

    // Abril unidad 3: OK sin pago → obligación pendiente (saldo = alquiler + expensas)
    const abr3 = await prisma.obligacion.findMany({ where: { propiedadId: res.propiedadId, periodo: "2026-04", unidad: { identificador: "3" } } });
    expect(abr3.reduce((s, o) => s + Number(o.saldo.toString()), 0)).toBe(1680000);

    // Segunda confirmación: rechazada
    await expect(confirmarImportacion(admin(), batch.id, { propiedad: { modo: "EXISTENTE", propiedadId: res.propiedadId }, confirmacionExplicita: true })).rejects.toThrow(/ya fue confirmada/);

    // Reimportar el mismo archivo sobre la misma propiedad: no duplica unidades ni pagos
    const { batch: b2, yaImportadoAntes } = await analizarArchivo(admin(), socA, "planilla-prueba.xlsx", buf);
    expect(yaImportadoAntes).toBe(batch.id);
    await validarImportacion(admin(), b2.id, b2.mapeo as unknown as MapeoHoja[], { moneda: "PYG" }, res.propiedadId);
    const res2 = await confirmarImportacion(admin(), b2.id, { propiedad: { modo: "EXISTENTE", propiedadId: res.propiedadId }, confirmacionExplicita: true });
    expect(res2.unidadesCreadas).toBe(0);
    expect(res2.unidadesExistentes).toBe(4);
    expect(res2.pagosRegistrados).toBe(0);
    expect(await prisma.pago.count({ where: { propiedadId: res.propiedadId } })).toBe(4);
  });

  it("otra sociedad no puede importar ni ver la importación", async () => {
    const buf = await planillaPrueba();
    await expect(analizarArchivo(sesionDe(socB), socA, "x.xlsx", buf)).rejects.toThrow(/permiso/);
  });
});
