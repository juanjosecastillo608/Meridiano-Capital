import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { protegido } from "@/lib/acceso";
import { obtenerLote, registrarAcuerdo, registrarRevisionJuridica, confirmarLote } from "@/server/services/fechas";
import { prisma, ErrorNegocio } from "@/server/db";
import { puede } from "@/server/authz";
import { Titulo, Tarjeta, Estado, Aviso } from "@/components/ui";
import { desdeDate, formatoLocal } from "@/domain/plazos";

async function ir(id: string, e?: unknown): Promise<never> {
  if (e && !(e instanceof ErrorNegocio)) throw e;
  redirect(`/contratos/lotes/${id}${e ? `?error=${encodeURIComponent((e as Error).message)}` : ""}`);
}

async function acuerdo(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("lote"));
  const f = form.get("evidencia") as File | null;
  try { await registrarAcuerdo(s, String(form.get("item")), { acepta: form.get("acepta") === "si", motivo: String(form.get("motivo") ?? ""), evidencia: f && f.size ? { nombre: f.name, buffer: Buffer.from(await f.arrayBuffer()) } : undefined }); } catch (e) { await ir(id, e); }
  await ir(id);
}

async function revision(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("lote"));
  try { await registrarRevisionJuridica(s, String(form.get("item")), { aprobada: form.get("aprobada") === "si", motivo: String(form.get("motivo") ?? "") }); } catch (e) { await ir(id, e); }
  await ir(id);
}

async function confirmar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("lote"));
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  if (form.get("confirmo") !== "on") await ir(id, new ErrorNegocio("Marque la confirmación."));
  try { await confirmarLote(s, id, { cuentaBancariaId: v("cuentaBancariaId"), diaVencimiento: v("diaVencimiento") ? Number(v("diaVencimiento")) : null, fechaFirma: v("fechaFirma") }); } catch (e) { await ir(id, e); }
  await ir(id);
}

const f = (d: Date | null) => (d ? formatoLocal(desdeDate(d)) : "sin fecha");

export default async function Lote({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const s = await requerirSesion();
  const { lote: l, nombreUnidad } = await protegido(() => obtenerLote(s, id));
  const enPrep = l.estado === "PREPARACION";
  const gestiona = puede(s, "GESTIONAR_CONTRATOS", l.sociedadId, l.propiedadId);
  const juridico = puede(s, "CONFIGURAR_SOCIEDAD", l.sociedadId);
  const cuentas = await prisma.cuentaBancaria.findMany({ where: { sociedadId: l.sociedadId, activa: true, deletedAt: null } });
  const autorizables = l.items.filter((i) => i.estado === "PENDIENTE" && i.acuerdoEstado === "ACEPTADO" && i.acuerdoEvidenciaId && i.revisionEstado === "APROBADA").length;
  return (
    <>
      <Titulo eyebrow="Lote de contratos — fecha común (propuesta)" acciones={<Estado v={l.estado} />}>Inicio propuesto {f(l.fechaComunPropuesta)} · {l.plazoMeses} meses</Titulo>
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      <p className="mb-4 text-xs text-gris">Motivo: {l.motivo}. La propuesta no modifica contratos: cada unidad necesita el acuerdo individual del inquilino (con evidencia) y la revisión jurídica.</p>
      <Tarjeta titulo="4–5 · Fecha anterior vs. propuesta, acuerdo del inquilino y revisión jurídica por contrato">
        <table className="tabla">
          <thead><tr><th>Unidad</th><th>Fecha anterior</th><th>Propuesta</th><th>Acuerdo del inquilino</th><th>Revisión jurídica</th><th>Estado</th></tr></thead>
          <tbody>{l.items.map((i) => (
            <tr key={i.id}>
              <td>{nombreUnidad[i.unidadId]}</td>
              <td className="text-xs">{f(i.inicioAnterior)} → {f(i.finAnterior)}</td>
              <td className="text-xs font-medium">{f(i.inicioPropuesto)} → {f(i.finPropuesto)}</td>
              <td className="text-xs"><Estado v={i.acuerdoEstado === "ACEPTADO" ? "OK" : i.acuerdoEstado === "RECHAZADO" ? "ERROR" : "PENDIENTE"} /> {i.acuerdoMotivo}{i.acuerdoEvidenciaId && <> · <a className="underline" href={`/api/documentos/${i.acuerdoEvidenciaId}`}>evidencia</a></>}
                {enPrep && gestiona && i.estado === "PENDIENTE" && (
                  <form action={acuerdo} className="mt-1 flex flex-col gap-1">
                    <input type="hidden" name="lote" value={l.id} /><input type="hidden" name="item" value={i.id} />
                    <select name="acepta" className="rounded border border-linea px-1"><option value="si">Acepta la fecha común</option><option value="no">No acepta</option></select>
                    <input name="motivo" required placeholder="Medio, fecha, quién recibió" className="rounded border border-linea px-1" />
                    <input type="file" name="evidencia" />
                    <button className="btn btn-sec">Registrar acuerdo</button>
                  </form>
                )}
              </td>
              <td className="text-xs"><Estado v={i.revisionEstado === "APROBADA" ? "OK" : i.revisionEstado === "OBSERVADA" ? "ERROR" : "PENDIENTE"} /> {i.revisionMotivo}
                {enPrep && juridico && i.estado === "PENDIENTE" && (
                  <form action={revision} className="mt-1 flex flex-col gap-1">
                    <input type="hidden" name="lote" value={l.id} /><input type="hidden" name="item" value={i.id} />
                    <select name="aprobada" className="rounded border border-linea px-1"><option value="si">Aprobada</option><option value="no">Observada</option></select>
                    <input name="motivo" required placeholder="Dictamen / referencia" className="rounded border border-linea px-1" />
                    <button className="btn btn-sec">Registrar revisión</button>
                  </form>
                )}
              </td>
              <td className="text-xs"><Estado v={i.estado} />{i.motivoExclusion && <div className="text-tierra">{i.motivoExclusion}</div>}{i.contratoGeneradoId && <div><Link className="underline" href={`/contratos/${i.contratoGeneradoId}`}>ver borrador</Link></div>}</td>
            </tr>
          ))}</tbody>
        </table>
      </Tarjeta>
      {enPrep && juridico && (
        <form action={confirmar} className="mt-6">
          <input type="hidden" name="lote" value={l.id} />
          <Tarjeta titulo="6–8 · Confirmar autorizados y generar borradores individualmente">
            <p className="mb-2 text-sm">{autorizables} de {l.items.length} unidad(es) cumplen acuerdo + revisión; las demás se excluirán con su motivo.</p>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="campo">Cuenta receptora<select name="cuentaBancariaId"><option value="">— seleccionar —</option>{cuentas.map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero} ({c.moneda})</option>)}</select></label>
              <label className="campo">Día de vencimiento mensual<input type="number" min={1} max={31} name="diaVencimiento" /></label>
              <label className="campo">Fecha de firma (si se conoce)<input type="date" name="fechaFirma" /></label>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" name="confirmo" /> Confirmo generar BORRADORES (no firmados ni vigentes) solo para las unidades autorizadas.</label>
            <button className="btn btn-cta mt-3">Confirmar lote</button>
          </Tarjeta>
        </form>
      )}
    </>
  );
}
