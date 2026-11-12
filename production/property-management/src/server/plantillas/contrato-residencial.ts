import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { calculateLeaseEndDate, formatoLocal, numeroALetras, type FechaCalendario } from "../../domain/plazos";
import { formatear, d, type MonedaCodigo } from "../../domain/money";

/**
 * Plantilla de contrato de locación RESIDENCIAL — versión RESIDENCIAL_12M_v1.
 *
 * ⚠ REDACCIÓN PROVISIONAL: debe someterse a revisión jurídica antes de su uso
 * (Actualización contractual 03). El documento generado lo dice en su
 * encabezado y no se considera firmado ni vigente.
 *
 * Regla: ningún dato desconocido se completa con supuestos. Todo faltante se
 * imprime como [PENDIENTE: …] y se lista en `faltantes`.
 */
export const PLANTILLA_VERSION = "RESIDENCIAL_12M_v1";

export const CLAUSULA_PLAZO = "El plazo de duración de la presente locación será de DOCE (12) MESES, iniciándose el día [FECHA_INICIO] y finalizando el día [FECHA_FIN], conforme a las condiciones acordadas por las partes.";

export interface DatosContrato {
  codigo: string;
  sociedad: { razonSocial: string; ruc: string | null; domicilioFiscal: string | null; representante: string | null };
  inquilinos: { nombre: string; documento: string | null; domicilio: string | null }[];
  edificio: { nombre: string; direccion: string | null; ciudad: string | null };
  unidad: { identificador: string; piso: string | null; dormitorios: number | null };
  plazoMeses: number;
  fechaInicio: FechaCalendario;
  fechaFin: FechaCalendario;
  fechaFirma: FechaCalendario | null;
  canon: string; // importe exacto (Decimal en string)
  moneda: MonedaCodigo;
  diaVencimiento: number | null;
  cuenta: { banco: string; numero: string; titular: string | null; moneda: string } | null;
  deposito: string | null;
  /** NIS ANDE de la unidad: la energía eléctrica es a cargo del inquilino y no está incluida en el canon. */
  nisAnde?: string | null;
  nisCompartidoCon?: string[];
  expensas?: { monto: string | null; aCargoInquilino: boolean | null } | null;
}

const MESES_LETRAS: Record<number, string> = { 12: "DOCE (12)" };

export function textoContrato(x: DatosContrato): { parrafos: string[]; faltantes: string[] } {
  const faltantes: string[] = [];
  const P = (v: string | null | undefined, etiqueta: string) => {
    if (v === null || v === undefined || v === "") { faltantes.push(etiqueta); return `[PENDIENTE: ${etiqueta}]`; }
    return v;
  };
  if (x.plazoMeses !== 12) throw new Error(`La plantilla ${PLANTILLA_VERSION} es de 12 meses; plazo recibido: ${x.plazoMeses}.`);
  if (calculateLeaseEndDate(x.fechaInicio, x.plazoMeses) !== x.fechaFin) faltantes.push("fecha de finalización distinta del cálculo estándar: verificar la excepción aprobada");
  const canonNum = d(x.canon);
  const canonLetras = canonNum.isInteger() ? `${numeroALetras(canonNum.toNumber())} ${x.moneda === "PYG" ? "GUARANÍES" : "DÓLARES ESTADOUNIDENSES"}` : null;
  const inq = x.inquilinos.map((i) => `${i.nombre}, con documento de identidad ${P(i.documento, `documento de identidad de ${i.nombre}`)}, domiciliado/a en ${P(i.domicilio, `domicilio de ${i.nombre}`)}`).join("; y ");

  const parrafos = [
    `Entre ${x.sociedad.razonSocial}, RUC ${P(x.sociedad.ruc, "RUC de la sociedad")}, con domicilio fiscal en ${P(x.sociedad.domicilioFiscal, "domicilio fiscal de la sociedad")}, representada en este acto por ${P(x.sociedad.representante, "representante legal / apoderado con poder vigente")}, en adelante LA LOCADORA; y ${inq}, en adelante LA PARTE LOCATARIA, se celebra el presente contrato de locación residencial sujeto a las siguientes cláusulas:`,
    `PRIMERA — OBJETO. LA LOCADORA da en locación a LA PARTE LOCATARIA, para uso exclusivo de vivienda, la unidad ${x.unidad.identificador}${x.unidad.piso ? `, piso ${x.unidad.piso}` : ""}, del ${x.edificio.nombre}, sito en ${P(x.edificio.direccion, "dirección del edificio")}, ${x.edificio.ciudad ?? "Asunción"}, Paraguay, sin muebles.`,
    `SEGUNDA — PLAZO. ${CLAUSULA_PLAZO.replace("DOCE (12)", MESES_LETRAS[x.plazoMeses]).replace("[FECHA_INICIO]", formatoLocal(x.fechaInicio)).replace("[FECHA_FIN]", formatoLocal(x.fechaFin))}`,
    `TERCERA — PRECIO. El canon locativo mensual es de ${formatear(x.canon, x.moneda)}${canonLetras ? ` (${canonLetras})` : ""}, IVA incluido, sin incremento durante el plazo de la presente locación. Cualquier reajuste futuro requerirá acuerdo expreso de las partes.`,
    `CUARTA — FORMA Y LUGAR DE PAGO. El canon se abonará por mes adelantado hasta el día ${x.diaVencimiento ? String(x.diaVencimiento) : P(null, "día de vencimiento mensual")} de cada mes, mediante depósito o transferencia a la cuenta ${x.cuenta ? `${x.cuenta.banco} Nº ${x.cuenta.numero} (${x.cuenta.moneda})${x.cuenta.titular ? `, titular ${x.cuenta.titular}` : ""}` : P(null, "cuenta bancaria receptora")}.`,
    `QUINTA — DEPÓSITO DE GARANTÍA. LA PARTE LOCATARIA ${x.deposito ? `entrega en concepto de depósito de garantía la suma de ${formatear(x.deposito, x.moneda)}` : `entrega en concepto de depósito de garantía la suma de ${P(null, "importe del depósito de garantía (a verificar individualmente)")}`}.`,
    `SEXTA — SERVICIOS. La energía eléctrica de la unidad (NIS ANDE ${P(x.nisAnde ?? null, "NIS ANDE de la unidad")}) es a cargo de LA PARTE LOCATARIA y no está incluida en el canon locativo.${x.nisCompartidoCon?.length ? ` [PENDIENTE: el NIS es compartido con la(s) unidad(es) ${x.nisCompartidoCon.join(", ")}; definir prorrateo o independización del medidor]` : ""}`,
    `SÉPTIMA — EXPENSAS. ${x.expensas?.aCargoInquilino ? `LA PARTE LOCATARIA abonará en concepto de expensas la suma mensual de ${x.expensas.monto ? formatear(x.expensas.monto, x.moneda) : P(null, "importe mensual de expensas")}, exenta de IVA, junto con el canon.` : x.expensas?.aCargoInquilino === false ? "Las expensas ordinarias son a cargo de LA LOCADORA." : P(null, "responsable e importe de las expensas")}`,
    `[PENDIENTE: demás cláusulas (agua y otros servicios, destino, mejoras, garantes, rescisión, mora) — a definir en la revisión jurídica de la plantilla]`,
    `En prueba de conformidad se firman dos ejemplares de un mismo tenor y a un solo efecto, en la ciudad de Asunción, el día ${x.fechaFirma ? formatoLocal(x.fechaFirma) : P(null, "fecha de firma")}.`,
  ];
  if (!faltantes.includes("demás cláusulas")) faltantes.push("demás cláusulas de la plantilla (revisión jurídica)");
  return { parrafos, faltantes: [...new Set(faltantes)] };
}

export async function generarDocx(x: DatosContrato): Promise<{ buffer: Buffer; faltantes: string[] }> {
  const { parrafos, faltantes } = textoContrato(x);
  const doc = new Document({
    creator: "Meridiano Capital | Property Management",
    title: `Contrato ${x.codigo} — BORRADOR`,
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BORRADOR — NO FIRMADO — NO VIGENTE", bold: true, color: "8B3323" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Redacción provisional ${PLANTILLA_VERSION}: requiere revisión jurídica antes de su utilización.`, italics: true, size: 18 })] }),
        new Paragraph({ text: "" }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CONTRATO DE LOCACIÓN RESIDENCIAL", bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Código ${x.codigo}`, size: 18 })] }),
        new Paragraph({ text: "" }),
        ...parrafos.map((t) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [new TextRun({ text: t, highlight: t.includes("[PENDIENTE") ? "yellow" : undefined })] })),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: `Datos pendientes (${faltantes.length}): ${faltantes.join("; ")}.`, italics: true, size: 18 })] }),
      ],
    }],
  });
  return { buffer: Buffer.from(await Packer.toBuffer(doc)), faltantes };
}
