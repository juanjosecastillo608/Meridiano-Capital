/*
  Warnings:

  - You are about to drop the column `version` on the `PartidaRemodelacion` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RespaldoPago" AS ENUM ('SIN_RESPALDO', 'COMPROBANTE', 'CONCILIADO');

-- CreateEnum
CREATE TYPE "EtapaPresupuesto" AS ENUM ('ESTIMADO', 'COTIZACION_PROVEEDOR', 'APROBADO');

-- CreateEnum
CREATE TYPE "TipoDocumento2" AS ENUM ('RUC', 'PODER', 'ESTATUTO', 'ACTA', 'PLANO', 'RESOLUCION_MUNICIPAL', 'MAPA_UBICACION', 'PLANILLA_ADMINISTRATIVA', 'PRESUPUESTO', 'CONTRATO_ALQUILER', 'COMPROBANTE', 'OTRO');

-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "fechaEmision" DATE,
ADD COLUMN     "fechaVencimiento" DATE,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "propiedadId" TEXT,
ADD COLUMN     "sensible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo" "TipoDocumento2" NOT NULL DEFAULT 'OTRO',
ADD COLUMN     "titulo" TEXT;

-- AlterTable
ALTER TABLE "Egreso" ADD COLUMN     "documentoComprobanteId" TEXT,
ADD COLUMN     "fechaPagoEgreso" DATE,
ADD COLUMN     "pagado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sector" TEXT;

-- AlterTable
ALTER TABLE "OrdenTrabajo" ADD COLUMN     "proyectoId" TEXT,
ADD COLUMN     "sector" TEXT;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "respaldo" "RespaldoPago" NOT NULL DEFAULT 'SIN_RESPALDO';

-- AlterTable
ALTER TABLE "PartidaRemodelacion" DROP COLUMN "version",
ADD COLUMN     "confianza" TEXT,
ADD COLUMN     "etapa" "EtapaPresupuesto" NOT NULL DEFAULT 'ESTIMADO',
ADD COLUMN     "partidaOrigenId" TEXT,
ADD COLUMN     "precioAlto" DECIMAL(18,2),
ADD COLUMN     "precioBajo" DECIMAL(18,2),
ADD COLUMN     "rubroOriginal" TEXT,
ADD COLUMN     "sector" TEXT,
ADD COLUMN     "unidadId" TEXT;

-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN     "inventarioDeptosDeclarado" INTEGER,
ADD COLUMN     "inventarioFuente" TEXT,
ADD COLUMN     "inventarioLocalesDeclarado" INTEGER;

-- AlterTable
ALTER TABLE "Unidad" ADD COLUMN     "ocupacionDeclarada" TEXT,
ADD COLUMN     "ocupacionDeclaradaFuente" TEXT;

-- CreateTable
CREATE TABLE "AlcanceRemodelacion" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "unidadId" TEXT,
    "sector" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "incluido" BOOLEAN NOT NULL,
    "fuente" TEXT NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlcanceRemodelacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representante" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "facultades" TEXT,
    "documentoId" TEXT,
    "vigenteDesde" DATE,
    "vigenteHasta" DATE,
    "estadoDato" "EstadoDato" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Representante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlcanceRemodelacion_proyectoId_idx" ON "AlcanceRemodelacion"("proyectoId");

-- CreateIndex
CREATE INDEX "Documento_sociedadId_entidad_idx" ON "Documento"("sociedadId", "entidad");

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "ProyectoRemodelacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlcanceRemodelacion" ADD CONSTRAINT "AlcanceRemodelacion_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "ProyectoRemodelacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlcanceRemodelacion" ADD CONSTRAINT "AlcanceRemodelacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaRemodelacion" ADD CONSTRAINT "PartidaRemodelacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representante" ADD CONSTRAINT "Representante_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
