/**
 * Aplica las definiciones del founder del 2026-11-12 (D-100) a Canarias Inversiones S.A.
 * Usa los servicios de la aplicación (validaciones + auditoría). Idempotente.
 *
 *   npx tsx scripts/aplicar-definiciones-2026-11-12.ts --dir data/imports/originales
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db";
import { sesionSistema } from "../src/server/authz";
import { auditar } from "../src/server/audit";
import { analizarArchivo, validarImportacion, confirmarImportacion } from "../src/server/services/importacion";
import { declararOcupacion } from "../src/server/services/control";
import { validarCanon } from "../src/server/services/renovacion";
import { recalcularIvaPendiente } from "../src/server/services/fiscal";
import type { MapeoHoja } from "../src/import/procesar";

const FUENTE = "Founder, 2026-11-12 (D-100)";

async function main() {
  const dir = process.argv[process.argv.indexOf("--dir") + 1];
  const s = sesionSistema();
  const soc = await prisma.sociedad.findFirstOrThrow({ where: { ruc: "80167528-6" } });
  const frm = await prisma.propiedad.findUniqueOrThrow({ where: { sociedadId_codigo: { sociedadId: soc.id, codigo: "FRM" } } });
  const mvd = await prisma.propiedad.findUniqueOrThrow({ where: { sociedadId_codigo: { sociedadId: soc.id, codigo: "MONTEVIDEO" } } });

  // 1. Planilla de Montevideo
  const archivo = readdirSync(dir).find((f) => /Planilla.*Montevideo/i.test(f));
  if (archivo && !(await prisma.importBatch.findFirst({ where: { sociedadId: soc.id, estado: "CONFIRMADO", nombreArchivo: { contains: "Montevideo" } } }))) {
    const buf = readFileSync(path.join(dir, archivo));
    const { batch } = await analizarArchivo(s, soc.id, archivo.replace(/^[0-9a-f]{8}-/, ""), buf);
    const { informe } = await validarImportacion(s, batch.id, batch.mapeo as unknown as MapeoHoja[], { moneda: "PYG", tasaIvaControlPct: 5 }, mvd.id);
    console.log(`1. Montevideo validada: ${JSON.stringify(informe.resumen)}`);
    // "12" = habitación sin baño, fuera del inventario declarado (10 deptos + 1 local)
    const r = await confirmarImportacion(s, batch.id, { propiedad: { modo: "EXISTENTE", propiedadId: mvd.id }, unidadesExcluidas: ["12"], confirmacionExplicita: true });
    console.log(`   confirmada: ${JSON.stringify(r)}`);
    const local = await prisma.unidad.findFirst({ where: { propiedadId: mvd.id, tipo: "LOCAL_COMERCIAL" } });
    if (local) await declararOcupacion(s, local.id, "VACANTE", "Anexo de implementación Canarias (founder, 2026-11-11): local comercial vacante");
  } else console.log("1. Montevideo: ya importada o archivo ausente");

  // 2. NIS propio por unidad (FRM se importó antes de existir el campo: se toma de la observación importada)
  let nis = 0;
  for (const u of await prisma.unidad.findMany({ where: { propiedadId: { in: [frm.id, mvd.id] }, nisAnde: null, deletedAt: null } })) {
    const m = /NIS ANDE: (\d+)/.exec(u.observaciones ?? "");
    if (m) { await prisma.unidad.update({ where: { id: u.id }, data: { nisAnde: m[1] } }); nis++; }
  }
  console.log(`2. NIS ANDE registrado en ${nis} unidad(es) adicionales`);

  // 3. Expensas por edificio (exentas de IVA)
  for (const [p, monto] of [[frm, "180000"], [mvd, "70000"]] as const) {
    await prisma.$transaction(async (tx) => {
      await tx.propiedad.update({ where: { id: p.id }, data: { expensaMensualUnidad: monto, expensaFuente: `${FUENTE}: expensas Gs ${Number(monto).toLocaleString("es-PY")} por mes, exentas de IVA (validado por la contadora)` } });
      await auditar(tx, s, "PROPIEDAD_EXPENSA_DEFINIR", "Propiedad", p.id, { sociedadId: soc.id, despues: { expensaMensualUnidad: monto }, motivo: FUENTE });
    });
  }
  console.log("3. Expensas: FRM 180.000 / MONTEVIDEO 70.000 por mes");

  // 4. Responsabilidades de los contratos actuales (borradores importados): energía a cargo del inquilino.
  //    Expensas: en FRM la planilla muestra que el inquilino las paga; en Montevideo la planilla dice "No pagan" → queda sin definir (alerta).
  const actuales = await prisma.contrato.findMany({ where: { sociedadId: soc.id, estado: "BORRADOR", plantillaVersion: null, deletedAt: null } });
  for (const c of actuales) {
    const expensas = c.propiedadId === frm.id ? "INQUILINO" : c.responsabilidadExpensas;
    if (c.responsabilidadServicios === "INQUILINO" && c.responsabilidadExpensas === expensas) continue;
    await prisma.$transaction(async (tx) => {
      await tx.contrato.update({ where: { id: c.id }, data: { responsabilidadServicios: "INQUILINO", responsabilidadExpensas: expensas } });
      await auditar(tx, s, "CONTRATO_RESPONSABILIDADES", "Contrato", c.id, { sociedadId: soc.id, antes: { servicios: c.responsabilidadServicios, expensas: c.responsabilidadExpensas }, despues: { servicios: "INQUILINO", expensas }, motivo: `${FUENTE}: la energía eléctrica la paga cada inquilino (no incluida en el alquiler)${c.propiedadId === frm.id ? "; expensas pagadas por el inquilino según planilla FRM" : ""}` });
    });
  }
  console.log(`4. Responsabilidades actualizadas en ${actuales.length} contrato(s) actuales`);

  // 5. IVA: alquiler con IVA incluido, expensas exentas → desglose de obligaciones con IVA pendiente
  const iva = await recalcularIvaPendiente(s, soc.id, `${FUENTE}: alquiler con IVA incluido; expensas IVA 0 (exentas, validado por la contadora)`);
  console.log(`5. IVA recalculado: ${iva.actualizadas} obligaciones; omitidas ${iva.omitidas.length} (${[...new Set(iva.omitidas.map((o) => o.motivo))].join("; ")})`);

  // 6. Canon = Monto Alquiler Actual de la planilla, para los ocupantes actuales residenciales
  const res: string[] = [];
  for (const c of await prisma.contrato.findMany({ where: { sociedadId: soc.id, estado: "BORRADOR", plantillaVersion: null, categoriaFiscal: "ALQUILER_RESIDENCIAL", deletedAt: null }, include: { condiciones: { orderBy: { vigenteDesde: "desc" }, take: 1 }, unidades: { include: { unidad: true } }, propiedad: true } })) {
    const cond = c.condiciones[0];
    const etiqueta = `${c.propiedad.codigo} ${c.unidades.map((u) => u.unidad.identificador).join(",")}`;
    if (!cond) { res.push(`${etiqueta}: sin importe`); continue; }
    if (cond.validado) { res.push(`${etiqueta}: ya validado`); continue; }
    try {
      await validarCanon(s, c.id, { montoConfirmado: cond.montoAlquiler.toString(), motivo: `${FUENTE}: el canon es el "Monto Alquiler Actual" de la planilla de alquileres; se comienza con el mismo canon` });
      res.push(`${etiqueta}: validado ${cond.montoAlquiler.toString()}`);
    } catch (e) { res.push(`${etiqueta}: NO validado — ${(e as Error).message}`); }
  }
  console.log(`6. Canon:\n   ${res.join("\n   ")}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
