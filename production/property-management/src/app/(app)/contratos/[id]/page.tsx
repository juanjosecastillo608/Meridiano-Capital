import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { protegido } from "@/lib/acceso";
import { obtenerContrato, registrarPasoValidacion, type PasoValidacion } from "@/server/services/renovacion";
import { cambiarEstadoContrato } from "@/server/services/contratos";
import { editarFechasContrato, aprobarFechasContrato, motivosNoAprobable } from "@/server/services/fechas";
import { formatoLocal, desdeDate } from "@/domain/plazos";
import { listarDocumentos } from "@/server/services/documentos";
import { prisma, ErrorNegocio } from "@/server/db";
import { puede } from "@/server/authz";
import { Titulo, Tarjeta, Estado, Dinero, Fecha, Aviso } from "@/components/ui";

async function paso(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  const f = form.get("archivo") as File | null;
  try {
    await registrarPasoValidacion(s, id, String(form.get("paso")) as PasoValidacion, { motivo: String(form.get("motivo") ?? ""), deposito: String(form.get("deposito") ?? "").trim() || null, cuentaBancariaId: String(form.get("cuentaBancariaId") ?? "") || null, archivoFirmado: f && f.size ? { nombre: f.name, buffer: Buffer.from(await f.arrayBuffer()) } : undefined });
  } catch (e) { if (e instanceof ErrorNegocio) redirect(`/contratos/${id}?error=${encodeURIComponent(e.message)}`); throw e; }
  redirect(`/contratos/${id}`);
}

async function editarFechas(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  try {
    const ret = v("retroMotivo") && v("retroAutorizadoPor") ? { motivo: v("retroMotivo")!, autorizadoPor: v("retroAutorizadoPor")! } : null;
    await editarFechasContrato(s, id, { fechaInicio: v("fechaInicio") ?? "", fechaFirma: v("fechaFirma"), motivo: v("motivo") ?? "", autorizacionRetroactiva: ret });
  } catch (e) { if (e instanceof ErrorNegocio || /Fecha/.test((e as Error).message)) redirect(`/contratos/${id}?error=${encodeURIComponent((e as Error).message)}`); throw e; }
  redirect(`/contratos/${id}`);
}

async function aprobarFechas(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  try { await aprobarFechasContrato(s, id, String(form.get("motivo") ?? "")); }
  catch (e) { if (e instanceof ErrorNegocio) redirect(`/contratos/${id}?error=${encodeURIComponent(e.message)}`); throw e; }
  redirect(`/contratos/${id}`);
}

async function estado(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const id = String(form.get("id"));
  try { await cambiarEstadoContrato(s, id, String(form.get("nuevo")) as "VIGENTE", { motivo: String(form.get("motivo") ?? "") }); }
  catch (e) { if (e instanceof ErrorNegocio) redirect(`/contratos/${id}?error=${encodeURIComponent(e.message)}`); throw e; }
  redirect(`/contratos/${id}`);
}

export default async function Contrato({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const s = await requerirSesion();
  const c = await protegido(() => obtenerContrato(s, id));
  const docs = (await listarDocumentos(s, { sociedadId: c.sociedadId, entidad: "CONTRATO", entidadId: c.id })).documentos;
  const cuentas = await prisma.cuentaBancaria.findMany({ where: { sociedadId: c.sociedadId, activa: true, deletedAt: null, moneda: c.moneda } });
  const gestiona = puede(s, "GESTIONAR_CONTRATOS", c.sociedadId, c.propiedadId);
  const noAprobable = c.plantillaVersion ? await motivosNoAprobable(c.id) : [];
  const editable = gestiona && (c.estado === "BORRADOR" || c.estado === "PENDIENTE_FIRMA");
  const pasos: { k: PasoValidacion; label: string; ok: boolean; extra?: React.ReactNode }[] = [
    { k: "INICIO_CONFIRMADO", label: "Fecha de inicio confirmada", ok: c.inicioConfirmado },
    { k: "CUENTA", label: "Cuenta bancaria receptora", ok: !!c.cuentaBancariaId, extra: <select name="cuentaBancariaId" className="rounded border border-linea px-1 text-xs">{cuentas.map((x) => <option key={x.id} value={x.id}>{x.banco} {x.numero}</option>)}</select> },
    { k: "DEPOSITO_VERIFICADO", label: "Depósito de garantía verificado", ok: c.depositoVerificado, extra: <input name="deposito" placeholder="Importe verificado" className="w-32 rounded border border-linea px-1 text-xs" /> },
    { k: "REVISION_JURIDICA", label: "Revisión jurídica de la redacción", ok: c.revisionJuridicaAprobada },
    { k: "FIRMADO", label: "Contrato firmado incorporado", ok: !!c.documentoFirmadoId, extra: <input type="file" name="archivo" className="text-xs" /> },
  ];
  return (
    <>
      <Titulo eyebrow={`${c.propiedad.nombre} · unidad ${c.unidades.map((u) => u.unidad.identificador).join(", ")}`} acciones={<Estado v={c.estado} />}>Contrato {c.codigo}</Titulo>
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      {c.plantillaVersion && c.estado === "BORRADOR" && <div className="mb-4"><Aviso tipo="alerta">BORRADOR pendiente de validación — no firmado, no vigente. Redacción provisional {c.plantillaVersion} sujeta a revisión jurídica.</Aviso></div>}
      <div className="grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Condiciones">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-gris">Inquilino(s)</dt><dd>{c.partes.filter((p) => p.rol === "INQUILINO").map((p) => <Link key={p.id} className="hover:underline" href={`/inquilinos/${p.personaId}`}>{p.persona.nombre}</Link>)}</dd>
            <dt className="text-gris">Inicio</dt><dd><Fecha v={c.fechaInicio} /></dd>
            <dt className="text-gris">Finalización</dt><dd><Fecha v={c.fechaFin} />{c.finExcepcion && <div className="text-[11px] text-tierra">Excepción: {c.finExcepcionMotivo} ({c.finExcepcionAutorizadoPor})</div>}</dd>
            <dt className="text-gris">Plazo</dt><dd>{c.plazoMeses ? `${c.plazoMeses} meses` : "—"}</dd>
            <dt className="text-gris">Firma</dt><dd><Fecha v={c.fechaFirma} /></dd>
            <dt className="text-gris">Canon</dt><dd>{c.condiciones.map((x) => <div key={x.id}><Dinero v={x.montoAlquiler} m={c.moneda} /> desde <Fecha v={x.vigenteDesde} /> {x.validado && <Estado v="VALIDADO" />}</div>)}</dd>
            <dt className="text-gris">Origen del canon</dt><dd className="text-xs">{c.canonOrigen ?? "—"}</dd>
            <dt className="text-gris">Reajuste</dt><dd>{c.reajusteTipo.replaceAll("_", " ").toLowerCase()}{c.reajusteValidado ? "" : " (no automático)"}</dd>
            <dt className="text-gris">Vencimiento mensual</dt><dd>{c.diaVencimiento ? `día ${c.diaVencimiento}` : <span className="text-tierra">pendiente</span>}</dd>
            <dt className="text-gris">Depósito</dt><dd>{c.deposito ? <Dinero v={c.deposito} m={c.moneda} /> : <span className="text-tierra">pendiente</span>}</dd>
            <dt className="text-gris">Cuenta</dt><dd>{c.cuentaBancaria ? `${c.cuentaBancaria.banco} ${c.cuentaBancaria.numero}` : <span className="text-tierra">pendiente</span>}</dd>
            <dt className="text-gris">Historial</dt><dd className="text-xs">{c.contratoAnterior && <div>Anterior: <Link className="underline" href={`/contratos/${c.contratoAnterior.id}`}>{c.contratoAnterior.codigo}</Link> ({c.contratoAnterior.estado.toLowerCase()})</div>}{c.renovacion && <div>Nuevo: <Link className="underline" href={`/contratos/${c.renovacion.id}`}>{c.renovacion.codigo}</Link> ({c.renovacion.estado.toLowerCase()})</div>}</dd>
          </dl>
        </Tarjeta>
        <Tarjeta titulo="Procedimiento de validación" className="xl:col-span-2">
          {!c.plantillaVersion ? <p className="text-sm text-gris">Contrato no generado desde plantilla.</p> : (
            <ul className="space-y-2 text-sm">{pasos.map((p) => (
              <li key={p.k} className="flex flex-wrap items-center gap-2">
                <Estado v={p.ok ? "OK" : "PENDIENTE"} /> <span className="min-w-56">{p.label}</span>
                {!p.ok && editable && (p.k !== "REVISION_JURIDICA" || puede(s, "CONFIGURAR_SOCIEDAD", c.sociedadId)) && (
                  <form action={paso} className="flex flex-wrap items-center gap-1">
                    <input type="hidden" name="id" value={c.id} /><input type="hidden" name="paso" value={p.k} />
                    {p.extra}
                    <input name="motivo" required placeholder="Respaldo" className="w-40 rounded border border-linea px-1 text-xs" />
                    <button className="btn btn-sec">Registrar</button>
                  </form>
                )}
              </li>
            ))}</ul>
          )}
          {editable && (
            <form action={estado} className="mt-4 flex flex-wrap gap-2 border-t border-linea pt-3">
              <input type="hidden" name="id" value={c.id} />
              <select name="nuevo" className="rounded border border-linea px-2 text-sm"><option value="PENDIENTE_FIRMA">Pasar a pendiente de firma</option><option value="VIGENTE">Activar (vigente)</option></select>
              <input name="motivo" required placeholder="Motivo" className="flex-1 rounded border border-linea px-2 text-sm" />
              <button className="btn">Cambiar estado</button>
            </form>
          )}
          <div className="mt-4 text-sm"><b>Documentos:</b> {docs.length ? docs.map((d) => <a key={d.id} className="mr-3 underline" href={`/api/documentos/${d.id}`}>{d.titulo}</a>) : <span className="text-gris">ninguno</span>}</div>
        </Tarjeta>
      </div>

      {c.plantillaVersion && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Tarjeta titulo="Fechas del contrato (Actualización contractual 04)">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-gris">startDate / endDate</dt><dd>{c.fechaInicio ? formatoLocal(desdeDate(c.fechaInicio)) : "—"} → {c.fechaFin ? formatoLocal(desdeDate(c.fechaFin)) : "—"}</dd>
              <dt className="text-gris">signatureDate</dt><dd>{c.fechaFirma ? formatoLocal(desdeDate(c.fechaFirma)) : "—"}</dd>
              <dt className="text-gris">termMonths</dt><dd>{c.plazoMeses ?? "—"}</dd>
              <dt className="text-gris">dateSelectionMode</dt><dd>{c.dateSelectionMode}{c.contractBatch && <> · <Link className="underline" href={`/contratos/lotes/${c.contractBatch.id}`}>lote</Link></>}</dd>
              <dt className="text-gris">dateAgreementStatus</dt><dd>{c.dateAgreementStatus}{c.dateAgreementEvidenceId && <> · <a className="underline" href={`/api/documentos/${c.dateAgreementEvidenceId}`}>evidencia</a></>}</dd>
              <dt className="text-gris">legalReviewStatus</dt><dd>{c.legalReviewStatus}</dd>
              <dt className="text-gris">dateApprovedAt</dt><dd>{c.dateApprovedAt ? c.dateApprovedAt.toISOString().slice(0, 16).replace("T", " ") + " UTC" : <span className="text-tierra">sin aprobación definitiva</span>}</dd>
            </dl>
            {!c.dateApprovedAt && (noAprobable.length ? <ul className="mt-3 list-disc pl-5 text-xs text-tierra">{noAprobable.map((m) => <li key={m}>{m}</li>)}</ul> : puede(s, "CONFIGURAR_SOCIEDAD", c.sociedadId) && (
              <form action={aprobarFechas} className="mt-3 flex gap-2"><input type="hidden" name="id" value={c.id} /><input name="motivo" required placeholder="Respaldo de la aprobación" className="flex-1 rounded border border-linea px-2 text-sm" /><button className="btn">Aprobar fechas</button></form>
            ))}
            <div className="mt-4 text-xs"><b>Versiones de fechas</b> (se conservan todas):
              <ul className="mt-1 space-y-0.5">{c.versionesFecha.map((v) => <li key={v.id}>v{v.version} · {v.fechaInicio ? formatoLocal(desdeDate(v.fechaInicio)) : "—"} → {v.fechaFin ? formatoLocal(desdeDate(v.fechaFin)) : "—"} · firma {v.fechaFirma ? formatoLocal(desdeDate(v.fechaFirma)) : "—"} · {v.modo.toLowerCase()} · {v.motivo} · {v.createdAt.toISOString().slice(0, 10)}</li>)}</ul>
            </div>
          </Tarjeta>
          {editable && c.estado === "BORRADOR" && (
            <Tarjeta titulo="Edición individual de fechas">
              <form action={editarFechas} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={c.id} />
                <label className="campo">Nueva fecha de inicio *<input type="date" name="fechaInicio" required /></label>
                <label className="campo">Fecha de firma<input type="date" name="fechaFirma" /></label>
                <label className="campo md:col-span-2">Motivo *<input name="motivo" required /></label>
                <label className="campo">Autorización retroactiva — motivo<input name="retroMotivo" /></label>
                <label className="campo">Autorizado por<input name="retroAutorizadoPor" /></label>
                <p className="text-xs text-gris md:col-span-2">El fin se recalcula por meses calendario ({c.plazoMeses} meses). Editar crea una versión nueva y anula la aprobación de fechas y la confirmación de inicio.</p>
                <div><button className="btn btn-sec">Guardar nueva versión</button></div>
              </form>
            </Tarjeta>
          )}
        </div>
      )}
    </>
  );
}
