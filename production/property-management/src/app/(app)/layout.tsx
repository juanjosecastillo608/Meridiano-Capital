import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { alcance, puede } from "@/server/authz";

const NAV: { href: string; label: string; permiso?: Parameters<typeof puede>[1] }[] = [
  { href: "/", label: "Panel general" },
  { href: "/sociedades", label: "Sociedades" },
  { href: "/contratos", label: "Contratos" },
  { href: "/inquilinos", label: "Inquilinos" },
  { href: "/cobranzas", label: "Cobranzas" },
  { href: "/importaciones", label: "Importar Excel" },
  { href: "/auditoria", label: "Auditoría" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await requerirSesion();
  const a = alcance(s);
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-petroleo text-white md:flex">
        <Link href="/" className="flex items-center gap-3 px-5 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/meridiano-isotipo-inverso.svg" alt="" className="h-8 w-8" />
          <div>
            <div className="font-serif text-[15px] font-semibold leading-tight">Meridiano Capital</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">Property Management</div>
          </div>
        </Link>
        <nav className="flex-1 px-3">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded px-3 py-2 text-sm text-white/85 hover:bg-petroleo-tint hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/70">
          <div className="truncate font-medium text-white">{s.nombre}</div>
          <div className="truncate">{a.global ? "Acceso global" : `${a.sociedadIds.length} sociedad(es)`}</div>
          <form action="/api/logout" method="post" className="mt-2">
            <button className="text-white/70 underline-offset-2 hover:text-white hover:underline">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-linea bg-white/95 px-6 py-3 backdrop-blur">
          <form action="/buscar" className="flex-1">
            <input name="q" placeholder="Buscar sociedad, propiedad, unidad, inquilino o contrato…" className="w-full max-w-xl rounded-md border border-linea px-3 py-1.5 text-sm" />
          </form>
          <span className="hidden text-xs text-gris sm:inline">Zona horaria: America/Asunción</span>
        </header>
        <main className="flex-1 bg-[#fbf9f5] px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
