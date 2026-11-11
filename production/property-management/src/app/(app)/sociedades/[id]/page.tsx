import { protegido } from "@/lib/acceso";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requerirSesion } from "@/lib/sesion";
import { obtenerSociedad, crearPropiedad, crearCuentaBancaria } from "@/server/services/nucleo";
import { generarObligacionesMensuales } from "@/server/services/finanzas";
import { puede } from "@/server/authz";
import { Estado, Tarjeta, Titulo, Vacio } from "@/components/ui";
import { periodoDe, hoyAsuncion } from "@/domain/periodo";
import { historialConfiguracion, nuevaVersionConfiguracion } from "@/server/services/renovacion";
import { redirect } from "next/navigation";
import { ErrorNegocio } from "@/server/db";

async function nuevaPropiedad(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  await crearPropiedad(s, { sociedadId: v("sociedadId")!, codigo: v("codigo")!.toUpperCase(), nombre: v("nombre")!, direccion: v("direccion"), ciudad: v("ciudad"), barrio: v("barrio"), cuentaBancariaId: v("cuentaBancariaId") });
  revalidatePath(`/sociedades/${v("sociedadId")}`);
}

async function nuevaCuenta(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  await crearCuentaBancaria(s, { sociedadId: v("sociedadId")!, banco: v("banco")!, numero: v("numero")!, tipo: v("tipo"), moneda: v("moneda") as "PYG" | "USD", titular: v("titular") });
  revalidatePath(`/sociedades/${v("sociedadId")}`);
}

async function nuevaConfig(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const sociedadId = String(form.get("sociedadId"));
  try {
    await nuevaVersionConfiguracion(s, sociedadId, {
      residentialLeaseDefaultTermMonths: Number(form.get("term")), residentialLeaseInitialIncreasePercent: String(form.get("increase") ?? "0"),
      residentialLeaseRentPolicy: "KEEP_VALIDATED_CURRENT_RENT", residentialLeaseAutoAdjustment: form.get("auto") === "on",
      alertasDias: String(form.get("alertas") ?? "").split(",").map((x) => Number(x.trim())).filter((x) => !isNaN(x)),
      autorizadoPor: String(form.get("autorizadoPor") ?? ""), motivo: String(form.get("motivo") ?? ""),
    });
  } catch (e) {
    if (e instanceof ErrorNegocio || (e as Error).name === "ZodError") redirect(`/sociedades/${sociedadId}?error=${encodeURIComponent((e as Error).message.slice(0, 200))}`);
    throw e;
  }
  revalidatePath(`/sociedades/${sociedadId}`);
}

async function generar(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const sociedadId = String(form.get("sociedadId"));
  await generarObligacionesMensuales(s, sociedadId, String(form.get("periodo")));
  revalidatePath(`/sociedades/${sociedadId}`);
}

export default async function Sociedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requerirSesion();
  const soc = await protegido(() => obtenerSociedad(s, id));
  const configs = await historialConfiguracion(s, id);
  return (
    <>
      <Titulo eyebrow="Sociedad propietaria">{soc.razonSocial}</Titulo>
      <div className="grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Ficha">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-gris">RUC</dt><dd>{soc.ruc ?? <span className="text-gris">pendiente</span>}</dd>
            <dt className="text-gris">Estado</dt><dd><Estado v={soc.estado} /></dd>
            <dt className="text-gris">Moneda</dt><dd>{soc.monedaOperacion}</dd>
            <dt className="text-gris">Domicilio fiscal</dt><dd>{soc.domicilioFiscal ?? "—"}</dd>
            <dt className="text-gris">Representante</dt><dd>{soc.representanteLegal ?? "—"}</dd>
            <dt className="text-gris">Datos</dt><dd><Estado v={soc.estadoDato} /></dd>
          </dl>
          {soc.observaciones && <p className="mt-3 text-xs text-gris">{soc.observaciones}</p>}
        </Tarjeta>
        <Tarjeta titulo="Cuentas bancarias" className="xl:col-span-2">
          {soc.cuentas.length === 0 ? <Vacio>Sin cuentas registradas.</Vacio> : (
            <table className="tabla"><thead><tr><th>Banco</th><th>Número</th><th>Tipo</th><th>Moneda</th></tr></thead>
              <tbody>{soc.cuentas.map((c) => <tr key={c.id}><td>{c.banco}</td><td>{c.numero}</td><td>{c.tipo ?? "—"}</td><td>{c.moneda}</td></tr>)}</tbody></table>
          )}
          {puede(s, "CAMBIAR_CUENTA_BANCARIA", id) && (
            <form action={nuevaCuenta} className="mt-4 grid gap-2 md:grid-cols-5">
              <input type="hidden" name="sociedadId" value={id} />
              <label className="campo">Banco<input name="banco" required /></label>
              <label className="campo">Número<input name="numero" required /></label>
              <label className="campo">Tipo<input name="tipo" placeholder="Cta. cte." /></label>
              <label className="campo">Moneda<select name="moneda"><option>PYG</option><option>USD</option></select></label>
              <div className="flex items-end"><button className="btn btn-sec">Agregar cuenta</button></div>
            </form>
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Propiedades / edificios" className="mt-6">
        {soc.propiedades.length === 0 ? <Vacio>Sin propiedades. Créela aquí o al confirmar una importación de Excel.</Vacio> : (
          <table className="tabla"><thead><tr><th>Código</th><th>Nombre</th><th>Dirección</th><th className="num">Unidades</th><th>Datos</th></tr></thead>
            <tbody>{soc.propiedades.map((p) => <tr key={p.id}><td>{p.codigo}</td><td><Link className="font-medium hover:underline" href={`/propiedades/${p.id}`}>{p.nombre}</Link></td><td>{p.direccion ?? "—"}</td><td className="num">{p._count.unidades}</td><td><Estado v={p.estadoDato} /></td></tr>)}</tbody></table>
        )}
        {puede(s, "GESTIONAR_MAESTROS", id) && (
          <form action={nuevaPropiedad} className="mt-4 grid gap-2 md:grid-cols-6">
            <input type="hidden" name="sociedadId" value={id} />
            <label className="campo">Código<input name="codigo" required placeholder="FRM" /></label>
            <label className="campo md:col-span-2">Nombre<input name="nombre" required /></label>
            <label className="campo md:col-span-2">Dirección<input name="direccion" /></label>
            <label className="campo">Cuenta receptora<select name="cuentaBancariaId"><option value="">—</option>{soc.cuentas.map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero}</option>)}</select></label>
            <div><button className="btn btn-sec">Agregar propiedad</button></div>
          </form>
        )}
      </Tarjeta>

      <Tarjeta titulo="Configuración contractual residencial (versionada)" className="mt-6">
        {configs.length === 0 ? <Vacio>Sin configuración: no se pueden generar contratos residenciales.</Vacio> : (
          <>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
              <div><dt className="text-xs text-gris">residentialLeaseDefaultTermMonths</dt><dd className="font-medium">{configs[0].residentialLeaseDefaultTermMonths}</dd></div>
              <div><dt className="text-xs text-gris">residentialLeaseInitialIncreasePercent</dt><dd className="font-medium">{configs[0].residentialLeaseInitialIncreasePercent.toString()} %</dd></div>
              <div><dt className="text-xs text-gris">residentialLeaseRentPolicy</dt><dd className="font-medium">{configs[0].residentialLeaseRentPolicy}</dd></div>
              <div><dt className="text-xs text-gris">residentialLeaseAutoAdjustment</dt><dd className="font-medium">{String(configs[0].residentialLeaseAutoAdjustment)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-gris">Versión {configs[0].version} · alertas {configs[0].alertasDias.join("/")} días · autorizada por {configs[0].autorizadoPor} · {configs[0].createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC. Solo contratos residenciales (no locales comerciales).</p>
            {configs.length > 1 && <details className="mt-2 text-xs"><summary className="cursor-pointer">Historial ({configs.length} versiones)</summary><ul className="mt-1 space-y-0.5">{configs.map((c) => <li key={c.id}>v{c.version} · {c.createdAt.toISOString().slice(0, 10)} · plazo {c.residentialLeaseDefaultTermMonths} m · incremento {c.residentialLeaseInitialIncreasePercent.toString()} % · {c.autorizadoPor} — {c.motivo}</li>)}</ul></details>}
          </>
        )}
        <div className="mt-3 text-sm"><Link className="underline" href={`/contratos/renovacion?sociedadId=${id}`}>Generar borradores de contratos residenciales →</Link></div>
        {puede(s, "CONFIGURAR_SOCIEDAD", id) && (
          <form action={nuevaConfig} className="mt-4 grid gap-2 border-t border-linea pt-3 md:grid-cols-4">
            <input type="hidden" name="sociedadId" value={id} />
            <label className="campo">Plazo (meses)<input name="term" type="number" min={1} defaultValue={configs[0]?.residentialLeaseDefaultTermMonths ?? 12} required /></label>
            <label className="campo">Incremento inicial %<input name="increase" defaultValue={configs[0]?.residentialLeaseInitialIncreasePercent.toString() ?? "0"} required /></label>
            <label className="campo">Alertas (días)<input name="alertas" defaultValue={(configs[0]?.alertasDias ?? [90, 60, 30, 0]).join(", ")} required /></label>
            <label className="flex items-end gap-2 text-sm"><input type="checkbox" name="auto" defaultChecked={configs[0]?.residentialLeaseAutoAdjustment ?? false} /> Reajuste automático</label>
            <label className="campo md:col-span-2">Autorizado por *<input name="autorizadoPor" required /></label>
            <label className="campo md:col-span-2">Motivo / documento de la decisión *<input name="motivo" required /></label>
            <div><button className="btn btn-sec">Crear nueva versión</button></div>
          </form>
        )}
      </Tarjeta>

      {puede(s, "GENERAR_OBLIGACIONES", id) && (
        <Tarjeta titulo="Proceso mensual de obligaciones" className="mt-6">
          <form action={generar} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="sociedadId" value={id} />
            <label className="campo">Período<input type="month" name="periodo" defaultValue={periodoDe(hoyAsuncion())} required /></label>
            <button className="btn">Generar alquileres del período</button>
            <p className="text-xs text-gris">Idempotente: ejecutarlo dos veces no duplica. Solo contratos VIGENTES con fechas y día de vencimiento. Meses parciales quedan marcados para revisión (sin prorrateo inventado).</p>
          </form>
        </Tarjeta>
      )}
    </>
  );
}
