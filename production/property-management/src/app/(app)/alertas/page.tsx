import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { alertas } from "@/server/services/control";
import { Titulo, Tarjeta, Vacio, Estado } from "@/components/ui";

export default async function Alertas() {
  const s = await requerirSesion();
  const as = await alertas(s);
  const cats = [...new Set(as.map((a) => a.categoria))];
  return (
    <>
      <Titulo eyebrow="Control de calidad del dato">Alertas: información faltante e inconsistencias</Titulo>
      {as.length === 0 ? <Vacio>Sin alertas.</Vacio> : cats.map((c) => (
        <Tarjeta key={c} titulo={`${c} (${as.filter((a) => a.categoria === c).length})`} className="mb-4">
          <ul className="space-y-1.5 text-sm">{as.filter((a) => a.categoria === c).map((a, i) => <li key={i} className="flex items-start gap-2"><Estado v={a.nivel} /><span>{a.href ? <Link className="hover:underline" href={a.href}>{a.mensaje}</Link> : a.mensaje}</span></li>)}</ul>
        </Tarjeta>
      ))}
    </>
  );
}
