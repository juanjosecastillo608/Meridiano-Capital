import type { Rol } from "@prisma/client";
import { ErrorPermiso } from "./db";

export interface Asignacion {
  rol: Rol;
  sociedadId: string | null;
  propiedadId: string | null;
}

export interface Sesion {
  usuarioId: string;
  email: string;
  nombre: string;
  asignaciones: Asignacion[];
}

export type Permiso =
  | "LEER"
  | "GESTIONAR_MAESTROS" // sociedades, propiedades, unidades, personas
  | "GESTIONAR_CONTRATOS"
  | "MODIFICAR_ALQUILER"
  | "GENERAR_OBLIGACIONES"
  | "REGISTRAR_PAGO"
  | "REVERTIR_PAGO"
  | "FACTURAR"
  | "ANULAR_FACTURA"
  | "GESTIONAR_MANTENIMIENTO"
  | "APROBAR_GASTO"
  | "CAMBIAR_CUENTA_BANCARIA"
  | "IMPORTAR"
  | "CREAR_SOCIEDAD"
  | "ADMIN_USUARIOS"
  | "VER_AUDITORIA"
  | "GESTIONAR_DOCUMENTOS"
  | "VER_DOCUMENTOS_SENSIBLES" // poderes, actas, representantes
  | "GESTIONAR_REMODELACIONES"
  | "APROBAR_PRESUPUESTO";

const TODOS: Permiso[] = ["LEER", "GESTIONAR_MAESTROS", "GESTIONAR_CONTRATOS", "MODIFICAR_ALQUILER", "GENERAR_OBLIGACIONES", "REGISTRAR_PAGO", "REVERTIR_PAGO", "FACTURAR", "ANULAR_FACTURA", "GESTIONAR_MANTENIMIENTO", "APROBAR_GASTO", "CAMBIAR_CUENTA_BANCARIA", "IMPORTAR", "VER_AUDITORIA", "GESTIONAR_DOCUMENTOS", "VER_DOCUMENTOS_SENSIBLES", "GESTIONAR_REMODELACIONES", "APROBAR_PRESUPUESTO"];

export const MATRIZ: Record<Rol, Permiso[]> = {
  SUPERADMIN: [...TODOS, "CREAR_SOCIEDAD", "ADMIN_USUARIOS"],
  ADMIN_GENERAL: [...TODOS, "CREAR_SOCIEDAD"],
  ADMIN_SOCIEDAD: TODOS,
  RESPONSABLE_PROPIEDAD: ["LEER", "GESTIONAR_MAESTROS", "GESTIONAR_CONTRATOS", "GESTIONAR_MANTENIMIENTO", "REGISTRAR_PAGO", "GESTIONAR_DOCUMENTOS", "GESTIONAR_REMODELACIONES"],
  COBRANZAS: ["LEER", "REGISTRAR_PAGO", "GENERAR_OBLIGACIONES"],
  FACTURACION: ["LEER", "FACTURAR", "ANULAR_FACTURA"],
  MANTENIMIENTO: ["LEER", "GESTIONAR_MANTENIMIENTO", "GESTIONAR_REMODELACIONES"],
  PROPIETARIO_CONSULTA: ["LEER"],
  AUDITOR: ["LEER", "VER_AUDITORIA", "VER_DOCUMENTOS_SENSIBLES"],
};

/** Roles que pueden asignarse sin sociedad (alcance global). */
export const ROLES_GLOBALES: Rol[] = ["SUPERADMIN", "ADMIN_GENERAL", "AUDITOR"];

export interface Alcance {
  global: boolean;
  sociedadIds: string[];
}

export function alcance(s: Sesion): Alcance {
  const global = s.asignaciones.some((a) => a.sociedadId === null && ROLES_GLOBALES.includes(a.rol));
  return { global, sociedadIds: [...new Set(s.asignaciones.map((a) => a.sociedadId).filter((x): x is string => !!x))] };
}

/** Filtro Prisma por sociedad, aplicado en TODA consulta de datos de negocio. */
export function filtroSociedad(s: Sesion, campo = "sociedadId"): Record<string, unknown> {
  const a = alcance(s);
  return a.global ? {} : { [campo]: { in: a.sociedadIds } };
}

export function puede(s: Sesion, permiso: Permiso, sociedadId?: string | null, propiedadId?: string | null): boolean {
  return s.asignaciones.some((a) => {
    if (!MATRIZ[a.rol].includes(permiso)) return false;
    if (a.sociedadId === null) return ROLES_GLOBALES.includes(a.rol);
    if (!sociedadId || a.sociedadId !== sociedadId) return false;
    if (a.propiedadId && propiedadId && a.propiedadId !== propiedadId) return false;
    if (a.propiedadId && !propiedadId && permiso !== "LEER") return false;
    return true;
  });
}

export function exigir(s: Sesion, permiso: Permiso, sociedadId?: string | null, propiedadId?: string | null): void {
  if (!puede(s, permiso, sociedadId, propiedadId)) throw new ErrorPermiso();
}

/** Sesión técnica para scripts de línea de comandos (seed, importación por CLI). */
export function sesionSistema(): Sesion {
  return { usuarioId: "sistema", email: "sistema@local", nombre: "Proceso de sistema", asignaciones: [{ rol: "SUPERADMIN", sociedadId: null, propiedadId: null }] };
}
