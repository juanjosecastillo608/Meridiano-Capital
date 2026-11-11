import { z } from "zod";
import { prisma, ErrorNegocio } from "../db";
import { exigir, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { leerLibro } from "../../import/libro";
import { leerChecklist, leerPresupuesto, leerListadosPorSector, clasificarRubro } from "../../import/remodelacion";
import { subirDocumento } from "./documentos";
import { d, sumar, Decimal } from "../../domain/money";
import { parsearFechaISO, hoyAsuncion, periodoDe } from "../../domain/periodo";
import { desviacion } from "../../domain/remodelacion";

/**
 * Remodelaciones con etapas SEPARADAS (anexo Canarias):
 *   presupuesto estimado → cotización de proveedor → presupuesto aprobado →
 *   orden de trabajo → gasto ejecutado → comprobante de pago → costo final.
 * Ningún paso se infiere del anterior: aprobar exige una acción explícita con
 * permiso APROBAR_PRESUPUESTO y motivo; el costo final es Σ gastos ejecutados.
 */

async function proyectoConAcceso(s: Sesion, id: string, permiso: Parameters<typeof exigir>[1] = "LEER") {
  const p = await prisma.proyectoRemodelacion.findUnique({ where: { id } });
  if (!p) throw new ErrorNegocio("Proyecto no encontrado.", "NO_ENCONTRADO");
  exigir(s, permiso, p.sociedadId, p.propiedadId);
  return p;
}

export const ProyectoInput = z.object({
  propiedadId: z.string(),
  unidadId: z.string().optional().nullable(),
  codigo: z.string().trim().regex(/^[A-Z0-9-]+$/, "Código en mayúsculas, números y guiones"),
  objetivo: z.string().trim().min(3),
  descripcion: z.string().optional().nullable(),
  moneda: z.enum(["PYG", "USD"]).default("PYG"),
});

export async function crearProyecto(s: Sesion, input: z.input<typeof ProyectoInput>) {
  const data = ProyectoInput.parse(input);
  const prop = await prisma.propiedad.findUnique({ where: { id: data.propiedadId } });
  if (!prop) throw new ErrorNegocio("Propiedad no encontrada.");
  exigir(s, "GESTIONAR_REMODELACIONES", prop.sociedadId, prop.id);
  if (data.unidadId) {
    const u = await prisma.unidad.findUnique({ where: { id: data.unidadId } });
    if (!u || u.propiedadId !== prop.id) throw new ErrorNegocio("La unidad no pertenece a la propiedad.");
  }
  return prisma.$transaction(async (tx) => {
    const p = await tx.proyectoRemodelacion.create({ data: { ...data, sociedadId: prop.sociedadId, estado: "EN_PRESUPUESTO" } });
    await auditar(tx, s, "REMODELACION_CREAR", "ProyectoRemodelacion", p.id, { sociedadId: prop.sociedadId, despues: p });
    return p;
  });
}

/** Vincula un sector de la fuente con unidades: "4" → unidad 4; "13-14" → unidades 13 y 14; otros → sector común. */
async function resolverSector(propiedadId: string, sector: string, mapeoManual: Record<string, string[]>) {
  if (mapeoManual[sector]) {
    const us = await prisma.unidad.findMany({ where: { propiedadId, identificador: { in: mapeoManual[sector] }, deletedAt: null } });
    return { unidades: us, nota: `Vinculado manualmente a ${mapeoManual[sector].join(", ")}` };
  }
  const partes = sector.split(/\s*[-–,y]\s*/).map((x) => x.trim()).filter(Boolean);
  if (partes.length && partes.every((x) => /^\d+[A-Z]?$/i.test(x))) {
    const us = await prisma.unidad.findMany({ where: { propiedadId, identificador: { in: partes }, deletedAt: null } });
    const faltan = partes.filter((x) => !us.some((u) => u.identificador === x));
    return { unidades: us, nota: [partes.length > 1 ? `Sector "${sector}" = unidades ${partes.join(" y ")} (unificadas en la fuente)` : null, faltan.length ? `Unidad(es) ${faltan.join(", ")} no existen en la propiedad` : null].filter(Boolean).join(". ") || null };
  }
  return { unidades: [], nota: null }; // sector común (Terraza, Fachada, Local 1 …): no se asume a qué unidad corresponde
}

/** Importa el checklist de alcance (sin precios). `mapeoSectores` permite vincular explícitamente p. ej. "Local 1" → ["Salon"]. */
export async function importarChecklist(s: Sesion, proyectoId: string, nombreArchivo: string, buffer: Buffer, mapeoSectores: Record<string, string[]> = {}) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  const ck = leerChecklist(await leerLibro(buffer));
  const { documento } = await subirDocumento(s, { sociedadId: p.sociedadId, propiedadId: p.propiedadId, entidad: "REMODELACION", entidadId: p.id, tipo: "PRESUPUESTO", titulo: `Checklist de alcance — ${nombreArchivo}` }, nombreArchivo, buffer);
  const resueltos = new Map<string, Awaited<ReturnType<typeof resolverSector>>>();
  for (const sec of ck.sectores) resueltos.set(sec, await resolverSector(p.propiedadId, sec, mapeoSectores));
  return prisma.$transaction(async (tx) => {
    let n = 0;
    for (const it of ck.items) {
      const r = resueltos.get(it.sector)!;
      const destinos = r.unidades.length ? r.unidades.map((u) => u.id) : [null];
      for (const unidadId of destinos) {
        await tx.alcanceRemodelacion.create({ data: { proyectoId, unidadId, sector: it.sector, item: it.item, incluido: true, fuente: `${nombreArchivo} › ${it.ref} (doc ${documento.id})`, nota: r.nota } });
        n++;
      }
    }
    await auditar(tx, s, "REMODELACION_IMPORTAR_ALCANCE", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: { items: n, sectores: ck.sectores, documentoId: documento.id } });
    return { items: n, sectores: [...resueltos.entries()].map(([k, v]) => ({ sector: k, unidades: v.unidades.map((u) => u.identificador), nota: v.nota })), notas: ck.notas, advertencias: ck.advertencias };
  });
}

/** Importa los listados de trabajos por departamento de una planilla administrativa (ítems sin precio). */
export async function importarListadosSector(s: Sesion, proyectoId: string, nombreArchivo: string, buffer: Buffer) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  const ls = leerListadosPorSector(await leerLibro(buffer));
  return prisma.$transaction(async (tx) => {
    let n = 0;
    for (const it of ls) {
      const r = await resolverSector(p.propiedadId, it.sector, {});
      await tx.alcanceRemodelacion.create({ data: { proyectoId, unidadId: r.unidades[0]?.id ?? null, sector: it.sector, item: it.item, incluido: true, fuente: `${nombreArchivo} › hoja "${it.hoja}"`, nota: it.importe ? `Importe en fuente: ${it.importe}` : "Sin importe en la fuente (INFORMACION_FALTANTE)" } });
      n++;
    }
    await auditar(tx, s, "REMODELACION_IMPORTAR_ALCANCE", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: { items: n, fuente: nombreArchivo } });
    return { items: n };
  });
}

/** Importa un presupuesto: estimados y ofertas de proveedor quedan en etapas distintas. Nada queda aprobado. */
export async function importarPresupuesto(s: Sesion, proyectoId: string, nombreArchivo: string, buffer: Buffer) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  const pr = leerPresupuesto(await leerLibro(buffer), nombreArchivo);
  const { documento } = await subirDocumento(s, { sociedadId: p.sociedadId, propiedadId: p.propiedadId, entidad: "REMODELACION", entidadId: p.id, tipo: "PRESUPUESTO", titulo: `Presupuesto / cotización — ${nombreArchivo}` }, nombreArchivo, buffer);
  return prisma.$transaction(async (tx) => {
    await tx.partidaRemodelacion.createMany({
      data: pr.partidas.map((x) => ({
        proyectoId, etapa: x.etapa, rubroOriginal: x.rubroOriginal, rubro: x.rubro, tipo: x.tipo, descripcion: x.descripcion, cantidad: x.cantidad?.toString() ?? null, unidadMedida: x.unidadMedida,
        precioUnitario: x.precioUnitario?.toString() ?? null, precioBajo: x.precioBajo?.toString() ?? null, precioAlto: x.precioAlto?.toString() ?? null, total: x.total?.toString() ?? null,
        confianza: x.confianza, calidadDato: x.calidadDato, fuente: `${x.fuente} (doc ${documento.id})`,
      })),
    });
    await tx.proyectoRemodelacion.update({ where: { id: proyectoId }, data: { descripcion: [p.descripcion, pr.criterios.length ? `Criterios de contratación de la fuente:\n- ${pr.criterios.join("\n- ")}` : null].filter(Boolean).join("\n\n") || null } });
    await auditar(tx, s, "REMODELACION_IMPORTAR_PRESUPUESTO", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: { partidas: pr.partidas.length, documentoId: documento.id } });
    return { partidas: pr.partidas.length, advertencias: pr.advertencias, criterios: pr.criterios };
  });
}

export const PartidaInput = z.object({
  etapa: z.enum(["ESTIMADO", "COTIZACION_PROVEEDOR"]),
  descripcion: z.string().trim().min(3),
  rubro: z.enum(["AGUA_SANITARIA", "ELECTRICIDAD", "PINTURA", "OBRA_CIVIL", "VARIOS"]).optional(),
  tipo: z.enum(["MATERIAL", "MANO_DE_OBRA", "EQUIPO", "SUBCONTRATO", "INDIRECTO", "CONTINGENCIA"]),
  unidadId: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  cantidad: z.string().optional().nullable(),
  unidadMedida: z.string().optional().nullable(),
  precioUnitario: z.string().optional().nullable(),
  proveedor: z.string().optional().nullable(),
  fuente: z.string().trim().min(3, "Indique la fuente (cotización, mensaje, documento)"),
});

/** Carga manual de una cotización o estimación. Una cotización de proveedor es DATO_RECIBIDO, nunca APROBADO. */
export async function agregarPartida(s: Sesion, proyectoId: string, input: z.input<typeof PartidaInput>) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  const x = PartidaInput.parse(input);
  if (x.unidadId) {
    const u = await prisma.unidad.findUnique({ where: { id: x.unidadId } });
    if (!u || u.propiedadId !== p.propiedadId) throw new ErrorNegocio("La unidad no pertenece a la propiedad del proyecto.");
  }
  const total = x.cantidad && x.precioUnitario ? d(x.cantidad).times(d(x.precioUnitario)) : null;
  return prisma.$transaction(async (tx) => {
    let proveedorId: string | null = null;
    if (x.proveedor) proveedorId = (await tx.proveedor.findFirst({ where: { nombre: x.proveedor } }))?.id ?? (await tx.proveedor.create({ data: { nombre: x.proveedor } })).id;
    const pa = await tx.partidaRemodelacion.create({ data: { proyectoId, etapa: x.etapa, descripcion: x.descripcion, rubro: x.rubro ?? clasificarRubro("", x.descripcion), tipo: x.tipo, unidadId: x.unidadId ?? null, sector: x.sector ?? null, cantidad: x.cantidad || null, unidadMedida: x.unidadMedida ?? null, precioUnitario: x.precioUnitario || null, total: total?.toString() ?? null, calidadDato: total ? (x.etapa === "COTIZACION_PROVEEDOR" ? "DATO_RECIBIDO" : "SUPUESTO") : "INFORMACION_FALTANTE", proveedorId, fuente: x.fuente } });
    await auditar(tx, s, "REMODELACION_REGISTRAR_COTIZACION", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: pa });
    return pa;
  });
}

/**
 * Aprobación EXPLÍCITA: copia las partidas elegidas (de estimado o cotización)
 * como etapa APROBADO y fija el presupuesto aprobado. Rechaza partidas sin
 * precio o con revisión técnica pendiente.
 */
export async function aprobarPresupuesto(s: Sesion, proyectoId: string, partidaIds: string[], motivo: string) {
  const p = await proyectoConAcceso(s, proyectoId, "APROBAR_PRESUPUESTO");
  if (!motivo?.trim()) throw new ErrorNegocio("La aprobación requiere motivo / referencia (p. ej. acta, mensaje del propietario).");
  if (!partidaIds.length) throw new ErrorNegocio("Seleccione las partidas a aprobar.");
  if (!["EN_PRESUPUESTO", "PENDIENTE_APROBACION"].includes(p.estado)) throw new ErrorNegocio(`El proyecto está ${p.estado}: no admite nueva aprobación.`);
  const ps = await prisma.partidaRemodelacion.findMany({ where: { id: { in: partidaIds }, proyectoId } });
  if (ps.length !== partidaIds.length) throw new ErrorNegocio("Alguna partida no pertenece al proyecto.");
  const malas = ps.filter((x) => x.etapa === "APROBADO" || !x.total || x.calidadDato === "INFORMACION_FALTANTE" || x.calidadDato === "REVISION_TECNICA_REQUERIDA");
  if (malas.length) throw new ErrorNegocio(`${malas.length} partida(s) no son aprobables (ya aprobadas, sin precio o con revisión técnica pendiente).`);
  const total = sumar(ps.map((x) => x.total!.toString()));
  return prisma.$transaction(async (tx) => {
    for (const x of ps) {
      await tx.partidaRemodelacion.create({ data: { proyectoId, etapa: "APROBADO", unidadId: x.unidadId, sector: x.sector, rubroOriginal: x.rubroOriginal, rubro: x.rubro, tipo: x.tipo, descripcion: x.descripcion, cantidad: x.cantidad, unidadMedida: x.unidadMedida, precioUnitario: x.precioUnitario, total: x.total, calidadDato: x.calidadDato, proveedorId: x.proveedorId, fuente: x.fuente, partidaOrigenId: x.id } });
    }
    const act = await tx.proyectoRemodelacion.update({ where: { id: proyectoId }, data: { estado: "APROBADO", presupuestoAprobado: total.toString(), aprobadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId, fechaAprobacion: new Date() } });
    await auditar(tx, s, "REMODELACION_APROBAR", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: { total: total.toString(), partidas: partidaIds.length, etapasOrigen: [...new Set(ps.map((x) => x.etapa))] }, motivo });
    return act;
  });
}

export async function crearOrdenTrabajo(s: Sesion, proyectoId: string, input: { descripcion: string; categoria: "AGUA_SANITARIA" | "ELECTRICIDAD" | "PINTURA" | "OBRA_CIVIL" | "VARIOS"; unidadId?: string | null; sector?: string | null; proveedor?: string | null; costoEstimado?: string | null }) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  if (p.estado !== "APROBADO" && p.estado !== "EN_EJECUCION") throw new ErrorNegocio("Solo se emiten órdenes de trabajo sobre un presupuesto APROBADO.");
  return prisma.$transaction(async (tx) => {
    let proveedorId: string | null = null;
    if (input.proveedor) proveedorId = (await tx.proveedor.findFirst({ where: { nombre: input.proveedor } }))?.id ?? (await tx.proveedor.create({ data: { nombre: input.proveedor } })).id;
    const o = await tx.ordenTrabajo.create({ data: { sociedadId: p.sociedadId, propiedadId: p.propiedadId, unidadId: input.unidadId ?? null, sector: input.sector ?? null, proyectoId, fechaSolicitud: hoyAsuncion(), descripcion: input.descripcion, categoria: input.categoria, proveedorId, costoEstimado: input.costoEstimado || null, moneda: p.moneda, estado: "APROBADO", aprobadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId, fechaAprobacion: new Date() } });
    if (p.estado === "APROBADO") await tx.proyectoRemodelacion.update({ where: { id: proyectoId }, data: { estado: "EN_EJECUCION", fechaInicio: hoyAsuncion() } });
    await auditar(tx, s, "ORDEN_TRABAJO_CREAR", "OrdenTrabajo", o.id, { sociedadId: p.sociedadId, despues: o });
    return o;
  });
}

/** Gasto ejecutado (factura/recibo del proveedor). Pagado o no es otro dato; el comprobante de pago es un documento aparte. */
export async function registrarGastoEjecutado(s: Sesion, proyectoId: string, input: { ordenTrabajoId?: string | null; descripcion: string; importe: string; fecha: string; comprobante?: string | null; proveedor?: string | null; unidadId?: string | null; sector?: string | null }, archivoComprobante?: { nombre: string; buffer: Buffer }) {
  const p = await proyectoConAcceso(s, proyectoId, "GESTIONAR_REMODELACIONES");
  if (p.estado !== "EN_EJECUCION" && p.estado !== "APROBADO") throw new ErrorNegocio("Registre gastos solo en proyectos aprobados / en ejecución.");
  if (!/^\d+(\.\d{1,2})?$/.test(input.importe) || d(input.importe).lessThanOrEqualTo(0)) throw new ErrorNegocio("Importe inválido (sin separadores de miles).");
  if (input.ordenTrabajoId) {
    const o = await prisma.ordenTrabajo.findUnique({ where: { id: input.ordenTrabajoId } });
    if (!o || o.proyectoId !== proyectoId) throw new ErrorNegocio("La orden de trabajo no pertenece al proyecto.");
  }
  const doc = archivoComprobante ? (await subirDocumento(s, { sociedadId: p.sociedadId, propiedadId: p.propiedadId, entidad: "EGRESO", tipo: "COMPROBANTE", titulo: `Comprobante de gasto — ${input.descripcion}` }, archivoComprobante.nombre, archivoComprobante.buffer)).documento : null;
  const fecha = parsearFechaISO(input.fecha);
  return prisma.$transaction(async (tx) => {
    let proveedorId: string | null = null;
    if (input.proveedor) proveedorId = (await tx.proveedor.findFirst({ where: { nombre: input.proveedor } }))?.id ?? (await tx.proveedor.create({ data: { nombre: input.proveedor } })).id;
    const e = await tx.egreso.create({ data: { sociedadId: p.sociedadId, propiedadId: p.propiedadId, unidadId: input.unidadId ?? null, sector: input.sector ?? null, fecha, periodo: periodoDe(fecha), categoria: "REMODELACION", naturaleza: "CAPEX", descripcion: input.descripcion, moneda: p.moneda, importe: input.importe, proveedorId, comprobante: input.comprobante ?? null, ordenTrabajoId: input.ordenTrabajoId ?? null, proyectoId, documentoComprobanteId: doc?.id ?? null } });
    if (doc) await tx.documento.update({ where: { id: doc.id }, data: { entidadId: e.id } });
    await auditar(tx, s, "GASTO_EJECUTADO_REGISTRAR", "Egreso", e.id, { sociedadId: p.sociedadId, despues: e });
    return e;
  });
}

export async function marcarGastoPagado(s: Sesion, egresoId: string, fechaPago: string, archivo?: { nombre: string; buffer: Buffer }) {
  const e = await prisma.egreso.findUnique({ where: { id: egresoId } });
  if (!e) throw new ErrorNegocio("Gasto no encontrado.");
  exigir(s, "APROBAR_GASTO", e.sociedadId, e.propiedadId);
  const doc = archivo ? (await subirDocumento(s, { sociedadId: e.sociedadId, propiedadId: e.propiedadId, entidad: "EGRESO", entidadId: e.id, tipo: "COMPROBANTE", titulo: `Comprobante de pago — ${e.descripcion}` }, archivo.nombre, archivo.buffer)).documento : null;
  return prisma.$transaction(async (tx) => {
    const act = await tx.egreso.update({ where: { id: egresoId }, data: { pagado: true, fechaPagoEgreso: parsearFechaISO(fechaPago), documentoComprobanteId: doc?.id ?? e.documentoComprobanteId } });
    await auditar(tx, s, "GASTO_MARCAR_PAGADO", "Egreso", egresoId, { sociedadId: e.sociedadId, antes: { pagado: e.pagado }, despues: { pagado: true, fechaPago, documentoId: doc?.id } });
    return act;
  });
}

export async function finalizarProyecto(s: Sesion, proyectoId: string, motivo: string) {
  const p = await proyectoConAcceso(s, proyectoId, "APROBAR_PRESUPUESTO");
  if (p.estado !== "EN_EJECUCION") throw new ErrorNegocio("Solo se finaliza un proyecto en ejecución.");
  const pend = await prisma.egreso.count({ where: { proyectoId, pagado: false, deletedAt: null } });
  return prisma.$transaction(async (tx) => {
    const act = await tx.proyectoRemodelacion.update({ where: { id: proyectoId }, data: { estado: "FINALIZADO", fechaFinalizacion: hoyAsuncion() } });
    await auditar(tx, s, "REMODELACION_FINALIZAR", "ProyectoRemodelacion", proyectoId, { sociedadId: p.sociedadId, despues: { gastosImpagos: pend }, motivo });
    return act;
  });
}

export async function listarProyectos(s: Sesion, f: { propiedadId?: string } = {}) {
  return prisma.proyectoRemodelacion.findMany({ where: { ...filtroSociedad(s), ...(f.propiedadId ? { propiedadId: f.propiedadId } : {}) }, include: { propiedad: { select: { codigo: true, nombre: true } }, _count: { select: { partidas: true, alcances: true, ordenes: true, egresos: true } } }, orderBy: { createdAt: "desc" } });
}

/** Resumen por etapa — cada importe con su naturaleza; nunca se suma un estimado con un gasto. */
export async function obtenerProyecto(s: Sesion, id: string) {
  await proyectoConAcceso(s, id);
  const p = await prisma.proyectoRemodelacion.findUniqueOrThrow({
    where: { id },
    include: {
      propiedad: { include: { sociedad: { select: { razonSocial: true } } } },
      partidas: { include: { unidad: { select: { identificador: true } } }, orderBy: [{ etapa: "asc" }, { rubro: "asc" }] },
      alcances: { include: { unidad: { select: { identificador: true } } }, orderBy: [{ sector: "asc" }, { item: "asc" }] },
      ordenes: { include: { proveedor: true, unidad: { select: { identificador: true } } } },
      egresos: { where: { deletedAt: null }, include: { proveedor: true }, orderBy: { fecha: "asc" } },
    },
  });
  const por = (etapa: string) => p.partidas.filter((x) => x.etapa === etapa);
  const tot = (xs: { total: { toString(): string } | null }[]) => sumar(xs.filter((x) => x.total).map((x) => x.total!.toString()));
  const estimado = por("ESTIMADO");
  const ejecutado = sumar(p.egresos.map((e) => e.importe.toString()));
  const pagado = sumar(p.egresos.filter((e) => e.pagado).map((e) => e.importe.toString()));
  const esc = (k: "precioBajo" | "precioAlto") => sumar(estimado.filter((x) => x.cantidad && x[k]).map((x) => d(x.cantidad!.toString()).times(d(x[k]!.toString()))));
  return {
    proyecto: p,
    etapas: {
      estimado: { objetivo: tot(estimado), bajo: esc("precioBajo"), alto: esc("precioAlto"), partidas: estimado.length, revision: estimado.filter((x) => x.calidadDato === "REVISION_TECNICA_REQUERIDA").length, faltantes: estimado.filter((x) => !x.total).length },
      cotizacion: { total: tot(por("COTIZACION_PROVEEDOR")), partidas: por("COTIZACION_PROVEEDOR").length },
      aprobado: { total: p.presupuestoAprobado ? d(p.presupuestoAprobado.toString()) : null, partidas: por("APROBADO").length },
      ordenes: p.ordenes.length,
      ejecutado,
      pagado,
      pendienteDePago: ejecutado.minus(pagado),
      costoFinal: p.estado === "FINALIZADO" ? ejecutado : null,
      desviacion: p.presupuestoAprobado ? desviacion(p.presupuestoAprobado.toString(), ejecutado) : null,
    },
    alcancePorSector: Object.entries(p.alcances.reduce<Record<string, number>>((a, x) => ((a[x.unidad?.identificador ? `Unidad ${x.unidad.identificador}` : x.sector] = (a[x.unidad?.identificador ? `Unidad ${x.unidad.identificador}` : x.sector] ?? 0) + 1), a), {})),
  };
}

export { Decimal };
