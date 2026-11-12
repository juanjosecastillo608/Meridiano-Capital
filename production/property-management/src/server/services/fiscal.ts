import { prisma, ErrorNegocio } from "../db";
import { exigir, type Sesion } from "../authz";
import { auditar } from "../audit";
import { resolverRegla, categoriaFiscal, calcularIva, type ReglaFiscalDTO } from "../../domain/impuestos";
import { d } from "../../domain/money";

/**
 * Aplica las reglas fiscales vigentes a obligaciones que quedaron con IVA
 * pendiente (p. ej. importadas antes de definir el tratamiento).
 * Solo DESGLOSA neto/IVA cuando el total no cambia (IVA incluido o tasa 0):
 * nunca modifica importes adeudados ni saldos automáticamente.
 */
export async function recalcularIvaPendiente(s: Sesion, sociedadId: string, motivo: string) {
  exigir(s, "CONFIGURAR_SOCIEDAD", sociedadId);
  if (!motivo?.trim()) throw new ErrorNegocio("Indique el motivo (decisión fiscal que se aplica).");
  const reglas: ReglaFiscalDTO[] = (await prisma.reglaFiscal.findMany()).map((r) => ({ ...r, tasaPct: r.tasaPct.toString(), baseImponiblePct: r.baseImponiblePct.toString() }));
  const obls = await prisma.obligacion.findMany({ where: { sociedadId, ivaPendiente: true, estado: { not: "ANULADA" } }, include: { contrato: { select: { categoriaFiscal: true } } } });
  const res = { actualizadas: 0, sinCambioDeTotal: 0, omitidas: [] as { id: string; motivo: string }[] };
  await prisma.$transaction(async (tx) => {
    for (const o of obls) {
      const cat = categoriaFiscal(o.concepto, o.contrato?.categoriaFiscal ?? "ALQUILER_RESIDENCIAL");
      const regla = resolverRegla(reglas, cat, o.fechaVencimiento);
      if (!regla || regla.estadoValidacion === "PENDIENTE") { res.omitidas.push({ id: o.id, motivo: `Sin regla validada para ${cat}` }); continue; }
      const total = d(o.importeTotal.toString()).minus(d(o.ajustes.toString()));
      const tasaCero = d(regla.tasaPct).isZero();
      if (!regla.ivaIncluido && !tasaCero) { res.omitidas.push({ id: o.id, motivo: `La regla ${regla.codigo} suma IVA al importe: cambiaría el total adeudado (requiere revisión manual)` }); continue; }
      const r = calcularIva(total, { ...regla, ivaIncluido: true }, o.moneda);
      await tx.obligacion.update({ where: { id: o.id }, data: { importeNeto: r.neto.toString(), iva: r.iva.toString(), reglaFiscalId: regla.id, ivaPendiente: false } });
      res.actualizadas++;
      res.sinCambioDeTotal++;
    }
    await auditar(tx, s, "FISCAL_RECALCULO_IVA", "Sociedad", sociedadId, { sociedadId, despues: res, motivo });
  });
  return res;
}
