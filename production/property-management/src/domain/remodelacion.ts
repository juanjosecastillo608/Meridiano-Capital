import { d, sumar, Decimal } from "./money";

export type CalidadDato = "DATO_RECIBIDO" | "COTIZACION_VERIFICADA" | "CALCULO" | "SUPUESTO" | "INFORMACION_FALTANTE" | "REVISION_TECNICA_REQUERIDA";

export interface Partida {
  rubro: string;
  tipo: string;
  descripcion: string;
  total: Decimal | string | null;
  calidadDato: CalidadDato;
}

export interface ResumenPresupuesto {
  total: Decimal;
  porRubro: Record<string, Decimal>;
  porCalidad: Record<CalidadDato, Decimal>;
  partidasSinPrecio: number;
  pctVerificado: Decimal; // % del total respaldado por DATO_RECIBIDO o COTIZACION_VERIFICADA
  aprobable: boolean;
  motivos: string[];
}

export function resumirPresupuesto(partidas: Partida[]): ResumenPresupuesto {
  const porRubro: Record<string, Decimal> = {};
  const porCalidad = Object.fromEntries(
    (["DATO_RECIBIDO", "COTIZACION_VERIFICADA", "CALCULO", "SUPUESTO", "INFORMACION_FALTANTE", "REVISION_TECNICA_REQUERIDA"] as CalidadDato[]).map((k) => [k, new Decimal(0)]),
  ) as Record<CalidadDato, Decimal>;
  let sinPrecio = 0;
  for (const p of partidas) {
    if (p.total == null) { sinPrecio++; continue; }
    const t = d(p.total);
    porRubro[p.rubro] = (porRubro[p.rubro] ?? new Decimal(0)).plus(t);
    porCalidad[p.calidadDato] = porCalidad[p.calidadDato].plus(t);
  }
  const total = sumar(Object.values(porRubro));
  const verificado = porCalidad.DATO_RECIBIDO.plus(porCalidad.COTIZACION_VERIFICADA);
  const motivos: string[] = [];
  if (sinPrecio) motivos.push(`${sinPrecio} partida(s) sin precio (INFORMACION_FALTANTE).`);
  const revision = partidas.filter((p) => p.calidadDato === "REVISION_TECNICA_REQUERIDA").length;
  if (revision) motivos.push(`${revision} partida(s) requieren revisión técnica.`);
  if (porCalidad.SUPUESTO.greaterThan(0)) motivos.push("Hay importes basados en supuestos: no son cotizaciones verificadas.");
  return {
    total,
    porRubro,
    porCalidad,
    partidasSinPrecio: sinPrecio,
    pctVerificado: total.isZero() ? new Decimal(0) : verificado.div(total).times(100).toDecimalPlaces(1),
    aprobable: sinPrecio === 0 && revision === 0,
    motivos,
  };
}

/** Desviación presupuestaria: (real − aprobado) / aprobado. */
export function desviacion(aprobado: Decimal | string | null, real: Decimal | string): { absoluta: Decimal; pct: Decimal | null } {
  const r = d(real);
  if (aprobado == null || d(aprobado).isZero()) return { absoluta: r, pct: null };
  const a = d(aprobado);
  return { absoluta: r.minus(a), pct: r.minus(a).div(a).times(100).toDecimalPlaces(2) };
}

/**
 * Impacto económico PROYECTADO de una remodelación (nunca rentabilidad realizada).
 * Requiere alquiler posterior con fuente documentada (p. ej. AMC SK-14).
 */
export function impactoRemodelacion(inversion: Decimal | string, alquilerAnterior: Decimal | string | null, alquilerPosterior: Decimal | string | null, fuentePosterior: string | null) {
  const inv = d(inversion);
  const faltantes: string[] = [];
  if (alquilerAnterior == null) faltantes.push("alquiler anterior");
  if (alquilerPosterior == null) faltantes.push("alquiler posterior esperado");
  if (!fuentePosterior) faltantes.push("fuente del alquiler posterior (AMC)");
  if (faltantes.length || inv.isZero()) return { tipo: "PROYECTADO" as const, calculable: false, faltantes };
  const incremento = d(alquilerPosterior).minus(d(alquilerAnterior));
  const anual = incremento.times(12);
  return {
    tipo: "PROYECTADO" as const,
    calculable: true,
    faltantes,
    incrementoMensual: incremento,
    rentabilidadIncrementalAnualPct: anual.div(inv).times(100).toDecimalPlaces(2),
    recuperacionMeses: incremento.lessThanOrEqualTo(0) ? null : inv.div(incremento).toDecimalPlaces(1),
  };
}
