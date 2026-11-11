import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarProyectos, crearProyecto } from "@/server/services/remodelaciones";
import { listarPropiedades } from "@/server/services/nucleo";
import { alcance, puede } from "@/server/authz";
import { Titulo, Tarjeta, Vacio, Estado, Dinero } from "@/components/ui";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  const p = await crearProyecto(s, { propiedadId: v("propiedadId")!, codigo: v("codigo")!.toUpperCase(), objetivo: v("objetivo")!, descripcion: v("descripcion") });
  redirect(`/remodelaciones/${p.id}`);
}

export default async function Remodelaciones() {
  const s = await requerirSesion();
  const [ps, props] = await Promise.all([listarProyectos(s), listarPropiedades(s)]);
  const a = alcance(s);
  const crea = a.global ? puede(s, "GESTIONAR_REMODELACIONES") : a.sociedadIds.some((id) => puede(s, "GESTIONAR_REMODELACIONES", id));
  return (
    <>
      <Titulo eyebrow="Obras">Remodelaciones y presupuestos</Titulo>
      {ps.length === 0 ? <Vacio>Sin proyectos.</Vacio> : (
        <Tarjeta>
          <table className="tabla"><thead><tr><th>Código</th><th>Edificio</th><th>Objetivo</th><th>Estado</th><th className="num">Presupuesto aprobado</th><th className="num">Partidas</th><th className="num">Ítems de alcance</th><th className="num">Gastos</th></tr></thead>
            <tbody>{ps.map((p) => <tr key={p.id}><td><Link className="font-medium hover:underline" href={`/remodelaciones/${p.id}`}>{p.codigo}</Link></td><td>{p.propiedad.codigo}</td><td>{p.objetivo}</td><td><Estado v={p.estado} /></td><td className="num">{p.presupuestoAprobado ? <Dinero v={p.presupuestoAprobado} m={p.moneda} /> : <span className="text-gris">no aprobado</span>}</td><td className="num">{p._count.partidas}</td><td className="num">{p._count.alcances}</td><td className="num">{p._count.egresos}</td></tr>)}</tbody></table>
        </Tarjeta>
      )}
      {crea && (
        <Tarjeta titulo="Nuevo proyecto" className="mt-6">
          <form action={crear} className="grid gap-2 md:grid-cols-4">
            <label className="campo">Edificio<select name="propiedadId" required>{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
            <label className="campo">Código<input name="codigo" required placeholder="FRM-REM-2026-01" /></label>
            <label className="campo md:col-span-2">Objetivo<input name="objetivo" required /></label>
            <div><button className="btn">Crear</button></div>
          </form>
        </Tarjeta>
      )}
    </>
  );
}
