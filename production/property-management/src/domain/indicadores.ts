import { d, sumar, Decimal } from "./money";

/**
 * Indicadores con fórmula, período y origen explícitos (requisito §15).
 * Cada indicador devuelve `valor = null` cuando falta un dato de base, en vez
 * de calcular sobre valores inexistentes.
 */
export interface Indicador {
  clave: string;
  nombre: string;
  valor: Decimal | null;
  unidad: "MONEDA" | "PCT" | "CANTIDAD";
  formula: string;
  origen: string;
  periodo: string;
  nota?: string;
}

export interface BaseIndicadores {
  periodo: string;
  unidadesTotales: number;
  unidadesOcupadas: number;
  unidadesFueraDeServicio: number;
  ingresoContractual: Decimal; // Σ alquiler vigente de contratos activos
  ingresoPotencial: Decimal | null; // Σ alquiler de referencia de todas las unidades (si todas tienen referencia)
  facturado: Decimal;
  devengado: Decimal; // Σ importeTotal de obligaciones del período
  cobrado: Decimal; // Σ aplicaciones a obligaciones del período
  saldoVencido: Decimal;
  gastosOperativos: Decimal;
  capex: Decimal;
  valorInmueble: Decimal | null; // solo si está documentado (fuente)
}

const pct = (a: Decimal, b: Decimal) => (b.isZero() ? null : a.div(b).times(100).toDecimalPlaces(2));

export function calcularIndicadores(b: BaseIndicadores): Indicador[] {
  const p = b.periodo;
  const flujoNeto = b.cobrado.minus(b.gastosOperativos).minus(b.capex);
  const resultadoOperativo = b.devengado.minus(b.gastosOperativos);
  const anualBruto = b.ingresoContractual.times(12);
  const anualNeto = b.ingresoContractual.minus(b.gastosOperativos).times(12);
  const disponibles = b.unidadesTotales - b.unidadesFueraDeServicio;
  return [
    { clave: "ingreso_contractual", nombre: "Ingreso mensual contractual", valor: b.ingresoContractual, unidad: "MONEDA", formula: "Σ alquiler vigente de contratos VIGENTE/VENCIDO", origen: "Contratos + condiciones", periodo: p },
    { clave: "ingreso_facturado", nombre: "Ingreso facturado", valor: b.facturado, unidad: "MONEDA", formula: "Σ total de facturas EMITIDA/VALIDADA del período", origen: "Facturas", periodo: p },
    { clave: "ingreso_cobrado", nombre: "Ingreso efectivamente cobrado", valor: b.cobrado, unidad: "MONEDA", formula: "Σ aplicaciones de pagos REGISTRADO a obligaciones del período", origen: "Cobranzas", periodo: p },
    { clave: "saldo_vencido", nombre: "Saldo vencido", valor: b.saldoVencido, unidad: "MONEDA", formula: "Σ saldo de obligaciones PENDIENTE/PARCIAL con vencimiento < hoy", origen: "Obligaciones", periodo: p },
    { clave: "morosidad", nombre: "Morosidad", valor: pct(b.devengado.minus(b.cobrado), b.devengado), unidad: "PCT", formula: "(devengado − cobrado) / devengado", origen: "Obligaciones + cobranzas", periodo: p },
    { clave: "ocupacion_fisica", nombre: "Ocupación física", valor: disponibles ? new Decimal(b.unidadesOcupadas).div(disponibles).times(100).toDecimalPlaces(2) : null, unidad: "PCT", formula: "unidades ocupadas / (unidades − fuera de servicio)", origen: "Contratos (derivado)", periodo: p },
    { clave: "ocupacion_economica", nombre: "Ocupación económica", valor: b.ingresoPotencial ? pct(b.ingresoContractual, b.ingresoPotencial) : null, unidad: "PCT", formula: "ingreso contractual / ingreso potencial (alquiler de referencia de todas las unidades)", origen: "Contratos + alquiler de referencia", periodo: p, nota: b.ingresoPotencial ? undefined : "Faltan alquileres de referencia con fuente en una o más unidades." },
    { clave: "gastos_operativos", nombre: "Gastos operativos", valor: b.gastosOperativos, unidad: "MONEDA", formula: "Σ egresos OPEX del período", origen: "Egresos", periodo: p },
    { clave: "flujo_neto", nombre: "Flujo neto de caja", valor: flujoNeto, unidad: "MONEDA", formula: "cobrado − OPEX − CAPEX", origen: "Cobranzas + egresos", periodo: p },
    { clave: "resultado_operativo", nombre: "Resultado operativo", valor: resultadoOperativo, unidad: "MONEDA", formula: "devengado − OPEX", origen: "Obligaciones + egresos", periodo: p },
    { clave: "rent_bruta", nombre: "Rentabilidad bruta anualizada", valor: b.valorInmueble ? pct(anualBruto, b.valorInmueble) : null, unidad: "PCT", formula: "(ingreso contractual × 12) / valor documentado del inmueble", origen: "Contratos + valor con fuente", periodo: p, nota: b.valorInmueble ? "Proyección anualizada, no realizada." : "Sin valor de inmueble documentado: no se calcula." },
    { clave: "rent_neta", nombre: "Rentabilidad neta anualizada", valor: b.valorInmueble ? pct(anualNeto, b.valorInmueble) : null, unidad: "PCT", formula: "((ingreso contractual − OPEX) × 12) / valor documentado", origen: "Contratos + egresos + valor con fuente", periodo: p, nota: b.valorInmueble ? "Proyección anualizada del mes; no incluye vacancia futura ni CAPEX." : "Sin valor de inmueble documentado: no se calcula." },
    { clave: "capex", nombre: "Inversión en remodelaciones (CAPEX)", valor: b.capex, unidad: "MONEDA", formula: "Σ egresos CAPEX del período", origen: "Egresos", periodo: p },
  ];
}

export { sumar, d };
