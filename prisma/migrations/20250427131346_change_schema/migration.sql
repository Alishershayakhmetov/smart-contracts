/*
  Warnings:

  - The values [ORGANIZATION] on the enum `IssuerType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IssuerType_new" AS ENUM ('PERSON', 'ORGANISATION');
ALTER TABLE "Certificate" ALTER COLUMN "issuerType" TYPE "IssuerType_new" USING ("issuerType"::text::"IssuerType_new");
ALTER TYPE "IssuerType" RENAME TO "IssuerType_old";
ALTER TYPE "IssuerType_new" RENAME TO "IssuerType";
DROP TYPE "IssuerType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Session";
