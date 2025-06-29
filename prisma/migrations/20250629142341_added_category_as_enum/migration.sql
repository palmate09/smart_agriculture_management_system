/*
  Warnings:

  - You are about to alter the column `category` on the `Expenses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Expenses` MODIFY `category` ENUM('SEEDS', 'FERTILIZERS', 'PESTICIDES_HERBICIDES', 'LABOR', 'FUEL_ENERGY', 'MACHINERY_MAINTENANCE', 'UTILITIES', 'LAND_RENT_TAXES', 'INSURENCE', 'TRANSPORTATION_LOGISTICS', 'PACKAGEING_PROCESSING', 'OTHER_EXPENSE_DETAIL') NOT NULL;
