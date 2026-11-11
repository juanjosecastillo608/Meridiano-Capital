import { d, Decimal, type MonedaCodigo } from "./money";
import { fechaVencimiento, inicioPeriodo, finPeriodo, periodoDe } from "./periodo";
import { montoVigente, finEfectivo, type Condicion, type EstadoContrato } from "./contratos";
import { calcularIva, resolverRegla, categoriaFiscal, type ReglaFiscalDTO } from "./impuestos";

export type Concepto = "ALQUILER" | "EXPENSAS" | "SERVICIOS" | "INTERESES" | "PENALIDAD" | "REPARACION_IMPUTABLE" | "OTRO";

export interface ContratoParaGenerar {
  id: string;
  codigo: string;
  sociedadId: string;
  propiedadId: string;
  unidadIds: string[];
  inquilinoPrincipalId: string;
  estado: EstadoContrato;
  categoriaFiscal: string;
  moneda: MonedaCodigo;
  diaVencimiento: number;
  fechaInicio: Date;
  fechaFin: Date;
  fechaRescision: Date | null;
  condiciones: Condicion[];
}

export interface ObligacionBorrador {
  sociedadId: string;
  propiedadId: string;
  unidadId: string | null;
  contratoId: string;
  personaId: string;
  periodo: string;
  concepto: Concepto;
  descripcion: string;
  fechaVencimiento: Date;
  moneda: MonedaCodigo;
  importeNeto: Decimal;
  iva: Decimal;
  importeTotal: Decimal;
  saldo: Decimal;
  reglaFiscalId: string | null;
  ivaPendiente: boolean;
  claveIdempotencia: string;
  requiereRevision: boolean;
  advertencias: string[];
}

/** Clave determinística: ejecutar dos veces el proceso mensual nunca duplica. */
export function claveObligacion(contratoId: string, periodo: string, concepto: Concepto, sufijo = ""): string {
  return `${contratoId}:${periodo}:${concepto}${sufijo ? ":" + sufijo : ""}`;
}

export interface ResultadoGeneracion {
  borradores: ObligacionBorrador[];
  omitidos: { contratoId: string; codigo: string; motivo: string }[];
}

/**
 * RN-OBL-01: genera la obligación de ALQUILER del período para cada contrato
 * VIGENTE (o VENCIDO aún ocupado) cuyo rango toque el período.
 *
 * Meses parciales (inicio o fin a mitad de mes): se genera el importe completo
 * marcado `requiereRevision`, porque el prorrateo no está definido en las
 * reglas de negocio (decisión pendiente PD-07). No se inventa una fórmula.
 *
 * Las expensas NO se generan aquí: salen de una liquidación de expensas
 * aprobada y solo si el contrato asigna la responsabilidad al inquilino.
 */
export function generarObligacionesAlquiler(contratos: ContratoParaGenerar[], periodo: string, reglas: ReglaFiscalDTO[]): ResultadoGeneracion {
  const borradores: ObligacionBorrador[] = [];
  const omitidos: ResultadoGeneracion["omitidos"] = [];
  const ini = inicioPeriodo(periodo);
  const fin = finPeriodo(periodo);

  for (const c of contratos) {
    if (!["VIGENTE", "VENCIDO"].includes(c.estado)) {
      omitidos.push({ contratoId: c.id, codigo: c.codigo, motivo: `Estado ${c.estado} no genera obligaciones.` });
      continue;
    }
    const finC = finEfectivo(c);
    if (c.fechaInicio > fin || finC < ini) {
      omitidos.push({ contratoId: c.id, codigo: c.codigo, motivo: "Fuera del rango del contrato." });
      continue;
    }
    const monto = montoVigente(c.condiciones, periodo);
    if (!monto) {
      omitidos.push({ contratoId: c.id, codigo: c.codigo, motivo: "Sin importe de alquiler registrado." });
      continue;
    }
    const advertencias: string[] = [];
    const parcial = c.fechaInicio > ini || finC < fin;
    if (parcial) advertencias.push("Mes parcial: el prorrateo no está definido (PD-07). Revisar importe.");
    if (c.estado === "VENCIDO") advertencias.push("Contrato vencido sin renovación registrada.");

    const venc = fechaVencimiento(periodo, c.diaVencimiento);
    const regla = resolverRegla(reglas, categoriaFiscal("ALQUILER", c.categoriaFiscal), venc);
    const iva = calcularIva(monto, regla, c.moneda);
    if (iva.pendiente && iva.motivo) advertencias.push(`IVA pendiente: ${iva.motivo}`);

    borradores.push({
      sociedadId: c.sociedadId,
      propiedadId: c.propiedadId,
      unidadId: c.unidadIds.length === 1 ? c.unidadIds[0] : null,
      contratoId: c.id,
      personaId: c.inquilinoPrincipalId,
      periodo,
      concepto: "ALQUILER",
      descripcion: `Alquiler ${periodo} — contrato ${c.codigo}`,
      fechaVencimiento: venc,
      moneda: c.moneda,
      importeNeto: iva.neto,
      iva: iva.iva,
      importeTotal: iva.total,
      saldo: iva.total,
      reglaFiscalId: iva.reglaId,
      ivaPendiente: iva.pendiente,
      claveIdempotencia: claveObligacion(c.id, periodo, "ALQUILER"),
      requiereRevision: parcial || iva.pendiente,
      advertencias,
    });
  }
  return { borradores, omitidos };
}

// ─────────────── Estado y saldo ───────────────

export type EstadoObligacion = "PENDIENTE" | "PARCIAL" | "PAGADA" | "ANULADA" | "EN_DISPUTA";

/** RN-COB-02: una obligación solo está PAGADA cuando su saldo es exactamente cero. */
export function estadoPorSaldo(total: Decimal, saldo: Decimal, actual: EstadoObligacion): EstadoObligacion {
  if (actual === "ANULADA" || actual === "EN_DISPUTA") return actual;
  if (saldo.isZero()) return "PAGADA";
  if (saldo.lessThan(total)) return "PARCIAL";
  return "PENDIENTE";
}

export function estaVencida(o: { estado: EstadoObligacion; fechaVencimiento: Date }, hoy: Date): boolean {
  return (o.estado === "PENDIENTE" || o.estado === "PARCIAL") && o.fechaVencimiento < hoy;
}

// ─────────────── Mora ───────────────

/**
 * RN-OBL-04: intereses moratorios solo si el contrato tiene tasa pactada Y
 * marcada como validada. Interés simple diario sobre saldo, a partir del
 * vencimiento + días de gracia. Nunca se aplica una tasa por defecto.
 */
export function calcularMora(
  saldo: Decimal,
  vencimiento: Date,
  hoy: Date,
  contrato: { moraTasaDiariaPct: Decimal | string | null; moraValidada: boolean; periodoGraciaDias: number },
  moneda: MonedaCodigo,
): { interes: Decimal; dias: number; aplicable: boolean; motivo?: string } {
  if (!contrato.moraValidada || contrato.moraTasaDiariaPct == null)
    return { interes: new Decimal(0), dias: 0, aplicable: false, motivo: "Mora no pactada o no validada." };
  const inicio = vencimiento.getTime() + contrato.periodoGraciaDias * 86_400_000;
  const dias = Math.max(0, Math.floor((hoy.getTime() - inicio) / 86_400_000));
  const interes = saldo.times(d(contrato.moraTasaDiariaPct).div(100)).times(dias);
  return { interes: interes.toDecimalPlaces(moneda === "PYG" ? 0 : 2), dias, aplicable: dias > 0 };
}

export { periodoDe };
