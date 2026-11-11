import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { prisma, ErrorNegocio } from "@/server/db";
import { exigir } from "@/server/authz";
import { validarImportacion, confirmarImportacion, cancelarImportacion } from "@/server/services/importacion";
import { CAMPOS, type CampoDestino } from "@/import/diccionario";
import type { AnalisisLibro } from "@/import/analizar";
import type { MapeoHoja, InformeImport, Problema } from "@/import/procesar";
import { Estado, Tarjeta, Titulo, Aviso, Vacio } from "@/components/ui";

async function validar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  const b = await prisma.importBatch.findUniqueOrThrow({ where: { id } });
  const mapeo = (b.mapeo as unknown as MapeoHoja[]).map((m) => ({
    ...m,
    incluir: form.get(`incluir:${m.hoja}`) === "on",
    periodo: String(form.get(`periodo:${m.hoja}`) ?? "") || null,
    columnas: Object.fromEntries(Object.keys(m.columnas).map((l) => [l, String(form.get(`col:${m.hoja}:${l}`) ?? "ignorar") as CampoDestino])),
  }));
  const moneda = String(form.get("moneda") ?? "") || null;
  const iva = String(form.get("ivaControl") ?? "");
  await validarImportacion(s, id, mapeo, { moneda: moneda as "PYG" | null, tasaIvaControlPct: iva ? Number(iva) : null }, String(form.get("propiedadId") ?? "") || null);
  redirect(`/importaciones/${id}#informe`);
}

async function confirmar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  try {
    const propiedad = v("modo") === "EXISTENTE" ? { modo: "EXISTENTE" as const, propiedadId: v("propiedadId")! } : { modo: "NUEVA" as const, codigo: (v("codigo") ?? "").toUpperCase(), nombre: v("nombre")!, direccion: v("direccion") };
    await confirmarImportacion(s, id, { propiedad, cuentaBancariaId: v("cuentaBancariaId"), importarObligaciones: form.get("importarObligaciones") === "on", importarPagos: form.get("importarPagos") === "on", confirmacionExplicita: (form.get("confirmo") === "on") as true });
  } catch (e) {
    if (e instanceof ErrorNegocio || (e as Error).name === "ZodError") redirect(`/importaciones/${id}?error=${encodeURIComponent((e as Error).message.slice(0, 300))}`);
    throw e;
  }
  redirect(`/importaciones/${id}?ok=1`);
}

async function cancelar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  await cancelarImportacion(s, String(form.get("id")), "Cancelada por el usuario");
  redirect("/importaciones");
}


function ListaProblemas({ ps }: { ps: Problema[] }) {
  if (!ps.length) return null;
  return <ul className="space-y-1">{ps.map((p, i) => <li key={i} className="text-xs"><Estado v={p.severidad} /> <span className="text-gris">{p.codigo}</span> {p.hoja ? <span className="text-gris">[{p.hoja}{p.ref ? ` ${p.ref}` : ""}]</span> : null} {p.mensaje}</li>)}</ul>;
}

export default async function Importacion({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const s = await requerirSesion();
  const b = await prisma.importBatch.findUnique({ where: { id }, include: { sociedad: { include: { propiedades: { where: { deletedAt: null } }, cuentas: { where: { deletedAt: null } } } } } });
  if (!b) return <Vacio>Importación no encontrada.</Vacio>;
  exigir(s, "IMPORTAR", b.sociedadId);
  const analisis = b.analisis as unknown as AnalisisLibro;
  const mapeo = b.mapeo as unknown as MapeoHoja[];
  const informe = b.informe as unknown as (InformeImport & { opciones?: { moneda: string | null; tasaIvaControlPct?: number | null }; conflictosBase?: string[] }) | null;
  const editable = b.estado !== "CONFIRMADO" && b.estado !== "CANCELADO";
  const edificio = analisis.hojas.flatMap((h) => h.tabla?.metadatos ?? []).find((m) => m.clave === "edificio")?.valor;
  const filas = await prisma.importRow.groupBy({ by: ["estado"], where: { batchId: id }, _count: true });

  return (
    <>
      <Titulo eyebrow={`Importación · ${b.sociedad?.razonSocial}`} acciones={<Estado v={b.estado} />}>{b.nombreArchivo}</Titulo>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {sp.ok && <div className="mb-4"><Aviso>Importación confirmada. Todos los registros quedaron como IMPORTADO / PENDIENTE DE REVISIÓN.</Aviso></div>}
      <p className="mb-4 text-xs text-gris">SHA-256 {b.sha256}</p>

      <form action={validar}>
        <input type="hidden" name="id" value={id} />
        <Tarjeta titulo="2 · Hojas detectadas y mapeo de columnas (corrija lo que haga falta)">
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <label className="campo">Moneda de los importes *<select name="moneda" defaultValue={informe?.opciones?.moneda ?? ""} disabled={!editable}><option value="">— no identificada: seleccionar —</option><option value="PYG">PYG (guaraníes)</option><option value="USD">USD</option></select></label>
            <label className="campo">Tasa de IVA para control cruzado (%)<input name="ivaControl" defaultValue={informe?.opciones?.tasaIvaControlPct ?? ""} placeholder="ej. 5" disabled={!editable} /></label>
            <label className="campo">Comparar contra propiedad existente<select name="propiedadId" disabled={!editable}><option value="">—</option>{b.sociedad?.propiedades.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
          </div>
          {analisis.hojas.map((h) => {
            const m = mapeo.find((x) => x.hoja === h.nombre);
            return (
              <div key={h.nombre} className="mb-4 rounded-md border border-linea p-3">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <label className="flex items-center gap-2 font-medium"><input type="checkbox" name={`incluir:${h.nombre}`} defaultChecked={m?.incluir} disabled={!editable || !h.tabla} /> {h.nombre}</label>
                  <span className="text-xs text-gris">{h.filas} filas · {h.columnas} col. · {h.totalFormulas} fórmulas · {h.combinadas} combinadas</span>
                  {h.tabla && <label className="flex items-center gap-2 text-xs">Período <input name={`periodo:${h.nombre}`} defaultValue={m?.periodo ?? ""} placeholder="YYYY-MM" className="w-24 rounded border border-linea px-2 py-0.5" disabled={!editable} /> <span className="text-gris">({h.tabla.periodo.fuente})</span></label>}
                </div>
                {!h.tabla ? <p className="mt-2 text-xs text-gris">{h.motivoSinTabla} — se lista para revisión manual; no se importa.</p> : (
                  <>
                    <div className="mt-2 text-xs text-gris">Encabezado en fila {h.tabla.filaEncabezado}; datos {h.tabla.filaInicio}–{h.tabla.filaFin}{h.tabla.filaTotales ? `; totales en fila ${h.tabla.filaTotales}` : ""}. Metadatos detectados: {h.tabla.metadatos.map((x) => x.clave).join(", ") || "—"}. Columnas con datos sin encabezado: {h.tabla.columnasSinEncabezado.map((c) => c.letra).join(", ") || "—"}.</div>
                    <div className="mt-2 grid gap-2 md:grid-cols-3 xl:grid-cols-5">
                      {h.tabla.columnas.map((c) => (
                        <label key={c.letra} className="campo text-xs">
                          <span><b>{c.letra}</b> “{c.encabezado}” {c.conFormulas ? <span className="text-gris">· {c.conFormulas} fórm.</span> : null}</span>
                          <select name={`col:${h.nombre}:${c.letra}`} defaultValue={m?.columnas[c.letra] ?? "ignorar"} disabled={!editable}>
                            <option value="ignorar">(ignorar)</option>
                            {CAMPOS.map((f) => <option key={f.campo} value={f.campo}>{f.etiqueta}</option>)}
                          </select>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {editable && <button className="btn">Validar</button>}
        </Tarjeta>
      </form>

      {informe && (
        <div id="informe" className="mt-6">
          <Tarjeta titulo="3 · Informe de importación">
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4 xl:grid-cols-8">
              {[["Filas", informe.resumen.filas], ["Unidades", informe.resumen.unidadesDetectadas], ["Inquilinos", informe.resumen.inquilinosDetectados], ["Períodos", informe.resumen.periodos.join(", ")], ["Pagos", informe.resumen.pagosDetectados], ["Errores", informe.resumen.errores], ["Advertencias", informe.resumen.advertencias], ["Duplicados", informe.resumen.duplicados]].map(([k, v]) => (
                <div key={String(k)} className="rounded border border-linea p-2"><div className="text-xs text-gris">{k}</div><div className="font-semibold">{String(v)}</div></div>
              ))}
            </div>
            {informe.bloqueante && <div className="mb-3"><Aviso tipo="error">Hay errores bloqueantes: corrija el mapeo u opciones y vuelva a validar.</Aviso></div>}
            <ListaProblemas ps={informe.problemasGenerales} />
            {informe.conflictosBase?.length ? <div className="mt-3"><Aviso tipo="alerta">{informe.conflictosBase.join(" ")}</Aviso></div> : null}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Detalle fila por fila ({informe.registros.length})</summary>
              <table className="tabla mt-2">
                <thead><tr><th>Hoja</th><th>Fila</th><th>Período</th><th>Unidad</th><th>Inquilino</th><th className="num">Alquiler</th><th className="num">Expensas</th><th className="num">Pago</th><th>Estado</th><th>Problemas</th></tr></thead>
                <tbody>{informe.registros.map((r) => (
                  <tr key={`${r.hoja}-${r.fila}`}>
                    <td className="text-xs">{r.hoja}</td><td>{r.fila}</td><td>{r.periodo}</td><td>{r.unidad.identificador}</td>
                    <td>{r.inquilino?.nombre ?? <span className="text-gris">vacante</span>}</td>
                    <td className="num">{r.alquiler?.toString() ?? "—"}</td><td className="num">{r.expensas?.toString() ?? "—"}</td><td className="num">{r.pagoTotal?.toString() ?? "—"}</td>
                    <td><Estado v={r.estado} /></td><td><ListaProblemas ps={r.problemas} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </details>
          </Tarjeta>
        </div>
      )}

      {b.estado === "VALIDADO" && (
        <form action={confirmar} className="mt-6">
          <input type="hidden" name="id" value={id} />
          <Tarjeta titulo="4 · Confirmación (no se reemplaza ningún dato existente)">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="campo">Destino<select name="modo"><option value="NUEVA">Crear propiedad nueva</option><option value="EXISTENTE">Propiedad existente</option></select></label>
              <label className="campo">Propiedad existente<select name="propiedadId"><option value="">—</option>{b.sociedad?.propiedades.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
              <label className="campo">Código (nueva)<input name="codigo" placeholder="ej. FRM" /></label>
              <label className="campo">Nombre (nueva)<input name="nombre" defaultValue={edificio ?? ""} /></label>
              <label className="campo md:col-span-2">Dirección (nueva)<input name="direccion" /></label>
              <label className="campo">Cuenta receptora de los pagos<select name="cuentaBancariaId"><option value="">— sin asignar —</option>{b.sociedad?.cuentas.map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero} ({c.moneda})</option>)}</select></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="importarObligaciones" defaultChecked /> Importar obligaciones históricas (alquiler y expensas por período)</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="importarPagos" defaultChecked /> Importar pagos declarados (sin duplicados)</label>
            </div>
            <ul className="mt-3 list-disc pl-5 text-xs text-gris">
              <li>Se crean unidades nuevas; las existentes no se modifican.</li>
              <li>Los inquilinos se crean sin documento (el Excel no lo trae) y quedan pendientes de revisión.</li>
              <li>Los contratos se crean como BORRADOR sin fechas: hay que completarlos con el contrato original antes de activarlos.</li>
              <li>El IVA de las obligaciones importadas queda pendiente (no se infiere el tratamiento).</li>
            </ul>
            <label className="mt-4 flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="confirmo" /> Revisé el informe y confirmo la importación.</label>
            <div className="mt-4 flex gap-3"><button className="btn btn-cta">Confirmar e importar</button></div>
          </Tarjeta>
        </form>
      )}

      {b.estado === "CONFIRMADO" && (
        <Tarjeta titulo="Resultado" className="mt-6">
          <div className="flex gap-4 text-sm">{filas.map((f) => <span key={f.estado}><Estado v={f.estado} /> {f._count}</span>)}</div>
        </Tarjeta>
      )}

      {editable && (
        <form action={cancelar} className="mt-4"><input type="hidden" name="id" value={id} /><button className="text-sm text-gris underline">Cancelar importación</button></form>
      )}
    </>
  );
}

