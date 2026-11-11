import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { crearSociedad } from "@/server/services/nucleo";
import { Titulo, Tarjeta } from "@/components/ui";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  const soc = await crearSociedad(s, {
    razonSocial: v("razonSocial")!, ruc: v("ruc"), domicilioFiscal: v("domicilioFiscal"), representanteLegal: v("representanteLegal"), telefono: v("telefono"), email: v("email"),
    monedaOperacion: (v("monedaOperacion") as "PYG" | "USD") ?? "PYG", estado: (v("estado") as "ACTIVA") ?? "ACTIVA", observaciones: v("observaciones"),
  });
  redirect(`/sociedades/${soc.id}`);
}

export default async function NuevaSociedad() {
  await requerirSesion();
  return (
    <>
      <Titulo eyebrow="Sociedades">Nueva sociedad propietaria</Titulo>
      <Tarjeta>
        <form action={crear} className="grid max-w-3xl gap-4 md:grid-cols-2">
          <label className="campo md:col-span-2">Razón social *<input name="razonSocial" required /></label>
          <label className="campo">RUC (12345678-9)<input name="ruc" pattern="\d{5,9}-\d" /></label>
          <label className="campo">Moneda de operación<select name="monedaOperacion"><option>PYG</option><option>USD</option></select></label>
          <label className="campo md:col-span-2">Domicilio fiscal<input name="domicilioFiscal" /></label>
          <label className="campo">Representante legal<input name="representanteLegal" /></label>
          <label className="campo">Estado<select name="estado"><option value="ACTIVA">Activa</option><option value="EN_CONSTITUCION">En constitución</option><option value="INACTIVA">Inactiva</option></select></label>
          <label className="campo">Teléfono<input name="telefono" /></label>
          <label className="campo">Email<input name="email" type="email" /></label>
          <label className="campo md:col-span-2">Observaciones administrativas<textarea name="observaciones" rows={3} /></label>
          <div className="md:col-span-2"><button className="btn">Crear sociedad</button></div>
        </form>
      </Tarjeta>
    </>
  );
}
