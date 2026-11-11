import { d, redondear, sumar, Decimal, type MonedaCodigo } from "./money";

export type Criterio = "M2" | "COEFICIENTE" | "IMPORTE_FIJO" | "PARTES_IGUALES" | "MANUAL";

export interface UnidadParticipante {
  unidadId: string;
  superficieM2?: Decimal | string | null;
  coeficiente?: Decimal | string | null;
  importeFijo?: Decimal | string | null; // IMPORTE_FIJO / MANUAL
}

export interface ItemDistribucion {
  unidadId: string;
  base: Decimal;
  importe: Decimal;
}

/**
 * Distribuye un total entre unidades. Usa el método del mayor resto para que
 * la suma de los importes redondeados sea EXACTAMENTE el total (sin
 * centavos/guaraníes perdidos). Para IMPORTE_FIJO/MANUAL valida que la suma
 * cuadre con el total y no reparte diferencias por su cuenta.
 */
export function distribuir(total: Decimal | string, moneda: MonedaCodigo, criterio: Criterio, unidades: UnidadParticipante[]): { items: ItemDistribucion[]; errores: string[] } {
  const T = redondear(total, moneda);
  const errores: string[] = [];
  if (!unidades.length) return { items: [], errores: ["No hay unidades participantes."] };

  if (criterio === "IMPORTE_FIJO" || criterio === "MANUAL") {
    const items = unidades.map((u) => ({ unidadId: u.unidadId, base: d(u.importeFijo), importe: redondear(d(u.importeFijo), moneda) }));
    const faltan = unidades.filter((u) => u.importeFijo == null).map((u) => u.unidadId);
    if (faltan.length) errores.push(`Unidades sin importe asignado: ${faltan.join(", ")}`);
    const s = sumar(items.map((i) => i.importe));
    if (!s.equals(T)) errores.push(`La suma asignada (${s}) no coincide con el total (${T}).`);
    return { items, errores };
  }

  const bases = unidades.map((u) => {
    if (criterio === "M2") return u.superficieM2 == null ? null : d(u.superficieM2);
    if (criterio === "COEFICIENTE") return u.coeficiente == null ? null : d(u.coeficiente);
    return new Decimal(1);
  });
  const sinBase = unidades.filter((_, i) => bases[i] === null || bases[i]!.lessThanOrEqualTo(0)).map((u) => u.unidadId);
  if (sinBase.length) return { items: [], errores: [`Unidades sin ${criterio === "M2" ? "superficie" : "coeficiente"} válido: ${sinBase.join(", ")}. No se distribuye con datos faltantes.`] };

  const sumaBases = sumar(bases as Decimal[]);
  const paso = new Decimal(1).div(new Decimal(10).pow(moneda === "PYG" ? 0 : 2));
  const crudos = (bases as Decimal[]).map((b) => T.times(b).div(sumaBases));
  const piso = crudos.map((c) => c.div(paso).floor().times(paso));
  let resto = T.minus(sumar(piso)).div(paso).round().toNumber();
  const orden = crudos.map((c, i) => ({ i, frac: c.minus(piso[i]) })).sort((a, b) => b.frac.comparedTo(a.frac) || a.i - b.i);
  const finales = [...piso];
  for (const o of orden) {
    if (resto <= 0) break;
    finales[o.i] = finales[o.i].plus(paso);
    resto--;
  }
  return { items: unidades.map((u, i) => ({ unidadId: u.unidadId, base: (bases as Decimal[])[i], importe: finales[i] })), errores };
}

/**
 * RN-EXP-03: un gasto solo se traslada al inquilino si es ORDINARIO/EXTRAORDINARIO
 * (no PROPIETARIO) y el contrato asigna explícitamente las expensas al inquilino.
 */
export function esTrasladable(tipoGasto: "ORDINARIO" | "EXTRAORDINARIO" | "PROPIETARIO", responsabilidadContrato: string | null | undefined): boolean {
  if (tipoGasto === "PROPIETARIO") return false;
  return responsabilidadContrato === "INQUILINO";
}
