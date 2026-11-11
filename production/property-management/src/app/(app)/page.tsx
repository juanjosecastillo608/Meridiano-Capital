import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { panel } from "@/server/services/consultas";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { Dinero, Estado, KPI, Tarjeta, Titulo, Fecha, Vacio, Aviso } from "@/components/ui";
import { periodoDe, hoyAsuncion } from "@/domain/periodo";

export default async function Panel({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requerirSesion();
  const sp = await searchParams;
  const periodo = sp.periodo ?? periodoDe(hoyAsuncion());
  const moneda = (sp.moneda as "PYG" | "USD") ?? "PYG";
  // Filtros de la URL: solo se aceptan sociedades autorizadas (no se confía en el parámetro).
  const permitidas = await listarSociedades(s);
  if (sp.sociedadId && !permitidas.some((x) => x.id === sp.sociedadId)) sp.sociedadId = undefined;
  const [p, sociedades, propiedades] = await Promise.all([
    panel(s, { periodo, moneda, sociedadId: sp.sociedadId || undefined, propiedadId: sp.propiedadId || undefined }),
    listarSociedades(s),
    listarPropiedades(s, sp.sociedadId || undefined),
  ]);
  const ind = Object.fromEntries(p.indicadores.map((i) => [i.clave, i]));

  return (
    <>
      <Titulo eyebrow="Meridiano Capital">Panel general</Titulo>
      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-linea bg-white p-3">
        <label className="campo">Sociedad<select name="sociedadId" defaultValue={sp.sociedadId ?? ""}><option value="">Todas</option>{sociedades.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
        <label className="campo">Propiedad<select name="propiedadId" defaultValue={sp.propiedadId ?? ""}><option value="">Todas</option>{propiedades.map((x) => <option key={x.id} value={x.id}>{x.codigo} — {x.nombre}</option>)}</select></label>
        <label className="campo">Período<input type="month" name="periodo" defaultValue={periodo} /></label>
        <label className="campo">Moneda<select name="moneda" defaultValue={moneda}><option>PYG</option><option>USD</option></select></label>
        <button className="btn">Aplicar</button>
      </form>

      {p.pendientesRevision > 0 && <div className="mb-4"><Aviso tipo="alerta">{p.pendientesRevision} unidad(es) con datos importados <b>pendientes de revisión</b>. Los indicadores que dependen de ellos son provisorios.</Aviso></div>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KPI etiqueta="Sociedades" valor={p.totales.sociedades} href="/sociedades" />
        <KPI etiqueta="Propiedades" valor={p.totales.propiedades} />
        <KPI etiqueta="Unidades" valor={p.totales.unidades} />
        <KPI etiqueta="Ocupadas" valor={p.totales.ocupadas} nota="Derivado de contratos vigentes y entregas reales" />
        <KPI etiqueta="Disponibles" valor={p.totales.disponibles} />
        <KPI etiqueta="Contratos por vencer" valor={p.alertas.length} href="/contratos" nota="Según umbrales de alerta configurados" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KPI etiqueta="Ingreso contractual" valor={<Dinero v={ind.ingreso_contractual.valor} m={moneda} />} nota={ind.ingreso_contractual.formula} />
        <KPI etiqueta={`Devengado ${periodo}`} valor={<Dinero v={p.devengado} m={moneda} />} nota="Σ obligaciones del período" />
        <KPI etiqueta="Cobrado" valor={<Dinero v={p.cobrado} m={moneda} />} nota={ind.ingreso_cobrado.formula} />
        <KPI etiqueta="Alquileres pendientes" valor={<Dinero v={p.alquiler.pendiente} m={moneda} />} />
        <KPI etiqueta="Expensas pendientes" valor={<Dinero v={p.expensas.pendiente} m={moneda} />} />
        <KPI etiqueta="Vencido (todas)" valor={<Dinero v={p.vencido.importe} m={moneda} />} nota={`${p.vencido.cantidad} obligación(es) vencida(s) del período`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Indicadores (fórmula y origen)" className="xl:col-span-2">
          <table className="tabla">
            <thead><tr><th>Indicador</th><th className="num">Valor</th><th>Fórmula</th><th>Origen</th></tr></thead>
            <tbody>
              {p.indicadores.map((i) => (
                <tr key={i.clave}>
                  <td>{i.nombre}{i.nota && <div className="text-[11px] text-gris">{i.nota}</div>}</td>
                  <td className="num">{i.valor === null ? <span className="text-gris">no calculable</span> : i.unidad === "MONEDA" ? <Dinero v={i.valor} m={moneda} /> : i.unidad === "PCT" ? `${i.valor.toString()} %` : i.valor.toString()}</td>
                  <td className="text-xs text-gris">{i.formula}</td>
                  <td className="text-xs text-gris">{i.origen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tarjeta>
        <Tarjeta titulo="Alertas de vencimiento de contratos">
          {p.alertas.length === 0 ? <Vacio>Sin contratos dentro de los umbrales de alerta.</Vacio> : (
            <ul className="space-y-2 text-sm">
              {p.alertas.map(({ contrato: c, alerta: a }) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span>{c.codigo} · {c.propiedad.codigo} {c.unidades.map((u) => u.unidad.identificador).join(", ")}</span>
                  <span className="flex items-center gap-2"><Fecha v={c.fechaFin} /><Estado v={a.vencido ? "VENCIDO" : `${a.diasRestantes}_DÍAS`} /></span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>Obligaciones sin facturar: <b>{p.sinFacturar}</b></div>
            <div>Remodelaciones activas: <b>{p.remodelacionesActivas}</b></div>
            <div>Gastos operativos: <Dinero v={p.gastos.opex} m={moneda} /></div>
            <div>CAPEX: <Dinero v={p.gastos.capex} m={moneda} /></div>
          </div>
          <div className="mt-4 text-xs text-gris">Rentabilidad por inmueble: solo se calcula para propiedades con valor documentado y fuente. <Link className="underline" href="/sociedades">Ver propiedades</Link>.</div>
        </Tarjeta>
      </div>
    </>
  );
}
