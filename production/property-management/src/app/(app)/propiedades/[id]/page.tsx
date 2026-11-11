import { protegido } from "@/lib/acceso";
import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { obtenerPropiedad } from "@/server/services/nucleo";
import { saldosPropiedad } from "@/server/services/control";
import { listarDocumentos } from "@/server/services/documentos";
import { listarProyectos } from "@/server/services/remodelaciones";
import { puede } from "@/server/authz";
import { estadoOcupacion } from "@/domain/ocupacion";
import { hoyAsuncion } from "@/domain/periodo";
import { Dinero, Estado, Tarjeta, Titulo, Vacio, Fecha, Aviso } from "@/components/ui";

export default async function Propiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requerirSesion();
  const p = await protegido(() => obtenerPropiedad(s, id));
  const [saldos, docs, proyectos] = await Promise.all([saldosPropiedad(s, id), listarDocumentos(s, { sociedadId: p.sociedadId, propiedadId: id }), listarProyectos(s, { propiedadId: id })]);
  const hoy = hoyAsuncion();
  const deptos = p.unidades.filter((u) => u.tipo === "DEPARTAMENTO").length;
  const locales = p.unidades.filter((u) => u.tipo === "LOCAL_COMERCIAL").length;
  const difInventario = p.inventarioDeptosDeclarado != null && (deptos !== p.inventarioDeptosDeclarado || locales !== p.inventarioLocalesDeclarado);
  const m = "PYG";
  return (
    <>
      <Titulo eyebrow={`${p.sociedad.razonSocial} · ${p.codigo}`} acciones={puede(s, "GESTIONAR_CONTRATOS", p.sociedadId, p.id) && <Link className="btn btn-sec" href={`/contratos/nueva?propiedadId=${p.id}`}>Nuevo contrato</Link>}>{p.nombre}</Titulo>
      <div className="mb-6 grid gap-3 text-sm md:grid-cols-4">
        <Tarjeta><div className="text-xs text-gris">Inventario administrativo declarado</div>{p.inventarioDeptosDeclarado != null ? <>{p.inventarioDeptosDeclarado} deptos + {p.inventarioLocalesDeclarado} local(es)<div className="text-[11px] text-gris">Fuente: {p.inventarioFuente}</div></> : <span className="text-gris">no declarado</span>}<div className="mt-1 text-xs">Registrado: {deptos} deptos + {locales} local(es){p.unidades.length - deptos - locales ? ` + ${p.unidades.length - deptos - locales} otras` : ""}</div></Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Saldo del edificio</div>{Object.entries(saldos.total).length ? Object.entries(saldos.total).map(([mm, t]) => <div key={mm}><b><Dinero v={t.saldo} m={mm} /></b><div className="text-[11px] text-gris">vencido <Dinero v={t.vencido} m={mm} /> · pagos sin respaldo <Dinero v={t.sinRespaldo} m={mm} /></div></div>) : <span className="text-gris">sin obligaciones registradas</span>}</Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Dirección</div>{p.direccion ?? "—"} {p.ciudad ? `· ${p.ciudad}` : ""}<div className="text-xs text-gris">Cuenta receptora: {p.cuentaBancaria ? `${p.cuentaBancaria.banco} ${p.cuentaBancaria.numero}` : "—"}</div></Tarjeta>
        <Tarjeta><div className="text-xs text-gris">Documentos y obras</div>{docs.documentos.length} documento(s) · {proyectos.length} proyecto(s) de remodelación<div className="mt-1 text-xs"><Link className="underline" href={`/documentos?sociedadId=${p.sociedadId}`}>Expediente</Link> · <Link className="underline" href="/remodelaciones">Remodelaciones</Link></div></Tarjeta>
      </div>
      {difInventario && <div className="mb-4"><Aviso tipo="alerta">El inventario registrado no coincide con el declarado: conciliar con planillas, planos y situación física.</Aviso></div>}
      {p.unidades.length === 0 && <div className="mb-4"><Aviso tipo="alerta">No hay unidades registradas. Se crean al importar la planilla administrativa del edificio — no se inventan identificadores.</Aviso></div>}

      <Tarjeta titulo={`Unidades (${p.unidades.length})`}>
        {p.unidades.length === 0 ? <Vacio>Sin unidades.</Vacio> : (
          <table className="tabla">
            <thead><tr><th>Unidad</th><th>Tipo</th><th>Ocupación (contratos)</th><th>Declarada</th><th>Inquilino vinculado</th><th>Contrato</th><th className="num">Alquiler</th><th className="num">Saldo</th><th className="num">Vencido</th><th>Datos</th></tr></thead>
            <tbody>
              {p.unidades.map((u) => {
                const cs = u.contratos.map((x) => x.contrato);
                const ultimo = cs.find((c) => ["VIGENTE", "VENCIDO", "PENDIENTE_FIRMA"].includes(c.estado)) ?? cs.find((c) => c.estado === "BORRADOR");
                const occ = estadoOcupacion(u.estadoOperativo, cs.filter((c) => c.fechaInicio && c.fechaFin).map((c) => ({ estado: c.estado, fechaInicio: c.fechaInicio!, fechaFin: c.fechaFin!, fechaRescision: c.fechaRescision, fechaEntrega: c.fechaEntrega, fechaDevolucion: c.fechaDevolucion })), hoy);
                const inq = ultimo?.partes.filter((x) => x.rol === "INQUILINO").map((x) => x.persona) ?? [];
                const sal = saldos.porUnidad.get(u.id)?.[ultimo?.moneda ?? m];
                const contradice = u.ocupacionDeclarada === "VACANTE" && (occ === "OCUPADA" || inq.length > 0);
                return (
                  <tr key={u.id}>
                    <td><Link className="font-medium hover:underline" href={`/unidades/${u.id}`}>{u.identificador}</Link></td>
                    <td className="text-xs">{u.tipo.replaceAll("_", " ")}{u.dormitorios != null ? ` · ${u.dormitorios} dorm.` : ""}</td>
                    <td><Estado v={occ} /></td>
                    <td>{u.ocupacionDeclarada ? <><Estado v={u.ocupacionDeclarada === "VACANTE" ? "DISPONIBLE" : "OCUPADA"} />{contradice && <div className="text-[11px] text-tierra">contradice la planilla</div>}</> : <span className="text-gris">—</span>}</td>
                    <td>{inq.length ? inq.map((x) => <Link key={x.id} className="hover:underline" href={`/inquilinos/${x.id}`}>{x.nombre}</Link>) : <span className="text-gris">—</span>}</td>
                    <td>{ultimo ? <><span className="text-xs">{ultimo.codigo}</span> <Estado v={ultimo.estado} /></> : "—"}</td>
                    <td className="num">{ultimo?.condiciones[0] ? <Dinero v={ultimo.condiciones[0].montoAlquiler} m={ultimo.moneda} /> : "—"}</td>
                    <td className="num">{sal ? <Dinero v={sal.saldo} m={ultimo?.moneda ?? m} /> : "—"}</td>
                    <td className="num">{sal && !sal.vencido.isZero() ? <span className="text-tierra"><Dinero v={sal.vencido} m={ultimo?.moneda ?? m} /></span> : "—"}</td>
                    <td><Estado v={u.estadoDato} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-xs text-gris">“Ocupación (contratos)” se deriva solo de contratos VIGENTES con fechas. Un contrato BORRADOR (inquilino tomado de una planilla, sin contrato original) no marca la unidad como ocupada. “Declarada” es la situación informada por una fuente (p. ej. el founder) y se contrasta con la planilla.</p>
      </Tarjeta>
      <p className="mt-2 text-xs text-gris">Vencimientos: <Fecha v={hoy} /> como fecha de referencia (America/Asunción).</p>
    </>
  );
}
