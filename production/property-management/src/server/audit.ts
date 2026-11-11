import type { Tx } from "./db";
import type { Sesion } from "./authz";
import { Prisma } from "@prisma/client";

export type AccionAuditada =
  | "SOCIEDAD_CREAR" | "SOCIEDAD_MODIFICAR"
  | "CUENTA_BANCARIA_CREAR" | "CUENTA_BANCARIA_MODIFICAR"
  | "PROPIEDAD_CREAR" | "UNIDAD_CREAR" | "UNIDAD_MODIFICAR"
  | "PERSONA_CREAR" | "PERSONA_MODIFICAR"
  | "CONTRATO_CREAR" | "CONTRATO_CAMBIAR_ESTADO" | "CONTRATO_MODIFICAR_ALQUILER" | "CONTRATO_RENOVAR"
  | "OBLIGACIONES_GENERAR" | "OBLIGACION_ANULAR"
  | "PAGO_REGISTRAR" | "PAGO_REVERTIR" | "PAGO_IMPUTAR_SALDO" | "PAGO_CONCILIAR"
  | "FACTURA_PREPARAR" | "FACTURA_EMITIR" | "FACTURA_ANULAR"
  | "GASTO_APROBAR" | "REMODELACION_APROBAR" | "ORDEN_TRABAJO_CAMBIAR_ESTADO"
  | "EXPENSAS_LIQUIDAR" | "EXPENSAS_APROBAR"
  | "IMPORTACION_ANALIZAR" | "IMPORTACION_CONFIRMAR" | "IMPORTACION_CANCELAR"
  | "ELIMINACION_LOGICA";

/** Serializa Decimal/Date a JSON estable para el log. */
function plano(v: unknown): Prisma.InputJsonValue | undefined {
  if (v === undefined) return undefined;
  return JSON.parse(JSON.stringify(v, (_k, x) => (x instanceof Prisma.Decimal ? x.toString() : x))) as Prisma.InputJsonValue;
}

/** Se escribe dentro de la MISMA transacción que la operación auditada. */
export async function auditar(
  tx: Tx,
  s: Sesion,
  accion: AccionAuditada,
  entidad: string,
  entidadId: string,
  datos: { sociedadId?: string | null; antes?: unknown; despues?: unknown; motivo?: string | null } = {},
) {
  await tx.auditLog.create({
    data: {
      usuarioId: s.usuarioId === "sistema" ? null : s.usuarioId,
      accion,
      entidad,
      entidadId,
      sociedadId: datos.sociedadId ?? null,
      antes: plano(datos.antes),
      despues: plano(datos.despues),
      motivo: datos.motivo ?? null,
    },
  });
}
