/*
  Warnings:

  - You are about to alter the column `status` on the `Crop` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Crop` MODIFY `status` ENUM('PLLANED', 'GROWING', 'HARVESTED', 'ABANDONED') NOT NULL;
