/*
  Warnings:

  - You are about to drop the column `freshMoney` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `sks` on the `Achievement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activityId]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `years` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusActive` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusGraduate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatusActive" AS ENUM ('AKTIF', 'TIDAK_AKTIF');

-- CreateEnum
CREATE TYPE "UserStatusGraduate" AS ENUM ('LULUS', 'BELUM_LULUS');

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "freshMoney",
DROP COLUMN "sks";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "years" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "locations" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "statusActive" "UserStatusActive" NOT NULL,
ADD COLUMN     "statusGraduate" "UserStatusGraduate" NOT NULL,
ALTER COLUMN "faculty" DROP NOT NULL,
ALTER COLUMN "major" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Skpi" (
    "id" TEXT NOT NULL,
    "mandatoryPoints" INTEGER NOT NULL,
    "charityPoints" INTEGER NOT NULL,
    "scientificPoints" INTEGER NOT NULL,
    "talentPoints" INTEGER NOT NULL,
    "organizationPoints" INTEGER NOT NULL,
    "otherPoints" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Skpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authentication" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_independent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level_activity" TEXT NOT NULL,
    "participant_type" TEXT NOT NULL,
    "total_participants" INTEGER,
    "participants" JSONB[],
    "faculty" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "mentor" TEXT,
    "year" TEXT NOT NULL,
    "start_date" TEXT,
    "end_date" TEXT,
    "file_url" TEXT[],

    CONSTRAINT "achievement_independent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_non_competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "activity" TEXT,
    "level_activity" TEXT,
    "number_of_students" INTEGER,
    "year" TEXT NOT NULL,
    "file_url" TEXT[],

    CONSTRAINT "achievement_non_competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skpi_ownerId_key" ON "Skpi"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "OtpCode_id_key" ON "OtpCode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OtpCode_code_key" ON "OtpCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_activityId_key" ON "Achievement"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Skpi" ADD CONSTRAINT "Skpi_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
