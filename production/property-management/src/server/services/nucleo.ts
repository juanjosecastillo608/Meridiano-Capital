import { z } from "zod";
import { prisma, ErrorNegocio, ErrorPermiso } from "../db";
import { exigir, filtroSociedad, alcance, puede, type Sesion } from "../authz";
import { auditar } from "../audit";
import { normalizarDocumento } from "../../domain/documentos";

// ───────────── Sociedades ─────────────

export const SociedadInput = z.object({
  razonSocial: z.string().trim().min(3),
  ruc: z.string().trim().regex(/^\d{5,9}-\d$/, "RUC con formato 12345678-9").optional().nullable(),
  domicilioFiscal: z.string().trim().optional().nullable(),
  representanteLegal: z.string().trim().optional().nullable(),
  telefono: z.string().trim().optional().nullable(),
  email: z.string().trim().email().optional().nullable(),
  monedaOperacion: z.enum(["PYG", "USD"]).default("PYG"),
  estado: z.enum(["ACTIVA", "EN_CONSTITUCION", "INACTIVA"]).default("ACTIVA"),
  observaciones: z.string().optional().nullable(),
  estadoDato: z.enum(["PENDIENTE_REVISION", "VALIDADO"]).default("PENDIENTE_REVISION"),
});

export async function crearSociedad(s: Sesion, input: z.input<typeof SociedadInput>) {
  exigir(s, "CREAR_SOCIEDAD");
  const data = SociedadInput.parse(input);
  return prisma.$transaction(async (tx) => {
    if (data.ruc && (await tx.sociedad.findUnique({ where: { ruc: data.ruc } }))) throw new ErrorNegocio(`Ya existe una sociedad con RUC ${data.ruc}.`, "DUPLICADO");
    const soc = await tx.sociedad.create({ data });
    await auditar(tx, s, "SOCIEDAD_CREAR", "Sociedad", soc.id, { sociedadId: soc.id, despues: soc });
    return soc;
  });
}

export async function listarSociedades(s: Sesion) {
  const a = alcance(s);
  return prisma.sociedad.findMany({
    where: { deletedAt: null, ...(a.global ? {} : { id: { in: a.sociedadIds } }) },
    include: { _count: { select: { propiedades: true, contratos: true } } },
    orderBy: { razonSocial: "asc" },
  });
}

export async function obtenerSociedad(s: Sesion, id: string) {
  exigir(s, "LEER", id);
  const soc = await prisma.sociedad.findFirst({ where: { id, deletedAt: null }, include: { cuentas: { where: { deletedAt: null } }, propiedades: { where: { deletedAt: null }, include: { _count: { select: { unidades: true } } } } } });
  if (!soc) throw new ErrorNegocio("Sociedad no encontrada.", "NO_ENCONTRADO");
  return soc;
}

export const CuentaInput = z.object({ sociedadId: z.string(), banco: z.string().trim().min(2), numero: z.string().trim().min(3), tipo: z.string().optional().nullable(), moneda: z.enum(["PYG", "USD"]), titular: z.string().optional().nullable() });

export async function crearCuentaBancaria(s: Sesion, input: z.input<typeof CuentaInput>) {
  const data = CuentaInput.parse(input);
  exigir(s, "CAMBIAR_CUENTA_BANCARIA", data.sociedadId);
  return prisma.$transaction(async (tx) => {
    const c = await tx.cuentaBancaria.create({ data });
    await auditar(tx, s, "CUENTA_BANCARIA_CREAR", "CuentaBancaria", c.id, { sociedadId: c.sociedadId, despues: c });
    return c;
  });
}

// ───────────── Propiedades ─────────────

export const PropiedadInput = z.object({
  sociedadId: z.string(),
  codigo: z.string().trim().min(2).max(20).regex(/^[A-Z0-9-]+$/, "Código en mayúsculas, números y guiones"),
  nombre: z.string().trim().min(2),
  direccion: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  barrio: z.string().optional().nullable(),
  catastro: z.string().optional().nullable(),
  cantidadPisos: z.coerce.number().int().positive().optional().nullable(),
  cuentaBancariaId: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export async function crearPropiedad(s: Sesion, input: z.input<typeof PropiedadInput>, extra: { origenDato?: "MANUAL" | "IMPORTADO"; importBatchId?: string } = {}) {
  const data = PropiedadInput.parse(input);
  exigir(s, "GESTIONAR_MAESTROS", data.sociedadId);
  return prisma.$transaction(async (tx) => {
    if (await tx.propiedad.findUnique({ where: { sociedadId_codigo: { sociedadId: data.sociedadId, codigo: data.codigo } } })) throw new ErrorNegocio(`Ya existe la propiedad ${data.codigo} en esta sociedad.`, "DUPLICADO");
    if (data.cuentaBancariaId) {
      const c = await tx.cuentaBancaria.findUnique({ where: { id: data.cuentaBancariaId } });
      if (!c || c.sociedadId !== data.sociedadId) throw new ErrorNegocio("La cuenta receptora debe pertenecer a la misma sociedad.");
    }
    const p = await tx.propiedad.create({ data: { ...data, ...extra } });
    await tx.titularidad.create({ data: { propiedadId: p.id, sociedadId: data.sociedadId, porcentaje: 100 } });
    await auditar(tx, s, "PROPIEDAD_CREAR", "Propiedad", p.id, { sociedadId: p.sociedadId, despues: p });
    return p;
  });
}

export async function listarPropiedades(s: Sesion, sociedadId?: string) {
  if (sociedadId) exigir(s, "LEER", sociedadId);
  return prisma.propiedad.findMany({
    where: { deletedAt: null, ...filtroSociedad(s), ...(sociedadId ? { sociedadId } : {}) },
    include: { sociedad: { select: { razonSocial: true } }, _count: { select: { unidades: true } } },
    orderBy: [{ sociedadId: "asc" }, { codigo: "asc" }],
  });
}

export async function obtenerPropiedad(s: Sesion, id: string) {
  const p = await prisma.propiedad.findFirst({
    where: { id, deletedAt: null },
    include: {
      sociedad: true,
      cuentaBancaria: true,
      titularidades: { include: { sociedad: { select: { razonSocial: true } } } },
      unidades: { where: { deletedAt: null }, orderBy: { identificador: "asc" }, include: { contratos: { include: { contrato: { include: { partes: { include: { persona: true } }, condiciones: { orderBy: { vigenteDesde: "desc" }, take: 1 } } } } } } },
    },
  });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.", "NO_ENCONTRADO");
  exigir(s, "LEER", p.sociedadId, p.id);
  // Orden natural de unidades: 2, 3, … 10, 11 (no "10" antes que "2"); locales y otros al final.
  p.unidades.sort((a, b) => Number(a.tipo !== "DEPARTAMENTO") - Number(b.tipo !== "DEPARTAMENTO") || a.identificador.localeCompare(b.identificador, "es", { numeric: true }));
  return p;
}

// ───────────── Unidades ─────────────

export const UnidadInput = z.object({
  propiedadId: z.string(),
  identificador: z.string().trim().min(1),
  piso: z.string().optional().nullable(),
  tipo: z.enum(["DEPARTAMENTO", "LOCAL_COMERCIAL", "OFICINA", "COCHERA", "DEPOSITO", "OTRO"]),
  superficieM2: z.string().optional().nullable(),
  dormitorios: z.coerce.number().int().min(0).optional().nullable(),
  banos: z.coerce.number().int().min(0).optional().nullable(),
  estacionamientos: z.coerce.number().int().min(0).optional().nullable(),
  caracteristicas: z.string().optional().nullable(),
  estadoFisico: z.string().optional().nullable(),
  estadoOperativo: z.enum(["OPERATIVA", "RESERVADA", "EN_MANTENIMIENTO", "EN_REMODELACION", "FUERA_DE_SERVICIO"]).default("OPERATIVA"),
  alquilerReferencia: z.string().optional().nullable(),
  alquilerReferenciaMoneda: z.enum(["PYG", "USD"]).optional().nullable(),
  alquilerReferenciaFuente: z.string().optional().nullable(),
  coeficienteExpensas: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export async function crearUnidad(s: Sesion, input: z.input<typeof UnidadInput>) {
  const data = UnidadInput.parse(input);
  const p = await prisma.propiedad.findUnique({ where: { id: data.propiedadId } });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.");
  exigir(s, "GESTIONAR_MAESTROS", p.sociedadId, p.id);
  if (data.alquilerReferencia && !data.alquilerReferenciaFuente) throw new ErrorNegocio("El alquiler de referencia de mercado requiere fuente (p. ej. AMC SK-14).");
  return prisma.$transaction(async (tx) => {
    const u = await tx.unidad.create({ data });
    await auditar(tx, s, "UNIDAD_CREAR", "Unidad", u.id, { sociedadId: p.sociedadId, despues: u });
    return u;
  });
}

export async function obtenerUnidad(s: Sesion, id: string) {
  const u = await prisma.unidad.findFirst({
    where: { id, deletedAt: null },
    include: {
      propiedad: { include: { sociedad: { select: { id: true, razonSocial: true } } } },
      contratos: { include: { contrato: { include: { partes: { include: { persona: true } }, condiciones: { orderBy: { vigenteDesde: "asc" } } } } } },
      ordenes: { orderBy: { fechaSolicitud: "desc" } },
      remodelaciones: { orderBy: { createdAt: "desc" } },
      egresos: { where: { deletedAt: null }, orderBy: { fecha: "desc" } },
    },
  });
  if (!u) throw new ErrorNegocio("Unidad no encontrada.", "NO_ENCONTRADO");
  exigir(s, "LEER", u.propiedad.sociedadId, u.propiedadId);
  return u;
}

// ───────────── Personas ─────────────

export const PersonaInput = z.object({
  tipo: z.enum(["FISICA", "JURIDICA"]),
  nombre: z.string().trim().min(2),
  documentoTipo: z.enum(["CI", "RUC", "PASAPORTE", "OTRO"]).optional().nullable(),
  documentoNumero: z.string().trim().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  domicilio: z.string().optional().nullable(),
  personaContacto: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

/**
 * Las personas son compartidas entre sociedades (un inquilino puede alquilar
 * en varias), pero solo son VISIBLES para quien tiene acceso a alguna
 * sociedad donde la persona tiene contrato, obligación o pago.
 */
export async function crearPersona(s: Sesion, sociedadId: string, input: z.input<typeof PersonaInput>) {
  exigir(s, "GESTIONAR_MAESTROS", sociedadId);
  const data = PersonaInput.parse(input);
  const documentoNormalizado = normalizarDocumento(data.documentoTipo, data.documentoNumero);
  if (documentoNormalizado) {
    const existe = await prisma.persona.findUnique({ where: { documentoNormalizado } });
    if (existe) throw new ErrorNegocio("Ya existe una persona con ese documento. Vincule la existente en lugar de crear otra.", "DUPLICADO", { personaId: existe.id });
  }
  return prisma.$transaction(async (tx) => {
    const p = await tx.persona.create({ data: { ...data, documentoNormalizado } });
    await auditar(tx, s, "PERSONA_CREAR", "Persona", p.id, { sociedadId });
    return p;
  });
}

export function filtroPersonaVisible(s: Sesion) {
  const a = alcance(s);
  if (a.global) return {};
  const enSoc = { sociedadId: { in: a.sociedadIds } };
  return { OR: [{ partes: { some: { contrato: enSoc } } }, { obligaciones: { some: enSoc } }, { pagos: { some: enSoc } }] };
}

export async function listarPersonas(s: Sesion, q?: string) {
  return prisma.persona.findMany({
    where: { deletedAt: null, ...filtroPersonaVisible(s), ...(q ? { nombre: { contains: q, mode: "insensitive" as const } } : {}) },
    include: { partes: { include: { contrato: { select: { codigo: true, estado: true, sociedadId: true } } } } },
    orderBy: { nombre: "asc" },
    take: 200,
  });
}

export async function obtenerPersona(s: Sesion, id: string) {
  const p = await prisma.persona.findFirst({ where: { id, deletedAt: null, ...filtroPersonaVisible(s) }, include: { partes: { include: { contrato: { include: { unidades: { include: { unidad: true } }, propiedad: true } } } } } });
  if (!p) throw new ErrorPermiso("Persona no encontrada o sin acceso.");
  return p;
}

export { puede };
