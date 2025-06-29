/*
  Warnings:

  - You are about to drop the column `associatedCropId` on the `Revenues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Revenues` DROP FOREIGN KEY `Revenues_associatedCropId_fkey`;

-- DropIndex
DROP INDEX `Revenues_associatedCropId_fkey` ON `Revenues`;

-- AlterTable
ALTER TABLE `Revenues` DROP COLUMN `associatedCropId`,
    ADD COLUMN `cropId` VARCHAR(191) NULL,
    ADD COLUMN `fieldId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Revenues` ADD CONSTRAINT `Revenues_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `Crop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revenues` ADD CONSTRAINT `Revenues_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
