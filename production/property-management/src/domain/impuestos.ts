import { d, redondear, Decimal, type MonedaCodigo } from "./money";

/**
 * Motor de impuestos configurable y versionado.
 *
 * Las reglas viven en la tabla ReglaFiscal (nunca hardcodeadas aquí). Una regla
 * PENDIENTE no se usa para calcular: la obligación se genera con IVA = 0 y
 * `ivaPendiente = true`, y queda bloqueada para facturar hasta que exista una
 * regla validada. Así nunca se asume que alquiler, expensas o servicios
 * tienen el mismo tratamiento.
 */
export type EstadoValidacionFiscal = "PENDIENTE" | "CONFIRMADA_FOUNDER" | "VALIDADA_CONTADOR";

export interface ReglaFiscalDTO {
  id: string;
  codigo: string;
  categoria: string;
  tasaPct: Decimal | string;
  baseImponiblePct: Decimal | string;
  ivaIncluido: boolean;
  vigenteDesde: Date;
  vigenteHasta: Date | null;
  version: number;
  estadoValidacion: EstadoValidacionFiscal;
}

export function resolverRegla(reglas: ReglaFiscalDTO[], categoria: string, f: Date): ReglaFiscalDTO | null {
  const candidatas = reglas
    .filter((r) => r.categoria === categoria && r.vigenteDesde <= f && (!r.vigenteHasta || r.vigenteHasta >= f))
    .sort((a, b) => b.version - a.version);
  return candidatas[0] ?? null;
}

export interface ResultadoIva {
  neto: Decimal;
  iva: Decimal;
  total: Decimal;
  reglaId: string | null;
  pendiente: boolean;
  motivo?: string;
}

/**
 * Calcula IVA sobre un importe contractual.
 * - ivaIncluido=false: neto = importe; IVA = neto × base% × tasa%.
 * - ivaIncluido=true:  total = importe; neto = total / (1 + base% × tasa%).
 */
export function calcularIva(importe: Decimal | string, regla: ReglaFiscalDTO | null, moneda: MonedaCodigo): ResultadoIva {
  const monto = d(importe);
  if (!regla) return { neto: redondear(monto, moneda), iva: new Decimal(0), total: redondear(monto, moneda), reglaId: null, pendiente: true, motivo: "Sin regla fiscal para la categoría/fecha." };
  if (regla.estadoValidacion === "PENDIENTE")
    return { neto: redondear(monto, moneda), iva: new Decimal(0), total: redondear(monto, moneda), reglaId: regla.id, pendiente: true, motivo: `Regla ${regla.codigo} v${regla.version} pendiente de validación.` };
  const factor = d(regla.baseImponiblePct).div(100).times(d(regla.tasaPct).div(100));
  if (regla.ivaIncluido) {
    const total = redondear(monto, moneda);
    const neto = redondear(total.div(d(1).plus(factor)), moneda);
    return { neto, iva: total.minus(neto), total, reglaId: regla.id, pendiente: false };
  }
  const neto = redondear(monto, moneda);
  const iva = redondear(neto.times(factor), moneda);
  return { neto, iva, total: neto.plus(iva), reglaId: regla.id, pendiente: false };
}

/** Categoría fiscal por concepto de obligación. */
export function categoriaFiscal(concepto: string, categoriaContrato: string): string {
  if (concepto === "ALQUILER") return categoriaContrato; // ALQUILER_RESIDENCIAL | ALQUILER_COMERCIAL | RENTA_TEMPORAL
  return concepto; // EXPENSAS, SERVICIOS, INTERESES, PENALIDAD, ... — cada uno con su propia regla
}
