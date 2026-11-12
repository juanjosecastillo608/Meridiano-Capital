import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { protegido } from "@/lib/acceso";
import { prisma, ErrorNegocio } from "@/server/db";
import { exigir, puede } from "@/server/authz";
import { expedientesPropiedad, actualizarDatosInquilino, type ItemExpediente } from "@/server/services/expedientes";
import { Titulo, Tarjeta, Estado, Dinero, Aviso } from "@/components/ui";

async function guardar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const unidadId = String(form.get("unidadId"));
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  try { await actualizarDatosInquilino(s, String(form.get("personaId")), { ruc: v("ruc"), domicilio: v("domicilio"), email: v("email"), telefono: v("telefono"), motivo: v("motivo") ?? "" }); }
  catch (e) { if (e instanceof ErrorNegocio) redirect(`/expedientes/${unidadId}?error=${encodeURIComponent(e.message)}`); throw e; }
  redirect(`/expedientes/${unidadId}?ok=1`);
}

const TONO: Record<ItemExpediente["estado"], string> = { OK: "OK", FALTA: "FALTA", ALERTA: "ALERTA", INFO: "INFO" };

export default async function Expediente({ params, searchParams }: { params: Promise<{ unidadId: string }>; searchParams: Promise<{ error?: string; ok?: string }> }) {
  const { unidadId } = await params;
  const sp = await searchParams;
  const s = await requerirSesion();
  const u = await prisma.unidad.findUnique({ where: { id: unidadId }, include: { propiedad: true } });
  if (!u) return protegido(async () => { throw new ErrorNegocio("x", "NO_ENCONTRADO"); });
  await protegido(async () => exigir(s, "LEER", u.propiedad.sociedadId, u.propiedadId));
  const e = (await expedientesPropiedad(s, u.propiedadId)).find((x) => x.unidadId === unidadId)!;
  const grupos = [...new Set(e.items.map((i) => i.grupo))];
  const edita = puede(s, "GESTIONAR_MAESTROS", u.propiedad.sociedadId, u.propiedadId);
  return (
    <>
      <Titulo eyebrow={`Expediente · ${e.edificio.nombre}`} acciones={<><Link className="btn btn-sec" href={`/unidades/${unidadId}`}>Estado de cuenta</Link>{e.resumen.listoParaBorrador && <Link className="btn" href={`/contratos/renovacion?propiedadId=${e.edificio.id}&unidadId=${unidadId}#generar`}>Preparar borrador</Link>}</>}>Unidad {e.unidad}</Titulo>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {sp.ok && <div className="mb-4"><Aviso>Datos actualizados (auditado).</Aviso></div>}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <span>Situación: <Estado v={e.situacion} /></span>
        <span>Canon: {e.canon ? <Dinero v={e.canon} m={e.moneda} /> : "—"} (IVA incluido)</span>
        <span>Contrato actual: {e.contrato ? <Link className="underline" href={`/contratos/${e.contrato.id}`}>{e.contrato.codigo}</Link> : "—"}</span>
        <span>Borrador: <Estado v={e.resumen.listoParaBorrador ? "OK" : "PENDIENTE"} /></span>
        <span>Contrato real: <Estado v={e.resumen.listoParaContratoReal ? "OK" : "PENDIENTE"} /></span>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {grupos.map((g) => (
            <Tarjeta key={g} titulo={g}>
              <ul className="space-y-1.5 text-sm">{e.items.filter((i) => i.grupo === g).map((i) => (
                <li key={i.clave} className="flex items-start gap-2"><Estado v={TONO[i.estado]} /><span><b>{i.etiqueta}</b>{i.bloqueaContrato && i.estado !== "OK" ? <span className="text-[11px] text-tierra"> · bloquea el contrato real</span> : null}<br /><span className="text-gris">{i.detalle}</span></span></li>
              ))}</ul>
            </Tarjeta>
          ))}
        </div>
        <div className="space-y-4">
          {e.inquilinos.map((i) => (
            <Tarjeta key={i.id} titulo={`Inquilino: ${i.nombre}`}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-gris">RUC (factura)</dt><dd>{i.ruc ?? <span className="text-tierra">falta</span>}</dd>
                <dt className="text-gris">CI</dt><dd>{i.ci ?? <span className="text-tierra">falta</span>}</dd>
                <dt className="text-gris">Teléfono</dt><dd>{i.telefono ?? "—"}</dd>
                <dt className="text-gris">Email</dt><dd>{i.email ?? "—"}</dd>
                <dt className="text-gris">Domicilio</dt><dd>{i.domicilio ?? <span className="text-tierra">falta</span>}</dd>
              </dl>
              {edita && (
                <form action={guardar} className="mt-3 grid gap-2">
                  <input type="hidden" name="personaId" value={i.id} /><input type="hidden" name="unidadId" value={unidadId} />
                  <label className="campo">RUC (base-DV; la CI se deriva)<input name="ruc" placeholder="1234567-8" pattern="\d{5,9}-\d" /></label>
                  <label className="campo">Domicilio<input name="domicilio" /></label>
                  <label className="campo">Email<input name="email" type="email" /></label>
                  <label className="campo">Teléfono<input name="telefono" /></label>
                  <label className="campo">Fuente del dato *<input name="motivo" required placeholder="Constancia de RUC, cédula, contrato…" /></label>
                  <button className="btn btn-sec">Guardar</button>
                </form>
              )}
            </Tarjeta>
          ))}
        </div>
      </div>
    </>
  );
}
