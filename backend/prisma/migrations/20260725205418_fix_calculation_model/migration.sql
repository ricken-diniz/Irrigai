/*
  Warnings:

  - You are about to drop the column `et0_annual` on the `climate_data` table. All the data in the column will be lost.
  - You are about to drop the column `climate_snapshot` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `crop_data_snapshot` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `eto_mm` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `irrigation_interval_days` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `irrigation_system_snapshot` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `kc` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `rainfall_expected_mm` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the column `soil_water_deficit_mm` on the `irrigation_calculations` table. All the data in the column will be lost.
  - You are about to drop the `irrigation_systems` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[s2_token,reference_month,reference_year]` on the table `climate_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eto_mm` to the `climate_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s2_token` to the `climate_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `climate_data_id` to the `irrigation_calculations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "climate_data_municipality_state_reference_month_reference_y_key";

-- AlterTable
ALTER TABLE "climate_data" DROP COLUMN "et0_annual",
ADD COLUMN     "eto_mm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "s2_token" VARCHAR(5) NOT NULL;

-- AlterTable
ALTER TABLE "irrigation_calculations" DROP COLUMN "climate_snapshot",
DROP COLUMN "crop_data_snapshot",
DROP COLUMN "eto_mm",
DROP COLUMN "irrigation_interval_days",
DROP COLUMN "irrigation_system_snapshot",
DROP COLUMN "kc",
DROP COLUMN "rainfall_expected_mm",
DROP COLUMN "soil_water_deficit_mm",
ADD COLUMN     "climate_data_id" UUID NOT NULL;

-- DropTable
DROP TABLE "irrigation_systems";

-- CreateIndex
CREATE INDEX "climate_data_s2_token_idx" ON "climate_data"("s2_token");

-- CreateIndex
CREATE UNIQUE INDEX "climate_data_s2_token_reference_month_reference_year_key" ON "climate_data"("s2_token", "reference_month", "reference_year");

-- CreateIndex
CREATE INDEX "irrigation_calculations_climate_data_id_idx" ON "irrigation_calculations"("climate_data_id");

-- AddForeignKey
ALTER TABLE "irrigation_calculations" ADD CONSTRAINT "irrigation_calculations_climate_data_id_fkey" FOREIGN KEY ("climate_data_id") REFERENCES "climate_data"("climate_data_id") ON DELETE RESTRICT ON UPDATE CASCADE;
