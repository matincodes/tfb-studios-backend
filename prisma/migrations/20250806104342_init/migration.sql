-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."DesignStatus" AS ENUM ('UPLOADED', 'RENDERING', 'REVIEW_PENDING', 'REVIEW_COMPLETED', 'RENDERED');

-- CreateEnum
CREATE TYPE "public"."RenderedDesignStatus" AS ENUM ('PENDING_REVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."FabricSource" AS ENUM ('PLATFORM', 'USER_UPLOAD');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "profilePicture" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "notifications" JSONB,
    "privacy" JSONB,
    "passwordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Password" (
    "id" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fabric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "composition" TEXT,
    "price" DOUBLE PRECISION,
    "source" "public"."FabricSource" NOT NULL DEFAULT 'PLATFORM',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fabric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Design" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."DesignStatus" NOT NULL DEFAULT 'UPLOADED',
    "initialFabricId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activeRenderedDesignId" TEXT,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignMetadata" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "DesignMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RenderedDesign" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "fabricId" TEXT NOT NULL,
    "imageUrl" TEXT[],
    "notes" TEXT,
    "status" "public"."RenderedDesignStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RenderedDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "fabricId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "shippingDate" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
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
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordId_key" ON "public"."User"("passwordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "public"."User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "public"."User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Design_activeRenderedDesignId_key" ON "public"."Design"("activeRenderedDesignId");

-- CreateIndex
CREATE INDEX "RenderedDesign_designId_idx" ON "public"."RenderedDesign"("designId");

-- CreateIndex
CREATE INDEX "RenderedDesign_fabricId_idx" ON "public"."RenderedDesign"("fabricId");

-- CreateIndex
CREATE INDEX "RenderedDesign_createdById_idx" ON "public"."RenderedDesign"("createdById");

-- CreateIndex
CREATE INDEX "RenderedDesign_status_idx" ON "public"."RenderedDesign"("status");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "public"."Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_designId_idx" ON "public"."Comment"("designId");

-- CreateIndex
CREATE INDEX "Comment_renderedDesignId_idx" ON "public"."Comment"("renderedDesignId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "public"."Password"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fabric" ADD CONSTRAINT "Fabric_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Design" ADD CONSTRAINT "Design_initialFabricId_fkey" FOREIGN KEY ("initialFabricId") REFERENCES "public"."Fabric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Design" ADD CONSTRAINT "Design_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Design" ADD CONSTRAINT "Design_activeRenderedDesignId_fkey" FOREIGN KEY ("activeRenderedDesignId") REFERENCES "public"."RenderedDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignMetadata" ADD CONSTRAINT "DesignMetadata_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RenderedDesign" ADD CONSTRAINT "RenderedDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RenderedDesign" ADD CONSTRAINT "RenderedDesign_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "public"."Fabric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RenderedDesign" ADD CONSTRAINT "RenderedDesign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "public"."Fabric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_renderedDesignId_fkey" FOREIGN KEY ("renderedDesignId") REFERENCES "public"."RenderedDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
