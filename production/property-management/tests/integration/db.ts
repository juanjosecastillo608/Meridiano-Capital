import { prisma } from "@/server/db";
import type { Sesion } from "@/server/authz";
import { sesionSistema } from "@/server/authz";

const TABLAS_NEGOCIO = [
  "AplicacionPago", "FacturaItem", "Factura", "Timbrado", "Pago", "Obligacion", "LiquidacionExpensasItem", "LiquidacionExpensas", "GastoEdificio",
  "PartidaRemodelacion", "Egreso", "ProyectoRemodelacion", "OrdenTrabajo", "Proveedor", "CondicionContrato", "ContratoParte", "ContratoUnidad", "Contrato",
  "Persona", "Unidad", "Titularidad", "AsignacionRol", "Propiedad", "CuentaBancaria", "ImportRow", "ImportBatch", "Documento", "AuditLog", "Usuario", "Sociedad",
];

/** Vacía las tablas de negocio (conserva ReglaFiscal y ConfiguracionAlerta del seed). Solo en bases *_test. */
export async function limpiar() {
  const [{ db }] = await prisma.$queryRaw<{ db: string }[]>`SELECT current_database() AS db`;
  if (!db.endsWith("_test")) throw new Error(`Negado: limpiar() solo corre en bases *_test (actual: ${db}).`);
  await prisma.$executeRawUnsafe(`TRUNCATE ${TABLAS_NEGOCIO.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`);
}

export const admin = sesionSistema;

export function sesionDe(sociedadId: string, rol: Sesion["asignaciones"][number]["rol"] = "ADMIN_SOCIEDAD", usuarioId = "u-test"): Sesion {
  return { usuarioId, email: `${usuarioId}@test.local`, nombre: "Usuario de prueba", asignaciones: [{ rol, sociedadId, propiedadId: null }] };
}

export { prisma };
