import { describe, it, expect } from "vitest";
import { d, parsearImporte, formatear, redondear } from "@/domain/money";
import { fechaVencimiento, periodosEntre, sumarMeses, fecha, hoyAsuncion } from "@/domain/periodo";
import { detectarSuperposiciones, alertaVencimiento, montoVigente, calcularReajuste, plazoMeses, estadoPorFechas } from "@/domain/contratos";
import { calcularIva, resolverRegla, type ReglaFiscalDTO } from "@/domain/impuestos";
import { generarObligacionesAlquiler, estadoPorSaldo, calcularMora, type ContratoParaGenerar } from "@/domain/obligaciones";
import { aplicarPago, resumirDeuda, claveDuplicadoPago, type ObligacionAbierta } from "@/domain/pagos";
import { distribuir, esTrasladable } from "@/domain/expensas";
import { estaOcupada } from "@/domain/ocupacion";
import { resumirPresupuesto, impactoRemodelacion, desviacion } from "@/domain/remodelacion";
import { normalizarDocumento } from "@/domain/documentos";

const regla = (over: Partial<ReglaFiscalDTO> = {}): ReglaFiscalDTO => ({ id: "r1", codigo: "IVA_ALQUILER_RESIDENCIAL", categoria: "ALQUILER_RESIDENCIAL", tasaPct: "5", baseImponiblePct: "100", ivaIncluido: false, vigenteDesde: fecha(2000, 1, 1), vigenteHasta: null, version: 1, estadoValidacion: "CONFIRMADA_FOUNDER", ...over });

describe("money", () => {
  it("interpreta importes en formato paraguayo sin ambigüedad", () => {
    expect(parsearImporte("3.000.000")!.toString()).toBe("3000000");
    expect(parsearImporte("G. 2.000.000")!.toString()).toBe("2000000");
    expect(parsearImporte("1.500,50")!.toString()).toBe("1500.5");
    expect(parsearImporte("USD 1,200.00")!.toString()).toBe("1200");
    expect(parsearImporte(880000)!.toString()).toBe("880000");
    expect(parsearImporte("abc")).toBeNull();
  });
  it("redondea guaraníes a entero y formatea con separador de miles", () => {
    expect(redondear("33333.5", "PYG").toString()).toBe("33334");
    expect(formatear("1500000", "PYG")).toBe("G. 1.500.000");
    expect(formatear("1200.5", "USD")).toBe("USD 1.200,50");
  });
  it("no pierde precisión (0.1 + 0.2)", () => {
    expect(d("0.1").plus("0.2").toString()).toBe("0.3");
  });
});

describe("periodos", () => {
  it("acota el día de vencimiento al fin de mes", () => {
    expect(fechaVencimiento("2026-02", 31).toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(fechaVencimiento("2028-02", 30).toISOString().slice(0, 10)).toBe("2028-02-29");
  });
  it("recorre períodos cruzando años", () => {
    expect(periodosEntre("2026-11", "2027-02")).toEqual(["2026-11", "2026-12", "2027-01", "2027-02"]);
    expect(sumarMeses("2026-01", -1)).toBe("2025-12");
  });
  it("calcula hoy en America/Asuncion", () => {
    // 2026-11-12 02:00 UTC = 2026-11-11 23:00 en Asunción (UTC-3)
    expect(hoyAsuncion(new Date("2026-11-12T02:00:00Z")).toISOString().slice(0, 10)).toBe("2026-11-11");
  });
});

describe("contratos", () => {
  const base = { estado: "VIGENTE" as const, fechaInicio: fecha(2026, 1, 1), fechaFin: fecha(2026, 12, 31), unidadIds: ["u1"] };
  it("detecta superposición de contratos activos en la misma unidad", () => {
    expect(detectarSuperposiciones({ ...base, fechaInicio: fecha(2026, 12, 31), fechaFin: fecha(2027, 12, 31) }, [{ ...base, id: "c1", codigo: "C1" }])).toHaveLength(1);
    expect(detectarSuperposiciones({ ...base, fechaInicio: fecha(2027, 1, 1), fechaFin: fecha(2027, 12, 31) }, [{ ...base, id: "c1" }])).toHaveLength(0);
    expect(detectarSuperposiciones({ ...base }, [{ ...base, id: "c1", estado: "FINALIZADO" }])).toHaveLength(0);
    expect(detectarSuperposiciones({ ...base, unidadIds: ["u2"] }, [{ ...base, id: "c1" }])).toHaveLength(0);
  });
  it("una rescisión anticipada libera el rango", () => {
    expect(detectarSuperposiciones({ ...base, fechaInicio: fecha(2026, 7, 1) }, [{ ...base, id: "c1", fechaRescision: fecha(2026, 6, 30) }])).toHaveLength(0);
  });
  it("alertas configurables distintas del estado jurídico", () => {
    const hoy = fecha(2026, 10, 1);
    expect(alertaVencimiento(fecha(2026, 12, 20), hoy).umbral).toBe(90); // 80 días
    expect(alertaVencimiento(fecha(2026, 12, 31), hoy).umbral).toBeNull(); // 91 días
    expect(alertaVencimiento(fecha(2026, 10, 20), hoy).umbral).toBe(30);
    expect(alertaVencimiento(fecha(2027, 6, 1), hoy).umbral).toBeNull();
    expect(alertaVencimiento(fecha(2026, 12, 31), hoy, [120, 45]).umbral).toBe(120);
    expect(estadoPorFechas("VIGENTE", fecha(2026, 9, 30), hoy)).toBe("VENCIDO");
    expect(estadoPorFechas("RESCINDIDO", fecha(2026, 9, 30), hoy)).toBe("RESCINDIDO");
  });
  it("importe vigente según historial (adendas)", () => {
    const cs = [{ vigenteDesde: fecha(2026, 1, 1), montoAlquiler: "3000000" }, { vigenteDesde: fecha(2026, 7, 1), montoAlquiler: "3300000" }];
    expect(montoVigente(cs, "2026-06")!.toString()).toBe("3000000");
    expect(montoVigente(cs, "2026-07")!.toString()).toBe("3300000");
    expect(montoVigente([{ vigenteDesde: fecha(2026, 1, 15), montoAlquiler: "100" }], "2026-01")!.toString()).toBe("100");
  });
  it("reajuste solo con fórmula validada", () => {
    expect(calcularReajuste(d(1000000), { tipo: "PORCENTAJE_FIJO", porcentaje: "10", validado: false }).monto).toBeNull();
    expect(calcularReajuste(d(1000000), { tipo: "PORCENTAJE_FIJO", porcentaje: "10", validado: true }).monto!.toString()).toBe("1100000");
    expect(calcularReajuste(d(1000000), { tipo: "INDICE", validado: true }).monto).toBeNull();
  });
  it("plazo en meses", () => {
    expect(plazoMeses(fecha(2026, 1, 1), fecha(2026, 12, 31))).toBe(12);
    expect(plazoMeses(fecha(2026, 3, 15), fecha(2028, 3, 14))).toBe(24);
  });
});

describe("motor de impuestos", () => {
  it("IVA adicional e incluido", () => {
    expect(calcularIva("3000000", regla(), "PYG").iva.toString()).toBe("150000");
    const inc = calcularIva("1050000", regla({ ivaIncluido: true }), "PYG");
    expect(inc.neto.toString()).toBe("1000000");
    expect(inc.iva.toString()).toBe("50000");
  });
  it("regla PENDIENTE o ausente no calcula y marca ivaPendiente", () => {
    expect(calcularIva("500000", regla({ estadoValidacion: "PENDIENTE" }), "PYG").pendiente).toBe(true);
    expect(calcularIva("500000", null, "PYG").pendiente).toBe(true);
  });
  it("resuelve la última versión vigente a la fecha", () => {
    const rs = [regla(), regla({ id: "r2", version: 2, tasaPct: "10", vigenteDesde: fecha(2027, 1, 1) })];
    expect(resolverRegla(rs, "ALQUILER_RESIDENCIAL", fecha(2026, 6, 1))!.id).toBe("r1");
    expect(resolverRegla(rs, "ALQUILER_RESIDENCIAL", fecha(2027, 6, 1))!.id).toBe("r2");
    expect(resolverRegla(rs, "EXPENSAS", fecha(2027, 6, 1))).toBeNull();
  });
});

describe("generación de obligaciones", () => {
  const c: ContratoParaGenerar = { id: "c1", codigo: "C-1", sociedadId: "s1", propiedadId: "p1", unidadIds: ["u1"], inquilinoPrincipalId: "per1", estado: "VIGENTE", categoriaFiscal: "ALQUILER_RESIDENCIAL", moneda: "PYG", diaVencimiento: 10, fechaInicio: fecha(2026, 1, 1), fechaFin: fecha(2026, 12, 31), fechaRescision: null, condiciones: [{ vigenteDesde: fecha(2026, 1, 1), montoAlquiler: "3000000" }] };
  it("clave idempotente y determinística", () => {
    const a = generarObligacionesAlquiler([c], "2026-03", [regla()]);
    const b = generarObligacionesAlquiler([c], "2026-03", [regla()]);
    expect(a.borradores[0].claveIdempotencia).toBe(b.borradores[0].claveIdempotencia);
    expect(a.borradores[0].importeTotal.toString()).toBe("3150000");
  });
  it("no genera fuera de rango ni en borrador; marca meses parciales", () => {
    expect(generarObligacionesAlquiler([c], "2027-01", []).borradores).toHaveLength(0);
    expect(generarObligacionesAlquiler([{ ...c, estado: "BORRADOR" }], "2026-03", []).borradores).toHaveLength(0);
    const parcial = generarObligacionesAlquiler([{ ...c, fechaInicio: fecha(2026, 3, 15) }], "2026-03", [regla()]);
    expect(parcial.borradores[0].requiereRevision).toBe(true);
  });
  it("estado solo PAGADA con saldo cero", () => {
    expect(estadoPorSaldo(d(100), d(0), "PARCIAL")).toBe("PAGADA");
    expect(estadoPorSaldo(d(100), d(1), "PENDIENTE")).toBe("PARCIAL");
    expect(estadoPorSaldo(d(100), d(100), "PENDIENTE")).toBe("PENDIENTE");
    expect(estadoPorSaldo(d(100), d(0), "EN_DISPUTA")).toBe("EN_DISPUTA");
  });
  it("mora solo con tasa pactada y validada", () => {
    const venc = fecha(2026, 3, 10), hoy = fecha(2026, 3, 25);
    expect(calcularMora(d(1000000), venc, hoy, { moraTasaDiariaPct: "0.1", moraValidada: false, periodoGraciaDias: 5 }, "PYG").aplicable).toBe(false);
    const m = calcularMora(d(1000000), venc, hoy, { moraTasaDiariaPct: "0.1", moraValidada: true, periodoGraciaDias: 5 }, "PYG");
    expect(m.dias).toBe(10);
    expect(m.interes.toString()).toBe("10000");
  });
});

describe("cobranzas y pagos parciales (ejemplo del requerimiento §10)", () => {
  const obls: ObligacionAbierta[] = [
    { id: "alq", concepto: "ALQUILER", periodo: "2026-06", fechaVencimiento: fecha(2026, 6, 10), moneda: "PYG", saldo: d(3000000), estado: "PENDIENTE" },
    { id: "exp", concepto: "EXPENSAS", periodo: "2026-06", fechaVencimiento: fecha(2026, 6, 10), moneda: "PYG", saldo: d(500000), estado: "PENDIENTE" },
  ];
  it("pago de G. 2.000.000 aplicado al alquiler deja deuda total G. 1.500.000", () => {
    const r = aplicarPago(d(2000000), "PYG", obls);
    expect(r.aplicaciones).toEqual([{ obligacionId: "alq", importe: d(2000000) }]);
    const saldos = obls.map((o) => ({ ...o, saldo: o.saldo.minus(r.aplicaciones.find((a) => a.obligacionId === o.id)?.importe ?? 0) }));
    const deuda = resumirDeuda(saldos);
    expect(deuda.porConcepto.ALQUILER.toString()).toBe("1000000");
    expect(deuda.porConcepto.EXPENSAS.toString()).toBe("500000");
    expect(deuda.total.toString()).toBe("1500000");
  });
  it("pago en exceso genera saldo a favor", () => {
    const r = aplicarPago(d(4000000), "PYG", obls);
    expect(r.saldoAFavor.toString()).toBe("500000");
  });
  it("imputación manual valida saldo, moneda y total", () => {
    expect(aplicarPago(d(2000000), "PYG", obls, [{ obligacionId: "exp", importe: "600000" }]).errores.length).toBeGreaterThan(0);
    expect(aplicarPago(d(2000000), "USD", obls, [{ obligacionId: "alq", importe: "100" }]).errores[0]).toMatch(/Moneda/);
    expect(aplicarPago(d(100), "PYG", obls, [{ obligacionId: "alq", importe: "200" }]).errores.length).toBeGreaterThan(0);
    const ok = aplicarPago(d(2000000), "PYG", obls, [{ obligacionId: "exp", importe: "500000" }, { obligacionId: "alq", importe: "1500000" }]);
    expect(ok.errores).toEqual([]);
    expect(ok.saldoAFavor.toString()).toBe("0");
  });
  it("no imputa a obligaciones de otra moneda en modo automático", () => {
    expect(aplicarPago(d(100), "USD", obls).aplicaciones).toHaveLength(0);
  });
  it("clave anti-duplicado normaliza el comprobante", () => {
    expect(claveDuplicadoPago({ cuentaBancariaId: "cb", comprobante: "00-123.45", importe: d(10), moneda: "PYG" })).toBe(claveDuplicadoPago({ cuentaBancariaId: "cb", comprobante: "0012345", importe: d(10), moneda: "PYG" }));
    expect(claveDuplicadoPago({ comprobante: null, importe: d(10), moneda: "PYG" })).toBeNull();
  });
});

describe("expensas", () => {
  it("distribuye por m² sin perder guaraníes", () => {
    const r = distribuir("1000000", "PYG", "M2", [{ unidadId: "a", superficieM2: "33" }, { unidadId: "b", superficieM2: "33" }, { unidadId: "c", superficieM2: "34" }]);
    expect(r.errores).toEqual([]);
    expect(r.items.reduce((s, i) => s.plus(i.importe), d(0)).toString()).toBe("1000000");
    const r2 = distribuir("100", "PYG", "PARTES_IGUALES", [{ unidadId: "a" }, { unidadId: "b" }, { unidadId: "c" }]);
    expect(r2.items.map((i) => i.importe.toString())).toEqual(["34", "33", "33"]);
  });
  it("no distribuye con datos faltantes ni cuadra montos manuales por su cuenta", () => {
    expect(distribuir("100", "PYG", "M2", [{ unidadId: "a", superficieM2: null }]).errores.length).toBe(1);
    expect(distribuir("100", "PYG", "MANUAL", [{ unidadId: "a", importeFijo: "60" }, { unidadId: "b", importeFijo: "30" }]).errores[0]).toMatch(/no coincide/);
  });
  it("solo traslada al inquilino con respaldo contractual", () => {
    expect(esTrasladable("ORDINARIO", "INQUILINO")).toBe(true);
    expect(esTrasladable("ORDINARIO", "NO_DEFINIDO")).toBe(false);
    expect(esTrasladable("PROPIETARIO", "INQUILINO")).toBe(false);
  });
});

describe("ocupación derivada", () => {
  it("considera entrega y devolución reales", () => {
    const c = { estado: "VIGENTE" as const, fechaInicio: fecha(2026, 1, 1), fechaFin: fecha(2026, 12, 31), fechaEntrega: fecha(2026, 1, 10) };
    expect(estaOcupada([c], fecha(2026, 1, 5))).toBe(false);
    expect(estaOcupada([c], fecha(2026, 2, 1))).toBe(true);
    expect(estaOcupada([{ ...c, fechaDevolucion: fecha(2026, 6, 30) }], fecha(2026, 7, 1))).toBe(false);
    expect(estaOcupada([{ ...c, estado: "VENCIDO" as const }], fecha(2027, 3, 1))).toBe(true);
  });
});

describe("remodelaciones", () => {
  it("separa calidad del dato y bloquea aprobación con faltantes", () => {
    const r = resumirPresupuesto([
      { rubro: "PINTURA", tipo: "MATERIAL", descripcion: "x", total: "1000", calidadDato: "COTIZACION_VERIFICADA" },
      { rubro: "OBRA_CIVIL", tipo: "MATERIAL", descripcion: "y", total: "3000", calidadDato: "SUPUESTO" },
      { rubro: "OBRA_CIVIL", tipo: "MANO_DE_OBRA", descripcion: "z", total: null, calidadDato: "INFORMACION_FALTANTE" },
    ]);
    expect(r.total.toString()).toBe("4000");
    expect(r.pctVerificado.toString()).toBe("25");
    expect(r.aprobable).toBe(false);
  });
  it("impacto proyectado requiere fuente del alquiler posterior", () => {
    expect(impactoRemodelacion("10000000", "1100000", "1500000", null).calculable).toBe(false);
    const ok = impactoRemodelacion("10000000", "1100000", "1500000", "AMC SK-14");
    expect(ok.tipo).toBe("PROYECTADO");
    expect(ok.recuperacionMeses!.toString()).toBe("25");
    expect(desviacion("100", "110").pct!.toString()).toBe("10");
  });
});

describe("documentos", () => {
  it("normaliza CI/RUC para evitar duplicados", () => {
    expect(normalizarDocumento("CI", "C.I. 1.234.567")).toBe("CI:1234567");
    expect(normalizarDocumento("CI", "1234567")).toBe("CI:1234567");
  });
});
