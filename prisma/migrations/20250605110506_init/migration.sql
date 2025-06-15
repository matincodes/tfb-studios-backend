/*
  Warnings:

  - You are about to drop the column `renderedImageUrl` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "renderedImageUrl";

-- AlterTable
ALTER TABLE "Fabric" ADD COLUMN     "uploadedById" TEXT;

-- CreateTable
CREATE TABLE "RenderedDesign" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "fabricId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RenderedDesign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fabric" ADD CONSTRAINT "Fabric_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenderedDesign" ADD CONSTRAINT "RenderedDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenderedDesign" ADD CONSTRAINT "RenderedDesign_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "Fabric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenderedDesign" ADD CONSTRAINT "RenderedDesign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
