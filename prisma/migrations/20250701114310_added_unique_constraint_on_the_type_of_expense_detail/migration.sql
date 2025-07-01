/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `ExpenseDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ExpenseDetail_type_key` ON `ExpenseDetail`(`type`);
