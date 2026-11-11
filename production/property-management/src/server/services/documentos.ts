import { z } from "zod";
import { prisma, ErrorNegocio, ErrorPermiso } from "../db";
import { exigir, puede, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { guardarArchivo, leerArchivo } from "../storage";
import { parsearFechaISO, hoyAsuncion, diferenciaDias } from "../../domain/periodo";

/**
 * Expediente digital por sociedad y por propiedad. Los documentos marcados
 * `sensible` (poderes, actas, datos de representantes) solo se listan y
 * descargan con VER_DOCUMENTOS_SENSIBLES en esa sociedad.
 */
export const TIPOS = ["RUC", "PODER", "ESTATUTO", "ACTA", "PLANO", "RESOLUCION_MUNICIPAL", "MAPA_UBICACION", "PLANILLA_ADMINISTRATIVA", "PRESUPUESTO", "CONTRATO_ALQUILER", "COMPROBANTE", "OTRO"] as const;
const SENSIBLES_POR_DEFECTO = new Set(["PODER", "ESTATUTO", "ACTA"]);
const MIME: Record<string, string> = { ".pdf": "application/pdf", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

export const DocumentoInput = z.object({
  sociedadId: z.string(),
  propiedadId: z.string().optional().nullable(),
  entidad: z.string().default("EXPEDIENTE"),
  entidadId: z.string().optional().nullable(),
  tipo: z.enum(TIPOS),
  titulo: z.string().trim().min(2),
  fechaEmision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  fechaVencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  sensible: z.boolean().optional(),
  observaciones: z.string().optional().nullable(),
});

export async function subirDocumento(s: Sesion, input: z.input<typeof DocumentoInput>, nombreArchivo: string, buffer: Buffer) {
  const data = DocumentoInput.parse(input);
  exigir(s, "GESTIONAR_DOCUMENTOS", data.sociedadId, data.propiedadId);
  const ext = (nombreArchivo.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  if (!MIME[ext]) throw new ErrorNegocio(`Tipo de archivo no admitido (${ext || "sin extensión"}). Admitidos: ${Object.keys(MIME).join(", ")}.`);
  if (buffer.length > 25 * 1024 * 1024) throw new ErrorNegocio("El archivo supera 25 MB.");
  if (data.propiedadId) {
    const p = await prisma.propiedad.findUnique({ where: { id: data.propiedadId } });
    if (!p || p.sociedadId !== data.sociedadId) throw new ErrorNegocio("La propiedad no pertenece a la sociedad.");
  }
  const sensible = data.sensible ?? SENSIBLES_POR_DEFECTO.has(data.tipo);
  const arch = await guardarArchivo(buffer, nombreArchivo, `documentos/${data.sociedadId}`);
  const duplicado = await prisma.documento.findFirst({ where: { sociedadId: data.sociedadId, sha256: arch.sha256, deletedAt: null, entidad: data.entidad } });
  return prisma.$transaction(async (tx) => {
    const d = await tx.documento.create({
      data: {
        sociedadId: data.sociedadId, propiedadId: data.propiedadId ?? null, entidad: data.entidad, entidadId: data.entidadId ?? null, tipo: data.tipo, titulo: data.titulo,
        fechaEmision: data.fechaEmision ? parsearFechaISO(data.fechaEmision) : null, fechaVencimiento: data.fechaVencimiento ? parsearFechaISO(data.fechaVencimiento) : null,
        sensible, observaciones: data.observaciones ?? null, nombreArchivo, storageKey: arch.storageKey, sha256: arch.sha256, mime: MIME[ext], tamanoBytes: arch.tamanoBytes,
        subidoPorId: s.usuarioId === "sistema" ? null : s.usuarioId,
      },
    });
    await auditar(tx, s, "DOCUMENTO_SUBIR", "Documento", d.id, { sociedadId: data.sociedadId, despues: { tipo: d.tipo, titulo: d.titulo, sha256: d.sha256, sensible } });
    return { documento: d, duplicadoDe: duplicado?.id ?? null };
  });
}

/** Lista documentos visibles: oculta los sensibles a quien no tiene permiso (no solo deshabilita el link). */
export async function listarDocumentos(s: Sesion, f: { sociedadId?: string; propiedadId?: string; entidad?: string; entidadId?: string } = {}) {
  if (f.sociedadId) exigir(s, "LEER", f.sociedadId);
  const docs = await prisma.documento.findMany({
    where: { deletedAt: null, ...filtroSociedad(s), ...(f.sociedadId ? { sociedadId: f.sociedadId } : {}), ...(f.propiedadId ? { propiedadId: f.propiedadId } : {}), ...(f.entidad ? { entidad: f.entidad } : {}), ...(f.entidadId ? { entidadId: f.entidadId } : {}), NOT: { entidad: "IMPORTACION" } },
    include: { propiedad: { select: { codigo: true, nombre: true } }, sociedad: { select: { razonSocial: true } } },
    orderBy: [{ tipo: "asc" }, { createdAt: "desc" }],
  });
  const visibles = docs.filter((d) => !d.sensible || puede(s, "VER_DOCUMENTOS_SENSIBLES", d.sociedadId));
  return { documentos: visibles, ocultos: docs.length - visibles.length };
}

export async function obtenerArchivo(s: Sesion, id: string) {
  const d = await prisma.documento.findFirst({ where: { id, deletedAt: null } });
  if (!d || !d.sociedadId) throw new ErrorPermiso("Documento no encontrado o sin acceso.");
  // Mismo mensaje para "no existe" y "no autorizado": no revela existencia por URL.
  if (!puede(s, "LEER", d.sociedadId, d.propiedadId)) throw new ErrorPermiso("Documento no encontrado o sin acceso.");
  if (d.sensible && !puede(s, "VER_DOCUMENTOS_SENSIBLES", d.sociedadId)) throw new ErrorPermiso("Documento no encontrado o sin acceso.");
  return { documento: d, contenido: await leerArchivo(d.storageKey) };
}

export async function vencimientosDocumentales(s: Sesion, diasAviso = 60, hoy = hoyAsuncion()) {
  const docs = await prisma.documento.findMany({ where: { deletedAt: null, fechaVencimiento: { not: null }, ...filtroSociedad(s) }, include: { sociedad: { select: { razonSocial: true } } } });
  const reps = await prisma.representante.findMany({ where: { deletedAt: null, vigenteHasta: { not: null }, ...filtroSociedad(s) } });
  const out: { tipo: string; titulo: string; sociedad: string; vence: Date; dias: number; sensible: boolean }[] = [];
  for (const d of docs) {
    const dias = diferenciaDias(hoy, d.fechaVencimiento!);
    if (dias <= diasAviso && (!d.sensible || puede(s, "VER_DOCUMENTOS_SENSIBLES", d.sociedadId))) out.push({ tipo: d.tipo, titulo: d.titulo ?? d.nombreArchivo, sociedad: d.sociedad?.razonSocial ?? "", vence: d.fechaVencimiento!, dias, sensible: d.sensible });
  }
  for (const r of reps) {
    const dias = diferenciaDias(hoy, r.vigenteHasta!);
    if (dias <= diasAviso && puede(s, "VER_DOCUMENTOS_SENSIBLES", r.sociedadId)) out.push({ tipo: "REPRESENTACION", titulo: `${r.cargo}: ${r.nombre}`, sociedad: "", vence: r.vigenteHasta!, dias, sensible: true });
  }
  return out.sort((a, b) => a.dias - b.dias);
}

// ───────────── Representantes ─────────────

export const RepresentanteInput = z.object({
  sociedadId: z.string(),
  nombre: z.string().trim().min(3),
  cargo: z.string().trim().min(3),
  facultades: z.string().optional().nullable(),
  documentoId: z.string().optional().nullable(),
  vigenteDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  vigenteHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

export async function registrarRepresentante(s: Sesion, input: z.input<typeof RepresentanteInput>) {
  const data = RepresentanteInput.parse(input);
  exigir(s, "GESTIONAR_DOCUMENTOS", data.sociedadId);
  exigir(s, "VER_DOCUMENTOS_SENSIBLES", data.sociedadId);
  if (data.documentoId) {
    const d = await prisma.documento.findUnique({ where: { id: data.documentoId } });
    if (!d || d.sociedadId !== data.sociedadId) throw new ErrorNegocio("El documento respaldatorio no pertenece a la sociedad.");
  }
  return prisma.$transaction(async (tx) => {
    const r = await tx.representante.create({ data: { ...data, vigenteDesde: data.vigenteDesde ? parsearFechaISO(data.vigenteDesde) : null, vigenteHasta: data.vigenteHasta ? parsearFechaISO(data.vigenteHasta) : null, estadoDato: data.documentoId ? "VALIDADO" : "PENDIENTE_REVISION" } });
    await auditar(tx, s, "REPRESENTANTE_REGISTRAR", "Representante", r.id, { sociedadId: data.sociedadId, despues: { cargo: r.cargo, documentoId: r.documentoId } });
    return r;
  });
}

export async function listarRepresentantes(s: Sesion, sociedadId: string) {
  exigir(s, "LEER", sociedadId);
  if (!puede(s, "VER_DOCUMENTOS_SENSIBLES", sociedadId)) return null; // null = sin permiso (la UI lo explica)
  return prisma.representante.findMany({ where: { sociedadId, deletedAt: null }, orderBy: { cargo: "asc" } });
}
