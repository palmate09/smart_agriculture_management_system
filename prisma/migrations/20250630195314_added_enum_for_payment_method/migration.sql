/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `Expenses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentMethod]` on the table `Expenses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `paymentMethod` on table `Expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Expenses` MODIFY `paymentMethod` ENUM('CASH', 'BANKTRANSFER') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Expenses_category_key` ON `Expenses`(`category`);

-- CreateIndex
CREATE UNIQUE INDEX `Expenses_paymentMethod_key` ON `Expenses`(`paymentMethod`);
