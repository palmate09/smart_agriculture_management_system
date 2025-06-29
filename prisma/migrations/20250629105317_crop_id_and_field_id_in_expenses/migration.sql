/*
  Warnings:

  - You are about to drop the column `associatedCropId` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `associatedFieldId` on the `Expenses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Expenses` DROP FOREIGN KEY `Expenses_associatedCropId_fkey`;

-- DropForeignKey
ALTER TABLE `Expenses` DROP FOREIGN KEY `Expenses_associatedFieldId_fkey`;

-- DropIndex
DROP INDEX `Expenses_associatedCropId_fkey` ON `Expenses`;

-- DropIndex
DROP INDEX `Expenses_associatedFieldId_fkey` ON `Expenses`;

-- AlterTable
ALTER TABLE `Expenses` DROP COLUMN `associatedCropId`,
    DROP COLUMN `associatedFieldId`,
    ADD COLUMN `cropId` VARCHAR(191) NULL,
    ADD COLUMN `fieldId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Expenses` ADD CONSTRAINT `Expenses_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `Crop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expenses` ADD CONSTRAINT `Expenses_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
