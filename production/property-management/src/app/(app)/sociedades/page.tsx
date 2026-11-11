import Link from "next/link";
import { requerirSesion } from "@/lib/sesion";
import { listarSociedades } from "@/server/services/nucleo";
import { puede } from "@/server/authz";
import { Estado, Titulo, Vacio } from "@/components/ui";

export default async function Sociedades() {
  const s = await requerirSesion();
  const socs = await listarSociedades(s);
  return (
    <>
      <Titulo eyebrow="Estructura" acciones={puede(s, "CREAR_SOCIEDAD") && <Link className="btn" href="/sociedades/nueva">Nueva sociedad</Link>}>Sociedades propietarias</Titulo>
      {socs.length === 0 ? <Vacio>No hay sociedades cargadas.</Vacio> : (
        <div className="rounded-lg border border-linea bg-white">
          <table className="tabla">
            <thead><tr><th>Razón social</th><th>RUC</th><th>Moneda</th><th>Estado</th><th>Datos</th><th className="num">Propiedades</th><th className="num">Contratos</th></tr></thead>
            <tbody>
              {socs.map((x) => (
                <tr key={x.id}>
                  <td><Link className="font-medium hover:underline" href={`/sociedades/${x.id}`}>{x.razonSocial}</Link></td>
                  <td>{x.ruc ?? <span className="text-gris">pendiente</span>}</td>
                  <td>{x.monedaOperacion}</td>
                  <td><Estado v={x.estado} /></td>
                  <td><Estado v={x.estadoDato} /></td>
                  <td className="num">{x._count.propiedades}</td>
                  <td className="num">{x._count.contratos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
