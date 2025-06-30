/*
  Warnings:

  - You are about to alter the column `stageName` on the `CropGrowthStage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `farm_names` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[status]` on the table `Crop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stageName]` on the table `CropGrowthStage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CropGrowthStage` MODIFY `stageName` ENUM('GERMINATION', 'FLOWERING', 'FRUTING') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `farm_names`;

-- CreateIndex
CREATE UNIQUE INDEX `Crop_status_key` ON `Crop`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `CropGrowthStage_stageName_key` ON `CropGrowthStage`(`stageName`);
