import { protegido } from "@/lib/acceso";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { obtenerProyecto, importarChecklist, importarPresupuesto, agregarPartida, aprobarPresupuesto, crearOrdenTrabajo, registrarGastoEjecutado, marcarGastoPagado, finalizarProyecto } from "@/server/services/remodelaciones";
import { ErrorNegocio } from "@/server/db";
import { puede } from "@/server/authz";
import { Titulo, Tarjeta, Vacio, Estado, Dinero, Fecha, Aviso, KPI } from "@/components/ui";
import { hoyAsuncion, aISO } from "@/domain/periodo";

/** Ejecuta la acción y redirige al proyecto (con el error de negocio visible si lo hay). */
async function ejecutar(form: FormData, fn: (id: string) => Promise<unknown>) {
  const id = String(form.get("id"));
  try { await fn(id); } catch (e) {
    if (e instanceof ErrorNegocio || (e as Error).name === "ZodError") redirect(`/remodelaciones/${id}?error=${encodeURIComponent((e as Error).message.slice(0, 300))}`);
    throw e;
  }
  redirect(`/remodelaciones/${id}`);
}
const v = (f: FormData, k: string) => (String(f.get(k) ?? "").trim() || null);
const archivo = async (f: FormData, k: string) => { const x = f.get(k) as File | null; return x && x.size ? { nombre: x.name, buffer: Buffer.from(await x.arrayBuffer()) } : undefined; };

async function subirChecklist(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); const a = await archivo(f, "archivo"); if (!a) throw new ErrorNegocio("Seleccione el archivo."); const mapeo: Record<string, string[]> = {}; for (const l of String(f.get("mapeo") ?? "").split("\n")) { const [k, val] = l.split("="); if (k?.trim() && val?.trim()) mapeo[k.trim()] = val.split(",").map((x) => x.trim()); } await importarChecklist(s, id, a.nombre, a.buffer, mapeo); });
}
async function subirPresupuesto(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); const a = await archivo(f, "archivo"); if (!a) throw new ErrorNegocio("Seleccione el archivo."); await importarPresupuesto(s, id, a.nombre, a.buffer); });
}
async function nuevaPartida(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); await agregarPartida(s, id, { etapa: v(f, "etapa") as "COTIZACION_PROVEEDOR", descripcion: v(f, "descripcion")!, tipo: v(f, "tipo") as "MANO_DE_OBRA", unidadId: v(f, "unidadId"), sector: v(f, "sector"), cantidad: v(f, "cantidad"), precioUnitario: v(f, "precioUnitario"), unidadMedida: v(f, "unidadMedida"), proveedor: v(f, "proveedor"), fuente: v(f, "fuente") ?? "" }); });
}
async function aprobar(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); await aprobarPresupuesto(s, id, f.getAll("partidaIds").map(String), v(f, "motivo") ?? ""); });
}
async function orden(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); await crearOrdenTrabajo(s, id, { descripcion: v(f, "descripcion")!, categoria: v(f, "categoria") as "VARIOS", sector: v(f, "sector"), proveedor: v(f, "proveedor"), costoEstimado: v(f, "costoEstimado") }); });
}
async function gasto(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); await registrarGastoEjecutado(s, id, { ordenTrabajoId: v(f, "ordenTrabajoId"), descripcion: v(f, "descripcion")!, importe: v(f, "importe") ?? "", fecha: v(f, "fecha")!, comprobante: v(f, "comprobante"), proveedor: v(f, "proveedor"), sector: v(f, "sector") }, await archivo(f, "archivo")); });
}
async function pagado(f: FormData) {
  "use server";
  await ejecutar(f, async (_id) => { const s = await requerirSesion(); await marcarGastoPagado(s, v(f, "egresoId")!, v(f, "fechaPago")!, await archivo(f, "archivo")); });
}
async function finalizar(f: FormData) {
  "use server";
  await ejecutar(f, async (id) => { const s = await requerirSesion(); await finalizarProyecto(s, id, v(f, "motivo") ?? ""); });
}

export default async function Proyecto({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const s = await requerirSesion();
  const { proyecto: p, etapas: e, alcancePorSector } = await protegido(() => obtenerProyecto(s, id));
  const m = p.moneda;
  const gestiona = puede(s, "GESTIONAR_REMODELACIONES", p.sociedadId, p.propiedadId);
  const aprueba = puede(s, "APROBAR_PRESUPUESTO", p.sociedadId, p.propiedadId);
  const partidas = (etapa: string) => p.partidas.filter((x) => x.etapa === etapa);
  const editable = p.estado === "EN_PRESUPUESTO" || p.estado === "PENDIENTE_APROBACION";

  const TablaPartidas = ({ etapa, seleccionable }: { etapa: string; seleccionable?: boolean }) => {
    const xs = partidas(etapa);
    if (!xs.length) return <Vacio>Sin partidas en esta etapa.</Vacio>;
    return (
      <table className="tabla"><thead><tr>{seleccionable && <th></th>}<th>Rubro</th><th>Descripción</th><th>Destino</th><th className="num">Cant.</th><th className="num">Unitario</th><th className="num">Total</th>{etapa === "ESTIMADO" && <th className="num">Rango bajo–alto (unit.)</th>}<th>Calidad del dato</th></tr></thead>
        <tbody>{xs.map((x) => (
          <tr key={x.id}>
            {seleccionable && <td><input type="checkbox" name="partidaIds" value={x.id} disabled={!x.total || x.calidadDato === "REVISION_TECNICA_REQUERIDA"} /></td>}
            <td className="text-xs">{x.rubro.replaceAll("_", " ")}{x.rubroOriginal && <div className="text-gris">{x.rubroOriginal}</div>}</td>
            <td>{x.descripcion}<div className="text-[11px] text-gris">{x.fuente}</div></td>
            <td className="text-xs">{x.unidad?.identificador ? `Unidad ${x.unidad.identificador}` : x.sector ?? "Edificio"}</td>
            <td className="num">{x.cantidad?.toString() ?? "—"} {x.unidadMedida}</td>
            <td className="num"><Dinero v={x.precioUnitario} m={m} /></td>
            <td className="num"><Dinero v={x.total} m={m} /></td>
            {etapa === "ESTIMADO" && <td className="num text-xs">{x.precioBajo?.toString() ?? "—"} – {x.precioAlto?.toString() ?? "—"}</td>}
            <td><Estado v={x.calidadDato} />{x.confianza && <div className="text-[11px] text-gris">lectura: {x.confianza}</div>}</td>
          </tr>
        ))}</tbody></table>
    );
  };

  return (
    <>
      <Titulo eyebrow={`${p.propiedad.sociedad.razonSocial} · ${p.propiedad.nombre}`} acciones={<Estado v={p.estado} />}>{p.codigo} — {p.objetivo}</Titulo>
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <KPI etiqueta="1 · Presupuesto estimado (objetivo)" valor={<Dinero v={e.estimado.objetivo} m={m} />} nota={`Rango ${e.estimado.bajo.toString()} – ${e.estimado.alto.toString()} · ${e.estimado.revision} a revisar · ${e.estimado.faltantes} sin precio. Sin contingencia.`} />
        <KPI etiqueta="2 · Cotización de proveedor" valor={<Dinero v={e.cotizacion.total} m={m} />} nota={`${e.cotizacion.partidas} partida(s) recibidas`} />
        <KPI etiqueta="3 · Presupuesto aprobado" valor={e.aprobado.total ? <Dinero v={e.aprobado.total} m={m} /> : "No aprobado"} nota={p.fechaAprobacion ? `Aprobado el ${aISO(p.fechaAprobacion)}` : "Requiere aprobación explícita"} />
        <KPI etiqueta="4 · Órdenes de trabajo" valor={e.ordenes} />
        <KPI etiqueta="5 · Gasto ejecutado" valor={<Dinero v={e.ejecutado} m={m} />} nota={e.desviacion?.pct != null ? `Desvío ${e.desviacion.pct.toString()} % vs aprobado` : undefined} />
        <KPI etiqueta="6 · Pagado (con comprobante)" valor={<Dinero v={e.pagado} m={m} />} nota={`Pendiente de pago: ${e.pendienteDePago.toString()}`} />
        <KPI etiqueta="7 · Costo final" valor={e.costoFinal ? <Dinero v={e.costoFinal} m={m} /> : "—"} nota="Solo al finalizar el proyecto" />
      </div>
      <p className="mt-2 text-xs text-gris">Cada etapa es independiente: un estimado no es una cotización, una cotización no es una contratación aprobada y un presupuesto no es un gasto ejecutado.</p>

      <Tarjeta titulo={`Alcance por unidad / sector (${p.alcances.length} ítems)`} className="mt-6">
        {p.alcances.length === 0 ? <Vacio>Sin checklist importado.</Vacio> : (
          <details><summary className="cursor-pointer text-sm">{alcancePorSector.map(([k, n]) => `${k}: ${n}`).join(" · ")}</summary>
            <table className="tabla mt-2"><thead><tr><th>Destino</th><th>Ítem</th><th>Nota</th><th>Fuente</th></tr></thead>
              <tbody>{p.alcances.map((a) => <tr key={a.id}><td>{a.unidad ? `Unidad ${a.unidad.identificador}` : <span>{a.sector} <span className="text-[11px] text-gris">(sector común / sin vincular)</span></span>}</td><td>{a.item}</td><td className="text-xs">{a.nota}</td><td className="text-[11px] text-gris">{a.fuente}</td></tr>)}</tbody></table>
          </details>
        )}
      </Tarjeta>

      <Tarjeta titulo="1 · Presupuesto estimado" className="mt-6"><TablaPartidas etapa="ESTIMADO" seleccionable={false} /></Tarjeta>
      <Tarjeta titulo="2 · Cotizaciones de proveedor" className="mt-6"><TablaPartidas etapa="COTIZACION_PROVEEDOR" /></Tarjeta>

      {aprueba && editable && (p.partidas.some((x) => x.etapa !== "APROBADO")) && (
        <form action={aprobar} className="mt-6">
          <input type="hidden" name="id" value={id} />
          <Tarjeta titulo="3 · Aprobar presupuesto (acción explícita)">
            <p className="mb-2 text-xs text-gris">Seleccione las partidas que se contratan. Las partidas sin precio o con revisión técnica pendiente no se pueden aprobar.</p>
            <TablaPartidas etapa="COTIZACION_PROVEEDOR" seleccionable />
            <details className="mt-2"><summary className="cursor-pointer text-sm">Aprobar partidas del estimado</summary><TablaPartidas etapa="ESTIMADO" seleccionable /></details>
            <label className="campo mt-3">Motivo / referencia de la aprobación *<input name="motivo" required placeholder="Ej.: aprobado por el propietario por mensaje del …" /></label>
            <button className="btn btn-cta mt-3">Aprobar partidas seleccionadas</button>
          </Tarjeta>
        </form>
      )}
      {partidas("APROBADO").length > 0 && <Tarjeta titulo="3 · Presupuesto aprobado" className="mt-6"><TablaPartidas etapa="APROBADO" /></Tarjeta>}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo="4 · Órdenes de trabajo">
          {p.ordenes.length === 0 ? <Vacio>Sin órdenes.</Vacio> : <ul className="space-y-1 text-sm">{p.ordenes.map((o) => <li key={o.id}>{o.descripcion} · {o.unidad ? `U. ${o.unidad.identificador}` : o.sector ?? "edificio"} · {o.proveedor?.nombre ?? "sin proveedor"} <Estado v={o.estado} /></li>)}</ul>}
          {gestiona && (p.estado === "APROBADO" || p.estado === "EN_EJECUCION") && (
            <form action={orden} className="mt-3 grid gap-2 md:grid-cols-2">
              <input type="hidden" name="id" value={id} />
              <label className="campo md:col-span-2">Descripción<input name="descripcion" required /></label>
              <label className="campo">Rubro<select name="categoria"><option value="AGUA_SANITARIA">Agua/Sanitaria</option><option value="ELECTRICIDAD">Electricidad</option><option value="PINTURA">Pintura</option><option value="OBRA_CIVIL">Construcción/Obra civil</option><option value="VARIOS">Varios</option></select></label>
              <label className="campo">Proveedor<input name="proveedor" /></label>
              <label className="campo">Sector / unidad<input name="sector" /></label>
              <label className="campo">Costo estimado<input name="costoEstimado" pattern="\d+(\.\d{1,2})?" /></label>
              <div><button className="btn btn-sec">Emitir orden</button></div>
            </form>
          )}
        </Tarjeta>
        <Tarjeta titulo="5–6 · Gastos ejecutados y comprobantes de pago">
          {p.egresos.length === 0 ? <Vacio>Sin gastos ejecutados.</Vacio> : (
            <table className="tabla"><thead><tr><th>Fecha</th><th>Descripción</th><th className="num">Importe</th><th>Pago</th></tr></thead>
              <tbody>{p.egresos.map((g) => <tr key={g.id}><td><Fecha v={g.fecha} /></td><td>{g.descripcion}<div className="text-[11px] text-gris">{g.proveedor?.nombre ?? ""} {g.comprobante ?? ""} {g.documentoComprobanteId && <a className="underline" href={`/api/documentos/${g.documentoComprobanteId}`}>comprobante</a>}</div></td><td className="num"><Dinero v={g.importe} m={g.moneda} /></td>
                <td>{g.pagado ? <span className="text-xs">pagado <Fecha v={g.fechaPagoEgreso} /></span> : puede(s, "APROBAR_GASTO", p.sociedadId) ? <form action={pagado} className="flex flex-col gap-1"><input type="hidden" name="id" value={id} /><input type="hidden" name="egresoId" value={g.id} /><input type="date" name="fechaPago" required defaultValue={aISO(hoyAsuncion())} className="rounded border border-linea px-1 text-xs" /><input type="file" name="archivo" className="text-xs" /><button className="btn btn-sec">Marcar pagado</button></form> : <Estado v="PENDIENTE" />}</td></tr>)}</tbody></table>
          )}
          {gestiona && (p.estado === "APROBADO" || p.estado === "EN_EJECUCION") && (
            <form action={gasto} className="mt-3 grid gap-2 md:grid-cols-2">
              <input type="hidden" name="id" value={id} />
              <label className="campo md:col-span-2">Descripción<input name="descripcion" required /></label>
              <label className="campo">Importe *<input name="importe" required pattern="\d+(\.\d{1,2})?" /></label>
              <label className="campo">Fecha<input type="date" name="fecha" required defaultValue={aISO(hoyAsuncion())} /></label>
              <label className="campo">Orden de trabajo<select name="ordenTrabajoId"><option value="">—</option>{p.ordenes.map((o) => <option key={o.id} value={o.id}>{o.descripcion}</option>)}</select></label>
              <label className="campo">Nº factura / recibo<input name="comprobante" /></label>
              <label className="campo">Proveedor<input name="proveedor" /></label>
              <label className="campo">Factura del proveedor (archivo)<input type="file" name="archivo" /></label>
              <div><button className="btn btn-sec">Registrar gasto ejecutado</button></div>
            </form>
          )}
          {aprueba && p.estado === "EN_EJECUCION" && <form action={finalizar} className="mt-4 flex gap-2"><input type="hidden" name="id" value={id} /><input name="motivo" required placeholder="Motivo / acta de recepción" className="flex-1 rounded border border-linea px-2 text-sm" /><button className="btn btn-sec">Finalizar (fija costo final)</button></form>}
        </Tarjeta>
      </div>

      {gestiona && editable && (
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Tarjeta titulo="Importar checklist de alcance">
            <form action={subirChecklist} className="space-y-2">
              <input type="hidden" name="id" value={id} />
              <input type="file" name="archivo" accept=".xlsx" required className="text-sm" />
              <label className="campo">Vínculos manuales de sector (uno por línea, ej. <code>Local 1=Salon</code>)<textarea name="mapeo" rows={2} /></label>
              <button className="btn btn-sec">Importar</button>
            </form>
          </Tarjeta>
          <Tarjeta titulo="Importar presupuesto / cotización (Excel)">
            <form action={subirPresupuesto} className="space-y-2"><input type="hidden" name="id" value={id} /><input type="file" name="archivo" accept=".xlsx" required className="text-sm" /><p className="text-xs text-gris">Precios bajo/objetivo/alto se cargan como ESTIMADO; ofertas de proveedor como COTIZACIÓN. Nada queda aprobado.</p><button className="btn btn-sec">Importar</button></form>
          </Tarjeta>
          <Tarjeta titulo="Cargar cotización manual">
            <form action={nuevaPartida} className="grid gap-2 md:grid-cols-2">
              <input type="hidden" name="id" value={id} />
              <label className="campo">Etapa<select name="etapa"><option value="COTIZACION_PROVEEDOR">Cotización de proveedor</option><option value="ESTIMADO">Estimado</option></select></label>
              <label className="campo">Tipo<select name="tipo"><option value="MANO_DE_OBRA">Mano de obra</option><option value="MATERIAL">Material</option><option value="SUBCONTRATO">Subcontrato</option><option value="EQUIPO">Equipo</option><option value="CONTINGENCIA">Contingencia</option></select></label>
              <label className="campo md:col-span-2">Descripción<input name="descripcion" required /></label>
              <label className="campo">Cantidad<input name="cantidad" /></label>
              <label className="campo">Unitario<input name="precioUnitario" pattern="\d+(\.\d{1,2})?" /></label>
              <label className="campo">Proveedor<input name="proveedor" /></label>
              <label className="campo">Sector / unidad<input name="sector" /></label>
              <label className="campo md:col-span-2">Fuente *<input name="fuente" required placeholder="Cotización nº…, fecha, medio" /></label>
              <div><button className="btn btn-sec">Agregar</button></div>
            </form>
          </Tarjeta>
        </div>
      )}
      {p.descripcion && <Tarjeta titulo="Notas y criterios de la fuente" className="mt-6"><pre className="whitespace-pre-wrap font-sans text-xs text-gris">{p.descripcion}</pre></Tarjeta>}
    </>
  );
}
