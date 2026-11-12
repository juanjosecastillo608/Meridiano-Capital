import { z } from "zod";
import { prisma, ErrorNegocio, Prisma, type Tx } from "../db";
import { exigir, filtroSociedad, type Sesion } from "../authz";
import { auditar } from "../audit";
import { guardarArchivo, leerArchivo } from "../storage";
import { leerLibro } from "../../import/libro";
import { analizarLibro } from "../../import/analizar";
import { proponerMapeo, procesar, OPCIONES_DEFAULT, type MapeoHoja, type RegistroFila, type InformeImport } from "../../import/procesar";
import { finPeriodo } from "../../domain/periodo";
import { normalizarNombre, normalizarTelefono, normalizarDocumento, similitudNombres } from "../../domain/documentos";
import { normalizarRuc } from "../../domain/ruc";
import { estadoPorSaldo } from "../../domain/obligaciones";
import { aplicarPago } from "../../domain/pagos";
import { d } from "../../domain/money";

/** JSON seguro (Decimal → string, Date → ISO) para guardar en ImportBatch. */
function aJson(v: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(v, (_k, x) => (x && typeof x === "object" && "toFixed" in x && "isZero" in x ? x.toString() : x))) as Prisma.InputJsonValue;
}

// ───────────── Paso 1: subir y analizar ─────────────

export async function analizarArchivo(s: Sesion, sociedadId: string, nombreArchivo: string, buffer: Buffer) {
  exigir(s, "IMPORTAR", sociedadId);
  if (!/\.xlsx$/i.test(nombreArchivo)) throw new ErrorNegocio("Solo se admiten archivos .xlsx (Excel 2007+). Guarde los .xls como .xlsx.");
  const libro = await leerLibro(buffer);
  const previo = await prisma.importBatch.findFirst({ where: { sha256: libro.sha256, sociedadId, estado: "CONFIRMADO" } });
  const analisis = analizarLibro(libro);
  const archivo = await guardarArchivo(buffer, nombreArchivo, `importaciones/${sociedadId}`);
  return prisma.$transaction(async (tx) => {
    const doc = await tx.documento.create({ data: { sociedadId, entidad: "IMPORTACION", nombreArchivo, storageKey: archivo.storageKey, sha256: archivo.sha256, mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", tamanoBytes: archivo.tamanoBytes, subidoPorId: s.usuarioId === "sistema" ? null : s.usuarioId } });
    const batch = await tx.importBatch.create({
      data: { sociedadId, nombreArchivo, sha256: libro.sha256, documentoId: doc.id, estado: "ANALIZADO", analisis: aJson(analisis), mapeo: aJson(proponerMapeo(analisis)), creadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId },
    });
    await tx.documento.update({ where: { id: doc.id }, data: { entidadId: batch.id } });
    await auditar(tx, s, "IMPORTACION_ANALIZAR", "ImportBatch", batch.id, { sociedadId, despues: { nombreArchivo, sha256: libro.sha256, hojas: analisis.hojas.length } });
    return { batch, yaImportadoAntes: previo ? previo.id : null };
  });
}

async function batchConAcceso(s: Sesion, id: string) {
  const b = await prisma.importBatch.findUnique({ where: { id } });
  if (!b || !b.sociedadId) throw new ErrorNegocio("Importación no encontrada.");
  exigir(s, "IMPORTAR", b.sociedadId);
  return b;
}

export async function listarImportaciones(s: Sesion) {
  return prisma.importBatch.findMany({ where: filtroSociedad(s), orderBy: { createdAt: "desc" }, select: { id: true, nombreArchivo: true, estado: true, createdAt: true, confirmadoAt: true, sociedad: { select: { razonSocial: true } } } });
}

// ───────────── Paso 2: mapeo y validación ─────────────

export const OpcionesInput = z.object({
  moneda: z.enum(["PYG", "USD"]).nullable(),
  tasaIvaControlPct: z.number().nullable().optional(),
  marcasVacante: z.array(z.string()).optional(),
});

async function procesarBatch(b: { documentoId: string | null; sociedadId: string | null }, mapeo: MapeoHoja[], opciones: z.infer<typeof OpcionesInput>): Promise<InformeImport> {
  const doc = await prisma.documento.findUniqueOrThrow({ where: { id: b.documentoId! } });
  const libro = await leerLibro(await leerArchivo(doc.storageKey));
  if (libro.sha256 !== doc.sha256) throw new ErrorNegocio("El archivo original almacenado no coincide con su hash: integridad comprometida.");
  return procesar(libro, analizarLibro(libro), mapeo, { ...OPCIONES_DEFAULT, ...opciones, marcasVacante: opciones.marcasVacante ?? OPCIONES_DEFAULT.marcasVacante });
}

/** Valida contra el archivo y contra la base (unidades/personas existentes). No escribe datos de negocio. */
export async function validarImportacion(s: Sesion, id: string, mapeo: MapeoHoja[], opciones: z.input<typeof OpcionesInput>, propiedadId?: string | null) {
  const b = await batchConAcceso(s, id);
  if (b.estado === "CONFIRMADO" || b.estado === "CANCELADO") throw new ErrorNegocio(`La importación ya está ${b.estado}.`);
  const op = OpcionesInput.parse(opciones);
  const informe = await procesarBatch(b, mapeo, op);
  const conflictos: string[] = [];
  if (propiedadId) {
    const unidades = await prisma.unidad.findMany({ where: { propiedadId, deletedAt: null } });
    const existentes = new Map(unidades.map((u) => [u.identificador.toLowerCase(), u]));
    for (const ident of new Set(informe.registros.map((r) => r.unidad.identificador))) {
      if (existentes.has(ident.toLowerCase())) conflictos.push(`La unidad "${ident}" ya existe: no se modifica; los datos del archivo se vinculan a ella y las diferencias se reportan.`);
    }
  }
  await prisma.importBatch.update({ where: { id }, data: { mapeo: aJson(mapeo), informe: aJson({ ...informe, opciones: op, conflictosBase: conflictos }), estado: informe.bloqueante ? "MAPEADO" : "VALIDADO" } });
  return { informe, conflictos };
}

// ───────────── Paso 3: confirmación ─────────────

export const ConfirmacionInput = z.object({
  propiedad: z.discriminatedUnion("modo", [
    z.object({ modo: z.literal("EXISTENTE"), propiedadId: z.string() }),
    z.object({ modo: z.literal("NUEVA"), codigo: z.string().regex(/^[A-Z0-9-]+$/), nombre: z.string().min(2), direccion: z.string().optional().nullable(), ciudad: z.string().optional().nullable() }),
  ]),
  cuentaBancariaId: z.string().optional().nullable(),
  importarObligaciones: z.boolean().default(true),
  importarPagos: z.boolean().default(true),
  /** Unidades detectadas que NO forman parte del inventario administrativo (p. ej. áticos): no se crean; sus filas quedan OMITIDA. */
  unidadesExcluidas: z.array(z.string()).default([]),
  confirmacionExplicita: z.literal(true, { errorMap: () => ({ message: "Debe confirmar explícitamente la importación." }) }),
});

function tipoUnidad(r: RegistroFila): "DEPARTAMENTO" | "LOCAL_COMERCIAL" | "OFICINA" | "COCHERA" | "DEPOSITO" | "OTRO" {
  const t = `${r.unidad.identificador} ${r.unidad.tipologia ?? ""}`.toLowerCase();
  if (/sal[oó]n|local/.test(t)) return "LOCAL_COMERCIAL";
  if (/oficina/.test(t)) return "OFICINA";
  if (/cochera|garage|estacionamiento/.test(t)) return "COCHERA";
  if (/dep[oó]sito|baulera/.test(t)) return "DEPOSITO";
  if (/dormitorio|dpto|depto|departamento|monoambiente|\bmono\b|\b\d\s*d\b/.test(t)) return "DEPARTAMENTO";
  return "OTRO";
}

const dormitorios = (t?: string) => { const m = /(\d+)\s*dorm/i.exec(t ?? ""); return m ? Number(m[1]) : null; };

export interface ResultadoConfirmacion {
  propiedadId: string;
  unidadesCreadas: number;
  unidadesExistentes: number;
  personasCreadas: number;
  personasVinculadas: number;
  contratosBorrador: number;
  contratosHistoricos: number;
  obligacionesCreadas: number;
  pagosRegistrados: number;
  filasOmitidas: number;
}

export async function confirmarImportacion(s: Sesion, id: string, input: z.input<typeof ConfirmacionInput>): Promise<ResultadoConfirmacion> {
  const b = await batchConAcceso(s, id);
  if (b.estado !== "VALIDADO") throw new ErrorNegocio(b.estado === "CONFIRMADO" ? "Esta importación ya fue confirmada." : "Valide la importación sin errores bloqueantes antes de confirmar.");
  const conf = ConfirmacionInput.parse(input);
  const guardado = b.informe as unknown as { opciones: z.infer<typeof OpcionesInput> };
  const mapeo = b.mapeo as unknown as MapeoHoja[];
  const informe = await procesarBatch(b, mapeo, guardado.opciones);
  if (informe.bloqueante) throw new ErrorNegocio("El informe tiene errores bloqueantes.");
  const moneda = guardado.opciones.moneda!;
  const sociedadId = b.sociedadId!;

  return prisma.$transaction(
    async (tx) => {
      // Re-chequeo dentro de la transacción (doble confirmación concurrente)
      const fresco = await tx.importBatch.findUniqueOrThrow({ where: { id } });
      if (fresco.estado !== "VALIDADO") throw new ErrorNegocio("La importación cambió de estado; recargue.");

      // Propiedad
      let propiedadId: string;
      if (conf.propiedad.modo === "EXISTENTE") {
        const p = await tx.propiedad.findUnique({ where: { id: conf.propiedad.propiedadId } });
        if (!p || p.sociedadId !== sociedadId) throw new ErrorNegocio("La propiedad no pertenece a la sociedad de la importación.");
        propiedadId = p.id;
      } else {
        if (await tx.propiedad.findUnique({ where: { sociedadId_codigo: { sociedadId, codigo: conf.propiedad.codigo } } })) throw new ErrorNegocio(`Ya existe la propiedad ${conf.propiedad.codigo}. Elija "existente".`);
        const p = await tx.propiedad.create({ data: { sociedadId, codigo: conf.propiedad.codigo, nombre: conf.propiedad.nombre, direccion: conf.propiedad.direccion ?? null, ciudad: conf.propiedad.ciudad ?? null, cuentaBancariaId: conf.cuentaBancariaId ?? null, origenDato: "IMPORTADO", estadoDato: "PENDIENTE_REVISION", importBatchId: id } });
        await tx.titularidad.create({ data: { propiedadId: p.id, sociedadId, porcentaje: 100 } });
        await auditar(tx, s, "PROPIEDAD_CREAR", "Propiedad", p.id, { sociedadId, despues: p, motivo: `Importación ${id}` });
        propiedadId = p.id;
      }
      const prop = await tx.propiedad.findUniqueOrThrow({ where: { id: propiedadId } });

      const res: ResultadoConfirmacion = { propiedadId, unidadesCreadas: 0, unidadesExistentes: 0, personasCreadas: 0, personasVinculadas: 0, contratosBorrador: 0, contratosHistoricos: 0, obligacionesCreadas: 0, pagosRegistrados: 0, filasOmitidas: 0 };
      // Filas con pago duplicado: se importan unidad/inquilino/obligación pero NO el pago.
      const excluidas = new Set(conf.unidadesExcluidas.map((u) => u.trim().toLowerCase()));
      const esExcluida = (r: RegistroFila) => excluidas.has(r.unidad.identificador.trim().toLowerCase());
      const validos = informe.registros.filter((r) => !esExcluida(r) && (r.pagoDuplicado || (r.estado !== "DUPLICADO" && r.estado !== "ERROR")));

      // Unidades (nunca se sobrescriben)
      const unidadPorIdent = new Map<string, string>();
      for (const r of [...validos].sort((a, b) => (b.periodo ?? "").localeCompare(a.periodo ?? ""))) {
        const k = r.unidad.identificador.toLowerCase();
        if (unidadPorIdent.has(k)) continue;
        const existente = await tx.unidad.findFirst({ where: { propiedadId, identificador: { equals: r.unidad.identificador, mode: "insensitive" }, deletedAt: null } });
        if (existente) { unidadPorIdent.set(k, existente.id); res.unidadesExistentes++; continue; }
        const obs = [r.unidad.medidorAnde && r.unidad.medidorAnde !== "0" ? `NIS ANDE: ${r.unidad.medidorAnde}` : null, r.unidad.tipologia ? `Tipología declarada: ${r.unidad.tipologia}` : null].filter(Boolean).join(" · ");
        const u = await tx.unidad.create({ data: { propiedadId, identificador: r.unidad.identificador, tipo: tipoUnidad(r), dormitorios: dormitorios(r.unidad.tipologia), superficieM2: r.unidad.superficieM2 && !isNaN(Number(r.unidad.superficieM2)) ? r.unidad.superficieM2 : null, piso: r.unidad.piso ?? null, nisAnde: r.unidad.medidorAnde && r.unidad.medidorAnde !== "0" ? r.unidad.medidorAnde : null, expensasAsignadas: r.expensas ? r.expensas.toString() : null, observaciones: obs || null, origenDato: "IMPORTADO", estadoDato: "PENDIENTE_REVISION", importBatchId: id } });
        unidadPorIdent.set(k, u.id);
        res.unidadesCreadas++;
      }

      // Personas: sin documento en el archivo → coincidencia por nombre normalizado + teléfono; si no, nueva.
      const personaPorClave = new Map<string, string>();
      // El RUC/CI puede aparecer solo en algunas hojas (p. ej. agosto/septiembre): se reúne por persona antes de crearla.
      const docPorClave = new Map<string, { ruc?: string; documento?: string }>();
      for (const r of validos) {
        if (!r.inquilino) continue;
        const k = normalizarNombre(r.inquilino.nombre);
        const prev = docPorClave.get(k) ?? {};
        docPorClave.set(k, { ruc: prev.ruc ?? r.inquilino.ruc, documento: prev.documento ?? r.inquilino.documento });
      }
      for (const r of validos) {
        if (!r.inquilino) continue;
        const tel = normalizarTelefono(r.inquilino.telefono);
        // Clave = nombre normalizado: el teléfono puede faltar en algunas hojas y no debe partir a la persona en dos.
        const clave = normalizarNombre(r.inquilino.nombre);
        if (personaPorClave.has(clave)) continue;
        r.inquilino = { ...r.inquilino, ...Object.fromEntries(Object.entries(docPorClave.get(clave) ?? {}).filter(([, v]) => v)) };
        // Identidad: RUC (factura) → CI = base del RUC (regla del founder 2026-11-12); si no hay RUC, CI de la columna CI.
        const ruc = normalizarRuc(r.inquilino.ruc);
        const ciTxt = ruc?.ci ?? (r.inquilino.documento ? r.inquilino.documento.replace(/\D/g, "") || null : null);
        const docNorm = ruc?.probablePersonaJuridica ? normalizarDocumento("RUC", ruc.ruc) : normalizarDocumento("CI", ciTxt);
        const porDoc = docNorm ? await tx.persona.findUnique({ where: { documentoNormalizado: docNorm } }) : null;
        // Mismo documento y nombre compatible ⇒ misma persona. Mismo documento con OTRO nombre ⇒ no se fusiona: se crea sin documento y se alerta.
        let docEnConflicto = false;
        if (porDoc) {
          if (similitudNombres(porDoc.nombre, r.inquilino.nombre) >= 0.75) { personaPorClave.set(clave, porDoc.id); res.personasVinculadas++; continue; }
          docEnConflicto = true;
        }
        const candidatos = await tx.persona.findMany({ where: { deletedAt: null, nombre: { equals: r.inquilino.nombre.trim(), mode: "insensitive" } } });
        const match = candidatos.find((c) => tel && normalizarTelefono(c.telefono) === tel);
        if (match) { personaPorClave.set(clave, match.id); res.personasVinculadas++; continue; }
        const p = await tx.persona.create({ data: {
          tipo: ruc?.probablePersonaJuridica ? "JURIDICA" : "FISICA", nombre: r.inquilino.nombre.trim(), telefono: r.inquilino.telefono ?? null, email: r.inquilino.email ?? null,
          ruc: ruc && !ruc.dvFaltante && !docEnConflicto ? ruc.ruc : null, documentoTipo: docEnConflicto ? null : ruc?.probablePersonaJuridica ? "RUC" : ciTxt ? "CI" : null, documentoNumero: docEnConflicto ? null : ruc?.probablePersonaJuridica ? ruc.ruc : ciTxt, documentoNormalizado: docEnConflicto ? null : docNorm,
          datosFacturacion: ruc && !ruc.dvFaltante ? { ruc: ruc.ruc, razonSocial: r.inquilino.nombre.trim(), dvVerificado: ruc.dvValido } : undefined,
          observaciones: docEnConflicto ? `⚠ La planilla asigna a esta persona el RUC/CI ${ruc?.base ?? ciTxt}, que ya pertenece a otra persona con otro nombre: verificar cuál es el correcto (no se fusionaron).` : ruc ? (ruc.dvFaltante ? `CI ${ruc.ci} derivada del RUC incompleto "${ruc.base}-" (sin DV en la planilla): completar el RUC para facturar.` : `CI derivada del RUC ${ruc.ruc} (sin guion ni DV).${ruc.dvValido ? "" : " ⚠ DV del RUC no coincide con el cálculo: verificar."}`) : ciTxt ? null : "Importado de planilla sin documento de identidad: completar RUC/CI.",
          origenDato: "IMPORTADO", estadoDato: "PENDIENTE_REVISION", importBatchId: id } });
        personaPorClave.set(clave, p.id);
        res.personasCreadas++;
      }
      const personaDe = (r: RegistroFila) => personaPorClave.get(normalizarNombre(r.inquilino!.nombre))!;

      // Contratos BORRADOR: uno por (unidad, inquilino) observado. Sin fechas contractuales: no se inventan.
      const contratoPor = new Map<string, string>();
      const ocupados = validos.filter((r) => r.inquilino).sort((a, b) => (a.periodo ?? "").localeCompare(b.periodo ?? ""));
      for (const r of ocupados) {
        const unidadId = unidadPorIdent.get(r.unidad.identificador.toLowerCase())!;
        const personaId = personaDe(r);
        const k = `${unidadId}|${personaId}`;
        if (!contratoPor.has(k)) {
          const n = (await tx.contrato.count({ where: { propiedadId } })) + 1;
          const tipo = tipoUnidad(r);
          const c = await tx.contrato.create({
            data: {
              codigo: `${prop.codigo}-IMP-${String(n).padStart(3, "0")}`, sociedadId, propiedadId, estado: "BORRADOR",
              categoriaFiscal: tipo === "LOCAL_COMERCIAL" || tipo === "OFICINA" ? "ALQUILER_COMERCIAL" : "ALQUILER_RESIDENCIAL",
              moneda, origenDato: "IMPORTADO", estadoDato: "PENDIENTE_REVISION", importBatchId: id,
              observaciones: "Creado desde planilla de cobro. NO es el contrato original: faltan fechas de inicio/fin, día de vencimiento, depósito, reajuste y mora. Categoría fiscal inferida por tipo de unidad (verificar).",
              unidades: { create: { unidadId } },
              partes: { create: { personaId, rol: "INQUILINO" } },
            },
          });
          contratoPor.set(k, c.id);
          res.contratosBorrador++;
        }
        const contratoId = contratoPor.get(k)!;
        if (r.alquiler && r.alquiler.greaterThan(0) && r.periodo) {
          const desde = new Date(`${r.periodo}-01T00:00:00Z`);
          const ultima = await tx.condicionContrato.findFirst({ where: { contratoId }, orderBy: { vigenteDesde: "desc" } });
          if (!ultima || !d(ultima.montoAlquiler.toString()).equals(r.alquiler)) {
            await tx.condicionContrato.create({ data: { contratoId, vigenteDesde: desde, montoAlquiler: r.alquiler.toString(), motivo: ultima ? "CORRECCION" : "INICIAL", referencia: `Importe observado en planilla, período ${r.periodo} (no es fecha contractual)` } });
          }
        }
      }

      // Ocupante ACTUAL = el del último período de cada unidad. Los ocupantes anteriores quedan como
      // contratos FINALIZADO (historial de deudas y pagos conservado); no son base de un contrato nuevo.
      const ultimoPeriodo = new Map<string, string>();
      for (const r of validos) if (r.periodo) { const u = r.unidad.identificador.toLowerCase(); if ((ultimoPeriodo.get(u) ?? "") < r.periodo) ultimoPeriodo.set(u, r.periodo); }
      const actuales = new Set<string>();
      const periodosDe = new Map<string, string[]>();
      for (const r of ocupados) {
        if (!r.periodo) continue;
        const uid = unidadPorIdent.get(r.unidad.identificador.toLowerCase())!;
        const k = `${uid}|${personaDe(r)}`;
        periodosDe.set(k, [...(periodosDe.get(k) ?? []), r.periodo]);
        if (ultimoPeriodo.get(r.unidad.identificador.toLowerCase()) === r.periodo) actuales.add(k);
      }
      for (const [k, cid] of contratoPor) {
        const ps = (periodosDe.get(k) ?? []).sort();
        const unidadDelContrato = [...unidadPorIdent.entries()].find(([, uid]) => uid === k.split("|")[0])?.[0];
        // Sin períodos propios (solo hoja de referencia): es actual solo si la unidad no tiene ningún período cargado.
        if (actuales.has(k) || (!ps.length && !(unidadDelContrato && ultimoPeriodo.has(unidadDelContrato)))) continue;
        const c = await tx.contrato.findUniqueOrThrow({ where: { id: cid } });
        if (c.importBatchId !== id || c.estado !== "BORRADOR") continue;
        await tx.contrato.update({ where: { id: cid }, data: { estado: "FINALIZADO", observaciones: `${c.observaciones ?? ""} Ocupante ANTERIOR según planilla (${ps.length ? `períodos ${ps[0]} a ${ps[ps.length - 1]}` : "solo en hoja de referencia"}); ya no figura en el último período. Contrato cerrado como histórico.`.trim() } });
        res.contratosHistoricos++;
      }

      // Antecedentes del contrato anterior declarados en hojas de referencia (no son fechas del contrato nuevo).
      for (const r of ocupados) {
        if (!r.contratoAnterior) continue;
        const unidadId = unidadPorIdent.get(r.unidad.identificador.toLowerCase())!;
        const cid = contratoPor.get(`${unidadId}|${personaDe(r)}`)!;
        const c = await tx.contrato.findUniqueOrThrow({ where: { id: cid } });
        const txtAnt = `Antecedente según planilla (${r.hoja}): ${r.contratoAnterior.fechaFin ? `vencimiento del contrato anterior ${r.contratoAnterior.fechaFin.toISOString().slice(0, 10)}` : "sin fecha de vencimiento"}; contrato vigente declarado: ${r.contratoAnterior.estadoDeclarado ?? "s/d"}.`;
        if (!c.observaciones?.includes(txtAnt)) await tx.contrato.update({ where: { id: cid }, data: { observaciones: `${c.observaciones ?? ""} ${txtAnt}`.trim() } });
      }

      // Obligaciones históricas y pagos por período
      const cuenta = conf.cuentaBancariaId ? await tx.cuentaBancaria.findUnique({ where: { id: conf.cuentaBancariaId } }) : null;
      if (cuenta && (cuenta.sociedadId !== sociedadId || cuenta.moneda !== moneda)) throw new ErrorNegocio("La cuenta bancaria debe ser de la sociedad y de la misma moneda.");
      for (const r of ocupados) {
        if (!r.periodo) { res.filasOmitidas++; continue; }
        const unidadId = unidadPorIdent.get(r.unidad.identificador.toLowerCase())!;
        const personaId = personaDe(r);
        const contratoId = contratoPor.get(`${unidadId}|${personaId}`)!;
        // Vencimiento: fecha programada de la planilla si existe; si no, fin de mes (marcado en la descripción). Nunca es un pago.
        const venc = r.fechaProgramada ?? finPeriodo(r.periodo);
        const obligIds: string[] = [];
        if (conf.importarObligaciones) {
          const conceptos: ["ALQUILER" | "EXPENSAS" | "SERVICIOS", typeof r.alquiler][] = [["ALQUILER", r.alquiler], ["EXPENSAS", r.expensas], ["SERVICIOS", r.agua]];
          for (const [concepto, monto] of conceptos) {
            if (!monto || monto.lessThanOrEqualTo(0)) continue;
            const clave = `${contratoId}:${r.periodo}:${concepto}`;
            const bonif = concepto === "ALQUILER" && r.bonificacion && !r.bonificacion.isZero() ? r.bonificacion : null;
            const total = bonif ? monto.minus(bonif) : monto;
            const nota = concepto === "ALQUILER" && r.iva ? ` IVA declarado en planilla: ${r.iva}${r.ivaFormula ? ` (=${r.ivaFormula})` : ""}; tratamiento a confirmar (PD-02).` : "";
            const o = await tx.obligacion.upsert({
              where: { claveIdempotencia: clave },
              update: {},
              create: {
                sociedadId, propiedadId, unidadId, contratoId, personaId, periodo: r.periodo, concepto, fechaVencimiento: venc, moneda,
                descripcion: `${concepto === "ALQUILER" ? "Alquiler" : concepto === "EXPENSAS" ? "Expensas" : "Agua (servicio)"} ${r.periodo} (importado: ${b.nombreArchivo}, hoja "${r.hoja}" fila ${r.fila}).${r.fechaProgramada ? " Vencimiento según fecha programada de la planilla." : " Vencimiento real desconocido: se usa fin de mes."}${bonif ? ` Bonificación ${bonif} sobre alquiler contractual ${monto}.` : ""}${nota}`,
                importeNeto: monto.toString(), iva: "0", ajustes: bonif ? bonif.negated().toString() : "0", importeTotal: total.toString(), saldo: total.toString(), ivaPendiente: true, claveIdempotencia: clave,
                origenDato: "IMPORTADO", estadoDato: "PENDIENTE_REVISION", importBatchId: id,
              },
            });
            if (o.importBatchId === id) res.obligacionesCreadas++;
            obligIds.push(o.id);
          }
        }
        if (conf.importarPagos && !r.pagoDuplicado && r.pagoTotal && r.pagoTotal.greaterThan(0) && r.fechaPago) {
          const claveDuplicado = `IMP:${b.sha256.slice(0, 16)}:${r.hoja}:${r.fila}`;
          if (await tx.pago.findUnique({ where: { claveDuplicado } })) continue;
          const pago = await tx.pago.create({ data: { sociedadId, personaId, propiedadId, unidadId, cuentaBancariaId: cuenta?.id ?? null, fechaPago: r.fechaPago, metodo: "OTRO", moneda, importe: r.pagoTotal.toString(), claveDuplicado, origenDato: "IMPORTADO", respaldo: "SIN_RESPALDO", importBatchId: id, observaciones: `Pago declarado en planilla (${r.hoja}, fila ${r.fila}${r.marcaPago ? `, marca "${r.marcaPago}"` : ""}). Sin comprobante: conciliar contra extracto.` } });
          const abiertas = await tx.obligacion.findMany({ where: { id: { in: obligIds }, estado: { in: ["PENDIENTE", "PARCIAL"] } } });
          const ap = aplicarPago(r.pagoTotal, moneda, abiertas.map((o) => ({ id: o.id, concepto: o.concepto, periodo: o.periodo, fechaVencimiento: o.fechaVencimiento, moneda: o.moneda, saldo: d(o.saldo.toString()), estado: o.estado })));
          for (const a of ap.aplicaciones) {
            await tx.aplicacionPago.create({ data: { pagoId: pago.id, obligacionId: a.obligacionId, importe: a.importe.toString() } });
            const o = abiertas.find((x) => x.id === a.obligacionId)!;
            const saldo = d(o.saldo.toString()).minus(a.importe);
            await tx.obligacion.update({ where: { id: o.id }, data: { saldo: saldo.toString(), estado: estadoPorSaldo(d(o.importeTotal.toString()), saldo, o.estado) } });
          }
          res.pagosRegistrados++;
        }
      }
      res.filasOmitidas += informe.registros.length - validos.length;

      // Trazabilidad fila a fila
      await tx.importRow.createMany({
        data: informe.registros.map((r) => ({
          batchId: id, hoja: r.hoja, fila: r.fila, entidad: "FILA_PLANILLA",
          crudo: aJson({ unidad: r.unidad, periodo: r.periodo, vacante: r.vacante, alquiler: r.alquiler, expensas: r.expensas, pagoTotal: r.pagoTotal, fechaPago: r.fechaPago }),
          estado: esExcluida(r) ? "OMITIDA" : r.estado === "OK" ? "OK" : r.estado === "ADVERTENCIA" ? "ADVERTENCIA" : r.estado === "DUPLICADO" ? "DUPLICADO" : "ERROR",
          problemas: aJson(esExcluida(r) ? [...r.problemas, { severidad: "INFO", codigo: "UNIDAD_FUERA_DE_INVENTARIO", mensaje: `Unidad "${r.unidad.identificador}" excluida al confirmar: no figura en el inventario administrativo declarado.` }] : r.problemas),
          destinoId: unidadPorIdent.get(r.unidad.identificador.toLowerCase()) ?? null,
        })),
      });
      await tx.importBatch.update({ where: { id }, data: { estado: "CONFIRMADO", confirmadoPorId: s.usuarioId === "sistema" ? null : s.usuarioId, confirmadoAt: new Date() } });
      await auditar(tx, s, "IMPORTACION_CONFIRMAR", "ImportBatch", id, { sociedadId, despues: res });
      return res;
    },
    { timeout: 120_000 },
  );
}

export async function cancelarImportacion(s: Sesion, id: string, motivo: string) {
  const b = await batchConAcceso(s, id);
  if (b.estado === "CONFIRMADO") throw new ErrorNegocio("Una importación confirmada no se cancela: revierta los registros individualmente.");
  return prisma.$transaction(async (tx: Tx) => {
    await tx.importBatch.update({ where: { id }, data: { estado: "CANCELADO" } });
    await auditar(tx, s, "IMPORTACION_CANCELAR", "ImportBatch", id, { sociedadId: b.sociedadId, motivo });
  });
}
