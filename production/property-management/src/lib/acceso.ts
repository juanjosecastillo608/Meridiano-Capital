import "server-only";
import { notFound } from "next/navigation";
import { ErrorNegocio } from "@/server/db";
import { alcance, puede, type Permiso, type Sesion } from "@/server/authz";

/**
 * Para páginas con id en la URL: "no existe" y "no autorizado" responden
 * igual (404 "Sin acceso"), así manipular la URL no revela la existencia de
 * datos de otra sociedad.
 */
export async function protegido<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ErrorNegocio && ["PERMISO", "NO_ENCONTRADO"].includes(e.codigo)) notFound();
    if (e instanceof ErrorNegocio && /no encontrad/i.test(e.message)) notFound();
    throw e;
  }
}

/** ¿Tiene el permiso en al menos una de sus sociedades? (para mostrar menús/acciones). */
export function puedeEnAlguna(s: Sesion, permiso: Permiso): boolean {
  const a = alcance(s);
  return a.global ? puede(s, permiso) : a.sociedadIds.some((id) => puede(s, permiso, id));
}
