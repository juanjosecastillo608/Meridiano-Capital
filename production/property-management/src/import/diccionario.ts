/**
 * Diccionario de campos destino y sinónimos de encabezado. Es la única pieza
 * que conoce "cómo suelen llamarse" las columnas en los Excel de las
 * propiedades; el resto del importador es genérico. Ampliar acá cuando un
 * nuevo archivo use otros nombres — nunca hardcodear posiciones de columna.
 */
export type CampoDestino =
  | "unidad.identificador"
  | "unidad.tipologia"
  | "unidad.superficieM2"
  | "unidad.piso"
  | "unidad.medidorAnde"
  | "inquilino.nombre"
  | "inquilino.telefono"
  | "inquilino.documento"
  | "inquilino.email"
  | "contrato.alquiler"
  | "contrato.fechaInicio"
  | "contrato.fechaFin"
  | "periodo.pagoTotal"
  | "periodo.expensas"
  | "periodo.marcaPago"
  | "periodo.fechaPago"
  | "periodo.fechaProgramada"
  | "periodo.bonificacion"
  | "periodo.montoFactura"
  | "periodo.iva"
  | "observaciones"
  | "ignorar";

export interface DefCampo {
  campo: CampoDestino;
  etiqueta: string;
  sinonimos: RegExp[];
  tipo: "texto" | "importe" | "fecha" | "entero" | "decimal";
}

export const CAMPOS: DefCampo[] = [
  { campo: "unidad.identificador", etiqueta: "Unidad (identificación)", tipo: "texto", sinonimos: [/^unidad$/, /^(dpto|depto|departamento|unid|u)\.?$/, /^n[º°o]? ?(de )?(unidad|dpto|depto)/, /^local$/] },
  { campo: "unidad.tipologia", etiqueta: "Tipología / tipo de unidad", tipo: "texto", sinonimos: [/^tipolog/, /^tipo( de unidad)?$/] },
  { campo: "unidad.superficieM2", etiqueta: "Superficie m²", tipo: "decimal", sinonimos: [/^m2$/, /^m²$/, /^superficie/, /^sup\.?( m2)?$/] },
  { campo: "unidad.piso", etiqueta: "Piso", tipo: "texto", sinonimos: [/^piso$/, /^nivel$/] },
  { campo: "unidad.medidorAnde", etiqueta: "NIS ANDE (medidor)", tipo: "texto", sinonimos: [/^nis( ande)?$/, /^(n[º°o]? )?medidor( ande)?$/] },
  { campo: "inquilino.nombre", etiqueta: "Inquilino (nombre / razón social)", tipo: "texto", sinonimos: [/^inquilino$/, /^locatario/, /^arrendatario/, /^nombre( inquilino)?$/, /^cliente$/] },
  { campo: "inquilino.telefono", etiqueta: "Teléfono", tipo: "texto", sinonimos: [/^tel(efono|\.)?/, /^celular/, /^whatsapp/] },
  { campo: "inquilino.documento", etiqueta: "CI / RUC", tipo: "texto", sinonimos: [/^c\.?i\.?$/, /^ruc$/, /cedula/, /^documento/] },
  { campo: "inquilino.email", etiqueta: "Email", tipo: "texto", sinonimos: [/^e?-?mail/, /^correo/] },
  { campo: "contrato.alquiler", etiqueta: "Alquiler contractual", tipo: "importe", sinonimos: [/^monto alquiler/, /^alquiler( actual| mensual)?$/, /^canon/, /^precio alquiler/] },
  { campo: "contrato.fechaInicio", etiqueta: "Inicio de contrato", tipo: "fecha", sinonimos: [/^(fecha )?inicio/, /^desde$/] },
  { campo: "contrato.fechaFin", etiqueta: "Fin de contrato", tipo: "fecha", sinonimos: [/^(fecha )?(fin|vencimiento contrato)/, /^hasta$/] },
  { campo: "periodo.pagoTotal", etiqueta: "Pago recibido del mes (total)", tipo: "importe", sinonimos: [/^pago( del)? mes/, /^importe pagado/, /^cobrado/] },
  { campo: "periodo.expensas", etiqueta: "Expensas del mes", tipo: "importe", sinonimos: [/^(pago |monto |importe )?expensas?( del)?( mes)?( [a-z]+)?( \d+)?$/, /^gastos comunes$/] },
  { campo: "periodo.marcaPago", etiqueta: "Marca de pago (OK/pendiente)", tipo: "texto", sinonimos: [/^pago$/, /^estado (de )?pago$/, /^pagado$/] },
  { campo: "periodo.fechaPago", etiqueta: "Fecha de pago (efectivamente recibido)", tipo: "fecha", sinonimos: [/^fecha( de)? pago$/, /^fecha( de)? cobro$/, /^fecha( de)? acreditacion$/] },
  // Una fecha prevista NUNCA se interpreta como pago recibido: solo fija el vencimiento de la obligación.
  { campo: "periodo.fechaProgramada", etiqueta: "Fecha programada / vencimiento (NO es pago)", tipo: "fecha", sinonimos: [/^fecha (programada|prevista|de vencimiento|limite)/, /^vencimiento$/, /^vence$/, /^fecha a pagar/] },
  { campo: "periodo.bonificacion", etiqueta: "Bonificación / descuento sobre el alquiler", tipo: "importe", sinonimos: [/bonificacion/, /^descuento/] },
  { campo: "periodo.montoFactura", etiqueta: "Monto facturado", tipo: "importe", sinonimos: [/^(monto |importe )?factura(do)?$/] },
  { campo: "periodo.iva", etiqueta: "IVA", tipo: "importe", sinonimos: [/^(monto )?iva/] },
  { campo: "observaciones", etiqueta: "Observaciones", tipo: "texto", sinonimos: [/^obs/, /^nota/, /^comentario/] },
];

export function normalizarEncabezado(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function proponerCampo(encabezado: string): { campo: CampoDestino; confianza: number } {
  const n = normalizarEncabezado(encabezado);
  for (const def of CAMPOS) {
    for (const re of def.sinonimos) {
      if (re.test(n)) return { campo: def.campo, confianza: re.source.startsWith("^") && re.source.endsWith("$") ? 0.95 : 0.75 };
    }
  }
  return { campo: "ignorar", confianza: 0 };
}

export const MESES: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, set: 9, oct: 10, nov: 11, dic: 12,
};

/** Detecta mes (y opcionalmente año de 2 o 4 dígitos) en un texto como "DetalladaJunio26" o "Pago Mes Julio". */
export function detectarMes(texto: string): { mes: number; anio?: number } | null {
  const n = normalizarEncabezado(texto).replace(/([a-z])(\d)/g, "$1 $2").replace(/(\d)([a-z])/g, "$1 $2");
  const largo = /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s*(\d{2,4})?/.exec(n);
  const m = largo ?? /(?<![a-z])(ene|feb|mar|abr|may|jun|jul|ago|sep|set|oct|nov|dic)(?![a-z])\s*(\d{2,4})?/.exec(n);
  if (!m) return null;
  const anio = m[2] ? (m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2])) : undefined;
  return { mes: MESES[m[1]], anio };
}
