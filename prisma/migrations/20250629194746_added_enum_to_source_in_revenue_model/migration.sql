/*
  Warnings:

  - You are about to alter the column `source` on the `Revenues` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Revenues` MODIFY `source` ENUM('CROP_SALE', 'SUBSIDY', 'LIVESTOCK_SALE') NOT NULL;
