/**
 * Anexo de implementación (multiempresa, expediente, remodelaciones por etapas,
 * reglas de importación). Datos ficticios — DATOS DE PRUEBA.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { limpiar, admin, sesionDe, prisma } from "./db";
import { crearSociedad, crearPropiedad, crearUnidad, crearPersona, obtenerPropiedad, listarPropiedades } from "@/server/services/nucleo";
import { registrarPago, estadoDeCuenta } from "@/server/services/finanzas";
import { subirDocumento, listarDocumentos, obtenerArchivo, registrarRepresentante, listarRepresentantes, vencimientosDocumentales } from "@/server/services/documentos";
import { crearProyecto, importarChecklist, importarPresupuesto, aprobarPresupuesto, crearOrdenTrabajo, registrarGastoEjecutado, marcarGastoPagado, finalizarProyecto, obtenerProyecto, agregarPartida } from "@/server/services/remodelaciones";
import { declararInventario, declararOcupacion, alertas, saldosPropiedad, crearUsuario } from "@/server/services/control";
import { analizarArchivo, validarImportacion, confirmarImportacion } from "@/server/services/importacion";
import { checklistPrueba, presupuestoPrueba, planillaPrueba } from "../fixtures/planilla";
import type { MapeoHoja } from "@/import/procesar";

let socA: string, socB: string, propA: string, propB: string;
const pdf = Buffer.from("%PDF-1.4\n% documento de prueba\n");

beforeAll(async () => {
  await limpiar();
  socA = (await crearSociedad(admin(), { razonSocial: "SOCIEDAD ANEXO A S.A." })).id;
  socB = (await crearSociedad(admin(), { razonSocial: "SOCIEDAD ANEXO B S.A." })).id;
  propA = (await crearPropiedad(admin(), { sociedadId: socA, codigo: "EDA", nombre: "Edificio A" })).id;
  propB = (await crearPropiedad(admin(), { sociedadId: socB, codigo: "EDB", nombre: "Edificio B" })).id;
  for (const id of ["4", "13", "14"]) await crearUnidad(admin(), { propiedadId: propA, identificador: id, tipo: "DEPARTAMENTO" });
  await crearUnidad(admin(), { propiedadId: propA, identificador: "Salon", tipo: "LOCAL_COMERCIAL" });
});

describe("acceso multiempresa", () => {
  it("el propietario de A consulta solo lo suyo y no puede escribir; manipular el id de B no revela nada", async () => {
    const owner = sesionDe(socA, "PROPIETARIO_CONSULTA");
    expect((await listarPropiedades(owner)).map((p) => p.id)).toEqual([propA]);
    await expect(obtenerPropiedad(owner, propB)).rejects.toThrow(/permiso/);
    await expect(listarPropiedades(owner, socB)).rejects.toThrow(/permiso/);
    await expect(crearUnidad(owner, { propiedadId: propA, identificador: "X", tipo: "OTRO" })).rejects.toThrow(/permiso/);
    await expect(saldosPropiedad(owner, propB)).rejects.toThrow(/permiso/);
    await expect(alertas(owner, socB)).rejects.toThrow(/permiso/);
  });

  it("solo el superadmin crea usuarios; roles no globales exigen sociedad", async () => {
    await expect(crearUsuario(sesionDe(socA), { email: "x@test.local", nombre: "Usuario X", password: "una-clave-larga-123", rol: "PROPIETARIO_CONSULTA", sociedadId: socA })).rejects.toThrow(/permiso/);
    await expect(crearUsuario(admin(), { email: "x@test.local", nombre: "Usuario X", password: "una-clave-larga-123", rol: "PROPIETARIO_CONSULTA" })).rejects.toThrow(/sociedad/);
    const u = await crearUsuario(admin(), { email: "propietario-a@test.local", nombre: "Propietario A", password: "una-clave-larga-123", rol: "PROPIETARIO_CONSULTA", sociedadId: socA });
    const asig = await prisma.asignacionRol.findMany({ where: { usuarioId: u.id } });
    expect(asig).toEqual([expect.objectContaining({ rol: "PROPIETARIO_CONSULTA", sociedadId: socA })]);
  });
});

describe("expediente documental", () => {
  it("poderes son sensibles por defecto; el propietario sin permiso no los ve ni los descarga; otra sociedad tampoco", async () => {
    const { documento: ruc } = await subirDocumento(admin(), { sociedadId: socA, tipo: "RUC", titulo: "Cédula tributaria (prueba)" }, "ruc.pdf", pdf);
    const { documento: poder } = await subirDocumento(admin(), { sociedadId: socA, tipo: "PODER", titulo: "Poder (prueba)", fechaVencimiento: "2026-01-31" }, "poder.pdf", pdf);
    expect(poder.sensible).toBe(true);
    expect(ruc.sensible).toBe(false);
    const owner = sesionDe(socA, "PROPIETARIO_CONSULTA");
    const l = await listarDocumentos(owner, { sociedadId: socA });
    expect(l.documentos.map((d) => d.id)).toEqual([ruc.id]);
    expect(l.ocultos).toBe(1);
    await expect(obtenerArchivo(owner, poder.id)).rejects.toThrow(/sin acceso/);
    expect((await obtenerArchivo(owner, ruc.id)).contenido.equals(pdf)).toBe(true);
    await expect(obtenerArchivo(sesionDe(socB), ruc.id)).rejects.toThrow(/sin acceso/);
    await expect(obtenerArchivo(sesionDe(socB), "id-inexistente")).rejects.toThrow(/sin acceso/); // mismo mensaje: no revela existencia
    await expect(subirDocumento(admin(), { sociedadId: socA, tipo: "OTRO", titulo: "Ejecutable" }, "x.exe", pdf)).rejects.toThrow(/no admitido/);
    // alertas de vencimiento documental
    const v = await vencimientosDocumentales(admin(), 60, new Date("2026-01-15"));
    expect(v.find((x) => x.tipo === "PODER")?.dias).toBe(16);
    expect(await vencimientosDocumentales(owner, 60, new Date("2026-01-15"))).toHaveLength(0);
  });

  it("representantes solo con permiso de documentos sensibles", async () => {
    const poder = await prisma.documento.findFirstOrThrow({ where: { tipo: "PODER", sociedadId: socA } });
    await registrarRepresentante(admin(), { sociedadId: socA, nombre: "REPRESENTANTE DE PRUEBA", cargo: "APODERADO", documentoId: poder.id, vigenteHasta: "2027-12-31" });
    expect(await listarRepresentantes(sesionDe(socA, "PROPIETARIO_CONSULTA"), socA)).toBeNull();
    expect((await listarRepresentantes(sesionDe(socA), socA))!.map((r) => r.estadoDato)).toEqual(["VALIDADO"]);
    await expect(registrarRepresentante(admin(), { sociedadId: socB, nombre: "Persona X", cargo: "APODERADO", documentoId: poder.id })).rejects.toThrow(/no pertenece/);
  });
});

describe("remodelaciones por etapas", () => {
  let proyecto: string;
  it("importa checklist y presupuesto vinculando sectores sin asumir los ambiguos", async () => {
    proyecto = (await crearProyecto(admin(), { propiedadId: propA, codigo: "EDA-REM-01", objetivo: "Reforma de prueba" })).id;
    const ck = await importarChecklist(admin(), proyecto, "checklist.xlsx", await checklistPrueba());
    const sec = Object.fromEntries(ck.sectores.map((x) => [x.sector, x.unidades]));
    expect(sec["4"]).toEqual(["4"]);
    expect(sec["13-14"].sort()).toEqual(["13", "14"]);
    expect(sec["Local 1"]).toEqual([]); // no se asume que "Local 1" sea el "Salon"
    expect(sec["Terraza"]).toEqual([]);
    const pr = await importarPresupuesto(admin(), proyecto, "presupuesto.xlsx", await presupuestoPrueba());
    expect(pr.partidas).toBe(5);
    const { proyecto: p, etapas } = await obtenerProyecto(admin(), proyecto);
    expect(p.estado).toBe("EN_PRESUPUESTO");
    expect(etapas.aprobado.total).toBeNull(); // un presupuesto importado NO es una aprobación
    expect(etapas.cotizacion.total.toString()).toBe("900000");
    expect(etapas.ejecutado.toString()).toBe("0");
  });

  it("sin aprobación no hay orden de trabajo ni gasto; la aprobación exige permiso, motivo y partidas válidas", async () => {
    await expect(crearOrdenTrabajo(admin(), proyecto, { descripcion: "x", categoria: "VARIOS" })).rejects.toThrow(/APROBADO/);
    await expect(registrarGastoEjecutado(admin(), proyecto, { descripcion: "x", importe: "1", fecha: "2026-11-01" })).rejects.toThrow(/aprobados/);
    const cot = await prisma.partidaRemodelacion.findFirstOrThrow({ where: { proyectoId: proyecto, etapa: "COTIZACION_PROVEEDOR" } });
    const dudosa = await prisma.partidaRemodelacion.findFirstOrThrow({ where: { proyectoId: proyecto, calidadDato: "REVISION_TECNICA_REQUERIDA" } });
    await expect(aprobarPresupuesto(sesionDe(socA, "MANTENIMIENTO"), proyecto, [cot.id], "ok")).rejects.toThrow(/permiso/);
    await expect(aprobarPresupuesto(admin(), proyecto, [cot.id], "")).rejects.toThrow(/motivo/);
    await expect(aprobarPresupuesto(admin(), proyecto, [cot.id, dudosa.id], "ok")).rejects.toThrow(/no son aprobables/);
    await expect(aprobarPresupuesto(sesionDe(socB), proyecto, [cot.id], "ok")).rejects.toThrow(/permiso/);
    await agregarPartida(admin(), proyecto, { etapa: "COTIZACION_PROVEEDOR", tipo: "MATERIAL", descripcion: "Materiales cotizados (prueba)", cantidad: "1", precioUnitario: "300000", proveedor: "PROVEEDOR DE PRUEBA", fuente: "Cotización de prueba" });
    const mat = await prisma.partidaRemodelacion.findFirstOrThrow({ where: { proyectoId: proyecto, descripcion: "Materiales cotizados (prueba)" } });
    const ap = await aprobarPresupuesto(admin(), proyecto, [cot.id, mat.id], "Aprobado por el propietario (prueba)");
    expect(ap.presupuestoAprobado!.toString()).toBe("1200000");
  });

  it("orden → gasto ejecutado → comprobante de pago → costo final, cada uno separado", async () => {
    const o = await crearOrdenTrabajo(admin(), proyecto, { descripcion: "Pintura unidades", categoria: "PINTURA", proveedor: "PROVEEDOR DE PRUEBA" });
    const g = await registrarGastoEjecutado(admin(), proyecto, { ordenTrabajoId: o.id, descripcion: "Factura de pintura", importe: "1300000", fecha: "2026-11-05", comprobante: "001-001-0000001" }, { nombre: "factura.pdf", buffer: pdf });
    let r = await obtenerProyecto(admin(), proyecto);
    expect(r.etapas.ejecutado.toString()).toBe("1300000");
    expect(r.etapas.pagado.toString()).toBe("0"); // ejecutado ≠ pagado
    expect(r.etapas.costoFinal).toBeNull();
    expect(r.etapas.desviacion!.pct!.toString()).toBe("8.33");
    await marcarGastoPagado(admin(), g.id, "2026-11-06", { nombre: "transferencia.pdf", buffer: pdf });
    await finalizarProyecto(admin(), proyecto, "Recepción conforme (prueba)");
    r = await obtenerProyecto(admin(), proyecto);
    expect(r.etapas.pagado.toString()).toBe("1300000");
    expect(r.etapas.costoFinal!.toString()).toBe("1300000");
    const egr = await prisma.egreso.findUniqueOrThrow({ where: { id: g.id } });
    expect(egr.naturaleza).toBe("CAPEX");
  });
});

describe("reglas de importación e inventario", () => {
  it("unidades fuera de inventario no se crean; pagos importados quedan SIN_RESPALDO; manuales con comprobante quedan COMPROBANTE", async () => {
    const { batch } = await analizarArchivo(admin(), socA, "planilla.xlsx", await planillaPrueba());
    await validarImportacion(admin(), batch.id, batch.mapeo as unknown as MapeoHoja[], { moneda: "PYG" });
    const r = await confirmarImportacion(admin(), batch.id, { propiedad: { modo: "NUEVA", codigo: "IMP-A", nombre: "Importado A" }, unidadesExcluidas: ["4"], confirmacionExplicita: true });
    const ids = (await prisma.unidad.findMany({ where: { propiedadId: r.propiedadId } })).map((u) => u.identificador).sort();
    expect(ids).toEqual(["2", "3", "Salon"]);
    expect(await prisma.importRow.count({ where: { batchId: batch.id, estado: "OMITIDA" } })).toBe(3);
    const pagos = await prisma.pago.findMany({ where: { propiedadId: r.propiedadId } });
    expect(pagos.length).toBeGreaterThan(0);
    expect(pagos.every((p) => p.respaldo === "SIN_RESPALDO")).toBe(true);
    const inq = await crearPersona(admin(), socA, { tipo: "FISICA", nombre: "INQUILINO MANUAL", documentoTipo: "CI", documentoNumero: "8888881" });
    const pm = await registrarPago(admin(), { sociedadId: socA, personaId: inq.id, fechaPago: "2026-11-01", metodo: "TRANSFERENCIA", comprobante: "TRX-ANEXO", moneda: "PYG", importe: "100" });
    expect(pm.pago.respaldo).toBe("COMPROBANTE");
    const ec = await estadoDeCuenta(admin(), { personaId: inq.id });
    expect(ec.porMoneda.PYG.saldoAFavor.toString()).toBe("100");
  });

  it("inventario declarado y ocupación declarada generan alertas de contradicción", async () => {
    await declararInventario(admin(), propA, { deptos: 13, locales: 1, fuente: "Founder (prueba)" });
    const salon = await prisma.unidad.findFirstOrThrow({ where: { propiedadId: propA, identificador: "Salon" } });
    await declararOcupacion(admin(), salon.id, "VACANTE", "Founder (prueba)");
    const imp = await prisma.propiedad.findFirstOrThrow({ where: { codigo: "IMP-A" } });
    await declararInventario(admin(), imp.id, { deptos: 2, locales: 1, fuente: "Founder (prueba)" });
    const salonImp = await prisma.unidad.findFirstOrThrow({ where: { propiedadId: imp.id, identificador: "Salon" } });
    await declararOcupacion(admin(), salonImp.id, "VACANTE", "Founder (prueba)");
    const as = await alertas(admin(), socA);
    expect(as.some((a) => a.categoria === "Inventario" && a.mensaje.startsWith("EDA: declarado 13 deptos"))).toBe(true);
    expect(as.some((a) => a.mensaje.startsWith("IMP-A: declarado"))).toBe(false); // 2 + 1 coincide
    expect(as.some((a) => a.categoria === "Pagos sin respaldo")).toBe(true);
    expect(as.some((a) => a.categoria === "Contrato pendiente de validación")).toBe(true);
    await expect(declararInventario(sesionDe(socB), propA, { deptos: 1, locales: 0, fuente: "x" })).rejects.toThrow(/permiso/);
  });
});
