/*
  Warnings:

  - A unique constraint covering the columns `[cropId]` on the table `CropGrowthStage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CropGrowthStage_cropId_key` ON `CropGrowthStage`(`cropId`);
