/*
  Warnings:

  - You are about to alter the column `Activity_type` on the `Activites` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[Activity_type]` on the table `Activites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Activites` MODIFY `Activity_type` ENUM('SOWING', 'FERTILIZATION', 'HARVESTING', 'IRRIGATION', 'PESTCONTROL') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Activites_Activity_type_key` ON `Activites`(`Activity_type`);
