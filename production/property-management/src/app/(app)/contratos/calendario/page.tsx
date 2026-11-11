import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { listarSociedades, listarPropiedades } from "@/server/services/nucleo";
import { calendarioVencimientos, type EventoCalendario } from "@/server/services/fechas";
import { Titulo, Tarjeta, Estado, Vacio } from "@/components/ui";
import { desdeDate, formatoLocal } from "@/domain/plazos";
import { hoyAsuncion, sumarMeses } from "@/domain/periodo";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const TONO: Record<EventoCalendario["tipo"], string> = { VENCIMIENTO: "bg-tierra text-white", RECORDATORIO_30: "bg-[#f6e3de] text-tierra", RECORDATORIO_60: "bg-[#f8eedb] text-[#6b4e12]", RECORDATORIO_90: "bg-[#e3ebee] text-petroleo" };
const ETIQUETA: Record<EventoCalendario["tipo"], string> = { VENCIMIENTO: "Vence", RECORDATORIO_30: "30 d", RECORDATORIO_60: "60 d", RECORDATORIO_90: "90 d" };

export default async function Calendario({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  const sociedadId = socs.some((x) => x.id === sp.sociedadId) ? sp.sociedadId : undefined;
  const props = await listarPropiedades(s, sociedadId);
  const propiedadId = props.some((p) => p.id === sp.propiedadId) ? sp.propiedadId : undefined;
  const hoy = desdeDate(hoyAsuncion());
  const desdeMes = /^\d{4}-\d{2}$/.test(sp.desde ?? "") ? sp.desde! : hoy.slice(0, 7);
  const meses = Math.min(Math.max(Number(sp.meses ?? 12) || 12, 1), 36);
  const hastaMes = sumarMeses(desdeMes, meses - 1);
  const { eventos, proximos } = await calendarioVencimientos(s, { sociedadId, propiedadId, desde: `${desdeMes}-01`, hasta: `${hastaMes}-31` });
  const porMes = new Map<string, EventoCalendario[]>();
  for (const e of eventos) porMes.set(e.fecha.slice(0, 7), [...(porMes.get(e.fecha.slice(0, 7)) ?? []), e]);
  const listaMeses = Array.from({ length: meses }, (_, i) => sumarMeses(desdeMes, i));

  return (
    <>
      <Titulo eyebrow="Contratos">Calendario de vencimientos</Titulo>
      <form className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-linea bg-white p-3">
        <label className="campo">Sociedad<select name="sociedadId" defaultValue={sociedadId ?? ""}><option value="">Todas</option>{socs.map((x) => <option key={x.id} value={x.id}>{x.razonSocial}</option>)}</select></label>
        <label className="campo">Edificio<select name="propiedadId" defaultValue={propiedadId ?? ""}><option value="">Todos</option>{props.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></label>
        <label className="campo">Desde<input type="month" name="desde" defaultValue={desdeMes} /></label>
        <label className="campo">Meses<input type="number" name="meses" min={1} max={36} defaultValue={meses} /></label>
        <button className="btn btn-sec">Ver</button>
      </form>
      <p className="mb-4 flex flex-wrap gap-2 text-xs">{(Object.keys(TONO) as EventoCalendario["tipo"][]).map((t) => <span key={t} className={`rounded px-1.5 py-0.5 ${TONO[t]}`}>{t === "VENCIMIENTO" ? "Vencimiento (fecha final individual)" : `Recordatorio ${ETIQUETA[t]} antes`}</span>)} <span className="text-gris">Los recordatorios son internos: no renuevan, rescinden ni modifican contratos.</span></p>
      {eventos.length === 0 ? <Vacio>Sin vencimientos ni recordatorios en el período. Los contratos sin fecha final (p. ej. importados sin contrato original) no aparecen.</Vacio> : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {listaMeses.map((m) => {
            const ev = porMes.get(m) ?? [];
            return (
              <Tarjeta key={m} titulo={<span className="capitalize">{MESES[Number(m.slice(5, 7)) - 1]} {m.slice(0, 4)} <span className="text-xs text-gris">({ev.filter((e) => e.tipo === "VENCIMIENTO").length} vencimientos)</span></span>}>
                {ev.length === 0 ? <p className="text-xs text-gris">—</p> : (
                  <ul className="space-y-1 text-xs">{ev.map((e, i) => (
                    <li key={i} className="flex items-center gap-2"><span className="w-10 tabular-nums text-gris">{formatoLocal(e.fecha).slice(0, 5)}</span><span className={`rounded px-1.5 py-0.5 ${TONO[e.tipo]}`}>{ETIQUETA[e.tipo]}</span><Link className="hover:underline" href={`/contratos/${e.contratoId}`}>{e.edificio} {e.unidades} · {e.codigo}</Link>{e.estado !== "VIGENTE" && <Estado v={e.estado} />}</li>
                  ))}</ul>
                )}
              </Tarjeta>
            );
          })}
        </div>
      )}
      <Tarjeta titulo="Próximos vencimientos (todas las fechas finales individuales)" className="mt-6">
        {proximos.length === 0 ? <Vacio>Sin contratos con fecha final.</Vacio> : (
          <table className="tabla"><thead><tr><th>Contrato</th><th>Edificio</th><th>Fecha final</th><th className="num">Días</th><th>Recordatorio</th></tr></thead>
            <tbody>{proximos.slice(0, 50).map((p) => <tr key={p.id}><td><Link className="hover:underline" href={`/contratos/${p.id}`}>{p.codigo}</Link></td><td>{p.edificio}</td><td>{formatoLocal(desdeDate(p.fin))}</td><td className="num">{p.dias}</td><td>{p.alerta.vencido ? <Estado v="VENCIDO" /> : p.alerta.umbral != null ? `≤ ${p.alerta.umbral} días` : "—"}</td></tr>)}</tbody></table>
        )}
      </Tarjeta>
    </>
  );
}
