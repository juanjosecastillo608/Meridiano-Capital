import { describe, it, expect } from "vitest";
import { leerLibro } from "@/import/libro";
import { leerChecklist, leerPresupuesto } from "@/import/remodelacion";
import { checklistPrueba, presupuestoPrueba } from "../fixtures/planilla";

describe("lectura de documentos de obra", () => {
  it("checklist: ☐ = incluido, — = no aplica, nota al pie separada", async () => {
    const r = leerChecklist(await leerLibro(await checklistPrueba()));
    expect(r.sectores).toEqual(["4", "13-14", "Terraza", "Local 1"]);
    expect(r.items).toHaveLength(4);
    expect(r.items.filter((i) => i.sector === "Terraza").map((i) => i.item)).toEqual(["Tapa de tanque"]);
    expect(r.notas).toEqual(["Nota al pie de prueba"]);
  });
  it("presupuesto: estimados ≠ cotización; dudosos a revisión técnica; nada aprobado", async () => {
    const r = leerPresupuesto(await leerLibro(await presupuestoPrueba()), "p.xlsx");
    const est = r.partidas.filter((p) => p.etapa === "ESTIMADO");
    const cot = r.partidas.filter((p) => p.etapa === "COTIZACION_PROVEEDOR");
    expect(est).toHaveLength(4);
    expect(cot).toHaveLength(1);
    expect(cot[0].calidadDato).toBe("DATO_RECIBIDO");
    expect(cot[0].total!.toString()).toBe("900000");
    expect(est.find((p) => p.descripcion.startsWith("Cemento"))!.calidadDato).toBe("SUPUESTO");
    expect(est.find((p) => p.descripcion.startsWith("Cemento"))!.total!.toString()).toBe("300000");
    expect(est.find((p) => p.descripcion.startsWith("Codo"))!.calidadDato).toBe("REVISION_TECNICA_REQUERIDA");
    expect(est.find((p) => p.descripcion.startsWith("Cerámica"))!.calidadDato).toBe("REVISION_TECNICA_REQUERIDA");
    expect(est.find((p) => p.tipo === "MANO_DE_OBRA")!.rubro).toBe("PINTURA");
    expect(r.partidas.some((p) => (p.etapa as string) === "APROBADO")).toBe(false);
    expect(r.criterios).toHaveLength(1);
    expect(r.advertencias.some((a) => /solo mano de obra/.test(a))).toBe(true);
  });
});
