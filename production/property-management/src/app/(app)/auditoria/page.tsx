import { requerirSesion } from "@/lib/sesion";
import { prisma } from "@/server/db";
import { filtroSociedad, puede, alcance } from "@/server/authz";
import { Titulo, Tarjeta, Vacio, Aviso } from "@/components/ui";

export default async function Auditoria() {
  const s = await requerirSesion();
  const a = alcance(s);
  const permitido = a.global ? puede(s, "VER_AUDITORIA") : a.sociedadIds.some((id) => puede(s, "VER_AUDITORIA", id));
  if (!permitido) return <Aviso tipo="error">Su rol no incluye acceso a la auditoría.</Aviso>;
  const logs = await prisma.auditLog.findMany({ where: filtroSociedad(s), orderBy: { createdAt: "desc" }, take: 200, include: { usuario: { select: { nombre: true } } } });
  return (
    <>
      <Titulo eyebrow="Trazabilidad">Auditoría de operaciones críticas</Titulo>
      {logs.length === 0 ? <Vacio>Sin registros.</Vacio> : (
        <Tarjeta>
          <table className="tabla"><thead><tr><th>Fecha (UTC)</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Motivo</th></tr></thead>
            <tbody>{logs.map((l) => <tr key={l.id}><td className="whitespace-nowrap text-xs">{l.createdAt.toISOString().replace("T", " ").slice(0, 19)}</td><td>{l.usuario?.nombre ?? "sistema"}</td><td className="text-xs">{l.accion}</td><td className="text-xs">{l.entidad} · {l.entidadId.slice(-8)}</td><td className="text-xs">{l.motivo ?? "—"}</td></tr>)}</tbody></table>
        </Tarjeta>
      )}
    </>
  );
}
