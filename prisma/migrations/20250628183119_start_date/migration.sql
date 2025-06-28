/*
  Warnings:

  - You are about to drop the column `date` on the `Activites` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Activites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Activites` DROP COLUMN `date`,
    ADD COLUMN `startDate` DATE NOT NULL;
