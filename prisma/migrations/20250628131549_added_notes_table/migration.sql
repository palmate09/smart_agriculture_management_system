/*
  Warnings:

  - You are about to drop the column `notes` on the `Activites` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Crop` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CropGrowthStage` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Revenues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Activites` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `Crop` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `CropGrowthStage` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `Expenses` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `Field` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `Revenues` DROP COLUMN `notes`;

-- CreateTable
CREATE TABLE `Notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `fieldId` VARCHAR(191) NULL,
    `cropId` VARCHAR(191) NULL,
    `crpgwthId` VARCHAR(191) NULL,
    `activitesId` VARCHAR(191) NULL,
    `ExpenseId` VARCHAR(191) NULL,
    `RevenueId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `Crop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_crpgwthId_fkey` FOREIGN KEY (`crpgwthId`) REFERENCES `CropGrowthStage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_activitesId_fkey` FOREIGN KEY (`activitesId`) REFERENCES `Activites`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_ExpenseId_fkey` FOREIGN KEY (`ExpenseId`) REFERENCES `Expenses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_RevenueId_fkey` FOREIGN KEY (`RevenueId`) REFERENCES `Revenues`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
