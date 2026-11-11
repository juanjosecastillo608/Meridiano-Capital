import { protegido } from "@/lib/acceso";
import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { obtenerPersona } from "@/server/services/nucleo";
import { estadoDeCuenta } from "@/server/services/finanzas";
import { Dinero, Estado, Fecha, Tarjeta, Titulo, Vacio } from "@/components/ui";
import { sumar } from "@/domain/money";

export default async function Inquilino({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requerirSesion();
  const p = await protegido(() => obtenerPersona(s, id));
  const ec = await estadoDeCuenta(s, { personaId: id });
  return (
    <>
      <Titulo eyebrow={p.tipo === "FISICA" ? "Persona física" : "Persona jurídica"} acciones={<a className="btn btn-sec" href={`/api/exportar/estado-cuenta?personaId=${id}`}>Exportar estado de cuenta</a>}>{p.nombre}</Titulo>
      <div className="grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Datos">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-gris">Documento</dt><dd>{p.documentoNumero ? `${p.documentoTipo} ${p.documentoNumero}` : <span className="text-dorado-d">pendiente</span>}</dd>
            <dt className="text-gris">Teléfono</dt><dd>{p.telefono ?? "—"}</dd>
            <dt className="text-gris">Email</dt><dd>{p.email ?? "—"}</dd>
            <dt className="text-gris">Datos</dt><dd><Estado v={p.estadoDato} /> <Estado v={p.origenDato} /></dd>
          </dl>
          {p.observaciones && <p className="mt-3 text-xs text-gris">{p.observaciones}</p>}
        </Tarjeta>
        <Tarjeta titulo="Contratos vinculados" className="xl:col-span-2">
          {p.partes.length === 0 ? <Vacio>Sin contratos.</Vacio> : (
            <table className="tabla"><thead><tr><th>Contrato</th><th>Rol</th><th>Propiedad</th><th>Unidad</th><th>Estado</th><th>Fin</th></tr></thead>
              <tbody>{p.partes.map((x) => <tr key={x.id}><td>{x.contrato.codigo}</td><td>{x.rol}</td><td>{x.contrato.propiedad.nombre}</td><td>{x.contrato.unidades.map((u) => <Link key={u.unidadId} className="hover:underline" href={`/unidades/${u.unidadId}`}>{u.unidad.identificador}</Link>)}</td><td><Estado v={x.contrato.estado} /></td><td><Fecha v={x.contrato.fechaFin} /></td></tr>)}</tbody></table>
          )}
        </Tarjeta>
      </div>
      <Tarjeta titulo="Historial de pagos" className="mt-6">
        {ec.pagos.length === 0 ? <Vacio>Sin pagos.</Vacio> : (
          <table className="tabla"><thead><tr><th>Fecha pago</th><th>Acreditación</th><th>Método</th><th>Comprobante</th><th className="num">Importe</th><th className="num">Imputado</th><th>Estado</th><th>Conciliado</th></tr></thead>
            <tbody>{ec.pagos.map((x) => <tr key={x.id}><td><Fecha v={x.fechaPago} /></td><td><Fecha v={x.fechaAcreditacion} /></td><td>{x.metodo}</td><td>{x.comprobante ?? "—"}</td><td className="num"><Dinero v={x.importe} m={x.moneda} /></td><td className="num"><Dinero v={sumar(x.aplicaciones.map((a) => a.importe.toString()))} m={x.moneda} /></td><td><Estado v={x.estado} /></td><td>{x.conciliado ? "sí" : "no"}</td></tr>)}</tbody></table>
        )}
        {Object.entries(ec.porMoneda).map(([m, v]) => <div key={m} className="mt-3 text-sm">Deuda total {m}: <b><Dinero v={v.deuda.total} m={m} /></b> · Vencido: <Dinero v={v.vencido} m={m} /> · Saldo a favor: <Dinero v={v.saldoAFavor} m={m} /></div>)}
      </Tarjeta>
    </>
  );
}
