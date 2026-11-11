import { z } from "zod";
import { prisma, ErrorNegocio } from "../db";
import { exigir, filtroSociedad, alcance, ROLES_GLOBALES, type Sesion } from "../authz";
import { auditar } from "../audit";
import { hashPassword } from "../auth";
import { vencimientosDocumentales } from "./documentos";
import { estadoOcupacion } from "../../domain/ocupacion";
import { d, sumar, Decimal } from "../../domain/money";
import { hoyAsuncion } from "../../domain/periodo";
import type { Rol } from "@prisma/client";

// ───────────── Inventario declarado y ocupación declarada ─────────────

export async function declararInventario(s: Sesion, propiedadId: string, input: { deptos: number; locales: number; fuente: string }) {
  const p = await prisma.propiedad.findUnique({ where: { id: propiedadId } });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.");
  exigir(s, "GESTIONAR_MAESTROS", p.sociedadId, p.id);
  if (!input.fuente?.trim()) throw new ErrorNegocio("Indique la fuente del inventario declarado.");
  return prisma.$transaction(async (tx) => {
    const act = await tx.propiedad.update({ where: { id: propiedadId }, data: { inventarioDeptosDeclarado: input.deptos, inventarioLocalesDeclarado: input.locales, inventarioFuente: input.fuente } });
    await auditar(tx, s, "PROPIEDAD_DECLARAR_INVENTARIO", "Propiedad", propiedadId, { sociedadId: p.sociedadId, antes: { deptos: p.inventarioDeptosDeclarado, locales: p.inventarioLocalesDeclarado, fuente: p.inventarioFuente }, despues: input });
    return act;
  });
}

/** Registra una situación declarada (p. ej. "VACANTE"). No crea ni cierra contratos: se contrasta con la ocupación derivada. */
export async function declararOcupacion(s: Sesion, unidadId: string, situacion: "VACANTE" | "OCUPADA", fuente: string) {
  const u = await prisma.unidad.findUnique({ where: { id: unidadId }, include: { propiedad: true } });
  if (!u) throw new ErrorNegocio("Unidad no encontrada.");
  exigir(s, "GESTIONAR_MAESTROS", u.propiedad.sociedadId, u.propiedadId);
  if (!fuente?.trim()) throw new ErrorNegocio("Indique la fuente de la declaración.");
  return prisma.$transaction(async (tx) => {
    const act = await tx.unidad.update({ where: { id: unidadId }, data: { ocupacionDeclarada: situacion, ocupacionDeclaradaFuente: fuente } });
    await auditar(tx, s, "UNIDAD_DECLARAR_OCUPACION", "Unidad", unidadId, { sociedadId: u.propiedad.sociedadId, antes: { ocupacionDeclarada: u.ocupacionDeclarada }, despues: { situacion, fuente } });
    return act;
  });
}

// ───────────── Saldos por unidad y edificio ─────────────

export async function saldosPropiedad(s: Sesion, propiedadId: string) {
  const p = await prisma.propiedad.findUnique({ where: { id: propiedadId } });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.");
  exigir(s, "LEER", p.sociedadId, p.id);
  const hoy = hoyAsuncion();
  const obls = await prisma.obligacion.findMany({ where: { propiedadId, estado: { not: "ANULADA" } }, select: { unidadId: true, moneda: true, concepto: true, saldo: true, estado: true, fechaVencimiento: true } });
  const pagos = await prisma.pago.findMany({ where: { propiedadId, estado: "REGISTRADO" }, select: { unidadId: true, moneda: true, importe: true, respaldo: true } });
  const porUnidad = new Map<string, Record<string, { saldo: Decimal; vencido: Decimal; alquiler: Decimal; expensas: Decimal; sinRespaldo: Decimal }>>();
  const acc = (u: string, m: string) => {
    const x = porUnidad.get(u) ?? {};
    x[m] ??= { saldo: new Decimal(0), vencido: new Decimal(0), alquiler: new Decimal(0), expensas: new Decimal(0), sinRespaldo: new Decimal(0) };
    porUnidad.set(u, x);
    return x[m];
  };
  for (const o of obls) {
    const a = acc(o.unidadId ?? "sin-unidad", o.moneda);
    const sal = d(o.saldo.toString());
    a.saldo = a.saldo.plus(sal);
    if (o.concepto === "ALQUILER") a.alquiler = a.alquiler.plus(sal);
    if (o.concepto === "EXPENSAS") a.expensas = a.expensas.plus(sal);
    if ((o.estado === "PENDIENTE" || o.estado === "PARCIAL") && o.fechaVencimiento < hoy) a.vencido = a.vencido.plus(sal);
  }
  for (const pg of pagos) if (pg.respaldo === "SIN_RESPALDO") { const a = acc(pg.unidadId ?? "sin-unidad", pg.moneda); a.sinRespaldo = a.sinRespaldo.plus(d(pg.importe.toString())); }
  const total: Record<string, { saldo: Decimal; vencido: Decimal; sinRespaldo: Decimal }> = {};
  for (const x of porUnidad.values()) for (const [m, v] of Object.entries(x)) {
    total[m] ??= { saldo: new Decimal(0), vencido: new Decimal(0), sinRespaldo: new Decimal(0) };
    total[m].saldo = total[m].saldo.plus(v.saldo); total[m].vencido = total[m].vencido.plus(v.vencido); total[m].sinRespaldo = total[m].sinRespaldo.plus(v.sinRespaldo);
  }
  return { porUnidad, total };
}

// ───────────── Alertas de información faltante e inconsistencias ─────────────

export interface Alerta {
  nivel: "ERROR" | "ADVERTENCIA" | "INFO";
  categoria: string;
  mensaje: string;
  href?: string;
}

export async function alertas(s: Sesion, sociedadId?: string): Promise<Alerta[]> {
  if (sociedadId) exigir(s, "LEER", sociedadId);
  const soc = { ...filtroSociedad(s), ...(sociedadId ? { sociedadId } : {}) };
  const out: Alerta[] = [];
  const hoy = hoyAsuncion();

  const props = await prisma.propiedad.findMany({ where: { deletedAt: null, ...soc }, include: { unidades: { where: { deletedAt: null }, include: { contratos: { include: { contrato: true } } } } } });
  for (const p of props) {
    const deptos = p.unidades.filter((u) => u.tipo === "DEPARTAMENTO").length;
    const locales = p.unidades.filter((u) => u.tipo === "LOCAL_COMERCIAL").length;
    const otros = p.unidades.filter((u) => u.tipo !== "DEPARTAMENTO" && u.tipo !== "LOCAL_COMERCIAL");
    if (p.inventarioDeptosDeclarado == null) out.push({ nivel: "INFO", categoria: "Inventario", mensaje: `${p.codigo}: sin inventario administrativo declarado.`, href: `/propiedades/${p.id}` });
    else {
      if (p.unidades.length === 0) out.push({ nivel: "ADVERTENCIA", categoria: "Inventario", mensaje: `${p.codigo}: inventario declarado de ${p.inventarioDeptosDeclarado} deptos + ${p.inventarioLocalesDeclarado} local(es), pero no hay unidades registradas (falta la planilla administrativa).`, href: `/propiedades/${p.id}` });
      else if (deptos !== p.inventarioDeptosDeclarado || locales !== p.inventarioLocalesDeclarado) out.push({ nivel: "ADVERTENCIA", categoria: "Inventario", mensaje: `${p.codigo}: declarado ${p.inventarioDeptosDeclarado} deptos + ${p.inventarioLocalesDeclarado} local(es); registrado ${deptos} + ${locales}.`, href: `/propiedades/${p.id}` });
    }
    if (otros.length) out.push({ nivel: "ADVERTENCIA", categoria: "Inventario", mensaje: `${p.codigo}: unidades de tipo no clasificado (${otros.map((u) => u.identificador).join(", ")}).`, href: `/propiedades/${p.id}` });
    for (const u of p.unidades) {
      const cs = u.contratos.map((x) => x.contrato).filter((c) => c.fechaInicio && c.fechaFin);
      const occ = estadoOcupacion(u.estadoOperativo, cs.map((c) => ({ estado: c.estado, fechaInicio: c.fechaInicio!, fechaFin: c.fechaFin!, fechaRescision: c.fechaRescision, fechaEntrega: c.fechaEntrega, fechaDevolucion: c.fechaDevolucion })), hoy);
      if (u.ocupacionDeclarada === "VACANTE" && occ === "OCUPADA") out.push({ nivel: "ERROR", categoria: "Contradicción", mensaje: `${p.codigo} ${u.identificador}: declarada VACANTE (${u.ocupacionDeclaradaFuente}) pero tiene contrato vigente.`, href: `/unidades/${u.id}` });
      if (u.ocupacionDeclarada === "VACANTE" && u.contratos.some((x) => x.contrato.estado === "BORRADOR")) out.push({ nivel: "ADVERTENCIA", categoria: "Contradicción", mensaje: `${p.codigo} ${u.identificador}: declarada VACANTE pero la planilla la vincula a un inquilino (contrato borrador).`, href: `/unidades/${u.id}` });
      if (u.superficieM2 == null) out.push({ nivel: "INFO", categoria: "Faltante", mensaje: `${p.codigo} ${u.identificador}: sin superficie (m²).`, href: `/unidades/${u.id}` });
    }
  }

  const borradores = await prisma.contrato.findMany({ where: { ...soc, deletedAt: null, estado: "BORRADOR" }, include: { propiedad: { select: { codigo: true } }, unidades: { include: { unidad: { select: { identificador: true, id: true } } } } } });
  for (const c of borradores) out.push({ nivel: "ADVERTENCIA", categoria: "Contrato pendiente de validación", mensaje: `${c.propiedad.codigo} ${c.unidades.map((u) => u.unidad.identificador).join(", ")}: contrato ${c.codigo} en BORRADOR${c.fechaInicio ? "" : " sin fechas"} — falta contrato original.`, href: c.unidades[0] ? `/unidades/${c.unidades[0].unidad.id}` : undefined });

  const sinDoc = await prisma.persona.count({ where: { deletedAt: null, documentoNormalizado: null, partes: { some: { contrato: soc } } } });
  if (sinDoc) out.push({ nivel: "ADVERTENCIA", categoria: "Faltante", mensaje: `${sinDoc} inquilino(s) sin CI/RUC registrado.`, href: "/inquilinos" });

  const sinResp = await prisma.pago.aggregate({ _count: true, _sum: { importe: true }, where: { ...soc, estado: "REGISTRADO", respaldo: "SIN_RESPALDO" } });
  if (sinResp._count) out.push({ nivel: "ADVERTENCIA", categoria: "Pagos sin respaldo", mensaje: `${sinResp._count} pago(s) declarados sin comprobante ni conciliación bancaria (total ${sinResp._sum.importe?.toString()}).`, href: "/cobranzas" });

  const ivaPend = await prisma.obligacion.count({ where: { ...soc, ivaPendiente: true, estado: { not: "ANULADA" } } });
  if (ivaPend) out.push({ nivel: "INFO", categoria: "Fiscal", mensaje: `${ivaPend} obligación(es) con tratamiento de IVA pendiente de validación (PD-02).` });

  const filasProblema = await prisma.importRow.findMany({ where: { estado: { in: ["ERROR", "DUPLICADO", "ADVERTENCIA"] }, batch: { estado: "CONFIRMADO", ...soc } }, select: { problemas: true, batchId: true } });
  const porCodigo = new Map<string, { n: number; batch: string; ej: string }>();
  for (const f of filasProblema) for (const p of (f.problemas as { codigo: string; severidad: string; mensaje: string }[]) ?? []) {
    if (p.severidad === "INFO") continue;
    const e = porCodigo.get(p.codigo) ?? { n: 0, batch: f.batchId, ej: p.mensaje };
    e.n++; porCodigo.set(p.codigo, e);
  }
  for (const [cod, e] of porCodigo) out.push({ nivel: "ADVERTENCIA", categoria: "Inconsistencia de planilla", mensaje: `${cod} (${e.n}): ${e.ej}`, href: `/importaciones/${e.batch}` });

  for (const v of await vencimientosDocumentales(s)) out.push({ nivel: v.dias < 0 ? "ERROR" : "ADVERTENCIA", categoria: "Vencimiento documental", mensaje: `${v.tipo} "${v.titulo}" ${v.dias < 0 ? `vencido hace ${-v.dias} días` : `vence en ${v.dias} días`}.`, href: "/documentos" });

  const pendImport = await prisma.importBatch.count({ where: { ...soc, estado: { in: ["ANALIZADO", "MAPEADO", "VALIDADO"] } } });
  if (pendImport) out.push({ nivel: "INFO", categoria: "Importación", mensaje: `${pendImport} importación(es) pendientes de confirmación.`, href: "/importaciones" });

  const orden = { ERROR: 0, ADVERTENCIA: 1, INFO: 2 };
  return out.sort((a, b) => orden[a.nivel] - orden[b.nivel]);
}

// ───────────── Usuarios ─────────────

export const UsuarioInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  nombre: z.string().trim().min(2),
  password: z.string().min(12, "Mínimo 12 caracteres"),
  rol: z.enum(["SUPERADMIN", "ADMIN_GENERAL", "ADMIN_SOCIEDAD", "RESPONSABLE_PROPIEDAD", "COBRANZAS", "FACTURACION", "MANTENIMIENTO", "PROPIETARIO_CONSULTA", "AUDITOR"]),
  sociedadId: z.string().optional().nullable(),
  propiedadId: z.string().optional().nullable(),
});

export async function crearUsuario(s: Sesion, input: z.input<typeof UsuarioInput>) {
  exigir(s, "ADMIN_USUARIOS");
  const data = UsuarioInput.parse(input);
  if (!data.sociedadId && !ROLES_GLOBALES.includes(data.rol as Rol)) throw new ErrorNegocio(`El rol ${data.rol} debe asignarse a una sociedad.`);
  if (data.sociedadId && ROLES_GLOBALES.includes(data.rol as Rol) && data.rol !== "AUDITOR") throw new ErrorNegocio(`El rol ${data.rol} es global: no se asigna a una sociedad.`);
  if (await prisma.usuario.findUnique({ where: { email: data.email } })) throw new ErrorNegocio("Ya existe un usuario con ese email.", "DUPLICADO");
  const passwordHash = await hashPassword(data.password);
  return prisma.$transaction(async (tx) => {
    const u = await tx.usuario.create({ data: { email: data.email, nombre: data.nombre, passwordHash, asignaciones: { create: { rol: data.rol, sociedadId: data.sociedadId ?? null, propiedadId: data.propiedadId ?? null } } } });
    await auditar(tx, s, "USUARIO_CREAR", "Usuario", u.id, { sociedadId: data.sociedadId ?? null, despues: { email: u.email, rol: data.rol, sociedadId: data.sociedadId } });
    return { id: u.id, email: u.email };
  });
}

export async function desactivarUsuario(s: Sesion, usuarioId: string, motivo: string) {
  exigir(s, "ADMIN_USUARIOS");
  if (usuarioId === s.usuarioId) throw new ErrorNegocio("No puede desactivar su propio usuario.");
  return prisma.$transaction(async (tx) => {
    await tx.usuario.update({ where: { id: usuarioId }, data: { activo: false } });
    await auditar(tx, s, "USUARIO_DESACTIVAR", "Usuario", usuarioId, { motivo });
  });
}

export async function listarUsuarios(s: Sesion) {
  exigir(s, "ADMIN_USUARIOS");
  return prisma.usuario.findMany({ select: { id: true, email: true, nombre: true, activo: true, ultimoAcceso: true, asignaciones: { include: { sociedad: { select: { razonSocial: true } } } } }, orderBy: { email: "asc" } });
}

export { alcance };
