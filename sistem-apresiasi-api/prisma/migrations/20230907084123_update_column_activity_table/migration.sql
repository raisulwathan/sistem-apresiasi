/*
  Warnings:

  - You are about to drop the column `fields_activity` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `fieldsActivity` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locations` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "fields_activity",
ADD COLUMN     "fieldsActivity" TEXT NOT NULL,
ADD COLUMN     "locations" TEXT NOT NULL;
