/*
  Warnings:

  - You are about to drop the column `valid` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `years` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "valid",
DROP COLUMN "years",
ADD COLUMN     "status" TEXT;
