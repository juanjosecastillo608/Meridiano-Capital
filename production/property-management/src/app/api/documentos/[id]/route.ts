import { obtenerSesion } from "@/lib/sesion";
import { obtenerArchivo } from "@/server/services/documentos";

/** Descarga con verificación de sesión, sociedad y sensibilidad en cada request. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await obtenerSesion();
  if (!s) return new Response("No autenticado", { status: 401 });
  const { id } = await params;
  try {
    const { documento: d, contenido } = await obtenerArchivo(s, id);
    const nombre = d.nombreArchivo.replace(/[^\w.\- ]/g, "_");
    return new Response(new Uint8Array(contenido), { headers: { "Content-Type": d.mime, "Content-Disposition": `inline; filename="${nombre}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response("Documento no encontrado o sin acceso", { status: 404 });
  }
}
