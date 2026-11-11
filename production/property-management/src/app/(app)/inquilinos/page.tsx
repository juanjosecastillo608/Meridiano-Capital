import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requerirSesion } from "@/lib/sesion";
import { listarPersonas, crearPersona, listarSociedades } from "@/server/services/nucleo";
import { Estado, Titulo, Vacio, Tarjeta } from "@/components/ui";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  await crearPersona(s, v("sociedadId")!, { tipo: v("tipo") as "FISICA", nombre: v("nombre")!, documentoTipo: v("documentoTipo") as "CI" | null, documentoNumero: v("documentoNumero"), telefono: v("telefono"), email: v("email") });
  revalidatePath("/inquilinos");
}

export default async function Inquilinos({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const s = await requerirSesion();
  const [ps, socs] = await Promise.all([listarPersonas(s, q), listarSociedades(s)]);
  return (
    <>
      <Titulo eyebrow="Personas físicas y jurídicas">Inquilinos y garantes</Titulo>
      <Tarjeta titulo="Alta de persona" className="mb-6">
        <form action={crear} className="grid gap-2 md:grid-cols-7">
          <label className="campo">Sociedad<select name="sociedadId" required>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
          <label className="campo">Tipo<select name="tipo"><option value="FISICA">Física</option><option value="JURIDICA">Jurídica</option></select></label>
          <label className="campo md:col-span-2">Nombre / razón social<input name="nombre" required /></label>
          <label className="campo">Documento<select name="documentoTipo"><option value="CI">CI</option><option value="RUC">RUC</option><option value="PASAPORTE">Pasaporte</option></select></label>
          <label className="campo">Número<input name="documentoNumero" /></label>
          <div className="flex items-end"><button className="btn btn-sec">Agregar</button></div>
        </form>
        <p className="mt-2 text-xs text-gris">Se rechazan documentos ya registrados (sin importar puntos o prefijos) para evitar personas duplicadas.</p>
      </Tarjeta>
      {ps.length === 0 ? <Vacio>Sin personas visibles para su usuario.</Vacio> : (
        <Tarjeta>
          <table className="tabla">
            <thead><tr><th>Nombre</th><th>Documento</th><th>Contratos</th><th>Datos</th></tr></thead>
            <tbody>{ps.map((p) => (
              <tr key={p.id}>
                <td><Link className="font-medium hover:underline" href={`/inquilinos/${p.id}`}>{p.nombre}</Link></td>
                <td>{p.documentoNumero ? `${p.documentoTipo} ${p.documentoNumero}` : <span className="text-dorado-d">falta documento</span>}</td>
                <td className="text-xs">{p.partes.map((x) => `${x.contrato.codigo} (${x.rol.toLowerCase()})`).join(", ") || "—"}</td>
                <td><Estado v={p.estadoDato} /></td>
              </tr>
            ))}</tbody>
          </table>
        </Tarjeta>
      )}
    </>
  );
}
