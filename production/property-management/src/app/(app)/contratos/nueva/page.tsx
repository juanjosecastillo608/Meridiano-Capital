import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/sesion";
import { obtenerPropiedad, listarPersonas } from "@/server/services/nucleo";
import { crearContrato } from "@/server/services/contratos";
import { Titulo, Tarjeta, Aviso } from "@/components/ui";

async function crear(form: FormData) {
  "use server";
  const s = await requerirSesion();
  const v = (k: string) => (String(form.get(k) ?? "").trim() || null);
  const propiedadId = v("propiedadId")!;
  await crearContrato(s, {
    codigo: v("codigo")!, propiedadId, unidadIds: form.getAll("unidadIds").map(String), inquilinoIds: form.getAll("inquilinoIds").map(String), garanteIds: form.getAll("garanteIds").map(String),
    categoriaFiscal: v("categoriaFiscal") as "ALQUILER_RESIDENCIAL", fechaFirma: v("fechaFirma"), fechaInicio: v("fechaInicio"), fechaFin: v("fechaFin"), moneda: v("moneda") as "PYG",
    diaVencimiento: v("diaVencimiento") ? Number(v("diaVencimiento")) : null, montoAlquiler: v("montoAlquiler")!, deposito: v("deposito"),
    responsabilidadExpensas: v("responsabilidadExpensas") as "NO_DEFINIDO", responsabilidadServicios: v("responsabilidadServicios") as "NO_DEFINIDO",
    penalidadesTexto: v("penalidadesTexto"), periodoGraciaDias: Number(v("periodoGraciaDias") ?? 0), observaciones: v("observaciones"), estado: v("estado") as "BORRADOR",
  });
  redirect(`/propiedades/${propiedadId}`);
}

export default async function NuevoContrato({ searchParams }: { searchParams: Promise<{ propiedadId?: string }> }) {
  const { propiedadId } = await searchParams;
  const s = await requerirSesion();
  if (!propiedadId) return <Aviso tipo="alerta">Abra “Nuevo contrato” desde la ficha de un edificio.</Aviso>;
  const [p, personas] = await Promise.all([obtenerPropiedad(s, propiedadId), listarPersonas(s)]);
  const resp = <><option value="NO_DEFINIDO">No definido</option><option value="INQUILINO">Inquilino</option><option value="PROPIETARIO">Propietario</option><option value="COMPARTIDO">Compartido</option></>;
  return (
    <>
      <Titulo eyebrow={p.nombre}>Nuevo contrato</Titulo>
      <Tarjeta>
        <form action={crear} className="grid max-w-4xl gap-4 md:grid-cols-3">
          <input type="hidden" name="propiedadId" value={p.id} />
          <label className="campo">Código *<input name="codigo" required placeholder={`${p.codigo}-C001`} /></label>
          <label className="campo">Estado inicial<select name="estado"><option value="BORRADOR">Borrador</option><option value="PENDIENTE_FIRMA">Pendiente de firma</option><option value="VIGENTE">Vigente</option></select></label>
          <label className="campo">Categoría fiscal *<select name="categoriaFiscal"><option value="ALQUILER_RESIDENCIAL">Alquiler residencial</option><option value="ALQUILER_COMERCIAL">Alquiler comercial</option><option value="RENTA_TEMPORAL">Renta temporal</option></select></label>
          <label className="campo">Unidad(es) *<select name="unidadIds" multiple required size={5}>{p.unidades.map((u) => <option key={u.id} value={u.id}>{u.identificador}</option>)}</select></label>
          <label className="campo">Inquilino(s) *<select name="inquilinoIds" multiple required size={5}>{personas.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}</select></label>
          <label className="campo">Garante(s)<select name="garanteIds" multiple size={5}>{personas.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}</select></label>
          <label className="campo">Fecha de firma<input type="date" name="fechaFirma" /></label>
          <label className="campo">Inicio<input type="date" name="fechaInicio" /></label>
          <label className="campo">Fin<input type="date" name="fechaFin" /></label>
          <label className="campo">Moneda *<select name="moneda"><option>PYG</option><option>USD</option></select></label>
          <label className="campo">Alquiler mensual * (sin puntos)<input name="montoAlquiler" required pattern="\d+(\.\d{1,2})?" /></label>
          <label className="campo">Día de vencimiento<input type="number" name="diaVencimiento" min={1} max={31} /></label>
          <label className="campo">Depósito de garantía<input name="deposito" pattern="\d+(\.\d{1,2})?" /></label>
          <label className="campo">Expensas a cargo de<select name="responsabilidadExpensas">{resp}</select></label>
          <label className="campo">Servicios a cargo de<select name="responsabilidadServicios">{resp}</select></label>
          <label className="campo">Período de gracia (días)<input type="number" name="periodoGraciaDias" min={0} defaultValue={0} /></label>
          <label className="campo md:col-span-2">Penalidades pactadas (texto del contrato)<input name="penalidadesTexto" /></label>
          <label className="campo md:col-span-3">Observaciones<textarea name="observaciones" rows={2} /></label>
          <div className="md:col-span-3 text-xs text-gris">Para pasar a VIGENTE se exigen fechas de inicio/fin y día de vencimiento. Mora y reajuste automáticos solo se aplican si la fórmula contractual se registra y valida.</div>
          <div><button className="btn">Registrar contrato</button></div>
        </form>
      </Tarjeta>
    </>
  );
}
