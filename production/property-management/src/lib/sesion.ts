import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, sesionDesdeToken } from "@/server/auth";
import type { Sesion } from "@/server/authz";

export async function obtenerSesion(): Promise<Sesion | null> {
  const c = await cookies();
  return sesionDesdeToken(c.get(COOKIE_SESION)?.value);
}

export async function requerirSesion(): Promise<Sesion> {
  const s = await obtenerSesion();
  if (!s) redirect("/login");
  return s;
}
