-- CreateEnum
CREATE TYPE "BandStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Band" ADD COLUMN     "status" "BandStatus" NOT NULL DEFAULT 'APPROVED';
