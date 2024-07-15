/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Authentication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtpCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_ownerId_fkey";

-- DropIndex
DROP INDEX "Skpi_ownerId_key";

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Authentication";

-- DropTable
DROP TABLE "OtpCode";
