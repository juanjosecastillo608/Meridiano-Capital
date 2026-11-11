/**
 * Analiza un Excel SIN escribir en la base de datos y guarda el informe
 * completo en data/imports/informes/ (carpeta ignorada por git: contiene PII).
 * Por consola solo imprime un resumen sin datos personales.
 *
 *   npx tsx scripts/import-analyze.ts <archivo.xlsx> --moneda PYG [--iva-control 5]
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { leerLibro } from "../src/import/libro";
import { analizarLibro } from "../src/import/analizar";
import { proponerMapeo, procesar, OPCIONES_DEFAULT } from "../src/import/procesar";

async function main() {
  const [archivo, ...resto] = process.argv.slice(2);
  if (!archivo) throw new Error("Uso: import-analyze <archivo.xlsx> --moneda PYG|USD");
  const arg = (k: string) => { const i = resto.indexOf(k); return i >= 0 ? resto[i + 1] : undefined; };
  const moneda = (arg("--moneda") as "PYG" | "USD" | undefined) ?? null;
  const ivaControl = arg("--iva-control");

  const libro = await leerLibro(readFileSync(archivo));
  const analisis = analizarLibro(libro);
  const mapeo = proponerMapeo(analisis);
  const informe = procesar(libro, analisis, mapeo, { ...OPCIONES_DEFAULT, moneda, tasaIvaControlPct: ivaControl ? Number(ivaControl) : null });

  const dir = path.resolve("data/imports/informes");
  mkdirSync(dir, { recursive: true });
  const salida = path.join(dir, `${path.basename(archivo, ".xlsx")}.informe.json`);
  writeFileSync(salida, JSON.stringify({ analisis: { ...analisis, hojas: analisis.hojas }, mapeo, informe }, null, 2));

  console.log(`SHA-256: ${libro.sha256}`);
  for (const h of analisis.hojas) {
    console.log(`\nHoja "${h.nombre}" — ${h.filas}x${h.columnas}, ${h.totalFormulas} fórmulas`);
    if (!h.tabla) { console.log(`  sin tabla: ${h.motivoSinTabla}`); continue; }
    console.log(`  encabezado fila ${h.tabla.filaEncabezado}, datos ${h.tabla.filaInicio}-${h.tabla.filaFin}, período ${h.tabla.periodo.valor} (${h.tabla.periodo.fuente})`);
    console.log(`  mapeo: ${h.tabla.columnas.map((c) => `${c.letra}="${c.encabezado}"→${c.propuesta}`).join(" | ")}`);
    console.log(`  metadatos: ${h.tabla.metadatos.map((m) => m.clave).join(", ")}`);
  }
  console.log("\nResumen:", JSON.stringify(informe.resumen, null, 2));
  const conteo = new Map<string, number>();
  for (const p of [...informe.problemasGenerales, ...informe.registros.flatMap((r) => r.problemas)]) conteo.set(`${p.severidad} ${p.codigo}`, (conteo.get(`${p.severidad} ${p.codigo}`) ?? 0) + 1);
  console.log("\nProblemas por tipo:");
  for (const [k, v] of [...conteo.entries()].sort()) console.log(`  ${k}: ${v}`);
  console.log(`\nBloqueante: ${informe.bloqueante}\nInforme completo (con PII, no versionado): ${salida}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
