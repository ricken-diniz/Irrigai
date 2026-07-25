/*
  Warnings:

  - A unique constraint covering the columns `[property_id,name]` on the table `crops` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "crops_property_id_name_key" ON "crops"("property_id", "name");
