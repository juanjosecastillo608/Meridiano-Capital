/**
 * Carga inicial del ANEXO DE IMPLEMENTACIÓN — Canarias Inversiones S.A.
 * (founder, 2026-11-11). Usa exclusivamente los servicios de la aplicación
 * (validaciones, auditoría, aislamiento). Idempotente en lo posible: si un
 * paso ya está hecho, lo informa y sigue.
 *
 * Datos de negocio confirmados en el anexo (no personales): razón social, RUC,
 * identificadores de edificios e inventario administrativo declarado.
 * Los archivos reales se pasan por argumento desde data/imports/ (fuera de git).
 *
 *   npx tsx scripts/cargar-anexo-canarias.ts --dir data/imports/originales [--confirmar-frm]
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db";
import { sesionSistema } from "../src/server/authz";
import { crearSociedad, crearPropiedad } from "../src/server/services/nucleo";
import { declararInventario, declararOcupacion } from "../src/server/services/control";
import { subirDocumento } from "../src/server/services/documentos";
import { analizarArchivo, validarImportacion, confirmarImportacion, cancelarImportacion } from "../src/server/services/importacion";
import { crearProyecto, importarChecklist, importarPresupuesto, importarListadosSector } from "../src/server/services/remodelaciones";
import type { MapeoHoja } from "../src/import/procesar";

const FUENTE = "Anexo de implementación Canarias Inversiones S.A. (founder, 2026-11-11)";
const ARCHIVOS_ESPERADOS: [RegExp, string][] = [
  [/Planilla.*Montevideo/i, "Planilla Cobro Alquileres Edificio Montevideo.xlsx"],
  [/Planilla.*FRM/i, "Planilla Cobro Alquileres Edificio FRM.xlsx"],
  [/RUC.*Canarias/i, "RUC Canarias Inversiones SA.pdf"],
  [/Poder.*Canarias/i, "Poder Canarias Inversiones SA.pdf"],
  [/Planos?.*Montevideo/i, "Planos Montevideo.pdf"],
  [/Mapa.*Montevideo/i, "Mapa Ubicacion Propiedad Montevideo.jpg"],
  [/Plano.?1.*FRM/i, "Plano 1 Edificio FRM.jpeg"],
  [/Plano.?2.*FRM/i, "Plano 2 Edificio FRM.jpeg"],
  [/Resoluci.n.*FRM/i, "Resolucion de Aprobacion Plano Edificio FRM.jpeg"],
  [/Checklist.*Fulgencio/i, "Checklist_Proveedor_Edificio_Fulgencio_R_Moreno.xlsx"],
  [/cotizacion.*reforma/i, "Primera Etapa cotizacion_reforma_completa.xlsx"],
];

async function main() {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf("--dir") + 1];
  if (!dir || args.indexOf("--dir") < 0) throw new Error("Uso: cargar-anexo-canarias --dir <carpeta>");
  const s = sesionSistema();
  const presentes = readdirSync(dir);
  const buscar = (re: RegExp) => presentes.find((f) => re.test(f));
  console.log("1. Archivos del anexo:");
  for (const [re, nombre] of ARCHIVOS_ESPERADOS) console.log(`   ${buscar(re) ? "✓" : "✗ FALTA"}  ${nombre}`);

  // Sociedad
  let soc = await prisma.sociedad.findFirst({ where: { ruc: "80167528-6" } });
  if (!soc) soc = await crearSociedad(s, { razonSocial: "CANARIAS INVERSIONES SOCIEDAD ANÓNIMA", ruc: "80167528-6", estado: "ACTIVA", estadoDato: "VALIDADO", observaciones: "RUC confirmado en el anexo y verificado contra la Cédula Tributaria DNIT." });
  console.log(`2. Sociedad: ${soc.razonSocial} (${soc.ruc})`);

  // Edificios con inventario declarado
  const edificios = [
    { codigo: "FRM", nombre: "Edificio Fulgencio R. Moreno", deptos: 13, locales: 1 },
    { codigo: "MONTEVIDEO", nombre: "Edificio Montevideo", deptos: 10, locales: 1 },
  ];
  const props: Record<string, string> = {};
  for (const e of edificios) {
    let p = await prisma.propiedad.findUnique({ where: { sociedadId_codigo: { sociedadId: soc.id, codigo: e.codigo } } });
    if (!p) p = await crearPropiedad(s, { sociedadId: soc.id, codigo: e.codigo, nombre: e.nombre, ciudad: "Asunción", barrio: null, observaciones: "Centro de Asunción. Alquileres residenciales mensuales sin muebles (anexo)." });
    await declararInventario(s, p.id, { deptos: e.deptos, locales: e.locales, fuente: FUENTE });
    props[e.codigo] = p.id;
    console.log(`3. Edificio ${e.codigo}: inventario declarado ${e.deptos} deptos + ${e.locales} local`);
  }

  // Expediente: RUC
  const ruc = buscar(/RUC.*Canarias/i);
  if (ruc && !(await prisma.documento.findFirst({ where: { sociedadId: soc.id, tipo: "RUC", deletedAt: null } }))) {
    await subirDocumento(s, { sociedadId: soc.id, tipo: "RUC", titulo: "Cédula Tributaria — RUC", fechaEmision: "2026-02-04" }, ruc.replace(/^[0-9a-f]{8}-/, ""), readFileSync(path.join(dir, ruc)));
    console.log("4. Expediente: RUC incorporado");
  }

  // Planilla FRM
  const frm = buscar(/Planilla.*FRM/i);
  if (frm) {
    const buf = readFileSync(path.join(dir, frm));
    if (!(await prisma.documento.findFirst({ where: { sociedadId: soc.id, propiedadId: props.FRM, tipo: "PLANILLA_ADMINISTRATIVA", deletedAt: null } })))
      await subirDocumento(s, { sociedadId: soc.id, propiedadId: props.FRM, tipo: "PLANILLA_ADMINISTRATIVA", titulo: "Planilla de cobro de alquileres FRM (jun–ago 2026)" }, frm.replace(/^[0-9a-f]{8}-/, ""), buf);
    const yaConfirmada = await prisma.importBatch.findFirst({ where: { sociedadId: soc.id, estado: "CONFIRMADO", nombreArchivo: { contains: "FRM" } } });
    if (yaConfirmada) console.log(`5. Planilla FRM ya confirmada (${yaConfirmada.id})`);
    else {
      for (const b of await prisma.importBatch.findMany({ where: { sociedadId: soc.id, estado: { in: ["ANALIZADO", "MAPEADO", "VALIDADO"] } } })) await cancelarImportacion(s, b.id, "Reemplazada por la carga del anexo");
      const { batch } = await analizarArchivo(s, soc.id, frm.replace(/^[0-9a-f]{8}-/, ""), buf);
      const { informe } = await validarImportacion(s, batch.id, batch.mapeo as unknown as MapeoHoja[], { moneda: "PYG", tasaIvaControlPct: 5 }, props.FRM);
      console.log(`5. Planilla FRM validada: ${JSON.stringify(informe.resumen)}`);
      if (args.includes("--confirmar-frm")) {
        // Áticos 15 y 16: fuera del inventario administrativo declarado (13 deptos + 1 local).
        const r = await confirmarImportacion(s, batch.id, { propiedad: { modo: "EXISTENTE", propiedadId: props.FRM }, unidadesExcluidas: ["15", "16"], confirmacionExplicita: true });
        console.log(`   confirmada: ${JSON.stringify(r)}`);
      } else console.log(`   pendiente de confirmación en /importaciones/${batch.id}`);
    }
    const salon = await prisma.unidad.findFirst({ where: { propiedadId: props.FRM, identificador: "Salon" } });
    if (salon) { await declararOcupacion(s, salon.id, "VACANTE", FUENTE); console.log("6. Local comercial FRM declarado VACANTE"); }
  }

  // Remodelación FRM
  const ck = buscar(/Checklist.*Fulgencio/i), cot = buscar(/cotizacion.*reforma/i);
  if (ck || cot) {
    let p = await prisma.proyectoRemodelacion.findUnique({ where: { codigo: "FRM-REM-2026-01" } });
    if (!p) {
      p = await crearProyecto(s, { propiedadId: props.FRM, codigo: "FRM-REM-2026-01", objetivo: "Reforma primera etapa — deptos 4, 6, 10, 12, 13-14, terraza, local y fachada", descripcion: `Creado desde el ${FUENTE}. Ningún importe está aprobado.` });
      if (ck) console.log(`7. Checklist: ${JSON.stringify((await importarChecklist(s, p.id, ck.replace(/^[0-9a-f]{8}-/, ""), readFileSync(path.join(dir, ck)))).sectores)}`);
      if (cot) { const r = await importarPresupuesto(s, p.id, cot.replace(/^[0-9a-f]{8}-/, ""), readFileSync(path.join(dir, cot))); console.log(`8. Presupuesto: ${r.partidas} partidas; ${r.advertencias.join(" | ")}`); }
      if (frm) console.log(`9. Listados por departamento de la planilla FRM: ${(await importarListadosSector(s, p.id, frm.replace(/^[0-9a-f]{8}-/, ""), readFileSync(path.join(dir, frm)))).items} ítems`);
    } else console.log("7. Proyecto FRM-REM-2026-01 ya existe");
  }
}

main().catch((e) => { console.error(e.message ?? e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
