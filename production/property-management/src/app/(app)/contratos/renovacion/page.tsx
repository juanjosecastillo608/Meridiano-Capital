import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { protegido } from "@/lib/acceso";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { candidatosRenovacion, previsualizarBorrador, generarBorradorResidencial, validarCanon, configuracionVigente } from "@/server/services/renovacion";
import { prisma, ErrorNegocio } from "@/server/db";
import { puede } from "@/server/authz";
import { Titulo, Tarjeta, Estado, Dinero, Aviso, Vacio, Fecha } from "@/components/ui";
import { formatoLocal } from "@/domain/plazos";

const err = (e: unknown) => e instanceof ErrorNegocio || (e as Error).name === "ZodError" || /Fecha/.test((e as Error).message);

async function validar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const q = String(form.get("q"));
  try { await validarCanon(s, String(form.get("contratoId")), { montoConfirmado: String(form.get("monto") ?? "").trim(), motivo: String(form.get("motivo") ?? "") }); }
  catch (e) { if (err(e)) redirect(`/contratos/renovacion?${q}&error=${encodeURIComponent((e as Error).message.slice(0, 300))}`); throw e; }
  redirect(`/contratos/renovacion?${q}`);
}

async function generar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  let id: string;
  try {
    const r = await generarBorradorResidencial(s, { unidadId: v("unidadId")!, fechaInicio: v("fechaInicio") ?? "", fechaFirma: v("fechaFirma"), cuentaBancariaId: v("cuentaBancariaId"), diaVencimiento: v("diaVencimiento") ? Number(v("diaVencimiento")) : null, deposito: v("deposito"), confirmoFechaFin: v("confirmoFechaFin") ?? "" });
    id = r.contrato.id;
  } catch (e) { if (err(e)) redirect(`/contratos/renovacion?${v("q")}&error=${encodeURIComponent((e as Error).message.slice(0, 300))}`); throw e; }
  redirect(`/contratos/${id}`);
}

export default async function Renovacion({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  const sociedadId = socs.some((x) => x.id === sp.sociedadId) ? sp.sociedadId! : socs[0]?.id;
  if (!sociedadId) return <Vacio>Sin sociedades.</Vacio>;
  const props = await listarPropiedades(s, sociedadId);
  const propiedadId = props.some((p) => p.id === sp.propiedadId) ? sp.propiedadId! : props[0]?.id;
  const cfg = await configuracionVigente(sociedadId);
  const cands = propiedadId ? await protegido(() => candidatosRenovacion(s, propiedadId)) : [];
  const cuentas = await prisma.cuentaBancaria.findMany({ where: { sociedadId, activa: true, deletedAt: null } });
  const q = `sociedadId=${sociedadId}&propiedadId=${propiedadId ?? ""}`;
  const sel = sp.unidadId ? cands.find((c) => c.unidadId === sp.unidadId) : null;
  let preview = null, previewError: string | null = null;
  if (sel && sp.fechaInicio) {
    try { preview = await previsualizarBorrador(s, { unidadId: sel.unidadId, fechaInicio: sp.fechaInicio, fechaFirma: sp.fechaFirma || null, cuentaBancariaId: sp.cuentaBancariaId || null, diaVencimiento: sp.diaVencimiento ? Number(sp.diaVencimiento) : null, deposito: sp.deposito || null }); }
    catch (e) { if (err(e)) previewError = (e as Error).message; else throw e; }
  }
  const gestiona = puede(s, "GESTIONAR_CONTRATOS", sociedadId);
  const valida = puede(s, "VALIDAR_CANON", sociedadId);

  return (
    <>
      <Titulo eyebrow="Actualización contractual 03">Contratos residenciales de 12 meses — borradores</Titulo>
      <form className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-linea bg-white p-3">
        <label className="campo">Sociedad<select name="sociedadId" defaultValue={sociedadId}>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
        <label className="campo">Edificio<select name="propiedadId" defaultValue={propiedadId}>{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
        <button className="btn btn-sec">Ver</button>
      </form>
      {sp.error && <div className="mb-4"><Aviso tipo="error">{sp.error}</Aviso></div>}
      {!cfg ? <div className="mb-4"><Aviso tipo="alerta">La sociedad no tiene configuración contractual residencial. Cárguela en la ficha de la sociedad.</Aviso></div> : (
        <p className="mb-4 text-xs text-gris">Configuración v{cfg.version}: {cfg.residentialLeaseDefaultTermMonths} meses · incremento inicial {cfg.residentialLeaseInitialIncreasePercent.toString()} % · {cfg.residentialLeaseRentPolicy} · reajuste automático {String(cfg.residentialLeaseAutoAdjustment)}. Los contratos se generan como BORRADOR pendiente de validación: no firmados ni vigentes; redacción provisional sujeta a revisión jurídica.</p>
      )}

      <Tarjeta titulo="Unidades e inquilinos actuales">
        {cands.length === 0 ? <Vacio>Sin unidades en el edificio.</Vacio> : (
          <table className="tabla">
            <thead><tr><th>Unidad</th><th>Inquilino(s)</th><th>Contrato actual</th><th className="num">Canon actual</th><th>Canon</th><th>Situación</th><th></th></tr></thead>
            <tbody>{cands.map((c) => (
              <tr key={c.unidadId}>
                <td>{c.identificador}<div className="text-[11px] text-gris">{c.tipo.replaceAll("_", " ").toLowerCase()}</div></td>
                <td>{c.inquilinos.map((i) => i.nombre).join(", ") || "—"}</td>
                <td>{c.contratoAnterior ? <><Link className="text-xs hover:underline" href={`/contratos/${c.contratoAnterior.id}`}>{c.contratoAnterior.codigo}</Link> <Estado v={c.contratoAnterior.estado} /><div className="text-[11px] text-gris">fin <Fecha v={c.contratoAnterior.fechaFin} /></div></> : "—"}</td>
                <td className="num">{c.canon ? <Dinero v={c.canon.monto} m={c.contratoAnterior?.moneda ?? "PYG"} /> : "—"}</td>
                <td>{c.canon ? <Estado v={c.canon.validado ? "VALIDADO" : "PENDIENTE_REVISION"} /> : "—"}
                  {c.canon && !c.canon.validado && valida && c.contratoAnterior && (
                    <form action={validar} className="mt-1 flex flex-col gap-1">
                      <input type="hidden" name="q" value={q} /><input type="hidden" name="contratoId" value={c.contratoAnterior.id} />
                      <input name="monto" required placeholder="Reescriba el canon" className="w-36 rounded border border-linea px-1 text-xs" />
                      <input name="motivo" required placeholder="Respaldo (contrato, recibo…)" className="w-36 rounded border border-linea px-1 text-xs" />
                      <button className="btn btn-sec">Validar canon</button>
                    </form>
                  )}
                </td>
                <td className="text-xs">{c.renovacionExistente ? <Link className="underline" href={`/contratos/${c.renovacionExistente.id}`}>{c.renovacionExistente.codigo}</Link> : null}{c.motivos.map((m, i) => <div key={i} className={c.elegible ? "" : "text-tierra"}>{m}</div>)}{c.diferenciasPlanilla.length > 0 && <div>Planilla: {c.diferenciasPlanilla.map((d) => `${d.periodo} ${d.monto}`).join(", ")}</div>}</td>
                <td>{c.elegible && gestiona && <Link className="btn btn-sec" href={`/contratos/renovacion?${q}&unidadId=${c.unidadId}#generar`}>Preparar</Link>}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Tarjeta>

      {sel && gestiona && (
        <div id="generar" className="mt-6 grid gap-6 xl:grid-cols-2">
          <Tarjeta titulo={`1 · Datos del contrato nuevo — unidad ${sel.identificador}`}>
            <form className="grid gap-2 md:grid-cols-2">
              <input type="hidden" name="sociedadId" value={sociedadId} /><input type="hidden" name="propiedadId" value={propiedadId} /><input type="hidden" name="unidadId" value={sel.unidadId} />
              <label className="campo">Fecha de inicio * (individual, se valida)<input type="date" name="fechaInicio" required defaultValue={sp.fechaInicio} /></label>
              <label className="campo">Fecha de firma (si difiere)<input type="date" name="fechaFirma" defaultValue={sp.fechaFirma} /></label>
              <label className="campo">Cuenta receptora (activas de la sociedad)<select name="cuentaBancariaId" defaultValue={sp.cuentaBancariaId ?? ""}><option value="">— seleccionar —</option>{cuentas.map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero} ({c.moneda})</option>)}</select></label>
              <label className="campo">Día de vencimiento mensual<input type="number" min={1} max={31} name="diaVencimiento" defaultValue={sp.diaVencimiento} /></label>
              <label className="campo">Depósito de garantía (verificado)<input name="deposito" pattern="\d+(\.\d{1,2})?" defaultValue={sp.deposito} /></label>
              <div className="flex items-end"><button className="btn btn-sec">Calcular vista previa</button></div>
            </form>
          </Tarjeta>
          <Tarjeta titulo="2 · Vista previa (antes de generar)">
            {previewError ? <Aviso tipo="error">{previewError}</Aviso> : !preview ? <Vacio>Indique la fecha de inicio para calcular el plazo.</Vacio> : (
              <>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt className="text-gris">Inicio</dt><dd className="font-medium">{formatoLocal(preview.fechaInicio)}</dd>
                  <dt className="text-gris">Finalización</dt><dd className="font-medium">{formatoLocal(preview.fechaFin)} {preview.excepcion && <Estado v="ADVERTENCIA" />}</dd>
                  <dt className="text-gris">Plazo</dt><dd>{preview.plazoMeses} meses calendario ({preview.dias} días, inicio y fin inclusivos)</dd>
                  <dt className="text-gris">Canon</dt><dd><Dinero v={preview.canon} m={preview.moneda} /> · incremento {preview.incrementoPct} %</dd>
                  <dt className="text-gris">Moneda</dt><dd>{preview.moneda}</dd>
                  <dt className="text-gris">Cuenta</dt><dd>{preview.cuenta ?? <span className="text-tierra">pendiente</span>}</dd>
                  <dt className="text-gris">Contrato anterior</dt><dd>{preview.contratoAnterior}</dd>
                </dl>
                {preview.bloqueos.map((b, i) => <div key={i} className="mt-2"><Aviso tipo="error">{b}</Aviso></div>)}
                {preview.advertencias.map((b, i) => <div key={i} className="mt-2"><Aviso tipo="alerta">{b}</Aviso></div>)}
                {preview.faltantes.length > 0 && <div className="mt-2 text-xs"><b>Quedarán como [PENDIENTE] en el borrador:</b> {preview.faltantes.join("; ")}.</div>}
                {preview.bloqueos.length === 0 && (
                  <form action={generar} className="mt-4 space-y-2">
                    {Object.entries({ q, unidadId: sel.unidadId, fechaInicio: preview.fechaInicio, fechaFirma: sp.fechaFirma ?? "", cuentaBancariaId: sp.cuentaBancariaId ?? "", diaVencimiento: sp.diaVencimiento ?? "", deposito: sp.deposito ?? "", confirmoFechaFin: preview.fechaFin }).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
                    <p className="text-xs text-gris">Al generar se crea un contrato BORRADOR pendiente de validación y su documento DOCX provisional. No queda firmado ni vigente.</p>
                    <button className="btn btn-cta">Confirmo inicio {formatoLocal(preview.fechaInicio)} y fin {formatoLocal(preview.fechaFin)} — generar borrador</button>
                  </form>
                )}
              </>
            )}
          </Tarjeta>
        </div>
      )}
    </>
  );
}
