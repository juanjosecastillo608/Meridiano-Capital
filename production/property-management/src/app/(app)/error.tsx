"use client";

export default function ErrorApp({ error }: { error: Error & { digest?: string } }) {
  // En producción Next oculta el mensaje real; no se exponen detalles internos.
  const permiso = /permiso|sin acceso|no encontrad/i.test(error.message);
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg border border-linea bg-white p-6 text-sm">
      <h1 className="mb-2 font-serif text-xl font-semibold">{permiso ? "Sin acceso" : "No se pudo completar la operación"}</h1>
      <p className="text-gris">{permiso ? "El recurso no existe o no pertenece a las sociedades a las que su usuario tiene acceso." : error.message || "Error inesperado."}</p>
    </div>
  );
}
