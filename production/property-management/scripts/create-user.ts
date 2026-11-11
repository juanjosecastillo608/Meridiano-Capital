/**
 * Crea un usuario. La contraseña se pide por variable de entorno para que no
 * quede en el historial de la shell ni en logs.
 *
 *   NUEVA_PASSWORD='...' npx tsx scripts/create-user.ts email@dominio "Nombre" SUPERADMIN [sociedadId]
 */
import { PrismaClient, type Rol } from "@prisma/client";
import { hashPassword } from "../src/server/auth";
import { ROLES_GLOBALES } from "../src/server/authz";

const prisma = new PrismaClient();

async function main() {
  const [email, nombre, rol, sociedadId] = process.argv.slice(2);
  const pw = process.env.NUEVA_PASSWORD;
  if (!email || !nombre || !rol || !pw) throw new Error("Uso: NUEVA_PASSWORD=... create-user <email> <nombre> <ROL> [sociedadId]");
  if (!sociedadId && !ROLES_GLOBALES.includes(rol as Rol)) throw new Error(`El rol ${rol} requiere sociedadId.`);
  const u = await prisma.usuario.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: { email: email.toLowerCase(), nombre, passwordHash: await hashPassword(pw) },
  });
  const existe = await prisma.asignacionRol.findFirst({ where: { usuarioId: u.id, rol: rol as Rol, sociedadId: sociedadId ?? null, propiedadId: null } });
  if (!existe) await prisma.asignacionRol.create({ data: { usuarioId: u.id, rol: rol as Rol, sociedadId: sociedadId ?? null } });
  console.log(`Usuario ${u.email} con rol ${rol}${sociedadId ? ` en sociedad ${sociedadId}` : " (global)"}.`);
}

main().finally(() => prisma.$disconnect());
