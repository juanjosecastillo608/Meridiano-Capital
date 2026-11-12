import { prisma, ErrorNegocio } from "../db";
import { exigir, type Sesion } from "../authz";
import { auditar } from "../audit";
import { filtroPersonaVisible } from "./nucleo";
import { configuracionVigente } from "./renovacion";
import { normalizarRuc } from "../../domain/ruc";
import { normalizarDocumento } from "../../domain/documentos";
import { d, sumar, Decimal } from "../../domain/money";
import { hoyAsuncion } from "../../domain/periodo";

/**
 * Conciliación planillas ↔ ocupantes actuales y EXPEDIENTE POR INQUILINO:
 * qué está confirmado, qué falta y qué tiene alertas antes de generar el
 * contrato real. No modifica datos: solo diagnostica.
 */

export type EstadoItem = "OK" | "FALTA" | "ALERTA" | "INFO";
export interface ItemExpediente {
  grupo: "Identificación" | "Condiciones económicas" | "Servicios" | "Situación" | "Contrato nuevo";
  clave: string;
  etiqueta: string;
  estado: EstadoItem;
  detalle: string;
  bloqueaContrato: boolean; // falta para el contrato REAL (no para el borrador)
}

export interface Expediente {
  unidadId: string;
  unidad: string;
  tipo: string;
  edificio: { id: string; codigo: string; nombre: string };
  situacion: "OCUPADA" | "VACANTE" | "LOCAL" | "FUERA_DE_INVENTARIO";
  contrato: { id: string; codigo: string; estado: string } | null;
  inquilinos: { id: string; nombre: string; ruc: string | null; ci: string | null; telefono: string | null; email: string | null; domicilio: string | null }[];
  canon: string | null;
  moneda: string;
  items: ItemExpediente[];
  resumen: { ok: number; falta: number; alerta: number; listoParaBorrador: boolean; listoParaContratoReal: boolean };
}

const fmt = (v: Decimal | string) => d(v).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export async function expedientesPropiedad(s: Sesion, propiedadId: string): Promise<Expediente[]> {
  const p = await prisma.propiedad.findUnique({
    where: { id: propiedadId },
    include: { sociedad: { include: { cuentas: { where: { activa: true, deletedAt: null } }, representantes: { where: { deletedAt: null } } } }, unidades: { where: { deletedAt: null } } },
  });
  if (!p) throw new ErrorNegocio("Propiedad no encontrada.", "NO_ENCONTRADO");
  exigir(s, "LEER", p.sociedadId, p.id);
  const cfg = await configuracionVigente(p.sociedadId);
  const hoy = hoyAsuncion();
  const nisCount = new Map<string, string[]>();
  for (const u of p.unidades) if (u.nisAnde) nisCount.set(u.nisAnde, [...(nisCount.get(u.nisAnde) ?? []), u.identificador]);
  const deptosDeclarados = p.inventarioDeptosDeclarado;
  const out: Expediente[] = [];

  for (const u of p.unidades.sort((a, b) => Number(a.tipo !== "DEPARTAMENTO") - Number(b.tipo !== "DEPARTAMENTO") || a.identificador.localeCompare(b.identificador, "es", { numeric: true }))) {
    const items: ItemExpediente[] = [];
    const add = (grupo: ItemExpediente["grupo"], clave: string, etiqueta: string, estado: EstadoItem, detalle: string, bloqueaContrato = estado === "FALTA") => items.push({ grupo, clave, etiqueta, estado, detalle, bloqueaContrato });
    const contratos = await prisma.contrato.findMany({
      where: { deletedAt: null, unidades: { some: { unidadId: u.id } }, plantillaVersion: null },
      include: { partes: { where: { rol: "INQUILINO" }, include: { persona: true } }, condiciones: { orderBy: { vigenteDesde: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    const actual = contratos.find((c) => ["VIGENTE", "VENCIDO", "PENDIENTE_FIRMA", "BORRADOR"].includes(c.estado)) ?? null;
    const historicos = contratos.filter((c) => c.estado === "FINALIZADO");
    const nuevo = actual ? await prisma.contrato.findFirst({ where: { contratoAnteriorId: actual.id } }) : null;
    const esLocal = u.tipo !== "DEPARTAMENTO";
    const situacion: Expediente["situacion"] = esLocal ? "LOCAL" : actual ? "OCUPADA" : "VACANTE";
    const moneda = actual?.moneda ?? "PYG";

    // ── Situación ──
    if (esLocal) {
      add("Situación", "local", "Local comercial", "INFO", "Excluido de los contratos residenciales (no se aplican las reglas de 12 meses).", false);
      if (u.ocupacionDeclarada === "VACANTE" && actual) add("Situación", "local_contradiccion", "Situación del local", "ALERTA", `Declarado VACANTE (${u.ocupacionDeclaradaFuente}) pero la planilla registra un ocupante (${actual.partes.map((x) => x.persona.nombre).join(", ")}). ${actual.observaciones?.match(/Antecedente[^.]*\./)?.[0] ?? ""}`, false);
    }
    if (!actual && !esLocal) add("Situación", "vacante", "Unidad sin inquilino actual", "INFO", u.observaciones ?? "Sin ocupante en el último período de la planilla.", false);
    if (historicos.length) add("Situación", "historicos", "Ocupantes anteriores", "INFO", `${historicos.length} contrato(s) histórico(s) conservados con su deuda/pagos.`, false);
    if (actual?.observaciones?.includes("Antecedente")) add("Situación", "antecedente", "Contrato anterior (planilla)", "INFO", actual.observaciones.match(/Antecedente[^]*?\.(?=\s|$)/)?.[0] ?? "", false);

    // ── Identificación ──
    for (const parte of actual?.partes ?? []) {
      const per = parte.persona;
      const rucN = normalizarRuc(per.ruc);
      if (per.ruc && rucN && !rucN.dvFaltante) add("Identificación", `ruc_${per.id}`, `RUC para factura — ${per.nombre}`, rucN.dvValido ? "OK" : "ALERTA", rucN.dvValido ? per.ruc : `${per.ruc}: el DV no coincide con el cálculo (${rucN.dvCalculado}). Verificar con la constancia.`, !rucN.dvValido);
      else if (per.observaciones?.includes("RUC incompleto")) add("Identificación", `ruc_${per.id}`, `RUC para factura — ${per.nombre}`, "ALERTA", "La planilla trae el RUC sin dígito verificador: completarlo para facturar.", true);
      else add("Identificación", `ruc_${per.id}`, `RUC para factura — ${per.nombre}`, "FALTA", "La planilla no trae RUC para este inquilino.");
      if (per.observaciones?.includes("ya pertenece a otra persona")) add("Identificación", `conflicto_${per.id}`, `RUC/CI en conflicto — ${per.nombre}`, "ALERTA", per.observaciones);
      add("Identificación", `ci_${per.id}`, `Cédula de identidad — ${per.nombre}`, per.documentoNormalizado ? "OK" : "FALTA", per.documentoNumero ? `${per.documentoTipo} ${per.documentoNumero}${per.observaciones?.includes("derivada del RUC") ? " (derivada del RUC)" : ""}` : "Sin CI: se deriva del RUC al cargarlo.");
      add("Identificación", `tel_${per.id}`, `Teléfono — ${per.nombre}`, per.telefono ? "OK" : "FALTA", per.telefono ?? "Sin teléfono", false);
      add("Identificación", `dom_${per.id}`, `Domicilio — ${per.nombre}`, per.domicilio ? "OK" : "FALTA", per.domicilio ?? "Requerido para el contrato (la planilla no lo trae).");
      add("Identificación", `mail_${per.id}`, `Email — ${per.nombre}`, per.email ? "OK" : "FALTA", per.email ?? "Recomendado para enviar facturas y avisos.", false);
      const otrasUnidades = await prisma.contratoParte.count({ where: { personaId: per.id, rol: "INQUILINO", contrato: { estado: { in: ["BORRADOR", "VIGENTE"] }, id: { not: actual!.id } } } });
      if (otrasUnidades) add("Identificación", `multi_${per.id}`, `Inquilino en más de una unidad — ${per.nombre}`, "ALERTA", `Tiene ${otrasUnidades} contrato(s) más en otra(s) unidad(es): confirmar que es la misma persona (mismo RUC/CI).`, false);
    }

    // ── Condiciones económicas ──
    const cond = actual?.condiciones[0];
    if (actual && cond) {
      const iva = d(cond.montoAlquiler.toString()).minus(d(cond.montoAlquiler.toString()).div(1.05).toDecimalPlaces(0));
      add("Condiciones económicas", "canon", "Canon (Monto Alquiler Actual)", cond.validado ? "OK" : "ALERTA", `G. ${fmt(cond.montoAlquiler.toString())}${cond.validado ? ` — validado (${cond.validacionMotivo})` : " — pendiente de validar"}. IVA incluido 5 %: neto G. ${fmt(d(cond.montoAlquiler.toString()).minus(iva))} + IVA G. ${fmt(iva)}.`, !cond.validado);
      const difs = await prisma.obligacion.findMany({ where: { contratoId: actual.id, concepto: "ALQUILER", origenDato: "IMPORTADO" }, select: { periodo: true, importeTotal: true, ajustes: true } });
      const distintos = difs.filter((o) => !d(o.importeTotal.toString()).minus(d(o.ajustes.toString())).equals(d(cond.montoAlquiler.toString())));
      if (distintos.length) add("Condiciones económicas", "canon_dif", "Diferencias de canon en planillas", "ALERTA", distintos.map((o) => `${o.periodo}: G. ${fmt(o.importeTotal.toString())}`).join(", "));
    }
    if (actual) {
      const expPlan = await prisma.obligacion.findFirst({ where: { contratoId: actual.id, concepto: "EXPENSAS" }, orderBy: { periodo: "desc" } });
      const definida = p.expensaMensualUnidad ? d(p.expensaMensualUnidad.toString()) : null;
      if (!definida) add("Condiciones económicas", "expensas", "Expensas", "FALTA", "Sin expensa mensual definida para el edificio.");
      else if (expPlan && !d(expPlan.importeTotal.toString()).equals(definida)) add("Condiciones económicas", "expensas", "Expensas", "ALERTA", `Definida G. ${fmt(definida)}/mes (exenta de IVA) pero la planilla cobró G. ${fmt(expPlan.importeTotal.toString())} en ${expPlan.periodo}. Confirmar el importe a pactar.`);
      else if (!expPlan && definida) add("Condiciones económicas", "expensas", "Expensas", "ALERTA", `Definida G. ${fmt(definida)}/mes (exenta de IVA) pero la planilla no cobra expensas a esta unidad${actual.observaciones?.includes("No pagan") ? " (\"No pagan\")" : ""}. Confirmar si se incorporan al contrato nuevo.`);
      else add("Condiciones económicas", "expensas", "Expensas", "OK", `G. ${fmt(definida)}/mes, exentas de IVA (coincide con la planilla).`, false);
      add("Condiciones económicas", "resp_expensas", "Responsable de las expensas", actual.responsabilidadExpensas === "NO_DEFINIDO" ? "FALTA" : "OK", actual.responsabilidadExpensas.replaceAll("_", " ").toLowerCase());
      const agua = await prisma.obligacion.findFirst({ where: { contratoId: actual.id, concepto: "SERVICIOS" }, orderBy: { periodo: "desc" } });
      if (agua) add("Servicios", "agua", "Agua", "ALERTA", `La planilla cobra agua por separado (G. ${fmt(agua.importeTotal.toString())} en ${agua.periodo}); la hoja resumen la marca "incluida en el alquiler". Definir si es servicio aparte, parte de las expensas o del canon.`);
      const obls = await prisma.obligacion.findMany({ where: { contratoId: actual.id, estado: { in: ["PENDIENTE", "PARCIAL"] } } });
      const deuda = sumar(obls.map((o) => o.saldo.toString()));
      const vencida = sumar(obls.filter((o) => o.fechaVencimiento < hoy).map((o) => o.saldo.toString()));
      const sinResp = await prisma.pago.count({ where: { personaId: { in: actual.partes.map((x) => x.personaId) }, estado: "REGISTRADO", respaldo: "SIN_RESPALDO" } });
      add("Condiciones económicas", "deuda", "Saldo según planillas", deuda.isZero() ? "OK" : "ALERTA", `Deuda G. ${fmt(deuda)} (vencida G. ${fmt(vencida)}). ${sinResp} pago(s) declarados en planilla sin respaldo bancario.`, false);
    }

    // ── Servicios: energía ──
    if (!u.nisAnde) add("Servicios", "nis", "NIS ANDE (energía)", "FALTA", "Sin NIS registrado. La energía eléctrica la paga el inquilino y no está incluida en el alquiler.");
    else if ((nisCount.get(u.nisAnde) ?? []).length > 1) add("Servicios", "nis", "NIS ANDE (energía)", "ALERTA", `NIS ${u.nisAnde} COMPARTIDO con la(s) unidad(es) ${nisCount.get(u.nisAnde)!.filter((x) => x !== u.identificador).join(", ")}: actualmente comparten el gasto de energía eléctrica. Regularizar o pactar el prorrateo.`, false);
    else add("Servicios", "nis", "NIS ANDE (energía)", "OK", `NIS ${u.nisAnde} propio. Energía a cargo del inquilino, no incluida en el alquiler.`, false);

    // ── Contrato nuevo ──
    if (situacion === "OCUPADA") {
      add("Contrato nuevo", "config", "Configuración residencial", cfg ? "OK" : "FALTA", cfg ? `v${cfg.version}: ${cfg.residentialLeaseDefaultTermMonths} meses, incremento ${cfg.residentialLeaseInitialIncreasePercent.toString()} %` : "Sin configuración contractual.");
      add("Contrato nuevo", "inicio", "Fecha de inicio", nuevo?.fechaInicio ? "OK" : "FALTA", nuevo?.fechaInicio ? nuevo.fechaInicio.toISOString().slice(0, 10) : "Individual por inquilino: a acordar (no se toma de la planilla ni del ingreso histórico).");
      add("Contrato nuevo", "deposito", "Depósito de garantía", nuevo?.depositoVerificado ? "OK" : "FALTA", nuevo?.deposito ? `G. ${fmt(nuevo.deposito.toString())}` : "Verificar individualmente (la planilla no lo registra).");
      add("Contrato nuevo", "cuenta", "Cuenta bancaria receptora", p.sociedad.cuentas.length ? "OK" : "FALTA", p.sociedad.cuentas.length ? p.sociedad.cuentas.map((c) => `${c.banco} ${c.numero}`).join(", ") : "La sociedad no tiene cuentas activas registradas (la planilla menciona una Cta. Cte. no confirmada).");
      add("Contrato nuevo", "vencimiento", "Día de vencimiento mensual", actual?.diaVencimiento || nuevo?.diaVencimiento ? "OK" : "FALTA", String(nuevo?.diaVencimiento ?? actual?.diaVencimiento ?? "No definido en la planilla."));
      const repVig = p.sociedad.representantes.filter((r) => r.estadoDato === "VALIDADO" && (!r.vigenteHasta || r.vigenteHasta >= hoy));
      add("Contrato nuevo", "representante", "Representante con poder vigente", repVig.length ? "OK" : "FALTA", repVig.length ? repVig.map((r) => r.cargo).join(", ") : "Falta el poder de la sociedad (archivo del anexo pendiente).");
      add("Contrato nuevo", "dom_fiscal", "Domicilio fiscal de la sociedad", p.sociedad.domicilioFiscal ? "OK" : "FALTA", p.sociedad.domicilioFiscal ?? "No cargado.");
      add("Contrato nuevo", "direccion", "Dirección del edificio", p.direccion ? "OK" : "FALTA", p.direccion ?? "No cargada.");
      add("Contrato nuevo", "juridica", "Revisión jurídica de la plantilla", nuevo?.legalReviewStatus === "APROBADA" ? "OK" : "FALTA", nuevo ? nuevo.legalReviewStatus : "Pendiente (redacción provisional RESIDENCIAL_12M_v1).");
      add("Contrato nuevo", "borrador", "Borrador generado", nuevo ? "OK" : "INFO", nuevo ? `${nuevo.codigo} (${nuevo.estado})` : "Aún no generado.", false);
    }
    if (deptosDeclarados != null && !esLocal && u.tipo !== "DEPARTAMENTO") add("Situación", "inventario", "Fuera del inventario declarado", "ALERTA", "Unidad no contemplada en el inventario administrativo declarado.", false);

    const ok = items.filter((i) => i.estado === "OK").length, falta = items.filter((i) => i.estado === "FALTA").length, alerta = items.filter((i) => i.estado === "ALERTA").length;
    out.push({
      unidadId: u.id, unidad: u.identificador, tipo: u.tipo, edificio: { id: p.id, codigo: p.codigo, nombre: p.nombre }, situacion,
      contrato: actual ? { id: actual.id, codigo: actual.codigo, estado: actual.estado } : null,
      inquilinos: actual?.partes.map((x) => ({ id: x.persona.id, nombre: x.persona.nombre, ruc: x.persona.ruc, ci: x.persona.documentoNumero, telefono: x.persona.telefono, email: x.persona.email, domicilio: x.persona.domicilio })) ?? [],
      canon: cond?.montoAlquiler.toString() ?? null, moneda,
      items,
      resumen: { ok, falta, alerta, listoParaBorrador: situacion === "OCUPADA" && !!cond?.validado && !!cfg, listoParaContratoReal: situacion === "OCUPADA" && !items.some((i) => i.bloqueaContrato && i.estado !== "OK") },
    });
  }
  return out;
}

/** Completa datos del inquilino. Con RUC: la CI se deriva (sin guion ni DV). Nunca pisa un documento de otra persona. */
export async function actualizarDatosInquilino(s: Sesion, personaId: string, input: { ruc?: string | null; domicilio?: string | null; email?: string | null; telefono?: string | null; motivo: string }) {
  const per = await prisma.persona.findFirst({ where: { id: personaId, deletedAt: null, ...filtroPersonaVisible(s) }, include: { partes: { include: { contrato: true } } } });
  if (!per) throw new ErrorNegocio("Persona no encontrada o sin acceso.", "NO_ENCONTRADO");
  const socs = [...new Set(per.partes.map((x) => x.contrato.sociedadId))];
  if (!socs.length) throw new ErrorNegocio("La persona no está vinculada a ninguna sociedad.");
  for (const soc of socs) exigir(s, "GESTIONAR_MAESTROS", soc);
  if (!input.motivo?.trim()) throw new ErrorNegocio("Indique la fuente del dato (constancia de RUC, cédula, contrato…).");
  const data: Record<string, unknown> = {};
  if (input.ruc) {
    const r = normalizarRuc(input.ruc);
    if (!r || r.dvFaltante) throw new ErrorNegocio("RUC con formato base-DV (ej. 1234567-8).");
    if (!r.dvValido) throw new ErrorNegocio(`El dígito verificador no coincide (calculado ${r.dvCalculado}). Revise el RUC.`);
    const docNorm = r.probablePersonaJuridica ? normalizarDocumento("RUC", r.ruc) : normalizarDocumento("CI", r.ci);
    const otro = docNorm ? await prisma.persona.findUnique({ where: { documentoNormalizado: docNorm } }) : null;
    if (otro && otro.id !== per.id) throw new ErrorNegocio("Ese RUC/CI ya pertenece a otra persona registrada: unifique los registros en lugar de duplicar.", "DUPLICADO");
    Object.assign(data, { ruc: r.ruc, documentoTipo: r.probablePersonaJuridica ? "RUC" : "CI", documentoNumero: r.probablePersonaJuridica ? r.ruc : r.ci, documentoNormalizado: docNorm, datosFacturacion: { ruc: r.ruc, razonSocial: per.nombre, dvVerificado: true } });
  }
  if (input.domicilio !== undefined && input.domicilio !== null) data.domicilio = input.domicilio.trim() || null;
  if (input.email) data.email = input.email.trim();
  if (input.telefono) data.telefono = input.telefono.trim();
  return prisma.$transaction(async (tx) => {
    const act = await tx.persona.update({ where: { id: personaId }, data });
    await auditar(tx, s, "PERSONA_ACTUALIZAR", "Persona", personaId, { sociedadId: socs[0], antes: { ruc: per.ruc, documentoNumero: per.documentoNumero, domicilio: per.domicilio ? "(dato previo)" : null }, despues: { campos: Object.keys(data) }, motivo: input.motivo });
    return act;
  });
}
