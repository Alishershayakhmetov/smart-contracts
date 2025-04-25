/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[iin]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "IssuerType" AS ENUM ('PERSON', 'ORGANIZATION');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
ADD COLUMN     "iin" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipientIIN" TEXT NOT NULL,
    "issuerType" "IssuerType" NOT NULL,
    "issuerIIN" TEXT NOT NULL,
    "organisationName" TEXT NOT NULL,
    "BIN" TEXT NOT NULL,
    "certificateTheme" TEXT NOT NULL,
    "certificateBody" TEXT NOT NULL,
    "dateOfIssue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Certificate_id_idx" ON "Certificate"("id");

-- CreateIndex
CREATE INDEX "Certificate_recipientIIN_idx" ON "Certificate"("recipientIIN");

-- CreateIndex
CREATE INDEX "Certificate_issuerIIN_idx" ON "Certificate"("issuerIIN");

-- CreateIndex
CREATE INDEX "Certificate_BIN_idx" ON "Certificate"("BIN");

-- CreateIndex
CREATE UNIQUE INDEX "User_iin_key" ON "User"("iin");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_recipientIIN_fkey" FOREIGN KEY ("recipientIIN") REFERENCES "User"("iin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_issuerIIN_fkey" FOREIGN KEY ("issuerIIN") REFERENCES "User"("iin") ON DELETE RESTRICT ON UPDATE CASCADE;
