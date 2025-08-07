/*
  Warnings:

  - Added the required column `name` to the `RenderedDesign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FabricStatus" AS ENUM ('PENDING_REVIEW', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Fabric" ADD COLUMN     "status" "public"."FabricStatus" DEFAULT 'PENDING_REVIEW';

-- AlterTable
ALTER TABLE "public"."RenderedDesign" ADD COLUMN     "name" TEXT NOT NULL;
