-- AlterTable
ALTER TABLE "CondicionContrato" ADD COLUMN     "validacionMotivo" TEXT,
ADD COLUMN     "validado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validadoAt" TIMESTAMP(3),
ADD COLUMN     "validadoPorId" TEXT;

-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "canonOrigen" TEXT,
ADD COLUMN     "configuracionVersion" INTEGER,
ADD COLUMN     "cuentaBancariaId" TEXT,
ADD COLUMN     "depositoVerificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "documentoFirmadoId" TEXT,
ADD COLUMN     "finExcepcion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "finExcepcionAutorizadoPor" TEXT,
ADD COLUMN     "finExcepcionMotivo" TEXT,
ADD COLUMN     "inicioConfirmado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plantillaVersion" TEXT,
ADD COLUMN     "plazoMeses" INTEGER,
ADD COLUMN     "revisionJuridicaAprobada" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ConfiguracionContractual" (
    "id" TEXT NOT NULL,
    "sociedadId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "residentialLeaseDefaultTermMonths" INTEGER NOT NULL,
    "residentialLeaseInitialIncreasePercent" DECIMAL(9,4) NOT NULL,
    "residentialLeaseRentPolicy" TEXT NOT NULL,
    "residentialLeaseAutoAdjustment" BOOLEAN NOT NULL,
    "alertasDias" INTEGER[],
    "autorizadoPor" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "creadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfiguracionContractual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionContractual_sociedadId_version_key" ON "ConfiguracionContractual"("sociedadId", "version");

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContractual" ADD CONSTRAINT "ConfiguracionContractual_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
