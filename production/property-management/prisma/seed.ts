/**
 * Seed de CONFIGURACIÓN (no de datos de negocio):
 * - Reglas fiscales versionadas, con su fuente y estado de validación.
 * - Configuración de alertas de vencimiento por defecto (90/60/30).
 *
 * No crea sociedades, propiedades, inquilinos ni importes: esos datos entran
 * por la interfaz o por el importador de Excel (ver scripts/cargar-sociedad.ts).
 * Idempotente: se puede correr varias veces.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const desde = new Date(Date.UTC(1992, 0, 1));

const REGLAS = [
  // Confirmadas por el founder (DECISION_REGISTER D-001/D-045). Pendiente validación de contador para facturación real.
  { codigo: "IVA_ALQUILER_RESIDENCIAL", categoria: "ALQUILER_RESIDENCIAL", descripcion: "IVA alquiler residencial", tasaPct: "5", estadoValidacion: "CONFIRMADA_FOUNDER" as const, fuente: "DECISION_REGISTER D-001/D-045 (founder, 2026-08-02/10). Validación de contador pendiente (PD-02)." },
  { codigo: "IVA_ALQUILER_COMERCIAL", categoria: "ALQUILER_COMERCIAL", descripcion: "IVA alquiler comercial", tasaPct: "10", estadoValidacion: "CONFIRMADA_FOUNDER" as const, fuente: "DECISION_REGISTER D-001/D-045 (founder, 2026-08-02/10). Validación de contador pendiente (PD-02)." },
  { codigo: "IVA_RENTA_TEMPORAL", categoria: "RENTA_TEMPORAL", descripcion: "IVA renta temporal / Airbnb", tasaPct: "10", estadoValidacion: "CONFIRMADA_FOUNDER" as const, fuente: "DECISION_REGISTER D-045 (founder, 2026-08-10)." },
  // Sin definición: quedan PENDIENTE → la obligación se genera con ivaPendiente y no se factura.
  { codigo: "IVA_EXPENSAS", categoria: "EXPENSAS", descripcion: "IVA sobre expensas trasladadas al inquilino", tasaPct: "0", estadoValidacion: "PENDIENTE" as const, fuente: "Sin definir. Requiere criterio del contador (PD-02)." },
  { codigo: "IVA_SERVICIOS", categoria: "SERVICIOS", descripcion: "IVA sobre servicios recuperados", tasaPct: "0", estadoValidacion: "PENDIENTE" as const, fuente: "Sin definir. Requiere criterio del contador (PD-02)." },
  { codigo: "IVA_INTERESES", categoria: "INTERESES", descripcion: "IVA sobre intereses moratorios", tasaPct: "0", estadoValidacion: "PENDIENTE" as const, fuente: "Sin definir. Requiere criterio del contador (PD-02)." },
  { codigo: "IVA_PENALIDAD", categoria: "PENALIDAD", descripcion: "IVA sobre penalidades", tasaPct: "0", estadoValidacion: "PENDIENTE" as const, fuente: "Sin definir. Requiere criterio del contador (PD-02)." },
  { codigo: "IVA_REPARACION_IMPUTABLE", categoria: "REPARACION_IMPUTABLE", descripcion: "IVA sobre reparaciones imputables al inquilino", tasaPct: "0", estadoValidacion: "PENDIENTE" as const, fuente: "Sin definir. Requiere criterio del contador (PD-02)." },
];

async function main() {
  for (const r of REGLAS) {
    await prisma.reglaFiscal.upsert({
      where: { codigo_version: { codigo: r.codigo, version: 1 } },
      update: {},
      create: { ...r, version: 1, vigenteDesde: desde, ivaIncluido: false, baseImponiblePct: "100" },
    });
  }
  const alerta = await prisma.configuracionAlerta.findFirst({ where: { sociedadId: null, tipo: "CONTRATO_VENCIMIENTO" } });
  if (!alerta) await prisma.configuracionAlerta.create({ data: { sociedadId: null, tipo: "CONTRATO_VENCIMIENTO", dias: [90, 60, 30] } });
  console.log(`Reglas fiscales: ${REGLAS.length} (v1). Alertas por defecto: 90/60/30 días.`);
}

main().finally(() => prisma.$disconnect());
