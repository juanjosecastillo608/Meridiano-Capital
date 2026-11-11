import { z } from "zod";
import { prisma, ErrorNegocio, Prisma, type Tx } from "../db";
import { exigir, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { d, sumar, Decimal, type MonedaCodigo } from "../../domain/money";
import { validarPeriodo, parsearFechaISO, hoyAsuncion } from "../../domain/periodo";
import { generarObligacionesAlquiler, estadoPorSaldo, estaVencida, type ContratoParaGenerar } from "../../domain/obligaciones";
import { aplicarPago, claveDuplicadoPago, resumirDeuda, type ObligacionAbierta } from "../../domain/pagos";
import type { ReglaFiscalDTO } from "../../domain/impuestos";

async function reglasFiscales(tx: Tx | typeof prisma): Promise<ReglaFiscalDTO[]> {
  const rs = await tx.reglaFiscal.findMany();
  return rs.map((r) => ({ ...r, tasaPct: r.tasaPct.toString(), baseImponiblePct: r.baseImponiblePct.toString() }));
}

// ───────────── Generación mensual de obligaciones ─────────────

/**
 * Idempotente: usa `claveIdempotencia` única + `skipDuplicates`. Ejecutarlo
 * dos veces (o en paralelo) para el mismo período nunca duplica obligaciones.
 */
export async function generarObligacionesMensuales(s: Sesion, sociedadId: string, periodo: string) {
  exigir(s, "GENERAR_OBLIGACIONES", sociedadId);
  if (!validarPeriodo(periodo)) throw new ErrorNegocio("Período inválido (YYYY-MM).");
  const contratos = await prisma.contrato.findMany({
    where: { sociedadId, deletedAt: null, estado: { in: ["VIGENTE", "VENCIDO"] }, fechaInicio: { not: null }, fechaFin: { not: null }, diaVencimiento: { not: null } },
    include: { unidades: true, partes: { where: { rol: "INQUILINO" }, orderBy: { id: "asc" } }, condiciones: true },
  });
  const entrada: ContratoParaGenerar[] = contratos
    .filter((c) => c.partes.length)
    .map((c) => ({
      id: c.id, codigo: c.codigo, sociedadId: c.sociedadId, propiedadId: c.propiedadId, unidadIds: c.unidades.map((u) => u.unidadId), inquilinoPrincipalId: c.partes[0].personaId,
      estado: c.estado, categoriaFiscal: c.categoriaFiscal, moneda: c.moneda, diaVencimiento: c.diaVencimiento!, fechaInicio: c.fechaInicio!, fechaFin: c.fechaFin!, fechaRescision: c.fechaRescision,
      condiciones: c.condiciones.map((x) => ({ vigenteDesde: x.vigenteDesde, montoAlquiler: x.montoAlquiler.toString() })),
    }));
  const { borradores, omitidos } = generarObligacionesAlquiler(entrada, periodo, await reglasFiscales(prisma));

  return prisma.$transaction(async (tx) => {
    const res = await tx.obligacion.createMany({
      data: borradores.map((b) => ({
        sociedadId: b.sociedadId, propiedadId: b.propiedadId, unidadId: b.unidadId, contratoId: b.contratoId, personaId: b.personaId, periodo: b.periodo, concepto: b.concepto,
        descripcion: b.advertencias.length ? `${b.descripcion} — ${b.advertencias.join(" ")}` : b.descripcion,
        fechaVencimiento: b.fechaVencimiento, moneda: b.moneda, importeNeto: b.importeNeto.toString(), iva: b.iva.toString(), importeTotal: b.importeTotal.toString(), saldo: b.saldo.toString(),
        reglaFiscalId: b.reglaFiscalId, ivaPendiente: b.ivaPendiente, claveIdempotencia: b.claveIdempotencia, origenDato: "GENERADO", estadoDato: b.requiereRevision ? "PENDIENTE_REVISION" : "VALIDADO",
      })),
      skipDuplicates: true,
    });
    await auditar(tx, s, "OBLIGACIONES_GENERAR", "Sociedad", sociedadId, { sociedadId, despues: { periodo, creadas: res.count, yaExistentes: borradores.length - res.count, omitidos } });
    return { creadas: res.count, yaExistentes: borradores.length - res.count, omitidos, advertencias: borradores.filter((b) => b.advertencias.length).map((b) => ({ clave: b.claveIdempotencia, advertencias: b.advertencias })) };
  });
}

// ───────────── Cobranzas ─────────────

export const PagoInput = z.object({
  sociedadId: z.string(),
  personaId: z.string(),
  propiedadId: z.string().optional().nullable(),
  unidadId: z.string().optional().nullable(),
  cuentaBancariaId: z.string().optional().nullable(),
  fechaPago: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaAcreditacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  bancoOrigen: z.string().optional().nullable(),
  metodo: z.enum(["TRANSFERENCIA", "DEPOSITO", "EFECTIVO", "CHEQUE", "TARJETA", "OTRO"]),
  comprobante: z.string().trim().optional().nullable(),
  moneda: z.enum(["PYG", "USD"]),
  importe: z.string().regex(/^\d+(\.\d{1,2})?$/, "Importe sin separadores de miles"),
  observaciones: z.string().optional().nullable(),
  /** Imputación manual; si se omite, se imputa automáticamente (más antigua primero). */
  aplicaciones: z.array(z.object({ obligacionId: z.string(), importe: z.string() })).optional(),
  claveDuplicado: z.string().optional(), // uso interno (importación)
  origenDato: z.enum(["MANUAL", "IMPORTADO"]).default("MANUAL"),
  importBatchId: z.string().optional(),
});

async function obligacionesAbiertas(tx: Tx, sociedadId: string, personaId: string, ids?: string[]) {
  // Bloqueo de filas: dos cobros simultáneos no pueden imputar el mismo saldo.
  const filas = await tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Obligacion"
    WHERE "sociedadId" = ${sociedadId} AND "personaId" = ${personaId} AND estado IN ('PENDIENTE','PARCIAL')
    ${ids && ids.length ? Prisma.sql`AND id IN (${Prisma.join(ids)})` : Prisma.empty}
    FOR UPDATE`;
  return tx.obligacion.findMany({ where: { id: { in: filas.map((f) => f.id) } } });
}

function aAbierta(o: { id: string; concepto: string; periodo: string; fechaVencimiento: Date; moneda: string; saldo: Prisma.Decimal; estado: string }): ObligacionAbierta {
  return { id: o.id, concepto: o.concepto as ObligacionAbierta["concepto"], periodo: o.periodo, fechaVencimiento: o.fechaVencimiento, moneda: o.moneda as MonedaCodigo, saldo: d(o.saldo.toString()), estado: o.estado };
}

async function imputar(tx: Tx, pagoId: string, aplicaciones: { obligacionId: string; importe: Decimal }[]) {
  for (const a of aplicaciones) {
    await tx.aplicacionPago.create({ data: { pagoId, obligacionId: a.obligacionId, importe: a.importe.toString() } });
    const o = await tx.obligacion.findUniqueOrThrow({ where: { id: a.obligacionId } });
    const saldo = d(o.saldo.toString()).minus(a.importe);
    if (saldo.isNegative()) throw new ErrorNegocio("La imputación dejaría saldo negativo.");
    await tx.obligacion.update({ where: { id: o.id }, data: { saldo: saldo.toString(), estado: estadoPorSaldo(d(o.importeTotal.toString()), saldo, o.estado) } });
  }
}

export async function registrarPago(s: Sesion, input: z.input<typeof PagoInput>, txExterna?: Tx) {
  const data = PagoInput.parse(input);
  exigir(s, "REGISTRAR_PAGO", data.sociedadId, data.propiedadId);
  const importe = d(data.importe);

  const ejecutar = async (tx: Tx) => {
    if (data.cuentaBancariaId) {
      const c = await tx.cuentaBancaria.findUnique({ where: { id: data.cuentaBancariaId } });
      if (!c || c.sociedadId !== data.sociedadId) throw new ErrorNegocio("La cuenta receptora no pertenece a la sociedad.");
      if (c.moneda !== data.moneda) throw new ErrorNegocio(`La cuenta receptora es en ${c.moneda} y el pago en ${data.moneda}: no se convierte automáticamente.`);
    }
    const claveDuplicado = data.claveDuplicado ?? claveDuplicadoPago({ cuentaBancariaId: data.cuentaBancariaId, comprobante: data.comprobante, importe, moneda: data.moneda });
    if (claveDuplicado && (await tx.pago.findUnique({ where: { claveDuplicado } }))) throw new ErrorNegocio("Ya existe un pago con la misma cuenta, comprobante e importe. No se registra dos veces.", "PAGO_DUPLICADO");

    const abiertas = await obligacionesAbiertas(tx, data.sociedadId, data.personaId, data.aplicaciones?.map((a) => a.obligacionId));
    const r = aplicarPago(importe, data.moneda, abiertas.map(aAbierta), data.aplicaciones);
    if (r.errores.length) throw new ErrorNegocio(r.errores.join(" "), "IMPUTACION", r.errores);

    const pago = await tx.pago.create({
      data: {
        sociedadId: data.sociedadId, personaId: data.personaId, propiedadId: data.propiedadId ?? null, unidadId: data.unidadId ?? null, cuentaBancariaId: data.cuentaBancariaId ?? null,
        fechaPago: parsearFechaISO(data.fechaPago), fechaAcreditacion: data.fechaAcreditacion ? parsearFechaISO(data.fechaAcreditacion) : null, bancoOrigen: data.bancoOrigen ?? null,
        metodo: data.metodo, comprobante: data.comprobante || null, moneda: data.moneda, importe: importe.toString(), claveDuplicado, registradoPorId: s.usuarioId === "sistema" ? null : s.usuarioId,
        observaciones: data.observaciones ?? null, origenDato: data.origenDato, importBatchId: data.importBatchId,
      },
    });
    await imputar(tx, pago.id, r.aplicaciones);
    await auditar(tx, s, "PAGO_REGISTRAR", "Pago", pago.id, { sociedadId: data.sociedadId, despues: { importe: importe.toString(), moneda: data.moneda, aplicaciones: r.aplicaciones, saldoAFavor: r.saldoAFavor.toString() } });
    return { pago, aplicaciones: r.aplicaciones, saldoAFavor: r.saldoAFavor };
  };
  return txExterna ? ejecutar(txExterna) : prisma.$transaction(ejecutar);
}

/** Imputa el saldo a favor de un pago (anticipo / exceso) a obligaciones nuevas. */
export async function imputarSaldoAFavor(s: Sesion, pagoId: string) {
  return prisma.$transaction(async (tx) => {
    const pago = await tx.pago.findUnique({ where: { id: pagoId }, include: { aplicaciones: { where: { revertidaAt: null } } } });
    if (!pago || pago.estado !== "REGISTRADO") throw new ErrorNegocio("Pago no encontrado o revertido.");
    exigir(s, "REGISTRAR_PAGO", pago.sociedadId);
    const disponible = d(pago.importe.toString()).minus(sumar(pago.aplicaciones.map((a) => a.importe.toString())));
    if (disponible.lessThanOrEqualTo(0)) return { aplicaciones: [], saldoAFavor: new Decimal(0) };
    const abiertas = await obligacionesAbiertas(tx, pago.sociedadId, pago.personaId);
    const r = aplicarPago(disponible, pago.moneda, abiertas.map(aAbierta));
    await imputar(tx, pago.id, r.aplicaciones);
    await auditar(tx, s, "PAGO_IMPUTAR_SALDO", "Pago", pago.id, { sociedadId: pago.sociedadId, despues: { aplicaciones: r.aplicaciones, saldoAFavor: r.saldoAFavor.toString() } });
    return r;
  });
}

export async function revertirPago(s: Sesion, pagoId: string, motivo: string) {
  if (!motivo?.trim()) throw new ErrorNegocio("La reversión requiere motivo.");
  return prisma.$transaction(async (tx) => {
    const pago = await tx.pago.findUnique({ where: { id: pagoId }, include: { aplicaciones: { where: { revertidaAt: null } } } });
    if (!pago) throw new ErrorNegocio("Pago no encontrado.");
    exigir(s, "REVERTIR_PAGO", pago.sociedadId);
    if (pago.estado === "REVERTIDO") throw new ErrorNegocio("El pago ya está revertido.");
    for (const a of pago.aplicaciones) {
      const o = await tx.obligacion.findUniqueOrThrow({ where: { id: a.obligacionId } });
      const saldo = d(o.saldo.toString()).plus(d(a.importe.toString()));
      await tx.obligacion.update({ where: { id: o.id }, data: { saldo: saldo.toString(), estado: estadoPorSaldo(d(o.importeTotal.toString()), saldo, o.estado === "PAGADA" ? "PENDIENTE" : o.estado) } });
      await tx.aplicacionPago.update({ where: { id: a.id }, data: { revertidaAt: new Date() } });
    }
    // Libera la clave anti-duplicado para permitir registrar la versión corregida.
    const act = await tx.pago.update({ where: { id: pago.id }, data: { estado: "REVERTIDO", motivoReversion: motivo, claveDuplicado: null } });
    await auditar(tx, s, "PAGO_REVERTIR", "Pago", pago.id, { sociedadId: pago.sociedadId, antes: { estado: pago.estado, claveDuplicado: pago.claveDuplicado }, despues: { estado: "REVERTIDO" }, motivo });
    return act;
  });
}

export async function conciliarPago(s: Sesion, pagoId: string, fechaAcreditacion: string) {
  return prisma.$transaction(async (tx) => {
    const p = await tx.pago.findUnique({ where: { id: pagoId } });
    if (!p) throw new ErrorNegocio("Pago no encontrado.");
    exigir(s, "REGISTRAR_PAGO", p.sociedadId);
    const act = await tx.pago.update({ where: { id: pagoId }, data: { conciliado: true, fechaAcreditacion: parsearFechaISO(fechaAcreditacion) } });
    await auditar(tx, s, "PAGO_CONCILIAR", "Pago", pagoId, { sociedadId: p.sociedadId, antes: { conciliado: p.conciliado, fechaAcreditacion: p.fechaAcreditacion }, despues: { conciliado: true, fechaAcreditacion } });
    return act;
  });
}

export async function anularObligacion(s: Sesion, obligacionId: string, motivo: string) {
  if (!motivo?.trim()) throw new ErrorNegocio("La anulación requiere motivo.");
  return prisma.$transaction(async (tx) => {
    const o = await tx.obligacion.findUnique({ where: { id: obligacionId }, include: { aplicaciones: { where: { revertidaAt: null } } } });
    if (!o) throw new ErrorNegocio("Obligación no encontrada.");
    exigir(s, "GENERAR_OBLIGACIONES", o.sociedadId);
    if (o.aplicaciones.length) throw new ErrorNegocio("Tiene pagos imputados: revierta o reimpute los pagos antes de anular.");
    const act = await tx.obligacion.update({ where: { id: o.id }, data: { estado: "ANULADA", saldo: "0", motivoAnulacion: motivo } });
    await auditar(tx, s, "OBLIGACION_ANULAR", "Obligacion", o.id, { sociedadId: o.sociedadId, antes: { estado: o.estado, saldo: o.saldo }, motivo });
    return act;
  });
}

// ───────────── Estado de cuenta ─────────────

export async function estadoDeCuenta(s: Sesion, filtro: { unidadId?: string; personaId?: string; sociedadId?: string }) {
  if (!filtro.unidadId && !filtro.personaId) throw new ErrorNegocio("Indique unidad o inquilino.");
  const where = { ...filtroSociedad(s), ...(filtro.sociedadId ? { sociedadId: filtro.sociedadId } : {}), ...(filtro.unidadId ? { unidadId: filtro.unidadId } : {}), ...(filtro.personaId ? { personaId: filtro.personaId } : {}) };
  const obligaciones = await prisma.obligacion.findMany({
    where,
    include: { aplicaciones: { where: { revertidaAt: null }, include: { pago: true } }, unidad: { select: { identificador: true } }, persona: { select: { nombre: true } }, itemsFactura: { include: { factura: { select: { estado: true, numero: true } } } } },
    orderBy: [{ periodo: "asc" }, { concepto: "asc" }],
  });
  const pagos = await prisma.pago.findMany({
    where: { ...filtroSociedad(s), ...(filtro.personaId ? { personaId: filtro.personaId } : {}), ...(filtro.unidadId ? { OR: [{ unidadId: filtro.unidadId }, { aplicaciones: { some: { obligacion: { unidadId: filtro.unidadId } } } }] } : {}) },
    include: { aplicaciones: { where: { revertidaAt: null } } },
    orderBy: { fechaPago: "asc" },
  });
  const hoy = hoyAsuncion();
  const porMoneda: Record<string, { deuda: ReturnType<typeof resumirDeuda>; vencido: Decimal; saldoAFavor: Decimal }> = {};
  for (const m of [...new Set([...obligaciones.map((o) => o.moneda), ...pagos.map((p) => p.moneda)])]) {
    const om = obligaciones.filter((o) => o.moneda === m);
    const pm = pagos.filter((p) => p.moneda === m && p.estado === "REGISTRADO");
    porMoneda[m] = {
      deuda: resumirDeuda(om.map((o) => ({ concepto: o.concepto, saldo: d(o.saldo.toString()), estado: o.estado }))),
      vencido: sumar(om.filter((o) => estaVencida({ estado: o.estado, fechaVencimiento: o.fechaVencimiento }, hoy)).map((o) => o.saldo.toString())),
      saldoAFavor: sumar(pm.map((p) => d(p.importe.toString()).minus(sumar(p.aplicaciones.map((a) => a.importe.toString()))))),
    };
  }
  const estadoFacturacion = (o: (typeof obligaciones)[number]) => {
    const f = o.itemsFactura.map((i) => i.factura).find((x) => x.estado !== "ANULADA");
    return f ? f.estado : "SIN_FACTURAR";
  };
  return { obligaciones: obligaciones.map((o) => ({ ...o, vencida: estaVencida({ estado: o.estado, fechaVencimiento: o.fechaVencimiento }, hoy), estadoFacturacion: estadoFacturacion(o) })), pagos, porMoneda };
}
