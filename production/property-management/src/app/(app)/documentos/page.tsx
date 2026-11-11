import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { listarDocumentos, subirDocumento, listarRepresentantes, registrarRepresentante, vencimientosDocumentales, TIPOS } from "@/server/services/documentos";
import { puede } from "@/server/authz";
import { ErrorNegocio } from "@/server/db";
import { Titulo, Tarjeta, Vacio, Fecha, Aviso, Estado } from "@/components/ui";

async function subir(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  const f = form.get("archivo") as File | null;
  if (!f || !f.size) redirect("/documentos?error=Seleccione un archivo");
  try {
    await subirDocumento(s, { sociedadId: v("sociedadId")!, propiedadId: v("propiedadId"), tipo: v("tipo") as "OTRO", titulo: v("titulo")!, fechaEmision: v("fechaEmision"), fechaVencimiento: v("fechaVencimiento"), sensible: form.get("sensible") === "on" ? true : undefined, observaciones: v("observaciones") }, f.name, Buffer.from(await f.arrayBuffer()));
  } catch (e) {
    if (e instanceof ErrorNegocio) redirect(`/documentos?error=${encodeURIComponent(e.message)}`);
    throw e;
  }
  revalidatePath("/documentos");
}

async function representante(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  await registrarRepresentante(s, { sociedadId: v("sociedadId")!, nombre: v("nombre")!, cargo: v("cargo")!, facultades: v("facultades"), documentoId: v("documentoId"), vigenteDesde: v("vigenteDesde"), vigenteHasta: v("vigenteHasta") });
  revalidatePath("/documentos");
}

export default async function Documentos({ searchParams }: { searchParams: Promise<{ sociedadId?: string; error?: string }> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  const sociedadId = socs.some((x) => x.id === sp.sociedadId) ? sp.sociedadId! : socs[0]?.id;
  if (!sociedadId) return <Vacio>Sin sociedades.</Vacio>;
  const [{ documentos, ocultos }, props, reps, venc] = await Promise.all([listarDocumentos(s, { sociedadId }), listarPropiedades(s, sociedadId), listarRepresentantes(s, sociedadId), vencimientosDocumentales(s)]);
  const gestiona = puede(s, "GESTIONAR_DOCUMENTOS", sociedadId);
  const sensibles = puede(s, "VER_DOCUMENTOS_SENSIBLES", sociedadId);
  const soc = socs.find((x) => x.id === sociedadId)!;
  return (
    <>
      <Titulo eyebrow="Expediente digital">{soc.razonSocial}</Titulo>
      {socs.length > 1 && <form className="mb-4 flex gap-2"><select name="sociedadId" defaultValue={sociedadId} className="rounded border border-linea px-2 py-1 text-sm">{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select><button className="btn btn-sec">Ver</button></form>}
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {venc.length > 0 && <div className="mb-4 space-y-1">{venc.map((v, i) => <Aviso key={i} tipo={v.dias < 0 ? "error" : "alerta"}>{v.tipo} “{v.titulo}” {v.dias < 0 ? `vencido hace ${-v.dias} días` : `vence en ${v.dias} días`} (<Fecha v={v.vence} />).</Aviso>)}</div>}

      <Tarjeta titulo={`Documentos (${documentos.length})`}>
        {documentos.length === 0 ? <Vacio>Sin documentos cargados.</Vacio> : (
          <table className="tabla"><thead><tr><th>Tipo</th><th>Título</th><th>Ámbito</th><th>Emisión</th><th>Vencimiento</th><th>Acceso</th><th>Archivo</th></tr></thead>
            <tbody>{documentos.map((d) => <tr key={d.id}><td className="text-xs">{d.tipo.replaceAll("_", " ")}</td><td>{d.titulo ?? d.nombreArchivo}{d.observaciones && <div className="text-[11px] text-gris">{d.observaciones}</div>}</td><td className="text-xs">{d.propiedad ? `${d.propiedad.codigo}` : "Sociedad"}{d.entidad !== "EXPEDIENTE" ? ` · ${d.entidad.toLowerCase()}` : ""}</td><td><Fecha v={d.fechaEmision} /></td><td><Fecha v={d.fechaVencimiento} /></td><td>{d.sensible ? <Estado v="RESTRINGIDO" /> : <span className="text-xs text-gris">general</span>}</td><td><a className="underline" href={`/api/documentos/${d.id}`} target="_blank">abrir</a> <span className="text-[11px] text-gris">{(d.tamanoBytes / 1024).toFixed(0)} KB</span></td></tr>)}</tbody></table>
        )}
        {ocultos > 0 && <p className="mt-2 text-xs text-gris">{ocultos} documento(s) sensibles no visibles con su permiso.</p>}
      </Tarjeta>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo="Representantes y apoderados">
          {reps === null ? <Vacio>Requiere permiso de documentos sensibles.</Vacio> : reps.length === 0 ? <Vacio>Sin representantes registrados. El poder de la sociedad aún no fue incorporado.</Vacio> : (
            <table className="tabla"><thead><tr><th>Nombre</th><th>Cargo</th><th>Vigencia</th><th>Respaldo</th></tr></thead>
              <tbody>{reps.map((r) => <tr key={r.id}><td>{r.nombre}</td><td>{r.cargo}</td><td><Fecha v={r.vigenteDesde} /> → <Fecha v={r.vigenteHasta} /></td><td><Estado v={r.estadoDato} /></td></tr>)}</tbody></table>
          )}
          {gestiona && sensibles && (
            <form action={representante} className="mt-4 grid gap-2 md:grid-cols-3">
              <input type="hidden" name="sociedadId" value={sociedadId} />
              <label className="campo">Nombre<input name="nombre" required /></label>
              <label className="campo">Cargo<input name="cargo" required placeholder="APODERADO" /></label>
              <label className="campo">Documento respaldatorio<select name="documentoId"><option value="">—</option>{documentos.filter((d) => d.tipo === "PODER" || d.tipo === "ACTA" || d.tipo === "ESTATUTO").map((d) => <option key={d.id} value={d.id}>{d.titulo}</option>)}</select></label>
              <label className="campo">Vigente desde<input type="date" name="vigenteDesde" /></label>
              <label className="campo">Vigente hasta<input type="date" name="vigenteHasta" /></label>
              <div className="flex items-end"><button className="btn btn-sec">Registrar</button></div>
            </form>
          )}
        </Tarjeta>
        {gestiona && (
          <Tarjeta titulo="Incorporar documento">
            <form action={subir} className="grid gap-2 md:grid-cols-2">
              <input type="hidden" name="sociedadId" value={sociedadId} />
              <label className="campo">Tipo<select name="tipo">{TIPOS.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}</select></label>
              <label className="campo">Edificio (opcional)<select name="propiedadId"><option value="">— Sociedad —</option>{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
              <label className="campo md:col-span-2">Título<input name="titulo" required /></label>
              <label className="campo">Fecha de emisión<input type="date" name="fechaEmision" /></label>
              <label className="campo">Fecha de vencimiento<input type="date" name="fechaVencimiento" /></label>
              <label className="campo md:col-span-2">Archivo (PDF, JPG, PNG, XLSX, DOCX — máx. 25 MB)<input type="file" name="archivo" required /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="sensible" /> Sensible (poderes, actas y estatutos lo son por defecto)</label>
              <div><button className="btn">Subir</button></div>
            </form>
          </Tarjeta>
        )}
      </div>
    </>
  );
}
