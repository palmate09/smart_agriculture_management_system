/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `Revenues` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Revenues_source_key` ON `Revenues`(`source`);
