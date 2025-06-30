/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Crop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Field` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Crop_name_key` ON `Crop`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Field_name_key` ON `Field`(`name`);
