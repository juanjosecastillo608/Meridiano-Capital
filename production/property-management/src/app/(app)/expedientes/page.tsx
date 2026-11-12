import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { protegido } from "@/lib/acceso";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { expedientesPropiedad } from "@/server/services/expedientes";
import { Titulo, Tarjeta, Estado, Dinero, Vacio, KPI } from "@/components/ui";

export default async function Expedientes({ searchParams }: { searchParams: Promise<{ propiedadId?: string }> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  const props = (await Promise.all(socs.map((x) => listarPropiedades(s, x.id)))).flat();
  const propiedadId = props.some((p) => p.id === sp.propiedadId) ? sp.propiedadId! : props[0]?.id;
  if (!propiedadId) return <Vacio>Sin edificios.</Vacio>;
  const ex = await protegido(() => expedientesPropiedad(s, propiedadId));
  const ocupadas = ex.filter((e) => e.situacion === "OCUPADA");
  const faltas = new Map<string, number>();
  for (const e of ocupadas) for (const i of e.items) if (i.estado === "FALTA" && i.bloqueaContrato) faltas.set(i.etiqueta.replace(/ — .*/, ""), (faltas.get(i.etiqueta.replace(/ — .*/, "")) ?? 0) + 1);
  return (
    <>
      <Titulo eyebrow="Conciliación planillas ↔ ocupantes actuales" acciones={<a className="btn btn-sec" href={`/api/exportar/expedientes?propiedadId=${propiedadId}`}>Exportar checklist (Excel)</a>}>Expedientes por inquilino</Titulo>
      <form className="mb-4 flex gap-2"><select name="propiedadId" defaultValue={propiedadId} className="rounded border border-linea px-2 py-1 text-sm">{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select><button className="btn btn-sec">Ver</button></form>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KPI etiqueta="Unidades" valor={ex.length} />
        <KPI etiqueta="Ocupadas (último período)" valor={ocupadas.length} />
        <KPI etiqueta="Listas para borrador" valor={ocupadas.filter((e) => e.resumen.listoParaBorrador).length} nota="Canon validado + configuración" />
        <KPI etiqueta="Listas para contrato real" valor={ocupadas.filter((e) => e.resumen.listoParaContratoReal).length} nota="Sin datos faltantes que bloqueen" />
        <KPI etiqueta="Alertas" valor={ex.reduce((a, e) => a + e.resumen.alerta, 0)} />
      </div>
      <Tarjeta titulo="Unidades">
        <table className="tabla">
          <thead><tr><th>Unidad</th><th>Situación</th><th>Inquilino actual</th><th className="num">Canon (IVA incl.)</th><th className="num">OK</th><th className="num">Falta</th><th className="num">Alertas</th><th>Borrador</th><th>Contrato real</th></tr></thead>
          <tbody>{ex.map((e) => (
            <tr key={e.unidadId}>
              <td><Link className="font-medium hover:underline" href={`/expedientes/${e.unidadId}`}>{e.unidad}</Link></td>
              <td><Estado v={e.situacion === "OCUPADA" ? "OCUPADA" : e.situacion === "VACANTE" ? "DISPONIBLE" : e.situacion === "LOCAL" ? "INFO" : "ADVERTENCIA"} /></td>
              <td>{e.inquilinos.map((i) => i.nombre).join(", ") || "—"}</td>
              <td className="num">{e.canon ? <Dinero v={e.canon} m={e.moneda} /> : "—"}</td>
              <td className="num">{e.resumen.ok}</td>
              <td className="num">{e.resumen.falta ? <span className="text-tierra">{e.resumen.falta}</span> : 0}</td>
              <td className="num">{e.resumen.alerta ? <span className="text-dorado-d">{e.resumen.alerta}</span> : 0}</td>
              <td>{e.situacion === "OCUPADA" ? <Estado v={e.resumen.listoParaBorrador ? "OK" : "PENDIENTE"} /> : "—"}</td>
              <td>{e.situacion === "OCUPADA" ? <Estado v={e.resumen.listoParaContratoReal ? "OK" : "PENDIENTE"} /> : "—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </Tarjeta>
      {faltas.size > 0 && (
        <Tarjeta titulo="Qué falta para los contratos reales (unidades ocupadas)" className="mt-6">
          <ul className="grid gap-1 text-sm md:grid-cols-2">{[...faltas.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => <li key={k}><b>{n}</b> × {k}</li>)}</ul>
        </Tarjeta>
      )}
    </>
  );
}
