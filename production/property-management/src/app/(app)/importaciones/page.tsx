import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarImportaciones, analizarArchivo } from "@/server/services/importacion";
import { listarSociedades } from "@/server/services/nucleo";
import { ErrorNegocio } from "@/server/db";
import { Estado, Fecha, Tarjeta, Titulo, Vacio, Aviso } from "@/components/ui";

async function subir(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const f = form.get("archivo") as File | null;
  if (!f || !f.size) redirect("/importaciones?error=Seleccione un archivo");
  let id: string;
  try {
    const { batch } = await analizarArchivo(s, String(form.get("sociedadId")), f.name, Buffer.from(await f.arrayBuffer()));
    id = batch.id;
  } catch (e) {
    if (e instanceof ErrorNegocio) redirect(`/importaciones?error=${encodeURIComponent(e.message)}`);
    throw e;
  }
  redirect(`/importaciones/${id}`);
}

export default async function Importaciones({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const s = await requerirSesion();
  const [lista, socs] = await Promise.all([listarImportaciones(s), listarSociedades(s)]);
  return (
    <>
      <Titulo eyebrow="Módulo prioritario">Importación de Excel</Titulo>
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      <Tarjeta titulo="1 · Subir archivo (no se guarda ningún dato de negocio hasta su confirmación)" className="mb-6">
        <form action={subir} className="flex flex-wrap items-end gap-3">
          <label className="campo">Sociedad<select name="sociedadId" required>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
          <label className="campo">Archivo .xlsx<input type="file" name="archivo" accept=".xlsx" required /></label>
          <button className="btn">Analizar</button>
        </form>
        <p className="mt-3 text-xs text-gris">El sistema lee todas las hojas, detecta encabezados, fórmulas y períodos, propone el mapeo de columnas, valida y reporta duplicados e inconsistencias. El archivo original se conserva (con su hash SHA-256) en almacenamiento privado.</p>
      </Tarjeta>
      {lista.length === 0 ? <Vacio>Sin importaciones.</Vacio> : (
        <Tarjeta titulo="Historial de importaciones">
          <table className="tabla"><thead><tr><th>Archivo</th><th>Sociedad</th><th>Estado</th><th>Creada</th><th>Confirmada</th></tr></thead>
            <tbody>{lista.map((b) => <tr key={b.id}><td><Link className="font-medium hover:underline" href={`/importaciones/${b.id}`}>{b.nombreArchivo}</Link></td><td>{b.sociedad?.razonSocial}</td><td><Estado v={b.estado} /></td><td><Fecha v={b.createdAt} /></td><td><Fecha v={b.confirmadoAt} /></td></tr>)}</tbody></table>
        </Tarjeta>
      )}
    </>
  );
}
