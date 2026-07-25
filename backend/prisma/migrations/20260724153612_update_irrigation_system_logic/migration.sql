/*
  Warnings:

  - You are about to drop the column `soil_texture` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `soil_type` on the `properties` table. All the data in the column will be lost.
  - Added the required column `irrigation_system_type` to the `crops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "irrigation_systems" DROP CONSTRAINT "irrigation_systems_crop_id_fkey";

-- AlterTable
ALTER TABLE "crops" ADD COLUMN     "irrigation_system_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "soil_texture",
DROP COLUMN "soil_type";
