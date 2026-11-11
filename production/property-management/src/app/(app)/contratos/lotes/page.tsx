import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { candidatosRenovacion } from "@/server/services/renovacion";
import { crearLote, listarLotes } from "@/server/services/fechas";
import { ErrorNegocio } from "@/server/db";
import { puede } from "@/server/authz";
import { Titulo, Tarjeta, Estado, Vacio, Aviso, Dinero } from "@/components/ui";
import { desdeDate, formatoLocal } from "@/domain/plazos";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  let id: string;
  try {
    const ret = v("retroMotivo") && v("retroAutorizadoPor") ? { motivo: v("retroMotivo")!, autorizadoPor: v("retroAutorizadoPor")! } : null;
    id = (await crearLote(s, { propiedadId: v("propiedadId")!, unidadIds: form.getAll("unidadIds").map(String), fechaComun: v("fechaComun") ?? "", motivo: v("motivo") ?? "", autorizacionRetroactiva: ret })).id;
  } catch (e) {
    if (e instanceof ErrorNegocio || /Fecha/.test((e as Error).message)) redirect(`/contratos/lotes?propiedadId=${v("propiedadId")}&error=${encodeURIComponent((e as Error).message)}`);
    throw e;
  }
  redirect(`/contratos/lotes/${id}`);
}

export default async function Lotes({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  const props = (await Promise.all(socs.map((x) => listarPropiedades(s, x.id)))).flat();
  const propiedadId = props.some((p) => p.id === sp.propiedadId) ? sp.propiedadId! : props[0]?.id;
  const prop = props.find((p) => p.id === propiedadId);
  const [lotes, cands] = await Promise.all([listarLotes(s), propiedadId ? candidatosRenovacion(s, propiedadId) : Promise.resolve([])]);
  const gestiona = prop ? puede(s, "GESTIONAR_CONTRATOS", prop.sociedadId, prop.id) : false;
  return (
    <>
      <Titulo eyebrow="Contratos · fecha común">Preparación masiva de contratos</Titulo>
      <p className="mb-4 text-sm text-gris">La fecha común es una <b>propuesta</b>: no modifica ningún contrato. Solo se generan borradores para las unidades cuyo inquilino aceptó individualmente (con evidencia) y que tienen revisión jurídica aprobada; las demás quedan excluidas con su motivo. Cada contrato conserva sus propias fechas y autorizaciones.</p>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {gestiona && prop && (
        <Tarjeta titulo="1–3 · Seleccionar edificio y unidades, proponer fecha común" className="mb-6">
          <form className="mb-3 flex gap-2"><select name="propiedadId" defaultValue={propiedadId} className="rounded border border-linea px-2 py-1 text-sm">{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select><button className="btn btn-sec">Cambiar edificio</button></form>
          <form action={crear}>
            <input type="hidden" name="propiedadId" value={propiedadId} />
            <table className="tabla"><thead><tr><th></th><th>Unidad</th><th>Inquilino</th><th>Contrato actual (fecha anterior)</th><th className="num">Canon</th><th>Situación</th></tr></thead>
              <tbody>{cands.map((c) => (
                <tr key={c.unidadId}>
                  <td><input type="checkbox" name="unidadIds" value={c.unidadId} defaultChecked={c.elegible} disabled={!c.contratoAnterior} /></td>
                  <td>{c.identificador}</td><td>{c.inquilinos.map((i) => i.nombre).join(", ") || "—"}</td>
                  <td className="text-xs">{c.contratoAnterior ? `${c.contratoAnterior.codigo} · fin ${c.contratoAnterior.fechaFin ? formatoLocal(desdeDate(c.contratoAnterior.fechaFin)) : "sin fecha"}` : "—"}</td>
                  <td className="num">{c.canon ? <Dinero v={c.canon.monto} /> : "—"}</td>
                  <td className="text-xs">{c.elegible ? <Estado v="OK" /> : c.motivos.join(" ")}</td>
                </tr>
              ))}</tbody></table>
            <div className="mt-3 grid gap-2 md:grid-cols-4">
              <label className="campo">Fecha común propuesta *<input type="date" name="fechaComun" required /></label>
              <label className="campo md:col-span-3">Motivo *<input name="motivo" required placeholder="Unificar vencimientos del edificio…" /></label>
              <label className="campo md:col-span-2">Autorización retroactiva (solo si la fecha es anterior a hoy) — motivo<input name="retroMotivo" /></label>
              <label className="campo md:col-span-2">Autorizado por<input name="retroAutorizadoPor" /></label>
            </div>
            <button className="btn mt-3">Crear lote (propuesta)</button>
          </form>
        </Tarjeta>
      )}
      <Tarjeta titulo="Lotes">
        {lotes.length === 0 ? <Vacio>Sin lotes.</Vacio> : (
          <table className="tabla"><thead><tr><th>Creado</th><th>Fecha común propuesta</th><th>Plazo</th><th className="num">Unidades</th><th>Estado</th></tr></thead>
            <tbody>{lotes.map((l) => <tr key={l.id}><td><Link className="hover:underline" href={`/contratos/lotes/${l.id}`}>{l.createdAt.toISOString().slice(0, 10)}</Link></td><td>{formatoLocal(desdeDate(l.fechaComunPropuesta))}</td><td>{l.plazoMeses} meses</td><td className="num">{l._count.items}</td><td><Estado v={l.estado} /></td></tr>)}</tbody></table>
        )}
      </Tarjeta>
    </>
  );
}
