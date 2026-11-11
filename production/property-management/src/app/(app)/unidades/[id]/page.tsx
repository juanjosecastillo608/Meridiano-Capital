import { protegido } from "@/lib/acceso";
import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { obtenerUnidad } from "@/server/services/nucleo";
import { estadoDeCuenta } from "@/server/services/finanzas";
import { Dinero, Estado, Fecha, Tarjeta, Titulo, Vacio, KPI } from "@/components/ui";
import { sumar } from "@/domain/money";

export default async function Unidad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requerirSesion();
  const u = await protegido(() => obtenerUnidad(s, id));
  const ec = await estadoDeCuenta(s, { unidadId: id });
  const contratos = u.contratos.map((x) => x.contrato).sort((a, b) => (b.fechaInicio?.getTime() ?? 0) - (a.fechaInicio?.getTime() ?? 0));
  const actual = contratos.find((c) => ["VIGENTE", "VENCIDO", "PENDIENTE_FIRMA"].includes(c.estado)) ?? contratos[0];
  const monedas = Object.keys(ec.porMoneda);
  const pagado = sumar(ec.obligaciones.flatMap((o) => o.aplicaciones.map((a) => a.importe.toString())));
  const mantenimiento = sumar(u.egresos.filter((e) => e.naturaleza === "OPEX").map((e) => e.importe.toString()));
  const ultimoPago = ec.pagos.filter((p) => p.estado === "REGISTRADO").at(-1);
  const m = actual?.moneda ?? "PYG";

  return (
    <>
      <Titulo eyebrow={`${u.propiedad.sociedad.razonSocial} · ${u.propiedad.nombre}`} acciones={<a className="btn btn-sec" href={`/api/exportar/estado-cuenta?unidadId=${id}`}>Exportar estado de cuenta (Excel)</a>}>
        Unidad {u.identificador}
      </Titulo>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KPI etiqueta="Inquilino" valor={<span className="text-base">{actual?.partes.filter((p) => p.rol === "INQUILINO").map((p) => p.persona.nombre).join(", ") || "—"}</span>} />
        <KPI etiqueta="Debe pagar (alquiler)" valor={actual?.condiciones.at(-1) ? <Dinero v={actual.condiciones.at(-1)!.montoAlquiler} m={m} /> : "—"} nota={actual ? `Contrato ${actual.codigo}` : undefined} />
        <KPI etiqueta="Pagó (total imputado)" valor={<Dinero v={pagado} m={m} />} />
        <KPI etiqueta="Último pago" valor={<Fecha v={ultimoPago?.fechaPago} />} nota={ultimoPago ? `${ultimoPago.moneda} ${ultimoPago.importe.toString()}` : undefined} />
        <KPI etiqueta="Saldo pendiente" valor={monedas.length ? monedas.map((mm) => <div key={mm}><Dinero v={ec.porMoneda[mm].deuda.total} m={mm} /></div>) : "—"} nota={monedas.map((mm) => `vencido ${ec.porMoneda[mm].vencido.toString()} ${mm}`).join(" · ")} />
        <KPI etiqueta="Vence contrato" valor={<Fecha v={actual?.fechaFin} />} nota={actual && !actual.fechaFin ? "Sin fecha contractual registrada" : undefined} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Ficha" >
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-gris">Tipo</dt><dd>{u.tipo.replaceAll("_", " ")}</dd>
            <dt className="text-gris">Piso</dt><dd>{u.piso ?? "—"}</dd>
            <dt className="text-gris">Superficie</dt><dd>{u.superficieM2 ? `${u.superficieM2.toString()} m²` : "—"}</dd>
            <dt className="text-gris">Dormitorios / baños</dt><dd>{u.dormitorios ?? "—"} / {u.banos ?? "—"}</dd>
            <dt className="text-gris">Estado operativo</dt><dd><Estado v={u.estadoOperativo} /></dd>
            <dt className="text-gris">Expensas asignadas</dt><dd><Dinero v={u.expensasAsignadas} m={m} /></dd>
            <dt className="text-gris">Alquiler de mercado</dt><dd>{u.alquilerReferencia ? <><Dinero v={u.alquilerReferencia} m={u.alquilerReferenciaMoneda ?? m} /> <span className="text-xs text-gris">({u.alquilerReferenciaFuente})</span></> : "—"}</dd>
            <dt className="text-gris">Costo mantenimiento acumulado</dt><dd><Dinero v={mantenimiento} m={m} /></dd>
            <dt className="text-gris">Datos</dt><dd><Estado v={u.estadoDato} /> <Estado v={u.origenDato} /></dd>
          </dl>
          {u.observaciones && <p className="mt-3 text-xs text-gris">{u.observaciones}</p>}
        </Tarjeta>
        <Tarjeta titulo="Historial de contratos" className="xl:col-span-2">
          {contratos.length === 0 ? <Vacio>Sin contratos.</Vacio> : (
            <table className="tabla"><thead><tr><th>Contrato</th><th>Estado</th><th>Inquilino(s)</th><th>Inicio</th><th>Fin</th><th>Historial de importes</th></tr></thead>
              <tbody>{contratos.map((c) => (
                <tr key={c.id}>
                  <td>{c.codigo}{c.origenDato === "IMPORTADO" && <div className="text-[11px] text-gris">importado — completar con contrato original</div>}</td>
                  <td><Estado v={c.estado} /></td>
                  <td>{c.partes.map((p) => `${p.persona.nombre} (${p.rol.toLowerCase()})`).join(", ")}</td>
                  <td><Fecha v={c.fechaInicio} /></td><td><Fecha v={c.fechaFin} /></td>
                  <td className="text-xs">{c.condiciones.map((x) => <div key={x.id}><Fecha v={x.vigenteDesde} />: <Dinero v={x.montoAlquiler} m={c.moneda} /> <span className="text-gris">{x.motivo.toLowerCase()}</span></div>)}</td>
                </tr>
              ))}</tbody></table>
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Estado de cuenta — obligaciones, facturación y cobranzas" className="mt-6">
        {ec.obligaciones.length === 0 ? <Vacio>Sin obligaciones registradas.</Vacio> : (
          <table className="tabla">
            <thead><tr><th>Período</th><th>Concepto</th><th>Vence</th><th className="num">Total</th><th className="num">Pagado</th><th className="num">Saldo</th><th>Estado</th><th>Facturación</th><th>Pagos</th></tr></thead>
            <tbody>{ec.obligaciones.map((o) => (
              <tr key={o.id}>
                <td>{o.periodo}</td>
                <td>{o.concepto}{o.ivaPendiente && <div className="text-[11px] text-dorado-d">IVA pendiente de regla validada</div>}</td>
                <td><Fecha v={o.fechaVencimiento} /></td>
                <td className="num"><Dinero v={o.importeTotal} m={o.moneda} /></td>
                <td className="num"><Dinero v={sumar(o.aplicaciones.map((a) => a.importe.toString()))} m={o.moneda} /></td>
                <td className="num font-medium"><Dinero v={o.saldo} m={o.moneda} /></td>
                <td><Estado v={o.vencida ? "VENCIDA" : o.estado} /></td>
                <td><Estado v={o.estadoFacturacion} /></td>
                <td className="text-xs">{o.aplicaciones.map((a) => <div key={a.id}><Fecha v={a.pago.fechaPago} /> · <Dinero v={a.importe} m={o.moneda} /></div>)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {monedas.map((mm) => (
          <div key={mm} className="mt-3 flex flex-wrap gap-6 text-sm">
            {Object.entries(ec.porMoneda[mm].deuda.porConcepto).map(([k, v]) => <span key={k}>{k.toLowerCase()} pendiente: <b><Dinero v={v} m={mm} /></b></span>)}
            <span>Deuda total: <b><Dinero v={ec.porMoneda[mm].deuda.total} m={mm} /></b></span>
            <span>Saldo a favor: <b><Dinero v={ec.porMoneda[mm].saldoAFavor} m={mm} /></b></span>
          </div>
        ))}
      </Tarjeta>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo="Mantenimiento y reparaciones">{u.ordenes.length === 0 ? <Vacio>Sin órdenes de trabajo.</Vacio> : <ul className="text-sm">{u.ordenes.map((o) => <li key={o.id}><Fecha v={o.fechaSolicitud} /> · {o.categoria} · {o.descripcion} <Estado v={o.estado} /></li>)}</ul>}</Tarjeta>
        <Tarjeta titulo="Remodelaciones">{u.remodelaciones.length === 0 ? <Vacio>Sin proyectos.</Vacio> : <ul className="text-sm">{u.remodelaciones.map((r) => <li key={r.id}>{r.codigo} · {r.objetivo} <Estado v={r.estado} /></li>)}</ul>}</Tarjeta>
      </div>
      <p className="mt-4 text-xs text-gris"><Link className="underline" href={`/propiedades/${u.propiedadId}`}>← Volver al edificio</Link></p>
    </>
  );
}
