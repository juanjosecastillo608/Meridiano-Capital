import { PrismaClient, Prisma } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

// Sin logging de queries: los parámetros pueden contener datos personales.
export const prisma = g.prisma ?? new PrismaClient({ log: ["warn", "error"] });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

export type Tx = Prisma.TransactionClient;
export { Prisma };

/** Error de negocio con mensaje apto para mostrar al usuario. */
export class ErrorNegocio extends Error {
  constructor(message: string, public codigo = "NEGOCIO", public detalle?: unknown) {
    super(message);
  }
}

export class ErrorPermiso extends ErrorNegocio {
  constructor(message = "No tiene permiso para esta operación.") {
    super(message, "PERMISO");
  }
}
