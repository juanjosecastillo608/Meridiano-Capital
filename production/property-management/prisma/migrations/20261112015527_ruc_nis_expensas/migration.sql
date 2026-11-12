-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "ruc" TEXT;

-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN     "expensaFuente" TEXT,
ADD COLUMN     "expensaMensualUnidad" DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Unidad" ADD COLUMN     "nisAnde" TEXT;
