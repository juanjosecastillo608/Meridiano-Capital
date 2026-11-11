import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarUsuarios, crearUsuario, desactivarUsuario } from "@/server/services/control";
import { listarSociedades } from "@/server/services/nucleo";
import { puede } from "@/server/authz";
import { ErrorNegocio } from "@/server/db";
import { Titulo, Tarjeta, Aviso, Estado, Fecha } from "@/components/ui";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  try {
    await crearUsuario(s, { email: v("email")!, nombre: v("nombre")!, password: String(form.get("password") ?? ""), rol: v("rol") as "PROPIETARIO_CONSULTA", sociedadId: v("sociedadId") });
  } catch (e) {
    if (e instanceof ErrorNegocio || (e as Error).name === "ZodError") redirect(`/usuarios?error=${encodeURIComponent((e as Error).message.slice(0, 200))}`);
    throw e;
  }
  redirect("/usuarios?ok=1");
}

async function desactivar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  await desactivarUsuario(s, String(form.get("usuarioId")), "Desactivado desde la administración de usuarios");
  redirect("/usuarios");
}

export default async function Usuarios({ searchParams }: { searchParams: Promise<{ error?: string; ok?: string }> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  if (!puede(s, "ADMIN_USUARIOS")) return <Aviso tipo="error">Solo el superadministrador de Meridiano Capital administra usuarios.</Aviso>;
  const [us, socs] = await Promise.all([listarUsuarios(s), listarSociedades(s)]);
  return (
    <>
      <Titulo eyebrow="Seguridad">Usuarios y permisos</Titulo>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {sp.ok && <div className="mb-4"><Aviso>Usuario creado. Comunique la contraseña por un canal seguro y pida cambiarla.</Aviso></div>}
      <Tarjeta>
        <table className="tabla"><thead><tr><th>Usuario</th><th>Roles y alcance</th><th>Último acceso</th><th>Estado</th><th></th></tr></thead>
          <tbody>{us.map((u) => <tr key={u.id}><td>{u.nombre}<div className="text-xs text-gris">{u.email}</div></td><td className="text-xs">{u.asignaciones.map((a) => <div key={a.id}>{a.rol.replaceAll("_", " ")} — {a.sociedad?.razonSocial ?? "todas las sociedades"}</div>)}</td><td><Fecha v={u.ultimoAcceso} /></td><td><Estado v={u.activo ? "VIGENTE" : "ANULADA"} /></td><td>{u.activo && u.id !== s.usuarioId && <form action={desactivar}><input type="hidden" name="usuarioId" value={u.id} /><button className="text-xs underline">Desactivar</button></form>}</td></tr>)}</tbody></table>
      </Tarjeta>
      <Tarjeta titulo="Nuevo usuario" className="mt-6">
        <form action={crear} className="grid gap-2 md:grid-cols-3">
          <label className="campo">Nombre<input name="nombre" required /></label>
          <label className="campo">Email<input name="email" type="email" required /></label>
          <label className="campo">Contraseña inicial (mín. 12)<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label>
          <label className="campo">Rol<select name="rol">
            <option value="PROPIETARIO_CONSULTA">Propietario — consulta (solo su sociedad)</option>
            <option value="ADMIN_SOCIEDAD">Administrador de sociedad</option>
            <option value="RESPONSABLE_PROPIEDAD">Responsable de propiedad</option>
            <option value="COBRANZAS">Encargado de cobranzas</option>
            <option value="FACTURACION">Responsable de facturación</option>
            <option value="MANTENIMIENTO">Responsable de mantenimiento</option>
            <option value="AUDITOR">Auditor (solo lectura)</option>
            <option value="ADMIN_GENERAL">Administrador general (todas)</option>
            <option value="SUPERADMIN">Superadministrador (todas)</option>
          </select></label>
          <label className="campo">Sociedad<select name="sociedadId"><option value="">— global (solo roles globales) —</option>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
          <div className="flex items-end"><button className="btn">Crear usuario</button></div>
        </form>
      </Tarjeta>
    </>
  );
}
