import Link from "next/link";
import { formatear, type MonedaCodigo } from "@/domain/money";

export function Dinero({ v, m = "PYG" }: { v: { toString(): string } | string | number | null | undefined; m?: MonedaCodigo | string }) {
  if (v === null || v === undefined) return <span className="text-gris">—</span>;
  return <span className="num">{formatear(v.toString(), m as MonedaCodigo)}</span>;
}

export function Fecha({ v }: { v: Date | null | undefined }) {
  if (!v) return <span className="text-gris">—</span>;
  const [y, m, d] = v.toISOString().slice(0, 10).split("-");
  return <span className="whitespace-nowrap">{`${d}/${m}/${y}`}</span>;
}

const TONOS: Record<string, string> = {
  ok: "bg-[#e6ede9] text-[#2f4a3a] border-[#c9d6cd]",
  alerta: "bg-[#f8eedb] text-[#6b4e12] border-[#e8d3a6]",
  error: "bg-[#f6e3de] text-tierra border-error-borde",
  neutro: "bg-fila text-gris border-linea",
  info: "bg-[#e3ebee] text-petroleo border-[#c3d3d8]",
};

const ESTADO_TONO: Record<string, keyof typeof TONOS> = {
  VIGENTE: "ok", PAGADA: "ok", OCUPADA: "ok", VALIDADO: "ok", CONFIRMADO: "ok", REGISTRADO: "ok", EMITIDA: "ok", VALIDADA: "ok", OK: "ok",
  PARCIAL: "alerta", PENDIENTE: "alerta", PENDIENTE_REVISION: "alerta", BORRADOR: "neutro", PENDIENTE_FIRMA: "alerta", ADVERTENCIA: "alerta", MAPEADO: "alerta", ANALIZADO: "info", SIN_FACTURAR: "alerta",
  VENCIDO: "error", VENCIDA: "error", ERROR: "error", DUPLICADO: "error", REVERTIDO: "error", ANULADA: "neutro", RESCINDIDO: "neutro", FINALIZADO: "neutro", CANCELADO: "neutro",
  DISPONIBLE: "info", RESERVADA: "info", EN_MANTENIMIENTO: "alerta", EN_REMODELACION: "alerta", FUERA_DE_SERVICIO: "neutro", EN_DISPUTA: "error", IMPORTADO: "info", MANUAL: "neutro", GENERADO: "neutro",
};

export function Estado({ v }: { v: string }) {
  const t = TONOS[ESTADO_TONO[v] ?? "neutro"];
  return <span className={`inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium tracking-wide ${t}`}>{v.replaceAll("_", " ")}</span>;
}

export function Titulo({ eyebrow, children, acciones }: { eyebrow?: string; children: React.ReactNode; acciones?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-dorado-d">{eyebrow}</div>}
        <h1 className="font-serif text-2xl font-semibold text-petroleo">{children}</h1>
      </div>
      {acciones && <div className="flex gap-2">{acciones}</div>}
    </div>
  );
}

export function Tarjeta({ titulo, children, className = "" }: { titulo?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-linea bg-white ${className}`}>
      {titulo && <div className="border-b border-linea px-4 py-2.5 text-sm font-medium text-petroleo">{titulo}</div>}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function KPI({ etiqueta, valor, nota, href }: { etiqueta: string; valor: React.ReactNode; nota?: string; href?: string }) {
  const c = (
    <div className="rounded-lg border border-linea bg-white p-4 transition hover:border-petroleo-tint">
      <div className="text-xs text-gris">{etiqueta}</div>
      <div className="mt-1 text-xl font-semibold text-petroleo">{valor}</div>
      {nota && <div className="mt-1 text-[11px] leading-snug text-gris">{nota}</div>}
    </div>
  );
  return href ? <Link href={href}>{c}</Link> : c;
}

export function Aviso({ tipo = "info", children }: { tipo?: "info" | "alerta" | "error"; children: React.ReactNode }) {
  return <div className={`rounded-md border px-3 py-2 text-sm ${TONOS[tipo]}`}>{children}</div>;
}

export function Vacio({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-dashed border-linea p-6 text-center text-sm text-gris">{children}</div>;
}
