import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { obtenerPropiedad } from "@/server/services/nucleo";
import { estadoOcupacion } from "@/domain/ocupacion";
import { hoyAsuncion } from "@/domain/periodo";
import { Dinero, Estado, Tarjeta, Titulo, Vacio, Fecha } from "@/components/ui";

export default async function Propiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requerirSesion();
  const p = await obtenerPropiedad(s, id);
  const hoy = hoyAsuncion();
  return (
    <>
      <Titulo eyebrow={`${p.sociedad.razonSocial} · ${p.codigo}`} acciones={<Link className="btn btn-sec" href={`/contratos/nueva?propiedadId=${p.id}`}>Nuevo contrato</Link>}>{p.nombre}</Titulo>
      <div className="mb-6 grid gap-3 text-sm md:grid-cols-4">
        <Tarjeta><div className="text-xs text-gris">Dirección</div>{p.direccion ?? "—"} {p.barrio ? `· ${p.barrio}` : ""} {p.ciudad ? `· ${p.ciudad}` : ""}</Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Cuenta receptora</div>{p.cuentaBancaria ? `${p.cuentaBancaria.banco} ${p.cuentaBancaria.numero}` : "—"}</Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Titularidad</div>{p.titularidades.map((t) => `${t.sociedad.razonSocial} ${t.porcentaje.toString()}%`).join(" · ")}</Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Valor estimado</div>{p.valorEstimado ? <><Dinero v={p.valorEstimado} m={p.valorEstimadoMoneda ?? "PYG"} /><div className="text-[11px] text-gris">{p.valorEstimadoFuente ?? "sin fuente: no se usa en rentabilidad"}</div></> : <span className="text-gris">no documentado</span>}</Tarjeta>
      </div>
      <Tarjeta titulo={`Unidades (${p.unidades.length})`}>
        {p.unidades.length === 0 ? <Vacio>Sin unidades.</Vacio> : (
          <table className="tabla">
            <thead><tr><th>Unidad</th><th>Tipo</th><th>Ocupación</th><th>Inquilino</th><th>Contrato</th><th className="num">Alquiler vigente</th><th>Vence</th><th>Datos</th></tr></thead>
            <tbody>
              {p.unidades.map((u) => {
                const cs = u.contratos.map((x) => x.contrato);
                const activos = cs.filter((c) => ["VIGENTE", "VENCIDO", "PENDIENTE_FIRMA"].includes(c.estado));
                const ultimo = activos[0] ?? cs.find((c) => c.estado === "BORRADOR");
                const occ = estadoOcupacion(u.estadoOperativo, cs.filter((c) => c.fechaInicio && c.fechaFin).map((c) => ({ estado: c.estado, fechaInicio: c.fechaInicio!, fechaFin: c.fechaFin!, fechaRescision: c.fechaRescision, fechaEntrega: c.fechaEntrega, fechaDevolucion: c.fechaDevolucion })), hoy);
                const inq = ultimo?.partes.filter((x) => x.rol === "INQUILINO").map((x) => x.persona) ?? [];
                return (
                  <tr key={u.id}>
                    <td><Link className="font-medium hover:underline" href={`/unidades/${u.id}`}>{u.identificador}</Link></td>
                    <td className="text-xs">{u.tipo.replaceAll("_", " ")}{u.dormitorios != null ? ` · ${u.dormitorios} dorm.` : ""}</td>
                    <td><Estado v={occ} /></td>
                    <td>{inq.length ? inq.map((x) => <Link key={x.id} className="hover:underline" href={`/inquilinos/${x.id}`}>{x.nombre}</Link>) : <span className="text-gris">—</span>}</td>
                    <td>{ultimo ? <><span className="text-xs">{ultimo.codigo}</span> <Estado v={ultimo.estado} /></> : "—"}</td>
                    <td className="num">{ultimo?.condiciones[0] ? <Dinero v={ultimo.condiciones[0].montoAlquiler} m={ultimo.moneda} /> : "—"}</td>
                    <td><Fecha v={ultimo?.fechaFin} /></td>
                    <td><Estado v={u.estadoDato} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-xs text-gris">La ocupación se deriva de contratos VIGENTES con fechas y de la entrega/devolución real. Un contrato BORRADOR (p. ej. importado sin contrato original) no marca la unidad como ocupada hasta completarse y activarse.</p>
      </Tarjeta>
    </>
  );
}
