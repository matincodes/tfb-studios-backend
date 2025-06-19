/*
  Warnings:

  - Made the column `imageUrl` on table `Fabric` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "initialFabricId" TEXT;

-- AlterTable
ALTER TABLE "Fabric" ADD COLUMN     "composition" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ALTER COLUMN "imageUrl" SET NOT NULL;
