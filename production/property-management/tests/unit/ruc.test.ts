import { describe, it, expect } from "vitest";
import { calcularDV, normalizarRuc } from "@/domain/ruc";
import { normalizarIdentificadorUnidad } from "@/import/procesar";

describe("RUC → CI (founder 2026-11-12)", () => {
  it("dígito verificador módulo 11", () => {
    expect(calcularDV("80167528")).toBe(6); // RUC de la sociedad, verificado contra la cédula tributaria
    expect(calcularDV("1234567")).toBe(normalizarRuc(`1234567-${calcularDV("1234567")}`)!.dv);
  });
  it("CI = RUC sin guion ni DV; RUC completo para la factura", () => {
    const dv = calcularDV("4567890");
    const r = normalizarRuc(`4.567.890-${dv}`)!;
    expect(r).toMatchObject({ ruc: `4567890-${dv}`, ci: "4567890", dvValido: true, dvFaltante: false });
  });
  it("RUC sin DV: deriva la CI pero no inventa el dígito", () => {
    const r = normalizarRuc("1112223-")!;
    expect(r.ci).toBe("1112223");
    expect(r.dvFaltante).toBe(true);
    expect(r.ruc).toBe("1112223-?");
    expect(normalizarRuc("11122230")!.base).toBe("11122230"); // sin guion: todo es base
  });
  it("DV incorrecto y persona jurídica", () => {
    const dv = calcularDV("1234567");
    expect(normalizarRuc(`1234567-${(dv + 1) % 10}`)!.dvValido).toBe(false);
    expect(normalizarRuc("80167528-6")).toMatchObject({ probablePersonaJuridica: true, ci: null, dvValido: true });
    expect(normalizarRuc("abc")).toBeNull();
  });
  it("normaliza códigos de unidad de las planillas", () => {
    expect(normalizarIdentificadorUnidad(" PB B  Dpto")).toBe("PB B");
    expect(normalizarIdentificadorUnidad(" PB A Salon")).toBe("PB A Salon");
    expect(normalizarIdentificadorUnidad("Depto 7")).toBe("7");
  });
});
