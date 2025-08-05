/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Design` table. All the data in the column will be lost.
  - The `imageUrl` column on the `RenderedDesign` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "RenderedDesign" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- CreateTable
CREATE TABLE "DesignMetadata" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "DesignMetadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DesignMetadata" ADD CONSTRAINT "DesignMetadata_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
