/*
  Warnings:

  - Added the required column `role` to the `Ttd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ttd" ADD COLUMN     "role" TEXT NOT NULL;
