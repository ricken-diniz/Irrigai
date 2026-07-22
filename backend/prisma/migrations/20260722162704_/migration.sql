-- CreateEnum
CREATE TYPE "calculation_status" AS ENUM ('latest', 'historical');

-- DropForeignKey
ALTER TABLE "irrigation_calculations" DROP CONSTRAINT "irrigation_calculations_crop_id_fkey";

-- AlterTable
ALTER TABLE "irrigation_calculations" ADD COLUMN     "status" "calculation_status" NOT NULL DEFAULT 'latest',
ALTER COLUMN "crop_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "irrigation_calculations_crop_id_status_idx" ON "irrigation_calculations"("crop_id", "status");

-- AddForeignKey
ALTER TABLE "irrigation_calculations" ADD CONSTRAINT "irrigation_calculations_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "crops"("crop_id") ON DELETE SET NULL ON UPDATE CASCADE;
