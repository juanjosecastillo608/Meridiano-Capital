-- CreateEnum
CREATE TYPE "ModoFecha" AS ENUM ('INDIVIDUAL', 'COMUN');

-- CreateEnum
CREATE TYPE "EstadoAcuerdo" AS ENUM ('NO_REQUERIDO', 'PENDIENTE', 'ACEPTADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "EstadoRevision" AS ENUM ('PENDIENTE', 'APROBADA', 'OBSERVADA');

-- CreateEnum
CREATE TYPE "EstadoLote" AS ENUM ('PREPARACION', 'CONFIRMADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoItemLote" AS ENUM ('PENDIENTE', 'AUTORIZADO', 'EXCLUIDO', 'GENERADO');

-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "contractBatchId" TEXT,
ADD COLUMN     "dateAgreementEvidenceId" TEXT,
ADD COLUMN     "dateAgreementStatus" "EstadoAcuerdo" NOT NULL DEFAULT 'NO_REQUERIDO',
ADD COLUMN     "dateApprovedAt" TIMESTAMP(3),
ADD COLUMN     "dateApprovedBy" TEXT,
ADD COLUMN     "dateSelectionMode" "ModoFecha" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "legalReviewStatus" "EstadoRevision" NOT NULL DEFAULT 'PENDIENTE';

-- CreateTable
CREATE TABLE "ContratoFechaVersion" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "fechaInicio" DATE,
    "fechaFin" DATE,
    "fechaFirma" DATE,
    "plazoMeses" INTEGER,
    "modo" "ModoFecha" NOT NULL,
    "motivo" TEXT NOT NULL,
    "creadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContratoFechaVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractBatch" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "fechaComunPropuesta" DATE NOT NULL,
    "plazoMeses" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoLote" NOT NULL DEFAULT 'PREPARACION',
    "creadoPorId" TEXT,
    "confirmadoPorId" TEXT,
    "confirmadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractBatchItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "unidadId" TEXT NOT NULL,
    "contratoAnteriorId" TEXT,
    "inicioAnterior" DATE,
    "finAnterior" DATE,
    "inicioPropuesto" DATE NOT NULL,
    "finPropuesto" DATE NOT NULL,
    "acuerdoEstado" "EstadoAcuerdo" NOT NULL DEFAULT 'PENDIENTE',
    "acuerdoEvidenciaId" TEXT,
    "acuerdoRegistradoPorId" TEXT,
    "acuerdoAt" TIMESTAMP(3),
    "acuerdoMotivo" TEXT,
    "revisionEstado" "EstadoRevision" NOT NULL DEFAULT 'PENDIENTE',
    "revisionMotivo" TEXT,
    "revisionPorId" TEXT,
    "revisionAt" TIMESTAMP(3),
    "estado" "EstadoItemLote" NOT NULL DEFAULT 'PENDIENTE',
    "motivoExclusion" TEXT,
    "contratoGeneradoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContratoFechaVersion_contratoId_version_key" ON "ContratoFechaVersion"("contratoId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ContractBatchItem_batchId_unidadId_key" ON "ContractBatchItem"("batchId", "unidadId");

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_contractBatchId_fkey" FOREIGN KEY ("contractBatchId") REFERENCES "ContractBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoFechaVersion" ADD CONSTRAINT "ContratoFechaVersion_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractBatchItem" ADD CONSTRAINT "ContractBatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ContractBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
