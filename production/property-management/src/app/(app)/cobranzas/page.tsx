import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarPersonas, listarSociedades } from "@/server/services/nucleo";
import { estadoDeCuenta, registrarPago, revertirPago } from "@/server/services/finanzas";
import { prisma, ErrorNegocio } from "@/server/db";
import { Dinero, Estado, Fecha, Tarjeta, Titulo, Aviso, Vacio } from "@/components/ui";
import { hoyAsuncion, aISO } from "@/domain/periodo";

async function registrar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  const aplicaciones = [...form.entries()].filter(([k, x]) => k.startsWith("ap_") && String(x).trim()).map(([k, x]) => ({ obligacionId: k.slice(3), importe: String(x).trim() }));
  const personaId = v("personaId")!;
  try {
    await registrarPago(s, {
      sociedadId: v("sociedadId")!, personaId, cuentaBancariaId: v("cuentaBancariaId"), fechaPago: v("fechaPago")!, fechaAcreditacion: v("fechaAcreditacion"), bancoOrigen: v("bancoOrigen"),
      metodo: v("metodo") as "TRANSFERENCIA", comprobante: v("comprobante"), moneda: v("moneda") as "PYG", importe: v("importe")!, observaciones: v("observaciones"),
      aplicaciones: aplicaciones.length ? aplicaciones : undefined,
    });
  } catch (e) {
    if (e instanceof ErrorNegocio) redirect(`/cobranzas?personaId=${personaId}&sociedadId=${v("sociedadId")}&error=${encodeURIComponent(e.message)}`);
    throw e;
  }
  redirect(`/cobranzas?personaId=${personaId}&sociedadId=${v("sociedadId")}&ok=1`);
}

async function revertir(form: FormData) {
  "use server";
  const s = await requerirSesion();
  await revertirPago(s, String(form.get("pagoId")), String(form.get("motivo") ?? ""));
  redirect(`/cobranzas?personaId=${form.get("personaId")}&sociedadId=${form.get("sociedadId")}`);
}

export default async function Cobranzas({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const [personas, socs] = await Promise.all([listarPersonas(s), listarSociedades(s)]);
  const sociedadId = sp.sociedadId ?? socs[0]?.id;
  const ec = sp.personaId && sociedadId ? await estadoDeCuenta(s, { personaId: sp.personaId, sociedadId }) : null;
  const cuentas = sociedadId ? await prisma.cuentaBancaria.findMany({ where: { sociedadId, deletedAt: null, activa: true } }) : [];
  const abiertas = ec?.obligaciones.filter((o) => o.estado === "PENDIENTE" || o.estado === "PARCIAL") ?? [];

  return (
    <>
      <Titulo eyebrow="Cuentas por cobrar">Registrar cobranza</Titulo>
      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-linea bg-white p-3">
        <label className="campo">Sociedad<select name="sociedadId" defaultValue={sociedadId}>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
        <label className="campo">Inquilino<select name="personaId" defaultValue={sp.personaId ?? ""}><option value="">Seleccione…</option>{personas.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></label>
        <button className="btn btn-sec">Ver deuda</button>
      </form>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {sp.ok && <div className="mb-4"><Aviso>Pago registrado e imputado.</Aviso></div>}
      {!ec ? <Vacio>Seleccione un inquilino para ver sus obligaciones abiertas.</Vacio> : (
        <form action={registrar}>
          <input type="hidden" name="sociedadId" value={sociedadId} />
          <input type="hidden" name="personaId" value={sp.personaId} />
          <Tarjeta titulo="Obligaciones abiertas — deje en blanco para imputación automática (vencimiento más antiguo primero, alquiler antes que expensas)">
            {abiertas.length === 0 ? <Vacio>Sin deuda: el pago quedará como saldo a favor (anticipo).</Vacio> : (
              <table className="tabla"><thead><tr><th>Período</th><th>Unidad</th><th>Concepto</th><th>Vence</th><th className="num">Saldo</th><th>Estado</th><th>Imputar</th></tr></thead>
                <tbody>{abiertas.map((o) => <tr key={o.id}><td>{o.periodo}</td><td>{o.unidad?.identificador ?? "—"}</td><td>{o.concepto}</td><td><Fecha v={o.fechaVencimiento} /></td><td className="num"><Dinero v={o.saldo} m={o.moneda} /></td><td><Estado v={o.vencida ? "VENCIDA" : o.estado} /></td><td><input name={`ap_${o.id}`} className="w-32 rounded border border-linea px-2 py-1 text-right text-sm" pattern="\d+(\.\d{1,2})?" placeholder="0" /></td></tr>)}</tbody></table>
            )}
          </Tarjeta>
          <Tarjeta titulo="Datos del pago" className="mt-4">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="campo">Importe recibido *<input name="importe" required pattern="\d+(\.\d{1,2})?" /></label>
              <label className="campo">Moneda *<select name="moneda"><option>PYG</option><option>USD</option></select></label>
              <label className="campo">Fecha del pago *<input type="date" name="fechaPago" required defaultValue={aISO(hoyAsuncion())} /></label>
              <label className="campo">Fecha de acreditación<input type="date" name="fechaAcreditacion" /></label>
              <label className="campo">Método<select name="metodo"><option value="TRANSFERENCIA">Transferencia</option><option value="DEPOSITO">Depósito</option><option value="EFECTIVO">Efectivo</option><option value="CHEQUE">Cheque</option><option value="TARJETA">Tarjeta</option><option value="OTRO">Otro</option></select></label>
              <label className="campo">Cuenta receptora<select name="cuentaBancariaId"><option value="">—</option>{cuentas.map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero} ({c.moneda})</option>)}</select></label>
              <label className="campo">Nº de comprobante<input name="comprobante" /></label>
              <label className="campo">Banco de origen<input name="bancoOrigen" /></label>
              <label className="campo md:col-span-4">Observaciones<input name="observaciones" /></label>
            </div>
            <div className="mt-4"><button className="btn btn-cta">Registrar pago</button></div>
          </Tarjeta>
        </form>
      )}
      {ec && ec.pagos.length > 0 && (
        <Tarjeta titulo="Pagos registrados" className="mt-6">
          <table className="tabla"><thead><tr><th>Fecha</th><th>Comprobante</th><th className="num">Importe</th><th>Estado</th><th>Revertir (requiere motivo)</th></tr></thead>
            <tbody>{ec.pagos.map((p) => <tr key={p.id}><td><Fecha v={p.fechaPago} /></td><td>{p.comprobante ?? "—"}</td><td className="num"><Dinero v={p.importe} m={p.moneda} /></td><td><Estado v={p.estado} /></td><td>{p.estado === "REGISTRADO" && <form action={revertir} className="flex gap-2"><input type="hidden" name="pagoId" value={p.id} /><input type="hidden" name="personaId" value={sp.personaId} /><input type="hidden" name="sociedadId" value={sociedadId} /><input name="motivo" required placeholder="Motivo" className="rounded border border-linea px-2 py-1 text-sm" /><button className="btn btn-sec">Revertir</button></form>}</td></tr>)}</tbody></table>
        </Tarjeta>
      )}
    </>
  );
}
