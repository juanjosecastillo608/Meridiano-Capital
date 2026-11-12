/**
 * Definiciones del founder 2026-11-12 (D-100): IVA incluido, expensas exentas, RUC→CI,
 * NIS propio / compartido, conciliación planilla ↔ ocupantes y expediente por inquilino.
 * Datos ficticios.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { limpiar, admin, prisma } from "./db";
import { crearSociedad, crearPropiedad } from "@/server/services/nucleo";
import { analizarArchivo, validarImportacion, confirmarImportacion } from "@/server/services/importacion";
import { recalcularIvaPendiente } from "@/server/services/fiscal";
import { validarCanon } from "@/server/services/renovacion";
import { expedientesPropiedad, actualizarDatosInquilino } from "@/server/services/expedientes";
import { alertas } from "@/server/services/control";
import { calcularDV } from "@/domain/ruc";
import { planillaMontevideoPrueba } from "../fixtures/planilla";
import type { MapeoHoja } from "@/import/procesar";

let soc: string, prop: string;
const ruc = (b: string) => `${b}-${calcularDV(b)}`;

beforeAll(async () => {
  await limpiar();
  soc = (await crearSociedad(admin(), { razonSocial: "SOCIEDAD CONCILIACION S.A." })).id;
  prop = (await crearPropiedad(admin(), { sociedadId: soc, codigo: "MVD", nombre: "Edificio MVD prueba" })).id;
  await prisma.propiedad.update({ where: { id: prop }, data: { expensaMensualUnidad: "70000", expensaFuente: "prueba", inventarioDeptosDeclarado: 4, inventarioLocalesDeclarado: 0 } });
});

describe("importación con estructura Montevideo", () => {
  let r: Awaited<ReturnType<typeof confirmarImportacion>>;
  it("hoja resumen como referencia, códigos normalizados, estados en texto, unidad fuera de inventario", async () => {
    const { batch } = await analizarArchivo(admin(), soc, "mvd.xlsx", await planillaMontevideoPrueba(calcularDV));
    const mapeo = batch.mapeo as unknown as MapeoHoja[];
    expect(mapeo.find((m) => m.hoja.includes("Detallada"))).toMatchObject({ incluir: true, referencia: true });
    const { informe } = await validarImportacion(admin(), batch.id, mapeo, { moneda: "PYG", tasaIvaControlPct: 5 }, prop);
    expect(informe.bloqueante).toBe(false);
    const cod = new Set([...informe.problemasGenerales, ...informe.registros.flatMap((x) => x.problemas)].map((p) => p.codigo));
    for (const c of ["HOJA_REFERENCIA", "OCUPANTE_ES_ESTADO", "RUC_SIN_DV", "RUC_EN_VARIAS_UNIDADES", "MEDIDOR_COMPARTIDO"]) expect(cod).toContain(c);
    expect(cod).not.toContain("PAGO_DUPLICADO_PROBABLE"); // la hoja resumen no duplica los pagos de marzo
    r = await confirmarImportacion(admin(), batch.id, { propiedad: { modo: "EXISTENTE", propiedadId: prop }, unidadesExcluidas: ["12"], confirmacionExplicita: true });
    const us = await prisma.unidad.findMany({ where: { propiedadId: prop } });
    expect(us.map((u) => u.identificador).sort()).toEqual(["1 A", "GAR A", "PB B", "PB C"]);
    expect(us.every((u) => u.tipo === "DEPARTAMENTO")).toBe(true);
    expect(us.find((u) => u.identificador === "PB B")!.nisAnde).toBe("7000001");
  });

  it("RUC de la última hoja → CI; RUC sin DV deja la CI; mismo RUC con otro nombre no se fusiona", async () => {
    const pers = await prisma.persona.findMany({ where: { importBatchId: { not: null } }, orderBy: { nombre: "asc" } });
    const por = Object.fromEntries(pers.map((p) => [p.nombre, p]));
    expect(por["INQUILINO MVD UNO"]).toMatchObject({ ruc: ruc("3400001"), documentoNumero: "3400001", documentoTipo: "CI" });
    expect(por["INQUILINO MVD DOS"]).toMatchObject({ ruc: null, documentoNumero: "3400002" }); // RUC incompleto: CI sí, RUC no
    expect(por["INQUILINO MVD TRES"].documentoNormalizado).toBeNull(); // mismo RUC que UNO con otro nombre
    expect(por["INQUILINO MVD TRES"].observaciones).toMatch(/ya pertenece a otra persona/);
  });

  it("ocupante actual vs. anterior; agua como servicio; la hoja de referencia no genera cobros", async () => {
    expect(r.contratosHistoricos).toBe(1); // GAR A: el inquilino dejó la unidad en abril
    const gar = await prisma.contrato.findFirstOrThrow({ where: { propiedadId: prop, unidades: { some: { unidad: { identificador: "GAR A" } } } } });
    expect(gar.estado).toBe("FINALIZADO");
    const pbb = await prisma.contrato.findFirstOrThrow({ where: { propiedadId: prop, unidades: { some: { unidad: { identificador: "PB B" } } } } });
    expect(pbb.estado).toBe("BORRADOR");
    expect(pbb.observaciones).toMatch(/vencimiento del contrato anterior 2023-12-31; contrato vigente declarado: No/);
    const obl = await prisma.obligacion.findMany({ where: { contratoId: pbb.id }, orderBy: [{ periodo: "asc" }, { concepto: "asc" }] });
    expect(obl.map((o) => [o.periodo, o.concepto, o.importeTotal.toString()])).toEqual([["2026-03", "ALQUILER", "630000"], ["2026-03", "SERVICIOS", "35000"], ["2026-04", "ALQUILER", "630000"], ["2026-04", "SERVICIOS", "35000"]]);
  });
});

describe("IVA incluido y expensas exentas", () => {
  it("desglosa el IVA del alquiler sin cambiar el total ni el saldo", async () => {
    const res = await recalcularIvaPendiente(admin(), soc, "Founder 2026-11-12 (prueba)");
    expect(res.actualizadas).toBeGreaterThan(0);
    const o = await prisma.obligacion.findFirstOrThrow({ where: { concepto: "ALQUILER", importeTotal: "630000", periodo: "2026-03" } });
    expect([o.importeTotal.toString(), o.importeNeto.toString(), o.iva.toString(), o.ivaPendiente]).toEqual(["630000", "600000", "30000", false]);
    expect(o.saldo.toString()).toBe("0"); // pagado en la planilla: el saldo no cambia
    const servicios = await prisma.obligacion.findFirstOrThrow({ where: { concepto: "SERVICIOS" } });
    expect(servicios.ivaPendiente).toBe(true); // agua: sin regla validada → no se inventa
  });

  it("el canon validado es el importe con IVA incluido de la planilla", async () => {
    const pbb = await prisma.contrato.findFirstOrThrow({ where: { propiedadId: prop, estado: "BORRADOR", unidades: { some: { unidad: { identificador: "PB B" } } } } });
    await validarCanon(admin(), pbb.id, { montoConfirmado: "630000", motivo: "Monto Alquiler Actual (prueba)" });
    expect((await prisma.condicionContrato.findFirstOrThrow({ where: { contratoId: pbb.id } })).validado).toBe(true);
  });
});

describe("expediente por inquilino", () => {
  it("muestra lo que falta y las alertas (NIS compartido, expensas, agua, RUC)", async () => {
    await prisma.unidad.updateMany({ where: { propiedadId: prop, identificador: "1 A" }, data: { nisAnde: "7000002" } });
    const ex = await expedientesPropiedad(admin(), prop);
    const pbc = ex.find((e) => e.unidad === "PB C")!;
    const it = (e: typeof pbc, k: string) => e.items.find((i) => i.clave.startsWith(k))!;
    expect(it(pbc, "nis")).toMatchObject({ estado: "ALERTA" });
    expect(it(pbc, "nis").detalle).toMatch(/COMPARTIDO con la\(s\) unidad\(es\) 1 A/);
    expect(it(pbc, "ruc").estado).toBe("ALERTA"); // RUC sin DV
    expect(it(pbc, "expensas").estado).toBe("ALERTA"); // definida 70.000, la planilla no cobra expensas
    expect(it(pbc, "agua").estado).toBe("ALERTA");
    expect(it(pbc, "inicio").estado).toBe("FALTA");
    const pbb = ex.find((e) => e.unidad === "PB B")!;
    expect(it(pbb, "nis").estado).toBe("OK");
    expect(it(pbb, "nis").detalle).toMatch(/Energía a cargo del inquilino, no incluida en el alquiler/);
    expect(it(pbb, "canon").estado).toBe("OK");
    expect(it(pbb, "canon").detalle).toMatch(/IVA incluido 5 %: neto G\. 600\.000 \+ IVA G\. 30\.000/);
    expect(pbb.resumen.listoParaBorrador).toBe(false); // sin configuración contractual en esta sociedad
    expect(pbb.resumen.listoParaContratoReal).toBe(false);
    expect(ex.find((e) => e.unidad === "GAR A")!.situacion).toBe("VACANTE");
    const al = await alertas(admin(), soc);
    expect(al.some((a) => a.categoria === "Energía (NIS compartido)" && /PB C y 1 A|1 A y PB C/.test(a.mensaje))).toBe(true);
  });

  it("completar RUC deriva la CI; rechaza DV inválido y documentos de otra persona", async () => {
    const dos = await prisma.persona.findFirstOrThrow({ where: { nombre: "INQUILINO MVD DOS" } });
    await expect(actualizarDatosInquilino(admin(), dos.id, { ruc: `3400002-${(calcularDV("3400002") + 1) % 10}`, motivo: "x" })).rejects.toThrow(/dígito verificador/);
    await expect(actualizarDatosInquilino(admin(), dos.id, { ruc: ruc("3400001"), motivo: "x" })).rejects.toThrow(/otra persona/);
    await actualizarDatosInquilino(admin(), dos.id, { ruc: ruc("3400002"), domicilio: "Domicilio de prueba", motivo: "Constancia de RUC (prueba)" });
    const act = await prisma.persona.findUniqueOrThrow({ where: { id: dos.id } });
    expect(act).toMatchObject({ ruc: ruc("3400002"), documentoNumero: "3400002", documentoTipo: "CI", domicilio: "Domicilio de prueba" });
  });
});
