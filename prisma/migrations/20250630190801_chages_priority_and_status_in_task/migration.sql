/*
  Warnings:

  - You are about to alter the column `status` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[status]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[priority]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Made the column `priority` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    MODIFY `status` ENUM('PENDING', 'INPROGRESS', 'COMPLETED', 'OVERDUE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Task_status_key` ON `Task`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `Task_priority_key` ON `Task`(`priority`);
