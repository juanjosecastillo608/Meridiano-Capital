import { requerirSesion } from "@/lib/sesion";
import { listarContratos, alertasVencimiento } from "@/server/services/contratos";
import { Dinero, Estado, Fecha, Titulo, Vacio, Tarjeta } from "@/components/ui";

export default async function Contratos() {
  const s = await requerirSesion();
  const [cs, alertas] = await Promise.all([listarContratos(s), alertasVencimiento(s)]);
  const alertaDe = new Map(alertas.map((a) => [a.contrato.id, a.alerta]));
  return (
    <>
      <Titulo eyebrow="Gestión contractual">Contratos</Titulo>
      {cs.length === 0 ? <Vacio>Sin contratos.</Vacio> : (
        <Tarjeta>
          <table className="tabla">
            <thead><tr><th>Código</th><th>Propiedad · unidad</th><th>Inquilino(s)</th><th>Estado</th><th>Inicio</th><th>Fin</th><th>Alerta</th><th className="num">Alquiler vigente</th><th>Categoría fiscal</th></tr></thead>
            <tbody>{cs.map((c) => {
              const a = alertaDe.get(c.id);
              return (
                <tr key={c.id}>
                  <td>{c.codigo}</td>
                  <td>{c.propiedad.codigo} · {c.unidades.map((u) => u.unidad.identificador).join(", ")}</td>
                  <td>{c.partes.filter((p) => p.rol === "INQUILINO").map((p) => p.persona.nombre).join(", ")}</td>
                  <td><Estado v={c.estado} /></td>
                  <td><Fecha v={c.fechaInicio} /></td><td><Fecha v={c.fechaFin} /></td>
                  <td>{a ? (a.vencido ? <Estado v="VENCIDO" /> : <span className="text-xs">≤ {a.umbral} días ({a.diasRestantes})</span>) : "—"}</td>
                  <td className="num">{c.condiciones[0] ? <Dinero v={c.condiciones[0].montoAlquiler} m={c.moneda} /> : "—"}</td>
                  <td className="text-xs">{c.categoriaFiscal.replaceAll("_", " ").toLowerCase()}</td>
                </tr>
              );
            })}</tbody>
          </table>
          <p className="mt-3 text-xs text-gris">Las alertas (90/60/30 días por defecto, configurables por sociedad) son avisos operativos y no modifican el estado jurídico del contrato.</p>
        </Tarjeta>
      )}
    </>
  );
}
