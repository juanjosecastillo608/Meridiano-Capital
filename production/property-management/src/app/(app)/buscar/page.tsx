import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { buscar } from "@/server/services/consultas";
import { Titulo, Tarjeta, Vacio } from "@/components/ui";

export default async function Buscar({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const s = await requerirSesion();
  const r = await buscar(s, q);
  const total = r.sociedades.length + r.propiedades.length + r.unidades.length + r.personas.length + r.contratos.length;
  return (
    <>
      <Titulo eyebrow="Búsqueda global">“{q}”</Titulo>
      {total === 0 ? <Vacio>Sin resultados dentro de las sociedades a las que tiene acceso.</Vacio> : (
        <div className="grid gap-4 md:grid-cols-2">
          {r.sociedades.length > 0 && <Tarjeta titulo="Sociedades"><ul>{r.sociedades.map((x) => <li key={x.id}><Link className="hover:underline" href={`/sociedades/${x.id}`}>{x.razonSocial}</Link></li>)}</ul></Tarjeta>}
          {r.propiedades.length > 0 && <Tarjeta titulo="Propiedades"><ul>{r.propiedades.map((x) => <li key={x.id}><Link className="hover:underline" href={`/propiedades/${x.id}`}>{x.codigo} — {x.nombre}</Link></li>)}</ul></Tarjeta>}
          {r.unidades.length > 0 && <Tarjeta titulo="Unidades"><ul>{r.unidades.map((x) => <li key={x.id}><Link className="hover:underline" href={`/unidades/${x.id}`}>{x.propiedad.codigo} · {x.identificador}</Link></li>)}</ul></Tarjeta>}
          {r.personas.length > 0 && <Tarjeta titulo="Inquilinos"><ul>{r.personas.map((x) => <li key={x.id}><Link className="hover:underline" href={`/inquilinos/${x.id}`}>{x.nombre}</Link></li>)}</ul></Tarjeta>}
          {r.contratos.length > 0 && <Tarjeta titulo="Contratos"><ul>{r.contratos.map((x) => <li key={x.id}>{x.codigo}</li>)}</ul></Tarjeta>}
        </div>
      )}
    </>
  );
}
