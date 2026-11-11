import { finEfectivo, type EstadoContrato } from "./contratos";

export type EstadoOperativo = "OPERATIVA" | "RESERVADA" | "EN_MANTENIMIENTO" | "EN_REMODELACION" | "FUERA_DE_SERVICIO";
export type EstadoOcupacion = "DISPONIBLE" | "OCUPADA" | "RESERVADA" | "EN_MANTENIMIENTO" | "EN_REMODELACION" | "FUERA_DE_SERVICIO";

export interface ContratoOcupacion {
  estado: EstadoContrato;
  fechaInicio: Date;
  fechaFin: Date;
  fechaRescision?: Date | null;
  fechaEntrega?: Date | null;
  fechaDevolucion?: Date | null;
}

/**
 * RN-UNI-02: la ocupación se deriva, no se carga a mano.
 * Ocupada = hay un contrato VIGENTE/VENCIDO cuyo rango incluye la fecha, la
 * unidad fue entregada (si se registró la entrega) y aún no fue devuelta.
 * Un contrato VENCIDO sin devolución registrada sigue ocupando (el inquilino
 * puede seguir en la unidad).
 */
export function estaOcupada(contratos: ContratoOcupacion[], f: Date): boolean {
  return contratos.some((c) => {
    if (!["VIGENTE", "VENCIDO"].includes(c.estado)) return false;
    if (c.fechaDevolucion && c.fechaDevolucion <= f) return false;
    const inicio = c.fechaEntrega ?? c.fechaInicio;
    if (inicio > f) return false;
    if (c.estado === "VENCIDO" && !c.fechaDevolucion) return true;
    return finEfectivo(c) >= f;
  });
}

export function estadoOcupacion(operativo: EstadoOperativo, contratos: ContratoOcupacion[], f: Date): EstadoOcupacion {
  if (estaOcupada(contratos, f)) return "OCUPADA";
  if (operativo === "OPERATIVA") return "DISPONIBLE";
  return operativo;
}
