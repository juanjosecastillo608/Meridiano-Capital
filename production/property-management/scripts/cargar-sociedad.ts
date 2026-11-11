/**
 * Carga inicial de una sociedad y sus planillas Excel por línea de comandos,
 * usando EXACTAMENTE los mismos servicios que la interfaz (mismas validaciones,
 * auditoría y aislamiento). Los datos reales se pasan por argumento: este
 * script no contiene ningún dato de cliente.
 *
 * Sin --confirmar: crea/ubica la sociedad, analiza y valida cada archivo, y
 * deja la importación en estado VALIDADO para confirmarla desde la interfaz
 * (/importaciones/<id>) después de revisar el informe.
 *
 *   npx tsx scripts/cargar-sociedad.ts --razon "<RAZÓN SOCIAL>" --ruc <RUC> --moneda PYG \
 *       --archivo <planilla.xlsx> [--archivo <otra.xlsx>] [--iva-control 5] \
 *       [--confirmar --codigo FRM --nombre "Edificio ..."]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db";
import { sesionSistema } from "../src/server/authz";
import { crearSociedad } from "../src/server/services/nucleo";
import { analizarArchivo, validarImportacion, confirmarImportacion } from "../src/server/services/importacion";
import type { MapeoHoja } from "../src/import/procesar";

function args() {
  const a = process.argv.slice(2);
  const get = (k: string) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  const all = (k: string) => a.flatMap((x, i) => (x === k ? [a[i + 1]] : []));
  return { razon: get("--razon"), ruc: get("--ruc"), moneda: get("--moneda") as "PYG" | "USD" | undefined, archivos: all("--archivo"), iva: get("--iva-control"), confirmar: a.includes("--confirmar"), codigo: get("--codigo"), nombre: get("--nombre") };
}

async function main() {
  const o = args();
  if (!o.razon) throw new Error("Falta --razon");
  const s = sesionSistema();
  let soc = await prisma.sociedad.findFirst({ where: { OR: [{ razonSocial: o.razon }, ...(o.ruc ? [{ ruc: o.ruc }] : [])] } });
  if (!soc) {
    soc = await crearSociedad(s, { razonSocial: o.razon, ruc: o.ruc ?? null, monedaOperacion: o.moneda ?? "PYG", estado: "ACTIVA", observaciones: o.ruc ? "RUC verificado contra Cédula Tributaria DNIT (documento aportado por el founder)." : null, estadoDato: o.ruc ? "VALIDADO" : "PENDIENTE_REVISION" });
    console.log(`Sociedad creada: ${soc.razonSocial} (${soc.id})`);
  } else console.log(`Sociedad existente: ${soc.razonSocial} (${soc.id})`);

  for (const archivo of o.archivos) {
    const { batch, yaImportadoAntes } = await analizarArchivo(s, soc.id, path.basename(archivo), readFileSync(archivo));
    if (yaImportadoAntes) console.log(`⚠ Este archivo (mismo SHA-256) ya fue confirmado en la importación ${yaImportadoAntes}.`);
    const { informe } = await validarImportacion(s, batch.id, batch.mapeo as unknown as MapeoHoja[], { moneda: o.moneda ?? null, tasaIvaControlPct: o.iva ? Number(o.iva) : null });
    console.log(`\n${path.basename(archivo)} → importación ${batch.id}`);
    console.log(`  hojas procesadas: ${informe.hojasProcesadas.length}, omitidas: ${informe.hojasOmitidas.length}`);
    console.log(`  resumen: ${JSON.stringify(informe.resumen)}`);
    console.log(`  bloqueante: ${informe.bloqueante}`);
    if (o.confirmar) {
      if (!o.codigo || !o.nombre) throw new Error("--confirmar requiere --codigo y --nombre de la propiedad");
      const r = await confirmarImportacion(s, batch.id, { propiedad: { modo: "NUEVA", codigo: o.codigo, nombre: o.nombre }, confirmacionExplicita: true });
      console.log(`  CONFIRMADA: ${JSON.stringify(r)}`);
    } else {
      console.log(`  Pendiente de confirmación: revisar en /importaciones/${batch.id}`);
    }
  }
}

main().catch((e) => { console.error(e.message ?? e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
