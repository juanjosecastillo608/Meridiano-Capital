-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('PYG', 'USD');

-- CreateEnum
CREATE TYPE "OrigenDato" AS ENUM ('MANUAL', 'IMPORTADO', 'GENERADO', 'SEED_PRUEBA');

-- CreateEnum
CREATE TYPE "EstadoDato" AS ENUM ('PENDIENTE_REVISION', 'VALIDADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPERADMIN', 'ADMIN_GENERAL', 'ADMIN_SOCIEDAD', 'RESPONSABLE_PROPIEDAD', 'COBRANZAS', 'FACTURACION', 'MANTENIMIENTO', 'PROPIETARIO_CONSULTA', 'AUDITOR');

-- CreateEnum
CREATE TYPE "EstadoSociedad" AS ENUM ('ACTIVA', 'EN_CONSTITUCION', 'INACTIVA');

-- CreateEnum
CREATE TYPE "TipoUnidad" AS ENUM ('DEPARTAMENTO', 'LOCAL_COMERCIAL', 'OFICINA', 'COCHERA', 'DEPOSITO', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoOperativoUnidad" AS ENUM ('OPERATIVA', 'RESERVADA', 'EN_MANTENIMIENTO', 'EN_REMODELACION', 'FUERA_DE_SERVICIO');

-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CI', 'RUC', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoContrato" AS ENUM ('BORRADOR', 'PENDIENTE_FIRMA', 'VIGENTE', 'VENCIDO', 'RENOVADO', 'RESCINDIDO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "RolParte" AS ENUM ('INQUILINO', 'GARANTE', 'CODEUDOR');

-- CreateEnum
CREATE TYPE "CategoriaFiscalAlquiler" AS ENUM ('ALQUILER_RESIDENCIAL', 'ALQUILER_COMERCIAL', 'RENTA_TEMPORAL');

-- CreateEnum
CREATE TYPE "ResponsableGasto" AS ENUM ('INQUILINO', 'PROPIETARIO', 'COMPARTIDO', 'NO_DEFINIDO');

-- CreateEnum
CREATE TYPE "TipoReajuste" AS ENUM ('SIN_REAJUSTE', 'PORCENTAJE_FIJO', 'INDICE', 'MANUAL');

-- CreateEnum
CREATE TYPE "MotivoCondicion" AS ENUM ('INICIAL', 'ADENDA', 'REAJUSTE', 'CORRECCION');

-- CreateEnum
CREATE TYPE "ConceptoObligacion" AS ENUM ('ALQUILER', 'EXPENSAS', 'SERVICIOS', 'INTERESES', 'PENALIDAD', 'REPARACION_IMPUTABLE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoObligacion" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA', 'EN_DISPUTA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TRANSFERENCIA', 'DEPOSITO', 'EFECTIVO', 'CHEQUE', 'TARJETA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('REGISTRADO', 'REVERTIDO');

-- CreateEnum
CREATE TYPE "EstadoValidacionFiscal" AS ENUM ('PENDIENTE', 'CONFIRMADA_FOUNDER', 'VALIDADA_CONTADOR');

-- CreateEnum
CREATE TYPE "TipoComprobante" AS ENUM ('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('PENDIENTE', 'EMITIDA', 'VALIDADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "TipoGastoEdificio" AS ENUM ('ORDINARIO', 'EXTRAORDINARIO', 'PROPIETARIO');

-- CreateEnum
CREATE TYPE "CriterioDistribucion" AS ENUM ('M2', 'COEFICIENTE', 'IMPORTE_FIJO', 'PARTES_IGUALES', 'MANUAL');

-- CreateEnum
CREATE TYPE "RubroObra" AS ENUM ('AGUA_SANITARIA', 'ELECTRICIDAD', 'PINTURA', 'OBRA_CIVIL', 'VARIOS');

-- CreateEnum
CREATE TYPE "EstadoOrdenTrabajo" AS ENUM ('SOLICITADO', 'EN_EVALUACION', 'PRESUPUESTADO', 'PENDIENTE_APROBACION', 'APROBADO', 'EN_EJECUCION', 'FINALIZADO', 'CERRADO');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "EstadoRemodelacion" AS ENUM ('EN_PRESUPUESTO', 'PENDIENTE_APROBACION', 'APROBADO', 'EN_EJECUCION', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "CalidadDato" AS ENUM ('DATO_RECIBIDO', 'COTIZACION_VERIFICADA', 'CALCULO', 'SUPUESTO', 'INFORMACION_FALTANTE', 'REVISION_TECNICA_REQUERIDA');

-- CreateEnum
CREATE TYPE "TipoPartida" AS ENUM ('MATERIAL', 'MANO_DE_OBRA', 'EQUIPO', 'SUBCONTRATO', 'INDIRECTO', 'CONTINGENCIA');

-- CreateEnum
CREATE TYPE "CategoriaEgreso" AS ENUM ('MANTENIMIENTO', 'SERVICIOS', 'IMPUESTOS', 'SEGUROS', 'HONORARIOS_ADMINISTRACION', 'REMODELACION', 'EXPENSAS_PROPIETARIO', 'EXTRAORDINARIO', 'OTRO');

-- CreateEnum
CREATE TYPE "NaturalezaEgreso" AS ENUM ('OPEX', 'CAPEX');

-- CreateEnum
CREATE TYPE "EstadoImportacion" AS ENUM ('ANALIZADO', 'MAPEADO', 'VALIDADO', 'CONFIRMADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoFilaImport" AS ENUM ('OK', 'ADVERTENCIA', 'ERROR', 'DUPLICADO', 'OMITIDA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionRol" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "sociedadId" TEXT,
    "propiedadId" TEXT,

    CONSTRAINT "AsignacionRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "sociedadId" TEXT,
    "antes" JSONB,
    "despues" JSONB,
    "motivo" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sociedad" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT,
    "domicilioFiscal" TEXT,
    "representanteLegal" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "monedaOperacion" "Moneda" NOT NULL DEFAULT 'PYG',
    "datosFacturacion" JSONB,
    "estado" "EstadoSociedad" NOT NULL DEFAULT 'ACTIVA',
    "observaciones" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sociedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaBancaria" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT,
    "moneda" "Moneda" NOT NULL,
    "titular" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CuentaBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,
    "barrio" TEXT,
    "catastro" TEXT,
    "cantidadPisos" INTEGER,
    "superficieConstruida" DECIMAL(12,2),
    "superficieAlquilable" DECIMAL(12,2),
    "superficieComun" DECIMAL(12,2),
    "fechaAdquisicion" DATE,
    "valorAdquisicion" DECIMAL(18,2),
    "valorAdquisicionMoneda" "Moneda",
    "valorEstimado" DECIMAL(18,2),
    "valorEstimadoMoneda" "Moneda",
    "valorEstimadoFuente" TEXT,
    "valorEstimadoFecha" DATE,
    "responsableUsuarioId" TEXT,
    "cuentaBancariaId" TEXT,
    "observaciones" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Titularidad" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "porcentaje" DECIMAL(7,4) NOT NULL,
    "desde" DATE,
    "hasta" DATE,

    CONSTRAINT "Titularidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidad" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "piso" TEXT,
    "tipo" "TipoUnidad" NOT NULL,
    "superficieM2" DECIMAL(10,2),
    "dormitorios" INTEGER,
    "banos" INTEGER,
    "estacionamientos" INTEGER,
    "caracteristicas" TEXT,
    "estadoFisico" TEXT,
    "estadoOperativo" "EstadoOperativoUnidad" NOT NULL DEFAULT 'OPERATIVA',
    "alquilerReferencia" DECIMAL(18,2),
    "alquilerReferenciaMoneda" "Moneda",
    "alquilerReferenciaFuente" TEXT,
    "coeficienteExpensas" DECIMAL(9,6),
    "expensasAsignadas" DECIMAL(18,2),
    "fechaUltimaRemodelacion" DATE,
    "observaciones" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Unidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "tipo" "TipoPersona" NOT NULL,
    "nombre" TEXT NOT NULL,
    "documentoTipo" "TipoDocumento",
    "documentoNumero" TEXT,
    "documentoNormalizado" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "domicilio" TEXT,
    "personaContacto" TEXT,
    "datosFacturacion" JSONB,
    "contactoEmergencia" TEXT,
    "referencias" TEXT,
    "observaciones" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "estado" "EstadoContrato" NOT NULL DEFAULT 'BORRADOR',
    "categoriaFiscal" "CategoriaFiscalAlquiler" NOT NULL,
    "fechaFirma" DATE,
    "fechaInicio" DATE,
    "fechaFin" DATE,
    "fechaEntrega" DATE,
    "fechaDevolucion" DATE,
    "fechaRescision" DATE,
    "moneda" "Moneda" NOT NULL,
    "diaVencimiento" INTEGER,
    "deposito" DECIMAL(18,2),
    "reajusteTipo" "TipoReajuste" NOT NULL DEFAULT 'SIN_REAJUSTE',
    "reajusteFrecuenciaMeses" INTEGER,
    "reajustePorcentaje" DECIMAL(9,6),
    "reajusteIndice" TEXT,
    "reajusteValidado" BOOLEAN NOT NULL DEFAULT false,
    "responsabilidadExpensas" "ResponsableGasto" NOT NULL DEFAULT 'NO_DEFINIDO',
    "responsabilidadServicios" "ResponsableGasto" NOT NULL DEFAULT 'NO_DEFINIDO',
    "penalidadesTexto" TEXT,
    "moraTasaDiariaPct" DECIMAL(9,6),
    "moraValidada" BOOLEAN NOT NULL DEFAULT false,
    "periodoGraciaDias" INTEGER NOT NULL DEFAULT 0,
    "condicionesRenovacion" TEXT,
    "contratoAnteriorId" TEXT,
    "documentoId" TEXT,
    "observaciones" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoUnidad" (
    "contratoId" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,

    CONSTRAINT "ContratoUnidad_pkey" PRIMARY KEY ("contratoId","unidadId")
);

-- CreateTable
CREATE TABLE "ContratoParte" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "rol" "RolParte" NOT NULL,

    CONSTRAINT "ContratoParte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CondicionContrato" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "vigenteDesde" DATE NOT NULL,
    "montoAlquiler" DECIMAL(18,2) NOT NULL,
    "motivo" "MotivoCondicion" NOT NULL,
    "referencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPorId" TEXT,

    CONSTRAINT "CondicionContrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionAlerta" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT,
    "tipo" TEXT NOT NULL,
    "dias" INTEGER[],

    CONSTRAINT "ConfiguracionAlerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obligacion" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "unidadId" TEXT,
    "contratoId" TEXT,
    "personaId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "concepto" "ConceptoObligacion" NOT NULL,
    "descripcion" TEXT,
    "fechaVencimiento" DATE NOT NULL,
    "moneda" "Moneda" NOT NULL,
    "importeNeto" DECIMAL(18,2) NOT NULL,
    "iva" DECIMAL(18,2) NOT NULL,
    "ajustes" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "importeTotal" DECIMAL(18,2) NOT NULL,
    "saldo" DECIMAL(18,2) NOT NULL,
    "estado" "EstadoObligacion" NOT NULL DEFAULT 'PENDIENTE',
    "reglaFiscalId" TEXT,
    "ivaPendiente" BOOLEAN NOT NULL DEFAULT false,
    "claveIdempotencia" TEXT NOT NULL,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'GENERADO',
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "importBatchId" TEXT,
    "motivoAnulacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obligacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "propiedadId" TEXT,
    "unidadId" TEXT,
    "cuentaBancariaId" TEXT,
    "fechaPago" DATE NOT NULL,
    "fechaAcreditacion" DATE,
    "bancoOrigen" TEXT,
    "metodo" "MetodoPago" NOT NULL,
    "comprobante" TEXT,
    "moneda" "Moneda" NOT NULL,
    "importe" DECIMAL(18,2) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'REGISTRADO',
    "conciliado" BOOLEAN NOT NULL DEFAULT false,
    "claveDuplicado" TEXT,
    "registradoPorId" TEXT,
    "documentoId" TEXT,
    "observaciones" TEXT,
    "motivoReversion" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AplicacionPago" (
    "id" TEXT NOT NULL,
    "pagoId" TEXT NOT NULL,
    "obligacionId" TEXT NOT NULL,
    "importe" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revertidaAt" TIMESTAMP(3),

    CONSTRAINT "AplicacionPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReglaFiscal" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tasaPct" DECIMAL(9,6) NOT NULL,
    "baseImponiblePct" DECIMAL(9,6) NOT NULL DEFAULT 100,
    "ivaIncluido" BOOLEAN NOT NULL DEFAULT false,
    "vigenteDesde" DATE NOT NULL,
    "vigenteHasta" DATE,
    "version" INTEGER NOT NULL,
    "estadoValidacion" "EstadoValidacionFiscal" NOT NULL DEFAULT 'PENDIENTE',
    "fuente" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReglaFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timbrado" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "vigenciaDesde" DATE NOT NULL,
    "vigenciaHasta" DATE NOT NULL,
    "establecimiento" TEXT NOT NULL,
    "puntoExpedicion" TEXT NOT NULL,
    "proximoNumero" INTEGER NOT NULL DEFAULT 1,
    "electronico" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Timbrado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "receptorId" TEXT NOT NULL,
    "timbradoId" TEXT,
    "tipo" "TipoComprobante" NOT NULL DEFAULT 'FACTURA',
    "numero" TEXT,
    "fechaEmision" DATE,
    "moneda" "Moneda" NOT NULL,
    "totalNeto" DECIMAL(18,2) NOT NULL,
    "totalIva" DECIMAL(18,2) NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'PENDIENTE',
    "facturaRefId" TEXT,
    "cdc" TEXT,
    "documentoId" TEXT,
    "motivoAnulacion" TEXT,
    "esPrueba" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaItem" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "obligacionId" TEXT,
    "descripcion" TEXT NOT NULL,
    "neto" DECIMAL(18,2) NOT NULL,
    "tasaIvaPct" DECIMAL(9,6) NOT NULL,
    "iva" DECIMAL(18,2) NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "FacturaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "rubro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GastoEdificio" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "tipo" "TipoGastoEdificio" NOT NULL,
    "proveedorId" TEXT,
    "comprobante" TEXT,
    "moneda" "Moneda" NOT NULL,
    "importe" DECIMAL(18,2) NOT NULL,
    "liquidacionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GastoEdificio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidacionExpensas" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "criterio" "CriterioDistribucion" NOT NULL,
    "moneda" "Moneda" NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "aprobadaPorId" TEXT,
    "fechaVencimiento" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiquidacionExpensas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidacionExpensasItem" (
    "id" TEXT NOT NULL,
    "liquidacionId" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "base" DECIMAL(18,6) NOT NULL,
    "importe" DECIMAL(18,2) NOT NULL,
    "trasladableInquilino" BOOLEAN NOT NULL DEFAULT false,
    "obligacionId" TEXT,

    CONSTRAINT "LiquidacionExpensasItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenTrabajo" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "unidadId" TEXT,
    "fechaSolicitud" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" "RubroObra" NOT NULL,
    "prioridad" "Prioridad" NOT NULL DEFAULT 'MEDIA',
    "responsableUsuarioId" TEXT,
    "proveedorId" TEXT,
    "costoEstimado" DECIMAL(18,2),
    "costoReal" DECIMAL(18,2),
    "moneda" "Moneda" NOT NULL DEFAULT 'PYG',
    "aprobadoPorId" TEXT,
    "fechaAprobacion" TIMESTAMP(3),
    "fechaEjecucion" DATE,
    "estado" "EstadoOrdenTrabajo" NOT NULL DEFAULT 'SOLICITADO',
    "responsableEconomico" "ResponsableGasto" NOT NULL DEFAULT 'NO_DEFINIDO',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProyectoRemodelacion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "unidadId" TEXT,
    "objetivo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoRemodelacion" NOT NULL DEFAULT 'EN_PRESUPUESTO',
    "moneda" "Moneda" NOT NULL DEFAULT 'PYG',
    "presupuestoAprobado" DECIMAL(18,2),
    "aprobadoPorId" TEXT,
    "fechaAprobacion" TIMESTAMP(3),
    "fechaInicio" DATE,
    "fechaEntregaEstimada" DATE,
    "fechaFinalizacion" DATE,
    "alquilerAnterior" DECIMAL(18,2),
    "alquilerPosteriorEsperado" DECIMAL(18,2),
    "alquilerPosteriorFuente" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProyectoRemodelacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartidaRemodelacion" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'INICIAL',
    "rubro" "RubroObra" NOT NULL,
    "tipo" "TipoPartida" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(14,4),
    "unidadMedida" TEXT,
    "precioUnitario" DECIMAL(18,2),
    "total" DECIMAL(18,2),
    "calidadDato" "CalidadDato" NOT NULL,
    "proveedorId" TEXT,
    "fuente" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartidaRemodelacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Egreso" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "unidadId" TEXT,
    "fecha" DATE NOT NULL,
    "periodo" TEXT NOT NULL,
    "categoria" "CategoriaEgreso" NOT NULL,
    "naturaleza" "NaturalezaEgreso" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "moneda" "Moneda" NOT NULL,
    "importe" DECIMAL(18,2) NOT NULL,
    "proveedorId" TEXT,
    "comprobante" TEXT,
    "ordenTrabajoId" TEXT,
    "proyectoId" TEXT,
    "aprobadoPorId" TEXT,
    "origenDato" "OrigenDato" NOT NULL DEFAULT 'MANUAL',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Egreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "nombreArchivo" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "tamanoBytes" INTEGER NOT NULL,
    "subidoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT,
    "nombreArchivo" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "documentoId" TEXT,
    "estado" "EstadoImportacion" NOT NULL DEFAULT 'ANALIZADO',
    "analisis" JSONB NOT NULL,
    "mapeo" JSONB,
    "informe" JSONB,
    "creadoPorId" TEXT,
    "confirmadoPorId" TEXT,
    "confirmadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRow" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "hoja" TEXT NOT NULL,
    "fila" INTEGER NOT NULL,
    "entidad" TEXT NOT NULL,
    "crudo" JSONB NOT NULL,
    "mapeado" JSONB,
    "estado" "EstadoFilaImport" NOT NULL,
    "problemas" JSONB,
    "destinoId" TEXT,

    CONSTRAINT "ImportRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "AsignacionRol_sociedadId_idx" ON "AsignacionRol"("sociedadId");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionRol_usuarioId_rol_sociedadId_propiedadId_key" ON "AsignacionRol"("usuarioId", "rol", "sociedadId", "propiedadId");

-- CreateIndex
CREATE INDEX "AuditLog_entidad_entidadId_idx" ON "AuditLog"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "AuditLog_sociedadId_createdAt_idx" ON "AuditLog"("sociedadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sociedad_razonSocial_key" ON "Sociedad"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "Sociedad_ruc_key" ON "Sociedad"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaBancaria_sociedadId_banco_numero_key" ON "CuentaBancaria"("sociedadId", "banco", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_sociedadId_codigo_key" ON "Propiedad"("sociedadId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Titularidad_propiedadId_sociedadId_desde_key" ON "Titularidad"("propiedadId", "sociedadId", "desde");

-- CreateIndex
CREATE UNIQUE INDEX "Unidad_propiedadId_identificador_key" ON "Unidad"("propiedadId", "identificador");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_documentoNormalizado_key" ON "Persona"("documentoNormalizado");

-- CreateIndex
CREATE INDEX "Persona_nombre_idx" ON "Persona"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_codigo_key" ON "Contrato"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_contratoAnteriorId_key" ON "Contrato"("contratoAnteriorId");

-- CreateIndex
CREATE INDEX "Contrato_sociedadId_estado_idx" ON "Contrato"("sociedadId", "estado");

-- CreateIndex
CREATE INDEX "Contrato_fechaFin_idx" ON "Contrato"("fechaFin");

-- CreateIndex
CREATE UNIQUE INDEX "ContratoParte_contratoId_personaId_rol_key" ON "ContratoParte"("contratoId", "personaId", "rol");

-- CreateIndex
CREATE UNIQUE INDEX "CondicionContrato_contratoId_vigenteDesde_key" ON "CondicionContrato"("contratoId", "vigenteDesde");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionAlerta_sociedadId_tipo_key" ON "ConfiguracionAlerta"("sociedadId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Obligacion_claveIdempotencia_key" ON "Obligacion"("claveIdempotencia");

-- CreateIndex
CREATE INDEX "Obligacion_sociedadId_periodo_idx" ON "Obligacion"("sociedadId", "periodo");

-- CreateIndex
CREATE INDEX "Obligacion_personaId_estado_idx" ON "Obligacion"("personaId", "estado");

-- CreateIndex
CREATE INDEX "Obligacion_unidadId_idx" ON "Obligacion"("unidadId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_claveDuplicado_key" ON "Pago"("claveDuplicado");

-- CreateIndex
CREATE INDEX "Pago_sociedadId_fechaPago_idx" ON "Pago"("sociedadId", "fechaPago");

-- CreateIndex
CREATE INDEX "Pago_personaId_idx" ON "Pago"("personaId");

-- CreateIndex
CREATE INDEX "AplicacionPago_obligacionId_idx" ON "AplicacionPago"("obligacionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReglaFiscal_codigo_version_key" ON "ReglaFiscal"("codigo", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Timbrado_sociedadId_numero_establecimiento_puntoExpedicion_key" ON "Timbrado"("sociedadId", "numero", "establecimiento", "puntoExpedicion");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_timbradoId_numero_tipo_key" ON "Factura"("timbradoId", "numero", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_ruc_key" ON "Proveedor"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidacionExpensas_propiedadId_periodo_moneda_key" ON "LiquidacionExpensas"("propiedadId", "periodo", "moneda");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidacionExpensasItem_liquidacionId_unidadId_key" ON "LiquidacionExpensasItem"("liquidacionId", "unidadId");

-- CreateIndex
CREATE UNIQUE INDEX "ProyectoRemodelacion_codigo_key" ON "ProyectoRemodelacion"("codigo");

-- CreateIndex
CREATE INDEX "Egreso_sociedadId_periodo_idx" ON "Egreso"("sociedadId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "Documento_storageKey_key" ON "Documento"("storageKey");

-- CreateIndex
CREATE INDEX "Documento_sha256_idx" ON "Documento"("sha256");

-- CreateIndex
CREATE INDEX "ImportBatch_sha256_idx" ON "ImportBatch"("sha256");

-- CreateIndex
CREATE INDEX "ImportRow_batchId_estado_idx" ON "ImportRow"("batchId", "estado");

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titularidad" ADD CONSTRAINT "Titularidad_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titularidad" ADD CONSTRAINT "Titularidad_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidad" ADD CONSTRAINT "Unidad_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_contratoAnteriorId_fkey" FOREIGN KEY ("contratoAnteriorId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoUnidad" ADD CONSTRAINT "ContratoUnidad_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoUnidad" ADD CONSTRAINT "ContratoUnidad_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoParte" ADD CONSTRAINT "ContratoParte_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoParte" ADD CONSTRAINT "ContratoParte_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CondicionContrato" ADD CONSTRAINT "CondicionContrato_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligacion" ADD CONSTRAINT "Obligacion_reglaFiscalId_fkey" FOREIGN KEY ("reglaFiscalId") REFERENCES "ReglaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionPago" ADD CONSTRAINT "AplicacionPago_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionPago" ADD CONSTRAINT "AplicacionPago_obligacionId_fkey" FOREIGN KEY ("obligacionId") REFERENCES "Obligacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timbrado" ADD CONSTRAINT "Timbrado_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_timbradoId_fkey" FOREIGN KEY ("timbradoId") REFERENCES "Timbrado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_facturaRefId_fkey" FOREIGN KEY ("facturaRefId") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaItem" ADD CONSTRAINT "FacturaItem_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaItem" ADD CONSTRAINT "FacturaItem_obligacionId_fkey" FOREIGN KEY ("obligacionId") REFERENCES "Obligacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoEdificio" ADD CONSTRAINT "GastoEdificio_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoEdificio" ADD CONSTRAINT "GastoEdificio_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoEdificio" ADD CONSTRAINT "GastoEdificio_liquidacionId_fkey" FOREIGN KEY ("liquidacionId") REFERENCES "LiquidacionExpensas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidacionExpensas" ADD CONSTRAINT "LiquidacionExpensas_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidacionExpensasItem" ADD CONSTRAINT "LiquidacionExpensasItem_liquidacionId_fkey" FOREIGN KEY ("liquidacionId") REFERENCES "LiquidacionExpensas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidacionExpensasItem" ADD CONSTRAINT "LiquidacionExpensasItem_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoRemodelacion" ADD CONSTRAINT "ProyectoRemodelacion_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoRemodelacion" ADD CONSTRAINT "ProyectoRemodelacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaRemodelacion" ADD CONSTRAINT "PartidaRemodelacion_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "ProyectoRemodelacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "ProyectoRemodelacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportRow" ADD CONSTRAINT "ImportRow_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
