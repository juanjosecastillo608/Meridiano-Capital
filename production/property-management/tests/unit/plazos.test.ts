import { describe, it, expect } from "vitest";
import { calculateLeaseEndDate, diasInclusivos, numeroALetras, formatoLocal } from "@/domain/plazos";
import { alertaVencimiento, ALERTAS_DEFAULT } from "@/domain/contratos";
import { fecha } from "@/domain/periodo";
import { textoContrato, CLAUSULA_PLAZO } from "@/server/plantillas/contrato-residencial";

describe("calculateLeaseEndDate (meses calendario, inicio y fin inclusivos)", () => {
  it("ejemplo del anexo: 01/12/2026 + 12 meses → 30/11/2027", () => {
    expect(calculateLeaseEndDate("2026-12-01", 12)).toBe("2027-11-30");
  });
  it("inicio el primer día del mes", () => {
    expect(calculateLeaseEndDate("2026-01-01", 12)).toBe("2026-12-31");
    expect(calculateLeaseEndDate("2026-07-01", 12)).toBe("2027-06-30");
  });
  it("inicio a mitad de mes", () => {
    expect(calculateLeaseEndDate("2026-03-15", 12)).toBe("2027-03-14");
    expect(calculateLeaseEndDate("2026-11-16", 12)).toBe("2027-11-15");
  });
  it("inicio en febrero", () => {
    expect(calculateLeaseEndDate("2026-02-01", 12)).toBe("2027-01-31");
    expect(calculateLeaseEndDate("2027-02-28", 12)).toBe("2028-02-27");
    expect(calculateLeaseEndDate("2026-02-15", 1)).toBe("2026-03-14");
  });
  it("años bisiestos", () => {
    expect(calculateLeaseEndDate("2027-03-01", 12)).toBe("2028-02-29");
    expect(calculateLeaseEndDate("2028-02-29", 12)).toBe("2029-02-28"); // aniversario inexistente
    expect(calculateLeaseEndDate("2028-02-29", 48)).toBe("2032-02-28");
    expect(calculateLeaseEndDate("2028-01-31", 1)).toBe("2028-02-29");
    expect(diasInclusivos("2027-03-01", "2028-02-29")).toBe(366);
    expect(diasInclusivos("2026-12-01", "2027-11-30")).toBe(365);
  });
  it("finales de mes", () => {
    expect(calculateLeaseEndDate("2026-01-31", 1)).toBe("2026-02-28");
    expect(calculateLeaseEndDate("2026-08-31", 1)).toBe("2026-09-30");
    expect(calculateLeaseEndDate("2026-12-31", 12)).toBe("2027-12-30");
  });
  it("sin zona horaria: la misma fecha en cualquier huso", () => {
    const tz = process.env.TZ;
    process.env.TZ = "Pacific/Kiritimati";
    expect(calculateLeaseEndDate("2026-12-01", 12)).toBe("2027-11-30");
    process.env.TZ = "America/Asuncion";
    expect(calculateLeaseEndDate("2026-12-01", 12)).toBe("2027-11-30");
    process.env.TZ = tz;
  });
  it("rechaza fechas inexistentes y plazos inválidos", () => {
    expect(() => calculateLeaseEndDate("2027-02-29", 12)).toThrow(/inexistente/);
    expect(() => calculateLeaseEndDate("01/12/2026", 12)).toThrow(/inválida/);
    expect(() => calculateLeaseEndDate("2026-12-01", 0)).toThrow();
    expect(() => calculateLeaseEndDate("2026-12-01", 1.5)).toThrow();
  });
});

describe("importe en letras y formato", () => {
  it("convierte importes típicos de alquiler", () => {
    expect(numeroALetras(700000)).toBe("SETECIENTOS MIL");
    expect(numeroALetras(1100000)).toBe("UN MILLÓN CIEN MIL");
    expect(numeroALetras(2500000)).toBe("DOS MILLONES QUINIENTOS MIL");
    expect(numeroALetras(21000)).toBe("VEINTIÚN MIL");
    expect(numeroALetras(31000000)).toBe("TREINTA Y UN MILLONES");
    expect(formatoLocal("2027-11-30")).toBe("30/11/2027");
  });
});

describe("alertas de vencimiento 90/60/30/día del vencimiento", () => {
  it("incluye el día del vencimiento y no modifica nada", () => {
    expect(ALERTAS_DEFAULT).toEqual([90, 60, 30, 0]);
    expect(alertaVencimiento(fecha(2027, 11, 30), fecha(2027, 11, 30)).umbral).toBe(0);
    expect(alertaVencimiento(fecha(2027, 11, 30), fecha(2027, 11, 29)).umbral).toBe(30);
    expect(alertaVencimiento(fecha(2027, 11, 30), fecha(2027, 9, 1)).umbral).toBe(90);
    expect(alertaVencimiento(fecha(2027, 11, 30), fecha(2027, 12, 1)).vencido).toBe(true);
  });
});

describe("plantilla residencial 12 meses", () => {
  const base = {
    codigo: "T-1", sociedad: { razonSocial: "SOCIEDAD DE PRUEBA S.A.", ruc: "80000000-1", domicilioFiscal: null, representante: null },
    inquilinos: [{ nombre: "INQUILINO DE PRUEBA", documento: null, domicilio: null }], edificio: { nombre: "Edificio Prueba", direccion: null, ciudad: "Asunción" },
    unidad: { identificador: "5", piso: null, dormitorios: 2 }, plazoMeses: 12, fechaInicio: "2026-12-01", fechaFin: "2027-11-30", fechaFirma: null,
    canon: "1700000", moneda: "PYG" as const, diaVencimiento: null, cuenta: null, deposito: null,
  };
  it("incluye la cláusula de plazo provisional con las fechas, y no inventa datos desconocidos", () => {
    const t = textoContrato(base);
    expect(CLAUSULA_PLAZO).toContain("DOCE (12) MESES");
    expect(t.parrafos.join("\n")).toContain("El plazo de duración de la presente locación será de DOCE (12) MESES, iniciándose el día 01/12/2026 y finalizando el día 30/11/2027, conforme a las condiciones acordadas por las partes.");
    expect(t.parrafos.join("\n")).toContain("G. 1.700.000 (UN MILLÓN SETECIENTOS MIL GUARANÍES)");
    for (const f of ["día de vencimiento mensual", "cuenta bancaria receptora", "documento de identidad de INQUILINO DE PRUEBA", "representante legal / apoderado con poder vigente", "fecha de firma"]) expect(t.faltantes).toContain(f);
    expect(t.parrafos.join("\n")).toContain("[PENDIENTE: día de vencimiento mensual]");
  });
});
