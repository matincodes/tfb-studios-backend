/*
  Warnings:

  - A unique constraint covering the columns `[activeRenderedDesignId]` on the table `Design` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `RenderedDesign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RenderedDesignStatus" AS ENUM ('PENDING_REVIEW', 'ACCEPTED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DesignStatus" ADD VALUE 'REVIEW_PENDING';
ALTER TYPE "DesignStatus" ADD VALUE 'REVIEW_COMPLETED';

-- DropForeignKey
ALTER TABLE "RenderedDesign" DROP CONSTRAINT "RenderedDesign_designId_fkey";

-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "activeRenderedDesignId" TEXT;

-- AlterTable
ALTER TABLE "RenderedDesign" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "RenderedDesignStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verificationToken" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "designId" TEXT,
    "renderedDesignId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_designId_idx" ON "Comment"("designId");

-- CreateIndex
CREATE INDEX "Comment_renderedDesignId_idx" ON "Comment"("renderedDesignId");

-- CreateIndex
CREATE UNIQUE INDEX "Design_activeRenderedDesignId_key" ON "Design"("activeRenderedDesignId");

-- CreateIndex
CREATE INDEX "RenderedDesign_designId_idx" ON "RenderedDesign"("designId");

-- CreateIndex
CREATE INDEX "RenderedDesign_fabricId_idx" ON "RenderedDesign"("fabricId");

-- CreateIndex
CREATE INDEX "RenderedDesign_createdById_idx" ON "RenderedDesign"("createdById");

-- CreateIndex
CREATE INDEX "RenderedDesign_status_idx" ON "RenderedDesign"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_activeRenderedDesignId_fkey" FOREIGN KEY ("activeRenderedDesignId") REFERENCES "RenderedDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenderedDesign" ADD CONSTRAINT "RenderedDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_renderedDesignId_fkey" FOREIGN KEY ("renderedDesignId") REFERENCES "RenderedDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
