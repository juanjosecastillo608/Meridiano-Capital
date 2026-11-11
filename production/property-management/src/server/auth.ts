import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";
import type { Sesion } from "./authz";

/**
 * Autenticación por email + contraseña (bcrypt, costo 12) y cookie de sesión
 * firmada (JWT HS256, httpOnly, sameSite=lax, 8 h). El JWT solo lleva el id
 * de usuario: roles y sociedades se releen de la base en cada request, así un
 * cambio de permisos tiene efecto inmediato.
 */
export const COOKIE_SESION = "mc_pm_sesion";
const DURACION_S = 8 * 60 * 60;

function secreto(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET ausente o demasiado corto (mín. 32 caracteres).");
  return new TextEncoder().encode(s);
}

export async function hashPassword(p: string): Promise<string> {
  if (p.length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres.");
  return bcrypt.hash(p, 12);
}

export async function verificarCredenciales(email: string, password: string): Promise<string | null> {
  const u = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } });
  // Comparar siempre (aunque no exista) para no revelar existencia por tiempo de respuesta.
  const hash = u?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const ok = await bcrypt.compare(password, hash);
  if (!u || !u.activo || !ok) return null;
  await prisma.usuario.update({ where: { id: u.id }, data: { ultimoAcceso: new Date() } });
  return u.id;
}

export async function firmarSesion(usuarioId: string): Promise<string> {
  return new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(usuarioId).setIssuedAt().setExpirationTime(`${DURACION_S}s`).sign(secreto());
}

export async function sesionDesdeToken(token: string | undefined): Promise<Sesion | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secreto());
    if (!payload.sub) return null;
    const u = await prisma.usuario.findUnique({ where: { id: payload.sub }, include: { asignaciones: true } });
    if (!u || !u.activo) return null;
    return { usuarioId: u.id, email: u.email, nombre: u.nombre, asignaciones: u.asignaciones.map((a) => ({ rol: a.rol, sociedadId: a.sociedadId, propiedadId: a.propiedadId })) };
  } catch {
    return null;
  }
}

export const OPCIONES_COOKIE = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: DURACION_S };
